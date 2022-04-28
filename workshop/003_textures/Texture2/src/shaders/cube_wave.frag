// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vColor;
uniform sampler2D texture;


#pragma glslify: diffuse    = require(./glsl-utils/diffuse.glsl)
#define LIGHT vec3(1.0, 0.8, 0.6)


void main(void) {

    float g = diffuse(vNormal, LIGHT, .3);

    //gl_FragColor = vec4(vTextureCoord, 0.0, 1.0);
    gl_FragColor = vec4(vColor * g, 1.0);
    // gl_FragColor = texture2D(texture, vTextureCoord);
}