let pacman1, pacman2;
let pathPoints = [];

function setup() {
    let canvas = createCanvas(340, 340);
    canvas.parent(document.querySelector('.canvas-container'));

    pathPoints = [
        { x: 0, y: 0 },
        { x: width, y: 0 },
        { x: width, y: height },
        { x: 0, y: height }
    ];

    pacman1 = new PacMan(0, 0, 2, 0, color(249, 201, 0), pathPoints, 0);
    pacman2 = new PacMan(width, height, -2, 0, color(0, 191, 255), pathPoints, 2);
}

function draw() {
    clear();
    pacman1.moveAlongPath();
    pacman1.display();
    pacman2.moveAlongPath();
    pacman2.display();
}

class PacMan {
    constructor(x, y, dx, dy, c, path, startPointIndex) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = 30;
        this.color = c;
        this.mouthOpen = true;
        this.counter = 0;
        this.mouthSpeed = 20; 
        this.path = path;
        this.currentPointIndex = startPointIndex;
        this.targetPoint = path[this.currentPointIndex];
    }

    moveAlongPath() {
        let angle = atan2(this.targetPoint.y - this.y, this.targetPoint.x - this.x);
        this.dx = cos(angle) * 2;
        this.dy = sin(angle) * 2;
        this.x += this.dx;
        this.y += this.dy;

        if (dist(this.x, this.y, this.targetPoint.x, this.targetPoint.y) < 2) {
            this.currentPointIndex = (this.currentPointIndex + 1) % this.path.length;
            this.targetPoint = this.path[this.currentPointIndex];
        }
    }

    display() {
        fill(this.color);
        noStroke();
        let angle = this.mouthOpen ? QUARTER_PI : 0;
        arc(this.x, this.y, this.size, this.size, angle, TWO_PI - angle);

        this.counter++;
        if (this.counter > this.mouthSpeed) {
            this.mouthOpen = !this.mouthOpen;
            this.counter = 0;
        }
    }
}