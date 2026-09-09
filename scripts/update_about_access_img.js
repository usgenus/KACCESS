const fs = require('fs');
const path = require('path');

const targetHtml = `<section class="py-20 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="grid grid-cols-1 md:grid-cols-3 gap-8"><div class="p-8 rounded-2xl bg-brand-light border border-brand-border"><span class="text-4xl mb-4 block">🎯</span><h2 class="font-serif text-2xl text-brand-dark mb-3">설립 목적</h2><p class="text-sm font-sans text-brand-muted leading-relaxed">복잡한 정보로 인해 필요한 혜택을 놓치지 않도록 검증된 메디케어, ACA 및 보건 관련 소식을 정확한 한국어로 전달합니다.</p></div><div class="p-8 rounded-2xl bg-brand-light border border-brand-border"><span class="text-4xl mb-4 block">🤝</span><h2 class="font-serif text-2xl text-brand-dark mb-3">커뮤니티 중심</h2><p class="text-sm font-sans text-brand-muted leading-relaxed">뉴저지 지역 한인분들의 목소리에 귀를 기울이며, 개개인 상황에 맞는 맞춤형 혜택 안내와 상담 서비스를 무료로 연계합니다.</p></div><div class="p-8 rounded-2xl bg-brand-light border border-brand-border"><span class="text-4xl mb-4 block">🔒</span><h2 class="font-serif text-2xl text-brand-dark mb-3">신뢰와 객관성</h2><p class="text-sm font-sans text-brand-muted leading-relaxed">공공 기관(CMS, CDC, NJ DHS 등)의 공식 자료에 기초하여 중립적이고 객관적인 정보다만을 다룹니다.</p></div></div></div></section>`;

const replacementHtml = `<section class="py-16 sm:py-24 bg-white border-b border-brand-border"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="max-w-5xl mx-auto flex flex-col items-center"><div class="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2 sm:p-4 transition-all hover:shadow-md"><a href="/access.jpg" target="_blank" title="클릭하여 원본 크기로 보기" class="block w-full cursor-zoom-in"><img src="/access.jpg" alt="헬스케어 액세스 포털 지도 - 통합형 환자 경로" class="w-full h-auto object-contain mx-auto" style="width:100%;max-width:1024px;display:block"/></a></div><p class="text-xs text-slate-400 mt-3 text-center font-sans">※ 이미지를 클릭하시면 고해상도 원본 크기로 크게 보실 수 있습니다.</p></div></div></section>`;

// 1. Update about.html and about/index.html
const htmlFiles = [
  path.join(__dirname, '../about.html'),
  path.join(__dirname, '../about/index.html')
];

htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes(targetHtml)) {
      content = content.replace(targetHtml, replacementHtml);
      fs.writeFileSync(file, content, 'utf8');
      console.log('✅ Replaced in:', file);
    } else {
      console.log('⚠️ Target HTML not found in:', file);
    }
  }
});

// 2. Update _next/static/chunks/191f64lzmub01.js
const jsChunkPath = path.join(__dirname, '../_next/static/chunks/191f64lzmub01.js');
const targetJs = `(0,s.jsx)("section",{className:"py-20 bg-white",children:(0,s.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:(0,s.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-8",children:[(0,s.jsxs)("div",{className:"p-8 rounded-2xl bg-brand-light border border-brand-border",children:[(0,s.jsx)("span",{className:"text-4xl mb-4 block",children:"🎯"}),(0,s.jsx)("h2",{className:"font-serif text-2xl text-brand-dark mb-3",children:"설립 목적"}),(0,s.jsx)("p",{className:"text-sm font-sans text-brand-muted leading-relaxed",children:"복잡한 정보로 인해 필요한 혜택을 놓치지 않도록 검증된 메디케어, ACA 및 보건 관련 소식을 정확한 한국어로 전달합니다."})]}),(0,s.jsxs)("div",{className:"p-8 rounded-2xl bg-brand-light border border-brand-border",children:[(0,s.jsx)("span",{className:"text-4xl mb-4 block",children:"🤝"}),(0,s.jsx)("h2",{className:"font-serif text-2xl text-brand-dark mb-3",children:"커뮤니티 중심"}),(0,s.jsx)("p",{className:"text-sm font-sans text-brand-muted leading-relaxed",children:"뉴저지 지역 한인분들의 목소리에 귀를 기울이며, 개개인 상황에 맞는 맞춤형 혜택 안내와 상담 서비스를 무료로 연계합니다."})]}),(0,s.jsxs)("div",{className:"p-8 rounded-2xl bg-brand-light border border-brand-border",children:[(0,s.jsx)("span",{className:"text-4xl mb-4 block",children:"🔒"}),(0,s.jsx)("h2",{className:"font-serif text-2xl text-brand-dark mb-3",children:"신뢰와 객관성"}),(0,s.jsx)("p",{className:"text-sm font-sans text-brand-muted leading-relaxed",children:"공공 기관(CMS, CDC, NJ DHS 등)의 공식 자료에 기초하여 중립적이고 객관적인 정보다만을 다룹니다."})]})]})})})`;

const replacementJs = `(0,s.jsx)("section",{className:"py-16 sm:py-24 bg-white border-b border-brand-border",children:(0,s.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:(0,s.jsxs)("div",{className:"max-w-5xl mx-auto flex flex-col items-center",children:[(0,s.jsx)("div",{className:"w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2 sm:p-4 transition-all hover:shadow-md",children:(0,s.jsx)("a",{href:"/access.jpg",target:"_blank",title:"클릭하여 원본 크기로 보기",className:"block w-full cursor-zoom-in",children:(0,s.jsx)("img",{src:"/access.jpg",alt:"헬스케어 액세스 포털 지도 - 통합형 환자 경로",className:"w-full h-auto object-contain mx-auto",style:{width:"100%",maxWidth:"1024px",display:"block"}})})}),(0,s.jsx)("p",{className:"text-xs text-slate-400 mt-3 text-center font-sans",children:"※ 이미지를 클릭하시면 고해상도 원본 크기로 크게 보실 수 있습니다."})]})})})`;

if (fs.existsSync(jsChunkPath)) {
  let jsContent = fs.readFileSync(jsChunkPath, 'utf8');
  if (jsContent.includes(targetJs)) {
    jsContent = jsContent.replace(targetJs, replacementJs);
    fs.writeFileSync(jsChunkPath, jsContent, 'utf8');
    console.log('✅ Replaced in React Chunk:', jsChunkPath);
  } else {
    console.log('⚠️ Target JS not found in:', jsChunkPath);
  }
}
