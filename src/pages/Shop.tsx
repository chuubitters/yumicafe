import { motion } from 'framer-motion';
import { Check, Gift, Lock, Star, Trophy } from 'lucide-react';
import { ACHIEVEMENTS, LOCKS, type LockInfo } from '../data/catalog';
import { useGame, useUnlocked, levelFor, STARS_PER_LEVEL } from '../store/gameStore';
import { SpriteThumb } from '../art/sprites';
import { toast } from '../store/toastStore';
import { sfx } from '../utils/sound';
import { confirmDialog } from '../components/common/ConfirmDialog';
import { ModeFrame, TitleBlock, Stamp } from '../components/common/PosterTitle';
import { Glyph, type GlyphName } from '../components/common/Glyph';

const PREVIEW: Record<string, React.ReactNode> = {
  'furn:lantern': <SpriteThumb id="f-lantern" size={52} />,
  'furn:noren': <SpriteThumb id="f-noren" size={52} />,
  'furn:lucky-cat': <SpriteThumb id="f-luckycat" size={52} />,
  'furn:jukebox': <SpriteThumb id="f-jukebox" size={52} />,
  'furn:fishtank': <SpriteThumb id="f-fishbowl" size={52} />,
  'sticker:wagashi': <SpriteThumb id="nerikiri" size={48} />,
  'sticker:retro': <SpriteThumb id="cream-soda-icon" size={48} />,
};
const CAT_GLYPH: Record<string, GlyphName> = { Glasses: 'glass', Flavors: 'juice', 'Ice cream': 'icecream', 'Cookie cutters': 'cookie', Backgrounds: 'frame', 'Café walls': 'pagoda', 'Café floors': 'tile', Stickers: 'sparkle', Furniture: 'chair' };

export default function Shop() {
  const stars = useGame((s) => s.stars);
  const total = useGame((s) => s.totalEarned);
  const done = useGame((s) => s.completedAchievements);
  const counters = useGame((s) => s.counters);
  const lastGift = useGame((s) => s.lastGift);
  const isUnlocked = useUnlocked();
  const lvl = levelFor(total);
  const cats = Array.from(new Set(LOCKS.map((l) => l.category)));
  const giftReady = lastGift !== new Date().toDateString();

  const buy = async (l: LockInfo) => {
    if (!l.price) return;
    if (useGame.getState().stars < l.price) { sfx('error'); toast(`You need ${l.price - useGame.getState().stars} more stars`, 'error'); return; }
    if (!(await confirmDialog(`Unlock ${l.name}?`, `Spend ${l.price} stars to unlock it forever.`, `Unlock for ${l.price} stars`))) return;
    if (useGame.getState().spend(l.price)) {
      useGame.getState().unlock(l.key);
      sfx('coin');
      toast(`${l.name} unlocked!`, 'success');
    }
  };

  return (
    <ModeFrame mode="shop" className="mx-auto flex max-w-[1300px] flex-col gap-5 px-3 py-4 md:px-5">
      <header className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <TitleBlock small title="Café Shop" jp="ショップ" subtitle="Earn stars by creating — spend them on extra goodies. Everything you need to play is already free." />
        </div>
        <Stamp mode="shop" />
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="paper flex items-center gap-3 p-4">
          <Star className="h-10 w-10 fill-[#F6C945] text-[#E0A82E]" />
          <div><div className="font-display text-2xl">{stars}</div><div className="text-xs text-cocoa">stars to spend</div></div>
        </div>
        <div className="paper flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-matcha font-display text-lg text-white">{lvl}</span>
          <div className="flex-1"><div className="font-display">Café level {lvl}</div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-cream"><div className="h-full bg-matcha-deep" style={{ width: `${((total % STARS_PER_LEVEL) / STARS_PER_LEVEL) * 100}%` }} /></div>
            <div className="text-[10px] text-cocoa">{STARS_PER_LEVEL - (total % STARS_PER_LEVEL)} <Glyph name="star" /> to level {lvl + 1}</div></div>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} disabled={!giftReady} onClick={() => { if (useGame.getState().claimGift()) sfx('coin'); }} className="paper flex items-center gap-3 p-4 text-left disabled:opacity-60">
          <Gift className={`h-10 w-10 text-strawberry-deep ${giftReady ? 'anim-wiggle' : ''}`} />
          <div><div className="font-display">{giftReady ? 'Daily gift ready!' : 'Gift claimed today'}</div><div className="text-xs text-cocoa">{giftReady ? <>Tap for +10 <Glyph name="star" /></> : 'Come back tomorrow'}</div></div>
        </motion.button>
      </section>

      {cats.map((c) => (
        <section key={c}>
          <h2 className="mb-2 flex items-center gap-2 font-display text-lg"><Glyph name={CAT_GLYPH[c] || 'sparkle'} size={24} />{c}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {LOCKS.filter((l) => l.category === c).map((l) => {
              const owned = isUnlocked(l.key);
              return (
                <div key={l.key} className={`paper relative flex flex-col items-center gap-2 p-3 text-center ${owned ? '' : ''}`}>
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-cream text-3xl">{PREVIEW[l.key] || <Glyph name={CAT_GLYPH[c] || 'sparkle'} size={40} />}</div>
                  <div className="text-sm font-bold leading-tight">{l.name}</div>
                  {owned ? <span className="chip !bg-matcha/60 text-matcha-dark"><Check size={12} />Unlocked</span>
                    : l.price ? <button className="btn-butter btn-sm" onClick={() => buy(l)}><Star size={12} className="fill-current" />{l.price}</button>
                      : <span className="chip"><Lock size={12} />Reach level {l.level}</span>}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <section>
        <h2 className="mb-2 flex items-center gap-2 font-display text-lg"><Trophy size={18} className="text-[#D4A746]" />Milestones <span className="label-jp text-xs text-strawberry-deep">じっせき</span></h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a) => {
            const ok = done.includes(a.id);
            return (
              <div key={a.id} className={`flex items-center gap-3 rounded-2xl p-3 shadow-soft ${ok ? 'bg-matcha/40' : 'bg-white/80'}`}>
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${ok ? 'bg-matcha-deep text-white' : 'bg-cream text-cocoa-light'}`}>{ok ? <Check size={18} /> : <Trophy size={18} />}</span>
                <div className="min-w-0 flex-1"><div className="text-sm font-bold">{a.name}</div><div className="text-xs text-cocoa">{a.desc}</div></div>
                <span className="chip">+{a.stars}<Glyph name="star" className="ml-0.5" /></span>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-cocoa">Progress: {counters.drink} drinks · {counters.parfait} parfaits · {counters.crepe} crêpes · {counters.cookiesBaked} cookies baked · {counters.uploads} uploads</p>
      </section>
    </ModeFrame>
  );
}
