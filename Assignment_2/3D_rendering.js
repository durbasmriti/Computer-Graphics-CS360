// var canvas;
// var gl;

// function initGL(canvas) {
//   try {
//     gl = canvas.getContext("webgl2"); // the webgl2 graphics context
//     gl.viewportWidth = canvas.width; // the width
//     gl.viewportHeight = canvas.height; // the height
//   } catch (e) {}
//   if (!gl) {
//     alert("WebGL initialization failed");
//   }
// }

// function initShaders(vertexShaderCode, fragShaderCode) {
//   shaderProgram = gl.createProgram();

//   var vertexShader = vertexShaderSetup(vertexShaderCode);
//   var fragmentShader = fragmentShaderSetup(fragShaderCode);

//   // attach the shaders
//   gl.attachShader(shaderProgram, vertexShader);
//   gl.attachShader(shaderProgram, fragmentShader);
//   //link the shader program
//   gl.linkProgram(shaderProgram);

//   // check for compilation and linking status
//   if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
//     console.log(gl.getShaderInfoLog(vertexShader));
//     console.log(gl.getShaderInfoLog(fragmentShader));
//   }

//   //finally use the program.
//   gl.useProgram(shaderProgram);

//   return shaderProgram;
// }

// function initSphere(nslices, nstacks, radius) {
//   var theta1, theta2;

//   for (i = 0; i < nslices; i++) {
//     spVerts.push(0);
//     spVerts.push(-radius);
//     spVerts.push(0);

//     spNormals.push(0);
//     spNormals.push(-1.0);
//     spNormals.push(0);
//   }

//   for (j = 1; j < nstacks - 1; j++) {
//     theta1 = (j * 2 * Math.PI) / nslices - Math.PI / 2;
//     for (i = 0; i < nslices; i++) {
//       theta2 = (i * 2 * Math.PI) / nslices;
//       spVerts.push(radius * Math.cos(theta1) * Math.cos(theta2));
//       spVerts.push(radius * Math.sin(theta1));
//       spVerts.push(radius * Math.cos(theta1) * Math.sin(theta2));

//       spNormals.push(Math.cos(theta1) * Math.cos(theta2));
//       spNormals.push(Math.sin(theta1));
//       spNormals.push(Math.cos(theta1) * Math.sin(theta2));
//     }
//   }

//   for (i = 0; i < nslices; i++) {
//     spVerts.push(0);
//     spVerts.push(radius);
//     spVerts.push(0);

//     spNormals.push(0);
//     spNormals.push(1.0);
//     spNormals.push(0);
//   }

//   // setup the connectivity and indices
//   for (j = 0; j < nstacks - 1; j++)
//     for (i = 0; i <= nslices; i++) {
//       var mi = i % nslices;
//       var mi2 = (i + 1) % nslices;
//       var idx = (j + 1) * nslices + mi;
//       var idx2 = j * nslices + mi;
//       var idx3 = j * nslices + mi2;
//       var idx4 = (j + 1) * nslices + mi;
//       var idx5 = j * nslices + mi2;
//       var idx6 = (j + 1) * nslices + mi2;

//       spIndicies.push(idx);
//       spIndicies.push(idx2);
//       spIndicies.push(idx3);
//       spIndicies.push(idx4);
//       spIndicies.push(idx5);
//       spIndicies.push(idx6);
//     }
// }

// function initSphereBuffer() {
//   var nslices = 30; // use even number
//   var nstacks = nslices / 2 + 1;
//   var radius = 1.0;
//   initSphere(nslices, nstacks, radius);

//   spBuf = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, spBuf);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spVerts), gl.STATIC_DRAW);
//   spBuf.itemSize = 3;
//   spBuf.numItems = nslices * nstacks;

//   spNormalBuf = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, spNormalBuf);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spNormals), gl.STATIC_DRAW);
//   spNormalBuf.itemSize = 3;
//   spNormalBuf.numItems = nslices * nstacks;

//   spIndexBuf = gl.createBuffer();
//   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, spIndexBuf);
//   gl.bufferData(
//     gl.ELEMENT_ARRAY_BUFFER,
//     new Uint32Array(spIndicies),
//     gl.STATIC_DRAW
//   );
//   spIndexBuf.itemsize = 1;
//   spIndexBuf.numItems = (nstacks - 1) * 6 * (nslices + 1);
// }

// function drawScene(){
//   // multiple Viewports
//   gl.enable(gl.SCISSOR_TEST);

//   //1st viewport
//   shaderProgram = flatShaderProgram;
//   gl.useProgram(shaderProgram);
//   gl.viewport(0, 0, 400, 400);
//   gl.scissor(0, 0, 400, 400);
//   gl.clearColor(0.85, 0.85, 0.95, 1.0);
//   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
// }

// // Cube generation function with normals
// function initCubeBuffer() {
//   var vertices = [
//     // Front face
//     -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
//     // Back face
//     -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
//     // Top face
//     -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
//     // Bottom face
//     -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
//     // Right face
//     0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5,
//     // Left face
//     -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5,
//   ];
//   buf = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, buf);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//   buf.itemSize = 3;
//   buf.numItems = vertices.length / 3;

//   var normals = [
//     // Front face
//     0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
//     // Back face
//     0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
//     // Top face
//     0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
//     // Bottom face
//     0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
//     // Right face
//     1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
//     // Left face
//     -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
//   ];
//   cubeNormalBuf = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuf);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
//   cubeNormalBuf.itemSize = 3;
//   cubeNormalBuf.numItems = normals.length / 3;


//   var indices = [
//     0,
//     1,
//     2,
//     0,
//     2,
//     3, // Front face
//     4,
//     5,
//     6,
//     4,
//     6,
//     7, // Back face
//     8,
//     9,
//     10,
//     8,
//     10,
//     11, // Top face
//     12,
//     13,
//     14,
//     12,
//     14,
//     15, // Bottom face
//     16,
//     17,
//     18,
//     16,
//     18,
//     19, // Right face
//     20,
//     21,
//     22,
//     20,
//     22,
//     23, // Left face
//   ];
//   indexBuf = gl.createBuffer();
//   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuf);
//   gl.bufferData(
//     gl.ELEMENT_ARRAY_BUFFER,
//     new Uint16Array(indices),
//     gl.STATIC_DRAW
//   );
//   indexBuf.itemSize = 1;
//   indexBuf.numItems = indices.length;
// }

// function drawCube(color) {
//   gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuf);
//   gl.vertexAttribPointer(
//     aPositionLocation,
//     cubeBuf.itemSize,
//     gl.FLOAT,
//     false,
//     0,
//     0
//   );

//   // Normal Buffer
//   gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuf);
//   gl.vertexAttribPointer(
//     aNormalLocation,
//     cubeNormalBuf.itemSize,
//     gl.FLOAT,
//     false,
//     0,
//     0
//   );

//   // draw elementary arrays - triangle indices
//   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuf);

