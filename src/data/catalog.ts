import type { DrinkData } from '../types';

export interface Opt {
  id: string;
  name: string;
  jp?: string;
  color?: string;
  color2?: string;
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
}

// ---------------------------------------------------------------- unlocks
export interface LockInfo {
  key: string;
  name: string;
  category: string;
  price?: number;
  level?: number;
  preview?: string; // sprite key or color
}

export const LOCKS: LockInfo[] = [
  { key: 'glass:crystal', name: 'Crystal Goblet', category: 'Glasses', price: 60 },
  { key: 'glass:sakura', name: 'Sakura Cup', category: 'Glasses', level: 3 },
  { key: 'flavor:yuzu', name: 'Yuzu Syrup', category: 'Flavors', price: 40 },
  { key: 'flavor:ramune', name: 'Ramune Syrup', category: 'Flavors', price: 40 },
  { key: 'flavor:lychee', name: 'Lychee Syrup', category: 'Flavors', level: 2 },
  { key: 'ice:hojicha', name: 'Hojicha Ice Cream', category: 'Ice cream', price: 50 },
  { key: 'ice:sesame', name: 'Black Sesame Ice Cream', category: 'Ice cream', level: 4 },
  { key: 'ice:sakura', name: 'Sakura Ice Cream', category: 'Ice cream', price: 50 },
  { key: 'cutter:moon', name: 'Moon Cutter', category: 'Cookie cutters', price: 30 },
  { key: 'cutter:fish', name: 'Taiyaki Fish Cutter', category: 'Cookie cutters', level: 2 },
  { key: 'cutter:onigiri', name: 'Onigiri Cutter', category: 'Cookie cutters', price: 30 },
  { key: 'furn:lantern', name: 'Chōchin Lantern', category: 'Furniture', price: 70 },
  { key: 'furn:noren', name: 'Noren Curtain', category: 'Furniture', price: 80 },
  { key: 'furn:lucky-cat', name: 'Lucky Cat', category: 'Furniture', level: 3 },
  { key: 'furn:jukebox', name: 'Retro Jukebox', category: 'Furniture', price: 120 },
  { key: 'furn:fishtank', name: 'Kingyo Bowl', category: 'Furniture', level: 5 },
  { key: 'sticker:wagashi', name: 'Wagashi Sticker Pack', category: 'Stickers', price: 45 },
  { key: 'sticker:retro', name: 'Retro Kissaten Stickers', category: 'Stickers', level: 2 },
  { key: 'bg:night', name: 'Starry Night Background', category: 'Backgrounds', price: 40 },
  { key: 'bg:washi', name: 'Washi Paper Background', category: 'Backgrounds', level: 3 },
  { key: 'wall:shoji', name: 'Shoji Wall', category: 'Café walls', price: 90 },
  { key: 'floor:tatami', name: 'Tatami Floor', category: 'Café floors', price: 90 },
];
export const LOCK_MAP = Object.fromEntries(LOCKS.map((l) => [l.key, l]));

// ---------------------------------------------------------------- drinks
export const DRINK_GLASSES: Opt[] = [
  { id: 'tall', name: 'Tall glass', jp: 'トール' },
  { id: 'round', name: 'Round goblet', jp: 'ゴブレット' },
  { id: 'heart', name: 'Heart glass', jp: 'ハート' },
  { id: 'flower', name: 'Flower glass', jp: 'フラワー' },
  { id: 'mason', name: 'Mason jar', jp: 'メイソン' },
  { id: 'cat', name: 'Kitty cup', jp: 'ねこカップ' },
  { id: 'crystal', name: 'Crystal goblet', jp: 'クリスタル' },
  { id: 'sakura', name: 'Sakura cup', jp: 'さくら', season: 'spring' },
];

export const BASES: Opt[] = [
  { id: 'milk', name: 'Milk', jp: 'ミルク', color: '#FBF6EC' },
  { id: 'matcha', name: 'Matcha', jp: '抹茶', color: '#7FA23C' },
  { id: 'blacktea', name: 'Black tea', jp: '紅茶', color: '#B4561A' },
  { id: 'coffee', name: 'Coffee', jp: 'コーヒー', color: '#3F2416' },
  { id: 'soda', name: 'Soda', jp: 'ソーダ', color: '#E8F5FA' },
  { id: 'juice', name: 'Fruit juice', jp: 'ジュース', color: '#F8B12E' },
  { id: 'hojicha', name: 'Hojicha', jp: 'ほうじ茶', color: '#9C6234', season: 'autumn' },
];

