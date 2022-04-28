//cube_MT.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;
attribute vec3 aExtra;
attribute vec2 aUV;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D texture;
uniform float uSize;
uniform float uTime;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vColor;

#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)

vec2 rt(vec2 a, float angle) {
	return vec2(a.x * cos(angle) - a.y * sin(angle), a.x * sin(angle) + a.y * cos(angle));
}

float gradient(float x, float y, float g) {
    float gradient = g * g * (3.0 - 2.0 * g);
    return mix(x, y, gradient);
}

float hash(vec2 x) {
    return fract(sin(dot(x.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float hash2(vec2 a, vec2 s) {
    a /= s;
    vec2 f = floor(a);
    vec2 p = fract(a);
    float H = gradient(hash(f + vec2(0.0, 1.0)), hash(f + vec2(1.0, 1.0)), p.x);
    float L = gradient(hash(f + vec2(0.0, 0.0)), hash(f + vec2(1.0, 0.0)), p.x);
    return gradient(L, H, p.y);
}

float fbm(vec2 p, vec2 s) {
    float result = 0.0;
    float mod = 1.0;
    float range = 0.0;
    for (int i = 0; i < 6; i++) {
        result += hash2(p, s) * mod;
        range += mod;
        mod /= 2.;
        s /= 2.;
        p = rt(p, radians(60.));
    }
    return result / range;
}

float HeightCal(vec3 a) {
    vec3 h = vec3(0.0, -0.5, 0.0) + vec3(0.0, 2.8 * fbm(a.xz + vec2(0.0, uTime), vec2(1.7)), 0.0);    
    return h.y;
}

vec3 n(vec3 o) {
	const vec3 dx = vec3(0.01, 0.0, 0.0);
    const vec3 dy = vec3(0.0, 0.01, 0.0);
    const vec3 dz = vec3(0.0, 0.0, 0.01);
    return normalize(vec3(
        HeightCal(o + dx) - HeightCal(o - dx),
        HeightCal(o + dy) - HeightCal(o - dy),
        HeightCal(o + dz) - HeightCal(o - dz)
    ));
}

void main(void) {
    vec3 pos = aVertexPosition;
    pos.xy += uSize * .4;
    pos *= mix(1.0, 1.5, aExtra.x);
    pos.xz = rotate(pos.xz, aExtra.z * 4.0);

    float height = HeightCal(aPosOffset);
    pos.y += height * 1.5;

    pos += aPosOffset;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;

    vec3 N = aNormal;
    N.xz = rotate(N.xz, aExtra.z * 4.0);
    vNormal = N;

    vec3 nm = n(aPosOffset);
    nm += N;
    vec3 light = normalize(vec3(1.0, 1.0, 0.0));
    float ambient = 0.45;
    float diff = clamp(dot(nm, light), 0.0, 1.0) * 2.45;

    vec3 color = fbm(pos.xz*0.6+aExtra.y*0.4 + vec2(0.0, uTime), vec2(1.7))*vec3(0.075, 0.28, 0.035);
    color = mix(color, vec3(0.45, 0.38, 0.36), height*0.4);
    color = mix(color, vec3(0.51, 0.39, 0.31), height*0.5);

    vColor = color*(ambient + diff);
}