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

var Boards = [];
var prevjoin = null;
var pairs = 0;
server.listen(PORT);
var listener = io.listen(server);
listener.sockets.on('connection', function(socket)
  {
    socket.on('connected', function()
      {
        if (!prevjoin)
          prevjoin = socket;
        else
        {
          Sockets[socket.id] = {opp: prevjoin, board: pairs};
          Sockets[prevjoin.id] = {opp: socket, board: pairs};
          prevjoin = null;
        }
      });
    socket.on('redirected', function()
      {
        if (!prevjoin)
          prevjoin = socket;
        else
        {
          Sockets[socket.id] = {opp: prevjoin, board: pairs};
          Sockets[prevjoin.id] = {opp: socket, board: pairs};
          Boards[pairs] = null;
          pairs++;
          prevjoin = null;
        }
      });

    socket.on('chat message', function(data)
      {
        listener.emit('chat message', data);
      });
    socket.on('turn message', function(data)
      {
        socket.broadcast.to(Sockets[socket.id].opp.id).emit('chat message', data);
      });

    socket.on('side', function(data)
      {
        if (Sockets[socket.id])
        {
          socket.broadcast.to(Sockets[socket.id].opp.id).emit('side', data == 'light' ? 'dark' : 'light');
          socket.emit('side', data);
        }
      });

    socket.on('turn', function(board)
      {
        socket.broadcast.to(Sockets[socket.id].opp.id).emit('turn', board);
        socket.emit('turn', board);
        Boards[Sockets[socket.id].board] = board;
      });
    socket.on('init', function(board)
      {
        setTimeout(function()
        {
          if (Sockets[socket.id])
          {
            board.Side = 'Light';
            Boards[Sockets[socket.id].board] = board;
            socket.broadcast.to(Sockets[socket.id].opp.id).emit('sync', board);
          }
          else
            socket.broadcast.to(Sockets[socket.id].opp.id).emit('sync', null);
        }, 1000);
      });
    socket.on('sync', function()
      {
        if (Sockets[socket.id])
          socket.emit('sync', Boards[Sockets[socket.id].board]);
        else
          socket.emit('sync', null);
      });
    socket.on('win', function(data)
      {
        listener.sockets.connected[Sockets[socket.id].opp.id].emit('win', data);
        socket.emit('win', data);
      });
  });