//   gl.uniform4fv(uColorLocation, color);
//   gl.uniformMatrix4fv(uMMatrixLocation, false, mMatrix);
//   gl.uniformMatrix4fv(uVMatrixLocation, false, vMatrix);
//   gl.uniformMatrix4fv(uPMatrixLocation, false, pMatrix);
//   // need to add more lines for shading and lighting

//   gl.drawElements(gl.TRIANGLES, indexBuf.numItems, gl.UNSIGNED_SHORT, 0);
//   //gl.drawArrays(gl.LINE_STRIP, 0, buf.numItems); // show lines
//   //gl.drawArrays(gl.POINTS, 0, buf.numItems); // show points
// }

// // need to add and change
// function onMouseDown(event) {
//   document.addEventListener("mousemove", onMouseMove, false);
//   document.addEventListener("mouseup", onMouseUp, false);
//   document.addEventListener("mouseout", onMouseOut, false);

//   if (
//     event.layerX <= canvas.width &&
//     event.layerX >= 0 &&
//     event.layerY <= canvas.height &&
//     event.layerY >= 0
//   ) {
//     prevMouseX = event.clientX;
//     prevMouseY = canvas.height - event.clientY;
//   }
// }

// // need to add and change
// function onMouseMove(event) {
//   // make mouse interaction only within canvas
//   if (
//     event.layerX <= canvas.width &&
//     event.layerX >= 0 &&
//     event.layerY <= canvas.height &&
//     event.layerY >= 0
//   ) {
//     var mouseX = event.clientX;
//     var diffX1 = mouseX - prevMouseX;
//     prevMouseX = mouseX;
//     degree0 = degree0 + diffX1 / 5;

//     var mouseY = canvas.height - event.clientY;
//     var diffY2 = mouseY - prevMouseY;
//     prevMouseY = mouseY;
//     degree1 = degree1 - diffY2 / 5;

//     drawScene();
//   }
// }

// function onMouseUp(event) {
//   document.removeEventListener("mousemove", onMouseMove, false);
//   document.removeEventListener("mouseup", onMouseUp, false);
//   document.removeEventListener("mouseout", onMouseOut, false);
// }

// function onMouseOut(event) {
//   document.removeEventListener("mousemove", onMouseMove, false);
//   document.removeEventListener("mouseup", onMouseUp, false);
//   document.removeEventListener("mouseout", onMouseOut, false);
// }

// // lightSLider callback function
// var lightSlider;
// function lightSliderChanged(){
//     var lightPos = parseFloat(lightSlider.value);
//     // need to add logic
// }

// // cameraSlider callback function
// var cameraSlider;
// function cameraSliderChanged(){
//     var cameraZ = parseFloat(cameraSlider.value);
//     // need to add logic
// }

// function webGLStart(){
//     canvas = document.getElementById("3DCanvas");
//     document.addEventListener("mousedown", onMouseDown, false);

//     lightSlider = document.getElementById("LightSlider");
//     lightSlider.addEventListener("input", lightSliderChanged);

//     cameraSlider = document.getElementById("ZoomSlider");
//     cameraSlider.addEventListener("input", cameraSliderChanged);

//     initGL(canvas);

//     // initialize shader programs
//     flatShaderProgram = initShaders(flatVertexShaderCode, flatFragmentShadercode);
//     perVertexShaderProgram = initShaders(perVertexShaderCode, perFragmentShaderCode);
//     perFragShaderProgram = initShaders(perFragVertexShaderCode, perFragFragementShaderCode)

//     initCubeBuffer();
//     initSphereBuffer();

//     drawScene();
// }


// var canvas;
// var gl;

// // Global variables for shaders
// var flatShaderProgram;
// var perVertexShaderProgram;
// var perFragShaderProgram;

// // Global variables for geometry buffers
// var cubeBuf;
// var cubeNormalBuf;
// var indexBuf;

// var spBuf;
// var spNormalBuf;
// var spIndexBuf;

// // Global variables for matrices
// var mMatrix = mat4.create();
// var vMatrix = mat4.create();
// var pMatrix = mat4.create();
// var nMatrix = mat4.create();

// // Global variables for lighting
// var lightPosition = [0.0, 5.0, 5.0];
// var lightAmbient = [0.1, 0.1, 0.1, 1.0];
// var lightDiffuse = [0.8, 0.8, 0.8, 1.0];
// var lightSpecular = [1.0, 1.0, 1.0, 1.0];

// // Global variables for camera
// var cameraZ = -10.0;

// // Global variables for interaction
// var prevMouseX = 0;
// var prevMouseY = 0;
// var rotationX = 0;
// var rotationY = 0;
// var selectedViewport = -1; // -1: none, 0: flat, 1: gouraud, 2: phong

// // Global uniform locations
// var uMMatrixLocation;
// var uVMatrixLocation;
// var uPMatrixLocation;
// var uNMatrixLocation;
// var uColorLocation;
// var uLightPosLocation;
// var uLightAmbientLocation;
// var uLightDiffuseLocation;
// var uLightSpecularLocation;
// var uShininessLocation;
// var uCameraPosLocation;
// var uViewMatrix;

// // Shader codes (placeholders)
// var flatVertexShaderCode = `
//     attribute vec3 aPosition;
//     attribute vec3 aNormal;

//     uniform mat4 uMMatrix;
//     uniform mat4 uVMatrix;
//     uniform mat4 uPMatrix;
//     uniform vec4 uColor;

//     uniform vec3 uLightPosition;
//     uniform vec4 uLightAmbient;
//     uniform vec4 uLightDiffuse;
//     uniform vec4 uLightSpecular;

//     varying vec4 vColor;

//     void main(void) {
//         vec3 N = normalize(aNormal);
//         vec3 L = normalize(uLightPosition - aPosition);

//         vec4 ambient = uLightAmbient;
//         vec4 diffuse = uLightDiffuse * max(dot(N, L), 0.0);

//         vColor = uColor * (ambient + diffuse);
//         gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aPosition, 1.0);
//     }
// `;

// var flatFragmentShaderCode = `
//     precision mediump float;
//     varying vec4 vColor;
//     void main(void) {
//         gl_FragColor = vColor;
//     }
// `;

// var perVertexShaderCode = `
//     attribute vec3 aPosition;
//     attribute vec3 aNormal;

//     uniform mat4 uMMatrix;
//     uniform mat4 uVMatrix;
//     uniform mat4 uPMatrix;
//     uniform mat4 uNMatrix;
//     uniform vec4 uColor;

//     uniform vec3 uLightPosition;
//     uniform vec4 uLightAmbient;
//     uniform vec4 uLightDiffuse;
//     uniform vec4 uLightSpecular;
//     uniform float uShininess;
//     uniform vec3 uCameraPos;

//     varying vec4 vColor;

//     void main(void) {
//         vec3 N = normalize(mat3(uNMatrix) * aNormal);
//         vec3 M = (uMMatrix * vec4(aPosition, 1.0)).xyz;
//         vec3 L = normalize(uLightPosition - M);
//         vec3 V = normalize(uCameraPos - M);
//         vec3 H = normalize(L + V);

