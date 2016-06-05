var User = require('../models/User').User;
var _VK_TYPE = "vk";
var _FB_TYPE = "fb";
exports.post = function(req, res) {
    console.log("{/startgame} have been called");
    console.dir(req.image || req.file);
    var obj = req.body;
    res.json({
	code :"1",
	answer : "ok",
	data : [],
	});
};
