/* www.youtube.com/CodeExplained */

// SELECT CHART ELEMENT
const chart = document.querySelector(".circle");

// CREATE CANVAS ELEMMENT
const canvas = document.createElement("canvas");
canvas.width = 50;
canvas.height = 50;

// APPEND CANVAS TO CHART ELEMENT
chart.appendChild(canvas);

// TO DRAW ON CANVAS, WE NEED TO GET CONTEXT OF CANVAS
const ctx = canvas.getContext("2d");

// CHANGE THE LINE WIDTH
ctx.lineWidth = 8;

// CIRCLE RADIUS
const R = 20;

export function drawCircle(color, ratio, anticlockwise){

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc( canvas.width/2, canvas.height/2, R, 0, ratio * 2 * Math.PI, anticlockwise);
    ctx.stroke();
}

export function updateCircle ( increase, decrease){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let ratio = increase / (increase + decrease);

    drawCircle("#FFFFFF", - ratio, true);
    drawCircle("#F0624D", 1 - ratio, false);
}