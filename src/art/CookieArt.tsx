import { useId, type ReactNode } from 'react';
import type { CookieData, IcingStroke, StageItem } from '../types';
import { dough } from '../data/catalog';
import { mix, rng, shade } from '../utils/misc';
import { useAssets } from '../store/assetStore';

/** Cookie shape primitives in a 100×100 box centred on 0,0 */
export function ShapeEls({ shape, letter, p }: { shape: string; letter?: string; p: Record<string, any> }) {
  switch (shape) {
    case 'heart': return <path d="M0 40 C-50 8 -54 -24 -32 -38 C-16 -48 -4 -38 0 -28 C4 -38 16 -48 32 -38 C54 -24 50 8 0 40Z" {...p} />;
    case 'star': return <path d="M0 -46 L13 -16 L45 -14 L21 7 L28 40 L0 23 L-28 40 L-21 7 L-45 -14 L-13 -16Z" {...p} strokeLinejoin="round" />;
    case 'flower': return <>{[0, 72, 144, 216, 288].map((a) => <circle key={a} r="21" cy="-22" transform={`rotate(${a})`} {...p} />)}<circle r="24" {...p} /></>;
    case 'cat': return <><path d="M-36 -10 L-30 -46 L-8 -30 Z M36 -10 L30 -46 L8 -30Z" {...p} strokeLinejoin="round" /><ellipse cy="6" rx="40" ry="35" {...p} /></>;
    case 'bear': return <><circle cx="-28" cy="-28" r="15" {...p} /><circle cx="28" cy="-28" r="15" {...p} /><circle cy="4" r="38" {...p} /></>;
    case 'bunny': return <><ellipse cx="-14" cy="-36" rx="10" ry="24" {...p} /><ellipse cx="14" cy="-36" rx="10" ry="24" {...p} /><ellipse cy="12" rx="36" ry="31" {...p} /></>;
    case 'cloud': return <><circle cx="-22" cy="6" r="22" {...p} /><circle cx="2" cy="-10" r="28" {...p} /><circle cx="26" cy="6" r="21" {...p} /><rect x="-40" y="4" width="84" height="24" rx="12" {...p} /></>;
    case 'cherry': return <><path d="M-18 4 Q-8 -30 14 -42 M20 2 Q16 -24 14 -42" fill="none" stroke={p.fill} strokeWidth="10" strokeLinecap="round" /><circle cx="-20" cy="18" r="22" {...p} /><circle cx="22" cy="16" r="21" {...p} /></>;
    case 'house': return <path d="M0 -44 L42 -6 L34 -6 L34 40 L-34 40 L-34 -6 L-42 -6Z" {...p} strokeLinejoin="round" />;
    case 'moon': return <path d="M10 -44 A44 44 0 1 0 40 22 A34 34 0 1 1 10 -44Z" {...p} strokeLinejoin="round" />;
    case 'fish': return <path d="M-44 0 C-34 -26 14 -30 26 -8 L44 -24 L40 0 L44 24 L26 8 C14 30 -34 26 -44 0Z" {...p} strokeLinejoin="round" />;
    case 'onigiri': return <path d="M0 -40 C10 -40 44 18 40 30 C36 40 -36 40 -40 30 C-44 18 -10 -40 0 -40Z" {...p} />;
    case 'letter': return <rect x="-38" y="-38" width="76" height="76" rx="18" {...p} />;
    default: return <circle r="40" {...p} />;
  }
}

