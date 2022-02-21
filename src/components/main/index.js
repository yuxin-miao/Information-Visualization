import React from "react";
import './index.css';
import '../../index.css'
import * as d3 from "d3";
import { useRef, useEffect, useSpring, useState, useMemo } from "react";
import { useInterval } from '../../utils/useInterval';

import { ScatterPlot } from '../../plots/scatterPlot';
import { parseData, parseSetData } from "../../utils/fetchData";
import{extractColumn} from "../../utils/createSet"
import { SearchBox } from '../searchbox'
import { ContainerBox } from "../containerbox";
import { tags } from "../tags/tags";
import { RangeSelection } from "../rangeselect";



// Provide an onChange function on a Dropdown component to process the updated data.
const Dropdown = (props) => {
  const [value, setValue] = useState(props.options ? props.options[0].value : "")
  const onChange = (event) => {
    setValue(event.target.value)
  }

  return (
    <div className={`${props.className ? props.className : ''} grid grid-cols-5 gap-2 text-xs`} >
      <p className="text-white font-ssp font-bold self-center col-span-2">{props.label}</p>
      <select onChange={props.onChange ? props.onChange : onChange} value={value} className="col-start-3 col-span-full rounded text-center bg-gray-200" name={props.value} id={`select-${props.value}`}>
        {props.options ? props.options.map(val => <option key={`${props.value}-${val.value}`} value={val.value}>{val.label}</option>) : <option value="">No Selection</option>}
      </select>
    </div>
  )
}

// Provide an onSubmit prop on the Range component to process the input data.
const Range = (props) => {
  const [lowRange, setLowRange] = useState('')
  const [highRange, setHighRange] = useState('')

  return (
    <div className={`${props.className ? props.className : ""} grid grid-cols-5 gap-2 font-ssp text-xs`}>
      <p className="text-white self-center col-span-2">Range</p>
      <form className="col-start-3 col-span-full grid gap-2 grid-cols-5" onSubmit={props.onSubmit}>
        <input className="rounded col-span-2 text-center" type="text" value={lowRange} onChange={event => setLowRange(event.target.value)}></input>
        <span className="text-white col-start-3 justify-self-center">-</span>
        <input className="rounded col-start-4 col-span-full text-center" type="text" value={highRange} onChange={event => setHighRange(event.target.value)}></input>
      </form>
    </div>
  )
}

