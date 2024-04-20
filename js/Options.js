
export class Options {
    constructor(params) {
        this.backgroundImages = [
            'none',
            'dirt.jpeg',
            'fair.jpg'
        ];
        this.backgroundImageIndex = 0;
        this.backgroundInfoArea = document.getElementById('backgroundTextHidden');
        this.gaugeMPH = document.getElementById('speedMPH');
    }
    changeBackground(direction){
        if (direction == 'next'){
            if (this.backgroundImageIndex >= (this.backgroundImages.length - 1)){
                this.backgroundImageIndex = 0;
            } else {
                this.backgroundImageIndex += 1;
            }
        } else if (direction == 'previous'){
            if (this.backgroundImageIndex >= (this.backgroundImages.length -1)){
                this.backgroundImageIndex = 0;
            } else {
                this.backgroundImageIndex -= 1;
            }
        }
        document.body.style.background = `url(images/backgrounds/${this.backgroundImages[this.backgroundImageIndex]})`;
        document.body.style.backgroundSize = 'cover'
        setTimeout(() => {
            this.backgroundInfoArea.textContent = ''
            this.backgroundInfoArea.setAttribute('id', 'backgroundTextHidden')
        }, 5000);
    }
    updateMPH = (speed) => {
        this.gaugeMPH.textContent = `${Math.trunc(speed) * 3} MPH`
    }
}

