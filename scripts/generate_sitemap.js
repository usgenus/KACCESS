const fs = require('fs');
const path = require('path');

const baseUrl = 'https://njaccessportal.com';
const dataPath = path.join(__dirname, '../data/content.json');
const forumPath = path.join(__dirname, '../data/forum.json');

const today = new Date().toISOString().split('T')[0];

let posts = [];
if (fs.existsSync(dataPath)) {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    posts = (data.posts || []).filter(p => (p.status || 'published') === 'published');
  } catch (e) {}
}

let forumQuestions = [];
if (fs.existsSync(forumPath)) {
  try {
    const fData = JSON.parse(fs.readFileSync(forumPath, 'utf8'));
    forumQuestions = Object.values(fData.questions || {}).filter(q => (q.status || 'active') === 'active');
  } catch (e) {}
}

const corePages = [
  { loc: baseUrl + '/', priority: '1.0', changefreq: 'daily', lastmod: today },
  { loc: baseUrl + '/forum', priority: '0.95', changefreq: 'hourly', lastmod: today },
  { loc: baseUrl + '/forum?view=categories', priority: '0.9', changefreq: 'daily', lastmod: today },
  { loc: baseUrl + '/blog', priority: '0.9', changefreq: 'daily', lastmod: today },
  { loc: baseUrl + '/senior-care', priority: '0.9', changefreq: 'weekly', lastmod: today },
  { loc: baseUrl + '/medicare', priority: '0.85', changefreq: 'weekly', lastmod: today },
  { loc: baseUrl + '/tool', priority: '0.8', changefreq: 'monthly', lastmod: today },
  { loc: baseUrl + '/calculator', priority: '0.7', changefreq: 'monthly', lastmod: today },
  { loc: baseUrl + '/dictionary', priority: '0.7', changefreq: 'monthly', lastmod: today },
  { loc: baseUrl + '/about', priority: '0.8', changefreq: 'monthly', lastmod: today }
];

const forumCategories = [
  'general_community',
  'hospital_reviews',
  'bills_insurance',
  'medical_health',
  'events'
];

const subSpecialties = [
  'internal_medicine', 'cardiology', 'neurology', 'oncology', 'pediatrics',
  'dermatology', 'orthopedics', 'endocrinology', 'gastroenterology', 'psychiatry',
  'pulmonology', 'immunology', 'obgyn', 'urology', 'ent', 'ophthalmology',
  'rehab', 'pain_management', 'dentistry'
];

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

// 1. Core pages
for (const p of corePages) {
  xml += `  <url>\n    <loc>${escapeXml(p.loc)}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
}

// 2. 5 Core Forum Categories
for (const catId of forumCategories) {
  xml += `  <url>\n    <loc>${escapeXml(baseUrl + '/forum?specialty=' + catId)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
}

// 3. 19 Medical Sub-Specialties
for (const subId of subSpecialties) {
  xml += `  <url>\n    <loc>${escapeXml(baseUrl + '/forum?specialty=medical_health&sub=' + subId)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
}

// 4. Forum Topics
for (const q of forumQuestions) {
  const topicUrl = baseUrl + '/forum/topic/' + encodeURIComponent(q.id);
  const qDate = q.updatedAt || q.createdAt || today;
  let lastmod = today;
  try {
    const d = new Date(qDate);
    if (!isNaN(d.getTime())) lastmod = d.toISOString().split('T')[0];
  } catch (e) {}

  let firstImg = (q.images && q.images[0]) || '';
  if (firstImg && !firstImg.startsWith('http')) {
    firstImg = baseUrl + '/' + firstImg.replace(/^\/+/, '');
  }

  xml += `  <url>\n    <loc>${escapeXml(topicUrl)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.85</priority>\n`;
  if (firstImg) {
    xml += `    <image:image>\n      <image:loc>${escapeXml(firstImg)}</image:loc>\n      <image:title>${escapeXml(q.title || '포럼 질문')}</image:title>\n    </image:image>\n`;
  }
  xml += `  </url>\n`;
}

// 5. Blog posts
for (const post of posts) {
  const slug = post.slug || post.id;
  if (!slug) continue;
  const postUrl = baseUrl + '/blog/' + encodeURIComponent(slug);
  const rawDate = post.updatedAt || post.date || post.createdAt || today;
  let lastmod = today;
  try {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) lastmod = d.toISOString().split('T')[0];
  } catch (e) {}

  let coverImage = post.coverImage || (post.images && post.images[0]) || '';
  if (coverImage && !coverImage.startsWith('http')) {
    coverImage = baseUrl + '/' + coverImage.replace(/^\/+/, '');
  }

  xml += `  <url>\n    <loc>${escapeXml(postUrl)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n`;
  if (coverImage) {
    xml += `    <image:image>\n      <image:loc>${escapeXml(coverImage)}</image:loc>\n      <image:title>${escapeXml(post.title || '건강 의료 뉴스')}</image:title>\n    </image:image>\n`;
  }
  xml += `  </url>\n`;
}

xml += `</urlset>\n`;

const targetPath = path.join(__dirname, '../sitemap.xml');
fs.writeFileSync(targetPath, xml, 'utf8');

const totalCount = corePages.length + forumCategories.length + subSpecialties.length + forumQuestions.length + posts.length;
console.log(`Successfully generated sitemap.xml with ${totalCount} URLs!`);
