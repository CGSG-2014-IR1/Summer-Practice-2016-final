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
        });
        $(document).keyup(function(Key)
        {
          self.Keys[Key.keyCode] = false;
        });
      }
  });
