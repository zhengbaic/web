/**
 * Created by bytrain on 2016/11/9.
 */

var regular_check = {
    "Username" : /^[a-zA-Z]\w{5,17}$/,
    "Schoolid" : /^[1-9][0-9]{7}$/,
    "Password":/(\w|\d|-){6,12}/,
    "Phone" : /^[1-9][0-9]{10}$/,
    "Email" : /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
};
var error = {
    "Username" : "请输入6到12位数的字母数字下划线,且请以字母开头",
    "Schoolid" : "请输入8位学号,第一位不能为0",
    "Password":"请输入6-12位的密码，可为字母数字下划线中划线",
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
    var error = $(".error");
    var errorMessages = "";
    $("input").trigger("blur");
    for(var i = 0; i < error.length; i++) {
        if(error[i].textContent != "") {
            var errorMessage = error[i].textContent + "<br />";
            errorMessages = errorMessages + errorMessage;
        }
    }
    if(errorMessages.length != 0) {
        e.preventDefault();
        $("#error").append(errorMessages);
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
var ConfirmPasswordBlurListen = function (e) {
    if($("input[name='ConfirmPassword']").val() != $("input[name='Password']").val())
        $("#" + e.target.name + "Error").html("两次输入密码不一致");
    else  $("#" + e.target.name + "Error").html("");
};
window.onload = function () {
    $("input[type=text]").on("click", InputClickListen).on("blur", InputBlurListen);
    $("input[name='Password']").on("click", InputClickListen).on("blur", InputBlurListen);
    $("input[type=submit]").on("click", SubmitClickListen);
    $("input[type=reset]").on("click", ResetClickListen);
    $("input[name='ConfirmPassword']").off("blur", InputBlurListen).on("blur",ConfirmPasswordBlurListen);
};
