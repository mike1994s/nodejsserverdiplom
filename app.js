//var app = require('http').createServer(handler)
var express  = require('express');
var app = express();
var http = require('http').createServer(app);

app.set('view engine', 'ejs');
app.use(express.static('Video'));

require('./app/routes.js')(app);

http.listen(8090);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

require('./app/socket.js')(http);
