import { Component, ViewEncapsulation, OnInit, ElementRef, Input, OnChanges } from '@angular/core';
import { Store }                             from '@ngrx/store';

import { seriesState, seriesStateActions }   from '../../_core/store/series.actions';
import { filtersState, filtersStateActions } from '../../_core/store/filters.actions';
// Services
import { SeriesService }                     from '../../_core/services/series.service';
import { FiltersService }                    from '../../_core/services/filters.service';

import * as d3 from 'd3'

import { transition } from 'd3-transition';
// import * as d3 from 'd3-selection';
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
    private dots: any = [];

    private totalSeries: number;

    private filtersState$;
    private seriesState$;

    private charts$;
    private charts;

    private colors = ['#2382f8', '#fa3f40', '#fc9537', '#fa365c', '#59d66f', '#43acd9', '#feca42', '#5a5ed1'];

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
        const dataAux  = [];
        this.charts[i].data.forEach((data) => data.values.forEach(v=> dataAux.push(v)));

        this.y[i] = d3Scale.scaleLinear().range([this.subHeightC, 0]);
        this.y[i].domain(d3Array.extent(dataAux, (d) => d ));
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
          .text(this.charts[i].title);
    }

  }

 drawLine() {
      this.line = [];
      this.dots = [];
      for(let i= 0; i < this.totalSeries; i ++){
        this.charts[i].colors = [];
        const subSeries = this.charts[0].data[0].values.length;

        for (let zz = 0; zz < subSeries; zz++){
          const line = d3Shape.line()
              .x( (d: any) => this.x(new Date(d.date)) )
              .y( (d: any) => this.y[i](d.values[zz] ) );
          
          
          const color = this.colors[zz];
          this.charts[i].colors.push(color);
          this.line.push(line);
          this.svg.append('path')
              .datum(this.charts[i].data)
              .attr('class', 'time line '+i+'-'+zz)
              .attr('stroke', color)
              .attr('stroke-width', '1.5px')
              .attr('transform', 'translate(0,' + (this.heightC - this.subHeightC * (i + 1 )  ) + ')')
              .attr('d', line)
              .style('opacity', 1)
              .on('mouseover', (dd, ii, ee) => this.mouseOverLineIn(dd, i, ee))
              .on('mouseout', (dd, ii, ee) => this.mouseOverLineOut(dd, ii, ee))

          const dots = this.svg.selectAll('.dot-times' + this.charts[i].title + '-' +this.charts[i].legend[zz])
              .data(this.charts[i].data)
              .enter().append('circle')
              .attr('class', '.dot-times' + this.charts[i].title + '-' +this.charts[i].legend[zz])
              .style('stroke', 'white')
              .attr('stroke-width', 1)
              .attr('r',2)
              .style('fill', 'black')
              .attr('cx', (d: any) => this.x(new Date(d.date)))
              .attr('cy', (d: any) => this.y[i](d.values[zz] ))
              .attr('transform', 'translate(0,' + (this.heightC - this.subHeightC * (i + 1 )  ) + ')');
          
          this.dots.push(dots);           
        }
      }
  }

  mouseOverLineIn(d, i, e){
    this.svg.selectAll('.time.line').each((dd, ii, ee) => {
       if(i !== ii){
         d3.selectAll(ee).style("opacity", 0.3);
        }
    })
    d3.selectAll(e).style("opacity", 1);
  }

  mouseOverLineOut(d, i, e){
    this.svg.selectAll('.time.line').each((dd, ii, ee) => {
      d3.selectAll(ee).transition().duration(300).style("opacity", 1); 
    })
  }


  drawTooltip(){

  }

}
