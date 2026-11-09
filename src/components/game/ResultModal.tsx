import { useEffect, useState, type RefObject } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, Copy, Download, Heart, Home, PenLine, Store, Plus } from 'lucide-react';
import { Modal } from '../common/Modal';
import { SparkleBurst } from '../common/Sparkles';
import type { Creation, CreationData, CreationType } from '../../types';
import { svgToBlob, creationCard } from '../../utils/exportImage';
import { useCollection } from '../../store/collectionStore';
import { useGame } from '../../store/gameStore';
import { useCafe } from '../../store/cafeStore';
import { toast } from '../../store/toastStore';
import { downloadBlob, safeName } from '../../utils/misc';
import { sfx } from '../../utils/sound';

interface Props {
  open: boolean;
  onClose: () => void;
  svgRef: RefObject<SVGSVGElement | null>;
  size: { w: number; h: number };
  type: CreationType;
  defaultName: string;
  ingredients: string[];
  data: CreationData;
  editingId?: string | null;
  isRecipe?: boolean;
  season?: string | null;
  onSaved?: (c: Creation) => void;
  onNew?: () => void;
}

export function ResultModal({ open, onClose, svgRef, size, type, defaultName, ingredients, data, editingId, isRecipe, season, onSaved, onNew }: Props) {
  const [preview, setPreview] = useState<{ blob: Blob; url: string } | null>(null);
  const [name, setName] = useState(defaultName);
  const [saved, setSaved] = useState<Creation | null>(null);
  const [busy, setBusy] = useState(false);
  const save = useCollection((s) => s.save);
  const duplicate = useCollection((s) => s.duplicate);
  const nav = useNavigate();
  const existing = useCollection((s) => (editingId ? s.get(editingId) : undefined));

  useEffect(() => {
    if (!open) return;
    setSaved(null);
    setName(existing?.name || defaultName);
    let alive = true;
    (async () => {
      const el = svgRef.current;
      if (!el) return;
      await new Promise((r) => setTimeout(r, 450)); // let landing animations settle
      try {
        const blob = await svgToBlob(el, { width: Math.round(size.w * 1.5), height: Math.round(size.h * 1.5) });
        if (alive) setPreview({ blob, url: URL.createObjectURL(blob) });
      } catch (e) {
        console.error(e);
        toast('Preview failed — try again', 'error');
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview.url); }, [preview]);
  useEffect(() => { if (preview && open) { sfx('success'); setTimeout(() => sfx('cheer'), 250); } }, [preview, open]);

  const doSave = async (asNew = false) => {
    if (!preview) return;
    setBusy(true);
    try {
      const c = await save({ id: asNew ? undefined : editingId || undefined, name: name.trim() || defaultName, type, ingredients, data: structuredClone(data), previewW: size.w * 1.5, previewH: size.h * 1.5, isRecipe, season }, preview.blob);
      setSaved(c);
      sfx('coin');
      setTimeout(() => sfx('stamp'), 120);
      const g = useGame.getState();
      if (asNew || !editingId) {
        g.bump(type === 'cafe' ? 'cafe' : type);
        g.earn(10, `${c.name} saved`);
        if (isRecipe) {
          g.bump('recipes');
          setTimeout(() => g.earn(10, 'Perfect recipe bonus'), 600);
        }
      } else toast('Creation updated ✿', 'success');
      onSaved?.(c);
    } finally {
      setBusy(false);
    }
  };

  const exportCard = async () => {
    if (!preview) return;
    const blob = await creationCard(preview.url, name || defaultName, type, ingredients);
    downloadBlob(blob, `${safeName(name)}-yumi-cafe.png`);
    useGame.getState().bump('exports');
    sfx('shutter');
  };

  return (
    <Modal open={open} onClose={onClose} title={saved ? 'Saved to your collection!' : 'Ta-da! Your creation'} jp={saved ? 'コレクションに保存しました' : 'できあがり'} wide>
      <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
        <div className="relative grid place-items-center rounded-3xl bg-strawberry-drip p-4" style={{ minHeight: 280 }}>
          <div className="bg-strawberry-drip absolute inset-0 rounded-3xl" />
          <div className="absolute inset-0 overflow-hidden rounded-3xl" aria-hidden>
            <div className="sunburst anim-sun absolute left-1/2 top-1/2 h-[170%] w-[170%] -translate-x-1/2 -translate-y-1/2 opacity-60" style={{ aspectRatio: '1 / 1' }} />
            <div className="absolute inset-2 rounded-[22px] border-2 border-dashed border-white/80" />
          </div>
          <motion.div initial={{ scale: 3, opacity: 0, rotate: -30 }} animate={{ scale: 1, opacity: 1, rotate: -12 }} transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 14 }}
            className="badge-round absolute right-3 top-3 z-10 h-[62px] w-[62px] shrink-0 aspect-square text-[11px]" aria-hidden>{saved ? <>保存<br />ずみ</> : <>できた<br />♡</>}</motion.div>
          {preview ? (
            <motion.img key={preview.url} src={preview.url} alt="Your creation" className="relative max-h-[46vh] w-auto drop-shadow-xl" initial={{ scale: 0.6, rotate: -6, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 12 }} />
          ) : (
            <div className="relative animate-pulse font-display text-sm text-cocoa">Plating it beautifully…</div>
          )}
          {preview && <SparkleBurst />}
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold">Name your creation
            <input className="input mt-1" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} />
          </label>
          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1.5">{ingredients.slice(0, 12).map((i) => <span key={i} className="chip">{i}</span>)}</div>
          )}
          {isRecipe && <div className="rounded-2xl bg-matcha/40 px-3 py-2 text-xs font-bold text-matcha-dark">✓ Followed the recipe perfectly — bonus stars!</div>}
          {!saved ? (
            <div className="flex flex-wrap gap-2">
              <button className="btn-deep flex-1" disabled={!preview || busy} onClick={() => doSave(false)}><Heart size={16} />{editingId ? 'Update creation' : 'Save to collection'}</button>
              {editingId && <button className="btn-pink" disabled={!preview || busy} onClick={() => doSave(true)}><Plus size={16} />Save as new</button>}
              <button className="btn-cream" onClick={onClose}><PenLine size={16} />Keep editing</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {type !== 'cafe' && <button className="btn-matcha" onClick={() => { useCafe.getState().addDisplay(saved.id, saved.previewW, saved.previewH); toast('Displayed in your café ✿', 'success'); nav('/cafe'); }}><Store size={16} />Display in café</button>}
              <button className="btn-sky" onClick={() => nav(`/photo?creation=${saved.id}`)}><Camera size={16} />Photo Studio</button>
              <button className="btn-butter" onClick={exportCard}><Download size={16} />Export card PNG</button>
              <button className="btn-cream" onClick={() => { if (preview) { downloadBlob(preview.blob, `${safeName(name)}.png`); sfx('shutter'); } }}><Download size={16} />Transparent PNG</button>
              <button className="btn-cream" onClick={async () => { const c = await duplicate(saved.id); if (c) toast(`Duplicated as “${c.name}”`, 'success'); }}><Copy size={16} />Duplicate</button>
              <button className="btn-cream" onClick={onClose}><PenLine size={16} />Edit again</button>
              {onNew && <button className="btn-pink" onClick={() => { onClose(); onNew(); }}><Plus size={16} />Make another</button>}
              <button className="btn-cream" onClick={() => nav('/collection')}><Home size={16} />Collection</button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
