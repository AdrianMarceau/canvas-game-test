

// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
if (typeof window.requestAnimationFrame === 'undefined'
    && typeof window.webkitRequestAnimationFrame === 'undefined'
    && typeof window.mozRequestAnimationFrame === 'undefined'
    && typeof window.oRequestAnimationFrame === 'undefined'
    && typeof window.msRequestAnimationFrame === 'undefined'){
    window.requestAnimationFrame = (function(){
        return window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback){
                window.setTimeout(callback, 1000 / 60);
                };
        })();
}

