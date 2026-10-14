/**
 * NJ Partners CMS Management Script (/admin3/admin3.js)
 */

let currentPartners = [];
let currentSlides = [];
let categoriesList = [];
let townsList = [];

document.addEventListener('DOMContentLoaded', () => {
  loadData();
});

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.className = `fixed bottom-6 right-6 z-50 transform translate-y-0 opacity-100 transition-all duration-300 px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2.5 ${
    isError ? 'bg-red-950 border border-red-800 text-red-200' : 'bg-emerald-950 border border-emerald-800 text-emerald-200'
  }`;
  toast.innerHTML = `<i class="fa-solid ${isError ? 'fa-circle-exclamation text-red-400' : 'fa-circle-check text-emerald-400'}"></i> <span>${message}</span>`;
  setTimeout(() => {
    toast.className = 'fixed bottom-6 right-6 z-50 transform translate-y-24 opacity-0 transition-all duration-300 px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2.5';
  }, 3500);
}

function switchTab(tab) {
  const btnPartners = document.getElementById('tab-partners');
  const btnSlides = document.getElementById('tab-slides');
  const mBtnPartners = document.getElementById('m-tab-partners');
  const mBtnSlides = document.getElementById('m-tab-slides');

  const secPartners = document.getElementById('section-partners');
  const secSlides = document.getElementById('section-slides');

  if (tab === 'partners') {
    btnPartners.classList.add('active');
    btnSlides.classList.remove('active');
    mBtnPartners.className = 'flex-1 py-2 text-center rounded-lg text-xs font-bold bg-emerald-700 text-white';
    mBtnSlides.className = 'flex-1 py-2 text-center rounded-lg text-xs font-bold text-slate-400 bg-slate-800';

    secPartners.classList.remove('hidden');
    secSlides.classList.add('hidden');
  } else {
    btnSlides.classList.add('active');
    btnPartners.classList.remove('active');
    mBtnSlides.className = 'flex-1 py-2 text-center rounded-lg text-xs font-bold bg-emerald-700 text-white';
    mBtnPartners.className = 'flex-1 py-2 text-center rounded-lg text-xs font-bold text-slate-400 bg-slate-800';

    secSlides.classList.remove('hidden');
    secPartners.classList.add('hidden');
  }
}

async function loadData() {
  await Promise.all([loadPartners(), loadSlides()]);
}

// -------------------------------------------------------------------
// PARTNERS
// -------------------------------------------------------------------
async function loadPartners() {
  try {
    const res = await fetch('/api/admin3_manage.php?action=get_partners');
    if (!res.ok) {
      if (res.status === 401) { window.location.href = '/admin3/login.php'; return; }
      throw new Error('파트너 데이터 로드 실패');
    }
    const data = await res.json();
    currentPartners = data.partners || [];
    categoriesList = data.categories || [];
    townsList = data.towns || [];

    // Populate Category & Town Selects
    populateSelects();

    // Update KPI & Badge
    document.getElementById('stat-total-partners').textContent = currentPartners.length;
    document.getElementById('badge-partner-count').textContent = `${currentPartners.length}개`;
    const spotlightCount = currentPartners.filter(p => p.featured).length;
    document.getElementById('stat-spotlight-partners').textContent = spotlightCount;

    renderPartnersTable();
  } catch (err) {
    showToast(err.message, true);
  }
}

function populateSelects() {
  // Category dropdowns
  const filterCat = document.getElementById('admin-category-filter');
  const modalCat = document.getElementById('p-category');

  filterCat.innerHTML = '<option value="">모든 카테고리 (12개)</option>';
  modalCat.innerHTML = '<option value="">카테고리 선택</option>';

  categoriesList.forEach(c => {
    filterCat.innerHTML += `<option value="${c}">${c}</option>`;
    modalCat.innerHTML += `<option value="${c}">${c}</option>`;
  });

  // Town filter & modal datalist
  const filterTown = document.getElementById('admin-town-filter');
  const allTowns = Array.from(new Set([
    ...townsList,
    ...currentPartners.map(p => p.town).filter(Boolean)
  ])).sort();

  if (filterTown) {
    const currentVal = filterTown.value;
    filterTown.innerHTML = '<option value="">모든 지역 (전체)</option>';
    allTowns.forEach(t => {
      filterTown.innerHTML += `<option value="${t}">${t}</option>`;
    });
    if (currentVal) filterTown.value = currentVal;
  }

  const townSuggestions = document.getElementById('p-town-suggestions');
  if (townSuggestions) {
    townSuggestions.innerHTML = allTowns.map(t => `<option value="${t}"></option>`).join('');
  }
}