export const FLAVORS: Opt[] = [
  { id: 'none', name: 'Plain', jp: 'なし', color: '#FFFFFF' },
  { id: 'strawberry', name: 'Strawberry', jp: 'いちご', color: '#E0283F', season: 'spring' },
  { id: 'blueberry', name: 'Blueberry', jp: 'ブルーベリー', color: '#4A3B8C' },
  { id: 'melon', name: 'Melon', jp: 'メロン', color: '#35C043', season: 'summer' },
  { id: 'peach', name: 'Peach', jp: 'もも', color: '#F7906C', season: 'summer' },
  { id: 'sakura', name: 'Sakura', jp: 'さくら', color: '#F49AB4', season: 'spring' },
  { id: 'mango', name: 'Mango', jp: 'マンゴー', color: '#F7A00F', season: 'summer' },
  { id: 'chocolate', name: 'Chocolate', jp: 'チョコ', color: '#4A2716' },
  { id: 'caramel', name: 'Caramel', jp: 'キャラメル', color: '#C4731F', season: 'autumn' },
  { id: 'bluehawaii', name: 'Blue Hawaii', jp: 'ブルーハワイ', color: '#1E9BE6', season: 'summer' },
  { id: 'yuzu', name: 'Yuzu', jp: 'ゆず', color: '#F3D21B', season: 'winter' },
  { id: 'ramune', name: 'Ramune', jp: 'ラムネ', color: '#7FD3F0', season: 'summer' },
  { id: 'lychee', name: 'Lychee', jp: 'ライチ', color: '#F6D9DF' },
];
export const FRUIT_PULP = ['strawberry', 'blueberry', 'peach', 'mango', 'melon'];

export const ICE_TYPES: Opt[] = [
  { id: 'none', name: 'No ice', jp: 'なし' },
  { id: 'cube', name: 'Regular ice', jp: 'アイス' },
  { id: 'crushed', name: 'Crushed ice', jp: 'クラッシュ' },
  { id: 'heart', name: 'Heart ice', jp: 'ハート' },
  { id: 'star', name: 'Star ice', jp: 'スター' },
];

export const ICE_CREAMS: Opt[] = [
  { id: 'vanilla', name: 'Vanilla', jp: 'バニラ', color: '#FBF1D6', color2: '#EED9A6' },
  { id: 'matcha', name: 'Matcha', jp: '抹茶', color: '#B5C982', color2: '#8DA45A' },
  { id: 'strawberry', name: 'Strawberry', jp: 'いちご', color: '#F8C3CD', color2: '#E795A6' },
  { id: 'chocolate', name: 'Chocolate', jp: 'チョコ', color: '#8A5A3F', color2: '#5E3A27' },
  { id: 'mango', name: 'Mango', jp: 'マンゴー', color: '#FBD47A', color2: '#F1AE3D' },
  { id: 'blueberry', name: 'Blueberry', jp: 'ブルーベリー', color: '#C8B5E0', color2: '#9A82C2' },
  { id: 'hojicha', name: 'Hojicha', jp: 'ほうじ茶', color: '#C79E78', color2: '#A07650', season: 'autumn' },
  { id: 'sesame', name: 'Black sesame', jp: '黒ごま', color: '#9A9590', color2: '#6E6863' },
  { id: 'sakura', name: 'Sakura', jp: 'さくら', color: '#FAD6DF', color2: '#EFA9BB', season: 'spring' },
];
export const iceCream = (id: string) => ICE_CREAMS.find((i) => i.id === id) || ICE_CREAMS[0];

export const DRINK_TOPPINGS: Opt[] = [
  { id: 'strawberries', name: 'Strawberries', jp: 'いちご' },
  { id: 'cherry', name: 'Cherry', jp: 'さくらんぼ' },
  { id: 'jelly', name: 'Jelly cubes', jp: 'ゼリー' },
  { id: 'boba', name: 'Boba pearls', jp: 'タピオカ' },
  { id: 'marshmallow', name: 'Marshmallows', jp: 'マシュマロ' },
  { id: 'sprinkles', name: 'Sprinkles', jp: 'スプリンクル' },
  { id: 'minicookie', name: 'Mini cookies', jp: 'クッキー' },
];

export const STRAWS: Opt[] = [
  { id: 'none', name: 'No straw', color: '#fff' },
  { id: 'pink', name: 'Pink stripe', color: '#F28BA8' },
  { id: 'paper', name: 'Paper green', color: '#8DB36B' },
  { id: 'boba', name: 'Wide boba', color: '#F4E2B8' },
  { id: 'bendy', name: 'Bendy blue', color: '#6BB6E0' },
  { id: 'glass', name: 'Glass straw', color: '#DDEFF5' },
  { id: 'heart', name: 'Heart straw', color: '#F7A7BE' },
];

export const GARNISH: Opt[] = [
  { id: 'none', name: 'None' },
  { id: 'lemon', name: 'Lemon slice' },
  { id: 'orange', name: 'Orange slice' },
  { id: 'strawberry', name: 'Strawberry' },
  { id: 'mint', name: 'Mint sprig' },
  { id: 'melon', name: 'Melon wedge' },
];

export const LABEL_STYLES: Opt[] = [
  { id: 'none', name: 'No label' },
  { id: 'kraft', name: 'Kraft tag', color: '#D8B88E' },
  { id: 'pink', name: 'Pink sticker', color: '#F7B8C8' },
  { id: 'matcha', name: 'Matcha band', color: '#B9CBA5' },
  { id: 'cream', name: 'Cream oval', color: '#FFF8ED' },
  { id: 'photo', name: 'My photo label' },
];

