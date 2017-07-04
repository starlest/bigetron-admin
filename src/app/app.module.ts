import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRouting } from './app.routing';

import { AppComponent } from './app.component';
import { ArticlesComponent, LoginComponent, NotFoundPageComponent } from './components';

import { AuthHttp } from './auth.http';
import { AuthService } from './services';

import { LoggedInGuard } from './guards';

import { AlertModule, CollapseModule } from 'ngx-bootstrap';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterStoreModule } from '@ngrx/router-store';
import { reducer } from './reducers/index';
import { AuthEffects } from './effects';
import { NotLoggedInGuard } from './guards/not-logged-in.guard';

@NgModule({
    declarations: [
        AppComponent,
        ArticlesComponent,
        LoginComponent,
        NotFoundPageComponent,
    ],
    imports: [
        AppRouting,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,

        /**
         * ngx-bootstrap
         */
        AlertModule.forRoot(),
        CollapseModule.forRoot(),

        /**
         * ngrx/store
         */
        StoreModule.provideStore(reducer),
        RouterStoreModule.connectRouter(),
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
        EffectsModule.run(AuthEffects),
    ],
    providers: [AuthHttp, AuthService, LoggedInGuard, NotLoggedInGuard],
    bootstrap: [AppComponent]
})
export class AppModule {
}
