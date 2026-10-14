const fs = require('fs');
const path = require('path');

const heroScriptPath = path.join(__dirname, 'build_homepage_hero.js');
let scriptCode = fs.readFileSync(heroScriptPath, 'utf8');

// 1. Add slides 7 and 8 to defaultSixSlides
const slide7And8 = `  {
    order: 7,
    category: '동호회/동문회',
    title: '동호회/동문회 모임',
    subtitle: '뉴저지 한인 취미·스포츠 클럽, 대학·고교 동문회, 소모임 전용 미니 룸. 우리 모임만의 커뮤니티 공간을 직접 개설하고 회원들과 자유롭게 소통해보세요.',
    mediaType: 'image',
    mediaUrl: '/uploads/images/hero_slide_clubs.jpg',
    linkUrl: '/forum?specialty=clubs',
    linkText: '동호회 둘러보기 →',
    secondaryLinkUrl: '/forum?specialty=clubs',
    secondaryLinkText: '룸 만들기',
    caption: '동호회/동문회 소모임 룸',
    isMainVideo: false
  },
  {
    order: 8,
    category: '뉴저지 파트너즈',
    title: '뉴저지 파트너즈',
    subtitle: '신뢰하는 뉴저지 비지네스를 만나보세요. 병원, 의사, 식당, 쇼핑에서 맛집까지.',
    mediaType: 'image',
    mediaUrl: '/uploads/images/hero_slide_partners.jpg',
    linkUrl: '/partners',
    linkText: '파트너즈 보기 →',
    secondaryLinkUrl: '/partners',
    secondaryLinkText: '입점 문의',
    caption: '신뢰하는 뉴저지 비즈니스',
    isMainVideo: false
  }
];`;

if (!scriptCode.includes("order: 7")) {
  scriptCode = scriptCode.replace(
    /(\{\s*order:\s*6,[\s\S]*?isMainVideo:\s*false\s*\}\s*)\n\];/,
    `$1,\n${slide7And8}`
  );
  console.log('Added Slide 7 & Slide 8 to defaultSixSlides array.');
}

// 2. Update loops and variables
scriptCode = scriptCode.replace(/for \(\$i = 1; \$i <= 6; \$i\+\+\)/g, 'for ($i = 1; $i <= 8; $i++)');
scriptCode = scriptCode.replace(/for \(\$idx = 1; \$idx <= 6; \$idx\+\+\)/g, 'for ($idx = 1; $idx <= 8; $idx++)');
scriptCode = scriptCode.replace(/var totalSlides = 6;/g, 'var totalSlides = 8;');
scriptCode = scriptCode.replace(/<span id="hero-visual-num">01<\/span> \/ 06/g, '<span id="hero-visual-num">01</span> / 08');
scriptCode = scriptCode.replace(/repeat\(6, minmax\(0, 1fr\)\)/g, 'repeat(8, minmax(0, 1fr))');
scriptCode = scriptCode.replace(/slideNum > 6/g, 'slideNum > 8');

// Update tab grid CSS to look clean with 8 tabs
scriptCode = scriptCode.replace(
  /\.hero-tabs-grid\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*repeat\(8,\s*minmax\(0,\s*1fr\)\);\s*gap:\s*8px;/g,
  '.hero-tabs-grid { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 6px;'
);
scriptCode = scriptCode.replace(
  /\.hero-tab-item\s*\{\s*text-align:\s*left;\s*padding:\s*8px\s*12px;/g,
  '.hero-tab-item { text-align: left; padding: 8px 9px;'
);
scriptCode = scriptCode.replace(
  /\.hero-tab-title\s*\{\s*font-size:\s*13px;/g,
  '.hero-tab-title { font-size: 12.5px;'
);

fs.writeFileSync(heroScriptPath, scriptCode, 'utf8');
console.log('Successfully updated build_homepage_hero.js');
