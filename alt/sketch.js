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
let winTime = 60000;

function preload() {
    surferImage = loadImage('surfer.png'); 
    sharkFinImage = loadImage('shark.png'); 
    rockImage = loadImage('rock.jpg'); 
    backgroundImage = loadImage('sunset.avif'); 
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('sketch-container');
    waveBaseY = height / 2;
    surfer = createVector(width / 2, waveBaseY);
    startTime = millis();
}

function draw() {
    background(0);
    if (gameState === "menu") {
        textAlign(CENTER, CENTER);
        textSize(32);
        fill(255);
        text("Press ENTER to Start", width / 2, height / 2);
    } else if (gameState === "playing") {
        image(backgroundImage, 0, 0, width, height);
        let currentTime = millis();
        elapsedTime = currentTime - startTime;
        if (elapsedTime >= winTime) {
            gameState = "gameOver";
        }
        waveOffset += waveSpeed;
        let waveY = waveBaseY + sin(waveOffset) * waveAmplitude;
        image(surferImage, surfer.x, waveY, 100, 100);
        if (currentTime - lastSpeedIncreaseTime > speedIncreaseInterval) {
            obstacleSpeed += 0.5;
            waveSpeed += 0.002;
            lastSpeedIncreaseTime = currentTime;
        }
        for (let i = obstacles.length - 1; i >= 0; i--) {
            let obstacle = obstacles[i];
            obstacle.x -= obstacleSpeed;
            if (obstacle.type === "shark") {
                image(sharkFinImage, obstacle.x, obstacle.y, 100, 100);
            } else {
                image(rockImage, obstacle.x, obstacle.y, 50, 50);
            }
            if (obstacle.x < -50) {
                obstacles.splice(i, 1);
            }
            let d = dist(surfer.x, waveY, obstacle.x, obstacle.y);
            if (d < 50) {
                gameState = "gameOver";
            }
        }
        if (random(1) < 0.02) {
            let obstacleType = random(["shark", "rock"]);
            let obstacleY = random(waveBaseY - 50, waveBaseY + 50);
            obstacles.push({ type: obstacleType, x: width, y: obstacleY });
        }
        fill(255);
        textSize(24);
        text(`Time: ${floor(elapsedTime / 1000)}s`, 10, 30);
    } else if (gameState === "gameOver") {
        textAlign(CENTER, CENTER);
        textSize(32);
        fill(255);
        text("Game Over! Press R to Restart", width / 2, height / 2);
    }
}

// Prevent arrow keys from scrolling the page
function keyPressed() {
    if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
        event.preventDefault();
    }

    if (gameState === "menu" && keyCode === ENTER) {
        gameState = "playing";
        startTime = millis();
        obstacles = [];
        obstacleSpeed = 2;
        waveSpeed = 0.01;
    } else if (gameState === "gameOver" && key === 'R') {
        gameState = "menu";
    }
}

