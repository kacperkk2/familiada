import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-points-pool',
  standalone: true,
  templateUrl: './points-pool.component.html',
  styleUrl: './points-pool.component.scss',
})
export class PointsPoolComponent {
  @Input() pool!: number;
}
