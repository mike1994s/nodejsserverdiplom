//var app = require('http').createServer(handler)
var express  = require('express');
var app = express();
var http = require('http').createServer(app);
var path = require('path');
var config = require('./config');
 
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.static('Video'));
app.use(express.static('uploads'));
require('./app/routes.js')(app, http);
http.listen(config.get('port'));

 

require('./app/socket.js')(http);
