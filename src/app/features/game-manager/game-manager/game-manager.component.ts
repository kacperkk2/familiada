import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAllGames } from '../../../core/store/games/games.selectors';
import { deleteGame } from '../../../core/store/games/games.actions';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-game-manager',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbComponent],
  templateUrl: './game-manager.component.html',
  styleUrl: './game-manager.component.scss',
})
export class GameManagerComponent {
  private store = inject(Store);
  private router = inject(Router);

  games$ = this.store.select(selectAllGames);

  navigateToNew(): void {
    this.router.navigate(['/games/new']);
  }

  deleteGame(gameId: string): void {
    this.store.dispatch(deleteGame({ gameId }));
  }
}
