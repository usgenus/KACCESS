const fs = require('fs');
const path = require('path');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const AUDIO_DIR = path.join(BASE_DIR, 'uploads/audio/guides');
if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR, { recursive: true });

function cleanForAudio(text) {
  if (!text) return '';
  let str = text;
  // Strip photos & figures & HTML
  str = str.replace(/\[(?:사진|PHOTO)[^\]]*\]/gi, '');
  str = str.replace(/!\[.*?\]\(.*?\)/gs, '');
  str = str.replace(/<[^>]+>/g, ' ');
  str = str.replace(/:::box\s*([\s\S]*?)\s*:::/g, '$1');
  str = str.replace(/https?:\/\/\S+/gi, '');

  // Skip English / redundant terms in parentheses without breaking Korean particles
  const particles = '(?:은|는|이|가|을|를|의|에|에서|에서는|에도|에만|에의|에게|으로|로|으로는|로는|으로도|로도|와|과|도|만|뿐|부터|까지|이나|나|이며|며|이란|란|이라|라|라서|이라서|처럼|같이|마저|조차)';
  str = str.replace(new RegExp('\\s*\\([^)]*\\)(?=' + particles + ')', 'gu'), '');
  str = str.replace(new RegExp('\\s*（[^）]*）(?=' + particles + ')', 'gu'), '');
  str = str.replace(/\s*\([^)]*\)/gu, ' ');
  str = str.replace(/\s*（[^）]*）/gu, ' ');

  // Clean markdown formatting symbols
  str = str.replace(/[*_#=+\-~]{2,}/g, ' ');
  str = str.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '$1');
  str = str.replace(/[《》]/g, '"');
  str = str.replace(/&/g, ' 그리고 ');
  str = str.replace(/[<>]/g, ' ');
  str = str.replace(/\s+/g, ' ').trim();
  return str;
}

