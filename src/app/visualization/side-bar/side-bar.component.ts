import { Component, OnInit,OnDestroy }       from '@angular/core';
import { Store }                             from '@ngrx/store';
import { sidebarTransitions }                from './side-bar.animations';

import { Subscription }                      from "rxjs";
import { BehaviorSubject }                   from 'rxjs/internal/BehaviorSubject';
import { Observable }                        from 'rxjs/Rx';
// Store
import { seriesState, seriesStateActions }   from '../../_core/store/series.actions';
import { filtersState, filtersStateActions } from '../../_core/store/filters.actions';
// Services
import { SeriesService }                     from '../../_core/services/series.service';
import { FiltersService }                    from '../../_core/services/filters.service';
// Interfaces
import { ISerie, Serie }                     from '../../_core/interfaces/series';
import { ICrossfilter, Crossfilter }         from '../../_core/interfaces/series';
import { ICHart, Chart }                     from '../../_core/interfaces/series';
import { IFilter, Filter }                   from '../../_core/interfaces/filters';
// Data
import { data }                              from '../../_core/data'

import { SidebarService }                    from './side-bar.service';

@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  animations: [sidebarTransitions],
})
export class SideBarComponent implements OnInit, OnDestroy {
  private sidebarStateSub:Subscription;

  public Title = 'analysis'

  private filtersState$;
  private seriesState$;

  private series$;
  public series;

  private measures$;
  private measures;

  private charts$;
  private charts;

  private filters$;
  private filters;

  private crossfilters$;
  private crossfilters;

  private timeScales = ['Hours','Days', 'Months', 'Years'];

  private colors     = ['#2382f8', '#fa3f40', '#fc9537', '#fa365c', '#59d66f', '#43acd9', '#feca42', '#5a5ed1'];
  
  private timeScaleDropDownButtonTittle: string = 'Days';
  public sidebarState:string='open';
  constructor(
    private store: Store<seriesState | filtersState>,
    private seriesService: SeriesService,
    private filtersService: FiltersService,
    private sidebarService:SidebarService
    ) {
    // States
    this.filtersState$ = this.store.select('filters');
    this.seriesState$  = this.store.select('series');

    this.measures$     = this.filtersState$.map(state => state.measures);
    this.filters$      = this.filtersState$.map(state => state.filters);
    this.series$       = this.seriesState$ .map(state => state.series);
    this.charts$       = this.seriesState$ .map(state => state.charts);
    this.crossfilters$ = this.seriesState$ .map(state => state.crossfilters);

    }

  ngOnInit() {
    this.measures$    .subscribe(measures     => this.measures     = measures);
    this.filters$     .subscribe(filters      => this.filters      = filters);
    this.series$      .subscribe(series       => this.series       = series);
    this.charts$      .subscribe(charts       => this.charts       = charts);
    this.crossfilters$.subscribe(crossfilters => this.crossfilters = crossfilters);

    this.sidebarStateSub=this.sidebarService.getSidebarStateStatusListener().subscribe(
      changedSidebarState=>{
        this.sidebarState=changedSidebarState?'open':'close';
      });
  }
  triggerDropDownTimeScale = (title: string) => {
    this.clearParameters()
    
    this.filtersService.setTimeScale(title);
    this.timeScaleDropDownButtonTittle = title;
  };

  itemsLocation(items){
    return items.map(d => d.title)
  }  

  initLocation(items){
    return items.filter(d => d.value === true).map(d => d.title)
  }

  addNewSerie = () => {
    const newSerie: ISerie = new Serie(this.measures.map(d => {return { title: d, value: false}}), [], []);
    this.series.push(newSerie);
    this.seriesService.setFirstValues(false);
    this.setSeries();
  };

  triggerTitle = (serieIndex: number) => this.series[serieIndex].show = !this.series[serieIndex].show

  titleLocationDropDownButton = (serieIndex: number) => {
    const  location = this.series[serieIndex].locations.find(d => d.value === true);
    return location ? location.title : 'Select';
  };
  
  removeTriggerLocation = (values, serieIndex) => {
    
    
    this.series[serieIndex].locations.forEach((d,i) => (values.findIndex(dd => dd.text === d.title ) !== -1 ) ? d.value = true : d.value = false );
  }

