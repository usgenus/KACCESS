const fs = require('fs');
const path = require('path');

const forumJsonPath = path.join(__dirname, '..', 'data', 'forum.json');
const data = JSON.parse(fs.readFileSync(forumJsonPath, 'utf8'));

const updatedSpecialties = [
  {
    "id": "events",
    "slug": "events",
    "name_ko": "이벤트",
    "name_en": "Events",
    "description": "뉴저지 한인 의료접근센터 공식 이벤트, 세미나, 건강 강좌 및 공지",
    "icon": "fa-calendar-star",
    "color": "#E11D48",
    "order": 0,
    "isAdminOnly": true
  },
  {
    "id": "internal_medicine",
    "slug": "general-internal",
    "name_ko": "내과 (일반·가정의학과)",
    "name_en": "Internal & Family Medicine",
    "description": "성인 만성질환 종합관리, 정기 건강검진, 1차 진료 네비게이션",
    "icon": "fa-stethoscope",
    "color": "#1E3A8A",
    "order": 1
  },
  {
    "id": "cardiology",
    "slug": "cardiology",
    "name_ko": "순환기·심장내과",
    "name_en": "Cardiology",
    "description": "고혈압, 관상동맥질환, 부정맥, 심부전 및 흉통 질환",
    "icon": "fa-heart-pulse",
    "color": "#EF4444",
    "order": 2
  },
  {
    "id": "neurology",
    "slug": "neurology",
    "name_ko": "신경과",
    "name_en": "Neurology",
    "description": "뇌졸중, 치매, 두통, 어지럼증, 파킨슨병 및 말초신경",
    "icon": "fa-brain",
    "color": "#8B5CF6",
    "order": 3
  },
  {
    "id": "oncology",
    "slug": "oncology",
    "name_ko": "종양·암내과",
    "name_en": "Oncology",
    "description": "암 예방, 조기 검진, 항암 치료 및 치료 후 회복 케어",
    "icon": "fa-ribbon",
    "color": "#EC4899",
    "order": 4
  },
  {
    "id": "pediatrics",
    "slug": "pediatrics",
    "name_ko": "소아청소년과",
    "name_en": "Pediatrics",
    "description": "영유아 발달, 예방접종, 성장, 소아 알레르기 및 급성 질환",
    "icon": "fa-baby",
    "color": "#3B82F6",
    "order": 5
  },
  {
    "id": "dermatology",
    "slug": "dermatology",
    "name_ko": "피부과",
    "name_en": "Dermatology",
    "description": "아토피, 습진, 건선, 색소질환, 피부 가려움 및 피부암",
    "icon": "fa-hand-dots",
    "color": "#F59E0B",
    "order": 6
  },
  {
    "id": "orthopedics",
    "slug": "orthopedics",
    "name_ko": "정형외과",
    "name_en": "Orthopedics",
    "description": "퇴행성 관절염, 척추 디스크, 오십견, 골절 및 인대 손상",
    "icon": "fa-bone",
    "color": "#10B981",
    "order": 7
  },
  {
    "id": "endocrinology",
    "slug": "endocrinology",
    "name_ko": "내분비내과",
    "name_en": "Endocrinology",
    "description": "당뇨병, 갑상선 질환, 골다공증, 비만 및 호르몬 이상",
    "icon": "fa-dna",
    "color": "#06B6D4",
    "order": 8
  },
  {
    "id": "gastroenterology",
    "slug": "gastroenterology",
    "name_ko": "소화기내과",
    "name_en": "Gastroenterology",
    "description": "역류성 식도염, 위염, 위·대장 내시경 용종, 지방간, 췌장",
    "icon": "fa-virus-slash",
    "color": "#14B8A6",
    "order": 9
  },
  {
    "id": "psychiatry",
    "slug": "psychiatry",
    "name_ko": "정신건강의학과",
    "name_en": "Psychiatry",
    "description": "불면증, 우울증, 불안장애, 공황장애 및 시니어 인지건강",
    "icon": "fa-head-side-virus",
    "color": "#6366F1",
    "order": 10
  },
  {
    "id": "pulmonology",
    "slug": "pulmonology",
    "name_ko": "호흡기내과",
    "name_en": "Pulmonology",
    "description": "천식, COPD(만성폐쇄성폐질환), 만성 기침, 폐렴, 수면무호흡",
    "icon": "fa-lungs",
    "color": "#0284C7",
    "order": 11
  },
  {
    "id": "immunology",
    "slug": "immunology",
    "name_ko": "면역·감염내과",
    "name_en": "Immunology & Infectious Disease",
    "description": "류마티스, 자가면역질환, 백신 접종, 바이러스/세균성 감염증",
    "icon": "fa-shield-virus",
    "color": "#84CC16",
    "order": 12
  },
  {
    "id": "obgyn",
    "slug": "obgyn",
    "name_ko": "산부인과",
    "name_en": "OB-GYN",
    "description": "여성 정기검진, 갱년기 호르몬 치료, 자궁/난소 질환, 산전 관리",
    "icon": "fa-venus",
    "color": "#F43F5E",
    "order": 13
  },
  {
    "id": "radiology",
    "slug": "radiology",
    "name_ko": "영상의학과",
    "name_en": "Radiology",
    "description": "X-ray, CT, MRI, 초음파 영상 판독 해석 및 검사 가이드",
    "icon": "fa-radiation",
    "color": "#64748B",
    "order": 14
  },
  {
    "id": "emergency",
    "slug": "emergency",
    "name_ko": "응급의학과",
    "name_en": "Emergency Medicine",
    "description": "응급실(ER) 방문 기준, 급성 흉통·호흡곤란, 긴급 대처 가이드",
    "icon": "fa-truck-medical",
    "color": "#DC2626",
    "order": 15
  },
  {
    "id": "nursing_home",
    "slug": "nursing-home",
    "name_ko": "요양원",
    "name_en": "Nursing Home / Long-Term Care",
    "description": "너싱홈 입소 절차, 재활 간호, 메디케이드/메디케어 혜택 및 장기요양 돌봄",
    "icon": "fa-house-medical",
    "color": "#059669",
    "order": 16
  },
  {
    "id": "hospice",
    "slug": "hospice",
    "name_ko": "호스피스",
    "name_en": "Hospice & Palliative Care",
    "description": "완화의료, 통증 조절, 가정 호스피스, 임종 돌봄 및 가족 심리 상담",
    "icon": "fa-hand-holding-heart",
    "color": "#7C3AED",
    "order": 17
  }
];

