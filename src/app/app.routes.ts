import { Routes } from '@angular/router';

// Components
import { VisualizationComponent } from './visualization/visualization.component'

export const appRoutes: Routes = [
  { path: '**', redirectTo: '/' },
  { path: '', component: VisualizationComponent }
];

export const appRoutesComponents = [
  VisualizationComponent
];
