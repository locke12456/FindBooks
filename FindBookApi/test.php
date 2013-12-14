<?php 
require ("Findbook.php");
$get = $_GET['keyword'];
$test = new FindBooksApi($get,null);
?>