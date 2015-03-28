/* Special abilities available for the players.

   An special ability provides the player with an extra action within the following.

   -Ab1
   -Ab2


*/
/*var SuperPower = function {


}*/

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.y = 0;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


/*
//Player object accepts an object with some customizable settings.

@param object settings: object with the settings the new player created.

settings = {
    "initialPosition" = {"x": value, "y": value},
    "playerSprite" = 'spriteUrl',
    "specialAbility" = superPower.name
};
*/
var Player = function(settings) {

    if( settings ) {

        this.x = settings.initialPosition.x || 202;
        this.y = settings.initialPosition.y || 382;
        this.movementSpeed = 100;
        this.specialAbility = 0;
        this.sprite = settings.playerSprite || 'images/char-cat-girl.png';

    }

}

Player.prototype.update = function() {

    //check if player is within the canvas boundaries
    checkBoundaries();


}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/*TODO: aquí hace falta dt*/
Player.prototype.handleInput = function(keyPressed) {

        switch(keyPressed) {

            case 'left':    this.x -= this.movementSpeed;
                            break;

            case 'up':      this.y -= this.movementSpeed;
                            break;

            case 'right':   this.x += this.movementSpeed;
                            break;

            case 'down':    this.y += this.movementSpeed;
                            break;

            case 'spacebar': this.specialAbility = 1;
                             break;

        default:
                    break;
    }

}

function checkBoundaries() {

    if(player.x < 0) {
        player.x = 0;
    }
    else if(player.x > 505 - 101) {
        player.x = 505 - 101;;
    }

    if(player.y < 0) {
        player.y = 0;
    }
    else if(player.y > 564 - 171) {

        player.y = 382;
    }

    ///console.log(player);

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

var playerSettings = {
    "initialPosition": {"x": 200, "y": 400},
};
var player = new Player(playerSettings);



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'spacebar'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
