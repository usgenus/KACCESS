<?php
/**
 * Healthcare Access Portal - Medical Forum Database Layer
 * Manages persistent JSON storage, Supabase synchronization,
 * 15 medical specialties, clinical threads, replies, and Google user profiles.
 */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/supabase.php';

define('PERSISTENT_FORUM_FILE', PERSISTENT_ROOT . '/forum.json');
define('LOCAL_FORUM_FILE', __DIR__ . '/../data/forum.json');

/**
 * Return default 15 medical specialties required by specification
 */
function forum_get_default_specialties(): array {
    return [
        [
            'id' => 'events',
            'slug' => 'events',
            'name_ko' => '이벤트',
            'name_en' => 'Events',
            'description' => '뉴저지 한인 의료접근센터 공식 이벤트, 세미나, 건강 강좌 및 공지',
            'icon' => 'fa-calendar-star',
            'color' => '#E11D48',
            'order' => 0,
            'isAdminOnly' => true
        ],
        [
            'id' => 'medical_billing',
            'slug' => 'medical-billing',
            'name_ko' => '의료비/빌링',
            'name_en' => 'Medical Bills & Billing',
            'description' => '미국 병원비 및 검사비 청구서(Bill), 분할 납부, 재정 지원 및 네고 상담',
            'icon' => 'fa-file-invoice-dollar',
            'color' => '#0284C7',
            'order' => 1
        ],
        [
            'id' => 'hospital_recommendation',
            'slug' => 'hospital-recommendation',
            'name_ko' => '병원 추천',
            'name_en' => 'Hospital Recommendations',
            'description' => '지역별 우수 한인 병의원, 종합병원, 전문 클리닉 추천 및 진료 경험 공유',
            'icon' => 'fa-hospital-user',
            'color' => '#059669',
            'order' => 2
        ],
        [
            'id' => 'health_insurance',
            'slug' => 'health-insurance',
            'name_ko' => '의료보험',
            'name_en' => 'Health Insurance',
            'description' => '메디케어, 메디케이드, 오바마케어(ACA) 및 직장 건강보험 가입·혜택 안내',
            'icon' => 'fa-shield-halved',
            'color' => '#4F46E5',
            'order' => 3
        ],
        [
            'id' => 'internal_medicine',
            'slug' => 'general-internal',
            'name_ko' => '내과 (일반·가정의학과)',
            'name_en' => 'Internal & Family Medicine',
            'description' => '성인 만성질환 종합관리, 정기 건강검진, 1차 진료 네비게이션',
            'icon' => 'fa-stethoscope',
            'color' => '#1E3A8A',
            'order' => 4
        ],
        [
            'id' => 'cardiology',
            'slug' => 'cardiology',
            'name_ko' => '순환기·심장내과',
            'name_en' => 'Cardiology',
            'description' => '고혈압, 관상동맥질환, 부정맥, 심부전 및 흉통 질환',
            'icon' => 'fa-heart-pulse',
            'color' => '#EF4444',
            'order' => 5
        ],
        [
            'id' => 'neurology',
            'slug' => 'neurology',
            'name_ko' => '신경과',
            'name_en' => 'Neurology',
            'description' => '뇌졸중, 치매, 두통, 어지럼증, 파킨슨병 및 말초신경',
            'icon' => 'fa-brain',
            'color' => '#8B5CF6',
            'order' => 6
        ],
        [
            'id' => 'oncology',
            'slug' => 'oncology',
            'name_ko' => '종양·암내과',
            'name_en' => 'Oncology',
            'description' => '암 예방, 조기 검진, 항암 치료 및 치료 후 회복 케어',
            'icon' => 'fa-ribbon',
            'color' => '#EC4899',
            'order' => 7
        ],
        [
            'id' => 'pediatrics',
            'slug' => 'pediatrics',
            'name_ko' => '소아청소년과',
            'name_en' => 'Pediatrics',
            'description' => '영유아 발달, 예방접종, 성장, 소아 알레르기 및 급성 질환',
            'icon' => 'fa-baby',
            'color' => '#3B82F6',
            'order' => 8
        ],
        [
            'id' => 'dermatology',
            'slug' => 'dermatology',
            'name_ko' => '피부과',
            'name_en' => 'Dermatology',
            'description' => '아토피, 습진, 건선, 색소질환, 피부 가려움 및 피부암',
            'icon' => 'fa-hand-dots',
            'color' => '#F59E0B',
            'order' => 9
        ],
        [
            'id' => 'orthopedics',
            'slug' => 'orthopedics',
            'name_ko' => '정형외과',
            'name_en' => 'Orthopedics',
            'description' => '퇴행성 관절염, 척추 디스크, 오십견, 골절 및 인대 손상',
            'icon' => 'fa-bone',
            'color' => '#10B981',
            'order' => 10
        ],
        [
            'id' => 'endocrinology',
            'slug' => 'endocrinology',
            'name_ko' => '내분비내과',
            'name_en' => 'Endocrinology',
            'description' => '당뇨병, 갑상선 질환, 골다공증, 비만 및 호르몬 이상',
            'icon' => 'fa-dna',
            'color' => '#06B6D4',
            'order' => 11
        ],
        [
            'id' => 'gastroenterology',
            'slug' => 'gastroenterology',
            'name_ko' => '소화기내과',
            'name_en' => 'Gastroenterology',
            'description' => '역류성 식도염, 위염, 위·대장 내시경 용종, 지방간, 췌장',
            'icon' => 'fa-virus-slash',
            'color' => '#14B8A6',
            'order' => 12
        ],
        [
            'id' => 'psychiatry',
            'slug' => 'psychiatry',
            'name_ko' => '정신건강의학과',
            'name_en' => 'Psychiatry',
            'description' => '불면증, 우울증, 불안장애, 공황장애 및 시니어 인지건강',
            'icon' => 'fa-head-side-virus',
            'color' => '#6366F1',
            'order' => 13
        ],
        [
            'id' => 'pulmonology',
            'slug' => 'pulmonology',
            'name_ko' => '호흡기내과',
            'name_en' => 'Pulmonology',
            'description' => '천식, COPD(만성폐쇄성폐질환), 만성 기침, 폐렴, 수면무호흡',
            'icon' => 'fa-lungs',
            'color' => '#0284C7',
            'order' => 14
        ],
        [
            'id' => 'immunology',
            'slug' => 'immunology',
            'name_ko' => '면역·감염내과',
            'name_en' => 'Immunology & Infectious Disease',
            'description' => '류마티스, 자가면역질환, 백신 접종, 바이러스/세균성 감염증',
            'icon' => 'fa-shield-virus',
            'color' => '#84CC16',
            'order' => 15
        ],
        [
            'id' => 'obgyn',
            'slug' => 'obgyn',
            'name_ko' => '산부인과',
            'name_en' => 'OB-GYN',
            'description' => '여성 정기검진, 갱년기 호르몬 치료, 자궁/난소 질환, 산전 관리',
            'icon' => 'fa-venus',
            'color' => '#F43F5E',
            'order' => 16
        ],
        [
            'id' => 'radiology',
            'slug' => 'radiology',
            'name_ko' => '영상의학과',
            'name_en' => 'Radiology',
            'description' => 'X-ray, CT, MRI, 초음파 영상 판독 해석 및 검사 가이드',
            'icon' => 'fa-radiation',
            'color' => '#64748B',
            'order' => 17
        ],
        [
            'id' => 'emergency',
            'slug' => 'emergency',
            'name_ko' => '응급의학과',
            'name_en' => 'Emergency Medicine',
            'description' => '응급실(ER) 방문 기준, 급성 흉통·호흡곤란, 긴급 대처 가이드',
            'icon' => 'fa-truck-medical',
            'color' => '#DC2626',
            'order' => 18
        ],
        [
            'id' => 'nursing_home',
            'slug' => 'nursing-home',
            'name_ko' => '요양원',
            'name_en' => 'Nursing Home / Long-Term Care',
            'description' => '너싱홈 입소 절차, 재활 간호, 메디케이드/메디케어 혜택 및 장기요양 돌봄',
            'icon' => 'fa-house-medical',
            'color' => '#059669',
            'order' => 19
        ],
        [
            'id' => 'hospice',
            'slug' => 'hospice',
            'name_ko' => '호스피스',
            'name_en' => 'Hospice & Palliative Care',
            'description' => '완화의료, 통증 조절, 가정 호스피스, 임종 돌봄 및 가족 심리 상담',
            'icon' => 'fa-hand-holding-heart',
            'color' => '#7C3AED',
            'order' => 20
        ]
    ];
}

