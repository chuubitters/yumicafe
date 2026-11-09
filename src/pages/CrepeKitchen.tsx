import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { Droplet, FlipVertical2, ImagePlus, RefreshCw, Sparkles, Wand2 } from 'lucide-react';
import { StudioShell, OptionGrid, Swatch } from '../components/game/StudioShell';
import { Stage } from '../components/game/Stage';
import { ItemsLayer } from '../components/game/StageItems';
import { ItemToolbar } from '../components/game/ItemToolbar';
import { DecorPanel } from '../components/game/DecorPanel';
import { ResultModal } from '../components/game/ResultModal';
import { BgPicker } from '../components/game/BgPicker';
import { makeItem } from '../components/game/itemUtils';
import { openImageLibrary } from '../components/game/ImageLibrary';
import { CrepeArt, CrepePan, FlatCrepe } from '../art/CrepeArt';
import { ArtDefs } from '../art/Defs';
import { useHistory } from '../hooks/useHistory';
import { useStudio } from '../hooks/useStudio';
import { emptyCrepe, sampleCrepe } from '../data/samples';
import { BATTERS, CREPE_CREAMS, CREPE_FRUITS, CREPE_OTHERS, CREPE_SAUCES, CREPE_TOPPINGS, WRAPPERS } from '../data/catalog';
import type { CrepeData, StageItem } from '../types';
import type { DragPayload } from '../components/game/dnd';
import { sfx } from '../utils/sound';
import { clamp } from '../utils/misc';
import { useAssets } from '../store/assetStore';

const STEPS = [
  { id: 'batter', label: 'Choose batter', jp: '生地' },
  { id: 'cook', label: 'Cook the crêpe', jp: '焼く' },
  { id: 'fill', label: 'Fillings', jp: 'フィリング' },
  { id: 'deco', label: 'Sauces & toppings', jp: 'デコ' },
  { id: 'fold', label: 'Fold', jp: 'たたむ' },
  { id: 'wrap', label: 'Wrapper & stickers', jp: 'ラッピング' },
];
const FOLDS = [
  { id: 'cone', name: 'Japanese cone', jp: 'コーン' },
  { id: 'half', name: 'Half-fold', jp: 'ハーフ' },
  { id: 'roll', name: 'Roll', jp: 'ロール' },
];
const toggle = (arr: string[], id: string) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

