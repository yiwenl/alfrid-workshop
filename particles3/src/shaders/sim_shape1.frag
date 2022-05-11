#version 300 es

precision highp float;
in vec2 vTextureCoord;

uniform sampler2D uPosMap;
uniform sampler2D uVelMap;
uniform sampler2D uExtraMap;
uniform sampler2D uPosOrgMap;

uniform float uTime;
uniform float uSeed;

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
    vec3 pos = texture(uPosMap, vTextureCoord).xyz;
    vec3 vel = texture(uVelMap, vTextureCoord).xyz;
    vec3 extra = texture(uExtraMap, vTextureCoord).xyz;
    vec3 posOrg = texture(uPosOrgMap, vTextureCoord).xyz;

    vec4 c =  0.45*cos( vec4(0.5,3.9,1.4,1.1) + uTime*0.1*vec4(1.2,1.7,1.3,2.5) ) - vec4(0.3,0.0,0.0,0.0);

    vec4 result = map((vec3(vTextureCoord, uSeed)*2.-1.)*1.2, c);
    vec4 acc = map((vec3(result.xyz*0.2)), c);

    vel += acc.xyz * 0.0004;
    pos = result.xyz + vel;
    vel *= mix(0.98,0.99, extra.z);

    float maxRadius = mix(15.0, 16.0, extra.y);
    if(length(pos) > maxRadius) {
        pos = posOrg;
    }
 
    oColor0 = vec4(pos, 1.0);
    oColor1 = vec4(vel, 1.0);
    oColor2 = vec4(extra, 1.0);
    oColor3 = vec4(posOrg, 1.0);
}