function renderPartnersTable() {
  const tbody = document.getElementById('partners-tbody');
  const search = document.getElementById('admin-search-input').value.toLowerCase().trim();
  const selectedCat = document.getElementById('admin-category-filter').value;
  const selectedTown = document.getElementById('admin-town-filter').value;

  const filtered = currentPartners.filter(p => {
    if (selectedCat && p.category !== selectedCat) return false;
    if (selectedTown && p.town !== selectedTown) return false;
    if (search) {
      const matchName = (p.name || '').toLowerCase().includes(search);
      const matchIntro = (p.intro || '').toLowerCase().includes(search);
      const matchTags = (p.tags || []).join(' ').toLowerCase().includes(search);
      if (!matchName && !matchIntro && !matchTags) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-500 text-xs">일치하는 파트너가 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const isKakao = (p.contactMethod === 'kakao');
    const contactBadge = isKakao
      ? `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#FEE500]/20 text-[#FEE500] border border-[#FEE500]/30"><i class="fa-solid fa-comment"></i> ${p.kakaoChannelId || '미설정'}</span>`
      : `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30"><i class="fa-solid fa-envelope"></i> ${p.email || '미설정'}</span>`;

    return `
      <tr class="hover:bg-slate-850/50 transition-colors">
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            <img src="${p.imageUrl}" alt="${p.name}" class="w-12 h-10 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700" onerror="this.src='/uploads/images/partners/hero_bergen_medical.jpg'" />
            <div>
              <div class="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                <span>${p.name}</span>
                ${p.isSample ? `<span class="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-normal">${p.isSample}</span>` : ''}
              </div>
              <div class="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">${p.intro || ''}</div>
            </div>
          </div>
        </td>
        <td class="py-3 px-3">
          <div class="flex flex-col gap-1">
            <span class="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 w-fit">${p.category}</span>
            <span class="text-[11px] text-slate-400 font-medium">${p.town}, NJ</span>
          </div>
        </td>
        <td class="py-3 px-3">
          ${contactBadge}
        </td>
        <td class="py-3 px-3">
          ${p.featured ? '<span class="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30"><i class="fa-solid fa-star text-[10px]"></i> 스포트라이트</span>' : '<span class="text-slate-600 text-[11px]">일반</span>'}
        </td>
        <td class="py-3 px-3 text-center font-mono text-slate-400 font-bold">
          ${p.order || 1}
        </td>
        <td class="py-3 px-3 text-center">
          ${p.visible ? '<span class="text-emerald-400 font-bold text-xs"><i class="fa-solid fa-circle-check"></i> 공개</span>' : '<span class="text-slate-600 text-xs">비공개</span>'}
        </td>
        <td class="py-3 px-4 text-right whitespace-nowrap">
          <div class="inline-flex items-center gap-1">
            <button type="button" onclick="editPartner('${p.id}')" class="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer" title="수정">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button type="button" onclick="deletePartner('${p.id}', '${p.name}')" class="p-1.5 bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 rounded-lg text-xs font-bold transition-colors cursor-pointer" title="삭제">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Open Partner Modal for Add
function openPartnerModal() {
  document.getElementById('partner-modal-title').innerHTML = '<i class="fa-solid fa-store text-emerald-400"></i> 새 파트너 등록';
  document.getElementById('p-id').value = '';
  document.getElementById('p-name').value = '';
  document.getElementById('p-is-sample').value = '가상 상호';
  document.getElementById('p-category').value = categoriesList[0] || '';
  document.getElementById('p-town').value = '';
  document.getElementById('p-image-url').value = '';
  document.getElementById('p-img-preview').innerHTML = '<i class="fa-solid fa-image text-2xl text-slate-500"></i>';
  document.getElementById('p-intro').value = '';
  document.getElementById('p-tags').value = '';
  document.getElementById('p-content').value = '';
  document.getElementById('p-minisite-url').value = '';
  document.querySelector('input[name="contact-method"][value="kakao"]').checked = true;
  toggleContactFields('kakao');
  document.getElementById('p-kakao-channel-id').value = '';
  document.getElementById('p-kakao-js-key').value = '';
  document.getElementById('p-email').value = '';
  document.getElementById('p-featured').checked = false;
  document.getElementById('p-order').value = currentPartners.length + 1;
  document.getElementById('p-visible').checked = true;

  document.getElementById('partner-modal').classList.remove('hidden');
  document.getElementById('partner-modal').classList.add('flex');
}

function closePartnerModal() {
  document.getElementById('partner-modal').classList.add('hidden');
  document.getElementById('partner-modal').classList.remove('flex');
}

function toggleContactFields(method) {
  const kakaoBox = document.getElementById('field-kakao-box');
  const emailBox = document.getElementById('field-email-box');
  if (method === 'kakao') {
    kakaoBox.classList.remove('hidden');
    emailBox.classList.add('hidden');
  } else {
    kakaoBox.classList.add('hidden');
    emailBox.classList.remove('hidden');
  }
}

function updateImagePreview(url) {
  const box = document.getElementById('p-img-preview');
  if (url && url.trim()) {
    box.innerHTML = `<img src="${url}" class="w-full h-full object-cover" onerror="this.src='/uploads/images/partners/hero_bergen_medical.jpg'" />`;
  } else {
    box.innerHTML = '<i class="fa-solid fa-image text-2xl text-slate-500"></i>';
  }
}

async function uploadPartnerImage(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const formData = new FormData();
  formData.append('file', file);

  showToast('사진 업로드 중...');

  try {
    const res = await fetch('/api/admin3_manage.php?action=upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (res.ok && data.success) {
      document.getElementById('p-image-url').value = data.url;
      updateImagePreview(data.url);
      showToast('사진이 업로드되었습니다.');
    } else {
      showToast(data.error || '업로드 실패', true);
    }
  } catch (err) {
    showToast(err.message, true);
  }
}

function editPartner(id) {
  const p = currentPartners.find(item => item.id === id);
  if (!p) return;

  document.getElementById('partner-modal-title').innerHTML = `<i class="fa-solid fa-pen text-emerald-400"></i> 파트너 수정: ${p.name}`;
  document.getElementById('p-id').value = p.id;
  document.getElementById('p-name').value = p.name || '';
  document.getElementById('p-is-sample').value = p.isSample || '가상 상호';
  document.getElementById('p-category').value = p.category || '';
  document.getElementById('p-town').value = p.town || '';
  document.getElementById('p-image-url').value = p.imageUrl || '';
  updateImagePreview(p.imageUrl || '');
  document.getElementById('p-intro').value = p.intro || '';
  document.getElementById('p-tags').value = (p.tags || []).join(', ');
  document.getElementById('p-content').value = p.content || '';
  document.getElementById('p-minisite-url').value = p.minisiteUrl || '';

  const method = p.contactMethod === 'email' ? 'email' : 'kakao';
  document.querySelector(`input[name="contact-method"][value="${method}"]`).checked = true;
  toggleContactFields(method);

  document.getElementById('p-kakao-channel-id').value = p.kakaoChannelId || '';
  document.getElementById('p-kakao-js-key').value = p.kakaoJsKey || '';
  document.getElementById('p-email').value = p.email || '';
  document.getElementById('p-featured').checked = !!p.featured;
  document.getElementById('p-order').value = p.order || 1;
  document.getElementById('p-visible').checked = !!p.visible;

  document.getElementById('partner-modal').classList.remove('hidden');
  document.getElementById('partner-modal').classList.add('flex');
}

async function handleSavePartner(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-save-partner');
  btn.disabled = true;

  const id = document.getElementById('p-id').value;
  const name = document.getElementById('p-name').value.trim();
  const isSample = document.getElementById('p-is-sample').value.trim();
  const category = document.getElementById('p-category').value;
  const town = document.getElementById('p-town').value.trim();
  if (!town) {
    alert('지역 (Town)을 입력해 주세요.');
    btn.disabled = false;
    return;
  }
  const imageUrl = document.getElementById('p-image-url').value.trim();
  const intro = document.getElementById('p-intro').value.trim();
  const tagsStr = document.getElementById('p-tags').value.trim();
  const content = document.getElementById('p-content').value.trim();
  const minisiteUrl = document.getElementById('p-minisite-url').value.trim();
  const contactMethod = document.querySelector('input[name="contact-method"]:checked').value;
  const kakaoChannelId = document.getElementById('p-kakao-channel-id').value.trim();
  const kakaoJsKey = document.getElementById('p-kakao-js-key').value.trim();
  const email = document.getElementById('p-email').value.trim();
  const featured = document.getElementById('p-featured').checked;
  const order = parseInt(document.getElementById('p-order').value, 10) || 1;
  const visible = document.getElementById('p-visible').checked;

  const payload = {
    id, name, isSample, category, town, imageUrl, intro,
    tags: tagsStr ? tagsStr.split(',').map(s => s.trim()).filter(Boolean) : [],
    content, minisiteUrl, contactMethod, kakaoChannelId, kakaoJsKey, email,
    featured, order, visible
  };

  try {
    const res = await fetch('/api/admin3_manage.php?action=save_partner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast(data.message || '파트너가 저장되었습니다.');
      closePartnerModal();
      await loadPartners();
    } else {
      showToast(data.error || '저장 실패', true);
    }
  } catch (err) {
    showToast(err.message, true);
  } finally {
    btn.disabled = false;
  }
}

async function deletePartner(id, name) {
  if (!confirm(`정말로 파트너 "${name}"을(를) 삭제하시겠습니까?`)) return;

  try {
    const res = await fetch('/api/admin3_manage.php?action=delete_partner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast('파트너가 삭제되었습니다.');
      await loadPartners();
    } else {
      showToast(data.error || '삭제 실패', true);
    }
  } catch (err) {
    showToast(err.message, true);
  }
}

// -------------------------------------------------------------------
// HERO SLIDES
// -------------------------------------------------------------------
async function loadSlides() {
  try {
    const res = await fetch('/api/admin3_manage.php?action=get_slides');
    if (!res.ok) throw new Error('슬라이드 로드 실패');
    const data = await res.json();
    currentSlides = data.slides || [];

    const activeCount = currentSlides.filter(s => s.visible).length;
    document.getElementById('stat-active-slides').textContent = `${activeCount} / 3`;

    renderSlidesGrid();
  } catch (err) {
    showToast(err.message, true);
  }
}

function renderSlidesGrid() {
  const container = document.getElementById('slides-grid');

  if (currentSlides.length === 0) {
    container.innerHTML = `<div class="col-span-full py-12 text-center text-slate-500 text-xs">등록된 히어로 슬라이드가 없습니다.</div>`;
    return;
  }

  container.innerHTML = currentSlides.map(s => {
    return `
      <div class="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
        <div class="relative aspect-video bg-slate-800">
          <img src="${s.imageUrl}" alt="${s.title}" class="w-full h-full object-cover" onerror="this.src='/uploads/images/partners/hero_bergen_medical.jpg'" />
          <div class="absolute top-2.5 left-2.5">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${s.visible ? 'bg-emerald-600 text-white' : 'bg-slate-800/90 text-slate-400'}">
              ${s.visible ? '● 활성 (노출중)' : '비공개'}
            </span>
          </div>
          <div class="absolute top-2.5 right-2.5">
            <span class="px-2 py-0.5 rounded bg-black/60 text-white text-[11px] font-mono font-bold">
              순서: ${s.order || 1}
            </span>
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            ${s.tag ? `<span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wide block mb-1">${s.tag}</span>` : ''}
            <h3 class="text-sm font-black text-white leading-snug">${s.title}</h3>
            <p class="text-xs text-slate-400 line-clamp-2 mt-1">${s.subtitle || ''}</p>
          </div>

          <div class="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span class="text-[11px] text-slate-500 font-medium">버튼: "${s.buttonText || '자세히 보기 →'}"</span>
            <div class="flex items-center gap-1.5">
              <button type="button" onclick="editSlide('${s.id}')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                수정
              </button>
              <button type="button" onclick="deleteSlide('${s.id}', '${s.title}')" class="px-2.5 py-1 bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openSlideModal() {
  document.getElementById('slide-modal-title').innerHTML = '<i class="fa-solid fa-images text-emerald-400"></i> 새 히어로 슬라이드';
  document.getElementById('s-id').value = '';
  document.getElementById('s-title').value = '';
  document.getElementById('s-subtitle').value = '';
  document.getElementById('s-tag').value = '프리미엄 샘플 · 가상 상호 · 종합병원';
  document.getElementById('s-image-url').value = '';
  document.getElementById('s-img-preview').innerHTML = '<i class="fa-solid fa-image text-2xl text-slate-500"></i>';
  document.getElementById('s-button-text').value = '자세히 보기 →';
  document.getElementById('s-button-link').value = '#';
  document.getElementById('s-order').value = currentSlides.length + 1;
  document.getElementById('s-visible').checked = true;

  document.getElementById('slide-modal').classList.remove('hidden');
  document.getElementById('slide-modal').classList.add('flex');
}

function closeSlideModal() {
  document.getElementById('slide-modal').classList.add('hidden');
  document.getElementById('slide-modal').classList.remove('flex');
}

function updateSlideImagePreview(url) {
  const box = document.getElementById('s-img-preview');
  if (url && url.trim()) {
    box.innerHTML = `<img src="${url}" class="w-full h-full object-cover" onerror="this.src='/uploads/images/partners/hero_bergen_medical.jpg'" />`;
  } else {
    box.innerHTML = '<i class="fa-solid fa-image text-2xl text-slate-500"></i>';
  }
}

async function uploadSlideImage(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const formData = new FormData();
  formData.append('file', file);

  showToast('슬라이드 이미지 업로드 중...');

  try {
    const res = await fetch('/api/admin3_manage.php?action=upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (res.ok && data.success) {
      document.getElementById('s-image-url').value = data.url;
      updateSlideImagePreview(data.url);
      showToast('이미지가 업로드되었습니다.');
    } else {
      showToast(data.error || '업로드 실패', true);
    }
  } catch (err) {
    showToast(err.message, true);
  }
}

function editSlide(id) {
  const s = currentSlides.find(item => item.id === id);
  if (!s) return;

  document.getElementById('slide-modal-title').innerHTML = `<i class="fa-solid fa-pen text-emerald-400"></i> 슬라이드 수정: ${s.title}`;
  document.getElementById('s-id').value = s.id;
  document.getElementById('s-title').value = s.title || '';
  document.getElementById('s-subtitle').value = s.subtitle || '';
  document.getElementById('s-tag').value = s.tag || '';
  document.getElementById('s-image-url').value = s.imageUrl || '';
  updateSlideImagePreview(s.imageUrl || '');
  document.getElementById('s-button-text').value = s.buttonText || '자세히 보기 →';
  document.getElementById('s-button-link').value = s.buttonLink || '#';
  document.getElementById('s-order').value = s.order || 1;
  document.getElementById('s-visible').checked = !!s.visible;

  document.getElementById('slide-modal').classList.remove('hidden');
  document.getElementById('slide-modal').classList.add('flex');
}

async function handleSaveSlide(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-save-slide');
  btn.disabled = true;

  const id = document.getElementById('s-id').value;
  const title = document.getElementById('s-title').value.trim();
  const subtitle = document.getElementById('s-subtitle').value.trim();
  const tag = document.getElementById('s-tag').value.trim();
  const imageUrl = document.getElementById('s-image-url').value.trim();
  const buttonText = document.getElementById('s-button-text').value.trim();
  const buttonLink = document.getElementById('s-button-link').value.trim();
  const order = parseInt(document.getElementById('s-order').value, 10) || 1;
  const visible = document.getElementById('s-visible').checked;

  const payload = { id, title, subtitle, tag, imageUrl, buttonText, buttonLink, order, visible };

  try {
    const res = await fetch('/api/admin3_manage.php?action=save_slide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast(data.message || '슬라이드가 저장되었습니다.');
      closeSlideModal();
      await loadSlides();
    } else {
      showToast(data.error || '저장 실패', true);
    }
  } catch (err) {
    showToast(err.message, true);
  } finally {
    btn.disabled = false;
  }
}

async function deleteSlide(id, title) {
  if (!confirm(`정말로 슬라이드 "${title}"을(를) 삭제하시겠습니까?`)) return;

  try {
    const res = await fetch('/api/admin3_manage.php?action=delete_slide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast('슬라이드가 삭제되었습니다.');
      await loadSlides();
    } else {
      showToast(data.error || '삭제 실패', true);
    }
  } catch (err) {
    showToast(err.message, true);
  }
}

async function handleLogout() {
  if (!confirm('CMS에서 로그아웃하시겠습니까?')) return;
  await fetch('/api/admin3_auth.php?action=logout');
  window.location.href = '/admin3/login.php';
}
