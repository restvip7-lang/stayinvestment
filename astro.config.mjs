// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// SSR на Vercel + кэш страниц на CDN (заголовки в src/middleware.ts): новости из админки
// подтягиваются без пересборки, не чаще раза в 10 минут; сброс — /api/revalidate.
export default defineConfig({
  site: 'https://stayinvestment.com',
  output: 'server',
  trailingSlash: 'ignore',
  adapter: vercel({
    imageService: false,
    imagesConfig: {
      sizes: [320, 640, 960, 1280, 1920],
      formats: ['image/avif', 'image/webp'],
      domains: ['cdn-ru.bitrix24.ru', 'stay-property.fra1.cdn.digitaloceanspaces.com', 'eu2.contabostorage.com', 'stayinvestment.com'],
      minimumCacheTTL: 86400,
    },
  }),
  vite: { plugins: [tailwindcss()] },
});
