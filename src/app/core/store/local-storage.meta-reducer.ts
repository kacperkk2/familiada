import { ActionReducer, MetaReducer } from '@ngrx/store';
import { AppState } from './app.state';
import { initialSessionState } from './session/session.state';

const STATE_KEY = 'familiada_state';

export function localStorageMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state, action) => {
    const nextState = reducer(state, action);
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(nextState));
    } catch {
      // localStorage unavailable (e.g. SSR or private mode quota exceeded)
    }
    return nextState;
  };
}

export function hydrateStateFromLocalStorage(): Partial<AppState> {
  try {
    const stored = localStorage.getItem(STATE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored) as Partial<AppState>;
    if (parsed.session) {
      parsed.session = { ...initialSessionState, ...parsed.session };
    }
    return parsed;
  } catch {
    return {};
  }
}

export const metaReducers: MetaReducer<AppState>[] = [localStorageMetaReducer];
