const fs = require('fs');
const path = require('path');

const dictionaryData = [
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
  { cat: "증상 표현", en: "Chest tightness / Chest pain", ko: "가슴 답답함 / 흉통", desc: "예: I feel a sharp pain in my chest. (가슴에 찌르는 듯한 통증이 있습니다.)" },
  { cat: "증상 표현", en: "Shortness of breath / Dyspnea", ko: "호흡 곤란 / 숨가쁨", desc: "예: I have difficulty breathing when climbing stairs. (계단을 오를 때 숨이 찹니다.)" },
  { cat: "증상 표현", en: "Dizziness / Vertigo", ko: "어지럼증 / 현기증", desc: "예: The room is spinning around me. (주변이 핑핑 도는 것처럼 어지럽습니다.)" },
  { cat: "증상 표현", en: "Numbness / Tingling sensation", ko: "저림 / 감각 마비", desc: "예: My left hand feels numb and tingling. (왼손이 저리고 감각이 둔합니다.)" },
  { cat: "증상 표현", en: "Heart palpitations", ko: "가슴 두근거림 / 심계항진", desc: "예: My heart is beating very fast and irregularly. (심장이 빠르고 불규칙하게 뜁니다.)" },
  { cat: "증상 표현", en: "Fatigue / General weakness", ko: "만성 피로 / 전신 쇠약감", desc: "예: I feel exhausted all the time with no energy. (기운이 없고 항상 피곤합니다.)" },
  { cat: "증상 표현", en: "Swelling / Edema", ko: "부종 / 붓기", desc: "예: My ankles and feet are swollen. (발목과 발이 많이 붓습니다.)" },
  { cat: "증상 표현", en: "Indigestion / Heartburn", ko: "소화불량 / 속쓰림", desc: "예: I have a burning sensation in my stomach. (속이 쓰리고 소화가 안 됩니다.)" },
  { cat: "검사 및 약물", en: "Fasting Blood Glucose / HbA1c", ko: "공복 혈당 / 당화혈색소", desc: "당뇨 진단 및 지난 2~3개월간의 평균 혈당 조절 지표" },
  { cat: "검사 및 약물", en: "Lipid Panel (Cholesterol / Triglycerides)", ko: "지질 검사 (콜레스테롤 / 중성지방)", desc: "총콜레스테롤, HDL(좋은), LDL(나쁜), 중성지방 수치 측정" },
  { cat: "검사 및 약물", en: "Blood Pressure (Systolic / Diastolic)", ko: "혈압 (수축기 / 이완기)", desc: "정상 혈압 기준: 120/80 mmHg 미만" },
  { cat: "검사 및 약물", en: "Colonoscopy / Endoscopy", ko: "대장내시경 / 위내시경", desc: "소화기계 용종, 암, 궤양 조기 진단 및 검사" },
  { cat: "검사 및 약물", en: "Generic Drug vs Brand Drug", ko: "제네릭(복제약) vs 오리지널 브랜드약", desc: "동일 성분과 효능이나 제네릭이 코페이와 약값이 훨씬 저렴" },
  { cat: "검사 및 약물", en: "Prescription Refill", ko: "처방전 리필(재조제)", desc: "남은 리필 횟수 확인 후 약국 또는 병원에 추가 조제 요청" },
  { cat: "진료실 회화", en: "I need a Korean interpreter, please.", ko: "한국어 의료 통역사를 요청합니다.", desc: "미국 병원/진료소에서 연방법에 따라 무료 통역 서비스 요청" },
  { cat: "진료실 회화", en: "Is this clinic in-network with my insurance?", ko: "제 보험 네트워크에 포함된 병원인가요?", desc: "예상치 못한 의료비(Out-of-network) 청구를 방지하기 위한 사전 확인" },
  { cat: "진료실 회화", en: "What is my Copay and Deductible?", ko: "제 코페이와 디덕터블(본인부담금)은 얼마인가요?", desc: "진료 당일 현장 지불액 및 연간 기본 부담금 확인" },
  { cat: "진료실 회화", en: "Do I need a referral to see a specialist?", ko: "전문의 진료를 위해 주치의 의뢰서(Referral)가 필요한가요?", desc: "HMO 플랜의 경우 주치의 사전 의뢰서가 필수적임" },
  { cat: "진료실 회화", en: "Can I apply for Financial Assistance / Charity Care?", ko: "병원비 재정 지원(Charity Care)을 신청할 수 있나요?", desc: "저소득 또는 무보험자의 경우 병원비 감면 프로그램 신청" }
];

