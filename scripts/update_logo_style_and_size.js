const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

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

let updated = 0;

for (const relPath of targetFiles) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  let replaced = false;

  if (content.includes('<style id="njap-logo-anim-styles">')) {
    // Replace the existing block
    content = content.replace(
      /<style id="njap-logo-anim-styles">[\s\S]*?<\/style>/,
      unifiedStyle.trim()
    );
    replaced = true;
  } else if (relPath === 'forum/components.php') {
    // Insert into forum/components.php at the start of render_forum_header
    content = content.replace(
      /function render_forum_header\(string \$searchQuery = '', \?array \$currentSpecialty = null\) \{\s*\?>/,
      `function render_forum_header(string $searchQuery = '', ?array $currentSpecialty = null) {\n?>\n${unifiedStyle}`
    );
    replaced = true;
  }

  // Ensure any lingering 480px is 335px
  if (content.includes('480px')) {
    content = content.replace(/translate\(480px,\s*0\)/g, 'translate(335px, 0)');
    replaced = true;
  }

  if (replaced) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('[UPDATED]', relPath);
    updated++;
  } else {
    console.log('[SKIPPED]', relPath);
  }
}

console.log(`Finished updating ${updated} files.`);
