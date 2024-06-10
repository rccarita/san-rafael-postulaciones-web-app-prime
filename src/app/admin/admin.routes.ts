import { Routes } from "@angular/router";
import { PostulationComponent } from "./postulation/postulation.component";
import { PostulateGuard } from "../core/guards/postulation-guard";

export const ADMIN_ROUTES: Routes = [
    { path: 'postulation', component: PostulationComponent, canActivate: [PostulateGuard] },
]