#version 300 es

precision highp float;
in vec2 vTextureCoord;

uniform sampler2D uPosMap;
uniform sampler2D uVelMap;
uniform sampler2D uExtraMap;
uniform sampler2D uPosOrgMap;

uniform float uTime;

#pragma glslify: curlNoise    = require(./glsl-utils/curlNoise.glsl)
#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)
#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)

layout (location = 0) out vec4 oColor0;
layout (location = 1) out vec4 oColor1;
layout (location = 2) out vec4 oColor2;
layout (location = 3) out vec4 oColor3;


#define PI 3.141592653589793


vec3 _normalize(vec3 v) {
    if(length(v) <= 0.0) {
        return vec3(0.0);
    } else {
        return normalize(v);
    }
}

void main(void) {
    vec3 pos = texture(uPosMap, vTextureCoord).xyz;
    vec3 vel = texture(uVelMap, vTextureCoord).xyz;
    vec3 extra = texture(uExtraMap, vTextureCoord).xyz;
    vec3 posOrg = texture(uPosOrgMap, vTextureCoord).xyz;

    float speed = mix(1.0, 2.0, extra.x);

    float offset = snoise(pos * 0.2 + uTime * 0.1) * 0.5 + 0.5;
    offset = mix(0.2, 0.4, offset);

    // noise force
    // vec3 acc = curlNoise(pos * 0.2 + uTime * 0.1);
    vec3 acc = curlNoise(pos * offset + uTime * 0.1);

    // rotating force
    vec3 dir = pos * vec3(1.0, 0.0, 1.0);
    dir = _normalize(dir);   // be careful dir = vec3(0.0, 0.0, 0.0);
    dir.xz = rotate(dir.xz, PI * 0.65);
    float f = mix(1.0, .8, extra.y);
    acc += dir * f;


    // pulling back force
    float maxRadius = 2.0;
    vec3 center = vec3(0.0, 0.0, 0.0);
    float distToCenter = distance(pos, center);
    // float distToCenter = length(pos);


    if(distToCenter > maxRadius) {
        vec3 dir = -normalize(pos);
        float f = (distToCenter - maxRadius) * 10.0;
        acc += dir * f * mix(0.5, 1.0, extra.y);
    }

    vel += acc * 0.0005 * speed;
    pos += vel;

    // 
    vel *= mix(0.95, 0.98, extra.z);
 
    oColor0 = vec4(pos, 1.0);
    oColor1 = vec4(vel, 1.0);
    oColor2 = vec4(extra, 1.0);
    oColor3 = vec4(posOrg, 1.0);
}


/*

pos = currPos + vel
vel = currVel + acc

*/