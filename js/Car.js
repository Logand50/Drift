


export class Car {
    constructor(className, InitialXPos, InitialYPos, imgPath){
        this.imgPath = imgPath;
        this.className = className;
        this.InitialXPos = InitialXPos;
        this.InitialYPos = InitialYPos;
        this.acceleration = 3;
        this.decelerationRate = 0.5;
        this.reverseAcceleration = 1;
        this.startingSpeed = 1;
        this.forwardSpeed = this.startingSpeed;
        this.reverseSpeed = this.startingSpeed;
        this.turningAngle = 0.1;
        this.minTurningSpeed = 1.2;
        this.maxTurningAngle = 10;


        this.element = null;
    }
    initCar(){
        this.element = document.createElement('img');
        this.element.className = this.className;
        this.element.src = this.imgPath;
        this.element.classList.add('car');
        this.element.style.position = 'absolute';
        this.element.style.left = `${this.InitialXPos}px`
        this.element.style.top = `${this.InitialYPos}px`
        document.getElementById('gameArea').appendChild(this.element)
    }
}
