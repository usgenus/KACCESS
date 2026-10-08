# -*- coding: utf-8 -*-
"""
Builder for comprehensive 2 to 3 minute audio guide scripts for all 80 Resource Center articles.
Requirements:
1. Strictly skip '안녕하세요' at the beginning.
2. Provide rich details and real-life examples, common questions, curiosities, application pitfalls.
3. Target duration: 2 to 3 minutes (1,250 to 1,550 characters at 1.05x speed).
4. Strictly stop saying '1:1 카카오톡' -> say '카카오톡 상담' only.
5. Strictly avoid '어르신' -> say '시니어 분' or '주민 여러분'.
"""
import json
import re
import os

BASE_DIR = '/Users/ejyoon/Desktop/KACCESS'
DATA_FILE = os.path.join(BASE_DIR, 'data/resource_center_data.js')

def load_data():
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    m = re.search(r'window\.COMMUNITY_RESOURCES_DATA\s*=\s*(\{.+?\});\s*window\.RESOURCE_CENTER_DATA', content, re.DOTALL)
    if not m:
        raise ValueError("Could not extract COMMUNITY_RESOURCES_DATA")
    return json.loads(m.group(1))

def clean_html(text):
    if not text:
        return ""
    t = re.sub(r'<[^>]+>', '', text)
    t = t.replace('&amp;', '&').replace('&nbsp;', ' ').replace('&gt;', '>').replace('&lt;', '<')
    t = t.replace('어르신', '시니어 분')
    return re.sub(r'\s+', ' ', t).strip()

def extract_article_details(art):
    html = art.get('content_html', '')
    
    # 1. Callouts
    callouts = {}
    for k, v in re.findall(r'<li><strong>(.*?)</strong>(.*?)</li>', html):
        clean_k = clean_html(k).rstrip(':').strip()
        clean_v = clean_html(v)
        if clean_k and clean_v:
            callouts[clean_k] = clean_v
            
    # 2. Footnote / Tip
    tip_match = re.search(r'rc-chart-footnote\">.*?<span>💡(.*?)</span>', html)
    chart_tip = clean_html(tip_match.group(1)) if tip_match else ""

    # 3. H4 sections
    sections = {}
    for h, b in re.findall(r'<h4 class=\"rc-guide-h4\">(.*?)</h4>(.*?)(?=<h4 class=\"rc-guide-h4\"|<!--|$)', html, re.DOTALL):
        sections[clean_html(h)] = clean_html(b)
        
    # 4. Checklists & Tips from list items
    checklist_items = []
    ch_match = re.search(r'(체크리스트|구비 서류).*?<ul class=\"rc-guide-list\">(.*?)</ul>', html, re.DOTALL)
    if ch_match:
        for li in re.findall(r'<li>(.*?)</li>', ch_match.group(2)):
            checklist_items.append(clean_html(li))
            
    tips_items = []
    tips_match = re.search(r'(실무 팁|반려 방지|주의사항).*?<ul class=\"rc-guide-list\">(.*?)</ul>', html, re.DOTALL)
    if tips_match:
        for li in re.findall(r'<li>(.*?)</li>', tips_match.group(2)):
            tips_items.append(clean_html(li))

    # Contacts
    contacts_items = []
    ct_match = re.search(r'(공식 문의처|접수처|문의처).*?<ul class=\"rc-guide-list\">(.*?)</ul>', html, re.DOTALL)
    if ct_match:
        for li in re.findall(r'<li>(.*?)</li>', ct_match.group(2)):
            contacts_items.append(clean_html(li))

    return callouts, chart_tip, sections, checklist_items, tips_items, contacts_items

