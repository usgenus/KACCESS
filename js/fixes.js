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

      /* Responsive Nav & Mobile Menu Accordion */
      '@media (max-width: 767px) {',
      '  nav div.hidden.md\\:flex, nav .desktop-nav-links:not(.h-16):not([class*="justify-between"]) { display: none !important; }',
      '  #mobile-menu-btn { display: inline-flex !important; }',
      '}',
      '@media (min-width: 768px) {',
      '  nav div.hidden.md\\:flex, nav .desktop-nav-links:not(.h-16):not([class*="justify-between"]) { display: flex !important; align-items: center !important; gap: 26px !important; }',
      '  #mobile-menu-btn { display: none !important; }',
      '  #mobile-menu-dropdown { display: none !important; }',
      '}',
      '#mobile-menu-btn span { transition: transform 0.25s ease, opacity 0.25s ease !important; }',
      '.mobile-menu-open { max-height: 85vh !important; opacity: 1 !important; pointer-events: auto !important; overflow-y: auto !important; -webkit-overflow-scrolling: touch !important; display: flex !important; }',
      '#mobile-menu-dropdown { -webkit-overflow-scrolling: touch; }',
      '#mobile-menu-dropdown::-webkit-scrollbar { width: 4px; }',
      '#mobile-menu-dropdown::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }',
      '.mobile-accordion-group { transition: all 0.2s ease; }',
      '.mobile-accordion-btn { -webkit-tap-highlight-color: transparent; }',
      '.mobile-accordion-btn:active { background-color: rgba(241, 245, 249, 0.9); }',
      '.mobile-accordion-panel { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }',
      '.mobile-accordion-panel:not(.hidden) { display: flex !important; }',
      '.mobile-accordion-panel.hidden { display: none !important; }',
      '.mobile-acc-chevron { transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1); }',

      /* Billboard arrows & numbering hide */
      '#gallery-billboard-container button[aria-label="Previous Slide"],',
      '#gallery-billboard-container button[aria-label="Next Slide"],',
      '#gallery-billboard2-container button[aria-label="Previous Slide"],',
      '#gallery-billboard2-container button[aria-label="Next Slide"],',
      '#gallery-billboard-container span.font-mono,',
      '#gallery-billboard2-container span.font-mono { display: none !important; }',

      /* Mobile Header Sizing & Spacing — Ensure brand, 1:1 chat and hamburger button fit comfortably */
      '@media (max-width: 640px) {',
      '  .njap-brand-link { min-width: 0 !important; flex-shrink: 1 !important; gap: 6px !important; }',
      '  .njap-brand-link span.font-serif { font-size: 14px !important; line-height: 1.2 !important; white-space: nowrap !important; }',
      '  .njap-brand-link span[class*="text-\\[10px\\]"] { font-size: 9px !important; white-space: nowrap !important; }',
      '  nav .h-16 { gap: 6px !important; }',
      '  nav .h-16 .flex.items-center.gap-3, nav .h-16 .flex.items-center.gap-4 { gap: 6px !important; flex-shrink: 0 !important; }',
      '  #mobile-menu-btn { flex-shrink: 0 !important; display: inline-flex !important; }',
      '}',

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
  // 3. MOBILE ACCORDION MENU — responsive, non-cutoff, expandable
  // ─────────────────────────────────────────────────────────────
  function buildAccordionMenuHTML(curPath) {
    var isHome = curPath === '/' || curPath === '';
    var isBlog = curPath.indexOf('/blog') === 0;
    var isSenior = curPath.indexOf('/senior-care') === 0;
    var isMedicare = curPath.indexOf('/medicare') === 0;
    var isTool = curPath.indexOf('/tool') === 0 || curPath.indexOf('/matcher') === 0 || curPath.indexOf('/calculator') === 0 || curPath.indexOf('/dictionary') === 0;
    var isAbout = curPath.indexOf('/about') === 0;

    return [
      '<!-- 홈 (Direct) -->',
      '<a href="/" class="flex items-center justify-between py-2.5 px-3 text-[15px] ' + (isHome ? 'font-bold text-brand-blue bg-blue-50/50' : 'font-semibold text-slate-800 hover:text-brand-blue') + ' hover:bg-slate-50/80 rounded-xl transition-colors border-b border-slate-100">',
      '  <div class="flex items-center gap-2.5">',
      '    <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
      '    <span>홈 (Home)</span>',
      '  </div>',
      '  <span class="text-xs font-normal text-slate-400">메인</span>',
      '</a>',

      '<!-- 아코디언 1: 시니어 케어 -->',
      '<div class="mobile-accordion-group border-b border-slate-100">',
      '  <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold ' + (isSenior ? 'text-brand-blue' : 'text-slate-800') + ' hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-senior">',
      '    <div class="flex items-center gap-2.5">',
      '      <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>',
      '      <span>시니어 케어</span>',
      '      <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue font-semibold">재활·요양</span>',
      '    </div>',
      '    <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron ' + (isSenior ? 'rotate-180' : '') + '" style="' + (isSenior ? 'transform: rotate(180deg);' : '') + '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>',
      '  </button>',
      '  <div id="m-acc-senior" class="mobile-accordion-panel ' + (isSenior ? '' : 'hidden') + ' bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">',
      '    <a href="/senior-care" class="flex items-center gap-2 py-2 px-3 text-sm font-bold text-brand-blue hover:bg-white rounded-lg transition-colors">',
      '      <span class="text-xs">▶</span> 시니어 케어 센터 소개',
      '    </a>',
      '    <a href="/senior-care#rehab" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">',
      '      <span class="text-slate-400 text-xs">•</span> 단기 집중 재활 &amp; 물리치료',
      '    </a>',
      '    <a href="/senior-care#ltc" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">',
      '      <span class="text-slate-400 text-xs">•</span> 24시간 장기 요양 간호 (LTC)',
      '    </a>',
      '    <a href="/senior-care#clinical" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">',
      '      <span class="text-slate-400 text-xs">•</span> 전문 임상 케어 프로그램',
      '    </a>',
      '    <a href="/senior-care#inquiry" class="flex items-center gap-2 py-2 px-3 text-sm font-medium text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/70 rounded-lg transition-colors mt-0.5">',
      '      <span>💬</span> 1:1 입소 상담 및 투어 문의',
      '    </a>',
      '  </div>',
      '</div>',

      '<!-- 아코디언 2: 뉴스 & 의학 칼럼 -->',
      '<div class="mobile-accordion-group border-b border-slate-100">',
      '  <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold ' + (isBlog ? 'text-brand-blue' : 'text-slate-800') + ' hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-news">',
      '    <div class="flex items-center gap-2.5">',
      '      <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>',
      '      <span>뉴스 &amp; 의학 칼럼</span>',
      '      <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold">최신 소식</span>',
      '    </div>',
      '    <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron ' + (isBlog ? 'rotate-180' : '') + '" style="' + (isBlog ? 'transform: rotate(180deg);' : '') + '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>',
      '  </button>',
      '  <div id="m-acc-news" class="mobile-accordion-panel ' + (isBlog ? '' : 'hidden') + ' bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">',
      '    <a href="/blog" class="flex items-center gap-2 py-2 px-3 text-sm font-bold text-brand-blue hover:bg-white rounded-lg transition-colors">',
      '      <span class="text-xs">▶</span> 건강 뉴스 전체보기',
      '    </a>',
      '    <a href="/blog#columns" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">',
      '      <span class="text-slate-400 text-xs">•</span> 전문의 건강 칼럼',
      '    </a>',
      '    <a href="/blog#recalls" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">',
      '      <span class="text-slate-400 text-xs">•</span> FDA 안전 경보 &amp; 리콜',
      '    </a>',
      '  </div>',
      '</div>',

      '<!-- 아코디언 3: 메디케어 & ACA -->',
      '<div class="mobile-accordion-group border-b border-slate-100">',
      '  <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold ' + (isMedicare ? 'text-brand-blue' : 'text-slate-800') + ' hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-medicare">',
      '    <div class="flex items-center gap-2.5">',
      '      <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
      '      <span>메디케어 &amp; ACA</span>',
      '      <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold">보험 가이드</span>',
      '    </div>',
      '    <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron ' + (isMedicare ? 'rotate-180' : '') + '" style="' + (isMedicare ? 'transform: rotate(180deg);' : '') + '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>',
      '  </button>',
      '  <div id="m-acc-medicare" class="mobile-accordion-panel ' + (isMedicare ? '' : 'hidden') + ' bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">',
      '    <a href="/medicare" class="flex items-center gap-2 py-2 px-3 text-sm font-bold text-brand-blue hover:bg-white rounded-lg transition-colors">',
      '      <span class="text-xs">▶</span> 메디케어 &amp; ACA 홈',
      '    </a>',
      '    <a href="/medicare#medicare-types" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">',
      '      <span class="text-slate-400 text-xs">•</span> 메디케어 파트 A·B·C·D 완벽 정리',
      '    </a>',
      '    <a href="/medicare#aca-types" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">',
      '      <span class="text-slate-400 text-xs">•</span> ACA 오바마케어 안내',
      '    </a>',
      '    <a href="/medicare#faq" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">',
      '      <span class="text-slate-400 text-xs">•</span> 자주 묻는 질문 (FAQ)',
      '    </a>',
      '  </div>',
      '</div>',

      '<!-- 아코디언 4: 환자도우미 스마트 도구 -->',
      '<div class="mobile-accordion-group border-b border-slate-100">',
      '  <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold ' + (isTool ? 'text-brand-blue' : 'text-slate-800') + ' hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-tool">',
      '    <div class="flex items-center gap-2.5">',
      '      <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      '      <span>환자도우미</span>',
      '      <span class="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold">스마트 도구</span>',
      '    </div>',
      '    <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron ' + (isTool ? 'rotate-180' : '') + '" style="' + (isTool ? 'transform: rotate(180deg);' : '') + '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>',
      '  </button>',
      '  <div id="m-acc-tool" class="mobile-accordion-panel ' + (isTool ? '' : 'hidden') + ' bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">',
      '    <a href="/tool" class="flex items-center gap-2 py-2 px-3 text-sm font-bold text-brand-blue hover:bg-white rounded-lg transition-colors">',
      '      <span class="text-xs">▶</span> 환자도우미 허브 홈',
      '    </a>',
      '    <a href="/matcher" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">',
      '      <span class="text-slate-400 text-xs">•</span> 스마트 보험 자격 진단기',
      '    </a>',
      '    <a href="/calculator" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">',
      '      <span class="text-slate-400 text-xs">•</span> 건강보험료 보조금 계산기',
      '    </a>',
      '    <a href="/dictionary" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">',
      '      <span class="text-slate-400 text-xs">•</span> 영-한 의학 용어 사전',
      '    </a>',
      '  </div>',
      '</div>',

      '<!-- 아코디언 5: 센터 소개 -->',
      '<div class="mobile-accordion-group border-b border-slate-100">',
      '  <button type="button" class="mobile-accordion-btn flex items-center justify-between w-full py-2.5 px-3 text-[15px] font-bold ' + (isAbout ? 'text-brand-blue' : 'text-slate-800') + ' hover:text-brand-blue hover:bg-slate-50/80 rounded-xl transition-colors text-left cursor-pointer" data-target="m-acc-about">',
      '    <div class="flex items-center gap-2.5">',
      '      <svg class="w-4 h-4 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      '      <span>센터 소개</span>',
      '      <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">About</span>',
      '    </div>',
      '    <svg class="w-4 h-4 text-slate-400 transition-transform duration-200 mobile-acc-chevron ' + (isAbout ? 'rotate-180' : '') + '" style="' + (isAbout ? 'transform: rotate(180deg);' : '') + '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>',
      '  </button>',
      '  <div id="m-acc-about" class="mobile-accordion-panel ' + (isAbout ? '' : 'hidden') + ' bg-slate-50/80 rounded-xl p-2 my-1 border border-slate-100 flex flex-col gap-1">',
      '    <a href="/about" class="flex items-center gap-2 py-2 px-3 text-sm font-bold text-brand-blue hover:bg-white rounded-lg transition-colors">',
      '      <span class="text-xs">▶</span> 센터 소개 및 미션',
      '    </a>',
      '    <a href="/about#contact" class="flex items-center gap-2 py-1.5 px-3 text-sm text-slate-700 hover:text-brand-blue hover:bg-white rounded-lg transition-colors">',
      '      <span class="text-slate-400 text-xs">•</span> 찾아오시는 길 &amp; 상담 문의',
      '    </a>',
      '  </div>',
      '</div>',

      '<!-- 하단 CTA: 카카오톡 1:1 상담 및 전화 연결 -->',
      '<div class="pt-3 pb-3 flex flex-col gap-2">',
      '  <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3.5 bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#FBC02D] text-[#191919] rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer">',
      '    <div class="flex items-center gap-2.5">',
      '      <img src="/kakaotalk-icon.png" alt="KakaoTalk" class="w-6 h-6 rounded-md shrink-0 object-contain shadow-xs" />',
      '      <div class="flex flex-col text-left">',
      '        <span class="text-sm font-bold leading-tight">카카오톡 1:1 상담 바로가기</span>',
      '        <span class="text-[11px] font-medium text-black/70">의료 복지 및 시니어 케어 실시간 문의</span>',
      '      </div>',
      '    </div>',
      '    <svg class="w-4 h-4 text-black/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>',
      '  </a>',
      '</div>'
    ].join('\n');
  }

  function initAccordionToggles(dropdown) {
    if (!dropdown) return;
    var btns = dropdown.querySelectorAll('.mobile-accordion-btn');
    btns.forEach(function(b) {
      if (b.dataset.accBound) return;
      b.dataset.accBound = '1';
      b.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var targetId = b.getAttribute('data-target');
        var panel = targetId ? dropdown.querySelector('#' + targetId) : null;
        var chevron = b.querySelector('.mobile-acc-chevron');
        var isCurrentlyOpen = panel && !panel.classList.contains('hidden') && panel.style.display !== 'none';

        // Close other panels for clean accordion UX
        dropdown.querySelectorAll('.mobile-accordion-panel').forEach(function(p) {
          p.classList.add('hidden');
          p.style.display = 'none';
        });
        dropdown.querySelectorAll('.mobile-acc-chevron').forEach(function(ch) {
          ch.style.transform = '';
          ch.classList.remove('rotate-180');
        });

        if (!isCurrentlyOpen && panel) {
          panel.classList.remove('hidden');
          panel.style.display = 'flex';
          if (chevron) {
            chevron.style.transform = 'rotate(180deg)';
            chevron.classList.add('rotate-180');
          }
        }
      });
    });
  }

  function fixMobileMenu() {
    var nav = document.querySelector('nav');
    if (!nav) return;

    // Find or create hamburger button
    var btn = document.getElementById('mobile-menu-btn') ||
              document.querySelector('button[aria-label="Menu"]');
    
    // Find dropdown
    var dropdown = document.getElementById('mobile-menu-dropdown');
    if (!dropdown) {
      var divs = nav.querySelectorAll('div');
      for (var i = 0; i < divs.length; i++) {
        var d = divs[i];
        var cls = d.className || '';
        if (cls.indexOf('md:hidden') !== -1 && (d.querySelector('a') || cls.indexOf('opacity-') !== -1)) {
          dropdown = d;
          dropdown.id = 'mobile-menu-dropdown';
          break;
        }
      }
    }

    if (!btn || !dropdown) return;

    var curPath = window.location.pathname.replace(/\/$/, '').toLowerCase() || '/';

    // Upgrade to rich accordion if not yet present
    if (!dropdown.querySelector('.mobile-accordion-group')) {
      dropdown.innerHTML = buildAccordionMenuHTML(curPath);
    }
    initAccordionToggles(dropdown);

    if (btn.dataset.fxbound) return;
    btn.dataset.fxbound = '1';

    // Initial closed styling
    dropdown.style.maxHeight = '0';
    dropdown.style.opacity = '0';
    dropdown.style.overflow = 'hidden';
    dropdown.style.pointerEvents = 'none';
    dropdown.style.transition = 'max-height .35s cubic-bezier(0.4, 0, 0.2, 1), opacity .25s ease';

    var spans = btn.querySelectorAll('span');
    var open = false;

    function openMenu() {
      open = true;
      dropdown.classList.remove('max-h-0', 'opacity-0');
      dropdown.classList.add('mobile-menu-open');
      dropdown.style.maxHeight = '85vh';
      dropdown.style.opacity = '1';
      dropdown.style.overflowY = 'auto';
      dropdown.style.pointerEvents = 'auto';
      dropdown.style.display = 'flex';
      if (spans[0]) spans[0].style.transform = 'translateY(6px) rotate(45deg)';
      if (spans[1]) spans[1].style.opacity = '0';
      if (spans[2]) spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
    }

    function closeMenu() {
      open = false;
      dropdown.classList.remove('mobile-menu-open');
      dropdown.classList.add('max-h-0', 'opacity-0');
      dropdown.style.maxHeight = '0';
      dropdown.style.opacity = '0';
      dropdown.style.overflowY = 'hidden';
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
      a.addEventListener('click', function() { setTimeout(closeMenu, 80); });
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

    // 1. Desktop Nav container - target specifically the desktop links wrapper, NOT parent containers
    var desktopDiv = null;
    var allDivs = nav.querySelectorAll('div');
    for (var i = 0; i < allDivs.length; i++) {
      var div = allDivs[i];
      // Clean up any accidental desktop-nav-links on parent header containers
      if (div.classList.contains('h-16') || div.querySelector('#mobile-menu-btn') || div.querySelector('.njap-brand-link')) {
        div.classList.remove('desktop-nav-links');
        continue;
      }
      var homeA = div.querySelector('a[href="/"]');
      var blogA = div.querySelector('a[href="/blog"]');
      if (homeA && blogA && (div.classList.contains('md:flex') || div.className.indexOf('items-center') !== -1) && !div.classList.contains('md:hidden') && div.id !== 'mobile-menu-dropdown') {
        desktopDiv = div;
        break;
      }
    }

    if (desktopDiv) {
      desktopDiv.classList.add('desktop-nav-links');
      desktopDiv.style.gap = '26px';

      var seniorA = desktopDiv.querySelector('a[href*="senior-care"]');
      var blogA = desktopDiv.querySelector('a[href="/blog"]');
      if (!seniorA && blogA) {
        seniorA = document.createElement('a');
        seniorA.href = '/senior-care';
        seniorA.textContent = '시니어 케어';
        seniorA.className = 'nav-link pb-0.5 ' + (curPath === '/senior-care' ? 'font-bold text-brand-blue' : 'font-medium text-slate-700 hover:text-brand-blue');
        if (blogA.nextSibling) {
          desktopDiv.insertBefore(seniorA, blogA.nextSibling);
        } else {
          desktopDiv.appendChild(seniorA);
        }
      } else if (seniorA) {
        if (curPath === '/senior-care') {
          seniorA.classList.add('font-bold', 'text-brand-blue');
          seniorA.classList.remove('text-slate-700');
        }
      }
    }

    // 2. Mobile Nav Dropdown
    var mobileDropdown = document.getElementById('mobile-menu-dropdown') ||
                          nav.querySelector('.md\\:hidden[class*="flex-col"], div[class*="max-h-"] div');
    if (mobileDropdown) {
      if (!mobileDropdown.querySelector('.mobile-accordion-group')) {
        mobileDropdown.innerHTML = buildAccordionMenuHTML(curPath);
      }
      initAccordionToggles(mobileDropdown);
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
    fixMobileMenu();
    var nav = document.querySelector('nav');
    if (nav && window.MutationObserver) {
      var obs = new MutationObserver(function() {
        ensureSeniorCareInNav();
        fixMobileMenu();
      });
      obs.observe(nav, { childList: true, subtree: true });
    }
    // Periodic safety check during first 3 seconds to catch delayed React hydration
    var checks = 0;
    var timer = setInterval(function() {
      ensureSeniorCareInNav();
      fixMobileMenu();
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
