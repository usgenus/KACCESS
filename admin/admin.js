/**
 * Healthcare Access Portal - Admin CMS Client Script
 */

let state = {
  billboards: [],
  billboards2: [],
  videos: [],
  posts: [],
  media: [],
  inquiries: [],
  categories: { news: [], videos: [], billboards: [], billboards2: [] },
  videoFilter: '전체',
  postFilter: '전체',
  postSearch: '',
  inquiryFilter: '전체',
  inquirySearch: '',
  expandedInquiries: {}
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
window.escapeHtml = escapeHtml;

// Initialize CMS on load
document.addEventListener('DOMContentLoaded', () => {
  fetchAllData();
  setupDropzone();
});

// Toast Helper
function showToast(msg, isSuccess = true) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const toastIcon = document.getElementById('toast-icon');

  toastMsg.textContent = msg;
  toastIcon.textContent = isSuccess ? '✅' : '⚠️';
  toast.className = `fixed bottom-6 right-6 z-50 transform translate-y-0 opacity-100 transition-all duration-300 max-w-sm w-full border text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 ${
    isSuccess ? 'bg-slate-800 border-emerald-500/50' : 'bg-slate-800 border-red-500/50'
  }`;

  setTimeout(() => {
    toast.className = 'fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 max-w-sm w-full bg-slate-800 border border-slate-700 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3';
  }, 3500);
}

// Switch Active Tab
function switchTab(tabName) {
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.mobile-tab-btn').forEach(el => el.classList.remove('active'));

  const targetPane = document.getElementById(`tab-${tabName}`);
  const targetBtn = document.getElementById(`nav-${tabName}`);
  const targetMBtn = document.getElementById(`nav-m-${tabName}`);

  if (targetPane) targetPane.classList.remove('hidden');
  if (targetBtn) targetBtn.classList.add('active');
  if (targetMBtn) targetMBtn.classList.add('active');

  if (tabName === 'media') {
    fetchMediaFiles();
  }
  if (tabName === 'inquiries') {
    fetchInquiries();
  }
}

// Fetch all initial data
async function fetchAllData() {
  try {
    const t = Date.now();
    const [bRes, b2Res, vRes, pRes, inqRes] = await Promise.all([
      fetch(`/api/billboards.php?_t=${t}`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({ success: false })),
      fetch(`/api/billboards2.php?_t=${t}`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({ success: false })),
      fetch(`/api/videos.php?_t=${t}`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({ success: false })),
      fetch(`/api/posts.php?_t=${t}`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({ success: false })),
      fetch(`/api/contact.php?_t=${t}`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({ success: false }))
    ]);

    if (bRes.success) {
      state.billboards = bRes.data || [];
      state.categories.billboards = bRes.categories || [];
      renderBillboards();
    }
    if (b2Res.success) {
      state.billboards2 = b2Res.data || [];
      state.categories.billboards2 = b2Res.categories || [];
      renderBillboards2();
    }
    if (vRes.success) {
      state.videos = vRes.data || [];
      state.categories.videos = vRes.categories || [];
      renderVideos();
    }
    if (pRes.success) {
      state.posts = pRes.data || [];
      state.categories.news = pRes.categories || [];
      renderPosts();
    }
    if (inqRes && inqRes.success) {
      state.inquiries = inqRes.data || [];
      renderInquiries();
    }

    updateDashboard();
  } catch (err) {
    console.error('Error fetching data:', err);
    showToast('데이터를 불러오는 중 오류가 발생했습니다.', false);
  }
}

// Logout
async function handleLogout() {
  if (!confirm('로그아웃 하시겠습니까?')) return;
  try {
    await fetch('/api/auth.php?action=logout');
    window.location.href = '/admin/login.php';
  } catch (err) {
    window.location.href = '/admin/login.php';
  }
}

// =========================================================
// DASHBOARD
// =========================================================
function updateDashboard() {
  const b1El = document.getElementById('stat-billboards-count');
  if (b1El) b1El.textContent = state.billboards.length + '개';

  const b2El = document.getElementById('stat-billboards2-count');
  if (b2El) b2El.textContent = state.billboards2.length + '개';

  const vEl = document.getElementById('stat-videos-count');
  if (vEl) vEl.textContent = state.videos.length + '개';

  const pEl = document.getElementById('stat-posts-count');
  if (pEl) pEl.textContent = state.posts.length + '개';

  // Inquiries stats & badge
  const pendingInquiries = state.inquiries.filter(i => !i.resolved);
  const inqCountEl = document.getElementById('stat-inquiries-count');
  if (inqCountEl) inqCountEl.textContent = pendingInquiries.length + '건';

  const inqBadgeEl = document.getElementById('stat-inquiries-badge');
  if (inqBadgeEl) inqBadgeEl.textContent = `전체 ${state.inquiries.length}건`;

  const inqSubEl = document.getElementById('stat-inquiries-sub');
  if (inqSubEl) inqSubEl.textContent = `대기중 ${pendingInquiries.length}건 / 해결 ${state.inquiries.length - pendingInquiries.length}건`;

  const navBadge = document.getElementById('nav-inquiries-badge');
  if (navBadge) {
    if (pendingInquiries.length > 0) {
      navBadge.textContent = pendingInquiries.length;
      navBadge.classList.remove('hidden');
    } else {
      navBadge.classList.add('hidden');
    }
  }
  
  // Recent activity list
  const container = document.getElementById('dash-recent-list');
  if (!container) return;

  const recent = [
    ...state.inquiries.slice(0, 3).map(i => ({ type: 'inquiry', title: `${i.name} (${i.category || '문의'}) - ${i.resolved ? '해결완료' : '접수대기'}`, tag: '온라인문의', date: (i.createdAt || '').substring(0, 16) || '최근' })),
    ...state.billboards.map(b => ({ type: 'billboard', title: b.title, tag: '빌보드 1', date: b.createdAt || '최근' })),
    ...state.billboards2.map(b => ({ type: 'billboard2', title: b.title, tag: '빌보드 2', date: b.createdAt || '최근' })),
    ...state.videos.map(v => ({ type: 'video', title: v.title, tag: '의학비디오', date: v.date || '최근' })),
    ...state.posts.map(p => ({ type: 'post', title: p.title, tag: '뉴스', date: p.date || '최근' }))
  ].slice(0, 6);

  if (recent.length === 0) {
    container.innerHTML = '<div class="text-center py-6 text-slate-500 text-xs">등록된 콘텐츠가 없습니다.</div>';
    return;
  }

  container.innerHTML = recent.map(item => `
    <div class="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60">
      <div class="flex items-center gap-3 min-w-0">
        <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold ${
          item.type === 'inquiry' ? 'bg-amber-500/20 text-amber-300' :
          item.type === 'billboard' ? 'bg-blue-500/20 text-blue-300' :
          item.type === 'billboard2' ? 'bg-indigo-500/20 text-indigo-300' :
          item.type === 'video' ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
        }">${item.tag}</span>
        <h4 class="text-xs font-semibold text-white truncate">${item.title}</h4>
      </div>
      <span class="text-[11px] text-slate-400 shrink-0 ml-4">${item.date}</span>
    </div>
  `).join('');
}

// =========================================================
// BILLBOARDS
// =========================================================
function renderBillboards() {
  const container = document.getElementById('billboards-grid');
  if (state.billboards.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 bg-slate-800/40 rounded-3xl border border-slate-700 border-dashed">
        <div class="text-3xl mb-2">🖼️</div>
        <h3 class="text-sm font-bold text-white">등록된 갤러리 빌보드가 없습니다.</h3>
        <p class="text-xs text-slate-400 mt-1">새 빌보드를 추가하여 메인 홈페이지를 돋보이게 만드세요.</p>
        <button onclick="openBillboardModal()" class="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs">
          + 새 빌보드 추가
        </button>
      </div>`;
    return;
  }

  container.innerHTML = state.billboards.map(b => {
    const isVid = b.mediaType === 'video' || (b.mediaUrl && (/\.(mp4|webm|mov|ogg|m4v)($|\?)/i.test(b.mediaUrl) || b.mediaUrl.startsWith('data:video') || b.mediaUrl.includes('/uploads/videos/')));
    return `
    <div class="bg-slate-800/90 border border-slate-700/90 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between group">
      <div>
        <div class="relative h-48 bg-slate-900 overflow-hidden">
          ${isVid ? `
            <video src="${b.mediaUrl}" class="w-full h-full object-cover" muted autoplay loop playsinline></video>
            <span class="absolute top-3 right-3 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <i class="fa-solid fa-video"></i> VIDEO
            </span>
          ` : `
            <img src="${b.mediaUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80'}" alt="${b.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          `}
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          <div class="absolute top-3 left-3">
            <span class="bg-blue-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md">
              ${b.subtitle || b.category || 'SPECIAL CAMPAIGN'}
            </span>
          </div>
          <div class="absolute bottom-3 left-3 right-3">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">순서 #${b.order || 1}</span>
            <h3 class="text-base font-extrabold text-white leading-snug line-clamp-1">${b.title}</h3>
          </div>
        </div>

        <div class="p-5 space-y-3">
          <p class="text-xs text-slate-300 leading-relaxed line-clamp-2">${b.subtitle || ''}</p>
          <div class="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/60">
            <span class="flex items-center gap-1.5">
              <i class="fa-solid fa-link text-blue-400"></i>
              <span class="truncate max-w-[160px]">${b.linkUrl || '#'}</span>
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${b.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}">
              ${b.active ? '● 노출 중' : '비활성'}
            </span>
          </div>
        </div>
      </div>

      <div class="px-5 pb-5 pt-2 flex items-center justify-end gap-2 border-t border-slate-700/40">
        <button onclick="editBillboard('${b.id}')" class="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all">
          <i class="fa-solid fa-pen-to-square"></i>
          <span>수정</span>
        </button>
        <button onclick="deleteBillboard('${b.id}')" class="px-3.5 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all">
          <i class="fa-solid fa-trash"></i>
          <span>삭제</span>
        </button>
      </div>
    </div>
  `}).join('');
}

function openBillboardModal() {
  document.getElementById('form-billboard').reset();
  document.getElementById('billboard-id').value = '';
  document.getElementById('modal-billboard-title').innerHTML = '<i class="fa-solid fa-panorama text-blue-400"></i> <span>새 갤러리 빌보드 등록</span>';
  document.getElementById('billboard-media-preview').classList.add('hidden');
  document.getElementById('modal-billboard').classList.remove('hidden');
}

function editBillboard(id) {
  const b = state.billboards.find(item => item.id === id);
  if (!b) return;

  document.getElementById('billboard-id').value = b.id;
  const catInput = document.getElementById('billboard-category-input');
  if (catInput) catInput.value = b.category || '';
  document.getElementById('billboard-order-input').value = b.order || 1;
  document.getElementById('billboard-subtitle-input').value = b.subtitle || '';
  document.getElementById('billboard-media-input').value = b.mediaUrl || '';
  document.getElementById('billboard-linkurl-input').value = b.linkUrl || '/about#contact';
  document.getElementById('billboard-linktext-input').value = b.linkText || '자세히 보기 →';
  document.getElementById('billboard-active-input').checked = b.active !== false;

  const preview = document.getElementById('billboard-media-preview');
  if (b.mediaUrl) {
    const isVid = b.mediaType === 'video' || (/\.(mp4|webm|mov|ogg|m4v)($|\?)/i.test(b.mediaUrl) || b.mediaUrl.startsWith('data:video') || b.mediaUrl.includes('/uploads/videos/'));
    if (isVid) {
      preview.innerHTML = `<video src="${b.mediaUrl}" class="w-full h-full object-cover" controls playsinline></video>`;
    } else {
      preview.innerHTML = `<img src="${b.mediaUrl}" class="w-full h-full object-cover">`;
    }
    preview.classList.remove('hidden');
  } else {
    preview.classList.add('hidden');
  }

  document.getElementById('modal-billboard-title').innerHTML = '<i class="fa-solid fa-pen-to-square text-blue-400"></i> <span>갤러리 빌보드 수정</span>';
  document.getElementById('modal-billboard').classList.remove('hidden');
}

async function handleSaveBillboard(e) {
  e.preventDefault();
  const id = document.getElementById('billboard-id').value;
  const isEdit = Boolean(id);
  const catInput = document.getElementById('billboard-category-input');
  const mediaUrl = document.getElementById('billboard-media-input').value.trim();
  const isVid = /\.(mp4|webm|mov|ogg|m4v)($|\?)/i.test(mediaUrl) || mediaUrl.startsWith('data:video') || mediaUrl.includes('/uploads/videos/');

  const payload = {
    id: id,
    title: document.getElementById('billboard-title-input').value,
    category: (catInput ? catInput.value.trim() : '') || '',
    order: parseInt(document.getElementById('billboard-order-input').value) || 1,
    subtitle: document.getElementById('billboard-subtitle-input').value,
    mediaUrl: mediaUrl,
    mediaType: isVid ? 'video' : 'image',
    linkUrl: document.getElementById('billboard-linkurl-input').value,
    linkText: document.getElementById('billboard-linktext-input').value,
    active: document.getElementById('billboard-active-input').checked
  };

  try {
    const res = await fetch('/api/billboards.php', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      showToast(isEdit ? '빌보드가 수정되었습니다.' : '새 빌보드가 등록되었습니다.');
      closeModal('modal-billboard');
      fetchAllData();
    } else {
      showToast(data.error || '저장에 실패했습니다.', false);
    }
  } catch (err) {
    showToast('서버 오류가 발생했습니다.', false);
  }
}

async function deleteBillboard(id) {
  if (!confirm('이 갤러리 빌보드를 삭제하시겠습니까?')) return;
  try {
    const res = await fetch(`/api/billboards.php?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('빌보드가 삭제되었습니다.');
      fetchAllData();
    } else {
      showToast(data.error || '삭제 실패', false);
    }
  } catch (err) {
    showToast('통신 오류', false);
  }
}

