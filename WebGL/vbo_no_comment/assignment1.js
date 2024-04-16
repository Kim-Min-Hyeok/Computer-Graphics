function showTriangle() {
    
    // 사용할 canvas 지정 및 webgl2 사용할 것으로 세팅
    const canvas = document.getElementById('demo-canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        const isWebGl1Supported = !!(document.createElement('canvas')).getContext('webgl');
        if (isWebGl1Supported) {
            showError('WebGL 1 is supported, but not v2 - try using a different device or browser');
        } 
        else {
            showError('WebGL is not supported on this device - try using a different device or browser');
        }
        return;
    }
    
    // compile 해야 할 vertexShader 파일
    const vertexShaderSourceCode = `#version 300 es
    precision mediump float;

    in vec3 vertexPosition;

    void main() {
        gl_Position = vec4(vertexPosition, 1.0);
    }`;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER); // shader 생성
    gl.shaderSource(vertexShader, vertexShaderSourceCode); // shader에 대한 코드 지정
    gl.compileShader(vertexShader); // shader 컴파일
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        const errorMessage = gl.getShaderInfoLog(vertexShader);
        showError(`Failed to compile vertex shader: ${errorMessage}`);
        return;
    }

    // compile 해야 할 fragmentShader 파일
    const fragmentShaderSourceCode = `#version 300 es
    precision mediump float;

    out vec4 outputColor;

    void main() {
        outputColor = vec4(0.294, 0.0, 0.51, 1.0);
    }`;

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); // shader 생성
    gl.shaderSource(fragmentShader, fragmentShaderSourceCode); // shade에 대한 코드 지정
    gl.compileShader(fragmentShader); // shader 컴파일
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        const errorMessage = gl.getShaderInfoLog(fragmentShader);
        showError(`Failed to compile fragment shader: ${errorMessage}`);
        return;
    }

    const TriangleProgram = gl.createProgram();
    gl.attachShader(TriangleProgram, vertexShader);
    gl.attachShader(TriangleProgram, fragmentShader);
    gl.linkProgram(TriangleProgram);
    if (!gl.getProgramParameter(TriangleProgram, gl.LINK_STATUS)) {
        const errorMessage = gl.getProgramInfoLog(TriangleProgram);
        showError(`Failed to link GPU program: ${errorMessage}`);
        return;
    }
    
    const vertices = new Float32Array([ // 3-dimensional data
        // 기존 삼각형
        -0.9, -0.9, 0.0,
        0.85, -0.9, 0.0,
        -0.9, 0.85, 0.0,

        //두번째 삼각형
        0.9, 0.9, 0.0,
        -0.85, 0.9, 0.0,
        0.9, -0.85, 0.0,
    ]);

    // Create a Buffer Object (BO) containing the vertices thus named "Vertex BUffer Object (VBO)" in OpenGL
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Binding the data means to set the data
    const vertexPositionAttributeLocation = gl.getAttribLocation(TriangleProgram, 'vertexPosition');
    if (vertexPositionAttributeLocation < 0) {
        showError(`Failed to get attribute location for vertexPosition`);
        return;
    }

    // Set up GPU program
    gl.useProgram(TriangleProgram);
    gl.enableVertexAttribArray(vertexPositionAttributeLocation);

    // Input assembler (how to read vertex information from buffer?)
    gl.vertexAttribPointer( vertexPositionAttributeLocation, 3, gl.FLOAT, false, 3* Float32Array.BYTES_PER_ELEMENT, 0);

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Rasterizer
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, 6); // 총 6개의 vertices
}
try {
  showTriangle();
} 
catch (e) {
  showError(`Uncaught JavaScript exception: ${e}`);
}


