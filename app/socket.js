var socketIO = require('socket.io');
var fs = require('fs');
var exec = require('child_process').exec;
var util = require('util');
var Files = {};
var GameModel = require('../models/Game').Game;

var ffmpeg = require('fluent-ffmpeg');
var numUsers = 0;
var dataGame =  require('./DataGame').DataGame;
   	function Game(idRoom){
		this.isActive = true;
		this.idRoom = idRoom;
		this.error = null;
		this.gameModel;	
		this.masterSocket = null;
		this.sockets = [];
	}
	Game.prototype.add = function(socket, isLead, gameModel){
		if (isLead == true){
			this.masterSocket = socket;
			this.gameModel = gameModel;
		}else {
			this.sockets.push(socket);
		}
	}
	var games = [];
	function getGameById(idRoom){
		for (var i = 0; i < games.length; ++i){
			if (games[i].idRoom == idRoom){
				return games[i];
			}
		}
		var game = new Game(idRoom);
		var lastIndex = games.push(game);
		return games[lastIndex - 1];
	}
	
	function addInCurrentOrCreateRoom(idRoom, socket, isLead, gameModel){
		var game = getGameById(idRoom);
		game.add(socket, isLead, gameModel);
		console.log(games.length);
	} 
module.exports = function(http){
	var io = socketIO.listen(http);
	io.sockets.on('connection', function (socket) {
		console.log("connection");
		 socket.on('handshake',function(user){
   			socket.join(user.id_room);
			socket.room = user.id_room;
			console.log(socket.room + "   " + user.vk_id);
			console.log(user.game);
			addInCurrentOrCreateRoom(socket.room, socket, user.is_lead, user.game);
		
			io.to(socket.room).emit('new user', user.vk_id + " has joined.");
		 })
		
		socket.on('start_game', function(data){
			var game = getGameById(socket.room);
			var data = {};
			data.file = game.gameModel.file.path;
			data.message = "start game";
			io.to(socket.room).emit('on_start_game',data);
		});

		socket.on('word', function(word){
			var game = getGameById(socket.room);
			var wordLowerCase = game.gameModel.word.toLowerCase(); 
			var prevWordLowerCase =word.toLowerCase();
			if (wordLowerCase == prevWordLowerCase){
				io.to(socket.room).emit('win', word);
			}else {
				io.to(socket.room).emit('word', word);
			}
			if (game.masterSocket == null){
				game.masterSocket.emit('estimate');
			}	
		})
	});
	
	return io;
};
