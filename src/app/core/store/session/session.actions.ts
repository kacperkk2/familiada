import { createAction, props } from '@ngrx/store';
import { GameSessionState } from './session.state';

export const startRound = createAction(
  '[Session] Start Round',
  props<{ gameId: string; roundIndex: number }>()
);

export const revealQuestion = createAction('[Session] Reveal Question');

export const revealAnswer = createAction(
  '[Session] Reveal Answer',
  props<{ answerId: string }>()
);

export const sessionStateReceived = createAction(
  '[Session] State Received From Other Window',
  props<{ state: GameSessionState }>()
);
