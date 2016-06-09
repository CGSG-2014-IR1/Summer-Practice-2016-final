var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

var White = -1;
var Black = -1;
var Sockets = [];

function Error( Code, Response )
{
  switch (Code)
  {
  case 404:
    Response.writeHead(404);
    Response.write("This page doesn't exist - 404");
    Response.end();
    break;
  case 403:
    Response.writeHead(403);
    Response.write("You are not allowed to enter this page - 403");
    Response.end();
    break;
  }
};

var server = http.createServer(function(request, response)
  {
    var path = url.parse(request.url).pathname;

    switch (path)
    {
    case '/index.html':
      if (Sockets.length >= 2)
        path = '/spectator.html';
      fs.readFile(__dirname + path, function(error, data)
      {
        if (error)
          Error(404, response);
        else
        {
          response.writeHead(200, {"Content-Type": "text/html"});
          response.write(data, "utf8");
          response.end();
        }
      });
      break;
    default:
      fs.readFile(__dirname + path, function(error, data)
        {
          if (error)
            Error(404, response);
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
      if (socket === Sockets[0])
        Sockets[1].emit('side', data);
      else
        Sockets[0].emit('side', data);
    });
  });