export function CookieShape({ it, doughId, bake, icing = [], raw = false, selected }: { it: StageItem; doughId: string; bake: number; icing?: IcingStroke[]; raw?: boolean; selected?: boolean }) {
  const uid = useId().replace(/:/g, '');
  const dd = dough(doughId);
  const b = raw ? 0 : bake;
  const col = mix(dd.color!, dd.color2!, b * 0.75);
  const s = (it.w / 100) * (1 + b * 0.06);
  const r = rng(it.id.length * 13 + 7);
  return (
    <g transform={`translate(${it.x} ${it.y}) rotate(${it.rotation}) scale(${s})`}>
      <defs>
        <clipPath id={`ck-${uid}`}><ShapeEls shape={it.ref} letter={it.letter} p={{ fill: '#000', stroke: '#000', strokeWidth: 10 }} /></clipPath>
      </defs>
      <g filter={raw ? undefined : 'url(#yc-shadow)'}>
        <ShapeEls shape={it.ref} letter={it.letter} p={{ fill: col, stroke: col, strokeWidth: 10 }} />
      </g>
      <g clipPath={`url(#ck-${uid})`}>
        <rect x="-70" y="-70" width="140" height="140" fill={col} filter="url(#yc-grain)" opacity=".9" />
        {!raw && <g filter="url(#yc-edge)" opacity={0.12 + b * 0.38}><ShapeEls shape={it.ref} letter={it.letter} p={{ fill: '#000', stroke: '#000', strokeWidth: 10 }} /></g>}
        {doughId === 'blueberry' && Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={(r() - 0.5) * 80} cy={(r() - 0.5) * 80} r={2 + r() * 2} fill="#4A3B8C" opacity=".75" />)}
        {doughId === 'chocolate' && Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={(r() - 0.5) * 70} cy={(r() - 0.5) * 70} r="2" fill="#2A140A" opacity=".5" />)}
        <ellipse cx="-16" cy="-18" rx="26" ry="14" fill="#fff" opacity={raw ? 0.25 : 0.18} />
        {it.ref === 'letter' && <text y="20" textAnchor="middle" fontFamily='"Mochiy Pop One", sans-serif' fontSize="56" fill={shade(col, -0.14)}>{(it.letter || 'A').slice(0, 1)}</text>}
        {it.ref === 'onigiri' && !raw && <rect x="-18" y="12" width="36" height="30" rx="3" fill="#1F3324" opacity=".9" />}
        {icing.map((st) => <Icing key={st.id} st={st} />)}
      </g>
      {selected && <ShapeEls shape={it.ref} letter={it.letter} p={{ fill: 'none', stroke: '#E8869F', strokeWidth: 3, strokeDasharray: '6 5' }} />}
    </g>
  );
}

export function Icing({ st }: { st: IcingStroke }) {
  if (st.flood) {
    return (
      <g>
        <rect x="-80" y="-80" width="160" height="160" fill={st.color} transform="scale(.86)" opacity=".98" />
        <ellipse cx="-14" cy="-16" rx="22" ry="10" fill="#fff" opacity=".35" />
      </g>
    );
  }
  if (!st.points.length) return null;
  const d = st.points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ') + (st.points.length === 1 ? ' l0.1 0' : '');
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={shade(st.color, -0.18)} strokeWidth={st.width + 1.5} transform="translate(0 1.2)" opacity=".6" />
      <path d={d} stroke={st.color} strokeWidth={st.width} />
      <path d={d} stroke="#fff" strokeWidth={Math.max(1, st.width * 0.3)} opacity=".55" transform="translate(-0.8 -0.9)" />
    </g>
  );
}

/* ---------------------------------------------------------------- scenes */

