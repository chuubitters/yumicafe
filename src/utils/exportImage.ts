import maliLatin from '@fontsource/mali/files/mali-latin-600-normal.woff2?url';
import maliThai from '@fontsource/mali/files/mali-thai-600-normal.woff2?url';
import mochiy from '@fontsource/mochiy-pop-one/files/mochiy-pop-one-latin-400-normal.woff2?url';
import { blobToDataURL } from './misc';

let fontCss: string | null = null;
async function embeddedFonts() {
  if (fontCss != null) return fontCss;
  try {
    const load = async (u: string) => blobToDataURL(await (await fetch(u)).blob());
    const [a, b, c] = await Promise.all([load(maliLatin), load(maliThai), load(mochiy)]);
    fontCss = `
@font-face{font-family:'Mali';font-weight:100 900;src:url(${a}) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}
@font-face{font-family:'Mali';font-weight:100 900;src:url(${b}) format('woff2');unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC;}
@font-face{font-family:'Mochiy Pop One';src:url(${c}) format('woff2');}`;
  } catch {
    fontCss = '';
  }
  return fontCss;
}

/** Convert all blob:/relative image hrefs inside an SVG clone into data URLs so the export is self-contained. */
async function inlineImages(svg: SVGSVGElement) {
  const imgs = Array.from(svg.querySelectorAll('image'));
  await Promise.all(
    imgs.map(async (img) => {
      const href = img.getAttribute('href') || img.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
      if (!href || href.startsWith('data:')) return;
      try {
        const blob = await (await fetch(href)).blob();
        img.setAttribute('href', await blobToDataURL(blob));
      } catch {
        img.remove();
      }
    })
  );
}

export interface SvgExportOptions {
  width: number;
  height: number;
  type?: 'image/png' | 'image/jpeg';
  background?: string | null;
  quality?: number;
}

/**
 * Renders a live <svg> element (and only that element) to a real image Blob via the Canvas API.
 * Editor-only UI marked with data-export-ignore is stripped.
 */
