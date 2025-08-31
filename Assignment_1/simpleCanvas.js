let gl;
let shaderProgram;
let mMatrix = mat4.create();
let matrixStack = [];

let uMMatrixLocation, uColorLoc;
let animation;
let rotationAngle = 0;
let rotationSpeed = 0.02;
let translationX = 0;
let translationSpeed = 0.002;
let translationRange = 0.25;
let direction = 1;
let color;
let moonRotation = 0;
let moonRotationSpeed = 0.01;

function pushMatrix(stack, matrix) {
    let copy = mat4.create(matrix);
    stack.push(copy);
}
function popMatrix(stack) {
    if (stack.length == 0) throw "Invalid popMatrix!";
    return stack.pop();
}

// Shaders
function getShader(gl, id) {
    let shaderScript = document.getElementById(id);
    let str = shaderScript.textContent;
    let shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    }
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

// Buffers
let squareBuffer, triangleBuffer, circleBuffer, fanBuffer;

function initSquareBuffer() {
    const vertices = [
        -0.5, 0.5, 0,
         0.5, 0.5, 0,
         0.5, -0.5, 0,
        -0.5, -0.5, 0
    ];
    squareBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareBuffer.itemSize = 3;
    squareBuffer.numItems = 4;
}

function initTriangleBuffer() {
    const vertices = [
        -0.5, -0.5, 0,
         0.5, -0.5, 0,
         0.0, 0.5, 0
    ];
    triangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleBuffer.itemSize = 3;
    triangleBuffer.numItems = 3;
}

function initCircleBuffer(numSegments = 60) {
    let vertices = [0, 0, 0];
    for (let i = 0; i <= numSegments; i++) {
        let angle = (i / numSegments) * 2 * Math.PI;
        vertices.push(Math.cos(angle), Math.sin(angle), 0);
    }
    circleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    circleBuffer.itemSize = 3;
    circleBuffer.numItems = numSegments + 2;
}

function initFanBladesBuffer() {
    const vertices = [
        -0.05, 0, 0,
         0.05, 0, 0,
         0, 0.5, 0
    ];
    fanBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, fanBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    fanBuffer.itemSize = 3;
    fanBuffer.numItems = 3;
}

function getDrawMode(defaultMode) {
    switch (drawMode) {
        case "points": return gl.POINTS;
        case "wireframe": return gl.LINE_LOOP; // or gl.LINES for disconnected edges
        case "solid": return defaultMode;      // TRIANGLES or TRIANGLE_FAN
    }
}

//  Basic Shapes
function drawSquare(color, matrix) {
    gl.uniformMatrix4fv(uMMatrixLocation, false, matrix);
    gl.uniform4fv(uColorLoc, color);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, squareBuffer.numItems);
}
function drawTriangle(color, matrix) {
    gl.uniformMatrix4fv(uMMatrixLocation, false, matrix);
    gl.uniform4fv(uColorLoc, color);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, triangleBuffer.numItems);
}
function drawCircle(color, matrix) {
    gl.uniformMatrix4fv(uMMatrixLocation, false, matrix);
    gl.uniform4fv(uColorLoc, color);
    gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, circleBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, circleBuffer.numItems);
}

