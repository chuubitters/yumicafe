import type { ReactNode } from 'react';
import { shade, rng } from '../utils/misc';
import type { AnimalFace } from '../types';

/* All food pieces are drawn centred on (0,0). */

const SEEDS: [number, number][] = [
  [-14, -14], [-4, -17], [7, -15], [16, -10], [-19, -4], [-9, -6], [2, -7], [12, -2], [20, 3],
  [-16, 6], [-6, 4], [5, 5], [14, 10], [-11, 14], [0, 15], [9, 19], [-3, 23], [-20, 12],
];

export function Strawberry({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`}>
      <path d="M0 33 C-20 26 -30 6 -27 -11 C-24 -26 -10 -29 0 -25 C10 -29 24 -26 27 -11 C30 6 20 26 0 33Z" fill="url(#yc-strawberry)" />
      {SEEDS.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <ellipse rx="2.3" ry="1.6" fill="#B30F24" opacity=".6" />
          <ellipse rx="1.3" ry="1" cy="-.3" fill="#F7DB82" />
        </g>
      ))}
      <ellipse cx="-11" cy="-10" rx="6" ry="10" fill="#fff" opacity=".28" transform="rotate(20 -11 -10)" />
      <g transform="translate(0 -24)">
        {[-70, -35, 0, 35, 70, 180].map((a, i) => (
          <path key={i} d="M0 0 C4 -3 9 -2 15 1 C9 3 4 3 0 0Z" fill="url(#yc-leaf)" transform={`rotate(${a - 90 + (i === 5 ? 0 : 0)}) scale(${i === 5 ? 0.7 : 1})`} />
        ))}
        <path d="M0 0 C1 -6 3 -10 6 -13" stroke="#5E8A2E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

export function StrawberryHalf({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`}>
      <path d="M0 33 C-20 26 -30 6 -27 -11 C-24 -26 -10 -29 0 -25 C10 -29 24 -26 27 -11 C30 6 20 26 0 33Z" fill="#C8152C" />
      <path d="M0 29 C-17 23 -25 5 -23 -9 C-21 -21 -9 -24 0 -21 C9 -24 21 -21 23 -9 C25 5 17 23 0 29Z" fill="url(#yc-straw-flesh)" />
      <path d="M0 -18 C-6 -6 -6 10 0 22 C6 10 6 -6 0 -18Z" fill="#fff" opacity=".75" />
      {[-12, -6, 6, 12].map((x, i) => (
        <path key={i} d={`M${x * 0.3} -14 Q${x} 4 ${x * 0.5} 20`} stroke="#F58C9A" strokeWidth="1.2" fill="none" opacity=".7" />
      ))}
      <path d="M-14 -22 C-8 -26 8 -26 14 -22" stroke="#7DB34A" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function Cherry({ s = 1, stem = true }: { s?: number; stem?: boolean }) {
  return (
    <g transform={`scale(${s})`}>
      {stem && <path d="M0 4 C2 -12 6 -26 14 -38" stroke="#6B8E2E" strokeWidth="3" fill="none" strokeLinecap="round" />}
      {stem && <path d="M14 -38 l2 -2" stroke="#4E3A20" strokeWidth="3" strokeLinecap="round" />}
      <circle cx="0" cy="20" r="18" fill="url(#yc-cherry)" />
      <path d="M-3 4 C-1 6 1 6 3 4" stroke="#5E0412" strokeWidth="1.6" fill="none" />
      <ellipse cx="-7" cy="12" rx="5" ry="7.5" fill="#fff" opacity=".55" transform="rotate(25 -7 12)" />
      <circle cx="7" cy="28" r="2" fill="#fff" opacity=".35" />
    </g>
  );
}

export function KiwiSlice({ s = 1 }: { s?: number }) {
  const r = rng(11);
  return (
    <g transform={`scale(${s})`}>
      <circle r="30" fill="url(#yc-kiwi)" />
      {Array.from({ length: 22 }).map((_, i) => {
        const a = (i / 22) * Math.PI * 2;
        return <line key={i} x1={Math.cos(a) * 8} y1={Math.sin(a) * 8} x2={Math.cos(a) * 24} y2={Math.sin(a) * 24} stroke="#F2F7C8" strokeWidth="1" opacity=".55" />;
      })}
      {Array.from({ length: 26 }).map((_, i) => {
        const a = (i / 26) * Math.PI * 2 + r() * 0.2;
        const d = 10.5 + r() * 3;
        return <ellipse key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} rx="1.1" ry="2.3" fill="#1D1A12" transform={`rotate(${(a * 180) / Math.PI + 90} ${Math.cos(a) * d} ${Math.sin(a) * d})`} />;
      })}
      <ellipse rx="6" ry="4" fill="#FCFBE8" />
      <circle r="29.5" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1" />
    </g>
  );
}

