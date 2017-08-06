import { RouterModule, Routes } from '@angular/router';
import {
    ArticleComponent, ArticleAddComponent, ArticleEditComponent, ArticlesComponent, LoginComponent, NotFoundPageComponent
} from './components';
import { ArticleExistsGuard, LoggedInGuard, NotLoggedInGuard } from './guards';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoggedInGuard]
    },
    {
        path: 'articles',
        component: ArticlesComponent,
        canActivate: [NotLoggedInGuard]
    },
    {
        path: 'articles/add',
        component: ArticleAddComponent,
        canActivate: [NotLoggedInGuard]
    },
    {
        path: 'articles/:Id/edit',
        component: ArticleEditComponent,
        canActivate: [NotLoggedInGuard]
    },
    {
        path: 'articles/:Id',
        component: ArticleComponent,
        canActivate: [NotLoggedInGuard, ArticleExistsGuard]
    },
    {
        path: '404',
        component: NotFoundPageComponent
    },
    {
        path: '**',
        redirectTo: '404',
        pathMatch: 'full'
    }
];

export const AppRouting = RouterModule.forRoot(appRoutes);
