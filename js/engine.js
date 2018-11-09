
var Engine = (function(global) {
  /* Predefine the variables we'll be using within this scope,
   * create the canvas element, grab the 2D context for that canvas
   * set the canvas elements height/width and add it to the DOM.
   */
  var doc = global.document,
    win = global.window,
    canvas = doc.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    lastTime;

  var life;
  var points;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  doc.body.appendChild(canvas);

  // Code to play the background music, uses Howler.js for playing sound
  var backMusic = new Howl({
    src: ['musics/headinthesand.ogg', 'musics/headinthesand.mp3'],
    autoplay: false,
    loop: true,
    volume: 0.5,
  });

  // This defines the sound played when collecting gems
  var collectibleMusic = new Howl({
    src: ['musics/FX216.mp3'],
    autoplay: false,
    loop: false,
    volume: 1,
  });

  // Start the background music
  backMusic.play();

  /* This function serves as the kickoff point for the game loop itself
   * and handles properly calling the update and render methods.
   */
  function main() {
    /* Get our time delta information which is required if your game
     * requires smooth animation. Because everyone's computer processes
     * instructions at different speeds we need a constant value that
     * would be the same for everyone (regardless of how fast their
     * computer is) - hurray time!
     */
    var now = Date.now(),
      dt = (now - lastTime) / 1000.0;


    /* Call our update/render functions, pass along the time delta to
     * our update function since it may be used for smooth animation.
     */
    update(dt);
    render();


    /* Set our lastTime variable which is used to determine the time delta
     * for the next time this function is called.
     */
    lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
     */
    win.requestAnimationFrame(main);
  }

  /* This function does some initial setup that should only occur once,
   * particularly setting the lastTime variable that is required for the
   * game loop.
   */
  function init() {
    life = 5;
    points = 0;
    reset();
    lastTime = Date.now();
    main();
  }

  /* This function is called by main (our game loop) and itself calls all
   * of the functions which may need to update entity's data. Based on how
   * you implement your collision detection (when two entities occupy the
   * same space, for instance when your character should die), you may find
   * the need to add an additional function call here. For now, we've left
   * it commented out - you may or may not want to implement this
   * functionality this way (you could just implement collision detection
   * on the entities themselves within your app.js file).
   */
  function update(dt) {
    updateEntities(dt);
    enemyCollisions();
    checkPoints();
  }

  /* This function is called by the update method. It checks if the player has
      reached the water or has collected any gems
  */
  function checkPoints() {

    // If player has reached the water than credit points and reset player
    if (player.y < 20) {
      points += 200;
      resetPlayer();
    }

    // Check all gems if player is within collision distance
    entireCollectibles.forEach(function(collectible, index, array) {
      if (collisionNum(collectible, player)) {
        // player is within collision distance of collectible
        console.log("Collected");
        collectibleMusic.play();
        points += collectible.point;

        // Player has collected this gem, so remove it from array
        array.splice(index, 1);
      }
    });
  }

  /* This is called by the update function and loops through all of the
   * objects within your allEnemies array as defined in app.js and calls
   * their update() methods. It will then call the update function for your
   * player object. These update methods should focus purely on updating
   * the data/properties related to the object. Do your drawing in your
   * render methods.
   */
  function updateEntities(dt) {
    allEnemies.forEach(function(enemy) {
      enemy.update(dt);
    });
    player.update();
    entireCollectibles.forEach(function(collectible) {
      collectible.update(dt);
    });
  }


  /* This function is called by the update function and loops through
   * all the enemies to find out if player has collided with any one
   * of them.
   */
  function enemyCollisions() {
    allEnemies.forEach(function(enemy) {
      if (collisionNum(enemy, player)) {
        life -= 1;
        if (life === 0) {
          init();
        }
        resetPlayer();
      }
    });
  }


  function collisionNum(object1, object2) {
    if (object1.x < object2.x + object2.width &&
      object1.x + object1.width > object2.x &&
      object1.y < object2.y + object2.height &&
      object1.height + object1.y > object2.y) {
      console.log("Collision detected");
      return true;
    } else {
      return false;
    }
  }

  /* This function initially draws the "game level", it will then call
   * the renderEntities function. Remember, this function is called every
   * game tick (or loop of the game engine) because that's how games work -
   * they are flipbooks creating the illusion of animation but in reality
   * they are just drawing the entire screen over and over.
   */
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
      numCols = numOfColumns,
      row, col;

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     */
    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        /* The drawImage function of the canvas' context element
         * requires 3 parameters: the image to draw, the x coordinate
         * to start drawing and the y coordinate to start drawing.
         * We're using our Resources helpers to refer to our images
         * so that we get the benefits of caching these images, since
         * we're using them over and over.
         */
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }

    renderCollectibles();
    renderEntities();
    givenLives();
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
    ctx.strokeText(points, 1140, 95);
    ctx.fillText(points, 1140, 95);
  }


// Function to render lives remaining of the player
  function givenLives() {
    var lifeSprite = "images/heart-small.png";
    var x = 1000;
    var y = 60;
    ctx.drawImage(Resources.get(lifeSprite), x, y);
    ctx.font = "32px Comic Sans MS";
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#dbdbdbd";
    ctx.strokeText(life, 1040, 92);
    ctx.fillText(life, 1040, 92);
  }
  /* This function is called by the render function and is called on each game
   * tick. Its purpose is to then call the render functions you have defined
   * on your enemy and player entities within app.js
   */
  function renderEntities() {
    /* Loop through all of the objects within the allEnemies array and call
     * the render function you have defined.
     */
    allEnemies.forEach(function(enemy) {
      enemy.render();
    });
    player.render();
  }

// Function to render all the gems
  function renderCollectibles() {
    entireCollectibles.forEach(function(collectible) {
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
    collectiblesNumber = Math.max(Math.floor(Math.random() * 10), 5);
    entireCollectibles = [];
    for (var i = 0; i < collectiblesNumber; i++) {
      var collectibleType = Math.floor((Math.random() * 3));
      entireCollectibles.push(new Collectible(collectibleType));
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

  /* Go ahead and load all of the images we know we're going to need to
   * draw our game level. Then set init as the callback method, so that when
   * all of these images are properly loaded our game will start.
   */
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

  /* Assign the canvas' context object to the global variable (the window
   * object when run in a browser) so that developers can use it more easily
   * from within their app.js files.
   */
  global.ctx = ctx;
})(this);