/**
 * Return default starter discussions with verified clinician answers
 */
function forum_get_default_seed_data(): array {
    $specialties = forum_get_default_specialties();
    
    $users = [
        'u_clinician_cardio' => [
            'id' => 'u_clinician_cardio',
            'email' => 'cardio.doctor@njaccess.org',
            'name' => '박준형 전문의 (MD, FACC)',
            'avatar' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&q=80',
            'isVerifiedClinician' => true,
            'clinicianTitle' => '순환기내과 전문의 (Board Certified Cardiologist)',
            'isBanned' => false,
            'createdAt' => '2026-08-01T09:00:00Z',
            'lastActiveAt' => date('c')
        ],
        'u_clinician_endo' => [
            'id' => 'u_clinician_endo',
            'email' => 'endo.kim@njaccess.org',
            'name' => '김서연 전문의 (MD)',
            'avatar' => 'https://images.unsplash.com/photo-1594824813589-9304e2a8fa2e?w=150&q=80',
            'isVerifiedClinician' => true,
            'clinicianTitle' => '내분비내과 전문의 (Endocrinologist)',
            'isBanned' => false,
            'createdAt' => '2026-08-05T10:00:00Z',
            'lastActiveAt' => date('c')
        ],
        'u_clinician_neuro' => [
            'id' => 'u_clinician_neuro',
            'email' => 'neuro.lee@njaccess.org',
            'name' => '이민수 전문의 (MD, PhD)',
            'avatar' => 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&q=80',
            'isVerifiedClinician' => true,
            'clinicianTitle' => '신경과 전문의 (Neurologist)',
            'isBanned' => false,
            'createdAt' => '2026-08-10T11:00:00Z',
            'lastActiveAt' => date('c')
        ],
        'u_patient_1' => [
            'id' => 'u_patient_1',
            'email' => 'korean.senior@gmail.com',
            'name' => '포트리 시니어 회원',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
            'isVerifiedClinician' => false,
            'clinicianTitle' => null,
            'isBanned' => false,
            'createdAt' => '2026-08-12T14:20:00Z',
            'lastActiveAt' => date('c')
        ],
        'u_patient_2' => [
            'id' => 'u_patient_2',
            'email' => 'njmom2026@gmail.com',
            'name' => '뉴저지 워킹맘',
            'avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
            'isVerifiedClinician' => false,
            'clinicianTitle' => null,
            'isBanned' => false,
            'createdAt' => '2026-08-15T18:40:00Z',
            'lastActiveAt' => date('c')
        ]
    ];

    $questions = [
        'q_cardio_1' => [
            'id' => 'q_cardio_1',
            'title' => '혈압약을 아침에 먹어야 할까요, 저녁에 먹는 것이 더 심혈관 예방에 좋을까요?',
            'body' => "60대 후반 남성입니다. 3년 전부터 암로디핀과 발사르탄 복합 혈압약을 처방받아 아침 기상 직후 복용해왔습니다.\n최근 새벽에 잰 혈압이 145/90 정도로 약간 높게 측정되는 날이 있어 복용 시간을 저녁 식후나 취침 전으로 바꾸는 것이 안전한지 궁금합니다. 시간에 따른 약효 차이가 있나요?",
            'specialtyId' => 'cardiology',
            'authorId' => 'u_patient_1',
            'authorName' => '포트리 시니어 회원',
            'authorAvatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
            'authorBadge' => null,
            'viewCount' => 342,
            'replyCount' => 1,
            'status' => 'active',
            'tags' => ['혈압약', '고혈압', '복용시간', '새벽고혈압'],
            'createdAt' => '2026-08-20T10:15:00Z',
            'updatedAt' => '2026-08-20T10:15:00Z'
        ],
        'q_endo_1' => [
            'id' => 'q_endo_1',
            'title' => '공복 혈당은 105인데 당화혈색소(HbA1c)가 6.4%로 나왔습니다. 당뇨 전단계 관리법 문의드립니다.',
            'body' => "정기 건강검진 결과 공복 혈당은 105 mg/dL로 정상보다 아주 살짝 높았는데, 당화혈색소가 6.4%로 당뇨 전단계(Pre-diabetes) 상한선에 도달했습니다.\n의사선생님께서 식단 조절과 체중 감량을 권하셨는데, 메트포르민 같은 약물 복용을 지금부터 시작해야 하는지, 생활습관 개선만으로 수치를 되돌릴 수 있는지 궁금합니다.",
            'specialtyId' => 'endocrinology',
            'authorId' => 'u_patient_2',
            'authorName' => '뉴저지 워킹맘',
            'authorAvatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
            'authorBadge' => null,
            'viewCount' => 285,
            'replyCount' => 1,
            'status' => 'active',
            'tags' => ['당화혈색소', '당뇨전단계', '공복혈당', '식단관리'],
            'createdAt' => '2026-08-22T14:30:00Z',
            'updatedAt' => '2026-08-22T14:30:00Z'
        ],
        'q_neuro_1' => [
            'id' => 'q_neuro_1',
            'title' => '어머니(75세)께서 최근 깜빡임이 잦아지셨는데 단순 건망증과 초기 치매(MCI)를 어떻게 구분하나요?',
            'body' => "최근 며칠 전 일이나 약속 날짜를 잊어버리시고 힌트를 주면 기억해내시긴 합니다. 길 찾기나 일상적인 가사 활동은 정상적이십니다.\n병원 신경과에서 어떤 인지기능 검사를 받아보는 것이 좋은지, 한어 통역 서비스가 가능한 검사 경로가 있는지 알고 싶습니다.",
            'specialtyId' => 'neurology',
            'authorId' => 'u_patient_2',
            'authorName' => '뉴저지 워킹맘',
            'authorAvatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
            'authorBadge' => null,
            'viewCount' => 418,
            'replyCount' => 1,
            'status' => 'active',
            'tags' => ['치매예방', '경도인지장애', '신경과검사', '시니어헬스'],
            'createdAt' => '2026-08-25T09:40:00Z',
            'updatedAt' => '2026-08-25T09:40:00Z'
        ]
    ];

    $answers = [
        'a_cardio_1' => [
            'id' => 'a_cardio_1',
            'questionId' => 'q_cardio_1',
            'authorId' => 'u_clinician_cardio',
            'authorName' => '박준형 전문의 (MD, FACC)',
            'authorAvatar' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&q=80',
            'authorBadge' => 'Verified Clinician',
            'body' => "안녕하세요, 순환기내과 전문의 박준형입니다.\n\n매우 좋은 질문입니다. 최근 대규모 임상 연구(TIME Study 등)에 따르면 혈압약을 아침에 복용하든 저녁에 복용하든 전반적인 심혈관 질환 발생률에는 큰 차이가 없다고 밝혀졌습니다.\n\n다만, 질문자님처럼 '새벽 및 기상 직후 혈압(Morning Surge)'이 140/90 mmHg 이상으로 치솟는 양상을 보이신다면:\n1. 24시간 혈압 모니터링(ABPM)이나 가정 혈압 일지를 1~2주간 아침/취침 전 기록하여 주치의에게 보여주시는 것이 가장 안전합니다.\n2. 암로디핀은 반감기가 30~50시간으로 매우 긴 약제이나, 발사르탄의 경우 저녁에 추가 분할하거나 복용 시간을 오후로 옮기는 방안을 주치의와 상의하실 수 있습니다.\n\n※ 임의로 복용 시간을 변경하기 전에 담당 의사와의 상담을 권장합니다.",
            'upvotes' => 18,
            'upvotedBy' => ['u_patient_1', 'u_patient_2'],
            'status' => 'active',
            'createdAt' => '2026-08-20T11:05:00Z',
            'updatedAt' => '2026-08-20T11:05:00Z'
        ],
        'a_endo_1' => [
            'id' => 'a_endo_1',
            'questionId' => 'q_endo_1',
            'authorId' => 'u_clinician_endo',
            'authorName' => '김서연 전문의 (MD)',
            'authorAvatar' => 'https://images.unsplash.com/photo-1594824813589-9304e2a8fa2e?w=150&q=80',
            'authorBadge' => 'Verified Clinician',
            'body' => "안녕하세요, 내분비내과 김서연 전문의입니다.\n\n당화혈색소 6.4%는 당뇨 전단계(5.7%~6.4%)의 최상단 수치로, 적극적인 생활습관 교정이 즉시 요구되는 중요한 시점입니다.\n\n미국 당뇨병학회(ADA) 가이드라인에 따르면:\n1. 체중의 5~7% 감량 (예: 70kg 기준 3.5~5kg 감량)과 주당 최소 150분 이상의 중강도 유산소 운동(빠르게 걷기 등)을 병행하면 2형 당뇨로의 진행 위험을 58% 이상 감소시킬 수 있습니다.\n2. 탄수화물(백미, 밀가루, 당분 음료) 섭취를 줄이고 식이섬유와 단백질 위주로 식사 순서를 바꾸는 '식후 혈당 스파이크 방지'가 핵심입니다.\n3. BMI 35 이상이거나 60세 미만 고위험군에서는 예방적 메트포르민 복용이 고려되기도 하므로, 3개월 후 재검사 결과를 바탕으로 주치의와 약물 시작 여부를 결정하시길 권장합니다.",
            'upvotes' => 14,
            'upvotedBy' => ['u_patient_1'],
            'status' => 'active',
            'createdAt' => '2026-08-22T15:20:00Z',
            'updatedAt' => '2026-08-22T15:20:00Z'
        ],
        'a_neuro_1' => [
            'id' => 'a_neuro_1',
            'questionId' => 'q_neuro_1',
            'authorId' => 'u_clinician_neuro',
            'authorName' => '이민수 전문의 (MD, PhD)',
            'authorAvatar' => 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&q=80',
            'authorBadge' => 'Verified Clinician',
            'body' => "안녕하세요, 신경과 이민수 전문의입니다.\n\n단순 노화성 건망증과 경도인지장애(MCI)의 가장 큰 차이점은 '힌트를 주었을 때 회상할 수 있는가'와 '사건 자체를 잊어버리는가'입니다.\n\n- 단순 건망증: 약속 시간이나 이름을 깜빡했더라도 힌트를 주거나 시간이 지나면 스스로 기억해냅니다.\n- 경도인지장애/초기 치매: 힌트를 주어도 사건 자체를 경험한 사실 자체를 기억하지 못하는 경우가 빈번합니다.\n\n질문자님의 어머니께서는 힌트를 드리면 기억하신다니 다행이지만, MoCA(몬트리올 인지평가) 또는 MMSE 선별검사와 뇌 MRI, 비타민 B12 및 갑상선 기능 혈액검사를 받아보시는 것이 안전합니다.\n뉴저지 의료접근센터(NJAP)를 통해 한국어 의료통역 지원이 가능한 병원 신경과 진료 예약 안내를 받으실 수 있습니다.",
            'upvotes' => 22,
            'upvotedBy' => ['u_patient_1', 'u_patient_2'],
            'status' => 'active',
            'createdAt' => '2026-08-25T11:00:00Z',
            'updatedAt' => '2026-08-25T11:00:00Z'
        ]
    ];

    $doctorEmails = [
        'cardio.doctor@njaccess.org' => [
            'email' => 'cardio.doctor@njaccess.org',
            'title' => '순환기내과 전문의 (MD, FACC)',
            'addedAt' => '2026-08-01T00:00:00Z'
        ],
        'endo.kim@njaccess.org' => [
            'email' => 'endo.kim@njaccess.org',
            'title' => '내분비내과 전문의 (MD)',
            'addedAt' => '2026-08-05T00:00:00Z'
        ],
        'neuro.lee@njaccess.org' => [
            'email' => 'neuro.lee@njaccess.org',
            'title' => '신경과 전문의 (MD, PhD)',
            'addedAt' => '2026-08-10T00:00:00Z'
        ]
    ];

    return [
        'specialties' => $specialties,
        'users' => $users,
        'questions' => $questions,
        'answers' => $answers,
        'doctor_emails' => $doctorEmails
    ];
}

