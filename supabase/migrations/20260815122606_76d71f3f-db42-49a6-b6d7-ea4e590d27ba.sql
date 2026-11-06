CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  site text,
  status text,
  nombre text,
  telefono text,
  email text,
  direccion text,
  colonia text,
  ciudad text,
  estado text,
  codigo_postal text,
  metodo_pago text,
  producto text,
  slug text,
  color text,
  total numeric NOT NULL DEFAULT 0,
  attempt_number text,
  comprobante_filename text,
  comprobante_type text,
  comprobante_url text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  ttclid text,
  fbclid text,
  gclid text,
  referrer text,
  landing_url text
);

GRANT INSERT ON public.orders TO anon;
GRANT INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create an order" ON public.orders
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE INDEX orders_created_at_idx ON public.orders (created_at DESC);