import { NavLink, useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Home, CupSoda, IceCreamBowl, Croissant, Cookie, Store, BookHeart, Camera, ShoppingBag, Settings, Star, Volume2, VolumeX, MoreHorizontal, X } from 'lucide-react';
import { useGame, levelFor, STARS_PER_LEVEL } from '../../store/gameStore';
import { useSettings } from '../../store/settingsStore';
import { sfx } from '../../utils/sound';
import { SettingsModal } from '../../pages/SettingsModal';
import { PetalLayer } from '../common/PetalLayer';

export const NAV = [
  { to: '/', label: 'Home', jp: 'ホーム', icon: Home, color: '#F7B8C8' },
  { to: '/drink', label: 'Drink Studio', jp: 'ドリンク', icon: CupSoda, color: '#C9E2EF' },
  { to: '/parfait', label: 'Parfait Atelier', jp: 'パフェ', icon: IceCreamBowl, color: '#B9CBA5' },
  { to: '/crepe', label: 'Crêpe Kitchen', jp: 'クレープ', icon: Croissant, color: '#F7B8C8' },
  { to: '/cookie', label: 'Cookie Bakery', jp: 'クッキー', icon: Cookie, color: '#F6E5A9' },
  { to: '/cafe', label: 'My Café', jp: 'マイカフェ', icon: Store, color: '#F5D0BE' },
  { to: '/collection', label: 'My Collection', jp: 'コレクション', icon: BookHeart, color: '#F7B8C8' },
  { to: '/photo', label: 'Photo Studio', jp: 'フォト', icon: Camera, color: '#C9E2EF' },
  { to: '/shop', label: 'Shop', jp: 'ショップ', icon: ShoppingBag, color: '#F6E5A9' },
];
const MOBILE_MAIN = ['/', '/drink', '/cafe', '/collection'];

export function Logo({ small }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 64 64" className={`shrink-0 ${small ? 'h-9 w-9' : 'h-11 w-11'}`} aria-hidden>
        <circle cx="32" cy="32" r="30" fill="#F7B8C8" />
        <circle cx="32" cy="32" r="26" fill="#FFF8ED" />
        <path d="M20 26h24l-3 22c-.5 3-3 5-6 5h-6c-3 0-5.5-2-6-5z" fill="#F7B8C8" />
        <path d="M20 26h24l-1 8H21z" fill="#fff" opacity=".7" />
        <circle cx="32" cy="21" r="9" fill="#FFF6E2" stroke="#EADFC8" />
        <circle cx="37" cy="13" r="3.6" fill="#E01A35" />
        <path d="M37 10q2-4 5-5" stroke="#6B8E2E" strokeWidth="1.6" fill="none" />
      </svg>
      {!small && (
        <div className="leading-none">
          <div className="font-display text-xl tracking-wide text-kiss-red" style={{ WebkitTextStroke: '3px #fff6e8', paintOrder: 'stroke fill', textShadow: '0 2px 0 rgba(94,69,53,.2)' }}>YUMI CAFÉ</div>
          <div className="label-jp text-[10px] text-kiss-green">ゆみカフェ ・ my little café</div>
        </div>
      )}
    </div>
  );
}

function StarBar() {
  const stars = useGame((s) => s.stars);
  const prev = useRef(stars);
  const [bump, setBump] = useState(0);
  useEffect(() => {
    if (stars > prev.current) { setBump((b) => b + 1); sfx('coin'); }
    prev.current = stars;
  }, [stars]);
  const total = useGame((s) => s.totalEarned);
  const lvl = levelFor(total);
  const pct = ((total % STARS_PER_LEVEL) / STARS_PER_LEVEL) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 shadow-soft ring-2 ring-kiss-cream" title={`Café level ${lvl}`}>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-matcha text-[11px] font-bold text-white">{lvl}</span>
        <div className="hidden h-2 w-16 overflow-hidden rounded-full bg-cream sm:block"><motion.div className="h-full rounded-full bg-gradient-to-r from-matcha to-matcha-deep" initial={false} animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 120, damping: 18 }} /></div>
      </div>
      <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-bold shadow-soft ring-2 ring-kiss-cream" title="Stars">
        <Star key={bump} size={16} className={`fill-[#F6C945] text-[#E0A82E] ${bump ? 'anim-bump' : ''}`} /><span key={`n${bump}`} className={bump ? 'anim-bump' : ''}>{stars}</span>
      </div>
    </div>
  );
}

/** Keeps the exiting page's element during route transitions (so the next page mounts only once). */
function FrozenOutlet() {
  const o = useOutlet();
  const [frozen] = useState(o);
  return frozen;
}

