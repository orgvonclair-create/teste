CREATE POLICY "Anyone can upload a receipt" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'comprobantes');