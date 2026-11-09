import { useCallback, useRef, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { create } from 'zustand';
import { Crop, ImagePlus, RotateCcw, RotateCw, Trash2, Upload, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAssets } from '../../store/assetStore';
import { useGame } from '../../store/gameStore';
import { toast } from '../../store/toastStore';
import { confirmDialog } from '../common/ConfirmDialog';
import { sfx } from '../../utils/sound';

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = ['image/jpeg', 'image/png', 'image/webp'];

interface LibState {
  open: boolean;
  purpose: string;
  resolve: ((id: string | null) => void) | null;
  cropSrc: { url: string; name: string; fromAsset?: string } | null;
}
const useLib = create<LibState>(() => ({ open: false, purpose: '', resolve: null, cropSrc: null }));

/** Opens the shared Image Library. Resolves with the chosen asset id (or null). */
export function openImageLibrary(purpose = 'Decoration') {
  return new Promise<string | null>((resolve) => useLib.setState({ open: true, purpose, resolve, cropSrc: null }));
}
/** Re-crop an existing uploaded image; resolves with a new asset id. */
export function cropAsset(assetId: string) {
  const url = useAssets.getState().urls[assetId];
  const name = useAssets.getState().assets.find((a) => a.id === assetId)?.name || 'image';
  if (!url) return Promise.resolve(null);
  return new Promise<string | null>((resolve) => useLib.setState({ open: true, purpose: 'Crop image', resolve, cropSrc: { url, name, fromAsset: assetId } }));
}

async function cropToBlob(src: string, area: Area, rotation: number): Promise<{ blob: Blob; w: number; h: number }> {
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
  const rad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad)), cos = Math.abs(Math.cos(rad));
  const bw = img.width * cos + img.height * sin;
  const bh = img.width * sin + img.height * cos;
  const big = document.createElement('canvas');
  big.width = bw;
  big.height = bh;
  const bc = big.getContext('2d')!;
  bc.translate(bw / 2, bh / 2);
  bc.rotate(rad);
  bc.drawImage(img, -img.width / 2, -img.height / 2);
  const maxSide = 1600;
  const k = Math.min(1, maxSide / Math.max(area.width, area.height));
  const out = document.createElement('canvas');
  out.width = Math.round(area.width * k);
  out.height = Math.round(area.height * k);
  out.getContext('2d')!.drawImage(big, area.x, area.y, area.width, area.height, 0, 0, out.width, out.height);
  const blob = await new Promise<Blob>((res, rej) => out.toBlob((b) => (b ? res(b) : rej(new Error('crop failed'))), 'image/png'));
  return { blob, w: out.width, h: out.height };
}

