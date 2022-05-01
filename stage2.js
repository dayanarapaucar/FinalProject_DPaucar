var game;

//wW

function setup()
{
  createCanvas(350,windowHeight);
  //           ^^^
  // You can change this to windowWidth

  game = new Game();
  game.setup();
}

function draw()
{
  game.main();
}

function Game()
{
  this.page = 'menu';
  var heightSize = (height*0.65-(height*0.65/90))/9;
  var widthSize = (width-width/70)/7;
  var rec = (widthSize > heightSize)?heightSize:widthSize;
  this.squareSize = rec;
  this.playSpaceMargin = this.squareSize/10;
  this.ballSize = this.squareSize/4;
  this.playSpace = createVector(this.squareSize*7,this.squareSize*9);
  this.uiY = (height/2-this.playSpace.y/2)/2;
  this.uiScale = height/700;
  this.particles = [];
  this.objects = [];
  this.objectDensity = 0.35;
  this.objectLivesMin = 1;
  this.objectLivesMax = 2;
  this.player = null;
  this.giftDensity = 0.1;
  this.ready = false;
  this.score = 0;
  this.highScore = 0;
  this.coins = 0;
  this.paused = false;

	this.main = function()
	{
    this[this.page]();
    if (this.paused)
    {
      this.pauseScreen();
    }
	}

  this.game = function()
  {
    background(41,37,42);
    this.renderPlaySpace();
  }

  this.menu = function()
  {
    background(41,37,42);
    push();
    var name = 'Ballz';
    var colors = [color(239,34,90),color(236,180,48),color(23,120,195),color(0,167,146),color(138,191,69)];
    strokeWeight(1);
    strokeJoin(ROUND);
    textAlign(LEFT,CENTER);
    textFont('Comfortaa');
    textSize(64*this.uiScale);
    var x = width/2-textWidth(name)/2;
    for (var i = 0; i < name.length; i++)
    {
      fill(colors[i]);
      stroke(colors[i]);
      text(name[i],x,height/4);
      x+=textWidth(name[i]);
    }
    fill(239,34,90);
    noStroke();
    rectMode(CENTER);
    rect(width/2,height/2-(35*this.uiScale),160*this.uiScale,40*this.uiScale,20*this.uiScale);
    fill(24,117,192);
    rect(width/2,height/2+(35*this.uiScale),160*this.uiScale,40*this.uiScale,20*this.uiScale);
    fill(255);
    stroke(255);
    strokeWeight(0.25);
    textFont('jost');
    textSize(20*this.uiScale);
    textAlign(CENTER,CENTER);
    text('PLAY',width/2,height/2-(33*this.uiScale));
    text('RATE',width/2,height/2+(37*this.uiScale));
    pop();
  }

  this.pauseScreen = function()
  {
    push();
    background(0,150);
    fill(32);
    noStroke();
    rectMode(CENTER);
    rect(width/2,height/2,300*this.uiScale,360*this.uiScale);
    fill(255);
    textFont('jost');
    textSize(48);
    textAlign(CENTER,CENTER);
    text('PAUSE',width/2,height/2-118*this.uiScale);
    fill(239,34,90);
    noStroke();
    rectMode(CENTER);
    rect(width/2,height/2-(55*this.uiScale),160*this.uiScale,40*this.uiScale,20*this.uiScale);
    fill(221,163,43);
    rect(width/2,height/2,160*this.uiScale,40*this.uiScale,20*this.uiScale);
    fill(24,117,192);
    rect(width/2,height/2+(55*this.uiScale),160*this.uiScale,40*this.uiScale,20*this.uiScale);
    fill(255);
    stroke(255);
    strokeWeight(0.25);
    textFont('jost');
    textSize(20*this.uiScale);
    textAlign(CENTER,CENTER);
    text('CONTINUE',width/2,height/2-(53*this.uiScale));
    text('RESTART',width/2,height/2+(2*this.uiScale));
    text('MAIN MENU',width/2,height/2+(57*this.uiScale));
    pop();
  }

  this.gameover = function()
  {
    background(41,37,42);
    push();
    fill(255);
    stroke(255);
    strokeJoin(ROUND);
    strokeWeight(1);
    strokeJoin(ROUND);
    textAlign(CENTER,CENTER);
    textFont('jost');
    textSize(64*this.uiScale);
    text(this.score,width/2,height/4-28*this.uiScale);
    textSize(32*this.uiScale);
    noStroke();
    text('BEST '+this.highScore,width/2,height/4+32*this.uiScale);
    fill(239,34,90);
    noStroke();
    rectMode(CENTER);
    rect(width/2,height/2-(35*this.uiScale),160*this.uiScale,40*this.uiScale,20*this.uiScale);
    fill(24,117,192);
    rect(width/2,height/2+(35*this.uiScale),160*this.uiScale,40*this.uiScale,20*this.uiScale);
    fill(255);
    stroke(255);
    strokeWeight(0.25);
    textSize(20*this.uiScale);
    text('REPLAY',width/2,height/2-(33*this.uiScale));
    text('MAIN MENU',width/2,height/2+(37*this.uiScale));
    pop();
  }

  this.renderPlaySpace = function()
  {
    push();
    translate(width/2,height/2);
    fill(35,31,36);
    noStroke();
    rectMode(CENTER);
    rect(0,0,this.playSpace.x+this.playSpaceMargin*2,this.playSpace.y);
    for (var i = this.objects.length-1; i >= 0; i--)
    {
      this.objects[i].update();
      this.objects[i].render();
      if (this.objects[i].splice)
      {
        this.objects.splice(i,1);
      }
    }
    this.player.update();
    this.player.render();
    for (var j = this.particles.length-1; j >= 0; j--)
    {
      this.particles[j].run();
      if (this.particles[j].splice)
      {
        this.particles.splice(j,1);
      }
    }
    pop();
    push();
    strokeJoin(ROUND);
    fill(41,37,42);
    noStroke();
    rectMode(CORNERS);
    rect(0,0,width,height/2-this.playSpace.y/2);
    fill(255);
    noStroke();
    textSize(36*this.uiScale);
    textAlign(CENTER,CENTER);
    textFont('jost');
    text(this.score,width/2,this.uiY);
    // Pause icon
    stroke(75);
    strokeWeight(4.5*this.uiScale);
    line(18*this.uiScale,this.uiY-8*this.uiScale,18*this.uiScale,this.uiY+8*this.uiScale);
    line(26*this.uiScale,this.uiY-8*this.uiScale,26*this.uiScale,this.uiY+8*this.uiScale);
    // High score
    textAlign(CENTER,CENTER);
    textSize(13*this.uiScale);
    noStroke();
    text('BEST',64*this.uiScale,this.uiY-9*this.uiScale);
    textSize(20*this.uiScale);
    stroke(255);
    strokeWeight(0.25*this.uiScale);
    text(this.highScore,64*this.uiScale,this.uiY+9*this.uiScale);
    // Coins
    noFill();
    stroke(202,214,47);
    strokeWeight(2.5*this.uiScale);
    ellipse(width-20*this.uiScale,this.uiY,13*this.uiScale,13*this.uiScale);
    textAlign(RIGHT,CENTER);
    stroke(255);
    strokeWeight(0.25*this.uiScale);
    fill(255);
    text(this.coins,width-32*this.uiScale,this.uiY+2*this.uiScale);
    pop();
    this.updateReady();
  }

  this.updateReady = function()
  {
    this.ready = true;
    for (var i = this.objects.length-1; i >= 0; i--)
    {
      if (!this.objects[i].ready)
      {
        this.ready = false;
        break;
      }
    }
  }

  this.makeRow = function(bool)
  {
    if (!bool)
    {
      this.score++;
    }
    var x = -this.playSpace.x/2+this.squareSize/2;
    for (var i = 0; i < this.playSpace.x; i+=50)
    {
      if (random(1) < this.objectDensity)
      {
        this.createBrick(x,-this.playSpace.y/2-this.squareSize/2-this.playSpaceMargin/2);
      } else if (random(1) < this.giftDensity)
      {
        this.createGift(x,-this.playSpace.y/2-this.squareSize/2-this.playSpaceMargin/2);
      }
      x+=this.squareSize;
    }
    for (var j = 0; j < this.objects.length; j++)
    {
      this.objects[j].advance(bool);
    }
    this.objectLivesMin+=0.1;
    this.objectLivesMax+=0.5;
    this.objectDensity+=0.001;
    this.objectDensity = constrain(this.objectDensity,0,0.75);
  }

  this.createGift = function(x,y)
  {
    var type = random(['extra-ball','point']);
    this.objects.push(new Gift(createVector(x,y),type));
  }

  this.createBrick = function(x,y)
  {
    var lives = round(random(this.objectLivesMin,this.objectLivesMax));
    this.objects.push(new Brick(createVector(x,y),lives));
  }

  this.gameOver = function()
  {
    this.player.die();
  }

  this.getColor = function(lives)
  {
    if (lives < 14)
    {
      return lerpColor(color(248,182,51),color(132,197,67),constrain(map(lives,4,8,0,1),0,1));
    } else if (lives < 31)
    {
      return lerpColor(color(237,34,97),color(234,34,94),constrain(map(lives,14,30,0,1),0,1));
    } else
    {
      return lerpColor(color(194,34,134),color(21,112,182),constrain(map(lives,31,100,0,1),0,1));
    }
  }

  this.resetObjects = function()
  {
    this.objects = [];
    this.objectDensity = 0.35;
    this.objectLivesMin = 1;
    this.objectLivesMax = 2;
    for (var i = 0; i < 1; i++)
    {
      this.makeRow((i==0));
    }
  }

  this.mousePressed = function()
  {
    if (this.page == 'menu')
    {
      if (abs(mouseX-width/2) < 80*this.uiScale)
      {
        if (abs(mouseY-(height/2-(35*this.uiScale))) < 20*this.uiScale)
        {
          this.page = 'game';
        } else if (abs(mouseY-(height/2+(35*this.uiScale))) < 20*this.uiScale)
        {
          // RATE?
        }
      }
    } else if (this.paused)
    {
      if (abs(mouseX-width/2) < 80*this.uiScale)
      {
        if (abs(mouseY-(height/2-(55*this.uiScale))) < 20*this.uiScale)
        {
          this.paused = false;
        } else if (abs(mouseY-(height/2+(55*this.uiScale))) < 20*this.uiScale)
        {
          this.setup(true);
          this.page = 'menu';
          this.paused = false;
        } else if (abs(mouseY-height/2) < 20*this.uiScale)
        {
          this.setup(true);
          this.paused = false;
        }
      }
    } else if (this.page == 'game')
    {
      if (abs(mouseX-22*this.uiScale) < 20*this.uiScale && abs(mouseY-this.uiY) < 20*this.uiScale)
      {
        this.paused = true;
      } else
      {
        this.player.mousePressed();
      }
    } else if (this.page == 'gameover')
    {
      if (abs(mouseX-width/2) < 80*this.uiScale)
      {
        if (abs(mouseY-(height/2-(35*this.uiScale))) < 20*this.uiScale)
        {
          this.setup();
          this.page = 'game';
        } else if (abs(mouseY-(height/2+(35*this.uiScale))) < 20*this.uiScale)
        {
          this.page = 'menu';
        }
      }
    }
  }

  this.mouseReleased = function()
  {
    if (this.page == 'game')
    {
      this.player.mouseReleased();
    }
  }

	this.setup = function(quitting)
	{
    this.particles = [];
    this.resetObjects();
    this.player = new Player();
    if (this.score > this.highScore && !quitting)
    {
      this.highScore = this.score;
    }
    this.score = 0;
	}
}

