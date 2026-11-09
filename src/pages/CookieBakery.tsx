import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Brush, Flame, Hand, ImagePlus, PaintBucket, MousePointer2 } from 'lucide-react';
import { StudioShell, OptionGrid, Slider, Swatch } from '../components/game/StudioShell';
import { Stage } from '../components/game/Stage';
import { ItemsLayer } from '../components/game/StageItems';
import { ItemToolbar } from '../components/game/ItemToolbar';
import { DecorPanel, TrayTile } from '../components/game/DecorPanel';
import { ResultModal } from '../components/game/ResultModal';
import { BgPicker } from '../components/game/BgPicker';
import { makeItem } from '../components/game/itemUtils';
import { openImageLibrary } from '../components/game/ImageLibrary';
import { CookieScene, CookieShape, DoughBoard, DoughBowl, Oven, PackageOver, RollingPin, SheetBackdrop, ShapeEls } from '../art/CookieArt';
import { useHistory } from '../hooks/useHistory';
import { useStudio } from '../hooks/useStudio';
import { emptyCookie } from '../data/samples';
import { CUTTERS, DOUGHS, DOUGH_INGREDIENTS, FACE_STICKERS, ICING_COLORS, PACKS, PACK_COLORS, RIBBONS, dough } from '../data/catalog';
import { useGame, useUnlocked } from '../store/gameStore';
import { useAssets } from '../store/assetStore';
import type { CookieData, IcingStroke, StageItem } from '../types';
import type { DragPayload } from '../components/game/dnd';
import { sfx } from '../utils/sound';
import { clamp, uid } from '../utils/misc';

const STEPS = [
  { id: 'dough', label: 'Choose dough', jp: '生地' },
  { id: 'mix', label: 'Mix', jp: 'まぜる' },
  { id: 'knead', label: 'Knead & roll', jp: 'こねる' },
  { id: 'cut', label: 'Cut cookies', jp: '型抜き' },
  { id: 'bake', label: 'Bake', jp: '焼く' },
  { id: 'icing', label: 'Icing & decorate', jp: 'アイシング' },
  { id: 'pack', label: 'Packaging', jp: 'ラッピング' },
];

function CutterThumb({ shape, letter = 'A' }: { shape: string; letter?: string }) {
  return (
    <svg viewBox="-60 -60 120 120" className="h-10 w-10">
      <ShapeEls shape={shape} letter={letter} p={{ fill: '#FFF8ED', stroke: '#B9C2C7', strokeWidth: 7 }} />
      {shape === 'letter' && <text y="18" textAnchor="middle" fontSize="50" fontFamily='"Mochiy Pop One"' fill="#92745F">{letter}</text>}
    </svg>
  );
}

