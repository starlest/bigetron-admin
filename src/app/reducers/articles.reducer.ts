import { createSelector } from 'reselect';
import {
	AddSuccessAction,
	LoadSingleSuccessAction, LoadSuccessAction
} from '../actions/articles.actions';
import { Article } from '../models';
import * as aa from '../actions/articles.actions';

export interface State {
	loaded: boolean;
	loading: boolean;
	ids: string[];
	entities: { [id: string]: Article };
	pageSize: number;
	pageIndex: number;
	totalCount: number;
}

const initialState: State = {
	loaded: false,
	loading: false,
	ids: [],
	entities: {},
	pageSize: 0,
	pageIndex: 0,
	totalCount: 0
};

export function reducer(state = initialState, action: aa.Actions): State {
	switch (action.type) {
		case aa.ActionTypes.LOAD:
		case aa.ActionTypes.LOAD_SINGLE: {
			return Object.assign({}, state, {
				loaded: false,
				loading: true,
				ids: [],
				entities: {},
				pageSize: 0,
				pageIndex: 0,
				totalCount: 0
			});
		}

		case aa.ActionTypes.LOAD_SINGLE_SUCCESS: {
			const loadSingleSuccessAction = action as LoadSingleSuccessAction;
			const article = loadSingleSuccessAction.payload;

			return Object.assign({}, state, {
				loaded: true,
				loading: false,
				ids: [article.Id],
				entities: { [article.Id]: article },
				pageSize: 1,
				pageIndex: 1,
				totalCount: 1
			});
		}

		case aa.ActionTypes.LOAD_SUCCESS: {
			const loadSuccessAction = action as LoadSuccessAction;
			const pageSize = loadSuccessAction.payload['PageSize'];
			const pageIndex = loadSuccessAction.payload['PageIndex'];
			const totalCount = loadSuccessAction.payload['TotalCount'];
			const articles = loadSuccessAction.payload['Source'];
			const articleIds = articles.map(article => String(article.Id));
			const articleEntities = articles.reduce(
			  (entities: { [id: string]: Article },
			   article: Article) => {
				  return Object.assign(entities, {
					  [article.Id]: article
				  });
			  }, {});

			return Object.assign({}, state, {
				loaded: true,
				loading: false,
				ids: articleIds,
				entities: articleEntities,
				pageSize: pageSize,
				pageIndex: pageIndex,
				totalCount: totalCount
			});
		}

		case aa.ActionTypes.LOAD_FAIL:
		case aa.ActionTypes.LOAD_SINGLE_FAIL:
			return Object.assign({}, state, {
				loaded: true,
				loading: false,
				ids: [],
				entities: {},
				pageSize: 0,
				pageIndex: 0,
				totalCount: 0
			});

		case aa.ActionTypes.ADD_SUCCESS:
			const addSuccessAction = action as AddSuccessAction;
			const article = addSuccessAction.payload;
			return Object.assign({}, state, {
				ids: [...state.ids, article.Id],
				entities: Object.assign({}, state.entities, {
					[article.Id]: article
				}),
				totalCount: state.totalCount + 1
			});

		default: {
			return state;
		}
	}
}

export const getLoaded = (state: State) => state.loaded;

export const getLoading = (state: State) => state.loading;

export const getIds = (state: State) => state.ids;

export const getEntities = (state: State) => state.entities;

export const getPageIndex = (state: State) => state.pageIndex;

export const getTotalCount = (state: State) => state.totalCount;

export const getArticles = createSelector(getEntities, getIds,
  (entities, ids) => ids.map(id => entities[id]));

export const getArticle = (Id: string) => createSelector(getEntities,
  entities => entities[Id]);
