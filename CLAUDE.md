# Familiada — CLAUDE.md

Polska gra telewizyjna jako aplikacja webowa: panel admina + widok widza, synchronizowane w czasie rzeczywistym.

## Stack

- **Angular 19** (standalone components, lazy routes)
- **NgRx 19** (Store, Effects, Entity, Devtools)
- **Angular Material 19**
- **RxJS 7.8** / **TypeScript 5.6**

## Uruchamianie

```bash
npm start    # dev server na localhost:4200
npm run build
```
## GitHub Pages deployment
Before every commit create files for GitHub Pages, run these commands in order:

ng build --output-path docs --base-href /familiada/
cp -r docs/browser/* docs/
rm -rf docs/browser
cp docs/index.html docs/404.html

Then include the updated docs/ in the commit.

## Routing

| Ścieżka | Komponent | Opis |
|---|---|---|
| `/games` | `GameManagerComponent` | lista gier |
| `/games/new` | `GameCreateComponent` | tworzenie gry |
| `/games/:id/edit` | `GameCreateComponent` | edycja gry (ten sam komponent) |
| `/games/:id` | `GameDetailComponent` | szczegóły gry, linki do play |
| `/admin/play/:id` | `AdminGamePlayComponent` | panel prowadzącego |
| `/play/:id` | `AudienceGamePlayComponent` | widok dla widzów (TV) |

## Struktura katalogów

```
src/
├── styles/
│   ├── _variables.scss       # CSS custom properties (:root)
│   └── _common.scss          # globalne klasy: .page-panel, .section-card, .answer-row, .btn-*
├── styles.scss               # Material theme + importy partiali
└── app/
    ├── app.routes.ts
    ├── app.config.ts         # provideStore, provideEffects, metaReducers
    ├── core/
    │   ├── models/game.model.ts     # Game, Round, Answer
    │   ├── services/cross-tab-sync.service.ts
    │   └── store/
    │       ├── app.state.ts / app.reducer.ts
    │       ├── local-storage.meta-reducer.ts
    │       ├── session/      # actions, reducer, selectors, effects
    │       └── games/        # NgRx Entity CRUD
    └── features/
        ├── game-manager/
        │   ├── game-manager/   # lista gier
        │   ├── game-detail/    # szczegóły gry
        │   └── game-create/    # formularz tworzenia/edycji
        └── game-play/
            ├── admin-game-play/
            └── audience-game-play/
```

## Modele danych

```typescript
interface Answer { id: string; text: string; points: number; }
interface Round  { id: string; question: string; answers: Answer[]; }
interface Game   { id: string; name: string; rounds: Round[]; }

interface GameSessionState {
  gameId: string;
  currentRoundIndex: number;
  revealedQuestion: boolean;
  revealedAnswers: string[];         // id ujawnionych odpowiedzi
  teamNames: [string, string];
  penaltyPoints: [number, number];   // 0–3 na drużynę
  teamScores: [number, number];
  roundPool: number;                 // suma punktów z tej rundy
}
```

## NgRx — akcje

### Session

| Akcja | Props |
|---|---|
| `startRound` | `gameId, roundIndex` |
| `revealQuestion` | — |
| `revealAnswer` | `answerId, points` |
| `awardPoolToTeam` | `teamIndex: 0 \| 1` |
| `setTeamScore` | `teamIndex, score` |
| `setTeamName` | `teamIndex, name` |
| `addPenaltyPoint` | `teamIndex` |
| `removePenaltyPoint` | `teamIndex` |
| `sessionStateReceived` | `state: GameSessionState` |

### Games (NgRx Entity)

`addGame`, `updateGame`, `deleteGame`, `gameReceivedFromSync`, `gameDeletedFromSync`

## Synchronizacja okien

`CrossTabSyncService` używa dwóch kanałów:
- **BroadcastChannel** `familiada_game` — real-time sesja gry
- **BroadcastChannel** `familiada_games` — sync definicji gier
- **localStorage** `familiada_session` — persystencja sesji

`localStorageMetaReducer` persystuje cały `AppState` pod kluczem `familiada_state`.

## Style — konwencje

- CSS custom properties z `_variables.scss` dostępne **globalnie** (`var(--color-accent)` bez importu)
- Wspólne klasy z `_common.scss` dostępne globalnie
- Style lokalne tylko w `.scss` komponentu — **nigdy** `styles: [...]` w dekoratorze

### Tokeny

| Token | Wartość |
|---|---|
| `--color-bg` | `#0a0a3e` |
| `--color-surface` | `#1a237e` |
| `--color-surface-alt` | `#0d0d6e` |
| `--color-accent` | `#ffd600` |
| `--color-success` | `#388e3c` |
| `--color-danger` | `#c62828` |
| `--color-text` | `#ffffff` |
| `--color-text-muted` | `#aaaaaa` |
| `--border-radius` | `8px` |
| `--spacing-sm/md/lg` | `8/16/24px` |

### Klasy globalne

| Klasa | Opis |
|---|---|
| `.page-panel` | kontener, max-width 760px, centered |
| `.section-card` | karta z tłem i paddingiem |
| `.answer-row` | wiersz odpowiedzi (flex) |
| `.btn-primary` | żółte obramowanie, CTA |
| `.btn-reveal` | zielony przycisk ujawnienia |
| `.btn-danger` | czerwony przycisk usunięcia |
| `.btn-small` | mały pomocniczy przycisk |

## AdminGamePlayComponent — specyfika

- `swapped: boolean` — wizualna zamiana drużyn (zmienia `displayedIndices`)
- Dispatche: wszystkie akcje sesji
- Selektory: `game$`, `currentRound$`, `revealedQuestion$`, `revealedAnswers$`, `teamNames$`, `penaltyPoints$`, `teamScores$`, `roundPool$`

## AudienceGamePlayComponent — specyfika

- Tylko odczyt (zero dispatchów)
- Pytanie ukryte do `revealedQuestion === true`
- Nieodsłonięte odpowiedzi wyświetlane jako `▬▬▬▬▬▬`
- `getPenaltyArray(count)` — helper do renderowania znaków X
- Fallback hydration z localStorage gdy store nie ma aktywnej sesji
