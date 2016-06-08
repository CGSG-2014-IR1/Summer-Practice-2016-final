function texture()
{
  this.CreateCubeMap = function( Path, Format )
  {
    var urls =
    [
      Path + 'posx' + Format, Path + 'negx' + Format,
      Path + 'posy' + Format, Path + 'negy' + Format,
      Path + 'posz' + Format, Path + 'negz' + Format
    ];
    this.Tex = THREE.ImageUtils.loadTextureCube(urls, THREE.CubeReflectionMapping);
    return this;
  }
}
