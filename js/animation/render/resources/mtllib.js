define(
  [
    'res/shader'
  ], function(shader)
  {
    return function()
      {
        var self = this;
        this.Field = null;
        $.getJSON("assets/materials/field.json", function(props)
          {
            self.Field = new THREE.ShaderMaterial(
              {
                uniforms:
                {
                  Color1: { type: "v3", value: new THREE.Vector3(props.Color1[0], props.Color1[1], props.Color1[2]) },
                  Color2: { type: "v3", value: new THREE.Vector3(props.Color2[0], props.Color2[1], props.Color2[2]) }
                },
                side: THREE.DoubleSide,
                vertexShader: new shader().Load(props.VertexShader),
                fragmentShader: new shader().Load(props.FragmentShader),
                transparent: false
              });
          });
        this.Dark = new THREE.ShaderMaterial(
          {
            uniforms: {
              "TextureRefraction": {type: "t", value: 0 },
              "DiffuseColor": {type: "v3", value: new THREE.Vector3(0.9, 0.9, 0.9)},
              "DistortionStrength": {type: "f", value: 0.05},
              "Time": {type: "f"}
            },
            side: THREE.DoubleSide,
            vertexShader: new shader().Load("../js/shaders/dark_transparent.vert"),
            fragmentShader: new shader().Load("../js/shaders/dark_transparent.frag"),
            transparent: true
          });
        this.Dark.refractive = true;
        this.Light = new THREE.ShaderMaterial(
          {
            uniforms: {
              "TextureRefraction": {type: "t", value: 0 },
              "DiffuseColor": {type: "v3", value: new THREE.Vector3(0.9, 0.9, 0.9)},
              "DistortionStrength": {type: "f", value: 0.05}
            },
            side: THREE.DoubleSide,
            vertexShader: new shader().Load("../js/shaders/light_transparent.vert"),
            fragmentShader: new shader().Load("../js/shaders/light_transparent.frag"),
            transparent: true
          });
        this.Light.refractive = true;

        /**
         * Create selector material.
         * @param {THREE.Vector3} col1
         * @param {THREE.Vector3} col2
         * @param {Number} alpha
         * @returns {THREE.Material}
         */
        this.Selector = function( col1, col2, alpha )
        {
          return new THREE.ShaderMaterial(
            {
              uniforms:
              {
                "ColorBase": {type: "v3", value: col1},
                "ColorAdd": {type: "v3", value: col2},
                "Time": {type: "f", value: 0},
                "Alpha": {type: "f", value: alpha}
              },
              side: THREE.DoubleSide,
              vertexShader: new shader().Load("../js/shaders/environment/selector.vert"),
              fragmentShader: new shader().Load("../js/shaders/environment/selector.frag"),
              transparent: true
            });
        };
      }
  });
