import { Car } from "./Car.js";
import { Game } from "./Game.js";
import { Options } from "./Options.js";

export class FreePlay extends Game {
    constructor(){
        super();
        this.car = new Car('car', 0, 65, '../images/honda.png');
        this.car.initCar();
        this.options = new Options();
        this.gameSpaceArea = this.gameSpace.getBoundingClientRect();
        this.leftBounds = this.gameSpaceArea.left
        this.rightBounds = this.gameSpaceArea.right - this.car.element.offsetWidth;
        this.topBounds = this.gameSpaceArea.top
        this.bottomBounds = this.gameSpaceArea.bottom - this.car.element.offsetHeight;
        this.crashed = false;
        this.angleInRadians = 0;
        this.dx = null;
        this.dy = null;
        this.newX = null;
        this.newY = null;
        this.xPos = this.car.element.offsetLeft;
        this.yPos = this.car.element.offsetTop;
        this.wPressed = false;
        this.sPressed = false;
        this.aPressed = false;
        this.dPressed = false;
        this.currentRotation = 0;
        this.turningAngle = 0.1;
        this.movementStartTime = null;
        this.currentTime = null;
        this.timePassed = null;
        this.forwardSpeed = this.car.startingSpeed;
        this.reverseSpeed = this.car.startingSpeed
        this.forwardAnimationFrameId = null;
        this.reverseAnimationFrameId = null;
        this.leftAnimationFrameId = null;
        this.rightAnimationFrameId = null;
    }
    initGame = () => {
        document.addEventListener("keydown", (event) => {
            if (event.key === "w"){
                this.wPressed = true
            }
            if (event.key === 's'){
                this.sPressed = true
            }
            if (event.key === 'a'){
                this.aPressed = true
            }
            if (event.key === 'd'){
                this.dPressed = true
            }
            this.handleMovement()
        })
        document.addEventListener("keyup", (event) =>{
            if (event.key === "w"){
                this.wPressed = false;
            }
            if (event.key === "s"){
                this.sPressed = false;
    
            }
            if (event.key === "a"){
                this.aPressed = false;
                this.stopContinuousMovement("left");
    
            }
            if (event.key === "d"){
                this.dPressed = false
                this.stopContinuousMovement("right");
    
            }
        })
    }
    checkCrash = (newX, newY) => {
        if (newX >= this.leftBounds && newX <= this.rightBounds - 20
        && newY >= this.topBounds && newY <= this.bottomBounds - 75){
            this.crashed = false;
        } else {
            this.crashed = true;
        }
        return this.crashed;
    }
    handleMovement = () => {
        if (this.wPressed && this.forwardAnimationFrameId === null) {
            this.startContinuousMovement("forward", this.moveForward);
        } else if (!this.wPressed && this.forwardAnimationFrameId !== null) {
            this.stopContinuousMovement("forward");
        }
    
        if (this.sPressed && this.reverseAnimationFrameId === null) {
            this.startContinuousMovement("reverse", this.moveReverse);
        } else if (!this.sPressed && this.reverseAnimationFrameId !== null) {
            this.stopContinuousMovement("reverse");
        }
    
        if (this.aPressed && this.leftAnimationFrameId === null) {
            this.startContinuousMovement("left", this.turnLeft);
        } else if (!this.aPressed && this.leftAnimationFrameId !== null) {
            this.stopContinuousMovement("left");
        }
    
        if (this.dPressed && this.rightAnimationFrameId === null) {
            this.startContinuousMovement("right", this.turnRight);
        } else if (!this.dPressed && this.rightAnimationFrameId !== null) {
            this.stopContinuousMovement("right");
        }
    }
    startContinuousMovement = (direction, movementFunction) => {
        switch (direction) {
            case "forward":
                this.movementStartTime = performance.now();
                this.forwardSpeed = this.car.startingSpeed;
                this.forwardAnimationFrameId = requestAnimationFrame(this.moveForwardContinuously);
                break;
            case "reverse":
                this.reverseAnimationFrameId = requestAnimationFrame(this.moveReverseContinuously);
                break;
            case "left":
                this.leftAnimationFrameId = requestAnimationFrame(this.turnLeftContinuously);
                break;
            case "right":
                this.rightAnimationFrameId = requestAnimationFrame(this.turnRightContinuously);
                break;
        }
        movementFunction();
    }
    stopContinuousMovement = (direction) => {
        switch (direction) {
            case "forward":
                this.forwardSpeed = this.car.startSpeed;
                cancelAnimationFrame(this.forwardAnimationFrameId);
                this.forwardAnimationFrameId = null;
                break;
            case "reverse":
                cancelAnimationFrame(this.reverseAnimationFrameId);
                this.reverseAnimationFrameId = null;
                break;
            case "left":
                cancelAnimationFrame(this.leftAnimationFrameId);
                this.leftAnimationFrameId = null;
                break;
            case "right":
                cancelAnimationFrame(this.rightAnimationFrameId);
                this.rightAnimationFrameId = null;
                break;
        }
    }
    resetCarPosition = () => {
        this.currentRotation = 0;
        cancelAnimationFrame(this.forwardAnimationFrameId);
        cancelAnimationFrame(this.reverseAnimationFrameId);
        cancelAnimationFrame(this.leftAnimationFrameId);
        cancelAnimationFrame(this.rightAnimationFrameId);
        this.wPressed = false;
        this.sPressed = false;
        this.aPressed = false;
        this.dPressed = false;
        this.forwardSpeed = this.car.startingSpeed;
        this.reverseSpeed = this.car.startingSpeed;
        this.car.element.style.transform = `rotate(${this.currentRotation}deg)`
        this.xPos = 0;
        this.yPos = 60;
        this.car.element.style.left = `${this.xPos}px`;
        this.car.element.style.top = `${this.yPos}px`;
    } 
    moveForward = (speed = 1) => {

        this.angleInRadians = this.currentRotation * Math.PI / 180;
        this.dx = Math.cos(this.angleInRadians);
        this.dy = Math.sin(this.angleInRadians);
        this.newX = this.xPos + this.dx * speed;
        this.newY = this.yPos + this.dy * speed;
        this.checkCrash(this.newX, this.newY)
        if (this.crashed){
            this.resetCarPosition();
        } else {
            this.xPos = this.newX;
            this.yPos = this.newY;
            this.car.element.style.left = `${this.xPos}px`;
            this.car.element.style.top = `${this.yPos}px`;
        }
    }
    moveForwardContinuously = () => {
        this.currentTime = performance.now()
        this.timePassed = (this.currentTime - this.movementStartTime) / 1000;
        this.speed = this.car.startingSpeed + (this.car.acceleration * this.timePassed);
        if (!this.wPressed) {
            this.forwardSpeed -= this.car.decelerationRate * this.timePassed;
            this.forwardSpeed = Math.max(0, this.forwardSpeed);
        } else {
            this.forwardSpeed = this.speed
        }
        this.moveForward(this.forwardSpeed);
        if (this.forwardSpeed <= 0.1){
            this.stopContinuousMovement("forward");
        } else {
            this.forwardAnimationFrameId = requestAnimationFrame(this.moveForwardContinuously);
        }
        this.options.updateMPH(this.forwardSpeed)
    }
    moveReverse = (speed = 1) => {
        this.angleInRadians = this.currentRotation * Math.PI / 180;
        this.dx = -Math.cos(this.angleInRadians);
        this.dy = -Math.sin(this.angleInRadians);
        this.newX = this.xPos + this.dx * speed;
        this.newY = this.yPos + this.dy * speed;
        this.checkCrash(this.newX, this.newY)
        if (this.crashed){
            this.resetCarPosition();
        } else {
            this.xPos = this.newX;
            this.yPos = this.newY;
            this.car.element.style.left = `${this.xPos}px`;
            this.car.element.style.top = `${this.yPos}px`;
        }
        this.options.updateMPH(this.reverseSpeed)

    }
    moveReverseContinuously = () => {
        this.currentTime = performance.now();
        this.timePassed = (this.currentTime - this.movementStartTime) / 1000;
        this.speed = this.car.startingSpeed + (this.car.reverseAcceleration * this.timePassed);
        if (!this.sPressed) {
            this.reverseSpeed -= this.car.decelerationRate * this.timePassed;
            this.reverseSpeed = Math.max(0, this.reverseSpeed);
        } else {
            this.reverseSpeed = this.speed
        }
        this.moveReverse(this.reverseSpeed);
        if (this.reverseSpeed <= 0.1){
            this.stopContinuousMovement("reverse");
        } else {
            this.reverseAnimationFrameId = requestAnimationFrame(this.moveReverseContinuously);
        }
        speedGauge.textContent = `${Math.trunc(this.reverseSpeed) * 3} MPH`
    }
    turnLeft = () => {    
        if ((this.wPressed || this.sPressed) && (this.forwardSpeed > this.car.minTurningSpeed 
            || this.reverseSpeed > this.car.minTurningSpeed)) {
            this.turningAngle = Math.min(this.car.maxTurningAngle, ((Math.max(this.forwardSpeed, this.reverseSpeed)) - this.car.minTurningSpeed))
            this.currentRotation -= this.turningAngle;
            this.car.element.style.transform = `rotate(${this.currentRotation}deg)`;
        }
    }
    turnLeftContinuously = () => {
        this.turnLeft();
        this.leftAnimationFrameId = requestAnimationFrame(this.turnLeftContinuously);
    }
    turnRight = () => {
        if ((this.wPressed || this.sPressed) && (this.forwardSpeed > this.car.minTurningSpeed 
            || this.reverseSpeed > this.car.minTurningSpeed)) {
            this.turningAngle = Math.min(this.car.maxTurningAngle, ((Math.max(this.forwardSpeed, this.reverseSpeed)) - this.car.minTurningSpeed))
            this.currentRotation += this.turningAngle;
            this.car.element.style.transform = `rotate(${this.currentRotation}deg)`;
        }
    }
    turnRightContinuously = () => {
        this.turnRight();
        this.rightAnimationFrameId = requestAnimationFrame(this.turnRightContinuously);
    }

}
