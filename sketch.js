let pacman1, pacman2;

function setup() {
    let canvas = createCanvas(340, 340);
    canvas.parent(document.querySelector('.canvas-container'));
    pacman1 = new PacMan(0, 10, 2, 0);
    pacman2 = new PacMan(width, height - 10, -2, 0);
}

function draw() {
    clear();
    pacman1.move();
    pacman1.display();
    pacman2.move();
    pacman2.display();
}

class PacMan {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = 30;
        this.mouthOpen = true;
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x < 0 || this.x > width) this.dx *= -1;
        if (this.y < 0 || this.y > height) this.dy *= -1;
    }

    display() {
        fill(249, 201, 0);
        let angle = this.mouthOpen ? QUARTER_PI : 0;
        arc(this.x, this.y, this.size, this.size, angle, TWO_PI - angle);
        this.mouthOpen = !this.mouthOpen;
    }
}