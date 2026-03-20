import { createAction, props } from '@ngrx/store';
import { GameSessionState } from './session.state';

export const startRound = createAction(
  '[Session] Start Round',
  props<{ gameId: string; roundIndex: number }>()
);

export const revealQuestion = createAction('[Session] Reveal Question');

export const revealAnswer = createAction(
  '[Session] Reveal Answer',
  props<{ answerId: string; points: number }>()
);

export const awardPoolToTeam = createAction(
  '[Session] Award Pool To Team',
  props<{ teamIndex: 0 | 1 }>()
);

export const setTeamScore = createAction(
  '[Session] Set Team Score',
  props<{ teamIndex: 0 | 1; score: number }>()
);

export const sessionStateReceived = createAction(
  '[Session] State Received From Other Window',
  props<{ state: GameSessionState }>()
);

export const setTeamName = createAction(
  '[Session] Set Team Name',
  props<{ teamIndex: 0 | 1; name: string }>()
);

export const addPenaltyPoint = createAction(
  '[Session] Add Penalty Point',
  props<{ teamIndex: 0 | 1 }>()
);

export const removePenaltyPoint = createAction(
  '[Session] Remove Penalty Point',
  props<{ teamIndex: 0 | 1 }>()
);
