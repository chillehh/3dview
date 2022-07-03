export var vertex_shader = 
`#version 300 es
in vec3 a_position;
in vec3 a_norm;
in vec2 a_uv;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uCameraMatrix;
uniform mat3 uNormMatrix;
uniform vec3 uCamPos;

out vec3 vPos;
out vec3 vNorm;
out vec3 vCamPos;
out highp vec2 vUV;

void main(void){
    //Setup some fragment vars
    vec4 pos = uMVMatrix * vec4(a_position.xyz, 1.0);	//Need Position in World Space
    vPos = pos.xyz;
    vNorm =  uNormMatrix * a_norm;						//Need Norm Scaled/Rotated correctly
    vUV = a_uv;
    vCamPos = (inverse(uCameraMatrix) * vec4(uCamPos,1.0)).xyz; //need to Move CameraPos into World Space for Specular Calculation.
    
    //Set Final Position
    gl_Position = uPMatrix * uCameraMatrix * pos; 
}`;

export var fragment_shader =
`#version 300 es
precision mediump float;

uniform sampler2D uMainTex;	//Holds the texture we loaded to the GPU
uniform vec3 uLightPos;

in vec3 vPos;
in vec3 vNorm;
in highp vec2 vUV;
in vec3 vCamPos;

layout(location = 0) out vec4 outColor;

void main(void){
    //Setup Basic Colors 
    vec4 cBase = vec4(0.89,0.52,0.24,1.0); 
    vec3 cLight = vec3(1.0,1.0,1.0);

    //...........................
    //setup ambient light
    float ambientStrength = 0.88;
    vec3 cAmbient = ambientStrength * cLight;

    //...........................
    //setup diffuse
    vec3 lightDir = normalize(uLightPos - vPos); //Distance between Pixel and Light Source, Normalize to make it a direction vector
    float diffAngle = max(dot(vNorm,lightDir),0.0);
    float diffuseStrength = 50.0;
    vec3 cDiffuse = cLight * diffAngle * diffuseStrength;

    //...........................
    //Final
    vec3 finalColour = (cDiffuse + cAmbient) * cBase.rgb; //Combined Light Strength and apply it to the base color
    outColor = vec4(finalColour,1.0);
}`;