/**
 * Retrieve forum database data from persistent storage or local mirror
 */
function get_forum_data(): array {
    // 1. If persistent storage file exists, read it
    if (file_exists(PERSISTENT_FORUM_FILE)) {
        clearstatcache(true, PERSISTENT_FORUM_FILE);
        $content = @file_get_contents(PERSISTENT_FORUM_FILE);
        if ($content) {
            $data = json_decode($content, true);
            if (is_array($data) && !empty($data['specialties'])) {
                if (empty($data['doctor_emails'])) {
                    $data['doctor_emails'] = [
                        'cardio.doctor@njaccess.org' => ['email' => 'cardio.doctor@njaccess.org', 'title' => '순환기내과 전문의 (MD, FACC)', 'addedAt' => '2026-08-01T00:00:00Z'],
                        'endo.kim@njaccess.org' => ['email' => 'endo.kim@njaccess.org', 'title' => '내분비내과 전문의 (MD)', 'addedAt' => '2026-08-05T00:00:00Z'],
                        'neuro.lee@njaccess.org' => ['email' => 'neuro.lee@njaccess.org', 'title' => '신경과 전문의 (MD, PhD)', 'addedAt' => '2026-08-10T00:00:00Z']
                    ];
                }
                // Keep local mirror updated
                if (!file_exists(LOCAL_FORUM_FILE) || filesize(LOCAL_FORUM_FILE) !== strlen($content)) {
                    $dir = dirname(LOCAL_FORUM_FILE);
                    if (!is_dir($dir)) { @mkdir($dir, 0777, true); @chmod($dir, 0777); }
                    @file_put_contents(LOCAL_FORUM_FILE, $content, LOCK_EX);
                }
                return $data;
            }
        }
    }

    // 2. If local mirror exists, read it
    if (file_exists(LOCAL_FORUM_FILE)) {
        clearstatcache(true, LOCAL_FORUM_FILE);
        $content = @file_get_contents(LOCAL_FORUM_FILE);
        if ($content) {
            $data = json_decode($content, true);
            if (is_array($data) && !empty($data['specialties'])) {
                if (empty($data['doctor_emails'])) {
                    $data['doctor_emails'] = [
                        'cardio.doctor@njaccess.org' => ['email' => 'cardio.doctor@njaccess.org', 'title' => '순환기내과 전문의 (MD, FACC)', 'addedAt' => '2026-08-01T00:00:00Z'],
                        'endo.kim@njaccess.org' => ['email' => 'endo.kim@njaccess.org', 'title' => '내분비내과 전문의 (MD)', 'addedAt' => '2026-08-05T00:00:00Z'],
                        'neuro.lee@njaccess.org' => ['email' => 'neuro.lee@njaccess.org', 'title' => '신경과 전문의 (MD, PhD)', 'addedAt' => '2026-08-10T00:00:00Z']
                    ];
                }
                return $data;
            }
        }
    }

    // 3. Initialize with seed data and persist
    $seed = forum_get_default_seed_data();
    save_forum_data($seed);
    return $seed;
}

/**
 * Save forum database data to persistent file and local mirror
 */
function save_forum_data(array $data): bool {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    // 1. Persistent storage outside public_html
    $pDir = dirname(PERSISTENT_FORUM_FILE);
    if (!is_dir($pDir)) { @mkdir($pDir, 0777, true); @chmod($pDir, 0777); }
    @file_put_contents(PERSISTENT_FORUM_FILE, $json, LOCK_EX);
    @chmod(PERSISTENT_FORUM_FILE, 0666);
    clearstatcache(true, PERSISTENT_FORUM_FILE);

    // 2. Local mirror
    $lDir = dirname(LOCAL_FORUM_FILE);
    if (!is_dir($lDir)) { @mkdir($lDir, 0777, true); @chmod($lDir, 0777); }
    $res = @file_put_contents(LOCAL_FORUM_FILE, $json, LOCK_EX) !== false;
    @chmod(LOCAL_FORUM_FILE, 0666);
    clearstatcache(true, LOCAL_FORUM_FILE);

    return $res;
}

/**
 * Get all 15 medical specialties with live thread and answer counts
 */
