CREATE TABLE public.profile (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  bio text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now()
);