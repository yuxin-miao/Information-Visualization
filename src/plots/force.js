import * as d3 from "d3";
import React from "react";
import { useRef, useEffect } from "react";


export const ForceGraph = ({nodes, settings, clicked}) => {

  const ref = useRef()
  const {width, height} = settings;
  // color defined for the graph 
  const color = {
    "0": "#FF60D2",
    "1": "#6E60FF",
    "2": "#850606",
    "3": "#60C7FF",
    "4": "#8ADF45",

    "5": "#FFA69D",
    "6": "#FF6060",
    "7": "#9060FF",
    "8": "#4CD7DD",
    "9": "#FF4040",

    "10": "#D9742F",
    "11": "#2F75F8",
    "12": "#2FF8A1",
    "13": "#2F55F8",
    "14": "#9D2FF8",
    "15": "#DEDE45"
  };



  useEffect(() => {
      let links = [];
      for (var i = 0; i <= nodes.length-2; i++) {
        links.push({"source": 0, "target": 1+i});
      }
    let ticked = function () {
        lines.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
  
        circles.attr('cx', d => d.x)
            .attr('cy', d => d.y)
  
        text.attr('x', d => d.x)
            .attr('y', d => d.y)
    }
    const svgElement = d3.select(ref.current)
        .attr('width', width)
        .attr('height', height)
    svgElement.selectAll("*").remove();

    const simulation = d3.forceSimulation(nodes)
        .force('manyBody', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force("link", d3.forceLink(links).strength(1).distance(80))
        .force("collision", d3.forceCollide().radius(30))
        .on('tick', ticked)

    const defs = svgElement.append("defs")
    for (var nodeNum = 0; nodeNum < nodes.length; nodeNum++){
      var linearGradient = defs 
          .append("linearGradient")
          .attr("id", "gradient"+nodeNum)
          .attr("x1","0%")
          .attr("y1","0%")
          .attr("x2","100%")
          .attr("y2","0%");

      linearGradient
          .append("stop")
          .attr("offset", "0%") 
          .attr("stop-color", function(d) { return color[Math.floor(Math.random() * 16)]; })
      linearGradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", function(d) { return color[Math.floor(Math.random() * 16)]; });
    }

    // drag function used to 
    const drag = d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded);
    function dragStarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        // PosX = d.x
        // PosY = d.y
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragEnded(event, d) {
    
        if (!event.active) simulation.alphaTarget(0);
        d.fx = undefined;
        d.fy = undefined;
    }

    // render the graph 
    let lines = svgElement.selectAll('path').data(links).join('line')
      .attr('stroke', '#00BEDB')
      .attr('stroke-width', '1px')
      .attr('opacity', 0.7)

    let elementGroup = svgElement.selectAll(".elementGroup").data(nodes).join('g')

    var ur = '#gradient1'
    let circles = elementGroup.append('circle')
        .attr("r", function(d) { 
          
          if(d.type === 'main')return 15+20; else if(d.type === 'related') return 15+8; else return 5;})
        .style("fill", d=> {return "url(#gradient" + Math.floor(Math.random() * 10) + ")"})
        .style("opacity",function(d) { if(d.type === 'main')return 1; else if(d.type === 'related') return 1; else return 0})
        .on("click", function(event, d) {
          if (event.defaultPrevented) return;
          if(d.type === 'related') {
            clicked(d.name)
          }
        })

    circles.call(drag)
        
    let text = svgElement.selectAll(".textGroup").data(nodes).enter()
        .append('text')
        .attr('class', 'text1')
        .attr('font-size', function(d) { if(d.type === 'main')return '0.7em'; else if(d.type === 'related') return '0.4em'; else return '0.5em'})
        .attr('text-anchor', 'middle') 
        .text(d=>d.name)
        .style('opacity',function(d) { if(d.type === 'main')return 1; else if(d.type === 'related') return 0.7; else return 1})
        .attr('fill',function(d) { if(d.type === 'tag') return color[Math.floor(Math.random() * 16)] ; else return 'white'})
        .call(drag)

  }, [nodes])
  return (
    <svg ref={ref}></svg>
  )
}