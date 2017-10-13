/*
 * ------------------------
 * CANVAS GAME TEST 2017
 * ------------------------
 * Canvas Sprite Class
 * ------------------------
 */

(function() {

    var thisGame;

    function gameSprite(url, pos, size, speed, frames, dir, once, game){
        //console.log('gameSprite(url, pos, size, speed, frames, dir, once)\n', url, pos, size, speed, frames, dir, once);

        this._index = 0;
        this.pos = pos;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this.url = url;
        this.dir = dir || 'horizontal';
        this.once = once;

        this.thisGame = thisGame;
        thisGame = typeof game !== 'undefined' ? game : {};

        if (typeof thisGame.gameState !== 'undefined'
            && typeof thisGame.gameState.currentFrame !== 'undefined'){
            this.globalFrameStart = thisGame.gameState.currentFrame;
            }

    };

    // Define a prototype function for creating this object
    gameSprite.prototype = {

        update: function(dt){

            /*

            var speed = this.speed * (1 / thisGameSpeed);
            this._index += speed * dt;
            */

            if (typeof thisGame.gameSettings !== 'undefined'
                && typeof thisGame.gameSettings.baseGameSpeed !== 'undefined'){
                var thisGameSpeed = thisGame.gameSettings.baseGameSpeed;
                } else {
                var thisGameSpeed = 1;
                }

            if (typeof thisGame.gameState !== 'undefined'
                && typeof thisGame.gameState.currentFrame !== 'undefined'){
                var diff = thisGame.gameState.currentFrame - this.globalFrameStart;
                var index = Math.floor((diff / 60) * this.speed * (1 / thisGameSpeed));
                this._index = index;
                }

            },

        render: function(ctx){

            //console.log('thisGameSpeed = ', thisGameSpeed);

            var frame;

            if (this.speed > 0){
                var max = this.frames.length;
                var idx = Math.floor(this._index);
                frame = this.frames[idx % max];
                if (this.once && idx >= max){
                    this.done = true;
                    return;
                    }
                } else {
                frame = 0;
                }

            var x = this.pos[0];
            var y = this.pos[1];

            if (this.dir == 'vertical'){
                y += frame * this.size[1];
                } else {
                x += frame * this.size[0];
                }

            var imgObj = resourceManager.getFile(this.url);
            //console.log('typeof imgObj = ', typeof imgObj);
            if (typeof imgObj === 'object'){
                ctx.drawImage(imgObj,
                    x, y, this.size[0], this.size[1],
                    0, 0, this.size[0], this.size[1]
                    );
                }


            }

        };

    // Define a utility function for calculating animated sprite position
    gameSprite.getSpritePosition = function(currentGlobalFame, canvasSprite){
        //console.log('getCurrentSpritePosition(currentGlobalFame, canvasSprite)', currentGlobalFame, canvasSprite);

        if (typeof thisGame.gameSettings !== 'undefined'
            && typeof thisGame.gameSettings.baseGameSpeed !== 'undefined'){
            var thisGameSpeed = thisGame.gameSettings.baseGameSpeed;
        } else {
            var thisGameSpeed = 1;
        }

        //console.log('thisGameSpeed = ', thisGameSpeed);

        //console.log('\t canvasSprite = ', canvasSprite);
        //console.log('\t canvasSprite.filePath = ', canvasSprite.filePath);

        // Collect the base position before continuing
        var basePosition = [0, 0, 0];
        if (typeof canvasSprite.basePosition !== 'undefined'){
            basePosition = canvasSprite.basePosition;
            if (typeof basePosition[0] === 'function'){ basePosition[0] = basePosition[0](); }
            if (typeof basePosition[1] === 'function'){ basePosition[1] = basePosition[1](); }
            if (typeof basePosition[2] === 'function'){ basePosition[2] = basePosition[2](); }
        }

        // If no animation steps were defined, we can return the base position as-is
        if (typeof canvasSprite.animationSteps === 'undefined'
            || canvasSprite.animationSteps.length < 1){
            //console.log('canvasSprite.animationSteps is undefined or empty');
            return basePosition;
        }
        //console.log('\t canvasSprite.animationSteps = ', canvasSprite.animationSteps);

        //console.log('\t currentGlobalFame = ', currentGlobalFame);

        //console.log('\t canvasSprite.globalFrameStart = ', canvasSprite.globalFrameStart);

        if (currentGlobalFame != canvasSprite.globalFrameStart){
            var currentRelativeFrame = currentGlobalFame - canvasSprite.globalFrameStart;
        } else {
            var currentRelativeFrame = currentGlobalFame;
        }

        //console.log('\t currentRelativeFrame = ', currentRelativeFrame);

        var totalAnimationFrames = 0;
        var spriteAnimationTimeline = [];
        for (var stepKey = 0; stepKey < canvasSprite.animationSteps.length; stepKey++){
            var stepData = canvasSprite.animationSteps[stepKey];
            var stepRange = [];
            stepRange.push(totalAnimationFrames + 1);
            totalAnimationFrames += Math.ceil(stepData.frameDuration * (1 / canvasSprite.frameSpeed) * thisGameSpeed);
            stepRange.push(totalAnimationFrames);
            spriteAnimationTimeline.push(stepRange);
            }

        //console.log('\t totalAnimationFrames = ', totalAnimationFrames);
        //console.log('\t spriteAnimationTimeline = ', spriteAnimationTimeline);

        var spriteAnimationFrame = (currentRelativeFrame % totalAnimationFrames) + 1;
        //console.log('\t spriteAnimationFrame = ', spriteAnimationFrame);

        var spriteAnimationOffset = typeof canvasSprite.basePosition != 'undefined' ? canvasSprite.basePosition : [0, 0];
        //console.log('\t canvasSprite.basePosition = ', canvasSprite.basePosition);
        //console.log('\t spriteAnimationOffset = ', spriteAnimationOffset);

        var currentSpritePosition = [0, 0, 0];
        var stepKey;
        for (stepKey = 0; stepKey < spriteAnimationTimeline.length; stepKey++){
            var stepData = canvasSprite.animationSteps[stepKey];
            var stepRange = spriteAnimationTimeline[stepKey];
            //console.log('\t stepKey = ', stepKey);
            //console.log('\t stepData = ', stepData);
            //console.log('\t stepRange = ', stepRange);
            if (spriteAnimationFrame >= stepRange[0] && spriteAnimationFrame <= stepRange[1]){

                var currentStepKey = stepKey;
                var currentStepNum = currentStepKey + 1;
                //console.log('\t currentStepKey = ', currentStepKey);
                //console.log('\t currentStepNum = ', currentStepNum);

                var stepProgNumerator = spriteAnimationFrame - stepRange[0];
                var stepProgDenominator = stepRange[1] - stepRange[0];
                //console.log('\t stepProgNumerator = ', stepProgNumerator);
                //console.log('\t stepProgDenominator = ', stepProgDenominator);
                var stepProgressMultiplier = stepProgNumerator != 0 && stepProgDenominator != 0 ? (stepProgNumerator / stepProgDenominator) : 0;
                var stepProgressPercent = Math.ceil((stepProgressMultiplier * 100) * 1000) / 1000;
                //console.log('\t stepProgressMultiplier = ', stepProgressMultiplier);
                //console.log('\t stepProgressPercent = ', stepProgressPercent+'%');


                var xStart = stepData.startPosition[0];
                var xEnd = stepData.endPosition[0];
                var xDiff = xStart - xEnd;
                var xProg = Math.ceil(xDiff * stepProgressMultiplier) * -1;
                var xOffset = typeof spriteAnimationOffset[0] === 'function' ? spriteAnimationOffset[0]() : spriteAnimationOffset[0];
                var currentX = xOffset + xStart + xProg;

                //console.log('\t xStart = ', xStart);
                //console.log('\t xEnd = ', xEnd);
                //console.log('\t xDiff = ', xDiff);
                //console.log('\t xProg = ', xProg);
                //console.log('\t xOffset = ', xOffset);
                //console.log('\t currentX = ', currentX);

                var yStart = stepData.startPosition[1];
                var yEnd = stepData.endPosition[1];
                var yDiff = yStart - yEnd;
                var yProg = Math.ceil(yDiff * stepProgressMultiplier) * -1;
                var yOffset = typeof spriteAnimationOffset[1] === 'function' ? spriteAnimationOffset[1]() : spriteAnimationOffset[1];
                var currentY = yOffset + yStart + yProg;

                //console.log('\t yStart = ', yStart);
                //console.log('\t yEnd = ', yEnd);
                //console.log('\t yDiff = ', yDiff);
                //console.log('\t yProg = ', yProg);
                //console.log('\t yOffset = ', yOffset);
                //console.log('\t currentY = ', currentY);

                var currentZ = basePosition[2];

                //console.log('\t currentZ = ', currentZ);

                currentSpritePosition = [currentX, currentY, currentZ];

                break;
                }
            }

        return currentSpritePosition;

    }

    window.gameSprite = gameSprite;

})();