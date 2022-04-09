// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform float uSeed;
uniform float uTime;
uniform float uNoiseScale;


#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)


#define LEVEL 8

float fbm(vec3 p) {
    float n = 0.0;
    for(int i = 0; i<LEVEL; i++) {
        float mul = pow(2.0, float(i));
        n += snoise(p * mul) / mul;
    }

    return n;
}

void main(void) {
    vec2 uv = vTextureCoord;
    uv.y -= uTime;
    float noise = fbm(vec3(uv, uSeed) * uNoiseScale);

    noise = pow(noise, 2.0);
    // float n = snoise(vec3(vTextureCoord, uSeed));

    gl_FragColor = vec4(vec3(noise), 1.0);
}