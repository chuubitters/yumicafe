import { useEffect, useRef, type ReactNode } from 'react';
import { uid } from '../../utils/misc';
import { sfx } from '../../utils/sound';
import type { StageItem } from '../../types';
import { SPRITES } from '../../art/sprites';
import { useAssets } from '../../store/assetStore';
import { useCollection } from '../../store/collectionStore';
import { fontCss } from '../../data/catalog';
import { useStage } from './Stage';

export function ItemContent({ it }: { it: StageItem }) {
  const url = useAssets((s) => (it.kind === 'image' ? s.urls[it.ref] : undefined));
  const prev = useCollection((s) => (it.kind === 'creation' ? s.previews[it.ref] : undefined));
  const { w, h } = it;
  switch (it.kind) {
    case 'sprite': {
      const def = SPRITES[it.ref];
      if (!def) return null;
      return (
        <g transform={`scale(${w / def.w} ${h / def.h})`} filter={def.sticker ? 'url(#yc-sticker)' : undefined}>
          {def.render(it)}
        </g>
      );
    }
    case 'image':
      return <FramedImage it={it} url={url} />;
    case 'creation':
      return prev ? <image href={prev} x={-w / 2} y={-h / 2} width={w} height={h} preserveAspectRatio="xMidYMid meet" filter="url(#yc-shadow)" /> : <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="12" fill="#fff" opacity=".5" />;
    case 'text': {
      const vertical = !!it.vertical;
      const fs = vertical ? w * 0.78 : h * 0.78;
      const chars = [...(it.text || '')];
      const content = vertical
        ? chars.map((ch, i) => <tspan key={i} x={0} dy={i ? w * 1.0 : 0}>{ch}</tspan>)
        : it.text;
      const common = {
        x: 0, y: vertical ? -h / 2 + w * 0.82 : fs * 0.34, textAnchor: 'middle' as const,
        fontFamily: fontCss(it.font), fontSize: fs, fontWeight: 700,
      };
      return (
        <g>
          {it.shadow && <text {...common} fill="#5E3A27" opacity=".28" transform="translate(3 4)">{content}</text>}
          {it.stroke && <text {...common} fill="none" stroke={it.stroke} strokeWidth={Math.max(4, fs * 0.16)} strokeLinejoin="round">{content}</text>}
          <text {...common} fill={it.color || '#5E4535'}>{content}</text>
        </g>
      );
    }
    default:
      return null;
  }
}

function FramedImage({ it, url }: { it: StageItem; url?: string }) {
  const { w, h } = it;
  const cid = `fi-${it.id}`;
  if (!url) return <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="10" fill="#F7B8C8" opacity=".4" />;
  const img = (x: number, y: number, ww: number, hh: number, clip?: string) => (
    <image href={url} x={x} y={y} width={ww} height={hh} preserveAspectRatio="xMidYMid slice" clipPath={clip ? `url(#${clip})` : undefined} />
  );
  switch (it.frame) {
    case 'polaroid': {
      const p = Math.min(w, h) * 0.06;
      return (
        <g filter="url(#yc-shadow)">
          <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#FFFDF8" />
          {img(-w / 2 + p, -h / 2 + p, w - p * 2, h - p * 4.5)}
        </g>
      );
    }
    case 'round':
      return (
        <g filter="url(#yc-shadow)">
          <defs><clipPath id={cid}><ellipse rx={w / 2} ry={h / 2} /></clipPath></defs>
          <ellipse rx={w / 2 + 5} ry={h / 2 + 5} fill="#fff" />
          {img(-w / 2, -h / 2, w, h, cid)}
        </g>
      );
    case 'wood':
    case 'gold': {
      const b = Math.min(w, h) * 0.08;
      return (
        <g filter="url(#yc-shadow)">
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="4" fill={it.frame === 'gold' ? 'url(#yc-gold)' : 'url(#yc-wood)'} />
          <rect x={-w / 2 + b * 0.35} y={-h / 2 + b * 0.35} width={w - b * 0.7} height={h - b * 0.7} rx="3" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="2" />
          {img(-w / 2 + b, -h / 2 + b, w - b * 2, h - b * 2)}
        </g>
      );
    }
    case 'washi':
      return (
        <g>
          <g filter="url(#yc-shadow)">{img(-w / 2, -h / 2, w, h)}</g>
          <rect x={-w * 0.18} y={-h / 2 - 10} width={w * 0.36} height="22" fill="#F7B8C8" opacity=".75" transform={`rotate(-4)`} />
        </g>
      );
    default:
      return (
        <g>
          <defs><clipPath id={cid}><rect x={-w / 2} y={-h / 2} width={w} height={h} rx={Math.min(w, h) * 0.04} /></clipPath></defs>
          {img(-w / 2, -h / 2, w, h, cid)}
        </g>
      );
  }
}