//         vec4 ambient = uLightAmbient;
//         vec4 diffuse = uLightDiffuse * max(dot(N, L), 0.0);
//         vec4 specular = uLightSpecular * pow(max(dot(N, H), 0.0), uShininess);

//         vColor = uColor * (ambient + diffuse + specular);
//         gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aPosition, 1.0);
//     }
// `;

// var perFragmentShaderCode = `
//     attribute vec3 aPosition;
//     attribute vec3 aNormal;

//     uniform mat4 uMMatrix;
//     uniform mat4 uVMatrix;
//     uniform mat4 uPMatrix;
//     uniform mat4 uNMatrix;

//     uniform vec3 uLightPosition;
//     uniform vec4 uLightAmbient;
//     uniform vec4 uLightDiffuse;
//     uniform vec4 uLightSpecular;
//     uniform float uShininess;
//     uniform vec3 uCameraPos;

//     varying vec3 vNormal;
//     varying vec3 vPosition;

//     void main(void) {
//         vNormal = mat3(uNMatrix) * aNormal;
//         vPosition = (uMMatrix * vec4(aPosition, 1.0)).xyz;
//         gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aPosition, 1.0);
//     }
// `;

// var perFragFragementShaderCode = `
//     precision mediump float;
//     uniform vec4 uColor;

//     uniform vec3 uLightPosition;
//     uniform vec4 uLightAmbient;
//     uniform vec4 uLightDiffuse;
//     uniform vec4 uLightSpecular;
//     uniform float uShininess;
//     uniform vec3 uCameraPos;

//     varying vec3 vNormal;
//     varying vec3 vPosition;

//     void main(void) {
//         vec3 N = normalize(vNormal);
//         vec3 L = normalize(uLightPosition - vPosition);
//         vec3 V = normalize(uCameraPos - vPosition);
//         vec3 H = normalize(L + V);

//         vec4 ambient = uLightAmbient;
//         vec4 diffuse = uLightDiffuse * max(dot(N, L), 0.0);
//         vec4 specular = uLightSpecular * pow(max(dot(N, H), 0.0), uShininess);

//         gl_FragColor = uColor * (ambient + diffuse + specular);
//     }
//  `;

// function initGL(canvas) {
//     try {
//         gl = canvas.getContext("webgl2");
//         gl.viewportWidth = canvas.width;
//         gl.viewportHeight = canvas.height;
//     } catch (e) {}
//     if (!gl) {
//         alert("WebGL initialization failed");
//     }
// }

// function initShaders(vertexShaderCode, fragShaderCode) {
//     var shaderProgram = gl.createProgram();
//     var vertexShader = vertexShaderSetup(vertexShaderCode);
//     var fragmentShader = fragmentShaderSetup(fragShaderCode);

//     gl.attachShader(shaderProgram, vertexShader);
//     gl.attachShader(shaderProgram, fragmentShader);
//     gl.linkProgram(shaderProgram);

//     if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
//         console.log(gl.getShaderInfoLog(vertexShader));
//         console.log(gl.getShaderInfoLog(fragmentShader));
//     }

//     // Get uniform locations
//     shaderProgram.uMMatrixLocation = gl.getUniformLocation(shaderProgram, "uMMatrix");
//     shaderProgram.uVMatrixLocation = gl.getUniformLocation(shaderProgram, "uVMatrix");
//     shaderProgram.uPMatrixLocation = gl.getUniformLocation(shaderProgram, "uPMatrix");
//     shaderProgram.uNMatrixLocation = gl.getUniformLocation(shaderProgram, "uNMatrix");
//     shaderProgram.uColorLocation = gl.getUniformLocation(shaderProgram, "uColor");
//     shaderProgram.uLightPosLocation = gl.getUniformLocation(shaderProgram, "uLightPosition");
//     shaderProgram.uLightAmbientLocation = gl.getUniformLocation(shaderProgram, "uLightAmbient");
//     shaderProgram.uLightDiffuseLocation = gl.getUniformLocation(shaderProgram, "uLightDiffuse");
//     shaderProgram.uLightSpecularLocation = gl.getUniformLocation(shaderProgram, "uLightSpecular");
//     shaderProgram.uShininessLocation = gl.getUniformLocation(shaderProgram, "uShininess");
//     shaderProgram.uCameraPosLocation = gl.getUniformLocation(shaderProgram, "uCameraPos");

//     return shaderProgram;
// }

// function initSphere(nslices, nstacks, radius) {
//     var spVerts = [];
//     var spNormals = [];
//     var spIndicies = [];

//     // Top pole
//     spVerts.push(0); spVerts.push(radius); spVerts.push(0);
//     spNormals.push(0); spNormals.push(1.0); spNormals.push(0);

//     // Stacks
//     for (var j = 1; j < nstacks; j++) {
//         var theta1 = (j * 2 * Math.PI) / (nstacks) - Math.PI / 2;
//         for (var i = 0; i < nslices; i++) {
//             var theta2 = (i * 2 * Math.PI) / nslices;
//             spVerts.push(radius * Math.cos(theta1) * Math.cos(theta2));
//             spVerts.push(radius * Math.sin(theta1));
//             spVerts.push(radius * Math.cos(theta1) * Math.sin(theta2));

//             spNormals.push(Math.cos(theta1) * Math.cos(theta2));
//             spNormals.push(Math.sin(theta1));
//             spNormals.push(Math.cos(theta1) * Math.sin(theta2));
//         }
//     }

//     // Bottom pole
//     spVerts.push(0); spVerts.push(-radius); spVerts.push(0);
//     spNormals.push(0); spNormals.push(-1.0); spNormals.push(0);

//     // Connectivity
//     for (var j = 0; j < nstacks; j++) {
//         for (var i = 0; i < nslices; i++) {
//             var p1 = j * nslices + i + 1;
//             var p2 = j * nslices + (i + 1) % nslices + 1;
//             var p3 = (j + 1) * nslices + (i + 1) % nslices + 1;
//             var p4 = (j + 1) * nslices + i + 1;

//             if (j == 0) {
//                 // Top triangles
//                 spIndicies.push(0); spIndicies.push(p2); spIndicies.push(p1);
//             } else if (j == nstacks - 1) {
//                 // Bottom triangles
//                 spIndicies.push(p4); spIndicies.push(p3); spIndicies.push(nslices * nstacks + 1);
//             } else {
//                 // Quads
//                 spIndicies.push(p1); spIndicies.push(p2); spIndicies.push(p4);
//                 spIndicies.push(p2); spIndicies.push(p3); spIndicies.push(p4);
//             }
//         }
//     }

//     spBuf = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, spBuf);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spVerts), gl.STATIC_DRAW);
//     spBuf.itemSize = 3;
//     spBuf.numItems = spVerts.length / 3;

//     spNormalBuf = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, spNormalBuf);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spNormals), gl.STATIC_DRAW);
//     spNormalBuf.itemSize = 3;
//     spNormalBuf.numItems = spNormals.length / 3;

