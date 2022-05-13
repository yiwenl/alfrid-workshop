// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
uniform sampler2D uParticleMap;
varying vec3 vColor;

void main(void) {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if(dist > 0.5) {
        discard;
    }

    vec2 uv = gl_PointCoord;
    uv.y = 1.0 - uv.y;
    vec3 color = texture2D(uParticleMap, uv).rgb;

    gl_FragColor = vec4(color * vColor, 1.0);
}