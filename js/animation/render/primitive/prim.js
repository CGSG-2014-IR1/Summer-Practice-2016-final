define(function()
  {
    return function()
      {
        this.Copy = function( Geom, Material )
        {
          this.Geometry = Geom;
          this.Material = Material;
        }
      }
  });