export interface DrinkRecipe {
  id: string;
  name: string;
  jp: string;
  desc: string;
  data: Partial<DrinkData>;
  steps: string[];
}

export const DRINK_RECIPES: DrinkRecipe[] = [
  {
    id: 'strawberry-milk', name: 'Strawberry Milk', jp: 'いちごミルク', desc: 'Fresh crushed strawberries under cold milk.',
    data: { glass: 'tall', base: 'milk', flavor: 'strawberry', baseAmount: 70, flavorAmount: 35, ice: 'cube', iceCount: 3, iceCream: null, cream: true, toppings: ['strawberries'], straw: 'pink', garnish: 'strawberry' },
    steps: ['Pick the tall glass', 'Pour milk', 'Add strawberry', 'Add regular ice', 'Stir gently — keep some layers!', 'Top with whipped cream & strawberries'],
  },
  {
    id: 'matcha-latte', name: 'Matcha Latte', jp: '抹茶ラテ', desc: 'Silky milk with a float of whisked matcha.',
    data: { glass: 'mason', base: 'matcha', flavor: 'none', baseAmount: 80, flavorAmount: 0, ice: 'cube', iceCount: 4, iceCream: null, cream: false, toppings: [], straw: 'paper', garnish: 'none' },
    steps: ['Pick the mason jar', 'Pour matcha (milk goes underneath)', 'No syrup needed', 'Add regular ice', 'Don\'t stir — enjoy the layers', 'Paper straw finish'],
  },
  {
    id: 'melon-float', name: 'Melon Soda Float', jp: 'メロンクリームソーダ', desc: 'The classic kissaten cream soda.',
    data: { glass: 'round', base: 'soda', flavor: 'melon', baseAmount: 75, flavorAmount: 30, ice: 'cube', iceCount: 5, iceCream: 'vanilla', cream: false, toppings: ['cherry'], straw: 'pink', garnish: 'none' },
    steps: ['Pick the round goblet', 'Pour soda', 'Add melon syrup', 'Add regular ice', 'Stir until bright green', 'Vanilla ice cream + cherry on top'],
  },
  {
    id: 'sakura-soda', name: 'Sakura Cream Soda', jp: 'さくらクリームソーダ', desc: 'Pink blossom soda with heart ice.',
    data: { glass: 'round', base: 'soda', flavor: 'sakura', baseAmount: 75, flavorAmount: 30, ice: 'heart', iceCount: 5, iceCream: 'vanilla', cream: false, toppings: ['cherry'], straw: 'heart', garnish: 'none' },
    steps: ['Pick the round goblet', 'Pour soda', 'Add sakura syrup', 'Add heart ice', 'Stir', 'Vanilla ice cream + cherry'],
  },
  {
    id: 'blue-ocean', name: 'Blue Ocean Soda', jp: 'ブルーオーシャン', desc: 'Sparkling blue like a summer sea.',
    data: { glass: 'tall', base: 'soda', flavor: 'bluehawaii', baseAmount: 80, flavorAmount: 30, ice: 'star', iceCount: 5, iceCream: 'vanilla', cream: false, toppings: ['cherry'], straw: 'bendy', garnish: 'lemon' },
    steps: ['Pick the tall glass', 'Pour soda', 'Add Blue Hawaii syrup', 'Add star ice', 'Stir halfway for a gradient', 'Vanilla ice cream + cherry'],
  },
  {
    id: 'hojicha-milk', name: 'Hojicha Milk', jp: 'ほうじ茶ミルク', desc: 'Roasty hojicha over caramel and milk.',
    data: { glass: 'mason', base: 'hojicha', flavor: 'caramel', baseAmount: 75, flavorAmount: 18, ice: 'cube', iceCount: 3, iceCream: null, cream: true, toppings: [], straw: 'paper', garnish: 'none' },
    steps: ['Pick the mason jar', 'Pour hojicha', 'Add caramel', 'Add regular ice', 'Light stir', 'Top with whipped cream'],
  },
  {
    id: 'strawberry-matcha', name: 'Strawberry Matcha', jp: 'いちご抹茶', desc: 'Three gorgeous layers: berry, milk, matcha.',
    data: { glass: 'tall', base: 'matcha', flavor: 'strawberry', baseAmount: 75, flavorAmount: 30, ice: 'cube', iceCount: 3, iceCream: null, cream: false, toppings: ['strawberries'], straw: 'glass', garnish: 'strawberry' },
    steps: ['Pick the tall glass', 'Pour matcha', 'Add strawberry', 'Add regular ice', 'No stirring — keep 3 layers', 'Garnish with strawberries'],
  },
  {
    id: 'choco-float', name: 'Chocolate Milk Float', jp: 'チョコミルクフロート', desc: 'Cocoa milk with a chocolate scoop.',
    data: { glass: 'round', base: 'milk', flavor: 'chocolate', baseAmount: 70, flavorAmount: 30, ice: 'cube', iceCount: 3, iceCream: 'chocolate', cream: true, toppings: ['minicookie', 'sprinkles'], straw: 'pink', garnish: 'none' },
    steps: ['Pick the round goblet', 'Pour milk', 'Add chocolate', 'Add regular ice', 'Stir well', 'Cream, chocolate ice cream, cookies'],
  },
  {
    id: 'peach-soda', name: 'Peach Soda', jp: 'ピーチソーダ', desc: 'Juicy white peach with crushed ice.',
    data: { glass: 'flower', base: 'soda', flavor: 'peach', baseAmount: 75, flavorAmount: 30, ice: 'crushed', iceCount: 5, iceCream: null, cream: false, toppings: ['jelly'], straw: 'pink', garnish: 'mint' },
    steps: ['Pick the flower glass', 'Pour soda', 'Add peach', 'Add crushed ice', 'Stir', 'Peach jelly + mint'],
  },
  {
    id: 'vanilla-soda', name: 'Vanilla Cream Soda', jp: 'バニラクリームソーダ', desc: 'Pure, fizzy and nostalgic.',
    data: { glass: 'round', base: 'soda', flavor: 'none', baseAmount: 85, flavorAmount: 0, ice: 'cube', iceCount: 5, iceCream: 'vanilla', cream: false, toppings: ['cherry'], straw: 'glass', garnish: 'none' },
    steps: ['Pick the round goblet', 'Pour soda', 'Keep it plain', 'Add regular ice', 'Stir', 'Vanilla ice cream + cherry'],
  },
];

