
// DEFAULT FIELD
battleFieldIndex.indexField({
    fieldToken: 'default',
    fieldName: 'Default Field',
    fieldBackground: {
        filePath: 'images/fields/default/background.png',
        basePosition: [-80, 0],
        frameSpeed: 1,
        frameLayout: 'vertical',
        frameAnimationSequence: [{
            // pan right
            startPosition: [+80, 0],
            endPosition: [-80, 0],
            frameDuration: 1200
            }, {
            // pan left
            startPosition: [-80, 0],
            endPosition: [+80, 0],
            frameDuration: 1200
            }]
        },
    fieldForeground: {
        filePath: 'images/fields/default/foreground.png',
        basePosition: [-80, 2],
        panelOffsetY: 0,
        frameSpeed: 1,
        frameLayout: 'vertical',
        frameAnimationSequence: [{
            // pan down
            startPosition: [0, -2],
            endPosition: [0, +2],
            frameDuration: 480
            }, {
            // pan down
            startPosition: [0, +2],
            endPosition: [0, -2],
            frameDuration: 480
            },]
        }
    });
