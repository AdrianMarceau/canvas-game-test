
// DEFAULT FIELD
battleFieldIndex.indexField({
    fieldToken: 'default',
    fieldName: 'Default Field',
    fieldBackground: {
        fileName: 'images/fields/default/background.png',
        basePosition: [-80, 0],
        frameSpeed: 1,
        frameLayout: 'vertical',
        animationSteps: [{
            // pan right
            startPosition: [+80, 0],
            endPosition: [-80, 0],
            frameDuration: 2400
            }, {
            // pan left
            startPosition: [-80, 0],
            endPosition: [+80, 0],
            frameDuration: 2400
            }]
        },
    fieldForeground: {
        filePath: 'images/fields/default/foreground.png',
        basePosition: [-80, 0],
        panelOffsetY: 8,
        frameSpeed: 5,
        frameLayout: 'vertical',
        animationSteps: [{
            // pan down
            startPosition: [0, -1],
            endPosition: [0, +1],
            frameDuration: 480
            }, {
            // pan down
            startPosition: [0, +1],
            endPosition: [0, -1],
            frameDuration: 480
            },]
        }
    });
