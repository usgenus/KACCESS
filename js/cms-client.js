/**
 * NJ Access Center - Dynamic CMS Frontend Loader
 * Powers Gallery Billboard, Medical Video News, and Dynamic News feeds.
 */

(function () {
  'use strict';

  // State
  let billboards = [];
  let currentBillboardIndex = 0;
  let billboardTimer = null;

  let videos = [];
  let currentVideo = null;
  let activeVideoCategory = '전체';

  let posts = [];

  // DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initBillboards();
    initMedicalVideos();
    initNewsFeeds();
  });

  // =========================================================
  // 1. GALLERY BILLBOARD SYSTEM (Before 의학비디오뉴스)
  // =========================================================
  async function initBillboards() {
    const container = document.getElementById('gallery-billboard-container');
    if (!container) return;

    try {
      const res = await fetch('/api/billboards.php?active_only=1');
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

    // Showcase Template
    container.innerHTML = `
      <div class="relative bg-[#091424] text-white rounded-3xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-500">
        <div class="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] items-stretch">
          
          <!-- Left Text Content -->
          <div class="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between z-10 relative">
            <div>
              <div class="flex items-center gap-2.5 mb-4">
                <span class="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                  ${b.category || 'SPECIAL SPOTLIGHT'}
                </span>
                <span class="text-xs font-mono text-white/50">BILLBOARD ${currentBillboardIndex + 1} / ${billboards.length}</span>
              </div>

              <h2 class="font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-snug mb-4">
                ${b.title}
              </h2>

              <p class="text-white/80 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                ${b.subtitle || ''}
              </p>
            </div>

            <!-- Action Button & Tab Indicators -->
            <div class="space-y-6 pt-4 border-t border-white/10">
              <div class="flex flex-wrap items-center gap-4">
                <a href="${b.linkUrl || '/about#contact'}" class="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-brand-blue hover:from-red-500 hover:to-blue-600 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-red-900/30 hover:scale-102 transition-all">
                  <span>${b.linkText || '자세히 보기'}</span>
                  <span>→</span>
                </a>
                <a href="tel:+18009997200" class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-3.5 rounded-2xl border border-white/15 transition-all">
                  <span>📞 1-800-999-7200</span>
                </a>
              </div>

              <!-- Billboard Selector Dots / Tabs -->
              <div class="flex items-center gap-2">
                ${billboards.map((item, idx) => `
                  <button onclick="window.cmsSelectBillboard(${idx})" 
                    class="h-2 rounded-full transition-all duration-300 ${
                      idx === currentBillboardIndex 
                        ? 'w-8 bg-red-500 shadow-md shadow-red-500/50' 
                        : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }" 
                    aria-label="Billboard slide ${idx + 1}">
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right Visual Billboard Media -->
          <div class="lg:col-span-6 relative min-h-[260px] lg:min-h-full overflow-hidden bg-slate-950">
            ${b.mediaType === 'video' || (b.mediaUrl && b.mediaUrl.endsWith('.mp4')) ? `
              <video src="${b.mediaUrl}" class="w-full h-full object-cover" autoplay muted loop playsinline></video>
            ` : `
              <img src="${b.mediaUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80'}" 
                alt="${b.title}" class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700">
            `}
            <div class="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#091424] via-transparent to-transparent"></div>
            
            <!-- Navigation arrows overlay -->
            <div class="absolute bottom-4 right-4 flex items-center gap-2 z-20">
              <button onclick="window.cmsPrevBillboard()" class="w-10 h-10 rounded-xl bg-black/60 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center text-sm transition-all shadow-lg">
                ‹
              </button>
              <button onclick="window.cmsNextBillboard()" class="w-10 h-10 rounded-xl bg-black/60 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center text-sm transition-all shadow-lg">
                ›
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    // Reset auto-rotate timer
    resetBillboardTimer();
  }

  function resetBillboardTimer() {
    if (billboardTimer) clearInterval(billboardTimer);
    if (billboards.length > 1) {
      billboardTimer = setInterval(() => {
        window.cmsNextBillboard();
      }, 6500);
    }
  }

  // Global window functions for event handlers
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

  // =========================================================
  // 2. MEDICAL VIDEO NEWS ('🎬 의학비디오뉴스')
  // =========================================================
  async function initMedicalVideos() {
    const section = document.getElementById('medical-videos-section');
    if (!section) return;

    try {
      const res = await fetch('/api/videos.php?active_only=1');
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        videos = data.data;
        currentVideo = videos[0];
        renderVideoCategories(data.categories || []);
        renderVideoPlayerAndList();
      }
    } catch (e) {
      console.warn('Medical videos CMS loading error:', e);
    }
  }

  function renderVideoCategories(categories) {
    const catContainer = document.getElementById('medical-videos-categories');
    if (!catContainer) return;

    const allCats = ['전체', ...categories];
    catContainer.innerHTML = allCats.map(cat => `
      <button onclick="window.cmsSetVideoCat('${cat}')" 
        class="text-xs font-semibold px-4 py-2 rounded-full transition-all whitespace-nowrap ${
          activeVideoCategory === cat 
            ? 'bg-red-600 text-white shadow-sm font-semibold' 
            : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium'
        }">
        ${cat}
      </button>
    `).join('');
  }

  function renderVideoPlayerAndList() {
    const playerBox = document.getElementById('medical-video-player-box');
    const infoBox = document.getElementById('medical-video-info-box');
    const listBox = document.getElementById('medical-videos-playlist');
    const countBadge = document.getElementById('medical-videos-count-badge');

    if (!currentVideo) return;

    // Filtered list
    const filtered = activeVideoCategory === '전체' 
      ? videos 
      : videos.filter(v => v.category === activeVideoCategory);

    if (countBadge) {
      countBadge.textContent = `${filtered.length}개 영상`;
    }

    // Render Main Video Player
    if (playerBox) {
      if (currentVideo.videoUrl && currentVideo.videoUrl.endsWith('.mp4')) {
        playerBox.innerHTML = `
          <video src="${currentVideo.videoUrl}" controls autoplay class="w-full h-full object-cover bg-black rounded-2xl"></video>
        `;
      } else if (currentVideo.youtubeId) {
        playerBox.innerHTML = `
          <iframe src="https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=1&rel=0" 
            title="${currentVideo.title}" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen 
            class="w-full h-full border-0 rounded-2xl"></iframe>
        `;
      } else {
        playerBox.innerHTML = `
          <div class="relative w-full h-full cursor-pointer group" onclick="window.cmsPlayActiveVideo()">
            <img src="${currentVideo.thumbnail}" alt="${currentVideo.title}" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-red-600 flex items-center justify-center text-2xl sm:text-3xl shadow-2xl group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all ring-4 ring-red-500/30">▶</div>
            </div>
            <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <span class="bg-red-600 text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-sm">${currentVideo.category}</span>
              <span class="bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-mono font-semibold px-2.5 py-1 rounded-md border border-slate-200/80 shadow-sm">⏱ ${currentVideo.duration}</span>
            </div>
          </div>
        `;
      }
    }

    // Render Main Video Info Box
    if (infoBox) {
      infoBox.innerHTML = `
        <div class="flex items-center gap-3 text-xs text-slate-500">
          <span class="font-bold text-brand-blue">${currentVideo.doctor || '의학 리포트'}</span>
          <span>·</span>
          <span>${currentVideo.hospital || 'Englewood Health Center for Korean Health'}</span>
          <span>·</span>
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-semibold text-xs border border-red-100">
            👁️ ${currentVideo.views || '10만회'}
          </span>
        </div>
        <h3 class="font-extrabold text-xl sm:text-2xl text-slate-900 leading-snug tracking-tight">
          ${currentVideo.title}
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
          ${currentVideo.summary || ''}
        </p>
      `;
    }

    // Render Playlist
    if (listBox) {
      listBox.innerHTML = filtered.map(v => {
        const isSelected = v.id === currentVideo.id;
        return `
          <div onclick="window.cmsSelectVideo('${v.id}')" 
            class="group p-3 rounded-2xl border transition-all cursor-pointer flex gap-3.5 items-center ${
              isSelected 
                ? 'bg-red-50/80 border-red-200/90 ring-1 ring-red-400/30 shadow-sm' 
                : 'bg-white border-slate-200/80 hover:bg-slate-50/80 hover:border-slate-300 shadow-xs hover:shadow-sm'
            }">
            <div class="relative w-28 h-18 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/80 shadow-xs">
              <img src="${v.thumbnail || (v.youtubeId ? `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg` : '')}" 
                alt="${v.title}" class="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full">
              <div class="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                  isSelected ? 'bg-red-600 text-white shadow-md' : 'bg-white/95 text-slate-700 group-hover:bg-red-600 group-hover:text-white shadow-sm'
                } transition-colors">▶</span>
              </div>
              <span class="absolute bottom-1 right-1 bg-white/90 backdrop-blur-sm text-[10px] text-slate-800 font-semibold px-1.5 py-0.5 rounded font-mono border border-slate-200/60 shadow-xs">${v.duration}</span>
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-[10px] font-bold text-brand-blue uppercase tracking-wider block mb-0.5">${v.category}</span>
              <h4 class="font-bold text-xs sm:text-sm leading-snug line-clamp-2 transition-colors ${
                isSelected ? 'text-red-600' : 'text-slate-900 group-hover:text-red-600'
              }">${v.title}</h4>
              <div class="flex items-center gap-2 text-[11px] text-slate-500 mt-1.5">
                <span class="truncate">${v.doctor}</span>
                <span>·</span>
                <span class="text-slate-700 font-semibold">${v.views}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  window.cmsSetVideoCat = function (cat) {
    activeVideoCategory = cat;
    renderVideoCategories(stateVideoCategories);
    renderVideoPlayerAndList();
  };

  let stateVideoCategories = [];
  window.cmsSelectVideo = function (id) {
    const v = videos.find(item => item.id === id);
    if (v) {
      currentVideo = v;
      renderVideoPlayerAndList();
    }
  };

  // =========================================================
  // 3. DYNAMIC NEWS & BLOG FEEDS
  // =========================================================
  async function initNewsFeeds() {
    try {
      const res = await fetch('/api/posts.php');
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        posts = data.data;
        updateBlogListings();
      }
    } catch (e) {
      console.warn('News CMS loading error:', e);
    }
  }

  function updateBlogListings() {
    // If on /blog or blog.html, update archive
    const blogContainer = document.getElementById('cms-blog-posts-grid');
    if (blogContainer) {
      blogContainer.innerHTML = posts.map(p => `
        <a class="group card-hover" href="/blog/${p.slug || p.id}">
          <article class="bg-white rounded-2xl overflow-hidden border border-brand-border h-full flex flex-col shadow-sm">
            <div class="relative h-52 overflow-hidden bg-gray-100">
              <img src="${p.coverImage || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80'}" 
                alt="${p.title}" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500">
              <div class="absolute top-3 left-3">
                <span class="tag-pill bg-brand-blue text-white font-bold text-xs px-3 py-1 rounded-full shadow">${p.category}</span>
              </div>
            </div>
            <div class="p-6 flex flex-col flex-1">
              <div class="flex items-center gap-3 text-xs font-sans text-brand-muted mb-3">
                <span>${p.date || '2026.08'}</span>
                <span>·</span>
                <span>⏱ ${p.readTime || '3분'} 읽기</span>
                <span>·</span>
                <span>${p.author || '편집부'}</span>
              </div>
              <h2 class="font-serif text-xl text-brand-dark leading-snug mb-3 line-clamp-2 group-hover:text-brand-blue transition-colors duration-200">${p.title}</h2>
              <p class="text-sm font-sans text-brand-muted leading-relaxed line-clamp-3 flex-1">${p.excerpt || ''}</p>
              <div class="mt-5 flex items-center gap-1 text-sm font-sans font-medium text-brand-blue">
                기사 읽기 <span class="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </div>
          </article>
        </a>
      `).join('');
    }
  }

})();
