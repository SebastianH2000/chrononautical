newCanvas('boatCan','canvasStorage',256,256);

var boatCan = document.getElementById('boatCan');
var boatCtx = boatCan.getContext('2d');

var lightsOn = false;
var boatLanternColor = {r:0,g:0,b:0};

var boatStyle = 0;
if (String(noiseSeed)[0] < 8) {
    boatStyle = 'basic';
}
else {
    boatStyle = 'fancy'
}

boatStyle = 'basic'

function drawBoat() {
    boatCtx.clearRect(0,0,256,256);
    if (boatStyle === 'basic') {
        //boatCtx.fillStyle = 'brown';
        //boatCtx.fillRect(0,0,50,50)

        //above water, background
        boatCtx.fillStyle = rgbToHex(57,17,0);
        boatCtx.fillRect(120,87,80,13);

        let boatColorInc = 4;
        //above water, foreground
        boatCtx.fillStyle = rgbToHex((107*boatColorInc + skyLight.r)/(boatColorInc+1), (28*boatColorInc + skyLight.g)/(boatColorInc+1), skyLight.b/(boatColorInc+1));
        boatCtx.fillRect(100,100,120,16);
        boatCtx.fillRect(100,90,20,10);
        boatCtx.fillRect(200,90,30,10);

        //draw lantern post
        boatCtx.fillStyle = rgbToHex((57*boatColorInc + skyLight.r)/(boatColorInc+1), (17*boatColorInc + skyLight.g)/(boatColorInc+1), skyLight.b/(boatColorInc+1));
        boatCtx.fillRect(180,70,10,30);

        //draw lantern flame
        let fireLerpAmt = ImprovedNoise.noise(mainTimer,noiseSeed/5720.43,95.3)/2+0.5;
        if (timeOfDay > 0.85 || timeOfDay < 0.6) {
            boatLanternColor.r = lerp(150,200,fireLerpAmt);
            boatLanternColor.g = lerp(0,150,fireLerpAmt);
        }
        else {
            boatLanternColor.r = 0;
            boatLanternColor.g = 0;
        }
        boatCtx.fillStyle = rgbToHex(boatLanternColor.r,boatLanternColor.g,0);
        boatCtx.fillRect(182.5,65,5,5);
        if (fancyMode) {
            boatCtx.globalAlpha = limit(1-dayLight-0.25,0,1)/4;
            drawCircle(185,67.5,20,boatCtx);
            drawCircle(185,67.5,30,boatCtx);
            drawCircle(185,67.5,40,boatCtx);
            boatCtx.globalAlpha = 1;
        }

        boatColorInc = 2;
        boatCtx.fillStyle = rgbToHex((107*boatColorInc + riverColor.r)/(boatColorInc+1), (28*boatColorInc + riverColor.g)/(boatColorInc+1), riverColor.b/(boatColorInc+1));
        boatCtx.fillRect(120,112,60,8);
    }
    else if (boatStyle === 'fancy') {
        boatCtx.fillStyle = 'red';
        boatCtx.fillRect(0,0,50,50);
    }

    ctx.drawImage(boatCan,-128,canY/2-350-Math.floor(ImprovedNoise.noise(mainTimer,noiseSeed,10.7)*8));
}