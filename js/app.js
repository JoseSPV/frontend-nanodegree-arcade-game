/* Game Entities */

// Enemies our player must avoid
var Enemy = function(settings) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    if(settings) {
        this.x = settings.position.x;
        this.y = settings.position.y ;
        this.size = {'width': settings.spriteSize.wSize, 'height': settings.spriteSize.hSize};
        this.xMovementSpeed = settings.speed.xSpeed;
        this.sprite = settings.enemySprite;
    } else {
        console.log('Object Player param: settings (' + typeof settings + ')');
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
   if(this.x < 5) {
        this.x += dt * this.xMovementSpeed / 101;
    } else {
        this.x = -1;
    }

    if (game.checkCollisions(this,game.player)){
        game.player.damage();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 - 20);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(settings) {
    if(settings) {
        this.x = settings.position.x;
        this.y = settings.position.y;
        this.initalX = settings.position.x;
        this.initalY = settings.position.y;
        this.size = {'width': settings.spriteSize.wSize, 'height': settings.spriteSize.hSize};
        this.xMovementSpeed = settings.speed.xSpeed;
        this.yMovementSpeed = settings.speed.ySpeed;
        this.sprite = settings.playerSprite;
        this.playerLives = [];

        var livesPosition = -0.2;

        for(var i = 0; i < settings.lives; i++) {
            livesPosition += 0.3;
            this.playerLives.push(
                new Lives({'position': {'x': livesPosition , 'y': 0}})
            );
        }
        this.playerStepFx = new Audio('sounds/step.ogg');

    } else {
        console.log('Object Player param: settings (' + typeof settings + ')');
    }
};

/* Update Methods */
Player.prototype.update = function() {
    //kee player within canvas boundaries
    if(this.x < 0) {
        this.x = 0;
    }
    else if(this.x > 4) {
        this.x  = 4;
    }

    if(this.y < 0) {
        this.y = 0;
    }
    else if(this.y > 5 ) {
        this.y = 5;
    }

};

/* Render Methods */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 - 20);
};

Player.prototype.handleInput = function(keyPressed) {
    switch(keyPressed) {

        case 'left':    this.x -= this.xMovementSpeed;
                        this.playerStepFx.currentTime = 0;
                        this.playerStepFx.play();
        break;
        case 'up':      this.y -= this.yMovementSpeed;
                        this.playerStepFx.currentTime = 0;
                        this.playerStepFx.play();
        break;
        case 'right':   this.x += this.xMovementSpeed;
                        this.playerStepFx.currentTime = 0;
                        this.playerStepFx.play();
        break;
        case 'down':    this.y += this.yMovementSpeed;
                        this.playerStepFx.currentTime = 0;
                        this.playerStepFx.play();
        break;
    }
};

Player.prototype.damage = function () {
    this.x = this.initalX;
    this.y = this.initalY;
    this.playerLives.pop();
};

Player.prototype.resetPos = function () {
    this.x = this.initalX;
    this.y = this.initalY;
};

/* Player Lives */
var Lives = function (settings) {
    if(settings) {
        this.x = settings.position.x;
        this.y = settings.position.y;
    }
    this.sprite = 'images/game/heart.png';
};

/* Render Methods */
Lives.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite),this.x * 101 ,this.y * 83);
};

/* Game Curosr */
var Cursor = function (settings) {
    if(settings){
        this.x = settings.position.x;
        this.y = settings.position.y;
    }
    this.charSelected = 0;
    this.finish = false;
    this.sprite = 'images/charSelect/Selector.png';
    this.cursorFx = new Audio('sounds/cursor.ogg');
    this.confirmFx = new Audio('sounds/confirm.ogg');
}

/* Render Methods */
Cursor.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite),this.x ,this.y);
};

/* Update Methods */
Cursor.prototype.update = function (dt) {

};

/* Other Methods */
Cursor.prototype.handleInput = function (keyPressed) {
    switch (keyPressed) {

        case 'left':  if( this.x > 51 ) {
                        //Sometimes the player is quicker than the browser and the browser doesn't play the sound when he is still playing the previous coursor sound,
                        //this way we will force to play the sound from the begining
                        this.cursorFx.currentTime = 0;
                        this.cursorFx.play();

                        this.x -= 101;
                        this.charSelected --;
                      }
                      break;
        case 'right': if( this.x < 354 ) {
                        //Sometimes the player is quicker than the browser and the browser doesn't play the sound when he is still playing the previous coursor sound,
                        //this way we will force to play the sound from the begining
                        this.cursorFx.currentTime = 0;
                        this.cursorFx.play();

                        this.x += 101;
                        this.charSelected ++;
                      }
                      break;
        case 'enter':  this.finish = true;
                       this.confirmFx.play();
                       break;
    }
};


