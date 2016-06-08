uniform samplerCube TextureCube;

varying vec3 Pos;

void main()
{
  gl_FragColor = textureCube(TextureCube, Pos);
}
