/*
 * ------------------------
 * CANVAS GAME TEST 2017
 * ------------------------
 * Resource Index Class
 * ------------------------
 */

(function($){

    var parentElement = null;

    var baseHref = '';

    var resourceIndex = {};

    var requestedFileURLs = [];
    var loadedFileURLs = [];

    var globalReadyCallback = function(){};

    // -- SETUP -- //

    function setup(config){
        //console.log('resourceIndex.setup(config)', config);

        if (typeof config.parentElement !== 'undefined'){ parentElement = config.parentElement; }
        if (typeof config.baseHref !== 'undefined'){ baseHref = config.baseHref; }

    }

    function nowLoading(){
        parentElement.addClass('loading');
    }

    function doneLoading(){
        if (typeof doneLoading.timeout !== 'undefined'){ clearTimeout(doneLoading.timeout); }
        else { doneLoading.timeout = null; }
        doneLoading.timeout = setTimeout(function(){
            parentElement.removeClass('loading');
            }, 250);
    }

    // -- GET FILES -- //

    // Define a function for collecting a preloaded file object from the index
    function getFile(fileURL){
        //console.log('resourceIndex.getFile(fileURL)', fileURL);
        //console.log('\t resourceIndex = ', resourceIndex);
        //console.log('\t typeof resourceIndex['+fileURL+'] = ', typeof resourceIndex[fileURL]);
        //console.log('\t fileURL in resourceIndex = ', fileURL in resourceIndex);

        if (typeof fileURL !== 'string'){ return false; }

        if (resourceIndex[fileURL]){  return resourceIndex[fileURL]; }
        else { return false; }

    }

    // -- LOAD FILES -- //

    // Define functions for checking if a file URL is of a certain type
    function isImageURL(fileURL){ return fileURL.match(/\.(jpg|jpeg|bmp|png|gif)$/i); }
    function isScriptURL(fileURL){ return fileURL.match(/\.(js|js\.php)$/i); }

    // Define a function for loading a single file with a callback
    function loadFile(fileURL, onReadyCallback){
        //console.log('resourceIndex.loadFile(fileURL, onReadyCallback)', fileURL);

        if (typeof fileURL !== 'string'){ return false; }
        if (typeof onReadyCallback === 'undefined'){ onReadyCallback = globalReadyCallback; }

        requestedFileURLs.push(fileURL);
        //console.log('\t requestedFileURLs = ', requestedFileURLs);
        //console.log('\t loadedFileURLs = ', loadedFileURLs);

        nowLoading();
        if (isImageURL(fileURL)){ loadImageFile(fileURL, onReadyCallback); }
        else if (isScriptURL(fileURL)){ loadScriptFile(fileURL, onReadyCallback); }
        else { return false; }

    }

    // Define a function for loading an array of files with a single callback
    function loadFiles(fileURLs, onReadyCallback){
        //console.log('resourceIndex.loadFiles(fileURLs, onReadyCallback)', fileURLs);

        if (!(fileURLs instanceof Array)){ return false; }
        if (typeof onReadyCallback === 'undefined'){ onReadyCallback = globalReadyCallback; }

        for (i in fileURLs){ requestedFileURLs.push(fileURLs[i]); }
        //console.log('\t requestedFileURLs = ', requestedFileURLs);
        //console.log('\t loadedFileURLs = ', loadedFileURLs);

        nowLoading();
        if (isImageURL(fileURLs[0])){ loadImageFiles(fileURLs, onReadyCallback); }
        else if (isScriptURL(fileURLs[0])){ loadScriptFiles(fileURLs, onReadyCallback); }
        else { return false; }

    }

    // -- LOAD IMAGES  -- //

    // Define a function for loading a single image with a callback
    function loadImageFile(fileURL, onReadyCallback){
        //console.log('resourceIndex.loadImageFile(fileURL, onReadyCallback)', fileURL);

        if (typeof fileURL !== 'string'){ return false; }
        if (typeof onReadyCallback === 'undefined'){ onReadyCallback = globalReadyCallback; }

        var imageFile = new Image();
        imageFile.onload = function(){
            var fileURL = this.src.replace(baseHref, '');
            loadedFileURLs.push(fileURL);
            //console.log('\t loadedFileURLs.push('+fileURL+');');
            resourceIndex[fileURL] = this;
            if (isReady(fileURL)){
                onReadyCallback();
                doneLoading();
                }
            };

        //resourceIndex[fileURL] = false;
        imageFile.src = fileURL;

    }

    // Define a function for loading an array of image files with a single callback
    function loadImageFiles(fileURLs, onReadyCallback){
        //console.log('resourceIndex.loadImageFiles(fileURLs, onReadyCallback)', fileURLs);

        if (!(fileURLs instanceof Array)){ return false; }
        if (typeof onReadyCallback === 'undefined'){ onReadyCallback = globalReadyCallback; }

        var imageFiles = [];

        for (i in fileURLs){

            var fileURL = fileURLs[i];

            var imageFile = new Image();
            imageFile.onload = function(){
                var fileURL = this.src.replace(baseHref, '');
                loadedFileURLs.push(fileURL);
                //console.log('\t loadedFileURLs.push("'+fileURL+'");');
                resourceIndex[fileURL] = this;
                if (isReady(fileURLs)){
                    onReadyCallback();
                    doneLoading();
                    }
                };

            //resourceIndex[fileURL] = false;
            imageFiles.push(imageFile);

            }

        for (i in fileURLs){

            var fileURL = fileURLs[i];
            var imageFile = imageFiles[i];

            imageFile.src = fileURL;

            }

    }


    // -- LOAD SCRIPTS  -- //

    // Define a function for loading a single script with a callback
    function loadScriptFile(fileURL, onReadyCallback, useAsync){
        //console.log('resourceIndex.loadScriptFile(fileURL, onReadyCallback)', fileURL);

        if (typeof fileURL !== 'string'){ return false; }
        if (typeof onReadyCallback === 'undefined'){ onReadyCallback = globalReadyCallback; }

        var scriptHead = document.getElementsByTagName('head')[0];

        var scriptFile = document.createElement('script');
        scriptFile.type = 'text/javascript';
        scriptFile.async = typeof useAsync === 'boolean' ? useAsync : true;
        scriptFile.addEventListener('load', function(e){
            //self.loaded(e);
            var fileURL = this.src.replace(baseHref, '');
            loadedFileURLs.push(fileURL);
            //console.log('\t loadedFileURLs.push('+fileURL+');');
            resourceIndex[fileURL] = this;
            if (isReady(fileURL)){
                onReadyCallback();
                doneLoading();
                }
            }, false);

        scriptFile.src = fileURL;
        scriptHead.appendChild(scriptFile);

    }

    // Define a function for loading an array of script files with a single callback
    function loadScriptFiles(fileURLs, onReadyCallback, useAsync){
        //console.log('resourceIndex.loadScriptFiles(fileURLs, onReadyCallback)', fileURLs);

        if (!(fileURLs instanceof Array)){ return false; }
        if (typeof onReadyCallback === 'undefined'){ onReadyCallback = globalReadyCallback; }

        var scriptHead = document.getElementsByTagName('head')[0];
        var scriptFiles = [];

        for (i in fileURLs){

            var fileURL = fileURLs[i];

            var scriptFile = document.createElement('script');
            scriptFile.type = 'text/javascript';
            scriptFile.async = typeof useAsync === 'boolean' ? useAsync : true;
            scriptFile.addEventListener('load', function(e){
                //self.loaded(e);
                var fileURL = this.src.replace(baseHref, '');
                loadedFileURLs.push(fileURL);
                //console.log('\t loadedFileURLs.push('+fileURL+');');
                resourceIndex[fileURL] = this;
                if (isReady(fileURLs)){
                    onReadyCallback();
                    doneLoading();
                    }
                }, false);

            //resourceIndex[fileURL] = false;
            scriptFiles.push(scriptFile);

            }

        for (i in fileURLs){

            var fileURL = fileURLs[i];
            var scriptFile = scriptFiles[i];

            scriptFile.src = fileURL;
            scriptHead.appendChild(scriptFile);

            }

    }


    // -- ON READY  -- //

    // Define a function for checking if given URLs are loaded and ready
    function isReady(fileURLs){
        //console.log('resourceIndex.isReady(fileURLs)', fileURLs);

        if (typeof fileURLs === 'undefined'){ fileURLs = requestedFileURLs; }
        else if (typeof fileURLs === 'string'){ fileURLs = [fileURLs]; }
        else if (!(fileURLs instanceof Array)){ return false; }

        //console.log('\t loadedFileURLs = ', loadedFileURLs);

        var isReady = true;

        for (i in fileURLs){
            var fileURL = fileURLs[i].replace(baseHref, '');
            //console.log('\t loadedFileURLs.indexOf('+fileURL+') = ', loadedFileURLs.indexOf(fileURL));
            if (loadedFileURLs.indexOf(fileURL) === -1){
                isReady = false;
                break;
            }
        }

        //console.log('\t isReady = ', isReady);
        return isReady;

    }

    // Define a function for setting the global on-ready function to something custom
    function onReady(onReadyCallback){
        //console.log('resourceIndex.onReady(onReadyCallback)');

        if (typeof onReadyCallback === 'undefined'){ return false; }

        globalReadyCallback = onReadyCallback;

        if (isReady()){
            globalReadyCallback();
            doneLoading();
            }

    }


    // -- PUBLIC API -- //

    window.resourceIndex = {
        setup: setup,
        getFile: getFile,
        loadFile: loadFile,
        loadFiles: loadFiles,
        loadImageFile: loadImageFile,
        loadImageFiles: loadImageFiles,
        loadScriptFile: loadScriptFile,
        loadScriptFiles: loadScriptFiles,
        isReady: isReady,
        onReady: onReady
        };

})(jQuery);