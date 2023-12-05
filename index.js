// let fieldSize = 200;

const wrapper = document.querySelector('.blob_wrapper');
const blob = document.querySelector('.blob');
const generate_btn = document.querySelector('.generate_btn');

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
}

ro.observe(wrapper);

const blobPath = 'M25.9,3.6\
                    C25.9,22.4, 12.9,44.8, -3.5,44.8\
                    C-19.9,44.8, -39.9,22.4, -39.9,3.6\
                    C-39.9,-15.1, -19.9,-30.2, -3.5,-30.2\
                    C12.9,-30.2, 25.9,-15.1, 25.9,3.6Z';

const dots = [
    [[112.9, 144.8], [-13.5, 144.8], [-119.9, 144.8]],
    [[-139.9, 122.4], [-139.9, 13.6], [-139.9, -115.1]],
    [[-119.9, -130.2], [-13.5, -130.2], [112.9, -130.2]],
    [[140, -115.1], [140, 13.6], [140, 122.4]]
];
// const dots = [
//     [[12.9, 44.8], [-13.5, 44.8], [-19.9, 44.8]],
//     [[-39.9, 22.4], [-39.9, 3.6], [-39.9, -15.1]],
//     [[-19.9, -30.2], [-13.5, -30.2], [12.9, -30.2]],
//     [[40, -15.1], [40, 13.6], [40, 22.4]]
// ];

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
        const angle = Math.atan2(dy1, dx1) * 57.296;
        const dx2 = moveAble.l2 * Math.cos((180 - angle) / 57.296);
        const dy2 = moveAble.l2 * Math.sin((180 - angle) / 57.296);
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
        const angle = Math.atan2(dy1, dx1) * 57.296;
        const dx0 = moveAble.l0 * Math.cos((180 - angle) / 57.296);
        const dy0 = moveAble.l0 * Math.sin((180 - angle) / 57.296);
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
    console.log(dx2);
    let l0 = Math.sqrt(Math.abs(dx0 * dx0) + Math.abs(dy0 * dy0));
    let l2 = Math.sqrt(Math.abs(dx2 * dx2) + Math.abs(dy2 * dy2));
    console.log(l0);
    console.log(l2);
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

    console.log(moveAble);
}

window.addEventListener('mouseup', () => {
    blob.removeEventListener('mousemove', moveHandler)
})

function create() {
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
            default: color = 'black'; break;
        }
        curve.forEach((dot, j) => {

            const circle = newCircle(dot[0], dot[1], color);
            circle.setAttribute('id', c[i * 3 + j]);
            circle.setAttribute('class', 'dot');
            circle.addEventListener('mousedown', clickHandler);
            blob.appendChild(circle);
        });
    });

}


function render() {
    const curveNum = moveAble.curveNum;
    let newPath = pathFromDots();
    const path = blob.querySelector('path');
    path.setAttribute('d', newPath);

    const circle0 = blob.querySelector(`#circle-${curveNum}-0`);
    const circle1 = blob.querySelector(`#circle-${curveNum}-1`);
    const circle2 = blob.querySelector(`#circle-${curveNum}-2`);
    // const circle = blob.querySelector(`#${moveAble.id}`);
    circle0.setAttribute('cx', String(dots[curveNum][0][0]));
    circle0.setAttribute('cy', String(dots[curveNum][0][1]));
    circle1.setAttribute('cx', String(dots[curveNum][1][0]));
    circle1.setAttribute('cy', String(dots[curveNum][1][1]));
    circle2.setAttribute('cx', String(dots[curveNum][2][0]));
    circle2.setAttribute('cy', String(dots[curveNum][2][1]));
}

create();
