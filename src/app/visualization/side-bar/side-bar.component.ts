import { Component, OnInit }                 from '@angular/core';
import { Store }                             from '@ngrx/store';
import { BehaviorSubject, Observable }       from 'rxjs/Rx';
// Store
import { seriesState, seriesStateActions }   from '../../_core/store/series.actions';
import { filtersState, filtersStateActions } from '../../_core/store/filters.actions';
// Services
import { SeriesService }                     from '../../_core/services/series.service';
import { FiltersService }                    from '../../_core/services/filters.service';
// Interfaces
import { ISerie, Serie }                     from '../../_core/interfaces/series';
import { IFilter, Filter }                   from '../../_core/interfaces/filters';
// Data
import { data }                              from '../../_core/data'

@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  
  private Title = 'Flotación'

  private filtersState$;
  private seriesState$;

  private series$;
  private series;

  private measures$;
  private measures;

  private charts$;
  private charts;

  private filters$;
  private filters;

  private timeScales = ['Hour', 'Day', 'Week', 'Month', 'Year'];
  

  private timeScaleDropDownButtonTittle: string = 'Select';

  constructor(
    private store: Store<seriesState | filtersState>,
    private seriesService: SeriesService,
    private filtersService: FiltersService
    ) { 
    // States
    this.filtersState$ = this.store.select('filters');
    this.seriesState$  = this.store.select('series');
    
    this.measures$ = this.filtersState$.map(state => state.measures);
    this.filters$  = this.filtersState$.map(state => state.filters);
    this.series$   = this.seriesState$ .map(state => state.series);
    this.charts$   = this.seriesState$ .map(state => state.charts);

    }

  ngOnInit() {
    this.measures$.subscribe(measures => this.measures = measures);
    this.filters$ .subscribe(filters  => this.filters  = filters);
    this.series$  .subscribe(series   => this.series   = series);
    this.charts$  .subscribe(charts   => this.charts   = charts);
  }

  triggerDropDownTimeScale = (title: string) => {
    this.filtersService.setTimeScale(title);
    this.timeScaleDropDownButtonTittle = title;
  };
  
  addNewSerie = () => {
    const newSerie: ISerie = new Serie(this.measures.map(d => {return { title: d, value: false}}), [], []);
    this.series.push(newSerie);
    this.setSeries();
  };

  titleLocationDropDownButton = (serieIndex: number) => {
    const  location = this.series[serieIndex].locations.find(d => d.value === true);
    return location ? location.title : 'Select';
  };

  triggerLocationDropDown = (title ,locationIndex: number, serieIndex: number) => {
    this.series[serieIndex].locations.forEach((d,i) => (locationIndex === i) ? d.value = true : d.value = false );
    
    const filterIndex         = this.filters.findIndex(d => d.serieId === serieIndex);
    const locationFilterIndex = this.filters[filterIndex].locations.findIndex(d => d.title === title);
    if(locationFilterIndex === -1){
      this.filters[filterIndex].locations.push(title);
    }
    this.setFilters();
    this.setSeries();
  }

  triggerMeasureDropDown = (title: string, serieIndex: number) => {
    
    let  dataSerie  = data.filter(d => d.Name === title );

    const locations = dataSerie.filter((v, i, a) => a.findIndex(d => d.Location === v.Location) === i).map(d =>  { return {title: d.Location, value: false }});

    const scenarios = dataSerie.filter((v, i, a) => a.findIndex(d => d.Scenario === v.Scenario) === i).map(d =>  { return (d.Scenario === 'Real') ? {title: d.Scenario, value: true } : {title: d.Scenario, value: false } });

    // assign Scenerarios & Locations
    Object.assign(this.series[serieIndex], {title: title, locations: locations, scenarios: scenarios});
        
    // set Values
    this.setSeries();
    
    this.setFilter({serieId: serieIndex, measure: title, locations: [], scenarios: ['Real']});
    this.setFilters();
    console.log(this.filters);
  }
  
  toggleScenariosCheckBox = (title: string, scenerarioIndex: number, serieIndex: number) => {
    this.series[serieIndex].scenarios[scenerarioIndex].value = !this.series[serieIndex].scenarios[scenerarioIndex].value;
    
    const filterIndex = this.filters.findIndex(d => d.serieId === serieIndex);
    
    let sceneariosFilters = [];
    this.series[serieIndex].scenarios.forEach(d => d.value ? sceneariosFilters.push(d.title): '');
    
    Object.assign(this.filters[filterIndex], {scenearios: sceneariosFilters});

    this.setFilters();
    this.setSeries(); 
  }

  setFilter = (params: IFilter) => {
    const filterIndex = this.filters.findIndex(d => d.serieId === params.serieId);
    if (filterIndex === -1){
      let filter: IFilter = new Filter(params.serieId, params.measure, params.locations, params.scenarios);
      this.filters.push(filter);
    }else{
      Object.assign(this.filters[filterIndex], params);
    }    
  }
    
  setFilters  = () => this.filtersService.setFilters(this.filters)
  setSeries   = () => this.seriesService.setSeries(this.series);

}
