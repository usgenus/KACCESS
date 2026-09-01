const fs = require('fs');
const path = require('path');

const toolHtmlMain = `
<main class="flex-1">
  <div class="min-h-[calc(100vh-109px)] bg-slate-50 flex flex-col font-sans pb-16">
    <!-- Top Header -->
    <section class="bg-slate-900 text-white py-10 sm:py-14 border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span class="inline-block text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider mb-3">ONE-STOP HEALTHCARE SERVICES</span>
        <h1 class="font-serif text-3xl sm:text-4xl text-white mb-3">원스톱 의료 접근 &amp; 환자 종합 센터</h1>
        <p class="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed mb-6">보험 자격 진단, 2026 ACA 보조금 계산, 영-한 의학 용어 사전, 스마트 환자 AI 상담 및 병원 사전접수 서비스를 자유롭게 이용하세요.</p>

        <!-- 4 Multi-Tool Tabs -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-4xl">
          <a href="/tool?tab=matcher" class="p-3 sm:p-4 rounded-xl text-left transition-all border bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80 block text-decoration-none">
            <div class="text-xl mb-1">🏥</div>
            <div class="text-xs sm:text-sm font-semibold text-white">1. 자격 진단기</div>
            <div class="text-[11px] opacity-80 hidden sm:block text-slate-400">메디케어 &amp; ACA</div>
          </a>
          <a href="/tool?tab=calculator" class="p-3 sm:p-4 rounded-xl text-left transition-all border bg-blue-600 text-white border-blue-400 shadow-md font-bold block text-decoration-none">
            <div class="text-xl mb-1">🧮</div>
            <div class="text-xs sm:text-sm font-semibold text-white">2. 보조금 계산기</div>
            <div class="text-[11px] opacity-80 hidden sm:block text-blue-100">2026 ACA &amp; NJHPS</div>
          </a>
          <a href="/tool?tab=dictionary" class="p-3 sm:p-4 rounded-xl text-left transition-all border bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80 block text-decoration-none">
            <div class="text-xl mb-1">📖</div>
            <div class="text-xs sm:text-sm font-semibold text-white">3. 의학 용어 사전</div>
            <div class="text-[11px] opacity-80 hidden sm:block text-slate-400">영-한 병원 표현</div>
          </a>
          <a href="/tool?tab=portal" class="p-3 sm:p-4 rounded-xl text-left transition-all border bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80 block text-decoration-none">
            <div class="text-xl mb-1">🤖</div>
            <div class="text-xs sm:text-sm font-semibold text-white">4. AI &amp; 사전접수</div>
            <div class="text-[11px] opacity-80 hidden sm:block text-slate-400">질문센터 &amp; 차트</div>
          </a>
        </div>
      </div>
    </section>

    <!-- Main Tool Body Container -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
      <div id="tool-interactive-root" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
        <!-- Initial Loader / Content before React mounts -->
        <div class="text-center py-12">
          <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p class="text-sm font-bold text-slate-800">도구 로딩 중...</p>
        </div>
      </div>
    </div>
  </div>
</main>
`;

function updateToolHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/<main class="flex-1">[\s\S]*?<\/main>/, toolHtmlMain);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated', filePath);
}

updateToolHtml(path.join(__dirname, '../tool.html'));
updateToolHtml(path.join(__dirname, '../tool/index.html'));