// Scene Elements
function drawSky() {
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.0, 0.0, 1.0];
    mMatrix = mat4.scale(mMatrix, [3, 3, 1]);
    drawSquare(color, mMatrix);
    mMatrix = popMatrix(matrixStack);
}
function drawGround() {
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.8, 0.5, 1.0];
    mMatrix = mat4.translate(mMatrix, [0, -0.6, 0]);
    mMatrix = mat4.scale(mMatrix, [3, 1.17, 1]);
    drawSquare(color, mMatrix);
    mMatrix = popMatrix(matrixStack);
}
function drawRiver() {
    // main body
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.4, 1.0, 1.0];
    mMatrix = mat4.translate(mMatrix, [0, -0.17, 0]);
    mMatrix = mat4.scale(mMatrix, [3, 0.25, 1]);
    drawSquare(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    mat4.identity(mMatrix);

    let translations =[
        [-0.7, -0.17, 0.0],
        [0.57, -0.254, 0.0],
        [-0.1, -0.089, 0.0]
    ]

    for (let t of translations) {
        pushMatrix(matrixStack, mMatrix);
        let color = [1, 1, 1, 1.0];
        mMatrix = mat4.translate(mMatrix, t);
        mMatrix = mat4.scale(mMatrix, [0.36, 0.0024, 1.0]);
        drawSquare(color, mMatrix);
        mMatrix = popMatrix(matrixStack);
    }
}
function drawMoon() {
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    let color = [1.0, 1.0, 1.0, 1.0];
    mMatrix = mat4.translate(mMatrix, [-0.6, 0.8, 0]);
    mMatrix = mat4.scale(mMatrix, [0.12, 0.12, 1]);
    drawCircle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    for (let i = 0; i < 8; i++) {
        mat4.identity(mMatrix);
        pushMatrix(matrixStack, mMatrix);

        color = [1, 1, 1, 1];

        mMatrix = mat4.translate(mMatrix, [-0.6, 0.8, 0]);
        mMatrix = mat4.rotate(mMatrix, moonRotation + i * Math.PI / 4, [0, 0, 1]);
        mMatrix = mat4.scale(mMatrix, [0.006, 0.3, 1]);
        drawSquare(color, mMatrix);
        mMatrix = popMatrix(matrixStack);
    }
}

function drawCloud() {

    let pos = [
        [-0.87, 0.52, 1],
        [-0.64, 0.49, 1],
        [-0.48, 0.48, 1]
    ]

    // Different scales for each circle
    let scales = [
        [0.18, 0.11, 1],
        [0.14, 0.08, 1],
        [0.09, 0.06, 1]
    ];

    // Different colors
    let colors = [
        [0.69, 0.69, 0.635, 1.0],
        [0.95, 0.95, 0.95, 1.0],
        [0.69, 0.69, 0.635, 1.0]
    ];

    for (let i = 0; i < 3; i++) {
        mat4.identity(mMatrix);
        pushMatrix(matrixStack, mMatrix);

        mMatrix = mat4.translate(mMatrix, pos[i]);

        mMatrix = mat4.scale(mMatrix, scales[i]);

        drawCircle(colors[i], mMatrix);

        mMatrix = popMatrix(matrixStack);
    }
}

