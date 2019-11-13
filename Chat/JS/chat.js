var apiKey = "AIzaSyASvwWL1-yUgQT9r10DzoV1iph2TYP7S3E";

window.onload = function () {
    if (window.location.href.split("#access_token").length > 1) {
        var token = window.location.href.split("#")[1].split("&")[0].split("=")[1];
        setToken(token);
    } else if(window.location.href.split("#").length > 1) {
        chatCode = window.location.href.split("#")[1];
        this.localStorage.setItem("lastChat",chatCode);
        //checkToken();
        getChannelName(checkToken);
    }
};

var channelName;

//method to check channel name from the code
function getChannelName(callback) {
    var url = "../BE/getChannelIdByCode.php?CODE="+chatCode+"&r=" + Math.random();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //window.location.href = "https://youtube.com/channel/"+JSON.parse(this.responseText)[key.toUpperCase()];
            if (this.responseText != "") {
                channelName = this.responseText;
                callback();
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

var chatCode;

function main() {
    checkToken();
    if (currentToken != null) {
        setInterval(function () {
            renderMessages();
        }, 100);
        $("#sendBtn").removeAttr("disabled");
        $("#message").on('keypress', function (event) {
            if (event.which == 13) {
                event.preventDefault();
                addNewMessage();
            }
        });
    } else {
        $("#sendBtn").attr("disabled", "true");
    }
}

var currentToken;
var currentUsername;
var currentChannelId;

//method to check for a userName on localstorage
function checkToken() {
    var token = localStorage.getItem("access_token");
    if (token == null) {
        $("#usernameModal").modal();
    } else {
        currentToken = token;
        if(currentUsername == null) {
            validateToken(token);
        }
    }
}

//method to set the current username on the borwser localstorage
function setToken(token) {
    localStorage.setItem("access_token", token);
    $("#usernameModal").modal('hide');
    window.location.href = "./#"+localStorage.getItem("lastChat");
    window.location.reload();
}

//validate if a string is in json format
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

var lastMessageTime = 0;

//function to get the last message
function renderMessages() {
    var xhttp = new XMLHttpRequest();
    var url = "./BE/getChatMessage.php?r=" + Math.random();
    if (chatCode != null) {
        url = url + "&code=" + chatCode;
    }
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (isJson(this.responseText)) {
                var message = JSON.parse(this.responseText);
                if (message.time != lastMessageTime) {
                    renderSingleMessage(message);
                    lastMessageTime = message.time;
                }
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

var emotes = {
    ":guida:": "https://www.pinclipart.com/picdir/big/66-669227_download-whale-png-transparent-images-38-pics-free.png",
    ":babum:": "https://img.pngio.com/explosion-png-image-transparent-library-explosion-png-3262_3091.png",
    "<3": "http://clipart-library.com/images/yTkKX67Gc.png",
    "ganso": "http://pngimg.com/uploads/goose/goose_PNG10.png"
};

//method to put emotes on message
function filterEmotes(message) {
    var emoteKeys = Object.keys(emotes);
    for (var i = 0; i < emoteKeys.length; i++) {
        var img = "<img src='" + emotes[emoteKeys[i]] + "' style='resize:both;height:30px'>";
        message = message.replace(new RegExp(emoteKeys[i], "g"), img);
    }
    return message;
}

//function to render singleMessage
function renderSingleMessage(message) {

    var finalMessage = filterEmotes(message.message);

    var messagesDiv = $("#Messages");

    var userClass = "normal";

    if(message.channelId === channelName) {
        userClass = "super";
    }

    var newMessage = jQuery("<div>", {
        html: "<span class='"+userClass+"'><b>" + message.username + ":</span> </b>" + finalMessage,
        style: "margin-bottom:5px;"
    }).appendTo(messagesDiv);

    $("#Messages").scrollTop($("#Messages")[0].scrollHeight);

    //messagesDiv.scrollTo(newMessage);
}

//function to add new message
function addNewMessage() {
    var message = $("#message").val();
    $("#message").val("");
    var time = new Date().getTime();
    var url = "./BE/newMessage.php";

    var finalPost = "";

    if(chatCode) {
        finalPost = "&code="+chatCode;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username=" + currentUsername +"&channelId=" + currentChannelId + "&message=" + message + "&time=" + time + finalPost);
}


//function to see if the channel exists
function loadChannel(token) {

    var url = "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true&access_token="+token+"&key=" + apiKey;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText != null) {
                if (JSON.parse(this.responseText).items.length > 0) {
                    currentUsername = JSON.parse(this.responseText).items[0].snippet.title;
                    currentChannelId = JSON.parse(this.responseText).items[0].id;
                    main();
                }
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

//method to validateToken
function validateToken(token) {
    var xhttp = new XMLHttpRequest();
    var url = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token="+token;
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            loadChannel(token);
        } else if(this.status == 400) {
            logout();
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

//method to logout
function logout() {
    localStorage.removeItem("access_token");
    window.location.href="./";
}

//method to login with google
function loginWithGoogle() {
    var client_id = "225819107745-7v98i24fphb46pvnuorfdsdt69t12h8o.apps.googleusercontent.com";
    var redirect_uri = window.location.href;
    var scope = "https://www.googleapis.com/auth/youtube.readonly";
    var response_type = "token";
    var url = "https://accounts.google.com/o/oauth2/auth?client_id="+client_id+"&response_type="+response_type+"&scope="+scope+"&redirect_uri="+redirect_uri;
    window.location.href = url;
}