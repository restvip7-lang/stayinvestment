// Снимок новостей из админки → src/content/fixtures/content-news.json.
// Это запасной вариант, если API недоступен при запросе. Запуск: npm run fixtures
import { writeFile } from 'node:fs/promises';

const BASE = (process.env.STAY_CONTENT_API || 'https://admin.stayproperty.com').replace(/\/$/, '');
const items = [];
for (let page = 1; page <= 20; page++) {
  const r = await fetch(`${BASE}/api/content/news?language=ru&page=${page}&limit=100`, { signal: AbortSignal.timeout(60_000) });
  if (!r.ok) throw new Error(`${r.status} news page ${page}`);
  const j = await r.json();
  items.push(...j.items);
  if (page >= (j.totalPages ?? 1)) break;
}
await writeFile(new URL('../src/content/fixtures/content-news.json', import.meta.url), JSON.stringify({ items }));
console.log(`Новостей в снимке: ${items.length}`);
