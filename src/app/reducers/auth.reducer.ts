import * as aa from '../actions/auth.actions';
import { Auth } from '../models/auth';
import {
  LoadSuccessAction, RefreshSuccessAction
} from '../actions/auth.actions';


export interface State {
  entity: Auth;
  loaded: boolean;
  loading: boolean;
}

const initialState: State = {
  entity: null,
  loaded: false,
  loading: false,
};

export function reducer(state = initialState, action: aa.Actions): State {
  switch (action.type) {

    case aa.ActionTypes.LOAD_FROM_LOCAL_STORAGE:
    case aa.ActionTypes.LOAD_FROM_SERVER:
      return Object.assign({}, state, {
        entity: null,
        loaded: false,
        loading: true
      });

    case aa.ActionTypes.REFRESH_SUCCESS: {
      const refreshSuccessAction = action as RefreshSuccessAction;
      const auth = refreshSuccessAction.payload;
      return Object.assign({}, state, {
        entity: auth,
        loaded: true,
        loading: false
      });
    }

    case aa.ActionTypes.LOAD_SUCCESS: {
      const loadSuccessAction = action as LoadSuccessAction;
      const auth = loadSuccessAction.payload;
      return Object.assign({}, state, {
        entity: auth,
        loaded: true,
        loading: false
      });
    }


    case aa.ActionTypes.STARTUP_LOAD_FAIL:
    case aa.ActionTypes.LOAD_FAIL:
      return Object.assign({}, state, {
        loaded: true,
        loading: false
      });

    case aa.ActionTypes.REFRESH:
      return Object.assign({}, state, {
        loaded: false,
        loading: true
      });

    case aa.ActionTypes.REMOVE_FAIL:
    case aa.ActionTypes.REMOVE_SUCCESS:
      return Object.assign({}, state, initialState);

    default:
      return state;
  }
}

export const getEntity = (state: State) => state.entity;

export const getLoaded = (state: State) => state.loaded;

export const getLoading = (state: State) => state.loading;
