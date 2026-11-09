import { useId, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { DrinkData } from '../types';
import { BASES, FLAVORS, FRUIT_PULP, iceCream } from '../data/catalog';
import { CX, GLASSES, Glass, bottomY, rimY, widthAt } from './glass';
import { Cherry, Cookie, Drizzle, Mint, Scoop, Sprinkles, Strawberry, StrawberryHalf, WhippedCream } from './food';
import { mix, rng, shade, weightedMix } from '../utils/misc';
import { useAssets } from '../store/assetStore';

const color = (list: { id: string; color?: string }[], id: string, fb = '#ffffff') => list.find((x) => x.id === id)?.color || fb;
const CLEAR = ['soda'];
const TRANSLUCENT = ['soda', 'blacktea', 'juice'];

export function liquidInfo(d: DrinkData) {
  const g = GLASSES[d.glass] || GLASSES.tall;
  const top = rimY(g);
  const bot = bottomY(g);
  const hasFlavor = d.flavor !== 'none' && d.flavorAmount > 0;
  const total = (d.base ? d.baseAmount : 0) + (hasFlavor ? d.flavorAmount : 0);
  const f = d.base || hasFlavor ? 0.2 + 0.7 * Math.min(1, total / 120) : 0;
  const liquidTop = bot - (bot - top - 16) * f;
  return { g, top, bot, total, liquidTop, hasFlavor };
}

export function DrinkArt({ d, animate = false, stirring = false }: { d: DrinkData; animate?: boolean; stirring?: boolean }) {
  const uidRaw = useId().replace(/:/g, '');
  const { g, top, bot, liquidTop, hasFlavor, total } = liquidInfo(d);
  const labelUrl = useAssets((s) => (d.labelAsset ? s.urls[d.labelAsset] : undefined));
  const r = rng(7);

  const baseC = d.base ? color(BASES, d.base) : '#ffffff';
  const flavC = hasFlavor ? color(FLAVORS, d.flavor) : baseC;
  const latte = d.base === 'matcha' || d.base === 'hojicha';
  const isClear = CLEAR.includes(d.base);

  // ---- segments bottom → top
  const segs: { c: string; w: number }[] = [];
  if (hasFlavor) segs.push({ c: flavC, w: d.flavorAmount });
  if (d.base) {
    if (latte) {
      segs.push({ c: '#FBF6EC', w: d.baseAmount * 0.5 });
      segs.push({ c: baseC, w: d.baseAmount * 0.5 });
    } else segs.push({ c: isClear ? (hasFlavor ? mix(flavC, '#F4FBFD', 0.55) : '#EAF6FB') : baseC, w: d.baseAmount });
  }
  const blended = isClear
    ? hasFlavor ? mix(flavC, '#F2FAFC', 0.18) : '#EAF6FB'
    : weightedMix(segs.map((s) => ({ color: s.c, w: s.w * (s.c === flavC && hasFlavor ? 1.4 : 1) })));
  const m = Math.max(0, Math.min(1, d.mixed));
  const gradId = `liq-${uidRaw}`;
  const totalW = segs.reduce((s, x) => s + x.w, 0) || 1;
  const stops: ReactNode[] = [];
  let acc = 0;
  const soft = 0.012 + m * 0.35;
  // gradient goes top (0) → bottom (1); iterate segments from top
  const fromTop = [...segs].reverse();
  fromTop.forEach((s, i) => {
    const c = mix(s.c, blended, m);
    const start = acc / totalW;
    acc += s.w;
    const end = acc / totalW;
    stops.push(<stop key={`a${i}`} offset={Math.min(1, i === 0 ? 0 : start + soft)} stopColor={c} />);
    stops.push(<stop key={`b${i}`} offset={Math.max(0, i === fromTop.length - 1 ? 1 : end - soft)} stopColor={c} />);
  });
  const liquidOpacity = isClear ? (hasFlavor ? 0.86 : 0.42) : TRANSLUCENT.includes(d.base) ? 0.9 : 1;
  const topColor = mix(fromTop[0]?.c || blended, blended, m);
  const hw = widthAt(g, liquidTop);
  const topHW = widthAt(g, top);

  // ---- ice pieces
  const ice: ReactNode[] = [];
  if (d.ice !== 'none' && total > 0) {
    const rr = rng(21);
    const n = d.ice === 'crushed' ? 26 : Math.max(1, Math.min(8, d.iceCount));
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / 3);
      const y = liquidTop + 6 + row * (d.ice === 'crushed' ? 14 : 30) + rr() * 10 - (i % 3 === 1 ? 10 : 0);
      const w = widthAt(g, y) * 0.72;
      const x = CX + (((i % 3) - 1) * w * 0.62) + (rr() - 0.5) * 16;
      const rot = (rr() - 0.5) * 50;
      const s = d.ice === 'crushed' ? 0.4 + rr() * 0.35 : 0.9 + rr() * 0.25;
      ice.push(
        <motion.g key={`${d.ice}-${i}`} initial={animate ? { y: -340, opacity: 0 } : false} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 12, delay: animate ? i * 0.06 : 0 }}>
          <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><IceShape kind={d.ice} /></g>
        </motion.g>
      );
    }
  }

  // ---- contents (clipped to the bowl)
  const contents = total > 0 ? (
    <g>
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">{stops}</linearGradient>
      </defs>
      <motion.g initial={animate ? { y: 120 } : false} animate={{ y: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }}>
        <rect x={CX - 140} y={liquidTop} width="280" height={bot - liquidTop + 30} fill={`url(#${gradId})`} opacity={liquidOpacity} />
        {/* fruit pulp */}
        {hasFlavor && FRUIT_PULP.includes(d.flavor) && !isClear && Array.from({ length: 16 }).map((_, i) => {
          const yb = bot - 4 - r() * ((bot - liquidTop) * (d.flavorAmount / (totalW || 1)));
          const y = yb - m * r() * (bot - liquidTop) * 0.6;
          const x = CX + (r() - 0.5) * widthAt(g, y) * 1.6;
          return <path key={i} d="M-5 -3 Q0 -7 5 -2 Q7 3 1 5 Q-6 4 -5 -3Z" fill={shade(flavC, -0.15)} opacity=".85" transform={`translate(${x} ${y}) rotate(${r() * 180}) scale(${0.8 + r() * 0.9})`} />;
        })}
        {/* boba */}
        {d.toppings.includes('boba') && Array.from({ length: 16 }).map((_, i) => {
          const y = bot - 8 - Math.floor(i / 6) * 13 - r() * 4;
          const x = CX + ((i % 6) - 2.5) * (widthAt(g, y) / 3.4) + (r() - 0.5) * 6;
          return <g key={i} transform={`translate(${x} ${y})`}><circle r="7.5" fill="#2A1A12" /><circle r="7.5" fill="#6A4A3A" opacity=".35" /><circle cx="-2.5" cy="-2.5" r="2" fill="#fff" opacity=".6" /></g>;
        })}
        {/* jelly */}
        {d.toppings.includes('jelly') && Array.from({ length: 5 }).map((_, i) => {
          const y = liquidTop + 50 + r() * Math.max(10, bot - liquidTop - 80);
          const x = CX + (r() - 0.5) * widthAt(g, y) * 1.1;
          const jc = hasFlavor ? shade(flavC, 0.1) : '#F27D9B';
          return <g key={i} transform={`translate(${x} ${y}) rotate(${r() * 60})`}><rect x="-11" y="-11" width="22" height="22" rx="4" fill={jc} opacity=".65" /><rect x="-7" y="-8" width="6" height="4" rx="2" fill="#fff" opacity=".7" /></g>;
        })}
        {/* soda bubbles */}
        {(isClear || d.base === 'juice') && Array.from({ length: 22 }).map((_, i) => {
          const x = CX + (r() - 0.5) * hw * 1.7;
          const y = bot - 6 - r() * 20;
          const rise = -(y - liquidTop - 4);
          return <circle key={i} className="anim-bubble" cx={x} cy={y} r={1.2 + r() * 2.2} fill="none" stroke="#fff" strokeWidth="1" opacity=".8"
            style={{ animationDuration: `${2 + r() * 3}s`, animationDelay: `${-r() * 4}s`, ['--rise' as any]: `${rise}px` }} />;
        })}
        {/* stirring swirl */}
        {stirring && <g opacity=".5">{[0, 1, 2].map((i) => <ellipse key={i} className="anim-swirl" cx={CX} cy={liquidTop + 60 + i * 50} rx={hw * 0.7} ry="14" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="30 40" style={{ animationDuration: `${1 + i * 0.4}s` }} />)}</g>}
        {/* surface */}
        <ellipse cx={CX} cy={liquidTop} rx={hw - 2} ry="7" fill={shade(topColor, 0.18)} opacity={liquidOpacity} />
        <ellipse cx={CX - hw * 0.3} cy={liquidTop - 1} rx={hw * 0.4} ry="2.4" fill="#fff" opacity=".5" />
        {ice}
        {d.toppings.includes('marshmallow') && [-0.4, 0.1, 0.5].map((t, i) => (
          <g key={i} transform={`translate(${CX + t * hw} ${liquidTop - 4}) rotate(${(i - 1) * 20})`}>
            <rect x="-13" y="-11" width="26" height="22" rx="8" fill={['#FDE2EA', '#FFFFFF', '#E2F1F8'][i]} />
            <ellipse cy="-9" rx="12" ry="4" fill="#fff" />
          </g>
        ))}
      </motion.g>
    </g>
  ) : null;

  // ---- straw
  const strawTop = { x: CX + topHW * 0.55, y: top - 130 };
  const strawBot = { x: CX - 6, y: bot - 14 };
  const straw = d.straw !== 'none' ? <Straw kind={d.straw} a={strawBot} b={strawTop} /> : null;

  // ---- top stack
  const ic = d.iceCream ? iceCream(d.iceCream) : null;
  const scoopR = Math.min(64, topHW * 0.9);
  const creamY = top + 2;
  const scoopY = d.cream ? top - 40 : top - scoopR * 0.08;
  let peak = top + 10;
  if (d.cream) peak = top - topHW * 0.9;
  if (ic) peak = Math.min(peak, scoopY - scoopR * 0.95);

  return (
    <g>
      <Glass
        glass={g}
        clipId={`clip-${uidRaw}`}
        behind={straw}
        contents={
          <>
            {contents}
            {straw && TRANSLUCENT.includes(d.base) && total > 0 && (
              <g opacity=".45" transform="translate(5 0)" clipPath={`url(#below-${uidRaw})`}>
                <defs><clipPath id={`below-${uidRaw}`}><rect x="0" y={liquidTop} width="400" height="400" /></clipPath></defs>
                <Straw kind={d.straw} a={strawBot} b={strawTop} />
              </g>
            )}
          </>
        }
      />
      {/* label */}
      {d.labelStyle !== 'none' && <Label d={d} g={g} url={labelUrl} />}
      {/* garnish on rim */}
      {d.garnish !== 'none' && <Garnish kind={d.garnish} x={CX - topHW + 6} y={top + 2} />}
      {d.cream && (
        <motion.g initial={animate ? { scale: 0, opacity: 0 } : false} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 14 }} style={{ transformOrigin: `${CX}px ${creamY}px` }}>
          <g transform={`translate(${CX} ${creamY})`}><WhippedCream w={topHW * 1.7} tiers={3} /></g>
        </motion.g>
      )}
      {d.toppings.includes('minicookie') && (
        <g transform={`translate(${CX - topHW * 0.55} ${top - 26}) rotate(-25)`}><Cookie s={0.7} /></g>
      )}
      {ic && (
        <motion.g initial={animate ? { y: -260, opacity: 0 } : false} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 140, damping: 11 }}>
          <g transform={`translate(${CX + (d.cream ? 6 : 0)} ${scoopY})`}><Scoop r={scoopR} color={ic.color!} color2={ic.color2!} /></g>
        </motion.g>
      )}
      {d.toppings.includes('strawberries') && (
        <>
          <g transform={`translate(${CX + topHW - 4} ${top - 12}) rotate(18)`}><StrawberryHalf s={0.75} /></g>
          {(d.cream || ic) && <g transform={`translate(${CX - 22} ${peak + 18}) rotate(-15)`}><Strawberry s={0.55} /></g>}
        </>
      )}
      {d.toppings.includes('sprinkles') && (d.cream || ic) && <g transform={`translate(${CX} ${peak + 26})`}><Sprinkles w={topHW * 1.1} h={30} count={26} /></g>}
      {d.toppings.includes('cherry') && (
        <motion.g initial={animate ? { y: -220 } : false} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 9, delay: animate ? 0.25 : 0 }}>
          <g transform={`translate(${CX + 4} ${peak - 4})`}><Cherry s={0.85} /></g>
        </motion.g>
      )}
      {(d.toppings.includes('strawberries') && !d.cream && !ic && d.flavor === 'strawberry') && <g transform={`translate(${CX} ${top - 30})`}><Drizzle w={10} color="#C8102E" drips={0} /></g>}
    </g>
  );
}