function getHeader(title) {
  return `<!DOCTYPE html><html lang="ko" class="h-full antialiased"><head>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
<meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<link rel="stylesheet" href="/_next/static/chunks/1fosv8xgmgdeu.css" />
<title>${title} | Healthcare Access Portal</title>
<meta name="description" content="뉴저지 한인 커뮤니티를 위한 의료 접근 및 건강 정보 포털. 메디케어, ACA, 의료 상담을 한국어로 제공합니다."/>
<link rel="icon" href="/favicon.ico" sizes="256x256" type="image/x-icon"/>
<style>
  :root, html, body { font-family: "Pretendard Variable", Pretendard, "Noto Sans KR", sans-serif !important; }
  .hub-tab-btn { padding: 10px 18px; border-radius: 9999px; font-weight: 700; font-size: 13px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; }
  .hub-tab-active { background: #2563eb !important; color: #ffffff !important; border: 1.5px solid #93c5fd !important; box-shadow: 0 4px 14px rgba(37,99,235,0.4); }
  .hub-tab-inactive { background: rgba(255,255,255,0.12) !important; color: #ffffff !important; border: 1px solid rgba(255,255,255,0.25) !important; }
  .hub-tab-inactive:hover { background: rgba(255,255,255,0.25) !important; color: #ffffff !important; }
  .tool-card { background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.05); }
</style>
</head>
<body class="min-h-full flex flex-col bg-slate-50">
<div class="fixed top-0 left-0 right-0 z-50 h-[45px] overflow-hidden flex items-center" style="background:#000000">
  <div class="marquee-track whitespace-nowrap">
    <span class="inline-block font-sans text-xs text-white/90 tracking-wide px-12">✦ 의료접근포탈: &quot;비영리 기관들의 의료관련 정보서비스의 한계를 넘어, 최고의 의료 전문가들이 제공하는 무료 프리미엄 의료 접근·네비게이션 서비스&quot; ✦</span>
  </div>
</div>
<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-sm border-b border-slate-200" style="top:45px">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <a class="flex-shrink-0 group flex items-center gap-2.5" href="/">
        <div class="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <img src="/logo-icon.svg" alt="NJAP Logo" class="w-full h-full object-contain"/>
        </div>
        <div>
          <span class="font-serif text-xl text-brand-dark group-hover:text-brand-blue transition-colors duration-200 block">Healthcare Access Portal</span>
          <span class="block text-[10px] font-sans text-brand-muted leading-tight -mt-0.5">뉴저지 한인 의료 접근 포털</span>
        </div>
      </a>
      <div class="hidden md:flex items-center" style="display: flex; align-items: center; gap: 26px;">
        <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/">홈</a>
        <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/blog">뉴스</a>
        <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/senior-care">시니어 케어</a>
        <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/medicare">메디케어 &amp; ACA</a>
        <a class="nav-link pb-0.5 font-bold text-brand-blue" href="/tool">환자도우미</a>
        <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/about">소개</a>
      </div>
      <div class="flex items-center gap-3">
        <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer" title="카카오톡 1:1 상담 바로가기"><img src="/kakaotalk-icon.png" alt="KakaoTalk" class="w-6 h-6 rounded-md shrink-0 object-contain shadow-xs" /><span class="text-xs sm:text-sm font-bold text-slate-800 hover:text-brand-blue tracking-tight whitespace-nowrap">1:1 상담</span></a>
        <button id="mobile-menu-btn" class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Menu">
          <div class="w-5 h-4 flex flex-col justify-between">
            <span class="block h-0.5 bg-brand-dark rounded-full"></span>
            <span class="block h-0.5 bg-brand-dark rounded-full"></span>
            <span class="block h-0.5 bg-brand-dark rounded-full"></span>
          </div>
        </button>
      </div>
    </div>
  </div>
  <div id="mobile-menu-dropdown" class="md:hidden overflow-hidden transition-all duration-300 max-h-0 opacity-0 bg-white/98 backdrop-blur-md border-t border-brand-border px-4 py-3 flex flex-col gap-1" style="-webkit-overflow-scrolling: touch;">
    <!-- 홈 (Direct) -->
    <a href="/" class="flex items-center justify-between py-2.5 px-3 text-[15px] font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors border-b border-slate-100">
      <div class="flex items-center gap-2.5">
        <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        <span>홈 (Home)</span>
      </div>
      <span class="text-xs font-normal text-slate-400">메인</span>
    </a>

    <!-- 아코디언 1: 시니어 케어 -->
    <div class="mobile-accordion-group border-b border-slate-100">
      <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold text-slate-800 hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-senior">
        <div class="flex items-center gap-2.5">
          <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          <span>시니어 케어</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue font-semibold">재활·요양</span>
        </div>
        <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div id="m-acc-senior" class="mobile-accordion-panel hidden bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">
        <a href="/senior-care" class="flex items-center gap-2 py-2 px-3 text-sm font-bold text-brand-blue hover:bg-white rounded-lg transition-colors">
          <span class="text-xs">▶</span> 시니어 케어 센터 소개
        </a>
        <a href="/senior-care#rehab" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
          <span class="text-slate-400 text-xs">•</span> 단기 집중 재활 &amp; 물리치료
        </a>
        <a href="/senior-care#ltc" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
          <span class="text-slate-400 text-xs">•</span> 24시간 장기 요양 간호 (LTC)
        </a>
        <a href="/senior-care#clinical" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
          <span class="text-slate-400 text-xs">•</span> 전문 임상 케어 프로그램
        </a>
        <a href="/senior-care#inquiry" class="flex items-center gap-2 py-2 px-3 text-sm font-medium text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/70 rounded-lg transition-colors mt-0.5">
          <span>💬</span> 1:1 입소 상담 및 투어 문의
        </a>
      </div>
    </div>

    <!-- 아코디언 2: 뉴스 & 의학 칼럼 -->
    <div class="mobile-accordion-group border-b border-slate-100">
      <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold text-slate-800 hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-news">
        <div class="flex items-center gap-2.5">
          <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
          <span>뉴스 &amp; 의학 칼럼</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold">최신 소식</span>
        </div>
        <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div id="m-acc-news" class="mobile-accordion-panel hidden bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">
        <a href="/blog" class="flex items-center gap-2 py-2 px-3 text-sm font-bold text-brand-blue hover:bg-white rounded-lg transition-colors">
          <span class="text-xs">▶</span> 건강 뉴스 전체보기
        </a>
        <a href="/blog#columns" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
          <span class="text-slate-400 text-xs">•</span> 전문의 건강 칼럼
        </a>
        <a href="/blog#recalls" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
          <span class="text-slate-400 text-xs">•</span> FDA 안전 경보 &amp; 리콜
        </a>
      </div>
    </div>

    <!-- 아코디언 3: 메디케어 & ACA -->
    <div class="mobile-accordion-group border-b border-slate-100">
      <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold text-slate-800 hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-medicare">
        <div class="flex items-center gap-2.5">
          <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          <span>메디케어 &amp; ACA</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold">보험 가이드</span>
        </div>
        <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div id="m-acc-medicare" class="mobile-accordion-panel hidden bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">
        <a href="/medicare" class="flex items-center gap-2 py-2 px-3 text-sm font-bold text-brand-blue hover:bg-white rounded-lg transition-colors">
          <span class="text-xs">▶</span> 메디케어 &amp; ACA 홈
        </a>
        <a href="/medicare#medicare-types" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
          <span class="text-slate-400 text-xs">•</span> 메디케어 파트 A·B·C·D 완벽 정리
        </a>
        <a href="/medicare#aca-types" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
          <span class="text-slate-400 text-xs">•</span> ACA 오바마케어 안내
        </a>
        <a href="/medicare#faq" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
          <span class="text-slate-400 text-xs">•</span> 자주 묻는 질문 (FAQ)
        </a>
      </div>
    </div>

    <!-- 아코디언 4: 환자도우미 스마트 도구 -->
    <div class="mobile-accordion-group border-b border-slate-100">
      <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-tool">
        <div class="flex items-center gap-2.5">
          <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span>환자도우미</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold">스마트 도구</span>
        </div>
        <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron rotate-180" style="transform: rotate(180deg);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div id="m-acc-tool" class="mobile-accordion-panel bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">
        <a href="/tool" class="flex items-center gap-2 py-2 px-3 text-sm font-bold text-brand-blue hover:bg-white rounded-lg transition-colors">
          <span class="text-xs">▶</span> 환자도우미 허브 홈
        </a>
        <a href="/matcher" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
          <span class="text-slate-400 text-xs">•</span> 스마트 보험 자격 진단기
        </a>
        <a href="/calculator" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
          <span class="text-slate-400 text-xs">•</span> 건강보험료 보조금 계산기
        </a>
        <a href="/dictionary" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
          <span class="text-slate-400 text-xs">•</span> 영-한 의학 용어 사전
        </a>
      </div>
    </div>

    <!-- 아코디언 5: 센터 소개 -->
    <div class="mobile-accordion-group border-b border-slate-100">
      <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold text-slate-800 hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-about">
        <div class="flex items-center gap-2.5">
          <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>센터 소개</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">About</span>
        </div>
        <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div id="m-acc-about" class="mobile-accordion-panel hidden bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">
        <a href="/about" class="flex items-center gap-2 py-2 px-3 text-sm font-bold text-brand-blue hover:bg-white rounded-lg transition-colors">
          <span class="text-xs">▶</span> 센터 소개 및 미션
        </a>
        <a href="/about#contact" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">
          <span class="text-slate-400 text-xs">•</span> 찾아오시는 길 &amp; 상담 문의
        </a>
      </div>
    </div>

    <!-- 하단 CTA: 카카오톡 1:1 상담 및 전화 연결 -->
    <div class="pt-3 pb-3 flex flex-col gap-2">
      <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3.5 bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#FBC02D] text-[#191919] rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer">
        <div class="flex items-center gap-2.5">
          <img src="/kakaotalk-icon.png" alt="KakaoTalk" class="w-6 h-6 rounded-md shrink-0 object-contain shadow-xs" />
          <div class="flex flex-col text-left">
            <span class="text-sm font-bold leading-tight">카카오톡 1:1 상담 바로가기</span>
            <span class="text-[11px] font-medium text-black/70">의료 복지 및 시니어 케어 실시간 문의</span>
          </div>
        </div>
        <svg class="w-4 h-4 text-black/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>
      <a href="tel:2018868686" class="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-600 hover:text-brand-blue transition-colors">
        <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
        <span>문의 전화: (201) 886-8686</span>
      </a>
    </div>
  </div>
</nav>
<div class="h-[109px]"></div>
`;
}

