define(['res/mtllib'], function(mtllib)
{
  /**
   * @param {THREE.Scene} Scene
   * @param {Float32Array} Pos1
   * @param {Float32Array} Pos2
   * @param {Number} LifeTime
   * @param {Number} Scale
   */
  return function( Scene, Pos1, Pos2, LifeTime, Scale )
  {
    var self = this;
    this.Mats = new mtllib();
    this.Delay = 1000.0 / 60.0;

    this.Dest = new THREE.Mesh(new THREE.CircleGeometry(Scale, 10, 0, Math.PI / 2), this.Mats.Light);
    this.Dest.position.set(Pos1[0], Pos1[1], Pos1[2]);
    this.Dest.rotateX(Math.PI / 2.0);
    this.Dest.rotateZ(-Math.PI / 4.0);
    //this.Time = 0;

    if (Pos1[0] > Pos2[0])
      this.Dest.rotateZ(1 * Math.PI / 2.0);
    else if (Pos1[0] < Pos2[0])
      this.Dest.rotateZ(-1 * Math.PI / 2.0);
    else if (Pos1[2] > Pos2[2])
      this.Dest.rotateZ(2 * Math.PI / 2.0);
    else
      this.Dest.rotateZ(0 * Math.PI / 2.0);

    Scene.add(this.Dest);

    this.IntervalId = setInterval(function()
    {
      //self.Time += self.Delay;
      self.Dest.rotateZ(self.Delay / 1000.0 * Math.PI * 15.0);
    }, self.Delay);
    setTimeout(function()
    {
      clearInterval(self.IntervalId);
      Scene.remove(self.Dest);
    }, LifeTime);
  };
});
