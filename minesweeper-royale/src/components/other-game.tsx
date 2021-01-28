import React from 'react';
import { Colors, NumberColors } from './consts';
import { Game, Coord, SpaceStatus, GameStatus } from '../minesweeper';

export class OtherGame extends React.Component<any, any> {
  canvasRef: any;
  static side = 10;

  constructor(props: any) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.draw();
  }
  componentDidUpdate() {
    this.draw();
  }

  draw(): void {
    const ctx = this.canvasRef.current.getContext('2d');
    const { rows, cols } = this.props.game.settings;
    const side = OtherGame.side;
    let dark;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const { status, number, isMine } = this.props.game.getSpace([r, c]);
        dark = (r + c) % 2;
        if (status === SpaceStatus.Open) {
          ctx.fillStyle = dark ? Colors.DarkGrey : Colors.LightGrey;
        } else {
          ctx.fillStyle = dark ? Colors.DarkGreen : Colors.LightGreen;
        }
        ctx.fillRect(side*c, side*r, side, side);

        if (status === SpaceStatus.Flagged) {
          ctx.fillStyle = '#f00';
          ctx.fillRect(side*(c + 0.25), side*(r + 0.25), side/2, side/2);
        } else if (status === SpaceStatus.Open && isMine) {
          ctx.fillStyle = '#f00';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('x', side*(c+0.5), side*(r+0.75));
        }
      }
    }

  }

  render() {
    const { rows, cols } = this.props.game.settings;
    const width = cols * OtherGame.side;
    const height = rows * OtherGame.side;
    return (
      <div className="p-2 m-2">
        <div>{this.props.name}</div>
        <canvas ref={this.canvasRef} width={width} height={height}
          style={{width: `${width}px`, height: `${height}px`}} />
        <div className="d-flex align-items-center">
          <button className="btn btn-danger mr-1" onClick={this.props.attack}
            disabled={!this.props.canAttack || this.props.game.status === GameStatus.Exploded}>Attack</button>
          <div>
            {StatusText(this.props.game.status)}
            <div>Flags Placed: {this.props.game.flagsPlaced}/{this.props.game.settings.mines}</div>
          </div>
        </div>
      </div>
    );
  }
}

function StatusText(status: GameStatus) {
  switch (status) {
    case GameStatus.Sweeping: return <div className="text-warning">Sweeping</div>
    case GameStatus.Exploded: return <div className="text-danger">Dead</div>
    case GameStatus.Solved: return <div className="text-success">Solved!</div>
  }
}
