import React, { forwardRef, useImperativeHandle } from "react";
import './index.css';
import '../../index.css'
import * as d3 from "d3";
import { useRef, useEffect, useSpring, useState, useMemo } from "react";
import { useInterval } from '../../utils/useInterval';

import FilterArrow from '../../assets/filterarrow.png'

import { useSelector, useDispatch } from "react-redux";
import { setUrl, setTitle, setDescription, setStudio, setSeason, setReleaseYear, setType, setRank, setRating, setVoiceActors, setTags, setStaff, setPosterUrl, setUserStat } from "../../utils/infoSlice";

import { ScatterPlot } from '../../plots/scatterPlot';
import { parseData, parseSetData } from "../../utils/fetchData";
import { extractColumn } from "../../utils/createSet"
import { SearchBox } from '../searchbox'
import { ContainerBox } from "../containerbox";
import { tags } from "../tags/tags";
import { RangeSelection } from "../rangeselect";
import { Filter } from "../filter/Filter";
import { types } from "../filter/types";
import { seasons } from "../filter/seasons";
import { contentWarnings } from "../filter/contentWarnings";
import { InfoPanel } from "../infopanel";
import { axis } from "../filter/axis";
import { userStats } from "../filter/userStats";
import { Dropdown } from "../dropdown";
import { Checkbox } from "../checkbox";
import { ForceGraph } from "../../plots/force";

import AutoComplete, { createFilterOptions } from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField';
import { value } from "lodash-es";
import { size } from "lodash-es";
import { fontSize } from "@mui/system";

import InfoButton from '../../assets/infobutton.png'

var tagsSelected = []
var typesSelected = []
var seasonsSelected = []
var contentWarningsSelected = []

