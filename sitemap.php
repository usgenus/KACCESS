<?php
/**
 * Dynamic XML Sitemap Generator
 * NJ Healthcare Access Center (Healthcare Access Portal)
 * Generates valid sitemap XML including all core pages and all published dynamic news posts.
 */
header('Content-Type: application/xml; charset=utf-8');

$baseUrl = 'https://kor2.njaccessportal.com';
require_once __DIR__ . '/api/db.php';

$db = get_db_data();
$posts = $db['posts'] ?? [];

// Filter published posts
$publishedPosts = array_values(array_filter($posts, function($p) {
    return ($p['status'] ?? 'published') === 'published';
}));

// Core portal pages
$corePages = [
    [
        'loc' => $baseUrl . '/',
        'priority' => '1.0',
        'changefreq' => 'daily',
        'lastmod' => date('Y-m-d')
    ],
    [
        'loc' => $baseUrl . '/blog',
        'priority' => '0.9',
        'changefreq' => 'daily',
        'lastmod' => date('Y-m-d')
    ],
    [
        'loc' => $baseUrl . '/senior-care',
        'priority' => '0.9',
        'changefreq' => 'weekly',
        'lastmod' => date('Y-m-d')
    ],
    [
        'loc' => $baseUrl . '/medicare',
        'priority' => '0.8',
        'changefreq' => 'weekly',
        'lastmod' => date('Y-m-d')
    ],
    [
        'loc' => $baseUrl . '/tool',
        'priority' => '0.8',
        'changefreq' => 'monthly',
        'lastmod' => date('Y-m-d')
    ],
    [
        'loc' => $baseUrl . '/matcher',
        'priority' => '0.7',
        'changefreq' => 'monthly',
        'lastmod' => date('Y-m-d')
    ],
    [
        'loc' => $baseUrl . '/calculator',
        'priority' => '0.7',
        'changefreq' => 'monthly',
        'lastmod' => date('Y-m-d')
    ],
    [
        'loc' => $baseUrl . '/dictionary',
        'priority' => '0.7',
        'changefreq' => 'monthly',
        'lastmod' => date('Y-m-d')
    ],
    [
        'loc' => $baseUrl . '/about',
        'priority' => '0.8',
        'changefreq' => 'monthly',
        'lastmod' => date('Y-m-d')
    ]
];

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
<?php foreach ($corePages as $page): ?>
  <url>
    <loc><?= htmlspecialchars($page['loc']) ?></loc>
    <lastmod><?= htmlspecialchars($page['lastmod']) ?></lastmod>
    <changefreq><?= htmlspecialchars($page['changefreq']) ?></changefreq>
    <priority><?= htmlspecialchars($page['priority']) ?></priority>
  </url>
<?php endforeach; ?>

<?php foreach ($publishedPosts as $post): 
    $slug = $post['slug'] ?? ($post['id'] ?? '');
    if (!$slug) continue;
    $postUrl = $baseUrl . '/blog/' . rawurlencode($slug);
    
    // Parse lastmod date
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
?>
  <url>
    <loc><?= htmlspecialchars($postUrl) ?></loc>
    <lastmod><?= htmlspecialchars($lastmod) ?></lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
<?php if (!empty($coverImage)): ?>
    <image:image>
      <image:loc><?= htmlspecialchars($coverImage) ?></image:loc>
      <image:title><?= htmlspecialchars($postTitle) ?></image:title>
    </image:image>
<?php endif; ?>
  </url>
<?php endforeach; ?>
</urlset>
