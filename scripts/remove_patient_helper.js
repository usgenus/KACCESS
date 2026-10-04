const fs = require('fs');
const path = require('path');

const rootDir = '/Users/ejyoon/Desktop/KACCESS';

function cleanFile(filePath, transformer) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  content = transformer(content);
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[CLEANED] ${path.relative(rootDir, filePath)}`);
  } else {
    console.log(`[UNCHANGED] ${path.relative(rootDir, filePath)}`);
  }
}

// 1. Common transformations for navigation & footer
function removePatientHelperFromNavAndFooter(content) {
  // Desktop Nav link: <a class="nav-link ... href="/tool">환자도우미</a> (or /ko/tool)
  content = content.replace(
    /\s*<a class="nav-link[^>]*href="\/(?:ko\/)?tool"[^>]*>환자도우미<\/a>/g,
    ''
  );

  // Mobile menu item 5: <!-- 5. 환자도우미 --> ... </a>
  content = content.replace(
    /\s*<!--\s*5\.\s*환자도우미\s*-->[\s\S]*?<a\s+href="\/(?:ko\/)?tool"[\s\S]*?<\/a>/g,
    ''
  );

  // Generic mobile link to /tool with 환자도우미
  content = content.replace(
    /\s*<a\s+class="font-sans text-sm[^>]*href="\/(?:ko\/)?tool"[^>]*>환자도우미<\/a>/g,
    ''
  );

  // Footer: change column title '환자도우미' to '스마트 의료 도구'
  content = content.replace(
    /(<p class="text-xs font-sans font-semibold uppercase tracking-widest text-white\/40 mb-4">)환자도우미(<\/p>)/g,
    '$1스마트 의료 도구$2'
  );

  // Footer links pointing to /tool or /ko/tool -> change to valid tool links
  content = content.replace(
    /<a class="text-sm font-sans text-white\/60 hover:text-white transition-colors duration-200" href="\/(?:ko\/)?tool">보험 자격 진단<\/a>/g,
    '<a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/matcher">보험 자격 진단</a>'
  );
  content = content.replace(
    /<a class="text-sm font-sans text-white\/60 hover:text-white transition-colors duration-200" href="\/(?:ko\/)?tool">보조금 계산기<\/a>/g,
    '<a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/calculator">보조금 계산기</a>'
  );
  content = content.replace(
    /<a class="text-sm font-sans text-white\/60 hover:text-white transition-colors duration-200" href="\/(?:ko\/)?tool">의학 용어 사전<\/a>/g,
    '<a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/dictionary">의학 용어 사전</a>'
  );

  return content;
}

// 2. Clean homepage tool grid in index.php and ko/index.html
function cleanHomepageToolsGrid(content) {
  // Remove 4th card (PATIENT PORTAL / 스마트 환자 서비스 & 사전접수)
  content = content.replace(
    /\s*<a class="group" href="\/tool">[\s\S]*?PATIENT PORTAL[\s\S]*?스마트 환자 서비스[\s\S]*?<\/a>/g,
    ''
  );

  // Update grid from 4 cols to 3 cols: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 -> grid-cols-1 sm:grid-cols-3 lg:grid-cols-3
  content = content.replace(
    /grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5/g,
    'grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-5'
  );

  return content;
}

// 3. Clean sub-tool hub tabs in calculator.html, dictionary.html, matcher.html
function cleanSubToolTabs(content) {
  content = content.replace(
    /\s*<a href="\/tool" class="hub-tab-btn[^"]*"[^>]*>[\s\S]*?<\/a>/g,
    ''
  );
  content = content.replace(/<!-- 4 Tool Nav Tabs -->/g, '<!-- 3 Tool Nav Tabs -->');
  return content;
}

// Apply to all HTML and PHP files
const filesToProcess = [
  'index.php',
  'ko/index.html',
  'blog.php',
  'blog-post.php',
  'ko/blog-post.php',
  'medicare.html',
  'medicare/index.html',
  'about.html',
  'about/index.html',
  'calculator.html',
  'dictionary.html',
  'matcher.html',
  'senior-care.html',
  'senior-care.php',
  'the-health-bridge.html',
  'the-health-bridge/index.html',
  '404.html',
  '_not-found.html',
  'forum/components.php',
  'ko/forum/components.php',
  'engine/js/main.js'
];

filesToProcess.forEach(rel => {
  const p = path.join(rootDir, rel);
  cleanFile(p, (content) => {
    content = removePatientHelperFromNavAndFooter(content);
    if (rel === 'index.php' || rel === 'ko/index.html') {
      content = cleanHomepageToolsGrid(content);
    }
    if (rel === 'calculator.html' || rel === 'dictionary.html' || rel === 'matcher.html') {
      content = cleanSubToolTabs(content);
    }
    if (rel === 'the-health-bridge.html' || rel === 'the-health-bridge/index.html') {
      content = content.replace(
        /\s*<a href="\/tool" class="flex items-center justify-between py-2\.5 px-3 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:bg-slate-50">[\s\S]*?<span>환자도우미<\/span>[\s\S]*?<\/a>/g,
        ''
      );
      content = content.replace(
        /\s*<li><a class="text-sm font-sans text-white\/60 hover:text-white transition-colors" href="\/tool">환자도우미 도구<\/a><\/li>/g,
        ''
      );
    }
    if (rel.includes('medicare')) {
      content = content.replace(
        /https:\/\/njaccessportal\.com\/(?:ko\/)?tool/g,
        'http://pf.kakao.com/_hdxmxaX/chat'
      );
      content = content.replace(
        /스마트 환자 서비스로 무료 상담 신청하기 →/g,
        '카카오톡 1:1 상담 바로가기 →'
      );
      content = content.replace(
        /스마트 환자 서비스 바로가기 \(무료 상담 및 접수\) →/g,
        '카카오톡 1:1 상담 바로가기 (무료 상담 및 접수) →'
      );
    }
    return content;
  });
});

// Clean splash.html
cleanFile(path.join(rootDir, 'splash.html'), content => {
  content = content.replace(/환자도우미 및/g, '스마트 의료 도구 및');
  content = content.replace(
    /\s*<!--\s*4\.\s*환자도우미\s*-->[\s\S]*?<a\s+href="\/tool"[\s\S]*?id="btnTool"[\s\S]*?<\/a>/g,
    ''
  );
  return content;
});

// Clean js/fixes.js
cleanFile(path.join(rootDir, 'js/fixes.js'), content => {
  // Remove from mobile menu
  content = content.replace(
    /\s*'<!-- 5\. Patient Tools -->',[\s\S]*?'  <svg class="w-4 h-4 ' \+ \(isTool \? 'text-brand-blue' : 'text-slate-300'\) \+ '" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"\/><\/svg>',\n\s*'<\/a>',/g,
    ''
  );
  // Ensure remove from desktop/mobile in ensureSeniorCareInNav
  if (!content.includes('var toolA = desktopDiv.querySelector')) {
    content = content.replace(
      'var seniorA = desktopDiv.querySelector(\'a[href*="senior-care"]\');',
      `var toolA = desktopDiv.querySelector('a[href*="/tool"]');\n      if (toolA) toolA.remove();\n      var seniorA = desktopDiv.querySelector('a[href*="senior-care"]');`
    );
    content = content.replace(
      'var mSenior = mobileDropdown.querySelector(\'a[href*="senior-care"]\');',
      `var mTool = mobileDropdown.querySelector('a[href*="/tool"]');\n      if (mTool) mTool.remove();\n      var mSenior = mobileDropdown.querySelector('a[href*="senior-care"]');`
    );
    content = content.replace(
      'var footerSeniorA = footer.querySelector(\'a[href*="senior-care"]\');',
      `var footerToolA = footer.querySelector('a[href*="/tool"]');\n      if (footerToolA) {\n        var tLi = footerToolA.closest('li');\n        if (tLi) tLi.remove();\n        else footerToolA.remove();\n      }\n      var footerSeniorA = footer.querySelector('a[href*="senior-care"]');`
    );
  }
  return content;
});

// Clean admin
cleanFile(path.join(rootDir, 'admin/admin.js'), content => {
  return content.replace(/'환자도우미 바로가기 →'/g, "'바로가기 →'");
});
cleanFile(path.join(rootDir, 'admin/index.php'), content => {
  content = content.replace(/value="환자도우미 바로가기 →"/g, 'value="바로가기 →"');
  content = content.replace(/value="\/tool"/g, 'value="/calculator"');
  return content;
});

['api/billboards2.php', 'ko/api/billboards2.php'].forEach(rel => {
  cleanFile(path.join(rootDir, rel), content => {
    return content.replace(/'linkUrl' => trim\(\$input\['linkUrl'\] \?\? '\/tool'\),/g, "'linkUrl' => trim($input['linkUrl'] ?? '/calculator'),");
  });
});

// Clean Next.js chunks if present
['_next/static/chunks/3hl7r9k9z73f7.js', '_next/static/chunks/3hl7r9k9z73f7_v2.js', '_next/static/chunks/3hl7r9k9z73f7_v3.js'].forEach(chunk => {
  cleanFile(path.join(rootDir, chunk), content => {
    content = content.replace(/"환자도우미":\[\{href:"\/tool",label:"보험 자격 진단"\},\{href:"\/tool",label:"보조금 계산기"\},\{href:"\/tool",label:"의학 용어 사전"\}\]/g,
      '"스마트 의료 도구":[{href:"/matcher",label:"보험 자격 진단"},{href:"/calculator",label:"보조금 계산기"},{href:"/dictionary",label:"의학 용어 사전"}]'
    );
    content = content.replace(/\{href:"\/tool",label:"환자도우미"\},?/g, '');
    return content;
  });
});

// 4. Turn tool.html and tool/index.html into 301 redirects to /
const redirectHTML = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/"><script>location.replace('/');</script></head><body>Redirecting to <a href="/">NJ Access Portal</a>...</body></html>`;
fs.writeFileSync(path.join(rootDir, 'tool.html'), redirectHTML, 'utf8');
console.log('[REPLACED] tool.html with 301 redirect');

