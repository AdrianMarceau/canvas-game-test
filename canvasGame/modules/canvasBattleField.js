/*
 * ------------------------
 * CANVAS GAME TEST 2017
 * ------------------------
 * Battle Field Module
 * ------------------------
 */

// Extend the active game object with battle field functionality
(function(thisGame){

    // Battle Variables
    var battleField = {};
    thisGame.battleField = battleField;

    // -- PUBLIC FUNCTIONS -- //

    // Define a public function for changing the entire battle field by token
    thisGame.setField = function(fieldToken){
        //console.log('canvasBattleField.setField()', fieldToken);

        // If a string was provided, use it to update the current field
        if (typeof fieldToken === 'string'){ setBattleField(fieldToken); }

    }

    // Define a public function for changing the entire battle field by token
    thisGame.changeField = function(fieldToken){
        //console.log('canvasBattleField.changeField()', fieldToken);

        // Collect data for the requested field from the index
        var battleField = battleFieldIndex.getField(fieldToken);
        //console.log('\t battleField = ', battleField);

        // If data was collected, use it to update the current field
        if (battleField !== false){ changeBattleField(battleField); }

    }

    // Define a public function for changing the battle field background by token
    thisGame.changeFieldBackground = function(fieldToken){
        //console.log('canvasBattleField.changeFieldBackground()', fieldToken);

        // Collect data for the requested field from the index
        var battleField = battleFieldIndex.getField(fieldToken);
        //console.log('\t battleField = ', battleField);

        // If data was collected, use it to update the current field
        if (battleField !== false){ changeBattleFieldBackground(battleField.fieldBackground); }

    }

    // Define a public function for changing the battle field foreground by token
    thisGame.changeFieldForeground = function(fieldToken){
        //console.log('canvasBattleField.changeFieldForeground(fieldToken)', fieldToken);

        // Collect data for the requested field from the index
        var battleField = battleFieldIndex.getField(fieldToken);
        //console.log('\t battleField = ', battleField);

        // If data was collected, use it to update the current field
        if (battleField !== false){ changeBattleFieldForeground(battleField.fieldForeground); }

    }


    // -- PRIVATE FUNCTIONS -- //

    // Define a private method for setting the battle field
    function setBattleField(fieldToken){
        //console.log('canvasBattleField.setBattleField(fieldToken)', fieldToken);

        // Collect battle field data based on token
        var battleField = battleFieldIndex.getField(fieldToken);
        //console.log('canvasBattleField.setField // battleField = ', battleField);

        // Update base field data with provided args
        thisGame.battleField.objectPath = battleField.objectPath;
        thisGame.battleField.fieldName = battleField.fieldName;
        thisGame.battleField.fieldBackground = thisGame.cloneGameObject(battleField.fieldBackground);
        thisGame.battleField.fieldForeground = thisGame.cloneGameObject(battleField.fieldForeground);
        //console.log('canvasBattleField.setBattleField // thisGame.battleField = ', thisGame.battleField);

        // Push field images into the resource queue
        thisGame.gameImages.push(thisGame.battleField.objectPath + 'background.png');
        thisGame.gameImages.push(thisGame.battleField.objectPath + 'foreground.png');
        //console.log('canvasBattleField.setBattleField // thisGame.gameImages = ', thisGame.gameImages);

    }

    // Define a function for dynamically changing the battle field
    function changeBattleField(battleField){
        //console.log('canvasBattleField.changeBattleField()', battleField);

        // Copy over the field name manually intro current
        thisGame.battleField.fieldName = battleField.fieldName;

        // Defer the background and foreground updates to dedicated functions
        changeBattleFieldBackground(battleField.fieldBackground);
        changeBattleFieldForeground(battleField.fieldForeground);

    }

    // Define a function for dynamically changing the battle field background
    function changeBattleFieldBackground(battleFieldBackground){
        //console.log('canvasBattleField.changeBattleFieldBackground()', battleFieldBackground);

        // Clone the provided field background and copy into current
        var fieldBackground = thisGame.cloneGameObject(battleFieldBackground);

        // Wait for the new background to load before updating the game sprite
        resourceIndex.loadFile(fieldBackground.filePath, function(){
            loadFieldBackgroundSprite(fieldBackground);
            });

    }

    // Define a function for dynamically changing the battle field foreground
    function changeBattleFieldForeground(battleFieldForeground){
        //console.log('canvasBattleField.changeBattleFieldForeground()', battleFieldForeground);

        // Clone the provided field foreground and copy into current
        var fieldForeground = thisGame.cloneGameObject(battleFieldForeground);

        // Wait for the new forground to load before updating the game sprite
        resourceIndex.loadFile(fieldForeground.filePath, function(){
            loadFieldForegroundSprite(fieldForeground);
            });

    }

    // Define a function for generating and loading field background sprite
    function loadFieldBackgroundSprite(fieldBackground){
        //console.log('canvasBattleField.loadFieldBackgroundSprite()', fieldBackground);

        // Update the parent field object with the background change
        thisGame.battleField.fieldBackground = fieldBackground;

        // Generate a new sprite for the field background
        var spriteIndexKey = 'fieldBackground';
        fieldBackground.globalFrameStart = thisGame.gameState.currentFrame;
        fieldBackground.currentFrameKey = 0;
        fieldBackground.spriteObject = thisGame.newCanvasSprite(
            spriteIndexKey,
            fieldBackground.objectPath + 'background.png',
            thisGame.gameSettings.baseBackgroundWidth,
            thisGame.gameSettings.baseBackgroundHeight,
            fieldBackground.frameLayout,
            fieldBackground.frameSpeed,
            fieldBackground.frameSequence,
            fieldBackground.frameSync
            );

        // Add generated field sprite to the parent index
        thisGame.gameSpriteIndex[spriteIndexKey] = fieldBackground;

        // Refresh the sprite rendering order
        thisGame.updateCanvasSpriteRenderOrder();

    }

    // Define a function for generating and loading field background sprite
    function loadFieldForegroundSprite(fieldForeground){
        //console.log('canvasBattleField.loadFieldForegroundSprite()', fieldForeground);

        // Update the parent field object with the foreground change
        thisGame.battleField.fieldForeground = fieldForeground;

        // Generate a new sprite for the field foreground
        var spriteIndexKey = 'fieldForeground';
        fieldForeground.globalFrameStart = thisGame.gameState.currentFrame;
        fieldForeground.currentFrameKey = 0;
        fieldForeground.spriteObject = thisGame.newCanvasSprite(
            spriteIndexKey,
            fieldForeground.objectPath + 'foreground.png',
            thisGame.gameSettings.baseForegroundWidth,
            thisGame.gameSettings.baseForegroundHeight,
            fieldForeground.frameLayout,
            fieldForeground.frameSpeed,
            fieldForeground.frameSequence,
            fieldForeground.frameSync
            );

        // Add generated field sprite to the parent index
        thisGame.gameSpriteIndex[spriteIndexKey] = fieldForeground;

        // Refresh the sprite rendering order
        thisGame.updateCanvasSpriteRenderOrder();

    }

    // Define a function for generating and loading field background sprite
    function loadFieldForegroundPanelSprites(fieldForeground){
        //console.log('canvasBattleField.loadFieldForegroundPanelSprites()', fieldForeground);

        // Define a function for calculation the X position of panels
        var panelPositionX = function(){

            // Default the X position to zero
            var positionX = 0;

            // If a field foreground is defined, use it to offset X
            if (typeof thisGame.gameSpriteIndex['fieldForeground'] !== 'undefined'){
                var fieldForeground = thisGame.gameSpriteIndex['fieldForeground'];
                var fieldForegroundDiff = thisGame.getCanvasSpritePositionDiff(fieldForeground);
                if (typeof fieldForeground.panelOffsetX !== 'undefined'){ positionX += fieldForeground.panelOffsetX; }
                positionX = fieldForeground.basePosition[0];
                positionX += fieldForegroundDiff[0];
            }

            // Return calculate X position
            return positionX;

            };

        // Define a function for calculation the Y position of panels
        var panelPositionY = function(){

            // Default the Y position to zero
            var positionY = 0;

            // If a field foreground is defined, use it to offset Y
            if (typeof thisGame.gameSpriteIndex['fieldForeground'] !== 'undefined'){
                var fieldForeground = thisGame.gameSpriteIndex['fieldForeground'];
                var fieldForegroundDiff = thisGame.getCanvasSpritePositionDiff(fieldForeground);
                positionY = fieldForeground.basePosition[1];
                if (typeof fieldForeground.panelOffsetY !== 'undefined'){ positionY += fieldForeground.panelOffsetY; }
                positionY += fieldForegroundDiff[1];
            }

            // Return calculate Y position
            return positionY;

            };

        // Generate a new sprite for the field foreground
        var spriteIndexKey = 'fieldForegroundPanels';
        var fieldForegroundPanels = {
            globalFrameStart: thisGame.gameState.currentFrame,
            filePath: thisGame.gameSettings.baseCorePath + 'images/field-panels_default.png',
            basePosition: [panelPositionX, panelPositionY, 30, 1],
            currentPosition: [panelPositionX, panelPositionY, 30, 1],
            frameWidth: thisGame.gameSettings.baseForegroundWidth,
            frameHeight: thisGame.gameSettings.baseForegroundHeight,
            frameSpeed: 1,
            frameLayout: 'vertical',
            frameSequence: [0],
            frameAnimationSequence: [{
                // fade in
                "startPosition": [0, 0, 0, 0.1],
                "endPosition": [0, 0, 0, 0.3],
                "frameDuration": 60
                }, {
                // fade out
                "startPosition": [0, 0, 0, 0.3],
                "endPosition": [0, 0, 0, 0.1],
                "frameDuration": 60
                }],
            frameSync: false,
            currentFrameKey: 0
            };
        fieldForegroundPanels.spriteObject = thisGame.newCanvasSprite(
            spriteIndexKey,
            thisGame.gameSettings.baseCorePath + 'images/field-panels_default.png',
            thisGame.gameSettings.baseForegroundWidth,
            thisGame.gameSettings.baseForegroundHeight,
            fieldForegroundPanels.frameLayout,
            fieldForegroundPanels.frameSpeed,
            fieldForegroundPanels.frameSequence,
            fieldForegroundPanels.frameSync
            );

        // Add generated field sprite to the parent index
        thisGame.gameSpriteIndex[spriteIndexKey] = fieldForegroundPanels;

        // Refresh the sprite rendering order
        thisGame.updateCanvasSpriteRenderOrder();

    }


    // -- GAME EVENT FUNCTIONS -- //

    // Define a custom start action for the game engine
    thisGame.gameStartActions.push(function(){
        //console.log('thisGame.gameStartActions[\'canvasBattleField\']');

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

        // Return true on success
        return true;

        });

    // Define a custom canvas load action for the game engine
    thisGame.loadCanvasActions.push(function(){
        //console.log('thisGame.loadCanvasActions[\'canvasBattleField\']');

        // Load the field background sprite
        loadFieldBackgroundSprite(thisGame.battleField.fieldBackground);

        // Load the field foreground sprite
        loadFieldForegroundSprite(thisGame.battleField.fieldForeground);

        // Load the field panel sprites
        loadFieldForegroundPanelSprites();

        // Return true on success
        return true;

        });


    // -- ONLOAD ACTIONS -- //

    // Preload the compiled field object index
    thisGame.gameScriptIndexes.push('objects/index.js.php?type=fields');
    //console.log('thisGame.gameScriptIndexes.push(\'objects/index.js.php?type=fields\');', thisGame.gameScriptIndexes);

    // Preload images for the field cell panels
    thisGame.gameImages.push(thisGame.gameSettings.baseCorePath + 'images/field-panels_default.png');


}(window.thisCanvasGame));