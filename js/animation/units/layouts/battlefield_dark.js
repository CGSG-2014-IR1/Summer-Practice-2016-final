function battlefield_dark()
{
  this.Init = function( Ani )
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

    var dark_transparent_material = new THREE.ShaderMaterial(
      {
        uniforms:
        {
          "TextureRefraction": { type: "t", value: Ani.Render.RefractionRenderTarget.texture },
          "CameraPos": { type: "v3", value: Ani.Camera.position },
          "DiffuseColor": { type: "v3", value: new THREE.Vector3(0.1, 0.1, 0.1) },
          "DistortionStrength" : { type: "f", value: 0.05 },
          "Time" : { type: "f", value: Ani.Timer.Time }
        },
        side: THREE.DoubleSide,
        vertexShader: LoadShaderText("../js/shaders/dark_transparent.vert"),
        fragmentShader: LoadShaderText("../js/shaders/dark_transparent.frag"),
        transparent: true
      });
   this.Base = CreatePlane(10, 10, new THREE.ShaderMaterial(
      {
        uniforms:
        {
          "Color1": { type: "v3", value: new THREE.Vector3(0.5, 0.5, 0.5) },
          "Color2": { type: "v3", value: new THREE.Vector3(0.1, 0.1, 0.1) }
        },
        side: THREE.DoubleSide,
        vertexShader: LoadShaderText("../js/shaders/environment/field.vert"),
        fragmentShader: LoadShaderText("../js/shaders/environment/field.frag"),
        transparent: false
      }));
    this.Base.Mesh.position.set(-4.5, 0, 4.5);
    this.Selector = CreatePlane(1, 1, new THREE.ShaderMaterial(
      {
        uniforms:
        {
          "ColorBase": { type: "v3", value: new THREE.Vector3(0.3, 0.3, 0.2) },
          "ColorAdd": { type: "v3", value: new THREE.Vector3(0.2, 0.2, 0.1) },
          "Time": { type: "f", value: Ani.Timer.GlobalTime }
        },
        side: THREE.DoubleSide,
        vertexShader: LoadShaderText("../js/shaders/environment/selector.vert"),
        fragmentShader: LoadShaderText("../js/shaders/environment/selector.frag"),
        transparent: false
      }));
    this.Selector.Mesh.position.y = 0.001;
    this.SelectorFigure = CreatePlane(1, 1, new THREE.ShaderMaterial(
      {
        uniforms:
        {
          "ColorBase": { type: "v3", value: new THREE.Vector3(0.5, 0.1, 0.1) },
          "ColorAdd": { type: "v3", value: new THREE.Vector3(0.1, 0.0, 0.0) },
          "Time": { type: "f", value: Ani.Timer.GlobalTime }
        },
        side: THREE.DoubleSide,
        vertexShader: LoadShaderText("../js/shaders/environment/selector.vert"),
        fragmentShader: LoadShaderText("../js/shaders/environment/selector.frag"),
        transparent: false
      }));
    this.SelectorFigure.Mesh.position.y = 0.0005;
    Ani.AddPrimitive(this.Base).AddPrimitive(this.Selector).AddPrimitive(this.SelectorFigure);

    this.PrevMov = Ani.Timer.GlobalTime;
    this.Scale = 1;
  };

  this.Render = function( Ani )
  {
    var shift = new THREE.Vector3(1, 4, -2).multiplyScalar(this.Scale);
    this.Selector.Mesh.material.uniforms.Time.value = Ani.Timer.GlobalTime;
    this.SelectorFigure.Mesh.material.uniforms.Time.value = Ani.Timer.GlobalTime;
    Ani.Camera.position.copy(this.Selector.Mesh.position).add(shift);
    Ani.Camera.lookAt(this.Selector.Mesh.position);
  };

  this.Response = function( Ani )
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