//     spIndexBuf = gl.createBuffer();
//     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, spIndexBuf);
//     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(spIndicies), gl.STATIC_DRAW);
//     spIndexBuf.itemsize = 1;
//     spIndexBuf.numItems = spIndicies.length;
// }


// function initCubeBuffer() {
//     var vertices = [
//         -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
//         -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
//         -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
//         -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
//         0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5,
//         -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5,
//     ];
//     cubeBuf = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuf);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//     cubeBuf.itemSize = 3;
//     cubeBuf.numItems = vertices.length / 3;

//     var normals = [
//         0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
//         0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
//         0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
//         0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
//         1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
//         -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
//     ];
//     cubeNormalBuf = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuf);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
//     cubeNormalBuf.itemSize = 3;
//     cubeNormalBuf.numItems = normals.length / 3;

//     var indices = [
//         0, 1, 2, 0, 2, 3,
//         4, 5, 6, 4, 6, 7,
//         8, 9, 10, 8, 10, 11,
//         12, 13, 14, 12, 14, 15,
//         16, 17, 18, 16, 18, 19,
//         20, 21, 22, 20, 22, 23,
//     ];
//     indexBuf = gl.createBuffer();
//     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuf);
//     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
//     indexBuf.itemSize = 1;
//     indexBuf.numItems = indices.length;
// }

// function drawCube(color, shininess) {
//     gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuf);
//     gl.vertexAttribPointer(gl.getAttribLocation(gl.program, "aPosition"), cubeBuf.itemSize, gl.FLOAT, false, 0, 0);

//     gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuf);
//     gl.vertexAttribPointer(gl.getAttribLocation(gl.program, "aNormal"), cubeNormalBuf.itemSize, gl.FLOAT, false, 0, 0);

//     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuf);

//     gl.uniform4fv(gl.program.uColorLocation, color);
//     gl.uniform1f(gl.program.uShininessLocation, shininess);

//     gl.uniformMatrix4fv(gl.program.uMMatrixLocation, false, mMatrix);
//     gl.uniformMatrix4fv(gl.program.uVMatrixLocation, false, vMatrix);
//     gl.uniformMatrix4fv(gl.program.uPMatrixLocation, false, pMatrix);
//     gl.uniformMatrix4fv(gl.program.uNMatrixLocation, false, nMatrix);
//     gl.uniform3fv(gl.program.uLightPosLocation, lightPosition);
//     gl.uniform4fv(gl.program.uLightAmbientLocation, lightAmbient);
//     gl.uniform4fv(gl.program.uLightDiffuseLocation, lightDiffuse);
//     gl.uniform4fv(gl.program.uLightSpecularLocation, lightSpecular);
//     gl.uniform3fv(gl.program.uCameraPosLocation, [0, 0, cameraZ]);

//     gl.drawElements(gl.TRIANGLES, indexBuf.numItems, gl.UNSIGNED_SHORT, 0);
// }

// function drawSphere(color, shininess) {
//     gl.bindBuffer(gl.ARRAY_BUFFER, spBuf);
//     gl.vertexAttribPointer(gl.getAttribLocation(gl.program, "aPosition"), spBuf.itemSize, gl.FLOAT, false, 0, 0);

//     gl.bindBuffer(gl.ARRAY_BUFFER, spNormalBuf);
//     gl.vertexAttribPointer(gl.getAttribLocation(gl.program, "aNormal"), spNormalBuf.itemSize, gl.FLOAT, false, 0, 0);

//     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, spIndexBuf);

//     gl.uniform4fv(gl.program.uColorLocation, color);
//     gl.uniform1f(gl.program.uShininessLocation, shininess);

//     gl.uniformMatrix4fv(gl.program.uMMatrixLocation, false, mMatrix);
//     gl.uniformMatrix4fv(gl.program.uVMatrixLocation, false, vMatrix);
//     gl.uniformMatrix4fv(gl.program.uPMatrixLocation, false, pMatrix);
//     gl.uniformMatrix4fv(gl.program.uNMatrixLocation, false, nMatrix);
//     gl.uniform3fv(gl.program.uLightPosLocation, lightPosition);
//     gl.uniform4fv(gl.program.uLightAmbientLocation, lightAmbient);
//     gl.uniform4fv(gl.program.uLightDiffuseLocation, lightDiffuse);
//     gl.uniform4fv(gl.program.uLightSpecularLocation, lightSpecular);
//     gl.uniform3fv(gl.program.uCameraPosLocation, [0, 0, cameraZ]);

//     gl.drawElements(gl.TRIANGLES, spIndexBuf.numItems, gl.UNSIGNED_SHORT, 0);
// }

// function drawScene() {
//     gl.enable(gl.SCISSOR_TEST);
//     gl.enable(gl.DEPTH_TEST);
//     gl.depthFunc(gl.LEQUAL);

//     // --- Viewport 1: Flat Shading ---
//     gl.viewport(0, 0, canvas.width / 3, canvas.height);
//     gl.scissor(0, 0, canvas.width / 3, canvas.height);
//     gl.clearColor(0.85, 0.85, 0.95, 1.0);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//     gl.useProgram(flatShaderProgram);
//     gl.enableVertexAttribArray(gl.getAttribLocation(flatShaderProgram, "aPosition"));
//     gl.enableVertexAttribArray(gl.getAttribLocation(flatShaderProgram, "aNormal"));

//     // Set up projection and view matrices
//     mat4.perspective(pMatrix, 45, (canvas.width / 3) / canvas.height, 0.1, 100.0);
//     mat4.identity(vMatrix);
//     mat4.translate(vMatrix, vMatrix, [0, 0, cameraZ]);
//     mat4.rotateX(vMatrix, vMatrix, rotationX * Math.PI / 180);
//     mat4.rotateY(vMatrix, vMatrix, rotationY * Math.PI / 180);

//     // Draw objects
//     // Draw the stand cube
//     mat4.identity(mMatrix);
//     mat4.translate(mMatrix, mMatrix, [0.0, -1.25, 0.0]);
//     mat4.scale(mMatrix, mMatrix, [1.0, 2.5, 1.0]);
//     drawCube([0.5, 0.5, 0.2, 1.0], 1.0);

//     // Draw the sphere
//     mat4.identity(mMatrix);
//     mat4.translate(mMatrix, mMatrix, [0.0, 0.0, 0.0]);
//     drawSphere([0.1, 0.5, 0.8, 1.0], 1.0);

//     // --- Viewport 2: Gouraud Shading ---
//     gl.viewport(canvas.width / 3, 0, canvas.width / 3, canvas.height);
//     gl.scissor(canvas.width / 3, 0, canvas.width / 3, canvas.height);
//     gl.clearColor(0.95, 0.85, 0.85, 1.0);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//     gl.useProgram(perVertexShaderProgram);
//     gl.enableVertexAttribArray(gl.getAttribLocation(perVertexShaderProgram, "aPosition"));
//     gl.enableVertexAttribArray(gl.getAttribLocation(perVertexShaderProgram, "aNormal"));

