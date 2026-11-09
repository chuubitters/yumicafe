import { createStore, get, set, del, keys, clear, entries } from 'idb-keyval';

// Separate IndexedDB databases for large binary data.
export const assetDB = createStore('yumi-cafe-assets', 'assets');
export const previewDB = createStore('yumi-cafe-previews', 'previews');

export const idb = {
  get: <T>(k: string, store = assetDB) => get<T>(k, store),
  set: (k: string, v: unknown, store = assetDB) => set(k, v, store),
  del: (k: string, store = assetDB) => del(k, store),
  keys: (store = assetDB) => keys(store),
  entries: <V>(store = assetDB) => entries<IDBValidKey, V>(store),
  clear: (store = assetDB) => clear(store),
};