const FilterSection = (props) => {
  const [isFilterActive, setIsFilterActive] = useState(false)

  const studioList = Filter(1).map((val, i) => {
    return {
      value: val,
      label: val,
      selected: false
    }
  })
  const axisXList = axis.map((val, i) => {
    return {
      value: val,
      label: val,
      selected: val === "Rating"
    }
  })
  const axisYList = axis.map((val, i) => {
    return {
      value: val,
      label: val,
      selected: val === "User Stats"
    }
  })
  const userStatsList = userStats.map((val, i) => {
    return {
      value: val,
      label: val,
      selected: false
    }
  })

  const studioDropdownRef = useRef()
  const xAxisDropdownRef = useRef()
  const yAxisDropdownRef = useRef()
  const userStatsDropdownRef = useRef()

  return (
    <div className="col-span-2 absolute filter-wrapper">
      <div
        className={`absolute text-white bg-filter-blue font-ssp font-bold flex justify-end filter-header ${isFilterActive ? 'active' : ''}`}
        onClick={_ => setIsFilterActive(!isFilterActive)}
      >
        <div className='flex filter-button'>
          <p className='self-center' style={{ paddingRight: '.5vw' , fontSize:'0.9vw' }}>Filters</p>
          <img className={`self-center filter-arrow ${isFilterActive ? 'active' : ''}`} style={{ paddingRight: '1vw' }} src={FilterArrow}/>
        </div>
      </div>
      <div className={`absolute text-white bg-filter-blue rounded-br font-ssp filter-section ${isFilterActive ? 'active' : ''}`} style={{ fontSize: '1vw' }}>
        <Dropdown
          label="X - Axis"
          value="x-axis"
          ref={xAxisDropdownRef}
          onChange={(event) => {
            xAxisDropdownRef.current.onChange(event)
            props.xAxisOnChange(event)
          }}
          style={{ height: '3vh' }}
          defaultValue="Rating"
          className="text-black"
          options={axisXList}
        />
        <Dropdown
          label="Y - Axis"
          value="y-axis"
          ref={yAxisDropdownRef}
          onChange={(event) => {
            yAxisDropdownRef.current.onChange(event)
            props.yAxisOnChange(event)
          }}
          style={{ height: '3vh' }}
          defaultValue="User Stats"
          className="text-black"
          options={axisYList}
        />
        <Dropdown
          label="Studio"
          value="studio"
          ref={studioDropdownRef}
          onChange={(event) => {
            studioDropdownRef.current.onChange(event)
            props.filterAutoCompleteOnChange()
          }}
          style={{ height: '3vh' }}
          className="text-black"
          options={[{ value: 'All', label: 'All', selected: true }, ...studioList]}
        />
        <Dropdown
          label="User Stats"
          value="userStats"
          ref={userStatsDropdownRef}
          onChange={(event) => {
            userStatsDropdownRef.current.onChange(event)
            props.filterAutoCompleteOnChange()
          }}
          style={{ height: '3vh' }}
          className="text-black"
          options={[{ value: 'All', label: 'All', selected: true }, ...userStatsList]}
        />
        {/* <div className='w-full flex flex-col' style={{ gap: '1vh' }}>
          <p>User Stats</p>
          <AutoComplete
            multiple
            fullWidth
            id="select-userStats"
            size="small"
            options={[
              "100,000+",
              "50,000+",
              "10,000+",
              "5,000+",
              "1,000+"
            ]}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search for user stats..." />
            )}
            sx={{ overflow: 'auto', color: 'white' }}
          />
        </div> */}
        <div className='w-full flex flex-col' style={{ gap: '1vh' }}>
          <p>Types</p>
          <AutoComplete
            multiple
            fullWidth
            id="select-type"
            size="small"
            options={types}
            getOptionLabel={(option) => option.typeName}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search for types..." />
            )}
            sx={{ overflow: 'auto', color: 'white' }}
            onChange={(e, value) => { typesSelected = value.map(v => { return v.typeName }); props.filterAutoCompleteOnChange() }}
          />
        </div>
        <div className='w-full flex flex-col' style={{ gap: '1vh' }}>
          <p>Released Seasons</p>
          <AutoComplete
            multiple
            fullWidth
            id="select-relesedSeason"
            size="small"
            options={seasons}
            getOptionLabel={(option) => option.seasonName}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search for released season..." />
            )}
            sx={{ overflow: 'auto', color: 'white' }}
            onChange={(e, value) => { seasonsSelected = value.map(v => { return v.seasonName }); props.filterAutoCompleteOnChange() }}
          />
        </div>
        <div className='w-full flex flex-col' style={{ gap: '1vh' }}>
          <p>Tags</p>
          <AutoComplete
            multiple
            fullWidth
            id="select-tag"
            size="small"
            options={tags}
            getOptionLabel={(option) => option.tagName}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search for tags..." />
            )}
            sx={{ overflow: 'auto', color: 'white' }}
            onChange={(e, value) => { tagsSelected = value.map(v => { return v.tagName }); props.filterAutoCompleteOnChange() }}
          />
        </div>
        <div className='w-full flex flex-col' style={{ gap: '1vh' }}>
          <div className="flex" style={{ gap: '1vw' }}>
            <p>Content Warnings</p>
            <div className="ttipm self-center">
              <img style={{ width: `${window.innerWidth * 0.01}px`, height: `${window.innerWidth * 0.01}px` }} src={InfoButton} />
              <span className="ttiptextm">Filter anime without selected content warnings</span>
            </div>
          </div>
          <AutoComplete
            multiple
            fullWidth
            id="select-contentWarning"
            size="small"
            options={contentWarnings}
            getOptionLabel={(option) => option.warningName}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search for content warnings..." />
            )}
            sx={{ overflow: 'auto', color: 'white' }}
            // onChange={(e,value)=>{contentWarningsSelected=value;props.filterAutoCompleteOnChange()}}
            onChange={(e, value) => { contentWarningsSelected = value.map(v => { return v.warningName }); props.filterAutoCompleteOnChange() }}
          />
        </div>
      </div>
    </div>
  )
}

