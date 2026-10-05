const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data/resource_center_data.js');
let dataContent = fs.readFileSync(dataFile, 'utf8');

console.log('Original length:', dataContent.length);

// 1. Remove the 80 occurrences of the target string
const targetRegex = /\s*<li><strong>뉴저지 한인 의료접근포털 \(NJAP\):<\/strong> 201-336-7400 \/ support@njaccessportal\.com \(한국어 무료 상담 및 대행 지원\)<\/li>/g;
const matchCount = (dataContent.match(targetRegex) || []).length;
console.log('Matches to remove:', matchCount);
dataContent = dataContent.replace(targetRegex, '');

// 2. Fix specific NJAP entries with 201-336-7400
dataContent = dataContent.replace(
  /<li><strong>NJAP 메디케이드 자산 전문 상담:<\/strong> 201-336-7400<\/li>/g,
  '<li><strong>NJAP 메디케이드 자산 전문 상담:</strong> njaccessportal@gmail.com</li>'
);
dataContent = dataContent.replace(
  /<li><strong>NJAP 듀얼 플랜 전문 안내:<\/strong> 201-336-7400<\/li>/g,
  '<li><strong>NJAP 듀얼 플랜 전문 안내:</strong> njaccessportal@gmail.com</li>'
);
dataContent = dataContent.replace(
  /<li><strong>NJAP 응급 의료비 긴급 지원:<\/strong> 201-336-7400<\/li>/g,
  '<li><strong>NJAP 응급 의료비 긴급 지원:</strong> njaccessportal@gmail.com</li>'
);
dataContent = dataContent.replace(
  /<li><strong>NJAP 유산보호 전문 법률 연계:<\/strong> 201-336-7400<\/li>/g,
  '<li><strong>NJAP 유산보호 전문 법률 연계:</strong> njaccessportal@gmail.com</li>'
);
dataContent = dataContent.replace(
  /<li><strong>NJAP 은퇴 법률 전문가 연계:<\/strong> 201-336-7400<\/li>/g,
  '<li><strong>NJAP 은퇴 법률 전문가 연계:</strong> njaccessportal@gmail.com</li>'
);
dataContent = dataContent.replace(
  /<li><strong>NJAP 신탁 전문 연계:<\/strong> 201-336-7400<\/li>/g,
  '<li><strong>NJAP 신탁 전문 연계:</strong> njaccessportal@gmail.com</li>'
);
dataContent = dataContent.replace(
  /<li><strong>NJAP 어덜트 데이케어 무료 연계:<\/strong> 201-336-7400<\/li>/g,
  '<li><strong>NJAP 어덜트 데이케어 무료 연계:</strong> njaccessportal@gmail.com</li>'
);
dataContent = dataContent.replace(
  /<td>시니어 건강정보 센터, 메디케어·메디케이드 한국어 상담 핫라인<\/td><td>201-336-7400<\/td>/g,
  '<td>시니어 건강정보 및 메디케어·메디케이드 한국어 안내</td><td>njaccessportal@gmail.com</td>'
);

// 3. Double check for any remaining support@njaccessportal.com
const remainingSupport = (dataContent.match(/support@njaccessportal\.com/g) || []).length;
console.log('Remaining support@njaccessportal.com:', remainingSupport);

// 4. Double check for any remaining NJAP with 201-336-7400
const remainingNjapPhone = (dataContent.match(/NJAP.{0,50}201-336-7400/g) || []).length;
console.log('Remaining NJAP with 201-336-7400:', remainingNjapPhone);

fs.writeFileSync(dataFile, dataContent, 'utf8');
console.log('Updated data/resource_center_data.js. New length:', dataContent.length);
