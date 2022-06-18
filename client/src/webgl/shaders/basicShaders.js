export const vertex_shader = `
    #version 300 es
    in vec3 a_position;
    uniform float uAngle;
    uniform mediump float uPointSize;
    out vec3 size;

    void main(void){
        gl_PointSize = uPointSize;
        size = uPointSize;
        gl_Position = vec4(
            cos(uAngle) * 0.8 + a_position.x,
            sin(uAngle) * 0.8 + a_position.y,
            a_position.z, 1.0
        );
    }
    `

export const fragment_shader = `
    #version 300 es
    precision mediump float;

    uniform float uPointSize;
    in vec3 size;
    out vec4 finalColour;

    void main(void){
        float c = (40.0 - uPointSize) / 20.0;
        finalColour = vec4(c, c, c, 1.0);
    }
    `