// ---------------------------------------------------------------- parfait
export const PARFAIT_GLASSES: Opt[] = [
  { id: 'parfait', name: 'Tall parfait glass', jp: 'パフェグラス' },
  { id: 'heart', name: 'Heart glass', jp: 'ハート' },
  { id: 'flower', name: 'Flower glass', jp: 'フラワー' },
  { id: 'round', name: 'Round glass', jp: 'ラウンド' },
  { id: 'bear', name: 'Bear cup', jp: 'くまカップ' },
  { id: 'crystal', name: 'Crystal goblet', jp: 'クリスタル' },
];

/** Layer kinds that can be stacked inside a parfait glass */
export const PARFAIT_LAYERS: (Opt & { h: number; group: string })[] = [
  { id: 'cornflakes', name: 'Cornflakes', jp: 'コーンフレーク', color: '#E8B456', color2: '#C98B2E', h: 44, group: 'base' },
  { id: 'granola', name: 'Granola', jp: 'グラノーラ', color: '#C8955B', color2: '#8D5F33', h: 40, group: 'base' },
  { id: 'crumbs', name: 'Cookie crumbs', jp: 'クッキー', color: '#B07A4E', color2: '#7A4E2E', h: 30, group: 'base' },
  { id: 'jelly-matcha', name: 'Matcha jelly', jp: '抹茶ゼリー', color: '#6E9B2E', color2: '#4E7A1E', h: 40, group: 'base' },
  { id: 'jelly-coffee', name: 'Coffee jelly', jp: 'コーヒーゼリー', color: '#3A2214', color2: '#24130A', h: 40, group: 'base' },
  { id: 'jelly-strawberry', name: 'Berry jelly', jp: 'いちごゼリー', color: '#E23B57', color2: '#B21F3A', h: 40, group: 'base' },
  { id: 'fruit-strawberry', name: 'Strawberry halves', jp: 'いちご', color: '#F4E3E3', h: 54, group: 'base' },
  { id: 'fruit-mango', name: 'Mango cubes', jp: 'マンゴー', color: '#FBD47A', h: 44, group: 'base' },
  { id: 'fruit-kiwi', name: 'Kiwi slices', jp: 'キウイ', color: '#F4F2E3', h: 50, group: 'base' },
  { id: 'cream', name: 'Whipped cream', jp: '生クリーム', color: '#FFFDF6', h: 34, group: 'layer' },
  { id: 'cream-matcha', name: 'Matcha cream', jp: '抹茶クリーム', color: '#CFDCAE', h: 34, group: 'layer' },
  { id: 'redbean', name: 'Red bean', jp: 'あんこ', color: '#5B2A2A', color2: '#3E1818', h: 34, group: 'layer' },
  { id: 'ice-vanilla', name: 'Vanilla ice', jp: 'バニラ', color: '#FBF1D6', h: 46, group: 'ice' },
  { id: 'ice-matcha', name: 'Matcha ice', jp: '抹茶', color: '#B5C982', h: 46, group: 'ice' },
  { id: 'ice-strawberry', name: 'Strawberry ice', jp: 'いちご', color: '#F8C3CD', h: 46, group: 'ice' },
  { id: 'ice-chocolate', name: 'Chocolate ice', jp: 'チョコ', color: '#8A5A3F', h: 46, group: 'ice' },
  { id: 'sauce-choco', name: 'Choco sauce', jp: 'チョコソース', color: '#3B1E10', h: 14, group: 'layer' },
  { id: 'sauce-berry', name: 'Berry sauce', jp: 'いちごソース', color: '#C21A35', h: 14, group: 'layer' },
  { id: 'kinako', name: 'Kinako & kuromitsu', jp: 'きな粉', color: '#D9B77A', h: 22, group: 'layer' },
];
export const layerOpt = (id: string) => PARFAIT_LAYERS.find((l) => l.id === id) || PARFAIT_LAYERS[0];