export async function svgToBlob(svgEl: SVGSVGElement, opts: SvgExportOptions): Promise<Blob> {
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.querySelectorAll('[data-export-ignore]').forEach((n) => n.remove());
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  clone.setAttribute('width', String(opts.width));
  clone.setAttribute('height', String(opts.height));
  clone.removeAttribute('class');
  clone.removeAttribute('style');
  await inlineImages(clone);
  const css = await embeddedFonts();
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = css + `text{font-family:'Mali','Zen Maru Gothic',sans-serif}`;
  clone.insertBefore(style, clone.firstChild);

  const xml = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error('Could not render image'));
      i.src = url;
    });
    // tiny wait to let embedded fonts settle inside the SVG image
    await new Promise((r) => setTimeout(r, 60));
    const canvas = document.createElement('canvas');
    canvas.width = opts.width;
    canvas.height = opts.height;
    const c = canvas.getContext('2d')!;
    if (opts.background || opts.type === 'image/jpeg') {
      c.fillStyle = opts.background || '#FFF8ED';
      c.fillRect(0, 0, opts.width, opts.height);
    }
    c.drawImage(img, 0, 0, opts.width, opts.height);
    return await new Promise<Blob>((res, rej) =>
      canvas.toBlob((b) => (b ? res(b) : rej(new Error('Export failed'))), opts.type || 'image/png', opts.quality ?? 0.92)
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImg(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

const CARD_THEMES: Record<string, { bg: [string, string]; accent: string; jp: string }> = {
  drink: { bg: ['#FBE3EA', '#FFF8ED'], accent: '#E8869F', jp: 'ドリンク' },
  parfait: { bg: ['#E3ECD6', '#FFF8ED'], accent: '#7E9A63', jp: 'パフェ' },
  crepe: { bg: ['#FCE1E8', '#FFF1DE'], accent: '#C9566F', jp: 'クレープ' },
  cookie: { bg: ['#F8EBCB', '#FFF8ED'], accent: '#92745F', jp: 'クッキー' },
  cafe: { bg: ['#DCEBF3', '#FFF8ED'], accent: '#6E9DB5', jp: 'カフェ' },
};

/** A shareable 1080x1350 "menu card" built with Canvas 2D (uses the page's loaded web fonts). */
export async function creationCard(previewUrl: string, name: string, type: string, ingredients: string[]): Promise<Blob> {
  const W = 1080, H = 1350;
  const t = CARD_THEMES[type] || CARD_THEMES.drink;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const c = cv.getContext('2d')!;
  try { await document.fonts.ready; } catch { /* ignore */ }
  const g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, t.bg[0]);
  g.addColorStop(1, t.bg[1]);
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
  // polka dots
  c.fillStyle = 'rgba(255,255,255,0.55)';
  for (let y = 30; y < H; y += 60) for (let x = (y / 60) % 2 ? 30 : 60; x < W; x += 60) {
    c.beginPath(); c.arc(x, y, 6, 0, Math.PI * 2); c.fill();
  }
  // paper card
  c.save();
  c.shadowColor = 'rgba(146,116,95,0.35)';
  c.shadowBlur = 40;
  c.shadowOffsetY = 16;
  c.fillStyle = '#FFFDF8';
  roundRect(c, 70, 70, W - 140, H - 140, 48);
  c.fill();
  c.restore();
  c.strokeStyle = t.accent;
  c.setLineDash([14, 12]);
  c.lineWidth = 4;
  roundRect(c, 96, 96, W - 192, H - 192, 36);
  c.stroke();
  c.setLineDash([]);
  // badge
  c.fillStyle = t.accent;
  roundRect(c, W / 2 - 170, 128, 340, 64, 32);
  c.fill();
  c.fillStyle = '#fff';
  c.font = '600 34px "Zen Maru Gothic", Mali, sans-serif';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(`YUMI CAFÉ ・ ${t.jp}`, W / 2, 161);
  // image
  const img = await loadImg(previewUrl);
  const maxW = 760, maxH = 820;
  const s = Math.min(maxW / img.width, maxH / img.height);
  const iw = img.width * s, ih = img.height * s;
  c.save();
  c.fillStyle = 'rgba(146,116,95,0.18)';
  c.beginPath();
  c.ellipse(W / 2, 230 + maxH - 10, iw * 0.38, 26, 0, 0, Math.PI * 2);
  c.fill();
  c.restore();
  c.drawImage(img, W / 2 - iw / 2, 230 + (maxH - ih), iw, ih);
  // title
  c.fillStyle = '#5E4535';
  c.font = '64px "Mochiy Pop One", Mali, sans-serif';
  c.fillText(fit(c, name, 860), W / 2, 1120);
  c.font = '500 30px Mali, sans-serif';
  c.fillStyle = '#92745F';
  c.fillText(fit(c, ingredients.slice(0, 6).join(' ・ '), 860), W / 2, 1185);
  c.font = '600 26px Mali, sans-serif';
  c.fillStyle = t.accent;
  const line = 'made with love at my little Japanese café';
  c.fillText(line, W / 2, 1232);
  const half = c.measureText(line).width / 2 + 34;
  for (const dx of [-half, half]) drawHeart(c, W / 2 + dx, 1222, 13, t.accent);
  return new Promise((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(new Error('fail'))), 'image/png'));
}

function fit(c: CanvasRenderingContext2D, s: string, max: number) {
  let out = s;
  while (c.measureText(out).width > max && out.length > 3) out = out.slice(0, -2);
  return out === s ? s : out + '…';
}

function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

/** vector heart drawn straight on the canvas (no emoji / font glyph needed) */
function drawHeart(c: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  c.save();
  c.fillStyle = color;
  c.beginPath();
  c.moveTo(cx, cy + r * 0.95);
  c.bezierCurveTo(cx - r * 1.9, cy - r * 0.2, cx - r * 0.9, cy - r * 1.4, cx, cy - r * 0.45);
  c.bezierCurveTo(cx + r * 0.9, cy - r * 1.4, cx + r * 1.9, cy - r * 0.2, cx, cy + r * 0.95);
  c.fill();
  c.restore();
}