  triggerLocationDropDown = (values , serieIndex: number) => {
    const title = values[values.length - 1].text;
    const locationIndex = this.series[serieIndex].locations.findIndex(d => d.title === title);
    // this.series[serieIndex].locations.forEach((d,i) => (locationIndex === i) ? d.value = true : d.value = false );

    const filterIndex         = this.filters.findIndex(d => d.serieId === serieIndex);
    const locationFilterIndex = this.filters[filterIndex].locations.findIndex(d => d.title === title);
    
    const chartIndex = this.charts.findIndex(d => d.serieId === serieIndex);
    // Crossfilter
    
    this.crossfilters.filter(d => d.serieId === serieIndex).forEach((crossfilter, crossfilterIndex) => {
      this.seriesService.filterLocations(crossfilter.dimensions.find(d => d.title === 'location').dimension,  [title] );
       const groupByTime = this.seriesService.initGroupBy(crossfilter.dimensions.find(d => d.title === 'time').dimension);
       let values = [];
      if(this.series[serieIndex].title === 'Tph'){
        values = this.seriesService.getAcmCrossfilter(groupByTime);
      }else{
        values = this.seriesService.getAvrsCrossfilter(groupByTime);
      }
       this.charts[chartIndex].legend[crossfilterIndex] = this.charts[chartIndex].legend[crossfilterIndex].split(' - ')[0] + ' - ' + title;
       this.charts[chartIndex].data.forEach((data, dataIndex) => data.values[crossfilterIndex] = values[dataIndex]);
    });

    this.setScenarios(serieIndex, title);                         

    if(locationFilterIndex === -1){
      this.filters[filterIndex].locations.push(title);
    }
    this.setFilters();
    this.setSeries();

    this.setCrossfilters();
    this.setCharts();
  }

  triggerMeasureDropDown = (title: string, serieIndex: number) => {

    if (this.series[serieIndex].title === title) return


    let  dataSerie  = data.filter(d => d.Name === title);

    const locations = dataSerie.filter((v, i, a) => a.findIndex(d => d.Location === v.Location) === i).map((d, j) =>  { return  (j === 0) ? {title: d.Location, value: true } : {title: d.Location, value: false } });

    dataSerie  = data.filter(d => d.Name === title && d.Location === locations[0].title);

    const scenarios = dataSerie.filter((v, i, a) => a.findIndex(d => d.Scenario === v.Scenario) === i).map(d =>  { return (d.Scenario === 'Real') ? {title: d.Scenario, value: true } : {title: d.Scenario, value: false } });

    // assign Scenerarios & Locations
    Object.assign(this.series[serieIndex], {title: title, locations: locations, scenarios: scenarios});

    // Crossfilter
    const crossfilterIndex = this.crossfilters.findIndex(d => d.serieId === serieIndex);

    // init
    const crossfilter      = this.initAllValuesCrossfilters(title, serieIndex);
    // filter Real values
    this.seriesService.filterScenarios(crossfilter.dimensions.find(d => d.title === 'scenario').dimension, ['Real']);
    // filter first location value
    this.seriesService.filterLocations(crossfilter.dimensions.find(d => d.title === 'location').dimension,  [locations[0].title] );
    
    
    // Group
    const groupByTime      = this.seriesService.initGroupBy(crossfilter.dimensions.find(d => d.title === 'time').dimension);
    crossfilter.groups.push({title: 'Time', scenario:'Real', location: locations[0].title ,group: groupByTime});

    if (crossfilterIndex === -1){
      this.crossfilters.push(crossfilter);
    }else{
      this.crossfilters[crossfilterIndex] = crossfilter;
    };

    // Charts
    const legend = 'Real' + ' - ' + locations[0].title;
    const chartIndex = this.charts.findIndex(d => d.serieId === serieIndex);
    const chart      = this.initChart(title, serieIndex, groupByTime, legend);

    if( chartIndex === -1){
      this.charts.unshift(chart);
    }else{
      this.charts[chartIndex] = chart;
    }

    // set Values
    this.setSeries();
    this.setFilter({serieId: serieIndex, measure: title, locations: [locations[0].title], scenarios: ['Real']});
    this.setFilters();
    this.setCrossfilters();
    this.setCharts();
  }

