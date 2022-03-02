import * as d3 from "d3";
import './linechart.css'; 
import React, { useState } from "react";
import { useRef, useEffect } from "react";
import RefreshIcon from "../assets/refresh.png";

/***
 * @param settings: width, height, margin for the plot 
 * @param data: data used to draw, format: [{xVal: ... , yVal: ... }, ...]
 * @param customized: customized settings [startColor, endColor, numberofTicks, id]
 * @return svg node, line chart draw
 */
export const LineChart = ({settings, data, customized, handleEndBrush, reset}) => {

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
        .attr('stroke', p => gradientColor(p))
        .attr("stroke-width", '.15vw')

  }, [])

  const rangeId = "rangetip".concat(customized[3])
  /************* brush over line chart, would update if other filters change ************/ 
  useEffect(() => {
    // tool tip
    const tooltip = d3.select("#".concat(rangeId))
    .attr("class", "rangetip")


    const svgElement = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height)
    const brush = svgElement.append("g").attr("class", "brush".concat(rangeId))


    brush.call( 
      d3.brushX()  
        .extent( [ [0,0], [width,drawHeight] ] )
        .on("start brush", handleOnBrush)     
        .on("end", (event) => {
          if (event.selection) {
            handleEndBrush(convertToXVal(event.selection[0]).toFixed(1), convertToXVal(event.selection[1]).toFixed(1))
          }
        }) 
    )

    function handleOnBrush(event) {
      brush.style("opacity", 1)
      const selection = event.selection
      let xStart = convertToXVal(selection[0]).toFixed(1)
      let xEnd = convertToXVal(selection[1]).toFixed(1)
      tooltip.style('transform', `translate(${selection[1]}px, ${drawHeight/2}px)`).style("opacity", 1).text(`(${xStart}, ${xEnd})`)
    }

    function convertToXVal(number) {
      const [xMin, xMax] = d3.extent(data, d => d.xVal);
      let res = number / drawWidth * (xMax - xMin) + xMin
      return Number(res)
    }

  }, [])
  const handleOnRefresh = () => {
    d3.select("#".concat(rangeId)).style("opacity", 0)
    d3.select(".brush".concat(rangeId)).style("opacity", 0)
    handleEndBrush(-1,-1)
  }
  useEffect(() => {
    if (reset) handleOnRefresh()
  }, [reset]) 
  return (
    <>    
      <div id={rangeId}></div>
      <div className="flex">
        <svg ref = {ref}/>
        <img onClick={handleOnRefresh} className="h-full self-center ml-1" src={RefreshIcon} style={{ width: '8%' }} />     
      </div>
    </>

  )
}

