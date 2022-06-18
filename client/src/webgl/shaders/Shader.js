class Shader {
    constructor(gl, vertShaderSrc, fragShaderSrc) {
        this.program = ShaderUtil.createProgramFromText(gl, vertShaderSrc, fragShaderSrc, true);

        if (this.program) {
            this.gl = gl;
            gl.useProgram(this.program);
            this.attribLoc = ShaderUtil.getStandardAttribLocations(gl, this.program);
            this.uniformLoc = ShaderUtil.getStandardAttribLocations(gl, this.program);
        }
    }

    // Methods
    activate() { this.gl.useProgram(this.program); return this; }
    deactivate() { this.gl.useProgram(null); return this; }

    setPerspective(matData) { this.gl.uniformMatrix4fv(this.uniformLoc.perspective, false, matData); return this; }
    setModelMatrix(matData) { this.gl.uniformMatrix4fv(this.uniformLoc.modelMatrix, false, matData); return this; }
    setCameraMatrix(matData) { this.gl.uniformMatrix4fv(this.uniformLoc.cameraMatrix, false, matData); return this; }

    // Cleans up resources when shader is no longer needed
    dispose() {
        // unbind active program
        if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program)
            this.gl.useProgram(null);
        this.gl.deleteProgram(this.program);
    }

    preRender() {}

    // Handle rendering a model
    renderModel(model) {
        this.setModelMatrix(model.transform.getViewMatrix());
        this.gl.bindVertextArray(model.mesh.vao);

        if (model.mesh.indexCount) {
            this.gl.drawElements(model.mesh.drawMode, model.mesh.indexLength, gl.UNSIGNED_SHORT, 0);
        } else {
            this.gl.drawArrays(model.mesh.drawMode, 0, modal.mesh.vertextCount);
        }

        this.gl.bindVertextArray(null);
        return this;
    }
}