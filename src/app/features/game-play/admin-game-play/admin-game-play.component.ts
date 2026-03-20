import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { startRound, revealQuestion, revealAnswer } from '../../../core/store/session/session.actions';
import {
  selectRevealedQuestion,
  selectRevealedAnswers,
  selectCurrentRoundIndex,
} from '../../../core/store/session/session.selectors';
import { selectGameById } from '../../../core/store/games/games.selectors';
import { Game, Round } from '../../../core/models/game.model';

@Component({
  selector: 'app-admin-game-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-game-play.component.html',
  styleUrl: './admin-game-play.component.scss',
})
export class AdminGamePlayComponent implements OnInit {
  gameId = '';

  game$!: Observable<Game | undefined>;
  revealedQuestion$!: Observable<boolean>;
  revealedAnswers$!: Observable<string[]>;
  currentRoundIndex$!: Observable<number>;
  currentRound$!: Observable<Round | null>;

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id') ?? '';
    this.game$ = this.store.select(selectGameById(this.gameId));
    this.revealedQuestion$ = this.store.select(selectRevealedQuestion);
    this.revealedAnswers$ = this.store.select(selectRevealedAnswers);
    this.currentRoundIndex$ = this.store.select(selectCurrentRoundIndex);
    this.currentRound$ = combineLatest([this.game$, this.currentRoundIndex$]).pipe(
      map(([game, index]) => game?.rounds[index] ?? null)
    );
  }

  onStartRound(index: number): void {
    this.store.dispatch(startRound({ gameId: this.gameId, roundIndex: index }));
  }

  onRevealQuestion(): void {
    this.store.dispatch(revealQuestion());
  }

  onRevealAnswer(answerId: string): void {
    this.store.dispatch(revealAnswer({ answerId }));
  }
}
