<?php
require_once __DIR__ . '/../api/forum_db.php';
require_once __DIR__ . '/components.php';

$rawCategory = trim($_GET['category'] ?? ($_GET['specialty'] ?? ''));
$rawSub = trim($_GET['sub'] ?? '');

$categories = forum_get_categories();
$subSpecialties = forum_get_sub_specialties();

// Pre-selection mapping
$selectedCatId = 'general_community';
$selectedSubId = '';

if (!empty($rawCategory)) {
    $cat = forum_get_category_by_id($rawCategory);
    if ($cat) {
        $selectedCatId = $cat['id'];
        $selectedSubId = $rawSub;
    } else {
        // legacy specialty passed in ?specialty=cardiology
        $mapped = forum_map_specialty_to_category($rawCategory);
        $selectedCatId = $mapped['category'];
        $selectedSubId = $rawSub ?: ($mapped['subSpecialty'] ?? '');
    }
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>새 글 및 질문 작성하기 | NJAP 헬스케어 포럼</title>
  <link rel="icon" href="/favicon.ico">
  
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/ko/_next/static/chunks/1fosv8xgmgdeu.css" />
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
      font-size: 16px;
    }
    html, body {
      overflow-x: hidden !important;
      max-width: 100% !important;
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
        width: 290px !important;
        max-width: 88vw !important;
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
        width: 110px !important;
        min-width: 110px !important;
        max-width: 110px !important;
        height: calc(100vh - 109px) !important;
        transform: none !important;
      }
    }
    .touch-target {
      min-height: 48px;
    }
  </style>
