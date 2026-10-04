# -*- coding: utf-8 -*-
"""
Long-Term Care category articles (6 articles)
"""
from .common import render_article_html

def get_long_term_care_articles():
    articles = []

    # art-35: Adult Day Care
    articles.append({
        "id": "art-35",
        "slug": "long-term-care-program-adult-day-care-ko",
        "category_id": "long-term-care",
        "category_name": "장기 요양 & 주간 데이케어",
        "title": "어덜트 데이 케어 (Adult Day Care)",
        "excerpt": "어르신 주간 보호 센터(Adult Day Care). 차량 픽업, 영양 한식 식사, 간호사 건강 체크 및 메디케이드 100% 전액 지원 혜택.",
        "content_html": render_article_html(
            cat_title="장기 요양 & 주간 데이케어",
            title="성인 주간 보호 센터 (Adult Day Care - 어덜트 데이케어 종합 가이드)",
            portal_key="bergen_seniors",
            exec_summary={
                "정책 취지": "낮 동안 홀로 집에 계시기 적적하거나 치매/만성 질환으로 보살핌이 필요한 어르신에게 주 1~5회 낮 시간 동안 전문 의료 간호, 한식 식사, 신체 재활, 사교 활동을 제공하고 저녁에 집으로 귀가하는 주간 요양 복지입니다.",
                "메디케이드 100% 무료 지원": "NJ FamilyCare MLTSS 가입자는 <span class='rc-chart-cell-highlight'>차량 왕복 픽업, 아침/점심 식사, 물리치료, 프로그램 일체가 100% 무료 ($0)</span>로 제공됩니다.",
                "시설 유형": "1) 의료형(Medical Adult Day Care - 간호사 상주, 투약, 당뇨/혈압 관리), 2) 사회형(Social Day Care - 사교 및 여가 중심).",
                "가족의 안심": "낮 시간 동안 직장에 출근하는 자녀들이 부모님의 낙상이나 안전사고 걱정 없이 생업에 전념할 수 있습니다."
            },
            chart_info={
                "title": "의료형 어덜트 데이케어(Medical Day Care) 일과표 및 서비스",
                "badge": "메디케이드 전액 무료",
                "headers": ["시간대", "프로그램 내용", "전문 인력 배치", "제공 혜택"],
                "rows": [
                    ["오전 8:30 ~ 9:30", "자택 앞 도어투도어 전용 밴 차량 픽업", "전문 운전원 및 안전 도우미", "휠체어 리프트 차량 완비"],
                    ["오전 9:30 ~ 10:30", "도착 및 바이탈 체크 (혈압/혈당)", "등록 정간호사(RN)", "일일 건강 이상 유무 모니터링"],
                    ["오전 10:30 ~ 12:00", "물리치료, 기체조, 인지 인센티브 게임", "물리치료사 / 작업치료사", "치매 예방 및 관절 재활 운동"],
                    ["낮 12:00 ~ 1:00", "<span class='rc-chart-cell-highlight'>영양 한식 점심 식사 (국, 밥, 4찬)</span>", "전문 조리사 및 임상 영양사", "저염 당뇨 맞춤형 식단"],
                    ["오후 1:00 ~ 2:30", "서예, 노래교실, 바둑, 생일 파티", "사회복지사 / 여가 지도사", "한인 시니어 교우 관계 증진"],
                    ["오후 2:30 ~ 3:30", "안전 귀가 차량 운행 (집 앞 도착)", "전용 밴", "가정까지 안전 호송"]
                ],
                "footnote": "버겐카운티 내에는 포트리, 팰팍, 해켄색, 릿지필드 등지에 다수의 한국계 어덜트 데이케어 센터가 활발히 운영 중입니다."
            },
            sections=[
                {
                    "heading": "데이케어와 가정 간병인(PPP) 동시 이용 가능 여부",
                    "content": """
<p>뉴저지 MLTSS 규정에 따라 어덜트 데이케어를 주 2~3회 이용하면서, 나머지 날이나 주말에는 가정 방문 간병인(PPP 또는 Home Health Aide)을 병행하여 이용할 수 있습니다. 카운티 케이스 매니저와의 플랜 조율을 통해 최적의 케어 믹스를 설계하십시오.</p>
"""
                }
            ],
            checklist=[
                {"doc": "NJ FamilyCare 메디케이드 카드", "desc": "MLTSS 플랜이 포함된 보험 카드."},
                {"doc": "의사 신체검사서", "desc": "주간 데이케어 이용에 결격 사유가 없다는 주치의 소견서."},
                {"doc": "결핵 검사(PPD/X-ray) 음성 확인서", "desc": "단체 생활을 위한 필수 감염병 검사지."}
            ],
            tips=[
                {"title": "직접 센터를 방문(Tour)하여 분위기 확인", "desc": "센터마다 식단의 퀄리티, 프로그램 수준, 회원들의 연령대 및 분위기가 다르므로 최소 2~3곳을 직접 방문하여 체험해 보십시오."}
            ],
            contacts=[
                {"name": "버겐카운티 ADRC 데이케어 상담", "val": "201-336-7400"},
                {"name": "NJAP 어덜트 데이케어 무료 연계", "val": "201-336-7400"}
            ]
        )
    })

    # art-36: Nursing Home Care
    articles.append({
        "id": "art-36",
        "slug": "long-term-care-program-nursing-home-care-ko",
        "category_id": "long-term-care",
        "category_name": "장기 요양 & 주간 데이케어",
        "title": "널싱홈 케어 (Nursing Home Care)",
        "excerpt": "24시간 의사·간호사 상주 전문 요양 시설(SNF) 입원 자격, 월 $12,000~$15,000 비용의 메디케이드 MLTSS 전액 지원 및 한인 전담 요양원 안내.",
        "content_html": render_article_html(
            cat_title="장기 요양 & 주간 데이케어",
            title="전문 요양 시설 (Nursing Home Care - 숙련 간호 요양원 및 메디케이드 MLTSS)",
            portal_key="bergen_seniors",
            exec_summary={
                "정책 취지": "가정에서 가족이나 홈케어만으로는 돌보기 어려운 중증 와상 환자, 말기 치매, 중풍 환자에게 24시간 의사 감독, 공인 간호사(RN/LPN) 및 간호조무사의 전문적인 집중 의료 돌봄을 제공하는 입원 요양 시설입니다.",
                "월 입원비 수준": "사비(Private Pay)로 지불할 경우 월 <span class='rc-chart-cell-highlight'>$12,000 ~ $15,000 (연간 15만 달러 이상)</span>에 달하는 막대한 비용 소요.",
                "메디케이드 MLTSS 전액 지원": "뉴저지 메디케이드 MLTSS 자격을 취득하면 환자의 개인 소득(소셜 연금 등) 중 용돈($50)을 제외한 잔여액만 시설에 내고, <span class='rc-chart-cell-highlight'>부족한 수천~수만 달러의 입원비 전액을 주정부가 매달 대신 납부</span>.",
                "버겐카운티 한인 요양원": "노우드(Norwood) 등지에 한국인 의사, 간호사, 한식 식단, 한국 방송이 제공되는 한인 전담 요양 병동(Korean Nursing Unit) 운영."
            },
            chart_info={
                "title": "메디케어 단기 재활 vs 메디케이드 장기 요양 너싱홈 비교",
                "badge": "보험별 입원비 보장 범위",
                "headers": ["비교 항목", "메디케어 (Medicare Part A 단기 입원)", "메디케이드 (Medicaid MLTSS 장기 요양)"],
                "rows": [
                    ["입원 목적", "병원 퇴원 후 단기 급성기 재활 (치료 목적)", "<span class='rc-chart-cell-highlight'>만성 질환 및 일상 돌봄을 위한 영구/장기 입소</span>"],
                    ["최대 보장 일수", "<span class='rc-chart-badge rc-chart-badge-amber'>최대 100일까지 (1~20일 100%, 21~100일 코페이)</span>", "<span class='rc-chart-badge rc-chart-badge-green'>기간 제한 없이 평생 무제한 입원 보장</span>"],
                    ["자산 및 소득 심사", "심사 전혀 없음", "<span class='rc-chart-cell-highlight'>개인 자산 $2,000 이하 및 5년 자산조사</span>"],
                    ["100일 초과 시 비용", "메디케어 보장 완전 종료 (전액 사비 부담)", "메디케이드가 평생 전액 보조"]
                ],
                "footnote": "환자의 소셜 연금은 입원비로 귀속되지만, 집에 남은 배우자가 있을 경우 배우자 생계 보호 규정(MMMNA)으로 소득을 지킬 수 있습니다."
            },
            sections=[
                {
                    "heading": "너싱홈 선택 시 CMS 별점(Star Rating) 확인법",
                    "content": """
<p>연방 정부(CMS)는 미국 내 모든 공인 너싱홈에 대해 (1) 보건 위생 검사(Health Inspection), (2) 간호사 인력 배치 비율(Staffing), (3) 임상 의료 품질 지표(Quality Measures)를 종합하여 1성~5성급 별점을 매겨 공개합니다. 최소 4성급 이상의 시설을 선택하는 것이 안전합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "병원 퇴원 기록 및 의무 기록 일체", "desc": "진단서, 검사 결과, 의사 간호 지시서."},
                {"doc": "MLTSS 승인 서한", "desc": "주정부 장기요양 메디케이드 승인 통지서."},
                {"doc": "사전 의료 지시서 (POLST / Living Will)", "desc": "응급 상황 시 연명 치료 범위 지정 서류."}
            ],
            tips=[
                {"title": "입원 전 메디케이드 베드 전환 조항(Medicaid Conversion) 확인", "desc": "사비(Private Pay)로 먼저 입원할 경우 몇 개월 후 메디케이드로 전환을 보장해 주는지 계약서 특약 조항을 반드시 확인하십시오."},
                {"title": "장기요양 옴부즈맨(Ombudsman) 번호 숙지", "desc": "입원 중 낙상, 방임, 부당한 대우가 발생하면 주정부 공인 옴부즈맨에게 즉각 조사를 의뢰할 수 있습니다."}
            ],
            contacts=[
                {"name": "Medicare.gov 공식 요양원 비교 (Nursing Home Compare)", "val": "medicare.gov/care-compare"},
                {"name": "NJ Long-Term Care Ombudsman", "val": "1-877-582-6995"}
            ]
        )
    })

    # art-37: Hospice Care
    articles.append({
        "id": "art-37",
        "slug": "long-term-care-program-hospice-care-ko",
        "category_id": "long-term-care",
        "category_name": "장기 요양 & 주간 데이케어",
        "title": "호스피스 케어(Hospice Care)",
        "excerpt": "여명 6개월 미만 시한부 환자와 가족을 위한 존엄한 완화의료 호스피스. 메디케어 100% 전액 무료 지원, 통증 조절 및 영적 케어.",
        "content_html": render_article_html(
            cat_title="장기 요양 & 주간 데이케어",
            title="호스피스 완화의료 (Hospice & Palliative Care - 존엄한 삶의 마무리)",
            portal_key="medicare_gov",
            exec_summary={
                "정책 취지": "말기 질환으로 더 이상의 연명 치료가 무의미한 환자에게 고통스러운 항암치료 대신 통증을 적극적으로 조절하고, 환자와 가족이 심리적·영적 평안 속에서 마지막 시간을 함께 보낼 수 있도록 돕는 전인적 완화의료입니다.",
                "수혜 요건": "주치의와 호스피스 전문의 2인으로부터 여명(Expected Life Span)이 6개월 미만으로 예측된다는 진단을 받은 자.",
                "메디케어 파트 A 100% 무료": "디덕터블 $0, 방문 간호 $0, <span class='rc-chart-cell-highlight'>통증 완화 처방약 100% 무료, 전동 침대·산소발생기·휠체어 등 모든 의료기기 무상 대여</span>.",
                "제공 장소": "자택(In-Home Hospice), 너싱홈 입원실, 또는 전용 독립 호스피스 완화의료 병동."
            },
            chart_info={
                "title": "메디케어 호스피스 혜택(Medicare Hospice Benefit) 전액 지원 내역",
                "badge": "100% 전액 지원 ($0)",
                "headers": ["지원 영역", "세부 제공 서비스 내용", "환자 본인 부담금"],
                "rows": [
                    ["전문 의료진 방문", "호스피스 전문의 진료 및 24시간 간호사 응급 온콜(On-Call)", "<span class='rc-chart-cell-highlight'>$0 (무료)</span>"],
                    ["약물 치료", "통증 완화 진통제, 호흡곤란 완화제, 메스꺼움 억제제 일체", "<span class='rc-chart-cell-highlight'>약값 100% 무료</span> (최대 $5 코페이 또는 면제)"],
                    ["가정 의료 장비", "병원용 전동 침대, 에어 매트리스, 산소탱크, 기저귀, 소독 위생용품", "<span class='rc-chart-badge rc-chart-badge-green'>자택까지 전액 무료 배송 및 설치</span>"],
                    ["가족 사별 케어", "환자 임종 후 13개월 동안 유가족 전문 슬픔 치유(Bereavement) 상담", "<span class='rc-chart-cell-highlight'>유가족 전액 무료</span>"]
                ],
                "footnote": "호스피스를 시작했다고 해서 치료를 절대 포기해야 하는 것은 아니며, 병세가 호전되거나 마음이 바뀌면 언제든지 취소하고 일반 치료로 복귀할 수 있습니다."
            },
            sections=[
                {
                    "heading": "호스피스에 대한 흔한 오해 바로잡기",
                    "content": """
<p>호스피스는 '죽음을 기다리는 곳'이 아닙니다. 극심한 통증과 숨가쁨을 조절해 줌으로써 환자가 맑은 정신으로 사랑하는 가족들과 대화하고 소중한 추억을 정리할 수 있도록 <strong>남은 생의 삶의 질(Quality of Life)을 극대화</strong>하는 전문 의료 서비스입니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "의사 진단서 및 소견서", "desc": "여명 6개월 예측 전문의 진술서."},
                {"doc": "호스피스 혜택 동의서", "desc": "완화 치료(Comfort Care) 중심 치료 동의서."},
                {"doc": "메디케어 카드", "desc": "Medicare Part A 등록 카드."}
            ],
            tips=[
                {"title": "한국어 가능한 호스피스 팀 요청", "desc": "홀리네임 병원 호스피스(Holy Name Medical Center Hospice) 등 지역 병원에는 한국어 통역과 정서적 지지가 가능한 의료진이 상주합니다."}
            ],
            contacts=[
                {"name": "National Hospice and Palliative Care (NHPCO)", "val": "1-800-658-8898"},
                {"name": "홀리네임 병원 호스피스 센터", "val": "201-833-3000"}
            ]
        )
    })

    # art-38: Long Term Care Ombudsman
    articles.append({
        "id": "art-38",
        "slug": "long-term-care-program-long-term-care-ombudsman-ko",
        "category_id": "long-term-care",
        "category_name": "장기 요양 & 주간 데이케어",
        "title": "롱텀케어 옴부즈맨 (Long Term Care Ombudsman)",
        "excerpt": "너싱홈, 어시스티드 리빙 거주 시니어의 권익 옹호, 부당 퇴소 및 학대 방지를 위한 뉴저지 주정부 독립 조사 기구.",
        "content_html": render_article_html(
            cat_title="장기 요양 & 주간 데이케어",
            title="장기 요양 권익 옴부즈맨 (Office of the Long-Term Care Ombudsman - LTCO)",
            portal_key="bergen_seniors",
            exec_summary={
                "정책 취지": "요양원(너싱홈), 어시스티드 리빙, 주거 요양 시설(RHCF)에 입원 중인 60세 이상 시니어의 권리를 옹호하고, 시설 측의 부당한 대우, 방임, 부당 퇴소, 재정적 착취를 독립적으로 조사하여 시정하는 주정부 공식 대변인 제도입니다.",
                "독립성과 비밀 보장": "시설 운영자나 보건국으로부터 완전히 독립된 기관으로서, 모든 신고와 조사는 신고자의 신원을 철저히 비밀(Confidential)로 보호합니다.",
                "무료 법률/행정 지원": "환자나 가족에게 일체의 비용을 청구하지 않는 100% 무료 공공 권익 서비스.",
                "핵심 개입 분야": "부당 강제 퇴소(Involuntary Discharge) 명령 취소, 낙상 사고 은폐 조사, 의사 처방약 오투약 시정."
            },
            chart_info={
                "title": "뉴저지 롱텀케어 옴부즈맨(LTCO) 주요 조사 및 개입 영역",
                "badge": "환자 권익 100% 보호",
                "headers": ["분쟁 유형", "시설 측의 흔한 위법 행위", "옴부즈맨의 법적 개입 및 해결책"],
                "rows": [
                    ["부당 강제 퇴소", "치매 행동 장애나 간병 부담을 이유로 일방적 30일 퇴소 통보", "<span class='rc-chart-cell-highlight'>퇴소 즉각 효력 정지 및 행정 청문회(Hearing) 변호</span>"],
                    ["의료 및 간호 방임", "호출 벨 무응답, 기저귀 미교체로 인한 욕창 악화", "<span class='rc-chart-badge rc-chart-badge-green'>불시 현장 조사 실시 및 간호 인력 강제 시정</span>"],
                    ["재정적 착취/도난", "환자의 개인 용돈(PNA) 횡령, 귀중품 분실", "주정부 감사 및 관할 사법당국 고발 조치"],
                    ["면회 및 사교 제한", "가족 면회를 정당한 사유 없이 거부하거나 차단", "환자의 면회 권리 법적 강제 회복"]
                ],
                "footnote": "신고가 접수되면 지역 담당 옴부즈맨 조사관이 시설을 직접 방문하여 환자와 단독 면담을 진행합니다."
            },
            sections=[
                {
                    "heading": "요양원 부당 퇴소 통보 시 대처 요령",
                    "content": """
<p>요양원 측에서 '더 이상 환자를 돌볼 수 없으니 다른 시설로 옮기라'는 편지를 보내오더라도 절대 당황하여 서명하지 마십시오. 즉시 <strong>옴부즈맨 핫라인(1-877-582-6995)</strong>에 신고하면 법적으로 적법한 퇴소 사유인지 판사가 판정할 때까지 퇴소가 강제로 동결됩니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "시설 계약서 사본", "desc": "입원 당시 체결한 입소 계약서."},
                {"doc": "부당 행위 일지(Log)", "desc": "사건 일시, 관련 간호사 이름, 구체적 피해 내용 메모."},
                {"doc": "시설 측 발송 서한", "desc": "퇴소 통보서나 경고장 사본."}
            ],
            tips=[
                {"title": "익명 신고 가능", "desc": "시설 측의 보복이 두려운 경우 완벽히 익명으로 조사를 요청할 수 있습니다."}
            ],
            contacts=[
                {"name": "NJ Long-Term Care Ombudsman 핫라인", "val": "1-877-582-6995 (수신자 부담)"},
                {"name": "공식 웹사이트", "val": "nj.gov/ltco"}
            ]
        )
    })

    # art-65: Long Term Care Overview
    articles.append({
        "id": "art-65",
        "slug": "long-term-care-program-ltc-overview-ko",
        "category_id": "long-term-care",
        "category_name": "장기 요양 & 주간 데이케어",
        "title": "롱텀케어 (Long Term Care) 개요",
        "excerpt": "재택 돌봄부터 주간 보호 데이케어, 어시스티드 리빙, 전문 요양원(너싱홈)까지 이어지는 뉴저지 장기 요양 연속체(Continuum) 총정리.",
        "content_html": render_article_html(
            cat_title="장기 요양 & 주간 데이케어",
            title="뉴저지 장기 요양 마스터 플랜 (Long-Term Care Master Overview)",
            portal_key="bergen_seniors",
            exec_summary={
                "정책 취지": "노화, 만성 질환, 장애로 인해 독립적인 식사, 목욕, 배변, 이동이 불가능해졌을 때 필요한 의료적·비의료적 돌봄 서비스를 체계적으로 설계하고 지원하는 평생 안전망입니다.",
                "장기 요양의 4단계 스펙트럼": "1단계: 재택 홈케어(Home Care / PPP), 2단계: 어덜트 데이케어(Adult Day Care), 3단계: 어시스티드 리빙(Assisted Living), 4단계: 숙련 간호 요양원(Nursing Home).",
                "재정 대책의 중요성": "일반 메디케어는 장기 간병을 커버하지 않으므로, 주정부 메디케이드 MLTSS 승인을 받거나 사전 장기요양보험(LTCi)을 준비해야 가계 파산을 막을 수 있습니다.",
                "원스톱 상담 창구": "버겐카운티 ADRC(노인 및 장애인 원스톱 리소스 센터)를 통한 통합 평가."
            },
            chart_info={
                "title": "뉴저지 장기 요양 4단계 시설 및 재정 지원 연속체",
                "badge": "4단계 케어 스펙트럼",
                "headers": ["단계 및 돌봄 형태", "주요 케어 내용", "월 평균 사비 비용", "정부 지원 프로그램"],
                "rows": [
                    ["1단계: 재택 간병 (In-Home)", "가정 방문 일상생활 간병 (주 15~40시간)", "월 $2,500 ~ $4,500", "<span class='rc-chart-badge rc-chart-badge-blue'>PPP (가족간병 급여) / JACC</span>"],
                    ["2단계: 주간 데이케어 (Adult Day)", "주 1~5회 센터 통원, 식사, 물리치료", "월 $1,500 ~ $2,500", "<span class='rc-chart-badge rc-chart-badge-green'>메디케이드 MLTSS 100% 무료</span>"],
                    ["3단계: 어시스티드 리빙 (AL)", "독립 아파트 + 24시간 생활보조", "월 $5,500 ~ $8,500", "MLTSS 부분 지원 (사비 후 전환)"],
                    ["<span class='rc-chart-cell-highlight'>4단계: 널싱홈 요양원 (SNF)</span>", "24시간 의사/간호사 숙련 간호 입원", "<span class='rc-chart-cell-highlight'>월 $12,000 ~ $15,000</span>", "<span class='rc-chart-badge rc-chart-badge-green'>MLTSS 승인 시 전액 대납</span>"]
                ],
                "footnote": "조기에 전문가와 상담하여 가족 간병인(PPP)부터 차근차근 단계를 밟아가는 것이 가장 비용 효율적입니다."
            },
            sections=[
                {
                    "heading": "장기 요양 등급 판정(Nursing Facility Level of Care)",
                    "content": """
<p>주정부 간호사가 가정을 방문하여 진행하는 임상 평가에서 (1) 목욕, (2) 옷 입기, (3) 화장실 이용, (4) 이동 및 보행, (5) 식사, (6) 배변 조절 중 최소 3개 이상에서 상시 타인의 신체적 보조가 필요하다고 판정받아야 MLTSS가 최종 승인됩니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "주치의 의무 기록 요약본", "desc": "과거 1년간의 병력 및 처방약 목록."},
                {"doc": "재정 서류 팩", "desc": "소득 증명 및 최근 5년간의 자산 거래 내역서."},
                {"doc": "ADL 평가 준비 메모", "desc": "환자가 겪는 일상적인 신체적 어려움 기술서."}
            ],
            tips=[
                {"title": "너싱홈 가기 전 재택 서비스(MLTSS In-Home) 먼저 소진", "desc": "주정부 정책 역시 시설 입원보다 집에서 가족과 함께 케어받는 것을 우선 장려하므로 재택 MLTSS를 먼저 신청하십시오."}
            ],
            contacts=[
                {"name": "버겐카운티 ADRC 원스톱 센터", "val": "201-336-7400"},
                {"name": "NJ Division of Medical Assistance", "val": "1-800-356-1561"}
            ]
        )
    })

    # art-66: Rehabilitation & Skilled Nursing
    articles.append({
        "id": "art-66",
        "slug": "long-term-care-program-rehabilitation-and-skilled-nursing-ko",
        "category_id": "long-term-care",
        "category_name": "장기 요양 & 주간 데이케어",
        "title": "전문 재활 및 간호 서비스 (Rehabilitation & Skilled Nursing)",
        "excerpt": "뇌졸중, 관절 수술, 골절로 급성기 병원 퇴원 후 최대 100일까지 메디케어 파트 A로 보장받는 전문 단기 재활원(SNF) 완벽 가이드.",
        "content_html": render_article_html(
            cat_title="장기 요양 & 주간 데이케어",
            title="전문 단기 재활 및 숙련 간호 (Subacute Rehab & Skilled Nursing - 메디케어 100일 보장)",
            portal_key="medicare_gov",
            exec_summary={
                "정책 취지": "대형 병원에서 수술이나 급성기 치료를 마쳤지만 곧바로 집으로 귀가하기 힘든 환자가 집중적인 물리치료, 작업치료, 간호 처치를 받아 일상으로 복귀할 수 있도록 지원하는 단기 전문 재활 병동입니다.",
                "3일 병원 입원(3-Day Rule) 필수 요건": "메디케어 파트 A 혜택을 적용받으려면 병원 급성기 병실에 <span class='rc-chart-cell-highlight'>최소 연속 3일 이상 정식 입원(Inpatient)</span>했던 기록이 필수.",
                "메디케어 최대 100일 보장 구조": "1일부터 20일까지는 <span class='rc-chart-cell-highlight'>본인 부담금 $0 (100% 전액 무료)</span>, 21일부터 100일까지는 1일당 코페이(2026년 기준 약 $204.00) 발생.",
                "제공 치료": "주 5~6회 매일 2~3시간씩 진행되는 집중 물리치료(PT), 작업치료(OT), 언어치료(ST), 상처 소독, 정맥 주사."
            },
            chart_info={
                "title": "메디케어 파트 A 전문 재활원(SNF) 100일 보장 본인 부담금 구조",
                "badge": "메디케어 공식 규정",
                "headers": ["재활 입원 일수", "메디케어 파트 A 지원 비율", "환자 1일당 본인 부담금 (Copay)", "메디갭(보충보험) 연계 시"],
                "rows": [
                    ["<span class='rc-chart-cell-highlight'>1일 ~ 20일</span>", "<span class='rc-chart-badge rc-chart-badge-green'>100% 전액 지원</span>", "<span class='rc-chart-cell-highlight'>$0 (완전 무료)</span>", "$0"],
                    ["<span class='rc-chart-cell-highlight'>21일 ~ 100일</span>", "차액 지원", "1일당 약 $204.00 발생", "<span class='rc-chart-badge rc-chart-badge-green'>메디갭 플랜 G/N 가입 시 $0 전액 대납</span>"],
                    ["101일 이후", "0% (메디케어 보장 완전 종료)", "1일당 $450~$600 전액 사비 부담", "메디케이드 장기요양으로 전환 필요"]
                ],
                "footnote": "메디케어 어드밴티지(Part C) 가입자는 3일 병원 입원 규정이 면제되는 경우가 많으나 사전 승인(Prior Authorization)이 필요합니다."
            },
            sections=[
                {
                    "heading": "병원 퇴원 시 '관찰 입원(Observation)' 함정 주의",
                    "content": """
<p>병원 응급실을 통해 며칠간 병실에 누워있었더라도, 병원 측이 <em>'정식 입원(Inpatient)'</em>이 아닌 <em>'관찰 상태(Observation Status)'</em>로 코딩해 두면 메디케어 3일 입원 요건이 충족되지 않아 단기 재활원 비용이 메디케어로 거절될 수 있습니다. 퇴원 전 소셜워커에게 반드시 Inpatient 3박을 확인하십시오.</p>
"""
                }
            ],
            checklist=[
                {"doc": "병원 퇴원 오더", "desc": "Subacute Rehab 입소 승인 의사 오더."},
                {"doc": "보험 카드", "desc": "Medicare Part A 카드 및 보충보험(Medigap) 카드."},
                {"doc": "물리치료 처방전", "desc": "PT/OT 주당 치료 횟수 기재 처방."}
            ],
            tips=[
                {"title": "재활 목표(Goal) 진척도를 매주 점검", "desc": "환자가 치료를 거부하거나 물리치료 진척이 없다고 간호 기록에 적히면 100일 전이라도 메디케어 퇴소 명령이 떨어지므로 적극적으로 재활에 참여해야 합니다."}
            ],
            contacts=[
                {"name": "Medicare.gov 공식 재활원 비교", "val": "1-800-MEDICARE"},
                {"name": "NJ Department of Health 인가시설", "val": "nj.gov/health"}
            ]
        )
    })

    return articles

print("cat_long_term_care.py loaded successfully.")