  toggleScenariosCheckBox = (title: string, scenerarioIndex: number, serieIndex: number) => {

    // Crossfilter && Chart
    if(!this.series[serieIndex].scenarios[scenerarioIndex].value){

      // Crossfilter
      const crossfilter = this.initAllValuesCrossfilters(this.series[serieIndex].title, serieIndex);
      // Scenario
      this.seriesService.filterScenarios(crossfilter.dimensions.find(d => d.title === 'scenario').dimension, [title]);
      //  Location
      const locationTitle = this.titleLocationDropDownButton(serieIndex);
      this.seriesService.filterLocations(crossfilter.dimensions.find(d => d.title === 'location').dimension,  [locationTitle] );
      // Group
      const groupByTime      = this.seriesService.initGroupBy(crossfilter.dimensions.find(d => d.title === 'time').dimension);
      crossfilter.groups.push({title: 'Time', scenario: title, location: locationTitle ,group: groupByTime});
      // Data
      const legend = title + ' - ' + locationTitle;
      const chartIndex = this.charts.findIndex(d => d.serieId === serieIndex);
      if (chartIndex !== -1){
      let values = [];
      if(this.series[serieIndex].title === 'Tph'){
        values = this.seriesService.getAcmCrossfilter(groupByTime);
      }else{
        values = this.seriesService.getAvrsCrossfilter(groupByTime);
      }
      this.charts[chartIndex].legend.push(legend);
      this.charts[chartIndex].data.forEach((d,i) => d.values.push(values[i]));
    }else{
        
        const chart = this.initChart(this.series[serieIndex].title, serieIndex,groupByTime, legend)
        this.charts.unshift(chart);
      }
      // Assign Values
      this.crossfilters.push(crossfilter);
    }else{
      const crossfilterIndex = this.crossfilters.findIndex(d => d.groups.findIndex(v => v.scenario === title) !== -1);
      if (crossfilterIndex !== -1) this.crossfilters.splice(crossfilterIndex, 1);

      // Charts Index
      const chartIndex  = this.charts.findIndex(d => d.serieId === serieIndex);
      const legendIndex = this.charts[chartIndex].legend.findIndex(d => d.split(' - ')[0] === title);

      // Remove Charts
      if (chartIndex !== -1 && legendIndex !== -1){
        this.charts[chartIndex].legend.splice(legendIndex,1);
        if (this.charts[chartIndex].legend.length === 0) {
          this.charts.splice(chartIndex, 1);
        }else{
          this.charts[chartIndex].data.forEach(d => d.values.splice(legendIndex, 1));
          this.charts[chartIndex].colors.splice(legendIndex, 1);
        }
      }
    };

    //Charts

    this.series[serieIndex].scenarios[scenerarioIndex].value = !this.series[serieIndex].scenarios[scenerarioIndex].value;

    const filterIndex = this.filters.findIndex(d => d.serieId === serieIndex);

    let sceneariosFilters = [];
    this.series[serieIndex].scenarios.forEach(d => d.value ? sceneariosFilters.push(d.title): '');
    
    Object.assign(this.filters[filterIndex], {scenearios: sceneariosFilters});
    
    this.setFilters();
    this.setSeries();

    this.setCrossfilters();
    this.setCharts();

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

  initAllValuesCrossfilters = (title: string, serieIndex: number) => {
    // Create Crossfilter
    let   crossfilter       = this.seriesService.initCrossfilter(title, serieIndex);
    // Create Dimension
    const timeDimension     = this.seriesService.initTimeDimension(crossfilter.data, this.timeScaleDropDownButtonTittle);
    const scenarioDimension = this.seriesService.initSceneraioDimension(crossfilter.data);
    const locationDimension = this.seriesService.initLocationDimesion(crossfilter.data);
    //Assign Values
    crossfilter.dimensions.push({ title: 'time', dimension: timeDimension });
    crossfilter.dimensions.push({ title: 'scenario', dimension: scenarioDimension });
    crossfilter.dimensions.push({ title: 'location', dimension: locationDimension });

    return crossfilter;
  }

  initChart = (title: string, serieId: number, groupBy: any, legend: string ) => {
    const keys   = this.seriesService.getKeysCrossfilter(groupBy);
    let values = [];
      if(this.series[serieId].title === 'Tph'){
        values = this.seriesService.getAcmCrossfilter(groupBy);
      }else{
        values = this.seriesService.getAvrsCrossfilter(groupBy);
      }
    const legendChart = [legend];
    const data   = keys.map((d,i) => { return {date: d, values: [ values[i] ] } });
    data.sort((a,b) => {
       const prev: any = new Date(b.date);
       const curr: any = new Date(a.date);
       return prev - curr
    }).reverse();
    return new Chart(serieId, title, legendChart, data);
  }

  setScenarios(serieIndex, title){

    let  dataSerie  = data.filter(d => d.Name === this.series[serieIndex].title && d.Location === title );

    const scenarios = dataSerie.filter((v, i, a) => a.findIndex(d => d.Scenario === v.Scenario) === i).map(d =>  { 
      const scenarioIndex = this.series[serieIndex].scenarios.findIndex(dd => dd.title === d.Scenario);
      return (scenarioIndex !== -1) ? this.series[serieIndex].scenarios[scenarioIndex] : {title: d.Scenario, value: false } 
    });
    
    Object.assign(this.series[serieIndex].scenarios, {});
    Object.assign(this.series[serieIndex].scenarios, scenarios);
    
    const chartIndex = this.charts.findIndex(d => d.serieId === serieIndex);
    const removeIndex = [];
    this.charts[chartIndex].legend.forEach((legend, legendIndex) => {
      const scenario = legend.split(' - ')[0];
      const scenarioIndex = scenarios.findIndex(d => d.title === scenario);
      if (scenarioIndex === -1) removeIndex.push({id: legendIndex, scenario: scenario});
    });
    
    removeIndex.forEach((r) => {
      this.charts[chartIndex].legend.splice(r.id, 1);
      this.charts[chartIndex].data.forEach(d => d.values.splice(r.id, 1));
      const crossfilterIndex = this.crossfilters.findIndex(d => d.serieId === serieIndex && d.groups.map(g => g.scenario).indexOf(r.scenario) !== -1);
      if (crossfilterIndex !== -1) this.crossfilters.splice(crossfilterIndex, 1);
    });

  }

  setLocations(serieIndex, title){
    let  dataSerie  = data.filter(d => d.Name === this.series[serieIndex].title && d.Location === title );

    const locations = dataSerie.filter((v, i, a) => a.findIndex(d => d.Location === v.Location) === i).map((d, j) =>  { return  (d.Location === title) ? {title: d.Location, value: true } : {title: d.Location, value: false } });

    Object.assign(this.series[serieIndex].locations, {});
    Object.assign(this.series[serieIndex].locations, locations);
    
    const chartIndex = this.charts.findIndex(d => d.serieId === serieIndex);
    const removeIndex = [];
    this.charts[chartIndex].legend.forEach((legend, legendIndex) => {
      const location = legend.split(' - ')[0];
      const locationIndex = locations.findIndex(d => d.title === location);
      if (locationIndex === -1) removeIndex.push(legendIndex);
    });
    removeIndex.forEach((index) => {
      this.charts[chartIndex].legend.splice(index, 1);
      this.charts[chartIndex].data.forEach(d => d.values.splice(index, 1));
      this.crossfilters.splice(index, 1);
    });
  }

  removeSerie(serieIndex: number){
    const filterIndex      = this.filters     .findIndex(d => d.serieId === serieIndex);
    const chartIndex       = this.charts      .findIndex(d => d.serieId === serieIndex);
    const crossfilterIndex = this.crossfilters.findIndex(d => d.serieId === serieIndex);
    
    if (filterIndex !== -1)      this.filters     .splice(filterIndex, 1);
    if (crossfilterIndex !== -1) this.crossfilters.splice(crossfilterIndex, 1);
    if (chartIndex !== -1)       this.charts      .splice(chartIndex, 1);  
    if (serieIndex !== -1)       this.series      .splice(serieIndex, 1);
    this.setCharts();
    this.setFilters();
    this.setSeries();
    this.setCrossfilters();
  }  

  clearParameters(){
    this.charts.length = 0;
    this.filters.length = 0;
    this.series.length = 0;
    this.crossfilters.length = 0;
    this.setCharts();
    this.setFilters();
    this.setSeries();
    this.setCrossfilters()
  }

  setCharts       = () => this.seriesService.setCharts(this.charts);
  setFilters      = () => this.filtersService.setFilters(this.filters)
  setSeries       = () => this.seriesService.setSeries(this.series);
  setCrossfilters = () => this.seriesService.setCrossfilters(this.crossfilters);


  ngOnDestroy(){
    this.sidebarStateSub.unsubscribe();
  }
}
