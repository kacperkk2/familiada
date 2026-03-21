import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameSessionState } from './session.state';

export const selectSessionState = createFeatureSelector<GameSessionState>('session');

export const selectRevealedQuestion = createSelector(selectSessionState, s => s.revealedQuestion);
export const selectRevealedAnswers = createSelector(selectSessionState, s => s.revealedAnswers);
export const selectCurrentRoundIndex = createSelector(selectSessionState, s => s.currentRoundIndex);
export const selectGameId = createSelector(selectSessionState, s => s.gameId);
export const selectTeamNames = createSelector(selectSessionState, s => s.teamNames);
export const selectPenaltyPoints = createSelector(selectSessionState, s => s.penaltyPoints);
export const selectTeamScores = createSelector(selectSessionState, s => s.teamScores);
export const selectRoundPool = createSelector(selectSessionState, s => s.roundPool ?? 0);