export function ImageLibraryHost() {
  const { open, purpose, resolve, cropSrc } = useLib();
  const assets = useAssets((s) => s.assets);
  const urls = useAssets((s) => s.urls);
  const add = useAssets((s) => s.add);
  const remove = useAssets((s) => s.remove);
  const fileRef = useRef<HTMLInputElement>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const close = (id: string | null) => {
    resolve?.(id);
    if (cropSrc && !cropSrc.fromAsset) URL.revokeObjectURL(cropSrc.url);
    useLib.setState({ open: false, resolve: null, cropSrc: null });
  };

  const onFile = (f?: File | null) => {
    if (!f) return;
    if (!ACCEPT.includes(f.type)) return toast('Please choose a JPG, PNG or WEBP image', 'error');
    if (f.size > MAX_BYTES) return toast('That image is over 10 MB — try a smaller one', 'error');
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setAspect(undefined);
    useLib.setState({ cropSrc: { url: URL.createObjectURL(f), name: f.name.replace(/\.[^.]+$/, '') } });
  };

  const onCropComplete = useCallback((_: Area, px: Area) => setArea(px), []);

  const saveCrop = async () => {
    if (!cropSrc || !area) return;
    setBusy(true);
    try {
      const { blob, w, h } = await cropToBlob(cropSrc.url, area, rotation);
      const id = await add(blob, cropSrc.name || 'my image', w, h);
      useGame.getState().bump('uploads');
      sfx('pop');
      toast('Saved to your Image Library ✿', 'success');
      close(id);
    } catch (e) {
      console.error(e);
      toast('Could not process that image', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={() => close(null)} title={cropSrc ? 'Crop & adjust' : 'Image Library'} jp={purpose} wide
      footer={cropSrc ? (
        <>
          <button className="btn-cream" onClick={() => (cropSrc.fromAsset ? close(null) : useLib.setState({ cropSrc: null }))}>Back</button>
          <button className="btn-deep" disabled={busy} onClick={saveCrop}><Check size={16} />{busy ? 'Saving…' : 'Use this image'}</button>
        </>
      ) : undefined}>
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ''; }} />
      {cropSrc ? (
        <div className="flex flex-col gap-3">
          <div className="relative h-[46vh] min-h-[260px] overflow-hidden rounded-2xl bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22><rect width=%2210%22 height=%2210%22 fill=%22%23f3ece2%22/><rect x=%2210%22 y=%2210%22 width=%2210%22 height=%2210%22 fill=%22%23f3ece2%22/></svg>')]">
            <Cropper image={cropSrc.url} crop={crop} zoom={zoom} rotation={rotation} aspect={aspect} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} objectFit="contain" restrictPosition={false} minZoom={0.5} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[['Free', undefined], ['1:1', 1], ['4:5', 4 / 5], ['4:3', 4 / 3], ['16:9', 16 / 9]].map(([l, a]) => (
              <button key={l as string} className={`chip ${aspect === a ? '!bg-strawberry' : ''}`} onClick={() => setAspect(a as number | undefined)}>{l as string}</button>
            ))}
            <span className="flex-1" />
            <button className="btn-icon" onClick={() => setRotation((r) => r - 90)} aria-label="Rotate left"><RotateCcw size={16} /></button>
            <button className="btn-icon" onClick={() => setRotation((r) => r + 90)} aria-label="Rotate right"><RotateCw size={16} /></button>
          </div>
          <label className="flex items-center gap-3 text-xs font-bold">Zoom<input type="range" min={0.5} max={4} step={0.01} value={zoom} onChange={(e) => setZoom(+e.target.value)} className="flex-1" /></label>
          <label className="flex items-center gap-3 text-xs font-bold">Rotate<input type="range" min={-180} max={180} step={1} value={rotation} onChange={(e) => setRotation(+e.target.value)} className="flex-1" /></label>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <button className="paper stitch flex w-full flex-col items-center gap-2 border-2 border-dashed border-strawberry px-4 py-6 text-center transition hover:bg-[#FFF0F4]"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }}>
            <span className="grid h-14 w-14 place-items-center rounded-full bg-strawberry text-white shadow-soft"><Upload size={26} /></span>
            <span className="font-display text-base">Upload a photo</span>
            <span className="text-xs text-cocoa">JPG, PNG or WEBP · up to 10 MB · tap to open your camera roll</span>
          </button>
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold"><ImagePlus size={16} /> My images ({assets.length})</h3>
            {assets.length === 0 ? (
              <p className="rounded-2xl bg-cream px-4 py-6 text-center text-sm text-cocoa">No images yet — upload one and it can be reused in every mode.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {assets.map((a) => (
                  <div key={a.id} className="group relative">
                    <button className="tile aspect-square w-full overflow-hidden !p-0" onClick={() => { sfx('pop'); close(a.id); }} title={`Use ${a.name}`}>
                      <img src={urls[a.id]} alt={a.name} className="h-full w-full object-cover" loading="lazy" />
                    </button>
                    <div className="absolute right-1 top-1 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                      <button className="grid h-7 w-7 place-items-center rounded-full bg-white/90 shadow" aria-label="Crop" onClick={async () => { const id = await cropAsset(a.id); if (id) toast('Cropped copy saved', 'success'); useLib.setState({ open: true, resolve, cropSrc: null, purpose }); }}><Crop size={13} /></button>
                      <button className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-strawberry-dark shadow" aria-label="Delete" onClick={async () => { if (await confirmDialog('Delete image?', 'It will be removed from the library. Items already using it will show an empty frame.', 'Delete')) remove(a.id); }}><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
