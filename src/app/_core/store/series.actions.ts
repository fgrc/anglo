import { Store, ActionReducer, Action } from '@ngrx/store';

// Actions Types
export const setCharts = 'setCharts';
export const setSeries = 'setSeries';
export const setLegend = 'setLegend'

export const seriesStateActions = {
    setCharts,
    setSeries,
    setLegend
}

// Interface declaration
export interface seriesState {
    charts: {  
        serieId : number,
        title   : string,
        legend  : string [],
        data    : {date: Date, value: number [] } []
    };
    series: { 
        title     : string,
        options   : {title: string, value: boolean} [], 
        visible   : {title: string, value: boolean} [], 
        measure   : {title: string, value: boolean} [], 
        locations : {title: string, value: boolean} [],
        scenarios : {title: string, value: boolean} [] 
    } [];
    legend: string [];
}

export const seriesInitialState: seriesState = {
    charts: {
        serieId: null,
        title: '',
        legend: [],
        data: []
    },
    series: [],
    legend: []
}

// Reducer
export function seriesReducer(state: seriesState = seriesInitialState, action: Action): seriesState {
    switch(action.type){
        case seriesStateActions.setSeries:
            return Object.assign({}, state, { series: action.payload }) as seriesState;
        case seriesStateActions.setCharts:
            return Object.assign({}, state, { charts: action.payload }) as seriesState;
        case seriesStateActions.setLegend:
            return Object.assign({}, state, { legend: action.payload }) as seriesState;
        default:
            return Object.assign({}, state)
    }
}