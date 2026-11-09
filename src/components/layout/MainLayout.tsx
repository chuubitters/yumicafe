import { NavLink, useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Home, CupSoda, IceCreamBowl, Croissant, Cookie, Store, BookHeart, Camera, ShoppingBag, Settings, Star, Volume2, VolumeX, MoreHorizontal, X } from 'lucide-react';
import { useGame, levelFor, STARS_PER_LEVEL } from '../../store/gameStore';
import { useSettings } from '../../store/settingsStore';
import { sfx } from '../../utils/sound';
import { SettingsModal } from '../../pages/SettingsModal';

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
      <svg viewBox="0 0 64 64" className={small ? 'h-9 w-9' : 'h-11 w-11'} aria-hidden>
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
          <div className="font-display text-xl tracking-wide text-strawberry-dark">YUMI CAFÉ</div>
          <div className="label-jp text-[10px] text-cocoa">ゆみカフェ ・ my little café</div>
        </div>
      )}
    </div>
  );
}

function StarBar() {
  const stars = useGame((s) => s.stars);
  const total = useGame((s) => s.totalEarned);
  const lvl = levelFor(total);
  const pct = ((total % STARS_PER_LEVEL) / STARS_PER_LEVEL) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 shadow-soft" title={`Café level ${lvl}`}>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-matcha text-[11px] font-bold text-white">{lvl}</span>
        <div className="hidden h-2 w-16 overflow-hidden rounded-full bg-cream sm:block"><div className="h-full rounded-full bg-matcha-deep" style={{ width: `${pct}%` }} /></div>
      </div>
      <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-bold shadow-soft" title="Stars">
        <Star size={16} className="fill-[#F6C945] text-[#E0A82E]" />{stars}
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
  }, [loc.pathname, setLast]);

  return (
    <div className="flex min-h-[100dvh]">
      {/* sidebar: tablet compact / desktop full */}
      <aside className="sticky top-0 hidden h-[100dvh] shrink-0 flex-col gap-2 border-r border-[#F1E3CF] bg-[#FFFBF4]/90 px-2 py-4 backdrop-blur md:flex lg:w-60 lg:px-3">
        <button onClick={() => nav('/')} className="mb-2 flex justify-center lg:justify-start lg:px-2" aria-label="Home">
          <span className="hidden lg:block"><Logo /></span><span className="lg:hidden"><Logo small /></span>
        </button>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} onClick={() => sfx('click')}
              className={({ isActive }) => `group flex items-center gap-3 rounded-2xl px-2.5 py-2 text-sm font-bold transition ${isActive ? 'bg-strawberry/60 text-[#7A2E43] shadow-soft' : 'text-cocoa hover:bg-white'}`}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl shadow-sm transition group-hover:scale-110" style={{ background: n.color }}><n.icon size={18} /></span>
              <span className="hidden lg:block">{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <button onClick={() => setSettings(true)} className="flex items-center gap-3 rounded-2xl px-2.5 py-2 text-sm font-bold text-cocoa hover:bg-white">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white shadow-sm"><Settings size={18} /></span><span className="hidden lg:block">Settings</span>
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center gap-2 border-b border-[#F1E3CF]/70 bg-cream/85 px-3 py-2 backdrop-blur md:px-5">
          <button className="md:hidden" onClick={() => nav('/')} aria-label="Home"><Logo small /></button>
          <div className="hidden min-w-0 md:block">
            <p className="truncate text-sm font-bold text-cocoa">いらっしゃいませ, <span className="text-strawberry-dark">{player?.name || 'Yumi'}</span> ♡</p>
          </div>
          <div className="flex-1" />
          <StarBar />
          <button className="btn-icon !h-9 !w-9" onClick={() => setS({ soundEnabled: !sound })} aria-label={sound ? 'Mute sounds' : 'Unmute sounds'}>{sound ? <Volume2 size={16} /> : <VolumeX size={16} />}</button>
          <button className="btn-icon !h-9 !w-9 md:hidden" onClick={() => setSettings(true)} aria-label="Settings"><Settings size={16} /></button>
        </header>

        <main className="min-w-0 flex-1 pb-24 md:pb-6">
          <AnimatePresence mode="wait">
            <motion.div key={loc.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
              <FrozenOutlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#F1E3CF] bg-[#FFFBF4]/95 px-2 pb-safe backdrop-blur md:hidden" aria-label="Main mobile">
        <div className="flex items-stretch justify-around">
          {NAV.filter((n) => MOBILE_MAIN.includes(n.to)).map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} onClick={() => sfx('click')} className={({ isActive }) => `flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-bold ${isActive ? 'text-strawberry-dark' : 'text-cocoa'}`}>
              {({ isActive }) => (<>
                <span className={`grid h-9 w-11 place-items-center rounded-2xl transition ${isActive ? 'scale-110 shadow-soft' : ''}`} style={{ background: isActive ? n.color : 'transparent' }}><n.icon size={20} /></span>
                {n.label.split(' ')[n.label.startsWith('My') ? 1 : 0]}
              </>)}
            </NavLink>
          ))}
          <button onClick={() => setMore(true)} className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-bold text-cocoa">
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
