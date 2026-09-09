#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');

function ensureDep(pkg) {
  try { require.resolve(pkg); } catch {
    console.log(`Installing ${pkg}...`);
    execSync(`npm install --no-save ${pkg}`, { cwd: ROOT, stdio: 'inherit' });
  }
}
ensureDep('sharp');
ensureDep('png-to-ico');

const sharp = require('sharp');
const pngToIco = require('png-to-ico').default || require('png-to-ico');

const svgWrapped = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="14" fill="#1e3a5f"/>
  <g stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <line x1="20" y1="12" x2="20" y2="88" stroke="#ffffff" stroke-width="3" />
    <rect x="25" y="12" width="55" height="76" rx="2" stroke="#ffffff" stroke-width="3.5" fill="none" />
    <polyline points="25,16 52,25 52,36" stroke="#ffffff" stroke-width="3.2" />
    <path d="M 43,45 A 7,7 0 1,1 53,45 L 56,64 L 40,64 Z" stroke="#ffffff" stroke-width="3.2" fill="none" />
    <circle cx="74" cy="45" r="6.5" stroke="#ffffff" stroke-width="3.2" fill="none" />
    <line x1="47" y1="45" x2="67.5" y2="45" stroke="#ffffff" stroke-width="3.2" />
    <line x1="49" y1="45" x2="49" y2="49" stroke="#ffffff" stroke-width="3.2" />
    <line x1="53" y1="45" x2="53" y2="48" stroke="#ffffff" stroke-width="2.8" />
    <text x="52.5" y="81" font-family="Times New Roman, serif" font-size="13" font-weight="900" letter-spacing="1.5" fill="#ffffff" stroke="none" text-anchor="middle">NJAP</text>
  </g>
</svg>`;

const svgBuf = Buffer.from(svgWrapped);

async function main() {
  const sizes = [16, 32, 48, 180, 192, 512];
  const pngs = {};

  for (const size of sizes) {
    const outPath = path.join(ROOT, `favicon-${size}.png`);
    await sharp(svgBuf, { density: 300 })
      .resize(size, size)
      .png()
      .toFile(outPath);
    pngs[size] = outPath;
    console.log(`✅ favicon-${size}.png`);
  }

  const icoBufs = await pngToIco([pngs[16], pngs[32], pngs[48]]);
  fs.writeFileSync(path.join(ROOT, 'favicon.ico'), icoBufs);
  console.log('✅ favicon.ico');

  fs.copyFileSync(pngs[180], path.join(ROOT, 'apple-touch-icon.png'));
  fs.copyFileSync(pngs[192], path.join(ROOT, 'favicon-192.png'));
  fs.copyFileSync(pngs[512], path.join(ROOT, 'favicon-512.png'));
  fs.copyFileSync(pngs[32], path.join(ROOT, 'favicon-32.png'));
  fs.copyFileSync(pngs[16], path.join(ROOT, 'favicon-16.png'));
  console.log('✅ apple-touch-icon.png, favicon-192.png, favicon-512.png, favicon-32.png, favicon-16.png');

  for (const size of [16, 32, 48, 180, 192, 512]) {
    try {
      if (fs.existsSync(pngs[size]) && !['favicon-16.png', 'favicon-32.png', 'favicon-192.png', 'favicon-512.png'].includes(path.basename(pngs[size]))) {
        fs.unlinkSync(pngs[size]);
      }
    } catch {}
  }
  console.log('\n Done! favicon.ico + apple-touch-icon.png + favicon-192.png + favicon-512.png + favicon-32.png + favicon-16.png');
}

main().catch(console.error);
