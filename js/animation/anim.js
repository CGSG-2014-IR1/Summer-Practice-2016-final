function anim()
{
  this.Units = [];                                                                                     // Units stock
  this.Render = new render();                                                                          // Scene renderer
  this.Timer = new timer();                                                                            // Scene timer

  /**
   * Initialize animation.
   */
  this.Init = function( DivID )
  {
    var self = this;
    this.Render.Init(DivID);
    this.Timer.Init();
    this.Camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);  // Main scene camera
    this.Keyboard = new keyboard(DivID);

    this.Scene = new THREE.Scene();                                                                    // Main scene
    this.Camera.position.x = 1;
    this.Camera.position.y = 1;
    this.Camera.position.z = 1;
    this.Camera.lookAt(this.Scene.position);

    this.ReflectionCamera = new THREE.CubeCamera(0.01, 1000, 512);                                     // Cubemap camera
    this.ReflectionCamera.position.set(0, 0, 0);

    //this.Controls = new THREE.OrbitControls(this.Camera);                                              // Scene controls
  }

  /**
   * Start animation cycle.
   * @param DivID - ID of WebGL holder.
   */
  this.Run = function( DivID )
  {
    $("#" + DivID).append(this.Render.Renderer.domElement);
    this.DrawAll();
  }

  /**
   * Add unit to animation.
   * @param Unit - unit to add.
   */
  this.UnitAdd = function( Unit )
  {
    this.Units.push(Unit);
    this.Units[this.Units.length - 1].Init(this);
  }

  /**
   * Render scene.
   */
  this.DrawAll = function()
  {
    this.Timer.Update();
    //this.Controls.update(this.Timer.GlobalDeltaTime);
    var self = this;

    // Response
    this.Units.forEach(function(Unit)
      {
        Unit.Response(self);
      }
    );

    // Units render. Seems useless again.
    this.Units.forEach(function(Unit)
      {
        Unit.Render(self);
      }
    );
    // Reflection render
    this.ReflectionCamera.updateCubeMap(this.Render.Renderer, this.Scene);
    // Refraction render
    this.Scene.children.forEach(function( Child )
      {
        if (Child instanceof THREE.Mesh)
          if (Child.material.transparent)
            Child.visible = false;
      });
    this.Render.Renderer.render(this.Scene, this.Camera, this.Render.RefractionRenderTarget);
    this.Scene.children.forEach(function( Child )
      {
        if (Child instanceof THREE.Mesh)
          Child.visible = true;
      });
    // Scene render
    this.Render.Renderer.render(this.Scene, this.Camera);

    window.requestAnimationFrame(function()
    {
      self.DrawAll();
    });
  }

  this.AddPrimitive = function( Prim )
  {
    this.Scene.add(Prim.Mesh);
    return this;
  }

  this.AddLight = function( Light )
  {
    this.Scene.add(Light);
    return this;
  }
};
