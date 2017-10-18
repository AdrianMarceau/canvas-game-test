/*
 * ------------------------
 * CANVAS GAME TEST 2017
 * ------------------------
 * Battle Field Index
 * ------------------------
 */

(function(){

    // Define the object to use as our field index
    var thisFieldIndex = {};

    // Define the base template to use for all fields
    var fieldTemplate = {
        objectPath: 'objects/fields/default/',
        fieldName: 'Battle Field',
        fieldBackground: {
            fileName: 'background.png',
            basePosition: [-80, 0, 10],
            currentPosition: [0, 0, 10],
            baseOpacity: 1,
            currentOpacity: 1,
            panelOffsetX: 0,
            panelOffsetY: 0,
            frameSpeed: 1,
            frameLayout: 'vertical',
            frameSequence: [],
            frameAnimationSequence: [],
            frameSync: false
            },
        fieldForeground: {
            fileName: 'foreground.png',
            basePosition: [-80, 0, 20],
            currentPosition: [0, 0, 20],
            baseOpacity: 1,
            currentOpacity: 1,
            panelOffsetX: 0,
            panelOffsetY: 0,
            frameSpeed: 1,
            frameLayout: 'vertical',
            frameSequence: [],
            frameAnimationSequence: [],
            frameSync: false
            }
        };

    // Define a function for adding a new field to the index
    function indexField(fieldInfo){

        // Return false on invalid args
        if (typeof fieldInfo === 'undefined'){ return false; }
        if (typeof fieldInfo.fieldToken === 'undefined'){ return false; }

        // Collect the object path
        var objectPath = fieldInfo.objectPath;

        // Collect the field token
        var fieldToken = fieldInfo.fieldToken;

        // Collect or define the fieldname
        var fieldName = fieldInfo.fieldName || fieldTemplate.fieldName;

        // Collect or define field background properties
        var fieldBackground = {};
        fieldBackground.objectPath = objectPath;
        fieldBackground.fileName = 'background.png';
        $.extend(true, fieldBackground, fieldTemplate.fieldBackground);
        if (typeof fieldInfo.fieldBackground !== 'undefined'){
            $.extend(true, fieldBackground, fieldInfo.fieldBackground);
        }
        fieldBackground.filePath = fieldBackground.objectPath + fieldBackground.fileName;

        // Collect or define field foreground properties
        var fieldForeground = {};
        fieldForeground.objectPath = objectPath;
        fieldForeground.fileName = 'foreground.png';
        $.extend(true, fieldForeground, fieldTemplate.fieldForeground);
        if (typeof fieldInfo.fieldForeground !== 'undefined'){
            $.extend(true, fieldForeground, fieldInfo.fieldForeground);
        }
        fieldForeground.filePath = fieldForeground.objectPath + fieldForeground.fileName;

        // Add new field data to the global index
        thisFieldIndex[fieldToken] = {
            objectPath: objectPath,
            fieldToken: fieldToken,
            fieldName: fieldName,
            fieldBackground: fieldBackground,
            fieldForeground: fieldForeground
            };

        // Return return on success
        return true;
    }

    // Define a function for updating field properites in the index
    function setField(fieldToken, fieldInfo){
        if (typeof fieldToken !== 'string'){ return false; }
        if (typeof fieldInfo === 'undefined'){ return false; }
        if (typeof thisFieldIndex[fieldToken] === 'undefined'){ thisFieldIndex[fieldToken] = fieldInfo; }
        for (var fieldProp in fieldInfo){ thisFieldIndex[fieldToken][fieldProp] = fieldInfo[fieldProp]; }
        return true;
    }

    // Define a fuction for collecting a copy of a field from the index
    function getField(fieldToken){
        if (typeof fieldToken !== 'string'){ return false; }
        if (typeof thisFieldIndex[fieldToken] === 'undefined'){ return false; }
        var fieldInfo = $.extend(true, {}, thisFieldIndex[fieldToken]);
        return fieldInfo;
    }


    // -- PUBLIC API -- //

    window.battleFieldIndex = {
        indexField: indexField,
        setField: setField,
        getField: getField
        };

})();