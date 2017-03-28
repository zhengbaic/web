var puzzles, is_start, check_num, clear;//check_num是放位置的数组 也是检测位置的标准
/*提取数字*/
var which_num = {one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10, eleven:11, twelve:12, thirteen:13, fourteen:14, fifteen:15, sixteen:16.};
/*提取单词*/
var which_letter = [0, "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen"];
/*检测可行性 使用逆序数*/
var check = function(num){
    var count = 0;
    for(var i = 1; i < num.length; i++){ /*本来想用lodash，但是不知道怎么设置循环起点，而且设置后代码行数不变*/
        for(var j = 1; j < i; j++) {
            if(num[i] < num[j]) count++;
        }
    }
    return (count % 2 == 0);
};
/*生成*/
var init = function () {
    is_start = false;
    check_num = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    for(var i = 1; i < 16; i++) $("#"+which_letter[i]).attr("class", "puzzle " + which_letter[i]);
    $("#sixteen").attr("class", "blank sixteen");
};
/*打乱*/
var run = function () {
    is_start = true;
    do{
        init();
        is_start = true;
        var num = Math.floor(Math.random() * 15 + 1);//随机不超过十五次的交换
        for(var i = 0; i < num; i++) {
            var num1 = Math.floor(Math.random() * 15 + 1);
            var num2 = Math.floor(Math.random() * 15 + 1);
            var object1 = document.getElementById(which_letter[num1]);
            var object2 = document.getElementById(which_letter[num2]);
            swap(object1, object2);
        }
    }while(!check(check_num));
    start.innerHTML = "restart";
};
/*检测是否赢*/
var check_game = function (check_num) {
    for(var i = 1; i <= 15; i++) {
        if(check_num[i] != i) return false;
    }
    return true;
};
/*交换块的位置*/
var swap = function (o1, o2) {
    var id1 = o1.id;
    var id2 = o2.id;
    var pos1 = which_num[id1];
    var pos2 = which_num[id2];
    var temp_pos = check_num[pos1];
    check_num[pos1] = check_num[pos2];
    check_num[pos2] = temp_pos;
    var temp1 = o1.className.split(" ");
    var temp2 = o2.className.split(" ");
    o1.className = temp1[0] + " " + temp2[1];
    o2.className = temp2[0] + " " + temp1[1];
};

window.onload = function () {
    init();
    puzzles = document.getElementsByClassName("puzzle");
    $("#start").click(run);
    /*点击拼图寻找位置并移动*/
    for (var i = 0; i < puzzles.length; i++) {
        puzzles[i].onclick = function () {
            if (is_start == false) return;
            var that = this;
            var name1 = that.id;
            var pos1 = check_num[which_num[name1]];
            var pos2 = check_num[16];
            var ob2 = document.getElementById("sixteen");
            if(pos1 == 4||pos1 == 8||pos1 == 12){
                if(pos2 == pos1 - 1|| pos2 == pos1 + 4|| pos2 == pos1 - 4){
                    if(!(pos2 > 16||pos2 < 1))
                    swap(that, ob2);
                }
            }
            else if(pos1 == 5||pos1 == 9||pos1 == 13){
                if(pos2 == pos1 + 1|| pos2 == pos1 + 4|| pos2 == pos1 - 4){
                    if(!(pos2 > 16||pos2 < 1))
                        swap(that, ob2);
                }
            }else {
                if(pos2 == pos1 + 1|| pos2 == pos1 - 1|| pos2 == pos1 + 4|| pos2 == pos1 - 4){
                    if(!(pos2 > 16||pos2 < 1))
                        swap(that, ob2);
                }
            }
            if(check_game(check_num)) {
                alert("不可思议，我都没赢过~");
            }
        };
        /*双击出现数字序号*/
        puzzles[i].ondblclick = function () {
            clear = function () {that.innerHTML = '';};
            var that = this;
            if (!is_start) return;
            $("#game").attr("class", "double_click");
            this.innerHTML = which_num[this.id];
            setTimeout("clear()", 2000);
        }
    }
};
