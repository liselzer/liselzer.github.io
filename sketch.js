let pacman1, pacman2;

function setup() {
    let canvas = createCanvas(340, 340);
    canvas.parent(document.querySelector('.canvas-container'));
    pacman1 = new PacMan(50, height / 2, 2, 0, color(249, 201, 0));
    pacman2 = new PacMan(width - 50, height / 2, -2, 0, color(0, 191, 255));
}

function draw() {
    clear();
    pacman1.moveTowards(pacman2);
    pacman1.display();
    pacman2.moveTowards(pacman1);
    pacman2.display();
}

class PacMan {
    constructor(x, y, dx, dy, c) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = 30;
        this.color = c;
        this.mouthOpen = true;
        this.counter = 0;
        this.mouthSpeed = 20; // Control mouth speed
    }

    moveTowards(target) {
        let angle = atan2(target.y - this.y, target.x - this.x);
        this.dx = cos(angle) * 2;
        this.dy = sin(angle) * 2;
        this.x += this.dx;
        this.y += this.dy;
    }

    display() {
        fill(this.color);
        noStroke();
        let angle = this.mouthOpen ? QUARTER_PI : 0;
        arc(this.x, this.y, this.size, this.size, angle, TWO_PI - angle);

        // Control mouth open/close speed
        this.counter++;
        if (this.counter > this.mouthSpeed) {
            this.mouthOpen = !this.mouthOpen;
            this.counter = 0;
        }
    }
}