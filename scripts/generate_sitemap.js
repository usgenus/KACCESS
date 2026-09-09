const fs = require('fs');
const path = require('path');

const baseUrl = 'https://kor2.njaccessportal.com';
const dataPath = path.join(__dirname, '../data/content.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const posts = data.posts || [];
const publishedPosts = posts.filter(p => (p.status || 'published') === 'published');
const today = new Date().toISOString().split('T')[0];

const corePages = [
  { loc: baseUrl + '/', priority: '1.0', changefreq: 'daily', lastmod: today },
  { loc: baseUrl + '/blog', priority: '0.9', changefreq: 'daily', lastmod: today },
  { loc: baseUrl + '/senior-care', priority: '0.9', changefreq: 'weekly', lastmod: today },
  { loc: baseUrl + '/medicare', priority: '0.8', changefreq: 'weekly', lastmod: today },
  { loc: baseUrl + '/tool', priority: '0.8', changefreq: 'monthly', lastmod: today },
  { loc: baseUrl + '/matcher', priority: '0.7', changefreq: 'monthly', lastmod: today },
  { loc: baseUrl + '/calculator', priority: '0.7', changefreq: 'monthly', lastmod: today },
  { loc: baseUrl + '/dictionary', priority: '0.7', changefreq: 'monthly', lastmod: today },
  { loc: baseUrl + '/about', priority: '0.8', changefreq: 'monthly', lastmod: today }
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

for (const p of corePages) {
  xml += `  <url>\n    <loc>${escapeXml(p.loc)}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
}

for (const post of publishedPosts) {
  const slug = post.slug || post.id;
  if (!slug) continue;
  const postUrl = baseUrl + '/blog/' + encodeURIComponent(slug);
  const rawDate = post.updatedAt || post.date || post.createdAt || today;
  let lastmod = today;
  try {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      lastmod = d.toISOString().split('T')[0];
    }
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
console.log(`Successfully generated sitemap.xml with ${corePages.length + publishedPosts.length} URLs!`);