function forum_get_specialties(): array {
    $data = get_forum_data();
    $specialties = $data['specialties'] ?? forum_get_default_specialties();
    $questions = $data['questions'] ?? [];

    // Ensure all default specialties exist and sync orders & names
    $defaults = forum_get_default_specialties();
    $existingMap = [];
    foreach ($specialties as $s) {
        $existingMap[$s['id']] = $s;
    }

    $merged = [];
    $needsSave = false;
    foreach ($defaults as $def) {
        $id = $def['id'];
        if (isset($existingMap[$id])) {
            $sp = array_merge($existingMap[$id], $def);
            if (($existingMap[$id]['order'] ?? null) !== $def['order'] || ($existingMap[$id]['name_ko'] ?? '') !== $def['name_ko']) {
                $needsSave = true;
            }
        } else {
            $sp = $def;
            $needsSave = true;
        }
        $merged[$id] = $sp;
    }

    // Retain any custom specialties if created
    foreach ($existingMap as $id => $sp) {
        if (!isset($merged[$id])) {
            $merged[$id] = $sp;
        }
    }
    $specialties = array_values($merged);

    if ($needsSave && !empty($data)) {
        $data['specialties'] = $specialties;
        save_forum_data($data);
    }

    $counts = [];
    foreach ($questions as $q) {
        if (($q['status'] ?? 'active') === 'active') {
            $sId = $q['specialtyId'] ?? '';
            $counts[$sId] = ($counts[$sId] ?? 0) + 1;
        }
    }

    foreach ($specialties as &$s) {
        $s['questionCount'] = $counts[$s['id']] ?? 0;
    }
    unset($s);

    usort($specialties, fn($a, $b) => ($a['order'] ?? 0) <=> ($b['order'] ?? 0));
    return $specialties;
}

/**
 * Query questions with filtering, search, and sorting
 */
function forum_get_questions($specialty = '', $sort = 'latest', $search = '', $status = 'active'): array {
    $data = get_forum_data();
    $questions = array_values($data['questions'] ?? []);
    $specialtiesMap = [];
    foreach (($data['specialties'] ?? []) as $s) {
        $specialtiesMap[$s['id']] = $s;
    }

    // Filter by status (unless 'all' requested by moderator)
    if ($status !== 'all') {
        $questions = array_filter($questions, fn($q) => ($q['status'] ?? 'active') === $status);
    }

    // Filter by specialty
    if (!empty($specialty) && $specialty !== 'all') {
        $questions = array_filter($questions, function($q) use ($specialty) {
            return ($q['specialtyId'] ?? '') === $specialty || ($q['specialtySlug'] ?? '') === $specialty;
        });
    }

    // Filter by search query
    if (!empty($search)) {
        $qLower = mb_strtolower(trim($search));
        $questions = array_filter($questions, function($q) use ($qLower) {
            $t = mb_strtolower($q['title'] ?? '');
            $b = mb_strtolower($q['body'] ?? '');
            $a = mb_strtolower($q['authorName'] ?? '');
            return str_contains($t, $qLower) || str_contains($b, $qLower) || str_contains($a, $qLower);
        });
    }

    // Augment with specialty info, participants, and clinician answers
    $answers = $data['answers'] ?? [];
    foreach ($questions as &$q) {
        $sInfo = $specialtiesMap[$q['specialtyId'] ?? ''] ?? null;
        $q['specialty'] = $sInfo;
        
        // Count answers and check for clinician answer
        $qAnswers = array_values(array_filter($answers, fn($a) => ($a['questionId'] ?? '') === $q['id'] && ($a['status'] ?? 'active') === 'active'));
        $q['replyCount'] = count($qAnswers);
        
        // Participants avatar list (Author first, then commenters up to 5)
        $participants = [];
        $seenAvatars = [];
        $defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80';
        $authorAv = !empty($q['authorAvatar']) ? $q['authorAvatar'] : $defaultAvatar;
        $participants[] = [
            'name' => $q['authorName'] ?? '작성자',
            'avatar' => $authorAv,
            'isClinician' => !empty($q['authorBadge'])
        ];
        $seenAvatars[$authorAv] = true;

        $hasClinician = !empty($q['authorBadge']) && str_contains($q['authorBadge'], 'Clinician');
        $latestTime = $q['createdAt'] ?? date('c');

        foreach ($qAnswers as $ans) {
            if (!empty($ans['authorBadge']) && str_contains($ans['authorBadge'], 'Clinician')) {
                $hasClinician = true;
            }
            if (!empty($ans['createdAt']) && strcmp($ans['createdAt'], $latestTime) > 0) {
                $latestTime = $ans['createdAt'];
            }
            $ansAv = !empty($ans['authorAvatar']) ? $ans['authorAvatar'] : $defaultAvatar;
            if (empty($seenAvatars[$ansAv]) && count($participants) < 5) {
                $seenAvatars[$ansAv] = true;
                $participants[] = [
                    'name' => $ans['authorName'] ?? '답변자',
                    'avatar' => $ansAv,
                    'isClinician' => !empty($ans['authorBadge']) && str_contains($ans['authorBadge'], 'Clinician')
                ];
            }
        }
        $q['hasClinicianAnswer'] = $hasClinician;
        $q['participants'] = $participants;
        $q['latestActivityAt'] = $latestTime;
    }
    unset($q);

    // Filter by verified if requested
    if ($sort === 'verified') {
        $questions = array_filter($questions, fn($q) => !empty($q['hasClinicianAnswer']));
        usort($questions, fn($a, $b) => strcmp($b['latestActivityAt'] ?? '', $a['latestActivityAt'] ?? ''));
    } elseif ($sort === 'trending' || $sort === 'popular' || $sort === 'hot') {
        usort($questions, fn($a, $b) => (($b['viewCount'] ?? 0) + ($b['replyCount'] ?? 0) * 8) <=> (($a['viewCount'] ?? 0) + ($a['replyCount'] ?? 0) * 8));
    } elseif ($sort === 'unanswered') {
        $questions = array_filter($questions, fn($q) => ($q['replyCount'] ?? 0) === 0);
        usort($questions, fn($a, $b) => strcmp($b['createdAt'] ?? '', $a['createdAt'] ?? ''));
    } else {
        // latest activity
        usort($questions, fn($a, $b) => strcmp($b['latestActivityAt'] ?? $b['createdAt'] ?? '', $a['latestActivityAt'] ?? $a['createdAt'] ?? ''));
    }

    return array_values($questions);
}

/**
 * Get question by ID and its answers
 */
function forum_get_question(string $id, bool $incrementView = true): ?array {
    $data = get_forum_data();
    if (empty($data['questions'][$id])) {
        return null;
    }

    if ($incrementView) {
        $data['questions'][$id]['viewCount'] = ($data['questions'][$id]['viewCount'] ?? 0) + 1;
        save_forum_data($data);
    }

    $q = $data['questions'][$id];
    $specialtiesMap = [];
    foreach (($data['specialties'] ?? []) as $s) {
        $specialtiesMap[$s['id']] = $s;
    }
    $q['specialty'] = $specialtiesMap[$q['specialtyId'] ?? ''] ?? null;

    // Get answers
    $answers = [];
    foreach (($data['answers'] ?? []) as $a) {
        if (($a['questionId'] ?? '') === $id) {
            $answers[] = $a;
        }
    }
    usort($answers, fn($a, $b) => strcmp($a['createdAt'] ?? '', $b['createdAt'] ?? ''));
    $q['answers'] = array_values($answers);
    $q['replyCount'] = count($answers);

    return $q;
}

/**
 * Add a new question (supports custom author name/nickname)
 */
function forum_add_question(string $title, string $body, string $specialtyId, array $user, ?string $customAuthorName = null, array $images = []): array {
    $data = get_forum_data();
    $id = 'q_' . bin2hex(random_bytes(6));
    $now = date('c');

    $isClinician = !empty($user['isVerifiedClinician']);
    $authorName = trim($customAuthorName ?? '') ?: ($user['name'] ?? '익명 사용자');

    // If author customized their name, persist to their profile as well
    if (!empty($customAuthorName) && isset($data['users'][$user['id']])) {
        $data['users'][$user['id']]['name'] = $authorName;
    }

    // Clean image URLs array
    $cleanImages = [];
    foreach ($images as $img) {
        if (is_string($img) && trim($img) !== '') {
            $cleanImages[] = trim($img);
        }
    }

    $newQ = [
        'id' => $id,
        'title' => trim($title),
        'body' => trim($body),
        'specialtyId' => $specialtyId,
        'authorId' => $user['id'],
        'authorName' => $authorName,
        'authorAvatar' => $user['avatar'] ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
        'authorBadge' => $isClinician ? 'Verified Clinician' : null,
        'images' => $cleanImages,
        'viewCount' => 0,
        'replyCount' => 0,
        'status' => 'active',
        'tags' => [],
        'createdAt' => $now,
        'updatedAt' => $now
    ];

    $data['questions'][$id] = $newQ;
    save_forum_data($data);
    return $newQ;
}

