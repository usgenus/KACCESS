const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const animStyles = `
  <!-- Logo Animation Styles -->
  <style id="njap-logo-anim-styles">
    @keyframes njapNavKeySlide {
      0% {
        opacity: 0;
        transform: translate(480px, 0);
      }
      15% {
        opacity: 1;
      }
      75% {
        transform: translate(0, 0);
      }
      86% {
        transform: translate(-3.5px, 0);
      }
      100% {
        opacity: 1;
        transform: translate(0, 0);
      }
    }

    @keyframes njapNavKeyholePulse {
      0%, 70% {
        stroke: #DC2626;
        filter: drop-shadow(0 0 0 transparent);
      }
      82% {
        stroke: #EF4444;
        filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.85));
      }
      100% {
        stroke: #DC2626;
        filter: drop-shadow(0 0 0 transparent);
      }
    }

    @keyframes njapNavDoorAppear {
      0% {
        opacity: 0;
        transform: scale(0.96);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes njapNavTextMain {
      0% {
        opacity: 0;
        transform: translate(45px, 0);
      }
      100% {
        opacity: 1;
        transform: translate(0, 0);
      }
    }

    @keyframes njapNavTextSub {
      0% {
        opacity: 0;
        transform: translate(35px, 0);
      }
      100% {
        opacity: 1;
        transform: translate(0, 0);
      }
    }

    .njap-nav-door {
      transform-origin: 40px 45px;
      animation: njapNavDoorAppear 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .njap-nav-key {
      animation: njapNavKeySlide 1.45s cubic-bezier(0.22, 1, 0.36, 1) 0.22s both;
    }

    .njap-nav-keyhole {
      animation: njapNavKeyholePulse 1.6s ease-out 0.22s both;
    }

    .njap-nav-text-main {
      animation: njapNavTextMain 1.0s cubic-bezier(0.16, 1, 0.3, 1) 1.45s both;
    }

    .njap-nav-text-sub {
      animation: njapNavTextSub 1.0s cubic-bezier(0.16, 1, 0.3, 1) 1.75s both;
    }

    @media (prefers-reduced-motion: reduce) {
      .njap-nav-door, .njap-nav-key, .njap-nav-keyhole, .njap-nav-text-main, .njap-nav-text-sub {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
    }
  </style>
`;

const animatedBrandLink = `<a class="flex items-center cursor-pointer njap-brand-link flex-shrink-0 group" href="/" onclick="navigateToHome(event); return false;" title="Healthcare Access Portal">
          <svg class="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform group-hover:scale-102" viewBox="0 0 320 60" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Healthcare Access Portal · 뉴저지 한인 의료 정보 포털 · NJAP" style="overflow: visible;">
            <title>Healthcare Access Portal · 뉴저지 한인 의료 정보 포털 · NJAP</title>
            <!-- Icon Mark (Door + Key + NJAP) -->
            <g transform="translate(4, 2) scale(0.56)" stroke-linecap="round" stroke-linejoin="round">
              <!-- Door Frame & NJAP Text -->
              <g class="njap-nav-door" stroke="#1E3A8A">
                <line x1="20" y1="12" x2="20" y2="88" stroke-width="3.5" />
                <rect x="25" y="12" width="55" height="76" rx="2" stroke-width="4" fill="none" />
                <polyline points="25,16 52,25 52,36" stroke-width="3.5" />
                <text x="52.5" y="81" font-family="'Times New Roman', serif" font-size="13.5" font-weight="900" letter-spacing="1.5" fill="#1E3A8A" stroke="none" text-anchor="middle">NJAP</text>
              </g>
              
              <!-- Keyhole -->
              <path class="njap-nav-keyhole" d="M 43,45 A 7,7 0 1,1 53,45 L 56,64 L 40,64 Z" stroke="#DC2626" stroke-width="3.5" fill="none" />
              
              <!-- Key: enters from right side into the door -->
              <g class="njap-nav-key">
                <circle cx="74" cy="45" r="6.5" stroke="#DC2626" stroke-width="3.5" fill="none" />
                <line x1="47" y1="45" x2="67.5" y2="45" stroke="#DC2626" stroke-width="3.5" />
                <line x1="49" y1="45" x2="49" y2="49" stroke="#DC2626" stroke-width="3.5" />
                <line x1="53" y1="45" x2="53" y2="48" stroke="#DC2626" stroke-width="3" />
              </g>
            </g>

            <!-- Typography: slides in from right after key enters -->
            <g class="njap-nav-text-main">
              <text x="64" y="27" font-family="Pretendard, -apple-system, system-ui, sans-serif" font-size="18" font-weight="900" fill="#0B192C" letter-spacing="-0.5">Healthcare Access Portal</text>
            </g>
            <g class="njap-nav-text-sub">
              <text x="64" y="44" font-family="Pretendard, -apple-system, system-ui, sans-serif" font-size="10.5" font-weight="600" fill="#64748B" letter-spacing="0.2">뉴저지 한인 의료 정보 포털 · NJAP</text>
            </g>
          </svg>
        </a>`;

const targetFiles = [
  'index.php',
  'blog.php',
  'blog.html',
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

let updatedCount = 0;

for (const relPath of targetFiles) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  // 1. Add CSS styles if missing
  if (!content.includes('njapNavKeySlide')) {
    if (content.includes('</head>')) {
      content = content.replace('</head>', animStyles + '\n</head>');
      changed = true;
    }
  }

  // 2. Replace brand link with animated SVG brand link
  // Matches <a ...njap-brand-link...><img src="/logo.png".../></a>
  const brandLinkRegex = /<a class="[^"]*(?:njap-brand-link|group flex items-center)[^"]*" href="\/"[^>]*>[\s\S]*?<img src="\/logo\.png"[^>]*>[\s\S]*?<\/a>/;
  if (brandLinkRegex.test(content)) {
    content = content.replace(brandLinkRegex, animatedBrandLink);
    changed = true;
  } else {
    // Alternative match with generic link containing logo.png inside <nav>
    const navRegex = /<nav[\s\S]*?<\/nav>/;
    const navMatch = content.match(navRegex);
    if (navMatch) {
      let navContent = navMatch[0];
      const linkInsideNavRegex = /<a [^>]*href="\/"[^>]*>[\s\S]*?<img src="\/logo\.png"[^>]*>[\s\S]*?<\/a>/;
      if (linkInsideNavRegex.test(navContent)) {
        const updatedNav = navContent.replace(linkInsideNavRegex, animatedBrandLink);
        content = content.replace(navContent, updatedNav);
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`[UPDATED] ${relPath}`);
    updatedCount++;
  } else {
    console.log(`[ALREADY HAS IT OR NO CHANGE] ${relPath}`);
  }
}

console.log(`Updated ${updatedCount} files with animated logo.`);
