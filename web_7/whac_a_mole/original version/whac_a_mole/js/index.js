var width = 6;
var height = 9;
var is_start = false;
var interval, time, score, is_over, box;

function creat_mole() {
    var game_box = document.getElementById("game_box");
    for(var i = 0; i < height; i++) {
        for(var j = 0; j < width; j++){
            var hole = document.createElement("div");
            hole.className = "hole";
            game_box.appendChild(hole);
        }
    }
}

function mole_click() {
    if (is_start == true) {
        score.value = parseInt(score.value) + 1;
        this.className = "hole";
        this.removeEventListener("click", mole_click, false);
        this.addEventListener("click", hole_click, false);
        var holes = document.getElementsByClassName("hole");
        var x = parseInt((holes.length - 1)*Math.random());
        holes[x].className = "mole";
        var new_mole = document.getElementsByClassName("mole")[0];
        new_mole.removeEventListener("click", hole_click, false);
        new_mole.addEventListener("click", mole_click, false);
    }
}
function hole_click() {
    if(is_start == true){
        score.value = score.value - 1;
        if(score.value <= 0) score.value = 0;
    }
}

function start() {
    is_start = true;
    time.value = 30;
    score.value = 0;
    var holes = document.getElementsByClassName("hole");
    interval = setInterval('time_cal()', 1000);
    var x = parseInt((holes.length - 1)*Math.random());
    holes[x].className = "mole";
    for (var i = 0; i < holes.length; i++) {
        holes[i].addEventListener("click", hole_click, false);
    }
    var mole = document.getElementsByClassName("mole")[0];
    mole.removeEventListener("click", hole_click, false);
    mole.addEventListener("click", mole_click, false);
    is_over.innerHTML = "Playing";
}
function over() {
    is_start = false;
    clearInterval(interval);
    time.value = 0;
    var mole = document.getElementsByClassName("mole")[0];
    mole.className = "hole";
    mole.removeEventListener("click", mole_click, false);
    mole.addEventListener("click", hole_click, false);
    is_over.innerHTML = "Game over";
    box.className = "";
}

function time_cal() {
    time.value = time.value - 1;
    if(time.value == 0) {
        over();
        alert("Game over, and your score is:\n"+score.value);
        score.value = 0;
    }
}

window.onload = function () {
    creat_mole();
    box = document.getElementById("game_box");
    var game_start_stop = document.getElementById("start_and_stop");
    is_over = document.getElementById("game_over");
    time = document.getElementById("time");
    score = document.getElementById("score");
    var holes = document.getElementsByClassName("hole");
    var mole = document.getElementsByClassName("mole");

    game_start_stop.onclick = function () {
        if(is_start == false) {      //开始游戏
            is_start = true;
            box.className = "hammer";
            /*照片*/
            start();
        }else {                      //结束游戏
            score.value = 0;
            over();
        }
    }
};