/**
 * NJ Access Center - Dynamic CMS Client Loader (v2.7.0)
 * - 1920x566 Aspect Ratio Panoramic Billboard (Exact Dimensions, 100% Clickable)
 * - Medical Video Playlist with 4 Videos Display & 1,2,3,4 Pagination Navigation
 * - Real-Time API Sync & DOM Guardian
 */

(function () {
  'use strict';

  // Global State
  let billboards = [];
  let currentBillboardIndex = 0;
  let billboardTimer = null;

  let videos = [];
  let currentVideo = null;
  let activeVideoCategory = '전체';
  let stateVideoCategories = [];
  const VIDEOS_PER_PAGE = 4;
  let currentVideoPage = 1;

  let posts = [];
  let isHydrating = false;

  function isHomepage() {
    const p = window.location.pathname;
    return p === '/' || p === '/index.html' || p === '/index.php' || p === '';
  }

  // ---------------------------------------------------------
  // 1. DOM GUARDIAN: Ensure EXACTLY ONE Section Hierarchy
  // ---------------------------------------------------------
  function ensureHomepageSectionsExist() {
    if (!isHomepage()) return;

    // Clean up duplicate medical video sections
    const allVideoSections = Array.from(document.querySelectorAll('section')).filter(s => 
      s.id === 'medical-videos-section' || 
      (s.textContent && s.textContent.includes('의학비디오뉴스') && !s.classList.contains('bg-brand-darker'))
    );
    if (allVideoSections.length > 1) {
      for (let i = 1; i < allVideoSections.length; i++) {
        allVideoSections[i].remove();
      }
    }

    // Clean up duplicate billboard sections
    const allBillboardSections = Array.from(document.querySelectorAll('section')).filter(s => 
      s.id === 'gallery-billboard-section' || 
      s.querySelector('#gallery-billboard-container')
    );
    if (allBillboardSections.length > 1) {
      for (let i = 1; i < allBillboardSections.length; i++) {
        allBillboardSections[i].remove();
      }
    }

    // Locate Anchors
    const sections = Array.from(document.querySelectorAll('main section'));
    let topStorySection = sections.find(s => 
      s.textContent.includes('실시간 주요 뉴스') || 
      s.textContent.includes('TOP STORY')
    );

    let policySection = sections.find(s => 
      s.textContent.includes('보건 정책') || 
      s.textContent.includes('메디케어 리포트')
    );

    let oneStopSection = sections.find(s => 
      s.textContent.includes('원스톱') || 
      s.textContent.includes('PATIENT SERVICES') ||
      s.textContent.includes('SPECIAL COVERAGE')
    );

    let helplineSection = sections.find(s => 
      s.textContent.includes('24/7 KOREAN HELPLINE') || 
      s.textContent.includes('한국어 무료 의료 상담') ||
      s.textContent.includes('1-800-999-7200')
    );

    const mainContainer = policySection ? policySection.parentElement : (document.querySelector('main .max-w-7xl') || document.querySelector('main'));
    if (!mainContainer) return;

    // Ensure 100vw EDGE-TO-EDGE Billboard Section BEFORE Policy Section
    let billboardSec = document.getElementById('gallery-billboard-section');
    if (!billboardSec) {
      billboardSec = document.createElement('section');
      billboardSec.id = 'gallery-billboard-section';
      billboardSec.className = 'w-full font-sans bg-slate-950 my-4 overflow-hidden';
      billboardSec.style.cssText = 'width: 100vw !important; max-width: 100vw !important; position: relative !important; left: 50% !important; right: 50% !important; margin-left: -50vw !important; margin-right: -50vw !important; box-sizing: border-box !important; overflow: hidden !important;';
      billboardSec.innerHTML = `
        <div id="gallery-billboard-container" class="w-full relative group" style="width: 100vw !important; max-width: 100vw !important;">
          <div class="relative w-full overflow-hidden bg-slate-950 flex items-center justify-center text-white/50 text-xs animate-pulse" style="aspect-ratio: 1920 / 566; max-height: 480px;">
            파노라마 빌보드 로딩 중...
          </div>
        </div>
      `;

      if (policySection) {
        policySection.parentNode.insertBefore(billboardSec, policySection);
      } else if (topStorySection && topStorySection.nextSibling) {
        topStorySection.parentNode.insertBefore(billboardSec, topStorySection.nextSibling);
      } else {
        mainContainer.prepend(billboardSec);
      }
    } else {
      billboardSec.style.cssText = 'width: 100vw !important; max-width: 100vw !important; position: relative !important; left: 50% !important; right: 50% !important; margin-left: -50vw !important; margin-right: -50vw !important; box-sizing: border-box !important; overflow: hidden !important;';
      if (policySection && billboardSec.nextElementSibling !== policySection) {
        policySection.parentNode.insertBefore(billboardSec, policySection);
      }
    }

    // Ensure SINGLE Medical Videos Section (after One-stop, before Helpline)
    let videoSec = document.getElementById('medical-videos-section');
    if (!videoSec) {
      videoSec = document.createElement('section');
      videoSec.id = 'medical-videos-section';
      videoSec.className = 'w-full bg-gradient-to-b from-slate-50/60 via-white to-slate-50/60 py-12 sm:py-16 border-t border-b border-slate-200/60 font-sans my-4';
      videoSec.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-200/80 pb-5">
            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <span class="p-1.5 bg-red-50 text-red-600 rounded-lg text-lg border border-red-100 shadow-xs">🎬</span>
                <span class="text-[10px] font-bold text-red-600 uppercase tracking-widest block">MEDICAL VIDEO NEWS</span>
              </div>
              <h2 class="font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
                의학비디오뉴스
              </h2>
              <p class="text-xs sm:text-sm text-slate-600 mt-1.5 font-normal">
                한인 전문의와 병원이 직접 전하는 검증된 최신 의학 정보 및 건강 가이드
              </p>
            </div>
            <div id="medical-videos-categories" class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <!-- Dynamically populated categories -->
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
              <div id="medical-video-player-box" class="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-200/80">
                <!-- Main Video Embed -->
              </div>
              <div id="medical-video-info-box" class="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-2.5">
                <!-- Main Video Info -->
              </div>
            </div>

            <div class="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
              <div class="flex items-center justify-between px-1">
                <h3 class="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                  추천 의학 영상 플레이리스트
                </h3>
                <span id="medical-videos-count-badge" class="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  영상 목록
                </span>
              </div>
              <div id="medical-videos-playlist" class="flex flex-col gap-3">
                <!-- Dynamic 4 Video Cards -->
              </div>
              <div id="medical-videos-pagination" class="flex items-center justify-between pt-3 border-t border-slate-200/80">
                <!-- Dynamic 1,2,3,4 Pagination Navigation -->
              </div>
            </div>
          </div>
        </div>
      `;

      if (oneStopSection && oneStopSection.nextSibling) {
        oneStopSection.parentNode.insertBefore(videoSec, oneStopSection.nextSibling);
      } else if (helplineSection) {
        helplineSection.parentNode.insertBefore(videoSec, helplineSection);
      } else {
        mainContainer.appendChild(videoSec);
      }
    } else if (oneStopSection && videoSec.previousElementSibling !== oneStopSection && helplineSection) {
      helplineSection.parentNode.insertBefore(videoSec, helplineSection);
    }
  }


  // ---------------------------------------------------------
  // 2. 1920x566 PANORAMIC BILLBOARD SYSTEM
  // ---------------------------------------------------------
  async function initBillboards() {
    ensureHomepageSectionsExist();
    const container = document.getElementById('gallery-billboard-container');
    if (!container) return;

    try {
      const res = await fetch(`/api/billboards.php?_t=${Date.now()}`, {
        cache: 'no-store'
      });
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        billboards = data.data;
        renderBillboardShowcase();
      }
    } catch (e) {
      console.warn('Billboard CMS loading error:', e);
    }
  }

  function renderBillboardShowcase() {
    const container = document.getElementById('gallery-billboard-container');
    if (!container || billboards.length === 0) return;

    const b = billboards[currentBillboardIndex] || billboards[0];
    const isVideo = b.mediaType === 'video' || (b.mediaUrl && (b.mediaUrl.endsWith('.mp4') || b.mediaUrl.endsWith('.webm')));
    const targetLink = b.linkUrl || '/about#contact';

    // 1920 x 566 exact aspect ratio spanning full screen width
    container.innerHTML = `
      <div class="relative w-full overflow-hidden bg-slate-950 select-none group"
        style="aspect-ratio: 1920 / 566; max-height: 480px;"
        onmouseenter="window.cmsPauseBillboard()" onmouseleave="window.cmsResumeBillboard()">
        
        <!-- Fully Clickable Panoramic Banner Across Screen -->
        <a href="${targetLink}" class="block relative w-full h-full cursor-pointer" title="${escapeHtml(b.title)}">
          
          <!-- Panoramic Image / Video -->
          <div class="w-full h-full relative overflow-hidden">
            ${isVideo ? `
              <video src="${b.mediaUrl}" class="w-full h-full object-cover" autoplay muted loop playsinline></video>
            ` : `
              <img src="${b.mediaUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=2000&q=85&auto=format'}" 
                alt="${escapeHtml(b.title)}" 
                class="w-full h-full object-cover transform scale-100 group-hover:scale-103 transition-transform duration-1000 ease-out">
            `}
            <!-- Gradient Vignette -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/15 pointer-events-none"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-black/25 pointer-events-none"></div>
          </div>

          <!-- Bottom Text Overlay inside page container -->
          <div class="absolute inset-0 flex items-end">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-4 sm:pb-6 flex items-end justify-between gap-4">
              
              <div class="max-w-3xl space-y-1 sm:space-y-2">
                <div class="flex items-center gap-2">
                  ${b.category ? `
                    <span class="bg-red-600 text-white text-[10px] sm:text-xs font-extrabold px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow">
                      ${escapeHtml(b.category)}
                    </span>
                  ` : ''}
                  <span class="text-xs font-mono text-white/80 bg-black/60 px-2.5 py-0.5 rounded-full border border-white/15">
                    ${currentBillboardIndex + 1} / ${billboards.length}
                  </span>
                </div>

                <h3 class="font-extrabold text-base sm:text-2xl md:text-3xl text-white tracking-tight leading-snug drop-shadow-md group-hover:text-blue-300 transition-colors line-clamp-1">
                  ${escapeHtml(b.title)}
                </h3>

                <p class="text-white/85 text-xs sm:text-sm line-clamp-1 max-w-2xl font-normal drop-shadow hidden sm:block">
                  ${escapeHtml(b.subtitle || '')}
                </p>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <span class="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-brand-blue group-hover:from-red-500 group-hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-xl transition-all">
                  <span>${escapeHtml(b.linkText || '자세히 보기')}</span>
                  <span>→</span>
                </span>
              </div>

            </div>
          </div>
        </a>

        <!-- Left Navigation Arrow -->
        <button onclick="event.stopPropagation(); event.preventDefault(); window.cmsPrevBillboard();" 
          class="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center text-xl sm:text-3xl transition-all duration-200 z-20 hover:scale-110 shadow-2xl cursor-pointer"
          aria-label="Previous Slide">
          ‹
        </button>

        <!-- Right Navigation Arrow -->
        <button onclick="event.stopPropagation(); event.preventDefault(); window.cmsNextBillboard();" 
          class="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center text-xl sm:text-3xl transition-all duration-200 z-20 hover:scale-110 shadow-2xl cursor-pointer"
          aria-label="Next Slide">
          ›
        </button>

        <!-- Center Bottom Dots Indicator -->
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          ${billboards.map((item, idx) => `
            <button onclick="event.stopPropagation(); event.preventDefault(); window.cmsSelectBillboard(${idx});" 
              class="h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentBillboardIndex 
                  ? 'w-6 sm:w-8 bg-white shadow-lg ring-1 ring-white/50' 
                  : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/80'
              }" 
              aria-label="Billboard slide ${idx + 1}">
            </button>
          `).join('')}
        </div>

      </div>
    `;

    resetBillboardTimer();
  }

  function resetBillboardTimer() {
    if (billboardTimer) clearInterval(billboardTimer);
    if (billboards.length > 1) {
      billboardTimer = setInterval(() => {
        window.cmsNextBillboard();
      }, 4000); // 4-second auto rotation
    }
  }

  window.cmsPauseBillboard = function () {
    if (billboardTimer) clearInterval(billboardTimer);
  };

  window.cmsResumeBillboard = function () {
    resetBillboardTimer();
  };

  window.cmsSelectBillboard = function (idx) {
    currentBillboardIndex = idx;
    renderBillboardShowcase();
  };

  window.cmsNextBillboard = function () {
    if (billboards.length <= 1) return;
    currentBillboardIndex = (currentBillboardIndex + 1) % billboards.length;
    renderBillboardShowcase();
  };

  window.cmsPrevBillboard = function () {
    if (billboards.length <= 1) return;
    currentBillboardIndex = (currentBillboardIndex - 1 + billboards.length) % billboards.length;
    renderBillboardShowcase();
  };


  // ---------------------------------------------------------
  // 3. MEDICAL VIDEO NEWS ('🎬 의학비디오뉴스')
  // ---------------------------------------------------------
  async function initMedicalVideos() {
    ensureHomepageSectionsExist();
    const section = document.getElementById('medical-videos-section');
    if (!section) return;

    try {
      const res = await fetch(`/api/videos.php?_t=${Date.now()}`, {
        cache: 'no-store'
      });
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        videos = data.data;
        if (!currentVideo || !videos.some(v => v.id === currentVideo.id)) {
          currentVideo = videos[0];
        }
        stateVideoCategories = data.categories || [];
        renderVideoCategories(stateVideoCategories);
        renderVideoPlayerAndList();
      }
    } catch (e) {
      console.warn('Medical videos CMS loading error:', e);
    }
  }

  function renderVideoCategories(categories) {
    const catContainer = document.getElementById('medical-videos-categories');
    if (!catContainer) return;

    const allCats = ['전체', ...categories.filter(c => c !== '전체')];
    catContainer.innerHTML = allCats.map(cat => `
      <button onclick="window.cmsSetVideoCat('${escapeHtml(cat)}')" 
        class="text-xs font-semibold px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer ${
          activeVideoCategory === cat 
            ? 'bg-red-600 text-white shadow-sm font-semibold' 
            : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium'
        }">
        ${escapeHtml(cat)}
      </button>
    `).join('');
  }

  function renderVideoPlayerAndList() {
    const playerBox = document.getElementById('medical-video-player-box');
    const infoBox = document.getElementById('medical-video-info-box');
    const listBox = document.getElementById('medical-videos-playlist');
    const paginationBox = document.getElementById('medical-videos-pagination');
    const countBadge = document.getElementById('medical-videos-count-badge');

    if (!currentVideo) return;

    const filtered = activeVideoCategory === '전체' 
      ? videos 
      : videos.filter(v => v.category === activeVideoCategory);

    const totalPages = Math.ceil(filtered.length / VIDEOS_PER_PAGE) || 1;
    if (currentVideoPage > totalPages) {
      currentVideoPage = 1;
    }

    if (countBadge) {
      countBadge.textContent = `${filtered.length}개 영상`;
    }

    // 1. Main Video Player
    if (playerBox) {
      if (currentVideo.videoUrl && (currentVideo.videoUrl.endsWith('.mp4') || currentVideo.videoUrl.endsWith('.webm'))) {
        playerBox.innerHTML = `
          <video src="${currentVideo.videoUrl}" controls autoplay class="w-full h-full object-cover bg-black rounded-3xl"></video>
        `;
      } else if (currentVideo.youtubeId) {
        playerBox.innerHTML = `
          <iframe src="https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=1&rel=0" 
            title="${escapeHtml(currentVideo.title)}" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen 
            class="w-full h-full border-0 rounded-3xl"></iframe>
        `;
      } else {
        playerBox.innerHTML = `
          <div class="relative w-full h-full cursor-pointer group">
            <img src="${currentVideo.thumbnail || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'}" alt="${escapeHtml(currentVideo.title)}" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-red-600 flex items-center justify-center text-2xl sm:text-3xl shadow-2xl group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all ring-4 ring-red-500/30">▶</div>
            </div>
            <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <span class="bg-red-600 text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-sm">${escapeHtml(currentVideo.category)}</span>
              <span class="bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-mono font-semibold px-2.5 py-1 rounded-md border border-slate-200/80 shadow-sm">⏱ ${escapeHtml(currentVideo.duration || '00:00')}</span>
            </div>
          </div>
        `;
      }
    }

    // 2. Main Video Info Box
    if (infoBox) {
      infoBox.innerHTML = `
        <div class="flex items-center gap-3 text-xs text-slate-500">
          <span class="font-bold text-brand-blue">${escapeHtml(currentVideo.doctor || '의학 리포트')}</span>
          <span>·</span>
          <span>${escapeHtml(currentVideo.hospital || 'Englewood Health Center for Korean Health')}</span>
          <span>·</span>
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-semibold text-xs border border-red-100">
            👁️ ${escapeHtml(currentVideo.views || '10만회')}
          </span>
        </div>
        <h3 class="font-extrabold text-xl sm:text-2xl text-slate-900 leading-snug tracking-tight">
          ${escapeHtml(currentVideo.title)}
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
          ${escapeHtml(currentVideo.summary || '')}
        </p>
      `;
    }

    // 3. Right-Side Playlist: Display Exactly 4 Videos
    if (listBox) {
      const startIndex = (currentVideoPage - 1) * VIDEOS_PER_PAGE;
      const pageVideos = filtered.slice(startIndex, startIndex + VIDEOS_PER_PAGE);

      if (pageVideos.length === 0) {
        listBox.innerHTML = `
          <div class="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 text-slate-400 text-xs font-medium">
            등록된 영상이 없습니다.
          </div>
        `;
      } else {
        listBox.innerHTML = pageVideos.map(v => {
          const isSelected = v.id === currentVideo.id;
          const thumb = v.thumbnail || (v.youtubeId ? `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80');
          return `
            <div onclick="window.cmsSelectVideo('${v.id}')" 
              class="group p-3 rounded-2xl border transition-all cursor-pointer flex gap-3.5 items-center ${
                isSelected 
                  ? 'bg-red-50/80 border-red-200/90 ring-1 ring-red-400/30 shadow-sm' 
                  : 'bg-white border-slate-200/80 hover:bg-slate-50/80 hover:border-slate-300 shadow-xs hover:shadow-sm'
              }">
              <div class="relative w-28 h-18 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/80 shadow-xs">
                <img src="${thumb}" 
                  alt="${escapeHtml(v.title)}" class="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full">
                <div class="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                  <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                    isSelected ? 'bg-red-600 text-white shadow-md' : 'bg-white/95 text-slate-700 group-hover:bg-red-600 group-hover:text-white shadow-sm'
                  } transition-colors">▶</span>
                </div>
                <span class="absolute bottom-1 right-1 bg-white/90 backdrop-blur-sm text-[10px] text-slate-800 font-semibold px-1.5 py-0.5 rounded font-mono border border-slate-200/60 shadow-xs">${escapeHtml(v.duration || '00:00')}</span>
              </div>
              <div class="flex-1 min-w-0">
                <span class="text-[10px] font-bold text-brand-blue uppercase tracking-wider block mb-0.5">${escapeHtml(v.category)}</span>
                <h4 class="font-bold text-xs sm:text-sm leading-snug line-clamp-2 transition-colors ${
                  isSelected ? 'text-red-600' : 'text-slate-900 group-hover:text-red-600'
                }">${escapeHtml(v.title)}</h4>
                <div class="flex items-center gap-2 text-[11px] text-slate-500 mt-1.5">
                  <span class="truncate">${escapeHtml(v.doctor || '의학 전문의')}</span>
                  <span>·</span>
                  <span class="text-slate-700 font-semibold">${escapeHtml(v.views || '조회수')}</span>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 4. Pagination Navigation Bar (1, 2, 3, 4, Next Video Buttons)
    if (paginationBox) {
      let pageNumbersHtml = '';
      for (let p = 1; p <= totalPages; p++) {
        const isCurrent = p === currentVideoPage;
        pageNumbersHtml += `
          <button onclick="window.cmsSetVideoPage(${p})" 
            class="w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isCurrent 
                ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-300' 
                : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }">
            ${p}
          </button>
        `;
      }

      const hasPrev = currentVideoPage > 1;
      const hasNext = currentVideoPage < totalPages;

      paginationBox.innerHTML = `
        <button onclick="window.cmsPrevVideoPage()" 
          class="flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition-all ${
            hasPrev ? 'hover:bg-slate-100 hover:text-slate-900 cursor-pointer shadow-xs' : 'opacity-40 cursor-not-allowed'
          }" ${!hasPrev ? 'disabled' : ''}>
          <span>‹</span> <span>이전 영상</span>
        </button>

        <div class="flex items-center gap-1.5 overflow-x-auto py-0.5">
          ${pageNumbersHtml}
        </div>

        <button onclick="window.cmsNextVideoPage()" 
          class="flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition-all ${
            hasNext ? 'hover:bg-red-600 hover:text-white hover:border-red-600 cursor-pointer shadow-xs' : 'opacity-40 cursor-not-allowed'
          }" ${!hasNext ? 'disabled' : ''}>
          <span>다음 영상</span> <span>›</span>
        </button>
      `;
    }
  }

  window.cmsSetVideoCat = function (cat) {
    activeVideoCategory = cat;
    currentVideoPage = 1;
    renderVideoCategories(stateVideoCategories);
    renderVideoPlayerAndList();
  };

  window.cmsSetVideoPage = function (page) {
    currentVideoPage = page;
    renderVideoPlayerAndList();
  };

  window.cmsPrevVideoPage = function () {
    if (currentVideoPage > 1) {
      currentVideoPage--;
      renderVideoPlayerAndList();
    }
  };

  window.cmsNextVideoPage = function () {
    const filtered = activeVideoCategory === '전체' 
      ? videos 
      : videos.filter(v => v.category === activeVideoCategory);
    const totalPages = Math.ceil(filtered.length / VIDEOS_PER_PAGE) || 1;
    if (currentVideoPage < totalPages) {
      currentVideoPage++;
      renderVideoPlayerAndList();
    }
  };

  window.cmsSelectVideo = function (id) {
    const v = videos.find(item => item.id === id);
    if (v) {
      currentVideo = v;
      renderVideoPlayerAndList();
    }
  };


  // ---------------------------------------------------------
  // 4. DYNAMIC NEWS & BLOG FEEDS
  // ---------------------------------------------------------
  async function initNewsFeeds() {
    try {
      const res = await fetch(`/api/posts.php?_t=${Date.now()}`, {
        cache: 'no-store'
      });
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        posts = data.data;
        if (isHomepage()) {
          updateHomepageNewsings();
        }
        if (window.location.pathname.includes('/blog')) {
          updateBlogListings();
        }
      }
    } catch (e) {
      console.warn('News CMS loading error:', e);
    }
  }

  function updateHomepageNewsings() {
    if (!posts || posts.length === 0) return;

    const top = posts.find(p => p.isTopStory) || posts[0];
    const otherPosts = posts.filter(p => p.id !== top.id);

    // 1. Target Top Story Container
    const topStoryBox = document.getElementById('homepage-top-story-box') 
      || document.querySelector('main section .grid.grid-cols-1.lg\\:grid-cols-12 > div:first-child');
    
    if (topStoryBox) {
      const summaryList = (top.summaryPoints && top.summaryPoints.length > 0)
        ? top.summaryPoints
        : ['공식 당국 승인 안전 가이드라인 적용 및 자진 리콜 조치', '뉴저지 거주 한인 대상 한국어 무료 상담 창구 운영', '처방약 복용 시 주의 사항 및 환불·교환 절차 안내'];

      topStoryBox.innerHTML = `
        <a class="group block" href="/blog/${top.slug || top.id}">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span class="text-xs font-bold text-red-600 uppercase tracking-widest">${escapeHtml(top.category || '주요 뉴스')}</span>
            <span class="text-xs text-gray-400">·</span>
            <span class="text-xs text-gray-500">${escapeHtml(top.date || '2026년')}</span>
          </div>
          <h1 class="font-sans font-extrabold text-2xl sm:text-4xl text-gray-950 leading-tight mb-4 tracking-tight group-hover:text-brand-blue transition-colors">
            ${escapeHtml(top.title)}
          </h1>
          <div class="relative h-64 sm:h-96 w-full rounded-xl overflow-hidden mb-5 bg-gray-100 shadow-sm">
            <img src="${top.coverImage || 'https://images.unsplash.com/photo-1628771065117-74ccb5690668?w=1200&q=80'}" 
              alt="${escapeHtml(top.title)}" 
              class="object-cover group-hover:scale-102 transition-transform duration-500 w-full h-full">
          </div>
          <p class="text-gray-700 text-sm sm:text-base leading-relaxed mb-5">
            ${escapeHtml(top.excerpt || '')}
          </p>
        </a>
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200/80 mb-5">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">핵심 요약</p>
          <ul class="space-y-1.5 text-xs sm:text-sm text-gray-800 font-medium">
            ${summaryList.slice(0, 3).map(pt => `
              <li class="flex items-start gap-2">
                <span class="text-red-600 font-bold">•</span>
                <span>${escapeHtml(pt)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        <div class="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <span class="font-bold text-gray-900">${escapeHtml(top.author || '편집부')}</span>
            <span>·</span>
            <span>⏱ ${escapeHtml(top.readTime || '3분')} 읽기</span>
          </div>
          <span class="text-red-600 font-semibold text-[11px] uppercase tracking-wider">TOP STORY</span>
        </div>
      `;
    }

    // 2. Target Latest News List
    const latestBox = document.getElementById('homepage-latest-news-box') 
      || document.querySelector('main section .grid.grid-cols-1.lg\\:grid-cols-12 > div:last-child .divide-y');
    
    if (latestBox && otherPosts.length > 0) {
      const latestItems = otherPosts.slice(0, 4);
      latestBox.innerHTML = latestItems.map(p => `
        <a class="group py-3.5 first:pt-0 last:pb-0 flex gap-4 items-start" href="/blog/${p.slug || p.id}">
          <div class="flex-1 min-w-0">
            <span class="text-[11px] font-bold text-brand-blue uppercase tracking-wide block mb-1">${escapeHtml(p.category || '뉴스')}</span>
            <h3 class="font-bold text-sm sm:text-base text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors">
              ${escapeHtml(p.title)}
            </h3>
            <div class="flex items-center gap-2 text-[11px] text-gray-400 mt-2">
              <span>${escapeHtml(p.date || '')}</span>
              <span>·</span>
              <span>${escapeHtml(p.readTime || '3분')}</span>
            </div>
          </div>
          <div class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
            <img src="${p.coverImage || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80'}" 
              alt="${escapeHtml(p.title)}" 
              class="object-cover group-hover:scale-105 transition-transform w-full h-full">
          </div>
        </a>
      `).join('');
    }

    // 3. Policy & Reports 4-card Grid
    const reportsGrid = document.getElementById('homepage-reports-grid')
      || document.querySelector('main section:nth-of-type(2) .grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4');
    
    if (reportsGrid && otherPosts.length > 4) {
      const reportItems = otherPosts.slice(4, 8);
      reportsGrid.innerHTML = reportItems.map(p => `
        <a class="group card-hover" href="/blog/${p.slug || p.id}">
          <article class="bg-white rounded-2xl p-4 border border-gray-200/90 h-full flex flex-col justify-between shadow-sm">
            <div>
              <div class="relative h-40 w-full rounded-xl overflow-hidden mb-3 bg-gray-100">
                <img src="${p.coverImage || 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80'}" 
                  alt="${escapeHtml(p.title)}" 
                  class="object-cover group-hover:scale-105 transition-transform duration-500 w-full h-full">
              </div>
              <span class="text-[11px] font-bold text-red-600 uppercase tracking-wider block mb-1">${escapeHtml(p.category || '리포트')}</span>
              <h3 class="font-bold text-base text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-brand-blue transition-colors">
                ${escapeHtml(p.title)}
              </h3>
              <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                ${escapeHtml(p.excerpt || '')}
              </p>
            </div>
            <div class="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-gray-100">
              <span>${escapeHtml(p.date || '')}</span>
              <span>⏱ ${escapeHtml(p.readTime || '3분')}</span>
            </div>
          </article>
        </a>
      `).join('');
    }
  }

  function updateBlogListings() {
    if (!window.location.pathname.includes('/blog')) return; // STRICT CHECK: NEVER RUN ON HOMEPAGE
    const blogContainer = document.getElementById('cms-blog-posts-grid')
      || document.querySelector('main .grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3')
      || document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
    
    if (blogContainer && posts.length > 0) {
      blogContainer.innerHTML = posts.map(p => `
        <a class="group card-hover" href="/blog/${p.slug || p.id}">
          <article class="bg-white rounded-2xl overflow-hidden border border-brand-border h-full flex flex-col shadow-sm">
            <div class="relative h-52 overflow-hidden bg-gray-100">
              <img src="${p.coverImage || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80'}" 
                alt="${escapeHtml(p.title)}" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500">
              <div class="absolute top-3 left-3">
                <span class="tag-pill bg-brand-blue text-white font-bold text-xs px-3 py-1 rounded-full shadow">${escapeHtml(p.category || '건강 뉴스')}</span>
              </div>
            </div>
            <div class="p-6 flex flex-col flex-1">
              <div class="flex items-center gap-3 text-xs font-sans text-brand-muted mb-3">
                <span>${escapeHtml(p.date || '2026.08')}</span>
                <span>·</span>
                <span>⏱ ${escapeHtml(p.readTime || '3분')} 읽기</span>
                <span>·</span>
                <span>${escapeHtml(p.author || '편집부')}</span>
              </div>
              <h2 class="font-serif text-xl text-brand-dark leading-snug mb-3 line-clamp-2 group-hover:text-brand-blue transition-colors duration-200">${escapeHtml(p.title)}</h2>
              <p class="text-sm font-sans text-brand-muted leading-relaxed line-clamp-3 flex-1">${escapeHtml(p.excerpt || '')}</p>
              <div class="mt-5 flex items-center gap-1 text-sm font-sans font-medium text-brand-blue">
                기사 읽기 <span class="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </div>
          </article>
        </a>
      `).join('');
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ---------------------------------------------------------
  // 5. BRAND LOGO ENHANCER (Exact Door + Key + NJAP Mark)
  // ---------------------------------------------------------
  function updateHeaderAndFooterLogos() {
    // 1. Navigation Header Brand Links
    document.querySelectorAll('nav a[href="/"], header a[href="/"]').forEach(a => {
      if (a.querySelector('.njap-nav-logo-icon')) return;
      if (a.textContent && a.textContent.includes('NJ Access Center')) {
        a.style.display = 'flex';
        a.style.alignItems = 'center';
        a.style.gap = '10px';
        const iconDiv = document.createElement('div');
        iconDiv.className = 'njap-nav-logo-icon flex-shrink-0';
        iconDiv.style.cssText = 'width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;';
        iconDiv.innerHTML = '<img src="/logo-icon.svg" alt="NJAP Logo" style="width: 100%; height: 100%; object-fit: contain; color: #1E3A8A;" class="transition-transform group-hover:scale-105">';
        a.prepend(iconDiv);
      }
    });

    // 2. Footer Brand Links
    document.querySelectorAll('footer a[href="/"]').forEach(a => {
      if (a.querySelector('.njap-footer-logo-icon')) return;
      if (a.textContent && a.textContent.includes('NJ Access Center')) {
        a.style.display = 'inline-flex';
        a.style.alignItems = 'center';
        a.style.gap = '12px';
        const iconDiv = document.createElement('div');
        iconDiv.className = 'njap-footer-logo-icon flex-shrink-0';
        iconDiv.style.cssText = 'width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;';
        iconDiv.innerHTML = '<img src="/logo-icon.svg" alt="NJAP Logo" style="width: 100%; height: 100%; object-fit: contain; filter: invert(1) brightness(2);" class="transition-transform group-hover:scale-105">';
        a.prepend(iconDiv);
      }
    });
  }

  // ---------------------------------------------------------
  // 6. HYDRATION & DOM WATCHDOG ENGINE
  // ---------------------------------------------------------
  function runAll() {
    if (isHydrating) return;
    isHydrating = true;
    try {
      updateHeaderAndFooterLogos();
      ensureHomepageSectionsExist();
      initBillboards();
      initMedicalVideos();
      initNewsFeeds();
    } finally {
      isHydrating = false;
    }
  }

  // Initial runs
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAll);
  } else {
    runAll();
  }
  window.addEventListener('load', runAll);

  // Multi-tier timer checkpoints
  [50, 150, 350, 700, 1200, 2000, 3500].forEach(ms => setTimeout(runAll, ms));

  // Persistent MutationObserver
  if (window.MutationObserver) {
    const observer = new MutationObserver(function (mutations) {
      if (isHomepage()) {
        const billboardPresent = Boolean(document.getElementById('gallery-billboard-section'));
        const videoPresent = Boolean(document.getElementById('medical-videos-section'));
        const allVideoSections = Array.from(document.querySelectorAll('section')).filter(s => 
          s.id === 'medical-videos-section' || 
          (s.textContent && s.textContent.includes('의학비디오뉴스') && !s.classList.contains('bg-brand-darker'))
        );
        if (!billboardPresent || !videoPresent || allVideoSections.length > 1) {
          runAll();
        }
      }
    });

    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true
    });
  }

  // Heartbeat watchdog (every 2.5 seconds)
  setInterval(function () {
    if (isHomepage()) {
      const billboardPresent = Boolean(document.getElementById('gallery-billboard-section'));
      const videoPresent = Boolean(document.getElementById('medical-videos-section'));
      const allVideoSections = Array.from(document.querySelectorAll('section')).filter(s => 
        s.id === 'medical-videos-section' || 
        (s.textContent && s.textContent.includes('의학비디오뉴스') && !s.classList.contains('bg-brand-darker'))
      );
      if (!billboardPresent || !videoPresent || allVideoSections.length > 1) {
        runAll();
      }
    }
  }, 2500);

})();
