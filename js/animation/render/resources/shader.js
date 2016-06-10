define(function()
  {
    return function()
      {
        /**
         * @return string
         */
        this.Load = function(Id)
        {
          var str = "";
          var client = new XMLHttpRequest();
          client.open('GET', Id, false);
          client.onreadystatechange = function()
          {
            str = client.responseText;
          };
          client.send();

          return str;
        }
      }
  });