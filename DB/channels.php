<?php
//set headers 
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$channels = file_get_contents("./channels.json");
echo $channels;

?>