//part of this code was inspired by https://editor.p5js.org/ARatherLongUsername/sketches/SkxeigFOX


let paused, pla, fallingBlock, leng, speechW, speechC, cute, pand;

const width = 10;
const height = 18;
let prev = 0
let c = 0;
let score = 0;
let d = 0;
let e = 0;
let g = 0;
let h = 0;
let delta = 10;

function preload() { // preload all the music/sound
  soundFormats('mp3', 'ogg');
  mySound = loadSound('1.mp3');
  mySound1 = loadSound('dingdong.mp3');
  mySound2 = loadSound('5427.mp3');
  mySound3 = loadSound('9297.mp3');
  img = loadImage('780.jpg');
}



function setup() {

  speechW = new p5.SpeechRec('en-US'); // set up speech based on speechrec object
  speechW.continuous = true; // it is a continuous recognition
  speechW.interimResults = true; // make result become string
  speechW.onResult = movement; // apply these result to the movement function
  pla = new Playfield(width, height) // make playfield
  createCanvas(windowWidth, windowHeight); // create the window for drawing
  speechW.start(); // start listen to speech
  mySound.setVolume(0.3);
  mySound1.setVolume(0.3);
  mySound2.setVolume(0.3);
  mySound3.setVolume(0.3); //set up the volume of music
  mySound.play(); // background sound play
  cute = new Cute(300, 300, 0.1);
  pand = new Panda(-370, -300, 1);
  newBlock();
  a1 = new Flower(650, 660, 120, 79, 0.5);
  a3 =new Flower(450,690,30,120,0.5);
  a4 = new Flower(-550,590,124,94,0.5);
  a5 = new Flower(-150,630,35,194,0.2);
  
 
}

function draw() {

  translate(windowWidth / 2.3, 200)
  if (score > 35) {
    score = round(score - prev / 5000) //challenge mode, if u got 35 points
  } else if (score < 0) {
    c = 1 //if ur score is negative(took too long to remove), you died
  } // score changed by time, and if score is less than 0, you lose;

  if (!paused) {
    fallingBlock.update();
  }
  
  if (c === 0) {
    if (!mySound.isPlaying()) {
      mySound.play();
    }
    // move down block and spawn a new one
    if (fallingBlock.timeToFall()) {
      fallingBlock.resetTime();
      fallingBlock.down();
    }
    //will have a function to check the previous position and to either to move to avoid overlap
    if (!pla.hasSpace(fallingBlock)) {
      fallingBlock.up()
      mySound1.play();
      
      if (fallingBlock.y < 1) {//no space! you died(no matter what y are u;
        c = 1
        mySound2.play();
        mySound.stop();
      } 
      else if (fallingBlock.y < 6 && fallingBlock.y > 4) {//if u stack a little, the space mode will change
        d = 1
        newBlock();
      } 
      else if (fallingBlock.y < 4 && fallingBlock.y > 2 && g === 0) {// remove two lines to help, but only happen once.
        g = 1
        newBlock();
      } 
      else {//generate new block
        newBlock();
      }
    }
    
    checkBorder()//check the border to avoid errors
    pla.remove();
      background(img)
    pla.display();
    
    fallingBlock.display();
    
    a1.dis();
    a3.dis();
    a4.dis();
    a5.dis();//flowers

    if (d === 1) {// helps
      cute.display()
    }
    if (g === 1) {
      pand.display()
    }
    
    push(); //score;
    fill(255);
    textSize(40)
    text('Score:' + score, 65, -20);
    pop();
  } 
  
  else if (c === 1) {
    push()
    textSize(40)
    fill(0)
    text('Game Over', 20, 200);
    pop() // game over, game end       
  }
}

function windowResized() {
  resizeCanvas(windowWidth,windowHeight);}




function mouseDragged() {
if (mouseIsPressed){
  while (!pla.hasSpace(fallingBlock)) {
      fallingBlock.up();
    }
  
}
  
  
  if (score > 1) {
    if (mouseX < 0) {
      mouseX = 0
    }if (mouseX>windowWidth){
      mouseX=windowWidth}
    fallingBlock.x = round(map(mouseX, 0, windowWidth, 0, 10 - leng))
    while (!pla.hasSpace(fallingBlock)) {
      fallingBlock.up();
    }
  }
} // use mouse to change its position if the score is higher than 5


