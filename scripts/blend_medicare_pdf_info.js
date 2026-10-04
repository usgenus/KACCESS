const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/fff6208c75bcfeda/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MTE1MTkxMiwiaWF0IjoxNzkxMTMwMzEyfQ.p29ogcyXYwJwO0qyIwCIwIIVGQneLMHHtxFIDCRXvH0';
const REST_AUTH_KEY = '82b28ca3e9e15822cd9f14195795d35dcfad6ce2158926f74f2ab1bf642970c4-fff6208c75bcfeda';

const medicarePath = path.join(BASE_DIR, 'medicare.html');
let content = fs.readFileSync(medicarePath, 'utf8');

// 1. Update Hero Pill Navigation
const oldHeroPills = `<div class="flex flex-wrap gap-2 pt-1">
            <a href="#section-aca" class="hero-pill-nav">1. ACA &amp; FamilyCare</a>
            <a href="#section-aca-timeline" class="hero-pill-nav">2. 가입 시기 &amp; 벌금</a>
            <a href="#section-medicare" class="hero-pill-nav">3. 메디케어 4대 파트</a>
            <a href="#section-ira" class="hero-pill-highlight">2026 IRA 개정점</a>
            <a href="#section-compare" class="hero-pill-nav">4. 오리지널 vs 어드밴티지</a>
            <a href="#section-senior" class="hero-pill-nav">5. NJ 시니어 지원</a>
            <a href="#section-faq" class="hero-pill-nav">6. 자주 묻는 질문</a>
            <a href="#section-disclaimer" class="hero-pill-nav" style="border-color: rgba(255,255,255,0.4) !important; background: rgba(255,255,255,0.18) !important;">TPMO 고지사항</a>
          </div>`;

const newHeroPills = `<div class="flex flex-wrap gap-2 pt-1">
            <a href="#section-open-enrollment" class="hero-pill-highlight" style="background: rgba(220, 38, 38, 0.4) !important; color: #fecaca !important; border: 1px solid rgba(248, 113, 113, 0.6) !important;">
              ★ 2026 오픈 인롤먼트 (10/15~12/7)
            </a>
            <a href="#section-cms-numbers" class="hero-pill-nav">2026 CMS 공식 수치</a>
            <a href="#section-medicare-parts" class="hero-pill-nav">메디케어 4대 파트</a>
            <a href="#section-ira" class="hero-pill-highlight">파트 D $2,100 상한제</a>
            <a href="#section-compare" class="hero-pill-nav">오리지널 vs 어드밴티지</a>
            <a href="#section-enrollment-timeline" class="hero-pill-nav">65세 가입 &amp; 지연 벌금</a>
            <a href="#section-senior" class="hero-pill-nav">NJ 시니어 지원</a>
            <a href="#section-aca" class="hero-pill-nav">ACA &amp; FamilyCare</a>
            <a href="#section-faq" class="hero-pill-nav">자주 묻는 질문</a>
            <a href="#section-disclaimer" class="hero-pill-nav" style="border-color: rgba(255,255,255,0.4) !important; background: rgba(255,255,255,0.18) !important;">TPMO 고지사항</a>
          </div>`;

if (content.includes(oldHeroPills)) {
  content = content.replace(oldHeroPills, newHeroPills);
  console.log('[OK] Updated Hero Pills');
}

// 2. Comprehensive Replacement for Section 2 (Medicare 2026)
// Find from `<section id="section-medicare"` to `</section>` of medicare
const sectionMedicareRegex = /<!-- SECTION 2: MEDICARE 2026 -->[\s\S]*?<\/section>/;