export function BananaSlice({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`}>
      <ellipse rx="27" ry="25" fill="#E9CF7E" />
      <ellipse rx="24.5" ry="22.5" fill="#FBF1C9" />
      <ellipse rx="10" ry="9" fill="#F4E3A4" opacity=".8" />
      {[0, 120, 240].map((a) => <ellipse key={a} rx="1.4" ry="3" fill="#7A6236" transform={`rotate(${a}) translate(0 -4)`} />)}
      <ellipse cx="-9" cy="-9" rx="7" ry="4" fill="#fff" opacity=".45" />
    </g>
  );
}

export function PeachSlice({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`}>
      <defs>
        <linearGradient id="yc-peach" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#E94B5B" />
          <stop offset="0.18" stopColor="#F7A35E" />
          <stop offset="1" stopColor="#FCE09A" />
        </linearGradient>
      </defs>
      <path d="M-32 -6 C-20 -22 20 -22 32 -6 C22 2 12 16 0 18 C-12 16 -22 2 -32 -6Z" fill="url(#yc-peach)" />
      <path d="M-26 -8 C-14 -18 14 -18 26 -8" stroke="#fff" strokeOpacity=".45" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function MangoCube({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`}>
      <path d="M-18 -8 L0 -18 L18 -8 L0 2Z" fill="#FDCB4A" />
      <path d="M-18 -8 L0 2 L0 22 L-18 12Z" fill="#F4A21E" />
      <path d="M18 -8 L0 2 L0 22 L18 12Z" fill="#E68A0E" />
      <path d="M-12 -9 L0 -15 L8 -11" stroke="#fff" strokeOpacity=".55" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function Mochi({ s = 1, color = '#FFFFFF' }: { s?: number; color?: string }) {
  return (
    <g transform={`scale(${s})`}>
      <ellipse cy="15" rx="18" ry="5" fill="#000" opacity=".12" />
      <circle r="19" fill={color === '#FFFFFF' ? 'url(#yc-sphere-white)' : color} />
      {color !== '#FFFFFF' && <circle r="19" fill="url(#yc-sphere-white)" opacity=".35" />}
      <ellipse cx="-6" cy="-8" rx="7" ry="5" fill="#fff" opacity=".8" />
      <path d="M-4 3 Q0 6 4 3" stroke="#000" strokeOpacity=".06" strokeWidth="2" fill="none" />
    </g>
  );
}

export function Dango({ s = 1 }: { s?: number }) {
  const balls = [
    { y: -26, c: '#F7B8C8' },
    { y: 0, c: '#FFFFFF' },
    { y: 26, c: '#A9C47F' },
  ];
  return (
    <g transform={`scale(${s}) rotate(-25)`}>
      <rect x="-2" y="-52" width="4" height="104" rx="2" fill="#E6C99A" />
      <rect x="-2" y="30" width="4" height="22" rx="2" fill="#D9B886" />
      {balls.map((b, i) => (
        <g key={i} transform={`translate(0 ${b.y})`}>
          <circle r="13.5" fill={b.c} />
          <circle r="13.5" fill="url(#yc-sphere-white)" opacity=".45" />
          <ellipse cx="-4.5" cy="-5" rx="4.5" ry="3" fill="#fff" opacity=".75" />
        </g>
      ))}
    </g>
  );
}

export function RedBean({ s = 1 }: { s?: number }) {
  const r = rng(5);
  return (
    <g transform={`scale(${s})`}>
      <path d="M-26 10 C-26 -6 -12 -16 0 -16 C14 -16 26 -6 26 10 C14 16 -14 16 -26 10Z" fill="#3E1414" />
      {Array.from({ length: 16 }).map((_, i) => {
        const x = -20 + r() * 40;
        const y = -10 + r() * 20 - Math.abs(x) * 0.15;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r() * 180})`}>
            <ellipse rx="6" ry="4.4" fill="#6A2222" />
            <ellipse rx="6" ry="4.4" fill="none" stroke="#2A0B0B" strokeWidth=".8" />
            <ellipse cx="-2" cy="-1.5" rx="2.2" ry="1.1" fill="#fff" opacity=".55" />
          </g>
        );
      })}
    </g>
  );
}

