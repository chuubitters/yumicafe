import { motion } from 'framer-motion';
import { Glyph } from './Glyph';

export function LoadingScreen({ label = 'Brewing your café…' }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-cocoa">
      <motion.div className="text-6xl" animate={{ rotate: [0, -10, 10, 0], y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
        <Glyph name="strawberry" />
      </motion.div>
      <p className="font-display text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="paper stitch flex flex-col items-center gap-3 px-6 py-10 text-center">
      <Glyph name="cupcake" size={52} className="anim-bob" />
      <h3 className="font-display text-lg">{title}</h3>
      {text && <p className="max-w-sm text-sm text-cocoa">{text}</p>}
      {action}
    </div>
  );
}
