# -*- coding: utf-8 -*-
"""
Common configurations and template renderers for NJ Access Portal Resource Center
"""

CATEGORIES = [
    {
        "id": "housing",
        "title_ko": "시니어 & 서민 주거",
        "title_en": "Senior & Affordable Housing",
        "icon": "🏢",
        "badge": "타운별 단지·로또 포털",
        "desc": "포트리, 팰팍 등 버겐카운티 타운별 시니어 아파트, HABC 주택청 포털, HUD 202, 서민 주택(LIHTC), 시니어 프리즈(재산세 환급) 및 Stay NJ."
    },
    {
        "id": "financial",
        "title_ko": "재정 지원 & 생활비 보조",
        "title_en": "Financial Assistance & Food Aid",
        "icon": "💵",
        "badge": "식비·공과금 안전망",
        "desc": "소셜시큐리티 연금, SSI/SSDI, 뉴저지 SNAP 푸드스탬프(185% FPL), 난방비(LIHEAP), 유틸리티 요금 감면(라이프라인, NJ SHARES)."
    },
    {
        "id": "medicaid",
        "title_ko": "메디케이드 & NJ 패밀리케어",
        "title_en": "NJ FamilyCare & Medicaid",
        "icon": "🏥",
        "badge": "100% 무료 공공의료",
        "desc": "뉴저지 패밀리케어(138% FPL 성인 확장), ABD 고령·장애인 메디케이드, 롱텀케어(MLTSS), 아동 CHIP 및 MCO 관리보험사 안내."
    },
    {
        "id": "medicaid-specials",
        "title_ko": "특별 메디케이드 & 안전망",
        "title_en": "Medicaid Safety Nets & Specials",
        "icon": "🛡️",
        "badge": "병원비 감면·배우자 보호",
        "desc": "D-SNP 듀얼 플랜, 채리티 케어(Charity Care 자선병원비), 응급 메디케이드, 배우자 빈곤방지(Spousal Impoverishment), 자산환수 규정."
    },
    {
        "id": "prescription",
        "title_ko": "처방약 & 약값 지원",
        "title_en": "Prescription Drug Assistance",
        "icon": "💊",
        "badge": "PAAD·Senior Gold·LIS",
        "desc": "뉴저지 PAAD(제네릭 $5/브랜드 $7), 시니어 골드(Senior Gold), 메디케어 파트 D 저소득 보조금(LIS/Extra Help), MSP 비용 절감."
    },
    {
        "id": "in-home-care",
        "title_ko": "재택 돌봄 & 간병 지원",
        "title_en": "In-Home Care & Caregivers",
        "icon": "🏡",
        "badge": "가족 간병인 급여·도시락",
        "desc": "PPP(개인선호프로그램 - 가족 간병인 시급 지원), JACC(뉴저지 간병 지원), 간병인 휴식(Respite Care), Meals on Wheels 식사 배달."
    },
    {
        "id": "long-term-care",
        "title_ko": "장기 요양 & 주간 데이케어",
        "title_en": "Long-Term Care & Day Centers",
        "icon": "👵",
        "badge": "성인 데이케어·너싱홈",
        "desc": "성인 주간 데이케어(Adult Day Care), 널싱홈 요양원 입원 케어, 재활 및 숙련 간호, 호스피스 완화의료, 롱텀케어 옴부즈맨."
    },
    {
        "id": "legal-rights",
        "title_ko": "권익 보호 & 법률·은퇴 설계",
        "title_en": "Legal Rights, Protection & Retirement",
        "icon": "⚖️",
        "badge": "위임장·사기예방·신탁",
        "desc": "성인보호국(APS), 시니어 보이스피싱/사기 예방, 위임장(POA), 사전의료의향서(Living Will), 유언장, 리빙 트러스트, 시니어 교통."
    }
]