export function Wafer({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s}) rotate(12)`}>
      <rect x="-14" y="-38" width="28" height="76" rx="3" fill="url(#yc-wafer)" />
      <rect x="-14" y="-38" width="28" height="76" rx="3" fill="url(#yc-waffle)" />
      <rect x="-14" y="-38" width="28" height="76" rx="3" fill="none" stroke="#B87F3C" strokeWidth="1.5" />
      <rect x="-10" y="-34" width="5" height="68" rx="2" fill="#fff" opacity=".25" />
    </g>
  );
}

export function Macaron({ s = 1, color = '#F7B8C8' }: { s?: number; color?: string }) {
  return (
    <g transform={`scale(${s})`}>
      <ellipse cy="14" rx="26" ry="9" fill={shade(color, -0.12)} />
      <path d="M-25 9 Q-20 14 -15 10 Q-10 15 -5 10 Q0 15 5 10 Q10 15 15 10 Q20 14 25 9 L25 13 L-25 13Z" fill={shade(color, -0.05)} />
      <rect x="-23" y="0" width="46" height="8" rx="4" fill="#FFF8EC" />
      <path d="M-25 1 Q-20 -4 -15 0 Q-10 -5 -5 0 Q0 -5 5 0 Q10 -5 15 0 Q20 -4 25 1" fill={shade(color, -0.05)} />
      <ellipse cy="-6" rx="26" ry="12" fill={color} />
      <ellipse cx="-8" cy="-10" rx="10" ry="4" fill="#fff" opacity=".45" />
    </g>
  );
}

export function Cookie({ s = 1, chips = true }: { s?: number; chips?: boolean }) {
  const r = rng(3);
  return (
    <g transform={`scale(${s})`}>
      <circle r="27" fill="url(#yc-cookie)" filter="url(#yc-rough)" />
      {chips && Array.from({ length: 8 }).map((_, i) => {
        const a = r() * Math.PI * 2, d = 4 + r() * 16;
        return <path key={i} d="M-3 2 L0 -4 L4 1 Q0 4 -3 2Z" fill="#3B1E10" transform={`translate(${Math.cos(a) * d} ${Math.sin(a) * d}) scale(${1 + r() * 0.6})`} />;
      })}
      <path d="M-12 -6 q6 -4 10 2 M4 8 q6 2 9 -4" stroke="#A86A2C" strokeWidth="1.5" fill="none" opacity=".6" />
    </g>
  );
}

export function Pocky({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s}) rotate(25)`}>
      <rect x="-3.5" y="-50" width="7" height="100" rx="3.5" fill="#E8C287" />
      <rect x="-4.5" y="-50" width="9" height="74" rx="4.5" fill="url(#yc-choc)" />
      <rect x="-2" y="-46" width="2" height="66" rx="1" fill="#fff" opacity=".25" />
    </g>
  );
}

