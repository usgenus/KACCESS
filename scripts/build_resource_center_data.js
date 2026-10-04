const fs = require('fs');
const path = require('path');

const srcPath = '/Users/ejyoon/Desktop/AWCA_Offline_Portal/data/articles.json';
const destDataJs = path.join(__dirname, '..', 'data', 'resource_center_data.js');

if (!fs.existsSync(srcPath)) {
  console.error('Source articles.json not found at:', srcPath);
  process.exit(1);
}

const rawData = JSON.parse(fs.readFileSync(srcPath, 'utf8'));

// 1. Process Sections
const sections = (rawData.sections || []).map(s => {
  return {
    id: s.id,
    title_en: s.en_title || s.title || '',
    title_ko: s.ko_title || '',
    prefix: s.prefix || '',
    desc_en: (s.desc_en || '')
      .replace(/AWCA/g, 'NJ Access Portal')
      .replace(/Asian Women's Christian Association/gi, 'New Jersey Healthcare Access Portal'),
    desc_ko: (s.desc_ko || '')
      .replace(/AWCA/g, '의료접근포털')
  };
});

// 2. Process Articles
const articles = (rawData.articles || []).map(art => {
  let html = art.content_html || '';
  let title = art.title || '';
  let excerpt = art.excerpt || '';

  // Clean all AWCA references
  html = html
    .replace(/AWCA\s*Resource\s*Center/gi, 'NJ Access Portal 의료정보센터')
    .replace(/AWCA\s*\(Asian\s*Women['']?s\s*Christian\s*Association\)/gi, '뉴저지 한인 의료접근포털 (NJAP)')
    .replace(/Asian\s*Women['']?s\s*Christian\s*Association/gi, 'NJ Access Portal')
    .replace(/AWCA/g, 'NJ Access Portal')
    .replace(/awcanj\.org/gi, 'njaccessportal.com')
    .replace(/awcarc\.org/gi, 'njaccessportal.com')
    .replace(/201-862-1665/g, '201-336-7400')
    .replace(/info@awcanj\.org/g, 'support@njaccessportal.com')
    .replace(/9 Genesee Ave[^\n<]*/gi, 'New Jersey Healthcare Access Network')
    .replace(/Teaneck,\s*NJ\s*07666/gi, 'Bergen County, New Jersey')
    .replace(/https?:\/\/(www\.)?awcanj\.org/gi, 'https://njaccessportal.com')
    .replace(/https?:\/\/(www\.)?awcarc\.org/gi, 'https://njaccessportal.com');

  title = title
    .replace(/AWCA\s*Resource\s*Center/gi, '의료정보센터')
    .replace(/AWCA/gi, 'NJAP');

  excerpt = excerpt
    .replace(/AWCA/g, 'NJ Access Portal')
    .replace(/awcanj\.org/gi, 'njaccessportal.com')
    .replace(/awcarc\.org/gi, 'njaccessportal.com');

  // Update verified 2026/2027 numbers
  html = html
    .replace(/\$2,000(\s*)(상한|Cap|한도|본인부담금)/gi, '$2,100$1$2')
    .replace(/185달러/g, '202.90달러')
    .replace(/\$185(\.00)?/g, '$202.90')
    .replace(/174\.70달러/g, '202.90달러')
    .replace(/\$174\.70/g, '$202.90')
    .replace(/\$240(\s*)(디덕터블|공제액)/gi, '$283$1$2')
    .replace(/\$1,632/g, '$1,736') // Part A deductible
    .replace(/1,632달러/g, '1,736달러')
    .replace(/\$163,050/g, '$172,475') // Senior Freeze limit
    .replace(/163,050달러/g, '172,475달러')
    .replace(/2,829달러/g, '2,982달러') // MLTSS 300% SSI limit
    .replace(/\$2,829/g, '$2,982');

  return {
    id: art.id,
    lang: art.lang,
    section_id: art.section_id,
    section_title: art.section_title,
    section_title_ko: art.section_title_ko,
    title: title,
    slug: art.slug,
    counterpart_slug: art.counterpart_slug,
    excerpt: excerpt,
    content_html: html,
    word_count: art.word_count
  };
});

// Write to data/resource_center_data.js
fs.mkdirSync(path.dirname(destDataJs), { recursive: true });
const jsOutput = `/**
 * NJ Access Portal - Healthcare Resource Center Data
 * Sanitized and updated with 2026/2027 New Jersey official guidelines.
 */
window.RESOURCE_CENTER_DATA = ${JSON.stringify({ sections, articles })};
`;

fs.writeFileSync(destDataJs, jsOutput, 'utf8');
console.log(`[SUCCESS] Generated ${destDataJs} with ${sections.length} sections and ${articles.length} articles.`);
