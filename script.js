
let car = document.getElementsByClassName('car')
car = car[0]
let xPos = car.offsetLeft;
console.log(xPos)
let yPos = car.offsetTop;
console.log(yPos)

const startSpeed = 1;
let forwardSpeed = startSpeed;
let reverseSpeed = startSpeed;
let turningAngle = .1;
let minTurningSpeed = 1.2;
let maxTurningAngle = 10;
let acceleration = 3;
let decelerationRate = .05;
let reverseAcceleration = 1;
let movementStartTime = null;
let currentRotation = 0;
let wPressed = false
let dPressed = false
let sPressed = false
let aPressed = false
let forwardAnimationFrameId = null;
let reverseAnimationFrameId = null;
let leftAnimationFrameId = null;
let rightAnimationFrameId = null;
let maxTop = window.innerHeight
let maxLeft = window.innerWidth
let nextBg = document.getElementById('next')
let prevBg = document.getElementById('previous')
let backgroundInfo = document.getElementById('backgroundTextHidden')
let speedGauge = document.getElementById('speedMPH')
let gameSpace = document.getElementById('gameArea')
let gameSpaceRect = gameSpace.getBoundingClientRect();
let minX = gameSpaceRect.left
let maxX = gameSpaceRect.right - car.offsetWidth;
let minY = gameSpaceRect.top
let maxY = gameSpaceRect.bottom - car.offsetHeight;


let backgroundImages = [
    'none',
    'dirt.jpeg',
    'fair.jpg'
]
let backgroundIndex = 0;

window.addEventListener('load', (event) => {

    nextBg.addEventListener("click", () => {
        loadNextBackground();
    })
    prevBg.addEventListener("click", () =>{
        loadPreviousBackground();
    })


    document.addEventListener("keydown", (event) => {
        if (event.key === "w"){
            wPressed = true
        }
        if (event.key === 's'){
            sPressed = true
        }
        if (event.key === 'a'){
            aPressed = true
        }
        if (event.key === 'd'){
            dPressed = true
        }
        handleMovement()
    })
    document.addEventListener("keyup", (event) =>{
        if (event.key === "w"){
            wPressed = false;
        }
        if (event.key === "s"){
            sPressed = false;

        }
        if (event.key === "a"){
            aPressed = false;
            stopContinuousMovement("left");

        }
        if (event.key === "d"){
            dPressed = false
            stopContinuousMovement("right");

        }
    })
});



function moveForward(speed = 1){
    let angleInRadians = currentRotation * Math.PI / 180;
    let dx = Math.cos(angleInRadians);
    let dy = Math.sin(angleInRadians);
    let newX = xPos + dx * speed;
    let newY = yPos + dy * speed;

    if (newX >= minX && newX <= maxX -20 && newY >= minY && newY <= maxY - 75) {
        xPos = newX;
        yPos = newY;
        car.style.left = `${xPos}px`;
        car.style.top = `${yPos}px`;
    }
}
function moveReverse(speed =1){
    let angleInRadians = currentRotation * Math.PI / 180;
    let dx = -Math.cos(angleInRadians);
    let dy = -Math.sin(angleInRadians);
    let newX = xPos + dx * speed;
    let newY = yPos + dy * speed;

    if (newX >= minX && newX <= maxX -20 && newY >= minY && newY <= maxY - 75) {
        xPos = newX;
        yPos = newY;
        car.style.left = `${xPos}px`;
        car.style.top = `${yPos}px`;
    }
}

function turnRight(){
    console.log(turningAngle)
    if ((wPressed || sPressed)&& (forwardSpeed > minTurningSpeed || reverseSpeed > minTurningSpeed)) {
        turningAngle = Math.min(maxTurningAngle, ((Math.max(forwardSpeed, reverseSpeed)) - minTurningSpeed))
        currentRotation += turningAngle;
        car.style.transform = `rotate(${currentRotation}deg)`;
    }
}
function turnLeft(){

    console.log(turningAngle)

    if ((wPressed || sPressed) && (forwardSpeed > minTurningSpeed || reverseSpeed > minTurningSpeed)) {
        turningAngle = Math.min(maxTurningAngle, ((Math.max(forwardSpeed, reverseSpeed)) - minTurningSpeed))
        currentRotation -= turningAngle;
        car.style.transform = `rotate(${currentRotation}deg)`;
    }
}
function handleMovement(){
    if (wPressed && forwardAnimationFrameId === null) {
        startContinuousMovement("forward", moveForward);
    } else if (!wPressed && forwardAnimationFrameId !== null) {
        stopContinuousMovement("forward");
    }

    if (sPressed && reverseAnimationFrameId === null) {
        startContinuousMovement("reverse", moveReverse);
    } else if (!sPressed && reverseAnimationFrameId !== null) {
        stopContinuousMovement("reverse");
    }

    if (aPressed && leftAnimationFrameId === null) {
        startContinuousMovement("left", turnLeft);
    } else if (!aPressed && leftAnimationFrameId !== null) {
        stopContinuousMovement("left");
    }

    if (dPressed && rightAnimationFrameId === null) {
        startContinuousMovement("right", turnRight);
    } else if (!dPressed && rightAnimationFrameId !== null) {
        stopContinuousMovement("right");
    }
}


