/**
 * NJ Access Portal - Service Worker
 * Handles real-time Web Push notifications for news, medical columns & emergency recalls.
 */

const SW_VERSION = 'njap-sw-v1.1.1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 1. Push Event Listener
self.addEventListener('push', (event) => {
  let promise;
  if (event.data) {
    try {
      const data = event.data.json();
      promise = showNotificationFromData(data);
    } catch (e) {
      promise = fetchLatestAndShowNotification();
    }
  } else {
    promise = fetchLatestAndShowNotification();
  }
  event.waitUntil(promise);
});

function showNotificationFromData(data) {
  let title = (data.title || '[NJ 한인의료포털] 건강·의료 소식')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/^\s*(\[속보\]|\[긴급\]|\[안내\])\s*/gi, '')
    .trim();
  
  if (!title.startsWith('[NJ')) {
    title = '[NJ 한인의료포털] ' + title;
  }

  const defaultIcon = 'https://njaccessportal.com/favicon-192.png';
  let iconUrl = data.icon || defaultIcon;
  if (iconUrl && !iconUrl.startsWith('http')) {
    iconUrl = 'https://njaccessportal.com/' + iconUrl.replace(/^\/+/, '');
  }

  const options = {
    body: (data.body || '뉴저지 한인 의료접근센터의 새로운 건강 정보 및 기사를 확인하세요.').trim(),
    icon: iconUrl,
    badge: defaultIcon,
    image: data.image && data.image.startsWith('http') ? data.image : undefined,
    data: {
      url: data.url || '/ko/blog',
      timestamp: data.timestamp || Date.now()
    },
    tag: data.tag || 'njap-news',
    renotify: false,
    vibrate: [100, 50, 100],
    actions: [
      { action: 'read', title: '기사 읽기' },
      { action: 'close', title: '닫기' }
    ]
  };
  return self.registration.showNotification(title, options);
}

async function fetchLatestAndShowNotification() {
  try {
    const res = await fetch('/data/latest_broadcast.json?_t=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.title) {
        return showNotificationFromData(data);
      }
    }
  } catch (err) {
    // Fallback to latest published post
  }

  try {
    const res2 = await fetch('/ko/api/posts.php?status=published&_t=' + Date.now(), { cache: 'no-store' });
    const json2 = await res2.json();
    const latest = (json2.data && json2.data[0]) ? json2.data[0] : null;
    if (latest) {
      return showNotificationFromData({
        title: latest.title,
        body: latest.excerpt || '새로운 의료 칼럼 및 정책 뉴스가 등록되었습니다.',
        icon: latest.coverImage || 'https://njaccessportal.com/favicon-192.png',
        url: `/ko/blog/${latest.slug}`
      });
    }
  } catch (e) {
    // Minimal fallback
    return showNotificationFromData({
      title: '[NJ 한인의료포털] 뉴저지 한인 의료접근센터',
      body: '새로운 건강 소식 및 복지 정보가 등록되었습니다.',
      url: '/ko/blog'
    });
  }
}

// 2. Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) 
    ? event.notification.data.url 
    : '/blog';

  const fullUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === fullUrl && 'focus' in client) {
          return client.focus();
        }
      }
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(fullUrl);
          return client.focus();
        }
      }
      // Otherwise open new window
      if (clients.openWindow) {
        return clients.openWindow(fullUrl);
      }
    })
  );
});
