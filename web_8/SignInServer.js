/**
 * Created by bytrain on 2016/11/9.
 */
var http = require('http');
var fstream = require('fs');
var url = require('url');
var path = require('path');
var querystring = require('querystring');

var regular_check = {
    "Username" : /^[a-zA-Z]\w{5,17}$/,
    "Schoolid" : /^[1-9][0-9]{7}$/,
    "Phone" : /^[1-9][0-9]{10}$/,
    "Email" : /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
};
var FileType = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js':'text/javascript',
    '.txt': 'text/plain',
    '.jpeg' : 'image/jpeg',
    '.png': 'image/png',
    '.ico' : 'image/x-icon'
};
var FilePath = {
    '.html': 'html/',
    '.css': 'css/',
    '.js':'js/',
    '.txt': 'data/',
    '.jpeg' : 'image/',
    '.png': 'image/',
    '.ico' : 'image/'
};
/*将用户信息从url解析出来*/
var parseUser = function (string) {
    var user_pro = string.match(/Username=(.+)&Schoolid=(.+)&Phone=(.+)&Email=(.+)/);
    return {Username:user_pro[1], Schoolid: user_pro[2], Phone:user_pro[3], Email:user_pro[4]};
};
/*当post时对提交的表单数据进行检查， 如果都正确则添加用户并返回用户页面*/
var UserInfo = function (req, res) {
    console.log("检测到post操作");
    req.on("data", function (data) {
        var user = parseUser(decodeURIComponent(data));
        console.log("拿到用户信息:"+JSON.stringify(user));
        try{
            CheckValid(user);
            IsUserRepeated(user);
            AddUser(user);
            console.log("用户 "+user.Username+" 通过检测，已更新用户数据库，即将返回用户详情页");
            res.writeHead(301, {Location:'?username='+user.Username});
            res.end();
        }
        catch (error) {
            console.log("发生错误："+error.message);
            Register_page(res, user, error);
        }
    });
};
/*处理get文件需求*/
var SignInPage = function (request, response) {
    console.log("检测到get操作");
    var UserName = querystring.parse(url.parse(request.url).query).username;//解析用户名字，有则显现，无则显示注册页面
    var user = GetUserByName(UserName);
    if(user != undefined){
        console.log("从URL解析出用户信息"+JSON.stringify(user));
        ShowUser(response, user);
    }else {
        var pathname = path.parse(url.parse(request.url).pathname);
        var ext = pathname['ext'];
        var base = pathname['base'];
        console.log("从URL解析出请求的文件"+base);
        if(base.length == 0) Register_page(response, null, null);
        else if(base == "SignInServer.js") {
            response.writeHeader(200, {"Content-Type": "text/javascript"});
            response.write(fstream.readFileSync('./SignInServer.js'));
            response.end();
        }
        else {
            response.writeHeader(200, {"Content-Type": FileType[ext]});
            var data = fstream.readFileSync('./' + FilePath[ext] + base);
            response.write(data);
            response.end();
        }
    }
};
/*总服务器*/
var server = http.createServer(function(request, response) {
    request.setEncoding("utf-8");
    if(request.method == "POST") UserInfo(request, response);
    else if(request.method == "GET") SignInPage(request, response);
}).listen(8124);
console.log("Server is listening at 8124");
/*检查是否格式正确*/
function CheckValid(user) {
    var Errors = [];
    for(var item in user) {
        if(!regular_check[item].test(user[item])){
            var error = item+" is wrong format<br />";
            Errors.push(error);
        }
    }
    if(Errors.length >= 1) throw Error(Errors.join(" "));
}
/*拿到所有用户名单*/
function AllUsers() {
    fstream.openSync("./data/AllUser.txt",'a+', function(err, fd) {
        if(err)
            throw err;
    });
    var AllUser = [];
    var AllUserInfo = fstream.readFileSync("./data/AllUser.txt");
    if(AllUserInfo.length !== 0) {
        AllUser = JSON.parse(AllUserInfo);
    }
    return AllUser;
}
/*通过用户名字拿到用户*/
function GetUserByName(name) {
    var allusers = AllUsers();
    for(var i = 0; i < allusers.length; i++) {
        if(allusers[i]['Username'] === name) return allusers[i];
    }
}
/*增加用户*/
function AddUser(user) {
    var users = AllUsers();
    users.push(user);
    fstream.writeFileSync("./data/AllUser.txt", JSON.stringify(users));
}
/*判断是否用户属性与其他用户重复*/
function IsUserRepeated(user) {
    var Errors = [];
    var AllUser= AllUsers();
    for(var i = 0; i < AllUser.length; i++) {
        for(var item in user) {
            if(user[item] === AllUser[i][item]) {
                var error = item+" is repeated by other user<br />";
                Errors.push(error);
            }
        }
    }
    if(Errors.length >= 1) throw Error(Errors.join(" "));
}
/*动态生成用户信息网页*/
function ShowUser(res, user) {
    console.log("进入用户详情页，用户名："+ user.Username);
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write('<!DOCTYPE html>');
    res.write('<html>');
    res.write('<head>');
    res.write('<meta charset="UTF-8">');
    res.write('<title>User Page</title>');
    res.write('<link rel="stylesheet" type="text/css" href="../css/user.css" />');
    res.write('<link rel="icon"  href="favion.ico">');
    res.write('</head>');
    res.write('<body>');
    res.write('<h1>Welcome</h1>');
    res.write("<div id = 'box'>");
    res.write('<div id = "logo"></div>');
    res.write('<form action="/">');
    res.write('<div class = "inputcontainer"><input type="text" name="Username" disabled="disabled" value=');
    res.write("用户名："+user['Username']);
    res.write('>');
    res.write('</div>');

    res.write('<div class = "inputcontainer"><input type="text" name="Schoolid" disabled="disabled" value=');
    res.write("学号："+user['Schoolid']);
    res.write('>');
    res.write('</div>');

    res.write('<div class = "inputcontainer"><input type="text" name="Phone" disabled="disabled" value=');
    res.write("电话："+user['Phone']);
    res.write('>');
    res.write('</div>');

    res.write('<div class = "inputcontainer"><input type="text" name="Email" disabled="disabled" value=');
    res.write("邮箱："+user['Email']);
    res.write('>');
    res.write( '</div>');

    res.write('<input type="submit" value="退出">');
    res.write('</form>');
    res.write( '</div>');
    res.write('</body>');
    res.write('</html>');
    res.end();
}
/*动态生成用户注册网页*/
function Register_page(res, user , error) {
    console.log("进入用户注册页");
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write("<!DOCTYPE html>");
    res.write("<html lang='en'>");
    res.write("<head>");
    res.write('<meta charset="UTF-8">');
    res.write("<title>Sign in</title>");
    res.write('<link rel="stylesheet" href="SignIn.css">');
    res.write('<link rel="icon"  href="favion.ico">');
    res.write('<script type="text/javascript" src="jquery.js" charset="UTF-8"></script>');
    res.write('<script type="text/javascript" src="SignInClient.js" charset="UTF-8"></script>');
    res.write('<script type="text/javascript" src="SignInServer.js" charset="UTF-8"></script>');
    res.write("</head>");
    res.write("<body>");
    res.write("<h1>Register</h1>");
    res.write('<div id = "form_box">');
    res.write('<div id = "logo"></div>');
    res.write('<form action="SignInServer.js" method="post">');
    res.write('<div class = "inputcontainer">');
    res.write('<input type="text" name="Username" placeholder="用户名" value=');
    if(user) res.write(user.Username);
    res.write('>');
    res.write('<span class="error" id="UsernameError"></span>');
    res.write('</div>');
    res.write('<div class = "inputcontainer">');
    res.write('<input type="text" name="Schoolid" placeholder="学号" value=');
    if(user) res.write(user.Schoolid);
    res.write('>');
    res.write('<span class="error" id="SchoolidError"></span></div>');
    res.write('<div class = "inputcontainer"><input type="text" name="Phone" placeholder="电话" value=');
    if(user) res.write(user.Phone);
    res.write('>');
    res.write('<span class="error" id="PhoneError"></span></div>');
    res.write('<div class = "inputcontainer"><input type="text" name="Email" placeholder="邮箱" value=');
    if(user) res.write(user.Email);
    res.write('>');
    res.write( '<span class="error" id="EmailError"></span></div>');
    res.write('<input type="reset"><input type="submit"></form>');
    res.write('<div id = "error">');
    if(error) res.write(error.message);
    res.write('</div>');
    res.write('</div></body></html>');
    res.end();
}