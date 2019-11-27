var apiKey = "{API KEY}";

window.onload = function () {
    if (window.location.href.indexOf("#") > -1 && window.location.href.split("#")[1].indexOf("access_token") > -1) {
        var token = window.location.href.split("#")[1].split("&")[0].split("=")[1];
        setAccessToken(token);
        window.location.href = "./";
    } else if (window.location.href.indexOf("#") > -1) {
        if (window.location.href.split("#")[1] == "Ext") {
            renderMainPage();
            $(".pages").hide();
            $("#extDiv").show();
            $(".menuBtn").removeClass("activeBtn");
            $("#extBtn").addClass("activeBtn");
            window.scrollTo(0, document.body.scrollHeight);
        } else {
            getValueOf(decodeURI(window.location.href.split("#")[1]));
        }
    } else {
        renderMainPage();
    }
};

//main method (normal webpage)
function renderMainPage() {

    loadCurrentUserName();

    $("#openingYourVideo").hide();
    loadRegistredMembers();
    $("#main").removeAttr("hidden");

    /* $(".loadChannel").click(function () {
        loadChannel($("#ytlink").val());
    }); */

    $("#searchInput").on("input", function () {
        searchForChannel();
    });

    $("#faqBtn").click(function (event) {
        $(".pages").hide();
        $("#faq").show();
        $(".menuBtn").removeClass("activeBtn");
        $(event.target).addClass("activeBtn");
    });

    $("#partnersBtn").click(function (event) {
        $(".pages").hide();
        $("#home").show();
        $(".singleChannel").hide();
        $("[isPartner='true'").show();
        seePartners = true;
        $(".menuBtn").removeClass("activeBtn");
        $(event.target).addClass("activeBtn");
    });

    $("#chatBtn").click(function () {
        var wH = window.innerHeight;
        $("#chatFrame").attr("height", (wH - 50) + "px");
        $(".pages").hide();
        $("#chatDiv").show();
        $(".menuBtn").removeClass("activeBtn");
        $(event.target).addClass("activeBtn");
        window.scrollTo(0, document.body.scrollHeight);
    });

    $("#homeBtn").click(function () {
        $(".pages").hide();
        $("#home").show();
        $("[isPartner='true'").hide();
        $("[div-index='0']").show();
        seePartners = false;
        $(".menuBtn").removeClass("activeBtn");
        $(event.target).addClass("activeBtn");
    });

    $("#extBtn").click(function () {
        $(".pages").hide();
        $("#extDiv").show();
        $(".menuBtn").removeClass("activeBtn");
        $(event.target).addClass("activeBtn");
        window.scrollTo(0, document.body.scrollHeight);
    });
}

//method to validate
function loadCurrentUserName() {
    var currentToken = getAccessToken();
    if (currentToken != -1) {
        $("#loginPart").hide();
        validateToken(currentToken);
        //getChannelKey(currentToken);
    } else {
        //do nothing
    }
}