export default function CrepeKitchen() {
  const h = useHistory<CrepeData>(emptyCrepe);
  const d = h.state;
  const [step, setStep] = useState(0);
  const [radius, setRadius] = useState(0);
  const [pour, setPour] = useState<{ x: number; y: number } | null>(null);
  const [tool, setTool] = useState<{ x: number; y: number } | null>(null);
  const [result, setResult] = useState(false);
  const flipCtl = useAnimationControls();
  const holdRef = useRef<number | null>(null);
  const spread = useRef<{ a: number } | null>(null);
  const wrapperUrl = useAssets((s) => (d.wrapperAsset ? s.urls[d.wrapperAsset] : undefined));
  const st = useStudio<CrepeData>('crepe', (data) => { h.reset(data); setRadius(170); setStep(5); });

  const set = (p: Partial<CrepeData>) => h.set({ ...d, ...p });
  const setItems = (items: StageItem[]) => h.set({ ...d, items });
  const cooking = step === 1 && radius >= 150 && d.cookLevel < 1;

  // cooking timer
  useEffect(() => {
    if (!cooking) return;
    const t = window.setInterval(() => {
      h.setLive((p) => {
        const next = Math.min(p.flipped ? 1 : 0.85, p.cookLevel + 0.025);
        return next === p.cookLevel ? p : { ...p, cookLevel: next };
      });
      if (Math.random() < 0.15) sfx('sizzle');
    }, 120);
    return () => { clearInterval(t); h.commitLive(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cooking, d.flipped]);

  const resetCook = () => { setRadius(0); h.set((p) => ({ ...p, cookLevel: 0, flipped: false })); };

  const onDown = (e: React.PointerEvent<SVGSVGElement>, pt: { x: number; y: number }, onItem: boolean) => {
    if (step !== 1) { if (!onItem) st.setSelectedId(null); return; }
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    if (radius < 60 && !d.flipped) {
      sfx('pour');
      setPour({ x: 200, y: 250 });
      const grow = () => {
        setRadius((r) => Math.min(95, r + 1.6));
        holdRef.current = requestAnimationFrame(grow);
      };
      holdRef.current = requestAnimationFrame(grow);
    } else if (radius < 168) {
      spread.current = { a: Math.atan2(pt.y - 250, pt.x - 200) };
      setTool(pt);
    }
  };
  const onMove = (_e: React.PointerEvent<SVGSVGElement>, pt: { x: number; y: number }) => {
    if (!spread.current) return;
    setTool(pt);
    const a = Math.atan2(pt.y - 250, pt.x - 200);
    let da = a - spread.current.a;
    if (da > Math.PI) da -= Math.PI * 2;
    if (da < -Math.PI) da += Math.PI * 2;
    spread.current.a = a;
    const dist = Math.hypot(pt.x - 200, pt.y - 250);
    if (Math.abs(da) > 0.01 && dist > 30) {
      setRadius((r) => clamp(r + Math.abs(da) * 9, 0, 170));
      if (Math.random() < 0.2) sfx('stir');
    }
  };
  const onUp = () => {
    if (holdRef.current) { cancelAnimationFrame(holdRef.current); holdRef.current = null; }
    setPour(null);
    spread.current = null;
    setTool(null);
  };

  const flip = async () => {
    sfx('flip');
    await flipCtl.start({ scaleY: [1, 0.05], y: [0, -60], transition: { duration: 0.28 } });
    h.set((p) => ({ ...p, flipped: true }));
    await flipCtl.start({ scaleY: [0.05, 1], y: [-60, 0], transition: { duration: 0.32 } });
  };

  const onDrop = (p: DragPayload, x: number, y: number) => {
    const it = makeItem(p, x, y, 70);
    if (it) { setItems([...d.items, it]); st.setSelectedId(it.id); sfx('pop'); }
  };
  const addItem = (p: DragPayload) => onDrop(p, 200 + (Math.random() - 0.5) * 140, 360 + (Math.random() - 0.5) * 80);

  const cookDone = d.flipped && d.cookLevel >= 0.99;
  const canNext = step === 1 ? cookDone : step === 2 ? d.fillings.length > 0 : true;
  const nextHint = step === 1 ? (radius < 60 ? 'Hold on the pan to pour' : radius < 150 ? 'Spread in circles' : !d.flipped ? (d.cookLevel >= 0.55 ? 'Flip it!' : 'Cooking…') : 'Almost golden…') : 'Add at least one filling';

  const all = [...CREPE_CREAMS, ...CREPE_FRUITS, ...CREPE_OTHERS];
  const ingredients = [BATTERS.find((b) => b.id === d.batter)!.name + ' batter', ...d.fillings.map((f) => all.find((x) => x.id === f)?.name || f), ...d.sauces.map((s) => CREPE_SAUCES.find((x) => x.id === s)!.name)];
  const fruit = CREPE_FRUITS.find((f) => d.fillings.includes(f.id));
  const defaultName = `${fruit ? fruit.name + ' ' : ''}${d.batter !== 'original' ? BATTERS.find((b) => b.id === d.batter)!.name + ' ' : ''}Crêpe`;

  const stageArt = (() => {
    if (step <= 1) {
      return (
        <g>
          <motion.g animate={flipCtl} style={{ transformOrigin: '200px 250px' }}>
            <CrepePan radius={step === 0 ? 0 : radius} cook={d.cookLevel} flipped={d.flipped} batterId={d.batter} pour={pour} />
          </motion.g>
          {step === 0 && (
            <g transform="translate(200 250)">
              <ellipse cx="0" cy="-10" rx="90" ry="70" fill="url(#yc-ceramic)" stroke="#E0D6C8" strokeWidth="3" />
              <ellipse cx="0" cy="-16" rx="74" ry="52" fill={BATTERS.find((b) => b.id === d.batter)!.color} />
              <ellipse cx="-20" cy="-30" rx="26" ry="10" fill="#fff" opacity=".35" />
              <rect x="40" y="-90" width="10" height="100" rx="5" fill="url(#yc-wood)" transform="rotate(30)" />
            </g>
          )}
          {tool && (
            <g data-export-ignore pointerEvents="none" transform={`translate(${tool.x} ${tool.y}) rotate(${(Math.atan2(tool.y - 250, tool.x - 200) * 180) / Math.PI + 90})`}>
              <rect x="-4" y="-70" width="8" height="70" rx="4" fill="url(#yc-wood)" />
              <rect x="-40" y="-6" width="80" height="12" rx="6" fill="#D8B58A" />
            </g>
          )}
        </g>
      );
    }
    if (step <= 3) return <FlatCrepe d={d} />;
    return <g key={d.fold}><CrepeArt d={d} animate /></g>;
  })();

  const fillTile = (o: { id: string; name: string; color?: string }, emoji?: string) => (
    <button key={o.id} onClick={() => { set({ fillings: toggle(d.fillings, o.id) }); sfx(o.id.startsWith('cream') ? 'pipe' : 'drop'); }} className={`tile ${d.fillings.includes(o.id) ? 'tile-on' : ''}`}>
      {emoji ? <span className="text-xl">{emoji}</span> : <Swatch c={o.color || '#fff'} />}
      <span className="text-[10px]">{o.name}</span>
    </button>
  );

  const panel = (() => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col gap-3">
            <OptionGrid options={BATTERS} value={d.batter} cols="grid-cols-2" onPick={(o) => { setRadius(0); h.set((p) => ({ ...p, batter: o.id, cookLevel: 0, flipped: false })); }} render={(o) => <Swatch c={o.color!} size={40} />} />
            <div className="rounded-2xl bg-white/80 p-3 text-xs text-cocoa">Harajuku-style crêpes are paper-thin and lacy. Pick a batter, then head to the griddle!</div>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col gap-3">
            <ol className="flex flex-col gap-2 text-xs font-bold">
              <li className={`rounded-2xl px-3 py-2 ${radius >= 60 ? 'bg-matcha/50 text-matcha-dark' : 'bg-strawberry/40'}`}>1. Press & hold on the pan to pour batter {radius >= 60 && '✓'}</li>
              <li className={`rounded-2xl px-3 py-2 ${radius >= 150 ? 'bg-matcha/50 text-matcha-dark' : radius >= 60 ? 'bg-strawberry/40' : 'bg-white/70'}`}>2. Drag in circles with the spreader {radius >= 150 && '✓'}</li>
              <li className={`rounded-2xl px-3 py-2 ${d.flipped ? 'bg-matcha/50 text-matcha-dark' : radius >= 150 ? 'bg-strawberry/40' : 'bg-white/70'}`}>3. Watch the bubbles, then flip {d.flipped && '✓'}</li>
              <li className={`rounded-2xl px-3 py-2 ${cookDone ? 'bg-matcha/50 text-matcha-dark' : 'bg-white/70'}`}>4. Cook until golden {cookDone && '✓'}</li>
            </ol>
            <div className="h-3 overflow-hidden rounded-full bg-cream"><motion.div className="h-full rounded-full bg-gradient-to-r from-butter to-[#D99A4C]" animate={{ width: `${d.cookLevel * 100}%` }} /></div>
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-butter" disabled={radius >= 60} onClick={() => { sfx('pour'); setRadius(90); }}><Droplet size={16} />Pour</button>
              <button className="btn-butter" disabled={radius < 60 || radius >= 168} onClick={() => setRadius((r) => Math.min(170, r + 40))}><Wand2 size={16} />Spread</button>
              <button className="btn-deep col-span-2" disabled={d.flipped || d.cookLevel < 0.55} onClick={flip}><FlipVertical2 size={16} />Flip the crêpe!</button>
              <button className="btn-cream col-span-2 btn-sm" onClick={resetCook}><RefreshCw size={14} />Start over</button>
            </div>
            {cookDone && <div className="rounded-2xl bg-matcha/40 p-2 text-center text-sm font-bold text-matcha-dark">Perfectly golden! ✿</div>}
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold">Cream</h3>
            <div className="grid grid-cols-4 gap-2">{CREPE_CREAMS.map((o) => fillTile(o))}</div>
            <h3 className="text-xs font-bold">Fruit</h3>
            <div className="grid grid-cols-4 gap-2">{CREPE_FRUITS.map((o) => fillTile(o, { 'fruit-strawberry': '🍓', 'fruit-banana': '🍌', 'fruit-kiwi': '🥝', 'fruit-peach': '🍑' }[o.id]))}</div>
            <h3 className="text-xs font-bold">Extras</h3>
            <div className="grid grid-cols-3 gap-2">{CREPE_OTHERS.map((o) => fillTile(o, { custard: '🍮', brownie: '🟫', pudding: '🍮', mochi: '🍡', crumbs: '🍪', cheesecake: '🧀' }[o.id]))}</div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold">Sauces</h3>
            <div className="grid grid-cols-2 gap-2">{CREPE_SAUCES.map((o) => (
              <button key={o.id} className={`tile flex-row gap-2 ${d.sauces.includes(o.id) ? 'tile-on' : ''}`} onClick={() => { set({ sauces: toggle(d.sauces, o.id) }); sfx('pour'); }}><Swatch c={o.color!} size={22} />{o.name}</button>
            ))}</div>
            <h3 className="text-xs font-bold">Toppings</h3>
            <div className="grid grid-cols-2 gap-2">{CREPE_TOPPINGS.map((o) => (
              <button key={o.id} className={`tile ${d.toppings.includes(o.id) ? 'tile-on' : ''}`} onClick={() => { set({ toppings: toggle(d.toppings, o.id) }); sfx('pop'); }}>
                <span className="text-xl">{{ whipped: '🍦', sprinkles: '✨', cherries: '🍒', minicookies: '🍪' }[o.id]}</span>{o.name}
              </button>
            ))}</div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col gap-3">
            <OptionGrid options={FOLDS} value={d.fold} cols="grid-cols-3" onPick={(o) => { set({ fold: o.id as CrepeData['fold'] }); sfx('flip'); }}
              render={(o) => <svg viewBox={o.id === 'cone' ? '60 100 290 430' : '0 220 400 260'} className="h-16 w-14"><ArtDefs /><CrepeArt d={{ ...sampleCrepe(), batter: d.batter, fold: o.id as CrepeData['fold'] }} /></svg>} />
            <p className="text-xs text-cocoa">The Japanese cone is the classic Harajuku street style — wrapped in paper so you can walk and eat!</p>
          </div>
        );
      default:
        return (
          <DecorPanel onAdd={addItem} items={d.items} selectedId={st.selectedId} onSelect={st.setSelectedId}
            extraTabs={[{
              id: 'wrap', label: 'Wrapper', icon: <Sparkles size={14} />, content: (
                <div className="flex flex-col gap-3">
                  {d.fold !== 'cone' && <p className="rounded-xl bg-butter/60 px-3 py-2 text-xs font-bold">Wrappers show on cone crêpes — switch the fold to “Japanese cone” to see them.</p>}
                  <div className="grid grid-cols-3 gap-2">
                    {WRAPPERS.map((w) => (
                      <button key={w.id} className={`tile ${d.wrapper === w.id ? 'tile-on' : ''}`} onClick={async () => {
                        if (w.id === 'custom') { const id = await openImageLibrary('Custom crêpe wrapper'); if (id) set({ wrapper: 'custom', wrapperAsset: id }); }
                        else set({ wrapper: w.id });
                        sfx('pop');
                      }}>
                        {w.id === 'custom' ? (wrapperUrl ? <img src={wrapperUrl} alt="" className="h-8 w-8 rounded-lg object-cover" /> : <ImagePlus size={22} />) : (
                          <svg viewBox="0 0 40 30" className="h-8 w-10"><rect width="40" height="30" rx="6" fill={w.id === 'cream' ? 'url(#yc-kraft)' : w.id === 'matcha' ? 'url(#yc-ging-green)' : w.id === 'floral' ? 'url(#yc-floral)' : 'url(#yc-ging-pink)'} /></svg>
                        )}
                        <span className="text-[10px]">{w.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ),
            }]} />
        );
    }
  })();

  return (
    <>
      <StudioShell
        title="Crêpe Kitchen" jp="クレープキッチン" accent="!bg-[#E8607E]"
        subtitle="Pour, swirl, flip and fold a Harajuku-style crêpe."
        steps={STEPS} step={step} setStep={setStep} canNext={canNext} nextHint={nextHint}
        undo={{ undo: h.undo, redo: h.redo, canUndo: h.canUndo, canRedo: h.canRedo }}
        stageHint={step === 1 ? <span className="chip">{nextHint}</span> : null}
        stageTools={<BgPicker value={st.bg || 'bg-strawberry-drip'} onChange={st.setBg} />}
        onFinish={() => { st.setSelectedId(null); setResult(true); }}
        finishLabel="Finish crêpe ✿"
        stage={
          <Stage ref={st.svgRef} width={400} height={520} bgClassName={st.bg || 'bg-strawberry-drip'} maxHeight="var(--stage-max-h)"
            onDrop={onDrop} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} cursor={step === 1 ? 'crosshair' : undefined} ariaLabel="Your crêpe">
            {stageArt}
            {step >= 4 && (
              <ItemsLayer items={d.items} selectedId={st.selectedId} onSelect={st.setSelectedId} onLive={(items) => h.setLive({ ...d, items })} onCommit={h.commitLive}
                onDelete={(id) => { setItems(d.items.filter((x) => x.id !== id)); st.setSelectedId(null); }} interactive={step === 5} />
            )}
          </Stage>
        }
        stageFooter={step === 5 ? <ItemToolbar items={d.items} selectedId={st.selectedId} setItems={setItems} onSelect={st.setSelectedId} /> : null}
        panel={panel}
      />
      <ResultModal open={result} onClose={() => setResult(false)} svgRef={st.svgRef} size={{ w: 400, h: 520 }} type="crepe"
        defaultName={defaultName} ingredients={ingredients} data={d} editingId={st.editingId} season={d.fillings.includes('fruit-strawberry') ? 'spring' : null}
        onSaved={(c) => st.setEditingId(c.id)} onNew={() => { h.reset(emptyCrepe()); setRadius(0); st.setEditingId(null); setStep(0); }} />
    </>
  );
}
