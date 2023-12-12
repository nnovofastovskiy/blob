// let fieldSize = 200;

const wrapper = document.querySelector('.blob_wrapper');
const blob = document.querySelector('.blob');
const generate_btn = document.querySelector('.generate_btn');
const toggle_btn = document.querySelector('.toggle_dots_btn');
const conrerNumSpan = document.querySelector('.cornerNum');
const conrerNumInput = document.querySelector('.conrerNumInput');
const curvatureNumSpan = document.querySelector('.curvatureNum');
const curvatureNumInput = document.querySelector('.curvatureNumInput');


let allDots;


let conrerNum = 4;
let curvature = 1;

let showDots = true;


function getRandom(min, max) {
    const absMin = 10;
    const r = Math.floor(Math.random() * (max - min) + min);
    if (Math.abs(r) < absMin) return absMin;
    return r;
}

function cornerChangeHandler() {
    conrerNumSpan.innerHTML = this.value;
    conrerNum = parseInt(this.value);
    const newDots = [];
    for (let i = 0; i < conrerNum; i++) {
        newDots.push([[], [], []]);
    }
    dots = newDots;
    create();
    render();
}

function curvatureChangeHandler() {
    curvatureNumSpan.innerHTML = this.value;
    curvature = parseInt(this.value);
    generate();
    render();
}

conrerNumInput.addEventListener('input', cornerChangeHandler);
curvatureNumInput.addEventListener('input', curvatureChangeHandler);


generate_btn.addEventListener('click', () => {
    generate();
    render();
});
// const allDots = document.querySelectorAll('.dot');

let fieldWidth = 400;
let fieldHeight = 400;



// fieldWidth = wrapper.getBoundingClientRect().width;
// fieldHeight = wrapper.getBoundingClientRect().height;
wrapper.setAttribute('style', `width: ${fieldWidth}px; height: ${fieldHeight}px;`)
// wrapper.setAttribute('height', `${fieldSize}px`)

var ro = new ResizeObserver(entries => {
    for (let entry of entries)
        if (entry.target == wrapper) {
            resize();
        }
});

function resize() {
    fieldWidth = wrapper.getBoundingClientRect().width;
    fieldHeight = wrapper.getBoundingClientRect().height;
    blob.setAttribute('width', String(fieldWidth));
    blob.setAttribute('height', String(fieldHeight));
    // blob.querySelector('path').setAttribute('transform', `translate(${fieldWidth / 2} ${fieldHeight / 2})`);

}

ro.observe(wrapper);

let dots = [
    [[], [], []],
    [[], [], []],
    [[], [], []],
    [[], [], []]
];

function pathFromDots() {
    const cDots = dots.flat(1);
    cDots.unshift(cDots.pop());

    const curves = [];
    for (let i = 0; i < cDots.length / 3; i++) {
        curves.push([cDots[i * 3 + 0], cDots[i * 3 + 1], cDots[i * 3 + 2]]);
    }
    const lastCurve = curves[curves.length - 1];
    const move = lastCurve[lastCurve.length - 1];

    const path = `M${move.join(',')}${curves.reduce((acc, curve) => {
        return acc + `C${curve.join(',')}`;
    }, '')}`;

    return path;
}


let moveAble = {
    id: '',
    curveNum: null,
    dotNum: null,
    x0: null,
    y0: null,
    x1: null,
    y1: null,
    x2: null,
    y2: null,
    dx0: null,
    dy0: null,
    dx2: null,
    dy2: null,
    l0: null,
    l2: null,

}

function newCircle(x, y, color = 'black', r = 4) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(x));
    circle.setAttribute('cy', String(y));
    circle.setAttribute('r', r);
    circle.setAttribute('transform', `translate(${fieldWidth / 2} ${fieldHeight / 2})`);
    circle.setAttribute('fill', color);
    // circle.setAttribute('style', 'display: none');
    circle.setAttribute('class', 'dot');
    return circle;
}

