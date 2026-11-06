export interface MainOrder {
  id: string;
  createdAt: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  product: string | null;
  amount: number;
  currency: string;
  country: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  paid: boolean;
  paidAt: string | null;
  isSample?: boolean;
}

export interface UpsellRow {
  id: string;
  createdAt: string;
  product: string | null;
  amount: number;
  email: string | null;
}

export interface CheckoutEvent {
  occurredAt: string;
  sessionId: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  country: string | null;
  product: string | null;
}

export interface DashboardPayload {
  orders: MainOrder[];
  upsells: UpsellRow[];
  checkouts: CheckoutEvent[];
  hasEventTracking: boolean;
  generatedAt: string;
}

export type Granularity = "hour" | "day" | "week" | "month";

export interface Filters {
  range: RangeKey;
  product: string;
  country: string;
  utmSource: string;
  utmCampaign: string;
  status: "all" | "paid" | "unconfirmed";
  search: string;
}

export type RangeKey = "today" | "yesterday" | "7d" | "30d" | "all";

export const RANGE_LABELS: Record<RangeKey, string> = {
  today: "Hoy",
  yesterday: "Ayer",
  "7d": "Últimos 7 días",
  "30d": "Últimos 30 días",
  all: "Todo el período",
};

const DAY = 86400000;

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function rangeBounds(range: RangeKey, now = new Date()): { from: Date; to: Date } {
  const today = startOfDay(now);
  switch (range) {
    case "today":
      return { from: today, to: new Date(today.getTime() + DAY) };
    case "yesterday":
      return { from: new Date(today.getTime() - DAY), to: today };
    case "7d":
      return { from: new Date(today.getTime() - 6 * DAY), to: new Date(today.getTime() + DAY) };
    case "30d":
      return { from: new Date(today.getTime() - 29 * DAY), to: new Date(today.getTime() + DAY) };
    default:
      return { from: new Date(0), to: new Date(now.getTime() + DAY) };
  }
}

export function inRange(iso: string, from: Date, to: Date): boolean {
  const t = new Date(iso).getTime();
  return t >= from.getTime() && t < to.getTime();
}

