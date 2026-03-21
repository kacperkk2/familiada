import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-summary.component.html',
  styleUrl: './team-summary.component.scss',
})
export class TeamSummaryComponent {
  @Input() name = '';
  @Input() score = 0;
  @Input() align: 'left' | 'right' = 'left';
}
