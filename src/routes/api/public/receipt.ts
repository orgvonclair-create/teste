import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const orderSchema = z.object({
  nombre: z.string().max(200).optional().nullable(),
  telefono: z.string().max(80).optional().nullable(),
  email: z.string().max(200).optional().nullable(),
  direccion: z.string().max(300).optional().nullable(),
  colonia: z.string().max(200).optional().nullable(),
  ciudad: z.string().max(160).optional().nullable(),
  estado: z.string().max(160).optional().nullable(),
  codigoPostal: z.string().max(40).optional().nullable(),
  producto: z.string().max(300).optional().nullable(),
  slug: z.string().max(200).optional().nullable(),
  color: z.string().max(120).optional().nullable(),
});

const stageSchema = z.enum(["order", "up1", "up2", "up3"]);
const stages = {
  order: { product: null, attempt: "comprobante" },
  up1: { product: "Upsell · Liberacion Aduanera", attempt: "upsell-cfdi" },
  up2: { product: "Upsell · Retención Aduanera", attempt: "upsell-aduana" },
  up3: { product: "Upsell · IVA", attempt: "upsell-iva" },
} as const;

const jsonHeaders = { "content-type": "application/json" };

export const Route = createFileRoute("/api/public/receipt")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const form = await request.formData();
          const file = form.get("file");
          const stageResult = stageSchema.safeParse(form.get("stage"));
          const total = Number(form.get("total"));
          let rawOrder: unknown = {};
          try {
            rawOrder = JSON.parse(String(form.get("order") ?? "{}"));
          } catch {
            return new Response(JSON.stringify({ error: "Datos del pedido inválidos." }), { status: 400, headers: jsonHeaders });
          }
          const orderResult = orderSchema.safeParse(rawOrder);
          if (!(file instanceof File) || !file.size || file.size > 60 * 1024 * 1024 || !stageResult.success || !orderResult.success || !Number.isFinite(total) || total < 0) {
            return new Response(JSON.stringify({ error: "Comprobante inválido." }), { status: 400, headers: jsonHeaders });
          }

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const safeName = (file.name || "comprobante").replace(/[^a-zA-Z0-9._-]/g, "_").slice(-160);
          const objectPath = `ttshop-arg/${stageResult.data}_${Date.now()}_${crypto.randomUUID()}_${safeName}`;
          const bytes = new Uint8Array(await file.arrayBuffer());
          const { error: uploadError } = await supabaseAdmin.storage.from("comprobantes").upload(objectPath, bytes, {
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });
          if (uploadError) {
            console.error("[receipt] upload failed", uploadError.message);
            return new Response(JSON.stringify({ error: "No pudimos guardar el archivo. Intenta nuevamente." }), { status: 500, headers: jsonHeaders });
          }

          const order = orderResult.data;
          const stage = stages[stageResult.data];
          const text = (key: string, max = 300) => String(form.get(key) ?? "").slice(0, max) || null;
          const { error: insertError } = await supabaseAdmin.from("orders").insert({
            site: "ttshop-arg",
            status: "pago",
            nombre: order.nombre ?? null,
            telefono: order.telefono ?? null,
            email: order.email ?? null,
            direccion: order.direccion ?? null,
            colonia: order.colonia ?? null,
            ciudad: order.ciudad ?? null,
            estado: order.estado ?? null,
            codigo_postal: order.codigoPostal ?? null,
            metodo_pago: "spei",
            producto: stage.product ?? order.producto ?? null,
            slug: order.slug ?? null,
            color: order.color ?? null,
            total,
            attempt_number: stage.attempt,
            comprobante_filename: file.name || safeName,
            comprobante_type: file.type || "application/octet-stream",
            comprobante_url: `comprobantes/${objectPath}`,
            utm_source: text("utm_source", 200),
            utm_medium: text("utm_medium", 200),
            utm_campaign: text("utm_campaign", 200),
            utm_content: text("utm_content", 200),
            utm_term: text("utm_term", 200),
            ttclid: text("ttclid", 300),
            fbclid: text("fbclid", 300),
            gclid: text("gclid", 300),
            referrer: text("referrer", 500),
            landing_url: text("landing_url", 1000),
          });
          if (insertError) {
            await supabaseAdmin.storage.from("comprobantes").remove([objectPath]);
            console.error("[receipt] order insert failed", insertError.message);
            return new Response(JSON.stringify({ error: "No pudimos registrar el comprobante. Intenta nuevamente." }), { status: 500, headers: jsonHeaders });
          }

          return new Response(JSON.stringify({ ok: true }), { status: 200, headers: jsonHeaders });
        } catch (error) {
          console.error("[receipt] unexpected failure", error);
          return new Response(JSON.stringify({ error: "No pudimos enviar el comprobante. Intenta nuevamente." }), { status: 500, headers: jsonHeaders });
        }
      },
    },
  },
});