//     mat4.perspective(pMatrix, 45, (canvas.width / 3) / canvas.height, 0.1, 100.0);
//     mat4.identity(vMatrix);
//     mat4.translate(vMatrix, vMatrix, [0, 0, cameraZ]);
//     mat4.rotateX(vMatrix, vMatrix, rotationX * Math.PI / 180);
//     mat4.rotateY(vMatrix, vMatrix, rotationY * Math.PI / 180);

//     // Draw objects
//     // Main sphere
//     mat4.identity(mMatrix);
//     mat4.translate(mMatrix, mMatrix, [0.0, -1.0, 0.0]);
//     mat4.scale(mMatrix, mMatrix, [1.5, 1.5, 1.5]);
//     mat4.invert(nMatrix, mMatrix);
//     mat4.transpose(nMatrix, nMatrix);
//     drawSphere([0.8, 0.8, 0.8, 1.0], 100.0);

//     // Green cubes
//     mat4.identity(mMatrix);
//     mat4.translate(mMatrix, mMatrix, [-1.0, 1.0, 0.0]);
//     mat4.scale(mMatrix, mMatrix, [0.75, 0.75, 0.75]);
//     mat4.rotateZ(mMatrix, mMatrix, Math.PI / 4);
//     mat4.invert(nMatrix, mMatrix);
//     mat4.transpose(nMatrix, nMatrix);
//     drawCube([0.0, 0.6, 0.0, 1.0], 10.0);

//     mat4.identity(mMatrix);
//     mat4.translate(mMatrix, mMatrix, [-1.0, 2.0, 0.0]);
//     mat4.scale(mMatrix, mMatrix, [0.5, 0.5, 0.5]);
//     mat4.rotateZ(mMatrix, mMatrix, Math.PI / 4);
//     mat4.invert(nMatrix, mMatrix);
//     mat4.transpose(nMatrix, nMatrix);
//     drawCube([0.0, 0.6, 0.0, 1.0], 10.0);

//     mat4.identity(mMatrix);
//     mat4.translate(mMatrix, mMatrix, [-1.0, 3.0, 0.0]);
//     mat4.scale(mMatrix, mMatrix, [0.25, 0.25, 0.25]);
//     mat4.rotateZ(mMatrix, mMatrix, Math.PI / 4);
//     mat4.invert(nMatrix, mMatrix);
//     mat4.transpose(nMatrix, nMatrix);
//     drawCube([0.8, 0.8, 0.8, 1.0], 10.0);

//     // --- Viewport 3: Phong Shading ---
//     gl.viewport(canvas.width / 3 * 2, 0, canvas.width / 3, canvas.height);
//     gl.scissor(canvas.width / 3 * 2, 0, canvas.width / 3, canvas.height);
//     gl.clearColor(0.85, 0.95, 0.85, 1.0);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//     gl.useProgram(perFragShaderProgram);
//     gl.enableVertexAttribArray(gl.getAttribLocation(perFragShaderProgram, "aPosition"));
//     gl.enableVertexAttribArray(gl.getAttribLocation(perFragShaderProgram, "aNormal"));

//     mat4.perspective(pMatrix, 45, (canvas.width / 3) / canvas.height, 0.1, 100.0);
//     mat4.identity(vMatrix);
//     mat4.translate(vMatrix, vMatrix, [0, 0, cameraZ]);
//     mat4.rotateX(vMatrix, vMatrix, rotationX * Math.PI / 180);
//     mat4.rotateY(vMatrix, vMatrix, rotationY * Math.PI / 180);

//     // Draw objects
//     // Bottom green sphere
//     mat4.identity(mMatrix);
//     mat4.translate(mMatrix, mMatrix, [0.0, -2.5, 0.0]);
//     mat4.scale(mMatrix, mMatrix, [1.5, 1.5, 1.5]);
//     mat4.invert(nMatrix, mMatrix);
//     mat4.transpose(nMatrix, nMatrix);
//     drawSphere([0.0, 0.8, 0.0, 1.0], 250.0);

//     // Middle yellow cube
//     mat4.identity(mMatrix);
//     mat4.translate(mMatrix, mMatrix, [0.0, -1.0, 0.0]);
//     mat4.scale(mMatrix, mMatrix, [1.75, 0.25, 1.75]);
//     mat4.invert(nMatrix, mMatrix);
//     mat4.transpose(nMatrix, nMatrix);
//     drawCube([0.8, 0.8, 0.0, 1.0], 250.0);

//     // Purple sphere
//     mat4.identity(mMatrix);
//     mat4.translate(mMatrix, mMatrix, [0.0, 0.0, 0.0]);
//     mat4.scale(mMatrix, mMatrix, [0.8, 0.8, 0.8]);
//     mat4.invert(nMatrix, mMatrix);
//     mat4.transpose(nMatrix, nMatrix);
//     drawSphere([0.5, 0.1, 0.5, 1.0], 250.0);

//     // Light blue cube
//     mat4.identity(mMatrix);
//     mat4.translate(mMatrix, mMatrix, [0.0, 1.0, 0.0]);
//     mat4.scale(mMatrix, mMatrix, [1.75, 0.25, 1.75]);
//     mat4.invert(nMatrix, mMatrix);
//     mat4.transpose(nMatrix, nMatrix);
//     drawCube([0.1, 0.6, 0.8, 1.0], 250.0);

//     // Top sphere
//     mat4.identity(mMatrix);
//     mat4.translate(mMatrix, mMatrix, [0.0, 2.0, 0.0]);
//     mat4.scale(mMatrix, mMatrix, [0.8, 0.8, 0.8]);
//     mat4.invert(nMatrix, mMatrix);
//     mat4.transpose(nMatrix, nMatrix);
//     drawSphere([0.6, 0.6, 0.8, 1.0], 250.0);
// }

// function onMouseDown(event) {
//     document.addEventListener("mousemove", onMouseMove, false);
//     document.addEventListener("mouseup", onMouseUp, false);
//     document.addEventListener("mouseout", onMouseOut, false);

//     prevMouseX = event.clientX;
//     prevMouseY = event.clientY;

//     // Detect which viewport is selected
//     var x = event.layerX;
//     if (x >= 0 && x < canvas.width / 3) {
//         selectedViewport = 0;
//     } else if (x >= canvas.width / 3 && x < canvas.width / 3 * 2) {
//         selectedViewport = 1;
//     } else {
//         selectedViewport = 2;
//     }
// }

// function onMouseMove(event) {
//     if (event.layerX <= canvas.width && event.layerX >= 0 &&
//         event.layerY <= canvas.height && event.layerY >= 0) {

//         var diffX = event.clientX - prevMouseX;
//         var diffY = event.clientY - prevMouseY;
//         prevMouseX = event.clientX;
//         prevMouseY = event.clientY;

//         rotationY = rotationY + diffX / 5;
//         rotationX = rotationX + diffY / 5;

//         drawScene();
//     }
// }

