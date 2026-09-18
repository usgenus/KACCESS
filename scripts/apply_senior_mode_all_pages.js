const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const targetFiles = [
  'index.php',
  'index.html',
  'senior-care.php',
  'senior-care.html',
  'senior-care/index.html',
  'medicare.html',
  'medicare/index.html',
  'blog.php',
  'blog.html',
  'blog-post.php',
  'about.html',
  'about/index.html',
  'tool.html',
  'tool/index.html',
  'calculator.html',
  'dictionary.html',
  'matcher.html',
  '404.html',
  '_not-found.html'
];

const seniorButtonHTML = `<button id="senior-mode-btn" class="senior-mode-btn notranslate" translate="no" type="button" onclick="window.cycleSeniorMode && window.cycleSeniorMode()" title="시니어모드+ (글자 크기 3단계 조절)" aria-label="시니어모드 글자 크기 조절"><span class="senior-btn-label">시니어모드+</span><span class="senior-step-badge" style="display:none;"></span></button>`;

const mobileSeniorRowHTML = `      <!-- Senior Mode in Mobile Menu -->
      <div class="flex items-center justify-between py-2.5 px-3.5 mb-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-slate-700">화면 글자 크기</span>
        </div>
        <button type="button" class="senior-mode-btn notranslate" translate="no" onclick="window.cycleSeniorMode && window.cycleSeniorMode()" style="padding:4px 10px;font-size:12px;">
          <span class="senior-btn-label">시니어모드+</span>
          <span class="senior-step-badge" style="display:none;"></span>
        </button>
      </div>\n`;

const earlyHeadScript = `  <script>
    (function() {
      try {
        var s = parseInt(localStorage.getItem('njap_senior_mode'), 10);
        if (s === 1) document.documentElement.classList.add('senior-mode-1');
        else if (s === 2) document.documentElement.classList.add('senior-mode-2');
      } catch(e) {}
    })();
  </script>\n`;

const seniorStyles = `  <style id="njap-senior-mode-base-css">
    html.senior-mode-1 { font-size: 118% !important; }
    html.senior-mode-2 { font-size: 135% !important; }
    html.senior-mode-1 .header-spacer, html.senior-mode-1 .h-\\[109px\\], html.senior-mode-1 #header-spacer { height: 120px !important; min-height: 120px !important; }
    html.senior-mode-2 .header-spacer, html.senior-mode-2 .h-\\[109px\\], html.senior-mode-2 #header-spacer { height: 132px !important; min-height: 132px !important; }
  </style>\n`;

for (const relPath of targetFiles) {
  const filePath = path.join(ROOT, relPath);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Add earlyHeadScript in <head> if not present
  if (!content.includes('njap_senior_mode') && content.includes('</head>')) {
    content = content.replace('</head>', `${earlyHeadScript}${seniorStyles}</head>`);
    changed = true;
  }

  // 2. Add #senior-mode-btn before #en-translate-btn in top nav if not present
  if (!content.includes('id="senior-mode-btn"')) {
    if (content.includes('<button id="en-translate-btn"')) {
      content = content.replace(
        '<button id="en-translate-btn"',
        `${seniorButtonHTML}\n          <button id="en-translate-btn"`
      );
      changed = true;
    }
  }

  // 3. Add mobile menu senior mode row in #mobile-menu-dropdown if not present
  if (!content.includes('class="senior-mode-btn notranslate"') && content.includes('id="mobile-menu-dropdown"')) {
    // Insert right after <div id="mobile-menu-dropdown"...>
    const dropdownRegex = /(<div\s+id="mobile-menu-dropdown"[^>]*>)/;
    if (dropdownRegex.test(content)) {
      content = content.replace(dropdownRegex, `$1\n${mobileSeniorRowHTML}`);
      changed = true;
    }
  }

  // 4. Update /js/fixes.js query version to 5.1.0 to bust browser cache
  if (content.includes('/js/fixes.js')) {
    const updated = content.replace(/\/js\/fixes\.js(\?v=[^"'\s>]*)?/g, '/js/fixes.js?v=5.1.0');
    if (updated !== content) {
      content = updated;
      changed = true;
    }
  } else if (content.includes('</body>')) {
    content = content.replace('</body>', '  <script src="/js/fixes.js?v=5.1.0"></script>\n</body>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[UPDATED] ${relPath}`);
  } else {
    console.log(`[UNCHANGED] ${relPath}`);
  }
}

// Special handling for forum/components.php
const forumCompPath = path.join(ROOT, 'forum/components.php');
if (fs.existsSync(forumCompPath)) {
  let forumContent = fs.readFileSync(forumCompPath, 'utf8');
  let changed = false;

  if (!forumContent.includes('id="senior-mode-btn"') && forumContent.includes('<button id="en-translate-btn"')) {
    forumContent = forumContent.replace(
      '<button id="en-translate-btn"',
      `${seniorButtonHTML}\n          <button id="en-translate-btn"`
    );
    changed = true;
  }

  if (!forumContent.includes('njap_senior_mode') && forumContent.includes('render_forum_header() {')) {
    forumContent = forumContent.replace(
      'render_forum_header() {',
      `render_forum_header() {\n?>\n${earlyHeadScript}${seniorStyles}<?php`
    );
    changed = true;
  }

  if (!forumContent.includes('/js/fixes.js') && forumContent.includes('render_forum_footer() {')) {
    forumContent = forumContent.replace(
      '<script src="/js/njap-translate.js?v=3.0.0"></script>',
      '<script src="/js/njap-translate.js?v=3.0.0"></script>\n  <script src="/js/fixes.js?v=5.1.0"></script>'
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(forumCompPath, forumContent, 'utf8');
    console.log(`[UPDATED] forum/components.php`);
  }
}