export function Mint({ s = 1 }: { s?: number }) {
  const leaf = (rot: number, sc = 1) => (
    <g transform={`rotate(${rot}) scale(${sc})`}>
      <path d="M0 0 C-10 -8 -10 -24 0 -32 C10 -24 10 -8 0 0Z" fill="url(#yc-leaf)" />
      <path d="M0 -2 L0 -28 M0 -10 l-5 -4 M0 -16 l5 -4 M0 -22 l-4 -3" stroke="#D7F0B8" strokeWidth="1" opacity=".7" />
    </g>
  );
  return <g transform={`scale(${s}) translate(0 12)`}>{leaf(-35, 0.85)}{leaf(35, 0.85)}{leaf(0)}</g>;
}

export function Blueberry({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`}>
      <circle r="14" fill="#3A3F78" />
      <circle r="14" fill="#9AA6D6" opacity=".35" />
      <path d="M-4 -9 l4 3 4 -3 -1 4 -3 1 -3 -1z" fill="#1E2244" />
      <ellipse cx="-5" cy="-3" rx="4" ry="3" fill="#fff" opacity=".35" />
    </g>
  );
}

export function Chestnut({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`}>
      <path d="M0 -24 C14 -16 22 0 18 12 C14 22 -14 22 -18 12 C-22 0 -14 -16 0 -24Z" fill="#7A3E17" />
      <path d="M0 -24 C14 -16 22 0 18 12 C14 22 -14 22 -18 12 C-22 0 -14 -16 0 -24Z" fill="url(#yc-shine-v)" opacity=".35" />
      <ellipse cx="-6" cy="-6" rx="4" ry="9" fill="#fff" opacity=".45" transform="rotate(20 -6 -6)" />
      <path d="M-16 10 Q0 18 16 10" stroke="#C88A55" strokeWidth="2" fill="none" />
    </g>
  );
}

export function Cheesecake({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`}>
      <path d="M-34 -6 L22 -24 L36 -10 L-20 8Z" fill="#FCF0B6" />
      <path d="M-20 8 L36 -10 L36 14 L-20 32Z" fill="#F4D877" />
      <path d="M-34 -6 L-20 8 L-20 32 L-34 18Z" fill="#E8C35A" />
      <path d="M-20 26 L36 8 L36 14 L-20 32Z" fill="#B88446" />
      <path d="M-34 12 L-20 26 L-20 32 L-34 18Z" fill="#9C6B34" />
      <path d="M-28 -6 L18 -21" stroke="#fff" strokeOpacity=".6" strokeWidth="2" />
    </g>
  );
}

export function Brownie({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`}>
      <path d="M-22 -10 L4 -20 L24 -10 L-2 0Z" fill="#5E3420" />
      <path d="M-22 -10 L-2 0 L-2 22 L-22 12Z" fill="#3A1D10" />
      <path d="M24 -10 L-2 0 L-2 22 L24 12Z" fill="#2B150B" />
      <path d="M-14 -11 l6 2 3 -4 6 2 M4 -12 l5 3" stroke="#8A5536" strokeWidth="1.4" fill="none" />
    </g>
  );
}

/* ---------------------------------------------------------- ice cream */

export function scoopPath(r: number) {
  // irregular scoop with "lip" at the bottom
  return `M${-r} ${r * 0.15}
    C${-r} ${-r * 0.75} ${-r * 0.55} ${-r * 1.02} 0 ${-r * 1.02}
    C${r * 0.55} ${-r * 1.02} ${r} ${-r * 0.75} ${r} ${r * 0.15}
    C${r * 0.92} ${r * 0.32} ${r * 0.78} ${r * 0.26} ${r * 0.7} ${r * 0.4}
    C${r * 0.55} ${r * 0.3} ${r * 0.42} ${r * 0.46} ${r * 0.28} ${r * 0.36}
    C${r * 0.12} ${r * 0.5} ${-r * 0.05} ${r * 0.34} ${-r * 0.2} ${r * 0.44}
    C${-r * 0.38} ${r * 0.3} ${-r * 0.55} ${r * 0.42} ${-r * 0.7} ${r * 0.3}
    C${-r * 0.82} ${r * 0.38} ${-r * 0.95} ${r * 0.3} ${-r} ${r * 0.15}Z`;
}