def synthesize_script(art):
    art_id = art['id']
    title = clean_html(art['title'])
    cat_name = clean_html(art.get('category_name', ''))
    excerpt = clean_html(art.get('excerpt', ''))
    callouts, chart_tip, sections, checklist, tips, contacts = extract_article_details(art)

    title_short = re.sub(r'\(.*?\)', '', title).strip()
    if not title_short:
        title_short = title

    # Paragraph 1: Direct Opening (NO "안녕하세요")
    p1 = f"{title} 신청 및 실전 핵심 가이드입니다.\n{excerpt}"

    # Paragraph 2: Common Questions & Curiosities
    curiosity = []
    curiosity.append(f"많은 분들께서 {title_short}에 대해 알아보실 때 '내 소득이나 은행 잔고로 자격이 될까?', '신청했다가 거절당하면 어떻게 하나', 혹은 '영주권이나 시민권 심사에 불이익은 없을까?' 하고 가장 많이 궁금해하십니다.")
    
    # Public charge assurance
    curiosity.append("가장 먼저 안심하셔도 좋은 점은, 뉴저지의 대다수 커뮤니티 복지와 의료 지원 제도는 연방 공적부조, 즉 퍼블릭 차지 심사 대상이 아니므로 합법적인 영주권 취득이나 시민권 신청에 아무런 불이익을 주지 않는다는 사실입니다.")
    
    # Income vs assets clarification
    if any('자산' in k for k in callouts.keys()) or '자산' in chart_tip or '소득' in chart_tip:
        curiosity.append("또한 심사 기관에서는 매달 들어오는 '월 소득'과 통장에 모여있는 '금융 자산'을 완전히 다른 잣대로 평가하기 때문에, 비상금이 조금 있거나 은퇴 계좌가 남아있다는 이유로 지레 신청을 망설이실 필요가 없습니다.")
    p2 = " ".join(curiosity)

    # Paragraph 3: 2026/2027 Core Rules & Numbers
    rules = []
    rules.append("2026년과 2027년 최신 기준을 기준으로 핵심 규정을 짚어보겠습니다.")
    
    rule_keys = [k for k in callouts.keys() if any(w in k for w in ['취지', '대상', '자격', '기준', '규모', '혜택', '규정', '한도', '소득'])]
    for k in rule_keys[:3]:
        v = callouts[k]
        # Shorten if too long
        if len(v) > 120:
            v = v[:115] + "..."
        rules.append(f"{k}을 살펴보면, {v}")
        
    if chart_tip:
        rules.append(f"특히 {chart_tip}")
    p3 = " ".join(rules)

    # Paragraph 4: Real-Life Comparisons & Local Context
    examples = []
    examples.append("실제 현장 상담과 생활에서 꼭 알아두셔야 할 실무 포인트입니다.")
    
    sec_added = 0
    for h, b in sections.items():
        if not any(w in h for w in ['체크리스트', '구비 서류', '실무 팁', '반려 방지', '문의처', '접수 안내']):
            if len(b) > 20 and sec_added < 2:
                b_clean = b[:160].rstrip()
                if not b_clean.endswith('.'):
                    b_clean += " 등 실질적인 혜택과 규칙이 적용됩니다."
                examples.append(f"{h} 내용과 관련해서는, {b_clean}")
                sec_added += 1
                
    if sec_added == 0:
        examples.append("포트리와 팰리세이즈 파크 등 버겐카운티와 뉴저지 각 타운마다 세부 접수 일정과 우선순위에 차이가 있을 수 있으므로 본인의 거주지 주관 기관 기준을 먼저 점검하시는 것이 중요합니다.")
    p4 = " ".join(examples)

    # Paragraph 5: Required Documents, Application Tips & Avoiding Pitfalls
    prep = []
    prep.append("신청하실 때 서류 누락으로 반려되거나 심사가 지연되는 일을 막기 위한 실전 요령입니다.")
    
    if checklist:
        clean_docs = [re.sub(r'^[0-9\.\-\s]+', '', doc)[:60] for doc in checklist[:3]]
        prep.append("기본적으로 " + ", ".join(clean_docs) + " 등을 사전에 원본과 PDF 사본으로 꼼꼼히 챙겨두셔야 합니다.")
    else:
        prep.append("신분증과 영주권 카드, 최근 연도 세금보고서, 최근 3개월 치 은행 거래 명세서와 소득 증빙 서류를 미리 준비해 두시면 심사가 훨씬 신속하게 진행됩니다.")

    if tips:
        clean_tips = [re.sub(r'^[0-9\.\-\s]+', '', tip)[:90] for tip in tips[:2]]
        prep.append("아울러 실무에서 " + " 또한, ".join(clean_tips))
    else:
        prep.append("접수 후 이사를 가시거나 전화번호가 바뀌었을 때는 즉시 서면으로 업데이트하셔야 중요한 안내 우편을 놓치지 않습니다.")

    if contacts:
        clean_ct = [re.sub(r'^[0-9\.\-\s]+', '', c)[:50] for c in contacts[:1]]
        prep.append(f"공식 접수처는 {clean_ct[0]} 등에서 안내받으실 수 있습니다.")
    p5 = " ".join(prep)

    # Paragraph 6: Warm Closing (Strictly NO "1:1", KakaoTalk only)
    p6 = "화면에 정리된 최신 자격 기준표와 체크리스트를 꼼꼼히 확인해 보시고, 혼자 준비하기 막막하시거나 서류 작성에 도움이 필요하시면 화면 우측 상단의 카카오톡 상담을 통해 편하게 문의해 주시기 바랍니다. 감사합니다."

    full_script = f"{p1}\n\n{p2}\n\n{p3}\n\n{p4}\n\n{p5}\n\n{p6}"
    
    # 1. Clean out any leading "안녕하세요"
    full_script = re.sub(r'^안녕하세요[!\.,\s]*', '', full_script).strip()
    
    # 2. Clean out any "1:1"
    full_script = full_script.replace('1:1 카카오톡', '카카오톡')
    full_script = full_script.replace('카카오톡 1:1', '카카오톡')
    full_script = full_script.replace('1:1 무료 상담', '카카오톡 무료 상담')
    full_script = full_script.replace('1:1 상담', '카카오톡 상담')
    full_script = full_script.replace('1:1', '')
    
    # 3. Clean spaces
    full_script = re.sub(r'[ \t]+', ' ', full_script)
    full_script = re.sub(r'\n{3,}', '\n\n', full_script)

    # Target: 1,250 to 1,550 characters.
    # If longer than 1,550, trim gently
    if len(full_script) > 1550:
        # shorten Paragraph 4 or 5 slightly
        p4_short = p4[:220] + "... 이러한 현장 규정을 미리 파악해 두시는 것이 실질적으로 큰 도움이 됩니다."
        full_script = f"{p1}\n\n{p2}\n\n{p3}\n\n{p4_short}\n\n{p5}\n\n{p6}"
        
    return full_script

