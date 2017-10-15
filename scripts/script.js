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
        }, function(thisGame){
        //console.log('on ready callback!');

        // Load the default Intro Field into the battle
        thisGame.setBattleField(battleConfig.fieldToken);

        // Load the default Player Robots into the battle
        for (var robotKey in battleConfig.battleRobots.thisTeam){
            var robotToken = battleConfig.battleRobots.thisTeam[robotKey][0];
            var robotPosition = battleConfig.battleRobots.thisTeam[robotKey][1];
            thisGame.loadBattleRobot('thisTeam', robotKey, robotToken, robotPosition, 'left');
            }

        // Load the default Target Robots into the battle
        for (var robotKey in battleConfig.battleRobots.targetTeam){
            var robotToken = battleConfig.battleRobots.targetTeam[robotKey][0];
            var robotPosition = battleConfig.battleRobots.targetTeam[robotKey][1];
            thisGame.loadBattleRobot('targetTeam', robotKey, robotToken, robotPosition, 'right');
            }

        //console.log('thisGame.battleRobots = ', thisGame.battleRobots);

        //console.log('thisGame.gameSpriteIndex = ', thisGame.gameSpriteIndex);

        //console.log('thisGame.gameSpriteIndexKeys = ', thisGame.gameSpriteIndexKeys);

        // Start the canvas game loop when ready
        thisGame.startGame();

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