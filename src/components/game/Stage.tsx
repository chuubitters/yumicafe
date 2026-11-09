import { createContext, forwardRef, useContext, useEffect, useId, useImperativeHandle, useRef, useState, type ReactNode, type PointerEvent as RPE } from 'react';
import { ArtDefs } from '../../art/Defs';
import { registerDropZone, type DragPayload } from './dnd';

interface StageCtxV {
  uiScale: number;
  toSvg: (cx: number, cy: number) => { x: number; y: number };
  svg: SVGSVGElement | null;
}
const StageCtx = createContext<StageCtxV>({ uiScale: 1, toSvg: (x, y) => ({ x, y }), svg: null });
export const useStage = () => useContext(StageCtx);

interface StageProps {
  width: number;
  height: number;
  children: ReactNode;
  className?: string;
  bgClassName?: string;
  onDrop?: (p: DragPayload, x: number, y: number) => void;
  onPointerDown?: (e: RPE<SVGSVGElement>, pt: { x: number; y: number }, onItem: boolean) => void;
  onPointerMove?: (e: RPE<SVGSVGElement>, pt: { x: number; y: number }) => void;
  onPointerUp?: (e: RPE<SVGSVGElement>, pt: { x: number; y: number }) => void;
  maxHeight?: string;
  cursor?: string;
  ariaLabel?: string;
}

/** Responsive SVG stage: keeps the aspect ratio, maps pointer coordinates, accepts tray drops. */
export const Stage = forwardRef<SVGSVGElement | null, StageProps>(function Stage(
  { width, height, children, className = '', bgClassName = '', onDrop, onPointerDown, onPointerMove, onPointerUp, maxHeight, cursor, ariaLabel },
  ref
) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [uiScale, setUiScale] = useState(1);
  const id = useId();
  useImperativeHandle(ref, () => svgRef.current as SVGSVGElement, []);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      if (r.width) setUiScale(Math.max(width / r.width, height / r.height));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height]);

  useEffect(() => {
    if (!onDrop || !wrapRef.current) return;
    return registerDropZone(id, {
      el: wrapRef.current,
      onDrop: (p, cx, cy) => {
        const pt = toSvg(cx, cy);
        onDrop(p, pt.x, pt.y);
      },
    });
  });

  const toSvg = (cx: number, cy: number) => {
    const el = svgRef.current;
    if (!el) return { x: cx, y: cy };
    const m = el.getScreenCTM();
    if (!m) return { x: cx, y: cy };
    const p = new DOMPoint(cx, cy).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };

  return (
    <div ref={wrapRef} className={`stage-surface ${bgClassName} ${className}`} style={{ aspectRatio: `${width} / ${height}`, width: maxHeight ? `min(100%, calc(${maxHeight} * ${width / height}))` : '100%', marginInline: 'auto' }}>
      <StageCtx.Provider value={{ uiScale, toSvg, svg: svgRef.current }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="block h-full w-full select-none"
          style={{ touchAction: 'none', cursor }}
          role="img"
          aria-label={ariaLabel}
          onPointerDown={(e) => {
            const onItem = !!(e.target as Element).closest?.('[data-item]');
            onPointerDown?.(e, toSvg(e.clientX, e.clientY), onItem);
          }}
          onPointerMove={(e) => onPointerMove?.(e, toSvg(e.clientX, e.clientY))}
          onPointerUp={(e) => onPointerUp?.(e, toSvg(e.clientX, e.clientY))}
          onPointerCancel={(e) => onPointerUp?.(e, toSvg(e.clientX, e.clientY))}
        >
          <ArtDefs />
          {children}
        </svg>
      </StageCtx.Provider>
    </div>
  );
});
