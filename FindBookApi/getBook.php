<?php
require ("Findbook.php");
$key = $_GET['keyword'];
$find = new FindBooksApi();
echo @$find->getBookMsg($key);
?>