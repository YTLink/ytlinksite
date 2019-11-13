<?php

header('content-type:json');

if(isset($_GET['CODE'])) {
    $file = file_get_contents("../DB/channels.json");
    $channelId = get_string_between($file,$_GET['CODE'].'": "',"[");
    echo $channelId;
}

function get_string_between($string, $start, $end){
    $string = ' ' . $string;
    $ini = strpos($string, $start);
    if ($ini == 0) return '';
    $ini += strlen($start);
    $len = strpos($string, $end, $ini) - $ini;
    return substr($string, $ini, $len);
}

?>