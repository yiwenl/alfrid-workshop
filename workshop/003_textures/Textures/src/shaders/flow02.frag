//flow02.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform float uTime;

void main(void) {
    vec2 uv = vTextureCoord;
    vec3 c = texture2D(texture,uv).bgr*0.0;
    uv.x += 0.12;
    uv.y *=2.18;

    uv*= 0.0125* (sin(uTime*0.001)+1.)*3.;
    float time = uTime * 0.2;

    c += texture2D(texture,uv+ 
     vec2(time *.09,0.) +1.9 * texture2D(texture,uv+ 
     vec2(0.,time *.025) + 0.05 *texture2D(texture,0.5*uv+
     vec2(time *.0125,-time *.0125) + 0.525 *texture2D(texture,.25*uv).rr).bg).br).rgb;

    c = vec3(c.r*0.8,c.g*0.8, clamp(c.b*1.2, 0.2, 1.) * clamp(c.b*1.1, 0.2, 1.));

    gl_FragColor = vec4(c * c * c* 1.6, 1.0);
}