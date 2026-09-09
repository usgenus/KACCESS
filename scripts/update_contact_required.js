const fs = require('fs');
const path = require('path');

// 1. Update about.html and about/index.html
const htmlFiles = [
  path.join(__dirname, '../about.html'),
  path.join(__dirname, '../about/index.html')
];

const targetHtmlFields = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-xs font-sans font-semibold text-brand-dark mb-1">이메일 *</label><input type="email" required="" placeholder="example@email.com" class="w-full p-3 rounded-xl border border-brand-border text-sm outline-none focus:border-brand-blue" value=""/></div><div><label class="block text-xs font-sans font-semibold text-brand-dark mb-1">연락처</label><input type="tel" placeholder="201-000-0000" class="w-full p-3 rounded-xl border border-brand-border text-sm outline-none focus:border-brand-blue" value=""/></div></div>`;

const replacementHtmlFields = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-xs font-sans font-semibold text-brand-dark mb-1">이메일</label><input type="email" placeholder="example@email.com (선택)" class="w-full p-3 rounded-xl border border-brand-border text-sm outline-none focus:border-brand-blue" value=""/></div><div><label class="block text-xs font-sans font-semibold text-brand-dark mb-1">연락처 *</label><input type="tel" required="" placeholder="201-000-0000" class="w-full p-3 rounded-xl border border-brand-border text-sm outline-none focus:border-brand-blue" value=""/></div></div>`;

htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes(targetHtmlFields)) {
      content = content.replace(targetHtmlFields, replacementHtmlFields);
      fs.writeFileSync(file, content, 'utf8');
      console.log('✅ Updated HTML fields in:', file);
    } else {
      console.log('⚠️ Target HTML fields not found in:', file);
    }
  }
});

// 2. Update React chunk _next/static/chunks/191f64lzmub01.js
const jsChunkPath = path.join(__dirname, '../_next/static/chunks/191f64lzmub01.js');
const targetJsFields = `(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-xs font-sans font-semibold text-brand-dark mb-1",children:"이메일 *"}),(0,s.jsx)("input",{type:"email",required:!0,value:a.email,onChange:e=>t({...a,email:e.target.value}),placeholder:"example@email.com",className:"w-full p-3 rounded-xl border border-brand-border text-sm outline-none focus:border-brand-blue"})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-xs font-sans font-semibold text-brand-dark mb-1",children:"연락처"}),(0,s.jsx)("input",{type:"tel",value:a.phone,onChange:e=>t({...a,phone:e.target.value}),placeholder:"201-000-0000",className:"w-full p-3 rounded-xl border border-brand-border text-sm outline-none focus:border-brand-blue"})]})`;

const replacementJsFields = `(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-xs font-sans font-semibold text-brand-dark mb-1",children:"이메일"}),(0,s.jsx)("input",{type:"email",value:a.email,onChange:e=>t({...a,email:e.target.value}),placeholder:"example@email.com (선택)",className:"w-full p-3 rounded-xl border border-brand-border text-sm outline-none focus:border-brand-blue"})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-xs font-sans font-semibold text-brand-dark mb-1",children:"연락처 *"}),(0,s.jsx)("input",{type:"tel",required:!0,value:a.phone,onChange:e=>t({...a,phone:e.target.value}),placeholder:"201-000-0000",className:"w-full p-3 rounded-xl border border-brand-border text-sm outline-none focus:border-brand-blue"})]})`;

if (fs.existsSync(jsChunkPath)) {
  let jsContent = fs.readFileSync(jsChunkPath, 'utf8');
  if (jsContent.includes(targetJsFields)) {
    jsContent = jsContent.replace(targetJsFields, replacementJsFields);
    fs.writeFileSync(jsChunkPath, jsContent, 'utf8');
    console.log('✅ Updated React Chunk in:', jsChunkPath);
  } else {
    console.log('⚠️ Target JS fields not found in:', jsChunkPath);
  }
}

// 3. Update api/contact.php backend validation
const contactPhpPath = path.join(__dirname, '../api/contact.php');
if (fs.existsSync(contactPhpPath)) {
  let phpContent = fs.readFileSync(contactPhpPath, 'utf8');
  const targetPhpValidation = `if ($name === '' || $email === '' || $message === '') {\n        send_json(['success' => false, 'error' => '성함, 이메일, 문의 내용은 필수 입력 항목입니다.'], 400);\n    }`;
  const replacementPhpValidation = `if ($name === '' || $phone === '' || $message === '') {\n        send_json(['success' => false, 'error' => '성함, 연락처, 문의 내용은 필수 입력 항목입니다.'], 400);\n    }`;

  if (phpContent.includes(targetPhpValidation)) {
    phpContent = phpContent.replace(targetPhpValidation, replacementPhpValidation);
    fs.writeFileSync(contactPhpPath, phpContent, 'utf8');
    console.log('✅ Updated PHP backend validation in:', contactPhpPath);
  } else {
    console.log('⚠️ Target PHP validation not found');
  }
}
