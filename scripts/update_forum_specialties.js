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
    "id": "medical_billing",
    "slug": "medical-billing",
    "name_ko": "의료비/빌링",
    "name_en": "Medical Bills & Billing",
    "description": "미국 병원비 및 검사비 청구서(Bill), 분할 납부, 재정 지원 및 네고 상담",
    "icon": "fa-file-invoice-dollar",
    "color": "#0284C7",
    "order": 1
  },
  {
    "id": "hospital_recommendation",
    "slug": "hospital-recommendation",
    "name_ko": "병원 추천",
    "name_en": "Hospital Recommendations",
    "description": "지역별 우수 한인 병의원, 종합병원, 전문 클리닉 추천 및 진료 경험 공유",
    "icon": "fa-hospital-user",
    "color": "#059669",
    "order": 2
  },
  {
    "id": "health_insurance",
    "slug": "health-insurance",
    "name_ko": "의료보험",
    "name_en": "Health Insurance",
    "description": "메디케어, 메디케이드, 오바마케어(ACA) 및 직장 건강보험 가입·혜택 안내",
    "icon": "fa-shield-halved",
    "color": "#4F46E5",
    "order": 3
  },
  {
    "id": "internal_medicine",
    "slug": "general-internal",
    "name_ko": "내과 (일반·가정의학과)",
    "name_en": "Internal & Family Medicine",
    "description": "성인 만성질환 종합관리, 정기 건강검진, 1차 진료 네비게이션",
    "icon": "fa-stethoscope",
    "color": "#1E3A8A",
    "order": 4
  },
  {
    "id": "cardiology",
    "slug": "cardiology",
    "name_ko": "순환기·심장내과",
    "name_en": "Cardiology",
    "description": "고혈압, 관상동맥질환, 부정맥, 심부전 및 흉통 질환",
    "icon": "fa-heart-pulse",
    "color": "#EF4444",
    "order": 5
  },
  {
    "id": "neurology",
    "slug": "neurology",
    "name_ko": "신경과",
    "name_en": "Neurology",
    "description": "뇌졸중, 치매, 두통, 어지럼증, 파킨슨병 및 말초신경",
    "icon": "fa-brain",
    "color": "#8B5CF6",
    "order": 6
  },
  {
    "id": "oncology",
    "slug": "oncology",
    "name_ko": "종양·암내과",
    "name_en": "Oncology",
    "description": "암 예방, 조기 검진, 항암 치료 및 치료 후 회복 케어",
    "icon": "fa-ribbon",
    "color": "#EC4899",
    "order": 7
  },
  {
    "id": "pediatrics",
    "slug": "pediatrics",
    "name_ko": "소아청소년과",
    "name_en": "Pediatrics",
    "description": "영유아 발달, 예방접종, 성장, 소아 알레르기 및 급성 질환",
    "icon": "fa-baby",
    "color": "#3B82F6",
    "order": 8
  },
  {
    "id": "dermatology",
    "slug": "dermatology",
    "name_ko": "피부과",
    "name_en": "Dermatology",
    "description": "아토피, 습진, 건선, 색소질환, 피부 가려움 및 피부암",
    "icon": "fa-hand-dots",
    "color": "#F59E0B",
    "order": 9
  },
  {
    "id": "orthopedics",
    "slug": "orthopedics",
    "name_ko": "정형외과",
    "name_en": "Orthopedics",
    "description": "퇴행성 관절염, 척추 디스크, 오십견, 골절 및 인대 손상",
    "icon": "fa-bone",
    "color": "#10B981",
    "order": 10
  },
  {
    "id": "endocrinology",
    "slug": "endocrinology",
    "name_ko": "내분비내과",
    "name_en": "Endocrinology",
    "description": "당뇨병, 갑상선 질환, 골다공증, 비만 및 호르몬 이상",
    "icon": "fa-dna",
    "color": "#06B6D4",
    "order": 11
  },
  {
    "id": "gastroenterology",
    "slug": "gastroenterology",
    "name_ko": "소화기내과",
    "name_en": "Gastroenterology",
    "description": "역류성 식도염, 위염, 위·대장 내시경 용종, 지방간, 췌장",
    "icon": "fa-virus-slash",
    "color": "#14B8A6",
    "order": 12
  },
  {
    "id": "psychiatry",
    "slug": "psychiatry",
    "name_ko": "정신건강의학과",
    "name_en": "Psychiatry",
    "description": "불면증, 우울증, 불안장애, 공황장애 및 시니어 인지건강",
    "icon": "fa-head-side-virus",
    "color": "#6366F1",
    "order": 13
  },
  {
    "id": "pulmonology",
    "slug": "pulmonology",
    "name_ko": "호흡기내과",
    "name_en": "Pulmonology",
    "description": "천식, COPD(만성폐쇄성폐질환), 만성 기침, 폐렴, 수면무호흡",
    "icon": "fa-lungs",
    "color": "#0284C7",
    "order": 14
  },
  {
    "id": "immunology",
    "slug": "immunology",
    "name_ko": "면역·감염내과",
    "name_en": "Immunology & Infectious Disease",
    "description": "류마티스, 자가면역질환, 백신 접종, 바이러스/세균성 감염증",
    "icon": "fa-shield-virus",
    "color": "#84CC16",
    "order": 15
  },
  {
    "id": "obgyn",
    "slug": "obgyn",
    "name_ko": "산부인과",
    "name_en": "OB-GYN",
    "description": "여성 정기검진, 갱년기 호르몬 치료, 자궁/난소 질환, 산전 관리",
    "icon": "fa-venus",
    "color": "#F43F5E",
    "order": 16
  },
  {
    "id": "radiology",
    "slug": "radiology",
    "name_ko": "영상의학과",
    "name_en": "Radiology",
    "description": "X-ray, CT, MRI, 초음파 영상 판독 해석 및 검사 가이드",
    "icon": "fa-radiation",
    "color": "#64748B",
    "order": 17
  },
  {
    "id": "emergency",
    "slug": "emergency",
    "name_ko": "응급의학과",
    "name_en": "Emergency Medicine",
    "description": "응급실(ER) 방문 기준, 급성 흉통·호흡곤란, 긴급 대처 가이드",
    "icon": "fa-truck-medical",
    "color": "#DC2626",
    "order": 18
  },
  {
    "id": "nursing_home",
    "slug": "nursing-home",
    "name_ko": "요양원",
    "name_en": "Nursing Home / Long-Term Care",
    "description": "너싱홈 입소 절차, 재활 간호, 메디케이드/메디케어 혜택 및 장기요양 돌봄",
    "icon": "fa-house-medical",
    "color": "#059669",
    "order": 19
  },
  {
    "id": "hospice",
    "slug": "hospice",
    "name_ko": "호스피스",
    "name_en": "Hospice & Palliative Care",
    "description": "완화의료, 통증 조절, 가정 호스피스, 임종 돌봄 및 가족 심리 상담",
    "icon": "fa-hand-holding-heart",
    "color": "#7C3AED",
    "order": 20
  },
  {
    "id": "pharmacy",
    "slug": "pharmacy",
    "name_ko": "약국",
    "name_en": "Pharmacy",
    "description": "처방약 복약 지도, 일반의약품(OTC), 영양제 상호작용 및 미국 약국(CVS, Walgreens 등) 이용 안내",
    "icon": "fa-pills",
    "color": "#0D9488",
    "order": 21
  },
  {
    "id": "korean_medicine",
    "slug": "korean-medicine",
    "name_ko": "한의학",
    "name_en": "Korean Traditional Medicine / Acupuncture",
    "description": "한방 진료, 침구·부항 치료, 체질 맞춤 한약, 만성 통증 완화 및 한방 건강관리 안내",
    "icon": "fa-leaf",
    "color": "#B45309",
    "order": 22
  }
];

