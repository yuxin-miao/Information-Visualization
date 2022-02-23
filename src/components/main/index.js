import React, { forwardRef, useImperativeHandle } from "react";
import './index.css';
import '../../index.css'
import * as d3 from "d3";
import { useRef, useEffect, useSpring, useState, useMemo } from "react";
import { useInterval } from '../../utils/useInterval';

import { useSelector, useDispatch } from "react-redux";
import { setUrl, setTitle, setDescription, setStudio, setSeason, setReleaseYear, setType, setRank, setRating } from "../../utils/infoSlice";

import { ScatterPlot } from '../../plots/scatterPlot';
import { parseData, parseSetData } from "../../utils/fetchData";
import { extractColumn } from "../../utils/createSet"
import { SearchBox } from '../searchbox'
import { ContainerBox } from "../containerbox";
import { tags } from "../tags/tags";
import { RangeSelection } from "../rangeselect";
import { forEach } from "lodash-es";
import { Filter } from "../filter/Filter";
import { types } from "../filter/types";
import { seasons } from "../filter/seasons";
import { InfoPanel } from "../infopanel";

// Provide an onChange function on a Dropdown component to process the updated data.
const Dropdown = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.options ? props.options[0].value : "")
  useImperativeHandle(ref, () => ({
    onChange(event) {
      setValue(event.target.value)
      //console.log(event)
    }
  }))


  return (
    <div className={`${props.className ? props.className : ''} grid grid-cols-5 gap-2 text-xs`} >
      <p className="text-white font-ssp font-bold self-center col-span-2">{props.label}</p>
      <select onChange={props.onChange ? props.onChange : function (event) { setValue(event.target.value) }} value={value} className="col-start-3 col-span-full rounded text-center bg-gray-200" name={props.value} id={`select-${props.value}`}>
        {props.options ? props.options.map(val => <option key={`${props.value}-${val.value}`} value={val.value}>{val.label}</option>) : <option value="">No Selection</option>}
      </select>
    </div>
  )
})

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
      idx: 4,
      name: "Episodes"
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

  const [selectSuggestion, setSelectSuggestion] = useState([])

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
  // Test
  let [rawSetData, setRawSetData] = useState();
  useEffect(() => {
    parseSetData((result) => {
      setRawSetData(result.data);
    })
  }, [])

  // console.log(rawSetData)

  /******************** Data Filter ****************/
  // data used by range selection 
  const [rangeSelect, setRangeSelect] = useState({
    rank: [],
    episodes: [],
    year: [],
    rates: [],
  })

  let [tagsCheckedState, setTagsCheckedState] = useState(
    new Array(tags.length).fill(false)

  );
  const handleTagsOnChange = (position) => {
    const updatedCheckedState = tagsCheckedState.map((item, index) =>
      index === position ? !item : item
    );

    setTagsCheckedState(updatedCheckedState);
    console.log(tagsCheckedState);
    if (updatedCheckedState[position] === true) {
      newTagSelected(tags[position].tagName);
      // Here the input is set to be the original data, not the current display data 
      setDisplayData(processData(constRawData))
    }
    else {
      tagRemoved(tags[position].tagName);
      setDisplayData(processData(constRawData))
    }

  };
  // When user click one suggestion from the search box suggestion
  // should also clear all current selection 
  const clickSuggestion = (suggestion) => {
    const suggestionArray = []
    if (suggestion.type === "anime") {
      suggestionArray.push(String(suggestion.val))
    } else if (suggestion.type === "voice actor") {
      constRawData.forEach(row => {
        if (row[15] && row[15].includes(suggestion.val)) {
          suggestionArray.push(String(row[1]))
        }
      })
    }
    setSelectSuggestion(suggestionArray)

  }

  const dropDownRef = useRef()//dropdown ref for tag selection

  const InfoDispatch = useDispatch()
  const infoUrl = useSelector(state => state.info.url)
  const infoTitle = useSelector(state => state.info.title)
  const infoDescription = useSelector(state => state.info.description)
  const infoStudio = useSelector(state => state.info.studio)
  const infoReleaseYear = useSelector(state => state.info.releaseYear)
  const infoType = useSelector(state => state.info.type)
  const infoSeason = useSelector(state => state.info.season)
  const infoRank = useSelector(state => state.info.rank)
  const infoRating = useSelector(state => state.info.rating)

  useEffect(() => {
    // console.log('change range select', rangeSelect)
    // let tmpData = processData(displayData)
    let res = filterByRange(rangeSelect, displayData)
    setDisplayData(res)
  }, [rangeSelect])

  // global reset indicator 
  const [reset, setReset] = useState(false)
  // function executed when user click clear all, would clear all the data filters 
  const handleClearAll = () => {
    setReset(true)
    setDisplayData(constRawData)


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

      {displayData && <SearchBox rawSetData={rawSetData} animeData={extractColumn(constRawData, 1)}
        handleClickSuggestion={clickSuggestion} className="col-span-4" />}
      <ContainerBox title="Tags" className="row-start-2 col-start-1 col-span-3 ">

        <ul className="tags-list h-full w-full grid grid-cols-5 grid-rows-6 gap-2 p-5">
          {tags.map(({ tagName }, index) => {

            return (
              <li key={index} className={`text-white font-ssp self-center col-start-${index % 5 + 1} row-start-${Math.floor(index / 5) + 1}`}>
                <Checkbox name={tagName} label={tagName} onChange={() => handleTagsOnChange(index)} />
              </li>
            );
          })}
          <button type="button"
          className="text-white text-xs col-start-3 row-start-6 self-center font-ssp bg-gray-900 rounded-lg outline outline-offset-2 outline-highlight-blue"
          onClick={
            function () {
              tags.forEach(element => {
                document.getElementById("checkbox-" + element.tagName).checked = false;
              })
              tagsSelected = []
              console.log(tagsCheckedState)
              setDisplayData(processData(constRawData))
            }
          }>Clear</button>
          <Dropdown
            ref={dropDownRef}
            onChange={function (event) {
              dropDownRef.current.onChange(event)
              setDisplayData(processData(constRawData))
              console.log(event.target[event.target.value].text)
            }}
            label="Tag Selection"
            value="tagSelection"
            className="col-start-4 col-span-2 row-start-6 font-ssp self-center px-2 text-xs"
            options={[{ value: 0, label: 'Intersection' }, { value: 1, label: 'Union' }]}>
          </Dropdown>
        </ul>

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

      <div ref={plotRef} className="bg-gray-100 row-start-3 col-span-6">
        {displayData && drawPlot && <ScatterPlot settings={plotSetting} displayData={displayData} infoDispatch={InfoDispatch} highlight={selectSuggestion}/>}
      </div>

      <button className="font-ssp z-10 bg-white hover:bg-gray-100 text-gray-800 py-0.5 px-2 border border-gray-400 rounded shadow" onClick={handleClearAll}>Clear All</button>

      <ContainerBox url={infoUrl} title="Info" className="row-start-3 col-start-7 col-span-2" >
        <InfoPanel
          animeTitle={infoTitle}
          animeDescription={infoDescription}
          animeStudio={infoStudio}
          animeReleaseYear={infoReleaseYear}
          animeType={infoType}
          animeSeason={infoSeason}
          animeRank={infoRank}
          animeRating={infoRating}
        />
      </ContainerBox>
      <ContainerBox title="Range" className="row-start-4 col-span-5" >
        { displayData && constRawData 
            && <RangeSelection activeAnime={displayData.length} allAnime={constRawData} setRangeSelect={setRangeSelect} reset={reset} />
        }
      </ContainerBox>

      <ContainerBox title="Related" className="row-start-4 col-start-6 col-span-full" />
    </div>

  )
}

