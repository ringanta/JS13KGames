var HEIGHT = 550;
var WIDTH = 600;
var DEFAULT_COLOR = ["#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00"];
var LEVEL = [
	{
		lines: [
			[0, HEIGHT/2, WIDTH, HEIGHT/2],
			[WIDTH/2, 0, WIDTH/2, HEIGHT]
		],
		parts: [
			[0, 0, WIDTH/2, HEIGHT/2],
			[WIDTH/2, 0, WIDTH/2, HEIGHT/2],
			[0, HEIGHT/2, WIDTH/2, HEIGHT/2],
			[WIDTH/2, HEIGHT/2, WIDTH/2, HEIGHT/2]
		],
		neighbours: [
			[0, 1, 1, 1],
			[1, 0, 1, 1],
			[1, 1, 0, 1],
			[1, 1, 1, 0]
		]
	},
	{
		lines: [
			[0, HEIGHT/2, WIDTH, HEIGHT/2],
			[WIDTH/2, 0, WIDTH/2, HEIGHT],
			[0, HEIGHT/4, WIDTH/2, HEIGHT/4],
			[WIDTH/4, 0, WIDTH/4, HEIGHT/2],
		],
		parts: [
			[0, 0, WIDTH/4, HEIGHT/4],
			[WIDTH/4, 0, WIDTH/4, HEIGHT/4],
			[0, HEIGHT/4, WIDTH/4, HEIGHT/4],
			[WIDTH/4, HEIGHT/4, WIDTH/4, HEIGHT/4],
			[WIDTH/2, 0, WIDTH/2, HEIGHT/2],
			[0, HEIGHT/2, WIDTH/2, HEIGHT/2],
			[WIDTH/2, HEIGHT/2, WIDTH/2, HEIGHT/2]
		],
		neighbours: [
			[0, 1, 1, 1, 0, 0, 0],
			[1, 0, 1, 1, 5, 0, 0],
			[1, 1, 0, 1, 0, 1, 0],
			[1, 1, 1, 0, 1, 1, 1],
			[0, 1, 0, 1, 0, 1, 1],
			[0, 0, 1, 1, 1, 0, 1],
			[0, 0, 0, 1, 1, 1, 0],
		]
	},
	{
		lines: [
			[0, HEIGHT/2, WIDTH, HEIGHT/2],
			[WIDTH/2, 0, WIDTH/2, HEIGHT],
			[0, HEIGHT/4, WIDTH, HEIGHT/4],
			[WIDTH/4, 0, WIDTH/4, HEIGHT/2],
			[3*WIDTH/4, 0, 3*WIDTH/4, HEIGHT/2]
		],
		parts: [
			[0, 0, WIDTH/4, HEIGHT/4],
			[WIDTH/4, 0, WIDTH/4, HEIGHT/4],
			[0, HEIGHT/4, WIDTH/4, HEIGHT/4],
			[WIDTH/4, HEIGHT/4, WIDTH/4, HEIGHT/4],
			[WIDTH/2, 0, WIDTH/4, HEIGHT/4],
			[3*WIDTH/4, 0, WIDTH/4, HEIGHT/4],
			[WIDTH/2, HEIGHT/4, WIDTH/4, HEIGHT/4],
			[3*WIDTH/4, HEIGHT/4, WIDTH/4, HEIGHT/4],
			
			[0, HEIGHT/2, WIDTH/2, HEIGHT/2],
			[WIDTH/2, HEIGHT/2, WIDTH/2, HEIGHT/2]
		],
		neighbours: [
			[0, 1, 1, 1, 0, 0, 0],
			[1, 0, 1, 1, 5, 0, 0],
			[1, 1, 0, 1, 0, 1, 0],
			[1, 1, 1, 0, 1, 1, 1],
			[0, 1, 0, 1, 0, 1, 1],
			[0, 0, 1, 1, 1, 0, 1],
			[0, 0, 0, 1, 1, 1, 0],
		]
	}
]
function getElmt(id){ return document.getElementById(id); }
function FCG(){
	this.cdom = getElmt('myfcg');
	this.ctx = this.cdom.getContext('2d');
	this.currentLevel = 2;
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
		this.line(line[0],line[1], line[2],line[3]);
	}
}
FCG.prototype.setColor = function (index){ this.currentColor = index; }
FCG.prototype.fillPart = function (index){
	var parts = LEVEL[this.currentLevel].parts;
	this.ctx.fillStyle = DEFAULT_COLOR[this.currentColor];
	console.log('parts ' + index, parts[index]);
	this.ctx.fillRect(parts[index][0]+1, parts[index][1]+1, parts[index][2]-1,parts[index][3]-1);
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
	var parts = LEVEL[this.currentLevel].parts;
	var part;
	
	for (var i=0; i<parts.length; i++){
		part = new Rect(parts[i][0], parts[i][1], parts[i][0] + parts[i][2], parts[i][1] + parts[i][3]);
		if (part.isInside(position[0],position[1])){
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
function startGame(){
	fcg = new FCG();
	fcg.start();
	var btn = getElmt('validate');
	var reset = getElmt('reset');
	var red = getElmt('red');
	var green = getElmt('green');
	var blue = getElmt('blue');
	var yellow = getElmt('yellow');
	btn.addEventListener("click", function(){
		valid = fcg.validate();
		console.log('valid', valid);
		if (valid){
			fcg.next();
		} else {
			alert("Invalid fill.\nAll parts must be filled with no default color.\nNeighbouring parts must be filled with different color.");
		}
	});
	red.addEventListener('click', function(){
		fcg.currentColor = 1;
	});
	green.addEventListener('click', function(){
		fcg.currentColor = 2;
	});
	blue.addEventListener('click', function(){
		fcg.currentColor = 3;
	});
	yellow.addEventListener('click', function(){
		fcg.currentColor = 4;
	});
	reset.addEventListener('click', function(){
		var input = confirm("Are you sure want to clear all parts at this level?");
		if (input == true){
			fcg.start();
		}
	});
	fcg.cdom.addEventListener("mousedown", function (event){
		var clickPos = fcg.calculatePosition(event);
		console.log('Calibrated position', clickPos[0] + ',' + clickPos[1]);
		var partNumber = fcg.getPartByPoint(clickPos);
		console.log('click in area', partNumber);
		fcg.fillPart(partNumber);
	}, false);
}