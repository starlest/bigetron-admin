import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ArticlesService } from '../services';
import { go } from '@ngrx/router-store';
import { NotificationsService } from 'angular2-notifications-lite';
import * as fromRoot from '../reducers';
import * as aa from '../actions/articles.actions';

@Injectable()
export class ArticlesEffects {
    constructor(private actions$: Actions,
                private store: Store<fromRoot.State>,
                private notificationsService: NotificationsService,
                private articlesService: ArticlesService) {
    }

    @Effect()
    loadArticles$: Observable<Action> = this.actions$
        .ofType(aa.ActionTypes.LOAD)
        .map((action: aa.LoadAction) => action.payload)
        .switchMap(payload =>
            this.articlesService.get(payload['filter'], payload['sortOrder'],
                payload['pageIndex'], payload['pageSize'])
                .map(results => new aa.LoadSuccessAction(results))
                .catch(error => {
                    console.log(error);
                    return Observable.of(new aa.LoadFailAction());
                })
        );

    @Effect()
    loadArticle$: Observable<Action> = this.actions$
        .ofType(aa.ActionTypes.LOAD_SINGLE)
        .map((action: aa.LoadSingleAction) => action.payload)
        .switchMap(id =>
            this.articlesService.getSingle(id)
                .map(results => new aa.LoadSingleSuccessAction(results))
                .catch(error => {
                    console.log(error);
                    return Observable.of(new aa.LoadSingleFailAction());
                })
        );

    @Effect()
    addArticle$: Observable<Action> = this.actions$
        .ofType(aa.ActionTypes.ADD)
        .map((action: aa.AddAction) => action.payload)
        .switchMap(article => {
            return this.articlesService.add(article)
                .map(article => {
                    this.notificationsService.success('Success', 'Article has' +
                        ' been successfully created.');
                    this.store.dispatch(go(['/articles']));
                    return new aa.AddSuccessAction(article);
                })
                .catch(error => {
                    this.notificationsService.error('Failure',
                        'Failed to add article. Please try again later.');
                    console.log(error);
                    return Observable.of(new aa.AddFailAction());
                })
        });
}
