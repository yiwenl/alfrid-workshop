// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;

void main(void) {
    vec2 uv = vTextureCoord;
    // uv.y = 1.0 - uv.y;
    // uv *= 2.0;
    gl_FragColor = texture2D(texture, uv);
    // gl_FragColor = vec4(vTextureCoord *, 0.0, 1.0);
}