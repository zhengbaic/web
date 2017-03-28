window.onload = function () {
    //全局
    var expression = document.getElementById("text");
    var Button = document.getElementsByClassName("button");

    //输入
    for(var i = 0; i < Button.length; ++i) {
        Button[i].onclick = function (event) {
            if(event.target.getAttribute("id") == "del"){//删除键
                if(expression.innerText.length != 0) {
                    var temp = expression.innerHTML;
                    expression.innerHTML = temp.substring(0, temp.length-1);
                    changeweight();
                }
            }
            else if(event.target.getAttribute("id") == "ce") {//ce键
                expression.innerHTML = "";
            }
            else if(event.target.getAttribute("id") == "equal"){//=键
                try{
                    var text = expression.innerHTML;
                    if(!check(text)) {
                        throw Error;
                    }
                    expression.innerText = eval(text);
                    expression.innerText = parseFloat(eval(text).toFixed(8));//处理小数问题，先四舍五入
                    changeweight();
                    if(expression.innerText == "Infinity") {
                        throw Error("zero");
                    }
                } catch (ex) {
                    if(ex.message == "zero") {
                        expression.innerText = "Wrong!";
                        alert("你可能将0作为除数了");
                    }
                    else {
                        expression.innerText = "Wrong!";
                        alert("非法表达式！");
                    }
                }
            }
            else {
                var	content = event.target.innerText;
                expression.innerText = expression.innerText + content;
                changeweight();
            }
        }
    }
};
//检查是否合法
function check(result) {
    for(var i = 1; i < result.length - 1; ++i) {
        if(is(result[i])) {
            return !is(result[i+1]);
        }
    }
    return true;
}
//判断是否符号
function is(s) {
    return (s == "+"||s == "-"||s == "*"||s == "/");
}
//改变字体
function changeweight() {
    var expression = document.getElementById("text");
    if(expression.innerText.length > 6) {
        expression.setAttribute("class", "change6");
    }
    else if(expression.innerText.length > 8) {
        expression.setAttribute("class", "change8");
    }
    else if(expression.innerText.length <= 6){
        expression.setAttribute("class", "");
    }
}