export default function CookieBakery() {
  const h = useHistory<CookieData>(emptyCookie);
  const d = h.state;
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(false);
  const [squish, setSquish] = useState(0);
  const [pin, setPin] = useState<{ x: number; y: number } | null>(null);
  const [baking, setBaking] = useState(false);
  const [tool, setTool] = useState<'pipe' | 'flood' | 'select'>('pipe');
  const [icing, setIcing] = useState({ color: '#FFFFFF', width: 6 });
  const [letter, setLetter] = useState('A');
  const [drawing, setDrawing] = useState<IcingStroke | null>(null);
  const stir = useRef<{ a: number } | null>(null);
  const rollRef = useRef<{ x: number; y: number } | null>(null);
  const isUnlocked = useUnlocked();
  const packUrl = useAssets((s) => (d.pack.asset ? s.urls[d.pack.asset] : undefined));
  const st = useStudio<CookieData>('cookie', (data) => { h.reset(data); setStep(5); });

  const set = (p: Partial<CookieData>) => h.set({ ...d, ...p });
  const setItems = (items: StageItem[]) => h.set({ ...d, items });
  const setCookies = (cookies: StageItem[]) => h.set({ ...d, cookies, icing: d.icing.filter((s) => cookies.some((c) => c.id === s.cookieId)) });

  // ---- baking timer
  useEffect(() => {
    if (!baking) return;
    sfx('oven');
    const t = window.setInterval(() => {
      h.setLive((p) => ({ ...p, bake: Math.min(1, p.bake + 0.02) }));
    }, 90);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baking]);
  useEffect(() => {
    if (baking && d.bake >= 1) {
      setBaking(false);
      h.commitLive();
      sfx('ding');
      useGame.getState().bump('cookiesBaked', d.cookies.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.bake, baking]);

  const cookieAt = (pt: { x: number; y: number }) => [...d.cookies].reverse().find((c) => Math.hypot(c.x - pt.x, c.y - pt.y) < c.w * 0.52);
  const toLocal = (c: StageItem, pt: { x: number; y: number }): [number, number] => {
    const s = (c.w / 100) * (1 + d.bake * 0.06);
    const dx = pt.x - c.x, dy = pt.y - c.y;
    const r = (-c.rotation * Math.PI) / 180;
    return [Math.round(((dx * Math.cos(r) - dy * Math.sin(r)) / s) * 10) / 10, Math.round(((dx * Math.sin(r) + dy * Math.cos(r)) / s) * 10) / 10];
  };

  const onDown = (e: React.PointerEvent<SVGSVGElement>, pt: { x: number; y: number }, onItem: boolean) => {
    const cap = () => (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    if (step === 1 && d.added.length >= 3) { cap(); stir.current = { a: Math.atan2(pt.y - 262, pt.x - 250) }; }
    if (step === 2) {
      if (d.knead < 1) {
        if (Math.hypot(pt.x - 250, pt.y - 250) < 110) {
          sfx('knead');
          setSquish(1);
          setTimeout(() => setSquish(0), 140);
          set({ knead: Math.min(1, d.knead + 0.125) });
        }
      } else { cap(); rollRef.current = pt; setPin(pt); }
    }
    if (step === 3 || step === 6) { if (!onItem) st.setSelectedId(null); }
    if (step === 5) {
      if (tool === 'select') { if (!onItem) st.setSelectedId(null); return; }
      const c = cookieAt(pt);
      if (!c) return;
      if (tool === 'flood') {
        set({ icing: [...d.icing, { id: uid('ic'), cookieId: c.id, color: icing.color, width: icing.width, points: [], flood: true }] });
        sfx('pipe');
      } else {
        cap();
        setDrawing({ id: uid('ic'), cookieId: c.id, color: icing.color, width: icing.width, points: [toLocal(c, pt)] });
        sfx('pipe');
      }
    }
  };
  const onMove = (_e: React.PointerEvent<SVGSVGElement>, pt: { x: number; y: number }) => {
    if (stir.current) {
      const a = Math.atan2(pt.y - 262, pt.x - 250);
      let da = a - stir.current.a;
      if (da > Math.PI) da -= Math.PI * 2;
      if (da < -Math.PI) da += Math.PI * 2;
      stir.current.a = a;
      if (Math.abs(da) > 0.01) { h.setLive((p) => ({ ...p, mix: clamp(p.mix + Math.abs(da) / (Math.PI * 2 * 4), 0, 1) })); sfx('stir'); }
    }
    if (rollRef.current) {
      const dist = Math.hypot(pt.x - rollRef.current.x, pt.y - rollRef.current.y);
      rollRef.current = pt;
      setPin(pt);
      if (dist > 1) { h.setLive((p) => ({ ...p, roll: clamp(p.roll + dist / 2200, 0, 1) })); if (Math.random() < 0.08) sfx('roll'); }
    }
    if (drawing) {
      const c = d.cookies.find((k) => k.id === drawing.cookieId);
      if (!c) return;
      const p = toLocal(c, pt);
      const last = drawing.points[drawing.points.length - 1];
      if (Math.hypot(p[0] - last[0], p[1] - last[1]) > 1.6) setDrawing({ ...drawing, points: [...drawing.points, p] });
    }
  };
  const onUp = () => {
    if (stir.current) { stir.current = null; h.commitLive(); }
    if (rollRef.current) { rollRef.current = null; setPin(null); h.commitLive(); }
    if (drawing) { set({ icing: [...d.icing, drawing] }); setDrawing(null); }
  };

  const addCookie = (shape: string, x?: number, y?: number) => {
    if (d.cookies.length >= 12) return;
    const n = d.cookies.length;
    const px = x ?? 120 + (n % 3) * 130;
    const py = y ?? 130 + Math.floor(n / 3) * 115;
    const it: StageItem = { id: uid('k'), kind: 'cookie', ref: shape, x: clamp(px, 100, 400), y: clamp(py, 110, 390), w: 112, h: 112, rotation: 0, letter: shape === 'letter' ? letter : undefined };
    setCookies([...d.cookies, it]);
    st.setSelectedId(it.id);
    sfx('cut');
  };
  const onDrop = (p: DragPayload, x: number, y: number) => {
    if (p.type === 'cutter') return addCookie(p.ref, x, y);
    const it = makeItem(p, x, y, FACE_STICKERS.includes(p.ref) ? 44 : 70);
    if (it) { setItems([...d.items, it]); st.setSelectedId(it.id); setTool('select'); sfx('pop'); }
  };
  const addItem = (p: DragPayload) => {
    const c = d.cookies[d.items.length % Math.max(1, d.cookies.length)];
    onDrop(p, (c?.x ?? 250) + (Math.random() - 0.5) * 20, (c?.y ?? 250) + (Math.random() - 0.5) * 20);
  };

  const canNext = [true, d.mix >= 1, d.roll >= 1, d.cookies.length > 0, d.bake >= 1, true, true][step];
  const nextHint = ['', d.added.length < 3 ? 'Add at least 3 ingredients' : 'Stir until smooth', d.knead < 1 ? 'Tap the dough to knead' : 'Roll the pin over the dough', 'Cut at least one cookie', 'Bake the cookies', '', ''][step];
  const dd = dough(d.dough);
  const ingredients = [`${dd.name} dough`, ...Array.from(new Set(d.cookies.map((c) => (CUTTERS.find((x) => x.id === c.ref)?.name || c.ref) + ' cookie'))), ...(d.icing.length ? ['Royal icing'] : [])];

  const scene = (() => {
    switch (step) {
      case 0:
      case 1:
        return <DoughBowl added={step === 0 ? [] : d.added} mixLevel={step === 0 ? 0 : d.mix} doughId={d.dough} />;
      case 2:
        return (
          <g>
            <DoughBoard doughId={d.dough} knead={d.knead} roll={d.knead >= 1 ? d.roll : 0} squish={squish} />
            {d.knead >= 1 && <RollingPin x={pin ? 250 : 250} y={pin ? clamp(pin.y, 90, 420) : 440} />}
          </g>
        );
      case 3:
        return (
          <g>
            <SheetBackdrop doughId={d.dough} />
            <ItemsLayer items={d.cookies} selectedId={st.selectedId} onSelect={st.setSelectedId} onLive={(cookies) => h.setLive({ ...d, cookies })} onCommit={h.commitLive}
              onDelete={(id) => { setCookies(d.cookies.filter((x) => x.id !== id)); st.setSelectedId(null); }}
              render={(it) => <CookieShape it={{ ...it, x: 0, y: 0, rotation: 0 }} doughId={d.dough} bake={0} raw />} />
          </g>
        );
      case 4:
        return (
          <Oven on={baking} progress={d.bake}>
            <g transform="translate(86 160) scale(0.82 0.645)">
              <rect x="10" y="10" width="380" height="380" rx="10" fill="url(#yc-metal)" opacity=".8" />
              {d.cookies.map((c) => <CookieShape key={c.id} it={c} doughId={d.dough} bake={d.bake} />)}
            </g>
          </Oven>
        );
      case 5:
        return (
          <g>
            <CookieScene d={{ ...d, icing: drawing ? [...d.icing, drawing] : d.icing }} showPack={false} />
          </g>
        );
      default:
        return <CookieScene d={d} showPack />;
    }
  })();

  const panel = (() => {
    switch (step) {
      case 0:
        return <OptionGrid options={DOUGHS} value={d.dough} cols="grid-cols-3" onPick={(o) => { set({ dough: o.id }); }} render={(o) => <Swatch c={o.color!} size={38} />} />;
      case 1:
        return (
          <div className="flex flex-col gap-3">
            <p className="text-[11px] text-cocoa">Add ingredients to the bowl, then stir in circles until the dough comes together.</p>
            <div className="grid grid-cols-3 gap-2">
              {DOUGH_INGREDIENTS.map((i) => (
                <button key={i.id} disabled={d.added.includes(i.id)} className={`tile ${d.added.includes(i.id) ? 'tile-on' : ''}`} onClick={() => { set({ added: [...d.added, i.id] }); sfx('drop'); }}>
                  <span className="text-2xl">{{ flour: '🌾', butter: '🧈', sugar: '🍚', egg: '🥚', flavor: d.dough === 'chocolate' ? '🍫' : d.dough === 'matcha' ? '🍵' : d.dough === 'strawberry' ? '🍓' : d.dough === 'blueberry' ? '🫐' : '🌼' }[i.id]}</span>
                  {i.id === 'flavor' ? `${dd.name}` : i.name}
                </button>
              ))}
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-cream"><motion.div className="h-full rounded-full bg-gradient-to-r from-butter to-cocoa-light" animate={{ width: `${d.mix * 100}%` }} /></div>
            <button className="btn-butter" disabled={d.added.length < 3} onClick={() => { set({ mix: Math.min(1, d.mix + 0.34) }); sfx('stir'); }}>🥄 Stir (or draw circles)</button>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-3">
            <div className={`rounded-2xl px-3 py-2 text-xs font-bold ${d.knead >= 1 ? 'bg-matcha/50 text-matcha-dark' : 'bg-strawberry/40'}`}><Hand size={14} className="mr-1 inline" />Tap the dough to knead it {Math.round(d.knead * 100)}%</div>
            <div className={`rounded-2xl px-3 py-2 text-xs font-bold ${d.roll >= 1 ? 'bg-matcha/50 text-matcha-dark' : d.knead >= 1 ? 'bg-strawberry/40' : 'bg-white/70'}`}>Then drag the rolling pin up and down {Math.round(d.roll * 100)}%</div>
            <div className="flex gap-2">
              <button className="btn-butter flex-1" disabled={d.knead >= 1} onClick={() => { set({ knead: Math.min(1, d.knead + 0.25) }); sfx('knead'); }}>Knead</button>
              <button className="btn-butter flex-1" disabled={d.knead < 1 || d.roll >= 1} onClick={() => { set({ roll: Math.min(1, d.roll + 0.34) }); sfx('roll'); }}>Roll</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-3">
            <p className="text-[11px] text-cocoa">Drag a cutter onto the dough (or tap). Move, resize and rotate your cut-outs. Up to 12 cookies.</p>
            <div className="grid grid-cols-4 gap-2">
              {CUTTERS.map((c) => {
                const locked = !isUnlocked(`cutter:${c.id}`);
                return <TrayTile key={c.id} size="sm" payload={{ type: 'cutter', ref: c.id }} label={c.name} locked={locked} preview={<CutterThumb shape={c.id} letter={letter} />} onAdd={(p) => addCookie(p.ref)} />;
              })}
            </div>
            <label className="flex items-center gap-2 text-xs font-bold">Alphabet letter
              <input className="input !w-16 text-center uppercase" maxLength={1} value={letter} onChange={(e) => {
                const L = (e.target.value || 'A').toUpperCase().slice(0, 1);
                setLetter(L);
                const sel = d.cookies.find((c) => c.id === st.selectedId && c.ref === 'letter');
                if (sel) setCookies(d.cookies.map((c) => (c.id === sel.id ? { ...c, letter: L } : c)));
              }} />
            </label>
            <div className="chip self-start">{d.cookies.length} / 12 cookies</div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-cocoa">Into the oven! Watch them puff up and turn golden.</p>
            <div className="h-3 overflow-hidden rounded-full bg-cream"><motion.div className="h-full rounded-full bg-gradient-to-r from-butter to-[#D99A4C]" animate={{ width: `${d.bake * 100}%` }} /></div>
            <button className="btn-deep" disabled={baking || d.bake >= 1} onClick={() => setBaking(true)}><Flame size={16} />{baking ? 'Baking…' : d.bake >= 1 ? 'Baked!' : 'Bake'}</button>
            {d.bake >= 1 && <button className="btn-matcha" onClick={() => { sfx('oven'); setStep(5); }}>Take them out ✿</button>}
          </div>
        );
      case 5:
        return (
          <DecorPanel onAdd={addItem} items={d.items} selectedId={st.selectedId} onSelect={(id) => { setTool('select'); st.setSelectedId(id); }} groups={['faces', 'cute', 'deco', 'food', 'wagashi']}
            extraTabs={[{
              id: 'icing', label: 'Icing', icon: <Brush size={14} />, content: (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-3 gap-2">
                    <button className={`tile ${tool === 'pipe' ? 'tile-on' : ''}`} onClick={() => setTool('pipe')}><Brush size={20} />Pipe</button>
                    <button className={`tile ${tool === 'flood' ? 'tile-on' : ''}`} onClick={() => setTool('flood')}><PaintBucket size={20} />Flood</button>
                    <button className={`tile ${tool === 'select' ? 'tile-on' : ''}`} onClick={() => setTool('select')}><MousePointer2 size={20} />Move stickers</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ICING_COLORS.map((c) => <button key={c} aria-label={`Icing ${c}`} onClick={() => { setIcing({ ...icing, color: c }); if (tool === 'select') setTool('pipe'); }} className={`h-8 w-8 rounded-full border-2 shadow ${icing.color === c ? 'scale-110 border-cocoa-dark' : 'border-white'}`} style={{ background: c }} />)}
                  </div>
                  <Slider label="Piping tip size" value={icing.width} min={2} max={16} onChange={(v) => setIcing({ ...icing, width: v })} />
                  <p className="text-[11px] text-cocoa">Draw right on a cookie — icing stays inside its shape. Flood fills a whole cookie. Use Undo to remove strokes.</p>
                  <button className="btn-cream btn-sm" disabled={!d.icing.length} onClick={() => set({ icing: [] })}>Clear all icing</button>
                </div>
              ),
            }]} />
        );
      default:
        return (
          <div className="flex flex-col gap-3">
            <OptionGrid options={PACKS} value={d.pack.type} cols="grid-cols-4" onPick={(o) => { set({ pack: { ...d.pack, type: o.id as CookieData['pack']['type'] } }); sfx('pop'); }}
              render={(o) => <span className="text-xl">{{ plate: '🍽️', box: '🎁', bag: '🛍️', tin: '🥫' }[o.id]}</span>} />
            <h3 className="text-xs font-bold">Package color</h3>
            <div className="flex flex-wrap gap-1.5">{PACK_COLORS.map((c) => <button key={c} aria-label={`Package ${c}`} onClick={() => set({ pack: { ...d.pack, color: c } })} className={`h-8 w-8 rounded-full border-2 shadow ${d.pack.color === c ? 'scale-110 border-cocoa-dark' : 'border-white'}`} style={{ background: c }} />)}</div>
            <h3 className="text-xs font-bold">Ribbon</h3>
            <div className="flex flex-wrap gap-1.5">{RIBBONS.map((c) => <button key={c} aria-label={`Ribbon ${c}`} onClick={() => set({ pack: { ...d.pack, ribbon: c } })} className={`h-8 w-8 rounded-full border-2 shadow ${d.pack.ribbon === c ? 'scale-110 border-cocoa-dark' : 'border-white'}`} style={{ background: c }} />)}</div>
            <div className="flex items-center gap-2">
              {packUrl && <img src={packUrl} className="h-12 w-12 rounded-full object-cover shadow" alt="" />}
              <button className="btn-pink btn-sm" onClick={async () => { const id = await openImageLibrary('Custom package label'); if (id) set({ pack: { ...d.pack, asset: id } }); }}><ImagePlus size={14} />{packUrl ? 'Change' : 'Add'} custom label</button>
              {packUrl && <button className="chip" onClick={() => set({ pack: { ...d.pack, asset: null } })}>Remove</button>}
            </div>
            <DecorPanel onAdd={addItem} items={d.items} selectedId={st.selectedId} onSelect={st.setSelectedId} groups={['labels', 'cute', 'deco', 'retro']} />
          </div>
        );
    }
  })();

  const interactiveItems = step === 6 || (step === 5 && tool === 'select');
  return (
    <>
      <StudioShell
        title="Cookie Bakery" jp="クッキーベーカリー" accent="!bg-[#92745F]"
        subtitle="Mix, knead, cut, bake — then pipe royal icing like a pro."
        steps={STEPS} step={step} setStep={setStep} canNext={canNext} nextHint={nextHint}
        undo={{ undo: h.undo, redo: h.redo, canUndo: h.canUndo, canRedo: h.canRedo }}
        stageHint={step === 5 ? <span className="chip">{tool === 'pipe' ? '🖌️ Draw icing on a cookie' : tool === 'flood' ? '🪣 Tap a cookie to flood it' : '👆 Move stickers'}</span> : step === 1 || step === 2 ? <span className="chip">{nextHint || 'Ready! ✓'}</span> : null}
        stageTools={<BgPicker value={st.bg || 'bg-bakery'} onChange={st.setBg} />}
        onFinish={() => { st.setSelectedId(null); setResult(true); }}
        finishLabel="Finish cookies ✿"
        stage={
          <Stage ref={st.svgRef} width={500} height={500} bgClassName={st.bg || 'bg-bakery'} maxHeight="var(--stage-max-h)"
            onDrop={onDrop} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} cursor={step === 5 && tool !== 'select' ? 'crosshair' : undefined} ariaLabel="Your cookies">
            {scene}
            {step >= 5 && (
              <ItemsLayer items={d.items} selectedId={st.selectedId} onSelect={st.setSelectedId} onLive={(items) => h.setLive({ ...d, items })} onCommit={h.commitLive}
                onDelete={(id) => { setItems(d.items.filter((x) => x.id !== id)); st.setSelectedId(null); }} interactive={interactiveItems} />
            )}
            {step === 6 && <PackageOver pack={d.pack} />}
          </Stage>
        }
        stageFooter={
          step === 3 ? <ItemToolbar items={d.cookies} selectedId={st.selectedId} setItems={setCookies} onSelect={st.setSelectedId} compact />
            : interactiveItems ? <ItemToolbar items={d.items} selectedId={st.selectedId} setItems={setItems} onSelect={st.setSelectedId} /> : null
        }
        panel={panel}
      />
      <ResultModal open={result} onClose={() => setResult(false)} svgRef={st.svgRef} size={{ w: 500, h: 500 }} type="cookie"
        defaultName={`${dd.name} Cookie ${d.pack.type === 'box' ? 'Gift Box' : d.pack.type === 'bag' ? 'Bag' : d.pack.type === 'tin' ? 'Tin' : 'Plate'}`}
        ingredients={ingredients} data={d} editingId={st.editingId}
        onSaved={(c) => st.setEditingId(c.id)} onNew={() => { h.reset(emptyCookie()); st.setEditingId(null); setStep(0); }} />
    </>
  );
}
