function render()
{
  this.InitGL = function( DivID )
  {
    this.Renderer = new THREE.WebGLRenderer();
    var col = new THREE.Color(0.6, 0.1, 0.1);
    this.Renderer.setClearColor(col, 1);
    var div = $('#' + DivID);
    var w = div.width();
    var h = div.height();
    this.Renderer.setSize(w, h);
    this.Renderer.shadowMap.enabled = true;
    this.Renderer.shadowMap.soft = true;
    this.Renderer.shadowCameraNear = 0.1;
    this.Renderer.shadowCameraFar = 1000;
    this.Renderer.shadowCameraFov = 50;

    this.RefractionRenderTarget = new THREE.WebGLRenderTarget(512, 512);
  }

  this.Init = function( DivID )
  {
    this.InitGL( DivID );
  }
}