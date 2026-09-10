/**
 * NJAP Instant Translator — js/njap-translate.js (v3.0.0)
 * Completely fresh script name to bypass all stale browser caches.
 * Native EN / KR toggle powered by Google Translate engine.
 * Google top banner and tooltips completely hidden.
 */

(function () {
  'use strict';

  var COOKIE_NAME = 'googtrans';
  var STORAGE_KEY = 'njap_lang';
  var isEnglish = false;

  // 1. Inject CSS to hide all Google Translate banners, tooltips, frames
  function injectStyles() {
    if (document.getElementById('njap-trans-styles')) return;
    var style = document.createElement('style');
    style.id = 'njap-trans-styles';
    style.textContent = [
      '/* Hide Google Translate top banner, tooltips, and highlights */',
      '.goog-te-banner-frame, .goog-te-banner-frame.skiptranslate, iframe.goog-te-banner-frame, iframe.skiptranslate, iframe[id*="container"], div.skiptranslate:has(.goog-te-banner-frame), body > .skiptranslate, body > div[class*="skiptranslate"] {',
      '  display: none !important;',
      '  visibility: hidden !important;',
      '  opacity: 0 !important;',
      '  height: 0px !important;',
      '  max-height: 0px !important;',
      '  width: 0px !important;',
      '  position: absolute !important;',
      '  top: -9999px !important;',
      '  pointer-events: none !important;',
      '}',
      'html, body {',
      '  top: 0px !important;',
      '  position: static !important;',
      '}',
      '#goog-gt-tt, .goog-te-balloon-frame, .goog-tooltip, .goog-tooltip:hover, .goog-text-highlight, .VIpgJd-ZVi9od-ORHb-OEVmcb, .VIpgJd-ZVi9od-aZ2wEe-wOHMyf, .VIpgJd-ZVi9od-aZ2wEe-wOHMyf-ti6hGc {',
      '  display: none !important;',
      '  visibility: hidden !important;',
      '}',
      '#google_translate_element { display: none !important; }',
      '#en-translate-btn:hover { border-color: #2563eb !important; color: #2563eb !important; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  // 2. Banner Watchdog (Keeps body.style.top at 0px)
  function suppressBanner() {
    if (document.body && document.body.style.top && document.body.style.top !== '0px') {
      document.body.style.setProperty('top', '0px', 'important');
    }
    if (document.documentElement && document.documentElement.style.top && document.documentElement.style.top !== '0px') {
      document.documentElement.style.setProperty('top', '0px', 'important');
    }
    var banners = document.querySelectorAll('.goog-te-banner-frame, iframe.skiptranslate, iframe[id*="container"], body > .skiptranslate');
    for (var i = 0; i < banners.length; i++) {
      banners[i].style.setProperty('display', 'none', 'important');
      banners[i].style.setProperty('visibility', 'hidden', 'important');
      banners[i].style.setProperty('height', '0px', 'important');
    }
  }

  // 3. Cookie Helpers
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function setTransCookie(val) {
    var domain = window.location.hostname;
    var maxAge = 60 * 60 * 24 * 30; // 30 days
    document.cookie = COOKIE_NAME + '=' + val + '; path=/; max-age=' + maxAge;
    document.cookie = COOKIE_NAME + '=' + val + '; path=/; domain=' + domain + '; max-age=' + maxAge;
    var parts = domain.split('.');
    if (parts.length > 2) {
      var root = parts.slice(-2).join('.');
      document.cookie = COOKIE_NAME + '=' + val + '; path=/; domain=.' + root + '; max-age=' + maxAge;
      document.cookie = COOKIE_NAME + '=' + val + '; path=/; domain=' + root + '; max-age=' + maxAge;
    }
  }

  function clearTransCookie() {
    var domain = window.location.hostname;
    document.cookie = COOKIE_NAME + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = COOKIE_NAME + '=; path=/; domain=' + domain + '; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    var parts = domain.split('.');
    if (parts.length > 2) {
      var root = parts.slice(-2).join('.');
      document.cookie = COOKIE_NAME + '=; path=/; domain=.' + root + '; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      document.cookie = COOKIE_NAME + '=; path=/; domain=' + root + '; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    }
  }

  // 4. Update Button UI
  function updateButtonUI(en) {
    isEnglish = !!en;
    var btns = document.querySelectorAll('#en-translate-btn');
    btns.forEach(function (btn) {
      btn.classList.add('notranslate');
      btn.setAttribute('translate', 'no');
      if (isEnglish) {
        btn.style.background = '#2563eb';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#2563eb';
        btn.title = '한국어로 변경 (Switch to Korean)';
        btn.innerHTML = '<span class="notranslate" translate="no">🌐</span> <span class="notranslate en-btn-label" translate="no">KR</span>';
      } else {
        btn.style.background = 'transparent';
        btn.style.color = '#475569';
        btn.style.borderColor = '#cbd5e1';
        btn.title = '영문 번역 (Translate to English)';
        btn.innerHTML = '<span class="notranslate" translate="no">🌐</span> <span class="notranslate en-btn-label" translate="no">EN</span>';
      }
    });
  }

  // 5. Fire Translation on Google Combo
  function triggerGoogleTranslate(lang) {
    var combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event('change'));
      return true;
    }
    return false;
  }

  function waitForComboAndTrigger(lang) {
    if (triggerGoogleTranslate(lang)) return;
    var attempts = 0;
    var interval = setInterval(function () {
      if (triggerGoogleTranslate(lang) || ++attempts > 40) {
        clearInterval(interval);
      }
    }, 100);
  }

  // 6. Global Toggle Function
  window.toggleTranslation = function () {
    if (!isEnglish) {
      // Switch to English
      setTransCookie('/ko/en');
      localStorage.setItem(STORAGE_KEY, 'en');
      updateButtonUI(true);
      waitForComboAndTrigger('en');
    } else {
      // Revert to Korean
      clearTransCookie();
      setTransCookie('/ko/ko');
      localStorage.setItem(STORAGE_KEY, 'ko');
      updateButtonUI(false);
      waitForComboAndTrigger('ko');
      setTimeout(clearTransCookie, 800);
    }
    suppressBanner();
    setTimeout(suppressBanner, 200);
    setTimeout(suppressBanner, 600);
    setTimeout(suppressBanner, 1200);
  };

  // 7. Initialize Google Translate Element (Standard layout with combo)
  window.googleTranslateElementInit = function () {
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement({
        pageLanguage: 'ko',
        includedLanguages: 'en,ko',
        autoDisplay: false
      }, 'google_translate_element');

      var saved = localStorage.getItem(STORAGE_KEY);
      var cookieVal = getCookie(COOKIE_NAME);
      if (saved === 'en' || (cookieVal && cookieVal.indexOf('/en') !== -1)) {
        updateButtonUI(true);
        waitForComboAndTrigger('en');
      } else {
        updateButtonUI(false);
      }
    }
    suppressBanner();
  };

  // 8. DOM Initialization
  function init() {
    injectStyles();
    setInterval(suppressBanner, 80);

    // Create container for Google Translate
    if (!document.getElementById('google_translate_element')) {
      var div = document.createElement('div');
      div.id = 'google_translate_element';
      div.style.display = 'none';
      div.className = 'notranslate';
      div.setAttribute('translate', 'no');
      document.body.appendChild(div);
    }

    // Set initial state
    var saved = localStorage.getItem(STORAGE_KEY);
    var cookieVal = getCookie(COOKIE_NAME);
    if (saved === 'en' || (cookieVal && cookieVal.indexOf('/en') !== -1)) {
      setTransCookie('/ko/en');
      updateButtonUI(true);
    } else {
      updateButtonUI(false);
    }

    // Load Google Translate script
    if (!document.getElementById('njap-gt-script')) {
      var script = document.createElement('script');
      script.id = 'njap-gt-script';
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
