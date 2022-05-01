var game;

//wW

function setup()
{
  createCanvas(320,windowHeight);

  game = new Game();
  game.setup();
}

function draw()
{
  game.main();
}

function Game()
{
  this.page = 'game';
  var heightSize = (height*0.65-(height*0.65/90))/9;
  var widthSize = (width-width/70)/7;
  var rec = (widthSize > heightSize)?heightSize:widthSize;
  this.squareSize = rec;
  this.playSpaceMargin = this.squareSize/10;
  this.ballSize = this.squareSize/3;
  this.playSpace = createVector(this.squareSize*7,this.squareSize*9);
  this.objects = [];
  this.objectDensity = 0.35;
  this.objectLivesMin = 1;
  this.objectLivesMax = 2;
  this.player = null;
  this.giftDensity = 0.15;
  this.ready = false;
  this.score = 0;

	this.main = function()
	{
    this[this.page]();
	}

  this.game = function()
  {
    background(45);
    this.renderPlaySpace();
  }

  this.menu = function()
  {
    background(45);
  }

  this.renderPlaySpace = function()
  {
    push();
    translate(width/2,height/2);
    fill(35);
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
    pop();
    push();
    fill(45);
    noStroke();
    rectMode(CORNERS);
    rect(0,0,width,height/2-this.playSpace.y/2-this.playSpaceMargin/2);
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

  this.resetObjects = function()
  {
    for (var i = 0; i < 1; i++)
    {
      this.makeRow((i==0));
    }
  }

  this.mousePressed = function()
  {
    if (this.page == 'game')
    {
      this.player.mousePressed();
    }
  }

  this.mouseReleased = function()
  {
    if (this.page == 'game')
    {
      this.player.mouseReleased();
    }
  }

	this.setup = function()
	{
    this.resetObjects();
    this.player = new Player();
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

  this.render = function()
  {
    push();
    translate(this.pos.x,this.pos.y);
    fill(red(this.color),green(this.color),blue(this.color),this.alpha);
    noStroke();
    rectMode(CENTER);
    rect(0,0,this.size.x,this.size.y);
    fill(0,this.alpha);
    strokeJoin(ROUND);
    textAlign(CENTER,CENTER);
    textFont('comfortaa');
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
      this.targetColor = lerpColor(color(224, 182, 56),color(97, 232, 56),constrain(map(this.lives,3,8,0,1),0,1));
      this.color = lerpColor(this.color,this.targetColor,0.15);
      this.pos.y+=Math.sign(this.targetY-this.pos.y)*this.moveSpeed*constrain(abs(this.targetY-this.pos.y)/this.moveSpeed,0,1);
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
      game.gameOver();
    }
  }

  this.hit = function()
  {
    if (this.lives > 1)
    {
      this.lives--;
    } else
    {
      this.die();
    }
  }

  this.die = function()
  {
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

  this.render = function()
  {
    for (var i = this.balls.length-1; i >= 0; i--)
    {
      this.balls[i].update();
      this.balls[i].render();
    }
  }

  this.update = function()
  {
    var done = true;
    this.ready = true;
    for (var i = 0; i < this.balls.length; i++)
    {
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
    } else if (gift.type == 'point')
    {
      game.score++;
    }
  }

  this.mousePressed = function()
  {
    if (this.dead || this.noInteraction)return;
    this.readyToFire = true;
  }

  this.mouseReleased = function()
  {
    if (this.dead || this.noInteraction)return;
    this.fire();
  }

  this.fire = function()
  {
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
  this.moveSpeed = 10;
  this.first = false;

  this.render = function()
  {
    push();
    fill(255);
    if (!this.ready)
    {
      fill(125, 191, 33);
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
      this.ready = (abs(this.pos.x-this.parent.shootX) < 0.1);
    }
  }

  this.checkObjects = function()
  {
    for (var i = 0; i < game.objects.length; i++)
    {
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
          game.objects[i].hit();
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
      return (subbedX > subbedY);
    }
  }

  this.reactToObject = function(object,result)
  {
    if (result)
    {
      this.vel.x*=-1;
      this.pos.x = object.pos.x+Math.sign(this.pos.x-object.pos.x)*(object.size.x/2+this.radius);
    } else if (!result)
    {
      this.vel.y*=-1;
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
    } else if (this.type == 'point')
    {
      noFill();
      stroke(143, 212, 47,this.alpha);
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

function mousePressed()
{
  game.mousePressed();
}

function mouseReleased()
{
  game.mouseReleased();
}