data.specialties = updatedSpecialties;

// Check and add initial seed questions for nursing_home, hospice, and internal_medicine if not present
if (!data.questions.q_nursing_1) {
  data.questions.q_nursing_1 = {
    id: "q_nursing_1",
    specialtyId: "nursing_home",
    specialtySlug: "nursing-home",
    authorId: "u_patient_1",
    authorName: "포트리 시니어 회원",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    authorBadge: null,
    title: "뉴저지 메디케이드(MLTSS)를 통한 너싱홈 입소 자격과 신청 절차가 궁금합니다",
    body: "부모님께서 거동이 많이 불편해지셔서 24시간 돌봄이 필요한 상황입니다. 현재 메디케어를 가지고 계신데 너싱홈 장기요양 비용은 커버되지 않는다고 들었습니다. 뉴저지 메디케이드 MLTSS 프로그램을 통해 요양원 비용을 지원받으려면 어떤 자격 조건과 서류가 필요한가요?",
    images: [],
    status: "active",
    viewCount: 14,
    answerCount: 1,
    createdAt: "2026-08-28T14:30:00Z",
    updatedAt: "2026-08-28T16:00:00Z"
  };

  data.answers.a_nursing_1 = {
    id: "a_nursing_1",
    questionId: "q_nursing_1",
    authorId: "u_clinician_cardio",
    authorName: "박준형 전문의 (MD, FACC)",
    authorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&q=80",
    authorBadge: "Verified Clinician",
    body: "안녕하세요. 메디케어는 급성기 치료 후 단기 재활(최대 100일)만 커버하며, 장기 거주 돌봄(Custodial Care)은 지원하지 않습니다. 대신 뉴저지 주정부의 MLTSS(Managed Long Term Services and Supports) 메디케이드 프로그램을 통해 지원받으실 수 있습니다.\n\n1. 임상적 자격: 일상생활(식사, 보행, 목욕 등)에 간호 수준의 도움이 필요함을 증명하는 PAS(Pre-Admission Screening) 평가를 통과해야 합니다.\n2. 재정 자격: 월 소득 및 금융 자산 한도 기준(2026년 기준)을 충족해야 합니다.\n\n저희 센터 환자도우미 및 시니어 케어 내비게이션을 통해 서류 준비와 거주지 인근 한국어 지원 너싱홈 목록을 안내받으실 수 있습니다.",
    images: [],
    upvotes: 6,
    upvotedBy: [],
    status: "active",
    createdAt: "2026-08-28T16:00:00Z",
    updatedAt: "2026-08-28T16:00:00Z"
  };
}

