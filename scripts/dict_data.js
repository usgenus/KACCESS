const fs = require('fs');
const path = require('path');

// 1. Data for the Medical Dictionary
const dictionaryData = [
  // 진료과목
  { cat: "진료과목", en: "Internal Medicine", ko: "일반 내과", desc: "성인 만성질환, 고혈압, 당뇨, 감기 등 포괄적 1차 진료" },
  { cat: "진료과목", en: "Cardiology", ko: "심장내과 / 순환기내과", desc: "고혈압, 협심증, 부정맥, 심부전, 혈관 질환 전문 진료" },
  { cat: "진료과목", en: "Neurology", ko: "신경과 / 뇌신경과", desc: "뇌졸중, 치매, 어지럼증, 두통, 파킨슨병 등 뇌신경 질환" },
  { cat: "진료과목", en: "Endocrinology", ko: "내분비내과", desc: "당뇨병, 갑상선 질환, 골다공증, 호르몬 이상 질환" },
  { cat: "진료과목", en: "Gastroenterology (GI)", ko: "소화기내과", desc: "위·대장 내시경, 역류성 식도염, 간염, 위장 질환" },
  { cat: "진료과목", en: "Orthopedics", ko: "정형외과", desc: "관절염, 척추 디스크, 골절, 인대 손상 치료" },
  { cat: "진료과목", en: "Ophthalmology", ko: "안과", desc: "백내장, 녹내장, 황반변성, 시력 교정 및 안과 질환" },
  { cat: "진료과목", en: "Dermatology", ko: "피부과", desc: "피부염, 습진, 피부암 검진, 대상포진, 알레르기" },
  { cat: "진료과목", en: "Urology", ko: "비뇨의학과", desc: "전립선 비대증, 요로결석, 방광염, 신장 질환" },
  { cat: "진료과목", en: "Family Medicine", ko: "가정의학과", desc: "온 가족 주치의(PCP) 1차 진료 및 정기 건강검진" },

  // 필수 증상 표현
  { cat: "증상 표현", en: "Chest tightness / Chest pain", ko: "가슴 답답함 / 흉통", desc: "예: I feel a sharp pain in my chest. (가슴에 찌르는 듯한 통증이 있습니다.)" },
  { cat: "증상 표현", en: "Shortness of breath / Dyspnea", ko: "호흡 곤란 / 숨가쁨", desc: "예: I have difficulty breathing when climbing stairs. (계단을 오를 때 숨이 찹니다.)" },
  { cat: "증상 표현", en: "Dizziness / Vertigo", ko: "어지럼증 / 현기증", desc: "예: The room is spinning around me. (주변이 핑핑 도는 것처럼 어지럽습니다.)" },
  { cat: "증상 표현", en: "Numbness / Tingling sensation", ko: "저림 / 감각 마비", desc: "예: My left hand feels numb and tingling. (왼손이 저리고 감각이 둔합니다.)" },
  { cat: "증상 표현", en: "Heart palpitations", ko: "가슴 두근거림 / 심계항진", desc: "예: My heart is beating very fast and irregularly. (심장이 빠르고 불규칙하게 뜁니다.)" },
  { cat: "증상 표현", en: "Fatigue / General weakness", ko: "만성 피로 / 전신 쇠약감", desc: "예: I feel exhausted all the time with no energy. (기운이 없고 항상 피곤합니다.)" },
  { cat: "증상 표현", en: "Swelling / Edema", ko: "부종 / 붓기", desc: "예: My ankles and feet are swollen. (발목과 발이 많이 붓습니다.)" },
  { cat: "증상 표현", en: "Indigestion / Heartburn", ko: "소화불량 / 속쓰림", desc: "예: I have a burning sensation in my stomach. (속이 쓰리고 소화가 안 됩니다.)" },

  // 검사 및 약물
  { cat: "검사 및 약물", en: "Fasting Blood Glucose / HbA1c", ko: "공복 혈당 / 당화혈색소", desc: "당뇨 진단 및 지난 2~3개월간의 평균 혈당 조절 지표" },
  { cat: "검사 및 약물", en: "Lipid Panel (Cholesterol / Triglycerides)", ko: "지질 검사 (콜레스테롤 / 중성지방)", desc: "총콜레스테롤, HDL(좋은), LDL(나쁜), 중성지방 수치 측정" },
  { cat: "검사 및 약물", en: "Blood Pressure (Systolic / Diastolic)", ko: "혈압 (수축기 / 이완기)", desc: "정상 혈압 기준: 120/80 mmHg 미만" },
  { cat: "검사 및 약물", en: "Colonoscopy / Endoscopy", ko: "대장내시경 / 위내시경", desc: "소화기계 용종, 암, 궤양 조기 진단 및 검사" },
  { cat: "검사 및 약물", en: "Generic Drug vs Brand Drug", ko: "제네릭(복제약) vs 오리지널 브랜드약", desc: "동일 성분과 효능이나 제네릭이 코페이와 약값이 훨씬 저렴" },
  { cat: "검사 및 약물", en: "Prescription Refill", ko: "처방전 리필(재조제)", desc: "남은 리필 횟수 확인 후 약국 또는 병원에 추가 조제 요청" },

  // 진료실 회화 및 보험
  { cat: "진료실 회화", en: "I need a Korean interpreter, please.", ko: "한국어 의료 통역사를 요청합니다.", desc: "미국 병원/진료소에서 연방법에 따라 무료 통역 서비스 요청" },
  { cat: "진료실 회화", en: "Is this clinic in-network with my insurance?", ko: "제 보험 네트워크에 포함된 병원인가요?", desc: "예상치 못한 의료비(Out-of-network) 청구를 방지하기 위한 사전 확인" },
  { cat: "진료실 회화", en: "What is my Copay and Deductible?", ko: "제 코페이와 디덕터블(본인부담금)은 얼마인가요?", desc: "진료 당일 현장 지불액 및 연간 기본 부담금 확인" },
  { cat: "진료실 회화", en: "Do I need a referral to see a specialist?", ko: "전문의 진료를 위해 주치의 의뢰서(Referral)가 필요한가요?", desc: "HMO 플랜의 경우 주치의 사전 의뢰서가 필수적임" },
  { cat: "진료실 회화", en: "Can I apply for Financial Assistance / Charity Care?", ko: "병원비 재정 지원(Charity Care)을 신청할 수 있나요?", desc: "저소득 또는 무보험자의 경우 병원비 감면 프로그램 신청" }
];

console.log('Dictionary items:', dictionaryData.length);
