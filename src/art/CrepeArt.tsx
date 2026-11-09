import { useId, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { CrepeData } from '../types';
import { batter, CREPE_CREAMS, CREPE_SAUCES, WRAPPERS } from '../data/catalog';
import { BananaSlice, Brownie, Cheesecake, Cherry, Cookie, Drizzle, KiwiSlice, Mochi, PeachSlice, Sprinkles, StrawberryHalf, Strawberry, WhippedCream } from './food';
import { mix, shade } from '../utils/misc';
import { useAssets } from '../store/assetStore';

export function crepeColors(id: string, cook: number, flipped: boolean) {
  const b = batter(id);
  const k = Math.min(1, cook);
  const base = mix(b.color!, b.color2!, k * (flipped ? 0.85 : 0.6));
  return { base, dark: shade(base, -0.18), lace: shade(b.color2!, -0.15) };
}

/* ---------------------------------------------------------------- cooking pan */
export function CrepePan({ radius, cook, flipped, batterId, pour }: { radius: number; cook: number; flipped: boolean; batterId: string; pour?: { x: number; y: number } | null }) {
  const c = crepeColors(batterId, cook, flipped);
  const raw = batter(batterId).color!;
  const fill = radius > 0 ? mix(raw, c.base, Math.min(1, cook * 1.4)) : raw;
  return (
    <g>
      <ellipse cx="200" cy="290" rx="186" ry="40" fill="url(#yc-floor-shadow)" />
      <rect x="320" y="370" width="120" height="26" rx="13" fill="#3A2A20" transform="rotate(35 320 370)" />
      <rect x="320" y="372" width="120" height="8" rx="4" fill="#fff" opacity=".12" transform="rotate(35 320 370)" />
      <circle cx="200" cy="250" r="184" fill="#2A2522" />
      <circle cx="200" cy="250" r="176" fill="#3B3633" />
      <defs>
        <radialGradient id="pan-sheen" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#6D6762" />
          <stop offset="0.6" stopColor="#3E3936" />
          <stop offset="1" stopColor="#2A2522" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="250" r="168" fill="url(#pan-sheen)" />
      <path d="M90 140 A150 150 0 0 1 220 92" stroke="#fff" strokeOpacity=".12" strokeWidth="10" fill="none" strokeLinecap="round" />
      {radius > 0 && (
        <g>
          <circle cx="200" cy="250" r={radius + 3} fill={shade(fill, -0.25)} opacity=".5" />
          <circle cx="200" cy="250" r={radius} fill={fill} filter="url(#yc-rough)" />
          {cook > 0.25 && <circle cx="200" cy="250" r={radius} fill={c.lace} filter="url(#yc-lace)" opacity={Math.min(0.9, (cook - 0.25) * (flipped ? 1.6 : 1.1))} />}
          <circle cx="200" cy="250" r={Math.max(0, radius - 4)} fill="none" stroke={shade(fill, -0.2)} strokeWidth="5" opacity={cook * 0.7} />
          {!flipped && cook > 0.1 && cook < 0.95 && Array.from({ length: 16 }).map((_, i) => {
            const a = i * 2.4, d = 20 + ((i * 37) % Math.max(30, radius - 30));
            return <circle key={i} className="anim-cook-bubble" cx={200 + Math.cos(a) * d} cy={250 + Math.sin(a) * d} r={2 + (i % 3)} fill="none" stroke="#fff" strokeOpacity=".7" style={{ animationDelay: `${(i % 7) * 0.2}s` }} />;
          })}
          <ellipse cx="160" cy="200" rx={radius * 0.35} ry={radius * 0.12} fill="#fff" opacity=".18" transform="rotate(-30 160 200)" />
          {cook > 0.4 && <g className="anim-steam">{[150, 200, 250].map((x) => <path key={x} d={`M${x} 160 q-10 -20 0 -40 q10 -20 0 -40`} stroke="#fff" strokeOpacity=".35" strokeWidth="8" fill="none" strokeLinecap="round" />)}</g>}
        </g>
      )}
      {pour && (
        <g>
          <path d={`M${pour.x} 0 L${pour.x} ${pour.y}`} stroke={raw} strokeWidth="12" strokeLinecap="round" />
          <circle cx={pour.x} cy={pour.y} r="16" fill={raw} />
        </g>
      )}
    </g>
  );
}

/* ---------------------------------------------------------------- finished crepe */

export function Fillings({ d, cx, cy, spread }: { d: CrepeData; cx: number; cy: number; spread: number }) {
  const parts: ReactNode[] = [];
  const creams = d.fillings.filter((f) => f.startsWith('cream-'));
  const fruits = d.fillings.filter((f) => f.startsWith('fruit-'));
  const others = d.fillings.filter((f) => !f.startsWith('cream-') && !f.startsWith('fruit-'));
  // back row: cheesecake / brownie / pudding
  others.forEach((o, i) => {
    const x = cx + spread * (0.55 - i * 0.38);
    const y = cy - 34 + (i % 2) * 10;
    let el: ReactNode = null;
    if (o === 'cheesecake') el = <Cheesecake s={1.1} />;
    if (o === 'brownie') el = <Brownie s={1.1} />;
    if (o === 'mochi') el = <g><g transform="translate(-14 4)"><Mochi /></g><g transform="translate(16 0)"><Mochi color="#F9D3DE" /></g></g>;
    if (o === 'pudding') el = <g><path d="M-26 22 L-18 -14 H18 L26 22Z" fill="#F2C452" /><path d="M-18 -14 H18 L16 -6 H-16Z" fill="#7A3A10" /><ellipse cy="-14" rx="18" ry="5" fill="#8A4A1A" /><ellipse cx="-6" cy="-15" rx="6" ry="1.6" fill="#fff" opacity=".5" /></g>;
    if (o === 'custard') el = <g><path d="M-30 14 C-34 -6 -14 -18 0 -14 C16 -20 34 -6 30 14Z" fill="#F6D873" /><ellipse cx="-6" cy="-8" rx="10" ry="3" fill="#fff" opacity=".5" /></g>;
    if (o === 'crumbs') el = <g>{Array.from({ length: 18 }).map((_, k) => <circle key={k} cx={(k * 13) % 50 - 25} cy={(k * 7) % 20 - 10} r={2 + (k % 3)} fill={k % 2 ? '#A9764B' : '#6E4428'} />)}</g>;
    parts.push(<g key={`o${o}`} transform={`translate(${x} ${y})`}>{el}</g>);
  });
  // creams
  creams.forEach((c, i) => {
    const col = CREPE_CREAMS.find((x) => x.id === c)?.color || '#FFFDF6';
    parts.push(<g key={c} transform={`translate(${cx - spread * 0.42 + i * 30} ${cy - 6 - i * 6})`}><WhippedCream w={92 - i * 8} color={col} color2={shade(col, -0.1)} tiers={3} /></g>);
  });
  // fruit fan
  fruits.forEach((f, i) => {
    const x = cx + spread * (0.05 + i * 0.22);
    const y = cy - 10 - i * 4;
    const rot = -25 + i * 18;
    let el: ReactNode = null;
    if (f === 'fruit-strawberry') el = <g><g transform="rotate(-15) translate(-18 0)"><StrawberryHalf s={0.95} /></g><g transform="rotate(10) translate(14 4)"><StrawberryHalf s={0.95} /></g><g transform="translate(-2 -26)"><Strawberry s={0.75} /></g></g>;
    if (f === 'fruit-banana') el = <g><g transform="translate(-14 0) scale(.85 .55)"><BananaSlice /></g><g transform="translate(14 -10) scale(.85 .55)"><BananaSlice /></g></g>;
    if (f === 'fruit-kiwi') el = <g transform="scale(.8 .9)"><KiwiSlice /></g>;
    if (f === 'fruit-peach') el = <g><g transform="rotate(-60)"><PeachSlice /></g><g transform="translate(16 2) rotate(-40)"><PeachSlice /></g></g>;
    parts.push(<g key={f} transform={`translate(${x} ${y}) rotate(${rot})`}>{el}</g>);
  });
  return <>{parts}</>;
}

export function Toppings({ d, cx, cy, spread }: { d: CrepeData; cx: number; cy: number; spread: number }) {
  return (
    <>
      {d.sauces.map((s, i) => {
        const col = CREPE_SAUCES.find((x) => x.id === s)?.color || '#3B1E10';
        return <g key={s} transform={`translate(${cx + (i % 2 ? 10 : -6)} ${cy - 38 + i * 14})`}><Drizzle w={spread * 1.7} color={col} seed={i + 3} drips={4} thick={5} /></g>;
      })}
      {d.toppings.includes('whipped') && <g transform={`translate(${cx + spread * 0.55} ${cy - 30})`}><WhippedCream w={64} tiers={3} /></g>}
      {d.toppings.includes('sprinkles') && <g transform={`translate(${cx} ${cy - 46})`}><Sprinkles w={spread * 1.4} h={40} count={34} /></g>}
      {d.toppings.includes('minicookies') && <><g transform={`translate(${cx - spread * 0.65} ${cy - 40}) rotate(-30)`}><Cookie s={0.6} /></g><g transform={`translate(${cx + spread * 0.3} ${cy - 66}) rotate(20)`}><Cookie s={0.5} /></g></>}
      {d.toppings.includes('cherries') && <><g transform={`translate(${cx - spread * 0.3} ${cy - 92})`}><Cherry s={0.8} /></g><g transform={`translate(${cx + spread * 0.65} ${cy - 76}) rotate(15)`}><Cherry s={0.7} /></g></>}
    </>
  );
}

function Wrapper({ d, path, labelX, labelY }: { d: CrepeData; path: string; labelX: number; labelY: number }) {
  const uid = useId().replace(/:/g, '');
  const url = useAssets((s) => (d.wrapperAsset ? s.urls[d.wrapperAsset] : undefined));
  const w = WRAPPERS.find((x) => x.id === d.wrapper) || WRAPPERS[0];
  let fill = 'url(#yc-ging-pink)';
  if (w.id === 'cream') fill = 'url(#yc-kraft)';
  if (w.id === 'matcha') fill = 'url(#yc-ging-green)';
  if (w.id === 'floral') fill = 'url(#yc-floral)';
  return (
    <g>
      {w.id === 'custom' && url && (
        <defs>
          <pattern id={`wp-${uid}`} patternUnits="userSpaceOnUse" x="110" y="320" width="200" height="200">
            <image href={url} width="200" height="200" preserveAspectRatio="xMidYMid slice" />
          </pattern>
        </defs>
      )}
      <path d={path} fill={w.id === 'custom' ? (url ? `url(#wp-${uid})` : '#F7B8C8') : fill} />
      <path d={path} fill="url(#yc-vol)" opacity=".7" />
      <path d={path} fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="2" />
      {w.id !== 'custom' && (
        <g transform={`translate(${labelX} ${labelY})`}>
          <ellipse rx="56" ry="34" fill="#fff" stroke={w.color} strokeWidth="3" />
          <ellipse rx="49" ry="27" fill="none" stroke={w.color} strokeWidth="1.2" strokeDasharray="3 3" />
          <text y="-6" textAnchor="middle" fontFamily='"Mochiy Pop One", Mali, sans-serif' fontSize="14" fill={w.color}>YUMI</text>
          <text y="13" textAnchor="middle" fontFamily='"Zen Maru Gothic", Mali, sans-serif' fontWeight="700" fontSize="12" fill={shade(w.color!, -0.2)} letterSpacing="2">CRÊPES</text>
        </g>
      )}
    </g>
  );
}

export function CrepeArt({ d, animate = false }: { d: CrepeData; animate?: boolean }) {
  const c = crepeColors(d.batter, Math.max(0.8, d.cookLevel), true);
  const sheetFill = (path: string, light = 0) => (
    <g>
      <path d={path} fill={shade(c.base, light)} />
      <path d={path} fill={c.lace} filter="url(#yc-lace)" opacity=".8" />
    </g>
  );
  const enter = animate ? { initial: { scale: 0.85, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: 'spring' as const, stiffness: 140, damping: 14 } } : {};

  if (d.fold === 'half' || d.fold === 'roll') {
    return (
      <motion.g {...enter} style={{ transformOrigin: '200px 380px' }}>
        <ellipse cx="200" cy="420" rx="186" ry="44" fill="url(#yc-floor-shadow)" />
        <ellipse cx="200" cy="400" rx="180" ry="52" fill="url(#yc-ceramic)" stroke="#E0D6C8" strokeWidth="2" />
        <ellipse cx="200" cy="398" rx="140" ry="36" fill="#F7F2EA" />
        <ellipse cx="200" cy="400" rx="180" ry="52" fill="none" stroke="#F7B8C8" strokeWidth="3" strokeDasharray="5 6" />
        {d.fold === 'half' ? (
          <g>
            {sheetFill('M60 392 Q60 252 200 248 Q340 252 340 392 Q200 404 60 392Z', -0.06)}
            <g clipPath="none"><Fillings d={d} cx={200} cy={372} spread={120} /></g>
            {sheetFill('M66 376 Q66 270 200 266 Q334 270 334 376 Q270 360 200 372 Q130 384 66 376Z', 0.05)}
            <path d="M66 376 Q130 384 200 372 Q270 360 334 376" stroke={shade(c.base, -0.15)} strokeWidth="3" fill="none" />
            <path d="M110 300 Q200 280 290 300" stroke="#fff" strokeOpacity=".3" strokeWidth="6" fill="none" strokeLinecap="round" />
            <Toppings d={d} cx={200} cy={322} spread={90} />
          </g>
        ) : (
          <g>
            {sheetFill('M110 330 H300 Q330 330 330 370 Q330 410 300 410 H110Z', 0.02)}
            <path d="M120 342 H300 M120 398 H300" stroke={shade(c.base, -0.12)} strokeWidth="2" opacity=".5" />
            <g transform="translate(110 370)">
              <ellipse rx="40" ry="42" fill={shade(c.base, -0.05)} />
              <ellipse rx="34" ry="36" fill={CREPE_CREAMS.find((x) => d.fillings.includes(x.id))?.color || '#FFFDF6'} />
              <path d="M0 0 m-4 0 a4 4 0 1 1 8 0 a10 10 0 1 1 -20 0 a16 16 0 1 1 32 0 a22 22 0 1 1 -44 0 a28 28 0 1 1 56 0" stroke={shade(c.base, -0.1)} strokeWidth="3.5" fill="none" />
              {d.fillings.includes('fruit-strawberry') && <g transform="translate(10 -10) scale(.4)"><StrawberryHalf /></g>}
              {d.fillings.includes('fruit-kiwi') && <g transform="translate(-12 12) scale(.35)"><KiwiSlice /></g>}
              {d.fillings.includes('fruit-banana') && <g transform="translate(14 14) scale(.35)"><BananaSlice /></g>}
            </g>
            <Toppings d={d} cx={225} cy={348} spread={80} />
          </g>
        )}
      </motion.g>
    );
  }

  // Japanese cone crêpe
  const back = 'M92 236 C84 172 128 132 202 128 C278 126 318 168 310 230 L206 506Z';
  const front = 'M86 232 C140 252 236 292 316 262 C306 330 250 420 206 506 C164 430 112 330 86 232Z';
  const wrap = 'M122 318 Q160 304 200 316 Q240 304 284 318 L206 512Z';
  return (
    <motion.g {...enter} style={{ transformOrigin: '200px 420px' }}>
      <ellipse cx="206" cy="512" rx="60" ry="10" fill="url(#yc-floor-shadow)" />
      {sheetFill(back, -0.08)}
      <path d="M100 210 C120 160 170 140 202 138" stroke="#fff" strokeOpacity=".25" strokeWidth="5" fill="none" strokeLinecap="round" />
      <Fillings d={d} cx={200} cy={232} spread={92} />
      {sheetFill(front, 0.06)}
      <path d="M86 232 C140 252 236 292 316 262" stroke={shade(c.base, -0.2)} strokeWidth="3" fill="none" />
      <path d="M96 246 C146 266 230 300 300 280" stroke="#fff" strokeOpacity=".35" strokeWidth="4" fill="none" />
      <path d="M150 300 Q190 380 206 470" stroke={shade(c.base, -0.15)} strokeWidth="2" fill="none" opacity=".6" />
      <Toppings d={d} cx={200} cy={226} spread={92} />
      <Wrapper d={d} path={wrap} labelX={204} labelY={372} />
      <path d="M122 318 Q160 304 200 316 Q240 304 284 318" stroke="#fff" strokeWidth="3" fill="none" />
    </motion.g>
  );
}

/** Open crêpe lying on a plate, used while filling & decorating */
export function FlatCrepe({ d }: { d: CrepeData }) {
  const c = crepeColors(d.batter, Math.max(0.8, d.cookLevel), true);
  return (
    <g>
      <ellipse cx="200" cy="350" rx="196" ry="70" fill="url(#yc-floor-shadow)" />
      <ellipse cx="200" cy="330" rx="190" ry="78" fill="url(#yc-ceramic)" stroke="#E0D6C8" strokeWidth="2" />
      <ellipse cx="200" cy="330" rx="190" ry="78" fill="none" stroke="#F7B8C8" strokeWidth="3" strokeDasharray="5 6" />
      <g filter="url(#yc-rough)">
        <ellipse cx="200" cy="322" rx="176" ry="68" fill={c.base} />
      </g>
      <ellipse cx="200" cy="322" rx="176" ry="68" fill={c.lace} filter="url(#yc-lace)" opacity=".8" />
      <ellipse cx="160" cy="300" rx="80" ry="18" fill="#fff" opacity=".12" />
      <Fillings d={d} cx={200} cy={334} spread={110} />
      <Toppings d={d} cx={200} cy={328} spread={110} />
    </g>
  );
}
