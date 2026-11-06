import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  event_name: z.enum(["checkout_started", "order_generated", "upsell_reached"]),
  order_id: z.string().uuid().optional().nullable(),
  session_id: z.string().max(120).optional().nullable(),
  customer_email: z.string().max(200).optional().nullable(),
  customer_name: z.string().max(200).optional().nullable(),
  product: z.string().max(300).optional().nullable(),
  amount: z.coerce.number().nonnegative().optional(),
  currency: z.string().max(8).optional(),
  country: z.string().max(80).optional().nullable(),
  utm_source: z.string().max(200).optional().nullable(),
  utm_campaign: z.string().max(200).optional().nullable(),
  site: z.string().max(80).optional().nullable(),
  occurred_at: z.string().optional(),
});

const cors = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "content-type",
  "access-control-allow-methods": "POST, OPTIONS",
};

export const Route = createFileRoute("/api/public/events")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "invalid json" }), { status: 400, headers: cors });
        }
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
          return new Response(JSON.stringify({ error: "invalid payload", issues: parsed.error.issues }), {
            status: 400,
            headers: cors,
          });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const p = parsed.data;
        const { error } = await supabaseAdmin.from("order_events").insert({
          event_name: p.event_name,
          order_id: p.order_id ?? null,
          session_id: p.session_id ?? null,
          customer_email: p.customer_email ?? null,
          customer_name: p.customer_name ?? null,
          product: p.product ?? null,
          amount: p.amount ?? 0,
          currency: p.currency ?? "ARS",
          country: p.country ?? null,
          utm_source: p.utm_source ?? null,
          utm_campaign: p.utm_campaign ?? null,
          site: p.site ?? null,
          occurred_at: p.occurred_at ?? new Date().toISOString(),
        });
        if (error) {
          console.error("[events] insert failed", error.message);
          return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: cors });
        }
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors });
      },
    },
  },
});
