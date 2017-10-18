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

    //console.log('creating new game...');

    // Create new game object with custom settings
    canvasGame = new canvasGameEngine(battleConfig, function(thisGame){
        //console.log('on ready callback!');

        //console.log('thisGame.battleRobots = ', thisGame.battleRobots);

        //console.log('thisGame.gameSpriteIndex = ', thisGame.gameSpriteIndex);

        // Start the canvas game loop when ready
        thisGame.startGame();

        });

});

// Define default battle config
battleConfig = {
    baseFieldToken: 'default',
    baseBattleRobots: {
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