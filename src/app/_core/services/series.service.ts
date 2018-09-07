import { Injectable }                        from '@angular/core';
import { Store }                             from '@ngrx/store';
import { Observable, Subject }               from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
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

  setFirstValues = (firstValue: boolean) => this.store.dispatch({ type: seriesStateActions.setFirstValues, payload: firstValue });

  setCharts = (charts: any) => this.store.dispatch({ type: seriesStateActions.setCharts, payload: charts });

  setSeries = (series: any) => this.store.dispatch({ type: seriesStateActions.setSeries, payload: series });

  setLegends = (legend: any) => this.store.dispatch({ type: seriesStateActions.setLegend, payload: legend })

  setCrossfilters = (crossfilters: any)  => this.store.dispatch({ type: seriesStateActions.setCrossfilters, payload: crossfilters });

  // Crossfilter

  initCrossfilter = (measure: string, serieIndex: number, date: string) => {
    
    let _data = data;
    if (date === 'Hours'){
      _data = _data.filter(d =>  new Date(d.Date) > new Date('2018-06-01T00:00:00.0000000') && new Date(d.Date) < new Date('2018-06-28T00:00:00.0000000')  )
    }

    let dataMeasure = _data.filter(d => d.Name === measure);
    let dataCrossfilter = crossfilter(dataMeasure);
    let dx: ICrossfilter = new Crossfilter(measure, serieIndex, dataCrossfilter);
    return dx;
  }


  initTimeDimension = (dx: any, timeScale: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    switch(timeScale){
      case 'Hours':
      return dx.dimension(d => d.Date);
      case 'Days':
      return dx.dimension(d => {
        const date = d.Date.split('T')[0].split('-');
        return date[2] + ' ' + months[date[1]-1] + ' ' + date[0];
      });
      case 'Weeks':
      break;
      case 'Months':
        return dx.dimension(d => {
          const date = d.Date.split('T')[0].split('-');
          return months[date[1]-1] + ' ' + date[0];
        });
      case 'Years':
        return dx.dimension(d => {
            const date = d.Date.split('T')[0].split('-');
            return date[0];
          });
      
    }
  }
  
  // Dimesions Functions
  initSceneraioDimension = (dx: any) => dx.dimension(d => d.Scenario);

  initLocationDimesion   = (dx: any) => dx.dimension(d => d.Location);

  // Group Functions
  initGroupBy            = (dimension: any) => dimension.group().reduce(this.addReduce, this.removeReduce, this.initReduce);
  
  // reduce Function
  addReduce    = (p: any, v:any) => {
    ++p.count;
    p.date  = new Date(v.Date);
    p.acm  += v.Value;
    p.avr   = p.acm/p.count;
    return p;
  }

  removeReduce = (p: any, v:any) => {
    --p.count;
    p.date  = new Date(v.Date);
    p.acm  -= v.Value;
    p.avr   = p.acm/p.count;
    return p;
  }

  initReduce   = () => {
    return {count: 0, date: '', avr: 0, acm: 0 }
  }

  // Filters Functions
  filterScenarios = (dimension: any,scenarios: string[]) => dimension.filterFunction(d => scenarios.indexOf(d) !== -1); 

  filterLocations = (dimension: any,locations: string[]) => dimension.filterFunction(d => locations.indexOf(d) !== -1); 

  // Charts

  getKeysCrossfilter  = (groupBy: any) => groupBy.all().map(d => d.key);
  getAvrsCrossfilter  = (groupBy: any) => groupBy.all().map(d => d.value.avr);
  getAcmCrossfilter   = (groupBy: any) => groupBy.all().map(d => d.value.acm);
  getCountCrossfilter = (groupBy: any) => groupBy.all().map(d => d.value.count);
  getDateCrossfilter  = (groupBy: any) => groupBy.all().map(d => d.value.date);
  
  
}
