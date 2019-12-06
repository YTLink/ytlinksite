<?php 

if(isset($_GET['code'])) {
    $code = strtoupper($_GET['code']);
    $channelId = getChannelIdByCode($code);
    header('location:https://youtube.com'.getLastVideoByChannelId($channelId, $code));
}

//method to get last video
function getLastVideoByChannelId($channelId, $code) {
    $youtube_str = file_get_contents("https://youtube.com/channel/".$channelId."/videos?view=0&sort=dd&flow=grid");
    $youtube_str = trim(preg_replace('/\s+/', ' ', $youtube_str));
    //echo $youtube_str;
    $youtube_str = get_string_between($youtube_str, 'class="yt-lockup-thumbnail" >', "</div>");
    $youtube_str = get_string_between($youtube_str,'<a href="', '"');
    if(isset($code)) {
        updateLastVideo($code);
    }
    return $youtube_str;
}

function get_string_between($string, $start, $end){
    $string = ' ' . $string;
    $ini = strpos($string, $start);
    if ($ini == 0) return '';
    $ini += strlen($start);
    $len = strpos($string, $end, $ini) - $ini;
    return substr($string, $ini, $len);
}

//method to get channel id
function getChannelIdByCode($code) {
    $file = file_get_contents("../DB/channels.json");
    $channelId = get_string_between($file,$code.'": "',"[");
    return $channelId;
}

//update the number ok clicks
function updateLastVideo($code) {
    $stringData = file_get_contents("../DB/channels.json");
    $userString = get_string_between($stringData, '"'.$code.'": "', '"');
    $newUserString = "";
    
    if(str_replace("[points]","",$userString) != $userString) {
        $userString = $userString."[]";
        $points = get_string_between($userString, '[points]', '[');
        $oldPoint = $points;
        $points++;
        $newUserString = str_replace("]".$oldPoint."[", "]".$points."[", $userString);
        $newUserString = str_replace("[]","",$newUserString);
        $userString = str_replace("[]","",$userString);
    } else {
        $newUserString = $userString."[points]1";
    }

    $newStringData = str_replace($userString, $newUserString, $stringData);
    $dataFile = fopen("../DB/channels.json", "w") or die("Unable to open file!");
    fwrite($dataFile, $newStringData);
    fclose($dataFile);
}

//method to add a new entry
function addEntry($code) {
    $jsonObject = file_get_contents("../DB/entries.json");
    $jsonObject = json_decode($jsonObject);

    $newEntry = array("CODE" => $code, "TIME" =>)
}

?>