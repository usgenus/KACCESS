/**
 * NJ Access Portal · Engine Client Access Gate
 * Password requirement: 7777
 */
(function() {
  'use strict';

  var REQUIRED_PASS = '7777';
  var STORAGE_KEY = 'njap_engine_client_pw';

  // 1. Check if already authenticated in this session
  function isAuthorized() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === REQUIRED_PASS;
    } catch (e) {
      return false;
    }
  }

  // If already authorized, ensure document is unlocked immediately
  if (isAuthorized()) {
    if (document.documentElement) {
      document.documentElement.classList.remove('engine-locked');
    }
    var existingGate = document.getElementById('engine-client-gate');
    if (existingGate) {
      existingGate.style.display = 'none';
      existingGate.remove();
    }
    return;
  }

  // Lock scrolling right away
  if (document.documentElement) {
    document.documentElement.classList.add('engine-locked');
  }

  function initGate() {
    if (isAuthorized()) return;

    var gate = document.getElementById('engine-client-gate');
    if (!gate) return;

    var form = document.getElementById('engine-gate-form');
    var input = document.getElementById('gate-pass-input');
    var btn = document.getElementById('gate-submit-btn');
    var errorMsg = document.getElementById('gate-error-msg');
    var card = document.getElementById('engine-gate-card');

    if (!form || !input) return;

    function shakeCard() {
      if (!card) return;
      card.classList.remove('gate-shake');
      void card.offsetWidth; // trigger reflow
      card.classList.add('gate-shake');
    }

    function unlock() {
      try {
        sessionStorage.setItem(STORAGE_KEY, REQUIRED_PASS);
      } catch (e) {}

      if (btn) {
        btn.innerHTML = '<span>Website Unlocked</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
        btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        btn.style.color = '#ffffff';
      }

      if (errorMsg) errorMsg.style.display = 'none';

      if (card) {
        card.style.transition = 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = 'scale(0.95)';
        card.style.opacity = '0';
      }

      setTimeout(function() {
        gate.style.transition = 'opacity 0.28s ease';
        gate.style.opacity = '0';
        setTimeout(function() {
          gate.remove();
          document.documentElement.classList.remove('engine-locked');
          if (document.body) {
            document.body.style.overflow = '';
          }
        }, 280);
      }, 180);
    }

    function validate() {
      var entered = (input.value || '').trim();
      if (entered === REQUIRED_PASS) {
        unlock();
      } else {
        if (errorMsg) {
          errorMsg.style.display = 'flex';
        }
        shakeCard();
        input.value = '';
        input.focus();
      }
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      validate();
    });

    if (btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        validate();
      });
    }

    // Auto-unlock immediately upon entering 7777
    input.addEventListener('input', function() {
      if (errorMsg && errorMsg.style.display !== 'none') {
        errorMsg.style.display = 'none';
      }
      if (input.value.trim() === REQUIRED_PASS) {
        unlock();
      }
    });

    // Ensure focus on input
    setTimeout(function() {
      if (input) input.focus();
    }, 100);
  }

  // Provide global lock / relock function for testing
  window.lockEnginePortal = function() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch(e) {}
    window.location.reload();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGate);
  } else {
    initGate();
  }
})();
