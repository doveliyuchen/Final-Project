let blo
let play
let fallingBlock

function setup() {

  play = new Playfield(20, 10)
  createCanvas(windowWidth, windowHeight);
  blo = new Block(1)
  newBlock();
}

function draw() {
  // 
  // 
  play.display();
  blo.display();
}

function mouseDragged() {


  translate(mouseX, mouseY)
  blo.display();

}
function newBlock() {
	if (fallingBlock) {
		playfield.addToGrid(fallingBlock);
	}
	
	const block = ['1', '2', '3', '4']
	const choice = random(block);
	fallingBlock = new Block(choice, playfield);
	
	redraw();

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
    this.borderSize = 4;

    // show the grid line
    this.gridlines = true;
  }

addToGrid(block) {

}
  gengXin() {
    for (let i = 0; i < this.rows; i++) {
      this.ge[i] = new Array(this.cols).fill(this.foreground);
    }
  }


  display() {
    // Draw the border and gridlines	
    let bs = this.borderSize
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


}

class Block {

  constructor(type, playfield) {
    this.type = type;
    this.playfield= play
    //this.cellSize = playfield.cellSize;
    //this.boardSize = playfield.boardSize;
  }
  display() {
    if (this.type === 1) {
      rect(0, 0, this.cellSize, this.cellSize)
    } else if (this.type === 2) {
      rect(0, 0, this.cellSize, 2*this.cellSize)

    } else if (this.type === 3) {
      rect(0, 0, this.cellSize, 3*this.cellSize)
    } else if (this.type === 4) {
      rect(0, 0, this.cellSize, 4*this.cellSize)
    }

  }
  

//will replace it by cell size
}