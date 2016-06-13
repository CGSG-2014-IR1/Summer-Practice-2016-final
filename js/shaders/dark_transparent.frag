precision mediump float;

uniform sampler2D TextureRefraction;
uniform float DistortionStrength;
uniform vec3 DiffuseColor;
uniform float Time;

varying vec3 Norm;
varying vec3 Pos;
varying vec2 PosS;

float rand( vec2 co )
{
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 noise( vec3 v )
{
  return vec3(rand(v.yz), rand(v.xz), rand(v.xy));
}

void main()
{
  vec3 dnorm = Norm;
  vec3 dist = noise(Pos + vec3(sin(Time), cos(Time), tan(Time)));
  dnorm += dist;

  vec4 refr = texture2D(TextureRefraction, PosS + (dnorm.xz + dnorm.xy + dnorm.yz) * DistortionStrength / 3.0);
  gl_FragColor = vec4(DiffuseColor, 1.0) * vec4(refr.xyz * (rand(mod(PosS.xy, vec2(0.1, 0.1)) + vec2(sin(Time), cos(Time))) > 0.7 ? 1.0 : 0.0), 1.0);
  vec3 d1 = normalize(-Pos + vec3(0, 0, 5));
  vec3 d2 = normalize(-Pos + vec3(10, 0, 5));

}
