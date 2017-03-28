var express = require('express');
var url = require('url');
var path = require('path');
var querystring = require('querystring');

module.exports = function (db) {
    var router = express.Router();
    var userManager = require("../module/User")(db);
    var users = db.collection("users");

    // "/" router
    router.get('/', function(req, res, next) {
        console.log("init page");
        console.log("session:");
        console.log(req.session.user);
        console.log("cookie:");
        console.log(res.cookie["User"]);
        var username = querystring.parse(url.parse(req.url).query).Username;
        console.log("username parsed:");
        console.log(username);
        if(req.session.user){
            if(username && req.session.user.Username === username) {
                res.redirect('/detail');
            }else if(username && req.session.user.Username != username){
                res.render('user',{user: req.session.user, message:"无权限访问其他用户数据"});
            }else res.redirect('/detail');
        }else if(res.cookie["User"]){
            if(username && res.cookie["User"].Username === username) {
                res.redirect('/detail');
            }else if(username && res.cookie["User"].Username != username){
                res.render('user',{user: res.cookie["User"], message:"无权限访问其他用户数据"});
            }else res.redirect('/detail');
        }else res.redirect('/signin');
    });
    //sign in router
    router.get('/signin', function(req, res, next) {
        console.log("signin page");
        return res.render('signin',{user:{}, error:{}});
    });
    //regist router
    router.get('/regist', function(req, res, next) {
        console.log("regist page");
        return res.render('signup', {user:{}, error:{}});
    });
    //user router
    router.get('/detail', function(req, res, next){
        console.log("detail page");
        console.log("session:");
        console.log(req.session.user);
        console.log("cookie:");
        console.log(res.cookie["User"]);
        if(req.session.user)
            res.render('user', {user: req.session.user});
        else if(res.cookie['User'])
            res.render('user', {user: res.cookie['User']});
        else
            res.redirect('/regist');
    });

    router.get('/signout',function (req,res, next) {
        console.log("sign out");
        delete req.session.user;
        delete res.cookie['User'];
        res.cookie.maxAge = 0;
        res.cookie.expires = -1;
        res.clearCookie('User');
        console.log("session:");
        console.log(req.session.user);
        console.log("cookie:");
        console.log(res.cookie['User']);
        res.redirect('/signin');
    });

    router.post('/regist', function (req, res, next) {
        console.log("regist post");
        var user = req.body;
        userManager.CheckUser(user).then(function (user) {
            delete user.ConfirmPassword;
            userManager.CreatUser(user).then(function () {
                delete user.password;
                req.session.user = user;
                res.cookie.maxAge = 66666666;
                res.cookie['User'] = user;
                console.log("get user");
                console.log(user);
                res.redirect("/detail");
            });
        }).catch(function (err) {
            res.render('signup', {error: err});
        });
    });

    router.post('/signin', function (req, res, next) {
        console.log("signin post");
        var user = req.body;
        return userManager.FindUser(user.Username, user.Password).then(function (user) {
            delete user.ConfirmPassword;
            delete user.password;
            req.session.user = user;
            res.cookie.maxAge = 66666666;
            res.cookie['User'] = user;
            res.redirect('/detail');
        }).catch(function (error) {
            console.log(error);
            res.render('signin', {error: error});
        });
    });

    return router;
};
