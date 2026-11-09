import { useEffect, useRef, type ReactNode, type PointerEvent as RPE } from 'react';
import { create } from 'zustand';
import { createPortal } from 'react-dom';

export interface DragPayload { type: string; ref: string; data?: any }

interface DropZone { el: HTMLElement | SVGElement; onDrop: (p: DragPayload, cx: number, cy: number) => void }
const zones = new Map<string, DropZone>();
export function registerDropZone(id: string, z: DropZone) {
  zones.set(id, z);
  return () => { zones.delete(id); };
}

interface DragState { drag: { payload: DragPayload; x: number; y: number; preview: ReactNode } | null; over: boolean }
export const useDrag = create<DragState>(() => ({ drag: null, over: false }));

function zoneAt(x: number, y: number) {
  for (const z of zones.values()) {
    const r = z.el.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return z;
  }
  return null;
}

/**
 * Hook for tray items: tap = onTap; mouse drag or touch long-press-then-drag = drag ghost → drop on a stage.
 * Plain touch swipes are left to the browser so ingredient trays and panels stay scrollable.
 */
export function useTrayDrag(payload: DragPayload, preview: ReactNode, onTap: () => void, disabled = false) {
  const st = useRef<{ x: number; y: number; id: number; dragging: boolean; type: string; timer: number | null; cancelled: boolean } | null>(null);
  const elRef = useRef<HTMLElement | null>(null);

  const begin = (x: number, y: number, target: Element | null, pointerId: number) => {
    const s = st.current;
    if (!s) return;
    s.dragging = true;
    try { target?.setPointerCapture(pointerId); } catch { /* ignore */ }
    useDrag.setState({ drag: { payload, x, y, preview } });
    if (navigator.vibrate) try { navigator.vibrate(12); } catch { /* ignore */ }
  };

  // block page scrolling only while a touch drag is active
  const ref = (el: HTMLElement | null) => {
    if (elRef.current === el) return;
    elRef.current = el;
    if (!el) return;
    el.addEventListener('touchmove', (e) => { if (st.current?.dragging) e.preventDefault(); }, { passive: false });
    el.addEventListener('contextmenu', (e) => { if (st.current) e.preventDefault(); });
  };

  const handlers = {
    ref,
    onPointerDown: (e: RPE) => {
      if (disabled || e.button > 0) return;
      const target = e.currentTarget as Element;
      const s = { x: e.clientX, y: e.clientY, id: e.pointerId, dragging: false, type: e.pointerType, timer: null as number | null, cancelled: false };
      st.current = s;
      if (e.pointerType !== 'mouse') {
        s.timer = window.setTimeout(() => {
          if (st.current === s && !s.cancelled) begin(s.x, s.y, target, s.id);
        }, 260);
      }
    },
    onPointerMove: (e: RPE) => {
      const s = st.current;
      if (!s || s.id !== e.pointerId) return;
      const dist = Math.hypot(e.clientX - s.x, e.clientY - s.y);
      if (!s.dragging) {
        if (s.type === 'mouse') { if (dist > 6) begin(e.clientX, e.clientY, e.currentTarget as Element, e.pointerId); }
        else if (dist > 10) { s.cancelled = true; if (s.timer) clearTimeout(s.timer); }
        return;
      }
      useDrag.setState({ drag: { payload, x: e.clientX, y: e.clientY, preview }, over: !!zoneAt(e.clientX, e.clientY) });
    },
    onPointerUp: (e: RPE) => {
      const s = st.current;
      st.current = null;
      if (!s) return;
      if (s.timer) clearTimeout(s.timer);
      if (s.dragging) {
        useDrag.setState({ drag: null, over: false });
        const z = zoneAt(e.clientX, e.clientY);
        if (z) z.onDrop(payload, e.clientX, e.clientY);
      } else if (!s.cancelled && Math.hypot(e.clientX - s.x, e.clientY - s.y) < 10) onTap();
    },
    onPointerCancel: () => {
      if (st.current?.timer) clearTimeout(st.current.timer);
      st.current = null;
      useDrag.setState({ drag: null, over: false });
    },
    style: { touchAction: 'manipulation' as const, WebkitTouchCallout: 'none' as const },
  };
  return handlers;
}

export function DragGhost() {
  const drag = useDrag((s) => s.drag);
  const over = useDrag((s) => s.over);
  useEffect(() => {
    document.body.style.cursor = drag ? 'grabbing' : '';
  }, [!!drag]);
  if (!drag) return null;
  return createPortal(
    <div
      className="pointer-events-none fixed z-[200] -translate-x-1/2 -translate-y-1/2 transition-transform"
      style={{ left: drag.x, top: drag.y, transform: `translate(-50%,-50%) scale(${over ? 1.25 : 1}) rotate(${over ? -6 : 0}deg)` }}
    >
      <div className="rounded-2xl bg-white/70 p-1 shadow-card backdrop-blur">{drag.preview}</div>
    </div>,
    document.body
  );
}
