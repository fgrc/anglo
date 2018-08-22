import { Injectable }                        from '@angular/core';
import { Store }                             from '@ngrx/store';
import { Observable, Subject }               from 'rxjs/Rx';
import { BehaviorSubject }                   from 'rxjs/Rx';
// Store
import { filtersState, filtersStateActions } from '../store/filters.actions';
import { seriesState, seriesStateActions }   from '../store/series.actions';
// Interface
import { ISerie, Serie }                     from '../interfaces/series';
import { ICrossfilter, Crossfilter }         from '../interfaces/series';
// Data
import { data }                              from '../data';

import * as crossfilter from 'crossfilter2';

@Injectable()
export class SeriesService {
  

  constructor(private store: Store<filtersState | seriesState>) { }

  // Store

  setCharts = (charts: any) => this.store.dispatch({ type: seriesStateActions.setCharts, payload: charts });

  setSeries = (series: any) => this.store.dispatch({ type: seriesStateActions.setSeries, payload: series });

  setLegend = (legend: any) => this.store.dispatch({ type: seriesStateActions.setLegend, payload: legend })

  setCrossfilters = (crossfilters: any)  => this.store.dispatch({ type: seriesStateActions.setCrossfilters, payload: crossfilters });

  // Crossfilter

  initCrossfilter = (measure: string, serieIndex: number) => {
    let _data = data;
    let dataMeasure = _data.filter(d => d.Name === measure);
    let dataCrossfilter = crossfilter(dataMeasure);
    let dx: ICrossfilter = new Crossfilter(measure, serieIndex, dataCrossfilter);
    return dx;
  }

}
