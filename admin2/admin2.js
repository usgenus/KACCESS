/**
 * Healthcare Access Portal - Forum CMS Controller (/admin2)
 */

let allQuestions = [];
let allAnswers = [];
let allUsers = [];
let allSpecialties = [];
let allCategories = [];
let allSubSpecialties = [];
let currentDisclaimer = '';

// Tab Switching
function switchTab(tabId) {
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.mobile-tab-btn').forEach(el => el.classList.remove('active'));

  const targetPane = document.getElementById(`tab-${tabId}`);
  if (targetPane) targetPane.classList.remove('hidden');

  const navBtn = document.getElementById(`nav-${tabId}`);
  if (navBtn) navBtn.classList.add('active');

  const navMBtn = document.getElementById(`nav-m-${tabId}`);
  if (navMBtn) navMBtn.classList.add('active');

  if (tabId === 'dashboard') loadDashboardStats();
  if (tabId === 'questions') loadQuestionsTable();
  if (tabId === 'answers') loadAnswersTable();
  if (tabId === 'users') loadUsersTable();
  if (tabId === 'events') loadEventsSection();
  if (tabId === 'specialties') loadSpecialtiesGrid();
  if (tabId === 'settings') loadSettingsTab();
}

// 1. Load Dashboard Statistics
async function loadDashboardStats() {
  try {
    const res = await fetch('/ko/api/forum_admin.php?action=stats');
    if (res.status === 401) {
      window.location.href = '/ko/admin2/login.php';
      return;
    }
    const json = await res.json();
    if (!json.success || !json.data) return;

    const data = json.data;
    document.getElementById('stat-total-questions').innerText = data.totalQuestions ?? 0;
    document.getElementById('stat-active-questions').innerText = data.activeQuestions ?? 0;
    document.getElementById('stat-total-answers').innerText = data.totalAnswers ?? 0;
    document.getElementById('stat-verified-clinicians').innerText = data.verifiedClinicians ?? 0;
    document.getElementById('stat-flagged-questions').innerText = (data.flaggedQuestions + (data.flaggedAnswers ?? 0));
    document.getElementById('stat-hidden-questions').innerText = data.hiddenQuestions ?? 0;

    allCategories = data.categories || [];
    allSubSpecialties = data.subSpecialties || [];
    allSpecialties = allCategories;
    currentDisclaimer = data.disclaimer || '본 포럼의 정보는 교육 및 일반 정보 제공 목적이며 전문 진료를 대체하지 않습니다';

    // Populate Disclaimer input if on settings page
    const discInput = document.getElementById('setting-disclaimer-input');
    if (discInput && !discInput.value) {
      discInput.value = currentDisclaimer;
    }

    // Render 5 Core Categories grid
    const catGrid = document.getElementById('categories-dashboard-grid');
    if (catGrid && Array.isArray(allCategories)) {
      catGrid.innerHTML = allCategories.map(cat => `
        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3" style="border-left: 4px solid ${cat.color || '#3b82f6'};">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0" style="background-color: ${cat.color}22; color: ${cat.color}">
            <i class="fa-solid ${cat.icon || 'fa-layer-group'}"></i>
          </div>
          <div class="overflow-hidden min-w-0 flex-1">
            <h4 class="text-xs font-bold text-white truncate">${escapeHtml(cat.name_ko)}</h4>
            <div class="flex items-center justify-between mt-1">
              <span class="text-[10px] text-slate-400 font-mono truncate">${escapeHtml(cat.name_en || '')}</span>
              <span class="text-xs font-extrabold text-blue-400">${cat.questionCount ?? (cat.count ?? 0)}건</span>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Render 19 Medical Sub-Specialties distribution grid
    const specGrid = document.getElementById('specialties-dashboard-grid');
    if (specGrid && Array.isArray(allSubSpecialties)) {
      specGrid.innerHTML = allSubSpecialties.map(sp => `
        <div class="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0" style="background-color: ${sp.color}22; color: ${sp.color}">
            <i class="fa-solid ${sp.icon || 'fa-stethoscope'}"></i>
          </div>
          <div class="overflow-hidden min-w-0 flex-1">
            <h4 class="text-xs font-bold text-white truncate">${escapeHtml(sp.name_ko)}</h4>
            <span class="text-[10px] text-slate-400 font-semibold">${sp.questionCount ?? (sp.count ?? 0)}건</span>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error loading forum stats:', err);
  }
}

// 2. Load Questions Table
let qSearchTimeout = null;
function debounceQuestionsSearch() {
  clearTimeout(qSearchTimeout);
  qSearchTimeout = setTimeout(loadQuestionsTable, 300);
}

async function loadQuestionsTable() {
  const specialty = document.getElementById('q-filter-specialty')?.value || 'all';
  const status = document.getElementById('q-filter-status')?.value || 'all';
  const search = document.getElementById('q-search')?.value.trim() || '';

  const tbody = document.getElementById('questions-tbody');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-500"><i class="fa-solid fa-spinner fa-spin mr-2"></i>질문 목록을 불러오는 중...</td></tr>`;

  try {
    const url = `/ko/api/forum_admin.php?action=questions&specialty=${encodeURIComponent(specialty)}&status=${encodeURIComponent(status)}&q=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    const json = await res.json();
    if (!json.success) {
      tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-red-400">데이터 로드 실패</td></tr>`;
      return;
    }

    allQuestions = json.data || [];

    // Populate specialty filter dropdown if empty
    const sel = document.getElementById('q-filter-specialty');
    if (sel && sel.options.length <= 1) {
      if (allCategories.length > 0) {
        const catGroup = document.createElement('optgroup');
        catGroup.label = '5대 핵심 오픈 포럼';
        allCategories.forEach(cat => {
          const opt = document.createElement('option');
          opt.value = cat.id;
          opt.innerText = cat.name_ko;
          catGroup.appendChild(opt);
        });
        sel.appendChild(catGroup);
      }
      if (allSubSpecialties.length > 0) {
        const subGroup = document.createElement('optgroup');
        subGroup.label = '의학포럼 19대 전문 진료과목';
        allSubSpecialties.forEach(sub => {
          const opt = document.createElement('option');
          opt.value = sub.id;
          opt.innerText = '↳ ' + sub.name_ko;
          subGroup.appendChild(opt);
        });
        sel.appendChild(subGroup);
      }
    }

    if (allQuestions.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-500">조건에 맞는 질문이 없습니다.</td></tr>`;
      return;
    }

    tbody.innerHTML = allQuestions.map(q => {
      const cat = q.category || q.specialty || {};
      const sub = q.subSpecialty || null;
      const statusPill = (q.status === 'active')
        ? `<span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">공개</span>`
        : (q.status === 'flagged')
        ? `<span class="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">신고됨</span>`
        : `<span class="bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full text-[10px] font-bold">숨김</span>`;

      return `
        <tr class="hover:bg-slate-700/30 transition-colors">
          <td class="py-3.5 px-4 font-bold text-blue-400 whitespace-nowrap">
            <div class="flex flex-col gap-1">
              <span class="inline-flex items-center gap-1.5 text-xs text-white">
                <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${cat.color || '#3b82f6'}"></span>
                <span>${escapeHtml(cat.name_ko || '게시판')}</span>
              </span>
              ${sub ? `<span class="text-[10px] text-cyan-300 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800/60 self-start">↳ ${escapeHtml(sub.name_ko)}</span>` : ''}
            </div>
          </td>
          <td class="py-3.5 px-4">
            <div class="font-bold text-white max-w-md truncate hover:text-blue-300 cursor-pointer" onclick='openQModal(${JSON.stringify(q).replace(/'/g, "&#39;")})'>
              ${escapeHtml(q.title)}
            </div>
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap">
            <div class="flex items-center gap-2">
              <img src="${q.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80'}" class="w-5 h-5 rounded-full object-cover">
              <span class="text-slate-300">${escapeHtml(q.authorName || '익명')}</span>
              ${q.authorBadge ? '<span class="text-[9px] bg-emerald-600 text-white font-bold px-1 rounded">의료진</span>' : ''}
            </div>
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap text-slate-400">
            💬 ${q.replyCount ?? 0} / 👁 ${q.viewCount ?? 0}
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap">
            ${statusPill}
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap text-slate-500">
            ${(q.createdAt || '').substring(0, 10)}
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick='openQModal(${JSON.stringify(q).replace(/'/g, "&#39;")})' class="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all" title="상세보기 및 진료과 변경">
                <i class="fa-regular fa-eye text-[11px]"></i>
                <span>상세</span>
              </button>
              ${q.status === 'active' 
                ? `<button onclick="toggleQStatus('${q.id}', 'hidden')" class="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer" title="임시 숨김 처리 (목록에서 제외)">
                    <i class="fa-solid fa-eye-slash text-[11px]"></i>
                    <span>숨김</span>
                   </button>`
                : `<button onclick="toggleQStatus('${q.id}', 'active')" class="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer" title="공개 복구 처리">
                    <i class="fa-solid fa-check text-[11px]"></i>
                    <span>공개</span>
                   </button>`
              }
              <button onclick="deleteQuestion('${q.id}')" class="px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/40 text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer" title="영구 삭제 (Erase)">
                <i class="fa-solid fa-trash-can text-[11px]"></i>
                <span>삭제</span>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-red-400">서버 통신 오류</td></tr>`;
  }
}

// Toggle Question Status
async function toggleQStatus(id, newStatus) {
  try {
    const res = await fetch('/ko/api/forum_admin.php?action=moderate_question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, status: newStatus })
    });
    const json = await res.json();
    if (json.success) {
      loadQuestionsTable();
      loadDashboardStats();
    } else {
      alert(json.error || '상태 변경 실패');
    }
  } catch(e) {
    alert('오류가 발생했습니다.');
  }
}

// Delete Question (Erase)
async function deleteQuestion(id) {
  if (!confirm('이 질문과 등록된 모든 답변을 데이터베이스에서 영구적으로 완전히 삭제(Erase)하시겠습니까?\n이 작업은 취소할 수 없습니다.')) return;

  try {
    const res = await fetch('/ko/api/forum_admin.php?action=delete_question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    });
    const json = await res.json();
    if (json.success) {
      loadQuestionsTable();
      loadDashboardStats();
    } else {
      alert(json.error || '삭제 실패');
    }
  } catch(e) {
    alert('오류가 발생했습니다.');
  }
}

// 3. Load Answers Table
let aSearchTimeout = null;
function debounceAnswersSearch() {
  clearTimeout(aSearchTimeout);
  aSearchTimeout = setTimeout(loadAnswersTable, 300);
}

async function loadAnswersTable() {
  const status = document.getElementById('a-filter-status')?.value || 'all';
  const search = document.getElementById('a-search')?.value.trim() || '';

  const tbody = document.getElementById('answers-tbody');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-500"><i class="fa-solid fa-spinner fa-spin mr-2"></i>답변 목록 로딩 중...</td></tr>`;

  try {
    const url = `/ko/api/forum_admin.php?action=answers&status=${encodeURIComponent(status)}&q=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    const json = await res.json();
    if (!json.success) return;

    allAnswers = json.data || [];
    if (allAnswers.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-500">답변 데이터가 없습니다.</td></tr>`;
      return;
    }

    tbody.innerHTML = allAnswers.map(a => {
      const isClinician = (a.authorBadge && a.authorBadge.includes('Clinician'));
      return `
        <tr class="hover:bg-slate-700/30 transition-colors">
          <td class="py-3.5 px-4 text-blue-400 font-bold max-w-xs truncate">
            <a href="/ko/forum/topic/${encodeURIComponent(a.questionId)}" target="_blank" class="hover:underline">
              ${escapeHtml(a.questionTitle || '원문 보기')}
            </a>
          </td>
          <td class="py-3.5 px-4 text-slate-200 max-w-sm truncate cursor-pointer hover:text-white" onclick='openAModal(${JSON.stringify(a).replace(/'/g, "&#39;")})' title="답변 전체 내용 보기">
            ${escapeHtml(a.body)}
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap">
            <div class="flex items-center gap-1.5">
              <span class="text-slate-300 font-medium">${escapeHtml(a.authorName || '작성자')}</span>
              ${isClinician ? '<span class="text-[9px] bg-emerald-600 text-white font-extrabold px-1 rounded">전문의</span>' : ''}
            </div>
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap text-red-400 font-bold">
            ❤️ ${a.upvotes ?? 0}
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap">
            ${a.status === 'active' 
              ? '<span class="text-emerald-400 bg-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">공개</span>'
              : '<span class="text-slate-400 bg-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">숨김</span>'
            }
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap text-slate-500">
            ${(a.createdAt || '').substring(0, 10)}
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick='openAModal(${JSON.stringify(a).replace(/'/g, "&#39;")})' class="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all" title="답변 상세보기">
                <i class="fa-regular fa-eye text-[11px]"></i>
                <span>상세</span>
              </button>
              ${a.status === 'active'
                ? `<button onclick="toggleAnswerStatus('${a.id}', 'hidden')" class="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer" title="임시 숨김 처리">
                    <i class="fa-solid fa-eye-slash text-[11px]"></i>
                    <span>숨김</span>
                   </button>`
                : `<button onclick="toggleAnswerStatus('${a.id}', 'active')" class="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer" title="공개 복구 처리">
                    <i class="fa-solid fa-check text-[11px]"></i>
                    <span>공개</span>
                   </button>`
              }
              <button onclick="deleteAnswer('${a.id}')" class="px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/40 text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer" title="답변 영구 삭제 (Erase)">
                <i class="fa-solid fa-trash-can text-[11px]"></i>
                <span>삭제</span>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-red-400">데이터를 불러오지 못했습니다.</td></tr>`;
  }
}

async function toggleAnswerStatus(id, newStatus) {
  try {
    const res = await fetch('/ko/api/forum_admin.php?action=moderate_answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, status: newStatus })
    });
    const json = await res.json();
    if (json.success) {
      loadAnswersTable();
      loadDashboardStats();
    }
  } catch(e) {}
}

async function deleteAnswer(id) {
  if (!confirm('이 답변을 데이터베이스에서 영구적으로 삭제(Erase)하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) return;
  try {
    const res = await fetch('/ko/api/forum_admin.php?action=delete_answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    });
    const json = await res.json();
    if (json.success) {
      loadAnswersTable();
      loadDashboardStats();
    } else {
      alert(json.error || '답변 삭제 실패');
    }
  } catch(e) {
    alert('오류가 발생했습니다.');
  }
}

// Answer Detail Modal Handlers
let currentModalAnswer = null;

function openAModal(a) {
  currentModalAnswer = a;
  const statusEl = document.getElementById('modal-a-status');
  if (statusEl) {
    statusEl.innerText = a.status === 'active' ? '공개중' : '숨김';
    statusEl.className = a.status === 'active' ? 'text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-700 text-slate-300';
  }
  const authorEl = document.getElementById('modal-a-author');
  if (authorEl) authorEl.innerText = `작성자: ${a.authorName || '익명'} • 작성일: ${(a.createdAt || '').substring(0, 10)}`;

  const qTitleEl = document.getElementById('modal-a-qtitle');
  if (qTitleEl) qTitleEl.innerText = `대상 질문: ${a.questionTitle || '원문 보기'}`;

  const bodyEl = document.getElementById('modal-a-body');
  if (bodyEl) bodyEl.innerText = a.body || '';

  const toggleBtn = document.getElementById('modal-a-toggle-status-btn');
  if (toggleBtn) {
    if (a.status === 'active') {
      toggleBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> <span>숨김으로 변경</span>';
      toggleBtn.className = 'px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer';
    } else {
      toggleBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>공개로 변경</span>';
      toggleBtn.className = 'px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer';
    }
  }

  const modal = document.getElementById('modal-a-detail');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeAModal() {
  const modal = document.getElementById('modal-a-detail');
  if (modal) {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }
}

async function deleteAnswerFromModal() {
  if (!currentModalAnswer || !currentModalAnswer.id) return;
  if (!confirm('이 답변을 데이터베이스에서 영구적으로 삭제(Erase)하시겠습니까?\n이 작업은 취소할 수 없습니다.')) return;
  try {
    const res = await fetch('/ko/api/forum_admin.php?action=delete_answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: currentModalAnswer.id })
    });
    const json = await res.json();
    if (json.success) {
      closeAModal();
      loadAnswersTable();
      loadDashboardStats();
    } else {
      alert(json.error || '답변 삭제 실패');
    }
  } catch(e) {
    alert('오류가 발생했습니다.');
  }
}

async function toggleAnswerStatusFromModal() {
  if (!currentModalAnswer || !currentModalAnswer.id) return;
  const newStatus = currentModalAnswer.status === 'active' ? 'hidden' : 'active';
  try {
    const res = await fetch('/ko/api/forum_admin.php?action=moderate_answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: currentModalAnswer.id, status: newStatus })
    });
    const json = await res.json();
    if (json.success) {
      currentModalAnswer.status = newStatus;
      openAModal(currentModalAnswer);
      loadAnswersTable();
      loadDashboardStats();
    }
  } catch(e) {}
}

// 4. Load Users & Clinicians Table
// 4. Load Users & Clinicians Table & Doctor Emails List
async function loadUsersTable() {
  const tbody = document.getElementById('users-tbody');
  const docEmailsList = document.getElementById('doctor-emails-list');
  const docEmailsCount = document.getElementById('doc-emails-count');

  if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-500"><i class="fa-solid fa-spinner fa-spin mr-2"></i>회원 명단 불러오는 중...</td></tr>`;

  try {
    const res = await fetch('/ko/api/forum_admin.php?action=users');
    const json = await res.json();
    if (!json.success) return;

    allUsers = json.data || [];
    const docEmails = json.doctor_emails || [];

    // Render registered Doctor Gmail cards
    if (docEmailsCount) docEmailsCount.innerText = docEmails.length;
    if (docEmailsList) {
      if (docEmails.length === 0) {
        docEmailsList.innerHTML = `<p class="col-span-full text-xs text-slate-500 py-3 text-center">등록된 전문의 Gmail이 없습니다. 위 입력창에서 의사 Gmail을 등록해 주세요.</p>`;
      } else {
        docEmailsList.innerHTML = docEmails.map(d => `
          <div class="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5">
                <i class="fa-solid fa-stethoscope text-emerald-400 text-xs shrink-0"></i>
                <span class="text-xs font-bold text-white truncate font-mono">${escapeHtml(d.email)}</span>
              </div>
              <p class="text-[11px] text-emerald-300/90 truncate mt-0.5">${escapeHtml(d.title || '전문의 (MD)')}</p>
            </div>
            <button onclick="removeDoctorEmail('${escapeHtml(d.email)}')" class="shrink-0 text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors" title="전문의 등록 삭제">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        `).join('');
      }
    }

    // Render registered users
    if (tbody) {
      if (allUsers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-500">가입된 회원이 없습니다.</td></tr>`;
        return;
      }
      tbody.innerHTML = allUsers.map(u => {
        const isClinician = Boolean(u.isVerifiedClinician);
        const isBanned = Boolean(u.isBanned);

        return `
          <tr class="hover:bg-slate-700/30 transition-colors">
            <td class="py-3.5 px-4 whitespace-nowrap">
              <div class="flex items-center gap-2.5">
                <img src="${u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80'}" class="w-8 h-8 rounded-full object-cover border border-slate-700">
                <div>
                  <span class="font-bold text-white text-xs block">${escapeHtml(u.name || '회원')}</span>
                  <span class="text-[10px] text-slate-500 font-mono">ID: ${escapeHtml(u.id)}</span>
                </div>
              </div>
            </td>
            <td class="py-3.5 px-4 text-slate-300 whitespace-nowrap font-mono text-xs">
              ${escapeHtml(u.email || '-')}
            </td>
            <td class="py-3.5 px-4 whitespace-nowrap">
              ${isClinician 
                ? '<span class="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold px-2.5 py-1 rounded-full"><i class="fa-solid fa-circle-check mr-1"></i>인증 전문의</span>'
                : '<span class="bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-full">일반 회원</span>'
              }
            </td>
            <td class="py-3.5 px-4 text-slate-300 text-xs">
              ${escapeHtml(u.clinicianTitle || '-')}
            </td>
            <td class="py-3.5 px-4 whitespace-nowrap">
              ${isBanned 
                ? '<span class="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">활동 정지</span>'
                : '<span class="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">정상</span>'
              }
            </td>
            <td class="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
              ${isClinician 
                ? `<button onclick="toggleVerifiedClinician('${u.id}', false)" class="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">배지 해제</button>`
                : `<button onclick="promptClinicianBadge('${u.id}', '${escapeHtml(u.name)}')" class="px-3 py-1 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">전문의 배지 부여</button>`
              }
              ${isBanned 
                ? `<button onclick="toggleBanUser('${u.id}', false)" class="px-3 py-1 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold">정지 해제</button>`
                : `<button onclick="toggleBanUser('${u.id}', true)" class="px-3 py-1 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-semibold">계정 차단</button>`
              }
            </td>
          </tr>
        `;
      }).join('');
    }
  } catch(e) {
    if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-red-400">데이터를 불러오지 못했습니다.</td></tr>`;
  }
}

// Add Doctor Gmail Submission
async function handleAddDoctorEmail(e) {
  e.preventDefault();
  const emailInput = document.getElementById('doc-email-input');
  const titleInput = document.getElementById('doc-title-input');
  const btn = document.getElementById('btn-add-doctor');

  const email = emailInput?.value.trim() || '';
  const title = titleInput?.value.trim() || '전문의 (MD)';

  if (!email) {
    alert('전문의 Gmail 주소를 입력해주세요.');
    return;
  }

  if (btn) btn.disabled = true;

  try {
    const res = await fetch('/ko/api/forum_admin.php?action=add_doctor_email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, title: title })
    });
    const json = await res.json();
    if (json.success) {
      if (emailInput) emailInput.value = '';
      if (titleInput) titleInput.value = '';
      loadUsersTable();
      loadDashboardStats();
      alert(json.message || '전문의 Gmail이 등록되었습니다.');
    } else {
      alert(json.error || '등록에 실패했습니다.');
    }
  } catch(err) {
    alert('오류가 발생했습니다.');
  } finally {
    if (btn) btn.disabled = false;
  }
}

// Remove Doctor Gmail
async function removeDoctorEmail(email) {
  if (!confirm(`'${email}' 전문의 등록을 취소하시겠습니까?\n해당 사용자의 의사 인증 배지가 해제됩니다.`)) return;

  try {
    const res = await fetch('/ko/api/forum_admin.php?action=remove_doctor_email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    });
    const json = await res.json();
    if (json.success) {
      loadUsersTable();
      loadDashboardStats();
    } else {
      alert(json.error || '삭제 실패');
    }
  } catch(err) {
    alert('오류가 발생했습니다.');
  }
}

function promptClinicianBadge(userId, userName) {
  const title = prompt(`'${userName}' 님에게 부여할 전문의 직함을 입력하세요:\n(예: 순환기내과 전문의 / 가정의학과 전문의)`, '전문의 (MD)');
  if (title === null) return;
  toggleVerifiedClinician(userId, true, title);
}

async function toggleVerifiedClinician(userId, isVerified, title = '') {
  try {
    const res = await fetch('/ko/api/forum_admin.php?action=toggle_verified_clinician', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId, isVerified: isVerified, clinicianTitle: title })
    });
    const json = await res.json();
    if (json.success) {
      loadUsersTable();
      loadDashboardStats();
    }
  } catch(e) {}
}

async function toggleBanUser(userId, isBanned) {
  const msg = isBanned ? '해당 사용자를 활동 정지(차단)하시겠습니까?' : '해당 사용자의 활동 정지를 해제하시겠습니까?';
  if (!confirm(msg)) return;

  try {
    const res = await fetch('/ko/api/forum_admin.php?action=toggle_ban_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId, isBanned: isBanned })
    });
    const json = await res.json();
    if (json.success) {
      loadUsersTable();
      loadDashboardStats();
    }
  } catch(e) {}
}

// 5. Load 5 Core Categories & 19 Medical Sub-Specialties Grid
function loadSpecialtiesGrid() {
  const container = document.getElementById('specialties-full-grid');
  if (!container) return;

  let html = `
    <div class="col-span-full mb-2">
      <h3 class="text-sm font-extrabold text-blue-400 flex items-center gap-2 mb-1">
        <i class="fa-solid fa-layer-group"></i>
        <span>5대 핵심 오픈 포럼 카테고리 (5 Core Categories)</span>
      </h3>
      <p class="text-xs text-slate-400">커뮤니티 단순화 및 SEO 최적화를 위해 통합된 5대 핵심 카테고리입니다.</p>
    </div>
  `;

  if (allCategories.length > 0) {
    html += allCategories.map(cat => `
      <div class="bg-slate-800/90 border border-slate-700/90 rounded-2xl p-5 relative overflow-hidden" style="border-left: 4px solid ${cat.color || '#3b82f6'};">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center text-lg text-white shadow" style="background-color: ${cat.color}">
            <i class="fa-solid ${cat.icon || 'fa-layer-group'}"></i>
          </div>
          <div>
            <h3 class="font-bold text-white text-sm">${escapeHtml(cat.name_ko)}</h3>
            <p class="text-xs text-slate-400 font-mono">${escapeHtml(cat.name_en || '')}</p>
          </div>
          <span class="ml-auto text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-blue-400">
            ${cat.questionCount ?? (cat.count ?? 0)}건
          </span>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">${escapeHtml(cat.description || '')}</p>
      </div>
    `).join('');
  }

  html += `
    <div class="col-span-full mt-6 mb-2 pt-6 border-t border-slate-700">
      <h3 class="text-sm font-extrabold text-cyan-400 flex items-center gap-2 mb-1">
        <i class="fa-solid fa-stethoscope"></i>
        <span>의학포럼 19대 세부 전문 진료과목 (19 Sub-Specialties)</span>
      </h3>
      <p class="text-xs text-slate-400">사용자가 '의학포럼'을 열었을 때 상단에 표시되는 19개 진료과 서브 리스트입니다.</p>
    </div>
  `;

  if (allSubSpecialties.length > 0) {
    html += allSubSpecialties.map(sub => `
      <div class="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0" style="background-color: ${sub.color}22; color: ${sub.color}">
          <i class="fa-solid ${sub.icon || 'fa-stethoscope'}"></i>
        </div>
        <div class="min-w-0 flex-1">
          <h4 class="text-xs font-bold text-white truncate">${escapeHtml(sub.name_ko)}</h4>
          <span class="text-[10px] text-slate-400 font-mono truncate block">${escapeHtml(sub.name_en || '')}</span>
        </div>
        <span class="text-xs font-bold text-cyan-400 shrink-0">${sub.questionCount ?? 0}건</span>
      </div>
    `).join('');
  }

  container.innerHTML = html;
}

// Settings Tab: Clinical Disclaimer Management
function loadSettingsTab() {
  const input = document.getElementById('setting-disclaimer-input');
  if (input && currentDisclaimer) {
    input.value = currentDisclaimer;
  }
}

function resetDefaultDisclaimer() {
  const input = document.getElementById('setting-disclaimer-input');
  if (input) {
    input.value = '본 포럼의 정보는 교육 및 일반 정보 제공 목적이며 전문 진료를 대체하지 않습니다';
  }
}

async function handleSaveDisclaimer() {
  const input = document.getElementById('setting-disclaimer-input');
  const btn = document.getElementById('btn-save-disclaimer');
  const text = input ? input.value.trim() : '';
  if (!text) {
    alert('면책 조항 문구를 입력해 주세요.');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 저장 중...';

  try {
    const res = await fetch('/ko/api/forum_admin.php?action=update_disclaimer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disclaimer: text })
    });
    const data = await res.json();
    if (data.success) {
      currentDisclaimer = text;
      alert('면책 조항 설정이 성공적으로 저장되었습니다.\n포럼 전역(메인, 카테고리, 질문 상세, 글작성)에 실시간 반영됩니다.');
    } else {
      alert(data.error || '저장에 실패했습니다.');
    }
  } catch (err) {
    alert('저장 통신 오류가 발생했습니다.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> <span>면책 조항 설정 저장</span>';
  }
}

// Question Detail Modal
let currentModalQuestion = null;

function openQModal(q) {
  currentModalQuestion = q;
  const cat = q.category || q.specialty || {};
  const sub = q.subSpecialty || null;
  const currentSpecialtyId = q.subSpecialtyId || q.specialtyId || cat.id || '';

  const specialtyBadge = document.getElementById('modal-q-specialty');
  if (specialtyBadge) {
    specialtyBadge.innerText = sub ? `${cat.name_ko} > ${sub.name_ko}` : (cat.name_ko || '게시판');
    if (cat.color) {
      specialtyBadge.style.backgroundColor = cat.color + '22';
      specialtyBadge.style.color = cat.color;
      specialtyBadge.style.borderColor = cat.color + '44';
    }
  }

  // Populate specialty select options with optgroups
  const sel = document.getElementById('modal-q-specialty-select');
  if (sel) {
    let optionsHtml = '';
    if (allCategories.length > 0) {
      optionsHtml += '<optgroup label="5대 핵심 카테고리">';
      allCategories.forEach(c => {
        optionsHtml += `<option value="${c.id}" ${c.id === currentSpecialtyId ? 'selected' : ''}>${escapeHtml(c.name_ko)} (${escapeHtml(c.name_en || c.id)})</option>`;
      });
      optionsHtml += '</optgroup>';
    }
    if (allSubSpecialties.length > 0) {
      optionsHtml += '<optgroup label="의학포럼 19대 전문 진료과목">';
      allSubSpecialties.forEach(s => {
        optionsHtml += `<option value="${s.id}" ${s.id === currentSpecialtyId ? 'selected' : ''}>↳ ${escapeHtml(s.name_ko)} (${escapeHtml(s.name_en || s.id)})</option>`;
      });
      optionsHtml += '</optgroup>';
    }
    sel.innerHTML = optionsHtml;
    sel.value = currentSpecialtyId;
  }

  const statusEl = document.getElementById('modal-q-status');
  if (statusEl) {
    statusEl.innerText = q.status === 'active' ? '공개중' : (q.status === 'hidden' ? '숨김' : '신고됨');
    statusEl.className = q.status === 'active' ? 'text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-700 text-slate-300';
  }

  const toggleBtn = document.getElementById('modal-q-toggle-status-btn');
  if (toggleBtn) {
    if (q.status === 'active') {
      toggleBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> <span>숨김으로 변경</span>';
      toggleBtn.className = 'px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer';
    } else {
      toggleBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>공개로 변경</span>';
      toggleBtn.className = 'px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer';
    }
  }

  document.getElementById('modal-q-title').innerText = q.title;
  document.getElementById('modal-q-author').innerText = `작성자: ${q.authorName || '익명'}`;
  document.getElementById('modal-q-date').innerText = `작성일: ${(q.createdAt || '').substring(0, 10)}`;
  document.getElementById('modal-q-body').innerText = q.body;

  const modal = document.getElementById('modal-q-detail');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

async function deleteQuestionFromModal() {
  if (!currentModalQuestion || !currentModalQuestion.id) return;
  if (!confirm(`'${currentModalQuestion.title || '이 질문'}'과(와) 관련된 모든 답변을 영구적으로 삭제(Erase)하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return;

  try {
    const res = await fetch('/ko/api/forum_admin.php?action=delete_question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: currentModalQuestion.id })
    });
    const json = await res.json();
    if (json.success) {
      closeQModal();
      loadQuestionsTable();
      loadDashboardStats();
      alert('질문 및 관련 답변이 영구 삭제되었습니다.');
    } else {
      alert(json.error || '삭제 실패');
    }
  } catch (e) {
    alert('오류가 발생했습니다.');
  }
}

async function toggleQStatusFromModal() {
  if (!currentModalQuestion || !currentModalQuestion.id) return;
  const newStatus = currentModalQuestion.status === 'active' ? 'hidden' : 'active';
  try {
    const res = await fetch('/ko/api/forum_admin.php?action=moderate_question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: currentModalQuestion.id, status: newStatus })
    });
    const json = await res.json();
    if (json.success) {
      currentModalQuestion.status = newStatus;
      const statusEl = document.getElementById('modal-q-status');
      if (statusEl) {
        statusEl.innerText = newStatus === 'active' ? '공개중' : '숨김';
        statusEl.className = newStatus === 'active' ? 'text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-700 text-slate-300';
      }
      const toggleBtn = document.getElementById('modal-q-toggle-status-btn');
      if (toggleBtn) {
        if (newStatus === 'active') {
          toggleBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> <span>숨김으로 변경</span>';
          toggleBtn.className = 'px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer';
        } else {
          toggleBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>공개로 변경</span>';
          toggleBtn.className = 'px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer';
        }
      }
      loadQuestionsTable();
      loadDashboardStats();
    } else {
      alert(json.error || '상태 변경 실패');
    }
  } catch (e) {
    alert('오류가 발생했습니다.');
  }
}

async function saveQuestionSpecialty() {
  if (!currentModalQuestion || !currentModalQuestion.id) return;
  const sel = document.getElementById('modal-q-specialty-select');
  if (!sel) return;
  const newSpecialtyId = sel.value;
  const saveBtn = document.getElementById('modal-q-specialty-save-btn');

  try {
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> 저장 중...`;
    }

    const res = await fetch('/ko/api/forum_admin.php?action=update_question_specialty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: currentModalQuestion.id, specialty_id: newSpecialtyId })
    });
    const json = await res.json();

    if (!json.success) {
      alert(json.error || '진료과 변경에 실패했습니다.');
      return;
    }

    // Find new category or sub-specialty info
    const matched = allCategories.find(sp => sp.id === newSpecialtyId) || allSubSpecialties.find(sp => sp.id === newSpecialtyId);
    if (matched) {
      currentModalQuestion.specialtyId = newSpecialtyId;
      currentModalQuestion.specialty = matched;

      const badge = document.getElementById('modal-q-specialty');
      if (badge) {
        badge.innerText = matched.name_ko;
        badge.style.backgroundColor = (matched.color || '#3b82f6') + '22';
        badge.style.color = matched.color || '#3b82f6';
        badge.style.borderColor = (matched.color || '#3b82f6') + '44';
      }
    }

    if (saveBtn) {
      saveBtn.innerHTML = `<i class="fa-solid fa-check text-emerald-300"></i> 변경 완료!`;
      setTimeout(() => {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `<i class="fa-solid fa-check"></i> <span>변경 저장</span>`;
      }, 1500);
    }

    // Refresh questions table and overview stats in background
    loadQuestionsTable();
    loadForumStats();
  } catch (err) {
    console.error('Error updating question specialty:', err);
    alert('서버 통신 중 오류가 발생했습니다.');
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = `<i class="fa-solid fa-check"></i> <span>변경 저장</span>`;
    }
  }
}

function closeQModal() {
  const modal = document.getElementById('modal-q-detail');
  modal.classList.remove('flex');
  modal.classList.add('hidden');
}

// Logout
async function handleLogout() {
  await fetch('/ko/api/auth.php?action=logout');
  window.location.href = '/ko/admin2/login.php';
}

function empty(v) {
  return !v || v === '0' || v === 0 || v === false;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// =============================================================
// 6. Events Management & Poster Upload
// =============================================================
async function loadEventsSection() {
  const tbody = document.getElementById('events-tbody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-500"><i class="fa-solid fa-spinner fa-spin mr-2"></i>이벤트 목록을 불러오는 중...</td></tr>`;

  try {
    const res = await fetch('/ko/api/forum_admin.php?action=events');
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) {
      tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-red-400">이벤트 목록 로드 실패</td></tr>`;
      return;
    }

    const events = json.data;
    if (events.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-500">등록된 공식 이벤트가 없습니다. 상단에서 새로운 이벤트를 등록해보세요.</td></tr>`;
      return;
    }

    tbody.innerHTML = events.map(ev => {
      const poster = (ev.images && ev.images.length > 0) ? ev.images[0] : null;
      const dateStr = ev.createdAt ? new Date(ev.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

      return `
        <tr class="hover:bg-slate-700/30 transition-colors">
          <td class="py-3 px-4">
            ${poster ? `
              <div class="w-14 h-14 rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                <img src="${escapeHtml(poster)}" class="w-full h-full object-cover" alt="포스터">
              </div>
            ` : `
              <div class="w-14 h-14 rounded-lg border border-dashed border-slate-700 bg-slate-900/60 flex items-center justify-center text-slate-500 text-xs">
                포스터 없음
              </div>
            `}
          </td>
          <td class="py-3 px-4">
            <a href="/ko/forum/topic/${encodeURIComponent(ev.id)}" target="_blank" class="font-bold text-white hover:text-rose-400 transition-colors line-clamp-2">
              ${escapeHtml(ev.title)}
            </a>
            <p class="text-[11px] text-slate-400 mt-1 line-clamp-1">${escapeHtml(ev.body)}</p>
          </td>
          <td class="py-3 px-4 text-slate-300 whitespace-nowrap">
            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold border border-rose-500/30">
              <i class="fa-solid fa-shield-halved text-[10px]"></i> HAC 공식
            </span>
          </td>
          <td class="py-3 px-4 text-slate-400 whitespace-nowrap">
            <span class="text-white font-bold">${ev.viewCount ?? 0}</span>회 / <span class="text-white font-bold">${ev.replyCount ?? 0}</span>개
          </td>
          <td class="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
            ${dateStr}
          </td>
          <td class="py-3 px-4 text-right whitespace-nowrap space-x-1">
            <a href="/ko/forum/topic/${encodeURIComponent(ev.id)}" target="_blank" 
               class="px-2.5 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-semibold text-xs transition-colors inline-flex items-center gap-1">
              <span>보기</span>
              <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
            </a>
            <button onclick="handleDeleteEvent('${escapeHtml(ev.id)}')" 
                    class="px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold text-xs transition-colors inline-flex items-center gap-1">
              <i class="fa-solid fa-trash-can text-[10px]"></i>
              <span>삭제</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  } catch(err) {
    console.error('Error loading events:', err);
    tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-red-400">통신 오류 발생</td></tr>`;
  }
}

async function handlePosterUpload(input) {
  const file = input.files?.[0];
  if (!file) return;

  if (!file.type.match(/^image\/(jpeg|png|webp|gif)/i)) {
    alert('JPEG, PNG, WEBP 이미지 파일만 업로드할 수 있습니다.');
    input.value = '';
    return;
  }
  if (file.size > 12 * 1024 * 1024) {
    alert('파일 크기가 너무 큽니다 (최대 12MB).');
    input.value = '';
    return;
  }

  const spinner = document.getElementById('poster-upload-spinner');
  const dropArea = document.getElementById('poster-drop-area');
  const previewBox = document.getElementById('poster-preview-box');
  const previewImg = document.getElementById('poster-preview-img');
  const hiddenUrl = document.getElementById('event-poster-url');

  spinner.classList.remove('hidden');
  dropArea.classList.add('hidden');

  const formData = new FormData();
  formData.append('poster', file);

  try {
    const res = await fetch('/ko/api/forum_admin.php?action=upload_poster', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success && data.url) {
      previewImg.src = data.url;
      hiddenUrl.value = data.url;
      previewBox.classList.remove('hidden');
    } else {
      alert(data.error || '포스터 업로드에 실패했습니다.');
      dropArea.classList.remove('hidden');
    }
  } catch(err) {
    alert('포스터 업로드 통신 오류가 발생했습니다.');
    dropArea.classList.remove('hidden');
  } finally {
    spinner.classList.add('hidden');
    input.value = '';
  }
}

function removeEventPoster() {
  const dropArea = document.getElementById('poster-drop-area');
  const previewBox = document.getElementById('poster-preview-box');
  const previewImg = document.getElementById('poster-preview-img');
  const hiddenUrl = document.getElementById('event-poster-url');
  const fileInput = document.getElementById('event-poster-file');

  if (previewImg) previewImg.src = '';
  if (hiddenUrl) hiddenUrl.value = '';
  if (fileInput) fileInput.value = '';
  if (previewBox) previewBox.classList.add('hidden');
  if (dropArea) dropArea.classList.remove('hidden');
}

async function handleCreateEvent(e) {
  e.preventDefault();

  const title = document.getElementById('event-title').value.trim();
  const body = document.getElementById('event-body').value.trim();
  const poster = document.getElementById('event-poster-url')?.value.trim() || '';
  const sendBroadcast = document.getElementById('event-broadcast')?.checked ?? true;

  if (!title || !body) {
    alert('이벤트 제목과 상세 내용을 입력해주세요.');
    return;
  }

  if (sendBroadcast) {
    const confirmed = confirm('새 이벤트를 등록하고 포럼에 가입한 모든 회원에게 알림 이메일을 발송하시겠습니까?');
    if (!confirmed) return;
  }

  const btn = document.getElementById('btn-submit-event');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 이벤트 등록 및 이메일 발송 중...';

  try {
    const res = await fetch('/ko/api/forum_admin.php?action=create_event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title,
        body: body,
        poster: poster,
        send_broadcast: sendBroadcast
      })
    });

    const data = await res.json();
    if (data.success) {
      alert(data.message || '이벤트가 성공적으로 등록되었습니다.');
      // Reset form
      document.getElementById('event-form').reset();
      removeEventPoster();
      loadEventsSection();
    } else {
      alert(data.error || '이벤트 등록 실패');
    }
  } catch(err) {
    alert('이벤트 등록 처리 중 통신 오류가 발생했습니다.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-bullhorn"></i> <span>이벤트 등록 및 전체 알림 발송</span>';
  }
}

async function handleDeleteEvent(id) {
  if (!confirm('정말 이 이벤트를 삭제하시겠습니까? 관련 댓글 및 기록이 모두 삭제됩니다.')) {
    return;
  }

  try {
    const res = await fetch('/ko/api/forum_admin.php?action=delete_question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    });
    const data = await res.json();
    if (data.success) {
      loadEventsSection();
    } else {
      alert(data.error || '삭제 실패');
    }
  } catch(err) {
    alert('삭제 통신 오류가 발생했습니다.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardStats();
});
