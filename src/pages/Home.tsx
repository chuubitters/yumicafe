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
import { sfx } from '../utils/sound';

export const cafeItemRender = (theme: string) => (it: StageItem) =>
  it.ref === 'f-window' ? <ItemContent it={{ ...it, text: theme }} /> : <ItemContent it={it} />;

const MODE_OF: Record<string, string> = { '/drink': 'drink', '/parfait': 'parfait', '/crepe': 'crepe', '/cookie': 'cookie' };
const MODE_TAG: Record<string, string> = { '/drink': '純喫茶', '/parfait': '春限定', '/crepe': '人気', '/cookie': '焼きたて' };

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
  if (to === '/cookie') return <svg viewBox="10 10 480 480" className="h-full w-full overflow-hidden"><ArtDefs /><CookieScene d={cookie} /></svg>;
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
        <div className="stage-surface cursor-pointer transition duration-300 hover:shadow-[0_18px_40px_-14px_rgba(94,69,53,.6)]" onClick={() => nav('/cafe')} role="link" aria-label="Open My Café">
          <svg viewBox={`0 0 ${CAFE_W} ${CAFE_H}`} className="block w-full">
            <ArtDefs />
            <CafeScene layout={layout} view="interior">
              <ItemsLayer items={layout.interior.items} selectedId={null} onSelect={() => {}} onLive={() => {}} onCommit={() => {}} interactive={false} render={cafeItemRender(layout.theme)} />
            </CafeScene>
          </svg>
        </div>
        <div className="relative mt-3 flex flex-col gap-3 sm:pointer-events-none sm:absolute sm:inset-x-0 sm:bottom-0 sm:mt-0 sm:flex-row sm:items-end sm:p-5">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="plaque pointer-events-auto flex items-center gap-3 !px-4 !py-3 !text-cocoa-dark">
            <div className="badge-round h-12 w-12 shrink-0 aspect-square font-display text-xl">{(player?.name || 'Y')[0].toUpperCase()}</div>
            <div>
              <div className="font-display text-base leading-tight text-kiss-red">{player?.name || 'Yumi'}’s Café</div>
              <div className="text-xs text-cocoa">Level {lvl} · {s.name}</div>
              <div className="mt-1 h-2 w-36 overflow-hidden rounded-full bg-white/80 ring-1 ring-kiss-green/20"><motion.div className="h-full rounded-full bg-gradient-to-r from-matcha to-kiss-green" initial={{ width: 0 }} animate={{ width: `${((total % STARS_PER_LEVEL) / STARS_PER_LEVEL) * 100}%` }} transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }} /></div>
            </div>
          </motion.div>
          <div className="hidden flex-1 sm:block" />
          <motion.button initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 }} className="btn-deep pointer-events-auto px-6 py-3 text-base" onClick={(e) => { e.stopPropagation(); nav(lastNav.to); }}>
            <Play size={18} className="fill-white" />Continue · {lastNav.label}
          </motion.button>
        </div>
      </section>

      {/* modes */}
      <section>
        <h2 className="h-section mb-3" data-mode="cafe">Today’s kitchen <span className="jp">きょうのメニュー</span></h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {NAV.slice(1, 5).map((n, i) => (
            <motion.div key={n.to} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.06 }}>
              <Link to={n.to} data-mode={MODE_OF[n.to]} onClick={() => sfx('select')} className="paper card-hover group relative flex h-full flex-col overflow-hidden">
                <div className="relative h-36 overflow-hidden sm:h-44" style={{ background: 'linear-gradient(180deg, var(--tint2), var(--tint) 75%, #fffdf8)' }}>
                  <div className="mode-band !static !h-full !opacity-60" aria-hidden />
                  <div className="absolute inset-x-3 bottom-1 top-4 overflow-hidden transition duration-300 group-hover:-translate-y-1 group-hover:scale-105"><ModeArt to={n.to} /></div>
                  <div className="absolute left-2 top-2 z-10 rounded-md bg-kiss-cream px-1.5 py-2 font-jp text-[11px] font-bold text-kiss-red vertical-jp shadow-sticker">{n.jp}</div>
                  <div className="badge-round absolute right-2 top-2 z-10 h-11 w-11 aspect-square rotate-[10deg] text-[9px] transition duration-300 group-hover:rotate-[24deg] group-hover:scale-110">{MODE_TAG[n.to]}</div>
                </div>
                <div className="flex items-center justify-between border-t-2 border-dotted px-3 py-2" style={{ borderColor: 'var(--tint2)' }}>
                  <span className="font-display text-sm" style={{ color: 'var(--t1)' }}>{n.label}</span>
                  <n.icon size={16} className="card-icon" style={{ color: 'var(--t3)' }} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {NAV.slice(5).map((n) => (
            <Link key={n.to} to={n.to} onClick={() => sfx('select')} className="paper card-hover group flex items-center gap-3 px-3 py-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl shadow-sm ring-2 ring-white transition group-hover:-rotate-6 group-hover:scale-110" style={{ background: n.color }}><n.icon size={20} /></span>
              <span className="min-w-0"><span className="block font-display text-sm leading-tight">{n.label}</span><span className="label-jp text-[10px] text-cocoa">{n.jp}</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        {/* featured seasonal */}
        <div className="paper stitch relative p-4">
          <span className="tape tape-l" /><span className="tape tape-r" />
          <h2 className="h-section mb-3 !text-lg" data-mode="parfait"><Sparkles size={18} className="anim-bob self-center text-strawberry-deep" />Seasonal specials <span className="pill-label ml-auto self-center">{s.jp} 期間限定</span></h2>
          <div className="grid gap-2 sm:grid-cols-3">
            {FEATURED[season].map((f) => (
              <Link key={f.name} to={f.to} onClick={() => sfx('select')} className="card-hover rounded-2xl border-2 border-white p-3 shadow-sm" style={{ background: `linear-gradient(160deg, ${s.color}88, #fffdf8)` }}>
                <div className="label-jp text-[11px] text-strawberry-dark">{f.jp}</div>
                <div className="font-display text-sm leading-tight">{f.name}</div>
                <div className="mt-1 text-[11px] text-cocoa">{f.desc}</div>
              </Link>
            ))}
          </div>
        </div>
        {/* inspiration */}
        <div className="paper gingham-frame relative overflow-hidden p-4" style={{ background: 'linear-gradient(135deg,#FFF6DA,#FBE3EA)' }}>
          <h2 className="mb-2 flex items-center gap-2 font-display text-lg text-kiss-red"><Wand2 size={18} className="anim-wiggle text-strawberry-deep" />Daily inspiration</h2>
          <div className="ribbon mb-2">{idea.jp}</div>
          <p className="mb-3 text-sm">{idea.t}</p>
          <Link to={idea.to} className="btn-pink btn-sm">Let’s make it ♡</Link>
          <Star className="anim-bob pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 rotate-12 fill-butter text-butter opacity-70" />
        </div>
      </section>

      {/* recent */}
      <section>
        <div className="mb-3 flex items-end gap-3">
          <h2 className="h-section flex-1" data-mode="collection">Recently created <span className="jp">さいきんの作品</span></h2>
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
