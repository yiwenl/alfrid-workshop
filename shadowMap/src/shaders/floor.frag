// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec4 vShadowCoord;
uniform sampler2D uShadowMap;

void main(void) {
        vec4 shadowCoord  = vShadowCoord / vShadowCoord.w;
        vec2 uv = shadowCoord.xy;
        float depth = texture2D( uShadowMap, uv ).r;
        float visibility = 1.0;
        if (depth < shadowCoord.z){
            visibility = 0.5;
    }

    if(shadowCoord.x < 0.0 || shadowCoord.x > 1.0 
    || shadowCoord.y < 0.0 || shadowCoord.y > 1.0) {
        visibility = 1.0;
    }
    // gl_FragColor = vec4(vTextureCoord, 0.0, 1.0);
    gl_FragColor = vec4(vec3(visibility), 1.0);
    // gl_FragColor = vec4(vec3(shadowCoord.z), 1.0);
    // gl_FragColor = 
}