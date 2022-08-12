var frontWindDir = 1;
var frontWindSpeed = 1;
var frontHumidity = 0.25;

function updateFrontWeather() {
    frontHumidity = ImprovedNoise.noise(mainTimer/190,noiseSeed,xOff/73)/2+0.5;
    //humidity = 0.5;
    frontWindSpeed = (ImprovedNoise.noise(mainTimer/19,noiseSeed,xOff/73)+1)/2;
    frontWindDir = ImprovedNoise.noise(mainTimer/40,noiseSeed,xOff/100)*frontWindSpeed-2;
}