export function MainLayout() {
  const loc = useLocation();
  const nav = useNavigate();
  const player = useGame((s) => s.player);
  const setLast = useGame((s) => s.setLastRoute);
  const sound = useSettings((s) => s.soundEnabled);
  const setS = useSettings((s) => s.set);
  const [more, setMore] = useState(false);
  const [settings, setSettings] = useState(false);

  useEffect(() => {
    if (loc.pathname !== '/') setLast(loc.pathname);
    setMore(false);
    window.scrollTo({ top: 0 });
    sfx('whoosh');
  }, [loc.pathname, setLast]);

  return (
    <div className="relative flex min-h-[100dvh]">
      <PetalLayer />
      {/* sidebar: tablet compact / desktop full */}
      <aside className="sticky top-0 z-[2] hidden h-[100dvh] shrink-0 flex-col gap-2 bg-[#FFFBF4]/95 px-2 pb-4 pt-6 backdrop-blur md:flex lg:w-64 lg:px-3">
        <div className="awning absolute inset-x-0 top-0" aria-hidden />
        <div className="slats absolute inset-y-0 right-0 w-2" aria-hidden />
        <button onClick={() => { sfx('click'); nav('/'); }} className="mb-1 mt-1 flex justify-center transition hover:scale-[1.03] lg:justify-start lg:px-2" aria-label="Home">
          <span className="hidden lg:block"><Logo /></span><span className="lg:hidden"><Logo small /></span>
        </button>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto" aria-label="Main">
          {NAV.map((n, i) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} onClick={() => sfx('tab')} title={n.label}
              style={{ ['--i' as any]: `${i * 35}ms` }}
              className={({ isActive }) => `nav-item anim-rise group flex items-center gap-3 rounded-2xl px-2.5 py-1.5 text-sm font-bold transition ${isActive ? 'is-active text-kiss-red' : 'text-cocoa hover:bg-white hover:shadow-soft'}`}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl shadow-sm ring-2 ring-white transition duration-200 group-hover:-rotate-6 group-hover:scale-110" style={{ background: n.color }}><n.icon size={18} /></span>
              <span className="hidden min-w-0 leading-tight lg:block"><span className="block truncate">{n.label}</span><span className="label-jp block text-[10px] font-medium text-cocoa-light">{n.jp}</span></span>
            </NavLink>
          ))}
        </nav>
        <button onClick={() => setSettings(true)} className="flex items-center gap-3 rounded-2xl px-2.5 py-2 text-sm font-bold text-cocoa hover:bg-white">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white shadow-sm"><Settings size={18} /></span><span className="hidden lg:block">Settings</span>
        </button>
      </aside>

      <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center gap-2 border-b-2 border-dotted border-strawberry/60 bg-cream/90 px-3 py-2 backdrop-blur md:px-5">
          <button className="md:hidden" onClick={() => nav('/')} aria-label="Home"><Logo small /></button>
          <div className="hidden min-w-0 md:block">
            <p className="truncate text-sm font-bold text-cocoa"><span className="ribbon !py-0.5 !text-xs">いらっしゃいませ</span> <span className="text-strawberry-dark">{player?.name || 'Yumi'}</span> <span className="anim-twinkle inline-block text-strawberry-deep">♡</span></p>
          </div>
          <div className="flex-1" />
          <StarBar />
          <button className="btn-icon !h-9 !w-9" onClick={() => { setS({ soundEnabled: !sound }); }} aria-label={sound ? 'Mute sounds' : 'Unmute sounds'}>{sound ? <Volume2 size={16} /> : <VolumeX size={16} />}</button>
          <button className="btn-icon !h-9 !w-9 md:hidden" onClick={() => setSettings(true)} aria-label="Settings"><Settings size={16} /></button>
        </header>

        <main className="relative z-[1] min-w-0 flex-1 pb-24 md:pb-6">
          <AnimatePresence mode="wait">
            <motion.div key={loc.pathname} initial={{ opacity: 0, y: 18, scale: 0.985, filter: 'blur(3px)' }} animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10, scale: 0.99, filter: 'blur(2px)' }} transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}>
              <FrozenOutlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-dotted border-strawberry/60 bg-[#FFFBF4]/95 px-2 pb-safe backdrop-blur md:hidden" aria-label="Main mobile">
        <div className="flex items-stretch justify-around">
          {NAV.filter((n) => MOBILE_MAIN.includes(n.to)).map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} onClick={() => sfx('tab')} className={({ isActive }) => `flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-bold ${isActive ? 'text-kiss-red' : 'text-cocoa'}`}>
              {({ isActive }) => (<>
                <motion.span animate={isActive ? { y: -4, scale: 1.12 } : { y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 15 }} className={`grid h-9 w-11 place-items-center rounded-2xl ${isActive ? 'shadow-sticker ring-2 ring-white' : ''}`} style={{ background: isActive ? n.color : 'transparent' }}><n.icon size={20} /></motion.span>
                {n.label.split(' ')[n.label.startsWith('My') ? 1 : 0]}
              </>)}
            </NavLink>
          ))}
          <button onClick={() => { sfx('pop'); setMore(true); }} className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-bold text-cocoa">
            <span className="grid h-9 w-11 place-items-center rounded-2xl"><MoreHorizontal size={20} /></span>More
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {more && (
          <motion.div className="fixed inset-0 z-[60] md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-cocoa-dark/30" onClick={() => setMore(false)} />
            <motion.div className="paper absolute inset-x-2 bottom-2 p-4 pb-safe" initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}>
              <div className="mb-3 flex items-center justify-between"><span className="font-display">All rooms</span><button className="btn-icon !h-8 !w-8" onClick={() => setMore(false)} aria-label="Close"><X size={16} /></button></div>
              <div className="grid grid-cols-3 gap-2">
                {NAV.map((n) => (
                  <NavLink key={n.to} to={n.to} end={n.to === '/'} className="tile !py-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: n.color }}><n.icon size={20} /></span>
                    <span className="text-center text-[11px]">{n.label}</span>
                  </NavLink>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <SettingsModal open={settings} onClose={() => setSettings(false)} />
    </div>
  );
}