//method to validateToken
function validateToken(token) {
    var xhttp = new XMLHttpRequest();
    var url = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + token;
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            loadChannel(token);
        } else if (this.status == 400) {
            logout();
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

//function to getAccessToken
function getAccessToken() {
    var response = localStorage.getItem("access_token");
    if (response != null) {
        return response;
    } else {
        return -1;
    }
}

//function setAccessToken
function setAccessToken(token) {
    localStorage.setItem("access_token", token);
}

var loadedChannelId = "";

function setLoadedChannelId(id) {
    loadedChannelId = id;
}

//function to see if the channel exists
function loadChannel(token) {

    var url = "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true&access_token=" + token + "&key=" + apiKey;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText != null) {
                if (JSON.parse(this.responseText).items.length > 0) {

                    $("#loadedChannel").html("");

                    setLoadedChannelId(JSON.parse(this.responseText).items[0].id);

                    var channelInfo = getChannelCode(JSON.parse(this.responseText).items[0].id);

                    var snippet = JSON.parse(this.responseText).items[0].snippet;

                    var subs = JSON.parse(this.responseText).items[0].statistics.subscriberCount;

                    var row = jQuery("<div>", {
                        class: "row",
                        style: "width:100%;margin-left:auto;margin-right:auto;background-color:rgba(0,0,0,0.05);margin-top:20px;padding-top:10px;padding-bottom:10px;position:relative;bottom:25px;border-radius:5px;"
                    }).appendTo($("#loadedChannel"));

                    jQuery("<div>", {
                        class: "col-xs-3 col-sm-3 col-md-3 col-lg-3",
                        html: "<img alt='" + snippet.title + " image' src='" + snippet.thumbnails.default.url + "' style='resize:both;width:100%;border-radius:100%;position:relative;top:10px;'>"
                    }).appendTo(row);

                    var titleRow = jQuery("<div>", {
                        class: "col-xs-9 col-sm-9 col-md-9 col-lg-9",
                        html: "<div style='width:100%;font-size:18px;' id='title' class='align-middle'>" + snippet.title + "</div>"
                    }).appendTo(row);

                    var inputGroup = jQuery("<div>", {}).appendTo(titleRow);

                    if (channelInfo == -1) {

                        jQuery("<input>", {
                            class: "form-control",
                            placeholder: "CODE",
                            style: "margin-bottom:5px;",
                            id: "codeToAdd"
                        }).appendTo(inputGroup);

                        jQuery("<input>", {
                            class: "form-control",
                            placeholder: "Your E-mail",
                            style: "margin-bottom:5px;",
                            id: "emailToAdd"
                        }).appendTo(inputGroup);

                        jQuery("<button>", {
                            class: "btn btn-danger",
                            html: "Create",
                            id: "addCodeBtn",
                            style: "margin-right:10px;"
                        }).appendTo(inputGroup);

                        $("#addCodeBtn").click(function () {
                            addNewCodeValidation();
                        });
                    } else {

                        var userRow = jQuery("<div>", {
                            class: "row"
                        }).appendTo(titleRow);

                        jQuery("<div>", {
                            class: "col-xs-6",
                            html: "Points <b>" + channelInfo.points + "</b>",
                            style: "margin-bottom:5px;",
                        }).appendTo(userRow);

                        jQuery("<div>", {
                            class: "col-xs-6",
                            html: "Subs <b>" + subs + "</b>",
                            style: "margin-bottom:5px;",
                        }).appendTo(userRow);

                        jQuery("<div>", {
                            class: "col-xs-12",
                            html: "<a href='https://yt-link.com/" + channelInfo.code + "'>yt-link.com/" + channelInfo.code + "</a>"
                        }).appendTo(userRow);

                        hasGivenReview(channelInfo.code);

                    }

                    jQuery("<span>", {
                        class: "glyphicon glyphicon-log-out",
                        title: "Logout",
                        style: "float:right;margin-right:5px;font-size:12px;cursor:pointer;"
                    }).appendTo($("#title")).click(function () {
                        logout();
                    });

                } else {
                    $("#loadedChannel").html("<p><center><b>The channel does not exist</b></center></p>");
                }
            }
        } else if (this.status == 400) {
            console.log("token is wrong!");
            logout();
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();
}

//method to check if channel has given review
function hasGivenReview(code) {
    var xhttp = new XMLHttpRequest();
    var url = "https://vantta.com/05/API/REST/givenRevById.php?token=2_YTLink&uniqueID=" + code;

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText === "true") {
                $("#rateUs").show();
                $("#rateUs").find("button").click(function () {
                    window.location.href = "https://vantta.com/05/API/OneSwipe/token.php?token=2_YTLink&uniqueID=" + code + "&redirectURL=https://yt-link.com/BE/reviewPrize.php?code=" + code;
                });
            } else {
                $("#rateUs").hide();
            }
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();
}

//function to check if string is empty
function isEmpty(string) {
    string = string.split('');
    for (var i = 0; i < string.length; i++) {
        if (string[i] != " ") {
            return false;
        }
    }
    return true;
}

//method to validate e-mail address
function validateEmailField(email) {
    if (email.indexOf("@") > -1) {
        if (email.split("@").length == 2 && email.split("@")[1] != "") {
            return true;
        }
        return false;
    }
    return false;
}

//method to validate the number of characters on the code value
function validateCodeField(code) {
    if (code.length > 10) {
        return false;
    }
    return true;
}

//method to validate if channel already has a code 
function getChannelCode(channelId) {
    var channelsKey = Object.keys(channels);
    for (var i = 0; i < channelsKey.length; i++) {
        if (channels[channelsKey[i]].split("[")[0] == channelId) {
            var points = getChannelPoints(channels[channelsKey[i]]);
            return {
                "points": points,
                "code": channelsKey[i]
            };
        }
    }
    return -1;
}

