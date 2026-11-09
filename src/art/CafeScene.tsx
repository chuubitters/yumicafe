import type { ReactNode } from 'react';
import type { CafeLayout } from '../types';
import { FLOORS, WALLPAPERS } from '../data/catalog';
import { shade, rng } from '../utils/misc';
import { useCollection } from '../store/collectionStore';

export const CAFE_W = 1200;
export const CAFE_H = 800;
const FLOOR_Y = 560;
const VP = { x: 600, y: 160 };

function Wall({ id }: { id: string }) {
  const w = WALLPAPERS.find((x) => x.id === id) || WALLPAPERS[0];
  const c1 = w.color!, c2 = w.color2!;
  let pattern: ReactNode = null;
  switch (w.id) {
    case 'stripe-pink':
      pattern = <pattern id="wp-p" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill={c1} /><rect width="30" height="60" fill={c2} /><rect x="29" width="2" height="60" fill="#fff" opacity=".5" /></pattern>;
      break;
    case 'dots-cream':
      pattern = <pattern id="wp-p" width="48" height="48" patternUnits="userSpaceOnUse"><rect width="48" height="48" fill={c1} /><circle cx="12" cy="12" r="5" fill={c2} /><circle cx="36" cy="36" r="5" fill={c2} /></pattern>;
      break;
    case 'gingham-green':
      pattern = <pattern id="wp-p" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill={c1} /><rect width="20" height="40" fill={c2} opacity=".55" /><rect width="40" height="20" fill={c2} opacity=".55" /></pattern>;
      break;
    case 'sky':
      pattern = <pattern id="wp-p" width="240" height="160" patternUnits="userSpaceOnUse"><rect width="240" height="160" fill={c1} /><g fill="#fff" opacity=".9"><ellipse cx="60" cy="50" rx="34" ry="14" /><ellipse cx="80" cy="42" rx="22" ry="14" /><ellipse cx="180" cy="120" rx="30" ry="12" /><ellipse cx="196" cy="112" rx="18" ry="12" /></g></pattern>;
      break;
    case 'brick':
      pattern = <pattern id="wp-p" width="80" height="40" patternUnits="userSpaceOnUse"><rect width="80" height="40" fill={c2} /><rect x="2" y="2" width="76" height="16" rx="2" fill={c1} /><rect x="-38" y="22" width="76" height="16" rx="2" fill={c1} /><rect x="42" y="22" width="76" height="16" rx="2" fill={c1} /></pattern>;
      break;
    case 'shoji':
      pattern = <pattern id="wp-p" width="90" height="120" patternUnits="userSpaceOnUse"><rect width="90" height="120" fill={c1} /><path d="M0 0H90M0 40H90M0 80H90M0 0V120M45 0V120" stroke={c2} strokeWidth="5" /></pattern>;
      break;
  }
  return (
    <g>
      <defs>{pattern}</defs>
      <rect width={CAFE_W} height={FLOOR_Y} fill="url(#wp-p)" />
      {/* wainscot */}
      <rect y={FLOOR_Y - 110} width={CAFE_W} height="110" fill="#FFFDF8" />
      {Array.from({ length: 24 }).map((_, i) => <rect key={i} x={i * 50 + 6} y={FLOOR_Y - 98} width="38" height="86" rx="3" fill="none" stroke="#EADFC8" strokeWidth="3" />)}
      <rect y={FLOOR_Y - 118} width={CAFE_W} height="10" fill="url(#yc-wood)" />
      <rect y={FLOOR_Y - 12} width={CAFE_W} height="14" fill="url(#yc-wood)" />
      {/* ceiling shade + crown */}
      <rect width={CAFE_W} height="18" fill="url(#yc-wood)" />
      <rect y="18" width={CAFE_W} height="60" fill="url(#cafe-ceil)" />
    </g>
  );
}

