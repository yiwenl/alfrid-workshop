// flowheight.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;

void main(void) {
    vec4 col = texture2D(texture, vTextureCoord);
    gl_FragColor = vec4(vec3(col), 1.);
}