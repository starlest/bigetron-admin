import { Injectable, OnDestroy } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';
import { AuthHttp } from '../auth.http';
import { Auth } from '../models';
import { toUrlEncodedString } from './util';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as fromRoot from '../reducers';
import * as aa from '../actions/auth.actions';

@Injectable()
export class AuthService implements OnDestroy {
    authKey = environment.authKey;
    refreshSubscription: Subscription;

    constructor(private store: Store<fromRoot.State>,
                private http: AuthHttp) {
    }

    ngOnDestroy() {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    public login(username: string, password: string,
                 rememberUser: boolean): any {
        this.setAuthInLocalStorage(null); // remove existing authKey
        const data = {
            username: username,
            password: password,
        };
        return this.getAuthFromServer(data, 'password', rememberUser);
    }

    public logout(): any {
        this.setAuthInLocalStorage(null);
        const url = environment.apiEndpoint + 'accounts/Logout'; // LogoutPath
        return this.http.post(url, null)
            .catch(err => Observable.throw(err));
    }

    // Persist auth into localStorage or removes it if a NULL argument is given
    public setAuthInLocalStorage(auth: Auth) {
        if (auth) {
            localStorage.setItem(this.authKey, JSON.stringify(auth));
        } else {
            localStorage.removeItem(this.authKey);
        }
    }

    // Retrieves the auth JSON object (or NULL if none)
    public getAuthFromLocalStorage(): Auth {
        const authJson = localStorage.getItem(this.authKey);
        if (!authJson) {
            return null;
        }
        const auth = JSON.parse(authJson);
        return auth;
    }

    private getAuthFromServer(data: any, grantType: string,
                              storeInLocalStorage: boolean = false): Observable<Auth> {
        const url = environment.apiEndpoint + 'connect/token'; // JwtProvider's
        // LoginPath

        Object.assign(data, {
            client_id: 'BTR',
            grant_type: grantType,
            // offline_access is required for a refresh token
            scope: ['openid offline_access profile email']
        });

        // data can be any since it can either be a refresh tokens or login
        // details The request for tokens must be x-www-form-urlencoded
        const headers = new Headers(
            { 'Content-Type': 'application/x-www-form-urlencoded' });
        const options = new RequestOptions({ headers: headers });
        return this.http.post(url, toUrlEncodedString(data), options)
            .map(res => res.json())
            .map((auth: Auth) => {
                const now = new Date();
                auth.expiration_date =
                    new Date(now.getTime() + auth.expires_in *
                        1000).getTime()
                        .toString();
                if (storeInLocalStorage) {
                    this.setAuthInLocalStorage(auth);
                }
                return auth;
            })
            .catch(err => Observable.throw(err));
    }

    public scheduleRefresh(): void {
        const source = this.store.select(fromRoot.getAuth)
            .take(1)
            .flatMap(auth => {
                const expiresIn = +auth.expiration_date -
                    new Date().getTime();
                console.log('token expiring in (minutes):',
                    expiresIn / 1000 / 60);

                // refresh when there are 5 minutes left
                const nextRefresh = expiresIn - (5 * 1000 * 60);

                console.log('refreshing in (minutes):',
                    nextRefresh / 1000 / 60);

                return Observable.timer(nextRefresh);
            });

        this.unsubscribeRefresh();

        this.refreshSubscription = source.subscribe(() => {
            this.store.dispatch(new aa.RefreshAction());
        });
    }

    // Refresh auth with the server
    public refreshAuth(entity: Auth): Observable<Auth> {
        return this.getAuthFromServer({ refresh_token: entity.refresh_token },
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

    private unsubscribeRefresh(): void {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }
}