// =========================================================
// BILLBOARDS 2 (중단 빌보드 2 - 원스톱 센터 상단)
// =========================================================
function renderBillboards2() {
  const container = document.getElementById('billboards2-grid');
  if (!container) return;

  if (state.billboards2.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 bg-slate-800/40 rounded-3xl border border-slate-700 border-dashed">
        <div class="text-3xl mb-2">🖼️</div>
        <h3 class="text-sm font-bold text-white">등록된 빌보드 2가 없습니다.</h3>
        <p class="text-xs text-slate-400 mt-1">'원스톱 의료 접근 & 환자 종합 센터' 상단에 노출될 배너를 추가하세요.</p>
        <button onclick="openBillboard2Modal()" class="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs">
          + 새 빌보드 2 추가
        </button>
      </div>`;
    return;
  }

  container.innerHTML = state.billboards2.map(b => {
    const isVid = b.mediaType === 'video' || (b.mediaUrl && (/\.(mp4|webm|mov|ogg|m4v)($|\?)/i.test(b.mediaUrl) || b.mediaUrl.startsWith('data:video') || b.mediaUrl.includes('/uploads/videos/')));
    return `
    <div class="bg-slate-800/90 border border-slate-700/90 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between group">
      <div>
        <div class="relative h-48 bg-slate-900 overflow-hidden">
          ${isVid ? `
            <video src="${b.mediaUrl}" class="w-full h-full object-cover" muted autoplay loop playsinline></video>
            <span class="absolute top-3 right-3 bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <i class="fa-solid fa-video"></i> VIDEO
            </span>
          ` : `
            <img src="${b.mediaUrl || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80'}" alt="${b.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          `}
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          <div class="absolute top-3 left-3">
            <span class="bg-indigo-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md">
              ${b.subtitle || b.category || 'SPECIAL CAMPAIGN'}
            </span>
          </div>
          <div class="absolute bottom-3 left-3 right-3">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">순서 #${b.order || 1}</span>
            <h3 class="text-base font-extrabold text-white leading-snug line-clamp-1">${b.title}</h3>
          </div>
        </div>

        <div class="p-5 space-y-3">
          <p class="text-xs text-slate-300 leading-relaxed line-clamp-2">${b.subtitle || ''}</p>
          <div class="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/60">
            <span class="flex items-center gap-1.5">
              <i class="fa-solid fa-link text-indigo-400"></i>
              <span class="truncate max-w-[160px]">${b.linkUrl || '#'}</span>
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${b.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}">
              ${b.active ? '● 노출 중' : '비활성'}
            </span>
          </div>
        </div>
      </div>

      <div class="px-5 pb-5 pt-2 flex items-center justify-end gap-2 border-t border-slate-700/40">
        <button onclick="editBillboard2('${b.id}')" class="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all">
          <i class="fa-solid fa-pen-to-square"></i>
          <span>수정</span>
        </button>
        <button onclick="deleteBillboard2('${b.id}')" class="px-3.5 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all">
          <i class="fa-solid fa-trash"></i>
          <span>삭제</span>
        </button>
      </div>
    </div>
  `}).join('');
}

function openBillboard2Modal() {
  document.getElementById('form-billboard2').reset();
  document.getElementById('billboard2-id').value = '';
  document.getElementById('modal-billboard2-title').innerHTML = '<i class="fa-solid fa-images text-indigo-400"></i> <span>새 갤러리 빌보드 2 등록</span>';
  const preview = document.getElementById('billboard2-media-preview');
  if (preview) preview.classList.add('hidden');
  document.getElementById('modal-billboard2').classList.remove('hidden');
}

function editBillboard2(id) {
  const b = state.billboards2.find(item => item.id === id);
  if (!b) return;

  document.getElementById('billboard2-id').value = b.id;
  document.getElementById('billboard2-title-input').value = b.title || '';
  document.getElementById('billboard2-order-input').value = b.order || 1;
  document.getElementById('billboard2-subtitle-input').value = b.subtitle || '';
  document.getElementById('billboard2-media-input').value = b.mediaUrl || '';
  document.getElementById('billboard2-linkurl-input').value = b.linkUrl || '/tool';
  const linkTextEl = document.getElementById('billboard2-linktext-input-2') || document.getElementById('billboard2-linktext-input');
  if (linkTextEl) linkTextEl.value = b.linkText || '환자도우미 바로가기 →';
  document.getElementById('billboard2-active-input').checked = b.active !== false;

  const preview = document.getElementById('billboard2-media-preview');
  if (preview) {
    if (b.mediaUrl) {
      const isVid = b.mediaType === 'video' || (/\.(mp4|webm|mov|ogg|m4v)($|\?)/i.test(b.mediaUrl) || b.mediaUrl.startsWith('data:video') || b.mediaUrl.includes('/uploads/videos/'));
      if (isVid) {
        preview.innerHTML = `<video src="${b.mediaUrl}" class="w-full h-full object-cover" controls playsinline></video>`;
      } else {
        preview.innerHTML = `<img src="${b.mediaUrl}" class="w-full h-full object-cover">`;
      }
      preview.classList.remove('hidden');
    } else {
      preview.classList.add('hidden');
    }
  }

  document.getElementById('modal-billboard2-title').innerHTML = '<i class="fa-solid fa-pen-to-square text-indigo-400"></i> <span>갤러리 빌보드 2 수정</span>';
  document.getElementById('modal-billboard2').classList.remove('hidden');
}

async function handleSaveBillboard2(e) {
  e.preventDefault();
  const id = document.getElementById('billboard2-id').value;
  const isEdit = Boolean(id);
  const mediaUrl = document.getElementById('billboard2-media-input').value.trim();
  const isVid = /\.(mp4|webm|mov|ogg|m4v)($|\?)/i.test(mediaUrl) || mediaUrl.startsWith('data:video') || mediaUrl.includes('/uploads/videos/');
  const linkTextEl = document.getElementById('billboard2-linktext-input-2') || document.getElementById('billboard2-linktext-input');

  const payload = {
    id: id,
    title: document.getElementById('billboard2-title-input').value,
    category: 'SPECIAL CAMPAIGN',
    order: parseInt(document.getElementById('billboard2-order-input').value) || 1,
    subtitle: document.getElementById('billboard2-subtitle-input').value,
    mediaUrl: mediaUrl,
    mediaType: isVid ? 'video' : 'image',
    linkUrl: document.getElementById('billboard2-linkurl-input').value,
    linkText: linkTextEl ? linkTextEl.value : '자세히 보기 →',
    active: document.getElementById('billboard2-active-input').checked
  };

  try {
    const res = await fetch('/api/billboards2.php', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      showToast(isEdit ? '빌보드 2가 수정되었습니다.' : '새 빌보드 2가 등록되었습니다.');
      closeModal('modal-billboard2');
      fetchAllData();
    } else {
      showToast(data.error || '저장에 실패했습니다.', false);
    }
  } catch (err) {
    showToast('서버 오류가 발생했습니다.', false);
  }
}
async function deleteBillboard2(id) {
  if (!confirm('이 갤러리 빌보드 2를 삭제하시겠습니까?')) return;
  try {
    const res = await fetch(`/api/billboards2.php?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('빌보드 2가 삭제되었습니다.');
      fetchAllData();
    } else {
      showToast(data.error || '삭제 실패', false);
    }
  } catch (err) {
    showToast('통신 오류', false);
  }
}

