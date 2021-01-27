import { Settings, GameStatus, Space, Coord, SpaceStatus, Action } from './types';
import { Game } from './game';
import * as helpers from './helpers';

export class Bot {
  private actions: Action[];

  public constructor() {
    this.actions = [];
  }

  // PUBLIC INTERFACE ----------------------------------------------------------
  public getNextAction(game: Game): Action {
    if (this.actions.length === 0) {
        this.generateActions(game);
    }
    return this.actions.shift() as Action;
  }

  // PRIVATE METHODS -----------------------------------------------------------

  private generateActions(game: Game) {
    const { rows, cols } = game.settings;

    if (game.firstClick) {
      this.actions.push({
        type: 'click',
        coord: [Math.floor(Math.random()*rows), Math.floor(Math.random()*cols)]
      });
      return;
    }
    let odds: number[][] = [];
    for (let i = 0; i < rows; i++) {
      odds.push([]);
      for (let j = 0; j < cols; j++) {
        odds[i].push(-1);
      }
    }

    let r, c, space: Space, neighborhoodFlags, neighborhoodClosed, neighborhood, actionsToAdd: Action[];
    for (r = 0; r < rows; r++) {
      for (c = 0; c < cols; c++) {

        space = game.getSpace([r, c]);
        if (space.status !== SpaceStatus.Open || space.number === 0) continue;

        actionsToAdd = [];
        neighborhood = helpers.getNeighborhoodCoords([r, c], game.settings)
          .map(coord => { return { space: game.getSpace(coord), coord: coord }; });

        neighborhoodFlags = neighborhood.reduce((acc, neighbor) => acc + (neighbor.space.status === SpaceStatus.Flagged ? 1 : 0), 0);
        neighborhoodClosed = neighborhood.reduce((acc, neighbor) => acc + (neighbor.space.status === SpaceStatus.Closed ? 1 : 0), 0);

        if (neighborhoodFlags === space.number) {
          neighborhood.filter(neighbor => neighbor.space.status === SpaceStatus.Closed)
            .forEach(({ coord }) => {
              actionsToAdd.push({ type: 'click', coord: coord });
            });
        } else if (neighborhoodClosed + neighborhoodFlags === space.number) {
          neighborhood.filter(neighbor => neighbor.space.status === SpaceStatus.Closed)
            .forEach(({ coord }) => {
              actionsToAdd.push({ type: 'flag', coord: coord });
            });
        } else {
          neighborhood.filter(neighbor => neighbor.space.status === SpaceStatus.Closed)
            .forEach(({ coord }) => {
              odds[coord[0]][coord[1]] += space.number;
            });
        }

        if (actionsToAdd.length > 0) {
          this.actions = this.actions.concat(actionsToAdd);
          return;
        }

      }
    }

    let bestGuess: Coord = [0, 0];
    let bestGuessProb = 65;
    for (r = 0; r < odds.length; r++) {
      for (c = 0; c < odds[r].length; c++) {
        if (game.getSpace([r, c]).status === SpaceStatus.Closed && odds[r][c] < bestGuessProb && odds[r][c] !== -1) {
          bestGuess = [r, c];
          bestGuessProb = odds[r][c];
        }
      }
    }
    this.actions.push({ type: 'click', coord: bestGuess });

  }

}
