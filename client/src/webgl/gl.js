export const ATTR_POSITION_NAME = 'a_position';
export const ATTR_POSITION_LOC = 0;
export const ATTR_NORMAL_NAME = 'a_norm';
export const ATTR_NORMAL_LOC = 1;
export const ATTR_UV_NAME = 'a_uv';
export const ATTR_UV_LOC = 2;

export class GlUtil {
    // Convert hex colours tp float arrays to batch process a list into one big array
    static rgbArray() {
        if (arguments.length === 0) {
            return undefined;
        }
        var rtn = [];
        for (let i = 0, c, p; i < arguments.length; i++) {
            if (arguments[i].length < 6) {
                continue;
            }
            c = arguments[i];
            p = (c[0] === '#') ? 1 : 0;

            rtn.push(
                parseInt(c[p] + c[p + 1], 16) / 255.0,
                parseInt(c[p + 2] + c[p + 3], 16) / 255.0,
                parseInt(c[p + 4] + c[p + 5], 16) / 255.0
            );
        }
        return rtn;
    }
}

export function WebglInstance(canvasId) {
    let canvas = document.getElementById(canvasId);
    let gl = canvas.getContext('webgl2');

    if (!gl) {
        console.error('webgl is not supported on your browser');
        return undefined;
    }

    // Setup custom properties
    gl.mMeshCache = []; // Cache all the mesh structs for easy unloading of buffers
    gl.mTextureCache = [];
    
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Methods
    // Setup webgl
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Reset the canvas with our set bg colour
    gl.clearData = function() { 
        this.clear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT);
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

    gl.loadTexture = function(name, img, doYFlip) {
        var tex = this.createTexture();
        if (doYFlip) {
            this.pixelStore(this.UNPACK_FLIP_Y_WEBGL, true);
        }
        this.bindTexture(this.TEXTURE_2D, tex);
        this.texImage2D(this.TEXTURE_2D, 0, this.RGBA, this.RGBA, this.UNSIGNED_BYTE, img);

        this.textParameter(this.TEXTURE_2D, this.TEXTURE_MAG_FILTER, this.LINEAR);
        this.textParameter(this.TEXTURE_2D, this.TEXTURE_MIN_FILTER, this.LINEAR_MIPMAP_NEAREST);
        this.generateMipmap(this.TEXTURE_2D);

        this.bindTexture(this, this.TEXTURE_2D, null);
        this.mTextureCache[name] = tex;

        if (doYFlip) {
            this.pixelStore(this.UNPACK_FLIP_Y_WEBGL, false);
        }
        return tex;
    }

    // The imgArr has 6 elements and images placed in a specific order i.e:
    // right, left, top, bottom, back, front
    gl.loadCubeMap = function(name, imgArr) {
        if (imgArr.length !== 6) {
            return undefined;
        }

        // Cube constant values increment, so start at right and add 1 recursively
        var tex = this.createTexture();
        this.bindTexture(this.TEXTURE_CUBE_MAP, tex);

        // Push the image to a specific spot on the cube map
        for (let i = 0; i < 6; i++) {
            this.textImage2D(this.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.RGBA, this.RGBA, this.UNSIGNED_BYTE, imgArr[i]);
        }

        this.textParameter(this.TEXTURE_CUBE_MAP, this.TEXTURE_MAG_FILTER, this.LINEAR); // set up scaling
        this.textParameter(this.TEXTURE_CUBE_MAP, this.TEXTURE_MIN_FILTER, this.LINEAR); // set down scaling
        this.textParameter(this.TEXTURE_CUBE_MAP, this.TEXTURE_WRAP_S, this.CLAMP_TO_EDGE); // stretch image to X pos
        this.textParameter(this.TEXTURE_CUBE_MAP, this.TEXTURE_WRAP_T, this.CLAMP_TO_EDGE); // stretch image ot y pos
        this.textParameter(this.TEXTURE_CUBE_MAP, this.TEXTURE_WRAP_R, this.CLAMP_TO_EDGE); // stretch image ot z pos

        this.bindTexture(this.TEXTURE_CUBE_MAP, null);
        this.mTextureCache[name] = tex;
        return tex;
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