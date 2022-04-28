//cube_wave.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;
attribute vec3 aExtra;
attribute vec2 aUV;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D texture;
uniform float uSize;
uniform float uTime;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vColor;

#pragma glslify: rotate = require(./glsl-utils/rotate.glsl)

const float PI = 3.1415;

float diffuse(vec3 nm,vec3 light,float pos) {
    return pow(dot(nm,light) * 0.4 + 0.6, pos);
}

float specular(vec3 nm, vec3 light ,vec3 dir,float sp) {    
    float nnm = (sp + 8.0) / (PI * 8.0);
    float c = pow(max(dot(reflect(dir,nm),light),0.0),sp) * nnm;
    return c;
}


void main(void) {
    vec3 pos = aVertexPosition;
    pos.y += uSize * .5;
    pos *= mix(1.0, 1.5, aExtra.x);
    pos.xz = rotate(pos.xz, aExtra.z * 4.0);

    float height = texture2D(texture, aUV).r;
    height *= 3.;
    //pos.y *= height*60.;
    pos.y += height*1.;

    pos += aPosOffset;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;

    vec3 N = aNormal;
    N.xz = rotate(N.xz, aExtra.z * 4.0);
    vNormal = N;

    vec3 dist = vec3(aUV.x, height, aUV.y) - vec3(5., 4., 2.);
    vec3 dir = normalize(dist);
    vec3 light = normalize(vec3(0.,20.,0.8)); 

    float fn = 1.0 - max(dot(N,-dir),0.0);
    fn = pow(fn,3.0) * 0.85;
    vec3 reflect = vec3(0.9, 0.9,0.9);    
    vec3 refract = vec3(0.1,0.19,0.24) + diffuse(N,light,60.0) *  vec3(0.8,0.9,0.95) * 0.1; 
    vec3 color = mix(refract,reflect,fn);
    color +=  (vec3(0.8,0.9,0.6) * (height - 0.8) * 0.18);
    color += vec3(specular(N,light,dir, 58.0));

    vColor = color;
}