function getSubNav(activeKey) {
  return `
  <!-- Top Header & Tabs with Solid Guaranteed Gradient Background -->
  <section class="py-10 sm:py-14 border-b border-white/10" style="background: linear-gradient(135deg, #091e42 0%, #1e1b4b 60%, #1e293b 100%) !important; color: #ffffff !important;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <span class="inline-block text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2" style="background: rgba(59, 130, 246, 0.3) !important; color: #93c5fd !important; border: 1px solid rgba(147, 197, 253, 0.4) !important;">ONE-STOP PATIENT SERVICES</span>
      <h1 class="font-serif text-3xl sm:text-4xl mb-2 font-bold" style="color: #ffffff !important;">원스톱 의료 접근 &amp; 환자 종합 센터</h1>
      <p class="text-xs sm:text-sm max-w-2xl leading-relaxed mb-6 font-sans" style="color: rgba(255, 255, 255, 0.85) !important;">보험 자격 진단, 2026 ACA 보조금 계산, 영-한 의학 용어 사전, AI 질문 센터를 자유롭게 이용하세요.</p>

      <!-- 4 Tool Nav Tabs -->
      <div class="flex flex-wrap gap-2.5 pt-1">
        <a href="/matcher" class="hub-tab-btn ${activeKey === 'matcher' ? 'hub-tab-active' : 'hub-tab-inactive'}">
          <span>🏥</span> 1. 메디케어 &amp; ACA 자격 진단
        </a>
        <a href="/calculator" class="hub-tab-btn ${activeKey === 'calculator' ? 'hub-tab-active' : 'hub-tab-inactive'}">
          <span>🧮</span> 2. ACA 보험료 보조금 계산기
        </a>
        <a href="/dictionary" class="hub-tab-btn ${activeKey === 'dictionary' ? 'hub-tab-active' : 'hub-tab-inactive'}">
          <span>📖</span> 3. 영-한 의학 용어 사전
        </a>
        <a href="/tool" class="hub-tab-btn ${activeKey === 'portal' ? 'hub-tab-active' : 'hub-tab-inactive'}">
          <span>🤖</span> 4. AI 환자 도우미 &amp; 사전접수
        </a>
      </div>
    </div>
  </section>
  `;
}

function getFooter() {
  return `
<footer class="bg-brand-darker text-white mt-auto">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
    <div class="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
      <div>© 2026 Healthcare Access Portal. 뉴저지 한인 커뮤니티를 위한 무료 의료 정보 서비스입니다.</div>
      <div class="flex gap-4">
        <a href="/medicare" class="hover:text-white">메디케어 안내</a>
        <a href="/calculator" class="hover:text-white">보조금 계산기</a>
        <a href="/dictionary" class="hover:text-white">의학 용어 사전</a>
        <a href="/about" class="hover:text-white">소개</a>
      </div>
    </div>
  </div>
</footer>
<script src="/js/cms-client.js?v=3.6.0"></script>
<script src="/js/fixes.js?v=1.2"></script>
</body></html>
`;
}

