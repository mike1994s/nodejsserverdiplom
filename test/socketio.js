var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://localhost:8090';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var chatUser1 = {'vk_id':'vk_id_first','id_room' : 'first', 'is_lead' : true };
var chatUser2 = {'vk_id':'vk_id_second', 'id_room' : 'first', 'is_lead' : false};
var chatUser3 = {'vk_id':'vk_id_third',   'id_room' : 'sec', 'is_lead' : true};

describe("Chat Server",function(){

it('Should broadcast new user to all users', function(done){
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
    /* Since first client is connected, we connect
    the second client. */
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

