import { useRef, useState } from 'react';
import { Download, Music, RotateCcw, Upload, Volume2 } from 'lucide-react';
import { MOD } from '../components/game/StudioShell';
import { Modal } from '../components/common/Modal';
import { useSettings } from '../store/settingsStore';
import { useGame } from '../store/gameStore';
import { exportSave, importSave, resetAll } from '../utils/backup';
import { confirmDialog } from '../components/common/ConfirmDialog';
import { toast } from '../store/toastStore';
import { applyVolume, setMusic, sfx } from '../utils/sound';
import { Glyph, type GlyphName } from '../components/common/Glyph';

function Toggle({ on, onChange, label, icon }: { on: boolean; onChange: (v: boolean) => void; label: string; icon: React.ReactNode }) {
  return (
    <button role="switch" aria-checked={on} onClick={() => onChange(!on)} className="flex w-full items-center gap-3 rounded-2xl bg-white px-3 py-2.5 text-sm font-bold shadow-sm">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-cream">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      <span className={`relative h-6 w-11 rounded-full transition ${on ? 'bg-strawberry-deep' : 'bg-[#E8DCCB]'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
      </span>
    </button>
  );
}

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useSettings();
  const player = useGame((g) => g.player);
  const rename = useGame((g) => g.rename);
  const [name, setName] = useState(player?.name || '');
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  return (
    <Modal open={open} onClose={onClose} title="Settings" jp="せってい">
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold">Café owner name
          <div className="mt-1 flex gap-2">
            <input className="input" value={name} maxLength={20} onChange={(e) => setName(e.target.value)} />
            <button className="btn-pink" onClick={() => { rename(name.trim() || 'Yumi'); toast('Name saved', 'success'); }}>Save</button>
          </div>
        </label>
        <Toggle on={s.soundEnabled} onChange={(v) => { s.set({ soundEnabled: v }); if (v) sfx('pop'); }} label="Sound effects" icon={<Volume2 size={16} />} />
        <Toggle on={s.musicEnabled} onChange={(v) => { s.set({ musicEnabled: v }); setMusic(v); }} label="Café music" icon={<Music size={16} />} />
        <label className="flex flex-col gap-1 rounded-2xl bg-white px-3 py-2.5 text-sm font-bold shadow-sm">Volume
          <input type="range" min={0} max={1} step={0.05} value={s.volume} onChange={(e) => { s.set({ volume: +e.target.value }); applyVolume(+e.target.value); }} onPointerUp={() => sfx('pop')} />
        </label>
        <Toggle on={s.reducedMotion} onChange={(v) => s.set({ reducedMotion: v })} label="Reduce motion" icon={<Glyph name="turtle" size={18} />} />
        <div className="hidden rounded-2xl bg-white px-3 py-2.5 shadow-sm [@media(hover:hover)]:block">
          <h3 className="mb-1.5 font-display text-sm">Keyboard shortcuts <span className="text-[10px] font-normal text-cocoa">(select a sticker first)</span></h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
            {[[`${MOD}+Z / ${MOD}+Shift+Z`, 'Undo / Redo'], ['Arrow keys', 'Nudge 2 px (Shift = 10 px)'], ['[  ]', 'Rotate (Shift = 45°)'], ['-  +', 'Smaller / bigger'], ['F', 'Flip'], [`${MOD}+D`, 'Duplicate'], ['Delete', 'Remove'], ['Esc', 'Deselect']].map(([k, v]) => (
              <div key={k} className="contents"><dt><kbd className="rounded-md border border-[#E6D7C3] bg-cream px-1.5 py-0.5 font-mono text-[10px] font-bold">{k}</kbd></dt><dd className="text-cocoa">{v}</dd></div>
            ))}
          </dl>
        </div>
        <div className="mt-2 rounded-2xl border-2 border-dashed border-strawberry/60 p-3">
          <h3 className="mb-2 font-display text-sm">Backup & data</h3>
          <p className="mb-3 text-xs text-cocoa">Everything is saved in this browser. Download a backup file to move your café to another device.</p>
          <div className="flex flex-wrap gap-2">
            <button className="btn-matcha btn-sm" disabled={busy} onClick={async () => { setBusy(true); try { await exportSave(); toast('Backup downloaded', 'success'); } finally { setBusy(false); } }}><Download size={14} />Export save</button>
            <button className="btn-sky btn-sm" onClick={() => fileRef.current?.click()}><Upload size={14} />Import save</button>
            <button className="btn-cream btn-sm !text-strawberry-dark" onClick={async () => {
              if (await confirmDialog('Reset everything?', 'This deletes all creations, uploads, café layout and progress on this device. This cannot be undone.', 'Reset all data')) {
                await resetAll();
                location.reload();
              }
            }}><RotateCcw size={14} />Reset data</button>
          </div>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (!f) return;
            if (!(await confirmDialog('Import save?', 'This replaces the current café on this device with the backup.', 'Import'))) return;
            try { await importSave(f); location.reload(); } catch (err: any) { toast(err?.message || 'Import failed', 'error'); }
          }} />
        </div>
      </div>
    </Modal>
  );
}