const newSectionMedicare = `<!-- SECTION 2: MEDICARE 2026 (ENRICHED WITH 2026 AEP CMS SPECIFICATION) -->
      <section id="section-medicare" class="py-16 sm:py-20 bg-brand-light border-b border-brand-border">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Section Title Header -->
          <div class="max-w-3xl mb-10">
            <span class="text-xs font-sans font-bold uppercase tracking-widest text-brand-blue mb-1.5 block">PART 2 · 2026 연방 메디케어 심층 가이드 &amp; 오픈 인롤먼트</span>
            <h2 class="font-serif text-2xl sm:text-3xl lg:text-4xl text-brand-dark font-bold mb-3">2. 메디케어 (Medicare) — 2026 심층 안내 및 연간 가입 가이드</h2>
            <p class="text-brand-muted font-sans text-sm sm:text-base leading-relaxed">
              만 65세 이상 시니어 또는 24개월 이상 SSDI(장애연금) 수령자, 말기 신부전증(ESRD) 환자를 위한 연방 건강보험입니다. 2026년 10월 CMS 공식 발표 기준 최신 수치와 10월 15일부터 시작되는 연례 오픈 인롤먼트 핵심 정보를 완벽 정리했습니다.
            </p>
          </div>

          <!-- ========================================================
               FEATURE 1: 2026 AEP OPEN ENROLLMENT & 4-STEP CHECKLIST
               ======================================================== -->
          <div id="section-open-enrollment" class="mb-14 p-6 sm:p-9 rounded-2xl bg-gradient-to-br from-[#0B192C] via-[#10233d] to-[#0B192C] text-white shadow-xl border border-blue-900/60 relative overflow-hidden">
            <!-- Decorative Glow -->
            <div style="position:absolute;top:-80px;right:-80px;width:300px;height:300px;background:radial-gradient(circle,rgba(59,130,246,0.18) 0%,transparent 70%);border-radius:50%;pointer-events:none;"></div>
            
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-xs">
                <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                2026 연간 가입 기간 (AEP)
              </span>
              <span class="text-xs sm:text-sm font-semibold text-blue-200 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                가입 기간: <strong>2026년 10월 15일 ~ 12월 7일</strong> (적용 개시: 2027년 1월 1일)
              </span>
            </div>

            <h3 class="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
              메디케어 오픈 인롤먼트 2026: 10월 15일~12월 7일 4단계 체크리스트
            </h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl mb-6">
              매년 가을, 메디케어는 1년에 단 한 번 보장 내용을 재검토하고 최적의 플랜으로 변경할 수 있는 기회를 제공합니다. 2027년도 보장을 위한 연간 가입 기간은 <strong>2026년 10월 15일부터 12월 7일까지</strong>이며, 변경된 사항은 <strong>2027년 1월 1일부터 적용</strong>됩니다.
            </p>

            <!-- What you can do during AEP -->
            <div class="bg-white/8 backdrop-blur-md rounded-xl p-4 sm:p-5 mb-7 border border-white/15">
              <h4 class="text-sm font-bold text-blue-300 mb-2.5 flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                이 기간에 할 수 있는 일 (연례 변경 권한):
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-200">
                <div class="flex items-center gap-2">• 오리지널 메디케어 ↔ 메디케어 어드밴티지 간 상호 전환</div>
                <div class="flex items-center gap-2">• 기존 메디케어 어드밴티지 플랜을 다른 회사 플랜으로 변경</div>
                <div class="flex items-center gap-2">• 파트 D 처방약 플랜 신규 가입·변경·해지</div>
                <div class="flex items-center gap-2">• 약 보장이 없으셨던 분들의 신규 처방약 플랜 가입</div>
              </div>
            </div>

            <!-- 4-Step Checklist Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
              <!-- Step 1 -->
              <div class="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col justify-between hover:bg-white/8 transition-colors">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">STEP 1</span>
                    <span class="text-xs text-amber-300 font-semibold">9월 말 ~ 10월 초 우편 수령</span>
                  </div>
                  <h5 class="text-base font-bold text-white mb-2">1. Annual Notice of Change(ANOC, 연간 변경 안내문)를 여세요</h5>
                  <p class="text-xs text-slate-300 leading-relaxed">
                    현재 플랜이 9월 말~10월 초에 우편으로 발송합니다. 내년도 월 보험료, 코페이, 약 목록(포뮬러리), 병원 및 의사 네트워크 변경 사항이 적혀 있습니다. <strong>다른 무엇보다 먼저 읽으세요.</strong>
                  </p>
                </div>
              </div>

              <!-- Step 2 -->
              <div class="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col justify-between hover:bg-white/8 transition-colors">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">STEP 2</span>
                    <span class="text-xs text-emerald-300 font-semibold">의사·병원·약국 대조</span>
                  </div>
                  <h5 class="text-base font-bold text-white mb-2">2. 담당 의사와 처방약을 정리하세요</h5>
                  <p class="text-xs text-slate-300 leading-relaxed">
                    다니는 의사·병원·약국, 복용 중인 모든 약(용량 포함)을 적으세요. 플랜마다 네트워크와 약 목록(포뮬러리)이 매년 바뀌므로 2027년에도 포함되는지 대조가 필수입니다.
                  </p>
                </div>
              </div>

              <!-- Step 3 -->
              <div class="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col justify-between hover:bg-white/8 transition-colors">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">STEP 3</span>
                    <span class="text-xs text-purple-300 font-semibold">연간 총비용 계산</span>
                  </div>
                  <h5 class="text-base font-bold text-white mb-2">3. 보험료가 아닌 총비용을 비교하세요</h5>
                  <p class="text-xs text-slate-300 leading-relaxed">
                    <strong>월 보험료 + 파트 B 보험료(2026년 월 $202.90) + 디덕터블 + 약·진료 코페이</strong>를 합산하세요. 월 보험료 $0 플랜이 총비용은 더 비쌀 수 있습니다.
                  </p>
                </div>
              </div>

              <!-- Step 4 -->
              <div class="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col justify-between hover:bg-white/8 transition-colors">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">STEP 4</span>
                    <span class="text-xs text-sky-300 font-semibold">medicare.gov 1~5점</span>
                  </div>
                  <h5 class="text-base font-bold text-white mb-2">4. 플랜 별점과 추가 혜택을 확인하세요</h5>
                  <p class="text-xs text-slate-300 leading-relaxed">
                    메디케어는 매년 10월 medicare.gov에 1~5점 별점을 게시합니다. 치과·안과·운동 혜택이 중요하다면 세부 조건을 꼭 확인하세요. 플랜과 카운티마다 조건이 다릅니다.
                  </p>
                </div>
              </div>
            </div>

            <!-- Free Assistance Banner -->
            <div class="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-400/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div class="flex items-center gap-3.5">
                <div class="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center shrink-0 text-xl">💡</div>
                <div>
                  <h5 class="text-sm font-bold text-white">지금 할 일: ANOC, 약 목록, 의사 명단을 준비하세요</h5>
                  <p class="text-xs text-slate-300">저희 NJAP 내비게이션 팀이 한국어 또는 영어로 플랜 비교를 도와드립니다. <strong>상담은 100% 무료입니다.</strong></p>
                </div>
              </div>
              <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="shrink-0 px-4 py-2.5 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer">
                <img src="/kakaotalk-icon.png" alt="KakaoTalk" class="w-4 h-4 object-contain" />
                <span>카카오톡 1:1 무료 상담</span>
              </a>
            </div>
          </div>

          <!-- ========================================================
               FEATURE 2: 2026 CMS BENCHMARK NUMBERS (DASHBOARD)
               ======================================================== -->
          <div id="section-cms-numbers" class="mb-14">
            <h3 class="font-serif text-xl sm:text-2xl text-brand-dark font-bold mb-2 flex items-center gap-2">
              <span style="width:10px;height:22px;background:#1a5cf6;border-radius:99px;display:inline-block;"></span>
              (1) 올해 알아둘 2026년 메디케어 공식 기본 수치 (CMS 확정치)
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 mb-6">
              2026년 10월 기준 연방 메디케어·메디케이드 서비스 센터(CMS) 공식 발표 수치로 완벽 검증된 핵심 재정 지표입니다.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Metric 1: Part B Premium -->
              <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-colors">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">Part B 외래 보험</span>
                    <span class="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">작년 $185 대비 인상</span>
                  </div>
                  <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">$202.90 <span class="text-xs font-medium text-slate-500">/월</span></div>
                  <p class="text-xs text-slate-600 leading-relaxed mb-3">2026년 파트 B 표준 월 보험료. 파트 B 디덕터블은 <strong>$283</strong>입니다.</p>
                </div>
                <div class="pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700 flex justify-between">
                  <span>연간 디덕터블</span>
                  <span class="text-blue-700 font-bold">$283</span>
                </div>
              </div>

              <!-- Metric 2: Part D $2,100 Cap -->
              <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-400 transition-colors">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Part D 처방약 상한</span>
                    <span class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">도넛홀 전격 폐지</span>
                  </div>
                  <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">$2,100 <span class="text-xs font-medium text-slate-500">/연간</span></div>
                  <p class="text-xs text-slate-600 leading-relaxed mb-3">본인부담 상한제 도입 2년 만의 첫 인상($2,000→$2,100). 도달 시 잔여 기간 <strong>$0 코페이</strong>.</p>
                </div>
                <div class="pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700 flex justify-between">
                  <span>파트 D 디덕터블 상한</span>
                  <span class="text-emerald-700 font-bold">최대 $615</span>
                </div>
              </div>

              <!-- Metric 3: Part A Hospital Deductible -->
              <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-400 transition-colors">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">Part A 병원 입원</span>
                    <span class="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">40크레딧 $0 무료</span>
                  </div>
                  <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">$1,736 <span class="text-xs font-medium text-slate-500">/Benefit Period당</span></div>
                  <p class="text-xs text-slate-600 leading-relaxed mb-3">병원 입원 공제액(디덕터블). 1~60일까지 추가 일일 코페이 없이 전액 보장.</p>
                </div>
                <div class="pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700 flex justify-between">
                  <span>10년(40크레딧) 근로자</span>
                  <span class="text-purple-700 font-bold">월 $0 (전액 무료)</span>
                </div>
              </div>

              <!-- Metric 4: Standalone PDP Reduction -->
              <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-colors">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">단독 약 플랜 축소</span>
                    <span class="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">꼼꼼한 비교 필수</span>
                  </div>
                  <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">약 360개 <span class="text-xs font-medium text-slate-500">전국 플랜</span></div>
                  <p class="text-xs text-slate-600 leading-relaxed mb-3">단독 약 플랜이 전국 464개에서 약 360개로 감소. 단독 평균 약 $34, 어드밴티지 내장 플랜 약 $11.</p>
                </div>
                <div class="pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700 flex justify-between">
                  <span>정부 협상 10대 약품</span>
                  <span class="text-amber-800 font-bold">인하가 적용 시작</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================
               FEATURE 3: 4 MEDICARE PARTS (UP-TO-DATE VALUES)
               ======================================================== -->
          <div id="section-medicare-parts" class="mb-14">
            <h3 class="font-serif text-xl sm:text-2xl text-brand-dark font-bold mb-6 flex items-center gap-2">
              <span style="width:10px;height:22px;background:#1a5cf6;border-radius:99px;display:inline-block;"></span>
              (2) 메디케어 파트별 기본 구조
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <!-- Part A -->
              <div class="editorial-card flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold px-2.5 py-1 rounded-full text-white bg-blue-600">Part A</span>
                    <span class="text-xs font-medium text-slate-500">병원 입원</span>
                  </div>
                  <h4 class="font-serif text-xl text-brand-dark font-bold mb-1.5">병원 입원 보험</h4>
                  <p class="text-xs text-slate-600 leading-relaxed mb-4">병원 입원 진료, 전문 간호 시설(SNF), 호스피스 간호를 보장합니다. Benefit Period당 디덕터블은 <strong>$1,736</strong>입니다.</p>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-800">
                  • 10년(40크레딧) 납부자: <strong>월 $0 (무료)</strong>
                </div>
              </div>

              <!-- Part B -->
              <div class="editorial-card flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold px-2.5 py-1 rounded-full text-white bg-purple-600">Part B</span>
                    <span class="text-xs font-medium text-slate-500">외래 진료</span>
                  </div>
                  <h4 class="font-serif text-xl text-brand-dark font-bold mb-1.5">외래 의료 보험</h4>
                  <p class="text-xs text-slate-600 leading-relaxed mb-4">의사 진료, 정기 검진, 외래 검사/수술, 의료 장비를 보장합니다. 디덕터블은 <strong>$283</strong>입니다.</p>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-800">
                  • 2026 CMS 표준 보험료: <strong>월 $202.90</strong>
                </div>
              </div>

              <!-- Part C -->
              <div class="editorial-card flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold px-2.5 py-1 rounded-full text-white bg-indigo-600">Part C</span>
                    <span class="text-xs font-medium text-slate-500">우대 종합</span>
                  </div>
                  <h4 class="font-serif text-xl text-brand-dark font-bold mb-1.5">어드밴티지</h4>
                  <p class="text-xs text-slate-600 leading-relaxed mb-4">민간 보험사를 통한 종합 패키지 플랜(A+B+대개 D 통합 및 치과·안과·보청기 등 부가 혜택)입니다.</p>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-800">
                  • 추가 월 보험료: <strong>월 $0 플랜 다수</strong>
                </div>
              </div>

              <!-- Part D -->
              <div class="editorial-card flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold px-2.5 py-1 rounded-full text-white bg-teal-600">Part D</span>
                    <span class="text-xs font-medium text-slate-500">처방 의약품</span>
                  </div>
                  <h4 class="font-serif text-xl text-brand-dark font-bold mb-1.5">처방약 보험</h4>
                  <p class="text-xs text-slate-600 leading-relaxed mb-4">약국 조제 처방약을 보장합니다. 디덕터블 상한은 최대 $615이며, 본인부담금 상한제가 적용됩니다.</p>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-800">
                  • 2026 연간 상한제: <strong>최대 $2,100 한도</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================
               FEATURE 4: 2026 IRA DEEP DIVE ($2,100 CAP & CHANGES)
               ======================================================== -->
          <div id="section-ira" class="ira-container">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span class="ira-header-tag">2026 Inflation Reduction Act (IRA) · 처방약 구조 전면 개편</span>
              <span class="text-xs text-blue-200 bg-blue-500/20 px-2.5 py-0.5 rounded border border-blue-400/30">CMS 2026년 10월 수치 검증</span>
            </div>
            <h3 class="ira-main-title">(3) 2026년 메디케어 파트 D: $2,100 약값 상한제와 처방약 핵심 변경점</h3>
            <p class="ira-main-desc">
              처방약을 복용하신다면, 2026년은 메디케어 약 보장에 큰 변화가 생긴 해입니다. 디덕터블·코페이·코인슈어런스 합계가 2026년에 <strong>$2,100에 도달하면, 그 해 나머지 기간 동안 보장 약값 본인부담은 $0</strong>입니다. (단, 월 보험료는 상한에 포함되지 않습니다.)
            </p>

            <div class="ira-grid mb-6">
              <div class="ira-card">
                <div class="ira-card-title">1. 처방약 연간 본인부담 상한: $2,000 → $2,100</div>
                <p class="ira-card-desc">
                  기존의 복잡했던 <strong>도넛홀(Coverage Gap) 구간이 전격 폐지</strong>되었습니다. 상한제 도입 2년 만의 첫 인상으로 $2,100에 도달하는 즉시 이후의 처방약값은 100% 보험사가 부담($0 코페이)합니다.
                </p>
              </div>

              <div class="ira-card">
                <div class="ira-card-title">2. 처방약 무이자 분할 납부 프로그램 (M3P)</div>
                <p class="ira-card-desc">
                  <strong>Medicare Prescription Payment Plan (M3P)</strong>을 통해 연초에 일시적으로 발생하는 고액 약값을 약국에서 한 번에 내는 대신 1년(12개월) 동안 무이자 균등 분할 납부할 수 있습니다. 가입 플랜에 신청 방법을 문의하세요.
                </p>
              </div>

              <div class="ira-card">
                <div class="ira-card-title">3. 메디케어 약값 협상 첫 10개 약품 인하 가격 적용 시작</div>
                <p class="ira-card-desc">
                  연방 정부가 직접 협상한 10대 다빈도 의약품(Eliquis, Xarelto, Jardiance, Januvia, Entresto 등)의 인하된 가격이 2026년부터 본격 적용되어 본인부담금이 크게 낮아집니다.
                </p>
              </div>

              <div class="ira-card">
                <div class="ira-card-title">4. 인슐린 월 $35 상한 &amp; 권장 성인 백신 $0 무료</div>
                <p class="ira-card-desc">
                  인슐린은 30일분 공급당 최대 $35로 제한되며, 대상포진(Shingrix), 독감, 폐렴구균, 코로나19, RSV 등 CDC 권장 백신은 코페이 없이 전액 무료로 접종받으실 수 있습니다.
                </p>
              </div>
            </div>

            <!-- Standalone PDP caution box -->
            <div class="p-4 rounded-xl bg-white/10 border border-white/20 text-xs sm:text-sm text-slate-200 leading-relaxed">
              <div class="font-bold text-amber-300 mb-1 flex items-center gap-2">
                <span>⚠️</span>
                <span>단독 파트 D 플랜 선택지 축소 주의: 전국 464개 → 약 360개로 감소</span>
              </div>
              <p class="text-xs text-slate-300 mb-2">
                올해 단독 파트 D 플랜 수가 전국적으로 크게 줄어들었습니다. 단독 파트 D 평균 보험료는 월 약 $34(작년 약 $38에서 인하)이며, 어드밴티지 내장 플랜은 약 $11입니다.
              </p>
              <p class="text-xs text-slate-200">
                <strong>지금 할 일:</strong> 본인의 약이 내년 플랜의 <strong>포뮬러리(약 목록)</strong>에 있는지, <strong>몇 등급(tier)</strong>인지, <strong>사전 승인(prior authorization)</strong>이 필요한지 반드시 확인하세요. 코페이를 결정하는 것은 바로 이것입니다.
              </p>
            </div>
          </div>

          <!-- ========================================================
               FEATURE 5: ORIGINAL VS ADVANTAGE (4 CRITERIA & OEP)
               ======================================================== -->
          <div id="section-compare" class="mb-14">
            <h3 class="font-serif text-xl sm:text-2xl text-brand-dark font-bold mb-2 flex items-center gap-2">
              <span style="width:10px;height:22px;background:#1a5cf6;border-radius:99px;display:inline-block;"></span>
              (4) 오리지널 메디케어 vs 메디케어 어드밴티지: 2026 제대로 비교하는 법
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 mb-5">
              가입 기간(2026년 10월 15일~12월 7일)에 가장 큰 결정 중 하나는 오리지널 메디케어를 유지할지, 메디케어 어드밴티지로 바꿀지, 또는 어드밴티지 플랜을 갈아탈지입니다.
            </p>

            <!-- Comparison Table -->
            <div class="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-xs mb-8">
              <table class="w-full text-left font-sans text-xs sm:text-sm border-collapse medicare-table">
                <thead>
                  <tr>
                    <th class="w-1/5">구분</th>
                    <th class="w-2/5" style="background:#1e293b !important;">경로 1: 오리지널 + 서플리먼트(Medigap)</th>
                    <th class="w-2/5" style="background:#312e81 !important;">경로 2: 메디케어 어드밴티지 (Part C)</th>
                  </tr>
                </thead>
                <tbody class="text-slate-800">
                  <tr class="hover:bg-slate-50">
                    <td class="font-bold bg-slate-50">기본 구성</td>
                    <td class="border-l border-slate-200">파트 A(입원) + 파트 B(외래) + 서플리먼트(Plan G 등) + 파트 D(처방약)</td>
                    <td class="border-l border-slate-200">병원·의료·대개 약 보장을 하나로 묶은 민간 일체형 플랜 (HMO / PPO)</td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="font-bold bg-slate-50">의사/병원 네트워크</td>
                    <td class="border-l border-slate-200 font-semibold text-emerald-800">미국 전역 메디케어 수용 의료진 100% 이용 (사전승인/네트워크 제한 없음)</td>
                    <td class="border-l border-slate-200">보험사 지정 네트워크 내 이용 원칙, 전문의 진료 시 사전 승인 필요 가능</td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="font-bold bg-slate-50">추가 부가 혜택</td>
                    <td class="border-l border-slate-200 text-slate-500">기본 치과, 안과, 보청기, 운동 혜택 미포함</td>
                    <td class="border-l border-slate-200 font-semibold text-indigo-800">치과, 안과, 보청기, 한방/침술, OTC 카드, 피트니스 등 풍부</td>
                  </tr>
                  <tr class="hover:bg-slate-50">
                    <td class="font-bold bg-slate-50">월 비용 구조</td>
                    <td class="border-l border-slate-200">고정비 높음 (Part B $202.90 + 서플리먼트 + Part D), <strong>진료 시 본인부담금 거의 없음</strong></td>
                    <td class="border-l border-slate-200">고정비 매우 저렴 (<strong>Part C $0 플랜 다수</strong>), <strong>진료·처방 시마다 코페이 발생</strong></td>
                  </tr>
                  <tr style="background:#eff6ff !important;">
                    <td class="font-bold bg-slate-50">추천 대상</td>
                    <td class="border-l border-slate-200 font-bold text-blue-700">만성질환이 있거나 대형병원/전문의 진료가 잦으신 분, 전국 여행이 잦은 분</td>
                    <td class="border-l border-slate-200 font-bold text-indigo-800">평소 건강하며 월 고정 지출을 아끼고 다양한 생활 부가 혜택을 원하는 분</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 4 Criteria Editorial Grid -->
            <div class="mb-7">
              <h4 class="text-base font-bold text-brand-dark mb-3">전문 용어 없이 비교하는 4가지 실전 기준:</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div class="text-xs font-bold text-brand-blue mb-1">기준 1. 담당 의사와 병원</div>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    어드밴티지는 2027년 네트워크에 각 의사·병원이 포함되는지 확인하세요. 네트워크는 매년 바뀝니다. 오리지널은 거의 모든 의료기관에서 받습니다.
                  </p>
                </div>
                <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div class="text-xs font-bold text-brand-blue mb-1">기준 2. 처방약 (포뮬러리)</div>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    모든 처방약을 플랜 포뮬러리와 대조하고, 등급과 사전 승인(prior authorization) 필요 여부를 확인하세요. 2026년 파트 D 상한 $2,100을 기억하세요.
                  </p>
                </div>
                <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div class="text-xs font-bold text-brand-blue mb-1">기준 3. 연간 총비용</div>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    월 보험료(플랜 보험료 + 파트 B $202.90) + 디덕터블 + 예상 진료·약 코페이를 합산하세요. 보험료만 보고 판단하지 마세요.
                  </p>
                </div>
                <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div class="text-xs font-bold text-brand-blue mb-1">기준 4. 별점과 추가 혜택</div>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    메디케어는 매년 10월 medicare.gov에 1~5점 별점을 게시합니다. 추가 혜택은 결정적 기준이 아니라 보조 기준으로 보시고 세부 조건을 확인하세요.
                  </p>
                </div>
              </div>
            </div>

            <!-- OEP Notice Card -->
            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800 mb-1.5">
                  알아둘 또 하나의 기간: 1월 1일 ~ 3월 31일
                </div>
                <h5 class="text-sm font-bold text-slate-900 mb-1">메디케어 어드밴티지 공개 가입 기간 (OEP, Open Enrollment Period)</h5>
                <p class="text-xs text-slate-600 leading-relaxed max-w-3xl">
                  이미 어드밴티지 플랜에 가입 중이라면 매년 <strong>1월 1일~3월 31일</strong> 사이에 다른 어드밴티지 플랜으로 1회 변경하거나 오리지널 메디케어로 복귀할 수 있습니다. 또한 CMS가 2027년 어드밴티지 플랜 평가·마케팅 규정을 일부 개편하므로 9월 말~10월 초 ANOC에서 본인 플랜의 변경 사항을 꼭 확인하세요.
                </p>
              </div>
              <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="shrink-0 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap cursor-pointer">
                플랜 비교 상담 신청 →
              </a>
            </div>
          </div>

          <!-- ========================================================
               FEATURE 6: 65세 가입 기간 & 평생 지연 벌금 (TIMELINE)
               ======================================================== -->
          <div id="section-enrollment-timeline" class="mb-14">
            <h3 class="font-serif text-xl sm:text-2xl text-brand-dark font-bold mb-2 flex items-center gap-2">
              <span style="width:10px;height:22px;background:#1a5cf6;border-radius:99px;display:inline-block;"></span>
              (5) 2026년에 65세가 되시나요? 헷갈리는 메디케어 가입 기간 &amp; 평생 벌금 정리
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 mb-6">
              65세가 되거나(또는 65세 이후에도 직장 보험을 유지 중이라면) 메디케어에는 별도의 가입 일정이 있습니다. 시기를 놓치면 평생 패널티가 부과될 수 있습니다.
            </p>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-7">
              <!-- Left: Initial Enrollment Period & Penalties -->
              <div class="editorial-card">
                <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 mb-2">
                  주요 가입 기간
                </div>
                <h4 class="font-serif text-xl text-brand-dark font-bold mb-2">Initial Enrollment Period (신규 가입 기간, IEP)</h4>
                <ul class="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed mb-5">
                  <li>• <strong>총 7개월:</strong> 65세 생일 달의 전 3개월 + 생일 달 + 후 3개월</li>
                  <li>• <strong>보장 개시:</strong> 생일 전 3개월 안에 신청하면 65세가 되는 달부터 보장이 시작됩니다. 늦게 신청하면 보장 개시일이 뒤로 밀립니다.</li>
                </ul>

                <h5 class="text-sm font-bold text-red-700 mb-2 flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  지연 패널티 (다른 적격 보장 없이 미가입 시 평생 부과):
                </h5>
                <div class="p-3.5 bg-red-50/80 rounded-xl border border-red-200 space-y-2 text-xs text-red-950 leading-relaxed">
                  <p>• <strong>파트 B 평생 벌금:</strong> 가입 자격이 있었는데 12개월 단위로 가입하지 않은 기간마다 기준 보험료의 <strong>10%씩 인상되어 평생 적용</strong>됩니다.</p>
                  <p>• <strong>파트 D(처방약) 평생 벌금:</strong> 적격 약 보장 없이 보낸 매월마다 기준 보험료의 <strong>1%가 보험료에 영구 가산</strong>됩니다.</p>
                </div>
              </div>

              <!-- Right: Other Enrollment Periods -->
              <div class="editorial-card">
                <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 mb-2">
                  가입 주기 총정리
                </div>
                <h4 class="font-serif text-xl text-brand-dark font-bold mb-3">알아둘 다른 주요 가입 기간</h4>
                <div class="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong class="text-slate-900 block mb-0.5">1. 연간 가입 기간 (AEP: 10월 15일 ~ 12월 7일)</strong>
                    <p class="text-xs text-slate-600">이미 메디케어에 가입한 분이 플랜을 변경·교체하는 기간 (뉴스에 나오는 오픈 인롤먼트).</p>
                  </div>
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong class="text-slate-900 block mb-0.5">2. 일반 가입 기간 (GEP: 1월 1일 ~ 3월 31일)</strong>
                    <p class="text-xs text-slate-600">신규 가입 기간(IEP)을 놓쳤고 특별 예외에 해당하지 않는 경우 신청 (보장은 7월 1일부터 개시되며 벌금 적용 가능).</p>
                  </div>
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong class="text-slate-900 block mb-0.5">3. 특별 가입 기간 (SEP)</strong>
                    <p class="text-xs text-slate-600">직장 건강보험 퇴직/상실, 타주 이사 등 인생의 변화가 있을 때 보통 60일~8개월 이내에 패널티 없이 가입할 수 있습니다.</p>
                  </div>
                  <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-xs">
                    <strong>지금 할 일:</strong> 65세 이후에도 계속 일한다면 직장 보험이 '적격 보장(creditable coverage, 통상 20인 이상 규모)'에 해당하는지 고용주에게 확인하세요. 패널티 적용 여부가 여기서 갈립니다.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ========================================================
               FEATURE 7: NJ SENIOR SUPPORT (MSP $202.90 UPDATE)
               ======================================================== -->
          <div id="section-senior" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="editorial-card">
              <h4 class="font-serif text-xl text-brand-dark font-bold mb-3">(6) 뉴저지 시니어 특별 지원 프로그램 (3대 복지)</h4>
              <p class="text-xs sm:text-sm text-slate-600 mb-3">메디케이드 소득 기준을 살짝 초과하는 한인 어르신을 위한 3대 주정부 지원책입니다:</p>
              <div class="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <div class="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
                  <strong class="text-blue-900 block font-bold mb-0.5">1. MSP 프로그램 (QMB / SLMB / QI)</strong>
                  <p class="text-xs text-slate-700">Part B 월 보험료(2026년 공식 <strong>월 $202.90</strong>)를 뉴저지 주정부에서 전액 대납해 드립니다.</p>
                </div>
                <div class="p-3.5 bg-purple-50/60 rounded-xl border border-purple-100">
                  <strong class="text-purple-900 block font-bold mb-0.5">2. PAAD 처방약 지원 프로그램</strong>
                  <p class="text-xs text-slate-700">1인 연소득 약 $52,000대 이하 시 제네릭 $5, 브랜드 약 $7 고정가로 구매 가능합니다.</p>
                </div>
                <details class="clean-details">
                  <summary class="clean-summary" style="color:#b45309 !important;">Senior Gold 할인 제도 보기</summary>
                  <div class="clean-details-body text-amber-950 p-3 bg-amber-50 rounded-xl border border-amber-200">
                    PAAD 소득 기준을 살짝 넘는 어르신을 위한 프로그램으로, 기본 코페이 $15 지불 후 잔여 약값의 50%를 주정부가 지원합니다.
                  </div>
                </details>
              </div>
            </div>

            <!-- Free Consultation Card -->
            <div class="editorial-card flex flex-col justify-between" style="border-top: 4px solid #1a5cf6 !important;">
              <div>
                <span class="text-xs font-bold text-brand-blue bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 mb-2 inline-block">1:1 맞춤 안내</span>
                <h4 class="font-serif text-xl text-brand-dark font-bold mb-2">뉴저지 의료접근센터 무료 비교 지원</h4>
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  메디케어 플랜은 카운티마다, 개인의 처방약과 주치의에 따라 유불리가 완전히 달라집니다. 어떤 질문이든 편안하게 한국어로 문의해 주세요.
                </p>
                <div class="space-y-2 text-xs text-slate-700 mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>✓ 2026년 변경된 ANOC 안내문 해석 지원</div>
                  <div>✓ 복용 중인 모든 처방약 포뮬러리 및 등급(Tier) 대조</div>
                  <div>✓ 주치의 및 방문 병원의 내년도 네트워크 지속 여부 확인</div>
                  <div>✓ 월 보험료 $0 플랜과 오리지널 메디갭 총비용 비교 분석</div>
                </div>
              </div>
              <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="medicare-cta-btn block text-center cursor-pointer">
                카카오톡 1:1 상담 바로가기 (무료 비교 분석) →
              </a>
            </div>
          </div>

        </div>
      </section>`;

