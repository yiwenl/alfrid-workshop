// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform float uSeed;

#pragma glslify: curlNoise    = require(./glsl-utils/curlNoise.glsl)
#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)

void main(void) {
    vec3 pos = curlNoise(vec3(vTextureCoord, uSeed) * 100.0);
    float t = snoise(vec3(uSeed, vTextureCoord));
    pos *= t;


    gl_FragColor = vec4(pos, 1.0);
}