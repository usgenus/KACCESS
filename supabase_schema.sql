-- =========================================================
-- Healthcare Access Portal (NJAP) - Supabase Database Schema
-- Run this in your Supabase SQL Editor to create tables
-- =========================================================

-- 1. News & Blog Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Health & Wellness',
  date TEXT,
  "isTopStory" BOOLEAN DEFAULT false,
  "isLiveUpdate" BOOLEAN DEFAULT true,
  "isDoctorColumn" BOOLEAN DEFAULT false,
  "isPolicyReport" BOOLEAN DEFAULT false,
  excerpt TEXT,
  "coverImage" TEXT,
  "videoUrl" TEXT,
  "readTime" TEXT DEFAULT '3분',
  author TEXT DEFAULT '편집부',
  content TEXT,
  "summaryPoints" JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'published',
  images JSONB DEFAULT '[]'::jsonb,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Medical Video News Table
CREATE TABLE IF NOT EXISTS public.videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  speaker TEXT,
  category TEXT DEFAULT '만성질환 관리',
  date TEXT,
  duration TEXT DEFAULT '10:00',
  "youtubeUrl" TEXT,
  "thumbnailUrl" TEXT,
  "videoFile" TEXT,
  views TEXT DEFAULT '1.2만회',
  description TEXT,
  "order" INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Gallery Billboards Table
CREATE TABLE IF NOT EXISTS public.billboards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT DEFAULT '',
  "mediaType" TEXT DEFAULT 'image',
  "mediaUrl" TEXT,
  "videoUrl" TEXT,
  "linkUrl" TEXT DEFAULT '/about#contact',
  "linkText" TEXT DEFAULT '자세히 보기 →',
  "order" INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  type TEXT PRIMARY KEY, -- 'news', 'videos', 'billboards'
  items JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Insert Default Categories
INSERT INTO public.categories (type, items) VALUES
  ('news', '["전체", "의료칼럼", "FDA 리콜", "Health & Wellness", "Medicare & ACA", "보건 정책 & 메디케어 리포트", "보건 정책 & 리포트", "병원 소식"]'::jsonb),
  ('videos', '["전체", "심장 & 혈관", "뇌신경 질환", "암 예방 & 검진", "관절 & 정형외과", "만성질환 관리"]'::jsonb),
  ('billboards', '["SPECIAL CAMPAIGN", "MEDICARE UPDATE", "PATIENT SUPPORT", "HEALTH WEBINAR"]'::jsonb)
ON CONFLICT (type) DO UPDATE SET items = EXCLUDED.items;

-- Enable Row Level Security (RLS) & Public Read Policy
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access for Posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Billboards" ON public.billboards FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Categories" ON public.categories FOR SELECT USING (true);

-- Allow all operations with Service Role Key
CREATE POLICY "Service Role Full Access for Posts" ON public.posts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access for Videos" ON public.videos FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access for Billboards" ON public.billboards FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service Role Full Access for Categories" ON public.categories FOR ALL USING (auth.role() = 'service_role');
