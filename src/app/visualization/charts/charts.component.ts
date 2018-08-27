import { Component, ViewEncapsulation, OnInit, ElementRef, Input, OnChanges } from '@angular/core';
import { Store }                             from '@ngrx/store';

import { seriesState, seriesStateActions }   from '../../_core/store/series.actions';
import { filtersState, filtersStateActions } from '../../_core/store/filters.actions';
// Services
import { SeriesService }                     from '../../_core/services/series.service';
import { FiltersService }                    from '../../_core/services/filters.service';


import { data1 } from './data';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';


@Component({
  selector: 'charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
      
    private margin = {top: 20, right: 20, bottom: 30, left: 50};
    private widthC: number;
    private heightC: number;
    private subHeightC: number;
    private x: any;
    private y: any;
    private svg: any;
    private width: number = 1100;
    private height: number = 800;
    private line: any = [];

    private totalSeries: number;

    private filtersState$;
    private seriesState$;

    private charts$;
    private charts;

  constructor(
    private store: Store<seriesState | filtersState>,
    private seriesService: SeriesService,
  ) { 
    this.widthC = this.width - this.margin.left - this.margin.right;
    this.heightC = this.height - this.margin.top - this.margin.bottom;
    

    this.filtersState$ = this.store.select('filters');
    this.seriesState$  = this.store.select('series');

    this.charts$       = this.seriesState$ .map(state => state.charts);
  }

  ngOnInit() {
    this.charts$.subscribe(charts => this.setCharts(charts));
  }

  setCharts(charts) {
    this.charts = charts;
    d3.select('#stacked-line-chart').selectAll("*").remove();
    if(this.charts.length === 0) return
    this.initSvg();
    // Axis X
    this.initAxisX();
    this.drawAxisX();
    // Axis Y
    this.initAxisY();
    this.drawAxisY();

    this.drawLine();
  }


  initSvg() {
      
      this.totalSeries = this.charts.length;
      this.subHeightC = this.heightC/this.totalSeries;

      this.svg = d3.select('#stacked-line-chart')
          .append('svg')
          .attr('width', this.width)
          .attr('height', this.height)
          .append('g')
          .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  initAxisX(){
    this.x = d3Scale.scaleTime().range([0, this.widthC]);
    const domain = d3Array.extent(this.charts[0].data, (d) => new Date(d.date) );
    this.x.domain(domain);    
  }

  initAxisY() {
      this.y = [];
      for(let i = 0; i < this.totalSeries; i++){
        this.y[i] = d3Scale.scaleLinear().range([this.subHeightC, 0]);
        this.y[i].domain(d3Array.extent(this.charts[i].data, (d) => d.values[0] ));
      }
  }

  drawAxisX () {

      this.svg.append('g')
          .attr('class', 'axis axis--x')
          .attr('transform', 'translate(0,' + this.heightC + ')')
          .call(d3Axis.axisBottom(this.x));
  }

  drawAxisY () {
    
    for(let i = 0; i < this.totalSeries; i++){
      this.svg.append('g')
          .attr('class', 'axis axis--y')
          .attr('transform', 'translate(0,' + (this.heightC - this.subHeightC * ( i + 1 )  ) + ')')
          .call(d3Axis.axisLeft(this.y[i]))
          .append('text')
          .attr('class', 'axis-title')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text('Unit Value');
    }

  }

 drawLine() {
      
      for(let i= 0; i < this.totalSeries; i ++){
      
        this.line.push( d3Shape.line()
            .x( (d: any, j: number) => this.x(new Date(d.date)) )
            .y( (d: any) => this.y[i](d.values[0] ) )
        );
        this.svg.append('path')
            .datum(this.charts[i].data)
            .attr('class', 'line')
            .attr('stroke', '#007bff')
            .attr('stroke-width', '1.5px')
            .attr('transform', 'translate(0,' + (this.heightC - this.subHeightC * (i + 1 )  ) + ')')
            .attr('d', this.line[i]);
        }
  }

}
