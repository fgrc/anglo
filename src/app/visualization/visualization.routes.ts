import { Routes } from '@angular/router';

import { StatsComponent }         from './stats/stats.component';
import { TablesComponent }        from './tables/tables.component';
import { ChartsComponent }        from './charts/charts.component';

/*
  Generated routes
*/
export const visualizationRoutes: Routes = [
  { path: 'dashboard', component: ChartsComponent, children: [
    { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard/tables', component: TablesComponent },
    { path: 'dashboard/stats', component: StatsComponent }
  ] }
];

export const visualizationRoutesComponents = [
  ChartsComponent,
  TablesComponent,
  StatsComponent
];