/* GAME MANAGER
* It is a light version of what I pretended.
* Basically it stores the game state and check is is gameOver or win.
* The object also stores the game scenes to load and invoke the render, update and handleIput methods of each one when required.
* The game background music is also managed by this object as long as we don't implement a real sound managers with gain nodes.
*/
var Game = function () {

    this.status = '';
    this.gameOvertext = '';

    // The player is created here with a default settings object
    this.player = new Player({
        'position': {'x': 2 , 'y': 5},
        'spriteSize': {'wSize': 0.8, 'hSize': 0.2},
        'speed': {'xSpeed': 1, 'ySpeed': 1},
        'playerSprite': 'images/char-princess-girl.png',
        'lives': 3
    });

    // Pointer to the current scene
    this.currentScene = 'menu';

    this.gameScenes = {
        'menu': {
            'handler': new CharSelection()
        },
        'FirstLevel': {
            'handler': new FirstLevel()
        },
        'SecondLevel': {
            'handler': new SecondLevel()
        },
        'ThirdLevel': {
            'handler': new ThirdLevel()
        }
    };

    this.backgroundMusic = new Audio('sounds/game.mp3');
    this.backgroundMusic.volume = 0.2;
};

/* Render Methods */
Game.prototype.render = function () {
    if(this.status !== 'gameOver') {
        this.gameScenes[this.currentScene].handler.render();
    } else {
        ctx.font = 'bold 20pt "Comic Sans MS", cursive, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = "black";
        ctx.fillText(this.gameOvertext, 252, 100);
        ctx.font = 'bold 14pt "Comic Sans MS", cursive, sans-serif';
        ctx.fillText('Press Enter to Restart', 252, 160);
    }
};

Game.prototype.renderEntities = function () {
    if(this.status !== 'gameOver') {
        this.gameScenes[this.currentScene].handler.renderEntities();
    }
};

/* Update Methods */
Game.prototype.update = function (dt) {
    if(this.status !== 'gameOver') {
        this.gameScenes[this.currentScene].handler.update(dt);
    }
};

Game.prototype.updateEntities = function (dt) {
    if(this.status !== 'gameOver') {
        this.gameScenes[this.currentScene].handler.updateEntities(dt);
    }
};

/* Other Methods*/
Game.prototype.checkCollisions = function (enemy,player) {
    return (enemy.x < player.x + player.size.width &&
                enemy.x + enemy.size.width > player.x &&
                enemy.y < player.y + player.size.height &&
                enemy.size.height + enemy.y > player.y);
};

Game.prototype.changeScene = function (newScene) {
    this.player.resetPos();
    this.currentScene = newScene;
};

Game.prototype.handleInput = function (keyPressed) {
    switch (keyPressed) {
        case 'enter':  this.status = 'reset';
                       break;
    }
};

Game.prototype.gameOver = function () {
    this.status = 'gameOver';
    this.gameOvertext = 'Game Over!';
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
};

Game.prototype.win = function () {
    this.status = 'gameOver';
    this.gameOvertext = 'You did it!';
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
};


/* Game Scenes */

// This is the scene where the player choose the character
/*
    The scene will draw the backgrounds, available characters and the cursor.
*/
var CharSelection = function () {
    this.charSelected = 0;

    this.charsInitalX = 50;
    this.charsInitalY = canvas.height / 2 - 90;

    this.finish = false;

    /* Graphic elements */
    this.chars = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-princess-girl.png'
    ];

    /*this.cursor = {
        'src': 'images/charSelect/Selector.png',
        'position': {'x': 51, 'y': canvas.height / 2 - 90},
        'xAxisBoundaries': {'min': 51, 'max': 354},
        'cursorSpeed': 101
    };*/

    this.cursor = new Cursor ({
        'position': {'x': 51, 'y': canvas.height / 2 - 90},
        'sprite': 'images/charSelect/Selector.png',
    });

    this.animatedBackgroundLayer = {
        'image': 'images/charSelect/background.png',
        'backgroundSpeed': 75,
        'position': {'x': 0, 'y': 0}
    };

    this.backgroundLayer = {
        'image': 'images/charSelect/gui.png',
        'position': { 'x': 21, 'y': 104 } //canvas width - image widht # canvas height - image height, in order to center the non-animated background layer
    };

    /* Audio tracks and fx */
    this.backgroundMusic = new Audio('sounds/menu.mp3');

    this.backgroundMusic.volume = 0.2;
};

