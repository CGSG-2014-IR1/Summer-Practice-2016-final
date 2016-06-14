define(
  [
    'units/environment/unit_skybox',
    'res/shader',
    'prim/sprim',
    'prim/characters'
  ], function(unit_skybox, shader, sprim, char)
{
  return function()
    {
      this.Init = function(Ani)
      {
        this.UnitSkybox = new unit_skybox("../assets/textures/skybox/sunny/", ".bmp");
        Ani.UnitAdd(this.UnitSkybox);
        Ani.Camera.position.set(0, 0.5, 2.5);
        Ani.Camera.lookAt(new THREE.Vector3(0, 0, 0));
        Ani.Camera.fov = 5;

        var light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 5, -5);
        light.castShadow = true;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 10;
        light.shadow.camera.left = -2;
        light.shadow.camera.right = 2;
        light.shadow.camera.top = 2;
        light.shadow.camera.bottom = -2;
        light.shadow.mapSize.width = 512;
        light.shadow.mapSize.height = 512;

        var light_transparent_material = new THREE.ShaderMaterial(
          {
            uniforms: {
              "TextureRefraction": {type: "t", value: Ani.Render.RefractionRenderTarget.texture},
              "CameraPos": {type: "v3", value: Ani.Camera.position},
              "DiffuseColor": {type: "v3", value: new THREE.Vector3(0.9, 0.9, 0.9)},
              "DistortionStrength": {type: "f", value: 0.05}
            },
            side: THREE.DoubleSide,
            vertexShader: new shader().Load("../js/shaders/light_transparent.vert"),
            fragmentShader: new shader().Load("../js/shaders/light_transparent.frag"),
            transparent: true
          });

        var queen = new char().CreateQueen(0.1, light_transparent_material);
        queen.Mesh.position.x = 0.15;
        queen.Mesh.position.z = -0.15;
        var king = new char().CreateKing(0.1, light_transparent_material);
        king.Mesh.position.x = -0.15;
        king.Mesh.position.z = -0.15;

        var slayers = [];
        slayers.push(new char().CreateSlayer(0.1, light_transparent_material));
        slayers[slayers.length - 1].Mesh.position.x = -0.45;
        slayers[slayers.length - 1].Mesh.position.z = -0.15;
        slayers.push(new char().CreateSlayer(0.1, light_transparent_material));
        slayers[slayers.length - 1].Mesh.position.x = 0.45;
        slayers[slayers.length - 1].Mesh.position.z = -0.15;

        var mages = [];
        mages.push(new char().CreateMage(0.1, light_transparent_material));
        mages[mages.length - 1].Mesh.position.x = -0.75;
        mages[mages.length - 1].Mesh.position.z = -0.15;
        mages.push(new char().CreateMage(0.1, light_transparent_material));
        mages[mages.length - 1].Mesh.position.x = 0.75;
        mages[mages.length - 1].Mesh.position.z = -0.15;

        var knights = [];
        knights.push(new char().CreateKnight(0.1, light_transparent_material));
        knights[knights.length - 1].Mesh.position.x = -1.05;
        knights[knights.length - 1].Mesh.position.z = -0.15;
        knights.push(new char().CreateKnight(0.1, light_transparent_material));
        knights[knights.length - 1].Mesh.position.x = 1.05;
        knights[knights.length - 1].Mesh.position.z = -0.15;

        var pawns = [];
        for (var i = -1.35; i <= 1.35; i += 0.3)
        {
          pawns.push(new char().CreatePawn(0.1, light_transparent_material));
          pawns[pawns.length - 1].Mesh.position.x = i;
          pawns[pawns.length - 1].Mesh.position.z = 0.15;
        }

        var towers = [];
        towers.push(new char().CreateTower(0.1, light_transparent_material));
        towers[towers.length - 1].Mesh.position.x = -1.35;
        towers[towers.length - 1].Mesh.position.z = -0.15;
        towers.push(new char().CreateTower(0.1, light_transparent_material));
        towers[towers.length - 1].Mesh.position.x = 1.35;
        towers[towers.length - 1].Mesh.position.z = -0.15;

        var base = new sprim().CreatePlane(5, 5, new THREE.MeshPhysicalMaterial(
          {
            color: 0x333333
          }));
        Ani.AddPrimitive(base).AddPrimitive(queen).AddPrimitive(king).AddLight(light);
        slayers.forEach(function(Slayer)
        {
          Ani.AddPrimitive(Slayer)
        });
        mages.forEach(function(Mage)
        {
          Ani.AddPrimitive(Mage)
        });
        knights.forEach(function(Knight)
        {
          Ani.AddPrimitive(Knight)
        });
        towers.forEach(function(Tower)
        {
          Ani.AddPrimitive(Tower)
        });
        pawns.forEach(function(Pawn)
        {
          Ani.AddPrimitive(Pawn)
        });
      };

      this.Render = function(Ani)
      {
      };

      this.Response = function(Ani)
      {
      };
    }
});
