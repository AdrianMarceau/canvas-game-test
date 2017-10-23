/*
 * ------------------------
 * CANVAS GAME TEST 2017
 * ------------------------
 * Robot Index
 * ------------------------
 */

(function(){

    // Define the object to use as our robot index
    var thisRobotIndex = {};

    // Define the base template to use for all robots
    var robotTemplate = {
        objectPath: 'objects/robots/default/',
        robotToken: 'default',
        robotName: 'Default Robot',
        robotPosition: 'B2',
        robotMug: {
            filePath: 'images/robots/default/mug_{dir}_{size}.png',
            basePosition: [0, 0, 1000, 1],
            currentPosition: [0, 0, 1000, 1],
            baseOpacity: 1,
            currentOpacity: 1,
            frameLayout: 'horizontal',
            frameSize: 80,
            frameSpeed: 1,
            frameDirection: '',
            frameSequence: [0],
            frameAnimationSequence: [],
            frameSync: false
            },
        robotSprite: {
            filePath: 'images/robots/default/{kind}_{dir}_{size}.png',
            basePosition: [0, 0, 100, 1],
            currentPosition: [0, 0, 100, 1],
            baseOpacity: 1,
            currentOpacity: 1,
            frameLayout: 'horizontal',
            frameSize: 80,
            frameSpeed: 1,
            frameDirection: '',
            frameSequence: [0],
            frameAnimationSequence: [],
            frameSync: false
            }
        };

    // Define a function for adding a new robot to the index
    function indexRobot(robotInfo){
        //console.log('canvasGameEngine.indexRobot(robotInfo)', robotInfo);

        // Return false on invalid args
        if (typeof robotInfo === 'undefined'){ return false; }
        if (typeof robotInfo.robotToken === 'undefined'){ return false; }

        // Collect the object path
        var objectPath = robotInfo.objectPath;

        // Collect the robot token
        var robotToken = robotInfo.robotToken;

        // Collect or define the robotname
        var robotName = robotInfo.robotName || robotTemplate.robotName;

        // Collect or define robot mug properties
        var robotMug = {};
        robotMug.objectPath = objectPath;
        robotMug.fileName = 'mug.png';
        $.extend(true, robotMug, robotTemplate.robotMug);
        if (typeof robotInfo.robotMug !== 'undefined'){
            $.extend(true, robotMug, robotInfo.robotMug);
        }
        robotMug.filePath = robotMug.objectPath + robotMug.fileName;

        // Collect or define robot sprite properties
        var robotSprite = {};
        robotSprite.objectPath = objectPath;
        robotSprite.fileName = 'sprite.png';
        $.extend(true, robotSprite, robotTemplate.robotSprite);
        if (typeof robotInfo.robotSprite !== 'undefined'){
            $.extend(true, robotSprite, robotInfo.robotSprite);
        }
        robotSprite.filePath = robotSprite.objectPath + robotSprite.fileName;

        // Add new robot data to the global index
        thisRobotIndex[robotToken] = {
            objectPath: objectPath,
            robotToken: robotToken,
            robotName: robotName,
            robotMug: robotMug,
            robotSprite: robotSprite
            };

        // Return return on success
        return true;
    }

    // Define a function for updating robot properites in the index
    function setRobot(robotToken, robotInfo){
        if (typeof robotToken !== 'string'){ return false; }
        if (typeof robotInfo === 'undefined'){ return false; }
        if (typeof thisRobotIndex[robotToken] === 'undefined'){ thisRobotIndex[robotToken] = robotInfo; }
        for (var robotProp in robotInfo){ thisRobotIndex[robotToken][robotProp] = robotInfo[robotProp]; }
        return true;
    }

    // Define a fuction for collecting a copy of a robot from the index
    function getRobot(robotToken){
        if (typeof robotToken !== 'string'){ return false; }
        if (typeof thisRobotIndex[robotToken] === 'undefined'){ return false; }
        var robotInfo = $.extend(true, {}, thisRobotIndex[robotToken]);
        return robotInfo;
    }


    // -- PUBLIC API -- //

    window.battleRobotIndex = {
        indexRobot: indexRobot,
        setRobot: setRobot,
        getRobot: getRobot
        };

})();