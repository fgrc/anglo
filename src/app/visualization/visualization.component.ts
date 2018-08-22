import { Component, OnInit }                 from '@angular/core';
import { Store }                             from '@ngrx/store';
import { Observable, Subject }               from 'rxjs/Rx';
import { BehaviorSubject }                   from 'rxjs/Rx';              
import { FiltersService }                    from '../_core/services/filters.service';
import { data }                              from '../_core/data';
import { filtersState, filtersInitialState } from '../_core/store/filters.actions';
import { seriesState, seriesInitialState }   from '../_core/store/series.actions';

@Component({
  selector: 'visualization',
  template: `
    <div class="row col-sm-12 mr-0 ml-0">
        <div class="col-sm-2">
          <side-bar></side-bar>
        </div>
        <div class="col-sm-10">
          <div class="container-visualization container-fluid">
            <top-bar></top-bar>
            <div class="row">
              <div class="col-sm-9">
                <charts></charts>
              </div>
              <div class="col-sm-3">
                <legend></legend>
              </div>
            </div>
          </div>
        </div>
    </div>    
  `,
  styles: []
})
export class VisualizationComponent implements OnInit {
  
  private filtersState$;
  private filtersState;

  private seriesState$;
  private seriesState;

  private filters$;
  private filters;

  private charts$;
  private charts;

  private series$;
  private series;

  private crossfilters$;
  private crossfilters;

  constructor(
    private filtersService: FiltersService,
    private store: Store<filtersState>
    ) { 
      // States
      this.filtersState$ = this.store.select('filters');
      this.seriesState$  = this.store.select('series');
  
      this.filters$        = this.filtersState$.map(state => state.filters);
      this.charts$         = this.seriesState$ .map(state => state.charts);
      this.series$         = this.seriesState$ .map(state => state.series);
      this.crossfilters$   = this.seriesState$ .map(state => state.crossfilters);
     }

  ngOnInit() {
    const measures = data.filter((v, i, a) => a.findIndex(d => d.Name === v.Name) === i).map(d => d.Name);
    this.filtersService.setMeasures(measures);
    this.crossfilters$ .subscribe(crossfilters => this.crossfilters = crossfilters);
    this.filters$      .subscribe(filters  => {
      this.filters  = filters;
      let _data = data;
      
    });
    // this.series$  .subscribe(series   => this.series   = series);
    // this.charts$  .subscribe(charts   => this.charts   = charts);
  }

}
