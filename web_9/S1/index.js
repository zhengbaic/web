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
var stop; //使完全停止
var xhr = [];
var index;

$(function() {
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
    if(xhr.length != 0) StopAllRequest(xhr);
    xhr = [];
    stop = false;
    $("#info-bar").text("");
    $(".number").fadeOut();
    $(".button").on("click", ButtonClickHandler);
    EnableAllButtons();
    able = {"A" : 1 , "B" : 1, "C" : 1, "D" : 1, "E" : 1};
}

function ButtonClickHandler(e) {
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
