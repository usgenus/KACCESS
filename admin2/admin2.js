/**
 * Healthcare Access Portal - Forum CMS Controller (/admin2)
 */

let allQuestions = [];
let allAnswers = [];
let allUsers = [];
let allSpecialties = [];

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

    // Render 15 Specialties distribution grid
    const specGrid = document.getElementById('specialties-dashboard-grid');
    if (specGrid && Array.isArray(data.specialties)) {
      allSpecialties = data.specialties;
      specGrid.innerHTML = data.specialties.map(sp => `
        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0" style="background-color: ${sp.color}22; color: ${sp.color}">
            <i class="fa-solid ${sp.icon || 'fa-stethoscope'}"></i>
          </div>
          <div class="overflow-hidden">
            <h4 class="text-xs font-bold text-white truncate">${sp.name_ko}</h4>
            <span class="text-[11px] text-slate-400 font-semibold">${sp.count ?? 0}건</span>
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
    const url = `/api/forum_admin.php?action=questions&specialty=${encodeURIComponent(specialty)}&status=${encodeURIComponent(status)}&q=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    const json = await res.json();
    if (!json.success) {
      tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-red-400">데이터 로드 실패</td></tr>`;
      return;
    }

    allQuestions = json.data || [];

    // Populate specialty filter dropdown if empty
    const sel = document.getElementById('q-filter-specialty');
    if (sel && sel.options.length <= 1 && allSpecialties.length > 0) {
      allSpecialties.forEach(sp => {
        const opt = document.createElement('option');
        opt.value = sp.id;
        opt.innerText = sp.name_ko;
        sel.appendChild(opt);
      });
    }

    if (allQuestions.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-500">조건에 맞는 질문이 없습니다.</td></tr>`;
      return;
    }

    tbody.innerHTML = allQuestions.map(q => {
      const s = q.specialty || {};
      const statusPill = (q.status === 'active')
        ? `<span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">공개</span>`
        : (q.status === 'flagged')
        ? `<span class="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">신고됨</span>`
        : `<span class="bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full text-[10px] font-bold">숨김</span>`;

      return `
        <tr class="hover:bg-slate-700/30 transition-colors">
          <td class="py-3.5 px-4 font-bold text-blue-400 whitespace-nowrap">
            <span class="inline-flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full" style="background-color: ${s.color || '#3b82f6'}"></span>
              ${s.name_ko || '일반내과'}
            </span>
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
          <td class="py-3.5 px-4 whitespace-nowrap text-right space-x-1">
            <button onclick='openQModal(${JSON.stringify(q).replace(/'/g, "&#39;")})' class="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold" title="상세보기">
              <i class="fa-regular fa-eye"></i>
            </button>
            ${q.status === 'active' 
              ? `<button onclick="toggleQStatus('${q.id}', 'hidden')" class="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold" title="숨김 처리"><i class="fa-solid fa-eye-slash"></i></button>`
              : `<button onclick="toggleQStatus('${q.id}', 'active')" class="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold" title="공개 처리"><i class="fa-solid fa-check"></i></button>`
            }
            <button onclick="deleteQuestion('${q.id}')" class="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold" title="삭제">
              <i class="fa-solid fa-trash-can"></i>
            </button>
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

// Delete Question
async function deleteQuestion(id) {
  if (!confirm('이 질문과 모든 답변을 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

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
    const url = `/api/forum_admin.php?action=answers&status=${encodeURIComponent(status)}&q=${encodeURIComponent(search)}`;
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
          <td class="py-3.5 px-4 text-slate-200 max-w-sm truncate">
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
          <td class="py-3.5 px-4 whitespace-nowrap text-right space-x-1">
            ${a.status === 'active'
              ? `<button onclick="toggleAnswerStatus('${a.id}', 'hidden')" class="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold" title="숨김"><i class="fa-solid fa-eye-slash"></i></button>`
              : `<button onclick="toggleAnswerStatus('${a.id}', 'active')" class="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold" title="공개"><i class="fa-solid fa-check"></i></button>`
            }
            <button onclick="deleteAnswer('${a.id}')" class="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold" title="삭제">
              <i class="fa-solid fa-trash-can"></i>
            </button>
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
  if (!confirm('이 답변을 영구 삭제하시겠습니까?')) return;
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
    const res = await fetch('/api/forum_admin.php?action=add_doctor_email', {
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

// 5. Load 15 Specialties Grid
function loadSpecialtiesGrid() {
  const container = document.getElementById('specialties-full-grid');
  if (!container || allSpecialties.length === 0) return;

  container.innerHTML = allSpecialties.map(sp => `
    <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 relative overflow-hidden">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center text-lg text-white shadow" style="background-color: ${sp.color}">
          <i class="fa-solid ${sp.icon || 'fa-stethoscope'}"></i>
        </div>
        <div>
          <h3 class="font-bold text-white text-sm">${sp.name_ko}</h3>
          <p class="text-xs text-slate-400 font-mono">${sp.name_en}</p>
        </div>
        <span class="ml-auto text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-blue-400">
          ${sp.count ?? 0}건
        </span>
      </div>
      <p class="text-xs text-slate-300 leading-relaxed">${sp.description || ''}</p>
    </div>
  `).join('');
}

// Question Detail Modal
function openQModal(q) {
  const s = q.specialty || {};
  document.getElementById('modal-q-specialty').innerText = s.name_ko || '진료과';
  document.getElementById('modal-q-status').innerText = q.status === 'active' ? '공개중' : (q.status === 'hidden' ? '숨김' : '신고됨');
  document.getElementById('modal-q-title').innerText = q.title;
  document.getElementById('modal-q-author').innerText = `작성자: ${q.authorName || '익명'}`;
  document.getElementById('modal-q-date').innerText = `작성일: ${(q.createdAt || '').substring(0, 10)}`;
  document.getElementById('modal-q-body').innerText = q.body;

  const modal = document.getElementById('modal-q-detail');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
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

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardStats();
});
