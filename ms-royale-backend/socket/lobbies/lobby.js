
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
    this.gameMap.set(sid, this.getSmallestFreeGameNumber());
    this.playerCount++;
  }

  removeSocketId(sid) {
    this.gameMap.delete(sid);
    this.playerCount--;
  }

  isEmpty() {
    return this.playerCount === 0
  }

  getGameNumber(sid) {
    return this.gameMap.get(sid);
  }

  // PRIVATE METHODS -----------------------------------------------------------

  getSmallestFreeGameNumber() {
    let values = [...this.gameMap.values()];
    return new Array(10)
      .fill(0)
      .map((elt, i) => i)
    	.findIndex(x => values.indexOf(x) === -1)
  }
}

module.exports = { Lobby };
