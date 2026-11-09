import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Sparkles, Star, Wand2 } from 'lucide-react';
import { CafeScene, CAFE_H, CAFE_W } from '../art/CafeScene';
import { ArtDefs } from '../art/Defs';
import { DrinkArt } from '../art/DrinkArt';
import { ParfaitArt } from '../art/ParfaitArt';
import { CrepeArt } from '../art/CrepeArt';
import { CookieScene } from '../art/CookieArt';
import { ItemsLayer, ItemContent } from '../components/game/StageItems';
import { recipeDrink, sampleCookie, sampleCrepe, sampleParfait } from '../data/samples';
import { useCafe } from '../store/cafeStore';
import { useCollection } from '../store/collectionStore';
import { useGame, levelFor, STARS_PER_LEVEL } from '../store/gameStore';
import { NAV } from '../components/layout/MainLayout';
import { hashStr, seasonNow } from '../utils/misc';
import { SEASONS } from '../data/catalog';
import type { StageItem } from '../types';
import { FloatingDeco } from '../components/common/Sparkles';

export const cafeItemRender = (theme: string) => (it: StageItem) =>
  it.ref === 'f-window' ? <ItemContent it={{ ...it, text: theme }} /> : <ItemContent it={it} />;

const INSPIRATION = [
  { t: 'Make a Melon Cream Soda with a cherry on top — the kissaten classic.', to: '/drink', jp: 'メロンソーダ' },
  { t: 'Build a matcha parfait: jelly, cornflakes, red bean and a bear scoop.', to: '/parfait', jp: '抹茶パフェ' },
  { t: 'Try a strawberry & condensed-milk cone crêpe, Harajuku style.', to: '/crepe', jp: 'いちごクレープ' },
  { t: 'Bake a family of bear cookies and give them sparkly eyes.', to: '/cookie', jp: 'くまクッキー' },
  { t: 'Upload a photo of a friend and turn it into a café poster.', to: '/photo', jp: 'ポスター' },
  { t: 'Rearrange your café for the season — add string lights!', to: '/cafe', jp: '模様替え' },
  { t: 'Make a three-layer Strawberry Matcha without stirring.', to: '/drink', jp: 'いちご抹茶' },
];

const FEATURED: Record<string, { name: string; jp: string; to: string; desc: string }[]> = {
  spring: [
    { name: 'Sakura Cream Soda', jp: 'さくらソーダ', to: '/drink', desc: 'Pink blossom syrup & heart ice' },
    { name: 'Sakura Parfait', jp: '桜パフェ', to: '/parfait', desc: 'Sakura scoops, dango & mochi' },
    { name: 'Spring Sakura Café', jp: '春の模様替え', to: '/cafe', desc: 'Petals falling outside the window' },
  ],
  summer: [
    { name: 'Melon Cream Soda', jp: 'メロンソーダ', to: '/drink', desc: 'Bright green fizz with vanilla' },
    { name: 'Mango Parfait', jp: 'マンゴーパフェ', to: '/parfait', desc: 'Mango cubes & mango scoops' },
    { name: 'Blue Ocean Soda', jp: 'ブルーオーシャン', to: '/drink', desc: 'Star ice in a summer sea' },
  ],
  autumn: [
    { name: 'Hojicha Milk', jp: 'ほうじ茶ミルク', to: '/drink', desc: 'Roasty tea over caramel' },
    { name: 'Chestnut & Hojicha Parfait', jp: '栗パフェ', to: '/parfait', desc: 'Hojicha ice, chestnuts & kinako' },
    { name: 'Autumn Maple Café', jp: '秋の模様替え', to: '/cafe', desc: 'Maple leaves drifting by' },
  ],
  winter: [
    { name: 'Christmas Cookies', jp: 'クリスマスクッキー', to: '/cookie', desc: 'Star cookies in a gift tin' },
    { name: 'Chocolate Milk Float', jp: 'チョコフロート', to: '/drink', desc: 'Cocoa, cream & mini cookies' },
    { name: 'Winter Christmas Café', jp: '冬の模様替え', to: '/cafe', desc: 'Snow on the awning' },
  ],
};

