// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import vercel from '@astrojs/vercel';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// Куда собираем:
// - Vercel (там переменная VERCEL=1 выставляется сама) — SSR-функции + CDN-кэш + оптимизатор картинок Vercel;
// - свой сервер (VPS / Plesk) — обычное Node.js-приложение: `npm run build && npm start` (см. docs/deploy-vps.md).
// Можно задать явно: STAY_TARGET=vercel | node.
const target = process.env.STAY_TARGET ?? (process.env.VERCEL ? 'vercel' : 'node');

export default defineConfig({
  site: 'https://stayinvestment.com',
  output: 'server',
  trailingSlash: 'ignore',
  adapter:
    target === 'vercel'
      ? vercel({
          imageService: false,
          imagesConfig: {
            sizes: [320, 640, 960, 1280, 1920],
            formats: ['image/avif', 'image/webp'],
            domains: ['cdn-ru.bitrix24.ru', 'stay-property.fra1.cdn.digitaloceanspaces.com', 'eu2.contabostorage.com', 'stayinvestment.com'],
            minimumCacheTTL: 86400,
          },
        })
      : node({ mode: 'standalone' }),
  // Картинки не обрабатываются на лету: свои фото заранее сжаты в /media (scripts/localize-media.mjs).
  image: { service: passthroughImageService() },
  vite: {
    plugins: [tailwindcss()],
    define: { 'import.meta.env.STAY_TARGET': JSON.stringify(target) },
  },
});
