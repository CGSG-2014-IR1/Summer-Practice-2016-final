function unit_skybox( Path, Ext )
{
  this.Path = Path;
  this.Ext = Ext;

  this.Init = function( Ani )
  {
    var self = this;

    this.Skybox = CreateSkybox(this.Path, this.Ext);
    Ani.AddPrimitive(this.Skybox);
  };

  this.Render = function( Ani )
  {
    this.Skybox.Mesh.scale.set(Ani.Camera.far / 2, Ani.Camera.far / 2, Ani.Camera.far / 2);
    this.Skybox.Mesh.position.copy(Ani.Camera.position);
  };

  this.Response = function( Ani )
  {
  };
}


