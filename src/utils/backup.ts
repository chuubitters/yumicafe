import { assetDB, idb, previewDB } from './db';
import type { UploadedAsset } from '../types';
import { blobToDataURL, dataURLToBlob, downloadBlob } from './misc';

const KEYS = ['yumi-settings', 'yumi-progress', 'yumi-collection', 'yumi-cafe-layout', 'yumi-photo-project'];

export async function exportSave() {
  const ls: Record<string, string | null> = {};
  KEYS.forEach((k) => (ls[k] = localStorage.getItem(k)));
  const assets = await Promise.all(
    (await idb.entries<UploadedAsset>(assetDB)).map(async ([, a]) => ({ id: a.id, name: a.name, width: a.width, height: a.height, createdAt: a.createdAt, data: await blobToDataURL(a.imageBlob) }))
  );
  const previews = await Promise.all((await idb.entries<Blob>(previewDB)).map(async ([k, b]) => ({ id: String(k), data: await blobToDataURL(b) })));
  const json = JSON.stringify({ app: 'yumi-cafe', version: 1, exportedAt: Date.now(), localStorage: ls, assets, previews });
  downloadBlob(new Blob([json], { type: 'application/json' }), `yumi-cafe-save-${new Date().toISOString().slice(0, 10)}.json`);
}

export async function importSave(file: File) {
  const data = JSON.parse(await file.text());
  if (data.app !== 'yumi-cafe') throw new Error('This is not a YUMI CAFÉ save file');
  await idb.clear(assetDB);
  await idb.clear(previewDB);
  for (const a of data.assets || []) {
    await idb.set(a.id, { id: a.id, name: a.name, width: a.width, height: a.height, createdAt: a.createdAt, imageBlob: await dataURLToBlob(a.data) }, assetDB);
  }
  for (const p of data.previews || []) await idb.set(p.id, await dataURLToBlob(p.data), previewDB);
  KEYS.forEach((k) => {
    const v = data.localStorage?.[k];
    if (v) localStorage.setItem(k, v);
    else localStorage.removeItem(k);
  });
}

export async function resetAll() {
  KEYS.forEach((k) => localStorage.removeItem(k));
  sessionStorage.clear();
  await idb.clear(assetDB);
  await idb.clear(previewDB);
}
