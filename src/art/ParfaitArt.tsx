import { useId, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { ParfaitData, ParfaitLayer, ParfaitTop } from '../types';
import { creamColor, iceCream, layerOpt, SAUCES } from '../data/catalog';
import { CX, Glass, bottomY, parfaitGlass, rimY, widthAt } from './glass';
import { Drizzle, KiwiSlice, MangoCube, RedBean, Scoop, StrawberryHalf, WhippedCream } from './food';
import { hashStr, rng, shade } from '../utils/misc';

function wavyRegion(yTop: number, yBot: number, seed: number, amp = 5) {
  const r = rng(seed);
  const x0 = CX - 150, x1 = CX + 150;
  let d = `M${x0} ${yBot + 6} L${x0} ${yTop}`;
  const n = 7;
  for (let i = 1; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    d += ` Q${x - (x1 - x0) / n / 2} ${yTop + (r() - 0.5) * amp * 2.4} ${x} ${yTop + (r() - 0.5) * amp}`;
  }
  return d + ` L${x1} ${yBot + 6}Z`;
}

export function layerHeights(layers: ParfaitLayer[], top: number, bot: number) {
  const cap = bot - top - 6;
  const sum = layers.reduce((s, l) => s + layerOpt(l.kind).h, 0);
  const k = sum > cap ? cap / sum : 1;
  let y = bot + 6;
  return layers.map((l) => {
    const h = layerOpt(l.kind).h * k;
    const yb = y;
    y -= h;
    return { layer: l, yTop: y, yBot: yb, h };
  });
}

function LayerFill({ kind, yTop, yBot, seed, g }: { kind: string; yTop: number; yBot: number; seed: number; g: ReturnType<typeof parfaitGlass> }) {
  const o = layerOpt(kind);
  const r = rng(seed);
  const region = wavyRegion(yTop, yBot, seed, kind.startsWith('sauce') ? 3 : 6);
  const mid = (yTop + yBot) / 2;
  const w = widthAt(g, mid);
  const scatter = (n: number, fn: (x: number, y: number, i: number) => ReactNode) =>
    Array.from({ length: n }).map((_, i) => {
      const y = yTop + 4 + r() * Math.max(2, yBot - yTop - 4);
      const x = CX + (r() - 0.5) * widthAt(g, y) * 2;
      return fn(x, y, i);
    });

  switch (kind) {
    case 'cornflakes':
      return (
        <g>
          <path d={region} fill="#D9A04A" />
          {scatter(46, (x, y, i) => (
            <path key={i} d="M-9 -3 Q-4 -9 6 -6 Q11 0 6 5 Q-3 8 -9 -3Z" fill={i % 3 ? '#EDBB5E' : '#C98B2E'} stroke="#B87A22" strokeWidth=".6" transform={`translate(${x} ${y}) rotate(${r() * 360}) scale(${0.9 + r() * 0.7})`} />
          ))}
        </g>
      );
    case 'granola':
      return (
        <g>
          <path d={region} fill="#8D5F33" />
          {scatter(40, (x, y, i) => <ellipse key={i} cx={x} cy={y} rx={4 + r() * 6} ry={3 + r() * 4} fill={i % 2 ? '#C8955B' : '#A97446'} transform={`rotate(${r() * 180} ${x} ${y})`} />)}
          {scatter(16, (x, y, i) => <ellipse key={`o${i}`} cx={x} cy={y} rx="5" ry="2.5" fill="#F1DDB4" transform={`rotate(${r() * 180} ${x} ${y})`} />)}
        </g>
      );
    case 'crumbs':
      return (
        <g>
          <path d={region} fill="#7A4E2E" />
          {scatter(70, (x, y, i) => <circle key={i} cx={x} cy={y} r={1.5 + r() * 3.5} fill={i % 3 ? '#B07A4E' : '#5E3A1E'} />)}
        </g>
      );
    case 'jelly-matcha':
    case 'jelly-coffee':
    case 'jelly-strawberry':
      return (
        <g>
          <path d={region} fill={o.color} opacity=".88" />
          {scatter(9, (x, y, i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r() * 40 - 20})`}>
              <rect x="-13" y="-11" width="26" height="22" rx="4" fill={shade(o.color!, 0.08)} stroke={shade(o.color!, 0.3)} strokeWidth="1" opacity=".9" />
              <rect x="-9" y="-8" width="9" height="4" rx="2" fill="#fff" opacity=".45" />
            </g>
          ))}
        </g>
      );
    case 'fruit-strawberry':
      return (
        <g>
          <path d={region} fill="#FFF6EE" />
          {Array.from({ length: Math.max(2, Math.round((w * 2) / 46)) }).map((_, i, arr) => {
            const x = CX - w + 24 + (i * (w * 2 - 48)) / Math.max(1, arr.length - 1);
            return <g key={i} transform={`translate(${x} ${mid + 2}) rotate(${(r() - 0.5) * 30}) scale(.78)`}><StrawberryHalf /></g>;
          })}
        </g>
      );
    case 'fruit-mango':
      return (
        <g>
          <path d={region} fill="#F7B53A" />
          {scatter(12, (x, y, i) => <g key={i} transform={`translate(${x} ${y}) scale(.8) rotate(${r() * 30})`}><MangoCube /></g>)}
        </g>
      );
    case 'fruit-kiwi':
      return (
        <g>
          <path d={region} fill="#FFFDF6" />
          {Array.from({ length: Math.max(2, Math.round((w * 2) / 52)) }).map((_, i, arr) => {
            const x = CX - w + 26 + (i * (w * 2 - 52)) / Math.max(1, arr.length - 1);
            return <g key={i} transform={`translate(${x} ${mid}) scale(.78 .74)`}><KiwiSlice /></g>;
          })}
        </g>
      );
    case 'cream':
    case 'cream-matcha':
      return (
        <g>
          <path d={region} fill={o.color} />
          {scatter(6, (x, y, i) => <path key={i} d={`M${x - 20} ${y} q10 -8 20 0 t20 0`} stroke={kind === 'cream' ? '#EFE6D2' : '#B5C784'} strokeWidth="2" fill="none" opacity=".7" />)}
        </g>
      );
    case 'redbean':
      return (
        <g>
          <path d={region} fill="#3E1818" />
          {scatter(26, (x, y, i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r() * 180})`}><ellipse rx="6" ry="4.4" fill="#6A2222" /><ellipse cx="-2" cy="-1.5" rx="2.2" ry="1" fill="#fff" opacity=".5" /></g>
          ))}
        </g>
      );
    case 'kinako':
      return (
        <g>
          <path d={region} fill="#D9B77A" />
          {scatter(60, (x, y, i) => <circle key={i} cx={x} cy={y} r={0.8 + r() * 1.4} fill={i % 2 ? '#E9CC92' : '#B89458'} />)}
          <path d={wavyRegion(yBot - 6, yBot, seed + 1, 3)} fill="#3A1E0E" opacity=".75" />
        </g>
      );
    case 'sauce-choco':
    case 'sauce-berry':
      return (
        <g>
          <path d={region} fill={o.color} />
          {scatter(5, (x, _y, i) => <path key={i} d={`M${x} ${yBot} q-2 ${10 + r() * 14} 0 ${18 + r() * 12}`} stroke={o.color} strokeWidth="5" strokeLinecap="round" />)}
          <path d={`M${CX - w} ${yTop + 4} Q${CX} ${yTop - 2} ${CX + w} ${yTop + 4}`} stroke="#fff" strokeOpacity=".35" strokeWidth="2" fill="none" />
        </g>
      );
    default: {
      // ice cream layers
      const ic = iceCream(kind.replace('ice-', ''));
      return (
        <g>
          <g filter="url(#yc-scoop)"><path d={region} fill={ic.color} /></g>
          <path d={wavyRegion(yTop + 4, yTop + 10, seed + 3, 6)} fill={shade(ic.color!, 0.25)} opacity=".6" />
          {kind === 'ice-strawberry' && scatter(6, (x, y, i) => <circle key={i} cx={x} cy={y} r="3" fill="#E8607E" opacity=".6" />)}
          {kind === 'ice-chocolate' && scatter(10, (x, y, i) => <rect key={i} x={x} y={y} width="4" height="2.5" fill="#3B1E10" />)}
        </g>
      );
    }
  }
}

