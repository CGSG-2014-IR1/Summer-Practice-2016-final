varying vec3 Pos;

void main()
{
  Pos = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