const TIPS_SCRIPTS = {
  "tip-1": `GoodRx와 SingleCare 처방약 무료 할인 쿠폰 활용법과 실전 안내입니다.

미국에서 병원 진료를 마치고 처방전을 받아 약국에 갔을 때, 보험이 없거나 디덕터블이 남아있어서 약값이 60달러, 80달러씩 나와 깜짝 놀라시는 경우가 많습니다. 이때 약사 카운터에서 당황하지 마시고 바로 스마트폰으로 GoodRx나 SingleCare를 열어보세요.

예를 들어 뉴저지 포트리나 팰리세이즈파크 인근의 CVS, Walgreens, 또는 Walmart 약국에서 혈압약이나 위장약을 조제받을 때, 앱에서 약 이름과 우편번호만 입력하면 약국별 할인 가격이 바로 뜹니다. 보험 코페이가 50달러인데 GoodRx 쿠폰가는 12달러나 15달러로 훨씬 저렴한 경우가 정말 흔합니다. 회원가입이나 연회비도 전혀 없고 누구나 바로 쓸 수 있습니다.

약국 카운터에서 약사에게 스마트폰 쿠폰 화면을 보여주시면서 "Can you run this GoodRx discount instead?"라고 말씀하시면 바로 현장 할인가가 적용됩니다.

여기서 꼭 기억하셔야 할 실전 주의사항이 있습니다. 첫째, 연방 메디케어나 메디케이드와는 동시에 중복 적용할 수 없습니다. 메디케어 파트 D 코페이보다 GoodRx 현금 가격이 더 싼 경우, 메디케어 청구를 빼고 GoodRx 쿠폰으로 전액 현금 결제하는 방식을 선택하셔야 합니다. 둘째, 약국과 시기마다 할인 가격이 조금씩 변동되므로 약을 찾으러 가시기 직전에 최신 가격을 검색해 보시는 것이 좋습니다. 약값에 대해 더 궁금한 점이 있으시면 카카오톡으로 편하게 물어보세요.`,

  "tip-2": `마크 큐반의 Cost Plus Drugs 온라인 약국 실전 활용 가이드입니다.

당뇨, 고혈압, 고지혈증 같은 만성질환 약은 매달 평생 드셔야 하기 때문에 약값 부담이 만만치 않습니다. 일반 동네 약국에서는 유통 마진과 보험사 리베이트 때문에 30일치 약값이 수십 달러, 백 달러를 넘어가기도 하는데요. Cost Plus Drugs는 제약사 원가에 딱 15퍼센트의 마진과 조제비 3달러, 배송비 5달러만 붙여서 투명하게 판매하는 혁신적인 온라인 약국입니다.

실제 예를 들면, 동네 약국에서 보험 없이 한 달에 70달러 넘게 내던 만성질환 제네릭 약이 Cost Plus Drugs에서는 90일치, 즉 세 달 치가 15달러 안팎으로 해결되는 사례가 아주 많습니다. 보험이 전혀 없는 무보험자뿐만 아니라, 높은 디덕터블 때문에 약값을 전액 사비로 내셔야 하는 분들에게 매우 유리합니다.

이용하시는 방법도 간단합니다. 웹사이트에서 본인이 드시는 약 이름을 검색해 가격을 확인하신 후 회원가입을 하세요. 그리고 주치의 병원에 방문하시거나 전화하셔서 "제 처방전을 Cost Plus Drugs로 전자 전송해 주세요"라고 요청하시면 됩니다. 병원에서 처방전을 전송하면 집 주소로 우편 배송됩니다.

실전 팁으로는, 일반 우편 배송에 약 3일에서 5일 정도 소요되므로 감기나 급성 감염으로 바로 드셔야 하는 항생제보다는, 매달 정기적으로 복용하시는 만성질환 약을 최소 일주일 전에 미리 90일 단위로 주문하시는 것이 가장 경제적입니다.`,

  "tip-3": `고가 처방약 무료 지원 포털 NeedyMeds 실전 안내입니다.

다국적 제약사들이 만드는 오리지널 의약품, 예를 들어 류마티스 관절염 치료제, 천식 흡입기, 혹은 항암제 같은 특수 의약품은 제네릭 복제약이 없어서 한 달 약값이 수백 달러에서 수천 달러에 달하기도 합니다. 소득이 높지 않은 상황에서 이런 고가 약을 처방받으면 치료를 포기해야 하나 막막해하시는 분들이 많습니다.

이때 가장 먼저 찾아보셔야 할 곳이 바로 미국의 대표적 비영리 단체인 NeedyMeds입니다. 많은 분들이 잘 모르시지만, 대형 제약회사들은 저소득층과 무보험 환자를 위해 의약품을 100퍼센트 무료로 공급해 주는 환자 지원 프로그램, 즉 PAP를 의무적으로 운영하고 있습니다. NeedyMeds 웹사이트에 들어가셔서 복용 중인 약 이름을 검색하시면, 해당 제약사의 무료 지원 프로그램 자격 요건과 신청 서류를 한눈에 찾으실 수 있습니다.

많은 분들이 '미국 시민권자만 되는 것 아니냐'고 물어보시는데, 제약회사 지원 프로그램은 대부분 이민 신분이나 체류 신분을 문제 삼지 않으며 합법 영주권자는 물론 서류 미비자도 신청 가능한 경우가 많습니다.

만약 인터넷 검색이나 영어 서류 작성이 부담스러우시다면 NeedyMeds 무료 헬프라인 1-800-503-6897로 전화하셔서 한국어 통역을 요청하세요. 전문 상담원이 거주하시는 지역의 무료 클리닉과 약값 지원 재단을 친절하게 안내해 드립니다. 추가 도움이 필요하시면 카카오톡으로 문의해 주세요.`,

  "tip-4": `병원비 셀프페이 할인 요청 실전 협상 가이드입니다.

미국에서 건강보험이 없거나 유학생, 방문 비자 신분으로 병원 진료를 받아야 할 때 병원비 폭탄이 두려워 진료를 미루시는 경우가 많습니다. 하지만 미국의 거의 모든 병원과 전문 클리닉은 보험 없이 본인이 직접 결제하는 환자를 위한 셀프페이 할인 정책을 공식적으로 운영하고 있습니다.

병원 입장에서도 복잡한 보험 청구 과정과 심사 거절 위험 없이 즉시 현금이나 카드로 수납받는 것을 선호하기 때문에, 접수 창구나 수납과에서 "I do not have insurance, do you offer a self-pay discount?"라고 한마디만 정중하게 물어보셔도 정가에서 20퍼센트에서 많게는 40퍼센트까지 즉시 할인이 적용됩니다.

실제 병원에 가실 때 꼭 챙기셔야 할 두 가지 핵심 요령이 있습니다. 첫째, 피검사나 엑스레이, MRI 같은 비싼 검사를 받기 전에 반드시 원무과에 서면 견적서인 굿 페이스 에스티메이트를 요청하세요. 2022년부터 시행된 연방 노 서프라이즈 액트에 따라 병원은 무보험 환자에게 사전 예상 비용을 서면으로 제공할 법적 의무가 있습니다. 둘째, 의사 진료비와 시설 이용료가 따로 청구되는지 확인하시고 각각 셀프페이 할인이 들어갔는지 영수증을 확인하세요.`,

  "tip-5": `메디케어 수가 기준 현금 결제 협상 요령입니다.

미국 병원들이 청구서에 적어 보내는 이른바 병원 표시 가격은 실제로 지불되는 금액이 아니라 협상을 위해 수배 부풀려진 가격입니다. 대형 보험사나 정부 기관은 이 표시 가격을 다 내지 않고 대폭 할인된 수가로 결제합니다. 바로 이 점을 활용하는 것이 현금 결제 협상의 핵심 기술입니다.

큰 병원비 청구서를 받았거나 비싼 시술을 앞두고 계실 때 병원 수납 담당자에게 이렇게 말씀해 보세요. "이 금액을 현금으로 일시불 완납하고 싶은데, 메디케어 기준 수가로 맞춰주실 수 있나요? (What is the Medicare-allowed rate if I pay cash today?)"

메디케어 수가는 연방 정부가 의학적 원가를 바탕으로 공정하게 책정한 표준 가격이기 때문에, 병원 원무과에서도 이를 기준으로 삼아 최대 50퍼센트에서 60퍼센트까지 병원비를 대폭 삭감해 주는 경우가 많습니다. 특히 병원이 악성 채권으로 분류해 추심 회사에 헐값으로 넘기는 것보다 환자에게 메디케어 기준 금액이라도 즉시 수납받는 것이 병원 재정에도 유리하기 때문입니다.

당황해서 청구서에 적힌 금액을 그대로 다 내지 마시고, 반드시 메디케어 수가를 기준으로 협상의 출발점을 잡으시기 바랍니다.`,

  "tip-6": `병원비 항목별 세부 내역서 요청 및 오류 확인법입니다.

병원이나 응급실에 다녀온 뒤 몇 주 후에 달랑 총액 3천 달러, 5천 달러만 적힌 청구서가 날아오면 덜컥 겁부터 나기 마련입니다. 하지만 미국 소비자 단체의 조사에 따르면 병원 청구서의 무려 80퍼센트 이상에 크고 작은 청구 오류가 포함되어 있습니다.

따라서 총액만 적힌 청구서를 받으셨을 때는 절대로 바로 납부하지 마시고, 청구서에 적힌 빌링 오피스 전화번호로 전화하셔서 이렇게 요청하세요. "Please send me an itemized bill with CPT billing codes." 즉 세부 항목과 의료 행위 코드가 적힌 아이템화 청구서를 보내달라는 뜻입니다.

실제로 세부 내역서를 받아보면 놀라운 일들이 많습니다. 받지도 않은 검사가 들어가 있거나, 한 번 맞은 주사가 두 번 청구되어 있거나, 일반 타이레놀 한 알에 50달러가 청구되어 있는 등의 오류를 흔히 발견할 수 있습니다. 더욱이 병원 원무과에 세부 내역서를 요구하는 순간, 병원 내부에서도 자체 검토를 거치면서 부풀려졌던 불필요한 비용을 알아서 빼고 재발행해 주는 경우가 매우 흔합니다.

청구서에 의심스러운 항목이 있다면 번호를 매겨 표시해 두시고 병원에 서면이나 전화로 당당하게 수정을 요구하세요.`,

  "tip-7": `병원비 무이자 분할 납부 신청 요령과 실무 안내입니다.

수술이나 입원 치료를 받고 수천 달러의 본인 부담금이 나왔을 때, 당장 통장에 현금이 없어서 발을 동동 구르거나 크레딧 카드로 결제해 높은 카드 이자를 부담하시는 안타까운 분들을 자주 봅니다. 하지만 미국 병원비는 절대로 고금리 신용카드로 먼저 결제하시면 안 됩니다.

미국의 거의 모든 병원은 환자가 진료비를 한 번에 납부하기 어려운 경우, 자체적으로 무이자 분할 납부 플랜을 제공하는 것이 관행입니다. 청구서를 받으신 후 방치해 두면 몇 달 뒤 컬렉션 에이전시, 즉 채권 추심 업체로 넘어가 크레딧 점수가 떨어질 수 있으므로, 청구서 마감일 전에 병원 빌링 부서에 연락하셔야 합니다.

전화하셔서 "I want to pay my bill, but I cannot afford this amount all at once. Can I set up a monthly payment plan without interest?"라고 말씀하세요. 본인의 재정 상황에 맞춰 "한 달에 50달러씩" 혹은 "100달러씩" 12개월이나 24개월에 걸쳐 무이자로 갚아나가겠다고 제안하시면 대부분 쉽게 승인해 줍니다. 성실하게 분할 납부 약정을 맺고 매달 약속된 금액을 내는 동안에는 절대로 추심 업체로 넘어가지 않습니다.`,

  "tip-8": `뉴저지 채리티 케어 병원비 전액 지원 제도 실전 가이드입니다.

뉴저지주에 거주하시는 분들이 반드시 아셔야 할 가장 강력한 의료 안전망이 바로 뉴저지 자선 진료, 채리티 케어입니다. 뉴저지 주법에 따라 뉴저지 내의 모든 급성기 종합병원은 지불 능력이 부족한 저소득 환자에게 필수 입원 및 외래 진료비를 전액 면제하거나 대폭 감면해 주어야 할 법적 의무가 있습니다.

2026년 최신 기준 소득 자격을 살펴보겠습니다. 연방 빈곤선의 200퍼센트 이하, 즉 1인 가구 기준 연소득 3만 1,920달러 이하, 4인 가족 기준 연 6만 6,000달러 이하라면 병원비가 100퍼센트 전액 지원되어 본인 부담금이 0원이 됩니다. 소득이 이보다 조금 높더라도 연방 빈곤선 300퍼센트까지는 병원비의 30퍼센트에서 70퍼센트까지 차등 할인을 받으실 수 있습니다.

많은 분들이 가장 궁금해하시는 점 세 가지를 정리해 드립니다. 첫째, 미국 시민권이나 영주권자뿐만 아니라 서류 미비자나 방문자 등 체류 신분과 전혀 무관하게 신청하실 수 있습니다. 둘째, 퍼블릭 차지, 즉 공적 부조 심사 대상이 아니므로 향후 영주권이나 시민권 신청에 아무런 불이익이 없습니다. 셋째, 진료를 받은 날로부터 1년 이내에 신청서와 서류를 제출하면 이미 나온 병원비도 전액 소급 탕감됩니다. 병원 원무과에 당당히 Charity Care 신청서를 요청하세요.`,

  "tip-9": `FQHC 지역 공공 보건소 슬라이딩 스케일 이용법입니다.

건강보험이 없어서 몸이 아프거나 정기 검진을 받아야 할 때 일반 개인 병원의 비싼 진료비 때문에 병원 문턱조차 넘지 못하는 한인 동포분들이 많습니다. 이런 분들을 위해 연방 정부의 재정 지원을 받아 운영되는 필수 공공 의료 기관이 바로 FQHC, 즉 지역 공공 보건소입니다.

FQHC의 가장 큰 장점은 환자의 보험 유무나 체류 신분, 지불 능력과 상관없이 누구나 진료를 받을 수 있다는 점입니다. 특히 환자의 가구 소득에 따라 진료비를 차등 청구하는 슬라이딩 피 스케일을 법적으로 운영하고 있습니다. 소득 증빙 서류를 지참해 방문하시면 무보험자라도 20달러에서 30달러 안팎의 매우 저렴한 비용으로 일반 가정의학과 진료, 만성질환 관리, 기본 혈액 검사, 여성 검진, 그리고 치과 진료까지 종합적인 의료 서비스를 받으실 수 있습니다.

뉴저지 버겐카운티와 인근 지역에도 여러 곳의 FQHC 공공 보건소가 운영 중입니다. NeedyMeds 웹사이트의 무료 클리닉 검색 메뉴나 연방 보건복지부 사이트에서 거주지 우편번호를 입력하시면 가장 가까운 보건소 위치와 진료 시간을 쉽게 찾으실 수 있습니다.`,

  "tip-10": `뉴저지 211 핫라인 한국어 통역 이용 실전 가이드입니다.

갑작스러운 질병이나 의료비 문제, 혹은 렌트비 체납이나 식료품 부족 같은 위기 상황에 처했을 때 어디에 도움을 청해야 할지 막막한 경우가 많습니다. 뉴저지 주민이라면 누구나 기억해 두셔야 할 긴급 복지 직통 전화번호가 바로 세 자리 숫자 2-1-1입니다.

전화기에서 2-1-1을 누르시면 365일 24시간 연중무휴로 뉴저지 주정부 공인 복지 전문 상담원과 연결됩니다. 거주하시는 카운티와 타운 주변의 무료 진료소, 긴급 처방약 지원 기금, 임대료 보조 프로그램, 공과금 감면 혜택, 그리고 푸드뱅크 정보를 맞춤형으로 안내받으실 수 있습니다.

영어가 서툴러서 전화하기를 망설이실 필요가 전혀 없습니다. 상담원이 전화를 받자마자 "Korean interpreter, please"라고 말씀하시면, 몇 초 안에 3자 전문 한국어 통역사가 연결되어 한국어로 편안하게 상담을 진행하실 수 있습니다. 통화료는 완전 무료이며, 통화 내용에 대한 비밀이 철저히 보장되므로 안심하고 이용하시기 바랍니다.`,

  "tip-11": `응급실 대신 얼전트 케어 똑똑한 이용 팁입니다.

주말이나 야간에 가족이 갑자기 고열이 나거나, 칼에 베여 상처를 꿰매야 하거나, 발목을 삐끗했을 때 무조건 큰 종합병원 응급실로 향하시는 경우가 많습니다. 하지만 생명이 위급한 상황이 아니라면 응급실 방문은 상상을 초월하는 병원비 청구서로 이어질 수 있습니다.

미국 종합병원 응급실은 문을 열고 들어가 침대에 눕는 순간 발생하는 기본 시설 이용료만으로도 1천 달러에서 3천 달러가 훌쩍 청구됩니다. 반면에 동네 곳곳에 위치한 얼전트 케어 클리닉을 방문하시면, 단순 외상 봉합, 감기·독감 치료, 엑스레이 촬영 및 기본 처방전 발급까지 150달러에서 250달러 수준의 합리적인 정액 현금가로 신속하게 치료받으실 수 있습니다. 응급실 비용의 5분의 1에서 10분의 1 수준에 불과합니다.

단, 심한 흉통, 뇌졸중 의심 증상, 심각한 호흡 곤란처럼 생명이 위태로운 응급 상황에는 지체 없이 911을 부르거나 종합병원 응급실로 가셔야 합니다. 평소 거주하시는 집 근처의 야간 및 주말 진료 Urgent Care 위치를 미리 지도 앱에 저장해 두시면 위급할 때 큰돈과 시간을 아끼실 수 있습니다.`
};

