export type CreationType = 'drink' | 'parfait' | 'crepe' | 'cookie' | 'cafe';

export type ItemKind = 'sprite' | 'image' | 'text' | 'creation' | 'cookie';

/** A free-transform element placed on any stage (stickers, toppings, uploads, text, furniture, cookies). */
export interface StageItem {
  id: string;
  kind: ItemKind;
  /** sprite key | asset id | creation id | cookie shape */
  ref: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  flipX?: boolean;
  opacity?: number;
  tint?: string;
  // text
  text?: string;
  font?: string;
  color?: string;
  stroke?: string;
  shadow?: boolean;
  vertical?: boolean;
  // image
  frame?: 'none' | 'wood' | 'gold' | 'polaroid' | 'round' | 'washi';
  // cookie
  letter?: string;
  locked?: boolean;
}

export interface DrinkData {
  glass: string;
  base: string;
  baseAmount: number; // 20..100
  flavor: string; // 'none' allowed
  flavorAmount: number; // 0..50
  ice: string; // 'none' | 'cube' | 'crushed' | 'heart' | 'star'
  iceCount: number;
  mixed: number; // 0..1
  iceCream: string | null;
  cream: boolean;
  toppings: string[];
  straw: string;
  garnish: string;
  labelText: string;
  labelStyle: string;
  labelAsset?: string | null;
  items: StageItem[];
  recipeId?: string | null;
}

export interface ParfaitLayer {
  id: string;
  kind: string; // e.g. cornflakes, granola, jelly-matcha, ice-vanilla, cream, fruit-strawberry, sauce-choco
}

export interface AnimalFace {
  type: 'none' | 'cat' | 'bear' | 'bunny' | 'panda' | 'chick';
  face: 'happy' | 'smile' | 'wink' | 'sleepy' | 'surprised';
  acc: 'none' | 'bow' | 'flower' | 'leaf' | 'crown';
}

export interface ParfaitTop {
  id: string;
  type: 'scoop' | 'cream';
  flavor: string;
  x: number;
  y: number;
  size: number;
  animal?: AnimalFace;
}

export interface ParfaitData {
  glass: string;
  layers: ParfaitLayer[];
  top: ParfaitTop[];
  sauce: string; // none | choco | strawberry | caramel | matcha | condensed
  items: StageItem[];
}

export interface CrepeData {
  batter: string;
  cookLevel: number;
  flipped: boolean;
  fillings: string[];
  sauces: string[];
  toppings: string[];
  fold: 'cone' | 'half' | 'roll';
  wrapper: string;
  wrapperAsset?: string | null;
  items: StageItem[];
}

export interface IcingStroke {
  id: string;
  cookieId: string;
  color: string;
  width: number;
  points: [number, number][];
  flood?: boolean;
}

export interface CookieData {
  dough: string;
  added: string[];
  mix: number;
  knead: number;
  roll: number;
  cookies: StageItem[]; // kind 'cookie'
  bake: number;
  icing: IcingStroke[];
  items: StageItem[];
  pack: { type: 'plate' | 'box' | 'bag' | 'tin'; color: string; ribbon: string; asset?: string | null };
}

export interface CafeScene {
  wallpaper: string;
  floor: string;
  items: StageItem[];
}

export interface CafeLayout {
  id: string;
  theme: 'spring' | 'summer' | 'autumn' | 'winter';
  interior: CafeScene;
  exterior: CafeScene & { facade: string; awning: string; signText: string };
  updatedAt: number;
}

export type CreationData = DrinkData | ParfaitData | CrepeData | CookieData | CafeLayout;

export interface Creation {
  id: string;
  name: string;
  type: CreationType;
  ingredients: string[];
  data: CreationData;
  previewW: number;
  previewH: number;
  createdAt: number;
  updatedAt: number;
  isFavorite: boolean;
  isRecipe?: boolean;
  season?: string | null;
}

export interface UploadedAsset {
  id: string;
  name: string;
  imageBlob: Blob;
  width: number;
  height: number;
  createdAt: number;
}

export interface AssetMeta {
  id: string;
  name: string;
  width: number;
  height: number;
  createdAt: number;
}
