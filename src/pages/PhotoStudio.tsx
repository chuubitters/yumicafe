import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Download, Frame, ImagePlus, LayoutTemplate, Palette, Redo2, Trash2, Undo2 } from 'lucide-react';
import { Stage } from '../components/game/Stage';
import { ItemsLayer } from '../components/game/StageItems';
import { ItemToolbar } from '../components/game/ItemToolbar';
import { DecorPanel } from '../components/game/DecorPanel';
import { makeItem } from '../components/game/itemUtils';
import { openImageLibrary } from '../components/game/ImageLibrary';
import { Modal } from '../components/common/Modal';
import { confirmDialog } from '../components/common/ConfirmDialog';
import { useHistory } from '../hooks/useHistory';
import { useAssets } from '../store/assetStore';
import { useCollection } from '../store/collectionStore';
import { useGame, useUnlocked } from '../store/gameStore';
import { PHOTO_BACKGROUNDS, PHOTO_TEMPLATES } from '../data/catalog';
import type { StageItem } from '../types';
import type { DragPayload } from '../components/game/dnd';
import { svgToBlob } from '../utils/exportImage';
import { downloadBlob, uid } from '../utils/misc';
import { sfx } from '../utils/sound';
import { toast } from '../store/toastStore';
import { ModeFrame, TitleBlock, Stamp } from '../components/common/PosterTitle';
import { Glyph, type GlyphName } from '../components/common/Glyph';

interface Project {
  template: string;
  w: number;
  h: number;
  bg: string; // background id or 'image'
  bgAsset?: string | null;
  frame: string;
  items: StageItem[];
}
const KEY = 'yumi-photo-project';
const FRAMES = ['none', 'polaroid', 'lace', 'washi', 'menu', 'film'];

const blank = (t = 'portrait'): Project => {
  const tp = PHOTO_TEMPLATES.find((x) => x.id === t)!;
  return { template: t, w: tp.w, h: tp.h, bg: 'pink', bgAsset: null, frame: 'none', items: [] };
};

function presetItems(t: string, w: number, h: number): Partial<Project> {
  const T = (text: string, x: number, y: number, hh: number, extra: Partial<StageItem> = {}): StageItem => ({ id: uid('t'), kind: 'text', ref: 'text', text, x, y, w: Math.max(hh, text.length * hh * 0.62), h: hh, rotation: 0, font: 'display', color: '#5E4535', stroke: '#FFFFFF', shadow: true, ...extra });
  const S = (ref: string, x: number, y: number, size: number, extra: Partial<StageItem> = {}): StageItem => ({ ...(makeItem({ type: 'sprite', ref }, x, y, size) as StageItem), ...extra });
  if (t === 'scrapbook') return { bg: 'kraft', frame: 'none', items: [S('washi-pink', w * 0.3, h * 0.12, 260, { rotation: -8 }), S('washi-green', w * 0.72, h * 0.86, 260, { rotation: 6 }), T('my sweet diary', w / 2, h * 0.2, 70, { font: 'body', color: '#C9566F' }), S('sakura', w * 0.85, h * 0.18, 110), S('heart', w * 0.14, h * 0.82, 100)] };
  if (t === 'menu') return { bg: 'matcha', frame: 'menu', items: [S('tag-limited', w * 0.13, h * 0.3, 380), T('Sweets Fair', w / 2, h * 0.12, 90, { color: '#4F6B3A' }), S('tag-price', w * 0.78, h * 0.78, 220), S('tag-new', w * 0.85, h * 0.26, 150)] };
  if (t === 'story') return { bg: 'sky', frame: 'none', items: [T('today’s café', w / 2, h * 0.1, 90), S('cloud', w * 0.2, h * 0.2, 200), S('sparkle', w * 0.82, h * 0.86, 120)] };
  return { items: [] };
}

