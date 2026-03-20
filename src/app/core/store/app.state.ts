import { GameSessionState } from './session/session.state';
import { GamesState } from './games/games.reducer';

export interface AppState {
  session: GameSessionState;
  games: GamesState;
}
