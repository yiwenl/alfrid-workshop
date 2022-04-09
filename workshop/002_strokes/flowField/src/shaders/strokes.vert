// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aPositionOffset;
attribute vec3 aRandom;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform vec3 uColors[5];
uniform float uSeedColor;
uniform float uTime;

varying vec3 vColor;

#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)
#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)

#define PI 3.14159265
#define LEVEL 5

float fbm(vec3 p) {
    float n = 0.0;
    for(int i = 0; i <LEVEL; i++) {
        float mul = pow(2.0, float(i));
        n += snoise(p * mul) / mul;
    }

    return n;
}

void main(void) {
    // float rot = snoise(aPositionOffset * 0.1) * PI;
    float rot = fbm(vec3(aPositionOffset.xy, uTime) * 0.06) * PI;
    vec3 pos = aVertexPosition;
    pos.x *= mix(1.0, 4.0, aRandom.x);
    pos.xy = rotate(pos.xy, rot);
    // pos.yz = rotate(pos.yz, aRandom.y + aRandom.x);

    pos += aPositionOffset;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);

    vec3 color = vec3(1.0);

    // float rnd = snoise(vec3(uSeedColor, aPositionOffset.yx) * 0.2) * 0.5 + 0.5;
    float rnd = fbm(vec3(uSeedColor, aPositionOffset.yx) * 0.2) * 0.5 + 0.5;
    rnd += aRandom.y * 0.2;

    if(rnd < 0.2) {
        color = uColors[0];
    } else if(rnd < 0.4) {
        color = uColors[1];
    } else if(rnd < 0.6) {
        color = uColors[2];
    } else if(rnd < 0.8) {
        color = uColors[3];
    } else {
        color = uColors[4];
    }

    vColor = color * mix(0.75, 1.0, aRandom.z);
}