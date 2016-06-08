varying vec3 Norm;
varying vec3 Pos;
varying vec2 PosS;

void main()
{
  Norm = normal;
  Pos = position;
  vec4 glPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = glPos;
  PosS = ((glPos.xy / glPos.w) + vec2(1.0, 1.0)) / 2.0;
}
