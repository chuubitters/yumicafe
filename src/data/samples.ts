import type { CookieData, CrepeData, DrinkData, ParfaitData } from '../types';
import { DRINK_RECIPES } from './catalog';

export const emptyDrink = (): DrinkData => ({
  glass: 'tall', base: '', baseAmount: 70, flavor: 'none', flavorAmount: 25, ice: 'none', iceCount: 4, mixed: 0,
  iceCream: null, cream: false, toppings: [], straw: 'none', garnish: 'none', labelText: '', labelStyle: 'none', labelAsset: null, items: [], recipeId: null,
});

export const recipeDrink = (id: string): DrinkData => {
  const r = DRINK_RECIPES.find((x) => x.id === id)!;
  return { ...emptyDrink(), ...r.data, mixed: id === 'strawberry-matcha' || id === 'matcha-latte' ? 0 : id === 'strawberry-milk' ? 0.35 : 0.9, recipeId: id } as DrinkData;
};

export const sampleParfait = (): ParfaitData => ({
  glass: 'parfait',
  layers: [
    { id: 'a', kind: 'jelly-matcha' }, { id: 'b', kind: 'cornflakes' }, { id: 'c', kind: 'cream' },
    { id: 'd', kind: 'redbean' }, { id: 'e', kind: 'ice-matcha' }, { id: 'f', kind: 'fruit-strawberry' }, { id: 'g', kind: 'cream' },
  ],
  top: [
    { id: 't1', type: 'cream', flavor: 'vanilla', x: 168, y: 136, size: 56 },
    { id: 't2', type: 'scoop', flavor: 'matcha', x: 222, y: 118, size: 46 },
  ],
  sauce: 'none',
  items: [],
});

export const emptyParfait = (): ParfaitData => ({ glass: 'parfait', layers: [], top: [], sauce: 'none', items: [] });

export const emptyCrepe = (): CrepeData => ({
  batter: 'original', cookLevel: 0, flipped: false, fillings: [], sauces: [], toppings: [], fold: 'cone', wrapper: 'pink', wrapperAsset: null, items: [],
});
export const sampleCrepe = (): CrepeData => ({
  ...emptyCrepe(), cookLevel: 1, flipped: true, fillings: ['cream-vanilla', 'fruit-strawberry', 'cheesecake'], sauces: ['condensed'], toppings: [],
});

export const emptyCookie = (): CookieData => ({
  dough: 'butter', added: [], mix: 0, knead: 0, roll: 0, cookies: [], bake: 0, icing: [], items: [],
  pack: { type: 'plate', color: '#F7B8C8', ribbon: '#E8607E', asset: null },
});
export const sampleCookie = (): CookieData => ({
  ...emptyCookie(), mix: 1, knead: 1, roll: 1, bake: 1,
  cookies: [
    { id: 'k1', kind: 'cookie', ref: 'heart', x: 170, y: 190, w: 150, h: 150, rotation: -10 },
    { id: 'k2', kind: 'cookie', ref: 'bear', x: 330, y: 200, w: 150, h: 150, rotation: 8 },
    { id: 'k3', kind: 'cookie', ref: 'star', x: 250, y: 340, w: 150, h: 150, rotation: 0 },
  ],
  icing: [
    { id: 'i1', cookieId: 'k1', color: '#F7B8C8', width: 6, points: [], flood: true },
    { id: 'i2', cookieId: 'k3', color: '#F6E5A9', width: 6, points: [], flood: true },
  ],
});
