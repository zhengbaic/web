var start_x = 0;
var start_y = 6;
var end_x = 11;
var end_y = 6;

var height = 8;
var width = 12;

function maze() {
    var maze = document.getElementById("maze");
    for(var i = 0; i < height; ++i){
        for(var j = 0; j < width; j++) {
            var wall = document.createElement("div");
            if(j == start_x&&i == start_y) {
                wall.id = "start";
                wall.innerHTML = "S";
            }
            else if(j == end_x&&i == end_y){
                wall.id = "end";
                wall.innerHTML = "E";
            }
            else if(i == 6&&(j == 1||j == 2||j == 9||j == 10)) wall.className = "path";
            else if(i == 1&&(j == 2||j == 3||j == 4||j == 5||j == 6||j == 7||j == 8||j == 9)) wall.className = "path";
            else if((j == 2||j == 9)&&(i == 1||i == 2||i == 3||i == 4||i == 5||i == 6)) wall.className = "path";
            else wall.className = "wall";
            maze.appendChild(wall);
        }
    }
}

window.onload = function () {
    maze();
    var box = document.getElementById("maze");
    var start = document.getElementById("start");
    var end = document.getElementById("end");
    var message = document.getElementById("message");
    var walls = document.getElementsByClassName("wall");
    var paths = document.getElementsByClassName("path");
    var is_on = false;
    var is_cheat = false;
    message.innerHTML = " ";

    start.onmouseover = function () {
        is_on = true;
        var walls_on = document.getElementsByClassName("wall_on");
        for(var i = 0; i < walls_on.length; i++) {
            walls_on[i].className = "wall";
        }
        message.innerHTML = " ";
        box.className = "start";
    };

    for(var i = 0; i < walls.length; i++) {
        walls[i].onmouseover = function () {
            if(is_on){
                this.className = "wall_on";
                is_on = false;
                message.innerHTML = "You lost!";
                box.className = "lost";
            }
        }
    }

    start.onmouseleave = function () {
        is_cheat = true;
    };
    for( i = 0; i < paths.length; i++) {
        paths[i].onmouseover = function () {
            is_cheat = false;
        }
    }

    end.onmouseover = function () {
        if(is_on) {
            if(is_cheat) message.innerHTML = "Don't cheat, you should start form the 'S' and move to the 'E' inside the maze!";
            else message.innerHTML = "You win!";
            box.className = "win";
        }
        is_on = false;
    }
};