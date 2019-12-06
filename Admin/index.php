<?php

session_start();

if(isset($_POST['password'])) {
    if(strcmp($_POST['password'],"ytL!nkPass") == 0) {
        echo file_get_contents("./admin.html");
    } else {
        echo file_get_contents("./login.html");
    }
} else {
    echo file_get_contents("./login.html");
}

?>