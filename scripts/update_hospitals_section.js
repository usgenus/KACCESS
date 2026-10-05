const fs = require('fs');
const path = require('path');

const newHospitalSectionHtml = `            <!-- Filter Tabs -->
            <div class="flex flex-wrap items-center gap-2 mb-8" id="hospital-filter-bar">
              <button type="button" onclick="filterHospitalList('all', this)" class="hospital-filter-btn active px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all border border-blue-600 bg-blue-600 text-white shadow-xs">
                전체 종합병원 (8)
              </button>
              <button type="button" onclick="filterHospitalList('bergen', this)" class="hospital-filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                버겐 카운티 &amp; 인접 거점
              </button>
              <button type="button" onclick="filterHospitalList('korean_program', this)" class="hospital-filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                한인 특화 프로그램 &amp; 통역 지원
              </button>
              <button type="button" onclick="filterHospitalList('senior_rehab', this)" class="hospital-filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                시니어 너싱홈 &amp; 재활 특화
              </button>
              <button type="button" onclick="filterHospitalList('tertiary', this)" class="hospital-filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                3차 상급종합병원 (HUMC · RWJ)
              </button>
            </div>

            <!-- 8 Major Hospitals Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="hospital-cards-grid">

              <!-- 1. Englewood Health (잉글우드 병원) -->
              <div class="hospital-card border border-slate-200/90 rounded-2xl bg-white p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group" data-category="bergen korean_program">
                <div>
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-100 text-blue-900 border border-blue-200">
                      <i class="fa-solid fa-location-dot text-blue-600"></i>
                      <span>버겐 카운티 · 포트리/팰팍 인근</span>
                    </span>
                    <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      안전성 A등급
                    </span>
                  </div>

                  <div class="flex items-center gap-3.5 mb-4">
                    <div class="w-20 sm:w-24 h-12 rounded-xl bg-white flex items-center justify-center px-2 py-1 shrink-0 group-hover:scale-105 transition-all shadow-xs border border-slate-200/90 overflow-hidden">
                      <img src="/uploads/images/hospitals/englewood-health.svg" alt="Englewood Health 공식 로고" class="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <h3 class="font-black text-lg sm:text-xl text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight leading-snug">
                        Englewood Health
                      </h3>
                      <p class="text-xs sm:text-sm font-bold text-slate-500">잉글우드 병원</p>
                    </div>
                  </div>

                  <!-- Short-form Local SEO Info Box -->
                  <div class="space-y-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100 mb-4">
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 한인 환자 내방 안내</strong>
                      <span>포트리, 팰리세이즈파크 등 한인 밀집 지역과 10분 거리의 대표 종합병원으로 버겐 카운티 최초로 <strong>‘한인 의료 프로그램(Korean Healthcare Program)’</strong>을 전담 운영합니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 언어 및 통역 지원 정보</strong>
                      <span>한국어 상주 코디네이터 통역 동행, 입원 환자 한국식 식단 제공, 24시간 응급실(ER) 한인 전담 안내 체계를 완비했습니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 전문의 및 주요 센터 연계</strong>
                      <span>레슬리 사이먼 유방암 검진 센터, 심혈관 중재술 센터 및 잉글우드 헬스 전문의 네트워크와 유기적으로 직결 연계됩니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 건강보험 및 자선진료</strong>
                      <span>메디케어, 메디케이드, ACA 오바마케어 및 무보험 환자를 위한 주정부 자선 진료(Charity Care) 지원.</span>
                    </div>
                  </div>

                  <!-- Hashtags -->
                  <div class="flex flex-wrap gap-1.5 mb-4">
                    <a href="/forum?specialty=hospital_reviews&q=Englewood&view=topics" class="px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors">#잉글우드병원</a>
                    <a href="/forum?specialty=hospital_reviews&q=한인의료프로그램&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#한인의료프로그램</a>
                    <a href="/forum?specialty=hospital_reviews&q=통역&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#한국어통역상주</a>
                    <a href="/forum?specialty=hospital_reviews&q=자선진료&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#자선진료</a>
                  </div>

                  <!-- Contact Details -->
                  <div class="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 mb-4">
                    <div class="flex items-center gap-1.5">
                      <i class="fa-solid fa-phone text-slate-400 text-[11px]"></i>
                      <span>대표: <a href="tel:2018943000" class="font-bold text-slate-800 hover:text-blue-600">(201) 894-3000</a></span>
                      <span class="mx-1 text-slate-300">|</span>
                      <span>한인 핫라인: <a href="tel:2016082346" class="font-bold text-blue-600 hover:underline">(201) 608-2346</a></span>
                    </div>
                    <div class="flex items-start gap-1.5">
                      <i class="fa-solid fa-map-pin text-slate-400 text-[11px] mt-0.5"></i>
                      <span>350 Engle St, Englewood, NJ 07631</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a href="https://www.englewoodhealth.org" target="_blank" rel="noopener noreferrer" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
                    <span>공식 웹사이트</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                  <a href="/forum?specialty=hospital_reviews&q=Englewood&view=topics" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs transition-colors">
                    <i class="fa-regular fa-comment-dots text-xs"></i>
                    <span>후기 &amp; 질문</span>
                  </a>
                </div>
              </div>

              <!-- 2. Holy Name Medical Center (홀리네임 병원) -->
              <div class="hospital-card border border-slate-200/90 rounded-2xl bg-white p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group" data-category="bergen korean_program senior_rehab">
                <div>
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-200">
                      <i class="fa-solid fa-heart-pulse text-emerald-600"></i>
                      <span>버겐 카운티 · 티넥 (팰팍/포트리 인접)</span>
                    </span>
                    <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      코리안 메디컬(KMP)
                    </span>
                  </div>

                  <div class="flex items-center gap-3.5 mb-4">
                    <div class="w-20 sm:w-24 h-12 rounded-xl bg-white flex items-center justify-center px-2 py-1 shrink-0 group-hover:scale-105 transition-all shadow-xs border border-slate-200/90 overflow-hidden">
                      <img src="/uploads/images/hospitals/holy-name.png" alt="Holy Name Medical Center 공식 로고" class="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <h3 class="font-black text-lg sm:text-xl text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight leading-snug">
                        Holy Name Medical Center
                      </h3>
                      <p class="text-xs sm:text-sm font-bold text-slate-500">홀리네임 병원 · 의료원</p>
                    </div>
                  </div>

                  <!-- Short-form Local SEO Info Box -->
                  <div class="space-y-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100 mb-4">
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 한인 환자 내방 안내</strong>
                      <span>미 동부 최초·최대 규모의 <strong>‘코리안 메디컬 프로그램(KMP)’</strong>을 창설하여 한인 동포들에게 가장 친숙하고 신뢰받는 버겐 카운티 중심 병원입니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 언어 및 통역 지원 정보</strong>
                      <span>24시간 한국어 핫라인 상시 가동, 외래·입원 전담 한국어 코디네이터 1:1 동행 통역, 입원 환자를 위한 매일 한국식 영양 식단 제공.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 전문의 및 주요 센터 연계</strong>
                      <span>아시안 간질환 센터, 심혈관 중재술 센터, 유방암 검진 센터, 한인 1차 진료 내과 주치의 및 각 분과 한인 전문의 네트워크 완비.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 건강보험 및 자선진료</strong>
                      <span>메디케어, 메디케이드, ACA 오바마케어 및 무보험 동포를 위한 뉴저지 자선 진료(Charity Care), 연례 대규모 무료 건강검진 페스티벌 운영.</span>
                    </div>
                  </div>

                  <!-- Hashtags -->
                  <div class="flex flex-wrap gap-1.5 mb-4">
                    <a href="/forum?specialty=hospital_reviews&q=HolyName&view=topics" class="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition-colors">#홀리네임병원</a>
                    <a href="/forum?specialty=hospital_reviews&q=KMP&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#코리안메디컬프로그램</a>
                    <a href="/forum?specialty=hospital_reviews&q=통역&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#한국어통역상주</a>
                    <a href="/forum?specialty=hospital_reviews&q=자선진료&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#자선진료</a>
                  </div>

                  <!-- Contact Details -->
                  <div class="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 mb-4">
                    <div class="flex items-center gap-1.5">
                      <i class="fa-solid fa-phone text-slate-400 text-[11px]"></i>
                      <span>대표: <a href="tel:2018333000" class="font-bold text-slate-800 hover:text-emerald-700">(201) 833-3000</a></span>
                      <span class="mx-1 text-slate-300">|</span>
                      <span>한인 핫라인: <a href="tel:2018333399" class="font-bold text-emerald-700 hover:underline">(201) 833-3399</a></span>
                    </div>
                    <div class="flex items-start gap-1.5">
                      <i class="fa-solid fa-map-pin text-slate-400 text-[11px] mt-0.5"></i>
                      <span>718 Teaneck Rd, Teaneck, NJ 07666 (팰팍 5분)</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a href="https://www.holyname.org" target="_blank" rel="noopener noreferrer" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
                    <span>공식 웹사이트</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                  <a href="/forum?specialty=hospital_reviews&q=HolyName&view=topics" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs transition-colors">
                    <i class="fa-regular fa-comment-dots text-xs"></i>
                    <span>후기 &amp; 질문</span>
                  </a>
                </div>
              </div>

              <!-- 3. Hackensack Meridian Health / Hackensack University Medical Center -->
              <div class="hospital-card border border-slate-200/90 rounded-2xl bg-white p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group" data-category="tertiary bergen korean_program">
                <div>
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-indigo-100 text-indigo-900 border border-indigo-200">
                      <i class="fa-solid fa-award text-indigo-600"></i>
                      <span>U.S. News 뉴저지 #1 상급종합병원</span>
                    </span>
                    <span class="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      3차 거점 병원
                    </span>
                  </div>

                  <div class="flex items-center gap-3.5 mb-4">
                    <div class="w-20 sm:w-24 h-12 rounded-xl bg-white flex items-center justify-center px-2 py-1 shrink-0 group-hover:scale-105 transition-all shadow-xs border border-slate-200/90 overflow-hidden">
                      <img src="/uploads/images/hospitals/hackensack-meridian.svg" alt="Hackensack Meridian Health 공식 로고" class="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <h3 class="font-black text-lg sm:text-xl text-slate-900 group-hover:text-indigo-700 transition-colors tracking-tight leading-snug">
                        Hackensack Meridian Health
                      </h3>
                      <p class="text-xs sm:text-sm font-bold text-slate-500">해켄색 대학병원 (HUMC)</p>
                    </div>
                  </div>

                  <!-- Short-form Local SEO Info Box -->
                  <div class="space-y-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100 mb-4">
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 한인 환자 내방 안내</strong>
                      <span>뉴저지 최대 규모 헬스케어 시스템의 플래그십 상급 종합병원으로 중증 질환, 수술, 암 치료 시 한인 동포들이 가장 신뢰하고 찾는 3차 병원입니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 언어 및 통역 지원 정보</strong>
                      <span>24시간 공인 의료 통역사 상주 및 고화질 실시간 비디오 통역(VRI), 다문화 환자 지원팀(Patient Access) 상시 가동.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 전문의 및 주요 센터 연계</strong>
                      <span>세계적 명성의 <strong>존 더러 암센터(John Theurer Cancer Center)</strong>, 심장혈관 연구소, 헬렌 F. 그레이엄 소아전문병원, 레벨 1 외상센터 완비.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 건강보험 및 자선진료</strong>
                      <span>뉴저지 주정부 자선 진료(Charity Care), 재정 상담 지원 및 취약계층 분할 납부 프로그램 운영.</span>
                    </div>
                  </div>

                  <!-- Hashtags -->
                  <div class="flex flex-wrap gap-1.5 mb-4">
                    <a href="/forum?specialty=hospital_reviews&q=Hackensack&view=topics" class="px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-[11px] transition-colors">#해켄색대학병원</a>
                    <a href="/forum?specialty=hospital_reviews&q=HUMC&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#HUMC</a>
                    <a href="/forum?specialty=hospital_reviews&q=존더러암센터&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#존더러암센터</a>
                    <a href="/forum?specialty=hospital_reviews&q=24시간통역&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#24시간한국어통역</a>
                  </div>

                  <!-- Contact Details -->
                  <div class="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 mb-4">
                    <div class="flex items-center gap-1.5">
                      <i class="fa-solid fa-phone text-slate-400 text-[11px]"></i>
                      <span>대표: <a href="tel:5519962000" class="font-bold text-slate-800 hover:text-indigo-600">(551) 996-2000</a></span>
                      <span class="mx-1 text-slate-300">|</span>
                      <span>진료예약: <a href="tel:8444649355" class="font-bold text-indigo-700 hover:underline">(844) 464-9355</a></span>
                    </div>
                    <div class="flex items-start gap-1.5">
                      <i class="fa-solid fa-map-pin text-slate-400 text-[11px] mt-0.5"></i>
                      <span>30 Prospect Ave, Hackensack, NJ 07601</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a href="https://www.hackensackmeridianhealth.org" target="_blank" rel="noopener noreferrer" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
                    <span>공식 웹사이트</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                  <a href="/forum?specialty=hospital_reviews&q=Hackensack&view=topics" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-extrabold text-xs transition-colors">
                    <i class="fa-regular fa-comment-dots text-xs"></i>
                    <span>후기 &amp; 질문</span>
                  </a>
                </div>
              </div>

              <!-- 4. The Valley Hospital (밸리 병원) -->
              <div class="hospital-card border border-slate-200/90 rounded-2xl bg-white p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group" data-category="bergen korean_program">
                <div>
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-sky-100 text-sky-900 border border-sky-200">
                      <i class="fa-solid fa-star text-sky-600"></i>
                      <span>패러머스 최첨단 스마트 신축 병원</span>
                    </span>
                    <span class="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      전 병실 1인실
                    </span>
                  </div>

                  <div class="flex items-center gap-3.5 mb-4">
                    <div class="w-20 sm:w-24 h-12 rounded-xl bg-white flex items-center justify-center px-2 py-1 shrink-0 group-hover:scale-105 transition-all shadow-xs border border-slate-200/90 overflow-hidden">
                      <img src="/uploads/images/hospitals/valley-health.png" alt="The Valley Hospital 공식 로고" class="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <h3 class="font-black text-lg sm:text-xl text-slate-900 group-hover:text-sky-600 transition-colors tracking-tight leading-snug">
                        The Valley Hospital
                      </h3>
                      <p class="text-xs sm:text-sm font-bold text-slate-500">밸리 병원 (Valley Health System)</p>
                    </div>
                  </div>

                  <!-- Short-form Local SEO Info Box -->
                  <div class="space-y-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100 mb-4">
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 한인 환자 내방 안내</strong>
                      <span>버겐 카운티 패러머스(Paramus)에 8억 달러 규모로 최첨단 신축 이전한 프리미엄 스마트 병원으로 루트 17/4 번 고속도로와 인접하여 내방이 편리합니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 언어 및 통역 지원 정보</strong>
                      <span>한인 환자를 위한 다국어 의료 통역 지원 및 전문 네비게이터 팀 상주, 입원 시 프라이버시가 100% 보장되는 <strong>전 병실 1인 단독실</strong> 운영.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 전문의 및 주요 센터 연계</strong>
                      <span>최신 다빈치 로봇 수술 센터, 심장혈관 중환자실(ICU), 여성 산부인과 특화 센터, 종합 암 케어 및 클리블랜드 클리닉 심혈관 얼라이언스.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 건강보험 및 자선진료</strong>
                      <span>메디케어, 메디케이드, ACA 마켓플레이스 보험 인-네트워크 및 병원비 재정 지원 프로그램 운영.</span>
                    </div>
                  </div>

                  <!-- Hashtags -->
                  <div class="flex flex-wrap gap-1.5 mb-4">
                    <a href="/forum?specialty=hospital_reviews&q=Valley&view=topics" class="px-2 py-0.5 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-[11px] transition-colors">#밸리병원</a>
                    <a href="/forum?specialty=hospital_reviews&q=TheValleyHospital&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#TheValleyHospital</a>
                    <a href="/forum?specialty=hospital_reviews&q=패러머스신축&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#패러머스신축</a>
                    <a href="/forum?specialty=hospital_reviews&q=1인실&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#전병실1인실</a>
                  </div>

                  <!-- Contact Details -->
                  <div class="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 mb-4">
                    <div class="flex items-center gap-1.5">
                      <i class="fa-solid fa-phone text-slate-400 text-[11px]"></i>
                      <span>대표: <a href="tel:2014478000" class="font-bold text-slate-800 hover:text-sky-600">(201) 447-8000</a></span>
                      <span class="mx-1 text-slate-300">|</span>
                      <span>환자 안내: <a href="tel:8008255391" class="font-bold text-sky-700 hover:underline">(800) 825-5391</a></span>
                    </div>
                    <div class="flex items-start gap-1.5">
                      <i class="fa-solid fa-map-pin text-slate-400 text-[11px] mt-0.5"></i>
                      <span>4 Valley Health Plaza, Paramus, NJ 07652</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a href="https://www.valleyhealth.com" target="_blank" rel="noopener noreferrer" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
                    <span>공식 웹사이트</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                  <a href="/forum?specialty=hospital_reviews&q=Valley&view=topics" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-extrabold text-xs transition-colors">
                    <i class="fa-regular fa-comment-dots text-xs"></i>
                    <span>후기 &amp; 질문</span>
                  </a>
                </div>
              </div>

              <!-- 5. Bergen New Bridge Medical Center (버겐 뉴 브릿지 메디컬 센터 · 구 Bergen Regional) -->
              <div class="hospital-card border border-slate-200/90 rounded-2xl bg-white p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group" data-category="bergen senior_rehab">
                <div>
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-cyan-100 text-cyan-900 border border-cyan-200">
                      <i class="fa-solid fa-hospital-user text-cyan-700"></i>
                      <span>버겐 카운티 · 패러머스 (Paramus)</span>
                    </span>
                    <span class="text-[11px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      570+ 병상 너싱홈 &amp; 정신건강
                    </span>
                  </div>

                  <div class="flex items-center gap-3.5 mb-4">
                    <div class="w-20 sm:w-24 h-12 rounded-xl bg-white flex items-center justify-center px-2 py-1 shrink-0 group-hover:scale-105 transition-all shadow-xs border border-slate-200/90 overflow-hidden">
                      <img src="/uploads/images/hospitals/bergen-new-bridge.svg" alt="Bergen New Bridge Medical Center 공식 로고" class="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <h3 class="font-black text-lg sm:text-xl text-slate-900 group-hover:text-cyan-700 transition-colors tracking-tight leading-snug">
                        Bergen New Bridge
                      </h3>
                      <p class="text-xs sm:text-sm font-bold text-slate-500">버겐 뉴 브릿지 메디컬 센터 (구 Bergen Regional)</p>
                    </div>
                  </div>

                  <!-- Short-form Local SEO Info Box -->
                  <div class="space-y-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100 mb-4">
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 한인 환자 내방 안내</strong>
                      <span>뉴저지 최대 규모 종합의료기관(1,000+ 병상)이자 럿거스(Rutgers) 뉴저지 의대 제휴 공공병원으로, 버겐 카운티 한인 주민들에게는 <strong>‘버겐 리저널(Bergen Regional)’</strong>로 널리 알려진 친숙한 거점 병원입니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 시니어 너싱홈 &amp; 급성기 재활</strong>
                      <span>뉴저지 최대 <strong>570여 병상 규모의 시니어 장기 요양원(Long Term Care 너싱홈)</strong> 및 뇌졸중·골절 회복을 위한 급성기 재활(Subacute Rehab) 병동을 운영하여 메디케이드 수혜 어르신들이 가장 많이 입원·입소합니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 전문의 및 주요 센터 연계</strong>
                      <span>북부 뉴저지 최대의 <strong>정신건강 및 심리치료(Behavioral Health) 전문 센터</strong>, 성인 외래 진료 센터, 최첨단 다빈치 5 로봇 수술 및 당일 외래 검진 체계 완비.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 건강보험 및 자선진료</strong>
                      <span>메디케어, 메디케이드, 카운티 비영리 공공 <strong>자선 진료(Charity Care)</strong>를 가장 폭넓게 지원하여 무보험자 및 저소득층 의료비 부담을 최소화합니다.</span>
                    </div>
                  </div>

                  <!-- Hashtags -->
                  <div class="flex flex-wrap gap-1.5 mb-4">
                    <a href="/forum?specialty=hospital_reviews&q=BergenNewBridge&view=topics" class="px-2 py-0.5 rounded-md bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-[11px] transition-colors">#버겐뉴브릿지</a>
                    <a href="/forum?specialty=hospital_reviews&q=구버겐리저널&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#구버겐리저널</a>
                    <a href="/forum?specialty=hospital_reviews&q=시니어너싱홈&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#시니어너싱홈</a>
                    <a href="/forum?specialty=hospital_reviews&q=정신건강&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#정신건강치료</a>
                  </div>

                  <!-- Contact Details -->
                  <div class="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 mb-4">
                    <div class="flex items-center gap-1.5">
                      <i class="fa-solid fa-phone text-slate-400 text-[11px]"></i>
                      <span>대표: <a href="tel:2019674000" class="font-bold text-slate-800 hover:text-cyan-700">(201) 967-4000</a></span>
                      <span class="mx-1 text-slate-300">|</span>
                      <span>너싱홈/입소: <a href="tel:2019674073" class="font-bold text-cyan-700 hover:underline">(201) 967-4073</a></span>
                    </div>
                    <div class="flex items-start gap-1.5">
                      <i class="fa-solid fa-map-pin text-slate-400 text-[11px] mt-0.5"></i>
                      <span>230 E Ridgewood Ave, Paramus, NJ 07652</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a href="https://www.newbridgehealth.org" target="_blank" rel="noopener noreferrer" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
                    <span>공식 웹사이트</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                  <a href="/forum?specialty=hospital_reviews&q=BergenNewBridge&view=topics" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-extrabold text-xs transition-colors">
                    <i class="fa-regular fa-comment-dots text-xs"></i>
                    <span>후기 &amp; 질문</span>
                  </a>
                </div>
              </div>

              <!-- 6. Palisades Medical Center (팰리세이즈 메디컬 센터 · HMH) -->
              <div class="hospital-card border border-slate-200/90 rounded-2xl bg-white p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group" data-category="bergen korean_program">
                <div>
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-100 text-blue-900 border border-blue-200">
                      <i class="fa-solid fa-water text-blue-600"></i>
                      <span>허드슨 강변 · 에지워터/클리프사이드 접경</span>
                    </span>
                    <span class="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      골드코스트 거점
                    </span>
                  </div>

                  <div class="flex items-center gap-3.5 mb-4">
                    <div class="w-20 sm:w-24 h-12 rounded-xl bg-white flex items-center justify-center px-2 py-1 shrink-0 group-hover:scale-105 transition-all shadow-xs border border-slate-200/90 overflow-hidden">
                      <img src="/uploads/images/hospitals/palisades-medical.svg" alt="Palisades Medical Center 공식 로고" class="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <h3 class="font-black text-lg sm:text-xl text-slate-900 group-hover:text-blue-700 transition-colors tracking-tight leading-snug">
                        HMH Palisades
                      </h3>
                      <p class="text-xs sm:text-sm font-bold text-slate-500">팰리세이즈 메디컬 센터 (해켄색 메리디안 헬스)</p>
                    </div>
                  </div>

                  <!-- Short-form Local SEO Info Box -->
                  <div class="space-y-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100 mb-4">
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 한인 환자 내방 안내</strong>
                      <span>에지워터(Edgewater), 클리프사이드파크(Cliffside Park), 포트리 남부 및 팰팍 인접 허드슨 강변에 위치하여 강변 거주 한인 동포들이 가장 신속하게 방문할 수 있는 거점 종합병원입니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 언어 및 통역 지원 정보</strong>
                      <span>해켄색 메리디안 헬스(HMH) 다국어 의료 통역 지원(한국어 실시간 비디오 통역 VRI 및 상주 지원 연계) 및 한인 간호사·직원 상주.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 전문의 및 주요 센터 연계</strong>
                      <span>24시간 허드슨 리버사이드 <strong>응급실(ER)</strong>, 심장혈관 진단 및 심도자실, 당일 외래 수술 센터, 인근 에지워터·클리프사이드파크 1차 진료 한인 내과 및 전문의 클리닉과 유기적 연계.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 건강보험 및 자선진료</strong>
                      <span>HMH 주정부 자선 진료(Charity Care) 공통 적용, 메디케어, 메디케이드, ACA 마켓플레이스 보험 인-네트워크 지원.</span>
                    </div>
                  </div>

                  <!-- Hashtags -->
                  <div class="flex flex-wrap gap-1.5 mb-4">
                    <a href="/forum?specialty=hospital_reviews&q=Palisades&view=topics" class="px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[11px] transition-colors">#팰리세이즈병원</a>
                    <a href="/forum?specialty=hospital_reviews&q=에지워터인근&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#에지워터인근</a>
                    <a href="/forum?specialty=hospital_reviews&q=클리프사이드파크&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#클리프사이드파크</a>
                    <a href="/forum?specialty=hospital_reviews&q=응급실&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#강변응급실</a>
                  </div>

                  <!-- Contact Details -->
                  <div class="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 mb-4">
                    <div class="flex items-center gap-1.5">
                      <i class="fa-solid fa-phone text-slate-400 text-[11px]"></i>
                      <span>대표: <a href="tel:2018545000" class="font-bold text-slate-800 hover:text-blue-600">(201) 854-5000</a></span>
                      <span class="mx-1 text-slate-300">|</span>
                      <span>응급실: <a href="tel:2018545100" class="font-bold text-blue-700 hover:underline">(201) 854-5100</a></span>
                    </div>
                    <div class="flex items-start gap-1.5">
                      <i class="fa-solid fa-map-pin text-slate-400 text-[11px] mt-0.5"></i>
                      <span>7600 River Rd, North Bergen, NJ 07047</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a href="https://www.hackensackmeridianhealth.org/en/locations/palisades-medical-center" target="_blank" rel="noopener noreferrer" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
                    <span>공식 웹사이트</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                  <a href="/forum?specialty=hospital_reviews&q=Palisades&view=topics" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-extrabold text-xs transition-colors">
                    <i class="fa-regular fa-comment-dots text-xs"></i>
                    <span>후기 &amp; 질문</span>
                  </a>
                </div>
              </div>

              <!-- 7. HMH Pascack Valley Medical Center (파스카크 밸리 메디컬 센터) -->
              <div class="hospital-card border border-slate-200/90 rounded-2xl bg-white p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group" data-category="bergen senior_rehab">
                <div>
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-teal-100 text-teal-900 border border-teal-200">
                      <i class="fa-solid fa-bolt text-teal-600"></i>
                      <span>웨스트우드 커뮤니티 종합병원</span>
                    </span>
                    <span class="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      신속 응급실(Fast ER)
                    </span>
                  </div>

                  <div class="flex items-center gap-3.5 mb-4">
                    <div class="w-20 sm:w-24 h-12 rounded-xl bg-white flex items-center justify-center px-2 py-1 shrink-0 group-hover:scale-105 transition-all shadow-xs border border-slate-200/90 overflow-hidden">
                      <img src="/uploads/images/hospitals/pascack-valley.png" alt="HMH Pascack Valley Medical Center 공식 로고" class="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <h3 class="font-black text-lg sm:text-xl text-slate-900 group-hover:text-teal-700 transition-colors tracking-tight leading-snug">
                        HMH Pascack Valley
                      </h3>
                      <p class="text-xs sm:text-sm font-bold text-slate-500">파스카크 밸리 메디컬 센터</p>
                    </div>
                  </div>

                  <!-- Short-form Local SEO Info Box -->
                  <div class="space-y-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100 mb-4">
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 한인 환자 내방 안내</strong>
                      <span>웨스트우드(Westwood)에 위치한 해켄색 메리디안 헬스(HMH) 산하의 급성기 커뮤니티 종합병원으로 버겐 북부 한인 주민들에게 접근성이 우수합니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 언어 및 통역 지원 정보</strong>
                      <span>한국어 통역 지원 서비스 운영, 환자 1명당 간호사 비율이 우수하여 밀착형 맞춤 간호와 상세한 설명이 장점입니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 전문의 및 주요 센터 연계</strong>
                      <span>대기 시간이 극히 짧은 <strong>신속 응급실(Fast-Track ER)</strong>, 정형외과 무릎·고관절 관절 치환술, 당일 외래 수술 및 시니어 집중 재활 병동.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 건강보험 및 자선진료</strong>
                      <span>해켄색 메리디안 헬스 자선 진료 가이드라인 동일 적용, 메디케어 및 메디케이드 취약계층 재정 보조 지원.</span>
                    </div>
                  </div>

                  <!-- Hashtags -->
                  <div class="flex flex-wrap gap-1.5 mb-4">
                    <a href="/forum?specialty=hospital_reviews&q=Pascack&view=topics" class="px-2 py-0.5 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px] transition-colors">#파스카크밸리</a>
                    <a href="/forum?specialty=hospital_reviews&q=PascackValley&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#PascackValley</a>
                    <a href="/forum?specialty=hospital_reviews&q=신속응급실&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#신속응급실</a>
                    <a href="/forum?specialty=hospital_reviews&q=관절수술&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#관절치환수술</a>
                  </div>

                  <!-- Contact Details -->
                  <div class="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 mb-4">
                    <div class="flex items-center gap-1.5">
                      <i class="fa-solid fa-phone text-slate-400 text-[11px]"></i>
                      <span>대표: <a href="tel:2013831000" class="font-bold text-slate-800 hover:text-teal-600">(201) 383-1000</a></span>
                      <span class="mx-1 text-slate-300">|</span>
                      <span>응급실: <a href="tel:2013831025" class="font-bold text-teal-700 hover:underline">(201) 383-1025</a></span>
                    </div>
                    <div class="flex items-start gap-1.5">
                      <i class="fa-solid fa-map-pin text-slate-400 text-[11px] mt-0.5"></i>
                      <span>250 Old Hook Rd, Westwood, NJ 07675</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a href="https://www.pascackmedicalcenter.com" target="_blank" rel="noopener noreferrer" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
                    <span>공식 웹사이트</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                  <a href="/forum?specialty=hospital_reviews&q=Pascack&view=topics" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-extrabold text-xs transition-colors">
                    <i class="fa-regular fa-comment-dots text-xs"></i>
                    <span>후기 &amp; 질문</span>
                  </a>
                </div>
              </div>

              <!-- 8. RWJBarnabas Health network (RWJ바나바스 헬스 네트워크) -->
              <div class="hospital-card border border-slate-200/90 rounded-2xl bg-white p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group" data-category="tertiary korean_program">
                <div>
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-900 border border-rose-200">
                      <i class="fa-solid fa-circle-nodes text-rose-600"></i>
                      <span>뉴저지 최대 광역 의료망 · 러트거스 의대 제휴</span>
                    </span>
                    <span class="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      최상위 암·장기이식
                    </span>
                  </div>

                  <div class="flex items-center gap-3.5 mb-4">
                    <div class="w-20 sm:w-24 h-12 rounded-xl bg-white flex items-center justify-center px-2 py-1 shrink-0 group-hover:scale-105 transition-all shadow-xs border border-slate-200/90 overflow-hidden">
                      <img src="/uploads/images/hospitals/rwjbarnabas-health.png" alt="RWJBarnabas Health 공식 로고" class="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <h3 class="font-black text-lg sm:text-xl text-slate-900 group-hover:text-rose-700 transition-colors tracking-tight leading-snug">
                        RWJBarnabas Health
                      </h3>
                      <p class="text-xs sm:text-sm font-bold text-slate-500">RWJ바나바스 헬스 네트워크</p>
                    </div>
                  </div>

                  <!-- Short-form Local SEO Info Box -->
                  <div class="space-y-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100 mb-4">
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 한인 환자 내방 안내</strong>
                      <span>뉴저지 최대 종합 헬스케어 시스템으로 러트거스 의과대학(Rutgers Health)과 학술 제휴를 맺고 뉴저지 중·남부 및 북서부 한인 동포들에게 광역 전문 의료 서비스를 제공합니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 언어 및 통역 지원 정보</strong>
                      <span>24시간 다국어 전문 의료 통역 및 화상 통역 서비스, 다문화 환자 및 가족 전담 지원 센터 운영.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 전문의 및 주요 센터 연계</strong>
                      <span><strong>쿠퍼맨 바나바스(Cooperman Barnabas)</strong> 뉴저지 유일의 공인 화상센터, 세인트 바나바스 심장 및 신장이식 센터, 러트거스 암연구소(CINJ).</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 건강보험 및 자선진료</strong>
                      <span>뉴저지 자선 진료(Charity Care) 공통 지원, 메디케어, 메디케이드 및 금융 취약 환자를 위한 재정 지원 가이드라인 운영.</span>
                    </div>
                  </div>

                  <!-- Hashtags -->
                  <div class="flex flex-wrap gap-1.5 mb-4">
                    <a href="/forum?specialty=hospital_reviews&q=RWJ&view=topics" class="px-2 py-0.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-[11px] transition-colors">#RWJBarnabas</a>
                    <a href="/forum?specialty=hospital_reviews&q=러트거스헬스&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#러트거스헬스</a>
                    <a href="/forum?specialty=hospital_reviews&q=쿠퍼맨바나바스&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#화상센터</a>
                    <a href="/forum?specialty=hospital_reviews&q=장기이식&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#장기이식센터</a>
                  </div>

                  <!-- Contact Details -->
                  <div class="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 mb-4">
                    <div class="flex items-center gap-1.5">
                      <i class="fa-solid fa-phone text-slate-400 text-[11px]"></i>
                      <span>대표 안내: <a href="tel:8887247123" class="font-bold text-slate-800 hover:text-rose-600">(888) 724-7123</a></span>
                      <span class="mx-1 text-slate-300">|</span>
                      <span>진료예약: <a href="tel:8887247123" class="font-bold text-rose-700 hover:underline">(888) 724-7123</a></span>
                    </div>
                    <div class="flex items-start gap-1.5">
                      <i class="fa-solid fa-map-pin text-slate-400 text-[11px] mt-0.5"></i>
                      <span>95 Old Short Hills Rd, Livingston, NJ 07039 (Cooperman Barnabas)</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a href="https://www.rwjbh.org" target="_blank" rel="noopener noreferrer" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
                    <span>공식 웹사이트</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                  <a href="/forum?specialty=hospital_reviews&q=RWJ&view=topics" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-extrabold text-xs transition-colors">
                    <i class="fa-regular fa-comment-dots text-xs"></i>
                    <span>후기 &amp; 질문</span>
                  </a>
                </div>
              </div>

            </div>`;

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // Match from <!-- Filter Tabs --> to end of hospital grid <!-- 6 Major Hospitals Grid --> ... </div>\n\n          </div>
  const startPattern = /<!-- Filter Tabs -->/;
  const endPattern = /<\/div>\s*<\/div>\s*<\/section>\s*<script>\s*window\.filterHospitalList/;

  const startMatch = content.search(startPattern);
  const endMatch = content.search(endPattern);

  if (startMatch === -1 || endMatch === -1) {
    console.error('Could not find start or end pattern in', filePath);
    return;
  }

  const before = content.substring(0, startMatch);
  const after = content.substring(endMatch);

  const updatedContent = before + newHospitalSectionHtml + '\n\n          ' + after;
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log('Successfully updated:', filePath);
}

updateFile(path.join(__dirname, '../index.php'));
updateFile(path.join(__dirname, '../ko/index.html'));
