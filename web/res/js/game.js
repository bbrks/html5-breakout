/*=====================*\
 * START CONFIGURATION *
\*=====================*/

	var enable_sound = false;
	// var difficulty   = 1.0;

	var canvasWidth  = 640;
	var canvasHeight = 450;

/*===================*\
 * END CONFIGURATION *
\*===================*/

window.requestAnimFrame =
window.requestAnimationFrame       ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame    ||
window.oRequestAnimationFrame      ||
window.msRequestAnimationFrame     ||
function(callback) {
	window.setTimeout(callback, 1000 / 60);
};

Game = function() {

	sound = new Sound();

	this.state = "";
	this.level = 0;

	this.initCanvas = function() {

		var canvas = document.getElementById("canvas");
		ctx = canvas.getContext("2d");

		canvas.tabIndex = 1;

		canvas.width  = canvasWidth;
		canvas.height = canvasHeight;

		keys = [];

	};

	this.loadLevel = function() {
		level = new Level(this.level);
	};

	this.startGame = function() {
		paddle = new Paddle();
		balls = new Balls();
		this.loadLevel();
		this.state = "playing";
	}

	this.initCanvas();

};

Menu = function() {

	this.selected = 0;
	this.options = [];

	this.tick = 0;

	this.update = function() {
		this.tick++;
	};

	var bg = new Image();
	bg.src = "res/img/starfield.png";


	var logo = new Image();
	logo.src = "res/img/breakout.png";

	this.draw = function() {

        var pattern = ctx.createPattern(bg, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

		ctx.drawImage(logo, (canvasWidth/2)-225, 25);

		ctx.font = "24px Helvetica";
      	ctx.textAlign = 'center';

      	var trans = (Math.abs(Math.sin(this.tick*0.05))+0.5)*0.25;

		for (var i=0; i < this.options.length; i++) {
			if (this.selected === i) {
				var gradient = ctx.createLinearGradient(0, 0, canvasWidth, 0);
				gradient.addColorStop(0, "rgba(255,255,255,"+trans+")");
				gradient.addColorStop(0.5, "rgba(255,255,255,"+(trans+0.5)+")");
				gradient.addColorStop(1, "rgba(255,255,255,"+trans+")");
				ctx.fillStyle = gradient;
				ctx.fillRect(0, (canvasHeight/1.75)+(i*50)-87, canvasWidth, 40);
				ctx.fillStyle = "#000";
			} else {
				ctx.fillStyle = "#fff";
			}
			ctx.fillText(this.options[i], (canvasWidth/2), (canvasHeight/1.75)+(i*50)-(this.options.length*20));
		}

	};

	this.up = function() {
		if (this.selected > 0) {
			this.selected--;
		}
	};

	this.down = function() {
		if (this.selected < this.options.length-1) {
			this.selected++;
		}
	};

	this.left = function() {

	};

	this.right = function() {

	};

	this.mousePos = function(x, y) {

	};

	this.enter = function() {
		switch (this.options[this.selected]) {
			case "Play Game":
				game.startGame();
				break;
			default:
				console.log("asdf");
				break;
		}
	};

	this.options.push("Play Game");
	this.options.push("Settings");
	this.options.push("Help");

};

Level = function(level) {

	this.brickWidth  = 40;
	this.brickHeight = 20;

	this.lives   = 5;
	this.score   = 0;

	this.bg_music = null;
	this.maxBrickType = 6;

	switch (level) {
		case 0:
			this.bg_music = new Audio("res/audio/chop_suey.mp3");
			this.bricks = [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
			];
			break;
		case 1:
			this.bg_music = new Audio("res/audio/chop_suey.mp3");
			this.bricks = [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
				[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
			];
			break;
		case 2:
			this.bg_music = new Audio("res/audio/chop_suey.mp3");
			this.bricks = [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],
				[0,1,2,2,2,3,6,6,6,3,2,2,2,1,0],
				[1,2,2,2,3,3,3,3,3,3,3,2,2,2,1],
				[0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
				[0,0,2,0,2,0,2,0,2,0,2,0,2,0,0]
			];
			break;
		case 3:
			this.bg_music = new Audio("res/audio/chop_suey.mp3");
			this.bricks = [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[1,1,5,5,4,4,5,6,5,4,4,5,5,1,1],
				[3,1,1,5,5,4,4,5,4,4,5,5,1,1,3],
				[2,3,1,1,5,5,4,5,4,5,5,1,1,3,2],
				[0,2,3,1,1,5,5,5,5,5,1,1,3,2,0],
				[0,0,2,3,1,1,5,5,5,1,1,3,2,0,0]
			];
			break;
		default:
			this.bg_music = new Audio("res/audio/chop_suey.mp3");
			this.bricks = [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
				[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
				[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
				[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6]
			];
			break;
	}

	// This margin is to centre the bricks on screen
	this.xMargin = (canvasWidth - (this.bricks[level].length) * this.brickWidth) / 2;

	if (enable_sound && this.bg_music) {
		this.bg_music.play();
	}

	// loop through the bricks array and draw each brick
	this.drawBricks = function() {
		count = 0;
		for (var brickX = 0; brickX < this.bricks.length; brickX++) {
			for (var brickY = 0; brickY < this.bricks[brickX].length; brickY++) {
				this.drawBrick(brickY, brickX, this.bricks[brickX][brickY]);
				count += this.bricks[brickX][brickY];
			}
		}
		return count;
	};

	// function to draw a single brick
	this.drawBrick = function(brickX, brickY, brickType) {

		var hue = Math.floor((brickType/this.maxBrickType)*360);
		ctx.fillStyle = "hsl("+hue+", 100%, 80%)";

		if (brickType !== 0) {
			ctx.fillRect(brickX * this.brickWidth + this.xMargin, brickY * this.brickHeight, this.brickWidth, this.brickHeight);
			ctx.strokeStyle = "rgba(0,0,0,0.25)";
			ctx.lineWidth   = 2;
			ctx.strokeRect(brickX * this.brickWidth + this.xMargin, brickY * this.brickHeight, this.brickWidth, this.brickHeight);
		}

	};

	this.hitBrick = function(brickRow,brickCol) {
		this.bricks[brickRow][brickCol]--;

		if (this.bricks[brickRow][brickCol] > 0) {
			// brick weakened
			this.score++;
			if (enable_sound && sound.brick_sound) {
				sound.brick_sound.play();
			}
		} else {
			// brick destroyed
			this.score += 5;
			if (enable_sound && sound.brick_sound2) {
				sound.brick_sound2.play();
			}
			// pu = new powerupDrop(brickRow,brickCol);
			// pu.draw();
		}

	};

	this.loseLife = function() {

		// console.log("balls:"+balls.balls.length);
		// console.log("lives:"+this.lives);
		if (balls.balls.length === 1) {
			this.lives--;
			if (this.lives <= 0) {
				game.state = "game_over";
				if (enable_sound && sound.gameover_sound) {
					sound.gameover_sound.play();
				}
				menu.game_over();
			} else {
				if (enable_sound && sound.death_sound) {
					sound.death_sound.play();
				}
				balls.balls = [];
				balls.addBall();
			}
		} else {
			balls.removeBall();
		}
	};

	paddle = new Paddle();
	balls  = new Balls();

	balls.addBall();

};

Ball = function() {

	this.size = 10;

	this.x = canvasWidth/2;
	this.y = paddle.y - 5 - paddle.height;

	this.dx = 0;
	this.dy = 0;

	this.draw = function() {
		ctx.fillStyle = "#fff";
		ctx.fillRect(this.x, this.y, this.size, this.size);
	};

	this.update = function() {

		// out of bounds
		if (this.y + this.size > canvasHeight) {
			level.loseLife();
		}

		// paddle bounce
		if (this.y + this.size > paddle.y &&
			this.y < paddle.y + paddle.height) {
			if (this.x + this.size >= paddle.x &&
				this.x <= paddle.x + paddle.width) {

				// we've hit the paddle
				this.dy = -Math.abs(this.dy);

				// Change x velocity based on paddle hit position
				var hitPos = (((this.x - paddle.x)/paddle.width)*2)-1;
				this.dx = hitPos*4;

				if (enable_sound && sound.paddle_sound) {
					sound.paddle_sound.play();
				}

			}
		}

		// edge + brick collisions
		if ((this.y < 0) ||
			this.collisionYWithBrick()) {
			this.dy *= -1;
		}

		if ((this.x < 0) ||
			(this.x + this.size > canvasWidth) ||
			this.collisionXWithBrick()) {
			this.dx *= -1;
		}

		this.x += this.dx;
		this.y += this.dy;

	};

	this.reset = function() {
		this.x = canvasWidth/2;
		this.y = paddle.y-5-paddle.height;
		this.dx = 0;
		this.dy = 0;
	};

	this.launch = function() {
		if ((this.dy === 0) && (this.dx === 0)) {
			this.reset();
			this.dy = -8;
			this.dx = (Math.random()*8)-4;
		}
	};

	this.collisionXWithBrick = function() {
		var collided = false;

		for (var brickRow=0; brickRow<level.bricks.length; brickRow++) {
			for (var brickCol=0; brickCol<level.bricks[brickRow].length; brickCol++) {

				if (level.bricks[brickRow][brickCol]) {
					var brickX = brickCol * level.brickWidth + level.xMargin;
					var brickY = brickRow * level.brickHeight;

					if (((ball.x + ball.dx >= brickX) && (ball.x + ball.dx <= brickX + level.brickWidth)) ||
						((ball.x + ball.dx + ball.size >= brickX) && (ball.x + ball.dx + ball.size <= brickX + level.brickWidth))) {

						if (((ball.y + ball.dy >= brickY) && (ball.y + ball.dy <= brickY + level.brickHeight)) ||
							((ball.y + ball.dy + ball.size >= brickY) && (ball.y + ball.dy + ball.size <= brickY + level.brickHeight))) {
							level.hitBrick(brickRow,brickCol);
							collided = true;
						}
					}

				}

			}
		}

		return collided;
	};

	this.collisionYWithBrick = function() {
		var collided = false;

		for (var brickRow=0; brickRow<level.bricks.length; brickRow++) {
			for (var brickCol=0; brickCol<level.bricks[brickRow].length; brickCol++) {

				if (level.bricks[brickRow][brickCol]) {
					var brickX = brickCol * level.brickWidth + level.xMargin;
					var brickY = brickRow * level.brickHeight;

					if (((ball.y + ball.dy >= brickY) && (ball.y + ball.dy <= brickY + level.brickHeight)) ||
						((ball.y + ball.dy + ball.size >= brickY) && (ball.y + ball.dy + ball.size <= brickY + level.brickHeight))) {

						if (((ball.x + ball.dx >= brickX) && (ball.x + ball.dx <= brickX + level.brickWidth)) ||
							((ball.x + ball.dx + ball.size >= brickX) && (ball.x + ball.dx + ball.size <= brickX + level.brickWidth))) {
							level.hitBrick(brickRow,brickCol);
							collided = true;
						}
					}

				}

			}
		}

		return collided;
	};

};

// Hold an array of balls for easy multiball
Balls = function() {

	this.balls = [];

	this.addBall = function() {
		ball = new Ball();
		this.balls.push(ball);
	};

	this.removeBall = function() {
		this.balls.pop();
	};

	this.launch = function() {
		for (var ballNo = 0; ballNo < this.balls.length; ballNo++) {
			this.balls[ballNo].launch();
		}
	};

	this.draw = function() {
		for (var ballNo = 0; ballNo < this.balls.length; ballNo++) {
			this.balls[ballNo].draw();
		}
	};

	this.update = function() {
		for (var ballNo = 0; ballNo < this.balls.length; ballNo++) {
			this.balls[ballNo].update();
		}
	};

};

Paddle = function() {

	this.x = (canvasWidth / 2) - 40;
	this.y = canvasHeight - 30;

	this.dx = 0;

	this.width  = 80;
	this.height = 10;

	this.draw = function() {
		ctx.fillStyle = "white";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};

	this.update = function() {
		this.x += this.dx;
		this.dx *= 0.8;

		// prevent out of bounds
		if (this.x > canvasWidth-this.width) {
			this.x = canvasWidth-this.width;
		}
		if (this.x < 0) {
			this.x = 0;
		}

	};

	this.moveRight = function() {
		if (this.x < canvasWidth-this.width) {
			this.dx += 3;
		}
	};

	this.moveLeft = function() {
		if (this.x > 0) {
			this.dx -= 3;
		}
	};

};

Sound = function() {

	this.death_sound  = new Audio("res/audio/explode.mp3");
	this.paddle_sound = new Audio("res/audio/laser.mp3");
	this.brick_sound  = new Audio("res/audio/beep.mp3");
	this.brick_sound2 = new Audio("res/audio/laser.mp3");
	this.level_sound = new Audio("res/audio/powerup.mp3");

};

init = function() {

	game = new Game();
	menu = new Menu();
	game.state = "menu";

};

update = function() {
	if (game.state === "playing") {
		if (keys[32]) { // space
			balls.launch();
		}
		if (keys[37]) { // left
			paddle.moveLeft();
		}
		if (keys[39]) { // right
			paddle.moveRight();
		}

		paddle.update();
		balls.update();
	} else if (game.state === "menu") {
		menu.update();
	}
};

draw = function() {
	if (game.state === "playing") {
		if (level.drawBricks() === 0) {
			game.level++;
			game.loadLevel();
			if (enable_sound && level_sound) {
				sound.level_sound.play();
			}
		}
		paddle.draw();
		balls.draw();
	} else if (game.state === "menu") {
		menu.draw();
	}
};

animate = function() {
	update();
	ctx.clearRect(0,0,canvas.width,canvas.height);
	draw();
	requestAnimationFrame(animate);
};

window.addEventListener("load", function() {
	init();
	animate();
});

// control stuff
getMousePos = function(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
};


document.body.addEventListener('mousemove', function(e) {
	var mousePos = getMousePos(canvas, e);
	if (game.state === "playing") {
		paddle.x = mousePos.x - paddle.width/2;
	} else if (game.state === "menu") {
		menu.mousePos(mousePos.x, mousePos.y);
	}
}, false);

document.body.addEventListener("keydown", function(e) {
	keys[e.keyCode] = true;
	if (game.state === "menu") {
		if (e.keyCode === 38) {
			menu.up();
		} else if (e.keyCode === 40) {
			menu.down();
		} else if (e.keyCode === 13 || e.keyCode === 32) {
			menu.enter();
		}
	}
	e.preventDefault();
});

document.body.addEventListener("keyup", function(e) {
	keys[e.keyCode] = false;
	e.preventDefault();
});
