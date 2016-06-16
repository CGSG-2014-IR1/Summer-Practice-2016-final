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
    this.Mats.Light.uniforms.DiffuseColor.value = new THREE.Vector3(0.6, 0.5, 0.5);
    this.Delay = 1000.0 / 60.0;

    this.Dest = new THREE.Mesh(new THREE.BoxGeometry(Scale, Scale, Scale), this.Mats.Light);
    this.Dest.position.set(Pos2[0], Scale * 5, Pos2[2]);

    this.Time = 0;

    Scene.add(this.Dest);

    this.IntervalId = setInterval(function()
    {
      self.Time += self.Delay;
      var t = self.Time / LifeTime;
      self.Dest.position.y = Scale * 5 * (1.0 - t) + Scale * t;
    }, self.Delay);
    setTimeout(function()
    {
      clearInterval(self.IntervalId);
      Scene.remove(self.Dest);
    }, LifeTime);
  };
});