function startContinuousMovement(direction, movementFunction) {
    switch (direction) {
        case "forward":
            movementStartTime = performance.now();
            forwardSpeed = startSpeed;
            forwardAnimationFrameId = requestAnimationFrame(moveForwardContinuously);
            break;
        case "reverse":
            reverseAnimationFrameId = requestAnimationFrame(moveReverseContinuously);
            break;
        case "left":
            leftAnimationFrameId = requestAnimationFrame(turnLeftContinuously);
            break;
        case "right":
            rightAnimationFrameId = requestAnimationFrame(turnRightContinuously);
            break;
    }
    movementFunction();
}

function stopContinuousMovement(direction) {
    switch (direction) {
        case "forward":
            forwardSpeed = startSpeed;

            cancelAnimationFrame(forwardAnimationFrameId);
            forwardAnimationFrameId = null;
            break;
        case "reverse":
            cancelAnimationFrame(reverseAnimationFrameId);
            reverseAnimationFrameId = null;
            break;
        case "left":
            cancelAnimationFrame(leftAnimationFrameId);
            leftAnimationFrameId = null;
            break;
        case "right":
            cancelAnimationFrame(rightAnimationFrameId);
            rightAnimationFrameId = null;
            break;
    }
}

function moveForwardContinuously() {
    const currentTime = performance.now()
    const timePassed = (currentTime - movementStartTime) / 1000;
    speed = startSpeed + (acceleration * timePassed);
    if (!wPressed) {
        forwardSpeed -= decelerationRate * timePassed;
        forwardSpeed = Math.max(0, forwardSpeed);
    } else {
        forwardSpeed = speed
    }
    moveForward(forwardSpeed);

    if (forwardSpeed <= 0.1){
        stopContinuousMovement("forward");
    } else {
        forwardAnimationFrameId = requestAnimationFrame(moveForwardContinuously);
    }
    speedGauge.textContent = `${Math.trunc(forwardSpeed) * 3} MPH`
}
    
function moveReverseContinuously() {
    const currentTime = performance.now()
    const timePassed = (currentTime - movementStartTime) / 1000;
    speed = startSpeed + (reverseAcceleration * timePassed);
    if (!sPressed) {
        reverseSpeed -= decelerationRate * timePassed;
        reverseSpeed = Math.max(0, reverseSpeed);
    } else {
        reverseSpeed = speed
    }

    moveReverse(reverseSpeed);
    if (reverseSpeed <= 0.1){
        stopContinuousMovement("reverse");
    } else {
        reverseAnimationFrameId = requestAnimationFrame(moveReverseContinuously);
    }
    speedGauge.textContent = `${Math.trunc(reverseSpeed) * 3} MPH`

}
    
function turnLeftContinuously() {
    turnLeft();
    leftAnimationFrameId = requestAnimationFrame(turnLeftContinuously);
}
    
function turnRightContinuously() {
    turnRight();
    rightAnimationFrameId = requestAnimationFrame(turnRightContinuously);
}

function loadPreviousBackground(){
    if (backgroundIndex >= backgroundImages.length - 1 || backgroundIndex == 0){
        backgroundIndex = 0
    } else{
        backgroundIndex -= 1
    }
    console.log(backgroundIndex)
    console.log(backgroundImages.length)
    backgroundInfo.textContent = backgroundImages[backgroundIndex]
    backgroundInfo.setAttribute('id', 'backgroundTextVisible')
    document.body.style.background = `url(images/backgrounds/${backgroundImages[backgroundIndex]})`
    document.body.style.backgroundSize = 'cover'
    setTimeout(() => {
        backgroundInfo.setAttribute('id', 'backgroundTextHidden')
        backgroundInfo.textContent = ''
    }, 5000);

}

function loadNextBackground(){
    if (backgroundIndex >= backgroundImages.length - 1){
        backgroundIndex = 0
    } else{
        backgroundIndex += 1
    }
    console.log(backgroundIndex)
    console.log(backgroundImages.length)
    backgroundInfo.textContent = backgroundImages[backgroundIndex].split('.')[0]
    backgroundInfo.setAttribute('id', 'backgroundTextVisible')
    document.body.style.background = `url(images/backgrounds/${backgroundImages[backgroundIndex]})`
    document.body.style.backgroundSize = 'cover'
    setTimeout(() => {
        backgroundInfo.setAttribute('id', 'backgroundTextHidden')
    }, 5000);
}
function resetCarPosition() {
        // Cancel all animation frame requests
    cancelAnimationFrame(forwardAnimationFrameId);
    cancelAnimationFrame(reverseAnimationFrameId);
    cancelAnimationFrame(leftAnimationFrameId);
    cancelAnimationFrame(rightAnimationFrameId);

    // Set all movement flags to false
    wPressed = false;
    sPressed = false;
    aPressed = false;
    dPressed = false;
    forwardSpeed = startSpeed;
    reverseSpeed = startSpeed;
    currentRotation = 0
    car.style.transform = `rotate(${currentRotation}deg)`

    xPos = 0;
    yPos = 60;
    car.style.left = `${xPos}px`;
    car.style.top = `${yPos}px`;
}