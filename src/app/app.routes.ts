import { Routes } from '@angular/router';

// Components
import { VisualizationComponent } from './visualization/visualization.component'

//import { AuthGuard } from "./auth/auth.guard"; //protect routes with "canActivate:[AuthGuard]" to make a route protected by login

export const appRoutes: Routes = [
  { path: '**', redirectTo: '/' },
  { path: '', component: VisualizationComponent },
  //{ path:'auth',loadChildren:"./auth/auth.module#AuthModule"} //this path is loaded lazly, it means that it will look the auth.module file for the childrens paths there!
];

export const appRoutesComponents = [
  VisualizationComponent
];
