const fs = require('fs');
const path = require('path');

const BASE_DIR = '/Users/ejyoon/Desktop/KACCESS';
const medicareHtmlPath = path.join(BASE_DIR, 'medicare.html');
const destHtmlPath = path.join(BASE_DIR, 'resource-center.html');

const { generateMedicareAcaHtml } = require('./generate_medicare_aca_content.js');
const medicareSectionsHtml = generateMedicareAcaHtml();

// Generate the complete resource-center.html
const html = `<!DOCTYPE html>
<html lang="ko" class="h-full antialiased">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>뉴저지 한인 의료정보센터 (Healthcare Resource Center) | 자격확인 계산기 · 커뮤니티 리소스 · 메디케어 &amp; ACA</title>
  <meta name="description" content="뉴저지 한인을 위한 원스톱 의료정보센터: 2026/2027 복지 자격확인 계산기, 포트리·팰팍 등 타운별 시니어 아파트 및 서민 주택, 8대 분야 커뮤니티 리소스, 2026 메디케어 &amp; ACA 완전 가이드." />
  <meta name="keywords" content="의료정보센터, 뉴저지 시니어 아파트, 메디케어 계산기, 커뮤니티 리소스, GetCoveredNJ, NJ FamilyCare, 버겐카운티 복지, PAAD, Senior Freeze, Stay NJ" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="https://njaccessportal.com/resource-center" />

  <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
  <link rel="icon" href="/favicon.ico?v=2" sizes="16x16 32x32 48x48" type="image/x-icon" />

  <!-- Fonts & Core Stylesheet -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/_next/static/chunks/1fosv8xgmgdeu.css" />

  <style>
    :root, html, body {
      font-family: "Pretendard Variable", Pretendard, "Noto Sans KR", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif !important;
      color: #1e293b;
      background-color: #f8f8f6;
    }
    .marquee-bar { background: #000000; }
    .nav-top-offset { top: 45px; }

    /* 1. Billboard Hero Section (Mirrored from first page billboard style) */
    #rc-hero-billboard-section {
      --brand-navy: #0F2342;
      --brand-navy-deep: #071322;
      --brand-navy-light: #1B2A4A;
      --brand-blue: #1B6FA8;
      --brand-blue-hover: #155987;
      --accent-teal: #7FC8C0;
      --accent-sky: #4FA3D1;
      box-sizing: border-box;
      position: relative;
      background: linear-gradient(135deg, #071322 0%, #0F2342 55%, #1B2A4A 100%);
      font-family: "Pretendard Variable", Pretendard, "Noto Sans KR", -apple-system, BlinkMacSystemFont, sans-serif;
    }
    #rc-hero-billboard-section * {
      box-sizing: border-box;
    }

    .hero-main-title {
      font-size: 36px;
      font-weight: 800;
      line-height: 1.22;
      letter-spacing: -0.025em;
      color: #ffffff;
      margin: 0 0 12px 0;
    }
    @media (max-width: 1024px) {
      .hero-main-title {
        font-size: 30px;
      }
    }
    @media (max-width: 640px) {
      .hero-main-title {
        font-size: 24px;
        line-height: 1.25;
        margin: 0 0 10px 0;
      }
    }
    .hero-gradient-accent {
      background: linear-gradient(90deg, #7FC8C0 0%, #4FA3D1 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: inline-block;
    }
    .hero-main-desc {
      font-size: 14.5px;
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.6;
      max-width: 580px;
      margin: 0 0 20px 0;
    }
    @media (max-width: 640px) {
      .hero-main-desc {
        font-size: 13.5px;
        line-height: 1.5;
        margin: 0 0 16px 0;
      }
    }
    .hero-btn-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
    }
    .hero-pill-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      border: 1px solid rgba(255, 255, 255, 0.22);
      background: rgba(255, 255, 255, 0.10);
      color: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      margin-bottom: 12px;
    }
    .hero-btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #1B6FA8;
      color: #ffffff !important;
      padding: 11px 22px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 14.5px;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(27, 111, 168, 0.4);
      transition: all 0.2s ease;
      white-space: nowrap;
      cursor: pointer;
      border: none;
    }
    .hero-btn-primary:hover {
      background: #155987;
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(27, 111, 168, 0.6);
    }
    .hero-btn-white {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #ffffff;
      color: #0F2342 !important;
      padding: 11px 22px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 14.5px;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease;
      white-space: nowrap;
      cursor: pointer;
      border: none;
    }
    .hero-btn-white:hover {
      background: #f1f5f9;
      transform: translateY(-1px);
    }
    .hero-btn-kakao {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #FEE500;
      color: #3C1E1E !important;
      padding: 11px 22px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 14.5px;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(254, 229, 0, 0.35);
      transition: all 0.2s ease;
      white-space: nowrap;
      cursor: pointer;
      border: none;
    }
    .hero-btn-kakao:hover {
      background: #FADA0A;
      transform: translateY(-1px);
    }
.hero-btn-icon {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }
    .hero-card-container {
      position: relative;
      width: 100%;
      max-width: 460px;
      height: 250px;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.75), 0 0 25px rgba(31, 111, 168, 0.25);
      background: #0B192C;
    }
    @media (max-width: 1023px) {
      .hero-card-container {
        max-width: 500px;
        height: 230px;
        margin: 0 auto;
      }
    }
    @media (max-width: 639px) {
      .hero-card-container {
        height: 190px;
        border-radius: 16px;
      }
    }
    .hero-visual-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 450ms ease, transform 450ms ease;
    }
    .hero-card-caption-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.55) 65%, transparent 100%);
      padding: 12px 16px;
      z-index: 25;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
    }
    .hero-card-caption-text {
      color: #ffffff;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: -0.01em;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.85);
    }
    .hero-card-caption-num {
      color: rgba(255, 255, 255, 0.7);
      font-size: 11px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 600;
    }
    .hero-slide {
      transition: opacity 250ms cubic-bezier(0.16, 1, 0.3, 1), transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    .rc-hero-tabs-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
      width: 100%;
    }
    @media (max-width: 768px) {
      .rc-hero-tabs-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }
    }
    .hero-tab-item {
      text-align: left;
      padding: 12px 16px;
      border-radius: 12px;
      transition: all 0.25s ease;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.05) !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      outline: none;
      display: block;
      width: 100%;
    }
    .hero-tab-item:hover {
      background: rgba(255, 255, 255, 0.10) !important;
      border-color: rgba(255, 255, 255, 0.25) !important;
    }
    .hero-tab-item[aria-selected="true"],
    .hero-tab-item.active {
      background: rgba(255, 255, 255, 0.14) !important;
      border-color: rgba(127, 200, 192, 0.6) !important;
      box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.4), 0 0 15px rgba(127, 200, 192, 0.2) !important;
    }
    .hero-tab-sub {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.55);
      display: block;
      margin-bottom: 3px;
    }
    .hero-tab-item[aria-selected="true"] .hero-tab-sub,
    .hero-tab-item.active .hero-tab-sub {
      color: #7FC8C0 !important;
    }
    .hero-tab-title {
      font-size: 15px;
      font-weight: 800;
      color: rgba(255, 255, 255, 0.75);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
    }
    @media (max-width: 639px) {
      .hero-tab-title {
        font-size: 12.5px;
      }
      .hero-tab-sub {
        font-size: 9.5px;
      }
      .hero-tab-item {
        padding: 8px 10px;
      }
    }
    .hero-tab-item[aria-selected="true"] .hero-tab-title,
    .hero-tab-item.active .hero-tab-title {
      color: #ffffff !important;
    }
    .hero-tab-bar {
      height: 3px;
      border-radius: 9999px;
      margin-top: 8px;
      background: rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }
    .hero-tab-item[aria-selected="true"] .hero-tab-bar,
    .hero-tab-item.active .hero-tab-bar {
      background: linear-gradient(90deg, #7FC8C0, #4FA3D1) !important;
      box-shadow: 0 0 12px rgba(127, 200, 192, 0.9) !important;
    }

    /* 3 Main Tabs (Compatibility / Sticky) */
    .rc-nav-tab {
      padding: 10px 20px;
      border-radius: 9999px;
      font-size: 14.5px;
      font-weight: 700;
      color: #64748b;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      text-decoration: none;
    }
    .rc-nav-tab:hover {
      color: #1d4ed8;
      border-color: #93c5fd;
      background: #eff6ff;
      transform: translateY(-1px);
    }
    .rc-nav-tab.active {
      color: #ffffff !important;
      background: #1a5cf6 !important;
      border-color: #1a5cf6 !important;
      box-shadow: 0 4px 16px rgba(26, 92, 246, 0.4);
    }

    /* Categorized Choices Cards in Community Resources */
    .rc-choice-card {
      padding: 16px 18px;
      border-radius: 18px;
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 6px;
      text-align: left;
    }
    .rc-choice-card:hover {
      border-color: #3b82f6;
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.12);
      transform: translateY(-2px);
    }
    .rc-choice-card.active {
      background: #eff6ff !important;
      border-color: #2563eb !important;
      box-shadow: 0 6px 18px rgba(37, 99, 235, 0.18);
    }

    /* Housing Town Buttons */
    .rc-housing-town-btn {
      padding: 7px 16px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 700;
      color: #334155;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      cursor: pointer;
      transition: all 0.2s;
    }
    .rc-housing-town-btn:hover {
      background: #e2e8f0;
    }
    .rc-housing-town-btn.active {
      background: #2563eb !important;
      color: #ffffff !important;
      border-color: #2563eb !important;
      box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
    }

    /* Calculator Custom Controls */
    .rc-quick-btn {
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
      cursor: pointer;
      transition: background 0.15s;
    }
    .rc-quick-btn:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    /* Color Coded Window Frames for Calculator Results */
    .rc-win-frame {
      border-radius: 16px;
      overflow: hidden;
      background: #ffffff;
      border-width: 1.5px;
      border-style: solid;
      box-shadow: 0 4px 14px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
    }
    .rc-win-frame:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -4px rgba(0, 0, 0, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.06);
    }

    .rc-win-header {
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      user-select: none;
    }
    .rc-win-dots {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-shrink: 0;
    }
    .rc-dot {
      width: 9px;
      height: 9px;
      border-radius: 9999px;
      display: inline-block;
    }
    .rc-dot-red { background: #ff5f56; }
    .rc-dot-yellow { background: #ffbd2e; }
    .rc-dot-green { background: #27c93f; }

    .rc-win-category {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1;
      min-width: 0;
    }
    .rc-win-icon {
      font-size: 13px;
      flex-shrink: 0;
    }
    .rc-win-cat-title {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: -0.01em;
      white-space: nowrap;
    }
    .rc-win-cat-sub {
      font-size: 11px;
      opacity: 0.7;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media (max-width: 640px) {
      .rc-win-cat-sub { display: none; }
    }

    .rc-status-pill {
      font-size: 11px;
      font-weight: 800;
      padding: 3px 9px;
      border-radius: 9999px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .rc-status-eligible {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }
    .rc-status-cond {
      background: #fffbeb;
      color: #92400e;
      border: 1px solid #fde68a;
    }

    .rc-win-body {
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .rc-win-title-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .rc-win-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.35;
      margin: 0;
    }
    .rc-win-highlight-badge {
      font-size: 11px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .rc-win-benefit {
      font-size: 13px;
      color: #334155;
      line-height: 1.6;
      margin: 0;
    }
    .rc-win-criteria {
      border-radius: 10px;
      padding: 10px 12px;
      font-size: 12px;
      line-height: 1.55;
    }
    .rc-criteria-label {
      display: flex;
      align-items: center;
      gap: 5px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .rc-criteria-text {
      color: #475569;
    }

    .rc-win-footer {
      padding: 10px 18px 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      border-top-width: 1px;
      border-top-style: solid;
      flex-wrap: wrap;
    }
    .rc-win-help-hint {
      font-size: 11px;
      color: #94a3b8;
    }
    .rc-win-action-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 800;
      padding: 6px 14px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      border: 1px solid transparent;
      text-decoration: none;
    }
    .rc-win-action-btn:hover {
      transform: translateX(2px);
    }

    /* THEME 1: Medical / Medicaid (Blue) */
    .rc-win-medical {
      border-color: #38bdf8 !important;
      border-left: 6px solid #0284c7 !important;
    }
    .rc-win-medical .rc-win-header {
      background: #f0f9ff;
      border-color: #bae6fd;
      color: #0369a1;
    }
    .rc-win-medical .rc-win-highlight-badge {
      background: #e0f2fe;
      color: #0284c7;
      border: 1px solid #bae6fd;
    }
    .rc-win-medical .rc-win-criteria {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #0369a1;
    }
    .rc-win-medical .rc-win-footer {
      border-color: #f1f5f9;
    }
    .rc-win-medical .rc-win-action-btn {
      background: #0284c7;
      color: #ffffff !important;
    }
    .rc-win-medical .rc-win-action-btn:hover {
      background: #0369a1;
    }

    /* THEME 2: Prescription / MSP / PAAD (Purple) */
    .rc-win-prescription {
      border-color: #c084fc !important;
      border-left: 6px solid #7e22ce !important;
    }
    .rc-win-prescription .rc-win-header {
      background: #faf5ff;
      border-color: #e9d5ff;
      color: #7e22ce;
    }
    .rc-win-prescription .rc-win-highlight-badge {
      background: #f3e8ff;
      color: #6b21a8;
      border: 1px solid #d8b4fe;
    }
    .rc-win-prescription .rc-win-criteria {
      background: #faf5ff;
      border: 1px solid #f3e8ff;
      color: #7e22ce;
    }
    .rc-win-prescription .rc-win-footer {
      border-color: #f3e8ff;
    }
    .rc-win-prescription .rc-win-action-btn {
      background: #7e22ce;
      color: #ffffff !important;
    }
    .rc-win-prescription .rc-win-action-btn:hover {
      background: #6b21a8;
    }

    /* THEME 3: Nutrition / Food / SNAP (Orange) */
    .rc-win-nutrition {
      border-color: #fb923c !important;
      border-left: 6px solid #ea580c !important;
    }
    .rc-win-nutrition .rc-win-header {
      background: #fff7ed;
      border-color: #fed7aa;
      color: #c2410c;
    }
    .rc-win-nutrition .rc-win-highlight-badge {
      background: #ffedd5;
      color: #9a3412;
      border: 1px solid #fdba74;
    }
    .rc-win-nutrition .rc-win-criteria {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      color: #c2410c;
    }
    .rc-win-nutrition .rc-win-footer {
      border-color: #fed7aa;
    }
    .rc-win-nutrition .rc-win-action-btn {
      background: #ea580c;
      color: #ffffff !important;
    }
    .rc-win-nutrition .rc-win-action-btn:hover {
      background: #c2410c;
    }

    /* THEME 4: Housing / Senior Housing (Emerald Green) */
    .rc-win-housing {
      border-color: #34d399 !important;
      border-left: 6px solid #059669 !important;
    }
    .rc-win-housing .rc-win-header {
      background: #ecfdf5;
      border-color: #a7f3d0;
      color: #047857;
    }
    .rc-win-housing .rc-win-highlight-badge {
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #6ee7b7;
    }
    .rc-win-housing .rc-win-criteria {
      background: #f0fdf4;
      border: 1px solid #dcfce7;
      color: #047857;
    }
    .rc-win-housing .rc-win-footer {
      border-color: #a7f3d0;
    }
    .rc-win-housing .rc-win-action-btn {
      background: #059669;
      color: #ffffff !important;
    }
    .rc-win-housing .rc-win-action-btn:hover {
      background: #047857;
    }

    /* THEME 5: Utility / LIHEAP / Energy (Rose Red) */
    .rc-win-utility {
      border-color: #fb7185 !important;
      border-left: 6px solid #e11d48 !important;
    }
    .rc-win-utility .rc-win-header {
      background: #fff1f2;
      border-color: #fecdd3;
      color: #be123c;
    }
    .rc-win-utility .rc-win-highlight-badge {
      background: #ffe4e6;
      color: #9f1239;
      border: 1px solid #fda4af;
    }
    .rc-win-utility .rc-win-criteria {
      background: #fff1f2;
      border: 1px solid #ffe4e6;
      color: #be123c;
    }
    .rc-win-utility .rc-win-footer {
      border-color: #fecdd3;
    }
    .rc-win-utility .rc-win-action-btn {
      background: #e11d48;
      color: #ffffff !important;
    }
    .rc-win-utility .rc-win-action-btn:hover {
      background: #be123c;
    }

    /* THEME 6: Tax Relief / Senior Freeze / ANCHOR (Teal) */
    .rc-win-tax {
      border-color: #2dd4bf !important;
      border-left: 6px solid #0f766e !important;
    }
    .rc-win-tax .rc-win-header {
      background: #f0fdfa;
      border-color: #99f6e4;
      color: #0f766e;
    }
    .rc-win-tax .rc-win-highlight-badge {
      background: #ccfbf1;
      color: #115e59;
      border: 1px solid #5eead4;
    }
    .rc-win-tax .rc-win-criteria {
      background: #f0fdfa;
      border: 1px solid #ccfbf1;
      color: #0f766e;
    }
    .rc-win-tax .rc-win-footer {
      border-color: #99f6e4;
    }
    .rc-win-tax .rc-win-action-btn {
      background: #0f766e;
      color: #ffffff !important;
    }
    .rc-win-tax .rc-win-action-btn:hover {
      background: #115e59;
    }

    /* THEME 7: Care / MLTSS / In-Home Caregiver (Indigo) */
    .rc-win-care {
      border-color: #818cf8 !important;
      border-left: 6px solid #4338ca !important;
    }
    .rc-win-care .rc-win-header {
      background: #eef2ff;
      border-color: #c7d2fe;
      color: #3730a3;
    }
    .rc-win-care .rc-win-highlight-badge {
      background: #e0e7ff;
      color: #312e81;
      border: 1px solid #a5b4fc;
    }
    .rc-win-care .rc-win-criteria {
      background: #eef2ff;
      border: 1px solid #e0e7ff;
      color: #3730a3;
    }
    .rc-win-care .rc-win-footer {
      border-color: #c7d2fe;
    }
    .rc-win-care .rc-win-action-btn {
      background: #4338ca;
      color: #ffffff !important;
    }
    .rc-win-care .rc-win-action-btn:hover {
      background: #3730a3;
    }

    /* Editorial Card */
    .editorial-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    /* Robust Grid Utilities */
    .rc-calc-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      align-items: start;
    }
    @media (min-width: 1024px) {
      .rc-calc-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    .rc-grid-3 {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }
    @media (min-width: 640px) {
      .rc-grid-3 {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 1024px) {
      .rc-grid-3 {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    .rc-grid-4 {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    @media (min-width: 640px) {
      .rc-grid-4 {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 1024px) {
      .rc-grid-4 {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    .rc-choices-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.875rem;
    }
    @media (min-width: 768px) {
      .rc-choices-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    /* Housing Portal Link Buttons */
    .rc-portal-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 700;
      color: #ffffff !important;
      text-decoration: none;
      transition: all 0.2s ease;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
    .rc-portal-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    }
    .rc-portal-btn-habc { background: #1d4ed8 !important; }
    .rc-portal-btn-cgp { background: #059669 !important; }
    .rc-portal-btn-piazza { background: #7c3aed !important; }
    .rc-portal-btn-njhrc { background: #0f172a !important; }

    /* Rewritten Research Guide Inline Styling */
    .rc-briefing-header {
      margin-bottom: 20px;
    }
    .rc-briefing-tag {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1d4ed8;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 3px 10px;
      border-radius: 9999px;
      margin-bottom: 8px;
    }
    .rc-briefing-title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.3;
      margin-bottom: 6px;
    }
    .rc-briefing-sub {
      font-size: 13.5px;
      color: #64748b;
      margin-bottom: 0;
    }
    .rc-callout-box {
      background: #f8fafc;
      border-left: 4px solid #2563eb;
      border-top: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px 20px;
      margin: 20px 0;
    }
    .rc-callout-header {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13.5px;
      color: #1e3a8a;
      margin-bottom: 10px;
    }
    .rc-callout-icon {
      display: none !important;
    }
    .rc-callout-list {
      margin: 0;
      padding-left: 18px;
      font-size: 13px;
      color: #334155;
      line-height: 1.6;
    }
    .rc-callout-list li {
      margin-bottom: 4px;
    }
    .rc-guide-body-content {
      font-size: 14.5px;
      color: #1e293b;
      line-height: 1.7;
    }
    .rc-guide-body-content p {
      margin-bottom: 14px;
    }
    .rc-guide-h4 {
      font-size: 17px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 24px;
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e2e8f0;
    }
    .rc-guide-list, .rc-guide-list-num {
      margin: 10px 0 16px 20px;
      color: #334155;
      font-size: 14px;
      line-height: 1.65;
    }
    .rc-guide-list li, .rc-guide-list-num li {
      margin-bottom: 6px;
    }
    .rc-guide-table {
      width: 100%;
      border-collapse: collapse;
      margin: 18px 0;
      font-size: 13px;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    .rc-guide-table th {
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 700;
      padding: 10px 14px;
      text-align: left;
      border-bottom: 2px solid #cbd5e1;
    }
    .rc-guide-table td {
      padding: 10px 14px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }
    .rc-guide-table tr:nth-child(even) {
      background: #f8fafc;
    }
    .rc-guide-link {
      color: #2563eb;
      font-weight: 600;
      text-decoration: underline;
    }

    /* Portal Mockup Screenshot Card */
    .rc-portal-mockup-card {
      margin: 18px 0 22px 0;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.08);
    }
    .rc-portal-mockup-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 8px 14px;
      background: #0f172a;
      border-bottom: 1px solid #1e293b;
    }
    .rc-portal-mockup-dots {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }
    .rc-dot {
      width: 10px;
      height: 10px;
      border-radius: 9999px;
      display: inline-block;
    }
    .rc-dot-red { background: #ef4444; }
    .rc-dot-yellow { background: #f59e0b; }
    .rc-dot-green { background: #10b981; }
    .rc-portal-mockup-url {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.12);
      padding: 3px 12px;
      border-radius: 6px;
      font-size: 11px;
      color: #cbd5e1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 480px;
      font-family: monospace;
    }
    .rc-portal-mockup-url svg {
      width: 14px !important;
      height: 14px !important;
      min-width: 14px !important;
      max-width: 14px !important;
      margin-right: 6px !important;
      display: inline-block !important;
      vertical-align: middle !important;
      flex-shrink: 0 !important;
      color: #10b981 !important;
    }
    .rc-portal-mockup-btn {
      background: #2563eb;
      color: #ffffff !important;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      text-decoration: none !important;
      white-space: nowrap;
      transition: background 0.15s;
    }
    .rc-portal-mockup-btn:hover {
      background: #1d4ed8;
    }
    .rc-portal-mockup-img-wrap {
      max-height: 400px;
      overflow-y: auto;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    .rc-portal-mockup-img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
    }
    .rc-portal-mockup-caption {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
      padding: 9px 14px;
      background: #f8fafc;
    }
    .rc-portal-badge-verified {
      background: #dcfce7;
      color: #15803d;
      font-size: 11px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 9999px;
      border: 1px solid #bbf7d0;
    }

    /* Redesigned Data Chart Card */
    .rc-redesigned-chart-card {
      margin: 22px 0;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
    }
    .rc-chart-card-header {
      background: linear-gradient(135deg, #071322 0%, #0F2342 60%, #1B2A4A 100%);
      padding: 12px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }
    .rc-chart-card-title {
      color: #ffffff;
      font-size: 14.5px;
      font-weight: 800;
      letter-spacing: -0.01em;
    }
    .rc-chart-card-badge {
      background: rgba(127, 200, 192, 0.2);
      color: #7fc8c0;
      border: 1px solid rgba(127, 200, 192, 0.4);
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
    }
    .rc-chart-table-wrap {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    .rc-chart-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      text-align: left;
    }
    .rc-chart-table th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      padding: 11px 14px;
      border-bottom: 2px solid #cbd5e1;
      white-space: nowrap;
    }
    .rc-chart-table td {
      padding: 10px 14px;
      border-bottom: 1px solid #f1f5f9;
      color: #1e293b;
      line-height: 1.55;
    }
    .rc-chart-table tr:nth-child(even) {
      background: #f8fafc;
    }
    .rc-chart-table tr:hover {
      background: #f0fdf4;
    }
    .rc-chart-footnote {
      padding: 10px 16px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .rc-chart-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 6px;
    }
    .rc-chart-badge-green { background: #dcfce7; color: #15803d; }
    .rc-chart-badge-blue { background: #dbeafe; color: #1e40af; }
    .rc-chart-badge-amber { background: #fef3c7; color: #b45309; }
    .rc-chart-cell-highlight { font-weight: 800; color: #0284c7; }
    .rc-notice-box {
      margin-top: 30px;
      padding: 18px 20px;
      border-radius: 14px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
    }
    .rc-notice-title {
      font-size: 13.5px;
      font-weight: 800;
      color: #1e40af;
      margin-bottom: 6px;
    }
    .rc-notice-text {
      font-size: 12.5px;
      color: #1e3a8a;
      line-height: 1.6;
      margin-bottom: 14px;
    }
    .rc-notice-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .rc-action-btn {
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      transition: all 0.2s;
    }
    .rc-action-btn-kakao {
      background: #fee500;
      color: #3c1e1e;
      border: 1px solid #e5ce00;
    }
    .rc-action-btn-print {
      background: #ffffff;
      color: #334155;
      border: 1px solid #cbd5e1;
    }

    /* 2026 AEP Section */
    #section-open-enrollment {
      background-color: #0B192C !important;
      background: linear-gradient(135deg, #0B192C 0%, #10233d 50%, #0B192C 100%) !important;
      color: #ffffff !important;
      border: 1px solid rgba(30, 58, 138, 0.6) !important;
      box-shadow: 0 12px 30px -6px rgba(13, 27, 43, 0.4) !important;
    }
    #section-open-enrollment h3, #section-open-enrollment h5 { color: #ffffff !important; }
    #section-open-enrollment p { color: #cbd5e1 !important; }
    #section-open-enrollment strong { color: #ffffff !important; }
    #section-open-enrollment h4 { color: #93c5fd !important; }
    #section-open-enrollment .grid.text-slate-200, #section-open-enrollment .grid.text-slate-200 div { color: #e2e8f0 !important; }

    /* 2026 IRA Section */
    .ira-container {
      background-color: #0d1b2b !important;
      color: #ffffff !important;
      border-radius: 20px !important;
      padding: 36px 32px !important;
      margin-top: 36px !important;
      margin-bottom: 36px !important;
      box-shadow: 0 12px 30px -6px rgba(13, 27, 43, 0.4) !important;
    }
    .ira-card {
      background-color: rgba(255, 255, 255, 0.08) !important;
      border: 1px solid rgba(255, 255, 255, 0.16) !important;
      border-radius: 14px !important;
      padding: 22px !important;
    }
    .ira-card-title { color: #93c5fd !important; font-size: 16px !important; font-weight: 700 !important; }
    .ira-card-desc { color: #e2e8f0 !important; font-size: 13.5px !important; }

    /* Medicare & ACA Section Generous Spacing */
    .medicare-guide-container {
      display: flex !important;
      flex-direction: column !important;
      gap: 5rem !important; /* 80px on mobile */
    }
    @media (min-width: 640px) {
      .medicare-guide-container {
        gap: 6.5rem !important; /* 104px on tablet */
      }
    }
    @media (min-width: 1024px) {
      .medicare-guide-container {
        gap: 8rem !important; /* 128px on desktop */
      }
    }
    .medicare-guide-container > * {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
    }

    /* Medicare & ACA Section Clean Styles */
    .medicare-guide-container details > summary {
      cursor: pointer;
      user-select: none;
      list-style: none;
    }
    .medicare-guide-container details > summary::-webkit-details-marker {
      display: none !important;
    }
    .medicare-guide-container details > summary::marker {
      display: none !important;
    }
    .medicare-guide-container details[open] summary svg.accordion-chevron {
      transform: rotate(180deg);
    }
    .medicare-guide-container table {
      border-collapse: separate;
      border-spacing: 0;
    }

    /* Medicare & ACA Dark Heroic Containers & Utility fallbacks */
    .medicare-dark-navy {
      background-color: #071322 !important;
      background: linear-gradient(135deg, #071322 0%, #0F2342 55%, #1B2A4A 100%) !important;
      color: #ffffff !important;
    }
    .medicare-dark-blue {
      background-color: #071933 !important;
      background: linear-gradient(135deg, #071933 0%, #0f2d57 50%, #17427d 100%) !important;
      color: #ffffff !important;
    }
    .medicare-dark-banner {
      background-color: #081a33 !important;
      background: linear-gradient(135deg, #081a33 0%, #0e2b54 60%, #163d74 100%) !important;
      color: #ffffff !important;
    }
    .medicare-guide-container .bg-white\/10 {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }
    .medicare-guide-container .bg-white\/8 {
      background-color: rgba(255, 255, 255, 0.08) !important;
    }
    .medicare-guide-container .bg-white\/5 {
      background-color: rgba(255, 255, 255, 0.05) !important;
    }
    .medicare-guide-container .bg-white\/12:hover {
      background-color: rgba(255, 255, 255, 0.12) !important;
    }
    .medicare-guide-container .border-white\/10 {
      border-color: rgba(255, 255, 255, 0.1) !important;
    }
    .medicare-guide-container .border-white\/15 {
      border-color: rgba(255, 255, 255, 0.15) !important;
    }
    .medicare-guide-container .border-white\/20 {
      border-color: rgba(255, 255, 255, 0.2) !important;
    }
    .medicare-guide-container .text-slate-300 {
      color: #cbd5e1 !important;
    }
    .medicare-guide-container .text-slate-200 {
      color: #e2e8f0 !important;
    }
    .medicare-guide-container .text-blue-200 {
      color: #bfdbfe !important;
    }
    .medicare-guide-container .text-blue-300 {
      color: #93c5fd !important;
    }
    .medicare-guide-container .text-emerald-200 {
      color: #a7f3d0 !important;
    }
    .medicare-guide-container .text-emerald-300 {
      color: #6ee7b7 !important;
    }
    .medicare-guide-container .bg-emerald-950\/40 {
      background-color: rgba(2, 44, 34, 0.5) !important;
    }
    .medicare-guide-container .bg-blue-950\/40 {
      background-color: rgba(23, 37, 84, 0.5) !important;
    }
    .medicare-guide-container .bg-emerald-500\/30 {
      background-color: rgba(16, 185, 129, 0.3) !important;
    }
    .medicare-guide-container .bg-red-900\/40 {
      background-color: rgba(127, 29, 29, 0.4) !important;
    }
    .medicare-guide-container .bg-red-500\/20 {
      background-color: rgba(239, 68, 68, 0.2) !important;
    }
  </style>
  <style id="njap-logo-anim-styles">
    .njap-brand-link {
      display: inline-flex !important;
      align-items: center !important;
      flex-shrink: 0 !important;
    }
    .njap-brand-link img,
    .njap-brand-link svg {
      height: 52px !important;
      max-height: 54px !important;
      width: auto !important;
      object-fit: contain !important;
    }
    @media (max-width: 640px) {
      .njap-brand-link img,
      .njap-brand-link svg {
        height: 40px !important;
        max-height: 42px !important;
        width: auto !important;
      }
    }
    @media (max-width: 375px) {
      .njap-brand-link img,
      .njap-brand-link svg {
        height: 34px !important;
        max-height: 36px !important;
      }
    }

    @keyframes njapNavKeySlide {
      0% {
        opacity: 0;
        transform: translate(670px, 0);
      }
      15% {
        opacity: 1;
      }
      75% {
        transform: translate(0, 0);
      }
      86% {
        transform: translate(-3.5px, 0);
      }
      100% {
        opacity: 1;
        transform: translate(0, 0);
      }
    }

    @keyframes njapNavKeyholePulse {
      0%, 70% {
        stroke: #DC2626;
        filter: drop-shadow(0 0 0 transparent);
      }
      82% {
        stroke: #EF4444;
        filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.85));
      }
      100% {
        stroke: #DC2626;
        filter: drop-shadow(0 0 0 transparent);
      }
    }

    @keyframes njapNavDoorAppear {
      0% {
        opacity: 0;
        transform: scale(0.96);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes njapNavTextMain {
      0% {
        opacity: 0;
        transform: translate(45px, 0);
      }
      100% {
        opacity: 1;
        transform: translate(0, 0);
      }
    }

    @keyframes njapNavTextSub {
      0% {
        opacity: 0;
        transform: translate(35px, 0);
      }
      100% {
        opacity: 1;
        transform: translate(0, 0);
      }
    }

    .njap-nav-door {
      transform-origin: 40px 45px;
      animation: njapNavDoorAppear 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .njap-nav-key {
      animation: njapNavKeySlide 2.18s cubic-bezier(0.22, 1, 0.36, 1) 0.22s both;
    }

    .njap-nav-keyhole {
      animation: njapNavKeyholePulse 2.4s ease-out 0.22s both;
    }

    .njap-nav-text-main {
      animation: njapNavTextMain 1.0s cubic-bezier(0.16, 1, 0.3, 1) 2.18s both;
    }

    .njap-nav-text-sub {
      animation: njapNavTextSub 1.0s cubic-bezier(0.16, 1, 0.3, 1) 2.48s both;
    }

    @media (prefers-reduced-motion: reduce) {
      .njap-nav-door, .njap-nav-key, .njap-nav-keyhole, .njap-nav-text-main, .njap-nav-text-sub {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
    }
  </style>
</head>
<body class="min-h-full flex flex-col bg-brand-light">

  <!-- Top Marquee Banner -->
  <div class="fixed top-0 left-0 right-0 z-50 h-[45px] overflow-hidden flex items-center marquee-bar">
    <div class="marquee-track whitespace-nowrap">
      <span class="inline-block font-sans text-xs text-white/90 tracking-wide px-12">
        의료접근포털: &quot;비영리기관들의 의료관련 정보서비스의 한계를 넘어, 최고의 의료시스템 전문가들이 제공하는 언어와 문화의 장벽 없는 무료 프리미엄 의료 접근·네비게이션 서비스&quot;
      </span>
      <span class="inline-block font-sans text-xs text-white/90 tracking-wide px-12">
        의료접근포털: &quot;비영리기관들의 의료관련 정보서비스의 한계를 넘어, 최고의 의료시스템 전문가들이 제공하는 언어와 문화의 장벽 없는 무료 프리미엄 의료 접근·네비게이션 서비스&quot;
      </span>
    </div>
  </div>

  <!-- Main Navigation Bar -->
  <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-sm border-b border-brand-border nav-top-offset">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <a class="flex items-center cursor-pointer njap-brand-link flex-shrink-0 group" href="/" onclick="navigateToHome(event); return false;" title="NJ Access Portal · 뉴저지 한인 의료접근포털">
          <svg class="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform group-hover:scale-102" viewBox="0 0 320 60" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NJ Access Portal · 뉴저지 한인 의료접근포털" style="overflow: visible;">
            <title>NJ Access Portal · 뉴저지 한인 의료접근포털</title>
            <!-- Icon Mark (Door + Key + NJAP) -->
            <g transform="translate(4, 2) scale(0.56)" stroke-linecap="round" stroke-linejoin="round">
              <!-- Door Frame & NJAP Text -->
              <g class="njap-nav-door" stroke="#1E3A8A">
                <line x1="20" y1="12" x2="20" y2="88" stroke-width="3.5" />
                <rect x="25" y="12" width="55" height="76" rx="2" stroke-width="4" fill="none" />
                <polyline points="25,16 52,25 52,36" stroke-width="3.5" />
                <text x="52.5" y="81" font-family="'Times New Roman', serif" font-size="13.5" font-weight="900" letter-spacing="1.5" fill="#1E3A8A" stroke="none" text-anchor="middle">NJAP</text>
              </g>
              
              <!-- Keyhole -->
              <path class="njap-nav-keyhole" d="M 43,45 A 7,7 0 1,1 53,45 L 56,64 L 40,64 Z" stroke="#DC2626" stroke-width="3.5" fill="none" />
              
              <!-- Key: enters from right side into the door -->
              <g class="njap-nav-key">
                <circle cx="74" cy="45" r="6.5" stroke="#DC2626" stroke-width="3.5" fill="none" />
                <line x1="47" y1="45" x2="67.5" y2="45" stroke="#DC2626" stroke-width="3.5" />
                <line x1="49" y1="45" x2="49" y2="49" stroke="#DC2626" stroke-width="3.5" />
                <line x1="53" y1="45" x2="53" y2="48" stroke="#DC2626" stroke-width="3" />
              </g>
            </g>

            <!-- Typography: slides in from right after key enters -->
            <g class="njap-nav-text-main">
              <text x="64" y="27" font-family="Pretendard, -apple-system, system-ui, sans-serif" font-size="18" font-weight="900" fill="#0B192C" letter-spacing="-0.5">NJ Access Portal</text>
            </g>
            <g class="njap-nav-text-sub">
              <text x="64" y="44" font-family="Pretendard, -apple-system, system-ui, sans-serif" font-size="10.5" font-weight="600" fill="#64748B" letter-spacing="0.2">뉴저지 한인 의료접근포털</text>
            </g>
          </svg>
        </a>
        <div class="hidden md:flex items-center" style="display: flex; align-items: center; gap: 24px;">
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/">홈</a>
          <a class="nav-link pb-0.5 text-slate-700 hover:text-brand-blue" href="/blog">뉴스</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/forum">뉴저지 한인 광장</a>
          <a class="nav-link pb-0.5 font-bold text-brand-blue flex flex-col items-center justify-center leading-tight text-center" href="/resource-center">
            <span class="text-[12px] leading-tight font-semibold">의료&amp;커뮤니티</span>
            <span class="text-[14px] leading-tight font-bold">정보센터</span>
          </a>
          <a class="nav-link pb-0.5 text-slate-700 hover:text-brand-blue" href="/about">의료 접근센터</a>
          <a class="nav-link pb-0.5 text-slate-700 hover:text-brand-blue flex flex-col items-center justify-center leading-tight" href="/engine">
            <span class="text-[13.5px] font-bold text-slate-800">Engine</span>
            <span class="text-[9px] font-semibold text-slate-400">Marketing Client</span>
          </a>
        </div>
        <div class="flex items-center gap-3">
          <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <img src="/kakaotalk-icon.png" alt="KakaoTalk" class="w-6 h-6 rounded-md shrink-0 object-contain shadow-xs" />
            <span class="text-xs sm:text-sm font-bold text-slate-800 hover:text-brand-blue whitespace-nowrap">1:1 상담</span>
          </a>
          <button id="mobile-menu-btn" class="md:hidden p-2 rounded-lg hover:bg-slate-100" aria-label="Menu">
            <div class="w-5 h-4 flex flex-col justify-between">
              <span class="block h-0.5 bg-brand-dark rounded-full"></span>
              <span class="block h-0.5 bg-brand-dark rounded-full"></span>
              <span class="block h-0.5 bg-brand-dark rounded-full"></span>
            </div>
          </button>
        </div>
      </div>
    </div>
    <div id="mobile-menu-dropdown" class="md:hidden overflow-hidden transition-all duration-300 max-h-0 opacity-0 bg-white/98 backdrop-blur-md border-t border-brand-border px-4 py-3 flex flex-col gap-1" style="-webkit-overflow-scrolling: touch;">
      <!-- 1. 홈 -->
      <a href="/" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span class="text-[15px]">홈</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 2. 뉴스 -->
      <a href="/blog" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
          <span class="text-[15px]">뉴스</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 2.5. 뉴저지 한인 광장 -->
      <a href="/forum" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>
          <span class="text-[15px]">뉴저지 한인 광장</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 4. 의료&커뮤니티 정보센터 -->
      <a href="/resource-center" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-bold text-brand-blue bg-blue-50/70">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          <div class="flex flex-col text-left leading-tight">
            <span class="text-[12px] text-blue-600 font-medium">의료&amp;커뮤니티</span>
            <span class="text-[15px] font-bold text-brand-blue">정보센터</span>
          </div>
        </div>
        <svg class="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 6. 의료 접근센터 -->
      <a href="/about" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span class="text-[15px]">의료 접근센터</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 7. Engine (Marketing Client) -->
      <a href="/engine" target="_self" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          <div class="flex flex-col text-left">
            <span class="text-[15px] font-bold text-slate-800">Engine</span>
            <span class="text-[10px] font-semibold text-slate-400 leading-none">Marketing Client</span>
          </div>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>
    </div>
  </nav>

  <div class="h-[109px]"></div>

  <main class="flex-1">
    <!-- 1. TWO-PHASE / BILLBOARD STYLE HERO WITH 3-BUTTON RELATIVE SLIDES -->
    <section id="rc-hero-billboard-section" class="w-full mb-8 overflow-hidden select-none" style="width:100vw; max-width:100vw; position:relative; left:50%; right:50%; margin-left:-50vw; margin-right:-50vw;" aria-label="NJ Access Portal 의료정보센터 하이라이트">
      
      <!-- Ambient radial glow overlay for visual depth -->
      <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(circle at 75% 35%, rgba(31, 111, 168, 0.28) 0%, rgba(15, 35, 66, 0) 70%); z-index: 1;"></div>
      <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(circle at 20% 80%, rgba(127, 200, 192, 0.1) 0%, transparent 50%); z-index: 1;"></div>

      <div class="relative w-full z-10 flex flex-col justify-between py-6 sm:py-9 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
                <!-- Header row inside billboard (Badge & Centered Global Search) -->
        <div class="relative w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-7">
          <div class="shrink-0">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-500/25 text-blue-200 border border-blue-400/40 backdrop-blur-md shadow-xs">
              <span class="w-2 h-2 rounded-full bg-[#7FC8C0] animate-pulse"></span>
              2026/2027 New Jersey Official Knowledge Hub
            </span>
          </div>

          <!-- Centered, Prominent Global Search Button in the Top Area of the Hero Section -->
          <div class="sm:absolute sm:left-1/2 sm:-translate-x-1/2 z-20 flex justify-center w-full sm:w-auto">
            <button type="button" onclick="openSearchModal()" 
                    class="inline-flex items-center justify-center gap-2.5 px-5 py-2 rounded-full text-xs sm:text-sm font-bold bg-white text-slate-900 border border-sky-400 shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:bg-slate-50 hover:border-sky-400 hover:shadow-[0_6px_22px_rgba(56,189,248,0.4)] hover:scale-[1.02] transition-all cursor-pointer select-none backdrop-blur-md"
                    style="background: #ffffff !important; color: #0f172a !important; border: 1.5px solid #38bdf8 !important; box-shadow: 0 4px 18px rgba(0,0,0,0.25) !important;"
                    aria-label="전체검색 열기">
              <i class="fa-solid fa-magnifying-glass text-[#1B6FA8] text-xs sm:text-sm"></i>
              <span style="color: #0f172a !important; font-weight: 800 !important; letter-spacing: -0.01em !important;">전체검색</span>
              <span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] sm:text-xs font-mono font-bold border border-slate-200">⌘K</span>
            </button>
          </div>

          <!-- Right placeholder spacer on desktop for balance -->
          <div class="hidden sm:block shrink-0 w-[240px]"></div>
        </div>

        <!-- Middle Row: Left Content Slide Panels & Right Visual Card -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center flex-1 my-auto">
          
          <!-- Left Column: Content Panels (Only active slide visible) -->
          <div class="order-1 lg:order-1 lg:col-span-7 flex flex-col justify-center relative min-h-[250px] sm:min-h-[270px]">
            
            <!-- SLIDE 01: 자격확인 계산기 -->
            <div id="rc-hero-slide-1" class="hero-slide" data-slide="1">
              <div>
                <span class="hero-pill-badge">
                  <span class="w-2 h-2 rounded-full bg-[#7FC8C0] animate-pulse"></span>
                  2026 복지 혜택 &amp; 자격 진단
                </span>
              </div>
              <h1 class="hero-main-title">
                뉴저지 의료·복지 혜택<br>
                <span class="hero-gradient-accent">실시간 자격확인 계산기</span>
              </h1>
              <p class="hero-main-desc">
                NJ FamilyCare(메디케이드), 시니어 동결세(Senior Freeze), PAAD 의약품 지원, SNAP 푸드스탬프 자격을 가구원 수와 월 소득에 맞춰 즉시 자동 산출합니다.
              </p>
              <div class="hero-btn-row">
                <button type="button" onclick="window.rcHeroTabClick('calculator', false)" class="hero-btn-primary">
                  <span>계산기 시작하기</span>
                </button>
                <button type="button" onclick="window.rcHeroTabClick('calculator', false)" class="hero-btn-white">
                  <span>수혜 기준표 보기</span>
                </button>
              </div>
            </div>

            <!-- SLIDE 02: 커뮤니티 리소스 -->
            <div id="rc-hero-slide-2" class="hero-slide hidden opacity-0 translate-y-3" data-slide="2">
              <div>
                <span class="hero-pill-badge">
                  <span class="w-2 h-2 rounded-full bg-[#4FA3D1] animate-pulse"></span>
                  버겐카운티 &amp; 뉴저지 전역 생활 리소스
                </span>
              </div>
              <div class="hero-main-title">
                시니어 주거부터 생활 돌봄까지<br>
                <span class="hero-gradient-accent">검증된 뉴저지 커뮤니티 리소스</span>
              </div>
              <p class="hero-main-desc">
                포트리·팰팍 타운별 시니어 아파트 신청 링크, 공과금 감면(LIHEAP/USF), 푸드뱅크, 성인 주간보호 등 뉴저지 한인을 위해 완벽히 재작성된 80편의 연구 가이드를 제공합니다.
              </p>
              <div class="hero-btn-row">
                <button type="button" onclick="window.rcHeroTabClick('resources', false)" class="hero-btn-primary">
                  <span>커뮤니티 리소스 둘러보기</span>
                </button>
                <button type="button" onclick="window.rcHeroJumpHousing()" class="hero-btn-white">
                  <span>타운별 시니어 아파트</span>
                </button>
              </div>
            </div>

            <!-- SLIDE 03: 메디케어 & ACA -->
            <div id="rc-hero-slide-3" class="hero-slide hidden opacity-0 translate-y-3" data-slide="3">
              <div>
                <span class="hero-pill-badge">
                  <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                  2026 연방정부 및 뉴저지 공식 개정
                </span>
              </div>
              <div class="hero-main-title">
                메디케어 오픈 인롤먼트 &amp; ACA<br>
                <span class="hero-gradient-accent">2026 핵심 변경 사항 완벽 총정리</span>
              </div>
              <p class="hero-main-desc">
                인플레이션 감축법(IRA) 파트 D 약값 상한제 $2,100, 파트 B 표준 보험료 $202.90, 오리지널 vs 어드밴티지 맞춤 선택 전략과 저소득층 보조(Extra Help)를 확인하세요.
              </p>
              <div class="hero-btn-row">
                <button type="button" onclick="window.rcHeroTabClick('medicare', false)" class="hero-btn-primary">
                  <span>메디케어 가이드 읽기</span>
                </button>
                <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="hero-btn-kakao">
                  <span>카카오톡 1:1 상담</span>
                </a>
              </div>
            </div>

            <!-- SLIDE 04: 시니어 -->
            <div id="rc-hero-slide-4" class="hero-slide hidden opacity-0 translate-y-3" data-slide="4">
              <div>
                <span class="hero-pill-badge">
                  <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  뉴저지 65세 이상 어르신 맞춤 복지 &amp; 생활
                </span>
              </div>
              <div class="hero-main-title">
                시니어 주거·처방약·재택돌봄·세금동결<br>
                <span class="hero-gradient-accent">뉴저지 시니어 복지 핵심 가이드</span>
              </div>
              <p class="hero-main-desc">
                HUD 202 독립 시니어 아파트, PAAD $5 약값 상한제, PPP 가족 간병인 유급 지원, 65세 이상 재산세 동결(Senior Freeze) 및 성인 데이케어까지 한눈에 확인하세요.
              </p>
              <div class="hero-btn-row">
                <button type="button" onclick="window.rcHeroTabClick('senior', false)" class="hero-btn-primary">
                  <span>시니어 리소스 둘러보기</span>
                </button>
                <button type="button" onclick="window.rcHeroTabClick('senior', false)" class="hero-btn-white">
                  <span>시니어 6대 분야별 보기</span>
                </button>
              </div>
            </div>

          </div>

          <!-- Right Column: Visual Card with Caption -->
          <div class="order-2 lg:order-2 lg:col-span-5 flex justify-center w-full">
            <div class="hero-card-container">
              <!-- Visual Images (Pre-rendered for instantaneous fade transition) -->
              <img id="rc-hero-visual-1" src="/uploads/images/hero_slide_5.jpg" alt="2026 복지 혜택 자격확인 계산기" class="hero-visual-img" style="opacity: 1; transform: scale(1.0); z-index: 10;" />
              <img id="rc-hero-visual-2" src="/uploads/images/hero_slide_2.jpg" alt="시니어 주거 및 커뮤니티 리소스" loading="lazy" class="hero-visual-img" style="opacity: 0; transform: scale(1.02); z-index: 1;" />
              <img id="rc-hero-visual-3" src="/uploads/images/hero_slide_1.jpg" alt="2026 메디케어 및 ACA 완벽 가이드" loading="lazy" class="hero-visual-img" style="opacity: 0; transform: scale(1.02); z-index: 1;" />
              <img id="rc-hero-visual-4" src="/uploads/images/hero_slide_3.jpg" alt="뉴저지 시니어 복지 및 생활 리소스" loading="lazy" class="hero-visual-img" style="opacity: 0; transform: scale(1.02); z-index: 1;" />
              
              <!-- Bottom Caption Bar -->
              <div class="hero-card-caption-bar">
                <span id="rc-hero-visual-caption" class="hero-card-caption-text">
                  2026 연방 빈곤선(FPL) 기준 실시간 자동 판정
                </span>
                <span class="hero-card-caption-num">
                  <span id="rc-hero-visual-num">01</span> / 04
                </span>
              </div>
            </div>
          </div>

        </div>

        <!-- Bottom: The 4 Button Relative Slide Navigator (Role tablist matching index.php billboard style) -->
        <div class="mt-6 pt-3 sm:pt-4 border-t border-white/10 w-full">
          <div role="tablist" aria-label="의료정보센터 주요 서비스 하이라이트" class="rc-hero-tabs-grid">
            
            <!-- Button 1: 자격확인 계산기 -->
            <button role="tab" id="rc-billboard-tab-1" aria-controls="rc-hero-slide-1" aria-selected="true" tabindex="0" onclick="window.rcHeroTabClick('calculator', false)" class="hero-tab-item rc-hero-tab active" data-slide="1" data-tab="calculator">
              <span class="hero-tab-sub">01</span>
              <span class="hero-tab-title">자격확인 계산기</span>
              <div class="hero-tab-bar"></div>
            </button>

            <!-- Button 2: 커뮤니티 리소스 -->
            <button role="tab" id="rc-billboard-tab-2" aria-controls="rc-hero-slide-2" aria-selected="false" tabindex="-1" onclick="window.rcHeroTabClick('resources', false)" class="hero-tab-item rc-hero-tab" data-slide="2" data-tab="resources">
              <span class="hero-tab-sub">02</span>
              <span class="hero-tab-title">커뮤니티 리소스</span>
              <div class="hero-tab-bar"></div>
            </button>

            <!-- Button 3: 메디케어 & ACA -->
            <button role="tab" id="rc-billboard-tab-3" aria-controls="rc-hero-slide-3" aria-selected="false" tabindex="-1" onclick="window.rcHeroTabClick('medicare', false)" class="hero-tab-item rc-hero-tab" data-slide="3" data-tab="medicare">
              <span class="hero-tab-sub">03</span>
              <span class="hero-tab-title">메디케어 &amp; ACA</span>
              <div class="hero-tab-bar"></div>
            </button>

            <!-- Button 4: 시니어 -->
            <button role="tab" id="rc-billboard-tab-4" aria-controls="rc-hero-slide-4" aria-selected="false" tabindex="-1" onclick="window.rcHeroTabClick('senior', false)" class="hero-tab-item rc-hero-tab" data-slide="4" data-tab="senior">
              <span class="hero-tab-sub">04</span>
              <span class="hero-tab-title">시니어</span>
              <div class="hero-tab-bar"></div>
            </button>

          </div>
        </div>

      </div>
    </section>

    <!-- CONTENT CONTAINER -->
    <div id="rc-main-content" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- ========================================================
           TAB 1: CALCULATOR VIEW
           ======================================================== -->
      <section id="tab-view-calculator" class="rc-tab-view">
        <div class="mb-8">
          <span class="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-1">NJ Benefits Screener</span>
          <h2 class="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            2026 복지 혜택 &amp; 의료 자격확인 계산기
          </h2>
          <p class="text-sm text-slate-600 mt-1">
            가구원 수, 월 소득 및 조건을 입력하시면 뉴저지 패밀리케어(메디케이드), 메디케어 저축(MSP·PAAD), 푸드스탬프(SNAP), 시니어 아파트, 재산세 환급(시니어 프리즈) 등 맞춤 수혜 자격을 실시간 분석합니다.
          </p>
        </div>

        <div class="rc-calc-grid">
          <!-- Form Inputs -->
          <div class="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-6">
            
            <!-- 1. Household Size -->
            <div>
              <label for="calcSize" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. 가구원 수 (Household Size)
              </label>
              <select id="calcSize" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-sm bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none">
                <option value="1" selected>1인 가구 (Single)</option>
                <option value="2">2인 가구 (Couple / 2 Persons)</option>
                <option value="3">3인 가구 (3 Persons)</option>
                <option value="4">4인 가구 (4 Persons)</option>
                <option value="5">5인 가구 (5 Persons)</option>
                <option value="6">6인 이상 가구 (6+ Persons)</option>
              </select>
            </div>

            <!-- 2. Gross Monthly Income -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label for="calcIncome" class="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. 세전 월 총소득 (Gross Monthly Income)
                </label>
                <span id="calcAnnualLabel" class="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  연간 약 $18,000 / year
                </span>
              </div>
              <div class="flex items-center gap-3 mb-2">
                <span class="text-slate-400 font-bold">$</span>
                <input type="number" id="calcIncome" value="1500" min="0" max="25000" step="50" class="w-full px-4 py-2 rounded-xl border border-slate-300 text-lg font-extrabold text-slate-900 focus:border-blue-500 focus:outline-none" />
              </div>
              <input type="range" id="calcIncomeSlider" value="1500" min="0" max="10000" step="50" class="w-full accent-blue-600 cursor-pointer mb-3" />
              
              <!-- Quick Select Buttons -->
              <div class="flex flex-wrap gap-1.5 text-xs">
                <button type="button" class="rc-quick-btn" data-amt="0">$0 (무소득)</button>
                <button type="button" class="rc-quick-btn" data-amt="1255">$1,255 (ABD 메디케이드)</button>
                <button type="button" class="rc-quick-btn" data-amt="1835">$1,835 (오바마케어 138%)</button>
                <button type="button" class="rc-quick-btn" data-amt="2461">$2,461 (SNAP 185%)</button>
                <button type="button" class="rc-quick-btn" data-amt="2982">$2,982 (MLTSS 장기요양)</button>
                <button type="button" class="rc-quick-btn" data-amt="4578">$4,578 (PAAD 약값)</button>
              </div>
            </div>

            <!-- 3. Age Group -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. 신청자 연령대 (Applicant Age)
              </label>
              <div class="grid grid-cols-3 gap-2.5">
                <label class="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-blue-50/50 has-checked:border-blue-600 has-checked:bg-blue-50/80 transition-all">
                  <input type="radio" name="calcAge" value="under-19" class="sr-only" />
                  <span class="text-xs font-bold text-slate-800">만 18세 이하</span>
                  <span class="text-[11px] text-slate-500">CHIP 아동</span>
                </label>
                <label class="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-blue-50/50 has-checked:border-blue-600 has-checked:bg-blue-50/80 transition-all">
                  <input type="radio" name="calcAge" value="19-64" checked class="sr-only" />
                  <span class="text-xs font-bold text-slate-800">만 19~64세</span>
                  <span class="text-[11px] text-slate-500">성인 / ACA</span>
                </label>
                <label class="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-blue-50/50 has-checked:border-blue-600 has-checked:bg-blue-50/80 transition-all">
                  <input type="radio" name="calcAge" value="65+" class="sr-only" />
                  <span class="text-xs font-bold text-slate-800">만 65세 이상</span>
                  <span class="text-[11px] text-slate-500">시니어 메디케어</span>
                </label>
              </div>
            </div>

            <!-- 4. Special Conditions -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                4. 특수 조건 선택 (Special Conditions)
              </label>
              <div class="space-y-2 text-xs text-slate-700">
                <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" id="calcDisabled" class="rc-calc-checkbox w-4 h-4 rounded text-blue-600" />
                  <span>장애 판정 또는 SSDI 24개월 이상 수령 중</span>
                </label>
                <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" id="calcMedicare" class="rc-calc-checkbox w-4 h-4 rounded text-blue-600" />
                  <span>현재 메디케어(Medicare) 소지 중</span>
                </label>
                <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" id="calcHomeowner" class="rc-calc-checkbox w-4 h-4 rounded text-blue-600" />
                  <span>뉴저지 자택 소유 (재산세 환급 / 시니어 프리즈 대상)</span>
                </label>
                <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" id="calcCare" class="rc-calc-checkbox w-4 h-4 rounded text-blue-600" />
                  <span>재택 간병 / 일상생활 돌봄(식사, 목욕) 보조 필요</span>
                </label>
                <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" id="calcLowAssets" checked class="rc-calc-checkbox w-4 h-4 rounded text-blue-600" />
                  <span>유동 자산 $4,000(단독) / $6,000(부부) 이하 (집 1채, 차량 1대 제외)</span>
                </label>
                <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" id="calcPregnant" class="rc-calc-checkbox w-4 h-4 rounded text-blue-600" />
                  <span>임신 중 (Pregnancy Medicaid 기준 적용)</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Evaluation Results -->
          <div class="flex flex-col gap-4">
            <div class="p-6 rounded-2xl text-white shadow-md" style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%) !important; color: #ffffff !important;">
              <div class="text-xs font-bold uppercase tracking-wider text-blue-300 mb-1">Screening Summary</div>
              <div id="calcEligibleCount" class="text-2xl sm:text-3xl font-serif font-extrabold mb-1 text-white">분석 중...</div>
              <div id="calcFplInfo" class="text-xs text-blue-100">연방 빈곤선 계산 중...</div>
            </div>

            <!-- Dynamic Result Cards -->
            <div id="calcResultsContainer" class="flex flex-col gap-3.5">
              <!-- Injected dynamically via JS with working link to resources/services -->
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================================
           TAB 2: COMMUNITY RESOURCES (8 CATEGORIES & INLINE READER)
           ======================================================== -->
      <section id="tab-view-resources" class="rc-tab-view hidden">
        <div class="mb-8">
          <span class="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-1">New Jersey Community Safety Nets</span>
          <h2 class="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            커뮤니티 리소스 (분야별 복지·주거·의료 안전망)
          </h2>
          <p class="text-sm text-slate-600 mt-1">
            시니어 아파트, 서민 주거 로또 포털부터 주정부 재정·식비 보조, 패밀리케어 메디케이드, 처방약 절감 및 권익 보호까지 8대 분야의 공식 가이드입니다.
          </p>
        </div>

        <!-- 8 Categorized Choices Grid (Navigation Cards) -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">관심 분야를 선택하세요 (카테고리별 가이드 탐색)</span>
            <button type="button" onclick="window.filterByCategory('all')" id="btnShowAllResources" class="text-xs font-semibold text-blue-600 hover:text-blue-800 underline cursor-pointer">전체 가이드 보기</button>
          </div>
          <div id="categoryChoicesContainer" class="rc-choices-grid">
            <!-- 8 Category Choice Cards injected dynamically -->
          </div>
        </div>

        <!-- Inline Guide Reader Container (NO POP UP!) -->
        <div id="inlineResourceReader" class="hidden mb-10 p-6 sm:p-8 rounded-3xl bg-white border-2 border-blue-500/40 shadow-xl transition-all">
          <div class="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <span id="inlineReaderCatBadge" class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">카테고리</span>
            </div>
            <div class="flex items-center gap-2">
              <button type="button" onclick="window.print()" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center cursor-pointer">
                <span>인쇄 / PDF</span>
              </button>
              <button type="button" onclick="closeInlineReader()" class="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer">
                <span>✕ 닫기</span>
              </button>
            </div>
          </div>
          <div id="inlineReaderContent" class="text-slate-800 text-sm sm:text-base leading-relaxed">
            <!-- Full rewritten guide content injected dynamically -->
          </div>
          <div class="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button type="button" onclick="closeInlineReader()" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer">
              ▲ 가이드 접기 (목록으로 돌아가기)
            </button>
          </div>
        </div>

        <!-- Housing Special Section (Towns & Application Guide) -->
        <div id="housingSpecialSection" class="mb-10">
          <!-- 4-Step Checklist for Housing Application -->
          <div class="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs mb-8">
            <h3 class="text-lg font-serif font-bold text-slate-900 mb-4">
              시니어 아파트 &amp; 어포더블 하우징 4단계 한국어 신청 가이드
            </h3>
            <div class="rc-grid-4 text-xs">
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span class="font-extrabold text-blue-600 block mb-1">STEP 1. 자격 확인</span>
                <p class="text-slate-700 leading-relaxed">
                  만 62세 이상(일부 55세+) 또는 장애인 요건 충족 및 지역 중위소득(AMI) 30%~50% 이하 소득 대조 (1인 가구 약 $38,000~$48,500 이하).
                </p>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span class="font-extrabold text-blue-600 block mb-1">STEP 2. 필수 서류 구비</span>
                <p class="text-slate-700 leading-relaxed">
                  신분증, 소셜시큐리티 카드, 최근 연방/주 세금보고서(1040), W-2/1099, 최근 3~6개월 은행 잔고 증명서(Bank Statement), 연금 증서.
                </p>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span class="font-extrabold text-blue-600 block mb-1">STEP 3. 포털 접수</span>
                <p class="text-slate-700 leading-relaxed">
                  버겐카운티 주택청(HABC) 포털 및 CGP&H, PiazzaNJ 로또 사이트에 등록 후 공고 발생 시 온라인/우편 신청서 즉시 접수.
                </p>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span class="font-extrabold text-blue-600 block mb-1">STEP 4. 연례 갱신</span>
                <p class="text-slate-700 leading-relaxed">
                  대기자 명부(Waiting List)에 등록된 후 매년 발송되는 주소 확인 우편에 회신해야 순위가 유지됩니다. 미회신 시 자동 탈락되므로 주의.
                </p>
              </div>
            </div>
          </div>

          <!-- Official Application Portal Buttons -->
          <div class="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 class="text-sm font-bold text-blue-900">뉴저지 공식 주택 신청 및 로또 포털 링크</h4>
              <p class="text-xs text-blue-700">원하시는 관리 기관을 클릭하여 공식 웹사이트로 바로 이동하세요.</p>
            </div>
            <div class="flex flex-wrap gap-2 text-xs">
              <a href="https://habcnj.org/apply_for_housing/index.php" target="_blank" rel="noopener noreferrer" class="rc-portal-btn rc-portal-btn-habc">
                버겐카운티 HABC 신청 포털 &rarr;
              </a>
              <a href="https://www.affordablehomesnewjersey.com" target="_blank" rel="noopener noreferrer" class="rc-portal-btn rc-portal-btn-cgp">
                Affordable Homes NJ (CGP&H) &rarr;
              </a>
              <a href="https://www.piazzanj.com" target="_blank" rel="noopener noreferrer" class="rc-portal-btn rc-portal-btn-piazza">
                Piazza &amp; Associates &rarr;
              </a>
              <a href="https://nj.gov/njhrc/" target="_blank" rel="noopener noreferrer" class="rc-portal-btn rc-portal-btn-njhrc">
                NJ Housing Resource Center &rarr;
              </a>
            </div>
          </div>

          <!-- Town Filter Tabs -->
          <div class="flex flex-wrap gap-2 mb-6">
            <button type="button" class="rc-housing-town-btn active" data-town="all">전체 타운</button>
            <button type="button" class="rc-housing-town-btn" data-town="fort-lee">포트리 (Fort Lee)</button>
            <button type="button" class="rc-housing-town-btn" data-town="palisades-park">팰리세이즈파크 (Palisades Park)</button>
            <button type="button" class="rc-housing-town-btn" data-town="englewood">잉글우드 (Englewood)</button>
            <button type="button" class="rc-housing-town-btn" data-town="hackensack">해켄색 (Hackensack)</button>
            <button type="button" class="rc-housing-town-btn" data-town="cliffside-park">클리프사이드파크</button>
            <button type="button" class="rc-housing-town-btn" data-town="edgewater">에지워터 (Edgewater)</button>
            <button type="button" class="rc-housing-town-btn" data-town="leonia">레오니아 (Leonia)</button>
            <button type="button" class="rc-housing-town-btn" data-town="habc">버겐 카운티 HABC 전역</button>
          </div>

          <!-- Housing Developments Cards Grid -->
          <div class="rc-grid-3 mb-10">
            <!-- Fort Lee 1 -->
            <div class="rc-housing-card p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between" data-town="fort-lee">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">포트리 시니어</span>
                  <span class="text-xs font-semibold text-slate-500">만 62세 이상</span>
                </div>
                <h4 class="text-base font-bold text-slate-900 mb-1">Harry Holtje House</h4>
                <p class="text-xs text-slate-600 mb-3">1425 10th St, Fort Lee, NJ 07024</p>
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3 space-y-1">
                  <div>• <strong>관리 기관:</strong> 포트리 주택청 (Housing Authority of Fort Lee)</div>
                  <div>• <strong>연락처:</strong> 201-947-7400</div>
                  <div>• <strong>임대 조건:</strong> 수입의 30% 수준 임대료, 엘리베이터 및 편의시설</div>
                </div>
              </div>
              <a href="http://www.flha.org" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-blue-600 hover:text-blue-800 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span>포트리 주택청 공식 안내</span> <span>&rarr;</span>
              </a>
            </div>

            <!-- Fort Lee 2 -->
            <div class="rc-housing-card p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between" data-town="fort-lee">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">포트리 메인 스트리트</span>
                  <span class="text-xs font-semibold text-slate-500">만 62세 이상</span>
                </div>
                <h4 class="text-base font-bold text-slate-900 mb-1">Malcolm Towers</h4>
                <p class="text-xs text-slate-600 mb-3">475 Main St, Fort Lee, NJ 07024</p>
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3 space-y-1">
                  <div>• <strong>관리 기관:</strong> 포트리 주택청 (FLHA)</div>
                  <div>• <strong>전화:</strong> 201-944-5270 / 201-947-7400</div>
                  <div>• <strong>위치 장점:</strong> 포트리 중심 상권, 한인 마트 및 버스 정류장 도보권</div>
                </div>
              </div>
              <a href="http://www.flha.org" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-blue-600 hover:text-blue-800 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span>상세 정보 보기</span> <span>&rarr;</span>
              </a>
            </div>

            <!-- Palisades Park -->
            <div class="rc-housing-card p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between" data-town="palisades-park">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">팰리세이즈파크 시니어</span>
                  <span class="text-xs font-semibold text-slate-500">만 62세 이상</span>
                </div>
                <h4 class="text-base font-bold text-slate-900 mb-1">Highland View Apartments</h4>
                <p class="text-xs text-slate-600 mb-3">300 Highland Ave, Palisades Park, NJ 07650</p>
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3 space-y-1">
                  <div>• <strong>관리 기관:</strong> 버겐카운티 주택청 (HABC)</div>
                  <div>• <strong>전화:</strong> 201-592-8118 / 201-336-7600</div>
                  <div>• <strong>지역 지원:</strong> 팰팍 시니어 센터 (201-944-5616) 한국어 상담 지원</div>
                </div>
              </div>
              <a href="https://habcnj.org/apply_for_housing/index.php" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-emerald-600 hover:text-emerald-800 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span>HABC 온라인 접수 포털</span> <span>&rarr;</span>
              </a>
            </div>

            <!-- Englewood -->
            <div class="rc-housing-card p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between" data-town="englewood">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">잉글우드 시니어</span>
                  <span class="text-xs font-semibold text-slate-500">만 62세 이상</span>
                </div>
                <h4 class="text-base font-bold text-slate-900 mb-1">Vincent K. Tibbs Senior Building</h4>
                <p class="text-xs text-slate-600 mb-3">111 West St, Englewood, NJ 07631</p>
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3 space-y-1">
                  <div>• <strong>관리 기관:</strong> Englewood Housing Authority</div>
                  <div>• <strong>전화:</strong> 201-871-3451</div>
                  <div>• <strong>혜택:</strong> 152개 시니어 전용 유닛, 커뮤니티룸, 24시간 보안 시스템</div>
                </div>
              </div>
              <a href="https://ehahousing.org" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-purple-600 hover:text-purple-800 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span>잉글우드 주택청 공식 포털</span> <span>&rarr;</span>
              </a>
            </div>

            <!-- Hackensack -->
            <div class="rc-housing-card p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between" data-town="hackensack">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">해켄색 공공 주택</span>
                  <span class="text-xs font-semibold text-slate-500">시니어 &amp; 장애인</span>
                </div>
                <h4 class="text-base font-bold text-slate-900 mb-1">Hackensack Housing Authority</h4>
                <p class="text-xs text-slate-600 mb-3">65 First St, Hackensack, NJ 07601</p>
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3 space-y-1">
                  <div>• <strong>관리 기관:</strong> Hackensack Housing Authority</div>
                  <div>• <strong>전화:</strong> 201-342-4280</div>
                  <div>• <strong>주요 단지:</strong> Oratam Court, Newman Street 고령자 단지</div>
                </div>
              </div>
              <a href="https://hackensackhousing.org" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span>해켄색 주택청 웹사이트</span> <span>&rarr;</span>
              </a>
            </div>

            <!-- Cliffside Park -->
            <div class="rc-housing-card p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between" data-town="cliffside-park">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">클리프사이드파크</span>
                  <span class="text-xs font-semibold text-slate-500">시니어 &amp; 저소득</span>
                </div>
                <h4 class="text-base font-bold text-slate-900 mb-1">Gerald A. Calabrese Complex</h4>
                <p class="text-xs text-slate-600 mb-3">500 Gorge Rd, Cliffside Park, NJ 07010</p>
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3 space-y-1">
                  <div>• <strong>관리 기관:</strong> Cliffside Park Housing Authority</div>
                  <div>• <strong>전화:</strong> 201-941-0655</div>
                  <div>• <strong>특징:</strong> 고층 시니어 아파트, 맨해튼 조망, 한인 시니어 다수 거주</div>
                </div>
              </div>
              <a href="http://www.cphousingauthority.com" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-teal-600 hover:text-teal-800 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span>CPHA 공식 홈페이지</span> <span>&rarr;</span>
              </a>
            </div>

            <!-- Edgewater -->
            <div class="rc-housing-card p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between" data-town="edgewater">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">에지워터 강변</span>
                  <span class="text-xs font-semibold text-slate-500">시니어 62+</span>
                </div>
                <h4 class="text-base font-bold text-slate-900 mb-1">Edgewater Senior Housing</h4>
                <p class="text-xs text-slate-600 mb-3">300 Undercliff Ave, Edgewater, NJ 07020</p>
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3 space-y-1">
                  <div>• <strong>관리 기관:</strong> Edgewater Housing Authority</div>
                  <div>• <strong>전화:</strong> 201-943-6000</div>
                  <div>• <strong>특징:</strong> 쾌적한 강변 산책로, H 마트 및 편의시설 인접</div>
                </div>
              </div>
              <a href="http://www.edgewaterha.org" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-sky-600 hover:text-sky-800 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span>에지워터 주택청 안내</span> <span>&rarr;</span>
              </a>
            </div>

            <!-- Leonia -->
            <div class="rc-housing-card p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between" data-town="leonia">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">레오니아 독립 주거</span>
                  <span class="text-xs font-semibold text-slate-500">만 62세 이상</span>
                </div>
                <h4 class="text-base font-bold text-slate-900 mb-1">The Glenwood Senior Residence</h4>
                <p class="text-xs text-slate-600 mb-3">270 Glenwood Ave, Leonia, NJ 07605</p>
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3 space-y-1">
                  <div>• <strong>관리 기관:</strong> Leonia Retirement Housing Corp.</div>
                  <div>• <strong>전화:</strong> 201-947-9779</div>
                  <div>• <strong>특징:</strong> 조용한 주택가 위치, 도서관 및 공원 인접</div>
                </div>
              </div>
              <a href="https://theglenwood.org" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-amber-600 hover:text-amber-800 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span>The Glenwood 웹사이트</span> <span>&rarr;</span>
              </a>
            </div>

            <!-- HABC Countywide -->
            <div class="rc-housing-card p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between" data-town="habc">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">버겐 카운티 주택청 직영</span>
                  <span class="text-xs font-semibold text-slate-500">카운티 14개 단지</span>
                </div>
                <h4 class="text-base font-bold text-slate-900 mb-1">HABC 카운티 통합 시니어 단지</h4>
                <p class="text-xs text-slate-600 mb-3">One Bergen County Plaza, 2nd Fl, Hackensack, NJ</p>
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 mb-3 space-y-1">
                  <div>• <strong>단지 목록:</strong> Brookside (Bergenfield), Boiling Springs (East Rutherford), Carucci (Lyndhurst), Roche (Fair Lawn), Fairview Gardens, River Vale, Saddle Brook 등</div>
                  <div>• <strong>대표 전화:</strong> 201-336-7600</div>
                </div>
              </div>
              <a href="https://habcnj.org/apply_for_housing/index.php" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-blue-600 hover:text-blue-800 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span>HABC 공식 입주 신청하기</span> <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Filter Bar & Search for Guides -->
        <div id="resourcesFilterBar" class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="relative w-full sm:w-80">
            <input type="text" id="resourcesSearchInput" placeholder="제목 또는 키워드 실시간 검색 (예: 메디케이드, SNAP, PAAD)..." class="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div class="flex items-center gap-2">
            <span id="activeCategoryBadge" class="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-800">전체 가이드</span>
            <span id="resourcesCountLabel" class="text-xs font-bold text-slate-500 whitespace-nowrap">총 80개 가이드</span>
          </div>
        </div>

        <!-- Articles Grid -->
        <div id="resourcesGrid" class="rc-grid-3">
          <!-- Injected dynamically via JS -->
        </div>
      </section>

      <!-- ========================================================
           TAB 3: MEDICARE & ACA (MERGED)
           ======================================================== -->
      <section id="tab-view-medicare" class="rc-tab-view hidden">
        <div class="mb-12 sm:mb-14">
          <span class="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-1">Comprehensive Healthcare</span>
          <h2 class="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            2026 메디케어 &amp; ACA 건강보험 완전 가이드
          </h2>
          <p class="text-sm text-slate-600 mt-1">
            2026 연간 가입 기간(AEP) 4단계 체크리스트, 연방 CMS 확정 핵심 수치, 파트 D $2,100 본인부담금 상한제, 오리지널 vs 어드밴티지 비교.
          </p>
        </div>

        <!-- Merged Content from medicare.html -->
        <div class="medicare-embedded-wrap">
          ${medicareSectionsHtml}
        </div>
      </section>

      <!-- ========================================================
           TAB 4: SENIOR RESOURCES (6 CATEGORIES & INLINE READER)
           ======================================================== -->
      <section id="tab-view-senior" class="rc-tab-view hidden">
        <div class="mb-8">
          <span class="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-1">New Jersey Senior Care &amp; Advocacy Hub</span>
          <h2 class="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            뉴저지 시니어 복지 &amp; 시니어 전용 생활 가이드
          </h2>
          <p class="text-sm text-slate-600 mt-1">
            65세 이상 어르신과 가족을 위한 주거(시니어 아파트), 처방약 $5 상한제(PAAD), 가족 간병비(PPP), 재산세 동결(Senior Freeze), 어덜트 데이케어 및 법률 권익 보호를 6대 핵심 분야별로 분류하여 제공합니다.
          </p>
        </div>

        <!-- 4 Senior Highlights / Key Takeaway Cards -->
        <div class="rc-grid-4 mb-8">
          <div class="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
            <div class="flex items-center gap-2 mb-1.5">
              <span class="text-xs font-extrabold text-amber-900">시니어 아파트</span>
            </div>
            <p class="text-xs text-amber-950 font-semibold mb-1">소득의 30% 저렴한 렌트비</p>
            <p class="text-[11px] text-amber-800 leading-relaxed">HUD 202 및 HABC 버겐카운티 타운별 단지 신청 (만 62세 이상).</p>
          </div>

          <div class="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80">
            <div class="flex items-center gap-2 mb-1.5">
              <span class="text-xs font-extrabold text-purple-900">PAAD 처방약 지원</span>
            </div>
            <p class="text-xs text-purple-950 font-semibold mb-1">처방약 1종당 $5 / $7 상한</p>
            <p class="text-[11px] text-purple-800 leading-relaxed">1인 연소득 $54,936 이하 65세 이상 어르신 약값 획기적 절감.</p>
          </div>

          <div class="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80">
            <div class="flex items-center gap-2 mb-1.5">
              <span class="text-xs font-extrabold text-blue-900">가족 간병비 (PPP)</span>
            </div>
            <p class="text-xs text-blue-950 font-semibold mb-1">월 최대 $2,000~$3,500 지원</p>
            <p class="text-[11px] text-blue-800 leading-relaxed">자녀나 가족을 합법적 유급 간병인으로 지정하여 시급 지급.</p>
          </div>

          <div class="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80">
            <div class="flex items-center gap-2 mb-1.5">
              <span class="text-xs font-extrabold text-teal-900">Senior Freeze (PTR)</span>
            </div>
            <p class="text-xs text-teal-950 font-semibold mb-1">인상된 재산세 100% 동결 환급</p>
            <p class="text-[11px] text-teal-800 leading-relaxed">1인 소득 $163,050 이하 65세 이상 주택 소유자 전액 환급 지원.</p>
          </div>
        </div>

        <!-- 6 Categorized Choices Grid (Navigation Cards) -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">시니어 관심 분야를 선택하세요 (6대 카테고리)</span>
            <button type="button" onclick="window.filterBySeniorCategory('all')" id="btnShowAllSeniorResources" class="text-xs font-semibold text-blue-600 hover:text-blue-800 underline cursor-pointer">전체 시니어 가이드 보기</button>
          </div>
          <div id="seniorCategoryChoicesContainer" class="rc-choices-grid">
            <!-- 6 Senior Category Choice Cards injected dynamically -->
          </div>
        </div>

        <!-- Inline Senior Guide Reader Container (NO POP UP!) -->
        <div id="inlineSeniorReader" class="hidden mb-10 p-6 sm:p-8 rounded-3xl bg-white border-2 border-amber-500/40 shadow-xl transition-all">
          <div class="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <span id="inlineSeniorReaderCatBadge" class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">시니어 카테고리</span>
            </div>
            <div class="flex items-center gap-2">
              <button type="button" onclick="window.print()" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center cursor-pointer">
                <span>인쇄 / PDF</span>
              </button>
              <button type="button" onclick="closeSeniorInlineReader()" class="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer">
                <span>✕ 닫기</span>
              </button>
            </div>
          </div>
          <div id="inlineSeniorReaderContent" class="text-slate-800 text-sm sm:text-base leading-relaxed">
            <!-- Full rewritten guide content injected dynamically -->
          </div>
          <div class="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button type="button" onclick="closeSeniorInlineReader()" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer">
              ▲ 시니어 가이드 접기 (목록으로 돌아가기)
            </button>
          </div>
        </div>

        <!-- Filter Bar & Search for Senior Guides -->
        <div id="seniorFilterBar" class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="relative w-full sm:w-80">
            <input type="text" id="seniorSearchInput" placeholder="시니어 가이드 실시간 검색 (예: PAAD, 시니어 아파트, PPP)..." class="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-amber-500 focus:outline-none" />
          </div>
          <div class="flex items-center gap-2">
            <span id="activeSeniorCategoryBadge" class="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">전체 시니어 가이드</span>
            <span id="seniorCountLabel" class="text-xs font-bold text-slate-500 whitespace-nowrap">총 54개 가이드</span>
          </div>
        </div>

        <!-- Senior Articles Grid -->
        <div id="seniorArticlesGrid" class="rc-grid-3 mb-10">
          <!-- Injected dynamically via JS -->
        </div>

        <!-- Senior Official Hotlines & Support Callout -->
        <div class="medicare-dark-navy rounded-2xl p-6 sm:p-8 text-white shadow-xl" style="background: linear-gradient(135deg, #071322 0%, #0F2342 55%, #1B2A4A 100%) !important; color: #ffffff !important;">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-2">
                뉴저지 시니어 공식 직통 핫라인
              </span>
              <h3 class="text-xl font-bold text-white mb-2" style="color: #ffffff !important;">시니어 복지 신청 및 긴급 상담</h3>
              <p class="text-xs text-slate-300 max-w-2xl leading-relaxed" style="color: #cbd5e1 !important;">
                시니어 아파트 대기자 명단 확인, PAAD 신청서 접수, PPP 가족 간병인 평가 등 혼자 진행하기 어려운 절차는 공공 전문 기관 및 NJAP 상담을 통해 지원받으실 수 있습니다.
              </p>
            </div>
            <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="hero-btn-kakao shrink-0">
              <span>카카오톡 1:1 시니어 무료 상담</span>
            </a>
          </div>
          <div class="mt-6 pt-6 border-t border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div class="p-3 rounded-xl border" style="background: rgba(255, 255, 255, 0.08) !important; border: 1px solid rgba(255, 255, 255, 0.15) !important;">
              <div class="font-semibold mb-0.5" style="color: #cbd5e1 !important;">버겐카운티 노인복지국</div>
              <div class="text-base font-bold text-white" style="color: #ffffff !important;">201-336-7400</div>
              <div class="text-[11px]" style="color: #94a3b8 !important;">시니어 서비스 및 프로그램 안내</div>
            </div>
            <div class="p-3 rounded-xl border" style="background: rgba(255, 255, 255, 0.08) !important; border: 1px solid rgba(255, 255, 255, 0.15) !important;">
              <div class="font-semibold mb-0.5" style="color: #cbd5e1 !important;">주정부 PAAD 약값 핫라인</div>
              <div class="text-base font-bold text-white" style="color: #ffffff !important;">1-800-792-9745</div>
              <div class="text-[11px]" style="color: #94a3b8 !important;">NJSave 통합 처방약 지원</div>
            </div>
            <div class="p-3 rounded-xl border" style="background: rgba(255, 255, 255, 0.08) !important; border: 1px solid rgba(255, 255, 255, 0.15) !important;">
              <div class="font-semibold mb-0.5" style="color: #cbd5e1 !important;">Meals on Wheels 도시락</div>
              <div class="text-base font-bold text-white" style="color: #ffffff !important;">201-336-7420</div>
              <div class="text-[11px]" style="color: #94a3b8 !important;">어르신 자택 식사 배달 접수</div>
            </div>
            <div class="p-3 rounded-xl border" style="background: rgba(255, 255, 255, 0.08) !important; border: 1px solid rgba(255, 255, 255, 0.15) !important;">
              <div class="font-semibold mb-0.5" style="color: #cbd5e1 !important;">성인보호국 (APS)</div>
              <div class="text-base font-bold text-white" style="color: #ffffff !important;">201-368-4300</div>
              <div class="text-[11px]" style="color: #94a3b8 !important;">어르신 학대·방임·사기 긴급 보호</div>
            </div>
          </div>
        </div>

      </section>

    </div>
  </main>

    <!-- =======================================================
       Quick Search Window (Cmd+K) - Compact & Centered in Top Hero Area
       ======================================================= -->
  <div id="rcSearchModal" 
       onclick="if(event.target === this) closeSearchModal();" 
       class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-start justify-center p-4 pt-24 sm:pt-28" 
       style="display: none !important;">
    <div class="bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden" 
         onclick="event.stopPropagation();" 
         style="width: 92vw !important; max-width: 320px !important; box-shadow: 0 12px 36px rgba(15, 23, 42, 0.28) !important;">
      <div class="p-3 border-b border-slate-100 flex items-center gap-2 bg-white">
        <i class="fa-solid fa-magnifying-glass text-[#1B6FA8] text-xs sm:text-sm shrink-0 ml-1"></i>
        <input type="text" 
               id="rcSearchModalInput" 
               onkeydown="if(event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27) { event.preventDefault(); closeSearchModal(); }" 
               placeholder="전체검색..." 
               class="w-full text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent" />
        <button type="button" 
                onclick="closeSearchModal()" 
                class="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0">
          ESC
        </button>
      </div>
      <ul id="rcSearchResultsList" class="p-2 max-h-80 overflow-y-auto divide-y divide-slate-100 text-left">
        <!-- Results injected dynamically -->
      </ul>
    </div>
  </div>

  <!-- FOOTER -->
  <footer class="bg-brand-darker text-white py-12 border-t border-slate-800" style="background-color: #071322 !important; background: #071322 !important; color: #ffffff !important;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <div class="font-bold text-lg mb-2 text-white" style="color: #ffffff !important;">NJ Access Portal 의료정보센터</div>
          <p class="text-xs text-slate-400 leading-relaxed" style="color: #94a3b8 !important;">
            뉴저지 한인 동포의 의료 접근성과 권익 신장을 위해 최신 연방 및 주정부 의료·복지 가이드라인과 타운별 주거 정보를 정확하고 투명하게 제공합니다.
          </p>
        </div>
        <div>
          <div class="font-bold text-sm mb-2 text-slate-200" style="color: #e2e8f0 !important;">바로가기</div>
          <ul class="text-xs text-slate-400 space-y-1.5" style="color: #94a3b8 !important;">
            <li><a href="/resource-center#calculator" class="hover:text-white" style="color: #94a3b8 !important;">자격확인 계산기 (Benefits Screener)</a></li>
            <li><a href="/resource-center#resources" class="hover:text-white" style="color: #94a3b8 !important;">커뮤니티 리소스 &amp; 시니어 주택</a></li>
            <li><a href="/resource-center#medicare" class="hover:text-white" style="color: #94a3b8 !important;">2026 메디케어 &amp; ACA 완전 가이드</a></li>
            <li><a href="/resource-center#senior" class="hover:text-white" style="color: #94a3b8 !important;">뉴저지 시니어 복지 가이드</a></li>
            <li><a href="/forum" class="hover:text-white" style="color: #94a3b8 !important;">뉴저지 한인 광장 Q&amp;A</a></li>
          </ul>
        </div>
        <div>
          <div class="font-bold text-sm mb-2 text-slate-200" style="color: #e2e8f0 !important;">상담 및 문의</div>
          <div class="text-xs text-slate-400 space-y-1" style="color: #94a3b8 !important;">
            <div>• 카카오톡: NJAP 1:1 무료 상담</div>
            <div>• 뉴저지 버겐카운티 시니어 서비스: 201-336-7400</div>
            <div>• 주정부 처방약 핫라인(NJSave): 1-800-792-9745</div>
            <div>• 긴급 사회복지 콜센터: NJ 2-1-1</div>
          </div>
        </div>
      </div>
      <div class="pt-6 border-t border-slate-800 text-center text-xs text-slate-500" style="color: #64748b !important; border-top: 1px solid rgba(255,255,255,0.1) !important;">
        &copy; 2026 NJ Access Portal (뉴저지 한인 의료접근포털). All rights reserved. 본 정보는 공공 복지 정보 안내용이며 최종 자격 심사는 관할 주정부 및 주택청의 규정에 따릅니다.
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="/data/resource_center_data.js?v=20261004_medicare_aca_v1"></script>
  <script src="/js/resource_calculator.js?v=20261004_medicare_aca_v1"></script>
  <script src="/js/resource_center.js?v=20261004_medicare_aca_v1"></script>
  <script src="/js/fixes.js?v=8.1.0"></script>
</body>
</html>
`;

fs.writeFileSync(destHtmlPath, html, 'utf8');
console.log(`[SUCCESS] Rebuilt ${destHtmlPath} (${Buffer.byteLength(html, 'utf8')} bytes).`);

fs.writeFileSync(medicareHtmlPath, html, 'utf8');
console.log(`[SUCCESS] Synced ${medicareHtmlPath}`);

const medicareIndexPath = path.join(BASE_DIR, 'medicare', 'index.html');
if (fs.existsSync(path.dirname(medicareIndexPath))) {
  fs.writeFileSync(medicareIndexPath, html, 'utf8');
  console.log(`[SUCCESS] Synced ${medicareIndexPath}`);
}

