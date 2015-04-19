/* ENTITIES */

// Enemies our player must avoid
var Enemy = function(settings) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    if( settings ) {

        this.x = settings.position.x;
        this.y = settings.position.y ;
        this.size = { "width": settings.spriteSize.wSize, "height": settings.spriteSize.hSize };
        this.xMovementSpeed = settings.speed.xSpeed;
        this.sprite = settings.enemySprite;

    } else {

        console.log("Object Player param: settings (" + typeof settings + ")");
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
   if( this.x < 5 ) {
        this.x += dt * this.xMovementSpeed / 101; //doing this we get a number
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

    if( settings ) {

        this.x = settings.position.x;
        this.y = settings.position.y;
        this.initalX = settings.position.x;
        this.initalY = settings.position.y;
        this.size = { "width": settings.spriteSize.wSize, "height": settings.spriteSize.hSize };
        this.xMovementSpeed = settings.speed.xSpeed;
        this.yMovementSpeed = settings.speed.ySpeed;
        this.sprite = settings.playerSprite;
        this.playerLives = [];

        var livesPosition = -0.2;

        for(var i = 0; i < settings.lives; i++) {
            livesPosition += 0.3;
            this.playerLives.push(
                new Lives( {"position": {"x": livesPosition , "y": 0.75} } )
                //new Lives( {"position": {"x": 0.4,"y": 0.75} } ),
                //new Lives( {"position": {"x": 0.7,"y": 0.75} } )
            );
        }
        console.log(this.playerLives);
        this.playerStepFx = new Audio('sounds/step.ogg');

    } else {

        console.log("Object Player param: settings (" + typeof settings + ")");
    }
};

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

            case 'enter':   //special sound :)
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
}

var Lives = function (settings) {

    if(settings) {
        this.x = settings.position.x;
        this.y = settings.position.y;
    }

    this.sprite = 'images/game/heart.png';
};

Lives.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite),this.x * 101 ,this.y * 83);
}


/* GAME MANAGER */
var Game = function () {

    this.status = 'playing';

    this.player = new Player({
        "position": { "x": 2 , "y": 5 },
        "spriteSize": { "wSize": 0.8,"hSize": 0.2},
        "speed": { "xSpeed": 1, "ySpeed": 1},
        "playerSprite": 'images/char-princess-girl.png',
        "lives": 3
    });

    this.enemies = [];

    this.currentScene = "menu";

    /* A better idea would be mapping the levels with the different tiles */
    this.gameScenes = {
        "menu": {
            "handler": new CharSelection()
        },
        "FirstLevel": {
            "entities": true,
            "handler": new FirstLevel()
        },
        "SecondLevel": {
            "entities": true,
            "handler": new SecondLevel
        }
    };

    /*this.gameOverMusic = new Audio('sounds/gameOver.ogg');
    this.winMusic = new Audio('sounds/win.ogg');*/
};

Game.prototype.render = function () {

    this.gameScenes[this.currentScene].handler.render();
};

Game.prototype.renderEntities = function () {

    if( this.gameScenes[this.currentScene].entities ) {
        this.gameScenes[this.currentScene].handler.renderEntities();
    }

};

Game.prototype.update = function (dt) {
    this.gameScenes[this.currentScene].handler.update(dt);
};

Game.prototype.updateEntities = function (dt) {

    if( this.gameScenes[this.currentScene].entities ) {
        this.gameScenes[this.currentScene].handler.updateEntities(dt);
    }
};


Game.prototype.checkCollisions = function (enemy,player) {

    return (  enemy.x < player.x + player.size.width &&
                enemy.x + enemy.size.width > player.x &&
                enemy.y < player.y + player.size.height &&
                enemy.size.height + enemy.y > player.y
            );

};

Game.prototype.changeScene = function (newScene) {
    this.player.resetPos();
    this.currentScene = newScene;
};

Game.prototype.handleInput = function (keyPressed) {
    this.gameScenes[this.currentScene].handler.handleInput(keyPressed);
};

Game.prototype.resetPlayer = function () {
    this.player.x = 2;
    this.player.y = 5;
};

Game.prototype.gameOver = function () {
    this.status = 'gameOVer';
};

Game.prototype.win = function () {
    this.status = 'gameOVer';
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

    this.cursor = {
        "src": 'images/charSelect/Selector.png',
        "position": { "x": 51, "y": canvas.height / 2 - 90 },
        "xAxisBoundaries": { "min": 51, "max": 354 },
        "cursorSpeed": 101
    };

    this.animatedBackgroundLayer = {
        "image": 'images/charSelect/background.png',
        "backgroundSpeed": 75,
        "position": { "x": 0, "y": 0 }
    };

    this.backgroundLayer = {
        "image": 'images/charSelect/gui.png',
        "position": { "x": 21, "y": 104 } //canvas width - image widht # canvas height - image height, in order to center the background layer
    };

    /* Audio tracks and fx */
    this.backgroundMusic = new Audio('sounds/menu.mp3');
    this.confirmFx = new Audio('sounds/confirm.ogg');
    this.cursorFx = new Audio('sounds/cursor.ogg');

    this.backgroundMusic.volume = 0.2;
};

