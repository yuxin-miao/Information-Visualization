import { useRef, useEffect, useState } from "react"
import { LineChart } from "../../plots/linechart"
import { countBy, toNumber, isNaN } from "lodash-es"
/**
 * 
 * @param activeAnime: number of animes displayed
 * @returns 
 */
export const RangeSelection = (props) => {
  const gridRef = useRef()
  const [draw, setDraw] = useState(false)
  const [settings, setSettings] = useState({
    height: window.innerHeight * 0.12,
    width: 300,
    margin: {top: 0, right: 10, bottom: 50, left: 10},
  })

  let eposideCounter = countBy(props.allAnime, o => o[4])
  let yearCounter = countBy(props.allAnime, o => o[9])
  let rateCounter = countBy(props.allAnime, o => o[8])
  
  const eposideData = Object.entries(eposideCounter).filter(item => !isNaN(toNumber(item[0]))).map(item => ({xVal: item[0], yVal: item[1]})).sort(compareNumbers)
  const yearData = Object.entries(yearCounter).filter(item => !isNaN(toNumber(item[0]))).map(item => ({xVal: toNumber(item[0]), yVal: item[1]})).sort(compareNumbers)
  const rateData = Object.entries(rateCounter).filter(item => !isNaN(toNumber(item[0]))).map(item => ({xVal: toNumber(item[0]), yVal: item[1]})).sort(compareNumbers)
  const rankData = Object.entries(props.allAnime).map(item => ({xVal: toNumber(item[0]), yVal: 1}))
  const [year, setYear] = useState([])
  const [episodes, setEpisodes] = useState([])
  const [rank, setRank] = useState([])
  const [rates, setRates] = useState([])

  /**
   * set the draw options of the line chart 
   */
  useEffect(() => {
    if (gridRef && gridRef.current) {
      setSettings({
        ...settings,
        width: gridRef.current.offsetWidth * 0.8,
      })
      setDraw(true)
    }
  }, [gridRef]);
  
  /**
   * 
   * @param {String} type: which line chart 
   * @returns when brush event end, set the corresponding selected value 
   */
  function handleEndBrush(type) {
    return (xStart, xEnd) => {
      switch (type) {
        case 'year': 
          if (xStart === -1) setYear([])
          else setYear([toNumber(xStart), toNumber(xEnd)])
          break
        case 'episodes':
          if (xStart === -1) setEpisodes([])
          else setEpisodes([toNumber(xStart), toNumber(xEnd)])
          break
        case 'rank':
          if (xStart === -1) setRank([])
          else setRank([toNumber(xStart), toNumber(xEnd)])
          break
        case 'rates':
          if (xStart === -1) setRates([])
          else setRates([toNumber(xStart), toNumber(xEnd)])
          break
        default: 
          console.log("ERROR in RANGE SELECTION")
      }
    }
  }

  /**
   * when any of the selected brush data change, change the corresponding data in parent component 
   */
  useEffect(() => {
    props.setRangeSelect({
      rank: rank,
      year: year,
      episodes: episodes,
      rates: rates,
    })
  }, [year, episodes, rank, rates])


  return (
    <div className="rangle-select h-full" style={{ padding: '1.5vh 1.5vw'}}>
      <div className="flex justify-between" style={{ fontSize: '0.7vw' }}>
        <span className="px-5 text-white font-ssp">Current number of animes displayed: <span className="text-pink">{props.activeAnime} </span>/ {props.allAnime.length}</span>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-x-10" style={{ fontSize: '0.7vw' }}>
        <div className="m-0 col-span-1 grid grid-cols-10">
          <div className="place-self-center text-white col-span-2 justify-self-end">Rank</div>   
          <div className="col-span-8" ref={gridRef}> { draw && <LineChart settings={settings} data={rankData} customized={['white', '#329EFF', 5, 'rank']} handleEndBrush={handleEndBrush('rank')} reset={props.reset}/>}</div>
        </div>
        <div className="m-0 col-span-1 grid grid-cols-10">      
          <div className="place-self-center text-white col-span-2 justify-self-end">Episodes</div>   
          <div className="col-span-8"> { draw &&<LineChart settings={settings} data={eposideData} customized={['#8E2D96', '#2A5CFF', 6, 'episodes']} handleEndBrush={handleEndBrush('episodes')} reset={props.reset}/> }</div>
        </div>
        <div className="m-0 col-span-1 grid grid-cols-10">  
          <div className="place-self-center text-white col-span-2 justify-self-end">Year</div>  
          <div className=" col-span-8"> { draw &&<LineChart settings={settings} data={yearData} customized={['#921FFF', '#667BA5', 5, 'year']} handleEndBrush={handleEndBrush('year')} reset={props.reset}/>}</div>
        </div>
        <div className="m-0 col-span-1 grid grid-cols-10">   
          <div className="place-self-center text-white col-span-2 justify-self-end">Rating</div>   
          <div className=" col-span-8"> { draw &&<LineChart settings={settings} data={rateData} customized={['#14FFAE','#FF1A1A', 8, 'rates']} handleEndBrush={handleEndBrush('rates')} reset={props.reset}/>}</div>
        </div>
      </div>
    </div>
  )
}

function compareNumbers(a, b) {
  return a.xVal - b.xVal;
}