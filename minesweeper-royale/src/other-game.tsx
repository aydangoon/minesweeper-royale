import React from 'react';
import { Colors, NumberColors } from './consts';
import { Game, Coord, SpaceStatus, GameStatus } from './minesweeper';

class OtherGame extends React.Component<any, any> {
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
      <div>
        <button>Attack</button>
        <canvas ref={this.canvasRef} width={width} height={height}
          style={{width: `${width}px`, height: `${height}px`}} />
        <div>
          {`Status: ${this.props.game.status} Flags Placed: ${this.props.game.flagsPlaced}/${this.props.game.settings.mines}`}
        </div>
      </div>
    );
  }
}

export default OtherGame;
