const io = require('./connection');
const crypto = require("crypto");
const { Lobby, LobbyManager } = require('./lobbies');

// This queue system is naive and does not scale. Improve this later for scaling.
const queue = []; // The queue of joining sockets.

const root = io.of('/'); // Namespace for www.domain.com/

root.on('connection', socket => {

  queue.push(socket.id); // Add joining sockets to the queue.

  if (queue.length === 2) { // When queue length hits lobby size.

    // Generate a unique lobby hash. This could produce collisions for significant
    // traffic so remove the slice() when solution needs to be scaled.
    let lobbyHash = crypto.createHash("sha256")
      .update(new Date().toISOString())
      .digest("hex")
      .slice(0, 6);

    LobbyManager.set(lobbyHash, new Lobby(lobbyHash)); // Add new lobby to LobbyManager.

    // Prompt the first LOBBY_SIZE sockets in queue to join the newly created lobby.
    queue.slice(0, 2).forEach(id => {
      root.to(id).emit('join-lobby', { id: lobbyHash });
    });

  }

  // When a socket joins emit a "status update" to all other sockets telling them
  // how the queue length has changed.
  root.emit('status-update', { found: queue.length > 2 ? 2 : queue.length });

  socket.on('disconnecting', () => {

    // Remove the disconnecting socket from the queue.
    queue.splice(queue.indexOf(socket.id), 1);
    // Emit a "status update" to all other sockets in the queue to inform them
    // the queue has shrunk.
    root.emit('status-update', { found: queue.length > 2 ? 2 : queue.length });

  });
});