if (!data.questions.q_hospice_1) {
  data.questions.q_hospice_1 = {
    id: "q_hospice_1",
    specialtyId: "hospice",
    specialtySlug: "hospice",
    authorId: "u_patient_2",
    authorName: "뉴저지 가족 회원",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
    authorBadge: null,
    title: "가정 호스피스(Home Hospice)와 입원형 호스피스의 차이 및 메디케어 전액 지원 여부 문의",
    body: "말기 진단을 받으신 가족 어르신을 위해 호스피스 완화의료를 알아보고 있습니다. 익숙한 자택에서 간호사가 방문하는 가정 호스피스와 전문 입원 병동형 호스피스는 어떤 차이가 있나요? 그리고 메디케어 Part A에서 본인부담금 없이 100% 커버되는지 궁금합니다.",
    images: [],
    status: "active",
    viewCount: 19,
    answerCount: 1,
    createdAt: "2026-08-30T10:15:00Z",
    updatedAt: "2026-08-30T11:40:00Z"
  };

  data.answers.a_hospice_1 = {
    id: "a_hospice_1",
    questionId: "q_hospice_1",
    authorId: "u_clinician_cardio",
    authorName: "박준형 전문의 (MD, FACC)",
    authorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&q=80",
    authorBadge: "Verified Clinician",
    body: "호스피스 케어는 환자분과 가족 모두의 존엄성과 평안을 돕는 완화의료 서비스입니다.\n\n1. 메디케어 혜택: 메디케어 Part A를 보유하신 경우, 메디케어 인증 호스피스 제공 기관을 통하면 방문 간호, 통증 조절 약물, 의료 장비(병원 침대, 산소기 등)가 거의 100% 전액 지원됩니다(약제비 소액 코페이 제외).\n\n2. 가정 호스피스 vs 입원 호스피스:\n- 가정 호스피스: 거주하시는 집(또는 너싱홈)으로 의사, 전담 간호사, 사회복지사, 영적 상담사가 정기적으로 방문하여 돌봄을 제공합니다.\n- 입원형 호스피스: 가정에서 통증이나 호흡곤란 조절이 급격히 어려워지는 경우 단기 집중 치료를 위해 시설에 입원하여 케어를 받습니다.\n\n환자분 상태에 맞춰 가장 편안한 환경을 선택하실 수 있으니 병원 소셜워커 또는 저희 포털을 통해 상담을 받아보세요.",
    images: [],
    upvotes: 8,
    upvotedBy: [],
    status: "active",
    createdAt: "2026-08-30T11:40:00Z",
    updatedAt: "2026-08-30T11:40:00Z"
  };
}

fs.writeFileSync(forumJsonPath, JSON.stringify(data, null, 4), 'utf8');
console.log('Successfully updated forum.json with 18 specialties (Events=0, Internal Medicine=1, Nursing Home=16, Hospice=17)');
