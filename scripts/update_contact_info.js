const fs = require('fs');
const path = require('path');

// 1. Update 191f64lzmub01.js (React Client Component for /about)
const aboutBundlePath = path.join(__dirname, '../_next/static/chunks/191f64lzmub01.js');
let bundleCode = fs.readFileSync(aboutBundlePath, 'utf8');

// Replace the contact info box in React bundle
const oldReactBox = `(0,s.jsxs)("div",{className:"p-8 rounded-2xl bg-brand-darker text-white",children:[(0,s.jsx)("h3",{className:"font-serif text-2xl mb-4",children:"센터 위치 & 정보"}),(0,s.jsxs)("ul",{className:"space-y-4 font-sans text-sm text-white/80",children:[(0,s.jsxs)("li",{className:"flex items-start gap-3",children:[(0,s.jsx)("span",{children:"📍"}),(0,s.jsxs)("span",{children:["123 Main Street, Suite 400",(0,s.jsx)("br",{}),"Fort Lee, NJ 07024"]})]}),(0,s.jsxs)("li",{className:"flex items-center gap-3",children:[(0,s.jsx)("span",{children:"📞"}),(0,s.jsx)("span",{children:"1-800-999-7200 (한국어 상담 전용)"})]}),(0,s.jsxs)("li",{className:"flex items-center gap-3",children:[(0,s.jsx)("span",{children:"✉️"}),(0,s.jsx)("span",{children:"info@njaccesscenter.org"})]}),(0,s.jsxs)("li",{className:"flex items-center gap-3",children:[(0,s.jsx)("span",{children:"⏰"}),(0,s.jsx)("span",{children:"월 - 금: 오전 9시 - 오후 5시 (EST)"})]})]})]})`;

const newReactBox = `(0,s.jsxs)("div",{className:"p-8 rounded-2xl bg-brand-darker text-white",children:[(0,s.jsx)("h3",{className:"font-serif text-2xl mb-4",children:"문의 및 안내"}),(0,s.jsxs)("ul",{className:"space-y-4 font-sans text-sm text-white/80",children:[(0,s.jsxs)("li",{className:"flex items-center gap-3",children:[(0,s.jsx)("span",{children:"✉️"}),(0,s.jsxs)("span",{children:[(0,s.jsx)("strong",{children:"이메일: "}),(0,s.jsx)("a",{href:"mailto:njaccessportal@gmail.com",className:"text-blue-300 hover:underline",children:"njaccessportal@gmail.com"})]})]}),(0,s.jsxs)("li",{className:"flex items-center gap-3",children:[(0,s.jsx)("span",{children:"⏰"}),(0,s.jsx)("span",{children:"월 - 금: 오전 9시 - 오후 5시 (EST)"})]})]})]})`;

bundleCode = bundleCode.replace(oldReactBox, newReactBox);
fs.writeFileSync(aboutBundlePath, bundleCode, 'utf8');
console.log('Updated 191f64lzmub01.js');

// 2. Update about.html and about/index.html
const aboutFiles = [
  path.join(__dirname, '../about.html'),
  path.join(__dirname, '../about/index.html')
];

const oldHtmlBox = `<div class="p-8 rounded-2xl bg-brand-darker text-white"><h3 class="font-serif text-2xl mb-4">센터 위치 &amp; 정보</h3><ul class="space-y-4 font-sans text-sm text-white/80"><li class="flex items-start gap-3"><span>📍</span><span>123 Main Street, Suite 400<br/>Fort Lee, NJ 07024</span></li><li class="flex items-center gap-3"><span>📞</span><span>1-800-999-7200 (한국어 상담 전용)</span></li><li class="flex items-center gap-3"><span>✉️</span><span>info@njaccesscenter.org</span></li><li class="flex items-center gap-3"><span>⏰</span><span>월 - 금: 오전 9시 - 오후 5시 (EST)</span></li></ul></div>`;

const newHtmlBox = `<div class="p-8 rounded-2xl bg-brand-darker text-white"><h3 class="font-serif text-2xl mb-4">문의 및 안내</h3><ul class="space-y-4 font-sans text-sm text-white/80"><li class="flex items-center gap-3"><span>✉️</span><span><strong>이메일:</strong> <a href="mailto:njaccessportal@gmail.com" class="text-blue-300 hover:underline">njaccessportal@gmail.com</a></span></li><li class="flex items-center gap-3"><span>⏰</span><span>월 - 금: 오전 9시 - 오후 5시 (EST)</span></li></ul></div>`;

aboutFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(oldHtmlBox, newHtmlBox);
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated', f);
  }
});

// 3. Update cms-client.js
const cmsClientPath = path.join(__dirname, '../js/cms-client.js');
if (fs.existsSync(cmsClientPath)) {
  let cms = fs.readFileSync(cmsClientPath, 'utf8');
  cms = cms.replace(/1-800-999-7200/g, 'njaccessportal@gmail.com');
  cms = cms.replace(/info@njaccesscenter.org/g, 'njaccessportal@gmail.com');
  fs.writeFileSync(cmsClientPath, cms, 'utf8');
  console.log('Updated js/cms-client.js');
}
