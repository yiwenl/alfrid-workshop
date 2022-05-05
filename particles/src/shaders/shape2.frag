
precision highp float;
varying vec2 vTextureCoord;

uniform float uTime;
uniform float uSeed;
#define GrowSpeed 0.9
#define Reshape vec4(2.8)

vec4 transform = vec4(1.0);

#pragma glslify: snoise = require(./glsl-utils/snoise.glsl)

mat2 rt(float theta)
{
    return mat2(cos(theta), -sin(theta), sin(theta), cos(theta));
}

vec3 form( vec3 p )
{
    p.xz *= rt(1.0 * 1.0 * 0.1 * uTime);
    p.xyz += 1.0 * sin(2.0 * p.yzx)* sin(2.0 * p.yzx) * sin(2.0 * p.yzx) * transform.x * transform.x;
    p.xz *= rt(1.0 * 3.75 * 0.1 * uTime);
    p.xyz += 0.500 * sin(5.0 * p.yzx) * transform.y * transform.y;
    p.xz *= rt(-1.0 * (7.5) * 0.1 * uTime);
    p.xyz += 0.250 * sin(0.5 * p.yzx) * transform.z * transform.z;
    p.xyz += 0.01250 * sin(0.65 * p.yzx) * transform.w * transform.w;
    return p;
}


void main(void) {

    float tempx = (((sin(uTime * GrowSpeed) + 1.) / 2.0) + 0.001) * Reshape.x;
    float tempy = (((sin(uTime * GrowSpeed) + 1.) / 2.0) + 0.001) * Reshape.y;
    float tempz = (((sin(uTime * GrowSpeed) + 1.) / 2.0) + 0.001) * Reshape.z;
    float tempw = (((sin(uTime * GrowSpeed) + 1.) / 2.0) + 0.001) * Reshape.w;
    transform = smoothstep(0., 1., (vec4(tempx, tempy, tempz, tempw)));

    vec3 result = form(vec3(vTextureCoord, uSeed)*1.8)*0.75 + snoise(vec3(uSeed, vTextureCoord))*0.25;
    vec3 pos = result.xyz;
    
    gl_FragColor = vec4(pos, 1.0);
}