/* Character Selection Screen */
CharSelection.prototype.render = function () {

    /* Animated Background Layer*/
    ctx.drawImage(Resources.get(this.animatedBackgroundLayer.image), this.animatedBackgroundLayer.position.x, this.animatedBackgroundLayer.position.y);

    // We will draw another image at the top edge of the first image
    ctx.drawImage(Resources.get(this.animatedBackgroundLayer.image), this.animatedBackgroundLayer.position.x, this.animatedBackgroundLayer.position.y - canvas.height);

    /* Static Background Layer */
    ctx.drawImage(Resources.get(this.backgroundLayer.image), this.backgroundLayer.position.x, this.backgroundLayer.position.y);

     /* Cursor */
    ctx.drawImage(Resources.get(this.cursor.src), this.cursor.position.x, this.cursor.position.y);

    /* Players */
    var gapsBetweenSprites = this.charsInitalX;
    for( pj in this.chars) {
        ctx.drawImage(Resources.get(this.chars[pj]), gapsBetweenSprites, this.charsInitalY);
        gapsBetweenSprites += 101;
    }
};

CharSelection.prototype.update = function (dt) {

    if( this.finish ) {

        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;

        game.player.sprite = this.chars[this.charSelected];
        game.changeScene("FirstLevel");

    } else {

        /* Animate Background */
        this.animatedBackgroundLayer.position.y += this.animatedBackgroundLayer.backgroundSpeed * dt;

        // If the image scrolled off the screen, we reset it's "y" position
        if ( this.animatedBackgroundLayer.position.y >= canvas.height ) {
            this.animatedBackgroundLayer.position.y = 0;
        }

        /* Play Music */
        this.backgroundMusic.play();
    }
};

CharSelection.prototype.handleInput = function (keyPressed) {

    switch (keyPressed) {

        case 'left':  if( this.cursor.position.x > this.cursor.xAxisBoundaries.min ) {
                        //Sometimes the player is quicker than the browser and the browser doesn't play the sound when he is still playing the previous coursor sound,
                        //this way we will force to play the sound from the begining
                        this.cursorFx.currentTime = 0;
                        this.cursorFx.play();

                        this.cursor.position.x -= this.cursor.cursorSpeed;
                        this.charSelected --;
                      }
                      break;

        case 'right': if( this.cursor.position.x < this.cursor.xAxisBoundaries.max ) {
                        //Sometimes the player is quicker than the browser and the browser doesn't play the sound when he is still playing the previous coursor sound,
                        //this way we will force to play the sound from the begining
                        this.cursorFx.currentTime = 0;
                        this.cursorFx.play();

                        this.cursor.position.x += this.cursor.cursorSpeed;
                        this.charSelected ++;
                      }
                      break;

        case 'enter':  this.finish = true;
                       this.confirmFx.play();
                       break;
    }

};

/* Game Levels */

/* Firs Level Screen */
var FirstLevel = function () {

    this.rowImages = [
        'images/water-block.png',   // Top row is water
        'images/stone-block.png',   // Row 1 of 3 of stone
        'images/stone-block.png',   // Row 2 of 3 of stone
        'images/stone-block.png',   // Row 3 of 3 of stone
        'images/grass-block.png',   // Row 1 of 2 of grass
        'images/grass-block.png'    // Row 2 of 2 of grass
    ];

    this.numRows = 6;
    this.numCols = 5;
    this.colSize = 101;
    this.rowsize = 83;
    this.row;
    this.col;

    /* Enemies settings for this level */
    this.enemies = [];
    this.enemiesAmount = 3;
    this.enemiesSpawnRows = [1,2,3]; // y
    this.enemiesSpawnCols = [0,1,2,3,4]; // x
    this.enemiesVelocities = [101,150,200,250,300,350]; //arbitrary speeds

    for( var i = 0; i < this.enemiesAmount; i++ ) {

        var colIndex = Math.floor(Math.random() * this.enemiesSpawnCols.length);
        var enemySpeed = Math.floor(Math.random() * this.enemiesVelocities.length);

        this.enemies.push(
            new Enemy(
                {
                    "position": { "x": this.enemiesSpawnCols[colIndex], "y": this.enemiesSpawnRows[i] }, //(y,x)
                    "spriteSize": { "wSize": 0.8,"hSize": 0.65},
                    "speed": { "xSpeed": this.enemiesVelocities[enemySpeed] },
                    "enemySprite": 'images/enemy-bug.png'
                }
            )
        );

        this.enemiesSpawnCols.splice(colIndex,1);
        this.enemiesVelocities.splice(enemySpeed,1)
    }

    /* Music and FX */
    this.backgroundMusic = new Audio('sounds/game.mp3');
    this.backgroundMusic.volume = 0.2;

};

