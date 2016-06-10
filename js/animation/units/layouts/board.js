function board( size )
{
  this.Board = [];

  this.Get = function( x, y )
  {
    return this.Board[y * size + x];
  }

  this.Set = function( x, y, Figure )
  {
  }
}