// 1. DICTIONARY.HTML
const dictHtml = `
${getHeader("영-한 의학 용어 & 병원 실전 회화 사전")}
<main class="flex-1 pb-16 bg-slate-50">
  ${getSubNav("dictionary")}
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
    <div class="tool-card p-6 sm:p-10">
      <div class="text-center mb-8">
        <span class="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">TOOL 3 · MEDICAL DICTIONARY</span>
        <h2 class="font-serif text-2xl sm:text-3xl text-slate-900 mb-2">영-한 의학 용어 &amp; 병원 실전 회화 사전</h2>
        <p class="text-xs sm:text-sm text-slate-600">미국 병원, 클리닉, 응급실, 약국에서 자주 사용하는 필수 영문 의학 표현과 진료실 회화를 검색하세요.</p>
      </div>

      <div class="mb-6 space-y-3">
        <input type="text" id="dict-search-input" placeholder="🔍 영어 단어, 한글 증상, 진료과목 검색 (예: Cardiology, 흉통, 혈압, 통역)..." class="w-full p-4 rounded-2xl border border-slate-300 text-sm outline-none focus:border-blue-600 shadow-xs" style="background:#ffffff; color:#0f172a;"/>
        <div class="flex flex-wrap gap-2" id="dict-cat-filters">
          <button class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white dict-cat-btn" data-cat="전체">전체</button>
          <button class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 dict-cat-btn" data-cat="진료과목">진료과목</button>
          <button class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 dict-cat-btn" data-cat="증상 표현">증상 표현</button>
          <button class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 dict-cat-btn" data-cat="검사 및 약물">검사 및 약물</button>
          <button class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 dict-cat-btn" data-cat="진료실 회화">진료실 회화</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="dict-results-container"></div>
    </div>
  </div>
</main>
<script>
  var DICT_ITEMS = ${JSON.stringify(dictionaryData)};
  var currentCat = "전체";
  var searchQ = "";

  function renderDict() {
    var container = document.getElementById('dict-results-container');
    var filtered = DICT_ITEMS.filter(function(item) {
      var matchCat = currentCat === "전체" || item.cat === currentCat;
      var q = searchQ.trim().toLowerCase();
      var matchQ = !q || item.en.toLowerCase().indexOf(q) !== -1 || item.ko.toLowerCase().indexOf(q) !== -1 || item.desc.toLowerCase().indexOf(q) !== -1;
      return matchCat && matchQ;
    });

    if (filtered.length === 0) {
      container.innerHTML = '<div class="col-span-2 text-center py-10 text-slate-400 text-sm">검색 결과가 없습니다. 다른 검색어를 입력해 보세요.</div>';
      return;
    }

    var html = '';
    filtered.forEach(function(item, idx) {
      html += '<div class="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white transition-all shadow-xs flex flex-col justify-between">';
      html += '  <div>';
      html += '    <div class="flex justify-between items-center mb-1.5">';
      html += '      <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">' + item.cat + '</span>';
      html += '      <button onclick="copyDictText(\\'' + item.en.replace(/'/g, "\\\\'") + ' (' + item.ko.replace(/'/g, "\\\\'") + ')\\', this)" class="text-[11px] text-blue-600 hover:underline font-medium cursor-pointer">복사</button>';
      html += '    </div>';
      html += '    <h3 class="font-bold text-base text-slate-900">' + item.en + '</h3>';
      html += '    <p class="text-xs font-semibold text-blue-700 mb-2">' + item.ko + '</p>';
      html += '    <p class="text-xs text-slate-600 leading-relaxed">' + item.desc + '</p>';
      html += '  </div>';
      html += '</div>';
    });
    container.innerHTML = html;
  }

  function copyDictText(txt, btn) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(txt);
      var old = btn.textContent;
      btn.textContent = '✓ 복사됨';
      setTimeout(function() { btn.textContent = old; }, 1500);
    }
  }

  document.getElementById('dict-search-input').addEventListener('input', function(e) {
    searchQ = e.target.value;
    renderDict();
  });

  document.querySelectorAll('.dict-cat-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.dict-cat-btn').forEach(function(b) {
        b.className = 'px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 dict-cat-btn';
      });
      btn.className = 'px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white dict-cat-btn';
      currentCat = btn.getAttribute('data-cat');
      renderDict();
    });
  });

  renderDict();
</script>
${getFooter()}
`;

fs.writeFileSync(path.join(__dirname, '../dictionary.html'), dictHtml, 'utf8');

