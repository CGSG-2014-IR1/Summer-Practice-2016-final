function CreatePlane( du, dv, Material )
{
  if (!du)
    du = 1.0;
  if (!dv)
    dv = 1.0;
  var ret = new prim();
  ret.Geometry = new THREE.PlaneGeometry(du, dv);
  var mtl;
  if (!Material)
  {
    mtl = new THREE.MeshLambertMaterial();
    var col = new THREE.Color(0.5, 0.5, 0.5);
    mtl.color = col;
  }
  else
    mtl = Material;

  ret.Mesh = new THREE.Mesh(ret.Geometry, mtl);
  ret.Mesh.rotation.x = -0.5 * Math.PI;
  ret.Mesh.receiveShadow = true;
  ret.Mesh.castShadow = true;

  return ret;
}

function CreateBox( sx, sy, sz, Material )
{
  if (!sx)
    sx = 1.0;
  if (!sy)
    sy = 1.0;
  if (!sz)
    sz = 1.0;
  var ret = new prim();
  ret.Geometry = new THREE.CubeGeometry(sx, sy, sz);
  var mtl;
  if (!Material)
  {
    mtl = new THREE.MeshLambertMaterial();
    var col = new THREE.Color(0.5, 0.5, 0.5);
    mtl.color = col;
  }
  else
    mtl = Material;

  ret.Mesh = new THREE.Mesh(ret.Geometry, mtl);
  ret.Mesh.receiveShadow = true;
  ret.Mesh.castShadow = true;

  return ret;
}

function CreateSphere( r, segmh, segmv, Material )
{
  if (!r)
    r = 1.0;
  if (!segmh)
    segmh = 8.0;
  if (!segmv)
    segmv = 8.0;
  var ret = new prim();
  ret.Geometry = new THREE.SphereGeometry(r, segmh, segmv);
  var mtl;
  if (!Material)
  {
    mtl = new THREE.MeshLambertMaterial();
    var col = new THREE.Color(0.5, 0.5, 0.5);
    mtl.color = col;
  }
  else
    mtl = Material;

  ret.Mesh = new THREE.Mesh(ret.Geometry, mtl);
  ret.Mesh.receiveShadow = true;
  ret.Mesh.castShadow = true;

  return ret;
}

function CreateSkybox( Path, Format )
{
  if (!Path || !Format)
    throw "ERROR: Failed to create skybox: texture path not defined.";

  var ret = new prim();
  var mtl = new material();
  mtl.CreateCubeMapMaterial(Path, Format);

  ret.Mesh = new THREE.Mesh(
    new THREE.CubeGeometry(1, 1, 1), mtl.Mtl);
  ret.Material = mtl;

  return ret;
}