var dimensions = [];
function Strategy(){};
Strategy.prototype.calc = function(lhs, rhs){
	return 0;
}

function Dimension(width, height, path){
	this.width = width;
	this.height = height;
}
Dimension.prototype.getHeight = function(){
	return this.height;
};
Dimension.prototype.getWidth = function(){
	return this.width;
}
Dimension.prototype.getSquare = function(){
	return this.getWidth() * this.getHeight();
}

Dimension.prototype.getPerimeter = function(){
	return 2 * ( this.getHeight() +this.getWidth());
}

var SimpleStrategy = function(){}
SimpleStrategy.prototype = Object.create(Strategy.prototype);

SimpleStrategy.prototype.calc = function(lhsDim, rhsDim){
	var difSquare =Math.abs(lhsDim.getSquare() - rhsDim.getSquare());

	return difSquare;
}

function MapDimensionToPath(dim,path, strategy){
	this.dim = dim;
	this.path = path;
	this.strategy = strategy;
}
MapDimensionToPath.prototype.setStrategy = function(strategy){
	this.strategy = strategy;
}
MapDimensionToPath.prototype.getPath = function(){
	return this.path;
}


MapDimensionToPath.prototype.getDiff = function(dim){
	return Math.abs(this.strategy.calc(this.dim, dim));
}

function init(){
	var dimOne = new Dimension(320, 200);
	var dimSec = new Dimension(640, 400);
	dimensions.push(new MapDimensionToPath(dimOne, "320x200", new SimpleStrategy()));
	dimensions.push(new MapDimensionToPath(dimSec, "640x400", new SimpleStrategy()));
}
init();

module.exports = function(app){
    app.get('/', function(req, res){
	res.render('index');
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
		var dif =  dimensions[index].getDiff(newDim)
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
