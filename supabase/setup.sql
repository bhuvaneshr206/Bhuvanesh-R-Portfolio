-- ============================================================
-- COMPLETE DATABASE SETUP — FIXED VERSION
-- Run this in Supabase SQL Editor
-- ============================================================

-- PROFILE TABLE
CREATE TABLE IF NOT EXISTS public.profile (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT NOT NULL DEFAULT 'Bhuvanesh R',
  bio          TEXT NOT NULL DEFAULT 'Embedded Systems & Full Stack Developer',
  tagline      TEXT DEFAULT 'Embedded Systems & Full Stack Developer',
  email        TEXT DEFAULT 'bhuvaneshr206@gmail.com',
  phone        TEXT DEFAULT '',
  location     TEXT DEFAULT 'Tamil Nadu, India',
  avatar_url   TEXT,
  github_url   TEXT,
  linkedin_url TEXT,
  resume_url   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS phone        TEXT DEFAULT '';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS location     TEXT DEFAULT '';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS tagline      TEXT DEFAULT '';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS avatar_url   TEXT;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS github_url   TEXT;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS resume_url   TEXT;
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS updated_at   TIMESTAMPTZ DEFAULT NOW();

-- SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  level      INTEGER NOT NULL DEFAULT 80 CHECK (level BETWEEN 0 AND 100),
  category   TEXT DEFAULT 'Frontend',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  tech_stack   TEXT[] DEFAULT '{}',
  project_link TEXT DEFAULT '',
  github_link  TEXT DEFAULT '',
  image_url    TEXT DEFAULT '',
  featured     BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title          TEXT NOT NULL,
  issued_by      TEXT NOT NULL,
  file_url       TEXT DEFAULT '',
  issued_date    DATE,
  credential_url TEXT DEFAULT '',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.education (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  degree         TEXT NOT NULL,
  institution    TEXT NOT NULL,
  field_of_study TEXT DEFAULT '',
  start_year     TEXT NOT NULL,
  end_year       TEXT NOT NULL,
  grade          TEXT DEFAULT '',
  description    TEXT DEFAULT '',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- EXPERIENCE TABLE
CREATE TABLE IF NOT EXISTS public.experience (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role        TEXT NOT NULL,
  company     TEXT NOT NULL,
  location    TEXT DEFAULT '',
  start_date  TEXT NOT NULL,
  end_date    TEXT DEFAULT '',
  is_current  BOOLEAN DEFAULT FALSE,
  description TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  icon        TEXT DEFAULT 'code',
  price_range TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  role       TEXT DEFAULT '',
  company    TEXT DEFAULT '',
  message    TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  rating     INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INSERT DEFAULT PROFILE ROW
INSERT INTO public.profile (name, bio, tagline, email, location)
SELECT 'Bhuvanesh R', 'Embedded Systems & Full Stack Developer passionate about IoT and web.', 'Embedded Systems & Full Stack Developer', 'bhuvaneshr206@gmail.com', 'Tamil Nadu, India'
WHERE NOT EXISTS (SELECT 1 FROM public.profile);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profile      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages     ENABLE ROW LEVEL SECURITY;

-- DROP ALL OLD POLICIES FIRST (fixes duplicate policy error)
DO $$ DECLARE r RECORD;
BEGIN FOR r IN SELECT policyname, tablename FROM pg_policies WHERE schemaname='public' LOOP
  EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
END LOOP; END $$;

-- DROP OLD STORAGE POLICIES (fixes "already exists" error)
DROP POLICY IF EXISTS "public read storage"  ON storage.objects;
DROP POLICY IF EXISTS "admin upload storage" ON storage.objects;
DROP POLICY IF EXISTS "admin update storage" ON storage.objects;
DROP POLICY IF EXISTS "admin delete storage" ON storage.objects;
DROP POLICY IF EXISTS "Public read storage"  ON storage.objects;
DROP POLICY IF EXISTS "Admin upload storage" ON storage.objects;

-- PUBLIC READ POLICIES
CREATE POLICY "public read profile"      ON public.profile      FOR SELECT USING (true);
CREATE POLICY "public read skills"       ON public.skills       FOR SELECT USING (true);
CREATE POLICY "public read projects"     ON public.projects     FOR SELECT USING (true);
CREATE POLICY "public read certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "public read education"    ON public.education    FOR SELECT USING (true);
CREATE POLICY "public read experience"   ON public.experience   FOR SELECT USING (true);
CREATE POLICY "public read services"     ON public.services     FOR SELECT USING (true);
CREATE POLICY "public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "public insert messages"   ON public.messages     FOR INSERT WITH CHECK (true);

-- ADMIN FULL ACCESS
CREATE POLICY "admin all profile"      ON public.profile      FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin all skills"       ON public.skills       FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin all projects"     ON public.projects     FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin all certificates" ON public.certificates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin all education"    ON public.education    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin all experience"   ON public.experience   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin all services"     ON public.services     FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin all testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin all messages"     ON public.messages     FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES (fresh)
CREATE POLICY "public read storage"  ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "admin upload storage" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio');
CREATE POLICY "admin update storage" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio');
CREATE POLICY "admin delete storage" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio');
