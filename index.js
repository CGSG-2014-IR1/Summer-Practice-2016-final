var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

var White = -1;
var Black = -1;
var Sockets = [];

var server = http.createServer(function(request, response)
  {
    var path = url.parse(request.url).pathname;

    if (Sockets.length >= 2 && path == '/index.html')
      path = '/spectator.html';

    switch (path)
    {
    case '/':
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write('Go to index.html.');
      response.end();
      break;
    default:
      fs.readFile(__dirname + path, function(error, data)
        {
          if (error)
          {
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
            response.end();
          }
          else
          {
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(data, "utf8");
            response.end();
          }
        });
      break;
    }
  });

server.listen(8000);
var listener = io.listen(server);
listener.sockets.on('connection', function(socket)
  {
    socket.on('connected', function()
      {
        Sockets.push(socket);
      });

    socket.on('chat message', function(data)
    {
      listener.emit('chat message', data);
    });

    socket.on('side', function(data)
    {
      if (data === "light")
        White = socket;
      else if (data === "dark")
        Black = socket;
      socket.broadcast.emit('side', data);
    });
  });

