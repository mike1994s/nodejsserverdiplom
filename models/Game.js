var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;
var schema =  new Schema({
	id_phone : String,
	word : String,
	file : String,  
});

exports.Game = mongoose.model('Game', schema); 
