import { createServerFn } from "@tanstack/react-start";
import type { CheckoutEvent, DashboardPayload, MainOrder, UpsellRow } from "./dashboard-metrics";

export const getDashboardData = createServerFn({ method: "POST" })
  .validator((input: { passcode: string }) => ({ passcode: String(input?.passcode ?? "") }))
  .handler(async ({ data }): Promise<DashboardPayload> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const DAY_MS = 86400000;
    const norm = (value: string | null | undefined) => (value ?? "").trim().toLowerCase();
    const digits = (value: string | null | undefined) => (value ?? "").replace(/\D/g, "").slice(-8);

    const { data: access } = await supabaseAdmin.from("dashboard_access").select("passcode").limit(1).maybeSingle();
    const expected = access?.passcode ?? "";
    if (!expected || data.passcode !== expected) {
      throw new Error("INVALID_PASSCODE");
    }

    // Janela de 45 dias: mantém o payload leve para não estourar o limite do servidor.
    const since = new Date(Date.now() - 45 * DAY_MS).toISOString();

    const FUNNEL_SITE = "ttshop-arg";

    // Paginação: o Data API devolve no máximo 1000 linhas por request,
    // então buscamos em páginas para o painel não ficar defasado.
    const PAGE = 1000;
    const MAX_ROWS = 12000;

    const rawOrders: any[] = [];
    for (let from = 0; from < MAX_ROWS; from += PAGE) {
      const { data: page, error } = await supabaseAdmin
        .from("orders")
        .select(
          "id, created_at, nombre, email, telefono, producto, total, status, estado, utm_source, utm_campaign, metodo_pago",
        )
        .eq("site", FUNNEL_SITE)
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .range(from, from + PAGE - 1);
      if (error) throw new Error(error.message);
      rawOrders.push(...(page ?? []));
      if (!page || page.length < PAGE) break;
    }

    const rawEvents: any[] = [];
    for (let from = 0; from < MAX_ROWS; from += PAGE) {
      const { data: page } = await supabaseAdmin
        .from("order_events")
        .select("event_name, occurred_at, session_id, customer_email, product, amount, country, utm_source, utm_campaign")
        .eq("site", FUNNEL_SITE)
        .gte("occurred_at", since)
        .order("occurred_at", { ascending: false })
        .range(from, from + PAGE - 1);
      rawEvents.push(...(page ?? []));
      if (!page || page.length < PAGE) break;
    }


    const events = rawEvents ?? [];
    const orders = rawOrders ?? [];

    const isUpsell = (p: string | null) => !!p && p.startsWith("Upsell");

    const upsells: UpsellRow[] = orders
      .filter((o) => isUpsell(o.producto))
      .map((o) => ({ id: o.id, createdAt: o.created_at, product: o.producto, amount: Number(o.total) || 0, email: o.email }));

    const checkouts: CheckoutEvent[] = events
      .filter((e) => e.event_name === "checkout_started")
      .map((e) => ({
        occurredAt: e.occurred_at,
        sessionId: e.session_id,
        utmSource: e.utm_source,
        utmCampaign: e.utm_campaign,
        country: e.country,
        product: e.product,
      }));

    // Sinais de confirmação: linha "pago" do pedido principal, taxa (upsell) paga,
    // ou evento upsell_reached enviado pelo site.
    type Signal = { key: string; phone: string; ts: number };
    const signals: Signal[] = [];
    for (const o of orders) {
      const ts = new Date(o.created_at).getTime();
      if (isUpsell(o.producto) || o.status === "pago") {
        signals.push({ key: norm(o.email), phone: digits(o.telefono), ts });
      }
    }
    for (const e of events) {
      if (e.event_name === "upsell_reached") {
        signals.push({ key: norm(e.customer_email), phone: "", ts: new Date(e.occurred_at).getTime() });
      }
    }

    const generated = orders.filter((o) => !isUpsell(o.producto) && o.status !== "pago");

    const mainOrders: MainOrder[] = generated.map((o) => {
      const ts = new Date(o.created_at).getTime();
      const email = norm(o.email);
      const phone = digits(o.telefono);
      let paidAt: number | null = null;
      for (const s of signals) {
        const same = (email && s.key === email) || (phone && s.phone && s.phone === phone);
        if (!same) continue;
        if (s.ts < ts - 60_000 || s.ts > ts + DAY_MS) continue;
        if (paidAt === null || s.ts < paidAt) paidAt = s.ts;
      }
      return {
        id: o.id,
        createdAt: o.created_at,
        name: o.nombre,
        email: o.email,
        phone: o.telefono,
        product: o.producto,
        amount: Number(o.total) || 0,
        currency: "ARS",
        country: o.estado,
        utmSource: o.utm_source,
        utmCampaign: o.utm_campaign,
        paid: paidAt !== null,
        paidAt: paidAt !== null ? new Date(paidAt).toISOString() : null,
      };
    });

    return {
      orders: mainOrders,
      upsells,
      checkouts,
      hasEventTracking: checkouts.length > 0,
      generatedAt: new Date().toISOString(),
    };
  });
