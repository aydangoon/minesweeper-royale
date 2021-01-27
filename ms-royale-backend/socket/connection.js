const io = require('socket.io')({
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});
console.log('socket.io connection established');

module.exports = io;
