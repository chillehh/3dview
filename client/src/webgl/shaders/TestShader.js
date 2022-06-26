import { vertex_shader, fragment_shader } from '@/webgl/shaders/basicShaders.js'
import { Shader } from '@/webgl/shaders/Shader.js'
import { GlUtil } from '../gl';

export class TestShader extends Shader{
    constructor(gl, pMatrix){
        super(gl, vertex_shader, fragment_shader);

        var uColor	= gl.getUniformLocation(this.program,"uColor");
        gl.uniform3fv(uColor, new Float32Array( GlUtil.rgbArray("#FF0000","00FF00","0000FF","909090","C0C0C0","404040") ));
        this.uniformLoc.lightpos = gl.getUniformLocation(this.program, 'uLightPos');
        this.uniformLoc.campos = gl.getUniformLocation(this.program, 'uCamPos');
        this.uniformLoc.matNorm = gl.getUniformLocation(this.program, 'uNormMatrix');

        //Standrd Uniforms
        this.setPerspective(pMatrix);
        // this.mainTexture = -1; //Store Our Texture ID
        gl.useProgram(null); //Done setting up shader
        return this;
    }

    setLightPos(obj){ this.gl.uniform3fv(this.uniformLoc.lightpos, new Float32Array(obj.transform.position.getArray())); return this;}
    setCameraPos(obj){ this.gl.uniform3fv(this.uniformLoc.campos, new Float32Array(obj.transform.position.getArray())); return this;}

    renderModel(model) {
        this.gl.uniformMatrix3fv(this.uniformLoc.matNorm, false, model.transform.getNormalMatrix());
        super.renderModel(model);
        return this;
    }

}