PORTALS = {
    "hud_section202": {
        "img": "/uploads/images/resources/hud_section202_portal.jpg",
        "name": "연방 주택도시개발부(HUD) 시니어 지원 주거 포털",
        "url": "https://www.hud.gov/program_offices/housing/mfh/progdesc/eld202",
        "agency": "U.S. Department of Housing and Urban Development",
        "badge": "연방 HUD 공식 포털"
    },
    "habc_housing": {
        "img": "/uploads/images/resources/habc_housing_portal.jpg",
        "name": "버겐카운티 주택청(HABC) 주거 복지 공식 포털",
        "url": "https://habcnj.org/",
        "agency": "Housing Authority of Bergen County (HABC)",
        "badge": "버겐카운티 공식 주택청"
    },
    "staynj_freeze": {
        "img": "/uploads/images/resources/stay_nj_senior_freeze_portal.jpg",
        "name": "뉴저지 재산세 감면(Stay NJ & Senior Freeze) 통합 접수 포털",
        "url": "https://propertytaxreliefapp.nj.gov/",
        "agency": "NJ Division of Taxation (PAS-1 Property Tax Relief)",
        "badge": "뉴저지 주정부 통합 접수처"
    },
    "nj_taxation": {
        "img": "/uploads/images/resources/nj_taxation_portal.jpg",
        "name": "뉴저지 재무국 재산세 감면(ANCHOR/Freeze) 공식 포털",
        "url": "https://www.nj.gov/treasury/taxation/",
        "agency": "State of New Jersey Department of the Treasury",
        "badge": "뉴저지 주정부 재무국"
    },
    "njhelps": {
        "img": "/uploads/images/resources/njhelps_gov_portal.jpg",
        "name": "뉴저지 주정부 복지 원스톱 통합 포털 (NJHelps)",
        "url": "https://www.njhelps.gov/",
        "agency": "NJ Department of Human Services (DHS)",
        "badge": "뉴저지 주정부 원스톱 포털"
    },
    "ssa": {
        "img": "/uploads/images/resources/ssa_gov_portal.jpg",
        "name": "미국 사회보장국 공식 포털 (my Social Security)",
        "url": "https://www.ssa.gov/",
        "agency": "Social Security Administration (SSA)",
        "badge": "연방 사회보장국 공식"
    },
    "njshares": {
        "img": "/uploads/images/resources/njshares_portal.jpg",
        "name": "NJ SHARES 비상 에너지 및 유틸리티 지원 포털",
        "url": "https://njshares.org/",
        "agency": "New Jersey SHARES Community Relief",
        "badge": "뉴저지 에너지 지원 재단"
    },
    "njfamilycare": {
        "img": "/uploads/images/resources/njfamilycare_portal.jpg",
        "name": "NJ FamilyCare (뉴저지 메디케이드) 온라인 신청 포털",
        "url": "https://njfamilycare.dhs.state.nj.us/",
        "agency": "NJ Division of Medical Assistance & Health Services (DMAHS)",
        "badge": "뉴저지 주정부 메디케이드 공식"
    },
    "getcoverednj": {
        "img": "/uploads/images/resources/getcovered_nj_portal.jpg",
        "name": "GetCoveredNJ - 뉴저지 공식 건강보험 마켓플레이스",
        "url": "https://www.getcovered.nj.gov/",
        "agency": "New Jersey Department of Banking and Insurance (DOBI)",
        "badge": "뉴저지 주정부 공식 마켓"
    },
    "charity_care": {
        "img": "/uploads/images/resources/nj_charity_care_portal.jpg",
        "name": "뉴저지 병원비 감면(Charity Care) 공식 접수 안내 포털",
        "url": "https://www.nj.gov/health/charitycare/",
        "agency": "NJ Department of Health (Hospital Charity Care Program)",
        "badge": "뉴저지 보건국 공식 안전망"
    },
    "paad_seniorgold": {
        "img": "/uploads/images/resources/paad_seniorgold_portal.jpg",
        "name": "뉴저지 저소득층 처방약 지원(PAAD & Senior Gold) 신청 포털",
        "url": "https://www.nj.gov/humanservices/doas/services/paad/",
        "agency": "NJ Division of Aging Services (DoAS)",
        "badge": "뉴저지 고령화서비스국 공식"
    },
    "medicare_gov": {
        "img": "/uploads/images/resources/medicare_gov_portal.jpg",
        "name": "미국 연방 메디케어 공식 포털 (Medicare.gov)",
        "url": "https://www.medicare.gov/",
        "agency": "Centers for Medicare & Medicaid Services (CMS)",
        "badge": "연방 CMS 공식 포털"
    },
    "medicare_compare": {
        "img": "/uploads/images/resources/medicare_plan_finder_portal.jpg",
        "name": "메디케어 플랜 파인더 & 파트 C/D 비교 시스템",
        "url": "https://www.medicare.gov/plan-compare/",
        "agency": "CMS Official Medicare Plan Comparison Portal",
        "badge": "연방 공식 플랜 비교 포털"
    },
    "nj_ppp": {
        "img": "/uploads/images/resources/nj_ppp_caregiver_portal.jpg",
        "name": "뉴저지 개인선호프로그램(PPP) 가족 간병인 지정 포털",
        "url": "https://www.nj.gov/humanservices/dmahs/clients/ppp/",
        "agency": "NJ Department of Human Services - DMAHS PPP",
        "badge": "뉴저지 가족간병 공식 포털"
    },
    "meals_on_wheels": {
        "img": "/uploads/images/resources/meals_on_wheels_portal.jpg",
        "name": "밀스 온 휠스(Meals on Wheels) 미국 공식 식사 배달 포털",
        "url": "https://www.mealsonwheelsamerica.org/",
        "agency": "Meals on Wheels America & Local County Senior Nutrition",
        "badge": "시니어 영양지원 공식"
    },
    "nj_dhs_doas": {
        "img": "/uploads/images/resources/nj_dhs_aging_services_portal.jpg",
        "name": "뉴저지 주정부 고령화서비스국(DoAS) 복지 포털",
        "url": "https://www.nj.gov/humanservices/doas/",
        "agency": "NJ Department of Human Services - Division of Aging Services",
        "badge": "뉴저지 고령화서비스국 공식"
    },
    "bergen_seniors": {
        "img": "/uploads/images/resources/bergen_senior_services_portal.jpg",
        "name": "버겐카운티 노인복지국(Division of Senior Services) 포털",
        "url": "https://www.co.bergen.nj.us/division-of-senior-services",
        "agency": "County of Bergen - Division of Senior Services",
        "badge": "버겐카운티 노인복지국 공식"
    },
    "nj_consumer_scam": {
        "img": "/uploads/images/resources/nj_consumer_affairs_scam_portal.jpg",
        "name": "뉴저지 소비자보호국 시니어 금융사기 방지 포털",
        "url": "https://www.njconsumeraffairs.gov/",
        "agency": "NJ Division of Consumer Affairs - Senior Protection",
        "badge": "뉴저지 소비자보호국 공식"
    },
    "nj_courts": {
        "img": "/uploads/images/resources/nj_courts_legal_portal.jpg",
        "name": "뉴저지 주법원 법률 양식 및 대리권(POA) 공증 가이드 포털",
        "url": "https://www.njcourts.gov/",
        "agency": "New Jersey Courts Legal Self-Help Center",
        "badge": "뉴저지 주법원 공식 포털"
    },
    "nj211": {
        "img": "/uploads/images/resources/nj211_portal.jpg",
        "name": "NJ 2-1-1 지역사회 보건복지 지원 네트워크 포털",
        "url": "https://www.nj211.org/",
        "agency": "NJ 2-1-1 Health & Human Services Network",
        "badge": "뉴저지 공식 복지 핫라인"
    }
}

