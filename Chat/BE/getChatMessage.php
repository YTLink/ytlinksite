<?php

$codeMessage = "chatMessages";

if(isset($_GET['code'])) {
    $codeMessage = $codeMessage."_".$_GET['code'];
}

header('Content-Type: application/json');
$json = file_get_contents("../DB/".$codeMessage.".json");
echo $json;
?>