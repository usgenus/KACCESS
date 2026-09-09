/**
 * Healthcare Access Portal — Critical Fixes Script v1.4
 * Loaded AFTER cms-client.js to patch any remaining issues.
 * This handles: mobile menu, home nav, billboard hover scale,
 * video autoplay prevention, section slide-in, 의사칼럼 sidebar,
 * global KakaoTalk nav button injection, about-page KakaoTalk CTA,
 * and Next.js cross-page DOM corruption guard.
 */
(function() {
  'use strict';

  var KAKAO_URL = 'http://pf.kakao.com/_hdxmxaX/chat';
  var KAKAO_ICON = '/kakaotalk-icon.png';

  // ─────────────────────────────────────────────────────────────
  // 0. NEXT.JS CROSS-PAGE CORRUPTION GUARD
  //    When navigating back from Next.js pages (about/blog/medicare)
  //    to standalone pages (tool/calculator/matcher/dictionary),
  //    Next.js re-hydration can corrupt the DOM. Detect and hard-reload.
  // ─────────────────────────────────────────────────────────────
  (function fixNextJsCrossPageCorruption() {
    var path = window.location.pathname.replace(/\/$/, '') || '/';
    var toolPages = ['/tool', '/calculator', '/matcher', '/dictionary'];
    var isToolPage = toolPages.some(function(p) { return path === p || path.startsWith(p + '/'); });
    var isSeniorCare = path === '/senior-care' || path.startsWith('/senior-care/');

    // Only run corruption check on standalone tool pages and senior care page
    if (!isToolPage && !isSeniorCare) return;

    function isCorrupted() {
      if (isSeniorCare) {
        if (!document.querySelector('#senior-care-hero, .cjr-banner, .senior-two-col, h1')) return true;
        return false;
      }
      if (isToolPage) {
        if (window.__next_f && window.__next_f.length > 0) return true;
        if (!document.querySelector('.hub-tab-btn, .hub-tab-active, .hub-tab-inactive, #calc-income-input, #dict-search, #tool-ai-frame')) return true;
        return false;
      }
      return false;
    }

    function checkAndReload() {
      if (isCorrupted()) {
        window.location.reload(true);
      }
    }

    window.addEventListener('pageshow', function(e) {
      if (e.persisted) {
        setTimeout(checkAndReload, 50);
      }
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(checkAndReload, 100);
      });
    } else {
      setTimeout(checkAndReload, 100);
    }
  })();


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
      '.fx-slide { opacity:0; transform:translateY(18px);',
      '  transition: opacity .45s cubic-bezier(.22,1,.36,1), transform .45s cubic-bezier(.22,1,.36,1); }',
      '.fx-slide.fx-in { opacity:1; transform:none; }',
      '#cms-blog-main-section, section:has(#cms-blog-posts-grid), #cms-blog-posts-grid, .blog-post-card-item, .blog-post-card-item article { opacity: 1 !important; visibility: visible !important; transform: none !important; }',

      /* Page entry fade-in */
      '@keyframes bodyFadeIn { from { opacity:0; } to { opacity:1; } }',
      'body { animation: bodyFadeIn 0.22s ease-out both; }',

      /* Billboard hover scale */
      '.bb-img { transition: transform .9s ease; }',
      ':hover > .bb-img, :hover .bb-img { transform: scale(1.05); }',

      /* 의사칼럼 sidebar */
      '#doctor-column-sidebar { }',
      '#doctor-column-sidebar .dc-item { border-bottom: 1px solid #e5e7eb; }',
      '#doctor-column-sidebar .dc-item:last-child { border-bottom: none; }',

      /* Billboard 1 Vignette Effect — Layer 2: between media and text */
      '.billboard1-vignette { position: absolute !important; inset: 0 !important; pointer-events: none !important; z-index: 3 !important; box-shadow: inset 0 0 110px 30px rgba(0,0,0,0.7) !important; background: radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%) !important; }',

      /* Page entry fade-in — graceful fallback if inline FOUC guard style is missing */
      '@keyframes bodyFadeIn { from { opacity:0; } to { opacity:1; } }',
      'body.fouc-guard-missing { animation: bodyFadeIn 0.28s ease-out both; }',

      /* Mobile menu open state */
      '.mobile-menu-open { max-height: 400px !important; opacity: 1 !important; pointer-events: auto !important; }',

      /* KakaoTalk large CTA button (about page) */
      '.kakao-cta-btn {',
      '  display: flex; align-items: center; justify-content: center; gap: 10px;',
      '  width: 100%; padding: 14px 20px; margin-top: 16px;',
      '  background: #FEE500; color: #191919;',
      '  font-weight: 700; font-size: 15px; border-radius: 14px;',
      '  border: none; cursor: pointer; text-decoration: none;',
      '  transition: opacity .18s ease, transform .18s ease;',
      '  box-shadow: 0 2px 12px rgba(0,0,0,0.10);',
      '}',
      '.kakao-cta-btn:hover { opacity: 0.88; transform: translateY(-1px); }',
      '.kakao-cta-btn img { width: 26px; height: 26px; border-radius: 6px; object-fit: contain; flex-shrink: 0; }',
      '.kakao-cta-label { display: flex; flex-direction: column; align-items: flex-start; line-height: 1.25; }',
      '.kakao-cta-label .kakao-cta-sub { font-size: 11px; font-weight: 500; opacity: 0.65; }',
    ].join('\n');
    document.head.appendChild(s);
  }

  // ─────────────────────────────────────────────────────────────
  // 2. HARD NATIVE NAVIGATION — completely disables Next.js client router
  //    Guarantees every page transition is a fresh HTTP server load
  // ─────────────────────────────────────────────────────────────
  function fixAllNavigation() {
    // A. Intercept all internal <a> link clicks in the CAPTURE phase
    document.addEventListener('click', function(e) {
      // Don't intercept right clicks or modifier keys (Cmd/Ctrl click opens in new tab)
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      var el = e.target;
      while (el && el !== document) {
        var tag = (el.tagName || '').toLowerCase();
        if (tag === 'a') {
          var href = el.getAttribute('href');
          var target = el.getAttribute('target');

          // Ignore empty, anchor-only (#...), javascript:, mailto:, tel:, or target="_blank"
          if (!href || href.startsWith('#') || href.startsWith('javascript:') || 
              href.startsWith('mailto:') || href.startsWith('tel:') || target === '_blank') {
            return;
          }

          try {
            var dest = new URL(href, window.location.href);
            // Ignore external links (different domain, e.g. kakao)
            if (dest.origin !== window.location.origin) {
              return;
            }

            var curPath = (window.location.pathname.replace(/\/$/, '') || '/').toLowerCase();
            var destPath = (dest.pathname.replace(/\/$/, '') || '/').toLowerCase();

            // Check if staying on the same page with a hash anchor (e.g. /medicare#aca on /medicare)
            if (destPath === curPath) {
              if (dest.hash) {
                // Let browser handle hash scroll on same page
                return;
              }
              // Same page with no hash (e.g. clicking 홈 while on 홈)
              if (curPath === '/' || curPath === '/index.html' || curPath === '/index.php') {
                e.preventDefault();
                e.stopImmediatePropagation();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
              }
            }

            // Target is a different page -> FORCE CLEAN NATIVE FULL PAGE LOAD
            e.preventDefault();
            e.stopImmediatePropagation();
            window.location.href = dest.href;
            return;
          } catch (err) {
            // URL parse failed, do not block
            return;
          }
        }
        el = el.parentElement;
      }
    }, true); // CAPTURE phase: intercepts BEFORE Next.js or React router sees the click

    // B. Intercept history.pushState / history.replaceState
    // If Next.js client router attempts to change page programmatically, force a real page load
    try {
      var origPushState = history.pushState;
      history.pushState = function(state, title, url) {
        if (url) {
          try {
            var dest = new URL(url, window.location.href);
            var curPath = (window.location.pathname.replace(/\/$/, '') || '/').toLowerCase();
            var destPath = (dest.pathname.replace(/\/$/, '') || '/').toLowerCase();
            if (dest.origin === window.location.origin && destPath !== curPath) {
              window.location.href = dest.href;
              return;
            }
          } catch (e) {}
        }
        return origPushState.apply(this, arguments);
      };

      var origReplaceState = history.replaceState;
      history.replaceState = function(state, title, url) {
        if (url) {
          try {
            var dest = new URL(url, window.location.href);
            var curPath = (window.location.pathname.replace(/\/$/, '') || '/').toLowerCase();
            var destPath = (dest.pathname.replace(/\/$/, '') || '/').toLowerCase();
            if (dest.origin === window.location.origin && destPath !== curPath) {
              window.location.href = dest.href;
              return;
            }
          } catch (e) {}
        }
        return origReplaceState.apply(this, arguments);
      };
    } catch (e) {}

    // C. Browser Back / Forward buttons (bfcache & popstate)
    var lastRecordedPath = window.location.pathname.replace(/\/$/, '').toLowerCase() || '/';

    window.addEventListener('pageshow', function(e) {
      ensureSeniorCareInNav();
      if (e.persisted && !window._bfReloaded) {
        window._bfReloaded = true;
        window.location.reload();
      }
    });

    window.addEventListener('popstate', function() {
      var newPath = window.location.pathname.replace(/\/$/, '').toLowerCase() || '/';
      // If history traversal moved to a different page, ensure fresh server reload
      if (newPath !== lastRecordedPath) {
        lastRecordedPath = newPath;
        window.location.reload();
      }
    });
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
    var raw = document.querySelectorAll('main section:not(#gallery-billboard-section), main > article, .fx-slide-target');
    if (!raw.length) return;

    var sections = [];
    for (var k = 0; k < raw.length; k++) {
      var node = raw[k];
      if (node.querySelector('#cms-blog-posts-grid') || node.id === 'cms-blog-main-section' || node.id === 'cms-blog-posts-grid' || node.closest('#cms-blog-posts-grid') || node.classList.contains('blog-post-card-item') || node.closest('.blog-post-card-item')) {
        continue;
      }
      sections.push(node);
    }
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
  // 7. GLOBAL KAKAO NAV BUTTON — ensure it appears on every page
  // ─────────────────────────────────────────────────────────────
  function injectKakaoNavBtn() {
    // Already present? Skip.
    if (document.querySelector('a[href*="pf.kakao.com"]')) return;

    // Find the right-side flex div inside <nav> that holds the hamburger button
    var nav = document.querySelector('nav');
    if (!nav) return;
    var rightDiv = nav.querySelector('.flex.items-center.gap-3, .flex.items-center.gap-4');
    if (!rightDiv) return;

    var a = document.createElement('a');
    a.href = KAKAO_URL;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.title = '카카오톡 1:1 상담 바로가기';
    a.className = 'inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer';
    a.innerHTML =
      '<img src="' + KAKAO_ICON + '" alt="KakaoTalk" style="width:24px;height:24px;border-radius:6px;object-fit:contain;flex-shrink:0;box-shadow:0 1px 3px rgba(0,0,0,.12)" />' +
      '<span style="font-size:13px;font-weight:700;color:#1e293b;white-space:nowrap;letter-spacing:-0.01em;">1:1 상담</span>';

    // Insert before the hamburger (or at the start of rightDiv)
    var hamburger = rightDiv.querySelector('button[aria-label="Menu"]');
    if (hamburger) {
      rightDiv.insertBefore(a, hamburger);
    } else {
      rightDiv.insertBefore(a, rightDiv.firstChild);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 8. ABOUT PAGE — large KakaoTalk CTA below 상담 가능 대표 언어
  // ─────────────────────────────────────────────────────────────
  function injectKakaoAboutBlock() {
    // Find the 상담 가능 대표 언어 card by its heading text
    var headings = document.querySelectorAll('h4');
    var targetCard = null;
    for (var i = 0; i < headings.length; i++) {
      if (headings[i].textContent.indexOf('상담 가능 대표 언어') !== -1) {
        targetCard = headings[i].closest('div');
        break;
      }
    }
    if (!targetCard) return;
    // Already injected?
    if (targetCard.querySelector('.kakao-cta-btn')) return;

    var a = document.createElement('a');
    a.href = KAKAO_URL;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'kakao-cta-btn';
    a.innerHTML =
      '<img src="' + KAKAO_ICON + '" alt="KakaoTalk" />' +
      '<span class="kakao-cta-label">' +
        '<span>카카오톡 1:1 상담 바로가기</span>' +
        '<span class="kakao-cta-sub">한국어 전문 상담원이 즉시 답변합니다</span>' +
      '</span>';

    targetCard.appendChild(a);
  }

  // ─────────────────────────────────────────────────────────────
  // 9. TOOL PAGE IFRAME LOADER DISMISSAL & FAILSAFE
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
  // FOUC REVEAL — lift body opacity after styles are computed
  //   Every page that includes fixes.js will be unblocked here.
  //   For home/about, the inline reveal script fires first, but
  //   calling this again is harmless (already opacity:1 by then).
  // ─────────────────────────────────────────────────────────────
  function revealBody() {
    if (document.body) {
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          document.body.style.opacity = '1';
        });
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 12. PERMANENT NAV GUARDIAN
  //     Ensures "시니어 케어" is always in desktop and mobile nav,
  //     and keeps desktop spacing clean (gap: 26px), even across
  //     Next.js client-side navigation, back/forward history, and hydration.
  // ─────────────────────────────────────────────────────────────
  function ensureSeniorCareInNav() {
    var nav = document.querySelector('nav');
    if (!nav) return;

    var curPath = (window.location.pathname.replace(/\/$/, '') || '/').toLowerCase();

    // 1. Desktop Nav container
    var allDivs = nav.querySelectorAll('div');
    for (var i = 0; i < allDivs.length; i++) {
      var div = allDivs[i];
      var homeA = div.querySelector('a[href="/"]');
      var blogA = div.querySelector('a[href="/blog"]');
      if (homeA && blogA && (div.classList.contains('md:flex') || div.style.display === 'flex' || div.className.indexOf('items-center') !== -1) && !div.classList.contains('md:hidden') && div.id !== 'mobile-menu-dropdown') {
        // Enforce spacious spacing
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.gap = '26px';

        var seniorA = div.querySelector('a[href*="senior-care"]');
        if (!seniorA) {
          seniorA = document.createElement('a');
          seniorA.href = '/senior-care';
          seniorA.textContent = '시니어 케어';
          seniorA.className = 'nav-link pb-0.5 ' + (curPath === '/senior-care' ? 'font-bold text-brand-blue' : 'font-medium text-slate-700 hover:text-brand-blue');
          if (blogA.nextSibling) {
            div.insertBefore(seniorA, blogA.nextSibling);
          } else {
            div.appendChild(seniorA);
          }
        } else {
          if (curPath === '/senior-care') {
            seniorA.classList.add('font-bold', 'text-brand-blue');
            seniorA.classList.remove('text-slate-700');
          }
        }
      }
    }

    // 2. Mobile Nav Dropdown
    var mobileDropdown = document.getElementById('mobile-menu-dropdown') ||
                          nav.querySelector('.md\\:hidden[class*="flex-col"], div[class*="max-h-"] div');
    if (mobileDropdown) {
      var mBlogA = mobileDropdown.querySelector('a[href="/blog"]');
      var mSeniorA = mobileDropdown.querySelector('a[href*="senior-care"]');
      if (mBlogA && !mSeniorA) {
        mSeniorA = document.createElement('a');
        mSeniorA.href = '/senior-care';
        mSeniorA.textContent = '시니어 케어';
        mSeniorA.className = 'font-sans text-sm ' + (curPath === '/senior-care' ? 'font-bold text-brand-blue' : 'font-medium text-brand-dark hover:text-brand-blue') + ' py-2 border-b border-brand-border/50 transition-colors';
        if (mBlogA.nextSibling) {
          mobileDropdown.insertBefore(mSeniorA, mBlogA.nextSibling);
        } else {
          mobileDropdown.appendChild(mSeniorA);
        }
      }
    }

    // 3. Footer
    var footer = document.querySelector('footer');
    if (footer) {
      var footerBlogA = footer.querySelector('a[href="/blog"]');
      var footerSeniorA = footer.querySelector('a[href*="senior-care"]');
      if (footerBlogA && !footerSeniorA) {
        var li = document.createElement('li');
        var fA = document.createElement('a');
        fA.href = '/senior-care';
        fA.textContent = '시니어 케어';
        fA.className = 'text-sm font-sans text-white/60 hover:text-white transition-colors duration-200';
        li.appendChild(fA);
        var pLi = footerBlogA.closest('li');
        if (pLi && pLi.parentElement) {
          if (pLi.nextSibling) {
            pLi.parentElement.insertBefore(li, pLi.nextSibling);
          } else {
            pLi.parentElement.appendChild(li);
          }
        }
      }
    }
  }

  function setupNavObserver() {
    ensureSeniorCareInNav();
    var nav = document.querySelector('nav');
    if (nav && window.MutationObserver) {
      var obs = new MutationObserver(function() {
        ensureSeniorCareInNav();
      });
      obs.observe(nav, { childList: true, subtree: true });
    }
    // Periodic safety check during first 3 seconds to catch delayed React hydration
    var checks = 0;
    var timer = setInterval(function() {
      ensureSeniorCareInNav();
      checks++;
      if (checks > 12) clearInterval(timer);
    }, 250);
  }

  // ─────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────
  // Run navigation interception immediately so no clicks can escape
  fixAllNavigation();
  ensureSeniorCareInNav();
  window.addEventListener('pageshow', ensureSeniorCareInNav);
  window.addEventListener('popstate', ensureSeniorCareInNav);

  function init() {
    revealBody();
    injectCSS();
    fixAllNavigation();
    setupNavObserver();
    fixMobileMenu();
    fixBillboardHover();
    fixVideoAutoplay();
    fixToolLoader();
    // Kakao injections — run after a short delay to allow CMS-rendered navs to settle
    setTimeout(function() {
      injectKakaoNavBtn();
      injectKakaoAboutBlock();
      ensureSeniorCareInNav();
    }, 150);
    setTimeout(fixSlideIn, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
