import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { sessionReducer } from './session/session.reducer';

export const appReducers: ActionReducerMap<AppState> = {
  session: sessionReducer,
};
