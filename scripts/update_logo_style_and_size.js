const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const targetFiles = [
  'index.php',
  'index.html',
  'ko/index.html',
  'resource-center.html',
  'medicare.html',
  'medicare/index.html',
  'blog.php',
  'blog.html',
  'blog-post.php',
  'ko/blog-post.php',
  'senior-care.php',
  'senior-care.html',
  'senior-care/index.html',
  'tool.html',
  'tool/index.html',
  'about.html',
  'about/index.html',
  'calculator.html',
  'dictionary.html',
  'matcher.html',
  'the-health-bridge.html',
  'the-health-bridge.php',
  'the-health-bridge/index.html',
  'forum/components.php',
  'ko/forum/components.php',
  '404.html',
  '_not-found.html'
];

const unifiedStyle = `  <style id="njap-logo-anim-styles">
    .njap-brand-link {
      display: inline-flex !important;
      align-items: center !important;
      flex-shrink: 0 !important;
    }
    .njap-brand-link img,
    .njap-brand-link svg {
      height: 52px !important;
      max-height: 54px !important;
      width: auto !important;
      object-fit: contain !important;
    }
    @media (max-width: 640px) {
      .njap-brand-link img,
      .njap-brand-link svg {
        height: 40px !important;
        max-height: 42px !important;
        width: auto !important;
      }
    }
    @media (max-width: 375px) {
      .njap-brand-link img,
      .njap-brand-link svg {
        height: 34px !important;
        max-height: 36px !important;
      }
    }

    /* ============================================================
       NAVBAR BRAND LOGO INLINE ANIMATION
       - Door: visible & stable with subtle gentle entry
       - Key: moves smoothly from right side into the door keyhole
       - Keyhole: subtle light glow reaction when key enters
       - Texts: sequentially slide in from the right after key enters
       - Stays as is permanently
       ============================================================ */
    @keyframes njapNavKeySlide {
      0% {
        opacity: 0;
        transform: translate(670px, 0);
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
      animation: njapNavKeySlide 2.18s cubic-bezier(0.22, 1, 0.36, 1) 0.22s both;
    }

    .njap-nav-keyhole {
      animation: njapNavKeyholePulse 2.4s ease-out 0.22s both;
    }

    .njap-nav-text-main {
      animation: njapNavTextMain 1.0s cubic-bezier(0.16, 1, 0.3, 1) 2.18s both;
    }

    .njap-nav-text-sub {
      animation: njapNavTextSub 1.0s cubic-bezier(0.16, 1, 0.3, 1) 2.48s both;
    }

    @media (prefers-reduced-motion: reduce) {
      .njap-nav-door, .njap-nav-key, .njap-nav-keyhole, .njap-nav-text-main, .njap-nav-text-sub {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
    }
  </style>`;

const animatedSvg = `<svg class="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform group-hover:scale-102" viewBox="0 0 320 60" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NJ Access Portal · 뉴저지 한인 의료접근포털" style="overflow: visible;">
            <title>NJ Access Portal · 뉴저지 한인 의료접근포털</title>
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
              <text x="64" y="27" font-family="Pretendard, -apple-system, system-ui, sans-serif" font-size="18" font-weight="900" fill="#0B192C" letter-spacing="-0.5">NJ Access Portal</text>
            </g>
            <g class="njap-nav-text-sub">
              <text x="64" y="44" font-family="Pretendard, -apple-system, system-ui, sans-serif" font-size="10.5" font-weight="600" fill="#64748B" letter-spacing="0.2">뉴저지 한인 의료접근포털</text>
            </g>
          </svg>`;

let updated = 0;

for (const relPath of targetFiles) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  let replaced = false;

  // 1. Update or inject style block
  if (content.includes('<style id="njap-logo-anim-styles">')) {
    content = content.replace(
      /<style id="njap-logo-anim-styles">[\s\S]*?<\/style>/,
      unifiedStyle.trim()
    );
    replaced = true;
  } else if (relPath.includes('forum/components.php')) {
    content = content.replace(
      /function render_forum_header\(string \$searchQuery = '', \?array \$currentSpecialty = null\) \{\s*\?>/,
      `function render_forum_header(string $searchQuery = '', ?array $currentSpecialty = null) {\n?>\n${unifiedStyle}`
    );
    replaced = true;
  } else if (content.includes('</head>')) {
    content = content.replace('</head>', `${unifiedStyle}\n</head>`);
    replaced = true;
  }

  // 2. Ensure translate(670px, 0) is used everywhere
  if (content.includes('translate(480px, 0)')) {
    content = content.replace(/translate\(480px,\s*0\)/g, 'translate(670px, 0)');
    replaced = true;
  }
  if (content.includes('translate(335px, 0)')) {
    content = content.replace(/translate\(335px,\s*0\)/g, 'translate(670px, 0)');
    replaced = true;
  }

  // 3. For any navbar brand link that has old static SVG, upgrade to animated SVG
  if (content.includes('njap-brand-link')) {
    // If brand link contains SVG without njap-nav-door
    const brandRegex = /(<a\s+class="[^"]*njap-brand-link[^"]*"[^>]*>)(\s*<svg[\s\S]*?<\/svg>)/g;
    content = content.replace(brandRegex, (match, openA, svgContent) => {
      if (!svgContent.includes('njap-nav-door') || !svgContent.includes('njap-nav-key')) {
        replaced = true;
        return `${openA}\n          ${animatedSvg.trim()}`;
      }
      return match;
    });
  }

  if (replaced) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('[UPDATED]', relPath);
    updated++;
  } else {
    console.log('[OK]', relPath);
  }
}

console.log(`Finished updating ${updated} files.`);
