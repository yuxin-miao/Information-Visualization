import React from "react";
import './index.css';
import * as d3 from "d3";
import { useRef, useEffect, useSpring, useState, useMemo } from "react";
import {useInterval} from '../../utils/useInterval';

import { ScatterPlot } from '../../plots/scatterPlot';
import { parseData } from "../../utils/fetchData";

export const Main = () => {
  //setup for the scatter plot 
  const settings = {
    width: 850,
    height: 500,
    margin: {
      top: 20,
      right: 10,
      bottom: 50,
      left: 60
    },
    radius: 5,
    color: 'blue',
    xVar: {
      idx: 9,
      name: "Release Season"
    }, 
    yVar: {
      idx: 8,
      name: "Rating"
    }
  }
  // get data
  let [rawData, setRawData] = useState();
  useEffect(() => {
    parseData((result) => {
    // onsole.log(result.data);
      setRawData(processData(result.data));
    })
  }, []);
  
  return (
    <div className="main">
      <div className="left w-1/5"> Filter </div>
      <div className="center">      
        {rawData && <ScatterPlot settings={settings} rawData={rawData}/>}
        <div className="c-bottom bg-gray-200">  Information </div>

      </div>
      <div className="right w-1/5"> Details ? rank? </div>
    </div>
  )
}

const processData = (data) => {
  // Here maybe add other filters 
  // call this function whenever add new filter
  let returnData = data.filter(row => row[8] > 4);
  return returnData;
}