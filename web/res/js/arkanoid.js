(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

// =====================
//  START CONFIGURATION
// =====================
var canvasWidth  = 640;
var canvasHeight = 450;

var playerLives  = 5;
var friction = 0.8;
// =====================
//   END CONFIGURATION
// =====================

var level = 3;
var tick = 0;
var score  = 0;
var runGame = true;

initCanvas = function() {
	var canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	canvas.tabIndex = 1;

	canvas.width  = canvasWidth;
	canvas.height = canvasHeight;

	var audio_bg = new Audio("res/audio/chop_suey.mp3");
	// audio_bg.play();

	// controls
	keys = [];
	canvas.addEventListener('mousemove', function(evt) {
		var mousePos = getMousePos(canvas, evt);
		paddle.x = mousePos.x-paddle.width/2;
	}, false);

	paddle = new Paddle();
	ball = new Ball();
};

Level = function() {

	this.brickHeight = 20;
	this.brickWidth = 40;

	switch (level) {
		case 0:
			this.bricks = [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
			];
			break;
		case 1:
			this.bricks = [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
				[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
			];
			break;
		case 2:
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
			this.bricks = [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
				[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
				[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
				[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6]
			];
			break;
	}

	this.xMargin = (canvasWidth-(this.bricks[0].length)*this.brickWidth)/2;

	this.drawBricks = function() {
		for (var brickRow=0; brickRow<this.bricks.length; brickRow++) {
			for (var brickCol=0; brickCol<this.bricks[brickRow].length; brickCol++) {
				this.drawBrick(brickCol,brickRow, this.bricks[brickRow][brickCol]);
			}
		}
	},
	this.drawBrick = function(x, y, type) {

		switch (type) {
			case 1:
				ctx.fillStyle = "#5f5";
				break;
			case 2:
				ctx.fillStyle = "#ff5";
				break;
			case 3:
				ctx.fillStyle = "#0ff";
				break;
			case 4:
				ctx.fillStyle = "#33f";
				break;
			case 5:
				ctx.fillStyle = "#f22";
				break;
			case 6:
				hue = Math.floor(Math.abs(Math.sin(tick*0.03))*360);
				ctx.fillStyle = "hsl("+hue+",100%,80%)";
				break;
			default:
				ctx.fillStyle = "black";
		}

		if (type !== 0) {
			ctx.fillRect(x*this.brickWidth+this.xMargin, y*this.brickHeight, this.brickWidth, this.brickHeight);
			ctx.strokeStyle="rgba(0,0,0,.25)";
			ctx.lineWidth = 2;
			ctx.strokeRect(x*this.brickWidth+this.xMargin, y*this.brickHeight, this.brickWidth, this.brickHeight);
		}

	};
};

Ball = function() {

	this.x      = canvasWidth/2;
	this.y      = paddle.y-5-paddle.height;

	this.dx = 0;
	this.dy = 0;

	this.size = 10;

	this.draw = function() {
		ctx.fillStyle = "white";
		ctx.fillRect(this.x, this.y, this.size, this.size);
	},
	this.reset = function() {
		this.x = canvasWidth/2;
		this.y = paddle.y-5-paddle.height;
		this.dx = 0;
		this.dy = 0;
	},
	this.launch = function() {
		if ((this.dy === 0) && (this.dx === 0)) {
			this.reset();
			this.dy = -8;
			this.dx = (Math.random()*8)-4;
		}
	},
	this.update = function() {

		// out of bounds
		if (this.y + this.size > canvasHeight) {
			loseLife();
		}

		// paddle bounce
		if (this.y + this.size >= paddle.y) {
			if (this.x + this.size >= paddle.x &&
				this.x <= paddle.x + paddle.width) {

				// we've hit the paddle
				this.dy *= -1;

				// Change velocity based on paddle hit position
				var hitPos = (((this.x - paddle.x)/paddle.width)*2)-1;
				this.dx = hitPos*4;

				var audio = new Audio("res/audio/laser.mp3");
				audio.play();

			}
		}

		// edge + brick collisions
		if ((this.y < 0) ||
			collisionYWithBrick()) {
			this.dy *= -1;
		}

		if ((this.x < 0) ||
			(this.x + this.size > canvasWidth) ||
			collisionXWithBrick()) {
			this.dx *= -1;
		}

		this.x += this.dx;
		this.y += this.dy;

	};

};

Paddle = function() {

	this.x = 300;
	this.y = canvasHeight-20;

	// using dx means we can add friction!
	this.dx = 0;

	this.width = 80;
	this.height = 10;

	this.draw = function() {
		ctx.fillStyle = "white";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	},
	this.update = function() {
		this.x += this.dx;
		this.dx *= friction;

		// prevent out of bounds
		if (this.x > canvasWidth-this.width) {
			this.x = canvasWidth-this.width;
		}
		if (this.x < 0) {
			this.x = 0;
		}

	},
	this.moveRight = function() {
		if (this.x < canvasWidth-this.width) {
			this.dx += 3;
		}
	},
	this.moveLeft = function() {
		if (this.x > 0) {
			this.dx -= 3;
		}
	};

};

collisionXWithBrick = function() {
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
						hitBrick(brickRow,brickCol);
						collided = true;
					}
				}

			}

		}
	}

	return collided;
};

