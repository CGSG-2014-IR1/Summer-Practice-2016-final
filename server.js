var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');

var Sockets = [];

var PORT = process.env.PORT || 8000;

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
      return;
    }
  });

var Board = null;
server.listen(PORT);
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
        if (Sockets.length >= 2)
        {
          if (socket === Sockets[0])
          {
            Sockets[0].emit('side', data == 'Light' ? 'Dark' : 'Light');
            Sockets[1].emit('side', data);
          }
          else
          {
            Sockets[0].emit('side', data);
            Sockets[1].emit('side', data == 'Light' ? 'Dark' : 'Light');
          }
        }
      });

    socket.on('turn', function(board)
      {
        socket.broadcast.emit('turn', board);
        Board = board;
      });
    socket.on('init', function(board)
      {
        Board = board;
        board.Side = 'Light';
        socket.broadcast.emit('sync', Board);
      });
    socket.on('sync', function()
      {
        socket.emit('sync', Board);
      });
    socket.on('win', function(data)
      {
        listener.emit('win', data);
        setTimeout(function(){ process.exit() }, 60 * 1000);
      });
  });

