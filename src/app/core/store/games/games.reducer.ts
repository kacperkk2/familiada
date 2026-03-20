import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Game } from '../../models/game.model';
import { addGame, updateGame, deleteGame, gameReceivedFromSync, gameDeletedFromSync } from './games.actions';

export type GamesState = EntityState<Game>;

export const gamesAdapter = createEntityAdapter<Game>();

const initialState: GamesState = gamesAdapter.getInitialState();

export const gamesReducer = createReducer(
  initialState,
  on(addGame, (state, { game }) => gamesAdapter.upsertOne(game, state)),
  on(updateGame, (state, { game }) => gamesAdapter.upsertOne(game, state)),
  on(deleteGame, (state, { gameId }) => gamesAdapter.removeOne(gameId, state)),
  on(gameReceivedFromSync, (state, { game }) => gamesAdapter.upsertOne(game, state)),
  on(gameDeletedFromSync, (state, { gameId }) => gamesAdapter.removeOne(gameId, state))
);
