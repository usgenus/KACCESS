# -*- coding: utf-8 -*-
"""
Housing category articles (12 articles)
"""
from .common import render_article_html

def get_housing_articles():
    articles = []

    # art-1: Senior Apartments
    articles.append({
        "id": "art-1",
        "slug": "housing-senior-apartments-ko",
        "category_id": "housing",
        "category_name": "시니어 & 서민 주거",
        "title": "시니어 아파트 (Senior Apartments)",
        "excerpt": "뉴저지 만 62세 이상 시니어를 위한 HUD Section 202 소득 연동형 아파트(소득의 30% 렌트비) 및 버겐카운티 타운별 시니어 아파트 신청 안내.",
        "content_html": render_article_html(
            cat_title="시니어 & 서민 주거",
            title="시니어 아파트 (Senior Apartments - HUD Section 202 & 공공주택)",
            portal_key="hud_section202",
            exec_summary={
                "정책 취지": "만 62세 이상 독립적인 일상생활이 가능한 저소득 시니어에게 소득에 비례한 저렴한 임대료(월 소득의 30%)로 안전하고 쾌적한 주거 공간을 제공합니다.",
                "수혜 대상": "가구주 또는 배우자가 만 62세 이상인 미국 시민권자 또는 합법 영주권자 (카운티 지역 중위소득 50% 이하).",
                "2026년 임대료 규정": "조정 월 소득(Adjusted Monthly Income)의 약 30%만 임대료로 납부하며, 난방비·수도세 등 기본 유틸리티가 포함되거나 보조금(Utility Allowance)이 차감됩니다.",
                "신청 및 대기 기간": "각 아파트 관리사무소 또는 버겐카운티 주택청(HABC) 포털을 통해 개별 접수하며, 인기 타운(포트리, 팰팍 등)은 대기자 명부 오픈 시 즉시 접수해야 합니다."
            },
            chart_info={
                "title": "2026/2027 버겐카운티 시니어 아파트 소득 기준 (HUD AMI)",
                "badge": "HUD 소득 상한선",
                "headers": ["가구원 수", "30% AMI (최우선 순위)", "50% AMI (입주 자격 상한)", "예상 임대료 산정"],
                "rows": [
                    ["1인 가구", "<span class='rc-chart-cell-highlight'>$28,850 이하</span>", "$48,000 이하", "<span class='rc-chart-badge rc-chart-badge-blue'>월 소득의 30%</span> (평균 $250~$500)"],
                    ["2인 가구", "<span class='rc-chart-cell-highlight'>$32,950 이하</span>", "$54,850 이하", "<span class='rc-chart-badge rc-chart-badge-blue'>월 소득의 30%</span> (평균 $350~$650)"],
                    ["3인 가구", "$37,100 이하", "$61,700 이하", "월 조정소득의 30%"]
                ],
                "footnote": "자산 한도는 2026년 기준 약 $105,574 이하 권장이며, 거주 목적 외 주택 소유자는 입주가 제한될 수 있습니다."
            },
            sections=[
                {
                    "heading": "소득 연동형(Section 202) vs 고정 임대료형(LIHTC) 시니어 주택",
                    "content": """
<p>뉴저지 시니어 주거 지원은 크게 두 가지로 분류됩니다. 첫째, <strong>HUD Section 202 소득 연동형</strong>은 정부 지원을 통해 거주자의 월 소득의 약 30%만 납부하므로 소득이 전혀 없거나 소셜 시큐리티(SSI/SSA) 연금만 받는 어르신에게 가장 유리합니다.</p>
<p>둘째, <strong>LIHTC(저소득층 주택 세액 공제) 서민 아파트</strong>는 지역 중위소득 50%~60% 선의 고정 임대료(예: 스튜디오 $1,100~$1,400)가 적용되므로 일정 수준의 고정 연금이나 수입이 증빙되어야 합니다.</p>
"""
                },
                {
                    "heading": "버겐카운티 주요 한인 밀집 지역 시니어 아파트 현황",
                    "content": """
<p>버겐카운티 내 대표적인 한인 선호 시니어 단지는 다음과 같습니다:</p>
<ul class="rc-guide-list">
  <li><strong>포트리(Fort Lee):</strong> Fort Lee Housing Authority 운영 단지 (Harry J. Holtje House, Jack Alter Senior Center 인근). 교통과 편의시설이 뛰어나 대기 기간이 2~4년 소요될 수 있습니다.</li>
  <li><strong>팰리세이즈 파크(Palisades Park):</strong> 팰팍 주택청(PPHA) 시니어 아파트. 한인 상권 및 병의원 도보 접근성이 뛰어납니다.</li>
  <li><strong>잉글우드 & 클로스터:</strong> HABC 관할 단지 및 비영리 교회/사회복지 단체 운영 Section 202 복합 단지.</li>
</ul>
"""
                }
            ],
            checklist=[
                {"doc": "신분 증명서", "desc": "신청자 및 배우자의 유효한 여권, 뉴저지 운전면허증/Real ID, 소셜 시큐리티 카드 원본 및 사본."},
                {"doc": "합법 체류 증빙", "desc": "미국 시민권 증서 또는 영주권(Green Card) 앞뒷면 사본."},
                {"doc": "소득 증빙 서류", "desc": "최근 연도 연방 세금보고서(IRS Form 1040), W-2/1099, 사회보장국 연금 명세서(SSA-1099 또는 Award Letter)."},
                {"doc": "자산 증빙 내역", "desc": "최근 3~6개월 치 모든 은행(체킹/세이빙/CD) 거래 명세서 원본 전체 페이지."}
            ],
            tips=[
                {"title": "대기자 명부(Waiting List) 다중 등록", "desc": "하나의 아파트만 기다리지 마시고 버겐카운티, 허드슨카운티 내 3~5개 시니어 아파트에 동시에 신청서를 접수하여 대기 순번을 분산 확보하십시오."},
                {"title": "주소 및 연락처 변경 신고 필수", "desc": "대기 중 이사나 전화번호가 바뀌면 즉시 관리사무소에 서면 신고해야 합니다. 연락 두절 시 대기자 명부에서 자동 제명 처리됩니다."},
                {"title": "영주권 취득에 미치는 영향(Public Charge)", "desc": "HUD 시니어 아파트 및 공공주택 혜택은 연방 공적부조(Public Charge) 불이익 대상이 아니므로 영주권 신청이나 시민권 취득에 아무런 악영향을 주지 않습니다."}
            ],
            contacts=[
                {"name": "연방 HUD 뉴저지 지부", "val": "973-622-7900 (One Newark Center, Newark, NJ)"},
                {"name": "버겐카운티 주택청 (HABC)", "val": "201-336-7600 (One Bergen County Plaza, Hackensack, NJ)"},
                {"name": "포트리 주택청", "val": "201-947-7400 (1403 Teresa Dr, Fort Lee, NJ)"}
            ]
        )
    })

    # art-2: Affordable Housing
    articles.append({
        "id": "art-2",
        "slug": "housing-affordable-housing-ko",
        "category_id": "housing",
        "category_name": "시니어 & 서민 주거",
        "title": "저소득층 서민 아파트 (Affordable Housing)",
        "excerpt": "뉴저지 마운트 로렐(Mount Laurel) 법에 따른 서민 아파트(LIHTC) 자격, 지역 중위소득(AMI) 30%~80% 기준 및 주정부 주택 등록 포털 안내.",
        "content_html": render_article_html(
            cat_title="시니어 & 서민 주거",
            title="저소득층 서민 아파트 (Affordable Housing / LIHTC)",
            portal_key="habc_housing",
            exec_summary={
                "정책 취지": "뉴저지주 법령(Mount Laurel Doctrine) 및 연방 저소득 주택 세액공제(LIHTC)에 따라 민간 개발사가 시세보다 30%~60% 저렴한 가격으로 공급하는 주거 프로그램입니다.",
                "수혜 대상": "지역 중위소득(AMI)의 30%(극저소득), 50%(초저소득), 80%(중저소득) 이하 소득을 증빙할 수 있는 개인 및 가족.",
                "2026년 주거비 기준": "시세 대비 30%~60% 저렴한 고정 렌트비가 책정되며, 입주자는 매년 소득 증빙(Recertification)을 제출해야 합니다.",
                "선정 방식": "Piazza & Associates, CGP&H, NJHRC 등 공인 대행 포털을 통한 온라인 로또(추첨) 및 순번 대기 접수."
            },
            chart_info={
                "title": "2026/2027 뉴저지 버겐·허드슨 카운티 서민주택 소득 등급표",
                "badge": "지역 중위소득 (AMI)",
                "headers": ["가구 규모", "30% AMI (Extremely Low)", "50% AMI (Very Low)", "80% AMI (Moderate)"],
                "rows": [
                    ["1인 가구", "<span class='rc-chart-cell-highlight'>$28,850 이하</span>", "$48,000 이하", "$76,800 이하"],
                    ["2인 가구", "<span class='rc-chart-cell-highlight'>$32,950 이하</span>", "$54,850 이하", "$87,750 이하"],
                    ["3인 가구", "$37,100 이하", "$61,700 이하", "$98,700 이하"],
                    ["4인 가구", "$41,200 이하", "$68,550 이하", "$109,650 이하"]
                ],
                "footnote": "각 단지별로 최소 소득 기준(월 렌트비의 2.5~3배 수입 증빙)이 요구될 수 있습니다."
            },
            sections=[
                {
                    "heading": "서민 아파트(LIHTC)와 섹션 8의 차이점",
                    "content": """
<p>서민 아파트는 <strong>임대료가 유닛 자체에 고정</strong>되어 있는 방식입니다. 예를 들어 50% AMI 유닛의 임대료가 월 $1,250으로 정해져 있다면 입주자의 실제 수입과 관계없이 매달 $1,250을 납부해야 합니다. 따라서 소득이 너무 낮으면 렌트비 납부 능력이 없다고 판단되어 입주가 거절될 수 있으므로 최저 소득 기준(Minimum Income)을 확인해야 합니다.</p>
"""
                },
                {
                    "heading": "뉴저지 3대 공식 서민주택 관리 포털",
                    "content": """
<ul class="rc-guide-list">
  <li><strong>Piazza & Associates:</strong> 뉴저지 북부/중부 프리미엄 신축 서민 유닛 전담 대행사 (온라인 예비신청 접수).</li>
  <li><strong>CGP&H (AffordableHomesNewJersey.com):</strong> 타운별 서민주택 추첨 및 입주자 적격 심사 총괄.</li>
  <li><strong>NJHRC (New Jersey Housing Resource Center):</strong> 주정부 공식 서민주택 통합 데이터베이스.</li>
</ul>
"""
                }
            ],
            checklist=[
                {"doc": "세금보고 서류", "desc": "최근 2년간의 연방 세금보고서(IRS 1040) 및 세무서 발행 세금 증명서(Tax Return Transcript)."},
                {"doc": "소득 증빙 자료", "desc": "연속된 최근 4~6장의 급여명세서(Paystubs), 고용주 확인서, 또는 소셜 연금 증명서."},
                {"doc": "신용 보고서", "desc": "단지별 신용 점수 기준(보통 600~650점 이상) 충족 증빙."},
                {"doc": "주거 이력", "desc": "이전 집주인 연락처 및 최근 1년간의 렌트비 정시 납부 증빙 내역."}
            ],
            tips=[
                {"title": "신축 아파트 청약(Lottery) 오픈 알림 등록", "desc": "AffordableHomesNewJersey 웹사이트에 프로필을 등록해 두면 버겐/패세익 카운티 내 신축 럭셔리 아파트의 서민 유닛 로또가 열릴 때 즉시 이메일 알림을 받을 수 있습니다."},
                {"title": "자산에서 발생하는 이자 소득도 합산", "desc": "은행 예금이나 주식 계좌의 원금 자체가 소득은 아니지만, 연방 HUD 규정에 따라 일정 비율의 간주 이자 소득(Imputed Asset Income)이 연간 소득에 합산됩니다."}
            ],
            contacts=[
                {"name": "NJ Housing Resource Center (NJHRC)", "val": "1-877-428-8844 (온라인 포털: njhrc.gov)"},
                {"name": "Affordable Homes New Jersey (CGP&H)", "val": "609-664-2769 (affordablehomesnewjersey.com)"},
                {"name": "Piazza & Associates", "val": "609-786-1100 (piazzanj.com)"}
            ]
        )
    })

    # art-3: Section 8
    articles.append({
        "id": "art-3",
        "slug": "housing-section-8-housing-choice-voucher-ko",
        "category_id": "housing",
        "category_name": "시니어 & 서민 주거",
        "title": "섹션 8 주택 바우처 (Section 8 Housing Choice Voucher)",
        "excerpt": "뉴저지 저소득층을 위한 연방 임대료 보조 바우처(HCV) 제도, 버겐카운티 HABC 신청 절차 및 바우처 소지자의 민간 주택 렌트 가이드.",
        "content_html": render_article_html(
            cat_title="시니어 & 서민 주거",
            title="섹션 8 주택 바우처 (Section 8 Housing Choice Voucher)",
            portal_key="habc_housing",
            exec_summary={
                "정책 취지": "저소득 가구가 민간 임대 시장에서 원하는 집을 자유롭게 선택하여 거주할 수 있도록 연방정부(HUD)가 렌트비의 상당 부분을 집주인에게 직접 지급하는 바우처 제도입니다.",
                "수혜 대상": "지역 중위소득(AMI) 50% 이하 가구 (실제 신규 발급자의 75% 이상은 30% 이하 극저소득층 우선 배정).",
                "지원 규모": "가구 소득의 30%~40%만 본인이 부담하며, 나머지 적정 임대료(Fair Market Rent) 차액 전액을 주택청이 대납합니다.",
                "신청처": "버겐카운티 주택청(HABC) 또는 뉴저지 주정부 커뮤니티 개발국(DCA) 대기자 명부 접수."
            },
            chart_info={
                "title": "2026/2027 버겐카운티 섹션 8 적정 임대료 기준 (Fair Market Rent)",
                "badge": "HUD FMR 기준 한도",
                "headers": ["방 개수 (Bedrooms)", "연방 HUD 기준 렌트비(FMR)", "가구 부담금 (소득 30%)", "주택청 보조금 규모"],
                "rows": [
                    ["스튜디오 (0 Bed)", "<span class='rc-chart-cell-highlight'>$1,680</span>", "월 약 $300~$500", "최대 $1,180~$1,380 지원"],
                    ["1 베드룸 (1 Bed)", "<span class='rc-chart-cell-highlight'>$1,940</span>", "월 약 $350~$550", "최대 $1,390~$1,590 지원"],
                    ["2 베드룸 (2 Bed)", "<span class='rc-chart-cell-highlight'>$2,320</span>", "월 약 $400~$650", "최대 $1,670~$1,920 지원"],
                    ["3 베드룸 (3 Bed)", "<span class='rc-chart-cell-highlight'>$2,950</span>", "월 약 $500~$800", "최대 $2,150~$2,450 지원"]
                ],
                "footnote": "집주인이 요구하는 렌트비가 FMR을 초과할 경우 본인 부담금이 소득의 40%까지 증액될 수 있습니다."
            },
            sections=[
                {
                    "heading": "바우처 승인 후 집 구하기 절차 (60~120일 기한)",
                    "content": """
<p>섹션 8 바우처를 수령하면 통상 <strong>60일(최대 120일까지 연장 가능)</strong> 이내에 바우처를 받아주는 민간 아파트나 주택을 찾아 임대차 계약서를 제출해야 합니다.</p>
<p>뉴저지주 법률에 따라 집주인이 정당한 사유 없이 <em>'섹션 8 바우처를 소지했다는 이유만으로'</em> 임대를 거절하는 행위는 주정부 인권법(Law Against Discrimination) 위반에 해당합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "바우처 원본", "desc": "관할 주택청에서 정식 교부받은 Housing Choice Voucher 원본 서류."},
                {"doc": "가족관계 증빙", "desc": "가구원 전원의 출생증명서, 여권, 소셜 시큐리티 카드 사본."},
                {"doc": "소득 증명", "desc": "모든 가구원의 최근 소득 증빙(급여, 소셜 연금, 실업수당, 양육비 등)."},
                {"doc": "입주 희망 주택 서류", "desc": "집주인이 작성한 RTA(Request for Tenancy Approval) 패킷."}
            ],
            tips=[
                {"title": "카운티 주택청 대기자 명부 공고 주기 확인", "desc": "섹션 8 대기자 명부는 수년에 한 번씩 불시에 며칠간만 열립니다. HABC 웹사이트 공지사항을 정기적으로 모니터링해야 합니다."},
                {"title": "주택 안전 검사(HQS Inspection) 통과", "desc": "계약 전 주택청 조사관이 연기감지기, 창문 잠금장치, 납 성분 페인트 유무 등 안전 기준을 실사하여 합격해야 최종 입주가 완료됩니다."}
            ],
            contacts=[
                {"name": "버겐카운티 주택청 섹션 8 부서", "val": "201-336-7600 (habcnj.org)"},
                {"name": "NJ DCA 주택 복지국", "val": "609-292-4080 (nj.gov/dca)"}
            ]
        )
    })

    # art-4: Senior Freeze
    articles.append({
        "id": "art-4",
        "slug": "housing-property-tax-reimbursement-senior-freeze-ko",
        "category_id": "housing",
        "category_name": "시니어 & 서민 주거",
        "title": "재산세 환급 (PTR / Senior Freeze)",
        "excerpt": "뉴저지 65세 이상 시니어를 위한 재산세 동결(PTR) 프로그램. 기준 연도 세액과의 차액을 주정부가 전액 환급해 주는 핵심 혜택.",
        "content_html": render_article_html(
            cat_title="시니어 & 서민 주거",
            title="재산세 환급 동결 프로그램 (Senior Freeze / PTR-1 & PTR-2)",
            portal_key="staynj_freeze",
            exec_summary={
                "정책 취지": "뉴저지 시니어 주택 소유자가 매년 상승하는 재산세 때문에 정든 집을 팔지 않도록, 기준 연도 재산세와 현재 납부한 재산세의 차액 전액을 주정부가 현금 환급해 줍니다.",
                "수혜 대상": "신청 연도 기준 만 65세 이상 또는 영구 장애인 연금(SSDI) 수령자로서 뉴저지 10년 이상 거주 및 현재 주택 3년 이상 소유자.",
                "2026년 대폭 상향된 소득 한도": "2026년 기준 연소득 한도가 <span class='rc-chart-cell-highlight'>$163,050</span>으로 대폭 완화되어 중산층 시니어까지 혜택 범위가 확대되었습니다.",
                "신청 양식": "신규 신청자는 PTR-1 (또는 온라인 PAS-1), 기존 수령자는 매년 자동 우편 발송되는 맞춤형 PTR-2 양식 작성."
            },
            chart_info={
                "title": "2026/2027 뉴저지 시니어 프리즈(Senior Freeze) 환급 시뮬레이션",
                "badge": "차액 전액 환급",
                "headers": ["기준 연도 (Base Year)", "기준 재산세", "2026년 납부 재산세", "연간 주정부 환급액"],
                "rows": [
                    ["2020년 자격 취득", "$8,500", "$12,200", "<span class='rc-chart-cell-highlight'>$3,700 현금 환급</span>"],
                    ["2022년 자격 취득", "$9,800", "$12,200", "<span class='rc-chart-cell-highlight'>$2,400 현금 환급</span>"],
                    ["2025년 신규 신청", "$11,800", "$12,200", "<span class='rc-chart-cell-highlight'>$400 현금 환급</span> (동결 시작)"]
                ],
                "footnote": "ANCHOR 및 Stay NJ 혜택과 중복 수령이 가능하며 주정부 통합 신청 시스템(PAS-1)에서 원스톱 처리됩니다."
            },
            sections=[
                {
                    "heading": "소득 인정 범위 및 주택 소유 기간 요건",
                    "content": """
<p>시니어 프리즈는 뉴저지에 <strong>연속 10년 이상 거주</strong>하고, 현재 신청 대상 주택에 <strong>최소 3년 이상 본인 명의로 거주</strong>해야 합니다. 모바일 홈 소유자도 대지 임대료의 18%를 재산세 납부액으로 간주하여 신청할 수 있습니다.</p>
<p>소득 산정 시 소셜 시큐리티 연금, 은퇴 연금(IRA/401k 인출액), 이자 및 배당 소득, 임대 소득 등이 모두 포함되나, 연소득 $163,050 이하이면 전액 수령 자격이 주어집니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "PTR-1 또는 PTR-2 신청서", "desc": "본인 서명 및 배우자 공동 서명 완료된 공식 신청서."},
                {"doc": "타운 세무관 날인 서류", "desc": "거주 타운 세무과(Tax Collector)에서 직인을 받은 재산세 완납 증명서(Form PTR-1A)."},
                {"doc": "2년치 소득 증빙", "desc": "신청 연도 및 전년도 연방 세금보고서 1040 및 W-2, 1099 서류 전체."},
                {"doc": "소셜 연금 증명", "desc": "사회보장국 SSA-1099 양식 사본."}
            ],
            tips=[
                {"title": "매년 가을 환급 수표 또는 계좌 입금 확인", "desc": "정상 접수된 시니어 프리즈 환급금은 통상 7월 중순부터 10월 사이에 다이렉트 디포짓 또는 우편 수표로 지급됩니다."},
                {"title": "재산세 체납 시 즉시 실격 주의", "desc": "해당 연도의 분기별 재산세 납부 마감일을 하루라도 넘겨 체납 상태가 되면 그해 환급 자격이 취소될 수 있으므로 정시 납부가 필수적입니다."}
            ],
            contacts=[
                {"name": "Senior Freeze 전용 핫라인", "val": "1-800-882-6597 (월~금 오전 8:30~오후 4:30)"},
                {"name": "온라인 상태 조회 포털", "val": "nj.gov/treasury/taxation/ptr"}
            ]
        )
    })

    # art-5: Stay NJ
    articles.append({
        "id": "art-5",
        "slug": "housing-stay-nj-program-ko",
        "category_id": "housing",
        "category_name": "시니어 & 서민 주거",
        "title": "스테이 뉴저지 (Stay NJ)",
        "excerpt": "뉴저지 65세 이상 시니어 주택 소유자 대상 획기적 재산세 50%(연간 최대 $6,500) 감면 프로그램 및 통합 신청서(PAS-1) 분석.",
        "content_html": render_article_html(
            cat_title="시니어 & 서민 주거",
            title="스테이 뉴저지 (Stay NJ - 50% 재산세 최대 $6,500 환급)",
            portal_key="staynj_freeze",
            exec_summary={
                "정책 취지": "뉴저지 시니어들이 높은 재산세 부담으로 타주로 이주하는 것을 방지하기 위해, 재산세의 최대 50%(연간 최대 $6,500)를 환급해 주는 뉴저지 역사상 최대 규모의 세금 감면 정책입니다.",
                "수혜 대상": "만 65세 이상의 뉴저지 주택 소유자로서 연간 총소득(Gross Income) $500,000 이하 가정.",
                "지급 방식": "기존 ANCHOR와 Senior Freeze 환급금을 먼저 계산한 후, 합산 혜택이 재산세의 50%(상한 $6,500)에 도달하도록 차액을 Stay NJ가 추가 지급합니다.",
                "접수 경로": "주정부 단일 통합 온라인 포털(propertytaxreliefapp.nj.gov)에서 PAS-1 서식으로 원스톱 신청."
            },
            chart_info={
                "title": "2026 Stay NJ 혜택 산정 공식 (예시: 연간 재산세 $10,000 납부 시)",
                "badge": "최대 50% 감면",
                "headers": ["프로그램 구분", "기존 환급액", "Stay NJ 추가 지급", "최종 총 혜택액"],
                "rows": [
                    ["ANCHOR 혜택", "$1,750 수령", "-", "$1,750"],
                    ["Senior Freeze", "$500 수령", "-", "$500"],
                    ["Stay NJ 보전금", "-", "<span class='rc-chart-cell-highlight'>$2,750 추가 지급</span>", "<span class='rc-chart-cell-highlight'>$2,750</span>"],
                    ["<strong>합계 (목표 50%)</strong>", "$2,250", "$2,750", "<strong>$5,000 (재산세의 정확히 50%)</strong>"]
                ],
                "footnote": "재산세가 연간 $13,000 이상인 경우 50% 계산 결과와 무관하게 법적 최대 상한선인 $6,500이 지급됩니다."
            },
            sections=[
                {
                    "heading": "Stay NJ 분기별 분할 지급 일정",
                    "content": """
<p>Stay NJ 환급금은 일시불로 나오는 것이 아니라 1년에 4회(분기별: 2월, 5월, 8월, 11월)로 나누어 균등 지급됩니다. 이를 통해 주택 소유자는 분기별 재산세 고지서가 나올 때마다 실질적인 세금 감면 효과를 체감할 수 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "통합 신청서(PAS-1)", "desc": "온라인 주정부 포털 또는 서면 양식 PAS-1 접수 내역."},
                {"doc": "소득 증빙 서류", "desc": "신청 연도 및 전년도 세금보고서(Senior Freeze 동시 심사용)."},
                {"doc": "거주 및 주택 명의 증빙", "desc": "해당 세무 연도 1월 1일부터 12월 31일까지 거주한 본인 명의 주택 증서(Deed) 또는 모기지 명세서."}
            ],
            tips=[
                {"title": "매년 직접 신청 필수 (자동 갱신 없음)", "desc": "Stay NJ는 앵커(ANCHOR)와 달리 자동 신청 제도가 없습니다. 매년 PAS-1 통합 서식을 통해 직접 접수해야 세 가지 혜택을 빠짐없이 받으실 수 있습니다."},
                {"title": "온라인 신청 시 Direct Deposit 선택", "desc": "은행 계좌 정보를 등록하여 온라인 신청을 완료하면 우편 수표 분실 위험 없이 계좌로 신속하게 입금됩니다."}
            ],
            contacts=[
                {"name": "Stay NJ & 통합 신청 전용 핫라인", "val": "1-888-238-1233 (월~금 오전 8:30~오후 5:30)"},
                {"name": "주정부 통합 신청 포털", "val": "propertytaxreliefapp.nj.gov"}
            ]
        )
    })

    # art-6: ANCHOR
    articles.append({
        "id": "art-6",
        "slug": "housing-anchor-ko",
        "category_id": "housing",
        "category_name": "시니어 & 서민 주거",
        "title": "앵커(ANCHOR)",
        "excerpt": "뉴저지 주택 소유주(최대 $1,750) 및 세입자(최대 $700)를 위한 재산세 환급 ANCHOR 프로그램 자격 요건과 자동 승인 확인법.",
        "content_html": render_article_html(
            cat_title="시니어 & 서민 주거",
            title="앵커 재산세 환급 (ANCHOR Benefit - 주택 소유자 및 렌터)",
            portal_key="nj_taxation",
            exec_summary={
                "정책 취지": "뉴저지 주민들의 주거비 부담을 덜어주기 위해 주정부 세수를 환원하는 대표적인 현금 환급 프로그램으로, 주택 소유자뿐만 아니라 렌트 세입자도 혜택을 받습니다.",
                "수혜 대상": "해당 세무 연도 10월 1일 기준 뉴저지 주택 소유자(소득 $250,000 이하) 또는 합법 세입자(소득 $150,000 이하).",
                "환급액 규모": "65세 이상 시니어 소유자 최대 <span class='rc-chart-cell-highlight'>$1,750</span>, 일반 소유자 $1,500, 65세 이상 세입자 <span class='rc-chart-cell-highlight'>$700</span>, 일반 세입자 $450.",
                "신청 및 확인": "주정부로부터 자동 승인 확인 우편(Confirmation Letter)을 받은 주민은 별도 조치 없이 자동 입금."
            },
            chart_info={
                "title": "2026/2027 뉴저지 ANCHOR 환급금 지급 기준표",
                "badge": "신분 및 연령별 금액",
                "headers": ["주거 형태", "연령 구분", "연소득 한도", "최종 환급 금액"],
                "rows": [
                    ["주택 소유자", "만 65세 이상 시니어", "$150,000 이하", "<span class='rc-chart-cell-highlight'>$1,750 현금 지급</span>"],
                    ["주택 소유자", "만 65세 이상 시니어", "$150,001 ~ $250,000", "$1,250 현금 지급"],
                    ["주택 소유자", "만 64세 이하 일반", "$150,000 이하", "$1,500 현금 지급"],
                    ["주택 세입자(Renter)", "만 65세 이상 시니어", "$150,000 이하", "<span class='rc-chart-cell-highlight'>$700 현금 지급</span>"],
                    ["주택 세입자(Renter)", "만 64세 이하 일반", "$150,000 이하", "$450 현금 지급"]
                ],
                "footnote": "부부 합산 보고 기준이며, 세입자의 경우 임대료에 재산세가 포함되지 않는 면세 아파트 거주자는 제외됩니다."
            },
            sections=[
                {
                    "heading": "자동 신청 대상자 확인 및 신규 접수 기한",
                    "content": """
<p>이전 연도에 ANCHOR 혜택을 정상 수령하고 주소나 은행 계좌에 변동이 없는 가구는 주정부 데이터베이스를 통해 자동으로 신청이 완료됩니다. 주정부로부터 녹색/보라색 확인 서한을 받으셨다면 추가 신청이 필요 없습니다.</p>
<p>새로 뉴저지로 이사했거나, 주택을 매입했거나, 확인 서한을 받지 못한 주민은 <strong>주정부 ANCHOR 온라인 포털</strong>에서 PIN 번호와 소셜 번호를 입력하여 신규 접수해야 합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "뉴저지 소득세 신고서(NJ-1040)", "desc": "해당 기준 연도 뉴저지 세금보고서 사본."},
                {"doc": "ANCHOR ID 및 PIN 번호", "desc": "주정부에서 우편으로 발송한 7자리 ID와 4자리 PIN."},
                {"doc": "세입자 임대 증빙", "desc": "렌트 계약서(Lease Agreement) 및 월 임대료 송금 영수증/수표 사본."},
                {"doc": "환급 계좌 정보", "desc": "본인 명의 은행 라우팅 번호(Routing) 및 계좌 번호(Account)."}
            ],
            tips=[
                {"title": "우편물 주소 업데이트 주의", "desc": "이사를 하신 경우 주정부 조세국 웹사이트에서 주소 변경 신고를 먼저 완료해야 이전 거주지로 환급 수표가 오발송되는 사고를 방지할 수 있습니다."},
                {"title": "사기 주의", "desc": "주정부는 절대 문자 메시지(SMS)나 이메일 링크를 통해 개인정보 입력을 요구하지 않습니다. 반드시 공식 웹사이트(nj.gov/treasury/taxation)를 이용하십시오."}
            ],
            contacts=[
                {"name": "ANCHOR 전용 핫라인", "val": "1-888-238-1233 (월~금 오전 8:30~오후 5:30)"},
                {"name": "조세국 공식 접수처", "val": "nj.gov/treasury/taxation/anchor"}
            ]
        )
    })

    # art-7: Assisted Living
    articles.append({
        "id": "art-7",
        "slug": "housing-assisted-living-ko",
        "category_id": "housing",
        "category_name": "시니어 & 서민 주거",
        "title": "어시스티드 리빙 (Assisted Living)",
        "excerpt": "일상생활 보조가 필요한 시니어를 위한 어시스티드 리빙 시설 입주 절차, 메디케이드 MLTSS 보조 프로그램 및 비용 절감 전략.",
        "content_html": render_article_html(
            cat_title="시니어 & 서민 주거",
            title="어시스티드 리빙 (Assisted Living - 메디케이드 MLTSS 연계)",
            portal_key="bergen_seniors",
            exec_summary={
                "정책 취지": "완전한 너싱홈(요양원) 입원은 불필요하지만, 식사·목욕·투약 관리 등 24시간 생활 보조가 필요한 어르신에게 프라이버시가 보장되는 독립 주거와 간호 돌봄을 복합 제공합니다.",
                "수혜 대상": "만 65세 이상 또는 장애인으로서 일상생활 수행능력(ADL) 3개 이상에서 간병 보조가 요구되는 자.",
                "비용 및 지원": "월 $5,000~$8,000 수준의 민간 비용이 소요되나, 뉴저지 메디케이드 MLTSS 승인을 받으면 주정부 보조를 통해 본인 부담금을 획기적으로 낮출 수 있습니다.",
                "시설 형태": "원룸 스튜디오 또는 1베드룸 아파트 형태이며, 3식 식사 제공, 하우스키핑, 24시간 응급 호출 시스템 완비."
            },
            chart_info={
                "title": "뉴저지 어시스티드 리빙(AL) vs 너싱홈(SNF) 비교 분석",
                "badge": "시설 유형별 비교",
                "headers": ["구분 항목", "어시스티드 리빙 (AL)", "널싱홈 (요양원 / SNF)", "독립 시니어 아파트"],
                "rows": [
                    ["돌봄 강도", "중등도 (식사, 투약, 목욕 보조)", "<span class='rc-chart-cell-highlight'>고도 (24시간 숙련 간호, 침상 간병)</span>", "최소 (독립 일상생활)"],
                    ["주거 형태", "개인 아파트/스튜디오", "2인 1실 병실형 다수", "독립형 아파트"],
                    ["메디케이드 지원", "<span class='rc-chart-badge rc-chart-badge-blue'>MLTSS 승인 시 지원</span>", "메디케이드 전액 지원", "Section 202 지원"],
                    ["월 평균 비용", "민간 $5,500~$8,500", "민간 $12,000~$15,000", "소득의 30% ($300~$600)"]
                ],
                "footnote": "대부분의 어시스티드 리빙은 1~2년간 사비(Private Pay) 납부 후 메디케이드 베드로 전환(Spend-down)하는 규정을 두고 있습니다."
            },
            sections=[
                {
                    "heading": "어시스티드 리빙의 주요 지원 서비스 범위",
                    "content": """
<p>어시스티드 리빙 시설에서는 전문 영양사가 설계한 1일 3식 식사 제공, 주 1~2회 룸 청소 및 린넨 세탁 서비스, 공인 간호사의 투약 스케줄 관리 및 바이탈 체크, 24시간 응급 벨 응답 시스템, 단지 내 문화·여가 사교 프로그램이 기본 제공됩니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "의사 진단서 및 소견서", "desc": "주치의가 작성한 최근 건강 진단서 및 ADL(일상생활수행) 평가서."},
                {"doc": "투약 목록", "desc": "복용 중인 모든 처방약 목록 및 의사의 투약 지침서."},
                {"doc": "재정 증빙 자료", "desc": "최근 1~2년간 사비(Private Pay) 지불 능력을 증빙하는 은행 잔고 증명서."},
                {"doc": "MLTSS 승인서 (해당자)", "desc": "메디케이드 관리의료(MLTSS) 사전 승인 통지서."}
            ],
            tips=[
                {"title": "메디케이드 베드 확보 여부 사전 확인", "desc": "사비(Private Pay)로 입주한 후 자금이 소진되었을 때 퇴소하지 않고 메디케이드 베드로 전환 가능한지 계약서에 명문화해야 합니다."},
                {"title": "한국어 가능 직원 및 한식 제공 시설 탐색", "desc": "버겐카운티 내에는 한인 전담 윙이나 한식 메뉴를 제공하는 시설들이 있으므로 사전에 견학(Tour)을 신청해 현장을 확인하십시오."}
            ],
            contacts=[
                {"name": "버겐카운티 노인복지국 (ADRC)", "val": "201-336-7400"},
                {"name": "NJ Department of Health 시설 조회", "val": "nj.gov/health/ltc"}
            ]
        )
    })

    # art-67: Continuing Care Housing
    articles.append({
        "id": "art-67",
        "slug": "housing-continuing-care-housing-ko",
        "category_id": "housing",
        "category_name": "시니어 & 서민 주거",
        "title": "연속형 은퇴 주거 단지(Continuing Care Housing)",
        "excerpt": "건강 상태 변화에 따라 독립 주거, 보조 주거, 전문 간호 너싱홈까지 한 단지에서 평생 거주하는 CCRC 은퇴 주거 단지 분석.",
        "content_html": render_article_html(
            cat_title="시니어 & 서민 주거",
            title="연속형 은퇴 주거 단지 (CCRC / Life Plan Community)",
            portal_key="hud_section202",
            exec_summary={
                "정책 취지": "건강할 때 독립 생활(Independent Living)로 입주하여, 추후 건강이 악화되더라도 다른 곳으로 이사할 필요 없이 단지 내 어시스티드 리빙이나 전문 너싱홈으로 이동하여 평생 케어를 받는 주거 모델입니다.",
                "수혜 대상": "만 62세 이상 건강한 상태로 입주 가능한 시니어 부부 및 독신.",
                "계약 유형": "입주금(Entrance Fee) 전액 보장형, 환급형(Refundable), 월 임대형 등 다양한 계약 방식 존재.",
                "주요 장점": "배우자 중 한 명이 치매나 중증 질환으로 간호가 필요해져도 같은 단지 내에서 함께 생활 가능."
            },
            chart_info={
                "title": "CCRC 주요 3대 계약 모델 비교 (Life Care Contracts)",
                "badge": "계약 유형별 분석",
                "headers": ["계약 모델", "입주 보증금 (Entrance Fee)", "월 생활비 (Monthly Fee)", "향후 간호 케어 보장"],
                "rows": [
                    ["Type A (Life Care)", "높음 ($250,000~$800,000)", "안정적 (추가 인상 미미)", "<span class='rc-chart-cell-highlight'>무제한 전문 간호 전액 포함</span>"],
                    ["Type B (Modified)", "중간 ($150,000~$450,000)", "중간 (간호 이동 시 일부 인상)", "지정 기간(예: 30~60일) 간호 무료"],
                    ["Type C (Fee-for-Service)", "낮음 ($80,000~$200,000)", "이용 시 시세 지불", "실제 간호 서비스 이용 시 일일 과금"]
                ],
                "footnote": "입주 보증금의 50%~90%를 사후 유족에게 환급해 주는 플랜 선택이 가능합니다."
            },
            sections=[
                {
                    "heading": "CCRC 단지 선택 시 필수 점검 사항",
                    "content": """
<p>CCRC 단지는 재정 건전성이 매우 중요합니다. 운영 재단의 신용등급, 입주율(Occupancy Rate 90% 이상 권장), 보증금 반환 조건, 단지 내 의료진 상주 여부를 전문 법률/재정 전문가와 함께 검토해야 합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "입주 계약서", "desc": "변호사 검토를 거친 CCRC 장기 계약서 및 환급 조항."},
                {"doc": "건강 검진 결과서", "desc": "입주 시점의 인지 기능 및 독립 일상생활 가능 의사 진단서."},
                {"doc": "재정 능력 입증서", "desc": "평생 월 생활비(Monthly Fee)를 납부할 수 있는 자산 및 연금 흐름 증빙."}
            ],
            tips=[
                {"title": "건강할 때 미리 계약해야 입주 가능", "desc": "이미 간병이나 치매 진단을 받은 후에는 독립 유닛으로 입주가 불가능하므로 활동적일 때 사전 계획하십시오."},
                {"title": "보증금의 의료비 소득공제 가능 여부", "desc": "IRS 세법에 따라 CCRC 입주 보증금 및 월 생활비 중 의료 케어에 해당하는 비율은 연방 세금보고 시 의료비 공제 대상이 될 수 있습니다."}
            ],
            contacts=[
                {"name": "LeadingAge New Jersey & Delaware", "val": "609-452-1161 (leadingagenjde.org)"},
                {"name": "NJ Division of Consumer Affairs", "val": "1-800-242-5846"}
            ]
        )
    })

    # art-68: Property Tax Relief Programs
    articles.append({
        "id": "art-68",
        "slug": "housing-nj-property-tax-relief-programs-ko",
        "category_id": "housing",
        "category_name": "시니어 & 서민 주거",
        "title": "재산세 감면 프로그램(Property Tax Relief Programs)",
        "excerpt": "뉴저지 3대 재산세 감면 제도(Stay NJ, Senior Freeze, ANCHOR)의 핵심 차이점 비교 및 중복 수혜 극대화 로드맵.",
        "content_html": render_article_html(
            cat_title="시니어 & 서민 주거",
            title="뉴저지 3대 재산세 감면 프로그램 종합 비교 (Stay NJ · Senior Freeze · ANCHOR)",
            portal_key="staynj_freeze",
            exec_summary={
                "정책 취지": "미국 내 최고 수준인 뉴저지 재산세 부담을 낮추기 위해 주정부가 운영하는 3대 감면 제도를 총정리하여 주민들이 누락 없이 최대 혜택을 받도록 지원합니다.",
                "핵심 포인트": "Stay NJ, Senior Freeze, ANCHOR 세 프로그램은 상호 배타적이지 않으며, 단일 통합 포털(PAS-1)에서 중복 검토되어 최종 세액의 최대 50%까지 환급됩니다.",
                "수혜 자격 요약": "ANCHOR(소득 $250,000 이하 누구나), Senior Freeze(65세 이상, 10년 거주, 소득 $163,050 이하), Stay NJ(65세 이상, 소득 $500,000 이하).",
                "신청 원칙": "신규 신청자는 PAS-1 통합 신청서로 세 가지를 동시에 접수하는 것이 가장 안전합니다."
            },
            chart_info={
                "title": "뉴저지 3대 재산세 완화 프로그램 한눈에 비교",
                "badge": "3대 제도 종합 비교",
                "headers": ["프로그램", "신청 연령", "소득 한도", "최대 혜택 금액", "신청 방식"],
                "rows": [
                    ["<span class='rc-chart-cell-highlight'>Stay NJ</span>", "만 65세 이상", "$500,000 이하", "<span class='rc-chart-cell-highlight'>재산세 50% (최대 $6,500)</span>", "매년 PAS-1 신청"],
                    ["<span class='rc-chart-cell-highlight'>Senior Freeze</span>", "만 65세 이상 (장애인 포함)", "$163,050 이하", "<span class='rc-chart-cell-highlight'>기준연도 대비 상승액 전액</span>", "PTR-1 / PTR-2"],
                    ["<span class='rc-chart-cell-highlight'>ANCHOR</span>", "전 연령 (시니어 우대)", "소유 $250,000 / 세입 $150,000", "<span class='rc-chart-cell-highlight'>$450 ~ $1,750 현금 환급</span>", "자동 또는 포털 접수"]
                ],
                "footnote": "추가로 시니어 및 참전용사를 위한 $250 타운 고정 재산세 공제(Property Tax Deduction)도 중복 신청 가능합니다."
            },
            sections=[
                {
                    "heading": "추가 $250 시니어/장애인/참전용사 재산세 감면 제도",
                    "content": """
<p>주정부 프로그램 외에도 거주하시는 타운 세무과(Tax Assessor)에 직접 신청하는 <strong>Annual $250 Property Tax Deduction for Senior Citizens (Form PTD)</strong>가 있습니다. 연소득 $10,000 이하(소셜 시큐리티 제외 기준)인 65세 이상 시니어는 매년 재산세 고지서에서 $250을 직접 차감받습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "통합 신청서(PAS-1)", "desc": "주정부 세무국 통합 포털 접수 확인증."},
                {"doc": "연방 및 주 세금보고서", "desc": "최근 2년간의 세금보고서 전체 사본."},
                {"doc": "재산세 완납 증명서", "desc": "타운 세무과 발행 납세 증명서."},
                {"doc": "신분증 및 소셜 번호", "desc": "배우자 포함 신분증 사본."}
            ],
            tips=[
                {"title": "신청 데드라인 엄수", "desc": "Senior Freeze는 보통 매년 10월 31일, ANCHOR는 가을 지정일까지 마감되므로 일정을 놓치지 마십시오."},
                {"title": "NJAP 무료 원스톱 검토 지원", "desc": "어떤 프로그램에 해당하는지 혼란스러우신 경우 NJ Access Portal 카카오톡으로 재산세 고지서를 보내주시면 최대 수령 조합을 계산해 드립니다."}
            ],
            contacts=[
                {"name": "NJ Division of Taxation 통합 안내", "val": "609-292-6400"},
                {"name": "Property Tax Relief 포털", "val": "propertytaxreliefapp.nj.gov"}
            ]
        )
    })

    # art-69: RHCF
    articles.append({
        "id": "art-69",
        "slug": "housing-residential-health-care-facilities-ko",
        "category_id": "housing",
        "category_name": "시니어 & 서민 주거",
        "title": "주거용 요양 시설(Residential Health Care Facilities, RHCF)",
        "excerpt": "독립 생활이 어렵지만 너싱홈 수준의 간호는 불필요한 저소득 시니어를 위한 뉴저지 보건국 인가 RHCF 주거 지원 시설 안내.",
        "content_html": render_article_html(
            cat_title="시니어 & 서민 주거",
            title="주거용 요양 시설 (RHCF - 주정부 SSI 보조 연계)",
            portal_key="bergen_seniors",
            exec_summary={
                "정책 취지": "일상 식사, 세탁, 투약 모니터링이 필요하지만 병원식 24시간 숙련 간호는 필요 없는 저소득 노인 및 만성 질환자를 위한 커뮤니티 주거 시설입니다.",
                "수혜 대상": "독립적인 보행이 가능하고 자해/타해 위험이 없으며 최소한의 생활 보조가 필요한 자.",
                "재정 지원": "SSI(연방 생활보조금) 수급자의 경우 뉴저지 주정부 보충금(Supplemental State Payment)을 통해 개인 용돈을 제외한 시설비가 전액 지원됩니다.",
                "시설 환경": "식사 제공, 24시간 직원 상주, 투약 지도, 병원 방문 교통 연계."
            },
            chart_info={
                "title": "뉴저지 RHCF 입주 자격 및 재정 구조",
                "badge": "주정부 SSI 지원",
                "headers": ["항목", "일반 기준", "저소득 SSI 수급자 혜택"],
                "rows": [
                    ["연령 요건", "만 18세 이상 (다수 65세 이상)", "만 65세 이상 또는 장애 판정자"],
                    ["월 시설 비용", "민간 납부 시 월 $2,200~$3,800", "<span class='rc-chart-cell-highlight'>SSI + 주정부 보충금으로 전액 충당</span>"],
                    ["개인 용돈(PNA)", "-", "<span class='rc-chart-badge rc-chart-badge-green'>월 약 $115~$140 보장</span>"],
                    ["제공 서비스", "숙식, 세탁, 투약 감독, 응급 대기", "동일 서비스 전액 제공"]
                ],
                "footnote": "뉴저지 보건국(NJDOH)의 정기 감독을 받는 정식 인가 시설에 한해 주정부 보충금이 지급됩니다."
            },
            sections=[
                {
                    "heading": "어시스티드 리빙(AL)과 RHCF의 차이점",
                    "content": """
<p>어시스티드 리빙은 개인별 아파트 형태의 고급스러운 주거 공간이 중심인 반면, RHCF는 기숙사형 다인실 또는 소형 1인실 중심의 보다 공공적인 복지 성격 주거 모델입니다. 비용이 훨씬 저렴하여 저소득층 어르신들의 실질적인 거주 안전망 역할을 합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "신체검사서", "desc": "결핵 검사(PPD) 및 전염병 무감염 의사 소견서."},
                {"doc": "SSI 수혜 증명서", "desc": "사회보장국 발행 SSI 월 수령액 확인서."},
                {"doc": "메디케이드 카드", "desc": "병원 진료 및 처방약 수령을 위한 NJ FamilyCare 카드."}
            ],
            tips=[
                {"title": "카운티 보건복지국 상담 필수", "desc": "RHCF 입주 전 카운티 사회복지국(Board of Social Services) 케이스워커와 면담하여 주정부 보충금 수급 자격을 먼저 승인받으십시오."}
            ],
            contacts=[
                {"name": "NJ Department of Health 시설관리과", "val": "609-633-8993"},
                {"name": "버겐카운티 복지국", "val": "201-368-4200"}
            ]
        )
    })

    # art-70: Adult Retirement Communities
    articles.append({
        "id": "art-70",
        "slug": "housing-retirement-communities-ko",
        "category_id": "housing",
        "category_name": "시니어 & 서민 주거",
        "title": "시니어 전용 주거 단지(Adult Retirement Communities)",
        "excerpt": "뉴저지 55세 이상 시니어를 위한 액티브 시니어 빌리지(55+ Communities)의 특징, HOA 규정 및 매매/임대 가이드.",
        "content_html": render_article_html(
            cat_title="시니어 & 서민 주거",
            title="액티브 시니어 주거 단지 (55+ Active Adult Communities)",
            portal_key="hud_section202",
            exec_summary={
                "정책 취지": "연방 주택공정거래법(HOPA)에 따라 55세 이상 성인들이 조용하고 안전하며 풍부한 레저 시설을 누릴 수 있도록 조성된 계획 주거 단지입니다.",
                "연령 요건": "가구원 중 최소 1명 이상이 만 55세 이상이어야 하며, 19세 미만 미성년자의 상시 거주는 법적으로 제한됩니다.",
                "주거 형태": "싱글 패밀리 하우스, 타운하우스, 콘도미니엄 등 소유형 단지가 다수를 차지하며, 클럽하우스, 수영장, 골프장, 테니스장 등 완비.",
                "관리 편의": "HOA(입주자대표회)에서 잔디 깎기, 눈 치우기, 외벽 관리 등을 전담하여 주택 관리 부담이 없습니다."
            },
            chart_info={
                "title": "뉴저지 55+ 시니어 단지 vs 일반 주거 단지 비교",
                "badge": "주거 환경 비교",
                "headers": ["비교 항목", "55+ 액티브 시니어 단지", "일반 주택 단지"],
                "rows": [
                    ["연령 제한", "<span class='rc-chart-cell-highlight'>55세 이상 (미성년자 상시거주 금지)</span>", "연령 제한 없음"],
                    ["주택 관리 부담", "<span class='rc-chart-badge rc-chart-badge-green'>HOA 전담 (제설, 조경 무료)</span>", "집주인이 직접 관리 또는 개별 외주"],
                    ["커뮤니티 시설", "시니어 맞춤 클럽하우스, 피트니스, 셔틀", "단지별 상이"],
                    ["재산세 수준", "학교 학군 세금 부담 적어 상대적 저렴", "학군 세금 포함으로 높은 편"]
                ],
                "footnote": "단지별 HOA 월 관리비($250~$600)가 발생하므로 주택 구입 예산에 포함해야 합니다."
            },
            sections=[
                {
                    "heading": "뉴저지 주요 시니어 타운 분포 지역",
                    "content": """
<p>뉴저지 북부(버겐/패세익)는 토지 제약으로 대형 55+ 단지가 적고 콘도형이 많은 반면, 중부 및 남부(미들섹스 카운티 Monroe Township, 오션 카운티 Toms River, 레이크우드)에는 수천 세대 규모의 거대 시니어 빌리지들이 밀집해 있어 저렴한 가격에 주택을 장만할 수 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "연령 증빙 신분증", "desc": "55세 이상 증빙을 위한 운전면허증 및 여권 사본."},
                {"doc": "HOA 규정 동의서", "desc": "방문객 체류 기간(보통 연간 30~60일 이내) 등 단지 규약 준수 서약서."},
                {"doc": "주택 매매/임대 계약서", "desc": "정식 부동산 계약 서류."}
            ],
            tips=[
                {"title": "자녀나 손주의 동거 규정 확인", "desc": "만 19세 미만 손주를 돌보아야 하는 경우 해당 단지의 규약상 거주가 불가할 수 있으므로 사전에 철저히 확인해야 합니다."}
            ],
            contacts=[
                {"name": "NJ Association of Realtors", "val": "732-494-5616"},
                {"name": "NJ Division on Civil Rights (HOPA 문의)", "val": "973-648-2700"}
            ]
        )
    })

    # art-71: Reverse Mortgage
    articles.append({
        "id": "art-71",
        "slug": "housing-reverse-mortgage-ko",
        "category_id": "housing",
        "category_name": "시니어 & 서민 주거",
        "title": "리버스 모기지 (Reverse Mortgage)",
        "excerpt": "뉴저지 62세 이상 주택 소유 시니어를 위한 연방 FHA 보증 주택담보연금(HECM) 구조, 장단점 및 메디케이드 수급 시 주의점.",
        "content_html": render_article_html(
            cat_title="시니어 & 서민 주거",
            title="리버스 모기지 (Reverse Mortgage - 연방 HECM 주택담보연금)",
            portal_key="hud_section202",
            exec_summary={
                "정책 취지": "집은 소유하고 있지만 은퇴 후 현금 흐름이 부족한 만 62세 이상 시니어가 주택에 쌓인 자산 가치(Equity)를 담보로 비과세 현금을 매달 연금 또는 신용한도(Line of Credit)로 인출하는 제도입니다.",
                "수혜 요건": "가구주 만 62세 이상, 해당 주택에 주 거주지로 거주, 기존 모기지가 완납되었거나 잔액이 적은 상태.",
                "상환 시점": "거주하는 동안에는 매월 원리금을 상환할 필요가 없으며, 소유자가 사망하거나 집을 매각하거나 영구 이주할 때 집을 팔아 일괄 상환합니다.",
                "연방 FHA 안전장치": "Non-Recourse 규정으로 집값이 대출 잔액보다 폭락하더라도 상속인에게 빚이 넘어가지 않습니다."
            },
            chart_info={
                "title": "일반 모기지 vs 리버스 모기지(HECM) 핵심 차이점",
                "badge": "금융 구조 비교",
                "headers": ["비교 항목", "일반 모기지 (Forward Mortgage)", "리버스 모기지 (HECM)"],
                "rows": [
                    ["월 납입금", "<span class='rc-chart-cell-highlight'>매달 은행에 원리금 납부 필수</span>", "<span class='rc-chart-badge rc-chart-badge-green'>매달 상환 의무 없음</span> (은행이 고객에게 지급)"],
                    ["소득 및 신용 심사", "엄격한 소득 대조 및 DTI 심사", "상대적으로 유연 (세금/보험 납부 능력만 심사)"],
                    ["대출금 상환", "정해진 만기(15/30년) 동안 점진 상환", "사망/매각 시점에 주택 가치로 일괄 상환"],
                    ["소유권 유지", "소유자 명의 유지", "소유자 명의 100% 동일 유지"]
                ],
                "footnote": "재산세, 주택화재보험, HOA 관리비는 소유자가 직접 연체 없이 납부해야 합니다."
            },
            sections=[
                {
                    "heading": "메디케이드(Medicaid) 및 SSI 수급자의 치명적 주의점",
                    "content": """
<p>리버스 모기지로 수령한 자금은 대출금이므로 <strong>연방 소득세 비과세</strong>입니다. 그러나 인출한 돈을 은행 계좌에 그대로 보관하여 다음 달 1일이 지나면 <strong>'자산(Asset)'으로 간주</strong>됩니다.</p>
<p>이로 인해 SSI(자산 한도 $2,000)나 메디케이드 자격 상한을 초과하여 복지 혜택이 중단될 수 있으므로, 매달 수령한 돈은 해당 월 내에 생활비나 병원비로 전액 지출해야 합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "HUD 승인 카운슬링 수료증", "desc": "연방 정부 지정 독립 상담기관에서 의무적으로 이수해야 하는 HECM Counseling Certificate."},
                {"doc": "주택 감정 평가서", "desc": "FHA 공인 감정사가 평가한 주택 시세 감정서."},
                {"doc": "재산세 납부 증명", "desc": "재산세 및 주택보험 완납 내역서."}
            ],
            tips=[
                {"title": "사기성 금융 상품 주의", "desc": "반드시 연방 주택청(HUD/FHA)이 보증하는 정식 HECM(Home Equity Conversion Mortgage) 프로그램인지 확인하십시오."},
                {"title": "자녀와의 사전 상의 필수", "desc": "사후 주택을 자녀에게 온전히 물려주고자 하는 경우에는 리버스 모기지가 적합하지 않을 수 있으므로 가족 간 충분한 합의가 필요합니다."}
            ],
            contacts=[
                {"name": "HUD 무료 리버스모기지 상담 안내", "val": "1-800-569-4287"},
                {"name": "National Council on Aging (NCOA)", "val": "ncoa.org"}
            ]
        )
    })

    return articles

print("cat_housing.py loaded successfully.")
