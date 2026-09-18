const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = '/Users/ejyoon/Desktop/KACCESS';
const outDir = path.join(rootDir, 'exported_logos');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Read base SVGs
const rawLogoSvg = fs.readFileSync(path.join(rootDir, 'logo.svg'), 'utf8');
const rawLogoWhiteSvg = fs.readFileSync(path.join(rootDir, 'logo-white.svg'), 'utf8');
const rawIconSvg = fs.readFileSync(path.join(rootDir, 'logo-icon.svg'), 'utf8');

// Colorized Icon SVG (Matches brand colors from logo.svg: Blue door + Red key)
const colorIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <!-- Left double frame margin line -->
  <line x1="20" y1="12" x2="20" y2="88" stroke="#1E3A8A" stroke-width="3.2" />
  
  <!-- Outer Door Frame -->
  <rect x="25" y="12" width="55" height="76" rx="2" stroke="#1E3A8A" stroke-width="3.8" fill="none" />
  
  <!-- Inner Open Door Perspective Lines -->
  <polyline points="25,16 52,25 52,36" stroke="#1E3A8A" stroke-width="3.2" />
  
  <!-- Keyhole -->
  <path d="M 43,45 A 7,7 0 1,1 53,45 L 56,64 L 40,64 Z" stroke="#DC2626" stroke-width="3.2" fill="none" />
  
  <!-- Key -->
  <circle cx="74" cy="45" r="6.5" stroke="#DC2626" stroke-width="3.2" fill="none" />
  <line x1="47" y1="45" x2="67.5" y2="45" stroke="#DC2626" stroke-width="3.2" />
  <line x1="49" y1="45" x2="49" y2="49" stroke="#DC2626" stroke-width="3.2" />
  <line x1="53" y1="45" x2="53" y2="48" stroke="#DC2626" stroke-width="2.8" />
  
  <!-- NJAP Typography -->
  <text x="52.5" y="81" font-family="'Times New Roman', serif" font-size="13" font-weight="900" letter-spacing="1.5" fill="#1E3A8A" stroke="none" text-anchor="middle">NJAP</text>
</svg>`;

// White Icon SVG (for dark backgrounds)
const whiteIconSvg = rawIconSvg
  .replace(/stroke="currentColor"/g, 'stroke="#FFFFFF"')
  .replace(/fill="currentColor"/g, 'fill="#FFFFFF"');

// Black Icon SVG
const blackIconSvg = rawIconSvg
  .replace(/stroke="currentColor"/g, 'stroke="#0B192C"')
  .replace(/fill="currentColor"/g, 'fill="#0B192C"');

function renderSvgToPng(svgContent, width, height, outPngPath) {
  const tempSvgPath = path.join('/tmp', `temp_${Date.now()}_${Math.random().toString(36).slice(2)}.svg`);
  let sizedSvg = svgContent
    .replace(/width="[^"]*"/, `width="${width}"`)
    .replace(/height="[^"]*"/, `height="${height}"`);
  
  // Ensure width & height attributes exist
  if (!sizedSvg.includes('width=')) {
    sizedSvg = sizedSvg.replace('<svg', `<svg width="${width}" height="${height}"`);
  }
  
  fs.writeFileSync(tempSvgPath, sizedSvg, 'utf8');
  execSync(`sips -s format png "${tempSvgPath}" --out "${outPngPath}"`, { stdio: 'pipe' });
  try { fs.unlinkSync(tempSvgPath); } catch(e) {}
}

const exportTasks = [
  // 1. Full Horizontal Logo (Standard & Retina)
  { svg: rawLogoSvg, w: 1280, h: 240, filename: 'logo.png' }, // Primary high-res
  { svg: rawLogoSvg, w: 640,  h: 120, filename: 'logo@2x.png' },
  { svg: rawLogoSvg, w: 320,  h: 60,  filename: 'logo@1x.png' },
  { svg: rawLogoSvg, w: 2560, h: 480, filename: 'logo-hd.png' }, // Ultra high-res (print/press)

  // 2. Full Horizontal Logo - White (for dark mode/backgrounds)
  { svg: rawLogoWhiteSvg, w: 1280, h: 240, filename: 'logo-white.png' },
  { svg: rawLogoWhiteSvg, w: 640,  h: 120, filename: 'logo-white@2x.png' },
  { svg: rawLogoWhiteSvg, w: 2560, h: 480, filename: 'logo-white-hd.png' },

  // 3. Logo Icon (Color: Blue + Red brand emblem)
  { svg: colorIconSvg, w: 1024, h: 1024, filename: 'logo-icon-1024.png' },
  { svg: colorIconSvg, w: 512,  h: 512,  filename: 'logo-icon.png' }, // Primary square emblem
  { svg: colorIconSvg, w: 256,  h: 256,  filename: 'logo-icon-256.png' },
  { svg: colorIconSvg, w: 128,  h: 128,  filename: 'logo-icon-128.png' },
  { svg: colorIconSvg, w: 64,   h: 64,   filename: 'logo-icon-64.png' },
  { svg: colorIconSvg, w: 32,   h: 32,   filename: 'logo-icon-32.png' },

  // 4. Logo Icon (White for dark backgrounds)
  { svg: whiteIconSvg, w: 512,  h: 512,  filename: 'logo-icon-white.png' },
  { svg: whiteIconSvg, w: 1024, h: 1024, filename: 'logo-icon-white-1024.png' },

  // 5. Logo Icon (Black / Dark Navy)
  { svg: blackIconSvg, w: 512,  h: 512,  filename: 'logo-icon-black.png' }
];

console.log('Generating PNG logos with CoreGraphics...');
exportTasks.forEach(task => {
  const targetPath = path.join(outDir, task.filename);
  renderSvgToPng(task.svg, task.w, task.h, targetPath);
  console.log(`✓ Generated ${task.filename} (${task.w}x${task.h}px)`);
});

// Also copy primary high-res logos to project root for easy access & web hosting
fs.copyFileSync(path.join(outDir, 'logo.png'), path.join(rootDir, 'logo.png'));
fs.copyFileSync(path.join(outDir, 'logo-white.png'), path.join(rootDir, 'logo-white.png'));
fs.copyFileSync(path.join(outDir, 'logo-icon.png'), path.join(rootDir, 'logo-icon.png'));
console.log('✓ Copied primary logo.png, logo-white.png, logo-icon.png to project root.');
