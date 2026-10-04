const fs = require('fs');
const path = require('path');

const rootDir = '/Users/ejyoon/Desktop/KACCESS';

const heroHTML = `      <!-- 1. Two-Phase Homepage Hero: Video Intro -> 5-Service Rotating Billboard (Shrinks Vertically by 35% on Transition) -->
      <section id="homepage-hero-billboard-section" class="w-full mb-8 overflow-hidden select-none hero-phase-video" style="width:100vw; max-width:100vw; position:relative; left:50%; right:50%; margin-left:-50vw; margin-right:-50vw; background: linear-gradient(135deg, #071322 0%, #0F2342 55%, #1B2A4A 100%); font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;" aria-label="NJ Access Portal 주요 서비스 하이라이트">
        <style>
          #homepage-hero-billboard-section {
            --brand-navy: #0F2342;
            --brand-navy-deep: #071322;
            --brand-navy-light: #1B2A4A;
            --brand-blue: #1B6FA8;
            --brand-blue-hover: #155987;
            --accent-teal: #7FC8C0;
            --accent-sky: #4FA3D1;
            box-sizing: border-box;
            transition: min-height 650ms cubic-bezier(0.16, 1, 0.3, 1), height 650ms cubic-bezier(0.16, 1, 0.3, 1);
          }
          #homepage-hero-billboard-section * {
            box-sizing: border-box;
          }

          /* Phase 1 Height (Cinematic Video Full Billboard) */
          #homepage-hero-billboard-section.hero-phase-video {
            min-height: clamp(560px, 52vw, 700px);
            height: clamp(560px, 52vw, 700px);
          }

          /* Phase 2 Height (Shrinks Vertically by 35% -> exactly 65% of Phase 1) */
          #homepage-hero-billboard-section.hero-phase-billboard {
            min-height: clamp(365px, 34vw, 455px);
            height: auto;
          }

          .hero-main-title {
            font-size: 38px;
            font-weight: 800;
            line-height: 1.18;
            letter-spacing: -0.025em;
            color: #ffffff;
            margin: 0 0 12px 0;
          }
          @media (max-width: 1024px) {
            .hero-main-title {
              font-size: 32px;
            }
          }
          @media (max-width: 640px) {
            .hero-main-title {
              font-size: 26px;
              line-height: 1.22;
              margin: 0 0 10px 0;
            }
          }
          .hero-gradient-accent {
            background: linear-gradient(90deg, #7FC8C0 0%, #4FA3D1 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-block;
          }
          .hero-main-desc {
            font-size: 14.5px;
            color: rgba(255, 255, 255, 0.85);
            line-height: 1.55;
            max-width: 520px;
            margin: 0 0 20px 0;
          }
          @media (max-width: 640px) {
            .hero-main-desc {
              font-size: 13.5px;
              line-height: 1.5;
              margin: 0 0 16px 0;
            }
          }
          .hero-btn-row {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 12px;
          }
          .hero-pill-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
            border: 1px solid rgba(255, 255, 255, 0.22);
            background: rgba(255, 255, 255, 0.10);
            color: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
            margin-bottom: 10px;
          }
          .hero-btn-primary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: #1B6FA8;
            color: #ffffff !important;
            padding: 11px 22px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 14.5px;
            text-decoration: none;
            box-shadow: 0 4px 12px rgba(27, 111, 168, 0.4);
            transition: all 0.2s ease;
            white-space: nowrap;
            flex-shrink: 0;
          }
          .hero-btn-primary:hover {
            background: #155987;
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(27, 111, 168, 0.6);
          }
          .hero-btn-white {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: #ffffff;
            color: #0F2342 !important;
            padding: 11px 22px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 14.5px;
            text-decoration: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.2s ease;
            white-space: nowrap;
            flex-shrink: 0;
          }
          .hero-btn-white:hover {
            background: #f1f5f9;
            transform: translateY(-1px);
          }
          .hero-btn-outline {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.35);
            color: #ffffff !important;
            padding: 11px 22px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 14.5px;
            text-decoration: none;
            transition: all 0.2s ease;
            white-space: nowrap;
            flex-shrink: 0;
          }
          .hero-btn-outline:hover {
            border-color: #ffffff;
            background: rgba(255, 255, 255, 0.12);
            transform: translateY(-1px);
          }
          .hero-btn-kakao {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: #FEE500;
            color: #3C1E1E !important;
            padding: 11px 22px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 14.5px;
            text-decoration: none;
            box-shadow: 0 4px 12px rgba(254, 229, 0, 0.35);
            transition: all 0.2s ease;
            white-space: nowrap;
            flex-shrink: 0;
          }
          .hero-btn-kakao:hover {
            background: #FADA0A;
            transform: translateY(-1px);
          }
          .hero-btn-icon {
            width: 14px;
            height: 14px;
            flex-shrink: 0;
          }
          .hero-card-container {
            position: relative;
            width: 100%;
            max-width: 440px;
            height: 235px;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.75), 0 0 25px rgba(31, 111, 168, 0.25);
            background: #0B192C;
          }
          @media (max-width: 1023px) {
            .hero-card-container {
              max-width: 480px;
              height: 220px;
              margin: 0 auto;
            }
          }
          @media (max-width: 639px) {
            .hero-card-container {
              height: 180px;
              border-radius: 16px;
            }
          }
          .hero-visual-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: opacity 450ms ease, transform 450ms ease;
          }
          .hero-card-caption-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.55) 65%, transparent 100%);
            padding: 12px 16px;
            z-index: 25;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
          }
          .hero-card-caption-text {
            color: #ffffff;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: -0.01em;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.85);
          }
          .hero-card-caption-num {
            color: rgba(255, 255, 255, 0.7);
            font-size: 11px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-weight: 600;
          }
          .hero-slide {
            transition: opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
          }
          .hero-tabs-grid {
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 10px;
            width: 100%;
          }
          @media (max-width: 639px) {
            .hero-tabs-grid {
              display: flex;
              overflow-x: auto;
              gap: 8px;
              padding-bottom: 4px;
              margin-left: -16px;
              margin-right: -16px;
              padding-left: 16px;
              padding-right: 16px;
              scrollbar-width: none;
              -webkit-overflow-scrolling: touch;
            }
            .hero-tab-item {
              flex: 0 0 140px;
            }
          }
          .hero-tab-item {
            text-align: left;
            padding: 8px 12px;
            border-radius: 10px;
            transition: all 0.2s ease;
            cursor: pointer;
            background: transparent;
            border: none;
            outline: none;
          }
          .hero-tab-item:hover {
            background: rgba(255, 255, 255, 0.05);
          }
          .hero-tab-item[aria-selected="true"] {
            background: rgba(255, 255, 255, 0.08);
          }
          .hero-tab-sub {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.45);
            display: block;
            margin-bottom: 2px;
          }
          .hero-tab-item[aria-selected="true"] .hero-tab-sub {
            color: #7FC8C0;
          }
          .hero-tab-title {
            font-size: 13px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.65);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
          }
          .hero-tab-item[aria-selected="true"] .hero-tab-title {
            color: #ffffff;
          }
          .hero-tab-bar {
            height: 3px;
            border-radius: 9999px;
            margin-top: 6px;
            background: transparent;
            transition: all 0.3s ease;
          }
          .hero-tab-item[aria-selected="true"] .hero-tab-bar {
            background: linear-gradient(90deg, #7FC8C0, #4FA3D1);
            box-shadow: 0 0 10px rgba(127, 200, 192, 0.85);
          }
        </style>

        <!-- Ambient radial glow overlay for visual depth -->
        <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(circle at 75% 35%, rgba(31, 111, 168, 0.28) 0%, rgba(15, 35, 66, 0) 70%); z-index: 1;"></div>
        <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(circle at 20% 80%, rgba(127, 200, 192, 0.1) 0%, transparent 50%); z-index: 1;"></div>

        <!-- PHASE 1: Video Intro Layer -->
        <div id="hero-video-phase" class="absolute inset-0 w-full h-full z-30 transition-opacity duration-500 overflow-hidden bg-slate-950 flex items-center justify-center">
          <video id="hero-intro-video" 
                 class="w-full h-full object-cover" 
                 autoplay 
                 muted 
                 playsinline 
                 webkit-playsinline 
                 preload="auto" 
                 poster="/uploads/images/billboard_video_poster.jpg"
                 style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
            <source src="/uploads/videos/videos_20260922_014616_9f2834.mp4" type="video/mp4">
          </video>
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none"></div>

          <!-- Small Skip Button -->
          <button id="hero-video-skip-btn" type="button" class="absolute top-4 right-4 sm:top-6 sm:right-8 z-40 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/65 hover:bg-black/90 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xl transition-all active:scale-95 cursor-pointer" aria-label="비디오 건너뛰기">
            <span>건너뛰기 Skip</span>
            <svg class="w-3.5 h-3.5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
          </button>
        </div>

        <!-- PHASE 2: Rotating Service Billboard Layer (Shrunk Vertically by 35%) -->
        <div id="hero-billboard-phase" class="relative w-full h-full z-10 opacity-0 pointer-events-none transition-opacity duration-500 flex flex-col justify-between py-5 sm:py-7 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" style="min-height: clamp(365px, 34vw, 455px);">
          
          <!-- Top Row: Left Content Column & Right Visual Card Column -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center flex-1 my-auto">
            
            <!-- Left Column: Content Panels (Pre-rendered in DOM, only active slide visible) -->
            <div class="order-1 lg:order-1 lg:col-span-7 flex flex-col justify-center relative min-h-[240px] sm:min-h-[260px]">
              
              <!-- SLIDE 01: 메디케어 & ACA 가이드 -->
              <div id="hero-slide-1" class="hero-slide" data-slide="1">
                <div>
                  <span class="hero-pill-badge">
                    <span class="w-2 h-2 rounded-full bg-[#7FC8C0] animate-pulse"></span>
                    2026 메디케어 중점 가이드
                  </span>
                </div>
                <!-- Authoritative Page single <h1> for SEO -->
                <h1 id="hero-single-h1" class="hero-main-title">
                  메디케어 오픈 인롤먼트<br>
                  <span class="hero-gradient-accent">10월 15일 – 12월 7일 완벽 가이드</span>
                </h1>
                <p class="hero-main-desc">
                  파트 D $2,100 약값 상한제, 파트 B $202.90 — 2026년 변경 사항과 플랜 비교 체크리스트를 확인하세요.
                </p>
                <div class="hero-btn-row">
                  <a href="/resources/medicare" class="hero-btn-primary">
                    <span>메디케어 가이드 보기</span>
                    <svg class="hero-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                  </a>
                  <a href="/calculator" class="hero-btn-white">
                    <span>자격 확인 계산기</span>
                  </a>
                </div>
              </div>

              <!-- SLIDE 02: 환자 내비게이션 서비스 -->
              <div id="hero-slide-2" class="hero-slide hidden opacity-0 translate-y-3" data-slide="2">
                <div>
                  <span class="hero-pill-badge">
                    <span class="w-2 h-2 rounded-full bg-[#4FA3D1] animate-pulse"></span>
                    1:1 환자 내비게이션
                  </span>
                </div>
                <div class="hero-main-title">
                  병원 찾기가 막막하다면<br>
                  <span class="hero-gradient-accent">전문 내비게이터와 함께</span>
                </div>
                <p class="hero-main-desc">
                  의사 찾기, 병원 예약 지원, 보험 가입, 청구 문제 해결까지 4단계로 도와드립니다.
                </p>
                <div class="hero-btn-row">
                  <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="hero-btn-primary">
                    <span>내비게이션 신청</span>
                    <svg class="hero-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                  </a>
                  <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="hero-btn-kakao">
                    <img src="/kakaotalk-icon.png" alt="Kakao" class="w-4 h-4 rounded object-contain" />
                    <span>카카오톡 상담</span>
                  </a>
                </div>
              </div>

              <!-- SLIDE 03: 커뮤니티 포럼 -->
              <div id="hero-slide-3" class="hero-slide hidden opacity-0 translate-y-3" data-slide="3">
                <div>
                  <span class="hero-pill-badge">
                    <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                    이웃과 함께
                  </span>
                </div>
                <div class="hero-main-title">
                  궁금한 건강 정보를<br>
                  <span class="hero-gradient-accent">커뮤니티에 물어보세요</span>
                </div>
                <p class="hero-main-desc">
                  병원 후기, 보험·청구 Q&A, 진료과별 의학 상담 — 5개 게시판에서 실시간으로 소통하세요.
                </p>
                <div class="hero-btn-row">
                  <a href="/forum" class="hero-btn-primary">
                    <span>포럼 둘러보기</span>
                    <svg class="hero-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                  </a>
                  <a href="/forum/ask" class="hero-btn-white">
                    <span>질문하기</span>
                  </a>
                </div>
              </div>

              <!-- SLIDE 04: 건강 뉴스 -->
              <div id="hero-slide-4" class="hero-slide hidden opacity-0 translate-y-3" data-slide="4">
                <div>
                  <span class="hero-pill-badge">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    매일 업데이트
                  </span>
                </div>
                <div class="hero-main-title">
                  한인 건강 뉴스를<br>
                  <span class="hero-gradient-accent">한눈에 확인하세요</span>
                </div>
                <p class="hero-main-desc">
                  의료 칼럼 TOP 10, 리콜 속보, 보험 정책 변화까지 매일 업데이트됩니다.
                </p>
                <div class="hero-btn-row">
                  <a href="/news" class="hero-btn-primary">
                    <span>뉴스 보기</span>
                    <svg class="hero-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                  </a>
                  <a href="/resources/medicare" class="hero-btn-outline">
                    <span>전체 가이드</span>
                  </a>
                </div>
              </div>

              <!-- SLIDE 05: 실시간 자격 확인 -->
              <div id="hero-slide-5" class="hero-slide hidden opacity-0 translate-y-3" data-slide="5">
                <div>
                  <span class="hero-pill-badge">
                    <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    2026 복지 혜택 계산기
                  </span>
                </div>
                <div class="hero-main-title">
                  나에게 맞는 혜택을<br>
                  <span class="hero-gradient-accent">실시간 맞춤 계산기로 확인</span>
                </div>
                <p class="hero-main-desc">
                  메디케어·메디케이드·시니어 SNAP·PAAD 중 지원받을 수 있는 혜택을 즉시 계산하세요.
                </p>
                <div class="hero-btn-row">
                  <a href="/resource-center?tab=calculator" class="hero-btn-primary">
                    <span>자격 계산하기</span>
                    <svg class="hero-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                  </a>
                </div>
              </div>

            </div>

            <!-- Right Column: Visual Card with Caption -->
            <div class="order-2 lg:order-2 lg:col-span-5 flex justify-center w-full">
              <div class="hero-card-container">
                <!-- Images (All 5 pre-rendered) -->
                <img id="hero-visual-1" src="/uploads/images/hero_slide_1.jpg" alt="2026 메디케어 변경 사항 한눈에" class="hero-visual-img" style="opacity: 1; transform: scale(1.0); z-index: 10;" />
                <img id="hero-visual-2" src="/uploads/images/hero_slide_2.jpg" alt="찾아가는 맞춤 내비게이션" loading="lazy" class="hero-visual-img" style="opacity: 0; transform: scale(1.02); z-index: 1;" />
                <img id="hero-visual-3" src="/uploads/images/hero_slide_forum.jpg?v=1" alt="5개 게시판 · 실시간 소통" loading="lazy" class="hero-visual-img" style="opacity: 0; transform: scale(1.02); z-index: 1;" />
                <img id="hero-visual-4" src="/uploads/images/hero_slide_4.jpg" alt="TOP 10 의료 칼럼" loading="lazy" class="hero-visual-img" style="opacity: 0; transform: scale(1.02); z-index: 1;" />
                <img id="hero-visual-5" src="/uploads/images/hero_slide_5.jpg" alt="2026 복지 혜택 자격 계산기" loading="lazy" class="hero-visual-img" style="opacity: 0; transform: scale(1.02); z-index: 1;" />
                
                <!-- Bottom Caption Bar -->
                <div class="hero-card-caption-bar">
                  <span id="hero-visual-caption" class="hero-card-caption-text">
                    2026 메디케어 변경 사항 한눈에
                  </span>
                  <span class="hero-card-caption-num">
                    <span id="hero-visual-num">01</span> / 05
                  </span>
                </div>
              </div>
            </div>

          </div>

          <!-- Bottom: Highlight Tab Bar (role="tablist", aria-selected, arrow-key navigation) -->
          <div class="mt-6 pt-3 border-t border-white/10 w-full">
            <div role="tablist" aria-label="NJ Access Portal 서비스 하이라이트" class="hero-tabs-grid">
              
              <!-- Tab 1 -->
              <button role="tab" id="hero-tab-1" aria-controls="hero-slide-1" aria-selected="true" tabindex="0" onclick="window.njapHeroGoto(1)" class="hero-tab-item active">
                <span class="hero-tab-sub">하이라이트 01</span>
                <span class="hero-tab-title">메디케어 & ACA</span>
                <div class="hero-tab-bar"></div>
              </button>

              <!-- Tab 2 -->
              <button role="tab" id="hero-tab-2" aria-controls="hero-slide-2" aria-selected="false" tabindex="-1" onclick="window.njapHeroGoto(2)" class="hero-tab-item">
                <span class="hero-tab-sub">하이라이트 02</span>
                <span class="hero-tab-title">환자 내비게이션</span>
                <div class="hero-tab-bar"></div>
              </button>

              <!-- Tab 3 -->
              <button role="tab" id="hero-tab-3" aria-controls="hero-slide-3" aria-selected="false" tabindex="-1" onclick="window.njapHeroGoto(3)" class="hero-tab-item">
                <span class="hero-tab-sub">하이라이트 03</span>
                <span class="hero-tab-title">커뮤니티 포럼</span>
                <div class="hero-tab-bar"></div>
              </button>

              <!-- Tab 4 -->
              <button role="tab" id="hero-tab-4" aria-controls="hero-slide-4" aria-selected="false" tabindex="-1" onclick="window.njapHeroGoto(4)" class="hero-tab-item">
                <span class="hero-tab-sub">하이라이트 04</span>
                <span class="hero-tab-title">건강 뉴스</span>
                <div class="hero-tab-bar"></div>
              </button>

              <!-- Tab 5 -->
              <button role="tab" id="hero-tab-5" aria-controls="hero-slide-5" aria-selected="false" tabindex="-1" onclick="window.njapHeroGoto(5)" class="hero-tab-item">
                <span class="hero-tab-sub">하이라이트 05</span>
                <span class="hero-tab-title">실시간 자격 확인</span>
                <div class="hero-tab-bar"></div>
              </button>

            </div>
          </div>

        </div>

        <script>
          (function initHeroBillboard() {
            var heroSection = document.getElementById('homepage-hero-billboard-section');
            if (!heroSection) return;

            var videoPhase = document.getElementById('hero-video-phase');
            var billboardPhase = document.getElementById('hero-billboard-phase');
            var video = document.getElementById('hero-intro-video');
            var skipBtn = document.getElementById('hero-video-skip-btn');
            var visualCaption = document.getElementById('hero-visual-caption');
            var visualNum = document.getElementById('hero-visual-num');
            var singleH1 = document.getElementById('hero-single-h1');
            
            var currentSlide = 1;
            var totalSlides = 5;
            var rotateTimer = null;
            var isTransitioned = false;
            var isPaused = false;
            var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            var captions = [
              '2026 메디케어 변경 사항 한눈에',
              '찾아가는 맞춤 내비게이션',
              '5개 게시판 · 실시간 소통',
              'TOP 10 의료 칼럼',
              '2026 복지 혜택 자격 계산기'
            ];

            var slideHeadlines = [
              '메디케어 오픈 인롤먼트<br><span class="hero-gradient-accent">10월 15일 – 12월 7일 완벽 가이드</span>',
              '병원 찾기가 막막하다면<br><span class="hero-gradient-accent">전문 내비게이터와 함께</span>',
              '궁금한 건강 정보를<br><span class="hero-gradient-accent">커뮤니티에 물어보세요</span>',
              '한인 건강 뉴스를<br><span class="hero-gradient-accent">한눈에 확인하세요</span>',
              '나에게 맞는 혜택을<br><span class="hero-gradient-accent">실시간 맞춤 계산기로 확인</span>'
            ];

            function transitionToBillboard() {
              if (isTransitioned) return;
              isTransitioned = true;

              if (video) {
                try { video.pause(); } catch(e) {}
              }

              // Vertically shrink billboard by 35%
              heroSection.classList.remove('hero-phase-video');
              heroSection.classList.add('hero-phase-billboard');

              if (videoPhase) {
                videoPhase.style.opacity = '0';
                videoPhase.style.pointerEvents = 'none';
                setTimeout(function() {
                  if (videoPhase && videoPhase.parentNode) {
                    videoPhase.style.display = 'none';
                  }
                }, 450);
              }

              if (billboardPhase) {
                billboardPhase.style.opacity = '1';
                billboardPhase.style.pointerEvents = 'auto';
              }

              if (!prefersReducedMotion) {
                startRotation();
              }
            }

            // Phase 1 triggers
            if (prefersReducedMotion) {
              transitionToBillboard();
            } else if (video) {
              video.defaultMuted = true;
              video.muted = true;
              video.volume = 0;
              video.playsInline = true;

              var triggerPlay = function() {
                var p = video.play();
                if (p && p.catch) {
                  p.catch(function() {
                    transitionToBillboard();
                  });
                }
              };

              if (video.readyState >= 2) {
                triggerPlay();
              } else {
                video.addEventListener('canplay', triggerPlay, { once: true });
                video.addEventListener('loadeddata', triggerPlay, { once: true });
              }

              video.addEventListener('ended', transitionToBillboard);
              video.addEventListener('error', transitionToBillboard);

              // Safety timeout: transition after 12 seconds max
              setTimeout(function() {
                if (!isTransitioned) transitionToBillboard();
              }, 12000);
            } else {
              transitionToBillboard();
            }

            if (skipBtn) {
              skipBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                transitionToBillboard();
              });
            }

            // Slide navigation
            function goToSlide(n) {
              if (n < 1) n = totalSlides;
              if (n > totalSlides) n = 1;
              currentSlide = n;

              // Update single H1 text for SEO and screen readers
              if (singleH1 && slideHeadlines[currentSlide - 1]) {
                singleH1.innerHTML = slideHeadlines[currentSlide - 1];
              }

              // Update slides
              for (var i = 1; i <= totalSlides; i++) {
                var slide = document.getElementById('hero-slide-' + i);
                var img = document.getElementById('hero-visual-' + i);
                var tab = document.getElementById('hero-tab-' + i);

                if (slide) {
                  if (i === currentSlide) {
                    slide.classList.remove('hidden');
                    void slide.offsetWidth;
                    slide.style.opacity = '1';
                    slide.style.transform = 'translateY(0)';
                  } else {
                    slide.style.opacity = '0';
                    slide.style.transform = 'translateY(12px)';
                    slide.classList.add('hidden');
                  }
                }

                if (img) {
                  if (i === currentSlide) {
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1.0)';
                    img.style.zIndex = '10';
                  } else {
                    img.style.opacity = '0';
                    img.style.transform = 'scale(1.02)';
                    img.style.zIndex = '1';
                  }
                }

                if (tab) {
                  if (i === currentSlide) {
                    tab.setAttribute('aria-selected', 'true');
                    tab.setAttribute('tabindex', '0');
                    tab.classList.add('active');
                  } else {
                    tab.setAttribute('aria-selected', 'false');
                    tab.setAttribute('tabindex', '-1');
                    tab.classList.remove('active');
                  }
                }
              }

              if (visualCaption) {
                visualCaption.textContent = captions[currentSlide - 1];
              }
              if (visualNum) {
                visualNum.textContent = '0' + currentSlide;
              }
            }

            window.njapHeroGoto = function(n) {
              goToSlide(n);
              resetTimer();
            };

            function startRotation() {
              stopRotation();
              if (prefersReducedMotion) return;
              rotateTimer = setInterval(function() {
                if (!isPaused) {
                  goToSlide(currentSlide + 1);
                }
              }, 4000);
            }

            function stopRotation() {
              if (rotateTimer) {
                clearInterval(rotateTimer);
                rotateTimer = null;
              }
            }

            function resetTimer() {
              stopRotation();
              startRotation();
            }

            // Hover & Focus pause/resume
            heroSection.addEventListener('mouseenter', function() { isPaused = true; });
            heroSection.addEventListener('mouseleave', function() { isPaused = false; });
            heroSection.addEventListener('focusin', function() { isPaused = true; });
            heroSection.addEventListener('focusout', function() { isPaused = false; });

            // Keyboard arrow navigation
            var tablist = heroSection.querySelector('[role="tablist"]');
            if (tablist) {
              tablist.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  var next = currentSlide === totalSlides ? 1 : currentSlide + 1;
                  window.njapHeroGoto(next);
                  var t = document.getElementById('hero-tab-' + next);
                  if (t) t.focus();
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  var prev = currentSlide === 1 ? totalSlides : currentSlide - 1;
                  window.njapHeroGoto(prev);
                  var t = document.getElementById('hero-tab-' + prev);
                  if (t) t.focus();
                } else if (e.key === 'Home') {
                  e.preventDefault();
                  window.njapHeroGoto(1);
                  var t = document.getElementById('hero-tab-1');
                  if (t) t.focus();
                } else if (e.key === 'End') {
                  e.preventDefault();
                  window.njapHeroGoto(totalSlides);
                  var t = document.getElementById('hero-tab-' + totalSlides);
                  if (t) t.focus();
                }
              });
            }
          })();
        </script>
      </section>`;

