/**
 * 2026 Medicare & ACA Complete Guide HTML Generator
 * Designed for maximum readability, clean Korean typography, and rich custom SVG illustrations.
 */

function generateMedicareAcaHtml() {
  return `
    <!-- ========================================================
         2026 MEDICARE & ACA SECTION WRAPPER
         ======================================================== -->
    <div class="medicare-guide-container space-y-12">
      
      <!-- 0. TOP QUICK JUMP PILL NAVIGATION -->
      <nav class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs" aria-label="메디케어 및 ACA 빠른 이동">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            빠른 목차 바로가기 (주제별 클릭)
          </span>
          <span class="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">2026 공식 최신판</span>
        </div>
        <div class="flex flex-wrap gap-2 text-xs">
          <a href="#section-compare-intro" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold transition-colors">1. 메디케어 vs ACA 구분</a>
          <a href="#section-open-enrollment" class="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold border border-red-200 transition-colors">★ 2026 AEP 가입 체크리스트</a>
          <a href="#section-cms-numbers" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold transition-colors">2. 2026 CMS 핵심 수치</a>
          <a href="#section-medicare-parts" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold transition-colors">3. 메디케어 4대 파트(A·B·C·D)</a>
          <a href="#section-ira" class="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 transition-colors">4. 파트 D $2,100 상한제</a>
          <a href="#section-compare" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold transition-colors">5. 오리지널 vs 어드밴티지</a>
          <a href="#section-enrollment-timeline" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold transition-colors">6. 65세 가입 &amp; 벌금 방지</a>
          <a href="#section-aca-guide" class="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold border border-indigo-200 transition-colors">7. 2026 ACA (오바마케어)</a>
          <a href="#section-senior-support" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold transition-colors">8. NJ 시니어 주정부 지원</a>
          <a href="#section-medicare-faq" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold transition-colors">9. 자주 묻는 질문 (FAQ)</a>
        </div>
      </nav>

      <!-- ========================================================
           ILLUSTRATION 1 & INTRO: MEDICARE VS ACA AT-A-GLANCE
           ======================================================== -->
      <section id="section-compare-intro" class="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200 shadow-sm">
        <div class="max-w-3xl mb-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 mb-2">
            <span>한눈에 이해하는 미국 의료보험 지도</span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight">
            나에게 맞는 보험은? 메디케어(65세+) vs ACA 오바마케어(만 19~64세)
          </h3>
          <p class="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            미국의 공공 건강보험 체계는 연령과 조건에 따라 크게 두 줄기로 나뉩니다. 만 65세 이상 시니어는 연방 메디케어에 해당하며, 만 19세부터 64세까지의 성인 및 가족은 ACA 오바마케어(뉴저지 GetCoveredNJ)를 통해 소득별 정부 보조금을 지원받습니다.
          </p>
        </div>

        <!-- Custom SVG Visual Diagram: Medicare vs ACA -->
        <div class="mb-8 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            
            <!-- Left Card: Medicare -->
            <div class="bg-white p-5 rounded-2xl border-2 border-blue-600/30 shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white">연방 메디케어 (Medicare)</span>
                  <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">만 65세 이상</span>
                </div>
                <div class="flex items-center gap-3 mb-3">
                  <!-- Custom SVG Icon: Senior & Shield -->
                  <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <svg class="w-7 h-7 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="M9 12l2 2 4-4"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-bold text-slate-900">시니어 &amp; 장애인 연방의료보험</h4>
                    <p class="text-xs text-slate-500">주관: 연방 메디케어·메디케이드국 (CMS)</p>
                  </div>
                </div>
                <ul class="text-xs sm:text-sm text-slate-700 space-y-2 mb-4">
                  <li class="flex items-start gap-2">
                    <span class="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>대상:</strong> 만 65세 이상, 24개월 이상 장애연금(SSDI) 수령자, 말기신부전(ESRD)</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>구성:</strong> 파트 A(입원), B(외래), C(어드밴티지 종합), D(처방약)</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-blue-600 font-bold mt-0.5">•</span>
                    <span><strong>2026 혁신:</strong> 처방약(파트 D) 연간 본인부담금 <strong>$2,100 상한제</strong> 도입</span>
                  </li>
                </ul>
              </div>
              <div class="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs">
                <span class="font-bold text-blue-900 block mb-0.5">📅 연례 오픈 인롤먼트 (AEP)</span>
                <span class="text-blue-800">매년 <strong>10월 15일 ~ 12월 7일</strong> (1월 1일 적용)</span>
              </div>
            </div>

            <!-- Right Card: ACA GetCoveredNJ -->
            <div class="bg-white p-5 rounded-2xl border-2 border-indigo-600/30 shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-600 text-white">ACA 오바마케어 (GetCoveredNJ)</span>
                  <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">만 19~64세 성인</span>
                </div>
                <div class="flex items-center gap-3 mb-3">
                  <!-- Custom SVG Icon: Family & Heart -->
                  <div class="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                    <svg class="w-7 h-7 text-indigo-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-bold text-slate-900">뉴저지 주정부 마켓플레이스</h4>
                    <p class="text-xs text-slate-500">주관: GetCoveredNJ (뉴저지 공식 거래소)</p>
                  </div>
                </div>
                <ul class="text-xs sm:text-sm text-slate-700 space-y-2 mb-4">
                  <li class="flex items-start gap-2">
                    <span class="text-indigo-600 font-bold mt-0.5">•</span>
                    <span><strong>대상:</strong> 만 19~64세 뉴저지 주민, 자영업자, 프리랜서, 직장보험 미제공자</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-indigo-600 font-bold mt-0.5">•</span>
                    <span><strong>구성:</strong> 브론즈, 실버(CSR 특별보조), 골드, 플래티넘 4단계 플랜</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-indigo-600 font-bold mt-0.5">•</span>
                    <span><strong>정부 지원:</strong> 연방 세액공제(APTC) + <strong>뉴저지 주정부 추가 보조금(NJ HCTC)</strong></span>
                  </li>
                </ul>
              </div>
              <div class="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-xs">
                <span class="font-bold text-indigo-900 block mb-0.5">📅 연례 오픈 인롤먼트 (OEP)</span>
                <span class="text-indigo-800">매년 <strong>11월 1일 ~ 1월 31일</strong> (12/31까지 신청 시 1/1 개시)</span>
              </div>
            </div>

          </div>

          <!-- Transition Banner: Turning 65 -->
          <div class="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center shrink-0 font-bold text-amber-800 text-sm">TIP</div>
            <div class="text-xs sm:text-sm leading-relaxed">
              <strong>만 65세가 다가오시나요?</strong> 현재 ACA 오바마케어(GetCoveredNJ)를 이용 중이시라면, <strong>65세 생일 3개월 전</strong>부터 메디케어 신청을 준비해야 합니다. 메디케어가 시작되면 ACA 보조금은 법적으로 중단되므로 마켓플레이스 보험을 정해진 시점에 해지하여 이중 보험료나 벌금을 방지해야 합니다.
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================================
           FEATURE 1: 2026 AEP OPEN ENROLLMENT & 4-STEP CHECKLIST
           ======================================================== -->
      <section id="section-open-enrollment" class="medicare-dark-navy p-6 sm:p-9 rounded-3xl text-white shadow-xl border border-blue-900/60 relative overflow-hidden">
        <!-- Ambient Radial Glow -->
        <div style="position:absolute;top:-80px;right:-80px;width:320px;height:320px;background:radial-gradient(circle,rgba(59,130,246,0.22) 0%,transparent 70%);border-radius:50%;pointer-events:none;"></div>

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
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-7 border border-white/15">
          <h4 class="text-sm font-bold text-blue-300 mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            이 기간에 할 수 있는 일 (연례 변경 권한):
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-200">
            <div class="flex items-center gap-2">• 오리지널 메디케어 ↔ 메디케어 어드밴티지 간 상호 전환</div>
            <div class="flex items-center gap-2">• 기존 메디케어 어드밴티지 플랜을 다른 회사 플랜으로 변경</div>
            <div class="flex items-center gap-2">• 파트 D 처방약 플랜 신규 가입·변경·해지</div>
            <div class="flex items-center gap-2">• 약 보장이 없으셨던 분들의 신규 처방약 플랜 가입</div>
          </div>
        </div>

        <!-- 4-Step Checklist Grid with Visual Badges -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
          <!-- Step 1 -->
          <div class="bg-white/8 rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:bg-white/12 transition-colors">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">STEP 1</span>
                <span class="text-xs text-amber-300 font-semibold">9월 말 ~ 10월 초 우편 수령</span>
              </div>
              <h5 class="text-base font-bold text-white mb-2">1. Annual Notice of Change(ANOC) 안내문을 확인하세요</h5>
              <p class="text-xs text-slate-300 leading-relaxed">
                현재 가입된 보험사가 9월 말~10월 초에 우편으로 발송합니다. 내년도 월 보험료, 코페이, 약 목록(포뮬러리), 병원 및 의사 네트워크 변경 사항이 적혀 있습니다. <strong>다른 무엇보다 먼저 꼼꼼히 읽으세요.</strong>
              </p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="bg-white/8 rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:bg-white/12 transition-colors">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">STEP 2</span>
                <span class="text-xs text-emerald-300 font-semibold">의사·병원·약국 대조</span>
              </div>
              <h5 class="text-base font-bold text-white mb-2">2. 담당 의사와 처방약 목록을 정리하세요</h5>
              <p class="text-xs text-slate-300 leading-relaxed">
                현재 다니는 의사·병원·약국과 복용 중인 모든 약(용량 포함)을 적으세요. 플랜마다 네트워크와 약 목록(포뮬러리)이 매년 바뀌므로 2027년에도 계속 포함되는지 사전 확인이 필수입니다.
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="bg-white/8 rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:bg-white/12 transition-colors">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">STEP 3</span>
                <span class="text-xs text-purple-300 font-semibold">연간 총비용 계산</span>
              </div>
              <h5 class="text-base font-bold text-white mb-2">3. 보험료가 아닌 연간 총비용을 비교하세요</h5>
              <p class="text-xs text-slate-300 leading-relaxed">
                <strong>월 보험료 + 파트 B 보험료(2026년 공식 월 $202.90) + 디덕터블 + 약·진료 코페이</strong>를 합산하세요. 월 보험료가 $0인 플랜이라도 잦은 병원 방문 시 총비용은 더 비쌀 수 있습니다.
              </p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="bg-white/8 rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:bg-white/12 transition-colors">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">STEP 4</span>
                <span class="text-xs text-sky-300 font-semibold">medicare.gov 1~5점</span>
              </div>
              <h5 class="text-base font-bold text-white mb-2">4. 플랜 별점과 부가 혜택 조건을 대조하세요</h5>
              <p class="text-xs text-slate-300 leading-relaxed">
                CMS는 매년 10월 medicare.gov에 1~5점 별점을 게시합니다. 치과·안과·보청기·피트니스 혜택이 중요하다면 한도액과 지정 병원 세부 조건을 꼭 확인하세요. 카운티별로 혜택이 상이합니다.
              </p>
            </div>
          </div>
        </div>

        <!-- Free Assistance Banner -->
        <div class="p-5 rounded-2xl bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-400/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h5 class="text-sm font-bold text-white mb-1">지금 할 일: ANOC 우편물, 복용 약 목록, 주치의 명단을 준비하세요</h5>
            <p class="text-xs text-slate-300">저희 NJAP 내비게이션 팀이 한국어 또는 영어로 맞춤 플랜 비교를 도와드립니다. <strong>상담 및 비교 분석은 100% 무료입니다.</strong></p>
          </div>
          <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="shrink-0 px-5 py-2.5 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-bold text-xs shadow-md transition-all flex items-center justify-center cursor-pointer">
            <span>카카오톡 1:1 무료 상담 신청</span>
          </a>
        </div>
      </section>

      <!-- ========================================================
           FEATURE 2: 2026 CMS BENCHMARK NUMBERS (DASHBOARD)
           ======================================================== -->
      <section id="section-cms-numbers">
        <h3 class="font-serif text-xl sm:text-2xl text-slate-900 font-bold mb-2 flex items-center gap-2">
          <span style="width:10px;height:22px;background:#1a5cf6;border-radius:99px;display:inline-block;"></span>
          2. 올해 알아둘 2026년 메디케어 공식 기본 수치 (CMS 확정치)
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
                <span class="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">작년 대비 인상</span>
              </div>
              <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">$202.90 <span class="text-xs font-medium text-slate-500">/월</span></div>
              <p class="text-xs text-slate-600 leading-relaxed mb-3">2026년 파트 B 표준 월 보험료. 파트 B 연간 디덕터블은 <strong>$283</strong>입니다.</p>
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
              <p class="text-xs text-slate-600 leading-relaxed mb-3">본인부담 상한제 도입 2년차($2,000→$2,100). 도달 시 잔여 기간 <strong>$0 코페이</strong>.</p>
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
      </section>

      <!-- ========================================================
           ILLUSTRATION 2 & FEATURE 3: 4 MEDICARE PARTS (A, B, C, D)
           ======================================================== -->
      <section id="section-medicare-parts">
        <h3 class="font-serif text-xl sm:text-2xl text-slate-900 font-bold mb-2 flex items-center gap-2">
          <span style="width:10px;height:22px;background:#1a5cf6;border-radius:99px;display:inline-block;"></span>
          3. 메디케어 파트별 기본 구조 (A, B, C, D 알기 쉬운 일러스트)
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 mb-6">
          메디케어는 크게 4개의 알파벳 파트로 구성되어 있습니다. 각 파트의 역할과 비용 구조를 시각적으로 정리했습니다.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- Part A -->
          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-500 transition-all">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-extrabold px-3 py-1 rounded-full text-white bg-blue-600">Part A</span>
                <span class="text-xs font-semibold text-slate-500">병원 입원</span>
              </div>
              <!-- Custom Hospital Illustration SVG -->
              <div class="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 21h18"/>
                  <path d="M5 21V7l8-4v18"/>
                  <path d="M19 21V11l-6-4"/>
                  <path d="M9 9h1"/>
                  <path d="M9 13h1"/>
                  <path d="M9 17h1"/>
                </svg>
              </div>
              <h4 class="font-serif text-xl text-slate-900 font-bold mb-2">병원 입원 보험</h4>
              <p class="text-xs text-slate-600 leading-relaxed mb-4">
                병원 입원 진료, 전문 간호 시설(SNF), 호스피스 간호를 보장합니다. Benefit Period당 디덕터블은 <strong>$1,736</strong>입니다.
              </p>
            </div>
            <div class="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 text-xs text-blue-950 font-medium">
              • 10년(40크레딧) 근로자: <strong>월 $0 (무료)</strong>
            </div>
          </div>

          <!-- Part B -->
          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-500 transition-all">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-extrabold px-3 py-1 rounded-full text-white bg-purple-600">Part B</span>
                <span class="text-xs font-semibold text-slate-500">외래 진료</span>
              </div>
              <!-- Custom Doctor Stethoscope Illustration SVG -->
              <div class="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-4 text-purple-600">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
                  <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
                  <circle cx="20" cy="10" r="2"/>
                </svg>
              </div>
              <h4 class="font-serif text-xl text-slate-900 font-bold mb-2">외래 의료 보험</h4>
              <p class="text-xs text-slate-600 leading-relaxed mb-4">
                의사 진료, 정기 검진, 외래 검사 및 수술, 의료 장비를 보장합니다. 2026년 디덕터블은 <strong>$283</strong>입니다.
              </p>
            </div>
            <div class="bg-purple-50/70 p-3.5 rounded-xl border border-purple-100 text-xs text-purple-950 font-medium">
              • 2026 CMS 공식 보험료: <strong>월 $202.90</strong>
            </div>
          </div>

          <!-- Part C -->
          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-500 transition-all">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-extrabold px-3 py-1 rounded-full text-white bg-indigo-600">Part C</span>
                <span class="text-xs font-semibold text-slate-500">우대 종합</span>
              </div>
              <!-- Custom Shield Package Illustration SVG -->
              <div class="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4 text-indigo-600">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <circle cx="12" cy="11" r="3"/>
                </svg>
              </div>
              <h4 class="font-serif text-xl text-slate-900 font-bold mb-2">메디케어 어드밴티지</h4>
              <p class="text-xs text-slate-600 leading-relaxed mb-4">
                민간 보험사를 통한 일체형 종합 패키지 플랜(A+B+대개 D 포함 및 치과·안과·보청기 등 부가 혜택)입니다.
              </p>
            </div>
            <div class="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-100 text-xs text-indigo-950 font-medium">
              • 추가 월 보험료: <strong>월 $0 플랜 다수</strong>
            </div>
          </div>

          <!-- Part D -->
          <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-teal-500 transition-all">
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-extrabold px-3 py-1 rounded-full text-white bg-teal-600">Part D</span>
                <span class="text-xs font-semibold text-slate-500">처방 의약품</span>
              </div>
              <!-- Custom Pill Capsule Illustration SVG -->
              <div class="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-4 text-teal-600">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
                  <path d="m8.5 8.5 7 7"/>
                </svg>
              </div>
              <h4 class="font-serif text-xl text-slate-900 font-bold mb-2">처방약 보험</h4>
              <p class="text-xs text-slate-600 leading-relaxed mb-4">
                약국 조제 처방약을 보장합니다. 디덕터블 상한은 최대 $615이며, 본인부담금 상한제가 적용됩니다.
              </p>
            </div>
            <div class="bg-teal-50/70 p-3.5 rounded-xl border border-teal-100 text-xs text-teal-950 font-medium">
              • 2026 연간 상한제: <strong>최대 $2,100 한도</strong>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================================
           ILLUSTRATION 3 & FEATURE 4: 2026 IRA DEEP DIVE ($2,100 CAP & DONUT HOLE GONE)
           ======================================================== -->
      <section id="section-ira" class="medicare-dark-blue p-6 sm:p-9 rounded-3xl text-white shadow-xl border border-blue-900">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span class="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
            2026 Inflation Reduction Act (IRA) · 처방약 구조 전면 개편
          </span>
          <span class="text-xs text-blue-200 bg-white/10 px-2.5 py-0.5 rounded border border-white/15">CMS 2026년 확정 수치</span>
        </div>
        <h3 class="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
          4. 2026년 파트 D 핵심: $2,100 약값 상한제와 도넛홀(Donut Hole) 완전 폐지
        </h3>
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl mb-8">
          처방약을 복용하신다면, 2026년은 메디케어 역사상 약 보장에 가장 큰 혜택이 생긴 해입니다. 디덕터블·코페이·코인슈어런스 합계가 <strong>$2,100에 도달하면, 그 해 나머지 기간 동안 보장 약값 본인부담은 100% $0(무료)</strong>입니다.
        </p>

        <!-- Custom Diagram: Before vs After 2026 Part D Illustration -->
        <div class="bg-white/10 rounded-2xl p-5 sm:p-7 border border-white/15 mb-8">
          <h4 class="text-sm sm:text-base font-bold text-blue-200 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            처방약 비용 구조 비교 인포그래픽: 과거 4단계 vs 2026년 혁신
          </h4>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left: Past -->
            <div class="bg-white/5 p-4 sm:p-5 rounded-xl border border-white/10">
              <span class="text-xs font-extrabold text-red-300 bg-red-900/40 px-2.5 py-0.5 rounded border border-red-500/30 mb-2 inline-block">과거 (~2024년 이전)</span>
              <h5 class="text-sm font-bold text-white mb-2">복잡한 4단계 &amp; 도넛홀 약값 폭탄</h5>
              <div class="space-y-2 text-xs text-slate-300">
                <div class="p-2 rounded bg-white/5">1. 디덕터블 ($545 전액 본인부담)</div>
                <div class="p-2 rounded bg-white/5">2. 초기 보장 (코페이 지불)</div>
                <div class="p-2 rounded bg-red-500/20 border border-red-400/40 text-red-200 font-bold">
                  3. 도넛홀(Coverage Gap): 약값의 25%를 고스란히 환자가 부담하여 수천 달러 폭탄 발생!
                </div>
                <div class="p-2 rounded bg-white/5">4. 캣터스트로픽 단계</div>
              </div>
            </div>

            <!-- Right: 2026 Present -->
            <div class="bg-gradient-to-br from-emerald-950/40 to-blue-950/40 p-4 sm:p-5 rounded-xl border-2 border-emerald-400/40 shadow-inner">
              <span class="text-xs font-extrabold text-emerald-300 bg-emerald-900/50 px-2.5 py-0.5 rounded border border-emerald-400/40 mb-2 inline-block">2026년 현재 (IRA 전면 개편)</span>
              <h5 class="text-sm font-bold text-emerald-200 mb-2">도넛홀 소멸 &amp; $2,100 상한제 완성</h5>
              <div class="space-y-2 text-xs text-slate-200">
                <div class="p-2 rounded bg-white/10">1. 디덕터블 (플랜별 최대 $615)</div>
                <div class="p-2 rounded bg-white/10">2. 초기 보장 (약값 코페이 지불)</div>
                <div class="p-2.5 rounded bg-emerald-500/30 border border-emerald-400 text-white font-extrabold flex items-center justify-between">
                  <span>★ $2,100 도달 시 잔여 기간 100% 무료</span>
                  <span class="px-2 py-0.5 rounded bg-emerald-500 text-slate-900 text-[11px]">$0 코페이</span>
                </div>
                <div class="text-[11px] text-emerald-300 pt-1 leading-relaxed">
                  ✓ 도넛홀(Coverage Gap) 완전 폐지<br>
                  ✓ M3P: 1년 12개월 무이자 분할 납부 프로그램 신청 가능
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4 Key Provisions Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="p-5 rounded-2xl bg-white/8 border border-white/10">
            <h5 class="text-sm font-bold text-blue-200 mb-1.5">1. 처방약 연간 본인부담 상한: $2,000 → $2,100</h5>
            <p class="text-xs text-slate-300 leading-relaxed">
              기존의 복잡했던 <strong>도넛홀(Coverage Gap) 구간이 전격 폐지</strong>되었습니다. 2026년에 누적 본인부담금이 $2,100에 도달하는 즉시 이후의 처방약값은 100% 보험사가 부담($0 코페이)합니다.
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-white/8 border border-white/10">
            <h5 class="text-sm font-bold text-blue-200 mb-1.5">2. 처방약 무이자 분할 납부 프로그램 (M3P)</h5>
            <p class="text-xs text-slate-300 leading-relaxed">
              <strong>Medicare Prescription Payment Plan (M3P)</strong>을 통해 연초에 일시적으로 발생하는 고액 약값을 약국에서 한 번에 내는 대신 1년(12개월) 동안 무이자 균등 분할 납부할 수 있습니다.
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-white/8 border border-white/10">
            <h5 class="text-sm font-bold text-blue-200 mb-1.5">3. 메디케어 약값 협상 10대 약품 인하가 적용</h5>
            <p class="text-xs text-slate-300 leading-relaxed">
              연방 정부가 직접 협상한 10대 다빈도 의약품(Eliquis, Xarelto, Jardiance, Januvia, Entresto 등)의 인하된 가격이 2026년부터 본격 적용되어 본인부담금이 크게 낮아집니다.
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-white/8 border border-white/10">
            <h5 class="text-sm font-bold text-blue-200 mb-1.5">4. 인슐린 월 $35 상한 &amp; 권장 성인 백신 $0 무료</h5>
            <p class="text-xs text-slate-300 leading-relaxed">
              인슐린은 30일분 공급당 최대 $35로 제한되며, 대상포진(Shingrix), 독감, 폐렴구균, 코로나19, RSV 등 CDC 권장 백신은 코페이 없이 전액 무료로 접종받으실 수 있습니다.
            </p>
          </div>
        </div>

        <!-- Standalone Caution Note -->
        <div class="p-4 rounded-xl bg-amber-500/20 border border-amber-400/30 text-xs text-slate-200 leading-relaxed">
          <strong class="text-amber-300 block mb-1">⚠️ 단독 파트 D 플랜 선택지 축소 주의:</strong>
          올해 단독 파트 D 플랜 수가 전국 464개에서 약 360개로 감소했습니다. 본인의 복용약이 내년 플랜의 <strong>포뮬러리(약 목록)</strong>에 있는지, 몇 등급(Tier)인지, 사전 승인이 필요한지 반드시 사전에 확인하세요.
        </div>
      </section>

      <!-- ========================================================
           ILLUSTRATION 4 & FEATURE 5: ORIGINAL VS ADVANTAGE
           ======================================================== -->
      <section id="section-compare">
        <h3 class="font-serif text-xl sm:text-2xl text-slate-900 font-bold mb-2 flex items-center gap-2">
          <span style="width:10px;height:22px;background:#1a5cf6;border-radius:99px;display:inline-block;"></span>
          5. 오리지널 메디케어 vs 메디케어 어드밴티지: 실전 선택 가이드
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 mb-6">
          가장 많은 분들이 고민하는 두 가지 경로입니다. 의사결정 흐름도와 비교표를 통해 본인에게 가장 적합한 경로를 선택해 보세요.
        </p>

        <!-- Decision Flowchart Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Option A -->
          <div class="p-6 rounded-3xl bg-white border-2 border-slate-300 hover:border-blue-600 transition-all shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-900 text-white">경로 1</span>
                <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">전국 병원 자유 이용</span>
              </div>
              <h4 class="text-xl font-bold text-slate-900 mb-2">오리지널 메디케어 + 서플리먼트 (Plan G)</h4>
              <p class="text-xs text-slate-600 leading-relaxed mb-4">
                미국 전역에서 메디케어를 수용하는 모든 의사·종합병원을 사전승인 없이 자유롭게 이용할 수 있는 플랜입니다.
              </p>
              <div class="space-y-2 text-xs text-slate-700 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div class="flex items-start gap-1.5"><span class="text-emerald-600 font-bold">✓</span> <span><strong>의사/병원:</strong> 미국 전역 95%+ 의료진 네트워크 제약 없이 100% 이용</span></div>
                <div class="flex items-start gap-1.5"><span class="text-emerald-600 font-bold">✓</span> <span><strong>진료 비용:</strong> 연간 Part B 디덕터블($283) 지불 후 본인부담금 0%</span></div>
                <div class="flex items-start gap-1.5"><span class="text-slate-400 font-bold">•</span> <span><strong>월 고정비:</strong> Part B($202.90) + 서플리먼트($150~$250) + 약보험($34)</span></div>
              </div>
            </div>
            <div class="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 font-semibold">
              🎯 <strong>추천 대상:</strong> 만성질환이 있거나 암·심장 등 전문 대형병원 진료가 잦은 분, 타주 여행·체류가 많은 분
            </div>
          </div>

          <!-- Option B -->
          <div class="p-6 rounded-3xl bg-white border-2 border-indigo-300 hover:border-indigo-600 transition-all shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-700 text-white">경로 2</span>
                <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">월 $0 보험료 &amp; 생활혜택</span>
              </div>
              <h4 class="text-xl font-bold text-slate-900 mb-2">메디케어 어드밴티지 (Part C 종합)</h4>
              <p class="text-xs text-slate-600 leading-relaxed mb-4">
                민간 보험사가 파트 A·B·D를 하나로 묶고 치과, 안과, 보청기, 피트니스 등 다양한 생활 부가 혜택을 제공하는 일체형 플랜입니다.
              </p>
              <div class="space-y-2 text-xs text-slate-700 mb-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <div class="flex items-start gap-1.5"><span class="text-emerald-600 font-bold">✓</span> <span><strong>월 고정비:</strong> 추가 월 보험료 <strong>$0 플랜 다수</strong> (Part B 기본료만 지불)</span></div>
                <div class="flex items-start gap-1.5"><span class="text-emerald-600 font-bold">✓</span> <span><strong>부가 혜택:</strong> 치과 스케일링/임플란트, 안과 안경비, 보청기, OTC 카드 등 풍부</span></div>
                <div class="flex items-start gap-1.5"><span class="text-slate-400 font-bold">•</span> <span><strong>네트워크:</strong> 지정된 HMO/PPO 네트워크 내 의사 이용, 전문의 진료 시 리퍼럴 필요 가능</span></div>
              </div>
            </div>
            <div class="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-xs text-indigo-900 font-semibold">
              🎯 <strong>추천 대상:</strong> 평소 건강하며 월 고정 보험료를 절약하고 치과·안과 등 일상 편의 혜택을 원하시는 분
            </div>
          </div>
        </div>

        <!-- Comparison Table -->
        <div class="overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-xs mb-8">
          <table class="w-full text-left font-sans text-xs sm:text-sm border-collapse medicare-table">
            <thead>
              <tr class="text-white">
                <th class="p-4 w-1/5 bg-slate-800">구분</th>
                <th class="p-4 w-2/5 bg-slate-900">경로 1: 오리지널 + 서플리먼트(Medigap)</th>
                <th class="p-4 w-2/5 bg-indigo-950">경로 2: 메디케어 어드밴티지 (Part C)</th>
              </tr>
            </thead>
            <tbody class="text-slate-800 divide-y divide-slate-100">
              <tr class="hover:bg-slate-50">
                <td class="p-4 font-bold bg-slate-50">기본 구성</td>
                <td class="p-4 border-l border-slate-200">파트 A + B + 서플리먼트(Plan G 등) + 파트 D(처방약)</td>
                <td class="p-4 border-l border-slate-200">병원·외래·처방약을 묶은 민간 일체형 플랜 (HMO / PPO)</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="p-4 font-bold bg-slate-50">의사/병원 이용</td>
                <td class="p-4 border-l border-slate-200 font-semibold text-emerald-800">미국 전역 메디케어 수용 의료진 100% 이용 (사전승인/네트워크 제한 없음)</td>
                <td class="p-4 border-l border-slate-200">보험사 네트워크 내 의료진 이용 원칙, 전문의 사전 승인 필요 가능</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="p-4 font-bold bg-slate-50">추가 부가 혜택</td>
                <td class="p-4 border-l border-slate-200 text-slate-500">기본 치과, 안과, 보청기, 운동 혜택 미포함</td>
                <td class="p-4 border-l border-slate-200 font-semibold text-indigo-800">치과, 안과, 보청기, 한방/침술, OTC 카드, 피트니스 등 풍부</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="p-4 font-bold bg-slate-50">월 비용 구조</td>
                <td class="p-4 border-l border-slate-200">고정비 높음 (Part B $202.90 + 서플리먼트 + Part D), 진료 시 본인부담금 거의 없음</td>
                <td class="p-4 border-l border-slate-200">고정비 매우 저렴 (Part C $0 플랜 다수), 진료·처방 시마다 코페이 발생</td>
              </tr>
              <tr class="bg-blue-50/70">
                <td class="p-4 font-bold bg-blue-100/60">추천 대상</td>
                <td class="p-4 border-l border-slate-200 font-bold text-blue-900">만성질환자, 전문의/대형병원 진료 잦은 분, 타주 체류 많은 분</td>
                <td class="p-4 border-l border-slate-200 font-bold text-indigo-900">평소 건강하며 월 고정 지출을 아끼고 다양한 생활 부가 혜택을 원하는 분</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ========================================================
           FEATURE 6: 65세 신규 가입 & 평생 벌금 방지
           ======================================================== -->
      <section id="section-enrollment-timeline" class="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200 shadow-sm">
        <h3 class="font-serif text-xl sm:text-2xl text-slate-900 font-bold mb-2 flex items-center gap-2">
          <span style="width:10px;height:22px;background:#1a5cf6;border-radius:99px;display:inline-block;"></span>
          6. 65세 가입 기간(IEP 7개월) &amp; 평생 지연 벌금 방지 가이드
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 mb-6">
          만 65세가 되거나 직장 보험 퇴직을 앞두고 계신다면, 정해진 기한 내에 가입해야 평생 부과되는 지연 벌금을 피할 수 있습니다.
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left: Initial Enrollment Period -->
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span class="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full mb-3 inline-block">신규 가입 기간 (IEP)</span>
              <h4 class="text-lg font-bold text-slate-900 mb-2">총 7개월의 신규 가입 골든타임</h4>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                65세 생일 달을 기준으로 <strong>생일 전 3개월 + 생일 달 + 생일 후 3개월</strong>까지 총 7개월간 신청할 수 있습니다. 생일 전 3개월 안에 신청하셔야 65세가 되는 첫날부터 공백 없이 보장이 개시됩니다.
              </p>
            </div>
            <div class="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-950 space-y-1.5">
              <strong class="font-bold text-red-700 block mb-1">⚠️ 평생 지연 벌금 (Late Enrollment Penalty):</strong>
              <p>• <strong>Part B 벌금:</strong> 적격 보장 없이 가입을 지연한 매 12개월마다 기준 보험료의 <strong>10%씩 인상되어 평생 부과</strong>됩니다.</p>
              <p>• <strong>Part D 벌금:</strong> 적격 약 보장 없이 보낸 매월마다 기준 보험료의 <strong>1%가 평생 영구 가산</strong>됩니다.</p>
            </div>
          </div>

          <!-- Right: Working Past 65 (SEP) -->
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span class="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-3 inline-block">직장 보험 유지자 (SEP)</span>
              <h4 class="text-lg font-bold text-slate-900 mb-2">65세 이후에도 계속 일하고 계신가요?</h4>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                본인 또는 배우자의 현 직장에서 <strong>20인 이상 규모의 건강보험</strong>을 유지 중이라면, 65세가 되어도 파트 B 가입을 벌금 없이 연기할 수 있습니다. 퇴직 시점부터 8개월 이내에 <strong>특별 가입 기간(SEP)</strong>을 통해 벌금 없이 가입 가능합니다.
              </p>
            </div>
            <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
              <strong>핵심 확인 사항:</strong> 현재 직장 보험이 연방 규정상 <strong>'적격 보장(Creditable Coverage)'</strong>에 해당하는지 회사 인사과(HR)에 반드시 확인서를 요청해 두세요.
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================================
           ILLUSTRATION 5 & FEATURE 7: 2026 ACA (GETCOVEREDNJ) GUIDE
           ======================================================== -->
      <section id="section-aca-guide" class="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200 shadow-sm">
        <div class="max-w-3xl mb-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 mb-2">
            <span>만 19~64세 뉴저지 주민 필독 가이드</span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            7. 2026 ACA 오바마케어 (GetCoveredNJ) 완전 가이드 &amp; 보조금 혜택
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            직장 보험이 없거나 자영업·프리랜서로 일하는 만 19세부터 64세까지의 뉴저지 주민은 주정부 공식 마켓플레이스인 <strong>GetCoveredNJ</strong>를 통해 가입하며, 연방 세액공제와 뉴저지 주정부 추가 지원금(NJ HCTC)을 이중으로 지원받습니다.
          </p>
        </div>

        <!-- Custom Diagram: Income Tiers & CSR Benefits -->
        <div class="mb-8 p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-purple-50/40 border border-indigo-200">
          <h4 class="text-base font-bold text-indigo-950 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            2026 연방 빈곤선(FPL) 소득별 계단식 정부 지원 체계
          </h4>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Tier 1 -->
            <div class="bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs">
              <span class="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">FPL 138% 이하</span>
              <h5 class="text-sm font-bold text-slate-900 mt-2 mb-1">NJ FamilyCare (메디케이드)</h5>
              <div class="text-xs text-slate-600 leading-relaxed">
                월 보험료 <strong>$0 전액 무료</strong>. 연중 언제나 등록 가능하며 디덕터블과 코페이 없이 포괄적인 의료 혜택 제공.
              </div>
            </div>

            <!-- Tier 2 (Highlight: Silver CSR) -->
            <div class="bg-white p-4 rounded-xl border-2 border-indigo-500 shadow-xs relative">
              <span class="absolute -top-2.5 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-600 text-white">가장 추천</span>
              <span class="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">FPL 138% ~ 250%</span>
              <h5 class="text-sm font-bold text-slate-900 mt-2 mb-1">실버 플랜 CSR (비용분담 할인)</h5>
              <div class="text-xs text-slate-600 leading-relaxed">
                디덕터블이 $0~$200대로 획기적으로 낮아지며 주정부 NJ HCTC 보조금으로 <strong>월 $10~$30대</strong>에 프리미엄 보장 가입.
              </div>
            </div>

            <!-- Tier 3 -->
            <div class="bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs">
              <span class="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">FPL 250% ~ 400%+</span>
              <h5 class="text-sm font-bold text-slate-900 mt-2 mb-1">프리미엄 세액공제 (APTC)</h5>
              <div class="text-xs text-slate-600 leading-relaxed">
                연방 정부 지원으로 월 보험료가 가구 소득의 <strong>최대 8.5%를 넘지 않도록 상한 보장</strong>.
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-indigo-200/60 text-xs text-indigo-900 flex items-center justify-between flex-wrap gap-2">
            <span>📌 <strong>뉴저지 의무가입 조항:</strong> 뉴저지는 건강보험 미가입 시 주 세금 보고 시 벌금(Individual Mandate Penalty)이 부과됩니다.</span>
            <span class="font-bold text-indigo-700">오픈 인롤먼트: 11월 1일 ~ 1월 31일</span>
          </div>
        </div>

        <!-- 4 Metal Tiers Guide -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
            <span class="text-xs font-extrabold text-amber-900">브론즈 (Bronze)</span>
            <p class="text-xs text-slate-600 mt-1">월 보험료가 가장 저렴하지만 디덕터블이 높음. 만약을 대비한 건강한 분께 적합.</p>
          </div>
          <div class="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-300">
            <span class="text-xs font-extrabold text-indigo-900">실버 (Silver) ★ 추천</span>
            <p class="text-xs text-slate-600 mt-1">정부 추가 보조금(CSR)이 유일하게 적용되는 등급. 코페이·디덕터블 혜택 극대화.</p>
          </div>
          <div class="p-4 rounded-2xl bg-yellow-50/70 border border-yellow-200">
            <span class="text-xs font-extrabold text-yellow-900">골드 (Gold)</span>
            <p class="text-xs text-slate-600 mt-1">월 보험료는 다소 높으나 디덕터블이 낮고 정기적인 진료가 많은 분께 유리.</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span class="text-xs font-extrabold text-slate-800">플래티넘 (Platinum)</span>
            <p class="text-xs text-slate-600 mt-1">월 보험료가 가장 높고 진료 시 본인부담금이 거의 없음. 수술·중증 질환자용.</p>
          </div>
        </div>
      </section>

      <!-- ========================================================
           FEATURE 8: NJ SENIOR SUPPORT (MSP, PAAD, SENIOR GOLD)
           ======================================================== -->
      <section id="section-senior-support" class="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200 shadow-sm">
        <h3 class="font-serif text-xl sm:text-2xl text-slate-900 font-bold mb-2 flex items-center gap-2">
          <span style="width:10px;height:22px;background:#1a5cf6;border-radius:99px;display:inline-block;"></span>
          8. 뉴저지 시니어 주정부 3대 특별 지원 (MSP, PAAD, Senior Gold)
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 mb-6">
          메디케이드 자격 기준을 살짝 초과하는 한인 어르신을 위해 뉴저지 주정부가 운영하는 대표적인 3대 의료비 지원 제도입니다.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <!-- 1. MSP -->
          <div class="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 flex flex-col justify-between">
            <div>
              <span class="text-xs font-extrabold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded mb-2 inline-block">보험료 전액 대납</span>
              <h4 class="text-base font-bold text-slate-900 mb-2">1. 메디케어 저축 프로그램 (MSP)</h4>
              <p class="text-xs text-slate-600 leading-relaxed mb-4">
                뉴저지 주정부가 파트 B 표준 월 보험료(2026년 <strong>월 $202.90</strong>, 연간 약 $2,435)를 전액 대신 납부해 드립니다.
              </p>
            </div>
            <div class="pt-3 border-t border-blue-200 text-xs text-blue-900 font-semibold">
              소득 기준: 1인 월 약 $1,750 / 부부 약 $2,370 이하
            </div>
          </div>

          <!-- 2. PAAD -->
          <div class="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 flex flex-col justify-between">
            <div>
              <span class="text-xs font-extrabold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded mb-2 inline-block">처방약값 획기적 절감</span>
              <h4 class="text-base font-bold text-slate-900 mb-2">2. PAAD 처방약 지원</h4>
              <p class="text-xs text-slate-600 leading-relaxed mb-4">
                뉴저지 거주 65세 이상 어르신에게 제네릭 약 <strong>$5</strong>, 브랜드 약 <strong>$7 고정가</strong>로 공급하며 파트 D 보험료도 지원합니다.
              </p>
            </div>
            <div class="pt-3 border-t border-purple-200 text-xs text-purple-900 font-semibold">
              소득 기준: 1인 연소득 $54,936 / 부부 $62,711 이하
            </div>
          </div>

          <!-- 3. Senior Gold -->
          <div class="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col justify-between">
            <div>
              <span class="text-xs font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded mb-2 inline-block">약값 50% 할인</span>
              <h4 class="text-base font-bold text-slate-900 mb-2">3. 시니어 골드 (Senior Gold)</h4>
              <p class="text-xs text-slate-600 leading-relaxed mb-4">
                PAAD 소득 기준을 $10,000 초과하는 분들을 위한 제도로, 기본 코페이 $15 지불 후 나머지 약값의 50%를 주정부가 지원합니다.
              </p>
            </div>
            <div class="pt-3 border-t border-amber-200 text-xs text-amber-900 font-semibold">
              소득 기준: 1인 연소득 $64,936 / 부부 $72,711 이하
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================================
           FEATURE 9: INTERACTIVE FAQ (ACCORDION)
           ======================================================== -->
      <section id="section-medicare-faq" class="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200 shadow-sm">
        <h3 class="font-serif text-xl sm:text-2xl text-slate-900 font-bold mb-2 flex items-center gap-2">
          <span style="width:10px;height:22px;background:#1a5cf6;border-radius:99px;display:inline-block;"></span>
          9. 뉴저지 한인이 가장 많이 묻는 메디케어 &amp; ACA 자주 묻는 질문 (FAQ)
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 mb-6">
          실제 상담 과정에서 가장 많이 묻는 8대 질문과 명쾌한 실전 답변을 정리했습니다. 항목을 클릭하면 답변이 열립니다.
        </p>

        <div class="space-y-3">
          <!-- FAQ 1 -->
          <details class="clean-details group rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition-all">
            <summary class="flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 cursor-pointer list-none">
              <span>Q1. 오리지널 메디케어와 메디케어 어드밴티지 중 저에게 무엇이 더 맞을까요?</span>
              <span class="text-blue-600 font-bold text-xl group-open:rotate-45 transition-transform">+</span>
            </summary>
            <div class="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-200/60 pt-3">
              만성질환이 있거나 뉴욕 대형병원(컬럼비아, 코넬 등) 및 전문의 진료가 잦고 타주 이동이 많으시다면 사전승인과 네트워크 제약이 없는 <strong>오리지널 메디케어 + 서플리먼트(Plan G)</strong>가 안전합니다. 반면, 평소 건강하시고 월 고정 보험료를 아끼면서 치과, 안과, 보청기, 한방, OTC 카드 등 실생활 부가 혜택을 원하신다면 <strong>메디케어 어드밴티지($0 플랜)</strong>가 유리합니다.
            </div>
          </details>

          <!-- FAQ 2 -->
          <details class="clean-details group rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition-all">
            <summary class="flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 cursor-pointer list-none">
              <span>Q2. 2026년 파트 D $2,100 상한제는 어떻게 적용되며 신청해야 하나요?</span>
              <span class="text-blue-600 font-bold text-xl group-open:rotate-45 transition-transform">+</span>
            </summary>
            <div class="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-200/60 pt-3">
              별도로 신청할 필요 없이 파트 D 또는 어드밴티지 가입자에게 <strong>자동 적용</strong>됩니다. 연간 디덕터블과 처방약 코페이의 누적 합계가 $2,100에 도달하면 보험사 전산에서 자동으로 이후 약값 코페이를 $0으로 전환합니다. 단, 월 보험료는 상한에 포함되지 않으며 포뮬러리에 등재된 보장 약품에만 적용됩니다.
            </div>
          </details>

          <!-- FAQ 3 -->
          <details class="clean-details group rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition-all">
            <summary class="flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 cursor-pointer list-none">
              <span>Q3. 65세가 되었는데 직장 건강보험이 있습니다. 메디케어에 꼭 가입해야 하나요?</span>
              <span class="text-blue-600 font-bold text-xl group-open:rotate-45 transition-transform">+</span>
            </summary>
            <div class="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-200/60 pt-3">
              직장 규모가 <strong>20인 이상</strong>이고 적격 보장(Creditable Coverage)에 해당한다면 파트 B 가입을 지연 벌금 없이 연기할 수 있습니다. 10년 이상 세금을 납부한 분은 무료인 파트 A만 먼저 신청하고 파트 B는 퇴직 시점에 특별가입기간(SEP)으로 신청하시면 됩니다. 반면 20인 미만 소규모 직장이라면 메디케어가 1차 보험이 되므로 65세에 반드시 파트 B를 신청해야 벌금을 피할 수 있습니다.
            </div>
          </details>

          <!-- FAQ 4 -->
          <details class="clean-details group rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition-all">
            <summary class="flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 cursor-pointer list-none">
              <span>Q4. 메디케어 지연 벌금은 얼마나 되며, 평생 내야 하나요?</span>
              <span class="text-blue-600 font-bold text-xl group-open:rotate-45 transition-transform">+</span>
            </summary>
            <div class="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-200/60 pt-3">
              네, 지연 벌금은 <strong>평생 보험료에 가산</strong>됩니다. 파트 B는 가입 자격이 있었는데 미가입한 매 12개월 단위마다 표준 보험료의 10%가 영구 가산됩니다(2년 지연 시 20% 평생 가산). 파트 D 역시 적격 약 보장 없이 보낸 매월마다 기준 보험료의 1%가 평생 가산되므로 기한을 놓치지 않는 것이 무엇보다 중요합니다.
            </div>
          </details>

          <!-- FAQ 5 -->
          <details class="clean-details group rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition-all">
            <summary class="flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 cursor-pointer list-none">
              <span>Q5. 저소득층을 위한 뉴저지 의료비 지원 프로그램은 어떤 것이 있나요?</span>
              <span class="text-blue-600 font-bold text-xl group-open:rotate-45 transition-transform">+</span>
            </summary>
            <div class="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-200/60 pt-3">
              파트 B 월 보험료 $202.90을 주정부가 대납하는 <strong>MSP</strong>, 처방약값을 $5/$7로 낮춰주는 <strong>PAAD</strong>, 약값 50%를 할인해 주는 <strong>Senior Gold</strong>, 그리고 연방 저소득층 약값 보조 프로그램인 <strong>Extra Help (LIS)</strong>가 있습니다. NJAP 자격 계산기 탭에서 본인의 수혜 자격을 즉시 확인하실 수 있습니다.
            </div>
          </details>

          <!-- FAQ 6 -->
          <details class="clean-details group rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition-all">
            <summary class="flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 cursor-pointer list-none">
              <span>Q6. ACA 오바마케어 가입 시 왜 실버(Silver) 플랜을 가장 추천하나요?</span>
              <span class="text-blue-600 font-bold text-xl group-open:rotate-45 transition-transform">+</span>
            </summary>
            <div class="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-200/60 pt-3">
              연방 빈곤선(FPL) 250% 이하 가구의 경우, <strong>오직 실버 플랜에만 특별 비용분담 할인(CSR)</strong>이 적용되기 때문입니다. CSR이 적용되면 골드나 플래티넘 수준으로 디덕터블과 의사 방문 코페이가 대폭 낮아지며, 주정부 추가 보조금(NJ HCTC)까지 합산되어 가장 저렴한 비용으로 최상의 의료 보장을 받을 수 있습니다.
            </div>
          </details>

          <!-- FAQ 7 -->
          <details class="clean-details group rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition-all">
            <summary class="flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 cursor-pointer list-none">
              <span>Q7. ACA 오바마케어를 이용하다 만 65세가 되면 어떻게 전환하나요?</span>
              <span class="text-blue-600 font-bold text-xl group-open:rotate-45 transition-transform">+</span>
            </summary>
            <div class="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-200/60 pt-3">
              65세 생일 3개월 전에 사회보장국(SSA)을 통해 메디케어 파트 A·B를 신청하시고, 메디케어 보장이 시작되는 날짜에 맞춰 GetCoveredNJ 웹사이트나 고객센터를 통해 기존 오바마케어 플랜을 <strong>직접 해지(Cancel)</strong>해야 합니다. 메디케어 수혜 자격이 생기면 ACA 세액공제 자격이 자동으로 상실되므로 해지하지 않으면 나중에 보조금을 세금 보고 시 국세청에 반환해야 할 수 있습니다.
            </div>
          </details>

          <!-- FAQ 8 -->
          <details class="clean-details group rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition-all">
            <summary class="flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 cursor-pointer list-none">
              <span>Q8. 뉴저지 주는 건강보험이 없으면 세금 벌금을 내야 하나요?</span>
              <span class="text-blue-600 font-bold text-xl group-open:rotate-45 transition-transform">+</span>
            </summary>
            <div class="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-200/60 pt-3">
              네, 뉴저지 주는 주법에 따라 개인 의무가입 조항(New Jersey Individual Mandate)을 시행하고 있습니다. 연중 정당한 면제 사유 없이 건강보험에 가입하지 않은 주민은 뉴저지 주 소득세 신고 시 성인 1인당 최소 수백 달러 이상의 세금 패널티가 부과됩니다. 소득이 낮다면 NJ FamilyCare나 보조금을 통해 거의 무료로 가입할 수 있으므로 반드시 보험을 유지하셔야 합니다.
            </div>
          </details>
        </div>
      </section>

      <!-- ========================================================
           1:1 FREE CONSULTATION BANNER
           ======================================================== -->
      <section class="medicare-dark-banner p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-800">
        <div>
          <span class="text-xs font-bold text-blue-300 bg-white/10 px-3 py-1 rounded-full border border-white/15 mb-2 inline-block">100% 무료 비영리 지원 서비스</span>
          <h4 class="text-xl sm:text-2xl font-serif font-bold text-white mb-2">어려운 메디케어 &amp; ACA, 한국어로 편안하게 상담받으세요</h4>
          <p class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            뉴저지 의료접근포털(NJAP)은 한인 동포 어르신과 가족분들의 의료비 절감과 최적의 플랜 선택을 위해 1:1 맞춤 비교 상담을 무료로 제공합니다. 복용 중인 약 목록과 주치의를 알려주시면 가장 유리한 플랜을 찾아드립니다.
          </p>
        </div>
        <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="shrink-0 px-6 py-3.5 rounded-2xl bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-extrabold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
          <img src="/kakaotalk-icon.png" alt="KakaoTalk" class="w-5 h-5 rounded shrink-0 object-contain" />
          <span>카카오톡 1:1 맞춤 무료 상담</span>
        </a>
      </section>

    </div>
  `;
}

module.exports = { generateMedicareAcaHtml };
