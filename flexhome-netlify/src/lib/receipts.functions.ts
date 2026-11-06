import { createServerFn } from "@tanstack/react-start";

export type ReceiptRow = {
  id: string;
  createdAt: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  product: string | null;
  amount: number;
  status: string | null;
  metodoPago: string | null;
  filename: string | null;
  type: string | null;
  url: string | null;
};

export const getReceipts = createServerFn({ method: "POST" })
  .validator((input: { passcode: string }) => ({ passcode: String(input?.passcode ?? "") }))
  .handler(async ({ data }): Promise<{ receipts: ReceiptRow[]; generatedAt: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: access } = await supabaseAdmin
      .from("dashboard_access")
      .select("passcode")
      .limit(1)
      .maybeSingle();
    const expected = access?.passcode ?? "";
    if (!expected || data.passcode !== expected) throw new Error("INVALID_PASSCODE");

    const { data: rows, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id, created_at, nombre, email, telefono, producto, total, status, metodo_pago, comprobante_url, comprobante_filename, comprobante_type",
      )
      .eq("site", "ttshop-arg")
      .not("comprobante_url", "is", null)
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) throw new Error(error.message);

    const list = rows ?? [];
    const paths = list.map((r) => (r.comprobante_url ?? "").replace(/^comprobantes\//, ""));
    const signedMap = new Map<string, string>();
    if (paths.length) {
      const { data: signed } = await supabaseAdmin.storage
        .from("comprobantes")
        .createSignedUrls(paths, 60 * 60 * 8);
      for (const s of signed ?? []) {
        if (s.path && s.signedUrl) signedMap.set(s.path, s.signedUrl);
      }
    }

    return {
      receipts: list.map((r, i) => ({
        id: r.id,
        createdAt: r.created_at,
        name: r.nombre,
        email: r.email,
        phone: r.telefono,
        product: r.producto,
        amount: Number(r.total) || 0,
        status: r.status,
        metodoPago: r.metodo_pago,
        filename: r.comprobante_filename,
        type: r.comprobante_type,
        url: signedMap.get(paths[i] ?? "") ?? null,
      })),
      generatedAt: new Date().toISOString(),
    };
  });
