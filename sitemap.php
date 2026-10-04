<?php
/**
 * Dynamic XML Sitemap Generator
 * NJ Healthcare Access Center (NJ Access Portal)
 * Covers all core pages, all published articles, and all active forum topics.
 */
header('Content-Type: application/xml; charset=utf-8');

$baseUrl = 'https://njaccessportal.com';

require_once __DIR__ . '/api/db.php';
require_once __DIR__ . '/api/forum_db.php';

$db = get_db_data();
$posts = $db['posts'] ?? [];

// Filter published posts
$publishedPosts = array_values(array_filter($posts, function($p) {
    return ($p['status'] ?? 'published') === 'published';
}));

// Fetch all active forum topics, 5 core categories, and 19 sub-specialties
$forumQuestions = forum_get_questions('', 'latest', '', 'active');
$forumCategories = forum_get_categories();
$forumSubSpecialties = forum_get_sub_specialties();

// Core portal routes
$coreRoutes = [
    [
        'path' => '/',
        'priority' => '1.0',
        'changefreq' => 'daily',
        'lastmod' => date('Y-m-d')
    ],
    [
        'path' => '/forum',
        'priority' => '0.9',
        'changefreq' => 'hourly',
        'lastmod' => date('Y-m-d')
    ],
    [
        'path' => '/forum?view=categories',
        'priority' => '0.8',
        'changefreq' => 'daily',
        'lastmod' => date('Y-m-d')
    ],
    [
        'path' => '/blog',
        'priority' => '0.9',
        'changefreq' => 'daily',
        'lastmod' => date('Y-m-d')
    ],
    [
        'path' => '/medicare',
        'priority' => '0.8',
        'changefreq' => 'weekly',
        'lastmod' => date('Y-m-d')
    ],
    [
        'path' => '/about',
        'priority' => '0.8',
        'changefreq' => 'monthly',
        'lastmod' => date('Y-m-d')
    ],

    [
        'path' => '/calculator',
        'priority' => '0.7',
        'changefreq' => 'monthly',
        'lastmod' => date('Y-m-d')
    ],
    [
        'path' => '/dictionary',
        'priority' => '0.7',
        'changefreq' => 'monthly',
        'lastmod' => date('Y-m-d')
    ]
];

// Helper to render sitemap URL nodes
function render_url($url, $priority, $changefreq, $lastmod, $images = []) {
    echo "  <url>\n";
    echo "    <loc>" . htmlspecialchars($url) . "</loc>\n";
    echo "    <lastmod>" . htmlspecialchars($lastmod) . "</lastmod>\n";
    echo "    <changefreq>" . htmlspecialchars($changefreq) . "</changefreq>\n";
    echo "    <priority>" . htmlspecialchars($priority) . "</priority>\n";
    if (!empty($images)) {
        foreach ($images as $img) {
            if (!empty($img['loc'])) {
                echo "    <image:image>\n";
                echo "      <image:loc>" . htmlspecialchars($img['loc']) . "</image:loc>\n";
                if (!empty($img['title'])) {
                    echo "      <image:title>" . htmlspecialchars($img['title']) . "</image:title>\n";
                }
                echo "    </image:image>\n";
            }
        }
    }
    echo "  </url>\n";
}

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

<?php /* 1. Core Portal Pages */ ?>
<?php foreach ($coreRoutes as $r): 
    $url = $baseUrl . ($r['path'] === '/' ? '/' : $r['path']);
    render_url($url, $r['priority'], $r['changefreq'], $r['lastmod']);
endforeach; ?>

<?php /* 2. Core Forum Category Pages */ ?>
<?php foreach ($forumCategories as $cat): 
    $catQuery = '?specialty=' . urlencode($cat['id']);
    $url = $baseUrl . '/forum' . $catQuery;
    render_url($url, '0.85', 'daily', date('Y-m-d'));
endforeach; ?>

<?php /* 3. Medical Forum Sub-specialties */ ?>
<?php foreach ($forumSubSpecialties as $sub): 
    $subQuery = '?specialty=medical_health&sub=' . urlencode($sub['id']);
    $url = $baseUrl . '/forum' . $subQuery;
    render_url($url, '0.8', 'daily', date('Y-m-d'));
endforeach; ?>

<?php /* 4. All Active Forum Topics & Discussions */ ?>
<?php foreach ($forumQuestions as $q): 
    $topicPath = '/forum/topic/' . urlencode($q['id']);
    $url = $baseUrl . $topicPath;

    $qDate = $q['updatedAt'] ?? ($q['createdAt'] ?? 'now');
    $lastmod = date('Y-m-d', strtotime($qDate));
    
    $firstImg = !empty($q['images'][0]) ? $q['images'][0] : '';
    if ($firstImg && strpos($firstImg, 'http') !== 0) {
        $firstImg = $baseUrl . '/' . ltrim($firstImg, '/');
    }
    $images = [];
    if (!empty($firstImg)) {
        $images[] = ['loc' => $firstImg, 'title' => $q['title'] ?? ''];
    }
    render_url($url, '0.8', 'daily', $lastmod, $images);
endforeach; ?>

<?php /* 5. Published Blog & Health News Posts */ ?>
<?php foreach ($publishedPosts as $post): 
    $slug = $post['slug'] ?? ($post['id'] ?? '');
    if (!$slug) continue;
    $postPath = '/blog/' . rawurlencode($slug);
    $url = $baseUrl . $postPath;
    
    $rawDate = $post['updatedAt'] ?? ($post['date'] ?? ($post['createdAt'] ?? ''));
    $lastmod = !empty($rawDate) ? date('Y-m-d', strtotime($rawDate)) : date('Y-m-d');
    
    $postTitle = $post['title'] ?? '건강 의료 뉴스';
    $coverImage = $post['coverImage'] ?? '';
    if (empty($coverImage) && !empty($post['images'][0])) {
        $coverImage = $post['images'][0];
    }
    if ($coverImage && strpos($coverImage, 'http') !== 0) {
        $coverImage = $baseUrl . '/' . ltrim($coverImage, '/');
    }
    $images = [];
    if (!empty($coverImage)) {
        $images[] = ['loc' => $coverImage, 'title' => $postTitle];
    }
    render_url($url, '0.8', 'weekly', $lastmod, $images);
endforeach; ?>

<?php /* 6. Healthcare Access Engine (English Services Portal) */ ?>
  <url>
    <loc>https://njaccessportal.com/engine/</loc>
    <lastmod><?= date('Y-m-d') ?></lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://njaccessportal.com/engine/services</loc>
    <lastmod><?= date('Y-m-d') ?></lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://njaccessportal.com/engine/portfolio</loc>
    <lastmod><?= date('Y-m-d') ?></lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
