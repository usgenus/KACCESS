<?php
header('Content-Type: text/plain; charset=utf-8');

$src = '/home/u738358110/domains/kor2.njaccessportal.com/public_html/uploads';
$destKo = '/home/u738358110/domains/njaccessportal.com/public_html/ko/uploads';
$destRoot = '/home/u738358110/domains/njaccessportal.com/public_html/uploads';

function copy_dir($src, $dst) {
    if (!is_dir($src)) return 0;
    $dir = opendir($src);
    @mkdir($dst, 0755, true);
    $count = 0;
    while (false !== ($file = readdir($dir))) {
        if ($file != '.' && $file != '..') {
            if (is_dir($src . '/' . $file)) {
                $count += copy_dir($src . '/' . $file, $dst . '/' . $file);
            } else {
                if (copy($src . '/' . $file, $dst . '/' . $file)) {
                    $count++;
                }
            }
        }
    }
    closedir($dir);
    return $count;
}

$c1 = copy_dir($src, $destKo);
echo "SUCCESS: Copied $c1 files to $destKo\n";

$c2 = copy_dir($src, $destRoot);
echo "SUCCESS: Copied $c2 files to $destRoot\n";

// Also sync persistent storage if it exists
$pSrc = '/home/u738358110/domains/kor2.njaccessportal.com/persistent_storage';
$pDst = '/home/u738358110/domains/njaccessportal.com/persistent_storage';
if (is_dir($pSrc)) {
    $c3 = copy_dir($pSrc, $pDst);
    echo "SUCCESS: Copied $c3 persistent files to $pDst\n";
}

@unlink(__FILE__);
