import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable, Subject } from 'rxjs/Rx';

import { BehaviorSubject } from 'rxjs/Rx';

import { filtersState, filtersStateActions } from '../store/filters.actions';



@Injectable()
export class FiltersService {

  constructor(private store: Store<filtersState>) { }

  // Store
  setMeasures = (measures: string[]) => this.store.dispatch({ type: filtersStateActions.setMeasures, payload: measures });

  setTimeScale = (timeScale: string)  => this.store.dispatch({ type: filtersStateActions.setTimeScale, payload: timeScale });

  setFilters = (fitlers: any) => this.store.dispatch({ type: filtersStateActions.setFilters, payload: fitlers });
    
}
