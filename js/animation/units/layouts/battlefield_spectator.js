define(
  [
    'prim/characters',
    'prim/sprim',
    'units/environment/unit_skybox',
    './board',
    'res/mtllib'
  ], function(char, sprim, unit_skybox, board, mtllib)
  {
    return function( socket, size, InfoId )
    {
      this.Size = size;
      this.Socket = socket;
      this.InfoId = InfoId;

      this.Init = function( Ani )
      {
        var self = this;
        this.Materials = new mtllib();
        this.Board = new board(this.Size, 'Neutral');
        this.UnitSkybox = new unit_skybox("../assets/textures/skybox/battle1/", ".bmp");
        Ani.UnitAdd(this.UnitSkybox);
        Ani.Camera.position.set(-1, 4, -2);
        Ani.Camera.lookAt(new THREE.Vector3(0, 0, 0));
        Ani.Camera.fov = 60;

        this.Base = new sprim().CreatePlane(this.Size, this.Size, this.Materials.Field);
        var intervalid = setInterval(function()
        {
          if (self.Materials.Field)
          {
            self.Base.Mesh.material = self.Materials.Field;
            clearInterval(intervalid);
          }
        }, 250);
        this.Base.Mesh.position.set(this.Size / 2.0 - 0.5, 0, this.Size / 2.0 - 0.5);
        this.Selector = new sprim().CreatePlane(1, 1,
          this.Materials.Selector(new THREE.Vector3(0.3, 0.3, 0.2), new THREE.Vector3(0.2, 0.2, 0.1), 0.5));
        this.Selector.Mesh.position.set(0, 0.001, 0);
        Math.fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };
        Ani.AddPrimitive(this.Base).AddPrimitive(this.Selector);

        this.PrevMov = Ani.Timer.GlobalTime;
        this.Scale = 1;

        this.Prims =
          {
            Data: [],
            Ani: Ani,
            Add: function( ind, figure )
            {
              this.Data[ind] = new char().CreateFigure(figure.Type, 0.3, figure.Side == 'Dark' ? self.Materials.Dark : self.Materials.Light);
              this.Data[ind].Mesh.position.add(new THREE.Vector3(Math.floor(ind / self.Size), 0, Math.fmod(ind, self.Size)));
              this.Ani.AddPrimitive(this.Data[ind]);
            }
          };

        this.Socket.on('turn', function(Board)
          {
            self.Board.Copy(Ani, Board, self.Prims, 3);
            self.InfoUpdate();
          });
        this.Socket.on('win', function(data)
          {
            if (data == 'Light')
              window.location.replace("light_win.html");
            else
              window.location.replace("dark_win.html");
          });
        this.Socket.emit('sync');
        this.Socket.on('sync', function(sboard)
          {
            if (sboard)
            {
              self.Board.Copy(Ani, sboard, self.Prims, 3);
              self.Board.Side = 'Neutral';
              self.Selector.Mesh.position.set(0, 0, 0);
              self.Selector.Mesh.position.y = 0.001;
              self.InfoUpdate();
            }
          });
      };

      this.Render = function( Ani )
      {
        var shift = new THREE.Vector3(-2, 4, -1).multiplyScalar(this.Scale);
        this.Selector.Mesh.material.uniforms.Time.value = Ani.Timer.GlobalTime;
        Ani.Camera.position.copy(this.Selector.Mesh.position).add(shift);
        Ani.Camera.lookAt(this.Selector.Mesh.position);

        this.Prims.Data.forEach(function(prim)
        {
          if (prim == null)
            return;
          if (prim.Mesh.material.uniforms.Time)
            prim.Mesh.material.uniforms.Time.value = Ani.Timer.GlobalTime;
          prim.Mesh.material.uniforms.TextureRefraction.value = Ani.Render.RefractionRenderTarget.texture;
        });
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
        if (Ani.Keyboard.Keys[38] &&
          (Ani.Timer.GlobalTime - this.PrevMov > 0.15) &&
          (this.Selector.Mesh.position.x < this.Size - 1))
        {
          this.Selector.Mesh.position.x++;
          this.PrevMov = Ani.Timer.GlobalTime;
          this.InfoUpdate();
        }
        else if (Ani.Keyboard.Keys[40] &&
          (Ani.Timer.GlobalTime - this.PrevMov > 0.15) &&
          (this.Selector.Mesh.position.x > 0))
        {
          this.Selector.Mesh.position.x--;
          this.PrevMov = Ani.Timer.GlobalTime;
          this.InfoUpdate();
        }
        if (Ani.Keyboard.Keys[37] == 1 &&
          (Ani.Timer.GlobalTime - this.PrevMov > 0.15) &&
          (this.Selector.Mesh.position.z > 0))
        {
          this.Selector.Mesh.position.z--;
          this.PrevMov = Ani.Timer.GlobalTime;
          this.InfoUpdate();
        }
        else if (Ani.Keyboard.Keys[39] &&
          (Ani.Timer.GlobalTime - this.PrevMov > 0.15) &&
          (this.Selector.Mesh.position.z < this.Size - 1))
        {
          this.Selector.Mesh.position.z++;
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