import { useCallback, useRef, useState } from 'react';

/**
 * Undo / redo history for any immutable state object.
 * - set(next)            → commits a new history entry
 * - setLive(next)        → updates without committing (e.g. while dragging)
 * - commitFrom(snapshot) → commit a live change, using the snapshot taken before it began
 */
export function useHistory<T>(initial: T | (() => T)) {
  const [state, setState] = useState<{ past: T[]; present: T; future: T[] }>(() => ({
    past: [],
    present: typeof initial === 'function' ? (initial as () => T)() : initial,
    future: [],
  }));
  const liveStart = useRef<T | null>(null);

  const set = useCallback((next: T | ((p: T) => T)) => {
    setState((s) => {
      const value = typeof next === 'function' ? (next as (p: T) => T)(s.present) : next;
      if (value === s.present) return s;
      return { past: [...s.past.slice(-60), s.present], present: value, future: [] };
    });
  }, []);

  const setLive = useCallback((next: T | ((p: T) => T)) => {
    setState((s) => {
      if (liveStart.current == null) liveStart.current = s.present;
      const value = typeof next === 'function' ? (next as (p: T) => T)(s.present) : next;
      return { ...s, present: value };
    });
  }, []);

  const commitLive = useCallback(() => {
    setState((s) => {
      const start = liveStart.current;
      liveStart.current = null;
      if (start == null || start === s.present) return s;
      return { past: [...s.past.slice(-60), start], present: s.present, future: [] };
    });
  }, []);

  const undo = useCallback(() => {
    setState((s) => {
      if (!s.past.length) return s;
      const prev = s.past[s.past.length - 1];
      return { past: s.past.slice(0, -1), present: prev, future: [s.present, ...s.future] };
    });
  }, []);

  const redo = useCallback(() => {
    setState((s) => {
      if (!s.future.length) return s;
      const [next, ...rest] = s.future;
      return { past: [...s.past, s.present], present: next, future: rest };
    });
  }, []);

  const reset = useCallback((value: T) => setState({ past: [], present: value, future: [] }), []);

  return {
    state: state.present,
    set,
    setLive,
    commitLive,
    undo,
    redo,
    reset,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
