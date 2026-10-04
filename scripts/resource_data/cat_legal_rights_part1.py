# -*- coding: utf-8 -*-
"""
Legal Rights category articles - Part 1 (14 articles)
"""
from .common import render_article_html

def get_legal_rights_part1_articles():
    articles = []

    # art-39: Ombudsman
    articles.append({
        "id": "art-39",
        "slug": "senior-protection-ombudsman-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "옴부즈맨 (Ombudsman)",
        "excerpt": "정부 행정 기관이나 공공 서비스 이용 중 부당한 피해를 입었을 때 시민의 권리를 독립적으로 대변하고 구제하는 옴부즈맨 제도.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="공공 행정 권익 옴부즈맨 (Government Ombudsman System)",
            portal_key="bergen_seniors",
            exec_summary={
                "정책 취지": "시민이 주정부, 시정부, 공공 복지 기관을 이용하면서 겪은 부당한 처분, 행정 지연, 불공정한 대우를 독립적인 중립 기구에서 조사하여 바로잡아 주는 시민 권익 대변인입니다.",
                "무료 권익 지원": "상담 및 조사 착수에 일체의 수수료나 비용이 들지 않는 100% 무료 공공 지원.",
                "비밀 보장": "신고자의 신원과 제보 내용은 주정부 법률에 따라 철저히 비공개(Confidential)로 보호.",
                "해결 분야": "메디케이드 신청 부당 지연, 푸드스탬프 지급 오류, 카운티 공무원의 불친절 및 부당 거절 시정."
            },
            chart_info={
                "title": "뉴저지 분야별 주요 옴부즈맨 기구 현황",
                "badge": "독립 구제 기관",
                "headers": ["기관 명칭", "관할 전문 분야", "핫라인 연락처"],
                "rows": [
                    ["Long-Term Care Ombudsman (LTCO)", "너싱홈, 어시스티드 리빙 환자 권익", "1-877-582-6995"],
                    ["Office of the Corrections Ombudsman", "교정 시설 및 수감자 권익", "1-800-457-3601"],
                    ["Division of Rate Counsel (공공요금 옴부즈맨)", "전기, 가스, 수도 요금 인상 시민 대변", "609-984-1460"]
                ],
                "footnote": "카운티 복지국의 결정에 불복할 경우 정식 공청회(Fair Hearing) 신청도 지원합니다."
            },
            sections=[
                {
                    "heading": "옴부즈맨 민원 접수 및 조사 절차",
                    "content": """
<p>전화나 온라인으로 민원이 접수되면, 옴부즈맨 사무소의 공인 조사관이 배정되어 해당 관청의 공무원이나 시설 책임자에게 직접 연락하여 서류를 요구하고 시정 권고안을 발행합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "부당 행정 처분 통지서", "desc": "관공서에서 발송한 거절 편지나 경고장."},
                {"doc": "민원 발생 일지", "desc": "통화했던 공무원 이름, 날짜, 통화 내용 요약."}
            ],
            tips=[
                {"title": "정식 공청회(Fair Hearing) 기한 확인", "desc": "복지 혜택 거절 통지서를 받은 날로부터 통상 90일 이내에 신청해야 권리가 보존됩니다."}
            ],
            contacts=[
                {"name": "NJ Ombudsman 공식 안내", "val": "1-877-582-6995"},
                {"name": "NJ State Information Line", "val": "2-1-1"}
            ]
        )
    })

    # art-40: APS
    articles.append({
        "id": "art-40",
        "slug": "senior-protection-adult-protective-services-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "성인 보호 서비스 (Adult Protective Services, APS)",
        "excerpt": "취약한 성인 및 60세 이상 시니어를 향한 신체적 학대, 방임, 자기방임, 재정적 착취를 차단하는 카운티 APS 24시간 긴급 안전망.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="성인 보호 서비스 (APS - Adult Protective Services & 시니어 학대 방지)",
            portal_key="nj_consumer_scam",
            exec_summary={
                "정책 취지": "신체적·정신적 장애나 노환으로 스스로를 보호할 수 없는 18세 이상 성인 및 시니어가 가족, 간병인 또는 제3자로부터 신체적 학대, 방임, 감금, 또는 금융 착취를 당할 때 주정부 조사관이 긴급 개입하여 안전을 확보합니다.",
                "신고 의무 및 익명성": "의사, 간호사, 사회복지사는 법적 의무 신고자(Mandated Reporter)이며, 이웃이나 친지는 100% 익명으로 안전하게 신고 가능.",
                "개입 분야": "1) 신체/언어적 폭력, 2) 식사/약품을 주지 않는 방임, 3) 위생과 거동을 포기한 자기 방임(Self-Neglect), 4) 재산 횡령 및 금융 착취.",
                "조사 및 조치": "신고 접수 후 72시간 이내(위급 시 즉시) 현장 방문 실사 및 법원 긴급 보호 명령 연계."
            },
            chart_info={
                "title": "성인 보호 서비스(APS) 주요 4대 학대 유형 및 징후",
                "badge": "학대 및 착취 징후",
                "headers": ["학대 분류", "현장에서 발견되는 구체적 징후", "APS 긴급 조치 내용"],
                "rows": [
                    ["신체적/정서적 학대", "설명되지 않는 멍, 상처, 화상, 극심한 공포 반응", "<span class='rc-chart-cell-highlight'>가해자 격리 및 안전 보호소(Shelter) 긴급 이송</span>"],
                    ["간병 방임 (Neglect)", "심한 탈수, 영양실조, 방치된 욕창, 불결한 환경", "<span class='rc-chart-badge rc-chart-badge-green'>응급 입원 조치 및 전문 간병인 긴급 배정</span>"],
                    ["<span class='rc-chart-cell-highlight'>재정적 착취 (Financial)</span>", "의심스러운 거액 송금, 대리인(POA)의 계좌 임의 인출", "<span class='rc-chart-cell-highlight'>은행 계좌 긴급 동결 및 사법당국 수사 의뢰</span>"],
                    ["자기 방임 (Self-Neglect)", "치매로 음식 섭취 중단, 가스불 방치, 쓰레기 방치", "카운티 복지국 법정 후견인(Guardian) 청구"]
                ],
                "footnote": "당사자의 자기결정권(Self-Determination)을 최대한 존중하며 능력이 있는 경우 강제 개입은 지양합니다."
            },
            sections=[
                {
                    "heading": "금융 기관의 시니어 금융 착취 감지 및 동결 권한",
                    "content": """
<p>뉴저지 주법에 따라 은행 창구 직원은 시니어가 평소와 다른 비정상적인 거액 현금을 인출하려 하거나, 낯선 동행인에게 위압을 받는 정황이 포착되면 인출을 일시 보류하고 즉시 APS에 신고할 의무가 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "피해 사실 정황 기록", "desc": "학대나 착취가 발생한 일시, 장소, 목격자."},
                {"doc": "의심 거래 은행 명세서", "desc": "비정상적인 송금이나 수표 발행 내역."},
                {"doc": "의료 기록", "desc": "병원 응급실 진단서나 외상 사진."}
            ],
            tips=[
                {"title": "망설이지 말고 즉시 신고", "desc": "확실한 물증이 없더라도 의심스러운 정황만으로도 신고할 수 있으며, 선의의 신고자는 법적으로 일체의 민형사상 책임을 지지 않습니다."}
            ],
            contacts=[
                {"name": "버겐카운티 APS 핫라인", "val": "201-368-4300"},
                {"name": "뉴저지주 24시간 성인학대 신고", "val": "1-800-624-4219"}
            ]
        )
    })

    # art-41: Senior Scam & Cyber Security
    articles.append({
        "id": "art-41",
        "slug": "senior-protection-senior-scam-and-cyber-security-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "시니어 대상 사기 및 사이버 보안 (Senior Scam & Cyber Security)",
        "excerpt": "메디케어 카드 사기, 국세청(IRS) 사칭, 손주 사칭 보이스피싱 및 가상화폐 사기로부터 뉴저지 한인 시니어를 지키는 예방 수칙.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="시니어 금융 사기 및 사이버 보안 가이드 (Senior Fraud Prevention)",
            portal_key="nj_consumer_scam",
            exec_summary={
                "정책 취지": "미국 내 시니어를 표적으로 삼는 지능형 보이스피싱, 이메일 스캠, 가짜 정부 기관 사칭, 로맨스 스캠이 급증함에 따라, 뉴저지 소비자보호국(NJ Division of Consumer Affairs)과 사법당국이 제공하는 공식 피해 예방 지침입니다.",
                "대표 사기 수법": "1) 메디케어 신규 플라스틱 카드 발급 사칭, 2) 국세청(IRS)/사회보장국(SSA) 체포 위협, 3) '할머니 나 사고 났어' 손주 사칭 납치 보이스피싱, 4) 가상화폐/기프트카드 결제 유도.",
                "절대 원칙": "<span class='rc-chart-cell-highlight'>정부 기관은 절대 전화로 기프트카드나 암호화폐 송금을 요구하지 않습니다!</span>",
                "피해 발생 시 즉각 대처": "은행 송금 즉시 취소 요청, 경찰 신고, FTC 및 FBI IC3 사기 신고."
            },
            chart_info={
                "title": "뉴저지 한인 시니어 대상 4대 주요 사기 수법 및 대처 요령",
                "badge": "사기 수법 완벽 차단",
                "headers": ["사기 수법 명칭", "사기범들의 전형적인 접근 멘트", "절대 속지 않는 핵심 팩트"],
                "rows": [
                    ["메디케어 플라스틱 카드 사기", "'새로운 칩 내장 메디케어 카드를 보낼 테니 소셜 번호와 기존 카드 번호를 부르라'", "<span class='rc-chart-badge rc-chart-badge-green'>메디케어는 전화로 개인정보를 절대 묻지 않음</span>"],
                    ["IRS / SSA 사칭 체포 협박", "'세금 미납/소셜 번호 범죄 연루로 오늘 당장 보안관이 체포하러 간다'", "<span class='rc-chart-cell-highlight'>연방 기관은 반드시 우편 서면으로만 통보함</span>"],
                    ["손주 사칭 긴급 보석금 (Grandparent Scam)", "'할아버지 나 교통사고로 유치장에 갇혔는데 부모님 몰래 합의금 보내줘'", "<span class='rc-chart-cell-highlight'>전화를 끊고 자녀나 손주 본인에게 직접 확인 전화</span>"],
                    ["기프트카드 / 비트코인 요구", "'타겟, 애플 기프트카드를 사서 핀 번호를 읽어주면 문제가 해결된다'", "<span class='rc-chart-badge rc-chart-badge-amber'>기프트카드 요구는 100% 사기!</span>"]
                ],
                "footnote": "의심스러운 전화를 받으면 그 자리에서 통화하지 마시고 즉시 전화를 끊으십시오."
            },
            sections=[
                {
                    "heading": "스마트폰 사이버 보안 3대 안전 수칙",
                    "content": """
<ol class="rc-guide-list-num">
  <li><strong>모르는 번호는 받지 않기:</strong> 주소록에 저장되지 않은 전화는 받지 마시고 음성메시지를 확인한 후 대처하십시오.</li>
  <li><strong>문자 메시지 링크(URL) 클릭 금지:</strong> 'USPS 택배 배송 오류', '은행 계좌 잠김' 등의 문자에 포함된 파란색 링크는 절대 누르지 마십시오.</li>
  <li><strong>컴퓨터 원격 접속 허용 금지:</strong> 팝업창에 '컴퓨터에 바이러스가 감염되었으니 마이크로소프트에 전화하라'는 화면이 떠도 사기이므로 컴퓨터를 강제 재부팅하십시오.</li>
</ol>
"""
                }
            ],
            checklist=[
                {"doc": "사기범 발신 전화번호", "desc": "발신자 번호 및 통화 녹음/메모."},
                {"doc": "송금 영수증", "desc": "은행 송금 영수증 또는 기프트카드 구매 영수증 사본."},
                {"doc": "경찰 리포트", "desc": "타운 경찰서(Police Department)에 접수한 사건 번호."}
            ],
            tips=[
                {"title": "자녀와 '가족 비밀 암호' 설정", "desc": "손주를 사칭하는 위급 전화가 걸려왔을 때 가족만 아는 암호(반려견 이름 등)를 물어보면 1초 만에 사기임을 확인할 수 있습니다."}
            ],
            contacts=[
                {"name": "NJ Division of Consumer Affairs 사기 신고", "val": "1-800-242-5846"},
                {"name": "FBI 인터넷 사기 신고 센터 (IC3)", "val": "ic3.gov"},
                {"name": "연방 통상위원회 (FTC 사기 신고)", "val": "reportfraud.ftc.gov"}
            ]
        )
    })

    # art-42: Power of Attorney (POA)
    articles.append({
        "id": "art-42",
        "slug": "retirement-planning-power-of-attorney-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "위임장 (Power of Attorney, POA)",
        "excerpt": "인지 능력을 상실했을 때를 대비해 신뢰하는 가족에게 재정·법률 대리권을 위임하는 뉴저지 지속적 위임장(Durable POA) 작성법.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="위임장 (Power of Attorney / POA - 법률 및 재정 대리권)",
            portal_key="nj_courts",
            exec_summary={
                "정책 취지": "사고, 뇌졸중, 치매 등으로 본인이 직접 의사결정을 내릴 수 없는 상태에 이르렀을 때를 대비하여, 본인이 신뢰하는 대리인(주로 배우자나 성인 자녀)에게 재산 관리, 은행 업무, 부동산 매매, 세금 보고 권한을 법적으로 위임하는 서류입니다.",
                "지속적 위임장(Durable POA)의 필수성": "일반 위임장과 달리 본인이 '인지 무능력(Incapacitated)' 상태가 되더라도 대리권의 효력이 소멸하지 않고 지속되는 형식을 선택해야 합니다.",
                "사전 작성 원칙": "정신이 맑고 정상적인 인지 능력이 있을 때만 법적으로 유효하게 서명 및 공증할 수 있습니다.",
                "후견인 재판(Guardianship) 예방": "POA가 없으면 가족이 은행 계좌를 열거나 집을 팔기 위해 수천~수만 달러의 비용과 수개월의 법원 후견인 재판을 거쳐야 합니다."
            },
            chart_info={
                "title": "지속적 위임장(Durable POA) vs 법원 성인 후견인(Guardianship) 비교",
                "badge": "사전 위임의 경제적 가치",
                "headers": ["비교 항목", "지속적 위임장 (Durable POA)", "법원 성인 후견인 선임 (Guardianship)"],
                "rows": [
                    ["진행 시점", "<span class='rc-chart-cell-highlight'>정신이 맑을 때 미리 작성 (사전 대비)</span>", "인지 능력을 상실한 후 법원에 신청"],
                    ["소요 비용", "$500 ~ $1,500 선 (변호사 작성)", "<span class='rc-chart-cell-highlight'>$5,000 ~ $15,000 이상 (막대한 재판 비용)</span>"],
                    ["소요 기간", "서명 및 공증 즉시 효력 발생 (1~2일)", "법원 심리 및 의사 감정으로 3~6개월 소요"],
                    ["대리인 선택", "<span class='rc-chart-badge rc-chart-badge-green'>본인이 가장 신뢰하는 자녀를 직접 지정</span>", "판사가 임의 지정 (가족 간 다툼 시 제3자 변호사 배정)"]
                ],
                "footnote": "POA는 본인이 사망하는 순간 모든 법적 효력이 소멸하며, 사후에는 유언장(Will)이나 트러스트가 효력을 갖습니다."
            },
            sections=[
                {
                    "heading": "메디케이드 신청 대리권 조항(Medicaid Planning Powers) 필수 삽입",
                    "content": """
<p>POA 서류에 단순 은행 업무뿐만 아니라, <em>'본인의 자산을 메디케이드 기준에 맞추어 합법적으로 증여하거나 트러스트로 이전할 수 있는 권한(Gifting Powers)'</em>이 명시되어 있어야만, 향후 치매가 왔을 때 자녀가 부모님의 재산을 보호하고 메디케이드를 신청할 수 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "공증된 Durable POA 원본", "desc": "뉴저지 공증인(Notary Public) 및 2인 증인 서명 원본."},
                {"doc": "대리인 신분증", "desc": "대리인으로 지정된 자녀의 신분증."},
                {"doc": "금융기관 등록", "desc": "체이스, 뱅크오브아메리카 등 주거래 은행에 POA 원본을 미리 등록하여 승인 완료."}
            ],
            tips=[
                {"title": "주거래 은행에 사전 등록(Record on File)", "desc": "은행마다 자체 법무팀의 POA 검토 절차가 수주일 걸릴 수 있으므로 부모님이 건강하실 때 미리 은행에 서류를 등록해 두십시오."}
            ],
            contacts=[
                {"name": "New Jersey State Bar Association", "val": "732-249-5000"},
                {"name": "NJAP 은퇴 법률 전문가 연계", "val": "201-336-7400"}
            ]
        )
    })

    # art-43: Advance Directive
    articles.append({
        "id": "art-43",
        "slug": "retirement-planning-advance-directive-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "사전 의료 지시서 (Advance Directive)",
        "excerpt": "응급실이나 중환자실에서 의식이 없을 때 나의 의료 결정을 대신할 대리인을 지정하고 연명 치료 범위를 정하는 사전 의료 의향서.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="사전 의료 지시서 (Advance Directive / 의료 위임장 & 연명치료 의향서)",
            portal_key="nj_courts",
            exec_summary={
                "정책 취지": "의식을 잃거나 혼수 상태에 빠져 스스로 의료적 의사를 표현할 수 없을 때, 내가 어떤 치료를 받고 어떤 치료를 거부할지 미리 문서로 작성해 두어 가족 간의 고통스러운 갈등을 방지하는 법적 문서입니다.",
                "2대 핵심 구성 요소": "1) 의료 대리인 지정(Health Care Proxy / Medical POA), 2) 치료 지침 의향서(Instruction Directive / Living Will).",
                "법적 효력": "의사와 병원은 법적으로 Advance Directive에 명시된 환자의 뜻을 존중해야 하며 가족의 임의 번복을 금지합니다.",
                "간편한 작성": "변호사 비용 없이도 주정부 공식 서식에 2명의 증인 또는 공증인 서명만으로 즉시 법적 효력 발생."
            },
            chart_info={
                "title": "사전 의료 지시서(Advance Directive)에서 결정하는 핵심 의료 처치",
                "badge": "존엄한 의료 자기결정",
                "headers": ["치료 항목", "치료 내용", "선택 옵션 (환자의 선택권)"],
                "rows": [
                    ["심폐소생술 (CPR)", "심장 정지 시 흉부 압박 및 전기 충격기 사용", "<span class='rc-chart-cell-highlight'>시행 희망 vs DNR (소생 거부)</span>"],
                    ["인공호흡기 (Ventilator)", "자발 호흡 불가 시 기관 삽관 기계 호흡", "영구적 회복 불가능 시 중단 희망"],
                    ["인공 영양 공급 (Feeding Tube)", "위장 튜브를 통한 영양액 강제 투여", "생명 연장 목적의 강제 투입 거부"],
                    ["호스피스 완화 치료", "통증과 고통을 없애는 모르핀 등 진통제 투여", "<span class='rc-chart-badge rc-chart-badge-green'>최대한 적극적 투여 희망</span>"]
                ],
                "footnote": "언제든지 본인의 의사에 따라 문서를 파기하거나 수정하여 새로운 내용으로 갱신할 수 있습니다."
            },
            sections=[
                {
                    "heading": "의료 대리인(Health Care Proxy)의 역할",
                    "content": """
<p>의료 대리인은 환자가 의식을 잃었을 때 환자를 대신해 수술 동의서에 서명하거나 치료 방향을 주치의와 논의하는 사람입니다. 평소 본인의 가치관과 종교적 신념을 가장 잘 이해하고 감정적으로 흔들리지 않을 자녀나 배우자를 지정해야 합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "Advance Directive 작성 원본", "desc": "본인 서명 및 2인 증인(대리인 제외) 또는 공증인 서명."},
                {"doc": "주치의 병원 차트 등록", "desc": "주치의 오피스 및 자주 가는 종합병원(홀리네임, 잉글우드 등)에 사본 제출."},
                {"doc": "지갑 소지용 카드", "desc": "사전 의료 지시서 작성 사실과 대리인 연락처가 적힌 카드 지갑 소지."}
            ],
            tips=[
                {"title": "서류를 금고에 보관하지 마십시오", "desc": "응급 상황에서 바로 꺼낼 수 있어야 하므로 은행 안전금고가 아닌 자택의 쉽게 찾을 수 있는 서랍에 보관하고 자녀에게 위치를 알려주십시오."}
            ],
            contacts=[
                {"name": "NJ Commission on Legal and Ethical Healthcare", "val": "609-984-2728"},
                {"name": "뉴저지 공식 서식 다운로드", "val": "nj.gov/health/advancedirective"}
            ]
        )
    })

    # art-44: Will
    articles.append({
        "id": "art-44",
        "slug": "retirement-planning-will-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "유언장 (Will)",
        "excerpt": "사후 유산 분배, 미성년 자녀 후견인 지정 및 유언 집행자(Executor) 선임을 위한 뉴저지 검인법원(Surrogate Court) 유언장 작성법.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="유언장 (Last Will and Testament - 유산 분배 및 유언 검인)",
            portal_key="nj_courts",
            exec_summary={
                "정책 취지": "사후에 본인이 평생 일군 재산(부동산, 예금, 주식, 귀중품)을 누구에게 얼마씩 상속할 것인지를 법적으로 명문화하여, 가족 간의 상속 분쟁을 예방하고 유언자의 의사를 정확히 집행하도록 하는 기본 상속 문서입니다.",
                "유언장 부재 시(Intestacy)의 비극": "유언장 없이 사망하면 주정부 법정 상속법(Intestate Succession Laws)에 따라 기계적으로 재산이 강제 분할되어 배우자나 특정 자녀가 곤경에 처할 수 있습니다.",
                "유언 집행자(Executor) 지정": "사후에 장례를 치르고, 빚을 정산하며, 유산을 상속인들에게 공정하게 분배할 믿을 수 있는 인물을 공식 임명.",
                "뉴저지 유언 검인(Probate)": "사망 후 카운티 검인법원(Surrogate's Court)에 유언장을 제출하여 검인을 받아야 정식 재산 분배가 시작됩니다."
            },
            chart_info={
                "title": "유언장이 있는 경우 vs 유언장 없이 사망한 경우(무유언 상속)",
                "badge": "상속 분쟁 예방",
                "headers": ["비교 항목", "유언장이 있는 경우 (Testate)", "유언장 없이 사망한 경우 (Intestate)"],
                "rows": [
                    ["재산 상속자", "<span class='rc-chart-badge rc-chart-badge-green'>유언자가 지정한 사람 (배우자, 자녀, 교회 등)</span>", "<span class='rc-chart-cell-highlight'>뉴저지 상속법에 따른 법정 강제 배분</span>"],
                    ["미성년 자녀 후견인", "유언장에 지정된 후견인에게 자동 위탁", "법원 판사가 친척 중 임의 지정 (분쟁 다발)"],
                    ["유언 집행자 선임", "지정된 집행자가 즉시 권한 행사", "가족들이 법원에서 관리인(Administrator) 다툼"],
                    ["법원 공탁 보증금(Bond)", "유언장에 '보증금 면제(Waive Bond)' 조항 삽입 가능", "비싼 법원 공탁 보증 보험료 의무 납부"]
                ],
                "footnote": "은행 계좌에 수혜자(TOD/POD)가 지정되어 있거나 부부 공동 명의(JTWROS) 재산은 유언 검인을 거치지 않고 자동 승계됩니다."
            },
            sections=[
                {
                    "heading": "뉴저지 유언장 법적 효력 3대 요건",
                    "content": """
<ol class="rc-guide-list-num">
  <li><strong>작성 자격:</strong> 만 18세 이상이며 온전한 정신 상태(Sound Mind)일 것.</li>
  <li><strong>서면 작성 및 서명:</strong> 타자 인쇄된 서류에 유언자 본인의 자필 서명 필수.</li>
  <li><strong>2인 이상의 이해관계 없는 증인:</strong> 상속을 받지 않는 성인 증인 2명이 유언자의 서명을 직접 목격하고 연서할 것 (공증인 인증을 거친 Self-Proving Will 권장).</li>
</ol>
"""
                }
            ],
            checklist=[
                {"doc": "Self-Proving 유언장 원본", "desc": "공증된 유언장 원본 (사본은 법원 제출 불가)."},
                {"doc": "전체 자산 목록표", "desc": "부동산, 은행 계좌 번호, 주식, 보험 증권 목록."},
                {"doc": "유언 집행자 및 후견인 인적사항", "desc": "이름, 생년월일, 주소, 연락처."}
            ],
            tips=[
                {"title": "자필 유언장(Holographic Will) 주의", "desc": "공증 없이 혼자 손으로 쓴 유언장도 일부 인정되나, 법원에서 필적 감정 등 막대한 소송 비용이 발생하므로 변호사 작성 정식 유언장을 권장합니다."}
            ],
            contacts=[
                {"name": "버겐카운티 검인법원 (Surrogate's Court)", "val": "201-336-6700 (Hackensack)"},
                {"name": "NJ Courts 유언 안내", "val": "njcourts.gov"}
            ]
        )
    })

    # art-45: Living Trust
    articles.append({
        "id": "art-45",
        "slug": "retirement-planning-living-trust-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "리빙 트러스트 (Living Trust)",
        "excerpt": "비싼 법원 검인(Probate) 절차와 수수료를 완벽히 건너뛰고, 사망 즉시 비밀리에 자녀에게 재산을 이전하는 생전신탁 완벽 가이드.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="생전 신탁 (Revocable Living Trust - 유언 검인 회피 및 자산 승계)",
            portal_key="nj_courts",
            exec_summary={
                "정책 취지": "살아있는 동안 재산을 본인 명의에서 본인이 설립한 신탁(Trust)으로 소유권을 이전해 두고, 본인이 관리하다가 사망 시 법원 검인(Probate) 절차를 거치지 않고 지정한 수혜자에게 즉각 사적으로 자산을 물려주는 고급 상속 계획입니다.",
                "취소 가능성(Revocable)": "살아있는 동안 언제든지 자유롭게 집을 팔거나, 계좌를 해지하거나, 신탁 내용을 수정·취소할 수 있어 완전한 통제권 유지.",
                "유언장 대비 3대 장점": "1) 법원 유언 검인(Probate) 완전 회피, 2) 수개월~수년의 시간 절약 및 법원 수수료 절감, 3) 상속 내역의 100% 비공개(Privacy 유지).",
                "타주 부동산 소유 시 필수": "뉴저지 외에 뉴욕, 플로리다 등에 부동산을 소유한 경우 각 주마다 이중으로 법원 검인을 치러야 하는 대재앙을 방지."
            },
            chart_info={
                "title": "유언장(Will) vs 생전신탁(Living Trust) 비교 분석",
                "badge": "상속 플래닝 비교",
                "headers": ["비교 항목", "일반 유언장 (Last Will)", "생전 신탁 (Living Trust)"],
                "rows": [
                    ["법원 유언 검인(Probate)", "<span class='rc-chart-cell-highlight'>법원 검인 필수 (피할 수 없음)</span>", "<span class='rc-chart-badge rc-chart-badge-green'>법원 검인 100% 완전 회피</span>"],
                    ["자산 상속 소요 시간", "사망 후 수개월 ~ 1년 이상 동결", "<span class='rc-chart-cell-highlight'>사망 즉시 며칠 만에 자녀에게 이전</span>"],
                    ["상속 내역 공개 여부", "법원 공공 기록으로 누구나 열람 가능", "<span class='rc-chart-badge rc-chart-badge-green'>100% 완벽한 사생활 비밀 보장</span>"],
                    ["사전 펀딩(Funding) 필요", "불필요", "<span class='rc-chart-cell-highlight'>부동산 디드와 은행 계좌를 트러스트로 명의변경 필수</span>"]
                ],
                "footnote": "생전신탁을 설립한 후 재산의 명의를 신탁으로 바꾸는 '펀딩(Funding)' 과정을 완료하지 않으면 신탁의 효력이 없습니다."
            },
            sections=[
                {
                    "heading": "생전 신탁의 핵심 펀딩(Funding) 단계",
                    "content": """
<p>신탁 서류에 사인했다고 끝나는 것이 아닙니다. <strong>집 디드(Deed)를 '홍길동 트러스트'로 재등기</strong>하고, 은행 예금과 주식 계좌의 소유주를 트러스트 명의로 변경해야만 비로소 법원 검인을 피할 수 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "Revocable Living Trust 계약서", "desc": "설립자, 수탁자(Trustee), 수혜자가 명시된 신탁 서류."},
                {"doc": "신탁 부동산 디드 (Trust Deed)", "desc": "타운 등기소(County Clerk)에 접수된 신탁 명의 등기 권리증."},
                {"doc": "Pour-Over Will (보완 유언장)", "desc": "신탁에 미처 넣지 못한 잔여 자산을 트러스트로 부어주는 백업 유언장."}
            ],
            tips=[
                {"title": "살아있을 때는 세금보고가 100% 동일", "desc": "취소가능 신탁은 본인의 소셜 번호를 그대로 사용하므로 별도의 신탁 세금보고(Form 1041)를 할 필요 없이 기존 개인 세금보고 1040에 합산 보고하면 됩니다."}
            ],
            contacts=[
                {"name": "American College of Trust and Estate Counsel", "val": "actec.org"},
                {"name": "NJAP 신탁 전문 연계", "val": "201-336-7400"}
            ]
        )
    })

    # art-46: Older Americans Act (OAA)
    articles.append({
        "id": "art-46",
        "slug": "us-adult-welfare-older-americans-act-oaa-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "노인법 (Older Americans Act, OAA)",
        "excerpt": "미국 모든 60세 이상 시니어에게 무상 영양, 교통, 돌봄 및 법률 복지를 제공하는 연방 노인복지법(OAA)의 핵심 혜택.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="연방 노인복지법 (Older Americans Act - OAA 시니어 권익 안전망)",
            portal_key="nj_dhs_doas",
            exec_summary={
                "정책 취지": "1965년 제정된 미국의 핵심 사회복지 법률로, 소득이나 자산에 관계없이 만 60세 이상의 모든 노인이 지역사회에서 독립적이고 건강하게 존엄을 지키며 살 수 있도록 다양한 사회 서비스를 무상 지원합니다.",
                "핵심 지원 서비스": "1) 영양 지원(Meals on Wheels & 시니어 센터 급식), 2) 시니어 교통 셔틀, 3) 가족 간병인 지원(NFCSP), 4) 시니어 법률 구조, 5) 시니어 일자리(SCSEP).",
                "지역 집행 기관": "연방 자금이 뉴저지주 고령화서비스국(DoAS)을 거쳐 버겐카운티 노인복지국(Area Agency on Aging, AAA)으로 교부되어 현장 집행.",
                "수혜 자격": "만 60세 이상 주민 누구나 (경제적·사회적 취약 계층, 소수민족 시니어 우선 배려)."
            },
            chart_info={
                "title": "연방 노인법(OAA) 주요 Title별 지원 프로그램",
                "badge": "전국 공통 시니어 복지",
                "headers": ["법률 조항 (Title)", "지원 핵심 프로그램", "뉴저지 현장 실행 기관"],
                "rows": [
                    ["Title III-B (지원 서비스)", "시니어 전용 교통 셔틀 버스, 무료 법률 상담, 가정 도우미", "버겐카운티 ADRC / 커뮤니티 센터"],
                    ["Title III-C (영양 서비스)", "<span class='rc-chart-cell-highlight'>Meals on Wheels 도시락 배달 & 시니어 센터 점심 급식</span>", "카운티 노인복지국 영양과"],
                    ["Title III-E (간병인 지원)", "가족 간병인을 위한 상담, 교육 및 휴식(Respite) 지원", "Caregiver Resource Center"],
                    ["Title V (시니어 취업)", "55세 이상 저소득 노인을 위한 직업 훈련 및 파트타임 고용", "SCSEP 지역 운영 기관"]
                ],
                "footnote": "모든 OAA 기반 서비스는 수수료를 강제할 수 없으며 자발적 소액 기부로 운영됩니다."
            },
            sections=[
                {
                    "heading": "소수민족 시니어를 위한 문화적 언어 장벽 해소 의무",
                    "content": """
<p>OAA 연방법은 소수민족 노인(LEP, 영어가 서툰 주민)에게 한국어 등 모국어 통역 및 다국어 안내 책자 제공을 의무화하고 있습니다. 버겐카운티 복지국 이용 시 당당하게 한국어 통역을 요청하십시오.</p>
"""
                }
            ],
            checklist=[
                {"doc": "연령 증빙", "desc": "만 60세 이상 증빙 신분증."},
                {"doc": "거주 증빙", "desc": "뉴저지 카운티 거주 확인 우편물."}
            ],
            tips=[
                {"title": "소득이 많아도 서비스 이용 가능", "desc": "OAA 서비스는 자산 심사나 소득 심사가 없으므로 중산층 어르신도 누구나 시니어 셔틀과 센터 프로그램을 자유롭게 이용할 수 있습니다."}
            ],
            contacts=[
                {"name": "Eldercare Locator (연방 공식 안내)", "val": "1-800-677-1116 (eldercare.acl.gov)"},
                {"name": "버겐카운티 노인복지국 (AAA)", "val": "201-336-7400"}
            ]
        )
    })

    # art-47: ACL
    articles.append({
        "id": "art-47",
        "slug": "us-adult-welfare-administration-for-community-living-acl-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "커뮤니티 생활 지원청(Administration for Community Living, ACL)",
        "excerpt": "노인과 장애인이 시설에 격리되지 않고 지역사회에서 자립적으로 살아가도록 지원하는 미국 연방 보건복지부 산하 총괄 기구.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="연방 지역사회생활지원청 (Administration for Community Living - ACL)",
            portal_key="nj_dhs_doas",
            exec_summary={
                "정책 취지": "미국 연방 보건복지부(HHS) 산하 기구로서, 노인청(AoA)과 장애인복지국을 통합하여 모든 연령대의 장애인과 시니어가 시설 너싱홈에 갇히지 않고 자신이 살던 지역사회에서 독립적으로 살아가도록 정책과 예산을 총괄합니다.",
                "핵심 철학": "Community Living for All - 거주지 선택의 자유와 인간의 자립 존엄 보장.",
                "지원 프로그램": "ADRC(고령·장애인 원스톱 센터), SHIP(메디케어 건강보험 무료 상담), 이동권 지원, 가족 간병인 지원 기금.",
                "소비자 접근": "전국 단일 안내망인 Eldercare Locator를 통해 지역별 최적 복지 기관 연계."
            },
            chart_info={
                "title": "연방 ACL의 3대 핵심 지원 네트워크",
                "badge": "연방 보건복지부 총괄",
                "headers": ["지원 네트워크", "역할 및 기능", "시민 이용 방법"],
                "rows": [
                    ["ADRC (노인·장애인 원스톱 센터)", "복지 제도 사전 스크리닝 및 원스톱 신청 연계", "버겐카운티 201-336-7400"],
                    ["SHIP (건강보험 정보 프로그램)", "메디케어 플랜 편향 없는 공인 1:1 무료 상담", "1-800-792-8820"],
                    ["Eldercare Locator", "전국 어디서나 거주지 기반 노인 복지 기관 검색", "eldercare.acl.gov / 1-800-677-1116"]
                ],
                "footnote": "ACL 산하 모든 프로그램은 영리 목적이 전혀 없는 공공 무료 서비스입니다."
            },
            sections=[
                {
                    "heading": "지역사회 자립을 위한 홈 모디피케이션(Home Modification) 기금",
                    "content": """
<p>ACL은 휠체어 이용이나 보행이 불편한 어르신들이 집에서 안전하게 생활할 수 있도록 현관문 휠체어 램프 설치, 화장실 개조, 문턱 제거 공사를 지원하는 지역사회 기금을 지속적으로 확충하고 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "거주지 확인 서류", "desc": "지역 카운티 거주 증빙."},
                {"doc": "장애 또는 연령 증빙", "desc": "신분증 또는 의사 진단서."}
            ],
            tips=[
                {"title": "Eldercare Locator 웹사이트 북마크", "desc": "타주로 이사하거나 타주에 거주하는 부모님의 복지를 알아볼 때 가장 신뢰할 수 있는 연방 공식 검색 엔진입니다."}
            ],
            contacts=[
                {"name": "Eldercare Locator 전국 핫라인", "val": "1-800-677-1116"},
                {"name": "연방 ACL 공식 웹사이트", "val": "acl.gov"}
            ]
        )
    })

    # art-48: AOA
    articles.append({
        "id": "art-48",
        "slug": "us-adult-welfare-administration-on-aging-aoa-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "노인청 (Administration on Aging, AOA)",
        "excerpt": "연방 노인복지법(OAA)에 따라 미국 전역 60세 이상 노인의 권익, 보건 복지 및 노인 보호 서비스를 집행하는 연방 노인청.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="미국 연방 노인청 (Administration on Aging - AoA 노인 복지 총괄)",
            portal_key="nj_dhs_doas",
            exec_summary={
                "정책 취지": "1965년 연방 노인법 제정과 함께 설립된 연방 전문 행정청으로, 미국 50개 주의 56개 주정부 노인복지국과 618개 로컬 노인복지 에이전시(AAA)로 이어지는 전국 노인 복지 전달 체계의 사령탑입니다.",
                "핵심 사명": "고령자의 자립 증진, 건강 증진, 학대 및 사기 예방, 가족 간병인 역량 강화.",
                "재정 지원 규모": "매년 수십억 달러의 연방 기금을 Meals on Wheels, 시니어 데이케어, 옴부즈맨 조사관 파견에 배정.",
                "뉴저지 파트너십": "뉴저지주 인간복지부 산하 고령화서비스국(DoAS)과 긴밀히 연계하여 버겐카운티 한인 사회에 복지 혜택 전달."
            },
            chart_info={
                "title": "연방 노인청(AoA)에서 로컬 한인 시니어까지 이어지는 복지 전달 체계",
                "badge": "복지 행정 체계",
                "headers": ["행정 단계", "기관 명칭", "실제 집행 역할"],
                "rows": [
                    ["1단계: 연방 사령탑", "Administration on Aging (AoA / ACL)", "연방 예산 편성 및 전국 정책 수립"],
                    ["2단계: 뉴저지 주정부", "NJ Division of Aging Services (DoAS)", "PAAD, Senior Freeze, Lifeline 주정부 프로그램 총괄"],
                    ["3단계: 카운티 총괄", "Bergen County Division of Senior Services", "Meals on Wheels, 시니어 센터, 셔틀버스 직접 운영"],
                    ["<span class='rc-chart-cell-highlight'>4단계: 한인 커뮤니티 접점</span>", "<span class='rc-chart-cell-highlight'>NJ Access Portal (NJAP)</span>", "<span class='rc-chart-badge rc-chart-badge-green'>한국어 1:1 안내, 통역, 온라인 신청 원스톱 대행</span>"]
                ],
                "footnote": "언어 장벽으로 소외되기 쉬운 한인 어르신들을 위해 연방 규정에 맞춘 다문화 서비스가 제공됩니다."
            },
            sections=[
                {
                    "heading": "국가 고령화 연구 및 치매 정책 주도",
                    "content": """
<p>AoA는 알츠하이머 치매 및 관련 인지 질환에 대한 대규모 연구 기금을 지원하며, 조기 치매 진단 및 가족 간병인 교육 프로그램을 전국 시니어 센터에 무상 보급하고 있습니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "거주 증빙", "desc": "뉴저지 거주 증명서."},
                {"doc": "연령 확인", "desc": "60세 이상 신분증."}
            ],
            tips=[
                {"title": "카운티 시니어 가이드북 수령", "desc": "카운티 노인복지국에서 매년 발행하는 책자를 수령하시면 타운별 시니어 혜택을 한눈에 파악할 수 있습니다."}
            ],
            contacts=[
                {"name": "연방 AoA 안내", "val": "acl.gov/about-acl/administration-aging"},
                {"name": "버겐카운티 노인복지과", "val": "201-336-7400"}
            ]
        )
    })

    # art-51: Medicare Overview
    articles.append({
        "id": "art-51",
        "slug": "medicare-overview-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "메디케어 (Medicare) 개요",
        "excerpt": "미국 만 65세 은퇴자를 위한 연방 건강보험 메디케어 완벽 해부. 파트 A, B, C, D의 구조와 최초 가입 기간(IEP) 가이드.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="연방 메디케어 완전 정복 (Medicare Master Guide - 파트 A·B·C·D 총정리)",
            portal_key="medicare_gov",
            exec_summary={
                "정책 취지": "만 65세 이상 시니어 및 특정 중증 장애인을 위해 연방정부(CMS)가 운영하는 미국의 대표적인 공적 건강보험 시스템입니다.",
                "4대 핵심 파트 구조": "1) 파트 A(입원 병원 보험), 2) 파트 B(외래 의사 진료 보험), 3) 파트 C(메디케어 어드밴티지 종합 플랜), 4) 파트 D(처방약 보험).",
                "최초 가입 기간(IEP) 7개월": "65세 생일이 속한 달을 기준으로 <span class='rc-chart-cell-highlight'>앞으로 3개월, 생일 달, 뒤로 3개월 (총 7개월)</span> 동안 의무적으로 가입해야 평생 페널티를 방지.",
                "선택 경로 2가지": "경로 1: 오리지널 메디케어(A+B) + 서플리먼트(Medigap) + 파트 D, 또는 경로 2: 메디케어 어드밴티지(Part C 올인원)."
            },
            chart_info={
                "title": "메디케어 4대 파트(Parts A, B, C, D) 핵심 구조 비교",
                "badge": "4대 파트 총괄",
                "headers": ["파트 구분", "보장 내용", "2026년 기준 월 보험료", "가입 필수 여부"],
                "rows": [
                    ["<span class='rc-chart-cell-highlight'>파트 A (병원 보험)</span>", "병원 입원, 전문 재활원(SNF), 호스피스", "<span class='rc-chart-badge rc-chart-badge-green'>40크레딧 충족 시 $0 (무료)</span>", "자동 또는 신청 가입"],
                    ["<span class='rc-chart-cell-highlight'>파트 B (외래 의료)</span>", "의사 진료, 외래 수술, 검사, 응급실", "<span class='rc-chart-cell-highlight'>월 $185.00 표준</span> (고소득자 IRMAA 추가)", "적격 직장보험 없으면 필수"],
                    ["파트 C (어드밴티지)", "A+B+D 통합 + 치과/안과/OTC 부가 혜택", "다수 플랜 월 $0 추가 보험료", "민간 보험사 선택 가입"],
                    ["파트 D (처방약)", "약국 외래 처방약 ($2,000 연간 상한)", "플랜별 월 $10 ~ $80 선", "처방약 미가입 시 영구 페널티"]
                ],
                "footnote": "직장에서 20인 이상 규모의 적격 건강보험을 본인 또는 배우자를 통해 유지하고 있다면 65세가 되어도 파트 B 가입을 페널티 없이 합법적으로 연기할 수 있습니다."
            },
            sections=[
                {
                    "heading": "오리지널 메디케어 vs 메디케어 어드밴티지 선택 로드맵",
                    "content": """
<p>전국 어느 병원이나 네트워크 제한 없이 의사를 자유롭게 보기를 원한다면 <strong>오리지널 메디케어 + 메디갭(플랜 G)</strong>이 최고입니다. 반면 월 보험료 부담을 없애고 치과, 안경, 보청기, 한인 마트 장보기 카드 등 풍부한 부가 혜택을 원한다면 <strong>메디케어 어드밴티지(Part C)</strong>를 선택하는 것이 유리합니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "소셜 시큐리티 카드", "desc": "사회보장국 계정 확인."},
                {"doc": "현재 복용 중인 처방약 목록", "desc": "정확한 영문 약물명."},
                {"doc": "현재 다니는 의사 목록", "desc": "보험 네트워크 포함 여부 확인용."}
            ],
            tips=[
                {"title": "IEP 기한을 하루라도 넘기면 파트 B 평생 10% 할증 페널티", "desc": "65세 생일 3개월 전부터 SSA.gov에 접속하여 파트 A와 파트 B를 제때 신청하십시오."}
            ],
            contacts=[
                {"name": "연방 메디케어 공식 콜센터", "val": "1-800-MEDICARE (1-800-633-4227)"},
                {"name": "사회보장국 (메디케어 카드 신청)", "val": "1-800-772-1213 (ssa.gov)"}
            ]
        )
    })

    # art-54: Medicare Medical Bills
    articles.append({
        "id": "art-54",
        "slug": "medicare-medical-bills-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "메디케어 의료비 클레임 가이드",
        "excerpt": "병원 진료 후 날아오는 메디케어 명세서(MSN)와 보험금 설명서(EOB) 올바르게 읽는 법 및 부당 청구 이의신청(Appeal) 5단계.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="메디케어 의료비 명세서 및 부당 청구 이의신청 (Medicare Claims & Appeals)",
            portal_key="medicare_gov",
            exec_summary={
                "정책 취지": "병원이나 의사 오피스에서 진료를 받은 후 청구서가 날아왔을 때, 이것이 실제 지불해야 하는 고지서인지 아니면 단순 안내문인지 구별하고, 부당하거나 오류가 있는 의료비 청구에 대해 법적으로 이의를 제기하는 가이드입니다.",
                "MSN vs EOB": "오리지널 메디케어는 분기별 <strong>MSN(Medicare Summary Notice)</strong>을, 메디케어 어드밴티지는 진료 후 <strong>EOB(Explanation of Benefits)</strong>를 발송하며, 이는 '청구서(Bill)'가 아닙니다!",
                "이의신청(Appeal) 5단계 권리": "보험사가 치료비 지급을 거부(Denial)하더라도 환자는 연방법에 따라 5단계에 걸친 정식 재심 및 행정법원 청문회 권리를 갖습니다.",
                "신속 항소(Fast Appeal)": "입원 중인 병원에서 강제 퇴원 명령을 받았을 때 24시간 이내 즉각 퇴원을 중단시키는 응급 항소 제도 완비."
            },
            chart_info={
                "title": "메디케어 부당 거절(Denial) 이의신청 5단계 절차",
                "badge": "환자 권리 구제",
                "headers": ["단계 (Level)", "이의신청 기구", "신청 기한", "특징 및 처리 기간"],
                "rows": [
                    ["1단계: 재심 청구 (Redetermination)", "해당 메디케어 보험사/MAC", "거절 통지 후 120일 이내", "보험사 내부 재심사 (60일 소요)"],
                    ["2단계: 독립 검토 (Reconsideration)", "독립 심사 기구(QIC)", "1단계 기각 후 180일 이내", "제3자 독립 전문의 패널 재심사"],
                    ["3단계: 행정법원 판사 청문회 (ALJ)", "연방 행정법원 판사", "2단계 기각 후 60일 이내", "<span class='rc-chart-cell-highlight'>판사 앞 구두 변론 (환자 승소율 높음)</span>"],
                    ["4단계: 메디케어 항소 위원회 (MAC)", "Medicare Appeals Council", "3단계 기각 후 60일 이내", "서면 법리 심사"],
                    ["5단계: 연방 지방법원 소송", "Federal District Court", "4단계 기각 후 60일 이내", "최종 사법부 판결"]
                ],
                "footnote": "병원 강제 퇴원에 대한 신속 항소는 주정부 품질감독기구(Livanta QIO, 1-866-815-5440)로 즉시 전화해야 합니다."
            },
            sections=[
                {
                    "heading": "의료비 고지서 수령 시 3단계 확인 수칙",
                    "content": """
<ol class="rc-guide-list-num">
  <li><strong>'THIS IS NOT A BILL' 문구 확인:</strong> 상단에 청구서가 아니라는 표시가 있다면 병원에서 최종 정산 고지서가 올 때까지 절대 먼저 결제하지 마십시오.</li>
  <li><strong>중복 청구 대조:</strong> 동일한 날짜에 동일한 검사가 2번 청구되었는지 확인하십시오.</li>
  <li><strong>네트워크 내 진료 확인:</strong> 응급 상황에서 치료를 받은 경우 연방 깜짝 의료비 방지법(No Surprises Act)에 따라 네트워크 외(Out-of-Network) 바가지요금이 전액 금지됩니다.</li>
</ol>
"""
                }
            ],
            checklist=[
                {"doc": "의료비 거절 통지서(Notice of Denial)", "desc": "보험사가 거절 사유를 명시한 공식 서한."},
                {"doc": "주치의 의학적 소견서 (Letter of Medical Necessity)", "desc": "치료가 환자 생명과 회복에 필수적이었다는 의사 진술서."},
                {"doc": "관련 의무 기록 및 검사 결과지", "desc": "차트 복사본."}
            ],
            tips=[
                {"title": "퇴원 당일 즉시 Livanta에 신속 항소", "desc": "몸이 아직 아픈데 병원에서 나가라고 하면 퇴원 예정일 정오 이전에 Livanta QIO로 전화하여 항소하면 심사 기간 동안 퇴원이 무료로 보류됩니다."}
            ],
            contacts=[
                {"name": "Livanta QIO (뉴저지 환자 권익 항소)", "val": "1-866-815-5440"},
                {"name": "Medicare Rights Center", "val": "1-800-333-4114"}
            ]
        )
    })

    # art-55: Medigap
    articles.append({
        "id": "art-55",
        "slug": "medicare-medigap-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "메디갭(Medigap)",
        "excerpt": "오리지널 메디케어가 커버하지 않는 20% 본인 부담금과 디덕터블을 완벽히 메워주는 메디케어 보충보험(플랜 G, 플랜 N) 비교.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="메디케어 보충보험 (Medigap / Medicare Supplement - 20% 병원비 완벽 보전)",
            portal_key="medicare_compare",
            exec_summary={
                "정책 취지": "오리지널 메디케어(Parts A & B)는 병원비의 약 80%만 커버하고 <strong>본인부담금 20%에 대해 상한선(Out-of-Pocket Maximum)이 전혀 없습니다.</strong> 환자가 수억 원의 수술을 받으면 수천만 원의 본인부담금이 발생할 수 있는데, 이 20%를 전액 대신 납부해 주는 보험이 바로 메디갭(Medigap)입니다.",
                "가장 인기 있는 2대 플랜": "1) 플랜 G(Part B 디덕터블 $257 제외한 모든 병원비 100% 전액 커버), 2) 플랜 N(약간의 의사 코페이 $20 부담 대신 월 보험료 저렴).",
                "의사 선택의 절대적 자유": "네트워크 제한(HMO/PPO)이 전혀 없으며, <strong>미국 전역의 메디케어를 받는 모든 병원과 의사</strong>(메이요 클리닉, 슬론 케터링 암센터, 존스 홉킨스 등)를 사전 승인 없이 진료 가능.",
                "메디갭 오픈 인롤먼트(Medigap OEP) 6개월": "만 65세 이상이면서 파트 B가 시작된 달로부터 정확히 6개월 동안은 <span class='rc-chart-cell-highlight'>기저 질환이나 병력(암, 당뇨 등)과 무관하게 무조건 100% 무심사 가입 승인</span> 보장."
            },
            chart_info={
                "title": "뉴저지 가장 인기 있는 메디갭 플랜 G vs 플랜 N 보장 비교",
                "badge": "표준화된 연방 플랜",
                "headers": ["보장 영역", "오리지널 메디케어만 보유", "메디갭 플랜 G (Plan G)", "메디갭 플랜 N (Plan N)"],
                "rows": [
                    ["파트 A 입원 코페이 및 디덕터블", "환자가 수천 달러 부담", "<span class='rc-chart-badge rc-chart-badge-green'>100% 전액 대납 ($0)</span>", "<span class='rc-chart-badge rc-chart-badge-green'>100% 전액 대납 ($0)</span>"],
                    ["파트 B 의료비 20% 본인부담", "무제한 20% 환자 부담", "<span class='rc-chart-badge rc-chart-badge-green'>100% 전액 대납 ($0)</span>", "의사 방문당 최대 $20 코페이"],
                    ["파트 B 연간 디덕터블 ($257)", "환자 부담", "환자 부담 ($257 연 1회)", "환자 부담 ($257 연 1회)"],
                    ["파트 B 초과 청구액 (Excess Charge)", "환자 부담 가능", "<span class='rc-chart-badge rc-chart-badge-green'>100% 전액 커버</span>", "환자 부담"],
                    ["해외 응급 의료비 지원", "지원 없음 (0%)", "평생 $50,000 한도 80% 지원", "평생 $50,000 한도 80% 지원"]
                ],
                "footnote": "메디갭은 연방 표준화되어 있으므로 보험사 이름과 무관하게 플랜 G의 혜택 내용은 모든 보험사가 법적으로 100% 동일합니다."
            },
            sections=[
                {
                    "heading": "6개월 황금 가입 기간을 놓치면 발생하는 일",
                    "content": """
<p>파트 B 시작 후 6개월이 지나면 보험사는 <strong>병력 심사(Medical Underwriting)</strong>를 진행합니다. 과거 암, 뇌졸중, 당뇨 합병증, 심장 수술 이력이 있다면 가입을 거절하거나 보험료를 2~3배 폭등시킬 수 있으므로 65세 도래 시점에 가입하는 것이 필수입니다.</p>
"""
                }
            ],
            checklist=[
                {"doc": "메디케어 파트 A & B 카드", "desc": "파트 B 개시일이 적힌 카드 사본."},
                {"doc": "최근 6개월 이내 신청서", "desc": "무심사 보장 기간 입증."},
                {"doc": "자동이체 계좌 정보", "desc": "월 보험료 납부용 체킹 계좌."}
            ],
            tips=[
                {"title": "가장 저렴한 보험사를 선택", "desc": "플랜 G의 보장 내용은 Aetna, Mutual of Omaha, Cigna, Blue Cross 등 모든 회사가 법적으로 완벽히 동일하므로, 동일 플랜 G 중 월 보험료가 가장 저렴한 회사를 고르는 것이 정답입니다."}
            ],
            contacts=[
                {"name": "NJ Department of Banking and Insurance (DOBI)", "val": "1-800-446-7467"},
                {"name": "NJ SHIP 무료 플랜 비교", "val": "1-800-792-8820"}
            ]
        )
    })

    # art-56: Medicare Part C (Advantage)
    articles.append({
        "id": "art-56",
        "slug": "medicare-part-c-ko",
        "category_id": "legal-rights",
        "category_name": "권익 보호 & 법률·은퇴 설계",
        "title": "메디케어 파트 C (Medicare Advantage)",
        "excerpt": "월 보험료 $0에 처방약, 치과(임플란트), 안과, 한방 침술, 헬스장까지 하나로 묶은 올인원 메디케어 어드밴티지(HMO/PPO) 가이드.",
        "content_html": render_article_html(
            cat_title="권익 보호 & 법률·은퇴 설계",
            title="메디케어 파트 C 어드밴티지 (Medicare Advantage - 올인원 종합 플랜)",
            portal_key="medicare_compare",
            exec_summary={
                "정책 취지": "연방 정부의 승인을 받은 민간 건강보험사(UnitedHealthcare, Humana, Aetna, Horizon BCBS 등)가 오리지널 메디케어(A+B)를 대신하여 병원 진료, 처방약(Part D) 및 풍부한 부가 혜택을 단 하나의 카드로 묶어 제공하는 통합 보험입니다.",
                "파격적인 월 보험료 $0": "다수의 플랜이 추가 월 보험료 <span class='rc-chart-cell-highlight'>$0 (Zero Dollar Premium)</span>로 운영.",
                "오리지널에 없는 파격 부가 혜택": "종합 치과(스케일링, 틀니, 임플란트), 안경 및 시력 검사, 보청기, 한방 침술 치료, SilverSneakers 체육관 이용권, 월 $25~$100 상당의 OTC 생필품 지원.",
                "의료비 상한선(MOOP)": "오리지널과 달리 연간 본인부담금 상한선(Out-of-Pocket Maximum, 약 $3,900~$8,800)이 법적으로 설정되어 있어 재정적 파산을 방지."
            },
            chart_info={
                "title": "메디케어 어드밴티지 HMO vs PPO 네트워크 핵심 비교",
                "badge": "네트워크 유형별 분석",
                "headers": ["비교 항목", "HMO (건강관리기구)", "PPO (선호제공자기구)"],
                "rows": [
                    ["월 추가 보험료", "<span class='rc-chart-badge rc-chart-badge-green'>대부분 월 $0</span>", "월 $0 ~ $50 수준"],
                    ["주치의(PCP) 지정 의무", "필수 (주치의를 거쳐야 함)", "자율 (주치의 없이 전문의 방문 가능)"],
                    ["전문의 리퍼럴(Referral)", "필수 (주치의의 의뢰서 요구)", "<span class='rc-chart-badge rc-chart-badge-blue'>불필요 (리퍼럴 없이 직행)</span>"],
                    ["네트워크 외(Out-of-Network) 진료", "응급실 제외 원칙적 불가", "가능 (단, 본인 부담금 증가)"],
                    ["추천 대상", "정해진 한인 주치의를 주로 이용하는 분", "자유롭게 여러 전문의를 찾고자 하는 분"]
                ],
                "footnote": "버겐카운티 내 홀리네임 병원과 잉글우드 병원은 대다수 주요 메디케어 어드밴티지 플랜과 인네트워크(In-Network) 계약을 맺고 있습니다."
            },
            sections=[
                {
                    "heading": "어드밴티지 플랜 가입 전 반드시 확인할 2가지",
                    "content": """
<ol class="rc-guide-list-num">
  <li><strong>현재 다니는 의사 인네트워크 확인:</strong> 내과 주치의 및 정기적으로 다니는 안과, 심장내과 전문의가 해당 플랜을 받는지 사전 확인 필수.</li>
  <li><strong>복용 중인 처방약 포뮬러리(Tier) 확인:</strong> 내가 매일 먹는 고가 약이 1~2티어(저렴한 코페이)에 속해 있는지 Medicare.gov에서 대조해야 합니다.</li>
</ol>
"""
                }
            ],
            checklist=[
                {"doc": "메디케어 파트 A & B 가입 증명", "desc": "Original Medicare 번호."},
                {"doc": "주치의 성명 및 클리닉 정보", "desc": "HMO 가입 시 PCP 등록용."},
                {"doc": "복용 약품 목록", "desc": "정확한 영문 약물명 및 용량."}
            ],
            tips=[
                {"title": "매년 1월~3월 오픈 인롤먼트(OEP) 1회 변경 기회", "desc": "가을 AEP 때 선택한 플랜이 마음에 들지 않는 경우, 매년 1월 1일부터 3월 31일 사이에 다른 어드밴티지 플랜으로 바꾸거나 오리지널 메디케어로 되돌아갈 수 있습니다."}
            ],
            contacts=[
                {"name": "Medicare.gov 플랜 파인더", "val": "medicare.gov/plan-compare"},
                {"name": "NJ SHIP (카운티 무료 상담)", "val": "1-800-792-8820"}
            ]
        )
    })

    return articles

print("cat_legal_rights_part1.py loaded successfully.")
