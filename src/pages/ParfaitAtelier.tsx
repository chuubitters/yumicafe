import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Trash2, Sparkles, Cherry as CherryIcon } from 'lucide-react';
import { StudioShell, OptionGrid, Slider, Swatch } from '../components/game/StudioShell';
import { Stage } from '../components/game/Stage';
import { ItemsLayer } from '../components/game/StageItems';
import { ItemToolbar } from '../components/game/ItemToolbar';
import { DecorPanel, TrayTile } from '../components/game/DecorPanel';
import { ResultModal } from '../components/game/ResultModal';
import { BgPicker } from '../components/game/BgPicker';
import { makeItem } from '../components/game/itemUtils';
import { ParfaitArt } from '../art/ParfaitArt';
import { ArtDefs } from '../art/Defs';
import { CX, parfaitGlass, rimY, widthAt } from '../art/glass';
import { Scoop, WhippedCream } from '../art/food';
import { SpriteThumb, SPRITES } from '../art/sprites';
import { useHistory } from '../hooks/useHistory';
import { useStudio } from '../hooks/useStudio';
import { emptyParfait } from '../data/samples';
import { CREAM_COLORS, ICE_CREAMS, PARFAIT_GLASSES, PARFAIT_LAYERS, SAUCES, TOPPING_SPRITES, iceCream, layerOpt } from '../data/catalog';
import { useUnlocked } from '../store/gameStore';
import type { AnimalFace, ParfaitData, ParfaitTop, StageItem } from '../types';
import type { DragPayload } from '../components/game/dnd';
import { sfx } from '../utils/sound';
import { clamp, uid } from '../utils/misc';
import { Glyph, type GlyphName } from '../components/common/Glyph';

const STEPS = [
  { id: 'glass', label: 'Choose glass', jp: 'グラス' },
  { id: 'base', label: 'Base layer', jp: 'ベース' },
  { id: 'ice', label: 'Scoop ice cream', jp: 'アイス' },
  { id: 'layers', label: 'Add layers', jp: 'レイヤー' },
  { id: 'cream', label: 'Pipe cream', jp: 'クリーム' },
  { id: 'toppings', label: 'Toppings', jp: 'トッピング' },
  { id: 'decorate', label: 'Decorate', jp: 'デコ' },
];
const ANIMALS: AnimalFace['type'][] = ['none', 'cat', 'bear', 'bunny', 'panda', 'chick'];
const FACES: AnimalFace['face'][] = ['happy', 'smile', 'wink', 'sleepy', 'surprised'];
const ACCS: AnimalFace['acc'][] = ['none', 'bow', 'flower', 'leaf', 'crown'];
const ANIMAL_GLYPH: Record<string, GlyphName> = { none: 'none', cat: 'cat', bear: 'bear', bunny: 'bunny', panda: 'panda', chick: 'chick' };

function GlassThumb({ id }: { id: string }) {
  const d = useMemo<ParfaitData>(() => ({ ...emptyParfait(), glass: id, layers: [{ id: 'a', kind: 'jelly-strawberry' }, { id: 'b', kind: 'cream' }, { id: 'c', kind: 'cornflakes' }] }), [id]);
  return <svg viewBox="80 100 240 390" className="h-14 w-12 rounded-lg bg-matcha-tatami"><ArtDefs /><ParfaitArt d={d} /></svg>;
}

function LayerStack({ d, set }: { d: ParfaitData; set: (layers: ParfaitData['layers']) => void }) {
  if (!d.layers.length) return <p className="rounded-2xl bg-cream px-3 py-3 text-center text-xs text-cocoa">Your glass is empty — add something!</p>;
  const move = (i: number, dir: -1 | 1) => {
    const arr = [...d.layers];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    set(arr);
  };
  return (
    <div className="flex flex-col-reverse gap-1">
      {d.layers.map((l, i) => {
        const o = layerOpt(l.kind);
        return (
          <div key={l.id} className="flex items-center gap-2 rounded-xl bg-white/80 px-2 py-1 text-xs font-bold shadow-sm">
            <span className="h-5 w-8 rounded-md border border-white shadow-inner" style={{ background: o.color }} />
            <span className="flex-1 truncate">{o.name}</span>
            <button className="p-1" aria-label="Move up" onClick={() => move(i, 1)}><ArrowUp size={14} /></button>
            <button className="p-1" aria-label="Move down" onClick={() => move(i, -1)}><ArrowDown size={14} /></button>
            <button className="p-1 text-strawberry-dark" aria-label="Remove layer" onClick={() => set(d.layers.filter((x) => x.id !== l.id))}><Trash2 size={14} /></button>
          </div>
        );
      })}
    </div>
  );
}

