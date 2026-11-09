import type { ReactNode } from 'react';
import { shade } from '../utils/misc';

const JP = '"Zen Maru Gothic", Mali, sans-serif';
const POP = '"Mochiy Pop One", Mali, sans-serif';

export function Heart({ c = '#F27D9B' }: { c?: string }) {
  return (
    <g>
      <path d="M0 26 C-30 6 -34 -14 -20 -24 C-10 -31 -2 -24 0 -18 C2 -24 10 -31 20 -24 C34 -14 30 6 0 26Z" fill={c} />
      <path d="M0 26 C-30 6 -34 -14 -20 -24 C-10 -31 -2 -24 0 -18 C2 -24 10 -31 20 -24 C34 -14 30 6 0 26Z" fill="url(#yc-shine-v)" opacity=".25" />
      <ellipse cx="-14" cy="-14" rx="6" ry="4" fill="#fff" opacity=".7" transform="rotate(-30 -14 -14)" />
    </g>
  );
}
export function Star({ c = '#F6D35B' }: { c?: string }) {
  return (
    <g>
      <path d="M0 -28 L8 -9 L28 -8 L13 5 L18 25 L0 14 L-18 25 L-13 5 L-28 -8 L-8 -9Z" fill={c} stroke={shade(c, -0.15)} strokeWidth="2" strokeLinejoin="round" />
      <path d="M-4 -14 L0 -24 L3 -14Z" fill="#fff" opacity=".6" />
    </g>
  );
}
export const Sparkle = ({ c = '#FFE37A' }: { c?: string }) => (
  <g>
    <path d="M0 -30 C3 -6 6 -3 30 0 C6 3 3 6 0 30 C-3 6 -6 3 -30 0 C-6 -3 -3 -6 0 -30Z" fill={c} />
    <path d="M18 -22 C19 -16 20 -15 26 -14 C20 -13 19 -12 18 -6 C17 -12 16 -13 10 -14 C16 -15 17 -16 18 -22Z" fill="#fff" />
  </g>
);
export const Bow = ({ c = '#E8607E' }: { c?: string }) => (
  <g>
    <path d="M-4 0 C-20 -22 -40 -16 -36 0 C-40 16 -20 22 -4 0Z" fill={c} />
    <path d="M4 0 C20 -22 40 -16 36 0 C40 16 20 22 4 0Z" fill={c} />
    <path d="M-4 4 L-16 30 L-8 28 L-4 34 L0 6Z M4 4 L16 30 L8 28 L4 34 L0 6Z" fill={shade(c, -0.12)} />
    <path d="M-30 -6 C-24 -12 -14 -10 -8 -3" stroke="#fff" strokeOpacity=".5" strokeWidth="3" fill="none" strokeLinecap="round" />
    <rect x="-7" y="-8" width="14" height="16" rx="5" fill={shade(c, -0.15)} />
  </g>
);
export const Cloud = () => (
  <g>
    <path d="M-34 14 C-46 14 -46 -4 -32 -4 C-32 -20 -12 -24 -6 -12 C0 -26 26 -22 24 -6 C40 -8 42 14 28 14Z" fill="#fff" stroke="#C9E2EF" strokeWidth="2" />
    <circle cx="-10" cy="4" r="2" fill="#5E4535" /><circle cx="8" cy="4" r="2" fill="#5E4535" />
    <ellipse cx="-16" cy="9" rx="4" ry="2.5" fill="#F7B8C8" /><ellipse cx="14" cy="9" rx="4" ry="2.5" fill="#F7B8C8" />
  </g>
);
export const Sakura = ({ c = '#F7B8C8' }: { c?: string }) => (
  <g>
    {[0, 72, 144, 216, 288].map((a) => (
      <path key={a} d="M0 0 C-12 -10 -10 -26 -3 -28 L0 -24 L3 -28 C10 -26 12 -10 0 0Z" fill={c} stroke={shade(c, -0.1)} strokeWidth="1" transform={`rotate(${a})`} />
    ))}
    <circle r="5" fill="#F27D9B" />
    {[0, 72, 144, 216, 288].map((a) => <circle key={a} r="1.6" cy="-9" fill="#F6C945" transform={`rotate(${a + 36})`} />)}
  </g>
);
export const FlowerYellow = () => (
  <g>
    {Array.from({ length: 8 }).map((_, i) => <ellipse key={i} rx="7" ry="15" cy="-14" fill="#FFF6D5" stroke="#F1DA8E" transform={`rotate(${i * 45})`} />)}
    <circle r="10" fill="#F6C945" /><circle r="10" fill="url(#yc-shine-v)" opacity=".3" />
  </g>
);
export const Clover = () => (
  <g>
    {[0, 90, 180, 270].map((a) => <path key={a} d="M0 0 C-14 -6 -16 -22 -6 -24 C-2 -25 0 -20 0 -18 C0 -20 2 -25 6 -24 C16 -22 14 -6 0 0Z" fill="#8DC26F" transform={`rotate(${a})`} />)}
    <path d="M0 0 Q6 16 2 28" stroke="#6E9B4A" strokeWidth="3" fill="none" />
  </g>
);
export const Music = () => (
  <g fill="#5E4535">
    <ellipse cx="-12" cy="18" rx="9" ry="7" transform="rotate(-20 -12 18)" />
    <ellipse cx="16" cy="12" rx="9" ry="7" transform="rotate(-20 16 12)" />
    <path d="M-4 16 L-4 -22 L24 -28 L24 10" stroke="#5E4535" strokeWidth="4" fill="none" />
    <path d="M-4 -22 L24 -28 L24 -18 L-4 -12Z" />
  </g>
);
export const Rainbow = () => (
  <g fill="none" strokeLinecap="round">
    {['#F27D9B', '#F6B05B', '#F6D35B', '#9DD17A', '#7CB7DB', '#C7A6E8'].map((c, i) => (
      <path key={c} d={`M${-36 + i * 5} 14 A${36 - i * 5} ${36 - i * 5} 0 0 1 ${36 - i * 5} 14`} stroke={c} strokeWidth="5" />
    ))}
    <ellipse cx="-34" cy="16" rx="12" ry="7" fill="#fff" /><ellipse cx="34" cy="16" rx="12" ry="7" fill="#fff" />
  </g>
);