function drawHouse() {
    // Body
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [1.0, 1.0, 1.0, 1.0];
    mMatrix = mat4.translate(mMatrix, [-0.5, -0.6, 0]);
    mMatrix = mat4.scale(mMatrix, [0.48, 0.26, 1]);
    drawSquare(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // Roof
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [1.0, 0.3, 0.0, 1.0];
    mMatrix = mat4.translate(mMatrix, [-0.5, -0.37, 0]);
    mMatrix = mat4.scale(mMatrix, [0.35, 0.22, 1]);
    drawSquare(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // terminal traingles
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [1.0, 0.3, 0.0, 1.0];
    mMatrix = mat4.translate(mMatrix, [-0.322, -0.37, 0]);
    mMatrix = mat4.scale(mMatrix, [0.31, 0.22, 1]);
    drawTriangle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [1.0, 0.3, 0.0, 1.0];
    mMatrix = mat4.translate(mMatrix, [-0.678, -0.37, 0]);
    mMatrix = mat4.scale(mMatrix, [0.31, 0.22, 1]);
    drawTriangle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // windows

    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [1.0, 0.9, 0.0, 1.0];
    mMatrix = mat4.translate(mMatrix, [-0.64, -0.548, 0]);
    mMatrix = mat4.scale(mMatrix, [0.1, 0.09, 1]);
    drawSquare(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [1.0, 0.9, 0.0, 1.0];
    mMatrix = mat4.translate(mMatrix, [-0.35, -0.548, 0]);
    mMatrix = mat4.scale(mMatrix, [0.1, 0.09, 1]);
    drawSquare(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    //door
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [1.0, 0.9, 0.0, 1.0];
    mMatrix = mat4.translate(mMatrix, [-0.49, -0.66, 0]);
    mMatrix = mat4.scale(mMatrix, [0.08, 0.14, 1]);
    drawSquare(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

}
function drawCar() {

    // roof
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.11, 0.227, 0.639, 1.0];
    mMatrix = mat4.translate(mMatrix, [-0.4, -0.79, 0]);
    mMatrix = mat4.scale(mMatrix, [0.17, 0.09, 1]);
    drawCircle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [1.0, 1.0, 1.0, 1.0];
    mMatrix = mat4.translate(mMatrix, [-0.4, -0.79, 0]);
    mMatrix = mat4.scale(mMatrix, [0.2, 0.1, 1]);
    drawSquare(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // border
    for (let dx of [-0.27, -0.53]) {
        mat4.identity(mMatrix);
        pushMatrix(matrixStack, mMatrix);
        color = [0, 0, 0, 1];
        mMatrix = mat4.translate(mMatrix, [dx, -0.94, 0]);
        mMatrix = mat4.scale(mMatrix, [0.05, 0.05, 1]);
        drawCircle(color, mMatrix);
        mMatrix = popMatrix(matrixStack);
    }

    // Wheels
    for (let dx of [-0.27, -0.53]) {
        mat4.identity(mMatrix);
        pushMatrix(matrixStack, mMatrix);
        color = [0.549, 0.561, 0.612, 1];
        mMatrix = mat4.translate(mMatrix, [dx, -0.94, 0]);
        mMatrix = mat4.scale(mMatrix, [0.04, 0.04, 1]);
        drawCircle(color, mMatrix);
        mMatrix = popMatrix(matrixStack);
    }
    // body
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.5, 1.0, 1.0];
    mMatrix = mat4.translate(mMatrix, [-0.4, -0.857, 0]);
    mMatrix = mat4.scale(mMatrix, [0.37, 0.1, 1]);
    drawSquare(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // traingles on both sides
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.5, 1.0, 1.0];
    mMatrix = mat4.translate(mMatrix, [-0.587, -0.858, 0]);
    mMatrix = mat4.scale(mMatrix, [0.15, 0.1, 1]);
    drawTriangle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.5, 1.0, 1.0];
    mMatrix = mat4.translate(mMatrix, [-0.214, -0.858, 0]);
    mMatrix = mat4.scale(mMatrix, [0.15, 0.1, 1]);
    drawTriangle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);
}
function drawTrees() {

    // 1st tree
    // Trunk
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.4, 0.2, 0.1, 1];
    mMatrix = mat4.translate(mMatrix, [0.83, 0.124, 0]);
    mMatrix = mat4.scale(mMatrix, [0.04, 0.3, 1]);
    drawSquare(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // Leaves
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.4, 0.2, 1];
    mMatrix = mat4.translate(mMatrix, [0.83, 0.37, 0]);
    mMatrix = mat4.scale(mMatrix, [0.35, 0.3, 1]);
    drawTriangle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.6, 0.2, 1];
    mMatrix = mat4.translate(mMatrix, [0.83, 0.40, 0]);
    mMatrix = mat4.scale(mMatrix, [0.35, 0.3, 1]);
    drawTriangle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.8, 0.2, 1];
    mMatrix = mat4.translate(mMatrix, [0.83, 0.43, 0]);
    mMatrix = mat4.scale(mMatrix, [0.35, 0.3, 1]);
    drawTriangle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // 2nd tree
    // Trunk
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.4, 0.2, 0.1, 1];
    mMatrix = mat4.translate(mMatrix, [0.6, 0.145, 0]);
    mMatrix = mat4.scale(mMatrix, [0.04, 0.35, 1]);
    drawSquare(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // Leaves
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.4, 0.2, 1];
    mMatrix = mat4.translate(mMatrix, [0.6, 0.43, 0]);
    mMatrix = mat4.scale(mMatrix, [0.35, 0.3, 1]);
    drawTriangle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.6, 0.2, 1];
    mMatrix = mat4.translate(mMatrix, [0.6, 0.46, 0]);
    mMatrix = mat4.scale(mMatrix, [0.35, 0.3, 1]);
    drawTriangle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.8, 0.2, 1];
    mMatrix = mat4.translate(mMatrix, [0.6, 0.49, 0]);
    mMatrix = mat4.scale(mMatrix, [0.35, 0.3, 1]);
    drawTriangle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // 3rd tree
    // Trunk
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.4, 0.2, 0.1, 1];
    mMatrix = mat4.translate(mMatrix, [0.35, 0.11, 0]);
    mMatrix = mat4.scale(mMatrix, [0.04, 0.3, 1]);
    drawSquare(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // Leaves
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.4, 0.2, 1];
    mMatrix = mat4.translate(mMatrix, [0.35, 0.31, 0]);
    mMatrix = mat4.scale(mMatrix, [0.35, 0.2, 1]);
    drawTriangle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.6, 0.2, 1];
    mMatrix = mat4.translate(mMatrix, [0.35, 0.35, 0]);
    mMatrix = mat4.scale(mMatrix, [0.35, 0.2, 1]);
    drawTriangle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.8, 0.2, 1];
    mMatrix = mat4.translate(mMatrix, [0.35, 0.39, 0]);
    mMatrix = mat4.scale(mMatrix, [0.35, 0.2, 1]);
    drawTriangle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

}
function drawBush() {
    // right of the house
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.4, 0.0, 1];
    mMatrix = mat4.translate(mMatrix, [-0.24, -0.59, 0]);
    mMatrix = mat4.scale(mMatrix, [0.07, 0.05, 1]);
    drawCircle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.4, 0.0, 1];
    mMatrix = mat4.translate(mMatrix, [-0.07, -0.59, 0]);
    mMatrix = mat4.scale(mMatrix, [0.07, 0.059, 1]);
    drawCircle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.6, 0.0, 1];
    mMatrix = mat4.translate(mMatrix, [-0.16, -0.59, 0]);
    mMatrix = mat4.scale(mMatrix, [0.1, 0.075, 1]);
    drawCircle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // left of house
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.4, 0.0, 1];
    mMatrix = mat4.translate(mMatrix, [-0.95, -0.63, 0]);
    mMatrix = mat4.scale(mMatrix, [0.07, 0.05, 1]);
    drawCircle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.4, 0.0, 1];
    mMatrix = mat4.translate(mMatrix, [-0.7, -0.63, 0]);
    mMatrix = mat4.scale(mMatrix, [0.07, 0.059, 1]);
    drawCircle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.6, 0.0, 1];
    mMatrix = mat4.translate(mMatrix, [-0.82, -0.63, 0]);
    mMatrix = mat4.scale(mMatrix, [0.11, 0.075, 1]);
    drawCircle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // bottom most
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.4, 0.0, 1];
    mMatrix = mat4.translate(mMatrix, [-0.09, -0.999, 0]);
    mMatrix = mat4.scale(mMatrix, [0.07, 0.05, 1]);
    drawCircle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.4, 0.0, 1];
    mMatrix = mat4.translate(mMatrix, [0.3, -0.999, 0]);
    mMatrix = mat4.scale(mMatrix, [0.08, 0.059, 1]);
    drawCircle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.6, 0.0, 1];
    mMatrix = mat4.translate(mMatrix, [0.1, -0.99, 0]);
    mMatrix = mat4.scale(mMatrix, [0.17, 0.1, 1]);
    drawCircle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // rightmost
     mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.6, 0.0, 1];
    mMatrix = mat4.translate(mMatrix, [0.85, -0.44, 0]);
    mMatrix = mat4.scale(mMatrix, [0.08, 0.07, 1]);
    drawCircle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.0, 0.4, 0.0, 1];
    mMatrix = mat4.translate(mMatrix, [0.98, -0.43, 0]);
    mMatrix = mat4.scale(mMatrix, [0.12, 0.09, 1]);
    drawCircle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);
}