function Floor({ id }: { id: string }) {
  const f = FLOORS.find((x) => x.id === id) || FLOORS[0];
  const rows: number[] = [];
  for (let i = 0; i <= 9; i++) rows.push(FLOOR_Y + (CAFE_H - FLOOR_Y) * Math.pow(i / 9, 1.35));
  const projX = (x: number, y: number) => VP.x + (x - VP.x) * ((y - VP.y) / (CAFE_H - VP.y));
  const cols = Array.from({ length: 17 }).map((_, i) => -600 + i * 150);
  const r = rng(9);
  const els: ReactNode[] = [<rect key="bg" y={FLOOR_Y} width={CAFE_W} height={CAFE_H - FLOOR_Y} fill={f.color} />];
  if (f.id === 'checker' || f.id === 'mint' || f.id === 'herring' || f.id === 'tatami') {
    for (let ri = 0; ri < rows.length - 1; ri++) {
      for (let ci = 0; ci < cols.length - 1; ci++) {
        const y0 = rows[ri], y1 = rows[ri + 1];
        const pts = [[projX(cols[ci], y0), y0], [projX(cols[ci + 1], y0), y0], [projX(cols[ci + 1], y1), y1], [projX(cols[ci], y1), y1]];
        const alt = (ri + ci) % 2 === 0;
        const fill = f.id === 'tatami' ? (alt ? f.color : shade(f.color!, -0.05)) : alt ? f.color : f.color2;
        els.push(<polygon key={`${ri}-${ci}`} points={pts.map((p) => p.join(',')).join(' ')} fill={fill} stroke={f.id === 'mint' ? '#fff' : f.id === 'tatami' ? '#5E6B3A' : f.id === 'herring' ? shade(f.color2!, -0.15) : 'none'} strokeWidth={f.id === 'tatami' ? 4 : 2} />);
        if (f.id === 'herring') els.push(<line key={`h${ri}-${ci}`} x1={pts[alt ? 0 : 1][0]} y1={y0} x2={pts[alt ? 2 : 3][0]} y2={y1} stroke={shade(f.color2!, -0.15)} strokeWidth="2" />);
      }
    }
  } else {
    // wood planks
    for (let ri = 0; ri < rows.length - 1; ri++) {
      const y0 = rows[ri], y1 = rows[ri + 1];
      els.push(<rect key={`p${ri}`} x="0" y={y0} width={CAFE_W} height={y1 - y0} fill={ri % 2 ? f.color : shade(f.color!, -0.04)} />);
      els.push(<line key={`l${ri}`} x1="0" y1={y0} x2={CAFE_W} y2={y0} stroke={shade(f.color2!, -0.15)} strokeWidth="2" />);
      for (let k = 0; k < 6; k++) {
        const x = ((k * 230 + ri * 97) % 1300) - 50;
        els.push(<line key={`s${ri}-${k}`} x1={projX(x, y0)} y1={y0} x2={projX(x, y1)} y2={y1} stroke={shade(f.color2!, -0.1)} strokeWidth="2" />);
        els.push(<path key={`g${ri}-${k}`} d={`M${projX(x + 40, y0) + 10} ${(y0 + y1) / 2} q30 ${-3 + r() * 6} 70 0`} stroke={shade(f.color2!, -0.05)} strokeWidth="1.5" fill="none" opacity=".6" />);
      }
    }
  }
  return (
    <g>
      {els}
      <rect y={FLOOR_Y} width={CAFE_W} height={CAFE_H - FLOOR_Y} fill="url(#cafe-floor-shade)" />
    </g>
  );
}

function SeasonParticles({ theme, count = 18 }: { theme: string; count?: number }) {
  const r = rng(theme.length * 7);
  const glyph = (i: number) => {
    switch (theme) {
      case 'spring': return <path d="M0 0 C-6 -5 -5 -13 -1 -14 L0 -12 L1 -14 C5 -13 6 -5 0 0Z" fill="#F7B8C8" />;
      case 'autumn': return <path d="M0 8 L0 3 L-7 4 L-5 1 L-10 -2 L-7 -3 L-8 -8 L-4 -5 L-2 -9 L0 -6 L2 -9 L4 -5 L8 -8 L7 -3 L10 -2 L5 1 L7 4 L0 3" fill={i % 2 ? '#E8662E' : '#F2A65A'} />;
      case 'winter': return <circle r={2 + (i % 3)} fill="#fff" />;
      default: return <path d="M0 -6 L1.5 -1.5 L6 0 L1.5 1.5 L0 6 L-1.5 1.5 L-6 0 L-1.5 -1.5Z" fill="#FFE37A" />;
    }
  };
  return (
    <g pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => (
        <g key={i} transform={`translate(${r() * CAFE_W} ${-20 - r() * 200})`}>
          <g className="anim-fall" style={{ animationDuration: `${9 + r() * 10}s`, animationDelay: `${-r() * 18}s` }}>
            <g transform={`scale(${1 + r()})`}>{glyph(i)}</g>
          </g>
        </g>
      ))}
    </g>
  );
}

