var Dimension = require('./Dimension').Dimension;
var MapDimensionToPath = require('./Dimension').MapDimensionToPath;
var SimpleStrategy = require('./SimpleStrategy');
var dimensions = [];


function init(){
	var dimOne = new Dimension(320, 200);
	var dimSec = new Dimension(640, 400);
	dimensions.push(new MapDimensionToPath(dimOne, "320x200", new SimpleStrategy()));
	dimensions.push(new MapDimensionToPath(dimSec, "640x400", new SimpleStrategy()));
}
init();

module.exports = function(app, http){
    app.get('/', function(req, res){
		
		res.render('index');
    });
	app.get('/chat', function(req, res){
		res.render('chat');
	});
    app.get('/load/:w/:h/:video', function(req, res){
		var w = req.params.w;
		var h = req.params.h;
		var videoName = req.params.video;
		var newDim = new Dimension(w, h);
		var index;
		var len = dimensions.length;
		var dimAppropriate;
		var min = 10000000000;
		for (index = 0; index < len; ++index) {
			var dif =  dimensions[index].getDiff(newDim);
			console.log(dif);
			if (min >dif){
				
				min = dif;
				dimAppropriate = dimensions[index];
			}	
		};
//	req.flash('info', 'Flashed message')
		var strPath = dimAppropriate.getPath();
		res.redirect('/'+strPath + "/" + videoName);
    });
};
