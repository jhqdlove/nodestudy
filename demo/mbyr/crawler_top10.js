var http = require('http');
var cheerio    = require("cheerio");

var byr_url = 'm.byr.cn';
//TODO 采用login模块获取登陆cookie
var cookie="";
var html='';

function get_top10(html){
    var $ = cheerio.load(html);
    var toptens = [];
    $(".slist li:not(.f)").each(function(i,item){
        var top = $(item).find("a").text().trim();
        toptens.push(top);
    });
    return toptens;
}
var options =
{
    hostname: byr_url,
    headers :{
        Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        Connection:"keep-alive",
        Cookie:cookie,
        Host:byr_url,
        'User-Agent':"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.3"
    }
}
http.get(options,function(res){
    res.on('data',function(chunk){
        html+=chunk;
    })
    res.on('end',function(){
        console.log(get_top10(html));
    })
}).on('error',function(){
    console.log('error');
})

