// basic.vert

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

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vColor;

#pragma glslify: rotate    = require(./glsl-utils/rotate.glsl)

void main(void) {
    vec3 pos = aVertexPosition;
    pos.y += uSize * .5;
    pos *= mix(1.0, 1.5, aExtra.x);

    pos.xz = rotate(pos.xz, aExtra.z * 4.0);

    // read height value
    float h = texture2D(texture, aUV).r;
    pos.y *= h * 5.0;

    pos += aPosOffset;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;

    vec3 N = aNormal;
    N.xz = rotate(N.xz, aExtra.z * 4.0);
    vNormal = N;

    h += mix(-0.1, 0.1, aExtra.y);
    vColor = vec3(h);
}