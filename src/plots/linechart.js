import * as d3 from "d3";
import './linechart.css'; 
import React from "react";
import { useRef, useEffect } from "react";

/***
 * @param settings: width, height, margin for the plot 
 * @param data: data used to draw, format: [{xVal: ... , yVal: ... }, ...]
 * @param customized: customized settings [startColor, endColor, numberofTicks]
 * @return svg node, line chart draw
 */
export const LineChart = ({settings, data, customized}) => {

  const {width, height, margin} = settings;

  let drawWidth = width - margin.left - margin.right;
  let drawHeight = height - margin.top - margin.bottom;

  const ref = useRef();
  /******* Line Chart, only draw once *********/
  useEffect(() => {
    const svgElement = d3.select(ref.current)
    .attr('width', width)
    .attr('height', height)
    // x, y value 
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.xVal))
        .range([0, drawWidth])
    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.yVal).reverse()) // reverse() to make the y begins at the origin
        .range([0, drawHeight])

    // render the axis
    const xAxis = d3.axisBottom(x).ticks(customized[2])
    svgElement.append('g')
        .attr('transform', 'translate(' + margin.left + ',' +  (drawHeight + margin.top) + ')')
        .attr('class', 'axisStyle')
        .call(xAxis);
    
    // create data used to draw 
    var newdata = data.map( (p, index) => index === data.length - 1 ? [p] : [p, data[index+1]]);
    // define the color  
    var bounds = d3.extent(data, d => d.xVal);
    var interval = bounds[1] - bounds[0];
    var gradientColor = (p) => {
      return d3.interpolateHslLong(customized[0], customized[1])((p[0].xVal-bounds[0])/interval);
    };
    // draw the line 
    var newline = d3.line()
        .defined(d => !isNaN(d.yVal))
        .x(d => x(d.xVal))
        .y(d => y(d.yVal));
    let gElement = svgElement.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('height', height)
        .attr('width', width);
    gElement.selectAll('path')
         .data(newdata)
         .enter().append('path')
         .attr('d', p => newline(p))
         .attr('stroke', p => gradientColor(p)); 

  }, [])

  /************* brush over line chart, would update if other filters change ************/ 
  useEffect(() => {
    const svgElement = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height)
    const brush = svgElement.append("g")

    brush.call( 
          d3.brushX()  
            .extent( [ [0,0], [width,drawHeight] ] )
            .on("start brush", updateChart)       
          )
    function updateChart(event){
      const selection = event.selection
      convertToXVal(selection[0])
      console.log(convertToXVal(selection[0]), convertToXVal(selection[1]))
    }
    function convertToXVal(number) {
      const xMax = d3.max(data, d => d.xVal)
      return number / drawWidth * xMax
    }

  }, [])
  return (
    <svg ref={ref}/>
  )
}

