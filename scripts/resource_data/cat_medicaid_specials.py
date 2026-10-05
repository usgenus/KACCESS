# -*- coding: utf-8 -*-
"""
Medicaid Specials category articles (9 articles)
"""
from .common import render_article_html

def get_medicaid_specials_articles():
    articles = []

    # art-13: Funeral & Burial Assistance
    articles.append({
        "id": "art-13",
        "slug": "medicaid-specials-funeral-assistance-ko",
        "category_id": "medicaid-specials",
        "category_name": "특별 메디케이드 & 안전망",
        "title": "장례 지원 프로그램 (Funeral & Burial Assistance)",
        "excerpt": "뉴저지 공공부조 수급자(메디케이드, SSI, GA 등) 사망 시 유족의 장례비 부담을 덜어주는 최대 $2,550~$3,000 장례비 지원.",
        "content_html": render_article_html(
            cat_title="특별 메디케이드 & 안전망",
            title="공공 장례비 지원 프로그램 (Public Assistance Funeral & Burial)",
            portal_key="charity_care",
            exec_summary={
                "정책 취지": "생전에 메디케이드, SSI 또는 일반 생계 지원(GA/TANF)을 받던 저소득 주민이 사망했을 때, 존엄한 장례를 치를 수 있도록 주정부가 장례식장 및 매장/화장 비용을 직접 보조합니다.",
                "수혜 요건": "사망 당시 적격 공공복지 프로그램(SSI, 메디케이드, WFNJ) 수급자이거나 유산이 전무한 무연고/빈곤층.",
                "지원 금액": "장례지도사(Funeral Director) 비용 최대 <span class='rc-chart-cell-highlight'>$2,246</span> 및 묘지 매장/화장비 최대 <span class='rc-chart-cell-highlight'>$524 (총 최대 $2,770)</span>.",
                "가족 추가 부담 제한": "가족이나 친지가 추가로 보탤 수 있는 금액은 법적으로 $1,570 이내로 제한되며, 이를 초과하는 호화 장례는 주정부 보조가 전액 취소됩니다."
            },
            chart_info={
                "title": "2026/2027 뉴저지 공공 장례비 법정 지원 한도표",
                "badge": "법정 장례비 보조",
                "headers": ["비용 구분", "주정부 최대 지원금", "가족/친지 추가 기여 한도", "총 허용 장례 예산 상한선"],
                "rows": [
                    ["장례식장 서비스 (Funeral Home)", "$2,246", "$1,570 이내", "<span class='rc-chart-cell-highlight'>최대 $3,816</span>"],
                    ["매장지/화장비 (Cemetery/Crematory)", "$524", "규정 한도 내", "<span class='rc-chart-cell-highlight'>최대 $524</span>"],
                    ["<strong>총 합계 지원</strong>", "<strong>최대 $2,770</strong>", "<strong>최대 $1,570</strong>", "<strong>총 $4,340 초과 금지</strong>"]
                ],
                "footnote": "고인의 은행 잔고나 생명보험금이 있는 경우 해당 금액을 먼저 차감한 후 부족분을 주정부가 지급합니다."
            },
            sections=[
                {
                    "heading": "장례 절차 전 관할 카운티 복지국 사전 승인 필수",
                    "content": """
<p>장례가 이미 끝나고 정산된 후에는 소급 청구가 불가능합니다. 사망 직후 계약할 장례식장에 <em>'NJ Public Assistance Funeral'</em> 진행 의사를 밝히고, 장례지도사가 카운티 복지국(Board of Social Services)에 사전 청구서를 제출하여 승인을 받아야 합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "사망 진단서 (Death Certificate)", "desc": "병원 또는 검시소 발행 사망 확인서."},
                {"doc": "고인의 복지 수급 번호", "desc": "메디케이드 번호 또는 SSI 수급 증빙."},
                {"doc": "고인의 최종 은행 잔고 증명", "desc": "사망일 기준 잔고가 없음을 입증하는 거래 내역서."}
            ],
            tips=[
                {"title": "한인 장례식장과 사전 조율", "desc": "버겐카운티 내 주요 한인 장례식장들은 공공 장례비 지원 규정을 잘 알고 있으므로 상담 시 즉시 지원 여부를 문의하십시오."}
            ],
            contacts=[
                {"name": "버겐카운티 복지국 장례지원과", "val": "201-368-4200"},
                {"name": "NJ Division of Family Development", "val": "nj.gov/humanservices/dfd"}
            ]
        )
    })

    # art-14: WFNJ / GA
    articles.append({
        "id": "art-14",
        "slug": "medicaid-specials-wfnj-ga-ko",
        "category_id": "medicaid-specials",
        "category_name": "특별 메디케이드 & 안전망",
        "title": "Medicaid General Assistance (WFNJ/GA)",
        "excerpt": "부양 자녀가 없는 저소득 독신 성인을 위한 뉴저지 일반 생계 지원(GA) 현금 수당 및 응급 메디케이드 혜택.",
        "content_html": render_article_html(
            cat_title="특별 메디케이드 & 안전망",
            title="일반 생계 지원 (WorkFirst NJ / General Assistance - 독신 성인 안전망)",
            portal_key="njhelps",
            exec_summary={
                "정책 취지": "미성년 자녀가 없어 TANF 혜택을 받지 못하고, 소셜 연금이나 SSI 자격도 되지 않는 18세 이상 빈곤 독신 성인 및 자녀 없는 부부에게 최소한의 현금 생계비를 지원합니다.",
                "수혜 대상": "소득과 자산이 거의 없는 뉴저지 거주 18세 이상 성인 (근로 능력 유무에 따라 구분).",
                "월 현금 지원액": "근로 가능자 월 <span class='rc-chart-cell-highlight'>$185</span>, 의학적 근로 무능력자(Employable vs Unemployable) 월 <span class='rc-chart-cell-highlight'>$277</span> 현금 지급.",
                "부가 혜택": "NJ FamilyCare 메디케이드 무료 가입 및 SNAP 푸드스탬프 동시 연계."
            },
            chart_info={
                "title": "2026/2027 뉴저지 WFNJ/GA 현금 지원 및 자산 기준표",
                "badge": "독신 성인 현금 지원",
                "headers": ["수혜자 구분", "월 최대 현금 지급액", "엄격 자산 한도", "의료보험 및 식비"],
                "rows": [
                    ["근로 능력자 (Employable)", "월 $185", "$2,000 이하", "<span class='rc-chart-badge rc-chart-badge-blue'>메디케이드 + SNAP</span>"],
                    ["근로 무능력자 (Unemployable)", "<span class='rc-chart-cell-highlight'>월 $277</span>", "$2,000 이하", "<span class='rc-chart-badge rc-chart-badge-green'>메디케이드 + SNAP</span>"],
                    ["부부 (Married, 무자녀)", "월 약 $340", "$3,000 이하", "부부 전액 지원"]
                ],
                "footnote": "근로 가능자는 주정부 직업 훈련 또는 취업 활동 프로그램(Work Requirement)에 의무적으로 참여해야 합니다."
            },
            sections=[
                {
                    "heading": "긴급 주거 지원(Emergency Assistance, EA) 추가 혜택",
                    "content": """
<p>GA 수급자 중 노숙 위기에 처했거나 퇴거(Eviction) 명령을 받은 주민은 모텔 숙박비, 임시 셸터, 백 렌트(밀린 월세), 보증금 등을 지원하는 주정부 <strong>Emergency Assistance (EA)</strong>를 추가로 받을 수 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "소득/자산 무소유 증명", "desc": "은행 잔고 증명서 및 최근 소득 없음 진술서."},
                {"doc": "근로 무능력 의사 소견서 (해당자)", "desc": "질병이나 부상으로 일을 할 수 없다는 MED-1 양식 의사 진단서."},
                {"doc": "신분증 및 체류 신분", "desc": "운전면허증 및 시민권/영주권 사본."}
            ],
            tips=[
                {"title": "SSI 신청 중 연결 고리 역할", "desc": "장애로 인해 연방 SSI를 신청하고 결과를 기다리는 수개월~수년 동안 GA를 신청하여 매달 $277의 생계비와 메디케이드를 유지할 수 있습니다."}
            ],
            contacts=[
                {"name": "버겐카운티 복지국 GA 창구", "val": "201-368-4200"},
                {"name": "NJHelps 온라인 접수", "val": "njhelps.gov"}
            ]
        )
    })

    # art-15: TANF
    articles.append({
        "id": "art-15",
        "slug": "medicaid-specials-wfnj-tanf-ko",
        "category_id": "medicaid-specials",
        "category_name": "특별 메디케이드 & 안전망",
        "title": "Temporary Assistance for Needy Families (TANF)",
        "excerpt": "미성년 자녀를 둔 저소득 한부모 및 빈곤 가정을 위한 뉴저지 WFNJ/TANF 현금 지원, 무료 보육 지원 및 자립 프로그램.",
        "content_html": render_article_html(
            cat_title="특별 메디케이드 & 안전망",
            title="빈곤 가정 임시 지원 (WFNJ / TANF - 유자녀 저소득 가정)",
            portal_key="njhelps",
            exec_summary={
                "정책 취지": "만 18세 미만 자녀가 있는 저소득 가정(특히 한부모 가정)에 매월 현금 수당을 지급하여 아동의 기본 생계를 보호하고, 부모의 직업 훈련과 취업을 지원하는 제도입니다.",
                "수혜 요건": "18세 미만(또는 고교 재학 중인 19세) 자녀를 양육하는 뉴저지 저소득 가구.",
                "월 현금 지원액": "3인 가구 기준 <span class='rc-chart-cell-highlight'>월 최대 $559</span> 현금 수당 지급 (가구원 수에 따라 증액).",
                "핵심 부가 혜택": "무료 데이케어(차일드케어 보조금), 교통비 보조, 메디케이드 전액 무료, 주택 응급 지원."
            },
            chart_info={
                "title": "2026/2027 뉴저지 TANF 가구 규모별 최대 월 현금 지급액",
                "badge": "유자녀 가정 현금 복지",
                "headers": ["가구 규모", "월 최대 현금 지원금", "자산 한도", "종합 연계 혜택"],
                "rows": [
                    ["2인 가구 (부모 1 + 자녀 1)", "$448", "$2,000 이하", "<span class='rc-chart-badge rc-chart-badge-blue'>무료 보육 + 메디케이드</span>"],
                    ["3인 가구 (부모 1 + 자녀 2)", "<span class='rc-chart-cell-highlight'>$559</span>", "$2,000 이하", "<span class='rc-chart-badge rc-chart-badge-blue'>무료 보육 + 메디케이드</span>"],
                    ["4인 가구 (부모 2 + 자녀 2)", "<span class='rc-chart-cell-highlight'>$663</span>", "$2,000 이하", "SNAP + 에너지 보조 동시 지원"]
                ],
                "footnote": "평생 누적 수혜 기간은 최대 60개월(5년)로 제한되나, 영구 장애나 간병이 필요한 경우 면제(Exemption)가 가능합니다."
            },
            sections=[
                {
                    "heading": "취업 활동과 무료 차일드케어(Child Care) 바우처",
                    "content": """
<p>TANF 수급 부모가 취업 준비를 하거나 직업 훈련을 받는 동안, 뉴저지 영유아 보육 프로그램(CCRR / Bergen County Office of Children)을 통해 월 $1,200~$1,800 상당의 데이케어 비용을 100% 전액 지원받을 수 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "자녀 출생증명서", "desc": "모든 자녀의 미국 출생증명서 사본."},
                {"doc": "소득 증명", "desc": "양육비(Child Support) 수령 내역, 실업수당 또는 소득 없음 증빙."},
                {"doc": "학교 재학 증명서", "desc": "학령기 자녀의 학교 출석 확인서."}
            ],
            tips=[
                {"title": "양육비 이행 절차 협조 의무", "desc": "비양육 부모로부터 자녀 양육비를 받지 못하고 있는 경우, 카운티 법원의 양육비 청구 절차에 협조해야 TANF가 정상 승인됩니다."}
            ],
            contacts=[
                {"name": "버겐카운티 복지국 TANF 부서", "val": "201-368-4200"},
                {"name": "NJHelps 온라인 접수", "val": "njhelps.gov"}
            ]
        )
    })

    # art-23: Charity Care
    articles.append({
        "id": "art-23",
        "slug": "medicaid-specials-charity-care-ko",
        "category_id": "medicaid-specials",
        "category_name": "특별 메디케이드 & 안전망",
        "title": "병원비 지원 프로그램 (Charity Care)",
        "excerpt": "보험이 없거나 병원비 감당이 어려운 뉴저지 주민을 위한 급성기 종합병원 입원/수술/응급실 비용 100%~20% 법정 감면 혜택.",
        "content_html": render_article_html(
            cat_title="특별 메디케이드 & 안전망",
            title="뉴저지 병원비 감면 제도 (Charity Care - 자선 병원비 100% 감면)",
            portal_key="charity_care",
            exec_summary={
                "정책 취지": "뉴저지주 법령(Health Care Facilities Planning Act)에 따라 주내 모든 급성기 종합병원은 저소득 무보험 주민에게 입원, 수술, 외래 진료비를 의무적으로 감면해 주어야 합니다.",
                "수혜 대상": "건강보험이 없거나 보험으로 커버되지 않는 막대한 병원비가 발생한 뉴저지 거주자 (체류 신분 불문, 서류미비자 포함).",
                "감면 비율": "연방 빈곤선 200% 이하는 <span class='rc-chart-cell-highlight'>병원비 100% 전액 탕감 ($0)</span>, 201%~300%는 슬라이딩 스케일에 따라 80%~20% 감면.",
                "신청 장소": "치료를 받은 병원의 재정 상담과(Patient Financial Services / Charity Care Office)에 직접 접수."
            },
            chart_info={
                "title": "2026/2027 뉴저지 Charity Care 소득별 병원비 감면 슬라이딩 스케일",
                "badge": "100% 전액 탕감 가능",
                "headers": ["소득 기준 (FPL)", "1인 가구 연소득", "4인 가구 연소득", "병원비 최종 감면율"],
                "rows": [
                    ["<span class='rc-chart-cell-highlight'>200% FPL 이하</span>", "$31,300 이하", "$64,300 이하", "<span class='rc-chart-badge rc-chart-badge-green'>100% 전액 무료 ($0 탕감)</span>"],
                    ["201% ~ 225% FPL", "$31,301 ~ $35,210", "$64,301 ~ $72,340", "<span class='rc-chart-cell-highlight'>80% 감면</span> (본인부담 20%)"],
                    ["226% ~ 250% FPL", "$35,211 ~ $39,125", "$72,341 ~ $80,375", "<span class='rc-chart-cell-highlight'>60% 감면</span> (본인부담 40%)"],
                    ["251% ~ 275% FPL", "$39,126 ~ $43,040", "$80,376 ~ $88,410", "<span class='rc-chart-cell-highlight'>40% 감면</span> (본인부담 60%)"],
                    ["276% ~ 300% FPL", "$43,041 ~ $46,950", "$88,411 ~ $96,450", "<span class='rc-chart-cell-highlight'>20% 감면</span> (본인부담 80%)"]
                ],
                "footnote": "자산 한도는 개인 $7,500 이하, 부부/가족 $15,000 이하(주 거주 주택 제외)입니다."
            },
            sections=[
                {
                    "heading": "적용 가능 병원 및 서비스 범위",
                    "content": """
<p>뉴저지 내 모든 비영리 급성기 종합병원(홀리네임 병원, 잉글우드 병원, 해켄색 유니버시티 메디컬 센터, 밸리 병원 등)의 <strong>응급실 진료, 수술, 입원실 비용, 병원 소속 전문의 진료비</strong>에 적용됩니다.</p>
<p>단, 병원과 독립된 외부 개인 병의원이나 사설 검사기관의 빌(Bill)은 별도 협상이 필요할 수 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "병원 진료비 청구서", "desc": "병원에서 날아온 Itemized Billing Statement 사본."},
                {"doc": "소득 증빙", "desc": "진료일 기준 최근 3개월 치 급여명세서 또는 전년도 세금보고서."},
                {"doc": "은행 잔고 증명서", "desc": "진료일 기준 최근 3개월 치 은행 거래 내역서."},
                {"doc": "뉴저지 거주 증명", "desc": "운전면허증, 유틸리티 고지서, 렌트 계약서."}
            ],
            tips=[
                {"title": "진료 후 1년 이내 신청 필수", "desc": "병원비를 연체하여 콜렉션(Collection Agency)으로 넘어가더라도 진료일로부터 1년 이내라면 채리티 케어를 소급 신청하여 빚을 전액 탕감할 수 있습니다."},
                {"title": "서류미비자(Undocumented)도 100% 동일 혜택", "desc": "체류 신분을 묻지 않는 인도주의적 주정부 프로그램이므로 불법체류 신분이라도 안심하고 신청하십시오."}
            ],
            contacts=[
                {"name": "홀리네임 병원 환자 재정상담과", "val": "201-833-3157 (Teaneck, 한국어 통역 가능)"},
                {"name": "잉글우드 병원 채리티케어 부서", "val": "201-894-3030 (Englewood)"},
                {"name": "NJ Department of Health Charity Care", "val": "1-866-588-5696"}
            ]
        )
    })

    # art-24: D-SNP
    articles.append({
        "id": "art-24",
        "slug": "medicaid-specials-dual-eligible-plan-dsnp-ko",
        "category_id": "medicaid-specials",
        "category_name": "특별 메디케이드 & 안전망",
        "title": "듀얼 플랜 (D-SNP)",
        "excerpt": "메디케어와 메디케이드를 동시 보유한 이중 수혜자를 위한 맞춤형 메디케어 어드밴티지 D-SNP 플랜의 파격적 부가 혜택 분석.",
        "content_html": render_article_html(
            cat_title="특별 메디케이드 & 안전망",
            title="메디케어·메디케이드 듀얼 플랜 (D-SNP - Dual Eligible Special Needs Plan)",
            portal_key="medicare_compare",
            exec_summary={
                "정책 취지": "연방 메디케어(Parts A & B)와 주정부 메디케이드(NJ FamilyCare) 자격을 동시에 갖춘 듀얼 수혜자를 위해 민간 보험사가 설계한 최고 수준의 통합 관리의료 플랜입니다.",
                "본인 부담금 완벽 제로": "병원 진료비 코페이 $0, 전문의 $0, 입원 수술 $0, 디덕터블 $0, 처방약 코페이 $0~$11선.",
                "파격적인 월 OTC / 식료품 보조금": "매월 플래스틱 카드에 <span class='rc-chart-cell-highlight'>$100 ~ $250</span> 상당의 수당이 충전되어 한인 마트 식료품, 영양제, 가정 비상약 구매 가능.",
                "추가 혜택": "연간 $2,500~$4,000 상당의 종합 치과(임플란트/틀니 포함), 무료 병원 교통편, 안경 및 보청기 보조."
            },
            chart_info={
                "title": "2026/2027 뉴저지 주요 D-SNP 듀얼 플랜 부가 혜택 비교",
                "badge": "이중 수혜자 특화 혜택",
                "headers": ["제공 혜택 항목", "오리지널 메디케어만 보유 시", "D-SNP 듀얼 플랜 가입 시"],
                "rows": [
                    ["월 식료품/OTC 카드 충전", "지원 없음 ($0)", "<span class='rc-chart-cell-highlight'>월 $120 ~ $220 지급</span> (연 $1,440~$2,640)"],
                    ["종합 치과 치료 (보철/임플란트)", "지원 없음 (0% 커버)", "<span class='rc-chart-badge rc-chart-badge-green'>연 $2,500 ~ $4,000 한도 무료</span>"],
                    ["병원 방문 전용 교통편(Van)", "응급 앰뷸런스만 제한 지원", "<span class='rc-chart-cell-highlight'>연 36~60회 무료 라이드 제공</span>"],
                    ["안경 및 렌즈 지원", "백내장 수술 후 1회만 지원", "매년 $300 ~ $450 안경 프레임 무료"],
                    ["피트니스 센터 회원권", "지원 없음", "SilverSneakers 체육관 무료 이용"]
                ],
                "footnote": "플랜에 가입하더라도 기존의 주정부 메디케이드 및 메디케어 권리는 100% 온전히 유지됩니다."
            },
            sections=[
                {
                    "heading": "특별 가입 기간(SEP)으로 분기별 언제든 플랜 변경 가능",
                    "content": """
<p>일반 메디케어 가입자는 1년에 한 번 가을(AEP)에만 플랜을 바꿀 수 있지만, 듀얼(D-SNP) 수혜자는 <strong>분기별 1회(연중 3회 + 가을 AEP)</strong> 언제든지 본인이 원하는 더 좋은 혜택의 플랜으로 자유롭게 변경할 수 있는 특별 가입 권리(SEP)를 갖습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "빨강·하양·파랑 오리지널 메디케어 카드", "desc": "Part A 및 Part B 유효 카드."},
                {"doc": "NJ FamilyCare 메디케이드 카드", "desc": "현재 유효한 메디케이드 플라스틱 카드."},
                {"doc": "현재 복용 중인 처방약 목록", "desc": "포뮬러리(Formulary) 대조용 처방약 이름과 용량."}
            ],
            tips=[
                {"title": "주치의 네트워크 사전 확인", "desc": "현재 진료받고 계신 한인 내과 의사 선생님이 해당 D-SNP 보험사 네트워크에 가입되어 있는지 반드시 확인 후 등록하십시오."}
            ],
            contacts=[
                {"name": "NJ SHIP (주정부 건강보험 무료 상담)", "val": "1-800-792-8820"},
                {"name": "NJAP 듀얼 플랜 전문 안내", "val": "njaccessportal@gmail.com"}
            ]
        )
    })

    # art-25: Emergency Medicaid
    articles.append({
        "id": "art-25",
        "slug": "medicaid-specials-emergency-med-assistance-ko",
        "category_id": "medicaid-specials",
        "category_name": "특별 메디케이드 & 안전망",
        "title": "응급 의료비 지원 (Emergency Medicaid)",
        "excerpt": "체류 신분(서류미비자, 5년 미만 영주권자)과 무관하게 생명이 위급한 응급실 입원 및 수술비를 전액 지원하는 응급 메디케이드.",
        "content_html": render_article_html(
            cat_title="특별 메디케이드 & 안전망",
            title="응급 의료비 지원 (Emergency Medicaid for Non-Citizens)",
            portal_key="njfamilycare",
            exec_summary={
                "정책 취지": "체류 신분 때문에 정규 메디케이드 가입이 불가능한 서류미비자(Undocumented)나 영주권 취득 5년 미만자라도, 생명이 위급한 응급 상황이 발생했을 때 치료비 전액을 주정부가 지불해 주는 연방 법정 안전망입니다.",
                "적용 범위": "심장마비, 뇌졸중, 대형 외상, 맹장염, 긴급 출산 분만 등 즉각적인 치료를 받지 않으면 사망이나 심각한 신체 손상을 초래하는 급성 응급 입원.",
                "소득 기준": "가구 소득이 연방 빈곤선 138% 이하인 주민.",
                "체류 신분 불이익 전혀 없음": "응급 치료는 인간의 기본 권리이므로 이민국(ICE) 체포나 추방 위험이 전혀 없으며 공적부조(Public Charge) 대상에서 제외."
            },
            chart_info={
                "title": "정규 메디케이드 vs 응급 메디케이드 비교",
                "badge": "체류 신분 무관 지원",
                "headers": ["구분 항목", "정규 NJ FamilyCare", "응급 메디케이드 (Emergency Only)"],
                "rows": [
                    ["체류 신분 요건", "시민권자 또는 5년 이상 영주권자", "<span class='rc-chart-cell-highlight'>체류 신분 전혀 안 봄 (서류미비자 포함)</span>"],
                    ["보장 의료 범위", "외래, 정기검진, 처방약, 치과 등 전면 보장", "<span class='rc-chart-badge rc-chart-badge-amber'>생명 위급 응급실 입원/수술만 커버</span>"],
                    ["효력 지속 기간", "1년 단위 지속 갱신", "응급 상황이 안정(Stabilized)될 때까지"],
                    ["외래 통원 치료", "100% 무료 보장", "원칙적 제외 (단, 응급 치료 직후 필수 처방약 일부)"]
                ],
                "footnote": "응급 상황 발생 후 3개월 이내에 카운티 복지국 또는 병원 소셜워커를 통해 소급 신청해야 합니다."
            },
            sections=[
                {
                    "heading": "응급실 퇴원 후 신청 절차",
                    "content": """
<p>응급실에 실려가거나 수술을 받은 후, 병원 소셜워커에게 <em>'Emergency Medicaid'</em> 신청 의사를 전달하면 병원 측에서 의사의 응급 의무 기록을 첨부하여 카운티 복지국으로 직접 신청서를 접수해 줍니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "의사의 응급 상태 진술서", "desc": "병원 의사가 작성한 급성 응급 상태 확인서."},
                {"doc": "소득 증빙", "desc": "최근 1개월 급여명세서 또는 수입 없음 진술서."},
                {"doc": "뉴저지 거주 증빙", "desc": "본인 명의 우편물, 공과금 고지서 또는 지인 거주 확인서."}
            ],
            tips=[
                {"title": "청구서 날아왔을 때 방치 금지", "desc": "수만 달러의 응급실 청구서가 날아왔을 때 즉시 병원 재정상담과(Financial Counselor)를 찾아 응급 메디케이드 또는 채리티 케어로 전환을 요청해야 신용 손상을 막을 수 있습니다."}
            ],
            contacts=[
                {"name": "버겐카운티 복지국 응급의료과", "val": "201-368-4200"},
                {"name": "NJAP 응급 의료비 긴급 지원", "val": "njaccessportal@gmail.com"}
            ]
        )
    })

    # art-26: Spousal Impoverishment Rules
    articles.append({
        "id": "art-26",
        "slug": "medicaid-specials-spousal-impoverishment-ko",
        "category_id": "medicaid-specials",
        "category_name": "특별 메디케이드 & 안전망",
        "title": "배우자 생계 보호 규정 (Spousal Impoverishment Rules)",
        "excerpt": "부부 중 한 명이 너싱홈에 입원할 때 집에 남은 건전 배우자의 파산을 막기 위한 자산 보호(최대 $163,050) 및 소득 보존 규정.",
        "content_html": render_article_html(
            cat_title="특별 메디케이드 & 안전망",
            title="배우자 생계 보호 규정 (Spousal Impoverishment Protection)",
            portal_key="njfamilycare",
            exec_summary={
                "정책 취지": "부부 중 한 명이 중병으로 요양원(너싱홈)에 입원하거나 장기 간병을 받을 때, 막대한 간호비 때문에 집에 남은 배우자(Community Spouse)가 빈곤층으로 전락하는 것을 법적으로 방지하는 안전장치입니다.",
                "배우자 자산 보호(CSRA)": "부부 공동 자산 중 집에 남은 배우자는 2026년 기준 <span class='rc-chart-cell-highlight'>최대 $163,050</span>의 금융 자산을 합법적으로 온전히 보존할 수 있습니다.",
                "배우자 소득 보존(MMMNA)": "너싱홈에 입원한 배우자의 소셜 연금 중 일부를 건강한 배우자에게 이전하여 <span class='rc-chart-cell-highlight'>월 최소 $2,555 ~ 최대 $3,948</span>의 월소득을 법적으로 보장합니다.",
                "주택 소유권 완벽 보호": "집에 남은 배우자가 생존하여 거주하는 한, 부부 공동 명의의 주택은 메디케이드 자산 심사 및 유산 회수에서 100% 면제 보호됩니다."
            },
            chart_info={
                "title": "2026/2027 뉴저지 배우자 생계 보호 법정 기준액표",
                "badge": "배우자 재산·소득 법적 보호",
                "headers": ["보호 항목", "법정 보호 기준액", "보호 내용 및 취지"],
                "rows": [
                    ["배우자 자산 보호액 (CSRA)", "<span class='rc-chart-cell-highlight'>최소 $32,610 ~ 최대 $163,050</span>", "집에 남은 배우자 몫으로 온전히 떼어두는 금융 자산"],
                    ["배우자 최저 월소득 보장 (MMMNA)", "<span class='rc-chart-cell-highlight'>월 $2,555.00 ~ $3,948.00</span>", "배우자의 월소득이 부족하면 환자 연금에서 이전 지급"],
                    ["주 거주 주택 (Primary Residence)", "<span class='rc-chart-badge rc-chart-badge-green'>주택 가치 무제한 100% 면제</span>", "집에 남은 배우자가 거주하는 동안 매각 강제 불가"],
                    ["자가용 차량 (Automobile)", "<span class='rc-chart-badge rc-chart-badge-green'>차량 1대 무조건 면제</span>", "배우자의 이동권을 위해 시세와 무관하게 인정"]
                ],
                "footnote": "입원 환자 본인 명의의 자산만 $2,000 이하로 맞추면 MLTSS 너싱홈 메디케이드가 승인됩니다."
            },
            sections=[
                {
                    "heading": "부부 자산 분할(Snapshot) 진행 시점",
                    "content": """
<p>배우자가 병원에 입원하거나 너싱홈에 처음 입소한 날을 기준으로 부부의 모든 자산을 <strong>'스냅샷(Snapshot)'</strong>으로 동결 평가합니다. 그 후 절반을 나누어 집에 남은 배우자 몫으로 배정한 뒤, 나머지 환자 몫의 자산만 치료비나 주택 수리 등으로 지출(Spend-down)하면 됩니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "스냅샷 기준일 은행 잔고 증명", "desc": "입원 당일 기준 부부의 모든 금융 계좌 명세서."},
                {"doc": "부부 세금보고서", "desc": "최근 2년간의 공동 세금보고 1040."},
                {"doc": "주택 관련 서류", "desc": "집 디드(Deed), 재산세 고지서, 주택보험 증권, 모기지 명세서."}
            ],
            tips=[
                {"title": "자산을 환자 단독 명의에서 배우자 단독 명의로 이전", "desc": "일반적인 자산 이전은 5년 룩백 페널티가 있지만, 건전 배우자(Community Spouse)에게 이전하는 것은 법적으로 무제한 면제됩니다."},
                {"title": "노인법(Elder Law) 전문 변호사 상담 권장", "desc": "자산 규모가 큰 경우 법정 기준 이상의 재산을 합법적으로 보호할 수 있는 다양한 법률적 도구(Spousal Annuity 등)가 존재합니다."}
            ],
            contacts=[
                {"name": "버겐카운티 ADRC", "val": "201-336-7400"},
                {"name": "NJ Division of Medical Assistance", "val": "1-800-356-1561"}
            ]
        )
    })

    # art-63: Medicaid Buy-In (NJ WorkAbility)
    articles.append({
        "id": "art-63",
        "slug": "medicaid-specials-medicaid-buy-in-ko",
        "category_id": "medicaid-specials",
        "category_name": "특별 메디케이드 & 안전망",
        "title": "메디케이드 바이-인 (Medicaid Buy-In, NJ WorkAbility)",
        "excerpt": "장애인이 일을 하여 소득이 발생하더라도 메디케이드를 잃지 않도록 파격적인 소득과 자산 한도를 제공하는 NJ WorkAbility 프로그램.",
        "content_html": render_article_html(
            cat_title="특별 메디케이드 & 안전망",
            title="장애인 근로자 메디케이드 바이-인 (NJ WorkAbility Program)",
            portal_key="njfamilycare",
            exec_summary={
                "정책 취지": "장애인이 취업하여 돈을 벌면 메디케이드 자격이 박탈되어 치료를 중단하게 되는 모순을 해결하기 위해, 소득이 높아도 소액의 보험료만 내고 메디케이드를 평생 유지할 수 있도록 지원합니다.",
                "수혜 대상": "만 16세~64세 공인 영구 장애인으로서 파트타임 또는 풀타임 유급 근로 활동을 하는 자.",
                "파격적인 소득 한도": "일반 메디케이드의 2배가 넘는 <span class='rc-chart-cell-highlight'>연방 빈곤선 250% 이하 (월 소득 약 $3,200~$3,500)</span>까지 허용.",
                "엄청난 자산 한도 완화": "일반 ABD의 $4,000과 비교할 수 없는 <span class='rc-chart-cell-highlight'>개인 $20,000, 부부 $30,000</span>까지 금융 자산 보유 허용 (은퇴 계좌 401k/IRA는 전액 무제한 면제!)."
            },
            chart_info={
                "title": "일반 메디케이드 vs NJ WorkAbility 바이-인 파격 기준 비교",
                "badge": "장애인 근로자 특화",
                "headers": ["비교 항목", "일반 ABD 메디케이드", "NJ WorkAbility (바이-인)"],
                "rows": [
                    ["월 소득 한도", "월 $1,305 이하 (FPL 100%)", "<span class='rc-chart-cell-highlight'>월 $3,260 이하 (FPL 250%)</span>"],
                    ["금융 자산 한도", "$4,000 이하", "<span class='rc-chart-badge rc-chart-badge-green'>$20,000 이하 (5배 완화)</span>"],
                    ["은퇴 연금(IRA/401k)", "자산으로 합산 (초과 시 탈락)", "<span class='rc-chart-badge rc-chart-badge-green'>전액 무제한 면제 ($0 산정)</span>"],
                    ["월 본인부담 보험료", "$0", "소득에 따라 $25 ~ $65 수준"]
                ],
                "footnote": "자영업자, 프리랜서, 주당 단 1~2시간 일하는 파트타임 근로자도 급여 증빙만 있으면 신청 가능합니다."
            },
            sections=[
                {
                    "heading": "개인 간병인(PCA) 서비스 100% 지속 이용",
                    "content": """
<p>WorkAbility에 가입하면 일반 건강보험으로는 불가능한 <strong>가정 방문 간병인(Personal Care Assistant) 서비스</strong>를 그대로 지원받을 수 있어, 출근 준비나 일상생활에 필요한 간병을 받으며 당당하게 사회생활을 이어갈 수 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "유급 근로 증빙", "desc": "최근 급여명세서(Paystub) 또는 자영업 소득세 신고서."},
                {"doc": "사회보장국 장애 인정서", "desc": "SSA 장애 판정 통지서 또는 의사 진단서."},
                {"doc": "은행 명세서", "desc": "잔고 $20,000 이하 입증 서류."}
            ],
            tips=[
                {"title": "자영업자 1099 소득도 가능", "desc": "작은 재택 알바나 소규모 프리랜서 수입도 정식 사업자 등록이나 세금 신고가 되면 적격 근로 활동으로 인정됩니다."}
            ],
            contacts=[
                {"name": "NJ WorkAbility 전담 사무소", "val": "1-888-285-3036"},
                {"name": "공식 안내 포털", "val": "nj.gov/humanservices/dmahs/clients/workability"}
            ]
        )
    })

    # art-64: Medicaid Estate Recovery
    articles.append({
        "id": "art-64",
        "slug": "medicaid-specials-medicaid-recovery-ko",
        "category_id": "medicaid-specials",
        "category_name": "특별 메디케이드 & 안전망",
        "title": "메디케이드 회수 (Medicaid Estate Recovery)",
        "excerpt": "만 55세 이상 시니어가 메디케이드(너싱홈/장기요양)를 이용한 후 사후 유산에서 주정부가 비용을 회수하는 규정과 합법적 보호 전략.",
        "content_html": render_article_html(
            cat_title="특별 메디케이드 & 안전망",
            title="메디케이드 유산 회수 규정 (Estate Recovery - 주택 압류 방지 전략)",
            portal_key="njfamilycare",
            exec_summary={
                "정책 취지": "연방 및 뉴저지주 법령에 따라 만 55세 이상 수급자가 사망했을 때, 생전에 주정부가 지원했던 롱텀케어(너싱홈, 재택 간병, 병원비) 비용을 고인의 법적 유산(Estate)에서 사후 회수하는 제도입니다.",
                "회수 대상 범위": "일반적인 의사 진료나 처방약은 회수 대상이 아니며, 주로 <span class='rc-chart-cell-highlight'>너싱홈 요양원 입원비 및 재택 롱텀케어(MLTSS) 비용</span>에 집중됩니다.",
                "완벽한 면제 조건": "고인 사망 시점에 <span class='rc-chart-badge rc-chart-badge-green'>생존 배우자가 있거나, 21세 미만 자녀, 또는 시각/중증 장애인 자녀</span>가 있는 경우 회수가 법적으로 100% 영구 금지됩니다.",
                "핵심 예방책": "주택을 메디케이드 신청 5년 전에 취소불능 신탁(MAPT)으로 이전하거나, 유언 검인(Probate)을 거치지 않는 권리 구조로 사전 설계."
            },
            chart_info={
                "title": "뉴저지 메디케이드 유산 회수(Estate Recovery) 면제 사유",
                "badge": "법적 강제 회수 금지 요건",
                "headers": ["면제 사유", "법적 근거", "보호 대상 자산", "회수 집행 결과"],
                "rows": [
                    ["생존 배우자 존재", "연방 Title XIX 규정", "주택 및 모든 유산", "<span class='rc-chart-cell-highlight'>배우자 생존 중 회수 100% 금지</span>"],
                    ["장애인 자녀 존재", "연방 면제 조항", "주택 및 모든 유산", "<span class='rc-chart-badge rc-chart-badge-green'>영구 회수 면제 (완전 면탈)</span>"],
                    ["간병인 자녀 예외 (Caregiver Child)", "2년 이상 동거 간병", "주택 명의 이전", "<span class='rc-chart-badge rc-chart-badge-green'>자녀 명의로 주택 100% 무상 증여 허용</span>"],
                    ["유산 가치 극소액", "$20,000 이하 유산", "소액 유산", "행정 비용 과다로 회수 포기"]
                ],
                "footnote": "생존 배우자가 추후 사망하더라도 그 시점에 남은 자산에 대해 주정부 근저당(Lien)이 검토될 수 있습니다."
            },
            sections=[
                {
                    "heading": "간병인 자녀 예외(Caregiver Child Exemption) 활용법",
                    "content": """
<p>부모가 너싱홈에 입소하기 전 최소 <strong>연속 2년 이상 부모의 집에서 함께 거주하며 부모를 정성껏 간병</strong>하여 너싱홈 입소를 2년 이상 지연시킨 성인 자녀가 있다면, 부모의 집을 해당 자녀 명의로 100% 이전해도 5년 룩백 페널티가 면제되고 유산 회수도 피할 수 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "동거 증빙 서류 (간병인 자녀)", "desc": "과거 2년간 동일 주소지로 된 운전면허증, 세금보고서, 은행 명세서."},
                {"doc": "의사 진술서", "desc": "자녀의 간병이 없었다면 2년 전 이미 너싱홈에 입소했어야 했다는 주치의 공식 소견서."},
                {"doc": "장애인 증명서 (해당자)", "desc": "자녀의 소셜 시큐리티 장애 판정 통지서."}
            ],
            tips=[
                {"title": "사전 메디케이드 자산보호 신탁(MAPT) 설립", "desc": "건강할 때 주택을 신탁으로 이전해 두고 5년이 경과하면 주정부는 해당 주택에 대해 어떠한 유산 회수 린(Lien)도 설정할 수 없습니다."},
                {"title": "경제적 곤경 면제(Undue Hardship Waiver) 신청", "desc": "유산 회수로 인해 유족이 거주지를 잃고 복지 수급자로 전락할 위기라면 주정부에 서면으로 회수 면제 탄원서를 제출하십시오."}
            ],
            contacts=[
                {"name": "NJ Estate Recovery 전담 부서", "val": "609-588-2993"},
                {"name": "NJAP 유산보호 전문 법률 연계", "val": "njaccessportal@gmail.com"}
            ]
        )
    })

    return articles

print("cat_medicaid_specials.py loaded successfully.")
