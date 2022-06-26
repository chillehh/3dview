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
    vNorm =  uNormMatrix * a_norm;						//Need Norm Scaled/Rotated correctly //
    vUV = a_uv;
    vCamPos = (inverse(uCameraMatrix) * vec4(uCamPos,1.0)).xyz; //need to Move CameraPos into World Space for Specular Calculation.
    
    //Set Final Position
    gl_Position = uPMatrix * uCameraMatrix * pos; 
}`;

export var fragment_shader =
`#version 300 es
// precision mediump float;

// vec
// in vec4 color;
// in highp vec2 texCoord;		//What pixel to pull from the texture
// uniform sampler2D uMainTex;	//Holds the texture we loaded to the GPU

// out vec4 finalColor;
// void main(void){
//     finalColor = color;
//}
precision mediump float;
		
uniform sampler2D uMainTex;	//Holds the texture we loaded to the GPU
uniform vec3 uLightPos;
//uniform highp mat4 uCameraMatrix;
//uniform vec3 uCamPos;

in vec3 vPos;
in vec3 vNorm;
in highp vec2 vUV;
in vec3 vCamPos;
in vec4 color;

out vec4 outColor;

void main(void){
    //Setup Basic Colors 
    vec4 cBase = texture(uMainTex,vUV); //vec4(1.0,0.5,0.5,1.0); 
    vec3 cLight = vec3(1.0,1.0,1.0);

    //...........................
    //setup ambient light
    float ambientStrength = 0.15;
    vec3 cAmbient = ambientStrength * cLight;

    //...........................
    //setup diffuse
    vec3 lightDir = normalize(uLightPos - vPos); //Distance between Pixel and Light Source, Normalize to make it a direction vector

    //Dot Product of two directions gives an angle of sort, It basicly a mapping between 0 to 90 degrees and a scale of 0 to 1
    //So the closer to 90 degrees the closer to 1 we get. In relation, the closer to 180 degrees the closer the value will be -1.
    //But we dont need the negative when dealing with light, so we cap the lowest possible value to 0 by using MAX.
    //Note, both values used in dot product needs to be normalized to get a proper range between 0 to 1.
    float diffAngle = max(dot(vNorm,lightDir),0.0);

    //So if the light source is 90 degrees above the pixel, then use the max light color or use a faction of the light;
    //The idea is to use the angle to determine how strong the light color should be. 90 degrees is max, 0 uses no light leaving the pixel dark.
    float diffuseStrength = 0.3;
    vec3 cDiffuse = diffAngle * cLight * diffuseStrength;	

    //...........................
    //setup specular 
    //NOTE : Might be easier to switch vertexPos, light and camera to local space. Can remove inverse of camera matrix in the process. For prototyping keeping things in WorldSpace.
    float specularStrength = 0.2f;	//0.15
    float specularShininess = 1.0f; //256.0
    vec3 camDir = normalize(vCamPos - vPos);	//Get the camera direction from the fragment position.
    vec3 reflectDir = reflect(-lightDir,vNorm);	//Using the normal as the 45 degree type of pivot, get the reflective direction from the light direction

    float spec = pow( max(dot(reflectDir,camDir),0.0) ,specularShininess);	//Now determine the angle of the reflective dir and camera, If seeing spot on (90d) then full light.
    vec3 cSpecular = specularStrength * spec * cLight;

    //...........................
    //Final
    vec3 finalColor = (cAmbient + cDiffuse + cSpecular) * cBase.rgb; //Combined Light Strength and apply it to the base color
    outColor = vec4(finalColor,1.0);
}`;