# -*- coding: utf-8 -*-
"""
Financial category articles (9 articles)
"""
from .common import render_article_html

def get_financial_articles():
    articles = []

    # art-8: SNAP
    articles.append({
        "id": "art-8",
        "slug": "financial-assistance-snap-ko",
        "category_id": "financial",
        "category_name": "재정 지원 & 생활비 보조",
        "title": "SNAP 프로그램 (푸드 스탬프)",
        "excerpt": "뉴저지 저소득층 및 시니어를 위한 SNAP 푸드스탬프(185% FPL) 혜택, Families First EBT 카드 사용법 및 카운티 복지국 신청 안내.",
        "content_html": render_article_html(
            cat_title="재정 지원 & 생활비 보조",
            title="뉴저지 SNAP 푸드 스탬프 (NJ SNAP / Families First EBT)",
            portal_key="njhelps",
            exec_summary={
                "정책 취지": "저소득 가구와 시니어가 영양가 있는 식료품을 안정적으로 구입할 수 있도록 주정부가 매월 전자식 EBT 카드에 식품 구매 전용 지원금을 충전해 주는 연방 영양 안전망입니다.",
                "2026년 대폭 완화된 소득 기준": "뉴저지는 연방 빈곤선(FPL)의 <span class='rc-chart-cell-highlight'>185% 이하</span>까지 수혜 자격을 대폭 확대하여 타주 대비 훨씬 많은 주민이 혜택을 받습니다.",
                "뉴저지 특별 최저 보장금": "뉴저지 법령에 따라 자격 취득 가구는 연방 계산 결과가 적더라도 <span class='rc-chart-cell-highlight'>가구당 월 최소 $95 보장</span> 혜택을 누립니다.",
                "사용처": "H마트, 한남체인 등 주요 한인 마트를 포함한 모든 식료품점, 파머스 마켓, 온·오프라인 슈퍼마켓."
            },
            chart_info={
                "title": "2026/2027 뉴저지 SNAP 소득 기준(185% FPL) 및 최대 지급액표",
                "badge": "185% FPL 기준",
                "headers": ["가구원 수", "월 총소득 한도 (185% FPL)", "월 최대 지원금 (Max Benefit)", "뉴저지 법정 최소 보장액"],
                "rows": [
                    ["1인 가구", "$2,410 이하", "<span class='rc-chart-cell-highlight'>$292</span>", "<span class='rc-chart-badge rc-chart-badge-blue'>월 $95 이상 보장</span>"],
                    ["2인 가구", "$3,256 이하", "<span class='rc-chart-cell-highlight'>$536</span>", "<span class='rc-chart-badge rc-chart-badge-blue'>월 $95 이상 보장</span>"],
                    ["3인 가구", "$4,103 이하", "<span class='rc-chart-cell-highlight'>$768</span>", "<span class='rc-chart-badge rc-chart-badge-blue'>월 $95 이상 보장</span>"],
                    ["4인 가구", "$4,950 이하", "<span class='rc-chart-cell-highlight'>$975</span>", "<span class='rc-chart-badge rc-chart-badge-blue'>월 $95 이상 보장</span>"]
                ],
                "footnote": "만 60세 이상 시니어 또는 장애인 가구는 소득 기준이 더욱 완화되며 병원비 공제 혜택이 추가 적용됩니다."
            },
            sections=[
                {
                    "heading": "60세 이상 시니어 특별 공제 혜택 (의료비 공제)",
                    "content": """
<p>가구원 중 60세 이상 어르신이 계신 경우, 월 $35를 초과하는 본인 부담 의료비(처방약값, 병원 코페이, 치과 치료비, 보청기 구입비, 메디케어 보험료 등)를 소득에서 직접 공제해 주므로 훨씬 높은 지원금을 받을 수 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "소득 증빙", "desc": "최근 30일간의 급여 명세서(Paystubs) 또는 소셜 연금 수령 통지서."},
                {"doc": "주거비 증빙", "desc": "월 렌트비 계약서, 모기지 명세서 및 최근 유틸리티(가스, 전기) 고지서."},
                {"doc": "의료비 영수증 (60세+)", "desc": "보험 미적용 약값, 병원비 납부 영수증."},
                {"doc": "신분 및 영주권", "desc": "유효한 ID 및 합법 체류 신분 증빙 (시민권 또는 5년 이상 영주권)."}
            ],
            tips=[
                {"title": "영주권 스폰서 소득 합산 면제 규정 확인", "desc": "5년 이상 영주권자이거나 40 근로 크레딧을 취득한 영주권자는 스폰서 소득과 무관하게 본인 가구 소득만으로 신청 가능합니다."},
                {"title": "공적부조(Public Charge) 불이익 전혀 없음", "desc": "미 연방 이민서비스국(USCIS) 규정에 따라 SNAP 푸드스탬프 이용은 시민권 신청이나 영주권 갱신에 일체 불이익이 없습니다."}
            ],
            contacts=[
                {"name": "버겐카운티 복지국 (SNAP 부서)", "val": "201-368-4200 (Rochelle Park)"},
                {"name": "NJHelps 온라인 원스톱 접수", "val": "njhelps.gov"}
            ]
        )
    })

    # art-9: Social Security Retirement
    articles.append({
        "id": "art-9",
        "slug": "financial-assistance-social-security-ko",
        "category_id": "financial",
        "category_name": "재정 지원 & 생활비 보조",
        "title": "소셜 시큐리티 연금 (Social Security)",
        "excerpt": "40 근로 크레딧 기반 소셜시큐리티 은퇴 연금(SSA) 수령 나이(62세~70세)별 수령액 차이 및 배우자 연금 수령 전략.",
        "content_html": render_article_html(
            cat_title="재정 지원 & 생활비 보조",
            title="소셜 시큐리티 은퇴 연금 (Social Security Retirement Benefit)",
            portal_key="ssa",
            exec_summary={
                "정책 취지": "미국에서 10년(40분기 크레딧) 이상 근무하며 FICA 사회보장세를 납부한 근로자에게 은퇴 후 평생 지급되는 연방 공적 연금입니다.",
                "수령 연령 옵션": "조기 은퇴(만 62세부터 가능, 평생 약 30% 감액), 만기 은퇴(1960년 이후 출생자 만 67세, 100% 수령), 연기 은퇴(만 70세까지 연기 시 매년 8% 증액).",
                "배우자 연금(Spousal Benefit)": "본인의 근로 기록이 없거나 적은 배우자도 배우자 만기 연금액의 최대 50%까지 수령 가능.",
                "물가상승 연동(COLA)": "매년 연방 인플레이션 지수에 따라 평생 연금액이 자동 인상(COLA)되어 구매력이 보존됩니다."
            },
            chart_info={
                "title": "1960년 이후 출생자 기준 소셜 시큐리티 수령 연령별 수령 비율",
                "badge": "만기 은퇴 나이: 67세",
                "headers": ["신청 연령", "연금 수령 비율", "예시: 만기 $2,000 기준 수령액", "평생 페널티 / 보너스"],
                "rows": [
                    ["만 62세 (조기 은퇴)", "<span class='rc-chart-cell-highlight'>70.0%</span>", "$1,400", "평생 30% 영구 감액"],
                    ["만 65세", "86.7%", "$1,734", "평생 13.3% 감액 (메디케어 시작 나이)"],
                    ["만 67세 (만기 은퇴)", "100.0%", "$2,000", "<span class='rc-chart-badge rc-chart-badge-blue'>기준액 100% 전액 수령</span>"],
                    ["만 70세 (연기 은퇴)", "<span class='rc-chart-cell-highlight'>124.0%</span>", "$2,480", "<span class='rc-chart-badge rc-chart-badge-green'>평생 24% 영구 증액 보너스</span>"]
                ],
                "footnote": "조기 은퇴 후 근로를 병행하는 경우 연간 소득 한도($23,400선) 초과 시 연금이 일시 유보될 수 있습니다."
            },
            sections=[
                {
                    "heading": "배우자 연금 및 사별 유족 연금(Survivor Benefit) 핵심 전략",
                    "content": """
<p>배우자 연금은 주 근로자가 연금을 수령하기 시작했을 때 신청할 수 있으며, 주 근로자의 만기 수령액의 최대 50%를 지급받습니다. 만약 주 근로자가 사망할 경우, 유족 배우자는 본인 연금과 고인의 연금 중 더 큰 금액을 100% 선택하여 수령할 수 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "소셜 시큐리티 번호", "desc": "본인 및 배우자 소셜 카드."},
                {"doc": "출생 증명서", "desc": "기본증명서(상세) 및 가족관계증명서 번역 공증본, 또는 미국 여권."},
                {"doc": "결혼 증명서", "desc": "혼인관계증명서(상세) 번역본 (배우자 혜택 신청 시 필수)."},
                {"doc": "W-2 또는 세금보고서", "desc": "가장 최근 연도 세금보고 서류 사본."}
            ],
            tips=[
                {"title": "온라인 my Social Security 계정 생성", "desc": "SSA.gov에서 본인의 계정을 미리 개설하면 현재까지 쌓인 크레딧과 연령별 예상 연금액을 실시간으로 열람할 수 있습니다."},
                {"title": "은퇴 희망 시점 3개월 전 접수", "desc": "연금 신청 처리에 통상 2~3개월이 소요되므로 원하는 수령 시작 월의 3개월 전에 SSA 온라인으로 접수하십시오."}
            ],
            contacts=[
                {"name": "사회보장국 전국 핫라인", "val": "1-800-772-1213 (한국어 통역 서비스 가능)"},
                {"name": "공식 웹사이트", "val": "ssa.gov/myaccount"}
            ]
        )
    })

    # art-10: SSDI
    articles.append({
        "id": "art-10",
        "slug": "financial-assistance-ssdi-ko",
        "category_id": "financial",
        "category_name": "재정 지원 & 생활비 보조",
        "title": "장애인 소셜 시큐리티 연금 (SSDI)",
        "excerpt": "질병이나 부상으로 일을 할 수 없게 된 근로자를 위한 SSDI 장애연금 자격, 24개월 후 메디케어 자동 가입 혜택 및 심사 절차.",
        "content_html": render_article_html(
            cat_title="재정 지원 & 생활비 보조",
            title="장애인 소셜 시큐리티 연금 (SSDI - Social Security Disability Insurance)",
            portal_key="ssa",
            exec_summary={
                "정책 취지": "예기치 못한 중증 질병이나 부상으로 인하여 최소 1년 이상 지속되거나 사망에 이를 것으로 예상되는 장애가 발생한 근로자에게 소득을 보전해 주는 연방 보험 제도입니다.",
                "수혜 요건": "연령별 요구 근로 크레딧 충족(통상 최근 10년 중 5년 이상 근무) 및 의학적 장애 기준 충족.",
                "실질 소득 활동(SGA) 제한": "2026년 기준 월 근로 소득이 <span class='rc-chart-cell-highlight'>$1,620(시각장애인 $2,700)</span> 이하이어야 신청 가능.",
                "핵심 부가 혜택": "SSDI 수급 24개월(2년) 경과 시 만 65세 이전이라도 <span class='rc-chart-cell-highlight'>연방 메디케어(Medicare Parts A & B)에 자동 가입</span>."
            },
            chart_info={
                "title": "SSDI(장애보험) vs SSI(생활보조금) 주요 비교",
                "badge": "장애 복지 제도 비교",
                "headers": ["구분 항목", "SSDI (장애인 소셜연금)", "SSI (생활보조금)"],
                "rows": [
                    ["재원 출처", "근로자 FICA 사회보장세 납부 적립금", "연방 일반 세수 (근로 기록 불필요)"],
                    ["근로 크레딧", "<span class='rc-chart-cell-highlight'>필수 (최근 10년 중 20크레딧 등)</span>", "불필요 (저소득/저자산 증빙 중심)"],
                    ["자산 제한", "<span class='rc-chart-badge rc-chart-badge-green'>자산 심사 전혀 없음</span>", "개인 $2,000 / 부부 $3,000 엄격 제한"],
                    ["의료보험 연계", "24개월 후 <strong>메디케어</strong> 자동 가입", "승인 즉시 <strong>메디케이드</strong> 자동 가입"]
                ],
                "footnote": "루게릭병(ALS)은 대기 기간 없이 즉시, 말기 신부전증(ESRD)은 투석 3개월 후 메디케어가 개시됩니다."
            },
            sections=[
                {
                    "heading": "의학적 장애 심사 5단계 프로세스",
                    "content": """
<p>사회보장국은 신청자가 (1) 실질 소득 활동을 하는지, (2) 중증 장애인지, (3) 연방 장애 목록(Listing of Impairments)에 해당하는지, (4) 과거 직업을 수행할 수 있는지, (5) 다른 직종으로 전환 가능한지를 엄격히 단계별로 심사합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "의무 기록 일체", "desc": "진단서, 검사 결과지(MRI, CT 등), 수술 기록, 주치의 진료 소견서."},
                {"doc": "약물 처방 내역", "desc": "현재 복용 중인 모든 처방약 목록 및 부작용 기록."},
                {"doc": "최근 15년간 근무 이력", "desc": "과거 수행했던 모든 직무의 육체적/정신적 강도 기술서."}
            ],
            tips=[
                {"title": "초기 거절(Denial) 시 즉시 항소(Appeal)", "desc": "SSDI 신청자의 약 65%가 1차 심사에서 기각됩니다. 낙담하지 마시고 60일 이내에 재심 청구(Reconsideration) 및 행정법원 판사 청문회(ALJ Hearing)를 진행하십시오."},
                {"title": "주치의의 명확한 ADL 소견서 확보", "desc": "'환자가 아프다'는 단순 진술보다 '연속으로 15분 이상 앉거나 서 있을 수 없음'과 같은 구체적 기능 제한 기술이 승인율을 결정합니다."}
            ],
            contacts=[
                {"name": "사회보장국 장애 심사 안내", "val": "1-800-772-1213"},
                {"name": "온라인 장애연금 신청", "val": "ssa.gov/benefits/disability"}
            ]
        )
    })

    # art-11: Lifeline Utility
    articles.append({
        "id": "art-11",
        "slug": "financial-assistance-lifeline-ua-ko",
        "category_id": "financial",
        "category_name": "재정 지원 & 생활비 보조",
        "title": "라이프라인 유틸리티 지원 프로그램(Lifeline Utility Assistance Program)",
        "excerpt": "뉴저지 시니어 및 장애인 가구를 위한 연간 $225 가스/전기 유틸리티 요금 감면 및 세입자 현금 지원 가이드.",
        "content_html": render_article_html(
            cat_title="재정 지원 & 생활비 보조",
            title="라이프라인 유틸리티 지원 프로그램 (Lifeline Utility Assistance - 연간 $225)",
            portal_key="njshares",
            exec_summary={
                "정책 취지": "뉴저지 저소득 시니어 및 장애인이 겨울철 난방 및 여름철 냉방을 안전하게 유지할 수 있도록 주정부가 가구당 연간 $225의 에너지 요금을 보조합니다.",
                "수혜 대상": "만 65세 이상 또는 만 18세 이상 SSDI 수령자로서 PAAD(약값 지원) 소득 기준을 충족하는 주민.",
                "지원 방식": "공과금 고지서(PSE&G, JCP&L 등)에 크레딧으로 차감되거나, 유틸리티가 렌트비에 포함된 세입자는 연간 <span class='rc-chart-cell-highlight'>$225 현금 수표</span>로 지급.",
                "원스톱 신청": "PAAD 신청서 한 장으로 Lifeline 혜택까지 자동 동시 심사 및 승인."
            },
            chart_info={
                "title": "2026/2027 뉴저지 라이프라인(Lifeline) 소득 자격 기준",
                "badge": "PAAD 소득 기준 연동",
                "headers": ["가구 형태", "연간 총소득 한도", "지원 금액", "지급 형태"],
                "rows": [
                    ["독신 (Single)", "<span class='rc-chart-cell-highlight'>$52,142 이하</span>", "<span class='rc-chart-cell-highlight'>연 $225</span>", "전기/가스 요금 청구서 자동 차감"],
                    ["부부 (Married)", "<span class='rc-chart-cell-highlight'>$59,209 이하</span>", "<span class='rc-chart-cell-highlight'>연 $225</span>", "전기/가스 요금 청구서 자동 차감"],
                    ["세입자 (공과금 포함 렌트)", "동일 기준 충족 시", "<span class='rc-chart-badge rc-chart-badge-green'>연 $225 현금 수표</span>", "주정부 수표 우편 발송"]
                ],
                "footnote": "SSI 수급자는 Lifeline이 SSI 월 수당에 이미 통합되어 있으므로 별도 신청이 불필요합니다."
            },
            sections=[
                {
                    "heading": "PAAD와 라이프라인의 원스톱 연동",
                    "content": """
<p>뉴저지 고령화서비스국(DoAS)의 통합 신청서(NJSave)를 접수하면, 처방약 지원(PAAD), 메디케어 파트 B 보험료 대납(SLMB/QI), 난방비 보조(Lifeline), 보청기 보조(HAAAD)가 단 한 번의 서류 제출로 일괄 승인됩니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "NJSave 통합 신청서", "desc": "온라인 또는 서면 작성본."},
                {"doc": "유틸리티 고지서 사본", "desc": "신청자 본인 또는 배우자 명의의 최근 PSE&G, JCP&L 등 고지서 전체 페이지."},
                {"doc": "소득 증빙", "desc": "전년도 연방 세금보고서 1040 또는 소셜 연금 증명서."}
            ],
            tips=[
                {"title": "공과금 계좌 명의 일치 확인", "desc": "고지서의 영문 성명과 신청서의 성명이 일치해야 전산상 자동으로 크레딧이 반영됩니다."},
                {"title": "세입자는 수표 수령 주소 확인", "desc": "렌트비에 유틸리티가 포함된 경우 체크가 우편으로 배송되므로 정확한 아파트 호수를 기재하십시오."}
            ],
            contacts=[
                {"name": "NJ Division of Aging Services (DoAS)", "val": "1-800-792-9745"},
                {"name": "NJSave 온라인 신청 포털", "val": "njdoas-ua.dhs.state.nj.us"}
            ]
        )
    })

    # art-12: SSI
    articles.append({
        "id": "art-12",
        "slug": "financial-assistance-ssi-ko",
        "category_id": "financial",
        "category_name": "재정 지원 & 생활비 보조",
        "title": "생활보조금(Supplemental Security Income, SSI)",
        "excerpt": "근로 기록이 없거나 부족한 65세 이상 시니어 및 장애인을 위한 연방 최저생계비(SSI) 및 뉴저지 메디케이드 자동 연계 가이드.",
        "content_html": render_article_html(
            cat_title="재정 지원 & 생활비 보조",
            title="생활보조금 (SSI - Supplemental Security Income & 메디케이드)",
            portal_key="ssa",
            exec_summary={
                "정책 취지": "미국 내 근로 기록이 없거나 부족하여 소셜 시큐리티 은퇴 연금을 받지 못하는 만 65세 이상 저소득 시니어 및 시각/중증 장애인의 기본적인 식음료와 주거비를 보장하는 연방 생계 복지 제도입니다.",
                "2026년 연방 최대 지급액": "독신 최대 <span class='rc-chart-cell-highlight'>월 $967</span>, 부부 합산 최대 <span class='rc-chart-cell-highlight'>월 $1,450</span> (뉴저지 주정부 추가 보충금 별도).",
                "가장 강력한 부가 혜택": "뉴저지에서는 SSI 수급 자격을 취득하는 즉시 <span class='rc-chart-cell-highlight'>뉴저지 메디케이드(NJ FamilyCare) 100% 무료 의료보험이 자동 발급</span>됩니다.",
                "엄격한 자산 한도": "자가 거주 주택 1채와 차량 1대를 제외한 모든 금융 자산이 <span class='rc-chart-cell-highlight'>독신 $2,000, 부부 $3,000 이하</span>여야 합니다."
            },
            chart_info={
                "title": "2026/2027 연방 SSI 수령액 및 뉴저지 자산 기준",
                "badge": "연방 공식 기준",
                "headers": ["가구 형태", "연방 최대 월 수령액", "엄격 자산 한도(Asset Limit)", "메디케이드 연계"],
                "rows": [
                    ["독신 (Single)", "<span class='rc-chart-cell-highlight'>월 $967</span>", "$2,000 이하", "<span class='rc-chart-badge rc-chart-badge-green'>승인 즉시 100% 자동 무료</span>"],
                    ["부부 (Married)", "<span class='rc-chart-cell-highlight'>월 $1,450</span>", "$3,000 이하", "<span class='rc-chart-badge rc-chart-badge-green'>부부 모두 자동 무료</span>"],
                    ["타인 동거 시 (In-Kind Support)", "약 1/3 감액 (월 약 $645)", "동일 자산 한도", "메디케이드 100% 동일 유지"]
                ],
                "footnote": "자녀와 함께 거주하며 숙식을 무상으로 제공받는 경우 '현물 지원(In-Kind Support)' 규정으로 수령액의 1/3이 감액될 수 있습니다."
            },
            sections=[
                {
                    "heading": "영주권자(Green Card)의 SSI 수혜 자격 규정",
                    "content": """
<p>비시민권자(영주권자)가 SSI를 받기 위해서는 다음 중 하나를 충족해야 합니다:</p>
<ul class="rc-guide-list">
  <li>1996년 8월 22일 이전에 미국에 합법 입국하여 체류 중이었던 자.</li>
  <li>본인 또는 배우자의 근로로 40 크레딧(10년)을 달성한 합법 영주권자.</li>
  <li>난민(Refugee) 또는 망명자 자격 취득 후 7년 이내.</li>
</ul>
<p>부모 초청 등으로 최근 영주권을 취득한 경우 40 크레딧을 채우기 전까지는 원칙적으로 SSI 신청이 제한되므로 시민권을 먼저 취득하는 것이 가장 유리합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "시민권 증서 또는 영주권", "desc": "미국 시민권 증서 원본 또는 40 크레딧 증빙 영주권."},
                {"doc": "은행 계좌 내역서", "desc": "모든 은행의 최근 월별 명세서 전체 페이지 (잔고 $2,000 이하 입증)."},
                {"doc": "주거 비용 영수증", "desc": "렌트 계약서, 렌트비 영수증, 음식비 분담 내역서 (공동 분담 계약서 작성 시 전액 수령 가능)."}
            ],
            tips=[
                {"title": "자녀 집 거주 시 렌트비 분담 계약서(Fair Share) 작성", "desc": "자녀 집에 거주할 때 식비와 방세를 적정하게 분담하고 있다는 서약서를 제출하면 1/3 감액 페널티를 피하고 전액을 수령할 수 있습니다."},
                {"title": "해외 체류 30일 초과 시 지급 정지", "desc": "미국 국경을 벗어나 30일 이상 해외(한국 등)에 체류하면 SSI 지급이 즉시 정지되며 귀국 후 재신청해야 합니다."}
            ],
            contacts=[
                {"name": "사회보장국 (SSI 신청 예약)", "val": "1-800-772-1213"},
                {"name": "공식 안내", "val": "ssa.gov/ssi"}
            ]
        )
    })

    # art-16: LIHEAP
    articles.append({
        "id": "art-16",
        "slug": "financial-assistance-liheap-ko",
        "category_id": "financial",
        "category_name": "재정 지원 & 생활비 보조",
        "title": "LIHEAP (저소득 가정 에너지 지원 프로그램)",
        "excerpt": "뉴저지 저소득층 및 시니어를 위한 겨울철 난방비 및 여름철 냉방비 연방 보조 프로그램(LIHEAP) 자격과 신청 기간 안내.",
        "content_html": render_article_html(
            cat_title="재정 지원 & 생활비 보조",
            title="저소득 가정 에너지 지원 프로그램 (LIHEAP / 난방비 & 냉방비 보조)",
            portal_key="njshares",
            exec_summary={
                "정책 취지": "겨울철 천연가스, 난방유, 전기 요금 상승으로 인한 저소득 가정의 난방 중단을 예방하고, 여름철 폭염 시 의료 취약 시니어의 냉방비를 지원하는 연방 기금 프로그램입니다.",
                "수혜 자격": "뉴저지 주 중위소득(SMI)의 60% 이하 가구 (SNAP, SSI 수급자는 소득 심사 자동 패스).",
                "지원 규모": "주택 형태, 연료 유형, 거주 지역에 따라 가구당 <span class='rc-chart-cell-highlight'>연간 $300 ~ $1,200</span> 수준의 보조금이 에너지 회사에 직접 지급.",
                "신청 시즌": "매년 10월 1일부터 다음 해 6월 30일까지 관할 카운티 지역사회복지기관(Community Action Agency) 접수."
            },
            chart_info={
                "title": "2026/2027 뉴저지 LIHEAP 주 중위소득 60% 한도표",
                "badge": "주 중위소득 60%",
                "headers": ["가구 규모", "월 소득 상한선", "연간 총소득 한도", "예상 난방 지원금"],
                "rows": [
                    ["1인 가구", "$3,640 이하", "$43,680 이하", "<span class='rc-chart-cell-highlight'>$350 ~ $650</span>"],
                    ["2인 가구", "$4,760 이하", "$57,120 이하", "<span class='rc-chart-cell-highlight'>$450 ~ $850</span>"],
                    ["3인 가구", "$5,880 이하", "$70,560 이하", "<span class='rc-chart-cell-highlight'>$550 ~ $1,050</span>"],
                    ["4인 가구", "$7,000 이하", "$84,000 이하", "<span class='rc-chart-cell-highlight'>$650 ~ $1,250</span>"]
                ],
                "footnote": "연료 공급이 끊길 위기에 처한 긴급 가구(Emergency Assistance)는 추가 비상 보조금이 즉시 지원됩니다."
            },
            sections=[
                {
                    "heading": "세입자(Renter)도 지원 가능한가요?",
                    "content": """
<p>렌트비에 난방비가 포함되어 있어 집주인이 공과금을 내는 경우라도, 소득 요건을 충족하면 <strong>세입자용 고정 지원금</strong>을 신청자 본인에게 수표로 직접 지급받을 수 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "에너지 고지서", "desc": "최근 2개월 치 PSE&G, 가스, 오일 배달 영수증."},
                {"doc": "소득 증명", "desc": "모든 가구원의 최근 1개월 급여명세서 또는 소셜 연금 증명."},
                {"doc": "주거 증빙", "desc": "부동산 세금 고지서 또는 렌트 계약서."}
            ],
            tips=[
                {"title": "겨울철 강제 단전·단가스 방지 보호(Winter Termination Program)", "desc": "LIHEAP 신청 중이거나 수혜 자격을 갖춘 주민은 매년 11월 15일부터 3월 15일까지 전기 및 가스가 강제로 끊기지 않도록 법적 보호를 받습니다."}
            ],
            contacts=[
                {"name": "버겐카운티 LIHEAP 대행 (Greater Bergen Community Action)", "val": "201-488-5100"},
                {"name": "NJ DCA 원스톱 신청 포털", "val": "nj.gov/dca/dcaid"}
            ]
        )
    })

    # art-17: Comfort Partners
    articles.append({
        "id": "art-17",
        "slug": "financial-assistance-comfort-partners-ko",
        "category_id": "financial",
        "category_name": "재정 지원 & 생활비 보조",
        "title": "저소득층 에너지 효율 지원(Comfort Partners Program)",
        "excerpt": "뉴저지 공공 전력회사들이 전액 무료(100% Free)로 제공하는 주택 단열, 고효율 냉난방기 교체 및 절전 가전 업그레이드 프로그램.",
        "content_html": render_article_html(
            cat_title="재정 지원 & 생활비 보조",
            title="에너지 효율 무상 개선 (Comfort Partners Program - 100% 무료 시공)",
            portal_key="njshares",
            exec_summary={
                "정책 취지": "뉴저지 청정에너지 기금(Clean Energy Program)과 주요 전력회사(PSE&G, JCP&L 등)가 저소득층 가정의 전기/가스 요금을 영구적으로 줄여주기 위해 주택 에너지 진단과 시설 개선을 100% 전액 무료로 시공해 줍니다.",
                "수혜 요건": "연방 빈곤선 250% 이하 가구 또는 SNAP, LIHEAP, SSI, Lifeline 수혜 가구.",
                "무상 시공 항목": "주택 단열재 보강(Weatherization), 노후 냉장고 고효율 무료 교체, 고효율 보일러/에어컨 교체, LED 조명 전면 교체, 온수 파이프 단열.",
                "본인 부담금": "<span class='rc-chart-cell-highlight'>0달러 ($0) - 전액 주정부 및 전력사 기금 충당</span>."
            },
            chart_info={
                "title": "Comfort Partners 100% 무상 제공 주요 설비 및 가치",
                "badge": "전액 무료 ($0)",
                "headers": ["제공 서비스 항목", "시장 시공 가치", "본인 부담금", "연간 예상 절감액"],
                "rows": [
                    ["고효율 에너지스타 냉장고 교체", "$1,000 ~ $1,500", "<span class='rc-chart-cell-highlight'>$0 (무료 교체)</span>", "연 $150 ~ $250 절감"],
                    ["다락방 및 지하실 단열/밀폐", "$2,500 ~ $5,000", "<span class='rc-chart-cell-highlight'>$0 (무료 시공)</span>", "난방비 20%~30% 영구 절감"],
                    ["고효율 냉난방 히트펌프 교체", "$4,000 ~ $8,000", "<span class='rc-chart-cell-highlight'>$0 (무료 교체)</span>", "에너지 효율 대폭 개선"],
                    ["LED 조명 및 스마트 멀티탭", "$200 ~ $400", "<span class='rc-chart-cell-highlight'>$0 (무료 증정)</span>", "전기요금 절감"]
                ],
                "footnote": "단독주택뿐만 아니라 1~4가구 다세대 주택 및 세입자(집주인 동의 시)도 신청 가능합니다."
            },
            sections=[
                {
                    "heading": "무료 에너지 감사(Audit) 진행 절차",
                    "content": """
<p>신청서가 접수되면 공인 에너지 전문 기술자가 가정을 직접 방문하여 블로어도어(Blower Door) 테스트로 열 누출 부위를 측정하고, 냉장고의 전력 소모량을 정밀 검사한 후 맞춤형 개선 공사를 진행합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "전기/가스 고지서", "desc": "최근 12개월간의 에너지 사용 내역이 표시된 고지서 사본."},
                {"doc": "소득 증빙 또는 복지 수혜증", "desc": "SNAP, LIHEAP, SSI 또는 세금보고서 사본."},
                {"doc": "집주인 동의서 (세입자 시)", "desc": "시공에 동의하는 건물주 서명 양식."}
            ],
            tips=[
                {"title": "사기성 유료 권유 주의", "desc": "공식 Comfort Partners 프로그램은 고객에게 절대 현금이나 신용카드 결제를 요구하지 않습니다."},
                {"title": "노후 냉장고 교체 혜택 활용", "desc": "구입한 지 10~15년 이상 된 구형 냉장고는 새 에너지스타 냉장고로 무료 맞교환되므로 매우 만족도가 높습니다."}
            ],
            contacts=[
                {"name": "NJ Comfort Partners 전용 핫라인", "val": "1-800-915-8309"},
                {"name": "공식 웹사이트", "val": "njcleanenergy.com/CP"}
            ]
        )
    })

    # art-49: SFMNP
    articles.append({
        "id": "art-49",
        "slug": "financial-assistance-farmers-market-ko",
        "category_id": "financial",
        "category_name": "재정 지원 & 생활비 보조",
        "title": "시니어 파머스 마켓 영양 프로그램 (SFMNP)",
        "excerpt": "뉴저지 60세 이상 저소득 시니어를 위한 로컬 파머스 마켓 신선 과일·채소 $50 전자 QR 쿠폰 지급 프로그램.",
        "content_html": render_article_html(
            cat_title="재정 지원 & 생활비 보조",
            title="시니어 파머스 마켓 영양 지원 (SFMNP - $50 신선 청과물 지원)",
            portal_key="njhelps",
            exec_summary={
                "정책 취지": "저소득 어르신들의 식생활 건강을 개선하고 뉴저지 로컬 농가를 돕기 위해, 여름~가을철 지역 파머스 마켓에서 신선한 과일과 채소를 무료로 구매할 수 있는 전자 쿠폰을 지급합니다.",
                "수혜 요건": "만 60세 이상 뉴저지 거주자로서 가구 소득이 연방 빈곤선 185% 이하인 자.",
                "지원 금액": "1인당 <span class='rc-chart-cell-highlight'>$50 상당의 전자 바우처(QR코드 카드)</span> 지급 (매년 6월~11월 사용 가능).",
                "배포처": "버겐카운티 노인복지국, 타운 시니어 센터 및 지정 커뮤니티 복지관."
            },
            chart_info={
                "title": "2026/2027 SFMNP 자격 소득 기준 (185% FPL)",
                "badge": "1인당 $50 지급",
                "headers": ["가구 규모", "월 소득 상한선", "연 소득 상한선", "구매 가능 품목"],
                "rows": [
                    ["1인 가구", "<span class='rc-chart-cell-highlight'>$2,410 이하</span>", "$28,920 이하", "신선한 과일, 채소, 허브류 전 품목"],
                    ["2인 가구", "<span class='rc-chart-cell-highlight'>$3,256 이하</span>", "$39,072 이하", "부부 각자 신청 시 <strong>총 $100</strong> 지급"],
                    ["3인 가구", "$4,103 이하", "$49,236 이하", "가구 내 60세 이상자 각각 지급"]
                ],
                "footnote": "통조림, 건조 과일, 가공식품은 구매가 불가하며 뉴저지 농무부(NJDA) 인증 농산물에 한합니다."
            },
            sections=[
                {
                    "heading": "사용 방법 및 지정 파머스 마켓",
                    "content": """
<p>종이 쿠폰 대신 모바일 앱 또는 QR코드가 인쇄된 플라스틱 카드로 지급됩니다. 버겐카운티 내 티넥(Teaneck), 리지우드(Ridgewood), 잉글우드(Englewood), 포트리 인근 지정 농민 장터에서 간편하게 스캔하여 결제할 수 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "연령 및 주소 증명", "desc": "뉴저지 운전면허증 또는 공과금 고지서."},
                {"doc": "소득 증명", "desc": "소셜 연금 증명서 또는 SNAP 카드."}
            ],
            tips=[
                {"title": "매년 여름 초 선착순 배포", "desc": "예산이 한정되어 있어 보통 6~7월에 조기 마감되므로 관할 시니어 센터에 미리 대기 등록하십시오."}
            ],
            contacts=[
                {"name": "버겐카운티 노인복지국 영양과", "val": "201-336-7400"},
                {"name": "NJ Department of Agriculture", "val": "609-292-8854"}
            ]
        )
    })

    # art-50: NJ SHARES
    articles.append({
        "id": "art-50",
        "slug": "financial-assistance-nj-shares-ko",
        "category_id": "financial",
        "category_name": "재정 지원 & 생활비 보조",
        "title": "NJ SHARES (뉴저지 비상 지원 프로그램)",
        "excerpt": "소득이 약간 높아 주정부 복지(LIHEAP)에서 탈락한 중산층 위기 가구를 위한 최대 $700~$1,000 비상 에너지/상수도 요금 지원.",
        "content_html": render_article_html(
            cat_title="재정 지원 & 생활비 보조",
            title="뉴저지 비상 에너지 지원 (NJ SHARES - 차상위 계층 긴급 구제)",
            portal_key="njshares",
            exec_summary={
                "정책 취지": "소득이 연방 빈곤선보다 약간 높아 일반 정부 보조(LIHEAP) 자격에는 미달하지만, 실직, 질병, 재난 등으로 공과금을 납부할 수 없는 차상위 가구를 위한 비영리 안전망입니다.",
                "수혜 요건": "주 중위소득(SMI)의 400% 이하 가구로서 최근 연체 고지서나 단전/단수 경고장을 받은 주민.",
                "지원 규모": "전기/가스 최대 <span class='rc-chart-cell-highlight'>$700</span>, 난방유 최대 <span class='rc-chart-cell-highlight'>$1,000</span>, 수도요금 최대 <span class='rc-chart-cell-highlight'>$500</span> 탕감 지원.",
                "접수 방식": "온라인 포털(njshares.org) 또는 지역 협력 기관을 통해 연중 상시 접수."
            },
            chart_info={
                "title": "2026/2027 NJ SHARES 소득 상한선 (주 중위소득 400%)",
                "badge": "폭넓은 중산층 지원",
                "headers": ["가구 규모", "월 소득 상한선", "연간 총소득 한도", "최대 긴급 지원금"],
                "rows": [
                    ["1인 가구", "$5,833 이하", "$70,000 이하", "<span class='rc-chart-cell-highlight'>전기/가스 최대 $700</span>"],
                    ["2인 가구", "$7,633 이하", "$91,600 이하", "<span class='rc-chart-cell-highlight'>전기/가스 최대 $700</span>"],
                    ["3인 가구", "$9,433 이하", "$113,200 이하", "난방유 최대 $1,000"],
                    ["4인 가구", "$11,233 이하", "$134,800 이하", "상수도 최대 $500"]
                ],
                "footnote": "최근 12개월 이내에 정기적으로 요금을 성실히 납부했던 이력이 일부 요구됩니다."
            },
            sections=[
                {
                    "heading": "신청 전 필수 조건 (선의의 납부 증빙)",
                    "content": """
<p>NJ SHARES는 일방적인 무상 지원이 아닌 위기 극복 지원금이므로, 최근 일정 기간(통상 최근 90일 이내)에 최소 $100 이상의 요금을 자발적으로 납부한 기록이 있어야 합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "체납 고지서", "desc": "단전/단가스 예정 통지서 또는 최근 연체 고지서 사본."},
                {"doc": "소득 증빙", "desc": "최근 4주간의 급여 명세서 또는 실업수당 통지서."},
                {"doc": "최근 납부 영수증", "desc": "최근 은행 납부 내역 또는 영수증."}
            ],
            tips=[
                {"title": "단전 예고 시 즉시 전력사에 통보", "desc": "NJ SHARES 접수 확인 번호를 PSE&G에 알려주면 심사 기간 동안 단전 집행이 즉시 보류됩니다."}
            ],
            contacts=[
                {"name": "NJ SHARES 고객 센터", "val": "1-866-657-4273"},
                {"name": "공식 웹사이트", "val": "njshares.org"}
            ]
        )
    })

    return articles

print("cat_financial.py loaded successfully.")
