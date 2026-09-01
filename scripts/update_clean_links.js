const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'index.php',
  'medicare.html',
  'medicare/index.html',
  'about.html',
  'about/index.html',
  'blog.html',
  'blog/index.html'
];

files.forEach(f => {
  const p = path.join(__dirname, '..', f);
  if (!fs.existsSync(p)) return;

  let content = fs.readFileSync(p, 'utf8');

  // Update card links
  content = content.replace(/href="\/tool\?tab=matcher"/g, 'href="/matcher"');
  content = content.replace(/href="\/tool\?tab=calculator"/g, 'href="/calculator"');
  content = content.replace(/href="\/tool\?tab=dictionary"/g, 'href="/dictionary"');
  content = content.replace(/href="\/tool\?tab=portal"/g, 'href="/tool"');

  // Any remaining generic /tool on cards 1, 2, 3
  content = content.replace(
    /(<span[^>]*>INSURANCE MATCHER<\/span>[\s\S]*?)<a[^>]*href="[^"]*"([^>]*>)/g,
    '$1<a href="/matcher"$2'
  );

  fs.writeFileSync(p, content, 'utf8');
  console.log('Updated links in:', f);
});
