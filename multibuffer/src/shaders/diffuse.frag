#version 300 es

precision highp float;

in vec3 vPosition;
in vec3 vNormal;

layout (location = 0) out vec4 oFragColor0;
layout (location = 1) out vec4 oFragColor1;


#pragma glslify: diffuse    = require(./glsl-utils/diffuse.glsl)
#define LIGHT vec3(1.0, 0.8, 0.6)

void main(void) {
    float g = diffuse(vNormal, LIGHT, .5);

    oFragColor0 = vec4(vPosition, 1.0);
    oFragColor1 = vec4(vNormal, 1.0);
}