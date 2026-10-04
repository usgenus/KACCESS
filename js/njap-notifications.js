/**
 * Healthcare Access Portal - Real-time News & Recall Notification System
 * Handles first-visit opt-in popup modal, Service Worker push subscription, and real-time alerts.
 */

(function () {
  'use strict';

  const VAPID_PUBLIC_KEY = 'BJpQ9Wxw10X-8ODi78gIo2j2heFmIhHK5VqhxgIN_NJ6c0GJxIgNF6CCZQgH-X9W7oPu_PsxYqDhJ1PKRWFxbkQ';
  const STORAGE_KEY = 'njap_notif_prompt_v2';
  const LAST_SEEN_KEY = 'njap_last_seen_broadcast_id';

  // Helper: Convert Base64 URL string to Uint8Array for PushManager
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // 1. Register Service Worker
  async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return null;
    try {
      // Register sw.js from root or /ko/
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      return reg;
    } catch (err) {
      try {
        const regKo = await navigator.serviceWorker.register('/ko/sw.js', { scope: '/ko/' });
        return regKo;
      } catch (err2) {
        console.warn('[NJAP Notif] SW registration fallback error:', err2);
        return null;
      }
    }
  }

  // Helper: Cross-browser Notification permission request (Promise + legacy Callback for Safari)
  async function requestPermissionCrossBrowser() {
    if (!('Notification' in window)) return 'denied';
    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
      return Notification.permission;
    }
    try {
      const res = await Notification.requestPermission();
      if (res) return res;
    } catch (e) {
      // Legacy Safari callback mode
      return new Promise((resolve) => {
        Notification.requestPermission(resolve);
      });
    }
    return Notification.permission;
  }

  // 2. Subscribe User to Web Push
  async function subscribeUserToPush() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

    if (isIOS && !isStandalone) {
      throw new Error('iPhone/iPad(Safari)에서는 화면 하단 공유 버튼(⎋)을 누른 후 [홈 화면에 추가]를 하시면 실시간 푸시 알림을 받으실 수 있습니다.');
    }

    if (!('PushManager' in window) || !('Notification' in window)) {
      throw new Error('이 브라우저는 웹 푸시 알림을 지원하지 않습니다.');
    }

    const permission = await requestPermissionCrossBrowser();
    if (permission !== 'granted') {
      throw new Error('알림 권한이 허용되지 않았습니다. 브라우저 설정에서 알림을 허용해주세요.');
    }

    const reg = await navigator.serviceWorker.ready;
    if (!reg) throw new Error('Service Worker is not ready');

    let subscription = await reg.pushManager.getSubscription();
    if (!subscription) {
      const appServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: appServerKey
      });
    }

    // Send subscription to server
    const subJson = subscription.toJSON();
    const endpointUrl = window.location.pathname.startsWith('/ko') ? '/api/push_subscription.php' : '/api/push_subscription.php';

    await fetch(endpointUrl + '?action=subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: subJson.endpoint,
        keys: subJson.keys,
        userAgent: navigator.userAgent
      })
    });

    // Send instant welcome notification
    try {
      reg.showNotification('🔔 [NJAP] 알림 구독이 완료되었습니다!', {
        body: '새로운 건강 뉴스 및 긴급 리콜 소식이 등록되면 실시간으로 알려드립니다.',
        icon: '/favicon-192.png',
        badge: '/favicon-192.png',
        data: { url: '/blog' },
        tag: 'njap-welcome',
        vibrate: [200, 100, 200]
      });
    } catch (e) {
      // Ignore if background notification fails
    }

    localStorage.setItem(STORAGE_KEY, 'subscribed');
    updateBellIconStatus(true);
    return true;
  }

  // 3. Render and Show First-Visit Modal
  function showFirstVisitModal() {
    if (document.getElementById('njap-notif-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'njap-notif-modal';
    modal.innerHTML = `
      <div id="njap-notif-backdrop" style="position:fixed;inset:0;background:rgba(3,8,19,0.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity 0.3s ease;">
        <div id="njap-notif-card" style="background:#ffffff;border-radius:24px;max-width:440px;width:100%;box-shadow:0 25px 50px -12px rgba(11,25,44,0.35), 0 0 0 1px rgba(0,0,0,0.06);padding:28px 24px;text-align:center;position:relative;transform:scale(0.92) translateY(12px);transition:transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease;font-family:-apple-system,BlinkMacSystemFont,'Pretendard','Segoe UI',Roboto,sans-serif;">
          
          <!-- Close Button -->
          <button id="njap-notif-close-x" type="button" aria-label="닫기" style="position:absolute;top:16px;right:16px;width:32px;height:32px;border-radius:50%;border:none;background:#f1f5f9;color:#64748b;font-size:16px;font-weight:bold;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;">✕</button>

          <!-- Radiant Pulsing Bell Icon -->
          <div style="width:68px;height:68px;border-radius:22px;background:linear-gradient(135deg, #2563eb 0%, #00d4c8 100%);margin:0 auto 18px;display:flex;align-items:center;justify-content:center;box-shadow:0 12px 24px -6px rgba(37,99,235,0.45);position:relative;">
            <svg style="width:34px;height:34px;color:#ffffff;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span style="position:absolute;top:-4px;right:-4px;width:14px;height:14px;border-radius:50%;background:#ef4444;border:2.5px solid #ffffff;"></span>
          </div>

          <!-- Badge -->
          <div style="display:inline-flex;align-items:center;gap:5px;background:#eff6ff;color:#2563eb;font-size:11.5px;font-weight:700;padding:3px 10px;border-radius:999px;margin-bottom:10px;border:1px solid #bfdbfe;">
            <span>🔔</span> 실시간 알림 서비스
          </div>

          <!-- Title -->
          <h3 style="font-size:20px;font-weight:800;color:#0f172a;line-height:1.35;margin-bottom:8px;letter-spacing:-0.02em;">
            새로운 건강·의료 소식 및<br/>긴급 리콜 알림 받기
          </h3>

          <!-- Description -->
          <p style="font-size:13.5px;color:#475569;line-height:1.55;margin-bottom:18px;">
            뉴저지 한인 의료접근센터(NJAP)의 최신 의료 칼럼, 정부 보건 혜택 및 긴급 식품·의약품 리콜 소식을 휴대폰 및 PC 알림으로 실시간 받아보세요.
          </p>

          <!-- Benefits List -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:12px 14px;margin-bottom:20px;text-align:left;display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:#334155;font-weight:600;">
              <span style="color:#2563eb;font-size:14px;">⚡</span> 새 기사 등록 시 즉시 실시간 알림 전송
            </div>
            <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:#334155;font-weight:600;">
              <span style="color:#e11d48;font-size:14px;">⚠️</span> 한인 사회 필수 긴급 FDA / USDA 리콜 속보
            </div>
            <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;color:#334155;font-weight:600;">
              <span style="color:#10b981;font-size:14px;">✓</span> 광고·스팸 없음 · 100% 무료 · 언제든 해제 가능
            </div>
          </div>

          <!-- Buttons -->
          <div style="display:flex;flex-direction:column;gap:9px;">
            <button id="njap-notif-allow-btn" type="button" style="width:100%;padding:13px 20px;background:linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);color:#ffffff;border:none;border-radius:14px;font-size:14.5px;font-weight:800;cursor:pointer;box-shadow:0 6px 16px -3px rgba(37,99,235,0.4);transition:all 0.2s ease;display:flex;align-items:center;justify-content:center;gap:7px;">
              <span>🔔</span> <span>실시간 알림 받기 (수신 동의)</span>
            </button>
            <button id="njap-notif-later-btn" type="button" style="width:100%;padding:10px 16px;background:transparent;color:#64748b;border:none;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;transition:color 0.2s;">
              나중에 하기
            </button>
          </div>

          <div id="njap-notif-status-msg" style="display:none;margin-top:12px;font-size:12px;font-weight:600;"></div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Fade In
    requestAnimationFrame(() => {
      const bd = document.getElementById('njap-notif-backdrop');
      const cd = document.getElementById('njap-notif-card');
      if (bd && cd) {
        bd.style.opacity = '1';
        cd.style.transform = 'scale(1) translateY(0)';
      }
    });

    function closeModal(reason) {
      const bd = document.getElementById('njap-notif-backdrop');
      const cd = document.getElementById('njap-notif-card');
      if (bd && cd) {
        bd.style.opacity = '0';
        cd.style.transform = 'scale(0.92) translateY(12px)';
        setTimeout(() => {
          if (modal.parentNode) modal.parentNode.removeChild(modal);
        }, 320);
      }
      if (reason) localStorage.setItem(STORAGE_KEY, reason);
    }

    // Event Listeners
    document.getElementById('njap-notif-close-x').onclick = () => closeModal('dismissed');
    document.getElementById('njap-notif-later-btn').onclick = () => closeModal('later');

    document.getElementById('njap-notif-allow-btn').onclick = async function () {
      const btn = this;
      const statusEl = document.getElementById('njap-notif-status-msg');
      btn.disabled = true;
      btn.style.opacity = '0.75';
      btn.innerHTML = `<span>⏳</span> <span>알림 권한 설정 중...</span>`;

      try {
        await subscribeUserToPush();
        btn.style.background = '#10b981';
        btn.innerHTML = `<span>✓</span> <span>알림 설정이 완료되었습니다!</span>`;
        if (statusEl) {
          statusEl.style.display = 'block';
          statusEl.style.color = '#059669';
          statusEl.textContent = '새로운 소식이 등록되면 실시간으로 전달해 드립니다.';
        }
        setTimeout(() => closeModal('subscribed'), 1600);
      } catch (err) {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.background = '#64748b';
        btn.innerHTML = `<span>🔔</span> <span>다시 시도하기</span>`;
        if (statusEl) {
          statusEl.style.display = 'block';
          statusEl.style.color = '#dc2626';
          if (Notification.permission === 'denied') {
            statusEl.textContent = '브라우저 설정에서 알림이 차단되어 있습니다. 주소창 좌측 자물쇠에서 알림을 허용해주세요.';
          } else {
            statusEl.textContent = err.message || '알림 설정 중 오류가 발생했습니다.';
          }
        }
      }
    };
  }

  // 4. Floating Notification Bell Widget
  function renderFloatingBell() {
    if (document.getElementById('njap-floating-bell-btn')) return;

    const bellBtn = document.createElement('button');
    bellBtn.id = 'njap-floating-bell-btn';
    bellBtn.type = 'button';
    bellBtn.setAttribute('aria-label', '실시간 뉴스 알림 설정');
    bellBtn.title = '실시간 뉴스 및 긴급 리콜 알림 설정';
    bellBtn.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9998;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #2563eb;
      color: #ffffff;
      border: 2px solid #ffffff;
      box-shadow: 0 8px 24px -4px rgba(37,99,235,0.45);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    `;

    bellBtn.innerHTML = `
      <svg style="width:24px;height:24px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <span id="njap-bell-dot" style="position:absolute;top:3px;right:3px;width:10px;height:10px;border-radius:50%;background:#ef4444;border:2px solid #ffffff;display:none;"></span>
    `;

    bellBtn.onmouseenter = () => { bellBtn.style.transform = 'scale(1.1)'; };
    bellBtn.onmouseleave = () => { bellBtn.style.transform = 'scale(1)'; };
    bellBtn.onclick = () => {
      showFirstVisitModal();
    };

    document.body.appendChild(bellBtn);
  }

  function updateBellIconStatus(isSubscribed) {
    const dot = document.getElementById('njap-bell-dot');
    if (dot) {
      dot.style.display = isSubscribed ? 'none' : 'block';
    }
  }

  // 5. Check for New Broadcasts in Active Browser
  async function checkForNewBroadcasts() {
    try {
      const endpoint = window.location.pathname.startsWith('/ko') ? '/ko/data/latest_broadcast.json' : '/data/latest_broadcast.json';
      const res = await fetch(endpoint + '?_t=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) return;

      const data = await res.json();
      if (!data || !data.id) return;

      const lastSeen = localStorage.getItem(LAST_SEEN_KEY);
      if (lastSeen !== String(data.id)) {
        localStorage.setItem(LAST_SEEN_KEY, String(data.id));

        // If permission is already granted, show native notification
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            const reg = await navigator.serviceWorker.ready;
            if (reg && reg.showNotification) {
              reg.showNotification(data.title, {
                body: data.body,
                icon: data.icon || '/favicon-192.png',
                badge: '/favicon-192.png',
                data: { url: data.url }
              });
            } else {
              new Notification(data.title, { body: data.body, icon: data.icon });
            }
          } catch (e) {
            // fallback
          }
        }

        // Also display in-page toast banner
        showInPageToast(data);
      }
    } catch (err) {
      // silent
    }
  }

  // 6. In-Page Floating Toast Alert
  function showInPageToast(data) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 99999;
      background: #0f172a;
      color: #ffffff;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 16px;
      box-shadow: 0 20px 40px -8px rgba(0,0,0,0.5);
      padding: 16px 18px;
      max-width: 360px;
      display: flex;
      gap: 12px;
      align-items: flex-start;
      font-family: -apple-system,BlinkMacSystemFont,'Pretendard',sans-serif;
      animation: slideInNotif 0.4s ease forwards;
    `;

    toast.innerHTML = `
      <div style="width:36px;height:36px;border-radius:10px;background:#2563eb;color:#ffffff;display:flex;align-items:center;justify-content:center;shrink:0;font-size:18px;">🔔</div>
      <div style="flex:1;">
        <div style="font-size:11px;font-weight:700;color:#38bdf8;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:2px;">실시간 새 뉴스 등록</div>
        <div style="font-size:13.5px;font-weight:700;line-height:1.35;margin-bottom:4px;color:#f8fafc;">${data.title}</div>
        <div style="font-size:12px;color:#94a3b8;line-height:1.4;margin-bottom:8px;">${data.body}</div>
        <a href="${data.url || '/blog'}" style="display:inline-block;font-size:12px;font-weight:700;color:#38bdf8;text-decoration:none;">지금 기사 읽기 &rarr;</a>
      </div>
      <button type="button" style="border:none;background:transparent;color:#94a3b8;cursor:pointer;font-size:14px;padding:2px;" onclick="this.parentNode.remove()">✕</button>
    `;

    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 9000);
  }

  // 7. Initialization
  document.addEventListener('DOMContentLoaded', async () => {
    // Register Service Worker
    registerServiceWorker();

    // Render floating bell
    renderFloatingBell();

    const notifStatus = localStorage.getItem(STORAGE_KEY);
    const hasPermission = ('Notification' in window && Notification.permission === 'granted');

    // If first-time visitor (no preference saved yet)
    if (!notifStatus && !hasPermission) {
      setTimeout(() => {
        showFirstVisitModal();
      }, 1200);
    } else {
      updateBellIconStatus(hasPermission);
    }

    // Check for any newly broadcasted post
    setTimeout(checkForNewBroadcasts, 2000);

    // Periodically poll for new broadcasts while tab is active
    setInterval(checkForNewBroadcasts, 60000);
  });
})();
