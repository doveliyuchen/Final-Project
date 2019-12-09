let paused, pla, fallingBlock, leng;

const width = 10;
const height = 18;
let prev = 0
let c = 0;
let speechW;
let score = 0;

function preload() {
  soundFormats('mp3', 'ogg');
  mySound = loadSound('1.mp3');
  mySound1 = loadSound('dingdong.mp3');
  mySound2 = loadSound('5427.mp3');
  mySound3 = loadSound('9297.mp3');

}



function setup() {

  speechW = new p5.SpeechRec('en-US'); // new P5.SpeechRec object
  speechW.continuous = true; // do continuous recognition
  speechW.interimResults = true;
  speechW.onResult = movement;
  pla = new Playfield(height, width)
  createCanvas(displayWidth, 0.8 * displayHeight);
  speechW.start();
  mySound.setVolume(0.3);
  mySound1.setVolume(0.3);
  mySound2.setVolume(0.3);
  mySound3.setVolume(0.3);
  mySound.play();

  newBlock();
}

function draw() {
  translate(displayWidth / 2.5, 200)
  let curr = millis();
  let delta = curr - prev;
  prev = curr;

  // Update
if (score>35){
  score=score-floor(curr/4000)
} else if (score<0){
  c=1
}
  if (c === 0) {


    if (!paused) {
      fallingBlock.update(delta);
    }
    // move down block and spawn a new one
    if (fallingBlock.timeToFall()) {
      fallingBlock.resetTime();
      fallingBlock.moveDown();
    }
    //will have a function to check the previous position and to either to move to avoid overlap

    if (!pla.isValid(fallingBlock)) {
      fallingBlock.moveUp()
      mySound1.play();
      if (fallingBlock.y < 1) {
        c = 1
        mySound2.play();
        mySound.stop();
      } else {
        newBlock();

      }
    }

    
    checkBorder()
    pla.clearLines();
    background(255);
    pla.display();
    fallingBlock.display();
    push();
    fill('#ECC1FF');
    textSize(40)
    text('Score:' + score, 310, -30);
    pop();
  } else if(c===1){

    push()
    textSize(40)
    fill(0)
    text('Game Over', 100, 400);
    pop()
  }



}

function mouseDragged() {
if (score>10){
  if (mouseX < 0) {
    mouseX = 0
  }
  fallingBlock.x = floor(map(mouseX, 0, displayWidth, 0, 10 - leng))

  while (!pla.isValid(fallingBlock)) {
    fallingBlock.moveUp();

  }
}

}

function movement() {

  var control = speechW.resultString.toLowerCase();
  if (control.search("left") !== -1) {
    fallingBlock.moveLeft();
  } else if (control.search("right") !== -1) {
    fallingBlock.moveRight();
  } else if (control.search("down") !== -1) {
    fallingBlock.moveDown();
  }
  if (fallingBlock.x < 0) {
    fallingBlock.x = 0
  }
  if (fallingBlock.x > 10 - leng) {
    fallingBlock.x = 10 - leng
  }
  console.log(control);
}


function checkBorder() {
if (fallingBlock.x <= 0) {
    fallingBlock.x = 0
  }
  if (fallingBlock.x > 10 - leng) {
    fallingBlock.x = 10 - leng
  }
}

function newBlock() {
  if (fallingBlock) {
    pla.addToGrid(fallingBlock);
  }

  const blocks = ['1', '2', '3', '4']
  const choice = random(blocks);
  fallingBlock = new Block(choice, pla);
  leng = types[choice].length
  redraw();

}

function keyPressed() {

  switch (key) {
    case 'p':
      paused = !paused;
      break;
    case ' ':

      while (pla.isValid(fallingBlock)) {
        fallingBlock.moveDown();
      }
      break;
  }
}




class Playfield {

  constructor(w, h) {
    // colors
    this.foreground = (255);
    this.background = (100);

    // dimensions and grid
    this.rows = w;
    this.cols = h;
    this.ge = [];
    this.gengXin();

    // drawing sizes
    this.cellSize = 44;
    this.bordSize = 4;

    // show the grid line
    this.gridlines = true;
  }

