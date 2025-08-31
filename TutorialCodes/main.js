var gl;

function initGL(canvas){
    try{
        gl = canvas.getContext("webgl2");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    }catch(e){}
    if(!gl){
        alert("WebGL initialization failed");
    }
}

function drawScene(){
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearCOlor(0.7, 0.7, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function webGLStart(){
    var canvas = document.getElementById("simpleCanvas");
    initGL(canvas);
    drawScene();
}
