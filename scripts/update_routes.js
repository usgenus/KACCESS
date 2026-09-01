const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'index.html',
  'index.php',
  'medicare.html',
  'medicare/index.html',
  'about.html',
  'about/index.html',
  'blog.html',
  'blog/index.html',
  'tool.html',
  'tool/index.html'
];

filesToUpdate.forEach(relPath => {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');

  // 1. Update the 4 cards in Section 5 (One-stop Patient Services)
  // Card 1: Insurance Matcher
  content = content.replace(
    /<a class="group" href="\/tool">\s*<div[^>]*>\s*<div>\s*<div[^>]*><span[^>]*>🏥<\/span><span[^>]*>INSURANCE MATCHER<\/span><\/div>\s*<h3[^>]*>메디케어 &amp; ACA 자격 진단<\/h3>/g,
    '<a class="group" href="/tool?tab=matcher">\n              <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 h-full flex flex-col justify-between transition-all duration-300 group-hover:border-blue-400/50">\n                <div>\n                  <div class="flex items-center justify-between mb-4"><span class="text-2xl">🏥</span><span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/80">INSURANCE MATCHER</span></div>\n                  <h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">메디케어 &amp; ACA 자격 진단</h3>'
  );

  // Card 2: Calculator
  content = content.replace(
    /<a class="group" href="\/tool">\s*<div[^>]*>\s*<div>\s*<div[^>]*><span[^>]*>🧮<\/span><span[^>]*>CALCULATOR<\/span><\/div>\s*<h3[^>]*>ACA 보험료 보조금 계산기<\/h3>/g,
    '<a class="group" href="/tool?tab=calculator">\n              <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 h-full flex flex-col justify-between transition-all duration-300 group-hover:border-blue-400/50">\n                <div>\n                  <div class="flex items-center justify-between mb-4"><span class="text-2xl">🧮</span><span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/80">CALCULATOR</span></div>\n                  <h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">ACA 보험료 보조금 계산기</h3>'
  );

  // Card 3: Dictionary
  content = content.replace(
    /<a class="group" href="\/tool">\s*<div[^>]*>\s*<div>\s*<div[^>]*><span[^>]*>📖<\/span><span[^>]*>DICTIONARY<\/span><\/div>\s*<h3[^>]*>영-한 의학 용어 사전<\/h3>/g,
    '<a class="group" href="/tool?tab=dictionary">\n              <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 h-full flex flex-col justify-between transition-all duration-300 group-hover:border-blue-400/50">\n                <div>\n                  <div class="flex items-center justify-between mb-4"><span class="text-2xl">📖</span><span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/80">DICTIONARY</span></div>\n                  <h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">영-한 의학 용어 사전</h3>'
  );

  // Card 4: Patient Portal
  content = content.replace(
    /<a class="group" href="\/tool">\s*<div[^>]*>\s*<div>\s*<div[^>]*><span[^>]*>📋<\/span><span[^>]*>PATIENT PORTAL<\/span><\/div>\s*<h3[^>]*>스마트 환자 서비스 &amp; 사전접수<\/h3>/g,
    '<a class="group" href="/tool?tab=portal">\n              <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 h-full flex flex-col justify-between transition-all duration-300 group-hover:border-blue-400/50">\n                <div>\n                  <div class="flex items-center justify-between mb-4"><span class="text-2xl">📋</span><span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/80">PATIENT PORTAL</span></div>\n                  <h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">스마트 환자 서비스 &amp; 사전접수</h3>'
  );

  // 2. Update Footer Links
  content = content.replace(/<a[^>]*href="\/tool"[^>]*>보험 자격 진단<\/a>/g, '<a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/tool?tab=matcher">보험 자격 진단</a>');
  content = content.replace(/<a[^>]*href="\/tool"[^>]*>보조금 계산기<\/a>/g, '<a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/tool?tab=calculator">보조금 계산기</a>');
  content = content.replace(/<a[^>]*href="\/tool"[^>]*>의학 용어 사전<\/a>/g, '<a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/tool?tab=dictionary">의학 용어 사전</a>');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Updated routing links in:', relPath);
});