function Brick(pos,lives=3)
{
  this.pos = pos.copy();
  this.lives = lives;
  this.size = createVector(1,1).mult(game.squareSize-game.playSpaceMargin);
  this.targetY = this.pos.y;
  this.alpha = 255;
  this.color = color(97, 232, 56);
  this.targetColor = this.color;
  this.dead = false;
  this.mass = 4;
  this.moveSpeed = 3;
  this.ready = false;
  this.hitting = [];

  this.render = function()
  {
    push();
    translate(this.pos.x,this.pos.y);
    fill(red(this.color),green(this.color),blue(this.color),this.alpha);
    noStroke();
    rectMode(CENTER);
    rect(0,0,this.size.x,this.size.y);
    fill(0,this.alpha);
    stroke(0,this.alpha);
    strokeWeight(0.5);
    strokeJoin(ROUND);
    textAlign(CENTER,CENTER);
    textFont('jost');
    textSize(this.size.y*0.4);
    text(this.lives,0,this.size.y/36);
    pop();
  }

  this.update = function()
  {
    if (this.dead)
    {
      this.alpha-=10;
      if (this.alpha <= 0)
      {
        this.splice = true;
      }
    } else
    {
      this.targetColor = game.getColor(this.lives);
      this.color = lerpColor(this.color,this.targetColor,0.15);
      this.pos.y+=Math.sign(this.targetY-this.pos.y)*this.moveSpeed*constrain(abs(this.targetY-this.pos.y)/this.moveSpeed,0,1);
      //this.pos.y = lerp(this.pos.y,this.targetY,0.1);
      this.ready = (abs(this.pos.y-this.targetY) < 0.1);
      this.updateHitting();
      if (this.pos.y >= game.playSpace.y/2-game.squareSize*1.5-1)
      {
        game.gameOver();
      }
    }
  }

  this.updateHitting = function()
  {
    for (var i = this.hitting.length-1; i >= 0; i--)
    {
      if (this.hitting[i].hittingObject(this) == null)
      {
        this.hitting.splice(i,1);
      }
    }
  }

  this.advance = function(teleport)
  {
    this.targetY+=game.squareSize;
    if (teleport)
    {
      this.pos.y = this.targetY;
    }
  }

  this.hit = function(ball)
  {
    if (this.lives > 1)
    {
      this.lives--;
      this.hitting.push(ball);
    } else
    {
      this.die();
    }
  }

  this.die = function()
  {
    if (!this.dead)
    {
      for (var i = 0; i < 20; i++)
      {
        var span = random(30,40);
        var particle = new Particle(this.pos.copy().add(p5.Vector.random2D().setMag(random(this.size.x/2))),p5.Vector.random2D().setMag(random(8)),function(particle){
          translate(particle.pos.x,particle.pos.y);
          fill(red(particle.data.color),green(particle.data.color),blue(particle.data.color),(particle.data.span/particle.data.maxSpan)*255);
          noStroke();
          rect(0,0,particle.data.size,particle.data.size);
          particle.vel.add(createVector(0,0.01));
          particle.vel.mult(0.8);
          particle.data.span--;
          if (particle.data.span <= 0)
          {
            particle.splice = true;
          }
        },{color:this.targetColor,size:random(10,16),span:span,maxSpan:span});
        game.particles.push(particle);
      }
    }
    this.dead = true;
  }
}

