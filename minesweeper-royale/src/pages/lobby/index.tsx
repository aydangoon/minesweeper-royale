import React from 'react';
import io from 'socket.io-client';
import { Game, Settings, Action, GameStatus } from '../../minesweeper';
import { MyGame, OtherGame } from '../../components';
import { LobbyStatus } from './types';
import { LobbyStatusBar } from './lobby-status-bar';
import { Connecting } from './connecting';
import { animals, adjectives } from './data.json';
const seedrandom = require('seedrandom');

export class Lobby extends React.Component<any, any> {
  games: Game[];
  names: string[];
  socket: any;

  constructor(props: Settings) {
    super(props);
    this.games = [];
    this.names = [];
    this.state = {
      connected: false,
      ready: false,
      playersReady: 0,
      gameNumber: 0,
      attackMines: 0,
      status: LobbyStatus.ReadyUp,
      countDownTimer: 3,
      winners: []
    };
  }

  componentDidMount() {
    this.socket = io('http://localhost:8000' + this.props.history.location.pathname);
    this.socket.on('lobby-info', ({ playersReady, seed, gameNumber }: { playersReady: boolean, seed: string, gameNumber: number }) => {
      seedrandom(seed, { global: true }); // Sets the global Math.random() to be pseudorandom with seed seed
      this.initNames();
      this.initGames(); // this is really bad and needs to go.
      this.setState({
        connected: true,
        playersReady: playersReady,
        gameNumber: gameNumber
      });
    });
    this.socket.on('action', ({ gameNumber, action }: {gameNumber: number, action: Action }) => {
      const game = this.games[gameNumber];
      game.do(action);
      if (game.status === GameStatus.Solved) {
        this.addWinner(gameNumber);
      }
      this.forceUpdate();
    });
    this.socket.on('ready', (ready: boolean) => {
      const updatedPlayersReady = this.state.playersReady + (ready ? 1 : -1);
      this.setState({ playersReady: updatedPlayersReady});
      if (updatedPlayersReady === 2) {
        this.startRound();
      }
    });
  }

  componendWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  getAttackMines(amount: number) {
    this.setState({ attackMines: this.state.attackMines + amount });
  }

  attackGame(gameNumber: number) {
    this.socket.emit('action', { gameNumber: gameNumber, action: { type: 'attack', coord: [] } });
    this.games[gameNumber].addAttackMine();
    this.setState({ attackMines: this.state.attackMines - 1 });
  }

  initGames() {
    const temp: Settings = { rows: 14, cols: 18, mines: 40 };
    const games = [];
    for (let i = 0; i < 10; i++) {
      games.push(new Game(temp));
    }
    this.games = games;
  }

  initNames() {
    const names = [];
    let name, raw;
    for (let i = 0; i < 10; i++) {
      do {
        raw = adjectives[Math.floor(Math.random() * adjectives.length)] + " " + animals[Math.floor(Math.random() * animals.length)];
        name = raw.split(" ").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
      } while (names.indexOf(name) !== -1);
      names.push(name);
    }
    this.names = names;
  }

  startRound() {
    this.initGames();
    this.setState({
      status: LobbyStatus.CountDown,
      ready: false,
      playersReady: 0,
      winners: [],
      attackMines: 0,
      countDownTimer: 3
    });
    setTimeout(this.countDown.bind(this), 1000);
  }

  countDown() {
    if (this.state.countDownTimer > 1) {
      this.setState({ countDownTimer: this.state.countDownTimer - 1 });
      setTimeout(this.countDown.bind(this), 1000);
    } else {
      this.setState({ status: LobbyStatus.InGame });
    }
  }

  addWinner(gameNumber: number) {
    const winners = [...this.state.winners];
    winners.push(this.names[gameNumber]);
    this.setState({
      winners: winners,
      status: winners.length === 2 ? LobbyStatus.ReadyUp : this.state.status
    });
  }

  render() {
    if (!this.state.connected) {
      return <Connecting />
    }
    return (
      <div className="container-fluid">
        <LobbyStatusBar {...this.state} readyClick={(e: MouseEvent) => {
          this.setState({ ready: !this.state.ready });
          this.socket.emit('ready', !this.state.ready);
        }} />
        <div className="row">
          <div className="col-sm-6 border">
            <MyGame
              inGame={this.state.status === LobbyStatus.InGame}
              game={this.games[this.state.gameNumber]}
              socket={this.socket}
              gameNumber={this.state.gameNumber}
              getAttackMines={this.getAttackMines.bind(this)}
              addWinner={this.addWinner.bind(this)}
              name={this.names[this.state.gameNumber]}
            />
            <h3>Attack Mines: {this.state.attackMines}</h3>
          </div>
          <div className="col-sm-6 border">
            <div className="d-flex flex-wrap justify-content-around align-items-center">
              {this.games.map((game, i) => {
                if (i === this.state.gameNumber) return <React.Fragment key={i}/>
                return (
                  <OtherGame key={i}
                    gameNumber={i}
                    game={this.games[i]}
                    attackable={this.state.attackMines > 0}
                    attack={() => this.attackGame(i)}
                    name={this.names[i]}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
