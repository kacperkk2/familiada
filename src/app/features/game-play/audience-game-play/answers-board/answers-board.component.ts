import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Answer } from '../../../../core/models/game.model';
import { AnswerBoardComponent } from './answer-board/answer-board.component';
import { PointsPoolComponent } from './points-pool/points-pool.component';

@Component({
  selector: 'app-answers-board',
  standalone: true,
  imports: [CommonModule, AnswerBoardComponent, PointsPoolComponent],
  templateUrl: './answers-board.component.html',
  styleUrl: './answers-board.component.scss',
})
export class AnswersBoardComponent {
  @Input() answers!: Answer[];
  @Input() revealedAnswers!: string[];
  @Input() pool!: number;
}
