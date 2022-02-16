import * as d3 from "d3";
import React from "react";
import { useRef, useEffect } from "react";

export const ScatterPlot = ({settings, rawData}) => {
  // Chart width and height - accounting for margins
  const {width, height, margin, radius, color, xVar, yVar} = settings;
  let drawWidth = width - margin.left - margin.right;
  let drawHeight = height - margin.top - margin.bottom;
  // Prepare data
  let data = rawData.map((item) => {
    return {
      x: +item[xVar.idx],
      y: +item[yVar.idx],
      label: +item[1] // anime name
    }
  })

  const ref = useRef();
  useEffect(() => {
    /**
     * Draw the x y axis 
     */
    // current ref is svg, as return <svg />, no need to .append('svg')
    const svgElement = d3.select(ref.current)
        .attr('width', width)
        .attr('height', height)
        .style("border", "1px solid black")
    // define scale 
    let xMax = d3.max(data, (d) => d.x);
    let xMin = d3.min(data, (d) => d.x);
    let xScale = d3.scaleLinear()
        .range([0, drawWidth])
        .domain([xMin, xMax]);
  
    let yMax = d3.max(data, (d) => d.y);
    let yMin = d3.min(data, (d) => d.y);
  
    let yScale = d3.scaleLinear()
        .range([0, drawHeight])
        .domain([yMax, yMin]); // reverse to make the y begins at the origin
  
    // define axis 
    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);
  
    // render the axis
    svgElement.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + (drawHeight + margin.top) + ')')
        .attr('class', 'axis')
        .call(xAxis);
    svgElement.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')
        .attr('class', 'axis')
        .call(yAxis);
    // render text of title, axis label
    svgElement.append('text')
        .attr('transform', `translate(${drawWidth/2},15)`)
        .text("Test ScatterPlot");

    svgElement.append('text')
        .attr('transform', `translate(${(drawWidth / 2)}, ${(height - margin.bottom + 40)})`)
        .attr('class', 'axis-label')
        .text(xVar.name);

    svgElement.append('text')
        .attr('transform', `translate( ${(margin.left - 30)},${(margin.top + drawHeight / 2)}) rotate(-90)`)
        .attr('class', 'axis-label')
        .text(yVar.name);
    

    // tool tip


    /**
     * Draw the circles 
     */
    let gElement = svgElement.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('height', drawHeight)
        .attr('width', drawWidth);
    // assign data
    let circles = gElement.selectAll('circle').data(data);

    circles.enter().append('circle')
        .attr('r', (d) => radius)
        .attr('fill', (d) => color)
        .attr('label', (d) => d.label)
        .style('fill-opacity', 0.3)
        .merge(circles)
        .transition().duration(500)
        .attr('cx', (d) => xScale(d.x))
        .attr('cy', (d) => yScale(d.y));
    circles.exit().remove();

  }, []);



  return (
      <svg 
        ref = {ref}
      />
  )

}
