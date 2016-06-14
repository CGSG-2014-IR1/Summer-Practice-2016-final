define(function()
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
        console.log(self);
        this.Delay = 1000.0 / 60.0;

        var tex = THREE.ImageUtils.loadTexture("../assets/textures/effects/circle.png");

        this.Source = new THREE.Mesh(new THREE.CircleGeometry(Scale, 10),
          new THREE.MeshBasicMaterial(
            {
              color: 0x4444aa,
              side: THREE.DoubleSide,
              map: tex,
              opacity: 0.9,
              transparent: true
            }
          ));
        this.Source.position.set(Pos1[0], Pos1[1], Pos1[2]);
        this.Source.rotateX(Math.PI / 2.0);

        this.Dest = new THREE.Mesh(new THREE.CircleGeometry(Scale, 10),
          new THREE.MeshBasicMaterial(
            {
              color: 0xaa4444,
              side: THREE.DoubleSide,
              map: tex,
              opacity: 0.9,
              transparent: true
            }
          ));
        this.Dest.position.set(Pos2[0], Pos2[1], Pos2[2]);
        this.Dest.rotateX(Math.PI / 2.0);

        this.Column = new THREE.Mesh(new THREE.CylinderGeometry(Scale * 0.1, Scale * 0.1, Scale * 5, 10, 3, false),
          new THREE.MeshBasicMaterial(
            {
              color: 0xaa4444,
              side: THREE.DoubleSide,
              map: tex,
              opacity: 0.9,
              transparent: true
            }
          ));
        this.Column.position.set(Pos2[0], Scale * 2.5 + Pos2[1], Pos2[2]);

        Scene.add(this.Source).add(this.Dest).add(this.Column);

        this.IntervalId = setInterval(function()
        {
          //self.Time += self.Delay;
          self.Dest.rotateZ(self.Delay / 1000.0 * Math.PI / 8.0);
          self.Column.rotateY(-self.Delay / 1000.0 * Math.PI / 8.0);
          self.Source.rotateZ(self.Delay / 1000.0 * Math.PI / 8.0);
        }, self.Delay);
        setTimeout(function()
          {
            clearInterval(self.IntervalId);
            Scene.remove(self.Source);
            Scene.remove(self.Dest);
            Scene.remove(self.Column);
          }, LifeTime);
      };
  });
