import { Component, ViewEncapsulation, OnInit, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { Store }                             from '@ngrx/store';

import { seriesState, seriesStateActions }   from '../../_core/store/series.actions';
import { filtersState, filtersStateActions } from '../../_core/store/filters.actions';
// Services
// import { SeriesService }                     from '../../_core/services/series.service';
import { FiltersService }                    from '../../_core/services/filters.service';



@Component({
  selector: 'tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

    private filtersState$;
    private filtersState;
    private pages$
    private pages
               

  constructor(
    private store: Store<seriesState | filtersState>,
    // private seriesService: SeriesService
  ) {

    this.filtersState$ = this.store.select('filters');    
    
  }

  ngOnInit() {
    
  }

  checkPage(page){
    return this.pages === page ? 'block': 'none';    
  }

  
}
