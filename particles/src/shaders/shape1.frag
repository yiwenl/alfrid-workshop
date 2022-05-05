
precision highp float;
varying vec2 vTextureCoord;

uniform float uTime;
uniform float uSeed;

vec4 transform = vec4(1.0);

#pragma glslify: snoise    = require(./glsl-utils/snoise.glsl)


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


void main(void) {

    vec3 result = form(vec3(vTextureCoord, uSeed)*1.65)*0.8 + snoise(vec3(uSeed, vTextureCoord))*0.25;
    vec3 pos = result.xyz;
    
    gl_FragColor = vec4(pos, 1.0);
}
