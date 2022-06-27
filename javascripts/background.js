newCanvas('riverCan','canvasStorage',1920,1080);
var riverCan = document.getElementById('riverCan');
var riverCtx = riverCan.getContext('2d');

newCanvas('skyCan','canvasStorage',1920,680);
var skyCan = document.getElementById('skyCan');
var skyCtx = skyCan.getContext('2d');

newCanvas('backCan','canvasStorage',1920,500);
var backCan = document.getElementById('backCan');
var backCtx = backCan.getContext('2d');

var riverChangeAmt = 0;

var riverColor = {r:0,g:0,b:0};

function drawRiver() {
    riverCtx.clearRect(0,0,1920,1080);
    riverColor.r = Math.floor(skyLight.r/1.5);
    riverColor.g = Math.floor(lerp(0,30,dayLight)+skyLight.g)/2;
    riverColor.b = Math.floor(lerp(20,150,dayLight)+skyLight.b)/2;
    riverCtx.fillStyle = rgbToHex(riverColor.r,riverColor.g,riverColor.b);
    riverCtx.fillRect(0,680,1920,1080);
    riverChangeAmt++;

    ctx.drawImage(riverCan,0-canX/2,0-canY/2);
    //console.log(xMod)
}

//fog at bottom of screen
newCanvas('frontFogCan','canvasStorage',1920,400);

var frontFogCan = document.getElementById('frontFogCan');
var frontFogCtx = frontFogCan.getContext('2d');
frontFogCtx.globalAlpha = 0.25;
var frontFogColor = 0;

var frontFogCanAmt = 0;
var frontFogCanAmtTarget = 25;
var frontFogDrawAmt = 50;

var frontFogCanArr = new Array(frontFogCanAmtTarget);

var frontFogPixelSize = 4;

var frontFogCanSize = [600,300];

var fogMode = 1;

function drawFrontFog() {
    let w = 3;
    if (frontFogCanAmt < frontFogCanAmtTarget) {
        console.log('drawing')
        for (let i = frontFogCanAmt; i < frontFogCanAmtTarget; i++) {
            //create canvas and context
            newCanvas(('frontFogCan' + i + 1),'canvasStorage',frontFogCanSize[0],frontFogCanSize[1]);
            frontFogCanArr[i] = {
                can: document.getElementById('frontFogCan' + i + 1),
                ctx: document.getElementById('frontFogCan' + i + 1).getContext('2d')
            }

            frontFogCanArr[i].ctx.globalAlpha = 0.25;
            frontFogColor = [0,ImprovedNoise.noise(mainTimer/30,noiseSeed,xOff/100.76)/2+0.5,ImprovedNoise.noise(randOff,noiseSeed,xOff/45.8)/2+0.5];
            //frontFogCtx.fillStyle = rgbToHex(Math.floor(lerp(25,255,frontFogColor)),255,255)
            frontFogCanArr[i].ctx.fillStyle = rgbToHex(60,Math.floor(lerp(0,155,frontFogColor[1])),Math.floor(lerp(120,240,frontFogColor[2])));
            //frontFogCanArr[i].ctx.fillStyle = 'white'


            //draw each fog canvas
            for (let j = 0; j < (frontFogCanSize[0]/frontFogPixelSize); j++) {
                for (let k = 0; k < (frontFogCanSize[0]/frontFogPixelSize); k++) {+50
                    //if (ImprovedNoise.noise(j/100+(xOff*frontWindDir/w)/200+w*30,k/8,mainTimer/(100/w)+w*30+noiseSeed) > 1.3 - j/(150/(w/2+1))) {
                    if (ImprovedNoise.noise(j/100+(xOff*frontWindDir/3)/200,k/8,noiseSeed/3000*i) > Math.sqrt((j*frontFogPixelSize-frontFogCanSize[0]/2) ** 2 + (k*frontFogPixelSize-frontFogCanSize[1]/2) ** 2)/300) {
                        frontFogCanArr[i].ctx.rect(Math.floor(j*frontFogPixelSize),Math.floor(k*frontFogPixelSize),Math.ceil(frontFogPixelSize),Math.ceil(frontFogPixelSize));
                    }
                }
            }
            frontFogCanArr[i].ctx.fill();
        }
        frontFogCanAmt = frontFogCanAmtTarget;
    }
    if (fogMode === 1) {
        let frontFogStretch = 4;
        for (let i = 0; i < frontFogDrawAmt; i++) {
            let frontFogSpacing = ImprovedNoise.noise(noiseSeed/3000*i,mainTimer/40.7,938.3);
            ctx.drawImage(frontFogCanArr[i%frontFogCanAmtTarget].can,(frontFogSpacing)*1920-frontFogCanSize[0]/2,320+Math.sin(frontFogSpacing*frontFogSpacing*Math.PI+i*noiseSeed/10000)*(frontFogSpacing/2+0.5)*40);
        }
        for (let i = 0; i < frontFogDrawAmt/2; i++) {
            let frontFogSpacing = ImprovedNoise.noise(noiseSeed/3000*i,mainTimer/40.7,938.3);
            ctx.drawImage(frontFogCanArr[i%frontFogCanAmtTarget].can,(frontFogSpacing)*(1920+300)-frontFogCanSize[0]/2*frontFogStretch,420+Math.sin(frontFogSpacing*frontFogSpacing*Math.PI+i*noiseSeed/10000)*(frontFogSpacing/2+0.5)*20,frontFogCanSize[0]*frontFogStretch,300);
        }
        ctx.globalAlpha = 1;
    }
    else if (fogMode === 2) {
        let fogLayerAmt = 3;
        let pixelSize = 4;
        var frontFogDensity = limit(((ImprovedNoise.noise(mainTimer/17,noiseSeed,xOff/321)/4+0.1)+humidity-0.5)/2,0,1);
        frontFogCtx.globalAlpha = frontFogDensity;
        frontFogColor = [0,ImprovedNoise.noise(mainTimer/30,noiseSeed,xOff/100.76)/2+0.5,ImprovedNoise.noise(randOff,noiseSeed,xOff/45.8)/2+0.5];
        //frontFogCtx.fillStyle = rgbToHex(Math.floor(lerp(25,255,frontFogColor)),255,255)
        frontFogCtx.fillStyle = rgbToHex(60,Math.floor(lerp(0,155,frontFogColor[1])),Math.floor(lerp(120,240,frontFogColor[2])));
        //frontFogCtx.fillStyle = 'lightgray'
        frontFogCtx.clearRect(0,0,1920,400);
        //frontFogDir = Math.sin(mainTimer/20);
        for (let w = 2; w < fogLayerAmt+2; w++) {
            frontFogCtx.beginPath();
            for (let i = 0; i < 1920/pixelSize; i++) {
                for (let j = 0; j < 400/pixelSize; j++) {
                    if (ImprovedNoise.noise(i/100+(xOff*frontWindDir/w)/200+w*30,j/8,mainTimer/(100/w)+w*30+noiseSeed) > 1.3 - j/(150/(w/2+1))) {
                        frontFogCtx.rect(Math.floor(i*pixelSize),Math.floor(j*pixelSize),Math.ceil(pixelSize),Math.ceil(pixelSize));
                    }
                }
            }
            frontFogCtx.fill();
        }
        ctx.drawImage(frontFogCan,0-canX/2,canY/2-400);
    }
}

