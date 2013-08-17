var HEIGHT = 600;
var WIDTH = 600;
var DEFAULT_COLOR = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"];
var LEVEL = [
	{
		lines: [
			new Rect(0,HEIGHT/2, WIDTH,HEIGHT/2),
			new Rect(WIDTH/2,0, WIDTH/2,HEIGHT)
		],
		parts: [
			new Rect(0,0, WIDTH/2,150),
			new Rect(150,0, 300,150),
			new Rect(0,150, 150,300),
			new Rect(150,150, 300,300)
		]
	}
]
function getElmt(id){ return document.getElementById(id); }
function FCG(){
	this.cdom = getElmt('myfcg');
	this.ctx = this.cdom.getContext('2d');
	this.currentColor;
	this.currentLevel = 0;
}
FCG.prototype.line = function(x1,y1, x2,y2){
	this.ctx.moveTo(x1,y1);
	this.ctx.lineTo(x2,y2);
	this.ctx.strokeStyle = 'black';
	this.ctx.stroke();
}
FCG.prototype.drawLines = function(lines){
	var line;
	for (var i=0; i<lines.length; i++){
		line = lines[i];
		this.line(line.x1,line.y1, line.x2,line.y2);
	}
}
FCG.prototype.setColor = function (index){ this.currentColor = index; }
FCG.prototype.start = function (){
	var level = LEVEL[this.currentLevel];
	this.drawLines(level.lines);
}
FCG.prototype.calculatePosition = function(event){
	var x = event.x;
	var y = event.y;
	x -= this.cdom.offsetLeft;
	y -= this.cdom.offsetTop;
	return [x,y];
}
function Rect(x1,y1, x2,y2){
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
}