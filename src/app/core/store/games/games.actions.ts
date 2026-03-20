import { createAction, props } from '@ngrx/store';
import { Game } from '../../models/game.model';

export const addGame = createAction('[Games] Add Game', props<{ game: Game }>());
export const updateGame = createAction('[Games] Update Game', props<{ game: Game }>());
export const deleteGame = createAction('[Games] Delete Game', props<{ gameId: string }>());
export const gameReceivedFromSync = createAction('[Games] Game Received From Sync', props<{ game: Game }>());
export const gameDeletedFromSync = createAction('[Games] Game Deleted From Sync', props<{ gameId: string }>());
