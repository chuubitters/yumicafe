import { shade } from '../utils/misc';

/* Café furniture, drawn front-on with soft shading. All centred on (0,0). */

export function Counter({ c = '#F7B8C8', w = 520 }: { c?: string; w?: number }) {
  const h = 200;
  return (
    <g>
      <ellipse cy={h / 2 + 4} rx={w / 2} ry="12" fill="url(#yc-floor-shadow)" />
      <rect x={-w / 2} y={-h / 2 + 22} width={w} height={h - 22} rx="6" fill={c} />
      {Array.from({ length: Math.floor(w / 26) }).map((_, i) => (
        <rect key={i} x={-w / 2 + 8 + i * 26} y={-h / 2 + 34} width="18" height={h - 46} rx="9" fill={shade(c, -0.08)} />
      ))}
      <rect x={-w / 2} y={-h / 2 + 22} width={w} height={h - 22} rx="6" fill="url(#yc-vol)" opacity=".5" />
      <rect x={-w / 2 - 14} y={-h / 2} width={w + 28} height="26" rx="6" fill="url(#yc-wood)" />
      <rect x={-w / 2 - 14} y={-h / 2} width={w + 28} height="6" rx="3" fill="#fff" opacity=".35" />
      <rect x={-w / 2} y={h / 2 - 12} width={w} height="12" fill={shade(c, -0.22)} />
    </g>
  );
}

export function Espresso({ c = '#E8607E' }: { c?: string }) {
  return (
    <g>
      <rect x="-60" y="-50" width="120" height="96" rx="12" fill={c} />
      <rect x="-60" y="-50" width="120" height="96" rx="12" fill="url(#yc-vol)" opacity=".6" />
      <rect x="-66" y="-62" width="132" height="16" rx="6" fill="url(#yc-metal)" />
      <rect x="-40" y="-36" width="80" height="22" rx="6" fill="#FFF8ED" />
      <circle cx="-20" cy="-25" r="7" fill="url(#yc-metal)" /><circle cx="20" cy="-25" r="7" fill="url(#yc-metal)" />
      <rect x="-30" y="-6" width="60" height="12" rx="4" fill="url(#yc-metal)" />
      <rect x="-6" y="6" width="12" height="10" fill="#666" />
      <path d="M-16 22 h32 l-3 18 h-26z" fill="url(#yc-ceramic)" stroke="#CFC4B4" />
      <rect x="-60" y="40" width="120" height="10" rx="3" fill="url(#yc-metal)" />
      <path d="M48 -6 l18 40" stroke="url(#yc-metal)" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

export function Register({ c = '#B9CBA5' }: { c?: string }) {
  return (
    <g>
      <path d="M-50 10 L-40 -30 H40 L50 10Z" fill={c} />
      <rect x="-54" y="8" width="108" height="36" rx="6" fill={shade(c, -0.1)} />
      <rect x="-30" y="-52" width="60" height="24" rx="4" fill="#3A3A3A" />
      <text x="0" y="-35" fill="#9FF29A" fontSize="13" fontFamily="monospace" textAnchor="middle">¥ 480</text>
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={-36 + (i % 6) * 12} y={-22 + Math.floor(i / 6) * 12} width="9" height="8" rx="2" fill="#FFF8ED" />
      ))}
      <rect x="-20" y="18" width="40" height="6" rx="3" fill="url(#yc-gold)" />
    </g>
  );
}

export function Grinder() {
  return (
    <g>
      <path d="M-22 -50 h44 l-8 28 h-28z" fill="#F4E9DA" opacity=".9" stroke="#D8CEC0" />
      <path d="M-18 -44 h36 l-6 18 h-24z" fill="#5A341C" />
      <rect x="-24" y="-22" width="48" height="60" rx="8" fill="url(#yc-wood)" />
      <rect x="-18" y="8" width="36" height="18" rx="3" fill="#7A4E2C" />
      <rect x="-4" y="14" width="8" height="4" rx="2" fill="url(#yc-gold)" />
      <path d="M0 -50 v-10 h24" stroke="url(#yc-metal)" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="26" cy="-60" r="6" fill="#5A341C" />
    </g>
  );
}

