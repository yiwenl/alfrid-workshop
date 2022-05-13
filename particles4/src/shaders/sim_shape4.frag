#version 300 es

precision highp float;
in vec2 vTextureCoord;

uniform sampler2D uPosMap;
uniform sampler2D uVelMap;
uniform sampler2D uExtraMap;
uniform sampler2D uPosOrgMap;

uniform float uTime;

#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)

layout (location = 0) out vec4 oColor0;
layout (location = 1) out vec4 oColor1;
layout (location = 2) out vec4 oColor2;
layout (location = 3) out vec4 oColor3;

vec4 transform = vec4(1.0);

#define PI 3.141592653589793


mat2 rt(float theta)
{
    return mat2(cos(theta), -sin(theta), sin(theta), cos(theta));
}

vec3 form( vec3 p )
{
    p.xz *= rt(1.0 * 1.0 * 0.1 * uTime);
    p.zxy += 1.0 * sin(2.0 * p.yzx) * transform.x * 1.05;
    p.xz *= rt(1.0 * 3.75 * 0.1 * uTime);
    p.zxy += 0.500 * sin(3.2 * p.yzx) * transform.y;
    p.xz *= rt(-1.0 * (7.5) * 0.1 * uTime);
    p.zxy += 0.250 * sin(5.12 * p.yzx) * transform.z;
    p.zxy += 0.050 * sin(8.19 * p.yzx) * transform.w;

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

    vec3 offset = form(pos*0.4);

    vec3 dir = pos * vec3(1.0, 0.0, 1.0);
    dir = _normalize(dir);
    dir.xz = rotate(dir.xz, PI * 0.2);
    float f = mix(1.0, .8, extra.y);
    offset += dir*f;

    float maxRadius = 2.0;
    vec3 center = vec3(0.0, 0.0, 0.0);
    float distToCenter = distance(pos, center);


    if(distToCenter > maxRadius) {
        vec3 dir = -normalize(pos);
        float f = (distToCenter - maxRadius) * 1.0;
        offset += dir * f * mix(0.5, 1.0, extra.y);
    }

    //vel += offset * 0.001 ;
    pos += offset * 0.001;
    //vel *= mix(0.7, 0.75, extra.z);
    offset *= mix(0.95, 0.98, extra.z);
 
    oColor0 = vec4(pos, 1.0);
    oColor1 = vec4(vel, 1.0);
    oColor2 = vec4(extra, 1.0);
    oColor3 = vec4(posOrg, 1.0);
}