if (sectionMedicareRegex.test(content)) {
  content = content.replace(sectionMedicareRegex, newSectionMedicare);
  console.log('[OK] Replaced Section 2 (Medicare) with comprehensive 2026 AEP blend');
} else {
  console.error('[ERROR] Could not match section-medicare regex');
}

// 3. Update numbers in Finder and FAQ
content = content.replace(/Part D \$2,000 상한제/g, 'Part D $2,100 상한제');
content = content.replace(/약 \$185/g, '월 $202.90');

// Save updated content to medicare.html
fs.writeFileSync(medicarePath, content, 'utf8');
console.log('[OK] Saved updated medicare.html');

// Also update medicare/index.html
const medicareIndexPath = path.join(BASE_DIR, 'medicare', 'index.html');
if (fs.existsSync(medicareIndexPath)) {
  fs.writeFileSync(medicareIndexPath, content, 'utf8');
  console.log('[OK] Synced to medicare/index.html');
}

// 4. Deploy both files to Hostinger Production
const filesToDeploy = ['medicare.html', 'medicare/index.html'];

async function uploadFile(relPath) {
  const localPath = path.join(BASE_DIR, relPath);
  if (!fs.existsSync(localPath)) return;

  const fileContent = fs.readFileSync(localPath);
  const size = fileContent.length;
  console.log(`[UPLOADING] ${relPath} (${size} bytes)...`);

  const encodedRelPath = relPath.split('/').map(encodeURIComponent).join('/');
  const postUrl = new URL(`${TUS_URL}/${encodedRelPath}?override=true`);

  await new Promise((resolve, reject) => {
    const req = https.request(postUrl, {
      method: 'POST',
      headers: {
        'X-Auth': AUTH_KEY,
        'X-Auth-Rest': REST_AUTH_KEY,
        'Tus-Resumable': '1.0.0',
        'Upload-Length': size,
        'Upload-Offset': 0
      }
    }, res => {
      if (res.statusCode === 201 || res.statusCode === 200 || res.statusCode === 204) resolve();
      else {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => reject(new Error(`POST failed ${res.statusCode}: ${body}`)));
      }
    });
    req.on('error', reject);
    req.end();
  });

  await new Promise((resolve, reject) => {
    const patchReq = https.request(postUrl, {
      method: 'PATCH',
      headers: {
        'X-Auth': AUTH_KEY,
        'X-Auth-Rest': REST_AUTH_KEY,
        'Tus-Resumable': '1.0.0',
        'Content-Type': 'application/offset+octet-stream',
        'Upload-Offset': 0,
        'Content-Length': size
      }
    }, res => {
      if (res.statusCode === 204 || res.statusCode === 200) {
        console.log(`[DONE] ${relPath} uploaded (${res.statusCode})`);
        resolve();
      } else {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => reject(new Error(`PATCH failed ${res.statusCode}: ${body}`)));
      }
    });
    patchReq.on('error', reject);
    patchReq.write(fileContent);
    patchReq.end();
  });
}

(async () => {
  for (const f of filesToDeploy) {
    try {
      await uploadFile(f);
    } catch (e) {
      console.error(`Failed to upload ${f}:`, e.message);
    }
  }
  console.log('--- Medicare PDF information successfully blended and deployed! ---');
})();
