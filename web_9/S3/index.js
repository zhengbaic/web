/**
 * Created by bytrain on 2016/11/16.
 */
var able = {
    "A" : 1 ,
    "B" : 1,
    "C" : 1,
    "D" : 1,
    "E" : 1
};
var letter = {"A" : 0 , "B" : 1, "C" : 2, "D" : 3, "E" : 4};
var num = {0 : "A" , 1 : "B", 2: "C", 3 : "D", 4 : "E"};
var stop; //使完全停止
var xhr = [];
var index;
var Parallel;

$(function() {
    $('.apb').on('click', ParallelOrder);
    $("#info-bar").on('click', infoBarClickHandler);
    $(".button").on("click", ButtonClickHandler);
    $("#button").on("mouseleave", ButtonBlurHandler);
    InitStaus();
});
function StopAllRequest(x) {
    for(var i = 0; i< 5; i++) {
        if(xhr[i]) xhr[i].abort();
    }
}
function InitStaus() {
    $.ajaxSetup({cache: false});
    if(xhr.length != 0) StopAllRequest(xhr);
    xhr = [];
    stop = false;
    Parallel = false;
    $("#info-bar").text("");
    $(".number").fadeOut();
    $(".button").on("click", ButtonClickHandler);
    EnableAllButtons();
    able = {"A" : 1 , "B" : 1, "C" : 1, "D" : 1, "E" : 1};
}

function ButtonClickHandler(e) {
    if(Parallel) {
        id = num[index];
        $("#"+id+" .number").html("...").fadeIn();
        index++;
        $($('.button')[index]).trigger('click');
        xhr[letter[id]] = $.get("GetRandonmNumber", function (data) {
            $("#" + id + " .number").html(data);
            able[id] = 0;
        });
        if(index == 5) WatchInfo(); //当所有按钮都在获取随机数时，监视info-bar
    }else {
        if(!IsEnable(e) || stop){
            e.preventDefault();
            return;
        }
        stop = true;
        var id = e.target.id;
        $("#"+id+" .number").html("...").fadeIn();
        DisableButton(e);
        xhr[letter[e.target.id]] = $.get("GetRandonmNumber", function (data) {
            $("#"+id+" .number").html(data);
            able[e.target.id] = 0;
            EnableButton(e);
            stop = false;
        });
    }
}
function WatchInfo() {//每隔100ms点击一次info-bar
    var time = setInterval(function () {
        $('#info-bar').trigger('click');
    }, 100)
}
function DisableAllButtons() {
    $(".button").each(function (i) {
        var classN = $(this).attr("class").replace("enable", "disable");
        this.className = classN;
    });
}
function EnableAllButtons() {
    $(".button").each(function (i) {
        var classN = $(this).attr("class").replace("disable", "enable");
        this.className = classN;
    });
}
function infoBarClickHandler(e) {
    if(IsCalculate(able)){
        $(this).text(CalculateSum());
    }else e.preventDefault();
}
function IsCalculate(able) {
    for(var item in able) {
        if(able[item]) return false;
    }
    return true;
}
function IsEnable(e) {
    return able[e.target.id];
}

function DisableButton(e) {
    $(".button").off("click", ButtonClickHandler);
    $(".button").each(function (i) {
        if(this.id != e.target.id) ChangeCss(this, "enable", "disable");
    })
}

function EnableButton(e) {
    $(".button").each(function (i) {
        if(able[this.id]) {
            this.addEventListener("click", ButtonClickHandler);
            ChangeCss(this, "disable", "enable");
        }else ChangeCss(this, "enable", "disable");
    });
}

function ButtonBlurHandler(e) {
    InitStaus();
}

function CalculateSum() {
    var sum = 0;
    $(".number").each(function (i) {
        sum += parseInt(this.innerText);
    });
    return sum;
}

function ChangeCss(object, oldStatus, newStatus) {
    var classN = $(object).attr("class").replace(oldStatus, newStatus);
    $(object).attr("class", classN);
}
function ParallelOrder(e) {
    index = 0;
    Parallel = true;
    able = {"A" : 1 , "B" : 1, "C" : 1, "D" : 1, "E" : 1};
    $('#info-bar').text("");
    DisableAllButtons();
    $($('.button')[index]).trigger('click');
}

