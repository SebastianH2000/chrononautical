var frontWindDir = 1;
var frontWindSpeed = 1;
var humidity = 1;

function updateFrontWeather() {
    humidity = ImprovedNoise.noise(mainTimer/190,noiseSeed,xOff/73)/2+1;
    //humidity = 0.5;
    frontWindSpeed = (ImprovedNoise.noise(mainTimer/19,noiseSeed,xOff/73)+1)/2;
    frontWindDir = ImprovedNoise.noise(mainTimer/40,noiseSeed,xOff/100)*frontWindSpeed-2;
}