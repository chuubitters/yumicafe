import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Redo2, Undo2, Check, Expand, Shrink } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { sfx } from '../../utils/sound';
import { ModeFrame, PosterTitle, type ModeId } from '../common/PosterTitle';
import { Glyph, type GlyphName } from '../common/Glyph';

export interface StepDef { id: string; label: string; jp?: string }

interface Props {
  title: string;
  jp: string;
  subtitle?: string;
  accent?: string; // legacy (unused)
  mode: ModeId;
  steps: StepDef[];
  step: number;
  setStep: (n: number) => void;
  canNext?: boolean;
  nextHint?: string;
  stage: ReactNode;
  stageFooter?: ReactNode;
  panel: ReactNode;
  headerRight?: ReactNode;
  onFinish?: () => void;
  finishLabel?: string;
  undo?: { undo: () => void; redo: () => void; canUndo: boolean; canRedo: boolean };
  stageTools?: ReactNode;
  stageHint?: ReactNode;
}

/** ⌘ on Apple devices, Ctrl elsewhere — used in tooltips */
export const MOD = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? '⌘' : 'Ctrl';

export function StudioShell({ title, jp, subtitle, mode, steps, step, setStep, canNext = true, nextHint, stage, stageFooter, panel, headerRight, onFinish, finishLabel = 'Finish!', undo, stageTools, stageHint }: Props) {
  const last = step === steps.length - 1;
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    if (!undo) return;
    const k = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) undo.redo(); else undo.undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); undo.redo(); }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [undo]);

  const go = (n: number) => { sfx('click'); setStep(Math.max(0, Math.min(steps.length - 1, n))); };

  return (
    <ModeFrame mode={mode} className="mx-auto flex w-full max-w-[1400px] flex-col gap-3 px-3 pb-6 pt-3 md:px-5 lg:pt-5">
      <PosterTitle mode={mode} title={title} jp={jp} subtitle={subtitle} right={headerRight} />

      {/* steps */}
      <nav aria-label="Steps" className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {steps.map((s, i) => (
          <button key={s.id} onClick={() => (i <= step || canNext) && go(i)} aria-current={i === step ? 'step' : undefined}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-bold transition ${
              i === step ? 'scale-[1.04] border-[var(--t1)] bg-[var(--tint)] text-[var(--t1)] shadow-sticker' : i < step ? 'border-matcha bg-white text-matcha-dark hover:-translate-y-0.5' : 'border-transparent bg-white/70 text-cocoa-light'
            }`}>
            <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${i < step ? 'bg-matcha text-white' : i === step ? 'bg-[var(--t1)] text-white' : 'bg-cream'}`}>{i < step ? <Check size={11} /> : i + 1}</span>
            {s.label}
          </button>
        ))}
      </nav>

      <div className="studio-grid grid gap-3 lg:gap-4 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_440px]">
        {/* stage: on phones/tablets the whole block (tools row + canvas) is a direct grid child so it can stay pinned while the panel scrolls */}
        <section className={`studio-stage ${compact ? 'studio-compact' : ''} contents lg:relative lg:flex lg:min-w-0 lg:flex-col lg:gap-2`}>
          <div className="studio-stage-sticky flex min-w-0 flex-col gap-1.5">
            <div className="flex min-h-[40px] items-center gap-2 px-0.5">
              <div className="min-w-0 flex-1">{stageHint}</div>
              {stageTools}
              <button className="btn-icon !h-9 !w-9 lg:hidden" onClick={() => { sfx('tab'); setCompact((c) => !c); }} aria-pressed={compact} aria-label={compact ? 'Enlarge preview' : 'Shrink preview'} title={compact ? 'Enlarge preview' : 'Shrink preview to see more options'}>{compact ? <Expand size={16} /> : <Shrink size={16} />}</button>
              {undo && (
                <>
                  <button className="btn-icon !h-9 !w-9" onClick={() => { sfx('undo'); undo.undo(); }} disabled={!undo.canUndo} aria-label="Undo" title={`Undo (${MOD}+Z)`}><Undo2 size={16} /></button>
                  <button className="btn-icon !h-9 !w-9" onClick={() => { sfx('redo'); undo.redo(); }} disabled={!undo.canRedo} aria-label="Redo" title={`Redo (${MOD}+Shift+Z)`}><Redo2 size={16} /></button>
                </>
              )}
            </div>
            {stage}
          </div>
          {stageFooter}
        </section>

        {/* panel */}
        <aside className="studio-panel paper stitch relative flex min-w-0 flex-col gap-3 p-3 sm:p-4 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)] lg:self-start">
          <div className="flex items-center gap-2">
            <motion.span key={step} initial={{ scale: 0.3, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 14 }} className="badge-round h-9 w-9 shrink-0 aspect-square text-sm font-display">{step + 1}</motion.span>
            <div>
              {steps[step].jp && <div className="label-jp text-[10px]" style={{ color: 'var(--t3)' }}>{steps[step].jp}</div>}
              <h2 className="font-display text-base leading-tight" style={{ color: 'var(--t1)' }}>{steps[step].label}</h2>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-0.5">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
                {panel}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2 border-t border-dashed border-[#F1E3CF] pt-3">
            <button className="btn-cream" onClick={() => go(step - 1)} disabled={step === 0}><ChevronLeft size={16} />Back</button>
            <span className="flex-1 text-center text-[11px] text-cocoa">{!canNext && nextHint}</span>
            {last ? (
              <button className="btn-deep" onClick={() => { sfx('sparkle'); onFinish?.(); }} disabled={!canNext}>{finishLabel}</button>
            ) : (
              <button className="btn-deep" onClick={() => go(step + 1)} disabled={!canNext}>Next<ChevronRight size={16} /></button>
            )}
          </div>
        </aside>
      </div>
    </ModeFrame>
  );
}

