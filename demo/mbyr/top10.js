var http = require('http');
var cheerio = require("cheerio");
var login = require("./login");
var emitter = require("./event").emitter;
var conf = require("./conf.json");

var arguments = process.argv.splice(2);
var name = arguments[0],pass = arguments[1];

var byr_url =conf.byr_url;
var headers = conf.headers;

var make_option = function(url,headers,cookie){
    //console.log("make_option of crawler_top10");
    var datas = [];
    for(var key in cookie){
        var temp = key +"="+cookie[key];
        datas.push(temp);
    }
    cookie =datas.join(";");
    var options =
    {
        hostname: url,
        headers: {
            "Accept":headers["Accept"],
            "Connection":headers["Connection"],
            "Content-Type":headers["Content-Type"],
            "User-Agent":headers["User-Agent"],
            "Host":headers["Host"],
            "Cookie":cookie
    }
    };
    //console.log(options);
    return options;
}

var get_top10 = function(html){
    var $ = cheerio.load(html);
    var toptens = [];
    $(".slist li:not(.f)").each(function(i,item){
        var top = $(item).find("a").text().trim();
        top && toptens.push(top);
    });
    return toptens;
}
var get_req =(function(url,headers,make_option){
    var html="";
    return function(cookie){
        var options = make_option(url,headers,cookie);
        http.get(options,function(res){
            res.on('data',function(chunk){
                html+=chunk;
            })
            res.on('end',function(){
                var list = get_top10(html);
                console.log(list);
            })
        }).on('error',function(){
            //console.log('error');
        })
    }
})(byr_url,headers,make_option);

emitter.on("getCookie",function(){
    //console.log("recieve trigger : getCookie");
    get_req(login.cookie);
});

login.getCookie(name,pass);


