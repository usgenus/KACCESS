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
  // 2. MOBILE MENU TOGGLE (finds button by aria-label="Menu")
  // ---------------------------------------------------------
  function initMobileMenu() {
    var btn = document.getElementById('mobile-menu-btn');
    if (!btn) btn = document.querySelector('button[aria-label="Menu"]');

    var menu = document.getElementById('mobile-menu-dropdown');
    if (!menu) {
      var nav = document.querySelector('nav');
      if (nav) {
        // The mobile dropdown is the div.md:hidden inside nav
        var allNavDivs = nav.querySelectorAll('div');
        for (var i = 0; i < allNavDivs.length; i++) {
          var d = allNavDivs[i];
          var cls = d.className || '';
          if (cls.indexOf('md:hidden') !== -1 && cls.indexOf('overflow-hidden') !== -1) {
            menu = d;
            break;
          }
        }
      }
    }

    if (!btn || !menu) return;
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';

    // Initialize closed
    menu.style.maxHeight = '0';
    menu.style.opacity = '0';
    menu.style.pointerEvents = 'none';
    menu.style.overflow = 'hidden';
    menu.style.transition = 'max-height 0.32s ease, opacity 0.25s ease';

    var spans = btn.querySelectorAll('span');
    var isOpen = false;

    function openMenu() {
      isOpen = true;
      menu.style.maxHeight = '400px';
      menu.style.opacity = '1';
      menu.style.pointerEvents = 'auto';
      if (spans.length >= 3) {
        spans[0].style.transform = 'translateY(6px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
      }
    }

    function closeMenu() {
      isOpen = false;
      menu.style.maxHeight = '0';
      menu.style.opacity = '0';
      menu.style.pointerEvents = 'none';
      if (spans.length >= 3) {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen) closeMenu(); else openMenu();
    });

    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        setTimeout(closeMenu, 80);
      });
    });

    document.addEventListener('click', function(e) {
      if (isOpen && !btn.contains(e.target) && !menu.contains(e.target)) {
        closeMenu();
      }
    });
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
      '      <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/15 pointer-events-none"></div>',
      '      <div class="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-black/25 pointer-events-none"></div>',
      '    </div>',
      '    <div class="absolute inset-0 flex items-end">',
      '      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-4 sm:pb-6 flex items-end justify-between gap-4">',
      '        <div class="max-w-3xl space-y-1 sm:space-y-2">',
      '          <div class="flex items-center gap-2">',
      '            <span class="bg-red-600 text-white text-[10px] sm:text-xs font-extrabold px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow">' + escapeHtml(b.subtitle || b.category || 'SPECIAL CAMPAIGN') + '</span>',
      '            <span class="text-xs font-mono text-white/80 bg-black/60 px-2.5 py-0.5 rounded-full border border-white/15">' + (currentBillboardIndex+1) + ' / ' + billboards.length + '</span>',
      '          </div>',
      '          <h3 class="font-extrabold text-base sm:text-2xl md:text-3xl text-white tracking-tight leading-snug drop-shadow-md line-clamp-1 sm:line-clamp-2">' + escapeHtml(b.title) + '</h3>',
      '        </div>',
      '        <div class="flex items-center gap-2 shrink-0">',
      '          <span class="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-brand-blue text-white font-extrabold text-xs sm:text-sm px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl shadow-xl"><span>' + escapeHtml(b.linkText || '자세히 보기') + '</span><span>→</span></span>',
      '        </div>',
      '      </div>',
      '    </div>',
      '  </a>',
      '  <button onclick="event.stopPropagation();event.preventDefault();window.cmsPrevBillboard();" class="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center text-lg sm:text-3xl transition-all duration-200 z-20 hover:scale-110 shadow-2xl cursor-pointer" aria-label="Previous Slide">&#8249;</button>',
      '  <button onclick="event.stopPropagation();event.preventDefault();window.cmsNextBillboard();" class="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center text-lg sm:text-3xl transition-all duration-200 z-20 hover:scale-110 shadow-2xl cursor-pointer" aria-label="Next Slide">&#8250;</button>',
      '  <div class="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">' + dotsHtml + '</div>',
      '</div>'
    ].join('');

    // Build the media element via createElement so the src is set as a
    // JS property — NOT HTML-entity-encoded — then insert it and play.
    var slot = container.querySelector('#bb-media-slot');
    if (slot) {
      if (isVideo) {
        var vid = document.createElement('video');
        vid.src = b.mediaUrl;          // raw URL, no escaping
        vid.className = 'w-full h-full object-cover billboard-img';
        vid.autoplay = true;
        vid.muted = true;              // required for browser autoplay policy
        vid.setAttribute('playsinline', '');
        vid.setAttribute('webkit-playsinline', '');

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
    clearBillboardTimer();
    var container = document.getElementById('gallery-billboard-container');
    if (container) {
      var vid = container.querySelector('video');
      if (vid && !vid.paused) {
        try { vid.pause(); } catch(e) {}
      }
    }
  };
  window.cmsResumeBillboard = function () {
    if (billboards.length <= 1) return;
    var container = document.getElementById('gallery-billboard-container');
    if (!container) return;
    var b = billboards[currentBillboardIndex] || billboards[0];
    var isVideo = isBillboardVideo(b);
    var vid = container.querySelector('video');

    if (isVideo && vid) {
      if (vid.ended || (isFinite(vid.duration) && vid.duration > 0 && vid.currentTime >= vid.duration - 0.2)) {
        window.cmsNextBillboard();
      } else {
        var p = vid.play();
        if (p && p.catch) p.catch(function() {});
        if (isFinite(vid.duration) && vid.duration > 0) {
          var remaining = Math.max(500, Math.round((vid.duration - vid.currentTime + 1.0) * 1000));
          scheduleBillboardTimer(remaining);
        }
      }
    } else {
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
      '            <span class="text-xs font-mono text-white/80 bg-black/60 px-2.5 py-0.5 rounded-full border border-white/15">' + (currentBillboard2Index+1) + ' / ' + billboards2.length + '</span>',
      '          </div>',
      '          <h3 class="font-extrabold text-base sm:text-2xl md:text-3xl text-white tracking-tight leading-snug drop-shadow-md line-clamp-1 sm:line-clamp-2">' + escapeHtml(b.title) + '</h3>',
      '        </div>',
      '        <div class="flex items-center gap-2 shrink-0">',
      '          <span class="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-brand-blue text-white font-extrabold text-xs sm:text-sm px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl shadow-xl"><span>' + escapeHtml(b.linkText || '자세히 보기') + '</span><span>→</span></span>',
      '        </div>',
      '      </div>',
      '    </div>',
      '  </a>',
      '  <button onclick="event.stopPropagation();event.preventDefault();window.cmsPrevBillboard2();" class="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center text-lg sm:text-3xl transition-all duration-200 z-20 hover:scale-110 shadow-2xl cursor-pointer" aria-label="Previous Slide">&#8249;</button>',
      '  <button onclick="event.stopPropagation();event.preventDefault();window.cmsNextBillboard2();" class="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center text-lg sm:text-3xl transition-all duration-200 z-20 hover:scale-110 shadow-2xl cursor-pointer" aria-label="Next Slide">&#8250;</button>',
      '  <div class="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">' + dotsHtml + '</div>',
      '</div>'
    ].join('');

    var slot = container.querySelector('#bb2-media-slot');
    if (slot) {
      if (isVideo) {
        var vid = document.createElement('video');
        vid.src = b.mediaUrl;
        vid.className = 'w-full h-full object-cover billboard-img';
        vid.autoplay = true;
        vid.muted = true;
        vid.setAttribute('playsinline', '');
        vid.setAttribute('webkit-playsinline', '');

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
    clearBillboard2Timer();
    var container = document.getElementById('gallery-billboard2-container');
    if (container) {
      var vid = container.querySelector('video');
      if (vid && !vid.paused) {
        try { vid.pause(); } catch(e) {}
      }
    }
  };
  window.cmsResumeBillboard2 = function () {
    if (billboards2.length <= 1) return;
    var container = document.getElementById('gallery-billboard2-container');
    if (!container) return;
    var b = billboards2[currentBillboard2Index] || billboards2[0];
    var isVideo = isBillboardVideo(b);
    var vid = container.querySelector('video');

    if (isVideo && vid) {
      if (vid.ended || (isFinite(vid.duration) && vid.duration > 0 && vid.currentTime >= vid.duration - 0.2)) {
        window.cmsNextBillboard2();
      } else {
        var p = vid.play();
        if (p && p.catch) p.catch(function() {});
        if (isFinite(vid.duration) && vid.duration > 0) {
          var remaining = Math.max(500, Math.round((vid.duration - vid.currentTime + 1.0) * 1000));
          scheduleBillboard2Timer(remaining);
        }
      }
    } else {
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
  var VIDEOS_PER_PAGE = 4;

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
    var thumb = v.thumbnail || v.thumbnailUrl || '';
    if (!thumb && ytId) {
      thumb = 'https://img.youtube.com/vi/' + ytId + '/maxresdefault.jpg';
    }
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
      btn.className = btn.textContent.trim() === c
        ? 'text-xs font-semibold px-4 py-2 rounded-full transition-all whitespace-nowrap bg-red-600 text-white shadow-sm cursor-pointer'
        : 'text-xs font-medium px-4 py-2 rounded-full transition-all whitespace-nowrap bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer';
    });
    renderVideoPlayerAndList(false);
  };

  window.cmsPrevVideoPage = function() { if (currentVideoPage > 1) { currentVideoPage--; renderVideoPlayerAndList(false); } };
  window.cmsNextVideoPage = function() { currentVideoPage++; renderVideoPlayerAndList(false); };
  window.cmsSelectVideo = function(id, autoPlay) {
    currentVideo = videos.find(function(v) { return v.id === id; });
    renderVideoPlayerAndList(autoPlay === true);
    var playerBox = document.getElementById('medical-video-player-box');
    if (playerBox && window.innerWidth < 768) {
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
        // Thumbnail with Big Red Play Button
        playerBox.innerHTML = [
          '<div class="relative w-full h-full group cursor-pointer" onclick="window.cmsPlayCurrentVideo()">',
          '  <img src="' + info.thumb + '" alt="' + escapeHtml(cur.title) + '" onerror="if(this.src.indexOf(\'maxresdefault\')!==-1){this.src=this.src.replace(\'maxresdefault\',\'hqdefault\');}else if(this.src.indexOf(\'hqdefault\')!==-1){this.src=\'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80\';}" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500">',
          '  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-black/20 to-transparent"></div>',
          '  <div class="absolute inset-0 flex items-center justify-center">',
          '    <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-red-600 flex items-center justify-center text-2xl sm:text-3xl shadow-2xl group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 ring-4 ring-red-500/30">&#9654;</div>',
          '  </div>',
          '  <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between">',
          '    <span class="bg-red-600 text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-sm">' + escapeHtml(cur.category || '의학뉴스') + '</span>',
          '    <span class="bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-mono font-semibold px-2.5 py-1 rounded-md border border-slate-200/80 shadow-sm">&#9201; ' + escapeHtml(cur.duration || '10:00') + '</span>',
          '  </div>',
          '</div>'
        ].join('');
      }

      if (infoBox) {
        infoBox.innerHTML = [
          '<div class="flex items-center gap-3 text-xs text-slate-500 flex-wrap">',
          '  <span class="font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">' + escapeHtml(cur.category || '의학뉴스') + '</span>',
          '  <span>·</span>',
          '  <span class="font-semibold text-slate-800">' + escapeHtml(cur.doctor || cur.speaker || '한인 전문의') + '</span>',
          '  <span>·</span>',
          '  <span class="text-slate-600">&#9201; ' + escapeHtml(cur.duration || '10:00') + '</span>',
          '  <span>·</span>',
          '  <span class="text-slate-600">&#128065;&#65039; ' + escapeHtml(cur.views || '조회수') + '</span>',
          '</div>',
          '<h3 class="font-extrabold text-xl sm:text-2xl text-slate-900 leading-snug tracking-tight">' + escapeHtml(cur.title) + '</h3>',
          '<p class="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">' + escapeHtml(cur.summary || cur.description || '') + '</p>'
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
        return [
          '<div onclick="window.cmsSelectVideo(\'' + v.id + '\', true)" class="flex gap-3.5 p-3 rounded-2xl border transition-all duration-200 cursor-pointer ' + (isPlaying ? 'bg-red-50/70 border-red-300 ring-2 ring-red-400 shadow-sm' : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300') + '">',
          '  <div class="relative w-28 h-20 sm:w-32 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-black">',
          '    <img src="' + itemInfo.thumb + '" alt="' + escapeHtml(v.title) + '" onerror="if(this.src.indexOf(\'maxresdefault\')!==-1){this.src=this.src.replace(\'maxresdefault\',\'hqdefault\');}else if(this.src.indexOf(\'hqdefault\')!==-1){this.src=\'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80\';}" class="w-full h-full object-cover">',
          '    <div class="absolute bottom-1 right-1 bg-black/85 text-white font-mono font-bold text-[10px] px-1.5 py-0.5 rounded">&#9201; ' + escapeHtml(v.duration || '10:00') + '</div>',
          '  </div>',
          '  <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">',
          '    <div>',
          '      <span class="text-[10px] font-bold text-red-600 uppercase tracking-wider block mb-0.5">' + escapeHtml(v.category || '의학뉴스') + '</span>',
          '      <h4 class="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2' + (isPlaying ? ' text-red-700' : '') + '">' + escapeHtml(v.title) + '</h4>',
          '    </div>',
          '    <div class="flex items-center gap-2 text-[11px] text-slate-500 mt-1.5">',
          '      <span class="truncate">' + escapeHtml(v.doctor || v.speaker || '의학 전문의') + '</span>',
          '      <span>·</span>',
          '      <span class="text-slate-700 font-semibold">' + escapeHtml(v.views || '조회수') + '</span>',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('');
      }).join('');
    }

    if (paginationBox) {
      paginationBox.innerHTML = [
        '<button onclick="window.cmsPrevVideoPage()" ' + (currentVideoPage <= 1 ? 'disabled class="opacity-30 cursor-not-allowed"' : 'class="cursor-pointer font-bold text-slate-700 hover:text-red-600"') + '>&#8249; 이전</button>',
        '<span class="text-xs font-mono font-bold">' + currentVideoPage + ' / ' + totalPages + '</span>',
        '<button onclick="window.cmsNextVideoPage()" ' + (currentVideoPage >= totalPages ? 'disabled class="opacity-30 cursor-not-allowed"' : 'class="cursor-pointer font-bold text-slate-700 hover:text-red-600"') + '>다음 &#8250;</button>'
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
      filtered = filtered.filter(function(p) {
        var cat = (p.category || '').trim().toLowerCase();
        var target = blogActiveCategory.trim().toLowerCase();
        if (target === '의료칼럼' || target === '의사칼럼') {
          return cat === '의료칼럼' || cat === '의사칼럼' || Boolean(p.isDoctorColumn);
        }
        return cat === target;
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
    var targets = document.querySelectorAll(
      'main section:not(#gallery-billboard-section), main article, ' +
      '#homepage-top-story-box, #homepage-latest-news-box, ' +
      '#homepage-reports-grid, #medical-videos-section, ' +
      '.space-y-10 > section'
    );
    if (!targets.length || !window.IntersectionObserver) return;

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

      // Reports Grid: 4 items (prioritize isPolicyReport or category '리콜(Recalls and Food Safety)')
      var explicitReports = allPosts.filter(function(p) {
        if (topStory && String(p.id) === String(topStory.id)) return false;
        return p.isPolicyReport === true || p.isPolicyReport === 'true' || p.isPolicyReport === 1 || p.isPolicyReport === '1' ||
               p.category === '리콜(Recalls and Food Safety)' || p.category === '보건 정책 & 메디케어 리포트' || p.category === '보건 정책 & 리포트';
      });
      var otherCandidates = allPosts.filter(function(p) {
        if (topStory && String(p.id) === String(topStory.id)) return false;
        return !explicitReports.some(function(er) { return String(er.id) === String(p.id); });
      });
      var reportNews = explicitReports.concat(otherCandidates).slice(0, 4);

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
        if (summaryPts.length === 0) {
          summaryPts = ['공식 당국 승인 안전 가이드라인 적용 및 자진 리콜 조치', '뉴저지 거주 한인 대상 한국어 무료 상담 창구 운영'];
        }
        var topCover = topStory.coverImage || (topStory.images && topStory.images[0]) || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&q=80&auto=format';
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
          '<div class="bg-gray-50 rounded-xl p-4 border border-gray-200/80 mb-3">',
          '  <p class="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 whitespace-nowrap">핵심 요약</p>',
          '  <ul class="space-y-1.5 text-xs sm:text-sm text-gray-900 font-semibold">',
          summaryPts.slice(0, 2).map(function(pt) {
            return '    <li class="flex items-start gap-2"><span class="text-red-600 font-black text-sm leading-none mt-0.5">•</span><span class="line-clamp-1">' + escapeHtml(pt) + '</span></li>';
          }).join(''),
          '  </ul>',
          '</div>',
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
    setTimeout(initSlideInAnimations, 150);
  });

})();
