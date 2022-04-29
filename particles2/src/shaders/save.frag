#version 300 es

precision highp float;
in vec2 vTextureCoord;
uniform float uSeed;

#pragma glslify: curlNoise    = require(./glsl-utils/curlNoise.glsl)
#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)


layout (location = 0) out vec4 oColor0;
layout (location = 1) out vec4 oColor1;
layout (location = 2) out vec4 oColor2;

void main(void) {
    vec3 pos = curlNoise(vec3(vTextureCoord, uSeed) * 100.0);
    float t = snoise(vec3(uSeed, vTextureCoord));
    pos *= t;


    vec3 extra =curlNoise(vec3(vTextureCoord.x, uSeed, vTextureCoord.y) * 200.0);

    oColor0 = vec4(pos, 1.0);
    oColor1 = vec4(extra * .5 + .5, 1.0);
    oColor2 = vec4(pos, 1.0);
}