<?php
require_once __DIR__ . '/../api/forum_db.php';
require_once __DIR__ . '/components.php';

$specialties = forum_get_specialties();
$preSelectedSpecialty = trim($_GET['specialty'] ?? 'internal_medicine');

$currentSpecialty = null;
foreach ($specialties as $s) {
    if ($s['id'] === $preSelectedSpecialty || $s['slug'] === $preSelectedSpecialty) {
        $currentSpecialty = $s;
        break;
    }
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>질문/정보 공유하기 (Create a New Topic) | NJAP 메디컬 포럼</title>
  <link rel="icon" href="/favicon.ico">
  
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/_next/static/chunks/1fosv8xgmgdeu.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Identity Services (GIS) -->
  <script src="https://accounts.google.com/gsi/client" async defer></script>
  
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              blue: '#1E3A8A',
              lightBlue: '#3B82F6',
              dark: '#0B192C',
              darker: '#0d1b2b',
              light: '#f8f8f6'
            }
          },
          fontFamily: {
            sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    :root, html, body {
      font-family: "Pretendard Variable", Pretendard, "Noto Sans KR", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif !important;
    }
    html, body {
      overflow-x: hidden !important;
      max-width: 100% !important;
    }
    @keyframes marqueeScroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .marquee-track {
      display: inline-flex !important;
      white-space: nowrap !important;
      will-change: transform;
      animation: marqueeScroll 35s linear infinite !important;
    }
    .marquee-track:hover {
      animation-play-state: paused;
    }
    .h-\[109px\], .header-spacer, #header-spacer {
      height: 109px !important;
      min-height: 109px !important;
      display: block !important;
      width: 100% !important;
    }
    @media (max-width: 767px) {
      #forum-sidebar.sidebar-closed {
        display: none !important;
      }
      #forum-sidebar.sidebar-open {
        display: flex !important;
        position: fixed !important;
        top: 0 !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 280px !important;
        max-width: 85vw !important;
        height: 100vh !important;
        z-index: 100 !important;
        background-color: #ffffff !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        transform: translateX(0) !important;
      }
      #sidebar-backdrop {
        z-index: 99 !important;
      }
    }
    @media (min-width: 768px) {
      #forum-sidebar {
        display: flex !important;
        position: sticky !important;
        top: 109px !important;
        height: calc(100vh - 109px) !important;
        transform: none !important;
      }
    }
  </style>
