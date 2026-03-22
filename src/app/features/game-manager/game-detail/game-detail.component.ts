import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Game } from '../../../core/models/game.model';
import { selectGameById } from '../../../core/store/games/games.selectors';
import { GameCodecService } from '../../../core/services/game-codec.service';
import { UrlShortenerService } from '../../../core/services/url-shortener.service';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbComponent],
  templateUrl: './game-detail.component.html',
  styleUrl: './game-detail.component.scss',
})
export class GameDetailComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private codec = inject(GameCodecService);
  private urlShortener = inject(UrlShortenerService);

  game$!: Observable<Game | undefined>;

  copiedState: 'idle' | 'copying' | 'copied' | 'error' = 'idle';
  private copiedTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.game$ = this.store.select(selectGameById(id));
  }

  async exportGame(game: Game): Promise<void> {
    this.copiedState = 'copying';
    try {
      const phrase = await this.codec.encode(game);
      const longUrl = `${location.origin}/familiada/import?data=${phrase}`;
      this.urlShortener.getShortUrl(longUrl).subscribe(res => {
        const toCopy = res?.shorturl ?? longUrl;
        navigator.clipboard.writeText(toCopy)
          .then(() => this.setFeedback('copied'))
          .catch(() => this.setFeedback('error'));
      });
    } catch {
      this.setFeedback('error');
    }
  }

  private setFeedback(state: 'copied' | 'error'): void {
    this.copiedState = state;
    if (this.copiedTimer) clearTimeout(this.copiedTimer);
    this.copiedTimer = setTimeout(() => {
      this.copiedState = 'idle';
      this.copiedTimer = null;
    }, 2000);
  }
}
