const fs = require('fs');
const path = require('path');

const rootDir = '/Users/ejyoon/Desktop/KACCESS';

// 6 Default Slides Definition
const defaultSixSlides = [
  {
    order: 1,
    category: '뉴저지 의료접근 포털',
    title: 'NJ ACCESS PORTAL',
    subtitle: '뉴저지 한인을 위한 무료 프리미엄 의료 접근·환자 내비게이션 서비스. 언어와 문화의 장벽 없이 최상의 의료 시스템 전문가가 함께합니다.',
    mediaType: 'video',
    mediaUrl: '/uploads/videos/videos_20260922_014616_9f2834.mp4',
    linkUrl: '/about#contact',
    linkText: '자세히 보기 →',
    secondaryLinkUrl: '/about',
    secondaryLinkText: '더 알아보기',
    caption: 'NJ ACCESS PORTAL',
    isMainVideo: true
  },
  {
    order: 2,
    category: '메디케어 & ACA',
    title: '메디케어 오픈 인롤먼트 10월 15일 – 12월 7일 완벽 가이드',
    subtitle: '파트 D $2,100 약값 상한제, 파트 B $202.90 — 2026년 필수 변경 사항과 플랜 비교 체크리스트를 확인하세요.',
    mediaType: 'image',
    mediaUrl: '/uploads/images/hero_slide_1.jpg',
    linkUrl: '/resources/medicare',
    linkText: '메디케어 가이드 보기 →',
    secondaryLinkUrl: '/calculator',
    secondaryLinkText: '자격 확인 계산기',
    caption: '2026 메디케어 변경 사항 한눈에',
    isMainVideo: false
  },
  {
    order: 3,
    category: '환자 내비게이션',
    title: '병원 찾기가 막막하다면 전문 내비게이터와 함께',
    subtitle: '의사 찾기, 병원 예약 지원, 보험 가입, 청구 문제 해결까지 4단계로 비영리 전문 내비게이터가 무료로 지원합니다.',
    mediaType: 'image',
    mediaUrl: '/uploads/images/hero_slide_2.jpg',
    linkUrl: 'http://pf.kakao.com/_hdxmxaX/chat',
    linkText: '내비게이션 신청 →',
    secondaryLinkUrl: 'http://pf.kakao.com/_hdxmxaX/chat',
    secondaryLinkText: '카카오톡 상담',
    caption: '찾아가는 맞춤 내비게이션',
    isMainVideo: false
  },
  {
    order: 4,
    category: '커뮤니티 포럼',
    title: '궁금한 건강 정보를 커뮤니티에 물어보세요',
    subtitle: '병원 후기, 보험·청구 Q&A, 진료과별 의학 상담 — 5개 게시판에서 실시간으로 소통하세요.',
    mediaType: 'image',
    mediaUrl: '/uploads/images/hero_slide_forum.jpg',
    linkUrl: '/forum',
    linkText: '포럼 둘러보기 →',
    secondaryLinkUrl: '/forum',
    secondaryLinkText: '질문하기',
    caption: '5개 게시판 · 실시간 소통',
    isMainVideo: false
  },
  {
    order: 5,
    category: '건강 뉴스',
    title: '한인 건강 뉴스를 한눈에 확인하세요',
    subtitle: '의료 칼럼 TOP 10, 리콜 속보, 보험 정책 변화까지 매일 업데이트됩니다.',
    mediaType: 'image',
    mediaUrl: '/uploads/images/hero_slide_recall.jpg',
    linkUrl: '/news',
    linkText: '뉴스 보기 →',
    secondaryLinkUrl: '/resources/medicare',
    secondaryLinkText: '전체 가이드',
    caption: '긴급 식품·의약품 리콜 속보',
    isMainVideo: false
  },
  {
    order: 6,
    category: '실시간 자격 확인',
    title: '2026 복지 혜택 실시간 자격 확인 계산기',
    subtitle: '메디케어·메디케이드·시니어 SNAP·PAAD 중 지원받을 수 있는 혜택을 즉시 계산하세요.',
    mediaType: 'image',
    mediaUrl: '/uploads/images/hero_slide_5.jpg',
    linkUrl: '/calculator',
    linkText: '자격 계산하기 →',
    secondaryLinkUrl: '/matcher',
    secondaryLinkText: '맞춤 매칭',
    caption: '2026 복지 혜택 자격 계산기',
    isMainVideo: false
  }
];

