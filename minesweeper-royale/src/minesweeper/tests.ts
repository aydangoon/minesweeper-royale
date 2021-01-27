import { Bot } from './bot';
import { Game } from './game';
import { GameStatus, Settings, Action } from './types';

export function botSuccessRate() {
  let bot, game, x, action: Action;
  let count = 0;
  let settings: Settings = { rows: 14, cols: 18, mines: 40 };
  for (let i = 0; i < 200; i++) {
    bot = new Bot();
    game = new Game(settings);
    x = 0;
    while (game.status === GameStatus.Sweeping && x < 1000) {
      action = bot.getNextAction(game);
      if (action.type === 'click') {
        game.click(action.coord);
      } else {
        game.flag(action.coord);
      }
      x++;
    }
    if (game.status === GameStatus.Exploded) {
      count++;
    }
  }
  console.log(count, 'out of', 200, 'failed');
}