export function LuckyCat() {
  return (
    <g>
      <ellipse cy="46" rx="40" ry="6" fill="url(#yc-floor-shadow)" />
      <ellipse cy="18" rx="34" ry="30" fill="#FFFDF8" stroke="#E6DED2" />
      <circle cy="-20" r="30" fill="#FFFDF8" stroke="#E6DED2" />
      <path d="M-26 -36 L-22 -58 L-6 -46Z M26 -36 L22 -58 L6 -46Z" fill="#FFFDF8" stroke="#E6DED2" />
      <path d="M-22 -40 L-20 -52 L-11 -45Z M22 -40 L20 -52 L11 -45Z" fill="#F7B8C8" />
      <path d="M-14 -22 q5 -6 10 0 M4 -22 q5 -6 10 0" stroke="#2B1A12" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M-5 -10 q5 5 10 0" stroke="#2B1A12" strokeWidth="2" fill="none" />
      <ellipse cx="-18" cy="-12" rx="5" ry="3" fill="#F7B8C8" /><ellipse cx="18" cy="-12" rx="5" ry="3" fill="#F7B8C8" />
      <rect x="-26" y="-2" width="52" height="8" rx="4" fill="#E8302E" />
      <circle cy="10" r="7" fill="url(#yc-gold)" />
      <g className="anim-wiggle"><ellipse cx="34" cy="-30" rx="10" ry="18" fill="#FFFDF8" stroke="#E6DED2" /></g>
      <ellipse cy="30" rx="18" ry="12" fill="url(#yc-gold)" />
      <text y="34" fontSize="11" textAnchor="middle" fill="#7A5A10" fontWeight="700">千万両</text>
    </g>
  );
}

export function CakeDome() {
  return (
    <g>
      <ellipse cy="50" rx="56" ry="9" fill="url(#yc-ceramic)" stroke="#D8CEC0" />
      <rect x="-6" y="30" width="12" height="20" fill="url(#yc-ceramic)" />
      <ellipse cy="30" rx="60" ry="8" fill="url(#yc-ceramic)" stroke="#D8CEC0" />
      <path d="M-40 28 v-26 h80 v26z" fill="#FBE3EA" />
      <path d="M-40 2 h80" stroke="#fff" strokeWidth="6" />
      {[-28, -10, 8, 26].map((x) => <g key={x} transform={`translate(${x} -6) scale(.3)`}><circle r="18" fill="url(#yc-strawberry)" /></g>)}
      <path d="M-56 28 C-56 -50 56 -50 56 28" fill="#E3F2F8" opacity=".35" stroke="#fff" strokeWidth="2" />
      <path d="M-40 10 C-40 -30 -10 -40 0 -40" stroke="#fff" strokeWidth="5" opacity=".6" fill="none" strokeLinecap="round" />
      <circle cy="-46" r="6" fill="url(#yc-metal)" />
    </g>
  );
}

export function Showcase({ c = '#FFFFFF' }: { c?: string }) {
  return (
    <g>
      <ellipse cy="112" rx="150" ry="10" fill="url(#yc-floor-shadow)" />
      <rect x="-140" y="40" width="280" height="70" rx="8" fill={c === '#FFFFFF' ? '#F5D0BE' : c} />
      <rect x="-140" y="40" width="280" height="70" rx="8" fill="url(#yc-vol)" opacity=".4" />
      <rect x="-140" y="-100" width="280" height="140" rx="10" fill="#E8F4F8" opacity=".35" stroke="#fff" strokeWidth="4" />
      <rect x="-132" y="-32" width="264" height="6" fill="#fff" opacity=".8" />
      <rect x="-132" y="34" width="264" height="6" fill="#fff" opacity=".8" />
      <path d="M-120 -90 L-80 30" stroke="#fff" strokeWidth="10" opacity=".35" />
      <path d="M-96 -90 L-66 -10" stroke="#fff" strokeWidth="4" opacity=".4" />
      <rect x="-140" y="-108" width="280" height="12" rx="6" fill={shade(c === '#FFFFFF' ? '#F5D0BE' : c, -0.15)} />
      <text y="82" textAnchor="middle" fontFamily='"Zen Maru Gothic", sans-serif' fontWeight="700" fontSize="18" fill="#fff">ケーキ ・ CAKES</text>
    </g>
  );
}

