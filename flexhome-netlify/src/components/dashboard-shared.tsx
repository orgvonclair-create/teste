import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Activity, Receipt, ShieldCheck, TriangleAlert } from "lucide-react";

import { getDashboardData } from "@/lib/dashboard.functions";
import type { Anomaly, DashboardPayload, Health, Summary } from "@/lib/dashboard-metrics";
import { fmtMoney, fmtPct, fmtTime, fmtDate } from "@/lib/dashboard-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { isStaleAssetError, reloadForStaleAssets } from "@/lib/chunk-recovery";

const STORAGE_KEY = "ff-dash-pass";

export function useDashboardData() {
  const [passcode, setPasscode] = useState<string>("");
  const [ready, setReady] = useState(false);
  const fetchData = useServerFn(getDashboardData);

  useEffect(() => {
    try {
      setPasscode(localStorage.getItem(STORAGE_KEY) ?? "");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const query = useQuery<DashboardPayload>({
    queryKey: ["dashboard", passcode],
    queryFn: () => fetchData({ data: { passcode } }),
    enabled: ready && passcode.length > 0,
    refetchInterval: 60_000,
    retry: (count, err) => !String(err?.message ?? "").includes("INVALID_PASSCODE") && count < 2,
    retryDelay: 1500,
  });

  const save = (value: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setPasscode(value);
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setPasscode("");
  };

  return { ...query, passcode, ready, save, logout };
}

export function PasscodeGate({ onSubmit, error }: { onSubmit: (v: string) => void; error?: boolean }) {
  const [value, setValue] = useState("");
  return (
    <div translate="no" className="notranslate flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Panel de control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Ingresá tu clave de acceso para ver los datos del funnel.</p>
          <Input
            type="password"
            value={value}
            autoFocus
            placeholder="Clave de acceso"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit(value)}
          />
          {error ? <p className="text-sm text-destructive">Clave incorrecta.</p> : null}
          <Button className="w-full" onClick={() => onSubmit(value)}>
            Entrar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function DashboardNav({ current }: { current: "overview" | "health" | "receipts" }) {
  return (
    <nav className="flex flex-wrap items-center gap-2">
      <Button asChild variant={current === "overview" ? "default" : "outline"} size="sm">
        <a href="/dashboard">
          <Activity className="mr-1.5 size-4" /> Panel general
        </a>
      </Button>
      <Button asChild variant={current === "health" ? "default" : "outline"} size="sm">
        <a href="/payment-health">
          <ShieldCheck className="mr-1.5 size-4" /> Payment &amp; Order Health
        </a>
      </Button>
      <Button asChild variant={current === "receipts" ? "default" : "outline"} size="sm">
        <a href="/comprobantes">
          <Receipt className="mr-1.5 size-4" /> Comprobantes
        </a>
      </Button>
    </nav>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "good" | "warn" | "bad";
}) {
  const toneCls =
    tone === "good"
      ? "text-emerald-600"
      : tone === "warn"
        ? "text-amber-600"
        : tone === "bad"
          ? "text-destructive"
          : "text-foreground";
  return (
    <Card className="gap-2 py-4">
      <CardContent className="px-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={cn("mt-1 text-2xl font-semibold tabular-nums", toneCls)}>{value}</p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

export function HealthBadge({ health }: { health: Health }) {
  const map = {
    HEALTHY: { text: "HEALTHY", cls: "bg-emerald-600 text-white" },
    WARNING: { text: "WARNING", cls: "bg-amber-500 text-white" },
    CRITICAL: { text: "CRITICAL", cls: "bg-destructive text-white" },
    NO_DATA: { text: "SIN DATOS SUFICIENTES", cls: "bg-muted text-muted-foreground" },
  } as const;
  const s = map[health.state];
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge className={cn("px-3 py-1 text-sm", s.cls)}>{s.text}</Badge>
      <span className="text-sm text-muted-foreground">
        Actual {fmtPct(health.current)} · Histórico {fmtPct(health.historical)} ·{" "}
        <span className={health.deltaPp < 0 ? "text-destructive" : "text-emerald-600"}>
          {health.deltaPp >= 0 ? "+" : ""}
          {health.deltaPp.toFixed(0)} puntos porcentuales
        </span>
      </span>
    </div>
  );
}

export function AnomalyAlert({ anomaly, onOpen }: { anomaly: Anomaly; onOpen?: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-left transition-colors hover:bg-destructive/10"
    >
      <div className="flex items-start gap-3">
        <TriangleAlert className="mt-0.5 size-5 text-destructive" />
        <div className="space-y-1">
          <p className="font-semibold text-destructive">
            ⚠️ {anomaly.reason}
            {anomaly.ongoing ? " (en curso)" : " (finalizada)"}
          </p>
          <p className="text-sm text-muted-foreground">
            La tasa de confirmación cayó de {fmtPct(anomaly.historical)} a {fmtPct(anomaly.rate)} a las{" "}
            {fmtTime(anomaly.startedAt)} ({fmtDate(anomaly.startedAt)}). Se generaron {anomaly.generated} pedidos y solo{" "}
            {anomaly.paid} llegaron al upsell.
          </p>
          <p className="text-sm text-muted-foreground">
            Pedidos sin confirmar: {anomaly.unconfirmed} · Ingreso estimado sin confirmar:{" "}
            {fmtMoney(anomaly.estimatedUnconfirmedRevenue)} (estimación)
          </p>
          <p className="text-xs font-medium text-destructive/80">Toca para ver el detalle de la anomalía</p>
        </div>
      </div>
    </button>
  );
}

export function NoAnomalyCard({ health }: { health: Health }) {
  return (
    <div className="rounded-lg border border-emerald-600/30 bg-emerald-600/5 p-4">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 size-5 text-emerald-600" />
        <div>
          <p className="font-semibold text-emerald-700">Sin anomalías detectadas</p>
          <p className="text-sm text-muted-foreground">
            {health.state === "NO_DATA"
              ? "Todavía no hay volumen suficiente para comparar con el histórico."
              : `La tasa de confirmación actual (${fmtPct(health.current)}) está en línea con tu histórico (${fmtPct(health.historical)}).`}
          </p>
        </div>
      </div>
    </div>
  );
}

export function SummaryDelta({ label, current, previous }: { label: string; current: Summary; previous: Summary }) {
  const rows: Array<[string, string, string, number]> = [
    ["Pedidos generados", String(current.generated), String(previous.generated), current.generated - previous.generated],
    ["Pedidos pagos (upsell)", String(current.paid), String(previous.paid), current.paid - previous.paid],
    ["Sin confirmar", String(current.unconfirmed), String(previous.unconfirmed), previous.unconfirmed - current.unconfirmed],
    [
      "Tasa de confirmación",
      fmtPct(current.confirmationRate),
      fmtPct(previous.confirmationRate),
      current.confirmationRate - previous.confirmationRate,
    ],
    ["Ingreso", fmtMoney(current.revenue), fmtMoney(previous.revenue), current.revenue - previous.revenue],
    ["Ticket promedio", fmtMoney(current.aov), fmtMoney(previous.aov), current.aov - previous.aov],
  ];
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {rows.map(([name, a, b, delta]) => (
          <div key={name} className="flex items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">{name}</span>
            <span className="tabular-nums">
              <strong>{a}</strong> <span className="text-muted-foreground">vs {b}</span>{" "}
              <span className={delta >= 0 ? "text-emerald-600" : "text-destructive"}>
                {delta >= 0 ? "▲" : "▼"}
              </span>
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function LoadError({ onReset }: { onReset: () => void }) {
  return (
    <div translate="no" className="notranslate flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-sm">
        <CardContent className="space-y-3 p-6 text-center">
          <AlertTriangle className="mx-auto size-6 text-destructive" />
          <p className="text-sm text-muted-foreground">No pudimos cargar los datos. Revisá tu clave de acceso.</p>
          <Button onClick={onReset} variant="outline" className="w-full">
            Ingresar otra clave
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/** Route-level boundary so a panel crash never bubbles to the global "page didn't load" screen. */
export function DashboardRouteError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("[dashboard]", error);
    if (isStaleAssetError(error)) reloadForStaleAssets();
  }, [error]);

  const hardReload = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("_v", Date.now().toString(36));
    window.location.replace(url.toString());
  };

  return (
    <div translate="no" className="notranslate flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-sm">
        <CardContent className="space-y-3 p-6 text-center">
          <AlertTriangle className="mx-auto size-6 text-destructive" />
          <p className="text-sm font-medium">El panel tuvo un problema al mostrar esta vista.</p>
          <p className="text-xs text-muted-foreground">{error.message?.slice(0, 180)}</p>
          <div className="flex gap-2">
            <Button onClick={reset} variant="outline" className="w-full">
              Reintentar
            </Button>
            <Button onClick={hardReload} className="w-full">
              Recargar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
