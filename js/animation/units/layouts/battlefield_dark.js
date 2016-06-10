define(
  [
    'res/shader',
    'prim/characters',
    'prim/sprim',
    'units/environment/unit_skybox'
  ], function(shader, char, sprim, unit_skybox)
{
  return function()
    {
      this.InitFigures = function(Ani)
      {
        var scale = 0.3;

        this.MaterialDark = new THREE.ShaderMaterial(
          {
            uniforms: {
              "TextureRefraction": {type: "t", value: Ani.Render.RefractionRenderTarget.texture},
              "CameraPos": {type: "v3", value: Ani.Camera.position},
              "DiffuseColor": {type: "v3", value: new THREE.Vector3(0.6, 0.6, 0.6)},
              "DistortionStrength": {type: "f", value: 0.05},
              "Time": {type: "f", value: Ani.Timer.Time}
            },
            side: THREE.DoubleSide,
            vertexShader: new shader().Load("../js/shaders/dark_transparent.vert"),
            fragmentShader: new shader().Load("../js/shaders/dark_transparent.frag"),
            transparent: true
          });

        this.Dark = [];
        this.Dark.push(
          {
            Prim: new char().CreateQueen(scale, this.MaterialDark),
            Type: 'queen',
            Sight: 4, Radius: 3, Speed: 5, Health: 10, Attack: 6
          });
        this.Dark[0].Prim.Mesh.position.add(new THREE.Vector3(-5, 0, 0));
        this.Dark.push(
          {
            Prim: new char().CreateKing(scale, this.MaterialDark),
            Type: 'king',
            Sight: 1, Radius: 0, Speed: 2, Health: 10, Attack: 0
          });
        this.Dark[1].Prim.Mesh.position.add(new THREE.Vector3(-4, 0, 0));
        for (var i = 0; i < 2; i++)
        {
          this.Dark.push(
            {
              Prim: new char().CreateSlayer(scale, this.MaterialDark),
              Type: 'slayer',
              Sight: 5, Radius: 2, Speed: 3, Health: 4, Attack: 10
            });
          this.Dark[2 + i].Prim.Mesh.position.add(new THREE.Vector3(-3 + i * -3, 0, 0));
        }
        for (i = 0; i < 2; i++)
        {
          this.Dark.push(
            {
              Prim: new char().CreateMage(scale, this.MaterialDark),
              Type: 'mage',
              Sight: 7, Radius: 7, Speed: 3, Health: 3, Attack: 2
            });
          this.Dark[4 + i].Prim.Mesh.position.add(new THREE.Vector3(-2 + i * -5, 0, 0));
        }
        for (i = 0; i < 2; i++)
        {
          this.Dark.push(
            {
              Prim: new char().CreateKnight(scale, this.MaterialDark),
              Type: 'knight',
              Sight: 4, Radius: 1, Speed: 7, Health: 6, Attack: 5
            });
          this.Dark[6 + i].Prim.Mesh.position.add(new THREE.Vector3(-1 + i * -7, 0, 0));
        }
        for (i = 0; i < 2; i++)
        {
          this.Dark.push(
            {
              Prim: new char().CreateTower(scale, this.MaterialDark),
              Type: 'tower',
              Sight: 1, Radius: 1, Speed: 2, Health: 20, Attack: 3
            });
          this.Dark[8 + i].Prim.Mesh.position.add(new THREE.Vector3(i * -9, 0, 0));
        }
        for (i = 0; i < 10; i++)
        {
          this.Dark.push(
            {
              Prim: new char().CreatePawn(scale, this.MaterialDark),
              Type: 'pawn',
              Sight: 3, Radius: 1, Speed: 3, Health: 3, Attack: 2
            });
          this.Dark[10 + i].Prim.Mesh.position.add(new THREE.Vector3(-i, 0, 1));
        }

        this.Dark.forEach(function(Figure)
        {
          Ani.AddPrimitive(Figure.Prim);
        });
      };

      this.Init = function(Ani)
      {
        this.UnitSkybox = new unit_skybox("../assets/images/skybox/battle1/", ".bmp");
        Ani.UnitAdd(this.UnitSkybox);
        Ani.Camera.position.set(1, 4, -2);
        Ani.Camera.lookAt(new THREE.Vector3(0, 0, 0));
        Ani.Camera.fov = 60;

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

        this.Base = new sprim().CreatePlane(10, 10, new THREE.ShaderMaterial(
          {
            uniforms: {
              "Color1": {type: "v3", value: new THREE.Vector3(0.5, 0.5, 0.5)},
              "Color2": {type: "v3", value: new THREE.Vector3(0.1, 0.1, 0.1)}
            },
            side: THREE.DoubleSide,
            vertexShader: new shader().Load("../js/shaders/environment/field.vert"),
            fragmentShader: new shader().Load("../js/shaders/environment/field.frag"),
            transparent: false
          }));
        this.Base.Mesh.position.set(-4.5, 0, 4.5);
        this.Selector = new sprim().CreatePlane(1, 1, new THREE.ShaderMaterial(
          {
            uniforms: {
              "ColorBase": {type: "v3", value: new THREE.Vector3(0.3, 0.3, 0.2)},
              "ColorAdd": {type: "v3", value: new THREE.Vector3(0.2, 0.2, 0.1)},
              "Time": {type: "f", value: Ani.Timer.GlobalTime}
            },
            side: THREE.DoubleSide,
            vertexShader: new shader().Load("../js/shaders/environment/selector.vert"),
            fragmentShader: new shader().Load("../js/shaders/environment/selector.frag"),
            transparent: false
          }));
        this.Selector.Mesh.position.y = 0.001;
        this.SelectorFigure = new sprim().CreatePlane(1, 1, new THREE.ShaderMaterial(
          {
            uniforms: {
              "ColorBase": {type: "v3", value: new THREE.Vector3(0.5, 0.1, 0.1)},
              "ColorAdd": {type: "v3", value: new THREE.Vector3(0.1, 0.0, 0.0)},
              "Time": {type: "f", value: Ani.Timer.GlobalTime}
            },
            side: THREE.DoubleSide,
            vertexShader: new shader().Load("../js/shaders/environment/selector.vert"),
            fragmentShader: new shader().Load("../js/shaders/environment/selector.frag"),
            transparent: false
          }));
        this.SelectorFigure.Mesh.position.y = 0.0015;
        Ani.AddPrimitive(this.Base).AddPrimitive(this.Selector).AddPrimitive(this.SelectorFigure);

        this.PrevMov = Ani.Timer.GlobalTime;
        this.Scale = 1;

        this.InitFigures(Ani);
      };

      this.Render = function(Ani)
      {
        var shift = new THREE.Vector3(1, 4, -2).multiplyScalar(this.Scale);
        this.Selector.Mesh.material.uniforms.Time.value = Ani.Timer.GlobalTime;
        this.SelectorFigure.Mesh.material.uniforms.Time.value = Ani.Timer.GlobalTime;
        Ani.Camera.position.copy(this.Selector.Mesh.position).add(shift);
        Ani.Camera.lookAt(this.Selector.Mesh.position);

        this.MaterialDark.uniforms.Time.value = Ani.Timer.GlobalTime;
      };

      this.Response = function(Ani)
      {
        if (Ani.Keyboard.Keys[38] && Ani.Timer.GlobalTime - this.PrevMov > 0.15)
        {
          this.Selector.Mesh.position.z++;
          this.PrevMov = Ani.Timer.GlobalTime;
        }
        else if (Ani.Keyboard.Keys[40] && Ani.Timer.GlobalTime - this.PrevMov > 0.15)
        {
          this.Selector.Mesh.position.z--;
          this.PrevMov = Ani.Timer.GlobalTime;
        }
        if (Ani.Keyboard.Keys[37] == 1 && Ani.Timer.GlobalTime - this.PrevMov > 0.15)
        {
          this.Selector.Mesh.position.x++;
          this.PrevMov = Ani.Timer.GlobalTime;
        }
        else if (Ani.Keyboard.Keys[39] && Ani.Timer.GlobalTime - this.PrevMov > 0.15)
        {
          this.Selector.Mesh.position.x--;
          this.PrevMov = Ani.Timer.GlobalTime;
        }
        if (Ani.Keyboard.Keys[107])
          this.Scale *= 0.9;
        else if (Ani.Keyboard.Keys[109])
          this.Scale *= 1.1;
        if (Ani.Keyboard.Keys[13])
        {
          this.SelectorFigure.Mesh.position.copy(this.Selector.Mesh.position);
          this.SelectorFigure.Mesh.position.y = 0.0005;
        }
      };
    }
});