/**
 * Add a reply/answer to a question (supports custom author name/nickname)
 */
function forum_add_answer(string $questionId, string $body, array $user, ?string $customAuthorName = null, array $images = []): ?array {
    $data = get_forum_data();
    if (empty($data['questions'][$questionId])) {
        return null;
    }

    $id = 'a_' . bin2hex(random_bytes(6));
    $now = date('c');
    $isClinician = !empty($user['isVerifiedClinician']);
    $authorName = trim($customAuthorName ?? '') ?: ($user['name'] ?? '사용자');

    // If author customized their name, persist to their profile as well
    if (!empty($customAuthorName) && isset($data['users'][$user['id']])) {
        $data['users'][$user['id']]['name'] = $authorName;
    }

    // Clean image URLs array
    $cleanImages = [];
    foreach ($images as $img) {
        if (is_string($img) && trim($img) !== '') {
            $cleanImages[] = trim($img);
        }
    }

    $newA = [
        'id' => $id,
        'questionId' => $questionId,
        'authorId' => $user['id'],
        'authorName' => $authorName,
        'authorAvatar' => $user['avatar'] ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
        'authorBadge' => $isClinician ? 'Verified Clinician' : null,
        'body' => trim($body),
        'images' => $cleanImages,
        'upvotes' => 0,
        'upvotedBy' => [],
        'status' => 'active',
        'createdAt' => $now,
        'updatedAt' => $now
    ];

    $data['answers'][$id] = $newA;
    $data['questions'][$questionId]['replyCount'] = ($data['questions'][$questionId]['replyCount'] ?? 0) + 1;
    $data['questions'][$questionId]['updatedAt'] = $now;

    save_forum_data($data);

    // Trigger email notification to question author (if someone else replied)
    $question = $data['questions'][$questionId] ?? null;
    if ($question && !empty($question['authorId']) && $question['authorId'] !== $user['id']) {
        $recipient = $data['users'][$question['authorId']] ?? null;
        if ($recipient && !empty($recipient['email'])) {
            forum_send_reply_notification_email($question, $newA, $user, $recipient);
        }
    }

    return $newA;
}

/**
 * Toggle upvote on an answer
 */
function forum_toggle_upvote(string $answerId, string $userId): array {
    $data = get_forum_data();
    if (empty($data['answers'][$answerId])) {
        return ['success' => false, 'error' => '답변을 찾을 수 없습니다.'];
    }

    $ans = &$data['answers'][$answerId];
    $upvotedBy = $ans['upvotedBy'] ?? [];

    $idx = array_search($userId, $upvotedBy);
    if ($idx !== false) {
        // Remove upvote
        array_splice($upvotedBy, $idx, 1);
        $hasUpvoted = false;
    } else {
        // Add upvote
        $upvotedBy[] = $userId;
        $hasUpvoted = true;
    }

    $ans['upvotedBy'] = array_values($upvotedBy);
    $ans['upvotes'] = count($ans['upvotedBy']);
    save_forum_data($data);

    return [
        'success' => true,
        'upvotes' => $ans['upvotes'],
        'hasUpvoted' => $hasUpvoted
    ];
}

/**
 * Get registered doctor Gmail list
 */
function forum_get_doctor_emails(): array {
    $data = get_forum_data();
    return array_values($data['doctor_emails'] ?? []);
}

/**
 * Add a doctor Gmail to grant verified doctor badge automatically
 */
function forum_add_doctor_email(string $email, string $title = '전문의 (MD)'): bool {
    $data = get_forum_data();
    $email = strtolower(trim($email));
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) return false;

    if (!isset($data['doctor_emails']) || !is_array($data['doctor_emails'])) {
        $data['doctor_emails'] = [];
    }

    $title = trim($title) ?: '전문의 (MD)';
    $data['doctor_emails'][$email] = [
        'email' => $email,
        'title' => $title,
        'addedAt' => date('c')
    ];

    // If an existing user matches this email, grant badge immediately!
    foreach ($data['users'] as $uId => $u) {
        if (strtolower($u['email'] ?? '') === $email) {
            $data['users'][$uId]['isVerifiedClinician'] = true;
            $data['users'][$uId]['clinicianTitle'] = $title;
        }
    }

    // Propagate to their posts and answers
    $badge = 'Verified Clinician';
    foreach ($data['questions'] as $qId => $q) {
        $author = $data['users'][$q['authorId'] ?? ''] ?? null;
        if ($author && strtolower($author['email'] ?? '') === $email) {
            $data['questions'][$qId]['authorBadge'] = $badge;
        }
    }
    foreach ($data['answers'] as $aId => $a) {
        $author = $data['users'][$a['authorId'] ?? ''] ?? null;
        if ($author && strtolower($author['email'] ?? '') === $email) {
            $data['answers'][$aId]['authorBadge'] = $badge;
        }
    }

    return save_forum_data($data);
}

/**
 * Remove a doctor Gmail from verified doctor list
 */
function forum_remove_doctor_email(string $email): bool {
    $data = get_forum_data();
    $email = strtolower(trim($email));
    if (isset($data['doctor_emails'][$email])) {
        unset($data['doctor_emails'][$email]);
    }

    // Remove clinician status from matching user
    foreach ($data['users'] as $uId => $u) {
        if (strtolower($u['email'] ?? '') === $email) {
            $data['users'][$uId]['isVerifiedClinician'] = false;
            $data['users'][$uId]['clinicianTitle'] = null;
        }
    }

    return save_forum_data($data);
}

/**
 * Update user display name / nickname
 */
function forum_update_user_name(string $userId, string $newName): bool {
    $data = get_forum_data();
    if (!isset($data['users'][$userId])) return false;

    $newName = trim($newName);
    if (empty($newName)) return false;

    $data['users'][$userId]['name'] = $newName;

    return save_forum_data($data);
}

/**
 * Upsert Google user profile & automatically grant Doctor badge if email matches doctor_emails
 */
function forum_upsert_user(array $profile): array {
    $data = get_forum_data();
    $email = strtolower(trim($profile['email'] ?? ''));

    // Check if user's email is in doctor_emails
    $doctorEmails = $data['doctor_emails'] ?? [];
    $isDoctor = !empty($email) && isset($doctorEmails[$email]);
    $docTitle = $isDoctor ? ($doctorEmails[$email]['title'] ?? '전문의 (MD)') : null;

    // Find if user already exists by email OR by explicit profile id
    $foundUserId = null;
    if (!empty($email)) {
        foreach ($data['users'] as $k => $u) {
            if (strtolower($u['email'] ?? '') === $email) {
                $foundUserId = $k;
                break;
            }
        }
    }
    if (!$foundUserId && !empty($profile['id']) && isset($data['users'][$profile['id']])) {
        $foundUserId = $profile['id'];
    }

    if ($foundUserId) {
        $existing = $data['users'][$foundUserId];
        $existing['id'] = $foundUserId; // ensure ID always matches the array key!
        if (!empty($profile['name'])) $existing['name'] = $profile['name'];
        if (!empty($profile['avatar'])) $existing['avatar'] = $profile['avatar'];
        if (!empty($email)) $existing['email'] = $email;
        if ($isDoctor) {
            $existing['isVerifiedClinician'] = true;
            if (!empty($docTitle)) $existing['clinicianTitle'] = $docTitle;
        }
        $existing['lastActiveAt'] = date('c');
        $data['users'][$foundUserId] = $existing;
        save_forum_data($data);
        return $data['users'][$foundUserId];
    }

    // New user creation
    $userId = $profile['id'] ?? ('u_' . substr(md5($email ?: microtime()), 0, 10));
    $newUser = [
        'id' => $userId,
        'email' => $email,
        'name' => $profile['name'] ?? '회원',
        'avatar' => $profile['avatar'] ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
        'isVerifiedClinician' => $isDoctor,
        'clinicianTitle' => $docTitle,
        'isBanned' => false,
        'createdAt' => date('c'),
        'lastActiveAt' => date('c')
    ];

    $data['users'][$userId] = $newUser;
    save_forum_data($data);
    return $newUser;
}

/**
 * Get user by ID
 */
function forum_get_user(string $userId): ?array {
    $data = get_forum_data();
    return $data['users'][$userId] ?? null;
}

