// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;

void main(void) {
    // vec4 color = texture2D(texture, vTextureCoord);


    vec4 color = texture2D(texture, vTextureCoord);
	float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
	gl_FragColor = vec4(vec3(gray), 1.0);

    // float g = (color.r + color.g + color.b) / 3.0;
    // color.rgb = vec3(g);
    

    // gl_FragColor = color;
}