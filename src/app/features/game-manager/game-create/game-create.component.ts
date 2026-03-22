import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { addGame, updateGame } from '../../../core/store/games/games.actions';
import { selectGameById } from '../../../core/store/games/games.selectors';
import { Game, Round, Answer } from '../../../core/models/game.model';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-game-create',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, BreadcrumbComponent],
  templateUrl: './game-create.component.html',
  styleUrl: './game-create.component.scss',
})
export class GameCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  editId: string | null = null;
  editGameName: string | null = null;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    rounds: this.fb.array([this.createRound()]),
  });

  get rounds(): FormArray {
    return this.form.get('rounds') as FormArray;
  }

  getAnswers(roundIndex: number): FormArray {
    return this.rounds.at(roundIndex).get('answers') as FormArray;
  }

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.store.select(selectGameById(this.editId)).pipe(take(1)).subscribe(game => {
        if (game) {
          this._cachedGame = game;
          this.editGameName = game.name;
          this.fillForm(game);
        }
      });
    }
  }

  private fillForm(game: Game): void {
    this.form.setControl('name', this.fb.control(game.name, Validators.required));
    this.form.setControl('rounds', this.fb.array(
      game.rounds.map(round => this.fb.group({
        question: [round.question, Validators.required],
        answers: this.fb.array(
          round.answers.map(a => this.fb.group({
            text: [a.text, Validators.required],
            points: [a.points, [Validators.required, Validators.min(0)]],
          }))
        ),
      }))
    ));
  }

  private createRound(): FormGroup {
    return this.fb.group({
      question: ['', Validators.required],
      answers: this.fb.array([this.createAnswer()]),
    });
  }

  private createAnswer(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],
      points: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addRound(): void {
    this.rounds.push(this.createRound());
  }

  removeRound(index: number): void {
    if (this.rounds.length > 1) {
      this.rounds.removeAt(index);
    }
  }

  addAnswer(roundIndex: number): void {
    this.getAnswers(roundIndex).push(this.createAnswer());
  }

  removeAnswer(roundIndex: number, answerIndex: number): void {
    const answers = this.getAnswers(roundIndex);
    if (answers.length > 1) {
      answers.removeAt(answerIndex);
    }
  }

  onSave(): void {
    if (this.form.invalid) return;

    const value = this.form.value;
    const game: Game = {
      id: this.editId ?? crypto.randomUUID(),
      name: value.name,
      rounds: value.rounds.map((r: { question: string; answers: { text: string; points: number }[] }, ri: number) => ({
        id: this.editId
          ? (this.getCurrentRoundId(ri) ?? crypto.randomUUID())
          : crypto.randomUUID(),
        question: r.question,
        answers: r.answers.map((a: { text: string; points: number }, ai: number) => ({
          id: this.editId
            ? (this.getCurrentAnswerId(ri, ai) ?? crypto.randomUUID())
            : crypto.randomUUID(),
          text: a.text,
          points: Number(a.points),
        } satisfies Answer)),
      } satisfies Round)),
    };

    this.store.dispatch(this.editId ? updateGame({ game }) : addGame({ game }));
    this.router.navigate(['/games', game.id]);
  }

  private _cachedGame: Game | undefined;

  private getCurrentRoundId(ri: number): string | undefined {
    return this._cachedGame?.rounds[ri]?.id;
  }

  private getCurrentAnswerId(ri: number, ai: number): string | undefined {
    return this._cachedGame?.rounds[ri]?.answers[ai]?.id;
  }
}
