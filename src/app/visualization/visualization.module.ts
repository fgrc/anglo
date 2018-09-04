import { RouterModule }     from '@angular/router';
import { NgModule }         from '@angular/core';
import { BrowserModule  }   from '@angular/platform-browser';
import { CommonModule }     from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap';
import { TypeaheadModule }  from 'ngx-bootstrap';
import { FormsModule }      from '@angular/forms';

// Component
import { VisualizationComponent } from './visualization.component';
import { SideBarComponent }       from './side-bar/side-bar.component';
import { ChartsComponent }        from './charts/charts.component';
import { TopBarComponent }        from './top-bar/top-bar.component';
import { LegendComponent }        from './legend/legend.component';
import { NouisliderModule }       from 'ng2-nouislider';

// Services
import { SeriesService }  from '../_core/services/series.service'
import { FiltersService } from '../_core/services/filters.service'

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    FormsModule,
    NouisliderModule
  ],
  declarations: [
    VisualizationComponent,
    SideBarComponent,
    ChartsComponent,
    TopBarComponent,
    LegendComponent
  ],
  providers: [SeriesService, FiltersService]
})
export class VisualizationModule { }
