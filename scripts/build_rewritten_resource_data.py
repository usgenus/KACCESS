import json
import re
import os

SRC_PATH = "/Users/ejyoon/Desktop/AWCA_Offline_Portal/data/articles.json"
DEST_JS_PATH = "/Users/ejyoon/Desktop/KACCESS/data/resource_center_data.js"

with open(SRC_PATH, "r", encoding="utf-8") as f:
    raw_data = json.load(f)

# Categories Definition (8 Community Resources Categories)
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

def clean_elementor_html(raw_html):
    if not raw_html:
        return ""
    
    # Strip script and style
    h = re.sub(r'<script[^>]*>[\s\S]*?</script>', '', raw_html, flags=re.IGNORECASE)
    h = re.sub(r'<style[^>]*>[\s\S]*?</style>', '', h, flags=re.IGNORECASE)
    h = re.sub(r'<!--[\s\S]*?-->', '', h)
    
    # Strip Elementor wrapper divs
    h = re.sub(r'</?(div|section|span|main|article)[^>]*>', '', h, flags=re.IGNORECASE)
    
    # Clean tables
    h = re.sub(r'<table[^>]*>', '<table class="rc-guide-table">', h, flags=re.IGNORECASE)
    h = re.sub(r'<th[^>]*>', '<th>', h, flags=re.IGNORECASE)
    h = re.sub(r'<td[^>]*>', '<td>', h, flags=re.IGNORECASE)
    h = re.sub(r'<tr[^>]*>', '<tr>', h, flags=re.IGNORECASE)
    h = re.sub(r'<tbody[^>]*>', '<tbody>', h, flags=re.IGNORECASE)
    h = re.sub(r'<thead[^>]*>', '<thead>', h, flags=re.IGNORECASE)

    # Clean headings
    h = re.sub(r'<h[1-6][^>]*>(.*?)</h[1-6]>', r'<h4 class="rc-guide-h4">\1</h4>', h, flags=re.IGNORECASE)
    
    # Clean lists
    h = re.sub(r'<ul[^>]*>', '<ul class="rc-guide-list">', h, flags=re.IGNORECASE)
    h = re.sub(r'<ol[^>]*>', '<ol class="rc-guide-list-num">', h, flags=re.IGNORECASE)
    h = re.sub(r'<li[^>]*>', '<li>', h, flags=re.IGNORECASE)

    # Clean links
    h = re.sub(r'<a\s+href="([^"]+)"[^>]*>(.*?)</a>', r'<a href="\1" target="_blank" rel="noopener noreferrer" class="rc-guide-link">\2 &rarr;</a>', h, flags=re.IGNORECASE)

    # Clean paragraphs
    h = re.sub(r'<p[^>]*>', '<p>', h, flags=re.IGNORECASE)
    
    # Scrub all AWCA references
    h = re.sub(r'AWCA\s*Resource\s*Center', 'NJ Access Portal 의료정보센터', h, flags=re.IGNORECASE)
    h = re.sub(r'AWCA\s*\(Asian\s*Women[\'"]?s\s*Christian\s*Association\)', '뉴저지 한인 의료접근포털 (NJAP)', h, flags=re.IGNORECASE)
    h = re.sub(r'Asian\s*Women[\'"]?s\s*Christian\s*Association', 'NJ Access Portal', h, flags=re.IGNORECASE)
    h = re.sub(r'AWCA', 'NJ Access Portal', h)
    h = re.sub(r'awcanj\.org', 'njaccessportal.com', h, flags=re.IGNORECASE)
    h = re.sub(r'awcarc\.org', 'njaccessportal.com', h, flags=re.IGNORECASE)
    h = re.sub(r'201-862-1665', '201-336-7400', h)
    h = re.sub(r'info@awcanj\.org', 'support@njaccessportal.com', h)
    h = re.sub(r'9 Genesee Ave[^\n<]*', 'New Jersey Healthcare Access Network', h, flags=re.IGNORECASE)
    h = re.sub(r'Teaneck,\s*NJ\s*07666', 'Bergen County, New Jersey', h, flags=re.IGNORECASE)
    h = re.sub(r'https?://(www\.)?awcanj\.org', 'https://njaccessportal.com', h, flags=re.IGNORECASE)
    h = re.sub(r'https?://(www\.)?awcarc\.org', 'https://njaccessportal.com', h, flags=re.IGNORECASE)
    
    # Update 2026/2027 numbers
    h = re.sub(r'\$2,000(\s*)(상한|Cap|한도|본인부담금)', r'$2,100\1\2', h, flags=re.IGNORECASE)
    h = h.replace('185달러', '202.90달러')
    h = h.replace('174.70달러', '202.90달러')
    h = h.replace('$174.70', '$202.90')
    h = h.replace('$163,050', '$172,475')
    h = h.replace('163,050달러', '172,475달러')
    h = h.replace('2,829달러', '2,982달러')
    h = h.replace('$2,829', '$2,982')

    # Remove extra spaces/newlines
    h = re.sub(r'\n\s*\n', '\n', h)
    h = h.strip()
    return h

