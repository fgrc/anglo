import { Component, OnInit, OnDestroy } from "@angular/core";

import { Store } from "@ngrx/store";

import { legendTransitions } from "./legend.animations";

import { Subscription } from "rxjs";

import {
  seriesState,
  seriesStateActions
} from "../../_core/store/series.actions";
import {
  filtersState,
  filtersStateActions
} from "../../_core/store/filters.actions";
// Services
import { SeriesService } from "../../_core/services/series.service";
import { FiltersService } from "../../_core/services/filters.service";

import { LegendService } from "./legend.service";

@Component({
  selector: "legend",
  templateUrl: "./legend.component.html",
  styleUrls: ["./legend.component.css"],
  animations: [legendTransitions]
})
export class LegendComponent implements OnInit, OnDestroy {
  private legendStateSub: Subscription;

  private legend = [];

  private filtersState$;
  private seriesState$;

  private legend$;

  private charts$;
  private charts;

  public legendState: string = "open";
  constructor(
    private store: Store<seriesState | filtersState>,
    private seriesService: SeriesService,
    private legendService: LegendService
  ) {
    this.filtersState$ = this.store.select("filters");
    this.seriesState$ = this.store.select("series");

    this.charts$ = this.seriesState$.map(state => state.charts);

    this.legendStateSub = this.legendService
      .getLegendStateStatusListener()
      .subscribe(changedLegendState => {
        this.legendState = changedLegendState ? "open" : "close";
      });
  }

  ngOnInit() {
    this.charts$.subscribe(charts => this.setLegend(charts));
  }

  setLegend(charts) {
    this.legend = [];
    charts.forEach(chart => {
      chart.legend.forEach((e, i) => {
        this.legend.push({
          color: chart.colors[i],
          text: chart.title + " - " + e,
          active: false
        });
      });
    });

    // this.seriesService.setLegends(this.legend)
  }

  ngOnDestroy() {
    this.legendStateSub.unsubscribe();
  }
}
