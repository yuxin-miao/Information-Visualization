import React from "react";
import './index.css';
import * as d3 from "d3";
import { useRef, useEffect, useSpring, useState, useMemo } from "react";
import {useInterval} from '../../utils/useInterval';

import { ScatterPlot } from '../../plots/scatterPlot';


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
    xVar: "percbelowpoverty",
    yVar: "percollege"
  }
  return (
    <div className="main">
      <div className="left w-1/5"> Filter </div>
      <div className="center">      
        <ScatterPlot settings={settings}/>
        <div className="c-bottom bg-gray-200"> information </div>

      </div>
      <div className="right w-1/5"> Details ? rank? </div>
    </div>
  )
}