let boat2X = 0;
let boat2Speed = 0.004;
let boat2Range = 0.35;
let boat2Dir = 1;

function drawBoat(translationX, yOffset = 0, scaleFactor = 1, sailColor = [1, 0, 0, 0.9]) {
    mat4.identity(mMatrix);
    mMatrix = mat4.translate(mMatrix, [translationX, yOffset, 0]);

    // Boat base
    pushMatrix(matrixStack, mMatrix);
    let color = [0.83, 0.83, 0.83, 1];
    mMatrix = mat4.translate(mMatrix, [0, -0.15 * scaleFactor, 0]);
    mMatrix = mat4.scale(mMatrix, [0.18 * scaleFactor, 0.06 * scaleFactor, 1]);
    drawSquare(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // Boat sides
    pushMatrix(matrixStack, mMatrix);
    mMatrix = mat4.translate(mMatrix, [-0.09 * scaleFactor, -0.15 * scaleFactor, 0]);
    mMatrix = mat4.rotate(mMatrix, -3.15, [0, 0, 1]);
    mMatrix = mat4.scale(mMatrix, [0.1 * scaleFactor, 0.06 * scaleFactor, 1]);
    drawTriangle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    pushMatrix(matrixStack, mMatrix);
    mMatrix = mat4.translate(mMatrix, [0.09 * scaleFactor, -0.15 * scaleFactor, 0]);
    mMatrix = mat4.rotate(mMatrix, -3.15, [0, 0, 1]);
    mMatrix = mat4.scale(mMatrix, [0.1 * scaleFactor, 0.06 * scaleFactor, 1]);
    drawTriangle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // Vertical pole
    pushMatrix(matrixStack, mMatrix);
    color = [0, 0, 0, 1];
    mMatrix = mat4.translate(mMatrix, [0.01 * scaleFactor, 0.006 * scaleFactor, 0]);
    mMatrix = mat4.scale(mMatrix, [0.01 * scaleFactor, 0.25 * scaleFactor, 1]);
    drawSquare(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // Slanted pole
    pushMatrix(matrixStack, mMatrix);
    mMatrix = mat4.translate(mMatrix, [-0.03 * scaleFactor, -0.01 * scaleFactor, 0]);
    mMatrix = mat4.rotate(mMatrix, 5.9, [0, 0, 1]);
    mMatrix = mat4.scale(mMatrix, [0.005 * scaleFactor, 0.23 * scaleFactor, 1]);
    drawSquare(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // Sail
    pushMatrix(matrixStack, mMatrix);
    mMatrix = mat4.translate(mMatrix, [0.115 * scaleFactor, 0.006 * scaleFactor, 0]);
    mMatrix = mat4.rotate(mMatrix, 4.72, [0, 0, 1]);
    mMatrix = mat4.scale(mMatrix, [0.2 * scaleFactor, 0.2 * scaleFactor, 1]);
    drawTriangle(sailColor, mMatrix);
    mMatrix = popMatrix(matrixStack);
}

function drawFan(angle) {

    // 1st fan
    //stand
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.149, 0.133, 0.133, 1];
    mMatrix = mat4.translate(mMatrix, [0.49, -0.17, 0]);
    mMatrix = mat4.scale(mMatrix, [0.025, 0.37, 1]);
    drawSquare(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // wheel
    for (let i = 0; i < 4; i++) {
        mat4.identity(mMatrix);
        pushMatrix(matrixStack, mMatrix);
        color = [1, 1, 0, 1];
        mMatrix = mat4.translate(mMatrix, [0.49, 0, 0]);  // windmill hub
        mMatrix = mat4.rotate(mMatrix, angle + i * Math.PI / 2, [0, 0, 1]);
        mMatrix = mat4.scale(mMatrix, [0.043, 0.35, 1]);  // thin blade
        drawTriangle(color, mMatrix);
        mMatrix = popMatrix(matrixStack);
    }

    // Draw hub circle
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0, 0,0, 1];
    mMatrix = mat4.translate(mMatrix, [0.49, 0, 0]);
    mMatrix = mat4.scale(mMatrix, [0.025, 0.025, 1]);
    drawCircle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // 2nd fan
    //stand
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.149, 0.133, 0.133, 1];
    mMatrix = mat4.translate(mMatrix, [0.7, -0.25, 0]);
    mMatrix = mat4.scale(mMatrix, [0.025, 0.55, 1]);
    drawSquare(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

    // wheel
    for (let i = 0; i < 4; i++) {
        mat4.identity(mMatrix);
        pushMatrix(matrixStack, mMatrix);
        color = [1, 1, 0, 1];
        mMatrix = mat4.translate(mMatrix, [0.7, 0.03, 0]);  // windmill hub
        mMatrix = mat4.rotate(mMatrix, angle + i * Math.PI / 2, [0, 0, 1]);
        mMatrix = mat4.scale(mMatrix, [0.045, 0.49, 1]);  // thin blade
        drawTriangle(color, mMatrix);
        mMatrix = popMatrix(matrixStack);
    }

    // Draw hub circle
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0, 0,0, 1];
    mMatrix = mat4.translate(mMatrix, [0.7, 0.03, 0]);
    mMatrix = mat4.scale(mMatrix, [0.029, 0.029, 1]);
    drawCircle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);

}

