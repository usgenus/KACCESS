-- =========================================================
-- NJ Access Portal - NJ Partners (뉴저지 파트너즈) Supabase Schema
-- Run this in your Supabase SQL Editor to create tables & storage
-- =========================================================

-- 1. Hero Slides Table (Enforce max 3 visible on frontend/CMS)
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  tag TEXT DEFAULT '프리미엄 샘플 · 가상 상호 · 종합병원',
  "imageUrl" TEXT,
  "buttonText" TEXT DEFAULT '자세히 보기 →',
  "buttonLink" TEXT DEFAULT '#',
  "order" INTEGER DEFAULT 1,
  visible BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Partners Table (Public Directory)
CREATE TABLE IF NOT EXISTS public.partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  town TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  intro TEXT,
  content TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  "minisiteUrl" TEXT,
  "contactMethod" TEXT NOT NULL DEFAULT 'kakao', -- 'kakao' OR 'email'
  email TEXT,
  "kakaoChannelId" TEXT,
  featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 1,
  visible BOOLEAN DEFAULT true,
  "isSample" TEXT DEFAULT '가상 상호',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Partner Private Credentials Table (Kept separate from public read path)
CREATE TABLE IF NOT EXISTS public.partner_credentials (
  "partnerId" TEXT PRIMARY KEY REFERENCES public.partners(id) ON DELETE CASCADE,
  "kakaoJsKey" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_credentials ENABLE ROW LEVEL SECURITY;

-- Public can ONLY read visible hero slides
CREATE POLICY "Public can view visible hero slides" ON public.hero_slides
  FOR SELECT USING (visible = true);

-- Public can ONLY read visible partners
CREATE POLICY "Public can view visible partners" ON public.partners
  FOR SELECT USING (visible = true);

-- Partner credentials: No public select allowed!
CREATE POLICY "No public read on credentials" ON public.partner_credentials
  FOR SELECT USING (false);
