import React from 'react';
import { Colors, NumberColors } from './consts';
import { Game, Coord, SpaceStatus, GameStatus, Action} from './minesweeper';

class MyGame extends React.Component<any, any> {
  canvasRef: any;
  static side = 30;

  constructor(props: any) {
    super(props);
    this.state = {
      selectedSpace: null
    };
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.draw();
  }
  componentDidUpdate() {
    this.draw();
  }

  clickToCoords(x: number, y: number): Coord {
    const ctx = this.canvasRef.current.getContext('2d');
    return [Math.floor(y / MyGame.side), Math.floor(x / MyGame.side)];
  }

  getClickData(e: any): [Coord, number] {
    e.preventDefault();
    const rect = this.canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    return [this.clickToCoords(x, y), e.button];
  }

  handleClick([coord, mouseButton]: [Coord, number]): void {
    if (mouseButton === 0) { // click
      this.props.game.click(coord);
      this.props.socket.emit('action', { gameNumber: this.props.gameNumber, action: { type: 'click', coord: coord }});
    } else if (mouseButton === 2) { // flag
      this.props.game.flag(coord);
      this.props.socket.emit('action', { gameNumber: this.props.gameNumber, action: { type: 'flag', coord: coord }});
    }
    this.forceUpdate();
    this.draw();
  }

  handleHover(coord: Coord): void {
    this.setState({ selectedSpace: coord });
  }

  draw(): void {
    const ctx = this.canvasRef.current.getContext('2d');
    const { rows, cols } = this.props.game.settings;
    const side = MyGame.side;
    const selectedSpace = this.state.selectedSpace;
    let dark;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const { status, number, isMine } = this.props.game.getSpace([r, c]);
        dark = (r + c) % 2;
        if (status === SpaceStatus.Open) {
          ctx.fillStyle = dark ? Colors.DarkGrey : Colors.LightGrey;
        } else {
          ctx.fillStyle = dark ? Colors.DarkGreen : Colors.LightGreen;
          if (selectedSpace && selectedSpace[0] === r && selectedSpace[1] === c) {
            ctx.fillStyle = Colors.LightestGreen;
          }
        }
        ctx.fillRect(side*c, side*r, side, side);

        if (status === SpaceStatus.Flagged) {
          ctx.fillStyle = '#f00';
          ctx.fillRect(side*(c + 0.25), side*(r + 0.25), side/2, side/2);
        } else if (status === SpaceStatus.Open && (isMine || number > 0)) {
          ctx.fillStyle = isMine ? '#f00' : NumberColors[number];
          ctx.font = `${2 * MyGame.side / 3}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText(isMine ? 'x' : number, side*(c+0.5), side*(r+0.75));
        }
      }
    }

  }

  render() {
    const { rows, cols } = this.props.game.settings;
    const width = cols * MyGame.side;
    const height = rows * MyGame.side;
    return (
      <div>
        <canvas ref={this.canvasRef} width={width} height={height}
          style={{width: `${width}px`, height: `${height}px`}}
          onClick={e => this.handleClick(this.getClickData(e))} onContextMenu={e => {
            e.preventDefault();
            this.handleClick(this.getClickData(e))
          }}
          onMouseMove={e => this.handleHover(this.getClickData(e)[0])}
          />
        <h3>
          {`Status: ${this.props.game.status} Flags Placed: ${this.props.game.flagsPlaced}/${this.props.game.settings.mines}`}
        </h3>
      </div>
    );
  }
}

export default MyGame;
