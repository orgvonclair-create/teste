import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RefreshCw } from "lucide-react";

import {
  AnomalyAlert,
  DashboardNav,
  DashboardRouteError,
  HealthBadge,
  LoadError,
  NoAnomalyCard,
  PasscodeGate,
  StatCard,
  SummaryDelta,
  useDashboardData,
} from "@/components/dashboard-shared";
import {
  applyFilters,
  assessHealth,
  buildBuckets,
  buildComparisons,
  detectAnomaly,
  fmtDate,
  fmtMoney,
  fmtPct,
  fmtTime,
  historicalRate,
  rangeBounds,
  RANGE_LABELS,
  summarize,
  uniqueValues,
} from "@/lib/dashboard-metrics";
import type { Filters, Granularity, RangeKey } from "@/lib/dashboard-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Panel de pedidos y confirmación — FlexHome" },
      {
        name: "description",
        content:
          "Panel interno: pedidos generados, pedidos confirmados en el upsell, tasa de confirmación histórica y detección de anomalías del funnel.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Panel de pedidos y confirmación — FlexHome" },
      { property: "og:description", content: "Monitoreo del funnel: pedidos generados vs confirmados y anomalías." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
  errorComponent: DashboardRouteError,
});

const EMPTY_FILTERS: Filters = {
  range: "7d",
  product: "all",
  country: "all",
  utmSource: "all",
  utmCampaign: "all",
  status: "all",
  search: "",
};

