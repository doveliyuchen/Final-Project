let paused, pla, fallingBlock

const width = 10;
const height = 22;
let prev=0
function setup() {

  pla = new Playfield(height, width)
  createCanvas(windowWidth, windowHeight);

  newBlock();
}

function draw() {

  let curr = millis();
  let delta = curr - prev;
  prev = curr;

  // Update


   if (!paused){
  fallingBlock.update(delta);}

  // move down block and spawn a new one

  if (fallingBlock.timeToFall()) {

    fallingBlock.resetTime();
    fallingBlock.moveDown();

    if (!pla.isValid(fallingBlock)) {
      fallingBlock.moveUp();
      newBlock();
    }
  }



  pla.clearLines();


  // Draw


  background(251);

  pla.display();
  fallingBlock.display();
print(fallingBlock.x)

}

function mouseDragged() {

fallingBlock.x=floor(map(mouseX,0,windowWidth,0,10))


}

function newBlock() {
  if (fallingBlock) {
    pla.addToGrid(fallingBlock);
  }

  const blocks = ['1', '2', '3', '4']
  const choice = random(blocks);
  fallingBlock = new Block(choice, pla);

  redraw();

}

function keyPressed() {

    switch (key) {
      case 'p':
        paused = !paused;
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
    //     if (this.type === 1) {
    //       rect(0, 0, this.cellSize, this.cellSize)
    //     } else if (this.type === 2) {
    //       rect(0, 0, 2*this.cellSize, this.cellSize)

    //     } else if (this.type === 3) {
    //       rect(0, 0, 3*this.cellSize, this.cellSize)
    //     } else if (this.type === 4) {
    //       rect(0, 0, 4*this.cellSize, this.cellSize)
    //     }
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
    ['#30FCFF']

  ],



  2: [

    ['#FFF062', '#FFF062'],
    [null, null]

  ],





  3: [

    ['#FF3000', '#FF3000', '#FF3000'],
    [null, null, null],
    [null, null, null]
  ],




  4: [

    ['#0DFF32', '#0DFF32', '#0DFF32', '#0DFF32'],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null]
  ]




}