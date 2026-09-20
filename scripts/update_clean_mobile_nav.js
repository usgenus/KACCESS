const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const files = [
  'index.php',
  'blog.php',
  'blog-post.php',
  'senior-care.php',
  'senior-care.html',
  'senior-care/index.html',
  'medicare.html',
  'medicare/index.html',
  'tool.html',
  'tool/index.html',
  'about.html',
  'about/index.html',
  'calculator.html',
  'dictionary.html',
  'matcher.html',
  'the-health-bridge.html',
  'the-health-bridge/index.html'
];

const standardKakao = `<a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0" title="카카오톡 1:1 상담 바로가기"><img src="/kakaotalk-icon.png" alt="KakaoTalk" class="w-5 h-5 sm:w-6 sm:h-6 rounded-md shrink-0 object-contain shadow-2xs" /><span class="hidden xs:inline text-xs sm:text-sm font-bold text-slate-800 hover:text-brand-blue tracking-tight whitespace-nowrap">1:1 상담</span></a>`;

for (const relPath of files) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  const navMatch = content.match(/<nav[\s\S]*?<\/nav>/);
  if (navMatch) {
    const navContent = navMatch[0];
    let updatedNav = navContent;

    // 1. Logo text - replace Healthcare Access Portal with Healthcare Access
    updatedNav = updatedNav.replace(
      /(<span class="font-serif[^"]*">)Healthcare Access Portal(<\/span>)/g,
      '$1Healthcare Access$2'
    );

    // 2. Hide subtitle on mobile
    updatedNav = updatedNav.replace(
      /<span class="block text-\[(?:9|10)px\] font-sans text-brand-muted leading-tight -mt-0.5">뉴저지 한인 의료 접근 포털<\/span>/g,
      '<span class="hidden sm:block text-[9px] sm:text-[10px] font-sans text-brand-muted leading-tight -mt-0.5 truncate">뉴저지 한인 의료 접근 포털</span>'
    );

    // 3. Nav padding
    updatedNav = updatedNav.replace(
      '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">',
      '<div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">'
    );

    // 4. Update Kakao button in top nav
    const kakaoMatch = updatedNav.match(/<a\s+href="http:\/\/pf\.kakao\.com\/_hdxmxaX\/chat"[^>]*>[\s\S]*?<\/a>/);
    if (kakaoMatch) {
      updatedNav = updatedNav.replace(kakaoMatch[0], standardKakao);
    }

    // 5. Container gap & flex-shrink
    updatedNav = updatedNav.replace(
      /<div class="flex items-center gap-3">/g,
      '<div class="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">'
    ).replace(
      /<div class="flex items-center gap-2 sm:gap-3">/g,
      '<div class="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">'
    );

    // 6. Brand link classes
    updatedNav = updatedNav.replace(
      /<a class="flex-shrink-0 group flex items-center gap-2\.5 cursor-pointer"/g,
      '<a class="min-w-0 flex-shrink group flex items-center gap-1.5 sm:gap-2.5 cursor-pointer njap-brand-link"'
    ).replace(
      /<a class="min-w-0 flex-shrink group flex items-center gap-2 sm:gap-2\.5 cursor-pointer njap-brand-link"/g,
      '<a class="min-w-0 flex-shrink group flex items-center gap-1.5 sm:gap-2.5 cursor-pointer njap-brand-link"'
    );

    // 7. Brand logo icon wrapper
    updatedNav = updatedNav.replace(
      /<div class="w-8 h-8 flex items-center justify-center flex-shrink-0">/g,
      '<div class="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">'
    );

    // 8. Logo title classes
    updatedNav = updatedNav.replace(
      /<span class="font-serif text-xl text-brand-dark group-hover:text-brand-blue transition-colors duration-200 block">/g,
      '<span class="font-serif text-[13px] xs:text-sm sm:text-base md:text-xl text-brand-dark group-hover:text-brand-blue transition-colors duration-200 block truncate font-bold leading-tight">'
    ).replace(
      /<span class="font-serif text-sm sm:text-base md:text-xl text-brand-dark group-hover:text-brand-blue transition-colors duration-200 block">/g,
      '<span class="font-serif text-[13px] xs:text-sm sm:text-base md:text-xl text-brand-dark group-hover:text-brand-blue transition-colors duration-200 block truncate font-bold leading-tight">'
    );

    if (updatedNav !== navContent) {
      content = content.replace(navContent, updatedNav);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`[UPDATED] ${relPath}`);
  } else {
    console.log(`[NO CHANGE] ${relPath}`);
  }
}
console.log('Mobile nav update script finished.');
