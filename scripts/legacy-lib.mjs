// Общие функции импорта со старого сайта stayinvestment.com (import-legacy.mjs, import-legacy-i18n.mjs).
export const SITE = 'https://stayinvestment.com';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export async function get(url, binary = false) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (stayinvestment importer)' }, signal: AbortSignal.timeout(40_000) });
      if (r.status === 404) return null;
      if (!r.ok) throw new Error(`${r.status} ${url}`);
      return binary ? Buffer.from(await r.arrayBuffer()) : await r.text();
    } catch (e) {
      if (i === 2) throw e;
      await sleep(1000 * (i + 1));
    }
  }
}

export const decode = (s) =>
  s.replace(/&nbsp;|&#160;/g, ' ').replace(/&laquo;/g, '«').replace(/&raquo;/g, '»').replace(/&mdash;|&#8212;/g, '—')
    .replace(/&ndash;|&#8211;/g, '–').replace(/&#8217;|&rsquo;/g, '’').replace(/&#8220;|&ldquo;/g, '“').replace(/&#8221;|&rdquo;/g, '”')
    .replace(/&hellip;|&#8230;/g, '…').replace(/&quot;/g, '"').replace(/&#039;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, '&');
export const text = (s) => decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
export const num = (s) => {
  const t = String(s).replace(/\s/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.');
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
};

/** Чистый HTML: только смысловые теги, без стилей и классов. */
export function cleanHtml(html) {
  const ALLOWED = new Set(['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'a', 'br', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'blockquote', 'img']);
  let s = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style|form|iframe|noscript)[\s\S]*?<\/\1>/gi, '');
  s = s.replace(/<(\/?)([a-z0-9]+)([^>]*)>/gi, (_, close, tag, attrs) => {
    tag = tag.toLowerCase();
    if (!ALLOWED.has(tag)) return tag === 'div' || tag === 'section' ? '\n' : '';
    if (close) return `</${tag === 'b' ? 'strong' : tag}>`;
    if (tag === 'a') {
      const href = /href="([^"]+)"/i.exec(attrs)?.[1];
      return href ? `<a href="${href.replace(SITE, '')}">` : '<a>';
    }
    if (tag === 'img') {
      const src = /(?:data-src|src)="(https?:[^"]+)"/i.exec(attrs)?.[1];
      return src ? `<img src="${src}" alt="" loading="lazy">` : '';
    }
    return `<${tag === 'b' ? 'strong' : tag}>`;
  });
  s = decode(s)
    .replace(/<(p|li|h2|h3|h4|strong|em)>\s*<\/\1>/g, '')
    .replace(/<a>([\s\S]*?)<\/a>/g, '$1')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim();
  return s;
}

export function meta(html, prop) {
  const re = new RegExp(`<meta[^>]+(?:property|name)="${prop}"[^>]+content="([^"]*)"`, 'i');
  return decode(re.exec(html)?.[1] ?? '').trim() || null;
}

