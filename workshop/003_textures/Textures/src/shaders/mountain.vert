// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform sampler2D texture;

varying vec2 vTextureCoord;
varying vec3 vNormal;

void main(void) {
    vec3 pos = aVertexPosition;

    // read height value
    float h = texture2D(texture, aTextureCoord).r;
    pos.y = h * 0.4;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
}