//function to validate if the information is valid to procede with adding a new code
function addNewCodeValidation() {
    var codeToAdd = $("#codeToAdd").val();
    var emailToAdd = $("#emailToAdd").val();

    if (validateEmailField(emailToAdd) && validateCodeField(codeToAdd)) {
        var channel = loadedChannelId;
        if (!channels[codeToAdd] && !isEmpty(codeToAdd)) {
            var channelsKey = Object.keys(channels);
            var flag = true;
            for (var i = 0; i < channelsKey.length; i++) {
                if (channels[channelsKey[i]].split("[")[0] == channel) {
                    alert("The channel is already registred with the code " + channelsKey[i].toUpperCase() + ", if you wish to have more than one code for your channel please contact us via e-mail.");
                    flag = false;
                    break;
                }
            }
            if (flag) {
                addNewCode(codeToAdd, emailToAdd);
            }
        } else {
            alert("The code you want to use is already registred or empty, please try a different one");
        }
    } else if (!validateCodeField(codeToAdd)) {
        alert("The code is too long, it can't have more than 10 characters");
    } else {
        alert("Please put a correct e-mail address");
    }
}

//function to call the BE service to add a new code
function addNewCode(key, email) {
    var url = "./BE/addCode.php?key=" + key.toUpperCase() + "&channelKey=" + loadedChannelId + "&email=" + email;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            openThankModal(key);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

//open thank you modal method
function openThankModal(key) {
    var ul = $("#createdLink");

    jQuery("<li>", {
        class: "list-group-item",
        html: "yt-link.com/" + key
    }).appendTo(ul);

    jQuery("<li>", {
        class: "list-group-item",
        html: "yt-link.co/" + key
    }).appendTo(ul);

    jQuery("<li>", {
        class: "list-group-item",
        html: "ytlink.co/" + key
    }).appendTo(ul);

    $("#thankModal").modal();
    loadRegistredMembers();
}

//function to open the latest video of the channel saved
function getValueOf(key) {

    var url = "./DB/channels.json?r=" + Math.random();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //window.location.href = "https://youtube.com/channel/"+JSON.parse(this.responseText)[key.toUpperCase()];
            if (JSON.parse(this.responseText)[key.toUpperCase()] != null) {
                goToLastVideo(JSON.parse(this.responseText)[key.toUpperCase()].split("[")[0], key);
            } else {
                window.location.href = "./";
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

//function to search the youtube api for the channel
function goToLastVideo(channelKey, key) {
    var url = "./BE/getLastVideo.php?channelId=" + channelKey + "&code=" + key.toUpperCase() + "&r=" + Math.random();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);
            //var lastVideoURL = "http://youtu.be/"+JSON.parse(this.responseText).items[0].id.videoId;
            var lastVideoURL = "http://youtube.com" + this.responseText;
            window.location.href = lastVideoURL;
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();
}

var channels;

function setChannels(model) {
    channels = model;
}

//
var maxPoints = 0;
var maxCode = 0;
var maxKey = 0;

var fullSize = 0;

var maxChannels = [];

//function to load registred members
function loadRegistredMembers(event) {

    $("#topChannel").html("");
    $("#channels").html("");

    var url = "./DB/channels.json?r=" + Math.random();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var members = JSON.parse(this.responseText),
                memberKeys = Object.keys(JSON.parse(this.responseText));
            setChannels(members);

            $("#nCodes").html(" <b>" + memberKeys.length + "</b>");

            var totalPoints = 0;

            $("#pageBtnsDiv").html(""); //clear previous buttons

            var btnDiv = jQuery("<div>", {
                class: "row",
                style: "width:90%;margin:auto;text-align:center;"
            }).appendTo("#pageBtnsDiv");

            var nButtons = Math.floor(memberKeys.length / 10) + 1;

            var maxPartner = false;

            for (i = 0; i < memberKeys.length; i++) {
                var currentChannelPoints = getChannelPoints(members[memberKeys[i]]);
                totalPoints += currentChannelPoints;

                /* if (maxPoints < getChannelPoints(members[memberKeys[i]])) {
                    maxPoints = getChannelPoints(members[memberKeys[i]]);
                    maxCode = memberKeys[i];
                    maxKey = members[memberKeys[i]].split("[")[0];
                    maxPartner = false;
                    if (members[memberKeys[i]].indexOf("[PARTNER]") > -1) {
                        maxPartner = true;
                    }
                } */

                var mLength = maxChannels.length;

                var newEl;

                var enter = false;

                for (var j = 0; j < mLength; j++) {
                    if (maxChannels[j].points < currentChannelPoints) {
                        enter = true;
                        for (var t = mLength; t > j; t--) {
                            if (maxChannels[t] != null) {
                                maxChannels[t].points = maxChannels[t - 1].points;
                                maxChannels[t].code = maxChannels[t - 1].code;
                                maxChannels[t].key = maxChannels[t - 1].key;
                            } else {
                                newEl = {
                                    points: maxChannels[t - 1].points,
                                    code: maxChannels[t - 1].code,
                                    key: maxChannels[t - 1].key
                                };
                                maxChannels.push(newEl);
                            }
                        }
                        maxChannels[j].points = currentChannelPoints;
                        maxChannels[j].code = memberKeys[i];
                        maxChannels[j].key = members[memberKeys[i]];
                        break;
                    }

                }

                jQuery("<div>", {
                    channelIndex: i
                }).appendTo($("#channels"));

                if (!enter) {
                    newEl = {
                        points: currentChannelPoints,
                        code: memberKeys[i],
                        key: members[memberKeys[i]]
                    };
                    maxChannels.push(newEl);
                }
            }

            var channelsKey = maxChannels[0].key;
            maxCode = maxChannels[0].code;

            var cSplices = 40;

            fullSize = Math.floor(memberKeys.length / cSplices) + 1;
            for (k = 0; k < fullSize; k++) {
                var boundary = k * cSplices;
                for (i = boundary; i < (boundary + cSplices); i++) {
                    if (i < maxChannels.length) {
                        if (maxChannels[i].key.split("[")[0] != maxKey) {
                            var cPoints = getChannelPoints(maxChannels[i].key);
                            var cKey = maxChannels[i].key.split("[")[0];
                            var cCode = maxChannels[i].code;

                            channelCodes[cKey] = cCode;
                            channelPoints[cKey] = cPoints;

                            //mark if it's from the partner program
                            if (maxChannels[i].key.indexOf("[PARTNER]") > -1) {
                                channelPartner[cKey] = true;
                            } else {
                                channelPartner[cKey] = false;
                            }

                            //mark if it's a picked channel
                            if (maxChannels[i].key.indexOf("[PICK]") > -1) {
                                channelPick[cKey] = true;
                                channelPoints[cKey] = 0;
                            } else {
                                channelPick[cKey] = false;
                            }

                            channelsKey += "," + cKey;
                        }
                    } else {
                        break;
                    }
                }
                getChannelInfo(channelsKey, k);
                channelsKey = "";
            }

            $("#nPoints").html(" <b>" + totalPoints + "</b>");
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

//method to get index of array based on the code
function getIndexByCode(code) {
    for (var i = 0; i < maxChannels.length; i++) {
        if (maxChannels[i].code === code) {
            return i;
        }
    }
    return -1;
}

//method to return channel points
function getChannelPoints(channel) {
    if (channel.split("[points]")[1] != null) {
        return parseInt(channel.split("[points]")[1]);
    } else {
        return 0;
    }
}

var channelCodes = {};
var channelPoints = {};
var channelPartner = {};
var channelPick = {};

//function to get the actual youtube info of the channel
function getChannelInfo(channelKey, k) {

    var url = "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=" + channelKey + "&key=" + apiKey;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var channelsModel = JSON.parse(this.responseText).items;
            channelsModel.forEach(function (element) {
                var code = channelCodes[element.id];
                var points = channelPoints[element.id];
                var isPartner = channelPartner[element.id];
                var isPick = channelPick[element.id];
                renderChannelInfo(element, code, points, isPartner, isPick, k);
            });
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();
}

//method to get channel info from the intern API
function getChannelInternApi(channelKey, code, points) {
    var url = "./BE/getChannelInfo.php?channelId=" + channelKey + "&r=" + Math.random();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var channelModel = JSON.parse(this.responseText);
            if (channelModel != null) {
                renderChannelInfo(channelModel, code, points);
            }
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();
}

//method to list the youtube channels
function renderChannelInfo(channelModel, code, points, isPartner, isPick, k) {

    var profilePicture = channelModel.snippet.thumbnails.default.url,
        channelName = channelModel.snippet.title,
        subCounter = channelModel.statistics.subscriberCount;

    var row;

    if (code.toUpperCase() === maxCode.toUpperCase()) {
        row = jQuery("<div>", {
            class: "row singleChannel topChannel",
            style: "margin-bottom:10px;padding-bottom:10px;padding-top:10px;background-color:rgba(180,0,20,0.1);margin-left:auto;margin-right:auto;width:90%;border-radius:5px;",
            "data-name": channelName.toUpperCase(),
            "data-code": code,
            "div-index": k,
            "isPartner": isPartner,
            "isPick": isPick
        }).appendTo($("#topChannel"));
    } else {
        $("[channelIndex='" + getIndexByCode(code) + "']").html("");
        row = jQuery("<div>", {
            class: "row singleChannel",
            style: "margin-bottom:10px;padding-bottom:10px;padding-top:10px;background-color:rgba(0,0,0,0.06);margin-left:auto;margin-right:auto;width:90%;border-radius:5px;",
            "data-name": channelName.toUpperCase(),
            "data-code": code,
            "div-index": k,
            "isPartner": isPartner,
            "isPick": isPick
        }).appendTo($("[channelIndex='" + getIndexByCode(code) + "']"));

        if (k >= 1) {
            row.hide();
        }
    }

    var left = jQuery("<div>", {
        class: "col-xs-3 col-sm-2 col-md-2 col-lg-2",
        html: "<img alt='profilePicture' src='" + profilePicture + "' style='border-radius:100%;resize:both;width:90%;'>",
    }).appendTo(row);

    var right = jQuery("<div>", {
        class: "col-xs-9 col-sm-10 col-md-10 col-lg-10"
    }).appendTo(row);

    var title = jQuery("<div>", {
        class: "textContent title",
        html: channelName
    }).appendTo(right);

    if (isPartner) {
        title.append(jQuery("<span>", {
            html: "<span class='glyphicon glyphicon-ok'></span>",
            style: "display:inline-block;color:white;font-size:9px;margin-left:5px;height:15px;width:15px;text-align:center;border-radius:100%;background-color:#b30000;position:relative;bottom:3px;"
        }));
        title.append(jQuery("<div>", {
            html: '<a href="./Chat/#' + code.toUpperCase() + '"><span class="glyphicon glyphicon-comment"></span></a>',
            style: 'position:relative;display:inline-block;float:right;'
        }));
    } else if (isPick) {
        title.append(jQuery("<span>", {
            html: "<span class='glyphicon glyphicon-star'></span>",
            style: "display:inline-block;color:white;font-size:9px;margin-left:5px;height:15px;width:15px;text-align:center;border-radius:100%;background-color:#6699ff;position:relative;bottom:3px;"
        }));
    }

    var rightRow = jQuery("<div>", {
        class: "row",
    }).appendTo(right);

    if (!isPick) {

        //subs
        jQuery("<div>", {
            class: "col-xs-12 col-sm-4 col-md-4 col-lg-4",
            html: "Points <b>" + points + "</b>"
        }).appendTo(rightRow);

        jQuery("<div>", {
            class: "col-xs-12 col-sm-4 col-md-4 col-lg-4",
            html: "Subs <b>" + subCounter + "</b>"
        }).appendTo(rightRow);

    }

    jQuery("<div>", {
        class: "col-xs-12 col-sm-12 col-md-12 col-lg-12 code",
        html: "<a href='./" + code + "/'>yt-link.com/" + code + "</a>"
    }).appendTo(rightRow);
}

var seePartners = false;

//method to look for searched channel on the website
function searchForChannel() {
    var channelToSearch = $("#searchInput").val().toUpperCase();
    /* var foundElement = $("[data-name='"+channelToSearch+"']"); */

    //$(".singleChannel").show();

    $(".singleChannel").hide();

    if (seePartners) {
        $("[isPartner='true'").show();
    } else {
        $("[div-index='0'").show();
    }

    if (channelToSearch != "") {

        for (var i = 0; i < $(".singleChannel").length; i++) {
            var currentChannel = $(".singleChannel").eq(i);
            if ((currentChannel.attr("data-name").indexOf(channelToSearch) < 0) && (currentChannel.attr("data-code").indexOf(channelToSearch) < 0)) {
                currentChannel.hide();
            } else {
                currentChannel.show();
            }
        }
    }
}

//method to logout
function logout() {
    localStorage.removeItem("access_token");
    window.location.href = "./";
}

//method to login with google
function loginWithGoogle() {
    var client_id = "225819107745-7v98i24fphb46pvnuorfdsdt69t12h8o.apps.googleusercontent.com";
    var redirect_uri = window.location.href;
    var scope = "https://www.googleapis.com/auth/youtube.readonly";
    var response_type = "token";
    var url = "https://accounts.google.com/o/oauth2/auth?client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&response_type=" + response_type + "&scope=" + scope;
    window.location.href = url;
}