// =========================================================
// MEDICAL VIDEOS (의학비디오뉴스)
// =========================================================
function renderVideos() {
  // Category datalist & buttons
  const catFilters = document.getElementById('video-category-filters');
  const catList = document.getElementById('video-categories-datalist');
  const cats = ['전체', ...(state.categories.videos || [])];

  catFilters.innerHTML = cats.map(c => `
    <button onclick="setVideoFilter('${c}')" class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
      state.videoFilter === c ? 'bg-red-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
    }">${c}</button>
  `).join('');

  catList.innerHTML = (state.categories.videos || []).map(c => `<option value="${c}"></option>`).join('');

  const container = document.getElementById('videos-grid');
  const filtered = state.videoFilter === '전체' ? state.videos : state.videos.filter(v => v.category === state.videoFilter);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 bg-slate-800/40 rounded-3xl border border-slate-700 border-dashed">
        <div class="text-3xl mb-2">🎬</div>
        <h3 class="text-sm font-bold text-white">등록된 의학비디오가 없습니다.</h3>
        <p class="text-xs text-slate-400 mt-1">새 의학비디오를 등록하세요.</p>
        <button onclick="openVideoModal()" class="mt-4 bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-xs">
          + 새 의학비디오 등록
        </button>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(v => `
    <div class="bg-slate-800/90 border border-slate-700/90 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between group">
      <div>
        <div class="relative aspect-video bg-slate-900 overflow-hidden">
          <img src="${v.thumbnail || (v.youtubeId ? `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg` : 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80')}" alt="${v.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span class="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg"><i class="fa-solid fa-play text-xs pl-0.5"></i></span>
          </div>
          <div class="absolute bottom-2 left-2 right-2 flex items-end justify-between">
            <span class="bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">${v.category}</span>
            <span class="bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded">⏱ ${v.duration || '05:00'}</span>
          </div>
        </div>

        <div class="p-5 space-y-2">
          <div class="text-[11px] text-slate-400 flex items-center gap-2">
            <span class="font-bold text-red-400">${v.category || '의학뉴스'}</span>
            <span>·</span>
            <span>⏱ ${v.duration || '10:00'}</span>
          </div>
          <h3 class="text-sm font-bold text-white leading-snug line-clamp-2">${v.title}</h3>
          <p class="text-xs text-slate-400 line-clamp-2">${v.summary || ''}</p>
        </div>
      </div>

      <div class="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-700/40">
        <span class="text-[10px] text-slate-500 font-mono">ID: ${v.youtubeId || 'Upload'}</span>
        <div class="flex items-center gap-2">
          <button onclick="editVideo('${v.id}')" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all">
            <i class="fa-solid fa-pen-to-square"></i>
            <span>수정</span>
          </button>
          <button onclick="deleteVideo('${v.id}')" class="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all">
            <i class="fa-solid fa-trash"></i>
            <span>삭제</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function setVideoFilter(cat) {
  state.videoFilter = cat;
  renderVideos();
}

function openVideoModal() {
  document.getElementById('form-video').reset();
  document.getElementById('video-id').value = '';
  document.getElementById('modal-video-title').innerHTML = '<i class="fa-solid fa-video text-red-500"></i> <span>새 의학비디오 등록</span>';
  document.getElementById('video-thumb-preview').classList.add('hidden');
  document.getElementById('modal-video').classList.remove('hidden');
}

function editVideo(id) {
  const v = state.videos.find(item => item.id === id);
  if (!v) return;

  document.getElementById('video-id').value = v.id;
  document.getElementById('video-title-input').value = v.title || '';
  document.getElementById('video-category-input').value = v.category || '';
  document.getElementById('video-youtube-input').value = v.youtubeId || '';
  document.getElementById('video-duration-input').value = v.duration || '10:00';
  document.getElementById('video-order-input').value = v.order || 1;
  document.getElementById('video-thumbnail-input').value = v.thumbnail || '';
  document.getElementById('video-fileurl-input').value = v.videoUrl || '';
  document.getElementById('video-summary-input').value = v.summary || '';
  document.getElementById('video-active-input').checked = v.active !== false;

  const preview = document.getElementById('video-thumb-preview');
  if (v.thumbnail) {
    preview.innerHTML = `<img src="${v.thumbnail}" class="w-full h-full object-cover">`;
    preview.classList.remove('hidden');
  } else {
    preview.classList.add('hidden');
  }

  document.getElementById('modal-video-title').innerHTML = '<i class="fa-solid fa-pen-to-square text-red-500"></i> <span>의학비디오 수정</span>';
  document.getElementById('modal-video').classList.remove('hidden');
}

function autoFetchYtThumb(val) {
  let ytId = val.trim();
  const match = ytId.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (match) ytId = match[1];

  if (ytId.length === 11) {
    const thumbUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
    if (!document.getElementById('video-thumbnail-input').value) {
      document.getElementById('video-thumbnail-input').value = thumbUrl;
    }
    const preview = document.getElementById('video-thumb-preview');
    preview.innerHTML = `<img src="${thumbUrl}" class="w-full h-full object-cover">`;
    preview.classList.remove('hidden');
  }
}

async function handleSaveVideo(e) {
  e.preventDefault();
  const id = document.getElementById('video-id').value;
  const isEdit = Boolean(id);

  let rawYt = document.getElementById('video-youtube-input').value.trim();
  const ytMatch = rawYt.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  const cleanYt = ytMatch ? ytMatch[1] : rawYt;

  let thumb = document.getElementById('video-thumbnail-input').value.trim();
  if (!thumb && cleanYt && cleanYt.length === 11) {
    thumb = `https://img.youtube.com/vi/${cleanYt}/maxresdefault.jpg`;
  }

  const payload = {
    id: id,
    title: document.getElementById('video-title-input').value,
    category: document.getElementById('video-category-input').value || '만성질환 & 당뇨',
    youtubeId: cleanYt,
    duration: document.getElementById('video-duration-input').value || '10:00',
    order: parseInt(document.getElementById('video-order-input').value) || 1,
    thumbnail: thumb,
    videoUrl: document.getElementById('video-fileurl-input').value,
    summary: document.getElementById('video-summary-input').value,
    active: document.getElementById('video-active-input').checked
  };

  try {
    const res = await fetch('/api/videos.php', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      showToast(isEdit ? '의학비디오가 수정되었습니다.' : '새 의학비디오가 등록되었습니다.');
      closeModal('modal-video');
      fetchAllData();
    } else {
      showToast(data.error || '저장 실패', false);
    }
  } catch (err) {
    showToast('통신 오류가 발생했습니다.', false);
  }
}