export function ParfaitArt({ d, animate = false, pipingPreview }: { d: ParfaitData; animate?: boolean; pipingPreview?: ParfaitTop | null }) {
  const uid = useId().replace(/:/g, '');
  const g = parfaitGlass(d.glass);
  const top = rimY(g);
  const bot = bottomY(g);
  const stack = layerHeights(d.layers, top, bot);
  const sauce = SAUCES.find((s) => s.id === d.sauce);
  const topItems = pipingPreview ? [...d.top, pipingPreview] : d.top;
  const minY = topItems.length ? Math.min(...topItems.map((t) => t.y - t.size * 0.6)) : top;

  return (
    <g>
      <Glass
        glass={g}
        clipId={`pc-${uid}`}
        contents={
          <g>
            {stack.map(({ layer, yTop, yBot }) => (
              <motion.g key={layer.id} initial={animate ? { y: -260, opacity: 0 } : false} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 110, damping: 15 }}>
                <LayerFill kind={layer.kind} yTop={yTop} yBot={yBot} seed={hashStr(layer.id) % 9999} g={g} />
              </motion.g>
            ))}
          </g>
        }
      />
      {topItems.map((t) => (
        <motion.g key={t.id} initial={animate ? (t.type === 'scoop' ? { y: -220, opacity: 0 } : { scale: 0.2, opacity: 0 }) : false}
          animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 150, damping: 12 }} style={{ transformOrigin: `${t.x}px ${t.y}px` }}>
          <g transform={`translate(${t.x} ${t.y})`}>
            {t.type === 'scoop'
              ? <Scoop r={t.size} color={iceCream(t.flavor).color!} color2={iceCream(t.flavor).color2!} animal={t.animal} />
              : <WhippedCream w={t.size * 1.6} color={creamColor(t.flavor).color} color2={creamColor(t.flavor).color2} tiers={3} />}
          </g>
        </motion.g>
      ))}
      {sauce && sauce.id !== 'none' && topItems.length > 0 && (
        <motion.g initial={animate ? { opacity: 0, y: -20 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <g transform={`translate(${CX} ${minY + 26})`}>
            <Drizzle w={Math.min(200, widthAt(g, top) * 2)} color={sauce.color!} seed={7} drips={5} thick={6} />
          </g>
          <g transform={`translate(${CX + 8} ${minY + 52})`}>
            <Drizzle w={Math.min(160, widthAt(g, top) * 1.5)} color={sauce.color!} seed={13} drips={3} thick={5} />
          </g>
        </motion.g>
      )}
      {d.layers.some((l) => l.kind === 'redbean') && topItems.length === 0 && <g transform={`translate(${CX} ${top})`}><RedBean s={0.8} /></g>}
    </g>
  );
}
