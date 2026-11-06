import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
  useDashboardData,
} from "@/components/dashboard-shared";
import {
  assessHealth,
  buildBuckets,
  detectAnomaly,
  fmtDate,
  fmtMoney,
  fmtPct,
  fmtTime,
  historicalRate,
  rangeBounds,
  summarize,
} from "@/lib/dashboard-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/payment-health")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Payment & Order Health — FlexHome" },
      {
        name: "description",
        content:
          "Estado del funnel de pago: pedidos generados, confirmados en el upsell, tasa de confirmación actual vs histórica y anomalías.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Payment & Order Health — FlexHome" },
      { property: "og:description", content: "Tasa de confirmación actual vs histórica y detección de anomalías." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HealthPage,
  errorComponent: DashboardRouteError,
});

function HealthPage() {
  const { data, isLoading, isError, passcode, ready, save, logout, refetch } = useDashboardData();

  const model = useMemo(() => {
    if (!data) return null;
    const now = new Date();
    const today = data.orders.filter((o) => new Date(o.createdAt) >= rangeBounds("today", now).from);
    const summary = summarize(today);
    const hist = historicalRate(data.orders, now);
    const health = assessHealth(summary.confirmationRate, hist, summary.generated);
    const anomaly = detectAnomaly(data.orders, hist, now);
    const hourly = buildBuckets(today, "hour");
    return { summary, hist, health, anomaly, hourly };
  }, [data]);

  if (!ready) return null;
  if (!passcode) return <PasscodeGate onSubmit={save} />;
  if (isError) return <LoadError onReset={logout} />;
  if (isLoading || !data || !model) {
    return <div translate="no" className="notranslate flex min-h-screen items-center justify-center text-muted-foreground">Cargando datos…</div>;
  }

  const { summary, hist, health, anomaly, hourly } = model;

  const answers: Array<[string, string]> = [
    ["¿Cuántos pedidos se generaron hoy?", String(summary.generated)],
    ["¿Cuántos se confirmaron en el upsell?", String(summary.paid)],
    ["¿Cuál es mi tasa de confirmación hoy?", fmtPct(summary.confirmationRate)],
    ["¿Cuál es mi tasa histórica?", `${fmtPct(hist.rate)} (${hist.sample} pedidos, ${hist.days} días)`],
    [
      "¿La tasa actual está normal?",
      health.state === "HEALTHY"
        ? "Sí, en línea con el histórico"
        : health.state === "NO_DATA"
          ? "Todavía sin volumen suficiente"
          : `No: ${health.deltaPp.toFixed(0)} puntos porcentuales vs histórico`,
    ],
    ["¿Cuántos pedidos están sin confirmar?", String(summary.unconfirmed)],
    ["¿Valor estimado de esos pedidos?", `${fmtMoney(summary.estimatedUnconfirmedRevenue)} (estimación)`],
    [
      "¿A qué hora empezó una posible anomalía?",
      anomaly ? `${fmtTime(anomaly.startedAt)} (${fmtDate(anomaly.startedAt)})` : "Sin anomalía detectada",
    ],
    ["¿Está ocurriendo ahora?", anomaly ? (anomaly.ongoing ? "Sí, en curso" : "No, ya finalizó") : "No"],
  ];

  return (
    <main translate="no" className="notranslate min-h-screen bg-muted/20 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Payment &amp; Order Health</h1>
            <p className="text-sm text-muted-foreground">
              Upsell alcanzado = pedido pago · actualizado {fmtTime(data.generatedAt)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DashboardNav current="health" />
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="mr-1.5 size-4" /> Actualizar
            </Button>
          </div>
        </header>

        <Card>
          <CardContent className="space-y-3 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Payment funnel health</p>
            <HealthBadge health={health} />
          </CardContent>
        </Card>

        {anomaly ? <AnomalyAlert anomaly={anomaly} /> : <NoAnomalyCard health={health} />}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Generados hoy" value={String(summary.generated)} />
          <StatCard label="Pagos (upsell)" value={String(summary.paid)} tone="good" />
          <StatCard label="Sin confirmar" value={String(summary.unconfirmed)} tone={summary.unconfirmed ? "warn" : "default"} />
          <StatCard
            label="Confirmación hoy"
            value={fmtPct(summary.confirmationRate)}
            hint={`Histórico ${fmtPct(hist.rate)}`}
            tone={health.state === "HEALTHY" ? "good" : health.state === "CRITICAL" ? "bad" : "warn"}
          />
        </section>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Respuestas rápidas</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {answers.map(([q, a]) => (
              <div key={q} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <span className="text-muted-foreground">{q}</span>
                <span className="font-medium tabular-nums">{a}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Hoy por hora</CardTitle>
          </CardHeader>
          <CardContent>
            {hourly.length ? (
              <div className="space-y-1 text-sm">
                {hourly.map((b) => {
                  const bad = b.rate !== null && hist.sample >= 10 && b.rate <= hist.rate - Math.max(10, hist.rate * 0.3);
                  return (
                    <div key={b.key} className="flex items-center justify-between gap-2">
                      <span className="tabular-nums">{b.label}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {b.generated} generados · {b.paid} upsell ·{" "}
                        <strong className={bad ? "text-destructive" : "text-foreground"}>{fmtPct(b.rate)}</strong>
                        {bad ? <span className="ml-2 text-destructive">← anomalía</span> : null}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Todavía no hay pedidos hoy.</p>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          Nota: el pago por transferencia no se verifica con el banco. La confirmación se infiere cuando el cliente llega
          al upsell (o sube el comprobante), por eso los valores sin confirmar son estimaciones.
        </p>
      </div>
    </main>
  );
}
