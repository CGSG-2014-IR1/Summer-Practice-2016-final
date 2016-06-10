define(['prim/prim'], function(prim)
  {
    return function()
      {
        this.CreateQueen = function( Scale, Material )
        {
          var ret = new prim();
          var m = new THREE.Matrix4();
          ret.Geometry = new THREE.SphereGeometry(Scale, 15, 15);
          m.makeTranslation(0, Scale * -1.0, 0).multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2.0));
          ret.Geometry.merge(new THREE.CircleGeometry(Scale * 1.5, 15), m);
          m.makeTranslation(0, Scale * 1.25, 0).multiply(new THREE.Matrix4().makeRotationY(Math.PI / 2.0));
          ret.Geometry.merge(new THREE.CircleGeometry(Scale * 0.5, 15), m);
          m.makeTranslation(0, Scale * 1.25, 0);
          ret.Geometry.merge(new THREE.CircleGeometry(Scale * 0.5, 15), m);
          m.makeTranslation(0, Scale * -2.5, 0);
          m.makeTranslation(0, Scale * -2.5, 0);
          ret.Geometry.merge(new THREE.CylinderGeometry(Scale, -Scale, Scale * 3, 10, 30, true), m);
          ret.Mesh = new THREE.Mesh(ret.Geometry, Material);
          ret.Mesh.position.set(0, Scale * 4.0, 0);
          ret.Mesh.receiveShadow = true;
          ret.Mesh.castShadow = true;

          return ret;
        };

        this.CreateKing = function( Scale, Material )
        {
          Scale *= 1.1;
          var ret = new prim();
          var m = new THREE.Matrix4();
          ret.Geometry = new THREE.SphereGeometry(Scale, 15, 15);
          m.makeTranslation(0, Scale * -1.0, 0).multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2.0));
          ret.Geometry.merge(new THREE.CircleGeometry(Scale * 1.5, 15), m);
          m.makeTranslation(0, Scale * 1.25, 0).multiply(new THREE.Matrix4().makeRotationY(Math.PI / 2.0));
          ret.Geometry.merge(new THREE.CircleGeometry(Scale * 0.5, 15), m);
          m.makeTranslation(0, Scale * 1.25, 0);
          ret.Geometry.merge(new THREE.CircleGeometry(Scale * 0.5, 15), m);
          m.makeTranslation(0, Scale * -2.5, 0);
          ret.Geometry.merge(new THREE.CylinderGeometry(Scale, Scale, Scale * 3, 10, 30, true), m);
          ret.Mesh = new THREE.Mesh(ret.Geometry, Material);
          ret.Mesh.position.set(0, Scale * 4.0, 0);
          ret.Mesh.receiveShadow = true;
          ret.Mesh.castShadow = true;

          return ret;
        };

        this.CreatePawn = function( Scale, Material )
        {
          Scale *= 0.75;
          var ret = new prim();
          var m = new THREE.Matrix4();
          ret.Geometry = new THREE.SphereGeometry(Scale, 15, 15);
          m.makeTranslation(0, Scale * -2.5, 0);
          ret.Geometry.merge(new THREE.CylinderGeometry(Scale, -Scale, Scale * 3, 10, 30, true), m);
          ret.Mesh = new THREE.Mesh(ret.Geometry, Material);
          ret.Mesh.position.set(0, Scale * 4.0, 0);
          ret.Mesh.receiveShadow = true;
          ret.Mesh.castShadow = true;

          return ret;
        };

        this.CreateTower = function( Scale, Material )
        {
          Scale *= 1.2;
          var ret = new prim();
          var m = new THREE.Matrix4();
          ret.Geometry = new THREE.CylinderGeometry(Scale * 1.5, Scale * 0.5, Scale * 0.5, 15, 15);
          m.makeTranslation(0, Scale * -2.0, 0);
          ret.Geometry.merge(new THREE.CylinderGeometry(Scale * 0.5, Scale * 0.75, Scale * 4, 10, 30, true), m);
          m.makeTranslation(0, Scale * -4.5, 0);
          ret.Geometry.merge(new THREE.CylinderGeometry(Scale * 0.75, Scale * 1.2, Scale, 10, 30, true), m);
          ret.Mesh = new THREE.Mesh(ret.Geometry, Material);
          ret.Mesh.position.set(0, Scale * 5.0, 0);
          ret.Mesh.receiveShadow = true;
          ret.Mesh.castShadow = true;

          return ret;
        };

        this.CreateSlayer = function( Scale, Material )
        {
          Scale *= 0.9;
          var ret = new prim();
          var m = new THREE.Matrix4();
          ret.Geometry = new THREE.CylinderGeometry(Scale * 1.5, Scale * 0.5, Scale * 0.5, 10, 30, true);
          m.makeTranslation(0, Scale, 0);
          ret.Geometry.merge(new THREE.CylinderGeometry(0, Scale * 1.5, Scale * 1.5, 10, 30, true), m);
          m.makeTranslation(0, Scale * -2.0, 0);
          ret.Geometry.merge(new THREE.CylinderGeometry(Scale * 0.5, Scale * 0.75, Scale * 4, 10, 30, true), m);
          m.makeTranslation(0, Scale * -4.5, 0);
          ret.Geometry.merge(new THREE.CylinderGeometry(Scale * 0.75, Scale * 1.2, Scale, 10, 30, true), m);
          ret.Mesh = new THREE.Mesh(ret.Geometry, Material);
          ret.Mesh.position.set(0, Scale * 5.0, 0);
          ret.Mesh.receiveShadow = true;
          ret.Mesh.castShadow = true;

          return ret;
        };

        this.CreateMage = function( Scale, Material )
        {
          var ret = new prim();
          var m = new THREE.Matrix4();
          ret.Geometry = new THREE.SphereGeometry(Scale, 15, 15);

          m.makeTranslation(0, Scale * -2.75, 0);
          ret.Geometry.merge(new THREE.CylinderGeometry(Scale * 0.5, 0, Scale * 3, 10, 30, true), m);
          ret.Mesh = new THREE.Mesh(ret.Geometry, Material);
          ret.Mesh.position.set(0, Scale * 5.0, 0);
          ret.Mesh.receiveShadow = true;
          ret.Mesh.castShadow = true;

          return ret;
        };

        this.CreateKnight = function( Scale, Material )
        {
          var ret = new prim();
          var m = new THREE.Matrix4();
          ret.Geometry = new THREE.CubeGeometry(Scale * 0.5, Scale * 5.0, Scale * 0.5);

          m.makeTranslation(0, Scale * 2.75, 0);
          ret.Geometry.merge(new THREE.CubeGeometry(Scale * 2.0, Scale * 1.0, Scale * 2.0), m);
          ret.Mesh = new THREE.Mesh(ret.Geometry, Material);
          ret.Mesh.position.set(0, Scale * 2.5, 0);
          ret.Mesh.receiveShadow = true;
          ret.Mesh.castShadow = true;

          return ret;
        };
      }
  });