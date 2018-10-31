

var Engine = (function(global) {

  var doc = global.document,
    win = global.window,
    canvas = doc.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    lastTime;

  var remaininglife;
  var marks;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  doc.body.appendChild(canvas);


  var backgroundMusic = new Howl({
    src: ['sound/beep.ogg', 'sound/bug.mp3'],
    autoplay: false,
    loop: true,
    volume: 0.5,
  });


  var collectSound = new Howl({
    src: ['sound/bee.mp3'],
    autoplay: false,
    loop: false,
    volume: 1,
  });


  backgroundMusic.play();

  /* This function serves as the kickoff point for the game loop itself
   * and handles properly calling the update and render methods.
   */
  function main() {


    var now = Date.now(),
      dt = (now - lastTime) / 1000.0;


    update(dt);
    render();



    lastTime = now;


    win.requestAnimationFrame(main);
  }


  function init() {
    remaininglife = 5;
    marks = 0;
    reset();
    lastTime = Date.now();
    main();
  }


  function update(dt) {
    updateEntities(dt);
    checkCollisionWithEnemy();
    checkMarks();
  }


  function checkMarks() {


    if (player.y < 20) {
      marks += 200;
      resetPlayer();
    }

    // Check all gems if player is within collision distance
    allCollectibles.forEach(function(collectible, index, array) {
      if (checkCollisions(collectible, player)) {
        // player is within collision distance of collectible
        console.log("Collected");
        collectSound.play();
        marks += collectible.point;

        // Player has collected this gem, so remove it from array
        array.splice(index, 1);
      }
    });
  }


  function updateEntities(dt) {
    allEnemies.forEach(function(enemy) {
      enemy.update(dt);
    });
    player.update();
    allCollectibles.forEach(function(collectible) {
      collectible.update(dt);
    });
  }


  function checkCollisionWithEnemy() {
    allEnemies.forEach(function(enemy) {
      if (checkCollisions(enemy, player)) {
        remaininglife -= 1;
        if (remaininglife === 0) {
          init();
        }
        resetPlayer();
      }
    });
  }


  function checkCollisions(obj1, obj2) {
    if (obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.height + obj1.y > obj2.y) {
      console.log("Collision detected");
      return true;
    } else {
      return false;
    }
  }


  function render() {
    /* This array holds the relative URL to the image used
     * for that particular row of the game level.
     */
    var rowImages = [
        'images/water-block.png', // Top row is water
        'images/stone-block.png', // Row 1 of 8 of stone
        'images/stone-block.png', // Row 2 of 8 of stone
        'images/stone-block.png', // Row 3 of 8 of stone
        'images/stone-block.png', // Row 4 of 8 of stone
        'images/stone-block.png', // Row 5 of 8 of stone
        'images/stone-block.png', // Row 6 of 8 of stone
        'images/stone-block.png', // Row 7 of 8 of stone
        'images/stone-block.png', // Row 8 of 8 of stone
        'images/grass-block.png', // Row 1 of 2 of grass
        'images/grass-block.png' // Row 2 of 2 of grass
      ],
      numRows = 11,
      numCols = numColumns,
      row, col;


    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {

        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }

    renderCollectibles();
    renderEntities();
    renderLives();
    renderPoints();

  }

//Function to render points scored by the player.
  function renderPoints() {
    var pointsSprite = "images/star-small.png";
    var x = 1100;
    var y = 70;
    ctx.drawImage(Resources.get(pointsSprite), x, y);
    ctx.font = "32px Comic Sans MS";
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#dbdbdbd";
    ctx.strokeText(marks, 1140, 95);
    ctx.fillText(marks, 1140, 95);
  }


// Function to render lives remaining of the player
  function renderLives() {
    var lifeSprite = "images/heart-small.png";
    var x = 1000;
    var y = 60;
    ctx.drawImage(Resources.get(lifeSprite), x, y);
    ctx.font = "32px Comic Sans MS";
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#dbdbdbd";
    ctx.strokeText(remaininglife, 1040, 92);
    ctx.fillText(remaininglife, 1040, 92);
  }

  function renderEntities() {

    allEnemies.forEach(function(enemy) {
      enemy.render();
    });
    player.render();
  }

// Function to render all the gems
  function renderCollectibles() {
    allCollectibles.forEach(function(collectible) {
      collectible.render();
    });
  }

// Function to reset player position and collectibles, doesn't reset points scored.
  function resetPlayer() {
    player = new Player();
    resetCollectibles();
  }

// function to reset collectibles
  function resetCollectibles() {
    numberOfCollectibles = Math.max(Math.floor(Math.random() * 10), 5);
    allCollectibles = [];
    for (var i = 0; i < numberOfCollectibles; i++) {
      var collectibleType = Math.floor((Math.random() * 3));
      allCollectibles.push(new Collectible(collectibleType));
    }
  }

  /* This function resets the game. It resets player, collectibles and enemies.
   * Doesn't reset the points and lives remaining. It's only called once by the init() method.
   */
  function reset() {
    resetPlayer();
    allEnemies = [];
    for (var i = 0; i < 9; i++) {
      allEnemies.push(new Enemy());
    }
  }


  Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/bug.png',
    'images/char-boy.png',
    'images/heart-small.png',
    'images/star-small.png',
    'images/gem-blue.png',
    'images/gem-green.png',
    'images/gem-orange.png',
  ]);
  Resources.onReady(init);


  global.ctx = ctx;
})(this);
