import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom, map } from 'rxjs/operators';
import { CrossTabSyncService } from '../../services/cross-tab-sync.service';
import { revealAnswer, revealQuestion, hideAnswer, hideQuestion, startRound, sessionStateReceived, setTeamName, addPenaltyPoint, removePenaltyPoint, awardPoolToTeam, setTeamScore } from './session.actions';
import { selectSessionState } from './session.selectors';

@Injectable()
export class SessionEffects {
  syncToOtherWindows$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(revealAnswer, revealQuestion, hideAnswer, hideQuestion, startRound, setTeamName, addPenaltyPoint, removePenaltyPoint, awardPoolToTeam, setTeamScore),
        withLatestFrom(this.store.select(selectSessionState)),
        tap(([, state]) => this.crossTabSync.publishState(state))
      ),
    { dispatch: false }
  );

  syncFromOtherWindows$ = createEffect(() =>
    this.crossTabSync.stateChanges$().pipe(
      map(state => sessionStateReceived({ state }))
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private crossTabSync: CrossTabSyncService
  ) {}
}