// Provide an onChange function on a Checkbox component to process the updated data.
const Checkbox = (props) => {
  return (
    <div className={`${props.className ? props.className : ''} justify-self-center flex w-full gap-2`}>
      <input className="self-center" type='checkbox' id={`checkbox-${props.name}`} name={`${props.name}`} onChange={props.onChange} />
      <label className="self-center text-xs">{props.label}</label>
    </div>
  )
}
export const Main = (props) => {

  /****** setup for the scatter plot ******/
  // plot settings 
  const [plotSetting, setPlotSetting] = useState({
    width: 650,
    height: 300,
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
  })
  // boolean value for whether draw the scatterplot 
  const [drawPlot, setDrawPlot] = useState(false)
  // ref for the wrapper of scatterplot 
  const plotRef = useRef()
  // set up the width and height of svg when first draw 
  useEffect(() => {
    if (plotRef && plotRef.current) {
      setPlotSetting({
        ...plotSetting,
        width: plotRef.current.offsetWidth,
        height: plotRef.current.offsetHeight
      })
      setDrawPlot(true)
    }
  }, [plotRef]);


  const [selectSuggestion, setSelectSuggestion] = useState('')

  /******************** Data Prepare ****************/
  // const rawData, delete the first row 
  let [constRawData, setConstRawData] = useState()
  // data used for display
  let [displayData, setDisplayData] = useState(); 
  // download the data only when first mount 
  // when need to filter the displaydata, set it again, no need to parse it again
  useEffect(() => {
    parseData((result) => {
      result.data.shift() // first row is header, delete it here 
      setConstRawData(result.data);
      setDisplayData(processData(result.data));

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

  /******************** Data Filter ****************/
  // data used by range selection 
  const [rangeSelect, setRangeSelect] = useState({
    rank: [],
    episodes: [],
    year: [],
    rates: [],
  })
  const onSearchBoxSubmit = (event) => {
    console.log(event.target[0].value)
  }

  const [tagsCheckedState, setTagsCheckedState] = useState(
    new Array(tags.length).fill(true)
  );
  const handleTagsOnChange = (position) => {
    const updatedCheckedState = tagsCheckedState.map((item, index) =>
      index === position ? !item : item
    );

    setTagsCheckedState(updatedCheckedState);

    /*updatedCheckedState.reduce((currentState, index)=>{
      if(currentState===true)
      {
        console.log(tags[index].tagName);
      }
    });*/
    if(updatedCheckedState[position]===true)
    {
      //console.log(tags[position].tagName);
      newTagSelected(tags[position].tagName);
      console.log(tagsSelected);

      // Here the input is set to be the original data, not the current display data 
      setDisplayData(processData(constRawData))
      //   parseData((result) => {
      //     // onsole.log(result.data);
      //   //console.log(processData(result.data));
      //   setRawData(processData(result.data));//how to refresh?
      //   console.log(rawData);

        
      //   })
     
      
    }
    //console.log();    

  };

  const clickSuggestion = (suggestion) => {
    console.log(suggestion)
  }

  useEffect(() => {
    console.log('change range select', rangeSelect)
    setDisplayData(filterByRange(rangeSelect, displayData))
  }, [rangeSelect])

  return (
    <div className={`${props.className ? props.className : ''} col-span-full main-grid pr-4 py-4`}>

      {displayData && <SearchBox onSubmit={onSearchBoxSubmit} rawSetData={rawSetData} animeData={extractColumn(constRawData, 1)} 
                  handleClickSuggestion={clickSuggestion} className="col-span-4" />}
      <ContainerBox title="Tags" style={{height:500}} className="row-start-2 col-start-1 col-span-3 ">
        <div className="row-start-1 col-span-full" style={{overflowY: 'scroll',height:300}}>
        <ul className="tags-list">
        {tags.map(({ tagName }, index) => {

            return (
              <li key={index}>
                <div className="tags-list-item text-white">
                  <Checkbox name={tagName} label={tagName} onChange={()=>handleTagsOnChange(index)} />
                </div>
              </li>
            );

          
        })}
        </ul>
        </div>

      </ContainerBox>
      <ContainerBox title="Filters" className="row-start-2 col-start-4 col-span-full filter-grid p-5">
        <Dropdown
          label="X - Axis"
          value="x-axis"
          options={[{ value: 0, label: 'Option 0' }, { value: 1, label: 'Option 1' }]}
        />
        <Range className="row-start-2" />
        <Dropdown
          onChange={e => console.log(e)}
          className="row-start-4"
          label="Y - Axis"
          value="y-axis"
          options={[{ value: 0, label: 'Option 0' }, { value: 1, label: 'Option 1' }]}
        />
        <Range className='row-start-5' />
        <Dropdown
          className="col-start-2"
          label="Studio"
          value="studio"
          options={[{ value: 0, label: 'Option 0' }, { value: 1, label: 'Option 1' }]}
        />
        <Dropdown
          className="col-start-2 row-start-2"
          label="Voice Actor"
          value="voiceactor"
          options={[{ value: 0, label: 'Option 0' }, { value: 1, label: 'Option 1' }]}
        />
        <Dropdown
          className="col-start-2 row-start-4"
          label="Content Warn"
          value="contentwarning"
          options={[{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }]}
        />
        <div className="col-start-3 col-span-full row-span-3 grid grid-cols-6 grid-rows-2 gap-2 font-ssp text-white">
          <p className="text-xs self-center justify-self-center text-center font-bold">Type</p>
          <Checkbox name="dvd" label="DVD" />
          <Checkbox name="special" label="Special" />
          <Checkbox name="movie" label="Movie" />
          <Checkbox name="music" label="Music" />
          <Checkbox name="video" label="Video" />
          <Checkbox className="row-start-2 col-start-2" name="other" label="Other" />
          <Checkbox className="row-start-2 col-start-3" name="ova" label="OVA" />
          <Checkbox className="row-start-2 col-start-4" name="tv" label="TV" />
          <Checkbox className="row-start-2 col-start-5" name="tv-special" label="TV Special" />
          <Checkbox className="row-start-2 col-start-6" name="web" label="Web" />
        </div>
        <div className="col-start-3 row-start-4 row-span-2 grid grid-cols-6 grid-rows-1 gap-2 font-ssp text-white">
          <p className="text-xs self-center justify-self-center text-center font-bold">Related Season</p>
          <Checkbox name="all-season" label="All" />
          <Checkbox name="spring" label="Spring" />
          <Checkbox name="summer" label="Summer" />
          <Checkbox name="autumn" label="Autumn" />
          <Checkbox name="winter" label="Winter" />
        </div>
    </ContainerBox>

      <div ref={plotRef} className="bg-gray-100 row-start-3 col-span-5">
        {displayData && drawPlot && <ScatterPlot settings={plotSetting} displayData={displayData} />}
      </div>

      <ContainerBox title="Range" className="row-start-4 col-span-5" >
        { displayData && constRawData 
            && <RangeSelection activeAnime={displayData.length} allAnime={constRawData} setRangeSelect={setRangeSelect} />
        }
      </ContainerBox>


      <ContainerBox title="Related" className="row-start-4 col-start-6 col-span-full" />
    </div>
    
  )
}
const tagsSelected=[]
const processData = (data) => {
  // Here maybe add other filters 
  // call this function whenever add new filter
  let returnData = data.filter(row => row[8] > 4);
  returnData=returnData.filter(function (row){
    if(row[7]!==null)
    {return filterWithTags(row[7])}
    else
    {return false}
  })
  return returnData;
}
const filterWithTags=(tagString)=>{
  
  return tagsSelected.every(function (tag){
    return tagString.includes(tag)
  });
}
const newTagSelected=(tag)=>{
  tagsSelected.push(tag);
}
//change the name and the poster
export const refreshInfo = (name) => {

  const animeName = name;
  document.getElementById("animeName").textContent = animeName;
  //var posterUrl=animeName.replace('Conan (.*?):','');
  var posterUrl = animeName.replace('\'', '').replace(/[^\u2018-\u2019\u4e00-\u9fa5a-zA-Z0-9]/g, '-').replaceAll("---", '-').replaceAll("--", '-').toLowerCase();
  console.log(posterUrl[posterUrl.length - 1]);
  if (posterUrl[posterUrl.length - 1] == '-') {
    posterUrl = posterUrl.slice(0, posterUrl.length - 1);
  }

  document.getElementById("animePoster").src = "https://cdn.anime-planet.com/anime/primary/" + posterUrl + "-1.jpg";
  console.log(animeName);
  console.log(posterUrl);

}


const filterByRange = (rangeSelect, data) => {
  let returnData = data
  if(rangeSelect.rank.length !== 0) {
    returnData = returnData.filter(row => row[0] >= rangeSelect.rank[0] && row[0] <= rangeSelect.rank[1]);
  }
  if(rangeSelect.year.length !== 0) {
    returnData = returnData.filter(row => row[9] >= rangeSelect.year[0] && row[9] <= rangeSelect.year[1]);
  }
  if(rangeSelect.episodes.length !== 0) {
    returnData = returnData.filter(row => row[4] >= rangeSelect.episodes[0] && row[4] <= rangeSelect.episodes[1]);
  }
  if(rangeSelect.rates.length !== 0) {
    returnData = returnData.filter(row => row[8] >= rangeSelect.rates[0] && row[8] <= rangeSelect.rates[1]);
  }
  return returnData
}