function Player()
{
  this.dead = false;
  this.shootX = 0;
  this.startY = game.playSpace.y/2-game.ballSize/2;
  this.readyToFire = false;
  this.balls = [];
  var ball = new Ball(createVector(this.shootX,this.startY));
  ball.parent = this;
  this.balls.push(ball);
  this.noInteraction = false;
  this.madeRow = false;
  this.ready = false;
  this.first = null;
  this.firingVal = 0;
  this.dropCount = [];

  this.render = function()
  {
    if (this.ready)
    {
      push();
      fill(255);
      noStroke();
      textSize(game.ballSize*1.25);
      textFont('jost');
      textAlign(CENTER,CENTER);
      text(this.balls.length+'x',this.shootX,this.startY-game.ballSize*1.5);
      pop();
      if (this.dropCount.length > 0)
      {
        game.particles.push(new Particle(createVector(this.shootX,this.startY),createVector(0,-0.5),function(particle){
          translate(particle.pos.x,particle.pos.y);
          fill(129,187,58,(particle.data.span/90)*255);
          noStroke();
          textAlign(CENTER,CENTER);
          textFont('jost');
          textSize(game.ballSize*1.25);
          text('+'+particle.data.dropCount,0,0);
          particle.data.span--;
          if (particle.data.span <= 0)
          {
            particle.splice = true;
          }
        },{dropCount:this.dropCount.length,span:90}));
        this.dropCount = [];
      }
    }
    if (this.readyToFire)
    {
      this.displayAiming();
      this.firingVal = lerp(this.firingVal,1,0.2);
    }
    for (var i = this.balls.length-1; i >= 0; i--)
    {
      if (!game.paused)
      {
        this.balls[i].update();
      }
      this.balls[i].render();
    }
  }

  this.displayAiming = function()
  {
    var vel = createVector(mouseX-width/2,mouseY-height/2).sub(createVector(this.shootX,this.startY)).rotate(PI/2).normalize();
    push();
    translate(this.shootX,this.startY);
    rotate(vel.heading());
    fill(255);
    noStroke();
    triangle(-game.ballSize*0.25,0,0,-game.ballSize*3*this.firingVal,game.ballSize*0.25,0);
    fill(41,37,42);
    ellipse(0,0,game.ballSize+3,game.ballSize+3);
    var pos = createVector(0,-game.ballSize*3.5);
    for (var i = 0; i < 16; i++)
    {
      fill(255);
      ellipse(pos.x,pos.y,game.ballSize*0.75*this.firingVal);
      pos.setMag(pos.mag()+game.ballSize*1.5*constrain(this.firingVal,0,1));
    }
    pop();
  }

  this.update = function()
  {
    var done = true;
    this.ready = true;
    for (var i = 0; i < this.balls.length; i++)
    {
      if (this.balls[i].dropping && !this.dropCount.includes(this.balls[i]))
      {
        this.dropCount.push(this.balls[i]);
      }
      if (!this.balls[i].ready)
      {
        this.ready = false;
      }
      if (this.balls[i].fired)
      {
        done = false;
      } else if (!this.first)
      {
        this.first = this.balls[i];
        this.balls[i].first = true;
        this.shootX = this.first.pos.x;
      }
    }
    if (done)
    {
      if (!this.madeRow)
      {
        game.makeRow();
        this.madeRow = true;
      } else if (game.ready && this.ready)
      {
        this.noInteraction = false;
        this.first = null;
        if (this.dead)
        {
          game.page = 'gameover';
        }
      }
    } else
    {
      this.madeRow = false;
    }
  }

  this.getGift = function(gift)
  {
    if (gift.type == 'extra-ball')
    {
      var ball = new Ball(gift.pos.copy(),createVector(0,4),true);
      ball.parent = this;
      this.balls.push(ball);
    } else if (gift.type == 'coin')
    {
      game.coins++;
    }
  }

  this.mousePressed = function()
  {
    if (this.dead || this.noInteraction || abs(mouseX-width/2) > game.playSpace.x/2+game.playSpaceMargin*2 || abs(mouseY-height/2) > game.playSpace.y/2)return;
    this.readyToFire = true;
  }

  this.mouseReleased = function()
  {
    if (this.dead || this.noInteraction || !this.readyToFire)return;
    this.fire();
  }

  this.fire = function()
  {
    this.dropCount = [];
    this.firingVal = 0;
    this.readyToFire = false;
    this.noInteraction = true;
    var vel = createVector(mouseX-width/2,mouseY-height/2).sub(this.balls[0].pos).normalize();
    for (var i = 0; i < this.balls.length; i++)
    {
      var delay = i*10;
      this.balls[i].fire(delay,vel);
    }
  }

  this.die = function()
  {
    this.dead = true;
  }
}

