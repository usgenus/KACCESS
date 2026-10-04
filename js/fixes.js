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

  // Eradicate Senior Mode state & classes on load
  (function cleanupSeniorModeImmediate() {
    try {
      sessionStorage.removeItem('njap_senior_mode');
      sessionStorage.removeItem('njap_senior_user_chosen');
      localStorage.removeItem('njap_senior_mode');
      localStorage.removeItem('njap_senior_user_chosen');
      document.documentElement.classList.remove('senior-mode-1', 'senior-mode-2');
    } catch(e) {}
  })();

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

      /* Billboard Container & Layer Visibility Fix */
      '#gallery-billboard-container > div, #gallery-billboard2-container > div {',
      '  height: clamp(300px, 38.32vw, 624px) !important;',
      '  min-height: 300px !important;',
      '  max-height: 624px !important;',
      '  width: 100% !important;',
      '  position: relative !important;',
      '  overflow: hidden !important;',
      '}',
      '#gallery-billboard-container a, #gallery-billboard2-container a {',
      '  display: block !important;',
      '  position: absolute !important;',
      '  inset: 0 !important;',
      '  width: 100% !important;',
      '  height: 100% !important;',
      '  overflow: hidden !important;',
      '}',
      '#gallery-billboard-container video, #gallery-billboard2-container video,',
      '#billboard-active-video, #billboard2-active-video {',
      '  position: absolute !important;',
      '  top: 0 !important;',
      '  left: 0 !important;',
      '  width: 100% !important;',
      '  height: 100% !important;',
      '  object-fit: cover !important;',
      '  object-position: center !important;',
      '  transform: none !important;',
      '}',
      '#billboard-active-img, #billboard2-active-img {',
      '  position: absolute !important;',
      '  top: 0 !important;',
      '  left: 0 !important;',
      '  width: 100% !important;',
      '  height: 100% !important;',
      '  object-fit: cover !important;',
      '  object-position: center !important;',
      '}',
      '.billboard-text-layer {',
      '  position: absolute !important;',
      '  inset: 0 !important;',
      '  width: 100% !important;',
      '  height: 100% !important;',
      '  display: flex !important;',
      '  align-items: flex-end !important;',
      '  z-index: 10 !important;',
      '  pointer-events: none !important;',
      '}',
      '.billboard-text-layer > div {',
      '  pointer-events: auto !important;',
      '}',
      '@media (max-width: 640px) {',
      '  #gallery-billboard-section, #gallery-billboard2-section { margin-top: 0 !important; margin-bottom: 1.25rem !important; }',
      '}',

      /* Slide-in animation */
      '.fx-slide { opacity:0; transform:translateY(18px);',
      '  transition: opacity .45s cubic-bezier(.22,1,.36,1), transform .45s cubic-bezier(.22,1,.36,1); }',
      '.fx-slide.fx-in { opacity:1; transform:none; }',
      '#cms-blog-main-section, section:has(#cms-blog-posts-grid), #cms-blog-posts-grid, .blog-post-card-item, .blog-post-card-item article { opacity: 1 !important; visibility: visible !important; transform: none !important; }',
      '#rc-main-content section, .rc-tab-view section { opacity: 1 !important; visibility: visible !important; transform: none !important; }',

      /* ========================================================
         COMPREHENSIVE COLOR CONTRAST & ACCESSIBILITY ENGINE
         Prevents white-on-white, dark-on-dark, and uncompiled Tailwind fallbacks
         ======================================================== */
      /* 1. Slate & Neutral Text Shades */
      '.text-slate-100 { color: #f1f5f9 !important; }',
      '.text-slate-200 { color: #e2e8f0 !important; }',
      '.text-slate-300 { color: #cbd5e1 !important; }',
      '.text-slate-400 { color: #94a3b8 !important; }',
      '.text-slate-500 { color: #64748b !important; }',
      '.text-slate-600 { color: #475569 !important; }',
      '.text-slate-700 { color: #334155 !important; }',
      '.text-slate-800 { color: #1e293b !important; }',
      '.text-slate-900 { color: #0f172a !important; }',
      '.text-gray-300 { color: #d1d5db !important; }',
      '.text-gray-400 { color: #9ca3af !important; }',
      '.text-gray-500 { color: #6b7280 !important; }',
      '.text-brand-muted { color: #64748b !important; }',
      '.text-brand-dark { color: #0f172a !important; }',
      '.text-brand-darker { color: #071322 !important; }',

      /* 1b. Emerald, Amber, Sky & Accent Shades */
      '.bg-emerald-50 { background-color: #ecfdf5 !important; }',
      '.bg-emerald-100 { background-color: #d1fae5 !important; }',
      '.bg-emerald-200 { background-color: #a7f3d0 !important; }',
      '.bg-emerald-500 { background-color: #10b981 !important; color: #ffffff !important; }',
      '.bg-emerald-600 { background-color: #059669 !important; color: #ffffff !important; }',
      '.bg-emerald-700 { background-color: #047857 !important; color: #ffffff !important; }',
      '.bg-emerald-800 { background-color: #065f46 !important; color: #ffffff !important; }',
      '.bg-emerald-900 { background-color: #064e3b !important; color: #ffffff !important; }',
      '.bg-emerald-950 { background-color: #022c22 !important; color: #ffffff !important; }',
      '.text-emerald-300 { color: #6ee7b7 !important; }',
      '.text-emerald-400 { color: #34d399 !important; }',
      '.text-emerald-500 { color: #10b981 !important; }',
      '.text-emerald-600 { color: #059669 !important; }',
      '.text-emerald-700 { color: #047857 !important; }',
      '.text-emerald-800 { color: #065f46 !important; }',
      '.text-emerald-900 { color: #064e3b !important; }',
      '.border-emerald-100 { border-color: #d1fae5 !important; }',
      '.border-emerald-200 { border-color: #a7f3d0 !important; }',
      '.border-emerald-300 { border-color: #6ee7b7 !important; }',
      '.border-emerald-400 { border-color: #34d399 !important; }',
      '.border-emerald-500 { border-color: #10b981 !important; }',
      '.border-emerald-600 { border-color: #059669 !important; }',
      '.border-emerald-700 { border-color: #047857 !important; }',
      '.border-emerald-800 { border-color: #065f46 !important; }',
      '.bg-amber-50 { background-color: #fffbeb !important; }',
      '.bg-amber-100 { background-color: #fef3c7 !important; }',
      '.bg-amber-200 { background-color: #fde68a !important; }',
      '.bg-amber-500 { background-color: #f59e0b !important; color: #ffffff !important; }',
      '.bg-amber-600 { background-color: #d97706 !important; color: #ffffff !important; }',
      '.text-amber-300 { color: #fcd34d !important; }',
      '.text-amber-400 { color: #fbbf24 !important; }',
      '.text-amber-700 { color: #b45309 !important; }',
      '.text-amber-800 { color: #92400e !important; }',
      '.text-amber-900 { color: #78350f !important; }',
      '.text-amber-950 { color: #451a03 !important; }',
      '.border-amber-200 { border-color: #fde68a !important; }',
      '.border-amber-300 { border-color: #fcd34d !important; }',
      '.text-sky-200 { color: #bae6fd !important; }',
      '.text-sky-300 { color: #7dd3fc !important; }',
      '.text-sky-400 { color: #38bdf8 !important; }',
      '.text-blue-100 { color: #dbeafe !important; }',
      '.text-blue-200 { color: #bfdbfe !important; }',
      '.text-blue-300 { color: #93c5fd !important; }',
      '.text-blue-400 { color: #60a5fa !important; }',
      '.text-indigo-200 { color: #c7d2fe !important; }',
      '.text-indigo-300 { color: #a5b4fc !important; }',
      '.text-purple-200 { color: #e9d5ff !important; }',
      '.text-purple-300 { color: #d8b4fe !important; }',
      '.text-purple-400 { color: #c084fc !important; }',
      '.bg-blue-600 { background-color: #2563eb !important; color: #ffffff !important; }',
      '.bg-blue-700 { background-color: #1d4ed8 !important; color: #ffffff !important; }',
      '.bg-indigo-700 { background-color: #4338ca !important; color: #ffffff !important; }',
      '.bg-indigo-800 { background-color: #3730a3 !important; color: #ffffff !important; }',
      '.bg-indigo-900 { background-color: #312e81 !important; color: #ffffff !important; }',
      '.bg-indigo-950 { background-color: #1e1b4b !important; color: #ffffff !important; }',

      /* 2. Slate & Dark Background Shades */
      '.bg-slate-50 { background-color: #f8fafc !important; }',
      '.bg-slate-100 { background-color: #f1f5f9 !important; }',
      '.bg-slate-200 { background-color: #e2e8f0 !important; }',
      '.bg-slate-700 { background-color: #334155 !important; }',
      '.bg-slate-800 { background-color: #1e293b !important; }',
      '.bg-slate-900 { background-color: #0f172a !important; }',
      '.bg-slate-950 { background-color: #020617 !important; }',
      '.bg-brand-dark { background-color: #0b192c !important; }',
      '.bg-brand-darker { background-color: #071322 !important; color: #ffffff !important; }',
      '[class*="bg-[#0B192C]"], .bg-\\[\\#0B192C\\] { background-color: #0b192c !important; color: #ffffff !important; }',
      '[class*="bg-[#071322]"], .bg-\\[\\#071322\\] { background-color: #071322 !important; color: #ffffff !important; }',
      '[class*="bg-[#282828]"], .bg-\\[\\#282828\\] { background-color: #282828 !important; }',
      '[class*="bg-[#181818]"], .bg-\\[\\#181818\\] { background-color: #181818 !important; }',
      '[class*="border-[#383838]"] { border-color: #383838 !important; }',
      '[class*="border-[#333333]"] { border-color: #333333 !important; }',
      '[class*="bg-black/65"] { background-color: rgba(0, 0, 0, 0.75) !important; color: #ffffff !important; }',

      /* 3. Primary Button & Gradient Consistency */
      '.btn-primary, .bg-brand-gradient {',
      '  background: #1a5cf6 !important;',
      '  background: linear-gradient(135deg, #1a5cf6 0%, #8b17a8 100%) !important;',
      '  background-color: #1a5cf6 !important;',
      '  color: #ffffff !important;',
      '}',
      '.btn-primary:hover, .bg-brand-gradient:hover {',
      '  background: #164ed1 !important;',
      '  background: linear-gradient(135deg, #164ed1 0%, #761490 100%) !important;',
      '  background-color: #164ed1 !important;',
      '  color: #ffffff !important;',
      '}',
      '.btn-primary:disabled, button:disabled.btn-primary {',
      '  background: #cbd5e1 !important;',
      '  color: #64748b !important;',
      '  border-color: #cbd5e1 !important;',
      '  cursor: not-allowed !important;',
      '  opacity: 0.75 !important;',
      '  box-shadow: none !important;',
      '}',

      /* 4. Video & Media Section Contrast */
      '#medical-videos-count-badge {',
      '  background-color: #282828 !important;',
      '  color: #cbd5e1 !important;',
      '  border: 1px solid #383838 !important;',
      '}',
      '#medical-videos-section, section:has(#medical-videos-playlist) {',
      '  background-color: #181818 !important;',
      '  color: #ffffff !important;',
      '}',
      '.video-theme-card, .video-theme-topbar, .video-theme-sidebar {',
      '  background-color: #181818 !important;',
      '  color: #ffffff !important;',
      '}',

      /* 5. Tool & Calculator Hero Header */
      'section[class*="border-b"]:has(.hub-tab-btn), section:has(.hub-tab-btn) {',
      '  background: #091e42 !important;',
      '  background: linear-gradient(135deg, #091e42 0%, #1e1b4b 60%, #1e293b 100%) !important;',
      '  background-color: #091e42 !important;',
      '  color: #ffffff !important;',
      '}',
      '.hub-tab-inactive {',
      '  background: rgba(255, 255, 255, 0.14) !important;',
      '  color: #ffffff !important;',
      '  border: 1px solid rgba(255, 255, 255, 0.25) !important;',
      '}',
      '.hub-tab-inactive:hover {',
      '  background: rgba(255, 255, 255, 0.25) !important;',
      '  color: #ffffff !important;',
      '}',
      '.hub-tab-active {',
      '  background: #ffffff !important;',
      '  color: #0f172a !important;',
      '  border: 1.5px solid #93c5fd !important;',
      '}',

      /* 6. About Page Hero & Cards */
      '.about-hero-wrap {',
      '  background: #023e8a !important;',
      '  background: linear-gradient(135deg, #023e8a 0%, #0077b6 50%, #0096c7 100%) !important;',
      '  background-color: #023e8a !important;',
      '  color: #ffffff !important;',
      '}',
      '.about-hero-title { color: #ffffff !important; }',
      '.about-hero-sub { color: #f0f9ff !important; }',
      '.about-hero-pill-card {',
      '  background: rgba(255, 255, 255, 0.18) !important;',
      '  border: 1px solid rgba(255, 255, 255, 0.3) !important;',
      '  color: #ffffff !important;',
      '}',
      '.about-hero-pill-card * { color: #ffffff !important; }',
      '.about-step-pill {',
      '  background-color: #0077b6 !important;',
      '  color: #ffffff !important;',
      '}',
      '.about-cta-title-text { color: #ffffff !important; }',
      '.about-cta-desc-text { color: #f0f9ff !important; }',
      '.about-cta-card, .about-cta-wrap {',
      '  background-color: #071322 !important;',
      '  color: #ffffff !important;',
      '}',

      /* 7. Homepage Billboard Hero Banner Fallbacks */
      '#hero-banner-container, #gallery-billboard-container, #gallery-billboard2-container, #hero-billboard-wrap, .hero-billboard-section {',
      '  background-color: #071322 !important;',
      '}',
      '#hero-single-h1, .hero-main-title { color: #ffffff !important; }',
      '.hero-main-desc { color: rgba(255, 255, 255, 0.85) !important; }',
      '#hero-video-skip-btn {',
      '  background-color: rgba(0, 0, 0, 0.75) !important;',
      '  color: #ffffff !important;',
      '  border: 1px solid rgba(255, 255, 255, 0.3) !important;',
      '}',
      '.hero-pill-badge {',
      '  background: rgba(255, 255, 255, 0.12) !important;',
      '  color: #ffffff !important;',
      '  border: 1px solid rgba(255, 255, 255, 0.25) !important;',
      '}',

      /* 8. Table Headers */
      'th.bg-indigo-950, [class*="bg-indigo-950"], th.bg-blue-950, [class*="bg-blue-950"], th.bg-slate-900, th.bg-slate-950 {',
      '  background-color: #0f172a !important;',
      '  color: #ffffff !important;',
      '}',
      'table thead tr th { color: #ffffff; }',

      /* 9. Global Dark Background & Contrast Fallback for uncompiled Next.js utility classes & Footer */
      'footer, .bg-brand-darker, .bg-slate-900, .bg-slate-800, [class*="bg-\\[\\#0B192C\\]"], [class*="bg-[#0B192C]"], [class*="bg-\\[\\#071322\\]"], [class*="bg-[#071322]"], .medicare-dark-navy {',
      '  background-color: #071322 !important;',
      '  color: #ffffff !important;',
      '}',
      'footer a { color: #94a3b8 !important; }',
      'footer a:hover { color: #ffffff !important; }',
      'footer p, footer span { color: #94a3b8; }',
      'footer h3, footer h4, footer .text-white { color: #ffffff !important; }',
      '[class*="from-slate-900"] { background: linear-gradient(135deg, #071322 0%, #0F2342 55%, #1B2A4A 100%) !important; color: #ffffff !important; }',

      /* body fade-in: only apply to pages with explicit FOUC guard class, NOT globally (opacity:0 blocks Safari autoplay) */
      '@keyframes bodyFadeIn { from { opacity:0; } to { opacity:1; } }',

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
      '.njap-brand-link { display: inline-flex !important; align-items: center !important; flex-shrink: 0 !important; }',
      '.njap-brand-link img, .njap-brand-link svg { height: 52px !important; max-height: 54px !important; width: auto !important; object-fit: contain !important; }',
      '@media (max-width: 640px) { .njap-brand-link img, .njap-brand-link svg { height: 40px !important; max-height: 42px !important; width: auto !important; } }',
      '@media (max-width: 375px) { .njap-brand-link img, .njap-brand-link svg { height: 34px !important; max-height: 36px !important; } }',

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

      /* Senior Mode Removal */
      '.senior-mode-btn, #senior-mode-btn, [id*="senior-mode-btn"], .mobile-senior-box, #senior-mode-toast { display: none !important; visibility: hidden !important; pointer-events: none !important; width: 0 !important; height: 0 !important; margin: 0 !important; padding: 0 !important; }',

      /* ========================================================
         DESKTOP VIEWPORT ONLY (>= 768px): Unaltered Standard UX
         ======================================================== */
      '@media (min-width: 768px) {',
      '  nav .hidden.md\\:flex, .desktop-nav-links { display: flex !important; align-items: center !important; gap: 26px !important; }',
      '  #sidebar-toggle-btn { display: none !important; }',
      '  #mobile-menu-btn { display: none !important; }',
      '  #mobile-menu-dropdown { display: none !important; }',
      '}',

      /* ========================================================
         MOBILE VIEWPORT ONLY (< 768px): Strict Removal & Layout
         ======================================================== */
      '@media (max-width: 767px) {',
      '  /* 1. Remove Senior Mode & stray language elements */',
      '  .senior-mode-btn, #senior-mode-btn, [id*="senior-mode"], .mobile-senior-box, #en-translate-btn {',
      '    display: none !important;',
      '    visibility: hidden !important;',
      '    pointer-events: none !important;',
      '    width: 0 !important; height: 0 !important;',
      '    margin: 0 !important; padding: 0 !important;',
      '  }',
      '',
      '  /* 2. Forum Mobile Header: Guarantee BOTH Left and Right menus are visible & never clipped */',
      '  #sidebar-toggle-btn { display: inline-flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; width: 32px !important; height: 32px !important; }',
      '  #mobile-menu-btn, button[aria-label="Menu"] { display: inline-flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; }',
      '  nav a.forum-kakao-btn, body.forum-page nav a[href*="pf.kakao.com"], #forum-sidebar ~ * nav a[href*="pf.kakao.com"] { display: none !important; }',
      '  body.forum-page nav .njap-brand-link, #forum-sidebar ~ * nav .njap-brand-link { flex-shrink: 0 !important; }',
      '  body.forum-page nav #auth-box button span, #forum-sidebar ~ * nav #auth-box button span { display: none !important; }',
      '}',
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
          // If clicked inside a billboard that has a paused video, play the video instead of navigating away!
          var bb = el.closest('#gallery-billboard-container, #gallery-billboard2-container, #gallery-billboard-section, #gallery-billboard2-section');
          if (bb) {
            var v = bb.querySelector('video');
            if (v && v.paused) {
              e.preventDefault();
              e.stopImmediatePropagation();
              v.defaultMuted = true;
              v.muted = true;
              v.volume = 0;
              v.playsInline = true;
              var p = v.play();
              if (p && p.catch) p.catch(function() {});
              var allV = document.querySelectorAll('#gallery-billboard-container video, #gallery-billboard2-container video, #billboard-active-video, #billboard2-active-video');
              allV.forEach(function(ov) {
                if (ov && ov.paused) {
                  ov.defaultMuted = true;
                  ov.muted = true;
                  ov.volume = 0;
                  ov.playsInline = true;
                  var op = ov.play();
                  if (op && op.catch) op.catch(function() {});
                }
              });
              return;
            }
          }

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
  // 3. MOBILE MENU — matching desktop list with no sub-menus
  // ─────────────────────────────────────────────────────────────
  function buildAccordionMenuHTML(curPath) {
    var base = '';
    var cleanPath = curPath.replace(/^\/(en|ko)/, '') || '/';
    var isHome = cleanPath === '/' || cleanPath === '';
    var isBlog = cleanPath.indexOf('/blog') === 0;
    var isForum = cleanPath.indexOf('/forum') === 0;
    var isMedicare = cleanPath.indexOf('/medicare') === 0 || cleanPath.indexOf('/resource-center') === 0;
    var isAbout = cleanPath.indexOf('/about') === 0;
    var isEngine = cleanPath.indexOf('/engine') === 0;

    return [
      '<!-- 1. Home -->',
      '<a href="' + base + '/" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 ' + (isHome ? 'font-bold text-brand-blue bg-blue-50/70' : 'font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50') + '">',
      '  <div class="flex items-center gap-3">',
      '    <svg class="w-5 h-5 ' + (isHome ? 'text-brand-blue' : 'text-slate-400') + ' shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
      '    <span class="text-[15px]">홈</span>',
      '  </div>',
      '  <svg class="w-4 h-4 ' + (isHome ? 'text-brand-blue' : 'text-slate-300') + '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>',
      '</a>',
      '',
      '<!-- 2. News -->',
      '<a href="' + base + '/blog" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 ' + (isBlog ? 'font-bold text-brand-blue bg-blue-50/70' : 'font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50') + '">',
      '  <div class="flex items-center gap-3">',
      '    <svg class="w-5 h-5 ' + (isBlog ? 'text-brand-blue' : 'text-slate-400') + ' shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>',
      '    <span class="text-[15px]">뉴스</span>',
      '  </div>',
      '  <svg class="w-4 h-4 ' + (isBlog ? 'text-brand-blue' : 'text-slate-300') + '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>',
      '</a>',
      '',
      '<!-- 2.5 Community Forum -->',
      '<a href="' + base + '/forum" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 ' + (isForum ? 'font-bold text-brand-blue bg-blue-50/70' : 'font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50') + '">',
      '  <div class="flex items-center gap-3">',
      '    <svg class="w-5 h-5 ' + (isForum ? 'text-brand-blue' : 'text-blue-600') + ' shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>',
      '    <span class="text-[15px]">커뮤니티 포럼</span>',
      '  </div>',
      '  <svg class="w-4 h-4 ' + (isForum ? 'text-brand-blue' : 'text-slate-300') + '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>',
      '</a>',
      '',
      '<!-- 4. 의료&커뮤니티 정보센터 -->',
      '<a href="' + base + '/resource-center" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 ' + (isMedicare ? 'font-bold text-brand-blue bg-blue-50/70' : 'font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50') + '">',
      '  <div class="flex items-center gap-3">',
      '    <svg class="w-5 h-5 ' + (isMedicare ? 'text-brand-blue' : 'text-slate-400') + ' shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
      '    <div class="flex flex-col text-left leading-tight">',
      '      <span class="text-[12px] ' + (isMedicare ? 'text-blue-600' : 'text-slate-500') + ' font-medium">의료&amp;커뮤니티</span>',
      '      <span class="text-[15px] ' + (isMedicare ? 'text-brand-blue font-bold' : 'text-slate-800 font-bold') + '">정보센터</span>',
      '    </div>',
      '  </div>',
      '  <svg class="w-4 h-4 ' + (isMedicare ? 'text-brand-blue' : 'text-slate-300') + '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>',
      '</a>',
      '',
      '<!-- 6. About -->',
      '<a href="' + base + '/about" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 ' + (isAbout ? 'font-bold text-brand-blue bg-blue-50/70' : 'font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50') + '">',
      '  <div class="flex items-center gap-3">',
      '    <svg class="w-5 h-5 ' + (isAbout ? 'text-brand-blue' : 'text-slate-400') + ' shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      '    <span class="text-[15px]">소개</span>',
      '  </div>',
      '  <svg class="w-4 h-4 ' + (isAbout ? 'text-brand-blue' : 'text-slate-300') + '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>',
      '</a>',
      '',
      '<!-- 7. Engine (Marketing Client) -->',
      '<a href="' + base + '/engine" target="_self" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 ' + (isEngine ? 'font-bold text-brand-blue bg-blue-50/70' : 'font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50') + '">',
      '  <div class="flex items-center gap-3">',
      '    <svg class="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
      '    <div class="flex flex-col text-left">',
      '      <span class="text-[15px] font-bold text-slate-800">Engine</span>',
      '      <span class="text-[10px] font-semibold text-slate-400 leading-none">Marketing Client</span>',
      '    </div>',
      '  </div>',
      '  <svg class="w-4 h-4 ' + (isEngine ? 'text-brand-blue' : 'text-slate-300') + '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>',
      '</a>',
      '',
      '<!-- Bottom CTA: KakaoTalk Consultation -->',
      '<div class="pt-2 pb-1">',
      '  <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3.5 bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#FBC02D] text-[#191919] rounded-xl font-bold text-sm shadow-xs transition-all cursor-pointer">',
      '    <div class="flex items-center gap-2.5">',
      '      <img src="/kakaotalk-icon.png" alt="KakaoTalk" class="w-6 h-6 rounded-md shrink-0 object-contain shadow-xs" />',
      '      <div class="flex flex-col text-left">',
      '        <span class="text-sm font-bold leading-tight">카카오톡 1:1 상담 바로가기</span>',
      '        <span class="text-[11px] font-medium text-black/70">의료 복지 및 건강 상담 실시간 문의</span>',
      '      </div>',
      '    </div>',
      '    <svg class="w-4 h-4 text-black/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>',
      '  </a>',
      '</div>'
    ].join('\n');
  }

  function initAccordionToggles(dropdown) {
    // No sub-menus, each item is a direct navigation link
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

    // Always enforce canonical mobile menu: purge any obsolete links (senior-care, tool, patient-helper, sub-accordions) and guarantee all 7 canonical items exist
    var hasObsolete = dropdown.querySelector('a[href*="senior-care"], a[href*="/tool"], .mobile-accordion-group');
    var isMissingEngine = !dropdown.querySelector('a[href*="/engine"]');
    var isMissingForum = !dropdown.querySelector('a[href*="/forum"]');
    if (hasObsolete || isMissingEngine || isMissingForum || dropdown.children.length < 6) {
      dropdown.innerHTML = buildAccordionMenuHTML(curPath);
    }

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
  // 5. VIDEO AUTOPLAY FIX (Reinforces seamless playback on Safari & Mobile)
  // ─────────────────────────────────────────────────────────────
  function fixVideoAutoplay() {
    function prepareVideoElement(v) {
      if (!v) return;
      v.defaultMuted = true;
      v.muted = true;
      v.volume = 0;
      v.playsInline = true;
      if (!v.hasAttribute('muted')) v.setAttribute('muted', '');
      if (!v.hasAttribute('playsinline')) v.setAttribute('playsinline', '');
      if (!v.hasAttribute('webkit-playsinline')) v.setAttribute('webkit-playsinline', '');
      if (!v.hasAttribute('autoplay')) v.setAttribute('autoplay', '');
    }

    function resumeAllBillboards() {
      var vids = document.querySelectorAll('#gallery-billboard-container video, #gallery-billboard2-container video, #billboard-active-video, #billboard2-active-video, #senior-billboard-video, #senior-billboard-1 video');
      vids.forEach(function(v) {
        if (!v || !v.paused) return;
        prepareVideoElement(v);
        var p = v.play();
        if (p && p.catch) p.catch(function() {});
      });
    }

    function wireVideoLifecycle(v) {
      if (!v || v._bbAutoplayWired) return;
      v._bbAutoplayWired = true;
      prepareVideoElement(v);
      ['loadedmetadata', 'canplay'].forEach(function(evt) {
        v.addEventListener(evt, function() {
          if (v.paused) {
            var p = v.play();
            if (p && p.catch) p.catch(function() {});
          }
        }, { once: true });
      });
    }

    var vids = document.querySelectorAll('#gallery-billboard-container video, #gallery-billboard2-container video, #billboard-active-video, #billboard2-active-video, #senior-billboard-video, #senior-billboard-1 video');
    vids.forEach(wireVideoLifecycle);

    // Viewport Visibility Trigger (Crucial for Safari power-saver & offscreen videos)
    if (window.IntersectionObserver) {
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var vid = el.tagName === 'VIDEO' ? el : el.querySelector('video');
            if (vid) {
              prepareVideoElement(vid);
              if (vid.paused) {
                var p = vid.play();
                if (p && p.catch) p.catch(function() {});
              }
            }
          }
        });
      }, { threshold: [0, 0.1, 0.25] });

      ['gallery-billboard-section', 'gallery-billboard2-section', 'gallery-billboard-container', 'gallery-billboard2-container', 'senior-billboard-1'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) io.observe(el);
      });
    }

    if (window.MutationObserver) {
      var mo = new MutationObserver(function() {
        var nv = document.querySelectorAll('#gallery-billboard-container video, #gallery-billboard2-container video, #billboard-active-video, #billboard2-active-video, #senior-billboard-video, #senior-billboard-1 video');
        nv.forEach(wireVideoLifecycle);
      });
      mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
    }

    // Capture-phase interaction listeners guarantee instant play on ANY user gesture (touch, click, key, scroll)
    ['touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown', 'click', 'scroll'].forEach(function(evt) {
      window.addEventListener(evt, resumeAllBillboards, { capture: true, passive: true });
    });
    window.addEventListener('focus', resumeAllBillboards, { passive: true });
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) resumeAllBillboards();
    });

    resumeAllBillboards();
    setTimeout(resumeAllBillboards, 100);
    setTimeout(resumeAllBillboards, 500);
  }

  // ─────────────────────────────────────────────────────────────
  // 6. SECTION SLIDE-IN ANIMATION
  // ─────────────────────────────────────────────────────────────
  function fixSlideIn() {
    if (!window.IntersectionObserver) return;
    var raw = document.querySelectorAll('main section:not(#gallery-billboard-section):not([id*="billboard"]):not(.billboard-fullwidth), main > article, .fx-slide-target');
    if (!raw.length) return;

    var sections = [];
    for (var k = 0; k < raw.length; k++) {
      var node = raw[k];
      if (node.querySelector('#cms-blog-posts-grid') || node.id === 'cms-blog-main-section' || node.id === 'cms-blog-posts-grid' || node.closest('#cms-blog-posts-grid') || node.classList.contains('blog-post-card-item') || node.closest('.blog-post-card-item') || node.closest('.rc-tab-view') || node.closest('#rc-main-content') || node.id === 'rc-main-content') {
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
  // 12. PERMANENT CANONICAL NAV GUARDIAN
  //     Enforces canonical 6 items:
  //     홈 (/), 뉴스 (/blog), 커뮤니티 포럼 (/forum),
  //     의료정보센터 (/resource-center), 소개 (/about), Engine (/engine)
  //     Removes any obsolete links (시니어 케어, 환자도우미) and converts
  //     메디케어 & ACA -> 의료정보센터.
  // ─────────────────────────────────────────────────────────────
  function ensureSeniorCareInNav() {
    var nav = document.querySelector('nav');
    if (!nav) return;

    var curPath = (window.location.pathname.replace(/\/$/, '') || '/').toLowerCase();

    // 1. Desktop Nav container
    var desktopDiv = null;
    var allDivs = nav.querySelectorAll('div');
    for (var i = 0; i < allDivs.length; i++) {
      var div = allDivs[i];
      if (div.classList.contains('h-16') || div.querySelector('#mobile-menu-btn') || div.querySelector('.njap-brand-link')) {
        div.classList.remove('desktop-nav-links');
        continue;
      }
      var homeA = div.querySelector('a[href="/"], a[href="/ko"], a[href="/ko/"]');
      var blogA = div.querySelector('a[href*="blog"]');
      if (homeA && blogA && (div.classList.contains('md:flex') || div.className.indexOf('items-center') !== -1) && !div.classList.contains('md:hidden') && div.id !== 'mobile-menu-dropdown') {
        desktopDiv = div;
        break;
      }
    }

    if (desktopDiv) {
      desktopDiv.classList.add('desktop-nav-links');
      desktopDiv.style.gap = '26px';

      // Remove obsolete items
      var obsoleteLinks = desktopDiv.querySelectorAll('a[href*="/tool"], a[href*="senior-care"]');
      obsoleteLinks.forEach(function(el) { el.remove(); });
      Array.from(desktopDiv.querySelectorAll('a')).forEach(function(a) {
        var t = (a.textContent || '').trim();
        if (t === '시니어 케어' || t === '환자도우미') a.remove();
      });

      // Convert Medicare & ACA to 의료&커뮤니티 정보센터 (/resource-center)
      var medLinks = desktopDiv.querySelectorAll('a[href*="/medicare"]');
      medLinks.forEach(function(a) {
        a.setAttribute('href', '/resource-center');
        a.className = 'nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue flex flex-col items-center justify-center leading-tight text-center';
        a.innerHTML = '<span class="text-[12px] leading-tight font-semibold">의료&amp;커뮤니티</span><span class="text-[14px] leading-tight font-bold">정보센터</span>';
      });

      // Ensure /resource-center exists
      var rcLink = desktopDiv.querySelector('a[href*="/resource-center"]');
      if (!rcLink) {
        var forumLink = desktopDiv.querySelector('a[href*="/forum"]');
        var newRc = document.createElement('a');
        newRc.className = 'nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue flex flex-col items-center justify-center leading-tight text-center';
        newRc.href = '/resource-center';
        newRc.innerHTML = '<span class="text-[12px] leading-tight font-semibold">의료&amp;커뮤니티</span><span class="text-[14px] leading-tight font-bold">정보센터</span>';
        if (forumLink && forumLink.nextSibling) {
          desktopDiv.insertBefore(newRc, forumLink.nextSibling);
        } else {
          var aboutLink = desktopDiv.querySelector('a[href*="/about"]');
          if (aboutLink) desktopDiv.insertBefore(newRc, aboutLink);
          else desktopDiv.appendChild(newRc);
        }
      } else {
        if (!rcLink.querySelector('span') || rcLink.textContent.indexOf('의료&커뮤니티') === -1) {
          rcLink.innerHTML = '<span class="text-[12px] leading-tight font-semibold">의료&amp;커뮤니티</span><span class="text-[14px] leading-tight font-bold">정보센터</span>';
        }
      }

      // Active styling & text
      var isAbout = curPath === '/about';
      var isRc = curPath === '/resource-center' || curPath === '/medicare';
      var aAbout = desktopDiv.querySelector('a[href*="/about"]');
      var aRc = desktopDiv.querySelector('a[href*="/resource-center"]');

      if (aAbout) {
        aAbout.textContent = '의료 접근센터';
        if (isAbout) {
          aAbout.className = 'nav-link pb-0.5 font-bold text-brand-blue';
        } else {
          aAbout.className = 'nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue';
        }
      }
      if (aRc) {
        if (isRc) {
          aRc.className = 'nav-link pb-0.5 font-bold text-brand-blue flex flex-col items-center justify-center leading-tight text-center';
        } else {
          aRc.className = 'nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue flex flex-col items-center justify-center leading-tight text-center';
        }
      }
    }

    // 2. Mobile Nav Dropdown
    var mobileDropdown = document.getElementById('mobile-menu-dropdown');
    if (mobileDropdown) {
      // Remove obsolete items
      var mObs = mobileDropdown.querySelectorAll('a[href*="/tool"], a[href*="senior-care"]');
      mObs.forEach(function(el) { el.remove(); });
      Array.from(mobileDropdown.querySelectorAll('a')).forEach(function(a) {
        var t = (a.textContent || '').trim();
        if (t.indexOf('시니어 케어') !== -1 || t.indexOf('환자도우미') !== -1) a.remove();
      });

      // Convert Medicare link to Resource Center
      var mMed = mobileDropdown.querySelectorAll('a[href*="/medicare"], a[href*="/resource-center"]');
      mMed.forEach(function(a) {
        a.setAttribute('href', '/resource-center');
        var textWrap = a.querySelector('.flex-col');
        if (!textWrap) {
          var sp = a.querySelector('span');
          if (sp && (sp.textContent.indexOf('메디케어') !== -1 || sp.textContent.indexOf('의료정보센터') !== -1 || sp.textContent.indexOf('정보센터') !== -1)) {
            sp.outerHTML = '<div class="flex flex-col text-left leading-tight"><span class="text-[12px] text-slate-500 font-medium">의료&amp;커뮤니티</span><span class="text-[15px] font-bold text-slate-800">정보센터</span></div>';
          }
        }
      });

      // Update About link in mobile dropdown to 의료 접근센터
      var mAbout = mobileDropdown.querySelectorAll('a[href*="/about"]');
      mAbout.forEach(function(a) {
        var spans = a.querySelectorAll('span');
        spans.forEach(function(sp) {
          if (sp.textContent.trim() === '소개') {
            sp.textContent = '의료 접근센터';
          }
        });
      });
    }

    // 3. Footer cleanup
    var footer = document.querySelector('footer');
    if (footer) {
      var footerObs = footer.querySelectorAll('a[href*="/tool"], a[href*="senior-care"]');
      footerObs.forEach(function(el) {
        var li = el.closest('li');
        if (li) li.remove();
        else el.remove();
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 13. SENIOR MODE CLEANUP GUARDIAN
  // ─────────────────────────────────────────────────────────────
  function cleanupSeniorMode() {
    try {
      sessionStorage.removeItem('njap_senior_mode');
      sessionStorage.removeItem('njap_senior_user_chosen');
      localStorage.removeItem('njap_senior_mode');
      localStorage.removeItem('njap_senior_user_chosen');
    } catch(e) {}
    document.documentElement.classList.remove('senior-mode-1', 'senior-mode-2');

    // Eradicate any stray senior mode buttons, wrappers, or toasts
    var btns = document.querySelectorAll('.senior-mode-btn, #senior-mode-btn, [id*="senior-mode-btn"], .mobile-senior-box, [data-senior-bound]');
    btns.forEach(function(b) { b.remove(); });

    // Also remove by text content if any button slipped through
    Array.from(document.querySelectorAll('button')).forEach(function(b) {
      if ((b.textContent || '').indexOf('시니어모드') !== -1) {
        b.remove();
      }
    });

    var toast = document.getElementById('senior-mode-toast');
    if (toast) toast.remove();
    var style = document.getElementById('njap-senior-mode-base-css');
    if (style) style.remove();

    // Eradicate any stray en translation buttons in header
    var strayEn = document.querySelectorAll('#en-translate-btn, nav button.notranslate');
    strayEn.forEach(function (b) {
      if ((b.textContent || '').indexOf('English') !== -1) b.remove();
    });
  }

  window.cycleSeniorMode = function() {};
  window.applySeniorMode = function() {};
  window.getSeniorModeStep = function() { return 0; };

  var UNIFIED_LOGO_SVG = '<svg class="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform group-hover:scale-102" viewBox="0 0 320 60" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NJ Access Portal · 뉴저지 한인 의료접근포털" style="overflow: visible;">' +
    '<title>NJ Access Portal · 뉴저지 한인 의료접근포털</title>' +
    '<g transform="translate(4, 2) scale(0.56)" stroke-linecap="round" stroke-linejoin="round">' +
      '<g class="njap-nav-door" stroke="#1E3A8A">' +
        '<line x1="20" y1="12" x2="20" y2="88" stroke-width="3.5" />' +
        '<rect x="25" y="12" width="55" height="76" rx="2" stroke-width="4" fill="none" />' +
        '<polyline points="25,16 52,25 52,36" stroke-width="3.5" />' +
        '<text x="52.5" y="81" font-family="\'Times New Roman\', serif" font-size="13.5" font-weight="900" letter-spacing="1.5" fill="#1E3A8A" stroke="none" text-anchor="middle">NJAP</text>' +
      '</g>' +
      '<path class="njap-nav-keyhole" d="M 43,45 A 7,7 0 1,1 53,45 L 56,64 L 40,64 Z" stroke="#DC2626" stroke-width="3.5" fill="none" />' +
      '<g class="njap-nav-key">' +
        '<circle cx="74" cy="45" r="6.5" stroke="#DC2626" stroke-width="3.5" fill="none" />' +
        '<line x1="47" y1="45" x2="67.5" y2="45" stroke="#DC2626" stroke-width="3.5" />' +
        '<line x1="49" y1="45" x2="49" y2="49" stroke="#DC2626" stroke-width="3.5" />' +
        '<line x1="53" y1="45" x2="53" y2="48" stroke="#DC2626" stroke-width="3" />' +
      '</g>' +
    '</g>' +
    '<g class="njap-nav-text-main">' +
      '<text x="64" y="27" font-family="Pretendard, -apple-system, system-ui, sans-serif" font-size="18" font-weight="900" fill="#0B192C" letter-spacing="-0.5">NJ Access Portal</text>' +
    '</g>' +
    '<g class="njap-nav-text-sub">' +
      '<text x="64" y="44" font-family="Pretendard, -apple-system, system-ui, sans-serif" font-size="10.5" font-weight="600" fill="#64748B" letter-spacing="0.2">뉴저지 한인 의료접근포털</text>' +
    '</g>' +
  '</svg>';

  var UNIFIED_LOGO_CSS = [
    '.njap-brand-link { display: inline-flex !important; align-items: center !important; flex-shrink: 0 !important; }',
    '.njap-brand-link img, .njap-brand-link svg { height: 52px !important; max-height: 54px !important; width: auto !important; object-fit: contain !important; }',
    '@media (max-width: 640px) { .njap-brand-link img, .njap-brand-link svg { height: 40px !important; max-height: 42px !important; width: auto !important; } }',
    '@media (max-width: 375px) { .njap-brand-link img, .njap-brand-link svg { height: 34px !important; max-height: 36px !important; } }',
    '@keyframes njapNavKeySlide { 0% { opacity: 0; transform: translate(670px, 0); } 15% { opacity: 1; } 75% { transform: translate(0, 0); } 86% { transform: translate(-3.5px, 0); } 100% { opacity: 1; transform: translate(0, 0); } }',
    '@keyframes njapNavKeyholePulse { 0%, 70% { stroke: #DC2626; filter: drop-shadow(0 0 0 transparent); } 82% { stroke: #EF4444; filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.85)); } 100% { stroke: #DC2626; filter: drop-shadow(0 0 0 transparent); } }',
    '@keyframes njapNavDoorAppear { 0% { opacity: 0; transform: scale(0.96); } 100% { opacity: 1; transform: scale(1); } }',
    '@keyframes njapNavTextMain { 0% { opacity: 0; transform: translate(45px, 0); } 100% { opacity: 1; transform: translate(0, 0); } }',
    '@keyframes njapNavTextSub { 0% { opacity: 0; transform: translate(35px, 0); } 100% { opacity: 1; transform: translate(0, 0); } }',
    '.njap-nav-door { transform-origin: 40px 45px; animation: njapNavDoorAppear 0.75s cubic-bezier(0.16, 1, 0.3, 1) both; }',
    '.njap-nav-key { animation: njapNavKeySlide 2.18s cubic-bezier(0.22, 1, 0.36, 1) 0.22s both; }',
    '.njap-nav-keyhole { animation: njapNavKeyholePulse 2.4s ease-out 0.22s both; }',
    '.njap-nav-text-main { animation: njapNavTextMain 1.0s cubic-bezier(0.16, 1, 0.3, 1) 2.18s both; }',
    '.njap-nav-text-sub { animation: njapNavTextSub 1.0s cubic-bezier(0.16, 1, 0.3, 1) 2.48s both; }',
    '@media (prefers-reduced-motion: reduce) { .njap-nav-door, .njap-nav-key, .njap-nav-keyhole, .njap-nav-text-main, .njap-nav-text-sub { animation: none !important; opacity: 1 !important; transform: none !important; } }'
  ].join('\n');

  function ensureUnifiedLogo() {
    try {
      // 0. Ensure animation styles exist in <head>
      if (!document.getElementById('njap-logo-anim-styles')) {
        var styleEl = document.createElement('style');
        styleEl.id = 'njap-logo-anim-styles';
        styleEl.textContent = UNIFIED_LOGO_CSS;
        document.head.appendChild(styleEl);
      }

      // 1. Navigation logo
      var nav = document.querySelector('nav');
      if (nav) {
        var brandLinks = nav.querySelectorAll('a.njap-brand-link, a[href="/"]');
        for (var i = 0; i < brandLinks.length; i++) {
          var link = brandLinks[i];
          var text = (link.textContent || '').trim();
          if (text === '홈' || link.classList.contains('nav-link')) continue;
          if (!link.classList.contains('njap-brand-link')) link.classList.add('njap-brand-link');
          link.classList.add('flex-shrink-0');
          // If already contains animated SVG with key and door, verify it has correct classes
          var key = link.querySelector('.njap-nav-key');
          var door = link.querySelector('.njap-nav-door');
          if (key && door) continue;
          link.innerHTML = UNIFIED_LOGO_SVG;
        }
      }

      // 2. Footer logo
      var footers = document.querySelectorAll('footer');
      for (var f = 0; f < footers.length; f++) {
        var fLinks = footers[f].querySelectorAll('a[href="/"]');
        for (var j = 0; j < fLinks.length; j++) {
          var fLink = fLinks[j];
          var fText = (fLink.textContent || '').trim();
          if (fText === '홈' || fLink.classList.contains('nav-link')) continue;
          var fImg = fLink.querySelector('img');
          if (fImg && (!fImg.src || fImg.src.indexOf('/logo-white.png') === -1)) {
            fImg.src = '/logo-white.png';
            fImg.alt = 'NJ Access Portal · 뉴저지 한인 의료접근포털';
            fImg.className = 'h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105';
            fImg.style.width = 'auto';
            fImg.style.height = '';
            fImg.style.filter = '';
            var fTextDiv = fLink.querySelector('div:not(:has(img))');
            if (fTextDiv) fTextDiv.style.display = 'none';
          }
        }
      }
    } catch(e) {}
  }

  var isNavUpdating = false;
  function setupNavObserver() {
    ensureUnifiedLogo();
    ensureSeniorCareInNav();
    cleanupSeniorMode();
    fixMobileMenu();
    var nav = document.querySelector('nav');
    if (nav && window.MutationObserver) {
      var obs = new MutationObserver(function() {
        if (isNavUpdating) return;
        isNavUpdating = true;
        try {
          ensureUnifiedLogo();
          ensureSeniorCareInNav();
          cleanupSeniorMode();
          fixMobileMenu();
        } finally {
          setTimeout(function() { isNavUpdating = false; }, 150);
        }
      });
      obs.observe(nav, { childList: true });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────
  // Run navigation interception immediately so no clicks can escape
  fixAllNavigation();
  ensureUnifiedLogo();
  ensureSeniorCareInNav();
  cleanupSeniorMode();
  window.addEventListener('pageshow', function() {
    ensureUnifiedLogo();
    ensureSeniorCareInNav();
    cleanupSeniorMode();
  });
  window.addEventListener('popstate', function() {
    ensureUnifiedLogo();
    ensureSeniorCareInNav();
    cleanupSeniorMode();
  });

  function init() {
    revealBody();
    injectCSS();
    fixAllNavigation();
    ensureUnifiedLogo();
    setupNavObserver();
    cleanupSeniorMode();
    fixMobileMenu();
    fixBillboardHover();
    fixVideoAutoplay();
    fixToolLoader();
    // Kakao injections — run after a short delay to allow CMS-rendered navs to settle
    setTimeout(function() {
      ensureUnifiedLogo();
      injectKakaoNavBtn();
      injectKakaoAboutBlock();
      ensureSeniorCareInNav();
      cleanupSeniorMode();
    }, 150);
    setTimeout(fixSlideIn, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


// Auto-purge any senior care links
(function purgeSeniorCareLinks() {
  function purge() {
    document.querySelectorAll('a[href*="senior-care"]').forEach(function(el) {
      var li = el.closest('li');
      if (li) li.remove();
      else el.remove();
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', purge);
  } else {
    purge();
  }
  setTimeout(purge, 500);
  setTimeout(purge, 1500);
})();
