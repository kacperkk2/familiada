import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { sessionStateReceived } from '../../../core/store/session/session.actions';
import {
  selectRevealedQuestion,
  selectRevealedAnswers,
  selectCurrentRoundIndex,
  selectGameId,
} from '../../../core/store/session/session.selectors';
import { selectGameById } from '../../../core/store/games/games.selectors';
import { CrossTabSyncService } from '../../../core/services/cross-tab-sync.service';
import { Game, Round } from '../../../core/models/game.model';

@Component({
  selector: 'app-audience-game-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audience-game-play.component.html',
  styleUrl: './audience-game-play.component.scss',
})
export class AudienceGamePlayComponent implements OnInit {
  game$!: Observable<Game | undefined>;
  revealedQuestion$!: Observable<boolean>;
  revealedAnswers$!: Observable<string[]>;
  currentRoundIndex$!: Observable<number>;
  gameId$!: Observable<string>;
  currentRound$!: Observable<Round | null>;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private crossTabSync: CrossTabSyncService
  ) {}

  ngOnInit(): void {
    const gameId = this.route.snapshot.paramMap.get('id') ?? '';
    this.game$ = this.store.select(selectGameById(gameId));
    this.revealedQuestion$ = this.store.select(selectRevealedQuestion);
    this.revealedAnswers$ = this.store.select(selectRevealedAnswers);
    this.currentRoundIndex$ = this.store.select(selectCurrentRoundIndex);
    this.gameId$ = this.store.select(selectGameId);
    this.currentRound$ = combineLatest([this.game$, this.currentRoundIndex$]).pipe(
      map(([game, index]) => game?.rounds[index] ?? null)
    );

    // Restore persisted session if store has no active game (fallback)
    this.store.select(selectGameId).subscribe(id => {
      if (!id) {
        const persisted = this.crossTabSync.loadPersistedState();
        if (persisted?.gameId) {
          this.store.dispatch(sessionStateReceived({ state: persisted }));
        }
      }
    }).unsubscribe();
  }
}
