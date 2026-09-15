-- =========================================================
-- Healthcare Access Portal (NJAP) - Medical Forum Schema
-- =========================================================

-- 1. Medical Specialties Table (15 Core Disciplines)
CREATE TABLE IF NOT EXISTS public.forum_specialties (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_ko TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  "order" INTEGER DEFAULT 1,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Forum Users (Google OAuth Profiles & Clinicians)
CREATE TABLE IF NOT EXISTS public.forum_users (
  id TEXT PRIMARY KEY, -- Google sub ID or custom user ID
  email TEXT,
  name TEXT NOT NULL,
  avatar TEXT,
  "isVerifiedClinician" BOOLEAN DEFAULT false,
  "clinicianTitle" TEXT, -- e.g., '순환기내과 전문의 (MD, FACC)'
  "isBanned" BOOLEAN DEFAULT false,
  "lastActiveAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Forum Questions / Threads
CREATE TABLE IF NOT EXISTS public.forum_questions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  "specialtyId" TEXT REFERENCES public.forum_specialties(id) ON DELETE SET NULL,
  "authorId" TEXT REFERENCES public.forum_users(id) ON DELETE CASCADE,
  "authorName" TEXT NOT NULL,
  "authorAvatar" TEXT,
  "authorBadge" TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  "viewCount" INTEGER DEFAULT 0,
  "replyCount" INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'flagged', 'hidden'
  tags JSONB DEFAULT '[]'::jsonb,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Forum Answers / Replies
CREATE TABLE IF NOT EXISTS public.forum_answers (
  id TEXT PRIMARY KEY,
  "questionId" TEXT REFERENCES public.forum_questions(id) ON DELETE CASCADE,
  "authorId" TEXT REFERENCES public.forum_users(id) ON DELETE CASCADE,
  "authorName" TEXT NOT NULL,
  "authorAvatar" TEXT,
  "authorBadge" TEXT,
  body TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  upvotes INTEGER DEFAULT 0,
  "upvotedBy" JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active', -- 'active', 'flagged', 'hidden'
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Seed Core Medical Specialties & Events
INSERT INTO public.forum_specialties (id, slug, name_ko, name_en, description, icon, color, "order") VALUES
  ('events', 'events', '이벤트', 'Events', '뉴저지 한인 의료접근센터 공식 이벤트, 세미나, 건강 강좌 및 공지', 'fa-calendar-star', '#E11D48', 0),
  ('cardiology', 'cardiology', '순환기·심장내과', 'Cardiology', '고혈압, 관상동맥질환, 부정맥, 심부전 및 심장혈관 질환 상담', 'fa-heart-pulse', '#EF4444', 1),
  ('neurology', 'neurology', '신경과', 'Neurology', '뇌졸중, 치매, 파킨슨병, 두통, 어지럼증 및 말초신경 질환', 'fa-brain', '#8B5CF6', 2),
  ('oncology', 'oncology', '종양·암내과', 'Oncology', '암 예방, 조기 검진, 항암 치료 및 치료 후 관리 케어', 'fa-ribbon', '#EC4899', 3),
  ('pediatrics', 'pediatrics', '소아청소년과', 'Pediatrics', '영유아 발달, 예방접종, 성장, 소아 알레르기 및 급성 질환', 'fa-baby', '#3B82F6', 4),
  ('dermatology', 'dermatology', '피부과', 'Dermatology', '아토피, 피부염, 건선, 색소질환, 피부암 조기 진단', 'fa-hand-dots', '#F59E0B', 5),
  ('orthopedics', 'orthopedics', '정형외과', 'Orthopedics', '관절염, 척추 디스크, 골절, 인대 손상 및 스포츠 손상', 'fa-bone', '#10B981', 6),
  ('endocrinology', 'endocrinology', '내분비내과', 'Endocrinology', '당뇨병, 갑상선 질환, 골다공증, 비만 및 대사증후군', 'fa-dna', '#06B6D4', 7),
  ('gastroenterology', 'gastroenterology', '소화기내과', 'Gastroenterology', '역류성 식도염, 위염, 위/대장 용종, 간염, 췌담도 질환', 'fa-virus-slash', '#14B8A6', 8),
  ('psychiatry', 'psychiatry', '정신건강의학과', 'Psychiatry', '우울증, 불안장애, 불면증, 공황장애, 시니어 인지케어', 'fa-head-side-virus', '#6366F1', 9),
  ('pulmonology', 'pulmonology', '호흡기내과', 'Pulmonology', '천식, 만성폐쇄성폐질환(COPD), 만성 기침, 폐렴, 수면무호흡', 'fa-lungs', '#0284C7', 10),
  ('immunology', 'immunology', '면역·감염내과', 'Immunology & Infectious Disease', '자가면역질환, 류마티스, 백신 접종, 바이러스 및 세균 감염', 'fa-shield-virus', '#84CC16', 11),
  ('obgyn', 'obgyn', '산부인과', 'OB-GYN', '여성 건강검진, 갱년기 호르몬 치료, 부인과 질환, 산전 관리', 'fa-venus', '#F43F5E', 12),
  ('radiology', 'radiology', '영상의학과', 'Radiology', 'X-ray, CT, MRI, 초음파 판독 및 영상 판독 문의 가이드', 'fa-radiation', '#64748B', 13),
  ('emergency', 'emergency', '응급의학과', 'Emergency Medicine', '응급실(ER) 방문 기준, 급성 흉통, 골절 대처 및 긴급 행동 요령', 'fa-truck-medical', '#DC2626', 14),
  ('internal_medicine', 'general-internal', '일반·가정의학과/내과', 'General/Internal Medicine', '성인 만성질환 종합관리, 정기 건강검진, 1차 진료 네비게이션', 'fa-stethoscope', '#1E3A8A', 15)
ON CONFLICT (id) DO UPDATE SET
  name_ko = EXCLUDED.name_ko,
  name_en = EXCLUDED.name_en,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  "order" = EXCLUDED."order";

-- 6. Row Level Security Policies
ALTER TABLE public.forum_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access for Specialties" ON public.forum_specialties FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Questions" ON public.forum_questions FOR SELECT USING (status != 'hidden');
CREATE POLICY "Public Read Access for Answers" ON public.forum_answers FOR SELECT USING (status != 'hidden');
CREATE POLICY "Public Read Access for Users" ON public.forum_users FOR SELECT USING (true);