function Background({ p, url }: { p: Project; url?: string }) {
  const b = PHOTO_BACKGROUNDS.find((x) => x.id === p.bg);
  const { w, h } = p;
  if (p.bg === 'image' && url) return <image href={url} x="0" y="0" width={w} height={h} preserveAspectRatio="xMidYMid slice" />;
  if (!b) return <rect width={w} height={h} fill="#FFF8ED" />;
  const grad = (
    <defs>
      <linearGradient id="ps-bg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={b.color} /><stop offset="1" stopColor={b.color2} /></linearGradient>
      <pattern id="ps-ging" width="80" height="80" patternUnits="userSpaceOnUse"><rect width="80" height="80" fill="#fff" /><rect width="40" height="80" fill={b.color2} opacity=".4" /><rect width="80" height="40" fill={b.color2} opacity=".4" /></pattern>
      <pattern id="ps-sak" width="140" height="140" patternUnits="userSpaceOnUse"><rect width="140" height="140" fill={b.color} />{[[35, 35, 1], [105, 105, 0.7]].map(([x, y, s], i) => <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} rx="9" ry="15" cy="-13" fill={b.color2} transform={`rotate(${a})`} />)}<circle r="5" fill="#F27D9B" /></g>)}</pattern>
      <pattern id="ps-dots" width="54" height="54" patternUnits="userSpaceOnUse"><circle cx="27" cy="27" r="7" fill="#fff" opacity=".55" /></pattern>
    </defs>
  );
  return (
    <g>
      {grad}
      <rect width={w} height={h} fill={b.id === 'gingham' ? 'url(#ps-ging)' : b.id === 'sakura' ? 'url(#ps-sak)' : 'url(#ps-bg)'} />
      {['pink', 'matcha', 'butter', 'sky'].includes(b.id) && <rect width={w} height={h} fill="url(#ps-dots)" />}
      {b.id === 'kraft' && <rect width={w} height={h} fill={b.color} filter="url(#yc-grain)" opacity=".8" />}
      {b.id === 'washi' && Array.from({ length: 60 }).map((_, i) => <path key={i} d={`M${(i * 97) % w} ${(i * 53) % h} q20 ${(i % 5) - 2} 40 ${(i % 3) - 1}`} stroke={b.color2} strokeWidth="2" fill="none" opacity=".6" />)}
      {b.id === 'night' && Array.from({ length: 70 }).map((_, i) => <circle key={i} className={i % 4 ? '' : 'anim-twinkle'} cx={(i * 137) % w} cy={(i * 251) % h} r={1.5 + (i % 3)} fill="#FFF6C9" />)}
      {b.id === 'cocoa' && Array.from({ length: 30 }).map((_, i) => <path key={i} transform={`translate(${(i * 157) % w} ${(i * 211) % h}) scale(1.4)`} d="M0 -8 L2 -2 L8 -2 L3 2 L5 8 L0 4 L-5 8 L-3 2 L-8 -2 L-2 -2Z" fill="#fff" opacity=".1" />)}
    </g>
  );
}

function FrameOverlay({ p }: { p: Project }) {
  const { w, h } = p;
  const m = Math.min(w, h) * 0.05;
  switch (p.frame) {
    case 'polaroid':
      return <path fillRule="evenodd" d={`M0 0H${w}V${h}H0Z M${m} ${m}H${w - m}V${h - m * 4}H${m}Z`} fill="#FFFDF8" />;
    case 'lace':
      return (
        <g>
          <path fillRule="evenodd" d={`M0 0H${w}V${h}H0Z M${m} ${m}H${w - m}V${h - m}H${m}Z`} fill="#FFFFFF" />
          {Array.from({ length: Math.ceil(w / 40) }).map((_, i) => <g key={i}><circle cx={i * 40 + 20} cy={m} r="16" fill="#fff" /><circle cx={i * 40 + 20} cy={h - m} r="16" fill="#fff" /></g>)}
          {Array.from({ length: Math.ceil(h / 40) }).map((_, i) => <g key={`v${i}`}><circle cx={m} cy={i * 40 + 20} r="16" fill="#fff" /><circle cx={w - m} cy={i * 40 + 20} r="16" fill="#fff" /></g>)}
          <rect x={m + 22} y={m + 22} width={w - m * 2 - 44} height={h - m * 2 - 44} fill="none" stroke="#F7B8C8" strokeWidth="5" strokeDasharray="14 10" />
        </g>
      );
    case 'washi':
      return (
        <g opacity=".85">
          {[[0, 0, -40], [w, 0, 40], [0, h, 40], [w, h, -40]].map(([x, y, r], i) => <rect key={i} x={-130} y={-30} width="260" height="60" fill={['#F7B8C8', '#B9CBA5', '#F6E5A9', '#C9E2EF'][i]} transform={`translate(${x} ${y}) rotate(${r})`} />)}
        </g>
      );
    case 'menu':
      return (
        <g>
          <rect x={m} y={m} width={w - m * 2} height={h - m * 2} fill="none" stroke="#FFFFFF" strokeWidth="10" />
          <rect x={m + 20} y={m + 20} width={w - m * 2 - 40} height={h - m * 2 - 40} fill="none" stroke="#FFFFFF" strokeWidth="3" />
          <rect x={0} y={h - 70} width={w} height="70" fill="#5E4535" />
          <text x={w / 2} y={h - 25} textAnchor="middle" fontFamily='"Mochiy Pop One", Mali' fontSize="30" fill="#F6E5A9">YUMI CAFÉ ・ 甘味処</text>
        </g>
      );
    case 'film':
      return (
        <g>
          <path fillRule="evenodd" d={`M0 0H${w}V${h}H0Z M${m * 1.6} ${m}H${w - m * 1.6}V${h - m}H${m * 1.6}Z`} fill="#2B2B2B" />
          {Array.from({ length: Math.floor(h / 70) }).map((_, i) => <g key={i}><rect x={m * 0.4} y={i * 70 + 20} width={m * 0.7} height="36" rx="6" fill="#FFF8ED" /><rect x={w - m * 1.1} y={i * 70 + 20} width={m * 0.7} height="36" rx="6" fill="#FFF8ED" /></g>)}
        </g>
      );
    default:
      return null;
  }
}

