import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  musicEnabled: boolean;
  soundEnabled: boolean;
  volume: number;
  reducedMotion: boolean;
  albumCoverId: string | null;
  stageBg: Record<string, string>;
  set: (p: Partial<Omit<SettingsState, 'set'>>) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      musicEnabled: false,
      soundEnabled: true,
      volume: 0.7,
      reducedMotion: false,
      albumCoverId: null,
      stageBg: {},
      set: (p) => set(p),
    }),
    { name: 'yumi-settings' }
  )
);
