import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'games', pathMatch: 'full' },
  {
    path: 'games',
    loadComponent: () =>
      import('./features/game-manager/game-manager/game-manager.component').then(m => m.GameManagerComponent),
  },
  {
    path: 'games/new',
    loadComponent: () =>
      import('./features/game-manager/game-create/game-create.component').then(m => m.GameCreateComponent),
  },
  {
    path: 'games/:id/edit',
    loadComponent: () =>
      import('./features/game-manager/game-create/game-create.component').then(m => m.GameCreateComponent),
  },
  {
    path: 'games/:id',
    loadComponent: () =>
      import('./features/game-manager/game-detail/game-detail.component').then(m => m.GameDetailComponent),
  },
  {
    path: 'admin/play/:id',
    loadComponent: () =>
      import('./features/game-play/admin-game-play/admin-game-play.component').then(m => m.AdminGamePlayComponent),
  },
  {
    path: 'play/:id',
    loadComponent: () =>
      import('./features/game-play/audience-game-play/audience-game-play.component').then(m => m.AudienceGamePlayComponent),
  },
  {
    path: 'import',
    loadComponent: () =>
      import('./features/game-manager/import-game/import-game.component').then(m => m.ImportGameComponent),
  },
  { path: '**', redirectTo: 'games' },
];
