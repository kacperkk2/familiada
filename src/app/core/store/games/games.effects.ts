import { Injectable, OnDestroy } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { addGame, updateGame, deleteGame, gameReceivedFromSync, gameDeletedFromSync } from './games.actions';
import { Game } from '../../models/game.model';

type GameSyncMessage =
  | { type: 'upsert'; game: Game }
  | { type: 'delete'; gameId: string };

@Injectable()
export class GamesEffects implements OnDestroy {
  private channel = new BroadcastChannel('familiada_games');

  syncGameToOtherWindows$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addGame, updateGame),
        tap(({ game }) => {
          const msg: GameSyncMessage = { type: 'upsert', game };
          this.channel.postMessage(msg);
        })
      ),
    { dispatch: false }
  );

  syncGameDeleteToOtherWindows$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteGame),
        tap(({ gameId }) => {
          const msg: GameSyncMessage = { type: 'delete', gameId };
          this.channel.postMessage(msg);
        })
      ),
    { dispatch: false }
  );

  syncGamesFromOtherWindows$ = createEffect(() =>
    fromEvent<MessageEvent<GameSyncMessage>>(this.channel, 'message').pipe(
      map(e => {
        const msg = e.data;
        if (msg.type === 'upsert') return gameReceivedFromSync({ game: msg.game });
        return gameDeletedFromSync({ gameId: msg.gameId });
      })
    )
  );

  constructor(private actions$: Actions) {}

  ngOnDestroy(): void {
    this.channel.close();
  }
}
