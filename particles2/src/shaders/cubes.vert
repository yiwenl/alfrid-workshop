// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec2 aUV;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D uPosMap;

varying vec2 vTextureCoord;
varying vec3 vNormal;

void main(void) {
    float scale = mix(0.5, 2.0, aExtra.x);
    vec3 posOffset = texture2D(uPosMap, aUV).xyz;
    vec3 pos = aVertexPosition * scale + posOffset;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
}