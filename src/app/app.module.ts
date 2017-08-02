import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DatePipe } from '@angular/common';
import { AppRouting } from './app.routing';

import { AppComponent } from './app.component';
import {
   ArticleComponent, ArticleAddComponent, ArticlesComponent, LoginComponent, NotFoundPageComponent
} from './components';

import { AuthHttp } from './auth.http';
import { ArticlesService, AuthService } from './services';

import { ArticleExistsGuard, LoggedInGuard, NotLoggedInGuard } from './guards';

import { SimpleNotificationsModule } from 'angular2-notifications-lite';

import { AlertModule, CollapseModule, PaginationModule } from 'ngx-bootstrap';
import { Ng2TableModule } from 'ng2-table';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterStoreModule } from '@ngrx/router-store';
import { reducer } from './reducers/index';
import { ArticlesEffects, AuthEffects } from './effects';

@NgModule({
    declarations: [
        AppComponent,
        ArticleComponent,
        ArticleAddComponent,
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

        SimpleNotificationsModule.forRoot(),

        /**
         * ngx-bootstrap
         */
        AlertModule.forRoot(),
        CollapseModule.forRoot(),
        Ng2TableModule,
        PaginationModule.forRoot(),

        /**
         * ngrx/store
         */
        StoreModule.provideStore(reducer),
        RouterStoreModule.connectRouter(),
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
        EffectsModule.run(ArticlesEffects),
        EffectsModule.run(AuthEffects),
    ],
    providers: [DatePipe, AuthHttp, ArticlesService, ArticlesEffects, AuthService,
       ArticleExistsGuard, LoggedInGuard, NotLoggedInGuard],
    bootstrap: [AppComponent]
})
export class AppModule {
}
