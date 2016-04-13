var http = require('http');
var cheerio  = require("cheerio");
var Promise  = require("bluebird");

var byr_url = 'http://m.byr.cn';

function get_page_list(url){
	return new Promise(function(resolve,reject){
		console.log("get_page_list crawing "+url);
		http.get(byr_url,function(res){
			var html='';
			res.on('data',function(chunk){
				html+=chunk;
			})
			res.on('end',function(){
				var article_promises=[];
				var $ = cheerio.load(html);
    			$(".slist li:not(.f)").each(function(i,item){
    				var article_url = byr_url + $(item).find("a").attr("href");
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
		http.get(url,function(res){
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


get_page_list(byr_url)
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