function drawMountain(posX1, posY1, scaleX, scaleY, posX2 = 0, posY2 = 0, isSingle = false) {
    mat4.identity(mMatrix);

    pushMatrix(matrixStack, mMatrix);
    let baseColor = isSingle ? [0.65, 0.46, 0.16, 1.0] : [0.57, 0.36, 0.15, 1.0];
    mMatrix = mat4.translate(mMatrix, [posX1, posY1, 0]);
    mMatrix = mat4.scale(mMatrix, [scaleX, scaleY, 1]);
    drawTriangle(baseColor, mMatrix);
    mMatrix = popMatrix(matrixStack);

    if (!isSingle) {
        pushMatrix(matrixStack, mMatrix);
        let sideColor = [0.65, 0.46, 0.16, 1.0];
        mMatrix = mat4.translate(mMatrix, [posX2, posY2, 0]);
        mMatrix = mat4.rotate(mMatrix, 6.5, [0, 0, 1]);
        mMatrix = mat4.scale(mMatrix, [scaleX, scaleY, 1]);
        drawTriangle(sideColor, mMatrix);
        mMatrix = popMatrix(matrixStack);
    }
}

function drawRoad(){
    mat4.identity(mMatrix);
    pushMatrix(matrixStack, mMatrix);
    color = [0.4, 0.694, 0.188, 1.0];
    mMatrix = mat4.translate(mMatrix, [0.54, -0.8, 0]);
    mMatrix = mat4.rotate(mMatrix, 7.2, [0, 0, 1]);
    mMatrix = mat4.scale(mMatrix, [1.6, 2, 1.0]);
    drawTriangle(color, mMatrix);
    mMatrix = popMatrix(matrixStack);
}

