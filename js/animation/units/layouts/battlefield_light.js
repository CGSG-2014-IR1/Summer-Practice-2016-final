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

      /**
       * Load figure from .json file.
       * @param {Object} Prims - primitives structure
       * @param {Number} N - number of figures to generate
       * @param {THREE.Vector3} Src - generation offset
       * @param {Number} zc - generation path parameter
       * @param {Number} zd - generation path parameter
       * @param {Number} xc - generation path parameter: position = [zd * i + zc, 0, xc] + Src
       * @param {String} Name
       * @param {String} Side
       * @param {Number} Scale
       */
      this.LoadFigure = function( Prims, N, Dir, Src, zc, zd, xc, Name, Side, Scale )
      {
        var self = this;
        $.getJSON("assets/figures/" + Name + ".json", function(Stats)
        {
          for (i = 0; i < N; i++)
          {
            var figure =
            {
              Type: Stats.Type, Side: Side,
              Sight: Stats.Sight, Radius: Stats.Radius, Speed: Stats.Speed,
              Health: Stats.Health, Attack: Stats.Attack, Stamina: -1
            };
            self.Board.Set(zd * i + zc + Src.z, xc + Src.x, figure);
            Prims.Add(zd * i + zc + Src.z + (xc + Src.x) * self.Size, figure);
            self.Board.Refresh();
            self.InfoUpdate();
          }
        });
      };

      /**
       * Place oni side figures.
       * @param {Object} Prims - primitives structure
       * @param {THREE.Vector3} Src
       * @param {THREE.Vector3} Dir
       * @param {THREE.Material} Material
       * @param {String} Side
       * @param {Number} Scale
       */
      this.PlaceSide = function( Prims, Src, Dir, Side, Scale )
      {
        this.LoadFigure(Prims,  2, Dir, Src,         0, Dir.z * 9,     0,  'tower', Side, Scale);
        this.LoadFigure(Prims,  2, Dir, Src, Dir.z * 1, Dir.z * 7,     0, 'knight', Side, Scale);
        this.LoadFigure(Prims,  2, Dir, Src, Dir.z * 2, Dir.z * 5,     0, 'slayer', Side, Scale);
        this.LoadFigure(Prims,  2, Dir, Src, Dir.z * 3, Dir.z * 3,     0,   'mage', Side, Scale);
        this.LoadFigure(Prims,  1, Dir, Src, Dir.z * 4,         0,     0,  'queen', Side, Scale);
        this.LoadFigure(Prims,  1, Dir, Src, Dir.z * 5,         0,     0,   'king', Side, Scale);
        this.LoadFigure(Prims, 10, Dir, Src,         0, Dir.z * 1, Dir.x,   'pawn', Side, Scale);
      };

      /**
       * Place figures on board in default position
       * @param {Object} Prims
       */
      this.InitFigures = function( Prims )
      {
        this.PlaceSide(Prims, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 1), 'Dark', 0.3);
        this.PlaceSide(Prims, new THREE.Vector3(this.Size - 1, 0, this.Size - 1), new THREE.Vector3(-1, 0, -1), 'Light', 0.3);
      };

      this.Init = function( Ani )
      {
        var self = this;
        this.Materials = new mtllib();
        this.Board = new board(this.Size, 'Light');
        this.Turn = false;
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
        this.Selector.Mesh.position.set(this.Size - 1, 0.001, this.Size - 1);
        this.SelectorFigure = new sprim().CreatePlane(1, 1,
          this.Materials.Selector(new THREE.Vector3(0.5, 0.1, 0.1), new THREE.Vector3(0.1, 0.0, 0.0), 0.33));
        this.SelectorFigure.Mesh.position.set(this.Size - 1, 0.0015, this.Size - 1);
        this.HelpMaterial = this.Materials.Selector(new THREE.Vector3(0.1, 0.2, 0.1), new THREE.Vector3(0.1, 0.3, 0.1), 0.33);
        this.AttackMaterial = this.Materials.Selector(new THREE.Vector3(0.5, 0.2, 0.1), new THREE.Vector3(0.5, 0.3, 0.1), 0.5);
        Math.fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };
        this.Helpers = [];
        for (var i = 0; i < this.Size * this.Size; i++)
        {
          var h = new sprim().CreatePlane(1, 1, this.HelpMaterial);
          h.Mesh.position.z = Math.fmod(i, this.Size);
          h.Mesh.position.y = 0.0008;
          h.Mesh.position.x = Math.floor(i / this.Size);
          h.Mesh.visible = false;
          this.Helpers.push(h);
          Ani.AddPrimitive(h);
        }
        Ani.AddPrimitive(this.Base).AddPrimitive(this.Selector).AddPrimitive(this.SelectorFigure);

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
        this.UpdateHelpers(this.Size - 1, this.Size - 1);

        this.Socket.on('turn', function(Board)
          {
            self.Turn = true;
            self.Board.Copy(Ani, Board, self.Prims);
            self.UpdateHelpers(self.SelectorFigure.Mesh.position.z, self.SelectorFigure.Mesh.position.z);
            self.Board.Refresh();
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
              self.Board.Copy(Ani, sboard, self.Prims);
              self.Board.Side = 'Light';
              self.Turn = (sboard.Side != 'Light');
              self.UpdateHelpers(self.Size - 1, self.Size - 1);
              self.SelectorFigure.Mesh.position.set(self.Size - 1, 0, self.Size - 1);
              self.SelectorFigure.Mesh.position.y = 0.0015;
              self.Selector.Mesh.position.set(self.Size - 1, 0, self.Size - 1);
              self.Selector.Mesh.position.y = 0.001;
              self.Board.Refresh();
              self.InfoUpdate();
            }
            else
              self.InitFigures(self.Prims);
          });
      };

      this.Render = function( Ani )
      {
        var shift = new THREE.Vector3(2, 4, 1).multiplyScalar(this.Scale);
        this.Selector.Mesh.material.uniforms.Time.value = Ani.Timer.GlobalTime;
        this.SelectorFigure.Mesh.material.uniforms.Time.value = Ani.Timer.GlobalTime;
        this.HelpMaterial.uniforms.Time.value = Ani.Timer.GlobalTime;
        this.AttackMaterial.uniforms.Time.value = Ani.Timer.GlobalTime;
        Ani.Camera.position.copy(this.Selector.Mesh.position).add(shift);
        Ani.Camera.lookAt(this.Selector.Mesh.position);

        this.Prims.Data.forEach(function(prim)
        {
          if (!prim)
            return;
          if (prim.Mesh.material.uniforms.Time)
            prim.Mesh.material.uniforms.Time.value = Ani.Timer.GlobalTime;
          prim.Mesh.material.uniforms.TextureRefraction.value = Ani.Render.RefractionRenderTarget.texture;
        });
      };

      this.UpdateHelpers = function( zf, xf )
      {
        var f = this.Board.Get(zf, xf);
        for (var i = 0; i < this.Size * this.Size; i++)
        {
          var z = Math.fmod(i, this.Size);
          var x = Math.floor(i / this.Size);
          var dist = Math.abs(z - zf) + Math.abs(x - xf);
          if (f != null)
          {
            this.Helpers[i].Mesh.visible = (dist <= f.Speed || dist <= f.Radius);
            if (this.Board.Get(z, x) != null)
              if (this.Board.Get(z, x).Side == f.Side)
                if (dist <= f.Stamina)
                  this.Helpers[i].Mesh.material = this.HelpMaterial;
                else
                  this.Helpers[i].Mesh.visible = false;
              else
                if (dist <= f.Radius && f.Stamina > 0)
                  this.Helpers[i].Mesh.material = this.AttackMaterial;
                else
                  if (dist <= f.Stamina)
                    this.Helpers[i].Mesh.material = this.HelpMaterial;
                  else
                    this.Helpers[i].Mesh.visible = false;
            else
              if (dist <= f.Stamina)
                this.Helpers[i].Mesh.material = this.HelpMaterial;
              else
                this.Helpers[i].Mesh.visible = false;
          }
          else
            this.Helpers[i].Mesh.visible = false;
        }
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
          (this.Selector.Mesh.position.x > 0))
        {
          this.Selector.Mesh.position.x--;
          this.PrevMov = Ani.Timer.GlobalTime;
          this.InfoUpdate();
        }
        else if (Ani.Keyboard.Keys[40] &&
          (Ani.Timer.GlobalTime - this.PrevMov > 0.15) &&
          (this.Selector.Mesh.position.x < this.Size - 1))
        {
          this.Selector.Mesh.position.x++;
          this.PrevMov = Ani.Timer.GlobalTime;
          this.InfoUpdate();
        }
        if (Ani.Keyboard.Keys[37] == 1 &&
          (Ani.Timer.GlobalTime - this.PrevMov > 0.15) &&
          (this.Selector.Mesh.position.z < this.Size - 1))
        {
          this.Selector.Mesh.position.z++;
          this.PrevMov = Ani.Timer.GlobalTime;
          this.InfoUpdate();
        }
        else if (Ani.Keyboard.Keys[39] &&
          (Ani.Timer.GlobalTime - this.PrevMov > 0.15) &&
          (this.Selector.Mesh.position.z > 0))
        {
          this.Selector.Mesh.position.z--;
          this.PrevMov = Ani.Timer.GlobalTime;
          this.InfoUpdate();
        }
        if (Ani.Keyboard.Keys[107])
          this.Scale *= 0.9;
        else if (Ani.Keyboard.Keys[109])
          this.Scale *= 1.1;

        if (this.Turn && Ani.Keyboard.Keys[13] && Ani.Timer.GlobalTime - this.PrevMov > 0.15)
        {
          var p0 = new THREE.Vector3().copy(this.SelectorFigure.Mesh.position);
          var p1 = new THREE.Vector3().copy(this.Selector.Mesh.position);
          this.Socket.emit('move', [p0.z, p0.x, p1.z, p1.x]);
          this.PrevMov = Ani.Timer.GlobalTime;

          var m = this.Board.Move(p0.z, p0.x, p1.z, p1.x, this.Prims, Ani);
          switch (m)
          {
            case 'fail':
              break;
            case 'move':
            case 'stop':
            case 'select':
              this.UpdateHelpers(p1.z, p1.x);
              this.SelectorFigure.Mesh.position.copy(this.Selector.Mesh.position);
              this.SelectorFigure.Mesh.position.y = 0.0015;
              break;
            case 'kill':
            case 'attack':
              this.UpdateHelpers(p0.z, p0.x);
              this.InfoUpdate();
              break;
            case 'win':
              this.Socket.emit('win', 'Light');
              break;
          }
        }

        if (this.Turn && Ani.Keyboard.Keys[45] && Ani.Timer.GlobalTime - this.PrevMov > 0.15)
        {
          this.Socket.emit('turn', this.Board);
          this.Turn = false;
          this.Socket.emit('chat message', {message: "Darkness, it's your turn now!", user: 'LIGHT'});
        }
      };
    }
  });