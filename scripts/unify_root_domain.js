const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const filesToUpdate = [
  'index.php',
  'about.html',
  'medicare.html',
  'senior-care.php',
  'tool.html',
  'matcher.html',
  'calculator.html',
  'dictionary.html',
  'blog.php',
  'blog-post.php',
  'forum/index.php',
  'forum/components.php',
  'forum/topic.php',
  'forum/ask.php'
];

filesToUpdate.forEach(rel => {
  const p = path.join(ROOT_DIR, rel);
  if (!fs.existsSync(p)) {
    console.warn(`File not found: ${rel}`);
    return;
  }
  let content = fs.readFileSync(p, 'utf8');

  // 1. Canonical URLs & hreflang
  content = content.replace(/https:\/\/njaccessportal\.com\/ko\//g, 'https://njaccessportal.com/');
  content = content.replace(/https:\/\/njaccessportal\.com\/ko(?=[\"#\s])/g, 'https://njaccessportal.com');

  // 2. Navigation and page links
  content = content.replace(/href="\/ko\/"/g, 'href="/"');
  content = content.replace(/href="\/ko"/g, 'href="/"');
  content = content.replace(/href="\/ko\/(blog|forum|senior-care|medicare|tool|about|matcher|calculator|dictionary|admin|admin2)([\/\"?#])/g, 'href="/$1$2');
  content = content.replace(/href='\/ko\/(blog|forum|senior-care|medicare|tool|about|matcher|calculator|dictionary|admin|admin2)([\/'?#])/g, "href='/$1$2");
  content = content.replace(/href="\/ko\/#([^"]+)"/g, 'href="/#$1"');

  // 3. Special variable overrides
  content = content.replace(/\$koMUrl = \(strpos\(\$mUrl, '\/'\) === 0 && strpos\(\$mUrl, '\/ko\/'\) !== 0\) \? '\/ko' \. \$mUrl : \$mUrl;/g,
    '$koMUrl = $mUrl;');
  content = content.replace(/'\/ko\/blog\/'/g, "'/blog/'");
  content = content.replace(/'\/ko\/blog'/g, "'/blog'");
  content = content.replace(/'\/ko\/forum\/'/g, "'/forum/'");
  content = content.replace(/'\/ko\/forum'/g, "'/forum'");

  // 4. Schema.org IDs
  content = content.replace(/@id": "https:\/\/njaccessportal\.com\/ko\/#/g, '@id": "https://njaccessportal.com/#');

  fs.writeFileSync(p, content, 'utf8');
  console.log(`[SUCCESS] Updated ${rel}`);
});