function IceShape({ kind }: { kind: string }) {
  const fill = { fill: '#FFFFFF', fillOpacity: 0.38, stroke: '#FFFFFF', strokeOpacity: 0.9, strokeWidth: 1.6 };
  if (kind === 'heart')
    return (
      <g>
        <path d="M0 16 C-20 4 -22 -10 -12 -16 C-6 -19 -1 -15 0 -11 C1 -15 6 -19 12 -16 C22 -10 20 4 0 16Z" {...fill} />
        <path d="M-12 -10 C-10 -13 -6 -13 -4 -10" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    );
  if (kind === 'star')
    return (
      <g>
        <path d="M0 -18 L5 -6 L18 -5 L8 3 L11 16 L0 9 L-11 16 L-8 3 L-18 -5 L-5 -6Z" {...fill} strokeLinejoin="round" />
        <path d="M-3 -9 L0 -14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    );
  if (kind === 'crushed')
    return <path d="M-14 -6 L-4 -14 L10 -10 L14 2 L4 12 L-10 9Z" {...fill} strokeLinejoin="round" />;
  return (
    <g>
      <rect x="-17" y="-17" width="34" height="34" rx="6" {...fill} />
      <path d="M-12 -12 L12 -12 M-12 -12 L-12 12" stroke="#fff" strokeWidth="2" opacity=".85" />
      <rect x="-9" y="-9" width="14" height="10" rx="3" fill="#fff" opacity=".35" />
    </g>
  );
}

export function Straw({ kind, a, b }: { kind: string; a: { x: number; y: number }; b: { x: number; y: number } }) {
  const d = `M${a.x} ${a.y} L${b.x} ${b.y}`;
  switch (kind) {
    case 'pink':
      return <g><path d={d} stroke="#fff" strokeWidth="12" strokeLinecap="round" /><path d={d} stroke="#F28BA8" strokeWidth="12" strokeDasharray="7 9" /><path d={d} stroke="#000" strokeOpacity=".08" strokeWidth="12" transform="translate(2 0)" /></g>;
    case 'paper':
      return <g><path d={d} stroke="#8DB36B" strokeWidth="12" strokeLinecap="round" /><path d={d} stroke="#C8E0B0" strokeWidth="3" strokeDasharray="10 14" transform="translate(-2 0)" /></g>;
    case 'boba':
      return <g><path d={d} stroke="#F4E2B8" strokeOpacity=".75" strokeWidth="20" strokeLinecap="round" /><path d={d} stroke="#fff" strokeOpacity=".7" strokeWidth="4" transform="translate(-5 0)" /></g>;
    case 'bendy': {
      const k = { x: b.x - 6, y: b.y + 40 };
      const p = `M${a.x} ${a.y} L${k.x} ${k.y} Q${k.x + 4} ${b.y + 8} ${b.x + 34} ${b.y}`;
      return <g fill="none"><path d={p} stroke="#6BB6E0" strokeWidth="12" strokeLinecap="round" /><path d={`M${k.x - 3} ${k.y - 6} l8 -2 M${k.x - 2} ${k.y - 12} l8 -2 M${k.x - 1} ${k.y - 18} l8 -2`} stroke="#fff" strokeWidth="2" opacity=".7" /><path d={p} stroke="#fff" strokeOpacity=".45" strokeWidth="3" transform="translate(-3 0)" /></g>;
    }
    case 'glass':
      return <g><path d={d} stroke="#DDEFF5" strokeOpacity=".55" strokeWidth="11" strokeLinecap="round" /><path d={d} stroke="#fff" strokeWidth="2.5" transform="translate(-3 0)" /><path d={d} stroke="#fff" strokeOpacity=".6" strokeWidth="1.5" transform="translate(4 0)" /></g>;
    case 'heart':
      return (
        <g>
          <path d={d} stroke="#F7A7BE" strokeWidth="10" strokeLinecap="round" />
          <path d={d} stroke="#fff" strokeOpacity=".5" strokeWidth="3" transform="translate(-2 0)" />
          <g transform={`translate(${b.x} ${b.y - 6}) scale(.7)`}><path d="M0 26 C-30 6 -34 -14 -20 -24 C-10 -31 -2 -24 0 -18 C2 -24 10 -31 20 -24 C34 -14 30 6 0 26Z" fill="#F27D9B" /><ellipse cx="-12" cy="-12" rx="6" ry="4" fill="#fff" opacity=".7" /></g>
        </g>
      );
    default:
      return null;
  }
}

function Garnish({ kind, x, y }: { kind: string; x: number; y: number }) {
  switch (kind) {
    case 'lemon':
    case 'orange': {
      const c = kind === 'lemon' ? ['#F6D530', '#FBEA8A', '#FFF8D0'] : ['#F58A1F', '#FBB25A', '#FFE3BC'];
      return (
        <g transform={`translate(${x} ${y - 4}) rotate(-12)`}>
          <circle r="30" fill={c[0]} />
          <circle r="26" fill={c[2]} />
          {Array.from({ length: 10 }).map((_, i) => <path key={i} d="M0 0 L-5 -23 Q0 -25 5 -23Z" fill={c[1]} transform={`rotate(${i * 36})`} />)}
          <circle r="3" fill={c[2]} />
          <rect x="-3" y="0" width="6" height="32" fill="#fff" opacity="0" />
        </g>
      );
    }
    case 'strawberry':
      return <g transform={`translate(${x + 4} ${y - 8}) rotate(-20)`}><StrawberryHalf s={0.8} /></g>;
    case 'mint':
      return <g transform={`translate(${x + 30} ${y - 18})`}><Mint s={0.9} /></g>;
    case 'melon':
      return (
        <g transform={`translate(${x + 4} ${y - 6}) rotate(-25)`}>
          <path d="M-36 0 A36 30 0 0 0 36 0Z" fill="#9BC94F" />
          <path d="M-32 0 A32 25 0 0 0 32 0Z" fill="#D7EE8C" />
          <path d="M-36 0 A36 30 0 0 0 36 0" fill="none" stroke="#5E8A2E" strokeWidth="3" />
          {[-16, -6, 4, 14].map((sx) => <ellipse key={sx} cx={sx} cy="4" rx="1.5" ry="3" fill="#E9F5C8" />)}
        </g>
      );
    default:
      return null;
  }
}

function Label({ d, g, url }: { d: DrinkData; g: (typeof GLASSES)[string]; url?: string }) {
  const y = (rimY(g) + bottomY(g)) / 2 + 30;
  const w = Math.min(110, widthAt(g, y) * 1.25);
  const h = 54;
  const id = useId().replace(/:/g, '');
  if (d.labelStyle === 'photo') {
    if (!url) return null;
    return (
      <g transform={`translate(${CX} ${y})`}>
        <defs><clipPath id={`lb-${id}`}><rect x={-w / 2} y={-w / 2} width={w} height={w} rx="14" /></clipPath></defs>
        <rect x={-w / 2 - 4} y={-w / 2 - 4} width={w + 8} height={w + 8} rx="16" fill="#fff" opacity=".9" />
        <image href={url} x={-w / 2} y={-w / 2} width={w} height={w} preserveAspectRatio="xMidYMid slice" clipPath={`url(#lb-${id})`} />
        <rect x={-w / 2} y={-w / 2} width={w} height={w} rx="14" fill="url(#yc-glass-body)" opacity=".7" />
      </g>
    );
  }
  const bg = { kraft: '#D8B88E', pink: '#F7B8C8', matcha: '#B9CBA5', cream: '#FFF8ED' }[d.labelStyle] || '#fff';
  const fg = d.labelStyle === 'pink' ? '#7A2E43' : d.labelStyle === 'matcha' ? '#3E5A2A' : '#5E4535';
  return (
    <g transform={`translate(${CX} ${y})`} opacity=".96">
      {d.labelStyle === 'cream' ? <ellipse rx={w / 2} ry={h / 2} fill={bg} stroke="#E8869F" strokeWidth="2" strokeDasharray="4 3" />
        : d.labelStyle === 'matcha' ? <rect x={-widthAt(g, y) + 4} y={-h / 3} width={widthAt(g, y) * 2 - 8} height={(h * 2) / 3} fill={bg} />
          : <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={d.labelStyle === 'pink' ? h / 2 : 6} fill={bg} />}
      {d.labelStyle === 'kraft' && <circle cx={-w / 2 + 10} cy={-h / 2 + 10} r="3.5" fill="#fff" />}
      <text y="6" textAnchor="middle" fontFamily='"Mochiy Pop One", Mali, sans-serif' fontSize={Math.min(18, (w * 1.6) / Math.max(4, (d.labelText || '').length))} fill={fg}>{d.labelText || 'YUMI'}</text>
    </g>
  );
}
