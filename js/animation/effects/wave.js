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

    this.Dest = new THREE.Mesh(new THREE.TorusKnotGeometry(Scale * 0.5, Scale * 0.05, 100, 10, 3, 4), this.Mats.Light);
    this.Dest.position.set(Pos1[0], Scale * 0.5, Pos1[2]);
    this.Dest.rotateX(Math.PI / 2.0);
    this.Dest.rotateZ(-Math.PI / 4.0);

    this.Time = 0.0;
    Scene.add(this.Dest);

    this.IntervalId = setInterval(function()
    {
      self.Time += self.Delay;
      var t = self.Time / LifeTime * 2.0;
      var v1 = new THREE.Vector3().set(Pos1[0], Scale * 0.5, Pos1[2]).multiplyScalar(1.0 - t);
      var v2 = new THREE.Vector3().set(Pos2[0], Scale * 0.5, Pos2[2]).multiplyScalar(t);
      self.Dest.position.copy(v1.add(v2));
    }, self.Delay);
    setTimeout(function()
    {
      clearInterval(self.IntervalId);
      self.Time = 0;
      self.IntervalId = setInterval(function()
      {
        self.Time += self.Delay;
        var t = 1.0  - self.Time / LifeTime;
        self.Dest.scale.set(t, t, t);
      }, self.Delay);
      setTimeout(function()
        {
          Scene.remove(self.Dest);
        }, LifeTime / 2.0);
    }, LifeTime / 2.0);
  };
});
