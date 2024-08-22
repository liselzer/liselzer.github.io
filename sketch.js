function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
  }
  
let n = 0;

function draw() {
    clear();
    fill(n);
    noStroke();
    circle(width / 2, height / 2, 50);
    n += 2.1;
    if (n >= 255) {
      n -= 255;
    }
  }