export const Main = (props) => {

  /****** setup for the scatter plot ******/
  // plot settings 
  const [plotSetting, setPlotSetting] = useState({
    width: window.innerWidth * 0.5,
    height: window.innerHeight * 0.5,
    margin: {
      top: window.innerWidth * 0.003,
      right: window.innerWidth * 0.003,
      bottom: window.innerWidth * 0.035,
      left: window.innerWidth * 0.04
    },
    radius: window.innerWidth * .0025,
    color: 'blue',
    xVar: {
      idx: 8,
      name: "Rating"
    },
    yVar: {

      idx: 18,
      name: "User Stats"
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

  /****** setup for the force directed graph ******/
  // ref for the wrapper of forceGraph 
  const forceRef = useRef()
  const [forceSetting, setForceSetting] = useState({
    width: 650,
    height: 300,
  })
  // boolean value for whether draw the graph 
  const [drawForce, setDrawForce] = useState(false)
  useEffect(() => {
    if (forceRef && forceRef.current) {
      setForceSetting({
        width: forceRef.current.offsetWidth,
        height: forceRef.current.offsetHeight,
      })
      console.log(forceRef.current.offsetHeight, forceRef.current.offsetWidth)
      setDrawForce(true)
    }
  }, [forceRef])
  const [nodes, setNodes] = useState([])
  const [relateAnime, setRelatedAnime] = useState('')
  // set the data applied to Related components 
  useEffect(() => {
    if (relateAnime) {
      let animeInfo = constRawData.filter(x => x[1] === relateAnime)[0]

      let resNode = [{ "name": animeInfo[1], "type": "main" }]
      let tmpList = [];
      if (animeInfo[7]) {
        tmpList = animeInfo[7].split(",");
      }

      for (let i = 0; i < tmpList.length; i++) {
        if (tmpList[i].length !== 0) {
          resNode.push({ "name": tmpList[i], "type": "tag" })
        }
      }

      // only related Anime no mange? 
      let relatedList = []
      if (animeInfo[14]) {
        relatedList = animeInfo[14].split(",");
      }

      for (let i = 0; i < relatedList.length; i++) {
        if (relatedList[i].length !== 0) {
          resNode.push({ "name": relatedList[i], "type": "related" })
        }
      }
      setNodes(resNode)
    }
  }, [relateAnime])
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
      let setData = result.data.filter(row => row[8] >= 0)
      setData = setData.slice(0, -1)
      setConstRawData(setData);
      setDisplayData(setData);

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
  const infoVoiceActors = useSelector(state => state.info.voiceActors)
  const infoStaff = useSelector(state => state.info.staff)
  const infoUserStat = useSelector(state => state.info.userStat)
  const infoPosterUrl = useSelector(state => state.info.posterUrl)
  const infoTags = useSelector(state => state.info.tags)
  useEffect(() => {
    let res = processData(constRawData)
    setDisplayData(res)
  }, [rangeSelect])

  // global reset indicator 
  const [reset, setReset] = useState(false)
  // function executed when user click clear all, would clear all the data filters 
  const handleClearAll = () => {
    setReset(true)
    // tagsClear()
    setDisplayData(constRawData)
    document.getElementById("select-studio").value = "All"
    // document.getElementById("select-contentwarning").value = "All"
    document.getElementById("select-x-axis").value = "Rating"
    document.getElementById("select-y-axis").value = "User Stats"
    document.getElementById("select-userStats").value = "All"
    //console.log(document.getElementById("select-tag").value) 
    // setTypesCheckedState(new Array(types.length).fill(false))
    typesSelected = []
    // setSeasonsCheckedState(new Array(seasons.length).fill(false))
    seasonsSelected = []
    tagsSelected = []
    contentWarningsSelected = []

    /*setPlotSetting(
      {
        ...plotSetting,
        xVar: {
          idx: 4,
          name: "Episodes"
        },
        yVar: {

          idx: 8,
          name: "Rating"
        }
      }
    )*/

  }

  // When user click one suggestion from the search box suggestion
  // should also clear all current selection 
  const clickSuggestion = (suggestion) => {
    // setDisplayData(constRawData)
    // handleClearAll()
    const suggestionArray = []
    if (suggestion.type === "anime") {
      suggestionArray.push(String(suggestion.val))
      //console.log(constRawData.filter(row=>row[1]===suggestion.val))
      refreshInfo(constRawData.filter(row => row[1] === suggestion.val), InfoDispatch)
      setRelatedAnime(String(suggestion.val))
    } else if (suggestion.type === "voice actor") {
      constRawData.forEach(row => {
        if (row[15] && row[15].includes(suggestion.val)) {
          suggestionArray.push(String(row[1]))
        }
      })
    }
    setSelectSuggestion(suggestionArray)

  }

  // when user click ralated anime
  const clickRelatedAnime = (animeName) => {
    console.log(animeName)
    var tempName = animeName
    // setRelatedAnime(animeName)
    if (tempName[0] == ' ') {
      tempName = tempName.slice(1)
    }
    refreshInfo(constRawData.filter(x => x[1] === tempName), InfoDispatch)
  }
  /******************************Filter******************************/

  const getAxisIndex = (name) => {
    if (name === "Rating") return 8
    else if (name === "Release Year") return 9
    else if (name === "Episodes") return 4
    else if (name === "Rank") return 0
    else if (name === "User Stats") return 18
  }
  const handleXOnChange = (e) => {
    const index = getAxisIndex(e.target.value)
    setPlotSetting(
      {
        ...plotSetting,
        xVar: {
          idx: index,
          name: e.target.value
        }
      }
    )
  }

  const handleYOnChange = (e) => {
    const index = getAxisIndex(e.target.value)
    setPlotSetting(
      {
        ...plotSetting,
        yVar: {
          idx: index,
          name: e.target.value
        }
      }
    )
  }

  const handleStudioOnChange = e => {
    const value = e.target.value
    console.log(e.target)
    if (value === "All") {
      setDisplayData(constRawData)
    }
    else {
      let studios = constRawData.filter(item => item[5] === value)
      setDisplayData(studios)
    }
  }

  const handleUserStatsOnChange = e => {
    const value = e.target.value
    console.log(e.target)
    if (value === "All") {
      setDisplayData(constRawData)
    }
    else if (value === "100,000+") {
      let userStats = constRawData.filter(item => item[18] >= 100000)
      setDisplayData(userStats)
    }
    else if (value === "50,000+") {
      let userStats = constRawData.filter(item => item[18] >= 50000)
      setDisplayData(userStats)
    }
    else if (value === "10,000+") {
      let userStats = constRawData.filter(item => item[18] >= 10000)
      setDisplayData(userStats)
    }
    else if (value === "5,000+") {
      let userStats = constRawData.filter(item => item[18] >= 5000)
      setDisplayData(userStats)
    }
    else if (value === "1,000+") {
      let userStats = constRawData.filter(item => item[18] >= 1000)
      setDisplayData(userStats)
    }
  }

  // const handleContentWarnOnChange = e => {
  //   const value = e.target.value
  //   setDisplayData(
  //     constRawData.filter(item => {
  //       if (item[12] === null || !value.some(r=> item[12].includes(r))){
  //         return true
  //       }
  //       return false
  //     })
  //   )
  // }

  const [typesCheckedState, setTypesCheckedState] = useState(
    new Array(types.length).fill(false)
  );

  const handleTypeOnChange = position => {

    const updatedCheckedState = typesCheckedState.map((item, index) =>
      index === position ? !item : item
    )
    setTypesCheckedState(updatedCheckedState)
    if (updatedCheckedState[position] === true) {
      typesSelected.push(types[position].typeName)
      // Here the input is set to be the original data, not the current display data 
      setDisplayData(processData(constRawData))
    }
    else {
      typesSelected = typesSelected.filter(item => item !== types[position].typeName)
      setDisplayData(processData(constRawData))
    }
  }
  const [seasonsCheckedState, setSeasonsCheckedState] = useState(new Array(seasons.length).fill(false));

  const handleSeasonOnChange = position => {
    const updatedCheckedState = seasonsCheckedState.map((item, index) =>
      index === position ? !item : item
    )
    setSeasonsCheckedState(updatedCheckedState)
    if (updatedCheckedState[position] === true) {
      seasonsSelected.push(seasons[position].seasonName)
      // Here the input is set to be the original data, not the current display data 
      setDisplayData(processData(constRawData))
    }
    else {
      seasonsSelected = seasonsSelected.filter(item => item !== seasons[position].seasonName)
      setDisplayData(processData(constRawData))
    }
  }
  /*const handleTagsOnChange = (position) => {
    const updatedCheckedState = tagsCheckedState.map((item, index) =>
      index === position ? !item : item
    )
    setTagsCheckedState(updatedCheckedState)
    if (updatedCheckedState[position] === true) {
      tagsSelected.push(tags[position].tagName)
      // Here the input is set to be the original data, not the current display data 
      setDisplayData(processData(constRawData))
    }
    else {
      tagsSelected = tagsSelected.filter(item => item !== tags[position].tagName)
      setDisplayData(processData(constRawData))
    }

  }*/
  const handleTagsOnChange = () => {
    setDisplayData(processData(constRawData))
  }
  const handleFilterOnChange = () => {
    setDisplayData(processData(constRawData))
  }
  const tagsClear = () => {
    tags.forEach(element => {
      document.getElementById("checkbox-" + element.tagName).checked = false;
    })
    tagsSelected = []
  }
  const processData = (data) => {
    // Here maybe add other filters 
    // call this function whenever add new filter
    let returnData = data;
    //let returnData=data.filter(row=>true);

    // studio filter
    if (document.getElementById("select-studio").value != "All") {
      returnData = returnData.filter(function (row) {
        if (row[5] === document.getElementById("select-studio").value) {
          return true
        } else {
          return false
        }
      })
    }

    // user stats filter
    if (document.getElementById("select-userStats").value === "100,000+") {
      returnData = returnData.filter(function (row) {
        if (row[18] >= 100000) {
          return true
        } else {
          return false
        }
      })
    }
    else if (document.getElementById("select-userStats").value === "50,000+") {
      returnData = returnData.filter(function (row) {
        if (row[18] >= 50000) {
          return true
        } else {
          return false
        }
      })
    }
    else if (document.getElementById("select-userStats").value === "10,000+") {
      returnData = returnData.filter(function (row) {
        if (row[18] >= 10000) {
          return true
        } else {
          return false
        }
      })
    }
    else if (document.getElementById("select-userStats").value === "5,000+") {
      returnData = returnData.filter(function (row) {
        if (row[18] >= 5000) {
          return true
        } else {
          return false
        }
      })
    }
    else if (document.getElementById("select-userStats").value === "1,000+") {
      returnData = returnData.filter(function (row) {
        if (row[18] >= 1000) {
          return true
        } else {
          return false
        }
      })
    }

    //tag filter
    if (tagsSelected.length !== 0) {
      returnData = returnData.filter(function (row) {
        if (row[7] !== null) {
          return filterWithTags(row[7])
        } else {
          return false
        }
      })
    }


    //type filter
    if (typesSelected.length !== 0) {
      returnData = returnData.filter(function (row) {
        if (row[3] !== null) {
          return filterWithTypes(row[3])
        }
        else {
          return false
        }
      })
    }


    //season filter
    if (seasonsSelected.length !== 0) {
      returnData = returnData.filter(function (row) {
        if (row[6] !== null) {
          return filterWithSeasons(row[6])
        } else {
          return false
        }
      })
    }

    // content warning filter
    if (contentWarningsSelected.length !== 0) {
      returnData = returnData.filter(function (row) {
        if (row[12] !== null) {
          return filterWithContentWarning(row[12])
        }
        else {
          return true
        }
      })
    }

    returnData = filterByRange(rangeSelect, returnData)
    return returnData;
  }
  return (
    <>
      <FilterSection
        studioOnChange={handleStudioOnChange}
        xAxisOnChange={handleXOnChange}
        yAxisOnChange={handleYOnChange}
        userStatsOnChange={handleUserStatsOnChange}
        filterAutoCompleteOnChange={handleFilterOnChange}
      />


      <div className="col-start-3 col-span-full main-grid">
        {displayData && <SearchBox rawSetData={rawSetData} animeData={extractColumn(constRawData, 1)}
          handleClickSuggestion={clickSuggestion} className="col-span-4 m-2" />}
        {/* <ContainerBox title="Tags" className="row-start-2 col-start-1 col-span-4 m-2">

        <ul className="tags-list h-full w-full grid grid-cols-5 grid-rows-6 gap-2 p-5">
          {tags.map(({ tagName }, index) => {

            return (
              <li key={index} className={`text-white font-ssp self-center col-start-${index % 5 + 1} row-start-${Math.floor(index / 5) + 1}`}>
                <Checkbox name={tagName} label={tagName} onChange={() => handleTagsOnChange(index)} />
              </li>
            );
          })}
          <button type="button"
            className="text-white col-start-3 row-start-6 self-center font-ssp bg-gray-900 rounded-lg outline outline-offset-2 outline-highlight-blue"
            onClick={
              function () {
                tagsClear()
                setDisplayData(processData(constRawData))
              }
            }
            style={{ fontSize: '.7vw' }}
          >Clear</button>
          <Dropdown
            ref={dropDownRef}
            onChange={function (event) {
              dropDownRef.current.onChange(event)
              setDisplayData(processData(constRawData))
              console.log(event.target[event.target.value].text)
            }}
            label="Tag Selection"
            value="tagSelection"
            className="col-start-4 col-span-2 row-start-6 font-ssp self-center px-2"
            options={[{ value: 0, label: 'Intersection' }, { value: 1, label: 'Union' }]}>
          </Dropdown>
        </ul>

      </ContainerBox>
      <ContainerBox title="Filters" className="row-start-2 col-start-5 col-span-full filter-grid m-2 p-5">
        <div className="grid grid-cols-5 gap-2" style={{ fontSize: '.9vw' }} >
          <p className="text-white font-ssp font-bold self-center col-span-2">X - Axis</p>
          <select onChange={handleXOnChange} className="col-start-3 col-span-full rounded text-center bg-gray-200 self-center" style={{ height: '3vh' }} defaultValue="Episodes" name="x-axis" id="select-x-axis">
            {axis.map(val => <option key={`x-axis-${val}`} value={val}>{val}</option>)}
          </select>
        </div>
        <div className="row-start-4 grid grid-cols-5 gap-2" style={{ fontSize: '.9vw' }} >
          <p className="text-white font-ssp font-bold self-center col-span-2">Y - Axis</p>
          <select onChange={handleYOnChange} className="col-start-3 col-span-full rounded text-center bg-gray-200 self-center" style={{ height: '3vh' }} defaultValue="Rating" name="y-axis" id="select-y-axis">
            {axis.map(val => <option key={`y-axis-${val}`} value={val}>{val}</option>)}
          </select>
        </div>
        <div className="col-start-2 grid grid-cols-5 gap-2" style={{ fontSize: '.9vw' }} >
          <p className="text-white font-ssp font-bold self-center col-span-2">Studio</p>
          <select onChange={handleStudioOnChange} className="col-start-3 col-span-full rounded text-center bg-gray-200 self-center" style={{ height: '3vh' }} name="studio" id="select-studio">
            <option key="studio-All" value="All">All</option>
            {Filter(1).map(val => <option key={`studio-${val}`} value={val}>{val}</option>)}
          </select>
        </div>
        <div className="col-start-2 row-start-4 grid grid-cols-5 gap-2" style={{ fontSize: '.9vw' }} >
          <p className="text-white font-ssp font-bold self-center col-span-2">Content Warn</p>
          <select onChange={handleContentWarnOnChange} className="col-start-3 col-span-full rounded text-center bg-gray-200 self-center" style={{ height: '3vh' }} name="contentwarning" id="select-contentwarning">
            <option key="contentwarning-All" value="All">All</option>
            <option key="contentwarning-No" value="No">No Warning</option>
            {Filter(3).map(val => <option key={`contentwarning-${val}`} value={val}>{val}</option>)}
          </select>
        </div>
        <div className="col-start-3 col-span-full row-span-3 grid grid-cols-6 grid-rows-2 gap-2 font-ssp text-white">
          <p className="text-xs self-center justify-self-center text-center font-bold" style={{ fontSize: '.8vw' }}>Type</p>
          <Checkbox name="movie" label="Movie" checked={typesCheckedState[1]} onChange={() => handleTypeOnChange(1)} />
          <Checkbox name="music" label="Music" checked={typesCheckedState[2]} onChange={() => handleTypeOnChange(2)} />
          <Checkbox name="dvd-special" label="DVD Special" checked={typesCheckedState[0]} onChange={() => handleTypeOnChange(0)} />
          <Checkbox name="ova" label="OVA" checked={typesCheckedState[4]} onChange={() => handleTypeOnChange(4)} />
          <Checkbox className="row-start-2 col-start-2" name="tv" label="TV" checked={typesCheckedState[5]} onChange={() => handleTypeOnChange(5)} />
          <Checkbox className="row-start-2 col-start-3" name="tv-special" label="TV Special" checked={typesCheckedState[6]} onChange={() => handleTypeOnChange(6)} />
          <Checkbox className="row-start-2 col-start-4" name="web" label="Web" checked={typesCheckedState[7]} onChange={() => handleTypeOnChange(7)} />
          <Checkbox className="row-start-2 col-start-5" name="other" label="Other" checked={typesCheckedState[3]} onChange={() => handleTypeOnChange(3)} />
        </div>
        <div className="col-start-3 row-start-4 row-span-2 grid grid-cols-6 grid-rows-1 gap-2 font-ssp text-white">
          <p className="text-xs self-center justify-self-center text-center font-bold leading-8" style={{ fontSize: '.8vw' }}>Released Season</p>
          <Checkbox name="spring" label="Spring" checked={seasonsCheckedState[0]} onChange={() => handleSeasonOnChange(0)} />
          <Checkbox name="summer" label="Summer" checked={seasonsCheckedState[1]} onChange={() => handleSeasonOnChange(1)} />
          <Checkbox name="fall" label="Fall" checked={seasonsCheckedState[2]} onChange={() => handleSeasonOnChange(2)} />
          <Checkbox name="winter" label="Winter" checked={seasonsCheckedState[3]} onChange={() => handleSeasonOnChange(3)} />
        </div>
      </ContainerBox> */}
        <div ref={plotRef} className="row-start-2 col-span-7 m-2">
          {displayData && drawPlot && <ScatterPlot settings={plotSetting} displayData={displayData} infoDispatch={InfoDispatch} highlight={selectSuggestion} setRelatedAnime={setRelatedAnime} />}
        </div>
        <button className="font-ssp z-10 bg-white hover:bg-gray-100 text-gray-800 py-0.5 px-2 border border-gray-400 rounded shadow" style={{ margin: '.6vh .8vw', fontSize: '1vw' }} onClick={handleClearAll}>Clear All</button>
        <ContainerBox url={infoUrl} title="Info" className="row-start-2 col-start-8 col-span-full m-2" >
          <InfoPanel
            animeTitle={infoTitle}
            animeDescription={infoDescription}
            animeStudio={infoStudio}
            animeReleaseYear={infoReleaseYear}
            animeType={infoType}
            animeSeason={infoSeason}
            animeRank={infoRank}
            animeRating={infoRating}
            animeVoiceActors={infoVoiceActors}
            animeStaff={infoStaff}
            animePosterUrl={infoPosterUrl}
            animeUserStat={infoUserStat}
            animeTags={infoTags}
          />
        </ContainerBox>
        <ContainerBox title="Range" className="row-start-3 col-span-7 m-2" >
          {displayData && constRawData
            && <RangeSelection activeAnime={displayData.length} allAnime={constRawData} setRangeSelect={setRangeSelect} reset={reset} />
          }
        </ContainerBox>

        <ContainerBox title="Related" className="row-start-3 col-start-8 col-span-full m-2" >
          <div className="w-full h-full" ref={forceRef}>
            {drawForce && <ForceGraph settings={forceSetting} nodes={nodes} clicked={clickRelatedAnime} />}
          </div>
        </ContainerBox>
      </div>
      {/* <ContainerBox url={infoUrl} title="Info" className="row-start-2 col-start-8 col-span-full m-4" >
        <InfoPanel
          animeTitle={infoTitle}
          animeDescription={infoDescription}
          animeStudio={infoStudio}
          animeReleaseYear={infoReleaseYear}
          animeType={infoType}
          animeSeason={infoSeason}
          animeRank={infoRank}
          animeRating={infoRating}
          animeVoiceActors={infoVoiceActors}
          animeStaff={infoStaff}
          animePosterUrl={infoPosterUrl}
          animeUserStat={infoUserStat}
          animeTags={infoTags}
        />
      </ContainerBox>
      <ContainerBox title="Range" className="row-start-3 col-span-7 m-2" >
        {displayData && constRawData
          && <RangeSelection activeAnime={displayData.length} allAnime={constRawData} setRangeSelect={setRangeSelect} reset={reset} />
        }
      </ContainerBox>

      <ContainerBox title="Related" className="row-start-3 col-start-8 col-span-full m-2" >
        <div className="w-full h-full" ref={forceRef}>
            { drawForce && <ForceGraph settings={forceSetting} nodes={nodes} clicked={clickRelatedAnime} />  }
          </div> 
      </ContainerBox> */}
    </>
  )
}

const tagsClear = () => {
  tags.forEach(element => {
    document.getElementById("checkbox-" + element.tagName).checked = false;
  })
  tagsSelected = []
}
const filterWithTags = (tagString) => {
  var selectMethod = 0
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
const filterWithTypes = (typeString) => {
  if (typesSelected.length != 0) {
    return typesSelected.some(function (type) {
      return typeString.includes(type)
    });
  }
  else {
    return true;
  }
}
const filterWithSeasons = (seasonString) => {
  if (seasonsSelected.length != 0) {
    return seasonsSelected.some(function (season) {
      return seasonString.includes(season)
    });
  }
  else {
    return true;
  }
}
const filterWithContentWarning = (contentWarningString) => {
  if (contentWarningsSelected.length != 0) {
    return !contentWarningsSelected.some(function (contentWarning) {
      return contentWarningString.includes(contentWarning)
    });
  }
  else {
    return true;
  }
}



//change the name and the poster
export const refreshInfo = (rawData, infoDispatch) => {
  var data = []
  if (rawData.label) {
    data = rawData
  }
  else {
    let dataTemp = rawData[0]
    data = {
      label: dataTemp[1], // anime name
      description: dataTemp[11],
      rating: dataTemp[8],
      type: dataTemp[3],
      season: dataTemp[6],
      releaseYear: dataTemp[9],
      studio: dataTemp[5],
      rank: dataTemp[0],
      voiceActors: dataTemp[15],
      staff: dataTemp[16],
      posterUrl: dataTemp[17],
      userStat: dataTemp[18],
      tags: dataTemp[7]
    }
  }

  let tmpStaff = []
  if (data.staff) {
    tmpStaff = data.staff
    tmpStaff = data.staff.split(',')
    tmpStaff = tmpStaff.map(v => {
      let splittedVal = v.split(':')
      return {
        name: splittedVal[0].trim(),
        role: splittedVal[1].trim()
      }
    })
  }

  let tmpVA = []
  if (data.voiceActors) {
    tmpVA = data.voiceActors
    tmpVA = data.voiceActors.split(',')
    tmpVA = tmpVA.filter(v => v.includes(':'))
    tmpVA = tmpVA.map(v => {
      let splittedVal = v.split(':')
      return {
        name: splittedVal[1].trim(),
        role: splittedVal[0].trim()
      }
    })
  }
  // console.log(data.userStat)
  const animeName = data.label ? data.label : data[0][1];
  /*var posterUrl = animeName.replace('\'', '').replace(/[^\u2018-\u2019\u4e00-\u9fa5a-zA-Z0-9]/g, '-').replaceAll("---", '-').replaceAll("--", '-').toLowerCase();
  if (posterUrl[posterUrl.length - 1] == '-') {
    posterUrl = posterUrl.slice(0, posterUrl.length - 1);
  }*/
  var posterUrl = data.posterUrl

  var descriptionCleansed = data.description.replaceAll("\\xa0", ' ')
  infoDispatch(setUrl("https://cdn.anime-planet.com/anime/primary/" + posterUrl + "-1.jpg"))
  infoDispatch(setTitle(animeName))
  infoDispatch(setDescription(descriptionCleansed))
  infoDispatch(setStudio(data.studio))
  infoDispatch(setType(data.type))
  infoDispatch(setReleaseYear(data.releaseYear))
  infoDispatch(setSeason(data.season))
  infoDispatch(setRank(data.rank))
  infoDispatch(setRating(data.rating))
  infoDispatch(setVoiceActors(tmpVA))
  infoDispatch(setStaff(tmpStaff))
  infoDispatch(setPosterUrl("https://www.anime-planet.com/anime/" + posterUrl))
  infoDispatch(setUserStat(data.userStat))
  infoDispatch(setTags(data.tags))
}


const filterByRange = (rangeSelect, data) => {
  let returnData = data
  if (rangeSelect.rank.length !== 0) {
    returnData = returnData.filter(row => row[0] >= rangeSelect.rank[0] && row[0] <= rangeSelect.rank[1]);
  }
  if (rangeSelect.year.length !== 0) {
    returnData = returnData.filter(row => row[9] >= rangeSelect.year[0] && row[9] <= rangeSelect.year[1]);
  }
  if (rangeSelect.episodes.length !== 0) {
    returnData = returnData.filter(row => row[4] >= rangeSelect.episodes[0] && row[4] <= rangeSelect.episodes[1]);
  }
  if (rangeSelect.rates.length !== 0) {
    returnData = returnData.filter(row => row[8] >= rangeSelect.rates[0] && row[8] <= rangeSelect.rates[1]);
  }
  return returnData
}