export default function PhotoStudio() {
  const h = useHistory<Project>(() => {
    try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch { /* ignore */ }
    return blank();
  });
  const p = h.state;
  const [sel, setSel] = useState<string | null>(null);
  const [tab, setTab] = useState<'template' | 'bg' | 'frame' | 'decor'>('decor');
  const [flash, setFlash] = useState(false);
  const [art, setArt] = useState<{ url: string; blob: Blob; ext: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [custom, setCustom] = useState({ w: 1200, h: 900 });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const bgUrl = useAssets((s) => (p.bgAsset ? s.urls[p.bgAsset] : undefined));
  const isUnlocked = useUnlocked();
  const [params, setParams] = useSearchParams();

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* quota */ } }, [p]);
  useEffect(() => {
    const cid = params.get('creation');
    if (!cid) return;
    const c = useCollection.getState().get(cid);
    if (c) {
      const it = makeItem({ type: 'creation', ref: cid }, p.w / 2, p.h * 0.55, Math.min(p.w, p.h) * 0.7);
      if (it) { h.set({ ...p, items: [...p.items, it] }); setSel(it.id); }
    }
    params.delete('creation');
    setParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setItems = (items: StageItem[]) => h.set({ ...p, items });
  const onDrop = (pl: DragPayload, x: number, y: number) => {
    const base = Math.min(p.w, p.h);
    const it = makeItem(pl, x, y, pl.type === 'creation' ? base * 0.55 : pl.type === 'image' ? base * 0.45 : pl.type === 'text' ? base * 0.35 : base * 0.18);
    if (!it) return;
    setItems([...p.items, it]);
    setSel(it.id);
    sfx('pop');
  };
  const addAt = (pl: DragPayload) => onDrop(pl, p.w / 2 + (Math.random() - 0.5) * p.w * 0.3, p.h / 2 + (Math.random() - 0.5) * p.h * 0.3);

  const applyTemplate = async (id: string) => {
    if (p.items.length && !(await confirmDialog('Switch template?', 'Your elements stay, and the template’s decorations are added.', 'Switch'))) return;
    const t = PHOTO_TEMPLATES.find((x) => x.id === id)!;
    const w = id === 'custom' ? custom.w : t.w;
    const hh = id === 'custom' ? custom.h : t.h;
    const scaleX = w / p.w, scaleY = hh / p.h;
    const moved = p.items.map((it) => ({ ...it, x: it.x * scaleX, y: it.y * scaleY }));
    const pre = presetItems(id, w, hh);
    h.set({ ...p, template: id, w, h: hh, bg: pre.bg || p.bg, frame: pre.frame || p.frame, items: [...moved, ...(pre.items || [])] });
    sfx('sparkle');
  };

  const capture = async (type: 'image/png' | 'image/jpeg') => {
    if (!svgRef.current) return;
    setSel(null);
    setBusy(true);
    sfx('shutter');
    setFlash(true);
    setTimeout(() => setFlash(false), 450);
    await new Promise((r) => setTimeout(r, 120));
    try {
      const blob = await svgToBlob(svgRef.current, { width: p.w, height: p.h, type, background: type === 'image/jpeg' ? '#FFF8ED' : null });
      setArt({ url: URL.createObjectURL(blob), blob, ext: type === 'image/png' ? 'png' : 'jpg' });
      const g = useGame.getState();
      g.bump('photos');
      g.bump('exports');
    } catch (e) {
      console.error(e);
      toast('Export failed — try again', 'error');
    } finally {
      setBusy(false);
    }
  };

  const tabs = [
    { id: 'decor', label: 'Elements', icon: <ImagePlus size={14} /> },
    { id: 'template', label: 'Template', icon: <LayoutTemplate size={14} /> },
    { id: 'bg', label: 'Background', icon: <Palette size={14} /> },
    { id: 'frame', label: 'Frame', icon: <Frame size={14} /> },
  ] as const;

  return (
    <ModeFrame mode="photo" className="mx-auto flex max-w-[1500px] flex-col gap-3 px-3 py-3 md:px-5">
      <header className="flex flex-wrap items-start gap-3">
        <div className="min-w-[220px] flex-1">
          <TitleBlock small title="Photo Studio" jp="フォトスタジオ" subtitle={<>Compose your creations into shareable artwork · {PHOTO_TEMPLATES.find((t) => t.id === p.template)?.name} {p.w}×{p.h}</>} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-icon" onClick={h.undo} disabled={!h.canUndo} aria-label="Undo"><Undo2 size={16} /></button>
          <button className="btn-icon" onClick={h.redo} disabled={!h.canRedo} aria-label="Redo"><Redo2 size={16} /></button>
          <button className="btn-cream" onClick={async () => { if (await confirmDialog('Clear canvas?', 'Remove all elements from this artwork?', 'Clear')) h.set({ ...p, items: [] }); }}><Trash2 size={16} /></button>
          <button className="btn-deep" disabled={busy} onClick={() => capture('image/png')}><Camera size={16} />Export PNG</button>
          <button className="btn-butter" disabled={busy} onClick={() => capture('image/jpeg')}>JPG</button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="studio-stage relative flex min-w-0 flex-col gap-2">
          <div className="rounded-[28px] bg-[#EFE4D6] p-3 shadow-inner">
            <Stage ref={svgRef} width={p.w} height={p.h} onDrop={onDrop} maxHeight="var(--stage-max-h)" ariaLabel="Artwork canvas"
              onPointerDown={(_e, _pt, onItem) => { if (!onItem) setSel(null); }}>
              <Background p={p} url={bgUrl} />
              <ItemsLayer items={p.items} selectedId={sel} onSelect={setSel} onLive={(items) => h.setLive({ ...p, items })} onCommit={h.commitLive}
                onDelete={(id) => { setItems(p.items.filter((x) => x.id !== id)); setSel(null); }} minSize={20} />
              <g pointerEvents="none"><FrameOverlay p={p} /></g>
            </Stage>
          </div>
          <AnimatePresence>{flash && <motion.div className="pointer-events-none fixed inset-0 z-[90] bg-white" initial={{ opacity: 0.95 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} />}</AnimatePresence>
          <ItemToolbar items={p.items} selectedId={sel} setItems={setItems} onSelect={setSel} />
        </section>

        <aside className="paper flex min-w-0 flex-col gap-3 p-4 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)] lg:self-start lg:overflow-y-auto">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
            {tabs.map((t) => <button key={t.id} onClick={() => setTab(t.id)} className={`chip shrink-0 ${tab === t.id ? '!border-strawberry-deep !bg-strawberry' : ''}`}>{t.icon}{t.label}</button>)}
          </div>
          {tab === 'decor' && <DecorPanel onAdd={addAt} showCreations items={p.items} selectedId={sel} onSelect={setSel} extraTabs={[]} />}
          {tab === 'template' && (
            <div className="flex flex-col gap-2">
              {PHOTO_TEMPLATES.map((t) => (
                <button key={t.id} onClick={() => applyTemplate(t.id)} className={`tile flex-row !justify-start gap-3 px-3 ${p.template === t.id ? 'tile-on' : ''}`}>
                  <span className="grid h-12 w-12 place-items-center"><span className="block rounded border-2 border-cocoa-light bg-cream" style={{ width: 40 * Math.min(1, t.w / t.h), height: 40 * Math.min(1, t.h / t.w) }} /></span>
                  <span className="text-left"><span className="block text-sm">{t.name}</span><span className="text-[10px] font-normal">{t.id === 'custom' ? `${custom.w} × ${custom.h}` : `${t.w} × ${t.h}`}</span></span>
                </button>
              ))}
              <div className="flex items-center gap-2 text-xs font-bold">Custom
                <input type="number" className="input !w-24 !py-1.5" min={300} max={3000} value={custom.w} onChange={(e) => setCustom({ ...custom, w: Math.max(300, Math.min(3000, +e.target.value || 300)) })} aria-label="Custom width" />×
                <input type="number" className="input !w-24 !py-1.5" min={300} max={3000} value={custom.h} onChange={(e) => setCustom({ ...custom, h: Math.max(300, Math.min(3000, +e.target.value || 300)) })} aria-label="Custom height" />
              </div>
            </div>
          )}
          {tab === 'bg' && (
            <div className="flex flex-col gap-3">
              <div className="tile-grid">
                {PHOTO_BACKGROUNDS.map((b) => {
                  const locked = !!b.lock && !isUnlocked(b.lock);
                  return (
                    <button key={b.id} disabled={locked} onClick={() => h.set({ ...p, bg: b.id })} className={`tile ${p.bg === b.id ? 'tile-on' : ''} ${locked ? 'tile-locked' : ''}`}>
                      <span className="h-9 w-12 rounded-lg border-2 border-white shadow" style={{ background: `linear-gradient(${b.color}, ${b.color2})` }} />
                      <span className="text-[10px]">{b.name}{locked && <Glyph name="lock" className="ml-0.5" />}</span>
                    </button>
                  );
                })}
              </div>
              <button className="btn-pink" onClick={async () => { const id = await openImageLibrary('Background photo'); if (id) h.set({ ...p, bg: 'image', bgAsset: id }); }}><ImagePlus size={16} />Use my photo as background</button>
            </div>
          )}
          {tab === 'frame' && (
            <div className="tile-grid">
              {FRAMES.map((f) => <button key={f} onClick={() => h.set({ ...p, frame: f })} className={`tile capitalize ${p.frame === f ? 'tile-on' : ''}`}><Frame size={20} />{f}</button>)}
            </div>
          )}
        </aside>
      </div>

      <Modal open={!!art} onClose={() => { if (art) URL.revokeObjectURL(art.url); setArt(null); }} title="Your artwork is ready!" jp="できあがり" wide
        footer={<>
          <button className="btn-cream" onClick={() => { if (art) URL.revokeObjectURL(art.url); setArt(null); }}>Keep editing</button>
          <button className="btn-deep" onClick={() => art && downloadBlob(art.blob, `yumi-cafe-${p.template}-${Date.now()}.${art.ext}`)}><Download size={16} />Save to device</button>
          {typeof navigator !== 'undefined' && 'canShare' in navigator && art && (
            <button className="btn-sky" onClick={async () => {
              try {
                const file = new File([art.blob], `yumi-cafe.${art.ext}`, { type: art.blob.type });
                if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: 'YUMI CAFÉ' });
                else toast('Sharing is not supported here — use Save', 'info');
              } catch { /* cancelled */ }
            }}>Share</button>
          )}
        </>}>
        {art && (
          <motion.div initial={{ scale: 0.8, rotate: -4, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 13 }} className="grid place-items-center">
            <img src={art.url} alt="Exported artwork" className="max-h-[60vh] w-auto rounded-xl border-8 border-white shadow-card" />
            <p className="mt-2 text-xs text-cocoa">{p.w} × {p.h} {art.ext.toUpperCase()} · {(art.blob.size / 1024).toFixed(0)} KB</p>
          </motion.div>
        )}
      </Modal>
    </ModeFrame>
  );
}
