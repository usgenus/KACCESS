/**
 * Healthcare Access Portal — Critical Fixes Script v1.0
 * Loaded AFTER cms-client.js to patch any remaining issues.
 * This handles: mobile menu, home nav, billboard hover scale,
 * video autoplay prevention, section slide-in, and 의사칼럼 sidebar.
 */
(function() {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // 1. INJECT STYLES
  // ─────────────────────────────────────────────────────────────
  function injectCSS() {
    var s = document.createElement('style');
    s.textContent = [
      /* Header Spacer Fix for Mobile & Desktop */
      '.h-\\[109px\\], .header-spacer, #header-spacer {',
      '  height: 109px !important;',
      '  min-height: 109px !important;',
      '  display: block !important;',
      '  width: 100% !important;',
      '}',
      '.h-\\[45px\\] { height: 45px !important; }',

      /* Mobile Billboard Full Visibility */
      '@media (max-width: 640px) {',
      '  #gallery-billboard-section { margin-top: 0 !important; margin-bottom: 1.25rem !important; }',
      '  #gallery-billboard-container > div { min-height: 230px !important; height: 240px !important; }',
      '  #gallery-billboard-container video, #gallery-billboard-container img { min-height: 230px !important; height: 100% !important; object-fit: cover !important; }',
      '}',

      /* Slide-in animation */
      '.fx-slide { opacity:0; transform:translateY(30px);',
      '  transition: opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1); }',
      '.fx-slide.fx-in { opacity:1; transform:none; }',

      /* Billboard hover scale */
      '.bb-img { transition: transform .9s ease; }',
      ':hover > .bb-img, :hover .bb-img { transform: scale(1.05); }',

      /* 의사칼럼 sidebar */
      '#doctor-column-sidebar { }',
      '#doctor-column-sidebar .dc-item { border-bottom: 1px solid #e5e7eb; }',
      '#doctor-column-sidebar .dc-item:last-child { border-bottom: none; }',

      /* Billboard 1 Vignette Effect — Layer 2: between media and text */
      '.billboard1-vignette { position: absolute !important; inset: 0 !important; pointer-events: none !important; z-index: 3 !important; box-shadow: inset 0 0 110px 30px rgba(0,0,0,0.7) !important; background: radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%) !important; }',

      /* Mobile menu open state */
      '.mobile-menu-open { max-height: 400px !important; opacity: 1 !important; pointer-events: auto !important; }',
    ].join('\n');
    document.head.appendChild(s);
  }

  // ─────────────────────────────────────────────────────────────
  // 2. HOME NAVIGATION — guarantees 홈 works from all pages
  // ─────────────────────────────────────────────────────────────
  function fixHomeNav() {
    document.addEventListener('click', function(e) {
      var el = e.target;
      while (el && el !== document) {
        var tag = (el.tagName || '').toLowerCase();
        if (tag === 'a' || tag === 'button') {
          var href = el.hasAttribute('href') ? (el.getAttribute('href') || '').trim() : null;
          var txt  = (el.textContent || '').trim();
          var isHomeLink = (href === '/' || href === '/index.html' || href === '/index.php') && (txt === '홈' || txt === 'Home' || el.classList.contains('njap-brand-link') || el.closest('.njap-brand-link'));
          var isHomeText = (txt === '홈' || txt === 'Home') && (tag === 'a' || tag === 'button');
          
          if (isHomeLink || isHomeText) {
            e.preventDefault();
            e.stopPropagation();
            if (window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname === '/index.php' || window.location.pathname === '/index.html') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              window.location.href = '/';
            }
            return;
          }
          break;
        }
        el = el.parentElement;
      }
    }, true);
  }

  // ─────────────────────────────────────────────────────────────
  // 3. MOBILE MENU — robust toggle using class toggling
  // ─────────────────────────────────────────────────────────────
  function fixMobileMenu() {
    // Find hamburger button
    var btn = document.querySelector('button[aria-label="Menu"]') ||
              document.getElementById('mobile-menu-btn');
    if (!btn) return;

    // Find dropdown (div.md:hidden inside nav that has links)
    var nav = document.querySelector('nav');
    if (!nav) return;
    var dropdown = null;
    var divs = nav.querySelectorAll('div');
    for (var i = 0; i < divs.length; i++) {
      var d = divs[i];
      var cls = d.className || '';
      if (cls.indexOf('md:hidden') !== -1 && d.querySelector('a')) {
        dropdown = d;
        break;
      }
    }
    if (!dropdown) return;
    if (btn.dataset.fxbound) return;
    btn.dataset.fxbound = '1';

    // Force initial closed state
    dropdown.style.cssText = 'max-height:0;opacity:0;overflow:hidden;pointer-events:none;transition:max-height .3s ease,opacity .25s ease;';

    var spans = btn.querySelectorAll('span');
    var open = false;

    function openMenu() {
      open = true;
      dropdown.style.maxHeight = '400px';
      dropdown.style.opacity = '1';
      dropdown.style.pointerEvents = 'auto';
      if (spans[0]) spans[0].style.transform = 'translateY(6px) rotate(45deg)';
      if (spans[1]) spans[1].style.opacity = '0';
      if (spans[2]) spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
    }
    function closeMenu() {
      open = false;
      dropdown.style.maxHeight = '0';
      dropdown.style.opacity = '0';
      dropdown.style.pointerEvents = 'none';
      if (spans[0]) spans[0].style.transform = '';
      if (spans[1]) spans[1].style.opacity = '';
      if (spans[2]) spans[2].style.transform = '';
    }

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      open ? closeMenu() : openMenu();
    });

    // Close on link click
    dropdown.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() { setTimeout(closeMenu, 60); });
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (open && !btn.contains(e.target) && !dropdown.contains(e.target)) closeMenu();
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 4. BILLBOARD IMAGE HOVER SCALE
  // ─────────────────────────────────────────────────────────────
  function fixBillboardHover() {
    var imgs = document.querySelectorAll('#billboard-active-img, #gallery-billboard-container img, #gallery-billboard-section img');
    imgs.forEach(function(img) { img.classList.add('bb-img'); });

    // Also watch for CMS-rendered billboard
    var container = document.getElementById('gallery-billboard-container');
    if (container && window.MutationObserver) {
      var mo = new MutationObserver(function() {
        container.querySelectorAll('img, video').forEach(function(m) { m.classList.add('bb-img'); });
      });
      mo.observe(container, { childList: true, subtree: true });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 5. VIDEO AUTOPLAY FIX (Handled natively by cms-client.js)
  // ─────────────────────────────────────────────────────────────
  function fixVideoAutoplay() {
    // Delegated to cms-client.js for modern interactive playback
  }

  // ─────────────────────────────────────────────────────────────
  // 6. SECTION SLIDE-IN ANIMATION
  // ─────────────────────────────────────────────────────────────
  function fixSlideIn() {
    if (!window.IntersectionObserver) return;
    var sections = document.querySelectorAll('main section:not(#gallery-billboard-section), main article, .fx-slide-target');
    if (!sections.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('fx-in');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });

    sections.forEach(function(el, i) {
      el.classList.add('fx-slide');
      el.style.transitionDelay = Math.min(i * 50, 300) + 'ms';
      observer.observe(el);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 7. KAKAOTALK 1:1 CHAT BUTTON & FLOATING WIDGET (Yellow & Black)
  // ─────────────────────────────────────────────────────────────
  function injectKakaoChatWidget() {
    var kakaoUrl = 'http://pf.kakao.com/_hdxmxaX/chat';
    var kakaoSvg = '<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C6.477 3 2 6.477 2 10.765c0 2.76 1.83 5.183 4.618 6.568l-.946 3.483c-.083.307.255.553.518.375l4.164-2.77c.535.056 1.083.084 1.646.084 5.523 0 10-3.477 10-7.765S17.523 3 12 3z" fill="#000000"/><path d="M7.74 8.79v4.42H6.55V9.83H5.2V8.79h3.74v1.04H7.74zm2.84 0l1.32 4.42h-1.22l-.24-.87H9.27l-.23.87H7.85l1.34-4.42h1.39zm-.37 2.61l-.34-1.29-.33 1.29h.67zm4.27 1.81h1.56v1h-2.75V8.79h1.19v4.42zm4.32-.97l1.19 1.97h-1.39l-.88-1.5-.47.46v1.04h-1.19V8.79h1.19v2.24l1.27-2.24h1.36l-1.08 1.85z" fill="#FEE500"/></svg>';

    // 1. Top Navbar Button (if not already present)
    var navContainer = document.querySelector('nav .max-w-7xl .flex.items-center.justify-between');
    if (navContainer && !document.getElementById('kakao-nav-chat-btn') && !navContainer.querySelector('a[href*="pf.kakao.com"]')) {
      var rightGroup = navContainer.querySelector('.flex.items-center.gap-4, .flex.items-center.gap-3');
      if (rightGroup) {
        var btn = document.createElement('a');
        btn.id = 'kakao-nav-chat-btn';
        btn.href = kakaoUrl;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.className = 'inline-flex items-center gap-1.5 bg-[#FEE500] hover:bg-[#FDD835] active:scale-95 text-black font-extrabold text-xs sm:text-sm px-3.5 py-1.5 rounded-full border border-[#E5CD00] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer mr-1';
        btn.title = '카카오톡 1:1 상담 바로가기';
        btn.innerHTML = kakaoSvg + '<span class="text-black font-black whitespace-nowrap">카톡 1:1 상담</span>';
        rightGroup.insertBefore(btn, rightGroup.firstChild);
      }
    }

    // 2. Mobile Dropdown Menu Item (if not already present)
    var mobileDropdown = document.querySelector('nav .md\\:hidden.overflow-hidden, #mobile-menu-dropdown');
    if (mobileDropdown && !mobileDropdown.querySelector('a[href*="pf.kakao.com"]')) {
      var mBtn = document.createElement('a');
      mBtn.className = 'kakao-mobile-menu-btn flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#FDD835] text-black font-extrabold text-sm py-2.5 px-4 rounded-xl border border-[#E5CD00] shadow-sm mt-1';
      mBtn.href = kakaoUrl;
      mBtn.target = '_blank';
      mBtn.rel = 'noopener noreferrer';
      mBtn.innerHTML = kakaoSvg + '<span class="text-black font-black">카카오톡 1:1 상담하기</span>';
      mobileDropdown.appendChild(mBtn);
    }

    // 3. Floating Bottom-Right Chat Button (if not already present)
    if (!document.getElementById('kakao-floating-chat')) {
      var aside = document.createElement('aside');
      aside.id = 'kakao-floating-chat';
      aside.className = 'fixed bottom-6 right-6 z-50 flex items-center group';
      aside.innerHTML = [
        '<a href="' + kakaoUrl + '" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 bg-[#FEE500] hover:bg-[#FDD835] text-black font-black px-4 py-3 sm:px-4.5 sm:py-3.5 rounded-full border border-[#E5CD00] shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-black/5" aria-label="카카오톡 1:1 상담">',
        '  <svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C6.477 3 2 6.477 2 10.765c0 2.76 1.83 5.183 4.618 6.568l-.946 3.483c-.083.307.255.553.518.375l4.164-2.77c.535.056 1.083.084 1.646.084 5.523 0 10-3.477 10-7.765S17.523 3 12 3z" fill="#000000"/><path d="M7.74 8.79v4.42H6.55V9.83H5.2V8.79h3.74v1.04H7.74zm2.84 0l1.32 4.42h-1.22l-.24-.87H9.27l-.23.87H7.85l1.34-4.42h1.39zm-.37 2.61l-.34-1.29-.33 1.29h.67zm4.27 1.81h1.56v1h-2.75V8.79h1.19v4.42zm4.32-.97l1.19 1.97h-1.39l-.88-1.5-.47.46v1.04h-1.19V8.79h1.19v2.24l1.27-2.24h1.36l-1.08 1.85z" fill="#FEE500"/></svg>',
        '  <span class="text-sm font-sans tracking-tight font-black text-black hidden sm:inline-block">카톡 1:1 상담</span>',
        '</a>'
      ].join('');
      document.body.appendChild(aside);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 8. TOOL PAGE IFRAME LOADER DISMISSAL & FAILSAFE
  // ─────────────────────────────────────────────────────────────
  function fixToolLoader() {
    var overlay = document.getElementById('tool-loading-overlay') || 
                  document.querySelector('.w-full.h-\\[calc\\(100vh-109px\\)\\] .absolute.inset-0');
    var iframe = document.getElementById('tool-ai-frame') || 
                 document.querySelector('iframe[src*="ai.studio"], iframe[src*="hacgenini"], main iframe');

    function dismissOverlay() {
      if (overlay) {
        overlay.style.transition = 'opacity 0.4s ease';
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        setTimeout(function() {
          if (overlay) overlay.style.display = 'none';
        }, 400);
      }
    }

    if (iframe) {
      iframe.addEventListener('load', dismissOverlay);
    }
    // Dismiss after short timeout so users are never blocked even if iframe load event doesn't bubble
    setTimeout(dismissOverlay, 1800);
  }

  // ─────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────
  function init() {
    injectCSS();
    fixHomeNav();
    fixMobileMenu();
    fixBillboardHover();
    fixVideoAutoplay();
    injectKakaoChatWidget();
    fixToolLoader();
    setTimeout(fixSlideIn, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