// PHP Template for index.php
const heroPHP = `      <!-- 1. Two-Phase Homepage Hero: Clean Big Video Intro -> 6-Service Rotating Billboard (Shrinks Vertically by 35% on Transition) -->
      <?php
        // Prepare CMS 6-Slide Billboard Data for Dynamic Rendering
        $defaultSix = json_decode(<<<'JSON'
${JSON.stringify(defaultSixSlides, null, 2)}
JSON
        , true);
        $sixSlides = [];
        for ($i = 1; $i <= 6; $i++) {
            $def = $defaultSix[$i - 1];
            $matched = null;
            if (!empty($activeBillboards)) {
                foreach ($activeBillboards as $b) {
                    if ((int)($b['order'] ?? 0) === $i) {
                        $matched = $b;
                        break;
                    }
                }
                if (!$matched && isset($activeBillboards[$i - 1])) {
                    $matched = $activeBillboards[$i - 1];
                }
            }
            if ($matched) {
                $sixSlides[$i] = array_merge($def, $matched);
            } else {
                $sixSlides[$i] = $def;
            }
        }

        // Slide 1 always dictates the Main Big Screen Video
        $mainVideoSlide = $sixSlides[1];
        $mainVideoUrl = !empty($mainVideoSlide['mediaUrl']) ? $mainVideoSlide['mediaUrl'] : '/uploads/videos/videos_20260922_014616_9f2834.mp4';
      ?>
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

          /* Phase 1 Height (Cinematic Clean Video Full Billboard) */
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
            color: rgba(255, 255, 255, 0.88);
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
            box-shadow: 0 6px 16px rgba(27, 111, 168, 0.5);
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
          .hero-visual-img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 20px;
            transition: opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
          }
          .hero-card-caption-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(7, 19, 34, 0.95) 0%, rgba(7, 19, 34, 0.7) 65%, transparent 100%);
            padding: 20px 16px 12px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 20;
            pointer-events: none;
          }
          .hero-card-caption-text {
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 80%;
          }
          .hero-card-caption-num {
            color: rgba(255, 255, 255, 0.7);
            font-size: 11px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-weight: 600;
            white-space: nowrap;
          }
          .hero-slide {
            transition: opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
          }
          .hero-tabs-grid {
            display: grid;
            grid-template-columns: repeat(6, minmax(0, 1fr));
            gap: 8px;
            width: 100%;
          }
          @media (max-width: 960px) {
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
              flex: 0 0 135px;
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

        <!-- PHASE 1: Clean Cinematic Video Intro Layer (No Buttons, No Box) -->
        <div id="hero-video-phase" class="absolute inset-0 w-full h-full z-30 transition-opacity duration-500 overflow-hidden bg-slate-950 flex items-center justify-center">
          <video id="hero-intro-video" 
                 class="w-full h-full object-cover" 
                 autoplay 
                 muted 
                 playsinline 
                 webkit-playsinline 
                 preload="auto" 
                 src="<?= htmlspecialchars($mainVideoUrl) ?>"
                 poster="/uploads/images/billboard_video_poster.jpg"
                 style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
          </video>
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30 pointer-events-none"></div>

          <!-- Subtle Scroll Down Indicator -->
          <div class="absolute bottom-5 right-6 text-white/50 text-xs font-medium flex items-center gap-1.5 pointer-events-none hidden sm:flex">
            <svg class="w-3.5 h-3.5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
            <span>스크롤하여 서비스 바로보기</span>
          </div>
        </div>

        <!-- PHASE 2: Rotating Service Billboard Layer (Shrunk Vertically by 35% -> Exactly 6 Slides) -->
        <div id="hero-billboard-phase" class="relative w-full h-full z-10 opacity-0 pointer-events-none transition-opacity duration-500 flex flex-col justify-between py-5 sm:py-7 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" style="min-height: clamp(365px, 34vw, 455px);">
          
          <!-- Top Row: Left Content Column & Right Visual Card Column -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center flex-1 my-auto">
            
            <!-- Left Column: Content Panels (Only active slide visible) -->
            <div class="order-1 lg:order-1 lg:col-span-7 flex flex-col justify-center relative min-h-[240px] sm:min-h-[260px]">
              
              <?php for ($idx = 1; $idx <= 6; $idx++): 
                $s = $sixSlides[$idx];
                $isActive = ($idx === 1);
              ?>
              <!-- SLIDE 0<?= $idx ?>: <?= htmlspecialchars($s['category'] ?? "슬라이드 $idx") ?> -->
              <div id="hero-slide-<?= $idx ?>" class="hero-slide <?= $isActive ? '' : 'hidden opacity-0 translate-y-3' ?>" data-slide="<?= $idx ?>">
                <div>
                  <span class="hero-pill-badge">
                    <span class="w-2 h-2 rounded-full bg-[#7FC8C0] animate-pulse"></span>
                    <span id="hero-slide<?= $idx ?>-badge-text"><?= htmlspecialchars($s['category'] ?? '') ?></span>
                  </span>
                </div>

                <?php if ($idx === 1): ?>
                <!-- Authoritative Page single <h1> for SEO on Slide 1 -->
                <h1 id="hero-single-h1" class="hero-main-title">
                  <?= htmlspecialchars($s['title'] ?? '') ?>
                </h1>
                <?php else: ?>
                <div id="hero-slide<?= $idx ?>-title" class="hero-main-title">
                  <?= htmlspecialchars($s['title'] ?? '') ?>
                </div>
                <?php endif; ?>

                <p id="hero-slide<?= $idx ?>-desc" class="hero-main-desc">
                  <?= nl2br(htmlspecialchars($s['subtitle'] ?? '')) ?>
                </p>

                <div id="hero-slide<?= $idx ?>-btn-row" class="hero-btn-row">
                  <a id="hero-slide<?= $idx ?>-link" href="<?= htmlspecialchars($s['linkUrl'] ?? '#') ?>" class="hero-btn-primary">
                    <span id="hero-slide<?= $idx ?>-link-text"><?= htmlspecialchars($s['linkText'] ?: '자세히 보기 →') ?></span>
                    <svg class="hero-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                  </a>
                  <?php if (!empty($s['secondaryLinkUrl'])): ?>
                  <a id="hero-slide<?= $idx ?>-sec-link" href="<?= htmlspecialchars($s['secondaryLinkUrl']) ?>" class="hero-btn-white">
                    <span><?= htmlspecialchars($s['secondaryLinkText'] ?: '더 알아보기') ?></span>
                  </a>
                  <?php endif; ?>
                </div>
              </div>
              <?php endfor; ?>

            </div>

            <!-- Right Column: Visual Card with Caption -->
            <div class="order-2 lg:order-2 lg:col-span-5 flex justify-center w-full">
              <div class="hero-card-container">
                <?php for ($idx = 1; $idx <= 6; $idx++):
                  $s = $sixSlides[$idx];
                  $isActive = ($idx === 1);
                  $mUrl = $s['mediaUrl'] ?? '';
                  $isVid = ($s['mediaType'] ?? '') === 'video' || preg_match('/\\.(mp4|webm|mov|ogg|m4v)($|\\?)/i', $mUrl) || strpos($mUrl, '/uploads/videos/') !== false;
                  $style = $isActive ? "opacity: 1; transform: scale(1.0); z-index: 10;" : "opacity: 0; transform: scale(1.02); z-index: 1;";
                ?>
                  <?php if ($isVid): ?>
                  <video id="hero-visual-<?= $idx ?>" src="<?= htmlspecialchars($mUrl) ?>" autoplay muted loop playsinline webkit-playsinline class="hero-visual-img" style="<?= $style ?> object-fit: cover;"></video>
                  <?php else: ?>
                  <img id="hero-visual-<?= $idx ?>" src="<?= htmlspecialchars($mUrl) ?>" alt="<?= htmlspecialchars($s['title']) ?>" loading="<?= $isActive ? 'eager' : 'lazy' ?>" class="hero-visual-img" style="<?= $style ?>" />
                  <?php endif; ?>
                <?php endfor; ?>
                
                <!-- Bottom Caption Bar -->
                <div class="hero-card-caption-bar">
                  <span id="hero-visual-caption" class="hero-card-caption-text">
                    <?= htmlspecialchars($sixSlides[1]['caption'] ?? $sixSlides[1]['title'] ?? 'NJ ACCESS PORTAL') ?>
                  </span>
                  <span class="hero-card-caption-num">
                    <span id="hero-visual-num">01</span> / 06
                  </span>
                </div>
              </div>
            </div>

          </div>

          <!-- Bottom: Highlight Tab Bar (6 tabs) -->
          <div class="mt-6 pt-3 border-t border-white/10 w-full">
            <div role="tablist" aria-label="NJ Access Portal 서비스 하이라이트" class="hero-tabs-grid">
              <?php for ($idx = 1; $idx <= 6; $idx++):
                $s = $sixSlides[$idx];
                $isActive = ($idx === 1);
              ?>
              <button role="tab" id="hero-tab-<?= $idx ?>" aria-controls="hero-slide-<?= $idx ?>" aria-selected="<?= $isActive ? 'true' : 'false' ?>" tabindex="<?= $isActive ? '0' : '-1' ?>" onclick="window.njapHeroGoto(<?= $idx ?>)" class="hero-tab-item <?= $isActive ? 'active' : '' ?>">
                <span class="hero-tab-sub">하이라이트 0<?= $idx ?></span>
                <span id="hero-tab<?= $idx ?>-title" class="hero-tab-title"><?= htmlspecialchars($s['category'] ?? "슬라이드 $idx") ?></span>
                <div class="hero-tab-bar"></div>
              </button>
              <?php endfor; ?>
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
            var visualCaption = document.getElementById('hero-visual-caption');
            var visualNum = document.getElementById('hero-visual-num');
            var singleH1 = document.getElementById('hero-single-h1');

            var sixSlides = <?= json_encode(array_values($sixSlides), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?>;
            var currentSlide = 1;
            var totalSlides = 6;
            var rotateTimer = null;
            var isTransitioned = false;
            var isPaused = false;
            var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            var captions = sixSlides.map(function(s) { return s.caption || s.title || ''; });

            // Transition from Big Video to 6-Slide Billboard
            function transitionToBillboard() {
              if (isTransitioned) return;
              isTransitioned = true;

              // Shrink section height by 35%
              heroSection.classList.remove('hero-phase-video');
              heroSection.classList.add('hero-phase-billboard');

              // Cross-fade
              if (videoPhase) videoPhase.style.opacity = '0';
              if (billboardPhase) {
                billboardPhase.style.opacity = '1';
                billboardPhase.style.pointerEvents = 'auto';
              }

              setTimeout(function() {
                if (videoPhase) {
                  videoPhase.style.display = 'none';
                  if (video) video.pause();
                }
              }, 500);

              // Set active Slide 1
              goToSlide(1);

              // Start rotation if motion not reduced
              if (!prefersReducedMotion) {
                startRotation();
              }
            }

            // Expose globally
            window.njapHeroTransition = transitionToBillboard;
            window.njapHeroGoto = function(n) {
              if (!isTransitioned) {
                transitionToBillboard();
              }
              goToSlide(n);
              stopRotation();
              if (!prefersReducedMotion) startRotation();
            };

            // Play video intro
            if (video) {
              var playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.catch(function() {
                  video.muted = true;
                  video.play().catch(function() {});
                });
              }

              // Auto-shrink when video ends
              video.addEventListener('ended', function() {
                transitionToBillboard();
              });

              video.addEventListener('error', function() {
                transitionToBillboard();
              });

              // Safety watchdog timeout (45s max)
              setTimeout(function() {
                if (!isTransitioned) {
                  transitionToBillboard();
                }
              }, 45000);
            } else {
              transitionToBillboard();
            }

            // Scroll down to skip full video immediately
            var lastTouchY = 0;
            window.addEventListener('wheel', function(e) {
              if (!isTransitioned && e.deltaY > 10) {
                transitionToBillboard();
              }
            }, { passive: true });

            window.addEventListener('touchstart', function(e) {
              if (e.touches && e.touches[0]) lastTouchY = e.touches[0].clientY;
            }, { passive: true });

            window.addEventListener('touchmove', function(e) {
              if (!isTransitioned && e.touches && e.touches[0]) {
                var diff = lastTouchY - e.touches[0].clientY;
                if (diff > 18) {
                  transitionToBillboard();
                }
              }
            }, { passive: true });

            window.addEventListener('scroll', function() {
              if (!isTransitioned && window.scrollY > 20) {
                transitionToBillboard();
              }
            }, { passive: true });

            // Slide navigation (1 to 6)
            function goToSlide(n) {
              if (n < 1) n = totalSlides;
              if (n > totalSlides) n = 1;
              currentSlide = n;

              // Update slides
              for (var i = 1; i <= totalSlides; i++) {
                var slide = document.getElementById('hero-slide-' + i);
                var visual = document.getElementById('hero-visual-' + i);
                var tab = document.getElementById('hero-tab-' + i);

                if (slide) {
                  if (i === currentSlide) {
                    slide.classList.remove('hidden');
                    void slide.offsetWidth;
                    slide.classList.remove('opacity-0', 'translate-y-3');
                    slide.classList.add('opacity-100', 'translate-y-0');
                  } else {
                    slide.classList.remove('opacity-100', 'translate-y-0');
                    slide.classList.add('opacity-0', 'translate-y-3');
                    slide.classList.add('hidden');
                  }
                }

                if (visual) {
                  if (i === currentSlide) {
                    visual.style.opacity = '1';
                    visual.style.transform = 'scale(1.0)';
                    visual.style.zIndex = '10';
                    if (visual.tagName === 'VIDEO') {
                      try { visual.currentTime = 0; visual.play(); } catch(e) {}
                    }
                  } else {
                    visual.style.opacity = '0';
                    visual.style.transform = 'scale(1.02)';
                    visual.style.zIndex = '1';
                    if (visual.tagName === 'VIDEO') {
                      try { visual.pause(); } catch(e) {}
                    }
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

              if (visualCaption && captions[currentSlide - 1]) {
                visualCaption.textContent = captions[currentSlide - 1];
              }
              if (visualNum) {
                visualNum.textContent = (currentSlide < 10 ? '0' : '') + currentSlide;
              }
            }

            function startRotation() {
              stopRotation();
              rotateTimer = setInterval(function() {
                if (!isPaused) {
                  goToSlide(currentSlide + 1);
                }
              }, 5000);
            }

            function stopRotation() {
              if (rotateTimer) {
                clearInterval(rotateTimer);
                rotateTimer = null;
              }
            }

            heroSection.addEventListener('mouseenter', function() {
              isPaused = true;
            });
            heroSection.addEventListener('mouseleave', function() {
              isPaused = false;
            });

            // Keyboard accessibility
            var tablist = heroSection.querySelector('[role="tablist"]');
            if (tablist) {
              tablist.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                  e.preventDefault();
                  var next = currentSlide + 1;
                  if (next > totalSlides) next = 1;
                  window.njapHeroGoto(next);
                  var t = document.getElementById('hero-tab-' + next);
                  if (t) t.focus();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  var prev = currentSlide - 1;
                  if (prev < 1) prev = totalSlides;
                  window.njapHeroGoto(prev);
                  var t = document.getElementById('hero-tab-' + prev);
                  if (t) t.focus();
                }
              });
            }

            // Live CMS Update Hook (Updates all 6 Slides dynamically)
            window.njapUpdateHeroFromCMS = function(cmsList) {
              if (!Array.isArray(cmsList) || cmsList.length === 0) return;

              cmsList.forEach(function(item, idx) {
                var slideNum = item.order || (idx + 1);
                if (slideNum < 1 || slideNum > 6) return;

                // Update badge
                var badge = document.getElementById('hero-slide' + slideNum + '-badge-text');
                if (badge && item.category) badge.textContent = item.category;

                // Update title
                if (slideNum === 1) {
                  var h1 = document.getElementById('hero-single-h1');
                  if (h1 && item.title) h1.textContent = item.title;
                } else {
                  var tEl = document.getElementById('hero-slide' + slideNum + '-title');
                  if (tEl && item.title) tEl.textContent = item.title;
                }
                captions[slideNum - 1] = item.caption || item.title;

                // Update subtitle
                var desc = document.getElementById('hero-slide' + slideNum + '-desc');
                if (desc && item.subtitle) desc.innerHTML = item.subtitle.replace(/\\n/g, '<br>');

                // Update primary link
                var link = document.getElementById('hero-slide' + slideNum + '-link');
                var linkText = document.getElementById('hero-slide' + slideNum + '-link-text');
                if (link && item.linkUrl) link.href = item.linkUrl;
                if (linkText && item.linkText) linkText.textContent = item.linkText;

                // Update tab title
                var tabTitle = document.getElementById('hero-tab' + slideNum + '-title');
                if (tabTitle && item.category) tabTitle.textContent = item.category;

                // Update media
                var vis = document.getElementById('hero-visual-' + slideNum);
                var isV = item.mediaType === 'video' || /\\.(mp4|webm|mov|ogg|m4v)($|\\?)/i.test(item.mediaUrl || '') || (item.mediaUrl || '').indexOf('/uploads/videos/') !== -1;
                if (vis && item.mediaUrl) {
                  if (isV && vis.tagName === 'VIDEO') {
                    if (vis.src !== item.mediaUrl) {
                      vis.src = item.mediaUrl;
                      vis.load();
                    }
                  } else if (!isV && vis.tagName === 'IMG') {
                    vis.src = item.mediaUrl;
                  }
                }

                // If Slide 1 media changed, update the big screen video as well
                if (slideNum === 1 && video && item.mediaUrl && isV) {
                  if (video.src !== item.mediaUrl) {
                    video.src = item.mediaUrl;
                    video.load();
                    if (!isTransitioned) try { video.play(); } catch(e) {}
                  }
                }
              });

              goToSlide(currentSlide);
            };
          })();
        </script>
      </section>`;