function Ball(pos,vel=createVector(),dropping)
{
  this.parent = null;
  this.pos = pos.copy();
  this.vel = vel.copy();
  this.radius = game.ballSize/2;
  this.fired = false;
  this.speed = 8;
  this.dropping = dropping;
  this.ready = false;
  this.moveSpeed = 16;
  this.first = false;

  this.render = function()
  {
    push();
    fill(255);
    if (!this.ready && !this.fired)
    {
      fill(129,187,58);
    }
    noStroke();
    ellipse(this.pos.x,this.pos.y,this.radius*2);
    pop();
  }

  this.update = function()
  {
    if (this.dropping)
    {
      this.pos.add(this.vel);
      if (this.pos.y >= this.parent.startY)
      {
        this.vel = createVector();
        this.pos.y = this.parent.startY;
        this.dropping = false;
      }
    } else if (this.fired)
    {
      if (this.delay > 0)
      {
        this.delay--;
      } else
      {
        var steps = this.vel.mag();
        for (var i = 0; i < steps; i++)
        {
          this.pos.add(this.vel.copy().div(steps));
          if (this.pos.y >= this.parent.startY)
          {
            this.fired = false;
            this.vel = createVector();
            this.pos.y = this.parent.startY;
          }
          this.checkBounds();
          this.checkObjects();
        }
      }
    } else if (this.parent.madeRow)
    {
      this.pos.x+=Math.sign(this.parent.shootX-this.pos.x)*this.moveSpeed*constrain(abs(this.parent.shootX-this.pos.x)/this.moveSpeed,0,1);
    }
    this.ready = (abs(this.pos.x-this.parent.shootX) < 0.1 && !this.fired && !this.dropping);
  }

  this.checkObjects = function()
  {
    for (var i = 0; i < game.objects.length; i++)
    {
      if (!game.objects[i].gift)
      {
        game.objects[i].updateHitting();
      }
      if (game.objects[i].dead)continue;
      if (game.objects[i].gift != undefined)
      {
        if (p5.Vector.dist(this.pos,game.objects[i].pos) < this.radius+game.objects[i].radius)
        {
          game.objects[i].hit();
        }
      } else
      {
        var result = this.hittingObject(game.objects[i]);
        if (result != null)
        {
          this.reactToObject(game.objects[i],result);
          if (!game.objects[i].hitting.includes(this))
          {
            game.objects[i].hit(this);
          }
        }
      }
    }
  }

  this.checkBounds = function()
  {
    if (abs(this.pos.x) > game.playSpace.x/2+game.playSpaceMargin/2-this.radius)
    {
      this.vel.x*=-1;
    }
    if (this.pos.y < -game.playSpace.y/2+this.radius)
    {
      this.vel.y*=-1;
    }
  }

  this.hittingObject = function(object)
  {
    var subbedX = abs(this.pos.x-object.pos.x);
    var subbedY = abs(this.pos.y-object.pos.y);
    var cdSq = (subbedX-object.size.x/2)^2+(subbedY-object.size.y/2)^2;
    if (subbedX > object.size.x/2+this.radius || subbedY > object.size.y/2+this.radius)
    {
      return null;
    } else if (subbedX <= object.size.x/2 || subbedY <= object.size.y/2 || cdSq <= this.radius*this.radius)
    {
      return (subbedX > subbedY)?true:(subbedX < subbedY)?false:0.5;
    }
    return null;
  }

  this.reactToObject = function(object,result)
  {
    if (result == true)
    {
      this.vel.x*=-1;
      this.pos.x = object.pos.x+Math.sign(this.pos.x-object.pos.x)*(object.size.x/2+this.radius);
    } else if (result == false)
    {
      this.vel.y*=-1;
      this.pos.y = object.pos.y+Math.sign(this.pos.y-object.pos.y)*(object.size.y/2+this.radius);
    } else if (result == 0.5)
    {
      this.vel.mult(-1);
      this.pos.x = object.pos.x+Math.sign(this.pos.x-object.pos.x)*(object.size.x/2+this.radius);
      this.pos.y = object.pos.y+Math.sign(this.pos.y-object.pos.y)*(object.size.y/2+this.radius);
    }
  }

  this.fire = function(delay,vel)
  {
    this.first = false;
    this.fired = true;
    this.delay = delay;
    this.vel = vel.copy().setMag(this.speed);
  }
}

