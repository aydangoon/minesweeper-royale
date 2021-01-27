
class Lobby {

  // id: A unique string identified for this lobby.
  // gameMap: A map of socket ids to game numbers.
  // playersReady: a count of the number of players ready

  // PUBLIC INTERFACE ----------------------------------------------------------
  constructor(id) {
    this.id = id;
    this.gameMap = new Map();
    this.playersReady = 0;
    this.playerCount = 0;
  }

  addSocketId(sid) {
    this.gameMap.set(sid, this.playerCount);
    this.playerCount++;
  }

  getGameNumber(sid) {
    return this.gameMap.get(sid);
  }

  // PRIVATE METHODS -----------------------------------------------------------
}

module.exports = { Lobby };
