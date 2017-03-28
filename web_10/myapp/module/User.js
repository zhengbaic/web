/**
 * Created by bytrain on 2016/12/14.
 */
var md5 = require('md5');

module.exports = function(db){
    var users = db.collection('users');

    var handler = {
        CreatUser:function (user) {
            user.Password = md5(user.Password);
            return users.insertOne(user);
        },

        FindUser:function (name, password) {
            return users.findOne({Username:name}).then(function (user) {
                var error = {};
                if(user) {
                    if(user.Password === md5(password)){
                        return Promise.resolve(user);
                    }else {
                        error.Username = "";
                        error.Password = "密码错误";
                        return Promise.reject(error);
                    }
                }else {
                    error.Username = "用户名不存在";
                    error.Password = "";
                    return Promise.reject(error);
                }
            });
        },

        CheckUser:function (user){
            var error = CheckFormat(user);
            if(!isEmptyObject(error)) {
                return Promise.reject(error);
            }else {
                error = {};
                var tasks = [];
                for (var item in user) {
                    if(item == "Password"||item == "ConfirmPassword") continue;
                    (function (item) {
                        var query = {};
                        query[item] = user[item];
                        tasks.push(users.findOne(query).then(function (user) {
                            if(user) error[item] = "该项信息与其他用户冲突，请更换";
                        }));
                    })(item);
                }
                return Promise.all(tasks).then(function () {
                    console.log(error);
                    if(!isEmptyObject(error)) {
                        return Promise.reject(error);
                    }
                    else return Promise.resolve(user);
                });
            }
        }
    };
    return handler;
};

function CheckFormat(user) {
    var regular_check = {
        "Username" : /^[a-zA-Z]\w{5,17}$/,
        "Schoolid" : /^[1-9][0-9]{7}$/,
        "Password":/(\w|\d|-){6,12}/,
        "Phone" : /^[1-9][0-9]{10}$/,
        "Email" : /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
    };
    var error_format = {
        "Username" : "请输入6到12位数的字母数字下划线,且请以字母开头",
        "Schoolid" : "请输入8位学号,第一位不能为0",
        "Password":"请输入6-12位的密码，可为字母数字下划线中划线",
        "Phone" : "请输入11位手机号码,第一位不能为0",
        "Email" : "请输入正确的邮箱地址"
    };
    var error = {};
    for(var item in user){
        if(item != "ConfirmPassword"){
            if(!regular_check[item].test(user[item])){
                error[item] = error_format[item];
            }
        }
    }
    if(user.Password != user.ConfirmPassword){
        error.ConfirmPassword = "两次密码不一致";
    }
    return error;
}
function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}