  addToGrid(block) {
    for (let row = 0; row < block.size; row++) {
      for (let col = 0; col < block.size; col++) {

        if (block.cells[row][col] != null) {
          let gridRow = block.y + row;
          let gridCol = block.x + col;

          this.ge[gridRow][gridCol] =
            block.cells[row][col];
        }

      }
    }

  } //end of add


  clearLines() {

    for (let row = this.rows - 1; row >= 0; row--) {

      // if this row is full
      if (!this.ge[row].includes(this.foreground)) {
        // remove the row
        this.ge.splice(row, 1)
        mySound3.play();
        score = score + 5;
        // and add an empty row to the top
        this.ge.unshift(new Array(this.cols).fill(this.foreground));
      }

    }

  }


  gengXin() {
    for (let i = 0; i < this.rows; i++) {
      this.ge[i] = new Array(this.cols).fill(this.foreground);
    }
  } //update the new one


  display() {
    // Draw the border and gridlines  
    let bs = this.bordSize
    let cs = this.cellSize

    if (this.gridlines) {
      fill(this.background);
    } else {
      fill(this.foreground);
    }

    stroke(this.background)
    strokeWeight(bs);
    let midbs = floor(bs / 2)

    rect(midbs, midbs, cs * this.cols + bs - 1, cs * this.rows + bs - 1)
    // Draw cells over the big background

    for (let row = 0; row < this.ge.length; row++) {
      for (let col = 0; col < this.ge[row].length; col++) {

        // fill the colors of each cell
        fill(this.ge[row][col]);
        noStroke();
        rect(cs * col + bs, cs * row + bs, cs - 1, cs - 1);
      }
    }

  } // end of display()

  isValid(block) {

    for (let row = 0; row < block.size; row++) {
      for (let col = 0; col < block.size; col++) {

        if (block.cells[row][col] != null) {

          let gridRow = block.y + row;
          let gridCol = block.x + col;

          if (gridRow < 0 || gridRow >= this.rows ||
            gridCol < 0 || gridCol >= this.cols ||
            this.ge[gridRow][gridCol] != this.foreground)
            return false;
        }

      }
    }

    return true;

  }

}

class Block {

  constructor(type, playfield, x, y) {
    this.type = type;
    this.cells = types[type];
    this.size = this.cells.length;

    this.cellSize = pla.cellSize;
    this.bordSize = pla.bordSize;

    if (this.x === undefined) {
      this.x = floor((pla.cols - this.size) / 2)

    } else {
      this.x = x;
    } //check if x is undefined and set the value.

    this.y = y || 0; //y is either 0 or y

    this.tim = 1000 // in ms
    this.timeB = 0; // time since last drop

  }

  update(time) {

    this.timeB += time;

  }


  timeToFall() {
    return this.timeB > this.tim

  }

  resetTime() {
    this.timeB = 0;
  }




  display() {

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {

        if (this.cells[row][col]) {
          let x = this.x + col;
          let y = this.y + row;

          let cs = this.cellSize;
          let bs = this.bordSize;

          fill(this.cells[row][col])
          rect(bs + cs * x, bs + cs * y, cs - 1, cs - 1);


        }

      }
    }
  } //draw the blocks out



  moveDown() {
    this.y++;
  }
  moveRight() {
    this.x++;
  }
  moveLeft() {
    this.x--;
  }
  moveUp() {
    this.y--;
  }

  //movement functions
}


//set up the blocks types by arrays with color
let types = {
  1: [
    ['#AAF7FF']

  ],

  2: [

    ['#A4FFC8', '#A4FFC8'],
    [null, null]

  ],

  3: [

    ['#FF8CA8', '#FF8CA8', '#FF8CA8'],
    [null, null, null],
    [null, null, null]
  ],

  4: [

    ['#FFFF99', '#FFFF99', '#FFFF99', '#FFFF99'],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null]
  ]
}