// Replace in index.php
function updateIndexPHP() {
  const filePath = path.join(rootDir, 'index.php');
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  const existingHeroRegex = /<!-- 1\. Two-Phase Homepage Hero:[\s\S]*?<\/section>/;
  const oldBillboardRegex = /<!-- 1\. 100vw Panoramic Billboard Section \(At Top\) -->[\s\S]*?<section id="gallery-billboard-section"[\s\S]*?<\/section>/;

  if (existingHeroRegex.test(content)) {
    content = content.replace(existingHeroRegex, heroPHP);
    console.log('Replaced existing hero section in index.php');
  } else if (oldBillboardRegex.test(content)) {
    content = content.replace(oldBillboardRegex, heroPHP);
    console.log('Replaced old billboard section in index.php');
  }

  content = content.replace(
    /<h1 class="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-gray-950 leading-tight mb-3 tracking-tight group-hover:text-brand-blue transition-colors">([\s\S]*?)<\/h1>/,
    '<h2 class="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-gray-950 leading-tight mb-3 tracking-tight group-hover:text-brand-blue transition-colors">$1</h2>'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated index.php');
}

// Build clean static HTML for ko/index.html
function updateStaticIndexHTML() {
  const filePath = path.join(rootDir, 'ko/index.html');
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Generate static HTML version of the hero section with default 6 slides
  const mainVideoUrl = defaultSixSlides[0].mediaUrl;

  const slidesHTML = defaultSixSlides.map((s, idx) => {
    const slideNum = idx + 1;
    const isActive = (slideNum === 1);
    const secBtn = s.secondaryLinkUrl ? `
      <a id="hero-slide${slideNum}-sec-link" href="${s.secondaryLinkUrl}" class="hero-btn-white">
        <span>${s.secondaryLinkText || '더 알아보기'}</span>
      </a>` : '';

    return `
      <!-- SLIDE 0${slideNum}: ${s.category} -->
      <div id="hero-slide-${slideNum}" class="hero-slide ${isActive ? '' : 'hidden opacity-0 translate-y-3'}" data-slide="${slideNum}">
        <div>
          <span class="hero-pill-badge">
            <span class="w-2 h-2 rounded-full bg-[#7FC8C0] animate-pulse"></span>
            <span id="hero-slide${slideNum}-badge-text">${s.category}</span>
          </span>
        </div>
        ${slideNum === 1 ? `<h1 id="hero-single-h1" class="hero-main-title">${s.title}</h1>` : `<div id="hero-slide${slideNum}-title" class="hero-main-title">${s.title}</div>`}
        <p id="hero-slide${slideNum}-desc" class="hero-main-desc">
          ${s.subtitle.replace(/\n/g, '<br>')}
        </p>
        <div id="hero-slide${slideNum}-btn-row" class="hero-btn-row">
          <a id="hero-slide${slideNum}-link" href="${s.linkUrl}" class="hero-btn-primary">
            <span id="hero-slide${slideNum}-link-text">${s.linkText}</span>
            <svg class="hero-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
          </a>
          ${secBtn}
        </div>
      </div>`;
  }).join('\n');

  const visualsHTML = defaultSixSlides.map((s, idx) => {
    const slideNum = idx + 1;
    const isActive = (slideNum === 1);
    const style = isActive ? "opacity: 1; transform: scale(1.0); z-index: 10;" : "opacity: 0; transform: scale(1.02); z-index: 1;";
    if (s.mediaType === 'video') {
      return `<video id="hero-visual-${slideNum}" src="${s.mediaUrl}" autoplay muted loop playsinline webkit-playsinline class="hero-visual-img" style="${style} object-fit: cover;"></video>`;
    } else {
      return `<img id="hero-visual-${slideNum}" src="${s.mediaUrl}" alt="${s.title}" loading="${isActive ? 'eager' : 'lazy'}" class="hero-visual-img" style="${style}" />`;
    }
  }).join('\n');

  const tabsHTML = defaultSixSlides.map((s, idx) => {
    const slideNum = idx + 1;
    const isActive = (slideNum === 1);
    return `
      <button role="tab" id="hero-tab-${slideNum}" aria-controls="hero-slide-${slideNum}" aria-selected="${isActive ? 'true' : 'false'}" tabindex="${isActive ? '0' : '-1'}" onclick="window.njapHeroGoto(${slideNum})" class="hero-tab-item ${isActive ? 'active' : ''}">
        <span class="hero-tab-sub">하이라이트 0${slideNum}</span>
        <span id="hero-tab${slideNum}-title" class="hero-tab-title">${s.category}</span>
        <div class="hero-tab-bar"></div>
      </button>`;
  }).join('\n');

  const staticHeroHTML = `      <!-- 1. Two-Phase Homepage Hero: Clean Big Video Intro -> 6-Service Rotating Billboard (Shrinks Vertically by 35% on Transition) -->
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
          #homepage-hero-billboard-section * { box-sizing: border-box; }
          #homepage-hero-billboard-section.hero-phase-video { min-height: clamp(560px, 52vw, 700px); height: clamp(560px, 52vw, 700px); }
          #homepage-hero-billboard-section.hero-phase-billboard { min-height: clamp(365px, 34vw, 455px); height: auto; }
          .hero-main-title { font-size: 38px; font-weight: 800; line-height: 1.18; letter-spacing: -0.025em; color: #ffffff; margin: 0 0 12px 0; }
          @media (max-width: 1024px) { .hero-main-title { font-size: 32px; } }
          @media (max-width: 640px) { .hero-main-title { font-size: 26px; line-height: 1.22; margin: 0 0 10px 0; } }
          .hero-gradient-accent { background: linear-gradient(90deg, #7FC8C0 0%, #4FA3D1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block; }
          .hero-main-desc { font-size: 14.5px; color: rgba(255, 255, 255, 0.88); line-height: 1.55; max-width: 520px; margin: 0 0 20px 0; }
          @media (max-width: 640px) { .hero-main-desc { font-size: 13.5px; line-height: 1.5; margin: 0 0 16px 0; } }
          .hero-btn-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
          .hero-pill-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; border: 1px solid rgba(255, 255, 255, 0.22); background: rgba(255, 255, 255, 0.10); color: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25); margin-bottom: 10px; }
          .hero-btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #1B6FA8; color: #ffffff !important; padding: 11px 22px; border-radius: 10px; font-weight: 700; font-size: 14.5px; text-decoration: none; box-shadow: 0 4px 12px rgba(27, 111, 168, 0.4); transition: all 0.2s ease; white-space: nowrap; flex-shrink: 0; }
          .hero-btn-primary:hover { background: #155987; transform: translateY(-1px); }
          .hero-btn-white { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #ffffff; color: #0F2342 !important; padding: 11px 22px; border-radius: 10px; font-weight: 700; font-size: 14.5px; text-decoration: none; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); transition: all 0.2s ease; white-space: nowrap; flex-shrink: 0; }
          .hero-btn-white:hover { background: #f1f5f9; transform: translateY(-1px); }
          .hero-btn-icon { width: 14px; height: 14px; flex-shrink: 0; }
          .hero-card-container { position: relative; width: 100%; max-width: 440px; height: 235px; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.18); box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.75), 0 0 25px rgba(31, 111, 168, 0.25); background: #0B192C; }
          @media (max-width: 1023px) { .hero-card-container { max-width: 480px; height: 220px; margin: 0 auto; } }
          .hero-visual-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 20px; transition: opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1); }
          .hero-card-caption-bar { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(7, 19, 34, 0.95) 0%, rgba(7, 19, 34, 0.7) 65%, transparent 100%); padding: 20px 16px 12px 16px; display: flex; align-items: center; justify-content: space-between; z-index: 20; pointer-events: none; }
          .hero-card-caption-text { color: #ffffff; font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80%; }
          .hero-card-caption-num { color: rgba(255, 255, 255, 0.7); font-size: 11px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 600; white-space: nowrap; }
          .hero-slide { transition: opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1); }
          .hero-tabs-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; width: 100%; }
          @media (max-width: 960px) { .hero-tabs-grid { display: flex; overflow-x: auto; gap: 8px; padding-bottom: 4px; margin-left: -16px; margin-right: -16px; padding-left: 16px; padding-right: 16px; scrollbar-width: none; -webkit-overflow-scrolling: touch; } .hero-tab-item { flex: 0 0 135px; } }
          .hero-tab-item { text-align: left; padding: 8px 12px; border-radius: 10px; transition: all 0.2s ease; cursor: pointer; background: transparent; border: none; outline: none; }
          .hero-tab-item:hover { background: rgba(255, 255, 255, 0.05); }
          .hero-tab-item[aria-selected="true"] { background: rgba(255, 255, 255, 0.08); }
          .hero-tab-sub { font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: rgba(255, 255, 255, 0.45); display: block; margin-bottom: 2px; }
          .hero-tab-item[aria-selected="true"] .hero-tab-sub { color: #7FC8C0; }
          .hero-tab-title { font-size: 13px; font-weight: 700; color: rgba(255, 255, 255, 0.65); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
          .hero-tab-item[aria-selected="true"] .hero-tab-title { color: #ffffff; }
          .hero-tab-bar { height: 3px; border-radius: 9999px; margin-top: 6px; background: transparent; transition: all 0.3s ease; }
          .hero-tab-item[aria-selected="true"] .hero-tab-bar { background: linear-gradient(90deg, #7FC8C0, #4FA3D1); box-shadow: 0 0 10px rgba(127, 200, 192, 0.85); }
        </style>

        <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(circle at 75% 35%, rgba(31, 111, 168, 0.28) 0%, rgba(15, 35, 66, 0) 70%); z-index: 1;"></div>
        <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(circle at 20% 80%, rgba(127, 200, 192, 0.1) 0%, transparent 50%); z-index: 1;"></div>

        <!-- PHASE 1: Clean Cinematic Video Intro Layer (No Buttons, No Box) -->
        <div id="hero-video-phase" class="absolute inset-0 w-full h-full z-30 transition-opacity duration-500 overflow-hidden bg-slate-950 flex items-center justify-center">
          <video id="hero-intro-video" 
                 class="w-full h-full object-cover" 
                 autoplay 
                 muted 
                 playsinline 
                 webkit-playsinline 
                 preload="auto" 
                 src="${mainVideoUrl}"
                 poster="/uploads/images/billboard_video_poster.jpg"
                 style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
          </video>
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30 pointer-events-none"></div>

          <!-- Subtle Scroll Down Indicator -->
          <div class="absolute bottom-5 right-6 text-white/50 text-xs font-medium flex items-center gap-1.5 pointer-events-none hidden sm:flex">
            <svg class="w-3.5 h-3.5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
            <span>스크롤하여 서비스 바로보기</span>
          </div>
        </div>

        <!-- PHASE 2: Rotating Service Billboard Layer (Shrunk Vertically by 35% -> Exactly 6 Slides) -->
        <div id="hero-billboard-phase" class="relative w-full h-full z-10 opacity-0 pointer-events-none transition-opacity duration-500 flex flex-col justify-between py-5 sm:py-7 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" style="min-height: clamp(365px, 34vw, 455px);">
          
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center flex-1 my-auto">
            <div class="order-1 lg:order-1 lg:col-span-7 flex flex-col justify-center relative min-h-[240px] sm:min-h-[260px]">
              ${slidesHTML}
            </div>

            <div class="order-2 lg:order-2 lg:col-span-5 flex justify-center w-full">
              <div class="hero-card-container">
                ${visualsHTML}
                <div class="hero-card-caption-bar">
                  <span id="hero-visual-caption" class="hero-card-caption-text">NJ ACCESS PORTAL</span>
                  <span class="hero-card-caption-num"><span id="hero-visual-num">01</span> / 06</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-3 border-t border-white/10 w-full">
            <div role="tablist" aria-label="NJ Access Portal 서비스 하이라이트" class="hero-tabs-grid">
              ${tabsHTML}
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
            var visualCaption = document.getElementById('hero-visual-caption');
            var visualNum = document.getElementById('hero-visual-num');
            var singleH1 = document.getElementById('hero-single-h1');

            var sixSlides = ${JSON.stringify(defaultSixSlides)};
            var currentSlide = 1;
            var totalSlides = 6;
            var rotateTimer = null;
            var isTransitioned = false;
            var isPaused = false;
            var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            var captions = sixSlides.map(function(s) { return s.caption || s.title || ''; });

            function transitionToBillboard() {
              if (isTransitioned) return;
              isTransitioned = true;
              heroSection.classList.remove('hero-phase-video');
              heroSection.classList.add('hero-phase-billboard');
              if (videoPhase) videoPhase.style.opacity = '0';
              if (billboardPhase) {
                billboardPhase.style.opacity = '1';
                billboardPhase.style.pointerEvents = 'auto';
              }
              setTimeout(function() {
                if (videoPhase) {
                  videoPhase.style.display = 'none';
                  if (video) video.pause();
                }
              }, 500);
              goToSlide(1);
              if (!prefersReducedMotion) startRotation();
            }

            window.njapHeroTransition = transitionToBillboard;
            window.njapHeroGoto = function(n) {
              if (!isTransitioned) transitionToBillboard();
              goToSlide(n);
              stopRotation();
              if (!prefersReducedMotion) startRotation();
            };

            if (video) {
              var playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.catch(function() {
                  video.muted = true;
                  video.play().catch(function() {});
                });
              }
              video.addEventListener('ended', transitionToBillboard);
              video.addEventListener('error', transitionToBillboard);
              setTimeout(function() {
                if (!isTransitioned) transitionToBillboard();
              }, 45000);
            } else {
              transitionToBillboard();
            }

            var lastTouchY = 0;
            window.addEventListener('wheel', function(e) {
              if (!isTransitioned && e.deltaY > 10) transitionToBillboard();
            }, { passive: true });

            window.addEventListener('touchstart', function(e) {
              if (e.touches && e.touches[0]) lastTouchY = e.touches[0].clientY;
            }, { passive: true });

            window.addEventListener('touchmove', function(e) {
              if (!isTransitioned && e.touches && e.touches[0]) {
                var diff = lastTouchY - e.touches[0].clientY;
                if (diff > 18) transitionToBillboard();
              }
            }, { passive: true });

            window.addEventListener('scroll', function() {
              if (!isTransitioned && window.scrollY > 20) transitionToBillboard();
            }, { passive: true });

            function goToSlide(n) {
              if (n < 1) n = totalSlides;
              if (n > totalSlides) n = 1;
              currentSlide = n;

              for (var i = 1; i <= totalSlides; i++) {
                var slide = document.getElementById('hero-slide-' + i);
                var visual = document.getElementById('hero-visual-' + i);
                var tab = document.getElementById('hero-tab-' + i);

                if (slide) {
                  if (i === currentSlide) {
                    slide.classList.remove('hidden');
                    void slide.offsetWidth;
                    slide.classList.remove('opacity-0', 'translate-y-3');
                    slide.classList.add('opacity-100', 'translate-y-0');
                  } else {
                    slide.classList.remove('opacity-100', 'translate-y-0');
                    slide.classList.add('opacity-0', 'translate-y-3');
                    slide.classList.add('hidden');
                  }
                }

                if (visual) {
                  if (i === currentSlide) {
                    visual.style.opacity = '1';
                    visual.style.transform = 'scale(1.0)';
                    visual.style.zIndex = '10';
                    if (visual.tagName === 'VIDEO') {
                      try { visual.currentTime = 0; visual.play(); } catch(e) {}
                    }
                  } else {
                    visual.style.opacity = '0';
                    visual.style.transform = 'scale(1.02)';
                    visual.style.zIndex = '1';
                    if (visual.tagName === 'VIDEO') {
                      try { visual.pause(); } catch(e) {}
                    }
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

              if (visualCaption && captions[currentSlide - 1]) visualCaption.textContent = captions[currentSlide - 1];
              if (visualNum) visualNum.textContent = (currentSlide < 10 ? '0' : '') + currentSlide;
            }

            function startRotation() {
              stopRotation();
              rotateTimer = setInterval(function() {
                if (!isPaused) goToSlide(currentSlide + 1);
              }, 5000);
            }

            function stopRotation() {
              if (rotateTimer) {
                clearInterval(rotateTimer);
                rotateTimer = null;
              }
            }

            heroSection.addEventListener('mouseenter', function() { isPaused = true; });
            heroSection.addEventListener('mouseleave', function() { isPaused = false; });
          })();
        </script>
      </section>`;

  const existingHeroRegex = /<!-- 1\. Two-Phase Homepage Hero:[\s\S]*?<\/section>/;
  const oldBillboardRegex = /<!-- 1\. 100vw Panoramic Billboard Section \(At Top\) -->[\s\S]*?<section id="gallery-billboard-section"[\s\S]*?<\/section>/;

  if (existingHeroRegex.test(content)) {
    content = content.replace(existingHeroRegex, staticHeroHTML);
    console.log('Replaced existing hero section in ko/index.html');
  } else if (oldBillboardRegex.test(content)) {
    content = content.replace(oldBillboardRegex, staticHeroHTML);
    console.log('Replaced old billboard section in ko/index.html');
  }

  content = content.replace(
    /<h1 class="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-gray-950 leading-tight mb-3 tracking-tight group-hover:text-brand-blue transition-colors">([\s\S]*?)<\/h1>/,
    '<h2 class="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-gray-950 leading-tight mb-3 tracking-tight group-hover:text-brand-blue transition-colors">$1</h2>'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ko/index.html');
}

updateIndexPHP();
updateStaticIndexHTML();
console.log('Build completed successfully.');
