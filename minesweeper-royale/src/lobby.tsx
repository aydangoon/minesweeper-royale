import React from 'react';
import io from 'socket.io-client';
import { Game, Settings, Action } from './minesweeper';
import MyGame from './my-game';
import OtherGame from './other-game';
const seedrandom = require('seedrandom');

class Lobby extends React.Component<any, any> {
  games: Game[] | null;
  socket: any;

  constructor(props: Settings) {
    super(props);
    this.games = null;
    this.state = {
      ready: false,
      playersReady: 0,
      gameNumber: 0,
      attackMines: 0
    };
  }

  componentDidMount() {
    this.socket = io('http://localhost:8000' + this.props.history.location.pathname);
    this.socket.on('lobby-info', ({ playersReady, seed, gameNumber }: { playersReady: boolean, seed: string, gameNumber: number }) => {
      console.log('got lobby info message');
      seedrandom(seed, { global: true }); // Sets the global Math.random() to be pseudorandom with seed seed
      this.games = this.initGames();
      this.setState({
        playersReady: playersReady,
        gameNumber: gameNumber
      });
    });
    this.socket.on('action', ({ gameNumber, action }: {gameNumber: number, action: Action }) => {
      console.log('received action', gameNumber, action);
      (this.games as Game[])[gameNumber].do(action);
      this.forceUpdate();
    });
    this.socket.on('ready', (ready: boolean) => {
      this.setState({ playersReady: this.state.playersReady + (ready ? 1 : -1)})
    });
  }

  componendWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  initGames() {
    const temp: Settings = { rows: 14, cols: 18, mines: 40 };
    const games = [];
    for (let i = 0; i < 10; i++) {
      games.push(new Game(temp));
    }
    return games;
  }

  render() {
    if (!this.games) {
      return <div>Connecting<div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div></div>
    } else {
      return (
        <div>
          <div>
            {this.state.playersReady}/10 Ready
            <input type="checkbox" onChange={e => {
              this.setState({ready: e.target.checked});
              this.socket.emit('ready', e.target.checked);
            }}/><span>I'm Ready</span>
          </div>
          <MyGame game={this.games[this.state.gameNumber]} socket={this.socket} gameNumber={this.state.gameNumber} />
          <div className="d-flex">
            {this.games.map((game, i) => {
              if (i === this.state.gameNumber) {
                return <React.Fragment key={i}/>
              } else {
                return <OtherGame key={i} gameNumber={i}
                  game={(this.games as Game[])[i]} />
              }
            })}
          </div>
        </div>
      );
    }
  }
}

export default Lobby;