def render_portal_mockup(p):
    return f"""
  <!-- Official Application & Resource Website Screenshot Card -->
  <div class="rc-portal-mockup-card">
    <div class="rc-portal-mockup-bar">
      <div class="rc-portal-mockup-dots">
        <span class="rc-dot rc-dot-red"></span>
        <span class="rc-dot rc-dot-yellow"></span>
        <span class="rc-dot rc-dot-green"></span>
      </div>
      <div class="rc-portal-mockup-url">
        <svg width="14" height="14" style="width:14px;height:14px;min-width:14px;max-width:14px;display:inline-block;vertical-align:middle;margin-right:6px;color:#10b981;flex-shrink:0;" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd"></path></svg>
        <span>{p['url']}</span>
      </div>
      <a href="{p['url']}" target="_blank" rel="noopener noreferrer" class="rc-portal-mockup-btn">
        공식 포털 바로가기 &rarr;
      </a>
    </div>
    <div class="rc-portal-mockup-img-wrap">
      <img src="{p['img']}" alt="{p['name']}" class="rc-portal-mockup-img" loading="lazy" />
    </div>
    <div class="rc-portal-mockup-caption">
      <div class="flex items-center gap-2">
        <span class="rc-portal-badge-verified">{p['badge']}</span>
        <span class="text-xs text-slate-800 font-bold">{p['name']}</span>
      </div>
      <span class="text-[11px] text-slate-500 hidden sm:inline">{p['agency']}</span>
    </div>
  </div>
"""