export function Scoop({ r = 50, color, color2, animal, seed = 1 }: { r?: number; color: string; color2: string; animal?: AnimalFace; seed?: number }) {
  const id = `sc-${color.replace('#', '')}`;
  const a = animal && animal.type !== 'none' ? animal : null;
  const bodyColor = a?.type === 'panda' ? '#FBFAF6' : a?.type === 'chick' ? '#FBE38A' : color;
  const bodyColor2 = a?.type === 'panda' ? '#E2DED5' : a?.type === 'chick' ? '#F1C34E' : color2;
  return (
    <g>
      <defs>
        <radialGradient id={id + (a ? a.type : '')} cx="0.38" cy="0.28" r="0.85">
          <stop offset="0" stopColor={shade(bodyColor, 0.35)} />
          <stop offset="0.55" stopColor={bodyColor} />
          <stop offset="1" stopColor={bodyColor2} />
        </radialGradient>
      </defs>
      {a && <AnimalEars type={a.type} r={r} c={bodyColor} c2={bodyColor2} />}
      <g filter="url(#yc-scoop)">
        <path d={scoopPath(r)} fill={`url(#${id + (a ? a.type : '')})`} />
      </g>
      {/* creamy ridges */}
      <path d={`M${-r * 0.7} ${-r * 0.2} q${r * 0.3} ${-r * 0.18} ${r * 0.55} ${-r * 0.05}`} stroke={shade(bodyColor2, -0.05)} strokeWidth={r * 0.05} fill="none" opacity=".35" strokeLinecap="round" />
      <path d={`M${r * 0.05} ${-r * 0.55} q${r * 0.25} ${-r * 0.1} ${r * 0.5} ${r * 0.1}`} stroke={shade(bodyColor2, -0.05)} strokeWidth={r * 0.045} fill="none" opacity=".3" strokeLinecap="round" />
      <ellipse cx={-r * 0.35} cy={-r * 0.58} rx={r * 0.22} ry={r * 0.12} fill="#fff" opacity=".55" transform={`rotate(-25 ${-r * 0.35} ${-r * 0.58})`} />
      {a && <AnimalFaceArt a={a} r={r} />}
    </g>
  );
}

function AnimalEars({ type, r, c, c2 }: { type: string; r: number; c: string; c2: string }) {
  const ear = (x: number, flip = 1): ReactNode => {
    switch (type) {
      case 'cat':
        return (
          <g transform={`translate(${x} ${-r * 0.78}) scale(${flip} 1)`}>
            <path d={`M${-r * 0.25} ${r * 0.1} L${-r * 0.05} ${-r * 0.42} L${r * 0.28} ${r * 0.02}Z`} fill={c2} strokeLinejoin="round" stroke={c2} strokeWidth={r * 0.08} />
            <path d={`M${-r * 0.13} ${r * 0.04} L${-r * 0.03} ${-r * 0.24} L${r * 0.14} ${r * 0.0}Z`} fill="#F6A9B9" />
          </g>
        );
      case 'bear':
      case 'panda':
        return (
          <g transform={`translate(${x} ${-r * 0.82})`}>
            <circle r={r * 0.25} fill={type === 'panda' ? '#2A2A2A' : c2} />
            <circle r={r * 0.13} fill={type === 'panda' ? '#444' : '#F3C6B3'} />
          </g>
        );
      case 'bunny':
        return (
          <g transform={`translate(${x} ${-r * 0.9}) rotate(${flip * 12})`}>
            <ellipse cy={-r * 0.35} rx={r * 0.17} ry={r * 0.48} fill={c} stroke={c2} strokeWidth="1.5" />
            <ellipse cy={-r * 0.33} rx={r * 0.08} ry={r * 0.34} fill="#F6A9B9" />
          </g>
        );
      case 'chick':
        return flip === 1 ? (
          <path d={`M0 ${-r * 1.0} q${-r * 0.12} ${-r * 0.22} ${r * 0.04} ${-r * 0.3} M0 ${-r * 1.0} q${r * 0.15} ${-r * 0.15} ${r * 0.2} ${-r * 0.05}`} stroke="#E9A92B" strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />
        ) : null;
      default:
        return null;
    }
  };
  return <>{ear(-r * 0.58, 1)}{ear(r * 0.58, -1)}</>;
}