</head>
<body class="bg-[#F8FAFC] text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">

  <!-- Top Global Header -->
  <?php render_forum_header('', null); ?>

  <!-- Main Forum Layout: Sidebar + Ask Form -->
  <div class="flex-1 flex w-full max-w-[1600px] mx-auto">
    
    <!-- Left Sidebar -->
    <?php render_forum_sidebar($categories, $selectedCatId, 'latest', 'topics'); ?>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
      
      <!-- Mandatory Clinical Disclaimer Banner -->
      <?php render_forum_disclaimer_banner(); ?>

      <!-- Breadcrumbs -->
      <div class="flex items-center gap-2 mb-4 text-xs sm:text-sm font-bold text-slate-500">
        <a href="/ko/forum" class="hover:text-blue-600 transition-colors">포럼 홈</a>
        <i class="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
        <span class="text-slate-800">새 질문 / 정보 작성하기 (Create a Topic)</span>
      </div>

      <!-- Discourse Style New Topic Composer Card -->
      <div class="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-2xs max-w-4xl">
        
        <div class="flex items-center justify-between pb-5 mb-6 border-b border-slate-100">
          <div>
            <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <i class="fa-solid fa-pen-to-square text-blue-600"></i>
              <span>새 글 및 질문 작성하기</span>
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">
              뉴저지 한인 동포 및 한인 의료진들과 안심하고 경험과 정보를 나누실 수 있습니다.
            </p>
          </div>
          <a href="/ko/forum" class="text-slate-400 hover:text-slate-600 p-2 touch-target flex items-center justify-center">
            <i class="fa-solid fa-xmark text-xl"></i>
          </a>
        </div>

        <form id="ask-form" onsubmit="handleAskSubmit(event)" class="space-y-6">
          
          <!-- 1. Category Selector & Author Name in 2 columns -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            <!-- 5 Core Categories Dropdown -->
            <div>
              <label for="category_id" class="block text-xs sm:text-sm font-bold text-slate-800 mb-2">
                포럼 카테고리 (게시판 선택) <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select id="category_id" name="category_id" required onchange="handleCategoryChange(this.value)"
                  class="w-full p-3.5 pr-10 rounded-2xl border border-slate-300 text-sm sm:text-base bg-white font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 appearance-none touch-target shadow-2xs">
                  <?php foreach ($categories as $cat): 
                    if (!empty($cat['isAdminOnly'])) continue; // 공지사항은 관리자만
                    $selected = ($cat['id'] === $selectedCatId) ? 'selected' : '';
                  ?>
                    <option value="<?= htmlspecialchars($cat['id']) ?>" <?= $selected ?>>
                      <?= htmlspecialchars($cat['name_ko']) ?> (<?= htmlspecialchars($cat['name_en']) ?>)
                    </option>
                  <?php endforeach; ?>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <i class="fa-solid fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>

            <!-- Dynamic Sub-Specialty Dropdown (Shown for 의학포럼) -->
            <div id="sub-specialty-container" class="<?= ($selectedCatId === 'medical_health') ? '' : 'hidden' ?>">
              <label for="sub_specialty_id" class="block text-xs sm:text-sm font-bold text-blue-900 mb-2 flex items-center gap-1.5">
                <i class="fa-solid fa-stethoscope text-blue-600"></i>
                <span>세부 진료과목 선택 (19개 진료과) <span class="text-red-500">*</span></span>
              </label>
              <div class="relative">
                <select id="sub_specialty_id" name="sub_specialty_id"
                  class="w-full p-3.5 pr-10 rounded-2xl border border-blue-300 bg-blue-50/30 text-sm sm:text-base font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 appearance-none touch-target shadow-2xs">
                  <option value="">일반 / 진료과 미지정 (전문의 배정)</option>
                  <?php foreach ($subSpecialties as $sub): 
                    $subSelected = ($sub['id'] === $selectedSubId) ? 'selected' : '';
                  ?>
                    <option value="<?= htmlspecialchars($sub['id']) ?>" <?= $subSelected ?>>
                      <?= htmlspecialchars($sub['name_ko']) ?> (<?= htmlspecialchars($sub['name_en']) ?>)
                    </option>
                  <?php endforeach; ?>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-blue-500">
                  <i class="fa-solid fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>

            <!-- Author Name / Nickname -->
            <div id="author-name-container">
              <label for="author_name" class="block text-xs sm:text-sm font-bold text-slate-800 mb-2 flex items-center justify-between">
                <span>작성자 닉네임 / 성함 <span class="text-red-500">*</span></span>
                <span id="author-badge-indicator" class="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md hidden">
                  <i class="fa-solid fa-user-doctor mr-1"></i><span id="author-badge-text">공인 전문의 인증 계정</span>
                </span>
              </label>
              <input type="text" id="author_name" name="author_name" required minlength="2"
                placeholder="예: 뉴저지주민, 행복맘 (의료진은 성함과 직함)" 
                class="w-full p-3.5 rounded-2xl border border-slate-300 text-sm sm:text-base focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-900 placeholder-slate-400 touch-target shadow-2xs" />
            </div>

          </div>

          <!-- 2. Question Title -->
          <div>
            <label for="title" class="block text-xs sm:text-sm font-bold text-slate-800 mb-2">
              제목 <span class="text-red-500">*</span>
            </label>
            <input type="text" id="title" name="title" required minlength="5"
              placeholder="예: [병원후기] 버겐카운티 내과 진료 친절했던 곳 공유합니다 / [보험질문] 메디케어 Part B 신청 시기 문의" 
              class="w-full p-4 rounded-2xl border border-slate-300 text-sm sm:text-base focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-900 placeholder-slate-400 touch-target shadow-2xs" />
          </div>

          <!-- 3. Question Body -->
          <div>
            <label for="body" class="block text-xs sm:text-sm font-bold text-slate-800 mb-2">
              상세 내용 <span class="text-red-500">*</span>
            </label>
            <textarea id="body" name="body" rows="9" required minlength="10"
              placeholder="궁금하신 내용이나 나누고 싶은 후기/정보를 상세히 작성해 주세요.&#10;&#10;• 의학 질문의 경우: 언제부터 시작되었는지, 통증의 양상, 복용 중인 약물 등을 기재해 주시면 전문의 답변에 큰 도움이 됩니다.&#10;• 병원 후기/보험 질문의 경우: 지역(타운명)이나 가입된 보험 종류를 함께 남겨주시면 다른 교민들에게 유용합니다." 
              class="w-full p-4 rounded-2xl border border-slate-300 text-sm sm:text-base focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 leading-relaxed font-sans placeholder-slate-400 shadow-2xs"></textarea>
          </div>

          <!-- 3.1. Image Attachment (JPEG, PNG, WEBP) -->
          <div>
            <label class="block text-xs sm:text-sm font-bold text-slate-800 mb-2 flex items-center justify-between">
              <span>📷 사진 / 서류 첨부 (선택 사항)</span>
              <span class="text-xs font-normal text-slate-400">JPEG, PNG, WEBP (최대 12MB, 최대 5장)</span>
            </label>
            
            <input type="file" id="ask-image-input" accept="image/jpeg,image/png,image/webp" multiple class="hidden" onchange="handleAskImageSelect(this)">
            
            <div class="p-5 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl bg-slate-50/50 hover:bg-blue-50/20 transition-all text-center">
              <div class="flex flex-col items-center justify-center gap-2">
                <button type="button" onclick="triggerAskImageUpload()" class="inline-flex items-center gap-2 px-5 py-3 bg-white border border-slate-300 hover:border-blue-500 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 shadow-2xs transition-all cursor-pointer touch-target">
                  <i class="fa-solid fa-cloud-arrow-up text-blue-600 text-base"></i>
                  <span>사진 / 영수증 / 검사결과 이미지 선택</span>
                </button>
                <p class="text-xs text-slate-500">
                  병원 청구서(빌), 처방전, 환부 사진 등 상담에 필요한 사진을 첨부하실 수 있습니다.
                </p>
              </div>

              <!-- Uploading Spinner -->
              <div id="ask-upload-spinner" class="hidden mt-3 text-xs text-blue-600 font-semibold flex items-center justify-center gap-2">
                <i class="fa-solid fa-spinner fa-spin"></i>
                <span>이미지 업로드 중...</span>
              </div>

              <!-- Preview Grid -->
              <div id="ask-images-preview" class="flex flex-wrap gap-3 mt-4 empty:mt-0 justify-center"></div>
            </div>
          </div>

          <!-- 4. Tags Input -->
          <div>
            <label for="tags" class="block text-xs sm:text-sm font-bold text-slate-800 mb-2">
              태그 입력 (선택 사항, 쉼표로 구분)
            </label>
            <input type="text" id="tags" name="tags" 
              placeholder="예: 포트리내과, 메디케어, 백내장수술, 혈압약" 
              class="w-full p-3.5 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-blue-600 text-slate-900 placeholder-slate-400 shadow-2xs" />
          </div>

          <!-- Senior Notice & Bottom Action Buttons -->
          <div class="pt-4 border-t border-slate-100 space-y-4">
            <div class="bg-slate-50 rounded-xl p-3.5 text-xs text-slate-500 flex items-start gap-2.5">
              <i class="fa-solid fa-shield-halved text-blue-600 text-sm mt-0.5 shrink-0"></i>
              <span>
                <strong>안심 안내:</strong> 포럼에 등록된 모든 글은 개인정보(주민번호, SSN, 카드번호 등)가 노출되지 않도록 주의해 주세요. 의학적 긴급 상황 시 즉시 911에 신고하십시오.
              </span>
            </div>

            <div class="flex items-center justify-end gap-3 flex-wrap">
              <a href="/ko/forum" class="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-xs sm:text-sm font-bold text-slate-700 transition-colors touch-target flex items-center justify-center">
                취소
              </a>
              <button type="submit" id="btn-submit-ask" class="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer touch-target">
                <i class="fa-solid fa-paper-plane"></i>
                <span>토픽 등록하기 (Post Topic)</span>
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

    function handleCategoryChange(catId) {
      const subContainer = document.getElementById('sub-specialty-container');
      const subSelect = document.getElementById('sub_specialty_id');
      if (catId === 'medical_health') {
        subContainer.classList.remove('hidden');
      } else {
        subContainer.classList.add('hidden');
        if (subSelect) subSelect.value = '';
      }
    }

    function triggerAskImageUpload() {
      if (!currentUser) {
        openGoogleAuthModal();
        return;
      }
      document.getElementById('ask-image-input').click();
    }

    async function handleAskImageSelect(input) {
      const files = Array.from(input.files || []);
      if (files.length === 0) return;

      if (uploadedImages.length + files.length > 5) {
        alert('사진은 최대 5장까지 첨부할 수 있습니다.');
        input.value = '';
        return;
      }

      const spinner = document.getElementById('ask-upload-spinner');
      spinner.classList.remove('hidden');

      for (const file of files) {
        if (file.size > 12 * 1024 * 1024) {
          alert(`"${file.name}" 파일 크기가 12MB를 초과합니다.`);
          continue;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
          const res = await fetch('/ko/api/forum.php?action=upload_image', {
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
        <div class="relative group w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs bg-white">
          <img src="${url}" class="w-full h-full object-cover" alt="첨부 이미지">
          <button type="button" onclick="removeAskImage(${idx})" 
                  class="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center shadow-md hover:bg-red-700 transition-colors">
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

      const categoryId = document.getElementById('category_id').value;
      const subSpecialtyId = document.getElementById('sub_specialty_id')?.value || '';
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
        const res = await fetch('/ko/api/forum.php?action=ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title,
            body: body,
            category_id: categoryId,
            sub_specialty_id: subSpecialtyId,
            specialty_id: (categoryId === 'medical_health' && subSpecialtyId) ? subSpecialtyId : categoryId,
            author_name: authorName,
            tags: tags,
            images: uploadedImages
          })
        });
        const data = await res.json();
        const createdId = data.data?.id || data.question?.id;
        if (data.success && createdId) {
          window.location.href = '/ko/forum/topic/' + encodeURIComponent(createdId);
        } else {
          alert(data.error || '질문 등록에 실패했습니다.');
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> 토픽 등록하기 (Post Topic)';
        }
      } catch(err) {
        alert('질문 등록 중 통신 오류가 발생했습니다.');
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> 토픽 등록하기 (Post Topic)';
      }
    }

    // Call sync on page load if user already logged in
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(syncAuthorFields, 400);
    });
  </script>
</body>
</html>
