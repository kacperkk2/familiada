import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-question-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-board.component.html',
  styleUrl: './question-board.component.scss',
})
export class QuestionBoardComponent {
  @Input() question!: string;
  @Input() revealed!: boolean;
}