function DashboardPage() {
  const { data, isLoading, isError, passcode, ready, save, logout, refetch } = useDashboardData();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [granularity, setGranularity] = useState<Granularity>("hour");
  const [openAnomaly, setOpenAnomaly] = useState(false);
  const [sortDesc, setSortDesc] = useState(true);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((f) => ({ ...f, [key]: value }));

  const model = useMemo(() => {
    if (!data) return null;
    const now = new Date();
    const bounds = rangeBounds(filters.range, now);
    const filtered = applyFilters(data.orders, filters, bounds);
    const summary = summarize(filtered);
    const hist = historicalRate(data.orders, now);
    const todayOrders = data.orders.filter((o) => new Date(o.createdAt) >= rangeBounds("today", now).from);
    const todaySummary = summarize(todayOrders);
    const health = assessHealth(todaySummary.confirmationRate, hist, todaySummary.generated);
    const anomaly = detectAnomaly(data.orders, hist, now);
    const buckets = buildBuckets(filtered, granularity);
    const comparisons = buildComparisons(data.orders, now);
    const checkoutStarted = data.checkouts.filter((c) => {
      const t = new Date(c.occurredAt).getTime();
      return t >= bounds.from.getTime() && t < bounds.to.getTime();
    }).length;
    return { bounds, filtered, summary, hist, health, anomaly, buckets, comparisons, checkoutStarted, todaySummary };
  }, [data, filters, granularity]);

  if (!ready) return null;
  if (!passcode) return <PasscodeGate onSubmit={save} />;
  if (isError) return <LoadError onReset={logout} />;
  if (isLoading || !data || !model) {
    return <div translate="no" className="notranslate flex min-h-screen items-center justify-center text-muted-foreground">Cargando datos…</div>;
  }

  const { summary, hist, health, anomaly, buckets, comparisons, checkoutStarted } = model;
  const rows = [...model.filtered].sort((a, b) =>
    sortDesc
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const funnel = [
    { label: "Checkout iniciado", value: checkoutStarted, note: data.hasEventTracking ? "" : "esperando eventos" },
    { label: "Pedido generado", value: summary.generated, note: "" },
    { label: "Upsell alcanzado = pago", value: summary.paid, note: "" },
  ];
  const funnelBase = Math.max(checkoutStarted, summary.generated);

  return (
    <main translate="no" className="notranslate min-h-screen bg-muted/20 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Panel del funnel de pedidos</h1>
            <p className="text-sm text-muted-foreground">
              Actualizado {fmtTime(data.generatedAt)} · Upsell alcanzado = pedido pago
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DashboardNav current="overview" />
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="mr-1.5 size-4" /> Actualizar
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              Salir
            </Button>
          </div>
        </header>

        {anomaly ? <AnomalyAlert anomaly={anomaly} onOpen={() => setOpenAnomaly(true)} /> : <NoAnomalyCard health={health} />}

        <Card>
          <CardContent className="flex flex-wrap items-end gap-3 py-4">
            <FilterSelect
              label="Período"
              value={filters.range}
              onChange={(v) => set("range", v as RangeKey)}
              options={(Object.keys(RANGE_LABELS) as RangeKey[]).map((k) => ({ value: k, label: RANGE_LABELS[k] }))}
            />
            <FilterSelect
              label="Producto"
              value={filters.product}
              onChange={(v) => set("product", v)}
              options={[{ value: "all", label: "Todos" }, ...uniqueValues(data.orders, (o) => o.product, "—").map((v) => ({ value: v, label: v.slice(0, 40) }))]}
            />
            <FilterSelect
              label="Provincia / país"
              value={filters.country}
              onChange={(v) => set("country", v)}
              options={[{ value: "all", label: "Todas" }, ...uniqueValues(data.orders, (o) => o.country, "—").map((v) => ({ value: v, label: v }))]}
            />
            <FilterSelect
              label="UTM source"
              value={filters.utmSource}
              onChange={(v) => set("utmSource", v)}
              options={[{ value: "all", label: "Todos" }, ...uniqueValues(data.orders, (o) => o.utmSource, "direct").map((v) => ({ value: v, label: v }))]}
            />
            <FilterSelect
              label="Campaña"
              value={filters.utmCampaign}
              onChange={(v) => set("utmCampaign", v)}
              options={[{ value: "all", label: "Todas" }, ...uniqueValues(data.orders, (o) => o.utmCampaign, "—").map((v) => ({ value: v, label: v }))]}
            />
            <FilterSelect
              label="Estado"
              value={filters.status}
              onChange={(v) => set("status", v as Filters["status"])}
              options={[
                { value: "all", label: "Todos" },
                { value: "paid", label: "Pago / upsell" },
                { value: "unconfirmed", label: "Sin confirmar" },
              ]}
            />
            <div className="min-w-[180px] flex-1">
              <p className="mb-1 text-xs font-medium text-muted-foreground">Buscar</p>
              <Input
                placeholder="Nombre, email, teléfono…"
                value={filters.search}
                onChange={(e) => set("search", e.target.value)}
              />
            </div>
            <Button variant="ghost" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
              Limpiar
            </Button>
          </CardContent>
        </Card>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Pedidos generados" value={String(summary.generated)} hint={RANGE_LABELS[filters.range]} />
          <StatCard label="Pedidos pagos (upsell)" value={String(summary.paid)} tone="good" hint="Llegaron al upsell" />
          <StatCard label="Sin confirmar" value={String(summary.unconfirmed)} tone={summary.unconfirmed ? "warn" : "default"} />
          <StatCard
            label="Tasa de confirmación"
            value={fmtPct(summary.confirmationRate)}
            tone={summary.confirmationRate >= hist.rate ? "good" : "bad"}
            hint={`Histórico ${fmtPct(hist.rate)}`}
          />
          <StatCard label="Ingreso confirmado" value={fmtMoney(summary.revenue)} />
          <StatCard label="Ticket promedio" value={fmtMoney(summary.aov)} />
          <StatCard
            label="Ingreso sin confirmar (est.)"
            value={fmtMoney(summary.estimatedUnconfirmedRevenue)}
            hint="Solo una estimación: pedidos sin confirmar × ticket promedio"
            tone="warn"
          />
          <Card className="py-4">
            <CardContent className="px-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Payment funnel health</p>
              <div className="mt-2">
                <HealthBadge health={health} />
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Funnel principal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {funnel.map((step) => {
                const pct = funnelBase ? (step.value / funnelBase) * 100 : 0;
                return (
                  <div key={step.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{step.label}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {step.value} · {fmtPct(pct)}
                      </span>
                    </div>
                    <div className="mt-1 h-2.5 w-full rounded-full bg-muted">
                      <div className="h-2.5 rounded-full bg-primary" style={{ width: `${Math.min(100, pct)}%` }} />
                    </div>
                    {step.note ? <p className="mt-1 text-xs text-muted-foreground">{step.note}</p> : null}
                  </div>
                );
              })}
              <div className="space-y-1 border-t pt-3 text-sm">
                <Row
                  label="Checkout → Pedido"
                  value={fmtPct(checkoutStarted ? (summary.generated / checkoutStarted) * 100 : null)}
                />
                <Row label="Pedido → Upsell (confirmación)" value={fmtPct(summary.confirmationRate)} strong />
                <Row
                  label="Conversión total"
                  value={fmtPct(checkoutStarted ? (summary.paid / checkoutStarted) * 100 : null)}
                />
              </div>
              {!data.hasEventTracking ? (
                <p className="text-xs text-muted-foreground">
                  Checkout iniciado empieza a contar cuando el sitio envía el evento <code>checkout_started</code>.
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Generados vs confirmados</CardTitle>
              <div className="flex gap-1">
                {(["hour", "day", "week", "month"] as Granularity[]).map((g) => (
                  <Button
                    key={g}
                    size="sm"
                    variant={granularity === g ? "default" : "outline"}
                    onClick={() => setGranularity(g)}
                  >
                    {g === "hour" ? "Hora" : g === "day" ? "Día" : g === "week" ? "Semana" : "Mes"}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={buckets}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" fontSize={11} />
                    <YAxis allowDecimals={false} fontSize={11} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="generated" name="Generados" fill="hsl(221 83% 53%)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="paid" name="Upsell / pagos" fill="hsl(160 84% 39%)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="unconfirmed" name="Sin confirmar" fill="hsl(0 72% 51%)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={buckets}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" fontSize={11} />
                    <YAxis domain={[0, 100]} unit="%" fontSize={11} />
                    <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      name="Tasa de confirmación"
                      stroke="hsl(24 95% 53%)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {comparisons.map((c) => (
            <SummaryDelta key={c.label} label={c.label} current={c.current} previous={c.previous} />
          ))}
        </section>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Pedidos ({rows.length}){" "}
              <Button variant="ghost" size="sm" onClick={() => setSortDesc((v) => !v)}>
                Fecha {sortDesc ? "↓" : "↑"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Upsell</TableHead>
                  <TableHead>UTM source</TableHead>
                  <TableHead>Campaña</TableHead>
                  <TableHead>Provincia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 300).map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.id.slice(0, 8)}</TableCell>
                    <TableCell className="whitespace-nowrap">{fmtDate(o.createdAt)}</TableCell>
                    <TableCell className="whitespace-nowrap">{fmtTime(o.createdAt)}</TableCell>
                    <TableCell className="max-w-[180px] truncate">
                      {o.name ?? "—"}
                      <span className="block text-xs text-muted-foreground">{o.email ?? ""}</span>
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate text-xs">{o.product ?? "—"}</TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">
                      {fmtMoney(o.amount, o.currency)}
                    </TableCell>
                    <TableCell>
                      {o.paid ? (
                        <Badge className="bg-emerald-600 text-white">Pago / Upsell</Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500 text-amber-600">
                          Sin confirmar
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs">{o.paidAt ? fmtTime(o.paidAt) : "—"}</TableCell>
                    <TableCell className="text-xs">{o.utmSource ?? "direct"}</TableCell>
                    <TableCell className="text-xs">{o.utmCampaign ?? "—"}</TableCell>
                    <TableCell className="text-xs">{o.country ?? "—"}</TableCell>
                  </TableRow>
                ))}
                {!rows.length ? (
                  <TableRow>
                    <TableCell colSpan={11} className="py-8 text-center text-muted-foreground">
                      Sin pedidos para estos filtros.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={openAnomaly && !!anomaly} onOpenChange={setOpenAnomaly}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle de la anomalía</DialogTitle>
          </DialogHeader>
          {anomaly ? (
            <div className="space-y-2 text-sm">
              <p className="rounded-md bg-muted p-3">
                La tasa de confirmación cayó de {fmtPct(anomaly.historical)} a {fmtPct(anomaly.rate)} a las{" "}
                {fmtTime(anomaly.startedAt)}. Se generaron {anomaly.generated} pedidos y solo {anomaly.paid} llegaron al
                upsell.
              </p>
              <Row label="Inicio" value={`${fmtDate(anomaly.startedAt)} ${fmtTime(anomaly.startedAt)}`} />
              <Row label="Última hora afectada" value={fmtTime(anomaly.lastAt)} />
              <Row label="Estado" value={anomaly.ongoing ? "Ocurriendo ahora" : "Ya finalizó"} />
              <Row label="Pedidos generados" value={String(anomaly.generated)} />
              <Row label="Upsell alcanzado" value={String(anomaly.paid)} />
              <Row label="Sin confirmar" value={String(anomaly.unconfirmed)} />
              <Row label="Tasa actual" value={fmtPct(anomaly.rate)} strong />
              <Row label="Promedio histórico" value={fmtPct(anomaly.historical)} />
              <Row label="Diferencia" value={`${anomaly.deltaPp.toFixed(0)} puntos porcentuales`} />
              <Row label="Ingreso confirmado" value={fmtMoney(anomaly.revenue)} />
              <Row label="Ingreso sin confirmar (est.)" value={fmtMoney(anomaly.estimatedUnconfirmedRevenue)} />
              <div className="pt-2">
                <p className="mb-1 text-xs font-medium text-muted-foreground">Tasa por hora</p>
                {anomaly.buckets.map((b) => (
                  <div key={b.key} className="flex justify-between text-xs">
                    <span>{b.label}</span>
                    <span className="tabular-nums">
                      {b.generated} generados · {b.paid} upsell · {fmtPct(b.rate)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={strong ? "font-semibold tabular-nums" : "tabular-nums"}>{value}</span>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="min-w-[150px]">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