function movement() {
  var control = speechW.resultString.toLowerCase();
  if (control.search("left") !== -1) {
    fallingBlock.left();
  } else if (control.search("right") !== -1) {
    fallingBlock.right();
  } else if (control.search("down") !== -1) {
    fallingBlock.down();
  }
  if (fallingBlock.x < 0) {
    fallingBlock.x = 0
  }
  if (fallingBlock.x > 10 - leng) {
    fallingBlock.x = 10 - leng
  }
  console.log(control);//show the array;
} // use voice to control the block


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
    pla.appear(fallingBlock);
  }
  const blocks = ['1', '2', '3', '4']
  const choice = random(blocks);
  fallingBlock = new Block(choice, pla);
  leng = types[choice].length
  redraw();
}


function mouseClicked() {

  if (d === 1) {//cat help
    let f = dist(300,300, mouseX-windowWidth / 2.3,  mouseY-200)
    if (f < 100 && f > -50) {
      e = 1
      d = 0
    }
  }
  if (g === 1) {// panda help
    let f = dist(300, 140, mouseX-windowWidth / 2.3, mouseY-200)
    if (f < 100 && f > 0) {
      g = 3;
      h = 1;
    }
  }
}

function keyPressed() {

  switch (key) {
    case 'p':
      paused = !paused;
      break;
    case ' ':
      if (e === 0) {
        while (pla.hasSpace(fallingBlock)) {
          fallingBlock.down();
        }
      } else {
        fallingBlock.y = fallingBlock.y + 18
        while (!pla.hasSpace(fallingBlock)) {
          fallingBlock.up();
        }
      }
      break;
  }

}


class Panda {

  constructor(x, y, a) {
    this.x = x;
    this.y = y;
    this.a = a;
  }

  display() {
    push();
    stroke(0);
    strokeWeight(1);
    scale(this.a);
    translate(this.x / this.a, this.y / this.a)
    //panda body
    fill(255);
    ellipse(700, 473, 55, 60);

    // panda ears
    fill(0);
    ellipse(675, 403, 20, 15);
    ellipse(725, 403, 20, 15);

    // head
    fill(255);
    ellipse(700, 430, 80, 60);

    //eye shadow and nose
    fill(0);
    ellipse(700, 430, 10, 5);
    ellipse(684, 423, 20, 15);
    ellipse(717, 423, 20, 15);
    // eyes and mouth
    fill(255);
    ellipse(683, 422, 10, 10);
    ellipse(716, 422, 10, 10);
    arc(694, 432, 12, 12, 0, PI / 1.8, OPEN);
    arc(706, 432, 12, 12, PI / 2.6, PI, OPEN);

    //bamboo in hand
    fill('#67D600');
    rect(689, 446, 20, 30);
    rect(689, 477, 20, 30);

    //panda feet and hands
    fill(0);
    ellipse(673, 465, 15, 20);
    ellipse(678, 470, 25, 15);
    ellipse(720, 470, 25, 15);
    ellipse(725, 465, 15, 20);
    ellipse(677, 493, 25, 19);
    ellipse(723, 493, 25, 19);

    // eye 
    stroke(0);
    strokeWeight(1);
    fill(0);
    ellipse(678 + 3, 422, 5, 5);
    ellipse(711 + 3, 422, 5, 5);

    pop()
  }


}

class Playfield {

  constructor(w, h) {
    // colors
    this.foreground = (255);
    this.background = (60);
    // dimensions and grid
    this.y = h;
    this.x = w;
    this.ge = [];
    this.fillin();

    // drawing sizes
    this.cellSize = 25;
    this.bsize = 4;

  }

  fillin() {
    for (let i = 0; i < this.y; i++) {
      this.ge[i] = new Array(this.x).fill(this.foreground);
    }
  } //create the array, and become foreground.
  display() {
    // Draw the border and gridlines  
    let bs = this.bsize
    let cs = this.cellSize
    fill(this.background);
    stroke(this.background)
    strokeWeight(bs);
    let midbs = floor(bs / 2)

    rect(midbs, midbs, cs * this.x + bs - 1, cs * this.y + bs - 1)
    // Draw cells over the big background
    for (let y = 0; y < this.ge.length; y++) {
      for (let x = 0; x < this.ge[y].length; x++) {
        // fill the colors of each cell
        fill(this.ge[y][x]);
        noStroke();
        rect(cs * x + bs, cs * y + bs, cs - 1, cs - 1);
      }
    }
  }


