var http = require('http');
var cheerio  = require("cheerio");
var Promise  = require("bluebird");
var emitter = require("./event").emitter;
var conf = require("./conf.json");
var login = require("./login");

var arguments = process.argv.splice(2);
var name = arguments[0],pass = arguments[1];
var byr_url =conf.byr_url;
var headers = conf.headers;

//TODO 采用login模块获取登陆cookie
var make_option = function(path,headers,cookie){
    //console.log("make_option of pages");
    var datas = [];
    for(var key in cookie){
        var temp = key +"="+cookie[key];
        datas.push(temp);
    }
    cookie =datas.join(";");
    var options =
    {
        hostname: byr_url,
        method: 'GET',
        path: path,
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

function get_page_list(options){
    return new Promise(function(resolve,reject){
        console.log("get_page_list crawing "+byr_url);
        http.get(options,function(res){
            var html='';
            res.on('data',function(chunk){
                html+=chunk;
            })
            res.on('end',function(){
                console.log("get_page_list end "+byr_url);
                var article_promises=[];
                var $ = cheerio.load(html);
                $(".slist li:not(.f)").each(function(i,item){
                    var article_url =  $(item).find("a").attr("href");
                    if(!article_url) return;
                    var article_promise = get_page_async(article_url);
                    article_promises.push(article_promise);
                });
                resolve(article_promises);
            })
        }).on('error',function(e){
            reject(e);
            console.log('error');
        })
    });
}

function get_page_async(url){
    return new Promise(function(resolve,reject){
        console.log("get_page_async crawing "+url);
        var options  = make_option(url,headers,login.cookie);
        console.log(options);
        http.get(options,function(res){
            var html='';
            res.on('data',function(chunk){
                html+=chunk;
            })
            res.on('end',function(){
                resolve(html);
            })
        }).on('error',function(e){
            reject(e);
            console.log('error');
        })
    });
}



emitter.on("getCookie",function(){
    //console.log("recieve trigger : getCookie");
    var options = make_option("",headers,login.cookie);
    get_page_list(options)
        .then(function(promise_lists){
            Promise
                .all(promise_lists).then(function(htmls){
                    htmls.forEach(function(html){
                        var $ = cheerio.load(html);
                        $("#m_main ul .f").each(function(i,item){
                            console.log($(item).text());
                        });
                        $("#m_main li .sp").each(function(i,item){
                            console.log(i+"楼:");
                            console.log($(item).text());
                        });
                    });
                })
        });
});

login.getCookie(name,pass);



