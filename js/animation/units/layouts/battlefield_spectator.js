define(
  [
    'res/shader',
    'prim/characters',
    'prim/sprim',
    'units/environment/unit_skybox',
    './board'
  ], function(shader, char, sprim, unit_skybox, board)
  {
    return function( socket, size, InfoId )
    {
      this.Size = size;
      this.Socket = socket;
      this.InfoId = InfoId;

      this.LoadFigure = function( Ani, N, Dir, Src, zc, zd, xc, Name, Side, Scale, Material )
      {
        var self = this;
        $.getJSON("assets/figures/" + Name + ".json", function(Stats)
        {
          for (i = 0; i < N; i++)
          {
            var figure =
            {
              Prim: new char().CreateFigure(Name, Scale, Material),
              Type: Stats.Type, Side: Side,
              Sight: Stats.Sight, Radius: Stats.Radius, Speed: Stats.Speed,
              Health: Stats.Health, Attack: Stats.Attack, Stamina: -1
            };
            figure.Prim.Mesh.position.add(new THREE.Vector3(xc, 0, zd * i + zc)).add(Src);
            self.Board.Set(zd * i + zc + Src.z, xc + Src.x, figure);
            Ani.AddPrimitive(figure.Prim);
            self.Board.Refresh();
            self.InfoUpdate();
          }
        });
      };

      this.PlaceSide = function( Ani, Src, Dir, Material, Side, Scale )
      {
        this.LoadFigure(Ani,  2, Dir, Src,         0, Dir.z * 9,     0, 'tower', Side, Scale, Material);
        this.LoadFigure(Ani,  2, Dir, Src, Dir.z * 1, Dir.z * 7,     0, 'knight', Side, Scale, Material);
        this.LoadFigure(Ani,  2, Dir, Src, Dir.z * 2, Dir.z * 5,     0, 'slayer', Side, Scale, Material);
        this.LoadFigure(Ani,  2, Dir, Src, Dir.z * 3, Dir.z * 3,     0,   'mage', Side, Scale, Material);
        this.LoadFigure(Ani,  1, Dir, Src, Dir.z * 4,         0,     0,  'queen', Side, Scale, Material);
        this.LoadFigure(Ani,  1, Dir, Src, Dir.z * 5,         0,     0,   'king', Side, Scale, Material);
        this.LoadFigure(Ani, 10, Dir, Src,         0, Dir.z * 1, Dir.x,   'pawn', Side, Scale, Material);
      };

      this.InitFigures = function( Ani )
      {

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
        this.MaterialLight = new THREE.ShaderMaterial(
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

        this.PlaceSide(Ani, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 1), this.MaterialDark, 'Dark', 0.3);
        this.PlaceSide(Ani, new THREE.Vector3(this.Size - 1, 0, this.Size - 1), new THREE.Vector3(-1, 0, -1), this.MaterialLight, 'Light', 0.3);
      };

      this.Init = function( Ani )
      {
        this.Board = new board(this.Size, 'Seer');
        this.UnitSkybox = new unit_skybox("../assets/images/skybox/battle1/", ".bmp");
        Ani.UnitAdd(this.UnitSkybox);
        Ani.Camera.position.set(-1, 4, -2);
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

        this.Base = new sprim().CreatePlane(this.Size, this.Size, new THREE.ShaderMaterial(
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
        this.Base.Mesh.position.set(this.Size / 2.0 - 0.5, 0, this.Size / 2.0 - 0.5);
        this.Selector = new sprim().CreatePlane(1, 1, new THREE.ShaderMaterial(
          {
            uniforms: {
              "ColorBase": {type: "v3", value: new THREE.Vector3(0.3, 0.3, 0.2)},
              "ColorAdd": {type: "v3", value: new THREE.Vector3(0.2, 0.2, 0.1)},
              "Time": {type: "f", value: Ani.Timer.GlobalTime},
              "Alpha": {type: "f", value: 0.5}
            },
            side: THREE.DoubleSide,
            vertexShader: new shader().Load("../js/shaders/environment/selector.vert"),
            fragmentShader: new shader().Load("../js/shaders/environment/selector.frag"),
            transparent: true
          }));
        this.Selector.Mesh.position.set(this.Size - 1, 0.001, this.Size - 1);
        Math.fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };
        Ani.AddPrimitive(this.Base).AddPrimitive(this.Selector);

        this.PrevMov = Ani.Timer.GlobalTime;
        this.Scale = 1;

        this.InitFigures(Ani);

        var self = this;
        this.Socket.on('move', function(data)
        {
          self.Board.MoveEnemy(Math.ceil(data[0]), Math.ceil(data[1]), Math.ceil(data[2]), Math.ceil(data[3]));
        });
        this.Socket.on('win', function(data)
        {
          if (data == 'Light')
            window.location.replace("light_win.html");
          else
            window.location.replace("dark_win.html");
        });
      };

      this.Render = function( Ani )
      {
        var shift = new THREE.Vector3(2, 4, 1).multiplyScalar(this.Scale);
        this.Selector.Mesh.material.uniforms.Time.value = Ani.Timer.GlobalTime;
        Ani.Camera.position.copy(this.Selector.Mesh.position).add(shift);
        Ani.Camera.lookAt(this.Selector.Mesh.position);

        this.MaterialDark.uniforms.Time.value = Ani.Timer.GlobalTime;
      };

      this.InfoUpdate = function()
      {
        var f = this.Board.Get(this.Selector.Mesh.position.z, this.Selector.Mesh.position.x);
        var el = $('#' + InfoId);
        el.empty();
        if (f == null)
          return;
        el.append("<p>Type: " + f.Type + "</p>");
        el.append("<p>Health: " + f.Health + "</p>");
        el.append("<p>Speed: " + f.Speed + "</p>");
        el.append("<p>Range: " + f.Radius + "</p>");
        el.append("<p>Attack: " + f.Attack + "</p>");
      };

      this.Response = function( Ani )
      {
        if (Ani.Keyboard.Keys[38] && Ani.Timer.GlobalTime - this.PrevMov > 0.15)
        {
          this.Selector.Mesh.position.x--;
          this.PrevMov = Ani.Timer.GlobalTime;
          this.InfoUpdate();
        }
        else if (Ani.Keyboard.Keys[40] && Ani.Timer.GlobalTime - this.PrevMov > 0.15)
        {
          this.Selector.Mesh.position.x++;
          this.PrevMov = Ani.Timer.GlobalTime;
          this.InfoUpdate();
        }
        if (Ani.Keyboard.Keys[37] == 1 && Ani.Timer.GlobalTime - this.PrevMov > 0.15)
        {
          this.Selector.Mesh.position.z++;
          this.PrevMov = Ani.Timer.GlobalTime;
          this.InfoUpdate();
        }
        else if (Ani.Keyboard.Keys[39] && Ani.Timer.GlobalTime - this.PrevMov > 0.15)
        {
          this.Selector.Mesh.position.z--;
          this.PrevMov = Ani.Timer.GlobalTime;
          this.InfoUpdate();
        }
        if (Ani.Keyboard.Keys[107])
          this.Scale *= 0.9;
        else if (Ani.Keyboard.Keys[109])
          this.Scale *= 1.1;
      };
    }
  });