/**
 * Moderator: Toggle Verified Clinician badge
 */
function forum_toggle_user_badge(string $userId, bool $isVerified, string $title = ''): bool {
    $data = get_forum_data();
    if (!isset($data['users'][$userId])) return false;

    $data['users'][$userId]['isVerifiedClinician'] = $isVerified;
    if ($isVerified && !empty($title)) {
        $data['users'][$userId]['clinicianTitle'] = $title;
    } elseif (!$isVerified) {
        $data['users'][$userId]['clinicianTitle'] = null;
    }

    // Propagate badge to user's questions and answers
    $badge = $isVerified ? 'Verified Clinician' : null;
    foreach ($data['questions'] as $qId => $q) {
        if (($q['authorId'] ?? '') === $userId) {
            $data['questions'][$qId]['authorBadge'] = $badge;
        }
    }
    foreach ($data['answers'] as $aId => $a) {
        if (($a['authorId'] ?? '') === $userId) {
            $data['answers'][$aId]['authorBadge'] = $badge;
        }
    }

    return save_forum_data($data);
}

/**
 * Moderator: Ban or unban a user
 */
function forum_toggle_user_ban(string $userId, bool $isBanned): bool {
    $data = get_forum_data();
    if (!isset($data['users'][$userId])) return false;

    $data['users'][$userId]['isBanned'] = $isBanned;
    return save_forum_data($data);
}

/**
 * Moderator: Toggle question status ('active', 'hidden', 'flagged')
 */
function forum_moderate_question(string $questionId, string $status): bool {
    $data = get_forum_data();
    if (!isset($data['questions'][$questionId])) return false;

    $data['questions'][$questionId]['status'] = $status;
    $data['questions'][$questionId]['updatedAt'] = date('c');
    return save_forum_data($data);
}

/**
 * Moderator: Toggle answer status ('active', 'hidden', 'flagged')
 */
function forum_moderate_answer(string $answerId, string $status): bool {
    $data = get_forum_data();
    if (!isset($data['answers'][$answerId])) return false;

    $data['answers'][$answerId]['status'] = $status;
    $data['answers'][$answerId]['updatedAt'] = date('c');
    return save_forum_data($data);
}

/**
 * Moderator: Delete question
 */
function forum_delete_question(string $questionId): bool {
    $data = get_forum_data();
    if (!isset($data['questions'][$questionId])) return false;

    unset($data['questions'][$questionId]);

    // Delete associated answers
    foreach ($data['answers'] as $aId => $ans) {
        if (($ans['questionId'] ?? '') === $questionId) {
            unset($data['answers'][$aId]);
        }
    }

    return save_forum_data($data);
}

/**
 * Moderator: Delete answer
 */
function forum_delete_answer(string $answerId): bool {
    $data = get_forum_data();
    if (!isset($data['answers'][$answerId])) return false;

    $qId = $data['answers'][$answerId]['questionId'] ?? '';
    unset($data['answers'][$answerId]);

    if (!empty($qId) && isset($data['questions'][$qId])) {
        $count = 0;
        foreach ($data['answers'] as $a) {
            if (($a['questionId'] ?? '') === $qId) $count++;
        }
        $data['questions'][$qId]['replyCount'] = $count;
    }

    return save_forum_data($data);
}

/**
 * Aggregate stats for /admin2 Dashboard
 */
function forum_get_stats(): array {
    $data = get_forum_data();
    $questions = $data['questions'] ?? [];
    $answers = $data['answers'] ?? [];
    $users = $data['users'] ?? [];

    $totalQuestions = count($questions);
    $activeQuestions = count(array_filter($questions, fn($q) => ($q['status'] ?? '') === 'active'));
    $flaggedQuestions = count(array_filter($questions, fn($q) => ($q['status'] ?? '') === 'flagged'));
    $hiddenQuestions = count(array_filter($questions, fn($q) => ($q['status'] ?? '') === 'hidden'));

    $totalAnswers = count($answers);
    $activeAnswers = count(array_filter($answers, fn($a) => ($a['status'] ?? '') === 'active'));
    $flaggedAnswers = count(array_filter($answers, fn($a) => ($a['status'] ?? '') === 'flagged'));

    $totalUsers = count($users);
    $verifiedClinicians = count(array_filter($users, fn($u) => !empty($u['isVerifiedClinician'])));
    $bannedUsers = count(array_filter($users, fn($u) => !empty($u['isBanned'])));

    // Breakdown per 15 specialties
    $specialties = forum_get_specialties();
    $specialtyBreakdown = [];
    foreach ($specialties as $s) {
        $specialtyBreakdown[$s['id']] = [
            'id' => $s['id'],
            'name_ko' => $s['name_ko'],
            'name_en' => $s['name_en'],
            'color' => $s['color'],
            'icon' => $s['icon'],
            'count' => $s['questionCount'] ?? 0
        ];
    }

    return [
        'totalQuestions' => $totalQuestions,
        'activeQuestions' => $activeQuestions,
        'flaggedQuestions' => $flaggedQuestions,
        'hiddenQuestions' => $hiddenQuestions,
        'totalAnswers' => $totalAnswers,
        'activeAnswers' => $activeAnswers,
        'flaggedAnswers' => $flaggedAnswers,
        'totalUsers' => $totalUsers,
        'verifiedClinicians' => $verifiedClinicians,
        'bannedUsers' => $bannedUsers,
        'specialties' => array_values($specialtyBreakdown)
    ];
}

/**
 * Format relative time string for Discourse forum
 */
function forum_format_relative_time(?string $datetime): string {
    if (!$datetime) return '방금';
    $ts = is_numeric($datetime) ? (int)$datetime : strtotime($datetime);
    if (!$ts) return '방금';
    $diff = time() - $ts;
    if ($diff < 60) return '방금';
    if ($diff < 3600) return floor($diff / 60) . '분';
    if ($diff < 86400) return floor($diff / 3600) . '시간';
    if ($diff < 86400 * 30) return floor($diff / 86400) . '일';
    if (date('Y', $ts) === date('Y')) return date('n월 j일', $ts);
    return date('Y.m.d', $ts);
}

/**
 * Log forum email notifications for audit and local verification
 */