// 2. CALCULATOR.HTML
const calcHtml = `
${getHeader("2026 ACA 건강보험료 보조금 계산기")}
<main class="flex-1 pb-16 bg-slate-50">
  ${getSubNav("calculator")}
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
    <div class="tool-card p-6 sm:p-10">
      <div class="text-center mb-8">
        <span class="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">TOOL 2 · 2026 ACA &amp; NJHPS CALCULATOR</span>
        <h2 class="font-serif text-2xl sm:text-3xl text-slate-900 mb-2">2026 ACA 건강보험료 보조금 계산기</h2>
        <p class="text-xs sm:text-sm text-slate-600">가족 수와 연간 총소득을 입력하시면 2026년 기준 연방 세액 공제(APTC) 및 뉴저지 주정부 지원금(NJHPS)을 실시간 산출합니다.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div class="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs font-bold text-slate-700">1. 가구원 수 (Tax Household)</label>
              <span class="text-sm font-bold text-blue-600" id="calc-size-label">1인 가구</span>
            </div>
            <div class="grid grid-cols-5 gap-1.5">
              <button onclick="setSize(1)" class="calc-size-btn py-2 text-xs font-bold rounded-lg bg-blue-600 text-white shadow-sm" data-size="1">1인</button>
              <button onclick="setSize(2)" class="calc-size-btn py-2 text-xs font-bold rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100" data-size="2">2인</button>
              <button onclick="setSize(3)" class="calc-size-btn py-2 text-xs font-bold rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100" data-size="3">3인</button>
              <button onclick="setSize(4)" class="calc-size-btn py-2 text-xs font-bold rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100" data-size="4">4인</button>
              <button onclick="setSize(5)" class="calc-size-btn py-2 text-xs font-bold rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100" data-size="5">5인+</button>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs font-bold text-slate-700">2. 가구 연간 총소득 (MAGI)</label>
              <span class="text-base font-bold text-blue-700" id="calc-income-label">$30,000 / 년</span>
            </div>
            <input type="number" step="1000" id="calc-income-input" value="30000" class="w-full p-3 bg-white rounded-xl border border-slate-300 font-bold text-slate-900 mb-2 outline-none focus:border-blue-500" />
            <div class="flex flex-wrap gap-1.5">
              <button onclick="setIncome(20000)" class="px-2.5 py-1 text-[11px] font-medium bg-white rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100">$20k</button>
              <button onclick="setIncome(35000)" class="px-2.5 py-1 text-[11px] font-medium bg-white rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100">$35k</button>
              <button onclick="setIncome(50000)" class="px-2.5 py-1 text-[11px] font-medium bg-white rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100">$50k</button>
              <button onclick="setIncome(75000)" class="px-2.5 py-1 text-[11px] font-medium bg-white rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100">$75k</button>
              <button onclick="setIncome(100000)" class="px-2.5 py-1 text-[11px] font-medium bg-white rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100">$100k</button>
            </div>
          </div>

          <div class="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600">
            <div class="flex justify-between"><span>2026 연방 빈곤선 100%:</span><strong id="fpl-100-val">$15,650</strong></div>
            <div class="flex justify-between"><span>메디케이드 기준 (138%):</span><strong id="fpl-138-val" class="text-emerald-700">$21,597</strong></div>
            <div class="flex justify-between"><span>실버 CSR 감면 기준 (250%):</span><strong id="fpl-250-val" class="text-blue-700">$39,125</strong></div>
          </div>
        </div>

        <div class="lg:col-span-7 space-y-5">
          <div id="calc-gauge-box" class="p-5 rounded-2xl border bg-blue-50/70 border-blue-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-700">연방 빈곤선(FPL) 소득 비율</span>
              <span class="text-lg font-extrabold text-blue-700" id="calc-fpl-ratio">192% FPL</span>
            </div>
            <div class="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-3">
              <div id="calc-fpl-bar" class="h-full bg-blue-600 transition-all duration-300" style="width: 48%;"></div>
            </div>
            <div class="text-xs font-bold" id="calc-status-desc">
              ✓ GetCoveredNJ 실버 CSR 감면 + 연방 APTC + 주정부 3중 보조금 대상입니다.
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="p-4 bg-slate-900 text-white rounded-xl">
              <div class="text-[11px] text-slate-400 mb-1">월 예상 정부 보조금 (합산)</div>
              <div class="text-2xl font-extrabold text-blue-300" id="calc-subsidy-val">$495<span class="text-xs font-normal text-white/70"> / 월</span></div>
              <div class="text-[10px] text-white/50 mt-1" id="calc-subsidy-yr">연간 약 $5,940 절감</div>
            </div>
            <div class="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div class="text-[11px] text-blue-800 font-semibold mb-1">추천 플랜 (Silver 실버)</div>
              <div class="text-2xl font-extrabold text-blue-900" id="calc-silver-val">$25<span class="text-xs font-normal text-slate-600"> / 월</span></div>
              <div class="text-[10px] text-blue-700 mt-1" id="calc-csr-badge">★ 디덕터블 $0~$500 파격 감면</div>
            </div>
          </div>

          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <strong class="block text-slate-800 text-sm mb-1">플랜 등급별 예상 실부담 월 보험료:</strong>
            <div class="flex justify-between p-2 bg-white rounded border border-slate-200">
              <span>🥉 Bronze (기본형)</span><strong id="calc-bronze-tier">$0 / 월</strong>
            </div>
            <div class="flex justify-between p-2 bg-blue-50 rounded border border-blue-200 text-blue-900 font-bold">
              <span>🥈 Silver (추천 / CSR 감면)</span><strong id="calc-silver-tier">$25 / 월</strong>
            </div>
            <div class="flex justify-between p-2 bg-white rounded border border-slate-200">
              <span>🥇 Gold (종합형)</span><strong id="calc-gold-tier">$155 / 월</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
<script>
  var currentSize = 1;
  var currentIncome = 30000;

  function setSize(s) {
    currentSize = s;
    document.querySelectorAll('.calc-size-btn').forEach(function(b) {
      b.className = 'calc-size-btn py-2 text-xs font-bold rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100';
    });
    var target = document.querySelector('.calc-size-btn[data-size="' + s + '"]');
    if (target) target.className = 'calc-size-btn py-2 text-xs font-bold rounded-lg bg-blue-600 text-white shadow-sm';
    document.getElementById('calc-size-label').textContent = s + '인 가구';
    calculate();
  }

  function setIncome(inc) {
    currentIncome = inc;
    document.getElementById('calc-income-input').value = inc;
    calculate();
  }

  document.getElementById('calc-income-input').addEventListener('input', function(e) {
    currentIncome = Math.max(0, parseInt(e.target.value, 10) || 0);
    calculate();
  });

  function calculate() {
    var fplBase = 15650 + (currentSize - 1) * 5500;
    var fplRatio = Math.round((currentIncome / fplBase) * 100);

    document.getElementById('calc-income-label').textContent = '$' + currentIncome.toLocaleString() + ' / 년';
    document.getElementById('fpl-100-val').textContent = '$' + fplBase.toLocaleString();
    document.getElementById('fpl-138-val').textContent = '$' + Math.round(fplBase * 1.38).toLocaleString();
    document.getElementById('fpl-250-val').textContent = '$' + Math.round(fplBase * 2.5).toLocaleString();
    document.getElementById('calc-fpl-ratio').textContent = fplRatio + '% FPL';
    document.getElementById('calc-fpl-bar').style.width = Math.min(100, Math.max(5, (fplRatio / 400) * 100)) + '%';

    var isMedicaid = fplRatio <= 138;
    var isSilverCsr = fplRatio > 138 && fplRatio <= 250;
    var isAptcOnly = fplRatio > 250 && fplRatio <= 400;

    var gaugeBox = document.getElementById('calc-gauge-box');
    var statusDesc = document.getElementById('calc-status-desc');

    if (isMedicaid) {
      gaugeBox.className = 'p-5 rounded-2xl border bg-emerald-50/70 border-emerald-200';
      statusDesc.className = 'text-xs font-bold text-emerald-800';
      statusDesc.textContent = '✓ NJ FamilyCare (메디케이드) 100% 무료 건강보험 신청 대상입니다.';
    } else if (isSilverCsr) {
      gaugeBox.className = 'p-5 rounded-2xl border bg-blue-50/70 border-blue-200';
      statusDesc.className = 'text-xs font-bold text-blue-800';
      statusDesc.textContent = '✓ GetCoveredNJ 실버 CSR 감면 + 연방 APTC + 주정부 3중 보조금 대상입니다.';
    } else if (isAptcOnly) {
      gaugeBox.className = 'p-5 rounded-2xl border bg-slate-50 border-slate-200';
      statusDesc.className = 'text-xs font-bold text-slate-800';
      statusDesc.textContent = '✓ GetCoveredNJ 연방 APTC 세액 공제 + 주정부 보조금 지원 대상입니다.';
    } else {
      gaugeBox.className = 'p-5 rounded-2xl border bg-slate-50 border-slate-200';
      statusDesc.className = 'text-xs font-bold text-slate-700';
      statusDesc.textContent = '✓ GetCoveredNJ 마켓플레이스 표준 플랜 가입 대상입니다.';
    }

    var benchmarkCost = 520 * currentSize;
    var expectedContrib = 0;
    if (fplRatio <= 150) expectedContrib = 0;
    else if (fplRatio <= 200) expectedContrib = (currentIncome * 0.02) / 12;
    else if (fplRatio <= 250) expectedContrib = (currentIncome * 0.04) / 12;
    else if (fplRatio <= 300) expectedContrib = (currentIncome * 0.06) / 12;
    else if (fplRatio <= 400) expectedContrib = (currentIncome * 0.085) / 12;
    else expectedContrib = benchmarkCost;

    var fedSub = Math.max(0, Math.round(benchmarkCost - expectedContrib));
    var njSub = isMedicaid ? 0 : (fplRatio <= 400 ? Math.round(75 * currentSize) : 0);
    var totSub = fedSub + njSub;

    var bronzeNet = Math.max(0, Math.round(380 * currentSize - totSub));
    var silverNet = Math.max(0, Math.round(520 * currentSize - totSub));
    var goldNet = Math.max(0, Math.round(650 * currentSize - totSub));

    document.getElementById('calc-subsidy-val').innerHTML = '$' + totSub.toLocaleString() + '<span class="text-xs font-normal text-white/70"> / 월</span>';
    document.getElementById('calc-subsidy-yr').textContent = '연간 약 $' + (totSub * 12).toLocaleString() + ' 절감';
    document.getElementById('calc-silver-val').innerHTML = '$' + (isMedicaid ? '0' : silverNet.toLocaleString()) + '<span class="text-xs font-normal text-slate-600"> / 월</span>';
    document.getElementById('calc-csr-badge').textContent = isSilverCsr ? '★ 디덕터블 $0~$500 파격 감면' : (isMedicaid ? '월 보험료 $0 전액 지원' : '표준 실버 보장');

    document.getElementById('calc-bronze-tier').textContent = '$' + (isMedicaid ? '0' : bronzeNet) + ' / 월';
    document.getElementById('calc-silver-tier').textContent = '$' + (isMedicaid ? '0' : silverNet) + ' / 월';
    document.getElementById('calc-gold-tier').textContent = '$' + (isMedicaid ? '0' : goldNet) + ' / 월';
  }

  calculate();
</script>
${getFooter()}
`;

