/**
 * Healthcare Access Portal — Critical Fixes Script v1.0
 * Loaded AFTER cms-client.js to patch any remaining issues.
 * This handles: mobile menu, home nav, billboard hover scale,
 * video autoplay prevention, section slide-in, and 의사칼럼 sidebar.
 */
(function() {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // 1. INJECT STYLES
  // ─────────────────────────────────────────────────────────────
  function injectCSS() {
    var s = document.createElement('style');
    s.textContent = [
      /* Header Spacer Fix for Mobile & Desktop */
      '.h-\\[109px\\], .header-spacer, #header-spacer {',
      '  height: 109px !important;',
      '  min-height: 109px !important;',
      '  display: block !important;',
      '  width: 100% !important;',
      '}',
      '.h-\\[45px\\] { height: 45px !important; }',

      /* Mobile Billboard Full Visibility */
      '@media (max-width: 640px) {',
      '  #gallery-billboard-section { margin-top: 0 !important; margin-bottom: 1.25rem !important; }',
      '  #gallery-billboard-container > div { min-height: 230px !important; height: 240px !important; }',
      '  #gallery-billboard-container video, #gallery-billboard-container img { min-height: 230px !important; height: 100% !important; object-fit: cover !important; }',
      '}',

      /* Slide-in animation */
      '.fx-slide { opacity:0; transform:translateY(30px);',
      '  transition: opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1); }',
      '.fx-slide.fx-in { opacity:1; transform:none; }',

      /* Billboard hover scale */
      '.bb-img { transition: transform .9s ease; }',
      ':hover > .bb-img, :hover .bb-img { transform: scale(1.05); }',

      /* 의사칼럼 sidebar */
      '#doctor-column-sidebar { }',
      '#doctor-column-sidebar .dc-item { border-bottom: 1px solid #e5e7eb; }',
      '#doctor-column-sidebar .dc-item:last-child { border-bottom: none; }',

      /* Mobile menu open state */
      '.mobile-menu-open { max-height: 400px !important; opacity: 1 !important; pointer-events: auto !important; }',
    ].join('\n');
    document.head.appendChild(s);
  }

  // ─────────────────────────────────────────────────────────────
  // 2. HOME NAVIGATION — guarantees 홈 works from all pages
  // ─────────────────────────────────────────────────────────────
  function fixHomeNav() {
    document.addEventListener('click', function(e) {
      var el = e.target;
      while (el && el !== document) {
        var tag = (el.tagName || '').toLowerCase();
        if (tag === 'a' || tag === 'button') {
          var href = el.hasAttribute('href') ? (el.getAttribute('href') || '').trim() : null;
          var txt  = (el.textContent || '').trim();
          var isHomeLink = (href === '/' || href === '/index.html' || href === '/index.php') && (txt === '홈' || txt === 'Home' || el.classList.contains('njap-brand-link') || el.closest('.njap-brand-link'));
          var isHomeText = (txt === '홈' || txt === 'Home') && (tag === 'a' || tag === 'button');
          
          if (isHomeLink || isHomeText) {
            e.preventDefault();
            e.stopPropagation();
            if (window.location.pathname === '/' || window.location.pathname === '' || window.location.pathname === '/index.php' || window.location.pathname === '/index.html') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              window.location.href = '/';
            }
            return;
          }
          break;
        }
        el = el.parentElement;
      }
    }, true);
  }

  // ─────────────────────────────────────────────────────────────
  // 3. MOBILE MENU — robust toggle using class toggling
  // ─────────────────────────────────────────────────────────────
  function fixMobileMenu() {
    // Find hamburger button
    var btn = document.querySelector('button[aria-label="Menu"]') ||
              document.getElementById('mobile-menu-btn');
    if (!btn) return;

    // Find dropdown (div.md:hidden inside nav that has links)
    var nav = document.querySelector('nav');
    if (!nav) return;
    var dropdown = null;
    var divs = nav.querySelectorAll('div');
    for (var i = 0; i < divs.length; i++) {
      var d = divs[i];
      var cls = d.className || '';
      if (cls.indexOf('md:hidden') !== -1 && d.querySelector('a')) {
        dropdown = d;
        break;
      }
    }
    if (!dropdown) return;
    if (btn.dataset.fxbound) return;
    btn.dataset.fxbound = '1';

    // Force initial closed state
    dropdown.style.cssText = 'max-height:0;opacity:0;overflow:hidden;pointer-events:none;transition:max-height .3s ease,opacity .25s ease;';

    var spans = btn.querySelectorAll('span');
    var open = false;

    function openMenu() {
      open = true;
      dropdown.style.maxHeight = '400px';
      dropdown.style.opacity = '1';
      dropdown.style.pointerEvents = 'auto';
      if (spans[0]) spans[0].style.transform = 'translateY(6px) rotate(45deg)';
      if (spans[1]) spans[1].style.opacity = '0';
      if (spans[2]) spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
    }
    function closeMenu() {
      open = false;
      dropdown.style.maxHeight = '0';
      dropdown.style.opacity = '0';
      dropdown.style.pointerEvents = 'none';
      if (spans[0]) spans[0].style.transform = '';
      if (spans[1]) spans[1].style.opacity = '';
      if (spans[2]) spans[2].style.transform = '';
    }

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      open ? closeMenu() : openMenu();
    });

    // Close on link click
    dropdown.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() { setTimeout(closeMenu, 60); });
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (open && !btn.contains(e.target) && !dropdown.contains(e.target)) closeMenu();
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 4. BILLBOARD IMAGE HOVER SCALE
  // ─────────────────────────────────────────────────────────────
  function fixBillboardHover() {
    var imgs = document.querySelectorAll('#billboard-active-img, #gallery-billboard-container img, #gallery-billboard-section img');
    imgs.forEach(function(img) { img.classList.add('bb-img'); });

    // Also watch for CMS-rendered billboard
    var container = document.getElementById('gallery-billboard-container');
    if (container && window.MutationObserver) {
      var mo = new MutationObserver(function() {
        container.querySelectorAll('img, video').forEach(function(m) { m.classList.add('bb-img'); });
      });
      mo.observe(container, { childList: true, subtree: true });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 5. VIDEO AUTOPLAY FIX (Handled natively by cms-client.js)
  // ─────────────────────────────────────────────────────────────
  function fixVideoAutoplay() {
    // Delegated to cms-client.js for modern interactive playback
  }

  // ─────────────────────────────────────────────────────────────
  // 6. SECTION SLIDE-IN ANIMATION
  // ─────────────────────────────────────────────────────────────
  function fixSlideIn() {
    if (!window.IntersectionObserver) return;
    var sections = document.querySelectorAll('main section:not(#gallery-billboard-section), main article, .fx-slide-target');
    if (!sections.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('fx-in');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });

    sections.forEach(function(el, i) {
      el.classList.add('fx-slide');
      el.style.transitionDelay = Math.min(i * 50, 300) + 'ms';
      observer.observe(el);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 7. 의사칼럼 SIDEBAR — inject into blog.html if not present
  // ─────────────────────────────────────────────────────────────
  function injectDoctorColumnSidebar() {
    // Only on blog page
    var grid = document.getElementById('cms-blog-posts-grid');
    if (!grid) return;
    // Already injected?
    if (document.getElementById('doctor-column-sidebar')) return;

    // Find the section wrapping the blog grid
    var section = grid.closest('section') || grid.closest('div.max-w-7xl');
    if (!section) return;

    // Find the max-w-7xl container inside that section
    var container = section.querySelector('.max-w-7xl') || section;

    // Restructure: wrap grid in a flex layout with a sidebar
    var wrapper = document.createElement('div');
    wrapper.className = 'flex gap-8 items-start';

    var mainCol = document.createElement('div');
    mainCol.className = 'flex-1 min-w-0';

    // Move grid into mainCol
    var gridParent = grid.parentElement;
    gridParent.insertBefore(wrapper, grid);
    mainCol.appendChild(grid);
    wrapper.appendChild(mainCol);

    // Create sidebar
    var sidebar = document.createElement('aside');
    sidebar.id = 'doctor-column-sidebar';
    sidebar.className = 'w-72 shrink-0 hidden lg:block';
    sidebar.innerHTML = '<div id="dc-sidebar-inner">' + getDoctorColumnHTML([]) + '</div>';
    wrapper.appendChild(sidebar);

    // Now fetch and populate the sidebar
    loadDoctorColumnPosts();
  }

  function getDoctorColumnHTML(posts) {
    var header = [
      '<div class="border-t-4 border-red-600 pt-4 mb-5">',
      '  <h2 class="font-extrabold text-base uppercase tracking-widest text-slate-900">의사 칼럼</h2>',
      '  <p class="text-xs text-slate-500 mt-0.5 font-sans">전문의가 전하는 건강 이야기</p>',
      '</div>'
    ].join('');

    if (!posts.length) {
      return header + [
        '<div class="text-sm text-slate-400 text-center py-8 font-sans">',
        '  <div class="text-2xl mb-2">🩺</div>',
        '  <p>등록된 의사 칼럼이 없습니다.</p>',
        '  <p class="text-xs mt-1">관리자 CMS에서 카테고리를 <strong>의사칼럼</strong>으로 설정해 게시하세요.</p>',
        '</div>'
      ].join('');
    }

    var items = posts.slice(0, 6).map(function(p, i) {
      return [
        '<div class="dc-item py-3.5">',
        '  <div class="flex gap-3 items-start group cursor-pointer" onclick="window.location.href=\'/blog/' + (p.slug || p.id) + '\'">',
        '    <span class="text-2xl font-black text-red-600 leading-none w-6 shrink-0 mt-0.5 font-serif">' + (i + 1) + '</span>',
        '    <div class="flex-1 min-w-0">',
        '      <p class="text-[11px] font-bold text-red-600 uppercase tracking-wide mb-0.5">' + escHtml(p.author || '전문의') + '</p>',
        '      <h3 class="font-bold text-sm text-slate-900 leading-snug line-clamp-2 group-hover:text-red-700 transition-colors">' + escHtml(p.title) + '</h3>',
        '      <p class="text-[11px] text-slate-500 mt-0.5 font-sans">' + escHtml(p.date || '') + '</p>',
        '    </div>',
        '    ' + (p.coverImage || (p.images && p.images[0]) ? '<img src="' + escHtml(p.coverImage || p.images[0]) + '" class="w-16 h-12 object-cover rounded-lg shrink-0 border border-slate-200" alt="">' : ''),
        '  </div>',
        '</div>'
      ].join('');
    }).join('');

    return header + '<div id="dc-items">' + items + '</div>' + [
      '<a href="/blog?category=' + encodeURIComponent('의사칼럼') + '" class="mt-4 block text-center text-xs font-bold text-red-600 hover:text-red-800 py-2 border border-red-200 rounded-full hover:bg-red-50 transition-all">',
      '  더보기 →',
      '</a>'
    ].join('');
  }

  function escHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function loadDoctorColumnPosts() {
    fetch('/api/posts.php?category=' + encodeURIComponent('의사칼럼') + '&_t=' + Date.now())
      .then(function(r) { return r.json(); })
      .then(function(d) {
        var sidebar = document.getElementById('dc-sidebar-inner');
        if (sidebar && d.success) {
          sidebar.innerHTML = getDoctorColumnHTML(d.data || []);
        }
      })
      .catch(function() {});
  }

  // Also add 의사칼럼 category button to the blog filter bar if not present
  function addDoctorColumnFilter() {
    var catDiv = document.getElementById('cms-blog-categories');
    if (!catDiv) return;
    var exists = false;
    catDiv.querySelectorAll('button').forEach(function(b) {
      if (b.textContent.trim() === '의사칼럼') exists = true;
    });
    if (!exists) {
      var btn = document.createElement('button');
      btn.className = 'text-sm font-sans font-medium px-4 py-1.5 rounded-full border transition-all duration-200 border-brand-border text-brand-muted hover:border-brand-blue hover:text-brand-blue bg-white';
      btn.textContent = '의사칼럼';
      catDiv.appendChild(btn);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────────────────────
  function init() {
    injectCSS();
    fixHomeNav();
    fixMobileMenu();
    fixBillboardHover();
    fixVideoAutoplay();
    setTimeout(fixSlideIn, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
