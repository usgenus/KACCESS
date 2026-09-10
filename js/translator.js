/**
 * NJAP Instant Translator — js/translator.js (v2.2.0)
 * High-speed instant English/Korean page translation via Google Translate engine.
 * - Button labels: strictly EN and KR (with notranslate & translate="no").
 * - Google Translate top banner & all popups permanently killed and removed.
 * - Body top locked to 0px so marquee banner is never pushed down.
 * - Persisted language across all pages.
 */

(function () {
  'use strict';

  var COOKIE_NAME = 'googtrans';
  var STORAGE_KEY = 'njap_lang';
  var isEnglish = false;
  var isReady = false;

  // 1. Inject CSS to completely destroy all Google Translate banners, frames, tooltips
  function injectStyles() {
    if (document.getElementById('njap-gt-styles')) return;
    var style = document.createElement('style');
    style.id = 'njap-gt-styles';
    style.textContent = [
      '.goog-te-banner-frame, .goog-te-banner-frame.skiptranslate, iframe.goog-te-banner-frame, iframe.skiptranslate, iframe[id*="container"], div.skiptranslate:has(.goog-te-banner-frame), body > .skiptranslate, body > div[class*="skiptranslate"] {',
      '  display: none !important;',
      '  visibility: hidden !important;',
      '  opacity: 0 !important;',
      '  height: 0px !important;',
      '  max-height: 0px !important;',
      '  min-height: 0px !important;',
      '  width: 0px !important;',
      '  margin: 0 !important;',
      '  padding: 0 !important;',
      '  border: none !important;',
      '  pointer-events: none !important;',
      '  position: absolute !important;',
      '  left: -9999px !important;',
      '  top: -9999px !important;',
      '  clip: rect(0, 0, 0, 0) !important;',
      '}',
      'html, body {',
      '  top: 0px !important;',
      '  position: static !important;',
      '  margin-top: 0px !important;',
      '  padding-top: 0px !important;',
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

  // 2. Continuous Banner Killer Watchdog
  function killGoogleBanner() {
    if (document.body && document.body.style.top && document.body.style.top !== '0px') {
      document.body.style.setProperty('top', '0px', 'important');
    }
    if (document.documentElement && document.documentElement.style.top && document.documentElement.style.top !== '0px') {
      document.documentElement.style.setProperty('top', '0px', 'important');
    }

    var banners = document.querySelectorAll('.goog-te-banner-frame, iframe.skiptranslate, iframe[id*="container"], body > .skiptranslate');
    for (var i = 0; i < banners.length; i++) {
      var b = banners[i];
      b.style.setProperty('display', 'none', 'important');
      b.style.setProperty('visibility', 'hidden', 'important');
      b.style.setProperty('height', '0px', 'important');
      b.style.setProperty('width', '0px', 'important');
      b.style.setProperty('position', 'absolute', 'important');
      b.style.setProperty('top', '-9999px', 'important');
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

  // 4. Update Button UI: strictly EN and KR
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
        btn.title = 'Switch to Korean (KR)';
        btn.innerHTML = '<span class="notranslate" translate="no">🌐</span> <span class="notranslate en-btn-label" translate="no">KR</span>';
      } else {
        btn.style.background = 'transparent';
        btn.style.color = '#475569';
        btn.style.borderColor = '#cbd5e1';
        btn.title = 'Switch to English (EN)';
        btn.innerHTML = '<span class="notranslate" translate="no">🌐</span> <span class="notranslate en-btn-label" translate="no">EN</span>';
      }
    });
  }

  // Helper: Poll until .goog-te-combo is ready
  function waitForCombo(callback, maxAttempts) {
    maxAttempts = maxAttempts || 35; // 35 x 150ms = 5.25s
    var attempts = 0;
    var timer = setInterval(function () {
      var combo = document.querySelector('.goog-te-combo');
      if (combo) {
        clearInterval(timer);
        callback(combo);
      } else if (++attempts >= maxAttempts) {
        clearInterval(timer);
      }
    }, 150);
  }

  // 5. Toggle Translation Function
  window.toggleTranslation = function () {
    if (!isEnglish) {
      // Switch to English
      setTransCookie('/ko/en');
      localStorage.setItem(STORAGE_KEY, 'en');
      updateButtonUI(true);

      var combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = 'en';
        combo.dispatchEvent(new Event('change'));
      } else {
        waitForCombo(function (c) {
          c.value = 'en';
          c.dispatchEvent(new Event('change'));
        });
      }
    } else {
      // Revert to Korean
      clearTransCookie();
      setTransCookie('/ko/ko');
      localStorage.setItem(STORAGE_KEY, 'ko');
      updateButtonUI(false);

      var combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = 'ko';
        combo.dispatchEvent(new Event('change'));
        setTimeout(clearTransCookie, 600);
      } else {
        waitForCombo(function (c) {
          c.value = 'ko';
          c.dispatchEvent(new Event('change'));
          setTimeout(clearTransCookie, 600);
        });
      }
    }
    setTimeout(killGoogleBanner, 50);
    setTimeout(killGoogleBanner, 200);
    setTimeout(killGoogleBanner, 500);
    setTimeout(killGoogleBanner, 1000);
  };

  // 6. Initialize Google Translate Element
  window.googleTranslateElementInit = function () {
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement({
        pageLanguage: 'ko',
        includedLanguages: 'en,ko',
        autoDisplay: false,
        layout: (window.google.translate.TranslateElement.InlineLayout && window.google.translate.TranslateElement.InlineLayout.SIMPLE) ? window.google.translate.TranslateElement.InlineLayout.SIMPLE : 0
      }, 'google_translate_element');
      isReady = true;

      var saved = localStorage.getItem(STORAGE_KEY);
      var cookieVal = getCookie(COOKIE_NAME);
      if (saved === 'en' || (cookieVal && cookieVal.indexOf('/en') !== -1)) {
        updateButtonUI(true);
        waitForCombo(function (combo) {
          if (combo.value !== 'en') {
            combo.value = 'en';
            combo.dispatchEvent(new Event('change'));
          }
        });
      } else {
        updateButtonUI(false);
      }
    }
    killGoogleBanner();
  };

  // 7. DOM Ready Setup
  function init() {
    injectStyles();

    // Start watchdog
    setInterval(killGoogleBanner, 60);
    window.addEventListener('load', killGoogleBanner);
    if (window.MutationObserver) {
      var mo = new MutationObserver(killGoogleBanner);
      mo.observe(document.documentElement, { attributes: true, childList: true, subtree: true, attributeFilter: ['style', 'class'] });
    }

    // Create container for Google Translate if not exists
    if (!document.getElementById('google_translate_element')) {
      var div = document.createElement('div');
      div.id = 'google_translate_element';
      div.style.display = 'none';
      div.className = 'notranslate';
      div.setAttribute('translate', 'no');
      document.body.appendChild(div);
    }

    // Check initial state from cookie / storage
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