fs.writeFileSync(path.join(__dirname, '../calculator.html'), calcHtml, 'utf8');

// 3. MATCHER.HTML
const matcherHtml = `
${getHeader("메디케어 & ACA 맞춤 자격 진단기")}
<main class="flex-1 pb-16 bg-slate-50">
  ${getSubNav("matcher")}
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
    <div class="tool-card p-6 sm:p-10">
      <div class="text-center mb-8">
        <span class="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">TOOL 1 · INSURANCE MATCHER</span>
        <h2 class="font-serif text-2xl sm:text-3xl text-slate-900 mb-2">메디케어 &amp; ACA 맞춤 자격 진단기</h2>
        <p class="text-xs sm:text-sm text-slate-600">만 나이, 체류 신분, 가구 소득에 따른 가장 유리한 건강보험 프로그램 및 주정부 지원 혜택을 산출합니다.</p>
      </div>

      <div id="matcher-quiz-box">
        <div class="flex items-center justify-between mb-6 text-xs text-slate-500 font-medium">
          <span id="matcher-step-label">진단 단계 1 / 3</span>
          <div class="w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
            <div id="matcher-step-bar" class="bg-blue-600 h-full transition-all duration-300" style="width: 33%;"></div>
          </div>
        </div>

        <div id="matcher-step-1">
          <label class="block text-sm font-semibold text-slate-800 mb-2">만 나이를 입력해주세요:</label>
          <input type="number" id="matcher-age" placeholder="예: 65" class="w-full p-3.5 rounded-xl border border-slate-300 mb-6 text-base outline-none focus:border-blue-500" />
          <button onclick="gotoMatcherStep(2)" class="btn-primary w-full justify-center py-3.5 text-sm">다음 단계 →</button>
        </div>

        <div id="matcher-step-2" style="display:none;">
          <label class="block text-sm font-semibold text-slate-800 mb-2">미국 체류 신분을 선택해주세요:</label>
          <div class="space-y-2.5 mb-6" id="matcher-status-btns">
            <button onclick="setMatcherStatus('시민권자', this)" class="w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm hover:bg-slate-50">시민권자</button>
            <button onclick="setMatcherStatus('영주권자 (5년 이상)', this)" class="w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm hover:bg-slate-50">영주권자 (5년 이상)</button>
            <button onclick="setMatcherStatus('합법 비자 (H-1B, E-2, L-1, F-1 OPT 등)', this)" class="w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm hover:bg-slate-50">합법 비자 (H-1B, E-2, L-1, F-1 OPT 등)</button>
            <button onclick="setMatcherStatus('서류미비 / 기타', this)" class="w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm hover:bg-slate-50">서류미비 / 기타</button>
          </div>
          <div class="flex gap-3">
            <button onclick="gotoMatcherStep(1)" class="btn-outline text-sm py-3 px-6">이전</button>
            <button onclick="gotoMatcherStep(3)" id="matcher-btn-step3" class="btn-primary flex-1 justify-center py-3 text-sm" disabled>다음 단계 →</button>
          </div>
        </div>

        <div id="matcher-step-3" style="display:none;">
          <label class="block text-sm font-semibold text-slate-800 mb-2">가구 총 연간 소득 수준을 선택해주세요:</label>
          <div class="space-y-2.5 mb-6">
            <button onclick="setMatcherIncome('very_low', this)" class="w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm hover:bg-slate-50">저소득층 (1인 연 $21,597 이하 / FPL 138% 이하 - 메디케이드)</button>
            <button onclick="setMatcherIncome('low', this)" class="w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm hover:bg-slate-50">중저소득층 (1인 연 $21,597 ~ $39,125 / FPL 250% 이하 - 실버 CSR)</button>
            <button onclick="setMatcherIncome('medium', this)" class="w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm hover:bg-slate-50">중간소득층 (1인 연 $39,125 ~ $70,000 / APTC 보조금 지원)</button>
            <button onclick="setMatcherIncome('high', this)" class="w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm hover:bg-slate-50">고소득층 (1인 연 $70,000 이상)</button>
          </div>
          <div class="flex gap-3">
            <button onclick="gotoMatcherStep(2)" class="btn-outline text-sm py-3 px-6">이전</button>
            <button onclick="calcMatcherResult()" id="matcher-btn-calc" class="btn-primary flex-1 justify-center py-3 text-sm" disabled>진단 결과 확인하기 ✨</button>
          </div>
        </div>

        <div id="matcher-result-box" style="display:none;" class="text-center py-4">
          <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-blue-100">💡</div>
          <h3 class="font-serif text-2xl text-slate-900 mb-3">맞춤 추천 결과</h3>
          <div id="matcher-result-text" class="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left mb-6 text-slate-800 leading-relaxed text-sm sm:text-base"></div>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button onclick="resetMatcher()" class="btn-outline text-sm py-3 px-6">다시 진단하기</button>
            <a href="/calculator" class="btn-primary text-sm py-3 px-6">보조금 계산기로 이동 →</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
<script>
  var mAge = 0;
  var mStatus = "";
  var mIncome = "";

  function gotoMatcherStep(step) {
    if (step === 2) {
      mAge = parseInt(document.getElementById('matcher-age').value, 10);
      if (!mAge) { alert('만 나이를 입력해주세요.'); return; }
    }
    document.getElementById('matcher-step-1').style.display = (step === 1 ? 'block' : 'none');
    document.getElementById('matcher-step-2').style.display = (step === 2 ? 'block' : 'none');
    document.getElementById('matcher-step-3').style.display = (step === 3 ? 'block' : 'none');
    document.getElementById('matcher-result-box').style.display = 'none';

    document.getElementById('matcher-step-label').textContent = '진단 단계 ' + step + ' / 3';
    document.getElementById('matcher-step-bar').style.width = ((step / 3) * 100) + '%';
  }

  function setMatcherStatus(status, btn) {
    mStatus = status;
    document.querySelectorAll('#matcher-status-btns button').forEach(function(b) {
      b.className = 'w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm hover:bg-slate-50';
    });
    btn.className = 'w-full text-left p-3.5 rounded-xl border border-blue-600 bg-blue-50 text-blue-700 font-semibold text-sm';
    document.getElementById('matcher-btn-step3').disabled = false;
  }

  function setMatcherIncome(inc, btn) {
    mIncome = inc;
    btn.parentNode.querySelectorAll('button').forEach(function(b) {
      b.className = 'w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm hover:bg-slate-50';
    });
    btn.className = 'w-full text-left p-3.5 rounded-xl border border-blue-600 bg-blue-50 text-blue-700 font-semibold text-sm';
    document.getElementById('matcher-btn-calc').disabled = false;
  }

  function calcMatcherResult() {
    var res = "";
    if (mAge >= 65) {
      if (mIncome === 'low' || mIncome === 'very_low') {
        res = "메디케어 + 메디케이드(NJ FamilyCare) 이중 자격(Dual Eligible / D-SNP) 또는 뉴저지 주정부 메디케어 저축 프로그램(MSP - Part B 보험료 전액 대납) 및 처방약 보조 프로그램(PAAD) 지원 대상일 가능성이 매우 높습니다.";
      } else if (mIncome === 'medium') {
        res = "오리지널 메디케어(Part A & B) + 서플리먼트(Medigap) + Part D 처방약 플랜, 또는 치과/안과/OTC 카드 혜택이 풍부한 메디케어 어드밴티지(Part C)를 비교 선택하시기 바랍니다. 소득에 따라 Senior Gold 처방약 할인 혜택도 가능합니다.";
      } else {
        res = "메디케어 기본 보장(Part A & B)과 함께 병원 선택의 자유도가 높은 오리지널 메디케어 + Medigap Plan G 조합이나, 프리미엄 메디케어 어드밴티지(Part C PPO) 플랜을 추천합니다. 고소득자의 경우 Part B/D IRMAA 추가 할증료가 적용될 수 있습니다.";
      }
    } else {
      if (mIncome === 'very_low') {
        if (mStatus === '시민권자' || mStatus === '영주권자 (5년 이상)') {
          res = "뉴저지 주 메디케이드 (NJ FamilyCare) 전액 무료 건강보험 신청 대상입니다. 월 보험료 $0 및 본인부담금 $0~$5 수준으로 연중 365일 언제든 신청하실 수 있습니다.";
        } else if (mStatus === '서류미비 / 기타') {
          res = "뉴저지 병원비 감면 프로그램(Charity Care)을 통해 급성기 병원 및 응급 진료비를 소득에 따라 50%~100% 주정부 지원으로 감면받으실 수 있습니다. 임산부 및 19세 미만 자녀는 'Cover All Kids'로 체류 신분과 무관하게 무료 메디케이드가 적용됩니다.";
        } else {
          res = "GetCoveredNJ 마켓플레이스를 통한 플랜 가입 또는 뉴저지 병원비 감면(Charity Care) 지원 대상입니다.";
        }
      } else if (mIncome === 'low') {
        res = "GetCoveredNJ 마켓플레이스를 통해 연방 세액 공제(APTC) + 뉴저지 주정부 추가 지원금(NJHPS) + 실버 플랜 비용 분담 감면(CSR) 3중 혜택을 받으실 수 있습니다. 실버 플랜 선택 시 디덕터블과 병원 코페이가 획기적으로 낮아집니다.";
      } else if (mIncome === 'medium') {
        res = "GetCoveredNJ 마켓플레이스를 통해 연방 세액 공제(APTC) 및 뉴저지 주정부 지원금(NJHPS)을 지원받아 월 보험료를 크게 절감하실 수 있습니다.";
      } else {
        res = "GetCoveredNJ 또는 민간 건강보험 플랜 가입 대상입니다. 뉴저지주 의무 가입 규정(Individual Mandate)에 따라 무보험 시 주 세금 보고 시 벌금이 부과되므로 적격 보험 유지가 필수적입니다.";
      }
    }

    document.getElementById('matcher-step-1').style.display = 'none';
    document.getElementById('matcher-step-2').style.display = 'none';
    document.getElementById('matcher-step-3').style.display = 'none';
    document.getElementById('matcher-result-text').textContent = res;
    document.getElementById('matcher-result-box').style.display = 'block';
  }

  function resetMatcher() {
    document.getElementById('matcher-age').value = '';
    mAge = 0; mStatus = ''; mIncome = '';
    gotoMatcherStep(1);
  }
</script>
${getFooter()}
`;

