#version 300 es

precision highp float;
in vec2 vTextureCoord;

uniform sampler2D uPosMap;
uniform sampler2D uVelMap;
uniform sampler2D uExtraMap;
uniform sampler2D uPosOrgMap;

uniform float uTime;

#pragma glslify: curlNoise    = require(./glsl-utils/curlNoise.glsl)
#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)

layout (location = 0) out vec4 oColor0;
layout (location = 1) out vec4 oColor1;
layout (location = 2) out vec4 oColor2;
layout (location = 3) out vec4 oColor3;

#define PI 3.141592653589793


vec3 fbm( vec3 p )
{
    p.xyz += 1.000*curlNoise(  2.0*p.yzx + uTime * 0.1);
    p.xyz += 0.500*curlNoise(  4.0*p.yzx + uTime * 0.1);
    p.xyz += 0.250*curlNoise(  8.0*p.yzx + uTime * 0.1);
    //p.xyz += 0.125*curlNoise( 16.0*p.yzx + uTime * 0.05);

    return p;
}

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

    vec3 offset = fbm(pos*0.3);
    float speed= mix(1.0, 2.0, extra.x);

    vec3 dir = pos * vec3(1.0, 0.0, 1.0);
    dir = _normalize(dir);
    dir.xz = rotate(dir.xz, PI * 0.5);
    float f = mix(1.0, .8, extra.y);
    offset += dir;

    //vel += offset* 0.0001;
    pos += offset*0.004 * speed;

    //vel *= mix(0.95, 0.98, extra.z);
    offset *= mix(0.95, 0.98, extra.z);

    float maxRadius = mix(7.0, 8.0, extra.y);
    if(length(pos) > maxRadius) {
        pos = posOrg;
    }

 
    oColor0 = vec4(pos, 1.0);
    oColor1 = vec4(vel, 1.0);
    oColor2 = vec4(extra, 1.0);
    oColor3 = vec4(posOrg, 1.0);
}


/*

pos = currPos + vel
vel = currVel + offset

*/