// function onMouseUp(event) {
//     document.removeEventListener("mousemove", onMouseMove, false);
//     document.removeEventListener("mouseup", onMouseUp, false);
//     document.removeEventListener("mouseout", onMouseOut, false);
// }

// function onMouseOut(event) {
//     document.removeEventListener("mousemove", onMouseMove, false);
//     document.removeEventListener("mouseup", onMouseUp, false);
//     document.removeEventListener("mouseout", onMouseOut, false);
// }

// // Slider callback functions
// var lightSlider;
// function lightSliderChanged() {
//     lightPosition[0] = parseFloat(lightSlider.value);
//     drawScene();
// }

// var cameraSlider;
// function cameraSliderChanged() {
//     cameraZ = parseFloat(cameraSlider.value);
//     drawScene();
// }

// function webGLStart() {
//     canvas = document.getElementById("3DCanvas");
//     document.addEventListener("mousedown", onMouseDown, false);

//     lightSlider = document.getElementById("LightSlider");
//     lightSlider.addEventListener("input", lightSliderChanged);
//     lightSlider.value = lightPosition[0];

//     cameraSlider = document.getElementById("ZoomSlider");
//     cameraSlider.addEventListener("input", cameraSliderChanged);
//     cameraSlider.value = cameraZ;

//     initGL(canvas);

//     // Initialize shader programs
//     flatShaderProgram = initShaders(flatVertexShaderCode, flatFragmentShaderCode);
//     perVertexShaderProgram = initShaders(perVertexShaderCode, flatFragmentShaderCode); // Gouraud uses flat fragment shader
//     perFragShaderProgram = initShaders(perFragmentShaderCode, perFragFragementShaderCode);

//     initCubeBuffer();
//     initSphere(30, 16, 1.0); // Correct sphere initialization

//     drawScene();
// }



// Global WebGL variables
var gl;
var canvas;

// Scene state variables
var flatSceneRotX = 0.0;
var flatSceneRotY = 0.0;
var gouraudSceneRotX = 0.0;
var gouraudSceneRotY = 0.0;
var phongSceneRotX = 0.0;
var phongSceneRotY = 0.0;
var prevMouseX = 0.0;
var prevMouseY = 0.0;

// Shading programs
var flatShaderProgram;
var gouraudShaderProgram;
var phongShaderProgram;

// Vertex and buffer data for sphere and cube
var sphereVertexBuffer;
var sphereIndexBuffer;
var sphereNormalBuffer;
var cubeVertexBuffer;
var cubeIndexBuffer;
var cubeNormalBuffer;

var matrixStack = [];
var sphereVertices = [];
var sphereIndices = [];
var sphereNormals = [];

// Matrix transformations
var modelMatrix = mat4.create();
var viewMatrix = mat4.create();
var projectionMatrix = mat4.create();
var normalMatrix = mat3.create();

// Lighting and camera properties
var lightPosition = [0.0, 5.0, 5.0];
var cameraPosition = [0.0, 0.0, 10.0];
var centerOfInterest = [0.0, 0.0, 0.0];
var upVector = [0.0, 1.0, 0.0];

// Shaders for Flat Shading (Per-Face)
const flatVertexShaderSource = `#version 300 es
in vec3 a_position;
in vec3 a_normal;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
out vec3 v_position_eye_space;
void main() {
    mat4 mvpMatrix = u_projection * u_view * u_model;
    v_position_eye_space = (u_view * u_model * vec4(a_position, 1.0)).xyz;
    gl_Position = mvpMatrix * vec4(a_position, 1.0);
}`;

const flatFragmentShaderSource = `#version 300 es
precision mediump float;
in vec3 v_position_eye_space;
uniform vec3 u_light_position;
uniform vec3 u_ambient_color;
uniform vec3 u_diffuse_color;
uniform vec3 u_specular_color;
uniform vec3 u_object_color;
uniform float u_shininess;
out vec4 out_color;
void main() {
    vec3 normal = normalize(cross(dFdx(v_position_eye_space), dFdy(v_position_eye_space)));
    vec3 lightDir = normalize(u_light_position - v_position_eye_space);
    vec3 eyeDir = normalize(-v_position_eye_space);
    vec3 reflectionDir = normalize(reflect(-lightDir, normal));
    float ambientFactor = 0.3;
    float diffuseFactor = max(dot(normal, lightDir), 0.0);
    float specularFactor = pow(max(dot(eyeDir, reflectionDir), 0.0), u_shininess);
    vec3 finalLight = u_ambient_color * ambientFactor + u_diffuse_color * diffuseFactor + u_specular_color * specularFactor;
    out_color = vec4(u_object_color * finalLight, 1.0);
}`;

// Shaders for Gouraud Shading (Per-Vertex)
const gouraudVertexShaderSource = `#version 300 es
in vec3 a_position;
in vec3 a_normal;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat3 u_normal_matrix;
uniform vec3 u_light_position;
uniform vec3 u_ambient_color;
uniform vec3 u_diffuse_color;
uniform vec3 u_specular_color;
uniform vec3 u_object_color;
uniform float u_shininess;
out vec4 v_color;
void main() {
    vec3 position_eye_space = (u_view * u_model * vec4(a_position, 1.0)).xyz;
    vec3 normal_eye_space = normalize(u_normal_matrix * a_normal);
    vec3 lightDir = normalize(u_light_position - position_eye_space);
    vec3 eyeDir = normalize(-position_eye_space);
    vec3 reflectionDir = normalize(reflect(-lightDir, normal_eye_space));
    float ambientFactor = 0.3;
    float diffuseFactor = max(dot(normal_eye_space, lightDir), 0.0);
    float specularFactor = pow(max(dot(eyeDir, reflectionDir), 0.0), u_shininess);
    vec3 finalLight = u_ambient_color * ambientFactor + u_diffuse_color * diffuseFactor + u_specular_color * specularFactor;
    v_color = vec4(u_object_color * finalLight, 1.0);
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
}`;

const gouraudFragmentShaderSource = `#version 300 es
precision mediump float;
in vec4 v_color;
out vec4 out_color;
void main() {
    out_color = v_color;
}`;

// Shaders for Phong Shading (Per-Fragment)
const phongVertexShaderSource = `#version 300 es
in vec3 a_position;
in vec3 a_normal;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat3 u_normal_matrix;
out vec3 v_normal;
out vec3 v_pos_eye;
void main() {
    vec4 position_eye_space = u_view * u_model * vec4(a_position, 1.0);
    v_normal = u_normal_matrix * a_normal;
    v_pos_eye = position_eye_space.xyz;
    gl_Position = u_projection * position_eye_space;
}`;

