module.exports = function(app) {
    app.get('/', function(req, res) {
	res.send("ok");
    })
    app.post('/enter', require('./enter').post);

}
