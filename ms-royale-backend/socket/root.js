const io = require('./connection');
const crypto = require("crypto");


const queue = [];
const root = io.of('/');
root.on('connection', socket => {

  queue.push(socket.id);
  if (queue.length === 2) {
    let lobbyHash = crypto.createHash("sha256")
      .update(new Date().toISOString())
      .digest("hex");
    queue.slice(0, 2).forEach(id => {
      root.to(id).emit('join-lobby', { id: lobbyHash });
    });
  }
  root.emit('status-update', { found: queue.length > 2 ? 2 : queue.length });
  console.log(queue);

  socket.on('disconnecting', () => {
    queue.splice(queue.indexOf(socket.id), 1);
    root.emit('status-update', { found: queue.length > 2 ? 2 : queue.length });
    console.log(queue);
  });
});
