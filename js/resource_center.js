/**
 * NJ Access Portal - Healthcare Resource Center Application Logic
 * Integrates:
 * 1. Benefits Screener & Calculator
 * 2. Community Resources (8 Categories, Inline Reader, Zero Popups)
 * 3. Medicare & ACA Guide
 */

(function () {
  'use strict';

  // Global State
  let currentCategory = 'all';
  let searchQuery = '';
  let activeTab = 'calculator';
  let activeHousingTown = 'all';

  // Billboard Controller Constants & State (Mirrored from first page billboard style)
  const TOTAL_SLIDES = 4;
  const CAPTIONS = [
    '2026 연방 빈곤선(FPL) 기준 실시간 자동 판정',
    '엄선된 8대 카테고리 80편 연구 안내서 & 타운별 주택 포털',
    '2026 메디케어 AEP 인롤먼트 & 파트 D 약값 상한제',
    '뉴저지 65세+ 시니어 맞춤 주거·처방약·재택돌봄·세금동결'
  ];
  const TAB_TO_SLIDE = {
    'calculator': 1,
    'resources': 2,
    'medicare': 3,
    'senior': 4
  };
  const SLIDE_TO_TAB = {
    1: 'calculator',
    2: 'resources',
    3: 'medicare',
    4: 'senior'
  };

  let currentBillboardSlide = 1;
  let billboardRotateTimer = null;
  let isBillboardPaused = false;

  // Initialize on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    initHeroBillboard();
    initTabNavigation();
    initCalculator();
    initCommunityResources();
    initSeniorResources();
    initHousingTownFilters();
    initSearchModal();
    handleHashRouting();
  });

  let isSwitchingTab = false;

  function handleHashRouting() {
    if (isSwitchingTab) return;
    const defaultTab = (window.location.pathname.indexOf('medicare') !== -1) ? 'medicare' : 'calculator';
    let hash = window.location.hash.replace('#', '') || defaultTab;
    // Backwards compatibility aliases
    if (hash === 'directory' || hash === 'housing') hash = 'resources';

    if (['calculator', 'resources', 'medicare', 'senior'].includes(hash)) {
      switchTab(hash, false);
    } else if (hash.startsWith('senior-guide-') || hash.startsWith('senior-art-')) {
      const slugOrId = hash.replace('senior-guide-', '').replace('senior-art-', '');
      switchTab('senior', false);
      openSeniorArticleInline(slugOrId);
    } else if (hash.startsWith('guide-') || hash.startsWith('article-')) {
      const slugOrId = hash.replace('article-', '').replace('guide-', '');
      switchTab('resources', false);
      openArticleInline(slugOrId);
    }
  }

  // 0. Hero Billboard Controller (Mirrored from index.php hero billboard)
  function initHeroBillboard() {
    const heroSection = document.getElementById('rc-hero-billboard-section');
    if (!heroSection) return;

    // Hover & Focus pause/resume
    heroSection.addEventListener('mouseenter', () => { isBillboardPaused = true; });
    heroSection.addEventListener('mouseleave', () => { isBillboardPaused = false; });
    heroSection.addEventListener('focusin', () => { isBillboardPaused = true; });
    heroSection.addEventListener('focusout', () => { isBillboardPaused = false; });

    // Keyboard arrow navigation on tablist
    const tablist = heroSection.querySelector('[role="tablist"]');
    if (tablist) {
      tablist.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const next = currentBillboardSlide === TOTAL_SLIDES ? 1 : currentBillboardSlide + 1;
          window.rcHeroGoto(next, false);
          document.getElementById('rc-billboard-tab-' + next)?.focus();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = currentBillboardSlide === 1 ? TOTAL_SLIDES : currentBillboardSlide - 1;
          window.rcHeroGoto(prev, false);
          document.getElementById('rc-billboard-tab-' + prev)?.focus();
        }
      });
    }

    startBillboardRotation();
  }

  function startBillboardRotation() {
    stopBillboardRotation();
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    billboardRotateTimer = setInterval(() => {
      if (!isBillboardPaused) {
        const next = currentBillboardSlide === TOTAL_SLIDES ? 1 : currentBillboardSlide + 1;
        setBillboardSlide(next, false);
      }
    }, 4500);
  }

  function stopBillboardRotation() {
    if (billboardRotateTimer) {
      clearInterval(billboardRotateTimer);
      billboardRotateTimer = null;
    }
  }

  function resetBillboardTimer() {
    stopBillboardRotation();
    startBillboardRotation();
  }

  function setBillboardSlide(n, syncTab = false) {
    if (n < 1) n = 1;
    if (n > TOTAL_SLIDES) n = TOTAL_SLIDES;
    currentBillboardSlide = n;

    // Update slides visibility without any delayed timeouts or layout push
    for (let i = 1; i <= TOTAL_SLIDES; i++) {
      const slide = document.getElementById('rc-hero-slide-' + i);
      const img = document.getElementById('rc-hero-visual-' + i);
      const tab = document.getElementById('rc-billboard-tab-' + i);
      const isActive = (i === n);

      if (slide) {
        if (isActive) {
          slide.classList.remove('hidden');
          void slide.offsetWidth;
          slide.style.opacity = '1';
          slide.style.transform = 'translateY(0)';
          slide.classList.remove('opacity-0', 'translate-y-3');
        } else {
          slide.style.opacity = '0';
          slide.style.transform = 'translateY(8px)';
          slide.classList.add('hidden', 'opacity-0', 'translate-y-3');
        }
      }

      if (img) {
        if (isActive) {
          img.style.opacity = '1';
          img.style.transform = 'scale(1.0)';
          img.style.zIndex = '10';
        } else {
          img.style.opacity = '0';
          img.style.transform = 'scale(1.02)';
          img.style.zIndex = '1';
        }
      }

      if (tab) {
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
        tab.classList.toggle('active', isActive);
      }
    }

    const captionEl = document.getElementById('rc-hero-visual-caption');
    const numEl = document.getElementById('rc-hero-visual-num');
    if (captionEl) captionEl.textContent = CAPTIONS[n - 1] || '';
    if (numEl) numEl.textContent = '0' + n;

    if (syncTab) {
      const tabId = SLIDE_TO_TAB[n];
      if (tabId && tabId !== activeTab) {
        switchTab(tabId, false);
      }
    }
  }

  window.rcHeroGoto = function (n, shouldScroll = false) {
    resetBillboardTimer();
    setBillboardSlide(n, true);
    if (shouldScroll) {
      scrollToContent();
    }
  };

  window.rcHeroTabClick = function (tabId, shouldScroll = false) {
    const slideIdx = TAB_TO_SLIDE[tabId] || 1;
    if (window.location.hash !== '#' + tabId) {
      isSwitchingTab = true;
      window.location.hash = tabId;
      setTimeout(() => { isSwitchingTab = false; }, 80);
    }
    resetBillboardTimer();
    setBillboardSlide(slideIdx, false);
    switchTab(tabId, shouldScroll);
  };

  window.rcHeroJumpHousing = function () {
    window.rcHeroTabClick('resources', true);
    setTimeout(() => {
      selectCategory('sec_senior_housing');
      const housingSection = document.getElementById('housing-programs-hub');
      if (housingSection) {
        housingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  function scrollToContent() {
    const content = document.getElementById('rc-main-content');
    if (content) {
      const mainNav = document.querySelector('nav');
      const offset = (mainNav ? mainNav.offsetHeight : 64) + 16;
      const top = content.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  // 1. Tab Navigation
  function initTabNavigation() {
    const tabs = document.querySelectorAll('.rc-nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const target = tab.dataset.tab;
        window.location.hash = target;
        switchTab(target, false);
      });
    });
  }

  function switchTab(tabId, shouldScroll = false) {
    const isAlreadyActive = activeTab === tabId &&
      document.getElementById(`tab-view-${tabId}`) &&
      !document.getElementById(`tab-view-${tabId}`).classList.contains('hidden');

    activeTab = tabId;
    const slideIdx = TAB_TO_SLIDE[tabId] || 1;

    if (currentBillboardSlide !== slideIdx) {
      setBillboardSlide(slideIdx, false);
    }

    if (!isAlreadyActive) {
      document.querySelectorAll('.rc-nav-tab').forEach(t => {
        const isActive = t.dataset.tab === tabId;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      document.querySelectorAll('.rc-tab-view').forEach(view => {
        view.classList.toggle('hidden', view.id !== `tab-view-${tabId}`);
      });
    }

    if (shouldScroll) {
      scrollToContent();
    }
  }

  // 2. Calculator Logic & Service Linking
  function initCalculator() {
    const sizeSelect = document.getElementById('calcSize');
    const incomeInput = document.getElementById('calcIncome');
    const incomeSlider = document.getElementById('calcIncomeSlider');
    const incomeAnnual = document.getElementById('calcAnnualLabel');
    const quickBtns = document.querySelectorAll('.rc-quick-btn');
    const ageRadios = document.querySelectorAll('input[name="calcAge"]');
    const checkboxes = document.querySelectorAll('.rc-calc-checkbox');

    if (!sizeSelect || !incomeInput) return;

    function getInputs() {
      const ageVal = document.querySelector('input[name="calcAge"]:checked')?.value || '19-64';
      return {
        householdSize: parseInt(sizeSelect.value) || 1,
        monthlyIncome: parseFloat(incomeInput.value) || 0,
        age: ageVal,
        isDisabled: document.getElementById('calcDisabled')?.checked,
        hasMedicare: document.getElementById('calcMedicare')?.checked,
        isHomeowner: document.getElementById('calcHomeowner')?.checked,
        needsCare: document.getElementById('calcCare')?.checked,
        lowAssets: document.getElementById('calcLowAssets')?.checked,
        isPregnant: document.getElementById('calcPregnant')?.checked
      };
    }

    function runEvaluation() {
      const inputs = getInputs();
      const annual = inputs.monthlyIncome * 12;
      if (incomeAnnual) {
        incomeAnnual.textContent = `연간 약 $${annual.toLocaleString()} / year`;
      }

      if (window.NJAPCalculator) {
        const res = window.NJAPCalculator.evaluate(inputs);
        renderCalculatorResults(res);
      }
    }

    // Event bindings
    sizeSelect.addEventListener('change', runEvaluation);
    incomeInput.addEventListener('input', () => {
      incomeSlider.value = incomeInput.value;
      runEvaluation();
    });
    incomeSlider.addEventListener('input', () => {
      incomeInput.value = incomeSlider.value;
      runEvaluation();
    });

    quickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const amt = btn.dataset.amt;
        incomeInput.value = amt;
        incomeSlider.value = amt;
        runEvaluation();
      });
    });

    ageRadios.forEach(radio => radio.addEventListener('change', runEvaluation));
    checkboxes.forEach(cb => cb.addEventListener('change', runEvaluation));

    // Initial run
    runEvaluation();
  }

  function getServiceTheme(item) {
    const id = (item.id || '').toLowerCase();
    if (id.includes('mltss') || id.includes('care')) {
      return {
        key: 'care',
        categoryName: '장기 요양 & 재택 간병',
        enName: 'Managed Long-Term Care (MLTSS)'
      };
    }
    if (id.includes('medicaid')) {
      return {
        key: 'medical',
        categoryName: '의료 보장 · 메디케이드',
        enName: 'NJ FamilyCare / Medicaid'
      };
    }
    if (id.includes('paad') || id.includes('msp') || id.includes('senior-gold') || id.includes('drug')) {
      return {
        key: 'prescription',
        categoryName: '처방약 & 메디케어 저축',
        enName: 'Medicare Savings & Prescription (PAAD)'
      };
    }
    if (id.includes('snap') || id.includes('food')) {
      return {
        key: 'nutrition',
        categoryName: '식품 & 영양 지원',
        enName: 'Nutrition Assistance (SNAP)'
      };
    }
    if (id.includes('housing') || id.includes('apt')) {
      return {
        key: 'housing',
        categoryName: '시니어 아파트 & 주거',
        enName: 'Senior & Affordable Housing'
      };
    }
    if (id.includes('liheap') || id.includes('energy') || id.includes('utility')) {
      return {
        key: 'utility',
        categoryName: '공과금 & 난방비 감면',
        enName: 'Energy & Utility Assistance (LIHEAP)'
      };
    }
    if (id.includes('freeze') || id.includes('tax') || id.includes('anchor')) {
      return {
        key: 'tax',
        categoryName: '재산세 환급 & 동결',
        enName: 'Property Tax Reimbursement'
      };
    }
    return {
      key: 'medical',
      categoryName: '정부 복지 프로그램',
      enName: 'Public Assistance Program'
    };
  }

  function renderCalculatorResults(res) {
    const countEl = document.getElementById('calcEligibleCount');
    const fplInfoEl = document.getElementById('calcFplInfo');
    const container = document.getElementById('calcResultsContainer');

    if (countEl) countEl.textContent = `${res.eligibleCount}개 프로그램 적격 예상`;
    if (fplInfoEl) {
      fplInfoEl.innerHTML = `2026 연방 빈곤선(FPL) 기준 <strong>${res.fplRatio}%</strong> 수준 (가구원 ${res.householdSize}인 기준 빈곤선: 연 $${res.fplAnnual.toLocaleString()})`;
    }

    if (!container) return;
    if (res.results.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          입력하신 조건에 해당하는 주요 자동 적격 프로그램이 검색되지 않았습니다. 상단 <strong>메디케어 & ACA</strong>를 확인하시거나 1:1 상담을 이용해 주세요.
        </div>`;
      return;
    }

    container.innerHTML = res.results.map(item => {
      const theme = getServiceTheme(item);
      return `
        <div class="rc-win-frame rc-win-${theme.key}" id="result-${item.id}">
          <!-- Window Header Bar (macOS style window frame) -->
          <div class="rc-win-header">
            <div class="rc-win-dots">
              <span class="rc-dot rc-dot-red"></span>
              <span class="rc-dot rc-dot-yellow"></span>
              <span class="rc-dot rc-dot-green"></span>
            </div>
            <div class="rc-win-category">
              <span class="rc-win-cat-title">${theme.categoryName}</span>
              <span class="rc-win-cat-sub">· ${item.title_en || theme.enName}</span>
            </div>
            <div class="rc-win-badge">
              <span class="rc-status-pill ${item.status === 'eligible' ? 'rc-status-eligible' : 'rc-status-cond'}">
                ${item.status_ko}
              </span>
            </div>
          </div>

          <!-- Window Body -->
          <div class="rc-win-body">
            <div class="rc-win-title-row">
              <h4 class="rc-win-title">${item.title_ko}</h4>
              <span class="rc-win-highlight-badge">${item.badge || '공식 혜택'}</span>
            </div>
            <p class="rc-win-benefit">${item.benefit_ko}</p>
            <div class="rc-win-criteria">
              <div class="rc-criteria-label">
                <span>적격 기준 요건</span>
              </div>
              <div class="rc-criteria-text">${item.criteria_ko}</div>
            </div>
          </div>

          <!-- Window Footer Action Bar -->
          <div class="rc-win-footer">
            <span class="rc-win-help-hint">※ 가구 소득·나이·자격 조건 부합</span>
            <button type="button" onclick="window.handleCalculatorServiceClick('${item.id}')" class="rc-win-action-btn">
              <span>관련 안내 및 신청 가이드 바로보기 &rarr;</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Calculator Service Linking to Resources
  window.handleCalculatorServiceClick = function (serviceId) {
    const data = window.COMMUNITY_RESOURCES_DATA;
    if (!data) return;

    // Service to Article ID mapping
    const serviceMap = {
      'medicaid-abd': { cat: 'medicaid', titleKw: 'ABD' },
      'medicaid-mltss': { cat: 'medicaid', titleKw: 'MLTSS' },
      'medicaid-magi': { cat: 'medicaid', titleKw: 'ACA 메디케이드' },
      'msp-qmb': { cat: 'prescription', titleKw: 'MSP' },
      'msp-slmb-qi': { cat: 'prescription', titleKw: 'MSP' },
      'nj-paad': { cat: 'prescription', titleKw: 'PAAD' },
      'nj-senior-gold': { cat: 'prescription', titleKw: 'Senior Gold' },
      'snap': { cat: 'financial', titleKw: 'SNAP' },
      'housing-senior': { cat: 'housing', titleKw: '시니어 아파트' },
      'liheap': { cat: 'financial', titleKw: 'LIHEAP' },
      'senior-freeze': { cat: 'housing', titleKw: '재산세 환급' },
      'in-home-care': { cat: 'in-home-care', titleKw: '간병인 지정' }
    };

    const target = serviceMap[serviceId];
    if (target) {
      // 1. Switch to resources tab
      switchTab('resources');
      window.location.hash = 'resources';
      // 2. Filter by category
      window.filterByCategory(target.cat);
      // 3. Find specific article and open inline
      const match = data.articles.find(a => a.title.includes(target.titleKw));
      if (match) {
        window.openArticleInline(match.id);
      }
    } else {
      switchTab('resources');
    }
  };

  // 3. Community Resources Logic (Categorized Choices & Inline Reader)
  function initCommunityResources() {
    const data = window.COMMUNITY_RESOURCES_DATA;
    if (!data) return;

    renderCategoryChoices(data.categories);
    renderResourcesArticles();

    const searchInput = document.getElementById('resourcesSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderResourcesArticles();
      });
    }
  }

  function renderCategoryChoices(categories) {
    const container = document.getElementById('categoryChoicesContainer');
    if (!container) return;

    container.innerHTML = categories.map(cat => `
      <div class="rc-choice-card ${currentCategory === cat.id ? 'active' : ''}" onclick="window.filterByCategory('${cat.id}')">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">${cat.badge}</span>
        </div>
        <div class="text-sm font-bold text-slate-900 mt-1">${cat.title_ko}</div>
        <p class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">${cat.desc}</p>
      </div>
    `).join('');
  }

  window.filterByCategory = function (catId) {
    currentCategory = catId;

    // Update active class on cards
    document.querySelectorAll('.rc-choice-card').forEach(card => {
      // Check if this card matches
      const onclickAttr = card.getAttribute('onclick') || '';
      card.classList.toggle('active', onclickAttr.includes(`'${catId}'`));
    });

    // Update active category badge
    const badge = document.getElementById('activeCategoryBadge');
    if (badge) {
      if (catId === 'all') {
        badge.textContent = '전체 가이드';
      } else {
        const cat = (window.COMMUNITY_RESOURCES_DATA?.categories || []).find(c => c.id === catId);
        badge.textContent = cat ? cat.title_ko : catId;
      }
    }

    // Toggle Housing Special Section (Visible when Housing is chosen or all)
    const housingSection = document.getElementById('housingSpecialSection');
    if (housingSection) {
      housingSection.style.display = (catId === 'housing' || catId === 'all') ? 'block' : 'none';
    }

    renderResourcesArticles();

    // Scroll smoothly to resources filter
    const filterBar = document.getElementById('resourcesFilterBar');
    if (filterBar) {
      filterBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  function renderResourcesArticles() {
    const data = window.COMMUNITY_RESOURCES_DATA;
    if (!data) return;

    const grid = document.getElementById('resourcesGrid');
    const countLabel = document.getElementById('resourcesCountLabel');
    if (!grid) return;

    const filtered = data.articles.filter(art => {
      const matchCat = (currentCategory === 'all') || (art.category_id === currentCategory);
      const matchSearch = !searchQuery ||
        art.title.toLowerCase().includes(searchQuery) ||
        art.excerpt.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    if (countLabel) {
      countLabel.textContent = `총 ${filtered.length}개 가이드`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200">
          <p class="text-base font-semibold text-slate-700">검색 조건에 일치하는 가이드가 없습니다.</p>
          <p class="text-xs text-slate-500 mt-1">다른 검색어를 입력하시거나 카테고리를 전체로 변경해 보세요.</p>
          <button type="button" onclick="window.filterByCategory('all')" class="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700">
            전체 가이드 보기
          </button>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(art => `
      <div class="editorial-card flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group" onclick="window.openArticleInline('${art.id}')">
        <div>
          <div class="flex items-center justify-between gap-2 mb-2.5">
            <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-100">
              ${art.category_name}
            </span>
            <span class="text-[11px] font-bold text-slate-400">2026 규정</span>
          </div>
          <h4 class="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug">
            ${art.title}
          </h4>
          <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
            ${art.excerpt}
          </p>
        </div>
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] text-slate-400">상세 브리핑</span>
          <span class="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            가이드 읽기 &rarr;
          </span>
        </div>
      </div>
    `).join('');
  }

  // 4. Inline Guide Reader (NO POP UPS!)
  window.openArticleInline = function (articleIdOrSlug) {
    const data = window.COMMUNITY_RESOURCES_DATA;
    if (!data) return;

    const art = data.articles.find(a => a.id === articleIdOrSlug || a.slug === articleIdOrSlug);
    if (!art) return;

    const readerEl = document.getElementById('inlineResourceReader');
    const badgeEl = document.getElementById('inlineReaderCatBadge');
    const contentEl = document.getElementById('inlineReaderContent');

    if (!readerEl || !contentEl) return;

    if (badgeEl) badgeEl.textContent = art.category_name;
    contentEl.innerHTML = art.content_html;

    readerEl.classList.remove('hidden');

    // Smooth scroll into inline reader
    readerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.closeInlineReader = function () {
    const readerEl = document.getElementById('inlineResourceReader');
    if (readerEl) {
      readerEl.classList.add('hidden');
    }
    // Scroll back to categories
    const bar = document.getElementById('resourcesFilterBar');
    if (bar) bar.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // 5. Housing Town Filters
  function initHousingTownFilters() {
    const townBtns = document.querySelectorAll('.rc-housing-town-btn');
    const cards = document.querySelectorAll('.rc-housing-card');

    townBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        townBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        activeHousingTown = btn.dataset.town;
        cards.forEach(card => {
          if (activeHousingTown === 'all' || card.dataset.town === activeHousingTown) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 6. Senior Resources Logic (6 Categorized Choices & Inline Reader)
  let currentSeniorCategory = 'all';
  let seniorSearchQuery = '';

  const SENIOR_CATEGORIES = [
    {
      id: 'senior-housing',
      title_ko: '시니어 주거 & 아파트',
      title_en: 'Senior Housing & Living',
      badge: 'HUD 202 · 62+ 독립 아파트',
      desc: '버겐카운티 타운별 시니어 아파트(포트리, 팰팍 등), HUD Section 202 소득의 30% 렌트, LIHTC 및 어시스티드 리빙.',
      articleIds: ['art-1', 'art-2', 'art-3', 'art-7', 'art-67', 'art-69', 'art-70', 'art-71']
    },
    {
      id: 'senior-rx',
      title_ko: '처방약 & 의료비 저축',
      title_en: 'Prescription & Healthcare Savings',
      badge: 'PAAD $5 · Senior Gold · LIS',
      desc: '뉴저지 PAAD(처방약 1종당 $5/$7), Senior Gold, 메디케어 파트 D 저소득 보조금(Extra Help/LIS), MSP 및 보청기 지원.',
      articleIds: ['art-27', 'art-28', 'art-29', 'art-52', 'art-53', 'art-57', 'art-61']
    },
    {
      id: 'senior-care',
      title_ko: '재택 돌봄 & 가족 간병비',
      title_en: 'In-Home Care & Family PPP',
      badge: 'PPP 가족간병 시급 · Meals on Wheels',
      desc: '개인선호프로그램(PPP)으로 가족/자녀를 간병인으로 지정하여 월 최대 $2,000~$3,500 시급 지급, JACC, 간병인 휴식 지원, 도시락 배달.',
      articleIds: ['art-30', 'art-31', 'art-32', 'art-33', 'art-34', 'art-72']
    },
    {
      id: 'senior-tax',
      title_ko: '재산세 동결 & 세금 감면',
      title_en: 'Property Tax Relief & Income',
      badge: 'Senior Freeze · Stay NJ · ANCHOR',
      desc: '65세 이상 재산세 동결(Senior Freeze/PTR), Stay NJ(50% 감면), ANCHOR 환급금, SSI 및 소셜시큐리티 연금.',
      articleIds: ['art-4', 'art-5', 'art-6', 'art-68', 'art-9', 'art-12', 'art-11', 'art-49']
    },
    {
      id: 'senior-daycare',
      title_ko: '성인 데이케어 & 장기 요양',
      title_en: 'Adult Day Care & MLTSS',
      badge: '주간보호 · MLTSS 롱텀케어',
      desc: '어덜트 데이 케어(Adult Day Care) 차량 픽업 및 식사, MLTSS 메디케이드 롱텀케어, 널싱홈 요양원 및 D-SNP 듀얼 플랜.',
      articleIds: ['art-35', 'art-36', 'art-37', 'art-38', 'art-20', 'art-24', 'art-26', 'art-65', 'art-66']
    },
    {
      id: 'senior-legal',
      title_ko: '권익 보호 & 은퇴 법률',
      title_en: 'Senior Rights & Legal Protection',
      badge: '위임장(POA) · Living Will · APS',
      desc: '위임장(POA), 사전의료의향서(Living Will), 유언장, 리빙 트러스트, 성인보호국(APS), 시니어 사기 예방, 타운 시니어 교통 버스.',
      articleIds: ['art-40', 'art-41', 'art-42', 'art-43', 'art-44', 'art-45', 'art-46', 'art-47', 'art-48', 'art-73', 'art-74', 'art-75', 'art-77', 'art-78', 'art-79', 'art-80']
    }
  ];

  const ALL_SENIOR_ARTICLE_IDS = new Set(SENIOR_CATEGORIES.flatMap(c => c.articleIds));

  function initSeniorResources() {
    renderSeniorCategoryChoices(SENIOR_CATEGORIES);
    renderSeniorArticles();

    const searchInput = document.getElementById('seniorSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        seniorSearchQuery = e.target.value.toLowerCase().trim();
        renderSeniorArticles();
      });
    }
  }

  function renderSeniorCategoryChoices(categories) {
    const container = document.getElementById('seniorCategoryChoicesContainer');
    if (!container) return;

    container.innerHTML = categories.map(cat => `
      <div class="rc-choice-card ${currentSeniorCategory === cat.id ? 'active' : ''}" onclick="window.filterBySeniorCategory('${cat.id}')">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">${cat.badge}</span>
        </div>
        <div class="text-sm font-bold text-slate-900 mt-1">${cat.title_ko}</div>
        <p class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">${cat.desc}</p>
      </div>
    `).join('');
  }

  window.filterBySeniorCategory = function (catId) {
    currentSeniorCategory = catId;

    // Update active class on senior choice cards
    const container = document.getElementById('seniorCategoryChoicesContainer');
    if (container) {
      container.querySelectorAll('.rc-choice-card').forEach(card => {
        const onclickAttr = card.getAttribute('onclick') || '';
        card.classList.toggle('active', onclickAttr.includes(`'${catId}'`));
      });
    }

    // Update active category badge
    const badge = document.getElementById('activeSeniorCategoryBadge');
    if (badge) {
      if (catId === 'all') {
        badge.textContent = '전체 시니어 가이드';
      } else {
        const cat = SENIOR_CATEGORIES.find(c => c.id === catId);
        badge.textContent = cat ? cat.title_ko : catId;
      }
    }

    renderSeniorArticles();

    // Scroll smoothly to filter bar
    const filterBar = document.getElementById('seniorFilterBar');
    if (filterBar) {
      filterBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  function renderSeniorArticles() {
    const data = window.COMMUNITY_RESOURCES_DATA;
    if (!data) return;

    const grid = document.getElementById('seniorArticlesGrid');
    const countLabel = document.getElementById('seniorCountLabel');
    if (!grid) return;

    let targetIds;
    if (currentSeniorCategory === 'all') {
      targetIds = ALL_SENIOR_ARTICLE_IDS;
    } else {
      const selectedCat = SENIOR_CATEGORIES.find(c => c.id === currentSeniorCategory);
      targetIds = new Set(selectedCat ? selectedCat.articleIds : []);
    }

    const filtered = data.articles.filter(art => {
      const matchCat = targetIds.has(art.id);
      const matchSearch = !seniorSearchQuery ||
        art.title.toLowerCase().includes(seniorSearchQuery) ||
        art.excerpt.toLowerCase().includes(seniorSearchQuery);
      return matchCat && matchSearch;
    });

    if (countLabel) {
      countLabel.textContent = `총 ${filtered.length}개 가이드`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200">
          <p class="text-base font-semibold text-slate-700">검색 조건에 일치하는 시니어 가이드가 없습니다.</p>
          <p class="text-xs text-slate-500 mt-1">다른 검색어를 입력하시거나 카테고리를 전체로 변경해 보세요.</p>
          <button type="button" onclick="window.filterBySeniorCategory('all')" class="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700">
            전체 시니어 가이드 보기
          </button>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(art => `
      <div class="editorial-card flex flex-col justify-between hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group" onclick="window.openSeniorArticleInline('${art.id}')">
        <div>
          <div class="flex items-center justify-between gap-2 mb-2.5">
            <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
              ${art.category_name}
            </span>
            <span class="text-[11px] font-bold text-amber-700 bg-amber-50/70 px-2 py-0.5 rounded">65세+ 시니어</span>
          </div>
          <h4 class="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2 mb-2 leading-snug">
            ${art.title}
          </h4>
          <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
            ${art.excerpt}
          </p>
        </div>
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] text-slate-400">시니어 공식 브리핑</span>
          <span class="text-xs font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            가이드 읽기 &rarr;
          </span>
        </div>
      </div>
    `).join('');
  }

  // Senior Inline Guide Reader (Zero-Popup)
  window.openSeniorArticleInline = function (articleIdOrSlug) {
    const data = window.COMMUNITY_RESOURCES_DATA;
    if (!data) return;

    const art = data.articles.find(a => a.id === articleIdOrSlug || a.slug === articleIdOrSlug);
    if (!art) return;

    const readerEl = document.getElementById('inlineSeniorReader');
    const badgeEl = document.getElementById('inlineSeniorReaderCatBadge');
    const contentEl = document.getElementById('inlineSeniorReaderContent');

    if (!readerEl || !contentEl) return;

    if (badgeEl) badgeEl.textContent = `${art.category_name} · 시니어 특별 가이드`;
    contentEl.innerHTML = art.content_html;

    readerEl.classList.remove('hidden');

    // Smooth scroll into inline reader
    readerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.closeSeniorInlineReader = function () {
    const readerEl = document.getElementById('inlineSeniorReader');
    if (readerEl) {
      readerEl.classList.add('hidden');
    }
    // Scroll back to filter bar
    const bar = document.getElementById('seniorFilterBar');
    if (bar) bar.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // 7. Search Modal (Cmd+K)
  function initSearchModal() {
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearchModal();
      }
      if (e.key === 'Escape') {
        closeSearchModal();
      }
    });

    const input = document.getElementById('rcSearchModalInput');
    if (input) {
      input.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        renderModalSearchResults(q);
      });
    }
  }

  window.openSearchModal = function () {
    const modal = document.getElementById('rcSearchModal');
    if (modal) {
      modal.classList.remove('hidden');
      const input = document.getElementById('rcSearchModalInput');
      if (input) {
        input.value = '';
        input.focus();
        renderModalSearchResults('');
      }
    }
  };

  window.closeSearchModal = function () {
    const modal = document.getElementById('rcSearchModal');
    if (modal) modal.classList.add('hidden');
  };

  function renderModalSearchResults(q) {
    const list = document.getElementById('rcSearchResultsList');
    if (!list) return;

    const data = window.COMMUNITY_RESOURCES_DATA;
    if (!data) return;

    const results = data.articles.filter(a => {
      if (!q) return true;
      return a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q);
    }).slice(0, 10);

    if (results.length === 0) {
      list.innerHTML = `<li class="p-4 text-center text-sm text-slate-500">일치하는 결과가 없습니다.</li>`;
      return;
    }

    list.innerHTML = results.map(a => `
      <li class="p-3.5 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between" onclick="selectSearchResult('${a.id}')">
        <div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">${a.category_name}</span>
          <div class="text-sm font-bold text-slate-900 mt-0.5">${a.title}</div>
        </div>
        <span class="text-xs text-blue-600 font-semibold">&rarr;</span>
      </li>
    `).join('');
  }

  window.selectSearchResult = function (articleId) {
    closeSearchModal();
    if (activeTab === 'senior' && ALL_SENIOR_ARTICLE_IDS.has(articleId)) {
      openSeniorArticleInline(articleId);
    } else {
      switchTab('resources');
      openArticleInline(articleId);
    }
  };

})();