  appear(block) {// for the falling block, finally it colors the background
    
    for (let y = 0; y < block.size; y++) {
      for (let x = 0; x < block.size; x++) {
        if (block.cells[y][x] != null) {
          let gridY = block.y + y;
          let gridX = block.x + x;
          this.ge[gridY][gridX] =//make the color on the screen
            block.cells[y][x];
        }

      }
    }

  }


  remove() {//if the line is full(no foreground) it removes.
    for (let y = this.y - 1; y >= 0; y--) {
      // if this row is full
      if (this.ge[y].indexOf(this.foreground)===-1) {
        // remove the row
        this.ge.splice(y, 1)
        e = 0
        mySound3.play();
        score = score + 5;
        // and move down the top one
        this.ge.unshift(new Array(this.x).fill(this.foreground));
      }
      if (h === 1) {
        this.ge.splice(17, 1)
        this.ge.splice(16, 1)
        mySound3.play();
        this.ge.unshift(new Array(this.x).fill(this.foreground));
        this.ge.unshift(new Array(this.x).fill(this.foreground));
        h = 3;
      }

    }

  }

  hasSpace(block) {// to check if there is space for block, first, it should falls in the playfield, if not, false

    for (let y = 0; y < block.size; y++) {
      for (let x = 0; x < block.size; x++) {
        if (block.cells[y][x] != null) {
          let gridY = block.y + y;
          let gridX = block.x + x;
          if (gridY < 0 || gridY >= this.y ||
            gridX < 0 || gridX >= this.x ||
            this.ge[gridY][gridX] != this.foreground){//foreground means space, if there is no foreground, there is no space.
            return false;}
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
    this.bsize = pla.bsize;

    if (this.x === undefined) {
      this.x = floor((pla.x - this.size) / 2)
      //set the original place of new blocks
    } else {
      this.x = x;
    } //other case keep its position.
    this.y = y || 0; //y is either 0 or y
    this.tim = 1000 // in ms
    this.timeB = 0; // time since last drop

  }

  update() {
    this.timeB = delta + this.timeB; //update the time let new block generate, or pause.
  }


  timeToFall() {
    return this.timeB > this.tim// true or false

  }

  resetTime() {
    this.timeB = 0;//make pause, cuz 0 is smaller than 1000.
  }

  display() {// for this 2d array, draw each positon rectangle to form the block

    for (let y1 = 0; y1 < this.size; y1++) {
      for (let x1 = 0; x1 < this.size; x1++) {
        if (this.cells[y1][x1] != null) {
          let x = this.x + x1;
          let y = this.y + y1;
          let cs = this.cellSize;
          let bs = this.bsize;
          fill(this.cells[y1][x1])
          rect(bs + cs * x, bs + cs * y, cs - 1, cs - 1);
        }

      }
    }
  } //draw the blocks out

  down() {
    this.y++;
  }
  right() {
    this.x++;
  }
  left() {
    this.x--;
  }
  up() {
    this.y--;
  }

  //movement functions
}


//set up the blocks types by matrix with color(this matrix must be squared)
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

class Flower {
  constructor(x, y, a, b, c) {
    this.x = x;
    this.y = y;
    this.a = a;
    this.b = b;
    this.c = c

  }
  
  display() {
    scale(this.c);
    push();
    noStroke()
    translate(this.x / this.c, this.y / this.c)
    fill('#4DAD32')

    rect(-5, 0, 10, 120);

    fill(255, this.a, this.b)
    rotate(PI / 9)
    flower()
    fill('#FFEE34')
    ellipse(0, 0, 30, 30)
    pop();

    function flower() {
      beginShape();
      for (let i = 0; i < 12; i++) {
        ellipse(0, 30, 20, 80);
        rotate(PI / 5.0);
      }
      endShape();

    }
  }
  dis() {
    push()
    scale(this.c);
    translate(this.x / this.c, this.y / this.c)
    fill(255, this.a, this.b)
    noStroke()
    beginShape();
    for (let i = 0; i < 12; i++) {
      ellipse(0, 30, 20, 80);
      rotate(PI / 5.0);
    }
    fill('#FFEE34')
    ellipse(0, 0, 30, 30)
    endShape();
    pop()

  }
  
  dis1() {
    push()
    scale(this.c);
    translate(this.x / this.c, this.y / this.c)
    fill(255, this.a, this.b)
    noStroke()
    beginShape();
    for (let i = 0; i < 12; i++) {
      ellipse(0, 30, 20, 80);
      rotate(PI / 5.0);
    }
    fill('#FFEE34')
    ellipse(0, 0, 30, 30)
    endShape();
    pop()
    push()
    stroke(0)
    scale(this.c);
    
    translate(this.x / this.c, this.y / this.c+random(20)/20)
    fill(0)
  strokeWeight(10)
  line(175,50,175,150)
   line(275,60,275,160)
  line(175,50,275,60)
   line(175,60,275,70)
  line(175,85,275,95)
  ellipse(150,150,50,50)
  ellipse(250,160,50,50)
    pop()

  }


}



class Cute {
  constructor(x, y, a) {
    this.x = x;
    this.y = y;
    this.a = a;
  }

  display() {
    push();
    scale(this.a);
    translate(this.x / this.a, this.y / this.a)

    this.weiba();
    this.body();
    this.whiteBody();
    this.bluePart();
    this.ears();
    this.head();
    this.beard();
    this.eyebro();
    this.etou();
    this.pinky();
    this.eye();
    this.nose();
    this.heart();
    this.hands();
    pop();
      push()
    scale(this.a);
    translate((this.x) / this.a+80, (this.y) / this.a+80)
    fill(255, 163, 204)
    noStroke()
    beginShape();
    for (let i = 0; i < 12; i++) {
      ellipse(0, 30, 20, 80);
      rotate(PI / 5.0);
    }
    fill('#FFEE34')
    ellipse(0, 0, 30, 30)
    endShape();
    pop()
    push()
    stroke(0)
    scale(this.a);
    
    translate(this.x / this.a+400, this.y / this.a+random(20)/20)
    fill(0)
  strokeWeight(10)
  line(175,50,175,150)
   line(275,60,275,160)
  line(175,50,275,60)
   line(175,60,275,70)
  line(175,85,275,95)
  ellipse(150,150,50,50)
  ellipse(250,160,50,50)
    pop()


  }
  //tail
  weiba() {
    strokeWeight(6);
    beginShape();
    vertex(433, 458);
    bezierVertex(492, 433, 496, 453, 484, 463);
    vertex(433, 494);
    fill("#ffffd9");
    stroke("#33190c");
    endShape();
  }
  //body
  body() {
    beginShape();
    vertex(255, 392);
    vertex(255, 526);
    bezierVertex(256, 555, 282, 557, 293, 530);

    vertex(383, 530);
    bezierVertex(392, 557, 419, 558, 428, 526);
    vertex(428, 526);
    quadraticVertex(434, 523, 430, 393);
    vertex(430, 393);
    endShape();
  }
  //white part
  whiteBody() {
    beginShape();
    fill(255);
    vertex(317, 501);
    quadraticVertex(345, 504, 363, 500);
    vertex(363, 500);
    quadraticVertex(386, 492, 389, 480);
    vertex(389, 480);
    quadraticVertex(393, 469, 396, 437);
    vertex(396, 437);

    endShape();


  }
  //more parts of body
  bluePart() {

    fill("#e5f8ef");
    beginShape();
    vertex(428, 459);
    bezierVertex(407, 456, 405, 479, 421, 482);
    vertex(421, 482);
    bezierVertex(393, 482, 394, 507, 427, 511);
    vertex(427, 511);
    quadraticVertex(429, 485, 428, 459);
    vertex(428, 459);
    endShape();
  }

  ears() {
    //        left ear
    stroke("#33190c");
    fill("#ffffd9");
    strokeWeight(4);
    beginShape();
    vertex(106, 79);
    quadraticVertex(114, 4, 209, 14);
    endShape();

    //        right ear
    beginShape();
    strokeWeight(5);

    vertex(376, 14);
    quadraticVertex(431, 13, 446, 15);
    //vertex(446,15);
    quadraticVertex(488, 20, 498, 48);
    //vertex(498,48);
    quadraticVertex(508, 75, 512, 110);

    endShape();


    beginShape();
    strokeWeight(8);
    vertex(470, 65);
    vertex(483, 27);
    endShape();

    beginShape();
    fill("#fecce5");
    vertex(473, 65);
    vertex(483, 30);

    bezierVertex(502, 46, 496, 60, 512, 110);
    //vertex(512, 110);
    endShape();


  }
  //head
  head() {
    strokeWeight(10);
    stroke("#33190c");
    beginShape();
    fill("#ffffd9")

    vertex(280, 6);
    bezierVertex(476, 0, 535, 154, 541, 166);
    vertex(541, 166);
    vertex(546, 180);
    bezierVertex(584, 304, 530, 368, 432, 392);
    endShape();
    beginShape();
    vertex(432, 392);
    quadraticVertex(210, 460, 90, 372);
    //vertex(90,372)
    quadraticVertex(38, 324, 34, 314);
    //vertex(34,314);
    quadraticVertex(1, 268, 38, 174);
    //vertex(38,174);
    quadraticVertex(128, 8, 280, 6);

    endShape();


  }

  beard() {
    stroke("#33190c");
    //left 
    strokeWeight(7);
    beginShape();
    vertex(23, 212);
    vertex(7, 211);
    endShape();
    beginShape();
    vertex(15, 246);
    vertex(6, 245);
    endShape();
    beginShape();
    vertex(17, 281);
    vertex(9, 282);
    endShape();
    //right
    strokeWeight(10);
    beginShape();
    vertex(530, 233);
    vertex(596, 246);
    endShape();
    beginShape();
    vertex(526, 263);
    vertex(587, 290);
    endShape();
    beginShape()
    vertex(524, 298);
    vertex(581, 331);
    endShape();
  }


  eyebro() {

    //left eye brow
    strokeWeight(5);
    beginShape();
    vertex(163, 40);
    vertex(182, 42);
    vertex(182, 42);
    quadraticVertex(185, 42, 180, 42);
    endShape();
    //right eyebrow
    beginShape();
    strokeWeight(6);
    vertex(374, 54);
    quadraticVertex(386, 43, 396, 57);
    endShape();
    beginShape();
    vertex(375, 54);
    quadraticVertex(372, 56, 376, 53);
    endShape();
    beginShape();
    vertex(395, 56);
    quadraticVertex(397, 58, 395, 56);
    endShape();

  }
  //blue on head
  etou() {
    fill("#e5f8ef");
    noStroke();
    beginShape();
    vertex(190, 30);
    bezierVertex(180, 57, 216, 65, 218, 20);
    quadraticVertex(203, 23, 190, 30);
    endShape();

    beginShape();
    vertex(239, 15);
    bezierVertex(233, 70, 280, 60, 278, 11);
    quadraticVertex(257, 11, 239, 15);
    endShape();

    beginShape();
    vertex(304, 11);
    bezierVertex(285, 48, 329, 74, 339, 15);
    quadraticVertex(322, 11, 304, 11);
    endShape();

    beginShape();
    vertex(365, 20);
    bezierVertex(354, 47, 380, 53, 389, 28);
    quadraticVertex(378, 23, 366, 20);
    endShape();


  }
  //left pinky
  pinky() {
    fill("#ffcce6");
    beginShape();
    vertex(110, 199);
    quadraticVertex(73, 179, 47, 198);
    vertex(47, 215);
    quadraticVertex(73, 235, 120, 212);
    endShape();

    beginShape();
    vertex(47, 198)
    bezierVertex(41, 204, 43, 211, 47, 215);
    endShape();

    //right pinky
    beginShape();
    vertex(428, 200);
    quadraticVertex(470, 186, 507, 210);
    vertex(497, 244);
    quadraticVertex(454, 256, 420, 227);
    endShape();
    beginShape();
    vertex(507, 210);
    bezierVertex(519, 218, 514, 240, 497, 244);
    endShape();

    //lines to be shy left
    stroke("#361909");
    strokeWeight(6);
    beginShape();
    vertex(71, 205);
    vertex(65, 212);
    endShape();
    beginShape();
    vertex(88, 205);
    bezierVertex(90, 202, 91, 202, 88, 205);
    bezierVertex(80, 215, 78, 216, 82, 212);
    endShape();
    //lines to be shy right
    beginShape();
    vertex(448, 218);
    vertex(443, 224);
    vertex(448, 218);
    bezierVertex(452, 213, 454, 215, 444, 224);
    endShape();
    beginShape();
    vertex(443, 224);
    bezierVertex(441, 225, 439, 230, 444, 224);
    endShape()
    beginShape();
    vertex(466, 218);
    vertex(460, 225);
    vertex(466, 219)
    bezierVertex(468, 215, 469, 216, 465, 219);
    endShape();
    beginShape();
    vertex(460, 225);
    bezierVertex(455, 230, 455, 231, 460, 225);
    endShape();
    beginShape();
    vertex(482, 220);
    vertex(475, 228);
    vertex(482, 221);
    bezierVertex(484, 216, 484, 219, 481, 221);
    vertex(476, 227);
    bezierVertex(472, 231, 472, 231, 476, 227);
    endShape();
  }

  eye() {
    //left eye
    fill("#35190d");
    beginShape();
    vertex(129, 140);
    bezierVertex(206, 118, 215, 204, 172, 226);
    bezierVertex(92, 249, 85, 165, 129, 140);
    endShape();

    //right eye
    beginShape();
    vertex(332, 154);
    bezierVertex(421, 108, 462, 208, 407, 240);
    bezierVertex(357, 279, 264, 214, 332, 154);
    endShape();



    //eyelash left
    stroke("#35190d");
    strokeWeight(6);
    beginShape();
    vertex(129, 146);
    vertex(129, 131);
    endShape();

    //eyelash right
    beginShape();
    vertex(334, 156);
    vertex(328, 146);
    endShape();


    //eye highlight left
    fill(255);
    beginShape();
    vertex(177, 151);
    bezierVertex(190, 152, 183, 166, 177, 164);
    bezierVertex(168, 164, 168, 152, 177, 151);
    endShape();

    //eye highlight right
    beginShape();
    vertex(393, 154);
    bezierVertex(406, 155, 402, 171, 393, 169);
    bezierVertex(384, 169, 382, 155, 393, 154);
    endShape();

  }

  nose() {

    //nose

    beginShape();
    fill("#35190e");
    vertex(237, 220);
    bezierVertex(237, 209, 254, 209, 254, 220);
    bezierVertex(254, 231, 238, 231, 237, 220);
    endShape();
    noFill()
    strokeWeight(4);
    arc(230, 225, 25, 40, 0, 3 * PI / 3 - 1)
    arc(255, 225, 25, 40, 0 + 1, PI)


  }

  heart() {
    //heart
    stroke("#33190c");
    fill("#fe0000");
    strokeWeight(10);
    beginShape();
    vertex(98, 376);
    bezierVertex(70, 301, 156, 194, 246, 303);
    bezierVertex(403, 197, 476, 345, 424, 402);
    endShape();
    beginShape();
    vertex(424, 402);
    quadraticVertex(375, 475, 260, 528);
    quadraticVertex(247, 536, 225, 526);
    quadraticVertex(130, 463, 98, 376);
    endShape();


    //less red inside the heart 
    fill("#ff334c");
    noStroke();
    beginShape();
    vertex(109, 372);
    bezierVertex(68, 240, 214, 226, 236, 326);
    endShape();
    beginShape();
    vertex(236, 326);
    quadraticVertex(297, 250, 384, 278);
    quadraticVertex(408, 288, 404, 316);
    quadraticVertex(380, 416, 263, 469);
    vertex(202, 464);
    quadraticVertex(118, 416, 109, 372);
    endShape();
    beginShape();
    vertex(263, 469);
    bezierVertex(241, 480, 220, 470, 202, 464);
    endShape();


  }
  hands() {
    //left hand
    stroke("#33190c");
    fill("#ffffd9");
    strokeWeight(6);
    beginShape();
    vertex(93, 377);
    bezierVertex(132, 367, 128, 417, 113, 415);
    bezierVertex(92, 418, 74, 390, 98, 377);
    endShape();

    //right hand
    beginShape();
    vertex(395, 434);
    bezierVertex(363, 407, 394, 366, 429, 388);
    vertex(432, 388);
    quadraticVertex(421, 409, 393, 435);
    endShape();
  }
}