/* Character selection */

/* Render Methods */
CharSelection.prototype.render = function () {

    /* Animated Background Layer*/
    ctx.drawImage(Resources.get(this.animatedBackgroundLayer.image), this.animatedBackgroundLayer.position.x, this.animatedBackgroundLayer.position.y);

    // We will draw another image at the top edge of the first image
    ctx.drawImage(Resources.get(this.animatedBackgroundLayer.image), this.animatedBackgroundLayer.position.x, this.animatedBackgroundLayer.position.y - canvas.height);

    /* Static Background Layer */
    ctx.drawImage(Resources.get(this.backgroundLayer.image), this.backgroundLayer.position.x, this.backgroundLayer.position.y);
};

CharSelection.prototype.renderEntities = function () {
    this.cursor.render();

    /* Players */
    var gapsBetweenSprites = this.charsInitalX;
    var availableChars = this.chars.length;

    for(var i=0; i < availableChars; i++) {
        ctx.drawImage(Resources.get(this.chars[i]), gapsBetweenSprites, this.charsInitalY);
        gapsBetweenSprites += 101;
    }
};

/* Update Methods */
CharSelection.prototype.update = function (dt) {
    if(this.cursor.finish) {
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;

        game.player.sprite = this.chars[this.cursor.charSelected];
        game.changeScene('FirstLevel');

    } else {
        /* Animate Background */
        this.animatedBackgroundLayer.position.y += this.animatedBackgroundLayer.backgroundSpeed * dt;

        // If the image scrolled off the screen, we reset it's 'y' position
        if ( this.animatedBackgroundLayer.position.y >= canvas.height ) {
            this.animatedBackgroundLayer.position.y = 0;
        }

        /* Play Music */
        this.backgroundMusic.play();
    }
};

CharSelection.prototype.updateEntities = function (dt) {
    this.cursor.update(dt);
}

/* Other Methods*/
CharSelection.prototype.handleInput = function (keyPressed) {
    this.cursor.handleInput(keyPressed);
};

/* Game Levels */

/* Firs Level Screen */
var FirstLevel = function () {
    /* Map Tiles*/
    this.rowImages = [
        'images/water-block.png',   // Top row is water
        'images/stone-block.png',   // Row 1 of 3 of stone
        'images/stone-block.png',   // Row 2 of 3 of stone
        'images/stone-block.png',   // Row 3 of 3 of stone
        'images/grass-block.png',   // Row 1 of 2 of grass
        'images/grass-block.png'    // Row 2 of 2 of grass
    ];

    /* Tiles size and amount of columns and rows */
    this.numRows = 6;
    this.numCols = 5;
    this.colSize = 101;
    this.rowsize = 83;
    this.row;
    this.col;

    /* Enemies settings for this level */
    this.enemies = [];
    this.enemiesAmount = 3;
    this.enemiesSpawnRows = [1,2,3]; // y coordinate
    this.enemiesSpawnCols = [0,1,2,3,4]; // x coordinate
    this.enemiesVelocities = [101,150,200,250,300,350]; //arbitrary speeds

    /* Distribute enemies among the stone rows
    *  A random distribution can occur on crowded rows, thus we will try to put on the enemies
    *  on different rows manually
    */
    for(var i = 0; i < this.enemiesAmount; i++) {

        // For the enemies speed columns and velocities we'll use random numbers within a range previously defined
        var colIndex = Math.floor(Math.random() * this.enemiesSpawnCols.length);
        var enemySpeed = Math.floor(Math.random() * this.enemiesVelocities.length);

        this.enemies.push(
            new Enemy(
                {
                    'position': {'x': this.enemiesSpawnCols[colIndex], 'y': this.enemiesSpawnRows[i]}, //(y,x)
                    'spriteSize': {'wSize': 0.8,'hSize': 0.65},
                    'speed': {'xSpeed': this.enemiesVelocities[enemySpeed]},
                    'enemySprite': 'images/enemy-bug.png'
                }
            )
        );
        this.enemiesSpawnCols.splice(colIndex,1);
        this.enemiesVelocities.splice(enemySpeed,1)
    }
};

