import { Injectable, OnDestroy } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { AuthHttp } from '../auth.http';
import { Observable, Subscription } from 'rxjs';
import { AuthEntity } from '../models/auth-entity';
import { toUrlEncodedString } from './util';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import * as aa from '../actions/auth.actions';

@Injectable()
export class AuthService implements OnDestroy {
	authKey = environment.authKey;
	refreshSubscription: Subscription;

	constructor(private store: Store<fromRoot.State>, private http: AuthHttp) {
	}

	login(username: string, password: string, rememberUser: boolean): any {
		this.setAuthInLocalStorage(null); // remove existing authKey
		const data = {
			username: username,
			password: password,
		};
		return this.getAuth(data, 'password', rememberUser);
	}

	logout(): any {
		this.setAuthInLocalStorage(null);
		const url = environment.apiEndpoint + 'Accounts/Logout'; // LogoutPath
		return this.http.post(url, null)
		  .catch(err => Observable.throw(err));
	}

	// Persist auth into localStorage or removes it if a NULL argument is given
	setAuthInLocalStorage(auth: AuthEntity) {
		if (auth)
			localStorage.setItem(this.authKey, JSON.stringify(auth));
		else
			localStorage.removeItem(this.authKey);
	}

	// Retrieves the auth JSON object (or NULL if none)
	getAuthInLocalStorage(): AuthEntity {
		const i = localStorage.getItem(this.authKey);
		if (!i) return null;
		const authEntity = JSON.parse(i);
		return authEntity;
	}

	getAuth(data: any, grantType: string,
	        storeInLocalStorage: boolean = false): Observable<AuthEntity> {
		const url = environment.apiEndpoint + 'connect/token'; // JwtProvider's
		// LoginPath

		Object.assign(data, {
			client_id: 'Edemy',
			grant_type: grantType,
			// offline_access is required for a refresh token
			scope: ['openid offline_access profile email']
		});

		// data can be any since it can either be a refresh tokens or login details
		// The request for tokens must be x-www-form-urlencoded
		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
		let options = new RequestOptions({ headers: headers });
		return this.http.post(url, toUrlEncodedString(data), options)
		  .map(res => res.json())
		  .map((authEntity: AuthEntity) => {
			  let now = new Date();
			  authEntity.expiration_date =
				new Date(now.getTime() + authEntity.expires_in * 1000).getTime()
				  .toString();
			  if (storeInLocalStorage) this.setAuthInLocalStorage(authEntity);
			  return authEntity;
		  })
		  .catch(err => Observable.throw(err));
	}

	scheduleRefresh(): void {
		let source = this.store.select(fromRoot.getAuthEntity)
		  .take(1)
		  .flatMap(entity => {
			  const expiresIn = +entity.expiration_date -
				new Date().getTime();
			  console.log('token expiring in (minutes):',
				expiresIn / 1000 / 60);

			  // refresh when there are 5 minutes left
			  let nextRefresh = expiresIn - (5 * 1000 * 60);

			  console.log('refreshing in (seconds):',
			    nextRefresh / 1000 / 60);

			  return Observable.timer(nextRefresh);
		  });

		this.unsubscribeRefresh();

		this.refreshSubscription = source.subscribe(() => {
			this.store.dispatch(new aa.RefreshAction());
		});
	}

	// Refresh auth with the server
	refreshAuth(entity: AuthEntity): Observable<AuthEntity> {
		return this.getAuth({ refresh_token: entity.refresh_token },
		  'refresh_token')
		  .take(1)
		  .map(result => result)
		  // This should only happen if the refresh token has expired
		  .catch(error => {
			  // let the app know that we cant refresh the token
			  // which means something is invalid and they aren't logged in
			  console.log(error);
			  return Observable.throw('Session Expired');
		  });
	}

	unsubscribeRefresh() {
		if (this.refreshSubscription) {
			this.refreshSubscription.unsubscribe();
		}
	}

	ngOnDestroy() {
		if (this.refreshSubscription)
			this.refreshSubscription.unsubscribe();
	}
}
