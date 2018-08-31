import { Store, ActionReducer, Action } from '@ngrx/store';

// Actions Types
export const setCharts       = 'setCharts';
export const setSeries       = 'setSeries';
export const setLegend       = 'setLegend';
export const setCrossfilters = 'setCrossfilter';
export const setFirstValues     = 'setFirstValues';

export const seriesStateActions = {
    setCharts,
    setSeries,
    setLegend,
    setCrossfilters,
    setFirstValues
}

// Interface declaration
export interface seriesState {
    firstValues: boolean;
    charts: {  
        serieId : number,
        title   : string,
        legend  : string [],
        colors  : string [];
        data    : {key: string, values: number [] } []
    }[];
    series: { 
        title     : string,
        options   : {title: string, value: boolean} [], 
        visible   : {title: string, value: boolean} [], 
        measure   : {title: string, value: boolean} [], 
        locations : {title: string, value: boolean} [],
        scenarios : {title: string, value: boolean} [] 
    } [];
    legend: {text: string, active: boolean, color: string} [];
    crossfilters : {
        title      : string;
        serieId    : number;
        data       : any;
        dimensions : {
            title    : string,
            dimension: any
        } [];
        groups     : {
            title: string,
            scenario: string,
            location: string,
            group: any
        }[];
    }[];
}

export const seriesInitialState: seriesState = {
    charts: [],
    series: [],
    legend: [],
    crossfilters: [],
    firstValues: true    
}

// Reducer
export function seriesReducer(state: seriesState = seriesInitialState, action: Action): seriesState {
    switch(action.type){
        case seriesStateActions.setFirstValues:
            return Object.assign({}, state, { firstValues: action.payload }) as seriesState;
        case seriesStateActions.setSeries:
            return Object.assign({}, state, { series: action.payload }) as seriesState;
        case seriesStateActions.setCharts:
            return Object.assign({}, state, { charts: action.payload }) as seriesState;
        case seriesStateActions.setCrossfilters:
            return Object.assign({}, state, { crossfilters: action.payload }) as seriesState;
        case seriesStateActions.setLegend:
            return Object.assign({}, state, { legend: action.payload }) as seriesState;
        default:
            return Object.assign({}, state)
    }
}