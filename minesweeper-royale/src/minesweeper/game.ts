import { Settings, GameStatus, Space, Coord, SpaceStatus, Action } from './types';
import * as helpers from './helpers';

export class Game {
  public settings: Settings;
  private field: Space[][];
  public firstClick: boolean;
  public spacesLeft: number;
  public status: GameStatus;
  public mines: number;

  // PUBLIC INTERFACE ----------------------------------------------------------

  public constructor(settings: Settings) {
    this.settings = settings;
    this.spacesLeft = (settings.rows * settings.cols) - settings.mines;
    this.mines = settings.mines;
    this.firstClick = true;
    this.status = GameStatus.Sweeping;
    this.field = this.makeEmptyField();
  }

  // Takes an action and calls appropriate public interface methods. This is
  // mainly for conveniance.
  public do(action: Action): void {
    switch (action.type) {
      case 'click':
        this.click(action.coord);
        break;
      case 'flag':
        this.flag(action.coord);
        break;
      default:
        this.addAttackMine();
        break;
    }
  }

  // Click on a coordinate. Returns the number of spaces opened by the click.
  public click([r, c]: Coord): number {

    const space = this.field[r][c];

    if (space.status !==  SpaceStatus.Closed) {
      return 0;
    }

    let spacesOpened = 1;
    space.status = SpaceStatus.Open;


    if (this.firstClick) {
      this.initMines([r, c]);
      this.firstClick = false;
    }

    if (space.isMine) {
      this.status = GameStatus.Exploded;
    } else if (space.number === 0) {
      spacesOpened = this.clearZeroes([r, c]);
    }

    this.spacesLeft -= spacesOpened;
    if (this.spacesLeft === 0) {
      this.status = GameStatus.Solved;
    }

    return spacesOpened;

  }

  // Flag a coordinate. Returns nothing.
  public flag([r, c]: Coord): void {
    const space = this.field[r][c];

    if (space.status === SpaceStatus.Open) {
      return;
    }
    space.status = space.status === SpaceStatus.Flagged ? SpaceStatus.Closed : SpaceStatus.Flagged;
  }

  // Get the state of a space located at a given coordinate. Returns a cloned
  // Space object.
  public getSpace([r, c]: Coord): Space {
    return { ...this.field[r][c] };
  }

  // Adds a mine to a random closed space.
  public addAttackMine(): void {
    const choices: Coord[] = [];
    this.field.forEach((row, r) => {
      row.forEach((space, c) => {
        if (!space.isMine && space.status === SpaceStatus.Closed) {
          choices.push([r, c]);
        }
      });
    });
    const randomIndex = Math.floor(Math.random() * choices.length);
    const [r, c] = choices[randomIndex];
    const space = this.field[r][c];

    // set the selected space to a mine
    space.isMine = true;
    // decrease the total number of spaces left to open (since one is now a mine)
    this.spacesLeft--;
    this.mines++;
    // increase the number for all neighboring spaces
    helpers.getNeighborhoodCoords([r, c], this.settings).forEach(([nr, nc]) => {
      this.field[nr][nc].number++;
    });
    console.log('ADDED A MINE AT', r, c);
  }

  // PRIVATE METHODS -----------------------------------------------------------

  // Recursively opens spaces that adhere one of the following:
  // a) Have a number value of 0.
  // b) Are adjacent to a space with number value 0.
  // clearZeroes returns the number of spaces it has opened.
  private clearZeroes([r, c]: Coord): number {
    const space = this.field[r][c];
    let neighbor;
    let spacesOpened = 1;
    let children: Coord[] = [];
    if (space.number === 0) {
      helpers.getNeighborhoodCoords([r, c], this.settings)
        .filter(([nr, nc]) => {
          neighbor = this.field[nr][nc];
          return neighbor.status === SpaceStatus.Closed && !neighbor.isMine;
        })
        .forEach(coord => {
          this.field[coord[0]][coord[1]].status = SpaceStatus.Open;
          children.push(coord);
        });
      children.forEach(child => {
        spacesOpened += this.clearZeroes(child);
      });
    }
    return spacesOpened;
  }

  // constructor helpers -------------------------------------------------------

  // A helper method that returns an empty field of spaces.
  private makeEmptyField(): Space[][] {
    const { rows, cols } = this.settings;
    let field: Space[][] = [];
    for (let i = 0; i < rows; i++) {
      field.push([]);
      for (let j = 0; j < cols; j++) {
        field[i].push({ number: 0, isMine: false, status: SpaceStatus.Closed });
      }
    }
    return field;
  }

  // A helper method that randomly places the number of mines specified in
  // the settings object onto the games field. As it adds the mines it updates
  // the number value of adjacent spaces.
  private initMines(src: Coord): void {
    const { rows, cols, mines } = this.settings;
    for (let i = 0; i < mines; i++) {
      let r, c, distanceFromSrc;
      do {
        r = Math.floor(Math.random()*rows);
        c = Math.floor(Math.random()*cols);
        distanceFromSrc = Math.abs(src[0] - r) + Math.abs(src[1] - c);
      } while (this.field[r][c].isMine || distanceFromSrc <= 2);
      this.field[r][c].isMine = true;
      helpers.getNeighborhoodCoords([r, c], this.settings).forEach(([nr, nc]) => {
        this.field[nr][nc].number++;
      });
    }
  }
}
