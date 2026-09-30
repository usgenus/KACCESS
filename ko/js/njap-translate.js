/**
 * NJAP Native Bilingual Router & Translator — js/njap-translate.js (v4.0.0)
 * Native EN / KR routing between /en/... and /ko/...
 * Eliminates Google Translate race conditions, cookie pollution, and text mixing.
 */

(function () {
  'use strict';

  var COOKIE_NAME = 'googtrans';
  var STORAGE_KEY = 'njap_lang';

  // 1. Thoroughly eradicate Google Translate cookies across all paths & domains
  function clearTransCookie() {
    var domain = window.location.hostname;
    var paths = ['/', '/ko', '/ko/', '/en', '/en/', '/forum', '/en/forum', '/ko/forum'];
    var domains = ['', domain, '.' + domain];
    var parts = domain.split('.');
    if (parts.length >= 2) {
      var rootDomain = parts.slice(-2).join('.');
      domains.push(rootDomain);
      domains.push('.' + rootDomain);
    }

    var cookieNames = [COOKIE_NAME, 'googtrans', 'googtrans_en', 'googtrans_ko'];
    var pastDate = 'Thu, 01 Jan 1970 00:00:00 UTC';

    cookieNames.forEach(function (cName) {
      paths.forEach(function (p) {
        domains.forEach(function (d) {
          var dAttr = d ? '; domain=' + d : '';
          document.cookie = cName + '=; expires=' + pastDate + '; path=' + p + dAttr;
          document.cookie = cName + '=; max-age=0; path=' + p + dAttr;
        });
      });
    });
  }

  // 2. Detect language based on URL path and HTML lang attribute
  function detectLanguage() {
    var path = window.location.pathname;
    if (path.indexOf('/en/') === 0 || path === '/en' || (document.documentElement && document.documentElement.lang === 'en')) {
      return 'en';
    }
    return 'ko';
  }

  // 3. Inject CSS to suppress any stray Google Translate elements and style the toggle button
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
      '#en-translate-btn:hover { border-color: #2563eb !important; color: #2563eb !important; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  // 4. Banner Watchdog (Keeps body.style.top at 0px if browser injected anything)
  function suppressBanner() {
    if (document.body && document.body.style.top && document.body.style.top !== '0px') {
      document.body.style.setProperty('top', '0px', 'important');
    }
    if (document.documentElement && document.documentElement.style.top && document.documentElement.style.top !== '0px') {
      document.documentElement.style.setProperty('top', '0px', 'important');
    }
  }

  // 5. Update Button UI
  function updateButtonUI(lang) {
    var isEn = lang === 'en';
    var btns = document.querySelectorAll('#en-translate-btn');
    btns.forEach(function (btn) {
      btn.classList.add('notranslate');
      btn.setAttribute('translate', 'no');
      if (isEn) {
        btn.style.background = '#2563eb';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#2563eb';
        btn.title = '한국어로 변경 (Switch to Korean)';
        btn.innerHTML = '<span class="notranslate" translate="no">🌐</span> <span class="notranslate en-btn-label" translate="no">KR</span>';
      } else {
        btn.style.background = 'transparent';
        btn.style.color = '#475569';
        btn.style.borderColor = '#cbd5e1';
        btn.title = '영문 버전으로 이동 (Switch to English)';
        btn.innerHTML = '<span class="notranslate" translate="no">🌐</span> <span class="notranslate en-btn-label" translate="no">EN</span>';
      }
    });
  }

  // 6. Global Toggle Function: URL-based language router
  window.toggleTranslation = function () {
    clearTransCookie();
    var path = window.location.pathname;
    var search = window.location.search || '';
    var hash = window.location.hash || '';

    var currentLang = detectLanguage();
    var newPath = '/';

    if (currentLang === 'en') {
      // Currently English -> switch to Korean (/ko/...)
      localStorage.setItem(STORAGE_KEY, 'ko');
      if (path.indexOf('/en/') === 0) {
        var sub = path.substring(4);
        if (sub === '' || sub === 'index.php' || sub === 'index.html') {
          newPath = '/ko/';
        } else {
          newPath = '/ko/' + sub;
        }
      } else if (path === '/en' || path === '/en/' || path === '/en/index.php') {
        newPath = '/ko/';
      } else {
        newPath = '/ko' + (path.charAt(0) === '/' ? path : '/' + path);
      }
    } else {
      // Currently Korean -> switch to English (/en/...)
      localStorage.setItem(STORAGE_KEY, 'en');
      if (path.indexOf('/ko/') === 0) {
        var sub = path.substring(4);
        if (sub === '' || sub === 'index.php' || sub === 'index.html') {
          newPath = '/en/';
        } else {
          newPath = '/en/' + sub;
        }
      } else if (path === '/ko' || path === '/ko/' || path === '/ko/index.php') {
        newPath = '/en/';
      } else if (path === '/' || path === '' || path === '/index.php' || path === '/index.html') {
        newPath = '/en/';
      } else {
        newPath = '/en' + (path.charAt(0) === '/' ? path : '/' + path);
      }
    }

    // Clean up any double slashes or index.php in home
    newPath = newPath.replace(/\/index\.(php|html)$/, '/');

    window.location.href = newPath + search + hash;
  };

  // 7. DOM Initialization
  function init() {
    clearTransCookie();
    injectStyles();
    suppressBanner();

    var lang = detectLanguage();
    updateButtonUI(lang);

    // Keep UI synchronized if dynamic elements render later
    setTimeout(function () {
      updateButtonUI(lang);
      suppressBanner();
    }, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
