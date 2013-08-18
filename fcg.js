var HEIGHT = 550;
var WIDTH = 600;
var DEFAULT_COLOR = ["#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00"];
var LEVEL = [
	{
		lines: [
			new Rect(0,HEIGHT/2, WIDTH,HEIGHT/2),
			new Rect(WIDTH/2,0, WIDTH/2,HEIGHT)
		],
		parts: [
			new Rect(0,0, WIDTH/2,HEIGHT/2),
			new Rect(WIDTH/2,0, WIDTH,HEIGHT/2),
			new Rect(0,HEIGHT/2, WIDTH/2,HEIGHT),
			new Rect(WIDTH/2,HEIGHT/2, WIDTH,HEIGHT)
		],
		neighbours: [
			[0, 1, 1, 1],
			[1, 0, 1, 1],
			[1, 1, 0, 1],
			[1, 1, 1, 0]
		]
	}
]
function getElmt(id){ return document.getElementById(id); }
function FCG(){
	this.cdom = getElmt('myfcg');
	this.ctx = this.cdom.getContext('2d');
	this.currentColor = 0;
	this.currentLevel = 0;
}
FCG.prototype.line = function(x1,y1, x2,y2){
	this.ctx.moveTo(x1,y1);
	this.ctx.lineTo(x2,y2);
	this.ctx.lineWidth = 1;
	this.ctx.strokeStyle = '#bbb';
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
FCG.prototype.fillPart = function (index){
	var parts = LEVEL[this.currentLevel].parts;
	this.ctx.fillStyle = DEFAULT_COLOR[this.currentColor];
	this.ctx.fillRect(parts[index].x1+1, parts[index].y1+1, parts[index].x2-1,parts[index].y2-1);
	this.partsColor[index] = this.currentColor;
}
FCG.prototype.setLevelText = function (){ var lvl = getElmt('level'); lvl.innerText = this.currentLevel+1; }
FCG.prototype.initPartsColor = function(){
	var parts = LEVEL[this.currentLevel].parts
	this.partsColor = new Array();
	
	for (var i=0; i<parts.length; i++){
		this.partsColor[i] = 0;
	}
}
FCG.prototype.start = function (){
	var level = LEVEL[this.currentLevel];
	
	this.currentColor = 0;
	this.setLevelText();
	this.initPartsColor();
	this.drawLines(level.lines);
	for (var i=0; i<this.partsColor.length; i++){
		this.fillPart(i);
	}
}
FCG.prototype.next = function(){
	var max = LEVEL.length - 1;
	
	if (max == this.currentLevel){
		this.currentLevel = 0;
	
		this.win();
	} else if (max > this.currentLevel){
		this.currentLevel++;
		this.start();
	}
}
FCG.prototype.win = function(){
	alert('You are the winner');
	this.start();
}
FCG.prototype.validate = function(){
	var valid = true;
	var neighbours = LEVEL[this.currentLevel].neighbours
	
	for (var i=0; i<this.partsColor.length; i++){
		if (this.partsColor[i] == 0){
			valid = false;
			break;
		}
	}
	if (valid){
		for (var i=0; i<neighbours.length; i++){
			for (var j=0; j<neighbours[i].length; j++){
				if ((neighbours[i][j] == 1) && (this.partsColor[i] == this.partsColor[j])){
					valid = false;
					break;
				}
			}
			if (!valid) break;
		}
	}
	return valid;
}
FCG.prototype.calculatePosition = function(event){
	var x = event.x;
	var y = event.y;
	console.log('original click', x + ',' + y);
	console.log('offsetLeft', this.cdom.offsetLeft);
	console.log('offsetTop', this.cdom.offsetTop);
	x = x - this.cdom.offsetLeft + window.scrollX;
	y = y - this.cdom.offsetTop + window.scrollY;
	return [x,y];
}
FCG.prototype.getPartByPoint = function(position){
	var result = -1;
	var parts = LEVEL[this.currentLevel].parts
	
	for (var i=0; i<parts.length; i++){
		if (parts[i].isInside(position[0],position[1])){
			result = i;
			break;
		}
	}
	return result;
}
function Rect(x1,y1, x2,y2){
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
}
Rect.prototype.isInside = function(x, y){
	return x >= this.x1 && x <= this.x2 && y >= this.y1 && y <= this.y2;
}