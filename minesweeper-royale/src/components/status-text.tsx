import { GameStatus } from '../minesweeper';

export function StatusText(status: GameStatus) {
  switch (status) {
    case GameStatus.Sweeping: return <div>Sweeping</div>
    case GameStatus.Exploded: return <div className="text-danger">Dead</div>
    case GameStatus.Solved: return <div className="text-success">Solved!</div>
  }
}
