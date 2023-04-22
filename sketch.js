renderWave = (color, linePoints) => {
  noFill();
  stroke(color);
  strokeWeight(1);
  beginShape();
  for (let i = 0; i < linePoints.length; i++) {
    vertex(linePoints[i].x, linePoints[i].y);
  }
  endShape();
};

// Define a function called "frequencyToRgb" that takes an unscaled frequency as a parameter
function frequencyToRgb(frequency) {
  // Calculate the RGB values using the sine function
  var red = Math.sin(frequency * 2 * Math.PI);
  var green = Math.sin(frequency * 2 * Math.PI + (2 * Math.PI) / 3);
  var blue = Math.sin(frequency * 2 * Math.PI + (4 * Math.PI) / 3);

  // Scale the RGB values to the range of 0 to 255
  var r = Math.round((red + 1) * 128);
  var g = Math.round((green + 1) * 128);
  var b = Math.round((blue + 1) * 128);

  // Return the RGB color as a string in the format "rgb(r, g, b)"
  return color(r, g, b);
}

function frequencyToPastelRgb(frequency) {
  var red = Math.sin(frequency * 2 * Math.PI) * 0.5 + 0.5;
  var green = Math.sin(frequency * 2 * Math.PI + (2 * Math.PI) / 3) * 0.5 + 0.5;
  var blue = Math.sin(frequency * 2 * Math.PI + (4 * Math.PI) / 3) * 0.5 + 0.5;

  var r = Math.round(red * 155 + 100);
  var g = Math.round(green * 155 + 100);
  var b = Math.round(blue * 155 + 100);

  return color(r, g, b);
}

class Wave {
  constructor(
    w,
    highestFrequency,
    startPos = height / 2,
    amplitude = 100,
    velocity = 0.1
  ) {
    // c/wavelength = frequency
    // frequency * 2pi = angular frequency
    // exp(wt - kx), vk = w

    // initialize array of points between 0 and width
    this.x = [];
    for (let i = 0; i < width; i += 5) {
      this.x.push(i);
    }
    this.y = [];
    this.w = w;
    this.k = w / velocity;
    let wavelength = (2 * Math.PI) / this.k;
    // this.w = ((2 * Math.PI) / wavelength) * velocity;
    // this.k = (2 * Math.PI) / wavelength;
    this.linePoints = [];
    this.startPos = startPos;
    this.amplitude = amplitude;
    this.t = 0;
    // a color between pink and blue depending on the wavelength
    this.color = frequencyToPastelRgb(w / highestFrequency);
    // this.color
  }
  update() {
    this.t += deltaTime;
    // console.log(this.t)
    this.linePoints = this.x.map((x) => {
      let y =
        Math.sin(this.k * x - this.w * this.t) * this.amplitude + this.startPos;
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
    this.y =
      height / 2 + this.amplitude * sin((TWO_PI * this.x) / this.wavelength);

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
let N = 10;
let velocity = 0.1;
let d, wf, w0;
let maxFreq = 0.01;
function setup() {
  d = width / 0.2; // cavity length
  wf = (velocity * Math.PI) / d; // fundamental frequency

  w0 = 0 * wf; // central frequency
  createCanvas(800, 600);
  photon = new Photon(0, height / 2, 200, 100, 50);
  // create 10 waves
  waves = [];
  console.log({ maxFreq });
  for (let i = -N; i < N; i++) {
    waves.push(new Wave(i * wf + w0, maxFreq));
  }
}

function draw() {
  // background(255, 255, 255);
  background(20, 0, 80);
  // photon.update();
  // photon.show();
  let sumX = waves[0].x;

  // update and show waves
  for (let i = 0; i < waves.length; i++) {
    waves[i].update();
    waves[i].show();
  }
  let intensity = sumX.map((x, i) => {
    let y = 0;
    waves.forEach((wave) => {
      y += wave.linePoints[i].y - wave.startPos;
    });
    y = y / waves.length + height / 2;
    return createVector(x, y);
  });
  renderWave(color(255, 255, 255), intensity);
}
