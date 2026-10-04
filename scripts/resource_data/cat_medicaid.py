# -*- coding: utf-8 -*-
"""
Medicaid category articles (9 articles)
"""
from .common import render_article_html

def get_medicaid_articles():
    articles = []

    # art-18: ACA Medicaid Expansion
    articles.append({
        "id": "art-18",
        "slug": "medicaid-aca-medicaid-ko",
        "category_id": "medicaid",
        "category_name": "메디케이드 & NJ 패밀리케어",
        "title": "ACA 메디케이드 (Medicaid Expansion)",
        "excerpt": "만 19~64세 성인을 위한 뉴저지 패밀리케어 확장형 메디케이드(138% FPL). 자산 심사 없이 100% 무료 의료보험 혜택.",
        "content_html": render_article_html(
            cat_title="메디케이드 & NJ 패밀리케어",
            title="ACA 확장형 메디케이드 (NJ FamilyCare Adult Expansion - 138% FPL)",
            portal_key="njfamilycare",
            exec_summary={
                "정책 취지": "오바마케어(ACA)에 따라 뉴저지주가 채택한 성인 메디케이드 제도로, 자녀 유무나 장애 여부와 관계없이 순수 소득 기준만으로 100% 무료 의료보험을 제공합니다.",
                "수혜 대상": "만 19세~64세 뉴저지 거주 성인으로서 가구 수정조정소득(MAGI)이 <span class='rc-chart-cell-highlight'>연방 빈곤선 138% 이하</span>인 자.",
                "혁신적 장점": "<span class='rc-chart-badge rc-chart-badge-green'>자산 심사 전혀 없음 (No Asset Test)</span> - 주택, 예금, 자동차, 주식을 아무리 많이 보유하고 있어도 월 소득만 기준선 이하이면 승인됩니다.",
                "보험 혜택": "월 보험료 $0, 진료비 코페이 $0, 처방약 $0, 입원/수술 $0, 치과/안과/응급실 100% 전액 주정부 부담."
            },
            chart_info={
                "title": "2026/2027 뉴저지 ACA 메디케이드(138% FPL) 소득 기준표",
                "badge": "자산 심사 없음 (No Asset Test)",
                "headers": ["가구 규모", "월 수정조정소득 (MAGI)", "연간 총소득 한도 (138% FPL)", "본인 부담금"],
                "rows": [
                    ["1인 가구", "<span class='rc-chart-cell-highlight'>$1,800 이하</span>", "$21,600 이하", "<span class='rc-chart-cell-highlight'>월 보험료 $0 / 코페이 $0</span>"],
                    ["2인 가구", "<span class='rc-chart-cell-highlight'>$2,432 이하</span>", "$29,190 이하", "<span class='rc-chart-cell-highlight'>부부 전액 무료</span>"],
                    ["3인 가구", "$3,065 이하", "$36,780 이하", "가족 전원 무료"],
                    ["4인 가구", "$3,697 이하", "$44,370 이하", "가족 전원 무료"]
                ],
                "footnote": "MAGI 소득 계산 시 5% 소득 공제(Income Disregard)가 기본 적용되어 실질 자격은 133% + 5% = 138% FPL입니다."
            },
            sections=[
                {
                    "heading": "이민자 체류 신분(5년 바) 및 서류미비자 아동 규정",
                    "content": """
<p>성인의 경우 미국 시민권자 또는 영주권 취득 후 5년이 경과한 자(5-Year Bar)가 정식 대상입니다. 단, 임산부 및 만 19세 미만 아동은 <strong>뉴저지 커버 올 키즈(Cover All Kids)</strong> 정책에 따라 체류 신분(서류미비자 포함)을 전혀 묻지 않고 100% 무료 가입됩니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "소득 증빙", "desc": "최근 1개월 급여명세서(Paystubs) 또는 전년도 세금보고서(IRS 1040)."},
                {"doc": "신분 증명서", "desc": "유효한 운전면허증 및 소셜 시큐리티 번호."},
                {"doc": "이민 신분 서류", "desc": "미국 여권 또는 영주권(Green Card) 사본."}
            ],
            tips=[
                {"title": "소득 변동 시 즉시 신고 필수", "desc": "직장을 구하거나 소득이 138% FPL을 초과하게 되면 GetCoveredNJ 주정부 마켓플레이스로 전환하여 보조금 플랜을 선택해야 페널티가 없습니다."},
                {"title": "매년 리뉴얼(Redetermination) 패킷 제출", "desc": "주정부에서 우편으로 발송하는 갱신 서류를 기한 내 제출하지 않으면 보험이 일방적으로 중단되므로 주의하십시오."}
            ],
            contacts=[
                {"name": "NJ FamilyCare 온라인 접수", "val": "1-800-701-0710 (njfamilycare.dhs.state.nj.us)"},
                {"name": "버겐카운티 복지국", "val": "201-368-4200"}
            ]
        )
    })

    # art-19: ABD Medicaid
    articles.append({
        "id": "art-19",
        "slug": "medicaid-regular-medicaid-abd-ko",
        "category_id": "medicaid",
        "category_name": "메디케이드 & NJ 패밀리케어",
        "title": "ABD 메디케이드 (뉴저지 패밀리케어 ABD)",
        "excerpt": "만 65세 이상 시니어 및 장애인을 위한 전통적 메디케이드(ABD). 소득 기준과 엄격한 자산 심사($4,000/$6,000) 및 메디케어 듀얼 혜택.",
        "content_html": render_article_html(
            cat_title="메디케이드 & NJ 패밀리케어",
            title="노인·장애인 메디케이드 (NJ FamilyCare ABD - Aged, Blind, Disabled)",
            portal_key="njfamilycare",
            exec_summary={
                "정책 취지": "만 65세 이상 시니어 또는 영구 장애인에게 제공되는 전통적인 메디케이드로, 메디케어가 커버하지 못하는 치과, 안경, 장기 요양, 본인부담금을 100% 완벽히 보완합니다.",
                "수혜 자격 요건": "만 65세 이상 또는 공인 장애인으로서 연방 빈곤선 100% 이하 소득 및 엄격한 자산 요건 충족.",
                "엄격한 자산 심사(Asset Test)": "주 거주 주택 1채와 차량 1대를 제외한 금융 자산(은행 잔고, 주식, 생명보험 해약환급금 등)이 <span class='rc-chart-cell-highlight'>독신 $4,000, 부부 $6,000 이하</span>여야 함.",
                "메디케어 듀얼(D-SNP) 연계": "메디케어와 ABD 메디케이드를 동시 보유하면 병원비 본인부담 $0 및 월 $100~$200 상당의 식료품/생필품 OTC 지원 혜택."
            },
            chart_info={
                "title": "2026/2027 뉴저지 ABD 메디케이드 소득 및 자산 기준표",
                "badge": "FPL 100% 및 자산 심사",
                "headers": ["가구 형태", "월 소득 한도 (100% FPL)", "엄격 자산 한도 (Asset Limit)", "면제 인정 자산 (Exempt)"],
                "rows": [
                    ["독신 (Single)", "<span class='rc-chart-cell-highlight'>$1,305 이하</span>", "<span class='rc-chart-cell-highlight'>$4,000 이하</span>", "주 거주 주택 1채, 차량 1대"],
                    ["부부 (Married)", "<span class='rc-chart-cell-highlight'>$1,763 이하</span>", "<span class='rc-chart-cell-highlight'>$6,000 이하</span>", "가재도구, $1,500 이하 장례보험"],
                    ["초과 소득 시 (Spend-Down)", "Medically Needy 대상", "초과액 병원비 지출 후 승인", "병원비 영수증 증빙"]
                ],
                "footnote": "자산 한도를 초과할 경우 합법적인 장례 신탁(Irrevocable Burial Trust) 등을 통해 합법적으로 자산을 줄이는 계획이 필요합니다."
            },
            sections=[
                {
                    "heading": "65세 생일 전후 메디케이드 전환 주의사항",
                    "content": """
<p>만 64세까지는 자산 심사가 없는 ACA 확장 메디케이드(138% FPL) 혜택을 받다가, <strong>만 65세가 되는 달부터는 자산 심사가 있는 ABD 메디케이드로 자동 이관</strong>됩니다. 이때 은행 잔고가 $4,000을 초과하면 메디케이드 자격이 박탈될 수 있으므로 65세 도래 3~6개월 전에 사전 대비해야 합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "은행 잔고 증명서", "desc": "신청자 및 배우자의 모든 계좌 최근 3개월 치 명세서 전체."},
                {"doc": "소셜 연금 증명(SSA-1099)", "desc": "월 수령액 증빙."},
                {"doc": "생명보험 증권", "desc": "보험 종류(Term vs Whole Life) 및 해약환급금(Cash Surrender Value) 내역서."},
                {"doc": "주택 증서(Deed)", "desc": "주 거주 목적 자가 주택 증빙."}
            ],
            tips=[
                {"title": "장례 신탁(Burial Trust)으로 $15,000까지 합법 공제", "desc": "취소 불가능한 장례 신탁(Irrevocable Funeral Trust)에 예치한 자금은 메디케이드 자산 심사에서 100% 제외됩니다."},
                {"title": "메디케어 파트 B 보험료 대납 연계", "desc": "ABD 메디케이드가 승인되면 매달 소셜 연금에서 차감되던 메디케어 파트 B 보험료($185.00)를 주정부가 전액 대납해 줍니다."}
            ],
            contacts=[
                {"name": "버겐카운티 복지국 ABD 팀", "val": "201-368-4200"},
                {"name": "NJAP 메디케이드 자산 전문 상담", "val": "201-336-7400"}
            ]
        )
    })

    # art-20: MLTSS
    articles.append({
        "id": "art-20",
        "slug": "medicaid-ltc-medicaid-mltss-ko",
        "category_id": "medicaid",
        "category_name": "메디케이드 & NJ 패밀리케어",
        "title": "롱텀케어 메디케이드 (MLTSS)",
        "excerpt": "너싱홈 입원 및 재택 간병인을 전액 지원하는 뉴저지 MLTSS 장기요양 메디케이드 자격, 5년 자산조사(Look-back) 및 신청 로드맵.",
        "content_html": render_article_html(
            cat_title="메디케이드 & NJ 패밀리케어",
            title="롱텀케어 관리의료 서비스 (MLTSS - Managed Long Term Services and Supports)",
            portal_key="njfamilycare",
            exec_summary={
                "정책 취지": "만성 질환이나 노환으로 24시간 간호 또는 일상 돌봄이 필요한 시니어가 시설 너싱홈에 입원하거나, 자택에서 홈케어 간병 서비스를 받을 수 있도록 주정부가 전액 지원하는 최고 등급의 복지 프로그램입니다.",
                "수혜 자격": "간호 시설 입소 수준(Nursing Facility Level of Care) 의학적 판정 및 소득/자산 기준 충족.",
                "2026년 특별 소득 한도": "일반 메디케이드보다 훨씬 높은 <span class='rc-chart-cell-highlight'>월 $2,982 이하 (연방 FPL 300% 수준)</span> 소득자까지 수혜 가능.",
                "철저한 5년 자산 조사 (5-Year Look-back)": "신청일 기준 과거 60개월(5년) 동안 자녀에게 무상 증여하거나 시세보다 낮게 매각한 자산이 있는지 정밀 추적 심사."
            },
            chart_info={
                "title": "2026/2027 뉴저지 MLTSS 장기요양 메디케이드 재정 기준",
                "badge": "너싱홈 & 재택간병 전액 지원",
                "headers": ["심사 항목", "2026년 공식 기준액", "초과 시 대안 / 해결 방안"],
                "rows": [
                    ["월 소득 한도 (Income)", "<span class='rc-chart-cell-highlight'>월 $2,982 이하</span>", "QIT (Qualified Income Trust / Miller Trust) 설립으로 전액 해결"],
                    ["개인 자산 한도 (Asset)", "<span class='rc-chart-cell-highlight'>$2,000 이하</span>", "합법적 Spend-down 및 면제 자산 전환"],
                    ["배우자 자산 보호 (CSRA)", "<span class='rc-chart-badge rc-chart-badge-blue'>최대 $163,050 보호</span>", "집에 남은 배우자의 주거권 및 재산 100% 보장"],
                    ["과거 5년 자산 증여 조사", "60개월 전체 계좌 실사", "부당 증여 적발 시 수개월간 혜택 승인 유예(Penalty)"]
                ],
                "footnote": "의학적 평가(ADR Assessment)에서 식사, 목욕, 보행, 투약 등 일상생활 수행에 최소 3개 이상의 간호 도움이 필요하다고 판정받아야 합니다."
            },
            sections=[
                {
                    "heading": "MLTSS를 통한 주요 지원 서비스 내역",
                    "content": """
<p>MLTSS가 승인되면 지정 MCO 보험사를 통해 다음 서비스가 전액 무료로 제공됩니다:</p>
<ul class="rc-guide-list">
  <li><strong>재택 홈케어 간병인(CHHA):</strong> 주당 20~40시간 공인 간호조무사 가정 파견.</li>
  <li><strong>가족 간병인 급여(PPP):</strong> 자녀나 배우자를 간병인으로 등록하여 시급 지급.</li>
  <li><strong>어덜트 데이케어(Adult Day Care):</strong> 주 5회 데이케어 센터 차량 픽업, 식사 및 물리치료.</li>
  <li><strong>너싱홈(SNF) 입원비 전액:</strong> 월 $12,000~$15,000에 달하는 요양원 입원비 100% 주정부 부담.</li>
</ul>
"""
                }
            ],
            checklist=[
                {"doc": "과거 5년치(60개월) 은행 명세서", "desc": "보유했던 모든 계좌의 60개월 전체 거래 내역서 원본."},
                {"doc": "대형 거래 소명 자료", "desc": "과거 5년간 $1,000 이상 입출금 건에 대한 영수증, 계약서, 수표 사본."},
                {"doc": "의사 진단서 및 처방전", "desc": "주치의의 최근 종합 검진 기록 및 간호 필요 소견서."},
                {"doc": "주택 소유 증서 및 모기지", "desc": "자가 주택 증서 사본."}
            ],
            tips=[
                {"title": "자산 증여(Gifting)는 반드시 5년 전에 완료", "desc": "자녀에게 재산을 이전할 계획이라면 MLTSS 신청 최소 5년 전에 마쳐야 페널티 기간(Penalty Period)을 피할 수 있습니다."},
                {"title": "밀러 트러스트(QIT) 활용", "desc": "월 연금 수입이 $2,982를 단 $1라도 초과하면 자격이 박탈되지만, QIT 계좌를 개설하여 초과 소득을 예치하면 합법적으로 승인됩니다."}
            ],
            contacts=[
                {"name": "버겐카운티 ADRC (MLTSS 접수처)", "val": "201-336-7400"},
                {"name": "NJ Division of Medical Assistance (DMAHS)", "val": "1-800-356-1561"}
            ]
        )
    })

    # art-21: CHIP
    articles.append({
        "id": "art-21",
        "slug": "medicaid-chip-ko",
        "category_id": "medicaid",
        "category_name": "메디케이드 & NJ 패밀리케어",
        "title": "아동 건강 보험 프로그램 (CHIP)",
        "excerpt": "뉴저지 19세 미만 아동을 위한 NJ FamilyCare CHIP. 연방 빈곤선 355%까지 파격적 무료/저비용 종합 건강보험 및 치과 보장.",
        "content_html": render_article_html(
            cat_title="메디케이드 & NJ 패밀리케어",
            title="아동 건강 보험 프로그램 (NJ FamilyCare CHIP & Cover All Kids)",
            portal_key="njfamilycare",
            exec_summary={
                "정책 취지": "부모의 소득이 일반 메디케이드 기준을 초과하는 맞벌이 중산층 가정이라도 자녀만큼은 병원비 걱정 없이 자랄 수 있도록 파격적으로 높은 소득 한도까지 제공하는 아동 건강보험입니다.",
                "파격적인 소득 기준": "연방 빈곤선(FPL)의 <span class='rc-chart-cell-highlight'>최대 355% 이하</span> 가정의 만 19세 미만 아동 누구나 가입 가능.",
                "체류 신분 불문 (Cover All Kids)": "뉴저지주 법령에 따라 서류미비(Undocumented) 아동도 체류 신분 조사 없이 100% 동등하게 가입 승인.",
                "종합 보장 범위": "소아과 정기 검진, 예방접종, 시력 검사 및 안경, 치과 검진/치료/교정(필요시), 응급실, 입원 수술 일체 보장."
            },
            chart_info={
                "title": "2026/2027 뉴저지 아동 CHIP 소득 등급별 월 보험료표 (Cover All Kids)",
                "badge": "최대 355% FPL 지원",
                "headers": ["플랜 구분", "소득 기준 (FPL)", "가구 월 소득 (4인 가구 기준)", "월 아동 1인당 보험료"],
                "rows": [
                    ["Plan A (완전 무료)", "142% FPL 이하", "$3,800 이하", "<span class='rc-chart-cell-highlight'>$0 (전액 무료)</span>"],
                    ["Plan B (저비용)", "142% ~ 155% FPL", "$3,801 ~ $4,150", "<span class='rc-chart-cell-highlight'>$0 (보험료 없음)</span>"],
                    ["Plan C (초저렴)", "155% ~ 205% FPL", "$4,151 ~ $5,490", "월 약 $35 (가구당 최대 $105)"],
                    ["Plan D (중산층)", "205% ~ 355% FPL", "<span class='rc-chart-cell-highlight'>$5,491 ~ $9,510</span>", "월 약 $55 ~ $165 (가구당 상한 존재)"]
                ],
                "footnote": "Plan A와 B는 진료 코페이(Copay)가 전혀 없으며, Plan C와 D도 $5~$10 수준의 극소액 코페이만 발생합니다."
            },
            sections=[
                {
                    "heading": "소아 치과 및 시력 교정(안경) 100% 보장",
                    "content": """
<p>민간 건강보험에서는 별도 치과 보험을 들어도 50%만 커버되는 충치 치료, 신경치료, 크라운, 레진 치료가 NJ FamilyCare CHIP에서는 연간 한도 없이 100% 무료 지원됩니다. 안경 역시 매년 새 제품으로 무료 맞춤 제작이 가능합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "아동 출생증명서", "desc": "미국 출생증명서(Birth Certificate) 또는 한국 기본증명서(상세 번역본)."},
                {"doc": "부모 소득 증명", "desc": "최근 1개월 급여명세서(W-2) 또는 세금보고서 1040."},
                {"doc": "뉴저지 거주 증명", "desc": "부모 명의 아파트 리스 계약서 또는 유틸리티 고지서."}
            ],
            tips=[
                {"title": "서류미비 아동 안심 신청", "desc": "Cover All Kids 프로그램 신청 시 이민국(ICE)과 정보를 절대 공유하지 않으므로 안심하고 자녀의 건강을 지키십시오."},
                {"title": "민간 보험 해지 대기 기간 폐지", "desc": "과거 존재했던 3개월 민간 보험 해지 대기 규정이 완전히 폐지되어 직장 보험료가 부담될 경우 즉시 CHIP으로 전환 가능합니다."}
            ],
            contacts=[
                {"name": "NJ FamilyCare 아동 전담 라인", "val": "1-800-701-0710"},
                {"name": "Cover All Kids 공식 포털", "val": "njfamilycare.dhs.state.nj.us"}
            ]
        )
    })

    # art-22: MCO System
    articles.append({
        "id": "art-22",
        "slug": "medicaid-mco-system-ko",
        "category_id": "medicaid",
        "category_name": "메디케이드 & NJ 패밀리케어",
        "title": "메디케이드 관리 보험사 (MCO) 시스템 (뉴저지)",
        "excerpt": "뉴저지 메디케이드 공식 5대 관리 의료 보험사(MCO) 비교 및 한인 의사 네트워크 중심의 최적 보험사 선택법.",
        "content_html": render_article_html(
            cat_title="메디케이드 & NJ 패밀리케어",
            title="뉴저지 메디케이드 관리 보험사 시스템 (MCO - Managed Care Organizations)",
            portal_key="njfamilycare",
            exec_summary={
                "정책 취지": "뉴저지 메디케이드 수급자는 주정부로부터 가입 승인을 받은 후, 주정부와 계약된 민간 관리 보험사(MCO) 5곳 중 하나를 의무적으로 선택하여 진료 및 처방약 서비스를 관리받습니다.",
                "뉴저지 5대 공식 MCO": "Horizon NJ Health, Wellpoint(구 Amerigroup), Fidelis Care(구 WellCare), Aetna Better Health of NJ, UnitedHealthcare Community Plan.",
                "선택 기준": "버겐/허드슨 카운티 한인 주치의(PCP), 한인 전문의, 잉글우드 병원, 홀리네임 병원 네트워크 가입 여부가 최우선 고려 사항.",
                "변경 권리": "가입 후 최초 90일 이내 언제든지 변경 가능하며, 이후 매년 정기 오픈 인롤먼트 기간에 보험사 변경 가능."
            },
            chart_info={
                "title": "뉴저지 북부 한인 밀집 지역 주요 MCO 특징 비교",
                "badge": "5대 MCO 비교",
                "headers": ["MCO 보험사 명칭", "한인 의료진 네트워크", "주요 연계 병원", "특화 부가 혜택"],
                "rows": [
                    ["<span class='rc-chart-cell-highlight'>Horizon NJ Health</span>", "가장 광범위 (압도적 1위)", "홀리네임, 잉글우드, 해켄색", "치과 및 안과 최대 네트워크"],
                    ["<span class='rc-chart-cell-highlight'>Wellpoint (Amerigroup)</span>", "우수 (다수 한인의사 가입)", "홀리네임, 잉글우드", "산모 케어 및 리워드 프로그램"],
                    ["Fidelis Care (WellCare)", "양호", "지역 종합병원", "처방약 및 시니어 복지 특화"],
                    ["UnitedHealthcare Community", "양호", "해켄색 메디컬 센터", "전국 UHC 네트워크 연계"]
                ],
                "footnote": "주치의(PCP)를 사전에 지정하지 않으면 주정부 시스템이 거주지 인근 의사로 자동 임의 배정하므로 주의해야 합니다."
            },
            sections=[
                {
                    "heading": "한인 환자를 위한 MCO 주치의(PCP) 선택 노하우",
                    "content": """
<p>메디케이드 승인 통지서를 받으면 14일 이내에 보험사 선택 양식을 제출해야 합니다. 기한 내 선택하지 않으면 주정부가 임의로 보험사를 자동 지정합니다.</p>
<p>포트리, 팰팍, 클로스터 등 한인 밀집 지역 주민에게는 <strong>Horizon NJ Health</strong> 또는 <strong>Wellpoint</strong>가 한인 내과, 가정의학과, 소아과 의사 네트워크가 가장 넓어 추천됩니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "MCO 선택 통지서", "desc": "주정부 메디케이드과에서 발송한 MCO Enrollment Form."},
                {"doc": "지정 희망 주치의 정보", "desc": "주치의 영문 성명, NPI 번호, 클리닉 주소."},
                {"doc": "가족 구성원 정보", "desc": "가족별 희망 MCO 및 주치의 목록."}
            ],
            tips=[
                {"title": "보험 카드 수령 전 임시 이용법", "desc": "MCO 실물 플라스틱 카드가 우편으로 도착하기 전이라도 주정부 승인 편지(Approval Notice)와 가입자 번호로 병원 진료가 가능합니다."},
                {"title": "주치의 변경은 연중 상시 가능", "desc": "보험사 자체는 1년에 1번 변경하지만, 같은 보험사 내에서 주치의(PCP)를 변경하는 것은 전화 한 통으로 언제든지 즉시 가능합니다."}
            ],
            contacts=[
                {"name": "NJ Medicaid MCO 등록 브로커", "val": "1-800-701-0710"},
                {"name": "Horizon NJ Health 한국어 고객센터", "val": "1-800-682-9090"}
            ]
        )
    })

    # art-59: Medicaid Overview
    articles.append({
        "id": "art-59",
        "slug": "medicaid-overview-ko",
        "category_id": "medicaid",
        "category_name": "메디케이드 & NJ 패밀리케어",
        "title": "메디케이드 (Medicaid) 개요",
        "excerpt": "뉴저지 패밀리케어(NJ FamilyCare)의 전반적인 운영 체계, 연령 및 신분별 수혜 프로그램 구조와 최신 가입 가이드.",
        "content_html": render_article_html(
            cat_title="메디케이드 & NJ 패밀리케어",
            title="뉴저지 메디케이드 종합 가이드 (NJ FamilyCare Master Overview)",
            portal_key="njfamilycare",
            exec_summary={
                "정책 취지": "뉴저지주와 연방정부가 공동 재원을 마련하여 저소득 개인, 아동, 임산부, 장애인, 시니어에게 포괄적인 의료 서비스를 무상 또는 저비용으로 보장하는 공공 의료보험 시스템입니다.",
                "운영 명칭": "뉴저지에서는 공식적으로 <strong>NJ FamilyCare</strong>라는 브랜드로 단일 통합 운영됩니다.",
                "프로그램 3대 축": "1) 성인 ACA 확장(138% FPL, 자산 무관), 2) 아동 CHIP(355% FPL), 3) 시니어/장애인 ABD 및 롱텀케어 MLTSS.",
                "보장 내역": "의사 진료, 입원, 응급실, 처방약, 치과, 안과, 정신건강, 재활 치료, 방문 간병 전액 지원."
            },
            chart_info={
                "title": "NJ FamilyCare 대상자별 핵심 자격 및 소득 기준 총괄표",
                "badge": "프로그램별 자격 요약",
                "headers": ["대상 그룹", "해당 프로그램", "소득 기준 (FPL)", "자산 심사 유무"],
                "rows": [
                    ["만 19~64세 성인", "ACA Medicaid Expansion", "<span class='rc-chart-cell-highlight'>138% FPL 이하</span>", "<span class='rc-chart-badge rc-chart-badge-green'>자산 심사 없음</span>"],
                    ["만 19세 미만 아동", "CHIP / Cover All Kids", "<span class='rc-chart-cell-highlight'>355% FPL 이하</span>", "<span class='rc-chart-badge rc-chart-badge-green'>자산 심사 없음</span>"],
                    ["임산부 (Pregnant)", "Maternity Medicaid", "<span class='rc-chart-cell-highlight'>205% FPL 이하</span>", "<span class='rc-chart-badge rc-chart-badge-green'>자산 심사 없음</span>"],
                    ["만 65세 이상 시니어", "ABD Medicaid", "100% FPL 이하", "<span class='rc-chart-cell-highlight'>독신 $4,000 / 부부 $6,000</span>"],
                    ["장기요양 간병 필요자", "MLTSS (롱텀케어)", "300% FPL 이하 (월 $2,982)", "<span class='rc-chart-cell-highlight'>개인 $2,000 / 5년 조사</span>"]
                ],
                "footnote": "각 그룹별로 신청 양식과 관할 부서가 다르므로 본인의 연령과 필요에 맞는 정확한 카테고리를 선택해야 합니다."
            },
            sections=[
                {
                    "heading": "메디케이드 신청 시 절대 피해야 할 실수 3가지",
                    "content": """
<ol class="rc-guide-list-num">
  <li><strong>가구원 수(Tax Household) 오류:</strong> 세금보고상 부양가족 기준과 실제 거주 기준을 혼동하여 소득 계산이 잘못되는 경우.</li>
  <li><strong>총소득(Gross) 대신 순소득(Net) 기재:</strong> 급여명세서의 세후 실수령액이 아닌 세전 총소득(Gross Pay)을 기준으로 심사하므로 정확한 기재 필수.</li>
  <li><strong>우편물 방치:</strong> 주정부 확인 서한에 기한 내 회신하지 않아 서류 미비로 자동 기각되는 사례가 가장 빈번합니다.</li>
</ol>
"""
                }
            ],
            checklist=[
                {"doc": "소득 증명서", "desc": "급여명세서, W-2, 1099, 세금보고서."},
                {"doc": "신분 증명서", "desc": "운전면허증, 소셜 시큐리티 카드."},
                {"doc": "체류 신분 서류", "desc": "시민권, 영주권, 비자 서류."},
                {"doc": "주소 증빙", "desc": "유틸리티 고지서, 리스 계약서."}
            ],
            tips=[
                {"title": "NJAP 무료 원스톱 대행 서비스 활용", "desc": "신청서 작성부터 서류 업로드, MCO 보험사 지정까지 전 과정을 무료로 지원해 드립니다."}
            ],
            contacts=[
                {"name": "NJ FamilyCare 공식 콜센터", "val": "1-800-701-0710"},
                {"name": "공식 웹사이트", "val": "njfamilycare.dhs.state.nj.us"}
            ]
        )
    })

    # art-60: ACA Marketplace (GetCoveredNJ)
    articles.append({
        "id": "art-60",
        "slug": "medicaid-aca-marketplace-ko",
        "category_id": "medicaid",
        "category_name": "메디케이드 & NJ 패밀리케어",
        "title": "ACA 마켓플레이스",
        "excerpt": "소득이 메디케이드 기준(138%)을 초과하는 중산층을 위한 GetCoveredNJ 주정부 건강보험 마켓플레이스 및 보험료 보조금 가이드.",
        "content_html": render_article_html(
            cat_title="메디케이드 & NJ 패밀리케어",
            title="뉴저지 공식 건강보험 마켓플레이스 (GetCoveredNJ & 주정부 추가 보조금)",
            portal_key="getcoverednj",
            exec_summary={
                "정책 취지": "소득이 연방 빈곤선 138%를 초과하여 메디케이드 자격이 되지 않는 개인과 자영업자, 직장 무보험 가구를 위해 연방 세액공제(APTC)와 뉴저지 주정부 자체 보조금(NJ Health-Care Affordability)을 이중으로 지원합니다.",
                "파격적인 이중 보조금": "뉴저지는 연방 보조금 외에 <strong>주정부 추가 지원금</strong>을 더 지급하여, 다수의 가구가 <span class='rc-chart-cell-highlight'>월 $10~$50 미만의 극저렴한 보험료</span>로 실버/골드 플랜에 가입합니다.",
                "가입 기간(Open Enrollment)": "매년 11월 1일부터 1월 31일까지 (단, 실직, 이사, 결혼, 출산 등 특별 자격 사유 발생 시 연중 가입 가능).",
                "운영 보험사": "Horizon Blue Cross Blue Shield of NJ, AmeriHealth, Oscar, Ambetter."
            },
            chart_info={
                "title": "GetCoveredNJ 4대 메탈 티어 플랜 비교 (Bronze, Silver, Gold, Platinum)",
                "badge": "플랜 등급별 비교",
                "headers": ["플랜 티어", "월 보험료 수준", "디덕터블 (Deductible)", "추천 가입 대상"],
                "rows": [
                    ["브론즈 (Bronze)", "<span class='rc-chart-badge rc-chart-badge-green'>가장 저렴 (월 $0~$30)</span>", "높음 ($6,000~$9,000)", "병원 이용이 적은 젊고 건강한 개인"],
                    ["<span class='rc-chart-cell-highlight'>실버 (Silver)</span>", "보통 (보조금 집중 지원)", "중간 (CSR 혜택 시 대폭 인하)", "<span class='rc-chart-cell-highlight'>강력 추천 (CSR 비용부담 인하 혜택)</span>"],
                    ["골드 (Gold)", "다소 높음", "낮음 ($500~$2,000)", "정기적인 전문의 진료나 만성질환자"],
                    ["플래티넘 (Platinum)", "가장 높음", "매우 낮음 ($0~$500)", "수술 예정자 또는 잦은 입원 환자"]
                ],
                "footnote": "FPL 250% 이하 가구가 '실버 플랜'을 선택하면 디덕터블과 코페이가 극적으로 낮아지는 추가 혜택(Cost-Sharing Reductions)을 받습니다."
            },
            sections=[
                {
                    "heading": "실버 플랜(Silver Plan)의 비밀: 비용 분담 인하(CSR)",
                    "content": """
<p>소득이 연방 빈곤선의 138%~250% 사이에 해당하는 가구는 무조건 <strong>실버 플랜</strong>을 선택해야 합니다. 동일한 보험료로 골드나 플래티넘 수준의 낮은 디덕터블(예: $500 이하)과 $5~$15 수준의 저렴한 의사 진료 코페이 혜택이 자동 적용되기 때문입니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "예상 연간 소득 증빙", "desc": "차기 연도 예상 세금보고 1040 및 W-2, 자영업 손익계산서."},
                {"doc": "가구원 신분증", "desc": "가족 전원의 소셜 번호 및 합법 체류 증빙."},
                {"doc": "직장 보험 미제공 확인", "desc": "직장에서 적격 건강보험을 제공하지 않는다는 증빙."}
            ],
            tips=[
                {"title": "자영업자 소득 과소/과다 신고 주의", "desc": "연말 정산 시 실제 세금보고 소득과 마켓플레이스 신고 소득에 큰 차이가 나면 보조금을 환수당할 수 있으므로 분기별 소득 변동을 업데이트하십시오."},
                {"title": "12월 31일 이전 가입 시 1월 1일 효력 개시", "desc": "새해 첫날부터 공백 없이 보험 혜택을 받으려면 12월 31일까지 플랜 선택과 첫 달 보험료 결제를 완료해야 합니다."}
            ],
            contacts=[
                {"name": "GetCoveredNJ 공식 콜센터", "val": "1-833-677-1010"},
                {"name": "공식 마켓플레이스", "val": "getcovered.nj.gov"}
            ]
        )
    })

    # art-61: Hearing Aid
    articles.append({
        "id": "art-61",
        "slug": "medicaid-hearing-aid-ko",
        "category_id": "medicaid",
        "category_name": "메디케이드 & NJ 패밀리케어",
        "title": "보청기 지원 (Hearing Aid)",
        "excerpt": "뉴저지 시니어 및 장애인을 위한 보청기 구입비 환급 프로그램(HAAAD) 및 메디케이드 전액 보조 규정.",
        "content_html": render_article_html(
            cat_title="메디케이드 & NJ 패밀리케어",
            title="시니어 보청기 지원 프로그램 (HAAAD - 청력 보조금 및 메디케이드)",
            portal_key="paad_seniorgold",
            exec_summary={
                "정책 취지": "난청으로 고통받는 시니어와 장애인이 경제적 부담 없이 고가의 보청기를 장만하여 사회적 단절과 치매 위험을 예방할 수 있도록 주정부가 구입비를 직접 지원합니다.",
                "지원 제도 1 - HAAAD": "PAAD 자격을 갖춘 65세 이상 시니어에게 보청기 1개당 <span class='rc-chart-cell-highlight'>최대 $500 (양이 최대 $1,000)</span>의 현금 환급 지원.",
                "지원 제도 2 - NJ FamilyCare 메디케이드": "메디케이드 수급자의 경우 지정 청각 클리닉을 통해 <span class='rc-chart-cell-highlight'>디지털 보청기 100% 전액 무료</span> 지급.",
                "신청 서류": "이비인후과 의사의 청력 검사 결과지 및 보청기 필요 처방전."
            },
            chart_info={
                "title": "뉴저지 보청기 지원 프로그램 비교 (HAAAD vs 메디케이드)",
                "badge": "지원 제도 비교",
                "headers": ["비교 항목", "HAAAD (PAAD 연계)", "NJ FamilyCare 메디케이드", "오리지널 메디케어 (Part B)"],
                "rows": [
                    ["지원 대상", "만 65세 이상 PAAD 자격자", "메디케이드 수급자 전체", "일반 메디케어 가입자"],
                    ["지원 금액", "<span class='rc-chart-cell-highlight'>귀 1개당 $500 환급</span>", "<span class='rc-chart-badge rc-chart-badge-green'>디지털 보청기 100% 무료</span>", "<span class='rc-chart-cell-highlight'>지원 없음 ($0 커버)</span>"],
                    ["교체 주기", "매 3년마다 재신청 가능", "매 2~3년마다 교체 가능", "해당 없음"],
                    ["배터리/수리", "일부 지원", "소모품 및 수리비 무료", "전액 본인 부담"]
                ],
                "footnote": "일부 메디케어 어드밴티지(Part C) 플랜의 경우 연간 $1,000~$2,500 한도의 자체 보청기 혜택을 제공하기도 합니다."
            },
            sections=[
                {
                    "heading": "HAAAD 환급 신청 3단계 절차",
                    "content": """
<ol class="rc-guide-list-num">
  <li><strong>이비인후과 진료:</strong> 면허를 소지한 의사(MD)로부터 청력 검사를 받고 보청기 처방전을 발급받습니다.</li>
  <li><strong>보청기 구입:</strong> 인가된 청각사(Audiologist)에게 보청기를 맞추고 상세 영수증(Receipt)을 수령합니다.</li>
  <li><strong>주정부 청구:</strong> HAAAD 신청서에 영수증과 의사 소견서를 첨부하여 고령화서비스국으로 우편 발송하면 $500~$1,000 환급 수표가 배송됩니다.</li>
</ol>
"""
                }
            ],
            checklist=[
                {"doc": "HAAAD 신청서", "desc": "주정부 양식 서명본."},
                {"doc": "의사 처방전 및 청력 검사표", "desc": "Audiogram 검사 결과지 원본."},
                {"doc": "보청기 상세 구매 영수증", "desc": "제조사, 모델명, 시리얼 번호가 기재된 완납 영수증."}
            ],
            tips=[
                {"title": "구입 전 PAAD 자격 유지 확인", "desc": "보청기를 결제하는 시점에 PAAD 자격이 유효한 상태여야 환급이 승인됩니다."}
            ],
            contacts=[
                {"name": "NJ Division of Aging Services HAAAD 부서", "val": "1-800-792-9745"},
                {"name": "공식 안내 포털", "val": "nj.gov/humanservices/doas"}
            ]
        )
    })

    # art-62: Pregnancy Medicaid
    articles.append({
        "id": "art-62",
        "slug": "medicaid-pregnancy-medicaid-ko",
        "category_id": "medicaid",
        "category_name": "메디케이드 & NJ 패밀리케어",
        "title": "임산부 메디케이드 (Pregnancy Medicaid)",
        "excerpt": "뉴저지 임산부를 위한 완화된 소득 기준(205% FPL), 산전/분만/산후 365일 100% 무료 보장 및 태아 영주권 규정.",
        "content_html": render_article_html(
            cat_title="메디케이드 & NJ 패밀리케어",
            title="임산부 전담 메디케이드 (NJ FamilyCare Maternity - 산후 365일 보장)",
            portal_key="njfamilycare",
            exec_summary={
                "정책 취지": "산모와 태아의 건강을 지키기 위해 일반 성인 메디케이드보다 대폭 완화된 소득 기준으로 임신 기간 및 출산 후 1년간 병원비 일체를 100% 무료 보장합니다.",
                "소득 기준 대폭 완화": "연방 빈곤선(FPL)의 <span class='rc-chart-cell-highlight'>205% 이하</span>까지 승인 (태아를 가구원 수에 미리 포함하여 계산).",
                "출산 후 365일 보장": "출산일로부터 만 1년(365일) 동안 소득이 증가하더라도 산모의 메디케이드 자격이 강제로 유지됩니다.",
                "체류 신분 예외": "합법 영주권 5년 대기 규정이 면제되며, 서류미비 산모도 응급 분만 메디케이드 및 주정부 기금을 통해 100% 무료 분만이 가능합니다."
            },
            chart_info={
                "title": "2026/2027 뉴저지 임산부 메디케이드(205% FPL) 소득 기준표",
                "badge": "태아 포함 가구원 수 산정",
                "headers": ["가구 규모 (태아 1명 포함)", "월 총소득 한도", "연간 총소득 한도", "보장 범위 및 코페이"],
                "rows": [
                    ["2인 가구 (산모 + 태아)", "<span class='rc-chart-cell-highlight'>$3,612 이하</span>", "$43,350 이하", "<span class='rc-chart-cell-highlight'>산전검사, 분만, 입원 $0</span>"],
                    ["3인 가구 (배우자 포함)", "<span class='rc-chart-cell-highlight'>$4,550 이하</span>", "$54,600 이하", "<span class='rc-chart-cell-highlight'>치과, 처방약, 초음파 $0</span>"],
                    ["4인 가구 (자녀 1명 추가)", "$5,490 이하", "$65,850 이하", "산후 365일간 전액 무료"]
                ],
                "footnote": "출생한 신생아는 출생 즉시 1년간 NJ FamilyCare 무료 자격이 자동으로 부여됩니다."
            },
            sections=[
                {
                    "heading": "추정 자격(Presumptive Eligibility, PE)으로 당일 즉시 진료",
                    "content": """
<p>임신 사실을 확인한 산모는 정식 서류 심사를 기다릴 필요 없이, 지정 산부인과 클리닉이나 보건소에서 <strong>추정 자격(PE)</strong>을 발급받아 신청 당일부터 초음파, 기형아 검사, 혈액 검사를 무료로 받을 수 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "임신 확인서", "desc": "산부인과 의사가 발급한 출산 예정일(Due Date) 기재 확인서."},
                {"doc": "소득 증명", "desc": "최근 1개월 급여명세서 또는 고용주 확인서."},
                {"doc": "신분증 및 주소 증명", "desc": "운전면허증 및 뉴저지 거주 증빙."}
            ],
            tips=[
                {"title": "WIC 영양 프로그램 동시 신청", "desc": "임산부 메디케이드 승인자는 분유, 유제품, 과일 등을 무상 지원하는 WIC 프로그램에 자동 패스로 가입됩니다."},
                {"title": "미국 출생 자녀 시민권 취득", "desc": "부모의 체류 신분과 무관하게 미국 영토 내에서 태어난 자녀는 헌법상 미국 시민권을 취득하며, 부모의 메디케이드 이용이 이민 신분에 불이익을 주지 않습니다."}
            ],
            contacts=[
                {"name": "NJ FamilyCare 임산부 핫라인", "val": "1-800-701-0710"},
                {"name": "NJ Maternal and Child Health", "val": "nj.gov/health/fhs"}
            ]
        )
    })

    return articles

print("cat_medicaid.py loaded successfully.")