export function DoughBowl({ added, mixLevel, doughId }: { added: string[]; mixLevel: number; doughId: string }) {
  const dd = dough(doughId);
  const r = rng(4);
  const bits: Record<string, ReactNode> = {
    flour: <g><ellipse rx="54" ry="38" fill="#FBF8F1" /><ellipse cx="-10" cy="-8" rx="28" ry="16" fill="#fff" /></g>,
    butter: <g><rect x="-22" y="-16" width="44" height="32" rx="5" fill="#F9E08A" /><rect x="-22" y="-16" width="44" height="10" rx="5" fill="#FCEDB0" /></g>,
    sugar: <g>{Array.from({ length: 30 }).map((_, i) => <rect key={i} x={(r() - 0.5) * 50} y={(r() - 0.5) * 34} width="3" height="3" fill="#fff" stroke="#EEE" strokeWidth=".5" />)}</g>,
    egg: <g><ellipse rx="26" ry="22" fill="#FFFDF6" /><circle r="13" fill="#F8B92A" /><circle cx="-4" cy="-4" r="4" fill="#FFE08A" /></g>,
    flavor: <g><ellipse rx="26" ry="18" fill={dd.color2} /><ellipse cx="-6" cy="-5" rx="9" ry="4" fill="#fff" opacity=".4" /></g>,
  };
  const pos: Record<string, [number, number]> = { flour: [250, 250], butter: [196, 222], sugar: [298, 228], egg: [282, 288], flavor: [210, 290] };
  return (
    <g>
      <ellipse cx="250" cy="430" rx="200" ry="30" fill="url(#yc-floor-shadow)" />
      <ellipse cx="250" cy="260" rx="200" ry="170" fill="url(#yc-ceramic)" stroke="#E0D6C8" strokeWidth="3" />
      <ellipse cx="250" cy="262" rx="176" ry="148" fill="#F3EDE4" />
      <ellipse cx="250" cy="262" rx="176" ry="148" fill="none" stroke="#B9CBA5" strokeWidth="6" strokeDasharray="2 14" />
      <ellipse cx="250" cy="275" rx="150" ry="120" fill="#E8DFD2" opacity=".6" />
      {mixLevel < 1 && added.map((a) => (
        <g key={a} transform={`translate(${pos[a][0] + (250 - pos[a][0]) * mixLevel} ${pos[a][1] + (262 - pos[a][1]) * mixLevel}) scale(${1 - mixLevel * 0.5})`} opacity={1 - mixLevel * 0.85}>{bits[a]}</g>
      ))}
      {mixLevel > 0 && (
        <g transform={`translate(250 262) scale(${0.3 + mixLevel * 0.7})`} opacity={Math.min(1, mixLevel * 1.5)}>
          <path d="M-90 10 C-96 -50 -30 -80 10 -74 C70 -70 100 -30 92 16 C86 60 30 78 -10 74 C-60 70 -86 50 -90 10Z" fill={dd.color} filter="url(#yc-rough)" />
          <path d="M-90 10 C-96 -50 -30 -80 10 -74 C70 -70 100 -30 92 16 C86 60 30 78 -10 74 C-60 70 -86 50 -90 10Z" fill={dd.color} filter="url(#yc-grain)" opacity=".7" />
          <path d="M-50 -30 C-20 -50 30 -50 50 -24" stroke="#fff" strokeOpacity=".4" strokeWidth="8" fill="none" strokeLinecap="round" />
          {doughId === 'chocolate' || doughId === 'blueberry' ? null : <path d="M-40 10 q20 -14 40 0 t40 0" stroke={dd.color2} strokeOpacity=".5" strokeWidth="4" fill="none" />}
        </g>
      )}
    </g>
  );
}

