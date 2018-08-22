import { Injectable }                        from '@angular/core';
import { Store }                             from '@ngrx/store';
import { Observable, Subject }               from 'rxjs/Rx';
import { BehaviorSubject }                   from 'rxjs/Rx';
// Store
import { filtersState, filtersStateActions } from '../store/filters.actions';
import { seriesState, seriesStateActions }   from '../store/series.actions';
// Interface
import { ISerie, Serie }                     from '../interfaces/series';
// Data
import { data }                              from '../data';
@Injectable()
export class SeriesService {
  

  constructor(private store: Store<filtersState | seriesState>) { }

  // Store

  setCharts = (charts: any) => this.store.dispatch({ type: seriesStateActions.setCharts, payload: charts });

  setSeries = (series: any) => this.store.dispatch({ type: seriesStateActions.setSeries, payload: series });

  setLegend = (legend: any) => this.store.dispatch({ type: seriesStateActions.setLegend, payload: legend })

}
