const fs = require('fs');
const path = require('path');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

const AUDIO_DIR = path.join(__dirname, '../uploads/audio');
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

function cleanArticleBody(content) {
  if (!content) return '';
  let text = content;
  // Strip photos & figures
  text = text.replace(/\[(?:사진|PHOTO)[^\]]*\]/gi, '');
  text = text.replace(/!\[.*?\]\(.*?\)/gs, '');
  // Convert markdown links [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // Extract box content
  text = text.replace(/:::box\s*([\s\S]*?)\s*:::/g, '$1');
  // Strip HTML
  text = text.replace(/<[^>]+>/g, ' ');
  // Strip markdown formatting symbols
  text = text.replace(/[*_#=+\-~]{2,}/g, ' ');
  text = text.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '$1');
  // Strip URLs
  text = text.replace(/https?:\/\/\S+/gi, '');
  // Skip words in parentheses: both ASCII () and full-width （）
  text = text.replace(/\([^)]*\)/g, ' ');
  text = text.replace(/（[^）]*）/g, ' ');
  // Sanitize characters that break SSML/XML
  text = text.replace(/[《》]/g, '"');
  text = text.replace(/&/g, ' 그리고 ');
  text = text.replace(/[<>'"]/g, ' ');
  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

async function generateAudioForText(text, outputPath, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata('ko-KR-SunHiNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
      
      const bytes = await new Promise((resolve, reject) => {
        try {
          const { audioStream } = tts.toStream(text);
          const chunks = [];
          audioStream.on('data', c => chunks.push(c));
          audioStream.on('end', () => {
            const buf = Buffer.concat(chunks);
            fs.writeFileSync(outputPath, buf);
            resolve(buf.length);
          });
          audioStream.on('error', err => reject(err));
        } catch (e) {
          reject(e);
        }
      });
      return bytes;
    } catch (err) {
      if (attempt < retries) {
        console.warn(`    Attempt ${attempt} failed (${err.message}). Retrying in 1s...`);
        await new Promise(r => setTimeout(r, 1000));
      } else {
        throw err;
      }
    }
  }
}

async function main() {
  const contentFile = path.join(__dirname, '../data/content.json');
  if (!fs.existsSync(contentFile)) {
    console.error('content.json not found');
    return;
  }

  const cliArgs = process.argv.slice(2);
  const force = cliArgs.includes('--force');
  const targetSlugs = cliArgs.filter(a => !a.startsWith('--'));

  const data = JSON.parse(fs.readFileSync(contentFile, 'utf8'));
  let posts = (data.posts || []).filter(p => (p.status || 'published') === 'published');
  if (targetSlugs.length > 0) {
    posts = posts.filter(p => targetSlugs.includes(p.slug) || targetSlugs.includes(p.id));
  }

  console.log(`Starting audio generation for ${posts.length} published news posts...`);
  console.log(`Target directory: ${AUDIO_DIR}`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    const slug = (p.slug || p.id).trim();
    const fileName = `${slug}.mp3`;
    const destPath = path.join(AUDIO_DIR, fileName);

    // Skip if already generated and non-empty unless force is requested
    if (!force && targetSlugs.length === 0 && fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      console.log(`[${i + 1}/${posts.length}] Skipping existing: ${fileName} (${(fs.statSync(destPath).size / 1024).toFixed(1)} KB)`);
      skipCount++;
      continue;
    }

    const cleanBody = cleanArticleBody(p.content);
    if (!cleanBody || cleanBody.length < 10) {
      console.log(`[${i + 1}/${posts.length}] Skipping empty body: ${slug}`);
      skipCount++;
      continue;
    }

    console.log(`[${i + 1}/${posts.length}] Generating news anchor audio for: ${slug} (${cleanBody.length} chars)...`);
    const start = Date.now();
    try {
      const bytes = await generateAudioForText(cleanBody, destPath);
      console.log(`  -> Saved ${fileName} (${(bytes / 1024).toFixed(1)} KB in ${((Date.now() - start) / 1000).toFixed(1)}s)`);
      successCount++;
    } catch (err) {
      console.error(`  -> Failed for ${slug}:`, err.message);
      failCount++;
    }

    // Small delay to be polite to the socket
    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`\nFinished! Success: ${successCount}, Skipped: ${skipCount}, Failed: ${failCount}`);
}

main().catch(console.error);
