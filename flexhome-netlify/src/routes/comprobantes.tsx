import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, FileText } from "lucide-react";

import {
  DashboardNav,
  DashboardRouteError,
  LoadError,
  PasscodeGate,
} from "@/components/dashboard-shared";
import { fmtMoney, fmtDate, fmtTime } from "@/lib/dashboard-metrics";
import { getReceipts, type ReceiptRow } from "@/lib/receipts.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const STORAGE_KEY = "ff-dash-pass";

export const Route = createFileRoute("/comprobantes")({
  component: ComprobantesPage,
  errorComponent: DashboardRouteError,
  head: () => ({
    meta: [
      { title: "Comprobantes recibidos | Panel FlexHome" },
      {
        name: "description",
        content: "Revisá y descargá los comprobantes de transferencia enviados por los clientes del funnel FlexHome.",
      },
      { property: "og:title", content: "Comprobantes recibidos | Panel FlexHome" },
      {
        property: "og:description",
        content: "Panel interno para ver los comprobantes de pago adjuntados por los clientes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function ComprobantesPage() {
  const [passcode, setPasscode] = useState("");
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const fetchData = useServerFn(getReceipts);

  useEffect(() => {
    try {
      setPasscode(localStorage.getItem(STORAGE_KEY) ?? "");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const query = useQuery({
    queryKey: ["receipts", passcode],
    queryFn: () => fetchData({ data: { passcode } }),
    enabled: ready && passcode.length > 0,
    refetchInterval: 60_000,
    retry: (count, err) => !String(err?.message ?? "").includes("INVALID_PASSCODE") && count < 2,
  });

  const save = (value: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setPasscode(value);
  };

  const invalid = String(query.error?.message ?? "").includes("INVALID_PASSCODE");

  const rows = useMemo(() => {
    const list = query.data?.receipts ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter((r) =>
      [r.name, r.email, r.phone, r.product, r.filename].some((v) => (v ?? "").toLowerCase().includes(term)),
    );
  }, [query.data, search]);

  if (!ready) return null;
  if (!passcode || invalid) return <PasscodeGate onSubmit={save} error={invalid} />;

  return (
    <div translate="no" className="notranslate min-h-screen bg-muted/30 px-4 py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Comprobantes recibidos</h1>
            <p className="text-sm text-muted-foreground">
              {rows.length} comprobante(s){query.data ? ` · actualizado ${fmtTime(query.data.generatedAt)}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DashboardNav current="receipts" />
            <Button variant="outline" size="sm" onClick={() => query.refetch()} disabled={query.isFetching}>
              <RefreshCw className="mr-1.5 size-4" /> Actualizar
            </Button>
          </div>
        </header>

        {query.isError && !invalid ? <LoadError onReset={() => save("")} /> : null}

        <Input
          value={search}
          placeholder="Buscar por nombre, email, teléfono o producto"
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md bg-background"
        />

        {query.isLoading ? <p className="text-sm text-muted-foreground">Cargando comprobantes…</p> : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <ReceiptCard key={r.id} row={r} />
          ))}
        </div>

        {!query.isLoading && rows.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Todavía no hay comprobantes adjuntados.
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

function ReceiptCard({ row }: { row: ReceiptRow }) {
  const isImage = (row.type ?? "").startsWith("image/");
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          <span className="truncate">{row.name || "Sin nombre"}</span>
          <Badge variant={row.status === "pago" ? "default" : "outline"}>{row.status ?? "pendiente"}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground">
          <p className="truncate">{row.product ?? "—"}</p>
          <p>
            {fmtMoney(row.amount)} · {fmtDate(row.createdAt)} {fmtTime(row.createdAt)}
          </p>
          <p className="truncate">{row.email ?? "—"}</p>
          <p className="truncate">{row.phone ?? "—"}</p>
        </div>

        {row.url ? (
          isImage ? (
            <a href={row.url} target="_blank" rel="noreferrer" className="block">
              <img
                src={row.url}
                alt={`Comprobante de ${row.name ?? "cliente"}`}
                loading="lazy"
                className="h-48 w-full rounded-md border object-cover"
              />
            </a>
          ) : (
            <a
              href={row.url}
              target="_blank"
              rel="noreferrer"
              className="flex h-48 w-full items-center justify-center gap-2 rounded-md border bg-muted/50 text-sm"
            >
              <FileText className="size-5" /> Abrir archivo
            </a>
          )
        ) : (
          <p className="text-xs text-destructive">Archivo no disponible.</p>
        )}

        {row.url ? (
          <Button asChild variant="outline" size="sm" className="w-full">
            <a href={row.url} target="_blank" rel="noreferrer" download={row.filename ?? undefined}>
              Ver / descargar
            </a>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
