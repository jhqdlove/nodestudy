var http = require('http');
var cheerio    = require("cheerio");

var byr_url = 'http://m.byr.cn';
var html='';

function filterHtml(html){
    var $ = cheerio.load(html);
    var toptens = [];
    $(".slist li:not(.f)").each(function(i,item){
    	var top = $(item).find("a").text().trim();
    	toptens.push(top);
    });
    return toptens;
}

http.get(byr_url,function(res){
	res.on('data',function(chunk){
		html+=chunk;
	})
	res.on('end',function(){
		console.log(filterHtml(html));
	})
   }).on('error',function(){
	console.log('error');
   })

