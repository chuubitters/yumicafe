import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { MainLayout } from './components/layout/MainLayout';
import { Toasts } from './components/common/Toasts';
import { ConfirmHost } from './components/common/ConfirmDialog';
import { ImageLibraryHost } from './components/game/ImageLibrary';
import { DragGhost } from './components/game/dnd';
import { LoadingScreen } from './components/common/LoadingScreen';
import { ArtDefs } from './art/Defs';
import { useAssets } from './store/assetStore';
import { useCollection } from './store/collectionStore';
import { useSettings } from './store/settingsStore';
import { useGame } from './store/gameStore';
import { setMusic } from './utils/sound';
import Welcome from './pages/Welcome';
import Home from './pages/Home';

const DrinkStudio = lazy(() => import('./pages/DrinkStudio'));
const ParfaitAtelier = lazy(() => import('./pages/ParfaitAtelier'));
const CrepeKitchen = lazy(() => import('./pages/CrepeKitchen'));
const CookieBakery = lazy(() => import('./pages/CookieBakery'));
const MyCafe = lazy(() => import('./pages/MyCafe'));
const MyCollection = lazy(() => import('./pages/MyCollection'));
const PhotoStudio = lazy(() => import('./pages/PhotoStudio'));
const Shop = lazy(() => import('./pages/Shop'));

const Router = __HASH_ROUTER__ ? HashRouter : BrowserRouter;

export default function App() {
  const [entered, setEntered] = useState(() => sessionStorage.getItem('yumi-entered') === '1' && !!useGame.getState().player);
  const reduced = useSettings((s) => s.reducedMotion);
  const music = useSettings((s) => s.musicEnabled);

  useEffect(() => {
    useAssets.getState().load();
    useCollection.getState().loadPreviews();
  }, []);

  // music may only start after a user gesture
  useEffect(() => {
    if (!music) return;
    const start = () => { setMusic(true); window.removeEventListener('pointerdown', start); };
    window.addEventListener('pointerdown', start);
    return () => window.removeEventListener('pointerdown', start);
  }, [music]);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduced);
  }, [reduced]);

  return (
    <MotionConfig reducedMotion={reduced ? 'always' : 'user'}>
      {/* global SVG definitions used by thumbnails */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden><ArtDefs /></svg>
      <Router>
        {!entered ? (
          <Welcome onEnter={() => { sessionStorage.setItem('yumi-entered', '1'); setEntered(true); }} />
        ) : (
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="drink" element={<DrinkStudio />} />
                <Route path="parfait" element={<ParfaitAtelier />} />
                <Route path="crepe" element={<CrepeKitchen />} />
                <Route path="cookie" element={<CookieBakery />} />
                <Route path="cafe" element={<MyCafe />} />
                <Route path="collection" element={<MyCollection />} />
                <Route path="photo" element={<PhotoStudio />} />
                <Route path="shop" element={<Shop />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Suspense>
        )}
      </Router>
      <Toasts />
      <ConfirmHost />
      <ImageLibraryHost />
      <DragGhost />
    </MotionConfig>
  );
}
