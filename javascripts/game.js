var fps = 15;
var loaded = false;

setInterval(mainLoop,1000/fps);
var mainTimer = 0;
var xOff = 0;
var xMod = 0;
var randOff = 1;
var gameSpeed = 1;
var fancyMode = true;

var lastPageX = 0;
var lastPageY = 0;

var timeOfDay = 0;
var dayLight = 0;
var sunColor = {r:252,g:229,b:112};
var moonColor = {r:145,g:163,b:176};
var skyLight = {r:0,g:0,b:0};
var sunlight = {r:0,g:0,b:0};

function mainLoop() {
    perlinCount = 0;
    let win = window,
        doc = document,
        docElem = doc.documentElement,
        body = doc.getElementsByTagName('body')[0],
        x = win.innerWidth || docElem.clientWidth || body.clientWidth,
        y = win.innerHeight || docElem.clientHeight || body.clientHeight;
    if ((lastPageX !== 0 && lastPageX !== x) || (lastPageY !== 0 && lastPageY !== y)) {
        scaleWindow();
    }
    /*
    if (bigSide === 'y') {
        if (x < canX*scaleFactor || x > canX*scaleFactor) {
            scaleWindow();
        }
    }
    else {
        if (Math.floor(y/scaleFactor) < canY || Math.floor(y/scaleFactor) > canY) {
            scaleWindow();
        }
    }*/

    if (fancyMode) {
        fps = 15;
        fogLayerAmt = 3;
    }
    else {
        fps = 15;
        fogLayerAmt = 1;
    }
    clearCanvas('black');



    if (scrubMode) {
        if ((pressedRight || map[68] || map[39]) && !(pressedLeft || map[65] || map[37])) {
            mainTimer += gameSpeed/fps*3;
        }
        else if (!(pressedRight || map[68] || map[39]) && (pressedLeft || map[65] || map[37])) {
            mainTimer -= gameSpeed/fps*3;
        }
    }
    else {
        mainTimer += gameSpeed/fps;
    }
    xOff = 0 - mainTimer * 10;
    xMod = absMod(xOff,256);
    randOff = ImprovedNoise.noise(mainTimer/20,noiseSeed,34.87)/20;
    timeOfDay = absMod(mainTimer/300+(noiseSeed/10000),1);
    dayLight = limSin(((timeOfDay+0.5)%1)*Math.PI*2);
    if (timeOfDay > 0.45 && timeOfDay < 0.55) {
        //skyLight.r = Math.floor(lerp(0,200,limSin((((timeOfDay+0.95)%1)/0.2)*Math.PI*2)));
        skyLight.r = Math.floor(lerp(0,250,remap(0.45,0.65,0,1,timeOfDay)));
    }
    else if (timeOfDay > 0.55 && timeOfDay < 0.65) {
        skyLight.r = Math.floor(lerp(0,250,remap(0.65,0.45,0,1,timeOfDay)));
    }
    else {
        skyLight.r = 0;
    }
    skyLight.g = Math.floor(lerp(0,100,dayLight));
    skyLight.b = Math.floor(lerp(30,200,dayLight));

    updateFrontWeather();
    drawSky();
    //drawRiver();
    drawBoat();
    drawFrontFog();
    //drawBackLayer();

    lastPageX = x;
    lastPageY = y;

    console.log(perlinCount)
}
