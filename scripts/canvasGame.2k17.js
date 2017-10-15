/*
 * ------------------------
 * CANVAS GAME TEST 2017
 * ------------------------
 * Main Game Engine
 * ------------------------
 */

// Create an immediately invoked functional expression to wrap our code
(function($){


    // -- GAME VARS -- //

    // Window Variables
    var gameWindow = {
        rootDiv: null,
        canvasDiv: null,
        canvasObject: null,
        canvasContext: null,
        consoleDiv: null,
        buttonsDiv: null
        };

    // Settings Variables
    var gameSettings = {
        baseHref: 'http://canvas.game.test/',
        htmlClass: '.game',
        htmlCanvasClass: '.canvas',
        htmlConsoleClass: '.console',
        htmlButtonsClass: '.buttons',
        baseCanvasWidth: 962,
        baseCanvasHeight: 248,
        baseCanvasHeight: 248,
        baseBackgroundWidth: 1124,
        baseBackgroundHeight: 248,
        baseForegroundWidth: 1124,
        baseForegroundHeight: 248,
        baseGameSpeed: 1,
        baseFramesPerSecond: 60,
        autoGameLoop: true,
        pauseGameLoop: false,
        showDebug: false
        };

    // State Variables
    var gameState = {
        lastLoopTime: 0,
        lastLoopDiff: 0,
        loopCounter: 0,
        currentFrame: 0,
        canvasWidth: 0,
        canvasHeight: 0,
        canvasMiddleX: 0,
        canvasMiddleY: 0
        };

    // Image Variables
    var gameImages = [
        'images/logo-large.png',
        'images/logo-small.png',
        'images/robot-status_left.png',
        'images/robot-status_right.png'
        ];

    // Sprite Variables
    var gameSpriteIndexKeys = [];
    var gameSpriteIndex = {};
    var gameSpriteRenderOrder = [];

    // Field Variables
    var battleField = {};

    // Robot Variables
    var playerRobots = {};
    var targetRobots = {};

    // -- PUBLIC METHODS -- //

    // Define our canvas game constructor
    var thisGame;
    this.canvasGameEngine = function(){
        debug('new canvasGameEngine()');

        // Set variable pointers
        thisGame = this;
        thisGame.gameWindow = gameWindow;

        thisGame.gameSettings = gameSettings;
        thisGame.gameState = gameState;

        thisGame.gameImages = gameImages;

        thisGame.gameSpriteIndexKeys = gameSpriteIndexKeys;
        thisGame.gameSpriteIndex = gameSpriteIndex;
        thisGame.gameSpriteRenderOrder = gameSpriteRenderOrder;

        thisGame.battleField = battleField;
        thisGame.playerRobots = playerRobots;
        thisGame.targetRobots = targetRobots;

        // Define game settings defaults
        var defaultSettings = gameSettings;

        // Create settings by extending defaults with the passed in arugments
        if (arguments[0] && typeof arguments[0] === "object") {
            thisGame.gameSettings = extendSettings(defaultSettings, arguments[0]);
            } else {
            thisGame.gameSettings = defaultSettings;
            }

        // Initialize the game engine
        loadEngine();

    }

    // Define a method for setting the battle field
    canvasGameEngine.prototype.setBattleField = function(fieldToken){
        debug('canvasGameEngine.setField(fieldToken)', fieldToken);

        // Collect battle field data based on token
        var battleField = battleFieldIndex.getField(fieldToken);

        // Update base field data with provided args
        thisGame.battleField.fieldName = battleField.fieldName;
        thisGame.battleField.fieldBackground = cloneObject(battleField.fieldBackground);
        thisGame.battleField.fieldForeground = cloneObject(battleField.fieldForeground);
        //console.log('\t thisGame.battleField = ', thisGame.battleField);

        // Push field images into the resource queue
        thisGame.gameImages.push(thisGame.battleField.fieldBackground.filePath);
        thisGame.gameImages.push(thisGame.battleField.fieldForeground.filePath);
        //console.log('\t thisGame.gameImages = ', thisGame.gameImages);

    }

    // Define our init object to setting things up
    canvasGameEngine.prototype.startGame = function(){
        debug('canvasGameEngine.startGame()');

        // Load required image files and then start the game
        resourceManager.loadFiles(thisGame.gameImages, function(){
            //console.log('resourceManager.loadFiles() complete!', thisGame.gameImages);

            // Load all the canvas sprites
            loadCanvasSprites();

            // Start the game
            //console.log('STARTING GAME!!!');
            startGame();

            });

    }

    // Define a function for changing the entire battle field by token
    canvasGameEngine.prototype.changeField = function(fieldToken){
        //console.log('canvasGameEngine.changeField()', fieldToken);

        // Collect data for the requested field from the index
        var battleField = battleFieldIndex.getField(fieldToken);
        //console.log('\t battleField = ', battleField);

        // If data was collected, use it to update the current field
        if (battleField !== false){ changeBattleField(battleField); }

    }

    // Define a function for changing the battle field background by token
    canvasGameEngine.prototype.changeFieldBackground = function(fieldToken){
        //console.log('canvasGameEngine.changeFieldBackground()', fieldToken);

        // Collect data for the requested field from the index
        var battleField = battleFieldIndex.getField(fieldToken);
        //console.log('\t battleField = ', battleField);

        // If data was collected, use it to update the current field
        if (battleField !== false){ changeBattleFieldBackground(battleField.fieldBackground); }

    }

    // Define a function for changing the battle field foreground by token
    canvasGameEngine.prototype.changeFieldForeground = function(fieldToken){
        //console.log('canvasGameEngine.changeFieldForeground(fieldToken)', fieldToken);

        // Collect data for the requested field from the index
        var battleField = battleFieldIndex.getField(fieldToken);
        //console.log('\t battleField = ', battleField);

        // If data was collected, use it to update the current field
        if (battleField !== false){ changeBattleFieldForeground(battleField.fieldForeground); }

    }

    // Define a function for loading a new player robot into the battle
    canvasGameEngine.prototype.loadPlayerRobot = function(robotKey, robotToken, robotPosition){
        //console.log('canvasGameEngine.newPlayerRobot()', robotKey, robotToken, robotPosition);

        // Collect data for the requested field from the index
        var playerRobot = robotIndex.getRobot(robotToken);
        //console.log('\t playerRobot = ', playerRobot);

        // Set the robot key and position based on arguments
        playerRobot.robotKey = robotKey;
        playerRobot.robotPosition = robotPosition;
        playerRobot.robotDirection = 'right';

        // If data was collected, load the player robot into the game
        if (playerRobot !== false){ newPlayerRobot(playerRobot); }

    }

    // Define a function for loading a new target robot into the battle
    canvasGameEngine.prototype.loadTargetRobot = function(robotKey, robotToken, robotPosition){
        //console.log('canvasGameEngine.newTargetRobot()', robotKey, robotToken, robotPosition);

        // Collect data for the requested field from the index
        var targetRobot = robotIndex.getRobot(robotToken);
        //console.log('\t targetRobot = ', targetRobot);

        // Set the robot key and position based on arguments
        targetRobot.robotKey = robotKey;
        targetRobot.robotPosition = robotPosition;
        targetRobot.robotDirection = 'left';

        // If data was collected, load the player robot into the game
        if (targetRobot !== false){ newTargetRobot(targetRobot); }

    }


    // -- INIT FUNCTIONS -- //

    // Define a function for loading our game
    function loadEngine(){
        debug('canvasGameEngine.loadEngine()');

        // Define object references to HTML elements
        thisGame.gameWindow.rootDiv = $(thisGame.gameSettings.htmlClass);
        thisGame.gameWindow.canvasDiv = $(thisGame.gameSettings.htmlCanvasClass, thisGame.gameWindow.rootDiv);
        thisGame.gameWindow.consoleDiv = $(thisGame.gameSettings.htmlConsoleClass, thisGame.gameWindow.rootDiv);
        thisGame.gameWindow.buttonsDiv = $(thisGame.gameSettings.htmlButtonsClass, thisGame.gameWindow.rootDiv);

        // Update the resource manager's config
        resourceManager.setup({
            parentElement: thisGame.gameWindow.rootDiv,
            baseHref: thisGame.gameSettings.baseHref
            });

    }

    // Define a function for intializing the actual game engine
    function startGame(){
        debug('canvasGameEngine.startGame()');

        initGameLoop();
        initGameCanvas();
        mainGameLoop();

    }

    // Define a function for initializing the game loop
    function initGameLoop(){
        debug('canvasGameEngine.initGameLoop()');

        // Define click event for the "Pause Game" / "Resume Game" buttons
        $('.pause', thisGame.gameWindow.buttonsDiv).bind('click', function(e){
            //console.log('.pause.click()');
            e.preventDefault();
            var thisButton = $(this);
            if (thisGame.gameSettings.autoGameLoop == true){
                pauseGame();
                //console.log('\t pauseGame();');
                thisButton.html('Resume Game').attr('data-state', 'off');
                return;
                } else {
                resumeGame();
                //console.log('\t resumeGame();');
                thisButton.html('Pause Game').attr('data-state', 'on');
                return;
                }
            });

        // Define click event for the "Show Debug" / "Hide Debug" buttons
        $('.debug', thisGame.gameWindow.buttonsDiv).bind('click', function(e){
            //console.log('.debug.click()');
            e.preventDefault();
            var thisButton = $(this);
            if (thisGame.gameSettings.showDebug === true){
                hideDebug();
                //console.log('\t hideDebug();');
                thisButton.html('Show Debug').attr('data-state', 'off');
                return;
                } else {
                showDebug();
                //console.log('\t showDebug();');
                thisButton.html('Hide Debug').attr('data-state', 'on');
                return;
                }
            });

    }

    // Define a function for initializing the game canvas
    function initGameCanvas(){
        debug('initGameCanvas.initGameLoop()');

        thisGame.gameWindow.canvasDiv.css({opacity:0});
        thisGame.gameWindow.canvasObject = $('canvas', thisGame.gameWindow.canvasDiv).get(0);
        thisGame.gameWindow.canvasContext = thisGame.gameWindow.canvasObject.getContext('2d');
        //debug('\t thisGame.gameWindow.canvasObject = ' + thisGame.gameWindow.canvasObject);
        //debug('\t thisGame.gameWindow.canvasContext = ' + thisGame.gameWindow.canvasContext);

        thisGame.gameState.canvasWidth = thisGame.gameSettings.baseCanvasWidth;
        thisGame.gameState.canvasHeight = thisGame.gameSettings.baseCanvasHeight;
        thisGame.gameState.canvasMiddleX = Math.ceil(thisGame.gameState.canvasWidth / 2);
        thisGame.gameState.canvasMiddleY = Math.ceil(thisGame.gameState.canvasHeight / 2);

        $(window).bind('resize', function(){

            resizeGameCanvas();

            });

        updateGameCanvas(function(){
            thisGame.gameWindow.canvasDiv.animate({opacity:1}, 500, 'swing');
            });

    }


    // -- GAME LOOP FUNCTIONS -- //

    // Define the main game loop for literally everything
    function mainGameLoop(){
        debug('canvasGameEngine.mainGameLoop()');

        //debug('\t thisGame.gameSettings.pauseGameLoop = ' + thisGame.gameSettings.pauseGameLoop);
        if (thisGame.gameSettings.pauseGameLoop == true){ return false; }

        //debug('\t thisGame.gameSettings.autoGameLoop = ' + thisGame.gameSettings.autoGameLoop);
        if (thisGame.gameSettings.autoGameLoop == false){ return false; }

        var nowTime = performance.now() || Date.now();
        //var diffTime = (nowTime - thisGame.gameState.lastLoopTime) / 1000.0;
        var diffTime = nowTime - thisGame.gameState.lastLoopTime;

        var requiredTime = 1000.0 / thisGame.gameSettings.baseFramesPerSecond;

        //console.log('---------');
        //console.log('\t thisGame.gameState.loopCounter = ' + thisGame.gameState.loopCounter);
        //console.log('\t thisGame.gameSettings.baseFramesPerSecond = ' + thisGame.gameSettings.baseFramesPerSecond);
        //console.log('\t nowTime = ' + nowTime);
        //console.log('\t thisGame.gameState.lastLoopTime = ' + thisGame.gameState.lastLoopTime);
        //console.log('\t diffTime = ' + diffTime);
        //console.log('\t requiredTime = ' + requiredTime);

        if (Math.ceil(diffTime) >= Math.floor(requiredTime)){

            //console.log('\t render!');

            updateGameCanvas();
            renderGameCanvas();

            thisGame.gameState.loopCounter++;
            thisGame.gameState.currentFrame = thisGame.gameState.loopCounter + 1;
            //debug('\t thisGame.gameState.loopCounter = ' + thisGame.gameState.loopCounter);

            thisGame.gameState.lastLoopDiff = diffTime;
            thisGame.gameState.lastLoopTime = nowTime;

            requestAnimFrame(mainGameLoop);

        } else {

            //console.log('\t don\'t render!');

            requestAnimFrame(mainGameLoop);

        }

    }

    // Define a toggle function for pausing the game loop
    function pauseGame(){
        debug('canvasGameEngine.pauseGame()');
        thisGame.gameSettings.autoGameLoop = false;
        return;
    }

    // Define a toggle function for resuming the game loop
    function resumeGame(){
        debug('canvasGameEngine.resumeGame()');
        thisGame.gameSettings.autoGameLoop = true;
        mainGameLoop();
        return;
    }


    // -- GAME CANVAS FUNCTIONS -- //

    // Define a function for quickly gett

    // Define a function for updating or recalculating game canvas properties
    function updateGameCanvas(callBack){
        debug('canvasGameEngine.updateGameCanvas()');

        var thisCanvas = thisGame.gameWindow.canvasContext;

        if (typeof callBack == 'function'){ callBack(); }

    }

    // Define a function for rendering game canvas given propteries and state
    function renderGameCanvas(){
        debug('canvasGameEngine.renderGameCanvas()');

        // Collect a reference to the canvas
        var thisCanvas = thisGame.gameWindow.canvasContext;

        clearCanvas();

        drawCanvasSprites();

        drawFrameCounter();

    }

    // Define a function for clearing the canvas
    function clearCanvas(){
        debug('canvasGameEngine.clearCanvas()');

        // Collect a reference to the canvas
        var thisCanvas = thisGame.gameWindow.canvasContext;

        thisCanvas.fillStyle = '#101010';
        thisCanvas.fillRect(0, 0, thisGame.gameState.canvasWidth, thisGame.gameState.canvasHeight);

    }

    // Define a function for loading all of the game's sprites
    function loadCanvasSprites(){
        debug('canvasGameEngine.loadCanvasSprites()');

        // Load the field background sprite
        loadFieldBackgroundSprite(thisGame.battleField.fieldBackground);

        // Load the field foreground sprite
        loadFieldForegroundSprite(thisGame.battleField.fieldForeground);

    }


    // -- ROBOT FUNCTIONS -- //

    // Define a function for inserting a new robot into the player's team
    function newPlayerRobot(playerRobot){
        //console.log('canvasGameEngine.newPlayerRobot()', playerRobot);

        // Insert this new robot data into the player team array
        newBattleRobot('player', playerRobot);

    }

    // Define a function for inserting a new robot into the target's team
    function newTargetRobot(targetRobot){
        //console.log('canvasGameEngine.newTargetRobot()', targetRobot);

        // Insert this new robot data into the target team array
        newBattleRobot('target', targetRobot);

    }

    // Define a function for inserting a new robot into the player's team
    function newBattleRobot(battleTeam, battleRobot){
        //console.log('canvasGameEngine.newBattleRobot()', battleTeam, battleRobot);

        // Create a pointer to the appropriate team
        if (battleTeam == 'player'){ var battleTeamRobots = thisGame.playerRobots; }
        else if (battleTeam == 'target'){ var battleTeamRobots = thisGame.targetRobots; }
        else { return false; }

        // Clone the provided robot data and assign to player
        var robotKey = battleRobot.robotKey;
        var robotToken = battleRobot.robotToken;
        var robotDirection = battleRobot.robotDirection;
        battleTeamRobots[robotKey] = cloneObject(battleRobot);

        // Update the robot sprites' frame directions
        battleTeamRobots[robotKey].robotMug.frameDirection = robotDirection;
        battleTeamRobots[robotKey].robotSprite.frameDirection = robotDirection;

        // Define the robot image kinds, directions, and sizes
        var imageKinds = ['mug', 'sprite', 'shadow'];
        var imageDirections = ['left', 'right'];
        var imageSizes = ['base', 'zoom'];

        // Generate a list of this robot's sprite URLs
        var robotImageURLs = [];
        for (var i in imageKinds){
            var imageKind = imageKinds[i];
            for (var j in imageDirections){
                var imageDirection = imageDirections[j];
                for (var k in imageSizes){
                    var imageSize = imageSizes[k];
                    var imageURL = 'images/robots/'+robotToken+'/'+imageKind+'_'+imageDirection+'_'+imageSize+'.png';
                    robotImageURLs.push(imageURL);
                    thisGame.gameImages.push(imageURL);
                }
            }
        }

        // Define the dynamic function for collecting robot's base X position
        var robotPositionX = function(){
            var battleRobot = battleTeamRobots[robotKey];
            var robotCell = battleRobot.robotPosition;
            var robotDirection = battleRobot.robotDirection;
            var robotCellPosition = getRobotCellPosition(robotCell, robotDirection);
            var baseSpriteWidth = battleRobot.robotSprite.frameWidth || (battleRobot.robotSprite.frameSize || 80);
            var robotPositionX = thisGame.gameState.canvasMiddleX;
            if (robotDirection === 'right'){ robotPositionX -= robotCellPosition[0]; }
            else if (robotDirection === 'left'){ robotPositionX += robotCellPosition[0]; }
            robotPositionX -= Math.ceil(baseSpriteWidth / 2);
            return robotPositionX;
            };

        // Define the dynamic function for collecting this robot's base Y position
        var robotPositionY = function(){
            var battleRobot = battleTeamRobots[robotKey];
            var robotCell = battleRobot.robotPosition;
            var robotDirection = battleRobot.robotDirection;
            var robotCellPosition = getRobotCellPosition(robotCell, robotDirection);
            var baseSpriteHeight = battleRobot.robotSprite.frameHeight || (battleRobot.robotSprite.frameSize || 80);
            var robotPositionY = robotCellPosition[1];
            robotPositionY -= baseSpriteHeight;
            return robotPositionY;
            };

        // Define the dynamic function for collecting this robot's base Z position
        var robotPositionZ = function(){
            var robotPositionZ = 100;
            var battleRobot = battleTeamRobots[robotKey];
            var robotCell = battleRobot.robotPosition;
            var robotCellRow = parseInt(robotCell.charAt(1));
            robotPositionZ += robotCellRow * 10;
            return robotPositionZ;
            /*
            var battleRobot = battleTeamRobots[robotKey];
            var robotCell = battleRobot.robotPosition;
            var robotDirection = battleRobot.robotDirection;
            var robotCellPosition = getRobotCellPosition(robotCell, robotDirection);
            var baseSpriteHeight = battleRobot.robotSprite.frameHeight || (battleRobot.robotSprite.frameSize || 80);
            var robotPositionY = robotCellPosition[1];
            robotPositionY -= baseSpriteHeight;
            return robotPositionY;
            */
            };

        // Update the mug path for this robot based on direction
        var mugImagePath = 'images/robots/'+robotToken+'/mug_'+robotDirection+'_base.png';
        battleTeamRobots[robotKey].robotMug.filePath = mugImagePath;

        // Update the sprite path for this robot based on direction
        var spriteImagePath = 'images/robots/'+robotToken+'/sprite_'+robotDirection+'_zoom.png';
        battleTeamRobots[robotKey].robotSprite.filePath = spriteImagePath;

        // Update the base position values for this robot's sprites
        battleTeamRobots[robotKey].robotMug.basePosition = [0, 0, 1000];
        battleTeamRobots[robotKey].robotSprite.basePosition = [robotPositionX, robotPositionY, robotPositionZ];

        // Wait for the new background to load before updating the game sprite
        var spriteKey = battleTeam + '/robots/' + robotKey;
        resourceManager.loadFiles(robotImageURLs, function(){
            //console.log('\t '+battleTeam+' robot sprites are loaded for spriteKey "'+spriteKey+'"!', robotImageURLs);
            thisGame.gameSpriteIndex[spriteKey] = false;
            newBattleRobotSprite(battleTeam, robotKey, spriteKey);
            });



        // Create the status bar icon for this robot
        var statusSpriteKey = spriteKey + '/status';
        var robotStatusSprite = {
            filePath: 'images/robot-status_'+battleTeamRobots[robotKey].robotDirection+'.png',
            basePosition: [0, 0, 0],
            currentPosition: [0, 0, 0],
            //currentOpacity: robotToken == 'mega-man' ? 1 : 0.5,
            frameWidth: 26,
            frameHeight: 71,
            frameSpeed: 1,
            frameLayout: 'vertical',
            frameSequence: [0],
            frameAnimationSequence: [{
                // pan up
                startPosition: [0, 0],
                endPosition: [0, -5],
                frameDuration: 30
                }, {
                // pan down
                startPosition: [0, -5],
                endPosition: [0, 0],
                frameDuration: 30
                }]
            };
        var statusPositionMod = function(){
            var battleRobot = battleTeamRobots[robotKey];
            var positionMod = battleRobot.robotDirection == 'left' ? 1 : -1;
            return positionMod;
        }
        var statusPositionOffset = function(){
            var battleRobot = battleTeamRobots[robotKey];
            var positionMod = statusPositionMod();
            var overflowValue = battleRobot.robotSprite.frameSize - 80;
            var positionOffset = positionMod * Math.ceil(battleRobot.robotSprite.frameSize * 0.5);
            if (overflowValue > 0){
                positionOffset -= Math.ceil(overflowValue / 4) * positionMod;
                //positionOffset -= positionMod * Math.ceil(robotStatusSprite.frameWidth / 2);
            }
            return positionOffset;
        };
        var statusPositionX = function(){
            var battleRobot = battleTeamRobots[robotKey];
            var positionMod = statusPositionMod();
            var positionX = battleRobot.robotSprite.currentPosition[0] + statusPositionOffset();
            var overflowValue = battleRobot.robotSprite.frameSize - 80;
            positionX += robotStatusSprite.frameWidth;
            if (overflowValue > 0){
                positionX += Math.ceil(overflowValue / 2);
                positionX -= positionMod * Math.ceil(robotStatusSprite.frameWidth / 2);
            }
            //positionX -=
            return positionX;
        };
        var statusPositionY = function(){
            var battleRobot = battleTeamRobots[robotKey];
            var positionMod = statusPositionMod();
            var positionY = battleRobot.robotSprite.currentPosition[1] - 20;
            var overflowValue = battleRobot.robotSprite.frameSize - 80;
            if (overflowValue > 0){
                positionY += overflowValue;
            }
            return positionY;
        };
        var statusPositionZ = function(){
            var battleRobot = battleTeamRobots[robotKey];
            var positionZ = battleRobot.robotSprite.currentPosition[2] + 1;
            return positionZ;
        };
        robotStatusSprite.basePosition = [statusPositionX, statusPositionY, statusPositionZ];
        robotStatusSprite.globalFrameStart = thisGame.gameState.currentFrame;
        robotStatusSprite.currentFrameKey = 0;
        robotStatusSprite.spriteObject = newCanvasSprite(
            statusSpriteKey,
            robotStatusSprite.filePath,
            robotStatusSprite.frameWidth,
            robotStatusSprite.frameHeight,
            robotStatusSprite.frameLayout,
            robotStatusSprite.frameSpeed,
            robotStatusSprite.frameSequence
            );
        thisGame.gameSpriteIndex[statusSpriteKey] = robotStatusSprite;

    }

    // Define a function for generating and loading a robot sprite
    function newBattleRobotSprite(battleTeam, robotKey, robotSpriteKey){
        //console.log('canvasGameEngine.newBattleRobotSprite()', battleTeam, robotKey, spriteKey);

        // Create a pointer to the appropriate team
        if (battleTeam == 'player'){ var battleTeamRobots = thisGame.playerRobots; }
        else if (battleTeam == 'target'){ var battleTeamRobots = thisGame.targetRobots; }
        else { return false; }

        // Generate a new sprite for the field background
        var playerRobotSprite = battleTeamRobots[robotKey].robotSprite;
        playerRobotSprite.globalFrameStart = thisGame.gameState.currentFrame;
        playerRobotSprite.currentFrameKey = 0;
        playerRobotSprite.spriteObject = newCanvasSprite(
            robotSpriteKey,
            playerRobotSprite.filePath,
            playerRobotSprite.frameSize,
            playerRobotSprite.frameSize,
            playerRobotSprite.frameLayout,
            playerRobotSprite.frameSpeed,
            playerRobotSprite.frameSequence
            );

        // Add generated field sprite to the parent index
        thisGame.gameSpriteIndex[robotSpriteKey] = playerRobotSprite;

        // Refresh the sprite rendering order
        updateCanvasSpriteRenderOrder();

    }


    // -- FIELD FUNCTIONS -- //

    // Define a function for dynamically changing the battle field
    function changeBattleField(battleField){
        debug('canvasGameEngine.changeBattleField()', battleField);

        // Copy over the field name manually intro current
        thisGame.battleField.fieldName = battleField.fieldName;

        // Defer the background and foreground updates to dedicated functions
        changeBattleFieldBackground(battleField.fieldBackground);
        changeBattleFieldForeground(battleField.fieldForeground);

    }

    // Define a function for dynamically changing the battle field background
    function changeBattleFieldBackground(battleFieldBackground){
        debug('canvasGameEngine.changeBattleFieldBackground()', battleFieldBackground);

        // Clone the provided field background and copy into current
        var fieldBackground = cloneObject(battleFieldBackground);

        // Wait for the new background to load before updating the game sprite
        resourceManager.loadFile(fieldBackground.filePath, function(){
            loadFieldBackgroundSprite(fieldBackground);
            });

    }

    // Define a function for dynamically changing the battle field foreground
    function changeBattleFieldForeground(battleFieldForeground){
        debug('canvasGameEngine.changeBattleFieldForeground()', battleFieldForeground);

        // Clone the provided field foreground and copy into current
        var fieldForeground = cloneObject(battleFieldForeground);

        // Wait for the new forground to load before updating the game sprite
        resourceManager.loadFile(fieldForeground.filePath, function(){
            loadFieldForegroundSprite(fieldForeground);
            });

    }

    // Define a function for generating and loading field background sprite
    function loadFieldBackgroundSprite(fieldBackground){
        debug('canvasGameEngine.loadFieldBackgroundSprite()', fieldBackground);

        // Update the parent field object with the background change
        thisGame.battleField.fieldBackground = fieldBackground;

        // Generate a new sprite for the field background
        var spriteIndexKey = 'fieldBackground';
        fieldBackground.globalFrameStart = thisGame.gameState.currentFrame;
        fieldBackground.currentFrameKey = 0;
        fieldBackground.spriteObject = newCanvasSprite(
            spriteIndexKey,
            fieldBackground.filePath,
            thisGame.gameSettings.baseBackgroundWidth,
            thisGame.gameSettings.baseBackgroundHeight,
            fieldBackground.frameLayout,
            fieldBackground.frameSpeed,
            fieldBackground.frameSequence
            );

        // Add generated field sprite to the parent index
        thisGame.gameSpriteIndex[spriteIndexKey] = fieldBackground;

        // Refresh the sprite rendering order
        updateCanvasSpriteRenderOrder();

    }

    // Define a function for generating and loading field background sprite
    function loadFieldForegroundSprite(fieldForeground){
        debug('canvasGameEngine.loadFieldForegroundSprite()', fieldForeground);

        // Update the parent field object with the foreground change
        thisGame.battleField.fieldForeground = fieldForeground;

        // Generate a new sprite for the field foreground
        var spriteIndexKey = 'fieldForeground';
        fieldForeground.globalFrameStart = thisGame.gameState.currentFrame;
        fieldForeground.currentFrameKey = 0;
        fieldForeground.spriteObject = newCanvasSprite(
            spriteIndexKey,
            fieldForeground.filePath,
            thisGame.gameSettings.baseForegroundWidth,
            thisGame.gameSettings.baseForegroundHeight,
            fieldForeground.frameLayout,
            fieldForeground.frameSpeed,
            fieldForeground.frameSequence
            );

        // Add generated field sprite to the parent index
        thisGame.gameSpriteIndex[spriteIndexKey] = fieldForeground;

        // Refresh the sprite rendering order
        updateCanvasSpriteRenderOrder();

    }

    // Define a function for drawing the field background
    function newCanvasSprite(spriteKey, filePath, frameWidth, frameHeight, frameLayout, frameSpeed, frameSequence, frameSync){
        //console.log('canvasGameEngine.newCanvasSprite(filePath, frameWidth, frameHeight, frameLayout, frameSpeed, frameSequence)', filePath, frameWidth, frameHeight, frameLayout, frameSpeed, frameSequence);

        // Collect preloaded image from resource index
        var imageResource = resourceManager.getFile(filePath);
        //console.log('\t imageResource.url = ', imageResource.url);

        // Pull the image's actual width and height
        var imageWidth = imageResource.width;
        var imageHeight = imageResource.height;
        //console.log('\t imageWidth = ', imageWidth);
        //console.log('\t imageHeight = ', imageHeight);

        // Use frame layout to calculate total frames
        var frameCount = 1;
        if (frameLayout == 'vertical'){ frameCount = Math.ceil(imageHeight / frameHeight); }
        else if (frameLayout == 'horizontal'){ frameCount = Math.ceil(imageWidth / frameWidth); }
        //console.log('\t frameCount = ', frameCount);

        // Generate a sequential frame sequence using count
        if (typeof frameSequence === 'undefined' || frameSequence.length < 1){
            frameSequence = [];
            for (var i = 0; i < frameCount; i++){ frameSequence.push(i); }
            }

        // Define other frame variables needed for the sprite
        var framePosition = [0, 0];
        var frameSize = [frameWidth, frameHeight];

        // Return a new sprite object using above settings
        return new gameSprite(
            filePath,
            framePosition,
            frameWidth,
            frameHeight,
            frameSpeed,
            frameSequence,
            frameLayout,
            false,
            thisGame,
            spriteKey
            );

    }

    // Define a function for rendering all sprites in the index
    function drawCanvasSprites(){

        // First update the positions of all sprites
        updateCanvasSprites();

        // Next we can actually render them one by one
        renderCanvasSprites();

    }

    // Define a function for updating canvas sprite positions for current frame
    function updateCanvasSprites(){
        //console.log('canvasGameEngine.updateCanvasSprites()');

        // Collect a reference to the canvas
        var thisCanvas = thisGame.gameWindow.canvasContext;

        // Loop through all sprites in the global index and update position values
        for (var spriteKey in thisGame.gameSpriteIndex){
            //console.log('\t updating thisGame.gameSpriteIndex, spriteKey = ', spriteKey);

            if (typeof thisGame.gameSpriteIndex[spriteKey] === 'undefined'
                || thisGame.gameSpriteIndex[spriteKey] === false){
                continue;
            }

            var thisSprite = thisGame.gameSpriteIndex[spriteKey];
            //console.log('\t thisSprite = ', thisSprite);

            if (typeof thisSprite.currentPosition === 'undefined'
                && typeof thisSprite.basePosition !== 'undefined'){
                thisSprite.currentPosition = thisSprite.basePosition;
            }

            // If this sprite is not loaded, continue to next
            if (thisSprite === false){ continue; }

            // Collect a reference to this sprite object
            var thisSpriteObject = thisSprite.spriteObject;

            // Backup the base position before mods
            var backupBasePosition = [
                thisSprite.basePosition[0],
                thisSprite.basePosition[1],
                thisSprite.basePosition[2]
                ];

            // Backup the animation steps before mods
            var backupAnimationSteps = [];
            if (typeof thisSprite.frameAnimationSequence !== 'undefined'
                && thisSprite.frameAnimationSequence.length > 0){
                for (i in thisSprite.frameAnimationSequence){
                    backupAnimationSteps.push(thisSprite.frameAnimationSequence[i]);
                    }

                }

            // If aligning with a target, copy its base position values
            if (typeof thisSprite.alignWithTarget !== 'undefined'){
                if (typeof thisGame.gameSpriteIndex[thisSprite.alignWithTarget] != 'undefined'){

                    var targetSprite = thisGame.gameSpriteIndex[thisSprite.alignWithTarget];

                    if (typeof targetSprite.basePosition !== 'undefined'){
                        thisSprite.basePosition[0] = targetSprite.basePosition[0];
                        thisSprite.basePosition[1] = targetSprite.basePosition[1];
                        thisSprite.basePosition[2] = targetSprite.basePosition[2];
                        }

                    }
                }

            // If animating with a target, copy each of its animation steps
            if (typeof thisSprite.animateWithTarget !== 'undefined'){
                if (typeof thisGame.gameSpriteIndex[thisSprite.animateWithTarget] != 'undefined'){

                    var targetSprite = thisGame.gameSpriteIndex[thisSprite.animateWithTarget];

                    if (typeof targetSprite.frameAnimationSequence !== 'undefined'
                        && targetSprite.frameAnimationSequence.length > 0){
                        thisSprite.globalFrameStart = targetSprite.globalFrameStart;
                        thisSprite.frameAnimationSequence = [];
                        for (i in targetSprite.frameAnimationSequence){
                            thisSprite.frameAnimationSequence.push(targetSprite.frameAnimationSequence[i]);
                            }
                        } else {
                        thisSprite.frameAnimationSequence = [];
                        }

                    }
                }

            // Collect the sprite's position given all mods
            var spritePosition = gameSprite.getSpritePosition(thisGame.gameState.currentFrame, thisSprite);
            //console.log('updateCanvasSprites = spritePosition = ', spritePosition);

            // Update this robot's current position variables with calculated values
            thisSprite.currentPosition = [spritePosition[0], spritePosition[1], spritePosition[2]];

            // Restore the sprite's base position back to normal
            thisSprite.basePosition = backupBasePosition;

            // Restore the sprite's animation steps back to normal
            thisSprite.frameAnimationSequence = [];
            if (backupAnimationSteps.length > 0){
                for (i in backupAnimationSteps){
                    thisSprite.frameAnimationSequence.push(backupAnimationSteps[i]);
                    }
                }


            }

    }

    // Define a function for updating the canvas sprite rendering order manually
    function updateCanvasSpriteRenderOrder(){
        //console.log('canvasGameEngine.updateCanvasSpriteRenderOrder()');

        // Always update sprites before re-ordering
        updateCanvasSprites();

        //console.log('\t thisGame.gameSpriteIndex = ', thisGame.gameSpriteIndex);

        var orderDebug = {};

        // Collect the keys of all non-empty sprites for rendering order
        thisGame.gameSpriteRenderOrder = [];
        for (var spriteKey in thisGame.gameSpriteIndex){
            var thisSprite = thisGame.gameSpriteIndex[spriteKey];
            if (typeof thisSprite !== 'undefined' && thisSprite !== false){
                thisGame.gameSpriteRenderOrder.push(spriteKey);

                orderDebug[spriteKey+'/'+thisSprite.filePath] = thisSprite.currentPosition;

            }
        }

        //console.log('\t orderDebug = ', orderDebug);

        // Recalculate and update the global draw order based on each sprite's Z-index value
        //console.log('\t thisGame.gameSpriteRenderOrder(before) = ', thisGame.gameSpriteRenderOrder);
        thisGame.gameSpriteRenderOrder.sort(function(spriteKeyA, spriteKeyB){
            var spriteA = thisGame.gameSpriteIndex[spriteKeyA];
            var spriteB = thisGame.gameSpriteIndex[spriteKeyB];
            //console.log('spriteA.currentPosition[2] = ('+spriteA.currentPosition[2]+') vs spriteB.currentPosition[2] = ('+spriteB.currentPosition[2]+')');
            if (spriteA.currentPosition[2] < spriteB.currentPosition[2]){ return -1; }
            else if (spriteA.currentPosition[2] > spriteB.currentPosition[2]){ return 1; }
            else { return 0; }
            });
        //console.log('\t thisGame.gameSpriteRenderOrder(after) = ', thisGame.gameSpriteRenderOrder);

    }

    // Define a function for rendering canvas sprites based on calculated positions
    function renderCanvasSprites(){
        //console.log('canvasGameEngine.renderCanvasSprites()');

        // Collect a reference to the canvas
        var thisCanvas = thisGame.gameWindow.canvasContext;

        //for (var spriteKey in thisGame.gameSpriteIndex){
        for (var orderKey in thisGame.gameSpriteRenderOrder){
            var spriteKey = thisGame.gameSpriteRenderOrder[orderKey];
            //console.log('\t rendering thisGame.gameSpriteIndex | orderKey = '+orderKey+' & spriteKey = '+spriteKey);

            //if (spriteKey == 'fieldBackground' || spriteKey == 'fieldForeground'){ continue; }


            if (typeof thisGame.gameSpriteIndex[spriteKey] === 'undefined'
                || thisGame.gameSpriteIndex[spriteKey] === false){
                continue;
            }

            var thisSprite = thisGame.gameSpriteIndex[spriteKey];

            //console.log('\t thisSprite = ', thisSprite);

            // If this sprite is not loaded, continue to next
            if (thisSprite === false){ continue; }

            // Collect a reference to this sprite object
            var thisSpriteObject = thisSprite.spriteObject;

            // Collect the sprite's position given all mods
            var spritePosition = thisSprite.currentPosition;

            //console.log('\t spritePosition = ', spritePosition);

            // Shift the canvas into position, draw the sprite, and then move the canvas back
            thisCanvas.translate(spritePosition[0], spritePosition[1]);
            thisSpriteObject.update(thisGame.gameState.lastLoopDiff);
            thisSpriteObject.render(thisCanvas);
            thisCanvas.translate(-spritePosition[0], -spritePosition[1]);

            }

    }

    // Define a function for drawing the frame counter
    function drawFrameCounter(){
        debug('canvasGameEngine.drawFrameCounter()');

        // Collect a reference to the canvas
        var thisCanvas = thisGame.gameWindow.canvasContext;

        if (thisGame.gameSettings.showDebug === false){ return false; }

        var centerX = Math.ceil(thisGame.gameState.canvasWidth / 2);
        var offsetY = 10;
        var boxWidth = 30;
        var boxHeight = 20;
        var boxPadding = 4;

        // draw panel
        var panelPosX = centerX - Math.ceil(boxWidth / 2);
        var panelPosY = offsetY;
        thisCanvas.fillStyle = '#191919';
        thisCanvas.fillRect(panelPosX, panelPosY, boxWidth, boxHeight);

        // draw text
        var textPosX = centerX;
        var textPosY = offsetY + boxPadding;
        var textSize = boxHeight - (boxPadding * 2);
        thisCanvas.font = textSize+'px Arial';
        thisCanvas.fillStyle = 'white';
        thisCanvas.textAlign = 'center';
        thisCanvas.textBaseline = 'top';
        thisCanvas.fillText(thisGame.gameState.loopCounter, textPosX, textPosY, boxWidth);

    }

    // Define a function to run on canvas when game window resized
    function resizeGameCanvas(){
        debug('canvasGameEngine.resizeGameCanvas()');

        thisGame.gameSettings.pauseGameLoop = true;
        //debug('\t thisGame.gameSettings.pauseGameLoop = ' + thisGame.gameSettings.pauseGameLoop);

        // Clear the resize timeout if already exists
        if (typeof resizeGameCanvas.resizeCanvasTimeout != 'undefined'){
            clearTimeout(resizeGameCanvas.resizeCanvasTimeout);
            }

        // Start the resize timeout before resuming the loop
        resizeGameCanvas.resizeCanvasTimeout = setTimeout(function(){
            thisGame.gameSettings.pauseGameLoop = false;
            thisGame.gameState.canvasWidth = thisGame.gameWindow.canvasObject.width;
            thisGame.gameState.canvasHeight = thisGame.gameWindow.canvasObject.height;
            thisGame.gameState.canvasMiddleX = Math.ceil(thisGame.gameState.canvasWidth / 2);
            thisGame.gameState.canvasMiddleY = Math.ceil(thisGame.gameState.canvasHeight / 2);
            mainGameLoop();
            }, 500);

        renderGameCanvas();

    }

    // Define a function for calculating current position of a robot cell
    function getRobotCellPosition(cellKey, robotDirection){
        debug('canvasGameEngine.getRobotCellPosition(cellKey)', cellKey);

        if (typeof robotDirection === 'undefined'){ robotDirection = 'right'; }

        // Define the common Y positions for each row

        var pos1Y = 144;  // y + 0
        var pos2Y = 171;  // y + 27
        var pos3Y = 202;  // y + 31

        /*

        var pos1Y = 134;  // y + 0
        var pos2Y = 167;  // y + 33
        var pos3Y = 200;  // y + 33

        */

        // Define the base positions for all cells on the battlefield
        var positionMap = {};

        var baseC = 65;
        positionMap['A1'] = [(baseC + 0), pos1Y];
        positionMap['A2'] = [(baseC + 5), pos2Y];
        positionMap['A3'] = [(baseC + 10), pos3Y];

        var baseB = 195;
        positionMap['B1'] = [(baseB + 0), pos1Y];
        positionMap['B2'] = [(baseB + 15), pos2Y];
        positionMap['B3'] = [(baseB + 30), pos3Y];

        var baseA = 320;
        positionMap['C1'] = [(baseA + 0), pos1Y];
        positionMap['C2'] = [(baseA + 30), pos2Y];
        positionMap['C3'] = [(baseA + 60), pos3Y];

        /*

        positionMap['A1'] = [320, pos1Y]; // x + 0
        positionMap['A2'] = [360, pos2Y]; // x + 40
        positionMap['A3'] = [400, pos3Y]; // x + 40

        positionMap['B1'] = [195, pos1Y]; // x + 0
        positionMap['B2'] = [215, pos2Y]; // x + 20
        positionMap['B3'] = [235, pos3Y]; // x + 20

        positionMap['C1'] = [65, pos1Y];  // x + 0
        positionMap['C2'] = [75, pos2Y];  // x + 10
        positionMap['C3'] = [85, pos3Y];  // x + 10
        */

        // Collect the current robot position based on cell key
        var robotCellPosition = positionMap[cellKey];

        //console.log('\t robotCellPosition = ', robotCellPosition);

        // Adjust the base Y position if this field has a panel offset defined
        if (typeof thisGame.battleField.fieldForeground.panelOffsetY !== 'undefined'){
            robotCellPosition[1] += thisGame.battleField.fieldForeground.panelOffsetY;
            }

        //console.log('thisGame.battleField.fieldForeground = ', thisGame.battleField.fieldForeground);
        //console.log('thisGame.gameSpriteIndex = ', thisGame.gameSpriteIndex);

        var battleFieldForeground = thisGame.battleField.fieldForeground;
        var battleFieldForegroundSprite = thisGame.gameSpriteIndex['fieldForeground'];
        //console.log('\t battleFieldForeground = ', JSON.stringify(battleFieldForeground));
        //console.log('\t battleFieldForegroundSprite = ', battleFieldForegroundSprite);

        // If the battlefield itself has moved at all, we should adjust the cell too
        if (typeof battleFieldForegroundSprite !== 'undefined'
            && typeof battleFieldForegroundSprite.currentPosition !== 'undefined'){
            //console.log('\t battleFieldForegroundSprite exists and has position...');

            if ((battleFieldForegroundSprite.currentPosition[0] != battleFieldForegroundSprite.basePosition[0])
                || (battleFieldForegroundSprite.currentPosition[1] != battleFieldForegroundSprite.basePosition[1])
                || (battleFieldForegroundSprite.currentPosition[2] != battleFieldForegroundSprite.basePosition[2])){
                //console.log('\t adjust robot cell by battle field position change...');

                // Collect the X and Y position difference from base value
                var foregroundDiffX = battleFieldForegroundSprite.currentPosition[0] - battleFieldForegroundSprite.basePosition[0];
                var foregroundDiffY = battleFieldForegroundSprite.currentPosition[1] - battleFieldForegroundSprite.basePosition[1];
                var foregroundDiffZ = battleFieldForegroundSprite.currentPosition[2] - battleFieldForegroundSprite.basePosition[2];
                //console.log('\t foregroundDiffX = ', foregroundDiffX);
                //console.log('\t foregroundDiffY = ', foregroundDiffY);
                //console.log('\t foregroundDiffZ = ', foregroundDiffZ);

                // Apply these X and Y mods to the cell position itself
                //console.log('\t robotCellPosition[0](before) = ', robotCellPosition[0]);
                //console.log('\t robotCellPosition[1](before) = ', robotCellPosition[1]);
                //console.log('\t robotCellPosition[2](before) = ', robotCellPosition[2]);
                if (robotDirection === 'left'){ robotCellPosition[0] += foregroundDiffX; }
                else if (robotDirection === 'right'){ robotCellPosition[0] -= foregroundDiffX; }
                robotCellPosition[1] += foregroundDiffY;
                robotCellPosition[2] += foregroundDiffZ;
                //console.log('\t robotCellPosition[0](after) = ', robotCellPosition[0]);
                //console.log('\t robotCellPosition[1](after) = ', robotCellPosition[1]);
                //console.log('\t robotCellPosition[2](after) = ', robotCellPosition[2]);

                }
            }

        // Return the calculated robot cell position
        return robotCellPosition;

    }


    // -- MISC DEBUG FUNCTIONS -- //

    // Define a method for decreasing the global game speed
    canvasGameEngine.prototype.resetGameSpeed = function(){
        //console.log('canvasGameEngine.resetGameSpeed()');

        thisGame.gameSettings.baseGameSpeed = 1.0;

        //console.log('\t thisGame.gameSettings.baseGameSpeed = ', thisGame.gameSettings.baseGameSpeed);

    }

    // Define a method for decreasing the global game speed
    canvasGameEngine.prototype.setGameSpeed = function(amount){
        //console.log('canvasGameEngine.setGameSpeed(amount)', amount);

        if (typeof amount !== 'numeric'){ amount = 1.0; }
        else { amount = parseFloat(amount); }

        thisGame.gameSettings.baseGameSpeed = (Math.round((amount) * 10)) / 10;
        if (thisGame.gameSettings.baseGameSpeed <= 0){ thisGame.gameSettings.baseGameSpeed = 0.1; }
        else if (thisGame.gameSettings.baseGameSpeed >= 2){ thisGame.gameSettings.baseGameSpeed = 2.0; }

        //console.log('\t thisGame.gameSettings.baseGameSpeed = ', thisGame.gameSettings.baseGameSpeed);

    }

    // Define a method for decreasing the global game speed
    canvasGameEngine.prototype.makeGameSlower = function(amount){
        //console.log('canvasGameEngine.makeGameSlower(amount)', amount);

        if (typeof amount !== 'numeric'){ amount = 0.1; }
        else { amount = parseFloat(amount); }

        thisGame.gameSettings.baseGameSpeed = (Math.round((thisGame.gameSettings.baseGameSpeed + amount) * 10)) / 10;
        if (thisGame.gameSettings.baseGameSpeed >= 2){ thisGame.gameSettings.baseGameSpeed = 2.0; }

        //console.log('\t thisGame.gameSettings.baseGameSpeed = ', thisGame.gameSettings.baseGameSpeed);

    }

    // Define a method for increasing the global game speed
    canvasGameEngine.prototype.makeGameFaster = function(amount){
        //console.log('canvasGameEngine.makeGameFaster(amount)', amount);

        if (typeof amount !== 'numeric'){ amount = 0.1; }
        else { amount = parseFloat(amount); }

        thisGame.gameSettings.baseGameSpeed = (Math.round((thisGame.gameSettings.baseGameSpeed - amount) * 10)) / 10;
        if (thisGame.gameSettings.baseGameSpeed <= 0){ thisGame.gameSettings.baseGameSpeed = 0.1; }

        //console.log('\t thisGame.gameSettings.baseGameSpeed = ', thisGame.gameSettings.baseGameSpeed);

    }


    // -- UTILITY FUNCTIONS -- //

    // Utility method to extend defaults with user options
    function extendSettings(source, properties){
        debug('canvasGameEngine.extendSettings(source, properties)', source, properties);

        var newSource = cloneObject(source);
        var property;
        for (property in properties){
            if (properties.hasOwnProperty(property)){
                newSource[property] = properties[property];
                }
            }

        return newSource;

    }

    // Utility function for cloning a setting to prevent reference
    function cloneObject(sourceObject){
        return JSON.parse(JSON.stringify(sourceObject));
    }

    // Utility method for printing console debug info
    function debug(){
        if (typeof thisGame != 'undefined'
            && thisGame.gameSettings.showDebug === true){
            arguments[0] = thisGame.gameState.loopCounter + ' // ' + arguments[0];
            console.log.apply(this, arguments);
            }
    }

    // Define a toggle function for showing the game debug
    function showDebug(){
        debug('canvasGameEngine.showDebug()');
        thisGame.gameSettings.showDebug = true;
        return;
    }

    // Define a toggle function for hiding the game debug
    function hideDebug(){
        debug('canvasGameEngine.hideDebug()');
        thisGame.gameSettings.showDebug = false;
        return;
    }


}(jQuery));