INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('encrypted-media', 'encrypted-media', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Members can access encrypted media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'encrypted-media' AND auth.role() = 'authenticated');