function AnimalFaceArt({ a, r }: { a: AnimalFace; r: number }) {
  const ey = -r * 0.32, ex = r * 0.3, k = r / 50;
  const eye = (x: number, kind: string) => {
    switch (kind) {
      case 'happy': return <path d={`M${x - 6 * k} ${ey + 2 * k} q${6 * k} ${-8 * k} ${12 * k} 0`} stroke="#2B1A12" strokeWidth={3 * k} fill="none" strokeLinecap="round" />;
      case 'sleepy': return <path d={`M${x - 6 * k} ${ey} q${6 * k} ${6 * k} ${12 * k} 0`} stroke="#2B1A12" strokeWidth={3 * k} fill="none" strokeLinecap="round" />;
      case 'surprised': return <g><circle cx={x} cy={ey} r={6 * k} fill="#2B1A12" /><circle cx={x - 2 * k} cy={ey - 2 * k} r={2.2 * k} fill="#fff" /></g>;
      default: return <g><ellipse cx={x} cy={ey} rx={4.2 * k} ry={5.2 * k} fill="#2B1A12" /><circle cx={x - 1.5 * k} cy={ey - 2 * k} r={1.6 * k} fill="#fff" /></g>;
    }
  };
  return (
    <g>
      {a.type === 'panda' && <>
        <ellipse cx={-ex} cy={ey + 2 * k} rx={10 * k} ry={8 * k} fill="#2A2A2A" transform={`rotate(-20 ${-ex} ${ey})`} />
        <ellipse cx={ex} cy={ey + 2 * k} rx={10 * k} ry={8 * k} fill="#2A2A2A" transform={`rotate(20 ${ex} ${ey})`} />
      </>}
      {a.face === 'wink' ? <>{eye(-ex, 'dot')}<path d={`M${ex - 6 * k} ${ey} l${12 * k} 0`} stroke="#2B1A12" strokeWidth={3 * k} strokeLinecap="round" /></>
        : <>{eye(-ex, a.face)}{eye(ex, a.face)}</>}
      {a.type === 'panda' && a.face !== 'wink' && <><circle cx={-ex - 1} cy={ey - 2} r={1.6 * k} fill="#fff" /></>}
      <ellipse cx={-ex - 8 * k} cy={ey + 13 * k} rx={7 * k} ry={4 * k} fill="#F58FA7" opacity=".55" />
      <ellipse cx={ex + 8 * k} cy={ey + 13 * k} rx={7 * k} ry={4 * k} fill="#F58FA7" opacity=".55" />
      {a.type === 'chick'
        ? <path d={`M${-5 * k} ${ey + 8 * k} L0 ${ey + 15 * k} L${5 * k} ${ey + 8 * k}Z`} fill="#F29A2E" />
        : a.type === 'bear' || a.type === 'panda'
          ? <g><ellipse cy={ey + 12 * k} rx={9 * k} ry={6.5 * k} fill={a.type === 'bear' ? '#F7E1C8' : '#fff'} /><ellipse cy={ey + 9 * k} rx={3 * k} ry={2.2 * k} fill="#2B1A12" /><path d={`M${-3 * k} ${ey + 13 * k} q${3 * k} ${3 * k} ${6 * k} 0`} stroke="#2B1A12" strokeWidth={1.6 * k} fill="none" /></g>
          : <path d={`M${-5 * k} ${ey + 10 * k} q${2.5 * k} ${4 * k} ${5 * k} 0 q${2.5 * k} ${4 * k} ${5 * k} 0`} stroke="#2B1A12" strokeWidth={2 * k} fill="none" strokeLinecap="round" />}
      {a.type === 'cat' && <g stroke="#2B1A12" strokeWidth={1.2 * k} opacity=".6">
        <path d={`M${-ex - 10 * k} ${ey + 8 * k} l${-12 * k} ${-2 * k} M${-ex - 10 * k} ${ey + 12 * k} l${-12 * k} ${2 * k}`} />
        <path d={`M${ex + 10 * k} ${ey + 8 * k} l${12 * k} ${-2 * k} M${ex + 10 * k} ${ey + 12 * k} l${12 * k} ${2 * k}`} />
      </g>}
      {a.acc === 'bow' && <g transform={`translate(${r * 0.42} ${-r * 0.82}) rotate(15)`}>
        <path d={`M0 0 L${-14 * k} ${-9 * k} L${-14 * k} ${9 * k}Z M0 0 L${14 * k} ${-9 * k} L${14 * k} ${9 * k}Z`} fill="#E8607E" stroke="#C9566F" strokeWidth="1" strokeLinejoin="round" />
        <circle r={4 * k} fill="#C9566F" />
      </g>}
      {a.acc === 'flower' && <g transform={`translate(${-r * 0.45} ${-r * 0.8})`}>
        {[0, 72, 144, 216, 288].map((d) => <ellipse key={d} rx={4.5 * k} ry={7 * k} fill="#FFFFFF" stroke="#F7B8C8" strokeWidth="1" transform={`rotate(${d}) translate(0 ${-6 * k})`} />)}
        <circle r={3.5 * k} fill="#F6C945" />
      </g>}
      {a.acc === 'leaf' && <g transform={`translate(${r * 0.1} ${-r * 1.0}) rotate(-20)`}>
        <path d={`M0 0 C${-10 * k} ${-6 * k} ${-10 * k} ${-20 * k} 0 ${-26 * k} C${10 * k} ${-20 * k} ${10 * k} ${-6 * k} 0 0Z`} fill="url(#yc-leaf)" />
      </g>}
      {a.acc === 'crown' && <g transform={`translate(0 ${-r * 1.02})`}>
        <path d={`M${-14 * k} 0 L${-14 * k} ${-14 * k} L${-7 * k} ${-6 * k} L0 ${-16 * k} L${7 * k} ${-6 * k} L${14 * k} ${-14 * k} L${14 * k} 0Z`} fill="url(#yc-gold)" stroke="#A87B22" strokeWidth="1" />
      </g>}
    </g>
  );
}

