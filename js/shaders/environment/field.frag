precision mediump float;

uniform vec3 Color1;
uniform vec3 Color2;

varying vec3 Norm;
varying vec3 Pos;
varying vec2 PosS;

void main( void )
{
  vec3 col = Color1;
  if (min(Pos.x - floor(Pos.x), ceil(Pos.x) - Pos.x) < 0.05 ||
      min(Pos.y - floor(Pos.y), ceil(Pos.y) - Pos.y) < 0.05)
    col = vec3(0, 0, 0);
  gl_FragColor = vec4(col, 1.0);
}
