var http = require('http');
var querystring=require("querystring");
var conf = require("./conf.json")
var emitter = require("./event").emitter;

var cookie ={};
var byr_url =conf.byr_url;
var headers = conf.headers;

var make_option= function(reqData){
    //console.log("make_option of mbyr_login");
    var options =
    {
        hostname: byr_url,
        port: 80,
        method: 'POST',
        path: '/user/login',
        headers:{
            "Accept":headers["Accept"],
            "Connection":headers["Connection"],
            "Content-Type":headers["Content-Type"],
            "User-Agent":headers["User-Agent"],
            "Host":headers["Host"],
            "Content-Length":reqData.length
        }
    };
    //console.log(options);
    return options;
}
var make_req = function(options,callback){
    return http.request(options, function (res) {
        res.on('data', function (chunk) {
            //console.log(chunk);
        })
        res.on('end', function () {
            var datas = res.headers["set-cookie"];
            for(var val in datas){
                var data  = datas[val].split(";");
                var temp = data[0].split("=");
                cookie[temp[0]]=temp[1];
            }
            //console.log("get register cookie:");
            //console.log(cookie);
            emitter.emit("getCookie");
            //console.log("send trigger : getCookie");
        });
    },true);
}

var getCookie = function(name,password,callback){
    /*输入参数 1.用户名 2.密码*/ //var arguments = process.argv.splice(2);
    var reqData=querystring.stringify({
        id:name,
        passwd:password
    });
    var options = make_option(reqData);
    var post_req = make_req(options,callback);
    post_req.write(reqData);
    post_req.end();
}

module.exports.getCookie =getCookie;
module.exports.cookie =cookie;