function Exterior({ layout }: { layout: CafeLayout }) {
  const ex = layout.exterior;
  const th = layout.theme;
  const sky = th === 'winter' ? ['#AFC9DE', '#E9F2F8'] : th === 'autumn' ? ['#F4B98A', '#FDE9D4'] : th === 'summer' ? ['#6CC0EC', '#DDF2FB'] : ['#B9E0F4', '#FBEFF4'];
  const all = useCollection((s) => s.creations);
  const creations = all.filter((c) => c.type !== 'cafe').slice(0, 4);
  const previews = useCollection((s) => s.previews);
  return (
    <g>
      <defs>
        <linearGradient id="ext-sky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} /></linearGradient>
        <pattern id="awning" width="80" height="120" patternUnits="userSpaceOnUse"><rect width="80" height="120" fill="#fff" /><rect width="40" height="120" fill={ex.awning} /></pattern>
        <pattern id="sidewalk" width="120" height="60" patternUnits="userSpaceOnUse"><rect width="120" height="60" fill="#E9DFD2" /><rect x="2" y="2" width="116" height="56" rx="4" fill="#F3EBE0" /></pattern>
      </defs>
      <rect width={CAFE_W} height={CAFE_H} fill="url(#ext-sky)" />
      {th === 'summer' && <circle cx="1060" cy="90" r="50" fill="#FFE27A" />}
      <g fill="#fff" opacity=".85"><ellipse cx="180" cy="90" rx="80" ry="24" /><ellipse cx="220" cy="74" rx="50" ry="24" /><ellipse cx="900" cy="60" rx="70" ry="20" /></g>
      {/* neighbour buildings */}
      <rect x="0" y="180" width="160" height="470" fill={shade(ex.facade, -0.12)} />
      <rect x="1040" y="160" width="160" height="490" fill="#E6DCCF" />
      {[220, 320, 420].map((y) => <rect key={y} x="1070" y={y} width="100" height="60" rx="4" fill="#C9E2EF" opacity=".8" />)}
      {/* façade */}
      <rect x="150" y="110" width="900" height="540" fill={ex.facade} />
      <rect x="150" y="110" width="900" height="540" fill="url(#yc-vol)" opacity=".18" />
      <rect x="140" y="96" width="920" height="22" rx="6" fill="url(#yc-wood)" />
      {/* sign */}
      <rect x="380" y="132" width="440" height="96" rx="20" fill="#FFFDF8" stroke={ex.awning} strokeWidth="6" />
      <text x="600" y="196" textAnchor="middle" fontFamily='"Mochiy Pop One", Mali, sans-serif' fontSize="44" fill={shade(ex.awning, -0.2)}>{ex.signText || 'YUMI CAFÉ'}</text>
      <text x="600" y="220" textAnchor="middle" fontFamily='"Zen Maru Gothic", Mali, sans-serif' fontWeight="700" fontSize="14" fill="#92745F" letterSpacing="6">甘味処 ・ SWEETS & COFFEE</text>
      {/* awning */}
      <path d="M170 250 H1030 L1060 320 H140Z" fill="url(#awning)" />
      <path d="M170 250 H1030 L1060 320 H140Z" fill="url(#yc-vol)" opacity=".25" />
      <path d={`M140 320 ${Array.from({ length: 23 }).map((_, i) => `q20 26 40 0`).join(' ')}`} fill={ex.awning} transform="translate(0 0)" />
      {th === 'winter' && <path d="M168 248 Q600 230 1032 248 L1030 258 Q600 244 170 258Z" fill="#fff" />}
      {/* windows with real creations */}
      {[210, 790].map((x, wi) => (
        <g key={x}>
          <rect x={x} y="370" width="200" height="200" rx="10" fill="#5E3A27" />
          <rect x={x + 10} y="380" width="180" height="180" rx="6" fill="#FFF3DC" />
          <rect x={x + 10} y="500" width="180" height="8" fill="url(#yc-wood)" />
          {creations.slice(wi * 2, wi * 2 + 2).map((c, k) => previews[c.id] && (
            <image key={c.id} href={previews[c.id]} x={x + 20 + k * 82} y={410} width="78" height="92" preserveAspectRatio="xMidYMax meet" />
          ))}
          {creations.length === 0 && <text x={x + 100} y="470" textAnchor="middle" fontSize="14" fill="#C7AE98" fontFamily="Mali">♡ your sweets ♡</text>}
          <rect x={x + 10} y="380" width="180" height="180" rx="6" fill="url(#yc-glass-body)" />
          <path d={`M${x + 30} 390 L${x + 90} 550`} stroke="#fff" strokeOpacity=".35" strokeWidth="16" />
          <rect x={x - 8} y="570" width="216" height="14" rx="4" fill="url(#yc-wood)" />
        </g>
      ))}
      {/* door */}
      <rect x="520" y="350" width="160" height="300" rx="10" fill="#7A4E2E" />
      <rect x="534" y="364" width="132" height="190" rx="66" fill="#FFF3DC" />
      <rect x="534" y="364" width="132" height="190" rx="66" fill="url(#yc-glass-body)" />
      <circle cx="660" cy="590" r="7" fill="url(#yc-gold)" />
      <rect x="560" y="440" width="80" height="34" rx="6" fill="#fff" />
      <text x="600" y="463" textAnchor="middle" fontFamily='"Mochiy Pop One", sans-serif' fontSize="15" fill={ex.awning}>OPEN</text>
      {th === 'winter' && <g transform="translate(600 400)"><circle r="34" fill="none" stroke="#2F6B4A" strokeWidth="14" /><circle r="34" fill="none" stroke="#3E7F58" strokeWidth="6" strokeDasharray="4 6" /><path d="M-10 26 l10 -8 10 8" fill="#E8302E" /></g>}
      {/* ground */}
      <rect y="650" width={CAFE_W} height="150" fill="url(#sidewalk)" />
      <rect y="646" width={CAFE_W} height="8" fill="#CFC2B2" />
      {/* season tree */}
      <g transform="translate(70 520)">
        <rect x="-10" y="0" width="20" height="140" fill="#7A5236" />
        {th !== 'summer' ? (
          <g>
            <circle cx="-40" cy="-30" r="60" fill={th === 'spring' ? '#F7C1D1' : th === 'autumn' ? '#E86A2E' : '#2F6B4A'} />
            <circle cx="30" cy="-50" r="64" fill={th === 'spring' ? '#F9D3DE' : th === 'autumn' ? '#F2A65A' : '#3E7F58'} />
            <circle cx="-4" cy="-100" r="52" fill={th === 'spring' ? '#FBE0E8' : th === 'autumn' ? '#E8862E' : '#FFFFFF'} />
          </g>
        ) : (
          <g>{[-40, 0, 40].map((x) => <g key={x} transform={`translate(${x} -40)`}><circle r="26" fill="#F6C945" />{Array.from({ length: 12 }).map((_, i) => <ellipse key={i} rx="8" ry="16" cy="-30" fill="#F9D84A" transform={`rotate(${i * 30})`} />)}<circle r="16" fill="#7A5236" /></g>)}</g>
        )}
      </g>
    </g>
  );
}

