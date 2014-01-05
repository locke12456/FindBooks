<?php
require ("Findbook.php");
$url = $_GET['url'];
$find = new FindBooksApi();
echo @$find->getPage($url);
?>