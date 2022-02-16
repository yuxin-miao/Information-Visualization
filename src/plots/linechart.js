import * as d3 from "d3";
import './linechart.css'; 
import React from "react";
import { useRef, useEffect } from "react";

export const LineChart = ({settings, data}) => {

  const {width, height, margin} = settings;

  let drawWidth = width - margin.left - margin.right;
  let drawHeight = height - margin.top - margin.bottom;

  // const data = [
  //   {xVal: 1, yVal: 93.24},
  //   {xVal: 2, yVal: 95.35},
  //   {xVal: 3, yVal: 96},
  //   {xVal: 4, yVal: 98.35},
  //   {xVal: 5, yVal: 90.35},
  //   {xVal: 6, yVal: 99.35},]

  const ref = useRef();
  useEffect(() => {
    // select svg element 
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
    const xAxis = d3.axisBottom(x)
    svgElement.append('g')
        .attr('transform', 'translate(' + margin.left + ',' +  (drawHeight + margin.top) + ')')
        .attr('class', 'axisStyle')
        .call(xAxis);
    // create data used to draw 
    var newdata = data.map( (p, index) => index === data.length - 1 ? [p] : [p, data[index+1]]);
    // define the color  
    var bounds = d3.extent(data, d => d.xVal);
    var interval = bounds[1]-bounds[0];
    var gradientColor = (p) => {
      return d3.interpolateHslLong("red", "blue")((p[0].xVal-bounds[0])/interval);
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
  return (
    <svg ref={ref}/>
  )
}