data.specialties = updatedSpecialties;

// Check and add initial seed questions for pharmacy
if (!data.questions.q_pharmacy_1) {
  data.questions.q_pharmacy_1 = {
    id: "q_pharmacy_1",
    specialtyId: "pharmacy",
    specialtySlug: "pharmacy",
    authorId: "u_patient_3",
    authorName: "팰팍 거주 회원",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    authorBadge: null,
    title: "CVS나 Walgreens에서 다른 약국으로 처방전(Rx) 이전하는 방법과 90일 치 조제 혜택 문의",
    body: "현재 만성 고혈압약과 당뇨약을 복용 중인데 단골 약국을 한국어 직원이 계신 인근 약국으로 옮기고 싶습니다. 의사 선생님께 다시 진료를 받아야 하나요, 아니면 약국끼리 처방전 이전(Prescription Transfer)이 가능한가요? 그리고 90일 치를 한 번에 조제받아 코페이를 아끼는 팁도 알고 싶습니다.",
    images: [],
    status: "active",
    viewCount: 16,
    answerCount: 1,
    createdAt: "2026-09-01T11:00:00Z",
    updatedAt: "2026-09-01T12:30:00Z"
  };

  data.answers.a_pharmacy_1 = {
    id: "a_pharmacy_1",
    questionId: "q_pharmacy_1",
    authorId: "u_clinician_cardio",
    authorName: "박준형 전문의 (MD, FACC)",
    authorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&q=80",
    authorBadge: "Verified Clinician",
    body: "안녕하세요! 처방전 이전(Prescription Transfer)은 병원을 다시 방문하실 필요 없이 아주 간편하게 진행됩니다.\n\n1. 처방전 이전 방법: 새로 이용하고자 하시는 약국(CVS, Walgreens 또는 한인 약국)에 방문하시거나 전화하셔서 기존 약국 이름, 전화번호, 그리고 복용 중이신 약품명(또는 처방 라벨의 Rx 번호)을 알려주시면 약사님들끼리 시스템을 통해 당일 직접 처방전을 이전해 드립니다.\n\n2. 90일 분량 처방(Maintenance Medication): 만성질환 약물은 담당 의사 선생님께 '90-day supply' 처방을 요청하시면 대부분의 메디케어/상업보험에서 30일분 3회보다 훨씬 저렴한 코페이로 3개월 치를 한 번에 수령하거나 우편 배송(Mail Order)으로 받아보실 수 있습니다.\n\n복용 중이신 다른 건강기능식품이나 비타민과의 상호작용도 약국 조제 시 약사님께 언제든 상담받아보시기 바랍니다.",
    images: [],
    upvotes: 7,
    upvotedBy: [],
    status: "active",
    createdAt: "2026-09-01T12:30:00Z",
    updatedAt: "2026-09-01T12:30:00Z"
  };
}

