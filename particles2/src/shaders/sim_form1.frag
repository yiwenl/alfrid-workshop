#version 300 es

precision highp float;
in vec2 vTextureCoord;

uniform sampler2D uPosMap;
uniform sampler2D uExtraMap;
uniform sampler2D uPosOrgMap;

uniform float uTime;

#pragma glslify: curlNoise    = require(./glsl-utils/curlNoise.glsl)

layout (location = 0) out vec4 oColor0;
layout (location = 1) out vec4 oColor1;
layout (location = 2) out vec4 oColor2;


vec3 fbm( vec3 p )
{
    p.xyz += 1.000*curlNoise(  2.0*p.yzx + uTime * 0.1);
    p.xyz += 0.500*curlNoise(  4.0*p.yzx + uTime * 0.1);
    p.xyz += 0.250*curlNoise(  8.0*p.yzx + uTime * 0.1);
    //p.xyz += 0.125*curlNoise( 16.0*p.yzx + uTime * 0.1);

    return p;
}

void main(void) {
    vec3 pos = texture(uPosMap, vTextureCoord).xyz;
    vec3 extra = texture(uExtraMap, vTextureCoord).xyz;
    vec3 posOrg = texture(uPosOrgMap, vTextureCoord).xyz;

    vec3 test = fbm(pos);
    pos += test*0.014;

    float maxRadius = mix(7.0, 8.0, extra.y);
    if(length(pos) > maxRadius) {
        pos = posOrg;
    }
 
    oColor0 = vec4(pos, 1.0);
    oColor1 = vec4(extra, 1.0);
    oColor2 = vec4(posOrg, 1.0);
}


/*

pos = currPos + vel
vel = currVel + acc

*/