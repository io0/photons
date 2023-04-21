renderWave = (color, linePoints) => {
    noFill();
    stroke(color);
    strokeWeight(1);
    beginShape();
    for (let i = 0; i < linePoints.length; i++) {
        vertex(linePoints[i].x, linePoints[i].y);
    }
    endShape();
}
class Wave {
    constructor(wavelength, startPos = height/2, amplitude = 100, velocity=0.1) {
        // c/wavelength = frequency
        // frequency * 2pi = angular frequency
        // exp(wt - kx), vk = w

        // initialize array of points between 0 and width
        this.x = [];
        for (let i = 0; i < width; i += 1) {
            this.x.push(i);
        }
        this.y = [];
        this.w = 2 * Math.PI / wavelength * velocity;
        this.k = 2 * Math.PI / wavelength;
        this.linePoints = [];
        this.startPos = startPos;
        this.amplitude = amplitude;
        this.t = 0;
        // a color between pink and blue depending on the wavelength
        this.color = color(255 - wavelength, 100, wavelength);
        // this.color 
    }
    update () {
        this.t += deltaTime;
        // console.log(this.t)
        this.linePoints = this.x.map(x => {
            let y = Math.sin(this.k * x - this.w * this.t) * this.amplitude + this.startPos;
            return createVector(x, y);
        });
    }

    show() {
        renderWave(this.color, this.linePoints);
    }
}

class Photon {
    constructor(x, y, wavelength, amplitude, period) {
      this.x = x;
      this.y = y;
      this.wavelength = wavelength;
      this.amplitude = amplitude;
      this.period = period;
      this.speed = this.wavelength / this.period;
      this.tailLength = 10;
      this.tailPositions = [];
    }
  
    update() {
      // Calculate the y-coordinate of the photon using a sine wave
      this.y = height / 2 + this.amplitude * sin(TWO_PI * this.x / this.wavelength);
  
      // Add the current position of the photon to the tail positions array
      this.tailPositions.push(createVector(this.x, this.y));
  
      // Remove the oldest position from the tail positions array if it exceeds the tail length
      if (this.tailPositions.length > this.tailLength) {
        this.tailPositions.shift();
      }
  
      // Update the x-coordinate of the photon
      this.x += this.speed;
  
      // Restart the photon's path when it reaches the right edge of the canvas
      if (this.x > width + this.wavelength) {
        this.x = -this.wavelength;
        this.tailPositions = [];
      }
    }
  
    show() {
      // Draw the photon tail
      noFill();
      stroke(0, 255, 255, 128);
      strokeWeight(2);
      beginShape();
      for (let i = 0; i < this.tailPositions.length; i++) {
        vertex(this.tailPositions[i].x, this.tailPositions[i].y);
      }
      endShape();
  
      // Draw the photon
      noStroke();
      fill(0, 255, 255);
      ellipse(this.x, this.y, 10, 10);
    }
  }
  
  let photon;
let waves;
function setup() {
  createCanvas(800, 600);
  photon = new Photon(0, height / 2, 200, 100, 50);
  // create 10 waves
    waves = [];
    for (let i = 0; i < 10; i++) {
        waves.push(new Wave(i*20 + 100));
    }
}

function draw() {
  background(0);
  photon.update();
  photon.show();

  // update and show waves
    for (let i = 0; i < waves.length; i++) {
        waves[i].update();
        waves[i].show();
    }
}