FirstLevel.prototype.render = function () {

    /* Loop through the number of rows and columns we've definSed above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
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
};

FirstLevel.prototype.renderEntities = function () {

    for(enemy in this.enemies) {

        this.enemies[enemy].render();
    }

    for(live in game.player.playerLives) {
        game.player.playerLives[live].render();
    }

    game.player.render();
};

FirstLevel.prototype.update = function (dt) {

    if ( game.player.playerLives.length > 0 ) {

        if ( game.player.x >= 0 && game.player.x <= 4 && game.player.y === 0 ) {


            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            game.changeScene("SecondLevel");

        }
        this.backgroundMusic.play();

    } else {

        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
        game.gameOver();
    }


};

FirstLevel.prototype.updateEntities = function (dt) {

    for(enemy in this.enemies) {
        this.enemies[enemy].update(dt);
    }
    game.player.update();
};

FirstLevel.prototype.handleInput = function (keyPressed) {

    game.player.handleInput(keyPressed);
};

/* Second Level */
var SecondLevel = function () {

    this.rowImages = [
        'images/water-block.png',   // Top row is water
        'images/stone-block.png',   // Row 1 of 3 of stone
        'images/stone-block.png',   // Row 2 of 3 of stone
        'images/stone-block.png',   // Row 3 of 3 of stone
        'images/grass-block.png',   // Row 1 of 2 of grass
        'images/grass-block.png'    // Row 2 of 2 of grass
    ];

    this.numRows = 6;
    this.numCols = 5;
    this.colSize = 101;
    this.rowsize = 83;
    this.row;
    this.col;

    /* Enemies settings for this level */
    this.enemies = [];
    this.enemiesAmount = 5;
    this.enemiesSpawnRows = [1,2,3]; // y
    this.enemiesSpawnCols = [0,1,2,3,4]; // x
    this.enemiesVelocities = [101,150,200,250,300,350]; //arbitrary speeds

    for( var i = 0; i < this.enemiesAmount; i++ ) {

        var rowIndex = Math.floor(Math.random() * 3);
        var colIndex = Math.floor(Math.random() * this.enemiesSpawnCols.length);
        var enemySpeed = Math.floor(Math.random() * this.enemiesVelocities.length);

        this.enemies.push(
            new Enemy(
                {
                    "position": { "x": this.enemiesSpawnCols[colIndex], "y": this.enemiesSpawnRows[rowIndex] }, //(y,x)
                    "spriteSize": { "wSize": 0.8,"hSize": 0.65},
                    "speed": { "xSpeed": this.enemiesVelocities[enemySpeed] },
                    "enemySprite": 'images/enemy-bug.png'
                }
            )
        );

        this.enemiesSpawnCols.splice(colIndex,1);
        this.enemiesVelocities.splice(enemySpeed,1)
    }

    /* Music and FX */
    this.backgroundMusic = new Audio('sounds/game.mp3');
    this.backgroundMusic.volume = 0.2;

};

SecondLevel.prototype.render = function () {

    /* Loop through the number of rows and columns we've definSed above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
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
};

SecondLevel.prototype.renderEntities = function () {

    for(enemy in this.enemies) {

        this.enemies[enemy].render();
    }

    for(live in game.player.playerLives) {
        game.player.playerLives[live].render();
    }

    game.player.render();
};

SecondLevel.prototype.update = function (dt) {

    if ( game.player.playerLives.length > 0 ) {

        if ( game.player.x >= 0 && game.player.x <= 4 && game.player.y === 0 ) {


            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            //game.changeScene("ThirdLevel");
            game.win();

        }
        this.backgroundMusic.play();

    } else {

        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
        game.gameOver();
    }


};

SecondLevel.prototype.updateEntities = function (dt) {

    for(enemy in this.enemies) {
        this.enemies[enemy].update(dt);
    }
    game.player.update();
};

SecondLevel.prototype.handleInput = function (keyPressed) {

    game.player.handleInput(keyPressed);
};

var game = {};


/* TODO incorporar al game */
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
    game.handleInput(allowedKeys[e.keyCode]);

    //various handleler for each scene
});