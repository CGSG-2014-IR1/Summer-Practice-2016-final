define(function()
  {
    return function(ElementId)
      {
        this.Element = $('#' + ElementId);
        var self = this;

        this.Keys = [];
        $(document).keydown(function(Key)
        {
          self.Keys[Key.keyCode] = true;
          if (Key.keyCode == 13 || // enter
            Key.keyCode == 32 ||   // space
            Key.keyCode == 38 ||   // up
            Key.keyCode == 37 ||   // left
            Key.keyCode == 39 ||   // right
            Key.keyCode == 40)     // down
            return false;
          else
            return true;
        });
        $(document).keyup(function(Key)
        {
          self.Keys[Key.keyCode] = false;
        });
      }
  });
