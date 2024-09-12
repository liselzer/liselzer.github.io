let surfer;
let surferImage;
let boySurferImage;
let sharkFinImage;
let rockImage;
let backgroundImage;
let obstacles = [];
let pebbles = [];
let waveOffset = 0;
let gameOver = false;
let score = 0;
let bestTime = 0;  // New variable to store the highest time
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
let surferType = "girl"; // Default surfer type
let upKeyIsPressed = false;
let downKeyIsPressed = false;
let song;

function preload() {
    song = loadSound("waves.mp3");
    surferImage = loadImage('girlsurfer.webp');
    boySurferImage = loadImage('boysurfer.png');
    sharkFinImage = loadImage('shark.png');
    rockImage = loadImage('rock.png');
    backgroundImage = loadImage('sunset.avif');
    backgroundMusic = loadSound('waves.mp3');
    
    // Load sound effects
    sharkChompSound = loadSound('sharkChompSound.mp3');
    brokenBoardSound = loadSound('brokenBoardSound.mp3');
}

function setup() {
    surf = createCanvas(800, 700);
    surf.parent("surfer");
    frameRate(60);
    waveBaseY = height * 0.6;
    generatePebbles(); 
    if (song) {
        song.loop(); 
    }
}

function draw() {
    if (gameState === "menu") {
        drawMenu();
    } else if (gameState === "play") {
        image(backgroundImage, 0, 0, width, height);
        drawWave();
        drawSandBottom();

        if (!gameOver) {
            surfer.update();
            surfer.display();

            if (frameCount % 30 === 0) {
                let yPosition = random(waveBaseY - waveAmplitude + 40, waveBaseY + waveAmplitude - 40);
                let isSharkFin = random() < 0.3;
                obstacles.push(new Obstacle(width, yPosition, isSharkFin));
            }

            for (let i = obstacles.length - 1; i >= 0; i--) {
                obstacles[i].update();
                obstacles[i].display();

                if (surfer.hits(obstacles[i])) {
                    gameOver = true;

                    // Set the message and play the respective sound based on the type of obstacle
                    if (obstacles[i].isSharkFin) {
                        message = "Uh-oh! You got eaten by a shark.";
                        sharkChompSound.play(); // Play shark chomp sound
                    } else {
                        message = "Uh-oh! You broke your board.";
                        brokenBoardSound.play(); // Play broken board sound
                    }
                }

                if (obstacles[i].offscreen()) {
                    obstacles.splice(i, 1);
                }
            }

            if (millis() - lastSpeedIncreaseTime > speedIncreaseInterval) {
                obstacleSpeed += 0.5 + (elapsedTime / 10000);
                waveSpeed += 0.002; 
                lastSpeedIncreaseTime = millis();
            }

            fill(255);
            textSize(20);
            textAlign(LEFT);
            text('Score: ' + bestTime + 's', 10, 30);
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
            drawPopup(message); // Draw the pop-up box with the message
            fill(255);
            textSize(20);
            textAlign(CENTER);
            text('Press R to Restart', width / 2, height / 2 + 40); // Indicate to restart the game
        }
    }
}

function drawMenu() {
    background(135, 206, 250); // Sky blue background

    // Title
    fill(255);
    textSize(60);
    textAlign(CENTER);
    text('Surfer Game', width / 2, height / 2 - 100);

    // Instructions
    textSize(24);
    fill(255);
    text('Choose Your Surfer:', width / 2, height / 2 - 50);


    // Girl Surfer Button
    let girlButtonX = width / 2 - 170;
    let buttonY = height / 2 + 60;
    fill(240);
    rect(girlButtonX, buttonY, 150, 200, 10); // Button for girl surfer
    image(surferImage, girlButtonX + 10, buttonY + 20, 130, 130); // Adjusted position
    fill(0);
    textAlign(CENTER);
    textSize(20);
    text('Girl Surfer', girlButtonX + 75, buttonY + 170); // Adjusted position

    // Boy Surfer Button
    let boyButtonX = width / 2 + 20;
    fill(240);
    rect(boyButtonX, buttonY, 150, 200, 10); // Button for boy surfer
    image(boySurferImage, boyButtonX + 10, buttonY + 20, 130, 130); // Adjusted position
    fill(0);
    textAlign(CENTER);
    textSize(20);
    text('Boy Surfer', boyButtonX + 75, buttonY + 170); // Adjusted position

    // Footer Text
    fill(255);
    textSize(16);
    textAlign(CENTER);
    
}

function mousePressed() {
    // Check if the girl surfer button is clicked
    if (mouseX > width / 2 - 170 && mouseX < width / 2 - 20 && mouseY > height / 2 + 60 && mouseY < height / 2 + 260) {
        surferType = "girl";
        surferImage = loadImage('girlsurfer.webp');
        gameState = "play";  // Start the game when the girl surfer is selected
        backgroundMusic.loop();
        startNewGame();
    }
    // Check if the boy surfer button is clicked
    else if (mouseX > width / 2 + 20 && mouseX < width / 2 + 170 && mouseY > height / 2 + 60 && mouseY < height / 2 + 260) {
        surferType = "boy";
        surferImage = loadImage('boysurfer.png');
        gameState = "play";  // Start the game when the boy surfer is selected
        startNewGame();
    }
}

