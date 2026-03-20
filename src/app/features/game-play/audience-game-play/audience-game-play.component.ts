import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { sessionStateReceived } from '../../../core/store/session/session.actions';
import {
  selectRevealedQuestion,
  selectRevealedAnswers,
  selectCurrentRoundIndex,
  selectGameId,
} from '../../../core/store/session/session.selectors';
import { CrossTabSyncService } from '../../../core/services/cross-tab-sync.service';

// Must match admin data — will come from shared game store
const DEMO_ROUNDS = [
  {
    question: 'Wymień sport olimpijski',
    answers: [
      { id: 'a1', text: 'Piłka nożna', points: 40 },
      { id: 'a2', text: 'Pływanie', points: 30 },
      { id: 'a3', text: 'Lekkoatletyka', points: 20 },
      { id: 'a4', text: 'Tenis', points: 10 },
    ],
  },
  {
    question: 'Co zabrać na plażę?',
    answers: [
      { id: 'b1', text: 'Krem do opalania', points: 45 },
      { id: 'b2', text: 'Ręcznik', points: 35 },
      { id: 'b3', text: 'Okulary przeciwsłoneczne', points: 15 },
      { id: 'b4', text: 'Woda', points: 5 },
    ],
  },
];

@Component({
  selector: 'app-audience-game-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audience-game-play.component.html',
  styleUrl: './audience-game-play.component.scss',
})
export class AudienceGamePlayComponent implements OnInit {
  revealedQuestion$!: Observable<boolean>;
  revealedAnswers$!: Observable<string[]>;
  currentRoundIndex$!: Observable<number>;
  gameId$!: Observable<string>;
  currentRound$!: Observable<typeof DEMO_ROUNDS[number] | null>;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private crossTabSync: CrossTabSyncService
  ) {}

  ngOnInit(): void {
    this.revealedQuestion$ = this.store.select(selectRevealedQuestion);
    this.revealedAnswers$ = this.store.select(selectRevealedAnswers);
    this.currentRoundIndex$ = this.store.select(selectCurrentRoundIndex);
    this.gameId$ = this.store.select(selectGameId);
    this.currentRound$ = this.currentRoundIndex$.pipe(
      map(index => DEMO_ROUNDS[index] ?? null)
    );

    // Restore persisted session if store has no active game (fallback)
    this.store.select(selectGameId).subscribe(gameId => {
      if (!gameId) {
        const persisted = this.crossTabSync.loadPersistedState();
        if (persisted?.gameId) {
          this.store.dispatch(sessionStateReceived({ state: persisted }));
        }
      }
    }).unsubscribe();
  }
}
