import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionBoardComponent } from './question-board/question-board.component';
import { AnswersBoardComponent } from './answers-board/answers-board.component';
import { TeamsSummaryComponent } from './teams-summary/teams-summary.component';
import { PenaltyColumnComponent } from './penalty-column/penalty-column.component';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { sessionStateReceived } from '../../../core/store/session/session.actions';
import {
  selectRevealedQuestion,
  selectRevealedAnswers,
  selectCurrentRoundIndex,
  selectGameId,
  selectTeamNames,
  selectPenaltyPoints,
  selectTeamScores,
  selectRoundPool,
} from '../../../core/store/session/session.selectors';
import { selectGameById } from '../../../core/store/games/games.selectors';
import { CrossTabSyncService } from '../../../core/services/cross-tab-sync.service';
import { Game, Round } from '../../../core/models/game.model';

@Component({
  selector: 'app-audience-game-play',
  standalone: true,
  imports: [CommonModule, QuestionBoardComponent, AnswersBoardComponent, TeamsSummaryComponent, PenaltyColumnComponent],
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
  teamNames$!: Observable<[string, string]>;
  penaltyPoints$!: Observable<[number, number]>;
  teamScores$!: Observable<[number, number]>;
  roundPool$!: Observable<number>;

  zoom = 1;

  increaseZoom(): void { this.zoom = Math.min(+(this.zoom + 0.1).toFixed(1), 3); }
  decreaseZoom(): void { this.zoom = Math.max(+(this.zoom - 0.1).toFixed(1), 0.1); }

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
    this.teamNames$ = this.store.select(selectTeamNames);
    this.penaltyPoints$ = this.store.select(selectPenaltyPoints);
    this.teamScores$ = this.store.select(selectTeamScores);
    this.roundPool$ = this.store.select(selectRoundPool).pipe(startWith(0));
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
