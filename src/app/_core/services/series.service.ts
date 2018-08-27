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


  initTimeDimension = (dx: any, timeScale: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    switch(timeScale){
      case 'Hours':
      break;
      case 'Days':
      return dx.dimension(d => {
        const date = d.Date.split('/');
        return date[0] + ' ' + months[date[1]-1] + ' ' + date[2];
      });
      case 'Weeks':
      break;
      case 'Months':
        return dx.dimension(d => {
          const date = d.Date.split('/');
          return months[date[1]-1] + ' ' + date[2];
        });
      case 'Years':
        return dx.dimension(d => {
            const date = d.Date.split('/');
            return date[2];
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
    p.date  = new Date(v.Date.split('/')[1], v.Date.split('/')[0], v.Date.split('/')[2]);
    p.acm  += Number(v.Value.replace(',','.'));
    p.avr   = p.acm/p.count;
    return p;
  }

  removeReduce = (p: any, v:any) => {
    --p.count;
    p.date  = new Date(v.Date.split('/')[2], v.Date.split('/')[1], v.Date.split('/')[0]);
    p.acm  -= Number(v.Value.replace(',','.'));
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
