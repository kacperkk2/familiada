import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Answer } from '../../../../../core/models';

@Component({
  selector: 'app-answer-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answer-board.component.html',
  styleUrl: './answer-board.component.scss',
})
export class AnswerBoardComponent {
  @Input() answer!: Answer;
  @Input() position!: number;
  @Input() revealed!: boolean;
}