function ModeArt({ to }: { to: string }) {
  const drink = useMemo(() => recipeDrink('melon-float'), []);
  const parfait = useMemo(() => sampleParfait(), []);
  const crepe = useMemo(() => sampleCrepe(), []);
  const cookie = useMemo(() => sampleCookie(), []);
  const vb = '50 60 300 460';
  if (to === '/drink') return <svg viewBox={vb} className="h-full w-full"><ArtDefs /><DrinkArt d={drink} /></svg>;
  if (to === '/parfait') return <svg viewBox={vb} className="h-full w-full"><ArtDefs /><ParfaitArt d={parfait} /></svg>;
  if (to === '/crepe') return <svg viewBox="50 90 300 440" className="h-full w-full"><ArtDefs /><CrepeArt d={crepe} /></svg>;
  if (to === '/cookie') return <svg viewBox="40 40 420 420" className="h-full w-full"><ArtDefs /><CookieScene d={cookie} /></svg>;
  return null;
}

export default function Home() {
  const layout = useCafe((s) => s.layout);
  const creations = useCollection((s) => s.creations);
  const previews = useCollection((s) => s.previews);
  const player = useGame((s) => s.player);
  const last = useGame((s) => s.lastRoute);
  const total = useGame((s) => s.totalEarned);
  const nav = useNavigate();
  const lvl = levelFor(total);
  const season = seasonNow();
  const s = SEASONS.find((x) => x.id === season)!;
  const idea = INSPIRATION[hashStr(new Date().toDateString()) % INSPIRATION.length];
  const lastNav = NAV.find((n) => n.to === last) || NAV[1];
  const recent = creations.slice(0, 8);

  return (
    <div className="relative mx-auto flex max-w-[1400px] flex-col gap-5 px-3 py-4 md:px-5">
      <FloatingDeco className="opacity-60" />
      {/* hero */}
      <section className="relative">
        <div className="stage-surface cursor-pointer" onClick={() => nav('/cafe')} role="link" aria-label="Open My Café">
          <svg viewBox={`0 0 ${CAFE_W} ${CAFE_H}`} className="block w-full">
            <ArtDefs />
            <CafeScene layout={layout} view="interior">
              <ItemsLayer items={layout.interior.items} selectedId={null} onSelect={() => {}} onLive={() => {}} onCommit={() => {}} interactive={false} render={cafeItemRender(layout.theme)} />
            </CafeScene>
          </svg>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 p-3 sm:flex-row sm:items-end sm:p-5">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="paper pointer-events-auto flex items-center gap-3 px-4 py-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-strawberry font-display text-xl text-white">{(player?.name || 'Y')[0].toUpperCase()}</div>
            <div>
              <div className="font-display text-base leading-tight">{player?.name || 'Yumi'}’s Café</div>
              <div className="text-xs text-cocoa">Level {lvl} · {s.name}</div>
              <div className="mt-1 h-2 w-36 overflow-hidden rounded-full bg-cream"><div className="h-full bg-matcha-deep" style={{ width: `${((total % STARS_PER_LEVEL) / STARS_PER_LEVEL) * 100}%` }} /></div>
            </div>
          </motion.div>
          <div className="flex-1" />
          <motion.button initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 }} className="btn-deep pointer-events-auto px-6 py-3 text-base" onClick={(e) => { e.stopPropagation(); nav(lastNav.to); }}>
            <Play size={18} className="fill-white" />Continue · {lastNav.label}
          </motion.button>
        </div>
      </section>

      {/* modes */}
      <section>
        <h2 className="mb-3 flex items-baseline gap-2 font-display text-xl">Today’s kitchen <span className="label-jp text-xs text-strawberry-deep">きょうのメニュー</span></h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {NAV.slice(1, 5).map((n, i) => (
            <motion.div key={n.to} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.06 }}>
              <Link to={n.to} className="paper card-hover group relative flex h-full flex-col overflow-hidden">
                <div className="relative h-36 sm:h-44" style={{ background: `linear-gradient(180deg, ${n.color}, #FFF8ED)` }}>
                  <div className="absolute left-2 top-2 rounded-md bg-white/85 px-1.5 py-2 font-jp text-[11px] font-bold text-cocoa vertical-jp">{n.jp}</div>
                  <div className="absolute inset-0 transition group-hover:scale-105"><ModeArt to={n.to} /></div>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="font-display text-sm">{n.label}</span>
                  <n.icon size={16} className="text-strawberry-deep" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {NAV.slice(5).map((n) => (
            <Link key={n.to} to={n.to} className="paper card-hover flex items-center gap-3 px-3 py-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl shadow-sm" style={{ background: n.color }}><n.icon size={20} /></span>
              <span className="min-w-0"><span className="block truncate font-display text-sm">{n.label}</span><span className="label-jp text-[10px] text-cocoa">{n.jp}</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        {/* featured seasonal */}
        <div className="paper stitch p-4">
          <h2 className="mb-3 flex items-baseline gap-2 font-display text-lg"><Sparkles size={18} className="text-strawberry-deep" />Seasonal specials <span className="label-jp text-xs text-strawberry-deep">{s.jp} 期間限定</span></h2>
          <div className="grid gap-2 sm:grid-cols-3">
            {FEATURED[season].map((f) => (
              <Link key={f.name} to={f.to} className="card-hover rounded-2xl p-3" style={{ background: `${s.color}55` }}>
                <div className="label-jp text-[11px] text-strawberry-dark">{f.jp}</div>
                <div className="font-display text-sm leading-tight">{f.name}</div>
                <div className="mt-1 text-[11px] text-cocoa">{f.desc}</div>
              </Link>
            ))}
          </div>
        </div>
        {/* inspiration */}
        <div className="paper relative overflow-hidden p-4" style={{ background: 'linear-gradient(135deg,#FFF6DA,#FBE3EA)' }}>
          <h2 className="mb-2 flex items-center gap-2 font-display text-lg"><Wand2 size={18} className="text-strawberry-deep" />Daily inspiration</h2>
          <div className="label-jp text-sm text-strawberry-dark">{idea.jp}</div>
          <p className="mb-3 text-sm">{idea.t}</p>
          <Link to={idea.to} className="btn-pink btn-sm">Let’s make it ♡</Link>
          <Star className="absolute -bottom-4 -right-4 h-24 w-24 rotate-12 fill-butter text-butter opacity-70" />
        </div>
      </section>

      {/* recent */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl">Recently created <span className="label-jp text-xs text-strawberry-deep">さいきんの作品</span></h2>
          <Link to="/collection" className="text-sm font-bold text-strawberry-deep underline">See all</Link>
        </div>
        {recent.length ? (
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
            {recent.map((c) => (
              <Link key={c.id} to={`/collection?open=${c.id}`} className="paper card-hover flex w-32 shrink-0 flex-col items-center p-2 sm:w-40">
                <div className="grid h-32 w-full place-items-center bg-strawberry-drip rounded-2xl">{previews[c.id] && <img src={previews[c.id]} alt={c.name} className="max-h-28 object-contain" loading="lazy" />}</div>
                <span className="mt-1 w-full truncate text-center text-xs font-bold">{c.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="paper flex flex-col items-center gap-2 p-6 text-center text-sm text-cocoa">Your sweets will appear here. Start with a drink — it only takes a minute!<Link to="/drink" className="btn-pink btn-sm">Open Drink Studio</Link></div>
        )}
      </section>
    </div>
  );
}