export const SAUCES: Opt[] = [
  { id: 'none', name: 'None' },
  { id: 'choco', name: 'Chocolate', color: '#3B1E10' },
  { id: 'strawberry', name: 'Strawberry', color: '#C8102E' },
  { id: 'caramel', name: 'Caramel', color: '#B8681A' },
  { id: 'matcha', name: 'Matcha', color: '#6F8F2F' },
  { id: 'condensed', name: 'Condensed milk', color: '#FFFBF0' },
];

export const CREAM_COLORS: Opt[] = [
  { id: 'vanilla', name: 'Vanilla', color: '#FFFDF6', color2: '#EFE6D2' },
  { id: 'matcha', name: 'Matcha', color: '#DDE7C4', color2: '#AFC284' },
  { id: 'strawberry', name: 'Strawberry', color: '#FCE0E6', color2: '#EFB2C0' },
  { id: 'chocolate', name: 'Chocolate', color: '#C9A68C', color2: '#9C7558' },
];
export const creamColor = (id: string) => CREAM_COLORS.find((c) => c.id === id) || CREAM_COLORS[0];

export const TOPPING_SPRITES = [
  'strawberry', 'strawberry-half', 'kiwi', 'banana', 'peach', 'mango', 'mochi', 'dango', 'redbean', 'wafer',
  'macaron-pink', 'macaron-green', 'cookie', 'cherry', 'pocky', 'mint', 'blueberry', 'chestnut', 'cheesecake', 'brownie',
];

// ---------------------------------------------------------------- crepes
export const BATTERS: Opt[] = [
  { id: 'original', name: 'Original', jp: 'プレーン', color: '#F7E6B2', color2: '#E3AE5E' },
  { id: 'chocolate', name: 'Chocolate', jp: 'チョコ', color: '#9A6B4E', color2: '#5E3A26' },
  { id: 'matcha', name: 'Matcha', jp: '抹茶', color: '#CADB9B', color2: '#98AE5C' },
  { id: 'strawberry', name: 'Strawberry', jp: 'いちご', color: '#F8CBD1', color2: '#E59C9D' },
];
export const batter = (id: string) => BATTERS.find((b) => b.id === id) || BATTERS[0];

export const CREPE_CREAMS: Opt[] = [
  { id: 'cream-vanilla', name: 'Vanilla cream', color: '#FFFDF6' },
  { id: 'cream-chocolate', name: 'Chocolate cream', color: '#B68A6C' },
  { id: 'cream-matcha', name: 'Matcha cream', color: '#D3E0AE' },
  { id: 'cream-strawberry', name: 'Strawberry cream', color: '#F9D2DA' },
];
export const CREPE_FRUITS: Opt[] = [
  { id: 'fruit-strawberry', name: 'Strawberry' },
  { id: 'fruit-banana', name: 'Banana' },
  { id: 'fruit-kiwi', name: 'Kiwi' },
  { id: 'fruit-peach', name: 'Peach' },
];
export const CREPE_OTHERS: Opt[] = [
  { id: 'custard', name: 'Custard', color: '#F6D873' },
  { id: 'brownie', name: 'Brownie', color: '#4E2C1C' },
  { id: 'pudding', name: 'Pudding', color: '#F2C452' },
  { id: 'mochi', name: 'Mochi', color: '#FFFFFF' },
  { id: 'crumbs', name: 'Cookie crumbs', color: '#A9764B' },
  { id: 'cheesecake', name: 'Cheesecake', color: '#F7E7A6' },
];
export const CREPE_SAUCES: Opt[] = [
  { id: 'choco', name: 'Chocolate sauce', color: '#3B1E10' },
  { id: 'caramel', name: 'Caramel sauce', color: '#B8681A' },
  { id: 'strawberry', name: 'Strawberry sauce', color: '#C8102E' },
  { id: 'condensed', name: 'Condensed milk', color: '#FFFBF0' },
];
export const CREPE_TOPPINGS: Opt[] = [
  { id: 'whipped', name: 'Whipped cream' },
  { id: 'sprinkles', name: 'Sprinkles' },
  { id: 'cherries', name: 'Cherries' },
  { id: 'minicookies', name: 'Mini cookies' },
];
export const WRAPPERS: Opt[] = [
  { id: 'pink', name: 'Pink gingham', color: '#E8607E' },
  { id: 'cream', name: 'Cream paper', color: '#D9B98F' },
  { id: 'matcha', name: 'Matcha gingham', color: '#6E9B4A' },
  { id: 'floral', name: 'Sakura floral', color: '#F3A6BC' },
  { id: 'custom', name: 'My photo wrapper' },
];

