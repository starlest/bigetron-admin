import { Action } from '@ngrx/store';
import { type } from './util';
import { Auth } from '../models';

export const ActionTypes = {
  LOAD_FROM_SERVER: type('[Auth] Load From Server'),
  LOAD_FROM_LOCAL_STORAGE: type('[Auth] Load From Local Storage'),
  LOAD_SUCCESS: type('[Auth] Load Success'),
  STARTUP_LOAD_FAIL: type('[Auth] Startup Load Fail'),
  LOAD_FAIL: type('[Auth] Load Fail'),
  SET: type('[Auth] Set'),
  REMOVE: type('[Auth] Remove'),
  REMOVE_SUCCESS: type('[Auth] Remove Success'),
  REMOVE_FAIL: type('[Auth] Remove Fail'),
  SCHEDULE_REFRESH: type('[Auth] Schedule Refresh'),
  SCHEDULE_REFRESH_SUCCESS: type('[Auth] Schedule Refresh Success'),
  REFRESH: type('[Auth] Refresh'),
  REFRESH_SUCCESS: type('[Auth] Refresh Success'),
  REFRESH_FAIL: type('[Auth] Refresh Fail')
};

export class LoadFromServerAction implements Action {
  type = ActionTypes.LOAD_FROM_SERVER;

  constructor(public payload: any) {
  }
}

export class LoadFromLocalStorageAction implements Action {
  type = ActionTypes.LOAD_FROM_LOCAL_STORAGE;
}

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload: Auth) {
  }
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;
}

export class StartupLoadFailAction implements Action {
  type = ActionTypes.STARTUP_LOAD_FAIL;
}

export class SetAction implements Action {
  type = ActionTypes.SET;

  constructor(public payload: any) {
  }
}

export class RemoveAction implements Action {
  type = ActionTypes.REMOVE;
}

export class RemoveSuccessAction implements Action {
  type = ActionTypes.REMOVE_SUCCESS;
}

export class RemoveFailAction implements Action {
  type = ActionTypes.REMOVE_FAIL;
}

export class ScheduleRefreshAction implements Action {
  type = ActionTypes.SCHEDULE_REFRESH;
}

export class ScheduleRefreshSuccessAction implements Action {
  type = ActionTypes.SCHEDULE_REFRESH_SUCCESS;
}

export class RefreshAction implements Action {
  type = ActionTypes.REFRESH;
}

export class RefreshSuccessAction implements Action {
  type = ActionTypes.REFRESH_SUCCESS;

  constructor(public payload: Auth) {
  }
}

export class RefreshFailAction implements Action {
  type = ActionTypes.REFRESH_FAIL;
}

export type Actions = LoadFromServerAction
  | LoadFromLocalStorageAction
  | LoadSuccessAction
  | LoadFailAction
  | StartupLoadFailAction
  | SetAction
  | RemoveAction
  | RemoveSuccessAction
  | RemoveFailAction
  | ScheduleRefreshAction
  | ScheduleRefreshSuccessAction
  | RefreshAction
  | RefreshSuccessAction
  | RefreshFailAction;