function drawWave() {
    let waveColor = color(0, 102, 204);
    let foamColor = color(255, 255, 255, 150);

    noStroke();
    fill(waveColor);

    beginShape();
    for (let x = 0; x <= width; x += .5) {
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

function drawSandBottom() {
    fill(194, 178, 128); // Sand color (light brown)
    rect(0, height - 50, width, 150); // Increase the height of the sandy bottom to 150 pixels

    // Draw pebbles
    for (let i = 0; i < pebbles.length; i++) {
        fill(pebbles[i].color);
        ellipse(pebbles[i].x, pebbles[i].y, pebbles[i].size, pebbles[i].size * 0.7);
    }
}

function generatePebbles() {
    let numPebbles = 50; // Number of pebbles
    for (let i = 0; i < numPebbles; i++) {
        let pebble = {
            x: random(0, width),
            y: random(height - 48, height),
            size: random(10, 30), // Size of pebbles
            color: color(random(120, 160), random(100, 130), random(90, 110)) // Pebble color (darker shades)
        };
        pebbles.push(pebble);
    }
}

function startNewGame() {
    surfer = new Surfer(100, waveBaseY);
    obstacles = [];
    pebbles = []; // Reset pebbles
    generatePebbles(); // Regenerate pebbles
    score = 0;
    gameOver = false;
    startTime = millis();
    obstacleSpeed = 3;
    waveSpeed = 0.01;
    lastSpeedIncreaseTime = millis();
    loop();
    backgroundMusic.setVolume(1.0);
    backgroundMusic.loop();
    
}

class Surfer {
    constructor(x, y) {
        this.x = x;
        this.y = waveBaseY - waveAmplitude + 100;
        this.size = 80;
        this.ySpeed = 0;
    }

    update() {
        this.y += this.ySpeed;
        // Allow the surfer to go 50 pixels lower than the current limit
        this.y = constrain(this.y, waveBaseY - waveAmplitude + 10, waveBaseY + waveAmplitude+150);
        console.log("Y Position:", this.y, "Y Speed:", this.ySpeed);
    
    
        if (upKeyIsPressed) {
            this.ySpeed = -5; // Move up when the up key is pressed
        } else if (downKeyIsPressed) {
            this.ySpeed = 5; // Move down when the down key is pressed
        } else {
            this.ySpeed = 0; // Stop vertical movement when no key is pressed
        }
    }

    display() {
        image(surferImage, this.x, this.y, this.size, this.size);
    }

    hits(obstacle) {
        let d = dist(this.x, this.y, obstacle.x, obstacle.y);
        return d < this.size / 2 + obstacle.size / 2;
    }
}

class Obstacle {
    constructor(x, y, isSharkFin) {
        this.x = x;
        this.y = random(370, 800);
        this.size = random(20, 100);
        this.isSharkFin = isSharkFin;
    }

    update() {
        this.x -= obstacleSpeed;
    }

    display() {
        if (this.isSharkFin) {
            image(sharkFinImage, this.x, this.y, this.size, this.size);
        } else {
            image(rockImage, this.x, this.y, this.size, this.size);
        }
    }

    offscreen() {
        return this.x < -this.size;
    }
}

// Capture the key press and release events for movement
function keyPressed() {
    if (keyCode === UP_ARROW) {
        upKeyIsPressed = true;
    } else if (keyCode === DOWN_ARROW) {
        downKeyIsPressed = true;
    }

    if (gameOver && key === 'r') {
        if (elapsedTime / 1000 > bestTime) {
            bestTime = Math.floor(elapsedTime / 1000); // Update the highest time
        }
        startNewGame();
    }

    if (gameState === "menu" && key === 'Enter') {
        gameState = "play";
        startNewGame();
    }
}

function keyReleased() {
    if (keyCode === UP_ARROW) {
        upKeyIsPressed = false;
    } else if (keyCode === DOWN_ARROW) {
        downKeyIsPressed = false;
    }
}

// Prevent default browser scrolling behavior
window.addEventListener("keydown", function (e) {
    if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);


function drawPopup(msg) {
    // Calculate message dimensions
    textSize(30);
    let msgWidth = textWidth(msg);
    let msgHeight = 30; // Approximate height of the text

    // Set padding and button dimensions
    let padding = 20;
    let buttonWidth = 150;
    let buttonHeight = 40;
    
    // Calculate box dimensions
    let boxWidth = max(msgWidth + padding * 2, buttonWidth + padding * 2);
    let boxHeight = msgHeight + padding * 2 + buttonHeight + 20; // Include space for the button and some margin

    // Draw the blue box
    fill(0, 0, 255, 150);
    rect((width - boxWidth) / 2, (height - boxHeight) / 2, boxWidth, boxHeight, 10);

    // Draw the message
    fill(255);
    textAlign(CENTER);
    text(msg, width / 2, (height - boxHeight) / 2 + padding + msgHeight);
}
    