// ---------------------------------------------------------------- cookies
export const DOUGHS: Opt[] = [
  { id: 'butter', name: 'Butter', jp: 'バター', color: '#F2DCAA', color2: '#D99F55' },
  { id: 'chocolate', name: 'Chocolate', jp: 'チョコ', color: '#7A5038', color2: '#4E2E1E' },
  { id: 'matcha', name: 'Matcha', jp: '抹茶', color: '#C2D597', color2: '#94A85E' },
  { id: 'strawberry', name: 'Strawberry', jp: 'いちご', color: '#F6CACF', color2: '#E0999A' },
  { id: 'vanilla', name: 'Vanilla', jp: 'バニラ', color: '#F8EBC9', color2: '#E6BE7E' },
  { id: 'blueberry', name: 'Blueberry', jp: 'ブルーベリー', color: '#CCC2E2', color2: '#9C8EC0' },
];
export const dough = (id: string) => DOUGHS.find((d) => d.id === id) || DOUGHS[0];

export const DOUGH_INGREDIENTS: Opt[] = [
  { id: 'flour', name: 'Flour', color: '#FBF8F1' },
  { id: 'butter', name: 'Butter', color: '#F9E08A' },
  { id: 'sugar', name: 'Sugar', color: '#FFFFFF' },
  { id: 'egg', name: 'Egg', color: '#F8C640' },
  { id: 'flavor', name: 'Flavor', color: '#E8A0B0' },
];

export const CUTTERS: Opt[] = [
  { id: 'heart', name: 'Heart' }, { id: 'star', name: 'Star' }, { id: 'flower', name: 'Flower' },
  { id: 'cat', name: 'Cat' }, { id: 'bear', name: 'Bear' }, { id: 'bunny', name: 'Bunny' },
  { id: 'cloud', name: 'Cloud' }, { id: 'cherry', name: 'Cherry' }, { id: 'house', name: 'House' },
  { id: 'letter', name: 'Alphabet' }, { id: 'moon', name: 'Moon' }, { id: 'fish', name: 'Taiyaki' },
  { id: 'onigiri', name: 'Onigiri' },
];

export const ICING_COLORS = ['#FFFFFF', '#F7B8C8', '#F27D9B', '#B9CBA5', '#7FB069', '#F6E5A9', '#C9E2EF', '#7CB7DB', '#C7B6E8', '#5E3A27', '#FFB37A', '#2B2B2B'];

export const PACKS: Opt[] = [
  { id: 'plate', name: 'Doily plate' },
  { id: 'box', name: 'Gift box' },
  { id: 'bag', name: 'Clear bag' },
  { id: 'tin', name: 'Cookie tin' },
];
export const PACK_COLORS = ['#F7B8C8', '#B9CBA5', '#C9E2EF', '#F6E5A9', '#D8B88E', '#FFFFFF', '#C7B6E8'];
export const RIBBONS = ['#E8607E', '#C9566F', '#7E9A63', '#6E9DB5', '#F1C24B', '#92745F', '#FFFFFF'];

// ---------------------------------------------------------------- stickers
export const STICKER_GROUPS: { id: string; name: string; lock?: string; items: string[] }[] = [
  { id: 'cute', name: 'Cute', items: ['heart', 'star', 'sparkle', 'bow', 'cloud', 'sakura', 'flower-yellow', 'clover', 'music', 'rainbow'] },
  { id: 'labels', name: 'Labels', items: ['tag-new', 'tag-limited', 'tag-oishii', 'tag-price', 'tag-yummy', 'tag-love'] },
  { id: 'faces', name: 'Faces', items: ['eyes-dot', 'eyes-happy', 'eyes-sparkle', 'mouth-smile', 'mouth-cat', 'cheeks', 'face-wink'] },
  { id: 'food', name: 'Sweets', items: ['strawberry', 'cherry', 'macaron-pink', 'macaron-green', 'dango', 'mochi', 'cookie', 'wafer', 'mint', 'pocky'] },
  { id: 'deco', name: 'Deco', items: ['washi-pink', 'washi-green', 'pearls', 'sprinkle-pile', 'ribbon-long', 'candle', 'leaf-maple', 'snowflake'] },
  { id: 'wagashi', name: 'Wagashi', lock: 'sticker:wagashi', items: ['nerikiri', 'taiyaki', 'dorayaki', 'sakura-mochi', 'ichigo-daifuku'] },
  { id: 'retro', name: 'Retro', lock: 'sticker:retro', items: ['tag-kissaten', 'coffee-cup', 'cream-soda-icon', 'record', 'tag-open'] },
];
export const FACE_STICKERS = ['eyes-dot', 'eyes-happy', 'eyes-sparkle', 'mouth-smile', 'mouth-cat', 'cheeks', 'face-wink', 'pearls', 'sprinkle-pile', 'heart', 'star', 'bow'];

