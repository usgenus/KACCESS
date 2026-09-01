#!/usr/bin/env bash
set -e

# =========================================================
# SAFE DEPLOY SCRIPT: SYNC LIVE CMS DATA FIRST BEFORE DEPLOY
# =========================================================

echo "🔄 Fetching live data from https://kor2.njaccessportal.com..."

LIVE_POSTS=$(curl -s "https://kor2.njaccessportal.com/api/posts.php" || echo '{"success":false}')
LIVE_VIDEOS=$(curl -s "https://kor2.njaccessportal.com/api/videos.php" || echo '{"success":false}')
LIVE_BILLBOARDS=$(curl -s "https://kor2.njaccessportal.com/api/billboards.php" || echo '{"success":false}')
LIVE_BILLBOARDS2=$(curl -s "https://kor2.njaccessportal.com/api/billboards2.php" || echo '{"success":false}')
LIVE_INQUIRIES=$(curl -s "https://kor2.njaccessportal.com/api/contact.php" || echo '{"success":false}')

node -e '
const fs = require("fs");
const path = "./data/content.json";

let current = {};
try {
  current = JSON.parse(fs.readFileSync(path, "utf8"));
} catch(e) {
  current = { billboards: [], billboards2: [], videos: [], posts: [], categories: {} };
}

const canonicalCats = ["의료칼럼", "recall(리콜)", "health&wellness", "의료보험", "한인건강 특집", "한인커뮤니티 뉴스", "의학뉴스"];

function normalizeCat(c) {
  if (!c) return "의료칼럼";
  const lower = c.trim().toLowerCase();
  if (c === "의료칼럼" || c === "의사칼럼" || lower.includes("칼럼")) return "의료칼럼";
  if (c === "recall(리콜)" || c === "FDA 리콜" || lower.includes("recall") || lower.includes("리콜")) return "recall(리콜)";
  if (c === "health&wellness" || c === "Health & Wellness" || lower.includes("health") || lower.includes("wellness")) return "health&wellness";
  if (c === "의료보험" || c === "Medicare & ACA" || lower.includes("medicare") || lower.includes("보험")) return "의료보험";
  if (c === "한인건강 특집" || lower.includes("한인건강") || lower.includes("특집")) return "한인건강 특집";
  if (c === "한인커뮤니티 뉴스" || lower.includes("한인커뮤니티") || lower.includes("커뮤니티")) return "한인커뮤니티 뉴스";
  if (c === "의학뉴스" || lower.includes("의학뉴스") || lower.includes("의학")) return "의학뉴스";
  return canonicalCats.includes(c) ? c : "의료칼럼";
}

try {
  const p = JSON.parse(process.argv[1]);
  if (p && p.success && Array.isArray(p.data) && p.data.length > 0) {
    current.posts = p.data.map(item => ({ ...item, category: normalizeCat(item.category) }));
    current.categories.news = canonicalCats;
  }
} catch(e) {}

try {
  const v = JSON.parse(process.argv[2]);
  if (v && v.success && Array.isArray(v.data) && v.data.length > 0) {
    current.videos = v.data;
    if (v.categories) current.categories.videos = v.categories;
  }
} catch(e) {}

try {
  const b = JSON.parse(process.argv[3]);
  if (b && b.success && Array.isArray(b.data) && b.data.length > 0) {
    current.billboards = b.data;
    if (b.categories) current.categories.billboards = b.categories;
  }
} catch(e) {}

try {
  const b2 = JSON.parse(process.argv[4]);
  if (b2 && b2.success && Array.isArray(b2.data) && b2.data.length > 0) {
    current.billboards2 = b2.data;
    if (b2.categories) current.categories.billboards2 = b2.categories;
  }
} catch(e) {}

fs.writeFileSync(path, JSON.stringify(current, null, 2), "utf8");
console.log("✅ Live content successfully merged into data/content.json!");

// Download any uploaded media files referenced in content.json if not present locally
const contentStr = JSON.stringify(current);
const uploadMatches = contentStr.match(/\/uploads\/(?:images|videos)\/[a-zA-Z0-9_.-]+/g) || [];
const uniqueUploads = [...new Set(uploadMatches)];

uniqueUploads.forEach(relPath => {
  const localPath = "." + relPath;
  const dir = localPath.substring(0, localPath.lastIndexOf("/"));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(localPath) || fs.statSync(localPath).size === 0) {
    try {
      const { execSync } = require("child_process");
      execSync(`curl -s "https://kor2.njaccessportal.com${relPath}" -o "${localPath}"`);
      console.log("📥 Downloaded live media file:", relPath);
    } catch(err) {}
  }
});

// Sync inquiries if live data exists
try {
  const inq = JSON.parse(process.argv[5]);
  if (inq && inq.success && Array.isArray(inq.data) && inq.data.length > 0) {
    fs.writeFileSync("./data/inquiries.json", JSON.stringify(inq.data, null, 2), "utf8");
    console.log("✅ Live inquiries successfully synced into data/inquiries.json!");
  }
} catch(e) {}
' "$LIVE_POSTS" "$LIVE_VIDEOS" "$LIVE_BILLBOARDS" "$LIVE_BILLBOARDS2" "$LIVE_INQUIRIES"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ZIP_FILE="/Users/ejyoon/Desktop/KACCESS_${TIMESTAMP}.zip"

zip -r "$ZIP_FILE" . -x "*.git*" "node_modules/*" "*.zip"

echo "📦 Package created: $ZIP_FILE"
echo "CREATED_ZIP=$ZIP_FILE"