const toolIndexDir = path.join(rootDir, 'tool');
if (fs.existsSync(toolIndexDir)) {
  fs.writeFileSync(path.join(toolIndexDir, 'index.html'), redirectHTML, 'utf8');
  console.log('[REPLACED] tool/index.html with 301 redirect');
}

// 5. Update .htaccess & router.php
cleanFile(path.join(rootDir, '.htaccess'), content => {
  // Replace tool/navigation routes with 301 redirect to /
  content = content.replace(
    /RewriteRule \^navigation\/\?\$ tool\.html \[L\]/,
    'RewriteRule ^navigation/?$ / [R=301,L]'
  );
  content = content.replace(
    /RewriteRule \^tool\/\?\$ tool\.html \[L\]/,
    'RewriteRule ^tool/?$ / [R=301,L]'
  );
  return content;
});

cleanFile(path.join(rootDir, 'router.php'), content => {
  content = content.replace(
    /if \(preg_match\('#\^\/tool\/\?\$#', \$uri\) \|\| preg_match\('#\^\/navigation\/\?\$#', \$uri\)\) \{[\s\S]*?readfile\(__DIR__ \. '\/tool\.html'\);[\s\S]*?exit;[\s\S]*?\}/,
    `if (preg_match('#^/tool/?$#', $uri) || preg_match('#^/navigation/?$#', $uri)) {
    header("Location: /", true, 301);
    exit;
}`
  );
  return content;
});

// 6. Update sitemap.xml & sitemap.php
cleanFile(path.join(rootDir, 'sitemap.xml'), content => {
  return content.replace(
    /\s*<url>\s*<loc>https:\/\/njaccessportal\.com\/tool<\/loc>[\s\S]*?<\/url>/g,
    ''
  );
});

cleanFile(path.join(rootDir, 'sitemap.php'), content => {
  return content.replace(
    /\s*\[\s*'loc'\s*=>\s*'\/'\s*,\s*'title'\s*=>\s*'스마트 환자 서비스 \(환자도우미\)'[\s\S]*?\],/g,
    ''
  ).replace(
    /\s*\[\s*'path'\s*=>\s*'\/tool'[\s\S]*?\],/g,
    ''
  );
});

// 7. Update robots.txt & ko/robots.txt
['robots.txt', 'ko/robots.txt'].forEach(rel => {
  cleanFile(path.join(rootDir, rel), content => {
    return content.replace(/Allow: \/tool\n?/g, '');
  });
});

console.log('\nPatient Helper (환자도우미) removal completed successfully!');
