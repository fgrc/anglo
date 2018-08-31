import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { Observable, Subject } from "rxjs/Rx";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { FiltersService } from "../_core/services/filters.service";
import { data } from "../_core/data";
import {
  filtersState,
  filtersInitialState
} from "../_core/store/filters.actions";
import { seriesState, seriesInitialState } from "../_core/store/series.actions";

// Services
import { SeriesService }                     from '../_core/services/series.service';
import { SidebarService } from "./side-bar/side-bar.service";
import { LegendService } from "./legend/legend.service";

// Interfaces
import { ISerie, Serie }                     from '../_core/interfaces/series';

@Component({
  selector: "visualization",

  templateUrl: "./visualization.html",

  styleUrls: ["./visualization.component.css"]
})
export class VisualizationComponent implements OnInit, OnDestroy {
  private sidebarStateSub: Subscription;
  private legendStateSub: Subscription;

  private filtersState$;
  private filtersState;

  private seriesState$;
  private seriesState;

  private filters$;
  private filters;

  private charts$;
  private charts;

  private series$;
  private series;

  private crossfilters$;
  private crossfilters;

  public sidebarState: string = "open";
  public legendState: string = "open";

  private firstValue$;
  private firstValue;

  private measures;

  constructor(
    private filtersService: FiltersService,
    private store: Store<filtersState>,
    private sidebarService: SidebarService,
    private legendService: LegendService,
    private seriesService: SeriesService
  ) {
    // States
    this.filtersState$ = this.store.select("filters");
    this.seriesState$ = this.store.select("series");

    this.filters$      = this.filtersState$.map(state => state.filters);
    this.charts$       = this.seriesState$ .map(state => state.charts);
    this.series$       = this.seriesState$ .map(state => state.series);
    this.crossfilters$ = this.seriesState$ .map(state => state.crossfilters);
    this.firstValue$   = this.seriesState$ .map(state => state.firstValues);
  }

  toggleSidebar(event) {
    let target = event.target || event.srcElement || event.currentTarget;
    this.sidebarService.toggleSidebarState();
    target.innerHTML =
      this.sidebarState === "open" ? "Hide sidebar" : "Show sidebar";
  }
  toggleLegend(event) {
    let target = event.target || event.srcElement || event.currentTarget;
    this.legendService.toggleLegendState();
    target.innerHTML =
      this.legendState === "open" ? "Hide legend" : "Show legend";
  }
  getDataChart = () => Math.random();

  ngOnInit() {
    this.measures = data
      .filter((v, i, a) => a.findIndex(d => d.Name === v.Name) === i)
      .map(d => d.Name);
    this.filtersService.setMeasures(this.measures);
    this.crossfilters$.subscribe(crossfilters => this.crossfilters = crossfilters);
    this.firstValue$  .subscribe(firstValue => this.firstValue = firstValue);
    this.series$      .subscribe(series => (this.series = series));
    this.charts$      .subscribe(charts => (this.charts = charts));
    

    this.sidebarStateSub = this.sidebarService
      .getSidebarStateStatusListener()
      .subscribe(changedSidebarState => {
        this.sidebarState = changedSidebarState ? "open" : "close";
      });
    this.legendStateSub = this.legendService
      .getLegendStateStatusListener()
      .subscribe(changedLegendState => {
        this.legendState = changedLegendState ? "open" : "close";
      });
  }
  ngOnDestroy() {
    this.sidebarStateSub.unsubscribe();
    this.legendStateSub.unsubscribe();
  }

  addFirstSerie(){
    const newSerie: ISerie = new Serie(this.measures.map(d => {return { title: d, value: false}}), [], []);
    this.series.push(newSerie);
    this.seriesService.setFirstValues(false);
    this.setSeries();    
  }

  setSeries = () => this.seriesService.setSeries(this.series);
}
