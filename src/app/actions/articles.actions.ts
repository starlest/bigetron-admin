import { Action } from '@ngrx/store';
import { type } from './util';
import { Article } from '../models';

export const ActionTypes = {
	LOAD: type('[Articles] Load'),
	LOAD_SUCCESS: type('[Articles] Load Success'),
	LOAD_FAIL: type('[Articles] Load Fail'),
	LOAD_SINGLE: type('[Articles] Load Single'),
	LOAD_SINGLE_SUCCESS: type('[Articles] Load Single Success'),
	LOAD_SINGLE_FAIL: type('[Articles] Load Single Fail'),
	ADD: type('[Articles] Add'),
	ADD_SUCCESS: type('[Articles] Add Success'),
	ADD_FAIL: type('[Articles] Add Fail'),
};

export class LoadAction implements Action {
	type = ActionTypes.LOAD;

	constructor(public payload: any) {
	}
}

export class LoadSuccessAction implements Action {
	type = ActionTypes.LOAD_SUCCESS;

	constructor(public payload: any) {
	}
}

export class LoadFailAction implements Action {
	type = ActionTypes.LOAD_FAIL;
}

export class LoadSingleAction implements Action {
	type = ActionTypes.LOAD_SINGLE;

	constructor(public payload: number) {
	}
}

export class LoadSingleSuccessAction implements Action {
	type = ActionTypes.LOAD_SINGLE_SUCCESS;

	constructor(public payload: Article) {
	}
}

export class LoadSingleFailAction implements Action {
	type = ActionTypes.LOAD_SINGLE_FAIL;
}

export class AddAction implements Action {
	type = ActionTypes.ADD;

	constructor(public payload: Article) {
	}
}

export class AddSuccessAction implements Action {
	type = ActionTypes.ADD_SUCCESS;

	constructor(public payload: Article) {
	}
}

export class AddFailAction implements Action {
	type = ActionTypes.ADD_FAIL;
}

export type Actions = LoadAction
  | LoadSuccessAction
  | LoadFailAction
  | LoadSingleAction
  | LoadSingleSuccessAction
  | LoadSingleFailAction
  | AddAction
  | AddSuccessAction
  | AddFailAction;
