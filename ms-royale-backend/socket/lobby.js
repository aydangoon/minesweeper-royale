const { Lobby, LobbyManager } = require('./lobbies');
const io = require('./connection');

const lobbies = io.of(/^\/lobby\/[a-fA-F0-9]+/);

lobbies.on('connection', socket => {

  let lobbyNsp = socket.nsp; // /lobby/<lobby hash>
  let lobbyHash = lobbyNsp.name.slice(7); // The lobby hash.

  if (LobbyManager.has(lobbyHash)) {

    // Add the socket id to the lobby if it exists.
    let lobby = LobbyManager.get(lobbyHash);
    lobby.addSocketId(socket.id);

    // Send the socket basic info about the lobby they have just joined.
    socket.emit('lobby-info', {
      seed: lobby.id,
      gameNumber: lobby.getGameNumber(socket.id),
      playersReady: lobby.playersReady
    });
  } else {
    socket.emit('no-lobby');
  }

  // Broadcast local actions to all other sockets in the lobby.
  socket.on('action', data => {
    socket.broadcast.emit('action', data);
  });

  // Broadcast a "ready up" message to all sockets, including yourself, in the
  // lobby.
  socket.on('ready', ready => lobbyNsp.emit('ready', ready));

  socket.on('disconnecting', () => {

    if (LobbyManager.has(lobbyHash)) {

      let lobby = LobbyManager.get(lobbyHash);
      lobby.removeSocketId(socket.id); // Remove the disconnecting socket from its lobby.

      // Remove the lobby from LobbyManager memory if the lobby is now empty.
      if (lobby.isEmpty()) {
        LobbyManager.delete(lobby.id);
      }
    }
  });

});
