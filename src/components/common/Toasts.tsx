import { AnimatePresence, motion } from 'framer-motion';
import { Star, Info, AlertCircle, Check } from 'lucide-react';
import { useToasts } from '../../store/toastStore';

export function Toasts() {
  const toasts = useToasts((s) => s.toasts);
  const dismiss = useToasts((s) => s.dismiss);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[150] flex flex-col items-center gap-2 px-3" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            layout
            onClick={() => dismiss(t.id)}
            initial={{ y: -40, opacity: 0, scale: 0.8, rotate: -3 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
            whileHover={{ scale: 1.04 }}
            className={`pointer-events-auto flex max-w-sm items-center gap-2 rounded-full border-2 bg-kiss-cream px-4 py-2 text-sm font-bold shadow-plaque ${
              t.tone === 'star' ? 'border-butter text-cocoa-dark' : t.tone === 'error' ? 'border-strawberry-dark text-strawberry-dark' : t.tone === 'success' ? 'border-matcha text-matcha-dark' : 'border-strawberry text-cocoa-dark'
            }`}
          >
            {t.tone === 'star' ? <Star size={16} className="fill-[#F6C945] text-[#E0A82E]" /> : t.tone === 'error' ? <AlertCircle size={16} /> : t.tone === 'success' ? <Check size={16} /> : <Info size={16} className="text-strawberry-deep" />}
            {t.text}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
