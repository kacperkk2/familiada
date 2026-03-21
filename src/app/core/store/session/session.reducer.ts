import { createReducer, on } from '@ngrx/store';
import { GameSessionState, initialSessionState } from './session.state';
import {
  startRound, revealQuestion, hideQuestion, revealAnswer, hideAnswer,
  sessionStateReceived, setTeamName, addPenaltyPoint, removePenaltyPoint,
  awardPoolToTeam, setTeamScore,
} from './session.actions';

export const sessionReducer = createReducer(
  initialSessionState,
  on(startRound, (state, { gameId, roundIndex }) => ({
    ...initialSessionState,
    gameId,
    currentRoundIndex: roundIndex,
    teamNames: state.teamNames,
    teamScores: state.teamScores,
  })),
  on(revealQuestion, state => ({ ...state, revealedQuestion: true })),
  on(hideQuestion, state => ({ ...state, revealedQuestion: false })),
  on(revealAnswer, (state, { answerId, points }) => {
    if (state.revealedAnswers.includes(answerId)) return state;
    return {
      ...state,
      revealedAnswers: [...state.revealedAnswers, answerId],
      roundPool: state.roundPool + points,
    };
  }),
  on(hideAnswer, (state, { answerId, points }) => {
    if (!state.revealedAnswers.includes(answerId)) return state;
    return {
      ...state,
      revealedAnswers: state.revealedAnswers.filter(id => id !== answerId),
      roundPool: Math.max(0, state.roundPool - points),
    };
  }),
  on(sessionStateReceived, (_, { state }) => state),
  on(setTeamName, (state, { teamIndex, name }) => {
    const teamNames: [string, string] = [...state.teamNames] as [string, string];
    teamNames[teamIndex] = name;
    return { ...state, teamNames };
  }),
  on(addPenaltyPoint, (state, { teamIndex }) => {
    const penaltyPoints: [number, number] = [...state.penaltyPoints] as [number, number];
    penaltyPoints[teamIndex] = Math.min(3, penaltyPoints[teamIndex] + 1);
    return { ...state, penaltyPoints };
  }),
  on(removePenaltyPoint, (state, { teamIndex }) => {
    const penaltyPoints: [number, number] = [...state.penaltyPoints] as [number, number];
    penaltyPoints[teamIndex] = Math.max(0, penaltyPoints[teamIndex] - 1);
    return { ...state, penaltyPoints };
  }),
  on(awardPoolToTeam, (state, { teamIndex }) => {
    const teamScores: [number, number] = [...state.teamScores] as [number, number];
    teamScores[teamIndex] += state.roundPool;
    return { ...state, teamScores, roundPool: 0 };
  }),
  on(setTeamScore, (state, { teamIndex, score }) => {
    const teamScores: [number, number] = [...state.teamScores] as [number, number];
    teamScores[teamIndex] = Math.max(0, score);
    return { ...state, teamScores };
  }),
);
