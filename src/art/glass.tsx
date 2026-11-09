import type { ReactNode } from 'react';

export const CX = 200;

export interface GlassDef {
  id: string;
  profile: [number, number][]; // [y, halfWidth] from rim to bottom of the bowl
  stem?: { to: number; footY: number; footRx: number };
  base?: number; // solid glass base down to this y
  deco?: 'handle' | 'cat' | 'bear' | 'threads' | 'petals' | 'facets' | 'heart' | 'sakura';
  tint?: string;
}

export const GLASSES: Record<string, GlassDef> = {
  // drinks
  tall: { id: 'tall', profile: [[150, 64], [300, 59], [440, 53]], base: 470 },
  round: { id: 'round', profile: [[190, 78], [232, 92], [290, 90], [340, 72], [372, 42], [384, 14]], stem: { to: 452, footY: 462, footRx: 68 } },
  heart: { id: 'heart', profile: [[184, 70], [212, 96], [252, 102], [302, 86], [352, 56], [396, 22], [408, 6]], stem: { to: 452, footY: 462, footRx: 58 }, deco: 'heart' },
  flower: { id: 'flower', profile: [[168, 94], [200, 84], [262, 74], [322, 64], [382, 50], [412, 42]], base: 466, deco: 'petals' },
  mason: { id: 'mason', profile: [[150, 68], [166, 72], [184, 80], [202, 82], [448, 82]], base: 468, deco: 'threads' },
  cat: { id: 'cat', profile: [[188, 84], [448, 74]], base: 466, deco: 'cat', tint: '#FFFFFF' },
  crystal: { id: 'crystal', profile: [[176, 88], [250, 92], [320, 72], [362, 40], [374, 16]], stem: { to: 450, footY: 462, footRx: 66 }, deco: 'facets' },
  sakura: { id: 'sakura', profile: [[178, 72], [448, 60]], base: 468, deco: 'sakura' },
  // parfaits
  parfait: { id: 'parfait', profile: [[150, 82], [205, 77], [282, 62], [352, 44], [394, 26], [404, 12]], stem: { to: 452, footY: 464, footRx: 64 } },
  'p-heart': { id: 'p-heart', profile: [[150, 78], [186, 104], [236, 110], [292, 92], [350, 58], [400, 20], [412, 6]], stem: { to: 452, footY: 464, footRx: 60 }, deco: 'heart' },
  'p-flower': { id: 'p-flower', profile: [[150, 98], [200, 90], [280, 76], [360, 58], [424, 44]], base: 462, deco: 'petals' },
  'p-round': { id: 'p-round', profile: [[150, 88], [200, 104], [282, 104], [352, 84], [400, 40], [412, 12]], stem: { to: 452, footY: 464, footRx: 64 } },
  bear: { id: 'bear', profile: [[168, 92], [450, 82]], base: 468, deco: 'bear' },
  'p-crystal': { id: 'p-crystal', profile: [[150, 92], [240, 96], [320, 74], [370, 40], [384, 14]], stem: { to: 452, footY: 464, footRx: 66 }, deco: 'facets' },
};

export const parfaitGlass = (id: string) => GLASSES[id === 'parfait' ? 'parfait' : id === 'bear' ? 'bear' : `p-${id}`] || GLASSES.parfait;

export function widthAt(g: GlassDef, y: number) {
  const p = g.profile;
  if (y <= p[0][0]) return p[0][1];
  for (let i = 0; i < p.length - 1; i++) {
    const [y0, w0] = p[i];
    const [y1, w1] = p[i + 1];
    if (y >= y0 && y <= y1) return w0 + ((w1 - w0) * (y - y0)) / (y1 - y0 || 1);
  }
  return p[p.length - 1][1];
}

export const rimY = (g: GlassDef) => g.profile[0][0];
export const bottomY = (g: GlassDef) => g.profile[g.profile.length - 1][0];