/*
var fogLayerAmt = 3;

function drawFrontFog() {
    let pixelSize = 4;
    var frontFogDensity = limit(((ImprovedNoise.noise(mainTimer/17,noiseSeed,xOff/321)/4+0.1)+humidity-0.5)/2,0,1);
    frontFogCtx.globalAlpha = frontFogDensity;
    frontFogColor = [0,ImprovedNoise.noise(mainTimer/30,noiseSeed,xOff/100.76)/2+0.5,ImprovedNoise.noise(randOff,noiseSeed,xOff/45.8)/2+0.5];
    //frontFogCtx.fillStyle = rgbToHex(Math.floor(lerp(25,255,frontFogColor)),255,255)
    frontFogCtx.fillStyle = rgbToHex(60,Math.floor(lerp(0,155,frontFogColor[1])),Math.floor(lerp(120,240,frontFogColor[2])));
    //frontFogCtx.fillStyle = 'lightgray'
    frontFogCtx.clearRect(0,0,1920,400);
    //frontFogDir = Math.sin(mainTimer/20);
    for (let w = 2; w < fogLayerAmt+2; w++) {
        frontFogCtx.beginPath();
        for (let i = 0; i < 1920/pixelSize; i++) {
            for (let j = 0; j < 400/pixelSize; j++) {
                if (ImprovedNoise.noise(i/100+(xOff*frontWindDir/w)/200+w*30,j/8,mainTimer/(100/w)+w*30+noiseSeed) > 1.3 - j/(150/(w/2+1))) {
                    frontFogCtx.rect(Math.floor(i*pixelSize),Math.floor(j*pixelSize),Math.ceil(pixelSize),Math.ceil(pixelSize));
                }
            }
        }
        frontFogCtx.fill();
    }
    ctx.drawImage(frontFogCan,0-canX/2,canY/2-400);
}*/

var starArr = new Array(500);

starArr[0] = {
    xPos: 0.2,
    yPos: 300
}

