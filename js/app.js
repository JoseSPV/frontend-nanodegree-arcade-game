// Enemies our player must avoid
var Enemy = function(settings) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = settings.initialPosition.x || 0;
    this.y = settings.initialPosition.y || 0;
    this.size = [101,65];
    this.speed = settings.xMovementSpeed || 100;
    this.sprite = 'images/enemy-bug.png';

}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if( this.x < enemiesCanvasBoundaries.right ) {
        this.x += dt * this.speed;
    } else {
        this.x = enemiesCanvasBoundaries.left;
    }


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

        this.x = settings.initialPosition.x || 0;
        this.y = settings.initialPosition.y || 0;
        this.size =[101,];
        this.xMovementSpeed = 101;
        this.yMovementSpeed = 83;
        this.specialAbility = 0;
        this.sprite = settings.playerSprite || 'images/char-cat-girl.png';
    }

}

Player.prototype.update = function() {
    //check if player is within the canvas boundaries
    //cheackColisions();
    checkBoundaries();

}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(keyPressed) {

        switch(keyPressed) {

            case 'left':    this.x -= this.xMovementSpeed;
                            break;

            case 'up':      this.y -= this.yMovementSpeed;
                            break;

            case 'right':   this.x += this.xMovementSpeed;
                            break;

            case 'down':    this.y += this.yMovementSpeed;
                            break;

        default:
                    break;
    }

}

// The function checks wheter the player is within the boundaries defined in "playerCanvasBoundaries", if not the player won't be allowed to continue moving in this direction
function checkBoundaries() {

    if(player.x < playerCanvasBoundaries.left) {
        player.x = playerCanvasBoundaries.left;
    }
    else if(player.x > playerCanvasBoundaries.right - 101) {
        player.x = playerCanvasBoundaries.right - 101;
    }

    if(player.y < playerCanvasBoundaries.top) {
        player.y = playerCanvasBoundaries.top;
    }
    else if(player.y > playerCanvasBoundaries.bottom ) {
        player.y = playerCanvasBoundaries.bottom;
    }

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = {};
var playerCanvasBoundaries = {
    "left": 0,
    "top":  -5,
    "right": 505,
    "bottom" : 382

};

var allEnemies = [];
var enemiesCanvasBoundaries = {
    "left": -101,
    "top": 0,
    "right": 606,
    "bottom": 165,
}
enemiesSpawnRows = [60,135,235];
enemiesSpawnCols = [0,-110,-150,-190,-230,-260];
var enemiesAmount = 6;
var enemiesVelocity = [110,220,250,300,350,375];

for( var i = 0; i < enemiesAmount; i++ ) {

    var rowIndex = Math.floor(Math.random()*3);
    var colIndex = Math.floor(Math.random()*6);
    var enemySpeed = Math.floor(Math.random()*enemiesVelocity.length);

    allEnemies.push(
        new Enemy(
            {
                "initialPosition": { "x": enemiesSpawnCols[colIndex], "y": enemiesSpawnRows[rowIndex] },
                "xMovementSpeed": enemiesVelocity.splice(enemySpeed,1)
            }
        )
    )


    enemiesSpawnCols.splice(colIndex,1);
}

/*allEnemies = [
    new Enemy(
        {
            "initialPosition": { "x": -101, "y": 171 },
            "xMovementSpeed": enemiesVelocity[Math.floor(Math.random()*7)]
        }
    ),
    new Enemy(
        {
            "initialPosition": { "x": 0, "y": 250 },
            "xMovementSpeed": enemiesVelocity[Math.floor(Math.random()*7)]
        }
    )
];*/


/* TODO: calculate the initial position according to the canvas size */
var playerSettings = {
    "initialPosition": {"x": 202, "y": 382}
};
player = new Player(playerSettings);

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
