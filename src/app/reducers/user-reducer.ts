import { User } from '../models';
import * as ua from '../actions/user.actions';
import { LoadSuccessAction } from '../actions/user.actions';

export interface State {
    entity: User;
    loaded: boolean;
    loading: boolean;
}

const initialState: State = {
    entity: null,
    loaded: false,
    loading: false,
};

export function reducer(state = initialState, action: ua.Actions): State {
    switch (action.type) {
        case ua.ActionTypes.LOAD:
            return Object.assign({}, state, {
                entity: null,
                loaded: false,
                loading: true
            });

        case ua.ActionTypes.LOAD_SUCCESS:
            const loadSuccessAction = action as LoadSuccessAction;
            const user = loadSuccessAction.payload;
            return Object.assign({}, state, {
                entity: user,
                loaded: true,
                loading: false
            });

        case ua.ActionTypes.STARTUP_LOAD_FAIL:
        case ua.ActionTypes.LOAD_FAIL:
            return Object.assign({}, state, {
                loaded: true,
                loading: false
            });

        case ua.ActionTypes.REMOVE:
            return Object.assign({}, state, initialState);

        default:
            return state;
    }
}

export const getEntity = (state: State) => state.entity;

export const getLoaded = (state: State) => state.loaded;

export const getLoading = (state: State) => state.loading;

