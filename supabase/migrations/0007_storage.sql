-- 0007 storage buckets. Refs: SPEC §11.3
INSERT INTO storage.buckets (id, name, public) VALUES ('screenshots', 'screenshots', true), ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read screenshots" ON storage.objects;
CREATE POLICY "Public read screenshots" ON storage.objects FOR SELECT USING (bucket_id = 'screenshots');
DROP POLICY IF EXISTS "Auth write screenshots" ON storage.objects;
CREATE POLICY "Auth write screenshots" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'screenshots' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth update screenshots" ON storage.objects;
CREATE POLICY "Auth update screenshots" ON storage.objects FOR UPDATE USING (bucket_id = 'screenshots' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth delete screenshots" ON storage.objects;
CREATE POLICY "Auth delete screenshots" ON storage.objects FOR DELETE USING (bucket_id = 'screenshots' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;
CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
DROP POLICY IF EXISTS "Auth write avatars" ON storage.objects;
CREATE POLICY "Auth write avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth update avatars" ON storage.objects;
CREATE POLICY "Auth update avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Auth delete avatars" ON storage.objects;
CREATE POLICY "Auth delete avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