/* Render Methods */
FirstLevel.prototype.render = function () {
    /* Loop through the number of rows and columns we've definSed above
     * and, using the rowImages array, draw the correct image for that
     * portion of the 'grid'
     */
    for (this.row = 0; this.row < this.numRows; this.row++) {
        for (this.col = 0; this.col < this.numCols; this.col++) {
            /* The drawImage function of the canvas' context element
             * requires 3 parameters: the image to draw, the x coordinate
             * to start drawing and the y coordinate to start drawing.
             * We're using our Resources helpers to refer to our images
             * so that we get the benefits of caching these images, since
             * we're using them over and over.
             */
            ctx.drawImage(Resources.get(this.rowImages[this.row]), this.col * 101, this.row * 83);
        }
    }

    ctx.font = 'bold 20pt "Comic Sans MS", cursive, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('Level: 1', 450, 40);
};

FirstLevel.prototype.renderEntities = function () {
    for(var i = 0; i < this.enemiesAmount; i++) {
        this.enemies[i].render();
    }

    var playerLives = game.player.playerLives.length;
    for(var i = 0; i < playerLives; i++) {
        game.player.playerLives[i].render();
    }
    game.player.render();
};

/* Update Methods */
FirstLevel.prototype.update = function (dt) {
    if (game.player.playerLives.length > 0) {

        if (game.player.x >= 0 && game.player.x <= 4 && game.player.y === 0) {
            game.backgroundMusic.pause();
            game.backgroundMusic.currentTime = 0;
            game.changeScene('SecondLevel');
        } else {
            game.backgroundMusic.play();
        }

    } else {
        game.gameOver();
    }
};

FirstLevel.prototype.updateEntities = function (dt) {
    for(var i = 0; i < this.enemiesAmount; i++) {
        this.enemies[i].update(dt);
    }
    game.player.update();
};


/* Second Level */
var SecondLevel = function () {
    /* Map Tiles*/
    this.rowImages = [
        'images/water-block.png',   // Top row is water
        'images/stone-block.png',   // Row 1 of 3 of stone
        'images/stone-block.png',   // Row 2 of 3 of stone
        'images/stone-block.png',   // Row 3 of 3 of stone
        'images/grass-block.png',   // Row 1 of 2 of grass
        'images/grass-block.png'    // Row 2 of 2 of grass
    ];

    /* Tiles size and amount of columns and rows */
    this.numRows = 6;
    this.numCols = 5;
    this.colSize = 101;
    this.rowsize = 83;
    this.row;
    this.col;

    /* Enemies settings for this level */
    this.enemies = [];
    this.enemiesAmount = 5;
    this.enemiesSpawnRows = [1,2,3]; // y coordinate
    this.enemiesSpawnCols = [0,1,2,3,4]; // x coordinate
    this.enemiesVelocities = [101,150,200,250,300,350]; //arbitrary speeds

    var enemyRow = 0;
    for(var i = 0; i < this.enemiesAmount; i++) {
        /* Distribute enemies among the stone rows
        *  A random distribution can occur on crowded rows, thus we will try to put on the enemies
        *  on different rows manually
        */
        if(enemyRow === 2) {
            enemyRow = 0;
        } else {
            enemyRow++;
        }

        // For the enemies speed columns and velocities we'll use random numbers within a range previously defined
        var colIndex = Math.floor(Math.random() * this.enemiesSpawnCols.length);
        var enemySpeed = Math.floor(Math.random() * this.enemiesVelocities.length);

        this.enemies.push(
            new Enemy(
                {
                    'position': {'x': this.enemiesSpawnCols[colIndex], 'y': this.enemiesSpawnRows[enemyRow]}, //(y,x)
                    'spriteSize': {'wSize': 0.8, 'hSize': 0.65},
                    'speed': {'xSpeed': this.enemiesVelocities[enemySpeed]},
                    'enemySprite': 'images/enemy-bug.png'
                }
            )
        );
        this.enemiesSpawnCols.splice(colIndex,1);
        this.enemiesVelocities.splice(enemySpeed,1)
    }
};

/* Render Methods */
SecondLevel.prototype.render = function () {
    for (this.row = 0; this.row < this.numRows; this.row++) {
        for (this.col = 0; this.col < this.numCols; this.col++) {
            ctx.drawImage(Resources.get(this.rowImages[this.row]), this.col * 101, this.row * 83);
        }
    }
    ctx.font = 'bold 20pt "Comic Sans MS", cursive, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('Level: 2', 450, 40);
};

SecondLevel.prototype.renderEntities = function () {
    for(var i = 0; i < this.enemiesAmount; i++) {
        this.enemies[i].render();
    }

    var playerLives = game.player.playerLives.length;
    for(var i = 0; i < playerLives; i++) {
        game.player.playerLives[i].render();
    }
    game.player.render();
};

