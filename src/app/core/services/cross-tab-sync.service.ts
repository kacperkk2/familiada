import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { GameSessionState } from '../store/session/session.state';

@Injectable({ providedIn: 'root' })
export class CrossTabSyncService implements OnDestroy {
  private channel = new BroadcastChannel('familiada_game');
  private readonly STORAGE_KEY = 'familiada_session';

  publishState(state: GameSessionState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage unavailable
    }
    this.channel.postMessage(state);
  }

  stateChanges$(): Observable<GameSessionState> {
    return merge(
      fromEvent<MessageEvent>(this.channel, 'message').pipe(
        map(e => e.data as GameSessionState)
      ),
      fromEvent<StorageEvent>(window, 'storage').pipe(
        filter(e => e.key === this.STORAGE_KEY && e.newValue != null),
        map(e => JSON.parse(e.newValue!) as GameSessionState)
      )
    );
  }

  loadPersistedState(): GameSessionState | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as GameSessionState) : null;
    } catch {
      return null;
    }
  }

  ngOnDestroy(): void {
    this.channel.close();
  }
}