export function OptionGrid<T extends { id: string; name: string }>({ options, value, onPick, render, cols = 'tile-grid', isLocked, recommended }: {
  options: T[]; value: string | string[] | null; onPick: (o: T) => void; render?: (o: T) => ReactNode; cols?: string; isLocked?: (o: T) => boolean; recommended?: string | string[] | null;
}) {
  const on = (id: string) => (Array.isArray(value) ? value.includes(id) : value === id);
  const rec = (id: string) => (Array.isArray(recommended) ? recommended.includes(id) : recommended === id);
  return (
    <div className={`grid gap-2 ${cols}`}>
      {options.map((o, idx) => {
        const locked = isLocked?.(o);
        return (
          <button key={o.id} style={{ ['--i' as any]: `${Math.min(idx, 14) * 22}ms` }} type="button" disabled={locked} onClick={() => { sfx('pop'); onPick(o); }} className={`tile anim-rise min-h-[84px] ${on(o.id) ? 'tile-on' : ''} ${locked ? 'tile-locked' : ''}`} aria-pressed={on(o.id)}>
            {rec(o.id) && <span className="pill-label absolute -top-2 left-1/2 -translate-x-1/2 !bg-none !bg-kiss-green !px-2 !py-0 !text-[9px]">レシピ</span>}
            {render?.(o)}
            <span className="text-center leading-tight">{o.name}</span>
            {locked && <span className="inline-flex items-center gap-0.5 text-[9px] text-cocoa"><Glyph name="lock" />Shop</span>}
          </button>
        );
      })}
    </div>
  );
}

export function Slider({ label, value, min, max, step = 1, onChange, onCommit, suffix }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; onCommit?: () => void; suffix?: string }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-bold">
      <span className="flex justify-between"><span>{label}</span><span className="text-strawberry-deep">{Math.round(value)}{suffix}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} onPointerUp={onCommit} onKeyUp={onCommit} />
    </label>
  );
}

export const Swatch = ({ c, size = 30 }: { c: string; size?: number }) => (
  <span className="block rounded-full border-2 border-white shadow" style={{ width: size, height: size, background: `radial-gradient(circle at 35% 30%, #ffffffaa, ${c} 55%)` }} />
);