export function DoughBoard({ doughId, knead, roll, squish = 0 }: { doughId: string; knead: number; roll: number; squish?: number }) {
  const dd = dough(doughId);
  const rw = 80 + roll * 120;
  const rh = 76 - roll * 20 + roll * 100;
  const flat = roll > 0;
  return (
    <g>
      <rect x="20" y="40" width="460" height="420" rx="24" fill="url(#yc-wood)" />
      {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M30 ${70 + i * 44} C150 ${60 + i * 44} 350 ${84 + i * 44} 470 ${70 + i * 44}`} stroke="#8E5E36" strokeOpacity=".22" strokeWidth="2" fill="none" />)}
      {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={80 + ((i * 97) % 340)} cy={90 + ((i * 61) % 320)} r={1 + (i % 3)} fill="#fff" opacity=".55" />)}
      {flat ? (
        <g>
          <rect x={250 - rw} y={250 - rh} width={rw * 2} height={rh * 2} rx={60 - roll * 40} fill={shade(dd.color!, -0.08)} transform="translate(0 5)" />
          <rect x={250 - rw} y={250 - rh} width={rw * 2} height={rh * 2} rx={60 - roll * 40} fill={dd.color} filter="url(#yc-rough)" />
          <rect x={250 - rw} y={250 - rh} width={rw * 2} height={rh * 2} rx={60 - roll * 40} fill={dd.color} filter="url(#yc-grain)" opacity=".6" />
          <ellipse cx={250 - rw * 0.3} cy={250 - rh * 0.4} rx={rw * 0.5} ry={rh * 0.2} fill="#fff" opacity=".18" />
        </g>
      ) : (
        <g transform={`translate(250 250) scale(${1 + squish * 0.18} ${1 - squish * 0.2})`}>
          <ellipse cy="64" rx="90" ry="18" fill="#000" opacity=".15" />
          <path d={`M-90 20 C-96 -40 -30 -76 0 -76 C50 -76 96 -40 92 20 C88 60 40 70 0 70 C-50 70 -86 60 -90 20Z`} fill={dd.color} filter="url(#yc-rough)" />
          <path d="M-90 20 C-96 -40 -30 -76 0 -76 C50 -76 96 -40 92 20 C88 60 40 70 0 70 C-50 70 -86 60 -90 20Z" fill={dd.color} filter="url(#yc-grain)" opacity=".7" />
          <path d="M-50 -40 C-20 -60 30 -60 50 -36" stroke="#fff" strokeOpacity={0.25 + knead * 0.3} strokeWidth="10" fill="none" strokeLinecap="round" />
          {knead < 0.9 && <path d="M-40 0 q20 -20 40 0 M10 20 q20 -18 40 0" stroke={dd.color2} strokeOpacity={0.6 * (1 - knead)} strokeWidth="5" fill="none" />}
        </g>
      )}
    </g>
  );
}

export function RollingPin({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} pointerEvents="none">
      <rect x="-190" y="-18" width="44" height="36" rx="18" fill="url(#yc-wood)" />
      <rect x="146" y="-18" width="44" height="36" rx="18" fill="url(#yc-wood)" />
      <rect x="-150" y="-30" width="300" height="60" rx="30" fill="#E8C99C" />
      <rect x="-150" y="-30" width="300" height="60" rx="30" fill="url(#yc-shine-v)" opacity=".4" />
      <rect x="-150" y="-30" width="300" height="60" rx="30" fill="none" stroke="#B88A5C" strokeWidth="2" />
    </g>
  );
}

export function Oven({ on, progress, children }: { on: boolean; progress: number; children?: ReactNode }) {
  return (
    <g>
      <rect x="40" y="40" width="420" height="420" rx="34" fill="#F3B3C3" />
      <rect x="40" y="40" width="420" height="420" rx="34" fill="url(#yc-vol)" opacity=".35" />
      <rect x="60" y="60" width="380" height="60" rx="16" fill="#FBD3DE" />
      {[120, 190, 260, 330].map((x, i) => (
        <g key={x} transform={`translate(${x} 90)`}>
          <circle r="18" fill="url(#yc-metal)" />
          <rect x="-3" y="-15" width="6" height="12" rx="3" fill="#7E878C" transform={`rotate(${i === 0 ? progress * 270 - 135 : i * 40})`} />
        </g>
      ))}
      <circle cx="400" cy="90" r="9" fill={on ? '#FF6B5A' : '#C9A0A8'} />
      {on && <circle cx="400" cy="90" r="16" fill="#FF6B5A" opacity=".35" className="anim-glow" />}
      <rect x="70" y="144" width="360" height="290" rx="22" fill="#5E3A30" />
      <rect x="86" y="160" width="328" height="258" rx="16" fill={on ? '#FFB066' : '#3A2420'} className={on ? 'anim-glow' : ''} />
      {on && <rect x="86" y="160" width="328" height="258" rx="16" fill="url(#yc-shine-v)" opacity=".25" />}
      <g clipPath="url(#oven-win)">
        <defs><clipPath id="oven-win"><rect x="86" y="160" width="328" height="258" rx="16" /></clipPath></defs>
        <path d="M96 290 H404" stroke="#C0C0C0" strokeWidth="4" />
        {children}
        {on && [130, 250, 370].map((x) => <path key={x} d={`M${x} 410 q-12 -20 0 -40 q12 -20 0 -40`} stroke="#fff" strokeOpacity=".25" strokeWidth="10" fill="none" strokeLinecap="round" className="anim-steam" />)}
      </g>
      <rect x="86" y="160" width="328" height="258" rx="16" fill="url(#yc-glass-body)" opacity=".8" />
      <path d="M100 180 L200 400" stroke="#fff" strokeOpacity=".2" strokeWidth="24" />
      <rect x="120" y="128" width="260" height="14" rx="7" fill="url(#yc-metal)" />
      <rect x="70" y="440" width="40" height="16" rx="4" fill="#C9879A" /><rect x="390" y="440" width="40" height="16" rx="4" fill="#C9879A" />
    </g>
  );
}

export function TrayBackdrop() {
  return (
    <g>
      <rect x="22" y="22" width="456" height="456" rx="26" fill="url(#yc-metal)" />
      <rect x="34" y="34" width="432" height="432" rx="18" fill="#C9CED2" />
      <rect x="46" y="46" width="408" height="408" rx="6" fill="#FFFDF6" />
      <rect x="46" y="46" width="408" height="408" rx="6" fill="#E9D7B8" opacity=".25" />
      {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M46 ${80 + i * 56} H454`} stroke="#EADFC8" strokeWidth="1" />)}
    </g>
  );
}

