import { Component, ViewEncapsulation, OnInit, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { Store }                             from '@ngrx/store';

import { seriesState, seriesStateActions }   from '../../_core/store/series.actions';
import { filtersState, filtersStateActions } from '../../_core/store/filters.actions';
// Services
// import { SeriesService }                     from '../../_core/services/series.service';
import { FiltersService }                    from '../../_core/services/filters.service';

import * as d3 from 'd3'

import { transition } from 'd3-transition';
// import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

import { data } from '../../_core/data';

@Component({
  selector: 'charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

    private margin = {top: 20, right: 20, bottom: 30, left: 50};
    private widthC: number;
    private heightC: number;
    private subHeightC: number;
    private x: any;
    private y: any;
    private svg: any;
    private width: number;
    private height: number = 800;
    private line: any = [];
    private dots: any = [];

    private totalSeries: number;

    private filtersState$;
    private seriesState$;

    private charts$;
    private charts;
    
    private initChart = true;

    private firstValue$;
    private firstValue;

    private delta: number = 20; 

    private mouseOverTooltip = false;

    someRange = [0,15]
    
    someRange2config: any = {
    behaviour: 'drag',
    connect: true,
    range: {
    'min': [0, 1],
    '25%': [1,1],
    '50%': [2,1],
    '75%': [3,1],
    'max': [4,1]
    },
    pips: {
      mode: 'range',
      format: {
      to: function(a){
      var pipFormats = {'0':'', '1':'', '2':'', '3':'', '4':''};
      return pipFormats[a];
      }
      }
    }
  };

    @ViewChild('stackedlinechart') stackedlinechart;

    private colors = ['#9C6ADE', '#ffab60', '#47C1BF', '#fa365c', '#074e8a', '#0fabf9', '#ffe93c', '#da00d1','#9C6ADE', '#ffab60', '#47C1BF', '#fa365c', '#074e8a', '#0fabf9', '#ffe93c', '#da00d1','#9C6ADE', '#ffab60', '#47C1BF', '#fa365c', '#074e8a', '#0fabf9', '#ffe93c', '#da00d1'];

    private valuesTooltip = {title: 'Flotation', date: '', data:[]};

    private pages$
    private pages
               

  constructor(
    private store: Store<seriesState | filtersState>,
    // private seriesService: SeriesService
  ) {


    this.filtersState$ = this.store.select('filters');
    this.seriesState$  = this.store.select('series');

    this.charts$       = this.seriesState$ .map(state => state.charts);
    this.firstValue$ = this.seriesState$.map(state => state.firstValues);
    this.pages$ = this.filtersState$.map(state => state.pages);
  }

  ngOnInit() {
    console.log(data)
    this.pages$.subscribe(pages => this.pages = pages);
    this.firstValue$.subscribe(firstValue => this.firstValue = firstValue);
    this.charts$.subscribe(charts => this.setCharts(charts));
  
  }


  setCharts(charts) {
    this.width = this.stackedlinechart.nativeElement.getBoundingClientRect().width;
    this.height = this.stackedlinechart.nativeElement.getBoundingClientRect().height;
    this.widthC = this.width - this.margin.left - this.margin.right;
    this.heightC = this.height - this.margin.top - this.margin.bottom;
    if (this.firstValue){
      const firstData = this.firstData();
      this.charts = [];
      this.charts.push({ title: 'Tph', legend: ['Tph'], data: firstData });
    }else{

      charts.forEach((chart) => {
        let data = chart.data;
        let newData = [];
        data.forEach((d, i) => {
          let newValues = [];
          d.values.forEach((val, j) => {
            if( isNaN(val) || !isFinite(val) ){
              if (i === 0){
                newValues.push(0)
              }else{
                newValues.push(newData[i-1].values[j])
              }              
            }else{
              newValues.push(val)
            }  
          });
          newData.push({date: d.date, values: newValues })
        });
        chart.data = newData;
      })
      this.charts = charts;
      
    }
    
    
    d3.select('#stacked-line-chart').selectAll("*").remove();
    if(this.charts.length === 0) return
    this.initSvg();
    // Axis X
    this.initAxisX();
    this.drawAxisX();
    // Axis Y
    this.initAxisY();
    this.drawAxisY();
    this.dropShadow();
    this.drawLine();
    
  }
  
  firstData(){
    const _data = data.filter(d => d.Scenario === 'Plant (PI)' && d.Name === 'TPH' && d.Location === 'LT2');
    return _data.map(d => { return {date: d.Date, values: [Number(d.Value)] } })
  }

  initSvg() {

      this.totalSeries = this.charts.length;
      this.subHeightC = this.heightC/this.totalSeries;

      this.svg = d3.select('#stacked-line-chart')
          .append('svg')
          .attr('width', this.width)
          .attr('height', this.height)
          .append('g')
          .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
      
    

  }

  initAxisX(){
    this.x = d3Scale.scaleTime().range([0, this.widthC]);
    const domain = d3Array.extent(this.charts[0].data, (d) => new Date(d.date) );
    this.someRange2config = {
    behaviour: 'drag',
    connect: true,
    range: {
    'min': 0,
    'max': 4
    },
    pips: {
      mode: 'range',
      format: {
      to: function(a){
      const init = domain[0].toDateString().split(' ')[1] + ' ' + domain[0].toDateString().split(' ')[2] + ' ' + domain[0].toDateString().split(' ')[3];
      const last = domain[1].toDateString().split(' ')[1] + ' ' + domain[1].toDateString().split(' ')[2] + ' ' + domain[1].toDateString().split(' ')[3];
      var pipFormats = {'0': init, '1':'', '2':'', '3':'', '4':last };
      return pipFormats[a];
      }
      }
    }
  };
  
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
          .attr('transform', 'translate(0,' + (this.heightC - this.subHeightC * ( i + 1 ) ) + ')')
          .call(d3Axis.axisLeft(this.y[i]))
          .append('text')
          .attr('class', 'axis-title')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')  
          .text(this.charts[i].title);

    
      this.svg.append("g")			
      .attr("class", "grid")
      .attr('transform', 'translate(0,' + (this.heightC - this.subHeightC * ( i + 1 ) ) + ')')
      .call(d3Axis.axisLeft(this.y[i])
          .tickSize(-this.widthC)
          .tickFormat("")
      )
    
    }
    
  }

  closest (num, arr) {
      var curr = arr[0];
      var diff = Math.abs (num - curr);
      for (var val = 0; val < arr.length; val++) {
          var newdiff = Math.abs (num - arr[val]);
          if (newdiff < diff) {
              diff = newdiff;
              curr = arr[val];
          }
      }
      return curr;
  }

 drawLine() {
      this.line = [];
      this.dots = [];
      var eventCapture = this.svg.append("rect")
          .attr('width', this.width)
          .attr('height', this.height)
          .style('fill', 'transparent')
          .on("mousemove", (e) => {
                var xy = d3.mouse(eventCapture.node())
                let date = this.x.invert(xy[0]) 
            
                let dateIndex = this.charts[0].data.findIndex(d => date < new Date(d.date));
                if (this.charts[0].data.length < dateIndex) dateIndex = this.charts[0].data.length
                if (dateIndex === -1) return 
                date = new Date(this.charts[0].data[dateIndex].date);
        
                const widthLine = 1;
                const verticalLineRemove = this.svg.selectAll('.vertical-line-tooltip')
                verticalLineRemove.transition().duration(50).style('opacity', 0).remove();
                
                const verticalLine = this.svg
                  .insert('rect')
                  .classed('vertical-line-tooltip', true)
                  .classed('bar', true)
                  .attr('width', widthLine)
                  .attr("x", this.x(date) - widthLine/2)
                  .attr("y", -10)
                  .attr("height", this.height - this.margin.top - this.margin.bottom + 10 )
                  .style("fill", "#ababab")
                  .style('opacity', 0.7)
                
                                
                // Tooltip
                const leftMargin = verticalLine._groups[0][0].getBoundingClientRect().left - document.getElementById('stacked-line-chart').getBoundingClientRect().left + this.margin.left/2 - 10;
                d3.selectAll('.tooltip')
                  .transition()
                  .duration(50)
                  .style('opacity', 1)
                  .style('display', 'block')
                  .style('position', 'absolute')
                  .style('filter', function() { return  'url(#drop-shadow)'; })
                  .style('left', `${( leftMargin )}px`);
            
                this.valuesTooltip.date = date;
                this.valuesTooltip.data = [];
                let lineCount = 0;
                this.charts.forEach((chart, cId) => {
                  const values = chart.data[dateIndex].values;
                  chart.legend.forEach((legend, lId) => {
                    this.valuesTooltip.data.push({id: cId.toString() + '-' + lId.toString(), color: chart.colors[lId], legend: chart.title + ' - ' + legend, value: Math.round(values[lId]*100)/100 })
                    lineCount++;
                  })
                });
          })
          .on("mouseout", (e) => {
              setTimeout(() => {
              if (this.mouseOverTooltip) return
                 d3.selectAll('.tooltip')
                  .transition()
                  .duration(50)
                  .style('opacity', 0)
                  .style('display', 'none')
            
                const verticalLine = this.svg.selectAll('.vertical-line-tooltip')
                verticalLine.transition().duration(50).style('opacity', 0).remove();
            
                this.valuesTooltip.date = '';
                this.valuesTooltip.data = [];
                this.mouseOverTooltip = false;
              }, 100)
          })

      for(let i= 0; i < this.totalSeries; i ++){
        this.charts[i].colors = [];

        const subSeries = this.charts[i].legend.length;
        
        for (let zz = 0; zz < subSeries; zz++){
          const line = d3Shape.line()
              .x( (d: any) => this.x(new Date(d.date)) )
              .y( (d: any) => this.y[i](d.values[zz] ) );

          const color = this.colors[zz];
          this.charts[i].colors.push(color);
          const id = i.toString() + '-' + zz;
          this.line.push(line);
          this.svg.append('path')
              .datum(this.charts[i].data)
              .attr('class', 'time line')
              .attr('id', 'line-'+id)
              .attr('stroke', color)
              .attr('stroke-width', '1px')
              .attr('transform', 'translate(0,' + (this.heightC - this.subHeightC * (i + 1 )  ) + ')')
              .attr('d', line)
              .style('filter', function() { return  'url(#drop-shadow)'; })
              .style('opacity', 1)
              .on('mouseover', (dd, ii, ee) => this.mouseOverLineIn(dd, ii, ee))
              .on('mouseout', (dd, ii, ee) => this.mouseOverLineOut(dd, ii, ee))

          const dots = this.svg.selectAll('.dots')
              .data(this.charts[i].data)
              .enter().append('circle')
              .attr('class', 'dot-times')
              .attr('id', 'dot-'+id)
              .style('stroke', 'white')
              // .attr('stroke-width', 1)
              .attr('r',3)
              .style('fill', color)
              .attr('cx', (d: any) => this.x(new Date(d.date)))
              .attr('cy', (d: any) => this.y[i](d.values[zz] ))
              .attr('transform', 'translate(0,' + (this.heightC - this.subHeightC * (i + 1 )  ) + ')')
              // .style('filter', function() { return  'url(#drop-shadow)'; })
              .on('mouseover', (dd, ii, ee) => this.drawTooltip(dd, ii, ee, id))
              .on('mouseout', (dd, ii, ee) => this.hideTooltip(dd, ii, ee, id) )


          this.dots.push(dots);

          

        }
      }
  }

    
  mouseEnterTooltip(){
    this.mouseOverTooltip = true;
  }


  mouseLeaveTooltip(){
    d3.selectAll('.tooltip')
      .transition()
      .duration(50)
      .style('opacity', 0)
      .style('display', 'none')

    const verticalLine = this.svg.selectAll('.vertical-line-tooltip')
    verticalLine.transition().duration(50).style('opacity', 0).remove();

    this.valuesTooltip.date = '';
    this.valuesTooltip.data = [];
    this.mouseOverTooltip = false;
  }

  mouseOverLineIn(d, i, e){
    this.opacityAllLines(0.3);
    const id = e[0].id.split('line-')[1];
    this.opacityAllDots(0.3)
    d3.selectAll("#dot-"+id).style("opacity", 1);
    d3.selectAll(e).style("opacity", 1);
  }

  mouseOverLineOut(d, i, e){
    this.opacityAllLines(1);
    this.opacityAllDots(1);
  }


  drawTooltip(d, i, e, id){
    let lineSelected = d3.selectAll('#line-'+ id);
    let dotSelected  = d3.selectAll('#dot-' + id);
    const chartIndex = id.split('-')[0];
    const lineIndex  = id.split('-')[1];
    const val        = new Date(d.date);

    // opacity lines
    this.opacityAllLines(0.3);
    this.opacityAllDots(0.3);
    lineSelected.style("opacity", 1);
    dotSelected.style("opacity", 1);
    // draw Vertical Line
    const widthLine = 1;
    const verticalLine = this.svg
      .insert('rect')
      .classed('vertical-line-tooltip', true)
      .classed('bar', true)
      .attr('width', widthLine)
      .attr("x", this.x(val) - widthLine/2)
      .attr("y", -10)
      .attr("height", this.height - this.margin.top - this.margin.bottom + 10 )
      .style("fill", "#ababab")
      .style('opacity', 0.7)

    // Tooltip
    const leftMargin = verticalLine._groups[0][0].getBoundingClientRect().left - document.getElementById('stacked-line-chart').getBoundingClientRect().left + this.margin.left/2 - 10;
    d3.selectAll('.tooltip')
      .transition()
      .duration(50)
      .style('opacity', 1)
      .style('display', 'block')
      .style('position', 'absolute')
      .style('filter', function() { return  'url(#drop-shadow)'; })
      .style('left', `${( leftMargin )}px`);

    this.valuesTooltip.date = d.date;
    this.valuesTooltip.data = [];
    let lineCount = 0;
    this.charts.forEach((chart, cId) => {
      const values = chart.data.find(data => data.date === d.date).values;
      chart.legend.forEach((legend, lId) => {
        this.valuesTooltip.data.push({id: cId.toString() + '-' + lId.toString(), color: chart.colors[lId], legend: chart.title + ' - ' + legend, value: Math.round(values[lId]*100)/100 })
        lineCount++;
      })
    });
  }

  hideTooltip(d, i, e, id){
    this.opacityAllLines(1);
    this.opacityAllDots(1);
    d3.selectAll('.tooltip')
      .transition()
      .duration(50)
      .style('opacity', 0)
      .style('display', 'none')

    const verticalLine = this.svg.selectAll('.vertical-line-tooltip')
    verticalLine.transition().duration(50).style('opacity', 0).remove();

    this.valuesTooltip.date = '';
    this.valuesTooltip.data = [];

  }

  opacityAllLines(opacity){
    this.svg.selectAll('.time.line').each((dd, ii, ee) => {
         d3.selectAll(ee).style("opacity", opacity);
    })
  }

  opacityAllDots(opacity){
    this.svg.selectAll('.dot-times').each((dd, ii, ee) => {
         d3.selectAll(ee).style("opacity", opacity);
    })
  }

  dropShadow() {
    let defs = this.svg.append('defs');
    let stdDeviation = 1;

    // create filter with id #drop-shadow
    // height=130% so that the shadow is not clipped
    // filterUnits=userSpaceOnUse so that straight lines are also visible
    let filter = defs.append('filter')
        .attr('id', 'drop-shadow')
        .attr('height', '130%')
        .attr('filterUnits', 'userSpaceOnUse');

    // SourceAlpha refers to opacity of graphic that this filter will be applied to
    // convolve that with a Gaussian with stdDeviation (3px) and store result
    // in blur
    filter.append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('stdDeviation', stdDeviation)
        .attr('result', 'blur');

    // translate output of Gaussian blur to the right and downwards with stdDeviation
    // store result in offsetBlur
    filter.append('feOffset')
        .attr('in', 'blur')
        .attr('dx', 1)
        .attr('dy', 1)
        .attr('result', 'offsetBlur');

        filter.append('feFlood')
    .attr('in', 'offsetBlur')
    .attr('flood-color', '#18181c')
    .attr('flood-opacity', '0.2')
    .attr('result', 'offsetColor');

    filter.append('feComposite')
    .attr('in', 'offsetColor')
    .attr('in2', 'offsetBlur')
    .attr('operator', 'in')
    .attr('result', 'offsetBlur');

    // overlay original SourceGraphic over translated blurred opacity by using
    // feMerge filter. Order of specifying inputs is important!
    let feMerge = filter.append('feMerge');

    feMerge.append('feMergeNode')
        .attr('in', 'offsetBlur');
    feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic');
  }

}
