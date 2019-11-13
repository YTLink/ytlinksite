<?php

if(isset($_GET['code'])) {
    updateLastVideo($_GET['code']);
    header('location:../');
}

function get_string_between($string, $start, $end){
    $string = ' ' . $string;
    $ini = strpos($string, $start);
    if ($ini == 0) return '';
    $ini += strlen($start);
    $len = strpos($string, $end, $ini) - $ini;
    return substr($string, $ini, $len);
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
        $points = $points +50;
        $newUserString = str_replace("]".$oldPoint."[", "]".$points."[", $userString);
        $newUserString = str_replace("[]","",$newUserString);
        $userString = str_replace("[]","",$userString);
    } else {
        $newUserString = $userString."[points]50";
    }

    $newStringData = str_replace($userString, $newUserString, $stringData);
    $dataFile = fopen("../DB/channels.json", "w") or die("Unable to open file!");
    fwrite($dataFile, $newStringData);
    fclose($dataFile);
}

?>