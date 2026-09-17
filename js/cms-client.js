/**
 * Healthcare Access Portal - Dynamic CMS Client Loader (v3.2.0)
 * Fixes applied:
 * - Home button nav from all pages
 * - Mobile menu toggle (finds button by aria-label="Menu")
 * - Billboard image hover scale effect
 * - Video does NOT autoplay on page load (thumbnail + click to play)
 * - Section slide-in animation on scroll (IntersectionObserver)
 */

(function () {
  'use strict';

  // ---------------------------------------------------------
  // UTILITY: HTML escape (used throughout all render functions)
  // ---------------------------------------------------------
  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ---------------------------------------------------------
  // 0. SLIDE-IN ANIMATION STYLES + BILLBOARD HOVER SCALE
  // ---------------------------------------------------------
  (function injectStyles() {
    if (document.getElementById('njap-slidein-style')) return;
    var style = document.createElement('style');
    style.id = 'njap-slidein-style';
    style.textContent = [
      '.h-\\[109px\\], .header-spacer, #header-spacer {',
      '  height: 109px !important;',
      '  min-height: 109px !important;',
      '  display: block !important;',
      '  width: 100% !important;',
      '}',
      '.h-\\[45px\\] {',
      '  height: 45px !important;',
      '}',
      '#gallery-billboard-section, #gallery-billboard-container {',
      '  opacity: 1 !important;',
      '  transform: none !important;',
      '  display: block !important;',
      '  visibility: visible !important;',
      '}',
      '@media (max-width: 640px) {',
      '  #gallery-billboard-section {',
      '    margin-top: 0 !important;',
      '    margin-bottom: 1.25rem !important;',
      '  }',
      '  #gallery-billboard-container > div {',
      '    min-height: 230px !important;',
      '    height: 240px !important;',
      '  }',
      '  #gallery-billboard-container video,',
      '  #gallery-billboard-container img {',
      '    min-height: 230px !important;',
      '    height: 100% !important;',
      '    object-fit: cover !important;',
      '  }',
      '}',
      '.njap-slide-in {',
      '  opacity: 0;',
      '  transform: translateY(36px);',
      '  transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1);',
      '}',
      '.njap-slide-in.njap-visible {',
      '  opacity: 1;',
      '  transform: translateY(0);',
      '}',
      '#cms-blog-main-section, section:has(#cms-blog-posts-grid), #cms-blog-posts-grid, .blog-post-card-item, .blog-post-card-item article {',
      '  opacity: 1 !important;',
      '  visibility: visible !important;',
      '  transform: none !important;',
      '}',
      '#gallery-billboard-container .billboard-img,',
      '#gallery-billboard-section .billboard-img {',
      '  transition: transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94);',
      '  will-change: transform;',
      '}',
      '#gallery-billboard-container:hover .billboard-img,',
      '#gallery-billboard-section:hover .billboard-img {',
      '  transform: scale(1.05);',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  })();

  // ---------------------------------------------------------
  // 1. GLOBAL HOME ROUTER
  // ---------------------------------------------------------
  function navigateToHome(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    }
    var currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === '/index.php' || currentPath === '/index.html' || currentPath === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = '/';
    }
  }
  window.navigateToHome = navigateToHome;

  document.addEventListener('click', function (e) {
    var targetLink = e.target.closest('a, button');
    if (!targetLink) return;
    var tag = (targetLink.tagName || '').toLowerCase();
    var href = targetLink.hasAttribute('href') ? (targetLink.getAttribute('href') || '').trim() : null;
    var text = (targetLink.textContent || '').trim();
    var isHomeHref = (href === '/' || href === '/index.html' || href === '/index.php' || href === './');
    var isHomeText = (text === '홈' || text === 'Home') && (tag === 'a' || tag === 'button');
    var isBrandElement = Boolean(
      targetLink.querySelector('img[src*="logo"]') ||
      targetLink.classList.contains('njap-brand-link') ||
      (text.includes('Healthcare Access Portal') && tag === 'a')
    );
    if (
      (isHomeHref && (isHomeText || isBrandElement)) ||
      (isHomeText && targetLink.closest('nav, footer, header')) ||
      (isBrandElement && targetLink.closest('nav, footer, header'))
    ) {
      navigateToHome(e);
    }
  }, true);

  function updateLiveHeadline(post) {
    var headlineEl = document.getElementById('homepage-live-headline');
    var linkEl = document.getElementById('homepage-live-link');
    if (headlineEl && post && post.title) {
      headlineEl.textContent = post.title;
    }
    if (linkEl && post && (post.slug || post.id)) {
      linkEl.href = '/blog/' + (post.slug || post.id);
    }
  }

  // ---------------------------------------------------------
  // 2. MOBILE MENU TOGGLE — Handled exclusively by fixes.js fixMobileMenu() with rich accordion support
  // ---------------------------------------------------------
  function initMobileMenu() {
    return;
  }

  // ---------------------------------------------------------
  // 3. GLOBAL STATE & BILLBOARDS
  // ---------------------------------------------------------
  var billboards = [];
  try { billboards = JSON.parse(sessionStorage.getItem('njap_billboards') || '[]'); } catch(e) {}
  var currentBillboardIndex = 0;
  var billboardTimer = null;
  var BILLBOARD_IMAGE_DURATION = 5000; // 5 seconds for images

  function isBillboardVideo(item) {
    if (!item) return false;
    if (item.mediaType === 'video') return true;
    var url = (item.mediaUrl || '').toLowerCase();
    return /\.(mp4|webm|mov|ogg|m4v)($|\?)/i.test(url) || url.startsWith('data:video') || url.indexOf('/uploads/videos/') !== -1;
  }

  function clearBillboardTimer() {
    if (billboardTimer) {
      clearTimeout(billboardTimer);
      billboardTimer = null;
    }
  }

  function scheduleBillboardTimer(ms) {
    clearBillboardTimer();
    if (billboards.length <= 1) return;
    billboardTimer = setTimeout(function() {
      window.cmsNextBillboard();
    }, ms);
  }

  async function initBillboards() {
    if (billboards.length > 0) {
      renderBillboardShowcase();
    }
    try {
      var res = await fetch('/api/billboards.php?active_only=1&_t=' + Date.now());
      var data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        billboards = data.data;
        try { sessionStorage.setItem('njap_billboards', JSON.stringify(billboards)); } catch(e) {}
        if (currentBillboardIndex >= billboards.length) {
          currentBillboardIndex = 0;
        }
        renderBillboardShowcase();
      }
    } catch (e) {
      if (billboards.length > 0) {
        renderBillboardShowcase();
      }
    }
  }

  function renderBillboardShowcase() {
    clearBillboardTimer();
    var container = document.getElementById('gallery-billboard-container');
    if (!container || billboards.length === 0) return;
    var b = billboards[currentBillboardIndex] || billboards[0];
    var isVideo = isBillboardVideo(b);
    var targetLink = b.linkUrl || '/about#contact';

    // If server already rendered the exact video for slide 0, do not destroy and reload it
    var existingVid = container.querySelector('video');
    if (existingVid && currentBillboardIndex === 0 && isVideo) {
      var curSrc = existingVid.getAttribute('src') || (existingVid.querySelector('source') ? existingVid.querySelector('source').getAttribute('src') : '');
      if (curSrc === b.mediaUrl) {
        existingVid.defaultMuted = true;
        existingVid.muted = true;
        existingVid.volume = 0;
        existingVid.setAttribute('muted', '');
        existingVid.setAttribute('playsinline', '');
        existingVid.setAttribute('webkit-playsinline', '');
        existingVid.setAttribute('preload', 'auto');
        var badge1 = document.getElementById('billboard-play-badge');
        existingVid.addEventListener('playing', function() { if (badge1) badge1.classList.add('hidden'); });
        existingVid.addEventListener('pause', function() { if (badge1) badge1.classList.remove('hidden'); });
        if (existingVid.paused) {
          var p0 = existingVid.play();
          if (p0 && p0.catch) { p0.catch(function() {}); }
        }
        return;
      }
    }

    var dotsHtml = billboards.map(function(_, i) {
      var cls = i === currentBillboardIndex
        ? 'w-6 h-1.5 sm:w-8 sm:h-2 bg-white rounded-full shadow-lg ring-1 ring-white/50'
        : 'w-2 h-1.5 sm:w-2.5 sm:h-2 bg-white/40 hover:bg-white/80 rounded-full';
      return '<button onclick="event.stopPropagation();event.preventDefault();window.cmsGoBillboard(' + i + ');" class="transition-all duration-300 ' + cls + '" aria-label="Go to slide ' + (i+1) + '"></button>';
    }).join('');

    container.innerHTML = [
      '<div class="relative w-full overflow-hidden bg-slate-950 select-none" style="aspect-ratio:1920/566;min-height:230px;width:100%;max-height:480px;overflow:hidden;" onmouseenter="window.cmsPauseBillboard()" onmouseleave="window.cmsResumeBillboard()">',
      '  <a href="' + escapeHtml(targetLink) + '" class="block relative w-full h-full cursor-pointer" title="' + escapeHtml(b.title) + '">',
      '    <div class="w-full h-full relative" style="overflow:hidden;min-height:230px;">',
      '      <div id="bb-media-slot" class="w-full h-full" style="min-height:230px;"></div>',
      '      <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" style="z-index:2;"></div>',
      '      <div class="absolute inset-0 bg-gradient-to-r from-black/65 via-transparent to-black/20 pointer-events-none" style="z-index:2;"></div>',
      '      <div class="absolute inset-0 billboard1-vignette" style="z-index:3;"></div>',
      '    </div>',
      '    <!-- Top Layer (Layer 3): Text, Badges, and Buttons -->',
      '    <div class="absolute inset-0 flex items-end" style="z-index:10;">',
      '      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-4 sm:pb-6 flex items-end justify-between gap-4">',
      '        <div class="max-w-3xl space-y-1 sm:space-y-2">',
      '          <div class="flex items-center gap-2">',
      '            <span class="bg-red-600 text-white text-[10px] sm:text-xs font-extrabold px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow">' + escapeHtml(b.subtitle || b.category || 'SPECIAL CAMPAIGN') + '</span>',
      '          </div>',
      '          <h3 class="font-extrabold text-base sm:text-2xl md:text-3xl text-white tracking-tight leading-snug drop-shadow-md line-clamp-1 sm:line-clamp-2">' + escapeHtml(b.title) + '</h3>',
      '        </div>',
      '        <div class="flex items-center gap-2 shrink-0">',
      '          <span class="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-brand-blue text-white font-extrabold text-xs sm:text-sm px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl shadow-xl"><span>' + escapeHtml(b.linkText || '자세히 보기') + '</span><span>→</span></span>',
      '        </div>',
      '      </div>',
      '    </div>',
      '  </a>',
      '  <div class="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">' + dotsHtml + '</div>',
      '</div>'
    ].join('');

    // Build the media element via createElement so the src is set as a
    // JS property — NOT HTML-entity-encoded — then insert it and play.
    var slot = container.querySelector('#bb-media-slot');
    if (slot) {
      if (isVideo) {
        var vid = document.createElement('video');
        vid.className = 'w-full h-full object-cover billboard-img';
        vid.autoplay = true;
        vid.defaultMuted = true;
        vid.muted = true;
        vid.volume = 0;
        vid.setAttribute('muted', '');
        vid.setAttribute('playsinline', '');
        vid.setAttribute('webkit-playsinline', '');
        vid.setAttribute('preload', 'auto');
        vid.src = b.mediaUrl;

        var srcTag = document.createElement('source');
        srcTag.src = b.mediaUrl;
        srcTag.type = 'video/mp4';
        vid.appendChild(srcTag);

        var bbBadge = document.getElementById('billboard-play-badge');
        vid.addEventListener('playing', function() { if (bbBadge) bbBadge.classList.add('hidden'); });
        vid.addEventListener('pause', function() { if (bbBadge) bbBadge.classList.remove('hidden'); });

        if (billboards.length <= 1) {
          vid.loop = true;
        } else {
          vid.loop = false;
          // When the video finishes playing its full length, transition to next billboard
          vid.addEventListener('ended', function() {
            window.cmsNextBillboard();
          });
          // Fallback safety: once metadata loads, set safety timer for duration + 1.5s
          vid.addEventListener('loadedmetadata', function() {
            if (isFinite(vid.duration) && vid.duration > 0) {
              scheduleBillboardTimer(Math.round((vid.duration + 1.5) * 1000));
            }
          });
          // Fallback if video fails to play or errors
          vid.addEventListener('error', function() {
            scheduleBillboardTimer(BILLBOARD_IMAGE_DURATION);
          });
          // Initial safety timeout (15s) in case metadata takes long
          scheduleBillboardTimer(15000);
        }

        slot.appendChild(vid);
        // Play after paint so the element is fully rendered in the DOM
        requestAnimationFrame(function() {
          vid.muted = true;
          var p = vid.play();
          if (p && p.catch) {
            p.catch(function() {
              if (billboards.length > 1) {
                scheduleBillboardTimer(BILLBOARD_IMAGE_DURATION);
              }
            });
          }
        });
      } else {
        var img = document.createElement('img');
        img.src = b.mediaUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=2000&q=85&auto=format';
        img.alt = b.title || '';
        img.className = 'w-full h-full object-cover billboard-img';
        slot.appendChild(img);

        // Images display for 5 seconds before next billboard
        if (billboards.length > 1) {
          scheduleBillboardTimer(BILLBOARD_IMAGE_DURATION);
        }
      }
    }
  }

  window.cmsNextBillboard = function () {
    if (billboards.length <= 1) return;
    clearBillboardTimer();
    currentBillboardIndex = (currentBillboardIndex + 1) % billboards.length;
    renderBillboardShowcase();
  };
  window.cmsPrevBillboard = function () {
    if (billboards.length <= 1) return;
    clearBillboardTimer();
    currentBillboardIndex = (currentBillboardIndex - 1 + billboards.length) % billboards.length;
    renderBillboardShowcase();
  };
  window.cmsGoBillboard = function (idx) {
    if (idx >= 0 && idx < billboards.length && idx !== currentBillboardIndex) {
      clearBillboardTimer();
      currentBillboardIndex = idx;
      renderBillboardShowcase();
    }
  };
  window.cmsPauseBillboard = function () {
    // Only pause slide transition timer for static images; NEVER pause videos on hover
    var b = billboards[currentBillboardIndex] || billboards[0];
    if (!isBillboardVideo(b)) {
      clearBillboardTimer();
    }
  };
  window.cmsResumeBillboard = function () {
    if (billboards.length <= 1) return;
    var b = billboards[currentBillboardIndex] || billboards[0];
    if (!isBillboardVideo(b)) {
      scheduleBillboardTimer(BILLBOARD_IMAGE_DURATION);
    }
  };

  // Add hover scale class to the static SSR-rendered billboard image
  function initStaticBillboardHover() {
    var section = document.getElementById('gallery-billboard-section');
    if (section) {
      var img = section.querySelector('#billboard-active-img');
      if (img) img.classList.add('billboard-img');
    }
    var section2 = document.getElementById('gallery-billboard2-section');
    if (section2) {
      var img2 = section2.querySelector('#billboard2-active-img');
      if (img2) img2.classList.add('billboard-img');
    }
  }

  // ---------------------------------------------------------
  // 3.5. BILLBOARD 2 (Above One-stop Patient Services Center)
  // ---------------------------------------------------------
  var billboards2 = [];
  try { billboards2 = JSON.parse(sessionStorage.getItem('njap_billboards2') || '[]'); } catch(e) {}
  var currentBillboard2Index = 0;
  var billboard2Timer = null;

  function clearBillboard2Timer() {
    if (billboard2Timer) {
      clearTimeout(billboard2Timer);
      billboard2Timer = null;
    }
  }

  function scheduleBillboard2Timer(ms) {
    clearBillboard2Timer();
    if (billboards2.length <= 1) return;
    billboard2Timer = setTimeout(function() {
      window.cmsNextBillboard2();
    }, ms);
  }

  async function initBillboards2() {
    if (billboards2.length > 0) {
      renderBillboard2Showcase();
    }
    try {
      var res = await fetch('/api/billboards2.php?active_only=1&_t=' + Date.now());
      var data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        billboards2 = data.data;
        try { sessionStorage.setItem('njap_billboards2', JSON.stringify(billboards2)); } catch(e) {}
        if (currentBillboard2Index >= billboards2.length) {
          currentBillboard2Index = 0;
        }
        renderBillboard2Showcase();
      }
    } catch (e) {
      if (billboards2.length > 0) {
        renderBillboard2Showcase();
      }
    }
  }

  function renderBillboard2Showcase() {
    clearBillboard2Timer();
    var container = document.getElementById('gallery-billboard2-container');
    if (!container || billboards2.length === 0) return;
    var b = billboards2[currentBillboard2Index] || billboards2[0];
    var isVideo = isBillboardVideo(b);
    var targetLink = b.linkUrl || '/tool';

    // If server already rendered the exact video for slide 0, do not destroy and reload it
    var existingVid = container.querySelector('video');
    if (existingVid && currentBillboard2Index === 0 && isVideo) {
      var curSrc = existingVid.getAttribute('src') || (existingVid.querySelector('source') ? existingVid.querySelector('source').getAttribute('src') : '');
      if (curSrc === b.mediaUrl) {
        existingVid.defaultMuted = true;
        existingVid.muted = true;
        existingVid.volume = 0;
        existingVid.setAttribute('muted', '');
        existingVid.setAttribute('playsinline', '');
        existingVid.setAttribute('webkit-playsinline', '');
        existingVid.setAttribute('preload', 'auto');
        var badge2 = document.getElementById('billboard2-play-badge');
        existingVid.addEventListener('playing', function() { if (badge2) badge2.classList.add('hidden'); });
        existingVid.addEventListener('pause', function() { if (badge2) badge2.classList.remove('hidden'); });
        if (existingVid.paused) {
          var p0 = existingVid.play();
          if (p0 && p0.catch) { p0.catch(function() {}); }
        }
        return;
      }
    }

    var dotsHtml = billboards2.map(function(_, i) {
      var cls = i === currentBillboard2Index
        ? 'w-6 h-1.5 sm:w-8 sm:h-2 bg-white rounded-full shadow-lg ring-1 ring-white/50'
        : 'w-2 h-1.5 sm:w-2.5 sm:h-2 bg-white/40 hover:bg-white/80 rounded-full';
      return '<button onclick="event.stopPropagation();event.preventDefault();window.cmsGoBillboard2(' + i + ');" class="transition-all duration-300 ' + cls + '" aria-label="Go to slide ' + (i+1) + '"></button>';
    }).join('');

    container.innerHTML = [
      '<div class="relative w-full overflow-hidden bg-slate-950 select-none" style="aspect-ratio:1920/566;min-height:230px;width:100%;max-height:480px;overflow:hidden;" onmouseenter="window.cmsPauseBillboard2()" onmouseleave="window.cmsResumeBillboard2()">',
      '  <a href="' + escapeHtml(targetLink) + '" class="block relative w-full h-full cursor-pointer" title="' + escapeHtml(b.title) + '">',
      '    <div class="w-full h-full relative" style="overflow:hidden;min-height:230px;">',
      '      <div id="bb2-media-slot" class="w-full h-full" style="min-height:230px;"></div>',
      '      <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/15 pointer-events-none"></div>',
      '      <div class="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-black/25 pointer-events-none"></div>',
      '    </div>',
      '    <div class="absolute inset-0 flex items-end">',
      '      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-4 sm:pb-6 flex items-end justify-between gap-4">',
      '        <div class="max-w-3xl space-y-1 sm:space-y-2">',
      '          <div class="flex items-center gap-2">',
      '            <span class="bg-red-600 text-white text-[10px] sm:text-xs font-extrabold px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow">' + escapeHtml(b.subtitle || b.category || 'SPECIAL CAMPAIGN') + '</span>',
      '          </div>',
      '          <h3 class="font-extrabold text-base sm:text-2xl md:text-3xl text-white tracking-tight leading-snug drop-shadow-md line-clamp-1 sm:line-clamp-2">' + escapeHtml(b.title) + '</h3>',
      '        </div>',
      '        <div class="flex items-center gap-2 shrink-0">',
      '          <span class="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-brand-blue text-white font-extrabold text-xs sm:text-sm px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl shadow-xl"><span>' + escapeHtml(b.linkText || '자세히 보기') + '</span><span>→</span></span>',
      '        </div>',
      '      </div>',
      '    </div>',
      '  </a>',
      '  <div class="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">' + dotsHtml + '</div>',
      '</div>'
    ].join('');

    var slot = container.querySelector('#bb2-media-slot');
    if (slot) {
      if (isVideo) {
        var vid = document.createElement('video');
        vid.className = 'w-full h-full object-cover billboard-img';
        vid.autoplay = true;
        vid.defaultMuted = true;
        vid.muted = true;
        vid.volume = 0;
        vid.setAttribute('muted', '');
        vid.setAttribute('playsinline', '');
        vid.setAttribute('webkit-playsinline', '');
        vid.setAttribute('preload', 'auto');
        vid.src = b.mediaUrl;

        var srcTag = document.createElement('source');
        srcTag.src = b.mediaUrl;
        srcTag.type = 'video/mp4';
        vid.appendChild(srcTag);

        var bb2Badge = document.getElementById('billboard2-play-badge');
        vid.addEventListener('playing', function() { if (bb2Badge) bb2Badge.classList.add('hidden'); });
        vid.addEventListener('pause', function() { if (bb2Badge) bb2Badge.classList.remove('hidden'); });

        if (billboards2.length <= 1) {
          vid.loop = true;
        } else {
          vid.loop = false;
          // When the video finishes playing full length, advance
          vid.addEventListener('ended', function() {
            window.cmsNextBillboard2();
          });
          vid.addEventListener('loadedmetadata', function() {
            if (isFinite(vid.duration) && vid.duration > 0) {
              scheduleBillboard2Timer(Math.round((vid.duration + 1.5) * 1000));
            }
          });
          vid.addEventListener('error', function() {
            scheduleBillboard2Timer(BILLBOARD_IMAGE_DURATION);
          });
          scheduleBillboard2Timer(15000);
        }

        slot.appendChild(vid);
        requestAnimationFrame(function() {
          vid.muted = true;
          var p = vid.play();
          if (p && p.catch) {
            p.catch(function() {
              if (billboards2.length > 1) {
                scheduleBillboard2Timer(BILLBOARD_IMAGE_DURATION);
              }
            });
          }
        });
      } else {
        var img = document.createElement('img');
        img.src = b.mediaUrl || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=2000&q=85&auto=format';
        img.alt = b.title || '';
        img.className = 'w-full h-full object-cover billboard-img';
        slot.appendChild(img);

        if (billboards2.length > 1) {
          scheduleBillboard2Timer(BILLBOARD_IMAGE_DURATION);
        }
      }
    }
  }

  window.cmsNextBillboard2 = function () {
    if (billboards2.length <= 1) return;
    clearBillboard2Timer();
    currentBillboard2Index = (currentBillboard2Index + 1) % billboards2.length;
    renderBillboard2Showcase();
  };
  window.cmsPrevBillboard2 = function () {
    if (billboards2.length <= 1) return;
    clearBillboard2Timer();
    currentBillboard2Index = (currentBillboard2Index - 1 + billboards2.length) % billboards2.length;
    renderBillboard2Showcase();
  };
  window.cmsGoBillboard2 = function (idx) {
    if (idx >= 0 && idx < billboards2.length && idx !== currentBillboard2Index) {
      clearBillboard2Timer();
      currentBillboard2Index = idx;
      renderBillboard2Showcase();
    }
  };
  window.cmsPauseBillboard2 = function () {
    // Only pause slide transition timer for static images; NEVER pause videos on hover
    var b = billboards2[currentBillboard2Index] || billboards2[0];
    if (!isBillboardVideo(b)) {
      clearBillboard2Timer();
    }
  };
  window.cmsResumeBillboard2 = function () {
    if (billboards2.length <= 1) return;
    var b = billboards2[currentBillboard2Index] || billboards2[0];
    if (!isBillboardVideo(b)) {
      scheduleBillboard2Timer(BILLBOARD_IMAGE_DURATION);
    }
  };

  // ---------------------------------------------------------
  // 4. MEDICAL VIDEOS (의학비디오뉴스)
  // ---------------------------------------------------------
  var videos = [];
  try { videos = JSON.parse(sessionStorage.getItem('njap_videos') || '[]'); } catch(e) {}
  var currentVideo = null;
  var activeVideoCategory = '전체';
  var currentVideoPage = 1;
  var VIDEOS_PER_PAGE = 7;

  function extractYouTubeId(url) {
    if (!url) return '';
    url = String(url).trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    var m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/|watch\?.+&v=))([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : '';
  }

  function getVideoMediaInfo(v) {
    if (!v) return { isYoutube: false, ytId: '', directSrc: '', thumb: '' };
    var ytId = extractYouTubeId(v.youtubeId) || extractYouTubeId(v.youtubeUrl) || extractYouTubeId(v.videoUrl);
    var directSrc = '';
    if (!ytId) {
      directSrc = v.videoFile || v.videoUrl || v.mediaUrl || '';
    }
    // 1. Prioritize user uploaded thumbnail or custom thumbnail URL
    var thumb = (v.thumbnail && v.thumbnail.trim()) ? v.thumbnail.trim() : ((v.thumbnailUrl && v.thumbnailUrl.trim()) ? v.thumbnailUrl.trim() : '');
    
    // 2. If thumbnail is empty and YouTube ID is present, fallback to YouTube thumbnail
    if (!thumb && ytId) {
      thumb = 'https://img.youtube.com/vi/' + ytId + '/maxresdefault.jpg';
    }
    
    // 3. Fallback to placeholder if still empty
    if (!thumb) {
      thumb = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80';
    }
    return { isYoutube: Boolean(ytId), ytId: ytId, directSrc: directSrc, thumb: thumb };
  }

  // Play currently selected video
  window.cmsPlayCurrentVideo = function() {
    renderVideoPlayerAndList(true);
  };

  // Play specific YouTube video
  window.cmsPlayYoutube = function(ytId) {
    var playerBox = document.getElementById('medical-video-player-box');
    if (!playerBox) return;
    playerBox.innerHTML = '<iframe class="w-full h-full border-0" src="https://www.youtube.com/embed/' + ytId + '?autoplay=1&enablejsapi=1&rel=0&playsinline=1" title="YouTube Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
  };

  window.cmsSetVideoCat = function(c) {
    activeVideoCategory = c;
    currentVideoPage = 1;
    document.querySelectorAll('#medical-videos-categories button').forEach(function(btn) {
      if (btn.textContent.trim() === c) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    renderVideoPlayerAndList(false);
  };

  window.cmsPrevVideoPage = function() { if (currentVideoPage > 1) { currentVideoPage--; renderVideoPlayerAndList(false); } };
  window.cmsNextVideoPage = function() { currentVideoPage++; renderVideoPlayerAndList(false); };
  window.cmsSelectVideo = function(id, autoPlay) {
    currentVideo = videos.find(function(v) { return v.id === id; });
    renderVideoPlayerAndList(autoPlay === true);
    var playerBox = document.getElementById('medical-video-player-box');
    if (playerBox && window.innerWidth < 1024) {
      playerBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  async function initMedicalVideos() {
    try {
      var res = await fetch('/api/videos.php?_t=' + Date.now());
      var data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        videos = data.data;
        try { sessionStorage.setItem('njap_videos', JSON.stringify(videos)); } catch(e) {}
        if (!currentVideo) currentVideo = videos[0];
      }
    } catch (e) {}

    // Bind category button clicks
    var catContainer = document.getElementById('medical-videos-categories');
    if (catContainer) {
      catContainer.querySelectorAll('button').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          window.cmsSetVideoCat(this.textContent.trim());
        });
      });
    }

    renderVideoPlayerAndList(false);
  }

  function renderVideoPlayerAndList(shouldAutoPlay) {
    var playerBox = document.getElementById('medical-video-player-box');
    var infoBox = document.getElementById('medical-video-info-box');
    var playlistBox = document.getElementById('medical-videos-playlist');
    var paginationBox = document.getElementById('medical-videos-pagination');
    var countBadge = document.getElementById('medical-videos-count-badge');

    if (!playerBox || videos.length === 0) return;

    var filtered = activeVideoCategory === '전체'
      ? videos
      : videos.filter(function(v) { return v.category === activeVideoCategory; });

    if (!filtered.some(function(v) { return v.id === (currentVideo ? currentVideo.id : null); })) {
      currentVideo = filtered[0] || videos[0];
    }
    var cur = currentVideo || filtered[0];

    if (cur) {
      var info = getVideoMediaInfo(cur);

      if (shouldAutoPlay) {
        // Immediately start playing
        if (info.isYoutube) {
          playerBox.innerHTML = '<iframe class="w-full h-full border-0" src="https://www.youtube.com/embed/' + info.ytId + '?autoplay=1&enablejsapi=1&rel=0&playsinline=1" title="' + escapeHtml(cur.title) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
        } else if (info.directSrc) {
          playerBox.innerHTML = '<video class="w-full h-full object-cover bg-black" src="' + info.directSrc + '" controls autoplay playsinline></video>';
          var vidEl = playerBox.querySelector('video');
          if (vidEl) {
            var p = vidEl.play();
            if (p && p.catch) p.catch(function() {});
          }
        }
      } else {
        // Thumbnail with dark box Play Button
        playerBox.innerHTML = [
          '<div class="relative w-full h-full group cursor-pointer" onclick="window.cmsPlayCurrentVideo()">',
          '  <img src="' + info.thumb + '" alt="' + escapeHtml(cur.title) + '" onerror="if(this.src.indexOf(\'maxresdefault\')!==-1){this.src=this.src.replace(\'maxresdefault\',\'hqdefault\');}else if(this.src.indexOf(\'hqdefault\')!==-1){this.src=\'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80\';}" class="object-cover w-full h-full group-hover:scale-103 transition-transform duration-500">',
          '  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"></div>',
          '  <div class="absolute inset-0 flex items-center justify-center">',
          '    <div class="video-theme-play-btn group-hover:scale-110 transition-transform">',
          '      <svg class="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
          '    </div>',
          '  </div>',
          '  <div class="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded flex items-center gap-1.5 font-mono border border-white/10">',
          '    <svg class="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
          '    <span>' + escapeHtml(cur.duration || '10:00') + '</span>',
          '  </div>',
          '</div>'
        ].join('');
      }

      if (infoBox) {
        var authorMeta = cur.doctor || cur.hospital || '뉴저지 한인 전문의';
        var dateMeta = cur.date || '최신 의학 정보';
        var catMeta = cur.category || '의학뉴스';
        infoBox.innerHTML = [
          '<h3 class="video-theme-info-title">' + escapeHtml(cur.title) + '</h3>',
          '<div class="video-theme-info-byline">',
          '  <span>By ' + escapeHtml(authorMeta) + '</span>',
          '  <span class="mx-1.5 text-slate-500">/</span>',
          '  <span>' + escapeHtml(dateMeta) + '</span>',
          '  <span class="mx-1.5 text-slate-500">•</span>',
          '  <span class="text-red-400 font-medium">' + escapeHtml(catMeta) + '</span>',
          '</div>',
          '<p class="video-theme-info-desc line-clamp-3">' + escapeHtml(cur.summary || cur.description || '') + '</p>'
        ].join('');
      }
    }

    var totalPages = Math.ceil(filtered.length / VIDEOS_PER_PAGE) || 1;
    if (currentVideoPage > totalPages) currentVideoPage = totalPages;
    if (currentVideoPage < 1) currentVideoPage = 1;
    var startIdx = (currentVideoPage - 1) * VIDEOS_PER_PAGE;
    var pageVideos = filtered.slice(startIdx, startIdx + VIDEOS_PER_PAGE);

    if (countBadge) countBadge.textContent = filtered.length + '개 영상';

    if (playlistBox) {
      playlistBox.innerHTML = pageVideos.map(function(v) {
        var isPlaying = cur && cur.id === v.id;
        var itemInfo = getVideoMediaInfo(v);
        var author = v.doctor ? (v.doctor + ' · ') : '';
        var date = v.date || v.category || '최신영상';
        return [
          '<div onclick="window.cmsSelectVideo(\'' + v.id + '\', true)" class="video-theme-item ' + (isPlaying ? 'active' : '') + '">',
          '  <div class="video-theme-item-thumb">',
          '    <img src="' + itemInfo.thumb + '" alt="' + escapeHtml(v.title) + '" onerror="if(this.src.indexOf(\'maxresdefault\')!==-1){this.src=this.src.replace(\'maxresdefault\',\'hqdefault\');}else if(this.src.indexOf(\'hqdefault\')!==-1){this.src=\'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80\';}" class="w-full h-full object-cover">',
          '    <div class="video-theme-item-duration">' + escapeHtml(v.duration || '10:00') + '</div>',
          '  </div>',
          '  <div class="video-theme-item-text">',
          '    <h4 class="video-theme-item-title">' + escapeHtml(v.title) + '</h4>',
          '    <div class="video-theme-item-meta">' + escapeHtml(author + date) + '</div>',
          '  </div>',
          '</div>'
        ].join('');
      }).join('');
    }

    if (paginationBox) {
      paginationBox.innerHTML = [
        '<button onclick="window.cmsPrevVideoPage()" ' + (currentVideoPage <= 1 ? 'disabled class="opacity-30 cursor-not-allowed"' : 'class="cursor-pointer font-bold text-slate-300 hover:text-white"') + '>&#8249; 이전</button>',
        '<span class="font-mono font-bold text-slate-400">' + currentVideoPage + ' / ' + totalPages + '</span>',
        '<button onclick="window.cmsNextVideoPage()" ' + (currentVideoPage >= totalPages ? 'disabled class="opacity-30 cursor-not-allowed"' : 'class="cursor-pointer font-bold text-slate-300 hover:text-white"') + '>다음 &#8250;</button>'
      ].join('');
    }
  }

  // ---------------------------------------------------------
  // 5. BLOG LIVE SEARCH & CATEGORY FILTER
  // ---------------------------------------------------------
  var posts = [];
  try { posts = JSON.parse(sessionStorage.getItem('njap_posts') || '[]'); } catch(e) {}
  var blogActiveCategory = '전체';

  async function initBlogInteractivity() {
    var searchInput = document.getElementById('cms-blog-search-input');
    var catContainer = document.getElementById('cms-blog-categories');
    
    // If blog.php direct filtering is present, let it handle the category buttons directly
    if (typeof window.handleBlogCategoryClick === 'function') {
      return;
    }

    try {
      var res = await fetch('/api/posts.php?_t=' + Date.now());
      var data = await res.json();
      if (data.success && data.data) {
        posts = data.data;
        try { sessionStorage.setItem('njap_posts', JSON.stringify(posts)); } catch(e) {}
      }
    } catch(e) {}

    if (catContainer && !catContainer.dataset.bound) {
      catContainer.dataset.bound = '1';
      
      // Check URL search param on load (e.g. /blog?category=의사칼럼)
      try {
        var params = new URLSearchParams(window.location.search);
        var initialCat = params.get('category');
        if (initialCat) {
          blogActiveCategory = decodeURIComponent(initialCat).trim();
          catContainer.querySelectorAll('button').forEach(function(b) {
            if (b.textContent.trim() === blogActiveCategory) {
              b.className = 'text-xs sm:text-sm font-sans font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200 bg-brand-gradient text-white border-transparent shadow-sm cursor-pointer';
            } else {
              b.className = 'text-xs sm:text-sm font-sans font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200 border-brand-border text-brand-muted hover:border-brand-blue hover:text-brand-blue bg-white cursor-pointer';
            }
          });
        }
      } catch(e) {}

      catContainer.querySelectorAll('button').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          blogActiveCategory = this.textContent.trim();
          catContainer.querySelectorAll('button').forEach(function(b) {
            b.className = 'text-xs sm:text-sm font-sans font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200 border-brand-border text-brand-muted hover:border-brand-blue hover:text-brand-blue bg-white cursor-pointer';
          });
          this.className = 'text-xs sm:text-sm font-sans font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200 bg-brand-gradient text-white border-transparent shadow-sm cursor-pointer';
          filterBlogList();
        });
      });
    }

    if (searchInput && !searchInput.dataset.bound) {
      searchInput.dataset.bound = '1';
      searchInput.addEventListener('input', function() {
        blogSearchQuery = this.value.trim().toLowerCase();
        filterBlogList();
      });
    }

    // Trigger initial filter if category was passed
    if (blogActiveCategory && blogActiveCategory !== '전체') {
      filterBlogList();
    }
  }

  function filterBlogList() {
    var blogContainer = document.getElementById('cms-blog-posts-grid');
    if (!blogContainer || posts.length === 0) return;
    var filtered = posts;
    if (blogActiveCategory && blogActiveCategory !== '전체') {
      var normTarget = blogActiveCategory.trim().toLowerCase().replace(/\s+/g, '');
      filtered = filtered.filter(function(p) {
        var cat = (p.category || '').trim().toLowerCase().replace(/\s+/g, '');
        if (normTarget === '의료칼럼') {
          return cat.includes('의료칼럼') || cat.includes('의사칼럼') || Boolean(p.isDoctorColumn);
        }
        if (normTarget.includes('recall') || normTarget.includes('리콜')) {
          return cat.includes('recall') || cat.includes('리콜');
        }
        if (normTarget.includes('health') || normTarget.includes('wellness')) {
          return cat.includes('health') || cat.includes('wellness');
        }
        if (normTarget.includes('의료보험')) {
          return cat.includes('의료보험') || cat.includes('medicare') || cat.includes('aca') || cat.includes('보험');
        }
        if (normTarget.includes('한인건강')) {
          return cat.includes('한인건강') || cat.includes('특집');
        }
        if (normTarget.includes('한인커뮤니티')) {
          return cat.includes('한인커뮤니티') || cat.includes('커뮤니티');
        }
        if (normTarget.includes('의학뉴스')) {
          return cat.includes('의학뉴스') || cat.includes('의학');
        }
        return cat === normTarget;
      });
    }
    if (blogSearchQuery) {
      filtered = filtered.filter(function(p) {
        return (p.title && p.title.toLowerCase().includes(blogSearchQuery)) ||
               (p.excerpt && p.excerpt.toLowerCase().includes(blogSearchQuery)) ||
               (p.content && p.content.toLowerCase().includes(blogSearchQuery)) ||
               (p.author && p.author.toLowerCase().includes(blogSearchQuery));
      });
    }
    if (filtered.length === 0) {
      blogContainer.innerHTML = '<div class="col-span-full py-16 text-center text-slate-500"><p class="text-lg font-medium">검색 조건에 맞는 기사가 없습니다.</p><p class="text-sm text-slate-400 mt-1">다른 검색어나 카테고리를 선택해보세요.</p></div>';
      return;
    }
    blogContainer.innerHTML = filtered.map(function(p) {
      return [
        '<a class="group card-hover block h-full" href="/blog/' + (p.slug || p.id) + '">',
        '  <article class="bg-white rounded-2xl overflow-hidden border border-brand-border h-full flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300">',
        '    <div>',
        '      <div class="relative h-44 sm:h-48 overflow-hidden bg-gray-100">',
        '        <img src="' + (p.coverImage || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80') + '" alt="' + escapeHtml(p.title) + '" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500">',
        '        <div class="absolute top-2.5 left-2.5"><span class="tag-pill bg-brand-blue text-white font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-xs">' + escapeHtml(p.category || '건강 뉴스') + '</span></div>',
        '      </div>',
        '      <div class="p-4 sm:p-4.5">',
        '        <div class="flex items-center gap-2 text-[11px] font-sans text-brand-muted mb-2"><span>' + escapeHtml(p.date || '2026') + '</span><span>·</span><span>' + escapeHtml(p.author || '편집부') + '</span></div>',
        '        <h2 class="font-serif text-sm sm:text-base font-bold text-brand-dark leading-snug mb-2 line-clamp-2 group-hover:text-brand-blue transition-colors duration-200">' + escapeHtml(p.title) + '</h2>',
        '        <p class="text-xs font-sans text-brand-muted leading-relaxed line-clamp-2">' + escapeHtml(p.excerpt || '') + '</p>',
        '      </div>',
        '    </div>',
        '    <div class="px-4 pb-3.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-brand-blue font-medium">',
        '      <span>&#9201; ' + escapeHtml(p.readTime || '3분') + ' 읽기</span>',
        '      <span class="group-hover:translate-x-1 transition-transform inline-block">읽기 →</span>',
        '    </div>',
        '  </article>',
        '</a>'
      ].join('');
    }).join('');
  }

  // ---------------------------------------------------------
  // 6. SECTION SLIDE-IN ANIMATION (IntersectionObserver)
  // ---------------------------------------------------------
  function initSlideInAnimations() {
    var raw = document.querySelectorAll(
      'main section:not(#gallery-billboard-section), main > article, ' +
      '#homepage-top-story-box, #homepage-latest-news-box, ' +
      '#homepage-reports-grid, #medical-videos-section, ' +
      '.space-y-10 > section'
    );
    if (!raw.length || !window.IntersectionObserver) return;

    var targets = [];
    for (var k = 0; k < raw.length; k++) {
      var node = raw[k];
      if (node.querySelector('#cms-blog-posts-grid') || node.id === 'cms-blog-main-section' || node.id === 'cms-blog-posts-grid' || node.closest('#cms-blog-posts-grid') || node.classList.contains('blog-post-card-item') || node.closest('.blog-post-card-item')) {
        continue;
      }
      targets.push(node);
    }
    if (!targets.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('njap-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

    targets.forEach(function(el, i) {
      var delay = Math.min(i * 55, 380);
      el.style.transitionDelay = delay + 'ms';
      el.classList.add('njap-slide-in');
      observer.observe(el);
    });
  }

  // ---------------------------------------------------------
  // 7. HOMEPAGE DYNAMIC NEWS HYDRATION & LIVE HEADLINE
  // ---------------------------------------------------------
  async function initHomepageNews() {
    var topStoryBox = document.getElementById('homepage-top-story-box');
    var latestNewsBox = document.getElementById('homepage-latest-news-box');
    var doctorColsBox = document.getElementById('homepage-doctor-columns-box');
    var reportsGrid = document.getElementById('homepage-reports-grid');
    var liveHeadline = document.getElementById('homepage-live-headline');

    if (!topStoryBox && !latestNewsBox && !doctorColsBox && !reportsGrid && !liveHeadline) {
      return;
    }

    try {
      var res = await fetch('/api/posts.php?_t=' + Date.now());
      var data = await res.json();
      if (!data.success || !Array.isArray(data.data) || data.data.length === 0) return;
      
      var allPosts = data.data.filter(function(p) {
        return (p.status || 'published') === 'published';
      });
      // Sort newest first
      allPosts.sort(function(a, b) {
        var d1 = new Date(a.date || '1970-01-01').getTime();
        var d2 = new Date(b.date || '1970-01-01').getTime();
        return d2 - d1;
      });

      // 1. Doctor Columns: STRICTLY isDoctorColumn === true
      var doctorPosts = allPosts.filter(function(p) {
        return p.isDoctorColumn === true || p.isDoctorColumn === 'true' || p.isDoctorColumn === 1 || p.isDoctorColumn === '1';
      });

      // Top Story
      var topStory = allPosts.find(function(p) {
        return p.isTopStory === true || p.isTopStory === 'true' || p.isTopStory === 1 || p.isTopStory === '1';
      });
      if (!topStory) {
        topStory = allPosts.find(function(p) {
          return p.isLiveUpdate === true || p.isLiveUpdate === 'true' || p.isLiveUpdate === 1 || p.isLiveUpdate === '1';
        });
      }
      if (!topStory && allPosts.length > 0) {
        topStory = allPosts[0];
      }

      // Middle Column: 주요 뉴스 (Strictly isLiveUpdate === true, Max 6)
      var latestNews = allPosts.filter(function(p) {
        if (topStory && String(p.id) === String(topStory.id)) return false;
        return p.isLiveUpdate === true || p.isLiveUpdate === 'true' || p.isLiveUpdate === 1 || p.isLiveUpdate === '1';
      }).slice(0, 6);

      // Reports Grid: Strictly show ONLY posts check-marked with isPolicyReport === true (Max 4)
      var reportNews = allPosts.filter(function(p) {
        return p.isPolicyReport === true || p.isPolicyReport === 'true' || p.isPolicyReport === 1 || p.isPolicyReport === '1';
      }).slice(0, 4);

      // Live update post
      var livePost = allPosts.find(function(p) {
        return p.isLiveUpdate === true || p.isLiveUpdate === 'true' || p.isLiveUpdate === 1 || p.isLiveUpdate === '1';
      }) || topStory;

      if (livePost) {
        updateLiveHeadline(livePost);
      }

      // Re-render Top Story Box
      if (topStoryBox && topStory) {
        var rawPts = topStory.summaryPoints;
        var summaryPts = [];
        if (typeof rawPts === 'string') {
          try {
            if (rawPts.trim().startsWith('[') || rawPts.trim().startsWith('{')) {
              var parsed = JSON.parse(rawPts);
              rawPts = parsed;
            }
          } catch(e) {}
        }
        if (Array.isArray(rawPts)) {
          summaryPts = rawPts.map(function(pt) {
            if (typeof pt === 'string') return pt.replace(/\[object Object\]/g, '').trim();
            if (typeof pt === 'object' && pt !== null) return (pt.text || pt.title || pt.point || pt.value || '').trim();
            return String(pt || '').trim();
          }).filter(Boolean);
        } else if (typeof rawPts === 'object' && rawPts !== null) {
          summaryPts = Object.values(rawPts).map(function(pt) {
            if (typeof pt === 'string') return pt.replace(/\[object Object\]/g, '').trim();
            if (typeof pt === 'object' && pt !== null) return (pt.text || pt.title || pt.point || pt.value || '').trim();
            return String(pt || '').trim();
          }).filter(Boolean);
        } else if (rawPts) {
          summaryPts = String(rawPts).split('\n').map(function(s) { return s.replace(/\[object Object\]/g, '').trim(); }).filter(Boolean);
        }
        if (summaryPts.length === 0 && topStory.content) {
          var match = topStory.content.match(/(?:핵심\s*요약|요약|Key\s*Points)[:\s\*\#]+([\s\S]*?)(?=\n\s*(?:권장|출처|주요|참고|\#\#|$))/);
          if (match && match[1]) {
            summaryPts = match[1].split('\n').map(function(s) {
              return s.replace(/^[•\-\*\d\.\)\s]+/, '').trim();
            }).filter(function(s) { return s.length > 5; });
          }
        }
        var topCover = topStory.coverImage || (topStory.images && topStory.images[0]) || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&q=80&auto=format';
        
        var summaryBoxHtml = '';
        if (summaryPts.length > 0) {
          summaryBoxHtml = [
            '<div class="bg-gray-50 rounded-xl p-4 border border-gray-200/80 mb-3">',
            '  <p class="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 whitespace-nowrap">핵심 요약</p>',
            '  <ul class="space-y-1.5 text-xs sm:text-sm text-gray-900 font-semibold">',
            summaryPts.slice(0, 2).map(function(pt) {
              return '    <li class="flex items-start gap-2"><span class="text-red-600 font-black text-sm leading-none mt-0.5">•</span><span class="line-clamp-2 leading-snug">' + escapeHtml(pt) + '</span></li>';
            }).join(''),
            '  </ul>',
            '</div>'
          ].join('');
        }

        topStoryBox.innerHTML = [
          '<a class="group block" href="/blog/' + escapeHtml(topStory.slug || topStory.id) + '">',
          '  <div class="flex items-center gap-2 mb-2">',
          '    <span class="w-2.5 h-2.5 bg-red-600 inline-block"></span>',
          '    <span class="text-xs sm:text-sm font-black text-red-600 uppercase tracking-widest whitespace-nowrap">' + escapeHtml(topStory.category || '주요 뉴스') + '</span>',
          '    <span class="text-xs text-gray-400">·</span>',
          '    <span class="text-xs sm:text-sm text-gray-500 whitespace-nowrap">' + escapeHtml(topStory.date || '') + '</span>',
          '  </div>',
          '  <h1 class="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-gray-950 leading-tight mb-3 tracking-tight group-hover:text-brand-blue transition-colors">' + escapeHtml(topStory.title || '') + '</h1>',
          '  <div class="relative w-full aspect-[16/10] overflow-hidden mb-2.5 bg-gray-100 shadow-xs rounded-sm">',
          '    <img src="' + escapeHtml(topCover) + '" alt="' + escapeHtml(topStory.title || '') + '" class="object-cover group-hover:scale-102 transition-transform duration-500 w-full h-full">',
          '  </div>',
          '  <p class="text-xs text-gray-400 mb-2 font-sans font-medium">특별 기획: ' + escapeHtml(topStory.title || '') + '</p>',
          '  <p class="text-gray-800 text-sm sm:text-base leading-relaxed mb-4 line-clamp-3 font-serif">' + escapeHtml(topStory.excerpt || '') + '</p>',
          '</a>',
          summaryBoxHtml,
          '<div class="flex items-center justify-between text-xs sm:text-sm text-gray-500 pt-2.5 border-t border-gray-100">',
          '  <div class="flex items-center gap-2">',
          '    <span class="font-black text-gray-950 whitespace-nowrap">' + escapeHtml(topStory.author || '편집부') + '</span>',
          '    <span>·</span>',
          '    <span class="whitespace-nowrap font-medium">⏱ ' + escapeHtml(topStory.readTime || '2분') + '</span>',
          '  </div>',
          '  <span class="text-red-600 font-black text-[11px] uppercase tracking-wider whitespace-nowrap">TOP STORY</span>',
          '</div>'
        ].join('');
      }

      // Re-render Latest News Box (Middle Column)
      if (latestNewsBox) {
        latestNewsBox.innerHTML = latestNews.map(function(item) {
          var itemCover = item.coverImage || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80';
          return [
            '<a class="group py-3.5 first:pt-0 last:pb-0 flex gap-3 items-start justify-between" href="/blog/' + escapeHtml(item.slug || item.id) + '">',
            '  <div class="flex-1 min-w-0 pr-1">',
            '    <span class="text-[11px] sm:text-xs font-black text-red-600 uppercase tracking-wider block mb-1 whitespace-nowrap">' + escapeHtml(item.category || '뉴스') + '</span>',
            '    <h3 class="font-extrabold text-sm sm:text-base text-gray-950 leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors">' + escapeHtml(item.title || '') + '</h3>',
            '    <div class="text-xs font-medium text-gray-400 mt-1.5 whitespace-nowrap"><span>' + escapeHtml(item.date || '') + '</span></div>',
            '  </div>',
            '  <div class="news-thumb-box border border-gray-200">',
            '    <img src="' + escapeHtml(itemCover) + '" alt="' + escapeHtml(item.title || '') + '" class="group-hover:scale-105 transition-transform">',
            '  </div>',
            '</a>'
          ].join('');
        }).join('');
      }

      // Re-render Doctor Columns Box (Right Column)
      if (doctorColsBox) {
        doctorColsBox.innerHTML = doctorPosts.slice(0, 10).map(function(dItem, dIdx) {
          var dCover = dItem.coverImage || (dItem.images && dItem.images[0]) || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80';
          return [
            '<a class="group py-2.5 first:pt-0 last:pb-0 flex gap-2.5 items-start justify-between cursor-pointer" href="/blog/' + escapeHtml(dItem.slug || dItem.id) + '">',
            '  <div class="flex gap-2 items-start flex-1 min-w-0 pr-1">',
            '    <span class="text-lg sm:text-xl font-serif font-black text-red-600 leading-none w-4 shrink-0 mt-0.5 select-none">' + (dIdx + 1) + '</span>',
            '    <div class="flex-1 min-w-0">',
            '      <span class="text-[11px] font-black text-red-600 uppercase tracking-wider block mb-0.5 whitespace-nowrap truncate">' + escapeHtml(dItem.author || dItem.category || '의료칼럼') + '</span>',
            '      <h3 class="font-extrabold text-xs sm:text-sm text-gray-950 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">' + escapeHtml(dItem.title || '') + '</h3>',
            '    </div>',
            '  </div>',
            '  <div class="news-thumb-small border border-gray-200">',
            '    <img src="' + escapeHtml(dCover) + '" alt="' + escapeHtml(dItem.title || '') + '" class="group-hover:scale-105 transition-transform">',
            '  </div>',
            '</a>'
          ].join('');
        }).join('');
      }

      // Re-render Reports Grid (Bottom Section)
      if (reportsGrid) {
        reportsGrid.innerHTML = reportNews.map(function(p) {
          var pCover = p.coverImage || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80';
          return [
            '<a class="group card-hover" href="/blog/' + escapeHtml(p.slug || p.id) + '">',
            '  <article class="bg-white rounded-2xl p-4 border border-gray-200/90 h-full flex flex-col justify-between shadow-sm">',
            '    <div>',
            '      <div class="relative h-40 w-full rounded-xl overflow-hidden mb-3 bg-gray-100">',
            '        <img src="' + escapeHtml(pCover) + '" alt="' + escapeHtml(p.title || '') + '" class="object-cover group-hover:scale-105 transition-transform duration-500 w-full h-full">',
            '      </div>',
            '      <span class="text-[11px] font-bold text-red-600 uppercase tracking-wider block mb-1">' + escapeHtml(p.category || '리포트') + '</span>',
            '      <h3 class="font-bold text-base text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-brand-blue transition-colors">' + escapeHtml(p.title || '') + '</h3>',
            '      <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">' + escapeHtml(p.excerpt || '') + '</p>',
            '    </div>',
            '    <div class="flex items-center justify-between text-xs text-brand-muted pt-2 border-t border-gray-100 font-sans font-medium">',
            '      <span>' + escapeHtml(p.date || '') + '</span>',
            '      <span>⏱ ' + escapeHtml(p.readTime || '3분') + '</span>',
            '    </div>',
            '  </article>',
            '</a>'
          ].join('');
        }).join('');
      }

    } catch(e) {}
  }

  // ---------------------------------------------------------
  // 7.5. CONTACT & INQUIRY FORM AJAX SUBMISSION
  // ---------------------------------------------------------
  function initContactForm() {
    var contactSec = document.getElementById('contact');
    var form = contactSec ? contactSec.querySelector('form') : document.querySelector('section#contact form, form.space-y-4');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      e.stopPropagation();

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalBtnText = submitBtn ? submitBtn.innerHTML : '문의 제출하기';

      var nameInp = form.querySelector('input[type="text"]') || form.querySelector('input[placeholder*="홍길동"]');
      var emailInp = form.querySelector('input[type="email"]');
      var phoneInp = form.querySelector('input[type="tel"]') || form.querySelector('input[placeholder*="201"]');
      var categorySelect = form.querySelector('select');
      var messageTextarea = form.querySelector('textarea');

      var name = nameInp ? nameInp.value.trim() : '';
      var email = emailInp ? emailInp.value.trim() : '';
      var phone = phoneInp ? phoneInp.value.trim() : '';
      var category = categorySelect ? categorySelect.value : '일반 문의';
      var message = messageTextarea ? messageTextarea.value.trim() : '';

      if (!name || !email || !message) {
        alert('성함, 이메일, 문의 내용을 모두 입력해 주세요.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">⏳</span> 전송 중...';
      }

      try {
        var res = await fetch('/api/contact.php?action=submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            category: category,
            message: message
          })
        });
        var data = await res.json();

        if (data.success) {
          form.innerHTML = [
            '<div class="p-8 text-center space-y-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950">',
            '  <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>',
            '  <h3 class="font-serif text-2xl font-bold text-emerald-950">상담 및 문의가 정상 접수되었습니다</h3>',
            '  <p class="text-sm font-sans text-emerald-900/80 leading-relaxed max-w-md mx-auto">',
            '    작성해주신 내용이 상담 센터(<code class="text-emerald-700 font-mono text-xs">njaccessportal@gmail.com</code>)에 즉시 전달되었습니다.<br>',
            '    담당 상담원이 확인 후 기재해주신 연락처로 빠른 시일 내에 연락드리겠습니다.',
            '  </p>',
            '  <div class="pt-3">',
            '    <button type="button" onclick="location.reload()" class="btn-primary py-2.5 px-6 text-sm">새 문의 작성하기</button>',
            '  </div>',
            '</div>'
          ].join('\n');
        } else {
          alert(data.error || '문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
        }
      } catch (err) {
        console.error('Contact submit error:', err);
        alert('서버 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해 주시거나 상담 전화(njaccessportal@gmail.com)로 문의해 주세요.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }

  // ---------------------------------------------------------
  // 8. INITIALIZATION
  // ---------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initStaticBillboardHover();
    initBillboards();
    initBillboards2();
    initMedicalVideos();
    initBlogInteractivity();
    initHomepageNews();
    initContactForm();
    setTimeout(initSlideInAnimations, 150);

    // Robust Safari & Low-Power Autoplay Guardian
    window.cmsPlayBillboardVideo = function() {
      var vids = document.querySelectorAll('#gallery-billboard-container video, #gallery-billboard2-container video, #billboard-active-video, #billboard2-active-video');
      vids.forEach(function(v) {
        if (v) {
          v.defaultMuted = true;
          v.muted = true;
          v.volume = 0;
          v.setAttribute('muted', '');
          v.setAttribute('playsinline', '');
          v.setAttribute('webkit-playsinline', '');
          var p = v.play();
          if (p && p.catch) p.catch(function() {});
        }
      });
      var b1 = document.getElementById('billboard-play-badge');
      if (b1) b1.classList.add('hidden');
      var b2 = document.getElementById('billboard2-play-badge');
      if (b2) b2.classList.add('hidden');
    };

    function ensureAllBillboardVideosPlay() {
      var allVids = document.querySelectorAll('#gallery-billboard-container video, #gallery-billboard2-container video, #billboard-active-video, #billboard2-active-video');
      var stillPaused = false;
      allVids.forEach(function(v) {
        if (v) {
          v.defaultMuted = true;
          v.muted = true;
          v.volume = 0;
          v.setAttribute('muted', '');
          v.setAttribute('playsinline', '');
          v.setAttribute('webkit-playsinline', '');
          if (v.paused) {
            var p = v.play();
            if (p && p.catch) p.catch(function() {});
            if (v.paused) stillPaused = true;
          }
        }
      });

      var v1 = document.querySelector('#gallery-billboard-container video, #billboard-active-video');
      var b1 = document.getElementById('billboard-play-badge');
      if (b1 && v1) {
        if (v1.paused) b1.classList.remove('hidden');
        else b1.classList.add('hidden');
      }

      var v2 = document.querySelector('#gallery-billboard2-container video, #billboard2-active-video');
      var b2 = document.getElementById('billboard2-play-badge');
      if (b2 && v2) {
        if (v2.paused) b2.classList.remove('hidden');
        else b2.classList.add('hidden');
      }

      return !stillPaused;
    }

    // Try immediately and at progressive intervals after DOM is fully painted
    ensureAllBillboardVideosPlay();
    setTimeout(ensureAllBillboardVideosPlay, 100);
    setTimeout(ensureAllBillboardVideosPlay, 350);
    setTimeout(ensureAllBillboardVideosPlay, 800);
    setTimeout(ensureAllBillboardVideosPlay, 1500);

    // Capture-phase gesture listeners ensure ANY touch, click, or tap on the page starts video
    var gestureEvents = ['pointerdown', 'mousedown', 'touchstart', 'touchend', 'keydown', 'click'];
    var onGlobalGesture = function() {
      ensureAllBillboardVideosPlay();
    };
    gestureEvents.forEach(function(evt) {
      window.addEventListener(evt, onGlobalGesture, { capture: true, passive: true });
    });

    // Also attempt on scroll and mouse enter on billboard banners
    window.addEventListener('scroll', ensureAllBillboardVideosPlay, { passive: true });
    ['gallery-billboard-container', 'gallery-billboard2-container', 'gallery-billboard-section', 'gallery-billboard2-section'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) {
        ['mouseenter', 'pointerenter', 'mousemove'].forEach(function(evt) {
          el.addEventListener(evt, ensureAllBillboardVideosPlay, { passive: true });
        });
      }
    });

    window.addEventListener('focus', ensureAllBillboardVideosPlay);
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) ensureAllBillboardVideosPlay();
    });
  });

})();
