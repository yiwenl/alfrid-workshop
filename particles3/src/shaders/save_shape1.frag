#version 300 es

precision highp float;
in vec2 vTextureCoord;
uniform float uSeed;

#pragma glslify: curlNoise    = require(./glsl-utils/curlNoise.glsl)

layout (location = 0) out vec4 oColor0;
layout (location = 1) out vec4 oColor1;
layout (location = 2) out vec4 oColor2;
layout (location = 3) out vec4 oColor3;

vec4 sqr( in vec4 t )
{
    return vec4( t.x*t.x - t.y*t.y - t.z*t.z - t.w*t.w, 2.0*t.x*t.y, 2.0*t.x*t.z, 2.0*t.x*t.w );
}


float length2( in vec4 q )
{
    return dot(q,q);
}


vec4 map( in vec3 p, in vec4 c )
{
    vec4 s = vec4(p,0.0);
    float d2 = 1.0;
    float z2 = dot(s,s);
    vec4 tp = vec4(abs(s.xyz),dot(s,s));

    float n = 1.0;
    for( int i=0; i<11; i++ )
    {
        d2 *= 4.0*z2;
        s = sqr(s) + c;  
        tp = min( tp, vec4(abs(s.xyz),dot(s,s)));
        z2 = length2(s);
        if(z2>4.0) break;
        n += 1.0;
    }
    return s;
}

void main(void) {

    vec4 c =  vec4(-0.125,-0.256,0.847,0.0895);
    vec4 result = map((vec3(vTextureCoord, uSeed)*2.-1.)*1.2, c);
    vec3 pos = result.xyz;
    vec3 extra =curlNoise(vec3(vTextureCoord.x, uSeed, vTextureCoord.y) * 200.0);    

    oColor0 = vec4(pos, 1.0);
    oColor1 = vec4(vec3(0.0), 1.0);
    oColor2 = vec4(extra * .5 + .5, 1.0);
    oColor3 = vec4(pos, 1.0);
}