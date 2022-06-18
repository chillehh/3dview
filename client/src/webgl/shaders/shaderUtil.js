class ShaderUtil {
    static domShaderSrc(elementId) {
        var elm = document.getElementById(elementId);
        if (!elm || elm.text == '') {
            console.log(elementId + ' shader not found or no text.');
            return undefined;
        }
        return elm.text;
    }

    static createShader(gl, src, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Error compiling shader: ' + src, gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return undefined;
        }
        return shader;
    }

    static createProgram(gl, vShader, fShader, doValidate) {
        // Link shaders
        var prog = gl.createProgram();
        gl.attachShader(prog, vShader);
        gl.attachShader(prog, fShader);
        gl.linkProgram(prog);

        // Force predefined locations for specific attributes. The default will be -1 if attribute not used in the shader
        gl.bindAttribLocation(prog, ATTR_POSITION_LOC, ATTR_POSITION_NAME);
        gl.bindAttribLocation(prog, ATTR_NORMAL_LOC, ATTR_NORMAL_NAME);
        gl.bindAttribLocation(prog, ATTR_UV_LOC, ATTR_UV_NAME);

        gl.linkProgram(prog);

        // Check success
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error('Error creating shader program: ', gl.getProgramInfoLog(prog));
            gl.deleteProgram(prog);
            return undefined;
        }

        // Only doing for additional debugging
        if (doValidate) {
            gl.validateProgram(prog);
            if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
                console.error('Error validating program: ', gl.getProgramInfoLog(prog));
                return undefined;
            }
        }

        // Can delete the shaders since the program has been made
        gl.detachShader(prog, vShader);
        gl.detachShader(prog, fShader);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);

        return prog;
    }

    static createProgramFromText(gl, vShaderTxt, fShaderTxt, doValidate) {
        var vShader = ShaderUtil.createShader(gl, vShaderTxt, gl.VERTEX_SHADER);
        if (!vShader) {
            return undefined;
        }
        var fShader = ShaderUtil.createShader(gl, fShaderTxt, gl.FRAGMENT_SHADER);
        if (!fShader) {
            gl.deleteShader(vShader);
            return undefined;
        }
        return ShaderUtil.createProgram(gl, vShader, fShader, doValidate);
    }

    // Get the locations of standard attributes that will be used
    static getStandardAttribLocations(gl, program) {
        return {
            position: gl.getAttribLocation(program, ATTR_POSITION_NAME),
            norm:     gl.getAttribLocation(program, ATTR_NORMAL_NAME),
            uv:       gl.getAttribLocation(program, ATTR_UV_NAME)
        }
    }
}