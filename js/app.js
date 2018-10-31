// Declare globally used variables 
var tileWidth = 101;
var tileHeight = 85;
var tileHeightForEnemy = 80;
var playerWidth = 65;
var playerHeight = 50;
var canvasHeight = 956;
var canvasWidth = 1305;
var numColumns = 13;
var maxY = (tileHeight * 10) + (tileHeight / 2);

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/bug.png';
    this.x = -10;
    this.y =  (Math.floor((Math.random() * 8)) * tileHeight) + tileHeight + (tileHeight / 2) ;
    this.step = 450;

    // Set speed between 0.5 and 1
    this.speed = Math.max(Math.random(), 0.5);
    this.width = 100;
    this.height = 40;

};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = (this.x + (dt * this.speed * this.step)) % (canvasWidth + this.width);

    // Change the y coordinate and speed value if enemey is out of screen
    if(this.x > (canvasWidth)) {
        this.y = (Math.floor((Math.random() * 8)) * tileHeight) + tileHeight + (tileHeight / 2);
        this.speed = Math.max(Math.random(), 0.5);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
   
    this.sprite = 'images/char-boy.png';
    
    // Place player in the middle of the seventh tile from left horizontally
    this.x = (tileWidth * 6) + (tileWidth / 2) - (playerWidth / 2);

    // Place player in the middle of the eleventh tile from top vertically
    this.y = (tileHeight * 10) + (tileHeight / 2) - (playerHeight / 2);

    // moveY and moveX for move direction, initially set to zero
    this.moveY = 0;
    this.moveX = 0;

    this.height = 30;
    this.width = playerWidth;
};

Player.prototype.update = function(dt) {

    // Calculate the next X position based on direction
    var nextX = this.x + (this.moveX * tileWidth);

    // Update position only if within canvas bounds
    if (nextX <= numColumns*tileWidth && nextX >= 0) {
        this.x = nextX;
    }

    // Calculate the next Y position based on direction
    var nextY = this.y + (this.moveY * tileHeight);

    // Update position only if within canvas bounds
    if (nextY <= maxY && nextY >= 0 ) {
        this.y = nextY;
    }

    // After updating position, reset direction to zero
    this.moveY = 0;
    this.moveX = 0;
    
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(input) {

    switch(input) {
        case "left":
            this.moveY = 0;
            this.moveX = -1;
            break;
        case "up":
            this.moveY = -1;
            this.moveX = 0;
            break;
        case "right":
            this.moveY = 0;
            this.moveX = 1;
            break;
        case "down":
            this.moveY = 1;
            this.moveX = 0;
            break;
    }
    
};

var collectibleSprite = [
    'images/gem-blue.png',
    'images/gem-green.png',
    'images/gem-orange.png'
];

// Collectibles for scoring more points
// collectibleType defines the color and point of each gem and is a value between 0 and 2 inclusive.
var Collectible = function(collectibleType) {

    // X and Y position of the gem
    this.x = (Math.floor((Math.random() * 8)) * tileWidth) + (tileWidth * 1.5);
    this.y = (Math.floor((Math.random() * 8)) * tileHeight) + (tileHeight * 1.5);

    // How much points are scored, 50 for blue, 100 for green and 150 for orange gem.
    this.point = (collectibleType + 1) * 50;
    this.sprite = collectibleSprite[collectibleType];
    this.width = 50;
    this.height = 55;
};

Collectible.prototype.update = function(dt) {
    
    // Change collectible position with 0.1% probability
    if (Math.random() < 0.001) {
        this.x = (Math.floor((Math.random() * 8)) * tileWidth) + (tileWidth * 1.5);
        this.y = (Math.floor((Math.random() * 8)) * tileHeight) + (tileHeight * 1.5);
    }
};

Collectible.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);    
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = new Player();
var allEnemies = [];

// Initiate enemies, might make number of enemies dynamic in future.
for (var i = 0; i < 9; i++) {
    allEnemies.push(new Enemy());
}

// Number of collectibles, anywhere between 5 to 9
var numberOfCollectibles = Math.max(Math.floor(Math.random() * 10), 5);
var allCollectibles = [];
for (var i = 0; i < numberOfCollectibles; i++) {

    // Generate collectible type randomly
    var collectibleType = Math.floor((Math.random() * 3));
    allCollectibles.push(new Collectible(collectibleType));
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