fs.writeFileSync(path.join(__dirname, '../matcher.html'), matcherHtml, 'utf8');

// 4. FULL-EXPANSIVE TOOL.HTML
const toolPageHtml = `
${getHeader("스마트 환자 서비스 & AI 의료 질문 센터")}
<main class="flex-1 flex flex-col bg-slate-950">
  <section class="py-3 px-4 sm:px-8 border-b border-white/10" style="background: linear-gradient(135deg, #091e42 0%, #1e1b4b 60%, #1e293b 100%) !important; color: #ffffff !important;">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
      <div class="flex items-center gap-2">
        <span class="inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase" style="background: rgba(59, 130, 246, 0.3) !important; color: #93c5fd !important; border: 1px solid rgba(147, 197, 253, 0.4) !important;">AI TOOL 4</span>
        <h1 class="font-serif text-base sm:text-lg font-bold" style="color: #ffffff !important;">스마트 환자 서비스 &amp; AI 의료 질문 센터</h1>
      </div>
      <div class="flex flex-wrap gap-1.5 sm:gap-2">
        <a href="/matcher" class="hub-tab-btn hub-tab-inactive" style="padding: 6px 12px; font-size: 12px;"><span>🏥</span> 1. 자격 진단</a>
        <a href="/calculator" class="hub-tab-btn hub-tab-inactive" style="padding: 6px 12px; font-size: 12px;"><span>🧮</span> 2. 보조금 계산기</a>
        <a href="/dictionary" class="hub-tab-btn hub-tab-inactive" style="padding: 6px 12px; font-size: 12px;"><span>📖</span> 3. 의학 용어 사전</a>
        <a href="/tool" class="hub-tab-btn hub-tab-active" style="padding: 6px 12px; font-size: 12px;"><span>🤖</span> 4. AI 질문 센터</a>
      </div>
    </div>
  </section>

  <div class="w-full flex-1 relative bg-slate-950" style="height: calc(100vh - 160px); min-height: 900px;">
    <div id="tool-loading-overlay" class="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-white z-10 font-sans transition-opacity duration-300">
      <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="font-serif text-lg font-medium" style="color:#ffffff;">스마트 환자 서비스 불러오는 중...</p>
      <p class="text-white/60 text-xs mt-1">hacgenini.ai.studio 의료 접근 포털을 준비하고 있습니다.</p>
    </div>
    <iframe id="tool-ai-frame" src="https://hacgenini.ai.studio" title="Healthcare Access Portal 질문센터" class="w-full h-full border-0 block" style="width: 100%; height: 100%; min-height: 900px;" onload="var o=document.getElementById('tool-loading-overlay');if(o){o.style.opacity='0';setTimeout(function(){o.style.display='none';},350);}" allow="camera *; microphone *; geolocation *; display-capture *; clipboard-write *"></iframe>
  </div>
</main>
<script src="/js/cms-client.js?v=3.6.0"></script>
<script src="/js/fixes.js?v=1.2"></script>
</body></html>
`;

fs.writeFileSync(path.join(__dirname, '../tool.html'), toolPageHtml, 'utf8');
if (fs.existsSync(path.join(__dirname, '../tool/index.html'))) {
  fs.writeFileSync(path.join(__dirname, '../tool/index.html'), toolPageHtml, 'utf8');
}
console.log('Successfully regenerated all 4 tool pages with guaranteed high-contrast dark gradient headers!');
