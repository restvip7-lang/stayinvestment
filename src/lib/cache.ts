// Кэш данных в памяти функции (как в stay.com.tr): 10 минут свежие, при сбое источника —
// последняя удачная копия, потом снимок из src/content/fixtures.

const TTL = 10 * 60 * 1000;
const store = new Map<string, { at: number; value: unknown }>();

/** Сбросить свежесть (после вебхука /api/revalidate). Старые копии остаются запасными. */
export function expireCache() {
  for (const v of store.values()) v.at = 0;
}

export async function cached<T>(key: string, load: () => Promise<T>, fallback?: () => T): Promise<T> {
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.value as T;
  try {
    const value = await load();
    store.set(key, { at: Date.now(), value });
    return value;
  } catch (e) {
    if (hit) return hit.value as T;
    if (fallback) return fallback();
    throw e;
  }
}
