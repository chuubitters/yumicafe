import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCollection } from '../store/collectionStore';
import { useSettings } from '../store/settingsStore';
import type { CreationType } from '../types';

/** Shared plumbing for the four kitchens: edit-from-collection loading, stage background, selected item. */
export function useStudio<T>(type: CreationType, onLoad: (data: T, id: string) => void) {
  const [params, setParams] = useSearchParams();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const bg = useSettings((s) => s.stageBg[type]);
  const setS = useSettings((s) => s.set);
  const stageBgMap = useSettings((s) => s.stageBg);

  useEffect(() => {
    const id = params.get('edit');
    if (!id) return;
    const c = useCollection.getState().get(id);
    if (c && c.type === type) {
      onLoad(structuredClone(c.data) as T, id);
      setEditingId(id);
    }
    params.delete('edit');
    setParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setBg = (v: string) => setS({ stageBg: { ...stageBgMap, [type]: v } });
  return { editingId, setEditingId, selectedId, setSelectedId, svgRef, bg, setBg };
}

export const STAGE_BGS = [
  { id: 'bg-kissaten', name: 'Kissaten' },
  { id: 'bg-strawberry-drip', name: 'Strawberry' },
  { id: 'bg-matcha-tatami', name: 'Matcha' },
  { id: 'bg-summer-sky', name: 'Summer' },
  { id: 'bg-bakery', name: 'Bakery' },
  { id: 'bg-sakura', name: 'Sakura' },
  { id: 'bg-gingham', name: 'Gingham' },
];