export function CookieJar() {
  return (
    <g>
      <ellipse cy="56" rx="44" ry="7" fill="url(#yc-floor-shadow)" />
      <path d="M-40 -30 C-46 0 -46 40 -36 52 H36 C46 40 46 0 40 -30Z" fill="#EAF6FA" opacity=".55" stroke="#fff" strokeWidth="3" />
      {[[-20, 30], [6, 34], [26, 26], [-10, 8], [16, 6], [-24, -10], [2, -14]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(.55)`}><circle r="22" fill="url(#yc-cookie)" /><circle cx="-6" cy="-4" r="3" fill="#3B1E10" /><circle cx="6" cy="4" r="3" fill="#3B1E10" /></g>
      ))}
      <path d="M-40 -30 C-46 0 -46 40 -36 52 H36 C46 40 46 0 40 -30Z" fill="url(#yc-glass-body)" />
      <rect x="-42" y="-44" width="84" height="16" rx="6" fill="url(#yc-wood)" />
      <circle cy="-52" r="9" fill="url(#yc-wood)" />
      <path d="M-30 -20 C-34 6 -32 30 -28 44" stroke="#fff" strokeWidth="5" opacity=".6" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function TieredStand() {
  return (
    <g>
      <rect x="-3" y="-70" width="6" height="130" fill="url(#yc-gold)" />
      <circle cy="-74" r="7" fill="url(#yc-gold)" />
      {[[-40, 46], [0, 34], [40, 22]].map(([y, r], i) => (
        <g key={i} transform={`translate(0 ${y + 10})`}>
          <ellipse rx={r + 4} ry="8" fill="url(#yc-ceramic)" stroke="#E0D6C8" />
          {Array.from({ length: 3 }).map((_, k) => (
            <g key={k} transform={`translate(${(k - 1) * r * 0.55} -8) scale(.32)`}>
              <ellipse cy="14" rx="26" ry="9" fill={['#F7B8C8', '#B9CBA5', '#F6E5A9'][(k + i) % 3]} />
              <ellipse cy="-6" rx="26" ry="12" fill={['#F7B8C8', '#B9CBA5', '#F6E5A9'][(k + i) % 3]} />
              <rect x="-23" y="0" width="46" height="8" fill="#FFF8EC" />
            </g>
          ))}
        </g>
      ))}
      <ellipse cy="64" rx="30" ry="6" fill="url(#yc-gold)" />
    </g>
  );
}

export function Plate({ c = '#FFFFFF' }: { c?: string }) {
  return (
    <g>
      <ellipse cy="6" rx="60" ry="18" fill="#000" opacity=".1" />
      <ellipse rx="60" ry="18" fill="url(#yc-ceramic)" stroke="#E0D6C8" />
      <ellipse rx="42" ry="11" fill={c} opacity=".45" />
      <ellipse rx="60" ry="18" fill="none" stroke={c === '#FFFFFF' ? '#F7B8C8' : c} strokeWidth="2.5" strokeDasharray="4 5" />
    </g>
  );
}

export function WallShelf({ c = '#FFFFFF' }: { c?: string }) {
  return (
    <g>
      <rect x="-120" y="0" width="240" height="14" rx="3" fill="url(#yc-wood)" />
      <path d="M-100 14 v20 l16 -20z M100 14 v20 l-16 -20z" fill="#8E5E36" />
      <g transform="translate(-80 -26) scale(.6)"><path d="M-22 -10 h44 l-4 40 h-36z" fill={c === '#FFFFFF' ? '#9FCBDF' : c} /><rect x="-22" y="-14" width="44" height="8" rx="3" fill="#fff" /></g>
      <g transform="translate(-30 -22) scale(.55)"><path d="M-22 -16 h44 v46 h-44z" fill="#E6D3B3" /><circle r="10" cy="6" fill="#B9CBA5" /></g>
      <g transform="translate(30 -22)"><path d="M-14 22 C-18 6 -12 -10 0 -14 C12 -10 18 6 14 22Z" fill="#B9CBA5" /><path d="M-6 -10 C-14 -24 -4 -34 0 -38 C4 -34 14 -24 6 -10" fill="url(#yc-leaf)" /></g>
      <g transform="translate(84 -20)"><rect x="-16" y="-20" width="12" height="40" rx="2" fill="#F7B8C8" /><rect x="-3" y="-16" width="10" height="36" rx="2" fill="#C9E2EF" /><rect x="8" y="-22" width="11" height="42" rx="2" fill="#F6E5A9" transform="rotate(8 8 20)" /></g>
    </g>
  );
}

export function CafeTable({ c = '#FFFFFF' }: { c?: string }) {
  return (
    <g>
      <ellipse cy="92" rx="70" ry="10" fill="url(#yc-floor-shadow)" />
      <rect x="-5" y="-2" width="10" height="86" fill="url(#yc-metal)" />
      <path d="M-40 90 Q0 76 40 90" stroke="url(#yc-metal)" strokeWidth="8" fill="none" strokeLinecap="round" />
      <ellipse cy="-6" rx="86" ry="20" fill={shade(c === '#FFFFFF' ? '#F2EAE0' : c, -0.12)} />
      <ellipse cy="-12" rx="86" ry="20" fill={c === '#FFFFFF' ? '#FBF7F2' : c} />
      <ellipse cy="-12" rx="86" ry="20" fill="url(#yc-vol)" opacity=".25" />
      <ellipse cx="-30" cy="-18" rx="30" ry="5" fill="#fff" opacity=".45" />
    </g>
  );
}

export function Chair({ c = '#92745F' }: { c?: string }) {
  return (
    <g>
      <ellipse cy="98" rx="46" ry="8" fill="url(#yc-floor-shadow)" />
      <path d="M-30 -90 C-36 -40 -34 0 -30 20 M30 -90 C36 -40 34 0 30 20" stroke={c} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M-30 -86 C-10 -100 10 -100 30 -86" stroke={c} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M-22 -60 C-8 -66 8 -66 22 -60 M-24 -36 C-8 -40 8 -40 24 -36" stroke={c} strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cy="22" rx="42" ry="11" fill="#F7B8C8" />
      <ellipse cy="18" rx="42" ry="11" fill="#FBD3DE" />
      <path d="M-34 28 L-38 96 M34 28 L38 96 M-18 32 L-20 92 M18 32 L20 92" stroke={c} strokeWidth="7" strokeLinecap="round" />
      <path d="M-34 70 Q0 82 34 70" stroke={c} strokeWidth="4" fill="none" />
    </g>
  );
}

export function Sofa({ c = '#B9CBA5' }: { c?: string }) {
  return (
    <g>
      <ellipse cy="74" rx="150" ry="12" fill="url(#yc-floor-shadow)" />
      <rect x="-130" y="-70" width="260" height="90" rx="40" fill={shade(c, -0.08)} />
      {[-86, -28, 30, 88].map((x) => <circle key={x} cx={x} cy="-40" r="3" fill={shade(c, -0.25)} />)}
      <rect x="-118" y="-4" width="236" height="50" rx="20" fill={c} />
      <rect x="-150" y="-30" width="44" height="90" rx="22" fill={c} />
      <rect x="106" y="-30" width="44" height="90" rx="22" fill={c} />
      <rect x="-150" y="-30" width="300" height="90" rx="22" fill="url(#yc-vol)" opacity=".3" />
      <path d="M-130 66 l-4 12 M130 66 l4 12" stroke="#5E3A27" strokeWidth="6" strokeLinecap="round" />
      <path d="M-100 0 h200" stroke="#fff" strokeOpacity=".35" strokeWidth="4" />
    </g>
  );
}

export function Cushion({ c = '#F7B8C8' }: { c?: string }) {
  return (
    <g>
      <path d="M-40 -34 Q0 -44 40 -34 Q50 0 40 34 Q0 44 -40 34 Q-50 0 -40 -34Z" fill={c} />
      <path d="M-40 -34 Q0 -44 40 -34 Q50 0 40 34 Q0 44 -40 34 Q-50 0 -40 -34Z" fill="url(#yc-vol)" opacity=".4" />
      <circle r="5" fill={shade(c, -0.2)} />
      <path d="M-30 -24 Q0 -32 30 -24" stroke="#fff" strokeOpacity=".5" strokeWidth="3" fill="none" />
      <g transform="scale(.35)" opacity=".8"><path d="M0 26 C-30 6 -34 -14 -20 -24 C-10 -31 -2 -24 0 -18 C2 -24 10 -31 20 -24 C34 -14 30 6 0 26Z" fill="#fff" /></g>
    </g>
  );
}

export function Plant({ c = '#F5D0BE' }: { c?: string }) {
  return (
    <g>
      <ellipse cy="96" rx="50" ry="8" fill="url(#yc-floor-shadow)" />
      {[[-40, -40, -30], [30, -60, 25], [0, -86, 0], [-56, -10, -55], [52, -16, 50], [-14, -60, -15]].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path d="M0 50 C-30 30 -34 -10 0 -30 C34 -10 30 30 0 50Z" fill="url(#yc-leaf)" />
          <path d="M0 48 V-26" stroke="#CFE8B0" strokeWidth="2" opacity=".6" />
          <path d="M-14 4 l8 4 M14 0 l-8 4 M-12 24 l8 4 M12 20 l-8 4" stroke="#2E5A18" strokeWidth="3" opacity=".5" />
        </g>
      ))}
      <path d="M-40 30 L40 30 L32 94 L-32 94Z" fill={c} />
      <path d="M-40 30 L40 30 L32 94 L-32 94Z" fill="url(#yc-vol)" opacity=".5" />
      <rect x="-44" y="24" width="88" height="12" rx="4" fill={shade(c, -0.1)} />
    </g>
  );
}

export function FloorLamp({ c = '#F6E5A9' }: { c?: string }) {
  return (
    <g>
      <ellipse cy="118" rx="30" ry="6" fill="url(#yc-floor-shadow)" />
      <circle cy="-70" r="60" fill="#FFE9A8" opacity=".25" filter="url(#yc-blur10)" />
      <rect x="-3" y="-60" width="6" height="176" fill="url(#yc-gold)" />
      <ellipse cy="116" rx="24" ry="5" fill="url(#yc-gold)" />
      <path d="M-30 -60 L-20 -110 H20 L30 -60Z" fill={c} />
      <path d="M-30 -60 L-20 -110 H20 L30 -60Z" fill="url(#yc-vol)" opacity=".3" />
      <path d="M-30 -60 Q0 -54 30 -60" stroke={shade(c, -0.2)} strokeWidth="3" fill="none" />
    </g>
  );
}

export function Jukebox() {
  return (
    <g>
      <ellipse cy="100" rx="70" ry="8" fill="url(#yc-floor-shadow)" />
      <path d="M-60 96 V-30 C-60 -100 60 -100 60 -30 V96Z" fill="#8A4B2A" />
      <path d="M-48 -30 C-48 -84 48 -84 48 -30Z" fill="#F7D774" opacity=".9" />
      {[-30, -10, 10, 30].map((x) => <rect key={x} x={x - 4} y="-66" width="8" height="36" rx="4" fill={['#F27D9B', '#7CB7DB', '#9DD17A', '#F6B05B'][(x + 30) / 20]} />)}
      <rect x="-44" y="-20" width="88" height="40" rx="6" fill="#FFF8ED" />
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-38 + (i % 4) * 20} y={-14 + Math.floor(i / 4) * 16} width="16" height="10" rx="2" fill="#F7B8C8" />)}
      <rect x="-44" y="30" width="88" height="56" rx="6" fill="url(#yc-metal)" />
      {[38, 48, 58, 68, 78].map((y) => <path key={y} d={`M-36 ${y} h72`} stroke="#8E979C" />)}
    </g>
  );
}

export function FishBowl() {
  return (
    <g>
      <ellipse cy="50" rx="44" ry="7" fill="url(#yc-floor-shadow)" />
      <path d="M-30 -40 C-56 -20 -56 34 -20 48 H20 C56 34 56 -20 30 -40Z" fill="#CDEBF5" opacity=".55" stroke="#fff" strokeWidth="3" />
      <path d="M-46 -6 C-46 30 -24 46 0 46 C24 46 46 30 46 -6Z" fill="#7CC3E3" opacity=".55" />
      <g className="anim-float"><path d="M-6 10 C4 0 18 2 22 10 C18 18 4 20 -6 10 L-16 2 L-14 10 L-16 18Z" fill="#F0602E" /><circle cx="14" cy="8" r="1.6" fill="#000" /></g>
      <path d="M-10 46 C-14 30 -6 20 -12 8 M6 46 C10 34 2 26 8 14" stroke="#5E9B3A" strokeWidth="3" fill="none" />
      <ellipse cy="-40" rx="32" ry="5" fill="#fff" opacity=".7" />
      <path d="M-34 -16 C-40 4 -34 24 -24 34" stroke="#fff" strokeWidth="4" opacity=".7" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function Pendant({ c = '#F6E5A9' }: { c?: string }) {
  return (
    <g>
      <circle cy="30" r="60" fill="#FFE9A8" opacity=".35" filter="url(#yc-blur10)" />
      <path d="M0 -120 V-20" stroke="#5E4535" strokeWidth="2" />
      <path d="M-40 20 C-40 -20 40 -20 40 20Z" fill={c} />
      <path d="M-40 20 C-40 -20 40 -20 40 20Z" fill="url(#yc-vol)" opacity=".35" />
      <rect x="-6" y="-26" width="12" height="10" fill="url(#yc-gold)" />
      <ellipse cy="22" rx="14" ry="8" fill="#FFF6C9" />
    </g>
  );
}

export function WindowArt({ season = 'spring' }: { season?: string }) {
  const sky = season === 'winter' ? ['#BFD7EA', '#EEF5FA'] : season === 'autumn' ? ['#F7C99A', '#FCEBD3'] : season === 'summer' ? ['#7EC8EC', '#D9F0FA'] : ['#BDE3F5', '#F3FAFD'];
  const gid = `win-${season}`;
  return (
    <g>
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} /></linearGradient>
        <clipPath id={`clip-${gid}`}><rect x="-110" y="-120" width="220" height="240" rx="100" ry="100" /></clipPath>
      </defs>
      <g clipPath={`url(#clip-${gid})`}>
        <rect x="-110" y="-120" width="220" height="240" fill={`url(#${gid})`} />
        {season === 'summer' && <><circle cx="50" cy="-60" r="22" fill="#FFE27A" /><rect x="-110" y="40" width="220" height="80" fill="#5FB3DA" /><path d="M-110 40 h220" stroke="#fff" strokeWidth="3" /></>}
        <path d="M-110 120 C-60 40 -20 70 10 50 C40 30 80 60 110 40 V120Z" fill={season === 'winter' ? '#FFFFFF' : season === 'autumn' ? '#D98B4A' : '#9CCB7A'} />
        <g transform="translate(-50 30)">
          <rect x="-5" y="0" width="10" height="70" fill="#7A5236" />
          <circle cx="-26" cy="-14" r="30" fill={season === 'spring' ? '#F7C1D1' : season === 'autumn' ? '#E86A2E' : season === 'winter' ? '#2F6B4A' : '#6FAE4A'} />
          <circle cx="16" cy="-20" r="34" fill={season === 'spring' ? '#F9D3DE' : season === 'autumn' ? '#F2A65A' : season === 'winter' ? '#3E7F58' : '#86C25E'} />
          <circle cx="-4" cy="-46" r="28" fill={season === 'spring' ? '#FBE0E8' : season === 'autumn' ? '#E8862E' : season === 'winter' ? '#FFFFFF' : '#9CD36E'} />
        </g>
        {season === 'winter' && Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={-100 + ((i * 37) % 200)} cy={-110 + ((i * 53) % 200)} r="2.5" fill="#fff" />)}
      </g>
      <rect x="-110" y="-120" width="220" height="240" rx="100" ry="100" fill="url(#yc-glass-body)" />
      <rect x="-110" y="-120" width="220" height="240" rx="100" ry="100" fill="none" stroke="#FFFDF8" strokeWidth="14" />
      <path d="M0 -120 V120 M-110 10 H110" stroke="#FFFDF8" strokeWidth="9" />
      <rect x="-124" y="118" width="248" height="16" rx="5" fill="url(#yc-wood)" />
    </g>
  );
}

export function Curtains({ c = '#F7B8C8' }: { c?: string }) {
  const side = (s: number) => (
    <g transform={`scale(${s} 1)`}>
      <path d="M-160 -150 H-90 C-92 -60 -70 30 -110 150 H-160Z" fill={c} />
      {[-148, -132, -116, -102].map((x) => <path key={x} d={`M${x} -150 C${x + 2} -40 ${x + 6} 40 ${x - 4} 150`} stroke={shade(c, -0.12)} strokeWidth="5" fill="none" />)}
      <path d="M-160 -150 H-90 C-92 -60 -70 30 -110 150 H-160Z" fill="url(#yc-vol)" opacity=".25" />
      <path d="M-154 10 Q-120 30 -96 6" stroke="url(#yc-gold)" strokeWidth="6" fill="none" />
    </g>
  );
  return (
    <g>
      {side(1)}{side(-1)}
      <rect x="-172" y="-162" width="344" height="12" rx="6" fill="url(#yc-wood)" />
      <path d="M-160 -150 Q-120 -126 -80 -150 Q-40 -126 0 -150 Q40 -126 80 -150 Q120 -126 160 -150 V-138 H-160Z" fill={shade(c, -0.05)} />
    </g>
  );
}

export function PictureFrame({ c = '#C8925E' }: { c?: string }) {
  return (
    <g>
      <rect x="-70" y="-56" width="140" height="112" rx="4" fill={c} />
      <rect x="-70" y="-56" width="140" height="112" rx="4" fill="url(#yc-vol)" opacity=".4" />
      <rect x="-56" y="-42" width="112" height="84" fill="#FFF8ED" />
      <rect x="-56" y="-42" width="112" height="84" fill="url(#yc-floral)" opacity=".7" />
      <g transform="translate(0 4) scale(.8)"><path d="M-22 -10 h44 l-6 40 h-32z" fill="#4CC85A" opacity=".85" /><circle cy="-16" r="15" fill="#FFF8E6" /><circle cx="6" cy="-30" r="6" fill="url(#yc-cherry)" /></g>
    </g>
  );
}

export function MenuBoard({ text = 'Today’s special ♡' }: { text?: string }) {
  return (
    <g>
      <rect x="-100" y="-80" width="200" height="160" rx="8" fill="url(#yc-wood)" />
      <rect x="-90" y="-70" width="180" height="140" rx="4" fill="#2F3B33" />
      <text x="0" y="-38" textAnchor="middle" fill="#FFF8ED" fontFamily='"Mochiy Pop One", Mali, sans-serif' fontSize="20">MENU</text>
      <path d="M-60 -28 h120" stroke="#F7B8C8" strokeWidth="2" strokeDasharray="4 4" />
      <text x="0" y="0" textAnchor="middle" fill="#F7B8C8" fontFamily="Mali, sans-serif" fontWeight="700" fontSize="15">{text.slice(0, 22)}</text>
      <text x="-70" y="28" fill="#FFF8ED" fontFamily="Mali, sans-serif" fontSize="12">Cream soda</text><text x="70" y="28" fill="#F6E5A9" fontFamily="Mali" fontSize="12" textAnchor="end">¥480</text>
      <text x="-70" y="48" fill="#FFF8ED" fontFamily="Mali, sans-serif" fontSize="12">Matcha parfait</text><text x="70" y="48" fill="#F6E5A9" fontFamily="Mali" fontSize="12" textAnchor="end">¥650</text>
    </g>
  );
}

export function Clock({ c = '#FFFFFF' }: { c?: string }) {
  return (
    <g>
      <circle r="44" fill="url(#yc-wood)" />
      <circle r="36" fill={c} />
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x="-1.5" y="-33" width="3" height="7" fill="#5E4535" transform={`rotate(${i * 30})`} />)}
      <path d="M0 0 L0 -22 M0 0 L16 6" stroke="#5E4535" strokeWidth="4" strokeLinecap="round" />
      <circle r="4" fill="#E8607E" />
    </g>
  );
}