def render_redesigned_chart(title, badge, headers, rows, footnote):
    th_html = "".join([f"<th>{h}</th>" for h in headers])
    tr_html = ""
    for r in rows:
        td_html = "".join([f"<td>{cell}</td>" for cell in r])
        tr_html += f"<tr>{td_html}</tr>\n"
    
    return f"""
  <!-- Modern Redesigned Data Chart -->
  <div class="rc-redesigned-chart-card">
    <div class="rc-chart-card-header">
      <span class="rc-chart-card-title">{title}</span>
      <span class="rc-chart-card-badge">{badge}</span>
    </div>
    <div class="rc-chart-table-wrap">
      <table class="rc-chart-table">
        <thead>
          <tr>
            {th_html}
          </tr>
        </thead>
        <tbody>
          {tr_html}
        </tbody>
      </table>
    </div>
    <div class="rc-chart-footnote">
      <span>💡 {footnote}</span>
      <span class="text-blue-700 font-bold">2026/2027 뉴저지 공식 기준</span>
    </div>
  </div>
"""

def render_article_html(cat_title, title, portal_key, exec_summary, chart_info, sections, checklist, tips, contacts):
    portal = PORTALS.get(portal_key, PORTALS['njhelps'])
    portal_html = render_portal_mockup(portal)
    chart_html = render_redesigned_chart(
        chart_info['title'],
        chart_info['badge'],
        chart_info['headers'],
        chart_info['rows'],
        chart_info['footnote']
    )
    
    summary_li = "".join([f"<li><strong>{k}:</strong> {v}</li>" for k, v in exec_summary.items()])
    
    body_sections_html = ""
    for sec in sections:
        body_sections_html += f"""
    <h4 class="rc-guide-h4">{sec['heading']}</h4>
    {sec['content']}
"""

    chk_li = "".join([f"<li><strong>{item['doc']}:</strong> {item['desc']}</li>" for item in checklist])
    tips_li = "".join([f"<li><strong>{tip['title']}:</strong> {tip['desc']}</li>" for tip in tips])
    contact_li = "".join([f"<li><strong>{con['name']}:</strong> {con['val']}</li>" for con in contacts])

    return f"""
<div class="rc-rewritten-guide">
  <!-- Executive Research Briefing Header -->
  <div class="rc-briefing-header">
    <div class="rc-briefing-tag">{cat_title} · 2026/2027 정책 분석 및 실무 가이드</div>
    <h2 class="rc-briefing-title">{title}</h2>
    <p class="rc-briefing-sub">뉴저지 한인 동포 및 시니어 가정을 위한 공식 수혜 자격, 소득 기준, 단계별 신청 로드맵</p>
  </div>

  {portal_html}

  <!-- Key Takeaways Callout Box -->
  <div class="rc-callout-box">
    <div class="rc-callout-header">
      <strong>핵심 브리핑 (Executive Summary)</strong>
    </div>
    <ul class="rc-callout-list">
      {summary_li}
    </ul>
  </div>

  {chart_html}

  <!-- Body Content -->
  <div class="rc-guide-body-content">
    {body_sections_html}

    <h4 class="rc-guide-h4">뉴저지 거주민 필수 구비 서류 체크리스트</h4>
    <p>신청 시 서류 누락으로 인한 심사 지연을 방지하기 위해 다음 서류를 사전에 원본 및 PDF 사본으로 준비하시기 바랍니다.</p>
    <ul class="rc-guide-list">
      {chk_li}
    </ul>

    <h4 class="rc-guide-h4">뉴저지 한인 동포를 위한 실무 팁 및 반려 방지 가이드</h4>
    <ul class="rc-guide-list">
      {tips_li}
    </ul>

    <h4 class="rc-guide-h4">공식 문의처 및 접수 안내</h4>
    <ul class="rc-guide-list">
      {contact_li}
    </ul>
  </div>

  <!-- Official Assistance Notice Box -->
  <div class="rc-notice-box">
    <div class="rc-notice-title">💡 뉴저지 한인 동포를 위한 신청 안내</div>
    <p class="rc-notice-text">
      본 가이드는 2026/2027 뉴저지 주정부 보건복지국(DHS) 및 연방 보건복지부(HHS) 공식 규정을 바탕으로 연구·정리된 신뢰성 높은 정보입니다. 가구 구성원의 체류 신분(시민권, 영주권, 비이민비자 등)이나 카운티별 추가 공제 항목에 따라 수혜 자격이 달라질 수 있으므로, 신청 전 뉴저지 한인 의료접근포털(NJAP) 1:1 카카오톡 상담을 통해 사전 자격 진단을 받아보시기 바랍니다.
    </p>
    <div class="rc-notice-actions">
      <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="rc-action-btn rc-action-btn-kakao">
        카카오톡 1:1 무료 상담 연결 &rarr;
      </a>
      <button type="button" onclick="window.print()" class="rc-action-btn rc-action-btn-print">
        이 가이드 인쇄 / PDF 저장
      </button>
    </div>
  </div>
</div>
"""
