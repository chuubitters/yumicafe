import { create } from 'zustand';
import { uid } from '../utils/misc';
import { sfx } from '../utils/sound';

export interface Toast { id: string; text: string; tone: 'info' | 'star' | 'error' | 'success'; icon?: string }

interface ToastState {
  toasts: Toast[];
  push: (text: string, tone?: Toast['tone'], icon?: string) => void;
  dismiss: (id: string) => void;
}

export const useToasts = create<ToastState>((set, get) => ({
  toasts: [],
  push: (text, tone = 'info', icon) => {
    const id = uid('t');
    sfx(tone === 'error' ? 'error' : tone === 'star' ? 'tick' : tone === 'success' ? 'sparkle' : 'pop');
    set({ toasts: [...get().toasts.slice(-3), { id, text, tone, icon }] });
    setTimeout(() => get().dismiss(id), 3200);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

export const toast = (text: string, tone?: Toast['tone'], icon?: string) => useToasts.getState().push(text, tone, icon);