export function Tag({ text, bg, fg = '#fff', w = 110, h = 44, font = JP, shape = 'pill' }: { text: string; bg: string; fg?: string; w?: number; h?: number; font?: string; shape?: 'pill' | 'circle' | 'bubble' | 'price' | 'vertical' }) {
  let body: ReactNode;
  if (shape === 'circle') body = <circle r={w / 2} fill={bg} stroke="#fff" strokeWidth="3" />;
  else if (shape === 'bubble') body = <path d={`M${-w / 2} ${-h / 2} h${w} v${h} h${-w * 0.55} l-12 12 l2 -12 h${-w * 0.45 + 10}z`} fill={bg} strokeLinejoin="round" stroke={bg} strokeWidth="10" />;
  else if (shape === 'price') body = <><path d={`M${-w / 2 + 14} ${-h / 2} h${w - 14} v${h} h${-(w - 14)} l-14 ${-h / 2}z`} fill={bg} /><circle cx={-w / 2 + 12} r="4" fill="#fff" /></>;
  else if (shape === 'vertical') body = <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="6" fill={bg} />;
  else body = <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={bg} />;
  return (
    <g>
      {body}
      {shape === 'vertical'
        ? <text x="0" y={-h / 2 + w * 0.78} fill={fg} fontFamily={font} fontWeight="700" fontSize={w * 0.6} textAnchor="middle">{[...text].map((ch, i) => <tspan key={i} x={0} dy={i ? w * 0.66 : 0}>{ch}</tspan>)}</text>
        : <text x="0" y={shape === 'circle' ? 7 : 6} fill={fg} fontFamily={font} fontWeight="700" fontSize={shape === 'circle' ? w * 0.26 : h * 0.44} textAnchor="middle">{text}</text>}
    </g>
  );
}

export const Eyes = ({ kind }: { kind: 'dot' | 'happy' | 'sparkle' | 'wink' }) => {
  if (kind === 'happy') return <g stroke="#2B1A12" strokeWidth="4" fill="none" strokeLinecap="round"><path d="M-26 4 q8 -12 16 0" /><path d="M10 4 q8 -12 16 0" /></g>;
  if (kind === 'wink') return <g><ellipse cx="-18" rx="6" ry="7.5" fill="#2B1A12" /><circle cx="-20" cy="-3" r="2.3" fill="#fff" /><path d="M10 0 q8 -8 16 0" stroke="#2B1A12" strokeWidth="4" fill="none" strokeLinecap="round" /></g>;
  if (kind === 'sparkle') return <g>{[-18, 18].map((x) => <g key={x} transform={`translate(${x} 0)`}><ellipse rx="10" ry="12" fill="#2B1A12" /><circle cx="-3" cy="-4" r="4" fill="#fff" /><circle cx="4" cy="5" r="2" fill="#fff" /></g>)}</g>;
  return <g>{[-18, 18].map((x) => <g key={x}><ellipse cx={x} rx="6" ry="7.5" fill="#2B1A12" /><circle cx={x - 2} cy="-3" r="2.3" fill="#fff" /></g>)}</g>;
};
export const Mouth = ({ kind }: { kind: 'smile' | 'cat' }) =>
  kind === 'cat'
    ? <path d="M-14 -2 q7 10 14 0 q7 10 14 0" stroke="#2B1A12" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    : <path d="M-12 -4 q12 14 24 0" stroke="#2B1A12" strokeWidth="3.5" fill="#E86F7E" strokeLinecap="round" />;