export function SheetBackdrop({ doughId }: { doughId: string }) {
  const dd = dough(doughId);
  return (
    <g>
      <rect x="20" y="20" width="460" height="460" rx="24" fill="url(#yc-wood)" />
      {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={40 + ((i * 97) % 420)} cy={40 + ((i * 61) % 420)} r={1 + (i % 3)} fill="#fff" opacity=".5" />)}
      <rect x="50" y="56" width="400" height="388" rx="30" fill={shade(dd.color!, -0.08)} transform="translate(0 6)" />
      <rect x="50" y="56" width="400" height="388" rx="30" fill={dd.color} filter="url(#yc-rough)" />
      <rect x="50" y="56" width="400" height="388" rx="30" fill={dd.color} filter="url(#yc-grain)" opacity=".5" />
    </g>
  );
}

export function PackageUnder({ pack }: { pack: CookieData['pack'] }) {
  switch (pack.type) {
    case 'box':
      return (
        <g>
          <rect x="14" y="14" width="472" height="472" rx="14" fill={shade(pack.color, -0.1)} />
          <rect x="24" y="24" width="452" height="452" rx="8" fill={pack.color} />
          <rect x="44" y="44" width="412" height="412" rx="4" fill={shade(pack.color, -0.18)} />
          <rect x="52" y="52" width="396" height="396" fill="#FFFDF6" />
          <path d="M52 52 l20 20 h356 l20 -20" fill="#fff" opacity=".5" />
        </g>
      );
    case 'tin':
      return (
        <g>
          <circle cx="250" cy="250" r="244" fill={shade(pack.color, -0.2)} />
          <circle cx="250" cy="250" r="236" fill={pack.color} />
          <circle cx="250" cy="250" r="236" fill="url(#yc-vol)" opacity=".4" />
          <circle cx="250" cy="250" r="214" fill="#F5EFE6" />
          {Array.from({ length: 36 }).map((_, i) => <path key={i} d="M0 -214 L6 -198 L-6 -198Z" fill="#fff" transform={`translate(250 250) rotate(${i * 10})`} />)}
        </g>
      );
    case 'bag':
      return <rect x="40" y="30" width="420" height="450" rx="18" fill="#FFF8ED" />;
    default:
      return (
        <g>
          <circle cx="250" cy="256" r="236" fill="#000" opacity=".1" />
          <circle cx="250" cy="250" r="236" fill="url(#yc-ceramic)" />
          <circle cx="250" cy="250" r="214" fill="#FFFFFF" />
          {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={250 + Math.cos((i / 40) * Math.PI * 2) * 205} cy={250 + Math.sin((i / 40) * Math.PI * 2) * 205} r="10" fill="#FFF8ED" stroke="#F1E3CF" />)}
          <circle cx="250" cy="250" r="196" fill="#FFFDF8" stroke="#F1E3CF" strokeDasharray="3 4" />
        </g>
      );
  }
}

