import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

/*
  Load here the actions
*/
import { filtersReducer } from './filters.actions';
import { seriesReducer } from './series.actions';

/*
    Module Declaration
*/
@NgModule({
  imports: [
    StoreModule.provideStore({
      filters: filtersReducer,
      series: seriesReducer
    })
  ],
  exports: [
    StoreModule
  ],
  declarations: [],
})
export class StateStoreModule { }
