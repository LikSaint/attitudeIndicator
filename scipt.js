
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext(`2d`);

let w = canvas.width = innerWidth;
let h = canvas.height = innerHeight;

let currentPitch = 0;
let currentRoll = 0;

let config = {
    lineWidth: 3,
    rollScaleWidth: 100,
    tailSize: 15,
    strokeStyle: "white",
    pitchPadding: 140,
    pitchLine: 20,
    pitchTextPadding: 10,
    pitchMaxRange: 180,
    pitchStep: 20,
    stringHeightCenterCorrection: 3,
}

let flyBySelf = false;

ctx.translate(w/2, h/2);


function draw(roll, pitch) {
    clearCtx();
    drawPitch(pitch);
    drawRollLine(roll);
} 

function clearCtx() {
    ctx.rotate(Math.PI * (-currentRoll)/180);
    ctx.clearRect(-w/2, -h/2, w, h);
}

function drawPitch(pitch) {
    const currentCenter = Math.trunc(pitch/config.pitchStep)* config.pitchStep;
    const allStepsCount = config.pitchMaxRange / config.pitchStep;

    const values = []

    let calculatedSteps = -allStepsCount;
    let currentCount = currentCenter - config.pitchMaxRange - config.pitchStep;

    while(calculatedSteps < allStepsCount + 1) {
        if (currentCount === 180) {
            currentCount = currentCount - 360;
        } 
        currentCount = currentCount + config.pitchStep;
        
        values.push({
            coords: pitch - currentCenter - (calculatedSteps) * config.pitchStep,
            value: currentCount > -180 ? currentCount : currentCount + 360,
        });
        calculatedSteps++;
    }




    ctx.fillStyle = config.strokeStyle;
    ctx.strokeStyle = config.strokeStyle;
    ctx.lineWidth = config.lineWidth;
    ctx.beginPath();

    values.forEach(value => {
        // left side
        ctx.fillText(value.value, -config.pitchPadding - config.pitchTextPadding * 2, value.coords + config.stringHeightCenterCorrection);
        ctx.fill();
        if (value.value % 60 === 0) {
            ctx.moveTo(-config.pitchPadding - config.pitchTextPadding * 3, value.coords);
        } else {
            ctx.moveTo(-config.pitchPadding - config.pitchTextPadding * 3 - config.pitchLine*2/3, value.coords);
        }
        ctx.lineTo(-config.pitchPadding - config.pitchTextPadding * 3 - config.pitchLine , value.coords);
        ctx.stroke();


        // right side
        ctx.fillText(value.value, config.pitchPadding, value.coords + config.stringHeightCenterCorrection);
        ctx.fill();
        if (value.value % 60 === 0) {
            ctx.moveTo(config.pitchPadding + config.pitchTextPadding * 3, value.coords);
        } else {
            ctx.moveTo(config.pitchPadding + config.pitchTextPadding * 3 + config.pitchLine*2/3, value.coords);
        }
        ctx.lineTo(config.pitchPadding + config.pitchTextPadding * 3 + config.pitchLine , value.coords);
        ctx.stroke();
    })
}

function drawRollLine(roll) {
    ctx.rotate(Math.PI * roll/180);
    currentRoll = roll;
    ctx.strokeStyle = config.strokeStyle;
    ctx.lineWidth = config.lineWidth;
    ctx.beginPath();
    ctx.moveTo(-config.rollScaleWidth - config.tailSize, 0);
    ctx.lineTo(-config.tailSize, 0);
    ctx.lineTo(0, config.tailSize);
    ctx.lineTo(config.tailSize, 0);
    ctx.lineTo(config.rollScaleWidth + config.tailSize, 0);
    ctx.stroke();
    ctx.closePath();
}

function handleKeyDown(event) {
    switch (event.code) {
        case 'ArrowLeft':
            draw(currentRoll - 1, currentPitch);
            break;
        case 'ArrowRight':
            draw(currentRoll + 1, currentPitch);
            break;
        case 'ArrowUp':
            currentPitch = getNewPitch(true);
            draw(currentRoll, currentPitch);
            break;
        case 'ArrowDown':
            currentPitch = getNewPitch(false);
            draw(currentRoll, currentPitch);
            break;
        case 'KeyA':
            flyBySelf = !flyBySelf;
            requestAnimationFrame(tick);
            break;
        default:
            break;
    }
}

function getNewPitch(increment) {
    if (currentPitch === 180 && increment) {
        return currentPitch - 359;
    } else if (currentPitch === -179 && !increment) {
        return currentPitch + 359;
    }

    return increment ? currentPitch + 1 : currentPitch - 1;
}

function tick() {
    if (flyBySelf) {
        requestAnimationFrame(tick);
    }

    currentPitch = getNewPitch(Math.random() > 0.5);
    
    draw((Math.random() > 0.5 && currentRoll < 40 || currentRoll < -40 ? currentRoll + 1 : currentRoll - 1), currentPitch);
}

document.addEventListener('keydown', handleKeyDown);

draw(0, 0); 