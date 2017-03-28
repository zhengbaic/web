var width = 6;
var height = 9;
var holes, time, score, is_start = false, is_over, interval;

function creating_mole() {
    for(var i = 0; i < 54; i++) $("#game_box").append("<div class = 'hole' ></div>");
}

function mole_click() {
    if (is_start) {
        score.val( parseInt(score.val()) + 1);
        $(this).attr("class","hole").unbind('click', mole_click).bind('click', hole_click);
        var random = parseInt((holes.length - 1)*Math.random());
        holes.each(function (i) {
            if(i == random) $(this).attr("class","mole");
        });
        $(".mole").unbind('click', hole_click).bind('click', mole_click);
    }
}
function hole_click() {
    if(is_start){
        score.val( parseInt(score.val()) - 1);
        if(parseInt(score.val()) <= 0) score.val(0);
    }
}

function start() {
    is_start = true;
    time.val(30);
    score.val(0);
    interval = setInterval('time_cal()', 1000);
    var random = parseInt(( holes.length - 1)*Math.random());
    holes.each(function (i) {
        if(i == random) $(this).attr("class","mole");
        $(this).bind('click', hole_click);
    });
    $(".mole").unbind('click', hole_click).bind('click', mole_click);
    is_over.html("Playing");
}

function over() {
    is_start = false;
    clearInterval(interval);
    time.val(0);
    $(".mole").attr("class","hole").unbind("click", mole_click).bind("click", hole_click);
    is_over.html("Game over");
    $("#game_box").attr("class", "");
}

function time_cal() {
    time.val(time.val() - 1);
    if(time.val() == 0) {
        over();
        alert("Game over, and your score is:\n"+score.val());
        score.val(0);
    }
}

function game_start() {
    if(!is_start) {      //开始游戏
        is_start = true;
        $("#game_box").attr("class", "hammer");
        /*照片*/
        start();
    }else {                      //结束游戏
        score.val(0);
        over();
    }
}
window.onload = function () {
    creating_mole();
    holes = $(".hole");
    time = $("#time");
    score = $("#score");
    is_over = $("#game_over");
    $("#start_and_stop").click(game_start);
};