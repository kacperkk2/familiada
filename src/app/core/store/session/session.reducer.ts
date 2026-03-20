import { createReducer, on } from '@ngrx/store';
import { GameSessionState, initialSessionState } from './session.state';
import { startRound, revealQuestion, revealAnswer, sessionStateReceived } from './session.actions';

export const sessionReducer = createReducer(
  initialSessionState,
  on(startRound, (_, { gameId, roundIndex }) => ({
    ...initialSessionState,
    gameId,
    currentRoundIndex: roundIndex,
  })),
  on(revealQuestion, state => ({ ...state, revealedQuestion: true })),
  on(revealAnswer, (state, { answerId }) => ({
    ...state,
    revealedAnswers: state.revealedAnswers.includes(answerId)
      ? state.revealedAnswers
      : [...state.revealedAnswers, answerId],
  })),
  on(sessionStateReceived, (_, { state }) => state)
);
