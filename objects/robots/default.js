
// DEFAULT ROBOT
robotIndex.indexRobot({
    robotToken: 'default',
    robotName: 'Default Robot',
    robotMug: {
        filePath: 'images/robots/default/mug_{dir}_{size}.png'
        },
    robotSprite: {
        filePath: 'images/robots/default/{kind}_{dir}_{size}.png',
        frameSpeed: 1,
        frameSequence: [0, 1, 2, 1]
        }
    });
