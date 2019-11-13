<?php

$file = file_get_contents("../DB/channels.json");
$channelsList = json_decode($file);

foreach($channelsList as $key => $val) {
    $email = get_string_between($val, "[email]", "[");
    if($email != "") {
        sendRatingEmail($key, $email);
    }
}

sendRatingEmail("TEST_ID", "ytlinksite@gmail.com");

function get_string_between($string, $start, $end){
    $string = ' ' . $string;
    $ini = strpos($string, $start);
    if ($ini == 0) return '';
    $ini += strlen($start);
    $len = strpos($string, $end, $ini) - $ini;
    return substr($string, $ini, $len);
}

function sendRatingEmail($code, $email) {
    /* $subject = "YT-Link - Rate Us!";

    $message = "
    <html>
        <head>
            <title>YTLink - Rate Us!</title>
        </head>
        <body>
            <div style='width:70%;background-color:rgba(0,0,0,0.05);border-radius:10px;'>
                <div style='width:80%;margin:auto;text-align:center;'> <img style='resize:both;height:80px' src='https://yt-link.com/Media/mainLogo.png'> </div>
                <div style='background-color:rgba(255,255,255,0.9);width:100%;margin:auto;text-align:center;padding-top:20px;position:relative;bottom:30px;padding-bottom:30px;'>
                    <h3> Rate Us! </h3>
                    <p> <a href='https://vantta.com/05/API/OneSwipe/token.php?token=2_YTLink&uniqueID=".$code."&redirectURL=https://yt-link.com'> <img style='resize:both;width:50%;border-radius:5px;' src='https://yt-link.com/Media/rateUs.gif'> </a> </p>
                    <p> We aim to improve our platform as much as we can so we would appreciate if you would take 5 seconds to <b> rate us with a swipe. </b> </p>
                    <p> <a href='https://vantta.com/05/API/OneSwipe/token.php?token=2_YTLink&uniqueID=".$code."&redirectURL=https://yt-link.com'> Start Rating </a> </p>
                    <p> <b> Thank you for helping our platform! </b> </p>
                    <div style='width:60%;text-align:center;margin:auto;margin-top:20px;'>
                        <a style='display:inline-block;margin-left:10px;margin-right:10px;' href='https://twitter.com/ytlink_'><img style='resize:both;height:30px' src='https://yt-link.com/Media/twitter.png'></a>
                        <a style='display:inline-block;margin-left:10px;margin-right:10px;' href='https://www.instagram.com/ytlink_'><img style='resize:both;height:30px' src='https://yt-link.com/Media/instagram.png'></a>
                        <a style='display:inline-block;margin-left:10px;margin-right:10px;' href='https://www.facebook.com/ytlink1/'><img style='resize:both;height:30px' src='https://yt-link.com/Media/fb.png'></a>
                    </div>
                </div>
                <div style='width:100%;text-align:center;padding-bottom:10px;'>
                    <p> You can learn more about our <b> extension </b> and <b>partner program</b> on our FAQ on our <a href='https://yt-link.com'>website</a> </p> 
                    <p> <b> YT-LINK - 2019 </b> </p> 
                </div>
            </div>
        </body>
    </html>";

    // Always set content-type when sending HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

    // More headers
    $headers .= 'From: YTLink <info@yt-link.com>' . "\r\n";

    mail($email,$subject,$message,$headers); */

    echo $email.',';
}

?>