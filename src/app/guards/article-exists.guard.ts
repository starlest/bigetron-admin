import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { go } from '@ngrx/router-store';
import * as fromRoot from '../reducers';
import * as aa from '../actions/articles.actions';


@Injectable()
export class ArticleExistsGuard implements CanActivate {

	public constructor(private store: Store<fromRoot.State>) {
	}

	public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
		const articleId = route.params['Id'];
		// load from store if it exists, else attempt to load from server
		return this.hasArticleInStore(articleId)
		  .switchMap(result => {
			  if (!!result) return Observable.of(true);
			  return this.hasArticleInServer(articleId);
		  });
	}

	private waitForArticlesToLoad(): Observable<boolean> {
		return this.store.select(fromRoot.getArticlesLoaded)
		  .filter((loaded: boolean) => loaded)
		  .take(1);
	}

	private hasArticleInStore(id: string): Observable<boolean> {
		return this.store.select(fromRoot.getArticle(id))
		  .take(1)
		  .map(article => !!article);
	}

	private hasArticleInServer(id: number): Observable<boolean> {
		this.store.dispatch(new aa.LoadSingleAction(id));
		return this.waitForArticlesToLoad().switchMap(() => {
			return this.hasArticleInStore(id.toString())
			  .map(result => {
				if (!!result) return true;
				else {
					this.store.dispatch(go(['/404']));
					return false;
				}
			});
		});
	}
}
