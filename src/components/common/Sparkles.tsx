import { motion } from 'framer-motion';
import { Glyph, type GlyphName } from './Glyph';

/** Burst of sparkles / hearts / stars used by finishing animations. */
export function SparkleBurst({ count = 18, className = '' }: { count?: number; className?: string }) {
  const shapes: GlyphName[] = ['sparkle', 'heart', 'star', 'flower', 'daisy'];
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-visible ${className}`} aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        const d = 110 + (i % 4) * 40;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 -ml-3 -mt-3 text-2xl"
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d, scale: [0, 1.4, 1], opacity: [1, 1, 0], rotate: 180 }}
            transition={{ duration: 1.4, delay: (i % 5) * 0.04, ease: 'easeOut' }}
          >
            <Glyph name={shapes[i % shapes.length]} size="1em" />
          </motion.span>
        );
      })}
    </div>
  );
}

export function FloatingDeco({ className = '' }: { className?: string }) {
  const items: { g: GlyphName; x: string; y: string; d: number; s: number }[] = [
    { g: 'flower', x: '6%', y: '12%', d: 0, s: 30 },
    { g: 'sparkle', x: '88%', y: '8%', d: 1, s: 26 },
    { g: 'heart', x: '92%', y: '62%', d: 2, s: 26 },
    { g: 'daisy', x: '4%', y: '70%', d: 1.5, s: 28 },
    { g: 'star', x: '50%', y: '3%', d: 0.6, s: 22 },
  ];
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      {items.map((it, i) => (
        <span key={i} className="anim-float absolute opacity-90" style={{ left: it.x, top: it.y, animationDelay: `${it.d}s` }}><Glyph name={it.g} size={it.s} /></span>
      ))}
    </div>
  );
}
