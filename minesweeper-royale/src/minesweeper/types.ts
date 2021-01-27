export type Coord = [number, number];

export enum SpaceStatus {
  Open,
  Closed,
  Flagged
};

export interface Space {
  isMine: boolean;
  number: number;
  status: SpaceStatus;
};

export interface Settings {
  readonly rows: number;
  readonly cols: number;
  readonly mines: number;
};

export enum GameStatus {
  Sweeping,
  Solved,
  Exploded
};

export interface Action {
  readonly type: 'click' | 'flag';
  readonly coord: Coord;
}
