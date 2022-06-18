import _ from 'lodash'

const ATTR_POSITION_NAME = 'a_position';
const ATTR_POSITION_LOC = 0;
const ATTR_NORMAL_NAME = 'a_norm';
const ATTR_NORMAL_LOC = 1;
const ATTR_UV_NAME = 'a_uv';
const ATTR_UV_LOC = 2;


function WebglInstance(canvasId) {
    let canvas = document.getElementById(canvasId);
    let gl = canvas.getContext('webgl2');

    if (!gl) {
        console.error('webgl is not supported on your browser');
        return undefined;
    }

    // Setup custom properties
    gl.mMeshCache = []; // Cache all the mesh structs for easy unloading of buffers
    
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.enable(DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Methods
    // Setup webgl
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Reset the canvas with our set bg colour
    gl.clear = function() { 
        this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
        return this;
    }

    // Create and fill array buffer
    gl.createArrayBuffer = function(floatArr, isStatic) {
        if (isStatic === undefined)
            isStatic = true
        
        var buf = this.createBuffer();
        this.bindBuffer(this.ARRAY_BUFFER, buf);
        this.bufferData(this.ARRAY_BUFFER, floatArr, isStatic ? this.STATIC_DRAW : this.DYNAMIC_DRAW);
        this.bindBuffer(this.ARRAY_BUFFER, undefined);
        return buf;
    }

    // Turns arrays in GL buffers, then sets up a VAO that will predefine the buffers to standard shader attributes
    gl.createMeshVAO = function(name, arrIdx, arrVert, arrNorm, arrUV) {
        var rtn = { drawMode: this.TRIANGLES };

        // Create and bind VAO
        rtn.vao = this.createVertexArray();
        // Bind vertex array so calls to vertexAttribPointer/enableVertexAttribArray are saved to the VAO
        this.bindVertexArray(rtn.vao);

        // Setup vertices
        if (arrVert) {
            // Create buffer
            rtn.bufVertices = this.createBuffer();
            // How big each vertex is
            rtn.vertexComponentLen = 3;
            // How many vertices per array
            rtn.vertexCount = arrVert.length / rtn.vertexComponentLen;

            this.bindBuffer(this.ARRAY_BUFFER, rtn.bufVertices);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(arrVert), this.STATIC_DRAW);
            this.enableVertexAttribArray(ATTR_POSITION_LOC);
            this.vertexAttribPointer(ATTR_POSITION_LOC, 3, this.FLOAT, false, 0, 0);
        }

        // Setup normals
        if (arrNorm) {
            rtn.bufNormals = this.createBuffer();
            this.bindBuffer(this.ARRAY_BUFFER, rtn.bufNormals);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(arrNorm), this.STATIC_DRAW);
            this.enableVertexAttribArray(ATTR_NORMAL_LOC);
            this.vertexAttribPointer(ATTR_NORMAL_LOC, 3, this.FLOAT, false, 0, 0);
        }

        // Setup UVs
        if (arrUV) {
            rtn.bufUV = this.createBuffer();
            this.bindBuffer(this.ARRAY_BUFFER, rtn.bufUV);
            this.bufferData(this.ARRAY_BUFFER, new Float32Array(arrUV), this.STATIC_DRAW);
            this.enableVertexAttribArray(ATTR_UV_LOC);
            this.vertexAttribPointer(ATTR_UV_LOC, 2, this.FLOAT, false, 0, 0);
        }

        // Setup index
        if (arrIdx) {
            rtn.bufIndex = this.createBuffer();
            rtn.indexCount = arrIdx.length;
            this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, rtn.bufIndex);
            this.bufferData(this.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrIdx), this.STATIC_DRAW);
            this.bindBuffer(this.ELEMENT_ARRAY_BUFFER, null);
        }

        // Clean up
        this.bindVertexArray(null);
        this.bindBuffer(this.ARRAY_BUFFER, null);

        this.mMeshCache[name] = rtn;
        return rtn;
    }

    // Setters
    gl.setSize = function(w, h) {
        // Set canvas size
        this.canvas.style.width  = w + 'px';
        this.canvas.style.height = h + 'px';
        this.canvas.width  = w;
        this.canvas.height = h;

        // When updating canvas size, reset vieport of canvas so webgl renders in correct resolution
        this.viewport(0, 0, w, h);
        return this;
    }

    gl.fitScreen = function(wp, hp) {
        return this.setSize(window.innerWidth * (wp || 1), window.innerHeight * (hp || 1));
    }

    return gl;
}