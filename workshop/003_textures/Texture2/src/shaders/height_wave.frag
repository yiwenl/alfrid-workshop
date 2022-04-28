//height_wave.frag

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform float uSeed;
uniform float uTime;
uniform float uNoiseScale;

const float PI = 3.1415;
mat2 mod = mat2(1.6,1.2,-1.2,1.6);

float hash( vec2 a ) {
    float h = dot(a,vec2(127.1,311.7));	
    return fract(sin(h)*43758.5453123);
}


float noise( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );	
    vec2 u = f*f*(3.0-2.0*f);

    return -1.0+2.0*mix( 
                mix( hash( i + vec2(0.0,0.0) ), hash( i + vec2(1.0,0.0)), u.x),
                mix( hash( i + vec2(0.0,1.0) ), hash( i + vec2(1.0,1.0) ), u.x), 
                u.y);
}


float wave(vec2 uv, float wavy) {
    uv += noise(uv);
    vec2 wa = 1.0-abs(sin(uv)); 
    vec2 wb = abs(cos(uv));  
    wa = mix(wa,wb,wa);
    float sum = pow(1.0-pow(wa.x * wa.y,0.65), wavy);
    return sum;
}

float fbm_noise(vec3 p) {
    float f = 0.28;
    float a = 0.6;
    float wavy = 3.8;
    vec2 uv = p.xz; 
    uv.x *= 0.75;
    uv.x-= (uTime*2.25);

    float dist, finalheight = 0.0;    
    for(int i = 0; i < 5; i++) {
        dist = wave((uv)*f,wavy) + wave((uv)*f,wavy);
        finalheight += dist * a;        
    	uv *= mod;
        f *= 1.9; 
        a *= 0.22; 
        wavy = mix(wavy,1.0,0.2);
    }
    return finalheight;
}


void main(void) {
    vec2 uv = vTextureCoord;
    float noise = fbm_noise(vec3(uv.x, uSeed, uv.y) *5.);

    gl_FragColor = vec4(vec3(noise) / 3., 1.0);
}