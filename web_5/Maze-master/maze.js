// JavaScript source code

var dx = [0, 0, 1, -1];    //right left down up
var dy = [1, -1, 0, 0];
var height = 20;
var width = 30;
var startx = 1;
var starty = 0;
var endx = height - 2;
var endy = width - 1;

var is_start = 0;
var is_cheat = 0;

var wall = new Array();
for (var i = 0; i < height; i++) {
    wall[i] = new Array();
    for (var j = 0 ; j < width; j++) {
        wall[i][j] = null;
    }
}

function creatwalls() {                                 //creat height*weight walls
    var box = document.getElementById("maze_box");
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var walls = document.createElement("div");
            if (i == startx && j == starty) {
                walls.innerHTML = "S";
                walls.id = "start";
            }
            else if (i == endx && j == endy) {
                walls.innerHTML = "E";
                walls.id = "end";
            }
            else walls.className = "walls";
            box.appendChild(walls);
            wall[i][j] = walls;
        } 
    }
}

function maze_input() {
    path_input(startx, starty);
    while (wall[endx][endy-1].className != "path") {        //be sure that the path will cross to the end
        for (var i = 1; i < height-1; i++) {
            for (var j = 1; j < width-1; j++) {
                wall[i][j].className = "walls";
            }
        }
        path_input(1, 1);
    }
}

function path_input(x, y) {                                 //delete walls to create path by dfs
    if (x <= 0 || x >= height-1 || y <= 0 || y >= width-1) return;
    wall[x][y].className = "path";
    var num = 0, r = "check";
    for (i = 0; i < 4; i++) {
        if (wall[x + dx[i]][y + dy[i]].className == "path") {
            r += i;
            num++;
        }
        if (num > 1) {
            wall[x][y].className = "walls";
            return;
        }
    }
    var i = Math.ceil(Math.random() * 4)-1;
    while (r.length != 9) {
        while (r.indexOf(i) != -1) {
            i = Math.ceil(Math.random() * 4)-1;
        }
        r += i;
        if (x + dx[i] > 0 && x + dx[i] < height-1 && y + dy[i] > 0 && y + dy[i] < width-1) {
            path_input(x + dx[i], y + dy[i]);
        }
    }
}

window.onload = function () {
    creatwalls();
    maze_input();
    var box = document.getElementById("maze_box");
    var start = document.getElementById("start");
    var end = document.getElementById("end");
    var lost = document.getElementById("lost_no");
    var win = document.getElementById("win_no");
    var cheat = document.getElementById("cheat_no");
    var walls = document.getElementsByClassName("walls");

    start.onmouseover = function () {
        if (lost.id == "lost_no" && win.id == "win_no" && cheat.id == "cheat_no") {
            box.className = "onstart";
            is_start = 1;
        }
    }

    end.onmouseover = function () {
        if (is_start == 1) {
            if (is_cheat == 0) {
                win.id = "win_yes";
            } else {
                cheat.id = "cheat_yes";
            }
            is_start = 0;
            box.className = null;
        }
    }

    for (var i = 0; i < walls.length; i++) {
        walls[i].onmousemove = function () {
            if (is_start == 1) {
                this.className = "wall_onmove";
                lost.id = "lost_yes";
                box.className = null;
                is_start = 0;
            }
        }
    }

    box.onmouseout = function () {
        var x = event.pageX;
        var y = event.pageY;
        var divx1 = this.offsetLeft;
        var divy1 = this.offsetTop;
        var divx2 = this.offsetLeft + this.offsetWidth;
        var divy2 = this.offsetTop + this.offsetHeight;
        if (x <= divx1 || x >= divx2 || y <= divy1 || y >= divy2) {                     //check if the mouse is in the box
            if (is_start == 1) {
                is_cheat = 1;
            } else {
                win.id = "win_no";
                cheat.id = "cheat_no";
                if (lost.id == "lost_yes") {
                    document.getElementsByClassName("wall_onmove")[0].className = "walls";
                    lost.id = "lost_no";
                }
                is_cheat = 0;
                box.className = null;
            }
        }
    }


}