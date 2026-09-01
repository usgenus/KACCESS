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
    fixToolLoader();
    setTimeout(fixSlideIn, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
