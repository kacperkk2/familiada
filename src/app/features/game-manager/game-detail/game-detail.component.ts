import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Game } from '../../../core/models/game.model';
import { selectGameById } from '../../../core/store/games/games.selectors';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './game-detail.component.html',
  styleUrl: './game-detail.component.scss',
})
export class GameDetailComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  game$!: Observable<Game | undefined>;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.game$ = this.store.select(selectGameById(id));
  }
}
