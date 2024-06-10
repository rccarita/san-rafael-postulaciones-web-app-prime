import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { NoAuthGuard } from "../core/guards/no-auth-guard";

export const AUTH_ROUTES: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
]