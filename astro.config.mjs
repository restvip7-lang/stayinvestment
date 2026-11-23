// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// SSR на своём сервере (Node, Plesk 167.86.66.155): новости из админки подтягиваются без пересборки,
// кэш данных в памяти 10 минут (src/lib/cache.ts); сброс — /api/revalidate.
export default defineConfig({
  site: 'https://stayinvestment.com',
  output: 'server',
  trailingSlash: 'ignore',
  adapter: node({ mode: 'standalone' }),
  // внешние фото уменьшает сам сервер (sharp) через /_image — см. src/components/Img.astro
  image: {
    domains: ['cdn-ru.bitrix24.ru', 'stay-property.fra1.cdn.digitaloceanspaces.com', 'eu2.contabostorage.com', 'stayinvestment.com'],
  },
  vite: { plugins: [tailwindcss()] },
});
