import { create } from 'zustand';
import type { AssetMeta, UploadedAsset } from '../types';
import { assetDB, idb } from '../utils/db';
import { uid } from '../utils/misc';

interface AssetState {
  ready: boolean;
  assets: AssetMeta[];
  urls: Record<string, string>;
  load: () => Promise<void>;
  add: (blob: Blob, name: string, width: number, height: number) => Promise<string>;
  remove: (id: string) => Promise<void>;
  getBlob: (id: string) => Promise<Blob | undefined>;
}

export const useAssets = create<AssetState>((set, get) => ({
  ready: false,
  assets: [],
  urls: {},
  load: async () => {
    try {
      const entries = await idb.entries<UploadedAsset>(assetDB);
      const assets: AssetMeta[] = [];
      const urls: Record<string, string> = {};
      entries.forEach(([, a]) => {
        if (!a || !a.imageBlob) return;
        assets.push({ id: a.id, name: a.name, width: a.width, height: a.height, createdAt: a.createdAt });
        urls[a.id] = URL.createObjectURL(a.imageBlob);
      });
      assets.sort((a, b) => b.createdAt - a.createdAt);
      set({ assets, urls, ready: true });
    } catch (e) {
      console.warn('IndexedDB unavailable', e);
      set({ ready: true });
    }
  },
  add: async (blob, name, width, height) => {
    const id = uid('img');
    const asset: UploadedAsset = { id, name, imageBlob: blob, width, height, createdAt: Date.now() };
    await idb.set(id, asset, assetDB);
    set({
      assets: [{ id, name, width, height, createdAt: asset.createdAt }, ...get().assets],
      urls: { ...get().urls, [id]: URL.createObjectURL(blob) },
    });
    return id;
  },
  remove: async (id) => {
    await idb.del(id, assetDB);
    const urls = { ...get().urls };
    if (urls[id]) URL.revokeObjectURL(urls[id]);
    delete urls[id];
    set({ assets: get().assets.filter((a) => a.id !== id), urls });
  },
  getBlob: async (id) => (await idb.get<UploadedAsset>(id, assetDB))?.imageBlob,
}));
