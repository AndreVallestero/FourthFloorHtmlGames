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
	GAME_DISP_HEIGHT = 534.0,
	GAME_DISP_WIDTH = 766.0,
	GAME_DISP_RATIO = GAME_DISP_HEIGHT/GAME_DISP_WIDTH;

var canvas, context, spritesheet, tpl, prevFrameTime, currFrameTime,
	dispScale = 1,
	gameState = 0, // 0 = Start menu, 1 = In game, 2 = Game over
	invRatio = GAME_DISP_WIDTH / 2.0, 
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
	// Draw game start menu
	spritesheet.onload = function() {draw_sprite(spritemap["main"][0]);};
	spritesheet.src = "res/spritesheet.png";

	resize();
	add_event_listeners();

	console.log("Application successfully initialized");
}

function add_event_listeners() {
	window.addEventListener('resize', resize);
	window.onfocus = function() {};
	window.onblur = function() {};
	document.addEventListener('keydown',function(event){keyStates[event.keyCode]=1;});
	document.addEventListener('keyup',function(event){keyStates[event.keyCode]=0;});
	document.addEventListener('keypress', key_press);
	canvas.addEventListener('click', click);
}

function resize() {
	if (window.innerHeight/window.innerWidth > GAME_DISP_RATIO) {
		canvas.width = Math.ceil(window.innerWidth);
		canvas.height = Math.ceil(window.innerWidth*GAME_DISP_RATIO);
	} else {
		canvas.height = window.innerHeight;
		canvas.width = window.innerHeight/GAME_DISP_RATIO;
	}

	invRatio = canvas.height/ (GAME_DISP_RATIO+ GAME_DISP_RATIO);
	dispScale = canvas.width/766.0;

	if (gameState == 0) {
		draw_sprite(spritemap["main"][0]);
	} else if (gameState == 2) {
		draw_sprite(spritemap["main"][1]);
	}
}

function key_press(event) {
	// Start game loop
	if((gameState == 0 || gameState == 2) && (event.keyCode == 82 || event.which == 114)) {
		entities["Player"].push(new Player());
		gameState = 1;
		prevFrameTime = performance.now()/1000;
		window.requestAnimationFrame(update);
	}
}

function click() {
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
	entities["Player"].forEach(function(player) {
		player.apply_physics();
	})

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

	for (var entityType in entities) {
		entities[entityType].forEach(function(entity){
			entity.draw();
		});
	};

	//temporary border to see resizing
	context.lineWidth = 10;
	context.strokeStyle = "#ff00ff";
	context.rect(0,0,canvas.width,canvas.height);
	context.stroke(); 
}

// Add rotation, transparency, and draw all objects from their centers
// left edge @ x = 0
// right edge @ x = GAME_DISP_WIDTH - 1
// bottom edge @ y = GAME_DISP_HEIGHT - 1
// top edge @ y = 0
function draw_sprite(sprite, posX = 0, posY = 0, rot = 0, scale = 1, trans = 1) {
	context.globalAlpha = trans;
	context.rotate(rot);
	context.drawImage(spritesheet, sprite[0], sprite[1], sprite[2], sprite[3],
		posX*dispScale, posY*dispScale, sprite[2]*scale*dispScale, sprite[3]*scale*dispScale);
	context.globalAlpha = 1;
	context.rotate(-rot);
}

/*
function draw_sprite(sprite, dx = 0, dy = 0, scale = 1, transparency = 1) {
	dx = (dx + 1) * canvas.width/2
	dy = (-dy + GAME_DISP_RATIO) * invRatio;
	var dw = sprite[2] * dispScale * scale;
	var dh = sprite[3] * dispScale * scale;
	context.drawImage(spritesheet, sprite[0], sprite[1], sprite[2], sprite[3], dx, dy, dw, dh);
}*/


class Entity {
	constructor() {
		this.posX = GAME_DISP_WIDTH / 2.0;
		this.posY = GAME_DISP_HEIGHT / 2.0;
		this.rot = 0;
		this.scale = 1;
		this.trans = 1;
		this.sprite;
		this.entityType;
	}

	// Draw each entity from it's center
	draw() {
		var drawWidth = this.sprite[2]*this.scale;
		var drawHeight = this.sprite[3]*this.scale;
		var adjX = this.posX - drawWidth / 2.0;
		var adjY = this.posY - drawHeight / 2.0;
		//debugger;
		draw_sprite(this.sprite, adjX, adjY, this.rot, this.scale, this.trans);
	}
}

class Player extends Entity {
	constructor() {3
		super();
		this.entityType = "Player";
		this.sprite = spritemap["player"][0];
		this.state = 0;
		this.speed = GAME_DISP_HEIGHT/2;
	}

	apply_physics() {
		var motionX = keyStates[68] - keyStates[65]; // left - right
		var motionY = keyStates[83] - keyStates[87]; // up - down
		if(motionX && motionY) {	// euclidean geometry
			motionX *= INV_ROOT_2;
			motionY *= INV_ROOT_2;
		}
		if(motionX || motionY) this.state = 1;
		else this.state = 0;
		this.posX += motionX * this.speed * tpl;
		this.posY += motionY * this.speed * tpl;
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
		this.posX = posX;
		this.posY = posY;
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

window.onload = main;