import { NgModule } from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import { AuthGuard } from "./auth/auth.guard";//protect routes with "canActivate:[AuthGuard]" to make a route protected by login
import { VisualizationComponent } from './visualization/visualization.component';
import { AuthenticatedNavigationComponent } from './authenticated-navigation/authenticated-navigation.component';

const routes:Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full', data: { state: 'login' } },
  { path: 'dashboard', component: VisualizationComponent, data: { state: 'dashboard' }},
  { path: 'authenticated-navigation', component: AuthenticatedNavigationComponent, data: { state: 'authenticatedNavigation' } },
  { path: 'auth', loadChildren:"./auth/auth.module#AuthModule"} //this path is loaded lazly, it means that it will look the auth.module file for the childrens paths there!
]

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule{}
