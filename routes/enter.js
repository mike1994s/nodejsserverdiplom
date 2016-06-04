var User = require('../models/User').User;
exports.post = function(req, res) {
    console.log("{/enter} have been called");
    console.log(req.body);
    var obj = req.body;
    console.log(obj.friendsId);
    var newUser = new User({
 	id_phone: obj.idphone,
  	fsm: obj.fsm,

});
	console.log(newUser);
    var arr = [];
    console.log(obj.friendsId.length);


    for (var i = 0; i < obj.friendsId.length; ++i){
	arr.push({
	item : obj.type.toUpperCase(),
		id : obj.friendsId[i],
	});
    }

		
    newUser.socials.push({
		item : obj.type.toUpperCase(),
		id : obj.id});
     newUser.friends = arr;
	console.log(newUser);
	newUser.save(function(err) {
	  if (err) {
		console.log(err);
	  }
	
  	console.log('User saved successfully!');
	res.json({
		code : "1",
		answer : "ok",
		data : [],
   	});
    });
    /*User.findOne({ 'id_phone': obj.idphone }, function (err, docs) {
 		if (err){
			console.log(err);	
		}
		console.log(docs);
	});*/
   
  //  res.render('chat');
};
