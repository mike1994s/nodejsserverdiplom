var socketIO = require('socket.io');
var fs = require('fs');
var exec = require('child_process').exec;
var util = require('util');
var Files = {};

var ffmpeg = require('fluent-ffmpeg');
var numUsers = 0;
var dataGame =  require('./DataGame').DataGame;
module.exports = function(http){
	var io = socketIO.listen(http);
	var cashWords = {};
    function Leader(socket, room){
		this.socket = socket;
		this.room = room; 
	}
	var socketsArr = [];
	
	function getMediaDataWithRoom(idRoom){
		var allGames = dataGame.get();
		for (var i = 0; i < allGames.length;++i){
			if (allGames[i].leader == idRoom){
				return allGames[i].media.fileName;
			}
		}
	}
	function getRightWordForRoom(idRoom){
		/*if (idRoom in cashWords){
			return cashWords[idRoom];
		} */
		var allGames = dataGame.get();
		for (var i = 0; i < allGames.length;++i){
			if (allGames[i].leader == idRoom){
				cashWords[idRoom] = allGames[i].word;
				return cashWords[idRoom];
			}
		}
	}
	function getSocketLeadByRoom(idRoom){
		for (var i = 0; i < socketsArr.length; ++i){
			if (socketsArr[i].room = idRoom){
				return socketsArr[i].socket;
			}
		}
		return null;
	}
	function resetLeadByRoom(idRoom){
		 socketsArr = socketsArr.filter(function (el) {
                      return el.room != idRoom;
			 });
	}
	io.sockets.on('connection', function (socket) {
		console.log("connection");
		function parseCookies () {
			//console.dir(socket.request.headers.cookie);
            var list = {},
                rc = socket.request.headers.cookie;

            rc && rc.split(';').forEach(function( cookie ) {
                var parts = cookie.split('=');
                list[parts.shift().trim()] = unescape(parts.join('='));
            });
            return list;
        }
        var cookies = parseCookies();
		socket.isLead = cookies['isLead'] || '0';
		var userID = cookies['user'];
		console.log('user ID' + userID);
		if ( userID != undefined){
			socket.join(userID);
			socket.room = userID;
			var file = getMediaDataWithRoom(userID);
			
			socket.emit("media", file);
			socket.to(userID).emit("media", file);
			var newUser = new Leader(socket, userID);
			if (socket.isLead  == '1'){
				dataGame.addRoom(userID);
				resetLeadByRoom(userID);
				socketsArr.push(newUser);
			}
			socket.to(userID).emit('new_user', {
				isLead : socket.isLead,
				text : "text"
			});
		}
		   // when the client emits 'new message', this listens and executes
		function sendWin(socket, msg){
			resetLeadByRoom(socket.room);
			socket.to(userID).emit('word_win', msg);
			socket.emit('word_win', msg);
			socket.emit('you_win', msg);
			console.log('Sended all message');
		}
		socket.on('var', function(msg){
			var masterSocket = getSocketLeadByRoom(userID);
			var wordRight = getRightWordForRoom(userID);
			if (msg == wordRight){
				sendWin(socket, msg);
			}
			console.log(userID);
			if (masterSocket == null){
				sendWin(socket, "external error");
			}else {
			//	console.dir(masterSocket);
				console.log("send msg estimate");
				masterSocket.emit("estimate", msg);
			}
			socket.to(userID).emit('var', msg);
		});
		socket.on('word_good', function(msg){
			socket.to(userID).emit('word_good', msg);
		});
		socket.on('word_bad', function(msg){
			socket.to(userID).emit('word_bad', msg);
		});
		socket.on('word_win', function(msg){
			sendWin(socket, msg);
		});
		socket.on('exit', function(msg){
			
			console.log('exit from rooom  = ' + userID);
		//	socket.leave(userID);
		});
	});
	
	return io;
};
