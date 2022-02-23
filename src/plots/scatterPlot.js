import * as d3 from "d3";
import React from "react";
import { useRef, useEffect } from "react";
import { Main,refreshInfo } from "../components/main";
import './scatterPlot.css';
import { _interpolateColor,h2r,r2h } from "../utils/colorUtils";

export const ScatterPlot = ({settings, displayData, infoDispatch}) => {
  // Chart width and height - accounting for margins
  const {width, height, margin, radius, color, xVar, yVar} = settings;
  let drawWidth = width - margin.left - margin.right;
  let drawHeight = height - margin.top - margin.bottom;
  // Prepare data
  let data = displayData.map((item) => {
    return {
      x: +item[xVar.idx],
      y: +item[yVar.idx],
      label: item[1], // anime name
      description: item[11],
      rating: item[8],
      type: item[3],
      season: item[6],
      releaseYear: item[9],
      studio: item[5],
      rank: item[0]
    }
  })
  //console.log(data);
  const ref = useRef();
  useEffect(() => {
    /**
     * Draw the x y axis 
     */
    // current ref is svg, as return <svg />, no need to .append('svg')
    const svgElement = d3.select(ref.current)
        .attr('width', width)
        .attr('height', height)
        .style("background-color", '#010033')
    svgElement.selectAll("*").remove();

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
        .attr('class', 'axis-style')
        .call(xAxis);
    svgElement.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')
        .attr('class', 'axis-style')
        .call(yAxis);
    // render axis label
    svgElement.append('text')
        .attr('transform', `translate(${(drawWidth / 2)}, ${(height - margin.bottom + window.innerHeight * 0.05)})`)
        .attr('class', 'axis-label')
        .style('fill', 'white')
        .text(xVar.name);

    svgElement.append('text')
        .attr('transform', `translate( ${(margin.left - window.innerWidth * 0.025)},${(margin.top + drawHeight / 2)}) rotate(-90)`)
        .attr('class', 'axis-label')
        .style('fill', 'white')
        .text(yVar.name);
    
    // tool tip
    const tooltip = d3.select('#tooltip')
        .attr("class", "tooltip")

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
        .attr('fill', function(d){//color interpolation
           //console.log(_interpolateColor([0.5,1,0],[1,1,0],0.5))
           var interpolationFactor=(d.rating-1)<0?0:(d.rating-1)/4;
           return r2h(_interpolateColor(h2r("#40e0d0"),h2r("#ff0080"),interpolationFactor)) 
        })
        .attr('label', (d)=>d.label)
        .style('fill-opacity', 1)
        .merge(circles)
        .attr('cx', (d) => xScale(d.x))
        .attr('cy', (d) => yScale(d.y))
        .on("click", function(d) {
        //alert("on click get data" + d3.select(this).attr("label"));
            refreshInfo(d.srcElement.__data__, infoDispatch)
            d3.select(this).attr("stroke","white").attr("stroke-width",2)

        //Main.refreshInfo(d3.select(this).attr("label"));
        //console.log(Main);
        
        //console.log(d3.select(this).attr("label"));
        })        
        .on("mouseover", function(event, d){
            const posX = d3.select(this).attr("cx")
            const posY = d3.select(this).attr("cy")
            tooltip.style('transform', `translate(${posX}px, ${posY}px)`).style("opacity", 1).text(`${d.label}(${d.x}, ${d.y})`)
            d3.select(this).attr("stroke","white").attr("stroke-width",1)
        }).on("mouseout", function(d){
            d3.select(this).attr("stroke", "none")
            tooltip.style('opacity', 0)
        });

    circles.transition().duration(500);
    circles.exit().remove();

  },[displayData]);



  return (
    <>    
        <div id="tooltip"></div>
        <svg ref = {ref}/>
    </>

  )

}