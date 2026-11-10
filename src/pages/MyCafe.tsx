import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Camera, DoorOpen, Lock, Redo2, RotateCcw, Save, Sofa, Store, Undo2, CakeSlice, Paintbrush } from 'lucide-react';
import { Stage } from '../components/game/Stage';
import { ItemsLayer } from '../components/game/StageItems';
import { ItemToolbar } from '../components/game/ItemToolbar';
import { DecorPanel, TrayTile } from '../components/game/DecorPanel';
import { ResultModal } from '../components/game/ResultModal';
import { makeItem } from '../components/game/itemUtils';
import { CafeScene, CAFE_H, CAFE_W } from '../art/CafeScene';
import { SpriteThumb, SPRITES } from '../art/sprites';
import { useHistory } from '../hooks/useHistory';
import { useCafe } from '../store/cafeStore';
import { useCollection } from '../store/collectionStore';
import { useGame, useUnlocked } from '../store/gameStore';
import { CAFE_AREAS, FLOORS, FURNITURE, FURNITURE_TINTS, SEASONS, WALLPAPERS } from '../data/catalog';
import type { CafeLayout, StageItem } from '../types';
import type { DragPayload } from '../components/game/dnd';
import { sfx } from '../utils/sound';
import { confirmDialog } from '../components/common/ConfirmDialog';
import { cafeItemRender } from './Home';
import { defaultCafe } from '../store/cafeStore';
import { ModeFrame, TitleBlock, Stamp } from '../components/common/PosterTitle';
import { Glyph, type GlyphName } from '../components/common/Glyph';

