<?php

//set headers 
header('Access-Control-Allow-Origin: *');
header('content-type:application/json');

if(isset($_GET['url'])) {
    $url = base64_decode($_GET['url']);
    $json = file_get_contents($url);
    echo $json;
}

?>