/* ---------------------------------------------------------- whipped cream */

export function WhippedCream({ w = 100, color = '#FFFDF6', color2 = '#EADFC8', tiers = 3 }: { w?: number; color?: string; color2?: string; tiers?: number }) {
  const gid = `wc-${color.replace('#', '')}`;
  const tier = (y: number, width: number, i: number) => {
    const h = width * 0.32;
    const n = 7;
    let d = `M${-width / 2} ${y}`;
    for (let k = 0; k < n; k++) {
      const x0 = -width / 2 + (k * width) / n;
      const x1 = x0 + width / n;
      d += ` Q${(x0 + x1) / 2} ${y + h * 0.28} ${x1} ${y}`;
    }
    d += ` C${width / 2 + 4} ${y - h * 0.7} ${width * 0.2} ${y - h * 1.05} 0 ${y - h}`;
    d += ` C${-width * 0.2} ${y - h * 1.05} ${-width / 2 - 4} ${y - h * 0.7} ${-width / 2} ${y}Z`;
    return (
      <g key={i}>
        <path d={d} fill={`url(#${gid})`} />
        {Array.from({ length: 5 }).map((_, k) => {
          const x = -width * 0.38 + (k * width * 0.76) / 4;
          return <path key={k} d={`M${x} ${y + 2} Q${x * 0.6} ${y - h * 0.55} ${x * 0.15} ${y - h * 0.92}`} stroke={color2} strokeWidth={Math.max(1, width * 0.025)} fill="none" opacity=".55" strokeLinecap="round" />;
        })}
        <path d={`M${-width * 0.32} ${y - h * 0.45} Q${-width * 0.2} ${y - h * 0.85} 0 ${y - h * 0.92}`} stroke="#fff" strokeWidth={Math.max(1.5, width * 0.04)} fill="none" opacity=".85" strokeLinecap="round" />
      </g>
    );
  };
  const out: ReactNode[] = [];
  let y = 0;
  let width = w;
  for (let i = 0; i < tiers; i++) {
    out.push(tier(y, width, i));
    y -= width * 0.24;
    width *= 0.74;
  }
  return (
    <g>
      <defs>
        <radialGradient id={gid} cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.55" stopColor={color} />
          <stop offset="1" stopColor={color2} />
        </radialGradient>
      </defs>
      {out}
      <path d={`M0 ${y - w * 0.05} q${w * 0.06} ${-w * 0.12} ${w * 0.1} ${-w * 0.16}`} stroke={color} strokeWidth={w * 0.07} strokeLinecap="round" fill="none" />
    </g>
  );
}

