'use strict';
/*
	draw menu,
	on start, request animation frame
	run game
	on lose destroy request animation frame
	draw lose menu

	
	AI, general physics, special physics, collision, render
	zombie chooses a random direction in the opposite quadrant and walks there.
*/

const INV_ROOT_2 = 0.70710678118;

var canvas, context, spritesheet, player,
	gameDispRatio = 766.0/534.0,
	spritemap = {
		"blood":[[533,1,132,106]],
		"bullet":[[1,1,10,14]],
		"bulletcase":[[35, 1, 24, 24]],
		"crosshair":[[13,1, 20,20]],
		"ground":[[1, 109, 766, 534]],
		"main":[[1, 645, 766, 534],[1, 1181, 766, 534]],
		"player":[[422,1,35,52],[459,1,35,52],[422,1,35,52],[496,1,35,52]],
		"sandbag":[[61,1,19,25]],
		"sandbags":[[199,1,134,47]],
		"zombierun":[[82,1,37,45],[121,1,37,45],[82,1,37,45],[160,1,37,45]],
		"zombiewalk":[[335,1,27,48],[364,1,27,48],[335,1,27,48],[393,1,27,48]]
	},
	entities = {
		"Player":[],
		"Zombie":[],
		"Bullet":[],
		"Sandbags":[],
		"Supplies":[],
		"Blood":[]
	},
	keyW = 0, keyA = 0, keyS = 0, keyD = 0;

function main() {
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	spritesheet = new Image();
	spritesheet.src = "res/spritesheet.png";

	document.addEventListener('keydown', function(event) {
		var keyCode = event.keyCode;
		if (keyCode == 68) keyD = 1;
		else if (keyCode == 83) keyS = 1;
		else if (keyCode == 65) keyA = 1;
		else if (keyCode == 87) keyW = 1;
	});
	document.addEventListener('keyup', function(event) {
		var keyCode = event.keyCode;
		if (keyCode == 68) keyD = 0;
		else if (keyCode == 83) keyS = 0;
		else if (keyCode == 65) keyA = 0;
		else if (keyCode == 87) keyW = 0;
	});
	
	player = new Player(64, 64, 0);
	entities["Player"].push(player);
	
	resize();
	window.addEventListener('resize', resize, false);
	window.requestAnimationFrame(draw_frame);
	console.log("Application successfully initialized");
}

function update() {
}

function draw_frame() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	draw_sprite(spritemap["main"][0], 0, 0, canvas.width, canvas.height);
	update_physics();
	draw_sprite(spritemap["player"][0], player.xPos, player.yPos, 32,32);
	window.requestAnimationFrame(draw_frame);
}

function draw_sprite(sprite, dx, dy, dw, dh) {
	context.drawImage(spritesheet, sprite[0], sprite[1], sprite[2], sprite[3], dx, dy, dw, dh);
}

function update_physics() {
	var deltaX = keyD - keyA;
	var deltaY = keyS - keyW;
	if(deltaX && deltaY) {	// euclidean math
		deltaX *= INV_ROOT_2;
		deltaY *= INV_ROOT_2;
	}
	player.xPos += deltaX * player.speed;
	player.yPos += deltaY * player.speed;

	/*
	for each (var obstacle in sandbags) {
		
	}
	for each (var entity in collEntities) {
		entity.check_collision();
	}
	*/
}

function resize() {
	if (window.innerWidth/window.innerHeight > gameDispRatio) {
		canvas.width = Math.round(window.innerHeight*gameDispRatio);
		canvas.height = window.innerHeight;
	} else {
		canvas.width = window.innerWidth;
		canvas.height = Math.round(window.innerWidth/gameDispRatio);
	}
	context.drawImage(spritesheet, sprite[0], sprite[1], sprite[2], sprite[3], dx, dy, dw, dh);
}

class Entity {
	constructor(width, height, rotation) {
		this.height = height;
		this.width = width;
		this.rotation = rotation || 0.0;		}
}

class Player extends Entity {
	constructor(width, height, rotation) {
		super(width, height, rotation);
		this.xPos = 0;
		this.yPos = 0;
		this.speed = 5;
	}
}

class Zombie extends Entity {
	
}

class Bullet extends Entity {
	constructor(width, height, rotation) {
		super(width, height, rotation);
	}
}

class Sandbags extends Entity {
	
}

class Supplies extends Entity {
	
}

class Blood extends Entity {
	
}

window.onload = main();