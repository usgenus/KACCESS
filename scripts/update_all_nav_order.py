import os
import re

files_standard = [
    'index.php',
    'resource-center.html',
    'about.html',
    'about/index.html',
    'medicare.html',
    'medicare/index.html',
    'blog.php',
    'blog-post.php',
    'ko/index.html',
    'ko/blog-post.php'
]

partner_desktop_standard = '''          <a class="nav-link pb-0.5 flex flex-col items-center justify-center leading-tight text-center cursor-pointer group" href="/partners">
            <span class="text-[14px] leading-tight font-semibold text-slate-800 group-hover:text-brand-blue transition-colors">뉴저지 파트너즈</span>
            <span class="text-[10px] leading-tight font-medium text-slate-400 group-hover:text-brand-blue/80 transition-colors">NJ Partners</span>
          </a>'''

partner_mobile_standard = '''      <!-- 뉴저지 파트너즈 -->
      <a href="/partners" class="flex items-center justify-between py-2.5 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          <div class="flex flex-col text-left leading-tight">
            <span class="text-[15px] font-bold text-slate-800">뉴저지 파트너즈</span>
            <span class="text-[10.5px] font-medium text-slate-400">NJ Partners</span>
          </div>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>'''

def clean_existing_partners(content):
    # Remove any existing /partners desktop and mobile links from content first
    # Desktop
    content = re.sub(
        r'\s*<a class="nav-link[^>]*href="/partners"[^>]*>[\s\S]*?</a>',
        '',
        content
    )
    # Mobile
    content = re.sub(
        r'\s*(<!--\s*[^>]*뉴저지\s*파트너즈\s*-->\s*)?<a href="/partners"[^>]*>[\s\S]*?</a>',
        '',
        content
    )
    return content

def update_standard_file(filepath):
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} (not found)")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()

    c = clean_existing_partners(c)

    # 1. Desktop Nav: Insert right after /forum </a>
    desktop_pattern = r'(<a class="nav-link[^>]*href="/forum"[^>]*>[\s\S]*?</a>)'
    m = re.search(desktop_pattern, c)
    if m:
        c = c[:m.end()] + '\n' + partner_desktop_standard + c[m.end():]
        print(f"[{filepath}] Inserted desktop nav link right after /forum")
    else:
        print(f"[{filepath}] WARNING: Desktop /forum not found")

    # 2. Mobile Nav: Insert right after /forum </a> in mobile menu
    # Mobile /forum link is followed by </a>
    mobile_pattern = r'(<a href="/forum"[^>]*class="flex items-center justify-between[^>]*>[\s\S]*?</a>)'
    m2 = re.search(mobile_pattern, c)
    if m2:
        c = c[:m2.end()] + '\n' + partner_mobile_standard + c[m2.end():]
        print(f"[{filepath}] Inserted mobile nav link right after /forum")
    else:
        print(f"[{filepath}] WARNING: Mobile /forum not found")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(c)

for fp in files_standard:
    update_standard_file(fp)

# Forum files
forum_files = ['forum/components.php', 'ko/forum/components.php']
forum_desktop = '''          <a class="nav-link pb-1 flex flex-col items-center justify-center leading-tight text-center cursor-pointer group transition-colors" href="/partners">
            <span class="text-[14px] leading-tight font-semibold text-white/80 group-hover:text-white">뉴저지 파트너즈</span>
            <span class="text-[10px] leading-tight font-medium text-white/50 group-hover:text-white/80">NJ Partners</span>
          </a>'''

forum_mobile = '''    <a href="/partners" class="py-2.5 px-3 rounded-lg font-bold text-slate-800 hover:text-[#1B6FA8] hover:bg-slate-50 flex items-center justify-between border-b border-slate-100">
      <div class="flex flex-col text-left leading-tight">
        <span class="text-[15px] font-bold text-slate-800">뉴저지 파트너즈</span>
        <span class="text-[10.5px] font-medium text-slate-400">NJ Partners</span>
      </div>
      <i class="fa-solid fa-chevron-right text-xs text-slate-400"></i>
    </a>'''

for fp in forum_files:
    if not os.path.exists(fp): continue
    with open(fp, 'r', encoding='utf-8') as f:
        c = f.read()
    c = clean_existing_partners(c)

    m = re.search(r'(<a class="nav-link[^>]*href="/forum"[^>]*>[\s\S]*?</a>)', c)
    if m:
        c = c[:m.end()] + '\n' + forum_desktop + c[m.end():]
        print(f"[{fp}] Inserted forum desktop nav link")

    m2 = re.search(r'(<a href="/forum"[^>]*class="py-2\.5 px-3[^>]*>[\s\S]*?</a>)', c)
    if m2:
        c = c[:m2.end()] + '\n' + forum_mobile + c[m2.end():]
        print(f"[{fp}] Inserted forum mobile nav link")

    with open(fp, 'w', encoding='utf-8') as f:
        f.write(c)

print("Done updating all navigation files.")
