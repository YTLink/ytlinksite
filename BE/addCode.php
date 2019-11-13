<?php 
    if(isset($_GET['key']) && isset($_GET['channelKey']) && isset($_GET['email'])) {
        $stringFile = file_get_contents("../DB/channels.json");
        if(validateKey($_GET['key']) && validateEmail($_GET['email'])) {
            $newInput = ',"'.$_GET['key'].'": "'.$_GET['channelKey'].'[email]'.$_GET['email'].'"}';
            $stringFile = str_replace("}",$newInput, $stringFile);

            $myfile = fopen("../DB/channels.json", "w") or die("Unable to open file!");
            fwrite($myfile, $stringFile);
            fclose($myfile);
        } else if(!validateEmail($_GET['email'])) {
            echo "Wrong e-mail format";
        } else {
            echo "Duplicate KEY";
        }
    }

    //method to validate the key
    function validateKey($key, $file) {
        $newFile = str_replace("'".$key."'", " ", $file);
        if($file != $newFile) {
            return false;
        }
        return true;
    }

    //method to validate e-mail
    function validateEmail($email) {
        $emailArray = explode("@",$email);

        if(sizeof($emailArray) > 1) {
            return true;
        }
        return false;
    }
?>