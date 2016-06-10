define(['./texture', './shader'], function(texture, shader)
  {
    return function()
      {
        this.Textures = [];
        this.CreateCubeMapMaterial = function(Path, Format)
        {
          var ctex = new texture();
          ctex.CreateCubeMap(Path, Format);
          this.Textures.push(ctex);

          this.Mtl = new THREE.ShaderMaterial(
            {
              fragmentShader: new shader().Load("../js/shaders/environment/skybox.frag"),
              vertexShader: new shader().Load("../js/shaders/environment/skybox.vert"),
              uniforms: {
                "TextureCube": {type: "t", value: ctex.Tex}
              },
              depthWrite: false,
              side: THREE.BackSide
            });
        }
      }
  });
