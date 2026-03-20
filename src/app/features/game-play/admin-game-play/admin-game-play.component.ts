import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { startRound, revealQuestion, revealAnswer } from '../../../core/store/session/session.actions';
import {
  selectRevealedQuestion,
  selectRevealedAnswers,
  selectCurrentRoundIndex,
} from '../../../core/store/session/session.selectors';

// Placeholder data — will come from game store once game loading is implemented
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
  selector: 'app-admin-game-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-game-play.component.html',
  styleUrl: './admin-game-play.component.scss',
})
export class AdminGamePlayComponent implements OnInit {
  gameId = '';
  rounds = DEMO_ROUNDS;

  revealedQuestion$!: Observable<boolean>;
  revealedAnswers$!: Observable<string[]>;
  currentRoundIndex$!: Observable<number>;
  currentRound$!: Observable<typeof DEMO_ROUNDS[number] | null>;

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id') ?? '';
    this.revealedQuestion$ = this.store.select(selectRevealedQuestion);
    this.revealedAnswers$ = this.store.select(selectRevealedAnswers);
    this.currentRoundIndex$ = this.store.select(selectCurrentRoundIndex);
    this.currentRound$ = this.currentRoundIndex$.pipe(
      map(index => this.rounds[index] ?? null)
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
