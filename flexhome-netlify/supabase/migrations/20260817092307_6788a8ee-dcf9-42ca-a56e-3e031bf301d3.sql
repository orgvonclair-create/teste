CREATE TABLE public.order_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  event_name text NOT NULL,
  order_id uuid,
  session_id text,
  customer_email text,
  customer_name text,
  product text,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'ARS',
  country text,
  utm_source text,
  utm_campaign text,
  site text,
  meta jsonb
);

CREATE INDEX order_events_occurred_at_idx ON public.order_events (occurred_at DESC);
CREATE INDEX order_events_event_name_idx ON public.order_events (event_name);
CREATE INDEX order_events_email_idx ON public.order_events (customer_email);

GRANT INSERT ON public.order_events TO anon, authenticated;
GRANT ALL ON public.order_events TO service_role;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can record funnel events" ON public.order_events FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.dashboard_access (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  passcode text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.dashboard_access TO service_role;
ALTER TABLE public.dashboard_access ENABLE ROW LEVEL SECURITY;
INSERT INTO public.dashboard_access (passcode) VALUES ('flexhome2026');