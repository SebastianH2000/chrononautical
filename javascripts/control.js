//dynamically scale the game window
var scaleFactor = 1;
var bigSide = 1;
var sideOffset = 1;
var canObj = {};

var noiseSeed = Math.floor(Math.random()*1000000);
//var noiseSeed = 69420;
//var noiseSeed = 496677;

while (noiseSeed < 100000) {
    noiseSeed *= 10;
}

function scaleWindow() {
    console.log('scaled')
    document.body.style.transform = "scale(1)";
    let win = window,
        doc = document,
        docElem = doc.documentElement,
        body = doc.getElementsByTagName('body')[0],
        x = win.innerWidth || docElem.clientWidth || body.clientWidth,
        y = win.innerHeight || docElem.clientHeight || body.clientHeight;
    document.body.style.transform = "scale(" + Math.min(x / canX, y / canY) + ")";
    document.body.style.height = y + "px";
    scaleFactor = Math.min(x / canX, y / canY);

    /*if (x/canX < y/canY) {
      document.body.style.margin = (((y - (canY*scaleFactor))/2) + "px 0px 0px 0px");
    }
    else {
      document.body.style.margin = (((y - (canY*scaleFactor))/2) + "px 0px 0px 0px");
    }*/
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(can.width / 2, can.height / 2);
    ctx.scale(1 * screenScale, 1 * screenScale);
    canObj = can.getBoundingClientRect();
    if (x / canX > y / canY) {
        bigSide = 'x';
        //sideOffset = ((x*scaleFactor) - canX * scaleFactor)*scaleFactor;
        sideOffset = canObj.left/scaleFactor;
        //sideOffset = x-((canX/2)*scaleFactor);
        //sideOffset = 178;
    }
    else {
        bigSide = 'y';
        //sideOffset = y-(canY*scaleFactor);
        sideOffset = canObj.top/scaleFactor;
    }
}
window.onload = function () {
    scaleWindow();
}



//mouse functions
var mouseRIsDown = false;
var mouseLIsDown = false;
var scrubMode = false;
var pressedLeft = false;
var pressedRight = false;

function mouseDown(val) {
    if (mouseY < 0) {
        scrubMode = !scrubMode;
    }
    if (mouseX < -480) {
        pressedLeft = true;
    }
    else if (mouseX > 480) {
        pressedRight = true;
    }
    if (val === 0) {
        mouseLIsDown = true;
    }
    else if (val === 2) {
        mouseRIsDown = true;
    }
}

function mouseUp(val) {
    if (val === 0) {
        mouseLIsDown = false;
    }
    else if (val === 2) {
        mouseRIsDown = false;
    }
    pressedLeft = false;
    pressedRight = false;
}

var mouseX = 0;
var mouseY = 0;

(function () {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        }

        if (bigSide === 'x') {
            mouseX = (event.pageX / screenScale) / scaleFactor - ((canX / 2)/screenScale) - (sideOffset/screenScale);
            mouseY = (event.pageY / screenScale) / scaleFactor - ((canY / 2)/screenScale);
            /*mouseX = (event.pageX * screenScale) / scaleFactor - (canX / 2) - sideOffset;
            mouseY = (event.pageY * screenScale) / scaleFactor - (canY / 2);*/
        }
        else {
            mouseX = (event.pageX / screenScale) / scaleFactor - ((canX / 2)/screenScale);
            mouseY = (event.pageY / screenScale) / scaleFactor - ((canY / 2)/screenScale) - (sideOffset/screenScale);
            /*mouseX = (event.pageX / screenScale) / scaleFactor - (canX / 2);
            mouseY = ((event.pageY / screenScale) / scaleFactor - (canY / 2)) - sideOffset;*/
        }
    }
})();



//bijective functions
function toBijective(x) {
    if (x > 0) {
        return x * 2 - 1;
    }
    else {
        return Math.abs(x) * 2;
    }
}

function fromBijective(x) {
    if (x % 2 === 1) {
        return (x + 1) / 2;
    }
    else {
        return x / -2;
    }
}

function absMod(n, m) {
    return ((n % m) + m) % m;
}

function limSin (value) {
    return Math.sin(value)/2+0.5;
}

function limCos (value) {
    return Math.cos(value)/2+0.5;
}

function limit (value, start, end) {
    return Math.min(Math.max(value,start),end);
}

padNum = function(value, n) {
    return new Array(n).join('0').slice((n || 2) * -1) + value;
}

var map = {}; // You could also use an array
//wsad
map[87] = false;
map[83] = false;
map[65] = false;
map[68] = false;

//^v<>
map[38] = false;
map[40] = false;
map[37] = false;
map[39] = false;

map[32] = false;

onkeydown = onkeyup = function (e) {
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    /* insert conditional here */
}

function getHeightMap(xCoord,yOffset) {
    let heightMap = 0;
    let octaveAmt = 5;
    let yOff = 0;
    if (yOffset !== undefined) yOff = yOffset;
    for (let a = 1; a <= octaveAmt; a++) {
        //heightMap += Math.abs(ImprovedNoise.noise(xCoord / (150.576 / octaveAmt), octaveAmt * 5, octaveAmt * noiseSeed + yOff)) * (60 / (octaveAmt * 2)) - (10 / (octaveAmt * 2));
        heightMap += Math.abs(ImprovedNoise.noise(xCoord / (150.576 / a), a * 5, a * noiseSeed + yOff)) * (60 / (a ** 2)) - (10 / (a ** 2));
    }
    heightMap += Math.abs(ImprovedNoise.noise(xCoord / 2000, 3700.6 + (yOff/10000), noiseSeed)) * (600) - 100;
    //heightMap += Math.abs(ImprovedNoise.noise(xCoord / 2000, 3700.6, noiseSeed)) * (600) - (100);
    return heightMap;
}
