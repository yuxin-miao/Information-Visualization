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
    height: 100,
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

  useEffect(() => {
    if (gridRef && gridRef.current) {
      setSettings({
        ...settings,
        width: gridRef.current.offsetWidth * 0.8
      })
      setDraw(true)
    }
  }, [gridRef]);

  return (
    <div className="rangle-select text-sm px-7 py-4">
      <div className="px-5 text-white font-ssp">  Current number of animes displayed: <span className="text-pink">{props.activeAnime} </span>/ {props.allAnime.length}</div>
      <div className="grid grid-cols-2 grid-rows-2 gap-x-10">
        <div className="m-0 col-span-1 grid grid-cols-10" ref={gridRef}>
          <div className="place-self-center text-white col-span-2 justify-self-end">Rank</div>   
          <div className="col-span-8"> { draw && <LineChart settings={settings} data={rankData} customized={['yellow', 'green', 5, 1]}/>}</div>
        </div>
        <div className="m-0 col-span-1 grid grid-cols-10">      
          <div className="place-self-center text-white col-span-2 justify-self-end">Episodes</div>   
          <div className="col-span-8"> { draw &&<LineChart settings={settings} data={eposideData} customized={['red', 'green', 6, 2]}/> }</div>
        </div>
        <div className="m-0 col-span-1 grid grid-cols-10">  
          <div className="place-self-center text-white col-span-2 justify-self-end">Year</div>  
          <div className=" col-span-8"> { draw &&<LineChart settings={settings} data={yearData} customized={['yellow', 'pink', 5, 3]}/>}</div>
        </div>
        <div className="m-0 col-span-1 grid grid-cols-10">   
          <div className="place-self-center text-white col-span-2 justify-self-end">Rates</div>   
          <div className=" col-span-8"> { draw &&<LineChart settings={settings} data={rateData} customized={['blue', 'purple', 8, 4]}/>}</div>
        </div>
      </div>
    </div>
  )
}

function compareNumbers(a, b) {
  return a.xVal - b.xVal;
}