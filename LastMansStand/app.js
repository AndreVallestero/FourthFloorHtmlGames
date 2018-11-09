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

const INV_ROOT_2 = 0.70710678118,
	GAME_DISP_RATIO = 534.0/766.0;

var canvas, context, spritesheet, tpl, prevFrameTime, currFrameTime,
	keyStates = new Array(256).fill(0),
	entities = {
		"Player":[],
		"Zombie":[],
		"Bullet":[],
		"Sandbags":[],
		"Supplies":[],
		"Blood":[]
	},
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
	};

function main() {
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	spritesheet = new Image();
	spritesheet.src = "res/spritesheet.png";

	add_event_listeners();

	resize();

	prevFrameTime = performance.now()/1000;
	window.requestAnimationFrame(update);
	console.log("Application successfully initialized");
}

function add_event_listeners() {
	document.addEventListener('keydown', function(event){keyStates[event.keyCode]=1;});
	document.addEventListener('keyup', function(event){keyStates[event.keyCodes]=0;});
	window.addEventListener('resize', resize, false);
	window.onfocus = function() {};
	window.onblur = function() {};
}

function resize() {
	if (window.innerHeight/window.innerWidth > GAME_DISP_RATIO) {
		canvas.width = Math.ceil(window.innerWidth);
		canvas.height = Math.ceil(window.innerWidth*GAME_DISP_RATIO);
	} else {
		canvas.height = window.innerHeight;
		canvas.width = window.innerHeight/GAME_DISP_RATIO;
	}

	invRatio = canvas.height/ (DISP_RATIO + DISP_RATIO);
	dispScale = canvas.width/766.0;
}

function update() {
	console.log("tick");
	currFrameTime = performance.now()/1000.0;
	tpl = (currFrameTime - prevFrameTime);
	prevFrameTime = currFrameTime;

	update_physics();
	draw_frame();

	window.requestAnimationFrame(update);
}

function update_physics() {
	/*
	for each (var obstacle in sandbags) {

	}
	for each (var entity in collEntities) {
		entity.check_collision();
	}
	*/
}

function draw_frame() {
	context.clearRect(0, 0, canvas.width, canvas.height);

	//temporary border to see resizing
	context.lineWidth = 10;
	context.strokeStyle = "#ff00ff";
	context.rect(0,0,canvas.width,canvas.height);
	context.stroke(); 
}

function draw_entity(entity) {

}

//add rotation, transparency, and draw all objects from their centers
function draw_sprite(sprite, dx, dy, dw, dh) {
	context.drawImage(spritesheet, sprite[0], sprite[1], sprite[2], sprite[3], dx, dy, dw, dh);
}

class Entity {
	constructor(width, height, rotation) {
		this.height = height;
		this.width = width;
		this.rotation = rotation || 0.0;
	}
}

class Player extends Entity {
	constructor(width, height, rotation) {
		super(width, height, rotation);
		this.xPos = 0;
		this.yPos = 0;
		this.speed = 5;
	}

	check_collision(entity) {
	}

	collide(entity) {
	}
}

class Zombie extends Entity {
	constructor(width, height, rotation) {
		super(width, height, rotation);
	}

	collide(entity) {

	}
}

class Bullet extends Entity {
	constructor(width, height, rotation) {
		super(width, height, rotation);
		this.xPos = xPos;
		this.yPos = yPos;
		this.speed = 20;
	}

	// Collides with zombies
	check_collision(entity) {

	}

	collide(entity) {

	}
}

class Sandbags extends Entity {
	constructor(width, height, rotation) {
		super(width, height, rotation);
	}

	// Collides with zombies
	check_collision(entity) {
	}
}

class Blood extends Entity {
	constructor(width, height, rotation) {
		super(width, height, rotation);
	}
}

class Supplies extends Entity {
	constructor(width, height, rotation) {
		super(width, height, rotation);
	}

	// Collides with player
	collide(entity) {
	}
}

window.onload = main();