/* Update Methods */
SecondLevel.prototype.update = function (dt) {
    if (game.player.playerLives.length > 0) {

        if (game.player.x >= 0 && game.player.x <= 4 && game.player.y === 0) {
            game.backgroundMusic.pause();
            game.backgroundMusic.currentTime = 0;
            game.changeScene('ThirdLevel');
        } else {
            game.backgroundMusic.play();
        }
    } else {
        game.gameOver();
    }
};

SecondLevel.prototype.updateEntities = function (dt) {
    for(var i = 0; i < this.enemiesAmount; i++) {
        this.enemies[i].update(dt);
    }
    game.player.update();
};

/* Second Level */
var ThirdLevel = function () {
    /* Map Tiles*/
    this.rowImages = [
        'images/water-block.png',   // Top row is water
        'images/stone-block.png',   // Row 1 of 3 of stone
        'images/stone-block.png',   // Row 2 of 3 of stone
        'images/stone-block.png',   // Row 3 of 3 of stone
        'images/stone-block.png',   // Row 1 of 2 of stone
        'images/grass-block.png'    // Row 2 of 2 of grass
    ];

    /* Tiles size and amount of columns and rows */
    this.numRows = 6;
    this.numCols = 5;
    this.colSize = 101;
    this.rowsize = 83;
    this.row;
    this.col;

    /* Enemies settings for this level */
    this.enemies = [];
    this.enemiesAmount = 6;
    this.enemiesSpawnRows = [1,2,3,4]; // y coordinate
    this.enemiesSpawnCols = [0,1,2,3,4]; // x coordinate
    this.enemiesVelocities = [150,200,250,300,350,375]; //arbitrary speeds

    var enemyRow = 0;

    for(var i = 0; i < this.enemiesAmount; i++) {

        /* Distribute enemies among the stone rows
        *  A random distribution can occur on crowded rows, thus we will try to put on the enemies
        *  on different rows manually
        */
        if(enemyRow === 3) {
            enemyRow = 0;
        } else {
            enemyRow++;
        }

        // For the enemies speed columns and velocities we'll use random numbers within a range previously defined
        var colIndex = Math.floor(Math.random() * this.enemiesSpawnCols.length);
        var enemySpeed = Math.floor(Math.random() * this.enemiesVelocities.length);

        this.enemies.push(
            new Enemy(
                {
                    'position': {'x': this.enemiesSpawnCols[colIndex], 'y': this.enemiesSpawnRows[enemyRow]},
                    'spriteSize': {'wSize': 0.8, 'hSize': 0.65},
                    'speed': {'xSpeed': this.enemiesVelocities[enemySpeed]},
                    'enemySprite': 'images/enemy-bug.png'
                }
            )
        );

        this.enemiesSpawnCols.splice(colIndex,1);
        this.enemiesVelocities.splice(enemySpeed,1)
    }
};

/* Render Methods */
ThirdLevel.prototype.render = function () {
    for (this.row = 0; this.row < this.numRows; this.row++) {
        for (this.col = 0; this.col < this.numCols; this.col++) {
            ctx.drawImage(Resources.get(this.rowImages[this.row]), this.col * 101, this.row * 83);
        }
    }
    ctx.font = '#27ae60 bold 20pt "Comic Sans MS", cursive, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('Level: 3', 450, 40);
};

ThirdLevel.prototype.renderEntities = function () {
    for(var i = 0; i < this.enemiesAmount; i++) {
        this.enemies[i].render();
    }

    var playerLives = game.player.playerLives.length;
    for(var i = 0; i < playerLives; i++) {
        game.player.playerLives[i].render();
    }
    game.player.render();
};

/* Update Methods */
ThirdLevel.prototype.update = function (dt) {
    if (game.player.playerLives.length > 0) {

        if (game.player.x >= 0 && game.player.x <= 4 && game.player.y === 0) {
            game.win();
        } else {
            game.backgroundMusic.play();
        }
    } else {
        game.gameOver();
    }
};

ThirdLevel.prototype.updateEntities = function (dt) {
    for(var i = 0; i < this.enemiesAmount; i++) {
        this.enemies[i].update(dt);
    }
    game.player.update();
};

/* We will use this var to create the game manager object */
var game = {};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter' //added enter
    };

    if(game.currentScene === 'menu') {
        game.gameScenes[game.currentScene].handler.handleInput(allowedKeys[e.keyCode]);

    } else if(game.status === 'gameOver') {
        game.handleInput(allowedKeys[e.keyCode]);

    } else {
        game.player.handleInput(allowedKeys[e.keyCode]);
    }
});