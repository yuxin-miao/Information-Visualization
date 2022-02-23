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
import { forEach } from "lodash-es";
import { Filter } from "../filter/Filter";
import { types } from "../filter/types";
import { seasons } from "../filter/seasons";


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
      <input className="self-center" type='checkbox' id={`checkbox-${props.name}`} name={`${props.name}`} checked={props.checked}  onChange={props.onChange} />
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
  let [constRawData, setConstRawData] = useState();
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

  // console.log(displayData)

  // When other components need data, import it 
  // So no need to papaparse everytime
  let [rawSetData, setRawSetData] = useState();
  useEffect(() => {
    parseSetData((result) => {
      setRawSetData(result.data);
    })
  }, [])

  // console.log(rawSetData)

  /******************** Data Filter ****************/
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

  /******************************Filter******************************/
  // const handleContentWarnOnChange = event => {
  //   this.setState({ contentWarn: event.target.value });
  // };

  // const [filteredDatas, setFilteredDatas] = useState([])
  // setFilteredDatas(constRawData)

  const handleStudioOnChange = e => {
    const value = e.target.value
    // console.log(value)
    setDisplayData(
      constRawData.filter(item => {
        if (item[5] === value) {
          return true
        }
        return false
      })
    )
  }

  // const handleVoiceActorOnChange = e => {
  //   const value = e.target.value
  //   setDisplayData(
  //     constRawData.filter(item => {
  //       if (item[15].includes(value)) {
  //         return true
  //       }
  //       return false
  //     })
  //   )
  // }

  const handleContentWarnOnChange = e => {
    const value = e.target.value
    setDisplayData(
      constRawData.filter(item => {
        if (item[12] != null && item[12].includes(value) || value === "No" && item[12] === null){
          return true
        }
        return false
      })
    )
  }

  const [typesCheckedState, setTypesCheckedState] = useState(
    new Array(8).fill(true)
  );

  const handleTypeOnChange = position => {
    
    const updatedCheckedState = typesCheckedState.map((item, index) => index === position ? !item : item)
    setTypesCheckedState(updatedCheckedState)

    // const unique = Filter(0)
    let newTypesSelected = []
    for (let i = 0; i < 8; i++) {
      if (typesCheckedState[i] === true) {
        newTypesSelected.push(types[i].typeName)
      }
    }
    setDisplayData(
      constRawData.filter(item => {
        if (item[3] != null) {
          if (newTypesSelected.includes(item[3].trim())) {
            return true
          }
        }
        return false
      })
    )
    // console.log(displayData)
  }

  const [seasonsCheckedState, setSeasonsCheckedState] = useState(new Array(5).fill(true));

  const handleSeasonOnChange = position => {
    if (position === 0 && seasonsCheckedState[0] === false) {
      setSeasonsCheckedState([true, true, true, true, true])
      setDisplayData(constRawData)
    }
    else {
      let newSeasonsSelected = []
      if (position === 0 && seasonsCheckedState[0] === true) {
        setSeasonsCheckedState([false, true, true, true, true])
        for (let i = 1; i < 5; i++) {
          newSeasonsSelected.push(seasons[i].seasonName)
        }
      }
      else {
        const updatedCheckedState = seasonsCheckedState.map((item, index) => index === position ? !item : item)
        updatedCheckedState[0] = false
        setSeasonsCheckedState(updatedCheckedState)
        for (let i = 1; i < 5; i++) {
          if (seasonsCheckedState[i] === true) {
            newSeasonsSelected.push(seasons[i].seasonName)
          }
        }
      }
      setDisplayData(
        constRawData.filter(item => {
          if (item[6] != null) {
            if (newSeasonsSelected.includes(item[6].trim())) {
              return true
            }
          }
          return false
        })
      )
    }
    // console.log(displayData)
  }

  // const getUnique = (filterIndex) => {
  //   const optionList = [];
  //   // const unique = []
  //   // for (let i = 0; i < constRawData.length; i++){
  //   //   unique.push(constRawData[i][index])
  //   // }
  //   // constRawData.forEach(data => {
  //   //   unique.push(data[index])
  //   // })

  //   // const unique = constRawData.map(data => data[filterIndex])
  //   // unique = [...new Set(unique)]
  //   // unique.forEach((el, n) => {
  //   //   optionList.push({value:n, label:el})
  //   // })
  //   // useEffect(() => {parseData((result) => {
  //   //   result.data.shift() // first row is header, delete it here 
  //   //   setFilterDatas(result.data);
  //   // })
  //   constRawData.forEach(e => {
  //     if (!optionList.includes(e[filterIndex])) {
  //       optionList.push(e[filterIndex])
  //     }
  //   });
  //   console.log(optionList);
  //   return optionList;
  //   // console.log(unique)
  //   // const unique = constRawData
  //   //   .map(e => e[index])
  //   //   .filter(e => constRawData[e])
  //   //   .map(e => constRawData[e]);
  //   // return unique;
  //   // let x = 0
  //   // unique.forEach(item => {
  //   //   optionList.push({value:x, label:item[index]})
  //   //   x++
  //   // });
  //   // console.log(optionList)
  //   // return optionList
  // };

  // const getUnique = (arr, index) => {
  //   const unique = arr
  //     //store the comparison values in array
  //     .map(e => e[index])

  //     // store the keys of the unique objects
  //     .map((e, i, final) => final.indexOf(e) === i && i)

  //     // eliminate the dead keys & store unique objects
  //     .filter(e => arr[e])

  //     .map(e => arr[e]);

  //   return unique;
  // }

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
        {/* <Dropdown
          className="col-start-2"
          label="Studio"
          value="studio"
          // options={getUnique(5)}
          options={list}
          onChange={handleStudioOnChange}
        /> */}
        <div className="col-start-2 grid grid-cols-5 gap-2 text-xs" >
          <p className="text-white font-ssp font-bold self-center col-span-2">Studio</p>
          {/* <select onChange={handleStudioOnChange} value={props.options[0].value} className="col-start-3 col-span-full rounded text-center bg-gray-200" name="studio" id="select-studio"> */}
          <select onChange={handleStudioOnChange} className="col-start-3 col-span-full rounded text-center bg-gray-200" name="studio" id="select-studio">
            {Filter(1).map(val => <option key={`studio-${val}`} value={val}>{val}</option>)}
          </select>
        </div>
        {/* <Dropdown
          className="col-start-2 row-start-2"
          label="Voice Actor"
          value="voiceactor"
          options={[{ value: 0, label: 'Option 0' }, { value: 1, label: 'Option 1' }]}
          onChange={handleVoiceActorOnChange}
        />*/}
        {/* <Dropdown
          className="col-start-2 row-start-4"
          label="Content Warn"
          value="contentwarning"
          options={[{ value: 'No', label: 'No' }, { value: 'Yes', label: 'Yes' }]}
          onChange={handleContentWarnOnChange}
        /> */}
        <div className="col-start-2 row-start-4 grid grid-cols-5 gap-2 text-xs" >
          <p className="text-white font-ssp font-bold self-center col-span-2">Content Warn</p>
          <select onChange={handleContentWarnOnChange} className="col-start-3 col-span-full rounded text-center bg-gray-200" name="contentwarning" id="select-contentwarning">
            {/* {rawSetData[3].forEach(el => {<option key={`contentwarning-${el}`} value={el}>{el}</option>})} */}
            <option key="studio-No" value="No">No</option>
            {Filter(3).map(val => <option key={`studio-${val}`} value={val}>{val}</option>)}
          </select>
        </div>
        {/* <select
          className="col-start-2 row-start-4"
          label="Content Warn"
          value="contentwarning"
          // onChange={handleContentWarnOnChange()}
        >
          {getUnique(constRawData, 12).map(item => (
            <option value={item[12]}>
              {item[12]}
            </option>
          ))}
        </select> */}
        <div className="col-start-3 col-span-full row-span-3 grid grid-cols-6 grid-rows-2 gap-2 font-ssp text-white">
          <p className="text-xs self-center justify-self-center text-center font-bold">Type</p>
          {/* <Checkbox name="dvd" label="DVD" onChange={() => handleTypeOnChange(0)}/>
          <Checkbox name="special" label="Special" onChange={() => handleTypeOnChange(5)}/> */}
          <Checkbox name="movie" label="Movie" checked={typesCheckedState[1]} onChange={() => handleTypeOnChange(1)}/>
          <Checkbox name="music" label="Music" checked={typesCheckedState[2]} onChange={() => handleTypeOnChange(2)}/>
          <Checkbox name="dvd-special" label="DVD Special" checked={typesCheckedState[0]} onChange={() => handleTypeOnChange(0)}/>
          {/* <Checkbox className="row-start-2 col-start-2" name="other" label="Other" onChange={() => handleTypeOnChange(2)}/>
          <Checkbox className="row-start-2 col-start-3" name="ova" label="OVA" onChange={() => handleTypeOnChange(3)}/>
          <Checkbox className="row-start-2 col-start-4" name="tv" label="TV" onChange={() => handleTypeOnChange(4)}/>
          <Checkbox className="row-start-2 col-start-5" name="tv-special" label="TV Special" onChange={() => handleTypeOnChange(5)}/>
          <Checkbox className="row-start-2 col-start-6" name="web" label="Web" onChange={() => handleTypeOnChange(7)}/> */}
          <Checkbox name="ova" label="OVA" checked={typesCheckedState[4]} onChange={() => handleTypeOnChange(4)}/>
          <Checkbox className="row-start-2 col-start-2" name="tv" label="TV" checked={typesCheckedState[5]} onChange={() => handleTypeOnChange(5)}/>
          <Checkbox className="row-start-2 col-start-3" name="tv-special" label="TV Special" checked={typesCheckedState[6]} onChange={() => handleTypeOnChange(6)}/>
          <Checkbox className="row-start-2 col-start-4" name="web" label="Web" checked={typesCheckedState[7]} onChange={() => handleTypeOnChange(7)}/> 
          <Checkbox className="row-start-2 col-start-5" name="other" label="Other" checked={typesCheckedState[3]} onChange={() => handleTypeOnChange(3)}/>
        </div>
        <div className="col-start-3 row-start-4 row-span-2 grid grid-cols-6 grid-rows-1 gap-2 font-ssp text-white">
          <p className="text-xs self-center justify-self-center text-center font-bold">Related Season</p>
          <Checkbox name="all-season" checked={seasonsCheckedState[0]} label="All" onChange={() => handleSeasonOnChange(0)}/>
          <Checkbox name="spring" label="Spring" checked={seasonsCheckedState[2]} onChange={() => handleSeasonOnChange(2)}/>
          <Checkbox name="summer" label="Summer" checked={seasonsCheckedState[3]} onChange={() => handleSeasonOnChange(3)}/>
          <Checkbox name="fall" label="Fall" checked={seasonsCheckedState[1]} onChange={() => handleSeasonOnChange(1)}/>
          <Checkbox name="winter" label="Winter" checked={seasonsCheckedState[4]} onChange={() => handleSeasonOnChange(4)}/>
        </div>
    </ContainerBox>

      <div ref={plotRef} className="bg-gray-100 row-start-3 col-span-5">
        {displayData && drawPlot && <ScatterPlot settings={plotSetting} displayData={displayData} />}
      </div>

            <ContainerBox title="Info" className="row-start-3 col-start-6 col-span-3" >
      <div className="col-start-6 row-start-3 row-span-2 text-white">
        <p id="animeName" className="text-m justify-self-center text-center font-bold">Name</p>        
        <img id="animePoster" className="align-self-center justify-self-center" src="https://cdn.anime-planet.com/anime/primary/fairy-tail-1.jpg" />
      </div>
      </ContainerBox>
      <ContainerBox title="Range" className="row-start-4 col-span-5" >
        {displayData && constRawData && <RangeSelection activeAnime={displayData.length} allAnime={constRawData} />}
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
