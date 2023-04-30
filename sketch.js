let photon;
let waves;
let forwardWaves = [];
let backwardWaves = [];
let N = 12;
let velocity = 0.1;
let d, wf, w0;
let maxFreq = 0.015;
let Nfundamental = 5;
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
function drawComb(waves) {
  for (let i = 0; i < waves.length; i++) {
    let w = waves[i].w * 50000;
    console.log({ w });
    stroke(waves[i].color);
    strokeWeight(1);
    // beginShape();
    line(w, 0, w, 10);
    // endShape();
  }
}

// Define a function called "frequencyToRgb" that takes an unscaled frequency as a parameter
function frequencyToRgb(w, maxFrequency = 0.02) {
  let frequency = Math.min(w, maxFrequency) / maxFrequency;
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

function frequencyToPastelRgb(w) {
  let frequency = Math.min(w, maxFreq) / maxFreq;
  frequency = frequency * 0.9 + 0.1;
  // frequency = Math.min(frequency, 0.95);
  // let frequency = 0.01;

  var red = Math.sin(frequency * 2 * Math.PI) * 0.5 + 0.5;
  var blue = Math.sin(frequency * 2 * Math.PI + (2 * Math.PI) / 3) * 0.5 + 0.5;
  var green = Math.sin(frequency * 2 * Math.PI + (4 * Math.PI) / 3) * 0.5 + 0.5;

  // var red = Math.max(Math.sin(frequency * 2 * Math.PI), 0);
  // var blue = Math.max(Math.sin(frequency * 2 * Math.PI + (3 * Math.PI) / 3), 0);
  // var green = Math.max(
  //   Math.sin(frequency * 2 * Math.PI + (4 * Math.PI) / 3),
  //   0
  // );

  var r = Math.round(red * 200 + 50);
  var g = Math.round(green * 200 + 50);
  var b = Math.round(blue * 200 + 50);
  // var r = Math.round(red * 255);
  // var g = Math.round(green * 255);
  // var b = Math.round(blue * 255);

  return color(r, g, b);
}

class Wave {
  constructor(
    w,
    highestFrequency,
    velocity = 0.1,
    startPos = height / 2,
    amplitude = 50
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
    this.velocity = velocity;
    this.k = w / velocity;
    let wavelength = (2 * Math.PI) / this.k;
    // this.w = ((2 * Math.PI) / wavelength) * velocity;
    // this.k = (2 * Math.PI) / wavelength;
    this.linePoints = [];
    this.startPos = startPos;
    this.amplitude = amplitude;
    this.t = 0;
    // a color between pink and blue depending on the wavelength
    this.color = frequencyToPastelRgb(w);
    // this.color
  }
  setFrequency(w) {
    this.w = w;
    this.k = w / this.velocity;
    this.color = frequencyToPastelRgb(w);
  }
  update() {
    this.t += deltaTime;
    // console.log(this.t)
    this.linePoints = this.x.map((x) => {
      let y =
        Math.cos(this.k * x - this.w * this.t) * this.amplitude + this.startPos;
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

// add a button to increment the central frequency
function incrementCentralFreq() {
  Nfundamental += 1;
  w0 = Nfundamental * wf;

  for (let i = 0; i < forwardWaves.length; i++) {
    forwardWaves[i].setFrequency(i * wf + w0);
    backwardWaves[i].setFrequency(i * wf + w0);
  }
}

function decrementCentralFreq() {
  Nfundamental -= 1;
  w0 = Nfundamental * wf;
  for (let i = 0; i < forwardWaves.length; i++) {
    forwardWaves[i].setFrequency(i * wf + w0);
    backwardWaves[i].setFrequency(i * wf + w0);
  }
}

let slider = document.getElementById("myRange");
let cavityLength = document.getElementById("line");
function changeCavityLength() {
  // slider to change the cavity length
  d = slider.value;
  wf = (velocity * Math.PI) / d;
  w0 = Nfundamental * wf;
  for (let i = 0; i < forwardWaves.length; i++) {
    forwardWaves[i].setFrequency(i * wf + w0);
    backwardWaves[i].setFrequency(i * wf + w0);
  }
  cavityLength.style.width = slider.value + "px";

  console.log({ maxFreq: N * wf + w0 });
}

function setup() {
  d = width / 0.1; // cavity length
  wf = (velocity * Math.PI) / d; // fundamental frequency

  w0 = Nfundamental * wf; // central frequency
  createCanvas(800, 600);
  photon = new Photon(0, height / 2, 200, 100, 50);
  // create 10 waves
  waves = [];
  console.log({ maxFreq: N * wf });
  for (let i = 0; i < N; i++) {
    let forward = new Wave(i * wf + w0, maxFreq, velocity);
    let backward = new Wave(i * wf + w0, maxFreq, -velocity);
    // waves.push({ forward, backward });
    forwardWaves.push(forward);
    backwardWaves.push(backward);
  }
  console.log(waves);
}
function sumWaves(waves) {
  let X = waves[0].x;
  let linePoints = X.map((x, i) => {
    let y = 0;
    waves.forEach((wave) => {
      y += wave.linePoints[i].y - wave.startPos;
    });
    y = y / waves.length + height / 2;
    return createVector(x, y);
  });
  return linePoints;
}

let standingWaves = true;
function draw() {
  // background(255, 255, 255);
  background(20, 0, 80);
  // photon.update();
  // photon.show();
  // let sumX = waves[0].x;

  // update and show waves
  for (let n = 0; n < forwardWaves.length; n++) {
    let i = forwardWaves.length - n - 1;
    forwardWaves[i].update();
    backwardWaves[i].update();
    if (standingWaves) {
      const linePoints = sumWaves([forwardWaves[i], backwardWaves[i]]);
      renderWave(forwardWaves[i].color, linePoints);
    } else {
      forwardWaves[i].show();
    }
  }
  if (standingWaves) {
    intensity = sumWaves([...forwardWaves, ...backwardWaves]);
  } else {
    intensity = sumWaves(forwardWaves);
  }
  drawComb(forwardWaves);
  renderWave(color(255, 255, 255), intensity);
}
