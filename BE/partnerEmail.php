<?php

if(isset($_GET['email'])) {
    $to = $_GET['email'];
    $subject = "Welcome to YTLink Partnership!";

    $message = "
    <html>
        <head>
            <title>YTLink Partnership</title>
        </head>
        <body>
            <div style='width:70%;background-color:rgba(0,0,0,0.05);border-radius:10px;'>
                <div style='width:80%;margin:auto;text-align:center;'> <img style='resize:both;height:80px' src='https://yt-link.com/Media/mainLogo.png'> </div>
                <div style='background-color:rgba(255,255,255,0.9);width:100%;margin:auto;text-align:center;padding-top:20px;position:relative;bottom:30px;padding-bottom:30px;'>
                    <h3> You are now a <b>YTLink</b> Partner </h3>
                    <div style='border:1px solid rgba(0,0,0,0.05);width:48%;margin:auto;text-align:left;margin-bottom:20px;padding:10px;border-radius:5px;'>
                        <p> 
                            <b> A few things you can now experience: </b>
                            <li>Presence on the YTLink extension</li>
                            <li>Personalized chat emotes</li>
                            <li>Your own chat on YTLink</li>
                            <li>Special placement on our platforms and social media</li>
                        </p>
                    </div>
                    <div style='width:60%;text-align:center;margin:auto;'>
                        <a style='display:inline-block;margin-left:10px;margin-right:10px;' href='https://twitter.com/ytlink_'><img style='resize:both;height:30px' src='https://yt-link.com/Media/twitter.png'></a>
                        <a style='display:inline-block;margin-left:10px;margin-right:10px;' href='https://www.instagram.com/ytlink_'><img style='resize:both;height:30px' src='https://yt-link.com/Media/instagram.png'></a>
                        <a style='display:inline-block;margin-left:10px;margin-right:10px;' href='https://www.facebook.com/ytlink1/'><img style='resize:both;height:30px' src='https://yt-link.com/Media/fb.png'></a>
                    </div>
                </div>
                <div style='width:100%;text-align:center;padding-bottom:10px;'> 
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
    $headers .= 'Cc: ytlinksite@gmail.com' . "\r\n";

    mail($to,$subject,$message,$headers);

    echo 'Email sent to: '.$_GET['email'];
}

?>