# -*- coding: utf-8 -*-
"""
Generate contextual, conversational audio guides for all 80 resources in Resource Center.
Tone: Warm community center worker explaining to a community member/family.
Speed: 1.05x (+5% rate).
No mention of '어르신' (universal greeting).
"""
import asyncio
import os
import re
import json
import edge_tts

import sys
BASE_DIR = '/Users/ejyoon/Desktop/KACCESS'
DATA_FILE = os.path.join(BASE_DIR, 'data/resource_center_data.js')
AUDIO_OUT_DIR = os.path.join(BASE_DIR, 'uploads/audio/guides')
MANIFEST_OUT = os.path.join(BASE_DIR, 'data/resource_audio_manifest.js')
JSON_OUT = os.path.join(BASE_DIR, 'data/resource_audio_manifest.json')

if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)
from scripts.script_templates import get_spoken_script

def load_articles():
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract json part between window.COMMUNITY_RESOURCES_DATA = ... ;
    match = re.search(r'window\.COMMUNITY_RESOURCES_DATA\s*=\s*(\{.+?\});\s*window\.RESOURCE_CENTER_DATA', content, re.DOTALL)
    if not match:
        raise ValueError("Could not parse COMMUNITY_RESOURCES_DATA from data/resource_center_data.js")
    data = json.loads(match.group(1))
    return data['articles']


def create_guide_script(art):
    """
    Creates a warm, conversational, example-driven explanation script for the article.
    """
    title = art['title']
    cat_id = art.get('category_id', '')
    cat_name = art.get('category_name', '')
    excerpt = art.get('excerpt', '')
    art_id = art['id']
    return get_spoken_script(art_id, title, cat_id, cat_name, excerpt)


async def generate_single_audio(art, sem):
    async with sem:
        art_id = art['id']
        out_file = os.path.join(AUDIO_OUT_DIR, f"guide_{art_id.replace('-', '_')}.mp3")
        script = create_guide_script(art)

        comm = edge_tts.Communicate(script, 'ko-KR-SunHiNeural', rate='+5%')
        await comm.save(out_file)
        size = os.path.getsize(out_file)
        print(f"Generated: {art_id} -> {out_file} ({size} bytes, script {len(script)} chars)")
        
        return {
            "id": art_id,
            "title": art['title'],
            "category_id": art.get('category_id', ''),
            "audio_url": f"/uploads/audio/guides/guide_{art_id.replace('-', '_')}.mp3",
            "script": script
        }

async def main():
    articles = load_articles()
    print(f"Loaded {len(articles)} articles. Starting concurrent audio generation...")
    
    sem = asyncio.Semaphore(8)  # 8 concurrent workers
    tasks = [generate_single_audio(art, sem) for art in articles]
    results = await asyncio.gather(*tasks)
    
    manifest = {r['id']: r for r in results}
    
    with open(JSON_OUT, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        
    js_content = "window.RESOURCE_AUDIO_MANIFEST = " + json.dumps(manifest, ensure_ascii=False, indent=2) + ";\n"
    with open(MANIFEST_OUT, 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"All {len(results)} audio guides generated and manifest saved to {MANIFEST_OUT}")

if __name__ == '__main__':
    asyncio.run(main())
