import { Component, OnInit } from '@angular/core';

import { Store }                             from '@ngrx/store';

import { seriesState, seriesStateActions }   from '../../_core/store/series.actions';
import { filtersState, filtersStateActions } from '../../_core/store/filters.actions';
// Services
import { SeriesService }                     from '../../_core/services/series.service';
import { FiltersService }                    from '../../_core/services/filters.service';

@Component({
  selector: 'legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit {
  
  private legend = [];

  private filtersState$;
  private seriesState$;

  private legend$;

  private charts$;
  private charts;

  constructor(
    private store: Store<seriesState | filtersState>,
    private seriesService: SeriesService
  ) { 
    this.filtersState$ = this.store.select('filters');
    this.seriesState$  = this.store.select('series');

    this.charts$       = this.seriesState$ .map(state => state.charts);
  }

  ngOnInit() {
    this.charts$.subscribe(charts => this.setLegend(charts));
  }

  setLegend(charts){
    this.legend = [];
    charts.forEach((chart) => {
      chart.legend.forEach((e, i) => { this.legend.push({color: chart.colors[i], text: chart.title + ' - ' + e, active: false}) })
    })
    debugger
    // this.seriesService.setLegends(this.legend)
  }

}
