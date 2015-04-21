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

        this.size = {'width': settings.spriteSize.wSize, 'height': settings.spriteSize.hSize}; //defines the box around the bug
        this.xMovementSpeed = settings.speed.xSpeed;

        this.sprite = settings.enemySprite;
    } else {
        console.log('Object Enemy @settings (' + typeof settings + ')');
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
   if(this.x < 5) {
        this.x += dt * this.xMovementSpeed / 101; //it let us moves using our tiles system
    } else {
        this.x = -1;
    }

    // Check if there is a collision between the bug and the player
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

        //defines the box around the player used for collisions
        this.size = {'width': settings.spriteSize.wSize, 'height': settings.spriteSize.hSize};

        this.xMovementSpeed = settings.speed.xSpeed;
        this.yMovementSpeed = settings.speed.ySpeed;

        this.sprite = settings.playerSprite;
        this.playerLives = [];

        // Draw the lives sprites
        var livesPosition = -0.2;

        for(var i = 0; i < settings.lives; i++) {
            livesPosition += 0.3;
            this.playerLives.push(
                new Lives({'position': {'x': livesPosition , 'y': 0}})
            );
        }
        this.playerStepFx = new Audio('sounds/player/step.ogg');
        this.hit = new Audio('sounds/player/hit.ogg');

    } else {
        console.log('Object Player param: settings (' + typeof settings + ')');
    }
};

// Keep player within canvas boundaries
Player.prototype.update = function() {
    if(this.x < 0) {
        this.x = 0;

    } else if(this.x > 4) {
        this.x  = 4;
    }

    if(this.y < 0) {
        this.y = 0;

    } else if(this.y > 5 ) {
        this.y = 5;
    }
};

// Draw the player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 - 20);
};

Player.prototype.handleInput = function(keyPressed) {
    switch(keyPressed) {

        case 'left': this.x -= this.xMovementSpeed;
                     //Sometimes the player is quicker than the browser and the browser doesn't play the sound when he is still playing the previous coursor sound,
                     //this way we will force to play the sound from the begining
                     this.playerStepFx.currentTime = 0;
                     this.playerStepFx.play();
        break;
        case 'up': this.y -= this.yMovementSpeed;
                   this.playerStepFx.currentTime = 0;
                   this.playerStepFx.play();
        break;
        case 'right': this.x += this.xMovementSpeed;
                      this.playerStepFx.currentTime = 0;
                      this.playerStepFx.play();
        break;
        case 'down': this.y += this.yMovementSpeed;
                     this.playerStepFx.currentTime = 0;
                     this.playerStepFx.play();
        break;
    }
};

// Removes a live from the player
Player.prototype.damage = function () {
    this.x = this.initalX;
    this.y = this.initalY;

    this.hit.currentTime = 0;
    this.hit.play();

    this.playerLives.pop();
};

// Set the player position to it's inital position
Player.prototype.resetPos = function () {
    this.x = this.initalX;
    this.y = this.initalY;
};

// Player Lives
var Lives = function (settings) {
    if(settings) {
        this.x = settings.position.x;
        this.y = settings.position.y;
    }
    this.sprite = 'images/game/heart.png';
};

Lives.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite),this.x * 101 ,this.y * 83);
};

// Game Cursor
var Cursor = function (settings) {
    if(settings){
        this.x = settings.position.x;
        this.y = settings.position.y;
    }

    this.charSelected = 0;
    this.finish = false;

    this.sprite = 'images/cursor/Selector.png';
    this.cursorFx = new Audio('sounds/cursor/cursor.ogg');
    this.confirmFx = new Audio('sounds/cursor/confirm.ogg');
}

Cursor.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite),this.x ,this.y);
};

