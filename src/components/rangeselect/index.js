import { useRef, useEffect, useState } from "react"
import { LineChart } from "../../plots/linechart"
import { countBy, toNumber, isNaN, isNumber } from "lodash-es"
/**
 * 
 * @param activeAnime: number of animes displayed
 * @returns 
 */
export const RangeSelection = (props) => {
  const gridRef = useRef()
  const [draw, setDraw] = useState(false)
  const [settings, setSettings] = useState({
    height: 80,
    width: 300,
    margin: {top: 0, right: 10, bottom: 50, left: 10}
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
        width: gridRef.current.offsetWidth
      })
      setDraw(true)
    }
  }, [gridRef]);

  return (
    <div className="rangle-select px-7 py-4">
      <div className="px-5 text-white text-sm font-ssp">  Current number of animes displayed: <span className="text-pink">{props.activeAnime} </span>/ 18000</div>
      <div className="grid grid-cols-2 grid-rows-2 gap-0">
        <div className="rank m-0 col-span-1" ref={gridRef}>   
          { draw &&  <LineChart settings={settings} data={rankData}/>}
        </div>
        <div className="eposide m-0 col-span-1">      
          { draw &&<LineChart settings={settings} data={eposideData}/> }
        </div>
        <div className="year m-0 col-span-1">      
          { draw &&<LineChart settings={settings} data={yearData}/>}
        </div>
        <div className="rate m-0 col-span-1">      
          { draw &&<LineChart settings={settings} data={rateData}/>}
        </div>
      </div>
    </div>
  )
}

function compareNumbers(a, b) {
  return a.xVal - b.xVal;
}