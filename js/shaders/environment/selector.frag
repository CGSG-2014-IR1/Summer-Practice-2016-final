precision mediump float;

uniform float Time;
uniform vec3 ColorBase;
uniform vec3 ColorAdd;

varying vec3 Norm;
varying vec3 Pos;
varying vec2 PosS;

void main( void )
{
  vec3 col = ColorBase + ColorAdd * abs(sin(Time));
  gl_FragColor = vec4(col, 1.0);
}
