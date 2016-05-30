var socketIO = require('socket.io');
var fs = require('fs');
var exec = require('child_process').exec;
var util = require('util');
var Files = {};

var ffmpeg = require('fluent-ffmpeg');
var numUsers = 0;
module.exports = function(http){
	var io = socketIO.listen(http);

    function Leader(socket, room){
		this.socket = socket;
		this.room = room; 
	}
	var socketsArr = [];
	io.sockets.on('connection', function (socket) {
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
				socketsArr.push(newUser);
			}
		}
		io.to(userID).emit('role', " with us new he is role " + socket.isLead);
		  // when the client emits 'new message', this listens and executes
		socket.on('new message', function (data) {
			console.log(data);
			// we tell the client to execute 'new message'
				socket.to(userID).emit('new message', {
					message: data
				});
		});
	});
	
	return io;
};
