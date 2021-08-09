const wrapper = document.querySelector("#wrapper");
const body = document.querySelector("body");
let dragFlag = false;
let draggingElement;
let svgElement = document.querySelector("#svgElement");

function addDot(event) {
    svgElement = document.querySelector("#svgElement");
    let rectElement = event.target;
    let cx = Math.round(event.x - rectElement.getBoundingClientRect().left);
    let cy = Math.round(event.y - rectElement.getBoundingClientRect().top);
    addCircle(cx, cy);
    addPathFunction();
    wrapper.innerHTML = svgElement.outerHTML;
}

function addCircle(x, y) {
    let newCircle = document.createElement("circle");
    newCircle.setAttribute("cx", String(x));
    newCircle.setAttribute("cy", String(y));
    newCircle.setAttribute("r", "4");
    newCircle.setAttribute("fill", "red");
    newCircle.setAttribute("onmouseenter", "circleHover(event)");
    newCircle.setAttribute("onmouseleave", "circleLeave(event)");
    newCircle.setAttribute("onmousedown", "dragStart(event)");
    newCircle.setAttribute("onmouseup", "dragEnd(event)");

    svgElement.appendChild(newCircle);
}

function circleHover(event) {
    event.target.setAttribute("r", "6");
}

function circleLeave(event) {
    event.target.setAttribute("r", "4");
}

function dragStart(event) {
    draggingElement = event.target;
    let cxStart = event.target.getAttribute("cx");
    let cyStart = event.target.getAttribute("cy");
    dragFlag = true;
    console.log(cxStart, cyStart);
}

function dragCircle(event) {
    if (dragFlag) {
        let rectElement = event.target;
        let cx = Math.round(event.x - rectElement.getBoundingClientRect().left);
        let cy = Math.round(event.y - rectElement.getBoundingClientRect().top);
        draggingElement.setAttribute("cx", String(cx));
        draggingElement.setAttribute("cy", String(cy));
    }
}

function dragEnd(event) {
    dragFlag = false;
    draggingElement = undefined;
}

function addPathFunction() {
    // let reg = /\d+/g;
    let cxArr = [];
    let cyArr = [];
    let circles = svgElement.querySelectorAll("circle");
    console.log(circles.length);
    for (let i = 0; i < circles.length; i++) {
        cyArr.push(circles[i].getAttribute("cy"));
        cxArr.push(circles[i].getAttribute("cx"));
    }
    if (circles.length == 4) {
        let newPath = createPath(cxArr, cyArr);
        svgElement.appendChild(newPath);
    }
    // let lastCircle = circles[circles.length - 1];
    // let paths = svgElement.querySelectorAll("path");
    // let lastPathD = paths[paths.length - 1].getAttribute("d");
    // let dots = lastPathD.match(reg);
    // for (let i = 0; i < dots.length; i++) {
    //     if (i % 2) {
    //         cyArr.push(dots[i]);
    //     } else {
    //         cxArr.push(dots[i]);
    //     }
    // }
    // console.log(lastCircle);
    // console.log(lastPathD);
    console.log(cxArr, cyArr);
}

function createPath(xArr, yArr) {
    let newPath = document.createElement("path");
    let pathD = `M${xArr[0]} ${yArr[0]} C ${xArr[1]} ${yArr[1]}, ${xArr[2]} ${yArr[2]}, ${xArr[3]} ${yArr[3]}`
    newPath.setAttribute("d", pathD);
    newPath.setAttribute("stroke", "black");
    newPath.setAttribute("fill", "transparent");
    return newPath;
}