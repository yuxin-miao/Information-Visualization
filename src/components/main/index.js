import React from "react";
import './index.css';
import '../../index.css'
import { useRef, useEffect, useState } from "react";

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
import { ForceGraph } from "../../plots/force";

import AutoComplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField';


import Modal from '@mui/material/Modal';

import { styled } from "@mui/styles";


import InfoButton from '../../assets/infoIconWhite3.png'

var tagsSelected = []
var typesSelected = []
var seasonsSelected = []
var contentWarningsSelected = []

const StyledAutocomplete = styled(AutoComplete)({
  "& .MuiAutocomplete-input": {
    color: "white",
  },
  "& .MuiAutocomplete-tag": {
    color: "white",
    fontWeight:"bold",
    backgroundColor:"#00BEDB",
  },

});

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
      selected: val === "Followers"
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
        className={`absolute text-white bg-1 font-ssp font-bold flex justify-end filter-header ${isFilterActive ? 'active' : ''}`}
        onClick={_ => setIsFilterActive(!isFilterActive)}
      >
        <div className='flex filter-button'>
          <p className='self-center' style={{ paddingRight: '.5vw' , fontSize:'0.9vw' }}>Filters</p>
          <img alt='' className={`self-center filter-arrow ${isFilterActive ? 'active' : ''}`} style={{ paddingRight: '1vw' }} src={FilterArrow}/>
        </div>
      </div>
      <div className={`absolute text-white bg-filter-blue rounded-br flex font-ssp filter-section ${isFilterActive ? 'active' : ''}`} style={{ fontSize: '1vw' }}>
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
          defaultValue="Followers"
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
          label="Followers"
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
        <div className='w-full flex flex-col' style={{ gap: '1vh' }}>
          <p>Types</p>
          <StyledAutocomplete
            multiple
            fullWidth            
            id="select-type"
            size="small"
            options={types}
            getOptionLabel={(option) => option.typeName}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search for types..." />
            )}
            sx={{ color: 'white' }}
            onChange={(e, value) => { typesSelected = value.map(v => { return v.typeName }); props.filterAutoCompleteOnChange() }}
          />
        </div>
        <div className='w-full flex flex-col' style={{ gap: '1vh' }}>
          <p>Released Seasons</p>
          <StyledAutocomplete
            multiple
            fullWidth
            id="select-relesedSeason"
            size="small"
            options={seasons}
            getOptionLabel={(option) => option.seasonName}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search for released season..." />
            )}
            sx={{ color: 'white' }}
            onChange={(e, value) => { seasonsSelected = value.map(v => { return v.seasonName }); props.filterAutoCompleteOnChange() }}
          />
        </div>
        <div className='w-full flex flex-col' style={{ gap: '1vh' }}>
          <p>Tags</p>
          <StyledAutocomplete
            multiple
            fullWidth
            id="select-tag"
            size="small"
            options={tags}
            getOptionLabel={(option) => option.tagName}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search for tags..." />
            )}
            sx={{ color: 'white'}}
            onChange={(e, value) => { tagsSelected = value.map(v => { return v.tagName }); props.filterAutoCompleteOnChange() }}
          />
        </div>
        <div className='w-full flex flex-col' style={{ gap: '1vh' }}>
          <div className="flex" style={{ gap: '1vw' }}>
            <p>Content Warnings</p>
            <div className="ttipm self-center">
              <img alt='' style={{ width: `${window.innerWidth * 0.01}px`, height: `${window.innerWidth * 0.01}px` }} src={InfoButton} />
              <span className="ttiptextm">Filter anime without selected content warnings</span>
            </div>
          </div>
          <StyledAutocomplete
            multiple
            fullWidth
            id="select-contentWarning"
            size="small"
            options={contentWarnings}
            getOptionLabel={(option) => option.warningName}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search for content warnings..." />
            )}
            sx={{ color: 'white' }}
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
      left: window.innerWidth * 0.035
    },
    radius: window.innerWidth * .0025,
    color: 'blue',
    xVar: {
      idx: 8,
      name: "Rating"
    },
    yVar: {

      idx: 18,
      name: "Followers"
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

  /****** setup for the searchbox search result ******/
  const [selectSuggestion, setSelectSuggestion] = useState([])

  /****** setup for the force directed graph ******/
  // ref for the wrapper of forceGraph in the original related component 
  const forceRef = useRef()
  const [forceSetting, setForceSetting] = useState({
    width: 650,
    height: 300,
    fontSize: {
      main: '0.8vw',
      related: '0.4vw',
      tag: '0.6vw',
    },
    linkDistance: 80,
    collisionRaiuds: 30,
    radiusSetting: {
      main: 15+20,
      related: 15+8,
      tag: 5,
    }
  })
    // ref for the wrapper of forceGraph in the original related component 
  const modalForceSetting =({
    width: window.innerWidth * 0.6,
    height: window.innerHeight * 0.8,
    fontSize: {
      main: '1.6vw',
      related: '1.2vw',
      tag: '0.8vw',
    },
    linkDistance: 180,
    collisionRaiuds: 60,
    radiusSetting: {
      main: 35+20,
      related:35+8,
      tag: 10,
    }
  })
  // boolean value for whether draw the graph 
  const [drawForce, setDrawForce] = useState(false)
  useEffect(() => {
    if (forceRef && forceRef.current) {
      setForceSetting({
        ...forceSetting,
        width: forceRef.current.offsetWidth * 0.94,
        height: forceRef.current.offsetHeight * 0.94,
      })
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

      // only related Anime no mange
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
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  // When user click one suggestion from the search box suggestion
  // should also clear all current selection 
  const clickSuggestion = (suggestion) => {
    const suggestionArray = []
    if (suggestion.type === "anime") {
      suggestionArray.push(String(suggestion.val))
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
    var tempName = animeName
    if (tempName[0] === ' ') {
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
    else if (name === "Followers") return 18
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


  const handleFilterOnChange = () => {
    setDisplayData(processData(constRawData))
  }

  const processData = (data) => {
    // Here maybe add other filters 
    // call this function whenever add new filter
    let returnData = data;

    // studio filter
    if (document.getElementById("select-studio").value !== "All") {
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

        <div ref={plotRef} className="row-start-2 col-span-7 m-2">
          {displayData && drawPlot && <ScatterPlot settings={plotSetting} displayData={displayData} infoDispatch={InfoDispatch} highlight={selectSuggestion} setRelatedAnime={setRelatedAnime}/>}
        </div>
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
            && <RangeSelection activeAnime={displayData.length} allAnime={constRawData} setRangeSelect={setRangeSelect} />
          }
        </ContainerBox>

        <ContainerBox title="Related" className="row-start-3 col-start-8 col-span-full m-2" >
          <div className="w-full h-full" ref={forceRef}>
            {drawForce && !open && <ForceGraph settings={forceSetting} nodes={nodes} clicked={clickRelatedAnime} inModal={false} />}
          </div>
          { nodes.length !== 0 && <div className="popup-button" onClick={handleOpen}>Open in modal</div>}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="popup-modal">
              {drawForce && <ForceGraph settings={modalForceSetting} nodes={nodes} clicked={clickRelatedAnime} inModal={true} />}
            </div>
          </Modal>
        </ContainerBox>
      </div>
    </>
  )
}

const filterWithTags = (tagString) => {
  var selectMethod = 0
  if (selectMethod === 0) {
    if (tagsSelected.length !== 0) {
      return tagsSelected.every(function (tag) {
        return tagString.includes(tag)
      });
    }
    else {
      return true;
    }
  }
  else if (selectMethod === 1) {
    if (tagsSelected.length !== 0) {
      return tagsSelected.some(function (tag) {
        return tagString.includes(tag)
      });
    }
    else {
      return true;
    }
  }
  else {
  }
}
const filterWithTypes = (typeString) => {
  if (typesSelected.length !== 0) {
    return typesSelected.some(function (type) {
      return typeString.includes(type)
    });
  }
  else {
    return true;
  }
}
const filterWithSeasons = (seasonString) => {
  if (seasonsSelected.length !== 0) {
    return seasonsSelected.some(function (season) {
      return seasonString.includes(season)
    });
  }
  else {
    return true;
  }
}
const filterWithContentWarning = (contentWarningString) => {
  if (contentWarningsSelected.length !== 0) {
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
  const animeName = data.label ? data.label : data[0][1];

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