var tagsSelected = []
const processData = (data) => {
  // Here maybe add other filters 
  // call this function whenever add new filter
  let returnData = data.filter(row => row[8] > 1);
  returnData = returnData.filter(function (row) {
    if (row[7] !== null) {
      return filterWithTags(row[7])
    }
    else {
      return false
    }
  })
  return returnData;
}

const filterWithTags = (tagString) => {
  //console.log(document.getElementById("select-tagSelection").value+"!") 
  var selectMethod = document.getElementById("select-tagSelection").value;
  if (selectMethod == 0) {
    if (tagsSelected.length != 0) {
      return tagsSelected.every(function (tag) {
        return tagString.includes(tag)
      });
    }
    else {
      return true;
    }

  }
  else if (selectMethod == 1) {
    if (tagsSelected.length != 0) {
      return tagsSelected.some(function (tag) {
        return tagString.includes(tag)
      });
    }
    else {
      return true;
    }

  }
  else {
    console.log("wrong entry");
  }

}

const newTagSelected = (tag) => {
  tagsSelected.push(tag);
}

const tagRemoved = (tag) => {
  if (tagsSelected.includes(tag)) {
    var tempTags = [];
    tagsSelected.forEach(element => {
      if (element != tag)
        tempTags.push(element);

    });
    tagsSelected = tempTags;
  }
}

//change the name and the poster
export const refreshInfo = (data, infoDispatch) => {
  const animeName = data.label;

  var posterUrl = animeName.replace('\'', '').replace(/[^\u2018-\u2019\u4e00-\u9fa5a-zA-Z0-9]/g, '-').replaceAll("---", '-').replaceAll("--", '-').toLowerCase();
  if (posterUrl[posterUrl.length - 1] == '-') {
    posterUrl = posterUrl.slice(0, posterUrl.length - 1);
  }

  infoDispatch(setUrl("https://cdn.anime-planet.com/anime/primary/" + posterUrl + "-1.jpg"))
  infoDispatch(setTitle(animeName))
  infoDispatch(setDescription(data.description))
  infoDispatch(setStudio(data.studio))
  infoDispatch(setType(data.type))
  infoDispatch(setReleaseYear(data.releaseYear))
  infoDispatch(setSeason(data.season))
  infoDispatch(setRank(data.rank))
  infoDispatch(setRating(data.rating))
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