import { useState } from 'react';
import { motion } from 'framer-motion';
import { DoorOpen } from 'lucide-react';
import { CafeScene, CAFE_H, CAFE_W } from '../art/CafeScene';
import { ArtDefs } from '../art/Defs';
import { useCafe } from '../store/cafeStore';
import { useGame } from '../store/gameStore';
import { sfx } from '../utils/sound';
import { FloatingDeco } from '../components/common/Sparkles';
import { PetalLayer } from '../components/common/PetalLayer';

export default function Welcome({ onEnter }: { onEnter: () => void }) {
  const layout = useCafe((s) => s.layout);
  const player = useGame((s) => s.player);
  const create = useGame((s) => s.createPlayer);
  const [name, setName] = useState('');
  const [opening, setOpening] = useState(false);

  const enter = () => {
    if (!player) create(name.trim() || 'Yumi');
    sfx('unlock');
    setTimeout(() => sfx('ding'), 350);
    setOpening(true);
    setTimeout(onEnter, 900);
  };

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 pb-6 pt-8">
      <PetalLayer count={18} />
      <FloatingDeco />
      <div className="awning absolute inset-x-0 top-0 z-10" aria-hidden />
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="z-10 mb-4 mt-4 text-center">
        <div className="poster-kicker !tracking-[0.5em]" data-mode="cafe">✦ ようこそ ✦</div>
        <h1 className="poster-title text-[40px] sm:text-7xl" data-mode="cafe" aria-label="YUMI CAFÉ">
          {'YUMI CAFÉ'.split('').map((ch, i) => (
            <motion.span key={i} className="inline-block" initial={{ y: -40, opacity: 0, rotate: -12 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 11, delay: 0.1 + i * 0.06 }}>{ch === ' ' ? '\u00A0' : ch}</motion.span>
          ))}
        </h1>
        <div className="mx-auto mt-2 flex items-center justify-center gap-3">
          <span className="rule-double w-12" /><span className="ribbon">My Little Japanese Café</span><span className="rule-double w-12" />
        </div>
      </motion.div>

      <motion.div className="relative z-10 mx-auto w-full" style={{ maxWidth: `max(300px, min(56rem, calc((100dvh - 420px) * ${CAFE_W / CAFE_H})))` }} animate={opening ? { scale: 2.6, y: 80, opacity: 0 } : { scale: 1 }} transition={{ duration: 0.9, ease: 'easeIn' }}>
        <div className="stage-surface ring-4 ring-kiss-cream">
          <svg viewBox={`0 0 ${CAFE_W} ${CAFE_H}`} className="block w-full" role="img" aria-label="Your café storefront">
            <ArtDefs />
            <CafeScene layout={layout} view="exterior" />
          </svg>
        </div>
      </motion.div>

      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="paper stitch relative z-10 -mt-8 flex w-full max-w-md flex-col items-center gap-3 p-5 text-center">
        {player ? (
          <p className="font-bold">おかえりなさい, <span className="text-strawberry-dark">{player.name}</span>! Your café missed you ♡</p>
        ) : (
          <label className="w-full text-sm font-bold">What’s the café owner’s name?
            <input className="input mt-2 text-center" placeholder="Yumi" maxLength={20} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && enter()} ref={(el) => el?.focus({ preventScroll: true })} />
          </label>
        )}
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-cherry px-8 py-3 text-base" onClick={enter}><DoorOpen size={20} />Enter Café</motion.button>
        <p className="text-[11px] text-cocoa">No sign-up · progress saves on this device · sound starts after you tap</p>
      </motion.div>
    </div>
  );
}
