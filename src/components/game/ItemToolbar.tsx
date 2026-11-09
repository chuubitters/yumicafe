import { ArrowDownToLine, ArrowUpToLine, ChevronDown, ChevronUp, Copy, Crop, FlipHorizontal2, Minus, Plus, RotateCcw, RotateCw, Trash2, Type } from 'lucide-react';
import type { StageItem } from '../../types';
import { SPRITES } from '../../art/sprites';
import { FONTS, FURNITURE_TINTS, TEXT_COLORS } from '../../data/catalog';
import { uid } from '../../utils/misc';
import { fitText, reorder } from './itemUtils';
import { cropAsset } from './ImageLibrary';
import { sfx } from '../../utils/sound';

interface Props {
  items: StageItem[];
  selectedId: string | null;
  setItems: (items: StageItem[]) => void;
  onSelect: (id: string | null) => void;
  compact?: boolean;
}

export function ItemToolbar({ items, selectedId, setItems, onSelect, compact }: Props) {
  const it = items.find((x) => x.id === selectedId);
  if (!it) return null;
  const upd = (p: Partial<StageItem>) => setItems(items.map((x) => (x.id === it.id ? fitText({ ...x, ...p }) : x)));
  const def = it.kind === 'sprite' ? SPRITES[it.ref] : null;
  const btn = 'btn-icon !h-9 !w-9';
  const scale = (k: number) => upd({ w: it.w * k, h: it.h * k });

  return (
    <div className="paper flex flex-col gap-2 p-2.5" onPointerDown={(e) => e.stopPropagation()}>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="chip mr-1 max-w-[9rem] truncate">{it.kind === 'text' ? 'Text' : it.kind === 'image' ? 'My image' : it.kind === 'creation' ? 'Creation' : def?.name || it.ref}</span>
        <button className={btn} title="Smaller" aria-label="Smaller" onClick={() => scale(0.88)}><Minus size={15} /></button>
        <button className={btn} title="Bigger" aria-label="Bigger" onClick={() => scale(1.12)}><Plus size={15} /></button>
        <button className={btn} title="Rotate left" aria-label="Rotate left" onClick={() => upd({ rotation: it.rotation - 15 })}><RotateCcw size={15} /></button>
        <button className={btn} title="Rotate right" aria-label="Rotate right" onClick={() => upd({ rotation: it.rotation + 15 })}><RotateCw size={15} /></button>
        <button className={btn} title="Flip" aria-label="Flip" onClick={() => upd({ flipX: !it.flipX })}><FlipHorizontal2 size={15} /></button>
        <button className={btn} title="Bring forward" aria-label="Bring forward" onClick={() => setItems(reorder(items, it.id, 'up'))}><ChevronUp size={15} /></button>
        <button className={btn} title="Send backward" aria-label="Send backward" onClick={() => setItems(reorder(items, it.id, 'down'))}><ChevronDown size={15} /></button>
        {!compact && <button className={btn} title="Bring to front" aria-label="Bring to front" onClick={() => setItems(reorder(items, it.id, 'top'))}><ArrowUpToLine size={15} /></button>}
        {!compact && <button className={btn} title="Send to back" aria-label="Send to back" onClick={() => setItems(reorder(items, it.id, 'bottom'))}><ArrowDownToLine size={15} /></button>}
        <button className={btn} title="Duplicate" aria-label="Duplicate" onClick={() => { const c = { ...it, id: uid('it'), x: it.x + 18, y: it.y + 18 }; setItems([...items, c]); onSelect(c.id); sfx('pop'); }}><Copy size={15} /></button>
        {it.kind === 'image' && <button className={btn} title="Crop" aria-label="Crop" onClick={async () => { const id = await cropAsset(it.ref); if (id) upd({ ref: id }); }}><Crop size={15} /></button>}
        <button className={`${btn} !text-strawberry-dark`} title="Delete" aria-label="Delete" onClick={() => { sfx('delete'); setItems(items.filter((x) => x.id !== it.id)); onSelect(null); sfx('click'); }}><Trash2 size={15} /></button>
      </div>

      {(it.kind === 'text' || def?.textual) && (
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex min-w-[10rem] flex-1 items-center gap-2">
            <Type size={15} className="shrink-0" />
            <input className="input !py-1.5" value={it.text ?? ''} placeholder={def?.name} maxLength={40} onChange={(e) => upd({ text: e.target.value })} aria-label="Text" />
          </label>
          {it.kind === 'text' && (
            <>
              <select className="input !w-auto !py-1.5" value={it.font} onChange={(e) => upd({ font: e.target.value })} aria-label="Font">
                {FONTS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <button className={`chip ${it.stroke ? '!bg-strawberry' : ''}`} onClick={() => upd({ stroke: it.stroke ? undefined : '#FFFFFF' })}>Outline</button>
              <button className={`chip ${it.shadow ? '!bg-strawberry' : ''}`} onClick={() => upd({ shadow: !it.shadow })}>Shadow</button>
              <button className={`chip ${it.vertical ? '!bg-strawberry' : ''}`} onClick={() => upd(it.vertical ? { vertical: false, h: it.w } : { vertical: true, w: it.h })}>縦 Vertical</button>
            </>
          )}
        </div>
      )}
      {it.kind === 'text' && (
        <div className="flex flex-wrap gap-1.5">
          {TEXT_COLORS.map((c) => <button key={c} aria-label={`Color ${c}`} onClick={() => upd({ color: c })} className={`h-7 w-7 rounded-full border-2 ${it.color === c ? 'border-cocoa-dark scale-110' : 'border-white'} shadow`} style={{ background: c }} />)}
        </div>
      )}
      {def?.tintable && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold">Color</span>
          {FURNITURE_TINTS.map((c) => <button key={c} aria-label={`Tint ${c}`} onClick={() => upd({ tint: c })} className={`h-7 w-7 rounded-full border-2 ${it.tint === c ? 'border-cocoa-dark scale-110' : 'border-white'} shadow`} style={{ background: c }} />)}
          <button className="chip" onClick={() => upd({ tint: undefined })}>Reset</button>
        </div>
      )}
      {it.kind === 'image' && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold">Frame</span>
          {(['none', 'polaroid', 'round', 'wood', 'gold', 'washi'] as const).map((f) => (
            <button key={f} className={`chip capitalize ${(it.frame || 'none') === f ? '!bg-strawberry' : ''}`} onClick={() => upd({ frame: f })}>{f}</button>
          ))}
        </div>
      )}
      <label className="flex items-center gap-2 text-xs font-bold">Opacity
        <input type="range" min={0.2} max={1} step={0.05} value={it.opacity ?? 1} onChange={(e) => upd({ opacity: +e.target.value })} className="flex-1" />
      </label>
    </div>
  );
}
