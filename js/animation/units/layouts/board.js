define(['prim/characters'], function(char)
{
return function( size, side )
  {
    this.Board = [];
    this.Size = size;
    this.Side = side;

    for (var i = 0; i < size * size; i++)
      this.Board[i] = null;

    /**
     * Copy board from another.
     * @param {Object} Ani - animation structure
     * @param {Object} Board - board to copy
     * @param {Object} Prims - primitives object
     * @param {Number} [offset = this.Size * this.Size + 4]
     */
    this.Copy = function( Ani, Board, Prims, offset )
    {
      Prims.Data.splice(0, this.Size * this.Size);
      this.Board.splice(0, this.Size * this.Size);
      Ani.Scene.children.splice(offset ? offset : this.Size * this.Size + 4, Ani.Scene.children.length);
      for (var j = 0; j < this.Size * this.Size; j++)
      {
        this.Board[j] = Board.Board[j];
        if (this.Board[j] != null)
          Prims.Add(j, this.Board[j]);
      }
    };

    /**
     * Get figure by coordinates.
     * @param {Number} x - x-coordinate
     * @param {Number} y - y-coordinate
     * @returns {Object} - figure
     */
    this.Get = function( x, y )
    {
      return this.Board[y * this.Size + x];
    };

    /**
     * Set figure by coordinates.
     * @param {Number} x - x-coordinate
     * @param {Number} y - y-coordinate
     * @param {Object} Figure - figure
     */
    this.Set = function( x, y, Figure )
    {
      this.Board[y * this.Size + x] = Figure;
    };

    /**
     * Refresh all figures - set full stamina.
     */
    this.Refresh = function()
    {
      for (var i = 0; i < this.Size; i++)
        for (var j = 0; j < this.Size; j++)
          if (this.Get(j, i) != null)
            this.Get(j, i).Stamina = this.Get(j, i).Speed;
    };

    /**
     * Attack one figure by another.
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     * @param {Array} Prims - primitives object
     * @returns {String} - status of move: 'select', 'fail', 'attack', 'kill' or 'win'
     */
    this.Attack = function( x1, y1, x2, y2, Prims )
    {
      var a = this.Get(x1, y1);
      var d = this.Get(x2, y2);

      if (a.Side == d.Side)
        return 'select';

      if (a.Stamina <= 0)
        return 'fail';
      var dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);
      if (a.Side == d.Side)
        return 'select';
      if (dist <= a.Radius)
      {
        this.Get(x2, y2).Health -= a.Attack;
        this.Get(x1, y1).Stamina = 0;
        if (d.Health <= 0)
        {
          // Figure was killed
          Prims.Data[y2 * this.Size + x2].Mesh.visible = false;
          this.Board[y2 * this.Size + x2] = null;
          if (d.Type == "king")
            return 'win';
          return 'kill';
        }
        return 'attack';
      }
      return 'fail';
    };

    /**
     * Move figure.
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     * @param {Array} Prims - primitives object
     * @returns {String} - status of move: 'stop', 'move', 'select', 'fail', 'attack', 'kill' or 'win'
     */
    this.Move = function( x1, y1, x2, y2, Prims )
    {
      console.log(x1 + ", " + y1 + " --> " + x2 + ", " + y2);
      if ((x1 == x2) && (y1 == y2))
        return 'stop';
      if (this.Get(x1, y1) == null)
        if (this.Get(x2, y2) != null && this.Get(x2, y2).Side == this.Side)
          return 'select';
        else
          return 'fail1';
      else
        if (this.Get(x1, y1).Side != this.Side)
          return 'fail2';
      if (this.Get(x2, y2) != null)
        return this.Attack(x1, y1, x2, y2, Prims);
      var dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);
      if (dist > this.Get(x1, y1).Stamina)
        return 'fail3';
      this.Board[y2 * this.Size + x2] = this.Board[y1 * this.Size + x1];
      this.Set(x1, y1, null);
      Prims.Data[y2 * this.Size + x2] = Prims.Data[y1 * this.Size + x1];
      Prims.Data[y1 * this.Size + x1] = null;
      Prims.Data[y2 * this.Size + x2].Mesh.position.add(new THREE.Vector3(y2 - y1, 0, x2 - x1));
      this.Board[y2 * this.Size + x2].Stamina -= dist;
      return 'move';
    };
  }
});
