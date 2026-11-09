import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { sfx } from '../../utils/sound';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  jp?: string;
  children: ReactNode;
  wide?: boolean;
  footer?: ReactNode;
  dismissable?: boolean;
}

export function Modal({ open, onClose, title, jp, children, wide, footer, dismissable = true }: ModalProps) {
  const was = useRef(false);
  useEffect(() => {
    if (open && !was.current) sfx('open');
    if (!open && was.current) sfx('close');
    was.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && dismissable && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose, dismissable]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-[#5E4535]/40 backdrop-blur-[2px]" onClick={() => dismissable && onClose()} />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={`paper relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-b-none sm:rounded-3xl ${wide ? 'sm:max-w-4xl' : 'sm:max-w-lg'}`}
            initial={{ y: 60, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.97, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            {(title || dismissable) && (
              <div className="relative flex items-center gap-3 border-b-2 border-dotted border-strawberry/60 bg-gradient-to-b from-[#FFF0F4] to-transparent px-5 py-3">
                <span className="awning absolute inset-x-0 top-0 !h-[7px] opacity-90" aria-hidden />
                <div className="min-w-0 flex-1">
                  {jp && <div className="label-jp text-[11px] text-strawberry-deep">{jp}</div>}
                  {title && <h2 className="font-display text-lg leading-tight text-cocoa-dark">{title}</h2>}
                </div>
                {dismissable && (
                  <button className="btn-icon !h-9 !w-9" onClick={onClose} aria-label="Close">
                    <X size={18} />
                  </button>
                )}
              </div>
            )}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
            {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#F1E3CF] bg-cream/60 px-5 py-3 pb-safe">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
