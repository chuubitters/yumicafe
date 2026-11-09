import { motion } from 'framer-motion';

/** Burst of sparkles / hearts / stars used by finishing animations. */
export function SparkleBurst({ count = 18, className = '' }: { count?: number; className?: string }) {
  const shapes = ['✦', '♡', '★', '✿', '✧'];
  const colors = ['#F27D9B', '#F6C945', '#7FB069', '#7CB7DB', '#E8869F'];
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-visible ${className}`} aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        const d = 110 + (i % 4) * 40;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 text-xl font-bold"
            style={{ color: colors[i % colors.length] }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d, scale: [0, 1.4, 1], opacity: [1, 1, 0], rotate: 180 }}
            transition={{ duration: 1.4, delay: (i % 5) * 0.04, ease: 'easeOut' }}
          >
            {shapes[i % shapes.length]}
          </motion.span>
        );
      })}
    </div>
  );
}

export function FloatingDeco({ className = '' }: { className?: string }) {
  const items = [
    { s: '✿', x: '6%', y: '12%', c: '#F7B8C8', d: 0 },
    { s: '✦', x: '88%', y: '8%', c: '#F6C945', d: 1 },
    { s: '♡', x: '92%', y: '62%', c: '#E8869F', d: 2 },
    { s: '✧', x: '4%', y: '70%', c: '#7CB7DB', d: 1.5 },
    { s: '❀', x: '50%', y: '3%', c: '#B9CBA5', d: 0.6 },
  ];
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      {items.map((it, i) => (
        <span key={i} className="anim-float absolute text-2xl" style={{ left: it.x, top: it.y, color: it.c, animationDelay: `${it.d}s` }}>{it.s}</span>
      ))}
    </div>
  );
}
