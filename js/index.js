import { Options } from './Options.js';
import { Car } from './Car.js';
import { FreePlay } from './FreePlay.js'

let nextBgButton = document.getElementById('next')
let prevBgButton = document.getElementById('previous')
const options = new Options();
const freePlay = new FreePlay();


window.addEventListener('load', () => {
    nextBgButton.addEventListener('click', () => {
        options.changeBackground('next');
    })
    prevBgButton.addEventListener('click', () => {
        options.changeBackground('previous');
    })
    freePlay.initGame();
})