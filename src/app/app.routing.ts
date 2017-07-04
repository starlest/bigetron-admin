import { RouterModule, Routes } from '@angular/router';
import {
    ArticlesComponent, LoginComponent, NotFoundPageComponent
} from './components';
import { LoggedInGuard, NotLoggedInGuard } from './guards';

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