const phongFragmentShaderSource = `#version 300 es
precision mediump float;
in vec3 v_normal;
in vec3 v_pos_eye;
uniform vec3 u_light_position;
uniform vec3 u_ambient_color;
uniform vec3 u_diffuse_color;
uniform vec3 u_specular_color;
uniform vec3 u_object_color;
uniform float u_shininess;
out vec4 out_color;
void main() {
    vec3 normal = normalize(v_normal);
    vec3 lightDir = normalize(u_light_position - v_pos_eye);
    vec3 eyeDir = normalize(-v_pos_eye);
    vec3 reflectionDir = normalize(reflect(-lightDir, normal));
    float ambientFactor = 0.3;
    float diffuseFactor = max(dot(normal, lightDir), 0.0);
    float specularFactor = pow(max(dot(eyeDir, reflectionDir), 0.0), u_shininess);
    vec3 finalLight = u_ambient_color * ambientFactor + u_diffuse_color * diffuseFactor + u_specular_color * specularFactor;
    out_color = vec4(u_object_color * finalLight, 1.0);
}`;

function initGL(canvas) {
    try {
        gl = canvas.getContext("webgl2");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
        alert("WebGL initialization failed.");
    }
}

function getShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Shader compilation failed: " + gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

function initShaders(vertexSource, fragmentSource) {
    const program = gl.createProgram();
    gl.attachShader(program, getShader(gl, vertexSource, gl.VERTEX_SHADER));
    gl.attachShader(program, getShader(gl, fragmentSource, gl.FRAGMENT_SHADER));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("Shader program linking failed.");
    }
    return program;
}

function initCubeBuffers() {
    const vertices = [
        -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
        -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
        -1, 1, -1, 1, 1, -1, 1, 1, 1, -1, 1, 1,
        -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,
        1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1,
        -1, -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1,
    ];
    cubeVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cubeVertexBuffer.itemSize = 3;
    cubeVertexBuffer.numItems = 24;

    const normals = [
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
        0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
    ];
    cubeNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    cubeNormalBuffer.itemSize = 3;
    cubeNormalBuffer.numItems = 24;

    const indices = [
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23,
    ];
    cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    cubeIndexBuffer.itemSize = 1;
    cubeIndexBuffer.numItems = 36;
}

function initSphereData(lats, longs) {
    sphereVertices = [];
    sphereIndices = [];
    sphereNormals = [];

    for (var latNumber = 0; latNumber <= lats; latNumber++) {
        var theta = latNumber * Math.PI / lats;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        for (var longNumber = 0; longNumber <= longs; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longs;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;

            sphereNormals.push(x);
            sphereNormals.push(y);
            sphereNormals.push(z);
            sphereVertices.push(x);
            sphereVertices.push(y);
            sphereVertices.push(z);
        }
    }
    for (var latNumber = 0; latNumber < lats; latNumber++) {
        for (var longNumber = 0; longNumber < longs; longNumber++) {
            var first = (latNumber * (longs + 1)) + longNumber;
            var second = first + longs + 1;
            sphereIndices.push(first);
            sphereIndices.push(second);
            sphereIndices.push(first + 1);
            sphereIndices.push(second);
            sphereIndices.push(second + 1);
            sphereIndices.push(first + 1);
        }
    }
}

