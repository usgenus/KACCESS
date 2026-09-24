<?php
/**
 * Healthcare Access Portal - Main Homepage (Instant Dynamic PHP Engine)
 * Renders the latest CMS Billboard, Top Story, Real-time News, Policy Reports, and Video News directly on the server.
 */
require_once __DIR__ . '/api/db.php';
require_once __DIR__ . '/api/forum_db.php';

$db = get_db_data();
$billboards = $db['billboards'] ?? [];
$billboards2 = $db['billboards2'] ?? [];
$videos = $db['videos'] ?? [];
$posts = $db['posts'] ?? [];

$forumQuestions = array_slice(forum_get_questions('', 'latest', '', 'active'), 0, 4);
$forumSpecialties = forum_get_specialties();

// Filter active billboards and sort by order
$activeBillboards = array_values(array_filter($billboards, function($b) {
    return !isset($b['active']) || $b['active'] !== false;
}));
if (empty($activeBillboards) && !empty($billboards)) {
    $activeBillboards = $billboards;
}
usort($activeBillboards, function($a, $b) {
    return ($a['order'] ?? 0) <=> ($b['order'] ?? 0);
});

// Filter active billboards 2 and sort by order
$activeBillboards2 = array_values(array_filter($billboards2, function($b) {
    return !isset($b['active']) || $b['active'] !== false;
}));
if (empty($activeBillboards2) && !empty($billboards2)) {
    $activeBillboards2 = $billboards2;
}
usort($activeBillboards2, function($a, $b) {
    return ($a['order'] ?? 0) <=> ($b['order'] ?? 0);
});

// Filter published posts and sort by newest first (date then updatedAt/createdAt)
$publishedPosts = array_values(array_filter($posts, function($p) {
    return ($p['status'] ?? 'published') === 'published';
}));
usort($publishedPosts, function($a, $b) {
    $d1 = strtotime($a['date'] ?? '1970-01-01');
    $d2 = strtotime($b['date'] ?? '1970-01-01');
    if ($d1 !== $d2) {
        return $d2 <=> $d1;
    }
    $u1 = strtotime($a['updatedAt'] ?? $a['createdAt'] ?? '1970-01-01');
    $u2 = strtotime($b['updatedAt'] ?? $b['createdAt'] ?? '1970-01-01');
    return $u2 <=> $u1;
});
$posts = !empty($publishedPosts) ? $publishedPosts : $posts;

// 1. Doctor / Medical Column (의료칼럼) ONLY: strictly items with isDoctorColumn === true
$doctorPosts = array_values(array_filter($posts, function($p) {
    return !empty($p['isDoctorColumn']) && $p['isDoctorColumn'] !== 'false' && $p['isDoctorColumn'] !== false && $p['isDoctorColumn'] !== 0 && $p['isDoctorColumn'] !== '0';
}));

// Find Top Story (strictly isTopStory === true)
$topStory = null;
foreach ($posts as $p) {
    if (!empty($p['isTopStory']) && $p['isTopStory'] !== 'false' && $p['isTopStory'] !== false && $p['isTopStory'] !== 0 && $p['isTopStory'] !== '0') {
        $topStory = $p;
        break;
    }
}
// If no explicit top story, fall back to newest live update post
if (!$topStory) {
    foreach ($posts as $p) {
        if (!empty($p['isLiveUpdate']) && $p['isLiveUpdate'] !== 'false' && $p['isLiveUpdate'] !== false && $p['isLiveUpdate'] !== 0 && $p['isLiveUpdate'] !== '0') {
            $topStory = $p;
            break;
        }
    }
}
if (!$topStory && !empty($posts)) {
    $topStory = $posts[0];
}

// 2. Middle Column: 실시간 주요 뉴스 (Live Updates - Strictly only posts with isLiveUpdate === true, Max 6)
$latestNews = array_values(array_filter($posts, function($p) use ($topStory) {
    if ($topStory && (string)$p['id'] === (string)$topStory['id']) {
        return false;
    }
    $isLive = !empty($p['isLiveUpdate']) && $p['isLiveUpdate'] !== 'false' && $p['isLiveUpdate'] !== false && $p['isLiveUpdate'] !== 0 && $p['isLiveUpdate'] !== '0';
    return $isLive;
}));
$latestNews = array_slice($latestNews, 0, 6);

// 3. Recalls & Food Safety (Strictly show ONLY posts check-marked with isPolicyReport === true, Max 4)
$reportNews = array_values(array_filter($posts, function($p) {
    return !empty($p['isPolicyReport']) && $p['isPolicyReport'] !== 'false' && $p['isPolicyReport'] !== false && $p['isPolicyReport'] !== 0 && $p['isPolicyReport'] !== '0';
}));
$reportNews = array_slice($reportNews, 0, 4);

// Live update headline (Strictly latest post with isLiveUpdate or isTopStory)
$liveUpdatePost = null;
foreach ($posts as $p) {
    if (!empty($p['isLiveUpdate']) && $p['isLiveUpdate'] !== 'false' && $p['isLiveUpdate'] !== false && $p['isLiveUpdate'] !== 0 && $p['isLiveUpdate'] !== '0') {
        $liveUpdatePost = $p;
        break;
    }
}
if (!$liveUpdatePost && $topStory) {
    $liveUpdatePost = $topStory;
}
$liveHeadline = !empty($liveUpdatePost['title']) ? $liveUpdatePost['title'] : '뉴저지 한인 의료 접근 포털 — 2026 메디케어 및 ACA 오바마케어 수혜 자격 종합 안내 개시';
$liveSlug = !empty($liveUpdatePost['slug']) ? $liveUpdatePost['slug'] : (!empty($liveUpdatePost['id']) ? $liveUpdatePost['id'] : '');