export function PackageOver({ pack }: { pack: CookieData['pack'] }) {
  const url = useAssets((s) => (pack.asset ? s.urls[pack.asset] : undefined));
  const uid = useId().replace(/:/g, '');
  const bow = (x: number, y: number, s = 1) => (
    <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#yc-shadow)">
      <path d="M-4 0 C-20 -24 -46 -18 -42 0 C-46 18 -20 24 -4 0Z" fill={pack.ribbon} />
      <path d="M4 0 C20 -24 46 -18 42 0 C46 18 20 24 4 0Z" fill={pack.ribbon} />
      <path d="M-4 4 L-18 40 L-8 36 L-4 44 L0 6Z M4 4 L18 40 L8 36 L4 44 L0 6Z" fill={shade(pack.ribbon, -0.12)} />
      <rect x="-8" y="-9" width="16" height="18" rx="6" fill={shade(pack.ribbon, -0.15)} />
      <path d="M-32 -8 C-24 -14 -14 -10 -8 -3" stroke="#fff" strokeOpacity=".45" strokeWidth="3" fill="none" />
    </g>
  );
  const label = url && (
    <g transform="translate(404 414)">
      <defs><clipPath id={`pl-${uid}`}><circle r="44" /></clipPath></defs>
      <circle r="50" fill="#fff" filter="url(#yc-shadow)" />
      <image href={url} x="-44" y="-44" width="88" height="88" preserveAspectRatio="xMidYMid slice" clipPath={`url(#pl-${uid})`} />
    </g>
  );
  switch (pack.type) {
    case 'box':
      return <g><path d="M14 120 L120 14" stroke={pack.ribbon} strokeWidth="18" /><path d="M14 120 L120 14" stroke="#fff" strokeOpacity=".3" strokeWidth="4" />{bow(66, 66, 1.1)}{label}</g>;
    case 'bag':
      return (
        <g>
          <rect x="40" y="30" width="420" height="450" rx="18" fill="#EAF6FA" opacity=".28" />
          <rect x="40" y="30" width="420" height="450" rx="18" fill="none" stroke="#fff" strokeWidth="4" />
          <path d="M70 60 L110 450" stroke="#fff" strokeOpacity=".6" strokeWidth="14" strokeLinecap="round" />
          <path d="M90 60 L118 300" stroke="#fff" strokeOpacity=".8" strokeWidth="4" strokeLinecap="round" />
          <path d="M400 80 L430 300" stroke="#fff" strokeOpacity=".4" strokeWidth="8" strokeLinecap="round" />
          <path d="M140 30 Q250 70 360 30" stroke="#fff" strokeWidth="3" fill="none" opacity=".8" />
          {bow(250, 36, 1.2)}
          {label}
        </g>
      );
    case 'tin':
      return <g>{bow(250, 22, 1)}{label}</g>;
    default:
      return <g>{label}</g>;
  }
}

export function CookieScene({ d, selectedCookie, showPack = true }: { d: CookieData; selectedCookie?: string | null; showPack?: boolean }) {
  return (
    <g>
      {showPack ? <PackageUnder pack={d.pack} /> : <TrayBackdrop />}
      {d.cookies.map((c) => (
        <CookieShape key={c.id} it={c} doughId={d.dough} bake={d.bake} icing={d.icing.filter((s) => s.cookieId === c.id)} selected={selectedCookie === c.id} />
      ))}
    </g>
  );
}
