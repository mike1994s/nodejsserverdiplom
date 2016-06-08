var should = require('should');
var io = require('socket.io-client');
var Game = require('../models/Game').Game;

var socketURL = 'http://localhost:8090';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var chatUser1 = {'vk_id':'vk_id_first','id_room' : '5757dd3e5fd0a2ae6f881828', 'is_lead' : true };
var chatUser2 = {'vk_id':'vk_id_second', 'id_room' : '5757dd3e5fd0a2ae6f881828', 'is_lead' : false};
var chatUser3 = {'vk_id':'vk_id_third',   'id_room' : 'sec', 'is_lead' : true};
var chatUser4 = {'vk_id':'vk_id_fourth',   'id_room' : '5757dd3e5fd0a2ae6f881828', 'is_lead' : false};
describe("Chat Server",function(){

	it('BroadCast to Users', function(done){
	Game.findById('5757dd3e5fd0a2ae6f881828', function(err, model){
		if (err){
			err.should.equal("");
		}
	   chatUser1.game = model;
	   console.log(model);
	   var client1 = io.connect(socketURL);


	  client1.on('connect', function(data){
	    client1.emit('handshake', chatUser1);
	    console.log('after handshake');	
	    var client3 = io.connect(socketURL);

	    client3.on('connect', function(data){
	      client3.emit('handshake', chatUser3);
	    });

	    client3.on('new user', function(usersName){
	      usersName.should.equal(chatUser3.vk_id + " has joined.");
	      client3.disconnect();
	    });
	 
	    var client2 = io.connect(socketURL);

	    client2.on('connect', function(data){
	      client2.emit('handshake', chatUser2);
	    });

	    client2.on('new user', function(usersName){
	      usersName.should.equal(chatUser2.vk_id + " has joined.");
	      client2.disconnect();
	    });

	  });

	  var numUsers = 0;
	  client1.on('new user', function(usersName){
	    numUsers += 1;
	     console.log(usersName);  

	    if(numUsers === 2){ // проверка на то что отправляем только в указанную комнату
	      usersName.should.equal(chatUser2.vk_id + " has joined.");
	      client1.disconnect();
	      done();
	    }
	  });
	});
     });

     it('StartGame', function(done){
	Game.findById('5757dd3e5fd0a2ae6f881828', function(err, model){
		if (err){
			err.should.equal("");
		}
	   chatUser1.game = model;
	   console.log(model);
	   var client1 = io.connect(socketURL);


	  client1.on('connect', function(data){
	    client1.emit('handshake', chatUser1);
	 
	    var client2 = io.connect(socketURL);

	    client2.on('connect', function(data){
	      client2.emit('handshake', chatUser2);
	    });
              
            client2.on('on_start_game', function(data){
	      	data.file.should.equal("uploads/file-1465376062453.png");
		data.message.should.equal("start game");
		client1.disconnect();		      
		client2.disconnect();
	      	done();
	    });
	     
	  });

	  var numUsers = 0;
	  client1.on('new user', function(usersName){
	    numUsers += 1;
	     console.log(usersName);  

	    if(numUsers === 2){ // проверка на то что отправляем только в указанную комнату
	       client1.emit('start_game');
	    }
	  });
	});
     })

     it('Game Right Word', function(done){
	Game.findById('5757dd3e5fd0a2ae6f881828', function(err, model){
		if (err){
			err.should.equal("");
		}
	   chatUser1.game = model;
	   console.log(model);
	   var client1 = io.connect(socketURL);


	  client1.on('connect', function(data){
	    client1.emit('handshake', chatUser1);
	 
	    var client2 = io.connect(socketURL);

	    client2.on('connect', function(data){
	      client2.emit('handshake', chatUser2);
	    });
              
            client2.on('on_start_game', function(data){
	      	data.file.should.equal("uploads/file-1465376062453.png");
		data.message.should.equal("start game");
	 	client2.emit('word', 'MochaTestWord');
	    });

	    client2.on('word', function(data){
	      	data.file.should.equal("uploads/file-1465376062453.png");
		data.message.should.equal("start game");
		client2.disconnect();
	    });	     

	  });

	  var numUsers = 0;
	  client1.on('new user', function(usersName){
	    numUsers += 1;
	     console.log(usersName);  

	    if(numUsers === 2){ // проверка на то что отправляем только в указанную комнату
	       client1.emit('start_game');
	    }
	  });
	  
	  client1.on('win', function(word){
		word.should.equal('MochaTestWord');
		client1.disconnect();		      
		
	      	done();
	  });

	
	});
     })

it('Game Not Right Word', function(done){
	Game.findById('5757dd3e5fd0a2ae6f881828', function(err, model){
		if (err){
			err.should.equal("");
		}
	   chatUser1.game = model;
	   console.log(model);
	   var client1 = io.connect(socketURL);


	  client1.on('connect', function(data){
	    client1.emit('handshake', chatUser1);
	 
	    var client2 = io.connect(socketURL);

	    client2.on('connect', function(data){
	      client2.emit('handshake', chatUser2);
	    });
              
            client2.on('on_start_game', function(data){
	      	data.file.should.equal("uploads/file-1465376062453.png");
		data.message.should.equal("start game");
	 	client2.emit('word', 'MochaTestWordTest');
	    });

	    client2.on('word', function(data){
	       
		client2.disconnect();
	    });	  
		
	var client4 = io.connect(socketURL);

	    client4.on('connect', function(data){
	      client4.emit('handshake', chatUser4);
	    });
              
            client4.on('on_start_game', function(data){
	      	data.file.should.equal("uploads/file-1465376062453.png");
		data.message.should.equal("start game"); 
	    });

	    client4.on('word', function(word){
	       word.should.equal('MochaTestWordTest');
	       client4.disconnect();
	    });	        

	  });
	
	 
 

	  var numUsers = 0;
	  client1.on('new user', function(usersName){
	    numUsers += 1;
	     console.log(usersName);  

	    if(numUsers === 3){ // проверка на то что отправляем только в указанную комнату
	       client1.emit('start_game');
	    }
	  });
	  
	  client1.on('win', function(word){
		word.should.equal('MochaTestWord');
		client1.disconnect();		      
	      	done();
	  });
	
	});
     })

});