interface ItemsLayerProps {
  items: StageItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onLive: (items: StageItem[]) => void;
  onCommit: () => void;
  onDelete?: (id: string) => void;
  render?: (it: StageItem) => ReactNode;
  interactive?: boolean;
  minSize?: number;
}

type Gesture = { mode: 'move' | 'scale' | 'rotate'; id: string; sx: number; sy: number; orig: StageItem; moved: boolean };

/** Free-transform layer: drag to move, corner handle to scale, top handle to rotate. Works with mouse & touch. */
export function ItemsLayer({ items, selectedId, onSelect, onLive, onCommit, onDelete, render, interactive = true, minSize = 14 }: ItemsLayerProps) {
  const { toSvg, uiScale } = useStage();
  const g = useRef<Gesture | null>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const start = (e: React.PointerEvent, mode: Gesture['mode'], it: StageItem) => {
    if (!interactive || it.locked) return;
    e.stopPropagation();
    e.preventDefault();
    const p = toSvg(e.clientX, e.clientY);
    g.current = { mode, id: it.id, sx: p.x, sy: p.y, orig: { ...it }, moved: false };
    onSelect(it.id);
    const move = (ev: PointerEvent) => {
      const s = g.current;
      if (!s) return;
      const q = toSvg(ev.clientX, ev.clientY);
      const o = s.orig;
      let next: StageItem = o;
      if (s.mode === 'move') {
        next = { ...o, x: o.x + (q.x - s.sx), y: o.y + (q.y - s.sy) };
      } else if (s.mode === 'scale') {
        const d0 = Math.hypot(s.sx - o.x, s.sy - o.y) || 1;
        const d1 = Math.hypot(q.x - o.x, q.y - o.y);
        const k = Math.max(minSize / Math.min(o.w, o.h), d1 / d0);
        next = { ...o, w: o.w * k, h: o.h * k };
      } else {
        const a = (Math.atan2(q.y - o.y, q.x - o.x) * 180) / Math.PI + 90;
        let r = Math.round(a);
        for (const snap of [0, 90, 180, -90, 270]) if (Math.abs(r - snap) < 4) r = snap;
        next = { ...o, rotation: r };
      }
      s.moved = true;
      onLive(itemsRef.current.map((x) => (x.id === s.id ? next : x)));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (g.current?.moved) onCommit();
      g.current = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };


  /* Keyboard control for the selected item (PC / Mac): arrows nudge (Shift = 10px), Delete removes,
     [ ] rotate, - = scale, F flips, Ctrl/Cmd+D duplicates, Esc deselects. Ignored while typing in a field. */
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  useEffect(() => {
    if (!interactive || !selectedId) return;
    const k = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      const cur = itemsRef.current.find((x) => x.id === selectedId);
      if (!cur) return;
      const mod = e.ctrlKey || e.metaKey;
      const step = e.shiftKey ? 10 : 2;
      const apply = (p: Partial<StageItem>) => { onLive(itemsRef.current.map((x) => (x.id === cur.id ? { ...x, ...p } : x))); onCommit(); };
      const arrows: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
      if (arrows[e.key] && !mod) { e.preventDefault(); apply({ x: cur.x + arrows[e.key][0], y: cur.y + arrows[e.key][1] }); sfx('tick', 0.4); return; }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !mod) { e.preventDefault(); sfx('delete'); if (onDelete) onDelete(cur.id); return; }
      if (e.key === 'Escape') { onSelectRef.current(null); return; }
      if (mod && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        const c = { ...cur, id: uid('it'), x: cur.x + 18, y: cur.y + 18 };
        onLive([...itemsRef.current, c]); onCommit(); onSelectRef.current(c.id); sfx('pop'); return;
      }
      if (mod) return;
      if (e.key === '[') { e.preventDefault(); apply({ rotation: cur.rotation - (e.shiftKey ? 45 : 15) }); sfx('tick', 0.3); }
      else if (e.key === ']') { e.preventDefault(); apply({ rotation: cur.rotation + (e.shiftKey ? 45 : 15) }); sfx('tick', 0.7); }
      else if (e.key === '=' || e.key === '+') { e.preventDefault(); apply({ w: cur.w * 1.1, h: cur.h * 1.1 }); sfx('tick', 0.8); }
      else if (e.key === '-' || e.key === '_') { e.preventDefault(); apply({ w: Math.max(minSize, cur.w / 1.1), h: Math.max(minSize, cur.h / 1.1) }); sfx('tick', 0.2); }
      else if (e.key.toLowerCase() === 'f') { e.preventDefault(); apply({ flipX: !cur.flipX }); sfx('pop'); }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [interactive, selectedId, onLive, onCommit, onDelete, minSize]);

  const hr = 13 * uiScale;
  return (
    <g>
      {items.map((it) => {
        const sel = it.id === selectedId;
        return (
          <g key={it.id} data-item={it.id} transform={`translate(${it.x} ${it.y}) rotate(${it.rotation})`} opacity={it.opacity ?? 1}
            style={{ cursor: interactive && !it.locked ? 'grab' : undefined }}
            onPointerDown={(e) => start(e, 'move', it)}
            tabIndex={interactive ? 0 : undefined}
            role={interactive ? 'button' : undefined}
            aria-label={interactive ? `${it.kind} ${it.ref}` : undefined}
          >
            <g transform={it.flipX ? 'scale(-1 1)' : undefined}>
              {render ? render(it) : <ItemContent it={it} />}
            </g>
            {/* generous invisible hit area */}
            <rect x={-it.w / 2} y={-it.h / 2} width={it.w} height={it.h} fill="transparent" data-export-ignore />
            {sel && interactive && (
              <g data-export-ignore>
                <rect x={-it.w / 2 - 6 * uiScale} y={-it.h / 2 - 6 * uiScale} width={it.w + 12 * uiScale} height={it.h + 12 * uiScale} rx={8 * uiScale}
                  fill="none" stroke="#E8869F" strokeWidth={2 * uiScale} strokeDasharray={`${6 * uiScale} ${5 * uiScale}`} />
                <line x1="0" y1={-it.h / 2 - 6 * uiScale} x2="0" y2={-it.h / 2 - 30 * uiScale} stroke="#E8869F" strokeWidth={2 * uiScale} />
                <g transform={`translate(0 ${-it.h / 2 - 34 * uiScale})`} style={{ cursor: 'grab' }} onPointerDown={(e) => start(e, 'rotate', it)}>
                  <circle r={hr} fill="#fff" stroke="#E8869F" strokeWidth={2.5 * uiScale} />
                  <path d={`M${-5 * uiScale} ${-2 * uiScale} a${6 * uiScale} ${6 * uiScale} 0 1 1 ${2 * uiScale} ${6 * uiScale}`} stroke="#E8869F" strokeWidth={2.2 * uiScale} fill="none" />
                </g>
                <g transform={`translate(${it.w / 2 + 6 * uiScale} ${it.h / 2 + 6 * uiScale})`} style={{ cursor: 'nwse-resize' }} onPointerDown={(e) => start(e, 'scale', it)}>
                  <circle r={hr} fill="#E8869F" stroke="#fff" strokeWidth={2.5 * uiScale} />
                  <path d={`M${-4 * uiScale} ${4 * uiScale} L${4 * uiScale} ${-4 * uiScale} M${1 * uiScale} ${-4 * uiScale} H${4 * uiScale} V${-1 * uiScale}`} stroke="#fff" strokeWidth={2 * uiScale} fill="none" />
                </g>
                {onDelete && (
                  <g transform={`translate(${-it.w / 2 - 6 * uiScale} ${-it.h / 2 - 6 * uiScale})`} style={{ cursor: 'pointer' }}
                    onPointerDown={(e) => { e.stopPropagation(); onDelete(it.id); }}>
                    <circle r={hr * 0.85} fill="#fff" stroke="#C9566F" strokeWidth={2 * uiScale} />
                    <path d={`M${-4 * uiScale} ${-4 * uiScale} L${4 * uiScale} ${4 * uiScale} M${4 * uiScale} ${-4 * uiScale} L${-4 * uiScale} ${4 * uiScale}`} stroke="#C9566F" strokeWidth={2.2 * uiScale} />
                  </g>
                )}
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}