starArr[1] = {
    xPos: 0.7,
    yPos: 300
}

for (let i = 0; i < starArr.length; i++) {
    starArr[i] = {
        size: ImprovedNoise.noise((noiseSeed/32000)*i,17.22,i)/2+1,
        brightness: ImprovedNoise.noise((noiseSeed/85000)*i,98.63,i)/4+0.75,
        xPos: ImprovedNoise.noise((noiseSeed/91000)*i,1.89,i)*Math.PI*2,
        yPos: (ImprovedNoise.noise((noiseSeed/17000)*i,5.83,i)/2)*680
    }
}

var starOrbitRadius = 6000;

function drawSky() {
    //draw skybox
    skyCtx.fillStyle = rgbToHex(skyLight.r,skyLight.g,skyLight.b);
    skyCtx.fillRect(0,0,1920,680);

    //star variables
    let starSpeed = 0.2;
    let starTime = mainTimer/300+(noiseSeed/10000);
    let heightVariation = 3;

    //draw sun & moon
    /*skyCtx.fillStyle = 'silver'
    if (starArr[0].xPos > 1) {
        starArr[0].xPos = 0;
    }
    let orbitChange = starOrbitRadius+(200);
    drawCircle(Math.floor(limSin((starTime*starSpeed)*Math.PI*2+starArr[0].xPos)*orbitChange-orbitChange/3),Math.floor((0-limCos((starTime*starSpeed)*Math.PI*2+starArr[0].xPos))*orbitChange+(starOrbitRadius+300)),30,skyCtx);
    orbitChange = starOrbitRadius+(200);
    skyCtx.fillStyle = rgbToHex(sunColor.r,sunColor.g,sunColor.b);
    drawCircle(Math.floor(limSin((starTime*starSpeed)*Math.PI*2+starArr[1].xPos)*orbitChange-orbitChange/3),Math.floor((0-limCos((starTime*starSpeed)*Math.PI*2+starArr[1].xPos))*orbitChange+(starOrbitRadius+300)),40,skyCtx);
    */
    if (timeOfDay > 0.5 && timeOfDay < 0.9) {
        skyCtx.fillStyle = rgbToHex(sunColor.r,sunColor.g,sunColor.b);
        drawCircle((timeOfDay-0.5)*2020*2.5-50,300-Math.sin(((timeOfDay+0.5)%1)*Math.PI*2.5)*200,40,skyCtx);
    }
    else if (timeOfDay > 0 && timeOfDay < 0.4) {
        skyCtx.fillStyle = 'silver'
        drawCircle(timeOfDay*2020*2.5-50,300-Math.sin(timeOfDay*Math.PI*2.5)*200,30,skyCtx);
    }

    //draw stars
    skyCtx.globalAlpha = limit(1-dayLight-0.25,0,1);
    for (let i = 0; i < starArr.length; i++) {
        let orbitChange = starOrbitRadius+(heightVariation*starArr[i].yPos);
        skyCtx.fillStyle = rgbToHex(255*starArr[i].brightness,255*starArr[i].brightness,255*starArr[i].brightness);
        //drawCircle(Math.floor(limSin((starTime*starSpeed)*Math.PI*2+starArr[i].xPos)*orbitChange-orbitChange/3),Math.floor((0-limCos((starTime*starSpeed)*Math.PI*2+starArr[i].xPos))*orbitChange+(starOrbitRadius+300)),starArr[i].size*3,skyCtx);
        drawCircle(limSin((starTime*starSpeed)*Math.PI*2+starArr[i].xPos)*orbitChange-orbitChange/3,(0-limCos((starTime*starSpeed)*Math.PI*2+starArr[i].xPos))*orbitChange+(starOrbitRadius+300),starArr[i].size*3,skyCtx);
    }
    skyCtx.globalAlpha = 1;

    ctx.drawImage(skyCan,0-canX/2,0-canY/2);
}

function drawBackLayer() {
    backCtx.clearRect(0,0,1920,500);
    pixelSize = 4;
    backCtx.fillStyle = rgbToHex(20,20,40);
    for (let i = 0; i < 1920/pixelSize; i++) {
        let currentHeight = Math.floor(   ( ( (ImprovedNoise.noise(0-xOff/200+i/60,noiseSeed,75.32) /2+0.1) *100)+(ImprovedNoise.noise(0-xOff/200+i/60,noiseSeed,982.583)*100)+(ImprovedNoise.noise(0-xOff/200+i/60,noiseSeed,noiseSeed/6039)*250))   /4)*4;
        backCtx.fillRect(i*pixelSize,500-currentHeight,pixelSize,currentHeight);
    }
    ctx.drawImage(backCan,0-canX/2,0-canY/2+180);
}
