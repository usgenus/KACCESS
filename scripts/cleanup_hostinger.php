<?php
@unlink(__DIR__ . '/extract_ko.php');
@unlink(__DIR__ . '/deploy_ko.zip');
@unlink(__DIR__ . '/deploy_ko.tar.gz');
echo "CLEANED\n";
@unlink(__FILE__);
