/**
 * NJAP Translation Cleanup Stub — js/njap-translate.js
 * Automatically clears stray Google Translate cookies and ensures no translation buttons are rendered.
 */

(function () {
  'use strict';

  // 1. Thoroughly eradicate Google Translate cookies across all paths & domains
  function clearTransCookie() {
    var domain = window.location.hostname;
    var paths = ['/', '/ko', '/ko/', '/en', '/en/', '/forum', '/forum/'];
    var domains = ['', domain, '.' + domain];
    var parts = domain.split('.');
    if (parts.length >= 2) {
      var rootDomain = parts.slice(-2).join('.');
      domains.push(rootDomain);
      domains.push('.' + rootDomain);
    }

    var cookieNames = ['googtrans', 'googtrans_en', 'googtrans_ko'];
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

  // 2. Eradicate any translation buttons or artifacts
  function cleanButtons() {
    var btns = document.querySelectorAll('#en-translate-btn');
    btns.forEach(function (b) { b.remove(); });
  }

  // 3. No-op safe stub for backward compatibility
  window.toggleTranslation = function () {};

  clearTransCookie();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanButtons);
  } else {
    cleanButtons();
  }
})();
