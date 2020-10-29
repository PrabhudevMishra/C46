const PLAY = 1;
const END = 0;

var player,playerRunning;
var obstacle1Img,obstacle2Img,obstacle3Img,obstacle4Img,obstacleGroup;
var invisibleGround;
var ground, groundImg;
var coinImage;
var scene;
var coinCount;
var coinsGroup;
var footSteps;
var jumpSound;
var lifeCount;
var gameState = PLAY; 
var lifeMissed;
var instruction;
var enemyImage;
var enemyGroup;
var playerCollided;

function preload(){
  playerRunning = loadAnimation("./p1.png","./p2.png","./p3.png","./p4.png");
  backImg = loadImage("./bg.png");
  groundImg = loadImage("./ground.png");
  obstacle1Img = loadImage("./o1.png");
  obstacle2Img = loadImage("./o2.png");
  obstacle3Img = loadImage("./o3.png");
  obstacle4Img = loadImage("./o4.png");
  coinImage = loadImage("./coins.png");
  enemyImage = loadImage("./enemy.png");
  jumpSound = loadSound("./jump.mp3");
  lifeMissed = loadSound("./LIFE MISSED.wav");
  playerCollided = loadImage("./p2.png");
}


function setup() {
  createCanvas(displayWidth,displayHeight);
 
 //footSteps.play();

  ground = createSprite(width/2, displayHeight/2 + 400, width, 200);
  ground.addImage("background", groundImg);
  ground.x = ground.width / 2;
  ground.scale = 4;
  
  player = createSprite(200,displayHeight/2 + 200,20,20);
  player.addAnimation("player",playerRunning);
  player.addAnimation("collided", playerCollided);
  player.scale = 0.6;
  


  invisibleGround = createSprite(width/2, displayHeight/2 + 260, width, 10);
  invisibleGround.visible = false;

  obstacleGroup = new Group();
  coinsGroup = new Group();
  enemyGroup = new Group();

  coinCount = 0;
  lifeCount = 4;

  instruction = createButton('INSTRUCTIONS');
  instruction.position(width/2 - 200,200);

  restart = createSprite(200,200,20,20);
}

function draw() {
  background(backImg); 
  
  instruction.mousePressed(()=>{
    reset();
  })

  if(gameState === PLAY){
  ground.velocityX = -6;
  spawnObstacles();
  spawnCoins();
  spawnEnemy();

  if (ground.x < 0) {
    ground.x = ground.width / 2;
  }

  if(keyDown(UP_ARROW) && player.y >= height/2 + 190){
    player.velocityY = -12;
    jumpSound.play();
  }
  
  player.velocityY = player.velocityY + 0.4;

  //if(coinsGroup.isTouching(player)){
    for(var i = 0; i < coinsGroup.length; i++){
      if(coinsGroup.get(i).isTouching(player)){
        coinCount ++;
        coinsGroup.get(i).destroy();
      }
    }
 // }

 for(var j = 0; j < obstacleGroup.length; j++){
    if(obstacleGroup.get(j).isTouching(player) && lifeCount > 0){
      lifeCount -= 1;
      //console.log(lifeCount);
      obstacleGroup.get(j).destroy();
      lifeMissed.play();
    }
  }

  if(enemyGroup.isTouching(player)){
    lifeCount = 0;
  }

    if(lifeCount === 0){
      gameState = END;
    }

  }
  else if(gameState === END){
    ground.velocityX = 0;
    player.velocityY = 0;
    obstacleGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    enemyGroup.setVelocityXEach(0);
    enemyGroup.setLifetimeEach(-1);
    player.changeAnimation("collided");
    textSize(100);
    fill("red");
    stroke("white");
    text("GAME OVER!!", width/2 - 80, height/2);

  }

  if(mousePressedOver(restart) && gameState === END){
    reset();
  }

  player.collide(invisibleGround);
  console.log(height - 300);

  drawSprites();

  textSize(25);
  stroke("black");
  fill("yellow");
  text("COINS: " + coinCount, width - 200, 50);
  text("LIFE: " + lifeCount, width - 200 , 80);
}

function spawnObstacles() {
  if(frameCount % 200 === 0) {
    var obstacle = createSprite(width,displayHeight/2 + 230,10,40);
    obstacle.velocityX = -8;
    
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1Img);
              break;
      case 2: obstacle.addImage(obstacle2Img);
              break;
      case 3: obstacle.addImage(obstacle3Img);
              break;
      case 4: obstacle.addImage(obstacle4Img);
              break;
      default: break;
    }
              
    obstacle.scale = 0.5;
    obstacle.lifetime = width/3;
    obstacleGroup.add(obstacle);
  }
}

function spawnCoins() {
  if (frameCount % 80 === 0) {
    var coin = createSprite(random(width/2 + 200, width/2 + 300),displayHeight/2 + 230,10,40);
    coin.y = Math.round(random(displayHeight/2 + 230,displayHeight/2 + 50));
    coin.addImage(coinImage);
    coin.scale = 0.05;
    coin.velocityX = -3;
    
    coin.lifetime = width/3;
    
    coinsGroup.add(coin);
  }
  
}

function spawnEnemy() {
  if (frameCount % 500 === 0) {
    var enemy = createSprite(width, displayHeight/2 + 180,10,40);
    enemy.addImage(enemyImage);
    enemy.scale = 0.3;
    enemy.velocityX = -8;
    enemy.lifetime = width/3;
    enemyGroup.add(enemy);
  }
}

// function spawnTreasure(){
//   if(frameCount % )
// }

function reset(){
  gameState = PLAY;
  coinsGroup.destroyEach();
  enemyGroup.destroyEach();
  obstacleGroup.destroyEach();
  coinCount = 0;
  lifeCount = 4;
  player.changeAnimation("player")
}


























