const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const contentPath = path.join(BASE_DIR, 'data/content.json');

const post1 = {
  id: "p_1791210148_7f68",
  slug: "메디케어-오픈-인롤먼트-2026-10-월-15-일-12-월-7-일-체크리스트",
  title: "메디케어 오픈 인롤먼트 2026: 10월 15일~12월 7일 4단계 체크리스트",
  category: "의료보험",
  date: "2026-10-05",
  isTopStory: false,
  isLiveUpdate: true,
  isDoctorColumn: false,
  isPolicyReport: false,
  excerpt: "매년 가을, 메디케어는 1년에 단 한 번 보장 내용을 재검토하고 최적의 플랜으로 변경할 수 있는 기회를 제공합니다. 2027년도 보장을 위한 연간 가입 기간(AEP) 4단계 체크리스트와 필수 주의사항을 안내합니다.",
  coverImage: "/uploads/images/images_20261005_142228_7f68f1.jpeg",
  images: [
    "/uploads/images/images_20261005_142228_7f68f1.jpeg"
  ],
  videoUrl: "",
  readTime: "3분",
  author: "편집부",
  content: "매년 가을, 메디케어는 1년에 단 한 번 보장 내용을 재검토하고 최적의 플랜으로 변경할 수 있는 기회를 제공합니다. 2027년도 보장을 위한 연간 가입 기간은 2026년 10월 15일부터 12월 7일까지이며, 변경된 사항은 2027년 1월 1일부터 적용됩니다.\n\n### 2026 메디케어 연간 가입 기간(AEP) 4단계 체크리스트\n\n1. **Annual Notice of Change(ANOC) 안내문을 확인하세요**\n현재 가입된 보험사가 9월 말~10월 초에 우편으로 발송합니다. 내년도 월 보험료, 코페이, 약 목록(포뮬러리), 병원 및 의사 네트워크 변경 사항이 적혀 있습니다. 다른 무엇보다 먼저 꼼꼼히 읽으세요.\n\n2. **담당 의사와 처방약 목록을 정리하세요**\n현재 다니는 의사·병원·약국과 복용 중인 모든 약(용량 포함)을 적으세요. 플랜마다 네트워크와 약 목록(포뮬러리)이 매년 바뀌므로 2027년에도 계속 포함되는지 사전 확인이 필수입니다.\n\n3. **보험료가 아닌 연간 총비용을 비교하세요**\n월 보험료 + 파트 B 보험료(2026년 공식 월 $202.90) + 디덕터블 + 약·진료 코페이를 합산하세요. 월 보험료가 $0인 플랜이라도 잦은 병원 방문 시 총비용은 더 비쌀 수 있습니다.\n\n4. **약 보장(Part D) 변경 사항과 본인부담 상한제를 확인하세요**\n2026년부터 처방약 본인부담 상한액이 $2,100으로 설정됩니다. 복용 중인 약이 티어(Tier) 재분류로 인해 코페이가 인상되지 않았는지 확인하십시오.",
  summaryPoints: [
    "2026년 10월 15일부터 12월 7일까지 2027년도 메디케어 오픈 인롤먼트(AEP) 진행",
    "보험사로부터 우편 수령하는 ANOC(Annual Notice of Change) 변경 안내서 필수 확인",
    "오리지널 메디케어와 메디케어 어드밴티지 간 상호 전환 및 파트 D 처방약 플랜 재정비 기회"
  ],
  status: "published",
  createdAt: "2026-10-05 10:22:28"
};

const post2 = {
  id: "p_1791210704_d2c1",
  slug: "2026-년-메디케어-파트-d-2-100-약값-상한제와-처방약-변경-사항",
  title: "2026년 메디케어 파트 D: $2,100 약값 상한제와 처방약 변경 사항",
  category: "의료보험",
  date: "2026-10-05",
  isTopStory: false,
  isLiveUpdate: true,
  isDoctorColumn: false,
  isPolicyReport: false,
  excerpt: "2026년부터 메디케어 파트 D 연간 약값 본인부담이 $2,100으로 제한됩니다. 달라진 점과 월 분할 납부 옵션",
  coverImage: "/uploads/images/images_20261005_143139_5067e5.jpeg",
  images: [
    "/uploads/images/images_20261005_143139_5067e5.jpeg"
  ],
  videoUrl: "",
  readTime: "3분",
  author: "편집부",
  content: "처방약을 복용하신다면, 2026년은 메디케어 역사상 약 보장에 가장 큰 혜택이 생긴 해입니다. 디덕터블·코페이·코인슈어런스 합계가 $2,100에 도달하면, 그 해 나머지 기간 동안 보장 약값 본인부담은 100% $0(무료)입니다.\n\n### 2026년 파트 D 핵심 변경 사항\n\n1. **연간 본인부담금 $2,100 상한제**\n과거 수천 달러에 달하던 처방약 코페이 폭탄(도넛홀 구간)이 전격 폐지되고, 1년간 환자가 지불하는 약값의 총 상한선이 $2,100으로 고정됩니다.\n\n2. **메디케어 처방약 결제 플랜(M3P, 월 분할 납부제)**\n연초에 고가 약값 부담이 집중되는 것을 방지하기 위해, $2,100 상한액을 연중 12개월로 균등 분할 납부할 수 있는 M3P 제도가 제공됩니다.\n\n3. **파트 D 디덕터블 상한 $615**\n표준 파트 D 디덕터블 상한선은 최대 $615이며, 디덕터블 충족 이후 $2,100 상한 도달 시점까지 정해진 코페이만 지불하면 됩니다.",
  summaryPoints: [
    "2026년부터 메디케어 파트 D 연간 약값 본인부담 최대 $2,100 상한제 시행",
    "악명 높았던 도넛홀(Coverage Gap) 완전 폐지 및 $2,100 도달 후 잔여 기간 약값 $0 코페이",
    "고가 처방약 비용을 12개월에 걸쳐 무이자 분할 납부하는 M3P(Medicare Prescription Payment Plan) 도입"
  ],
  status: "published",
  createdAt: "2026-10-05 10:31:39"
};

