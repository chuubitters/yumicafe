import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ACHIEVEMENTS, LOCK_MAP, type Counters } from '../data/catalog';
import { toast } from './toastStore';
import { sfx } from '../utils/sound';

export const STARS_PER_LEVEL = 60;
export const levelFor = (totalEarned: number) => Math.floor(totalEarned / STARS_PER_LEVEL) + 1;

interface Player { id: string; name: string; createdAt: number }

interface GameState {
  player: Player | null;
  stars: number; // spendable balance
  totalEarned: number;
  unlockedItems: string[];
  completedAchievements: string[];
  counters: Counters;
  lastRoute: string;
  recent: string[];
  lastGift: string;
  claimGift: () => boolean;
  createPlayer: (name: string) => void;
  rename: (name: string) => void;
  earn: (n: number, reason?: string) => void;
  spend: (n: number) => boolean;
  unlock: (key: string) => void;
  bump: (k: keyof Counters, n?: number) => void;
  setLastRoute: (r: string) => void;
  isUnlocked: (key: string) => boolean;
}

const zero: Counters = { drink: 0, parfait: 0, crepe: 0, cookie: 0, cafe: 0, cookiesBaked: 0, uploads: 0, exports: 0, recipes: 0, cafeEdits: 0, photos: 0 };

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      player: null,
      stars: 30,
      totalEarned: 30,
      unlockedItems: [],
      completedAchievements: [],
      counters: zero,
      lastRoute: '/drink',
      recent: [],
      lastGift: '',
      claimGift: () => {
        const today = new Date().toDateString();
        if (get().lastGift === today) return false;
        set({ lastGift: today });
        get().earn(10, 'Daily café gift');
        return true;
      },
      createPlayer: (name) => set({ player: { id: 'p_' + Date.now(), name: name || 'Yumi', createdAt: Date.now() } }),
      rename: (name) => set({ player: { ...(get().player || { id: 'p', createdAt: Date.now(), name }), name } }),
      earn: (n, reason) => {
        const before = levelFor(get().totalEarned);
        set({ stars: get().stars + n, totalEarned: get().totalEarned + n });
        if (reason) toast(`+${n} stars · ${reason}`, 'star');
        const after = levelFor(get().totalEarned);
        if (after > before) {
          setTimeout(() => {
            sfx('levelup');
            toast(`Café level up! You're now level ${after}`, 'success');
          }, 500);
        }
      },
      spend: (n) => {
        if (get().stars < n) return false;
        set({ stars: get().stars - n });
        return true;
      },
      unlock: (key) => set({ unlockedItems: Array.from(new Set([...get().unlockedItems, key])) }),
      bump: (k, n = 1) => {
        const counters = { ...get().counters, [k]: (get().counters[k] || 0) + n };
        set({ counters });
        // achievements
        ACHIEVEMENTS.forEach((a) => {
          if (!get().completedAchievements.includes(a.id) && a.check(counters)) {
            set({ completedAchievements: [...get().completedAchievements, a.id] });
            setTimeout(() => get().earn(a.stars, `Achievement: ${a.name}`), 900);
          }
        });
      },
      setLastRoute: (r) => set({ lastRoute: r }),
      isUnlocked: (key) => {
        const lock = LOCK_MAP[key];
        if (!lock) return true;
        if (get().unlockedItems.includes(key)) return true;
        if (lock.level && levelFor(get().totalEarned) >= lock.level) return true;
        return false;
      },
    }),
    { name: 'yumi-progress' }
  )
);

/** React hook helper that re-renders on unlock / level changes */
export function useUnlocked() {
  useGame((s) => s.unlockedItems.length + s.totalEarned);
  return useGame.getState().isUnlocked;
}