let zoomTime = 0;

function drawStars() {
    zoomTime += 0.05;

    let starPositions = [
        [-0.24, 0.6, 0],
        [0.37, 0.7, 0],
        [-0.1, 0.54, 0],
        [0.6, 0.85, 0],
        [-0.16, 0.45, 0]
    ];

    let squareScales = [
        [0.011, 0.011, 1],
        [0.019, 0.019, 1],
        [0.01, 0.01, 1],
        [0.002, 0.002, 1],
        [0.002, 0.002, 1]
    ];

    let triangleScales = [
        [0.008, 0.026, 1],
        [0.013, 0.034, 1],
        [0.01, 0.027, 1],
        [0.008, 0.024, 1],
        [0.006, 0.02, 1]
    ];

    let color = [1.0, 1.0, 1.0, 1.0];
    let zoomFactor = 1 + 0.26 * Math.sin(zoomTime);

    for (let i = 0; i < 5; i++) {
        // square
        mat4.identity(mMatrix);
        pushMatrix(matrixStack, mMatrix);
        mMatrix = mat4.translate(mMatrix, starPositions[i]);
        mMatrix = mat4.scale(mMatrix, [
            squareScales[i][0] * zoomFactor,
            squareScales[i][1] * zoomFactor,
            1
        ]);
        drawSquare(color, mMatrix);
        mMatrix = popMatrix(matrixStack);

        // 4 traingles
        for (let j = 0; j < 4; j++) {
            mat4.identity(mMatrix);
            pushMatrix(matrixStack, mMatrix);

            mMatrix = mat4.translate(mMatrix, starPositions[i]);
            mMatrix = mat4.rotate(mMatrix, j * Math.PI / 2, [0, 0, 1]);

            let offsetY = (squareScales[i][1] * zoomFactor) / 2 + (triangleScales[i][1] * zoomFactor) / 2;
            mMatrix = mat4.translate(mMatrix, [0, offsetY, 0]);

            mMatrix = mat4.scale(mMatrix, [
                triangleScales[i][0] * zoomFactor,
                triangleScales[i][1] * zoomFactor,
                1
            ]);

            drawTriangle(color, mMatrix);

            mMatrix = popMatrix(matrixStack);
        }
    }
}

