/*
 * ------------------------
 * CANVAS GAME TEST 2017
 * ------------------------
 * Game Speed Module
 * ------------------------
 */

// Extend the active game object with custom speed functionality
(function(thisGame){

    // Define a method for decreasing the global game speed
    thisGame.resetGameSpeed = function(){
        //console.log('thisGame.resetGameSpeed()');

        thisGame.gameSettings.baseGameSpeed = 1.0;

        //console.log('\t thisGame.gameSettings.baseGameSpeed = ', thisGame.gameSettings.baseGameSpeed);

    }

    // Define a method for decreasing the global game speed
    thisGame.setGameSpeed = function(amount){
        //console.log('thisGame.setGameSpeed(amount)', amount);

        if (typeof amount !== 'numeric'){ amount = 1.0; }
        else { amount = parseFloat(amount); }

        thisGame.gameSettings.baseGameSpeed = (Math.round((amount) * 10)) / 10;
        if (thisGame.gameSettings.baseGameSpeed <= 0){ thisGame.gameSettings.baseGameSpeed = 0.1; }
        else if (thisGame.gameSettings.baseGameSpeed >= 2){ thisGame.gameSettings.baseGameSpeed = 2.0; }

        //console.log('\t thisGame.gameSettings.baseGameSpeed = ', thisGame.gameSettings.baseGameSpeed);

    }

    // Define a method for decreasing the global game speed
    thisGame.makeGameSlower = function(amount){
        //console.log('thisGame.makeGameSlower(amount)', amount);

        if (typeof amount !== 'numeric'){ amount = 0.1; }
        else { amount = parseFloat(amount); }

        thisGame.gameSettings.baseGameSpeed = (Math.round((thisGame.gameSettings.baseGameSpeed + amount) * 10)) / 10;
        if (thisGame.gameSettings.baseGameSpeed >= 2){ thisGame.gameSettings.baseGameSpeed = 2.0; }

        //console.log('\t thisGame.gameSettings.baseGameSpeed = ', thisGame.gameSettings.baseGameSpeed);

    }

    // Define a method for increasing the global game speed
    thisGame.makeGameFaster = function(amount){
        //console.log('thisGame.makeGameFaster(amount)', amount);

        if (typeof amount !== 'numeric'){ amount = 0.1; }
        else { amount = parseFloat(amount); }

        thisGame.gameSettings.baseGameSpeed = (Math.round((thisGame.gameSettings.baseGameSpeed - amount) * 10)) / 10;
        if (thisGame.gameSettings.baseGameSpeed <= 0){ thisGame.gameSettings.baseGameSpeed = 0.1; }

        //console.log('\t thisGame.gameSettings.baseGameSpeed = ', thisGame.gameSettings.baseGameSpeed);

    }

}(window.thisCanvasGame));