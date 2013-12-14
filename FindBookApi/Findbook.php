<?php
require("connst.php");
class FindBooksApi{
	public function FindBooksApi($keyword,$site)
	{
		$str = $this->getUrl($keyword,'+site:findbook.tw');
		echo $str;
	}

	private function getUrl($keyword,$site)
	{
		//$this->decode($keyword);

		$rez = $this->google_search_api(array(
		        'q' => $keyword."+".$site
		));
		print_r($rez);
		$url = $rez->responseData->results[0]->unescapedUrl;
		$healthy = array("http://findbook.tw/book/","basic");
		$yummy   = array("http://findbook.tw/m/book/","price");

		$url = str_replace($healthy, $yummy, $url);
		//echo $url;
		return $this->download($url);
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
		//print_r($body);
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
		return  $json->decode($body);
	}

}

?>