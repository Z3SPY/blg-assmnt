-- 20260112184200_create_blogs_table.sql
CREATE TABLE public.blogs (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid REFERENCES auth.users(id) NOT NULL, -- Link to Supabase Auth users
  title text NOT NULL,
  content text NOT NULL,  -- Mark down content
  created_at timestamp with time zone DEFAULT now()
);