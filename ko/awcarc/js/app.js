/**
 * AWCA Resource Center - Offline Web Application Core
 * Enhanced with Billboard Head, Section Photo Banners, and Interactive Diagrams
 */

(function() {
  // State
  const state = {
    lang: localStorage.getItem("awcarc_lang") || "ko",
    theme: localStorage.getItem("awcarc_theme") || "light",
    view: "home",
    currentArticle: null,
    activeSectionFilter: null,
    searchQuery: "",
    billboardIndex: 0,
    billboardTimer: null
  };

  // Data cache
  let allArticles = [];
  let sections = [];

  // Billboard Slides Data (Bilingual)
  const BILLBOARD_SLIDES = [
    {
      id: "medicare",
      badge_ko: "2026 메디케어 중점 가이드",
      badge_en: "2026 Medicare Essential Update",
      title_ko: "메디케어 파트 A·B·C·D<br><span>종합 보장 및 처방약 가이드</span>",
      title_en: "Medicare Parts A, B, C &amp; D<br><span>Comprehensive Coverage Guide</span>",
      desc_ko: "오리지널 메디케어와 메디케어 어드밴티지의 차이, 처방약 파트 D 연간 본인부담금 상한제($2,000 Cap), 뉴저지 PAAD 및 시니어 골드 혜택을 한눈에 확인하세요.",
      desc_en: "Compare Original Medicare vs. Medicare Advantage, the $2,000 Part D annual out-of-pocket cap, and New Jersey's generous PAAD prescription assistance program.",
      img: "assets/AWCA-Resource-Center-1200x630-1.png",
      caption_ko: "메디케어 4대 핵심 파트 구조 및 보장 범위",
      caption_en: "Four Core Pillars of Medicare Coverage",
      cta_text_ko: "메디케어 총정리 보기",
      cta_text_en: "Read Medicare Overview",
      cta_action: () => navigateToArticleBySlug("medicare-overview")
    },
    {
      id: "housing",
      badge_ko: "시니어 및 서민 주거 복지",
      badge_en: "Senior & Affordable Housing",
      title_ko: "시니어 아파트 &amp; 섹션 8<br><span>뉴저지 주거 지원 총람</span>",
      title_en: "Senior Apartments &amp; Section 8<br><span>New Jersey Housing Directory</span>",
      desc_ko: "만 62세 이상 독립 생활을 위한 HUD 섹션 202 시니어 아파트(소득의 30% 렌트비), 어포더블 하우징(LIHTC), 뉴저지 시니어 프리즈(재산세 동결 환급) 신청 요건을 안내합니다.",
      desc_en: "Explore HUD Section 202 senior apartments capping rent at 30% of income, LIHTC affordable communities, and NJ Senior Freeze property tax reimbursements.",
      img: "assets/01-senior-apartmenta-banner.png",
      caption_ko: "HUD 섹션 202 시니어 독립형 아파트",
      caption_en: "HUD Section 202 Independent Senior Living",
      cta_text_ko: "시니어 아파트 가이드 보기",
      cta_text_en: "Read Housing Guide",
      cta_action: () => navigateToArticleBySlug("housing-senior-apartments")
    },
    {
      id: "medicaid",
      badge_ko: "의료 안전망 & 듀얼 플랜",
      badge_en: "Medicaid & Dual Safety Net",
      title_ko: "뉴저지 패밀리케어 &amp; 메디케이드<br><span>듀얼 플랜(D-SNP) 완벽 분석</span>",
      title_en: "NJ FamilyCare &amp; Medicaid<br><span>Dual Eligible D-SNP Navigator</span>",
      desc_ko: "연방 빈곤선 138% 소득 확대 메디케이드부터, 65세 이상 ABD 메디케이드, 메디케어와 메디케이드를 동시 소지한 분들을 위한 본인부담금 $0 듀얼 플랜을 비교합니다.",
      desc_en: "Understand expanded Medicaid (138% FPL), Aged/Blind/Disabled criteria, and Dual-Eligible Special Needs Plans (D-SNP) eliminating out-of-pocket healthcare costs.",
      img: "assets/02-medicaid-banner.png",
      caption_ko: "메디케이드 관리의료(MCO) 및 듀얼 지원",
      caption_en: "Managed Medicaid & Dual-Eligibility Protection",
      cta_text_ko: "메디케이드 가이드 보기",
      cta_text_en: "Read Medicaid Guide",
      cta_action: () => navigateToArticleBySlug("medicaid-overview")
    },
    {
      id: "calculator",
      badge_ko: "실시간 자격 확인 계산기",
      badge_en: "Instant Benefits Screener",
      title_ko: "30초 만에 확인하는<br><span>정부 지원 프로그램 예상 자격</span>",
      title_en: "30-Second Benefits Screener<br><span>Personalized Assistance Eligibility</span>",
      desc_ko: "가구원 수와 소득만 입력하면 메디케이드, 메디케어 보조, 푸드스탬프(SNAP), 시니어 주거 및 난방비 보조 등 8개 이상 정부 프로그램의 수혜 가능성을 즉시 계산합니다.",
      desc_en: "Input your household size and income to instantly screen across Medicaid, Medicare Savings Programs, SNAP Food Assistance, HUD Housing, and Utility Grants.",
      img: "assets/03-long-term-care-banner.png",
      caption_ko: "원스톱 자격 확인 및 맞춤형 지원 분석",
      caption_en: "Comprehensive Multi-Program Eligibility Analysis",
      cta_text_ko: "지금 바로 자격 확인하기",
      cta_text_en: "Launch Calculator Now",
      cta_action: () => switchView("calculator")
    }
  ];

  // Init
  function init() {
    if (window.AWCA_DATA) {
      sections = window.AWCA_DATA.sections || [];
      allArticles = window.AWCA_DATA.articles || [];
    } else {
      fetch("data/articles.json")
        .then(res => res.json())
        .then(data => {
          sections = data.sections;
          allArticles = data.articles;
          renderApp();
        });
      return;
    }

    applyTheme(state.theme);
    bindEvents();
    setupCalculator();
    setupBillboard();

    handleRouting();
    window.addEventListener("hashchange", handleRouting);

    renderApp();
  }

  // -------------------------------------------------------------
  // Billboard Showcase Controller
  // -------------------------------------------------------------
  function setupBillboard() {
    renderBillboardSlide(state.billboardIndex);
    renderBillboardTabs();

    // Auto rotate every 7 seconds
    if (state.billboardTimer) clearInterval(state.billboardTimer);
    state.billboardTimer = setInterval(() => {
      if (state.view === "home") {
        state.billboardIndex = (state.billboardIndex + 1) % BILLBOARD_SLIDES.length;
        renderBillboardSlide(state.billboardIndex);
        updateBillboardTabs();
      }
    }, 7000);
  }

  function renderBillboardSlide(index) {
    const slide = BILLBOARD_SLIDES[index];
    if (!slide) return;

    const isKo = state.lang === "ko";
    const badge = document.getElementById("billboardBadge");
    const title = document.getElementById("billboardTitle");
    const desc = document.getElementById("billboardDesc");
    const img = document.getElementById("billboardImg");
    const caption = document.getElementById("billboardCaption");
    const ctaBtn = document.getElementById("billboardCtaBtn");

    if (badge) badge.textContent = isKo ? slide.badge_ko : slide.badge_en;
    if (title) title.innerHTML = isKo ? slide.title_ko : slide.title_en;
    if (desc) desc.textContent = isKo ? slide.desc_ko : slide.desc_en;
    if (caption) caption.textContent = isKo ? slide.caption_ko : slide.caption_en;
    if (img) {
      img.src = slide.img;
      img.alt = isKo ? slide.caption_ko : slide.caption_en;
    }
    if (ctaBtn) {
      ctaBtn.textContent = isKo ? slide.cta_text_ko : slide.cta_text_en;
      ctaBtn.onclick = slide.cta_action;
    }
  }

  function renderBillboardTabs() {
    const tabsContainer = document.getElementById("billboardNavBar");
    if (!tabsContainer) return;

    const isKo = state.lang === "ko";
    tabsContainer.innerHTML = BILLBOARD_SLIDES.map((slide, idx) => `
      <div class="billboard-tab ${idx === state.billboardIndex ? 'active' : ''}" onclick="window.selectBillboard(${idx})">
        <div class="tab-pill-label">${isKo ? `하이라이트 0${idx + 1}` : `Spotlight 0${idx + 1}`}</div>
        <div class="tab-pill-title">${isKo ? slide.badge_ko : slide.badge_en}</div>
      </div>
    `).join("");
  }

  function updateBillboardTabs() {
    document.querySelectorAll(".billboard-tab").forEach((tab, idx) => {
      tab.classList.toggle("active", idx === state.billboardIndex);
    });
  }

  window.selectBillboard = function(idx) {
    state.billboardIndex = idx;
    renderBillboardSlide(idx);
    updateBillboardTabs();
  };

  // -------------------------------------------------------------
  // Theme & Language
  // -------------------------------------------------------------
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("awcarc_theme", theme);
    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) {
      themeBtn.innerHTML = theme === "dark" 
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }

  function setLanguage(lang) {
    state.lang = lang;
    localStorage.setItem("awcarc_lang", lang);
    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    if (state.currentArticle && state.view === "reader") {
      const targetSlug = state.currentArticle.counterpart_slug;
      const counterpart = allArticles.find(a => a.slug === targetSlug);
      if (counterpart) {
        navigateToArticle(counterpart.id);
        return;
      }
    }

    renderApp();
  }

  // -------------------------------------------------------------
  // Routing
  // -------------------------------------------------------------
  function handleRouting() {
    const hash = window.location.hash.replace("#", "") || "home";
    if (hash.startsWith("article/")) {
      const artId = hash.replace("article/", "");
      navigateToArticle(artId, false);
    } else if (["home", "calculator", "directory", "about"].includes(hash)) {
      switchView(hash, false);
    } else if (hash.startsWith("category/")) {
      const catId = parseInt(hash.replace("category/", ""));
      state.activeSectionFilter = catId;
      switchView("directory", false);
    } else {
      switchView("home", false);
    }
  }

  function switchView(viewName, updateHash = true) {
    state.view = viewName;
    if (updateHash) {
      window.location.hash = viewName;
    }

    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.remove("active");
    });
    const targetSec = document.getElementById(`view-${viewName}`);
    if (targetSec) {
      targetSec.classList.add("active");
    }

    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.toggle("active", link.dataset.view === viewName);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (viewName === "directory") {
      renderDirectory();
    } else if (viewName === "home") {
      renderBillboardSlide(state.billboardIndex);
      renderBillboardTabs();
      renderBlogNews();
      renderDiagrams();
      renderHomeCategories();
      renderVideoSection();
    } else if (viewName === "calculator") {
      runCalculator();
    }
  }

  function navigateToArticle(artId, updateHash = true) {
    const art = allArticles.find(a => a.id === artId || a.slug === artId);
    if (!art) return;

    state.currentArticle = art;
    state.view = "reader";
    if (updateHash) {
      window.location.hash = `article/${art.id}`;
    }

    document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
    const readerSec = document.getElementById("view-reader");
    if (readerSec) readerSec.classList.add("active");

    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));

    renderReader(art);
    updateStaticText();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigateToArticleBySlug(slug) {
    const targetSlug = state.lang === "ko" ? `${slug}-ko` : slug;
    const art = allArticles.find(a => a.slug === targetSlug) || allArticles.find(a => a.slug.includes(slug));
    if (art) {
      navigateToArticle(art.id);
    }
  }

  // -------------------------------------------------------------
  // Renderers
  // -------------------------------------------------------------
  function renderApp() {
    updateStaticText();
    renderBillboardSlide(state.billboardIndex);
    renderBillboardTabs();
    renderBlogNews();
    renderDiagrams();
    renderHomeCategories();
    renderVideoSection();
    renderDirectory();
    if (state.view === "calculator") {
      runCalculator();
    }
  }

  // -------------------------------------------------------------
  // Blog & Medical News Section Controller (3-Column Layout)
  // -------------------------------------------------------------
  function renderBlogNews() {
    const data = window.AWCA_BLOG_NEWS;
    if (!data) return;

    const isKo = state.lang === "ko";

    // Column 1: Feature Lead Article
    const colFeature = document.getElementById("blogColFeature");
    if (colFeature && data.featured) {
      const f = data.featured;
      const cat = isKo ? f.category_ko : f.category_en;
      const title = isKo ? f.title_ko : f.title_en;
      const caption = isKo ? f.caption_ko : f.caption_en;
      const excerpt = isKo ? f.excerpt_ko : f.excerpt_en;
      const bullets = isKo ? f.bullets_ko : f.bullets_en;
      const author = isKo ? f.author_ko : f.author_en;
      const readTime = isKo ? f.readTime_ko : f.readTime_en;
      const badge = isKo ? f.badge_ko : f.badge_en;

      colFeature.innerHTML = `
        <div class="feature-meta-header">
          <span class="feature-cat-tag"><span class="feature-cat-dot"></span>${cat}</span>
          <span class="feature-meta-sep">&bull;</span>
          <span class="feature-date">${f.date}</span>
        </div>
        <h2 class="feature-title" onclick="window.location.hash='directory'">${title}</h2>
        <div class="feature-img-wrapper" onclick="window.location.hash='directory'">
          <img src="${f.img}" alt="${title}" class="feature-img">
        </div>
        <div class="feature-caption">${caption}</div>
        <p class="feature-excerpt">${excerpt}</p>
        <div class="feature-summary-box">
          <div class="summary-box-title">${isKo ? '핵심 요약' : 'Key Takeaways'}</div>
          <ul class="summary-box-list">
            ${bullets.map(b => `<li>${b}</li>`).join("")}
          </ul>
        </div>
        <div class="feature-footer-bar">
          <div>${author} &bull; &#x23F1; ${readTime}</div>
          <span class="feature-topstory-badge">${badge}</span>
        </div>
      `;
    }

    // Column 2: Major News
    const majorTitle = document.getElementById("majorNewsTitle");
    if (majorTitle) {
      majorTitle.textContent = isKo ? "주요 뉴스" : "Major Health News";
    }

    const majorList = document.getElementById("blogMajorList");
    if (majorList && data.majorNews) {
      majorList.innerHTML = data.majorNews.map(item => {
        const cat = isKo ? item.category_ko : item.category_en;
        const title = isKo ? item.title_ko : item.title_en;
        return `
          <div class="major-news-item" onclick="window.location.hash='directory'">
            <div class="major-news-content">
              <div class="major-news-cat">${cat}</div>
              <h4 class="major-news-title">${title}</h4>
              <div class="major-news-date">${item.date}</div>
            </div>
            <img src="${item.img}" alt="${title}" class="major-news-thumb">
          </div>
        `;
      }).join("");
    }
  }

  function renderDiagrams() {
    const container = document.getElementById("diagramsContainer");
    if (!container) return;

    const isKo = state.lang === "ko";

    container.innerHTML = `
      <div class="section-header" style="margin-bottom: 8px;">
        <div>
          <h2 class="section-title">📊 Visual Explanations &amp; Diagrams</h2>
          <div class="section-sub">${isKo ? '복잡한 공공 복지·의료 제도를 도표와 다이어그램으로 알기 쉽게 정리했습니다.' : 'Complex public welfare and healthcare systems simplified into clear visual diagrams and charts.'}</div>
        </div>
      </div>

      <div class="diagram-grid">
        <!-- Diagram 1: 4 Pillars of Medicare -->
        <div class="diagram-card">
          <div class="diag-title-row">
            <div class="diag-icon">A·B</div>
            <div>
              <h3 class="diag-title">${isKo ? '메디케어 4대 파트(Parts) 구조도' : 'The 4 Pillars of Medicare Architecture'}</h3>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${isKo ? '오리지널 메디케어 vs 메디케어 어드밴티지' : 'Original Medicare vs Medicare Advantage'}</div>
            </div>
          </div>

          <div class="pillars-container">
            <div class="pillar-box" style="border-top-color: #0284c7;">
              <div class="pillar-name" style="color: #0284c7;">Part A</div>
              <div class="pillar-role">${isKo ? '병원 입원 보장' : 'Hospital Inpatient'}</div>
              <div class="pillar-desc">${isKo ? '입원 병동, 전문 간호 시설(SNF), 호스피스. 10년 납부 시 보험료 $0.' : 'Inpatient hospital stays, skilled nursing (SNF), hospice care. $0 premium with 40 quarters of work.'}</div>
            </div>
            <div class="pillar-box" style="border-top-color: #0284c7;">
              <div class="pillar-name" style="color: #0284c7;">Part B</div>
              <div class="pillar-role">${isKo ? '의사 외래 진료' : 'Doctor & Outpatient'}</div>
              <div class="pillar-desc">${isKo ? '통원 진료, 검사, 예방 접종, 의료 장비. 월 표준 보험료 납부.' : 'Doctor visits, outpatient therapy, diagnostics, vaccines, medical equipment. Standard monthly premium.'}</div>
            </div>
            <div class="pillar-box" style="border-top-color: var(--accent);">
              <div class="pillar-name">Part C</div>
              <div class="pillar-role">${isKo ? '메디케어 어드밴티지' : 'Medicare Advantage'}</div>
              <div class="pillar-desc">${isKo ? 'A+B+D+치과/안과를 민간 보험사가 하나로 통합 제공하는 플랜.' : 'All-in-one private plans combining Parts A+B+D with dental, vision, hearing, and wellness benefits.'}</div>
            </div>
            <div class="pillar-box" style="border-top-color: #10b981;">
              <div class="pillar-name" style="color: #10b981;">Part D</div>
              <div class="pillar-role">${isKo ? '처방약 플랜' : 'Prescription Drugs'}</div>
              <div class="pillar-desc">${isKo ? '외래 처방약 비용 지원. 2026년부터 연간 본인부담금 $2,000 상한제 적용.' : 'Outpatient prescription drug coverage with $2,000 annual out-of-pocket spending cap under IRA.'}</div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--card-border); padding-top: 12px; font-size: 0.82rem;">
            <span style="color: var(--text-muted);">${isKo ? 'Part A + B = 오리지널 메디케어 (Original Medicare)' : 'Part A + B = Original Medicare Coverage'}</span>
            <button class="btn btn-outline-purple btn-sm" onclick="window.location.hash='article/art-38'">
              ${isKo ? '상세 설명 보기 &rarr;' : 'Read Medicare Guide &rarr;'}
            </button>
          </div>
        </div>

        <!-- Diagram 2: Benefits Income Ladder -->
        <div class="diagram-card">
          <div class="diag-title-row">
            <div class="diag-icon" style="background: #ecfdf5; color: #059669;">FPL</div>
            <div>
              <h3 class="diag-title">${isKo ? '소득 수준별 정부 지원 사다리' : 'Federal Poverty Level (FPL) Benefit Ladder'}</h3>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${isKo ? '연방 빈곤선(FPL) 기준 혜택 단계' : 'Income eligibility tiers based on 2026 FPL guidelines'}</div>
            </div>
          </div>

          <div class="ladder-container">
            <div class="ladder-step">
              <div class="ladder-fpl" style="background: #ecfdf5; color: #059669;">100%</div>
              <div class="ladder-prog">${isKo ? '메디케어 QMB / SSI 전액 지원' : 'Medicare QMB / SSI Full Assistance'}</div>
              <div class="ladder-limit">${isKo ? '월 $1,255 이하' : 'Under $1,255/mo'}</div>
            </div>
            <div class="ladder-step">
              <div class="ladder-fpl" style="background: #f0f9ff; color: #0284c7;">138%</div>
              <div class="ladder-prog">${isKo ? 'NJ FamilyCare (오바마 확장 메디케이드)' : 'NJ FamilyCare (Expanded ACA Medicaid)'}</div>
              <div class="ladder-limit">${isKo ? '월 $1,732 이하' : 'Under $1,732/mo'}</div>
            </div>
            <div class="ladder-step">
              <div class="ladder-fpl" style="background: #ede9fe; color: #7c3aed;">185%</div>
              <div class="ladder-prog">${isKo ? 'NJ SNAP (푸드스탬프 식비 지원)' : 'NJ SNAP (Food Assistance Program)'}</div>
              <div class="ladder-limit">${isKo ? '월 $2,322 이하' : 'Under $2,322/mo'}</div>
            </div>
            <div class="ladder-step">
              <div class="ladder-fpl" style="background: #fffbeb; color: #d97706;">PAAD</div>
              <div class="ladder-prog">${isKo ? '뉴저지 PAAD 시니어 처방약 전액 지원' : 'NJ PAAD Senior Prescription Support'}</div>
              <div class="ladder-limit">${isKo ? '연 $52,142 이하' : 'Under $52,142/yr'}</div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--card-border); padding-top: 12px; font-size: 0.82rem;">
            <span style="color: var(--text-muted);">${isKo ? '가구원 1인 기준 2026 연방·뉴저지 가이드라인' : 'Based on 1-Person Household 2026 Federal & NJ Limits'}</span>
            <button class="btn btn-outline-purple btn-sm" onclick="window.location.hash='calculator'">
              ${isKo ? '내 자격 계산하기 &rarr;' : 'Check Your Eligibility &rarr;'}
            </button>
          </div>
        </div>

        <!-- Diagram 3: Dual Eligibility -->
        <div class="diagram-card">
          <div class="diag-title-row">
            <div class="diag-icon" style="background: #fdf2f8; color: #db2777;">D-SNP</div>
            <div>
              <h3 class="diag-title">${isKo ? '메디케어 + 메디케이드 듀얼(Dual) 보장' : 'Dual Eligibility (Medicare + Medicaid)'}</h3>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${isKo ? '두 가지 보험을 모두 소지한 경우' : 'Comprehensive coverage for dual-eligible beneficiaries'}</div>
            </div>
          </div>

          <div style="display: flex; gap: 12px; align-items: center; margin: 12px 0;">
            <div style="flex: 1; background: #e0f2fe; padding: 14px; border-radius: 8px; text-align: center;">
              <div style="font-size: 0.85rem; font-weight: 800; color: #0369a1;">${isKo ? '1차 보험 (Primary)' : 'Primary Coverage'}</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 4px 0;">${isKo ? '메디케어' : 'Medicare'}</div>
              <div style="font-size: 0.74rem; color: #475569;">${isKo ? '전체 의료비의 약 80% 우선 지불' : 'Pays ~80% of approved medical costs first'}</div>
            </div>
            <div style="font-weight: 800; font-size: 1.3rem; color: var(--text-muted);">+</div>
            <div style="flex: 1; background: #ede9fe; padding: 14px; border-radius: 8px; text-align: center;">
              <div style="font-size: 0.85rem; font-weight: 800; color: #6d28d9;">${isKo ? '2차 보험 (Secondary)' : 'Secondary Coverage'}</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 4px 0;">${isKo ? '메디케이드' : 'Medicaid'}</div>
              <div style="font-size: 0.74rem; color: #475569;">${isKo ? '남은 20% 및 디덕터블 전액 부담' : 'Covers remaining 20% coinsurance & deductibles'}</div>
            </div>
            <div style="font-weight: 800; font-size: 1.3rem; color: var(--text-muted);">=</div>
            <div style="flex: 1; background: #ecfdf5; padding: 14px; border-radius: 8px; text-align: center; border: 1.5px solid #10b981;">
              <div style="font-size: 0.85rem; font-weight: 800; color: #059669;">${isKo ? '환자 부담금' : 'Patient Responsibility'}</div>
              <div style="font-size: 1.2rem; font-weight: 800; color: #059669; margin: 4px 0;">${isKo ? '$0 (무료)' : '$0 (Zero Cost)'}</div>
              <div style="font-size: 0.74rem; color: #475569;">${isKo ? '치과·안과·교통비 추가' : 'Plus dental, vision, hearing, and transit'}</div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--card-border); padding-top: 12px; font-size: 0.82rem;">
            <span style="color: var(--text-muted);">${isKo ? 'D-SNP(듀얼 특별 필요 플랜)으로 원스톱 관리' : 'All-in-one coordinated care with D-SNP special plans'}</span>
            <button class="btn btn-outline-purple btn-sm" onclick="window.location.hash='article/art-68'">
              ${isKo ? '듀얼 플랜 안내 &rarr;' : 'Dual Plan Guides &rarr;'}
            </button>
          </div>
        </div>

        <!-- Diagram 4: Senior Living Progression -->
        <div class="diagram-card">
          <div class="diag-title-row">
            <div class="diag-icon" style="background: #fff7ed; color: #ea580c;">🏡</div>
            <div>
              <h3 class="diag-title">${isKo ? '시니어 주거 및 요양 단계별 로드맵' : 'Senior Living & Long-Term Care Roadmap'}</h3>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${isKo ? '건강 상태와 필요도에 따른 주거 형태' : 'Housing options tailored to health and care requirements'}</div>
            </div>
          </div>

          <div class="pathway-flow">
            <div class="pathway-node">
              <div class="pathway-step-num">Step 1</div>
              <div class="pathway-node-title">${isKo ? '독립 시니어 아파트' : 'Senior Apartments'}</div>
              <div class="pathway-node-sub">${isKo ? 'HUD 섹션 202 (만 62세+)' : 'HUD Section 202 (Age 62+)'}</div>
            </div>
            <div class="pathway-arrow">&rarr;</div>
            <div class="pathway-node">
              <div class="pathway-step-num">Step 2</div>
              <div class="pathway-node-title">${isKo ? '재택 돌봄 (PPP)' : 'In-Home Care (PPP)'}</div>
              <div class="pathway-node-sub">${isKo ? '가족 간병 유급 고용' : 'Paid family caregiving'}</div>
            </div>
            <div class="pathway-arrow">&rarr;</div>
            <div class="pathway-node">
              <div class="pathway-step-num">Step 3</div>
              <div class="pathway-node-title">${isKo ? '어시스티드 리빙' : 'Assisted Living'}</div>
              <div class="pathway-node-sub">${isKo ? '일상 식사·투약 보조' : 'Meals & personal care support'}</div>
            </div>
            <div class="pathway-arrow">&rarr;</div>
            <div class="pathway-node">
              <div class="pathway-step-num">Step 4</div>
              <div class="pathway-node-title">${isKo ? '요양원 / MLTSS' : 'Skilled Nursing / MLTSS'}</div>
              <div class="pathway-node-sub">${isKo ? '24시간 전문 간호' : '24/7 skilled nursing'}</div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--card-border); padding-top: 12px; font-size: 0.82rem;">
            <span style="color: var(--text-muted);">${isKo ? '소득 50% AMI 이하 시 저렴한 임대료 보장' : 'Affordable rents guaranteed under 50% Area Median Income'}</span>
            <button class="btn btn-outline-purple btn-sm" onclick="window.location.hash='article/art-104'">
              ${isKo ? '주거 부문 전체 보기 &rarr;' : 'Explore Housing Guides &rarr;'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function updateStaticText() {
    const isKo = state.lang === "ko";

    // Skip Link
    const skipLink = document.getElementById("skipToContent");
    if (skipLink) skipLink.textContent = isKo ? "본문 바로가기 (Skip to main content)" : "Skip to main content";

    // Nav Menu
    const navHome = document.querySelector('[data-view="home"] span');
    const navCalc = document.querySelector('[data-view="calculator"] span');
    const navDir = document.querySelector('[data-view="directory"] span');
    const navAbout = document.querySelector('[data-view="about"] span');

    if (navHome) navHome.textContent = isKo ? "홈" : "Home";
    if (navCalc) navCalc.textContent = isKo ? "자격 확인 계산기" : "Benefits Screener";
    if (navDir) navDir.textContent = isKo ? "자료 탐색" : "Browse Guides";
    if (navAbout) navAbout.textContent = isKo ? "소개 및 문의" : "About & Contact";

    // Search Trigger
    const searchTriggerText = document.querySelector(".search-trigger span:first-of-type");
    if (searchTriggerText) {
      searchTriggerText.textContent = isKo ? "가이드 검색..." : "Search resources...";
    }

    // Billboard Buttons
    const bbCalcBtnText = document.getElementById("billboardCalcBtnText");
    if (bbCalcBtnText) bbCalcBtnText.textContent = isKo ? "자격 확인 계산기" : "Benefits Screener";
    const bbAllBtnText = document.getElementById("billboardAllBtnText");
    if (bbAllBtnText) bbAllBtnText.textContent = isKo ? "전체 200개 가이드" : "All 200 Guides";

    // Categories Section
    const catSecTitle = document.getElementById("categoriesSectionTitle");
    if (catSecTitle) catSecTitle.textContent = isKo ? "Core Resource Categories" : "Core Resource Categories";
    const catSecSub = document.getElementById("categoriesSectionSub");
    if (catSecSub) catSecSub.textContent = isKo 
      ? "공식 가이드 목록입니다. 카드를 선택하시면 상세 안내서로 이동합니다." 
      : "Official guideline library. Select any category to explore comprehensive guides.";

    // Video Hub Section
    const vidSecTag = document.getElementById("videoSectionTag");
    if (vidSecTag) vidSecTag.textContent = isKo ? "AWCA YouTube Social Service Series" : "AWCA YouTube Social Welfare Series";

    const vidSecTitle = document.getElementById("videoSectionTitle");
    if (vidSecTitle) vidSecTitle.textContent = isKo ? "🎬 AWCA 복지 상담 영상관" : "🎬 Social Welfare Video Knowledge Hub";

    const vidSecSub = document.getElementById("videoSectionSub");
    if (vidSecSub) vidSecSub.textContent = isKo 
      ? "공식 [사회복지 상담] 전체 영상 모음입니다. 상단 주제별 필터를 통해 원하는 분야의 전문 상담 영상을 바로 시청하실 수 있습니다." 
      : "Official AWCA Social Welfare Counseling video collection. Browse and watch comprehensive guides by topic.";

    const playlistHeadTitle = document.getElementById("playlistHeaderTitle");
    if (playlistHeadTitle) playlistHeadTitle.textContent = isKo ? "영상 목록" : "Playlist Queue";

    const scrollHint = document.getElementById("playlistScrollHint");
    if (scrollHint) scrollHint.textContent = isKo ? "5개씩 스크롤하여 더보기 ↓" : "Scroll down to browse all ↓";

    // Calculator View
    const calcTitle = document.getElementById("calcTitleText");
    if (calcTitle) calcTitle.textContent = isKo 
      ? "Benefits Screener & 자격 확인 계산기" 
      : "Benefits Screener & Eligibility Calculator";

    const calcDesc = document.getElementById("calcDescText");
    if (calcDesc) calcDesc.textContent = isKo 
      ? "가구원 수와 소득, 연령 및 해당 조건을 입력하시면 메디케이드, 메디케어 보조, 푸드스탬프, 시니어 주거 지원 등의 예상 자격을 실시간으로 분석해 드립니다." 
      : "Enter your household size, monthly income, age group, and circumstances to receive an instant assessment for Medicaid, Medicare Savings Programs, SNAP Food Stamps, Senior Housing, and Prescription Assistance.";

    const calcSizeLabel = document.getElementById("calcSizeLabel");
    if (calcSizeLabel) calcSizeLabel.textContent = isKo ? "가구원 수 (Household Size)" : "Household Size";

    const calcSizeSelect = document.getElementById("calcSize");
    if (calcSizeSelect) {
      const options = [
        { val: "1", ko: "1인 (Single)", en: "1 Person (Single)" },
        { val: "2", ko: "2인 (Couple / 2 Persons)", en: "2 Persons (Couple)" },
        { val: "3", ko: "3인 (3 Persons)", en: "3 Persons" },
        { val: "4", ko: "4인 (4 Persons)", en: "4 Persons" },
        { val: "5", ko: "5인 (5 Persons)", en: "5 Persons" },
        { val: "6", ko: "6인 이상 (6+ Persons)", en: "6+ Persons" }
      ];
      Array.from(calcSizeSelect.options).forEach((opt, idx) => {
        if (options[idx]) {
          opt.textContent = isKo ? options[idx].ko : options[idx].en;
        }
      });
    }

    const calcIncomeLabel = document.getElementById("calcIncomeLabel");
    if (calcIncomeLabel) calcIncomeLabel.textContent = isKo ? "월 총 소득 (Gross Monthly Income)" : "Gross Monthly Income";

    document.querySelectorAll(".quick-btn").forEach(btn => {
      const amt = btn.dataset.amt;
      if (amt === "0") btn.textContent = isKo ? "$0 (무소득)" : "$0 (No income)";
      if (amt === "1255") btn.textContent = isKo ? "$1,255 (SSI/노인장애인)" : "$1,255 (SSI/ABD)";
      if (amt === "1732") btn.textContent = isKo ? "$1,732 (메디케이드 138%)" : "$1,732 (Medicaid 138%)";
      if (amt === "2322") btn.textContent = isKo ? "$2,322 (SNAP 185%)" : "$2,322 (SNAP 185%)";
    });

    const calcAgeLabel = document.getElementById("calcAgeLabel");
    if (calcAgeLabel) calcAgeLabel.textContent = isKo ? "신청자 연령대 (Applicant Age)" : "Applicant Age Group";

    const ageUnder19T = document.getElementById("ageUnder19Title");
    const ageUnder19S = document.getElementById("ageUnder19Sub");
    if (ageUnder19T) ageUnder19T.textContent = isKo ? "만 18세 이하" : "Under 18";
    if (ageUnder19S) ageUnder19S.textContent = isKo ? "CHIP / 아동" : "CHIP / Children";

    const ageAdultT = document.getElementById("ageAdultTitle");
    const ageAdultS = document.getElementById("ageAdultSub");
    if (ageAdultT) ageAdultT.textContent = isKo ? "만 19~64세" : "Age 19–64";
    if (ageAdultS) ageAdultS.textContent = isKo ? "성인 / ACA" : "Adult / ACA";

    const ageSeniorT = document.getElementById("ageSeniorTitle");
    const ageSeniorS = document.getElementById("ageSeniorSub");
    if (ageSeniorT) ageSeniorT.textContent = isKo ? "만 65세 이상" : "Age 65+";
    if (ageSeniorS) ageSeniorS.textContent = isKo ? "시니어 / 메디케어" : "Senior / Medicare";

    const calcCondLabel = document.getElementById("calcConditionsLabel");
    if (calcCondLabel) calcCondLabel.textContent = isKo ? "해당 조건 선택 (Special Conditions)" : "Special Circumstances & Criteria";

    const condDis = document.getElementById("condDisabledText");
    if (condDis) condDis.textContent = isKo ? "장애 판정 또는 SSDI 24개월 이상 수령 중" : "Determined disabled or receiving SSDI for 24+ months";

    const condMed = document.getElementById("condMedicareText");
    if (condMed) condMed.textContent = isKo ? "현재 메디케어(Medicare) 소지 중" : "Currently enrolled in Medicare";

    const condHome = document.getElementById("condHomeownerText");
    if (condHome) condHome.textContent = isKo ? "뉴저지 자택 소유 (재산세 감면 신청 대상)" : "Own a primary home in New Jersey (Property tax relief eligible)";

    const condCare = document.getElementById("condCareText");
    if (condCare) condCare.textContent = isKo ? "재택 간병 / 일상생활 돌봄(식사, 목욕 등) 필요" : "Need home care / assistance with daily living (meals, bathing, etc.)";

    const condAssets = document.getElementById("condAssetsText");
    if (condAssets) condAssets.textContent = isKo ? "유동 자산 $4,000(단독) / $6,000(부부) 이하 (집 1채, 차량 1대 제외)" : "Liquid assets under $4,000 (Single) / $6,000 (Couple) (Primary home & 1 vehicle excluded)";

    const condPreg = document.getElementById("condPregnantText");
    if (condPreg) condPreg.textContent = isKo ? "임신 중 (Pregnancy Medicaid 기준 적용)" : "Currently pregnant (Pregnancy Medicaid guidelines apply)";

    const summaryTitle = document.getElementById("summaryTitleText");
    if (summaryTitle) summaryTitle.textContent = isKo ? "Screening Results • 실시간 자격 평가" : "Screening Results • Live Assessment";

    // Directory Search
    const dirSearch = document.getElementById("directorySearchInput");
    if (dirSearch) dirSearch.placeholder = isKo ? "제목 또는 키워드 필터링..." : "Search guides by title or keyword...";

    // Reader View
    const readerCrumbDir = document.getElementById("readerCrumbDirectory");
    if (readerCrumbDir) readerCrumbDir.textContent = isKo ? "자료 탐색" : "Browse Guides";

    const fontDec = document.getElementById("fontDecreaseBtn");
    if (fontDec) fontDec.title = isKo ? "글자 작게" : "Decrease font size";
    const fontInc = document.getElementById("fontIncreaseBtn");
    if (fontInc) fontInc.title = isKo ? "글자 크게" : "Increase font size";

    const readerPrint = document.getElementById("readerPrintText");
    if (readerPrint) readerPrint.textContent = isKo ? "인쇄 / PDF 저장" : "Print / Save PDF";

    const readerPrevL = document.getElementById("readerPrevLabel");
    if (readerPrevL) readerPrevL.textContent = isKo ? "← 이전 가이드" : "← Previous Guide";

    const readerNextL = document.getElementById("readerNextLabel");
    if (readerNextL) readerNextL.textContent = isKo ? "다음 가이드 →" : "Next Guide →";

    // About & Contact View
    const abMissionP1 = document.getElementById("aboutMissionP1");
    if (abMissionP1) {
      abMissionP1.innerHTML = isKo
        ? "<strong>우리의 사명 (Our Mission):</strong> AWCA(Asian Women's Christian Association)는 1980년 설립된 연방 국세청(IRS) 공인 <strong>501(c)(3) 비영리 자선 단체</strong>입니다. 시니어, 저소득 가정, 이민자 및 다문화 취약계층의 권익을 보호하고, 건강하고 독립적인 삶을 영위할 수 있도록 전문 사회복지 상담, 공공 의료 보장 내비게이션, 시니어 주거 및 식비 보조, 성인 주간 보호(Adult Day Care), 가정 간호 연계 서비스를 제공합니다."
        : "<strong>Our Mission:</strong> AWCA (Asian Women's Christian Association) is an IRS-recognized <strong>501(c)(3) nonprofit charitable organization</strong> founded in 1980. We advocate for the rights, health, and independence of seniors, low-income families, immigrants, and multicultural communities through comprehensive social welfare counseling, public healthcare navigation, senior housing and nutrition assistance, Adult Day Care, and coordinated home care services.";
    }

    const abMissionP2 = document.getElementById("aboutMissionP2");
    if (abMissionP2) {
      abMissionP2.textContent = isKo
        ? "본 포털은 구글 애드 그랜츠(Google Ad Grants) 및 웹 콘텐츠 접근성 가이드라인(WCAG 2.1 AA) 기준을 준수하여, 모든 시민과 가족이 차별 없이 정확하고 투명한 공공 혜택 정보를 열람할 수 있도록 설계된 공식 리소스 센터입니다."
        : "This portal is an official resource center adhering to Google Ad Grants and Web Content Accessibility Guidelines (WCAG 2.1 AA), designed to guarantee open, barrier-free, and transparent access to public benefit programs for all community members.";
    }

    const abLocH = document.getElementById("aboutLocationHeading");
    if (abLocH) abLocH.textContent = isKo ? "📍 센터 위치 및 방문 안내" : "📍 Location & Visiting Information";

    const abLocB = document.getElementById("aboutLocationBody");
    if (abLocB) {
      abLocB.innerHTML = isKo
        ? "<strong>AWCA 본관 (Headquarters)</strong><br>9 Genesee Avenue<br>Teaneck, NJ 07666<br>(운영 시간: 월-금 9:00 AM - 5:00 PM EST)"
        : "<strong>AWCA Headquarters</strong><br>9 Genesee Avenue<br>Teaneck, NJ 07666<br>(Hours: Mon-Fri 9:00 AM - 5:00 PM EST)";
    }

    const abContH = document.getElementById("aboutContactHeading");
    if (abContH) abContH.textContent = isKo ? "📞 상담 및 대표 연락처" : "📞 Contact & Client Services";

    const abPhone = document.getElementById("aboutPhoneLabel");
    if (abPhone) abPhone.textContent = isKo ? "대표 전화:" : "Main Phone:";

    const abFax = document.getElementById("aboutFaxLabel");
    if (abFax) abFax.textContent = isKo ? "팩스 (Fax):" : "Fax:";

    const abEmail = document.getElementById("aboutEmailLabel");
    if (abEmail) abEmail.textContent = isKo ? "대표 이메일:" : "Main Email:";

    const abWeb = document.getElementById("aboutWebLabel");
    if (abWeb) abWeb.textContent = isKo ? "공식 메인 웹사이트:" : "Official Main Website:";

    const abSuppT = document.getElementById("aboutSupportTitle");
    if (abSuppT) abSuppT.textContent = isKo ? "후원 및 자원봉사 (Support Our Mission)" : "Support Our Mission & Volunteer";

    const abSuppD = document.getElementById("aboutSupportDesc");
    if (abSuppD) abSuppD.textContent = isKo 
      ? "여러분의 소중한 후원은 뉴저지 한인 및 취약계층 시니어를 위한 무료 복지 상담에 전액 사용됩니다." 
      : "Your generous tax-deductible support empowers free social welfare counseling and critical assistance for vulnerable seniors and families in New Jersey.";

    const abSuppBtn = document.getElementById("aboutSupportBtn");
    if (abSuppBtn) abSuppBtn.textContent = isKo ? "AWCA 공식 기부 안내 →" : "AWCA Donation Information →";

    // Search Modal Input
    const sInput = document.getElementById("searchModalInput");
    if (sInput) sInput.placeholder = isKo 
      ? "200개 복지·의료 가이드 검색 (예: 메디케어, SNAP, 시니어 아파트, OAA)..." 
      : "Search 200 healthcare & welfare guides (e.g. Medicare, SNAP, Senior Housing)...";

    // Footer
    const footDesc = document.getElementById("footerDesc");
    if (footDesc) footDesc.textContent = isKo 
      ? "시니어 및 저소득 취약계층의 자립과 건강한 삶을 위한 미국 연방 및 뉴저지 주 공식 복지·의료 가이드라인 아카이브." 
      : "Official public welfare and healthcare guideline archive for seniors and low-income families, promoting independence and healthy living across New Jersey and federal programs.";

    const footHLinks = document.getElementById("footerHeadingLinks");
    if (footHLinks) footHLinks.textContent = isKo ? "주요 서비스" : "Quick Links";

    const footCalc = document.getElementById("footerLinkCalc");
    if (footCalc) footCalc.textContent = isKo ? "자격 확인 계산기 (Benefits Screener)" : "Benefits Screener & Calculator";

    const footDir = document.getElementById("footerLinkDir");
    if (footDir) footDir.textContent = isKo ? "전체 12개 가이드 목록" : "Browse All 12 Resource Domains";

    const footAbout = document.getElementById("footerLinkAbout");
    if (footAbout) footAbout.textContent = isKo ? "AWCA 소개 및 상담 안내" : "About AWCA & Contact";

    const footMain = document.getElementById("footerLinkMain");
    if (footMain) footMain.textContent = isKo ? "awcarc.org 공식 웹사이트 →" : "awcarc.org Official Website →";

    const footHCont = document.getElementById("footerHeadingContact");
    if (footHCont) footHCont.textContent = isKo ? "상담 및 방문 안내" : "Contact AWCA";

    const footLegal = document.getElementById("footerBottomLegal");
    if (footLegal) footLegal.textContent = isKo 
      ? "© 2026 AWCA (Asian Women's Christian Association). 연방 국세청 501(c)(3) 비영리 자선 단체. 모든 기부금은 세금 공제 혜택을 받으실 수 있습니다." 
      : "© 2026 AWCA (Asian Women's Christian Association). A 501(c)(3) Tax-Exempt Nonprofit Organization. All contributions are tax-deductible to the extent permitted by law.";

    const footStand = document.getElementById("footerBottomStandards");
    if (footStand) footStand.textContent = isKo 
      ? "WCAG 2.1 AA 준수 • Google Ad Grants 인증 포털" 
      : "WCAG 2.1 AA Compliant • Google Ad Grants Verified Portal";
  }

  function renderHomeCategories() {
    const container = document.getElementById("homeCategoriesGrid");
    if (!container) return;

    const isKo = state.lang === "ko";
    container.innerHTML = sections.map(sec => {
      const count = allArticles.filter(a => a.section_id === sec.id && a.lang === state.lang).length;
      const title = isKo ? sec.ko_title : sec.en_title;
      const desc = isKo ? sec.desc_ko : sec.desc_en;
      const imgName = `resource-nav-${sec.id.toString().padStart(2, '0')}.png`;

      return `
        <div class="category-card" onclick="window.location.hash='category/${sec.id}'">
          <div class="category-img-banner">
            <span class="category-guide-badge">${count} ${isKo ? '개 안내서' : 'Guides'}</span>
            <img src="assets/${imgName}" alt="${title}" onerror="this.src='assets/logo.png'">
          </div>
          <div class="category-card-body">
            <h3 class="category-name">${title}</h3>
            <p class="category-desc">${desc}</p>
            <div class="category-footer">
              <span>${isKo ? '전체 가이드 열람' : 'Browse All Guides'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  // -------------------------------------------------------------
  // Video Section Controller (YouTube Social Service Series)
  // -------------------------------------------------------------
  const VIDEO_TOPICS = [
    { id: "all", name_ko: "전체 영상", name_en: "All Videos" },
    { id: "medicare", name_ko: "메디케어", name_en: "Medicare" },
    { id: "medicaid", name_ko: "메디케이드", name_en: "Medicaid" },
    { id: "social_security", name_ko: "소셜시큐리티 & 연금", name_en: "Social Security & SSI" },
    { id: "senior_care", name_ko: "롱텀케어 & 주거", name_en: "Senior Care & Housing" },
    { id: "asset_estate", name_ko: "노후 자산 & 상속", name_en: "Asset & Estate Planning" }
  ];

  const videoState = {
    currentVideoId: "yxlHBhtDIMk",
    activeTopic: "all"
  };

  function getVideos() {
    return window.AWCA_VIDEOS || [];
  }

  function renderVideoSection() {
    const topicBar = document.getElementById("videoTopicBar");
    const playlistScroll = document.getElementById("videoPlaylistScroll");
    const totalBadge = document.getElementById("videoTotalCountBadge");
    const filteredCountBadge = document.getElementById("playlistFilteredCount");
    if (!topicBar || !playlistScroll) return;

    const isKo = state.lang === "ko";
    const videos = getVideos();

    if (totalBadge) {
      totalBadge.textContent = isKo ? `${videos.length}개 영상` : `${videos.length} Videos`;
    }

    // Render Topic Filter Buttons
    topicBar.innerHTML = VIDEO_TOPICS.map(topic => {
      const count = topic.id === "all" ? videos.length : videos.filter(v => v.category === topic.id).length;
      const title = isKo ? topic.name_ko : topic.name_en;
      const isActive = videoState.activeTopic === topic.id;
      return `
        <button type="button" class="video-topic-btn ${isActive ? 'active' : ''}" onclick="window.setVideoTopic('${topic.id}')">
          <span>${title}</span>
          <span class="topic-count-pill">${count}</span>
        </button>
      `;
    }).join("");

    // Filter videos by topic
    const filtered = videoState.activeTopic === "all"
      ? videos
      : videos.filter(v => v.category === videoState.activeTopic);

    if (filteredCountBadge) {
      filteredCountBadge.textContent = filtered.length;
    }

    // Check if currentVideoId is in filtered list; if not, select the first
    if (!filtered.some(v => v.id === videoState.currentVideoId) && filtered.length > 0) {
      videoState.currentVideoId = filtered[0].id;
    }

    // Render 5-visible thumbnail playlist (scrollable for all)
    playlistScroll.innerHTML = filtered.map(v => {
      const isActive = v.id === videoState.currentVideoId;
      const topicObj = VIDEO_TOPICS.find(t => t.id === v.category);
      const catName = topicObj ? (isKo ? topicObj.name_ko : topicObj.name_en) : v.category;
      return `
        <div class="video-item-card ${isActive ? 'active' : ''}" data-id="${v.id}" onclick="window.selectVideo('${v.id}')">
          <div class="video-thumb-box">
            <img src="https://i.ytimg.com/vi/${v.id}/mqdefault.jpg" alt="${v.title}" loading="lazy" onerror="this.src='assets/AWCA-Resource-Center-1200x630-1.png'">
            <span class="video-dur-tag">${v.duration}</span>
            ${isActive ? `<span class="video-playing-tag">${isKo ? '재생 중' : 'Playing'}</span>` : ''}
          </div>
          <div class="video-item-content">
            <div class="video-item-top">
              <span class="video-item-ep">${v.episode}</span>
              <span class="video-item-cat">&bull; ${catName}</span>
            </div>
            <div class="video-item-title" title="${v.title}">${v.title}</div>
          </div>
        </div>
      `;
    }).join("");

    updateVideoPlayer(videoState.currentVideoId, false);
  }

  function updateVideoPlayer(videoId, autoPlay = false) {
    const video = getVideos().find(v => v.id === videoId);
    if (!video) return;

    videoState.currentVideoId = videoId;
    const isKo = state.lang === "ko";

    const iframe = document.getElementById("mainVideoIframe");
    const epEl = document.getElementById("currentVideoEp");
    const catEl = document.getElementById("currentVideoCat");
    const durEl = document.getElementById("currentVideoDur");
    const titleEl = document.getElementById("currentVideoTitle");

    if (iframe) {
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      const newSrc = `https://www.youtube.com/embed/${video.id}?autoplay=${autoPlay ? 1 : 0}&rel=0`;
      if (iframe.src !== newSrc) {
        iframe.src = newSrc;
      }
    }

    if (epEl) epEl.textContent = video.episode;

    if (catEl) {
      const topicObj = VIDEO_TOPICS.find(t => t.id === video.category);
      catEl.textContent = topicObj ? (isKo ? topicObj.name_ko : topicObj.name_en) : video.category;
    }

    if (durEl) durEl.textContent = `⏱ ${video.duration}`;

    if (titleEl) titleEl.textContent = video.title;

    // Highlight active card
    document.querySelectorAll(".video-item-card").forEach(card => {
      const isActive = card.dataset.id === videoId;
      card.classList.toggle("active", isActive);
      const playingTag = card.querySelector(".video-playing-tag");
      if (isActive && !playingTag) {
        const thumbBox = card.querySelector(".video-thumb-box");
        if (thumbBox) {
          const tag = document.createElement("span");
          tag.className = "video-playing-tag";
          tag.textContent = isKo ? "재생 중" : "Playing";
          thumbBox.appendChild(tag);
        }
      } else if (!isActive && playingTag) {
        playingTag.remove();
      }
    });
  }

  window.selectVideo = function(videoId) {
    updateVideoPlayer(videoId, true);
    const card = document.querySelector(`.video-item-card[data-id="${videoId}"]`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  window.setVideoTopic = function(topicId) {
    videoState.activeTopic = topicId;
    renderVideoSection();
  };

  function renderDirectory() {
    const container = document.getElementById("directoryGrid");
    const countLabel = document.getElementById("directoryCountLabel");
    const pillsContainer = document.getElementById("categoryFilterPills");
    if (!container) return;

    const isKo = state.lang === "ko";

    if (pillsContainer) {
      pillsContainer.innerHTML = `
        <button class="filter-pill ${state.activeSectionFilter === null ? 'active' : ''}" onclick="window.setSectionFilter(null)">
          ${isKo ? '전체 (12)' : 'All Resources (12)'}
        </button>
        ${sections.map(sec => `
          <button class="filter-pill ${state.activeSectionFilter === sec.id ? 'active' : ''}" onclick="window.setSectionFilter(${sec.id})">
            ${isKo ? sec.ko_title.split('(')[0].trim() : sec.en_title}
          </button>
        `).join("")}
      `;
    }

    let filtered = allArticles.filter(a => a.lang === state.lang);
    if (state.activeSectionFilter !== null) {
      filtered = filtered.filter(a => a.section_id === state.activeSectionFilter);
    }
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.excerpt.toLowerCase().includes(q) ||
        a.section_title.toLowerCase().includes(q)
      );
    }

    if (countLabel) {
      countLabel.textContent = isKo 
        ? `총 ${filtered.length}개 가이드` 
        : `Showing ${filtered.length} guides`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <p style="font-size: 1.1rem; font-weight: 600;">${isKo ? '검색 결과가 없습니다.' : 'No matching guides found.'}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(art => `
      <div class="art-card" onclick="window.location.hash='article/${art.id}'">
        <div class="art-card-tag">${art.section_title}</div>
        <h3 class="art-card-title">${art.title}</h3>
        <p class="art-card-desc">${art.excerpt}</p>
        <div class="art-card-meta">
          <span>${art.word_count} ${isKo ? '단어' : 'words'} &bull; ~${Math.ceil(art.word_count / 180)} ${isKo ? '분 읽기' : 'min read'}</span>
          <span style="color: var(--accent); font-weight: 600;">${isKo ? '자세히 보기 &rarr;' : 'Read Guide &rarr;'}</span>
        </div>
      </div>
    `).join("");
  }

  function renderReader(art) {
    const isKo = art.lang === "ko";
    const breadcrumbCat = document.getElementById("readerBreadcrumbCat");
    const breadcrumbTitle = document.getElementById("readerBreadcrumbTitle");
    const tag = document.getElementById("readerTag");
    const title = document.getElementById("readerTitle");
    const body = document.getElementById("readerBody");
    const langToggleBtn = document.getElementById("readerLangToggleBtn");
    const heroThumb = document.getElementById("readerHeroThumb");

    if (breadcrumbCat) breadcrumbCat.textContent = art.section_title;
    if (breadcrumbTitle) breadcrumbTitle.textContent = art.title;
    if (tag) tag.textContent = art.section_title;
    if (title) title.textContent = art.title;
    if (heroThumb) {
      heroThumb.src = `assets/resource-nav-${art.section_id.toString().padStart(2, '0')}.png`;
      heroThumb.alt = art.section_title;
    }
    if (body) {
      body.innerHTML = art.content_html;
    }

    if (langToggleBtn) {
      const counterpart = allArticles.find(a => a.slug === art.counterpart_slug);
      if (counterpart) {
        langToggleBtn.style.display = "inline-flex";
        langToggleBtn.textContent = isKo ? "🇺🇸 Read in English" : "🇰🇷 한국어로 읽기";
        langToggleBtn.onclick = () => {
          setLanguage(isKo ? "en" : "ko");
          navigateToArticle(counterpart.id);
        };
      } else {
        langToggleBtn.style.display = "none";
      }
    }

    const sectionArts = allArticles.filter(a => a.section_id === art.section_id && a.lang === art.lang);
    const currIdx = sectionArts.findIndex(a => a.id === art.id);
    const prevArt = currIdx > 0 ? sectionArts[currIdx - 1] : null;
    const nextArt = currIdx < sectionArts.length - 1 ? sectionArts[currIdx + 1] : null;

    const prevBtn = document.getElementById("readerPrevBtn");
    const nextBtn = document.getElementById("readerNextBtn");

    if (prevBtn) {
      if (prevArt) {
        prevBtn.style.display = "flex";
        prevBtn.querySelector(".pag-title").textContent = prevArt.title;
        prevBtn.onclick = () => navigateToArticle(prevArt.id);
      } else {
        prevBtn.style.display = "none";
      }
    }

    if (nextBtn) {
      if (nextArt) {
        nextBtn.style.display = "flex";
        nextBtn.querySelector(".pag-title").textContent = nextArt.title;
        nextBtn.onclick = () => navigateToArticle(nextArt.id);
      } else {
        nextBtn.style.display = "none";
      }
    }
  }

  // -------------------------------------------------------------
  // Calculator Controller
  // -------------------------------------------------------------
  function setupCalculator() {
    const sizeInput = document.getElementById("calcSize");
    const incomeInput = document.getElementById("calcIncome");
    const incomeSlider = document.getElementById("calcIncomeSlider");
    const ageInputs = document.querySelectorAll('input[name="calcAge"]');
    const checkboxes = document.querySelectorAll('.calc-checkbox');

    if (!incomeInput) return;

    incomeInput.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value) || 0;
      if (incomeSlider) incomeSlider.value = Math.min(10000, val);
      runCalculator();
    });

    if (incomeSlider) {
      incomeSlider.addEventListener("input", (e) => {
        incomeInput.value = e.target.value;
        runCalculator();
      });
    }

    if (sizeInput) {
      sizeInput.addEventListener("change", runCalculator);
    }

    ageInputs.forEach(input => {
      input.addEventListener("change", (e) => {
        document.querySelectorAll(".radio-card").forEach(c => c.classList.remove("selected"));
        e.target.closest(".radio-card").classList.add("selected");
        runCalculator();
      });
    });

    checkboxes.forEach(cb => {
      cb.addEventListener("change", runCalculator);
    });

    document.querySelectorAll(".quick-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const amt = btn.dataset.amt;
        incomeInput.value = amt;
        if (incomeSlider) incomeSlider.value = amt;
        runCalculator();
      });
    });
  }

  function runCalculator() {
    if (!window.AWCACalculator) return;

    const size = parseInt(document.getElementById("calcSize")?.value || 1);
    const income = parseFloat(document.getElementById("calcIncome")?.value || 1500);
    const ageEl = document.querySelector('input[name="calcAge"]:checked');
    const age = ageEl ? ageEl.value : "19-64";

    const isDisabled = document.getElementById("calcDisabled")?.checked || false;
    const isPregnant = document.getElementById("calcPregnant")?.checked || false;
    const hasMedicare = document.getElementById("calcMedicare")?.checked || false;
    const isHomeowner = document.getElementById("calcHomeowner")?.checked || false;
    const needsCare = document.getElementById("calcCare")?.checked || false;
    const lowAssets = document.getElementById("calcLowAssets")?.checked || false;

    const isKo = state.lang === "ko";
    const sizeBadge = document.getElementById("calcSizeBadge");
    if (sizeBadge) {
      sizeBadge.textContent = isKo ? `${size}인 가구` : `${size} ${size === 1 ? 'Person' : 'Persons'}`;
    }

    const annualLabel = document.getElementById("calcAnnualLabel");
    if (annualLabel) {
      annualLabel.textContent = isKo 
        ? `$${(income * 12).toLocaleString()}/연` 
        : `$${(income * 12).toLocaleString()}/year`;
    }

    const res = window.AWCACalculator.evaluate({
      householdSize: size,
      monthlyIncome: income,
      age: age,
      isDisabled: isDisabled,
      isPregnant: isPregnant,
      hasMedicare: hasMedicare,
      isHomeowner: isHomeowner,
      needsCare: needsCare,
      lowAssets: lowAssets
    });

    renderCalcResults(res);
  }

  function renderCalcResults(evalRes) {
    const container = document.getElementById("calcResultsContainer");
    const countEl = document.getElementById("calcEligibleCount");
    const fplInfoEl = document.getElementById("calcFplInfo");
    if (!container) return;

    const isKo = state.lang === "ko";

    if (countEl) {
      countEl.textContent = isKo 
        ? `${evalRes.eligibleCount}개 프로그램 적격 예상` 
        : `${evalRes.eligibleCount} Programs Likely Eligible`;
    }

    if (fplInfoEl) {
      fplInfoEl.textContent = isKo
        ? `가구원 ${evalRes.householdSize}인 기준 월 소득은 연방 빈곤선(FPL)의 약 ${evalRes.fplRatio}% 입니다.`
        : `Your monthly income is approximately ${evalRes.fplRatio}% of the Federal Poverty Level for a household of ${evalRes.householdSize}.`;
    }

    container.innerHTML = evalRes.results.map(prog => {
      const badgeClass = prog.status === "eligible" ? "badge-eligible" : (prog.status === "conditional" ? "badge-conditional" : (prog.status === "special-purple" ? "badge-special" : "badge-ineligible"));
      const title = isKo ? prog.title_ko : prog.title_en;
      const statusText = isKo ? prog.status_ko : prog.status_en;
      const benefit = isKo ? prog.benefit_ko : prog.benefit_en;
      const criteria = isKo ? prog.criteria_ko : prog.criteria_en;

      const targetSlug = isKo ? `${prog.article_slug}-ko` : prog.article_slug;
      const article = allArticles.find(a => a.slug === targetSlug) || allArticles.find(a => a.slug.includes(prog.article_slug));

      return `
        <div class="result-item-card ${prog.status}">
          <div class="res-header">
            <h4 class="res-prog-title">${title}</h4>
            <span class="res-status-badge ${badgeClass}">${statusText}</span>
          </div>
          <div class="res-benefit">${benefit}</div>
          <div class="res-criteria">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            <span>${criteria}</span>
          </div>
          ${article ? `
            <div class="res-actions">
              <button class="btn btn-outline-purple btn-sm" onclick="window.location.hash='article/${article.id}'">
                ${isKo ? '관련 AWCA 안내서 읽기 &rarr;' : 'Read Full AWCA Guide &rarr;'}
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }).join("");
  }

  // -------------------------------------------------------------
  // Search Modal
  // -------------------------------------------------------------
  function openSearchModal() {
    const modal = document.getElementById("searchModal");
    const input = document.getElementById("searchModalInput");
    if (modal) {
      modal.classList.add("open");
      if (input) {
        input.value = "";
        input.focus();
        renderSearchResults("");
      }
    }
  }

  function closeSearchModal() {
    const modal = document.getElementById("searchModal");
    if (modal) modal.classList.remove("open");
  }

  function renderSearchResults(query) {
    const list = document.getElementById("searchResultsList");
    if (!list) return;

    const q = query.trim().toLowerCase();
    const isKo = state.lang === "ko";

    let matches = allArticles;
    if (q) {
      matches = allArticles.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.excerpt.toLowerCase().includes(q) ||
        a.section_title.toLowerCase().includes(q)
      );
    }

    matches.sort((a, b) => (a.lang === state.lang ? -1 : 1));

    if (matches.length === 0) {
      list.innerHTML = `<li style="padding: 24px; text-align: center; color: var(--text-muted);">${isKo ? '검색 결과가 없습니다.' : 'No results found.'}</li>`;
      return;
    }

    list.innerHTML = matches.slice(0, 10).map(art => `
      <li class="search-res-item" onclick="window.closeSearchModal(); window.location.hash='article/${art.id}'">
        <div class="search-res-title">${art.title}</div>
        <div class="search-res-sub">${art.section_title} &bull; ${art.lang === 'ko' ? (isKo ? '한국어' : 'Korean') : 'English'}</div>
      </li>
    `).join("");
  }

  // -------------------------------------------------------------
  // Global Event Bindings
  // -------------------------------------------------------------
  function bindEvents() {
    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        applyTheme(state.theme === "dark" ? "light" : "dark");
      });
    }

    document.querySelectorAll(".lang-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        setLanguage(btn.dataset.lang);
      });
    });

    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        switchView(view);
      });
    });

    const searchTrigger = document.querySelector(".search-trigger");
    if (searchTrigger) {
      searchTrigger.addEventListener("click", openSearchModal);
    }

    const searchInput = document.getElementById("searchModalInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        renderSearchResults(e.target.value);
      });
    }

    const searchModal = document.getElementById("searchModal");
    if (searchModal) {
      searchModal.addEventListener("click", (e) => {
        if (e.target === searchModal) closeSearchModal();
      });
    }

    const dirSearch = document.getElementById("directorySearchInput");
    if (dirSearch) {
      dirSearch.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        renderDirectory();
      });
    }

    const fontIncBtn = document.getElementById("fontIncreaseBtn");
    const fontDecBtn = document.getElementById("fontDecreaseBtn");
    if (fontIncBtn) {
      fontIncBtn.addEventListener("click", () => {
        const body = document.getElementById("readerBody");
        if (body) body.style.fontSize = "1.15rem";
      });
    }
    if (fontDecBtn) {
      fontDecBtn.addEventListener("click", () => {
        const body = document.getElementById("readerBody");
        if (body) body.style.fontSize = "0.95rem";
      });
    }

    const printBtn = document.getElementById("readerPrintBtn");
    if (printBtn) {
      printBtn.addEventListener("click", () => window.print());
    }

    window.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearchModal();
      }
      if (e.key === "Escape") {
        closeSearchModal();
      }
    });
  }

  window.setSectionFilter = function(secId) {
    state.activeSectionFilter = secId;
    renderDirectory();
  };

  window.closeSearchModal = closeSearchModal;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
