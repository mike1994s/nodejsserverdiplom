var User = require('../models/User').User;
var _VK_TYPE = "vk";
var _FB_TYPE = "fb";

function arrayNotContain(arr, str){
	return (arr.indexOf(str) <= -1);
}
function addArrayFromArray(acceptor,donor, acceptCb){
	donor.forEach(function(item, i, arr){
                        if (acceptCb(acceptor, item)){
                                acceptor.push(item);
                        }
             });
	return acceptor;
}
exports.post = function(req, res) {
    console.log("{/enter} have been called");
    console.log(req.body);
    var obj = req.body;
    
    console.log(obj.friendsId);
    var promise = User.findOne({idphone :obj.idphone}).exec();
    promise.then(function(user) {
	if (user == null){
		user = new User({
 			id_phone: obj.idphone,
  			fsm: obj.fsm,
		});
	}
	if (obj.type == _VK_TYPE){
		user.vk.id = obj.id;
		user.vk.friends = addArrayFromArray(user.vk.friends,
					 obj.friendsId,
					 arrayNotContain);
	}
	console.log(user);
	return user.save();
})
.then(function(user){
  	console.log(user +" was added");
         res.json({
		code : "1",
		answer : "ok",
		data : [{
			user : user,
		}],
  	 });

  	//return user.save();
})
.catch(function(err){
	console.log(err);
	res.json({
	       code : "0",
	       answer : err,
	       data : [],
});
    	});	
};
