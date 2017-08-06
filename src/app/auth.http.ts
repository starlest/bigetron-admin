import { Injectable, OnDestroy } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Store } from '@ngrx/store';
import { Auth } from './models';
import { Subscription } from 'rxjs/Subscription';
import * as fromRoot from './reducers';

@Injectable()
export class AuthHttp implements OnDestroy {
    http: Http;
    authEntity: Auth;
    authSubscription: Subscription;

    constructor(http: Http, private store: Store<fromRoot.State>) {
        this.http = http;
        this.authSubscription = this.store.select(fromRoot.getAuth)
            .map(entity => this.authEntity = entity).subscribe();
    }

    get(url, opts = {}) {
        this.configureAuth(opts);
        return this.http.get(url, opts);
    }

    post(url, data, opts = {}) {
        if (!!data && !data.includes('refresh_token')) {
            this.configureAuth(opts);
        }
        return this.http.post(url, data, opts);
    }

    put(url, data, opts = {}) {
        this.configureAuth(opts);
        console.log(opts);
        return this.http.put(url, data, opts);
    }

    delete(url, opts = {}) {
        this.configureAuth(opts);
        return this.http.delete(url, opts);
    }

    configureAuth(opts: any) {
        const accessToken = this.authEntity ? this.authEntity.access_token :
            null;
        if (accessToken) {
            if (!opts.headers) {
                opts.headers = new Headers();
            }
            opts.headers.set('Authorization', `Bearer ${accessToken}`);
        }
    }

    ngOnDestroy() {
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }
    }
}
