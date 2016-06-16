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
    this.Mats.Light.uniforms.DiffuseColor.value = new THREE.Vector3(0.5, 0.5, 0.9);
    this.Delay = 1000.0 / 60.0;

    var m = new THREE.Matrix4();
    var geom = new THREE.CylinderGeometry(Scale * 0.05, Scale * 0.05, Scale * 1.5,10, 2, false);
    geom.merge(new THREE.CylinderGeometry(Scale * 0.05, Scale * 0.05, Scale * 1.5,10, 2, false), m.makeRotationZ(Math.PI * 0.25));
    geom.merge(new THREE.CylinderGeometry(Scale * 0.05, Scale * 0.05, Scale * 1.5,10, 2, false), m.makeRotationZ(Math.PI * 0.5));
    geom.merge(new THREE.CylinderGeometry(Scale * 0.05, Scale * 0.05, Scale * 1.5,10, 2, false), m.makeRotationZ(Math.PI * 0.75));
    geom.merge(new THREE.CylinderGeometry(Scale * 0.05, Scale * 0.05, Scale * 1.5,10, 2, false),
      m.makeRotationY(Math.PI * 0.5).multiply(new THREE.Matrix4().makeRotationZ(Math.PI * 0.25)));
    geom.merge(new THREE.CylinderGeometry(Scale * 0.05, Scale * 0.05, Scale * 1.5,10, 2, false),
      m.makeRotationY(Math.PI * 0.5).multiply(new THREE.Matrix4().makeRotationZ(Math.PI * 0.5)));
    geom.merge(new THREE.CylinderGeometry(Scale * 0.05, Scale * 0.05, Scale * 1.5,10, 2, false),
      m.makeRotationY(Math.PI * 0.5).multiply(new THREE.Matrix4().makeRotationZ(Math.PI * 0.75)));
    this.Dest = new THREE.Mesh(geom, this.Mats.Light);
    self.Dest.scale.set(0, 0, 0);
    this.Dest.position.set(Pos2[0], Scale * 0.5, Pos2[2]);

    this.Time = 0;

    Scene.add(this.Dest);

    this.IntervalId = setInterval(function()
    {
      self.Time += self.Delay;
      var t = self.Time / LifeTime;
      self.Dest.scale.set(t, t, t); 
    }, self.Delay);
    setTimeout(function()
    {
      clearInterval(self.IntervalId);
      Scene.remove(self.Dest);
    }, LifeTime);
  };
});