// ---------------------------------------------------------------- café furniture
export interface FurnitureOpt { id: string; name: string; area: string; lock?: string }
export const CAFE_AREAS = [
  { id: 'front', name: 'Front Shop', jp: '外観' },
  { id: 'counter', name: 'Counter', jp: 'カウンター' },
  { id: 'display', name: 'Dessert Display', jp: 'ショーケース' },
  { id: 'seating', name: 'Customer Area', jp: '客席' },
  { id: 'wall', name: 'Wall & Floor', jp: '壁と床' },
];
export const FURNITURE: FurnitureOpt[] = [
  { id: 'f-signboard', name: 'A-frame menu', area: 'front' },
  { id: 'f-flowerpot', name: 'Flower pot', area: 'front' },
  { id: 'f-planter', name: 'Planter box', area: 'front' },
  { id: 'f-bench', name: 'Wooden bench', area: 'front' },
  { id: 'f-lantern', name: 'Chōchin lantern', area: 'front', lock: 'furn:lantern' },
  { id: 'f-noren', name: 'Noren curtain', area: 'front', lock: 'furn:noren' },
  { id: 'f-bike', name: 'Delivery bike', area: 'front' },
  { id: 'f-counter', name: 'Wood counter', area: 'counter' },
  { id: 'f-espresso', name: 'Espresso machine', area: 'counter' },
  { id: 'f-register', name: 'Cash register', area: 'counter' },
  { id: 'f-grinder', name: 'Coffee grinder', area: 'counter' },
  { id: 'f-luckycat', name: 'Lucky cat', area: 'counter', lock: 'furn:lucky-cat' },
  { id: 'f-cakestand', name: 'Cake dome', area: 'counter' },
  { id: 'f-showcase', name: 'Glass showcase', area: 'display' },
  { id: 'f-cookiejar', name: 'Cookie jar', area: 'display' },
  { id: 'f-stand', name: 'Tiered stand', area: 'display' },
  { id: 'f-plate', name: 'Dessert plate', area: 'display' },
  { id: 'f-shelf', name: 'Wall shelf', area: 'display' },
  { id: 'f-table', name: 'Café table', area: 'seating' },
  { id: 'f-chair', name: 'Bentwood chair', area: 'seating' },
  { id: 'f-sofa', name: 'Velvet sofa', area: 'seating' },
  { id: 'f-cushion', name: 'Cushion', area: 'seating' },
  { id: 'f-plant', name: 'Monstera', area: 'seating' },
  { id: 'f-floorlamp', name: 'Floor lamp', area: 'seating' },
  { id: 'f-jukebox', name: 'Jukebox', area: 'seating', lock: 'furn:jukebox' },
  { id: 'f-fishbowl', name: 'Kingyo bowl', area: 'seating', lock: 'furn:fishtank' },
  { id: 'f-pendant', name: 'Pendant lamp', area: 'wall' },
  { id: 'f-window', name: 'Window', area: 'wall' },
  { id: 'f-curtain', name: 'Curtains', area: 'wall' },
  { id: 'f-frame', name: 'Picture frame', area: 'wall' },
  { id: 'f-menuboard', name: 'Menu board', area: 'wall' },
  { id: 'f-clock', name: 'Wall clock', area: 'wall' },
  { id: 'f-garland', name: 'String lights', area: 'wall' },
  { id: 'f-rug', name: 'Round rug', area: 'wall' },
];
export const FURNITURE_TINTS = ['#F7B8C8', '#B9CBA5', '#F6E5A9', '#C9E2EF', '#F5D0BE', '#92745F', '#FFFFFF', '#C7B6E8', '#E8607E', '#7E9A63'];

export const WALLPAPERS: Opt[] = [
  { id: 'stripe-pink', name: 'Pink stripes', color: '#FBE3EA', color2: '#F7CCD8' },
  { id: 'dots-cream', name: 'Cream dots', color: '#FFF5E3', color2: '#F3DDB8' },
  { id: 'gingham-green', name: 'Matcha gingham', color: '#EEF3E6', color2: '#C9D8B6' },
  { id: 'sky', name: 'Sky clouds', color: '#E3F0F7', color2: '#FFFFFF' },
  { id: 'brick', name: 'White brick', color: '#F7F1EA', color2: '#E5D8CA' },
  { id: 'shoji', name: 'Shoji', color: '#FBF6EA', color2: '#B9946C' },
];
export const FLOORS: Opt[] = [
  { id: 'wood', name: 'Oak wood', color: '#D3A87A', color2: '#B88A5C' },
  { id: 'checker', name: 'Checker tiles', color: '#FFFFFF', color2: '#F7B8C8' },
  { id: 'mint', name: 'Mint tiles', color: '#E5F0E0', color2: '#B9CBA5' },
  { id: 'herring', name: 'Herringbone', color: '#C99B6E', color2: '#A87A4F' },
  { id: 'tatami', name: 'Tatami', color: '#D8D59A', color2: '#A9A86A' },
];

