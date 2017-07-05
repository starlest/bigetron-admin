import { environment } from '../../environments/environment';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { compose } from '@ngrx/core/compose';
import { createSelector } from 'reselect';
import * as fromArticles from './articles.reducer';
import * as fromAuth from './auth.reducer';
import * as fromRouter from '@ngrx/router-store';

export interface State {
    articles: fromArticles.State;
    auth: fromAuth.State;
    router: fromRouter.RouterState;
}

const reducers = {
    articles: fromArticles.reducer,
    auth: fromAuth.reducer,
    router: fromRouter.routerReducer
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
 * Articles Reducers
 */
export const getArticlesState = (state: State) => state.articles;
export const getArticlesLoaded = createSelector(getArticlesState,
    fromArticles.getLoaded);
export const getArticleEntities = createSelector(getArticlesState,
    fromArticles.getEntities);
export const getArticles = createSelector(getArticlesState,
    fromArticles.getArticles);
export const getArticle = (Id: string) => createSelector(getArticlesState,
    fromArticles.getArticle(Id));
export const getArticlesPageIndex = createSelector(getArticlesState,
    fromArticles.getPageIndex);
export const getArticlesTotalCount = createSelector(getArticlesState,
    fromArticles.getTotalCount);

/**
 * Auth Reducers
 */
export const getAuthState = (state: State) => state.auth;
export const getAuthLoading = createSelector(getAuthState,
    fromAuth.getLoading);
export const getAuthLoaded = createSelector(getAuthState,
    fromAuth.getLoaded);
export const getAuth = createSelector(getAuthState,
    fromAuth.getEntity);

/**
 * Router Reducers
 */
export const getRouterPath = (state: State) => state.router.path;
