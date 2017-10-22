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

    // Script Variables
    var gameScripts = [
        'indexes/battleFieldIndex.js',
        'indexes/battleRobotIndex.js',
        'classes/canvasGameSprite.js',
        'modules/canvasGameSpeed.js',
        'modules/canvasBattleField.js'
        ];

    // Script Index Variables
    var gameScriptIndexes = [
        'objects/index.js.php?type=fields',
        'objects/index.js.php?type=robots'
        ];

    // Settings Variables
    var gameSettings = {
        baseHref: 'http://canvas.game.test/',
        baseCorePath: 'canvasGame/',
        baseCustomPath: 'customGame/',
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
        gameSettings.baseCorePath + 'images/logo-large.png',
        gameSettings.baseCorePath + 'images/logo-small.png',
        gameSettings.baseCorePath + 'images/robot-status_left.png',
        gameSettings.baseCorePath + 'images/robot-status_right.png',
        gameSettings.baseCorePath + 'images/operator-status_left.png',
        gameSettings.baseCorePath + 'images/operator-status_right.png'
        ];

    // Sprite Variables
    var gameSpriteIndex = {};
    var gameSpriteRenderOrder = [];

    // Battle Variables
    var battleRobots = {};


    // -- PUBLIC METHODS -- //

    // Define our canvas game constructor
    var thisGame;
    this.canvasGameEngine = function(){
        //console.log('new canvasGameEngine()');

        // Set variable pointers
        thisGame = this;
        window.thisCanvasGame = thisGame;

        thisGame.gameWindow = gameWindow;

        thisGame.gameScripts = gameScripts;
        thisGame.gameScriptIndexes = gameScriptIndexes;

        thisGame.gameSettings = gameSettings;
        thisGame.gameState = gameState;

        thisGame.gameImages = gameImages;

        thisGame.gameSpriteIndex = gameSpriteIndex;
        thisGame.gameSpriteRenderOrder = gameSpriteRenderOrder;

        thisGame.battleRobots = battleRobots;

        // Define game settings defaults
        var defaultSettings = gameSettings;

        // Create settings by extending defaults with the passed in arugments
        var customSettings = arguments[0] && typeof arguments[0] === "object" ? arguments[0] : {};
        thisGame.gameSettings = extendGameSettings(defaultSettings, customSettings);

        // Initialize the game engine with callback if provided
        var readyCallback = typeof arguments[1] === 'function' ? arguments[1] : function(){};
        loadEngine(readyCallback);

    }

    // Define our init object to setting things up
    canvasGameEngine.prototype.startGame = function(startCallback){
        debug('canvasGameEngine.startGame()', startCallback);

        // If the field has not been set, fallback to detail
        if (typeof thisGame.battleField.fieldName === 'undefined'
            || typeof thisGame.battleField.fieldBackground === 'undefined'
            || typeof thisGame.battleField.fieldForeground === 'undefined'){
            if (typeof thisGame.gameSettings.baseFieldToken !== 'undefined'){
                var baseBattleField = thisGame.gameSettings.baseFieldToken;
                thisGame.setField(baseBattleField);
                } else {
                thisGame.setField('default');
                }
            }

        // If the base robots have been defined, loop through and add them
        if (typeof thisGame.gameSettings.baseBattleRobots !== 'undefined'){
            var baseBattleRobots = thisGame.gameSettings.baseBattleRobots;
            var battleTeamKey = 0;
            for (var battleTeam in baseBattleRobots){
                var battleTeamRobots = baseBattleRobots[battleTeam];
                var battleTeamSide = battleTeamKey === 0 ? 'left' : 'right';
                for (var robotKey in battleTeamRobots){
                    var robotToken = battleTeamRobots[robotKey][0];
                    var robotPosition = battleTeamRobots[robotKey][1];
                    thisGame.loadBattleRobot(battleTeam, robotKey, robotToken, robotPosition, battleTeamSide);
                    }
                battleTeamKey++;
                }
            }

        // Now we can load required image files then start the game when complete
        resourceIndex.loadFiles(thisGame.gameImages, function(){
            //console.log('resourceIndex.loadFiles() complete!', thisGame.gameImages);

            // Load all the canvas sprites
            loadCanvasSprites();

            // Start the game
            //console.log('STARTING GAME!!!');
            startGame(startCallback);

            });

    }

    // Define a function for loading a new robot into the battle
    canvasGameEngine.prototype.loadBattleRobot = function(robotTeam, robotKey, robotToken, robotPosition, robotSide){
        //console.log('canvasGameEngine.loadBattleRobot()', robotTeam, robotKey, robotToken, robotPosition, robotSide);

        // Return false if any key arguments are missing
        if (typeof robotTeam === 'undefined' || robotTeam === false){ return false; }
        if (typeof robotKey === 'undefined' || robotKey === false){ return false; }
        if (typeof robotToken === 'undefined' || robotToken === false){ return false; }
        if (typeof robotPosition === 'undefined' || robotPosition === false){ return false; }
        if (typeof robotSide === 'undefined' || robotSide === false){ return false; }

        // Collect data for the requested field from the index
        var battleRobot = battleRobotIndex.getRobot(robotToken);
        //console.log('\t battleRobot = ', battleRobot);
        if (battleRobot === false){ return false; }

        // Set the robot key and position based on arguments
        battleRobot.robotKey = robotKey;
        battleRobot.robotPosition = robotPosition;
        battleRobot.robotSide = robotSide;
        battleRobot.robotDirection = robotSide !== 'left' ? 'left' : 'right';

        // Insert this new robot data into the player team array
        newBattleRobot(robotTeam, battleRobot);

    }

    // Define a function for listing all cell names on the battlefield
    canvasGameEngine.prototype.getCellNames = function(){
        //console.log('canvasGameEngine.getCellNames()');
        return [
            'A1', 'A2', 'A3',
            'B1', 'B2', 'B3',
            'C1', 'C2', 'C3'
            ];
    }

    // Define a function for finding empty cells on one side of the battle field
    canvasGameEngine.prototype.findEmptyCells = function(battleTeam){
        //console.log('canvasGameEngine.findEmptyCells()');

        if (typeof thisGame.battleRobots[battleTeam] === 'undefined'){ return false; }

        // Collect all the cell names on this side of the field
        var allCells = thisGame.getCellNames();
        //console.log('\t allCells = ', allCells);

        // Loop through requested team's robots and collect occupied cells
        var occupiedCells = [];
        for (var robotKey in thisGame.battleRobots[battleTeam]){
            var battleRobot = thisGame.battleRobots[battleTeam][robotKey];
            occupiedCells.push(battleRobot.robotPosition);
        }
        //console.log('\t occupiedCells = ', occupiedCells);

        // Compare the two lists to find cells that are currently empty
        var emptyCells = [];
        for (var i = 0; i < allCells.length; i++){
            var thisCell = allCells[i];
            if (occupiedCells.indexOf(thisCell) === -1){
                emptyCells.push(thisCell);
                }
            }
        //console.log('\t emptyCells = ', emptyCells);

        // Return the array of empty cells
        return emptyCells;

    }

    // Define a function for finding the first empty cell on one side of the battle field
    canvasGameEngine.prototype.findFirstEmptyCell = function(battleTeam){
        //console.log('canvasGameEngine.findEmptyCells()');
        if (typeof thisGame.battleRobots[battleTeam] === 'undefined'){ return false; }
        var emptyCells = thisGame.findEmptyCells(battleTeam);
        if (emptyCells !== false && emptyCells.length > 0){ return emptyCells[0]; }
        else { return false; }
    }


    // -- INIT FUNCTIONS -- //

    // Define a function for loading our game
    function loadEngine(readyCallback){
        //console.log('canvasGameEngine.loadEngine()');

        // Define object references to HTML elements
        thisGame.gameWindow.rootDiv = $(thisGame.gameSettings.htmlClass);
        thisGame.gameWindow.canvasDiv = $(thisGame.gameSettings.htmlCanvasClass, thisGame.gameWindow.rootDiv);
        thisGame.gameWindow.consoleDiv = $(thisGame.gameSettings.htmlConsoleClass, thisGame.gameWindow.rootDiv);
        thisGame.gameWindow.buttonsDiv = $(thisGame.gameSettings.htmlButtonsClass, thisGame.gameWindow.rootDiv);

        // Update the resource manager's config
        resourceIndex.setup({
            parentElement: thisGame.gameWindow.rootDiv,
            baseHref: thisGame.gameSettings.baseHref
            });

        // Generate a list of full script URLs to load first
        var gameScriptURLs = [];
        var gameScriptBase = thisGame.gameSettings.baseHref + thisGame.gameSettings.baseCorePath;
        for (var i in thisGame.gameScripts){
            var thisScript = thisGame.gameScripts[i];
            var thisScriptURL = gameScriptBase + thisScript;
            gameScriptURLs.push(thisScriptURL);
            }

        // Load all required game scripts before proceeding
        //console.log('\t loading thisGame.gameScripts = ', thisGame.gameScripts);
        resourceIndex.loadScriptFiles(gameScriptURLs, function(){
            //console.log('\t gameScriptURLs has finished loading! ', gameScriptURLs);

            // Generate a list of full index URLs to load next
            var scriptIndexURLs = [];
            var scriptIndexBase = thisGame.gameSettings.baseHref + thisGame.gameSettings.baseCorePath;
            for (var i in thisGame.gameScriptIndexes){
                var thisScript = thisGame.gameScriptIndexes[i];
                var thisScriptURL = scriptIndexBase + thisScript;
                scriptIndexURLs.push(thisScriptURL);
                }

            // Now load all the game object indexes into memory before finish
            //console.log('\t loading thisGame.gameScriptIndexes = ', thisGame.gameScriptIndexes);
            resourceIndex.loadScriptFiles(scriptIndexURLs, function(){
                //console.log('\t scriptIndexURLs has finished loading! ', scriptIndexURLs);

                // If the readyCallback was set, execute it
                readyCallback(thisGame);

                }, false);

            }, false);

    }

    // Define a function for intializing the actual game engine
    function startGame(startCallback){
        debug('canvasGameEngine.startGame()');

        initGameLoop();
        initGameCanvas();
        mainGameLoop();

        if (typeof startCallback === 'function'){
            startCallback();
        }

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

            requestAnimationFrame(mainGameLoop);

        } else {

            //console.log('\t don\'t render!');

            requestAnimationFrame(mainGameLoop);

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

        // Load the field sprites into the canvas
        thisGame.loadFieldSprites();


        // TEST OPERATOR SPRITES //

        var statusBarLeft = thisGame.gameSettings.baseCorePath + 'images/operator-status_left.png';
        resourceIndex.loadFile(statusBarLeft, function(){

            var positionX = 4;
            var positionY = 4;

            var energySpriteKey = 'thisTeam/operators/energy';
            var operatorEnergySprite = {
                filePath: statusBarLeft,
                basePosition: [positionX, positionY, 2000],
                currentPosition: [positionX, positionY, 2000],
                frameWidth: 150,
                frameHeight: 50,
                frameSpeed: 1,
                frameLayout: 'vertical',
                frameDirection: 'right',
                frameSequence: [0],
                frameAnimationSequence: [],
                frameSync: false
                };
            operatorEnergySprite.globalFrameStart = thisGame.gameState.currentFrame;
            operatorEnergySprite.currentFrameKey = 0;
            operatorEnergySprite.spriteObject = thisGame.newCanvasSprite(
                energySpriteKey,
                operatorEnergySprite.filePath,
                operatorEnergySprite.frameWidth,
                operatorEnergySprite.frameHeight,
                operatorEnergySprite.frameLayout,
                operatorEnergySprite.frameSpeed,
                operatorEnergySprite.frameSequence,
                operatorEnergySprite.frameSync
                );
            thisGame.gameSpriteIndex[energySpriteKey] = operatorEnergySprite;
            updateCanvasSpriteRenderOrder();

            });

        var statusBarRight = thisGame.gameSettings.baseCorePath + 'images/operator-status_right.png';
        resourceIndex.loadFile(statusBarRight, function(){

            var positionX = thisGame.gameState.canvasWidth - 150 - 4;
            var positionY = 4;

            var energySpriteKey = 'targetTeam/operators/energy';
            var operatorEnergySprite = {
                filePath: statusBarRight,
                basePosition: [positionX, positionY, 2000],
                currentPosition: [positionX, positionY, 2000],
                frameWidth: 150,
                frameHeight: 50,
                frameSpeed: 1,
                frameLayout: 'vertical',
                frameDirection: 'left',
                frameSequence: [0],
                frameAnimationSequence: [],
                frameSync: false
                };
            operatorEnergySprite.globalFrameStart = thisGame.gameState.currentFrame;
            operatorEnergySprite.currentFrameKey = 0;
            operatorEnergySprite.spriteObject = thisGame.newCanvasSprite(
                energySpriteKey,
                operatorEnergySprite.filePath,
                operatorEnergySprite.frameWidth,
                operatorEnergySprite.frameHeight,
                operatorEnergySprite.frameLayout,
                operatorEnergySprite.frameSpeed,
                operatorEnergySprite.frameSequence,
                operatorEnergySprite.frameSync
                );
            thisGame.gameSpriteIndex[energySpriteKey] = operatorEnergySprite;
            updateCanvasSpriteRenderOrder();

            });

    }


    // -- ROBOT FUNCTIONS -- //

    // Define a function for inserting a new robot into the player's team
    function newBattleRobot(battleTeam, battleRobot){
        //console.log('canvasGameEngine.newBattleRobot()', battleTeam, battleRobot);

        // Define a pointer to the appropriate team if exists, else create it
        if (typeof thisGame.battleRobots[battleTeam] === 'undefined'){ thisGame.battleRobots[battleTeam] = []; }
        var battleTeamRobots = thisGame.battleRobots[battleTeam];

        // Clone the provided robot data and assign to player
        var robotKey = battleRobot.robotKey;
        var robotToken = battleRobot.robotToken;
        var robotDirection = battleRobot.robotDirection;
        battleTeamRobots[robotKey] = cloneGameObject(battleRobot);

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
                    var imageURL = battleRobot.objectPath + imageKind + '_' + imageDirection + '_' + imageSize + '.png';
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
        var mugImagePath = battleRobot.objectPath + 'mug_'+robotDirection+'_base.png';
        battleTeamRobots[robotKey].robotMug.filePath = mugImagePath;

        // Update the sprite path for this robot based on direction
        var spriteImagePath = battleRobot.objectPath + 'sprite_'+robotDirection+'_zoom.png';
        battleTeamRobots[robotKey].robotSprite.filePath = spriteImagePath;

        // Update the base position values for this robot's sprites
        battleTeamRobots[robotKey].robotMug.basePosition = [0, 0, 1000];
        battleTeamRobots[robotKey].robotSprite.basePosition = [robotPositionX, robotPositionY, robotPositionZ];

        // Wait for the new background to load before updating the game sprite
        var robotSpriteKey = battleTeam + '/robots/' + robotKey;
        resourceIndex.loadFiles(robotImageURLs, function(){
            //console.log('\t '+battleTeam+' robot sprites are loaded for robotSpriteKey "'+robotSpriteKey+'"!', robotImageURLs);
            //thisGame.gameSpriteIndex[robotSpriteKey] = false;
            newBattleRobotSprite(battleTeam, robotKey, robotSpriteKey);
            newBattleRobotEnergySprite(battleTeam, robotKey, robotSpriteKey);
            });

    }

    // Define a function for generating and loading a robot sprite
    function newBattleRobotSprite(battleTeam, robotKey, robotSpriteKey){
        //console.log('canvasGameEngine.newBattleRobotSprite()', battleTeam, robotKey, robotSpriteKey);

        // Define a pointer to the appropriate team if exists, else create it
        if (typeof thisGame.battleRobots[battleTeam] === 'undefined'){ thisGame.battleRobots[battleTeam] = []; }
        var battleTeamRobots = thisGame.battleRobots[battleTeam];

        // Generate a new sprite for the field background
        var playerRobotSprite = battleTeamRobots[robotKey].robotSprite;
        playerRobotSprite.globalFrameStart = thisGame.gameState.currentFrame;
        playerRobotSprite.currentFrameKey = 0;
        playerRobotSprite.spriteObject = thisGame.newCanvasSprite(
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

    // Define a function for generating and loading a robot energy sprite
    function newBattleRobotEnergySprite(battleTeam, robotKey, robotSpriteKey){
        //console.log('canvasGameEngine.newBattleRobotEnergySprite()', battleTeam, robotKey, robotSpriteKey);

        // Define a pointer to the appropriate team if exists, else create it
        if (typeof thisGame.battleRobots[battleTeam] === 'undefined'){ thisGame.battleRobots[battleTeam] = []; }
        var battleTeamRobots = thisGame.battleRobots[battleTeam];

        // Create the status bar icon for this robot
        var energySpriteKey = robotSpriteKey + '/energy';
        var robotEnergySprite = {
            filePath: thisGame.gameSettings.baseCorePath + 'images/robot-status_'+battleTeamRobots[robotKey].robotDirection+'.png',
            basePosition: [0, 0, 0],
            currentPosition: [0, 0, 0],
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
                //positionOffset -= positionMod * Math.ceil(robotEnergySprite.frameWidth / 2);
            }
            return positionOffset;
        };
        var statusPositionX = function(){
            var battleRobot = battleTeamRobots[robotKey];
            var positionMod = statusPositionMod();
            var positionX = battleRobot.robotSprite.currentPosition[0] + statusPositionOffset();
            var overflowValue = battleRobot.robotSprite.frameSize - 80;
            positionX += robotEnergySprite.frameWidth;
            if (overflowValue > 0){
                positionX += Math.ceil(overflowValue / 2);
                positionX -= positionMod * Math.ceil(robotEnergySprite.frameWidth / 2);
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
        robotEnergySprite.basePosition = [statusPositionX, statusPositionY, statusPositionZ];
        robotEnergySprite.globalFrameStart = thisGame.gameState.currentFrame;
        robotEnergySprite.currentFrameKey = 0;
        robotEnergySprite.spriteObject = thisGame.newCanvasSprite(
            energySpriteKey,
            robotEnergySprite.filePath,
            robotEnergySprite.frameWidth,
            robotEnergySprite.frameHeight,
            robotEnergySprite.frameLayout,
            robotEnergySprite.frameSpeed,
            robotEnergySprite.frameSequence
            );
        thisGame.gameSpriteIndex[energySpriteKey] = robotEnergySprite;
        updateCanvasSpriteRenderOrder()

    }

    // Define a function for drawing the field background
    function newCanvasSprite(spriteKey, filePath, frameWidth, frameHeight, frameLayout, frameSpeed, frameSequence, frameSync){
        //console.log('canvasGameEngine.newCanvasSprite(filePath, frameWidth, frameHeight, frameLayout, frameSpeed, frameSequence)', filePath, frameWidth, frameHeight, frameLayout, frameSpeed, frameSequence);

        // Collect preloaded image from resource index
        var imageResource = resourceIndex.getFile(filePath);
        //console.log('\t imageResource = ', imageResource);
        //console.log('\t imageResource.src = ', imageResource.src);
        //console.log('\t imageResource.width = ', imageResource.width);
        //console.log('\t imageResource.height = ', imageResource.height);

        // Pull the image's actual width and height
        var imageWidth = imageResource.width || frameWidth;
        var imageHeight = imageResource.height || frameHeight;
        //console.log('\t imageWidth = ', imageWidth);
        //console.log('\t imageHeight = ', imageHeight);

        // Use frame layout to calculate total frames
        var frameCount = 1;
        if (imageResource !== false){
            if (frameLayout == 'vertical'){ frameCount = Math.ceil(imageHeight / frameHeight); }
            else if (frameLayout == 'horizontal'){ frameCount = Math.ceil(imageWidth / frameWidth); }
            }
        //console.log('\t frameCount = ', frameCount);

        // Generate a sequential frame sequence using count
        if (typeof frameSequence === 'undefined' || frameSequence.length < 1){
            frameSequence = [];
            for (var i = 0; i < frameCount; i++){ frameSequence.push(i); }
            }
        //console.log('\t frameSequence = ', frameSequence);

        // Define other frame variables needed for the sprite
        var framePosition = [0, 0];

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

            //console.log('\t RenderOrder / thisGame.gameSpriteIndex['+spriteKey+'] = ', thisGame.gameSpriteIndex[spriteKey]);

            if (typeof thisSprite !== 'undefined' && thisSprite !== false){
                thisGame.gameSpriteRenderOrder.push(spriteKey);

                orderDebug[spriteKey+'/'+thisSprite.filePath] = thisSprite.currentPosition;

            }
        }

        //console.log('\t RenderOrder / orderDebug = ', orderDebug);

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
        //console.log('\t RenderOrder / thisGame.gameSpriteRenderOrder(after) = ', thisGame.gameSpriteRenderOrder);

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
        //console.log('\t battleFieldForeground = ', battleFieldForeground);
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



    // -- UTILITY FUNCTIONS -- //

    // Utility method to extend defaults with user options
    function extendGameSettings(source, properties){
        debug('canvasGameEngine.extendGameSettings(source, properties)', source, properties);

        var newSource = cloneGameObject(source);
        var property;
        for (property in properties){
            if (properties.hasOwnProperty(property)){
                newSource[property] = properties[property];
                }
            }

        return newSource;

    }

    // Utility function for cloning a setting to prevent reference
    function cloneGameObject(sourceObject){
        return JSON.parse(JSON.stringify(sourceObject));
    }


    // -- DEBUG FUNCTIONS -- //

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


    // -- PUBLIC FUNCTIONS -- //

    // Assign debug functions to the prototype so modules have access
    canvasGameEngine.prototype.debug = debug;
    canvasGameEngine.prototype.showDebug = showDebug;
    canvasGameEngine.prototype.hideDebug = hideDebug;

    // Assign utility functions to the prototype so modules have access
    canvasGameEngine.prototype.extendGameSettings = extendGameSettings;
    canvasGameEngine.prototype.cloneGameObject = cloneGameObject;

    // Assign canvas functions to the prototype so modules have access
    canvasGameEngine.prototype.newCanvasSprite = newCanvasSprite;
    canvasGameEngine.prototype.updateCanvasSpriteRenderOrder = updateCanvasSpriteRenderOrder;


}(jQuery));