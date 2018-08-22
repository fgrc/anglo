import { Component, ViewEncapsulation, OnInit } from '@angular/core';

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

  constructor() { 
    this.widthC = this.width - this.margin.left - this.margin.right;
    this.heightC = this.height - this.margin.top - this.margin.bottom;
    this.totalSeries = data1[0].value.length;
    this.subHeightC = this.heightC/this.totalSeries;
  }

  ngOnInit() {
    
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
      this.svg = d3.select('#stacked-line-chart')
          .append('svg')
          .attr('width', this.width)
          .attr('height', this.height)
          .append('g')
          .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  initAxisX(){
    this.x = d3Scale.scaleTime().range([0, this.widthC]);
    this.x.domain(d3Array.extent(data1, (d) => d.date ));    
  }

  initAxisY() {
      this.y = [];
      for(let i = 0; i < this.totalSeries; i++){
        this.y[i] = d3Scale.scaleLinear().range([this.subHeightC, 0]);
        this.y[i].domain(d3Array.extent(data1, (d) => d.value[i] ));
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
            .x( (d: any) => this.x(d.date) )
            .y( (d: any) => this.y[i](d.value[i] ) )
        );
        this.svg.append('path')
            .datum(data1)
            .attr('class', 'line')
            .attr('stroke', '#007bff')
            .attr('stroke-width', '1.5px')
            .attr('transform', 'translate(0,' + (this.heightC - this.subHeightC * (i + 1 )  ) + ')')
            .attr('d', this.line[i]);
        }
  }

}
