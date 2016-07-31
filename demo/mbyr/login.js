var http = require('http');
var querystring=require("querystring");

/*输入参数 1.用户名 2.密码*/
var arguments = process.argv.splice(2);

var reqData=querystring.stringify({
    id:arguments[0],
    passwd:arguments[1]
});
var byr_url = 'm.byr.cn';

var options =
{
    hostname: byr_url,
    port: 80,
    method: 'POST',
    path: '/user/login',
    headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        'Connection': "keep-alive",
        'Content-Type': "application/x-www-form-urlencoded",
        'Content-Length': reqData.length,
        Host:byr_url,
        'User-Agent':"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36"
    }
};


    var post_req = http.request(options, function (res) {
        var responseText = "";
        res.on('data', function (data) {
            responseText += data;
        });
        res.on('end', function () {
            cookie = res.headers["set-cookie"];
            var datas = {};
            for(var val in cookie){
                var data  = cookie[val].split(";");
                var temp = data[0].split("=");
                datas[temp[0]]=temp[1];
            }
            cookie = datas;
            console.log(cookie);
        });
    });

    post_req.write(reqData);
    post_req.end();







