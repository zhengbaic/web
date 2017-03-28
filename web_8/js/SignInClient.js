/**
 * Created by bytrain on 2016/11/9.
 */

var regular_check = {
    "Username" : /^[a-zA-Z]\w{5,17}$/,
    "Schoolid" : /^[1-9][0-9]{7}$/,
    "Phone" : /^[1-9][0-9]{10}$/,
    "Email" : /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
};
var error = {
    "Username" : "请输入6到12位数的字母数字下划线,且请以字母开头",
    "Schoolid" : "请输入8位学号,第一位不能为0",
    "Phone" : "请输入11位手机号码,第一位不能为0",
    "Email" : "请输入正确的邮箱地址"
};

var InputClickListen = function (e) {
    $("#" + e.target.name + "Error").html("");
};

var InputBlurListen = function (e) {
    if(!check(e)) $("#" + e.target.name + "Error").html(error[e.target.name]);
};

var SubmitClickListen = function (e) {
    var CheckInput = $("input[type=text]");
    var name, val;
    for(var i = 0; i < CheckInput.length; i++) {
        name = CheckInput[i].name; val = CheckInput[i].value;
        if(!regular_check[name].test(val)){
            e.preventDefault();
            alert(error[name]);
            break;
        }
    }
};

var ResetClickListen = function (e) {
    $("input[type=text]").each(function () {
        this.value = "";
    })
};
var check = function (e) {
    var val = e.target.value;
    return regular_check[e.target.name].test(val);
};

window.onload = function () {
    console.log("11");
    $("input[type=text]").on("click", InputClickListen).on("blur", InputBlurListen);
    $("input[type=submit]").on("click", SubmitClickListen);
    $("input[type=reset]").on("click", ResetClickListen);
};
