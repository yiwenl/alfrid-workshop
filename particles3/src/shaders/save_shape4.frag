#version 300 es

precision highp float;
in vec2 vTextureCoord;
uniform float uSeed;

#pragma glslify: curlNoise    = require(./glsl-utils/curlNoise.glsl)
#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)


layout (location = 0) out vec4 oColor0;
layout (location = 1) out vec4 oColor1;
layout (location = 2) out vec4 oColor2;
layout (location = 3) out vec4 oColor3;

vec4 transform = vec4(1.0);


mat2 rt(float theta)
{
    return mat2(cos(theta), -sin(theta), sin(theta), cos(theta));
}

vec3 form( vec3 p )
{
    p.xz *= rt(1.0 * 1.0 * 0.1 * 1.);
    p.zxy += 1.0 * sin(2.0 * p.yzx) * transform.x * 1.05;
    p.xz *= rt(1.0 * 3.75 * 0.1 * 1.);
    p.zxy += 0.500 * sin(3.2 * p.yzx) * transform.y;
    p.xz *= rt(-1.0 * (7.5) * 0.1 * 1.);
    p.zxy += 0.250 * sin(5.12 * p.yzx) * transform.z;
    p.zxy += 0.050 * sin(8.19 * p.yzx) * transform.w;

    return p;
}

void main(void) {
    vec3 result = form(vec3(vTextureCoord, uSeed)*1.65)*0.8 + snoise(vec3(uSeed, vTextureCoord))*0.25;
    //vec3 result = form(vec3(vTextureCoord, uSeed)*1.65)*0.8;
    vec3 pos = result.xyz;

    vec3 extra =curlNoise(vec3(vTextureCoord.x, uSeed, vTextureCoord.y) * 200.0);

    oColor0 = vec4(pos, 1.0);
    oColor1 = vec4(vec3(0.0), 1.0);
    oColor2 = vec4(extra * .5 + .5, 1.0);
    oColor3 = vec4(pos, 1.0);
}