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
  const TOTAL_SLIDES = 3;
  const CAPTIONS = [
    '2026 연방 빈곤선(FPL) 기준 실시간 자동 판정',
    '엄선된 8대 카테고리 80편 연구 안내서 & 타운별 주택 포털',
    '2026 메디케어 AEP 인롤먼트 & 파트 D 약값 상한제'
  ];
  const TAB_TO_SLIDE = {
    'calculator': 1,
    'resources': 2,
    'medicare': 3
  };
  const SLIDE_TO_TAB = {
    1: 'calculator',
    2: 'resources',
    3: 'medicare'
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
    initHousingTownFilters();
    initSearchModal();
    handleHashRouting();
  });

  window.addEventListener('hashchange', handleHashRouting);

  function handleHashRouting() {
    let hash = window.location.hash.replace('#', '') || 'calculator';
    // Backwards compatibility aliases
    if (hash === 'directory' || hash === 'housing') hash = 'resources';

    if (['calculator', 'resources', 'medicare'].includes(hash)) {
      switchTab(hash, false);
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

    // Update slides visibility with smooth transition
    for (let i = 1; i <= TOTAL_SLIDES; i++) {
      const slide = document.getElementById('rc-hero-slide-' + i);
      const img = document.getElementById('rc-hero-visual-' + i);
      const tab = document.getElementById('rc-billboard-tab-' + i);

      if (slide) {
        if (i === n) {
          slide.classList.remove('hidden');
          void slide.offsetWidth;
          slide.classList.remove('opacity-0', 'translate-y-3');
        } else {
          slide.classList.add('opacity-0', 'translate-y-3');
          setTimeout(() => {
            if (currentBillboardSlide !== i) {
              slide.classList.add('hidden');
            }
          }, 350);
        }
      }

      if (img) {
        if (i === n) {
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
        const isActive = (i === n);
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
      if (tabId) {
        switchTab(tabId, false);
      }
    }
  }

  window.rcHeroGoto = function (n, shouldScroll = false) {
    setBillboardSlide(n, true);
    resetBillboardTimer();
    if (shouldScroll) {
      scrollToContent();
    }
  };

  window.rcHeroTabClick = function (tabId, shouldScroll = false) {
    const slideIdx = TAB_TO_SLIDE[tabId] || 1;
    window.location.hash = tabId;
    window.rcHeroGoto(slideIdx, shouldScroll);
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

  // 1. Tab Navigation (Only 3 Buttons)
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
    activeTab = tabId;
    const slideIdx = TAB_TO_SLIDE[tabId] || 1;
    setBillboardSlide(slideIdx, false);

    document.querySelectorAll('.rc-nav-tab').forEach(t => {
      const isActive = t.dataset.tab === tabId;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    document.querySelectorAll('.rc-tab-view').forEach(view => {
      view.classList.toggle('hidden', view.id !== `tab-view-${tabId}`);
    });

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

    container.innerHTML = res.results.map(item => `
      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between gap-3">
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${item.status === 'eligible' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}">
              ${item.status_ko}
            </span>
            <span class="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              ${item.badge || '공식 혜택'}
            </span>
          </div>
          <h4 class="text-base font-bold text-slate-900 mb-1.5">${item.title_ko}</h4>
          <p class="text-xs text-slate-600 leading-relaxed mb-2">${item.benefit_ko}</p>
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11.5px] text-slate-700">
            <strong>적격 기준:</strong> ${item.criteria_ko}
          </div>
        </div>
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-400 font-medium">${item.title_en || ''}</span>
          <button type="button" onclick="window.handleCalculatorServiceClick('${item.id}')" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer">
            관련 안내 및 신청 가이드 바로보기 &rarr;
          </button>
        </div>
      </div>
    `).join('');
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
        <div class="flex items-center justify-between">
          <span class="text-2xl">${cat.icon}</span>
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
        badge.textContent = cat ? `${cat.icon} ${cat.title_ko}` : catId;
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
            <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-100 flex items-center gap-1">
              <span>${art.category_icon || '📋'}</span>
              <span>${art.category_name}</span>
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

    if (badgeEl) badgeEl.textContent = `${art.category_icon || '📋'} ${art.category_name}`;
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

  // 6. Search Modal (Cmd+K)
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
    switchTab('resources');
    openArticleInline(articleId);
  };

})();
