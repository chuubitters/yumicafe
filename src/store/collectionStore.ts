import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Creation } from '../types';
import { idb, previewDB } from '../utils/db';
import { uid } from '../utils/misc';

interface CollectionState {
  creations: Creation[];
  previews: Record<string, string>; // object URLs (memory only)
  previewsReady: boolean;
  loadPreviews: () => Promise<void>;
  save: (c: Omit<Creation, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite'> & { id?: string }, preview: Blob) => Promise<Creation>;
  duplicate: (id: string) => Promise<Creation | null>;
  remove: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => void;
  rename: (id: string, name: string) => void;
  get: (id: string) => Creation | undefined;
}

export const useCollection = create<CollectionState>()(
  persist(
    (set, get) => ({
      creations: [],
      previews: {},
      previewsReady: false,
      loadPreviews: async () => {
        const previews: Record<string, string> = {};
        try {
          await Promise.all(
            get().creations.map(async (c) => {
              const b = await idb.get<Blob>(c.id, previewDB);
              if (b) previews[c.id] = URL.createObjectURL(b);
            })
          );
        } catch (e) {
          console.warn(e);
        }
        set({ previews, previewsReady: true });
      },
      save: async (input, preview) => {
        const now = Date.now();
        const existing = input.id ? get().creations.find((c) => c.id === input.id) : undefined;
        const creation: Creation = existing
          ? { ...existing, ...input, id: existing.id, updatedAt: now }
          : { ...input, id: uid('c'), createdAt: now, updatedAt: now, isFavorite: false };
        await idb.set(creation.id, preview, previewDB);
        const previews = { ...get().previews };
        if (previews[creation.id]) URL.revokeObjectURL(previews[creation.id]);
        previews[creation.id] = URL.createObjectURL(preview);
        set({
          creations: existing
            ? get().creations.map((c) => (c.id === creation.id ? creation : c))
            : [creation, ...get().creations],
          previews,
        });
        return creation;
      },
      duplicate: async (id) => {
        const c = get().get(id);
        if (!c) return null;
        const blob = await idb.get<Blob>(id, previewDB);
        if (!blob) return null;
        const copy: Creation = { ...structuredClone(c), id: uid('c'), name: c.name + ' (copy)', createdAt: Date.now(), updatedAt: Date.now(), isFavorite: false };
        await idb.set(copy.id, blob, previewDB);
        set({ creations: [copy, ...get().creations], previews: { ...get().previews, [copy.id]: URL.createObjectURL(blob) } });
        return copy;
      },
      remove: async (id) => {
        await idb.del(id, previewDB);
        const previews = { ...get().previews };
        if (previews[id]) URL.revokeObjectURL(previews[id]);
        delete previews[id];
        set({ creations: get().creations.filter((c) => c.id !== id), previews });
      },
      toggleFavorite: (id) => set({ creations: get().creations.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c)) }),
      rename: (id, name) => set({ creations: get().creations.map((c) => (c.id === id ? { ...c, name } : c)) }),
      get: (id) => get().creations.find((c) => c.id === id),
    }),
    { name: 'yumi-collection', partialize: (s) => ({ creations: s.creations }) }
  )
);