async function deleteVideo(id) {
  if (!confirm('이 의학비디오를 삭제하시겠습니까?')) return;
  try {
    const res = await fetch(`/api/videos.php?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('의학비디오가 삭제되었습니다.');
      fetchAllData();
    } else {
      showToast(data.error || '삭제 실패', false);
    }
  } catch (err) {
    showToast('통신 오류', false);
  }
}

// =========================================================
// NEWS & BLOG POSTS
// =========================================================
function renderPosts() {
  const catFilters = document.getElementById('post-category-filters');
  const catList = document.getElementById('post-categories-datalist');
  const defaultCats = ['의료칼럼', 'recall(리콜)', 'health&wellness', '의료보험', '한인건강 특집', '한인커뮤니티 뉴스', '의학뉴스'];
  const cats = ['전체', ...defaultCats];

  catFilters.innerHTML = cats.map(c => `
    <button onclick="setPostFilter('${c}')" class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
      state.postFilter === c ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
    }">${c}</button>
  `).join('');

  catList.innerHTML = defaultCats.map(c => `<option value="${c}"></option>`).join('');

  const container = document.getElementById('posts-grid');
  let filtered = state.posts;

  if (state.postFilter !== '전체') {
    filtered = filtered.filter(p => {
      const pCat = (p.category || '').toLowerCase().replace(/\s+/g, '');
      const fCat = state.postFilter.toLowerCase().replace(/\s+/g, '');
      if (fCat === '의료칼럼') return pCat.includes('의료칼럼') || pCat.includes('의사칼럼') || Boolean(p.isDoctorColumn);
      if (fCat.includes('recall') || fCat.includes('리콜')) return pCat.includes('recall') || pCat.includes('리콜');
      if (fCat.includes('health') || fCat.includes('wellness')) return pCat.includes('health') || pCat.includes('wellness');
      if (fCat.includes('의료보험')) return pCat.includes('의료보험') || pCat.includes('medicare') || pCat.includes('aca') || pCat.includes('보험');
      if (fCat.includes('한인건강')) return pCat.includes('한인건강') || pCat.includes('특집');
      if (fCat.includes('한인커뮤니티')) return pCat.includes('한인커뮤니티') || pCat.includes('커뮤니티');
      if (fCat.includes('의학뉴스')) return pCat.includes('의학뉴스') || pCat.includes('의학');
      return (p.category || '') === state.postFilter;
    });
  }
  if (state.postSearch) {
    const q = state.postSearch.toLowerCase();
    filtered = filtered.filter(p => (p.title || '').toLowerCase().includes(q) || (p.excerpt || '').toLowerCase().includes(q));
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 bg-slate-800/40 rounded-3xl border border-slate-700 border-dashed">
        <div class="text-3xl mb-2">📰</div>
        <h3 class="text-sm font-bold text-white">등록된 뉴스 기사가 없습니다.</h3>
        <p class="text-xs text-slate-400 mt-1">새 건강 뉴스를 작성하세요.</p>
        <button onclick="openPostModal()" class="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs">
          + 새 기사 작성
        </button>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const isTop = Boolean(p.isTopStory && p.isTopStory !== 'false' && p.isTopStory !== 0);
    const isLive = Boolean(p.isLiveUpdate === true || p.isLiveUpdate === 'true' || p.isLiveUpdate === 1 || p.isLiveUpdate === '1');
    const isDoc = Boolean(p.isDoctorColumn === true || p.isDoctorColumn === 'true' || p.isDoctorColumn === 1 || p.isDoctorColumn === '1');
    const isRep = Boolean(p.isPolicyReport === true || p.isPolicyReport === 'true' || p.isPolicyReport === 1 || p.isPolicyReport === '1' || (p.isPolicyReport !== false && p.isPolicyReport !== 'false' && (p.category === 'recall(리콜)' || p.category === '리콜(Recalls and Food Safety)' || (p.category && (p.category.includes('리콜') || p.category.toLowerCase().includes('recall'))))));

    return `
    <div class="bg-slate-800/90 border border-slate-700/90 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between group">
      <div>
        <div class="relative h-48 bg-slate-900 overflow-hidden">
          <img src="${p.coverImage || 'https://images.unsplash.com/photo-1628771065117-74ccb5690668?w=800&q=80'}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          
          <!-- Category pill (Top-Left) -->
          <div class="absolute top-2.5 left-2.5">
            <span class="bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-full border border-slate-700 shadow-md">${p.category}</span>
          </div>

          <!-- Section Exposure Badges (Top-Right / Wrap) -->
          <div class="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
            ${isTop ? '<span class="bg-red-600/95 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md border border-red-400/60 animate-pulse flex items-center gap-1">🔥 TOP STORY</span>' : ''}
            ${isLive ? '<span class="bg-blue-600/95 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-md border border-blue-400/60 flex items-center gap-1">⚡ 실시간 뉴스</span>' : ''}
            ${isDoc ? '<span class="bg-rose-600/95 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-md border border-rose-400/60 flex items-center gap-1">🩺 의료칼럼</span>' : ''}
            ${isRep ? '<span class="bg-emerald-600/95 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-md border border-emerald-400/60 flex items-center gap-1">📋 리콜(Recalls)</span>' : ''}
          </div>
        </div>

        <div class="p-5 space-y-2.5">
          <div class="flex items-center gap-2 text-[11px] text-slate-400">
            <span>${p.date || '2026.08'}</span>
            <span>·</span>
            <span>⏱ ${p.readTime || '3분'}</span>
            <span>·</span>
            <span>${p.author || '편집부'}</span>
          </div>
          <h3 class="text-sm font-bold text-white leading-snug line-clamp-2">${p.title}</h3>
          <p class="text-xs text-slate-300 line-clamp-2">${p.excerpt || ''}</p>

          <!-- Exposure Status Indicators Row -->
          <div class="flex flex-wrap items-center gap-1 pt-2 border-t border-slate-700/50 text-[10px]">
            <span class="text-slate-400 font-bold mr-0.5">홈 노출:</span>
            ${isTop ? '<span class="text-amber-300 bg-amber-950/80 border border-amber-500/40 px-1.5 py-0.5 rounded font-bold">🔥 헤드라인</span>' : ''}
            ${isLive ? '<span class="text-blue-300 bg-blue-950/80 border border-blue-500/40 px-1.5 py-0.5 rounded font-bold">⚡ 주요뉴스</span>' : ''}
            ${isDoc ? '<span class="text-rose-300 bg-rose-950/80 border border-rose-500/40 px-1.5 py-0.5 rounded font-bold">🩺 의료칼럼</span>' : ''}
            ${isRep ? '<span class="text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.5 rounded font-bold">📋 리콜/리포트</span>' : ''}
            ${(!isTop && !isLive && !isDoc && !isRep) ? '<span class="text-slate-500 bg-slate-900/60 px-1.5 py-0.5 rounded">홈 미노출 (블로그 전용)</span>' : ''}
          </div>
        </div>
      </div>

      <div class="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-700/40">
        <a href="/blog/${p.slug || p.id}" target="_blank" class="text-[11px] text-blue-400 hover:text-blue-300 font-mono truncate max-w-[120px] flex items-center gap-1 hover:underline">
          <span>/${p.slug || ''}</span>
          <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
        </a>
        <div class="flex items-center gap-2">
          <a href="/blog/${p.slug || p.id}" target="_blank" class="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all">
            <span>보기 ↗</span>
          </a>
          <button onclick="editPost('${p.id}')" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all">
            <i class="fa-solid fa-pen-to-square"></i>
            <span>수정</span>
          </button>
          <button onclick="deletePost('${p.id}')" class="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all">
            <i class="fa-solid fa-trash"></i>
            <span>삭제</span>
          </button>
        </div>
      </div>
    </div>
  `;
  }).join('');
}

function setPostFilter(cat) {
  state.postFilter = cat;
  renderPosts();
}

function handlePostSearch(q) {
  state.postSearch = q;
  renderPosts();
}

// State for multiple images in current post modal
let currentPostImages = [];

function handleExposureCheckboxChange(input) {
  const currentId = document.getElementById('post-id')?.value || null;
  const posts = state.posts || [];

  let liveCount = 0;
  let doctorCount = 0;
  let reportCount = 0;

  posts.forEach(p => {
    if (currentId && (p.id === currentId || (p.slug && p.slug === currentId))) return;
    if (p.isLiveUpdate === true || p.isLiveUpdate === 'true' || p.isLiveUpdate === 1 || p.isLiveUpdate === '1') liveCount++;
    if (p.isDoctorColumn === true || p.isDoctorColumn === 'true' || p.isDoctorColumn === 1 || p.isDoctorColumn === '1') doctorCount++;
    if (p.isPolicyReport === true || p.isPolicyReport === 'true' || p.isPolicyReport === 1 || p.isPolicyReport === '1') reportCount++;
  });

  if (input.id === 'post-liveupdate-input' && input.checked && liveCount >= 6) {
    input.checked = false;
    showToast('실시간 주요 뉴스 슬롯이 최대 6개로 꽉 찼습니다.', false);
  }
  if (input.id === 'post-doctorcolumn-input' && input.checked && doctorCount >= 10) {
    input.checked = false;
    showToast('의료칼럼 슬롯이 최대 10개로 꽉 찼습니다.', false);
  }
  if (input.id === 'post-policyreport-input' && input.checked && reportCount >= 4) {
    input.checked = false;
    showToast('리콜(Recalls and Food Safety) 슬롯이 최대 4개로 꽉 찼습니다.', false);
  }

  updateExposureCheckboxLimits(currentId);
}

function selectPostCategory(cat) {
  const inp = document.getElementById('post-category-input');
  if (inp) {
    inp.value = cat;
    inp.focus();
  }
  const currentId = document.getElementById('post-id')?.value || null;
  const dcCheck = document.getElementById('post-doctorcolumn-input');
  if (dcCheck && (cat === '의료칼럼' || cat === '의사칼럼')) {
    dcCheck.checked = true;
  }
  const prCheck = document.getElementById('post-policyreport-input');
  if (prCheck && (cat === 'recall(리콜)' || cat.includes('리콜') || cat.includes('Recalls'))) {
    prCheck.checked = true;
  }
  updateExposureCheckboxLimits(currentId);
}

function updateExposureCheckboxLimits(currentEditingPostId) {
  const posts = state.posts || [];
  
  // Count how many OTHER posts currently have each flag checked
  let liveCount = 0;
  let doctorCount = 0;
  let reportCount = 0;

  posts.forEach(p => {
    if (currentEditingPostId && (p.id === currentEditingPostId || (p.slug && p.slug === currentEditingPostId))) return;
    
    if (p.isLiveUpdate === true || p.isLiveUpdate === 'true' || p.isLiveUpdate === 1 || p.isLiveUpdate === '1') {
      liveCount++;
    }
    if (p.isDoctorColumn === true || p.isDoctorColumn === 'true' || p.isDoctorColumn === 1 || p.isDoctorColumn === '1') {
      doctorCount++;
    }
    if (p.isPolicyReport === true || p.isPolicyReport === 'true' || p.isPolicyReport === 1 || p.isPolicyReport === '1') {
      reportCount++;
    }
  });

  const liveInput = document.getElementById('post-liveupdate-input');
  const liveLabel = document.querySelector('label[for="post-liveupdate-input"]');
  const doctorInput = document.getElementById('post-doctorcolumn-input');
  const doctorLabel = document.querySelector('label[for="post-doctorcolumn-input"]');
  const reportInput = document.getElementById('post-policyreport-input');
  const reportLabel = document.querySelector('label[for="post-policyreport-input"]');

  // 실시간 주요 뉴스 (Max 6)
  if (liveInput && liveLabel) {
    if (liveCount >= 6 && !liveInput.checked) {
      liveInput.checked = false;
      liveInput.disabled = true;
      liveInput.parentElement.classList.add('opacity-40', 'cursor-not-allowed');
      liveLabel.innerHTML = '실시간 주요 뉴스 노출 <span class="text-xs text-amber-400 font-bold block sm:inline">(최대 6개: 슬롯 꽉 참)</span>';
    } else if (liveCount >= 6 && liveInput.checked) {
      liveInput.disabled = false;
      liveInput.parentElement.classList.remove('opacity-40', 'cursor-not-allowed');
      liveLabel.innerHTML = '실시간 주요 뉴스 노출 <span class="text-xs text-blue-400 font-bold">(6/6개)</span>';
    } else {
      liveInput.disabled = false;
      liveInput.parentElement.classList.remove('opacity-40', 'cursor-not-allowed');
      const currentVal = liveInput.checked ? liveCount + 1 : liveCount;
      liveLabel.innerHTML = '실시간 주요 뉴스 노출 <span class="text-xs text-blue-400 font-bold">(' + currentVal + '/6개)</span>';
    }
  }

  // 의료칼럼 TOP 10 (Max 10)
  if (doctorInput && doctorLabel) {
    if (doctorCount >= 10 && !doctorInput.checked) {
      doctorInput.checked = false;
      doctorInput.disabled = true;
      doctorInput.parentElement.classList.add('opacity-40', 'cursor-not-allowed');
      doctorLabel.innerHTML = '🩺 TOP 10 의료칼럼 노출 <span class="text-xs text-amber-400 font-bold block sm:inline">(최대 10개: 슬롯 꽉 참)</span>';
    } else if (doctorCount >= 10 && doctorInput.checked) {
      doctorInput.disabled = false;
      doctorInput.parentElement.classList.remove('opacity-40', 'cursor-not-allowed');
      doctorLabel.innerHTML = '🩺 TOP 10 의료칼럼 노출 <span class="text-xs text-red-400 font-bold">(10/10개)</span>';
    } else {
      doctorInput.disabled = false;
      doctorInput.parentElement.classList.remove('opacity-40', 'cursor-not-allowed');
      const currentVal = doctorInput.checked ? doctorCount + 1 : doctorCount;
      doctorLabel.innerHTML = '🩺 TOP 10 의료칼럼 노출 <span class="text-xs text-red-400 font-bold">(' + currentVal + '/10개)</span>';
    }
  }

  // 리콜(Recalls and Food Safety) (Max 4 slots on front page)
  if (reportInput && reportLabel) {
    if (reportCount >= 4 && !reportInput.checked) {
      reportInput.checked = false;
      reportInput.disabled = true;
      reportInput.parentElement.classList.add('opacity-40', 'cursor-not-allowed');
      reportLabel.innerHTML = '📋 리콜(Recalls and Food Safety) <span class="text-xs text-amber-400 font-bold block sm:inline">(메인 4개 슬롯 꽉 참)</span>';
    } else if (reportCount >= 4 && reportInput.checked) {
      reportInput.disabled = false;
      reportInput.parentElement.classList.remove('opacity-40', 'cursor-not-allowed');
      reportLabel.innerHTML = '📋 리콜(Recalls and Food Safety) <span class="text-xs text-emerald-400 font-bold">(4/4개)</span>';
    } else {
      reportInput.disabled = false;
      reportInput.parentElement.classList.remove('opacity-40', 'cursor-not-allowed');
      const currentVal = reportInput.checked ? reportCount + 1 : reportCount;
      reportLabel.innerHTML = '📋 리콜(Recalls and Food Safety) <span class="text-xs text-emerald-400 font-bold">(' + currentVal + '/4개)</span>';
    }
  }
}

function openPostModal() {
  document.getElementById('form-post').reset();
  document.getElementById('post-id').value = '';
  document.getElementById('post-date-input').value = new Date().toISOString().split('T')[0];
  
  const posts = state.posts || [];
  const liveCount = posts.filter(p => p.isLiveUpdate === true || p.isLiveUpdate === 'true' || p.isLiveUpdate === 1 || p.isLiveUpdate === '1').length;
  const reportCount = posts.filter(p => p.isPolicyReport === true || p.isPolicyReport === 'true' || p.isPolicyReport === 1 || p.isPolicyReport === '1').length;
  
  const dcCheck = document.getElementById('post-doctorcolumn-input');
  if (dcCheck) dcCheck.checked = false;
  
  const topCheck = document.getElementById('post-topstory-input');
  if (topCheck) topCheck.checked = false;

  const liveCheck = document.getElementById('post-liveupdate-input');
  if (liveCheck) {
    liveCheck.checked = (liveCount < 6);
  }
  
  const prCheck = document.getElementById('post-policyreport-input');
  if (prCheck) {
    prCheck.checked = false;
  }
  
  document.getElementById('modal-post-title').innerHTML = '<i class="fa-solid fa-pen-nib text-emerald-400"></i> <span>새 건강 뉴스 기사 작성</span>';
  
  updateExposureCheckboxLimits(null);

  currentPostImages = [];
  renderPostImagesGrid();

  const previewContainer = document.getElementById('post-content-preview-container');
  if (previewContainer) previewContainer.classList.add('hidden');
  const previewToggleText = document.getElementById('preview-toggle-text');
  if (previewToggleText) previewToggleText.textContent = '미리보기';

  document.getElementById('modal-post').classList.remove('hidden');
}

function insertPostFormat(type) {
  const textarea = document.getElementById('post-content-input');
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  let replacement = '';
  
  switch(type) {
    case 'bold':
      replacement = selectedText ? `**${selectedText}**` : `**굵은 텍스트**`;
      break;
    case 'h2':
      replacement = selectedText ? `\n\n## ${selectedText}\n` : `\n\n## 큰 소제목\n`;
      break;
    case 'h3':
      replacement = selectedText ? `\n\n### ${selectedText}\n` : `\n\n### 중간 소제목\n`;
      break;
    case 'large':
      replacement = selectedText ? `++${selectedText}++` : `++글자 크게 강조++`;
      break;
    case 'small':
      replacement = selectedText ? `--${selectedText}--` : `--작은 설명 문구 및 출처 참고사항--`;
      break;
    case 'list':
      if (selectedText) {
        replacement = '\n' + selectedText.split('\n').map(line => `- ${line}`).join('\n') + '\n';
      } else {
        replacement = `\n- 목록 항목 1\n- 목록 항목 2\n`;
      }
      break;
    case 'quote':
      replacement = selectedText ? `\n> ${selectedText}\n` : `\n> 인용 문구를 입력하세요.\n`;
      break;
    case 'box':
      replacement = selectedText ? `\n\n:::box\n${selectedText}\n:::\n\n` : `\n\n:::box\n📢 [특별 안내 / 중요 메시지]\n여기에 강조할 특별 안내 문구 또는 중요 공지 내용을 입력하세요. 분량에 맞게 박스가 유연하게 자동 확장됩니다.\n:::\n\n`;
      break;
    case 'mark':
      replacement = selectedText ? `==${selectedText}==` : `==형광펜 강조==`;
      break;
    default:
      return;
  }
  
  textarea.setRangeText(replacement, start, end, 'end');
  textarea.focus();
  updatePostContentPreview();
}