function Gift(pos,type)
{
  this.gift = true;
  this.pos = pos.copy();
  this.radius = game.squareSize*0.25;
  this.targetY = this.pos.y;
  this.alpha = 255;
  this.dead = false;
  this.moveSpeed = 3;
  this.ready = false;
  this.type = type;
  this.hitting = [];

  this.render = function()
  {
    push();
    translate(this.pos.x,this.pos.y);
    if (this.type == 'extra-ball')
    {
      noFill();
      stroke(255,this.alpha);
      var strokeSize = 3;
      strokeWeight(strokeSize);
      ellipse(0,0,this.radius*2.5-strokeSize+sin(frameCount/10)*2);
      noStroke();
      fill(255,this.alpha);
      ellipse(0,0,game.ballSize);
    } else if (this.type == 'coin')
    {
      noFill();
      stroke(202,214,47,this.alpha);
      var strokeSize = 3.5;
      strokeWeight(strokeSize);
      ellipse(0,0,this.radius*2-strokeSize);
    }
    pop();
  }

  this.update = function()
  {
    if (this.dead)
    {
      this.alpha-=10;
      if (this.alpha <= 0)
      {
        this.splice = true;
      }
    } else
    {
      this.pos.y+=Math.sign(this.targetY-this.pos.y)*this.moveSpeed*constrain(abs(this.targetY-this.pos.y)/this.moveSpeed,0,1);
      //this.pos.y = lerp(this.pos.y,this.targetY,0.1);
      this.ready = (abs(this.pos.y-this.targetY) < 0.1);
    }
  }

  this.advance = function(teleport)
  {
    this.targetY+=game.squareSize;
    if (teleport)
    {
      this.pos.y = this.targetY;
    }
    if (this.targetY >= game.playSpace/2-game.squareSize/2)
    {
      this.die();
    }
  }

  this.hit = function()
  {
    game.player.getGift(this);
    this.die();
  }

  this.die = function()
  {
    this.dead = true;
  }
}

function Particle(pos,vel,disp,data={})
{
  this.pos = pos.copy();
  this.vel = vel.copy();
  this.disp = disp;
  this.splice = false;
  this.data = data;

  this.run = function()
  {
    push();
    this.disp(this);
    pop();
    this.pos.add(this.vel);
  }
}

function mousePressed()
{
  game.mousePressed();
}

function mouseReleased()
{
  game.mouseReleased();
}
