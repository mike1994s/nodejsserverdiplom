var User = require('../models/Game').Game;
var path = require('path')
var fs = require('fs');
var _VK_TYPE = "vk";
var _FB_TYPE = "fb"; 
exports.post = function(req, res) {
    console.log("{/startgame} have been called");
    req.pipe(req.busboy); 
    var nameRes = "";
    req.busboy.on('file', function (fieldname, file, filename) {
        	console.log("Uploading: " + filename); 
		var extens = path.extname(filename);
      	 	name = "file_user" + Date.now() + extens;
		nameRes = name;
 		var file_name = './uploads/' + name;
        	fstream = fs.createWriteStream(file_name);
        	file.pipe(fstream);
		fstream.on('close', function(){
			nameRes = name;
	        })
    });	
    req.busboy.on('field', function(fieldname, val) {
      console.log(fieldname + " " + val);
     req.body[fieldname] = val;
   });
    req.busboy.on('finish', function(){
	console.dir(req.body);
	console.log(nameRes);
	res.json({
		code :"1",
		answer : "ok",
		data : [{
			file : nameRes,
			}],
		});
   // next();
   });
           // res.redirect('back'); 
};