Cursor.prototype.handleInput = function (keyPressed) {
    switch (keyPressed) {

        case 'left':  if( this.x > 51 ) {
                        /* Sometimes the player is quicker than the browser and the browser doesn't play the sound
                        *  when he is still playing the previous coursor sound,
                        *  setting the currentTime to  "0" we will force to play the sound from the begining
                        */
                        this.cursorFx.currentTime = 0;
                        this.cursorFx.play();

                        this.x -= 101;
                        this.charSelected --;
                      }
        break;
        case 'right': if( this.x < 354 ) {
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
* The Game object stores the game status, levels, player and some FX and music
* Is responsible of loading the appropriate level and check wheter the game is over.
*
* TODO: Read the level settings from a json file. This way we could develop a graphic tool for level designers
* where they would be able to set the level parameters enemies position, etc.
* TODO: Create a gain node graph to add volume controls for sounds and music
* TODO: improve collisions system in order to improve it's performance, something like a greed or q-tree
*/
var Game = function () {

    this.status = '';
    this.gameOvertext = '';

    /* The player is created here. We will use tiles as our position unit except for
    *  level texts and enemies velocities where a higher accuracy is desired.
    *
    *  Every tile is 101px wide and 83px heigh. Every x coordinate will be our tile unit * the tile width and every y coordinate will be tile * 83
    */
    this.player = new Player({
        'position': {'x': 2 , 'y': 5},
        'spriteSize': {'wSize': 0.8, 'hSize': 0.2},
        'speed': {'xSpeed': 1, 'ySpeed': 1},
        'playerSprite': 'images/char-princess-girl.png',
        'lives': 3
    });

    // Game scenes pointers used to know which is the current scene and the next
    this.currentScene = 0;
    this.nextScene = 1;

    // All the scenes the game has
    this.gameScenes = [
        new CharSelection(),
        new GameLevel ({
                rowImages: ['images/water-block.png',   // Top row is water
                            'images/stone-block.png',   // Row 1 of 3 of stone
                            'images/stone-block.png',   // Row 2 of 3 of stone
                            'images/stone-block.png',   // Row 3 of 3 of stone
                            'images/grass-block.png',   // Row 1 of 2 of grass
                            'images/grass-block.png'    // Row 2 of 2 of grass
                            ],
                numRows: 6,
                numCols: 5,
                colSize: 101,
                rowsize: 83,
                enemiesAmount: 3,
                enemiesSpawnCols: [0,1,2,3,4],
                enemiesSpawnRows: [1,2,3],
                enemiesVelocities: [101,150,200,250,300,350], // speed in pixels not in tiles
                levelText: 'Level 1'

        }),
        new GameLevel ({
                rowImages: ['images/water-block.png',   // Top row is water
                            'images/stone-block.png',   // Row 1 of 3 of stone
                            'images/stone-block.png',   // Row 2 of 3 of stone
                            'images/stone-block.png',   // Row 3 of 3 of stone
                            'images/grass-block.png',   // Row 1 of 2 of grass
                            'images/grass-block.png'    // Row 2 of 2 of grass
                            ],
                numRows: 6,
                numCols: 5,
                colSize: 101,
                rowsize: 83,
                enemiesAmount: 5,
                enemiesSpawnCols: [0,1,2,3,4],
                enemiesSpawnRows: [1,2,3],
                enemiesVelocities: [101,150,200,250,300,350],
                levelText: 'Level 2'
        }),
        new GameLevel ({
                rowImages: ['images/water-block.png',   // Top row is water
                            'images/stone-block.png',   // Row 1 of 3 of stone
                            'images/stone-block.png',   // Row 2 of 3 of stone
                            'images/stone-block.png',   // Row 3 of 3 of stone
                            'images/stone-block.png',   // Row 1 of 2 of stone
                            'images/grass-block.png'    // Row 2 of 2 of grass
                            ],
                    numRows: 6,
                    numCols: 5,
                    colSize: 101,
                    rowsize: 83,
                    enemiesAmount: 6,
                    enemiesSpawnCols: [0,1,2,3,4],
                    enemiesSpawnRows: [1,2,3,4],
                    enemiesVelocities: [150,200,250,300,350,375],
                    levelText: 'Level 3'
        })
    ];

    /* Music and FX */
    this.backgroundMusic = new Audio('sounds/game.mp3');
    this.winMusic = new Audio('sounds/win.ogg');
    this.water = new Audio('sounds/water.ogg');
    this.gameOverMusic = new Audio('sounds/gameOver.ogg');

    this.backgroundMusic.volume = 0.2;

};

/* Draw the scene if the game status is not gameOver, in this case the game will render the game over screen.
*
*  The Game object delegates into the current scene the render, update and handleInput methods.
*/
Game.prototype.render = function () {
    if(this.status !== 'gameOver') {
        this.gameScenes[this.currentScene].render();
    } else {
        ctx.font = 'bold 20pt "Comic Sans MS", cursive, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = "black";
        ctx.fillText(this.gameOvertext, 252, 100);
        ctx.font = 'bold 20pt "Comic Sans MS", cursive, sans-serif';
        ctx.fillText('Press Enter to Restart', 252, 160);
    }
};

Game.prototype.renderEntities = function () {
    if(this.status !== 'gameOver') {
        this.gameScenes[this.currentScene].renderEntities();
    }
};

Game.prototype.update = function (dt) {
    if(this.status !== 'gameOver') {
        this.gameScenes[this.currentScene].update(dt);
    }
};

Game.prototype.updateEntities = function (dt) {
    if(this.status !== 'gameOver' && this.currentScene !== 0) {
        this.gameScenes[this.currentScene].updateEntities(dt);
    }
};

// We use the box method to check for collisions between the player and the enemies
Game.prototype.checkCollisions = function (enemy,player) {
    return (enemy.x < player.x + player.size.width &&
            enemy.x + enemy.size.width > player.x &&
            enemy.y < player.y + player.size.height &&
            enemy.size.height + enemy.y > player.y);
};

// Loads the next scene and controls if the game has finish
Game.prototype.loadScene = function (newScene) {
    this.player.resetPos();

    // When the game loads the first time
    if(this.nextScene < this.gameScenes.length) {
        this.currentScene++;
        this.nextScene++;
    } else {
        this.gameOver();
    }
};

Game.prototype.handleInput = function (keyPressed) {
    switch (keyPressed) {
        case 'enter':  this.status = 'reset';
        break;
    }
};

// Change the game status to game over and prepares the game over scene
Game.prototype.gameOver = function () {
    this.status = 'gameOver';

    if (game.player.playerLives.length > 0){
        this.winMusic.play();
        this.gameOvertext = 'You did it!';
    } else {
        this.gameOverMusic.play();
        this.gameOvertext = 'Game Over!';
    }

    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
};

/* Game Scenes */

/*
* This is the scene where the player choose the character.
* The scene will draw the backgrounds, available characters and the cursor the player will use to select one of the characters.
*/
var CharSelection = function () {
    this.charSelected = 0;
    this.charsInitalX = 50;
    this.charsInitalY = canvas.height / 2 - 90;
    this.finish = false;

    // Graphic elements
    this.chars = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-princess-girl.png'
    ];
    this.cursor = new Cursor ({
        'position': {'x': 51, 'y': canvas.height / 2 - 90},
        'sprite': 'images/charSelect/Selector.png',
    });
    this.animatedBackgroundLayer = {
        'image': 'images/charSelect/background.png',
        'backgroundSpeed': 75,
        'position': {'x': 0, 'y': 0}
    };
    /* In order to center the non-animated background
    *   - the x will be (canvas width - background image widht)
    *   - the y will be (canvas height - background image height)
    */
    this.backgroundLayer = {
        'image': 'images/charSelect/gui.png',
        'position': { 'x': 21, 'y': 104 }
    };

    // Audio tracks and fx
    this.backgroundMusic = new Audio('sounds/menu.mp3');
    this.backgroundMusic.volume = 0.2;
};

/* Character selection */

/* Render Methods */
CharSelection.prototype.render = function () {

    // Animated Background Layer
    ctx.drawImage(Resources.get(this.animatedBackgroundLayer.image), this.animatedBackgroundLayer.position.x, this.animatedBackgroundLayer.position.y);

    // We will draw another image at the top edge of the first image
    ctx.drawImage(Resources.get(this.animatedBackgroundLayer.image), this.animatedBackgroundLayer.position.x, this.animatedBackgroundLayer.position.y - canvas.height);

    // Static Background Layer
    ctx.drawImage(Resources.get(this.backgroundLayer.image), this.backgroundLayer.position.x, this.backgroundLayer.position.y);
};

CharSelection.prototype.renderEntities = function () {
    this.cursor.render();

    // Draw the available characters
    var gapsBetweenSprites = this.charsInitalX;
    var availableChars = this.chars.length;

    for(var i = 0; i < availableChars; i++) {
        ctx.drawImage(Resources.get(this.chars[i]), gapsBetweenSprites, this.charsInitalY);
        gapsBetweenSprites += 101;
    }
};

CharSelection.prototype.update = function (dt) {
    if(this.cursor.finish) {
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;

        game.player.sprite = this.chars[this.cursor.charSelected];
        game.loadScene();

    } else {
        // Animate Background
        this.animatedBackgroundLayer.position.y += this.animatedBackgroundLayer.backgroundSpeed * dt;

        // If the image scrolled off the screen, we reset it's 'y' position to 0
        if ( this.animatedBackgroundLayer.position.y >= canvas.height ) {
            this.animatedBackgroundLayer.position.y = 0;
        }

        // Play Music
        this.backgroundMusic.play();
    }
};

CharSelection.prototype.handleInput = function (keyPressed) {
    this.cursor.handleInput(keyPressed);
};

/* Game Levels */
var GameLevel = function (levelSettings) {
    // Map Tiles
    this.rowImages = levelSettings.rowImages;

    // Tiles size and amount of columns and rows
    this.numRows = levelSettings.numRows;
    this.numCols = levelSettings.numCols;
    this.colSize = levelSettings.colSize;
    this.rowsize = levelSettings.rowsize;
    this.row;
    this.col;

    // Enemies settings for this level
    this.enemies = [];
    this.enemiesAmount = levelSettings.enemiesAmount;
    this.enemiesSpawnRows = levelSettings.enemiesSpawnRows; // y coordinate
    this.enemiesSpawnCols = levelSettings.enemiesSpawnCols; // x coordinate
    this.enemiesVelocities = levelSettings.enemiesVelocities; // arbitrary speeds

    // Other Settings
    this.levelText = levelSettings.levelText;

    /* Distribute enemies among the stone rows
    *  A random distribution can occur on crowded rows, thus we will try to put on the enemies
    *  on different rows manually
    */
    var enemyRow = 0;
    for(var i = 0; i < this.enemiesAmount; i++) {

        // For the columns and velocities we will use random numbers taken from the arrays previosly defined
        var colIndex = Math.floor(Math.random() * this.enemiesSpawnCols.length);
        var enemySpeed = Math.floor(Math.random() * this.enemiesVelocities.length);

        if(enemyRow === this.enemiesSpawnRows.length) {
            enemyRow = 0;
        }

        this.enemies.push(
            new Enemy(
                {
                    'position': {'x': this.enemiesSpawnCols[colIndex], 'y': this.enemiesSpawnRows[enemyRow]},
                    'spriteSize': {'wSize': 0.8,'hSize': 0.65},
                    'speed': {'xSpeed': this.enemiesVelocities[enemySpeed]},
                    'enemySprite': 'images/enemy-bug.png'
                }
            )
        );
        this.enemiesSpawnCols.splice(colIndex,1);
        this.enemiesVelocities.splice(enemySpeed,1);

        enemyRow++;
    }
};

GameLevel.prototype.render = function () {
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

    // The level text for top right corner
    ctx.font = 'bold 20pt "Comic Sans MS", cursive, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f1c40f';
    ctx.fillText(this.levelText, 450, 40);
};

GameLevel.prototype.renderEntities = function () {
    for(var i = 0; i < this.enemiesAmount; i++) {
        this.enemies[i].render();
    }

    var playerLives = game.player.playerLives.length;
    for(var i = 0; i < playerLives; i++) {
        game.player.playerLives[i].render();
    }
    game.player.render();
};

GameLevel.prototype.update = function (dt) {
    // Check if the player has enough lives to continue playing in this case check if the player has reach the water
    if (game.player.playerLives.length > 0) {

        if (game.player.x >= 0 && game.player.x <= 4 && game.player.y === 0) {
            game.water.play();
            game.backgroundMusic.pause();
            game.backgroundMusic.currentTime = 0;
            game.loadScene();

        } else {
            game.backgroundMusic.play();
        }

    } else {
        game.gameOver();
    }
};

GameLevel.prototype.updateEntities = function (dt) {
    for(var i = 0; i < this.enemiesAmount; i++) {
        this.enemies[i].update(dt);
    }
    game.player.update();
};

// We will use this var to create the game manager object
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

    // Use the appropriate function to handle the game input
    if(game.currentScene === 0) {
        game.gameScenes[game.currentScene].handleInput(allowedKeys[e.keyCode]);

    } else if( game.status === 'gameOver') {
        game.handleInput(allowedKeys[e.keyCode]);

    } else {
        game.player.handleInput(allowedKeys[e.keyCode]);
    }

});