let selectedPickerPhotoUrl = '';

function openPhotoPickerModal() {
  const grid = document.getElementById('photo-picker-grid');
  const urlInp = document.getElementById('photo-picker-url-input');
  const capInp = document.getElementById('photo-picker-caption-input');
  
  if (capInp) capInp.value = '';
  if (urlInp) urlInp.value = currentPostImages[0] || '';
  selectedPickerPhotoUrl = currentPostImages[0] || '';

  if (grid) {
    if (currentPostImages.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-4 text-center text-slate-500 text-xs">
          등록된 사진이 없습니다. 아래 URL 직접 입력 또는 상단에서 사진을 추가하세요.
        </div>
      `;
    } else {
      grid.innerHTML = currentPostImages.map((url, idx) => {
        const isSelected = idx === 0;
        return `
          <div onclick="selectPhotoPickerImage(${idx}, '${escapeHtml(url)}')" id="photo-picker-item-${idx}" class="photo-picker-item relative aspect-4/3 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/40' : 'border-slate-800 hover:border-slate-600'}">
            <img src="${escapeHtml(url)}" alt="사진 #${idx + 1}" class="w-full h-full object-cover">
            <span class="absolute bottom-1 left-1 bg-black/75 text-white text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
              ${idx === 0 ? '대표' : '사진 #' + (idx + 1)}
            </span>
          </div>
        `;
      }).join('');
    }
  }

  document.getElementById('modal-photo-picker').classList.remove('hidden');
}

function selectPhotoPickerImage(idx, url) {
  selectedPickerPhotoUrl = url;
  const urlInp = document.getElementById('photo-picker-url-input');
  if (urlInp) urlInp.value = url;

  document.querySelectorAll('.photo-picker-item').forEach((el, i) => {
    if (i === idx) {
      el.classList.add('border-emerald-500', 'ring-2', 'ring-emerald-500/40');
      el.classList.remove('border-slate-800');
    } else {
      el.classList.remove('border-emerald-500', 'ring-2', 'ring-emerald-500/40');
      el.classList.add('border-slate-800');
    }
  });
}

function confirmInsertPhotoBox() {
  const urlInp = document.getElementById('photo-picker-url-input');
  const capInp = document.getElementById('photo-picker-caption-input');
  const url = (urlInp && urlInp.value) ? urlInp.value.trim() : selectedPickerPhotoUrl;

  if (!url) {
    showToast('삽입할 사진을 선택하거나 이미지 URL을 입력해주세요.', false);
    return;
  }

  const caption = (capInp && capInp.value) ? capInp.value.trim() : '';
  const textarea = document.getElementById('post-content-input');
  if (textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const tag = `\n\n![${caption}](${url})\n\n`;
    textarea.setRangeText(tag, start, end, 'end');
    textarea.focus();
    updatePostContentPreview();
  }

  closeModal('modal-photo-picker');
  showToast('본문 커서 위치에 사진 박스가 삽입되었습니다.');
}

function insertImageToContent(url, defaultCaption = '관련 보도 사진') {
  const textarea = document.getElementById('post-content-input');
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const caption = prompt('본문에 삽입할 사진의 캡션/설명을 입력하세요 (선택 사항):', defaultCaption) || defaultCaption;
  const tag = `\n\n![${caption}](${url})\n\n`;
  textarea.setRangeText(tag, start, end, 'end');
  textarea.focus();
  updatePostContentPreview();
  showToast('본문 커서 위치에 사진 태그가 삽입되었습니다.');
}

function updatePostContentPreview() {
  const container = document.getElementById('post-content-preview-container');
  if (!container || container.classList.contains('hidden')) return;
  const text = document.getElementById('post-content-input').value || '';
  const previewDiv = document.getElementById('post-content-preview');
  if (previewDiv) {
    previewDiv.innerHTML = renderMarkdownToHtml(text);
  }
}

function togglePostContentPreview() {
  const container = document.getElementById('post-content-preview-container');
  const toggleText = document.getElementById('preview-toggle-text');
  if (!container) return;
  if (container.classList.contains('hidden')) {
    container.classList.remove('hidden');
    if (toggleText) toggleText.textContent = '미리보기 닫기';
    updatePostContentPreview();
  } else {
    container.classList.add('hidden');
    if (toggleText) toggleText.textContent = '미리보기';
  }
}

function renderMarkdownToHtml(text) {
  if (!text) return '<p class="text-slate-500 italic text-xs">내용을 입력하면 여기에 실시간으로 렌더링됩니다.</p>';
  let html = text.replace(/\r\n/g, '\n');
  
  // Special Message Box :::box ... :::
  html = html.replace(/:::box([\s\S]*?):::/gi, (match, inner) => {
    return `<div class="my-5 p-5 rounded-2xl bg-gradient-to-br from-indigo-950/90 to-slate-900 border-2 border-indigo-500/60 shadow-lg text-slate-100"><div class="flex items-center gap-2 mb-2 font-bold text-indigo-300 text-xs"><i class="fa-solid fa-box-archive"></i> <span>특별 안내 / 중요 메시지 박스</span></div><div class="leading-relaxed text-sm text-slate-200">${inner.trim().replace(/\n/g, '<br>')}</div></div>`;
  });

  // Resolve shorthand [사진1], [사진2: 캡션] tags
  html = html.replace(/\[사진\s*([0-9]+)(?:\s*:\s*([^\]]+))?\]/gi, (match, numStr, caption) => {
    const idx = parseInt(numStr, 10) - 1;
    const url = currentPostImages[idx] || '';
    const cap = caption ? caption.trim() : `사진 #${numStr}`;
    if (!url) return '';
    return `![${cap}](${url})`;
  });

  // In-text Images ![caption](url)
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (match, caption, url) => {
    return `<div class="my-5 mx-auto max-w-md text-center flex flex-col items-center"><div class="rounded-xl overflow-hidden shadow-md border border-slate-700 bg-slate-950 w-full"><img src="${url}" alt="${caption}" class="w-full h-auto max-h-60 object-cover mx-auto"></div>${caption ? `<p class="text-[11px] text-slate-400 mt-1.5 font-medium text-center">▲ ${caption}</p>` : ''}</div>`;
  });

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-base sm:text-lg font-bold text-blue-400 mt-4 mb-2 font-serif">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg sm:text-xl font-bold text-emerald-400 mt-5 mb-2 font-serif pb-1 border-b border-slate-700">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl sm:text-2xl font-bold text-white mt-6 mb-3 font-serif pb-1 border-b border-slate-700">$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong class="text-white font-bold">$1</strong>');
  
  // Highlight ==text==
  html = html.replace(/==(.+?)==/g, '<mark style="background-color: #fef08a; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-weight: bold;">$1</mark>');
  
  // Large text ++text++
  html = html.replace(/\+\+(.+?)\+\+/g, '<span class="text-base sm:text-lg font-bold text-amber-300">$1</span>');

  // Small text --text--
  html = html.replace(/--(.+?)--/g, '<span class="text-xs text-slate-400 font-normal">$1</span>');

  // Quotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-emerald-500 pl-3 py-2 my-3 bg-slate-800/90 rounded-r-xl text-slate-200 italic font-medium">$1</blockquote>');
  
  // Bullet lists
  html = html.replace(/^[-*•] (.*$)/gim, '<div class="flex items-start gap-2.5 text-slate-300 pl-2 my-1"><span class="text-red-500 font-bold leading-none mt-1">•</span><span class="flex-1">$1</span></div>');
  
  // Paragraphs
  const parts = html.split('\n\n');
  html = parts.map(part => {
    part = part.trim();
    if (!part) return '';
    if (part.startsWith('<h1') || part.startsWith('<h2') || part.startsWith('<h3') || part.startsWith('<blockquote') || part.startsWith('<div') || part.startsWith('<figure')) {
      return part.replace(/\n/g, '<br>');
    }
    return `<p class="leading-relaxed text-slate-300">${part.replace(/\n/g, '<br>')}</p>`;
  }).join('');
  
  return html;
}

