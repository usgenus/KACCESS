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
  if (tabId === 'reported-listings') loadReportedListingsTable();
  if (tabId === 'answers') loadAnswersTable();
  if (tabId === 'users') loadUsersTable();
  if (tabId === 'events') loadEventsSection();
  if (tabId === 'club-rooms') loadClubRooms();
  if (tabId === 'specialties') loadSpecialtiesGrid();
  if (tabId === 'featured-ads') loadFeaturedAdsTable();
  if (tabId === 'settings') loadSettingsTab();
}

// 1. Load Dashboard Statistics
async function loadDashboardStats() {
  try {
    const res = await fetch('/api/forum_admin.php?action=stats');
    if (res.status === 401) {
      window.location.href = '/admin2/login.php';
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

    // Check reported listings badge
    fetch('/api/forum_admin.php?action=reported_listings')
      .then(r => r.json())
      .then(rj => {
        if (rj.success && Array.isArray(rj.data)) {
          const pending = rj.data.filter(it => it.status === 'pending').reduce((sum, it) => sum + (it.reportCount || 0), 0);
          const navBadge = document.getElementById('badge-nav-reports');
          if (navBadge) {
            if (pending > 0) {
              navBadge.innerText = pending;
              navBadge.classList.remove('hidden');
            } else {
              navBadge.classList.add('hidden');
            }
          }
        }
      }).catch(() => {});

    allCategories = data.categories || [];
    allSubSpecialties = data.subSpecialties || [];
    allSpecialties = allCategories;
    currentDisclaimer = data.disclaimer || '본 포럼의 정보는 교육 및 일반 정보 제공 목적이며 전문 진료를 대체하지 않습니다';

    // Populate category filter dropdown for questions table
    populateCategoryFilterDropdown();

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

// Helper to populate category filter dropdown
function populateCategoryFilterDropdown() {
  const sel = document.getElementById('q-filter-specialty');
  if (!sel || !Array.isArray(allCategories) || allCategories.length === 0) return;
  const currentVal = sel.value || 'all';

  let optionsHtml = '<option value="all">전체 카테고리 &amp; 서브게시판</option>';
  allCategories.forEach(cat => {
    optionsHtml += `<optgroup label="${escapeHtml(cat.name_ko)}">`;
    optionsHtml += `<option value="${escapeHtml(cat.id)}">[전체] ${escapeHtml(cat.name_ko)}</option>`;
    const subs = cat.subBoards || [];
    subs.forEach(s => {
      optionsHtml += `<option value="${escapeHtml(s.id)}">↳ ${escapeHtml(s.name_ko)}</option>`;
    });
    optionsHtml += '</optgroup>';
  });
  sel.innerHTML = optionsHtml;
  if (currentVal && currentVal !== 'all') {
    sel.value = currentVal;
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
    const unresolvedReportsMap = json.unresolved_reports || {};

    // Ensure category dropdown is populated
    const sel = document.getElementById('q-filter-specialty');
    if (sel && sel.options.length <= 1) {
      populateCategoryFilterDropdown();
    }

    if (allQuestions.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-500">조건에 맞는 질문이 없습니다.</td></tr>`;
      return;
    }

    tbody.innerHTML = allQuestions.map(q => {
      const cat = q.category || q.specialty || {};
      const sub = q.subBoard || q.subSpecialty || null;
      const statusPill = (q.status === 'active')
        ? `<span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">공개</span>`
        : (q.status === 'flagged')
        ? `<span class="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">신고됨</span>`
        : `<span class="bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full text-[10px] font-bold">숨김</span>`;

      const unresolvedCount = unresolvedReportsMap[q.id] || 0;
      const reportBadge = unresolvedCount > 0 
        ? `<span class="inline-flex items-center gap-1 text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full font-bold shrink-0 ml-1.5" title="미처리 신고 ${unresolvedCount}건"><svg class="w-2.5 h-2.5 text-red-500 fill-current shrink-0" viewBox="0 0 24 24"><path d="M4 2v20h2v-7h14l-2-6.5L20 2H4z"/></svg>신고 ${unresolvedCount}건</span>` 
        : '';

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
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="font-bold text-white max-w-md truncate hover:text-blue-300 cursor-pointer" onclick='openQModal(${JSON.stringify(q).replace(/'/g, "&#39;")})'>
                ${escapeHtml(q.title)}
              </span>
              ${reportBadge}
            </div>
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap">
            <div class="flex items-center gap-2">
              <img src="${(q.authorAvatar && !q.authorAvatar.includes('unsplash')) ? q.authorAvatar : '/assets/avatars/avatar_01.svg'}" class="w-5 h-5 rounded-full object-cover">
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
    const res = await fetch('/api/forum_admin.php?action=moderate_question', {
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
    const res = await fetch('/api/forum_admin.php?action=delete_question', {
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

// 2.5 Load Reported Listings Table
async function loadReportedListingsTable() {
  const tbody = document.getElementById('reported-listings-tbody');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-500"><i class="fa-solid fa-spinner fa-spin mr-2"></i>신고된 게시글 목록 로딩 중...</td></tr>`;

  try {
    const res = await fetch('/api/forum_admin.php?action=reported_listings');
    const json = await res.json();
    if (!json.success) {
      tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-red-400">데이터 로드 실패</td></tr>`;
      return;
    }

    const items = json.data || [];

    // Update badge in nav if any pending reports
    const pendingTotal = items.filter(it => it.status === 'pending').reduce((sum, it) => sum + (it.reportCount || 0), 0);
    const navBadge = document.getElementById('badge-nav-reports');
    if (navBadge) {
      if (pendingTotal > 0) {
        navBadge.innerText = pendingTotal;
        navBadge.classList.remove('hidden');
      } else {
        navBadge.classList.add('hidden');
      }
    }

    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-500">접수된 신고 내역이 없습니다.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map(item => {
      const isPending = item.status === 'pending';
      const statusPill = isPending
        ? `<span class="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">미처리</span>`
        : `<span class="bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full text-[10px] font-bold">처리완료</span>`;

      const listingUrl = `/ko/forum/topic/${encodeURIComponent(item.listingId)}`;

      return `
        <tr class="hover:bg-slate-700/30 transition-colors">
          <td class="py-3.5 px-4 text-center">
            <svg class="w-4 h-4 text-red-500 fill-current inline-block" viewBox="0 0 24 24"><path d="M4 2v20h2v-7h14l-2-6.5L20 2H4z"/></svg>
          </td>
          <td class="py-3.5 px-4">
            <a href="${listingUrl}" target="_blank" class="font-bold text-white hover:text-blue-300 transition-colors inline-flex items-center gap-1">
              <span>${escapeHtml(item.listingTitle)}</span>
              <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-400"></i>
            </a>
            ${item.authorName ? `<div class="text-[11px] text-slate-400 mt-0.5">작성자: ${escapeHtml(item.authorName)}</div>` : ''}
          </td>
          <td class="py-3.5 px-4 text-center font-bold text-red-400">
            ${item.reportCount ?? 1}건
          </td>
          <td class="py-3.5 px-4 text-slate-200">
            <span class="bg-slate-900 px-2 py-1 rounded text-xs border border-slate-700">${escapeHtml(item.latestReason || '기타')}</span>
          </td>
          <td class="py-3.5 px-4 text-slate-400 text-xs whitespace-nowrap">
            ${escapeHtml((item.latestDate || '').substring(0, 19))}
          </td>
          <td class="py-3.5 px-4 text-center whitespace-nowrap">
            ${statusPill}
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="dismissReports('${escapeHtml(item.listingId)}')" class="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer" title="신고 기각 (처리 완료로 변경)">
                <span>기각</span>
              </button>
              <button onclick="deleteListingFromReports('${escapeHtml(item.listingId)}')" class="px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold transition-all cursor-pointer" title="게시글 영구 삭제">
                <span>게시글 삭제</span>
              </button>
              ${item.authorId ? `
              <button onclick="suspendMember('${escapeHtml(item.authorId)}', '${escapeHtml(item.authorName || '회원')}')" class="px-2.5 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-bold transition-all cursor-pointer" title="작성자 계정 이용 제한">
                <span>회원 이용제한</span>
              </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-red-400">서버 통신 오류</td></tr>`;
  }
}

// Dismiss Reports
async function dismissReports(listingId) {
  if (!confirm('이 게시글에 대한 신고를 기각(처리 완료)하시겠습니까?')) return;
  try {
    const res = await fetch('/api/forum_admin.php?action=dismiss_reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: listingId })
    });
    const json = await res.json();
    if (json.success) {
      alert('신고가 기각(처리 완료)되었습니다.');
      loadReportedListingsTable();
      loadQuestionsTable();
    } else {
      alert(json.error || '처리 실패');
    }
  } catch (e) {
    alert('오류가 발생했습니다.');
  }
}

// Delete Listing From Reports
async function deleteListingFromReports(listingId) {
  if (!confirm('신고된 게시글을 영구 삭제하시겠습니까?\n이 작업은 취소할 수 없습니다.')) return;
  try {
    const res = await fetch('/api/forum_admin.php?action=delete_question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: listingId })
    });
    const json = await res.json();
    if (json.success) {
      alert('게시글이 삭제되었습니다.');
      loadReportedListingsTable();
      loadQuestionsTable();
    } else {
      alert(json.error || '삭제 실패');
    }
  } catch (e) {
    alert('오류가 발생했습니다.');
  }
}

// Suspend Member
async function suspendMember(userId, name) {
  if (!confirm(`회원 [${name}]의 이용을 영구 제한(정지)하시겠습니까?`)) return;
  try {
    const res = await fetch('/api/forum_admin.php?action=suspend_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    });
    const json = await res.json();
    if (json.success) {
      alert('해당 회원의 이용이 제한되었습니다.');
      loadReportedListingsTable();
      loadQuestionsTable();
    } else {
      alert(json.error || '처리 실패');
    }
  } catch (e) {
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
            <a href="/forum/topic/${encodeURIComponent(a.questionId)}" target="_blank" class="hover:underline">
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
    const res = await fetch('/api/forum_admin.php?action=moderate_answer', {
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
    const res = await fetch('/api/forum_admin.php?action=delete_answer', {
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
    const res = await fetch('/api/forum_admin.php?action=delete_answer', {
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
    const res = await fetch('/api/forum_admin.php?action=moderate_answer', {
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
    const res = await fetch('/api/forum_admin.php?action=users');
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
        docEmailsList.innerHTML = docEmails.map(d => {
          const bLabel = d.badge_label || d.title || '전문의';
          return `
          <div class="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-[10px] px-2 py-0.5 rounded font-extrabold bg-[#1B6FA8]/20 text-[#38BDF8] border border-[#1B6FA8]/40">${escapeHtml(bLabel)}</span>
                <span class="text-xs font-bold text-white truncate font-mono">${escapeHtml(d.email)}</span>
              </div>
              <p class="text-[11px] text-slate-400 truncate mt-1">${escapeHtml(d.title || bLabel)}</p>
            </div>
            <button onclick="removeDoctorEmail('${escapeHtml(d.email)}')" class="shrink-0 text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer" title="전문가 등록 삭제">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        `;
        }).join('');
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
        const badgeLabel = u.badgeLabel || u.clinicianTitle || '인증 전문의';

        return `
          <tr class="hover:bg-slate-700/30 transition-colors">
            <td class="py-3.5 px-4 whitespace-nowrap">
              <div class="flex items-center gap-2.5">
                <img src="${(u.avatar && !u.avatar.includes('unsplash')) ? u.avatar : '/assets/avatars/avatar_01.svg'}" class="w-8 h-8 rounded-full object-cover border border-slate-700">
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
                ? `<span class="bg-[#1B6FA8]/20 text-[#38BDF8] border border-[#1B6FA8]/40 text-[11px] font-extrabold px-2.5 py-1 rounded-full"><i class="fa-solid fa-circle-check mr-1"></i>${escapeHtml(badgeLabel)}</span>`
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
                ? `<button onclick="toggleVerifiedClinician('${u.id}', false)" class="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer">배지 해제</button>`
                : `<button onclick="promptClinicianBadge('${u.id}', '${escapeHtml(u.name)}')" class="px-2.5 py-1 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-[#38BDF8] border border-blue-500/40 text-xs font-semibold cursor-pointer">전문가 배지 부여</button>`
              }
              ${isBanned 
                ? `<button onclick="toggleBanUser('${u.id}', false)" class="px-2.5 py-1 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold cursor-pointer">정지 해제</button>`
                : `<button onclick="toggleBanUser('${u.id}', true)" class="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold cursor-pointer">계정 차단</button>`
              }
              <button onclick="deleteUser('${u.id}', '${escapeHtml(u.name || '회원')}')" class="px-2.5 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 text-rose-300 border border-rose-500/40 text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-1" title="회원 영구 삭제">
                <i class="fa-solid fa-trash-can text-[10px]"></i>
                <span>회원 삭제</span>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  } catch(e) {
    if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-red-400">데이터를 불러오지 못했습니다.</td></tr>`;
  }
}

// Add Doctor / Expert Gmail Submission
async function handleAddDoctorEmail(e) {
  e.preventDefault();
  const emailInput = document.getElementById('doc-email-input');
  const titleInput = document.getElementById('doc-title-input');
  const badgeTypeInput = document.getElementById('doc-badge-type');
  const btn = document.getElementById('btn-add-doctor');

  const email = emailInput?.value.trim() || '';
  const title = titleInput?.value.trim() || '';
  const badgeType = badgeTypeInput?.value || 'doctor';

  if (!email) {
    alert('전문가 Gmail 주소를 입력해주세요.');
    return;
  }

  if (btn) btn.disabled = true;

  try {
    const res = await fetch('/api/forum_admin.php?action=add_doctor_email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, title: title, badge_type: badgeType })
    });
    const json = await res.json();
    if (json.success) {
      if (emailInput) emailInput.value = '';
      if (titleInput) titleInput.value = '';
      loadUsersTable();
      loadDashboardStats();
      alert(json.message || '전문가 Gmail이 등록되었습니다.');
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
    const res = await fetch('/api/forum_admin.php?action=remove_doctor_email', {
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
    const res = await fetch('/api/forum_admin.php?action=toggle_verified_clinician', {
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
    const res = await fetch('/api/forum_admin.php?action=toggle_ban_user', {
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

async function deleteUser(userId, userName) {
  if (!confirm(`'${userName}' 회원을 완전히 영구 삭제하시겠습니까?\n해당 회원의 등록 정보 및 전문가 권한이 삭제되며 복구할 수 없습니다.`)) return;

  try {
    const res = await fetch('/api/forum_admin.php?action=delete_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId })
    });
    const json = await res.json();
    if (json.success) {
      alert(json.message || '회원이 성공적으로 삭제되었습니다.');
      loadUsersTable();
      loadDashboardStats();
    } else {
      alert(json.error || '회원 삭제에 실패했습니다.');
    }
  } catch(err) {
    alert('오류가 발생했습니다: ' + err.message);
  }
}

// 5. Load 8 Categories Tree & Board Settings Grid
async function loadSpecialtiesGrid() {
  const container = document.getElementById('specialties-full-grid');
  if (!container) return;
  container.innerHTML = '<div class="py-12 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin mr-2"></i>9대 카테고리 트리 및 게시판 설정 불러오는 중...</div>';

  try {
    const res = await fetch('/api/forum_admin.php?action=board_settings');
    const json = await res.json();
    if (!json.success || !json.data) {
      container.innerHTML = '<div class="p-6 text-center text-red-400">데이터 로드에 실패했습니다.</div>';
      return;
    }

    const { categories, subBoards, settings } = json.data;

    let html = `
      <div class="bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-900/40 rounded-3xl p-5 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">A1 Specification · Category Tree</div>
            <h3 class="text-base font-extrabold text-white">9대 커뮤니티 카테고리 트리 &amp; 서브게시판 관제</h3>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">
              의료관련(허브) · 자유게시판 · 마켓플레이스 · 서비스 · 구직 · 맛집 · 전문가 칼럼 · 이벤트 · 동호회/동문회 구조 및 게시판별 사진 썸네일, 정렬 탭, 작성 권한, 검토 큐를 관리합니다.
            </p>
          </div>
          <a href="/forum" target="_blank" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-sm">
            <span>포럼 메인 확인</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
        </div>
      </div>
      <div class="space-y-6">
    `;

    categories.forEach(cat => {
      const cId = cat.id;
      const bSettings = (settings && settings[cId]) ? settings[cId] : {
        thumbnailsEnabled: (cId === 'market' || cId === 'food' || cId === 'community' || cId === 'events' || cId === 'wanted' || cId === 'clubs'),
        sortTabsEnabled: true,
        postingRole: (cId === 'columns' ? 'expert_only' : (cId === 'events' ? 'admin_only' : 'all')),
        moderationQueue: true
      };

      const subs = (subBoards && subBoards[cId]) ? subBoards[cId] : (cat.subBoards || []);
      const hasSubs = subs.length > 0;

      html += `
        <div class="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-md transition-all hover:border-slate-600" style="border-left: 5px solid ${cat.color || '#3b82f6'};">
          <!-- Category Header -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-700/60">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl text-white shadow-md shrink-0" style="background-color: ${cat.color || '#3b82f6'};">
                <i class="fa-solid ${cat.icon || 'fa-layer-group'}"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-base font-bold text-white">${escapeHtml(cat.name_ko)}</h3>
                  <span class="text-xs px-2 py-0.5 rounded-md font-mono bg-slate-900 text-slate-400 border border-slate-700">${cat.slug}</span>
                  ${cat.isHub ? '<span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">의료 Hub</span>' : ''}
                </div>
                <p class="text-xs text-slate-300 mt-1">${escapeHtml(cat.description || '')}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-2.5 self-start lg:self-auto shrink-0">
              <span class="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-blue-400">
                게시물: <strong class="text-white">${cat.questionCount ?? 0}</strong>건
              </span>
              <a href="/forum?category=${encodeURIComponent(cat.slug || cat.id)}" target="_blank" class="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors">
                <span>보드 이동</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </a>
            </div>
          </div>

          <!-- Board Settings Bar -->
          <div class="mt-4 pt-1 bg-slate-900/60 rounded-2xl p-4 border border-slate-800">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <i class="fa-solid fa-sliders text-blue-400"></i>
              <span>[${escapeHtml(cat.name_ko)}] 게시판 운영 설정</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
              <!-- Setting 1: Thumbnails -->
              <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 cursor-pointer hover:bg-slate-800">
                <input type="checkbox" id="setting-thumb-${cId}" ${bSettings.thumbnailsEnabled ? 'checked' : ''} class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700">
                <div class="text-xs text-slate-200">
                  <span class="font-bold block text-white text-[11px]">📷 사진 썸네일</span>
                  <span class="text-[10px] text-slate-400">${cId === 'market' ? '부동산/렌트 필수' : '포토 카드 노출'}</span>
                </div>
              </label>

              <!-- Setting 2: Sort Tabs -->
              <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 cursor-pointer hover:bg-slate-800">
                <input type="checkbox" id="setting-sort-${cId}" ${bSettings.sortTabsEnabled ? 'checked' : ''} class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700">
                <div class="text-xs text-slate-200">
                  <span class="font-bold block text-white text-[11px]">📊 정렬 탭 활성화</span>
                  <span class="text-[10px] text-slate-400">조회/공감/댓글순</span>
                </div>
              </label>

              <!-- Setting 3: Posting Role -->
              <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span class="font-bold block text-white text-[11px] mb-1">✍️ 글 작성 권한</span>
                <select id="setting-role-${cId}" class="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-blue-500">
                  <option value="all" ${bSettings.postingRole === 'all' ? 'selected' : ''}>모든 회원 (Open)</option>
                  <option value="expert_only" ${bSettings.postingRole === 'expert_only' ? 'selected' : ''}>인증 전문가만 (Verified)</option>
                  <option value="admin_only" ${bSettings.postingRole === 'admin_only' ? 'selected' : ''}>운영진 전용 (Admin)</option>
                </select>
              </div>

              <!-- Setting 4: Moderation Queue -->
              <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 cursor-pointer hover:bg-slate-800">
                <input type="checkbox" id="setting-mod-${cId}" ${bSettings.moderationQueue ? 'checked' : ''} class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700">
                <div class="text-xs text-slate-200">
                  <span class="font-bold block text-white text-[11px]">🛡️ 검토 큐 가동</span>
                  <span class="text-[10px] text-slate-400">신고 및 숨김 관리</span>
                </div>
              </label>

              <!-- Action: Save Settings -->
              <div>
                <button type="button" id="btn-save-board-${cId}" onclick="saveBoardSettings('${cId}')" class="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
                  <i class="fa-solid fa-floppy-disk"></i>
                  <span>설정 저장</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Sub-boards Tree (if any) -->
          ${hasSubs ? `
            <div class="mt-4 pt-3">
              <div class="text-xs font-bold text-slate-300 mb-2.5 flex items-center gap-2">
                <i class="fa-solid fa-folder-tree text-cyan-400"></i>
                <span>세부 서브게시판 (Sub-boards) — ${subs.length}개</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                ${subs.map(sub => `
                  <div class="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 flex items-center justify-between gap-2.5">
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2">
                        <i class="fa-solid ${sub.icon || 'fa-hashtag'} text-xs text-slate-400"></i>
                        <span class="text-xs font-bold text-white truncate">${escapeHtml(sub.name_ko)}</span>
                      </div>
                      <div class="flex items-center gap-2 mt-1">
                        <span class="text-[10px] text-slate-500 font-mono truncate">${escapeHtml(sub.slug || sub.id)}</span>
                        ${sub.hasThumbnails ? '<span class="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 rounded">포토</span>' : ''}
                        ${sub.expertRole ? `<span class="text-[9px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1.5 rounded">${escapeHtml(sub.expertRole)} 전문</span>` : ''}
                      </div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                      <span class="text-xs font-extrabold text-cyan-400">${sub.questionCount ?? 0}건</span>
                      <a href="/forum?category=${encodeURIComponent(cat.slug || cat.id)}&sub=${encodeURIComponent(sub.slug || sub.id)}" target="_blank" class="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors" title="서브게시판 바로가기">
                        <i class="fa-solid fa-arrow-up-right-from-square text-[11px]"></i>
                      </a>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : `
            <div class="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
              <i class="fa-solid fa-circle-info"></i>
              <span>단일 독립 게시판 (서브게시판 없이 직접 포스팅)</span>
            </div>
          `}
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;

  } catch(e) {
    container.innerHTML = '<div class="p-6 text-center text-red-400">데이터 로드 중 오류가 발생했습니다.</div>';
  }
}

// Save individual board settings
async function saveBoardSettings(boardId) {
  const thumbEl = document.getElementById(`setting-thumb-${boardId}`);
  const sortEl = document.getElementById(`setting-sort-${boardId}`);
  const roleEl = document.getElementById(`setting-role-${boardId}`);
  const modEl = document.getElementById(`setting-mod-${boardId}`);
  const btnEl = document.getElementById(`btn-save-board-${boardId}`);

  const payload = {
    thumbnailsEnabled: thumbEl ? thumbEl.checked : false,
    sortTabsEnabled: sortEl ? sortEl.checked : true,
    postingRole: roleEl ? roleEl.value : 'all',
    moderationQueue: modEl ? modEl.checked : true
  };

  try {
    if (btnEl) {
      btnEl.disabled = true;
      btnEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 저장 중...';
    }
    const res = await fetch('/api/forum_admin.php?action=update_board_settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardId: boardId, settings: payload })
    });
    const json = await res.json();
    if (json.success) {
      if (btnEl) {
        btnEl.innerHTML = '<i class="fa-solid fa-check text-emerald-300"></i> 저장됨!';
        setTimeout(() => {
          btnEl.disabled = false;
          btnEl.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> 설정 저장';
        }, 1500);
      }
    } else {
      alert(json.error || '설정 저장 실패');
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> 설정 저장';
      }
    }
  } catch(e) {
    alert('오류가 발생했습니다.');
    if (btnEl) {
      btnEl.disabled = false;
      btnEl.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> 설정 저장';
    }
  }
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
    const res = await fetch('/api/forum_admin.php?action=update_disclaimer', {
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
  const sub = q.subBoard || q.subSpecialty || null;
  const currentSpecialtyId = q.subBoardId || q.subSpecialtyId || q.specialtyId || cat.id || '';

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
      allCategories.forEach(c => {
        optionsHtml += `<optgroup label="${escapeHtml(c.name_ko)}">`;
        optionsHtml += `<option value="${c.id}" ${c.id === currentSpecialtyId ? 'selected' : ''}>[전체] ${escapeHtml(c.name_ko)}</option>`;
        const subs = c.subBoards || [];
        subs.forEach(s => {
          optionsHtml += `<option value="${s.id}" ${s.id === currentSpecialtyId ? 'selected' : ''}>↳ ${escapeHtml(s.name_ko)}</option>`;
        });
        optionsHtml += '</optgroup>';
      });
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
    const res = await fetch('/api/forum_admin.php?action=delete_question', {
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
    const res = await fetch('/api/forum_admin.php?action=moderate_question', {
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

    const res = await fetch('/api/forum_admin.php?action=update_question_specialty', {
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
    let matched = allCategories.find(sp => sp.id === newSpecialtyId);
    let matchedSub = null;
    let matchedParent = null;
    if (matched) {
      matchedParent = matched;
    } else {
      for (const c of allCategories) {
        const s = (c.subBoards || []).find(sb => sb.id === newSpecialtyId);
        if (s) {
          matchedSub = s;
          matchedParent = c;
          matched = { ...s, color: c.color || '#3b82f6' };
          break;
        }
      }
    }
    if (!matched) {
      matched = allSubSpecialties.find(sp => sp.id === newSpecialtyId);
    }

    if (matched) {
      currentModalQuestion.specialtyId = newSpecialtyId;
      currentModalQuestion.specialty = matched;
      if (matchedSub && matchedParent) {
        currentModalQuestion.categoryId = matchedParent.id;
        currentModalQuestion.subBoardId = matchedSub.id;
        currentModalQuestion.category = matchedParent;
        currentModalQuestion.subBoard = matchedSub;
      }

      const badge = document.getElementById('modal-q-specialty');
      if (badge) {
        badge.innerText = (matchedParent && matchedSub) ? `${matchedParent.name_ko} > ${matchedSub.name_ko}` : (matched.name_ko || '게시판');
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
    loadDashboardStats();
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
  await fetch('/api/auth.php?action=logout');
  window.location.href = '/admin2/login.php';
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
    const res = await fetch('/api/forum_admin.php?action=events');
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
            <a href="/forum/topic/${encodeURIComponent(ev.id)}" target="_blank" class="font-bold text-white hover:text-rose-400 transition-colors line-clamp-2">
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
            <a href="/forum/topic/${encodeURIComponent(ev.id)}" target="_blank" 
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
    const res = await fetch('/api/forum_admin.php?action=upload_poster', {
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
    const res = await fetch('/api/forum_admin.php?action=create_event', {
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
    const res = await fetch('/api/forum_admin.php?action=delete_question', {
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

// 8. Featured Services & Partner Ads Management
async function loadFeaturedAdsTable() {
  const tbody = document.getElementById('featured-ads-tbody');
  if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-500"><i class="fa-solid fa-spinner fa-spin mr-2"></i>추천 서비스 광고 목록 불러오는 중...</td></tr>`;

  try {
    const res = await fetch('/api/forum_admin.php?action=featured_ads');
    const json = await res.json();
    if (!json.success) return;

    const ads = json.data || [];
    if (tbody) {
      if (ads.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-500">등록된 추천 서비스/광고가 없습니다.</td></tr>`;
        return;
      }

      tbody.innerHTML = ads.map(a => {
        const isActive = a.active === undefined || Boolean(a.active);
        const thumb = a.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&q=80';

        return `
          <tr class="hover:bg-slate-700/30 transition-colors">
            <td class="py-3 px-4 whitespace-nowrap">
              <img src="${escapeHtml(thumb)}" class="w-16 h-10 object-cover rounded-lg border border-slate-700 bg-slate-900" alt="광고">
            </td>
            <td class="py-3 px-4">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-[#38BDF8] border border-blue-500/30 mr-1.5">${escapeHtml(a.badge || '추천 파트너')}</span>
              <span class="text-xs font-bold text-white block mt-1">${escapeHtml(a.title || '')}</span>
            </td>
            <td class="py-3 px-4 text-xs text-slate-300 max-w-xs">
              <p class="truncate text-slate-300">${escapeHtml(a.desc || '')}</p>
              ${a.price ? `<span class="text-[10px] text-sky-300 font-bold bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/50 mt-1 inline-block">${escapeHtml(a.price)}</span>` : ''}
            </td>
            <td class="py-3 px-4 text-xs text-slate-300 whitespace-nowrap">
              <div>${escapeHtml(a.location || 'NJ')}</div>
              <div class="text-[11px] text-slate-400 font-mono">${escapeHtml(a.phone || '-')}</div>
            </td>
            <td class="py-3 px-4 whitespace-nowrap text-center">
              <button onclick="toggleFeaturedAd('${escapeHtml(a.id)}', ${!isActive})" class="px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}">
                ${isActive ? '노출중' : '숨김'}
              </button>
            </td>
            <td class="py-3 px-4 whitespace-nowrap text-right">
              <button onclick="deleteFeaturedAd('${escapeHtml(a.id)}')" class="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer" title="광고 삭제">
                <i class="fa-solid fa-trash-can text-xs"></i>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  } catch(e) {
    if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-red-400">데이터를 불러오지 못했습니다.</td></tr>`;
  }
}

async function handleAddFeaturedAd(e) {
  e.preventDefault();
  const badge = document.getElementById('ad-badge-input')?.value.trim() || '추천 파트너';
  const title = document.getElementById('ad-title-input')?.value.trim() || '';
  const price = document.getElementById('ad-price-input')?.value.trim() || '';
  const desc = document.getElementById('ad-desc-input')?.value.trim() || '';
  const location = document.getElementById('ad-location-input')?.value.trim() || 'NJ';
  const phone = document.getElementById('ad-phone-input')?.value.trim() || '';
  const url = document.getElementById('ad-url-input')?.value.trim() || '';
  const image = document.getElementById('ad-image-input')?.value.trim() || '';

  if (!title) {
    alert('광고 상호명/제목을 입력해주세요.');
    return;
  }

  const btn = document.getElementById('btn-add-featured-ad');
  if (btn) btn.disabled = true;

  try {
    const res = await fetch('/api/forum_admin.php?action=save_featured_ad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        badge, title, price, desc, location, phone, url, image, active: true
      })
    });
    const json = await res.json();
    if (json.success) {
      document.getElementById('add-featured-ad-form')?.reset();
      loadFeaturedAdsTable();
      alert('새 추천 서비스 파트너가 성공적으로 등록되었습니다.');
    } else {
      alert(json.error || '등록 실패');
    }
  } catch(err) {
    alert('오류가 발생했습니다.');
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function toggleFeaturedAd(id, active) {
  try {
    const res = await fetch('/api/forum_admin.php?action=toggle_featured_ad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active })
    });
    const json = await res.json();
    if (json.success) {
      loadFeaturedAdsTable();
    }
  } catch(e) {}
}

async function deleteFeaturedAd(id) {
  if (!confirm('이 추천 서비스 광고를 삭제하시겠습니까?')) return;
  try {
    const res = await fetch('/api/forum_admin.php?action=delete_featured_ad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const json = await res.json();
    if (json.success) {
      loadFeaturedAdsTable();
    }
  } catch(e) {}
// -------------------------------------------------------------
// CLUB ROOMS MODERATION (동호회/동문회 룸 통합 관제)
// -------------------------------------------------------------
let allClubRooms = [];

async function loadClubRooms() {
  const tbody = document.getElementById('club-rooms-tbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="7" class="py-8 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin mr-2"></i>동호회/동문회 룸 목록을 불러오는 중...</td></tr>';

  try {
    const res = await fetch('/api/forum_admin.php?action=club_rooms');
    const json = await res.json();
    if (!json.success || !json.data) {
      tbody.innerHTML = '<tr><td colspan="7" class="py-8 text-center text-slate-500">등록된 동호회 룸이 없습니다.</td></tr>';
      return;
    }

    allClubRooms = json.data;
    renderClubRooms(allClubRooms);
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="7" class="py-8 text-center text-red-400">데이터 로드 실패: ' + err.message + '</td></tr>';
  }
}

function handleClubRoomSearch(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    renderClubRooms(allClubRooms);
    return;
  }
  const filtered = allClubRooms.filter(r => 
    (r.name && r.name.toLowerCase().includes(q)) ||
    (r.leader_name && r.leader_name.toLowerCase().includes(q)) ||
    (r.location && r.location.toLowerCase().includes(q)) ||
    (r.type && r.type.toLowerCase().includes(q))
  );
  renderClubRooms(filtered);
}

function renderClubRooms(rooms) {
  const tbody = document.getElementById('club-rooms-tbody');
  const countEl = document.getElementById('club-rooms-count');
  if (countEl) countEl.innerText = `${rooms.length}개`;
  if (!tbody) return;

  if (rooms.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="py-8 text-center text-slate-500">해당 조건의 동호회 룸이 없습니다.</td></tr>';
    return;
  }

  tbody.innerHTML = rooms.map(room => {
    const isClosed = (room.status === 'closed');
    const banner = room.banner_url || '';
    const color = room.theme_color || '#7C3AED';
    const emblem = room.emblem || 'fa-users';

    return `
      <tr class="hover:bg-slate-750/50 transition-colors ${isClosed ? 'bg-red-950/20' : ''}">
        <!-- Banner Thumbnail -->
        <td class="py-3 px-3">
          <div class="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center text-white text-base shadow-xs" style="background: ${banner ? `url('${banner}') center/cover` : `linear-gradient(135deg, ${color}, #0F2342)`}">
            <i class="fa-solid ${emblem}"></i>
          </div>
        </td>

        <!-- Room Name & Intro -->
        <td class="py-3 px-4 min-w-[200px]">
          <div class="flex items-center gap-2">
            <a href="/forum/club.php?id=${encodeURIComponent(room.id)}" target="_blank" class="font-bold text-white hover:text-purple-400 transition flex items-center gap-1.5">
              <span>${escapeHtml(room.name)}</span>
              <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-500"></i>
            </a>
          </div>
          <p class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">${escapeHtml(room.one_liner || room.description || '')}</p>
        </td>

        <!-- Type / Location -->
        <td class="py-3 px-3 whitespace-nowrap">
          <span class="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-900/40 text-purple-300 border border-purple-700/50 mb-1">
            ${escapeHtml(room.type || '일반')}
          </span>
          <div class="text-[11px] text-slate-400 flex items-center gap-1">
            <i class="fa-solid fa-location-dot text-red-400 text-[10px]"></i>
            <span>${escapeHtml(room.location || '뉴저지')}</span>
          </div>
        </td>

        <!-- Leader Info -->
        <td class="py-3 px-4 whitespace-nowrap">
          <div class="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
            <i class="fa-solid fa-crown text-[10px]"></i>
            <span>${escapeHtml(room.leader_name || '방장')}</span>
          </div>
          <div class="text-[11px] text-slate-400 font-mono mt-0.5">
            ${escapeHtml(room.leader_contact || '-')}
          </div>
        </td>

        <!-- Post / Views -->
        <td class="py-3 px-3 text-center whitespace-nowrap font-mono text-xs">
          <span class="text-white font-bold">${room.post_count ?? 0}</span>
          <span class="text-slate-500"> / </span>
          <span class="text-slate-400">${room.view_count ?? 0}</span>
        </td>

        <!-- Status -->
        <td class="py-3 px-3 text-center whitespace-nowrap">
          ${isClosed 
            ? '<span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-black bg-red-900/60 text-red-300 border border-red-700/80">제재/폐쇄됨 (Flagged)</span>' 
            : '<span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-900/40 text-emerald-300 border border-emerald-700/60">정상 운영 중</span>'}
        </td>

        <!-- Actions -->
        <td class="py-3 px-4 text-right whitespace-nowrap">
          <div class="flex items-center justify-end gap-1.5">
            <a href="/forum/club.php?id=${encodeURIComponent(room.id)}" target="_blank" class="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition" title="룸 페이지 보기">
              <i class="fa-solid fa-eye"></i>
            </a>

            ${isClosed ? `
              <button onclick="toggleClubRoomStatus('${room.id}', 'active')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer" title="제재 해제 및 복구">
                <i class="fa-solid fa-check"></i>
                <span>정상 복구</span>
              </button>
            ` : `
              <button onclick="toggleClubRoomStatus('${room.id}', 'closed')" class="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer" title="운영 위반 제재 및 룸 폐쇄">
                <i class="fa-solid fa-ban"></i>
                <span>폐쇄 / Flag</span>
              </button>
            `}

            <button onclick="deleteClubRoom('${room.id}', '${escapeHtml(room.name)}')" class="p-1.5 rounded-lg bg-slate-700 hover:bg-red-700 text-slate-300 hover:text-white text-xs transition cursor-pointer" title="영구 삭제">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

async function toggleClubRoomStatus(roomId, newStatus) {
  let closeReason = '';
  if (newStatus === 'closed') {
    closeReason = prompt('이 룸을 제재(Flagged) 및 폐쇄하는 사유를 입력하세요 (이용자에게 노출됩니다):', '운영 정책 위반으로 제재(Flagged) 처리되었습니다. 문의: njaccessportal@gmail.com');
    if (closeReason === null) return;
  } else {
    if (!confirm('이 룸의 제재를 해제하고 정상 운영 상태로 복구하시겠습니까?')) return;
  }

  try {
    const res = await fetch('/api/forum_admin.php?action=toggle_club_room_status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room_id: roomId,
        status: newStatus,
        close_reason: closeReason
      })
    });
    const json = await res.json();
    if (json.success) {
      alert(json.message);
      loadClubRooms();
    } else {
      alert(json.error || '상태 변경에 실패했습니다.');
    }
  } catch (err) {
    alert('통신 오류가 발생했습니다.');
  }
}

async function deleteClubRoom(roomId, roomName) {
  if (!confirm(`[주의] "${roomName}" 룸과 룸 내부의 모든 게시글을 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) return;

  try {
    const res = await fetch('/api/forum_admin.php?action=delete_club_room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_id: roomId })
    });
    const json = await res.json();
    if (json.success) {
      alert(json.message);
      loadClubRooms();
    } else {
      alert(json.error || '삭제 실패');
    }
  } catch (err) {
    alert('삭제 통신 오류가 발생했습니다.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardStats();
});
