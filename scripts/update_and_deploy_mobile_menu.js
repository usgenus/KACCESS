const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/7196cb5abc8f8859/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MTE1MTc2NywiaWF0IjoxNzkxMTMwMTY3fQ.UoTY4ph6bh_WSCzoHj99I3V1m0aCAhNmMCW3vempCGQ';
const REST_AUTH_KEY = 'c0ae1d11e07205ef36fb2ca8391a9bbc47448a0d349b06ab3d5a35c8960e3824-7196cb5abc8f8859';

function getCanonicalMobileDropdownHTML(activePage) {
  const isHome = activePage === 'home';
  const isBlog = activePage === 'blog';
  const isForum = activePage === 'forum';
  const isMedicare = activePage === 'medicare';
  const isAbout = activePage === 'about';
  const isEngine = activePage === 'engine';

  return `                <div id="mobile-menu-dropdown" class="md:hidden overflow-hidden transition-all duration-300 max-h-0 opacity-0 bg-white/98 backdrop-blur-md border-t border-brand-border px-4 py-3 flex flex-col gap-1" style="-webkit-overflow-scrolling: touch;">
      <!-- 1. 홈 -->
      <a href="/" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 ${isHome ? 'font-bold text-brand-blue bg-blue-50/70' : 'font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50'}">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 ${isHome ? 'text-brand-blue' : 'text-slate-400'} shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span class="text-[15px]">홈</span>
        </div>
        <svg class="w-4 h-4 ${isHome ? 'text-brand-blue' : 'text-slate-300'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 2. 뉴스 -->
      <a href="/blog" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 ${isBlog ? 'font-bold text-brand-blue bg-blue-50/70' : 'font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50'}">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 ${isBlog ? 'text-brand-blue' : 'text-slate-400'} shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
          <span class="text-[15px]">뉴스</span>
        </div>
        <svg class="w-4 h-4 ${isBlog ? 'text-brand-blue' : 'text-slate-300'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 2.5. 커뮤니티 포럼 -->
      <a href="/forum" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 ${isForum ? 'font-bold text-brand-blue bg-blue-50/70' : 'font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50'}">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 ${isForum ? 'text-brand-blue' : 'text-blue-600'} shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>
          <span class="text-[15px]">커뮤니티 포럼</span>
        </div>
        <svg class="w-4 h-4 ${isForum ? 'text-brand-blue' : 'text-slate-300'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 4. 메디케어 & ACA -->
      <a href="/medicare" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 ${isMedicare ? 'font-bold text-brand-blue bg-blue-50/70' : 'font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50'}">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 ${isMedicare ? 'text-brand-blue' : 'text-slate-400'} shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          <span class="text-[15px]">메디케어 &amp; ACA</span>
        </div>
        <svg class="w-4 h-4 ${isMedicare ? 'text-brand-blue' : 'text-slate-300'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 6. 소개 -->
      <a href="/about" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 ${isAbout ? 'font-bold text-brand-blue bg-blue-50/70' : 'font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50'}">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 ${isAbout ? 'text-brand-blue' : 'text-slate-400'} shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span class="text-[15px]">소개</span>
        </div>
        <svg class="w-4 h-4 ${isAbout ? 'text-brand-blue' : 'text-slate-300'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 7. Engine (Marketing Client) -->
      <a href="/engine" target="_self" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 ${isEngine ? 'font-bold text-brand-blue bg-blue-50/70' : 'font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50'}">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          <div class="flex flex-col text-left">
            <span class="text-[15px] font-bold text-slate-800">Engine</span>
            <span class="text-[10px] font-semibold text-slate-400 leading-none">Marketing Client</span>
          </div>
        </div>
        <svg class="w-4 h-4 ${isEngine ? 'text-brand-blue' : 'text-slate-300'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 카카오톡 1:1 상담 바로가기 -->
      <div class="pt-2 pb-1">
        <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3.5 bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#FBC02D] text-[#191919] rounded-xl font-bold text-sm shadow-xs transition-all cursor-pointer">
          <div class="flex items-center gap-2.5">
            <img src="/kakaotalk-icon.png" alt="KakaoTalk" class="w-6 h-6 rounded-md shrink-0 object-contain shadow-xs" />
            <div class="flex flex-col text-left">
              <span class="text-sm font-bold leading-tight">카카오톡 1:1 상담 바로가기</span>
              <span class="text-[11px] font-medium text-black/70">의료 복지 및 건강 상담 실시간 문의</span>
            </div>
          </div>
          <svg class="w-4 h-4 text-black/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>`;
}

