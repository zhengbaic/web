var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

module.exports  = function (db) {
    var index = require('./routes/index')(db);
    var app = express();


// view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(session({
        resave: false,
        saveUninitialized: false,
        secret: 'this_is_my_secret_and_fuck_you_all',
        cookie: {maxAge: 66666666}
    }));
    app.use(express.static(path.join(__dirname, 'public')));

    var server = app.listen(3000, function () {
        var host = server.address().address;
        var port = server.address().port;

        console.log('zbc\'s app listening at http://127.0.0.1:%s', port);
    });

    //路由请求交给index处理
    app.use('/', index);

// catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

    return app;
};


//test
/*var mongodb = require('./db');
function User(user){
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};
module.exports = User;
User.prototype.save = function(callback) {
//存储用户信息
// 要存入数据库的用户文档
 var user = { name: this.name, password: this.password, email: this.email };
// 打开数据库
mongodb.open(function(err, db){ if(err){ return callback(err); }
// 读取 users 集合
db.collection('users', function(err, collection){ if(err){ mongodb.close(); return callback(err); }
// 将用户数据插入 users 集合
collection.insert(user,{safe: true}, function(err, user){ mongodb.close(); callback(err, user);
// /成功！返回插入的用户信息
 });
 });
 });
 };
 User.get = function(name, callback){
   //读取用户信息 //打开数据库
   mongodb.open(function(err, db){ if(err){ return callback(err); }
     //读取 users 集合
     db.collection('users', function(err, collection){ if(err){ mongodb.close(); return callback(err); }
       //查找用户名 name 值为 name文档
       collection.findOne({ name: name },function(err, doc){ mongodb.close(); if(doc){ var user = new User(doc); callback(err, user);
         //成功！返回查询的用户信息 }
         else { callback(err, null);//失败！返回null
            }
       });
       });
     });
   };
}*/