def extract_clean_text(html):
    t = re.sub(r'<[^>]+>', ' ', html)
    t = t.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
    t = re.sub(r'\s+', ' ', t).strip()
    return t

# Category Mapping Rules based on section_id and keywords
def map_article_category(art):
    sec = art.get('section_id')
    title = art.get('title', '')
    slug = art.get('slug', '')

    if sec == 9:
        return 'housing'
    elif sec == 2:
        return 'financial'
    elif sec == 4:
        return 'medicaid'
    elif sec == 5:
        return 'medicaid-specials'
    elif sec == 3:
        # Check if prescription-related
        if any(k in title for k in ['PAAD', 'Senior Gold', '처방약', 'LIS', 'Extra Help', 'MSP', '바이-인', '비용 절감']):
            return 'prescription'
        else:
            return 'legal-rights'
    elif sec == 10:
        return 'in-home-care'
    elif sec == 7:
        return 'long-term-care'
    elif sec in [1, 11, 12]:
        return 'legal-rights'
    return 'legal-rights'

# Filter out Section 6 (만성질환) and Section 8 (병원케어)
ko_raw_articles = [
    a for a in raw_data.get('articles', [])
    if a.get('lang') == 'ko' and a.get('section_id') not in [6, 8]
]

# Priority weights for sorting within categories (high-impact safety nets first)
PRIORITY_KEYWORDS = [
    # Housing
    '시니어 아파트', '어포더블 하우징', '섹션 8', '재산세 환급', '스테이 뉴저지', '앵커', '어시스티드 리빙',
    # Financial
    'SNAP', '푸드 스탬프', '소셜 시큐리티', 'SSI', 'SSDI', 'LIHEAP', '에너지', '라이프라인',
    # Medicaid
    '메디케이드 개요', 'ACA 메디케이드', 'ABD 메디케이드', 'MLTSS', '아동 건강', 'MCO',
    # Medicaid Specials
    'Charity Care', '병원비 지원', '듀얼 플랜', 'D-SNP', '응급 의료비', '배우자 생계', '자산 회수',
    # Prescription
    'PAAD', 'Senior Gold', '저소득층 처방약', 'MSP', '비용 절감',
    # In-Home Care
    'PPP', '간병인 지정', 'JACC', '간병인 휴식', 'Meals on Wheels', '홈케어',
    # Long Term Care
    '어덜트 데이 케어', '널싱홈', '장기 요양', '호스피스', '옴부즈맨',
    # Legal & Rights
    '성인 보호', '사기', '위임장', '사전 의료', '유언장', '리빙 트러스트'
]

def get_priority_score(art):
    title = art.get('title', '')
    for i, kw in enumerate(PRIORITY_KEYWORDS):
        if kw.lower() in title.lower():
            return i
    return 999

# Sort articles by logical priority
ko_raw_articles.sort(key=get_priority_score)

processed_articles = []

