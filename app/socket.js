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

    function Leader(socket, room){
		this.socket = socket;
		this.room = room; 
	}
	var socketsArr = [];
	
	function getSocketLeadByRoom(idRoom){
		for (var i = 0; i < socketsArr.length; ++i){
			if (socketsArr[i].room = idRoom){
				return socketsArr[i].socket;
			}
		}
		return null;
	}
	
	io.sockets.on('connection', function (socket) {
		console.log("connection");
		function parseCookies () {
			console.dir(socket.request.headers.cookie);
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
			var newUser = new Leader(socket, userID);
			if (socket.isLead  == '1'){
				dataGame.addRoom(userID);
				socketsArr.push(newUser);
			}
		}
		   // when the client emits 'new message', this listens and executes
		socket.on('var', function(msg){
			var masterSocket = getSocketLeadByRoom(userID);
			console.log(userID);
			if (masterSocket == null){
				socket.leave(userID);
			}else {
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
	});
	
	return io;
};
