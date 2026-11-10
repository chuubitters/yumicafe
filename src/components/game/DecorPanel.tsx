import { useState, type ReactNode } from 'react';
import { ImagePlus, Lock, Type, Layers, Sparkles, Image as ImageIcon, CakeSlice } from 'lucide-react';
import { STICKER_GROUPS } from '../../data/catalog';
import { SpriteThumb } from '../../art/sprites';
import { useAssets } from '../../store/assetStore';
import { useCollection } from '../../store/collectionStore';
import { useUnlocked } from '../../store/gameStore';
import { useTrayDrag, type DragPayload } from './dnd';
import { openImageLibrary } from './ImageLibrary';
import type { StageItem } from '../../types';
import { SPRITES } from '../../art/sprites';
import { Link } from 'react-router-dom';
import { Glyph, type GlyphName } from '../common/Glyph';

export function TrayTile({ payload, preview, onAdd, label, locked, active, size = 'md', fluid }: { fluid?: boolean; payload: DragPayload; preview: ReactNode; onAdd: (p: DragPayload) => void; label?: string; locked?: boolean; active?: boolean; size?: 'sm' | 'md' }) {
  const h = useTrayDrag(payload, preview, () => onAdd(payload), locked);
  return (
    <button {...h} type="button" disabled={locked} title={label}
      className={`tile shrink-0 ${size === 'sm' ? 'min-h-[76px] w-full min-w-[64px]' : fluid ? 'min-h-[76px] w-full min-w-[78px]' : 'min-h-[76px] w-[76px]'} ${locked ? 'tile-locked' : ''} ${active ? 'tile-on' : ''}`}>
      <span className="pointer-events-none grid flex-1 place-items-center">{preview}</span>
      {label && <span className="pointer-events-none line-clamp-2 w-full text-center text-[10px] leading-tight [overflow-wrap:normal]">{label}</span>}
      {locked && <Lock size={14} className="absolute right-1 top-1 text-cocoa" />}
    </button>
  );
}