export function applyFilters(orders: MainOrder[], f: Filters, bounds: { from: Date; to: Date }): MainOrder[] {
  const q = f.search.trim().toLowerCase();
  return orders.filter((o) => {
    if (!inRange(o.createdAt, bounds.from, bounds.to)) return false;
    if (f.product !== "all" && (o.product ?? "—") !== f.product) return false;
    if (f.country !== "all" && (o.country ?? "—") !== f.country) return false;
    if (f.utmSource !== "all" && (o.utmSource ?? "direct") !== f.utmSource) return false;
    if (f.utmCampaign !== "all" && (o.utmCampaign ?? "—") !== f.utmCampaign) return false;
    if (f.status === "paid" && !o.paid) return false;
    if (f.status === "unconfirmed" && o.paid) return false;
    if (q) {
      const hay = [o.name, o.email, o.phone, o.product, o.id].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export interface Summary {
  generated: number;
  paid: number;
  unconfirmed: number;
  confirmationRate: number;
  revenue: number;
  aov: number;
  estimatedUnconfirmedRevenue: number;
}

export function summarize(orders: MainOrder[]): Summary {
  const generated = orders.length;
  const paidOrders = orders.filter((o) => o.paid);
  const paid = paidOrders.length;
  const revenue = paidOrders.reduce((s, o) => s + o.amount, 0);
  const aov = paid ? revenue / paid : 0;
  const unconfirmed = generated - paid;
  return {
    generated,
    paid,
    unconfirmed,
    confirmationRate: generated ? (paid / generated) * 100 : 0,
    revenue,
    aov,
    estimatedUnconfirmedRevenue: unconfirmed * aov,
  };
}

export interface Bucket {
  key: string;
  label: string;
  start: number;
  generated: number;
  paid: number;
  unconfirmed: number;
  rate: number | null;
}

function bucketStart(d: Date, g: Granularity): Date {
  const x = new Date(d);
  x.setMinutes(0, 0, 0);
  if (g === "hour") return x;
  x.setHours(0, 0, 0, 0);
  if (g === "day") return x;
  if (g === "week") {
    const dow = (x.getDay() + 6) % 7;
    x.setDate(x.getDate() - dow);
    return x;
  }
  x.setDate(1);
  return x;
}

function bucketLabel(d: Date, g: Granularity): string {
  if (g === "hour") return `${String(d.getHours()).padStart(2, "0")}:00`;
  if (g === "day") return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  if (g === "week") return `Sem ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  return d.toLocaleDateString("es-AR", { month: "short", year: "2-digit" });
}

export function buildBuckets(orders: MainOrder[], g: Granularity): Bucket[] {
  const map = new Map<number, Bucket>();
  for (const o of orders) {
    const start = bucketStart(new Date(o.createdAt), g);
    const key = start.getTime();
    let b = map.get(key);
    if (!b) {
      b = { key: String(key), label: bucketLabel(start, g), start: key, generated: 0, paid: 0, unconfirmed: 0, rate: null };
      map.set(key, b);
    }
    b.generated += 1;
    if (o.paid) b.paid += 1;
  }
  return [...map.values()]
    .sort((a, b) => a.start - b.start)
    .map((b) => ({ ...b, unconfirmed: b.generated - b.paid, rate: b.generated ? (b.paid / b.generated) * 100 : null }));
}

/** Média histórica real: todos os pedidos anteriores ao início do dia de hoje. */
export function historicalRate(orders: MainOrder[], now = new Date()): { rate: number; sample: number; days: number } {
  const cutoff = startOfDay(now).getTime();
  const past = orders.filter((o) => new Date(o.createdAt).getTime() < cutoff);
  const paid = past.filter((o) => o.paid).length;
  const days = new Set(past.map((o) => startOfDay(new Date(o.createdAt)).getTime())).size;
  return { rate: past.length ? (paid / past.length) * 100 : 0, sample: past.length, days };
}

export type HealthState = "HEALTHY" | "WARNING" | "CRITICAL" | "NO_DATA";

export interface Health {
  state: HealthState;
  deltaPp: number;
  current: number;
  historical: number;
  sample: number;
}

export function assessHealth(current: number, hist: { rate: number; sample: number }, currentSample: number): Health {
  if (hist.sample < 10 || currentSample < 3) {
    return { state: "NO_DATA", deltaPp: current - hist.rate, current, historical: hist.rate, sample: currentSample };
  }
  const delta = current - hist.rate;
  // Tolerância proporcional ao próprio histórico (não valores fixos arbitrários).
  const warn = Math.max(4, hist.rate * 0.12);
  const crit = Math.max(10, hist.rate * 0.3);
  const state: HealthState = delta <= -crit ? "CRITICAL" : delta <= -warn ? "WARNING" : "HEALTHY";
  return { state, deltaPp: delta, current, historical: hist.rate, sample: currentSample };
}

export interface Anomaly {
  startedAt: number;
  lastAt: number;
  ongoing: boolean;
  buckets: Bucket[];
  generated: number;
  paid: number;
  unconfirmed: number;
  rate: number;
  historical: number;
  deltaPp: number;
  revenue: number;
  estimatedUnconfirmedRevenue: number;
  reason: string;
}

/**
 * Detecta a primeira hora recente em que a taxa de confirmação caiu de forma
 * relevante frente à média histórica, mantendo volume de pedidos gerados.
 */
export function detectAnomaly(orders: MainOrder[], hist: { rate: number; sample: number }, now = new Date()): Anomaly | null {
  if (hist.sample < 10) return null;
  const windowFrom = now.getTime() - 2 * DAY;
  const recent = orders.filter((o) => new Date(o.createdAt).getTime() >= windowFrom);
  const buckets = buildBuckets(recent, "hour").filter((b) => b.generated >= 2);
  if (!buckets.length) return null;
  const threshold = hist.rate - Math.max(10, hist.rate * 0.3);

  let startIdx = -1;
  for (let i = 0; i < buckets.length; i++) {
    const b = buckets[i]!;
    if ((b.rate ?? 100) <= threshold) {
      startIdx = i;
      break;
    }
  }
  if (startIdx === -1) return null;

  const affected = buckets.slice(startIdx);
  const generated = affected.reduce((s, b) => s + b.generated, 0);
  const paid = affected.reduce((s, b) => s + b.paid, 0);
  const rate = generated ? (paid / generated) * 100 : 0;
  if (rate > threshold) return null;

  const fromTs = affected[0]!.start;
  const affectedOrders = orders.filter((o) => new Date(o.createdAt).getTime() >= fromTs);
  const s = summarize(affectedOrders);
  const lastBucket = affected[affected.length - 1]!;
  const ongoing = now.getTime() - lastBucket.start < 3 * 3600000;

  const firstOrder = affectedOrders
    .slice()
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .find((o) => !o.paid);

  return {
    startedAt: firstOrder ? new Date(firstOrder.createdAt).getTime() : fromTs,
    lastAt: lastBucket.start,
    ongoing,
    buckets: affected,
    generated: s.generated,
    paid: s.paid,
    unconfirmed: s.unconfirmed,
    rate: s.confirmationRate,
    historical: hist.rate,
    deltaPp: s.confirmationRate - hist.rate,
    revenue: s.revenue,
    estimatedUnconfirmedRevenue: s.estimatedUnconfirmedRevenue,
    reason:
      s.generated >= 3 && s.unconfirmed > s.paid
        ? "Posible problema en el funnel de pago"
        : "Caída inusual en la confirmación de pedidos",
  };
}

export interface ComparisonRow {
  label: string;
  current: Summary;
  previous: Summary;
}

export function buildComparisons(orders: MainOrder[], now = new Date()): ComparisonRow[] {
  const today = startOfDay(now);
  const sliceBy = (from: Date, to: Date) => summarize(orders.filter((o) => inRange(o.createdAt, from, to)));
  const d = (n: number) => new Date(today.getTime() + n * DAY);
  return [
    { label: "Hoy vs Ayer", current: sliceBy(today, d(1)), previous: sliceBy(d(-1), today) },
    { label: "Hoy vs mismo día semana pasada", current: sliceBy(today, d(1)), previous: sliceBy(d(-7), d(-6)) },
    { label: "Últimos 7 días vs 7 anteriores", current: sliceBy(d(-6), d(1)), previous: sliceBy(d(-13), d(-6)) },
    { label: "Últimos 30 días vs 30 anteriores", current: sliceBy(d(-29), d(1)), previous: sliceBy(d(-59), d(-29)) },
  ];
}

export function fmtMoney(v: number, currency = "ARS"): string {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency, maximumFractionDigits: 0 }).format(v || 0);
}

export function fmtPct(v: number | null): string {
  if (v === null || Number.isNaN(v)) return "—";
  return `${v.toFixed(1)}%`;
}

export function fmtTime(ts: number | string): string {
  const d = typeof ts === "number" ? new Date(ts) : new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function fmtDate(ts: number | string): string {
  const d = typeof ts === "number" ? new Date(ts) : new Date(ts);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function uniqueValues(orders: MainOrder[], pick: (o: MainOrder) => string | null, fallback: string): string[] {
  return [...new Set(orders.map((o) => pick(o) ?? fallback))].sort();
}
