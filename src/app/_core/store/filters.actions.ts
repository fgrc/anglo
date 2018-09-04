import { Store, ActionReducer, Action } from '@ngrx/store';
import 'rxjs/add/operator/map';
declare module '@ngrx/store' {
  interface Action {
    type: string;
    payload?: any;
  }
}

// Actions Types
export const setTimeScale = 'setTimeScale';
export const setMeasures  = 'setMeasures';
export const setFilters   = 'setFilters';
export const setPages     =  'setPages';

export const filtersStateActions = {
    setTimeScale,
    setMeasures,
    setFilters,
    setPages
}

// Interface declaration
export interface filtersState {
    timeScale: string;
    measures : string [];
    filters  : {
        serieId   : number,
        measure   : string,
        locations : string [],
        scenarios : string []
    }[];
    pages : string;
}

export const filtersInitialState: filtersState = {
    timeScale: '',
    measures : [],
    filters  : [],
    pages    : 'charts'
}

// Reducer
export function filtersReducer(state: filtersState = filtersInitialState, action: Action): filtersState {
    switch(action.type){
        case filtersStateActions.setTimeScale:
            return Object.assign({}, state, { timeScale: action.payload }) as filtersState;
        case filtersStateActions.setMeasures:
            return Object.assign({}, state, { measures: action.payload }) as filtersState;
        case filtersStateActions.setFilters:
            return Object.assign({}, state, { filters: action.payload }) as filtersState;
        case filtersStateActions.setPages:
            return Object.assign({}, state, { pages: action.payload }) as filtersState;
        default:
            return Object.assign({}, state)
    }
}