interface DecorPanelProps {
  onAdd: (p: DragPayload) => void;
  extraTabs?: { id: string; label: string; icon: ReactNode; content: ReactNode }[];
  showCreations?: boolean;
  groups?: string[];
  items?: StageItem[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export function DecorPanel({ onAdd, extraTabs = [], showCreations, groups, items, selectedId, onSelect }: DecorPanelProps) {
  const [tab, setTab] = useState(extraTabs[0]?.id || 'stickers');
  const [group, setGroup] = useState((groups || STICKER_GROUPS.map((g) => g.id))[0]);
  const assets = useAssets((s) => s.assets);
  const urls = useAssets((s) => s.urls);
  const creations = useCollection((s) => s.creations);
  const previews = useCollection((s) => s.previews);
  const isUnlocked = useUnlocked();
  const [text, setText] = useState('Sweet day');

  const tabs = [
    ...extraTabs.map((t) => ({ id: t.id, label: t.label, icon: t.icon })),
    { id: 'stickers', label: 'Stickers', icon: <Sparkles size={14} /> },
    { id: 'images', label: 'My photos', icon: <ImageIcon size={14} /> },
    { id: 'text', label: 'Text', icon: <Type size={14} /> },
    ...(showCreations ? [{ id: 'creations', label: 'Creations', icon: <CakeSlice size={14} /> }] : []),
    ...(items ? [{ id: 'layers', label: 'Layers', icon: <Layers size={14} /> }] : []),
  ];
  const visibleGroups = STICKER_GROUPS.filter((g) => !groups || groups.includes(g.id));

  return (
    <div className="flex min-h-0 flex-col gap-2">
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`chip shrink-0 ${tab === t.id ? '!border-strawberry-deep !bg-strawberry text-[#7A2E43]' : ''}`}>{t.icon}{t.label}</button>
        ))}
      </div>
      {extraTabs.map((t) => tab === t.id && <div key={t.id}>{t.content}</div>)}
      {tab === 'stickers' && (
        <>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {visibleGroups.map((g) => (
              <button key={g.id} onClick={() => setGroup(g.id)} className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${group === g.id ? 'bg-cocoa text-white' : 'bg-white/70 text-cocoa'}`}>
                {g.name}{g.lock && !isUnlocked(g.lock) && <Glyph name="lock" className="ml-0.5" />}
              </button>
            ))}
          </div>
          {(() => {
            const g = visibleGroups.find((x) => x.id === group) || visibleGroups[0];
            const locked = !!g.lock && !isUnlocked(g.lock);
            return (
              <>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(78px,1fr))] gap-2">
                  {g.items.map((s) => (
                    <TrayTile fluid key={s} payload={{ type: 'sprite', ref: s }} preview={<SpriteThumb id={s} size={42} />} label={SPRITES[s]?.name} onAdd={onAdd} locked={locked} />
                  ))}
                </div>
                {locked && <Link to="/shop" className="text-center text-xs font-bold text-strawberry-deep underline">Unlock “{g.name}” in the Shop</Link>}
              </>
            );
          })()}
          <p className="text-[11px] text-cocoa">Tip: tap to add, or drag onto your creation (on touch: press & hold, then drag).</p>
        </>
      )}
      {tab === 'images' && (
        <>
          <button className="btn-pink w-full" onClick={async () => { const id = await openImageLibrary('Add a photo decoration'); if (id) onAdd({ type: 'image', ref: id }); }}>
            <ImagePlus size={16} /> Upload / choose image
          </button>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(78px,1fr))] gap-2">
            {assets.map((a) => (
              <TrayTile fluid key={a.id} payload={{ type: 'image', ref: a.id }} onAdd={onAdd} preview={<img src={urls[a.id]} alt="" className="h-12 w-12 rounded-lg object-cover" draggable={false} />} />
            ))}
          </div>
          {!assets.length && <p className="text-xs text-cocoa">Your uploaded images appear here and can be reused everywhere.</p>}
        </>
      )}
      {tab === 'text' && (
        <div className="flex flex-col gap-2">
          <input className="input" value={text} onChange={(e) => setText(e.target.value)} maxLength={40} aria-label="New text" />
          <div className="flex flex-wrap gap-2">
            <button className="btn-pink btn-sm" onClick={() => onAdd({ type: 'text', ref: 'text', data: { text, font: 'display' } })}>+ Pop text</button>
            <button className="btn-matcha btn-sm" onClick={() => onAdd({ type: 'text', ref: 'text', data: { text, font: 'jp', color: '#4F6B3A' } })}>+ Maru text</button>
            <button className="btn-butter btn-sm" onClick={() => onAdd({ type: 'text', ref: 'text', data: { text, font: 'body', color: '#C9566F' } })}>+ Round text</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['期間限定', 'おいしい', 'いちごミルク', 'NEW!', 'Sweet day', '¥480'].map((t) => (
              <button key={t} className="chip" onClick={() => onAdd({ type: 'text', ref: 'text', data: { text: t, font: /[a-z]/i.test(t) ? 'display' : 'jp' } })}>{t}</button>
            ))}
          </div>
        </div>
      )}
      {tab === 'creations' && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(78px,1fr))] gap-2">
          {creations.filter((c) => c.type !== 'cafe').map((c) => (
            <TrayTile fluid key={c.id} payload={{ type: 'creation', ref: c.id }} onAdd={onAdd} label={c.name} preview={previews[c.id] ? <img src={previews[c.id]} alt="" className="h-12 w-12 object-contain" draggable={false} /> : <Glyph name="icecream" size={34} />} />
          ))}
          {!creations.length && <p className="text-xs text-cocoa">Make desserts in the kitchens — they’ll show up here.</p>}
        </div>
      )}
      {tab === 'layers' && items && (
        <div className="flex max-h-72 flex-col gap-1 overflow-y-auto">
          {[...items].reverse().map((it, i) => (
            <button key={it.id} onClick={() => onSelect?.(it.id)} className={`flex items-center gap-2 rounded-xl px-2 py-1.5 text-left text-xs font-bold ${it.id === selectedId ? 'bg-strawberry/50' : 'bg-white/70 hover:bg-white'}`}>
              <span className="w-5 text-center text-cocoa-light">{items.length - i}</span>
              <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-cream">
                {it.kind === 'sprite' ? <SpriteThumb id={it.ref} size={28} tint={it.tint} /> : it.kind === 'image' ? <img src={urls[it.ref]} alt="" className="h-full w-full object-cover" /> : it.kind === 'creation' ? <img src={previews[it.ref]} alt="" className="h-full w-full object-contain" /> : <Type size={14} />}
              </span>
              <span className="truncate">{it.kind === 'text' ? `“${it.text}”` : it.kind === 'sprite' ? SPRITES[it.ref]?.name : it.kind === 'image' ? 'My photo' : it.kind === 'creation' ? creations.find((c) => c.id === it.ref)?.name || 'Creation' : it.ref}</span>
            </button>
          ))}
          {!items.length && <p className="text-xs text-cocoa">No layers yet.</p>}
        </div>
      )}
    </div>
  );
}