function moveHandler(e) {
    const blobX = blob.getBoundingClientRect().x;
    const blobY = blob.getBoundingClientRect().y;
    const curveNum = moveAble.curveNum;
    const newX = e.clientX - fieldWidth / 2 - blobX;
    const newY = e.clientY - fieldHeight / 2 - blobY;

    if (moveAble.dotNum === 0) {
        const dx1 = newX - dots[curveNum][1][0];
        const dy1 = newY - dots[curveNum][1][1];
        const angle = Math.atan2(dy1, dx1);
        const dx2 = moveAble.l2 * Math.cos(Math.PI - angle);
        const dy2 = moveAble.l2 * Math.sin(Math.PI - angle);
        dots[curveNum][0][0] = newX;
        dots[curveNum][0][1] = newY;
        dots[curveNum][2][0] = dx2 + dots[curveNum][1][0];
        dots[curveNum][2][1] = - dy2 + dots[curveNum][1][1];
    }
    if (moveAble.dotNum === 1) {
        dots[curveNum][0][0] = newX - moveAble.dx0;
        dots[curveNum][0][1] = newY - moveAble.dy0;
        dots[curveNum][1][0] = newX;
        dots[curveNum][1][1] = newY;
        dots[curveNum][2][0] = newX - moveAble.dx2;
        dots[curveNum][2][1] = newY - moveAble.dy2;
    }
    if (moveAble.dotNum === 2) {
        const dx1 = newX - dots[curveNum][1][0];
        const dy1 = newY - dots[curveNum][1][1];
        const angle = Math.atan2(dy1, dx1);
        const dx0 = moveAble.l0 * Math.cos(Math.PI - angle);
        const dy0 = moveAble.l0 * Math.sin(Math.PI - angle);
        dots[curveNum][0][0] = dx0 + dots[curveNum][1][0];
        dots[curveNum][0][1] = - dy0 + dots[curveNum][1][1];
        dots[curveNum][2][0] = newX;
        dots[curveNum][2][1] = newY;
    }
    render();
}

function clickHandler(e) {
    const r = parseFloat(this.getAttribute('r'));
    const id = this.getAttribute('id');
    const curveNum = parseInt(id.split('-')[1]);
    const dotNum = parseInt(id.split('-')[2]);

    const circle0 = blob.querySelector(`#circle-${curveNum}-0`);
    const circle1 = blob.querySelector(`#circle-${curveNum}-1`);
    const circle2 = blob.querySelector(`#circle-${curveNum}-2`);

    const x0 = parseFloat(circle0.getAttribute('cx'));
    const y0 = parseFloat(circle0.getAttribute('cy'));
    const x1 = parseFloat(circle1.getAttribute('cx'));
    const y1 = parseFloat(circle1.getAttribute('cy'));
    const x2 = parseFloat(circle2.getAttribute('cx'));
    const y2 = parseFloat(circle2.getAttribute('cy'));


    blob.addEventListener('mousemove', moveHandler);
    let dx0 = x1 - x0;
    let dy0 = y1 - y0;
    let dx2 = x1 - x2;
    let dy2 = y1 - y2;
    let l0 = Math.sqrt(Math.abs(dx0 * dx0) + Math.abs(dy0 * dy0));
    let l2 = Math.sqrt(Math.abs(dx2 * dx2) + Math.abs(dy2 * dy2));
    moveAble.id = id;
    moveAble.curveNum = curveNum;
    moveAble.dotNum = dotNum;
    moveAble.x0 = x0;
    moveAble.y0 = y0;
    moveAble.x1 = x1;
    moveAble.y1 = y1;
    moveAble.x2 = x2;
    moveAble.y2 = y2;
    moveAble.dx0 = dx0;
    moveAble.dy0 = dy0;
    moveAble.dx2 = dx2;
    moveAble.dy2 = dy2;
    moveAble.l0 = l0;
    moveAble.l2 = l2;
}

