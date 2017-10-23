/*
 * ------------------------
 * CANVAS GAME TEST 2017
 * ------------------------
 * Battle Robot Module
 * ------------------------
 */

// Extend the active game object with battle robot functionality
(function(thisGame){

    // Battle Variables
    var battleRobots = {};
    thisGame.battleRobots = battleRobots;


    // -- PUBLIC FUNCTIONS -- //

    // Define a function for loading a new robot into the battle
    thisGame.loadBattleRobot = function(robotTeam, robotKey, robotToken, robotPosition, robotSide){
        //console.log('thisGame.loadBattleRobot()', robotTeam, robotKey, robotToken, robotPosition, robotSide);

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

    // Define a function for finding empty cells on one side of the battle field
    thisGame.findEmptyCells = function(battleTeam){
        //console.log('thisGame.findEmptyCells()');

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
    thisGame.findFirstEmptyCell = function(battleTeam){
        //console.log('thisGame.findEmptyCells()');
        if (typeof thisGame.battleRobots[battleTeam] === 'undefined'){ return false; }
        var emptyCells = thisGame.findEmptyCells(battleTeam);
        if (emptyCells !== false && emptyCells.length > 0){ return emptyCells[0]; }
        else { return false; }
    }


    // -- PRIVATE FUNCTIONS -- //

    // Define a function for inserting a new robot into the player's team
    function newBattleRobot(battleTeam, battleRobot){
        //console.log('thisGame.newBattleRobot()', battleTeam, battleRobot);

        // Define a pointer to the appropriate team if exists, else create it
        if (typeof thisGame.battleRobots[battleTeam] === 'undefined'){ thisGame.battleRobots[battleTeam] = []; }
        var battleTeamRobots = thisGame.battleRobots[battleTeam];

        // Clone the provided robot data and assign to player
        var robotKey = battleRobot.robotKey;
        var robotToken = battleRobot.robotToken;
        var robotDirection = battleRobot.robotDirection;
        battleTeamRobots[robotKey] = thisGame.cloneGameObject(battleRobot);

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
        //console.log('thisGame.newBattleRobotSprite()', battleTeam, robotKey, robotSpriteKey);

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
        thisGame.updateCanvasSpriteRenderOrder();

    }

    // Define a function for generating and loading a robot energy sprite
    function newBattleRobotEnergySprite(battleTeam, robotKey, robotSpriteKey){
        //console.log('thisGame.newBattleRobotEnergySprite()', battleTeam, robotKey, robotSpriteKey);

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
        thisGame.updateCanvasSpriteRenderOrder()

    }

    // Define a function for calculating current position of a robot cell
    function getRobotCellPosition(cellKey, robotDirection){
        //console.log('thisGame.getRobotCellPosition(cellKey)', cellKey);

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
        var battleFieldForegroundSpriteDiff = thisGame.getCanvasSpritePositionDiff(battleFieldForegroundSprite);
        //console.log('\t battleFieldForeground = ', battleFieldForeground);
        //console.log('\t battleFieldForegroundSprite = ', battleFieldForegroundSprite);

        // Apply these X and Y mods to the cell position itself
        //console.log('\t robotCellPosition[0](before) = ', robotCellPosition[0]);
        //console.log('\t robotCellPosition[1](before) = ', robotCellPosition[1]);
        //console.log('\t robotCellPosition[2](before) = ', robotCellPosition[2]);
        if (robotDirection === 'left'){ robotCellPosition[0] += battleFieldForegroundSpriteDiff[0]; }
        else if (robotDirection === 'right'){ robotCellPosition[0] -= battleFieldForegroundSpriteDiff[0]; }
        robotCellPosition[1] += battleFieldForegroundSpriteDiff[1];
        robotCellPosition[2] += battleFieldForegroundSpriteDiff[2];
        //console.log('\t robotCellPosition[0](after) = ', robotCellPosition[0]);
        //console.log('\t robotCellPosition[1](after) = ', robotCellPosition[1]);
        //console.log('\t robotCellPosition[2](after) = ', robotCellPosition[2]);

        // Return the calculated robot cell position
        return robotCellPosition;

    }


    // -- GAME EVENT FUNCTIONS -- //

    // Define a custom start action for the game engine
    thisGame.gameStartActions.push(function(){
        //console.log('thisGame.gameStartActions[\'canvasBattleRobots\']');

        // If the base robots have been defined, loop through and add them
        if (typeof thisGame.gameSettings.baseBattleRobots !== 'undefined'){
            var baseBattleRobots = thisGame.gameSettings.baseBattleRobots;
            var battleTeamKey = 0;
            for (var battleTeam in baseBattleRobots){
                thisGame.battleRobots[battleTeam] = [];
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

        // Return true on success
        return true;

        });


    // -- ONLOAD ACTIONS -- //

    // Preload the compiled robot object index
    thisGame.gameScriptIndexes.push('objects/index.js.php?type=robots');
    //console.log('thisGame.gameScriptIndexes.push(\'objects/index.js.php?type=robots\');', thisGame.gameScriptIndexes);

    // Preload common assets used by all robots
    thisGame.gameImages.push(thisGame.gameSettings.baseCorePath + 'images/robot-status_left.png');
    thisGame.gameImages.push(thisGame.gameSettings.baseCorePath + 'images/robot-status_right.png');




}(window.thisCanvasGame));