import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Game } from '../../../core/models/game.model';
import { addGame } from '../../../core/store/games/games.actions';
import { GameCodecService } from '../../../core/services/game-codec.service';

@Component({
  selector: 'app-import-game',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './import-game.component.html',
  styleUrl: './import-game.component.scss',
})
export class ImportGameComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  private codec = inject(GameCodecService);

  isDecoding = true;
  previewGame: Game | null = null;
  decodeError = '';

  ngOnInit(): void {
    const data = this.route.snapshot.queryParamMap.get('data');
    if (!data) {
      this.decodeError = 'Brak parametru z danymi gry.';
      this.isDecoding = false;
      return;
    }
    this.codec.decode(data).then(game => {
      this.previewGame = game;
      this.isDecoding = false;
    }).catch((err: unknown) => {
      this.decodeError = err instanceof Error
        ? err.message
        : 'Wystąpił nieznany błąd podczas dekodowania.';
      this.isDecoding = false;
    });
  }

  importGame(): void {
    if (!this.previewGame) return;
    this.store.dispatch(addGame({ game: this.previewGame }));
    this.router.navigate(['/games', this.previewGame.id]);
  }

  reject(): void {
    this.router.navigate(['/games']);
  }
}
