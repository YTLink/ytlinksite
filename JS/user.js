var apiKey = "AIzaSyASvwWL1-yUgQT9r10DzoV1iph2TYP7S3E";

window.onload = function () {
    if(window.location.href.indexOf("#") > -1) {
        loadUser(window.location.href.split("#")[1]);
    }    
};

function loadUser(user) {
    var url = "./DB/channels.json?r="+Math.random();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            loadUserInfo(JSON.parse(this.responseText)[key.toUpperCase()]);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function loadUserInfo(channelKey){
    var url = "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id="+channelKey+"&key="+apiKey;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
            renderUserInfo(JSON.parse(this.responseText));
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}