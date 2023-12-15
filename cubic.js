// P = (1-t)P1 + tP2
// P = (1-t)^2P1 + 2(1-t)tP2 + t^2P3
// P = (1-t)^3P1 + 3(1-t)^2tP2 + 3(1-t)t^2P3 + t^3P4

// P = (1-t)^4P0 + 4(1-t)^3tP1 + 4(1-t)^2t^2P2 + 4(1-t)t^3P3 + t^4P4

const ball = document.querySelector('.ball');
const start_btn = document.querySelector('.start_btn');
const svg = document.querySelector('svg');
const startY = 400;
const startX = 400;
let y = startY;
let x = startX;
const targetY = 500;
const targetX = 500;
const duration = 300;
// const steps = Math.floor(duration / 16);

start_btn.addEventListener('click', animationHandler);

function animationHandler() {
    const startTime = performance.now();
    requestAnimationFrame(function animate(time) {
        let timeFraction = (time - startTime) / duration;
        if (timeFraction > 1) timeFraction = 1;
        draw(timeFraction);

        if (timeFraction < 1) {
            requestAnimationFrame(animate)
        }
    });
}

function render() {
    // console.log('render');
    ball.setAttribute('style', `top: ${y}px; left: ${x}px;`);
}

const Y0 = 0;
const Y1 = -0.3;
const Y2 = 1.6;
const Y3 = 0.7;
const Y4 = 1;

const X0 = 0;
const X1 = 0.25;
const X2 = 0.5;
const X3 = 0.75;
const X4 = 1;

function draw(t) {
    const bezierX =
        4 * Math.pow(1 - t, 3) * t * X1 +
        8 * Math.pow(1 - t, 2) * Math.pow(t, 2) * X2 +
        4 * (1 - t) * Math.pow(t, 3) * X3 +
        Math.pow(t, 4) * X4;
    const bezierY =
        4 * Math.pow(1 - t, 3) * t * Y1 +
        8 * Math.pow(1 - t, 2) * Math.pow(t, 2) * Y2 +
        4 * (1 - t) * Math.pow(t, 3) * Y3 +
        Math.pow(t, 4) * Y4;
    x = startX + (targetX - startX) * bezierY;
    const circle = newCircle(bezierX * 200, 300 - bezierY * 200);
    svg.appendChild(circle);
    render();
}

function newCircle(x, y, color = 'black', r = 4) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(x));
    circle.setAttribute('cy', String(y));
    circle.setAttribute('r', r);
    // circle.setAttribute('transform', `translate(${fieldWidth / 2} ${fieldHeight / 2})`);
    circle.setAttribute('fill', color);
    // circle.setAttribute('style', showDots ? 'display: auto' : 'display: none');
    circle.setAttribute('class', 'dot');
    return circle;
}

render();