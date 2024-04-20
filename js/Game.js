import { Options } from './Options.js';

export class Game {
    constructor(){
        this.options = new Options();
        this.car = null;
        this.gameSpace = document.getElementById('gameArea');
        this.nextBgButton = document.getElementById('next');
        this.prevBgButton = document.getElementById('previous');
        this.init();
    }
    init(){
        window.addEventListener('load', () => {
            this.nextBgButton.addEventListener('click', () => {
                this.options.changeBackground('next');
            });
            this.prevBgButton.addEventListener('click', () => {
                this.options.changeBackground('previous');
            });
        });
    }
}

