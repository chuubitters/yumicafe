import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CafeLayout, StageItem } from '../types';
import { seasonNow, uid } from '../utils/misc';

const it = (ref: string, x: number, y: number, w: number, extra: Partial<StageItem> = {}): StageItem => ({
  id: uid('f'), kind: 'sprite', ref, x, y, w, h: w, rotation: 0, ...extra,
});

export const defaultCafe = (): CafeLayout => ({
  id: 'cafe-main',
  theme: seasonNow(),
  interior: {
    wallpaper: 'stripe-pink',
    floor: 'checker',
    items: [
      it('f-window', 300, 250, 260),
      it('f-curtain', 300, 240, 330),
      it('f-pendant', 640, 95, 110),
      it('f-pendant', 980, 95, 110),
      it('f-menuboard', 930, 280, 210, { text: 'Today: Cream Soda ♡' }),
      it('f-shelf', 640, 260, 240),
      it('f-counter', 780, 600, 520),
      it('f-espresso', 680, 450, 130),
      it('f-register', 900, 462, 110),
      it('f-table', 250, 640, 190),
      it('f-chair', 130, 640, 120),
      it('f-chair', 370, 640, 120, { flipX: true }),
      it('f-plant', 1120, 600, 170),
    ],
  },
  exterior: {
    wallpaper: 'facade',
    floor: 'street',
    facade: '#FBE3EA',
    awning: '#E8607E',
    signText: 'YUMI CAFÉ',
    items: [
      it('f-flowerpot', 170, 650, 120),
      it('f-signboard', 1020, 640, 150, { text: 'OPEN ♡' }),
      it('f-planter', 430, 690, 200),
    ],
  },
  updatedAt: Date.now(),
});

interface CafeState {
  layout: CafeLayout;
  setLayout: (l: CafeLayout) => void;
  addDisplay: (creationId: string, w: number, h: number) => void;
  reset: () => void;
}

export const useCafe = create<CafeState>()(
  persist(
    (set, get) => ({
      layout: defaultCafe(),
      setLayout: (layout) => set({ layout: { ...layout, updatedAt: Date.now() } }),
      addDisplay: (creationId, w, h) => {
        const l = get().layout;
        const count = l.interior.items.filter((i) => i.kind === 'creation').length;
        const size = 90;
        const item: StageItem = {
          id: uid('d'), kind: 'creation', ref: creationId,
          x: 620 + (count % 5) * 70, y: 400 - Math.floor(count / 5) * 30,
          w: size, h: (size * h) / w, rotation: 0,
        };
        set({ layout: { ...l, interior: { ...l.interior, items: [...l.interior.items, item] }, updatedAt: Date.now() } });
      },
      reset: () => set({ layout: defaultCafe() }),
    }),
    { name: 'yumi-cafe-layout' }
  )
);
