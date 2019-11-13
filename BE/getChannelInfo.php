<?php

header('content-type:json');

if(isset($_GET['channelId'])) {

$channelId = $_GET['channelId'];

$txt = file_get_contents("https://youtube.com/channel/".$channelId);
$image = get_string_between($txt, '<img class="appbar-nav-avatar" src="', '"');

$title = get_string_between($txt, '<title>', '</title>');
$title = str_replace("- YouTube", "", $title);
$title = trim(preg_replace('/\s+/', ' ', $title));

if($image === "") {
    $image = "./Media/avatar.jpg";
}

echo '{"snippet":{"title":"'.$title.'","thumbnails":{"default":{"url":"'.$image.'"}}},"statistics":{"statistics":{"subscriberCount":"N/A"}}}';

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