export function CafeScene({ layout, view, children, particles = true }: { layout: CafeLayout; view: 'interior' | 'exterior'; children?: ReactNode; particles?: boolean }) {
  return (
    <g>
      <defs>
        <linearGradient id="cafe-ceil" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#5E3A27" stopOpacity=".25" /><stop offset="1" stopColor="#5E3A27" stopOpacity="0" /></linearGradient>
        <linearGradient id="cafe-floor-shade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3B2414" stopOpacity=".28" /><stop offset=".25" stopColor="#3B2414" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity=".12" /></linearGradient>
        <radialGradient id="cafe-light" cx=".5" cy=".3" r=".7"><stop offset="0" stopColor="#FFF4D6" stopOpacity=".5" /><stop offset="1" stopColor="#FFF4D6" stopOpacity="0" /></radialGradient>
      </defs>
      {view === 'interior' ? (
        <>
          <Wall id={layout.interior.wallpaper} />
          <Floor id={layout.interior.floor} />
          <rect width={CAFE_W} height={CAFE_H} fill="url(#cafe-light)" pointerEvents="none" />
        </>
      ) : (
        <Exterior layout={layout} />
      )}
      {children}
      {particles && <SeasonParticles theme={layout.theme} count={view === 'exterior' ? 26 : 14} />}
    </g>
  );
}
