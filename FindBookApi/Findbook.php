<?php
require("connst.php");
class FindBooksApi{
	public function FindBooksApi()
	{

	}
    public function getBookList($keyword)
	{
	    $str = $this->getUrl($keyword,'+site:findbook.tw/book');
	    $current = array("Findbook \u0026gt; 商品簡介\u0026gt;"," - Findbook 翻書客");
        $target   = array("","");
        $url = str_replace($current, $target, $str);
    	return  $url;
	}

	public function getPage($url)
	{
	    $def = $url ;
	    $json = new Services_JSON();
	    $info = $this->getBookMsg($url);
	    $current = array("http://findbook.tw/book/","basic");
    	$target   = array("http://findbook.tw/m/book/","price");
    	$url = str_replace($current, $target, $url);
    	$current = array("http://findbook.tw/book/","basic");
        $target   = array("http://cft.findbook.tw/image/book/","large");
        $img = str_replace($current, $target, $def);
    	$body = $this->download($url,null);
    	$current = array("http://findbook.tw/book/","basic" , "&nbsp;");
        $target   = array("","","");
        $body = str_replace($current, $target, $body);
        $info['msg'] = $body;
        $info['img'] = $img;
        return $json->encode($info);;
	}
    public function getBookMsg($url)
    {

    	$str = $this->download($url,null);
        $current = array("http://findbook.tw/book/","basic","/");
        $target   = array("","","");
        $isbn = str_replace($current, $target, $url);
    	if(is_array($str))return $json->encode($str);
    	$arr = array();
    	$ht = $str;
    	$str = "book-profile";
    	$all = explode($str,$ht);
    	$str = "sub-nav";
    	$all = explode($str,$all[1]);
    	$str = "<p>";
    	$arr1 = explode($str, $all[0]);
    	$books = $arr1;
    	$rule = array();
        $book = $books[0];
    	$rule['label01'] = "<h1>";
    	$rule['label02'] = "</h1>";
    	$rule['shift01'] = 1;
    	$rule['output'] = 0;
    	$book = $this->cut($book, $rule);
        $bookname = $BOOKS['bookname'] = $book[1];
    	$bookname = str_replace("&#59","", $bookname);
    	if($bookname=="")return false;
    	$book = $books[1];
    	$rule['label01'] = "<a href";
    	$rule['label02'] = ">";
    	$rule['label03'] = "</a";
    	$rule['shift01'] = 1;
    	$rule['output'] = 0;
    	$book = $this->cut($books[1], $rule);
    	$au = $BOOKS['Author'] = $book[1];
    	$au = str_replace("&#59","", $au);
        if($au=="")
    		$book =$books[1];
    	else $book =$book[0];
    		$all=explode(",", $book);
    	$msg=array();
    	for($i=count($all)-2;$i<count($all);$i++){
    		$all[$i]=str_replace("Findbook", "",$all[$i]);
    		$str=str_split($all[$i],12+(count($msg)+1));
    		$all[$i]="";
    		for($j=1;$j<count($str);$j++)
    		$all[$i].=$str[$j];
    		array_push($msg, $all[$i]);
    	}
    	$im = $BOOKS['Imprint'] =$msg[0];//($au=="")?$msg[0]: $msg[1];
    	$im = str_replace("&#59","", $im);
    	$len=array();
    	$msg="";
    	$BOOKS['isbn'] = $isbn;
    	$info = $BOOKS['Information'] = $msg;
    	return $BOOKS;
    	}
	private function getUrl($keyword,$site)
	{
		$rez = $this->google_search_api(array(
		        'q' => $keyword."+".$site
		));
		return ($rez);
	}
	private function download($url,$type)
	{
		$ch = curl_init();
		if($type == "IMG")
		{
			$headers[] = 'Accept: image/gif, image/x-bitmap, image/jpeg, image/pjpeg';
			$headers[] = 'Connection: Keep-Alive';
			$headers[] = 'Content-type: application/x-www-form-urlencoded;charset=UTF-8';
			curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
			curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9.0.5) Gecko/2008120122 Firefox/3.0.5 FirePHP/0.2.1");
		}

		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_REFERER, 'http://www.google.com.tw/');
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		//curl_setopt($ch, CURLOPT_CONNECTITIMEOUT_MS, 100);
		curl_setopt($ch, CURLOPT_TIMEOUT_MS, 3000);

		$body = curl_exec($ch);
		curl_close($ch);
		return $body;
	}
	private function google_search_api($args, $referer = 'http://www.google.com.tw/', $endpoint = 'web'){
		$json = new Services_JSON();
		$url = "http://ajax.googleapis.com/ajax/services/search/".$endpoint;

		if ( !array_key_exists('v', $args) )
		$args['v'] = '1.0';

		$url .= '?'.http_build_query($args, '', '&');
		$url .= "&key=AIzaSyA6m1Cyra2-GJaCBN9Ru0b3ZeGGsCvM7tA";
		//echo $url;
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		// note that the referer *must* be set
		curl_setopt($ch, CURLOPT_REFERER, $referer);
		$body = curl_exec($ch);
		curl_close($ch);
		//decode and return the response
		//return  $json->decode($body);
		return $body;
	}
    private function cut($book,$rule)
    	{
    		$arr = array();
    		$str = $rule['label01'];
    		$arr1 = explode($str, $book);
    		$book = $arr1[$rule['shift01']];
    		array_push($arr, $book);
    		$str = $rule['label02'];
    		$arr1 = explode($str, $arr1[1]);
    		if ($rule['label03'] != null)
    		{
    			$str = $rule['label02'];
    			$arr1 = explode($str, $book);
    			$str = $rule['label03'];
    			$arr1 = explode($str, $arr1[1]);
    			//$book = $arr1[$rule['shift02']];
    			array_push($arr, $arr1[$rule['output']]);
    			//echo $arr1[$rule['output']];
    		}else array_push($arr, $arr1[$rule['output']]);
    		//echo $arr1[$rule['output']];
    		return $arr;
    	}
    	private function decode($keyword)
    	{
    		$keyword = str_replace("-", "", $keyword);
    		$keyword = str_replace(" ", "", $keyword);
    		$isbn = (int) $keyword;
    		$isINT = (bool)($isbn);
    		if($isINT&&strlen($keyword) >= 9)
    		{
    			$this->ena10 = $this->ena10encode($keyword);
    			$this->ena13 = $this->ena13encode($keyword);

    		}else
    		{
    			$this->ena10 = FindBooks::$ISBN_ERROR;

    		}
    	}
    	private function ena10encode($str)
    	{
    		switch (strlen($str)){
    			case 13:
    			case 12:
    				$str = substr($str, 3, strlen($str));
    				if(strlen($str)==9)break;
    			case 10:
    				$str = substr($str, 0, strlen($str)-1);
    			//case 9:	break;
    		}
    		$codeArr=str_split($str);
    		$code = "";
    		//ENA10�ˬd�X�t��k
    		$i=0;
    		$c=0;     // c:checksum
    		for(;$i<9;)$c=$c+($codeArr[$i++]*$i);
    		$c%=11;
    		if($c==10)$c='X';
    		return ($str.$c);
    	}
    	private function ena13encode($str)
    	{
    		switch (strlen($str)){
    			case 10:
    			case 13:
    				$str = substr($str, 0, strlen($str)-1);
    				if(strlen($str)==12)break;
    			case 9:
    				$str = "978".$str;
    			//case 12:break;
    		}
    		$codeArr=str_split($str);
    		$code = "";
    		//ENA13�ˬd�X�t��k
    		$i=1;
    		$c=0;     // c:checksum
    		for(;$i<12;$i+=2)$c=$c+$codeArr[$i];
    		$c*=3;
    		for($i=0;$i<12;$i+=2)$c=$c+$codeArr[$i];
    		$a = (220-$c)%10;
    		return ($str.$a);
    	}
}

?>