function editPost(id) {
  const p = state.posts.find(item => item.id === id);
  if (!p) return;

  document.getElementById('post-id').value = p.id;
  document.getElementById('post-title-input').value = p.title || '';
  document.getElementById('post-category-input').value = p.category || '';
  document.getElementById('post-date-input').value = p.date || '';
  document.getElementById('post-author-input').value = p.author || '편집부';
  document.getElementById('post-videourl-input').value = p.videoUrl || '';
  document.getElementById('post-excerpt-input').value = p.excerpt || '';
  document.getElementById('post-content-input').value = p.content || '';
  document.getElementById('post-topstory-input').checked = Boolean(p.isTopStory && p.isTopStory !== 'false' && p.isTopStory !== 0);
  document.getElementById('post-liveupdate-input').checked = Boolean(p.isLiveUpdate === true || p.isLiveUpdate === 'true' || p.isLiveUpdate === 1 || p.isLiveUpdate === '1');
  const dcCheck = document.getElementById('post-doctorcolumn-input');
  if (dcCheck) {
    dcCheck.checked = Boolean(p.isDoctorColumn === true || p.isDoctorColumn === 'true' || p.isDoctorColumn === 1 || p.isDoctorColumn === '1');
  }
  const prCheck = document.getElementById('post-policyreport-input');
  if (prCheck) {
    prCheck.checked = Boolean(p.isPolicyReport === true || p.isPolicyReport === 'true' || p.isPolicyReport === 1 || p.isPolicyReport === '1' || (p.isPolicyReport !== false && p.isPolicyReport !== 'false' && (p.category === 'recall(리콜)' || p.category === '리콜(Recalls and Food Safety)' || (p.category && (p.category.includes('리콜') || p.category.toLowerCase().includes('recall'))))));
  }

  updateExposureCheckboxLimits(p.id);

  // Initialize multiple images from post
  let imgs = [];
  if (Array.isArray(p.images) && p.images.length > 0) {
    imgs = [...p.images];
  } else if (p.coverImage) {
    imgs = [p.coverImage];
  }
  currentPostImages = imgs;
  renderPostImagesGrid();

  const previewContainer = document.getElementById('post-content-preview-container');
  if (previewContainer) previewContainer.classList.add('hidden');
  const previewToggleText = document.getElementById('preview-toggle-text');
  if (previewToggleText) previewToggleText.textContent = '미리보기';

  document.getElementById('modal-post-title').innerHTML = '<i class="fa-solid fa-pen-to-square text-emerald-400"></i> <span>건강 뉴스 기사 수정</span>';
  document.getElementById('modal-post').classList.remove('hidden');
}

function renderPostImagesGrid() {
  const grid = document.getElementById('post-images-manager-grid');
  if (!grid) return;

  if (currentPostImages.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-6 text-center text-slate-500 text-xs bg-slate-900/60 rounded-2xl border border-slate-800 border-dashed">
        <i class="fa-regular fa-image text-lg mb-1 block"></i>
        <span>등록된 사진이 없습니다. 상단 [사진 일괄 추가] 또는 [URL 추가] 버튼을 눌러 사진을 등록하세요.</span>
      </div>
    `;
    const coverInput = document.getElementById('post-cover-input');
    if (coverInput) coverInput.value = '';
    return;
  }

  // Set the 1st image as coverImage
  const coverInput = document.getElementById('post-cover-input');
  if (coverInput) coverInput.value = currentPostImages[0] || '';

  grid.innerHTML = currentPostImages.map((url, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === currentPostImages.length - 1;

    return `
      <div class="relative group bg-slate-900 rounded-2xl border overflow-hidden shadow-md flex flex-col justify-between transition-all ${
        isFirst ? 'border-emerald-500/80 ring-2 ring-emerald-500/30' : 'border-slate-800 hover:border-slate-700'
      }">
        <div class="relative aspect-4/3 bg-slate-950 overflow-hidden">
          <img src="${escapeHtml(url)}" alt="기사 사진 #${idx + 1}" class="w-full h-full object-cover">
          
          <!-- Badge -->
          <div class="absolute top-2 left-2">
            ${isFirst ? `
              <span class="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <i class="fa-solid fa-star text-[9px]"></i> 1번째: 대표 썸네일
              </span>
            ` : `
              <span class="bg-blue-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md">
                ${idx + 1}번째: 본문 사진
              </span>
            `}
          </div>

          <!-- Delete Action -->
          <button type="button" onclick="removePostImage(${idx})" 
            class="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center text-[10px] shadow-md transition-all hover:scale-110 cursor-pointer"
            title="사진 삭제">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Controls (Reorder) -->
        <div class="p-2 bg-slate-950/80 flex items-center justify-between gap-1 border-t border-slate-800 text-[11px]">
          <span class="text-slate-400 font-mono text-[10px] truncate max-w-[70px]" title="${escapeHtml(url)}">
            사진 #${idx + 1}
          </span>
          <div class="flex items-center gap-1">
            ${!isFirst ? `
              <button type="button" onclick="movePostImage(${idx}, -1)" 
                class="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md text-[10px] transition-all cursor-pointer"
                title="앞으로 이동 (대표 썸네일 지정)">
                ◀ 앞으로
              </button>
            ` : ''}
            ${!isLast ? `
              <button type="button" onclick="movePostImage(${idx}, 1)" 
                class="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md text-[10px] transition-all cursor-pointer"
                title="뒤로 이동">
                뒤로 ▶
              </button>
            ` : ''}
          </div>
        </div>

        <button type="button" onclick="insertImageToContent('${escapeHtml(url)}')" class="w-full py-1.5 px-2 bg-emerald-950/80 hover:bg-emerald-600 text-emerald-300 hover:text-white border-t border-slate-800 rounded-b-2xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer">
          <i class="fa-solid fa-arrow-down-to-bracket"></i> 본문 커서에 사진 삽입
        </button>
      </div>
    `;
  }).join('');
}

function compressImageToDataUrl(file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) {
  return new Promise((resolve) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxWidth || h > maxHeight) {
          if (w / h > maxWidth / maxHeight) {
            h = Math.round((h * maxWidth) / w);
            w = maxWidth;
          } else {
            w = Math.round((w * maxHeight) / h);
            h = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        try {
          const dataUrl = canvas.toDataURL('image/webp', quality);
          resolve(dataUrl);
        } catch(err) {
          resolve(e.target.result);
        }
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

async function uploadMultiplePostImages(input) {
  if (!input.files || input.files.length === 0) return;
  const files = Array.from(input.files);
  showToast(`${files.length}개의 사진을 업로드하는 중입니다...`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload.php', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.url) {
        currentPostImages.push(data.url);
      } else {
        const dataUrl = await compressImageToDataUrl(file, 1200, 1200, 0.85);
        if (dataUrl) currentPostImages.push(dataUrl);
      }
    } catch (e) {
      console.error('Image upload error:', e);
      try {
        const dataUrl = await compressImageToDataUrl(file, 1200, 1200, 0.85);
        if (dataUrl) currentPostImages.push(dataUrl);
      } catch (err) {}
    }
  }

  showToast(`${files.length}개 사진 등록 완료!`);
  input.value = '';
  renderPostImagesGrid();
}

function addPostImageUrlManual() {
  const input = document.getElementById('post-add-image-url-input');
  if (!input) return;
  const url = input.value.trim();
  if (!url) {
    showToast('이미지 URL을 입력해주세요.', false);
    return;
  }
  currentPostImages.push(url);
  input.value = '';
  showToast('사진이 목록에 추가되었습니다.');
  renderPostImagesGrid();
}

function removePostImage(index) {
  if (index >= 0 && index < currentPostImages.length) {
    currentPostImages.splice(index, 1);
    renderPostImagesGrid();
  }
}

function movePostImage(index, direction) {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= currentPostImages.length) return;
  const temp = currentPostImages[index];
  currentPostImages[index] = currentPostImages[targetIndex];
  currentPostImages[targetIndex] = temp;
  renderPostImagesGrid();
}

async function handleSavePost(e) {
  e.preventDefault();
  const id = document.getElementById('post-id').value;
  const isEdit = Boolean(id);
  const existingPost = isEdit ? state.posts.find(p => p.id === id) : null;

  if (currentPostImages.length === 0) {
    showToast('최소 1개 이상의 기사 사진을 등록해주세요.', false);
    return;
  }

  const summaryPointsInput = document.getElementById('post-summarypoints-input');
  const rawSummaryPoints = summaryPointsInput ? (summaryPointsInput.value || '') : '';
  const summaryPoints = rawSummaryPoints ? rawSummaryPoints.split('\n').map(s => s.trim()).filter(s => s && s !== '[object Object]') : [];

  const payload = {
    id: id,
    slug: existingPost ? (existingPost.slug || id) : '',
    title: document.getElementById('post-title-input').value,
    category: document.getElementById('post-category-input').value,
    date: document.getElementById('post-date-input').value,
    author: document.getElementById('post-author-input').value,
    coverImage: currentPostImages[0] || '',
    images: currentPostImages,
    videoUrl: document.getElementById('post-videourl-input').value,
    excerpt: document.getElementById('post-excerpt-input').value,
    summaryPoints: summaryPoints,
    content: document.getElementById('post-content-input').value,
    isDoctorColumn: document.getElementById('post-doctorcolumn-input') ? document.getElementById('post-doctorcolumn-input').checked : false,
    isTopStory: document.getElementById('post-topstory-input').checked,
    isLiveUpdate: document.getElementById('post-liveupdate-input').checked,
    isPolicyReport: document.getElementById('post-policyreport-input') ? document.getElementById('post-policyreport-input').checked : false
  };

  try {
    const res = await fetch('/api/posts.php', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      showToast(isEdit ? '기사가 수정되었습니다.' : '새 기사가 발행되었습니다.');
      closeModal('modal-post');
      fetchAllData();
    } else {
      showToast(data.error || '저장 실패', false);
    }
  } catch (err) {
    showToast('통신 오류가 발생했습니다.', false);
  }
}

async function deletePost(id) {
  if (!confirm('이 기사를 삭제하시겠습니까?')) return;
  try {
    const res = await fetch(`/api/posts.php?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('기사가 삭제되었습니다.');
      fetchAllData();
    } else {
      showToast(data.error || '삭제 실패', false);
    }
  } catch (err) {
    showToast('통신 오류', false);
  }
}