</head>
<body class="bg-[#F8FAFC] text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">

  <!-- Top Global Header -->
  <?php render_forum_header('', $currentSpecialty); ?>

  <!-- Main Forum Layout: Sidebar + Ask Form -->
  <div class="flex-1 flex w-full max-w-[1600px] mx-auto">
    
    <!-- Left Sidebar -->
    <?php render_forum_sidebar($specialties, $preSelectedSpecialty, 'latest', 'topics'); ?>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
      
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 mb-4 text-xs font-semibold text-slate-500">
        <a href="/forum" class="hover:text-blue-600 transition-colors">포럼 홈</a>
        <i class="fa-solid fa-chevron-right text-[9px] text-slate-300"></i>
        <span class="text-slate-800">질문/정보 공유 (Create a New Topic)</span>
      </div>

      <!-- Discourse Style New Topic Composer Card -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs max-w-4xl">
        
        <div class="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
          <div>
            <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              질문/정보 공유 토픽 작성
            </h1>
            <p class="text-xs text-slate-500 mt-1">
              증상과 질문을 상세히 적어주시면 각 분야별 공인 전문의 및 커뮤니티로부터 정확한 답변을 받으실 수 있습니다.
            </p>
          </div>
          <a href="/forum" class="text-xs font-semibold text-slate-400 hover:text-slate-600 p-2">
            <i class="fa-solid fa-xmark text-base"></i>
          </a>
        </div>

        <form id="ask-form" onsubmit="handleAskSubmit(event)" class="space-y-5">
          
          <!-- 1. Category Selector & Author Name in 2 columns -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- Category -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">
                전문 진료과목 (Category) <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select id="specialty_id" name="specialty_id" required 
                  class="w-full p-3 pr-9 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 appearance-none">
                  <?php foreach ($specialties as $sp): 
                    if (!empty($sp['isAdminOnly'])) continue; // Admin-only categories (e.g. 이벤트) are restricted to /admin2
                    $selected = ($sp['id'] === $preSelectedSpecialty || $sp['slug'] === $preSelectedSpecialty) ? 'selected' : '';
                  ?>
                    <option value="<?= htmlspecialchars($sp['id']) ?>" <?= $selected ?>>
                      <?= htmlspecialchars($sp['name_ko']) ?> (<?= htmlspecialchars($sp['name_en']) ?>)
                    </option>
                  <?php endforeach; ?>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <i class="fa-solid fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>

            <!-- Author Name / Nickname -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>작성자 성함 / 닉네임 <span class="text-red-500">*</span></span>
                <span id="author-badge-indicator" class="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-md hidden">
                  <i class="fa-solid fa-user-doctor mr-1"></i><span id="author-badge-text">공인 전문의 인증 계정</span>
                </span>
              </label>
              <input type="text" id="author_name" name="author_name" required minlength="2"
                placeholder="예: 홍길동, 뉴저지주민 (의사의 경우 성함 및 전문과목)" 
                class="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 font-medium text-slate-900 placeholder-slate-400" />
            </div>

          </div>

          <!-- 2. Question Title -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">
              질문 제목 (Topic Title) <span class="text-red-500">*</span>
            </label>
            <input type="text" id="title" name="title" required minlength="5"
              placeholder="예: 3일 전부터 시작된 왼쪽 가슴 찌릿한 통증, 심장내과 진료가 필요한가요?" 
              class="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 font-medium text-slate-900 placeholder-slate-400" />
          </div>

          <!-- 3. Question Body -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">
              상세 증상 및 상담 내용 <span class="text-red-500">*</span>
            </label>
            <textarea id="body" name="body" rows="8" required minlength="10"
              placeholder="• 증상: 언제부터 시작되었는지, 통증의 양상&#10;• 복용 중인 약물 / 영양제: &#10;• 기저 질환 (고혈압, 당뇨 등):&#10;• 궁금한 점을 자유롭게 기술해 주세요." 
              class="w-full p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 leading-relaxed font-sans placeholder-slate-400"></textarea>
          </div>

          <!-- 3.1. Image Attachment (JPEG, PNG) -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>📷 사진 첨부 (선택 사항)</span>
              <span class="text-[11px] font-normal text-slate-400">JPEG, PNG, WEBP (최대 12MB, 최대 5장)</span>
            </label>
            
            <input type="file" id="ask-image-input" accept="image/jpeg,image/png,image/webp" multiple class="hidden" onchange="handleAskImageSelect(this)">
            
            <div class="p-4 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl bg-slate-50/50 hover:bg-blue-50/20 transition-all text-center">
              <div class="flex flex-col items-center justify-center gap-2">
                <button type="button" onclick="triggerAskImageUpload()" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-500 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 shadow-2xs transition-all cursor-pointer">
                  <i class="fa-solid fa-cloud-arrow-up text-blue-600"></i>
                  <span>사진 / 이미지 파일 선택</span>
                </button>
                <p class="text-[11px] text-slate-400">
                  처방전, 환부 사진, 검사 결과지 등 상담에 필요한 사진을 첨부하실 수 있습니다.
                </p>
              </div>

              <!-- Uploading Spinner -->
              <div id="ask-upload-spinner" class="hidden mt-3 text-xs text-blue-600 font-semibold flex items-center justify-center gap-2">
                <i class="fa-solid fa-spinner fa-spin"></i>
                <span>이미지 업로드 중...</span>
              </div>

              <!-- Preview Grid -->
              <div id="ask-images-preview" class="flex flex-wrap gap-3 mt-3 empty:mt-0 justify-center"></div>
            </div>
          </div>

          <!-- 4. Tags Input -->
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5">
              태그 입력 (선택 사항, 쉼표로 구분)
            </label>
            <input type="text" id="tags" name="tags" 
              placeholder="예: 혈압약, 복용시간, 흉통, 새벽고혈압" 
              class="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-600 text-slate-900 placeholder-slate-400" />
          </div>

          <!-- Bottom Action Buttons -->
          <div class="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-3">
            <span class="text-[11px] text-slate-400">
              ※ 제출 전 개인 식별 번호(SSN, 주민번호 등)가 포함되지 않았는지 확인해 주세요.
            </span>
            <div class="flex items-center gap-2">
              <a href="/forum" class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 transition-colors">
                취소
              </a>
              <button type="submit" id="btn-submit-ask" class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2">
                <i class="fa-solid fa-paper-plane text-xs"></i>
                <span>토픽 등록하기 (Create Topic)</span>
              </button>
            </div>
          </div>

        </form>

      </div>

    </main>
  </div>

  <!-- Shared Global Footer Matching Website -->
  <?php render_forum_footer(); ?>

  <!-- Shared Auth Modals -->
  <?php render_forum_modals(); ?>

  <!-- Shared Auth Scripts -->
  <?php render_forum_auth_scripts(); ?>

  <script>
    let uploadedImages = [];

    function triggerAskImageUpload() {
      if (!currentUser) {
        openGoogleAuthModal();
        return;
      }
      document.getElementById('ask-image-input').click();
    }

    async function handleAskImageSelect(input) {
      const files = Array.from(input.files || []);
      if (!files.length) return;

      if (uploadedImages.length + files.length > 5) {
        alert('이미지는 최대 5장까지 첨부할 수 있습니다.');
        return;
      }

      const spinner = document.getElementById('ask-upload-spinner');
      spinner.classList.remove('hidden');

      for (const file of files) {
        if (!file.type.match(/^image\/(jpeg|png|webp|gif)/i)) {
          alert('JPEG, PNG, WEBP 이미지 파일만 첨부 가능합니다.');
          continue;
        }
        if (file.size > 12 * 1024 * 1024) {
          alert(`'${file.name}' 파일이 너무 큽니다 (최대 12MB).`);
          continue;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
          const res = await fetch('/api/forum.php?action=upload_image', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.success && data.url) {
            uploadedImages.push(data.url);
            renderAskImagePreviews();
          } else {
            alert(data.error || '이미지 업로드에 실패했습니다.');
          }
        } catch(err) {
          alert('이미지 업로드 통신 오류가 발생했습니다.');
        }
      }

      spinner.classList.add('hidden');
      input.value = '';
    }

    function removeAskImage(index) {
      uploadedImages.splice(index, 1);
      renderAskImagePreviews();
    }

    function renderAskImagePreviews() {
      const previewBox = document.getElementById('ask-images-preview');
      if (!previewBox) return;

      previewBox.innerHTML = uploadedImages.map((url, idx) => `
        <div class="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-2xs bg-white">
          <img src="${url}" class="w-full h-full object-cover" alt="첨부 이미지">
          <button type="button" onclick="removeAskImage(${idx})" 
                  class="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center shadow-md hover:bg-red-700 transition-colors">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `).join('');
    }

    function syncAuthorFields() {
      if (!currentUser) return;
      const authorInput = document.getElementById('author_name');
      if (authorInput && !authorInput.value) {
        authorInput.value = currentUser.name || '';
      }

      // If doctor, show clinician badge indicator
      const badgeIndicator = document.getElementById('author-badge-indicator');
      const badgeText = document.getElementById('author-badge-text');
      if (currentUser.isVerifiedClinician && badgeIndicator) {
        badgeIndicator.classList.remove('hidden');
        if (badgeText && currentUser.clinicianTitle) {
          badgeText.innerText = `${currentUser.clinicianTitle} 인증 계정`;
        }
      }
    }

    async function handleAskSubmit(e) {
      e.preventDefault();
      if (!currentUser) {
        openGoogleAuthModal();
        return;
      }

      const specialtyId = document.getElementById('specialty_id').value;
      const authorName = document.getElementById('author_name')?.value.trim() || '';
      const title = document.getElementById('title').value.trim();
      const body = document.getElementById('body').value.trim();
      const rawTags = document.getElementById('tags')?.value.trim() || '';
      const tags = rawTags.split(',').map(t => t.trim()).filter(Boolean);

      if (!title || !body) return;

      const btn = document.getElementById('btn-submit-ask');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 등록 중...';

      try {
        const res = await fetch('/api/forum.php?action=ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title,
            body: body,
            specialty_id: specialtyId,
            author_name: authorName,
            tags: tags,
            images: uploadedImages
          })
        });
        const data = await res.json();
        const createdId = data.data?.id || data.question?.id;
        if (data.success && createdId) {
          window.location.href = '/forum/topic/' + encodeURIComponent(createdId);
        } else {
          alert(data.error || '질문 등록에 실패했습니다.');
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> 토픽 등록하기';
        }
      } catch(err) {
        alert('질문 등록 중 통신 오류가 발생했습니다.');
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> 토픽 등록하기';
      }
    }
  </script>
</body>
</html>
