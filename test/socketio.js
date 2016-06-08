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
	  
	   var client1 = io.connect(socketURL);


	  client1.on('connect', function(data){
	    client1.emit('handshake', chatUser1);
	  
	    var client3 = io.connect(socketURL);

	    client3.on('connect', function(data){
	      client3.emit('handshake', chatUser3);
	    });

	    client3.on('new user', function(data){
	      data.message.should.equal(chatUser3.vk_id + " has joined.");
	      data.id.should.equal(chatUser3.vk_id);
	     data.vks.length.should.equal(0);
	      client3.disconnect();
	    });
	 
	    var client2 = io.connect(socketURL);

	    client2.on('connect', function(data){
	      client2.emit('handshake', chatUser2);
	    });

	    client2.on('new user', function(usersName){
              data.message.should.equal(chatUser2.vk_id + " has joined.");
	      data.id.should.equal(chatUser2.vk_id);
	    	 data.vks.length.should.equal(1);
	      client2.disconnect();
	    });

	  });

	  var numUsers = 0;
	  client1.on('new user', function(data){
	    numUsers += 1;
	     

	    if(numUsers === 2){ // проверка на то что отправляем только в указанную комнату
	      data.message.should.equal(chatUser2.vk_id + " has joined.");
	      data.id.should.equal(chatUser2.vk_id);
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
	     
		client2.disconnect();
	    });	     

	  });

	  var numUsers = 0;
	  client1.on('new user', function(usersName){
	    numUsers += 1;
	   
	    if(numUsers === 2){ // проверка на то что отправляем только в указанную комнату
	       client1.emit('start_game');
	    }
	  });
	  
	  client1.on('win', function(data){
		data.word.should.equal('MochaTestWord');
		data.vk.should.equal('vk_id_second');
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

	    client4.on('word', function(data){
	      data.word.should.equal('MochaTestWordTest');
	      data.vk.should.equal('vk_id_second');
	       client4.disconnect();
	    });	        

	  });
	
 

	  var numUsers = 0;
	  client1.on('new user', function(usersName){
	    numUsers += 1;
	     

	    if(numUsers === 3){ // проверка на то что отправляем только в указанную комнату
	       client1.emit('start_game');
	    }
	  });
	  
	  client1.on('word', function(data){
		data.word.should.equal('MochaTestWordTest');
		 data.vk.should.equal('vk_id_second');
		client1.disconnect();		      
	      	done();
	  });
	
	});
     })


    it('Game Better Word', function(done){
	Game.findById('5757dd3e5fd0a2ae6f881828', function(err, model){
		if (err){
			err.should.equal("");
		}
	   chatUser1.game = model;
	  
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
	 	client2.emit('word', 'MochaTestWordTestBetter');
	    });

	    client2.on('better_word', function(word){
	           word.should.equal('MochaTestWordTestBetter');
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

	    client4.on('word', function(data){
	       data.word.should.equal('MochaTestWordTestBetter');
	        data.vk.should.equal('vk_id_second');
	        
	    });	        
		
	     client4.on('better_word', function(word){
	       	word.should.equal('MochaTestWordTestBetter');
	    	client4.disconnect();	
		done();
	    });

	  });
	
 

	  var numUsers = 0;
	  client1.on('new user', function(usersName){
	    numUsers += 1;
	 
	    if(numUsers === 3){ // проверка на то что отправляем только в указанную комнату
	       client1.emit('start_game');
	    }
	  });
	  
 
	  
	 client1.on('estimate', function(data){
		 
		data.word.should.equal('MochaTestWordTestBetter');
		data.vk.should.equal('vk_id_second');
		client1.emit('better', data.word );
		client1.disconnect();			      
	      	
	  });

	});
     })


it('Game Worse Attempt Word', function(done){
	Game.findById('5757dd3e5fd0a2ae6f881828', function(err, model){
	if (err){
		err.should.equal("");
	}
	   chatUser1.game = model;
	  
	   var client1 = io.connect(socketURL);

	   var worseWord = "WorseWord";
	  client1.on('connect', function(data){
	    client1.emit('handshake', chatUser1);
	 
	    var client2 = io.connect(socketURL);

	    client2.on('connect', function(data){
	      client2.emit('handshake', chatUser2);
	    });
              
            client2.on('on_start_game', function(data){
	      	data.file.should.equal("uploads/file-1465376062453.png");
		data.message.should.equal("start game");
	 	client2.emit('word', worseWord);
	    });

	    client2.on('worse_word', function(word){
	          word.should.equal(worseWord);
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

	    client4.on('word', function(data){
	       data.word.should.equal(worseWord);
	       data.vk.should.equal('vk_id_second');
	    });	        
		
	    client4.on('worse_word', function(word){
			
	       		word.should.equal(worseWord);
	    		client4.disconnect();	
			done();
	    });

	  });
	
 

	  var numUsers = 0;
	  client1.on('new user', function(usersName){
	    numUsers += 1;
	      

	    if(numUsers === 3){ // проверка на то что отправляем только в указанную комнату
	       client1.emit('start_game');
	    }
	  });
	  
	 
	 client1.on('estimate', function(data){
		 
		data.word.should.equal(worseWord);
		client1.emit('worse', data.word);
		client1.disconnect();		      
	      	
	  });

	});
     })


   it('Game Win Attempt Word', function(done){
	Game.findById('5757dd3e5fd0a2ae6f881828', function(err, model){
	if (err){
		err.should.equal("");
	}
	   chatUser1.game = model;
	  
	   var client1 = io.connect(socketURL);

	   var winWord = "WinWord";
	  client1.on('connect', function(data){
	    client1.emit('handshake', chatUser1);
	 
	    var client2 = io.connect(socketURL);

	    client2.on('connect', function(data){
	      client2.emit('handshake', chatUser2);
	    });
              
            client2.on('on_start_game', function(data){
	      	data.file.should.equal("uploads/file-1465376062453.png");
		data.message.should.equal("start game");
	 	client2.emit('word', winWord);
	    });

	    client2.on('better_word', function(word){
	          word.should.equal(winWord);
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

	    client4.on('word', function(data){
	       data.word.should.equal(winWord);
	       data.vk.should.equal('vk_id_second');
	        
	    });	        
		
		client4.on('win', function(data){
	       		data.word.should.equal(winWord);
			data.vk.should.equal('vk_id_second');
	    		client4.disconnect();	
			done();
	    });

	  });
	
 

	  var numUsers = 0;
	  client1.on('new user', function(usersName){
	    numUsers += 1;
	  
	    if(numUsers === 3){ // проверка на то что отправляем только в указанную комнату
	       client1.emit('start_game');
	    }
	  });
	  
	 
	 client1.on('estimate', function(data){
		 
		data.word.should.equal(winWord);
		
		client1.emit('winner',{ word : data.word,vk : data.vk});
		client1.disconnect();		      
	      	
	  });

	});
     })	

});