window.addEventListener('mouseup', () => {
    blob.removeEventListener('mousemove', moveHandler)
})

function create() {
    if (blob.querySelector('path')) {
        blob.removeChild(blob.querySelector('path'));
        for (let i = 0; i < allDots.length; i++) {
            blob.removeChild(allDots[i]);
        }
    }

    generate();
    let newPath = pathFromDots();
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', newPath);
    path.setAttribute('stroke', 'black');
    path.setAttribute('fill', 'transparent');
    path.setAttribute('transform', `translate(${fieldWidth / 2} ${fieldHeight / 2})`);
    blob.appendChild(path);

    const curvesNum = dots.length;
    let c = [];
    for (let i = 0; i < curvesNum; i++) {
        c.push(`circle-${i}-0`);
        c.push(`circle-${i}-1`);
        c.push(`circle-${i}-2`);
    }
    dots.forEach((curve, i) => {
        let color;
        switch (i) {
            case 0: color = 'red'; break;
            case 1: color = 'green'; break;
            case 2: color = 'blue'; break;
            case 3: color = 'yellow'; break;
            case 4: color = 'pink'; break;
            case 5: color = 'violent'; break;
            case 6: color = 'lime'; break;
            default: color = 'black'; break;
        }
        curve.forEach((dot, j) => {

            const circle = newCircle(dot[0], dot[1], color);
            circle.setAttribute('id', c[i * 3 + j]);
            circle.addEventListener('mousedown', clickHandler);
            blob.appendChild(circle);
        });
    });
    allDots = document.querySelectorAll('.dot');
}

function generate() {
    const angles = [];
    const a1r = getRandom(-(10 * curvature), (10 * curvature));
    for (let i = 1; i < conrerNum + 1; i++) {
        let a1 = 360 / conrerNum * i + a1r;
        let a0 = a1 - 90;
        a1 = a1 / (360 / (2 * Math.PI));
        a0 = a0 / (360 / (2 * Math.PI));
        angles.push([a1, a0]);
    }
    for (let i = 0; i < conrerNum; i++) {
        const l1 = getRandom(fieldWidth / 3 - (20 * curvature), fieldWidth / 3 + (20 * curvature));
        const l0 = getRandom(fieldWidth / 5 - (20 * curvature), fieldWidth / 5 + (20 * curvature));
        const l2 = getRandom(fieldWidth / 5 - (20 * curvature), fieldWidth / 5 + (20 * curvature));
        const x1 = l1 * Math.cos(angles[i][0]);
        const y1 = l1 * Math.sin(angles[i][0]);
        const x0 = x1 + l0 * Math.cos(angles[i][1]);
        const y0 = y1 + l0 * Math.sin(angles[i][1]);
        const x2 = x1 + l2 * Math.cos(Math.PI - angles[i][1]);
        const y2 = y1 - l2 * Math.sin(Math.PI - angles[i][1]);

        dots[i][0] = [x0, y0];
        dots[i][1] = [x1, y1];
        dots[i][2] = [x2, y2];
    }
}


function render() {
    let newPath = pathFromDots();
    const path = blob.querySelector('path');
    path.setAttribute('d', newPath);
    for (let i = 0; i < dots.length; i++) {
        for (let j = 0; j < 3; j++) {
            const n = (i * 3) + j;
            allDots[n].setAttribute('cx', String(dots[i][j][0]));
            allDots[n].setAttribute('cy', String(dots[i][j][1]));
        }
    }
}



// allDots.forEach(dot => {
//     dot.setAttribute('style', showDots ? 'display: auto' : 'display: none');
// });

toggle_btn.addEventListener('click', () => {
    showDots = !showDots;
    allDots.forEach(dot => {
        dot.setAttribute('style', showDots ? 'display: auto' : 'display: none');
    });
});

create();
// allDots = document.querySelectorAll('.dot');
