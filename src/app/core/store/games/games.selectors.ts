import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GamesState, gamesAdapter } from './games.reducer';

export const selectGamesState = createFeatureSelector<GamesState>('games');

const { selectAll } = gamesAdapter.getSelectors();

export const selectAllGames = createSelector(selectGamesState, selectAll);

export const selectGameById = (id: string) =>
  createSelector(selectGamesState, state => state.entities[id]);