// Check and add initial seed questions for korean_medicine
if (!data.questions.q_korean_med_1) {
  data.questions.q_korean_med_1 = {
    id: "q_korean_med_1",
    specialtyId: "korean_medicine",
    specialtySlug: "korean-medicine",
    authorId: "u_patient_4",
    authorName: "버겐카운티 어르신",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    authorBadge: null,
    title: "뉴저지 메디케어 및 일반 건강보험에서 한방 침 치료(Acupuncture)가 커버되나요?",
    body: "만성 허리 디스크와 무릎 퇴행성 관절염으로 정형외과 물리치료를 받았으나 통증이 지속되어 한의원 침 치료를 받아보려 합니다. 현재 오리지널 메디케어와 메디케어 어드밴티지를 가지고 있는데 한방 침 치료와 부항이 보험 적용이 되는지, 자기부담금은 얼마나 되는지 궁금합니다.",
    images: [],
    status: "active",
    viewCount: 22,
    answerCount: 1,
    createdAt: "2026-09-03T14:20:00Z",
    updatedAt: "2026-09-03T15:45:00Z"
  };

  data.answers.a_korean_med_1 = {
    id: "a_korean_med_1",
    questionId: "q_korean_med_1",
    authorId: "u_clinician_cardio",
    authorName: "박준형 전문의 (MD, FACC)",
    authorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&q=80",
    authorBadge: "Verified Clinician",
    body: "안녕하세요. 미국 건강보험 및 메디케어에서의 한방 침술(Acupuncture) 커버리지에 대해 안내해 드립니다.\n\n1. 메디케어 보장 범위: 2020년부터 연방 메디케어는 '만성 요통(Chronic Low Back Pain)'에 대해 연간 최대 12회~20회까지 침 치료를 공식 보장(Part B)합니다. (단, 12주 이상 지속된 비특이성 요통 진단 기준)\n\n2. 메디케어 어드밴티지(Part C) & 상업 보험: 상당수의 어드밴티지 플랜(UnitedHealthcare, Aetna, Clover Health 등)에서 관절염, 목/어깨 결림, 만성 통증에 대해 연간 20~30회 내외로 회당 $10~$20 수준의 저렴한 코페이로 침 치료를 추가 혜택으로 제공하고 있습니다.\n\n3. 한약(Herbal Medicine): 한약은 대체로 보험 적용 대상에서 제외되므로 한의원 방문 전 소지하고 계신 보험 카드로 인-네트워크(In-Network) 한의사 여부와 침 치료 커버리지를 사전 확인하시는 것을 추천해 드립니다.",
    images: [],
    upvotes: 9,
    upvotedBy: [],
    status: "active",
    createdAt: "2026-09-03T15:45:00Z",
    updatedAt: "2026-09-03T15:45:00Z"
  };
}

fs.writeFileSync(forumJsonPath, JSON.stringify(data, null, 4), 'utf8');
console.log('Successfully updated forum.json with 23 specialties (including Pharmacy=21, Korean Medicine=22)');
