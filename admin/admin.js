/**
 * NJ Access Center - Admin CMS Client Script
 */

let state = {
  billboards: [],
  videos: [],
  posts: [],
  media: [],
  categories: { news: [], videos: [], billboards: [] },
  videoFilter: '전체',
  postFilter: '전체',
  postSearch: ''
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
}

// Fetch all initial data
async function fetchAllData() {
  try {
    const t = Date.now();
    const [bRes, vRes, pRes] = await Promise.all([
      fetch(`/api/billboards.php?_t=${t}`, { cache: 'no-store' }).then(r => r.json()),
      fetch(`/api/videos.php?_t=${t}`, { cache: 'no-store' }).then(r => r.json()),
      fetch(`/api/posts.php?_t=${t}`, { cache: 'no-store' }).then(r => r.json())
    ]);

    if (bRes.success) {
      state.billboards = bRes.data || [];
      state.categories.billboards = bRes.categories || [];
      renderBillboards();
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
  document.getElementById('stat-billboards-count').textContent = state.billboards.length + '개';
  document.getElementById('stat-videos-count').textContent = state.videos.length + '개';
  document.getElementById('stat-posts-count').textContent = state.posts.length + '개';
  
  // Recent activity list
  const container = document.getElementById('dash-recent-list');
  const recent = [
    ...state.billboards.map(b => ({ type: 'billboard', title: b.title, tag: '빌보드', date: b.createdAt || '최근' })),
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
          item.type === 'billboard' ? 'bg-blue-500/20 text-blue-300' :
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

  container.innerHTML = state.billboards.map(b => `
    <div class="bg-slate-800/90 border border-slate-700/90 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between group">
      <div>
        <div class="relative h-48 bg-slate-900 overflow-hidden">
          ${b.mediaType === 'video' || (b.mediaUrl && b.mediaUrl.endsWith('.mp4')) ? `
            <video src="${b.mediaUrl}" class="w-full h-full object-cover" muted autoplay loop></video>
            <span class="absolute top-3 right-3 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <i class="fa-solid fa-video"></i> VIDEO
            </span>
          ` : `
            <img src="${b.mediaUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80'}" alt="${b.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          `}
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          <div class="absolute top-3 left-3">
            <span class="bg-blue-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md">
              ${b.category || 'SPECIAL CAMPAIGN'}
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
  `).join('');
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
    preview.innerHTML = `<img src="${b.mediaUrl}" class="w-full h-full object-cover">`;
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

  const payload = {
    id: id,
    title: document.getElementById('billboard-title-input').value,
    category: (catInput ? catInput.value.trim() : '') || '',
    order: parseInt(document.getElementById('billboard-order-input').value) || 1,
    subtitle: document.getElementById('billboard-subtitle-input').value,
    mediaUrl: document.getElementById('billboard-media-input').value,
    mediaType: document.getElementById('billboard-media-input').value.endsWith('.mp4') ? 'video' : 'image',
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
            <span class="font-bold text-blue-400">${v.doctor || '의학 리포트'}</span>
            <span>·</span>
            <span>👁️ ${v.views || '1만회'}</span>
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
  document.getElementById('video-doctor-input').value = v.doctor || '';
  document.getElementById('video-hospital-input').value = v.hospital || '';
  document.getElementById('video-duration-input').value = v.duration || '';
  document.getElementById('video-views-input').value = v.views || '';
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
    category: document.getElementById('video-category-input').value || '심장 & 혈관',
    youtubeId: cleanYt,
    doctor: document.getElementById('video-doctor-input').value || '의학 리포트',
    hospital: document.getElementById('video-hospital-input').value || 'Englewood Health Center for Korean Health',
    duration: document.getElementById('video-duration-input').value || '05:00',
    views: document.getElementById('video-views-input').value || '1.2만회',
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
  const cats = Array.from(new Set(['전체', ...(state.categories.news || [])]));

  catFilters.innerHTML = cats.map(c => `
    <button onclick="setPostFilter('${c}')" class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
      state.postFilter === c ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
    }">${c}</button>
  `).join('');

  catList.innerHTML = (state.categories.news || []).filter(c => c !== '전체').map(c => `<option value="${c}"></option>`).join('');

  const container = document.getElementById('posts-grid');
  let filtered = state.posts;

  if (state.postFilter !== '전체') {
    filtered = filtered.filter(p => p.category === state.postFilter);
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

  container.innerHTML = filtered.map(p => `
    <div class="bg-slate-800/90 border border-slate-700/90 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between group">
      <div>
        <div class="relative h-48 bg-slate-900 overflow-hidden">
          <img src="${p.coverImage || 'https://images.unsplash.com/photo-1628771065117-74ccb5690668?w=800&q=80'}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute top-3 left-3 flex items-center gap-1.5">
            <span class="bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">${p.category}</span>
            ${p.isTopStory ? '<span class="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow animate-pulse">🔥 TOP STORY</span>' : ''}
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
  `).join('');
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

function openPostModal() {
  document.getElementById('form-post').reset();
  document.getElementById('post-id').value = '';
  document.getElementById('post-date-input').value = new Date().toISOString().split('T')[0];
  document.getElementById('modal-post-title').innerHTML = '<i class="fa-solid fa-pen-nib text-emerald-400"></i> <span>새 건강 뉴스 기사 작성</span>';
  
  currentPostImages = [];
  renderPostImagesGrid();
  document.getElementById('modal-post').classList.remove('hidden');
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
  document.getElementById('post-summarypoints-input').value = Array.isArray(p.summaryPoints) ? p.summaryPoints.join('\n') : (p.summaryPoints || '');
  document.getElementById('post-content-input').value = p.content || '';
  document.getElementById('post-topstory-input').checked = Boolean(p.isTopStory);
  document.getElementById('post-liveupdate-input').checked = Boolean(p.isLiveUpdate);

  // Initialize multiple images from post
  let imgs = [];
  if (Array.isArray(p.images) && p.images.length > 0) {
    imgs = [...p.images];
  } else if (p.coverImage) {
    imgs = [p.coverImage];
  }
  currentPostImages = imgs;
  renderPostImagesGrid();

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
      </div>
    `;
  }).join('');
}

async function uploadMultiplePostImages(input) {
  if (!input.files || input.files.length === 0) return;
  const files = Array.from(input.files);
  showToast(`${files.length}개의 사진 업로드를 시작합니다...`);

  for (let i = 0; i < files.length; i++) {
    const formData = new FormData();
    formData.append('file', files[i]);
    try {
      const res = await fetch('/api/upload.php', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.url) {
        currentPostImages.push(data.url);
      }
    } catch (e) {
      console.error('Upload failed for file:', files[i].name, e);
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

  if (currentPostImages.length === 0) {
    showToast('최소 1개 이상의 기사 사진을 등록해주세요.', false);
    return;
  }

  const payload = {
    id: id,
    title: document.getElementById('post-title-input').value,
    category: document.getElementById('post-category-input').value,
    date: document.getElementById('post-date-input').value,
    author: document.getElementById('post-author-input').value,
    coverImage: currentPostImages[0] || '',
    images: currentPostImages,
    videoUrl: document.getElementById('post-videourl-input').value,
    excerpt: document.getElementById('post-excerpt-input').value,
    summaryPoints: document.getElementById('post-summarypoints-input').value,
    content: document.getElementById('post-content-input').value,
    isTopStory: document.getElementById('post-topstory-input').checked,
    isLiveUpdate: document.getElementById('post-liveupdate-input').checked
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
    if (data.success) {
      state.media = data.files || [];
      document.getElementById('stat-media-count').textContent = state.media.length + '개';
      renderMediaGrid();
    }
  } catch (err) {
    console.error('Error fetching media:', err);
  }
}

function renderMediaGrid() {
  const container = document.getElementById('media-grid');
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
        ${f.type === 'image' ? `
          <img src="${f.url}" alt="${f.name}" class="w-full h-full object-cover">
        ` : `
          <video src="${f.url}" class="w-full h-full object-cover" muted></video>
          <span class="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xl">
            <i class="fa-solid fa-film"></i>
          </span>
        `}
      </div>
      <div class="p-2.5 space-y-1.5">
        <p class="text-[11px] font-mono text-slate-300 truncate" title="${f.name}">${f.name}</p>
        <div class="flex items-center justify-between gap-1">
          <button onclick="copyMediaUrl('${f.url}')" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-semibold py-1 rounded-lg transition-all flex items-center justify-center gap-1">
            <i class="fa-regular fa-copy"></i> 복사
          </button>
          <button onclick="deleteMediaFile('${f.url}')" class="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] p-1 px-2 rounded-lg transition-all">
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
  if (!confirm('이 미디어 파일을 영구 삭제하시겠습니까?')) return;
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
    showToast('통신 오류', false);
  }
}

// Field file upload helper
async function uploadFieldFile(input, targetInputId, previewId) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const formData = new FormData();
  formData.append('file', file);

  showToast('파일을 업로드하는 중입니다...');

  try {
    const res = await fetch('/api/upload.php', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();

    if (data.success) {
      showToast('업로드 완료!');
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
    } else {
      showToast(data.error || '업로드 실패', false);
    }
  } catch (err) {
    showToast('업로드 중 통신 오류가 발생했습니다.', false);
  }
}

// Direct multiple files upload from dropzone
async function handleDirectFileUpload(files) {
  if (!files || files.length === 0) return;
  showToast(`${files.length}개 파일 업로드 시작...`);

  for (let i = 0; i < files.length; i++) {
    const formData = new FormData();
    formData.append('file', files[i]);
    try {
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

// Ensure all handlers are globally reachable on window
window.switchTab = switchTab;
window.fetchAllData = fetchAllData;
window.handleLogout = handleLogout;
window.openBillboardModal = openBillboardModal;
window.editBillboard = editBillboard;
window.deleteBillboard = deleteBillboard;
window.handleSaveBillboard = handleSaveBillboard;
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
window.setPostFilter = setPostFilter;
window.handlePostSearch = handlePostSearch;

// Global backdrop click-to-close handler
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
});
