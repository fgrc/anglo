import { RouterModule }     from '@angular/router';
import { NgModule }         from '@angular/core';
import { BrowserModule  }   from '@angular/platform-browser';
import { CommonModule }     from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap';
import { TypeaheadModule }  from 'ngx-bootstrap';
import { FormsModule }      from '@angular/forms';
import { NouisliderModule }       from 'ng2-nouislider';

// Component
import { VisualizationComponent } from './visualization.component';
import { SideBarComponent }       from './side-bar/side-bar.component';
import { ChartsComponent }        from './charts/charts.component';
import { TopBarComponent }        from './top-bar/top-bar.component';
import { LegendComponent }        from './legend/legend.component';
import { StatsComponent }         from './stats/stats.component';
import { TablesComponent }        from './tables/tables.component';


// Services
import { SeriesService }  from '../_core/services/series.service'
import { FiltersService } from '../_core/services/filters.service'

// Routes
// import { visualizationRoutes, visualizationRoutesComponents } from './visualization.routes';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    FormsModule,
    NouisliderModule,
    // RouterModule.forChild(visualizationRoutes)
  ],
  exports: [
    // ...visualizationRoutesComponents
  ],
  declarations: [
    VisualizationComponent,
    SideBarComponent,
    ChartsComponent,
    TopBarComponent,
    LegendComponent,
    StatsComponent,
    TablesComponent,
    // ...visualizationRoutesComponents,
  ],
  providers: [SeriesService, FiltersService]
})
export class VisualizationModule { }
