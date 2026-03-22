import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  startRound, revealQuestion, hideQuestion, revealAnswer, hideAnswer,
  setTeamName, addPenaltyPoint, removePenaltyPoint,
  awardPoolToTeam, setTeamScore,
} from '../../../core/store/session/session.actions';
import {
  selectRevealedQuestion,
  selectRevealedAnswers,
  selectCurrentRoundIndex,
  selectTeamNames,
  selectPenaltyPoints,
  selectTeamScores,
  selectRoundPool,
} from '../../../core/store/session/session.selectors';
import { selectGameById } from '../../../core/store/games/games.selectors';
import { Game, Round } from '../../../core/models/game.model';

@Component({
  selector: 'app-admin-game-play',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BreadcrumbComponent],
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
  teamNames$!: Observable<[string, string]>;
  penaltyPoints$!: Observable<[number, number]>;
  teamScores$!: Observable<[number, number]>;
  roundPool$!: Observable<number>;

  swapped = false;
  zoom = 1;
  soundEnabled = true;

  increaseZoom(): void { this.zoom = Math.min(+(this.zoom + 0.1).toFixed(1), 3); }
  decreaseZoom(): void { this.zoom = Math.max(+(this.zoom - 0.1).toFixed(1), 0.1); }

  toggleSound(): void {
    this.soundEnabled = !this.soundEnabled;
  }

  private playSound(path: string, gain = 1): void {
    if (this.soundEnabled) {
      const audio = new Audio(path);
      const ctx = new AudioContext();
      const source = ctx.createMediaElementSource(audio);
      const gainNode = ctx.createGain();
      gainNode.gain.value = gain;
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      audio.play();
    }
  }

  get displayedIndices(): [0 | 1, 0 | 1] {
    return this.swapped ? [1, 0] : [0, 1];
  }

  swapTeams(): void {
    this.swapped = !this.swapped;
  }

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
    this.teamNames$ = this.store.select(selectTeamNames);
    this.penaltyPoints$ = this.store.select(selectPenaltyPoints);
    this.teamScores$ = this.store.select(selectTeamScores);
    this.roundPool$ = this.store.select(selectRoundPool);
  }

  onPlayIntro(): void {
    this.playSound('assets/sounds/intro.mp3', 3.0);
  }

  onStartRound(index: number): void {
    this.playSound('assets/sounds/round.mp3', 0.4);
    this.store.dispatch(startRound({ gameId: this.gameId, roundIndex: index }));
  }

  onToggleQuestion(isRevealed: boolean): void {
    this.store.dispatch(isRevealed ? hideQuestion() : revealQuestion());
  }

  onToggleAnswer(answerId: string, points: number, isRevealed: boolean): void {
    if (!isRevealed) {
      this.playSound('assets/sounds/correct.mp3', 1.2);
    }
    this.store.dispatch(isRevealed ? hideAnswer({ answerId, points }) : revealAnswer({ answerId, points }));
  }

  onSetTeamName(teamIndex: 0 | 1, name: string): void {
    this.store.dispatch(setTeamName({ teamIndex, name }));
  }

  onAddPenalty(teamIndex: 0 | 1): void {
    this.playSound('assets/sounds/wrong.mp3');
    this.store.dispatch(addPenaltyPoint({ teamIndex }));
  }

  onRemovePenalty(teamIndex: 0 | 1): void {
    this.store.dispatch(removePenaltyPoint({ teamIndex }));
  }

  onAwardPool(teamIndex: 0 | 1): void {
    this.store.dispatch(awardPoolToTeam({ teamIndex }));
  }

  onSetTeamScore(teamIndex: 0 | 1, value: string): void {
    const score = parseInt(value, 10);
    if (!isNaN(score)) {
      this.store.dispatch(setTeamScore({ teamIndex, score }));
    }
  }
}
