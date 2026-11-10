import { useMemo, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { BookOpen, Shuffle, Sparkles, ImagePlus, Vibrate } from 'lucide-react';
import { StudioShell, OptionGrid, Slider, Swatch } from '../components/game/StudioShell';
import { Stage } from '../components/game/Stage';
import { ItemsLayer } from '../components/game/StageItems';
import { ItemToolbar } from '../components/game/ItemToolbar';
import { DecorPanel } from '../components/game/DecorPanel';
import { ResultModal } from '../components/game/ResultModal';
import { BgPicker } from '../components/game/BgPicker';
import { makeItem } from '../components/game/itemUtils';
import { openImageLibrary } from '../components/game/ImageLibrary';
import { DrinkArt, liquidInfo, Straw } from '../art/DrinkArt';
import { ArtDefs } from '../art/Defs';
import { CX, GLASSES } from '../art/glass';
import { Scoop } from '../art/food';
import { useHistory } from '../hooks/useHistory';
import { useStudio } from '../hooks/useStudio';
import { emptyDrink, recipeDrink } from '../data/samples';
import { BASES, DRINK_GLASSES, DRINK_RECIPES, DRINK_TOPPINGS, FLAVORS, GARNISH, ICE_CREAMS, ICE_TYPES, LABEL_STYLES, STRAWS } from '../data/catalog';
import { useUnlocked } from '../store/gameStore';
import type { DrinkData, StageItem } from '../types';
import type { DragPayload } from '../components/game/dnd';
import { sfx } from '../utils/sound';
import { clamp } from '../utils/misc';
import { useAssets } from '../store/assetStore';
import { Glyph, type GlyphName } from '../components/common/Glyph';

const STEPS = [
  { id: 'start', label: 'Recipe or Free', jp: 'はじめに' },
  { id: 'glass', label: 'Choose glass', jp: 'グラス' },
  { id: 'base', label: 'Pour the base', jp: 'ベース' },
  { id: 'flavor', label: 'Add flavor', jp: 'フレーバー' },
  { id: 'ice', label: 'Add ice', jp: 'こおり' },
  { id: 'mix', label: 'Mix it', jp: 'まぜる' },
  { id: 'toppings', label: 'Toppings', jp: 'トッピング' },
  { id: 'decorate', label: 'Decorate', jp: 'デコレーション' },
];

const nameOf = (list: { id: string; name: string }[], id: string | null | undefined) => list.find((x) => x.id === id)?.name || '';

function GlassThumb({ id }: { id: string }) {
  const g = GLASSES[id];
  const d = useMemo(() => ({ ...emptyDrink(), glass: id }), [id]);
  if (!g) return null;
  return <svg viewBox="80 110 240 380" className="h-14 w-12 rounded-lg bg-showa"><ArtDefs /><DrinkArt d={d} /></svg>;
}

export default function DrinkStudio() {
  const h = useHistory<DrinkData>(emptyDrink);
  const d = h.state;
  const [step, setStep] = useState(0);
  const [pour, setPour] = useState<{ color: string; key: number } | null>(null);
  const [stirring, setStirring] = useState(false);
  const [spoon, setSpoon] = useState<{ x: number; y: number } | null>(null);
  const [result, setResult] = useState(false);
  const isUnlocked = useUnlocked();
  const shake = useAnimationControls();
  const stir = useRef<{ a: number } | null>(null);
  const labelUrl = useAssets((s) => (d.labelAsset ? s.urls[d.labelAsset] : undefined));

  const st = useStudio<DrinkData>('drink', (data) => { h.reset(data); setStep(7); });
  const recipe = DRINK_RECIPES.find((r) => r.id === d.recipeId) || null;
  const target = recipe ? { ...emptyDrink(), ...recipe.data } : null;

  const set = (p: Partial<DrinkData>) => h.set({ ...d, ...p });
  const setItems = (items: StageItem[]) => h.set({ ...d, items });

  const doPour = (color: string) => {
    sfx('pour');
    setPour({ color, key: Date.now() });
    setTimeout(() => setPour(null), 900);
  };

  const info = liquidInfo(d);
  const hasLiquid = info.total > 0;
  const canNext = step === 2 ? !!d.base : true;

  // ------- stage interactions: stirring in the Mix step
  const onDown = (e: React.PointerEvent<SVGSVGElement>, pt: { x: number; y: number }, onItem: boolean) => {
    if (step === 7) {
      if (!onItem) st.setSelectedId(null);
      return;
    }
    if (step === 5 && hasLiquid) {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      stir.current = { a: Math.atan2(pt.y - (info.liquidTop + info.bot) / 2, pt.x - CX) };
      setStirring(true);
      setSpoon(pt);
    }
  };
  const onMove = (_e: React.PointerEvent<SVGSVGElement>, pt: { x: number; y: number }) => {
    if (!stir.current) return;
    setSpoon(pt);
    const a = Math.atan2(pt.y - (info.liquidTop + info.bot) / 2, pt.x - CX);
    let da = a - stir.current.a;
    if (da > Math.PI) da -= Math.PI * 2;
    if (da < -Math.PI) da += Math.PI * 2;
    stir.current.a = a;
    if (Math.abs(da) > 0.01) {
      sfx('stir');
      h.setLive((p) => ({ ...p, mixed: clamp(p.mixed + Math.abs(da) / (Math.PI * 2 * 5), 0, 1) }));
    }
  };
  const onUp = () => {
    if (!stir.current) return;
    stir.current = null;
    setStirring(false);
    setSpoon(null);
    h.commitLive();
  };

  const onDrop = (p: DragPayload, x: number, y: number) => {
    if (p.type === 'icecream') { set({ iceCream: p.ref }); sfx('scoop'); return; }
    if (p.type === 'topping') { if (!d.toppings.includes(p.ref)) set({ toppings: [...d.toppings, p.ref] }); sfx('pop'); return; }
    const it = makeItem(p, x, y, 80);
    if (it) { setItems([...d.items, it]); st.setSelectedId(it.id); sfx('pop'); }
  };
  const addDecor = (p: DragPayload) => onDrop(p, CX + (Math.random() - 0.5) * 120, 260 + (Math.random() - 0.5) * 120);

  const doShake = async () => {
    if (!hasLiquid) return;
    sfx('shake');
    await shake.start({ rotate: [0, -8, 8, -8, 8, -4, 4, 0], x: [0, -10, 10, -10, 10, -4, 4, 0], transition: { duration: 0.9 } });
    set({ mixed: 1 });
  };

  const startFree = () => { h.reset(emptyDrink()); setStep(1); sfx('pop'); };
  const startRecipe = (id: string) => { h.reset({ ...emptyDrink(), recipeId: id }); setStep(1); sfx('pop'); };

  const matchesRecipe = () => {
    if (!target) return false;
    return d.glass === target.glass && d.base === target.base && d.flavor === target.flavor && d.ice === target.ice
      && d.iceCream === target.iceCream && d.cream === target.cream && target.toppings.every((t) => d.toppings.includes(t));
  };

  const ingredients = [
    nameOf(BASES, d.base), d.flavor !== 'none' ? nameOf(FLAVORS, d.flavor) : '', d.ice !== 'none' ? nameOf(ICE_TYPES, d.ice) : '',
    d.iceCream ? `${nameOf(ICE_CREAMS, d.iceCream)} ice cream` : '', d.cream ? 'Whipped cream' : '', ...d.toppings.map((t) => nameOf(DRINK_TOPPINGS, t)),
  ].filter(Boolean);
  const season = [...FLAVORS, ...BASES].find((x) => (x.id === d.flavor || x.id === d.base) && x.season)?.season || null;
  const defaultName = recipe ? recipe.name : `${d.flavor !== 'none' ? nameOf(FLAVORS, d.flavor) + ' ' : ''}${nameOf(BASES, d.base) || 'Dream'} ${d.iceCream ? 'Float' : 'Drink'}`;

  const recHint = (list: string[] | string | null | undefined) => (recipe ? list ?? null : null);

  // ------- panels
  const panel = (() => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <button className="tile !py-4" onClick={startFree}><Shuffle className="text-strawberry-deep" /><span className="font-display text-sm">Free Mix</span><span className="text-[10px] font-normal">Create anything</span></button>
              <div className="tile !py-4"><BookOpen className="text-matcha-deep" /><span className="font-display text-sm">Recipe Mode</span><span className="text-[10px] font-normal">Pick a recipe below</span></div>
            </div>
            <div className="flex flex-col gap-2">
              {DRINK_RECIPES.map((r) => (
                <button key={r.id} onClick={() => startRecipe(r.id)} className="card-hover flex gap-3 rounded-2xl bg-white/90 p-2 text-left shadow-soft">
                  <svg viewBox="70 50 260 460" className="h-24 w-16 shrink-0 rounded-xl bg-showa"><ArtDefs /><DrinkArt d={recipeDrink(r.id)} /></svg>
                  <span className="min-w-0 flex-1">
                    <span className="label-jp block text-[10px] text-strawberry-deep">{r.jp}</span>
                    <span className="block font-display text-sm leading-tight">{r.name}</span>
                    <span className="block text-[11px] text-cocoa">{r.desc}</span>
                    <span className="mt-1 flex flex-wrap gap-1">
                      {[nameOf(BASES, r.data.base), r.data.flavor !== 'none' ? nameOf(FLAVORS, r.data.flavor!) : null, r.data.iceCream ? nameOf(ICE_CREAMS, r.data.iceCream) + ' ice' : null, ...(r.data.toppings || []).map((t) => nameOf(DRINK_TOPPINGS, t))].filter(Boolean).map((x) => <span key={x} className="rounded-full bg-cream px-1.5 text-[9px] font-bold">{x}</span>)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      case 1:
        return <OptionGrid options={DRINK_GLASSES} value={d.glass} recommended={recHint(target?.glass)} isLocked={(o) => !isUnlocked(`glass:${o.id}`)} onPick={(o) => set({ glass: o.id })} render={(o) => <GlassThumb id={o.id} />} />;
      case 2:
        return (
          <div className="flex flex-col gap-3">
            <OptionGrid options={BASES} value={d.base} recommended={recHint(target?.base)} onPick={(o) => { set({ base: o.id }); doPour(o.color!); }} render={(o) => <Swatch c={o.color!} />} />
            {d.base && <Slider label="Base amount" value={d.baseAmount} min={30} max={100} onChange={(v) => h.setLive({ ...d, baseAmount: v })} onCommit={h.commitLive} />}
            {(d.base === 'matcha' || d.base === 'hojicha') && <p className="text-[11px] text-cocoa">Lattes pour over cold milk for that pretty two-tone look.</p>}
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-3">
            <OptionGrid options={FLAVORS} value={d.flavor} recommended={recHint(target?.flavor)} isLocked={(o) => !isUnlocked(`flavor:${o.id}`)} onPick={(o) => { set({ flavor: o.id, flavorAmount: o.id === 'none' ? 0 : Math.max(15, d.flavorAmount) }); if (o.id !== 'none') doPour(o.color!); }} render={(o) => <Swatch c={o.color!} />} />
            {d.flavor !== 'none' && <Slider label="Syrup amount" value={d.flavorAmount} min={5} max={50} onChange={(v) => h.setLive({ ...d, flavorAmount: v })} onCommit={h.commitLive} />}
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col gap-3">
            <OptionGrid options={ICE_TYPES} value={d.ice} recommended={recHint(target?.ice)} onPick={(o) => { set({ ice: o.id }); if (o.id !== 'none') sfx('ice'); }}
              render={(o) => <Glyph name={o.id === 'none' ? 'none' : o.id === 'heart' ? 'heart' : o.id === 'star' ? 'star' : 'ice'} size={30} />} />
            {d.ice !== 'none' && d.ice !== 'crushed' && <Slider label="How many cubes" value={d.iceCount} min={1} max={8} onChange={(v) => set({ iceCount: v })} />}
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl bg-sky/50 p-3 text-xs font-bold text-[#35617A]"><Glyph name="spoon" className="mr-1" />Draw circles on the glass to stir. Keep some layers for a gradient, or shake it for a perfect blend!</div>
            <div className="h-3 overflow-hidden rounded-full bg-cream"><motion.div className="h-full rounded-full bg-gradient-to-r from-strawberry to-matcha" animate={{ width: `${d.mixed * 100}%` }} /></div>
            <div className="flex gap-2">
              <button className="btn-sky flex-1" onClick={doShake} disabled={!hasLiquid}><Vibrate size={16} />Shake!</button>
              <button className="btn-cream flex-1" onClick={() => set({ mixed: 0 })}>Re-layer</button>
            </div>
            <Slider label="Base amount" value={d.baseAmount} min={30} max={100} onChange={(v) => h.setLive({ ...d, baseAmount: v })} onCommit={h.commitLive} />
            {d.flavor !== 'none' && <Slider label="Syrup amount" value={d.flavorAmount} min={5} max={50} onChange={(v) => h.setLive({ ...d, flavorAmount: v })} onCommit={h.commitLive} />}
            {!hasLiquid && <p className="text-xs text-strawberry-dark">Pour a base first!</p>}
          </div>
        );
      case 6:
        return (
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold">Ice cream <span className="font-normal text-cocoa">(tap or drag onto the glass)</span></h3>
            <div className="tile-grid">
              <button className={`tile ${!d.iceCream ? 'tile-on' : ''}`} onClick={() => set({ iceCream: null })}>None</button>
              {ICE_CREAMS.map((ic) => {
                const locked = !isUnlocked(`ice:${ic.id}`);
                return (
                  <button key={ic.id} disabled={locked} onClick={() => { set({ iceCream: ic.id }); sfx('scoop'); }} className={`tile ${d.iceCream === ic.id ? 'tile-on' : ''} ${locked ? 'tile-locked' : ''}`}>
                    {target?.iceCream === ic.id && <span className="absolute -top-2 rounded-full bg-matcha-deep px-1.5 text-[9px] text-white">レシピ</span>}
                    <svg viewBox="-60 -64 120 100" className="h-9 w-10"><Scoop r={44} color={ic.color!} color2={ic.color2!} /></svg>
                    <span className="text-[10px]">{ic.name}{locked && <Glyph name="lock" className="ml-0.5" />}</span>
                  </button>
                );
              })}
            </div>
            <button className={`tile flex-row !justify-start gap-3 min-h-[56px] px-3 ${d.cream ? 'tile-on' : ''}`} onClick={() => { set({ cream: !d.cream }); sfx('pipe'); }}>
              <Glyph name="cream" size={30} /><span>Whipped cream {target?.cream ? <span className="rounded-full bg-matcha-deep px-1.5 text-[9px] text-white">レシピ</span> : null}</span>
            </button>
            <OptionGrid options={DRINK_TOPPINGS} value={d.toppings} recommended={recHint(target?.toppings)} onPick={(o) => set({ toppings: d.toppings.includes(o.id) ? d.toppings.filter((x) => x !== o.id) : [...d.toppings, o.id] })}
              render={(o) => <Glyph name={({ strawberries: 'strawberry', cherry: 'cherry', jelly: 'jelly', boba: 'boba', marshmallow: 'marshmallow', sprinkles: 'sprinkles', minicookie: 'cookie' } as Record<string, GlyphName>)[o.id] || 'sparkle'} size={28} />} />
          </div>
        );
      default:
        return (
          <DecorPanel onAdd={addDecor} items={d.items} selectedId={st.selectedId} onSelect={st.setSelectedId}
            extraTabs={[{
              id: 'drink', label: 'Straw & label', icon: <Sparkles size={14} />, content: (
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold">Straw</h3>
                  <OptionGrid options={STRAWS} value={d.straw} cols="tile-grid" onPick={(o) => set({ straw: o.id })}
                    render={(o) => o.id === 'none' ? <Glyph name="none" size={28} /> : <svg viewBox="0 0 40 60" className="h-9 w-7"><Straw kind={o.id} a={{ x: 14, y: 56 }} b={{ x: 26, y: 8 }} /></svg>} />
                  <h3 className="text-xs font-bold">Rim garnish</h3>
                  <div className="flex flex-wrap gap-1.5">{GARNISH.map((g) => <button key={g.id} className={`chip ${d.garnish === g.id ? '!bg-strawberry' : ''}`} onClick={() => set({ garnish: g.id })}>{g.name}</button>)}</div>
                  <h3 className="text-xs font-bold">Glass label</h3>
                  <div className="flex flex-wrap gap-1.5">{LABEL_STYLES.map((l) => <button key={l.id} className={`chip ${d.labelStyle === l.id ? '!bg-strawberry' : ''}`} onClick={async () => {
                    if (l.id === 'photo') { const id = await openImageLibrary('Photo glass label'); if (id) set({ labelStyle: 'photo', labelAsset: id }); }
                    else set({ labelStyle: l.id });
                  }}>{l.name}</button>)}</div>
                  {d.labelStyle !== 'none' && d.labelStyle !== 'photo' && <input className="input" placeholder="Label text (e.g. いちご)" maxLength={14} value={d.labelText} onChange={(e) => set({ labelText: e.target.value })} />}
                  {d.labelStyle === 'photo' && (
                    <div className="flex items-center gap-2">
                      {labelUrl && <img src={labelUrl} className="h-12 w-12 rounded-xl object-cover" alt="" />}
                      <button className="btn-pink btn-sm" onClick={async () => { const id = await openImageLibrary('Photo glass label'); if (id) set({ labelAsset: id }); }}><ImagePlus size={14} />Change photo</button>
                    </div>
                  )}
                </div>
              ),
            }]} />
        );
    }
  })();

  const pourTargetY = info.liquidTop;
  return (
    <>
      <StudioShell
        title="Drink Studio" jp="ドリンクスタジオ" mode="drink"
        subtitle={recipe ? `Recipe: ${recipe.name} — ${recipe.jp}` : 'Become a barista and invent your own Japanese café drink.'}
        steps={STEPS} step={step} setStep={setStep} canNext={canNext} nextHint="Choose a base to continue"
        undo={{ undo: h.undo, redo: h.redo, canUndo: h.canUndo, canRedo: h.canRedo }}
        stageHint={recipe && step > 0 && step < 7 ? <span className="chip max-w-full truncate !bg-matcha/60 !text-matcha-dark"><Glyph name="book" className="mr-1" />Step {step}: {recipe.steps[Math.min(step - 1, recipe.steps.length - 1)]}</span> : step === 5 ? <span className="chip"><Glyph name="spoon" />Stir in circles on the glass</span> : null}
        stageTools={<BgPicker value={st.bg || 'bg-showa'} onChange={st.setBg} />}
        onFinish={() => { st.setSelectedId(null); setResult(true); }}
        stage={
          <motion.div animate={shake} style={{ transformOrigin: '50% 90%' }}>
            <Stage ref={st.svgRef} width={400} height={520} bgClassName={st.bg || 'bg-showa'} maxHeight="var(--stage-max-h)" onDrop={onDrop}
              onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} cursor={step === 5 ? 'grab' : undefined} ariaLabel="Your drink">
              <DrinkArt d={d} animate stirring={stirring} />
              {pour && (
                <motion.g key={pour.key} data-export-ignore initial={{ opacity: 1 }} animate={{ opacity: [1, 1, 0] }} transition={{ duration: 0.9 }}>
                  <motion.rect x={CX + 18} width="10" rx="5" fill={pour.color} initial={{ y: -10, height: 0 }} animate={{ height: pourTargetY + 10 }} transition={{ duration: 0.35 }} />
                  <motion.ellipse cx={CX + 23} cy={pourTargetY} rx="18" ry="5" fill="#fff" opacity=".6" initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1] }} transition={{ duration: 0.6, delay: 0.3 }} />
                </motion.g>
              )}
              {spoon && (
                <g data-export-ignore pointerEvents="none" transform={`translate(${spoon.x} ${spoon.y}) rotate(18)`}>
                  <rect x="-3" y="-200" width="6" height="200" rx="3" fill="url(#yc-metal)" />
                  <ellipse cy="4" rx="9" ry="14" fill="url(#yc-metal)" />
                </g>
              )}
              <ItemsLayer items={d.items} selectedId={st.selectedId} onSelect={st.setSelectedId} onLive={(items) => h.setLive({ ...d, items })} onCommit={h.commitLive}
                onDelete={(id) => { setItems(d.items.filter((x) => x.id !== id)); st.setSelectedId(null); }} interactive={step === 7} />
            </Stage>
          </motion.div>
        }
        stageFooter={step === 7 ? <ItemToolbar items={d.items} selectedId={st.selectedId} setItems={setItems} onSelect={st.setSelectedId} /> : null}
        panel={panel}
        finishLabel="Finish drink"
      />
      <ResultModal open={result} onClose={() => setResult(false)} svgRef={st.svgRef} size={{ w: 400, h: 520 }} type="drink"
        defaultName={defaultName} ingredients={ingredients} data={d} editingId={st.editingId} isRecipe={matchesRecipe()} season={season}
        onSaved={(c) => st.setEditingId(c.id)} onNew={() => { h.reset(emptyDrink()); st.setEditingId(null); setStep(0); }} />
    </>
  );
}
