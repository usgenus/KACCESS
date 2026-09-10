/**
 * NJAP Instant Translator — js/translator.js (v2.1.0)
 * High-speed instant English/Korean page translation via Google Translate engine.
 * - Button labels: strictly EN and KR (with notranslate & translate="no" to prevent Google from translating the button itself).
 * - Reliable polling to catch .goog-te-combo on every page regardless of load speed.
 * - Completely hidden Google Translate UI (banners, frames, tooltips, highlights).
 * - Persisted language across all pages.
 */

(function () {
  'use strict';

  var COOKIE_NAME = 'googtrans';
  var STORAGE_KEY = 'njap_lang';
  var isEnglish = false;
  var isReady = false;

  // 1. Inject CSS to hide all Google Translate banners, tooltips, and highlights
  function injectStyles() {
    if (document.getElementById('njap-gt-styles')) return;
    var style = document.createElement('style');
    style.id = 'njap-gt-styles';
    style.textContent = [
      '.goog-te-banner-frame.skiptranslate, .goog-te-banner-frame, iframe.goog-te-banner-frame { display: none !important; visibility: hidden !important; height: 0 !important; }',
      'body { top: 0px !important; position: static !important; }',
      '#goog-gt-tt, .goog-te-balloon-frame, .goog-tooltip, .goog-tooltip:hover { display: none !important; visibility: hidden !important; }',
      '.goog-text-highlight { background: transparent !important; background-color: transparent !important; box-shadow: none !important; border: none !important; }',
      '#google_translate_element { display: none !important; }',
      '.VIpgJd-ZVi9od-ORHb-OEVmcb, .VIpgJd-ZVi9od-aZ2wEe-wOHMyf, .VIpgJd-ZVi9od-aZ2wEe-wOHMyf-ti6hGc { display: none !important; }',
      '#en-translate-btn:hover { border-color: #2563eb !important; color: #2563eb !important; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  // 2. Cookie Helpers
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

  // 3. Update Button UI: strictly EN and KR with notranslate attributes
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
    maxAttempts = maxAttempts || 30; // 30 x 150ms = 4.5s
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

  // 4. Toggle Translation Function
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
  };

  // 5. Initialize Google Translate Element
  window.googleTranslateElementInit = function () {
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement({
        pageLanguage: 'ko',
        includedLanguages: 'en,ko',
        autoDisplay: false
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
  };

  // 6. DOM Ready Setup
  function init() {
    injectStyles();

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
