import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Приём заявок с форм. Пересылает JSON на LEAD_WEBHOOK_URL (CRM, Make/Zapier, Telegram-бот).
 * Куда именно слать — решит заказчик; без вебхука заявка пишется в лог функции, чтобы не потерялась.
 */
const clean = (v: unknown, max = 500) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'bad json' }, { status: 400 });
  }
  if (clean(body.company)) return Response.json({ ok: true }); // ловушка для ботов
  const lead = {
    name: clean(body.name, 120),
    phone: clean(body.phone, 40),
    comment: clean(body.comment, 2000),
    source: clean(body.source, 300),
    object: clean(body.object, 20) || null,
    site: 'stayinvestment.com',
    at: new Date().toISOString(),
    ip: clientAddress,
  };
  if (lead.name.length < 2 || !/\d{7,}/.test(lead.phone.replace(/\D/g, ''))) {
    return Response.json({ ok: false, error: 'invalid' }, { status: 422 });
  }
  const hook = import.meta.env.LEAD_WEBHOOK_URL ?? process.env.LEAD_WEBHOOK_URL;
  if (!hook) {
    console.log('[lead]', JSON.stringify(lead));
    return Response.json({ ok: true, delivered: false });
  }
  try {
    const r = await fetch(hook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(lead), signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error(String(r.status));
    return Response.json({ ok: true, delivered: true });
  } catch (e) {
    console.error('[lead] webhook failed', (e as Error).message, JSON.stringify(lead));
    return Response.json({ ok: false, error: 'delivery' }, { status: 502 });
  }
};
