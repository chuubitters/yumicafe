import type { ReactNode } from 'react';
import * as F from './food';
import * as S from './stickers';
import * as Fu from './furniture';
import type { StageItem } from '../types';

export interface SpriteDef {
  name: string;
  w: number; // natural width
  h: number; // natural height
  tintable?: boolean;
  sticker?: boolean; // die-cut white outline
  textual?: boolean; // supports item.text
  render: (it: Partial<StageItem>) => ReactNode;
}

const d = (name: string, w: number, h: number, render: SpriteDef['render'], extra: Partial<SpriteDef> = {}): SpriteDef => ({ name, w, h, render, ...extra });

export const SPRITES: Record<string, SpriteDef> = {
  // ---------- food / toppings ----------
  strawberry: d('Strawberry', 64, 74, () => <F.Strawberry />),
  'strawberry-half': d('Strawberry half', 64, 70, () => <F.StrawberryHalf />),
  cherry: d('Cherry', 44, 88, () => <g transform="translate(-4 -2)"><F.Cherry /></g>),
  kiwi: d('Kiwi', 64, 64, () => <F.KiwiSlice />),
  banana: d('Banana', 56, 54, () => <F.BananaSlice />),
  peach: d('Peach', 68, 42, () => <F.PeachSlice />),
  mango: d('Mango', 40, 44, () => <F.MangoCube />),
  mochi: d('Shiratama mochi', 42, 44, (it) => <F.Mochi color={it.tint || '#FFFFFF'} />, { tintable: true }),
  dango: d('Dango', 70, 110, () => <F.Dango />),
  redbean: d('Red bean', 56, 36, () => <F.RedBean />),
  wafer: d('Wafer', 48, 84, () => <F.Wafer />),
  'macaron-pink': d('Macaron', 56, 48, () => <F.Macaron color="#F7B8C8" />),
  'macaron-green': d('Matcha macaron', 56, 48, () => <F.Macaron color="#B9CBA5" />),
  cookie: d('Cookie', 58, 58, () => <F.Cookie />),
  pocky: d('Choco stick', 52, 104, () => <F.Pocky />),
  mint: d('Mint', 52, 52, () => <F.Mint />),
  blueberry: d('Blueberry', 30, 30, () => <F.Blueberry />),
  chestnut: d('Chestnut', 44, 50, () => <F.Chestnut />),
  cheesecake: d('Cheesecake', 74, 60, () => <F.Cheesecake />),
  brownie: d('Brownie', 50, 46, () => <F.Brownie />),
  // ---------- stickers ----------
  heart: d('Heart', 66, 60, (it) => <S.Heart c={it.tint} />, { sticker: true, tintable: true }),
  star: d('Star', 60, 58, (it) => <S.Star c={it.tint} />, { sticker: true, tintable: true }),
  sparkle: d('Sparkle', 64, 64, (it) => <S.Sparkle c={it.tint} />, { tintable: true }),
  bow: d('Bow', 82, 72, (it) => <g transform="translate(0 -4)"><S.Bow c={it.tint} /></g>, { sticker: true, tintable: true }),
  cloud: d('Cloud', 92, 44, () => <g transform="translate(0 4)"><S.Cloud /></g>, { sticker: true }),
  sakura: d('Sakura', 60, 60, (it) => <S.Sakura c={it.tint} />, { sticker: true, tintable: true }),
  'flower-yellow': d('Daisy', 62, 62, () => <S.FlowerYellow />, { sticker: true }),
  clover: d('Clover', 52, 62, () => <g transform="translate(0 -4)"><S.Clover /></g>, { sticker: true }),
  music: d('Music', 60, 64, () => <S.Music />, { sticker: true }),
  rainbow: d('Rainbow', 96, 48, () => <g transform="translate(0 8)"><S.Rainbow /></g>, { sticker: true }),
  'tag-new': d('NEW!', 70, 70, (it) => <S.Tag text={it.text || 'NEW!'} bg={it.tint || '#E8302E'} w={66} shape="circle" font={S.STICKER_FONTS.POP} />, { sticker: true, textual: true, tintable: true }),
  'tag-limited': d('期間限定', 46, 120, (it) => <S.Tag text={it.text || '期間限定'} bg={it.tint || '#7E9A63'} w={44} h={118} shape="vertical" />, { sticker: true, textual: true, tintable: true }),
  'tag-oishii': d('おいしい', 120, 56, (it) => <g transform="translate(0 -6)"><S.Tag text={it.text || 'おいしい♡'} bg={it.tint || '#F27D9B'} w={110} h={40} shape="bubble" /></g>, { sticker: true, textual: true, tintable: true }),
  'tag-price': d('Price tag', 120, 44, (it) => <S.Tag text={it.text || '¥480'} bg={it.tint || '#F6E5A9'} fg="#5E4535" w={118} h={42} shape="price" font={S.STICKER_FONTS.POP} />, { sticker: true, textual: true, tintable: true }),
  'tag-yummy': d('Yummy!', 120, 44, (it) => <S.Tag text={it.text || 'Yummy!'} bg={it.tint || '#C9E2EF'} fg="#35617A" w={118} h={42} font={S.STICKER_FONTS.POP} />, { sticker: true, textual: true, tintable: true }),
  'tag-love': d('LOVE', 100, 44, (it) => <S.Tag text={it.text || 'LOVE ♡'} bg={it.tint || '#F7B8C8'} fg="#7A2E43" w={98} h={42} font={S.STICKER_FONTS.POP} />, { sticker: true, textual: true, tintable: true }),
  'eyes-dot': d('Eyes', 60, 20, () => <S.Eyes kind="dot" />),
  'eyes-happy': d('Happy eyes', 60, 16, () => <S.Eyes kind="happy" />),
  'eyes-sparkle': d('Sparkle eyes', 62, 26, () => <S.Eyes kind="sparkle" />),
  'face-wink': d('Wink', 60, 18, () => <S.Eyes kind="wink" />),
  'mouth-smile': d('Smile', 30, 16, () => <g transform="translate(0 -2)"><S.Mouth kind="smile" /></g>),
  'mouth-cat': d('Cat mouth', 34, 14, () => <S.Mouth kind="cat" />),
  cheeks: d('Cheeks', 72, 16, () => <S.Cheeks />),
  'washi-pink': d('Washi tape', 124, 30, (it) => <S.Washi c={it.tint || '#F7B8C8'} />, { tintable: true }),
  'washi-green': d('Washi tape', 124, 30, (it) => <S.Washi c={it.tint || '#B9CBA5'} />, { tintable: true }),
  pearls: d('Sugar pearls', 46, 40, () => <S.Pearls />),
  'sprinkle-pile': d('Sprinkles', 60, 34, () => <F.Sprinkles w={56} h={28} count={26} />),
  'ribbon-long': d('Ribbon', 142, 36, (it) => <S.RibbonLong c={it.tint} />, { tintable: true }),
  candle: d('Candle', 24, 72, () => <g transform="translate(0 4)"><S.Candle /></g>),
  'leaf-maple': d('Maple leaf', 66, 62, (it) => <S.MapleLeaf c={it.tint} />, { sticker: true, tintable: true }),
  snowflake: d('Snowflake', 62, 62, () => <S.Snowflake />),
  nerikiri: d('Nerikiri', 72, 72, () => <S.Nerikiri />),
  taiyaki: d('Taiyaki', 86, 46, () => <S.Taiyaki />),
  dorayaki: d('Dorayaki', 70, 44, () => <S.Dorayaki />),
  'sakura-mochi': d('Sakura mochi', 72, 48, () => <S.SakuraMochi />),
  'ichigo-daifuku': d('Ichigo daifuku', 60, 56, () => <g transform="translate(0 2)"><S.Daifuku /></g>),
  'tag-kissaten': d('喫茶', 110, 44, (it) => <S.Tag text={it.text || '純喫茶'} bg={it.tint || '#5E4535'} fg="#F6E5A9" w={108} h={42} />, { sticker: true, textual: true, tintable: true }),
  'coffee-cup': d('Coffee cup', 86, 72, () => <S.CoffeeCup />),
  'cream-soda-icon': d('Cream soda', 48, 92, () => <g transform="translate(0 6)"><S.CreamSodaIcon /></g>),
  record: d('Record', 66, 66, () => <S.Record />),
  'tag-open': d('OPEN', 100, 44, (it) => <S.Tag text={it.text || 'OPEN'} bg={it.tint || '#7E9A63'} w={98} h={42} font={S.STICKER_FONTS.POP} />, { sticker: true, textual: true, tintable: true }),

  // ---------- café furniture ----------
  'f-counter': d('Counter', 548, 210, (it) => <Fu.Counter c={it.tint} />, { tintable: true }),
  'f-espresso': d('Espresso', 140, 130, (it) => <Fu.Espresso c={it.tint} />, { tintable: true }),
  'f-register': d('Register', 110, 100, (it) => <Fu.Register c={it.tint} />, { tintable: true }),
  'f-grinder': d('Grinder', 70, 100, () => <g transform="translate(0 12)"><Fu.Grinder /></g>),
  'f-luckycat': d('Lucky cat', 100, 112, () => <g transform="translate(0 4)"><Fu.LuckyCat /></g>),
  'f-cakestand': d('Cake dome', 124, 120, () => <g transform="translate(0 -2)"><Fu.CakeDome /></g>),
  'f-showcase': d('Showcase', 300, 230, (it) => <g transform="translate(0 -4)"><Fu.Showcase c={it.tint} /></g>, { tintable: true }),
  'f-cookiejar': d('Cookie jar', 92, 124, () => <Fu.CookieJar />),
  'f-stand': d('Tiered stand', 100, 150, () => <Fu.TieredStand />),
  'f-plate': d('Plate', 124, 42, (it) => <Fu.Plate c={it.tint} />, { tintable: true }),
  'f-shelf': d('Shelf', 250, 90, (it) => <g transform="translate(0 10)"><Fu.WallShelf c={it.tint} /></g>, { tintable: true }),
  'f-table': d('Table', 176, 210, (it) => <g transform="translate(0 -6)"><Fu.CafeTable c={it.tint} /></g>, { tintable: true }),
  'f-chair': d('Chair', 96, 210, (it) => <g transform="translate(0 -4)"><Fu.Chair c={it.tint} /></g>, { tintable: true }),
  'f-sofa': d('Sofa', 304, 160, (it) => <g transform="translate(0 -4)"><Fu.Sofa c={it.tint} /></g>, { tintable: true }),
  'f-cushion': d('Cushion', 96, 84, (it) => <Fu.Cushion c={it.tint} />, { tintable: true }),
  'f-plant': d('Plant', 150, 230, (it) => <g transform="translate(0 -10)"><Fu.Plant c={it.tint} /></g>, { tintable: true }),
  'f-floorlamp': d('Floor lamp', 80, 250, (it) => <Fu.FloorLamp c={it.tint} />, { tintable: true }),
  'f-jukebox': d('Jukebox', 140, 220, () => <g transform="translate(0 -6)"><Fu.Jukebox /></g>),
  'f-fishbowl': d('Kingyo bowl', 110, 104, () => <Fu.FishBowl />),
  'f-pendant': d('Pendant', 90, 160, (it) => <g transform="translate(0 40)"><Fu.Pendant c={it.tint} /></g>, { tintable: true }),
  'f-window': d('Window', 250, 260, (it) => <Fu.WindowArt season={it.text || 'spring'} />),
  'f-curtain': d('Curtains', 346, 316, (it) => <Fu.Curtains c={it.tint} />, { tintable: true }),
  'f-frame': d('Frame', 142, 114, (it) => <Fu.PictureFrame c={it.tint} />, { tintable: true }),
  'f-menuboard': d('Menu board', 202, 162, (it) => <Fu.MenuBoard text={it.text} />, { textual: true }),
  'f-clock': d('Clock', 90, 90, (it) => <Fu.Clock c={it.tint} />, { tintable: true }),
  'f-garland': d('String lights', 410, 80, () => <g transform="translate(0 -10)"><Fu.Garland /></g>),
  'f-rug': d('Rug', 322, 82, (it) => <Fu.Rug c={it.tint} />, { tintable: true }),
  'f-signboard': d('A-sign', 110, 200, (it) => <Fu.ASign text={it.text} />, { textual: true }),
  'f-flowerpot': d('Flower pot', 90, 130, (it) => <g transform="translate(0 -2)"><Fu.FlowerPot c={it.tint} /></g>, { tintable: true }),
  'f-planter': d('Planter', 204, 90, (it) => <g transform="translate(0 0)"><Fu.Planter c={it.tint} /></g>, { tintable: true }),
  'f-bench': d('Bench', 220, 104, (it) => <Fu.Bench c={it.tint} />, { tintable: true }),
  'f-lantern': d('Lantern', 90, 170, (it) => <Fu.Lantern c={it.tint} />, { tintable: true }),
  'f-noren': d('Noren', 304, 160, (it) => <Fu.Noren c={it.tint} text={it.text} />, { tintable: true, textual: true }),
  'f-bike': d('Bike', 230, 130, (it) => <g transform="translate(0 6)"><Fu.Bike c={it.tint} /></g>, { tintable: true }),
};

export function SpriteThumb({ id, size = 48, tint }: { id: string; size?: number; tint?: string }) {
  const s = SPRITES[id];
  if (!s) return null;
  const pad = Math.max(s.w, s.h) * 0.12;
  const vb = Math.max(s.w, s.h) + pad * 2;
  return (
    <svg width={size} height={size} viewBox={`${-vb / 2} ${-vb / 2} ${vb} ${vb}`} aria-hidden>
      <g filter={s.sticker ? 'url(#yc-sticker)' : undefined}>{s.render({ tint })}</g>
    </svg>
  );
}
