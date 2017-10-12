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
        robotToken: 'default',
        robotName: 'Default Robot',
        robotPosition: 'B2',
        robotMug: {
            filePath: 'images/robots/default/mug_{dir}_{size}.png',
            basePosition: [0, 0, 1000],
            currentPosition: [0, 1000],
            frameLayout: 'horizontal',
            frameSize: 80,
            frameSpeed: 1,
            frameSequence: [0],
            animationSteps: []
            },
        robotSprite: {
            filePath: 'images/robots/default/{kind}_{dir}_{size}.png',
            basePosition: [0, 0, 100],
            currentPosition: [0, 0, 100],
            frameLayout: 'horizontal',
            frameSize: 80,
            frameSpeed: 1,
            frameSequence: [0, 1, 2, 1],
            animationSteps: []
            }
        };

    // Define a function for adding a new robot to the index
    function indexRobot(robotInfo){

        // Return false on invalid args
        if (typeof robotInfo === 'undefined'){ return false; }
        if (typeof robotInfo.robotToken === 'undefined'){ return false; }

        // Collect the robot token
        var robotToken = robotInfo.robotToken;

        // Collect or define the robotname
        var robotName = robotInfo.robotName || robotTemplate.robotName;

        // Collect or define robot mug properties
        var robotMug = {};
        $.extend(true, robotMug, robotTemplate.robotMug);
        if (typeof robotInfo.robotMug !== 'undefined'){
            $.extend(true, robotMug, robotInfo.robotMug);
        }

        // Collect or define robot sprite properties
        var robotSprite = {};
        $.extend(true, robotSprite, robotTemplate.robotSprite);
        if (typeof robotInfo.robotSprite !== 'undefined'){
            $.extend(true, robotSprite, robotInfo.robotSprite);
        }

        // Add new robot data to the global index
        thisRobotIndex[robotToken] = {
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

    window.robotIndex = {
        indexRobot: indexRobot,
        setRobot: setRobot,
        getRobot: getRobot
        };

})();