def build_all():
    data = load_data()
    articles = data['articles']
    print(f"Building full scripts for {len(articles)} articles...")

    all_scripts = {}
    lens = []
    for art in articles:
        script = synthesize_script(art)
        all_scripts[art['id']] = script
        lens.append(len(script))

    min_l, max_l, avg_l = min(lens), max(lens), sum(lens)/len(lens)
    print(f"Script character counts: min={min_l}, max={max_l}, avg={avg_l:.1f}")

    # Generate script_templates.py
    code = '''# -*- coding: utf-8 -*-
"""
Community Center Counselor Spoken Scripts for Resource Center Articles (All 80 topics).
Generated with rich details, common questions, practical examples, and 2-3 minute pacing.
Strictly NO '안녕하세요' at start.
Strictly NO '1:1'. KakaoTalk consultation only.
Pacing: 1.05x speed.
"""

SCRIPTS = ''' + json.dumps(all_scripts, ensure_ascii=False, indent=2) + '''

def get_spoken_script(art_id, title, cat_id, cat_name, excerpt):
    if art_id in SCRIPTS:
        return SCRIPTS[art_id]
    return f"{title} 핵심 안내 오디오 가이드입니다.\\n\\n{excerpt}\\n\\n화면의 최신 기준표를 확인해 보시고, 도움이 필요하시면 카카오톡 상담으로 문의해 주시기 바랍니다. 감사합니다."
'''

    out_file = os.path.join(BASE_DIR, 'scripts/script_templates.py')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(code)

    print(f"Successfully saved all {len(all_scripts)} scripts to {out_file}")

if __name__ == '__main__':
    build_all()