// Draw Scene
function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    function animate() {
        moonRotation += moonRotationSpeed;
        rotationAngle += rotationSpeed;
        translationX += translationSpeed * direction;
        if (Math.abs(translationX) > translationRange) direction *= -1;

        boat2X += boat2Speed * boat2Dir;
        if (Math.abs(boat2X) > boat2Range) boat2Dir *= -1;

        drawSky();
        drawMoon();
        drawCloud();
        drawStars();
        drawMountain(-0.6, 0.09, 1.2, 0.4, -0.555, 0.095);
        drawMountain(-0.076, 0.09, 1.8, 0.55, -0.014, 0.096);
        drawMountain(0.7, 0.12, 1.0, 0.3, -0.545, -0.005, true);

        drawGround();
        drawRoad();
        drawRiver();
        drawBush();
        drawHouse()
        drawCar();
        drawTrees();

        drawBoat(boat2X, 0.05, 0.7, [0.651, 0, 1, 1]);     // 2nd boat
        drawBoat(translationX);           // 1st boat

        drawFan(rotationAngle);

        animation = requestAnimationFrame(animate);
    }
    animate();
}

// Init WebGL
function initGL(canvas) {
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {}
    if (!gl) alert("Could not initialise WebGL");
}
function initShaders() {
    let fragmentShader = getShader(gl, "shader-fs");
    let vertexShader = getShader(gl, "shader-vs");
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    gl.useProgram(shaderProgram);
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    return shaderProgram;
}
function webGLStart() {
    let canvas = document.getElementById("scenery");
    initGL(canvas);
    shaderProgram = initShaders();

    uMMatrixLocation = gl.getUniformLocation(shaderProgram, "uMMatrix");
    uColorLoc = gl.getUniformLocation(shaderProgram, "color");

    initSquareBuffer();
    initTriangleBuffer();
    initCircleBuffer();
    initFanBladesBuffer();

    gl.clearColor(0, 0, 0, 1);

    drawScene();
}
