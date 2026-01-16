CREATE TABLE public.comments (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  blog_id bigint REFERENCES public.blogs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  username text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Allow individual insert" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);