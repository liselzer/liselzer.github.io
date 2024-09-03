let surfer;
let surferImage;
let sharkFinImage;
let rockImage;
let backgroundImage;
let obstacles = [];
let waveOffset = 0;
let gameOver = false;
let score = 0;
let startTime;
let elapsedTime = 0;
let gameState = "menu";
let obstacleSpeed = 2; 
let waveSpeed = 0.01;
let speedIncreaseInterval = 3000; 
let lastSpeedIncreaseTime = 0;
let waveAmplitude = 40; 
let waveBaseY; 
let winTime = 60000; // Win condition: 60 seconds

function preload() {
    surferImage = loadImage('surfer.png');
    sharkFinImage = loadImage('shark.png');
    rockImage = loadImage('rock.jpg');
    backgroundImage = loadImage('sunset.avif');
}

function setup() {
    createCanvas(800, 600);
    frameRate(60);
    waveBaseY = height * 0.6;
}

function draw() {
    if (gameState === "menu") {
        drawMenu();
    } else if (gameState === "play") {
        image(backgroundImage, 0, 0, width, height);
        drawWave();

        if (!gameOver) {
            surfer.update();
            surfer.display();

            if (frameCount % 60 === 0) {
                let yPosition = random(waveBaseY - waveAmplitude, waveBaseY + waveAmplitude);
                let isSharkFin = random() < 0.5; 
                obstacles.push(new Obstacle(width, yPosition, isSharkFin));
            }

            for (let i = obstacles.length - 1; i >= 0; i--) {
                obstacles[i].update();
                obstacles[i].display();

                if (surfer.hits(obstacles[i])) {
                    gameOver = true;
                }

                if (obstacles[i].offscreen()) {
                    obstacles.splice(i, 1);
                    score++; 
                }
            }

            if (millis() - lastSpeedIncreaseTime > speedIncreaseInterval) {
                obstacleSpeed += 0.3; 
                waveSpeed += 0.002; 
                lastSpeedIncreaseTime = millis();
            }

            fill(255);
            textSize(20);
            textAlign(LEFT);
            text('Score: ' + score, 10, 30);
            elapsedTime = millis() - startTime;
            text('Time: ' + Math.floor(elapsedTime / 1000) + 's', 10, 60);

            if (elapsedTime >= winTime) {
                gameOver = true;
                fill(0, 255, 0);
                textSize(50);
                textAlign(CENTER);
                text('You Win!', width / 2, height / 2);
                textSize(20);
                text('Press R to Restart', width / 2, height / 2 + 40);
            }
        } else {
            if (elapsedTime < winTime) {
                fill(255, 0, 0);
                textSize(50);
                textAlign(CENTER);
                text('Game Over', width / 2, height / 2);
            }
            textSize(20);
            text('Press R to Restart', width / 2, height / 2 + 40);
        }
    }
}

function drawMenu() {
    background(135, 206, 250); 
    fill(255);
    textSize(50);
    textAlign(CENTER);
    text('Surfer Game', width / 2, height / 2 - 20);
    textSize(20);
    text('Press ENTER to Start', width / 2, height / 2 + 30);
}

function drawWave() {
    let waveColor = color(0, 102, 204);
    let foamColor = color(255, 255, 255, 150);

    noStroke();
    fill(waveColor);

    beginShape();
    for (let x = 0; x <= width; x += .01) {
        let y = waveBaseY + waveAmplitude * sin(waveSpeed * (x + waveOffset));
        vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);

    fill(foamColor);
    for (let x = 0; x <= width; x += 10) {
        let foamY = waveBaseY + waveAmplitude * sin(waveSpeed * (x + waveOffset)) + random(20, 20);
        let foamSize = random(20, 50);
        ellipse(x, foamY, foamSize, foamSize * 0.9);
    }

    waveOffset += obstacleSpeed * 0.5;
}

function startNewGame() {
    surfer = new Surfer(100, waveBaseY); 
    obstacles = [];
    score = 0;
    gameOver = false;
    startTime = millis();
    elapsedTime = 0;
    obstacleSpeed = 2;
    waveSpeed = 0.01;
    lastSpeedIncreaseTime = millis(); 
    gameState = "play";
}

class Surfer {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 30;
        this.isMovingUp = false;
        this.isMovingDown = false;
    }

    display() {
        image(surferImage, this.x, this.y, this.width, this.height);
    }

    update() {
        if (this.isMovingUp) {
            this.y -= 5;
        }
        if (this.isMovingDown) {
            this.y += 5;
        }

        if (this.y < waveBaseY - waveAmplitude) {
            this.y = waveBaseY - waveAmplitude;
        } else if (this.y > waveBaseY + waveAmplitude) {
            this.y = waveBaseY + waveAmplitude;
        }
    }

    hits(obstacle) {
        return (
            this.x < obstacle.x + obstacle.width &&
            this.x + this.width > obstacle.x &&
            this.y < obstacle.y + obstacle.height &&
            this.y + this.height > obstacle.y
        );
    }
}

class Obstacle {
    constructor(x, y, isSharkFin) {
        this.x = x;
        this.y = y;
        this.isSharkFin = isSharkFin;
        this.width = random(30, 70); 
        this.height = random(20, 50); 
    }

    display() {
        if (this.isSharkFin) {
            image(sharkFinImage, this.x, this.y, this.width, this.height);
        } else {
            image(rockImage, this.x, this.y, this.width, this.height);
        }
    }

    update() {
        this.x -= obstacleSpeed; 
    }

    offscreen() {
        return this.x < -this.width;
    }
}

function keyPressed() {
    if (key === 'Enter' && gameState === "menu") {
        startNewGame(); 
    }
    if (keyCode === UP_ARROW) {
        surfer.isMovingUp = true;
    }
    if (keyCode === DOWN_ARROW) {
        surfer.isMovingDown = true;
    }
    if (key === 'r' && gameOver) {
        startNewGame();
    }
}

function keyReleased() {
    if (keyCode === UP_ARROW) {
        surfer.isMovingUp = false;
    }
    if (keyCode === DOWN_ARROW) {
        surfer.isMovingDown = false;
    }
}

