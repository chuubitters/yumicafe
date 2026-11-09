import type { StageItem } from '../../types';
import { SPRITES } from '../../art/sprites';
import { useAssets } from '../../store/assetStore';
import { useCollection } from '../../store/collectionStore';
import { uid } from '../../utils/misc';
import type { DragPayload } from './dnd';

/** Build a new StageItem from a tray payload at a stage position. `size` = target longest side. */
export function makeItem(p: DragPayload, x: number, y: number, size = 80): StageItem | null {
  const base = { id: uid('it'), x, y, rotation: 0 };
  if (p.type === 'sprite') {
    const def = SPRITES[p.ref];
    if (!def) return null;
    const k = size / Math.max(def.w, def.h);
    return { ...base, kind: 'sprite', ref: p.ref, w: def.w * k, h: def.h * k, ...(p.data || {}) };
  }
  if (p.type === 'image') {
    const a = useAssets.getState().assets.find((a) => a.id === p.ref);
    const ar = a ? a.width / a.height : 1;
    const w = ar >= 1 ? size : size * ar;
    const h = ar >= 1 ? size / ar : size;
    return { ...base, kind: 'image', ref: p.ref, w, h, frame: 'none', ...(p.data || {}) };
  }
  if (p.type === 'creation') {
    const c = useCollection.getState().get(p.ref);
    const ar = c ? c.previewW / c.previewH : 0.77;
    const w = ar >= 1 ? size : size * ar;
    const h = ar >= 1 ? size / ar : size;
    return { ...base, kind: 'creation', ref: p.ref, w, h };
  }
  if (p.type === 'text') {
    const text = p.data?.text || 'Sweet day ♡';
    const h = size * 0.4;
    return { ...base, kind: 'text', ref: 'text', text, w: Math.max(h, text.length * h * 0.62), h, color: p.data?.color || '#5E4535', font: p.data?.font || 'display', stroke: '#FFFFFF', shadow: true };
  }
  return null;
}

/** Re-measure a text item's box after its text/size changes */
export function fitText(it: StageItem): StageItem {
  if (it.kind !== 'text') return it;
  const len = Math.max(1, [...(it.text || ' ')].length);
  if (it.vertical) return { ...it, h: Math.max(it.w, len * it.w * 1.02) };
  return { ...it, w: Math.max(it.h, len * it.h * 0.62) };
}

export function reorder(items: StageItem[], id: string, dir: 'up' | 'down' | 'top' | 'bottom') {
  const i = items.findIndex((x) => x.id === id);
  if (i < 0) return items;
  const arr = [...items];
  const [it] = arr.splice(i, 1);
  const to = dir === 'up' ? Math.min(arr.length, i + 1) : dir === 'down' ? Math.max(0, i - 1) : dir === 'top' ? arr.length : 0;
  arr.splice(to, 0, it);
  return arr;
}