function initSphereBuffers() {
    initSphereData(30, 30);
    sphereVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereVertices), gl.STATIC_DRAW);
    sphereVertexBuffer.itemSize = 3;
    sphereVertexBuffer.numItems = sphereVertices.length / 3;

    sphereNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereNormals), gl.STATIC_DRAW);
    sphereNormalBuffer.itemSize = 3;
    sphereNormalBuffer.numItems = sphereNormals.length / 3;

    sphereIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereIndices), gl.STATIC_DRAW);
    sphereIndexBuffer.itemSize = 1;
    sphereIndexBuffer.numItems = sphereIndices.length;
}
function drawObject(isCube, color, shininess, program) {
    // --- Attribute locations ---
    const aPositionLocation = gl.getAttribLocation(program, "a_position");
    const aNormalLocation   = gl.getAttribLocation(program, "a_normal");

    // --- Uniform locations ---
    const uModelLocation        = gl.getUniformLocation(program, "u_model");
    const uViewLocation         = gl.getUniformLocation(program, "u_view");
    const uProjectionLocation   = gl.getUniformLocation(program, "u_projection");
    const uNormalMatrixLocation = gl.getUniformLocation(program, "u_normal_matrix");

    const uLightPositionLocation = gl.getUniformLocation(program, "u_light_position");
    const uAmbientColorLocation  = gl.getUniformLocation(program, "u_ambient_color");
    const uDiffuseColorLocation  = gl.getUniformLocation(program, "u_diffuse_color");
    const uSpecularColorLocation = gl.getUniformLocation(program, "u_specular_color");
    const uObjectColorLocation   = gl.getUniformLocation(program, "u_object_color");
    const uShininessLocation     = gl.getUniformLocation(program, "u_shininess");

    // --- Bind geometry ---
    if (isCube) {
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
        gl.vertexAttribPointer(aPositionLocation, cubeVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPositionLocation);

        if (aNormalLocation !== -1) {
            gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
            gl.vertexAttribPointer(aNormalLocation, cubeNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aNormalLocation);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexBuffer);
        gl.vertexAttribPointer(aPositionLocation, sphereVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPositionLocation);

        if (aNormalLocation !== -1) {
            gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalBuffer);
            gl.vertexAttribPointer(aNormalLocation, sphereNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aNormalLocation);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);
    }

    // --- Send matrices ---
    if (uModelLocation)      gl.uniformMatrix4fv(uModelLocation, false, modelMatrix);
    if (uViewLocation)       gl.uniformMatrix4fv(uViewLocation, false, viewMatrix);
    if (uProjectionLocation) gl.uniformMatrix4fv(uProjectionLocation, false, projectionMatrix);

    if (uNormalMatrixLocation) {
        let normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(uNormalMatrixLocation, false, normalMatrix);
    }

    // --- Lighting uniforms ---
    if (uLightPositionLocation) gl.uniform3fv(uLightPositionLocation, lightPosition);
    if (uAmbientColorLocation)  gl.uniform3fv(uAmbientColorLocation, [0.3, 0.3, 0.3]);
    if (uDiffuseColorLocation)  gl.uniform3fv(uDiffuseColorLocation, [0.7, 0.7, 0.7]);
    if (uSpecularColorLocation) gl.uniform3fv(uSpecularColorLocation, [1.0, 1.0, 1.0]);
    if (uObjectColorLocation)   gl.uniform3fv(uObjectColorLocation, color);
    if (uShininessLocation)     gl.uniform1f(uShininessLocation, shininess);

    // --- Draw call ---
    if (isCube) {
        gl.drawElements(gl.TRIANGLES, cubeIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    } else {
        gl.drawElements(gl.TRIANGLES, sphereIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}


function drawFlatScene() {
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -10.0]);
    mat4.rotateX(modelMatrix, modelMatrix, flatSceneRotY);
    mat4.rotateY(modelMatrix, modelMatrix, flatSceneRotX);

    // Bottom cube (base)
    pushMatrix(matrixStack, modelMatrix);
    mat4.scale(modelMatrix, modelMatrix, [2.0, 0.5, 2.0]);
    drawObject(true, [0.8, 0.8, 0.8], 32.0, flatShaderProgram);
    modelMatrix = popMatrix(matrixStack);

    // Middle cube
    pushMatrix(matrixStack, modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [0.0, 0.75, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [1.5, 0.5, 1.5]);
    drawObject(true, [0.6, 0.6, 0.6], 32.0, flatShaderProgram);
    modelMatrix = popMatrix(matrixStack);

    // Top cube
    pushMatrix(matrixStack, modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [0.0, 1.5, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [1.0, 0.5, 1.0]);
    drawObject(true, [0.4, 0.4, 0.4], 32.0, flatShaderProgram);
    modelMatrix = popMatrix(matrixStack);
}

function drawGouraudScene() {
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -10.0]);
    mat4.rotateX(modelMatrix, modelMatrix, gouraudSceneRotY);
    mat4.rotateY(modelMatrix, modelMatrix, gouraudSceneRotX);

    // Bottom sphere
    pushMatrix(matrixStack, modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [0.0, -1.5, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [2.0, 2.0, 2.0]);
    drawObject(false, [0.2, 0.7, 0.3], 32.0, gouraudShaderProgram);
    modelMatrix = popMatrix(matrixStack);

    // Middle spheres
    pushMatrix(matrixStack, modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [-1.5, 0.5, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [1.0, 1.0, 1.0]);
    drawObject(false, [0.8, 0.2, 0.2], 32.0, gouraudShaderProgram);
    modelMatrix = popMatrix(matrixStack);

    pushMatrix(matrixStack, modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [1.5, 0.5, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [1.0, 1.0, 1.0]);
    drawObject(false, [0.2, 0.3, 0.8], 32.0, gouraudShaderProgram);
    modelMatrix = popMatrix(matrixStack);

    // Top sphere
    pushMatrix(matrixStack, modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [0.0, 2.0, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [1.5, 1.5, 1.5]);
    drawObject(false, [0.8, 0.8, 0.2], 32.0, gouraudShaderProgram);
    modelMatrix = popMatrix(matrixStack);
}

function drawPhongScene() {
    mat4.identity(modelMatrix);
    mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -10.0]);
    mat4.rotateX(modelMatrix, modelMatrix, phongSceneRotY);
    mat4.rotateY(modelMatrix, modelMatrix, phongSceneRotX);

    // Central sphere
    pushMatrix(matrixStack, modelMatrix);
    mat4.scale(modelMatrix, modelMatrix, [3.0, 3.0, 3.0]);
    drawObject(false, [0.1, 0.4, 0.6], 250.0, phongShaderProgram);
    modelMatrix = popMatrix(matrixStack);

    // Orbiting cube 1
    pushMatrix(matrixStack, modelMatrix);
    mat4.rotateY(modelMatrix, modelMatrix, Date.now() * 0.001);
    mat4.translate(modelMatrix, modelMatrix, [5.0, 0.0, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.7, 0.7, 0.7]);
    drawObject(true, [0.8, 0.2, 0.1], 250.0, phongShaderProgram);
    modelMatrix = popMatrix(matrixStack);

    // Orbiting cube 2
    pushMatrix(matrixStack, modelMatrix);
    mat4.rotateZ(modelMatrix, modelMatrix, Date.now() * 0.0005);
    mat4.translate(modelMatrix, modelMatrix, [-3.0, 3.0, 0.0]);
    mat4.scale(modelMatrix, modelMatrix, [0.5, 0.5, 0.5]);
    drawObject(true, [0.3, 0.8, 0.1], 250.0, phongShaderProgram);
    modelMatrix = popMatrix(matrixStack);
}

function drawAllScenes() {
    gl.enable(gl.SCISSOR_TEST);
    gl.enable(gl.DEPTH_TEST);

    mat4.identity(viewMatrix);
    mat4.lookAt(viewMatrix, cameraPosition, centerOfInterest, upVector);
    mat4.identity(projectionMatrix);
    mat4.perspective(projectionMatrix, Math.PI/3, 1.0, 0.1, 100.0);

    const width = gl.viewportWidth/3;
    const height = gl.viewportHeight;
    // Left Viewport (Flat Shading)
    gl.useProgram(flatShaderProgram);
    gl.viewport(0, 0, width, height);
    gl.scissor(0, 0, width, height);
    gl.clearColor(0.8, 0.8, 0.95, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawFlatScene();

    // Middle Viewport (Gouraud Shading)
    gl.useProgram(gouraudShaderProgram);
    gl.viewport(width, 0, width, height);
    gl.scissor(width, 0, width, height);
    gl.clearColor(0.95, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawGouraudScene();

    // Right Viewport (Phong Shading)
    gl.useProgram(phongShaderProgram);
    gl.viewport(2*width, 0, width, height);
    gl.scissor(2*width, 0, width, height);
    gl.clearColor(0.8, 0.95, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawPhongScene();

    requestAnimationFrame(drawAllScenes);
}

function onMouseDown(event) {
    document.addEventListener("mousemove", onMouseMove, false);
    document.addEventListener("mouseup", onMouseUp, false);
    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
}

function onMouseMove(event) {
    const deltaX = (event.clientX - prevMouseX) * 0.01;
    const deltaY = (event.clientY - prevMouseY) * 0.01;

    const regionWidth = canvas.width/3;
    if (event.clientX < regionWidth) {
        flatSceneRotX += deltaX;
        flatSceneRotY += deltaY;
    } else if (event.clientX < 2*regionWidth) {
        gouraudSceneRotX += deltaX;
        gouraudSceneRotY += deltaY;
    } else {
        phongSceneRotX += deltaX;
        phongSceneRotY += deltaY;
    }
    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
}

function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove, false);
    document.removeEventListener("mouseup", onMouseUp, false);
}

function updateLightPosition(event) {
    lightPosition[0] = parseFloat(event.target.value);
}

function updateCameraZoom(event) {
    cameraPosition[2] = parseFloat(event.target.value);
}

function pushMatrix(stack, m) {
    var copy = mat4.create();
    mat4.set(m, copy);   // for glMatrix 0.9.5
    stack.push(copy);
}

function popMatrix(stack) {
    if (stack.length > 0) return stack.pop();
    else console.log("stack has no matrix to pop!");
}

function webGLStart() {
    canvas = document.getElementById("3DCanvas");
    initGL(canvas);

    document.addEventListener("mousedown", onMouseDown, false);
    document.getElementById("LightSLider").addEventListener("input", updateLightPosition);
    document.getElementById("ZoomSLider").addEventListener("input", updateCameraZoom);

    flatShaderProgram = initShaders(flatVertexShaderSource, flatFragmentShaderSource);
    gouraudShaderProgram = initShaders(gouraudVertexShaderSource, gouraudFragmentShaderSource);
    phongShaderProgram = initShaders(phongVertexShaderSource, phongFragmentShaderSource);
    initCubeBuffers();
    initSphereBuffers();

    drawAllScenes();
}