// =========================================================
// MEDIA LIBRARY & UPLOADS
// =========================================================
async function fetchMediaFiles() {
  try {
    const res = await fetch('/api/upload.php?action=list');
    const data = await res.json();
    let files = (data.success && data.files) ? data.files : [];

    // Also collect any image URLs currently in state.posts and state.billboards
    const seenUrls = new Set(files.map(f => f.url));
    
    (state.posts || []).forEach(p => {
      const imgs = Array.isArray(p.images) ? p.images : (p.coverImage ? [p.coverImage] : []);
      imgs.forEach((imgUrl, i) => {
        if (imgUrl && !seenUrls.has(imgUrl)) {
          seenUrls.add(imgUrl);
          files.push({
            name: (p.title || 'Post Image') + ' (#' + (i + 1) + ')',
            type: 'image',
            url: imgUrl,
            size: imgUrl.length,
            mtime: Math.floor(Date.now() / 1000)
          });
        }
      });
    });

    (state.billboards || []).forEach(b => {
      if (b.mediaUrl && !seenUrls.has(b.mediaUrl)) {
        seenUrls.add(b.mediaUrl);
        files.push({
          name: (b.title || 'Billboard') + ' Media',
          type: b.mediaType || 'image',
          url: b.mediaUrl,
          size: b.mediaUrl.length,
          mtime: Math.floor(Date.now() / 1000)
        });
      }
    });

    state.media = files;
    const countEl = document.getElementById('stat-media-count');
    if (countEl) countEl.textContent = state.media.length + '개';
    renderMediaGrid();
  } catch (err) {
    console.error('Error fetching media:', err);
  }
}

