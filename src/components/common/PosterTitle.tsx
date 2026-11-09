import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export type ModeId = 'drink' | 'parfait' | 'crepe' | 'cookie' | 'cafe' | 'photo' | 'shop' | 'collection';

/** Stamp-style round badge text per mode (borrowed from the 純喫茶仕立て / 期間限定 posters). */
const BADGE: Record<ModeId, [string, string]> = {
  drink: ['純喫茶', '仕立て'],
  parfait: ['春限定', '桜'],
  crepe: ['人気', 'No.1'],
  cookie: ['焼きたて', 'ほかほか'],
  cafe: ['営業中', 'OPEN'],
  photo: ['映え', '♡'],
  shop: ['おまけ', 'つき'],
  collection: ['宝物', '♡'],
};

/** Wraps a page so it picks up the per-mode palette and the tinted poster band behind the header. */
export function ModeFrame({ mode, className = '', children }: { mode: ModeId; className?: string; children: ReactNode }) {
  return (
    <div data-mode={mode} className={`relative isolate ${className}`}>
      <div className="mode-band" aria-hidden />
      {children}
    </div>
  );
}

interface Props {
  mode: ModeId;
  title: string;
  jp: string;
  subtitle?: ReactNode;
  right?: ReactNode;
  badge?: boolean;
}

/** Kicker + outlined display title + double rule + subtitle. */
export function TitleBlock({ title, jp, subtitle, small }: { title: string; jp: string; subtitle?: ReactNode; small?: boolean }) {
  return (
    <>
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="poster-kicker flex items-center gap-2">
        <span className="anim-twinkle">✦</span>{jp}<span className="anim-twinkle" style={{ animationDelay: '.6s' }}>✦</span>
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className={`poster-title ${small ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-[28px] sm:text-4xl md:text-[44px]'}`}>
        {title}
      </motion.h1>
      <div className="rule-double mt-1.5 max-w-[420px]" />
      {subtitle && <p className="mt-1.5 max-w-prose text-xs text-cocoa md:text-sm">{subtitle}</p>}
    </>
  );
}

/** Rotating red stamp badge. */
export function Stamp({ mode }: { mode: ModeId }) {
  const [a, b] = BADGE[mode];
  return (
    <motion.div initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 8 }} transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.15 }}
      className="badge-round relative hidden h-[68px] w-[68px] shrink-0 aspect-square text-[11px] sm:grid" aria-hidden>
      <span className="sunburst anim-sun absolute inset-0 rounded-full opacity-60" />
      <span className="relative">{a}<br />{b}</span>
    </motion.div>
  );
}

/** Poster-style page headline used by the studio pages. */
export function PosterTitle({ mode, title, jp, subtitle, right, badge = true }: Props) {
  return (
    <header className="flex flex-wrap items-start gap-x-4 gap-y-2">
      <div className="min-w-[200px] flex-1"><TitleBlock title={title} jp={jp} subtitle={subtitle} /></div>
      {right}
      {badge && <Stamp mode={mode} />}
    </header>
  );
}
