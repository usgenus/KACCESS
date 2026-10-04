# -*- coding: utf-8 -*-
"""
Legal Rights and Retirement Planning category articles - Part 2 (9 articles: art-58, art-73 to art-80)
"""
from .common import render_article_html

def get_legal_rights_part2_articles():
    articles = []

    # art-58: Medicare Parts A & B
    articles.append({
        "id": "art-58",
        "slug": "medicare-parts-a-and-b-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "오리지널 메디케어 파트 A & B (Original Medicare)",
        "excerpt": "연방 정부가 직접 운영하는 오리지널 메디케어 파트 A(입원)와 파트 B(외래)의 2026/2027년 최신 보험료, 본인부담금, 가입 시기 및 뉴저지 SHIP 상담 안내.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="오리지널 메디케어 파트 A & B (Original Medicare Comprehensive Guide)",
            portal_key="medicare_gov",
            exec_summary={
                "프로그램 성격": "연방 보건복지부 산하 CMS가 직접 관할하는 전통적인 수수료별 서비스(Fee-for-Service) 건강보험. 미국 전역 메디케어 지정 병·의원 자유 이용 가능.",
                "파트 A (입원 병원)": "40분기(10년) 이상 근로 세금 납부 시 월 보험료 $0(무료). 입원 치료, 전문 간호 시설(SNF), 호스피스, 가정 간호 보장.",
                "파트 B (외래 진료)": "2026년 표준 월 보험료 $185.00~$202.90(소득별 IRMAA 추가 적용 가능). 의사 진료, 외래 수술, 내구의료기기(DME), 예방 검진 보장.",
                "가입 시기 중요성": "65세 최초 가입 기간(IEP) 7개월을 놓치면 평생 월 보험료에 10% 지연 가산 벌금(Late Enrollment Penalty)이 부과되므로 적기 신청 필수."
            },
            chart_info={
                "title": "2026 오리지널 메디케어 수혜자 본인 부담금(Cost-Sharing) 요약표",
                "badge": "CMS 2026 공식 기준",
                "headers": ["보장 영역", "연간/기간별 디덕터블", "일별/항목별 본인 부담금 (Coinsurance)", "주의 사항"],
                "rows": [
                    ["파트 A (입원 치료)", "혜택 기간당 $1,736", "1~60일 $0 / 61~90일 하루 $434 / 91~150일 하루 $868", "150일 이후 전액 본인 부담"],
                    ["파트 A (전문 간호 SNF)", "별도 디덕터블 없음", "1~20일 $0 / 21~100일 하루 $217 / 101일 이후 전액 본인", "병원 3일 이상 정식 입원 선행 필수"],
                    ["파트 B (외래/의사 진료)", "연간 $257~$283 (1회)", "메디케어 승인 금액의 20% (Coinsurance)", "네트워크 제한 없음, 전액 본인 상한선 부재"],
                    ["파트 B (예방 진료)", "$0 (면제)", "$0 (무료 연례 웰니스 검진, 암 스크리닝 등)", "메디케어 승인 예방 항목에 한함"]
                ],
                "footnote": "오리지널 메디케어는 본인 부담금 상한선(MOOP)이 없으므로 메디갭(서플리먼트) 보충보험 또는 파트 C(어드밴티지) 가입을 강력 권장합니다."
            },
            sections=[
                {
                    "heading": "파트 A(입원)와 파트 B(외래)의 핵심 보장 범위",
                    "content": """
<p>오리지널 메디케어는 미국의 만 65세 이상 시니어 및 특정 중증 장애인을 위한 가장 기본적인 연방 공공의료 안전망입니다.</p>
<ul class="rc-guide-list">
  <li><b>파트 A (병원 입원 보장):</b> 급성기 병원 2인실 입원 병실, 간호 서비스, 수술 및 집중 치료실 이용, 입원 중 처방약, 식사, 그리고 병원 퇴원 후 연속되는 재활 전문 간호(SNF)를 최대 100일까지 보장합니다.</li>
  <li><b>파트 B (의사 및 외래 진료):</b> 주치의 및 전문의 외래 진료, 응급실(ER) 및 외래 당일 수술, MRI/CT/X-ray 영상 검사 및 혈액 검사, 물리 치료·작업 치료, 전동 휠체어 등 내구의료장비(DME)를 커버합니다.</li>
  <li><b>오리지널 메디케어 미보장 항목:</b> 정기 치과 검진 및 임플란트, 안경 및 시력 교정, 보청기, 그리고 요양원 장기 거주(Custodial Long-Term Care)는 보장되지 않으므로 메디케이드나 별도 보험이 필요합니다.</li>
</ul>
"""
                },
                {
                    "heading": "가입 시기 4가지 및 지연 벌금(Penalty) 방지법",
                    "content": """
<p>메디케어는 정해진 신청 기간 내에 직접 등록해야 불필요한 평생 벌금을 방지할 수 있습니다.</p>
<ul class="rc-guide-list">
  <li><b>최초 가입 기간 (IEP - Initial Enrollment Period):</b> 65세 생일이 속한 달 기준 전 3개월, 생일 당월, 후 3개월 총 7개월간. 소셜 연금을 이미 수령 중인 분은 자동 가입되며 카드(Red, White, and Blue)가 우편 발송됩니다.</li>
  <li><b>일반 가입 기간 (GEP - General Enrollment Period):</b> IEP를 놓친 경우 매년 1월 1일 ~ 3월 31일 사이에 신청 가능하며, 효력은 신청 다음 달 1일부터 발생합니다. 놓친 기간만큼 평생 파트 B 10% 할증 벌금이 부과됩니다.</li>
  <li><b>특별 가입 기간 (SEP - Special Enrollment Period):</b> 본인 또는 배우자의 현역 직장 건강보험(20인 이상 사업장)에 가입되어 있던 경우, 퇴직 또는 직장 보험 종료 후 8개월 이내에 벌금 없이 신청할 수 있습니다.</li>
  <li><b>연례 선택 기간 (AEP - Annual Enrollment Period):</b> 매년 10월 15일 ~ 12월 7일. 기존 오리지널 메디케어와 메디케어 어드밴티지(파트 C), 처방약 파트 D 간 변경이 자유로운 공식 갱신 기간입니다.</li>
</ul>
"""
                },
                {
                    "heading": "뉴저지 무료 SHIP 상담 및 신청 채널",
                    "content": """
<p>메디케어 플랜 선택이 복잡할 때는 뉴저지 주정부 공인 비영리 상담 프로그램을 활용할 수 있습니다.</p>
<ul class="rc-guide-list">
  <li><b>연방 사회보장국 온라인 신청:</b> <a href="https://www.ssa.gov/medicare/sign-up" target="_blank" rel="noopener noreferrer" class="rc-guide-link">SSA.gov/medicare &rarr;</a> 포털에서 my Social Security 계정으로 15분 만에 접수 가능.</li>
  <li><b>NJ SHIP (주정부 건강보험 정보 프로그램):</b> 보험 판매를 하지 않는 100% 중립 공인 카운슬러가 메디갭과 파트 C 비교 무료 상담 제공 (1-800-792-8820).</li>
  <li><b>버겐카운티 SHIP 직통:</b> 버겐카운티 노인복지국 내 SHIP 전담 창구(201-336-7413)를 통해 한국어 통역 상담 지원 가능.</li>
</ul>
"""
                }
            ],
            checklist=[
                {"doc": "미국 시민권 증서 또는 영주권 카드", "desc": "영주권자는 미국 내 5년 이상 연속 거주 증빙."},
                {"doc": "사회보장번호(SSN) 및 근로 기록", "desc": "본인 또는 배우자의 40분기 근로 크레딧 내역."},
                {"doc": "현재 직장 건강보험 가입 증명서(CMS-L564)", "desc": "65세 이후 직장보험 유지 후 특별가입(SEP) 시 필수."}
            ],
            tips=[
                {"title": "파트 B 10% 평생 벌금 주의", "desc": "가입 자격 발생 후 12개월 지연될 때마다 파트 B 표준 월 보험료에 10%가 평생 가산됩니다."},
                {"title": "오리지널 메디케어의 한계 보완", "desc": "병원 입원 디덕터블($1,736)과 외래 20% 코인슈어런스를 막기 위해 메디갭 Plan G 가입 또는 파트 C 전환을 검토하세요."}
            ],
            contacts=[
                {"name": "연방 사회보장국 (SSA 메디케어 신청)", "val": "1-800-772-1213"},
                {"name": "NJ SHIP (주정부 메디케어 무료 상담)", "val": "1-800-792-8820"},
                {"name": "버겐카운티 노인복지국 SHIP 창구", "val": "201-336-7413"}
            ]
        )
    })

    # art-73: Legal Services for Seniors
    articles.append({
        "id": "art-73",
        "slug": "senior-protection-legal-services-for-seniors-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "시니어 무료 법률 지원 (Legal Services for Seniors)",
        "excerpt": "뉴저지 저소득 시니어를 위한 LSNJ 및 카운티 공익 법률 기구의 부당 퇴거 방지, 메디케이드 자격 분쟁, 위임장 작성 및 권익 대변 서비스 종합 안내.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="뉴저지 시니어 공익 법률 지원 (Legal Services of New Jersey Guide)",
            portal_key="nj_courts",
            exec_summary={
                "지원 목적": "소득이나 자산이 부족하여 개인 변호사를 선임하기 어려운 60세 이상 시니어에게 민사 법률 자문, 서류 작성, 법정 무료 변론을 제공하여 권익을 보호합니다.",
                "무료 자격 기준": "일반적으로 연방 빈곤선 200%~250% 이하 가구 또는 긴급 권익 침해(주거 퇴거, 가정 폭력, 재산 착취) 위기에 처한 노인.",
                "핵심 취급 분야": "임대차 계약 및 강제 퇴거 소송 방어, 메디케이드/SSI 거절 이의 신청(Fair Hearing), 법적 위임장(POA) 공증 지원, 소비자 금융 사기 피해 구제.",
                "신청 및 핫라인": "Legal Services of New Jersey (LSNJ) 전용 무료 핫라인 및 북부 뉴저지 LSNJ 지부를 통해 즉시 상담 접수 가능."
            },
            chart_info={
                "title": "뉴저지 시니어 대표 공익 법률 기관 및 관할 안내",
                "badge": "무료/저비용 공익 법률",
                "headers": ["기관 명칭", "관할 지역", "주요 법률 지원 분야", "대표 연락처"],
                "rows": [
                    ["LSNJ Law Hotline", "뉴저지 주 전역 (통합)", "저소득층 민사 법률 전반 상담, 정부 복지 거절 항소", "1-888-576-5529"],
                    ["NNJLS (북부 뉴저지 법률서비스)", "버겐, 허드슨, 퍼새익 카운티", "시니어 주거권 보호, 부당 퇴거 방어, 위임장/유언장", "201-487-2166"],
                    ["Community Health Law Project (CHLP)", "뉴저지 전역 (장애·만성질환)", "정신건강, 신체장애 시니어의 복지 권익 및 시설 분쟁", "973-275-1175"],
                    ["Volunteer Lawyers for Justice (VLJ)", "뉴저지 북부/중부", "개인 파산, 소비자 사기 구제, 참전용사 법률 지원", "973-645-1955"]
                ],
                "footnote": "형사 사건(Criminal Defense)은 공익 법률 기구 관할이 아니며 카운티 국선변호인(Public Defender) 사무실로 문의해야 합니다."
            },
            sections=[
                {
                    "heading": "시니어가 자주 겪는 4대 민사 법률 지원 분야",
                    "content": """
<p>뉴저지 공익 법률 기구는 복잡한 미국 법률 체계 속에서 취약 계층 어르신들이 부당한 불이익을 당하지 않도록 돕습니다.</p>
<ul class="rc-guide-list">
  <li><b>주거권 보호 및 부당 퇴거 방어:</b> 집주인의 부당한 렌트비 인상, 시설 유지보수 거부, 불법 잠금장치 교체 및 법원 퇴거 소송(Eviction Notice)에 대해 무료 변호사가 법정에 출석하여 세입자의 권리를 방어합니다.</li>
  <li><b>공공 복지 혜택 권익 옹호:</b> 메디케이드 승인 거절, 푸드스탬프(SNAP) 지급액 삭감, SSI 수급 정지 통보를 받았을 때 주정부 공청회(Fair Hearing)를 요청하고 서류 증빙 및 법적 변론을 무료 지원합니다.</li>
  <li><b>생애 마감 법률 문서 작성:</b> 재정 대리인 위임장(POA), 의료 대리인 지정서(Proxy Directive), 유언장(Simple Will) 작성을 지원하여 사후 가족 간 분쟁을 미연에 방지합니다.</li>
  <li><b>노인 학대 및 사기 피해 구제:</b> 가족, 간병인 또는 제3자에 의한 재정적 착취, 명의 도용, 사기 계약에 대해 법적 취소 및 접근 금지 명령(Restraining Order) 신청을 돕습니다.</li>
</ul>
"""
                },
                {
                    "heading": "법률 서비스 신청 절차 및 한국어 통역",
                    "content": """
<p>원활한 무료 법률 상담을 위해 다음 절차와 서류를 준비하시기 바랍니다.</p>
<ol class="rc-guide-list-num">
  <li><b>초기 접수(Intake):</b> LSNJ 핫라인(1-888-576-5529) 또는 웹사이트 접수처에 전화하여 사건 유형과 거주지를 밝힙니다. 한국어 통역관이 무료 연결됩니다.</li>
  <li><b>재정 자격 심사:</b> 가구 소득(월 소득 내역서, 세금 보고서), 자산 규모, 연령을 확인하여 연방 빈곤선 기준 충족 여부를 확인합니다. 단, 가정폭력이나 긴급 퇴거의 경우 소득 기준이 유예될 수 있습니다.</li>
  <li><b>변호사 사건 배정:</b> 상담원 심사 후 전문 변호사가 직접 유선 또는 대면 상담을 진행하며, 필요 시 정식 사건 수임 계약을 체결하여 무료 대리를 시작합니다.</li>
</ol>
"""
                }
            ],
            checklist=[
                {"doc": "소득 증빙 서류", "desc": "소셜 연금 수령 증명서, 최근 세금 보고서 또는 은행 거래 내역서."},
                {"doc": "법원 및 관공서 통지서", "desc": "법원 소환장(Summons), 퇴거 통지서, 메디케이드 거절 편지 원본."},
                {"doc": "임대차 계약서 또는 분쟁 서류", "desc": "집주인과의 리스 계약서, 주고받은 서면 통지문, 영수증."}
            ],
            tips=[
                {"title": "퇴거 소송장 수령 즉시 연락", "desc": "법원 소환장을 받은 후 답변서 제출 기한(보통 10~14일)이 촉박하므로 통지서를 받자마자 당일 즉시 LSNJ에 전화해야 합니다."},
                {"title": "한국어 통역 무료 권리", "desc": "전화 연결 시 'Korean Interpreter Please'라고 말하면 주정부 법률에 따라 한국어 전문 통역관이 즉시 3자 통화로 연결됩니다."}
            ],
            contacts=[
                {"name": "LSNJ Law Hotline (주 전역 무료 법률 핫라인)", "val": "1-888-576-5529"},
                {"name": "NNJLS 버겐/허드슨 카운티 사무소", "val": "201-487-2166"},
                {"name": "Community Health Law Project (장애인 권익)", "val": "973-275-1175"}
            ]
        )
    })

    # art-74: AARP
    articles.append({
        "id": "art-74",
        "slug": "retirement-planning-aarp-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "AARP 미국은퇴자협회 (AARP Benefits & Programs)",
        "excerpt": "50세 이상 성인을 위한 미국 최대 비영리 은퇴자 단체 AARP의 회원 혜택, 무료 세무 지원(Tax-Aide), 안전 운전 교육 보험료 할인 및 사기 감시망 가이드.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="AARP 미국은퇴자협회 종합 활용 가이드 (American Association of Retired Persons)",
            portal_key="medicare_gov",
            exec_summary={
                "협회 성격": "전미 3,800만 명 이상의 회원을 보유한 최대 규모의 비영리·비당파 은퇴자 권익 옹호 단체. 만 50세 이상이면 누구나(실제 가입은 18세 이상 가능) 가입 가능.",
                "연회비 수준": "연 $16~$20 선으로 저렴하며, 배우자는 무료로 동반 등록 혜택을 누릴 수 있습니다.",
                "대표 무료 서비스": "AARP 재단 Tax-Aide(저소득 시니어 전액 무료 세금 보고 대행), Fraud Watch Network(무료 금융사기 피해 예방 및 신고 상담).",
                "생활비 절감 혜택": "유나이티드헬스케어 메디갭 보험 연계, 자동차/주택 보험 할인, 호텔·항공·렌터카 10~15% 할인, 레스토랑 할인."
            },
            chart_info={
                "title": "AARP 시니어 핵심 멤버십 혜택 및 절감 프로그램",
                "badge": "AARP 공식 혜택",
                "headers": ["분야", "세부 프로그램 명칭", "회원 혜택 및 할인 내용", "비회원 이용 가능 여부"],
                "rows": [
                    ["세무 지원", "AARP Foundation Tax-Aide", "IRS 공인 자원봉사자의 무료 연방/주 소득세 신고 대행", "비회원도 100% 무료"],
                    ["자동차 보험", "AARP Smart Driver™ 안전교육", "온라인/대면 수강 시 뉴저지 자동차 보험료 5~10% 의무 할인", "수강료 회원 $20 / 비회원 $25"],
                    ["사기 예방", "Fraud Watch Network", "시니어 대상 보이스피싱, 로맨스스캠 전용 핫라인 및 교육", "누구나 무료 이용 (877-908-3360)"],
                    ["건강 보험", "AARP Medicare Plans", "UnitedHealthcare 협약 메디갭(보충보험), 파트 D 플랜 가입", "AARP 유효 회원 전용"],
                    ["여가·외식", "AARP Travel & Dining", "전미 주요 호텔 10%, Dennys 등 레스토랑 10~15% 즉시 할인", "회원증 제시 시 적용"]
                ],
                "footnote": "뉴저지주는 55세 이상 운전자가 방어운전 코스를 이수하면 3년간 자동차 보험료를 의무 할인하도록 법률령으로 규정하고 있습니다."
            },
            sections=[
                {
                    "heading": "뉴저지 한인 시니어를 위한 실속 활용법",
                    "content": """
<p>AARP는 단순한 친목 단체를 넘어 노후 재정 절약과 권익 보호의 강력한 도구입니다.</p>
<ul class="rc-guide-list">
  <li><b>무료 세금 보고 (Tax-Aide):</b> 매년 2월 초부터 4월 15일까지 버겐카운티 내 도서관, 커뮤니티 센터 등에서 IRS 공인 상담가가 노인 및 중저소득층의 세금 보고를 무료로 대행해 주며, Senior Freeze 및 ANCHOR 신청도 함께 검토해 줍니다.</li>
  <li><b>자동차 보험료 의무 할인:</b> 3년에 한 번 AARP 안전 운전 코스(Smart Driver)를 6시간 이수하면 뉴저지주 승인 수료증이 발급되어, 가입 중인 자동차 보험사(가이코, 스테이트팜, 올스테이트 등)에서 보험료를 최대 10% 감면받을 수 있습니다.</li>
  <li><b>AARP 지부 활동 (NJ State Office):</b> 뉴저지 뉴브런즈윅에 위치한 AARP 뉴저지 지부는 주 의회를 상대로 유틸리티 요금 인상 저지, 처방약 가격 인하, 시니어 재산세 감면(Stay NJ) 추진 등 강력한 입법 로비 활동을 펼치고 있습니다.</li>
</ul>
"""
                },
                {
                    "heading": "회원 가입 및 문의",
                    "content": """
<p>온라인 또는 전화로 5분 안에 가입하고 즉시 디지털 회원 카드를 발급받을 수 있습니다.</p>
<ul class="rc-guide-list">
  <li><b>공식 웹사이트:</b> <a href="https://www.aarp.org" target="_blank" rel="noopener noreferrer" class="rc-guide-link">AARP.org &rarr;</a> 포털 접속 후 온라인 멤버십 가입.</li>
  <li><b>고객 서비스 전용 전화:</b> 1-888-687-2277 (한국어 통역 요청 가능).</li>
  <li><b>AARP 사기 감시 핫라인:</b> 1-877-908-3360 (의심스러운 금융 사기나 메디케어 번호 도용 시 즉시 신고).</li>
</ul>
"""
                }
            ],
            checklist=[
                {"doc": "운전면허증 또는 주 ID", "desc": "생년월일 및 뉴저지 주소지 확인."},
                {"doc": "신용카드 또는 데빗카드", "desc": "연간 멤버십 회비 결제 (약 $16~$20)."},
                {"doc": "배우자 기본 인적사항", "desc": "무료 보조 회원(Secondary Member) 등록을 위한 성명 및 생년월일."}
            ],
            tips=[
                {"title": "배우자 무료 회원 혜택", "desc": "한 사람이 가입하면 거주지가 같은 배우자나 파트너에게 무료로 보조 회원 카드가 발급되어 동일한 할인 혜택을 누릴 수 있습니다."},
                {"title": "디지털 카드 모바일 앱", "desc": "AARP Now 모바일 앱을 설치하면 호텔 체크인이나 식당에서 스마트폰 바코드로 즉시 할인을 적용받을 수 있습니다."}
            ],
            contacts=[
                {"name": "AARP 전국 고객센터", "val": "1-888-687-2277"},
                {"name": "AARP 사기 감시망 (Fraud Watch Network)", "val": "1-877-908-3360"},
                {"name": "AARP 뉴저지 주 사무소 (New Brunswick)", "val": "1-866-542-8165"}
            ]
        )
    })

    # art-75: Age-Friendly Communities
    articles.append({
        "id": "art-75",
        "slug": "retirement-planning-age-friendly-communities-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "고령 친화 커뮤니티 (Age-Friendly Communities)",
        "excerpt": "세계보건기구(WHO)와 AARP가 인증한 버겐카운티 고령 친화 도시 네트워크와 주거, 교통, 건강, 사회 참여를 아우르는 8대 영역 시니어 복지 인프라.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="고령 친화 커뮤니티 네트워크 (WHO & AARP Age-Friendly NJ)",
            portal_key="nj_dhs_doas",
            exec_summary={
                "프로그램 정의": "어르신들이 평생 살아온 정든 집과 동네에서 이사 가지 않고 안전하고 존엄하게 노후를 보낼 수 있도록(Aging in Place) 도시 환경과 제도를 재설계하는 국제적 표준 프로젝트.",
                "버겐카운티 공식 인증": "버겐카운티는 2022년 AARP 및 WHO로부터 공식 '고령 친화 카운티(Age-Friendly County)'로 공식 지정되어 주 전역의 롤모델로 활동 중.",
                "핵심 8대 영역": "야외 공간 및 공공건물, 교통 이동권, 주거 안정, 사회 참여, 존중과 포용, 시민 참여와 고용, 정보 소통, 지역사회 보건의료 서비스.",
                "한인 밀집 타운 혜택": "포트리, 팰팍, 잉글우드, 티넥 등 주요 타운마다 시니어 전용 셔틀, 보행로 턱 낮추기, 신호등 시간 연장, 한국어 복지 상담 지원."
            },
            chart_info={
                "title": "버겐카운티 고령 친화 주요 한인 비영리 협력 기관 현황",
                "badge": "버겐카운티 협력 네트워크",
                "headers": ["기관 명칭", "소재지", "대표 노인 복지 프로그램", "문의 전화"],
                "rows": [
                    ["NJ Access Portal (NJAP)", "버겐카운티 전역", "시니어 건강정보 센터, 메디케어·메디케이드 한국어 상담 핫라인", "201-336-7400"],
                    ["뉴저지 한인 상록회 (KASCA NJ)", "레오니아 (Leonia)", "노인 무료 이미용 봉사, 교양 강좌, 사회복지 수속 대행", "201-945-2400"],
                    ["KCS 뉴저지 커뮤니티 센터", "테너플라이 (Tenafly)", "시니어 주간 데이케어, 무료 점심, 공중보건 예방접종", "201-541-1200"],
                    ["뉴저지 민권센터 (MinKwon)", "팰리세이즈 파크", "저소득 시니어 SNAP/LIHEAP 복지 신청, 이민 법률 지원", "201-546-4657"],
                    ["패밀리터치 (Family Touch)", "리틀페리 (Little Ferry)", "시니어 우울증 및 심리 상담, 치매 가족 서포트 그룹", "201-242-4422"]
                ],
                "footnote": "버겐카운티 노인복지국은 타운별 시니어 센터와 민간 한인 단체를 유기적으로 연결하여 맞춤형 자원을 배분합니다."
            },
            sections=[
                {
                    "heading": "고령 친화 도시가 바꾸는 어르신의 일상",
                    "content": """
<p>고령 친화 커뮤니티 프로젝트는 노인의 자립과 삶의 질 향상을 위해 다각도로 추진됩니다.</p>
<ul class="rc-guide-list">
  <li><b>물리적 보행 안전 개선:</b> 인도 턱 낮추기(Curb Cuts), 시니어 주요 이동 경로의 횡단보도 보행 신호등 시간 15~20% 연장, 공원 및 버스 정류장 벤치 확충.</li>
  <li><b>도어 투 도어(Door-to-Door) 교통 확충:</b> 자가운전을 중단한 시니어가 장보기와 병원 방문에 소외되지 않도록 카운티 및 타운 차원의 시니어 전용 무료 셔틀 확대.</li>
  <li><b>주거 안정 및 개조 지원:</b> 낙상 사고를 방지하기 위한 화장실 손잡이(Grab Bar) 설치 및 휠체어 램프 설치 보조금 지원, 시니어 재산세 동결(Freeze) 제도 확대.</li>
  <li><b>디지털 문해력 교육:</b> 스마트폰으로 버스 노선 조회, 병원 포털 예약, 사기 문자 판별법을 배우는 무료 디지털 클래스 운영.</li>
</ul>
"""
                },
                {
                    "heading": "참여 및 리소스 확인",
                    "content": """
<p>카운티 및 주정부 포털을 통해 최신 고령 친화 프로그램 일정을 확인할 수 있습니다.</p>
<ul class="rc-guide-list">
  <li><b>버겐카운티 노인복지국 포털:</b> <a href="https://www.co.bergen.nj.us/division-of-senior-services" target="_blank" rel="noopener noreferrer" class="rc-guide-link">co.bergen.nj.us/division-of-senior-services &rarr;</a></li>
  <li><b>Age-Friendly NJ 연합:</b> <a href="https://agefriendlynj.org/" target="_blank" rel="noopener noreferrer" class="rc-guide-link">AgeFriendlyNJ.org &rarr;</a> (뉴저지 전역 고령 친화 도시 소식지).</li>
  <li><b>통합 복지 안내 전화:</b> 뉴저지 어디서나 국번 없이 <b>2-1-1</b> 또는 버겐카운티 노인복지국 직통 <b>201-336-7400</b>.</li>
</ul>
"""
                }
            ],
            checklist=[
                {"doc": "거주지 타운 시니어 센터 등록증", "desc": "타운홀 또는 시니어 센터에서 신분증 제시 후 무료 등록."},
                {"doc": "버겐카운티 시니어 서비스 가이드북", "desc": "카운티 노인복지국에서 발간하는 Key Services Guide 한국어판 열람."},
                {"doc": "긴급 연락망 카드", "desc": "독거 시니어를 위한 버겐카운티 안부 확인(Wellness Check) 등록."}
            ],
            tips=[
                {"title": "타운별 타운홀 미팅 참여", "desc": "어르신들이 겪는 보행 위험이나 대중교통 불편 사항은 타운홀 공청회에서 직접 건의할 때 가장 신속하게 예산이 반영됩니다."},
                {"title": "독거 어르신 안부 확인 서비스", "desc": "버겐카운티 셰리프국과 노인복지국이 운영하는 일일 자동 안부 전화(RUOK) 프로그램을 무료로 신청해 두시면 응급 사고를 예방할 수 있습니다."}
            ],
            contacts=[
                {"name": "버겐카운티 노인복지국 (Division of Senior Services)", "val": "201-336-7400"},
                {"name": "Age-Friendly NJ 본부", "val": "agefriendlynj.org"},
                {"name": "뉴저지 핫라인 2-1-1", "val": "2-1-1"}
            ]
        )
    })

    # art-76: Leisure and Recreation
    articles.append({
        "id": "art-76",
        "slug": "retirement-planning-leisure-and-recreation-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "시니어 여가 및 평생교육 (Leisure & Lifelong Learning)",
        "excerpt": "버겐카운티 직영 시니어 센터의 무료 영양 점심(Congregate Meals), 실버스니커즈 운동 강좌, ESL 및 예술 평생 교육, 주립공원 무료 시니어 패스 안내.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="뉴저지 시니어 여가·문화 및 평생교육 가이드 (Recreation & Wellness)",
            portal_key="bergen_seniors",
            exec_summary={
                "활동 목적": "규칙적인 신체 운동, 두뇌 자극 취미 활동, 그리고 활발한 사회적 교류를 통해 노년기 고립감과 우울증을 예방하고 인지 기능을 유지합니다.",
                "버겐카운티 직영 센터": "카운티 전역 10곳 이상의 직영 시니어 액티비티 센터에서 매일 무료/저렴한 다양한 레크리에이션 프로그램 제공.",
                "대표 프로그램": "영양 점심 식사(권장 기부금 $1.25~$2.50 수준), 실버스니커즈 의자 요가·라인댄스, 스마트폰 활용법, 수채화 및 서예.",
                "뉴저지 특별 혜택": "62세 이상 뉴저지 주민을 위한 주립공원 무료 입장 시니어 패스(Senior Park Pass) 평생 무료 발급."
            },
            chart_info={
                "title": "버겐카운티 주요 공공 시니어 액티비티 센터 목록",
                "badge": "버겐카운티 직영 센터",
                "headers": ["센터 명칭", "소재지 주소", "주요 운영 프로그램", "문의 전화"],
                "rows": [
                    ["Bergenfield Senior Center", "293 Murray Hill Ter, Bergenfield", "영양 점심, 라인댄스, 체스·바둑 동호회, 빙고", "201-387-7212"],
                    ["Elmwood Park Senior Center", "387 Market St, Elmwood Park", "실버 피트니스, 수채화 교실, 건강 스크리닝", "201-796-3342"],
                    ["Garfield Senior Center", "480 Vreeland Ave, Garfield", "실버 요가, ESL 기초 영어 강좌, 당뇨 영양 교실", "973-478-0502"],
                    ["Northwest Senior Center", "46-50 Center St, Midland Park", "태극권(Tai Chi), 노래 교실, 사기 예방 특강", "201-445-5690"],
                    ["Ridgefield Park Senior Center", "159 Park St, Ridgefield Park", "영양 식사 배식, 공예 및 뜨개질 교실, 탁구", "201-641-7170"]
                ],
                "footnote": "센터 프로그램에 참여하려면 사전 간단한 등록(Registration)이 필요하며, 인근 주민을 위한 셔틀버스가 연계됩니다."
            },
            sections=[
                {
                    "heading": "시니어 웰니스 3대 핵심 프로그램",
                    "content": """
<p>카운티와 타운 복지 시설을 통해 몸과 마음을 건강하게 유지하는 다양한 혜택이 제공됩니다.</p>
<ul class="rc-guide-list">
  <li><b>영양 점심 식사 (Congregate Meals):</b> 매주 월~금 정오에 임상 영양사가 설계한 저염식 균형 잡힌 따뜻한 점심을 친구들과 함께 드실 수 있습니다. 소득에 관계없이 누구나 이용 가능하며 소정의 자율 기부금만 권장됩니다.</li>
  <li><b>SilverSneakers & 피트니스:</b> 메디케어 어드밴티지나 보충보험 가입자에게 전액 무료로 제공되는 전국 피트니스 네트워크로, YMCA 및 민간 헬스장에서 시니어 맞춤형 관절 운동, 수영, 줌바 골드를 무료로 즐길 수 있습니다.</li>
  <li><b>뉴저지 주립공원 무료 패스 (Senior Pass):</b> 뉴저지 거주 62세 이상 어르신은 운전면허증 지참 후 주립공원 사무소에서 무료 시니어 패스를 발급받아, 뉴저지 내 모든 주립공원과 산림(Forest)에 차량 입장료 없이 평생 무료로 입장할 수 있습니다.</li>
</ul>
"""
                },
                {
                    "heading": "신청 및 문의",
                    "content": """
<p>거주하시는 타운의 시니어 센터에 방문하거나 전화로 등록하실 수 있습니다.</p>
<ul class="rc-guide-list">
  <li><b>버겐카운티 노인복지국 여가 프로그램 안내:</b> 201-336-7400.</li>
  <li><b>뉴저지 환경보호국(DEP) 시니어 파크 패스:</b> 1-800-843-6420 (<a href="https://dep.nj.gov/parksandforests" target="_blank" rel="noopener noreferrer" class="rc-guide-link">dep.nj.gov/parksandforests &rarr;</a>).</li>
  <li><b>실버스니커즈 무료 자격 조회:</b> <a href="https://www.silversneakers.com" target="_blank" rel="noopener noreferrer" class="rc-guide-link">SilverSneakers.com &rarr;</a> 에서 보험증 번호 입력 후 즉시 확인.</li>
</ul>
"""
                }
            ],
            checklist=[
                {"doc": "뉴저지 운전면허증 또는 주 ID", "desc": "만 60세/62세 이상 연령 및 거주지 확인."},
                {"doc": "메디케어 건강보험 카드", "desc": "실버스니커즈(SilverSneakers) 헬스장 무료 멤버십 번호 확인."},
                {"doc": "비상 연락처 및 알레르기 정보", "desc": "시니어 센터 점심 식사 등록 시 식이 제한 사항 제출."}
            ],
            tips=[
                {"title": "점심 식사 전일 예약", "desc": "신선한 식재료 준비를 위해 식사 희망일 하루 전(오전 10시까지) 센터에 전화 예약하는 것이 원칙입니다."},
                {"title": "주립공원 시니어 패스 차량 동승 혜택", "desc": "시니어 패스 소지자가 차량에 1명만 탑승해 있어도 탑승객 전원의 공원 입장료가 100% 무료 면제됩니다."}
            ],
            contacts=[
                {"name": "버겐카운티 직영 시니어 센터 총괄", "val": "201-336-7400"},
                {"name": "뉴저지 주립공원 시니어 패스 데스크", "val": "1-800-843-6420"},
                {"name": "실버스니커즈 고객센터", "val": "1-866-584-7389"}
            ]
        )
    })

    # art-77: Living Will & Advance Directives
    articles.append({
        "id": "art-77",
        "slug": "retirement-planning-living-will-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "연명의료계획서 및 사전의료의향서 (Living Will & POLST)",
        "excerpt": "의사결정 능력을 상실했을 때 존엄한 임종과 본인의 뜻을 지키기 위한 사전의료의향서(Living Will), 의료대리인 위임(Proxy), POLST 의사 처방서 가이드.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="연명의료계획서와 존엄한 생애 마무리 (Living Will, Healthcare Proxy & POLST Guide)",
            portal_key="nj_courts",
            exec_summary={
                "문서 목적": "치명적인 사고나 뇌사, 치매 말기 등으로 스스로 의사를 표현할 수 없을 때, 무의미한 생명 연장 처치를 받을지 여부를 미리 서면으로 밝혀 가족의 고통을 덜고 존엄성을 지킵니다.",
                "리빙 윌 (Living Will / Instruction Directive)": "심폐소생술(CPR), 인공호흡기 삽관(Intubation), 인공 영양/수분 공급 튜브 설치 여부에 관한 본인의 명확한 희망 사항을 기록한 문서.",
                "의료 대리인 지정 (Healthcare Proxy)": "본인이 의식을 잃었을 때 주치의와 치료 방향을 결정할 신뢰하는 가족이나 친지를 법적 대리인으로 지정하는 서류.",
                "POLST (공식 의료 명령서)": "말기 환자나 고령 시니어를 위해 의사가 직접 서명하여 구급대원(EMS)과 응급실 의료진이 현장에서 즉시 준수해야 하는 법적 구속력을 가진 녹색 양식 처방서."
            },
            chart_info={
                "title": "사전의료지시서(Advance Directive)와 POLST의 법적 차이점 비교",
                "badge": "NJ 보건부 표준 규정",
                "headers": ["비교 항목", "사전의료의향서 (Living Will)", "의료 대리인 위임 (Proxy)", "POLST (의료 처방서)"],
                "rows": [
                    ["작성 주체", "본인이 직접 작성 및 서명", "본인이 대리인 지명 서명", "환자/대리인과 상담 후 담당 의사가 서명"],
                    ["작성 대상", "18세 이상 건강한 성인 누구나", "18세 이상 성인 누구나", "말기 환자, 노쇠 어르신, 널싱홈 입소자"],
                    ["법적 효력", "의식 상실 시 참고 및 법적 근거", "의식 상실 시 대리 결정권 행사", "응급 현장 및 병원에서 즉시 구속력 발휘"],
                    ["필수 서명 요건", "성인 증인 2인 또는 공증인 서명", "성인 증인 2인 또는 공증인 서명", "면허 의사(MD/DO) 또는 전문간호사(APN) 서명"],
                    ["보관 장소", "집안 쉽게 찾는 곳, 주치의, 가족 사본", "대리인 및 주치의 보관", "냉장고 앞, 환자 침상 머리맡 비치 (녹색 종이)"]
                ],
                "footnote": "금고나 안전금고(Safe Deposit Box)에 문서를 넣으면 응급 상황 시 꺼낼 수 없으므로 절대로 금고에 보관하지 마십시오."
            },
            sections=[
                {
                    "heading": "핵심 의료 처치 선택 코드 이해하기",
                    "content": """
<p>Living Will과 POLST를 작성할 때 자주 마주치는 핵심 의료 용어입니다.</p>
<ul class="rc-guide-list">
  <li><b>풀 코드 (Full Code - 전체 소생술 시행):</b> 심장이 멈추거나 호흡이 정지했을 때 전기 제세동기 충격, 흉부 압박(CPR), 기관 삽관 등 가능한 모든 의학적 소생 처치를 시행하는 기본값입니다.</li>
  <li><b>DNR (Do Not Resuscitate - 심폐소생술 거부):</b> 심장이 멎었을 때 갈비뼈 골절이나 뇌 손상을 동반할 수 있는 인위적 흉부 압박과 제세동 처치를 하지 말도록 지시합니다. 단, 산소 공급, 통증 완화제 투여 등 편안한 간호는 전액 정상 제공됩니다.</li>
  <li><b>DNI (Do Not Intubate - 기관 삽관 거부):</b> 기도로 플라스틱 튜브를 넣어 인공호흡기에 연결하는 행위를 거부합니다. DNR과 별도로 선택할 수 있습니다.</li>
  <li><b>DNH (Do Not Hospitalize - 불필요한 입원 거부):</b> 통증 조절이 자택이나 호스피스에서 가능한 경우, 무의미한 응급실 이송이나 중환자실 입원을 피하고 정든 곳에서 임종하도록 지시합니다.</li>
</ul>
"""
                },
                {
                    "heading": "뉴저지 합법적 작성 절차 (변호사 없이도 가능)",
                    "content": """
<p>뉴저지주 법률은 특정 유료 서식을 강제하지 않으며 누구나 스스로 작성할 수 있습니다.</p>
<ol class="rc-guide-list-num">
  <li><b>의사결정 및 가족 대화:</b> 본인의 평소 종교적 신념과 가치관을 정리하고, 의료 대리인을 맡아줄 가족과 진솔하게 대화합니다.</li>
  <li><b>표준 양식 작성:</b> 뉴저지 보건부(NJ Department of Health) 표준 양식 또는 비영리 Five Wishes 양식을 다운로드하여 작성합니다.</li>
  <li><b>증인 서명 또는 공증:</b> 본인의 대리인으로 지정되지 않은 18세 이상 성인 증인 2명의 서명을 받거나, 공증인(Notary Public) 앞에서 서명합니다 (둘 중 하나만 충족하면 법적으로 완전 유효).</li>
  <li><b>사본 배포:</b> 원본은 자택 서류함에 두고, 사본을 주치의, 의료 대리인, 주요 가족에게 전달하여 전자 의무기록(EMR)에 등록하도록 요청합니다.</li>
</ol>
"""
                }
            ],
            checklist=[
                {"doc": "뉴저지 표준 Advance Directive 양식", "desc": "NJ 보건국 또는 Five Wishes 공식 서식 작성."},
                {"doc": "성인 증인 2인 또는 공증인 서명", "desc": "지정 대리인을 제외한 독립적인 성인 2인의 확인 서명."},
                {"doc": "POLST 양식 (녹색 용지)", "desc": "중증 환자의 경우 주치의와 상담 후 의사 공식 처방 서명."}
            ],
            tips=[
                {"title": "안전금고(Safe Deposit Box) 보관 금지", "desc": "주말이나 야간 응급 상황 발생 시 금고를 열 수 없어 문서가 무용지물이 됩니다. 냉장고 문 앞이나 침대 옆에 두세요."},
                {"title": "주치의 진료 기록(EMR)에 사전 등록", "desc": "작성한 Living Will 사본을 정기 검진 시 주치의에게 전달하여 병원 전산 시스템에 미리 스캔 등록해 두는 것이 가장 안전합니다."}
            ],
            contacts=[
                {"name": "뉴저지 보건부 사전의료의향서 담당과", "val": "609-292-7837"},
                {"name": "NJ POLST 공식 프로그램 사무국", "val": "www.nj.gov/health/advancedirective"},
                {"name": "Five Wishes 한국어 양식 안내", "val": "fivewishes.org"}
            ]
        )
    })

    # art-78: Medicaid Trusts
    articles.append({
        "id": "art-78",
        "slug": "retirement-planning-medicaid-trusts-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "메디케이드 자산보호신탁 (MAPT & QIT)",
        "excerpt": "월 $12,000 너싱홈 비용으로부터 가족 재산과 주택을 안전하게 지키고 메디케이드 롱텀케어를 수급하기 위한 자산보호신탁(MAPT)과 60개월 룩백 규정.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="메디케이드 자산보호신탁 및 장기요양 계획 (Medicaid Asset Protection Trust Guide)",
            portal_key="nj_courts",
            exec_summary={
                "설정 배경": "뉴저지 너싱홈 평균 입원비는 월 $12,000~$15,000에 달해 평생 모은 재산이 몇 년 만에 소진될 수 있습니다. 메디케이드 롱텀케어(MLTSS)는 엄격한 소득/자산 기준을 요구하므로 합법적 신탁 설계가 필수적입니다.",
                "MAPT (메디케이드 자산보호신탁)": "취소 불가능 신탁(Irrevocable Trust)으로 주택이나 예금을 신탁에 이전하여 5년(60개월)이 지나면 메디케이드 자산 심사에서 완전히 제외됩니다.",
                "60개월 룩백 규칙 (Look-Back Period)": "메디케이드 신청일 기준 과거 5년 동안의 모든 자산 양도·증여를 전수 조사하며, 위반 시 공여액에 비례해 수혜가 정지되는 패널티 기간이 부과됩니다.",
                "QIT (자격소득신탁 / Miller Trust)": "월 소득이 뉴저지 메디케이드 상한선($2,982)을 초과할 때 초과분을 예치하여 자격을 합법적으로 유지하는 필수 소득 신탁."
            },
            chart_info={
                "title": "메디케이드 신탁 유형별 비교 및 법적 효력 분석",
                "badge": "NJ DMAHS 규정",
                "headers": ["신탁 유형", "취소 가능 여부", "메디케이드 자산 보호 효과", "주요 활용 목적 및 특징"],
                "rows": [
                    ["MAPT (자산보호신탁)", "취소 불가능 (Irrevocable)", "5년 경과 후 100% 자산 보호", "주택 및 유동 자산 상속 보호, 주정부 사후 자산환수 방지"],
                    ["취소가능신탁 (Revocable Trust)", "언제든 취소 가능", "자산 보호 효과 0% (전액 자산 산입)", "상속 검인(Probate) 회피 전용, 메디케이드 목적 부적합"],
                    ["QIT (밀러 트러스트)", "뉴저지주 승인 특별 신탁", "소득 한도 초과자 자격 구제", "월 소득 $2,982 초과 시 초과 소득 예치 전용 계좌"],
                    ["풀드 신탁 (Pooled Trust)", "비영리 단체 수탁 관리", "자격 유지 + 개인 편의 지출", "65세 미만 장애인 또는 잉여 자산이 있는 장애 시니어 활용"]
                ],
                "footnote": "신탁 설정 및 자산 이전은 반드시 뉴저지주 엘더로(Elder Law) 전문 변호사의 조력을 받아 진행해야 합니다."
            },
            sections=[
                {
                    "heading": "5년 룩백(Look-Back) 기간과 증여 벌금 계산법",
                    "content": """
<p>메디케이드 자산 이전 시 가장 주의해야 할 연방 및 뉴저지 규정입니다.</p>
<ul class="rc-guide-list">
  <li><b>조사 대상:</b> MLTSS 롱텀케어 신청 시점으로부터 직전 60개월(5년) 동안의 모든 은행 입출금, 부동산 소유권 이전, 자녀 명의 증여를 전수 조사합니다.</li>
  <li><b>벌금 기간 산출:</b> 비공정 시장 가치로 증여한 총액을 뉴저지주 일일 너싱홈 평균 비용(약 $400/일, 월 약 $12,000)으로 나눈 개월 수만큼 메디케이드 승인이 지연됩니다.</li>
  <li><b>합법적 예외 증여:</b> 배우자 간 자산 이전, 21세 미만 또는 영구 장애 자녀에 대한 이전, 2년 이상 부모와 동거하며 간병하여 너싱홈 입소를 지연시킨 성인 자녀에게 주택을 양도하는 '간병인 자녀 주택 양도(Caregiver Child Exception)'는 벌금 없이 허용됩니다.</li>
</ul>
"""
                },
                {
                    "heading": "주정부 사후 자산 환수(Estate Recovery) 방지",
                    "content": """
<p>메디케이드는 55세 이상 수혜자가 사망한 후 그동안 지출된 롱텀케어 비용을 고인의 유산(주택 등)에서 회수할 수 있는 강력한 법적 권리를 갖습니다.</p>
<ul class="rc-guide-list">
  <li><b>생존 배우자 보호:</b> 배우자가 생존해 있거나 미성년·장애 자녀가 집에 거주하는 동안에는 주정부가 주택에 린(Lien)을 걸거나 강제 매각할 수 없습니다.</li>
  <li><b>MAPT 신탁의 효과:</b> 주택 명의를 5년 전 미리 MAPT 신탁으로 이전해 두면, 주택이 고인의 개인 검인 유산(Probate Estate)에 속하지 않으므로 사후 자산 환수로부터 자녀의 상속권을 온전히 지킬 수 있습니다.</li>
</ul>
"""
                }
            ],
            checklist=[
                {"doc": "부동산 등기부 등본(Deed)", "desc": "주택을 MAPT 신탁으로 소유권 이전하기 위한 원본 서류."},
                {"doc": "5년치 은행 거래 내역서 (60개월)", "desc": "MLTSS 자격 심사를 위한 모든 은행 및 투자 계좌 전수 내역."},
                {"doc": "QIT 은행 계좌 개설 확인서", "desc": "월 소득 초과분을 이체할 전용 Qualified Income Trust 통장."}
            ],
            tips=[
                {"title": "신탁 설정 골든타임(5년 전 미리 준비)", "desc": "너싱홈 입소가 임박해서 주택을 넘기면 룩백 벌금이 발생하므로, 건강할 때 최소 5년 전 미리 신탁을 설정해야 100% 안전합니다."},
                {"title": "자격 소득 신탁(QIT) 매월 이체 필수", "desc": "QIT 통장 개설 후 단 한 달이라도 초과 소득 이체가 누락되면 해당 월 메디케이드 자격이 즉시 취소될 수 있습니다."}
            ],
            contacts=[
                {"name": "NJ Division of Medical Assistance (DMAHS 신탁과)", "val": "1-800-356-1561"},
                {"name": "뉴저지 노인법(Elder Law) 변호사 협회", "val": "www.njelderlaw.org"},
                {"name": "버겐카운티 노인복지국 법률 리퍼럴", "val": "201-336-7400"}
            ]
        )
    })

    # art-79: Reverse Immigration to Korea
    articles.append({
        "id": "art-79",
        "slug": "retirement-planning-reverse-immigration-to-korea-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "시니어 역이민 및 영주귀국 종합 안내 (Reverse Immigration to Korea)",
        "excerpt": "만 65세 이상 복수국적 국적회복 절차, 미국 소셜 연금 한국 수령, 국민건강보험 가입, 국적 포기세(Exit Tax) 및 세무 유의점 총정리.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="미주 한인 시니어 역이민·영주귀국 완벽 가이드 (Dual Citizenship & Returning to Korea)",
            portal_key="ssa",
            exec_summary={
                "역이민 개요": "미국에서 은퇴 후 한국으로 생활 근거지를 영구 이전하는 과정으로, 국적 신분(복수국적 회복 vs 영주권 유지 vs 국적 포기)에 따라 연금, 세무, 건강보험 혜택이 완전히 달라집니다.",
                "만 65세 이상 복수국적 허용": "대한민국 국적법에 따라 만 65세 이후 영주 귀국할 목적으로 입국하는 외국국적동포는 '외국국적불행사서약'을 통해 한국 국적을 회복하고 미국 시민권을 합법적으로 동시 보유할 수 있습니다.",
                "소셜 연금 한국 수령": "미국 사회보장국(SSA) 은퇴 연금은 한국에 거주하더라도 시민권자는 제한 없이 전액 한국 외화 계좌로 직송금받을 수 있습니다.",
                "세무 보고 주의사항": "복수국적을 취득하더라도 미국 시민권을 유지하는 한 전 세계 소득에 대한 IRS 연례 세금 신고 및 한국 금융계좌 보고(FBAR/FATCA) 의무가 평생 유지됩니다."
            },
            chart_info={
                "title": "역이민 3대 신분별 핵심 장단점 및 권리 비교표",
                "badge": "한미 행정 법령 비교",
                "headers": ["구분", "상황 1: 미국 시민권 유지 + 한국 국적회복 (복수국적)", "상황 2: 미국 영주권 유지 + 한국 영주귀국", "상황 3: 미국 시민권 완전 포기"],
                "rows": [
                    ["국적/신분", "대한민국 국민 & 미국 시민 (이중국적)", "대한민국 국민 (재외국민 주민등록)", "대한민국 단독 국적 (미국 외국인)"],
                    ["미국 소셜연금", "한국 계좌로 평생 100% 정상 수령", "한국 수령 가능 (단, 6개월 체류 규정 점검)", "한국 계좌로 평생 수령 가능 (세법상 비거주자)"],
                    ["한국 건강보험", "주민등록 즉시 직장/지역 가입 가능", "영주귀국 신고 즉시 건보 가입 가능", "주민등록 즉시 완전 가입 가능"],
                    ["미국 세무 의무", "IRS 세금 신고 + FBAR/FATCA 평생 의무", "영주권 유지 시 미국 세법상 보고 지속", "Form 8854 제출 후 미국 세무 의무 완전 종결"],
                    ["주요 단점/위험", "미국 세금 신고 번거로움, 한국 내 미국 권리 불행사", "2년마다 재입국허가서(I-131) 갱신 필요, 박탈 위험", "포기세(Exit Tax) 발생 가능, 미국 자유 입국 불가(ESTA 필요)"]
                ],
                "footnote": "복수국적 취득 후 한국 출입국 시에는 반드시 한국 여권을, 미국 출입국 시에는 미국 여권을 사용해야 합니다."
            },
            sections=[
                {
                    "heading": "만 65세 이상 복수국적(국적회복) 5단계 실무 절차",
                    "content": """
<p>가장 많은 한인 시니어들이 선택하는 복수국적 취득 단계입니다.</p>
<ol class="rc-guide-list-num">
  <li><b>출국 전 미국 준비 (미국 내):</b> FBI 범죄경력증명서(Identity History Summary)를 발급받아 미 국무부 아포스티유(Apostille)를 부착합니다(유효기간 6개월). 시민권 증서, 혼인증명서 원본을 챙깁니다.</li>
  <li><b>한국 입국 및 국적상실신고:</b> 미국 여권으로 한국에 입국(무비자 90일)한 후, 과거 미국 시민권 취득 시 정리되지 않았던 기본증명서 상의 '국적상실신고'를 출입국외국인청에 먼저 접수합니다.</li>
  <li><b>거소증(F-4 재외동포) 발급:</b> 국내에 합법적으로 장기 체류하며 은행 계좌와 주거지를 마련할 수 있도록 재외동포 국내거소신고증을 발급받습니다.</li>
  <li><b>국적회복 신청 및 심사:</b> 출입국청에 국적회복 허가 신청서를 제출합니다. 법무부 심사에 통상 6~8개월이 소요되며 국적회복 승인 통지서를 우편 수령합니다.</li>
  <li><b>외국국적불행사서약 및 주민등록증 발급:</b> 허가일로부터 1년 이내에 출입국청을 방문하여 '외국국적불행사서약'을 하고, 확인서를 지참하여 거주지 동주민센터에서 주민등록증을 발급받습니다.</li>
</ol>
"""
                },
                {
                    "heading": "미국 국적 포기 시 '포기세(Exit Tax)' 위험 진단",
                    "content": """
<p>미국 세법 보고 의무를 완전히 끝내기 위해 시민권을 포기하려는 경우 다음 요건을 반드시 사전 검토해야 합니다.</p>
<ul class="rc-guide-list">
  <li><b>커버드 엑스패트리에이트(Covered Expatriate) 기준:</b> 포기 시점 전 세계 순자산이 200만 달러 이상이거나, 과거 5년간 연평균 소득세 납부액이 기준치($206,000~$211,000)를 초과하거나, 과거 5년간 미국 세금 신고 의무를 완벽히 이행하지 못한 경우 적용됩니다.</li>
  <li><b>포기세 부과 방식:</b> 보유한 모든 전 세계 자산(부동산, 주식, 연금 등)을 국적 포기 전날 모두 시장가로 매각한 것으로 간주(Deemed Sale)하여 막대한 미실현 양도소득세가 일시에 부과될 수 있습니다.</li>
  <li><b>전문가 상담 필수:</b> 포기 전 최소 1~2년 전부터 한미 전문 CPA와 자산 매각 및 증여 계획을 세워야 합니다.</li>
</ul>
"""
                }
            ],
            checklist=[
                {"doc": "FBI 범죄경력증명서 및 미 국무부 아포스티유", "desc": "미국 연방수사국 발급 후 6개월 이내 원본 서류."},
                {"doc": "미국 시민권 증서 원본 및 미국 여권", "desc": "한국 입국 시 미국 여권 필수 사용."},
                {"doc": "기본증명서 및 가족관계증명서 (상세)", "desc": "과거 국적상실 신고 및 제적부 대조용."}
            ],
            tips=[
                {"title": "한국 입국 시 반드시 미국 여권 사용", "desc": "국적회복 전 한국 여권을 사용해 입국하면 출입국관리법 위반으로 과태료가 부과될 수 있습니다."},
                {"title": "SSA 해외 수령 계좌 직송금(Direct Deposit)", "desc": "한국 거주 중에도 미국 사회보장국(SSA) 연방 혜택을 한국 내 본인 명의 외화 통장으로 수수료 없이 달러 또는 원화로 자동 수령할 수 있습니다."}
            ],
            contacts=[
                {"name": "대한민국 재외동포청 (통합민원실)", "val": "+82-2-6747-0404"},
                {"name": "법무부 출입국·외국인 종합안내센터", "val": "국번없이 1345"},
                {"name": "주뉴욕 대한민국 총영사관 (영사과)", "val": "646-674-6000"},
                {"name": "미국 사회보장국 해외 거주자과 (SSA Foreign)", "val": "1-800-772-1213"}
            ]
        )
    })

    # art-80: Senior Transportation Services
    articles.append({
        "id": "art-80",
        "slug": "retirement-planning-senior-transportation-services-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "뉴저지 시니어 교통 및 이동권 지원 (Senior Transportation)",
        "excerpt": "운전을 멈춘 시니어를 위한 버겐카운티 무료 셔틀(Community Transportation), EZ Ride 차량 보조, NJ Transit 50% 할인 및 타운별 시니어 밴 안내.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="뉴저지 시니어 공공 교통 및 이동권 서비스 종합 안내 (Transportation & Mobility Guide)",
            portal_key="bergen_seniors",
            exec_summary={
                "교통권의 중요성": "자가운전을 중단하거나 거동이 불편한 어르신들이 고립되지 않고 병원 진료, 장보기, 시니어 센터 방문을 자유롭게 지속할 수 있도록 공공·비영리 셔틀을 제공합니다.",
                "버겐카운티 직영 셔틀 (Community Transportation)": "버겐카운티 60세 이상 주민 및 장애인을 위한 무료 도어 투 도어(Door-to-Door) 휠체어 리프트 차량 서비스.",
                "EZ Ride 셔틀 & 라이드셰어": "대중교통 접근이 어려운 시니어를 위한 온디맨드(Uber/Lyft 연계) 및 비영리 카풀 라이드 지원.",
                "NJ Transit 50% 반값 할인 (Reduced Fare)": "62세 이상 시니어는 기차, 버스, 경전철 탑승 시 상시 50% 할인 요금 적용(메디케어 카드 제시로 즉시 이용 가능)."
            },
            chart_info={
                "title": "버겐카운티 시니어 4대 핵심 교통수단 비교 및 이용법",
                "badge": "버겐카운티 교통국 기준",
                "headers": ["서비스 명칭", "운영 주체 및 이용 대상", "운행 목적지 및 범위", "요금 및 예약 규정", "예약 연락처"],
                "rows": [
                    ["Bergen County Community Transportation", "버겐카운티 직영 (60세 이상 시니어/장애인)", "병원, 투석실, 물리치료, 시니어 센터, 식료품점", "전액 무료 (소정의 기부금 자율), 1~2주 전 사전 예약", "201-368-5955"],
                    ["EZ Ride (Ryde4Life)", "비영리 교통관리협회 (18세 이상 성인/시니어)", "우버/리프트 스마트폰 앱 없이 유선 전화로 배차", "할인된 실비 요금, 실시간 호출 또는 전일 예약", "201-939-4242 ext. 4"],
                    ["NJ Transit Reduced Fare", "뉴저지 주정부 대중교통 (62세 이상 누구나)", "뉴저지 전역 버스, 통근 기차, 뉴욕행 노선", "기본 요금의 50% 반값 할인, 예약 불필요(운전면허/메디케어 제시)", "973-275-5555"],
                    ["NJ Transit Access Link (ADA)", "NJ Transit 장애인 전용 파라트랜짓", "일반 버스 노선 3/4마일 이내 전 지역 픽업", "일반 버스 요금 수준, 사전 자격 승인 후 탑승", "973-491-4224"]
                ],
                "footnote": "포트리(201-592-3500 ext. 1518), 팰팍(201-585-4114) 등 각 타운홀에서도 자체 시니어 셔틀 밴을 별도 무료 운행합니다."
            },
            sections=[
                {
                    "heading": "버겐카운티 직영 셔틀(Community Transportation) 신청 요령",
                    "content": """
<p>가장 안전하고 휠체어 탑승이 완비된 카운티 직영 무료 셔틀 이용법입니다.</p>
<ul class="rc-guide-list">
  <li><b>사전 등록 절차:</b> 최초 이용 전 버겐카운티 교통과(201-368-5955)로 전화하여 기본 인적 사항, 주소, 비상 연락처, 휠체어 사용 여부를 등록합니다.</li>
  <li><b>의료 목적 우선 배차:</b> 신장 투석(Dialysis), 항암 치료, 정기 의사 진료 등 의료 목적 이동이 가장 최우선 배정되며, 그 외 주 1~2회 장보기(Supermarket) 노선이 운영됩니다.</li>
  <li><b>예약 시한:</b> 병원 진료 예약일 기준 최소 1주일~2주일 전 미리 전화하여 픽업 시간을 확정해야 합니다. 집 앞 문앞에서 목적지 건물 문앞까지 기사가 안전하게 승하차를 부축합니다.</li>
</ul>
"""
                },
                {
                    "heading": "한인 밀집 타운별 자체 시니어 셔틀 밴",
                    "content": """
<p>카운티 셔틀 외에도 거주하시는 타운 자체에서 운영하는 동네 순환 셔틀이 활발합니다.</p>
<ul class="rc-guide-list">
  <li><b>포트리 (Borough of Fort Lee):</b> 포트리 타운 거주 60세 이상 주민을 대상으로 한남체인, H마트, 커뮤니티 센터, 관내 병원을 정기 순환 운행 (문의: 201-592-3500 ext. 1518).</li>
  <li><b>팰리세이즈 파크 (Palisades Park):</b> 관내 시니어 센터 및 주요 상업 지구 이동 지원 (문의: 201-585-4114).</li>
  <li><b>티넥 (Teaneck Township):</b> 티넥 시니어 전용 밴으로 관내 상점 및 도서관, 병원 픽업 서비스 제공 (문의: 201-837-7130 ext. 7040).</li>
</ul>
"""
                }
            ],
            checklist=[
                {"doc": "버겐카운티 교통과 사전 등록 카드", "desc": "201-368-5955로 최초 1회 신상 및 주소지 유선 등록."},
                {"doc": "메디케어 카드 또는 NJ 운전면허증", "desc": "NJ Transit 버스/기차 탑승 시 50% 반값 할인 증빙."},
                {"doc": "의사 진료 예약 확인서", "desc": "투석 및 항암 치료 등 긴급 의료 픽업 우선 배정 증빙."}
            ],
            tips=[
                {"title": "최소 1~2주 전 조기 예약", "desc": "병원 예약이 잡히면 즉시 카운티 교통국(201-368-5955)에 전화해야 원하는 시간대 배차가 가능합니다."},
                {"title": "휠체어 리프트 차량 사전 요청", "desc": "전동 휠체어나 보행기(Walker) 탑승이 필요한 경우 예약 시 반드시 리프트 차량을 지정 요청하십시오."}
            ],
            contacts=[
                {"name": "버겐카운티 커뮤니티 교통국 (셔틀 예약)", "val": "201-368-5955"},
                {"name": "EZ Ride 시니어 온디맨드 셔틀", "val": "201-939-4242 ext. 4"},
                {"name": "NJ Transit 시니어 반값 할인 고객센터", "val": "973-275-5555"},
                {"name": "NJ Transit Access Link (장애인 파라트랜짓)", "val": "973-491-4224"}
            ]
        )
    })

    return articles