// 1. Update local content.json
const raw = fs.readFileSync(contentPath, 'utf8');
const data = JSON.parse(raw);

// Filter out any existing with these IDs / slugs to avoid duplicate
data.posts = data.posts.filter(p => p.id !== post1.id && p.id !== post2.id && p.slug !== post1.slug && p.slug !== post2.slug);

// Add both posts to the beginning (newest first)
data.posts.unshift(post1); // 10:22 AM
data.posts.unshift(post2); // 10:31 AM (most recent)

fs.writeFileSync(contentPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully added both posts to local data/content.json! Total posts:', data.posts.length);

// Also sync to ko/data/content.json if exists
const koPath = path.join(BASE_DIR, 'ko/data/content.json');
if (fs.existsSync(path.dirname(koPath))) {
  fs.writeFileSync(koPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Synced to ko/data/content.json');
}

// 2. Upload to Hostinger via TUS
const TUS_URL = 'https://srv1709-files.hstgr.io/rest/ba91cc298370e11f/api/tus/public_html';
const AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTczODM1ODExMCIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MTIzMDkxNCwiaWF0IjoxNzkxMjA5MzE0fQ.xgDSrn5kq78os8P6Wtb-_OZ2-nJqRvp-yJLQryaxCEg';
const REST_AUTH_KEY = '4f2ac118cf1b45741fa954b561365d00501fb589f2b4dd304ddab6c77fe454a6-ba91cc298370e11f';

function uploadFileContent(targetRelPath, buffer) {
  return new Promise((resolve, reject) => {
    const size = buffer.length;
    const postUrl = new URL(`${TUS_URL}/${targetRelPath}?override=true`);
    const postReq = https.request(postUrl, {
      method: 'POST',
      headers: {
        'X-Auth': AUTH_KEY,
        'X-Auth-Rest': REST_AUTH_KEY,
        'Tus-Resumable': '1.0.0',
        'Upload-Length': size,
        'Upload-Offset': 0
      }
    }, (res) => {
      if (res.statusCode !== 201) {
        let b = '';
        res.on('data', c => b += c);
        res.on('end', () => reject(new Error(`POST failed ${res.statusCode}: ${b}`)));
        return;
      }
      const patchReq = https.request(postUrl, {
        method: 'PATCH',
        headers: {
          'X-Auth': AUTH_KEY,
          'X-Auth-Rest': REST_AUTH_KEY,
          'Tus-Resumable': '1.0.0',
          'Content-Type': 'application/offset+octet-stream',
          'Upload-Offset': 0
        }
      }, (patchRes) => {
        if (patchRes.statusCode === 204) {
          console.log(`[SUCCESS] ${targetRelPath} uploaded to Hostinger (204)`);
          resolve();
        } else {
          let b = '';
          patchRes.on('data', c => b += c);
          patchRes.on('end', () => reject(new Error(`PATCH failed ${patchRes.statusCode}: ${b}`)));
        }
      });
      patchReq.on('error', reject);
      patchReq.write(buffer);
      patchReq.end();
    });
    postReq.on('error', reject);
    postReq.end();
  });
}

async function main() {
  const contentBuf = fs.readFileSync(contentPath);
  console.log(`Uploading content.json (${contentBuf.length} bytes)...`);
  await uploadFileContent('data/content.json', contentBuf);

  // Also deploy fixed api/db.php
  const dbBuf = fs.readFileSync(path.join(BASE_DIR, 'api/db.php'));
  console.log(`Uploading fixed api/db.php (${dbBuf.length} bytes)...`);
  await uploadFileContent('api/db.php', dbBuf);

  // Sync to server persistent storage via a quick PHP helper
  console.log('Writing server persistent sync helper...');
  const syncPhp = `<?php
require_once __DIR__ . '/api/config.php';
$json = file_get_contents(__DIR__ . '/data/content.json');
$pDir = dirname(PERSISTENT_DATA_FILE);
if (!is_dir($pDir)) { @mkdir($pDir, 0777, true); @chmod($pDir, 0777); }
file_put_contents(PERSISTENT_DATA_FILE, $json, LOCK_EX);
@chmod(PERSISTENT_DATA_FILE, 0666);
clearstatcache(true, PERSISTENT_DATA_FILE);
echo "SYNC_OK: " . strlen($json);
unlink(__FILE__);
`;
  await uploadFileContent('sync_persistent_now.php', Buffer.from(syncPhp));

  // Trigger the helper via https
  await new Promise((resolve) => {
    https.get('https://njaccessportal.com/sync_persistent_now.php', (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        console.log('Triggered sync_persistent_now.php:', b.trim());
        resolve();
      });
    }).on('error', (e) => {
      console.error('Trigger error:', e);
      resolve();
    });
  });

  console.log('All restored successfully!');
}

main().catch(console.error);
