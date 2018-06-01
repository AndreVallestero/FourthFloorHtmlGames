/*
Game uses right hand coordinate system, same as OpenGL
Top border is DISP_RATIO
Right border is 1
Left border is -1
Bottom border is -DISP_RATIO
*/

'use strict';
const INV_ROOT_2 = 0.70710678118,
	DISP_RATIO = 534.0/766.0;
	
var canvas, context, spritesheet, tpl, prevFrameTime, currFrameTime,
	invRatio = 383,
	dispScale = 1,
	keyStates = new Array(256).fill(0);

var player;

function main() {
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	spritesheet = new Image();
	spritesheet.src = "res/spritesheet.png";

	document.addEventListener('keydown',function(event){keyStates[event.keyCode]=1;});
	document.addEventListener('keyup',function(event){keyStates[event.keyCode]=0;});
	
	player = new Player();
	
	resize();
	prevFrameTime = performance.now()/1000;
	window.addEventListener('resize', resize, false);
	window.requestAnimationFrame(draw_frame);
	console.log("Application successfully initialized");
}

class Player {
	constructor() {
		this.rotation = 0;
		this.posX = 0;
		this.posY = 0;

		//screen goes from -1 to 1,
		//if player moves at 0.5 / second, it will take 4 seconds 
		//to cross the screen
		this.speed = 0.5;
		
		this.sprites = [[422,1,35,52],[459,1,35,52],[422,1,35,52],[496,1,35,52]];
		this.state = 0; //0 = standing, 1 = running
		
		//inversely proportional frame rate so the faster the player,
		//the higher the frame rate and makes it look like they're running
		this.timePerFrame = 1/(this.speed * 16);
		
		this.frame = 0;
		this.nextFrameTime = currFrameTime + this.timePerFrame;
	}
	
	apply_physics() {
		var motionX = keyStates[68] - keyStates[65]; // left - right
		var motionY = keyStates[87] - keyStates[83]; // up - down
		if(motionX && motionY) {	// euclidean geometry
			motionX *= INV_ROOT_2;
			motionY *= INV_ROOT_2;
		}
		if(motionX || motionY) this.state = 1;
		else this.state = 0;
		this.posX += motionX * this.speed * tpl;
		this.posY += motionY * this.speed * tpl;
	}
	
	draw() {
		if(!this.nextFrameTime)this.nextFrameTime = currFrameTime;
		if(currFrameTime >= this.nextFrameTime) {
			if(this.state) this.frame = (this.frame + 1) % 4; //if running
			else this.frame = 0; // standing so reset the animation to standing(0)
			this.nextFrameTime += this.timePerFrame;
		}
		draw_sprite(this.sprites[this.frame], this.posX, this.posY);
	}
}

function draw_frame() {
	currFrameTime = performance.now()/1000;
	tpl = (currFrameTime - prevFrameTime);
	prevFrameTime = currFrameTime;
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	//temporary border to see resizing
	context.rect(0,0,canvas.width,canvas.height);
	context.stroke(); 
	
	player.apply_physics();
	player.draw();
	
	window.requestAnimationFrame(draw_frame);
}

//add rotation, transparency, and draw all objects from their centers
function draw_sprite(sprite, dx = 0, dy = 0, scale = 1) {
	dx = (dx + 1) * canvas.width/2
	dy = (-dy + DISP_RATIO) * invRatio;
	var dw = sprite[2] * dispScale * scale;
	var dh = sprite[3] * dispScale * scale;
	context.drawImage(spritesheet, sprite[0], sprite[1], sprite[2], sprite[3], dx, dy, dw, dh);
}

function resize() {
	if (window.innerHeight/window.innerWidth > DISP_RATIO) {
		canvas.width = Math.ceil(window.innerWidth);
		canvas.height = Math.ceil(window.innerWidth*DISP_RATIO);
	} else {
		canvas.height = window.innerHeight;
		canvas.width = window.innerHeight/DISP_RATIO;
	}
	invRatio = canvas.height/ (DISP_RATIO + DISP_RATIO);
	dispScale = canvas.width/766.0;
}

window.onload = main();