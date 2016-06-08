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
   	function Game(idRoom){
		this.isActive = true;
		this.idRoom = idRoom;
		this.masterSocket = null;
		this.sockets = [];
	}
	Game.prototype.add = function(socket, isLead){
		if (isLead == true){
			this.masterSocket = socket;
		}else {
			this.sockets.push(socket);
		}
	}
	var games = [];
	function getRoomById(idRoom){
		for (var i = 0; i < games.length; ++i){
			if (games[i].idRoom == idRoom){
				return games[i];
			}
		}
		var game = new Game(idRoom);
		var lastIndex = games.push(game);
		return games[lastIndex - 1];
	}
	
	function addInCurrentOrCreateRoom(idRoom, socket, isLead){
		var room = getRoomById(idRoom);
		//console.log(room);

		room.add(socket, isLead);
		//console.log(room);
		console.log(games.length);
	} 
	io.sockets.on('connection', function (socket) {
		console.log("connection");
		 socket.on('handshake',function(user){
   			socket.join(user.id_room);
			socket.room = user.id_room;
			console.log(socket.room + "   " + user.vk_id);
			addInCurrentOrCreateRoom(user.id_room, socket, user.is_lead);
			io.to(socket.room).emit('new user', user.vk_id + " has joined.");
		 })

		
	});
	
	return io;
};
