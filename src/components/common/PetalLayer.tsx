import { useMemo } from 'react';

/** Soft sakura petals drifting behind the UI (pure CSS, disabled by reduced-motion). */
export function PetalLayer({ count = 12 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: `${(i * 83 + 11) % 100}%`,
        s: `${14 + ((i * 7) % 13)}px`,
        d: `${14 + ((i * 5) % 11)}s`,
        delay: `${-((i * 3.3) % 16)}s`,
        sway: `${(i % 2 ? 1 : -1) * (40 + ((i * 17) % 70))}px`,
      })),
    [count]
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {petals.map((p, i) => (
        <span key={i} className="petal" style={{ ['--x' as any]: p.x, ['--s' as any]: p.s, ['--d' as any]: p.d, ['--delay' as any]: p.delay, ['--sway' as any]: p.sway }} />
      ))}
    </div>
  );
}