export default function MyCafe() {
  const stored = useCafe((s) => s.layout);
  const setLayout = useCafe((s) => s.setLayout);
  const h = useHistory<CafeLayout>(() => stored);
  const L = h.state;
  const [view, setView] = useState<'interior' | 'exterior'>('interior');
  const [area, setArea] = useState('counter');
  const [sel, setSel] = useState<string | null>(null);
  const [result, setResult] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const edited = useRef(false);
  const isUnlocked = useUnlocked();
  const creations = useCollection((s) => s.creations);
  const previews = useCollection((s) => s.previews);

  const [params, setParams] = useSearchParams();
  useEffect(() => {
    const id = params.get('edit');
    if (!id) return;
    const c = useCollection.getState().get(id);
    if (c && c.type === 'cafe') h.set({ ...(structuredClone(c.data) as CafeLayout), updatedAt: Date.now() });
    params.delete('edit');
    setParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep store in sync with any external additions (e.g. "Display in café")
  useEffect(() => {
    if (stored.updatedAt > L.updatedAt) h.reset(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stored.updatedAt]);

  // persist every change
  useEffect(() => {
    if (L === stored) return;
    setLayout(L);
    if (!edited.current) { edited.current = true; useGame.getState().bump('cafeEdits'); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [L]);

  const scene = view === 'interior' ? L.interior : L.exterior;
  const setItems = (items: StageItem[], live = false) => {
    const next = view === 'interior' ? { ...L, interior: { ...L.interior, items } } : { ...L, exterior: { ...L.exterior, items } };
    live ? h.setLive(next) : h.set(next);
  };

  const onDrop = (p: DragPayload, x: number, y: number) => {
    const def = p.type === 'sprite' ? SPRITES[p.ref] : null;
    const size = def ? Math.max(def.w, def.h) * (p.ref.startsWith('f-') ? 0.9 : 0.8) : p.type === 'creation' ? 110 : 150;
    const it = makeItem(p, x, y, size);
    if (!it) return;
    setItems([...scene.items, it]);
    setSel(it.id);
    sfx('drop');
  };
  const addAt = (p: DragPayload) => onDrop(p, CAFE_W / 2 + (Math.random() - 0.5) * 300, view === 'interior' ? 420 : 560);

  const pickArea = (id: string) => {
    setArea(id);
    setView(id === 'front' ? 'exterior' : 'interior');
    setSel(null);
  };

  const furniture = FURNITURE.filter((f) => f.area === area);
  const showcase = creations.filter((c) => c.type !== 'cafe');

  return (
    <ModeFrame mode="cafe" className="mx-auto flex max-w-[1500px] flex-col gap-3 px-3 py-3 md:px-5">
      <header className="flex flex-wrap items-start gap-3">
        <div className="min-w-[220px] flex-1">
          <TitleBlock small title="My Café" jp="マイカフェ" subtitle="Decorate every corner and show off the sweets you made. Changes save automatically." />
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-icon" onClick={h.undo} disabled={!h.canUndo} aria-label="Undo"><Undo2 size={16} /></button>
          <button className="btn-icon" onClick={h.redo} disabled={!h.canRedo} aria-label="Redo"><Redo2 size={16} /></button>
          <button className="btn-matcha" onClick={() => { setSel(null); setResult(true); }}><Save size={16} />Save design</button>
          <button className="btn-cream" onClick={async () => { if (await confirmDialog('Reset café?', 'Restore the starter layout? (Your saved designs in the collection stay.)', 'Reset')) h.set({ ...defaultCafe(), theme: L.theme }); }}><RotateCcw size={16} /></button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-full bg-white p-1 shadow-soft">
          <button className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold ${view === 'interior' ? 'bg-strawberry text-[#7A2E43]' : ''}`} onClick={() => { setView('interior'); if (area === 'front') setArea('counter'); setSel(null); }}><Sofa size={14} />Inside</button>
          <button className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold ${view === 'exterior' ? 'bg-strawberry text-[#7A2E43]' : ''}`} onClick={() => pickArea('front')}><Store size={14} />Front shop</button>
        </div>
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
          {SEASONS.map((s) => (
            <button key={s.id} onClick={() => { h.set({ ...L, theme: s.id }); sfx('sparkle'); }} className={`chip shrink-0 ${L.theme === s.id ? '!border-cocoa' : ''}`} style={{ background: L.theme === s.id ? s.color : undefined }}>{s.jp}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="flex min-w-0 flex-col gap-2">
          <Stage ref={svgRef} width={CAFE_W} height={CAFE_H} onDrop={onDrop} ariaLabel="Your café"
            onPointerDown={(_e, _p, onItem) => { if (!onItem) setSel(null); }}>
            <CafeScene layout={L} view={view}>
              <ItemsLayer items={scene.items} selectedId={sel} onSelect={setSel} onLive={(items) => setItems(items, true)} onCommit={h.commitLive}
                onDelete={(id) => { setItems(scene.items.filter((x) => x.id !== id)); setSel(null); }} render={cafeItemRender(L.theme)} minSize={20} />
            </CafeScene>
          </Stage>
          <ItemToolbar items={scene.items} selectedId={sel} setItems={(items) => setItems(items)} onSelect={setSel} />
          {!sel && <p className="text-center text-[11px] text-cocoa">Tap furniture to move, resize, rotate, recolor or delete it. Drag new pieces in from the panel.</p>}
        </section>

        <aside className="paper flex min-w-0 flex-col gap-3 p-4 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)] lg:self-start lg:overflow-y-auto">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
            {CAFE_AREAS.map((a) => (
              <button key={a.id} onClick={() => pickArea(a.id)} className={`chip shrink-0 ${area === a.id ? '!border-strawberry-deep !bg-strawberry' : ''}`}>{a.name}</button>
            ))}
            <button onClick={() => setArea('showcase')} className={`chip shrink-0 ${area === 'showcase' ? '!border-strawberry-deep !bg-strawberry' : ''}`}><CakeSlice size={13} />Showcase</button>
            <button onClick={() => setArea('decor')} className={`chip shrink-0 ${area === 'decor' ? '!border-strawberry-deep !bg-strawberry' : ''}`}><Paintbrush size={13} />Photos & stickers</button>
          </div>

          {area === 'showcase' ? (
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-sm">My Dessert Showcase</h3>
              <p className="text-[11px] text-cocoa">Place the real drinks, parfaits, crêpes and cookies you made — on the counter, in the showcase or on tables.</p>
              {showcase.length ? (
                <div className="tile-grid">
                  {showcase.map((c) => (
                    <TrayTile key={c.id} payload={{ type: 'creation', ref: c.id }} onAdd={addAt} label={c.name}
                      preview={previews[c.id] ? <img src={previews[c.id]} alt="" className="h-11 w-11 object-contain" draggable={false} /> : <Glyph name="cake" size={34} />} />
                  ))}
                </div>
              ) : <p className="rounded-2xl bg-cream p-3 text-center text-xs">Nothing yet — <Link to="/drink" className="font-bold text-strawberry-deep underline">make a drink</Link> and it can be displayed here.</p>}
            </div>
          ) : area === 'decor' ? (
            <DecorPanel onAdd={addAt} items={scene.items} selectedId={sel} onSelect={setSel} />
          ) : (
            <div className="flex flex-col gap-3">
              <div className="tile-grid">
                {furniture.map((f) => {
                  const locked = !!f.lock && !isUnlocked(f.lock);
                  return <TrayTile key={f.id} payload={{ type: 'sprite', ref: f.id }} onAdd={addAt} label={f.name} locked={locked} preview={<SpriteThumb id={f.id} size={44} />} />;
                })}
              </div>
              {furniture.some((f) => f.lock && !isUnlocked(f.lock)) && <Link to="/shop" className="flex items-center gap-1 text-xs font-bold text-strawberry-deep underline"><Lock size={12} />Unlock more in the Shop</Link>}

              {area === 'wall' && (
                <>
                  <h3 className="text-xs font-bold">Wallpaper</h3>
                  <div className="tile-grid">
                    {WALLPAPERS.map((w) => {
                      const locked = w.id === 'shoji' && !isUnlocked('wall:shoji');
                      return (
                        <button key={w.id} disabled={locked} onClick={() => { h.set({ ...L, interior: { ...L.interior, wallpaper: w.id } }); sfx('pop'); }} className={`tile ${L.interior.wallpaper === w.id ? 'tile-on' : ''} ${locked ? 'tile-locked' : ''}`}>
                          <span className="h-8 w-12 rounded-lg border-2 border-white shadow" style={{ background: `repeating-linear-gradient(90deg, ${w.color} 0 8px, ${w.color2} 8px 16px)` }} />
                          <span className="text-[10px]">{w.name}{locked && <Glyph name="lock" className="ml-0.5" />}</span>
                        </button>
                      );
                    })}
                  </div>
                  <h3 className="text-xs font-bold">Floor</h3>
                  <div className="tile-grid">
                    {FLOORS.map((f) => {
                      const locked = f.id === 'tatami' && !isUnlocked('floor:tatami');
                      return (
                        <button key={f.id} disabled={locked} onClick={() => { h.set({ ...L, interior: { ...L.interior, floor: f.id } }); sfx('pop'); }} className={`tile ${L.interior.floor === f.id ? 'tile-on' : ''} ${locked ? 'tile-locked' : ''}`}>
                          <span className="h-8 w-12 rounded-lg border-2 border-white shadow" style={{ background: `repeating-conic-gradient(${f.color} 0 25%, ${f.color2} 0 50%) 0 0/16px 16px` }} />
                          <span className="text-[10px]">{f.name}{locked && <Glyph name="lock" className="ml-0.5" />}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              {area === 'front' && (
                <>
                  <label className="text-xs font-bold">Shop sign
                    <input className="input mt-1" maxLength={16} value={L.exterior.signText} onChange={(e) => h.set({ ...L, exterior: { ...L.exterior, signText: e.target.value } })} />
                  </label>
                  <h3 className="text-xs font-bold">Wall color</h3>
                  <div className="flex flex-wrap gap-1.5">{['#FBE3EA', '#FFF5E3', '#EEF3E6', '#E3F0F7', '#F5D0BE', '#FFFFFF', '#E8DFF5'].map((c) => <button key={c} aria-label={`Wall ${c}`} onClick={() => h.set({ ...L, exterior: { ...L.exterior, facade: c } })} className={`h-8 w-8 rounded-full border-2 shadow ${L.exterior.facade === c ? 'scale-110 border-cocoa-dark' : 'border-white'}`} style={{ background: c }} />)}</div>
                  <h3 className="text-xs font-bold">Awning & door accent</h3>
                  <div className="flex flex-wrap gap-1.5">{FURNITURE_TINTS.filter((c) => c !== '#FFFFFF').map((c) => <button key={c} aria-label={`Awning ${c}`} onClick={() => h.set({ ...L, exterior: { ...L.exterior, awning: c } })} className={`h-8 w-8 rounded-full border-2 shadow ${L.exterior.awning === c ? 'scale-110 border-cocoa-dark' : 'border-white'}`} style={{ background: c }} />)}</div>
                  <p className="flex items-center gap-1 text-[11px] text-cocoa"><DoorOpen size={12} />Your latest creations appear in the shop windows automatically.</p>
                </>
              )}
            </div>
          )}
          <Link to="/photo" className="btn-sky btn-sm mt-auto"><Camera size={14} />Take a café photo</Link>
        </aside>
      </div>
      <ResultModal open={result} onClose={() => setResult(false)} svgRef={svgRef} size={{ w: CAFE_W / 1.5, h: CAFE_H / 1.5 }} type="cafe"
        defaultName={`${SEASONS.find((s) => s.id === L.theme)!.name} (${view === 'interior' ? 'inside' : 'front'})`} ingredients={[view === 'interior' ? 'Interior' : 'Storefront', SEASONS.find((s) => s.id === L.theme)!.jp]} data={L} season={L.theme} />
    </ModeFrame>
  );
}
