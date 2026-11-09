# YUMI CAFÉ — My Little Japanese Café 🍓

A cozy, kawaii Japanese dessert-café game for the web. Make drinks, parfaits, crêpes and cookies, decorate your own café, collect your creations and export them as images for social media.

No sign-up, no backend, no API keys. Progress is saved in the player's browser.

## Features

| Mode | What you can do |
| --- | --- |
| **Drink Studio** | Recipe mode (10 recipes with step hints and a "perfect recipe" bonus) or Free Mix. Choose a glass, pour a base, add syrup, drop in ice, **stir by drawing circles** or shake, then add ice cream, cream and toppings, a straw, rim garnish, a glass label (text or your own photo) and stickers. |
| **Parfait Atelier** | Stack bases and layers in any order (reorder or remove them), **drag scoops onto the glass**, make cute animal scoops (cat, bear, bunny, panda, chick, with faces and accessories), **press and hold to pipe cream**, add free-transform toppings and a sauce drizzle. |
| **Crêpe Kitchen** | Pour the batter (press and hold), spread it by circling, watch the bubbles and browning, **flip it**, add fillings, sauces and toppings, then choose a cone, half or roll fold and a wrapper (including one made from your own photo). |
| **Cookie Bakery** | Add ingredients and stir, tap to knead, drag the rolling pin, **drag cutters onto the dough** (13 shapes, including letters), bake in the oven, **draw royal icing** that stays inside each cookie, flood icing, face stickers, then pack in a plate, box, bag or tin with your own label. |
| **My Café** | Inside and storefront scenes, 5 decorating areas, 34 furniture pieces you can drag, resize, rotate, recolor and delete, wallpaper and floors, 4 seasonal themes, and a **dessert showcase** that uses the desserts you actually made. |
| **My Collection** | Scrapbook-style album with search, category filters, sorting and favorites. Open, edit, duplicate, delete or export any creation. Custom album cover. |
| **Photo Studio** | Instagram post, portrait and story sizes, a scrapbook layout, a café menu poster and custom canvas sizes. Backgrounds (including your photo), frames, stickers, text (fonts, colors, outline, shadow, vertical 縦書き), layer ordering. **Real PNG and JPG export** at full resolution. |
| **Shop** | Spend stars on extra glasses, flavors, ice creams, cutters, furniture, sticker packs and backgrounds. Some items unlock with café level. There's a daily gift, and milestones give bonus stars. Everything you need to play is free. |

The same building blocks are used everywhere:
- **Universal image upload.** JPG, PNG and WEBP up to 10 MB, with crop, rotate and aspect presets. Images are stored in IndexedDB and can be reused in every mode.
- **Free-transform editor.** Drag, resize, rotate, flip, duplicate, delete, change layer order and opacity, set an image frame, and undo or redo (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z). It works with mouse and touch.
- **Saving.** LocalStorage holds settings, progress, unlocks and collection metadata. IndexedDB holds uploads and preview images. You can export and import a JSON backup or reset everything from Settings.
- **Sound.** Sound effects and gentle music are synthesized live with WebAudio, so no audio files ship with the game. Nothing plays until the player interacts, and there are on/off and volume controls.
- **Accessibility.** Respects `prefers-reduced-motion` and has its own "Reduce motion" setting, visible focus rings, keyboard nudging of selected items, and semantic landmarks.

All dessert, glassware, food and furniture art is hand-built SVG with gradients, lighting and texture filters, so it stays sharp at any size and exports cleanly.

## Tech stack

React 18 · TypeScript · Vite 5 · Tailwind CSS 3 · Framer Motion · Zustand · React Router 6 · Lucide · react-easy-crop · idb-keyval · Fontsource (Mali, Mochiy Pop One, Zen Maru Gothic)

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

`npm run build:static` makes a fully relative build that uses hash routing. Use it for hosts without SPA rewrites, such as GitHub Pages or any sub-folder.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repo. The settings come from `vercel.json`:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: `dist`
3. Deploy. The SPA rewrite in `vercel.json` makes deep links like `/drink` or `/collection` work when the page is refreshed.

No environment variables are needed (see `.env.example`).

## Project structure

```
src/
  art/            SVG art: glasses, drinks, parfaits, crêpes, cookies, café scenes, stickers, furniture
  components/
    common/       Modal, Toasts, ConfirmDialog, Sparkles, LoadingScreen
    layout/       MainLayout (sidebar, header, mobile bottom nav)
    game/         Stage, StageItems (free-transform), ItemToolbar, DecorPanel, ImageLibrary,
                  ResultModal, StudioShell, drag & drop, backdrop picker
  data/           catalog (ingredients, recipes, furniture, shop, achievements), sample data
  hooks/          useHistory (undo/redo), useStudio
  pages/          Home, Welcome, DrinkStudio, ParfaitAtelier, CrepeKitchen, CookieBakery,
                  MyCafe, MyCollection, PhotoStudio, Shop, SettingsModal
  store/          gameStore, collectionStore, assetStore, cafeStore, settingsStore, toastStore
  styles/         Tailwind + design system
  utils/          image export, IndexedDB, WebAudio sound, backup, helpers
```

## Notes

- Exported images are made from the actual composition SVG, drawn onto a canvas, with fonts embedded. They are never a screenshot of the page.
- Characters and brands in the reference images are not reproduced. The café, the "YUMI CRÊPES" wrapper and all mascots are original.
