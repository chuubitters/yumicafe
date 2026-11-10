import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Copy, Download, Heart, ImagePlus, PenLine, Search, Store, Trash2 } from 'lucide-react';
import { useCollection } from '../store/collectionStore';
import { useSettings } from '../store/settingsStore';
import { useAssets } from '../store/assetStore';
import { useCafe } from '../store/cafeStore';
import { useGame } from '../store/gameStore';
import { Modal } from '../components/common/Modal';
import { confirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/LoadingScreen';
import { openImageLibrary } from '../components/game/ImageLibrary';
import { toast } from '../store/toastStore';
import { creationCard } from '../utils/exportImage';
import { downloadBlob, formatDate, safeName } from '../utils/misc';
import { sfx } from '../utils/sound';
import type { Creation } from '../types';
import { ModeFrame, TitleBlock, Stamp } from '../components/common/PosterTitle';
import { Glyph, type GlyphName } from '../components/common/Glyph';

const CATS = [
  { id: 'all', label: 'All', jp: 'すべて' },
  { id: 'drink', label: 'Drinks', jp: 'ドリンク' },
  { id: 'parfait', label: 'Parfaits', jp: 'パフェ' },
  { id: 'crepe', label: 'Crêpes', jp: 'クレープ' },
  { id: 'cookie', label: 'Cookies', jp: 'クッキー' },
  { id: 'cafe', label: 'Café Designs', jp: 'カフェ' },
  { id: 'recipe', label: 'Special Recipes', jp: 'レシピ' },
  { id: 'season', label: 'Seasonal', jp: '季節' },
  { id: 'fav', label: 'Favorites', jp: 'お気に入り' },
];
const ROUTES: Record<string, string> = { drink: '/drink', parfait: '/parfait', crepe: '/crepe', cookie: '/cookie', cafe: '/cafe' };
const TAPE = ['#F7B8C8', '#B9CBA5', '#F6E5A9', '#C9E2EF', '#F5D0BE'];

export default function MyCollection() {
  const creations = useCollection((s) => s.creations);
  const previews = useCollection((s) => s.previews);
  const toggleFav = useCollection((s) => s.toggleFavorite);
  const remove = useCollection((s) => s.remove);
  const duplicate = useCollection((s) => s.duplicate);
  const rename = useCollection((s) => s.rename);
  const cover = useSettings((s) => s.albumCoverId);
  const setS = useSettings((s) => s.set);
  const coverUrl = useAssets((s) => (cover ? s.urls[cover] : undefined));
  const player = useGame((s) => s.player);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState<'new' | 'old' | 'name'>('new');
  const [open, setOpen] = useState<Creation | null>(null);
  const [params, setParams] = useSearchParams();
  const nav = useNavigate();

  useEffect(() => {
    const id = params.get('open');
    if (id) {
      const c = creations.find((x) => x.id === id);
      if (c) setOpen(c);
      params.delete('open');
      setParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const list = useMemo(() => {
    let l = creations.filter((c) => {
      if (cat === 'fav') return c.isFavorite;
      if (cat === 'recipe') return !!c.isRecipe;
      if (cat === 'season') return !!c.season;
      if (cat !== 'all') return c.type === cat;
      return true;
    });
    if (q.trim()) {
      const s = q.toLowerCase();
      l = l.filter((c) => c.name.toLowerCase().includes(s) || c.ingredients.some((i) => i.toLowerCase().includes(s)));
    }
    return [...l].sort((a, b) => (sort === 'new' ? b.createdAt - a.createdAt : sort === 'old' ? a.createdAt - b.createdAt : a.name.localeCompare(b.name)));
  }, [creations, cat, q, sort]);

  const current = open ? creations.find((c) => c.id === open.id) || null : null;

  const exportCard = async (c: Creation) => {
    const url = previews[c.id];
    if (!url) return;
    downloadBlob(await creationCard(url, c.name, c.type, c.ingredients), `${safeName(c.name)}-card.png`);
    useGame.getState().bump('exports');
    sfx('shutter');
  };

  return (
    <ModeFrame mode="collection" className="mx-auto flex max-w-[1400px] flex-col gap-4 px-3 py-4 md:px-5">
      {/* album cover */}
      <section className="paper relative flex flex-col items-center gap-4 overflow-hidden p-4 sm:flex-row sm:p-5" style={{ background: 'linear-gradient(135deg,#FBE3EA 0%,#FFF8ED 60%,#EEF3E6 100%)' }}>
        <div className="relative h-32 w-28 shrink-0 rotate-[-4deg] overflow-hidden rounded-xl border-[6px] border-white bg-strawberry shadow-card">
          {coverUrl ? <img src={coverUrl} alt="Album cover" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center"><Glyph name="notebook" size="55%" /></div>}
          <span className="absolute -top-1 left-6 h-4 w-14 rotate-[-8deg] bg-butter/80" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="poster-kicker">コレクションブック</div>
          <h1 className="poster-title text-2xl sm:text-3xl">{player?.name || 'Yumi'}’s Sweet Collection</h1>
          <p className="text-sm text-cocoa">{creations.length} creations · {creations.filter((c) => c.isFavorite).length} favorites</p>
        </div>
        <button className="btn-cream btn-sm" onClick={async () => { const id = await openImageLibrary('Album cover'); if (id) setS({ albumCoverId: id }); }}><ImagePlus size={14} />Album cover</button>
      </section>

      {/* filters */}
      <section className="flex flex-col gap-2 md:flex-row md:items-center">
        <label className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cocoa-light" />
          <input className="input !pl-9" placeholder="Search names or ingredients…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search creations" />
        </label>
        <select className="input md:!w-44" value={sort} onChange={(e) => setSort(e.target.value as any)} aria-label="Sort">
          <option value="new">Newest first</option>
          <option value="old">Oldest first</option>
          <option value="name">Name A–Z</option>
        </select>
      </section>
      <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {CATS.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)} className={`chip shrink-0 ${cat === c.id ? '!border-strawberry-deep !bg-strawberry text-[#7A2E43]' : ''}`}>
            {c.label} <span className="label-jp text-[9px] opacity-70">{c.jp}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState title={creations.length ? 'Nothing matches' : 'Your collection book is empty'} text={creations.length ? 'Try another search or category.' : 'Every dessert you finish is saved here. Start in any kitchen!'}
          action={!creations.length && <Link to="/drink" className="btn-pink">Make my first drink</Link>} />
      ) : (
        <motion.div layout className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <AnimatePresence>
            {list.map((c, i) => (
              <motion.article key={c.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="paper card-hover relative flex cursor-pointer flex-col p-2.5 pb-3" style={{ rotate: `${((i % 5) - 2) * 0.7}deg` }} onClick={() => setOpen(c)}>
                <span className="absolute -top-2 left-1/2 z-10 h-5 w-16 -translate-x-1/2 rotate-[-3deg] opacity-80" style={{ background: TAPE[i % TAPE.length] }} />
                <div className={`grid aspect-square place-items-center overflow-hidden rounded-2xl ${c.type === 'cafe' ? 'bg-sky' : 'bg-strawberry-drip'}`}>
                  {previews[c.id] ? <img src={previews[c.id]} alt={c.name} className={c.type === 'cafe' ? 'h-full w-full object-cover' : 'max-h-[92%] max-w-[92%] object-contain drop-shadow'} loading="lazy" /> : <Glyph name="cake" size={44} />}
                </div>
                <div className="mt-2 flex items-start gap-1">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-sm">{c.name}</h3>
                    <p className="text-[10px] text-cocoa">{CATS.find((x) => x.id === c.type)?.label} · {formatDate(c.createdAt)}</p>
                  </div>
                  <button aria-label={c.isFavorite ? 'Unfavorite' : 'Favorite'} onClick={(e) => { e.stopPropagation(); toggleFav(c.id); sfx('pop'); }} className="p-1">
                    <Heart size={18} className={c.isFavorite ? 'fill-strawberry-deep text-strawberry-deep' : 'text-cocoa-light'} />
                  </button>
                </div>
                {c.isRecipe && <span className="absolute right-3 top-3 rounded-full bg-matcha-deep px-2 py-0.5 text-[9px] font-bold text-white">レシピ</span>}
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Modal open={!!current} onClose={() => setOpen(null)} title={current?.name} jp={current ? CATS.find((x) => x.id === current.type)?.jp : ''} wide>
        {current && (
          <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
            <div className={`grid place-items-center rounded-3xl p-3 ${current.type === 'cafe' ? 'bg-sky' : 'bg-strawberry-drip'}`}>
              {previews[current.id] && <img src={previews[current.id]} alt={current.name} className="max-h-[56vh] w-auto rounded-xl" />}
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold">Name
                <input className="input mt-1" value={current.name} maxLength={40} onChange={(e) => rename(current.id, e.target.value)} />
              </label>
              <p className="text-xs text-cocoa">Created {formatDate(current.createdAt)}{current.updatedAt !== current.createdAt ? ` · edited ${formatDate(current.updatedAt)}` : ''}</p>
              <div className="flex flex-wrap gap-1.5">{current.ingredients.map((i) => <span key={i} className="chip">{i}</span>)}</div>
              <div className="grid grid-cols-2 gap-2">
                <button className="btn-deep" onClick={() => nav(`${ROUTES[current.type]}?edit=${current.id}`)}><PenLine size={16} />Edit</button>
                <button className={current.isFavorite ? 'btn-pink' : 'btn-cream'} onClick={() => toggleFav(current.id)}><Heart size={16} className={current.isFavorite ? 'fill-current' : ''} />{current.isFavorite ? 'Favorited' : 'Favorite'}</button>
                <button className="btn-butter" onClick={() => exportCard(current)}><Download size={16} />Export card</button>
                <button className="btn-cream" onClick={async () => { const b = await (await fetch(previews[current.id])).blob(); downloadBlob(b, `${safeName(current.name)}.png`); sfx('shutter'); }}><Download size={16} />PNG</button>
                {current.type !== 'cafe' && <button className="btn-matcha" onClick={() => { useCafe.getState().addDisplay(current.id, current.previewW, current.previewH); toast('Displayed in your café', 'success'); nav('/cafe'); }}><Store size={16} />Display in café</button>}
                <button className="btn-sky" onClick={() => nav(`/photo?creation=${current.id}`)}><Camera size={16} />Photo Studio</button>
                <button className="btn-cream" onClick={async () => { const c = await duplicate(current.id); if (c) { toast('Duplicated', 'success'); setOpen(c); } }}><Copy size={16} />Duplicate</button>
                <button className="btn-cream !text-strawberry-dark" onClick={async () => {
                  if (await confirmDialog('Delete creation?', `“${current.name}” will be removed from your collection.`, 'Delete')) {
                    await remove(current.id);
                    setOpen(null);
                    toast('Deleted', 'info');
                  }
                }}><Trash2 size={16} />Delete</button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </ModeFrame>
  );
}
