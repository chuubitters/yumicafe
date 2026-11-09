import { useState } from 'react';
import { motion } from 'framer-motion';
import { DoorOpen } from 'lucide-react';
import { CafeScene, CAFE_H, CAFE_W } from '../art/CafeScene';
import { ArtDefs } from '../art/Defs';
import { useCafe } from '../store/cafeStore';
import { useGame } from '../store/gameStore';
import { sfx } from '../utils/sound';
import { FloatingDeco } from '../components/common/Sparkles';

export default function Welcome({ onEnter }: { onEnter: () => void }) {
  const layout = useCafe((s) => s.layout);
  const player = useGame((s) => s.player);
  const create = useGame((s) => s.createPlayer);
  const [name, setName] = useState('');
  const [opening, setOpening] = useState(false);

  const enter = () => {
    if (!player) create(name.trim() || 'Yumi');
    sfx('ding');
    setOpening(true);
    setTimeout(onEnter, 900);
  };

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 py-8">
      <FloatingDeco />
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="z-10 mb-4 text-center">
        <div className="label-jp text-sm tracking-[0.4em] text-strawberry-deep">ようこそ</div>
        <h1 className="font-display text-4xl text-strawberry-dark text-shadow-soft sm:text-6xl">YUMI CAFÉ</h1>
        <p className="mt-1 font-display text-sm text-cocoa sm:text-base">My Little Japanese Café</p>
      </motion.div>

      <motion.div className="relative z-10 w-full max-w-4xl" animate={opening ? { scale: 2.6, y: 80, opacity: 0 } : { scale: 1 }} transition={{ duration: 0.9, ease: 'easeIn' }}>
        <div className="stage-surface">
          <svg viewBox={`0 0 ${CAFE_W} ${CAFE_H}`} className="block w-full" role="img" aria-label="Your café storefront">
            <ArtDefs />
            <CafeScene layout={layout} view="exterior" />
          </svg>
        </div>
      </motion.div>

      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="paper stitch z-10 -mt-8 flex w-full max-w-md flex-col items-center gap-3 p-5 text-center">
        {player ? (
          <p className="font-bold">おかえりなさい, <span className="text-strawberry-dark">{player.name}</span>! Your café missed you ♡</p>
        ) : (
          <label className="w-full text-sm font-bold">What’s the café owner’s name?
            <input className="input mt-2 text-center" placeholder="Yumi" maxLength={20} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && enter()} autoFocus />
          </label>
        )}
        <button className="btn-deep px-8 py-3 text-base" onClick={enter}><DoorOpen size={20} />Enter Café</button>
        <p className="text-[11px] text-cocoa">No sign-up · progress saves on this device · sound starts after you tap</p>
      </motion.div>
    </div>
  );
}
