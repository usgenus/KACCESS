/**
 * NJAP Instant Translator — js/translator.js
 * High-speed instant English/Korean page translation via Google Translate engine.
 * Completely hidden Google UI — clean native button integration.
 * State persisted across page navigation via cookies & localStorage.
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
    if (domain.indexOf('.') !== -1) {
      document.cookie = COOKIE_NAME + '=' + val + '; path=/; domain=.' + domain + '; max-age=' + maxAge;
    }
  }

  function clearTransCookie() {
    var domain = window.location.hostname;
    document.cookie = COOKIE_NAME + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = COOKIE_NAME + '=; path=/; domain=' + domain + '; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    if (domain.indexOf('.') !== -1) {
      document.cookie = COOKIE_NAME + '=; path=/; domain=.' + domain + '; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    }
  }

  // 3. Update Button UI
  function updateButtonUI(en) {
    isEnglish = !!en;
    var btns = document.querySelectorAll('#en-translate-btn');
    btns.forEach(function (btn) {
      if (isEnglish) {
        btn.style.background = '#2563eb';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#2563eb';
        btn.title = '한국어로 변경 (Switch to Korean)';
        btn.innerHTML = '<span style="font-size:12px">🇰🇷</span> <span class="en-btn-label">KO</span>';
      } else {
        btn.style.background = 'transparent';
        btn.style.color = '#475569';
        btn.style.borderColor = '#cbd5e1';
        btn.title = '영문 번역 (Translate to English)';
        btn.innerHTML = '<span style="font-size:12px">🌐</span> <span class="en-btn-label">EN</span>';
      }
    });
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
        // If Google Translate hasn't attached yet, reload with cookie set
        window.location.reload();
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
        // Clear cookie again after event
        setTimeout(clearTransCookie, 500);
      } else {
        window.location.reload();
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

      // Check if user was previously in English
      var saved = localStorage.getItem(STORAGE_KEY);
      var cookieVal = getCookie(COOKIE_NAME);
      if (saved === 'en' || (cookieVal && cookieVal.indexOf('/en') !== -1)) {
        updateButtonUI(true);
        setTimeout(function () {
          var combo = document.querySelector('.goog-te-combo');
          if (combo && combo.value !== 'en') {
            combo.value = 'en';
            combo.dispatchEvent(new Event('change'));
          }
        }, 300);
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
      document.body.appendChild(div);
    }

    // Check initial state from cookie / storage
    var saved = localStorage.getItem(STORAGE_KEY);
    var cookieVal = getCookie(COOKIE_NAME);
    if (saved === 'en' || (cookieVal && cookieVal.indexOf('/en') !== -1)) {
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
