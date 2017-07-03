import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AuthService } from '../services/auth.service';
import { Action, Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { of } from 'rxjs/observable/of';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import * as aa from '../actions/auth.actions';
import * as fromRoot from '../reducers';

@Injectable()
export class AuthEffects {
    refreshSubscription: Subscription;

    constructor(private store: Store<fromRoot.State>,
                private actions$: Actions,
                private authService: AuthService) {
    }

    @Effect()
    loadAuthFromLocalStorage$: Observable<Action> = this.actions$
        .ofType(aa.ActionTypes.LOAD_FROM_LOCAL_STORAGE)
        .startWith(new aa.LoadFromLocalStorageAction())
        .map(() => {
            const authEntity = this.authService.getAuthFromLocalStorage();
            if (!authEntity) {
                return new aa.StartupLoadFailAction();
            }
            return new aa.LoadSuccessAction(authEntity);
        });


    @Effect()
    loadAuthFromServer$: Observable<Action> = this.actions$
        .ofType(aa.ActionTypes.LOAD_FROM_SERVER)
        .map((action: aa.LoadFromServerAction) => action.payload)
        .switchMap(payload => {
            return this.authService.login(payload.username, payload.password,
                payload.rememberUser)
                .map(result => new aa.LoadSuccessAction(result))
                .catch(err => {
                    const error = err.json();
                    console.log(error);
                    return of(new aa.LoadFailAction());
                });
        });


    @Effect()
    removeAuth$: Observable<Action> = this.actions$
        .ofType(aa.ActionTypes.REMOVE)
        .switchMap(() => {
            if (this.refreshSubscription) {
                this.refreshSubscription.unsubscribe();
            }
            return this.authService.logout()
                .map(() => new aa.RemoveSuccessAction())
                .catch(err => {
                    console.log(err);
                    return of(new aa.RemoveFailAction());
                })
                .do(() => this.store.dispatch(go(['/'])));
        });

    @Effect()
    loadSuccess$: Observable<Action> = this.actions$
        .ofType(aa.ActionTypes.LOAD_SUCCESS)
        .map(
            (action: aa.LoadSuccessAction) => new aa.ScheduleRefreshAction());

    @Effect()
    scheduleRefresh$: Observable<Action> = this.actions$
        .ofType(aa.ActionTypes.SCHEDULE_REFRESH)
        .map(() => {
            this.authService.scheduleRefresh();
            return new aa.ScheduleRefreshSuccessAction();
        });
    
    @Effect()
    refreshToken$: Observable<Action> = this.actions$
        .ofType(aa.ActionTypes.REFRESH)
        .switchMap(() => {
            return this.store.select(fromRoot.getAuth)
                .take(1)
                .switchMap(auth => {
                    return this.authService.refreshAuth(auth)
                        .map(result => {
                            // update local storage's auth
                            if (localStorage.getItem(environment.authKey)) {
                                this.authService.setAuthInLocalStorage(result);
                            }
                            return new aa.RefreshSuccessAction(result);
                        })
                        .catch(err => {
                            console.log(err);
                            return of(new aa.RefreshFailAction());
                        });
                });
        });

    @Effect()
    refreshSuccessToken$: Observable<Action> = this.actions$
        .ofType(aa.ActionTypes.REFRESH_SUCCESS)
        .map(() => new aa.ScheduleRefreshAction());

    @Effect()
    refreshFailToken$: Observable<Action> = this.actions$
        .ofType(aa.ActionTypes.REFRESH_FAIL)
        .map(() => {
            alert('Your session has expired. Please login again.');
            return new aa.RemoveAction();
        });
}
