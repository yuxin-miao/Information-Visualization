import React from "react";
import './index.css';
import '../../index.css'
import * as d3 from "d3";
import { useRef, useEffect, useSpring, useState, useMemo } from "react";
import { useInterval } from '../../utils/useInterval';

import { ScatterPlot } from '../../plots/scatterPlot';
import { parseData, parseCsv } from "../../utils/fetchData";

import { SearchBox } from '../searchbox'
import { ContainerBox } from "../containerbox";

export const Main = (props) => {

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

  const onSearchBoxSubmit = (event) => {
    event.preventDefault()
    console.log(event.target[0].value)
  }

  return (
    <div className={`${props.className ? props.className : ''} col-span-full main-grid pr-4 py-4`}>
      <SearchBox onSubmit={onSearchBoxSubmit} className="col-span-4" />
      <ContainerBox className="row-start-2 col-span-3" />
      <ContainerBox className="row-start-2 col-start-4 col-span-full" />
      <div className="bg-gray-100 row-start-3 col-span-5">
        {rawData && <ScatterPlot settings={settings} rawData={rawData} />}
      </div>
      <ContainerBox className="row-start-3 col-start-6 col-span-3" />
      <ContainerBox className="row-start-4 col-span-5" />
      <ContainerBox className="row-start-4 col-start-6 col-span-full" />
    </div>
    // <div>
    //   <div className="ml-4 w-100 flex flex-col gap-4">
    //     <SearchBox onSubmit={onSearchBoxSubmit} />
    //     <ContainerBox className="w-40 h-40 dotted" />
    //     <div className="bg-gray-100">
    //       {rawData && <ScatterPlot settings={settings} rawData={rawData} />}
    //     </div>
    //   </div>
    // </div>
  )
}

const processData = (data) => {
  // Here maybe add other filters 
  // call this function whenever add new filter
  let returnData = data.filter(row => row[8] > 4);
  return returnData;
}