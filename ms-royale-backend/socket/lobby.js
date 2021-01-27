const { Lobby, LobbyManager } = require('./lobbies');

const io = require('./connection');

const lobbies = io.of(/^\/lobby\/[a-fA-F0-9]+/);
lobbies.on('connection', socket => {

  let lobbyNsp = socket.nsp;
  if (!LobbyManager.has(lobbyNsp.name)) {
    LobbyManager.set(lobbyNsp.name, new Lobby(lobbyNsp.name));
  }

  let lobby = LobbyManager.get(lobbyNsp.name);
  lobby.addSocketId(socket.id);

  socket.emit('lobby-info', {
    seed: lobby.id,
    gameNumber: lobby.getGameNumber(socket.id),
    playersReady: lobby.playersReady
  });

  socket.on('action', data => {
    socket.broadcast.emit('action', data);
  });

  socket.on('ready', ready => lobbyNsp.emit('ready', ready));

});