export function Garland() {
  const cols = ['#F7B8C8', '#F6E5A9', '#B9CBA5', '#C9E2EF'];
  return (
    <g>
      <path d="M-200 -20 Q0 40 200 -20" stroke="#5E4535" strokeWidth="2" fill="none" />
      {Array.from({ length: 11 }).map((_, i) => {
        const t = i / 10;
        const x = -200 + 400 * t;
        const y = -20 + 60 * 2 * t * (1 - t) * 1;
        return (
          <g key={i} transform={`translate(${x} ${y + 8})`}>
            <circle r="16" fill={cols[i % 4]} opacity=".35" filter="url(#yc-blur4)" />
            <rect x="-3" y="-10" width="6" height="6" fill="#5E4535" />
            <ellipse rx="6" ry="9" cy="2" fill={cols[i % 4]} />
            <ellipse cx="-2" cy="-1" rx="2" ry="3" fill="#fff" opacity=".7" />
          </g>
        );
      })}
    </g>
  );
}

export function Rug({ c = '#F7B8C8' }: { c?: string }) {
  return (
    <g>
      <ellipse rx="160" ry="40" fill={c} />
      <ellipse rx="140" ry="32" fill="none" stroke="#fff" strokeWidth="4" strokeDasharray="10 8" />
      <ellipse rx="100" ry="22" fill={shade(c, 0.25)} />
    </g>
  );
}

