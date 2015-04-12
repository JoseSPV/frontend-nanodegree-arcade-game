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

function checkCollisions () {

    var numberOfEnemies = allEnemies.length,
        collisionDetected = 0;
        i = 0;
        //ver foro udacity para el cálculo de colisiones más correcto

    while( !collisionDetected && i < numberOfEnemies ) {

        if( allEnemies[i].x < player.x + player.size.width &&
            allEnemies[i].x + allEnemies[i].size.width > player.x &&
            allEnemies[i].y < player.y + player.size.height &&
            allEnemies[i].size.height + allEnemies[i].y > player.y ) {

            collisionDetected = 1;

        } else {
            i++;
        }
    }

    return collisionDetected;
}

/* ENTITIES */

// Enemies our player must avoid
var Enemy = function(settings) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = settings.initialPosition.x || 0;
    this.y = settings.initialPosition.y || 0;
    this.size = { "width": 80, "height": 65 };
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


//quitar los default los establece el game
var Player = function(settings) {

    if( settings ) {

        this.x = settings.initialPosition.x;
        this.y = settings.initialPosition.y;
        this.size = { "width": settings.spriteSize.wSize/*80*/, "height": settings.spriteSize.hSize/*20*/ };
        this.xMovementSpeed = settings.xSpeed//101;
        this.yMovementSpeed = settings.ySpeed//83;
        this.sprite = settings.playerSprite || 'images/char-cat-girl.png';
    } else {
        console.log("Player settings not provided" + typeof(settings) );
    }

}

Player.prototype.update = function() {

    //hacerlo en el update de engine
    /*checkBoundaries();
    if (checkCollisions() ) {
        console.log("colision detectada");
        gameOver();
    }*/
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

            case 'enter':   break;

        default:
                    break;
    }

}

/* GAME MANAGER */
var Game = function () {
    this.timer = 60;
    //this.playerLives = 3; //entidad propia?
    this.currentScene = {};
    this.sceneCreated = false;
    this.gameScenesPointer = "menu";

    this.gameScenes = {
        "menu": {
            "entities": [],
            "handler": CharSelection
        },
        "firstWorld": {
            "entities": ["player","allEnemies"],//podemos guardar así las funciones?
            "handler": "Level1"
        }
    }

    this.player = {};
    this.enemies = [];
    this.canvas = canvas;
}

Game.prototype.render = function () {
    if( !this.sceneCreated ) {
        this.currentScene = new this.gameScenes[this.gameScenesPointer].handler();
        this.sceneCreated = true;
    }

    this.currentScene.render();
}

Game.prototype.renderEntities = function () {
    if( this.currentScene.entities.length > 0 ) {
        for( entity in this.currentScene.entities ) {
            this.currentScene.entities[entity].render();
        }
    }
}

Game.prototype.update = function () {

    //update de todas las entities de la escena
    //checkCollisions();
}

Game.prototype.changeScene = function (newScene) {
    this.currentScene = newScene;
}

Game.prototype.handleInput = function (keyPressed) {
    this.currentScene.handleInput(keyPressed);
}

Game.prototype.getCanvasData = function () {
    return this.canvas;
}

///Game.prototype.checkCollisions();

var CharSelection = function () {
    this.charSelected = 0;
    this.canvas = game.getCanvasData();
    this.chars = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png'
    ];
    this.cursor = {
        "src": 'images/charSelect/Selector.png',
        "position": {"x": 0, "y":0},
        "cursorSpeed": 101
    };
    this.animatedBackgroundLayer = {
        "image": 'images/charSelect/background.png',
        "backgroundSpeed": 0.5,
        "position": {"x": 0, "y": 0}
    };
    this.backgroundLayer = {
        "image": 'images/charSelect/gui.png',
        "position": {"x": 21, "y": 104} //canvas width - image widht # canvas height - image height, in order to center the background layer
    };
    this.sounds = {
        "backgroundMusic": new Audio("sounds/menu.mp3")
    }
}

/* GAME SCENES */
CharSelection.prototype.render = function () {

    /* Animated Background Layer*/
    this.animatedBackgroundLayer.position.y += this.animatedBackgroundLayer.backgroundSpeed;

    ctx.drawImage(Resources.get(this.animatedBackgroundLayer.image), this.animatedBackgroundLayer.position.x, this.animatedBackgroundLayer.position.y);

    // Draw another image at the top edge of the first image
    ctx.drawImage(Resources.get(this.animatedBackgroundLayer.image), this.animatedBackgroundLayer.position.x, this.animatedBackgroundLayer.position.y - this.canvas.height);

    // If the image scrolled off the screen, reset
    if ( this.animatedBackgroundLayer.position.y >= this.canvas.height ) {

        this.animatedBackgroundLayer.position.y = 0;
    }

    /* Static Background Layer */
    ctx.drawImage(Resources.get(this.backgroundLayer.image), this.backgroundLayer.position.x, this.backgroundLayer.position.y);

     /* Cursor */
    //ctx.drawImage(Resources.get(this.cursor.src), this.cursor.position.x, this.cursor.position.y);

    /* Players */
    /*var gapsBetweenSprites = 0;
    for( pj in this.chars) {
        gapsBetweenSprites += 101;
        ctx.drawImage(Resources.get(this.chars[pj]), gapsBetweenSprites, 0);//pensar en como colocarlos
    }*/

    /* Play Music */
    this.sounds.backgroundMusic.play();
}

CharSelection.prototype.update = function () {

}

CharSelection.prototype.handleInput = function (keyPressed) {
    switch (keyPressed) {

        case 'left':  if( this.cursor.position.x > 0 ) {
                        this.cursor.position.x -= this.cursor.position.x - this.cursor.cursorSpeed;
                      }
                      break;
        case 'right': if( this.cursor.position.x < canvas.width ) {
                        this.cursor.position.x += this.cursor.position.x + this.cursor.cursorSpeed;
                      }
                      break;
        case 'enter': /*game.changeScene("game");*/ console.log("enter"); break;
    }

}

var firstWorld = function () {

};


var game = {};


/*
var chars ['images/char-boy.png','images/char-cat-girl.png','images/char-horn-girl.png'];
var charSelected = 0;
var playerSettings = {
    "initialPosition": {"x": 202, "y": 382},
    "playerSprite": 'images/charSelect/Selector.png',
    "spriteSize": {"wSize": 0, "hSize": 0},
    "xSpeed": 100,
    "ySpeed": 0,
};*/




























// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
/*var player = {},
    allEnemies = [],
    game = {};*/


/*var playerCanvasBoundaries = {
    "left": 0,
    "top":  -5,
    "right": 505,
    "bottom" : 382

};

var enemiesCanvasBoundaries = {
    "left": -101,
    "top": 0,
    "right": 606,
    "bottom": 165,
}
enemiesSpawnRows = [60,135,225];
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

/* TODO: calculate the initial position according to the canvas size */
/*var playerSettings = {
    "initialPosition": {"x": 202, "y": 382}
};
player = new Player(playerSettings);*/

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
        //enter
    };

    //player.handleInput(allowedKeys[e.keyCode]);
    game.handleInput(allowedKeys[e.keyCode]);

    //various handleler for each scene
});
