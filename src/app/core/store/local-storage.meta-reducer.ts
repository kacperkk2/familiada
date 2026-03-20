import { ActionReducer, MetaReducer } from '@ngrx/store';
import { AppState } from './app.state';

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
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export const metaReducers: MetaReducer<AppState>[] = [localStorageMetaReducer];
