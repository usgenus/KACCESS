# -*- coding: utf-8 -*-
"""
Prescription category articles (6 articles)
"""
from .common import render_article_html

def get_prescription_articles():
    articles = []

    # art-27: PAAD & Senior Gold
    articles.append({
        "id": "art-27",
        "slug": "medicare-nj-paad-and-senior-gold-ko",
        "category_id": "prescription",
        "category_name": "처방약 & 약값 지원",
        "title": "뉴저지 저소득층 약값 지원 (PAAD & Senior Gold)",
        "excerpt": "뉴저지 시니어 처방약 1종당 $5/$7로 고정해 주는 PAAD와 50% 할인 혜택의 Senior Gold 프로그램 완벽 비교 및 NJSave 신청법.",
        "content_html": render_article_html(
            cat_title="처방약 & 약값 지원",
            title="뉴저지 시니어 약값 지원 프로그램 (PAAD & Senior Gold - 약값 $5 고정)",
            portal_key="paad_seniorgold",
            exec_summary={
                "정책 취지": "고가의 혈압약, 당뇨약, 항암제 등 필수 처방약 비용 때문에 치료를 포기하지 않도록 뉴저지 주정부가 약값을 획기적으로 낮춰주는 시니어 전용 복지 제도입니다.",
                "PAAD 혜택": "적격 처방약 1종당 <span class='rc-chart-cell-highlight'>제네릭(복제약) $5, 브랜드(오리지널) $7</span>의 고정 코페이만 내고 전액 무료.",
                "Senior Gold 혜택": "소득이 PAAD 기준을 약간 초과하는 시니어에게 처방약 본인부담금의 <span class='rc-chart-cell-highlight'>50%를 주정부가 대납</span>.",
                "원스톱 통합 신청": "NJSave 단일 온라인 신청서를 통해 PAAD, 파트 B 보험료 대납(MSP), Lifeline 유틸리티 지원까지 한 번에 일괄 승인."
            },
            chart_info={
                "title": "2026/2027 뉴저지 PAAD vs Senior Gold 자격 및 혜택 비교",
                "badge": "약값 대폭 인하 혜택",
                "headers": ["비교 항목", "PAAD (약값 $5 고정)", "Senior Gold (50% 감면)"],
                "rows": [
                    ["독신(Single) 연소득", "<span class='rc-chart-cell-highlight'>$52,142 이하</span>", "$52,143 ~ $62,142 이하"],
                    ["부부(Married) 연소득", "<span class='rc-chart-cell-highlight'>$59,209 이하</span>", "$59,210 ~ $69,209 이하"],
                    ["약값 본인부담금 (Copay)", "<span class='rc-chart-badge rc-chart-badge-green'>제네릭 $5 / 브랜드 $7</span>", "코페이 $15 + 잔여액 50% 할인"],
                    ["자산 심사 (Asset Test)", "<span class='rc-chart-badge rc-chart-badge-green'>자산 심사 전혀 없음</span>", "<span class='rc-chart-badge rc-chart-badge-green'>자산 심사 전혀 없음</span>"],
                    ["메디케어 파트 D 연계", "파트 D 표준 보험료 전액 면제", "도넛홀(Gap) 기간 50% 지원"]
                ],
                "footnote": "PAAD 가입 시 연간 $225의 Lifeline 전기/가스 요금 보조금과 보청기 보조(HAAAD)가 자동 연계됩니다."
            },
            sections=[
                {
                    "heading": "메디케어 파트 D 월 보험료 및 도넛홀(Donut Hole) 면제",
                    "content": """
<p>PAAD에 가입되면 연방정부의 LIS(Extra Help) 혜택이 함께 연동되어, <strong>메디케어 파트 D 처방약 플랜의 월 보험료(Benchmark Plan 기준)가 전액 면제</strong>되고 약값 갭(도넛홀) 구간이 완전히 사라집니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "소셜 연금 증명(SSA-1099)", "desc": "전년도 사회보장국 연금 내역서."},
                {"doc": "연방 세금보고서(IRS 1040)", "desc": "세금보고를 한 경우 1040 1~2페이지 사본 (보고하지 않은 경우 비과세 증빙 서명)."},
                {"doc": "메디케어 카드 사본", "desc": "Part A/B가 표기된 메디케어 카드."}
            ],
            tips=[
                {"title": "자산이 많아도 소득만 맞으면 100% 승인", "desc": "집이나 부동산, 은행 예금이 수십만 달러가 있어도 자산 심사를 전혀 하지 않으므로 은퇴 후 연금 소득 기준만 맞으면 신청할 수 있습니다."},
                {"title": "약국에서 PAAD 카드와 메디케어 카드 동시 제시", "desc": "H마트 내 약국이나 CVS, Walgreens 등에서 처방약을 픽업할 때 PAAD 카드를 제시하면 컴퓨터가 자동으로 $5/$7로 정산합니다."}
            ],
            contacts=[
                {"name": "NJ Division of Aging Services (DoAS)", "val": "1-800-792-9745"},
                {"name": "NJSave 온라인 신청 포털", "val": "njdoas-ua.dhs.state.nj.us"}
            ]
        )
    })

    # art-28: LIS / Extra Help
    articles.append({
        "id": "art-28",
        "slug": "medicare-low-income-subsidy-lis-ko",
        "category_id": "prescription",
        "category_name": "처방약 & 약값 지원",
        "title": "저소득층 처방약 보조 프로그램 (LIS, Extra Help)",
        "excerpt": "연방 메디케어 파트 D 처방약 보험료, 디덕터블 및 코페이를 전액 보조해 주는 연방 LIS(Extra Help) 2026 전면 확대 규정.",
        "content_html": render_article_html(
            cat_title="처방약 & 약값 지원",
            title="연방 처방약 저소득 보조금 (LIS / Extra Help - 파트 D 약값 상한)",
            portal_key="medicare_gov",
            exec_summary={
                "정책 취지": "사회보장국(SSA)과 연방 메디케어국(CMS)이 저소득 메디케어 가입자의 파트 D 처방약 보험료와 본인부담금을 지원하는 연방 보조 프로그램으로 연간 약 $5,300 상당의 가치를 지닙니다.",
                "인플레이션 감축법(IRA)에 따른 2026 전면 확대": "과거의 부분 보조(Partial LIS)가 전면 폐지되고 연방 빈곤선 150% 이하 모든 적격자에게 <span class='rc-chart-cell-highlight'>100% 전액 보조(Full Extra Help)</span> 일괄 제공.",
                "약값 혜택": "파트 D 연간 디덕터블 $0, 제네릭 약값 최대 약 $4.50, 브랜드 약값 최대 약 $11.20.",
                "가입 페널티 영구 면제": "파트 D 지연 가입 페널티(Late Enrollment Penalty)가 전액 탕감 면제됩니다."
            },
            chart_info={
                "title": "2026/2027 연방 Extra Help (LIS 150% FPL) 소득 및 자산 기준표",
                "badge": "100% 전액 보조 (Full LIS)",
                "headers": ["가구 형태", "연간 총소득 한도 (150% FPL)", "연방 자산 한도 (Asset Limit)", "본인부담금 혜택"],
                "rows": [
                    ["독신 (Single)", "<span class='rc-chart-cell-highlight'>$23,475 이하</span>", "$17,220 이하", "<span class='rc-chart-badge rc-chart-badge-green'>파트 D 월 보험료 $0</span>"],
                    ["부부 (Married)", "<span class='rc-chart-cell-highlight'>$31,725 이하</span>", "$34,360 이하", "<span class='rc-chart-badge rc-chart-badge-green'>연간 디덕터블 $0</span>"],
                    ["초과 소득 시 (뉴저지)", "PAAD 신청으로 전환", "자산 심사 면제", "뉴저지 PAAD로 동일 혜택 수령"]
                ],
                "footnote": "자산 계산 시 주 거주 주택, 차량 1대, 가재도구 및 1인당 $1,500 이하의 장례 준비금은 자산에서 제외됩니다."
            },
            sections=[
                {
                    "heading": "2026년 메디케어 파트 D $2,000 본인부담 상한제와의 시너지",
                    "content": """
<p>2026년부터 모든 메디케어 파트 D 가입자는 연간 약값 본인부담 상한이 <strong>$2,000</strong>으로 제한됩니다. 여기에 Extra Help 자격을 취득하면 $2,000 상한선에 도달하기도 전에 매달 몇 달러의 소액 코페이만으로 모든 고가 처방약을 해결할 수 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "소셜 시큐리티 번호", "desc": "신청자 및 배우자 소셜 카드."},
                {"doc": "은행 및 금융 계좌 내역서", "desc": "체킹, 세이빙, CD, 주식 잔고 내역 (자산 한도 입증)."},
                {"doc": "메디케어 번호", "desc": "Original Medicare Red, White, Blue 카드."}
            ],
            tips=[
                {"title": "뉴저지 거주자는 NJSave(PAAD)를 통하면 자산 심사 우회", "desc": "연방 SSA로 직접 LIS를 신청하면 자산 심사($17,220)가 엄격하지만, 뉴저지 주정부 PAAD를 통해 승인받으면 자산 심사 없이 연방 LIS가 자동 매칭됩니다!"}
            ],
            contacts=[
                {"name": "사회보장국 Extra Help 접수처", "val": "1-800-772-1213"},
                {"name": "온라인 신청", "val": "ssa.gov/extrahelp"}
            ]
        )
    })

    # art-29: MSP
    articles.append({
        "id": "art-29",
        "slug": "medicare-savings-programs-msp-ko",
        "category_id": "prescription",
        "category_name": "처방약 & 약값 지원",
        "title": "메디케어 비용 절감 프로그램 (MSP)",
        "excerpt": "매달 소셜 연금에서 차감되는 메디케어 파트 B 보험료($185.00)를 주정부가 대신 납부해 주는 MSP (QMB, SLMB, QI) 프로그램.",
        "content_html": render_article_html(
            cat_title="처방약 & 약값 지원",
            title="메디케어 비용 절감 프로그램 (MSP - 파트 B 보험료 $185 대납)",
            portal_key="paad_seniorgold",
            exec_summary={
                "정책 취지": "저소득 메디케어 수급자가 매달 소셜 시큐리티 연금에서 강제 공제당하는 메디케어 파트 B 월 보험료(2026년 기준 <span class='rc-chart-cell-highlight'>$185.00 / 연간 $2,220</span>)를 주정부 메디케이드 기금으로 전액 대신 납부해 주는 획기적인 제도입니다.",
                "소셜 연금 즉시 인상 효과": "승인 즉시 소셜 시큐리티 연금에서 $185.00 공제가 중단되므로 매달 입금되는 실수령 연금이 <span class='rc-chart-cell-highlight'>정확히 $185.00 인상</span>됩니다.",
                "3대 프로그램 등급": "1) QMB(보험료 + 디덕터블 + 코페이 전액 대납), 2) SLMB(파트 B 보험료 대납), 3) QI(파트 B 보험료 대납).",
                "뉴저지 특별 규정": "뉴저지는 PAAD 신청 시 MSP 자격을 자동 선별하여 일괄 승인합니다."
            },
            chart_info={
                "title": "2026/2027 뉴저지 메디케어 비용 절감 프로그램(MSP) 등급별 기준",
                "badge": "파트 B 보험료 대납",
                "headers": ["프로그램 등급", "월 소득 기준 (독신)", "월 소득 기준 (부부)", "지원 혜택 내용"],
                "rows": [
                    ["<span class='rc-chart-cell-highlight'>QMB (자격 메디케어 수급자)</span>", "$1,305 이하 (100% FPL)", "$1,763 이하", "<span class='rc-chart-badge rc-chart-badge-green'>파트 B 보험료 + 병원 코페이 100% 면제</span>"],
                    ["<span class='rc-chart-cell-highlight'>SLMB (지정 저소득 수급자)</span>", "$1,566 이하 (120% FPL)", "$2,116 이하", "<span class='rc-chart-badge rc-chart-badge-blue'>파트 B 월 보험료 $185.00 전액 대납</span>"],
                    ["<span class='rc-chart-cell-highlight'>QI (적격 개인)</span>", "$1,762 이하 (135% FPL)", "$2,380 이하", "<span class='rc-chart-badge rc-chart-badge-blue'>파트 B 월 보험료 $185.00 전액 대납</span>"]
                ],
                "footnote": "뉴저지 고령화서비스국(DoAS)의 NJSave 포털을 통해 신청하면 주정부가 최적의 등급으로 자동 배정합니다."
            },
            sections=[
                {
                    "heading": "소급 환급(Retroactive Reimbursement) 혜택",
                    "content": """
<p>SLMB나 QI 등급으로 승인될 경우, 신청일 이전 최대 3개월 동안 이미 소셜 연금에서 빠져나갔던 파트 B 보험료(최대 약 $555)가 본인의 은행 계좌로 일괄 소급 환급 입금됩니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "메디케어 카드", "desc": "Part A와 Part B 가입 증명."},
                {"doc": "소셜 연금 내역서", "desc": "파트 B 보험료 공제 내역이 표시된 SSA-1099."},
                {"doc": "소득 증빙", "desc": "급여명세서 또는 세금보고서 사본."}
            ],
            tips=[
                {"title": "QI 등급은 매년 선착순 마감 주의", "desc": "QI는 연방 한정 예산으로 운영되므로 매년 초에 신청하는 것이 안전합니다."},
                {"title": "QMB 환자는 병원비 밸런스 빌링(Balance Billing) 절대 금지", "desc": "QMB 수급자에게 메디케어 본인부담금을 청구하는 것은 연방법 위반이므로 병원에서 청구서가 오면 QMB 카드 사본을 제시하십시오."}
            ],
            contacts=[
                {"name": "NJSave 온라인 접수처", "val": "1-800-792-9745"},
                {"name": "공식 신청 포털", "val": "njdoas-ua.dhs.state.nj.us"}
            ]
        )
    })

    # art-52: Medicare Buy-In
    articles.append({
        "id": "art-52",
        "slug": "medicare-buy-in-ko",
        "category_id": "prescription",
        "category_name": "처방약 & 약값 지원",
        "title": "메디케어 바이-인 (Medicare Buy-In)",
        "excerpt": "소득이 낮아 메디케어 파트 A 또는 파트 B 보험료를 낼 여력이 없는 시니어를 위해 주정부가 대신 보험을 사주는 Buy-In 협약 제도.",
        "content_html": render_article_html(
            cat_title="처방약 & 약값 지원",
            title="메디케어 주정부 매입 제도 (Medicare Buy-In Agreement)",
            portal_key="njfamilycare",
            exec_summary={
                "정책 취지": "연방 정부와 뉴저지주가 체결한 공식 협약(State Buy-In Agreement)에 따라, 저소득 고령자가 의료 사각지대에 놓이지 않도록 주정부 메디케이드 기금으로 연방 메디케어 파트 A 및 파트 B 보험을 직접 매입(대납)해 주는 제도입니다.",
                "파트 A 무료 자격이 없는 경우": "미국 내 근로 기록이 40크레딧(10년) 미만이어서 월 최대 $518의 비싼 파트 A 보험료를 내야 하는 시니어의 파트 A 보험료를 QMB를 통해 주정부가 전액 대납.",
                "파트 B 보험료 대납": "월 $185.00의 파트 B 보험료를 대납하여 저소득 노인의 실질 연금 소득을 보존.",
                "신청 관할": "거주 카운티 사회복지국(Board of Social Services) 또는 NJ FamilyCare."
            },
            chart_info={
                "title": "근로 크레딧 부족 시 메디케어 바이-인(Buy-In) 구제 구조",
                "badge": "크레딧 부족 시 해결책",
                "headers": ["근로 크레딧 수준", "일반 본인부담 파트 A 보험료", "Buy-In (QMB 승인 시) 지원", "최종 본인 부담금"],
                "rows": [
                    ["40 크레딧 이상 (10년)", "$0 (무료 자동 자격)", "해당 없음", "$0 (무료)"],
                    ["30 ~ 39 크레딧 (7.5년)", "월 $285", "<span class='rc-chart-cell-highlight'>주정부가 월 $285 전액 대납</span>", "<span class='rc-chart-badge rc-chart-badge-green'>$0 (전액 무료)</span>"],
                    ["30 크레딧 미만 (신규 이민)", "<span class='rc-chart-cell-highlight'>월 $518 (연간 $6,216)</span>", "<span class='rc-chart-cell-highlight'>주정부가 월 $518 전액 대납</span>", "<span class='rc-chart-badge rc-chart-badge-green'>$0 (전액 무료)</span>"]
                ],
                "footnote": "파트 A Buy-In을 받으려면 소득이 100% FPL 이하이고 자산이 $4,000 이하인 QMB 자격을 충족해야 합니다."
            },
            sections=[
                {
                    "heading": "늦은 나이에 미국에 온 부모 초청 이민자의 핵심 구제책",
                    "content": """
<p>부모 초청으로 영주권을 취득하여 미국에서 일한 기록이 전혀 없는 어르신들은 65세가 되어도 파트 A가 무료로 나오지 않아 월 $518의 보험료가 청구됩니다. 이때 <strong>QMB를 통한 Part A Buy-In</strong>을 승인받으면 매달 $518을 주정부가 대신 내주어 완벽한 메디케어 카드를 취득할 수 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "메디케어 가입 통지서", "desc": "사회보장국 발행 파트 A 보험료 고지서 사본."},
                {"doc": "합법 체류 및 5년 영주권 증빙", "desc": "영주권 취득 후 5년 경과 입증 서류."},
                {"doc": "소득 및 자산 증빙", "desc": "은행 잔고 증명서 ($4,000 이하)."}
            ],
            tips=[
                {"title": "일반 AEP 기간 외에도 주정부 Buy-In은 연중 신청 가능", "desc": "Buy-In 자격이 입증되면 사회보장국 일반 가입 기간(GEP)과 무관하게 연중 언제든지 메디케어 개시가 가능합니다."}
            ],
            contacts=[
                {"name": "버겐카운티 복지국 메디케이드과", "val": "201-368-4200"},
                {"name": "CMS Medicare Buy-In Unit", "val": "1-800-MEDICARE"}
            ]
        )
    })

    # art-53: Comprehensive Healthcare & Rx Assistance
    articles.append({
        "id": "art-53",
        "slug": "medicare-healthcare-cost-assistance-ko",
        "category_id": "prescription",
        "category_name": "처방약 & 약값 지원",
        "title": "의료 및 처방약 보조 프로그램",
        "excerpt": "뉴저지 주민을 위한 복합 약값 지원 제도(PAAD, Senior Gold, LIS, 제약사 무상지원 PAP)의 종합 매트릭스 및 중복 활용 전략.",
        "content_html": render_article_html(
            cat_title="처방약 & 약값 지원",
            title="의료 및 처방약 보조 프로그램 종합 안내 (Rx Assistance Safety Nets)",
            portal_key="paad_seniorgold",
            exec_summary={
                "정책 취지": "소득 수준과 건강보험 종류에 따라 뉴저지 주민이 이용할 수 있는 주정부, 연방정부, 비영리 재단 및 제약사 약값 보조 제도를 한곳에 망라하여 본인에게 최적화된 약값 절감 포트폴리오를 제공합니다.",
                "핵심 프로그램군": "1) 뉴저지 주정부 PAAD & Senior Gold, 2) 연방 LIS Extra Help, 3) 제약회사 환자 지원 프로그램(PAP), 4) GoodRx 및 네오디(NeedyMeds) 할인 카드.",
                "최대 장점": "보험이 없는 서류미비자나 중산층이라도 제약사 환자 지원(PAP)을 통해 고가 오리지널 항암제나 바이오 의약품을 100% 무료($0)로 공급받을 수 있습니다.",
                "통합 신청": "뉴저지 거주 시니어는 NJSave 포털을 통해 5대 주정부 약값/의료비 프로그램을 한 번에 동시 접수."
            },
            chart_info={
                "title": "소득 구간별 최적의 뉴저지 처방약 지원 프로그램 매트릭스",
                "badge": "약값 안전망 종합",
                "headers": ["가구 소득 수준", "가장 추천하는 프로그램", "약값 예상 혜택", "자산 심사"],
                "rows": [
                    ["저소득층 (FPL 100% 이하)", "메디케이드 + 연방 LIS", "<span class='rc-chart-cell-highlight'>약값 100% 무료 ($0)</span>", "엄격 심사"],
                    ["시니어 중저소득 (독신 $52,142 이하)", "<span class='rc-chart-cell-highlight'>뉴저지 PAAD</span>", "<span class='rc-chart-cell-highlight'>제네릭 $5 / 브랜드 $7 고정</span>", "<span class='rc-chart-badge rc-chart-badge-green'>자산 심사 없음</span>"],
                    ["시니어 중산층 (독신 $62,142 이하)", "뉴저지 Senior Gold", "<span class='rc-chart-badge rc-chart-badge-blue'>약값 50% 주정부 대납</span>", "<span class='rc-chart-badge rc-chart-badge-green'>자산 심사 없음</span>"],
                    ["고소득 또는 보험 거절 시", "제약사 환자 지원(PAP)", "특정 고가약 100% 무료 공급", "제약사별 심사"]
                ],
                "footnote": "여러 프로그램을 교차 활용하면 연간 수천~수만 달러의 처방약 비용을 합법적으로 절감할 수 있습니다."
            },
            sections=[
                {
                    "heading": "제약회사 환자 지원 프로그램(Patient Assistance Programs, PAP) 활용법",
                    "content": """
<p>화이자, 노바티스, 아스트라제네카 등 대형 제약회사들은 정부 보험이 없거나 보험 적용이 거절된 환자를 위해 약을 무료로 기부하는 <strong>PAP 프로그램</strong>을 운영합니다. 주치의와 함께 신청서를 작성하면 1년치 고가 처방약이 의사 오피스로 무상 배송됩니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "처방약 이름 및 복용량", "desc": "정확한 약물 스펠링과 용량(mg)."},
                {"doc": "처방 의사 서명", "desc": "주치의가 직접 작성한 환자 지원 프로그램 신청서."},
                {"doc": "세금보고서 1040", "desc": "제약사 소득 심사용 소득 증명."}
            ],
            tips=[
                {"title": "약국 변경만으로도 가격 절감", "desc": "메디케어 파트 D 가입자는 본인의 보험사와 제휴된 '우선 약국(Preferred Pharmacy)'을 이용해야 코페이가 절반 이하로 떨어집니다."}
            ],
            contacts=[
                {"name": "NeedyMeds 비영리 약값 안내", "val": "needymeds.org"},
                {"name": "NJSave 공식 포털", "val": "1-800-792-9745"}
            ]
        )
    })

    # art-57: Medicare Part D
    articles.append({
        "id": "art-57",
        "slug": "medicare-part-d-ko",
        "category_id": "prescription",
        "category_name": "처방약 & 약값 지원",
        "title": "메디케어 파트 D (처방약 플랜)",
        "excerpt": "2026년 인플레이션 감축법(IRA)에 따라 도입된 연간 본인부담금 $2,000 상한제, 도넛홀 폐지 및 최적 플랜 선택법.",
        "content_html": render_article_html(
            cat_title="처방약 & 약값 지원",
            title="메디케어 파트 D 처방약 보험 (Part D - 2026년 $2,000 상한제 전면 적용)",
            portal_key="medicare_compare",
            exec_summary={
                "정책 취지": "오리지널 메디케어(Parts A & B)가 커버하지 않는 약국 외래 처방약을 전문적으로 보장하기 위해 민간 보험사를 통해 제공되는 처방약 전용 보험입니다.",
                "2026년 역사적 대개혁 ($2,000 Cap)": "인플레이션 감축법(IRA)에 따라 가입자의 <span class='rc-chart-cell-highlight'>연간 약값 본인부담금 상한이 정확히 $2,000으로 고정</span>되어, 이후 약값은 100% 무료($0)로 전환됩니다.",
                "도넛홀(Donut Hole) 영구 폐지": "과거 가입자들을 고통스럽게 했던 약값 보장 공백기(Coverage Gap)가 역사 속으로 영구히 사라졌습니다.",
                "약값 분할 납부제 (M3P)": "고가 처방약을 복용하는 환자는 연간 본인부담금을 12개월 무이자 분할 납부할 수 있는 권리를 누립니다."
            },
            chart_info={
                "title": "2026 메디케어 파트 D 처방약 보장 3단계 구조 ($2,000 상한제)",
                "badge": "2026 최신 개정 구조",
                "headers": ["보장 단계", "환자 지출 구간", "환자 본인 부담 비율", "2026년 변경 핵심"],
                "rows": [
                    ["1단계: 연간 디덕터블", "$0 ~ $590", "100% 본인 부담 (플랜별 상이)", "플랜에 따라 디덕터블 면제 다수"],
                    ["2단계: 초기 보장 (Initial)", "$590 ~ $2,000 본인부담 도달 시까지", "약값의 약 25% (코페이)", "고정 코페이($1~$10선) 다수"],
                    ["<span class='rc-chart-cell-highlight'>3단계: 파국적 보장 (Catastrophic)</span>", "<span class='rc-chart-cell-highlight'>본인 지출 $2,000 초과 시점부터</span>", "<span class='rc-chart-badge rc-chart-badge-green'>0% ($0 - 전액 무료 100% 커버)</span>", "<span class='rc-chart-cell-highlight'>연말까지 모든 처방약 100% 공짜!</span>"]
                ],
                "footnote": "일반 오리지널 메디케어 가입자는 독립형 파트 D(PDP)를, 어드밴티지 가입자는 파트 D가 포함된 MAPD 플랜을 선택해야 합니다."
            },
            sections=[
                {
                    "heading": "메디케어 처방약 결제 분할 납부 프로그램 (M3P)",
                    "content": """
<p>연초 1~2월에 고가의 약을 타야 해서 한 번에 수백~수천 달러가 청구되는 부담을 막기 위해, <strong>Medicare Prescription Payment Plan (M3P)</strong>을 신청하면 연간 약값을 12개월로 나누어 매월 균등 청구서로 지불할 수 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "복용 중인 모든 처방약 이름", "desc": "정확한 약물 영문명, 용량, 1일 복용 횟수."},
                {"doc": "자주 이용하는 약국", "desc": "CVS, Walgreens, 한인 로컬 약국 등 선호 약국 지정."},
                {"doc": "메디케어 번호", "desc": "Medicare.gov 플랜 비교 시 필수."}
            ],
            tips=[
                {"title": "매년 가을 AEP(10/15~12/7) 플랜 비교 필수", "desc": "보험사들이 매년 약물 포뮬러리(Formulary)와 약값을 변경하므로 작년에 좋았던 플랜이 올해 최악의 플랜이 될 수 있습니다. 매년 가을 Medicare.gov에서 복용약을 입력하고 재비교하십시오."},
                {"title": "지연 가입 페널티(LEP) 주의", "desc": "메디케어 취득 시점에 동등한 적격 처방약 보험에 가입하지 않으면 평생 동안 매월 페널티가 누적 가산됩니다."}
            ],
            contacts=[
                {"name": "Medicare.gov 공식 플랜 비교 포털", "val": "1-800-633-4227"},
                {"name": "NJ SHIP 공인 무료 상담", "val": "1-800-792-8820"}
            ]
        )
    })

    return articles

print("cat_prescription.py loaded successfully.")