function smoothSide(points: [number, number][]) {
  // Catmull–Rom to cubic bezier through points [x,y]
  let d = '';
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** Inner bowl outline (used for clipping contents). */
export function bowlPath(g: GlassDef, inset = 0) {
  const right = g.profile.map(([y, w]) => [CX + w - inset, y] as [number, number]);
  const left = [...g.profile].reverse().map(([y, w]) => [CX - w + inset, y] as [number, number]);
  const top = g.profile[0];
  const bot = g.profile[g.profile.length - 1];
  const flat = !!g.base;
  let d = `M${CX - top[1] + inset} ${top[0]} L${CX + top[1] - inset} ${top[0]}`;
  d += smoothSide(right);
  if (flat) d += ` Q${CX + bot[1] - inset} ${bot[0] + 10} ${CX} ${bot[0] + 10} Q${CX - bot[1] + inset} ${bot[0] + 10} ${left[0][0]} ${left[0][1]}`;
  else d += ` Q${CX} ${bot[0] + 8} ${left[0][0]} ${left[0][1]}`;
  d += smoothSide(left) + 'Z';
  return d;
}

function outerPath(g: GlassDef) {
  const t = 4;
  const p = g.profile.map(([y, w]) => [y, w + t] as [number, number]);
  return bowlPath({ ...g, profile: p });
}

let clipSeq = 0;
export function useClipId(prefix: string) {
  return `${prefix}-${++clipSeq}`;
}

interface GlassProps {
  glass: GlassDef;
  clipId: string;
  contents?: ReactNode;
  behind?: ReactNode; // drawn behind the glass (e.g. straw back part)
  showShadow?: boolean;
}

export function Glass({ glass: g, clipId, contents, behind, showShadow = true }: GlassProps) {
  const top = g.profile[0];
  const bot = g.profile[g.profile.length - 1];
  const rimRx = top[1] + 4;
  const groundY = g.stem ? g.stem.footY + 8 : (g.base || bot[0]) + 6;
  const tint = g.tint;
  return (
    <g>
      {showShadow && <ellipse cx={CX} cy={groundY} rx={(g.stem ? g.stem.footRx : bot[1]) * 1.25} ry="14" fill="url(#yc-floor-shadow)" />}
      <defs>
        <clipPath id={clipId}><path d={bowlPath(g, 3)} /></clipPath>
      </defs>
      {/* stem / base */}
      {g.stem && (
        <g>
          <ellipse cx={CX} cy={g.stem.footY} rx={g.stem.footRx} ry="12" fill="url(#yc-glass-foot)" stroke="#fff" strokeOpacity=".8" strokeWidth="1.5" />
          <ellipse cx={CX} cy={g.stem.footY - 2} rx={g.stem.footRx - 12} ry="7" fill="#fff" opacity=".25" />
          <path d={`M${CX - 7} ${bot[0] + 4} C${CX - 5} ${bot[0] + 30} ${CX - 6} ${g.stem.to - 20} ${CX - 14} ${g.stem.to} L${CX + 14} ${g.stem.to} C${CX + 6} ${g.stem.to - 20} ${CX + 5} ${bot[0] + 30} ${CX + 7} ${bot[0] + 4}Z`} fill="url(#yc-glass-foot)" stroke="#fff" strokeOpacity=".7" />
          <rect x={CX - 2.5} y={bot[0] + 10} width="3" height={g.stem.to - bot[0] - 16} rx="1.5" fill="#fff" opacity=".8" />
        </g>
      )}
      {g.base && (
        <g>
          <path d={`M${CX - bot[1] - 4} ${bot[0]} L${CX - bot[1] - 4} ${g.base - 6} Q${CX - bot[1] - 4} ${g.base} ${CX - bot[1] + 6} ${g.base} L${CX + bot[1] - 6} ${g.base} Q${CX + bot[1] + 4} ${g.base} ${CX + bot[1] + 4} ${g.base - 6} L${CX + bot[1] + 4} ${bot[0]}Z`} fill="#EAF6FA" opacity=".55" />
          <ellipse cx={CX} cy={g.base - 6} rx={bot[1] - 4} ry="7" fill="#fff" opacity=".35" />
          <path d={`M${CX - bot[1] + 6} ${bot[0] + 12} h${bot[1] * 2 - 12}`} stroke="#fff" strokeOpacity=".7" strokeWidth="2" />
        </g>
      )}
      {/* back wall */}
      {g.deco === 'bear' && <BearEars g={g} />}
      {g.deco === 'cat' && <CatEars g={g} />}
      <path d={outerPath(g)} fill={tint || '#EAF5F9'} opacity={tint ? 0.25 : 0.22} />
      <ellipse cx={CX} cy={top[0]} rx={rimRx} ry="9" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="2" />
      {behind}
      {/* contents */}
      <g clipPath={`url(#${clipId})`}>
        {contents}
        <rect x={CX - 130} y={top[0] - 10} width="260" height={bot[0] - top[0] + 30} fill="url(#yc-vol)" />
      </g>
      {/* front glass body */}
      <path d={outerPath(g)} fill="url(#yc-glass-body)" />
      <path d={outerPath(g)} fill="none" stroke="#FFFFFF" strokeOpacity=".85" strokeWidth="2.5" />
      <path d={outerPath(g)} fill="none" stroke="#7FA3B3" strokeOpacity=".25" strokeWidth="1" />
      <Highlights g={g} />
      <Deco g={g} />
      {/* rim front lip */}
      <path d={`M${CX - rimRx} ${top[0]} A${rimRx} 9 0 0 0 ${CX + rimRx} ${top[0]}`} fill="none" stroke="#fff" strokeWidth="3.2" strokeOpacity=".95" />
      <path d={`M${CX - rimRx + 10} ${top[0] + 6} A${rimRx - 10} 6 0 0 0 ${CX - 10} ${top[0] + 9}`} fill="none" stroke="#fff" strokeWidth="1.5" strokeOpacity=".6" />
    </g>
  );
}

function Highlights({ g }: { g: GlassDef }) {
  const top = g.profile[0][0];
  const bot = g.profile[g.profile.length - 1][0];
  const pts = g.profile;
  // left long highlight follows the profile slightly inside the wall
  const left = pts.map(([y, w]) => [CX - w * 0.78, y + (y === top ? 18 : 0)] as [number, number]).filter(([, y]) => y < bot - 6);
  const d1 = `M${left[0][0]} ${left[0][1]}` + smoothSide(left);
  const right = pts.map(([y, w]) => [CX + w * 0.84, y + (y === top ? 24 : 0)] as [number, number]).filter(([, y]) => y < bot - 16);
  const d2 = right.length > 1 ? `M${right[0][0]} ${right[0][1]}` + smoothSide(right) : '';
  return (
    <g pointerEvents="none">
      <path d={d1} stroke="#fff" strokeWidth="9" strokeLinecap="round" fill="none" opacity=".55" />
      <path d={d1} stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".9" transform="translate(7 0)" />
      {d2 && <path d={d2} stroke="#fff" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity=".5" />}
    </g>
  );
}

function Deco({ g }: { g: GlassDef }) {
  const top = g.profile[0];
  const bot = g.profile[g.profile.length - 1];
  switch (g.deco) {
    case 'threads':
      return (
        <g>
          {[156, 168].map((y) => <path key={y} d={`M${CX - 72} ${y} Q${CX} ${y + 9} ${CX + 72} ${y}`} stroke="#fff" strokeWidth="3" fill="none" opacity=".8" />)}
          <path d={`M${CX + 84} 220 C${CX + 140} 222 ${CX + 140} 352 ${CX + 84} 356`} stroke="#E4F2F7" strokeWidth="16" fill="none" opacity=".6" />
          <path d={`M${CX + 84} 220 C${CX + 140} 222 ${CX + 140} 352 ${CX + 84} 356`} stroke="#fff" strokeWidth="4" fill="none" opacity=".9" />
          <text x={CX} y={bot[0] - 26} textAnchor="middle" fontFamily='"Mochiy Pop One", sans-serif' fontSize="12" fill="#fff" opacity=".7" letterSpacing="3">YUMI ・ CAFÉ</text>
        </g>
      );
    case 'petals':
      return (
        <g opacity=".7">
          {[-0.66, -0.33, 0, 0.33, 0.66].map((t) => (
            <path key={t} d={`M${CX + t * top[1] * 0.9} ${top[0] + 6} Q${CX + t * top[1] * 1.0} ${(top[0] + bot[0]) / 2} ${CX + t * bot[1] * 0.8} ${bot[0]}`} stroke="#fff" strokeWidth="2.5" fill="none" />
          ))}
          <path d={(() => {
            let d = `M${CX - top[1] - 4} ${top[0]}`;
            const n = 6;
            for (let i = 0; i < n; i++) {
              const x0 = CX - top[1] - 4 + ((i + 0.5) * (top[1] * 2 + 8)) / n;
              const x1 = CX - top[1] - 4 + ((i + 1) * (top[1] * 2 + 8)) / n;
              d += ` Q${x0} ${top[0] + 16} ${x1} ${top[0]}`;
            }
            return d;
          })()} stroke="#fff" strokeWidth="2.5" fill="none" />
        </g>
      );
    case 'facets':
      return (
        <g opacity=".55" stroke="#fff" strokeWidth="1.5" fill="none">
          {[-0.7, -0.35, 0, 0.35, 0.7].map((t) => <path key={t} d={`M${CX + t * top[1]} ${top[0] + 6} L${CX + t * bot[1] * 0.6} ${bot[0] - 4}`} />)}
          <path d={`M${CX - top[1]} ${top[0] + 40} Q${CX} ${top[0] + 54} ${CX + top[1]} ${top[0] + 40}`} />
        </g>
      );
    case 'heart':
      return (
        <g>
          <path d={`M${CX} ${top[0] + 70} C${CX - 30} ${top[0] + 50} ${CX - 30} ${top[0] + 22} ${CX - 12} ${top[0] + 22} C${CX - 4} ${top[0] + 22} ${CX} ${top[0] + 30} ${CX} ${top[0] + 34} C${CX} ${top[0] + 30} ${CX + 4} ${top[0] + 22} ${CX + 12} ${top[0] + 22} C${CX + 30} ${top[0] + 22} ${CX + 30} ${top[0] + 50} ${CX} ${top[0] + 70}Z`} fill="none" stroke="#fff" strokeWidth="2.5" opacity=".75" />
        </g>
      );
    case 'cat':
      return (
        <g opacity=".85">
          <g transform={`translate(${CX} ${bot[0] - 70})`}>
            <path d="M-26 -8 q6 -6 12 0 M14 -8 q6 -6 12 0" stroke="#5E4535" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M-6 4 q3 4 6 0 q3 4 6 0" stroke="#5E4535" strokeWidth="2.5" fill="none" strokeLinecap="round" transform="translate(0 0)" />
            <ellipse cx="-30" cy="6" rx="8" ry="4.5" fill="#F58FA7" opacity=".7" />
            <ellipse cx="30" cy="6" rx="8" ry="4.5" fill="#F58FA7" opacity=".7" />
          </g>
        </g>
      );
    case 'bear':
      return (
        <g opacity=".9">
          <g transform={`translate(${CX} ${bot[0] - 80})`}>
            <ellipse rx="34" ry="28" fill="#fff" opacity=".18" />
            <circle cx="-14" cy="-6" r="4" fill="#5E4535" /><circle cx="14" cy="-6" r="4" fill="#5E4535" />
            <ellipse cy="8" rx="11" ry="8" fill="#F3D9C4" opacity=".9" />
            <ellipse cy="4" rx="4" ry="3" fill="#5E4535" />
          </g>
        </g>
      );
    case 'sakura':
      return (
        <g opacity=".85">
          {[[CX - 40, 250], [CX + 30, 300], [CX - 20, 380], [CX + 44, 410], [CX - 46, 330]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${0.4 + (i % 2) * 0.15})`}>
              {[0, 72, 144, 216, 288].map((a) => <path key={a} d="M0 0 C-12 -10 -10 -26 -3 -28 L0 -24 L3 -28 C10 -26 12 -10 0 0Z" fill="#F7B8C8" transform={`rotate(${a})`} />)}
              <circle r="4" fill="#F27D9B" />
            </g>
          ))}
        </g>
      );
    default:
      return null;
  }
}

function CatEars({ g }: { g: GlassDef }) {
  const top = g.profile[0];
  return (
    <g>
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${CX + s * (top[1] - 22)} ${top[0] + 4}) scale(${s} 1)`}>
          <path d="M-20 0 L-6 -34 L14 0Z" fill="#EAF5F9" opacity=".55" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M-10 -2 L-5 -20 L5 -2Z" fill="#F7B8C8" opacity=".7" />
        </g>
      ))}
    </g>
  );
}
function BearEars({ g }: { g: GlassDef }) {
  const top = g.profile[0];
  return (
    <g>
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${CX + s * (top[1] - 14)} ${top[0] - 4})`}>
          <circle r="22" fill="#EAF5F9" opacity=".5" stroke="#fff" strokeWidth="2.5" />
          <circle r="11" fill="#F3D9C4" opacity=".6" />
        </g>
      ))}
    </g>
  );
}
