import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamSummaryComponent } from './team-summary/team-summary.component';

@Component({
  selector: 'app-teams-summary',
  standalone: true,
  imports: [CommonModule, TeamSummaryComponent],
  templateUrl: './teams-summary.component.html',
  styleUrl: './teams-summary.component.scss',
})
export class TeamsSummaryComponent {
  @Input() names: [string, string] = ['', ''];
  @Input() scores: [number, number] = [0, 0];
}
