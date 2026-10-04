# -*- coding: utf-8 -*-
"""
In-Home Care category articles (6 articles)
"""
from .common import render_article_html

def get_in_home_care_articles():
    articles = []

    # art-30: PPP (Personal Preference Program)
    articles.append({
        "id": "art-30",
        "slug": "in-home-care-ppp-ko",
        "category_id": "in-home-care",
        "category_name": "재택 돌봄 & 간병 지원",
        "title": "간병인 지정 프로그램(PPP)",
        "excerpt": "뉴저지 메디케이드 수급자가 성인 자녀, 며느리, 친척을 간병인으로 직접 고용하여 주정부로부터 월 최대 $2,000~$3,500 시급을 지급받는 PPP 프로그램.",
        "content_html": render_article_html(
            cat_title="재택 돌봄 & 간병 지원",
            title="개인 선호 간병 프로그램 (NJ Personal Preference Program - 가족 간병인 시급 지원)",
            portal_key="nj_ppp",
            exec_summary={
                "정책 취지": "남에게 거동과 목욕을 맡기기 꺼려하는 시니어가 외부 사설 홈케어 간호사 대신, 본인이 신뢰하는 가족(성인 자녀, 며느리, 사위, 친척 등)을 공식 간병인으로 지정하여 주정부 재정으로 시급을 지급하는 뉴저지 대표 자립 복지입니다.",
                "수혜 요건": "뉴저지 메디케이드(NJ FamilyCare) 수급자로서 일상생활 보조(PCA) 필요 평가를 통과한 자.",
                "가족 간병인 급여 수준": "승인된 간병 시간(주당 15~40시간)에 따라 <span class='rc-chart-cell-highlight'>월 약 $1,800 ~ $3,600 (시급 약 $18~$23선)</span>이 간병인의 은행 계좌로 주정부 대행사(Public Partnerships LLC)에서 직접 입금.",
                "간병인 자격": "만 18세 이상 합법적 근로 가능자 (별도의 간호사 자격증 불필요, 법적 배우자는 제외 원칙).",
                "운영 기관": "뉴저지 의료지원과(DMAHS) 및 PPL(Public Partnerships LLC) 재정 관리 대행."
            },
            chart_info={
                "title": "2026/2027 뉴저지 PPP 가족 간병인 주당 시간별 예상 월 급여",
                "badge": "가족 간병인 합법 급여",
                "headers": ["주정부 승인 주당 간병 시간", "가족 간병인 시급 (추정)", "월간 총 간병 시간", "월 예상 수령 급여 (세전)"],
                "rows": [
                    ["주 20시간 승인", "$20.00 / 시간", "월 80시간", "<span class='rc-chart-cell-highlight'>월 약 $1,600</span>"],
                    ["주 30시간 승인", "$20.00 / 시간", "월 120시간", "<span class='rc-chart-cell-highlight'>월 약 $2,400</span>"],
                    ["<span class='rc-chart-cell-highlight'>주 40시간 승인 (최대)</span>", "$20.00 / 시간", "월 160시간", "<span class='rc-chart-badge rc-chart-badge-green'>월 약 $3,200 ~ $3,600</span>"]
                ],
                "footnote": "급여는 간병인의 W-2 과세 소득으로 처리되나, 동일 주소지에 동거하는 가족 간병인은 IRS Difficulty of Care 규정으로 연방 소득세 비과세 혜택을 받을 수 있습니다."
            },
            sections=[
                {
                    "heading": "동거 가족 간병인의 연방 소득세 비과세 혜택 (Notice 2014-7)",
                    "content": """
<p>간병인으로 등록된 자녀가 부모님과 같은 집(동일 주소지)에 거주하며 간병하는 경우, IRS Notice 2014-7 세법 규정에 따라 <strong>수령하는 간병 급여 전액에 대해 연방 소득세가 100% 면제</strong>됩니다. 이는 연간 수천 달러의 세금을 절감하는 거대한 혜택입니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "NJ FamilyCare 메디케이드 카드", "desc": "환자의 유효한 메디케이드 카드."},
                {"doc": "의사 처방전 및 간호 소견서", "desc": "가정 내 일상생활 보조(PCA)가 필요하다는 의사 처방."},
                {"doc": "간병인 신분증 및 취업 자격", "desc": "간병인으로 일할 가족의 운전면허증, 소셜 카드, 범죄기록 조회 동의서."}
            ],
            tips=[
                {"title": "MCO 간호사 가정 실사(Assessment) 철저 대비", "desc": "보험사 간호사가 가정을 방문해 점수를 매길 때, 환자가 평소 혼자 하기 힘든 동작(목욕, 옷 입기, 화장실 이용, 식사 준비 등)을 솔직하게 정확히 보여주어야 높은 주당 시간이 배정됩니다."},
                {"title": "여러 명의 가족을 간병인으로 분할 등록 가능", "desc": "주 40시간을 한 명의 자녀가 다 하기 힘들다면, 큰딸 25시간 + 며느리 15시간 등으로 시간을 나누어 등록할 수 있습니다."}
            ],
            contacts=[
                {"name": "NJ PPP 전담 콜센터", "val": "1-800-356-1561"},
                {"name": "PPL (Public Partnerships) 고객센터", "val": "1-844-842-5891"}
            ]
        )
    })

    # art-31: JACC
    articles.append({
        "id": "art-31",
        "slug": "in-home-care-jacc-ko",
        "category_id": "in-home-care",
        "category_name": "재택 돌봄 & 간병 지원",
        "title": "뉴저지 간병 지원 프로그램(JACC)",
        "excerpt": "소득이나 자산이 메디케이드 기준을 약간 초과하여 혜택을 못 받는 중산층 시니어를 위한 뉴저지 주정부 재택 돌봄 지원(JACC).",
        "content_html": render_article_html(
            cat_title="재택 돌봄 & 간병 지원",
            title="뉴저지 커뮤니티 간병 지원 (JACC - Jersey Assistance for Community Caregiving)",
            portal_key="nj_dhs_doas",
            exec_summary={
                "정책 취지": "메디케이드 자격 기준보다 소득이나 자산이 다소 많아서 정부 간병 지원을 받지 못하는 중산층 시니어가 자택에서 요양할 수 있도록 주정부 기금으로 재택 간병 서비스를 보조합니다.",
                "수혜 요건": "만 60세 이상 뉴저지 주민으로서 너싱홈 입소 수준의 간호가 필요하지만 메디케이드 자산 한도 초과로 탈락한 어르신.",
                "완화된 재정 기준": "월 소득 한도 최대 약 $4,500선, 자산 한도 독신 <span class='rc-chart-cell-highlight'>$40,000, 부부 $60,000 이하</span>로 일반 메디케이드의 10배 완화.",
                "지원 서비스": "가정 방문 간병인, 어덜트 데이케어, 방문 식사 배달, 간병인 휴식, 가옥 개조(경사로/안전손잡이 설치)."
            },
            chart_info={
                "title": "2026/2027 JACC 중산층 시니어 재정 기준 및 지원 한도",
                "badge": "중산층 전용 간병 안전망",
                "headers": ["구분 항목", "일반 메디케이드 MLTSS", "JACC (중산층 간병 지원)"],
                "rows": [
                    ["금융 자산 한도", "$2,000 이하", "<span class='rc-chart-cell-highlight'>독신 $40,000 / 부부 $60,000 이하</span>"],
                    ["소득 기준", "월 $2,982 이하", "<span class='rc-chart-cell-highlight'>주 중위소득 365% 이하 (월 약 $4,500)</span>"],
                    ["월 지원 한도", "전액 주정부 부담", "가구당 월 최대 약 $800 ~ $1,200 상당 서비스"],
                    ["본인 분담금 (Co-pay)", "0% ($0)", "소득에 따라 서비스 비용의 5%~25% 소액 분담"]
                ],
                "footnote": "사비(Private Pay)로 간병인을 고용하면 월 수천 달러가 들지만, JACC를 통하면 매우 저렴하게 재택 간병을 유지할 수 있습니다."
            },
            sections=[
                {
                    "heading": "제공되는 맞춤형 케어 패키지",
                    "content": """
<p>카운티 노인복지국 전담 매니저가 가정을 방문하여 어르신의 건강 상태에 맞추어 주 2~3회 간병인 파견, 주 2회 주간 데이케어 센터 이용, 낙상 방지용 화장실 안전바 설치 등을 종합 패키지로 승인합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "소득 증빙", "desc": "소셜 연금 증명서, 개인 연금, 은퇴 계좌 인출 내역."},
                {"doc": "은행 잔고 증명서", "desc": "최근 3개월 치 금융 자산 명세서 ($40,000 이하 입증)."},
                {"doc": "의사 진단서", "desc": "주치의의 일상생활 보조 필요 소견서."}
            ],
            tips=[
                {"title": "너싱홈 입소를 늦추는 최고의 중간 단계", "desc": "완전 저소득층이 아니더라도 집에서 존엄하게 노후를 보낼 수 있는 가장 현실적인 프로그램입니다."}
            ],
            contacts=[
                {"name": "버겐카운티 ADRC JACC 담당", "val": "201-336-7400"},
                {"name": "NJ Division of Aging Services", "val": "1-877-222-3737"}
            ]
        )
    })

    # art-32: Respite Care
    articles.append({
        "id": "art-32",
        "slug": "in-home-care-respite-care-ko",
        "category_id": "in-home-care",
        "category_name": "재택 돌봄 & 간병 지원",
        "title": "간병인 휴식 지원 (Respite Care)",
        "excerpt": "치매나 중증 질환 부모님을 돌보느라 탈진한 가족 간병인을 위한 단기 대체 간병 및 힐링 휴식 지원 프로그램.",
        "content_html": render_article_html(
            cat_title="재택 돌봄 & 간병 지원",
            title="가족 간병인 휴식 지원 (Statewide Respite Care Program - 간병 피로 해소)",
            portal_key="bergen_seniors",
            exec_summary={
                "정책 취지": "만성 질환자나 치매 노인을 24시간 돌보는 가족 간병인의 신체적·정신적 탈진(Burnout)을 예방하기 위해, 가족이 쉴 수 있도록 주정부가 전문 대체 간병인을 무상 파견해 주는 복지입니다.",
                "수혜 대상": "치매, 뇌졸중, 파킨슨병 등으로 상시 간병이 필요한 뉴저지 주민을 돌보고 있는 무급 가족 간병인.",
                "지원 규모": "가구당 <span class='rc-chart-cell-highlight'>연간 최대 $4,500 ~ $5,500</span> 상당의 대체 간병 서비스 무료 제공.",
                "이용 형태": "1) 대체 간병인 가정 파견, 2) 성인 주간 데이케어 센터 임시 위탁, 3) 가족 여행이나 입원 시 너싱홈 단기 입소(Respite Bed)."
            },
            chart_info={
                "title": "뉴저지 간병인 휴식(Respite Care) 3대 이용 모델",
                "badge": "가족 휴식 보장",
                "headers": ["이용 모델", "서비스 내용", "최대 이용 가능 기간", "가족에게 주는 혜택"],
                "rows": [
                    ["재택 대체 간병 (In-Home)", "공인 간호조무사 가정 파견", "주당 일정 시간 또는 1일 집중", "가족의 외출, 병원 방문, 휴식 보장"],
                    ["성인 데이케어 위탁", "주간 보호 센터 데이케어", "주 2~3회 일과 시간", "환자의 사교 활동 및 가족 자유 시간"],
                    ["시설 단기 입원 (Overnight)", "<span class='rc-chart-cell-highlight'>너싱홈/어시스티드 리빙 24시간 입소</span>", "<span class='rc-chart-badge rc-chart-badge-blue'>연간 7일 ~ 14일 연속</span>", "<span class='rc-chart-cell-highlight'>가족 출장, 여행, 질병 시 안심 위탁</span>"]
                ],
                "footnote": "환자의 소득 수준에 따라 무료($0) 또는 서비스 가치의 5%~20% 수준의 소액 슬라이딩 코페이가 적용될 수 있습니다."
            },
            sections=[
                {
                    "heading": "간병인의 정신 건강과 지속 가능한 돌봄",
                    "content": """
<p>가족을 혼자 돌보다가 간병인 자신이 쓰러지는 비극이 많습니다. Respite Care를 이용하면 가족 간병인이 1주일간 휴가를 다녀오거나 본인의 치료를 받는 동안 환자를 최고 수준의 인가 시설에 안심하고 단기 위탁할 수 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "환자 의무 기록", "desc": "주치의 진단서 및 상시 간병 필요 소견서."},
                {"doc": "가족 간병인 진술서", "desc": "현재 돌봄 상황 및 휴식 지원 필요 사유서."},
                {"doc": "소득 증빙", "desc": "환자의 소득 증빙 서류."}
            ],
            tips=[
                {"title": "연초에 사전 예약 신청", "desc": "여름 휴가철이나 연말에는 시설 단기 입소 침상(Respite Bed) 수요가 몰리므로 최소 1~2개월 전에 카운티 담당자에게 일정을 예약하십시오."}
            ],
            contacts=[
                {"name": "버겐카운티 노인복지국 Respite 담당", "val": "201-336-7400"},
                {"name": "Bergen County Office of Caregiver Services", "val": "co.bergen.nj.us"}
            ]
        )
    })

    # art-33: Meals on Wheels
    articles.append({
        "id": "art-33",
        "slug": "in-home-care-meals-on-wheels-ko",
        "category_id": "in-home-care",
        "category_name": "재택 돌봄 & 간병 지원",
        "title": "가정 배달 서비스 (Meals on Wheels)",
        "excerpt": "장보기와 요리가 힘든 거동 불편 시니어를 위한 따뜻한 일일 영양 도시락 가가호호 배달 및 일일 안부 확인 서비스.",
        "content_html": render_article_html(
            cat_title="재택 돌봄 & 간병 지원",
            title="시니어 가정 식사 배달 (Meals on Wheels - 따뜻한 영양식 가가호호 배송)",
            portal_key="meals_on_wheels",
            exec_summary={
                "정책 취지": "거동이 불편하거나 건강 문제로 장을 보거나 음식을 조리하기 어려운 60세 이상 어르신에게 영양 균형이 잡힌 따뜻한 식사를 매일 집 앞까지 직접 배달해 주는 지역사회 영양 복지입니다.",
                "수혜 자격": "만 60세 이상 뉴저지 거주자로서 독립적으로 장보기나 식사 준비가 불가능한 거동 불편 시니어 (소득 무관!).",
                "배달 구성": "전문 영양사가 설계한 단백질, 채소, 곡물, 우유/과일이 포함된 균형 잡힌 온식(Hot Meal) 및 주말용 냉동식.",
                "생명 지킴이 역할": "자원봉사 배달원이 식사를 전달하며 <span class='rc-chart-cell-highlight'>매일 시니어의 건강과 안전 상태(Wellness Check)를 직접 눈으로 확인</span>."
            },
            chart_info={
                "title": "뉴저지 밀스 온 휠스(Meals on Wheels) 운영 세부 사항",
                "badge": "거동 불편 시니어 필수 영양",
                "headers": ["항목", "운영 규정", "상세 내용"],
                "rows": [
                    ["배달 주기", "월요일 ~ 금요일 (주 5일)", "오전 10:30 ~ 오후 1:00 사이 매일 배송"],
                    ["주말 및 악천후", "냉동 비축식 사전 배송", "폭설 대비 비상 통조림 패킷 사전 지급"],
                    ["식사 비용", "<span class='rc-chart-badge rc-chart-badge-green'>자발적 기부 권장 (Donation)</span>", "형편에 따라 끼당 $1~$3 권장 (미기부자도 절대 배달 중단 없음)"],
                    ["식이요법 옵션", "당뇨식, 저염식, 저당식", "주치의 식이 처방에 맞춘 맞춤형 식단"]
                ],
                "footnote": "버겐카운티의 경우 카운티 노인복지국 산하 영양과(Division of Senior Services)에서 전 타운을 관할합니다."
            },
            sections=[
                {
                    "heading": "고독사 예방을 위한 일일 안부 확인(Safety Check)",
                    "content": """
<p>Meals on Wheels는 단순한 도시락 배달이 아닙니다. 자원봉사자가 노크를 했을 때 어르신이 응답하지 않거나 문을 열지 못하면, 즉시 카운티 비상 연락망과 경찰(경찰 복지 확인 호출)에 신고하여 낙상이나 심장마비로 쓰러진 어르신의 생명을 구하는 중대한 안전망 역할을 합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "신분증 및 거주 증빙", "desc": "60세 이상 증빙 및 거주지 주소."},
                {"doc": "비상 연락처", "desc": "긴급 상황 발생 시 연락할 자녀 또는 친지 연락처 2곳."},
                {"doc": "의사 진단 확인 (전화 인터뷰)", "desc": "외출이 어렵고(Homebound) 조리가 불가능하다는 간호사 인터뷰."}
            ],
            tips=[
                {"title": "병원 퇴원 직후 즉시 신청", "desc": "수술이나 골절로 퇴원하여 임시로 거동이 불편해진 경우에도 몇 개월간 단기 배달 서비스 이용이 가능합니다."}
            ],
            contacts=[
                {"name": "버겐카운티 Meals on Wheels 본부", "val": "201-336-7420 / 201-336-7400"},
                {"name": "Meals on Wheels America", "val": "mealsonwheelsamerica.org"}
            ]
        )
    })

    # art-34: Home Health Care
    articles.append({
        "id": "art-34",
        "slug": "in-home-care-home-health-care-ko",
        "category_id": "in-home-care",
        "category_name": "재택 돌봄 & 간병 지원",
        "title": "홈케어 (Home Health Care)",
        "excerpt": "병원 퇴원 후 또는 만성 질환 시 공인 간호사, 물리치료사, 작업치료사가 가정을 직접 방문하는 메디케어 100% 무료 방문 의료 서비스.",
        "content_html": render_article_html(
            cat_title="재택 돌봄 & 간병 지원",
            title="가정 방문 의료 서비스 (Home Health Care - 메디케어 100% 무료 간호 & 재활)",
            portal_key="medicare_gov",
            exec_summary={
                "정책 취지": "수술 후 퇴원했거나 거동이 힘든 환자가 병원에 직접 가지 않고도 집에서 전문 간호, 욕창 치료, 주사 처치, 물리치료 및 작업치료를 받을 수 있는 방문 의료 서비스입니다.",
                "메디케어 파트 A & B 100% 보장": "의사의 처방이 있고 거동 불편(Homebound) 요건을 충족하면 <span class='rc-chart-cell-highlight'>디덕터블 $0, 코페이 $0 전액 무료</span>로 제공.",
                "방문 전문가": "공인 정간호사(RN), 물리치료사(PT), 작업치료사(OT), 언어치료사(ST), 의료 소셜워커.",
                "제공 기간": "주치의의 정기 처방에 따라 통상 60일 단위로 갱신되며 필요시 장기 지속 가능."
            },
            chart_info={
                "title": "방문 간호(Home Health) vs 재택 생활간병(Home Care) 비교",
                "badge": "의료 간호 vs 일상 간병",
                "headers": ["비교 항목", "방문 보건 의료 (Home Health Care)", "재택 생활 간병 (Personal Home Care)"],
                "rows": [
                    ["서비스 성격", "<span class='rc-chart-cell-highlight'>의료적 처치 및 재활 치료</span>", "비의료적 일상생활 보조 (목욕, 청소, 식사)"],
                    ["의사 처방 필요 여부", "<span class='rc-chart-badge rc-chart-badge-blue'>의사 처방전 필수</span>", "의사 처방 불필요"],
                    ["메디케어 보장", "<span class='rc-chart-badge rc-chart-badge-green'>메디케어 100% 무료 ($0)</span>", "메디케어 미적용 (메디케이드/사비)"],
                    ["파견 전문 인력", "등록 간호사(RN), 면허 물리치료사(PT)", "공인 간호조무사(CHHA), 요양보호사"]
                ],
                "footnote": "의료적 방문 간호를 받는 동안 환자의 목욕과 옷 입기를 돕는 간호조무사(Home Health Aide) 서비스도 메디케어로 함께 무료 제공됩니다."
            },
            sections=[
                {
                    "heading": "거동 불편(Homebound) 인정 기준",
                    "content": """
<p>메디케어에서 가정 방문 치료를 무료로 받으려면 주치의로부터 <em>'외출 시 지팡이, 휠체어, 타인의 도움이 필요하며, 외출 자체가 극심한 피로를 수반한다'</em>는 Homebound 상태를 진단서에 명시받아야 합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "주치의 가정간호 처방전 (Face-to-Face Encounter)", "desc": "의사의 정식 처방 오더."},
                {"doc": "메디케어 카드", "desc": "Original Medicare 또는 메디케어 어드밴티지 카드."},
                {"doc": "퇴원 요약서 (해당자)", "desc": "병원 또는 단기 재활원 퇴원 기록지."}
            ],
            tips=[
                {"title": "한국어 가능 방문 간호사 에이전시 지정", "desc": "버겐카운티 내에는 한국인 RN 간호사와 물리치료사를 보유한 홈헬스 에이전시들이 다수 있으므로 병원 퇴원 전 한인 에이전시로 연계를 요청하십시오."}
            ],
            contacts=[
                {"name": "Medicare.gov 공식 홈헬스 비교", "val": "1-800-MEDICARE (medicare.gov/care-compare)"},
                {"name": "NJ Department of Health 인가기관 조회", "val": "nj.gov/health"}
            ]
        )
    })

    # art-72: Congregate Meals
    articles.append({
        "id": "art-72",
        "slug": "in-home-care-congregate-meals-ko",
        "category_id": "in-home-care",
        "category_name": "재택 돌봄 & 간병 지원",
        "title": "시니어 단체 급식(Congregate Meals)",
        "excerpt": "버겐카운티 타운별 시니어 센터에서 만 60세 이상 어르신에게 제공하는 무료 점심 식사, 사교 및 건강 프로그램 안내.",
        "content_html": render_article_html(
            cat_title="재택 돌봄 & 간병 지원",
            title="시니어 커뮤니티 단체 급식 (Congregate Nutrition Centers - 시니어 센터 점심)",
            portal_key="bergen_seniors",
            exec_summary={
                "정책 취지": "만 60세 이상 시니어들이 동년배 친구들과 사귀고 고립감을 해소하며 영양가 높은 식사를 즐길 수 있도록 각 타운 시니어 센터에서 따뜻한 점심 식사를 매일 제공합니다.",
                "수혜 자격": "만 60세 이상 뉴저지 주민 및 배우자 (소득이나 자산 조건 전혀 없음!).",
                "이용 비용": "원칙적으로 무료이며 자발적인 소액 기부(권장액 $1.25~$2.00) 환영.",
                "복합 프로그램": "식사 전후 라인댄스, 체스, 바둑, 영어 교실, 혈압 측정, 건강 세미나 등 다채로운 커뮤니티 활동 동시 운영."
            },
            chart_info={
                "title": "버겐카운티 주요 한인 이용 시니어 급식 센터 현황",
                "badge": "타운별 점심 급식 센터",
                "headers": ["센터 명칭", "소재지 타운", "식사 제공 시간", "주요 활동 프로그램"],
                "rows": [
                    ["<span class='rc-chart-cell-highlight'>Fort Lee Senior Center</span>", "포트리 (1355 Inwood Ter)", "월~금 11:30 AM ~ 12:30 PM", "사교, 바둑, 탁구, 건강 상담"],
                    ["<span class='rc-chart-cell-highlight'>Palisades Park Senior Center</span>", "팰팍 (300 Broad Ave)", "월~금 11:30 AM ~ 12:30 PM", "한인 시니어 노래교실, 건강체조"],
                    ["Ridgefield Senior Center", "리지필드 (725 Slocum Ave)", "월~금 점심 시간", "체력 단련, 게임, 사교"],
                    ["Bergenfield Senior Center", "버겐필드 (293 Murray Hill)", "월~금 점심 시간", "문화 예술 강좌, 공예"]
                ],
                "footnote": "식재료 준비를 위해 이용 전날 오전까지 해당 센터에 식사 인원을 사전 예약(Sign-up)해야 합니다."
            },
            sections=[
                {
                    "heading": "무료 셔틀 버스 교통편 연계",
                    "content": """
<p>자가용 운전이 어려운 어르신들을 위해 각 타운 자치정부 및 카운티 복지국에서 자택에서 시니어 센터까지 왕복 무료 셔틀 버스를 운행합니다. 센터 등록 시 교통편도 함께 신청하십시오.</p>
"""
                }
            ],
            checklist=[
                {"doc": "연령 증빙 신분증", "desc": "만 60세 이상 확인용 운전면허증 또는 여권."},
                {"doc": "센터 등록 신청서", "desc": "비상 연락처가 포함된 타운 시니어 센터 가입 양식."}
            ],
            tips=[
                {"title": "식사 사전 예약 필수", "desc": "음식물 낭비를 막기 위해 대다수 센터가 전날 점심시간 전까지 사전 명단 작성을 요구하므로 일정을 미리 챙기십시오."}
            ],
            contacts=[
                {"name": "버겐카운티 노인복지국 영양과", "val": "201-336-7420"},
                {"name": "포트리 잭 알터 시니어 센터", "val": "201-592-3690"}
            ]
        )
    })

    return articles

print("cat_in_home_care.py loaded successfully.")
