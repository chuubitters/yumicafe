import { create } from 'zustand';
import { Modal } from './Modal';

interface ConfirmState {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  resolve: ((v: boolean) => void) | null;
}
const useConfirmStore = create<ConfirmState>(() => ({ open: false, title: '', message: '', confirmLabel: 'OK', resolve: null }));

export function confirmDialog(title: string, message: string, confirmLabel = 'Yes, do it') {
  return new Promise<boolean>((resolve) => useConfirmStore.setState({ open: true, title, message, confirmLabel, resolve }));
}

export function ConfirmHost() {
  const s = useConfirmStore();
  const close = (v: boolean) => {
    s.resolve?.(v);
    useConfirmStore.setState({ open: false, resolve: null });
  };
  return (
    <Modal open={s.open} onClose={() => close(false)} title={s.title} jp="かくにん"
      footer={<><button className="btn-cream" onClick={() => close(false)}>Cancel</button><button className="btn-deep" onClick={() => close(true)}>{s.confirmLabel}</button></>}>
      <p className="text-sm text-cocoa">{s.message}</p>
    </Modal>
  );
}
