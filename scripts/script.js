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
    for (var robotKey in battleConfig.battleRobots.thisTeam){
        var robotToken = battleConfig.battleRobots.thisTeam[robotKey][0];
        var robotPosition = battleConfig.battleRobots.thisTeam[robotKey][1];
        canvasGame.loadBattleRobot('thisTeam', robotKey, robotToken, robotPosition, 'left');
    }

    // Load the default Target Robots into the battle
    for (var robotKey in battleConfig.battleRobots.targetTeam){
        var robotToken = battleConfig.battleRobots.targetTeam[robotKey][0];
        var robotPosition = battleConfig.battleRobots.targetTeam[robotKey][1];
        canvasGame.loadBattleRobot('targetTeam', robotKey, robotToken, robotPosition, 'right');
    }

   //console.log('canvasGame.battleRobots = ', canvasGame.battleRobots);

   //console.log('canvasGame.gameSpriteIndex = ', canvasGame.gameSpriteIndex);

   //console.log('canvasGame.gameSpriteIndexKeys = ', canvasGame.gameSpriteIndexKeys);


    // Start the canvas game loop when ready
    canvasGame.startGame(function(){
        //console.log('game has started!');
        /*
        var myTimeout = setTimeout(function(){

            // Load the default Player Robots into the battle
            for (var robotKey in battleConfig.battleRobots.thisTeam){
                var robotToken = battleConfig.battleRobots.thisTeam[robotKey][0];
                var robotPosition = battleConfig.battleRobots.thisTeam[robotKey][1];
                canvasGame.loadBattleRobot('thisTeam', robotKey, robotToken, robotPosition, 'left');
            }

            // Load the default Target Robots into the battle
            for (var robotKey in battleConfig.battleRobots.targetTeam){
                var robotToken = battleConfig.battleRobots.targetTeam[robotKey][0];
                var robotPosition = battleConfig.battleRobots.targetTeam[robotKey][1];
                canvasGame.loadBattleRobot('targetTeam', robotKey, robotToken, robotPosition, 'right');
            }

            }, 1000);
        */
        });

});

// Define default battle config
battleConfig = {
    fieldToken: 'default',
    battleRobots: {
        thisTeam: [
            ['default', 'C2'],
            ['default', 'B1'],
            ['default', 'B3']
            ],
        targetTeam: [
            ['default', 'C2'],
            ['default', 'B1'],
            ['default', 'B3']
            ]
        }
    };