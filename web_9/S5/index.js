$(function() {
    var CurrSum;
    $(".number").fadeOut();
    $("#A").on("click", aHandler);
    $("#B").on("click", bHandler);
    $("#C").on("click", cHandler);
    $("#D").on("click", dHandler);
    $("#E").on("click", eHandler);
    $("#info-bar").on('click', bubbleHandler);
    $("#button").on("mouseleave", ButtonBlurHandler);
    $('.apb').on('click', Final);
});

function getRandomNumber(limit) {
    return Math.round(Math.random() * limit);
}
/*样式的改变*/
function DisableButton(e) {
    $(".button").each(function (i) {
        if(this.id != e.target.id) ChangeCss(this, "enable", "disable");
        else ChangeCss(this, "disable", "enable");
    })
}
function EnableButton(e) {
    $(".button").each(function (i) {
        if(this.id != e.target.id) {
            ChangeCss(this, "disable", "enable");
        }else ChangeCss(this, "enable", "disable");
    });
}
function ChangeCss(object, oldStatus, newStatus) {
    var classN = $(object).attr("class").replace(oldStatus, newStatus);
    $(object).attr("class", classN);
}
/*向服务器请求并调用下一个*/
function AjaxRequest(e, currentSum, callback) {
    var id = e.target.id;
    DisableButton(e);
    $("#"+id+" .number").html("...").fadeIn();
    $.get("GetRandom", function (data) {
        $("#"+id+" .number").html(data);
        currentSum += parseInt(data);
        EnableButton(e);
        CheckError(e, currentSum, callback, data);
    });
}
/*各种事件监听*/
function aHandler(e) {
    var currentSum = arguments[1];
    var callback = arguments[2];
    AjaxRequest(e, currentSum, callback);
}
function bHandler(e) {
    var currentSum = arguments[1];
    var callback = arguments[2];
    AjaxRequest(e, currentSum, callback);
}
function cHandler(e) {
    var currentSum = arguments[1];
    var callback = arguments[2];
    AjaxRequest(e, currentSum, callback);
}
function dHandler(e) {
    var currentSum = arguments[1];
    var callback = arguments[2];
    AjaxRequest(e, currentSum, callback);
}
function eHandler(e) {
    var currentSum = arguments[1];
    var callback = arguments[2];
    AjaxRequest(e, currentSum, callback);
}
function bubbleHandler(e) {
    $(".button").each(function (i) {
        ChangeCss(this, "enable", "disable");
    });
    var sum = arguments[1];
    $("#info-bar").text(sum);
    var message = "<p class = 'info'>大气泡：楼主异步调用战斗力感人，目测不超过" + sum + "</p>";
    $('#message').append(message);
    e.preventDefault();
}
function ButtonBlurHandler(e) {
    $(".number").fadeOut();
    $("#info-bar").text("");
    $(".button").each(function (i) {
        ChangeCss(this, "disable", "enable");
    });
    $('#message').empty();
}
/*看有没有出错*/
function CheckError(e, sum, callback, data) {
    var id = e.target.id;
    var errorMessage = {
        "A" : "A：这不是个天大的秘密",
        "B" : "B：我知道",
        "C" : "C：你知道",
        "D" : "D：他知道",
        "E" : "E：才不怪"
    };
    var Message = {
        "A" : "A：这是个天大的秘密",
        "B" : "B：我不知道",
        "C" : "C：你不知道",
        "D" : "D：他不知道",
        "E" : "E：才怪"
    };
    var i = getRandomNumber(2);
    if(i == 1) {
        var obj = {
            message : errorMessage[id],
            currentSum : sum
        };
        var message = "<p class = 'e'>" + obj.message + "</p>";
        $('#message').append(message);
        callback(obj, sum - parseInt(data));
    }
    else {
        var message =  Message[id];
        var m = "<p class = 'm'>" + message + "</p>";
        $('#message').append(m);
        callback(null, sum);
    }
}
/*主要是闭包的设计*/
function Final(e) {
    var order = [0,1,2,3,4].sort(()=>Math.random() - 0.5);
    var letters = order.map(ToLetter).join(' ');
    var message = "<p class = 'info'>调用顺序：" + letters + "</p>";
    $('#message').append(message);
    var callbacks = [];
    for(var i = 0; i < 5; i++) {
        (function (i) {
            callbacks[i] = function (error, sum) {
                if(error != null) {
                    var id = ToLetter(order[i - 1]);
                    $("#"+ id).trigger("click", [sum, callbacks[i]]);
                }else {
                    var id = ToLetter(order[i]);
                    $("#"+ id).trigger("click", [sum, callbacks[i+1]]);
                }
            }
        })(i);
    }
    callbacks[5] = function (error, sum) {
        var id = ToLetter(order[4]);
        if(error != null) callbacks[4](null, sum);
        else $("#info-bar").trigger('click', sum);
    };
    var id = ToLetter(order[0]);
    var start = callbacks[0];
    start(null, 0);
}
/*数字转换为字母*/
function ToLetter(i) {
    var letter = {
        0 : "A",
        1 : "B",
        2 : "C",
        3 : "D",
        4 : "E"
    };
    return letter[i];
}


