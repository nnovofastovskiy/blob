const fieldSize = 200;


const wrapper = document.querySelector('.blob_wrapper');
const blob = document.querySelector('.blob');
const generate_btn = document.querySelector('.generate_btn');

var ro = new ResizeObserver(entries => {
    for (let entry of entries)
        if (entry.target == wrapper) {
            resize();
        }
});

ro.observe(wrapper);

const fieldWidth = wrapper.getBoundingClientRect().width;
const fieldHeight = wrapper.getBoundingClientRect().height;
wrapper.addEventListener('resize', () => console.log('resize'))
wrapper.setAttribute('style', `width: ${fieldSize}px; height: ${fieldSize}px;`)
wrapper.setAttribute('height', `${fieldSize}px`)

const blobPath = 'M25.9,3.6\
                    C25.9,22.4, 12.9,44.8, -3.5,44.8\
                    C-19.9,44.8, -39.9,22.4, -39.9,3.6\
                    C-39.9,-15.1, -19.9,-30.2, -3.5,-30.2\
                    C12.9,-30.2, 25.9,-15.1, 25.9,3.6Z';
// const curves = [
//     [[40, 22.4], [12.9, 44.8], [-3.5, 44.8]],           //red
//     [[-19.9, 44.8], [-39.9, 22.4], [-39.9, 3.6]],       //green
//     [[-39.9, -15.1], [-19.9, -30.2], [-3.5, -30.2]],    //blue
//     [[12.9, -30.2], [40, -15.1], [40, 3.6]]             //yellow
// ];



const initDots = [
    [[12.9, 44.8], [-3.5, 44.8], [-19.9, 44.8]],
    [[-39.9, 22.4], [-39.9, 3.6], [-39.9, -15.1]],
    [[-19.9, -30.2], [-3.5, -30.2], [12.9, -30.2]],
    [[40, -15.1], [40, 3.6], [40, 22.4]]
];

const cDots = initDots.flat(1);
cDots.unshift(cDots.pop());

const curves = [];
for (let i = 0; i < cDots.length / 3; i++) {
    curves.push([cDots[i * 3 + 0], cDots[i * 3 + 1], cDots[i * 3 + 2]]);
}

console.log(curves);


const lastCurve = curves[curves.length - 1];

const move = lastCurve[lastCurve.length - 1];

let moveAble = {
    id: '',
    curveNum: null,
    dotNum: null,
    x: null,
    y: null
}

function resize() {
    const fieldWidth = wrapper.getBoundingClientRect().width;
    const fieldHeight = wrapper.getBoundingClientRect().height;
    blob.setAttribute('width', String(fieldWidth));
    blob.setAttribute('height', String(fieldHeight));
}

function newCircle(x, y, color = 'black', r = 2) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(x));
    circle.setAttribute('cy', String(y));
    circle.setAttribute('r', r);
    circle.setAttribute('transform', `translate(${fieldSize / 2} ${fieldSize / 2})`);
    circle.setAttribute('fill', color);
    return circle;
}

function moveHandler(e) {
    const blobX = blob.getBoundingClientRect().x;
    const blobY = blob.getBoundingClientRect().y;
    initDots[moveAble.curveNum][moveAble.dotNum][0] = e.clientX - fieldSize / 2 - blobX;
    initDots[moveAble.curveNum][moveAble.dotNum][1] = e.clientY - fieldSize / 2 - blobY;
    render();
}

function clickHandler(e) {
    const r = parseFloat(this.getAttribute('r'));
    const x = (this.getBoundingClientRect().x + r - fieldSize / 2).toFixed(1);
    const y = (this.getBoundingClientRect().y + r - fieldSize / 2).toFixed(1);
    const id = this.getAttribute('id');
    const curveNum = id.split('-')[1];
    const dotNum = id.split('-')[2];

    blob.addEventListener('mousemove', moveHandler);

    moveAble.id = id;
    moveAble.curveNum = curveNum;
    moveAble.dotNum = dotNum;
    moveAble.x = x;
    moveAble.y = y;
}

window.addEventListener('mouseup', () => {
    blob.removeEventListener('mousemove', moveHandler)
})

function create() {
    let newPath = `M${move.join(',')}${curves.reduce((acc, curve) => {
        return acc + `C${curve.join(',')}`;
    }, '')}`;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', newPath);
    path.setAttribute('stroke', 'black');
    path.setAttribute('fill', 'transparent');
    path.setAttribute('transform', `translate(${fieldSize / 2} ${fieldSize / 2})`);
    blob.appendChild(path);

    console.log(initDots.flat(1));
    // const dotsNum = initDots.flat(1).length;
    const curvesNum = initDots.length;
    let c = [];
    for (let i = 0; i < curvesNum; i++) {
        c.push(`circle-${i}-0`);
        c.push(`circle-${i}-1`);
        c.push(`circle-${i}-2`);
    }
    // c.push(c.shift());
    // console.log(c);
    initDots.forEach((curve, i) => {
        // let k = Math.abs(j + 1);
        let k = 1;
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

create();

function render() {
    const dots = [...initDots];
    dots.unshift(dots.pop());
    console.log(dots);
    let curvesFromDots = [];
    let curve = [];
    for (let i = 0; i < dots.length; i++) {
        if (((i + 1) % 3) > 0) {
            curve.push(dots[i]);
        } else {
            curve.push(dots[i]);
            curvesFromDots.push(curve);
            curve = [];
        }
    }
    console.log(curves);
    console.log(curvesFromDots);
    let newPath = `M${move.join(',')}${curves.reduce((acc, curve) => {
        return acc + `C${curve.join(',')}`;
    }, '')}`;
    const path = blob.querySelector('path');
    path.setAttribute('d', newPath);

    const circle = blob.querySelector(`#${moveAble.id}`);
    circle.setAttribute('cx', String(curves[moveAble.curveNum][moveAble.dotNum][0]));
    circle.setAttribute('cy', String(curves[moveAble.curveNum][moveAble.dotNum][1]));
}

