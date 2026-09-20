const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const targetFiles = [
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
  'the-health-bridge/index.html',
  'forum/components.php',
  '404.html',
  '_not-found.html'
];

const newNavBrandLink = `<a class="flex items-center cursor-pointer njap-brand-link flex-shrink-0 group" href="/" onclick="navigateToHome(event); return false;" title="Healthcare Access Portal">
          <img src="/logo.png" alt="Healthcare Access Portal · 뉴저지 한인 의료 정보 포털 · NJAP" class="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform group-hover:scale-102" />
        </a>`;

// For forum sidebar / brand link where toggle button might be next to it:
// In forum/components.php:
// <a class="min-w-0 flex items-center gap-2 cursor-pointer njap-brand-link" href="/" ...> ... </a>

for (const relPath of targetFiles) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  // 1. Replace nav brand link
  // Matches <a class="[^"]*njap-brand-link[^"]*" href="/"[\s\S]*?<\/a> inside <nav>
  const navRegex = /<nav[\s\S]*?<\/nav>/;
  const navMatch = content.match(navRegex);
  if (navMatch) {
    const navContent = navMatch[0];
    let updatedNav = navContent;

    // Pattern for brand link inside nav
    const brandLinkRegex = /<a class="[^"]*(?:njap-brand-link|group flex items-center)[^"]*" href="\/" onclick="navigateToHome\(event\); return false;"[^>]*>[\s\S]*?<\/a>/;
    if (brandLinkRegex.test(updatedNav)) {
      updatedNav = updatedNav.replace(brandLinkRegex, newNavBrandLink);
    } else {
      // Alternative pattern without onclick or slightly different
      const altBrandRegex = /<a class="[^"]*(?:flex-shrink-0|min-w-0)[^"]*group flex items-center[^"]*" href="\/"[^>]*>[\s\S]*?<\/a>/;
      if (altBrandRegex.test(updatedNav)) {
        updatedNav = updatedNav.replace(altBrandRegex, newNavBrandLink);
      }
    }

    if (updatedNav !== navContent) {
      content = content.replace(navContent, updatedNav);
      changed = true;
    }
  }

  // 2. Also check footer brand link to use logo-white.png if appropriate
  // <a class="inline-flex items-center gap-3 mb-4 group cursor-pointer njap-brand-link" href="/" onclick="navigateToHome(event); return false;">
  //   <img src="/logo-icon.svg" ... />
  //   <div><span>Healthcare Access Portal</span>...</div>
  // </a>
  const footerBrandRegex = /<a class="[^"]*mb-4 group cursor-pointer njap-brand-link"[^>]*>[\s\S]*?<\/a>/;
  if (footerBrandRegex.test(content)) {
    const footerReplacement = `<a class="inline-flex items-center mb-4 group cursor-pointer njap-brand-link" href="/" onclick="navigateToHome(event); return false;" title="Healthcare Access Portal">
            <img src="/logo-white.png" alt="Healthcare Access Portal · 뉴저지 한인 의료 정보 포털" class="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105" />
          </a>`;
    content = content.replace(footerBrandRegex, footerReplacement);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`[UPDATED] ${relPath}`);
  } else {
    console.log(`[NO CHANGE] ${relPath}`);
  }
}

console.log('Finished updating logo across all pages.');
