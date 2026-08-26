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

node -e '
const fs = require("fs");
const path = "./data/content.json";

let current = {};
try {
  current = JSON.parse(fs.readFileSync(path, "utf8"));
} catch(e) {
  current = { billboards: [], billboards2: [], videos: [], posts: [], categories: {} };
}

try {
  const p = JSON.parse(process.argv[1]);
  if (p && p.success && Array.isArray(p.data) && p.data.length > 0) {
    current.posts = p.data;
    if (p.categories) current.categories.news = p.categories;
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
console.log("✅ Live data successfully merged into data/content.json!");
' "$LIVE_POSTS" "$LIVE_VIDEOS" "$LIVE_BILLBOARDS" "$LIVE_BILLBOARDS2"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ZIP_FILE="/Users/ejyoon/Desktop/KACCESS_${TIMESTAMP}.zip"

zip -r "$ZIP_FILE" . -x "*.git*" "node_modules/*" "*.zip"

echo "📦 Package created: $ZIP_FILE"
echo "CREATED_ZIP=$ZIP_FILE"
