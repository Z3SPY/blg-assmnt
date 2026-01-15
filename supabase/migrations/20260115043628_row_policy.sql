ALTER TABLE public.blogs DISABLE ROW LEVEL SECURITY;

/* We can change this lator for policy*/ 
CREATE POLICY "Allow uploads to blog-covers"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'blog-covers'
);

CREATE POLICY "Allow all for profile-pictures"
ON storage.objects
FOR ALL 
TO public
USING (bucket_id = 'profile-pictures')
WITH CHECK (bucket_id = 'profile-pictures');