const targetFiles = [
  { rel: 'index.php', page: 'home', isPhp: true },
  { rel: 'ko/index.html', page: 'home', isPhp: false },
  { rel: 'blog.php', page: 'blog', isPhp: true },
  { rel: 'blog.html', page: 'blog', isPhp: false },
  { rel: 'medicare.html', page: 'medicare', isPhp: false },
  { rel: 'about.html', page: 'about', isPhp: false },
  { rel: 'the-health-bridge.html', page: 'about', isPhp: false },
  { rel: 'calculator.html', page: 'tool', isPhp: false },
  { rel: 'matcher.html', page: 'tool', isPhp: false },
  { rel: 'dictionary.html', page: 'tool', isPhp: false }
];

console.log('--- Step 1: Updating static mobile dropdown and cache busting across all pages ---');

targetFiles.forEach(({ rel, page, isPhp }) => {
  const filePath = path.join(BASE_DIR, rel);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace mobile-menu-dropdown
  const ddRegex = /<div id="mobile-menu-dropdown"[\s\S]*?<\/div>(\s*<\/nav>)/;
  if (ddRegex.test(content)) {
    content = content.replace(ddRegex, getCanonicalMobileDropdownHTML(page) + '\n  </nav>');
    console.log(`[UPDATED DROPDOWN] ${rel}`);
  }

  // Update fixes.js script tag
  if (isPhp) {
    content = content.replace(/\/js\/fixes\.js(\?[^"']*)?/g, '/js/fixes.js?v=<?= time() ?>');
    content = content.replace(/\/ko\/js\/fixes\.js(\?[^"']*)?/g, '/js/fixes.js?v=<?= time() ?>');
    content = content.replace(/\/js\/cms-client\.js(\?[^"']*)?/g, '/js/cms-client.js?v=<?= time() ?>');
    content = content.replace(/\/ko\/js\/cms-client\.js(\?[^"']*)?/g, '/js/cms-client.js?v=<?= time() ?>');
  } else {
    content = content.replace(/\/js\/fixes\.js(\?[^"']*)?/g, '/js/fixes.js?v=8.0.0');
    content = content.replace(/\/ko\/js\/fixes\.js(\?[^"']*)?/g, '/js/fixes.js?v=8.0.0');
    content = content.replace(/\/js\/cms-client\.js(\?[^"']*)?/g, '/js/cms-client.js?v=8.0.0');
    content = content.replace(/\/ko\/js\/cms-client\.js(\?[^"']*)?/g, '/js/cms-client.js?v=8.0.0');
  }

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('--- Step 2: Deploying files to Hostinger Production ---');

const filesToUpload = [
  '.htaccess',
  'js/fixes.js',
  'ko/js/fixes.js',
  'index.php',
  'ko/index.html',
  'blog.php',
  'blog.html',
  'medicare.html',
  'about.html',
  'the-health-bridge.html',
  'calculator.html',
  'matcher.html',
  'dictionary.html'
];

async function uploadFile(relPath) {
  const localPath = path.join(BASE_DIR, relPath);
  if (!fs.existsSync(localPath)) return;

  const content = fs.readFileSync(localPath);
  const size = content.length;
  console.log(`[UPLOADING] ${relPath} (${size} bytes)...`);

  const encodedRelPath = relPath.split('/').map(encodeURIComponent).join('/');
  const postUrl = new URL(`${TUS_URL}/${encodedRelPath}?override=true`);

  await new Promise((resolve, reject) => {
    const req = https.request(postUrl, {
      method: 'POST',
      headers: {
        'X-Auth': AUTH_KEY,
        'X-Auth-Rest': REST_AUTH_KEY,
        'Tus-Resumable': '1.0.0',
        'Upload-Length': size,
        'Upload-Offset': 0
      }
    }, res => {
      if (res.statusCode === 201 || res.statusCode === 200 || res.statusCode === 204) resolve();
      else {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => reject(new Error(`POST failed ${res.statusCode}: ${body}`)));
      }
    });
    req.on('error', reject);
    req.end();
  });

  await new Promise((resolve, reject) => {
    const patchReq = https.request(postUrl, {
      method: 'PATCH',
      headers: {
        'X-Auth': AUTH_KEY,
        'X-Auth-Rest': REST_AUTH_KEY,
        'Tus-Resumable': '1.0.0',
        'Content-Type': 'application/offset+octet-stream',
        'Upload-Offset': 0,
        'Content-Length': size
      }
    }, res => {
      if (res.statusCode === 204 || res.statusCode === 200) {
        console.log(`[DONE] ${relPath} uploaded (${res.statusCode})`);
        resolve();
      } else {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => reject(new Error(`PATCH failed ${res.statusCode}: ${body}`)));
      }
    });
    patchReq.on('error', reject);
    patchReq.write(content);
    patchReq.end();
  });
}

(async () => {
  for (const f of filesToUpload) {
    try {
      await uploadFile(f);
    } catch (e) {
      console.error(`Failed to upload ${f}:`, e.message);
    }
  }
  console.log('--- All files successfully synced and deployed! ---');
})();
