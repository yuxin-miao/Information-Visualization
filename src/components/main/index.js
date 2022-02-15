import React from "react";
import './index.css';
import * as d3 from "d3";
import { useRef, useEffect, useSpring, useState, useMemo } from "react";
import { useInterval } from '../../utils/useInterval';

import { ScatterPlot } from '../../plots/scatterPlot';
import { parseData, parseSetData } from "../../utils/fetchData";
import{extractColumn} from "../../utils/createSet"
import { SearchBox } from '../searchbox'

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
  let [constRawData, setConstRawData] = useState();
  const [selectSuggestion, setSelectSuggestion] = useState('')
  // get data
  let [rawData, setRawData] = useState(); // used for display 
  useEffect(() => {
    parseData((result) => {
      // onsole.log(result.data);
      setConstRawData(result.data);
      setRawData(processData(result.data));
    })
  }, []);

  // When other components need data, import it 
  // So no need to papaparse everytime
  let [rawSetData, setRawSetData] = useState();
  useEffect(() => {
    parseSetData((result) => {
      setRawSetData(result.data);
    })
  }, [])

  const onSearchBoxSubmit = (event) => {
    console.log(event.target[0].value)
  }

  const clickSuggestion = (suggestion) => {
    console.log(suggestion)
  }

  return (
    <div>
      <div className="w-100 flex flex-col">
          {rawData && <SearchBox onSubmit={onSearchBoxSubmit} rawSetData={rawSetData} animeData={extractColumn(constRawData, 1)} 
                      handleClickSuggestion={clickSuggestion}/>}
        <div className="bg-gray-100">
          {rawData && <ScatterPlot settings={settings} rawData={rawData} />}
        </div>
      </div>
    </div>
  )
}

const processData = (data) => {
  // Here maybe add other filters 
  // call this function whenever add new filter
  let returnData = data.filter(row => row[8] > 4);
  return returnData;
}