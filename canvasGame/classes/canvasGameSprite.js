/*
 * ------------------------
 * CANVAS GAME TEST 2017
 * ------------------------
 * Canvas Sprite Class
 * ------------------------
 */

(function() {

    var thisGame;

    function gameSprite(filePath, framePosition, frameWidth, frameHeight, frameSpeed, frameSequence, frameLayout, playOnce, gameObject, spritekey){
        //console.log('gameSprite(filePath, framePosition, frameWidth, frameHeight, frameSpeed, frameSequence, frameLayout, playOnce)\n', filePath, framePosition, frameWidth, frameHeight, frameSpeed, frameSequence, frameLayout, playOnce, gameObject, spritekey);

        this._index = 0;
        this.frameKey = 0;
        this.framePosition = framePosition;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameSpeed = typeof frameSpeed === 'number' ? frameSpeed : 1;
        this.frameSequence = frameSequence;
        this.filePath = filePath;
        this.frameLayout = frameLayout || 'horizontal';
        this.playOnce = playOnce;

        this.thisGame = thisGame;
        thisGame = typeof gameObject !== 'undefined' ? gameObject : {};

        this.spritekey = spritekey;

        if (typeof thisGame.gameState !== 'undefined'
            && typeof thisGame.gameState.currentFrame !== 'undefined'){
            this.globalFrameStart = thisGame.gameState.currentFrame;
            }

    };

    // Define a prototype function for creating this object
    gameSprite.prototype = {

        update: function(dt){

            var thisSprite = thisGame.gameSpriteIndex[this.spritekey];

            var thisGameSpeed = thisGame.gameSettings.baseGameSpeed;
            var thisSpriteSpeed = thisSprite.frameSpeed * thisGameSpeed;

            this.frameKey += (1 / thisSpriteSpeed);
            thisSprite.currentFrameKey = this.frameKey;

            var thisFramesPerSecond = thisGame.gameSettings.baseFramesPerSecond;

            var index = Math.floor(this.frameKey / thisFramesPerSecond) % this.frameSequence.length;

            this._index = index;

            },

        render: function(ctx){

            var thisSprite = thisGame.gameSpriteIndex[this.spritekey];
            var frameKey;

            if (this.frameSpeed > 0){
                var max = this.frameSequence.length;
                var idx = Math.floor(this._index);
                frameKey = this.frameSequence[idx % max];
                if (this.playOnce && idx >= max){
                    this.done = true;
                    return;
                    }
                } else {
                frameKey = 0;
                }

            var x = this.framePosition[0];
            var y = this.framePosition[1];

            if (this.frameLayout == 'vertical'){
                y += frameKey * this.frameHeight;
                } else {
                x += frameKey * this.frameWidth;
                }

            var imgObj = resourceIndex.getFile(this.filePath);
            //console.log('typeof imgObj = ', typeof imgObj);
            if (typeof imgObj === 'object'){

                var baseAlpha = 1;
                var currentAlpha = 1;

                if (this.filePath.indexOf('status') !== -1){
                    //currentAlpha = 0.5;
                }

                if (typeof thisSprite.basePosition[3] === 'function'){
                    baseAlpha = thisSprite.basePosition[3]();
                    } else if (typeof thisSprite.basePosition[3] !== 'undefined'){
                    baseAlpha = thisSprite.basePosition[3];
                    }

                if (typeof thisSprite.currentPosition[3] === 'function'){
                    currentAlpha = thisSprite.currentPosition[3]();
                    } else if (typeof thisSprite.currentPosition[3] !== 'undefined'){
                    currentAlpha = thisSprite.currentPosition[3];
                    }

                ctx.globalAlpha = currentAlpha;

                ctx.drawImage(imgObj,
                    x, y, this.frameWidth, this.frameHeight,
                    0, 0, this.frameWidth, this.frameHeight
                    );

                ctx.globalAlpha = baseAlpha;

                }


            }

        };

    // Define a utility function for calculating animated sprite position
    gameSprite.getSpritePosition = function(currentGlobalFame, canvasSprite){
        //console.log('getCurrentSpritePosition(currentGlobalFame, canvasSprite)', currentGlobalFame, canvasSprite);

        var thisGameSpeed = thisGame.gameSettings.baseGameSpeed;
        //var thisSpriteSpeed = canvasSprite.frameSpeed * thisGameSpeed;

        //console.log('thisGameSpeed = ', thisGameSpeed);

        //console.log('\t canvasSprite = ', canvasSprite);
        //console.log('-------------');
        //console.log('\t canvasSprite.filePath = ', canvasSprite.filePath);

        // Collect the base position before continuing
        var basePosition = [0, 0, 0, 1];
        if (typeof canvasSprite.basePosition !== 'undefined'){
            basePosition = canvasSprite.basePosition;
            if (typeof basePosition[0] === 'function'){ basePosition[0] = basePosition[0](); }
            if (typeof basePosition[1] === 'function'){ basePosition[1] = basePosition[1](); }
            if (typeof basePosition[2] === 'function'){ basePosition[2] = basePosition[2](); }
            if (typeof basePosition[3] === 'function'){ basePosition[3] = basePosition[3](); }
        }

        // If no animation steps were defined, we can return the base position as-is
        if (typeof canvasSprite.frameAnimationSequence === 'undefined'
            || canvasSprite.frameAnimationSequence.length < 1){
            //console.log('canvasSprite.frameAnimationSequence is undefined or empty');
            return basePosition;
        }
        //console.log('\t canvasSprite.frameAnimationSequence = ', canvasSprite.frameAnimationSequence);

        //console.log('\t currentGlobalFame = ', currentGlobalFame);

        //console.log('\t canvasSprite.globalFrameStart = ', canvasSprite.globalFrameStart);

        /*
        if (currentGlobalFame != canvasSprite.globalFrameStart){
            var currentRelativeFrame = currentGlobalFame - canvasSprite.globalFrameStart;
        } else {
            var currentRelativeFrame = currentGlobalFame;
        }
        */

        var currentRelativeFrame = Math.floor(canvasSprite.currentFrameKey);

        //console.log('\t currentRelativeFrame = ', currentRelativeFrame);

        var totalKeyFrames = canvasSprite.frameSequence.length;
        var totalKeyFrameDuration = totalKeyFrames * thisGame.gameSettings.baseFramesPerSecond; // * thisSpriteSpeed;

        var totalAnimationSteps = canvasSprite.frameAnimationSequence.length;
        var totalAnimationStepFrames = 0;

        var spriteAnimationTimeline = [];
        for (var stepKey = 0; stepKey < totalAnimationSteps; stepKey++){

            var stepData = canvasSprite.frameAnimationSequence[stepKey];
            var stepRange = [];
            var isLastKey = stepKey + 1 >= totalAnimationSteps ? true : false;

            stepRange.push(totalAnimationStepFrames + 1);

            //var requiredAnimationFrames = Math.ceil(stepData.frameDuration * thisSpriteSpeed);
            var requiredAnimationFrames = stepData.frameDuration;
            var newTotalAnimationFrames = totalAnimationStepFrames + requiredAnimationFrames;

            if (isLastKey
                && canvasSprite.frameSequence == true
                && newTotalAnimationFrames != totalKeyFrameDuration){
                var frameDiff = newTotalAnimationFrames - totalKeyFrameDuration;
                newTotalAnimationFrames -= frameDiff;
            }

            totalAnimationStepFrames = newTotalAnimationFrames;

            stepRange.push(totalAnimationStepFrames);
            spriteAnimationTimeline.push(stepRange);

            }

        //console.log('\t totalAnimationStepFrames = ', totalAnimationStepFrames);
        //console.log('\t spriteAnimationTimeline = ', spriteAnimationTimeline);

        var spriteAnimationFrame = (currentRelativeFrame % totalAnimationStepFrames) + 1;
        //console.log('\t spriteAnimationFrame = ', spriteAnimationFrame);

        var spriteAnimationOffset = typeof canvasSprite.basePosition != 'undefined' ? canvasSprite.basePosition : [0, 0, 0, 0];
        if (typeof spriteAnimationOffset[0] !== 'number'){ spriteAnimationOffset[0] = 0; } // x-position
        if (typeof spriteAnimationOffset[1] !== 'number'){ spriteAnimationOffset[1] = 0; } // y-position
        if (typeof spriteAnimationOffset[2] !== 'number'){ spriteAnimationOffset[2] = 1; } // z-index
        if (typeof spriteAnimationOffset[3] !== 'number'){ spriteAnimationOffset[3] = 1; } // opacity
        //console.log('\t canvasSprite.basePosition = ', canvasSprite.basePosition);
        //console.log('\t spriteAnimationOffset = ', spriteAnimationOffset);

        var currentSpritePosition = [0, 0, 0, 1];
        var stepKey;
        for (stepKey = 0; stepKey < spriteAnimationTimeline.length; stepKey++){
            var stepData = canvasSprite.frameAnimationSequence[stepKey];
            var stepRange = spriteAnimationTimeline[stepKey];
            //console.log('\t stepKey = ', stepKey);
            //console.log('\t stepData = ', stepData);
            //console.log('\t stepRange = ', stepRange);
            if (spriteAnimationFrame >= stepRange[0] && spriteAnimationFrame <= stepRange[1]){

                //console.log('-------------');

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

                if (typeof stepData.startPosition[0] !== 'number'){ stepData.startPosition[0] = 0; }
                if (typeof stepData.startPosition[1] !== 'number'){ stepData.startPosition[1] = 0; }
                if (typeof stepData.startPosition[2] !== 'number'){ stepData.startPosition[2] = 0; }
                if (typeof stepData.startPosition[3] !== 'number'){ stepData.startPosition[3] = spriteAnimationOffset[3]; }

                if (typeof stepData.endPosition[0] !== 'number'){ stepData.endPosition[0] = 0; }
                if (typeof stepData.endPosition[1] !== 'number'){ stepData.endPosition[1] = 0; }
                if (typeof stepData.endPosition[2] !== 'number'){ stepData.endPosition[2] = 0; }
                if (typeof stepData.endPosition[3] !== 'number'){ stepData.endPosition[3] = spriteAnimationOffset[3]; }

                //console.log('\t stepData.startPosition = ', stepData.startPosition);
                //console.log('\t stepData.endPosition = ', stepData.endPosition);

                var xStart = stepData.startPosition[0];
                var xEnd = stepData.endPosition[0];
                if (typeof canvasSprite.frameDirection !== 'undefined'
                    && canvasSprite.frameDirection == 'left'){
                    xStart = xStart * -1;
                    xEnd = xEnd * -1;
                    }
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

                var zStart = stepData.startPosition[2];
                var zEnd = stepData.endPosition[2];
                var zDiff = zStart - zEnd;
                var zProg = Math.ceil(zDiff * stepProgressMultiplier) * -1;
                var zOffset = typeof spriteAnimationOffset[2] === 'function' ? spriteAnimationOffset[2]() : spriteAnimationOffset[2];
                var currentZ = zOffset + zStart + zProg;

                //console.log('\t zStart = ', zStart);
                //console.log('\t zEnd = ', zEnd);
                //console.log('\t zDiff = ', zDiff);
                //console.log('\t zProg = ', zProg);
                //console.log('\t zOffset = ', zOffset);
                //console.log('\t currentZ = ', currentZ);

                var opacityStart = stepData.startPosition[3];
                var opacityEnd = stepData.endPosition[3];
                var opacityDiff = opacityStart - opacityEnd;
                var opacityProg = (opacityDiff * stepProgressMultiplier) * -1;
                var opacityOffset = typeof spriteAnimationOffset[3] === 'function' ? spriteAnimationOffset[3]() : spriteAnimationOffset[3];
                //var currentOpacity = opacityOffset + opacityStart + opacityProg;
                var currentOpacity = opacityStart + opacityProg;

                //console.log('\t opacityStart = ', opacityStart);
                //console.log('\t opacityEnd = ', opacityEnd);
                //console.log('\t opacityDiff = ', opacityDiff);
                //console.log('\t opacityProg = ', opacityProg);
                //console.log('\t opacityOffset = ', opacityOffset);
                //console.log('\t currentOpacity = ', currentOpacity);

                currentSpritePosition = [currentX, currentY, currentZ, currentOpacity];

                //console.log('\t currentSpritePosition = ', currentSpritePosition);

                break;
                }
            }

        return currentSpritePosition;

    }

    window.gameSprite = gameSprite;

})();