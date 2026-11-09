import { useState } from 'react';
import { Palette } from 'lucide-react';
import { STAGE_BGS } from '../../hooks/useStudio';

export function BgPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button className="btn-icon !h-9 !w-9" onClick={() => setOpen((o) => !o)} aria-label="Change backdrop" title="Backdrop"><Palette size={16} /></button>
      {open && (
        <div className="paper absolute right-0 top-11 z-20 grid w-44 grid-cols-2 gap-1.5 p-2">
          {STAGE_BGS.map((b) => (
            <button key={b.id} onClick={() => { onChange(b.id); setOpen(false); }} className={`${b.id} h-12 rounded-xl border-2 text-[10px] font-bold ${value === b.id ? 'border-strawberry-deep' : 'border-white'}`}>
              <span className="rounded bg-white/80 px-1">{b.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
