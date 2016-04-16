var fs = require('fs');

fs.readFile('sample.png',function(err,origin_buffer){
	console.log(Buffer.isBuffer(origin_buffer));
	fs.writeFile('sample_buffer.png',origin_buffer,function(err){
		if(err) console.log(err);
	})
	var base64Image = origin_buffer.toString('base64');

	console.log(base64Image);

	var decodedImage  = new Buffer(base64Image,'base64');

	fs.writeFile('loge_decoded.png',decodedImage,function(err){
		if(err) console.log(err);
	})
})