/* ---------- exterior ---------- */
export function ASign({ text = 'OPEN ♡' }: { text?: string }) {
  return (
    <g>
      <ellipse cy="96" rx="60" ry="7" fill="url(#yc-floor-shadow)" />
      <path d="M-50 92 L-30 -90 H30 L50 92" stroke="#8E5E36" strokeWidth="8" fill="none" strokeLinejoin="round" />
      <rect x="-40" y="-76" width="80" height="120" rx="4" fill="#2F3B33" stroke="url(#yc-wood)" strokeWidth="6" />
      <text y="-46" textAnchor="middle" fill="#FFF8ED" fontFamily='"Mochiy Pop One", Mali' fontSize="13">TODAY</text>
      <text y="-14" textAnchor="middle" fill="#F7B8C8" fontFamily="Mali" fontWeight="700" fontSize="13">{text.slice(0, 12)}</text>
      <g transform="translate(0 18) scale(.5)"><path d="M-18 -10 h36 l-6 40 h-24z" fill="#4CC85A" opacity=".85" /><circle cy="-16" r="14" fill="#FFF8E6" /><circle cx="6" cy="-30" r="6" fill="url(#yc-cherry)" /></g>
    </g>
  );
}

export function FlowerPot({ c = '#E8607E' }: { c?: string }) {
  return (
    <g>
      <ellipse cy="62" rx="44" ry="7" fill="url(#yc-floor-shadow)" />
      {[[-26, -26], [0, -40], [24, -24], [-12, -6], [14, -8]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(.6)`}>
          {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} rx="9" ry="14" cy="-12" fill={i % 2 ? '#FFFFFF' : c} stroke={shade(c, -0.1)} strokeWidth=".8" transform={`rotate(${a})`} />)}
          <circle r="7" fill="#F6C945" />
        </g>
      ))}
      <path d="M-34 10 C-30 -6 -10 -2 0 4 C10 -2 30 -6 34 10" fill="url(#yc-leaf)" />
      <path d="M-34 14 H34 L26 60 H-26Z" fill="#C8784A" />
      <path d="M-34 14 H34 L26 60 H-26Z" fill="url(#yc-vol)" opacity=".45" />
      <rect x="-38" y="8" width="76" height="12" rx="4" fill="#B5683C" />
    </g>
  );
}

export function Planter({ c = '#FFFFFF' }: { c?: string }) {
  return (
    <g>
      {Array.from({ length: 7 }).map((_, i) => (
        <g key={i} transform={`translate(${-78 + i * 26} ${-14 - (i % 2) * 10}) scale(.45)`}>
          {[0, 60, 120, 180, 240, 300].map((a) => <ellipse key={a} rx="10" ry="15" cy="-12" fill={['#F7B8C8', '#FFFFFF', '#F6E5A9', '#C7B6E8'][i % 4]} transform={`rotate(${a})`} />)}
          <circle r="7" fill="#F6C945" />
        </g>
      ))}
      <path d="M-96 0 C-60 -26 60 -26 96 0Z" fill="url(#yc-leaf)" />
      <rect x="-100" y="0" width="200" height="44" rx="6" fill={c === '#FFFFFF' ? '#B88A5C' : c} />
      {[-80, -40, 0, 40, 80].map((x) => <path key={x} d={`M${x} 2 V42`} stroke="#000" strokeOpacity=".1" strokeWidth="2" />)}
    </g>
  );
}

export function Bench({ c = '#92745F' }: { c?: string }) {
  return (
    <g>
      <ellipse cy="48" rx="110" ry="8" fill="url(#yc-floor-shadow)" />
      <rect x="-100" y="-50" width="200" height="14" rx="5" fill={c} />
      <rect x="-100" y="-28" width="200" height="14" rx="5" fill={c} />
      <rect x="-108" y="0" width="216" height="16" rx="5" fill={shade(c, 0.1)} />
      <path d="M-86 -50 V46 M86 -50 V46 M-70 16 V46 M70 16 V46" stroke={shade(c, -0.25)} strokeWidth="8" strokeLinecap="round" />
    </g>
  );
}

export function Lantern({ c = '#E8302E' }: { c?: string }) {
  return (
    <g>
      <circle r="60" fill="#FFB27A" opacity=".35" filter="url(#yc-blur10)" />
      <rect x="-20" y="-72" width="40" height="10" rx="3" fill="#2B2B2B" />
      <rect x="-20" y="62" width="40" height="10" rx="3" fill="#2B2B2B" />
      <ellipse rx="38" ry="64" fill={c} />
      {[-48, -32, -16, 0, 16, 32, 48].map((y) => <ellipse key={y} cy={y} rx={38 * Math.sqrt(1 - (y / 64) ** 2)} ry="3" fill="none" stroke={shade(c, -0.25)} strokeWidth="1.5" />)}
      <ellipse rx="38" ry="64" fill="url(#yc-vol)" opacity=".4" />
      <text y="12" textAnchor="middle" fill="#fff" fontFamily='"Zen Maru Gothic", sans-serif' fontWeight="700" fontSize="32">甘</text>
      <path d="M0 72 v14" stroke="#2B2B2B" strokeWidth="3" />
    </g>
  );
}

export function Noren({ c = '#2E4E7A', text = 'ゆみ' }: { c?: string; text?: string }) {
  return (
    <g>
      <rect x="-150" y="-80" width="300" height="10" rx="5" fill="url(#yc-wood)" />
      {[-150, -50, 50].map((x, i) => (
        <g key={i}>
          <path d={`M${x + 2} -70 h96 v140 h-96z`} fill={c} />
          <path d={`M${x + 2} -70 h96 v140 h-96z`} fill="url(#yc-vol)" opacity=".2" />
        </g>
      ))}
      <circle cy="0" r="38" fill="#fff" opacity=".9" />
      <text y="12" textAnchor="middle" fill={c} fontFamily='"Zen Maru Gothic", sans-serif' fontWeight="700" fontSize="30">{text}</text>
    </g>
  );
}

export function Bike({ c = '#B9CBA5' }: { c?: string }) {
  return (
    <g>
      <ellipse cy="52" rx="110" ry="8" fill="url(#yc-floor-shadow)" />
      {[-62, 62].map((x) => <g key={x}><circle cx={x} cy="12" r="38" fill="none" stroke="#3A3A3A" strokeWidth="6" /><circle cx={x} cy="12" r="5" fill="url(#yc-metal)" />{[0, 45, 90, 135].map((a) => <path key={a} d={`M${x - 34} 12 h68`} stroke="#999" strokeWidth="1" transform={`rotate(${a} ${x} 12)`} />)}</g>)}
      <path d="M-62 12 L-10 12 L20 -36 L-30 -36 Z M-10 12 L-30 -48 M20 -36 L62 12 M20 -36 L26 -60" stroke={c} strokeWidth="7" fill="none" strokeLinejoin="round" />
      <path d="M-42 -50 h24" stroke="#5E3A27" strokeWidth="8" strokeLinecap="round" />
      <path d="M16 -62 h22" stroke="#3A3A3A" strokeWidth="5" strokeLinecap="round" />
      <rect x="40" y="-60" width="46" height="36" rx="5" fill="url(#yc-wood)" />
      <g transform="translate(63 -66) scale(.4)"><Lantern c="#F7B8C8" /></g>
    </g>
  );
}
