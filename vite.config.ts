import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// `npm run build`        → Vercel / any host with SPA fallback (BrowserRouter, absolute base, self-hosted fonts)
// `npm run build:static` → fully relative build with hash routing for plain static hosting / sub-folders.
//                          It loads the large CJK fonts from Google Fonts instead of shipping ~700 font files.
export default defineConfig(({ mode }) => {
  const isStatic = mode === 'static';
  const empty = fileURLToPath(new URL('./src/styles/empty.css', import.meta.url));
  return {
    base: isStatic ? './' : '/',
    plugins: [
      react(),
      isStatic && {
        name: 'google-fonts',
        transformIndexHtml: (html: string) =>
          html.replace(
            '</head>',
            '  <link rel="preconnect" href="https://fonts.googleapis.com" />\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&family=Zen+Maru+Gothic:wght@500;700&display=swap" />\n  </head>'
          ),
      },
    ].filter(Boolean),
    resolve: {
      alias: isStatic
        ? [
            { find: /^@fontsource\/zen-maru-gothic\/.*\.css$/, replacement: empty },
            { find: /^@fontsource\/mochiy-pop-one\/.*\.css$/, replacement: empty },
          ]
        : [],
    },
    define: {
      __HASH_ROUTER__: JSON.stringify(isStatic),
    },
    build: {
      chunkSizeWarningLimit: 1200,
    },
  };
});
