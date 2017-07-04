import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import { Observable } from 'rxjs';
import { go } from '@ngrx/router-store';

@Injectable()
export class NotLoggedInGuard implements CanActivate {

    constructor(private store: Store<fromRoot.State>) {
    }

    waitForAuthToLoad(): Observable<boolean> {
        return this.store.select(fromRoot.getAuthLoaded)
            .filter((loaded: boolean) => loaded)
            .take(1);
    }

    isUserLoggedIn(): Observable<boolean> {
        return this.store.select(fromRoot.getAuth)
            .map(auth => {
                if (!auth) this.store.dispatch(go(['login']));
                return !!auth
            });
    }

    canActivate(): Observable<boolean> {
        return this.waitForAuthToLoad()
            .switchMap(() => this.isUserLoggedIn());
    }
}