async function synthesizeTextToFile(text, outPath, retries = 4) {
  const cleaned = cleanForAudio(text);
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata('ko-KR-HyunsuMultilingualNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
      const { audioStream } = tts.toStream(cleaned, { rate: '-2%', pitch: '+0Hz' });
      const fileStream = fs.createWriteStream(outPath);
      audioStream.pipe(fileStream);

      await new Promise((resolve, reject) => {
        let settled = false;
        function finish(err) {
          if (settled) return;
          settled = true;
          if (err) {
            fileStream.destroy();
            try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch (_) {}
            reject(err);
          } else {
            resolve();
          }
        }
        audioStream.on('error', finish);
        fileStream.on('error', finish);
        fileStream.on('finish', () => finish(null));
      });
      
      const size = fs.existsSync(outPath) ? fs.statSync(outPath).size : 0;
      if (size < 50000) {
        throw new Error(`Audio file too small (${size} bytes)`);
      }
      return size;
    } catch (e) {
      if (attempt === retries) throw e;
      await new Promise(r => setTimeout(r, 1500 * attempt));
    }
  }
}

async function run() {
  console.log('=== STARTING FAST CONCURRENT RE-GENERATION WITH HYUNSU MULTILINGUAL (-2% RATE) ===');

  // 1. Generate 11 Health Tips
  console.log('\n--- 1. Generating 11 Healthcare Cost-Saving Tips ---');
  for (let i = 1; i <= 11; i++) {
    const tipKey = `tip-${i}`;
    const script = TIPS_SCRIPTS[tipKey];
    const outPath = path.join(AUDIO_DIR, `guide_tip_${i}.mp3`);
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 100000 && fs.statSync(outPath).mtimeMs > (Date.now() - 3600000)) {
      console.log(`[SKIP/DONE] ${tipKey} already freshly generated (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
      continue;
    }
    process.stdout.write(`Synthesizing ${tipKey}... `);
    const size = await synthesizeTextToFile(script, outPath);
    console.log(`[OK] (${(size / 1024).toFixed(1)} KB)`);
  }

  // 2. Generate 80 Community Resource Guides with Concurrency 4
  console.log('\n--- 2. Generating 80 Community Resource Guides (Concurrent x4) ---');
  const manifestRaw = fs.readFileSync(path.join(BASE_DIR, 'data/resource_audio_manifest.js'), 'utf8');
  const jsonStr = manifestRaw.replace(/^window\.RESOURCE_AUDIO_MANIFEST\s*=\s*/, '').replace(/;\s*$/, '');
  const manifest = JSON.parse(jsonStr);

  const tasks = [];
  for (let i = 1; i <= 80; i++) {
    const artKey = `art-${i}`;
    const art = manifest[artKey];
    if (!art || !art.script) continue;
    const outPath = path.join(AUDIO_DIR, `guide_art_${i}.mp3`);
    tasks.push({ i, artKey, title: art.title, script: art.script, outPath });
  }

  const concurrency = 2;
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
    await Promise.all(batch.map(async item => {
      if (fs.existsSync(item.outPath) && fs.statSync(item.outPath).size > 100000 && fs.statSync(item.outPath).mtimeMs > (Date.now() - 3600000)) {
        console.log(`[SKIP/DONE] [${item.i}/80] ${item.artKey} already freshly generated (${(fs.statSync(item.outPath).size / 1024).toFixed(1)} KB)`);
        return;
      }
      try {
        const size = await synthesizeTextToFile(item.script, item.outPath);
        console.log(`[OK] [${item.i}/80] ${item.artKey} (${item.title}): ${(size / 1024).toFixed(1)} KB`);
      } catch (err) {
        console.error(`[FAIL] [${item.i}/80] ${item.artKey}: ${err.message}`);
      }
    }));
  }

  console.log(`\n=== COMPLETED: Successfully synthesized all guides with Hyunsu Multilingual! ===`);
}

run().catch(console.error);