export default function ParfaitAtelier() {
  const h = useHistory<ParfaitData>(emptyParfait);
  const d = h.state;
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(false);
  const [topSel, setTopSel] = useState<string | null>(null);
  const [nextAnimal, setNextAnimal] = useState<AnimalFace>({ type: 'none', face: 'happy', acc: 'none' });
  const [creamFlavor, setCreamFlavor] = useState('vanilla');
  const [piping, setPiping] = useState<ParfaitTop | null>(null);
  const pipeTimer = useRef<number | null>(null);
  const dragTop = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const isUnlocked = useUnlocked();
  const st = useStudio<ParfaitData>('parfait', (data) => { h.reset(data); setStep(6); });

  const g = parfaitGlass(d.glass);
  const top = rimY(g);
  const set = (p: Partial<ParfaitData>) => h.set({ ...d, ...p });
  const setItems = (items: StageItem[]) => h.set({ ...d, items });
  const selTop = d.top.find((t) => t.id === topSel) || null;

  useEffect(() => () => { if (pipeTimer.current) cancelAnimationFrame(pipeTimer.current); }, []);

  const addLayer = (kind: string) => {
    if (d.layers.length >= 10) return;
    set({ layers: [...d.layers, { id: uid('l'), kind }] });
    sfx(kind.startsWith('ice') ? 'scoop' : 'drop');
  };
  const clampTop = (x: number, y: number) => ({ x: clamp(x, CX - widthAt(g, top) - 10, CX + widthAt(g, top) + 10), y: clamp(y, 40, top + 6) });
  const addScoop = (flavor: string, x?: number, y?: number) => {
    const n = d.top.filter((t) => t.type === 'scoop').length;
    const pos = x != null && y != null ? clampTop(x, y) : { x: CX + [0, -34, 34, -16, 18][n % 5], y: top - 10 - Math.floor(n / 3) * 46 };
    const t: ParfaitTop = { id: uid('s'), type: 'scoop', flavor, ...pos, size: 44, animal: nextAnimal.type !== 'none' ? { ...nextAnimal } : undefined };
    set({ top: [...d.top, t] });
    setTopSel(t.id);
    sfx('scoop');
  };
  const updTop = (id: string, p: Partial<ParfaitTop>) => set({ top: d.top.map((t) => (t.id === id ? { ...t, ...p } : t)) });

  const onDrop = (p: DragPayload, x: number, y: number) => {
    if (p.type === 'icecream') {
      if (y > top + 24 && ['vanilla', 'matcha', 'strawberry', 'chocolate'].includes(p.ref)) addLayer(`ice-${p.ref}`);
      else addScoop(p.ref, x, y);
      return;
    }
    if (p.type === 'layer') { addLayer(p.ref); return; }
    const it = makeItem(p, x, y, p.type === 'sprite' && TOPPING_SPRITES.includes(p.ref) ? 56 : 80);
    if (it) { setItems([...d.items, it]); st.setSelectedId(it.id); sfx('pop'); }
  };
  const addItem = (p: DragPayload) => onDrop(p, CX + (Math.random() - 0.5) * widthAt(g, top) * 1.4, top - 40 - Math.random() * 50);

  const hitTop = (pt: { x: number; y: number }) => [...d.top].reverse().find((t) => Math.hypot(t.x - pt.x, t.y - pt.y + t.size * 0.3) < t.size);

  const onDown = (e: React.PointerEvent<SVGSVGElement>, pt: { x: number; y: number }, onItem: boolean) => {
    if (step >= 5) { if (!onItem) st.setSelectedId(null); return; }
    if (step === 2) {
      const t = hitTop(pt);
      if (t) {
        (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
        setTopSel(t.id);
        dragTop.current = { id: t.id, dx: pt.x - t.x, dy: pt.y - t.y };
      }
      return;
    }
    if (step === 4) {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      const p = clampTop(pt.x, pt.y);
      const c: ParfaitTop = { id: uid('c'), type: 'cream', flavor: creamFlavor, x: p.x, y: p.y, size: 16 };
      setPiping(c);
      sfx('pipe');
      const grow = () => {
        setPiping((prev) => (prev ? { ...prev, size: Math.min(74, prev.size + 1.1) } : prev));
        pipeTimer.current = requestAnimationFrame(grow);
      };
      pipeTimer.current = requestAnimationFrame(grow);
    }
  };
  const onMove = (_e: React.PointerEvent<SVGSVGElement>, pt: { x: number; y: number }) => {
    if (dragTop.current) {
      const id = dragTop.current.id;
      const p = clampTop(pt.x - dragTop.current.dx, pt.y - dragTop.current.dy);
      h.setLive((prev) => ({ ...prev, top: prev.top.map((t) => (t.id === id ? { ...t, ...p } : t)) }));
    }
    if (piping) {
      const p = clampTop(pt.x, pt.y);
      setPiping((prev) => (prev ? { ...prev, ...p } : prev));
    }
  };
  const onUp = () => {
    if (dragTop.current) { dragTop.current = null; h.commitLive(); }
    if (pipeTimer.current) { cancelAnimationFrame(pipeTimer.current); pipeTimer.current = null; }
    if (piping) {
      const c = { ...piping, size: Math.max(26, piping.size) };
      setPiping(null);
      set({ top: [...d.top, c] });
      sfx('pop');
    }
  };

  const ingredients = Array.from(new Set([
    ...d.layers.map((l) => layerOpt(l.kind).name),
    ...d.top.filter((t) => t.type === 'scoop').map((t) => `${iceCream(t.flavor).name} ice cream`),
    ...(d.top.some((t) => t.type === 'cream') ? ['Whipped cream'] : []),
    ...d.items.filter((i) => i.kind === 'sprite' && TOPPING_SPRITES.includes(i.ref)).map((i) => SPRITES[i.ref].name),
    ...(d.sauce !== 'none' ? [SAUCES.find((s) => s.id === d.sauce)!.name + ' sauce'] : []),
  ]));
  const mainFlavor = d.top.find((t) => t.type === 'scoop')?.flavor || d.layers.find((l) => l.kind.startsWith('ice-'))?.kind.replace('ice-', '') || 'Dream';
  const defaultName = `${mainFlavor === 'Dream' ? 'Dream' : iceCream(mainFlavor).name} Parfait`;
  const season = d.top.some((t) => t.flavor === 'sakura') ? 'spring' : d.layers.some((l) => l.kind === 'fruit-mango') ? 'summer' : d.top.some((t) => t.flavor === 'hojicha') ? 'autumn' : null;

  const scoopTray = (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
      {ICE_CREAMS.map((ic) => {
        const locked = !isUnlocked(`ice:${ic.id}`);
        const prev = <svg viewBox="-60 -70 120 110" className="h-11 w-12"><Scoop r={44} color={ic.color!} color2={ic.color2!} animal={nextAnimal.type !== 'none' ? nextAnimal : undefined} /></svg>;
        return <TrayTile key={ic.id} payload={{ type: 'icecream', ref: ic.id }} preview={prev} label={ic.name} locked={locked} fluid onAdd={(p) => addScoop(p.ref)} />;
      })}
    </div>
  );

  const panel = (() => {
    switch (step) {
      case 0:
        return <OptionGrid options={PARFAIT_GLASSES} value={d.glass} isLocked={(o) => o.id === 'crystal' && !isUnlocked('glass:crystal')} onPick={(o) => set({ glass: o.id })} render={(o) => <GlassThumb id={o.id} />} />;
      case 1:
      case 3: {
        const groups = step === 1 ? ['base'] : ['layer', 'ice', 'base'];
        return (
          <div className="flex flex-col gap-3">
            <p className="text-[11px] text-cocoa">Tap to stack, or drag a layer into the glass. Layers go in from the bottom up — reorder below.</p>
            {groups.map((gname) => (
              <div key={gname}>
                {step === 3 && <h3 className="mb-1 text-xs font-bold capitalize">{gname === 'base' ? 'Crunch, jelly & fruit' : gname === 'ice' ? 'Ice cream layers' : 'Cream & sauces'}</h3>}
                <div className="tile-grid">
                  {PARFAIT_LAYERS.filter((l) => l.group === gname).map((l) => (
                    <TrayTile key={l.id} payload={{ type: 'layer', ref: l.id }} label={l.name} onAdd={(p) => addLayer(p.ref)} size="sm"
                      preview={<span className="block h-7 w-10 rounded-lg border-2 border-white shadow" style={{ background: `linear-gradient(180deg, ${l.color}, ${l.color2 || l.color})` }} />} />
                  ))}
                </div>
              </div>
            ))}
            <h3 className="text-xs font-bold">Your stack (top first)</h3>
            <LayerStack d={d} set={(layers) => set({ layers })} />
          </div>
        );
      }
      case 2:
        return (
          <div className="flex flex-col gap-3">
            <p className="text-[11px] text-cocoa">Drag a flavor onto the top of the glass to scoop it there (drop inside the glass to make an ice-cream layer). Drag scoops on the glass to move them.</p>
            {scoopTray}
            <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
              <h3 className="mb-2 flex items-center gap-1 text-xs font-bold"><Sparkles size={14} />Cute animal ice cream</h3>
              <div className="mb-2 flex flex-wrap gap-1.5">{ANIMALS.map((a) => <button key={a} className={`chip ${nextAnimal.type === a ? '!bg-strawberry' : ''}`} onClick={() => { setNextAnimal({ ...nextAnimal, type: a }); if (selTop?.type === 'scoop') updTop(selTop.id, { animal: a === 'none' ? undefined : { ...(selTop.animal || nextAnimal), type: a } }); }}><Glyph name={ANIMAL_GLYPH[a]} size={22} /> {a}</button>)}</div>
              <div className="mb-2 flex flex-wrap gap-1.5">{FACES.map((f) => <button key={f} className={`chip ${nextAnimal.face === f ? '!bg-butter' : ''}`} onClick={() => { setNextAnimal({ ...nextAnimal, face: f }); if (selTop?.animal) updTop(selTop.id, { animal: { ...selTop.animal, face: f } }); }}>{f}</button>)}</div>
              <div className="flex flex-wrap gap-1.5">{ACCS.map((a) => <button key={a} className={`chip ${nextAnimal.acc === a ? '!bg-matcha' : ''}`} onClick={() => { setNextAnimal({ ...nextAnimal, acc: a }); if (selTop?.animal) updTop(selTop.id, { animal: { ...selTop.animal, acc: a } }); }}>{a === 'none' ? 'no accessory' : a}</button>)}</div>
            </div>
            {selTop && (
              <div className="flex flex-col gap-2 rounded-2xl border-2 border-dashed border-strawberry p-3">
                <div className="flex items-center justify-between text-xs font-bold"><span>Selected {selTop.type}</span>
                  <button className="chip !text-strawberry-dark" onClick={() => { set({ top: d.top.filter((t) => t.id !== selTop.id) }); setTopSel(null); }}><Trash2 size={12} />Remove</button></div>
                <Slider label="Size" value={selTop.size} min={24} max={70} onChange={(v) => h.setLive({ ...d, top: d.top.map((t) => (t.id === selTop.id ? { ...t, size: v } : t)) })} onCommit={h.commitLive} />
              </div>
            )}
            <LayerStack d={d} set={(layers) => set({ layers })} />
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl bg-sky/50 p-3 text-xs font-bold text-[#35617A]"><Glyph name="cupcake" className="mr-1" />Press and hold on top of the parfait to pipe cream — hold longer for a bigger swirl. Drag while holding to aim.</div>
            <div className="tile-grid">
              {CREAM_COLORS.map((c) => (
                <button key={c.id} className={`tile ${creamFlavor === c.id ? 'tile-on' : ''}`} onClick={() => setCreamFlavor(c.id)}>
                  <svg viewBox="-50 -60 100 70" className="h-9 w-11"><WhippedCream w={70} color={c.color} color2={c.color2} /></svg>
                  <span className="text-[10px]">{c.name}</span>
                </button>
              ))}
            </div>
            <button className="btn-pink" onClick={() => { const n = d.top.filter((t) => t.type === 'cream').length; set({ top: [...d.top, { id: uid('c'), type: 'cream', flavor: creamFlavor, x: CX + (n % 2 ? 40 : -40), y: top - 4, size: 50 }] }); sfx('pipe'); }}>+ Quick swirl</button>
            {d.top.some((t) => t.type === 'cream') && <button className="btn-cream btn-sm" onClick={() => { const i = d.top.map((t) => t.type).lastIndexOf('cream'); set({ top: d.top.filter((_, k) => k !== i) }); }}>Remove last swirl</button>}
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col gap-3">
            <p className="text-[11px] text-cocoa">Tap or drag toppings onto your parfait. Move, resize, rotate or delete them with the handles.</p>
            <div className="tile-grid">
              {TOPPING_SPRITES.map((s) => <TrayTile key={s} size="sm" payload={{ type: 'sprite', ref: s }} preview={<SpriteThumb id={s} size={36} />} label={SPRITES[s].name} onAdd={addItem} />)}
            </div>
            <h3 className="text-xs font-bold">Sauce drizzle</h3>
            <div className="flex flex-wrap gap-1.5">{SAUCES.map((s) => <button key={s.id} className={`chip ${d.sauce === s.id ? '!bg-strawberry' : ''}`} onClick={() => { set({ sauce: s.id }); sfx('pour'); }}>{s.color && <Swatch c={s.color} size={14} />}{s.name}</button>)}</div>
          </div>
        );
      default:
        return <DecorPanel onAdd={addItem} items={d.items} selectedId={st.selectedId} onSelect={st.setSelectedId}
          extraTabs={[{ id: 'fruit', label: 'Toppings', icon: <CherryIcon size={14} />, content: (
            <div className="tile-grid">{TOPPING_SPRITES.map((s) => <TrayTile key={s} size="sm" payload={{ type: 'sprite', ref: s }} preview={<SpriteThumb id={s} size={36} />} label={SPRITES[s].name} onAdd={addItem} />)}</div>
          ) }]} />;
    }
  })();

  return (
    <>
      <StudioShell
        title="Parfait Atelier" jp="パフェアトリエ" mode="parfait"
        subtitle="Layer jelly, flakes, fruit and ice cream — then crown it with cute toppings."
        steps={STEPS} step={step} setStep={setStep}
        canNext={step === 1 ? d.layers.length > 0 : true} nextHint="Add a base layer first"
        undo={{ undo: h.undo, redo: h.redo, canUndo: h.canUndo, canRedo: h.canRedo }}
        stageHint={step === 4 ? <span className="chip"><Glyph name="cream" />Press & hold to pipe</span> : step === 2 ? <span className="chip"><Glyph name="icecream" />Drag scoops onto the glass</span> : null}
        stageTools={<BgPicker value={st.bg || 'bg-fukuda'} onChange={st.setBg} />}
        onFinish={() => { st.setSelectedId(null); setTopSel(null); setResult(true); }}
        finishLabel="Finish parfait"
        stage={
          <Stage ref={st.svgRef} width={400} height={520} bgClassName={st.bg || 'bg-fukuda'} maxHeight="var(--stage-max-h)"
            onDrop={onDrop} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} cursor={step === 4 ? 'crosshair' : undefined} ariaLabel="Your parfait">
            <ParfaitArt d={d} animate pipingPreview={piping} />
            {step === 2 && selTop && <circle data-export-ignore cx={selTop.x} cy={selTop.y - selTop.size * 0.3} r={selTop.size * 1.05} fill="none" stroke="#E8869F" strokeWidth="2" strokeDasharray="6 5" pointerEvents="none" />}
            <ItemsLayer items={d.items} selectedId={st.selectedId} onSelect={st.setSelectedId} onLive={(items) => h.setLive({ ...d, items })} onCommit={h.commitLive}
              onDelete={(id) => { setItems(d.items.filter((x) => x.id !== id)); st.setSelectedId(null); }} interactive={step >= 5} />
          </Stage>
        }
        stageFooter={step >= 5 ? <ItemToolbar items={d.items} selectedId={st.selectedId} setItems={setItems} onSelect={st.setSelectedId} /> : null}
        panel={panel}
      />
      <ResultModal open={result} onClose={() => setResult(false)} svgRef={st.svgRef} size={{ w: 400, h: 520 }} type="parfait"
        defaultName={defaultName} ingredients={ingredients} data={d} editingId={st.editingId} season={season}
        onSaved={(c) => st.setEditingId(c.id)} onNew={() => { h.reset(emptyParfait()); st.setEditingId(null); setStep(0); }} />
    </>
  );
}
