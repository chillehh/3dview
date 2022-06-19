import { vertex_shader, fragment_shader } from '@/webgl/shaders/basicShaders.js'
import { Shader } from '@/webgl/shaders/Shader.js'

export class TestShader extends Shader{
    constructor(gl, pMatrix){
        super(gl, vertex_shader, fragment_shader);

        //Standrd Uniforms
        this.setPerspective(pMatrix);
        gl.useProgram(null); //Done setting up shader
    }
}