collisionYWithBrick = function() {
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
						hitBrick(brickRow,brickCol);
						collided = true;
					}
				}

			}

		}
	}

	return collided;
};

hitBrick = function(brickRow,brickCol) {
	level.bricks[brickRow][brickCol]--;

	if (level.bricks[brickRow][brickCol] > 0) {
		// brick weakened
		score++;
		var audio_beep = new Audio("res/audio/beep.mp3");
		audio_beep.play();
	} else {
		// brick destroyed
		score += 5;
		var audio_explode = new Audio("res/audio/explode.mp3");
		audio_explode.play();
		pu = new powerupDrop(brickRow,brickCol);
		pu.draw();
	}
};

powerupDrop = function(brickRow,brickCol) {

	this.x = brickCol*level.brickWidth+level.xMargin;
	this.y = brickRow*level.brickHeight;

	this.update = function() {
		this.y += 3;
	};
	this.draw = function() {
		this.update();
		ctx.fillStyle = "#fff";
		ctx.fillRect(this.x,this.y,40,20);
		ctx.strokeStyle="rgba(0,0,0,.25)";
		ctx.lineWidth = 2;
		ctx.strokeRect(this.x,this.y,40,20);
	};

};

loseLife = function() {
	playerLives -= 1;
	if (playerLives <= 0) {
		endGame();
	} else {
		var audio = new Audio("res/audio/death.mp3");
		audio.play();
		ball.reset();
	}
};

startGame = function() {
	level = new Level();
};

endGame = function() {
	var audio = new Audio("res/audio/gameover.mp3");
	audio.play();
	runGame = false;
};

update = function() {
	if (runGame === true) {
		if (keys[32] || keys[38]) { // space or up
			ball.launch();
		}
		if (keys[39]) { // right
			paddle.moveRight();
		}
		if (keys[37]) { // left
			paddle.moveLeft();
		}

		paddle.update();
		ball.update();
	}
};

draw = function() {
	if (!runGame) {
		ctx.font = "32px Helvetica";
		ctx.fillText("Game Over!", (canvasWidth/2)-100, canvasHeight/2);
		ctx.fillText("Score: "+score, (canvasWidth/2)-75, (canvasHeight/2)+50);
	} else {
		level.drawBricks();
		paddle.draw();
		ball.draw();
		// drawScore();
	}
};

animate = function() {
	update();
	tick++;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	draw();
	requestAnimationFrame(animate);
};

drawScore = function() {
	ctx.fillStyle = "white";
	ctx.font = "15px Helvetica";
	ctx.fillText("Score: "+score, 3, 15);
	ctx.fillText("Lives: "+playerLives, 3, 30);
};

// control stuff
getMousePos = function(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
};

document.body.addEventListener("keydown", function(e) {
	keys[e.keyCode] = true;
	e.preventDefault();
});

document.body.addEventListener("keyup", function(e) {
	keys[e.keyCode] = false;
	e.preventDefault();
});

window.addEventListener("load",function(){
	initCanvas();
	startGame();
	animate();
});
