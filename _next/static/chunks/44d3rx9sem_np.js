
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  typeof document === "object" ? document.currentScript : void 0,
  30386,
  function(e) {
    "use strict";
    var s = e.i(43476), t = e.i(71645);
    var DICT_ITEMS = [{"cat":"진료과목","en":"Internal Medicine","ko":"일반 내과","desc":"성인 만성질환, 고혈압, 당뇨, 감기 등 포괄적 1차 진료"},{"cat":"진료과목","en":"Cardiology","ko":"심장내과 / 순환기내과","desc":"고혈압, 협심증, 부정맥, 심부전, 동맥경화, 심혈관 질환 전문 진료"},{"cat":"진료과목","en":"Neurology","ko":"신경과 / 뇌신경과","desc":"뇌졸중, 치매, 어지럼증, 두통, 파킨슨병, 말초신경병증 등 뇌신경 질환"},{"cat":"진료과목","en":"Endocrinology","ko":"내분비내과","desc":"당뇨병, 갑상선 질환, 골다공증, 부신 및 뇌하수체 호르몬 이상 질환"},{"cat":"진료과목","en":"Gastroenterology (GI)","ko":"소화기내과","desc":"위·대장 내시경, 역류성 식도염, 간염, 지방간, 궤양성 대장염, 위장 질환"},{"cat":"진료과목","en":"Orthopedics / Orthopedic Surgery","ko":"정형외과","desc":"관절염, 척추 디스크, 골절, 인대 파열, 오십견, 인공관절 수술"},{"cat":"진료과목","en":"Ophthalmology","ko":"안과","desc":"백내장, 녹내장, 황반변성, 안구건조증, 시력 교정 및 안질환 수술"},{"cat":"진료과목","en":"Dermatology","ko":"피부과","desc":"피부염, 습진, 피부암(흑색종) 검진, 대상포진, 건선, 알레르기 피부 질환"},{"cat":"진료과목","en":"Urology","ko":"비뇨의학과","desc":"전립선 비대증, 요로결석, 방광염, 혈뇨, 신장 질환, 남성 건강"},{"cat":"진료과목","en":"Family Medicine","ko":"가정의학과","desc":"온 가족 주치의(PCP) 1차 진료, 예방접종, 영유아부터 노인까지 건강검진"},{"cat":"진료과목","en":"Pediatrics","ko":"소아청소년과","desc":"신생아 및 소아 발달 검사, 필수 예방접종, 소아 천식, 알레르기 진료"},{"cat":"진료과목","en":"Obstetrics and Gynecology (OB/GYN)","ko":"산부인과","desc":"임신·출산 산전 진찰, 자궁경부암 검사(Pap), 생리불순, 폐경 호르몬 치료"},{"cat":"진료과목","en":"Pulmonology / Respiratory Medicine","ko":"호흡기내과","desc":"천식, 만성폐쇄성폐질환(COPD), 만성 기침, 폐렴, 수면무호흡증, 폐섬유증"},{"cat":"진료과목","en":"Nephrology","ko":"신장내과","desc":"만성 신장병(CKD), 단백뇨, 신부전증, 혈액투석 및 복막투석 관리"},{"cat":"진료과목","en":"Rheumatology","ko":"류마티스내과","desc":"류마티스 관절염, 통풍, 루푸스, 강직성 척추염 등 자가면역 질환"},{"cat":"진료과목","en":"Hematology & Oncology","ko":"혈액종양내과","desc":"위암, 대장암, 폐암, 유방암 등 각종 악성 종양 항암 치료 및 빈혈, 백혈병"},{"cat":"진료과목","en":"Otolaryngology (ENT)","ko":"이비인후과","desc":"이명, 난청, 어지럼증(이석증), 만성 비염, 축농증, 편도선염, 인후두 질환"},{"cat":"진료과목","en":"Psychiatry / Behavioral Health","ko":"정신건강의학과","desc":"우울증, 불안장애, 공황장애, 불면증, 조울증, 치매 정신행동증상 치료"},{"cat":"진료과목","en":"Physical Medicine & Rehabilitation (PM&R)","ko":"재활의학과","desc":"뇌졸중·척수손상 재활, 수술 후 근골격계 재활, 물리치료 및 도수치료 연계"},{"cat":"진료과목","en":"General Surgery","ko":"일반외과","desc":"충수염(맹장염), 담낭절제술(담석), 탈장 수술, 유방 외과, 치질 및 양성종양 절제"},{"cat":"진료과목","en":"Allergy & Immunology","ko":"알레르기내과","desc":"음식물 알레르기, 꽃가루 알레르기, 아토피 피부염, 아나필락시스 면역 치료"},{"cat":"진료과목","en":"Podiatry","ko":"족부의학과 (발 전문의)","desc":"당뇨병성 족부 궤양(당뇨발), 족저근막염, 무지외반증, 내성발톱 치료"},{"cat":"진료과목","en":"Emergency Medicine (ER)","ko":"응급의학과 / 응급실","desc":"24시간 중증 급성 질환, 급성 심근경색, 중증 외상, 뇌혈관 질환 신속 진료"},{"cat":"진료과목","en":"Urgent Care","ko":"어전트 케어 (준응급 클리닉)","desc":"예약 없이 당일 방문 가능한 경증 응급 진료 (열상 봉합, 단순 골절, 독감, 화상)"},{"cat":"진료과목","en":"Radiology","ko":"영상의학과","desc":"X-ray, CT, MRI, 초음파, 맘모그램, 골밀도 검사 영상 판독 및 중재 시술"},{"cat":"진료과목","en":"Pathology","ko":"병리과","desc":"생검 조직 검체 및 세포 검사, 혈액 정밀 분석을 통한 최종 질병 확진"},{"cat":"진료과목","en":"Anesthesiology & Pain Management","ko":"마취통증의학과","desc":"수술 전후 전신·부위 마취 관리, 만성 척추·관절 통증 신경차단술 주사 치료"},{"cat":"진료과목","en":"Dentistry / Oral Surgery","ko":"치과 / 구강악안면외과","desc":"스케일링, 충치 치료, 신경치료, 인레이, 크라운, 임플란트, 사랑니 발치"},{"cat":"진료과목","en":"Hospice & Palliative Care","ko":"호스피스 완화의료과","desc":"말기 중증 질환 환자의 극심한 통증 완화, 전인적 돌봄 및 존엄한 임종 지원"},{"cat":"진료과목","en":"Infectious Disease","ko":"감염내과","desc":"원인 불명의 지속적 발열, 결핵, 간염, 패혈증, 항생제 내성균 감염 진료"},{"cat":"증상 표현","en":"Chest tightness / Chest pain","ko":"가슴 답답함 / 흉통","desc":"예: I feel a sharp pain in my chest. (가슴에 찌르는 듯한 통증이 있습니다.)"},{"cat":"증상 표현","en":"Shortness of breath / Dyspnea","ko":"호흡 곤란 / 숨가쁨","desc":"예: I have difficulty breathing when climbing stairs. (계단을 오를 때 숨이 찹니다.)"},{"cat":"증상 표현","en":"Dizziness / Vertigo","ko":"어지럼증 / 현기증","desc":"예: The room is spinning around me. (주변이 핑핑 도는 것처럼 어지럽습니다.)"},{"cat":"증상 표현","en":"Numbness / Tingling sensation","ko":"저림 / 감각 마비","desc":"예: My left hand feels numb and tingling. (왼손이 저리고 감각이 둔합니다.)"},{"cat":"증상 표현","en":"Heart palpitations","ko":"가슴 두근거림 / 심계항진","desc":"예: My heart is beating very fast and irregularly. (심장이 빠르고 불규칙하게 뜁니다.)"},{"cat":"증상 표현","en":"Fatigue / General weakness","ko":"만성 피로 / 전신 쇠약감","desc":"예: I feel exhausted all the time with no energy. (기운이 없고 항상 피곤합니다.)"},{"cat":"증상 표현","en":"Swelling / Edema","ko":"부종 / 붓기","desc":"예: My ankles and feet are swollen. (발목과 발이 많이 붓습니다.)"},{"cat":"증상 표현","en":"Indigestion / Heartburn","ko":"소화불량 / 속쓰림","desc":"예: I have a burning sensation in my stomach. (속이 쓰리고 소화가 안 됩니다.)"},{"cat":"증상 표현","en":"Throbbing headache / Migraine","ko":"지끈거리는 두통 / 편두통","desc":"예: I have a pulsing headache on one side with light sensitivity. (빛에 예민하고 한쪽 머리가 욱신거립니다.)"},{"cat":"증상 표현","en":"Sharp stabbing pain","ko":"찌르는 듯한 날카로운 통증","desc":"예: I feel a sharp stabbing pain when I take a deep breath. (숨을 깊게 들이쉴 때 콕콕 찌르듯 아픕니다.)"},{"cat":"증상 표현","en":"Dull aching pain","ko":"은근하고 묵직한 통증","desc":"예: There is a dull ache in my lower back that won't go away. (허리 아래쪽에 뻐근하고 묵직한 통증이 지속됩니다.)"},{"cat":"증상 표현","en":"Burning sensation during urination","ko":"배뇨통 / 소변볼 때 작열감","desc":"예: It burns whenever I urinate, and I need to go frequently. (소변볼 때 타는 듯 따갑고 자주 마렵습니다.)"},{"cat":"증상 표현","en":"Chills and high fever","ko":"오한 및 고열","desc":"예: I have had shivering chills and a fever of 102°F. (온몸이 덜덜 떨리는 오한과 102도 고열이 납니다.)"},{"cat":"증상 표현","en":"Persistent chronic cough / Phlegm","ko":"만성 기침 / 가래","desc":"예: I have had a deep cough with yellowish phlegm for three weeks. (3주째 누런 가래를 동반한 기침이 납니다.)"},{"cat":"증상 표현","en":"Coughing up blood / Hemoptysis","ko":"객혈 (피 섞인 기침)","desc":"예: I noticed streaks of bright red blood in my mucus. (기침 가래에 선홍색 피가 섞여 나왔습니다.)"},{"cat":"증상 표현","en":"Nausea and vomiting","ko":"구역질 및 구토","desc":"예: I feel extremely nauseous and cannot keep fluids down. (속이 너무 울렁거리고 물조차 넘기기 어렵습니다.)"},{"cat":"증상 표현","en":"Abdominal bloating and gas","ko":"복부 팽만감 / 가스 참","desc":"예: My belly feels distended, tight, and uncomfortable. (배가 빵빵하게 부풀어 오르고 더부룩합니다.)"},{"cat":"증상 표현","en":"Severe diarrhea / Constipation","ko":"심한 설사 / 만성 변비","desc":"예: I have had watery diarrhea more than five times today. (오늘 물설사를 다섯 번 이상 했습니다.)"},{"cat":"증상 표현","en":"Blood in stool / Black tarry stool","ko":"혈변 / 흑색변","desc":"예: My stool looks dark black like coffee grounds. (대변 색깔이 커피 찌꺼기처럼 검붉습니다 - 위장 출혈 의심)"},{"cat":"증상 표현","en":"Joint stiffness / Morning stiffness","ko":"관절 뻣뻣함 / 조조강직","desc":"예: My fingers and knees are stiff for an hour every morning. (매일 아침 손가락과 무릎이 1시간 이상 굳어 있습니다.)"},{"cat":"증상 표현","en":"Muscle spasms / Leg cramps","ko":"근육 경련 / 쥐남","desc":"예: I get sudden severe muscle cramps in my calves while sleeping. (수면 중 종아리에 갑자기 극심한 쥐가 납니다.)"},{"cat":"증상 표현","en":"Tremor / Involuntary shaking","ko":"떨림 / 진전 증상 (수전증)","desc":"예: My right hand trembles when resting on my lap. (가만히 무릎 위에 손을 올려놓아도 손이 떨립니다.)"},{"cat":"증상 표현","en":"Blurred vision / Double vision","ko":"시야 흐림 / 복시","desc":"예: Everything looks cloudy, and I see two of everything. (눈앞이 뿌옇고 사물이 두 개로 겹쳐 보입니다.)"},{"cat":"증상 표현","en":"Tinnitus / Ringing in ears","ko":"이명 (귀울림)","desc":"예: I have a high-pitched buzzing noise in my ears constantly. (귀에서 하루 종일 삐-하는 고음이 들립니다.)"},{"cat":"증상 표현","en":"Difficulty swallowing / Dysphagia","ko":"연하 곤란 (삼킴 장애)","desc":"예: Solid food gets stuck in my mid-chest when swallowing. (고형 음식을 삼킬 때 가슴 중간에 걸려 넘어가지 않습니다.)"},{"cat":"증상 표현","en":"Unintended weight loss","ko":"원인 불명의 체중 감소","desc":"예: I lost 15 pounds over the last three months without dieting. (다이어트를 하지 않았는데 3개월간 15파운드가 줄었습니다.)"},{"cat":"증상 표현","en":"Skin rash / Hives / Pruritus","ko":"피부 발진 / 두드러기 / 가려움증","desc":"예: I broke out in red raised welts that itch terribly. (온몸에 붉게 부풀어 오르는 가려운 두드러기가 났습니다.)"},{"cat":"증상 표현","en":"Easy bruising / Petechiae","ko":"쉽게 멍듦 / 점상출혈","desc":"예: Large purple bruises appear even without bumping into things. (어디 부딪히지 않아도 큰 보라색 멍이 자꾸 생깁니다.)"},{"cat":"증상 표현","en":"Insomnia / Sleep apnea","ko":"불면증 / 수면무호흡증","desc":"예: I wake up gasping for air and feel exhausted during the day. (잠자다 숨이 컥 막혀 깨고 낮에 극도로 졸립니다.)"},{"cat":"증상 표현","en":"Drenching night sweats","ko":"야간 식은땀 (도한증)","desc":"예: I wake up needing to change my pajamas because of soaking sweat. (잠옷이 흠뻑 젖어 갈아입을 정도로 밤에 땀이 납니다.)"},{"cat":"증상 표현","en":"Memory lapses / Brain fog","ko":"기억력 감퇴 / 브레인 포그","desc":"예: I have trouble recalling familiar names and words lately. (친숙한 사람 이름이나 단어가 금방 떠오르지 않습니다.)"},{"cat":"증상 표현","en":"Orthopnea (Breathless when lying flat)","ko":"기좌호흡 (누우면 숨이 참)","desc":"예: I cannot breathe lying flat and need three pillows under my head. (평평하게 누우면 숨이 차서 베개를 높게 괴어야 합니다.)"},{"cat":"증상 표현","en":"Cold sensitivity in extremities","ko":"수족냉증 / 말초 시림","desc":"예: My fingertips turn pale and blue in air conditioning. (에어컨 바람에 손가락 끝이 하얗게 질리고 파래집니다 - 레이노 증후군)"},{"cat":"증상 표현","en":"Hot flashes and night flushes","ko":"안면홍조 및 상열감","desc":"예: Intense waves of heat suddenly flush over my face and chest. (얼굴과 가슴 쪽으로 갑작스러운 뜨거운 열감이 치솟습니다 - 갱년기)"},{"cat":"증상 표현","en":"Sore throat and hoarseness","ko":"목 통증(인후통) 및 쉰 목소리","desc":"예: My voice is raspy and swallowing saliva hurts. (목소리가 쉬어 잘 안 나오고 침 삼킬 때마다 목이 아픕니다.)"},{"cat":"증상 표현","en":"Wheezing (High whistling breath)","ko":"천명음 (쌕쌕거리는 숨소리)","desc":"예: My chest makes a musical whistling sound when breathing out. (숨을 내쉴 때 가슴에서 쌕쌕거리는 휘파람 소리가 납니다.)"},{"cat":"증상 표현","en":"Urinary incontinence","ko":"요실금","desc":"예: Urine leaks out accidentally when coughing or sneezing. (기침하거나 재채기할 때 무의식중에 소변이 샙니다.)"},{"cat":"증상 표현","en":"Frequent urination / Nocturia","ko":"빈뇨 / 야간뇨","desc":"예: I have to get up 3 to 4 times every night to use the toilet. (밤에 화장실 가느라 서너 번씩 잠에서 깹니다.)"},{"cat":"증상 표현","en":"Localized tenderness","ko":"국소 압통 (누르면 아픔)","desc":"예: It hurts sharply when the nurse presses on the right lower belly. (오른쪽 아랫배를 꾹 누를 때 찌릿한 통증이 발생합니다.)"},{"cat":"증상 표현","en":"Radiating pain / Sciatica","ko":"방사통 / 좌골신경통","desc":"예: Shooting electric pain travels down from my buttock to my calf. (엉덩이에서 종아리 쪽으로 찌릿한 전기 통증이 뻗칩니다.)"},{"cat":"증상 표현","en":"Swollen lymph nodes","ko":"림프절 부종 (멍울)","desc":"예: I feel tender, swollen lumps on the sides of my neck. (목 양옆에 누르면 아픈 멍울이 만져집니다.)"},{"cat":"증상 표현","en":"Bleeding gums / Mouth ulcers","ko":"잇몸 출혈 / 구내염","desc":"예: My gums bleed easily, and I have painful ulcers inside my cheek. (양치할 때 피가 나고 입안에 헐은 궤양이 여러 개 있습니다.)"},{"cat":"증상 표현","en":"Crushing chest pressure","ko":"쥐어짜는 듯한 가슴 압박감","desc":"예: It feels like an elephant is sitting on my chest. (가슴 위에 코끼리가 앉아있는 듯 짓눌립니다 - 즉시 911 신고)"},{"cat":"증상 표현","en":"Loss of taste or smell","ko":"미각 또는 후각 상실","desc":"예: I suddenly cannot taste food or smell anything. (갑자기 음식 맛이나 냄새를 전혀 느끼지 못하겠습니다.)"},{"cat":"증상 표현","en":"Panic attack / Sense of impending doom","ko":"공황 발작 / 극심한 질식 공포","desc":"예: My heart races and I feel like I'm losing control or dying. (심장이 미친 듯 뛰고 숨이 막혀 죽을 것 같은 공포가 듭니다.)"},{"cat":"검사 및 약물","en":"Fasting Blood Glucose / HbA1c","ko":"공복 혈당 / 당화혈색소","desc":"당뇨 진단 및 지난 2~3개월간의 평균 혈당 조절 상태를 확인하는 핵심 혈액 검사"},{"cat":"검사 및 약물","en":"Lipid Panel (Cholesterol / Triglycerides)","ko":"지질 검사 (콜레스테롤 / 중성지방)","desc":"총콜레스테롤, HDL(좋은), LDL(나쁜), 중성지방 수치를 측정해 동맥경화 위험도 평가"},{"cat":"검사 및 약물","en":"Blood Pressure (Systolic / Diastolic)","ko":"혈압 측정 (수축기 / 이완기)","desc":"정상 혈압 기준 120/80 mmHg 미만. 130/80 이상 시 고혈압 1단계 진단"},{"cat":"검사 및 약물","en":"Colonoscopy / Endoscopy","ko":"대장내시경 / 위내시경","desc":"위암, 대장암 조기 발견 및 대장 선종 용종을 즉시 절제하는 정밀 소화기 검사"},{"cat":"검사 및 약물","en":"Generic Drug vs Brand Drug","ko":"제네릭(복제약) vs 브랜드약","desc":"동일 유효성분·함량·효능이나 제네릭이 보험 코페이와 본인부담 약값이 훨씬 저렴"},{"cat":"검사 및 약물","en":"Prescription Refill","ko":"처방전 리필 (재조제)","desc":"처방 라벨에 남은 리필 횟수(Refills)를 확인한 뒤 약국 앱이나 전화로 추가 조제 요청"},{"cat":"검사 및 약물","en":"Complete Blood Count (CBC)","ko":"일반 혈액 검사 (CBC)","desc":"적혈구, 백혈구, 혈소판 수치를 정밀 측정하여 빈혈, 세균 감염, 백혈병 여부 판별"},{"cat":"검사 및 약물","en":"Comprehensive Metabolic Panel (CMP)","ko":"종합 대사 기능 검사 (CMP)","desc":"간 효소 수치(AST/ALT), 신장 기능(BUN/Cr), 전해질(나트륨/칼륨), 혈당 종합 평가"},{"cat":"검사 및 약물","en":"Thyroid Stimulating Hormone (TSH)","ko":"갑상선 자극 호르몬 검사 (TSH)","desc":"갑상선 기능 저하증(피로·체중증가) 및 항진증(두근거림·체중감소) 감별 필수 검사"},{"cat":"검사 및 약물","en":"Urinalysis (UA) & Urine Culture","ko":"소변 검사 및 소변 균 배양 검사","desc":"요로 감염증(방광염), 신우신염, 단백뇨(신장 손상), 혈뇨 여부를 신속 확인"},{"cat":"검사 및 약물","en":"Electrocardiogram (EKG / ECG)","ko":"심전도 검사 (EKG)","desc":"심장 박동 시 발생하는 미세한 전기 신호를 그래프로 기록해 부정맥, 심근경색 진단"},{"cat":"검사 및 약물","en":"Echocardiogram (Echo)","ko":"심장 초음파 검사","desc":"초음파를 통해 심장 판막 이상, 심장벽 두께, 심실 수축력 및 박출량을 정밀 평가"},{"cat":"검사 및 약물","en":"Chest X-ray","ko":"흉부 엑스레이 (X선 촬영)","desc":"폐렴, 결핵, 폐부종, 기흉, 늑막 삼출, 심장 비대 여부를 1차적으로 확인하는 검사"},{"cat":"검사 및 약물","en":"Computed Tomography (CT Scan)","ko":"컴퓨터 단층촬영 (CT)","desc":"방사선을 360도 회전 조사하여 뇌출혈, 폐암, 복부 장기, 미세 골절의 단면 영상 획득"},{"cat":"검사 및 약물","en":"Magnetic Resonance Imaging (MRI)","ko":"자기공명영상 (MRI)","desc":"강한 자기장과 고주파로 뇌종양, 척추 디스크, 관절 인대 연부조직을 방사선 없이 촬영"},{"cat":"검사 및 약물","en":"Ultrasound / Sonogram","ko":"초음파 검사 (복부·골반·갑상선)","desc":"방사선 노출 없이 실시간으로 간질환, 담석, 신장 결석, 자궁 근종, 난소 낭종 진단"},{"cat":"검사 및 약물","en":"Mammogram (Screening / Diagnostic)","ko":"유방촬영술 (맘모그램)","desc":"유방암 조기 발견을 위한 X선 촬영. 뉴저지 NJCEED 프로그램을 통해 무료 지원 가능"},{"cat":"검사 및 약물","en":"Pap Smear & HPV Co-testing","ko":"자궁경부암 세포진 검사 (팝스미어)","desc":"자궁경부 표면의 세포를 채취해 암 전단계 이형성증 및 고위험군 인유두종바이러스 검출"},{"cat":"검사 및 약물","en":"Bone Mineral Density (DEXA Scan)","ko":"골밀도 검사 (DEXA)","desc":"척추와 대퇴골의 골밀도를 측정해 골다공증 및 골감소증을 진단하고 골절 위험도 평가"},{"cat":"검사 및 약물","en":"Biopsy & Histopathology","ko":"생검 / 조직 병리 검사","desc":"의심되는 혹이나 병변에서 소량의 조직을 채취하여 악성 암 여부를 최종 확진"},{"cat":"검사 및 약물","en":"Over-the-Counter (OTC) Medications","ko":"일반의약품 (OTC 약)","desc":"의사 처방전 없이 약국, 드럭스토어, 마트에서 직접 구입할 수 있는 진통제, 감기약"},{"cat":"검사 및 약물","en":"Prescription Medications (Rx)","ko":"전문의약품 (처방약)","desc":"의사의 공식 처방전이 등록되어야만 면허 약사가 조제할 수 있는 치료 의약품"},{"cat":"검사 및 약물","en":"Antibiotics (Finish entire course)","ko":"항생제 (처방 일수 완복 필수)","desc":"세균 감염 치료제. 임의로 복용을 중단하면 내성균이 발생하므로 처방 일수를 끝까지 복용"},{"cat":"검사 및 약물","en":"Pain Reliever / NSAIDs","ko":"진통소염제 (Advil, Aleve, Tylenol)","desc":"소염진통제(이부프로펜, 나프록센) 및 해열진통제(아세트아미노펜). 위장 보호 주의"},{"cat":"검사 및 약물","en":"Antihistamine","ko":"항히스타민제","desc":"알레르기 비염, 재채기, 콧물, 가려움증 완화제 (지르텍, 알레그라, 클라리틴)"},{"cat":"검사 및 약물","en":"Blood Thinner / Anticoagulant","ko":"항응고제 / 혈액 희석제","desc":"혈전(피떡) 생성을 억제해 뇌졸중을 예방하는 약물 (엘리퀴스, 자렐토, 와파린)"},{"cat":"검사 및 약물","en":"Statin (Cholesterol-lowering drug)","ko":"스타틴계 콜레스테롤 저하제","desc":"간에서 콜레스테롤 합성을 억제하여 심근경색과 뇌졸중 발생률을 낮추는 핵심 약제"},{"cat":"검사 및 약물","en":"Insulin Injection / Pen","ko":"인슐린 주사 / 인슐린 펜","desc":"혈당 조절이 어려운 당뇨 환자가 피하에 직접 자가 투여하는 호르몬 치료제"},{"cat":"검사 및 약물","en":"Inhaler / Bronchodilator","ko":"흡입기 / 기관지 확장제","desc":"천식이나 만성폐쇄성폐질환(COPD) 환자가 기도로 직접 흡입하는 알부테롤 등"},{"cat":"검사 및 약물","en":"Adverse Drug Reaction / Side Effect","ko":"약물 이상 반응 / 부작용","desc":"약 복용 후 발생하는 어지럼증, 메스꺼움, 두드러기, 졸림 등의 원치 않는 신체 증상"},{"cat":"검사 및 약물","en":"Contrast Dye (IV Contrast)","ko":"조영제 (CT / MRI 혈관 조영)","desc":"혈관과 병변을 선명하게 보기 위해 정맥 투여하는 약제. 신장 기능 검사 사전 확인 필수"},{"cat":"검사 및 약물","en":"Fecal Immunochemical Test (FIT)","ko":"분변잠혈검사 (FIT 키트)","desc":"대변 속에 섞인 미세 출혈을 감지하여 대장암을 조기 스크리닝하는 간편 분변 검사"},{"cat":"검사 및 약물","en":"Spirometry / Pulmonary Function Test","ko":"폐기능 검사 (폐활량 측정)","desc":"숨을 힘껏 들이쉬고 내쉬며 폐용적과 기류 속도를 측정하여 천식 및 COPD 진단"},{"cat":"검사 및 약물","en":"Prostate-Specific Antigen (PSA)","ko":"전립선 특이항원 검사 (PSA)","desc":"남성 혈액 검사를 통해 전립선 비대증, 전립선염, 전립선암 선별 스크리닝"},{"cat":"검사 및 약물","en":"Sedation / Local Anesthesia","ko":"수면 진정 마취 / 국소 마취","desc":"내시경 시 편안한 진정 마취(Sedation) 및 국소 부위 통증 차단(Local Anesthesia)"},{"cat":"검사 및 약물","en":"Prior Authorization (PA)","ko":"보험사 사전 승인 (PA)","desc":"고가 약물이나 특수 MRI/CT 검사 전 보험사가 비용 지급을 사전 심사·승인하는 절차"},{"cat":"검사 및 약물","en":"Hemodialysis","ko":"혈액 투석","desc":"인공신장기 투석기를 통해 혈액 속 노폐물과 과잉 수분을 체외에서 정화하는 치료"},{"cat":"검사 및 약물","en":"Vaccine Booster / Flu Shot","ko":"백신 부스터샷 / 독감 예방접종","desc":"인플루엔자, 폐렴구균, 대상포진(Shingrix), 코로나19 면역 강화를 위한 예방접종"},{"cat":"진료실 회화","en":"I need a Korean interpreter, please.","ko":"한국어 의료 통역사를 요청합니다.","desc":"미국 병원/진료소에서 연방 민권법(Title VI)에 따라 무료 통역 서비스를 법적으로 요청"},{"cat":"진료실 회화","en":"Is this clinic in-network with my insurance?","ko":"제 보험 네트워크에 포함된 병원인가요?","desc":"예상치 못한 아웃오브네트워크(Out-of-network) 과다 청구를 방지하기 위한 사전 필수 확인"},{"cat":"진료실 회화","en":"What is my Copay and Deductible?","ko":"제 코페이와 디덕터블(본인부담금)은 얼마인가요?","desc":"진료 당일 현장 지불액(Copay) 및 연간 기본 본인부담금(Deductible) 확인"},{"cat":"진료실 회화","en":"Do I need a referral to see a specialist?","ko":"전문의 진료를 위해 주치의 의뢰서(Referral)가 필요한가요?","desc":"HMO 플랜의 경우 주치의 사전 의뢰서가 없으면 전문의 진료비 보험 처리가 거절됨"},{"cat":"진료실 회화","en":"Can I apply for Financial Assistance / Charity Care?","ko":"병원비 재정 지원(Charity Care)을 신청할 수 있나요?","desc":"무보험자 또는 저소득층의 경우 주정부 지원 병원비 50%~100% 감면 신청서 요청"},{"cat":"진료실 회화","en":"Can I make an appointment with a Korean-speaking doctor?","ko":"한국어를 구사하는 의사 선생님으로 진료 예약이 가능한가요?","desc":"초진 접수 시 한국어 가능 의료진 지정 요청"},{"cat":"진료실 회화","en":"I am allergic to penicillin and sulfa drugs.","ko":"저는 페니실린과 설파제 계열 항생제에 알레르기가 있습니다.","desc":"처방 전 반드시 의사와 간호사에게 알려야 하는 약물 알레르기 표현"},{"cat":"진료실 회화","en":"Here is the list of medications I am currently taking.","ko":"제가 현재 복용 중인 약물 목록입니다.","desc":"약물 상호작용 방지를 위해 기존 복용 혈압약, 당뇨약, 영양제 목록 제출"},{"cat":"진료실 회화","en":"How many times a day and when should I take this medicine?","ko":"이 약을 하루에 몇 번, 언제 복용해야 하나요?","desc":"식전(Before meals), 식후(After meals), 취침 전(At bedtime) 복용법 확인"},{"cat":"진료실 회화","en":"Does this medication cause dizziness or drowsiness?","ko":"이 약을 복용하면 어지럽거나 졸릴 수 있나요?","desc":"운전이나 업무에 영향을 주는 약물 부작용 및 주의사항 확인"},{"cat":"진료실 회화","en":"Can you prescribe a generic equivalent to lower the cost?","ko":"약값을 절약할 수 있도록 제네릭(복제약)으로 처방해 주실 수 있나요?","desc":"브랜드 오리지널약 대신 동일 성분의 저렴한 제네릭 처방 요청"},{"cat":"진료실 회화","en":"When and how will I receive my test results?","ko":"제 검사 결과는 언제, 어떻게 전달받게 되나요?","desc":"혈액 검사나 조직 검사 결과 소요 일수 및 환자 포털(Patient Portal) 확인법 질의"},{"cat":"진료실 회화","en":"Can you transfer a copy of my medical records to my new doctor?","ko":"제 의무기록 사본을 새로운 주치의 병원으로 전송해 주실 수 있나요?","desc":"병원 이전 시 필요한 의료기록 열람 및 전송 동의서(Medical Release Form) 작성"},{"cat":"진료실 회화","en":"I am uninsured. Can I get a self-pay cash discount?","ko":"건강보험이 없습니다. 비보험 현금 납부 시 할인(Self-pay discount)이 되나요?","desc":"무보험 환자가 병원비 30%~50% 현금 할인 협상을 요청할 때 필수 표현"},{"cat":"진료실 회화","en":"Can I set up an interest-free payment plan for this bill?","ko":"이 병원비에 대해 무이자 분할 납부(Payment Plan)가 가능한가요?","desc":"고액 의료비를 매월 감당 가능한 금액으로 나누어 납부하도록 재정 부서와 협의"},{"cat":"진료실 회화","en":"On a scale from 0 to 10, my pain level is about an 8.","ko":"0점부터 10점까지 중 제 통증 수치는 약 8점 정도입니다.","desc":"미국 병원에서 통증 척도(Pain Scale) 질문 시 주관적 통증 강도를 명확히 표현"},{"cat":"진료실 회화","en":"Do I need to fast before my blood test tomorrow morning?","ko":"내일 아침 피검사 전에 물이나 음식을 금식(Fasting)해야 하나요?","desc":"공복 혈당 및 콜레스테롤 검사를 위한 8~12시간 금식 여부 확인"},{"cat":"진료실 회화","en":"Please provide a doctor's note for my employer / school.","ko":"직장/학교에 제출할 의사 소견서(진단서)를 발급해 주세요.","desc":"병가 사유 증명 및 결근 증빙을 위한 공식 의사 소견서 요청"},{"cat":"진료실 회화","en":"Is this test covered by my insurance or requires prior authorization?","ko":"이 검사가 보험 적용이 되나요, 아니면 사전 승인이 필요한가요?","desc":"검사 후 예상치 못한 전액 자비 부담을 방지하기 위한 사전 확인"},{"cat":"진료실 회화","en":"Who should I call if my symptoms worsen after office hours?","ko":"진료 시간 외 야간이나 주말에 증상이 악화되면 어디로 연락해야 하나요?","desc":"당직 간호사 상담 전화(After-hours line) 및 응급실 방문 지침 확인"},{"cat":"진료실 회화","en":"Can I get a 90-day supply prescription via mail order?","ko":"만성질환 약을 우편 배송으로 90일 치 처방받을 수 있나요?","desc":"장기 복용 약물을 저렴하고 편리하게 3개월분 단위로 수령하는 방법"},{"cat":"진료실 회화","en":"I had gallbladder surgery five years ago.","ko":"저는 5년 전에 담낭(쓸개) 절제 수술을 받은 적이 있습니다.","desc":"과거 수술 이력 및 입원 병력(Past Surgical History)을 설명할 때 사용"},{"cat":"진료실 회화","en":"There is a strong family history of stroke and heart disease.","ko":"저희 가족력에 뇌졸중과 심장마비 병력이 있습니다.","desc":"의사가 유전적 질환 위험도를 평가할 수 있도록 가족력(Family History) 전달"},{"cat":"진료실 회화","en":"I am requesting an itemized bill with CPT and ICD codes.","ko":"CPT 진료 코드와 ICD 진단 코드가 기재된 상세 청구서를 요청합니다.","desc":"과다 청구 확인, 이의 제기, 보험사 EOB 대조를 위한 상세 항목 청구서 요청"},{"cat":"진료실 회화","en":"Could you please speak a little more slowly and simply?","ko":"조금만 더 천천히, 알기 쉽게 설명해 주실 수 있나요?","desc":"의료진의 설명이 빠르거나 전문 용어가 어려울 때 정중한 배려 요청"},{"cat":"진료실 회화","en":"Is it safe to take this prescription with my herbal supplements?","ko":"이 처방약을 제가 먹는 홍삼, 영양제와 함께 복용해도 안전한가요?","desc":"한약, 건강기능식품, 비타민과 처방약 간의 상호작용 위험 점검"},{"cat":"진료실 회화","en":"What should I do if I miss a dose of this medication?","ko":"만약 이 약 복용 시간을 놓치면 어떻게 해야 하나요?","desc":"약 복용을 잊었을 때 다음 복용 시 두 배로 먹지 않도록 지침 확인"},{"cat":"진료실 회화","en":"Could you write down the diagnosis and instructions for me?","ko":"진단명과 주의사항을 종이에 적어주실 수 있나요?","desc":"귀가 후 가족과 공유하거나 복습할 수 있도록 서면 메모 요청"},{"cat":"진료실 회화","en":"Which pharmacy has my electronic prescription been sent to?","ko":"제 전자 처방전이 어느 약국으로 전송되었나요?","desc":"처방약 수령을 위해 등록된 단골 약국(CVS, Walgreens 등) 확인"},{"cat":"진료실 회화","en":"Does this bill include both hospital fees and physician fees?","ko":"이 청구서에 병원 시설 이용료와 의사 진료비가 모두 포함되었나요?","desc":"미국 병원의 복수 청구(Facility Fee vs Physician Fee) 여부 확인"},{"cat":"진료실 회화","en":"Can I receive routine preventive screening without a copay?","ko":"정기 예방 검진(Annual Check-up)은 코페이 없이 무료로 받을 수 있나요?","desc":"ACA 규정에 따라 100% 무료 커버되는 예방 진료 범위 사전 확인"},{"cat":"진료실 회화","en":"How long is the estimated wait time in the emergency room?","ko":"응급실에서 대략 얼마나 기다려야 의사 진료를 받을 수 있나요?","desc":"응급실 트리아지(Triage) 중증도 분류 후 대기 시간 문의"}];

    function PatientHubPage() {
      var _useStateTab = (0, t.useState)(function() {
        if (typeof window !== "undefined") {
          var params = new URLSearchParams(window.location.search);
          var hash = window.location.hash.replace("#", "");
          var tabParam = params.get("tab") || hash;
          if (tabParam === "matcher" || tabParam === "calculator" || tabParam === "dictionary" || tabParam === "portal") {
            return tabParam;
          }
        }
        return "calculator";
      }), activeTab = _useStateTab[0], setActiveTab = _useStateTab[1];

      (0, t.useEffect)(function() {
        if (typeof window !== "undefined") {
          function onHashOrPop() {
            var params = new URLSearchParams(window.location.search);
            var hash = window.location.hash.replace("#", "");
            var tabParam = params.get("tab") || hash;
            if (tabParam === "matcher" || tabParam === "calculator" || tabParam === "dictionary" || tabParam === "portal") {
              setActiveTab(tabParam);
            }
          }
          window.addEventListener("popstate", onHashOrPop);
          window.addEventListener("hashchange", onHashOrPop);
          return function() {
            window.removeEventListener("popstate", onHashOrPop);
            window.removeEventListener("hashchange", onHashOrPop);
          };
        }
      }, []);

      function changeTab(tabName) {
        setActiveTab(tabName);
        if (typeof window !== "undefined") {
          var url = new URL(window.location.href);
          url.searchParams.set("tab", tabName);
          window.history.pushState({}, "", url.toString());
        }
      }

      /* 1. MATCHER STATE */
      var _mStep = (0, t.useState)(1), mStep = _mStep[0], setMStep = _mStep[1];
      var _mAge = (0, t.useState)(""), mAge = _mAge[0], setMAge = _mAge[1];
      var _mStatus = (0, t.useState)(""), mStatus = _mStatus[0], setMStatus = _mStatus[1];
      var _mIncome = (0, t.useState)(""), mIncome = _mIncome[0], setMIncome = _mIncome[1];
      var _mResult = (0, t.useState)(null), mResult = _mResult[0], setMResult = _mResult[1];

      function calcMatcher() {
        var a = parseInt(mAge, 10);
        if (isNaN(a)) return;
        if (a >= 65) {
          if (mIncome === "low" || mIncome === "very_low") {
            setMResult("메디케어 + 메디케이드(NJ FamilyCare) 이중 자격(Dual Eligible / D-SNP) 또는 뉴저지 주정부 메디케어 저축 프로그램(MSP - Part B 보험료 전액 대납) 및 처방약 보조 프로그램(PAAD) 지원 대상일 가능성이 매우 높습니다.");
          } else if (mIncome === "medium") {
            setMResult("오리지널 메디케어(Part A & B) + 서플리먼트(Medigap) + Part D 처방약 플랜, 또는 치과/안과/OTC 카드 혜택이 풍부한 메디케어 어드밴티지(Part C)를 비교 선택하시기 바랍니다. 소득에 따라 Senior Gold 처방약 할인 혜택도 가능합니다.");
          } else {
            setMResult("메디케어 기본 보장(Part A & B)과 함께 병원 선택의 자유도가 높은 오리지널 메디케어 + Medigap Plan G 조합이나, 프리미엄 메디케어 어드밴티지(Part C PPO) 플랜을 추천합니다. 고소득자의 경우 Part B/D IRMAA 추가 할증료가 적용될 수 있습니다.");
          }
        } else {
          if (mIncome === "very_low") {
            if (mStatus === "시민권자" || mStatus === "영주권자 (5년 이상)") {
              setMResult("뉴저지 주 메디케이드 (NJ FamilyCare) 전액 무료 건강보험 신청 대상입니다. 월 보험료 $0 및 본인부담금 $0~$5 수준으로 연중 365일 언제든 신청하실 수 있습니다.");
            } else if (mStatus === "서류미비 / 기타") {
              setMResult("뉴저지 병원비 감면 프로그램(Charity Care)을 통해 급성기 병원 및 응급 진료비를 소득에 따라 50%~100% 주정부 지원으로 감면받으실 수 있습니다. 임산부 및 19세 미만 자녀는 'Cover All Kids'로 체류 신분과 무관하게 무료 메디케이드가 적용됩니다.");
            } else {
              setMResult("GetCoveredNJ 마켓플레이스를 통한 플랜 가입 또는 뉴저지 병원비 감면(Charity Care) 지원 대상입니다.");
            }
          } else if (mIncome === "low") {
            setMResult("GetCoveredNJ 마켓플레이스를 통해 연방 세액 공제(APTC) + 뉴저지 주정부 추가 지원금(NJHPS) + 실버 플랜 비용 분담 감면(CSR) 3중 혜택을 받으실 수 있습니다. 실버 플랜 선택 시 디덕터블과 병원 코페이가 획기적으로 낮아집니다.");
          } else if (mIncome === "medium") {
            setMResult("GetCoveredNJ 마켓플레이스를 통해 연방 세액 공제(APTC) 및 뉴저지 주정부 지원금(NJHPS)을 지원받아 월 보험료를 크게 절감하실 수 있습니다.");
          } else {
            setMResult("GetCoveredNJ 또는 민간 건강보험 플랜 가입 대상입니다. 뉴저지주 의무 가입 규정(Individual Mandate)에 따라 무보험 시 주 세금 보고 시 벌금이 부과되므로 적격 보험 유지가 필수적입니다.");
          }
        }
      }

      /* 2. CALCULATOR STATE */
      var _calcSize = (0, t.useState)(1), calcSize = _calcSize[0], setCalcSize = _calcSize[1];
      var _calcIncome = (0, t.useState)(30000), calcIncome = _calcIncome[0], setCalcIncome = _calcIncome[1];

      var fplBase = 15650 + (calcSize - 1) * 5500;
      var fplRatio = Math.round((calcIncome / fplBase) * 100);

      var isMedicaid = fplRatio <= 138;
      var isSilverCsr = fplRatio > 138 && fplRatio <= 250;
      var isAptcOnly = fplRatio > 250 && fplRatio <= 400;

      var benchmarkCost = 520 * calcSize;
      var expectedContribution = 0;
      if (fplRatio <= 150) expectedContribution = 0;
      else if (fplRatio <= 200) expectedContribution = (calcIncome * 0.02) / 12;
      else if (fplRatio <= 250) expectedContribution = (calcIncome * 0.04) / 12;
      else if (fplRatio <= 300) expectedContribution = (calcIncome * 0.06) / 12;
      else if (fplRatio <= 400) expectedContribution = (calcIncome * 0.085) / 12;
      else expectedContribution = benchmarkCost;

      var fedSubsidy = Math.max(0, Math.round(benchmarkCost - expectedContribution));
      var njSubsidy = isMedicaid ? 0 : (fplRatio <= 400 ? Math.round(75 * calcSize) : 0);
      var totalSubsidy = fedSubsidy + njSubsidy;
      var estBronze = Math.max(0, Math.round(380 * calcSize - totalSubsidy));
      var estSilver = Math.max(0, Math.round(520 * calcSize - totalSubsidy));
      var estGold = Math.max(0, Math.round(650 * calcSize - totalSubsidy));

      /* 3. DICTIONARY STATE */
      var _dictSearch = (0, t.useState)(""), dictSearch = _dictSearch[0], setDictSearch = _dictSearch[1];
      var _dictCat = (0, t.useState)("전체"), dictCat = _dictCat[0], setDictCat = _dictCat[1];
      var _copiedIdx = (0, t.useState)(null), copiedIdx = _copiedIdx[0], setCopiedIdx = _copiedIdx[1];

      var filteredDict = DICT_ITEMS.filter(function(item) {
        var matchCat = dictCat === "전체" || item.cat === dictCat;
        var q = dictSearch.trim().toLowerCase();
        var matchQ = !q || item.en.toLowerCase().indexOf(q) !== -1 || item.ko.toLowerCase().indexOf(q) !== -1 || item.desc.toLowerCase().indexOf(q) !== -1;
        return matchCat && matchQ;
      });

      function copyText(txt, idx) {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(txt);
          setCopiedIdx(idx);
          setTimeout(function() { setCopiedIdx(null); }, 1500);
        }
      }

      /* 4. PORTAL STATE */
      var _portalMode = (0, t.useState)("ai"), portalMode = _portalMode[0], setPortalMode = _portalMode[1];
      var _pName = (0, t.useState)(""), pName = _pName[0], setPName = _pName[1];
      var _pDob = (0, t.useState)(""), pDob = _pDob[0], setPDob = _pDob[1];
      var _pPhone = (0, t.useState)(""), pPhone = _pPhone[0], setPPhone = _pPhone[1];
      var _pDept = (0, t.useState)("일반 내과"), pDept = _pDept[0], setPDept = _pDept[1];
      var _pSymp = (0, t.useState)(""), pSymp = _pSymp[0], setPSymp = _pSymp[1];
      var _pChartDone = (0, t.useState)(null), pChartDone = _pChartDone[0], setPChartDone = _pChartDone[1];

      function submitChart() {
        if (!pName || !pPhone) {
          alert("성함과 연락처를 입력해주세요.");
          return;
        }
        var chartNumber = "NJAP-" + Math.floor(100000 + Math.random() * 900000);
        setPChartDone({
          num: chartNumber,
          name: pName,
          dob: pDob || "미입력",
          phone: pPhone,
          dept: pDept,
          symp: pSymp || "상담 시 직접 설명"
        });
      }

      return (0, s.jsxs)("div", {
        className: "min-h-[calc(100vh-109px)] bg-slate-50 flex flex-col font-sans pb-16",
        children: [
          /* Top Header */
          (0, s.jsx)("section", {
            className: "bg-slate-900 text-white py-10 sm:py-14 border-b border-slate-800",
            children: (0, s.jsxs)("div", {
              className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
              children: [
                (0, s.jsx)("span", {
                  className: "inline-block text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider mb-3",
                  children: "ONE-STOP HEALTHCARE SERVICES"
                }),
                (0, s.jsx)("h1", {
                  className: "font-serif text-3xl sm:text-4xl text-white mb-3",
                  children: "원스톱 의료 접근 & 환자 종합 센터"
                }),
                (0, s.jsx)("p", {
                  className: "text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed mb-6",
                  children: "보험 자격 진단, 2026 ACA 보조금 계산, 영-한 의학 용어 사전, 스마트 환자 AI 상담 및 병원 사전접수 서비스를 자유롭게 이용하세요."
                }),

                /* 4 Multi-Tool Tabs */
                (0, s.jsxs)("div", {
                  className: "grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-4xl",
                  children: [
                    (0, s.jsxs)("button", {
                      onClick: function() { changeTab("matcher"); },
                      className: "p-3 sm:p-4 rounded-xl text-left transition-all border " + (activeTab === "matcher" ? "bg-blue-600 text-white border-blue-400 shadow-md font-bold" : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80"),
                      children: [
                        (0, s.jsx)("div", { className: "text-xl mb-1", children: "🏥" }),
                        (0, s.jsx)("div", { className: "text-xs sm:text-sm font-semibold", children: "1. 자격 진단기" }),
                        (0, s.jsx)("div", { className: "text-[11px] opacity-80 hidden sm:block", children: "메디케어 & ACA" })
                      ]
                    }),
                    (0, s.jsxs)("button", {
                      onClick: function() { changeTab("calculator"); },
                      className: "p-3 sm:p-4 rounded-xl text-left transition-all border " + (activeTab === "calculator" ? "bg-blue-600 text-white border-blue-400 shadow-md font-bold" : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80"),
                      children: [
                        (0, s.jsx)("div", { className: "text-xl mb-1", children: "🧮" }),
                        (0, s.jsx)("div", { className: "text-xs sm:text-sm font-semibold", children: "2. 보조금 계산기" }),
                        (0, s.jsx)("div", { className: "text-[11px] opacity-80 hidden sm:block", children: "2026 ACA & NJHPS" })
                      ]
                    }),
                    (0, s.jsxs)("button", {
                      onClick: function() { changeTab("dictionary"); },
                      className: "p-3 sm:p-4 rounded-xl text-left transition-all border " + (activeTab === "dictionary" ? "bg-blue-600 text-white border-blue-400 shadow-md font-bold" : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80"),
                      children: [
                        (0, s.jsx)("div", { className: "text-xl mb-1", children: "📖" }),
                        (0, s.jsx)("div", { className: "text-xs sm:text-sm font-semibold", children: "3. 의학 용어 사전" }),
                        (0, s.jsx)("div", { className: "text-[11px] opacity-80 hidden sm:block", children: "영-한 병원 표현" })
                      ]
                    }),
                    (0, s.jsxs)("button", {
                      onClick: function() { changeTab("portal"); },
                      className: "p-3 sm:p-4 rounded-xl text-left transition-all border " + (activeTab === "portal" ? "bg-blue-600 text-white border-blue-400 shadow-md font-bold" : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80"),
                      children: [
                        (0, s.jsx)("div", { className: "text-xl mb-1", children: "🤖" }),
                        (0, s.jsx)("div", { className: "text-xs sm:text-sm font-semibold", children: "4. AI & 사전접수" }),
                        (0, s.jsx)("div", { className: "text-[11px] opacity-80 hidden sm:block", children: "질문센터 & 차트" })
                      ]
                    })
                  ]
                })
              ]
            })
          }),

          /* Main Tool Body Container */
          (0, s.jsx)("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4",
            children: (0, s.jsxs)("div", {
              className: "bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10",
              children: [

                /* TAB 1: INSURANCE MATCHER */
                activeTab === "matcher" && (0, s.jsxs)("div", {
                  className: "max-w-3xl mx-auto",
                  children: [
                    (0, s.jsxs)("div", {
                      className: "text-center mb-8",
                      children: [
                        (0, s.jsx)("span", { className: "text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1", children: "TOOL 1 · INSURANCE MATCHER" }),
                        (0, s.jsx)("h2", { className: "font-serif text-2xl sm:text-3xl text-slate-900 mb-2", children: "메디케어 & ACA 맞춤 자격 진단기" }),
                        (0, s.jsx)("p", { className: "text-xs sm:text-sm text-slate-600", children: "만 나이, 체류 신분, 가구 소득에 따른 가장 유리한 건강보험 프로그램 및 주정부 지원 혜택을 산출합니다." })
                      ]
                    }),

                    mResult ? (
                      (0, s.jsxs)("div", {
                        className: "text-center py-6",
                        children: [
                          (0, s.jsx)("div", { className: "w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-blue-100", children: "💡" }),
                          (0, s.jsx)("h3", { className: "font-serif text-2xl text-slate-900 mb-3", children: "맞춤 추천 결과" }),
                          (0, s.jsx)("div", { className: "p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left mb-6 text-slate-800 leading-relaxed text-sm sm:text-base", children: mResult }),
                          (0, s.jsxs)("div", {
                            className: "flex flex-col sm:flex-row gap-3 justify-center",
                            children: [
                              (0, s.jsx)("button", { onClick: function() { setMResult(null); setMStep(1); }, className: "btn-outline text-sm py-3 px-6", children: "다시 진단하기" }),
                              (0, s.jsx)("button", { onClick: function() { changeTab("calculator"); }, className: "btn-primary text-sm py-3 px-6", children: "보조금 계산기로 이동 →" })
                            ]
                          })
                        ]
                      })
                    ) : (
                      (0, s.jsxs)("div", {
                        children: [
                          (0, s.jsxs)("div", {
                            className: "flex items-center justify-between mb-6 text-xs text-slate-500 font-medium",
                            children: [
                              (0, s.jsxs)("span", { children: ["진단 단계 ", mStep, " / 3"] }),
                              (0, s.jsx)("div", { className: "w-32 bg-slate-200 h-2 rounded-full overflow-hidden", children: (0, s.jsx)("div", { className: "bg-blue-600 h-full transition-all duration-300", style: { width: ((mStep / 3) * 100) + "%" } }) })
                            ]
                          }),

                          mStep === 1 && (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsx)("label", { className: "block text-sm font-semibold text-slate-800 mb-2", children: "만 나이를 입력해주세요:" }),
                              (0, s.jsx)("input", {
                                type: "number",
                                value: mAge,
                                onChange: function(e) { setMAge(e.target.value); },
                                placeholder: "예: 65",
                                className: "w-full p-3.5 rounded-xl border border-slate-300 mb-6 text-base outline-none focus:border-blue-500"
                              }),
                              (0, s.jsx)("button", { disabled: !mAge, onClick: function() { setMStep(2); }, className: "btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-50", children: "다음 단계 →" })
                            ]
                          }),

                          mStep === 2 && (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsx)("label", { className: "block text-sm font-semibold text-slate-800 mb-2", children: "미국 체류 신분을 선택해주세요:" }),
                              (0, s.jsx)("div", {
                                className: "space-y-2.5 mb-6",
                                children: ["시민권자", "영주권자 (5년 이상)", "합법 비자 (H-1B, E-2, L-1, F-1 OPT 등)", "서류미비 / 기타"].map(function(item) {
                                  return (0, s.jsx)("button", {
                                    key: item,
                                    onClick: function() { setMStatus(item); },
                                    className: "w-full text-left p-3.5 rounded-xl border text-sm transition-all " + (mStatus === item ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50")
                                  }, item);
                                })
                              }),
                              (0, s.jsxs)("div", {
                                className: "flex gap-3",
                                children: [
                                  (0, s.jsx)("button", { onClick: function() { setMStep(1); }, className: "btn-outline text-sm py-3 px-6", children: "이전" }),
                                  (0, s.jsx)("button", { disabled: !mStatus, onClick: function() { setMStep(3); }, className: "btn-primary flex-1 justify-center py-3 text-sm disabled:opacity-50", children: "다음 단계 →" })
                                ]
                              })
                            ]
                          }),

                          mStep === 3 && (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsx)("label", { className: "block text-sm font-semibold text-slate-800 mb-2", children: "가구 총 연간 소득 수준을 선택해주세요:" }),
                              (0, s.jsx)("div", {
                                className: "space-y-2.5 mb-6",
                                children: [
                                  { id: "very_low", label: "저소득층 (1인 연 $21,597 이하 / FPL 138% 이하 - 메디케이드)" },
                                  { id: "low", label: "중저소득층 (1인 연 $21,597 ~ $39,125 / FPL 250% 이하 - 실버 CSR)" },
                                  { id: "medium", label: "중간소득층 (1인 연 $39,125 ~ $70,000 / APTC 보조금 지원)" },
                                  { id: "high", label: "고소득층 (1인 연 $70,000 이상)" }
                                ].map(function(item) {
                                  return (0, s.jsx)("button", {
                                    key: item.id,
                                    onClick: function() { setMIncome(item.id); },
                                    className: "w-full text-left p-3.5 rounded-xl border text-sm transition-all " + (mIncome === item.id ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50")
                                  }, item.id);
                                })
                              }),
                              (0, s.jsxs)("div", {
                                className: "flex gap-3",
                                children: [
                                  (0, s.jsx)("button", { onClick: function() { setMStep(2); }, className: "btn-outline text-sm py-3 px-6", children: "이전" }),
                                  (0, s.jsx)("button", { disabled: !mIncome, onClick: calcMatcher, className: "btn-primary flex-1 justify-center py-3 text-sm disabled:opacity-50", children: "진단 결과 확인하기 ✨" })
                                ]
                              })
                            ]
                          })
                        ]
                      })
                    )
                  ]
                }),

                /* TAB 2: ACA SUBSIDY CALCULATOR */
                activeTab === "calculator" && (0, s.jsxs)("div", {
                  className: "max-w-4xl mx-auto",
                  children: [
                    (0, s.jsxs)("div", {
                      className: "text-center mb-8",
                      children: [
                        (0, s.jsx)("span", { className: "text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1", children: "TOOL 2 · 2026 ACA & NJHPS CALCULATOR" }),
                        (0, s.jsx)("h2", { className: "font-serif text-2xl sm:text-3xl text-slate-900 mb-2", children: "2026 ACA 건강보험료 보조금 계산기" }),
                        (0, s.jsx)("p", { className: "text-xs sm:text-sm text-slate-600", children: "가족 수와 연간 총소득을 입력하시면 2026년 기준 연방 세액 공제(APTC) 및 뉴저지 주정부 지원금(NJHPS)을 실시간 산출합니다." })
                      ]
                    }),

                    (0, s.jsxs)("div", {
                      className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start",
                      children: [
                        /* Inputs Left Column */
                        (0, s.jsxs)("div", {
                          className: "lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6",
                          children: [
                            /* Household size */
                            (0, s.jsxs)("div", {
                              children: [
                                (0, s.jsxs)("div", { className: "flex justify-between items-center mb-2", children: [
                                  (0, s.jsx)("label", { className: "text-xs font-bold text-slate-700", children: "1. 가구원 수 (Tax Household)" }),
                                  (0, s.jsxs)("span", { className: "text-sm font-bold text-blue-600", children: [calcSize, "인 가구"] })
                                ] }),
                                (0, s.jsx)("div", {
                                  className: "grid grid-cols-5 gap-1.5",
                                  children: [1, 2, 3, 4, 5].map(function(num) {
                                    return (0, s.jsxs)("button", {
                                      key: num,
                                      onClick: function() { setCalcSize(num); },
                                      className: "py-2 text-xs font-bold rounded-lg transition-all " + (calcSize === num ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"),
                                      children: [num, "인"]
                                    });
                                  })
                                })
                              ]
                            }),

                            /* Annual Income */
                            (0, s.jsxs)("div", {
                              children: [
                                (0, s.jsxs)("div", { className: "flex justify-between items-center mb-2", children: [
                                  (0, s.jsx)("label", { className: "text-xs font-bold text-slate-700", children: "2. 가구 연간 총소득 (MAGI)" }),
                                  (0, s.jsxs)("span", { className: "text-base font-bold text-blue-700", children: ["$", Number(calcIncome).toLocaleString(), " / 년"] })
                                ] }),
                                (0, s.jsx)("input", {
                                  type: "number",
                                  step: "1000",
                                  value: calcIncome,
                                  onChange: function(e) { setCalcIncome(Math.max(0, parseInt(e.target.value, 10) || 0)); },
                                  className: "w-full p-3 bg-white rounded-xl border border-slate-300 font-bold text-slate-900 mb-2 outline-none focus:border-blue-500"
                                }),
                                (0, s.jsx)("div", {
                                  className: "flex flex-wrap gap-1.5",
                                  children: [20000, 35000, 50000, 75000, 100000].map(function(preset) {
                                    return (0, s.jsxs)("button", {
                                      key: preset,
                                      onClick: function() { setCalcIncome(preset); },
                                      className: "px-2.5 py-1 text-[11px] font-medium bg-white rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100",
                                      children: ["$", (preset / 1000), "k"]
                                    });
                                  })
                                })
                              ]
                            }),

                            /* FPL Guidelines reference */
                            (0, s.jsxs)("div", {
                              className: "p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600",
                              children: [
                                (0, s.jsxs)("div", { className: "flex justify-between", children: [(0, s.jsx)("span", { children: "2026 연방 빈곤선 100%:" }), (0, s.jsxs)("strong", { children: ["$", fplBase.toLocaleString()] })] }),
                                (0, s.jsxs)("div", { className: "flex justify-between", children: [(0, s.jsx)("span", { children: "메디케이드 기준 (138%):" }), (0, s.jsxs)("strong", { className: "text-emerald-700", children: ["$", Math.round(fplBase * 1.38).toLocaleString()] })] }),
                                (0, s.jsxs)("div", { className: "flex justify-between", children: [(0, s.jsx)("span", { children: "실버 CSR 감면 기준 (250%):" }), (0, s.jsxs)("strong", { className: "text-blue-700", children: ["$", Math.round(fplBase * 2.5).toLocaleString()] })] })
                              ]
                            })
                          ]
                        }),

                        /* Results Right Column */
                        (0, s.jsxs)("div", {
                          className: "lg:col-span-7 space-y-5",
                          children: [
                            /* Poverty Level Gauge Box */
                            (0, s.jsxs)("div", {
                              className: "p-5 rounded-2xl border " + (isMedicaid ? "bg-emerald-50/70 border-emerald-200" : isSilverCsr ? "bg-blue-50/70 border-blue-200" : "bg-slate-50 border-slate-200"),
                              children: [
                                (0, s.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [
                                  (0, s.jsx)("span", { className: "text-xs font-bold text-slate-700", children: "연방 빈곤선(FPL) 소득 비율" }),
                                  (0, s.jsxs)("span", { className: "text-lg font-extrabold " + (isMedicaid ? "text-emerald-700" : isSilverCsr ? "text-blue-700" : "text-slate-800"), children: [fplRatio, "% FPL"] })
                                ] }),
                                (0, s.jsx)("div", {
                                  className: "w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-3",
                                  children: (0, s.jsx)("div", {
                                    className: "h-full transition-all duration-300 " + (isMedicaid ? "bg-emerald-500" : isSilverCsr ? "bg-blue-600" : "bg-indigo-600"),
                                    style: { width: Math.min(100, Math.max(5, (fplRatio / 400) * 100)) + "%" }
                                  })
                                }),
                                (0, s.jsx)("div", {
                                  className: "text-xs font-bold",
                                  children: isMedicaid ? (
                                    (0, s.jsx)("span", { className: "text-emerald-800", children: "✓ NJ FamilyCare (메디케이드) 100% 무료 건강보험 신청 대상입니다." })
                                  ) : isSilverCsr ? (
                                    (0, s.jsx)("span", { className: "text-blue-800", children: "✓ GetCoveredNJ 실버 CSR 감면 + 연방 APTC + 주정부 3중 보조금 대상입니다." })
                                  ) : isAptcOnly ? (
                                    (0, s.jsx)("span", { className: "text-slate-800", children: "✓ GetCoveredNJ 연방 APTC 세액 공제 + 주정부 보조금 지원 대상입니다." })
                                  ) : (
                                    (0, s.jsx)("span", { className: "text-slate-700", children: "✓ GetCoveredNJ 마켓플레이스 표준 플랜 가입 대상입니다." })
                                  )
                                })
                              ]
                            }),

                            /* Subsidy Breakdown Summary */
                            (0, s.jsxs)("div", {
                              className: "grid grid-cols-2 gap-3",
                              children: [
                                (0, s.jsxs)("div", {
                                  className: "p-4 bg-slate-900 text-white rounded-xl",
                                  children: [
                                    (0, s.jsx)("div", { className: "text-[11px] text-slate-400 mb-1", children: "월 예상 정부 보조금 (합산)" }),
                                    (0, s.jsxs)("div", { className: "text-2xl font-extrabold text-blue-300", children: ["$", totalSubsidy.toLocaleString(), (0, s.jsx)("span", { className: "text-xs font-normal text-white/70", children: " / 월" })] }),
                                    (0, s.jsxs)("div", { className: "text-[10px] text-white/50 mt-1", children: ["연간 약 $", (totalSubsidy * 12).toLocaleString(), " 절감"] })
                                  ]
                                }),
                                (0, s.jsxs)("div", {
                                  className: "p-4 bg-blue-50 border border-blue-200 rounded-xl",
                                  children: [
                                    (0, s.jsx)("div", { className: "text-[11px] text-blue-800 font-semibold mb-1", children: "추천 플랜 (Silver 실버)" }),
                                    (0, s.jsxs)("div", { className: "text-2xl font-extrabold text-blue-900", children: ["$", isMedicaid ? "0" : estSilver.toLocaleString(), (0, s.jsx)("span", { className: "text-xs font-normal text-slate-600", children: " / 월" })] }),
                                    (0, s.jsx)("div", { className: "text-[10px] text-blue-700 mt-1", children: isSilverCsr ? "★ 디덕터블 $0~$500 파격 감면" : "표준 실버 보장" })
                                  ]
                                })
                              ]
                            }),

                            /* Tier comparison */
                            (0, s.jsxs)("div", {
                              className: "p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs",
                              children: [
                                (0, s.jsx)("strong", { className: "block text-slate-800 text-sm mb-1", children: "플랜 등급별 예상 실부담 월 보험료:" }),
                                (0, s.jsxs)("div", { className: "flex justify-between p-2 bg-white rounded border border-slate-200", children: [(0, s.jsx)("span", { children: "🥉 Bronze (기본형)" }), (0, s.jsxs)("strong", { children: ["$", isMedicaid ? "0" : estBronze, " / 월"] })] }),
                                (0, s.jsxs)("div", { className: "flex justify-between p-2 bg-blue-50 rounded border border-blue-200 text-blue-900 font-bold", children: [(0, s.jsx)("span", { children: "🥈 Silver (추천 / CSR 감면)" }), (0, s.jsxs)("strong", { children: ["$", isMedicaid ? "0" : estSilver, " / 월"] })] }),
                                (0, s.jsxs)("div", { className: "flex justify-between p-2 bg-white rounded border border-slate-200", children: [(0, s.jsx)("span", { children: "🥇 Gold (종합형)" }), (0, s.jsxs)("strong", { children: ["$", isMedicaid ? "0" : estGold, " / 월"] })] })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                /* TAB 3: MEDICAL DICTIONARY */
                activeTab === "dictionary" && (0, s.jsxs)("div", {
                  className: "max-w-4xl mx-auto",
                  children: [
                    (0, s.jsxs)("div", {
                      className: "text-center mb-8",
                      children: [
                        (0, s.jsx)("span", { className: "text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1", children: "TOOL 3 · MEDICAL DICTIONARY" }),
                        (0, s.jsx)("h2", { className: "font-serif text-2xl sm:text-3xl text-slate-900 mb-2", children: "영-한 의학 용어 & 병원 실전 회화 사전" }),
                        (0, s.jsx)("p", { className: "text-xs sm:text-sm text-slate-600", children: "미국 병원, 클리닉, 응급실, 약국에서 자주 사용하는 필수 영문 의학 표현과 진료실 회화를 검색하세요." })
                      ]
                    }),

                    /* Search & Category filter */
                    (0, s.jsxs)("div", {
                      className: "mb-6 space-y-3",
                      children: [
                        (0, s.jsx)("input", {
                          type: "text",
                          value: dictSearch,
                          onChange: function(e) { setDictSearch(e.target.value); },
                          placeholder: "🔍 영어 단어, 한글 증상, 진료과목 검색 (예: Cardiology, 흉통, 혈압, 통역)...",
                          className: "w-full p-4 rounded-2xl border border-slate-300 text-sm outline-none focus:border-blue-600 shadow-xs"
                        }),
                        (0, s.jsx)("div", {
                          className: "flex flex-wrap gap-2",
                          children: ["전체", "진료과목", "증상 표현", "검사 및 약물", "진료실 회화"].map(function(c) {
                            return (0, s.jsx)("button", {
                              key: c,
                              onClick: function() { setDictCat(c); },
                              className: "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all " + (dictCat === c ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200")
                            }, c);
                          })
                        })
                      ]
                    }),

                    /* Dictionary Results Grid */
                    (0, s.jsx)("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                      children: filteredDict.length > 0 ? filteredDict.map(function(item, idx) {
                        return (0, s.jsxs)("div", {
                          key: idx,
                          className: "p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white transition-all shadow-xs flex flex-col justify-between",
                          children: [
                            (0, s.jsxs)("div", {
                              children: [
                                (0, s.jsxs)("div", { className: "flex justify-between items-center mb-1.5", children: [
                                  (0, s.jsx)("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wider", children: item.cat }),
                                  (0, s.jsx)("button", {
                                    onClick: function() { copyText(item.en + " (" + item.ko + ")", idx); },
                                    className: "text-[11px] text-blue-600 hover:underline font-medium",
                                    children: copiedIdx === idx ? "✓ 복사됨" : "복사"
                                  })
                                ] }),
                                (0, s.jsx)("h3", { className: "font-bold text-base text-slate-900", children: item.en }),
                                (0, s.jsx)("p", { className: "text-xs font-semibold text-blue-700 mb-2", children: item.ko }),
                                (0, s.jsx)("p", { className: "text-xs text-slate-600 leading-relaxed", children: item.desc })
                              ]
                            })
                          ]
                        });
                      }) : (
                        (0, s.jsx)("div", { className: "col-span-2 text-center py-10 text-slate-400 text-sm", children: "검색 결과가 없습니다. 다른 검색어를 입력해 보세요." })
                      )
                    })
                  ]
                }),

                /* TAB 4: PATIENT PORTAL & AI */
                activeTab === "portal" && (0, s.jsxs)("div", {
                  className: "max-w-5xl mx-auto",
                  children: [
                    (0, s.jsxs)("div", {
                      className: "flex justify-center gap-2 mb-6",
                      children: [
                        (0, s.jsx)("button", {
                          onClick: function() { setPortalMode("ai"); },
                          className: "px-5 py-2.5 rounded-full text-xs font-bold transition-all " + (portalMode === "ai" ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"),
                          children: "🤖 AI 스마트 의료 질문 센터"
                        }),
                        (0, s.jsx)("button", {
                          onClick: function() { setPortalMode("chart"); },
                          className: "px-5 py-2.5 rounded-full text-xs font-bold transition-all " + (portalMode === "chart" ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"),
                          children: "📝 온라인 병원 사전접수 차트"
                        })
                      ]
                    }),

                    portalMode === "ai" ? (
                      (0, s.jsx)("div", {
                        className: "w-full h-[650px] rounded-2xl overflow-hidden border border-slate-300 bg-slate-950",
                        children: (0, s.jsx)("iframe", {
                          src: "https://hacgenini.ai.studio",
                          title: "Healthcare Access Portal - 질문센터",
                          className: "w-full h-full border-0 block",
                          allow: "camera *; microphone *; geolocation *; display-capture *; clipboard-write *"
                        })
                      })
                    ) : (
                      (0, s.jsx)("div", {
                        className: "max-w-2xl mx-auto",
                        children: pChartDone ? (
                          (0, s.jsxs)("div", {
                            className: "p-8 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 space-y-4",
                            children: [
                              (0, s.jsx)("div", { className: "text-center pb-3 border-b border-slate-200", children: [
                                (0, s.jsx)("span", { className: "text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full", children: "사전접수 완료" }),
                                (0, s.jsx)("h3", { className: "font-serif text-2xl mt-2 font-bold text-slate-900", children: "병원 사전접수 확인증" }),
                                (0, s.jsxs)("p", { className: "text-xs text-slate-500 font-mono mt-1", children: ["접수 번호: ", pChartDone.num] })
                              ] }),
                              (0, s.jsxs)("div", { className: "space-y-2 text-sm", children: [
                                (0, s.jsxs)("div", { className: "flex justify-between", children: [(0, s.jsx)("span", { className: "text-slate-500", children: "환자 성함:" }), (0, s.jsx)("strong", { children: pChartDone.name })] }),
                                (0, s.jsxs)("div", { className: "flex justify-between", children: [(0, s.jsx)("span", { className: "text-slate-500", children: "생년월일:" }), (0, s.jsx)("span", { children: pChartDone.dob })] }),
                                (0, s.jsxs)("div", { className: "flex justify-between", children: [(0, s.jsx)("span", { className: "text-slate-500", children: "연락처:" }), (0, s.jsx)("span", { children: pChartDone.phone })] }),
                                (0, s.jsxs)("div", { className: "flex justify-between", children: [(0, s.jsx)("span", { className: "text-slate-500", children: "희망 진료과:" }), (0, s.jsx)("strong", { className: "text-blue-700", children: pChartDone.dept })] }),
                                (0, s.jsxs)("div", { className: "pt-2 border-t border-slate-200", children: [
                                  (0, s.jsx)("span", { className: "text-slate-500 text-xs block mb-1", children: "주요 증상 및 전달사항:" }),
                                  (0, s.jsx)("p", { className: "p-3 bg-white rounded-lg border border-slate-200 text-xs leading-relaxed", children: pChartDone.symp })
                                ] })
                              ] }),
                              (0, s.jsxs)("div", { className: "pt-4 flex gap-3 justify-center", children: [
                                (0, s.jsx)("button", { onClick: function() { window.print(); }, className: "btn-outline text-xs py-2.5 px-5", children: "🖨️ 확인증 인쇄" }),
                                (0, s.jsx)("button", { onClick: function() { setPChartDone(null); }, className: "btn-primary text-xs py-2.5 px-5", children: "새 접수 작성" })
                              ] })
                            ]
                          })
                        ) : (
                          (0, s.jsxs)("div", {
                            className: "space-y-4",
                            children: [
                              (0, s.jsxs)("div", { children: [
                                (0, s.jsx)("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "환자 성함 *" }),
                                (0, s.jsx)("input", { type: "text", value: pName, onChange: function(e) { setPName(e.target.value); }, placeholder: "홍길동", className: "w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500" })
                              ] }),
                              (0, s.jsxs)("div", { className: "grid grid-cols-2 gap-3", children: [
                                (0, s.jsxs)("div", { children: [
                                  (0, s.jsx)("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "생년월일" }),
                                  (0, s.jsx)("input", { type: "text", value: pDob, onChange: function(e) { setPDob(e.target.value); }, placeholder: "YYYY-MM-DD", className: "w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500" })
                                ] }),
                                (0, s.jsxs)("div", { children: [
                                  (0, s.jsx)("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "연락처 (전화번호) *" }),
                                  (0, s.jsx)("input", { type: "tel", value: pPhone, onChange: function(e) { setPPhone(e.target.value); }, placeholder: "201-000-0000", className: "w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500" })
                                ] })
                              ] }),
                              (0, s.jsxs)("div", { children: [
                                (0, s.jsx)("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "희망 진료과목" }),
                                (0, s.jsx)("select", { value: pDept, onChange: function(e) { setPDept(e.target.value); }, className: "w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500 bg-white", children: ["일반 내과", "심장내과", "신경과", "소화기내과", "가정의학과", "정형외과", "안과", "피부과"].map(function(d) {
                                  return (0, s.jsx)("option", { value: d }, d);
                                }) })
                              ] }),
                              (0, s.jsxs)("div", { children: [
                                (0, s.jsx)("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "주요 증상 및 메모" }),
                                (0, s.jsx)("textarea", { rows: 3, value: pSymp, onChange: function(e) { setPSymp(e.target.value); }, placeholder: "현재 겪고 계신 증상이나 문의사항을 간단히 적어주세요.", className: "w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500" })
                              ] }),
                              (0, s.jsx)("button", { onClick: submitChart, className: "btn-primary w-full justify-center py-3.5 text-sm", children: "사전접수 차트 생성하기 →" })
                            ]
                          })
                        )
                      })
                    )
                  ]
                })
              ]
            })
          })
        ]
      });
    }

    e.s(["default", 0, PatientHubPage]);
  }
]);