/** Wavy sauce drizzle running across a width */
export function Drizzle({ w, color, seed = 1, drips = 4, thick = 5 }: { w: number; color: string; seed?: number; drips?: number; thick?: number }) {
  const r = rng(seed);
  let d = `M${-w / 2} 0`;
  const segs = 6;
  for (let i = 1; i <= segs; i++) {
    const x = -w / 2 + (i * w) / segs;
    d += ` Q${x - w / segs / 2} ${(r() - 0.5) * 18} ${x} ${(r() - 0.5) * 10}`;
  }
  const isLight = color.toUpperCase() === '#FFFBF0';
  return (
    <g opacity={isLight ? 0.92 : 1}>
      <path d={d} stroke={color} strokeWidth={thick} fill="none" strokeLinecap="round" />
      {Array.from({ length: drips }).map((_, i) => {
        const x = -w / 2 + w * (0.12 + r() * 0.76);
        const L = 10 + r() * 24;
        return (
          <g key={i}>
            <path d={`M${x} 0 L${x} ${L}`} stroke={color} strokeWidth={thick * 0.9} strokeLinecap="round" />
            <circle cx={x} cy={L + 1} r={thick * 0.75} fill={color} />
          </g>
        );
      })}
      <path d={d} stroke="#fff" strokeWidth={thick * 0.25} fill="none" opacity={isLight ? 0.2 : 0.35} transform="translate(-1 -1.5)" />
    </g>
  );
}

export function Sprinkles({ w = 60, h = 30, seed = 2, count = 22 }: { w?: number; h?: number; seed?: number; count?: number }) {
  const r = rng(seed);
  const cols = ['#F27D9B', '#7CB7DB', '#F6D35B', '#9DD17A', '#C7A6E8', '#FFFFFF'];
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const x = -w / 2 + r() * w, y = -h / 2 + r() * h;
        return <rect key={i} x={x - 3.5} y={y - 1.3} width="7" height="2.6" rx="1.3" fill={cols[i % cols.length]} transform={`rotate(${Math.round(r() * 180)} ${x} ${y})`} />;
      })}
    </g>
  );
}
