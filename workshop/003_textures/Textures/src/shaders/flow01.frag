// flow1.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform float uTime;
uniform float uRandom;

void main(void) {
    //vec4 c = texture2D(texture, vTextureCoord);

    vec2 uv = vTextureCoord;
    vec3 c = texture2D(texture, uv).rgb*0.05;
    uv*= 0.018;
    //float time = uTime * 0.05;
    float time = uRandom;

    c += texture2D(texture,uv+ vec2(time *.05,0.) 
        +0.5 * texture2D(texture,uv+ vec2(0.,time *.025) 
        + 0.25 *texture2D(texture,0.5*uv+ vec2(time *.0125,-time *.0125) 
        + 0.125 *texture2D(texture,.25*uv).bb).rg).gb).rgb;


    c = vec3(c.g*1.5,c.r,c.b);
    //c = vec3(c.g*1.,c.r,c.b);
    gl_FragColor = vec4(c * c * c * 1.,1.0);
}