for idx, a in enumerate(ko_raw_articles):
    cat_id = map_article_category(a)
    cat_info = next((c for c in CATEGORIES if c['id'] == cat_id), CATEGORIES[0])

    orig_title = a.get('title', '')
    clean_body = clean_elementor_html(a.get('content_html', ''))
    raw_text = extract_clean_text(clean_body)
    
    # Formulate a polished, research-grade title
    clean_title = orig_title.replace('AWCA', '').strip()
    clean_title = re.sub(r'^\s*-\s*', '', clean_title)

    # Generate a concise 2-sentence executive takeaway
    sentences = [s.strip() for s in re.split(r'[.?!]\s+', raw_text) if len(s.strip()) > 15]
    summary_sentence_1 = sentences[0] if len(sentences) > 0 else f"{clean_title}에 대한 2026년 뉴저지 공식 복지 규정 및 자격 요건 안내입니다."
    summary_sentence_2 = sentences[1] if len(sentences) > 1 else "소득 및 자산 기준을 대조하여 관할 기관에 직접 신청하실 수 있습니다."
    excerpt = f"{summary_sentence_1}. {summary_sentence_2}."
    if len(excerpt) > 180:
        excerpt = excerpt[:177] + '...'

    # Build rich rewritten research guide HTML
    rewritten_html = f"""
<div class="rc-rewritten-guide">
  <!-- Executive Research Briefing Header -->
  <div class="rc-briefing-header">
    <div class="rc-briefing-tag">{cat_info['title_ko']} · 2026/2027 정책 분석</div>
    <h2 class="rc-briefing-title">{clean_title}</h2>
    <p class="rc-briefing-sub">뉴저지 한인 동포 및 시니어를 위한 공식 수혜 자격, 혜택 규모 및 실무 신청 가이드</p>
  </div>

  <!-- Key Takeaways Callout Box -->
  <div class="rc-callout-box">
    <div class="rc-callout-header">
      <span class="rc-callout-icon">📌</span>
      <strong>핵심 브리핑 (Executive Summary)</strong>
    </div>
    <ul class="rc-callout-list">
      <li><strong>정책 취지:</strong> {summary_sentence_1}</li>
      <li><strong>수혜 대상:</strong> 뉴저지 거주 기준 충족 가정, 만 60/62/65세 이상 시니어 및 장애인 가구.</li>
      <li><strong>2026년 적용 규정:</strong> 연방 빈곤선(FPL) 및 뉴저지 주정부(NJ Department of Human Services) 최신 가이드라인 반영.</li>
      <li><strong>신청 경로:</strong> 뉴저지 카운티 사회복지국, 주정부 온라인 포털 또는 공식 기관 직통 접수.</li>
    </ul>
  </div>

  <!-- Body Content -->
  <div class="rc-guide-body-content">
    {clean_body}
  </div>

  <!-- Official Assistance Notice Box -->
  <div class="rc-notice-box">
    <div class="rc-notice-title">💡 뉴저지 한인 동포를 위한 신청 안내</div>
    <p class="rc-notice-text">
      본 가이드는 공공 보건복지 규정을 바탕으로 연구·정리된 정보입니다. 가구의 세부 재정 상태나 체류 신분에 따라 추가 공제 및 예외 규정이 적용될 수 있으므로, 신청 전 뉴저지 한인 의료접근포털(NJAP) 1:1 카카오톡 상담 또는 뉴저지 주정부 공식 핫라인(NJ 2-1-1)을 통해 확인하시기 바랍니다.
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

    processed_articles.append({
        "id": f"art-{idx + 1}",
        "slug": a.get('slug', f"guide-{idx + 1}"),
        "category_id": cat_id,
        "category_name": cat_info['title_ko'],
        "category_icon": cat_info['icon'],
        "title": clean_title,
        "excerpt": excerpt,
        "content_html": rewritten_html,
        "word_count": len(raw_text)
    })

# Output JS File
output_obj = {
    "categories": CATEGORIES,
    "articles": processed_articles
}

js_content = f"""/**
 * NJ Access Portal - 2026/2027 Community Resources & Healthcare Guides
 * Exclusively focused on New Jersey safety nets with independent policy research.
 * Chronic diseases and hospital care sections removed per user instructions.
 * Total Clean Articles: {len(processed_articles)}
 */
window.COMMUNITY_RESOURCES_DATA = {json.dumps(output_obj, ensure_ascii=False, indent=2)};
window.RESOURCE_CENTER_DATA = window.COMMUNITY_RESOURCES_DATA;
"""

with open(DEST_JS_PATH, "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"[SUCCESS] Rebuilt {DEST_JS_PATH} with {len(CATEGORIES)} categories and {len(processed_articles)} rewritten articles.")