export const Cheeks = () => <g><ellipse cx="-24" rx="11" ry="7" fill="#F58FA7" opacity=".7" /><ellipse cx="24" rx="11" ry="7" fill="#F58FA7" opacity=".7" /></g>;

export const Washi = ({ c }: { c: string }) => (
  <g opacity=".86">
    <path d="M-60 -14 l4 4 -4 4 4 4 -4 4 4 4 -4 4 h120 l-4 -4 4 -4 -4 -4 4 -4 -4 -4 4 -4z" fill={c} />
    {[-44, -24, -4, 16, 36].map((x) => <circle key={x} cx={x} cy="0" r="3.4" fill="#fff" opacity=".7" />)}
  </g>
);
export const Pearls = () => (
  <g>
    {[[-14, -6, 7], [2, -10, 6], [14, 2, 7], [-4, 8, 5], [-18, 10, 4], [10, 14, 4]].map(([x, y, r], i) => (
      <g key={i}><circle cx={x} cy={y} r={r} fill="url(#yc-sphere-white)" /><circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.3} fill="#fff" /></g>
    ))}
  </g>
);
export const RibbonLong = ({ c = '#E8607E' }: { c?: string }) => (
  <path d="M-70 -6 C-40 -20 -20 10 0 -4 C20 -18 40 12 70 -4 L70 6 C40 22 20 -8 0 6 C-20 20 -40 -10 -70 6Z" fill={c} />
);
export const Candle = () => (
  <g>
    <rect x="-6" y="-14" width="12" height="44" rx="3" fill="#F7B8C8" />
    {[-6, 4, 14, 24].map((y) => <path key={y} d={`M-6 ${y} l12 -6`} stroke="#fff" strokeWidth="3" />)}
    <path d="M0 -16 v-6" stroke="#5E4535" strokeWidth="1.5" />
    <path d="M0 -38 C6 -30 6 -24 0 -22 C-6 -24 -6 -30 0 -38Z" fill="#FBBF3C" />
    <path d="M0 -33 C3 -29 3 -26 0 -25 C-3 -26 -3 -29 0 -33Z" fill="#FFF3C2" />
  </g>
);
export const MapleLeaf = ({ c = '#E8662E' }: { c?: string }) => (
  <g>
    <path d="M0 30 L0 10 L-22 14 L-16 4 L-32 -6 L-22 -8 L-26 -24 L-12 -16 L-8 -30 L0 -20 L8 -30 L12 -16 L26 -24 L22 -8 L32 -6 L16 4 L22 14 L0 10" fill={c} stroke={shade(c, -0.15)} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M0 10 L0 -20 M0 0 L-18 -12 M0 0 L18 -12" stroke={shade(c, -0.25)} strokeWidth="1.2" fill="none" />
  </g>
);
export const Snowflake = () => (
  <g stroke="#8CC4E3" strokeWidth="3.5" strokeLinecap="round" fill="none">
    {[0, 60, 120].map((a) => <path key={a} d="M0 -28 V28 M-8 -20 L0 -12 L8 -20 M-8 20 L0 12 L8 20" transform={`rotate(${a})`} />)}
  </g>
);
export const Nerikiri = () => (
  <g>
    <ellipse cy="14" rx="30" ry="8" fill="#000" opacity=".1" />
    {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} rx="16" ry="20" cy="-8" fill="#F9C9D5" stroke="#F3A9BC" transform={`rotate(${a})`} />)}
    <circle r="16" fill="#FBD8E1" />
    {[0, 72, 144, 216, 288].map((a) => <path key={a} d="M0 0 L0 -22" stroke="#F3A9BC" strokeWidth="1.5" transform={`rotate(${a + 36})`} />)}
    <circle r="4" fill="#F6C945" />
  </g>
);
export const Taiyaki = () => (
  <g>
    <path d="M-40 0 C-30 -22 10 -24 26 -8 L42 -20 L38 0 L42 20 L26 8 C10 24 -30 22 -40 0Z" fill="#D7913E" />
    <path d="M-40 0 C-30 -22 10 -24 26 -8 L42 -20 L38 0 L42 20 L26 8 C10 24 -30 22 -40 0Z" fill="url(#yc-shine-v)" opacity=".25" />
    <circle cx="-26" cy="-4" r="3" fill="#5E3A1A" />
    {[-10, 0, 10].map((x) => <path key={x} d={`M${x} -10 q6 10 0 20`} stroke="#A9672A" strokeWidth="2" fill="none" />)}
  </g>
);
export const Dorayaki = () => (
  <g>
    <ellipse cy="8" rx="34" ry="12" fill="#A85F24" />
    <rect x="-32" y="-2" width="64" height="8" fill="#5B2222" />
    <ellipse cy="-6" rx="34" ry="14" fill="#C47A34" />
    <ellipse cy="-8" rx="26" ry="9" fill="#D99550" />
    <ellipse cx="-10" cy="-12" rx="8" ry="3" fill="#fff" opacity=".3" />
  </g>
);
export const SakuraMochi = () => (
  <g>
    <ellipse cy="4" rx="30" ry="20" fill="#F7BFD0" />
    <ellipse cx="-8" cy="-4" rx="10" ry="6" fill="#fff" opacity=".4" />
    <path d="M-34 10 C-20 -24 22 -24 36 8 C14 22 -16 24 -34 10Z" fill="#7E9A4B" opacity=".9" transform="translate(0 6) scale(1 .55)" />
    <path d="M-30 12 Q0 2 30 10" stroke="#C8D69C" strokeWidth="1.5" fill="none" />
  </g>
);
export const Daifuku = () => (
  <g>
    <ellipse cy="10" rx="28" ry="18" fill="url(#yc-sphere-white)" />
    <path d="M-10 -8 C-8 -22 8 -22 10 -8 C6 -2 -6 -2 -10 -8Z" fill="url(#yc-strawberry)" />
    <path d="M-16 -2 C-10 -10 10 -10 16 -2 C10 4 -10 4 -16 -2Z" fill="#fff" />
    <path d="M-6 -18 l6 -4 6 4" stroke="#6B8E2E" strokeWidth="3" fill="none" strokeLinecap="round" />
  </g>
);
export const CoffeeCup = () => (
  <g>
    <ellipse cy="26" rx="34" ry="8" fill="url(#yc-ceramic)" stroke="#D8CEC0" />
    <path d="M-24 -10 h48 l-4 30 c-2 8 -38 8 -40 0z" fill="url(#yc-ceramic)" stroke="#D8CEC0" />
    <path d="M24 -2 c14 0 14 18 -2 18" stroke="#E6DED2" strokeWidth="5" fill="none" />
    <ellipse cy="-10" rx="24" ry="6" fill="#4A2A18" />
    <path d="M-6 -11 q6 -4 12 0 q-6 4 -12 0" fill="#E9D3B4" />
    <path d="M-8 -20 q4 -8 0 -14 M6 -20 q4 -8 0 -14" stroke="#fff" strokeWidth="3" opacity=".6" fill="none" strokeLinecap="round" />
  </g>
);
export const CreamSodaIcon = () => (
  <g>
    <path d="M-18 -10 h36 l-6 40 h-24z" fill="#4CC85A" opacity=".85" />
    <path d="M-18 -10 h36 l-6 40 h-24z" fill="url(#yc-glass-body)" />
    <circle cy="-16" r="14" fill="#FFF8E6" />
    <circle cx="6" cy="-30" r="6" fill="url(#yc-cherry)" />
    <rect x="8" y="-46" width="4" height="40" rx="2" fill="#F28BA8" transform="rotate(14)" />
  </g>
);
export const Record = () => (
  <g>
    <circle r="32" fill="#1E1E1E" />
    {[26, 20, 14].map((r) => <circle key={r} r={r} fill="none" stroke="#3A3A3A" />)}
    <circle r="10" fill="#F7B8C8" /><circle r="2" fill="#1E1E1E" />
    <path d="M-20 -20 A28 28 0 0 1 10 -26" stroke="#fff" strokeOpacity=".25" strokeWidth="4" fill="none" />
  </g>
);

export const STICKER_FONTS = { JP, POP };
