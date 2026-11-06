DELETE FROM public.orders WHERE email = 'agente.diag@example.com';
DELETE FROM public.order_events WHERE customer_email = 'agente.diag@example.com' OR utm_source = 'test_agent';