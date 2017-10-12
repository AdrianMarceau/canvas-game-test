/*
 * ------------------------
 * CANVAS GAME TEST 2017
 * ------------------------
 * Document Wrapper
 * ------------------------
 */

// Wait for document ready before starting
var canvasGame;
var battleConfig;
$(document).ready(function(){

    // Collect current URL as the base href
    var baseHref = window.location.href;
    baseHref = baseHref.replace(/[^\/]+$/, '');

    // Create new game object with custom settings
    canvasGame = new canvasGameEngine({
        baseHref: baseHref,
        showDebug: false
        });

    // Load the default Intro Field into the battle
    canvasGame.setBattleField(battleConfig.fieldToken);

    // Load the default Player Robots into the battle
    for (var robotKey in battleConfig.playerRobots){
        var robotToken = battleConfig.playerRobots[robotKey][0];
        var robotPosition = battleConfig.playerRobots[robotKey][1];
        canvasGame.loadPlayerRobot(robotKey, robotToken, robotPosition);
    }

    // Load the default Target Robots into the battle
    for (var robotKey in battleConfig.targetRobots){
        var robotToken = battleConfig.targetRobots[robotKey][0];
        var robotPosition = battleConfig.targetRobots[robotKey][1];
        canvasGame.loadTargetRobot(robotKey, robotToken, robotPosition);
    }

   //console.log('canvasGame.playerRobots = ', canvasGame.playerRobots);

   //console.log('canvasGame.gameSpriteIndex = ', canvasGame.gameSpriteIndex);

   //console.log('canvasGame.gameSpriteIndexKeys = ', canvasGame.gameSpriteIndexKeys);

    // Start the canvas game loop when ready
    canvasGame.startGame();

});

// Define default battle config
battleConfig = {
    fieldToken: 'default',
    playerRobots: [
        ['default', 'C2'],
        ['default', 'B1'],
        ['default', 'B3']
        ],
    targetRobots: [
        ['default', 'C2'],
        ['default', 'B1'],
        ['default', 'B3']
        ]
    };