# Familiada — CLAUDE.md

Projekt: polska gra telewizyjna "Familiada" jako aplikacja webowa z widokiem admina i widokiem dla widzów, synchronizowanymi w czasie rzeczywistym między oknami przeglądarki.

## Stack

- **Angular 19** (standalone components, signals gotowe do użycia)
- **NgRx** (Store, Effects, Entity, Devtools) — wersja 19
- **Angular Material 19** — UI components
- **RxJS 7.8**
- **SCSS** z partialami w `src/styles/`

## Uruchamianie

```bash
npm start          # dev server na localhost:4200
npm run build      # production build
npx ng build --configuration=development  # dev build
```

## Architektura

### Routing

| Ścieżka | Komponent | Opis |
|---|---|---|
| `/games` | `GameManagerComponent` | lista gier |
| `/games/:id` | `GameDetailComponent` | szczegóły / edycja gry |
| `/admin/play/:id` | `AdminGamePlayComponent` | panel prowadzącego |
| `/play/:id` | `AudienceGamePlayComponent` | widok dla widzów (TV) |

### Struktura katalogów

```
src/
├── styles/
│   ├── _variables.scss   # kolory, CSS custom properties (:root)
│   └── _common.scss      # wspólne klasy: .page-panel, .section-card, .answer-row, .btn-*
├── styles.scss           # Material theme + importy partiali
└── app/
    ├── core/
    │   ├── models/       # Game, Round, Answer
    │   ├── services/     # CrossTabSyncService
    │   └── store/
    │       ├── app.state.ts / app.reducer.ts
    │       ├── local-storage.meta-reducer.ts
    │       └── session/  # actions, reducer, selectors, effects
    └── features/
        ├── game-manager/
        │   ├── game-manager/   # lista gier
        │   └── game-detail/    # edycja gry
        └── game-play/
            ├── admin-game-play/    # panel admina
            └── audience-game-play/ # widok widza
```

Każdy komponent ma własny podfolder z plikami `.ts`, `.html`, `.scss`.

### Synchronizacja okien (cross-tab)

`CrossTabSyncService` łączy dwa mechanizmy:
- **BroadcastChannel** (`familiada_game`) — real-time do wszystkich okien tej samej domeny
- **localStorage** (`familiada_session`) — persystencja stanu sesji

`SessionEffects` obsługuje obie strony:
- `syncToOtherWindows$` — po akcjach admina (revealAnswer, revealQuestion, startRound) publikuje stan
- `syncFromOtherWindows$` — odbiera stan z innych okien i dispatchu `sessionStateReceived`

Stały meta-reducer (`localStorageMetaReducer`) persystuje cały `AppState` pod kluczem `familiada_state`.

### NgRx — stan sesji (`session`)

```typescript
interface GameSessionState {
  gameId: string;
  currentRoundIndex: number;
  revealedQuestion: boolean;
  revealedAnswers: string[];  // id ujawnionych odpowiedzi
}
```

Akcje: `startRound`, `revealQuestion`, `revealAnswer`, `sessionStateReceived`

## Style — konwencje

- CSS custom properties z `_variables.scss` są dostępne globalnie — używać `var(--color-accent)` itd. **bez importu** w plikach komponentów
- Wspólne klasy layoutu (`.page-panel`, `.section-card`, `.answer-row`) definiowane w `_common.scss`, dostępne globalnie
- Lokalne style komponentu tylko w jego własnym `.scss`
- Nigdy `inline styles` ani `styles: [...]` w dekoratorze — zawsze osobny plik `.scss`

### Dostępne tokeny

| Token | Wartość | Zastosowanie |
|---|---|---|
| `--color-bg` | `#0a0a3e` | tło strony (widok widza) |
| `--color-surface` | `#1a237e` | karty, nagłówki |
| `--color-surface-alt` | `#0d0d6e` | wiersze odpowiedzi |
| `--color-accent` | `#ffd600` | żółty kolor przewodni |
| `--color-success` | `#388e3c` | ujawnione odpowiedzi |
| `--color-text-muted` | `#aaaaaa` | podpisy, opisy |

## Modele danych

```typescript
// Definicja gry (stała, edytowana przez admina przed grą)
interface Game { id, name, rounds: Round[] }
interface Round { id, question, answers: Answer[] }
interface Answer { id, text, points }

// Stan rozgrywki (dynamiczny, synchronizowany między oknami)
interface GameSessionState { gameId, currentRoundIndex, revealedQuestion, revealedAnswers }
```

## Co jest jeszcze do zrobienia

- Załadowanie danych gry ze store do komponentów (teraz są DEMO_ROUNDS hardcoded w admin i audience)
- Feature store dla gier (`games/` w NgRx Entity) — CRUD gier
- Widok `GameManagerComponent` i `GameDetailComponent` — lista i edycja gier
- Punktacja, licznik błędów
- Animacje ujawniania odpowiedzi