export const SEASONS = [
  { id: 'spring', name: 'Spring Sakura Café', jp: '春・さくら', color: '#F7B8C8' },
  { id: 'summer', name: 'Summer Melon Café', jp: '夏・メロン', color: '#B9E3A0' },
  { id: 'autumn', name: 'Autumn Maple Café', jp: '秋・もみじ', color: '#F2A65A' },
  { id: 'winter', name: 'Winter Christmas Café', jp: '冬・クリスマス', color: '#C9E2EF' },
] as const;

// ---------------------------------------------------------------- photo studio
export const PHOTO_TEMPLATES = [
  { id: 'post', name: 'Instagram Post', w: 1080, h: 1080 },
  { id: 'portrait', name: 'Instagram Portrait', w: 1080, h: 1350 },
  { id: 'story', name: 'Instagram Story', w: 1080, h: 1920 },
  { id: 'scrapbook', name: 'Scrapbook Layout', w: 1080, h: 1350 },
  { id: 'menu', name: 'Café Menu Poster', w: 1080, h: 1528 },
  { id: 'custom', name: 'Custom Canvas', w: 1200, h: 900 },
];

export const PHOTO_BACKGROUNDS: (Opt & { lock?: string })[] = [
  { id: 'pink', name: 'Strawberry', color: '#FBE3EA', color2: '#F7B8C8' },
  { id: 'matcha', name: 'Matcha', color: '#EEF3E6', color2: '#B9CBA5' },
  { id: 'butter', name: 'Butter', color: '#FFF6DA', color2: '#F6E5A9' },
  { id: 'sky', name: 'Summer sky', color: '#E6F3FA', color2: '#9FD0EA' },
  { id: 'cocoa', name: 'Kissaten cocoa', color: '#6E5244', color2: '#4F3A30' },
  { id: 'gingham', name: 'Pink gingham', color: '#FFFFFF', color2: '#F28BA8' },
  { id: 'sakura', name: 'Sakura pattern', color: '#FDEEF2', color2: '#F7B8C8' },
  { id: 'kraft', name: 'Kraft paper', color: '#E2C9A3', color2: '#CDAE83' },
  { id: 'night', name: 'Starry night', color: '#2E3561', color2: '#151A3A', lock: 'bg:night' },
  { id: 'washi', name: 'Washi', color: '#F6F0E2', color2: '#E1D2B6', lock: 'bg:washi' },
];

export const FONTS = [
  { id: 'display', name: 'Pop', css: '"Mochiy Pop One", Mali, sans-serif' },
  { id: 'body', name: 'Round', css: 'Mali, sans-serif' },
  { id: 'jp', name: 'Maru', css: '"Zen Maru Gothic", Mali, sans-serif' },
  { id: 'serif', name: 'Mincho', css: '"Hiragino Mincho ProN", "Yu Mincho", Georgia, serif' },
];
export const fontCss = (id?: string) => (FONTS.find((f) => f.id === id) || FONTS[1]).css;

export const TEXT_COLORS = ['#5E4535', '#FFFFFF', '#E8607E', '#C9566F', '#7E9A63', '#4F6B3A', '#6E9DB5', '#F1C24B', '#2B2B2B', '#F7B8C8'];

// ---------------------------------------------------------------- achievements
export interface Achievement { id: string; name: string; desc: string; stars: number; check: (c: Counters) => boolean }
export interface Counters {
  drink: number; parfait: number; crepe: number; cookie: number; cafe: number;
  cookiesBaked: number; uploads: number; exports: number; recipes: number; cafeEdits: number; photos: number;
}
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-drink', name: 'First Sip', desc: 'Create your first drink', stars: 15, check: (c) => c.drink >= 1 },
  { id: 'first-parfait', name: 'Layer Lover', desc: 'Create your first parfait', stars: 15, check: (c) => c.parfait >= 1 },
  { id: 'three-crepes', name: 'Crêpe Artist', desc: 'Create three crêpes', stars: 25, check: (c) => c.crepe >= 3 },
  { id: 'first-crepe', name: 'First Flip', desc: 'Create your first crêpe', stars: 15, check: (c) => c.crepe >= 1 },
  { id: 'five-cookies', name: 'Little Baker', desc: 'Bake five cookies', stars: 25, check: (c) => c.cookiesBaked >= 5 },
  { id: 'decorate-cafe', name: 'Interior Designer', desc: 'Decorate your café', stars: 20, check: (c) => c.cafeEdits >= 1 },
  { id: 'upload', name: 'Personal Touch', desc: 'Upload a custom sticker', stars: 15, check: (c) => c.uploads >= 1 },
  { id: 'recipe', name: 'By The Book', desc: 'Complete a recipe perfectly', stars: 20, check: (c) => c.recipes >= 1 },
  { id: 'photo', name: 'Café Photographer', desc: 'Export a Photo Studio artwork', stars: 20, check: (c) => c.photos >= 1 },
  { id: 'ten', name: 'Sweet Collection', desc: 'Save 10 creations', stars: 40, check: (c) => c.drink + c.parfait + c.crepe + c.cookie >= 10 },
];