function forum_log_email_notification(array $entry): void {
    $logFile = __DIR__ . '/../data/forum_email_logs.json';
    $logs = [];
    if (file_exists($logFile)) {
        $content = @file_get_contents($logFile);
        if ($content) {
            $decoded = json_decode($content, true);
            if (is_array($decoded)) {
                $logs = $decoded;
            }
        }
    }
    array_unshift($logs, $entry);
    if (count($logs) > 100) {
        $logs = array_slice($logs, 0, 100);
    }
    @file_put_contents($logFile, json_encode($logs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

/**
 * Send email notification to question author when someone replies
 */
function forum_send_reply_notification_email(array $question, array $answer, array $responderUser, array $recipientUser): bool {
    $to = $recipientUser['email'] ?? '';
    if (!$to || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    $recipientName = htmlspecialchars($recipientUser['name'] ?? '회원', ENT_QUOTES, 'UTF-8');
    $responderName = htmlspecialchars($answer['authorName'] ?? ($responderUser['name'] ?? '답변자'), ENT_QUOTES, 'UTF-8');
    $isClinician = !empty($answer['authorBadge']) && str_contains($answer['authorBadge'], 'Clinician');
    $clinicianTitle = htmlspecialchars($responderUser['clinicianTitle'] ?? ($isClinician ? '공인 의료 전문가' : ''), ENT_QUOTES, 'UTF-8');

    $questionTitle = htmlspecialchars($question['title'] ?? '의료 질문/정보 나눔', ENT_QUOTES, 'UTF-8');
    $questionBodySnippet = htmlspecialchars(mb_substr(strip_tags($question['body'] ?? ''), 0, 120), ENT_QUOTES, 'UTF-8');
    $answerBody = nl2br(htmlspecialchars($answer['body'] ?? '', ENT_QUOTES, 'UTF-8'));
    $createdAt = date('Y년 n월 j일 H:i', strtotime($answer['createdAt'] ?? 'now'));

    // Resolve Base URL dynamically
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost:8080';
    $proto = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    if (empty($host) || str_contains($host, 'cli')) {
        $baseUrl = 'http://localhost:8080';
    } else {
        $baseUrl = $proto . '://' . $host;
    }
    
    // Direct URL to the specific post reply composer
    $replyUrl = $baseUrl . '/forum/topic/' . urlencode($question['id']) . '#reply-section';

    // Email Subject
    $subjectRaw = '[NJAP 메디컬 포럼] 회원님의 질문에 새로운 ' . ($isClinician ? '전문의 ' : '') . '답변이 등록되었습니다: ' . mb_substr($question['title'], 0, 35) . '...';
    $subject = '=?UTF-8?B?' . base64_encode($subjectRaw) . '?=';

    $fromName = 'NJAP 메디컬 포럼 알림';
    $fromEmail = 'no-reply@njaccessportal.com';
    $fromEncoded = '=?UTF-8?B?' . base64_encode($fromName) . '?= <' . $fromEmail . '>';

    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . $fromEncoded,
        'Reply-To: ' . $fromEncoded,
        'X-Mailer: PHP/' . phpversion() . ' (NJAP Medical Forum)'
    ];

    $htmlBody = '
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>' . $subjectRaw . '</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \'Pretendard\', \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 12px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.03); border: 1px solid #e2e8f0;">
          
          <!-- Brand Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A8A 0%, #0B192C 100%); padding: 28px 32px; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 19px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
                      NJAP <span style="color: #60a5fa;">FORUM</span>
                    </div>
                    <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">
                      뉴저지 한인 의료접근센터 · 전문 진료과 및 시니어 케어 포럼
                    </div>
                  </td>
                  <td align="right">
                    <span style="background-color: rgba(255,255,255,0.15); color: #ffffff; font-size: 11px; font-weight: bold; padding: 6px 12px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.25);">
                      답변 알림
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 32px 28px 32px;">
              
              <h2 style="font-size: 18px; color: #0f172a; margin: 0 0 12px 0; font-weight: 800; line-height: 1.4;">
                안녕하세요, ' . $recipientName . '님!<br>
                작성하신 질문에 새로운 답변이 등록되었습니다.
              </h2>
              
              <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 0 0 24px 0;">
                포럼에 등록하신 의학 상담 질문에 ' . ($isClinician ? '<strong style="color:#059669;">공인 전문의</strong>' : '<strong>커뮤니티 회원</strong>') . '님의 소중한 답변이 등록되었습니다.
              </p>

              <!-- Original Question Summary Box -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 18px; margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">
                  📌 회원님의 원문 질문
                </div>
                <div style="font-size: 14px; font-weight: 800; color: #0f172a; line-height: 1.4; margin-bottom: 6px;">
                  ' . $questionTitle . '
                </div>
                <div style="font-size: 12px; color: #64748b; line-height: 1.5;">
                  ' . $questionBodySnippet . '...
                </div>
              </div>

              <!-- New Reply Card -->
              <div style="background-color: ' . ($isClinician ? '#f0fdf4' : '#ffffff') . '; border: 1px solid ' . ($isClinician ? '#86efac' : '#e2e8f0') . '; border-radius: 14px; padding: 20px; margin-bottom: 28px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 12px;">
                  <tr>
                    <td width="42" valign="top">
                      <img src="' . htmlspecialchars($answer['authorAvatar'] ?: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80') . '" 
                           width="38" height="38" style="border-radius: 50%; object-fit: cover; display: block; border: 2px solid ' . ($isClinician ? '#10b981' : '#cbd5e1') . ';" alt="' . $responderName . '">
                    </td>
                    <td style="padding-left: 12px;" valign="middle">
                      <div style="font-size: 14px; font-weight: 800; color: #0f172a;">
                        ' . $responderName . '
                        ' . ($isClinician ? '<span style="display: inline-block; background-color: #059669; color: #ffffff; font-size: 10px; font-weight: bold; padding: 2px 7px; border-radius: 9999px; margin-left: 6px;">공인 전문의</span>' : '') . '
                      </div>
                      <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                        ' . ($clinicianTitle ? $clinicianTitle . ' · ' : '') . $createdAt . '
                      </div>
                    </td>
                  </tr>
                </table>

                ' . ($isClinician ? '
                <div style="display: inline-block; background-color: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 8px; margin-bottom: 12px; border: 1px solid #bbf7d0;">
                  ✓ NJAP 공인 의료 전문가 인증 소견 (Verified Clinician)
                </div>' : '') . '

                <!-- Reply Message Body -->
                <div style="font-size: 13px; color: #1e293b; line-height: 1.7; word-break: break-word; background-color: #ffffff; padding: 14px 16px; border-radius: 10px; border: 1px solid ' . ($isClinician ? '#bbf7d0' : '#f1f5f9') . ';">
                  ' . $answerBody . '
                </div>
              </div>

              <!-- CTA Button: Route back to post reply -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="' . $replyUrl . '" 
                       style="display: inline-block; background: #2563eb; background-color: #2563eb; color: #ffffff; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(37,99,235,0.25); letter-spacing: -0.2px;">
                      답변 확인 및 포럼에서 답글 작성하기 →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <span style="font-size: 11px; color: #94a3b8;">
                      버튼 클릭 시 해당 질문으로 이동하여 전체 상담 내역 확인 및 즉시 재답글 작성이 가능합니다.
                    </span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 22px 32px; text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0 0 6px 0; line-height: 1.5;">
                <strong>의료 면책 안내:</strong> 본 포럼의 질의응답은 의료 교육 및 일반 정보 제공 목적이며 대면 진료를 대신할 수 없습니다.<br>
                급성 흉통, 호흡곤란 등 응급 상황 발생 시 즉시 911에 연락하시기 바랍니다.
              </p>
              <p style="font-size: 10px; color: #cbd5e1; margin: 0;">
                수신 이메일: ' . htmlspecialchars($to, ENT_QUOTES, 'UTF-8') . ' · © ' . date('Y') . ' Healthcare Access Portal. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
';

    $mailResult = @mail($to, $subject, $htmlBody, implode("\r\n", $headers));

    // Audit Log Entry
    forum_log_email_notification([
        'id' => 'email_' . bin2hex(random_bytes(6)),
        'to' => $to,
        'subject' => $subjectRaw,
        'questionId' => $question['id'] ?? '',
        'questionTitle' => $question['title'] ?? '',
        'responderName' => $answer['authorName'] ?? '',
        'isClinician' => $isClinician,
        'replyUrl' => $replyUrl,
        'mailSent' => $mailResult,
        'sentAt' => date('c'),
        'previewHtml' => $htmlBody
    ]);

    return $mailResult;
}

/**
 * Handle image upload for forum questions, replies, and posters (JPEG, PNG, WEBP)
 */
function forum_handle_image_upload(array $file, string $prefix = 'forum_img_'): array {
    if (empty($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        return ['success' => false, 'error' => '업로드할 파일이 유효하지 않습니다.'];
    }

    $maxBytes = 12 * 1024 * 1024; // 12MB
    if ($file['size'] > $maxBytes) {
        return ['success' => false, 'error' => '파일 용량은 최대 12MB까지 업로드 가능합니다.'];
    }

    // MIME validation
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    $allowedMimes = [
        'image/jpeg' => 'jpg',
        'image/jpg'  => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'image/gif'  => 'gif'
    ];

    if (!isset($allowedMimes[$mime])) {
        return ['success' => false, 'error' => 'JPEG, PNG, WEBP 이미지 파일만 업로드할 수 있습니다.'];
    }

    $ext = $allowedMimes[$mime];
    $datePart = date('Ymd_His');
    $randPart = bin2hex(random_bytes(4));
    $filename = "{$prefix}{$datePart}_{$randPart}.{$ext}";

    $pImagesDir = defined('PERSISTENT_IMAGES_DIR') ? PERSISTENT_IMAGES_DIR : (__DIR__ . '/../uploads/images');
    $lImagesDir = defined('LOCAL_IMAGES_DIR') ? LOCAL_IMAGES_DIR : (__DIR__ . '/../uploads/images');

    if (!is_dir($pImagesDir)) { @mkdir($pImagesDir, 0777, true); @chmod($pImagesDir, 0777); }
    if (!is_dir($lImagesDir)) { @mkdir($lImagesDir, 0777, true); @chmod($lImagesDir, 0777); }

    $pPath = $pImagesDir . '/' . $filename;
    $lPath = $lImagesDir . '/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $lPath)) {
        if (!@copy($file['tmp_name'], $lPath)) {
            return ['success' => false, 'error' => '파일 저장에 실패했습니다.'];
        }
    }
    @chmod($lPath, 0666);

    if ($pPath !== $lPath) {
        @copy($lPath, $pPath);
        @chmod($pPath, 0666);
    }

    $publicUrl = '/uploads/images/' . $filename;

    // Record in media store
    $pMediaStore = defined('PERSISTENT_MEDIA_STORE') ? PERSISTENT_MEDIA_STORE : (__DIR__ . '/../data/media_store.json');
    $mediaStore = [];
    if (file_exists($pMediaStore)) {
        $mediaStore = json_decode(@file_get_contents($pMediaStore), true) ?: [];
    }
    $mediaStore[$filename] = [
        'name' => $filename,
        'type' => 'image',
        'url' => $publicUrl,
        'size' => filesize($lPath),
        'mtime' => time()
    ];
    @file_put_contents($pMediaStore, json_encode($mediaStore, JSON_UNESCAPED_SLASHES));

    return [
        'success' => true,
        'filename' => $filename,
        'url' => $publicUrl,
        'size' => filesize($lPath),
        'mime' => $mime
    ];
}

/**
 * Send email broadcast to all joined forum members when an Admin creates a new Event post
 */
function forum_send_event_broadcast_email(array $eventQuestion, array $allUsers, ?string $posterUrl = null): array {
    $results = [
        'total' => count($allUsers),
        'sent' => 0,
        'failed' => 0,
        'skipped' => 0,
        'recipients' => []
    ];

    $host = $_SERVER['HTTP_HOST'] ?? 'localhost:8080';
    $proto = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    if (empty($host) || str_contains($host, 'cli')) {
        $baseUrl = 'https://kor2.njaccessportal.com';
    } else {
        $baseUrl = $proto . '://' . $host;
    }

    $eventUrl = $baseUrl . '/forum/topic/' . urlencode($eventQuestion['id'] ?? '');
    $eventTitle = htmlspecialchars($eventQuestion['title'] ?? 'NJAP 메디컬 포럼 공식 이벤트 안내', ENT_QUOTES, 'UTF-8');
    $eventBody = nl2br(htmlspecialchars($eventQuestion['body'] ?? '', ENT_QUOTES, 'UTF-8'));

    $fullPosterUrl = '';
    if (!empty($posterUrl)) {
        $fullPosterUrl = str_starts_with($posterUrl, 'http') ? $posterUrl : ($baseUrl . $posterUrl);
    }

    $subjectRaw = '[NJAP 메디컬 포럼 공식 이벤트] ' . ($eventQuestion['title'] ?? '새로운 건강 이벤트 안내');
    $subject = '=?UTF-8?B?' . base64_encode($subjectRaw) . '?=';

    $fromName = 'NJAP 메디컬 포럼 (HAC)';
    $fromEmail = 'no-reply@njaccessportal.com';
    $fromEncoded = '=?UTF-8?B?' . base64_encode($fromName) . '?= <' . $fromEmail . '>';

    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . $fromEncoded,
        'Reply-To: ' . $fromEncoded,
        'X-Mailer: PHP/' . phpversion() . ' (NJAP Medical Forum Event Broadcast)'
    ];

    // Collect valid recipients
    $uniqueEmails = [];
    foreach ($allUsers as $u) {
        $email = trim($u['email'] ?? '');
        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL) || !empty($u['isBanned'])) {
            $results['skipped']++;
            continue;
        }
        if (isset($uniqueEmails[$email])) {
            $results['skipped']++;
            continue;
        }
        $uniqueEmails[$email] = $u;
    }

    foreach ($uniqueEmails as $email => $u) {
        $recipientName = htmlspecialchars($u['name'] ?? '회원', ENT_QUOTES, 'UTF-8');

        $htmlBody = '
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>' . $subjectRaw . '</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \'Pretendard\', \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 12px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.03); border: 1px solid #e2e8f0;">
          
          <!-- Brand Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A8A 0%, #BE123C 100%); padding: 28px 32px; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 19px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
                      NJAP <span style="color: #fda4af;">FORUM EVENT</span>
                    </div>
                    <div style="font-size: 12px; color: #fecdd3; margin-top: 4px;">
                      뉴저지 한인 의료접근센터 · 공식 이벤트 및 건강 강좌 안내
                    </div>
                  </td>
                  <td align="right">
                    <span style="background-color: rgba(255,255,255,0.2); color: #ffffff; font-size: 11px; font-weight: bold; padding: 6px 12px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.3);">
                      공식 공지
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 32px 28px 32px;">
              
              <h2 style="font-size: 18px; color: #0f172a; margin: 0 0 12px 0; font-weight: 800; line-height: 1.4;">
                안녕하세요, ' . $recipientName . '님!<br>
                뉴저지 한인 의료접근센터의 새로운 이벤트 소식을 전해드립니다.
              </h2>
              
              <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 0 0 24px 0;">
                포럼 가입 회원님을 위해 의료접근센터(HAC)에서 주최하는 건강 강좌, 무료 세미나 및 주요 이벤트 안내입니다.
              </p>

              ' . (!empty($fullPosterUrl) ? '
              <!-- Event Poster Image -->
              <div style="margin-bottom: 24px; text-align: center;">
                <a href="' . $eventUrl . '" target="_blank" style="text-decoration: none;">
                  <img src="' . htmlspecialchars($fullPosterUrl, ENT_QUOTES, 'UTF-8') . '" 
                       alt="' . $eventTitle . '" 
                       style="max-width: 100%; height: auto; border-radius: 14px; border: 1px solid #e2e8f0; display: block; margin: 0 auto; box-shadow: 0 4px 14px rgba(0,0,0,0.08); max-height: 480px; object-fit: cover;">
                </a>
              </div>' : '') . '

              <!-- Event Details Box -->
              <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 14px; padding: 22px; margin-bottom: 28px;">
                <div style="display: inline-block; background-color: #e11d48; color: #ffffff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; margin-bottom: 10px;">
                  🗓️ EVENT &amp; NOTICE
                </div>
                <h3 style="font-size: 17px; font-weight: 800; color: #9f1239; margin: 0 0 12px 0; line-height: 1.4;">
                  ' . $eventTitle . '
                </h3>
                <div style="font-size: 13px; color: #334155; line-height: 1.8; background-color: #ffffff; padding: 16px 18px; border-radius: 10px; border: 1px solid #ffe4e6;">
                  ' . $eventBody . '
                </div>
              </div>

              <!-- CTA Button: Route back to post -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="' . $eventUrl . '" 
                       style="display: inline-block; background: #e11d48; background-color: #e11d48; color: #ffffff; font-size: 14px; font-weight: 800; text-decoration: none; padding: 15px 36px; border-radius: 12px; box-shadow: 0 4px 14px rgba(225,29,72,0.3); letter-spacing: -0.2px;">
                      이벤트 상세 확인 및 참여하기 →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <span style="font-size: 11px; color: #94a3b8;">
                      버튼 클릭 시 포럼 웹사이트의 이벤트 상세 페이지로 이동합니다.
                    </span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 22px 32px; text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0 0 6px 0; line-height: 1.5;">
                본 메일은 뉴저지 한인 의료접근포럼(NJAP Forum)에 구글 계정으로 가입하신 회원님께 발송되는 공식 안내 메일입니다.<br>
                의료 관련 응급 상황 발생 시 즉시 911에 연락하시기 바랍니다.
              </p>
              <p style="font-size: 10px; color: #cbd5e1; margin: 0;">
                수신 이메일: ' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . ' · © ' . date('Y') . ' Healthcare Access Portal. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
';

        $sent = @mail($email, $subject, $htmlBody, implode("\r\n", $headers));
        if ($sent) {
            $results['sent']++;
        } else {
            $results['failed']++;
        }
        $results['recipients'][] = [
            'email' => $email,
            'name' => $u['name'] ?? '',
            'success' => $sent
        ];
    }

    // Audit Log Entry for Event Broadcast
    forum_log_email_notification([
        'id' => 'broadcast_' . bin2hex(random_bytes(6)),
        'type' => 'event_broadcast',
        'subject' => $subjectRaw,
        'eventId' => $eventQuestion['id'] ?? '',
        'eventTitle' => $eventQuestion['title'] ?? '',
        'posterUrl' => $posterUrl,
        'totalUsers' => count($allUsers),
        'sentCount' => $results['sent'],
        'failedCount' => $results['failed'],
        'skippedCount' => $results['skipped'],
        'sentAt' => date('c')
    ]);

    return $results;
}