// Medical videos
$activeVideos = array_values(array_filter($videos, function($v) {
    return !isset($v['active']) || $v['active'] !== false;
}));
if (empty($activeVideos) && !empty($videos)) {
    $activeVideos = $videos;
}
$mainVideo = $activeVideos[0] ?? null;
$playlistVideos = array_slice($activeVideos, 0, 7);
?>
<!DOCTYPE html>
<html lang="ko" class="h-full antialiased">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="google-site-verification" content="xmtfJH3AZyW8W9Do_yQyWBZBlmmTET-VSke-GzY2PPs" />
  <title>뉴저지 의료접근센터 · 주요 병원 네트워크 및 한인 의료 지원 | NJAP</title>
  <meta name="description" content="뉴저지 의료접근센터(NJ Healthcare Access Center) - 잉글우드 병원(Englewood Health), EHPN, 해켄색 메리디안 헬스(HUMC), 밸리 병원(The Valley Hospital), 파스카크 밸리(HMH), RWJBarnabas 등 뉴저지 주요 의료 기관 정보와 한인 환자 프로그램, 한국어 통역, 메디케어, ACA 건강보험, 자선진료(Charity Care) 지원 포털." />
  <meta name="keywords" content="의료접근센터, 의료접근포털, 뉴저지 의료접근센터, 뉴저지 주요 병원, Englewood Health, 잉글우드 병원, EHPN, Englewood Health Physician Network, Hackensack Meridian Health, 해켄색 메리디안 헬스, Hackensack University Medical Center, HUMC, The Valley Hospital, 밸리 병원, HMH Pascack Valley Medical Center, 파스카크 밸리, RWJBarnabas Health, RWJ바나바스 헬스 네트워크, 버겐카운티 병원, 한인 통역 병원, 뉴저지 한인 병원 후기, 메디케어, ACA 오바마케어, 자선진료, charity care" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="https://njaccessportal.com/ko/" />

  <!-- OpenGraph / Social Media -->
  <meta property="og:site_name" content="뉴저지 의료접근센터 · NJ Healthcare Access Center" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://njaccessportal.com/ko/" />
  <meta property="og:title" content="뉴저지 의료접근센터 · 의료접근포털 | NJ Healthcare Access Center &amp; Portal" />
  <meta property="og:description" content="뉴저지 의료접근센터 (NJ Healthcare Access Center / Portal / NJ Korean Outreach) - 뉴저지 한인 커뮤니티를 위한 무료 의료 접근, 메디케어, ACA, 자선진료, 무료 암검진 및 건강 상담 포털." />
  <meta property="og:image" content="<?= htmlspecialchars(!empty($topStory['coverImage']) ? $topStory['coverImage'] : 'https://njaccessportal.com/ko/logo-icon.svg') ?>" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="뉴저지 의료접근센터 · 의료접근포털 | NJ Healthcare Access Center" />
  <meta name="twitter:description" content="뉴저지 한인을 위한 무료 프리미엄 의료 접근·네비게이션 서비스 및 한인 아웃리치 (Healthcare Access Portal)" />
  <meta name="twitter:image" content="<?= htmlspecialchars(!empty($topStory['coverImage']) ? $topStory['coverImage'] : 'https://njaccessportal.com/ko/logo-icon.svg') ?>" />

  <!-- Schema.org JSON-LD Structured Data for Google Search & AI Search -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://njaccessportal.com/ko/#website",
        "url": "https://njaccessportal.com/ko/",
        "name": "뉴저지 의료접근센터 · 의료접근포털 (NJ Healthcare Access Center & Portal)",
        "alternateName": [
          "의료접근센터",
          "의료접근포털",
          "뉴저지 의료접근센터",
          "뉴저지 의료접근포털",
          "nj korean outreach",
          "뉴저지 한인 아웃리치",
          "Healthcare Access Center",
          "Healthcare Access Portal",
          "NJ Healthcare Access Center",
          "NJ Healthcare Access Portal",
          "의료접근",
          "패밀리터치 헬스케어 액세스 센터"
        ],
        "description": "뉴저지 한인 동포를 위한 무료 프리미엄 의료 접근 및 건강 네비게이션 서비스 포털 (NJ Korean Outreach Hub)",
        "inLanguage": ["ko", "en"],
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://njaccessportal.com/ko/blog?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "MedicalOrganization",
        "@id": "https://njaccessportal.com/ko/#organization",
        "name": "뉴저지 의료접근센터 (NJ Healthcare Access Center & Portal)",
        "alternateName": [
          "의료접근센터",
          "의료접근포털",
          "뉴저지 의료접근포털",
          "Healthcare Access Center",
          "NJ Healthcare Access Portal",
          "NJ Korean Outreach",
          "뉴저지 한인 아웃리치"
        ],
        "url": "https://njaccessportal.com/ko",
        "logo": "https://njaccessportal.com/ko/logo-icon.svg",
        "email": "njaccessportal@gmail.com",
        "telephone": "+1-551-285-0800",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "59 West Palisade Avenue",
          "addressLocality": "Englewood",
          "addressRegion": "NJ",
          "postalCode": "07631",
          "addressCountry": "US"
        },
        "areaServed": {
          "@type": "State",
          "name": "New Jersey"
        },
        "knowsLanguage": ["ko", "en"],
        "description": "뉴저지 한인 커뮤니티의 언어와 문화적 장벽을 해소하고 공공보험(메디케이드/메디케어/ACA), 자선진료(Charity Care), 무료 암검진(NJCEED), 시니어 케어를 제공하는 전문 의료접근센터 및 포털",
        "sameAs": [
          "http://pf.kakao.com/_hdxmxaX/chat"
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://njaccessportal.com/ko/#major-hospitals",
        "name": "뉴저지 주요 의료 기관 및 병원 네트워크 (Major Hospitals & Network List)",
        "description": "뉴저지 한인 커뮤니티를 위한 버겐 카운티 및 뉴저지 전역의 핵심 종합병원과 전문의 네트워크 목록입니다.",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "Hospital",
              "name": "Englewood Health (잉글우드 병원)",
              "alternateName": ["잉글우드 병원", "Englewood Hospital and Medical Center"],
              "url": "https://www.englewoodhealth.org",
              "telephone": "+1-201-894-3000",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "350 Engle St",
                "addressLocality": "Englewood",
                "addressRegion": "NJ",
                "postalCode": "07631",
                "addressCountry": "US"
              },
              "areaServed": "Bergen County, NJ",
              "availableLanguage": ["Korean", "English"],
              "description": "버겐 카운티 한인 밀집 지역 대표 종합병원. 한인 의료 프로그램(Korean Healthcare Program), 한국어 상주 코디네이터 통역 지원, 입원 한국식 식단 및 자선 진료(Charity Care)."
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "MedicalOrganization",
              "name": "EHPN (Englewood Health Physician Network)",
              "alternateName": ["잉글우드 헬스 의사 네트워크", "EHPN"],
              "url": "https://www.englewoodhealthphysicians.org",
              "telephone": "+1-833-234-2234",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Northern New Jersey",
                "addressRegion": "NJ",
                "addressCountry": "US"
              },
              "areaServed": "Northern New Jersey (Bergen, Hudson, Passaic Counties)",
              "availableLanguage": ["Korean", "English"],
              "description": "잉글우드 헬스 산하 최대 의사 네트워크. 북부 뉴저지 100+ 로케이션에서 한국어 진료가 가능한 1차 내과, 소아과, 순환기내과 전문의 연계 및 메디케어/ACA 인네트워크."
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "item": {
              "@type": "Hospital",
              "name": "Hackensack Meridian Health / Hackensack University Medical Center (해켄색 메리디안 헬스)",
              "alternateName": ["해켄색 대학병원", "HUMC", "Hackensack Meridian Health"],
              "url": "https://www.hackensackmeridianhealth.org",
              "telephone": "+1-551-996-2000",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "30 Prospect Ave",
                "addressLocality": "Hackensack",
                "addressRegion": "NJ",
                "postalCode": "07601",
                "addressCountry": "US"
              },
              "areaServed": "New Jersey",
              "availableLanguage": ["Korean", "English"],
              "description": "U.S. News 뉴저지 1위 상급 종합병원(HUMC). 존 더러 암센터(John Theurer Cancer Center), 심장혈관 연구소, 24시간 한국어 공인 의료 통역 및 레벨1 외상센터."
            }
          },
          {
            "@type": "ListItem",
            "position": 4,
            "item": {
              "@type": "Hospital",
              "name": "The Valley Hospital (밸리 병원)",
              "alternateName": ["밸리 병원", "The Valley Hospital Paramus", "Valley Health System"],
              "url": "https://www.valleyhealth.com",
              "telephone": "+1-201-447-8000",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "4 Valley Health Plaza",
                "addressLocality": "Paramus",
                "addressRegion": "NJ",
                "postalCode": "07652",
                "addressCountry": "US"
              },
              "areaServed": "Bergen County, NJ",
              "availableLanguage": ["Korean", "English"],
              "description": "버겐 카운티 패러머스 최첨단 스마트 신축 병원. 전 병실 1인실 특화 설계, 다빈치 로봇 수술 센터, 여성 및 소아 센터, 한인 환자 의료 통역 지원."
            }
          },
          {
            "@type": "ListItem",
            "position": 5,
            "item": {
              "@type": "Hospital",
              "name": "HMH Pascack Valley Medical Center (파스카크 밸리 메디컬 센터)",
              "alternateName": ["파스카크 밸리 병원", "Pascack Valley Medical Center"],
              "url": "https://www.pascackmedicalcenter.com",
              "telephone": "+1-201-383-1000",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "250 Old Hook Rd",
                "addressLocality": "Westwood",
                "addressRegion": "NJ",
                "postalCode": "07675",
                "addressCountry": "US"
              },
              "areaServed": "Bergen County, NJ",
              "availableLanguage": ["Korean", "English"],
              "description": "웨스트우드 위치 해켄색 메리디안 제휴 커뮤니티 종합병원. 대기 시간이 짧은 신속 응급실(Fast ER), 관절 치환술, 당일 외래 수술 및 한국어 통역 지원."
            }
          },
          {
            "@type": "ListItem",
            "position": 6,
            "item": {
              "@type": "MedicalOrganization",
              "name": "RWJBarnabas Health network (RWJ바나바스 헬스 네트워크)",
              "alternateName": ["RWJBarnabas Health", "RWJ바나바스"],
              "url": "https://www.rwjbh.org",
              "telephone": "+1-888-724-7123",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "95 Old Short Hills Rd",
                "addressLocality": "West Orange",
                "addressRegion": "NJ",
                "postalCode": "07052",
                "addressCountry": "US"
              },
              "areaServed": "New Jersey Statewide",
              "availableLanguage": ["Korean", "English"],
              "description": "뉴저지 최대 종합 의료 네트워크(17개 병원). 러트거스 의과대학 제휴, 심장 이식, 암 정밀 치료, 소아 특화 병원 및 주정부 자선 치료(Charity Care) 지원."
            }
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://njaccessportal.com/ko/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "응급실(ER)과 911은 언제 사용해야 할까요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "가슴 또는 복부의 심한 통증이나 압박감, 멈추지 않는 출혈, 갑작스러운 시력 변화나 언어 장애, 호흡 곤란, 고열을 동반한 심한 두통, 의식 혼미 등 생명을 위협하는 증상이 있을 때 즉시 911에 전화하거나 응급실(ER)을 방문해야 합니다. 거동이 불가능할 때는 911에 구급차(Ambulance)를 요청하십시오."
            }
          },
          {
            "@type": "Question",
            "name": "예상치 못한 깜짝 의료비(Surprise Medical Bill) 청구를 방지하려면 어떻게 해야 하나요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "네트워크 내 병원을 이용하더라도 진료에 참여한 의사(마취과, 병리학과, 영상의학과 등)가 네트워크 외(Out-of-Network)일 때 깜짝 청구가 발생할 수 있습니다. 비응급 시술 전에는 참여 의료진 전원의 인-네트워크 여부를 사전에 확인하고, 연방법인 'No Surprises Act' 및 뉴저지 'Out-of-Network Consumer Protection, Act'에 따른 환자 보호 권리를 행사해야 합니다."
            }
          },
          {
            "@type": "Question",
            "name": "미국 병원 의료비 청구서(Medical Bill) 주요 항목은 어떻게 해석하나요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "진료일(DOS), 시술코드(CPT), 진단코드(ICD), 청구금액(Charge), 보험사 할인 삭감액(Adjustment/Write-off - 환자 부담 아님), 보험사 지급액(Insurance Payment), 최종 환자 납부액(Patient Balance/Balance Due)을 확인해야 합니다. 병원 청구 금액을 바로 납부하지 마시고 보험사 EOB 명세서와 먼저 대조하십시오."
            }
          },
          {
            "@type": "Question",
            "name": "보험 설명서(EOB - Explanation of Benefits)의 핵심 조건은 무엇인가요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "EOB는 청구서가 아닌 보험 혜택 명세서입니다. 공제액(Deductible - 보험 혜택 전 환자가 먼저 채워야 하는 연간 금액), 본인부담금(Copay - 진료당 고정 납부액), 공동보험(Coinsurance - 공제액 충족 후 환자 부담 비율 %), 최대 본인부담금(MOOP - 연간 환자가 부담하는 법적 한도액)을 확인해야 합니다."
            }
          },
          {
            "@type": "Question",
            "name": "병원 청구서와 보험사 EOB 명세서 금액이 다를 때는 어떻게 하나요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "청구서 잔액(Patient Balance)과 EOB의 'Your Responsibility / Patient Owes' 금액이 반드시 일치해야 합니다. 불일치할 경우 병원 청구 부서에 연락하여 '보험사 처리(EOB)가 최종 반영되었는지' 확인하고, 중복 청구나 오류 코드 청구 여부를 재조정 요청해야 합니다."
            }
          },
          {
            "@type": "Question",
            "name": "무보험자이거나 재정적 어려움이 있을 때 뉴저지에서 받을 수 있는 의료 지원은?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "뉴저지 패밀리케어(NJFamilyCare 메디케이드) 신청이 가능하며, 소득 기준 초과 시 연방 지원 지역 보건센터(FQHC) 또는 가정의료기관(BVMI)에서 소득 연동 슬라이딩 스케일 요금(Sliding Fee Scale) 또는 자선 진료(Charity Care)를 통해 무료 또는 극히 저렴한 비용으로 치료받을 수 있습니다."
            }
          },
          {
            "@type": "Question",
            "name": "MOOP(최대 본인 부담금 - Maximum Out-of-Pocket)이란 무엇인가요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "가입자가 1년 동안 건강보험이 적용되는 필수 의료 서비스에 대해 지불하는 본인 부담금(Deductible, Copay, Coinsurance)의 법적 최대 한도입니다. 이 금액에 도달하면 해당 연도 남은 기간 동안 보험사가 100% 비용을 전액 부담합니다."
            }
          },
          {
            "@type": "Question",
            "name": "진료 의뢰(Referral)와 보험사 사전 승인(Prior Authorization)은 어떻게 다른가요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "진료 의뢰(Referral)는 주치의(PCP)가 특정 전문의 진료를 승인하는 공식 의뢰서(HMO 보험 필수)이며, 사전 승인(Prior Authorization)은 MRI, CT, 특정 수술, 고가 처방약 등 고비용 의료 서비스를 받기 전 보험사로부터 의학적 필요성을 승인받는 절차입니다."
            }
          },
          {
            "@type": "Question",
            "name": "환자 포털 마이차트(MyChart)는 어떻게 활용하나요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "MyChart는 병원 진료 기록, 혈액 및 영상 검사 결과, 예방 접종 내역 조회, 의료진과의 1:1 메시지 상담, 진료 예약 및 처방전 리필 요청, 진료비 온라인 납부 및 세부 내역 열람을 지원하는 통합 환자 포털입니다."
            }
          },
          {
            "@type": "Question",
            "name": "미등록 체류자(서류미비자)도 뉴저지에서 의료 지원을 받을 수 있나요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "네. 체류 신분과 관계없이 뉴저지 주 병원의 자선 치료(Hospital Charity Care) 및 연방 공인 커뮤니티 보건소(FQHC)를 전적으로 이용하실 수 있습니다. 의료기관은 환자의 이민 신분을 이민국에 보고하지 않으며 엄격한 의료 정보 기밀(HIPAA)이 법적으로 보장됩니다."
            }
          },
          {
            "@type": "Question",
            "name": "뉴저지 무료 암 검진 프로그램(NJCEED)은 무엇인가요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "NJCEED(New Jersey Cancer Education and Early Detection)는 무보험자 또는 저보험 뉴저지 거주자(소득 기준 250% FPL 이하)를 대상으로 유방암(맘모그램), 자궁경부암(Pap/HPV), 대장암, 전립선암 검진을 무료로 제공하는 주정부 공식 지원 프로그램입니다."
            }
          },
          {
            "@type": "Question",
            "name": "한인 정신 건강 지원 및 심리 상담은 어디서 받을 수 있나요?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "에스더 하 재단(Esther Ha Foundation), 케어 플러스 뉴저지(Care Plus NJ) 등 한국어 상담이 가능한 전문 기관들과 연계하여 우울증, 불안, 가족 갈등, 트라우마 치료 상담을 한국어로 편안하게 지원받으실 수 있습니다."
            }
          }
        ]
      }
    ]
  }
  </script>

  <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
  <link rel="icon" href="/favicon.ico?v=2" sizes="16x16 32x32 48x48" type="image/x-icon" />
  <link rel="icon" href="/favicon-192.png?v=2" sizes="192x192" type="image/png" />
  <link rel="icon" href="/favicon-512.png?v=2" sizes="512x512" type="image/png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/ko/_next/static/chunks/1fosv8xgmgdeu.css" />

  <script>
    (function() {
      try {
        var userChosen = sessionStorage.getItem('njap_senior_user_chosen') || localStorage.getItem('njap_senior_user_chosen');
        var s;
        if (userChosen === '1') {
          var val = sessionStorage.getItem('njap_senior_mode') || localStorage.getItem('njap_senior_mode');
          s = parseInt(val, 10);
        } else {
          s = (window.innerWidth >= 768) ? 1 : 0;
        }
        if (s === 1) document.documentElement.classList.add('senior-mode-1');
        else if (s === 2) document.documentElement.classList.add('senior-mode-2');
      } catch(e) {}
    })();
  </script>

  <style>
    :root, html, body {
      font-family: "Pretendard Variable", Pretendard, "Noto Sans KR", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif !important;
    }
    html.senior-mode-1 { font-size: 118% !important; }
    html.senior-mode-2 { font-size: 135% !important; }
    html.senior-mode-1 .header-spacer, html.senior-mode-1 .h-\[109px\], html.senior-mode-1 #header-spacer { height: 120px !important; min-height: 120px !important; }
    html.senior-mode-2 .header-spacer, html.senior-mode-2 .h-\[109px\], html.senior-mode-2 #header-spacer { height: 132px !important; min-height: 132px !important; }
    html, body {
      overflow-x: hidden !important;
      max-width: 100% !important;
    }
    @keyframes marqueeScroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .marquee-track {
      display: inline-flex !important;
      white-space: nowrap !important;
      will-change: transform;
      animation: marqueeScroll 35s linear infinite !important;
    }
    .marquee-track:hover {
      animation-play-state: paused;
    }
    .h-\[109px\], .header-spacer, #header-spacer {
      height: 109px !important;
      min-height: 109px !important;
      display: block !important;
      width: 100% !important;
    }
    .h-\[45px\] {
      height: 45px !important;
    }
    #gallery-billboard-section, #gallery-billboard2-section, #medical-videos-section, .billboard-section {
      width: 100vw !important;
      max-width: 100vw !important;
      position: relative !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      box-sizing: border-box !important;
      opacity: 1 !important;
      transform: none !important;
      display: block !important;
      visibility: visible !important;
    }
    #medical-videos-section {
      width: 100vw !important;
      max-width: 100vw !important;
      position: relative !important;
      left: 50% !important;
      right: 50% !important;
      margin-left: -50vw !important;
      margin-right: -50vw !important;
      margin-top: 4.5rem !important;
      margin-bottom: 0 !important;
      background-color: #181818 !important;
      border-top: 1px solid #2d2d2d !important;
      border-bottom: 1px solid #2d2d2d !important;
      padding-top: 52px !important;
      padding-bottom: 60px !important;
      box-sizing: border-box !important;
      display: block !important;
      visibility: visible !important;
    }
    #gallery-billboard-container,
    #gallery-billboard2-container {
      width: 100% !important;
      position: relative !important;
      overflow: hidden !important;
      opacity: 1 !important;
      transform: none !important;
      visibility: visible !important;
    }
    #gallery-billboard-container > div,
    #gallery-billboard2-container > div {
      height: clamp(300px, 38.32vw, 624px) !important;
      min-height: 300px !important;
      max-height: 624px !important;
      width: 100% !important;
      position: relative !important;
      overflow: hidden !important;
    }
    #gallery-billboard-container a,
    #gallery-billboard2-container a {
      display: block !important;
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      overflow: hidden !important;
    }
    #gallery-billboard-container video,
    #gallery-billboard-container img,
    #gallery-billboard2-container video,
    #gallery-billboard2-container img,
    #billboard-active-video,
    #billboard2-active-video,
    #billboard-active-img,
    #billboard2-active-img {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      object-position: center !important;
    }
    .billboard-text-layer {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      display: flex !important;
      align-items: flex-end !important;
      z-index: 10 !important;
      pointer-events: none !important;
    }
    .billboard-text-layer > div {
      pointer-events: auto !important;
    }

    /* Billboard Image Hover Scale (Images only - videos remain completely unscaled) */
    #gallery-billboard-container img,
    #billboard-active-img,
    .billboard-img {
      transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
    }
    #gallery-billboard-container:hover img,
    #gallery-billboard-section:hover img,
    .group:hover #billboard-active-img {
      transform: scale(1.04) !important;
    }
    #gallery-billboard-container video,
    #gallery-billboard2-container video,
    #billboard-active-video,
    #billboard2-active-video {
      transform: none !important;
    }

    /* Billboard 1 Vignette Effect — Layer 2: sits above media, below text */
    .billboard1-vignette {
      position: absolute !important;
      inset: 0 !important;
      pointer-events: none !important;
      z-index: 3 !important;
      box-shadow: inset 0 0 110px 30px rgba(0, 0, 0, 0.7) !important;
      background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 55%, rgba(0, 0, 0, 0.55) 100%) !important;
    }

    /* Hide Safari's native 'tap to play' overlay */
    #billboard-active-video::-webkit-media-controls,
    #billboard-active-video::-webkit-media-controls-panel,
    #billboard-active-video::-webkit-media-controls-play-button,
    #billboard-active-video::-webkit-media-controls-start-playback-button,
    #billboard2-active-video::-webkit-media-controls,
    #billboard2-active-video::-webkit-media-controls-panel,
    #billboard2-active-video::-webkit-media-controls-play-button,
    #billboard2-active-video::-webkit-media-controls-start-playback-button,
    #gallery-billboard-container video::-webkit-media-controls,
    #gallery-billboard-container video::-webkit-media-controls-panel,
    #gallery-billboard-container video::-webkit-media-controls-start-playback-button,
    #gallery-billboard2-container video::-webkit-media-controls,
    #gallery-billboard2-container video::-webkit-media-controls-panel,
    #gallery-billboard2-container video::-webkit-media-controls-start-playback-button {
      display: none !important;
      opacity: 0 !important;
      -webkit-appearance: none !important;
    }


    /* Section Slide-In Animation */
    .reveal-section {
      opacity: 0;
      transform: translateY(35px);
      transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
      will-change: opacity, transform;
    }
    .reveal-section.is-revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    /* 3-Column News Section: 2.0fr Top Story (Wider) | 1.05fr Latest News | 0.58fr Doctor Column (35% narrower) */
    .news-layout-3col {
      display: grid !important;
      grid-template-columns: 1fr !important;
      gap: 1.5rem !important;
      width: 100% !important;
    }
    @media (min-width: 1024px) {
      .news-layout-3col {
        display: grid !important;
        grid-template-columns: 2.0fr 1.05fr 0.58fr !important;
        gap: 1.75rem !important;
        align-items: start !important;
      }
      .news-col-left {
        border-right: 1px solid #e5e7eb !important;
        padding-right: 1.75rem !important;
      }
      .news-col-mid {
        border-right: 1px solid #e5e7eb !important;
        padding-right: 1.75rem !important;
      }
      .news-col-right {
        padding-left: 0.25rem !important;
      }
    }

    /* News Thumbnail Box (Middle Column) */
    .news-thumb-box {
      width: 80px !important;
      height: 56px !important;
      min-width: 80px !important;
      min-height: 56px !important;
      max-width: 80px !important;
      max-height: 56px !important;
      flex-shrink: 0 !important;
      overflow: hidden !important;
      border-radius: 4px !important;
      background-color: #f3f4f6 !important;
    }
    .news-thumb-box img {
      width: 80px !important;
      height: 56px !important;
      object-fit: cover !important;
      display: block !important;
    }

    /* Small Thumbnail Box (Doctor Column - Compact) */
    .news-thumb-small {
      width: 44px !important;
      height: 34px !important;
      min-width: 44px !important;
      min-height: 34px !important;
      max-width: 44px !important;
      max-height: 34px !important;
      flex-shrink: 0 !important;
      overflow: hidden !important;
      border-radius: 4px !important;
      background-color: #f3f4f6 !important;
    }
    .news-thumb-small img {
      width: 44px !important;
      height: 34px !important;
      object-fit: cover !important;
      display: block !important;
    }

    /* Medical Video Player Dark Theme - Seamless with Section Background */
    .video-theme-card {
      background-color: transparent !important;
      border: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
      box-shadow: none !important;
    }
    .video-theme-topbar {
      background-color: #181818 !important;
      border-top: 1px solid #2e2e2e !important;
      border-bottom: 1px solid #2e2e2e !important;
      display: flex !important;
      align-items: stretch !important;
    }
    .video-theme-home-btn {
      background-color: #1e1e1e !important;
      color: #d1d5db !important;
      padding: 12px 18px !important;
      border: none !important;
      border-right: 1px solid #2e2e2e !important;
      border-left: 1px solid #2e2e2e !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      transition: background-color 0.2s, color 0.2s !important;
    }
    .video-theme-home-btn:hover {
      background-color: #333333 !important;
      color: #ffffff !important;
    }
    .video-theme-categories {
      display: flex !important;
      align-items: center !important;
      overflow-x: auto !important;
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
      flex: 1 !important;
    }
    .video-theme-categories::-webkit-scrollbar {
      display: none !important;
    }
    .video-theme-cat-btn {
      padding: 12px 18px !important;
      font-size: 13px !important;
      font-weight: 500 !important;
      color: #9ca3af !important;
      background: transparent !important;
      border: none !important;
      border-right: 1px solid rgba(255, 255, 255, 0.05) !important;
      white-space: nowrap !important;
      cursor: pointer !important;
      transition: all 0.2s !important;
      display: inline-block !important;
    }
    .video-theme-cat-btn:hover {
      color: #ffffff !important;
      background-color: rgba(255, 255, 255, 0.06) !important;
    }
    .video-theme-cat-btn.active {
      color: #ffffff !important;
      font-weight: 700 !important;
      background-color: #7e2224 !important;
    }
    .video-theme-layout {
      display: flex !important;
      flex-direction: column !important;
    }
    @media (min-width: 1024px) {
      .video-theme-layout {
        display: grid !important;
        grid-template-columns: 340px 1fr !important;
      }
    }
    @media (min-width: 1280px) {
      .video-theme-layout {
        grid-template-columns: 380px 1fr !important;
      }
    }
    .video-theme-sidebar {
      background-color: #181818 !important;
      border-right: 1px solid #2e2e2e !important;
      border-left: 1px solid #2e2e2e !important;
      border-bottom: 1px solid #2e2e2e !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: space-between !important;
      order: 2 !important;
    }
    @media (min-width: 1024px) {
      .video-theme-sidebar {
        order: 1 !important;
      }
    }
    .video-theme-playlist {
      max-height: 560px !important;
      overflow-y: auto !important;
    }
    .video-theme-item {
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      padding: 10px 14px !important;
      border-bottom: 1px solid #292929 !important;
      cursor: pointer !important;
      transition: background-color 0.15s ease !important;
      text-decoration: none !important;
      background-color: transparent !important;
      color: #e2e8f0 !important;
    }
    .video-theme-item:hover {
      background-color: #2b2b2b !important;
    }
    .video-theme-item.active {
      background-color: #7e2224 !important;
    }
    .video-theme-item-thumb {
      width: 92px !important;
      height: 58px !important;
      border-radius: 4px !important;
      overflow: hidden !important;
      position: relative !important;
      background-color: #000000 !important;
      flex-shrink: 0 !important;
    }
    .video-theme-item-thumb img {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
    }
    .video-theme-item-duration {
      position: absolute !important;
      bottom: 3px !important;
      right: 3px !important;
      background-color: rgba(0, 0, 0, 0.85) !important;
      color: #ffffff !important;
      font-family: monospace !important;
      font-size: 10px !important;
      padding: 1px 4px !important;
      border-radius: 2px !important;
      line-height: 1 !important;
    }
    .video-theme-item-text {
      flex: 1 !important;
      min-width: 0 !important;
    }
    .video-theme-item-title {
      color: #ffffff !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      line-height: 1.35 !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      overflow: hidden !important;
    }
    .video-theme-item-meta {
      color: #8f96a3 !important;
      font-size: 11px !important;
      margin-top: 4px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
    .video-theme-item.active .video-theme-item-meta {
      color: rgba(255, 255, 255, 0.85) !important;
    }
    .video-theme-pagination {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      padding: 10px 16px !important;
      background-color: #181818 !important;
      border-top: 1px solid #2d2d2d !important;
      font-size: 12px !important;
      color: #8f96a3 !important;
    }
    .video-theme-main {
      background-color: #181818 !important;
      padding: 20px !important;
      border-right: 1px solid #2e2e2e !important;
      border-bottom: 1px solid #2e2e2e !important;
      order: 1 !important;
    }
    @media (min-width: 1024px) {
      .video-theme-main {
        order: 2 !important;
        padding: 24px 28px !important;
      }
    }
    .video-theme-player-frame {
      position: relative !important;
      width: 100% !important;
      aspect-ratio: 16 / 9 !important;
      background-color: #000000 !important;
      border-radius: 6px !important;
      overflow: hidden !important;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5) !important;
    }
    .video-theme-play-btn {
      width: 64px !important;
      height: 48px !important;
      background-color: rgba(0, 0, 0, 0.72) !important;
      backdrop-filter: blur(4px) !important;
      border-radius: 8px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.25s ease !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    .video-theme-play-btn:hover {
      background-color: #dc2626 !important;
      transform: scale(1.08) !important;
    }
    .video-theme-info-title {
      color: #ffffff !important;
      font-size: 22px !important;
      font-weight: 700 !important;
      line-height: 1.3 !important;
      margin-top: 20px !important;
    }
    @media (min-width: 640px) {
      .video-theme-info-title {
        font-size: 26px !important;
      }
    }
    .video-theme-info-byline {
      color: #9ca3af !important;
      font-size: 13px !important;
      margin-top: 6px !important;
    }
    .video-theme-info-desc {
      color: #d1d5db !important;
      font-size: 14px !important;
      line-height: 1.6 !important;
      margin-top: 12px !important;
    }
    .video-theme-readmore-btn {
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      background-color: #3f3f3f !important;
      color: #ffffff !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      padding: 8px 16px !important;
      border-radius: 4px !important;
      border: none !important;
      cursor: pointer !important;
      margin-top: 14px !important;
      transition: background-color 0.2s !important;
    }
    .video-theme-readmore-btn:hover {
      background-color: #7e2224 !important;
    }
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

    /* ============================================================
       NAVBAR BRAND LOGO INLINE ANIMATION
       - Door: visible & stable with subtle gentle entry
       - Key: moves smoothly from right side into the door keyhole
       - Keyhole: subtle light glow reaction when key enters
       - Texts: sequentially slide in from the right after key enters
       - Stays as is permanently
       ============================================================ */
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

    /* Modern Typography-Driven FAQ (No Icons) */
    .faq-card {
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      border-left: 4px solid transparent;
    }
    .faq-card:hover {
      border-color: #cbd5e1;
      transform: translateY(-1px);
      box-shadow: 0 8px 20px -4px rgba(15, 23, 42, 0.06);
    }
    .faq-card.is-open {
      border-left-color: #0047AB !important;
      border-color: #cbd5e1 !important;
      box-shadow: 0 12px 28px -6px rgba(0, 71, 171, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04) !important;
    }
    .faq-card.is-open .faq-status-pill {
      background-color: #0047AB !important;
      color: #ffffff !important;
      border-color: #0047AB !important;
    }
    .faq-cat-filter.active {
      background-color: #0047AB !important;
      color: #ffffff !important;
      border-color: #0047AB !important;
      box-shadow: 0 4px 12px -2px rgba(0, 71, 171, 0.3) !important;
    }
  </style>
  <script>
    window.__INITIAL_BILLBOARDS__ = <?= json_encode($activeBillboards, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?>;
    window.__INITIAL_BILLBOARDS2__ = <?= json_encode($activeBillboards2, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?>;
  </script>
</head>
<body class="min-h-full flex flex-col bg-brand-light">


  <!-- Top Marquee Banner -->
  <div class="fixed top-0 left-0 right-0 z-50 overflow-hidden flex items-center" style="height: 45px; background:#000000">
    <div class="marquee-track whitespace-nowrap">
      <?php for ($i = 0; $i < 6; $i++): ?>
        <span class="inline-block font-sans text-xs text-white/90 tracking-wide px-12">
          <span class="opacity-60 mr-3">✦</span>의료접근포탈: &quot;비영리 기관들의 의료관련 정보서비스의 한계를 넘어, 최고의 의료 전문가들이 제공하는 언어와 문화의 장벽 없이, 분야별 최고 전문가가 함께하는 무료 프리미엄 의료 접근·네비게이션 서비스&quot;<span class="opacity-60 ml-3">✦</span>
        </span>
      <?php endfor; ?>
    </div>
  </div>

  <!-- Main Navigation Bar -->
  <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-sm" style="top:45px">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <a class="flex items-center cursor-pointer njap-brand-link flex-shrink-0 group" href="/ko/" onclick="navigateToHome(event); return false;" title="Healthcare Access Portal">
          <svg class="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform group-hover:scale-102" viewBox="0 0 320 60" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Healthcare Access Portal · 뉴저지 한인 의료 정보 포털 · NJAP" style="overflow: visible;">
            <title>Healthcare Access Portal · 뉴저지 한인 의료 정보 포털 · NJAP</title>
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
              <text x="64" y="27" font-family="Pretendard, -apple-system, system-ui, sans-serif" font-size="18" font-weight="900" fill="#0B192C" letter-spacing="-0.5">Healthcare Access Portal</text>
            </g>
            <g class="njap-nav-text-sub">
              <text x="64" y="44" font-family="Pretendard, -apple-system, system-ui, sans-serif" font-size="10.5" font-weight="600" fill="#64748B" letter-spacing="0.2">뉴저지 한인 의료 정보 포털 · NJAP</text>
            </g>
          </svg>
        </a>
        <div class="hidden md:flex items-center" style="display: flex; align-items: center; gap: 26px;">
          <a class="nav-link pb-0.5 font-bold text-brand-blue cursor-pointer" href="/ko/" onclick="navigateToHome(event); return false;">홈</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/ko/blog">뉴스</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/ko/forum">커뮤니티 포럼</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/ko/senior-care">시니어 케어</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/ko/medicare">메디케어 &amp; ACA</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/ko/tool">환자도우미</a>
          <a class="nav-link pb-0.5 font-medium text-slate-700 hover:text-brand-blue" href="/ko/about">소개</a>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- KakaoTalk 1:1 Chat Button (Top Nav) -->
          <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer" title="카카오톡 1:1 상담 바로가기"><img src="/ko/kakaotalk-icon.png" alt="KakaoTalk" class="w-6 h-6 rounded-md shrink-0 object-contain shadow-xs" /><span class="text-xs sm:text-sm font-bold text-slate-800 hover:text-brand-blue tracking-tight whitespace-nowrap">1:1 상담</span></a>
          <!-- Senior Mode (시니어모드+) 3-Step Toggle Button -->
          <button id="senior-mode-btn" class="senior-mode-btn notranslate" translate="no" type="button" onclick="window.cycleSeniorMode && window.cycleSeniorMode()" title="시니어모드+ (글자 크기 3단계 조절)" aria-label="시니어모드 글자 크기 조절"><span class="senior-btn-label">시니어모드+</span><span class="senior-step-badge" style="display:none;"></span></button>
          <button id="en-translate-btn" class="notranslate" translate="no" onclick="window.toggleTranslation && window.toggleTranslation()" title="Switch Language (EN / KR)" aria-label="Language Toggle" style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:999px;border:1.5px solid #cbd5e1;font-size:11px;font-weight:700;letter-spacing:0.08em;cursor:pointer;transition:all 0.2s ease;background:transparent;color:#475569;white-space:nowrap;flex-shrink:0;line-height:1.4;"><span class="notranslate" translate="no">🌐</span> <span class="notranslate en-btn-label" translate="no">EN</span></button>
          <button id="mobile-menu-btn" class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Menu">
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
      <!-- Senior Mode in Mobile Menu -->
      <div class="flex items-center justify-between py-2.5 px-3.5 mb-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-slate-700">화면 글자 크기</span>
        </div>
        <button type="button" class="senior-mode-btn notranslate" translate="no" onclick="window.cycleSeniorMode && window.cycleSeniorMode()" style="padding:4px 10px;font-size:12px;">
          <span class="senior-btn-label">시니어모드+</span>
          <span class="senior-step-badge" style="display:none;"></span>
        </button>
      </div>
      <!-- 1. 홈 -->
      <a href="/ko/" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-bold text-brand-blue bg-blue-50/70">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-brand-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span class="text-[15px]">홈</span>
        </div>
        <svg class="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 2. 뉴스 -->
      <a href="/ko/blog" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
          <span class="text-[15px]">뉴스</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 2.5. 커뮤니티 포럼 -->
      <a href="/ko/forum" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>
          <span class="text-[15px]">커뮤니티 포럼</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 3. 시니어 케어 -->
      <a href="/ko/senior-care" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          <span class="text-[15px]">시니어 케어</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 4. 메디케어 & ACA -->
      <a href="/ko/medicare" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          <span class="text-[15px]">메디케어 &amp; ACA</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 5. 환자도우미 -->
      <a href="/ko/tool" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span class="text-[15px]">환자도우미</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 6. 소개 -->
      <a href="/ko/about" class="flex items-center justify-between py-3 px-3.5 rounded-xl transition-colors border-b border-slate-100 font-semibold text-slate-800 hover:text-brand-blue hover:bg-slate-50">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span class="text-[15px]">소개</span>
        </div>
        <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>

      <!-- 카카오톡 1:1 상담 바로가기 -->
      <div class="pt-2 pb-1">
        <a href="http://pf.kakao.com/_hdxmxaX/chat" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3.5 bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#FBC02D] text-[#191919] rounded-xl font-bold text-sm shadow-xs transition-all cursor-pointer">
          <div class="flex items-center gap-2.5">
            <img src="/ko/kakaotalk-icon.png" alt="KakaoTalk" class="w-6 h-6 rounded-md shrink-0 object-contain shadow-xs" />
            <div class="flex flex-col text-left">
              <span class="text-sm font-bold leading-tight">카카오톡 1:1 상담 바로가기</span>
              <span class="text-[11px] font-medium text-black/70">의료 복지 및 시니어 케어 실시간 문의</span>
            </div>
          </div>
          <svg class="w-4 h-4 text-black/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  </nav>

  <div class="h-[109px] header-spacer" style="height: 109px; min-height: 109px; width: 100%;"></div>

  <main class="flex-1">
    <div class="flex flex-col bg-[#F3F3F5] min-h-screen text-[#111111] font-sans">
      
      <!-- 1. 100vw Panoramic Billboard Section (At Top) -->
      <section id="gallery-billboard-section" class="w-full font-sans bg-slate-950 mb-6" style="width:100vw; max-width:100vw; position:relative; left:50%; right:50%; margin-left:-50vw; margin-right:-50vw;">
        <div id="gallery-billboard-container" class="w-full relative group">
          <?php if (!empty($activeBillboards)): 
            $b = $activeBillboards[0];
            $isVideo = ($b['mediaType'] ?? '') === 'video' || (isset($b['mediaUrl']) && (str_ends_with($b['mediaUrl'], '.mp4') || str_ends_with($b['mediaUrl'], '.webm')));
          ?>
          <div class="relative w-full overflow-hidden bg-slate-950 select-none group" style="height: clamp(300px, 38.32vw, 624px); min-height: 300px; max-height: 624px; width: 100%; position: relative; overflow: hidden;">
            <a href="<?= htmlspecialchars($b['linkUrl'] ?? '/about#contact') ?>" class="block absolute inset-0 w-full h-full cursor-pointer select-none" title="<?= htmlspecialchars($b['title'] ?? '') ?>" onclick="var v=this.querySelector('video');if(v&&v.paused){event.preventDefault();event.stopPropagation();v.defaultMuted=true;v.muted=true;v.play();return false;}">
              <div class="absolute inset-0 w-full h-full overflow-hidden" style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1;">
                <?php if ($isVideo): ?>
                  <video id="billboard-active-video" 
                         class="w-full h-full object-cover" 
                         muted 
                         autoplay 
                         <?= count($activeBillboards) <= 1 ? 'loop' : '' ?> 
                         playsinline 
                         webkit-playsinline 
                         preload="auto"
                         style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center;">
                    <?php 
    $mUrl = $b['mediaUrl'] ?? '';
    $koMUrl = (strpos($mUrl, '/') === 0 && strpos($mUrl, '/ko/') !== 0) ? '/ko' . $mUrl : $mUrl;
  ?>
  <source src="<?= htmlspecialchars($koMUrl) ?>" type="video/mp4">
  <source src="<?= htmlspecialchars($mUrl) ?>" type="video/mp4">
                  </video>
                  <script>
                    (function(){
                      var v = document.getElementById('billboard-active-video');
                      if (!v) return;
                      v.defaultMuted = true;
                      v.muted = true;
                      v.volume = 0;
                      v.playsInline = true;
                      var triggerPlay = function() {
                        if (v.paused) {
                          var p = v.play();
                          if (p && p.catch) p.catch(function(){});
                        }
                      };
                      if (v.readyState >= 2) {
                        triggerPlay();
                      } else {
                        v.addEventListener('canplay', triggerPlay, { once: true });
                        v.addEventListener('loadeddata', triggerPlay, { once: true });
                      }
                      v.addEventListener('ended', function() {
                        if (typeof window.cmsNextBillboard === 'function') {
                          window.cmsNextBillboard();
                        }
                      });
                    })();
                  </script>
                <?php else: ?>
                  <img id="billboard-active-img" 
                    src="<?= htmlspecialchars($b['mediaUrl'] ?: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=2000&q=85&auto=format') ?>" 
                    alt="<?= htmlspecialchars($b['title'] ?? '') ?>" 
                    class="w-full h-full object-cover transform scale-100 group-hover:scale-103 transition-transform duration-1000 ease-out"
                    style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
                <?php endif; ?>
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" style="z-index: 2;"></div>
                <div class="absolute inset-0 bg-gradient-to-r from-black/65 via-transparent to-black/20 pointer-events-none" style="z-index: 2;"></div>
                <div class="absolute inset-0 billboard1-vignette" style="z-index: 3;"></div>
              </div>

              <!-- Top Layer (Layer 3): Text, Badges, and Action Buttons -->
              <div class="absolute inset-0 flex items-end billboard-text-layer pointer-events-none" style="position: absolute; inset: 0; display: flex; align-items: flex-end; z-index: 10;">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-4 sm:pb-6 flex items-end justify-between gap-4 pointer-events-auto">
                  <div class="max-w-3xl space-y-1 sm:space-y-2">
                    <div class="flex items-center gap-2">
                      <span class="bg-red-600 text-white text-[10px] sm:text-xs font-extrabold px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow">
                        <?= htmlspecialchars(!empty($b['subtitle']) ? $b['subtitle'] : ($b['category'] ?? 'SPECIAL CAMPAIGN')) ?>
                      </span>
                    </div>
                    <h3 class="font-extrabold text-base sm:text-2xl md:text-3xl text-white tracking-tight leading-snug drop-shadow-md group-hover:text-blue-300 transition-colors line-clamp-1">
                      <?= htmlspecialchars($b['title'] ?? '') ?>
                    </h3>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    <span class="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-brand-blue text-white font-extrabold text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-xl">
                      <span><?= htmlspecialchars($b['linkText'] ?? '자세히 보기') ?></span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </div>
            </a>

            <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              <?php foreach ($activeBillboards as $idx => $dummy): ?>
                <button onclick="event.stopPropagation(); event.preventDefault(); window.cmsGoBillboard(<?= $idx ?>);" 
                  class="transition-all duration-300 <?= $idx === 0 ? 'w-6 h-1.5 sm:w-8 sm:h-2 bg-white rounded-full shadow-lg ring-1 ring-white/50' : 'w-2 h-1.5 sm:w-2.5 sm:h-2 bg-white/40 hover:bg-white/80 rounded-full' ?>">
                </button>
              <?php endforeach; ?>
            </div>
          </div>
          <?php endif; ?>
        </div>
      </section>

      <!-- Main Centered Content Container (Exact matching width with Medical Videos max-w-7xl) -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10 pb-16">

        <!-- 2. Live Updates Bar (Auto-updates with newest blog post title) -->
        <div class="bg-[#0C0C0E] text-white rounded-xl py-2.5 px-4 sm:px-6 flex items-center justify-between gap-4 text-xs font-sans shadow-sm border border-white/10">
          <div class="flex items-center gap-3 overflow-hidden">
            <span class="bg-red-600 text-white font-extrabold px-2.5 py-0.5 rounded text-[11px] tracking-wider uppercase shrink-0 animate-pulse">LIVE UPDATES</span>
            <a id="homepage-live-link" href="<?= $liveSlug ? '/ko/blog/' . htmlspecialchars($liveSlug) : '/ko/blog' ?>" class="truncate text-white/90 font-medium hover:text-blue-300 transition-colors">
              <span id="homepage-live-headline"><?= htmlspecialchars($liveHeadline) ?></span>
            </a>
          </div>
          <a class="shrink-0 text-white/70 hover:text-white transition-colors underline font-medium" href="/ko/blog">전체 뉴스 →</a>
        </div>

        <!-- 3. Top Story, Real-time Latest News & Doctor's Column Grid (3 Columns) -->
        <section class="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-xs">
          <div class="news-layout-3col items-start">
            
            <!-- Column 1 (Left): Top Story -->
            <?php if ($topStory): 
              $summaryPoints = $topStory['summaryPoints'] ?? [];
              if (is_string($summaryPoints)) {
                  $trimmed = trim($summaryPoints);
                  if (strpos($trimmed, '[') === 0 || strpos($trimmed, '{') === 0) {
                      $decoded = json_decode($trimmed, true);
                      if (is_array($decoded)) $summaryPoints = $decoded;
                      else $summaryPoints = explode("\n", $summaryPoints);
                  } else {
                      $summaryPoints = explode("\n", $summaryPoints);
                  }
              }
              if (is_array($summaryPoints)) {
                  $cleanPoints = [];
                  foreach ($summaryPoints as $pt) {
                      if (is_array($pt)) {
                          $pt = implode(' ', array_filter($pt, 'is_string'));
                      }
                      if (is_string($pt)) {
                          $t = trim($pt);
                          if ($t !== '' && $t !== '[object Object]' && strpos($t, '[object Object]') === false) {
                              $cleanPoints[] = $t;
                          }
                      }
                  }
                  $summaryPoints = $cleanPoints;
              } else {
                  $summaryPoints = [];
              }
              // Extract from post content if summaryPoints field is empty
              if (empty($summaryPoints) && !empty($topStory['content'])) {
                  if (preg_match('/(?:핵심\s*요약|요약|Key\s*Points)[:\s\*\#]+([\s\S]*?)(?=\n\s*(?:권장|출처|주요|참고|\#\#|$))/u', $topStory['content'], $matches)) {
                      $lines = explode("\n", trim($matches[1]));
                      foreach ($lines as $line) {
                          $cleaned = trim(preg_replace('/^[•\-\*\d\.\)\s]+/', '', $line));
                          if ($cleaned !== '' && mb_strlen($cleaned) > 5) {
                              $summaryPoints[] = $cleaned;
                          }
                      }
                  }
              }
              $topCover = $topStory['coverImage'] ?: (!empty($topStory['images'][0]) ? $topStory['images'][0] : 'https://images.unsplash.com/photo-1628771065117-74ccb5690668?w=1200&q=80&auto=format');
            ?>
            <div id="homepage-top-story-box" class="news-col-left flex flex-col justify-between pb-6 lg:pb-0">
              <a class="group block" href="/ko/blog/<?= htmlspecialchars($topStory['slug'] ?: $topStory['id']) ?>">
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-2.5 h-2.5 bg-red-600 inline-block"></span>
                  <span class="text-xs sm:text-sm font-black text-red-600 uppercase tracking-widest whitespace-nowrap"><?= htmlspecialchars($topStory['category'] ?: '주요 뉴스') ?></span>
                  <span class="text-xs text-gray-400">·</span>
                  <span class="text-xs sm:text-sm text-gray-500 whitespace-nowrap"><?= htmlspecialchars($topStory['date'] ?: date('Y-m-d')) ?></span>
                </div>
                <h1 class="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-gray-950 leading-tight mb-3 tracking-tight group-hover:text-brand-blue transition-colors">
                  <?= htmlspecialchars($topStory['title'] ?? '') ?>
                </h1>
                <div class="relative w-full aspect-[16/10] overflow-hidden mb-2.5 bg-gray-100 shadow-xs rounded-sm">
                  <img src="<?= htmlspecialchars($topCover) ?>" 
                    alt="<?= htmlspecialchars($topStory['title'] ?? '') ?>" 
                    class="object-cover group-hover:scale-102 transition-transform duration-500 w-full h-full">
                </div>
                <p class="text-xs text-gray-400 mb-2 font-sans font-medium">특별 기획: <?= htmlspecialchars($topStory['title'] ?? '') ?></p>
                <p class="text-gray-800 text-sm sm:text-base leading-relaxed mb-4 line-clamp-3 font-serif">
                  <?= htmlspecialchars($topStory['excerpt'] ?? '') ?>
                </p>
              </a>
              <?php if (!empty($summaryPoints)): ?>
              <div class="bg-gray-50 rounded-xl p-4 border border-gray-200/80 mb-3">
                <p class="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1.5 whitespace-nowrap">핵심 요약</p>
                <ul class="space-y-1.5 text-xs sm:text-sm text-gray-900 font-semibold">
                  <?php foreach (array_slice($summaryPoints, 0, 2) as $pt): ?>
                    <li class="flex items-start gap-2">
                      <span class="text-red-600 font-black text-sm leading-none mt-0.5">•</span>
                      <span class="line-clamp-2 leading-snug"><?= htmlspecialchars($pt) ?></span>
                    </li>
                  <?php endforeach; ?>
                </ul>
              </div>
              <?php endif; ?>
              <div class="flex items-center justify-between text-xs sm:text-sm text-gray-500 pt-2.5 border-t border-gray-100">
                <div class="flex items-center gap-2">
                  <span class="font-black text-gray-950 whitespace-nowrap"><?= htmlspecialchars($topStory['author'] ?? '편집부') ?></span>
                  <span>·</span>
                  <span class="whitespace-nowrap font-medium">⏱ <?= htmlspecialchars($topStory['readTime'] ?? '3분') ?></span>
                </div>
                <span class="text-red-600 font-black text-[11px] uppercase tracking-wider whitespace-nowrap">TOP STORY</span>
              </div>
            </div>
            <?php endif; ?>

            <!-- Column 2 (Middle): Real-time Latest News -->
            <div class="news-col-mid flex flex-col justify-between pb-6 lg:pb-0">
              <div>
                <div class="flex items-center justify-between mb-3 pb-1.5 border-b-2 border-black">
                  <h2 class="font-black text-sm sm:text-base text-black uppercase tracking-wider whitespace-nowrap">
                    주요 뉴스
                  </h2>
                </div>
                <div id="homepage-latest-news-box" class="divide-y divide-gray-100">
                  <?php foreach ($latestNews as $item): 
                    $itemCover = $item['coverImage'] ?: (!empty($item['images'][0]) ? $item['images'][0] : 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80');
                  ?>
                    <a class="group py-3.5 first:pt-0 last:pb-0 flex gap-3 items-start justify-between" href="/ko/blog/<?= htmlspecialchars($item['slug'] ?: $item['id']) ?>">
                      <div class="flex-1 min-w-0 pr-1">
                        <span class="text-[11px] sm:text-xs font-black text-red-600 uppercase tracking-wider block mb-1 whitespace-nowrap">
                          <?= htmlspecialchars($item['category'] ?: '뉴스') ?>
                        </span>
                        <h3 class="font-extrabold text-sm sm:text-base text-gray-950 leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors">
                          <?= htmlspecialchars($item['title'] ?? '') ?>
                        </h3>
                        <div class="text-xs font-medium text-gray-400 mt-1.5 whitespace-nowrap">
                          <span><?= htmlspecialchars($item['date'] ?? '') ?></span>
                        </div>
                      </div>
                      <div class="news-thumb-box border border-gray-200">
                        <img src="<?= htmlspecialchars($itemCover) ?>" alt="<?= htmlspecialchars($item['title'] ?? '') ?>" class="group-hover:scale-105 transition-transform">
                      </div>
                    </a>
                  <?php endforeach; ?>
                </div>
              </div>
            </div>

            <!-- Column 3 (Right): Medical Column / 의료칼럼 (TOP 10) -->
            <div class="news-col-right flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-3 pb-1.5 border-b-2 border-black">
                  <h2 class="font-black text-sm sm:text-base text-black uppercase tracking-wider whitespace-nowrap">
                    의료칼럼
                  </h2>
                  <span class="text-xs font-black text-red-600 tracking-wider whitespace-nowrap">TOP 10</span>
                </div>
                <div id="homepage-doctor-columns-box" class="divide-y divide-gray-100">
                  <?php foreach (array_slice($doctorPosts, 0, 10) as $dIdx => $dItem): 
                    $dCover = $dItem['coverImage'] ?: (!empty($dItem['images'][0]) ? $dItem['images'][0] : 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80');
                  ?>
                    <a class="group py-2.5 first:pt-0 last:pb-0 flex gap-2.5 items-start justify-between cursor-pointer" href="/ko/blog/<?= htmlspecialchars($dItem['slug'] ?: $dItem['id']) ?>">
                      <div class="flex gap-2 items-start flex-1 min-w-0 pr-1">
                        <span class="text-lg sm:text-xl font-serif font-black text-red-600 leading-none w-4 shrink-0 mt-0.5 select-none">
                          <?= $dIdx + 1 ?>
                        </span>
                        <div class="flex-1 min-w-0">
                          <span class="text-[11px] font-black text-red-600 uppercase tracking-wider block mb-0.5 whitespace-nowrap truncate">
                            <?= htmlspecialchars($dItem['author'] ?: ($dItem['category'] ?: '의료칼럼')) ?>
                          </span>
                          <h3 class="font-extrabold text-xs sm:text-sm text-gray-950 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                            <?= htmlspecialchars($dItem['title'] ?? '') ?>
                          </h3>
                        </div>
                      </div>
                      <div class="news-thumb-small border border-gray-200">
                        <img src="<?= htmlspecialchars($dCover) ?>" alt="<?= htmlspecialchars($dItem['title'] ?? '') ?>" class="group-hover:scale-105 transition-transform">
                      </div>
                    </a>
                  <?php endforeach; ?>
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- 4. Recalls and Food Safety -->
        <section>
          <div class="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-900">
            <h2 class="font-extrabold text-xl text-gray-950 uppercase tracking-wider">리콜(Recalls and Food Safety)</h2>
            <a class="text-xs font-bold text-brand-blue hover:underline" href="/ko/blog">전체보기 →</a>
          </div>
          <div id="homepage-reports-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <?php foreach ($reportNews as $p): 
              $pCover = $p['coverImage'] ?: (!empty($p['images'][0]) ? $p['images'][0] : 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80');
            ?>
              <a class="group card-hover" href="/ko/blog/<?= htmlspecialchars($p['slug'] ?: $p['id']) ?>">
                <article class="bg-white rounded-2xl p-4 border border-gray-200/90 h-full flex flex-col justify-between shadow-sm">
                  <div>
                    <div class="relative h-40 w-full rounded-xl overflow-hidden mb-3 bg-gray-100">
                      <img src="<?= htmlspecialchars($pCover) ?>" alt="<?= htmlspecialchars($p['title'] ?? '') ?>" class="object-cover group-hover:scale-105 transition-transform duration-500 w-full h-full">
                    </div>
                    <span class="text-[11px] font-bold text-red-600 uppercase tracking-wider block mb-1"><?= htmlspecialchars($p['category'] ?: '리포트') ?></span>
                    <h3 class="font-bold text-base text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-brand-blue transition-colors">
                      <?= htmlspecialchars($p['title'] ?? '') ?>
                    </h3>
                    <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                      <?= htmlspecialchars($p['excerpt'] ?? '') ?>
                    </p>
                  </div>
                  <div class="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-gray-100">
                    <span><?= htmlspecialchars($p['date'] ?? '') ?></span>
                    <span>⏱ <?= htmlspecialchars($p['readTime'] ?? '3분') ?></span>
                  </div>
                </article>
              </a>
            <?php endforeach; ?>
          </div>
        </section>

        <!-- 4.1. Medical Forum Community Section (Directly Accessible Right After News Section) -->
        <section id="medical-forum-section" class="my-10" style="margin-top: 40px; margin-bottom: 40px;">
          <div class="rounded-3xl relative overflow-hidden"
               style="background: #f1f5f9 !important; color: #0f172a !important; border: 1px solid #cbd5e1 !important; border-radius: 24px !important; padding: 32px !important; box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04) !important; position: relative !important; overflow: hidden !important;">
            <div class="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-3xl pointer-events-none" style="background: rgba(37, 99, 235, 0.05) !important;"></div>

            <!-- Top Header & Community Illustration (Side-by-Side Flex Layout) -->
            <div style="display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: space-between !important; gap: 28px !important; border-bottom: 1px solid #cbd5e1 !important; padding-bottom: 24px !important; flex-wrap: wrap !important;">
              <div style="flex: 1 1 380px !important; min-width: 280px !important;">
                <div style="display: inline-flex !important; align-items: center !important; gap: 8px !important; background: #e2e8f0 !important; border: 1px solid #cbd5e1 !important; color: #1e3a8a !important; padding: 5px 14px !important; border-radius: 9999px !important; font-size: 12px !important; font-weight: 700 !important; margin-bottom: 10px !important; width: fit-content !important;">
                  <i class="fa-solid fa-comments" style="color: #2563eb !important;"></i>
                  <span>NJAP 메디컬 포럼 &amp; 전문의 Q&amp;A</span>
                </div>
                <h2 style="color: #0f172a !important; margin: 4px 0 6px 0 !important; font-size: 26px !important; font-weight: 800 !important; letter-spacing: -0.02em !important; line-height: 1.3 !important;">
                  <span>뉴저지 의료/정보 나눔 포럼</span>
                </h2>
                <p style="color: #475569 !important; font-size: 14px !important; line-height: 1.6 !important; margin: 0 0 18px 0 !important; font-weight: 500 !important;">
                  서로 묻고 답하며 함께 성장하는 커뮤니티 공간입니다.
                </p>

                <div style="display: flex !important; align-items: center !important; gap: 12px !important; flex-wrap: wrap !important;">
                  <a href="/ko/forum/ask" 
                     style="display: inline-flex !important; align-items: center !important; gap: 8px !important; background: #2563eb !important; color: #ffffff !important; padding: 10px 20px !important; border-radius: 12px !important; font-size: 13.5px !important; font-weight: 700 !important; text-decoration: none !important; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25) !important; transition: all 0.2s ease !important;">
                    <i class="fa-solid fa-pen-to-square"></i>
                    <span>질문/정보 공유</span>
                  </a>
                  <a href="/ko/forum" 
                     style="display: inline-flex !important; align-items: center !important; gap: 6px !important; background: #ffffff !important; color: #0f172a !important; border: 1.5px solid #cbd5e1 !important; padding: 9px 18px !important; border-radius: 12px !important; font-size: 13.5px !important; font-weight: 700 !important; text-decoration: none !important; box-shadow: 0 2px 6px rgba(0,0,0,0.04) !important; transition: all 0.2s ease !important;">
                    <span>포럼 전체보기 →</span>
                  </a>
                </div>
              </div>

              <!-- Right Side: Community Illustration (Larger & Prominent) -->
              <div style="flex: 1 1 520px !important; max-width: 600px !important; min-width: 280px !important; display: flex !important; justify-content: center !important; align-items: center !important;">
                <img src="/ko/uploads/images/forum_community_banner.jpg" 
                     alt="뉴저지 의료/정보 나눔 커뮤니티" 
                     style="width: 100% !important; height: auto !important; max-height: 290px !important; object-fit: contain !important; border-radius: 20px !important; border: 1px solid #cbd5e1 !important; background: #ffffff !important; padding: 8px !important; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08) !important;">
              </div>
            </div>

            <!-- 5 Core Categories Quick Navigation Bar (Bottom of Section) -->
            <div style="padding-top: 22px !important;">
              <div class="flex items-center justify-between mb-2.5">
                <span class="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style="color: #475569 !important;">
                  <i class="fa-solid fa-layer-group text-blue-600" style="color: #2563eb !important;"></i>
                  <span>뉴저지 5대 핵심 헬스케어 포럼 바로가기</span>
                </span>
                <span class="text-[11px] font-medium" style="color: #64748b !important;">5대 핵심 오픈 게시판</span>
              </div>
              <div class="flex flex-wrap items-center gap-2 text-xs font-bold">
                <?php foreach ($forumSpecialties as $fsp): ?>
                  <a href="/ko/forum?specialty=<?= urlencode($fsp['id']) ?>" 
                     class="px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-2xs hover:shadow-xs"
                     style="background: #ffffff !important; color: #1e293b !important; border: 1px solid #cbd5e1 !important; padding: 6px 12px !important; border-radius: 10px !important; text-decoration: none !important; font-size: 12px !important; font-weight: 700 !important; box-shadow: 0 1px 3px rgba(0,0,0,0.04) !important;">
                    <span class="w-2 h-2 rounded-full shrink-0" style="background-color: <?= htmlspecialchars($fsp['color']) ?>"></span>
                    <span><?= htmlspecialchars($fsp['name_ko']) ?></span>
                  </a>
                <?php endforeach; ?>
              </div>
            </div>

          </div>
        </section>

        <!-- 4.5. 100vw Panoramic Billboard 2 Section (Right Above One-Stop Coverage & Patient Services Center) -->
        <section id="gallery-billboard2-section" class="w-full font-sans bg-slate-950 mb-8" style="width:100vw; max-width:100vw; position:relative; left:50%; right:50%; margin-left:-50vw; margin-right:-50vw;">
          <div id="gallery-billboard2-container" class="w-full relative group">
            <?php if (!empty($activeBillboards2)): 
              $b2 = $activeBillboards2[0];
              $isVid2 = ($b2['mediaType'] ?? '') === 'video' || (isset($b2['mediaUrl']) && (str_ends_with($b2['mediaUrl'], '.mp4') || str_ends_with($b2['mediaUrl'], '.webm')));
            ?>
          <div class="relative w-full overflow-hidden bg-slate-950 select-none group" style="height: clamp(300px, 38.32vw, 624px); min-height: 300px; max-height: 624px; width: 100%; position: relative; overflow: hidden;">
            <a href="<?= htmlspecialchars($b2['linkUrl'] ?? '/about#contact') ?>" class="block absolute inset-0 w-full h-full cursor-pointer select-none" title="<?= htmlspecialchars($b2['title'] ?? '') ?>" onclick="var v=this.querySelector('video');if(v&&v.paused){event.preventDefault();event.stopPropagation();v.defaultMuted=true;v.muted=true;v.play();return false;}">
              <div class="absolute inset-0 w-full h-full overflow-hidden" style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1;">
                <?php if ($isVid2): ?>
                  <video id="billboard2-active-video" 
                         class="w-full h-full object-cover" 
                         muted 
                         autoplay 
                         <?= count($activeBillboards2) <= 1 ? 'loop' : '' ?> 
                         playsinline 
                         webkit-playsinline 
                         preload="auto"
                         style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center;">
                    <source src="<?= htmlspecialchars($b2['mediaUrl']) ?>" type="video/mp4">
                  </video>
                  <script>
                    (function(){
                      var v = document.getElementById('billboard2-active-video');
                      if (!v) return;
                      v.defaultMuted = true;
                      v.muted = true;
                      v.volume = 0;
                      v.playsInline = true;
                      var triggerPlay = function() {
                        if (v.paused) {
                          var p = v.play();
                          if (p && p.catch) p.catch(function(){});
                        }
                      };
                      if (v.readyState >= 2) {
                        triggerPlay();
                      } else {
                        v.addEventListener('canplay', triggerPlay, { once: true });
                        v.addEventListener('loadeddata', triggerPlay, { once: true });
                      }
                      v.addEventListener('ended', function() {
                        if (typeof window.cmsNextBillboard2 === 'function') {
                          window.cmsNextBillboard2();
                        }
                      });
                    })();
                  </script>
                <?php else: ?>
                  <img id="billboard2-active-img" 
                    src="<?= htmlspecialchars($b2['mediaUrl'] ?: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=2000&q=85&auto=format') ?>" 
                    alt="<?= htmlspecialchars($b2['title'] ?? '') ?>" 
                    class="w-full h-full object-cover transform scale-100 group-hover:scale-103 transition-transform duration-1000 ease-out"
                    style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
                <?php endif; ?>
                <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/15 pointer-events-none" style="z-index: 2;"></div>
                <div class="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-black/25 pointer-events-none" style="z-index: 2;"></div>
              </div>

              <div class="absolute inset-0 flex items-end billboard-text-layer pointer-events-none" style="position: absolute; inset: 0; display: flex; align-items: flex-end; z-index: 10;">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-4 sm:pb-6 flex items-end justify-between gap-4 pointer-events-auto">
                  <div class="max-w-3xl space-y-1 sm:space-y-2">
                    <div class="flex items-center gap-2">
                      <span class="bg-red-600 text-white text-[10px] sm:text-xs font-extrabold px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider shadow">
                        <?= htmlspecialchars(!empty($b2['subtitle']) ? $b2['subtitle'] : ($b2['category'] ?? 'SPECIAL CAMPAIGN')) ?>
                      </span>
                    </div>
                    <h3 class="font-extrabold text-base sm:text-2xl md:text-3xl text-white tracking-tight leading-snug drop-shadow-md group-hover:text-blue-300 transition-colors line-clamp-1">
                      <?= htmlspecialchars($b2['title'] ?? '') ?>
                    </h3>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    <span class="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-brand-blue text-white font-extrabold text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-xl">
                      <span><?= htmlspecialchars($b2['linkText'] ?? '자세히 보기') ?></span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </div>
            </a>

              <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                <?php foreach ($activeBillboards2 as $idx => $dummy): ?>
                  <button onclick="event.stopPropagation(); event.preventDefault(); window.cmsGoBillboard2(<?= $idx ?>);" 
                    class="transition-all duration-300 <?= $idx === 0 ? 'w-6 h-1.5 sm:w-8 sm:h-2 bg-white rounded-full shadow-lg ring-1 ring-white/50' : 'w-2 h-1.5 sm:w-2.5 sm:h-2 bg-white/40 hover:bg-white/80 rounded-full' ?>"
                    aria-label="Slide <?= $idx + 1 ?>"
                    title="Slide <?= $idx + 1 ?>">
                  </button>
                <?php endforeach; ?>
              </div>
            </div>
            <?php endif; ?>
          </div>
        </section>

        <!-- 5. One-stop Coverage & Patient Services -->
        <section class="bg-brand-darker text-white rounded-3xl p-6 sm:p-10 border border-white/10 shadow-xl">
          <div class="max-w-3xl mb-8">
            <span class="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3">SPECIAL COVERAGE &amp; PATIENT SERVICES</span>
            <h2 class="font-extrabold text-3xl sm:text-4xl text-white mb-3">원스톱 의료 접근 &amp; 환자 종합 센터</h2>
            <p class="text-white/70 text-sm sm:text-base leading-relaxed">보험 자격 진단부터 병원 사전접수, 의학 용어 사전 및 의료비 지원 신청까지 한곳에서 이용하실 수 있습니다.</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <a class="group" href="/ko/matcher">
              <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 h-full flex flex-col justify-between transition-all duration-300 group-hover:border-blue-400/50">
                <div>
                  <div class="flex items-center justify-start mb-4"><span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/80">INSURANCE MATCHER</span></div>
                  <h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">메디케어 &amp; ACA 자격 진단</h3>
                  <p class="text-xs text-white/60 leading-relaxed mb-4">나이, 소득, 신분 상태에 따른 맞춤형 건강보험 혜택 및 보조금을 즉시 진단하세요.</p>
                </div>
                <div class="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">서비스 바로가기 →</div>
              </div>
            </a>
            <a class="group" href="/ko/calculator">
              <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 h-full flex flex-col justify-between transition-all duration-300 group-hover:border-blue-400/50">
                <div>
                  <div class="flex items-center justify-start mb-4"><span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/80">CALCULATOR</span></div>
                  <h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">ACA 보험료 보조금 계산기</h3>
                  <p class="text-xs text-white/60 leading-relaxed mb-4">가족 수와 연 소득을 기반으로 지원받을 수 있는 세액 공제 보조금액을 산출합니다.</p>
                </div>
                <div class="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">서비스 바로가기 →</div>
              </div>
            </a>
            <a class="group" href="/ko/dictionary">
              <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 h-full flex flex-col justify-between transition-all duration-300 group-hover:border-blue-400/50">
                <div>
                  <div class="flex items-center justify-start mb-4"><span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/80">DICTIONARY</span></div>
                  <h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">영-한 의학 용어 사전</h3>
                  <p class="text-xs text-white/60 leading-relaxed mb-4">미국 병원 진료실에서 자주 쓰는 필수 영문 의학 표현과 한국어 해설 모음.</p>
                </div>
                <div class="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">서비스 바로가기 →</div>
              </div>
            </a>
            <a class="group" href="/ko/tool">
              <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 h-full flex flex-col justify-between transition-all duration-300 group-hover:border-blue-400/50">
                <div>
                  <div class="flex items-center justify-start mb-4"><span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/80">PATIENT PORTAL</span></div>
                  <h3 class="font-bold text-lg text-white mb-2 group-hover:text-blue-300 transition-colors">스마트 환자 서비스 &amp; 사전접수</h3>
                  <p class="text-xs text-white/60 leading-relaxed mb-4">병원 사전접수 차트 작성, 피검사 입력 및 의료비 탕감 지원 신청을 한곳에서 제공합니다.</p>
                </div>
                <div class="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">서비스 바로가기 →</div>
              </div>
            </a>
          </div>
        </section>

        <!-- 5-2. NJ Healthcare Access Center & Korean Outreach (뉴저지 의료접근센터 · 의료접근포털 종합 센터) -->
        <section id="healthcare-access-center" class="relative bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.06)] overflow-hidden">
          <!-- Top Accent Gradient Line -->
          <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-400"></div>
          <!-- Ambient Glow Blobs -->
          <div class="pointer-events-none absolute -top-24 -left-20 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
          <div class="pointer-events-none absolute top-1/3 -right-20 w-80 h-80 bg-indigo-50/40 rounded-full blur-3xl"></div>

          <!-- Section Header -->
          <div class="relative max-w-4xl mx-auto text-center mb-10 sm:mb-12">
            <div class="inline-block text-brand-blue border border-blue-200/90 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-blue-50/90 text-[11px] sm:text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3.5 shadow-2xs">
              NJ KOREAN OUTREACH &amp; HEALTHCARE ACCESS CENTER
            </div>
            <h2 class="font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight mb-3">
              뉴저지 의료접근센터 · 의료접근포털
            </h2>
            <p class="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
              언어와 문화의 장벽 없이, 뉴저지 한인 동포 누구나 최적의 공공 의료 혜택과 건강보험, 병원 진료에 접근할 수 있도록 돕는 종합 건강 네비게이션 포털입니다.
            </p>
          </div>

          <!-- Mission & Who We Serve Cards -->
          <div class="relative grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 sm:mb-16">
            <!-- Mission Card -->
            <div class="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 group">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-[11px] font-black tracking-wider uppercase px-3 py-1 rounded-full bg-blue-50 text-brand-blue border border-blue-200/70">OUR MISSION</span>
                  <span class="text-xs font-semibold text-slate-400">의료 접근성 지원</span>
                </div>
                <h3 class="font-black text-xl text-slate-900 mb-3 tracking-tight group-hover:text-brand-blue transition-colors">우리의 미션 (Our Mission)</h3>
                <p class="text-slate-600 text-sm sm:text-[15px] leading-relaxed mb-6">
                  복잡하고 어려운 미국 의료 시스템 속에서 한인 동포들이 필수적인 의료 자원에 원활히 도달하도록 전문 네비게이션을 제공합니다. 의사 예약, 병원 진료, 필수 의약품 처방은 물론 적합한 공공 보험 및 정부 보조 혜택 가입까지 한국어로 1:1 지원합니다.
                </p>
              </div>
              <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs font-bold">
                <span class="px-3 py-1.5 rounded-lg bg-blue-50/90 text-brand-blue border border-blue-100/90">전문 의료진 연계</span>
                <span class="px-3 py-1.5 rounded-lg bg-blue-50/90 text-brand-blue border border-blue-100/90">한국어 통역 및 서류 지원</span>
                <span class="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100">100% 무료 상담</span>
              </div>
            </div>

            <!-- Who We Serve Card -->
            <div class="bg-white border border-amber-200/90 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(245,158,11,0.04)] hover:shadow-xl hover:border-amber-400 hover:-translate-y-1 transition-all duration-300 group">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-[11px] font-black tracking-wider uppercase px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">WHO WE HELP</span>
                  <span class="text-xs font-semibold text-slate-400">지원 대상 및 권리</span>
                </div>
                <h3 class="font-black text-xl text-slate-900 mb-3 tracking-tight group-hover:text-amber-800 transition-colors">우리가 지원하는 분들 (Who We Help)</h3>
                <p class="text-slate-600 text-sm sm:text-[15px] leading-relaxed mb-6">
                  뉴저지 의료접근센터는 연령, 재정 상태, 이민 및 체류 신분(<strong class="text-amber-900 font-bold bg-amber-100/90 px-2 py-0.5 rounded-md inline-block">미등록 체류자 및 서류미비자 포함</strong>) 또는 기존 보험 유무와 상관없이 의료 지원이 필요한 모든 한인 주민에게 문을 열어두고 있습니다.
                </p>
              </div>
              <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs font-bold text-amber-900">
                <span class="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80">철저한 비밀 보장 (HIPAA)</span>
                <span class="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80">신분 불문 자선치료 지원</span>
                <span class="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80">권리 보장</span>
              </div>
            </div>
          </div>

          <!-- FAQ Accordion Section -->
          <div class="relative mt-12 pt-10 border-t border-slate-200/90" id="faq-section">
            <div class="text-center max-w-2xl mx-auto mb-8">
              <div class="inline-block px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 shadow-2xs mb-2.5">
                <span class="text-xs font-black tracking-wider text-brand-blue uppercase">COMMUNITY HEALTHCARE FAQ</span>
              </div>
              <h3 class="font-black text-2xl sm:text-3xl text-slate-900 mt-1 mb-2 tracking-tight">자주 묻는 질문 (FAQ)</h3>
              <p class="text-xs sm:text-sm text-slate-500 font-normal">뉴저지 한인 동포분들이 가장 많이 질문하시는 미국 의료 및 건강보험 핵심 안내</p>
            </div>

            <!-- Category Filter Tabs & Expand All Controls -->
            <div class="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3">
              <div class="flex flex-wrap items-center gap-1.5" id="faq-cat-filters">
                <button type="button" onclick="window.filterFaq('all', this)" class="faq-cat-filter active px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border border-blue-200/60 bg-brand-blue text-white shadow-xs">전체</button>
                <button type="button" onclick="window.filterFaq('er', this)" class="faq-cat-filter px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">응급 및 911</button>
                <button type="button" onclick="window.filterFaq('billing', this)" class="faq-cat-filter px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">의료비 및 청구</button>
                <button type="button" onclick="window.filterFaq('insurance', this)" class="faq-cat-filter px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">건강보험 및 EOB</button>
                <button type="button" onclick="window.filterFaq('assistance', this)" class="faq-cat-filter px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">무보험 및 복지</button>
                <button type="button" onclick="window.filterFaq('portal', this)" class="faq-cat-filter px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">포털 및 검진</button>
              </div>
              <button type="button" onclick="window.toggleAllFaqs()" id="faq-toggle-all-btn" class="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:border-blue-300 hover:text-brand-blue transition-all shadow-xs shrink-0 cursor-pointer">
                모두 펼치기
              </button>
            </div>

            <div class="max-w-4xl mx-auto space-y-3.5" id="faq-accordion-list">
              <!-- Item 1 -->
              <div id="faq-item-faq-1" data-category="er" class="faq-card border border-slate-200/90 rounded-2xl overflow-hidden bg-white group">
                <button type="button" onclick="window.toggleFaq('faq-1')" class="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none">
                  <div class="flex-1 min-w-0 pr-2">
                    <span class="block font-bold text-[15px] sm:text-base text-slate-900 group-hover:text-brand-blue transition-colors tracking-tight leading-snug">
                      응급실(ER)과 911은 언제 사용해야 할까요?
                    </span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="hidden sm:inline-block text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200/70 px-2.5 py-0.5 rounded-full">응급 · 911</span>
                    <span id="faq-btn-faq-1" class="faq-status-pill text-[12px] font-semibold text-brand-blue bg-blue-50/90 border border-blue-200/70 px-3 py-1 rounded-full transition-all duration-200">자세히 보기</span>
                  </div>
                </button>
                <div id="faq-content-faq-1" class="hidden px-5 sm:px-6 pb-6 pt-3 bg-slate-50/50 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <p class="font-medium text-slate-800 mb-2">다음과 같은 심각하거나 생명을 위협할 수 있는 증상이 있을 때는 즉시 911에 전화하거나 응급실(ER)을 방문하세요:</p>
                  <ul class="space-y-1.5 text-slate-700 my-3">
                    <li class="flex items-start gap-2"><span class="text-rose-600 font-bold shrink-0 mt-0.5">•</span><span>가슴 또는 복부의 극심한 압박감 또는 급성 통증</span></li>
                    <li class="flex items-start gap-2"><span class="text-rose-600 font-bold shrink-0 mt-0.5">•</span><span>지혈되지 않는 과다 출혈</span></li>
                    <li class="flex items-start gap-2"><span class="text-rose-600 font-bold shrink-0 mt-0.5">•</span><span>갑작스러운 시력 변화, 언어 어눌함, 편마비, 의식 혼란</span></li>
                    <li class="flex items-start gap-2"><span class="text-rose-600 font-bold shrink-0 mt-0.5">•</span><span>호흡 곤란 및 숨쉬기 어려움</span></li>
                    <li class="flex items-start gap-2"><span class="text-rose-600 font-bold shrink-0 mt-0.5">•</span><span>고열을 동반한 극심한 두통 또는 유독 물질 섭취</span></li>
                  </ul>
                  <div class="mt-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-900 font-medium leading-relaxed">
                    ※ 스스로 이동하기 위험한 상황에서는 지체 없이 911에 전화하여 구급차(Ambulance)를 요청하십시오.
                  </div>
                </div>
              </div>

              <!-- Item 2 -->
              <div id="faq-item-faq-2" data-category="billing" class="faq-card border border-slate-200/90 rounded-2xl overflow-hidden bg-white group">
                <button type="button" onclick="window.toggleFaq('faq-2')" class="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none">
                  <div class="flex-1 min-w-0 pr-2">
                    <span class="block font-bold text-[15px] sm:text-base text-slate-900 group-hover:text-brand-blue transition-colors tracking-tight leading-snug">
                      예상치 못한 깜짝 의료비(Surprise Medical Bills) 청구 방지법
                    </span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="hidden sm:inline-block text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200/70 px-2.5 py-0.5 rounded-full">깜짝 의료비</span>
                    <span id="faq-btn-faq-2" class="faq-status-pill text-[12px] font-semibold text-brand-blue bg-blue-50/90 border border-blue-200/70 px-3 py-1 rounded-full transition-all duration-200">자세히 보기</span>
                  </div>
                </button>
                <div id="faq-content-faq-2" class="hidden px-5 sm:px-6 pb-6 pt-3 bg-slate-50/50 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  인-네트워크 병원을 방문했더라도 마취과 의사, 영상의학과 전문의 등이 네트워크 외(Out-of-Network)인 경우 깜짝 청구가 발생할 수 있습니다. 비응급 시술 전 보험사에 의료진 네트워크 상태를 서면으로 확인하시고, 연방법인 'No Surprises Act' 및 뉴저지 'Out-of-Network Consumer Protection Act'에 의해 부당한 추가 청구로부터 법적 보호를 받으실 수 있습니다.
                </div>
              </div>

              <!-- Item 3 -->
              <div id="faq-item-faq-3" data-category="billing" class="faq-card border border-slate-200/90 rounded-2xl overflow-hidden bg-white group">
                <button type="button" onclick="window.toggleFaq('faq-3')" class="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none">
                  <div class="flex-1 min-w-0 pr-2">
                    <span class="block font-bold text-[15px] sm:text-base text-slate-900 group-hover:text-brand-blue transition-colors tracking-tight leading-snug">
                      의료비 청구서(Medical Bill) 주요 용어 및 해석 방법
                    </span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="hidden sm:inline-block text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200/70 px-2.5 py-0.5 rounded-full">청구서 용어</span>
                    <span id="faq-btn-faq-3" class="faq-status-pill text-[12px] font-semibold text-brand-blue bg-blue-50/90 border border-blue-200/70 px-3 py-1 rounded-full transition-all duration-200">자세히 보기</span>
                  </div>
                </button>
                <div id="faq-content-faq-3" class="hidden px-5 sm:px-6 pb-6 pt-3 bg-slate-50/50 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <p class="font-medium text-slate-800 mb-2">의료비 청구서를 받으셨을 때 확인해야 할 핵심 용어입니다:</p>
                  <ul class="space-y-2 text-slate-700 my-3">
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">DOS (Date of Service)</span><span>진료를 받은 일자</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">CPT Code</span><span>시술 및 처치 식별 표준 코드</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">ICD Code</span><span>의학적 진단 질병 분류 코드</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Charge (Charged Amount)</span><span>병원이 청구한 정가 금액</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Adjustment / Write-Off</span><span>보험사와 병원 간 계약에 의해 자동 삭감된 금액 (환자가 납부할 필요 없음)</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Insurance Payment</span><span>보험사가 병원에 실제 지급한 금액</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Patient Balance (Balance Due)</span><span>환자가 최종적으로 지불해야 하는 잔여 금액</span></li>
                  </ul>
                </div>
              </div>

              <!-- Item 4 -->
              <div id="faq-item-faq-4" data-category="insurance" class="faq-card border border-slate-200/90 rounded-2xl overflow-hidden bg-white group">
                <button type="button" onclick="window.toggleFaq('faq-4')" class="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none">
                  <div class="flex-1 min-w-0 pr-2">
                    <span class="block font-bold text-[15px] sm:text-base text-slate-900 group-hover:text-brand-blue transition-colors tracking-tight leading-snug">
                      보험 설명서(EOB - Explanation of Benefits) 핵심 조건
                    </span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="hidden sm:inline-block text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200/70 px-2.5 py-0.5 rounded-full">EOB 명세서</span>
                    <span id="faq-btn-faq-4" class="faq-status-pill text-[12px] font-semibold text-brand-blue bg-blue-50/90 border border-blue-200/70 px-3 py-1 rounded-full transition-all duration-200">자세히 보기</span>
                  </div>
                </button>
                <div id="faq-content-faq-4" class="hidden px-5 sm:px-6 pb-6 pt-3 bg-slate-50/50 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <p class="font-medium text-slate-800 mb-2">EOB는 납부 청구서가 아니며 보험사가 병원 청구를 어떻게 처리했는지 보여주는 명세서입니다.</p>
                  <ul class="space-y-2 text-slate-700 my-3">
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Deductible (디덕터블 / 공제액)</span><span>보험 혜택이 본격 시작되기 전 환자가 연간 먼저 채워야 하는 금액</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Copay (코페이 / 본인 부담금)</span><span>방문 또는 진료 시마다 고정 지불하는 정액 (예: $20)</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Coinsurance (코인슈어런스 / 공동보험)</span><span>디덕터블 충족 후 환자와 보험사가 나누어 내는 비율 (예: 20%)</span></li>
                    <li class="flex items-start gap-2"><span class="font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs shrink-0 mt-0.5">Out-of-Pocket</span><span>연간 환자 주머니에서 지출된 총 본인 부담 비용</span></li>
                  </ul>
                </div>
              </div>

              <!-- Item 5 -->
              <div id="faq-item-faq-5" data-category="billing" class="faq-card border border-slate-200/90 rounded-2xl overflow-hidden bg-white group">
                <button type="button" onclick="window.toggleFaq('faq-5')" class="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none">
                  <div class="flex-1 min-w-0 pr-2">
                    <span class="block font-bold text-[15px] sm:text-base text-slate-900 group-hover:text-brand-blue transition-colors tracking-tight leading-snug">
                      병원 청구서와 보험사 EOB 명세서 대조 및 확인 요령
                    </span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="hidden sm:inline-block text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200/70 px-2.5 py-0.5 rounded-full">청구서 대조</span>
                    <span id="faq-btn-faq-5" class="faq-status-pill text-[12px] font-semibold text-brand-blue bg-blue-50/90 border border-blue-200/70 px-3 py-1 rounded-full transition-all duration-200">자세히 보기</span>
                  </div>
                </button>
                <div id="faq-content-faq-5" class="hidden px-5 sm:px-6 pb-6 pt-3 bg-slate-50/50 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  청구서를 받자마자 바로 결제하지 마세요! 반드시 보험사에서 발송된 EOB의 <strong>"You May Owe"</strong> 또는 <strong>"Patient Responsibility"</strong> 금액과 병원 청구서의 <strong>"Patient Balance"</strong>가 일치하는지 먼저 대조해야 합니다. 만약 EOB 금액보다 병원 청구서 금액이 높다면 병원 측에 보험사 청구가 정상 반영되었는지 확인을 요청해야 합니다.
                </div>
              </div>

              <!-- Item 6 -->
              <div id="faq-item-faq-6" data-category="assistance" class="faq-card border border-slate-200/90 rounded-2xl overflow-hidden bg-white group">
                <button type="button" onclick="window.toggleFaq('faq-6')" class="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none">
                  <div class="flex-1 min-w-0 pr-2">
                    <span class="block font-bold text-[15px] sm:text-base text-slate-900 group-hover:text-brand-blue transition-colors tracking-tight leading-snug">
                      무보험자이거나 재정적 어려움이 있을 때의 지원 제도
                    </span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="hidden sm:inline-block text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200/70 px-2.5 py-0.5 rounded-full">자선진료 · FQHC</span>
                    <span id="faq-btn-faq-6" class="faq-status-pill text-[12px] font-semibold text-brand-blue bg-blue-50/90 border border-blue-200/70 px-3 py-1 rounded-full transition-all duration-200">자세히 보기</span>
                  </div>
                </button>
                <div id="faq-content-faq-6" class="hidden px-5 sm:px-6 pb-6 pt-3 bg-slate-50/50 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  뉴저지 거주자는 소득에 따라 뉴저지 패밀리케어(NJFamilyCare 메디케이드) 신청이 연중 상시 가능합니다. 메디케이드 자격이 안 되더라도 연방 지원 지역 보건센터(FQHC) 및 가정의료보험기관(BVMI)에서 소득에 따른 진료비 감면 혜택(Sliding Fee Scale)을 받으실 수 있으며, 병원 입원 및 응급 진료에 대해서는 뉴저지 주정부 병원 자선 진료(Hospital Charity Care)를 신청하여 의료비를 100% 탕감받을 수 있습니다.
                </div>
              </div>

              <!-- Item 7 -->
              <div id="faq-item-faq-7" data-category="insurance" class="faq-card border border-slate-200/90 rounded-2xl overflow-hidden bg-white group">
                <button type="button" onclick="window.toggleFaq('faq-7')" class="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none">
                  <div class="flex-1 min-w-0 pr-2">
                    <span class="block font-bold text-[15px] sm:text-base text-slate-900 group-hover:text-brand-blue transition-colors tracking-tight leading-snug">
                      MOOP (최대 본인 부담금 - Maximum Out-of-Pocket)이란?
                    </span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="hidden sm:inline-block text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200/70 px-2.5 py-0.5 rounded-full">MOOP 한도</span>
                    <span id="faq-btn-faq-7" class="faq-status-pill text-[12px] font-semibold text-brand-blue bg-blue-50/90 border border-blue-200/70 px-3 py-1 rounded-full transition-all duration-200">자세히 보기</span>
                  </div>
                </button>
                <div id="faq-content-faq-7" class="hidden px-5 sm:px-6 pb-6 pt-3 bg-slate-50/50 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  가입자가 1개 연도 동안 건강보험 적용 진료비(Deductible, Copay, Coinsurance 합산)로 지출할 수 있는 법적 최대 한도액입니다. 1년 동안 환자의 본인 지출이 이 MOOP 한도에 도달하면, 그 해의 남은 기간 동안에는 인-네트워크 필수 의료 서비스 비용을 보험사가 100% 전액 부담합니다.
                </div>
              </div>

              <!-- Item 8 -->
              <div id="faq-item-faq-8" data-category="insurance" class="faq-card border border-slate-200/90 rounded-2xl overflow-hidden bg-white group">
                <button type="button" onclick="window.toggleFaq('faq-8')" class="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none">
                  <div class="flex-1 min-w-0 pr-2">
                    <span class="block font-bold text-[15px] sm:text-base text-slate-900 group-hover:text-brand-blue transition-colors tracking-tight leading-snug">
                      전문의 진료 의뢰 (Referral) vs 보험사 사전 승인 (Prior Authorization)
                    </span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="hidden sm:inline-block text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200/70 px-2.5 py-0.5 rounded-full">진료의뢰 · 사전승인</span>
                    <span id="faq-btn-faq-8" class="faq-status-pill text-[12px] font-semibold text-brand-blue bg-blue-50/90 border border-blue-200/70 px-3 py-1 rounded-full transition-all duration-200">자세히 보기</span>
                  </div>
                </button>
                <div id="faq-content-faq-8" class="hidden px-5 sm:px-6 pb-6 pt-3 bg-slate-50/50 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <div class="space-y-2.5">
                    <p><strong class="text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded text-xs">진료 의뢰 (Referral):</strong> 주치의(PCP)가 안과, 심장내과, 이비인후과 등 특정 전문의의 진료가 필요하다고 판단하여 발급하는 허가서입니다 (HMO 플랜 필수).</p>
                    <p><strong class="text-indigo-900 bg-indigo-100/80 px-2 py-0.5 rounded text-xs">사전 승인 (Prior Authorization):</strong> MRI, CT, 복잡한 수술, 고가 항암제 등 특정 고비용 시술을 받기 전에 병원이 보험사에 의학적 타당성을 사전 검토받아 결제 보증을 받는 절차입니다.</p>
                  </div>
                </div>
              </div>

              <!-- Item 9 -->
              <div id="faq-item-faq-9" data-category="portal" class="faq-card border border-slate-200/90 rounded-2xl overflow-hidden bg-white group">
                <button type="button" onclick="window.toggleFaq('faq-9')" class="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none">
                  <div class="flex-1 min-w-0 pr-2">
                    <span class="block font-bold text-[15px] sm:text-base text-slate-900 group-hover:text-brand-blue transition-colors tracking-tight leading-snug">
                      마이차트 (MyChart) 포털 사용법 및 진료 기록 관리
                    </span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="hidden sm:inline-block text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200/70 px-2.5 py-0.5 rounded-full">MyChart 포털</span>
                    <span id="faq-btn-faq-9" class="faq-status-pill text-[12px] font-semibold text-brand-blue bg-blue-50/90 border border-blue-200/70 px-3 py-1 rounded-full transition-all duration-200">자세히 보기</span>
                  </div>
                </button>
                <div id="faq-content-faq-9" class="hidden px-5 sm:px-6 pb-6 pt-3 bg-slate-50/50 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  MyChart는 병원과 의사 진료 기록을 실시간으로 확인하는 보안 환자 포털입니다. 혈액 검사, 영상 판독 결과 확인, 의사와의 안전한 메시지 상담, 온라인 진료 예약, 처방전 리필 요청, 진료비 명세서 확인 및 납부 등을 스마트폰 앱과 PC에서 간편하게 처리하실 수 있습니다.
                </div>
              </div>

              <!-- Item 10 -->
              <div id="faq-item-faq-10" data-category="assistance" class="faq-card border border-slate-200/90 rounded-2xl overflow-hidden bg-white group">
                <button type="button" onclick="window.toggleFaq('faq-10')" class="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none">
                  <div class="flex-1 min-w-0 pr-2">
                    <span class="block font-bold text-[15px] sm:text-base text-slate-900 group-hover:text-brand-blue transition-colors tracking-tight leading-snug">
                      미등록 체류자(서류미비자) 지원 및 의료 정보 비밀 보장
                    </span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="hidden sm:inline-block text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200/70 px-2.5 py-0.5 rounded-full">서류미비자 지원</span>
                    <span id="faq-btn-faq-10" class="faq-status-pill text-[12px] font-semibold text-brand-blue bg-blue-50/90 border border-blue-200/70 px-3 py-1 rounded-full transition-all duration-200">자세히 보기</span>
                  </div>
                </button>
                <div id="faq-content-faq-10" class="hidden px-5 sm:px-6 pb-6 pt-3 bg-slate-50/50 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  체류 신분과 전혀 관계없이 뉴저지 주 병원의 자선 치료(Charity Care)와 연방 공인 커뮤니티 보건소(FQHC)를 전액 무료 또는 최소한의 비용으로 이용하실 수 있습니다. 연방법(HIPAA)에 의해 환자의 진료 기록 및 신분 정보는 이민국이나 외부 기관에 절대 공개되지 않으며 100% 비밀이 보장됩니다.
                </div>
              </div>

              <!-- Item 11 -->
              <div id="faq-item-faq-11" data-category="portal" class="faq-card border border-slate-200/90 rounded-2xl overflow-hidden bg-white group">
                <button type="button" onclick="window.toggleFaq('faq-11')" class="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none">
                  <div class="flex-1 min-w-0 pr-2">
                    <span class="block font-bold text-[15px] sm:text-base text-slate-900 group-hover:text-brand-blue transition-colors tracking-tight leading-snug">
                      뉴저지 무료 암 검진 프로그램 (NJCEED) 안내
                    </span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="hidden sm:inline-block text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200/70 px-2.5 py-0.5 rounded-full">NJCEED 무료검진</span>
                    <span id="faq-btn-faq-11" class="faq-status-pill text-[12px] font-semibold text-brand-blue bg-blue-50/90 border border-blue-200/70 px-3 py-1 rounded-full transition-all duration-200">자세히 보기</span>
                  </div>
                </button>
                <div id="faq-content-faq-11" class="hidden px-5 sm:px-6 pb-6 pt-3 bg-slate-50/50 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  NJCEED(New Jersey Cancer Education and Early Detection)는 무보험 또는 저보험 상태인 뉴저지 주민(연방 빈곤선 250% 이하)을 대상으로 유방암(맘모그램), 자궁경부암(Pap 도말검사/HPV 검사), 대장암(분변잠혈검사/대장내시경 연계), 전립선암 검진을 무료로 제공합니다. 조기 발견을 위한 정기 검진을 꼭 신청하세요.
                </div>
              </div>

              <!-- Item 12 -->
              <div id="faq-item-faq-12" data-category="assistance" class="faq-card border border-slate-200/90 rounded-2xl overflow-hidden bg-white group">
                <button type="button" onclick="window.toggleFaq('faq-12')" class="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none">
                  <div class="flex-1 min-w-0 pr-2">
                    <span class="block font-bold text-[15px] sm:text-base text-slate-900 group-hover:text-brand-blue transition-colors tracking-tight leading-snug">
                      뉴저지 한인 정신 건강 및 심리 상담 지원 연계
                    </span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="hidden sm:inline-block text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200/70 px-2.5 py-0.5 rounded-full">정신건강 상담</span>
                    <span id="faq-btn-faq-12" class="faq-status-pill text-[12px] font-semibold text-brand-blue bg-blue-50/90 border border-blue-200/70 px-3 py-1 rounded-full transition-all duration-200">자세히 보기</span>
                  </div>
                </button>
                <div id="faq-content-faq-12" class="hidden px-5 sm:px-6 pb-6 pt-3 bg-slate-50/50 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  이민 생활의 스트레스, 우울증, 불안 장애, 가족 갈등으로 어려움을 겪으시는 분들을 위해 에스더 하 재단(Esther Ha Foundation) 및 케어 플러스 뉴저지(Care Plus NJ) 등 한국어 상담이 가능한 전문 정신건강 비영리 기관과 긴밀히 협력하고 있습니다. 상담 신청 시 비밀이 철저히 보장됩니다.
                </div>
              </div>
            </div>
          </div>

        </section>
      </div>

      <!-- 6. Medical Video News Section (의학비디오뉴스) - FULL HORIZONTAL WIDTH -->
      <section id="medical-videos-section" class="w-full font-sans billboard-section" style="width: 100vw !important; max-width: 100vw !important; position: relative !important; left: 50% !important; right: 50% !important; margin-left: -50vw !important; margin-right: -50vw !important; margin-top: 4.5rem !important; background-color: #181818 !important; border-top: 1px solid #2d2d2d !important; border-bottom: 1px solid #2d2d2d !important; padding-top: 52px !important; padding-bottom: 60px !important; box-sizing: border-box !important; display: block !important;">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Section Title Bar -->
            <div class="flex items-center justify-between mb-5 pb-3 border-b border-[#333333]">
              <h2 class="font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">의학비디오뉴스</h2>
              <span id="medical-videos-count-badge" class="text-xs font-semibold text-slate-400 bg-[#282828] px-3 py-1 rounded-full border border-[#383838]"><?= count($activeVideos) ?>개 영상</span>
            </div>

            <!-- Video Player Widget Container (Attached Design Theme) -->
            <div class="video-theme-card">
              <!-- Top Category Navigation Bar -->
              <div class="video-theme-topbar">
                <button type="button" onclick="window.cmsSetVideoCat('전체')" class="video-theme-home-btn" title="전체 영상">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
                </button>
                <div id="medical-videos-categories" class="video-theme-categories">
                  <button type="button" onclick="window.cmsSetVideoCat('전체')" class="video-theme-cat-btn active">전체</button>
                  <button type="button" onclick="window.cmsSetVideoCat('만성질환 & 당뇨')" class="video-theme-cat-btn">만성질환 &amp; 당뇨</button>
                  <button type="button" onclick="window.cmsSetVideoCat('심장 & 혈관')" class="video-theme-cat-btn">심장 &amp; 혈관</button>
                  <button type="button" onclick="window.cmsSetVideoCat('뇌신경 & 치매')" class="video-theme-cat-btn">뇌신경 &amp; 치매</button>
                  <button type="button" onclick="window.cmsSetVideoCat('암 예방 & 검진')" class="video-theme-cat-btn">암 예방 &amp; 검진</button>
                  <button type="button" onclick="window.cmsSetVideoCat('감염병 & 백신')" class="video-theme-cat-btn">감염병 &amp; 백신</button>
                  <button type="button" onclick="window.cmsSetVideoCat('건강검진 & 의료정보')" class="video-theme-cat-btn">건강검진 &amp; 의료정보</button>
                </div>
              </div>

              <!-- Main Player & Playlist Grid (Left Playlist, Right Video) -->
              <div class="video-theme-layout">
                
                <!-- Left Column: Playlist -->
                <div class="video-theme-sidebar">
                  <div id="medical-videos-playlist" class="video-theme-playlist">
                    <?php foreach ($playlistVideos as $v): 
                      $isPlaying = $mainVideo && $mainVideo['id'] === $v['id'];
                      $itemThumb = !empty($v['thumbnail']) ? $v['thumbnail'] : (!empty($v['thumbnailUrl']) ? $v['thumbnailUrl'] : (!empty($v['youtubeId']) ? ('https://img.youtube.com/vi/' . $v['youtubeId'] . '/hqdefault.jpg') : 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80'));
                      $author = !empty($v['doctor']) ? ($v['doctor'] . ' · ') : '';
                      $date = $v['date'] ?? ($v['category'] ?? '최신영상');
                    ?>
                      <div onclick="window.cmsSelectVideo('<?= $v['id'] ?>', true)" 
                           class="video-theme-item <?= $isPlaying ? 'active' : '' ?>">
                        <div class="video-theme-item-thumb">
                          <img src="<?= htmlspecialchars($itemThumb) ?>" alt="<?= htmlspecialchars($v['title'] ?? '') ?>" onerror="if(this.src.indexOf('maxresdefault')!==-1){this.src=this.src.replace('maxresdefault','hqdefault');}else{this.onerror=null;this.src='https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80';}" class="w-full h-full object-cover">
                          <div class="video-theme-item-duration">
                            <?= htmlspecialchars($v['duration'] ?: '10:00') ?>
                          </div>
                        </div>
                        <div class="video-theme-item-text">
                          <h4 class="video-theme-item-title">
                            <?= htmlspecialchars($v['title'] ?? '') ?>
                          </h4>
                          <div class="video-theme-item-meta">
                            <?= htmlspecialchars($author . $date) ?>
                          </div>
                        </div>
                      </div>
                    <?php endforeach; ?>
                  </div>

                  <div id="medical-videos-pagination" class="video-theme-pagination">
                    <button onclick="window.cmsPrevVideoPage()" class="cursor-pointer font-bold text-slate-400 hover:text-white">‹ 이전</button>
                    <span class="font-mono font-bold text-slate-400">1 / <?= max(1, ceil(count($activeVideos) / 7)) ?></span>
                    <button onclick="window.cmsNextVideoPage()" class="cursor-pointer font-bold text-slate-400 hover:text-white">다음 ›</button>
                  </div>
                </div>

                <!-- Right Column: Main Player & Details -->
                <div class="video-theme-main">
                  <div id="medical-video-player-box" class="video-theme-player-frame">
                    <?php if ($mainVideo): 
                      $ytId = $mainVideo['youtubeId'] ?? '';
                      if (!$ytId && !empty($mainVideo['youtubeUrl']) && preg_match('~(?:youtu\.be/|youtube\.com/(?:embed/|v/|watch\?v=))([\w-]{11})~', $mainVideo['youtubeUrl'], $m)) {
                          $ytId = $m[1];
                      }
                      $vThumb = !empty($mainVideo['thumbnail']) ? $mainVideo['thumbnail'] : (!empty($mainVideo['thumbnailUrl']) ? $mainVideo['thumbnailUrl'] : (!empty($ytId) ? ('https://img.youtube.com/vi/' . $ytId . '/maxresdefault.jpg') : 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'));
                    ?>
                      <div class="relative w-full h-full group cursor-pointer" onclick="window.cmsPlayCurrentVideo()">
                        <img src="<?= htmlspecialchars($vThumb) ?>" alt="<?= htmlspecialchars($mainVideo['title'] ?? '') ?>" onerror="if(this.src.indexOf('maxresdefault')!==-1){this.src=this.src.replace('maxresdefault','hqdefault');}else{this.onerror=null;this.src='https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80';}" class="object-cover w-full h-full group-hover:scale-103 transition-transform duration-500">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                          <div class="video-theme-play-btn group-hover:scale-110 transition-transform">
                            <svg class="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        </div>
                        <div class="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded flex items-center gap-1.5 font-mono border border-white/10">
                          <svg class="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          <span><?= htmlspecialchars($mainVideo['duration'] ?: '10:00') ?></span>
                        </div>
                      </div>
                    <?php endif; ?>
                  </div>

                  <div id="medical-video-info-box">
                    <?php if ($mainVideo): 
                      $authorMeta = $mainVideo['doctor'] ?: ($mainVideo['hospital'] ?: '뉴저지 한인 전문의');
                      $dateMeta = $mainVideo['date'] ?: '최신 의학 정보';
                      $catMeta = $mainVideo['category'] ?: '의학뉴스';
                    ?>
                      <h3 class="video-theme-info-title">
                        <?= htmlspecialchars($mainVideo['title'] ?? '') ?>
                      </h3>
                      <div class="video-theme-info-byline">
                        <span>By <?= htmlspecialchars($authorMeta) ?></span>
                        <span class="mx-1.5 text-slate-500">/</span>
                        <span><?= htmlspecialchars($dateMeta) ?></span>
                        <span class="mx-1.5 text-slate-500">•</span>
                        <span class="text-red-400 font-medium"><?= htmlspecialchars($catMeta) ?></span>
                      </div>
                      <p class="video-theme-info-desc line-clamp-3">
                        <?= htmlspecialchars($mainVideo['description'] ?: ($mainVideo['summary'] ?? '')) ?>
                      </p>
                    <?php endif; ?>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        <!-- 7. Major Hospitals and Network List (Resources) - 뉴저지 주요 의료 기관 및 병원 네트워크 안내 -->
        <section id="major-hospitals-section" class="py-12 sm:py-16 my-8 font-sans">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            
            <!-- Section Header -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 mb-8 border-b border-slate-200">
              <div class="max-w-3xl">
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/90 text-brand-blue text-xs font-black uppercase tracking-wider mb-3 shadow-2xs">
                  <i class="fa-solid fa-hospital text-blue-600"></i>
                  <span>RESOURCES · MAJOR HOSPITALS &amp; HEALTHCARE NETWORKS</span>
                </div>
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  뉴저지 주요 병원 및 의료 네트워크 리소스
                </h2>
                <p class="text-slate-600 text-sm sm:text-base leading-relaxed mt-2.5 font-normal">
                  뉴저지 한인 동포들이 신뢰하고 찾을 수 있는 버겐 카운티 및 뉴저지 전역의 핵심 종합병원과 전문의 네트워크 안내입니다. <strong>한인 환자 전담 서비스, 한국어 통역, 전문의 연계 및 자선 진료(Charity Care)</strong> 정보를 한눈에 비교하고 바로 연결하세요.
                </p>
              </div>

              <!-- Quick Link to Forum Reviews -->
              <div class="shrink-0 flex items-center gap-3">
                <a href="/ko/forum?specialty=hospital_reviews&view=topics" 
                   class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all hover:shadow-md">
                  <i class="fa-solid fa-comments"></i>
                  <span>병원 이용 후기 &amp; 추천 포럼</span>
                </a>
              </div>
            </div>

            <!-- Filter Tabs -->
            <div class="flex flex-wrap items-center gap-2 mb-8" id="hospital-filter-bar">
              <button type="button" onclick="filterHospitalList('all', this)" class="hospital-filter-btn active px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all border border-blue-600 bg-blue-600 text-white shadow-xs">
                전체 병원·네트워크 (6)
              </button>
              <button type="button" onclick="filterHospitalList('bergen', this)" class="hospital-filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                버겐 카운티 거점
              </button>
              <button type="button" onclick="filterHospitalList('physician_net', this)" class="hospital-filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                1차·전문의 의사망 (EHPN)
              </button>
              <button type="button" onclick="filterHospitalList('tertiary', this)" class="hospital-filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                3차 상급종합병원 (HUMC · RWJ)
              </button>
              <button type="button" onclick="filterHospitalList('korean_program', this)" class="hospital-filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                한국어 통역 지원 병원
              </button>
            </div>

            <!-- 6 Major Hospitals Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="hospital-cards-grid">

              <!-- 1. Englewood Health (잉글우드 병원) -->
              <div class="hospital-card border border-slate-200/90 rounded-2xl bg-white p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group" data-category="bergen korean_program">
                <div>
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-100 text-blue-900 border border-blue-200">
                      <i class="fa-solid fa-location-dot text-blue-600"></i>
                      <span>버겐 카운티 · 포트리/팰팍 인근</span>
                    </span>
                    <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      안전성 A등급
                    </span>
                  </div>

                  <div class="flex items-center gap-3.5 mb-4">
                    <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs border border-blue-100">
                      <i class="fa-solid fa-hospital"></i>
                    </div>
                    <div>
                      <h3 class="font-black text-lg sm:text-xl text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight leading-snug">
                        Englewood Health
                      </h3>
                      <p class="text-xs sm:text-sm font-bold text-slate-500">잉글우드 병원</p>
                    </div>
                  </div>

                  <!-- Short-form Local SEO Info Box -->
                  <div class="space-y-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100 mb-4">
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 한인 환자 내방 안내</strong>
                      <span>포트리, 팰리세이즈파크 등 한인 밀집 지역과 10분 거리의 대표 종합병원으로 버겐 카운티 최초로 <strong>‘한인 의료 프로그램(Korean Healthcare Program)’</strong>을 전담 운영합니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 언어 및 통역 지원 정보</strong>
                      <span>한국어 상주 코디네이터 통역 동행, 입원 환자 한국식 식단 제공, 24시간 응급실(ER) 한인 전담 안내 체계를 완비했습니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 전문의 및 주요 센터 연계</strong>
                      <span>레슬리 사이먼 유방암 검진 센터, 심혈관 중재술 센터 및 EHPN 전문의 네트워크와 유기적으로 직결 연계됩니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 건강보험 및 자선진료</strong>
                      <span>메디케어, 메디케이드, ACA 오바마케어 및 무보험 환자를 위한 주정부 자선 진료(Charity Care) 지원.</span>
                    </div>
                  </div>

                  <!-- Hashtags -->
                  <div class="flex flex-wrap gap-1.5 mb-4">
                    <a href="/ko/forum?specialty=hospital_reviews&q=Englewood&view=topics" class="px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors">#잉글우드병원</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=한인의료프로그램&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#한인의료프로그램</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=통역&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#한국어통역상주</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=자선진료&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#자선진료</a>
                  </div>

                  <!-- Contact Details -->
                  <div class="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 mb-4">
                    <div class="flex items-center gap-1.5">
                      <i class="fa-solid fa-phone text-slate-400 text-[11px]"></i>
                      <span>대표: <a href="tel:2018943000" class="font-bold text-slate-800 hover:text-blue-600">(201) 894-3000</a></span>
                      <span class="mx-1 text-slate-300">|</span>
                      <span>한인 핫라인: <a href="tel:2016082346" class="font-bold text-blue-600 hover:underline">(201) 608-2346</a></span>
                    </div>
                    <div class="flex items-start gap-1.5">
                      <i class="fa-solid fa-map-pin text-slate-400 text-[11px] mt-0.5"></i>
                      <span>350 Engle St, Englewood, NJ 07631</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a href="https://www.englewoodhealth.org" target="_blank" rel="noopener noreferrer" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
                    <span>공식 웹사이트</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                  <a href="/ko/forum?specialty=hospital_reviews&q=Englewood&view=topics" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs transition-colors">
                    <i class="fa-regular fa-comment-dots text-xs"></i>
                    <span>후기 &amp; 질문</span>
                  </a>
                </div>
              </div>

              <!-- 2. EHPN (Englewood Health Physician Network) -->
              <div class="hospital-card border border-slate-200/90 rounded-2xl bg-white p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group" data-category="physician_net bergen korean_program">
                <div>
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-200">
                      <i class="fa-solid fa-users text-emerald-600"></i>
                      <span>북부 뉴저지 100+ 진료소 · 한인 의사망</span>
                    </span>
                    <span class="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      1차 진료 네트워크
                    </span>
                  </div>

                  <div class="flex items-center gap-3.5 mb-4">
                    <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs border border-emerald-100">
                      <i class="fa-solid fa-user-doctor"></i>
                    </div>
                    <div>
                      <h3 class="font-black text-lg sm:text-xl text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight leading-snug">
                        EHPN
                      </h3>
                      <p class="text-xs sm:text-sm font-bold text-slate-500">Englewood Health Physician Network</p>
                    </div>
                  </div>

                  <!-- Short-form Local SEO Info Box -->
                  <div class="space-y-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100 mb-4">
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 한인 환자 내방 안내</strong>
                      <span>잉글우드 헬스 산하 최대 의사 네트워크로 거주지 인근 100곳 이상의 외래 클리닉에서 한인 주치의(PCP) 및 각 분야 전문의 진료를 제공합니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 언어 및 통역 지원 정보</strong>
                      <span>한국어가 모국어인 한인 1차 진료 내과, 소아과, 순환기내과 전문의들이 직접 진료하여 언어 장벽 없는 편안한 상담이 가능합니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 전문의 및 주요 센터 연계</strong>
                      <span>일반 내과, 가정의학과, 순환기내과, 당뇨내분비과, 정형외과, 혈액종양내과 등 종합병원과 즉시 연계되는 유기적 의료망.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 건강보험 및 인-네트워크</strong>
                      <span>메디케어, 메디케이드, 뉴저지 마켓플레이스(GetCoveredNJ) 플랜 및 주요 상업 보험 폭넓은 인-네트워크(In-Network).</span>
                    </div>
                  </div>

                  <!-- Hashtags -->
                  <div class="flex flex-wrap gap-1.5 mb-4">
                    <a href="/ko/forum?specialty=hospital_reviews&q=EHPN&view=topics" class="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition-colors">#EHPN</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=한인주치의&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#한인주치의</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=1차내과&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#1차내과</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=소아과&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#한인소아과</a>
                  </div>

                  <!-- Contact Details -->
                  <div class="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 mb-4">
                    <div class="flex items-center gap-1.5">
                      <i class="fa-solid fa-phone text-slate-400 text-[11px]"></i>
                      <span>의사 찾기 &amp; 예약: <a href="tel:8332342234" class="font-bold text-emerald-700 hover:underline">(833) 234-2234</a></span>
                    </div>
                    <div class="flex items-start gap-1.5">
                      <i class="fa-solid fa-map-pin text-slate-400 text-[11px] mt-0.5"></i>
                      <span>포트리, 팰팍, 클로스터, 테너플라이, 저지시티 등 북부 NJ</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a href="https://www.englewoodhealthphysicians.org" target="_blank" rel="noopener noreferrer" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
                    <span>공식 웹사이트</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                  <a href="/ko/forum?specialty=hospital_reviews&q=EHPN&view=topics" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs transition-colors">
                    <i class="fa-regular fa-comment-dots text-xs"></i>
                    <span>후기 &amp; 추천</span>
                  </a>
                </div>
              </div>

              <!-- 3. Hackensack Meridian Health / Hackensack University Medical Center -->
              <div class="hospital-card border border-slate-200/90 rounded-2xl bg-white p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group" data-category="tertiary bergen korean_program">
                <div>
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-indigo-100 text-indigo-900 border border-indigo-200">
                      <i class="fa-solid fa-award text-indigo-600"></i>
                      <span>U.S. News 뉴저지 #1 상급종합병원</span>
                    </span>
                    <span class="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      3차 거점 병원
                    </span>
                  </div>

                  <div class="flex items-center gap-3.5 mb-4">
                    <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs border border-indigo-100">
                      <i class="fa-solid fa-hospital-wide"></i>
                    </div>
                    <div>
                      <h3 class="font-black text-lg sm:text-xl text-slate-900 group-hover:text-indigo-700 transition-colors tracking-tight leading-snug">
                        Hackensack Meridian Health
                      </h3>
                      <p class="text-xs sm:text-sm font-bold text-slate-500">해켄색 대학병원 (HUMC)</p>
                    </div>
                  </div>

                  <!-- Short-form Local SEO Info Box -->
                  <div class="space-y-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100 mb-4">
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 한인 환자 내방 안내</strong>
                      <span>뉴저지 최대 규모 헬스케어 시스템의 플래그십 상급 종합병원으로 중증 질환, 수술, 암 치료 시 한인 동포들이 가장 신뢰하고 찾는 3차 병원입니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 언어 및 통역 지원 정보</strong>
                      <span>24시간 공인 의료 통역사 상주 및 고화질 실시간 비디오 통역(VRI), 다문화 환자 지원팀(Patient Access) 상시 가동.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 전문의 및 주요 센터 연계</strong>
                      <span>세계적 명성의 <strong>존 더러 암센터(John Theurer Cancer Center)</strong>, 심장혈관 연구소, 헬렌 F. 그레이엄 소아전문병원, 레벨 1 외상센터 완비.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 건강보험 및 자선진료</strong>
                      <span>뉴저지 주정부 자선 진료(Charity Care), 재정 상담 지원 및 취약계층 분할 납부 프로그램 운영.</span>
                    </div>
                  </div>

                  <!-- Hashtags -->
                  <div class="flex flex-wrap gap-1.5 mb-4">
                    <a href="/ko/forum?specialty=hospital_reviews&q=Hackensack&view=topics" class="px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-[11px] transition-colors">#해켄색대학병원</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=HUMC&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#HUMC</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=존더러암센터&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#존더러암센터</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=24시간통역&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#24시간한국어통역</a>
                  </div>

                  <!-- Contact Details -->
                  <div class="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 mb-4">
                    <div class="flex items-center gap-1.5">
                      <i class="fa-solid fa-phone text-slate-400 text-[11px]"></i>
                      <span>대표: <a href="tel:5519962000" class="font-bold text-slate-800 hover:text-indigo-600">(551) 996-2000</a></span>
                      <span class="mx-1 text-slate-300">|</span>
                      <span>진료예약: <a href="tel:8444649355" class="font-bold text-indigo-700 hover:underline">(844) 464-9355</a></span>
                    </div>
                    <div class="flex items-start gap-1.5">
                      <i class="fa-solid fa-map-pin text-slate-400 text-[11px] mt-0.5"></i>
                      <span>30 Prospect Ave, Hackensack, NJ 07601</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a href="https://www.hackensackmeridianhealth.org" target="_blank" rel="noopener noreferrer" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
                    <span>공식 웹사이트</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                  <a href="/ko/forum?specialty=hospital_reviews&q=Hackensack&view=topics" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-extrabold text-xs transition-colors">
                    <i class="fa-regular fa-comment-dots text-xs"></i>
                    <span>후기 &amp; 질문</span>
                  </a>
                </div>
              </div>

              <!-- 4. The Valley Hospital (밸리 병원) -->
              <div class="hospital-card border border-slate-200/90 rounded-2xl bg-white p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group" data-category="bergen korean_program">
                <div>
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-sky-100 text-sky-900 border border-sky-200">
                      <i class="fa-solid fa-star text-sky-600"></i>
                      <span>패러머스 최첨단 스마트 신축 병원</span>
                    </span>
                    <span class="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      전 병실 1인실
                    </span>
                  </div>

                  <div class="flex items-center gap-3.5 mb-4">
                    <div class="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs border border-sky-100">
                      <i class="fa-solid fa-square-plus"></i>
                    </div>
                    <div>
                      <h3 class="font-black text-lg sm:text-xl text-slate-900 group-hover:text-sky-600 transition-colors tracking-tight leading-snug">
                        The Valley Hospital
                      </h3>
                      <p class="text-xs sm:text-sm font-bold text-slate-500">밸리 병원 (Valley Health System)</p>
                    </div>
                  </div>

                  <!-- Short-form Local SEO Info Box -->
                  <div class="space-y-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100 mb-4">
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 한인 환자 내방 안내</strong>
                      <span>버겐 카운티 패러머스(Paramus)에 8억 달러 규모로 최첨단 신축 이전한 프리미엄 스마트 병원으로 루트 17/4 번 고속도로와 인접하여 내방이 편리합니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 언어 및 통역 지원 정보</strong>
                      <span>한인 환자를 위한 다국어 의료 통역 지원 및 전문 네비게이터 팀 상주, 입원 시 프라이버시가 100% 보장되는 <strong>전 병실 1인 단독실</strong> 운영.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 전문의 및 주요 센터 연계</strong>
                      <span>최신 다빈치 로봇 수술 센터, 심장혈관 중환자실(ICU), 여성 산부인과 특화 센터, 종합 암 케어 및 클리블랜드 클리닉 심혈관 얼라이언스.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 건강보험 및 자선진료</strong>
                      <span>메디케어, 메디케이드, ACA 마켓플레이스 보험 인-네트워크 및 병원비 재정 지원 프로그램 운영.</span>
                    </div>
                  </div>

                  <!-- Hashtags -->
                  <div class="flex flex-wrap gap-1.5 mb-4">
                    <a href="/ko/forum?specialty=hospital_reviews&q=Valley&view=topics" class="px-2 py-0.5 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-[11px] transition-colors">#밸리병원</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=TheValleyHospital&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#TheValleyHospital</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=패러머스신축&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#패러머스신축</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=1인실&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#전병실1인실</a>
                  </div>

                  <!-- Contact Details -->
                  <div class="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 mb-4">
                    <div class="flex items-center gap-1.5">
                      <i class="fa-solid fa-phone text-slate-400 text-[11px]"></i>
                      <span>대표: <a href="tel:2014478000" class="font-bold text-slate-800 hover:text-sky-600">(201) 447-8000</a></span>
                      <span class="mx-1 text-slate-300">|</span>
                      <span>환자 안내: <a href="tel:8008255391" class="font-bold text-sky-700 hover:underline">(800) 825-5391</a></span>
                    </div>
                    <div class="flex items-start gap-1.5">
                      <i class="fa-solid fa-map-pin text-slate-400 text-[11px] mt-0.5"></i>
                      <span>4 Valley Health Plaza, Paramus, NJ 07652</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a href="https://www.valleyhealth.com" target="_blank" rel="noopener noreferrer" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
                    <span>공식 웹사이트</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                  <a href="/ko/forum?specialty=hospital_reviews&q=Valley&view=topics" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-extrabold text-xs transition-colors">
                    <i class="fa-regular fa-comment-dots text-xs"></i>
                    <span>후기 &amp; 질문</span>
                  </a>
                </div>
              </div>

              <!-- 5. HMH Pascack Valley Medical Center (파스카크 밸리 메디컬 센터) -->
              <div class="hospital-card border border-slate-200/90 rounded-2xl bg-white p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group" data-category="bergen korean_program">
                <div>
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-teal-100 text-teal-900 border border-teal-200">
                      <i class="fa-solid fa-bolt text-teal-600"></i>
                      <span>웨스트우드 커뮤니티 종합병원</span>
                    </span>
                    <span class="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      신속 응급실(Fast ER)
                    </span>
                  </div>

                  <div class="flex items-center gap-3.5 mb-4">
                    <div class="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs border border-teal-100">
                      <i class="fa-solid fa-house-medical"></i>
                    </div>
                    <div>
                      <h3 class="font-black text-lg sm:text-xl text-slate-900 group-hover:text-teal-700 transition-colors tracking-tight leading-snug">
                        HMH Pascack Valley
                      </h3>
                      <p class="text-xs sm:text-sm font-bold text-slate-500">파스카크 밸리 메디컬 센터</p>
                    </div>
                  </div>

                  <!-- Short-form Local SEO Info Box -->
                  <div class="space-y-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100 mb-4">
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 한인 환자 내방 안내</strong>
                      <span>웨스트우드(Westwood)에 위치한 해켄색 메리디안 헬스(HMH) 산하의 급성기 커뮤니티 종합병원으로 버겐 북부 한인 주민들에게 접근성이 우수합니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 언어 및 통역 지원 정보</strong>
                      <span>한국어 통역 지원 서비스 운영, 환자 1명당 간호사 비율이 우수하여 밀착형 맞춤 간호와 상세한 설명이 장점입니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 전문의 및 주요 센터 연계</strong>
                      <span>대기 시간이 극히 짧은 <strong>신속 응급실(Fast-Track ER)</strong>, 정형외과 무릎·고관절 관절 치환술, 당일 외래 수술 및 시니어 집중 재활 병동.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 건강보험 및 자선진료</strong>
                      <span>해켄색 메리디안 헬스 자선 진료 가이드라인 동일 적용, 메디케어 및 메디케이드 취약계층 재정 보조 지원.</span>
                    </div>
                  </div>

                  <!-- Hashtags -->
                  <div class="flex flex-wrap gap-1.5 mb-4">
                    <a href="/ko/forum?specialty=hospital_reviews&q=Pascack&view=topics" class="px-2 py-0.5 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px] transition-colors">#파스카크밸리</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=PascackValley&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#PascackValley</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=신속응급실&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#신속응급실</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=관절수술&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#관절치환수술</a>
                  </div>

                  <!-- Contact Details -->
                  <div class="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 mb-4">
                    <div class="flex items-center gap-1.5">
                      <i class="fa-solid fa-phone text-slate-400 text-[11px]"></i>
                      <span>대표: <a href="tel:2013831000" class="font-bold text-slate-800 hover:text-teal-600">(201) 383-1000</a></span>
                      <span class="mx-1 text-slate-300">|</span>
                      <span>응급실: <a href="tel:2013831025" class="font-bold text-teal-700 hover:underline">(201) 383-1025</a></span>
                    </div>
                    <div class="flex items-start gap-1.5">
                      <i class="fa-solid fa-map-pin text-slate-400 text-[11px] mt-0.5"></i>
                      <span>250 Old Hook Rd, Westwood, NJ 07675</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a href="https://www.pascackmedicalcenter.com" target="_blank" rel="noopener noreferrer" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
                    <span>공식 웹사이트</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                  <a href="/ko/forum?specialty=hospital_reviews&q=Pascack&view=topics" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-extrabold text-xs transition-colors">
                    <i class="fa-regular fa-comment-dots text-xs"></i>
                    <span>후기 &amp; 질문</span>
                  </a>
                </div>
              </div>

              <!-- 6. RWJBarnabas Health network (RWJ바나바스 헬스 네트워크) -->
              <div class="hospital-card border border-slate-200/90 rounded-2xl bg-white p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group" data-category="tertiary korean_program">
                <div>
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-900 border border-rose-200">
                      <i class="fa-solid fa-circle-nodes text-rose-600"></i>
                      <span>뉴저지 최대 광역 의료망 · 러트거스 의대 제휴</span>
                    </span>
                    <span class="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      주 전역 17개 병원
                    </span>
                  </div>

                  <div class="flex items-center gap-3.5 mb-4">
                    <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs border border-rose-100">
                      <i class="fa-solid fa-hospital-user"></i>
                    </div>
                    <div>
                      <h3 class="font-black text-lg sm:text-xl text-slate-900 group-hover:text-rose-700 transition-colors tracking-tight leading-snug">
                        RWJBarnabas Health
                      </h3>
                      <p class="text-xs sm:text-sm font-bold text-slate-500">RWJ바나바스 헬스 네트워크</p>
                    </div>
                  </div>

                  <!-- Short-form Local SEO Info Box -->
                  <div class="space-y-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100 mb-4">
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 한인 환자 내방 안내</strong>
                      <span>뉴저지 주 전역에 17개 종합병원과 38,000명의 인력을 보유한 최대 종합 의료망으로 클라라 마스, 세인트 바나바스 메디컬 센터 등을 운영합니다.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 언어 및 통역 지원 정보</strong>
                      <span>24시간 연중무휴 한국어 전화 및 비디오 의료 통역, 다문화 환자 권익 옹호 서비스 제공.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 전문의 및 주요 센터 연계</strong>
                      <span>러트거스 의과대학(Rutgers) 공식 제휴 연구망, 주 유일의 성인·소아 심장 이식 프로그램, 브리스톨 마이어스 스큅 어린이 병원(BMSCH), 럿거스 암센터.</span>
                    </div>
                    <div>
                      <strong class="text-slate-900 font-bold block mb-0.5">🔹 건강보험 및 자선진료</strong>
                      <span>뉴저지 주 최대 규모의 자선 진료(Charity Care) 지원, 무보험 취약계층 무료 건강 검진 및 공공 복지 프로그램 적극 연계.</span>
                    </div>
                  </div>

                  <!-- Hashtags -->
                  <div class="flex flex-wrap gap-1.5 mb-4">
                    <a href="/ko/forum?specialty=hospital_reviews&q=RWJ&view=topics" class="px-2 py-0.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-[11px] transition-colors">#RWJ바나바스</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=RWJBarnabas&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#RWJBarnabas</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=클라라마스&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#클라라마스병원</a>
                    <a href="/ko/forum?specialty=hospital_reviews&q=자선치료&view=topics" class="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] transition-colors">#자선치료</a>
                  </div>

                  <!-- Contact Details -->
                  <div class="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 mb-4">
                    <div class="flex items-center gap-1.5">
                      <i class="fa-solid fa-phone text-slate-400 text-[11px]"></i>
                      <span>네트워크 안내: <a href="tel:8887247123" class="font-bold text-slate-800 hover:text-rose-600">(888) 724-7123</a></span>
                    </div>
                    <div class="flex items-start gap-1.5">
                      <i class="fa-solid fa-map-pin text-slate-400 text-[11px] mt-0.5"></i>
                      <span>뉴저지 전역 17개 종합병원 (본부: 95 Old Short Hills Rd, West Orange)</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a href="https://www.rwjbh.org" target="_blank" rel="noopener noreferrer" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
                    <span>공식 웹사이트</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                  <a href="/ko/forum?specialty=hospital_reviews&q=RWJ&view=topics" 
                     class="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-extrabold text-xs transition-colors">
                    <i class="fa-regular fa-comment-dots text-xs"></i>
                    <span>후기 &amp; 질문</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </section>

        <script>
          window.filterHospitalList = function(category, btnEl) {
            document.querySelectorAll('.hospital-filter-btn').forEach(function(b) {
              b.classList.remove('active', 'bg-blue-600', 'text-white', 'border-blue-600', 'shadow-xs');
              b.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
            });
            if (btnEl) {
              btnEl.classList.add('active', 'bg-blue-600', 'text-white', 'border-blue-600', 'shadow-xs');
              btnEl.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');
            }
            var cards = document.querySelectorAll('.hospital-card');
            cards.forEach(function(card) {
              var cats = card.getAttribute('data-category') || '';
              if (category === 'all' || cats.indexOf(category) !== -1) {
                card.style.display = '';
              } else {
                card.style.display = 'none';
              }
            });
          };
        </script>

  <!-- Footer -->
  <footer class="bg-brand-darker text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        <div class="lg:col-span-2">
          <a class="inline-flex items-center mb-4 group cursor-pointer njap-brand-link" href="/ko/" onclick="navigateToHome(event); return false;" title="Healthcare Access Portal">
            <img src="/ko/logo-white.png" alt="Healthcare Access Portal · 뉴저지 한인 의료 정보 포털" class="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105" />
          </a>
          <p class="text-sm text-white/60 font-sans leading-relaxed max-w-xs mb-6">뉴저지 한인 커뮤니티를 위한 의료 접근 및 건강 정보 포털. 메디케어, ACA, 의료 상담을 한국어로 제공합니다.</p>
        </div>
        <div>
          <p class="text-xs font-sans font-semibold uppercase tracking-widest text-white/40 mb-4">정보</p>
          <ul class="space-y-2.5">
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200 cursor-pointer" href="/ko/" onclick="navigateToHome(event); return false;">홈</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/ko/about">소개</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/ko/blog">건강 뉴스</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/ko/forum">커뮤니티 포럼</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/ko/senior-care">시니어 케어</a></li>
          </ul>
        </div>
        <div>
          <p class="text-xs font-sans font-semibold uppercase tracking-widest text-white/40 mb-4">의료 가이드</p>
          <ul class="space-y-2.5">
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/ko/medicare">메디케어 안내</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/ko/medicare#aca">ACA 보험</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/ko/#major-hospitals-section">주요 병원 네트워크</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/ko/medicare#faq">자주 묻는 질문</a></li>
          </ul>
        </div>
        <div>
          <p class="text-xs font-sans font-semibold uppercase tracking-widest text-white/40 mb-4">환자도우미</p>
          <ul class="space-y-2.5">
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/ko/matcher">보험 자격 진단</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/ko/calculator">보조금 계산기</a></li>
            <li><a class="text-sm font-sans text-white/60 hover:text-white transition-colors duration-200" href="/ko/dictionary">의학 용어 사전</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="text-xs font-sans text-white/30 max-w-2xl leading-relaxed">
          <span class="font-semibold text-white/40">⚠ 의료 면책 조항:</span> 이 웹사이트의 정보는 교육 목적으로만 제공됩니다. 의료 결정은 반드시 자격을 갖춘 의료 전문가와 상담하십시오.
        </div>
        <p class="text-xs font-sans text-white/30 whitespace-nowrap">© 2026 Healthcare Access Portal</p>
      </div>
    </div>
  </footer>

  <script>
    // Modern FAQ Accordion Toggle & Interactive Filters (No Icons)
    window.toggleFaq = function(id) {
      var content = document.getElementById('faq-content-' + id);
      var item = document.getElementById('faq-item-' + id);
      var btn = document.getElementById('faq-btn-' + id);
      if (!content) return;
      var isOpen = !content.classList.contains('hidden');
      if (isOpen) {
        content.classList.add('hidden');
        if (item) item.classList.remove('is-open');
        if (btn) btn.textContent = '자세히 보기';
      } else {
        content.classList.remove('hidden');
        if (item) item.classList.add('is-open');
        if (btn) btn.textContent = '접기';
      }
    };

    window.toggleAllFaqs = function() {
      var cards = document.querySelectorAll('.faq-card');
      var btn = document.getElementById('faq-toggle-all-btn');
      var anyClosed = false;
      cards.forEach(function(card) {
        var id = card.id.replace('faq-item-', '');
        var content = document.getElementById('faq-content-' + id);
        if (content && content.classList.contains('hidden')) anyClosed = true;
      });
      cards.forEach(function(card) {
        var id = card.id.replace('faq-item-', '');
        var content = document.getElementById('faq-content-' + id);
        var btnEl = document.getElementById('faq-btn-' + id);
        if (!content) return;
        if (anyClosed) {
          content.classList.remove('hidden');
          card.classList.add('is-open');
          if (btnEl) btnEl.textContent = '접기';
        } else {
          content.classList.add('hidden');
          card.classList.remove('is-open');
          if (btnEl) btnEl.textContent = '자세히 보기';
        }
      });
      if (btn) {
        btn.textContent = anyClosed ? '모두 접기' : '모두 펼치기';
      }
    };

    window.filterFaq = function(cat, btnEl) {
      document.querySelectorAll('.faq-cat-filter').forEach(function(b) {
        b.classList.remove('active', 'bg-brand-blue', 'text-white', 'shadow-xs');
        b.classList.add('bg-white', 'text-slate-600', 'hover:bg-slate-50');
      });
      if (btnEl) {
        btnEl.classList.add('active', 'bg-brand-blue', 'text-white', 'shadow-xs');
        btnEl.classList.remove('bg-white', 'text-slate-600', 'hover:bg-slate-50');
      }
      var cards = document.querySelectorAll('.faq-card');
      cards.forEach(function(card) {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    };

    // 2. Global Section Slide-in on Scroll (Excludes Top Billboard)
    document.addEventListener('DOMContentLoaded', function() {
      var targets = document.querySelectorAll('main section:not(#gallery-billboard-section):not(#gallery-billboard2-section):not(#medical-videos-section), main article, #homepage-top-story-box, #homepage-latest-news-box, #homepage-doctor-columns-box, #homepage-reports-grid');
      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
        targets.forEach(function(el, i) {
          el.classList.add('reveal-section');
          el.style.transitionDelay = Math.min(i * 50, 300) + 'ms';
          observer.observe(el);
        });
      }
    });
  </script>
  

  <script src="/ko/js/cms-client.js?v=<?= time() ?>"></script>
  <script src="/ko/js/fixes.js?v=8.0.0"></script>
<script src="/ko/js/njap-translate.js?v=3.1.0"></script>
</body>
</html>
