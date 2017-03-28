var holes;
var timer = null;
var game_start, time, target, extra;
var score;
var error;


var r, g, b;        //holes color
var _r, _g, _b;     //color relative
var t_r, t_g, t_b;  //target color;
var holes_num = 144;    //12*12
var is_start = 0;
var movement = 0;

function creatholes() {
    var box = document.getElementById("game_box");
    for (var i = 0; i < holes_num; i++) {
        var hole = document.createElement("div");
        hole.className = "hole";
        box.appendChild(hole);
    }
    var shade = document.createElement("div");
    shade.id = "start_off";
    box.appendChild(shade);
    var tip = document.createElement("div");
    tip.id = "tips_off";
    box.appendChild(tip);
}

function target_extra_click() {
    score.value = parseInt(score.value) + 1;
    this.className = "hole";
    this.removeEventListener("click", target_extra_click, false);
    this.addEventListener("click", error_click, false);
    holes = document.getElementsByClassName("hole");
    var x = Math.ceil((holes.length-1) * Math.random());
    holes[x].className = "target";
    r = Math.floor(255 * Math.random());
    g = Math.floor(255 * Math.random());
    b = Math.floor(255 * Math.random());
    _r = Math.floor(16 * Math.random())+16;
    _g = Math.floor(16 * Math.random())+16;
    _b = Math.floor(16 * Math.random())+16;
    for (var i = 0; i < holes.length; i++) {
        holes[i].style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
    }
    var newtarget = document.getElementsByClassName("target")[0];
    newtarget.removeEventListener("click", error_click, false);
    newtarget.addEventListener("click", target_extra_click, false);
    t_r = r+_r>255 ? r-_r : r+_r;
    t_g = g+_g>255 ? g-_g : g+_g;
    t_b = b+_b>255 ? b-_b : b+_b;
    newtarget.style.backgroundColor = "rgb(" + t_r + "," + t_g + "," + t_b + ")";
    return newtarget;
}

function start_onclick() {
    score.value = 0;
    time.value = 30.0;
    timer = setInterval("time_through()", 100);
    var x = Math.ceil((holes.length - 1) * Math.random());
    holes[x].className = "target";
    for (var i = 0; i < holes.length; i++) {
        holes[i].addEventListener("click", error_click, false);
        holes[i].removeAttribute('style');                      //delete style in extra mode
    }
    target = document.getElementsByClassName("target")[0];
    target.removeAttribute('style');
    target.removeEventListener("click", error_click, false);
    target.addEventListener("click", target_onclick, false);
}

function extra_onclick() {                                      //extra mode
    score.value = 0;
    time.value = 30.0;
    timer = setInterval("time_through()", 100);
    var x = Math.ceil((holes.length - 1) * Math.random());
    holes[x].className = "target";
    r = Math.floor(255 * Math.random());
    g = Math.floor(255 * Math.random());
    b = Math.floor(255 * Math.random());
    _r = Math.floor(16 * Math.random()) + 16;
    _g = Math.floor(16 * Math.random()) + 16;
    _b = Math.floor(16 * Math.random()) + 16;
    t_r = r + _r > 255 ? r - _r : r + _r;
    t_g = g + _g > 255 ? g - _g : g + _g;
    t_b = b + _b > 255 ? b - _b : b + _b;
    for (var i = 0; i < holes.length; i++) {
        holes[i].addEventListener("click", error_click, false);
        holes[i].style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
    }
    target = document.getElementsByClassName("target")[0];
    target.removeEventListener("click", error_click, false);
    target.style.backgroundColor = "rgb(" + t_r + "," + t_g + "," + t_b + ")";
    target.addEventListener("click", target_extra_click, false);
}

function target_onclick() {
    if (is_start == 1) {
        score.value = parseInt(score.value) + 1;
        this.className = "hole";
        this.removeEventListener("click", target_onclick, false);
        this.addEventListener("click", error_click, false);
        holes = document.getElementsByClassName("hole");
        var x = Math.ceil((holes.length - 1) * Math.random());
        holes[x].className = "target";
        var newtarget = document.getElementsByClassName("target")[0];
        newtarget.removeEventListener("click", error_click, false);
        newtarget.addEventListener("click", target_onclick, false);
        return newtarget;
    }
}

function error_click() {
    if (is_start == 1) {
        error.id = "error";
        error.style.left = event.pageX - 10 + "px";
        error.style.top = event.pageY - 30 + "px";
        movement = 0;
        error_movement();
        setTimeout("error.id = 'error_off'", 400);
        if (score.value > 0) {
            score.value = parseInt(score.value) - 1;
        }
    }
}

function error_movement() {
    if (movement < 20) {
        error.style.top = parseInt(error.style.top) - 2 + "px";
        setTimeout("error_movement(); movement++", 20);
    }
}

function time_through() {
    time.value = (time.value - 0.1).toFixed(1);
    if (time.value == 0) {                              //game over
        clearInterval(timer);
        timer = null;
        time.value = 0;
        target = document.getElementsByClassName("target")[0];
        target.className = "hole";
        target.removeEventListener("click", target_onclick, false);
        target.removeEventListener("click", target_extra_click, false);
        target.addEventListener("click", error_click, false);
        is_start = 0;
        alert("Game over, and your score is:\n\n"+scores.value);
    }
}

window.onload = function() {
    creatholes();

    var shade = document.getElementById("start_off");
    var tip = document.getElementById("tips_off");
    game_start = document.getElementById("game_start");
    time = document.getElementById("time");
    target = document.getElementsByClassName("target")[0];
    extra = document.getElementById("extra_mode");
    score = document.getElementById("scores");
    holes = document.getElementsByClassName("hole");
    error = document.getElementById("error_off");

    game_start.onclick = function () {
        if (is_start == 0) {
            is_start = 1;
            shade.id = "start_on";
            tip.id = "tips";
            setTimeout(function() {
                tip.style.backgroundImage = "url(img/two.png)";
            }, 1000);
            setTimeout(function () {
                tip.style.backgroundImage = "url(img/one.png)";
            }, 2000);
            setTimeout(function () {
                tip.style.backgroundImage = "url(img/go.png)";
            }, 3000);
            setTimeout(function () {
                shade.id = "start_off";
                tip.style.backgroundImage = "url(img/three.png)";
                tip.id = "tips_off";
                start_onclick();
            }, 3500);
        } else {
            clearInterval(timer);
            timer = null;
            time.value = 0;
            target = document.getElementsByClassName("target")[0];
            target.className = "hole";
            target.removeEventListener("click", target_onclick, false);
            target.removeEventListener("click", target_extra_click, false);
            target.addEventListener("click", error_click, false);
            is_start = 0;
        }
    }
    
    extra.onclick = function () {
        if (is_start == 0) {
            is_start = 1;
            shade.id = "start_on";
            tip.id = "tips";
            setTimeout(function () {
                tip.style.backgroundImage = "url(img/two.png)";
            }, 1000);
            setTimeout(function () {
                tip.style.backgroundImage = "url(img/one.png)";
            }, 2000);
            setTimeout(function () {
                tip.style.backgroundImage = "url(img/go.png)";
            }, 3000);
            setTimeout(function () {
                shade.id = "start_off";
                tip.style.backgroundImage = "url(img/three.png)";
                tip.id = "tips_off";
                extra_onclick();
            }, 3500);
        }
    }
}
