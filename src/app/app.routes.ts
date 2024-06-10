import { Routes } from '@angular/router';
import { NoAuthGuard } from './core/guards/no-auth-guard';
import { HomeComponent } from './admin/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [NoAuthGuard] },
    {
        path: '',
        loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
];
