// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec2 uViewport;

uniform sampler2D uPosMap;
uniform sampler2D uColorMap;

varying vec3 vColor;

float particleSize(vec4 screenPos, mat4 mtxProj, vec2 viewport, float radius) {
	return viewport.y * mtxProj[1][1] * radius / screenPos.w;
}


void main(void) {
    vec3 pos = texture2D(uPosMap, aTextureCoord).xyz;

    vec4 worldSpace = uModelMatrix * vec4(pos, 1.0);
    vec4 cameraSpace = uViewMatrix * worldSpace;
    vec4 screenSpace = uProjectionMatrix * cameraSpace;
    
    gl_Position = screenSpace;

    // gl_PointSize = mix(12.0, 5.0, aVertexPosition.x);
    float radius = mix(0.01, 0.03, aVertexPosition.x);
    gl_PointSize = particleSize(gl_Position, uProjectionMatrix, uViewport, radius);


    vec3 color = texture2D(uColorMap, aVertexPosition.yz).rgb;
    color += 0.2;
    color = pow(color, vec3(1.5));

    vColor = color;


}