// Replace in files
function updateFile(relPath) {
  const filePath = path.join(rootDir, relPath);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  const existingHeroRegex = /<!-- 1\. Two-Phase Homepage Hero: Video Intro -> 5-Service Rotating Billboard[\s\S]*?<\/section>/;
  const oldBillboardRegex = /<!-- 1\. 100vw Panoramic Billboard Section \(At Top\) -->[\s\S]*?<section id="gallery-billboard-section"[\s\S]*?<\/section>/;

  if (existingHeroRegex.test(content)) {
    content = content.replace(existingHeroRegex, heroHTML);
    console.log(`Replaced existing hero section in ${relPath}`);
  } else if (oldBillboardRegex.test(content)) {
    content = content.replace(oldBillboardRegex, heroHTML);
    console.log(`Replaced old billboard section in ${relPath}`);
  } else {
    console.warn(`Could not find hero or billboard regex in ${relPath}`);
  }

  content = content.replace(
    /<h1 class="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-gray-950 leading-tight mb-3 tracking-tight group-hover:text-brand-blue transition-colors">([\s\S]*?)<\/h1>/,
    '<h2 class="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-gray-950 leading-tight mb-3 tracking-tight group-hover:text-brand-blue transition-colors">$1</h2>'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${relPath}`);
}

['index.php', 'ko/index.html'].forEach(updateFile);
console.log('Build completed successfully.');
