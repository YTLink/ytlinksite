<?php

if(isset($_POST['username']) && isset($_POST['message']) && isset($_POST['time'])) {

    $fileName = "chatMessages";
    if(isset($_POST['code'])) {
        $fileName = $fileName."_".$_POST['code'];
    }

    $message = array("username" => $_POST['username'], "channelId" => $_POST['channelId'], "message" => $_POST['message'], "time" => $_POST['time']);
    saveFileOnDB($fileName.".json", json_encode($message));
}

function saveFileOnDB($fileName, $text) {
    $file = fopen("../DB/".$fileName, "w") or die("Unable to open file");
    fwrite($file, $text);
    fclose($file);
}

?>