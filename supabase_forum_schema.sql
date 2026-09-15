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
  ('medical_billing', 'medical-billing', '의료비/빌링', 'Medical Bills & Billing', '미국 병원비 및 검사비 청구서(Bill), 분할 납부, 재정 지원 및 네고 상담', 'fa-file-invoice-dollar', '#0284C7', 1),
  ('hospital_recommendation', 'hospital-recommendation', '병원 추천', 'Hospital Recommendations', '지역별 우수 한인 병의원, 종합병원, 전문 클리닉 추천 및 진료 경험 공유', 'fa-hospital-user', '#059669', 2),
  ('health_insurance', 'health-insurance', '의료보험', 'Health Insurance', '메디케어, 메디케이드, 오바마케어(ACA) 및 직장 건강보험 가입·혜택 안내', 'fa-shield-halved', '#4F46E5', 3),
  ('internal_medicine', 'general-internal', '내과 (일반·가정의학과)', 'Internal & Family Medicine', '성인 만성질환 종합관리, 정기 건강검진, 1차 진료 네비게이션', 'fa-stethoscope', '#1E3A8A', 4),
  ('cardiology', 'cardiology', '순환기·심장내과', 'Cardiology', '고혈압, 관상동맥질환, 부정맥, 심부전 및 심장혈관 질환 상담', 'fa-heart-pulse', '#EF4444', 5),
  ('neurology', 'neurology', '신경과', 'Neurology', '뇌졸중, 치매, 파킨슨병, 두통, 어지럼증 및 말초신경 질환', 'fa-brain', '#8B5CF6', 6),
  ('oncology', 'oncology', '종양·암내과', 'Oncology', '암 예방, 조기 검진, 항암 치료 및 치료 후 관리 케어', 'fa-ribbon', '#EC4899', 7),
  ('pediatrics', 'pediatrics', '소아청소년과', 'Pediatrics', '영유아 발달, 예방접종, 성장, 소아 알레르기 및 급성 질환', 'fa-baby', '#3B82F6', 8),
  ('dermatology', 'dermatology', '피부과', 'Dermatology', '아토피, 피부염, 건선, 색소질환, 피부암 조기 진단', 'fa-hand-dots', '#F59E0B', 9),
  ('orthopedics', 'orthopedics', '정형외과', 'Orthopedics', '관절염, 척추 디스크, 골절, 인대 손상 및 스포츠 손상', 'fa-bone', '#10B981', 10),
  ('endocrinology', 'endocrinology', '내분비내과', 'Endocrinology', '당뇨병, 갑상선 질환, 골다공증, 비만 및 대사증후군', 'fa-dna', '#06B6D4', 11),
  ('gastroenterology', 'gastroenterology', '소화기내과', 'Gastroenterology', '역류성 식도염, 위염, 위/대장 용종, 간염, 췌담도 질환', 'fa-virus-slash', '#14B8A6', 12),
  ('psychiatry', 'psychiatry', '정신건강의학과', 'Psychiatry', '우울증, 불안장애, 불면증, 공황장애, 시니어 인지케어', 'fa-head-side-virus', '#6366F1', 13),
  ('pulmonology', 'pulmonology', '호흡기내과', 'Pulmonology', '천식, 만성폐쇄성폐질환(COPD), 만성 기침, 폐렴, 수면무호흡', 'fa-lungs', '#0284C7', 14),
  ('immunology', 'immunology', '면역·감염내과', 'Immunology & Infectious Disease', '자가면역질환, 류마티스, 백신 접종, 바이러스 및 세균 감염', 'fa-shield-virus', '#84CC16', 15),
  ('obgyn', 'obgyn', '산부인과', 'OB-GYN', '여성 건강검진, 갱년기 호르몬 치료, 부인과 질환, 산전 관리', 'fa-venus', '#F43F5E', 16),
  ('radiology', 'radiology', '영상의학과', 'Radiology', 'X-ray, CT, MRI, 초음파 판독 및 영상 판독 문의 가이드', 'fa-radiation', '#64748B', 17),
  ('emergency', 'emergency', '응급의학과', 'Emergency Medicine', '응급실(ER) 방문 기준, 급성 흉통, 골절 대처 및 긴급 행동 요령', 'fa-truck-medical', '#DC2626', 18),
  ('nursing_home', 'nursing-home', '요양원', 'Nursing Home / Long-Term Care', '너싱홈 입소 절차, 재활 간호, 메디케이드/메디케어 혜택 및 장기요양 돌봄', 'fa-house-medical', '#059669', 19),
  ('hospice', 'hospice', '호스피스', 'Hospice & Palliative Care', '완화의료, 통증 조절, 가정 호스피스, 임종 돌봄 및 가족 심리 상담', 'fa-hand-holding-heart', '#7C3AED', 20)
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
