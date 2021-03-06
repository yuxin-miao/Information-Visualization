import * as d3 from "d3";
import React from "react";
import { useRef, useEffect } from "react";
import { Main,refreshInfo } from "../components/main";
import './scatterPlot.css';
import { _interpolateColor,h2r,r2h } from "../utils/colorUtils";
import colorLegend from "../assets/colorLegend.png";
import refreshIcon from "../assets/refresh.png";

export const ScatterPlot = ({settings, displayData, infoDispatch, highlight, setRelatedAnime}) => {
  // Chart width and height - accounting for margins
  const {width, height, margin, radius, color, xVar, yVar} = settings;
  let widthScale = 0.005
  let drawWidth = width - margin.left - margin.right - (window.innerWidth * widthScale);
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
      rank: item[0],
      voiceActors: item[15],
      staff: item[16],
      posterUrl:item[17],
      userStat:item[18],
      tags:item[7]
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
    let xAxis = d3.axisBottom(xScale).tickFormat(formatPower);
    let yAxis = d3.axisLeft(yScale).tickFormat(formatPower);
  

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svgElement.append("defs").append("SVG:clipPath")
    .attr("id", "clip")
    .append("SVG:rect")
    .attr("width", drawWidth )
    .attr("height", drawHeight )
    .attr("x", 0)
    .attr("y", 0);

    

    function formatPower(x) {
        if (x > 4999 || x < -4999) 
            return `${x/1000}k`
        else return x
    }

    // render the axis
    var gx=svgElement.append('g')
        .attr('transform', 'translate(' + (margin.left + (window.innerWidth * widthScale)) + ',' + (drawHeight + margin.top) + ')')
        .attr('class', 'axis-style')
        .call(xAxis);
    var gy=svgElement.append('g')
        .attr('transform', 'translate(' + (margin.left + (window.innerWidth * widthScale)) + ',' + (margin.top) + ')')
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
    svgElement.append('image')
        .attr("href", colorLegend)
        .attr('transform', `translate( ${(drawWidth*0.91)},${(height - margin.bottom + window.innerHeight * 0.032)})`)
        .attr('width', drawWidth*0.16)
    var zoom = d3.zoom()
        .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
        .extent([[0, 0], [width, height]])
        .on("zoom", updateChart);
    svgElement.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom);
    function updateChart(event) {
        // recover the new scale
        var newX = event.transform.rescaleX(xScale);
        var newY = event.transform.rescaleY(yScale);
        
        // update axes with these new boundaries
        gx.call(d3.axisBottom(newX).tickFormat(formatPower))
        gy.call(d3.axisLeft(newY).tickFormat(formatPower))
    

        // update circle position
        gElement
            .selectAll("circle")
            .attr('cx', function(d) {return newX(d.x)})
            .attr('cy', function(d) {return newY(d.y)});
    }
    // tool tip
    const zoomResetBtn = d3.select('#zoom-reset-button')

    zoomResetBtn.on('click', function(d) {
        svgElement.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity);
    })
    .on("mouseover", function(event, d){
        tooltip.style('transform', `translate(${drawWidth - margin.right}px, ${margin.top - window.innerHeight * 0.01}px)`).style("opacity", 1).text("Reset zoom scale")
    }).on("mouseout", function(d){
        tooltip.style('opacity', 0)
    });

    
    // tool tip
    const tooltip = d3.select('#tooltip')
        .attr("class", "tooltip")

    /**
     * Draw the circles 
     */
    let gElement = svgElement.append('g')
        .attr('transform', 'translate(' + (margin.left + (window.innerWidth * widthScale)) + ',' + margin.top + ')')
        .attr('height', drawHeight)
        .attr('width', drawWidth)
        .attr("clip-path", "url(#clip)");
    // assign data
    let circles = gElement.selectAll('circle').data(data);

    circles.enter().append('circle')
        .attr('r', (d) => radius)
        .attr('fill', function(d){//color interpolation
           var interpolationFactor=(d.rating-1)<0?0:(d.rating-1)/4;
           var color2 = d3.scaleLinear()
           .domain([0, 0.5, 1])
           .range(['#40e0d0', '#ff8c00', '#ff0080'])
           .interpolate(d3.interpolateHcl);
           return color2(interpolationFactor)            
        })
        .attr('label', (d)=>d.label)
        .style('opacity', 0.4)
        .merge(circles)
        .attr('cx', (d) => xScale(d.x))
        .attr('cy', (d) => yScale(d.y))
        .attr("class", function(d) {
            for (let idx = 0; idx < highlight.length; idx++) {
                if (d.label === highlight[idx]) {
                    return "highlight-attr"
                }
              }
            return ''

        })
        .on("click", function(d) {
            refreshInfo(d.srcElement.__data__, infoDispatch)
            d3.select(this).attr("stroke","white").attr("stroke-width",2)
            setRelatedAnime(d3.select(this).attr("label"))
        })        
        .on("mouseover", function(event, d){
            const posX = d3.select(this).attr("cx")
            const posY = d3.select(this).attr("cy")
            tooltip.style('transform', `translate(${posX}px, ${posY}px)`).style("opacity", 1).text(`${d.label}(${d.x}, ${d.y})`)
            d3.select(this).attr("stroke","white").attr("stroke-width", 1).style("opacity", 1)
        }).on("mouseout", function(d){
            d3.select(this).attr("stroke", "none").style("opacity", .4)
            tooltip.style('opacity', 0)
        });

    circles.transition().duration(500);
    circles.exit().remove();

  },[displayData, highlight, settings]);




  return (
    <>    
        <div id="zoom-reset-button" className="absolute zoom-reset-button"><img src={refreshIcon} alt='' style={{ width: '1.2vw'}}></img></div>
        <div id="tooltip"></div>
        <svg ref = {ref}/>
    </>

  )

}