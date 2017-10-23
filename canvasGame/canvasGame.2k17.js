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
        'modules/canvasBattleField.js',
        'modules/canvasBattleRobot.js'
        ];

    // Script Index Variables
    var gameScriptIndexes = [];

    // Settings Variables
    var gameSettings = {
        cacheDate: '20XXYYZZ-01',
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
        gameSettings.baseCorePath + 'images/operator-status_left.png',
        gameSettings.baseCorePath + 'images/operator-status_right.png'
        ];

    // Sprite Variables
    var gameSpriteIndex = {};
    var gameSpriteRenderOrder = [];

    // Action Callbacks
    var gameStartActions = [];
    var loadCanvasActions = [];

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

        thisGame.gameStartActions = gameStartActions;
        thisGame.loadCanvasActions = loadCanvasActions;

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
        //console.log('canvasGameEngine.startGame()', startCallback);

        // Loop through game start actions and execute one by one
        if (thisGame.gameStartActions.length){
            for (var actionKey in thisGame.gameStartActions){
                var thisAction = thisGame.gameStartActions[actionKey];
                if (typeof thisAction === 'function'){
                    if (thisAction() === true){ continue; }
                    else { continue; }
                    }
                }
            }

        // Now we can load required image files then start the game when complete
        resourceIndex.loadFiles(thisGame.gameImages, function(){
            //console.log('resourceIndex.loadFiles() complete!', thisGame.gameImages);

            // Loop through game start actions and execute one by one
            if (thisGame.loadCanvasActions.length){
                for (var actionKey in thisGame.loadCanvasActions){
                    var thisAction = thisGame.loadCanvasActions[actionKey];
                    if (typeof thisAction === 'function'){
                        if (thisAction() === true){ continue; }
                        else { continue; }
                        }
                    }
                }

            // Start the game
            startGame(startCallback);

            });

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


    // -- INIT FUNCTIONS -- //

    // Define a function for loading our game
    function loadEngine(readyCallback){
        //console.log('canvasGameEngine.loadEngine()');

        /* -- Define Settings -- */

        // Define object references to HTML elements
        thisGame.gameWindow.rootDiv = $(thisGame.gameSettings.htmlClass);
        thisGame.gameWindow.canvasDiv = $(thisGame.gameSettings.htmlCanvasClass, thisGame.gameWindow.rootDiv);
        thisGame.gameWindow.consoleDiv = $(thisGame.gameSettings.htmlConsoleClass, thisGame.gameWindow.rootDiv);
        thisGame.gameWindow.buttonsDiv = $(thisGame.gameSettings.htmlButtonsClass, thisGame.gameWindow.rootDiv);

        // Update the resource manager's config
        resourceIndex.setup({
            cacheDate: thisGame.gameSettings.cacheDate,
            parentElement: thisGame.gameWindow.rootDiv,
            baseHref: thisGame.gameSettings.baseHref
            });

        /* -- Queue Actions -- */

        // Queue up canvas onload functions for the core game engine
        thisGame.loadCanvasActions.push(function(){
            //console.log('thisGame.loadCanvasActions[\'canvasGameEngine\']');

            // Load all the canvas sprites
            loadCanvasSprites();

            // Return true on success
            return true;

            });

        /* -- Load Scripts, Then Return -- */

        // Generate a list of full script URLs to load first
        var gameScriptURLs = [];
        var gameScriptBase = thisGame.gameSettings.baseHref + thisGame.gameSettings.baseCorePath;
        for (var i in thisGame.gameScripts){
            var thisScript = thisGame.gameScripts[i];
            var thisScriptURL = gameScriptBase + thisScript;
            gameScriptURLs.push(thisScriptURL);
            }

        // Load all required game scripts before proceeding
        //console.log('\t loading thisGame.gameScripts = gameScriptURLs = ', thisGame.gameScripts, gameScriptURLs);
        resourceIndex.loadScriptFiles(gameScriptURLs, function(){
            //console.log('\t gameScriptURLs have finished loading! ', gameScriptURLs);

            // Generate a list of full index URLs to load next
            var scriptIndexURLs = [];
            var scriptIndexBase = thisGame.gameSettings.baseHref + thisGame.gameSettings.baseCorePath;
            for (var i in thisGame.gameScriptIndexes){
                var thisScript = thisGame.gameScriptIndexes[i];
                var thisScriptURL = scriptIndexBase + thisScript;
                scriptIndexURLs.push(thisScriptURL);
                }

            // Now load all the game object indexes into memory before finish
            //console.log('\t loading thisGame.gameScriptIndexes = scriptIndexURLs = ', thisGame.gameScriptIndexes, scriptIndexURLs);
            resourceIndex.loadScriptFiles(scriptIndexURLs, function(){
                //console.log('\t scriptIndexURLs have finished loading! ', scriptIndexURLs);

                // If the readyCallback was set, execute it
                readyCallback(thisGame);

                }, false);

            }, false);

    }

    // Define a function for intializing the actual game engine
    function startGame(startCallback){
        //console.log('canvasGameEngine.startGame()');

        initGameLoop();
        initGameCanvas();
        mainGameLoop();

        if (typeof startCallback === 'function'){
            startCallback();
        }

    }

    // Define a function for initializing the game loop
    function initGameLoop(){
        //console.log('canvasGameEngine.initGameLoop()');

        // Define click event for the "Pause Game" / "Resume Game" buttons
        $('.buttons .button.pause', thisGame.gameWindow.buttonsDiv).bind('click', function(e){
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
        $('.buttons .button.debug', thisGame.gameWindow.buttonsDiv).bind('click', function(e){
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
        //console.log('initGameCanvas.initGameLoop()');

        thisGame.gameWindow.canvasDiv.css({opacity:0});
        thisGame.gameWindow.canvasObject = $('canvas', thisGame.gameWindow.canvasDiv).get(0);
        thisGame.gameWindow.canvasContext = thisGame.gameWindow.canvasObject.getContext('2d');
        //console.log('\t thisGame.gameWindow.canvasObject = ' + thisGame.gameWindow.canvasObject);
        //console.log('\t thisGame.gameWindow.canvasContext = ' + thisGame.gameWindow.canvasContext);

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
        //console.log('canvasGameEngine.mainGameLoop()');

        //console.log('\t thisGame.gameSettings.pauseGameLoop = ' + thisGame.gameSettings.pauseGameLoop);
        if (thisGame.gameSettings.pauseGameLoop == true){ return false; }

        //console.log('\t thisGame.gameSettings.autoGameLoop = ' + thisGame.gameSettings.autoGameLoop);
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
            //console.log('\t thisGame.gameState.loopCounter = ' + thisGame.gameState.loopCounter);

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
        //console.log('canvasGameEngine.pauseGame()');
        thisGame.gameSettings.autoGameLoop = false;
        return;
    }

    // Define a toggle function for resuming the game loop
    function resumeGame(){
        //console.log('canvasGameEngine.resumeGame()');
        thisGame.gameSettings.autoGameLoop = true;
        mainGameLoop();
        return;
    }


    // -- GAME CANVAS FUNCTIONS -- //

    // Define a function for quickly gett

    // Define a function for updating or recalculating game canvas properties
    function updateGameCanvas(callBack){
        //console.log('canvasGameEngine.updateGameCanvas()');

        var thisCanvas = thisGame.gameWindow.canvasContext;

        if (typeof callBack == 'function'){ callBack(); }

    }

    // Define a function for rendering game canvas given propteries and state
    function renderGameCanvas(){
        //console.log('canvasGameEngine.renderGameCanvas()');

        // Collect a reference to the canvas
        var thisCanvas = thisGame.gameWindow.canvasContext;

        clearCanvas();

        drawCanvasSprites();

        drawFrameCounter();

    }

    // Define a function for clearing the canvas
    function clearCanvas(){
        //console.log('canvasGameEngine.clearCanvas()');

        // Collect a reference to the canvas
        var thisCanvas = thisGame.gameWindow.canvasContext;

        thisCanvas.fillStyle = '#101010';
        thisCanvas.fillRect(0, 0, thisGame.gameState.canvasWidth, thisGame.gameState.canvasHeight);

    }

    // Define a function for loading all of the game's sprites
    function loadCanvasSprites(){
        //console.log('canvasGameEngine.loadCanvasSprites()');


        // TEST OPERATOR SPRITES //

        var statusBarLeft = thisGame.gameSettings.baseCorePath + 'images/operator-status_left.png';
        resourceIndex.loadFile(statusBarLeft, function(){

            var positionX = 4;
            var positionY = 4;

            var energySpriteKey = 'thisTeam/operators/energy';
            var operatorEnergySprite = {
                globalFrameStart: thisGame.gameState.currentFrame,
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
                frameSync: false,
                currentFrameKey: 0
                };
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
                globalFrameStart: thisGame.gameState.currentFrame,
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
                frameSync: false,
                currentFrameKey: 0
                };
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


    // -- SPRITE FUNCTIONS -- //

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

            // Update this sprite's current position variables with calculated values
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


    // Define a function for calculating the difference between a sprite's base and current position values
    function getCanvasSpritePositionDiff(canvasSprite){

        // Define the base diff values as zero
        var spriteDiffX = 0;
        var spriteDiffY = 0;
        var spriteDiffZ = 0;

        // If the battlefield itself has moved at all, we should adjust the cell too
        if (typeof canvasSprite !== 'undefined'
            && typeof canvasSprite.currentPosition !== 'undefined'){
            //console.log('\t canvasSprite exists and has position...');

            if ((canvasSprite.currentPosition[0] != canvasSprite.basePosition[0])
                || (canvasSprite.currentPosition[1] != canvasSprite.basePosition[1])
                || (canvasSprite.currentPosition[2] != canvasSprite.basePosition[2])){
                //console.log('\t adjust robot cell by battle field position change...');

                // Collect the X and Y position difference from base value
                spriteDiffX = canvasSprite.currentPosition[0] - canvasSprite.basePosition[0];
                spriteDiffY = canvasSprite.currentPosition[1] - canvasSprite.basePosition[1];
                spriteDiffZ = canvasSprite.currentPosition[2] - canvasSprite.basePosition[2];
                //console.log('\t spriteDiffX = ', spriteDiffX);
                //console.log('\t spriteDiffY = ', spriteDiffY);
                //console.log('\t spriteDiffZ = ', spriteDiffZ);

                }

            }

        // Return calculated position diffs
        return [spriteDiffX, spriteDiffY, spriteDiffZ];

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
        //console.log('canvasGameEngine.drawFrameCounter()');

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
        //console.log('canvasGameEngine.resizeGameCanvas()');

        thisGame.gameSettings.pauseGameLoop = true;
        //console.log('\t thisGame.gameSettings.pauseGameLoop = ' + thisGame.gameSettings.pauseGameLoop);

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


    // -- UTILITY FUNCTIONS -- //

    // Utility method to extend defaults with user options
    function extendGameSettings(source, properties){
        //console.log('canvasGameEngine.extendGameSettings(source, properties)', source, properties);

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
        //console.log('canvasGameEngine.showDebug()');
        thisGame.gameSettings.showDebug = true;
        return;
    }

    // Define a toggle function for hiding the game debug
    function hideDebug(){
        //console.log('canvasGameEngine.hideDebug()');
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
    canvasGameEngine.prototype.getCanvasSpritePositionDiff = getCanvasSpritePositionDiff;


}(jQuery));