function renderMediaGrid() {
  const container = document.getElementById('media-grid');
  if (!container) return;
  if (state.media.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-10 text-slate-500 text-xs">
        아직 업로드된 파일이 없습니다. 상단 업로더를 이용해 파일을 추가하세요.
      </div>`;
    return;
  }

  container.innerHTML = state.media.map(f => `
    <div class="bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group">
      <div class="relative aspect-square bg-slate-950 overflow-hidden flex items-center justify-center">
        ${f.type === 'image' || (f.url && !f.url.endsWith('.mp4')) ? `
          <img src="${f.url}" alt="${escapeHtml(f.name)}" class="w-full h-full object-cover">
        ` : `
          <video src="${f.url}" class="w-full h-full object-cover" muted></video>
          <span class="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xl">
            <i class="fa-solid fa-film"></i>
          </span>
        `}
      </div>
      <div class="p-2.5 space-y-1.5">
        <p class="text-[11px] font-mono text-slate-300 truncate" title="${escapeHtml(f.name)}">${escapeHtml(f.name)}</p>
        <div class="flex items-center justify-between gap-1">
          <button onclick="copyMediaUrl('${escapeHtml(f.url)}')" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-semibold py-1 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer">
            <i class="fa-regular fa-copy"></i> 복사
          </button>
          <button onclick="deleteMediaFile('${escapeHtml(f.url)}')" class="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] p-1 px-2 rounded-lg transition-all cursor-pointer">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function copyMediaUrl(url) {
  navigator.clipboard.writeText(url).then(() => {
    showToast('파일 URL이 클립보드에 복사되었습니다!');
  });
}

async function deleteMediaFile(url) {
  if (!confirm('이 미디어 파일을 삭제하시겠습니까?')) return;
  try {
    const res = await fetch(`/api/upload.php?action=delete&url=${encodeURIComponent(url)}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('파일이 삭제되었습니다.');
      fetchMediaFiles();
    } else {
      showToast(data.error || '삭제 실패', false);
    }
  } catch (err) {
    showToast('삭제 완료');
    state.media = state.media.filter(m => m.url !== url);
    renderMediaGrid();
  }
}

// Field file upload helper
async function uploadFieldFile(input, targetInputId, previewId) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];

  showToast('파일을 업로드하는 중입니다...');

  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload.php', { method: 'POST', body: formData });
    const data = await res.json();

    if (data.success && data.url) {
      document.getElementById(targetInputId).value = data.url;
      if (previewId) {
        const preview = document.getElementById(previewId);
        if (data.type === 'image') {
          preview.innerHTML = `<img src="${data.url}" class="w-full h-full object-cover">`;
        } else {
          preview.innerHTML = `<video src="${data.url}" class="w-full h-full object-cover" controls></video>`;
        }
        preview.classList.remove('hidden');
      }
      showToast('업로드 완료!');
    } else {
      // Fallback
      if (file.type && file.type.startsWith('image/')) {
        const dataUrl = await compressImageToDataUrl(file, 1600, 1200, 0.88);
        if (dataUrl) {
          document.getElementById(targetInputId).value = dataUrl;
          if (previewId) {
            const preview = document.getElementById(previewId);
            preview.innerHTML = `<img src="${dataUrl}" class="w-full h-full object-cover">`;
            preview.classList.remove('hidden');
          }
          showToast('이미지가 등록되었습니다.');
          return;
        }
      }
      showToast(data.error || '업로드 실패', false);
    }
  } catch (err) {
    if (file.type && file.type.startsWith('image/')) {
      const dataUrl = await compressImageToDataUrl(file, 1600, 1200, 0.88);
      if (dataUrl) {
        document.getElementById(targetInputId).value = dataUrl;
        if (previewId) {
          const preview = document.getElementById(previewId);
          preview.innerHTML = `<img src="${dataUrl}" class="w-full h-full object-cover">`;
          preview.classList.remove('hidden');
        }
        showToast('이미지가 등록되었습니다.');
        return;
      }
    }
    showToast('업로드 중 오류가 발생했습니다.', false);
  }
}

// Direct multiple files upload from dropzone
async function handleDirectFileUpload(files) {
  if (!files || files.length === 0) return;
  showToast(`${files.length}개 파일 업로드 시작...`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const formData = new FormData();
      formData.append('file', file);
      await fetch('/api/upload.php', { method: 'POST', body: formData });
    } catch (e) {}
  }

  showToast('모든 파일 업로드가 완료되었습니다.');
  fetchMediaFiles();
}

function setupDropzone() {
  const dropzone = document.getElementById('media-dropzone');
  if (!dropzone) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, e => {
      e.preventDefault();
      dropzone.classList.add('border-purple-400', 'bg-purple-950/20');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, e => {
      e.preventDefault();
      dropzone.classList.remove('border-purple-400', 'bg-purple-950/20');
    });
  });

  dropzone.addEventListener('drop', e => {
    const dt = e.dataTransfer;
    if (dt && dt.files) {
      handleDirectFileUpload(dt.files);
    }
  });
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('hidden');
  }
}

// =========================================================
// INQUIRIES & FORMS MANAGEMENT (ACCORDION & RESOLVED)
// =========================================================
async function fetchInquiries(showNotification = false) {
  try {
    const t = Date.now();
    const res = await fetch(`/api/contact.php?_t=${t}`, { cache: 'no-store' });
    const data = await res.json();
    if (data.success) {
      state.inquiries = data.data || [];
      renderInquiries();
      updateDashboard();
      if (showNotification) showToast('문의 접수 목록을 새로고침했습니다.');
    } else {
      if (showNotification) showToast(data.error || '문의 목록을 불러오지 못했습니다.', false);
    }
  } catch (err) {
    console.error('fetchInquiries error:', err);
    if (showNotification) showToast('네트워크 오류가 발생했습니다.', false);
  }
}

function filterInquiries(status) {
  state.inquiryFilter = status;
  document.querySelectorAll('.inquiry-filter-btn').forEach(btn => {
    btn.className = 'inquiry-filter-btn px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-slate-800 text-slate-300 hover:bg-slate-700';
  });
  if (status === '전체') {
    const el = document.getElementById('inq-filter-all');
    if (el) el.className = 'inquiry-filter-btn px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-amber-500 text-slate-950 shadow-md';
  } else if (status === '대기중') {
    const el = document.getElementById('inq-filter-pending');
    if (el) el.className = 'inquiry-filter-btn px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-amber-500 text-slate-950 shadow-md';
  } else if (status === '해결') {
    const el = document.getElementById('inq-filter-resolved');
    if (el) el.className = 'inquiry-filter-btn px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-emerald-500 text-slate-950 shadow-md';
  }
  renderInquiries();
}

function handleInquirySearch(query) {
  state.inquirySearch = (query || '').trim().toLowerCase();
  renderInquiries();
}

function toggleInquiryAccordion(id) {
  state.expandedInquiries[id] = !state.expandedInquiries[id];
  renderInquiries();
}

async function toggleInquiryResolved(e, id) {
  if (e) {
    e.stopPropagation();
  }
  try {
    const res = await fetch('/api/contact.php?action=toggle_resolved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (data.success) {
      const idx = state.inquiries.findIndex(item => item.id === id);
      if (idx !== -1 && data.item) {
        state.inquiries[idx] = data.item;
      }
      renderInquiries();
      updateDashboard();
      showToast(data.message || '상태가 변경되었습니다.');
    } else {
      showToast(data.error || '상태 변경에 실패했습니다.', false);
    }
  } catch (err) {
    console.error('toggleInquiryResolved error:', err);
    showToast('서버 통신 중 오류가 발생했습니다.', false);
  }
}

async function deleteInquiry(e, id) {
  if (e) {
    e.stopPropagation();
  }
  const item = state.inquiries.find(i => i.id === id);
  const name = item ? item.name : '고객';
  if (!confirm(`'${name}' 님의 문의 내역을 영구히 삭제하시겠습니까?`)) return;

  try {
    const res = await fetch('/api/contact.php?action=delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (data.success) {
      state.inquiries = state.inquiries.filter(i => i.id !== id);
      renderInquiries();
      updateDashboard();
      showToast('문의 내역이 삭제되었습니다.');
    } else {
      showToast(data.error || '삭제에 실패했습니다.', false);
    }
  } catch (err) {
    console.error('deleteInquiry error:', err);
    showToast('삭제 중 오류가 발생했습니다.', false);
  }
}

function renderInquiries() {
  const container = document.getElementById('inquiries-accordion-list');
  if (!container) return;

  const totalCount = state.inquiries.length;
  const pendingCount = state.inquiries.filter(i => !i.resolved).length;
  const resolvedCount = state.inquiries.filter(i => i.resolved).length;

  const countAll = document.getElementById('count-inq-all');
  if (countAll) countAll.textContent = totalCount;
  const countPending = document.getElementById('count-inq-pending');
  if (countPending) countPending.textContent = pendingCount;
  const countResolved = document.getElementById('count-inq-resolved');
  if (countResolved) countResolved.textContent = resolvedCount;

  let filtered = state.inquiries;
  if (state.inquiryFilter === '대기중') {
    filtered = filtered.filter(i => !i.resolved);
  } else if (state.inquiryFilter === '해결') {
    filtered = filtered.filter(i => i.resolved);
  }

  if (state.inquirySearch) {
    const q = state.inquirySearch;
    filtered = filtered.filter(i => {
      return (
        (i.name && i.name.toLowerCase().includes(q)) ||
        (i.email && i.email.toLowerCase().includes(q)) ||
        (i.phone && i.phone.toLowerCase().includes(q)) ||
        (i.category && i.category.toLowerCase().includes(q)) ||
        (i.message && i.message.toLowerCase().includes(q))
      );
    });
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 bg-slate-800/40 rounded-3xl border border-slate-700 border-dashed">
        <div class="text-3xl mb-2">📭</div>
        <h3 class="text-sm font-bold text-white">접수된 문의 내역이 없습니다.</h3>
        <p class="text-xs text-slate-400 mt-1">홈페이지를 통해 고객 문의가 접수되면 이곳에 실시간으로 표시됩니다.</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(inq => {
    const isResolved = Boolean(inq.resolved);
    const isExpanded = Boolean(state.expandedInquiries[inq.id]);
    const cleanMsg = escapeHtml(inq.message || '');
    const shortMsg = cleanMsg.length > 55 ? cleanMsg.substring(0, 55) + '...' : cleanMsg;

    return `
    <div class="inquiry-card bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-sm ${isResolved ? 'is-resolved' : ''} ${isExpanded ? 'is-expanded border-amber-500/40' : ''}">
      <!-- Compact Summary Bar (Clickable Accordion Header) -->
      <div onclick="toggleInquiryAccordion('${inq.id}')" class="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-750 transition-colors">
        
        <!-- Left: Resolved Checkmark Button + Submitter Info -->
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <!-- Checkmark Resolved Button -->
          <button type="button" onclick="toggleInquiryResolved(event, '${inq.id}')" class="btn-resolve-check shrink-0 p-1 text-xl focus:outline-none" title="${isResolved ? '미해결 상태로 변경' : '해결 완료로 체크'}">
            ${isResolved
              ? '<i class="fa-solid fa-circle-check text-emerald-400"></i>'
              : '<i class="fa-regular fa-circle text-slate-500 hover:text-emerald-400 transition-colors"></i>'
            }
          </button>

          <!-- Category Badge -->
          <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 ${
            inq.category === '메디케어 상담' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
            inq.category === 'ACA 오바마케어' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
            inq.category === '의료비 지원' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
            'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }">${escapeHtml(inq.category || '문의')}</span>

          <!-- Name -->
          <span class="inquiry-title-text font-bold text-sm text-white shrink-0">
            ${escapeHtml(inq.name || '미기재')}
          </span>

          <!-- Short Message / Contact Snippet on Desktop -->
          <span class="hidden lg:inline-block text-xs text-slate-400 truncate max-w-md">
            ${shortMsg}
          </span>
        </div>

        <!-- Right: Status Badge + Date + Actions + Chevron -->
        <div class="flex items-center justify-between md:justify-end gap-3 shrink-0 text-xs">
          <!-- Contact Quick Info -->
          <div class="hidden sm:flex items-center gap-3 text-[11px] text-slate-400 mr-2">
            ${inq.phone ? `<span class="flex items-center gap-1"><i class="fa-solid fa-phone text-[10px] text-slate-500"></i> ${escapeHtml(inq.phone)}</span>` : ''}
            ${inq.email ? `<span class="flex items-center gap-1"><i class="fa-solid fa-envelope text-[10px] text-slate-500"></i> ${escapeHtml(inq.email)}</span>` : ''}
          </div>

          <!-- Status Badge -->
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
            isResolved
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
          }">
            ${isResolved ? '<i class="fa-solid fa-check mr-1"></i>해결 완료' : '<i class="fa-solid fa-clock mr-1"></i>대기중'}
          </span>

          <!-- Submitted Date -->
          <span class="text-[11px] text-slate-400">${escapeHtml((inq.createdAt || '').substring(0, 16))}</span>

          <!-- Actions Toolbar -->
          <div class="flex items-center gap-1" onclick="event.stopPropagation()">
            <!-- Erase / Delete button -->
            <button type="button" onclick="deleteInquiry(event, '${inq.id}')" class="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="문의 내역 삭제 (Erase)">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
            
            <!-- Accordion Expand/Collapse button -->
            <button type="button" onclick="toggleInquiryAccordion('${inq.id}')" class="p-1.5 text-slate-400 hover:text-white rounded-lg transition-transform inquiry-chevron" title="상세 정보 펼치기">
              <i class="fa-solid fa-chevron-down text-xs"></i>
            </button>
          </div>
        </div>

      </div>

      <!-- Expanded Accordion Details Panel -->
      ${isExpanded ? `
      <div class="border-t border-slate-700/70 bg-slate-900/70 p-5 space-y-4">
        <!-- Details Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span class="text-slate-400 text-[11px] block mb-0.5">성함</span>
            <span class="font-bold text-white text-sm">${escapeHtml(inq.name)}</span>
          </div>
          <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span class="text-slate-400 text-[11px] block mb-0.5">이메일 주소</span>
            <a href="mailto:${escapeHtml(inq.email)}" class="font-bold text-blue-400 hover:underline break-all">${escapeHtml(inq.email || '미기재')}</a>
          </div>
          <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span class="text-slate-400 text-[11px] block mb-0.5">연락처</span>
            <a href="tel:${escapeHtml(inq.phone)}" class="font-bold text-emerald-400 hover:underline">${escapeHtml(inq.phone || '미기재')}</a>
          </div>
          <div class="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span class="text-slate-400 text-[11px] block mb-0.5">접수 일시 / 상태</span>
            <span class="text-slate-200">${escapeHtml(inq.createdAt || '')}</span>
            ${inq.resolvedAt ? `<span class="block text-[10px] text-emerald-400 mt-0.5">해결완료: ${escapeHtml(inq.resolvedAt.substring(0, 16))}</span>` : ''}
          </div>
        </div>

        <!-- Full Message Block -->
        <div>
          <span class="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <i class="fa-solid fa-message text-amber-400 text-[11px]"></i>
            <span>고객 문의 내용</span>
          </span>
          <div class="bg-slate-950/80 border-l-4 border-amber-500 rounded-r-2xl p-4 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-amber-500 selection:text-black">
            ${cleanMsg}
          </div>
        </div>

        <!-- Actions Footer inside Accordion -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div class="flex items-center gap-2">
            ${inq.email ? `
              <a href="mailto:${escapeHtml(inq.email)}?subject=${encodeURIComponent('[답변] Healthcare Access Portal 문의 관련 안내 드립니다')}" class="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md">
                <i class="fa-solid fa-envelope text-[11px]"></i>
                <span>이메일 답장하기</span>
              </a>
            ` : ''}
            ${inq.phone ? `
              <a href="tel:${escapeHtml(inq.phone)}" class="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm">
                <i class="fa-solid fa-phone text-[11px] text-emerald-400"></i>
                <span>전화 연결</span>
              </a>
            ` : ''}
          </div>

          <div class="flex items-center gap-2">
            <button type="button" onclick="toggleInquiryResolved(event, '${inq.id}')" class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isResolved
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
            }">
              <i class="fa-solid ${isResolved ? 'fa-arrow-rotate-left' : 'fa-check'}"></i>
              <span>${isResolved ? '미해결로 복원' : '해결 완료로 체크'}</span>
            </button>
            <button type="button" onclick="deleteInquiry(event, '${inq.id}')" class="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
              <i class="fa-solid fa-trash-can"></i>
              <span>문의 삭제</span>
            </button>
          </div>
        </div>
      </div>
      ` : ''}

    </div>`;
  }).join('');
}

// Ensure all handlers are globally reachable on window
window.switchTab = switchTab;
window.fetchAllData = fetchAllData;
window.handleLogout = handleLogout;
window.openBillboardModal = openBillboardModal;
window.editBillboard = editBillboard;
window.deleteBillboard = deleteBillboard;
window.handleSaveBillboard = handleSaveBillboard;
window.renderBillboards = renderBillboards;
window.openBillboard2Modal = openBillboard2Modal;
window.editBillboard2 = editBillboard2;
window.deleteBillboard2 = deleteBillboard2;
window.handleSaveBillboard2 = handleSaveBillboard2;
window.renderBillboards2 = renderBillboards2;
window.openVideoModal = openVideoModal;
window.editVideo = editVideo;
window.deleteVideo = deleteVideo;
window.handleSaveVideo = handleSaveVideo;
window.openPostModal = openPostModal;
window.editPost = editPost;
window.deletePost = deletePost;
window.handleSavePost = handleSavePost;
window.renderPostImagesGrid = renderPostImagesGrid;
window.uploadMultiplePostImages = uploadMultiplePostImages;
window.addPostImageUrlManual = addPostImageUrlManual;
window.removePostImage = removePostImage;
window.movePostImage = movePostImage;
window.closeModal = closeModal;
window.showToast = showToast;
window.uploadFieldFile = uploadFieldFile;
window.handleDirectFileUpload = handleDirectFileUpload;
window.insertPostFormat = insertPostFormat;
window.insertImageToContent = insertImageToContent;
window.openPhotoPickerModal = openPhotoPickerModal;
window.selectPhotoPickerImage = selectPhotoPickerImage;
window.confirmInsertPhotoBox = confirmInsertPhotoBox;
window.togglePostContentPreview = togglePostContentPreview;
window.updatePostContentPreview = updatePostContentPreview;
window.setPostFilter = setPostFilter;
window.handlePostSearch = handlePostSearch;
window.fetchInquiries = fetchInquiries;
window.filterInquiries = filterInquiries;
window.handleInquirySearch = handleInquirySearch;
window.toggleInquiryAccordion = toggleInquiryAccordion;
window.toggleInquiryResolved = toggleInquiryResolved;
window.deleteInquiry = deleteInquiry;
window.renderInquiries = renderInquiries;


// Global backdrop click-to-close handler & dynamic checkbox limits
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  const liveInp = document.getElementById('post-liveupdate-input');
  if (liveInp) {
    liveInp.addEventListener('change', () => {
      const pid = document.getElementById('post-id').value;
      updateExposureCheckboxLimits(pid);
    });
  }
  const docInp = document.getElementById('post-doctorcolumn-input');
  if (docInp) {
    docInp.addEventListener('change', () => {
      const pid = document.getElementById('post-id').value;
      updateExposureCheckboxLimits(pid);
    });
  }
});
