import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-penalty-column',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './penalty-column.component.html',
  styleUrl: './penalty-column.component.scss',
})
export class PenaltyColumnComponent {
  @Input() count = 0;

  getPenaltyArray(): boolean[] {
    return [0, 1, 2].map(i => i < this.count);
  }
}
