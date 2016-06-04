var mongoose = require('libs/mongoose');
var Schema = mongoose.Schema;
var schema =  new Schema({
    name: {
        type: String,
	default : "",
    },
    id_phone {
         type: String,
    }
   socials : [{
      item: {
        	type : String,
	        enum : ['VK', 'FB'],
	        default: 'VK',
      },
      id {
	type : String,
     },   	
  }],
   friends : [{
      item: {
        	type : String,
	        enum : ['VK', 'FB'],
	        default: 'VK',
      },
      id {
	type : String,
     },   	
  }],

});
exports.User = mongoose.model('User', schema); 
