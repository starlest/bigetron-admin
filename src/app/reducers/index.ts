import { environment } from '../../environments/environment';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { compose } from '@ngrx/core/compose';
import { createSelector } from 'reselect';
import * as fromAuth from './auth.reducer';
import * as fromRouter from '@ngrx/router-store';
import * as fromUser from './user-reducer';

export interface State {
    auth: fromAuth.State;
    router: fromRouter.RouterState;
    user: fromUser.State;
}

const reducers = {
    auth: fromAuth.reducer,
    router: fromRouter.routerReducer,
    user: fromUser.reducer
};

const developmentReducer: ActionReducer<State> = compose(storeFreeze,
    combineReducers)(reducers);
const productionReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
    if (environment.production) {
        return productionReducer(state, action);
    }
    return developmentReducer(state, action);
}

/**
 * Auth Reducers
 */
export const getAuthState = (state: State) => state.auth;
export const getAuthLoaded = createSelector(getAuthState,
    fromAuth.getLoaded);
export const getAuth = createSelector(getAuthState,
    fromAuth.getEntity);

/**
 * Router Reducers
 */
export const getRouterPath = (state: State) => state.router.path;

/**
 * User Reducers
 */
export const getUserState = (state: State) => state.user;
export const getUser = createSelector(getUserState, fromUser.getEntity);
export const getUserLoaded = createSelector(getUserState, fromUser.getLoaded);
